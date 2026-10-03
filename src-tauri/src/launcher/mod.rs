//! Native launcher state. Game webviews cannot invoke launcher management commands.
mod models;
pub mod releases;
pub mod saves;
pub use models::*;
use std::{
    fs::{self, File, OpenOptions},
    io::{Read, Seek, SeekFrom, Write},
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    sync::Mutex,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::{Manager, WebviewWindow};
use tauri_plugin_dialog::DialogExt;
use tauri_plugin_opener::OpenerExt;

pub const IDENTIFIER: &str = "com.zero.gardendless";
pub fn is_flatpak() -> bool {
    std::env::var_os("FLATPAK_ID").is_some()
}
pub fn now() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap_or_default()
        .as_millis() as u64
}
fn new_id() -> String {
    format!(
        "p{:x}",
        SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .unwrap_or_default()
            .as_nanos()
    )
}
pub fn valid_id(id: &str) -> bool {
    !id.is_empty() && id.len() <= 64 && id.bytes().all(|c| c.is_ascii_alphanumeric() || c == b'-')
}
pub fn require_launcher(window: &WebviewWindow) -> Result<(), String> {
    if window.label() != "launcher" {
        return Err("This action is available only in the launcher.".into());
    }
    Ok(())
}
/// Read the desktop's Material scheme without invoking Quickshell or changing its state.
#[tauri::command]
pub fn launcher_caelestia_scheme(
    window: WebviewWindow,
) -> Result<Option<serde_json::Value>, String> {
    require_launcher(&window)?;
    #[cfg(target_os = "linux")]
    {
        let state = std::env::var_os(if is_flatpak() {
            "HOST_XDG_STATE_HOME"
        } else {
            "XDG_STATE_HOME"
        })
        .map(PathBuf::from)
        .or_else(|| std::env::var_os("HOME").map(|home| PathBuf::from(home).join(".local/state")));
        let Some(path) = state.map(|dir| dir.join("caelestia/scheme.json")) else {
            return Ok(None);
        };
        let bytes = match fs::read(path) {
            Ok(bytes) => bytes,
            Err(error)
                if error.kind() == std::io::ErrorKind::NotFound
                    || error.kind() == std::io::ErrorKind::PermissionDenied =>
            {
                return Ok(None)
            }
            Err(error) => return Err(error.to_string()),
        };
        if bytes.len() > 64 * 1024 {
            return Err("Caelestia scheme is unexpectedly large".into());
        }
        serde_json::from_slice(&bytes)
            .map(Some)
            .map_err(|error| error.to_string())
    }
    #[cfg(not(target_os = "linux"))]
    {
        Ok(None)
    }
}
#[tauri::command]
pub fn launcher_gpnext_packages(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
) -> Result<Vec<String>, String> {
    require_launcher(&window)?;
    if !valid_id(&profile_id) {
        return Err("Invalid profile".into());
    }
    if !app
        .state::<LauncherStore>()
        .library
        .lock()
        .map_err(|e| e.to_string())?
        .profiles
        .iter()
        .any(|p| p.id == profile_id)
    {
        return Err("Unknown profile".into());
    }
    let root = app
        .path()
        .data_dir()
        .map_err(|e| e.to_string())?
        .join(if profile_id == "default" {
            IDENTIFIER.into()
        } else {
            format!("{IDENTIFIER}.profile.{profile_id}")
        })
        .join("gp-next/packs");
    let entries = match fs::read_dir(root) {
        Ok(entries) => entries,
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => return Ok(Vec::new()),
        Err(error) => return Err(error.to_string()),
    };
    let mut names = Vec::new();
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        if name.starts_with('.') || name.len() > 128 {
            continue;
        }
        let Ok(kind) = entry.file_type() else {
            continue;
        };
        if kind.is_dir() || kind.is_file() && name.to_ascii_lowercase().ends_with(".zip") {
            names.push(name);
        }
    }
    names.sort_unstable_by_key(|name| name.to_ascii_lowercase());
    names.truncate(300);
    Ok(names)
}
pub fn data_root(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    app.path()
        .data_dir()
        .map(|p| p.join(IDENTIFIER).join("launcher"))
        .map_err(|e| e.to_string())
}
/// Keep the original destination intact if a Windows rename cannot replace it.
fn persist(path: &Path, library: &Library) -> Result<(), String> {
    let temp = path.with_extension("tmp");
    let bytes = serde_json::to_vec_pretty(library).map_err(|e| e.to_string())?;
    let mut file = File::create(&temp).map_err(|e| e.to_string())?;
    file.write_all(&bytes)
        .and_then(|_| file.sync_all())
        .map_err(|e| e.to_string())?;
    drop(file);
    #[cfg(target_os = "windows")]
    if path.exists() {
        let backup = path.with_extension("backup");
        if backup.exists() {
            fs::remove_file(&backup).map_err(|e| e.to_string())?;
        }
        fs::rename(path, &backup).map_err(|e| e.to_string())?;
        if let Err(e) = fs::rename(&temp, path) {
            let _ = fs::rename(&backup, path);
            return Err(e.to_string());
        }
        return Ok(());
    }
    fs::rename(temp, path).map_err(|e| e.to_string())
}
struct Session {
    child: Child,
    info: RunningGame,
}
pub struct LauncherStore {
    path: PathBuf,
    library: Mutex<Library>,
    session: Mutex<Option<Session>>,
    _lock: File,
}
impl LauncherStore {
    pub fn new(app: &tauri::AppHandle) -> Result<Self, String> {
        let root = data_root(app)?;
        fs::create_dir_all(&root).map_err(|e| e.to_string())?;
        let lock = OpenOptions::new()
            .create(true)
            .truncate(false)
            .read(true)
            .write(true)
            .open(root.join("launcher.lock"))
            .map_err(|e| e.to_string())?;
        lock.try_lock().map_err(|_| {
            "Gardendless Launcher is already open. Switch to its existing window.".to_string()
        })?;
        let path = root.join("library.json");
        // Interrupted Windows replacement can leave only the intact backup.
        if !path.exists() && path.with_extension("backup").exists() {
            fs::copy(path.with_extension("backup"), &path).map_err(|e| e.to_string())?;
        }
        let library: Library = if path.exists() {
            serde_json::from_slice(&fs::read(&path).map_err(|e| e.to_string())?).map_err(|e| {
                format!("Library could not be read; it has not been overwritten: {e}")
            })?
        } else {
            Library::default()
        };
        if library.schema_version != 1 || !library.profiles.iter().any(|p| p.id == "default") {
            return Err("Unsupported launcher library format.".into());
        }
        for profile in &library.profiles {
            validate_profile(profile)?;
        }
        Ok(Self {
            path,
            library: Mutex::new(library),
            session: Mutex::new(None),
            _lock: lock,
        })
    }
    pub fn running(&self) -> Result<Option<RunningGame>, String> {
        let mut session = self.session.lock().map_err(|e| e.to_string())?;
        if let Some(s) = session.as_mut() {
            if s.child.try_wait().map_err(|e| e.to_string())?.is_some() {
                *session = None;
            }
        }
        Ok(session.as_ref().map(|s| s.info.clone()))
    }
    fn update(
        &self,
        change: impl FnOnce(&mut Library) -> Result<(), String>,
    ) -> Result<(), String> {
        let mut library = self.library.lock().map_err(|e| e.to_string())?;
        let mut candidate = library.clone();
        change(&mut candidate)?;
        persist(&self.path, &candidate)?;
        *library = candidate;
        Ok(())
    }
}
pub fn validate_profile(profile: &Profile) -> Result<(), String> {
    if !valid_id(&profile.id) || profile.name.trim().is_empty() || profile.name.chars().count() > 64
    {
        return Err("Choose a profile name of 1–64 characters.".into());
    }
    if ![30, 60, 90, 120, 144, 165, 180, 240].contains(&profile.frame_rate)
        || !["none", "fog", "bushes"].contains(&profile.widescreen.as_str())
        || !["performance", "balanced", "rich"].contains(&profile.audio_profile.as_str())
    {
        return Err("Unsupported frame rate or widescreen style.".into());
    }
    Ok(())
}
pub fn game_context() -> Result<Option<GameContext>, String> {
    let Ok(json) = std::env::var("GARDENDLESS_LAUNCH_CONTEXT") else {
        return Ok(None);
    };
    let context: GameContext = serde_json::from_str(&json).map_err(|e| e.to_string())?;
    validate_profile(&context.profile)?;
    Ok(Some(context))
}
pub fn profile_lock(app: &tauri::AppHandle) -> Result<File, String> {
    let dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
    fs::create_dir_all(&dir).map_err(|e| e.to_string())?;
    let file = OpenOptions::new()
        .create(true)
        .truncate(false)
        .read(true)
        .write(true)
        .open(dir.join("game-session.lock"))
        .map_err(|e| e.to_string())?;
    file.try_lock().map_err(|_| {
        "This save profile is already running. Close its game window first.".to_string()
    })?;
    Ok(file)
}
pub struct GameLock {
    pub _file: File,
}
fn gpu_options() -> Vec<GpuOption> {
    #[cfg(target_os = "linux")]
    {
        use crate::platform::linux::gpu_selection::{discover, preferred};
        let devices = discover(Path::new("/sys/class/drm"), Path::new("/dev/dri"));
        let recommended = preferred(&devices).map(|g| g.pci.clone());
        return devices
            .iter()
            .map(|g| {
                let vendor = match g.vendor.as_str() {
                    "0x1002" => "AMD",
                    "0x8086" => "Intel",
                    "0x10de" => "NVIDIA",
                    _ => "GPU",
                };
                GpuOption {
                    id: g.pci.clone(),
                    label: format!("{vendor} · {} · {}", g.driver, g.pci),
                    vendor: vendor.into(),
                    driver: g.driver.clone(),
                    primary: g.primary,
                    recommended: recommended.as_ref() == Some(&g.pci),
                    nvidia: vendor == "NVIDIA",
                }
            })
            .collect();
    }
    #[cfg(not(target_os = "linux"))]
    Vec::new()
}
fn apply_gpu(command: &mut Command, choice: &str) -> Result<(), String> {
    // The launcher has already configured itself; never accidentally inherit its pick.
    for key in [
        "DRI_PRIME",
        "WEBKIT_WEB_RENDER_DEVICE_FILE",
        "__NV_PRIME_RENDER_OFFLOAD",
        "__GLX_VENDOR_LIBRARY_NAME",
        "__EGL_VENDOR_LIBRARY_FILENAMES",
        "WEBKIT_DISABLE_DMABUF_RENDERER",
        "GARDENDLESS_GPU_MODE",
    ] {
        command.env_remove(key);
    }
    if choice == "auto" {
        return Ok(());
    }
    if choice == "system" {
        command.env("GARDENDLESS_GPU_MODE", "system");
        return Ok(());
    }
    #[cfg(target_os = "linux")]
    {
        use crate::platform::linux::gpu_selection::discover;
        let devices = discover(Path::new("/sys/class/drm"), Path::new("/dev/dri"));
        let gpu = devices
            .iter()
            .find(|g| g.pci == choice)
            .ok_or("Selected GPU is unavailable. Choose Automatic or another device.")?;
        command.env("WEBKIT_WEB_RENDER_DEVICE_FILE", &gpu.render_node);
        if gpu.vendor == "0x10de" {
            command
                .env("__NV_PRIME_RENDER_OFFLOAD", "1")
                .env("__GLX_VENDOR_LIBRARY_NAME", "nvidia")
                .env("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        } else {
            command.env("DRI_PRIME", gpu.prime_id());
        }
        return Ok(());
    }
    #[cfg(not(target_os = "linux"))]
    Err("Use Windows Graphics settings to select your GPU.".into())
}
pub fn verify_executable(path: &Path) -> Result<(), String> {
    let mut file = File::open(path).map_err(|e| format!("Cannot read executable: {e}"))?;
    if !file.metadata().map_err(|e| e.to_string())?.is_file() {
        return Err("Select a regular executable file.".into());
    }
    let mut header = [0; 64];
    file.read_exact(&mut header)
        .map_err(|_| "File is too short to be a game executable.")?;
    if cfg!(target_os = "linux")
        && (&header[..4] != b"\x7fELF"
            || header[4] != 2
            || header[5] != 1
            || u16::from_le_bytes([header[18], header[19]]) != 62)
    {
        return Err("Select a Linux x64 ELF binary (not a Windows EXE or archive).".into());
    }
    if cfg!(target_os = "windows") {
        if &header[..2] != b"MZ" {
            return Err("Select a Windows x64 executable.".into());
        }
        let offset = u32::from_le_bytes(header[60..64].try_into().unwrap());
        file.seek(SeekFrom::Start(offset as u64))
            .map_err(|e| e.to_string())?;
        let mut pe = [0; 6];
        file.read_exact(&mut pe).map_err(|e| e.to_string())?;
        if &pe[..4] != b"PE\0\0" || u16::from_le_bytes([pe[4], pe[5]]) != 0x8664 {
            return Err("The executable is not Windows x64.".into());
        }
    }
    Ok(())
}
fn snapshot(app: &tauri::AppHandle) -> Result<LauncherState, String> {
    let store = app.state::<LauncherStore>();
    let library = store.library.lock().map_err(|e| e.to_string())?.clone();
    let mut games = vec![GameEntry {
        id: "builtin".into(),
        name: "PvZ2 Gardendless".into(),
        version: "0.15.0 · launcher edition".into(),
        path: std::env::current_exe()
            .map_err(|e| e.to_string())?
            .to_string_lossy()
            .into(),
        builtin: true,
        available: true,
        last_played: None,
    }];
    games.extend(library.games.into_iter().map(|mut g| {
        g.available = Path::new(&g.path).is_file();
        g
    }));
    Ok(LauncherState {
        games,
        profiles: library.profiles,
        gpus: gpu_options(),
        running: store.running()?,
        data_dir: data_root(app)?.to_string_lossy().into(),
        platform: std::env::consts::OS.into(),
        distribution: if is_flatpak() { "flatpak" } else { "native" }.into(),
        launcher_version: "0.15.0".into(),
    })
}
#[tauri::command]
pub fn launcher_state(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<LauncherState, String> {
    require_launcher(&window)?;
    snapshot(&app)
}
#[tauri::command]
pub fn launcher_running(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<Option<RunningGame>, String> {
    require_launcher(&window)?;
    app.state::<LauncherStore>().running()
}
#[tauri::command]
pub async fn launcher_pick_game(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<Option<String>, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        app.dialog()
            .file()
            .set_title("Select a Gardendless executable")
            .blocking_pick_file()
            .map(|p| {
                p.into_path()
                    .map(|p| p.to_string_lossy().into_owned())
                    .map_err(|e| e.to_string())
            })
            .transpose()
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn launcher_export_json(
    window: WebviewWindow,
    app: tauri::AppHandle,
    name: String,
    data: serde_json::Value,
) -> Result<Option<String>, String> {
    require_launcher(&window)?;
    let bytes = serde_json::to_vec_pretty(&data).map_err(|error| error.to_string())?;
    if bytes.len() > 32 * 1024 * 1024 {
        return Err("The JSON export is too large (maximum 32 MiB).".into());
    }
    // Suggested names are labels, never paths supplied by web content.
    let filename: String = name
        .chars()
        .filter(|c| c.is_ascii_alphanumeric() || matches!(c, '-' | '_' | '.'))
        .take(100)
        .collect();
    let filename = if filename.ends_with(".json") && filename.len() > 5 {
        filename
    } else {
        "gardendless-save.json".into()
    };
    tauri::async_runtime::spawn_blocking(move || {
        let Some(destination) = app
            .dialog()
            .file()
            .set_title("Export Gardendless JSON")
            .set_file_name(&filename)
            .add_filter("JSON", &["json"])
            .blocking_save_file()
        else {
            return Ok(None);
        };
        let path = destination.into_path().map_err(|error| error.to_string())?;
        fs::write(&path, bytes).map_err(|error| format!("Could not export JSON: {error}"))?;
        Ok(Some(path.to_string_lossy().into_owned()))
    })
    .await
    .map_err(|error| error.to_string())?
}
pub fn register_download(
    app: &tauri::AppHandle,
    path: PathBuf,
    name: String,
    version: String,
) -> Result<LauncherState, String> {
    verify_executable(&path)?;
    let canonical = fs::canonicalize(path)
        .map_err(|e| e.to_string())?
        .to_string_lossy()
        .into_owned();
    app.state::<LauncherStore>().update(|lib| {
        if lib.games.iter().any(|g| g.path == canonical) {
            return Ok(());
        }
        lib.games.push(GameEntry {
            id: new_id(),
            name,
            version,
            path: canonical,
            builtin: false,
            available: true,
            last_played: None,
        });
        Ok(())
    })?;
    snapshot(app)
}
#[tauri::command]
pub fn launcher_import_game(
    window: WebviewWindow,
    app: tauri::AppHandle,
    path: String,
    name: String,
) -> Result<LauncherState, String> {
    require_launcher(&window)?;
    if is_flatpak() {
        return Err("Use Flatpak to install game updates. Standalone binaries may require different system libraries.".into());
    }
    if name.trim().is_empty() || name.chars().count() > 80 {
        return Err("Choose a name of 1–80 characters.".into());
    }
    register_download(
        &app,
        PathBuf::from(path),
        name.trim().into(),
        "Imported installation".into(),
    )
}
#[tauri::command]
pub fn launcher_remove_game(
    window: WebviewWindow,
    app: tauri::AppHandle,
    id: String,
) -> Result<LauncherState, String> {
    require_launcher(&window)?;
    let store = app.state::<LauncherStore>();
    if store.running()?.is_some_and(|r| r.game_id == id) {
        return Err("Close this game before removing its library entry.".into());
    }
    store.update(|lib| {
        lib.games.retain(|g| g.id != id);
        Ok(())
    })?;
    snapshot(&app)
}
#[tauri::command]
pub fn launcher_save_profile(
    window: WebviewWindow,
    app: tauri::AppHandle,
    mut profile: Profile,
) -> Result<LauncherState, String> {
    require_launcher(&window)?;
    let store = app.state::<LauncherStore>();
    if profile.id.is_empty() {
        profile.id = new_id();
    }
    validate_profile(&profile)?;
    if store.running()?.is_some_and(|r| r.profile_id == profile.id) {
        return Err("Close the game before editing its launch profile.".into());
    }
    if !["auto", "system"].contains(&profile.gpu.as_str())
        && !gpu_options().iter().any(|g| g.id == profile.gpu)
    {
        return Err("Selected GPU is unavailable.".into());
    }
    profile.name = profile.name.trim().into();
    profile.updated_at = now();
    store.update(|lib| {
        if let Some(p) = lib.profiles.iter_mut().find(|p| p.id == profile.id) {
            *p = profile;
        } else {
            lib.profiles.push(profile);
        }
        Ok(())
    })?;
    snapshot(&app)
}
#[tauri::command]
pub fn launcher_delete_profile(
    window: WebviewWindow,
    app: tauri::AppHandle,
    id: String,
) -> Result<LauncherState, String> {
    require_launcher(&window)?;
    if id == "default" {
        return Err("The existing-save profile cannot be removed.".into());
    }
    let store = app.state::<LauncherStore>();
    if store.running()?.is_some_and(|r| r.profile_id == id) {
        return Err("Close the profile's game first.".into());
    }
    store.update(|lib| {
        lib.profiles.retain(|p| p.id != id);
        Ok(())
    })?;
    snapshot(&app)
}
#[tauri::command]
pub fn launcher_launch(
    window: WebviewWindow,
    app: tauri::AppHandle,
    game_id: String,
    profile_id: String,
    open_tab: Option<String>,
) -> Result<RunningGame, String> {
    require_launcher(&window)?;
    let store = app.state::<LauncherStore>();
    store.running()?;
    let mut session = store.session.lock().map_err(|e| e.to_string())?;
    if session.is_some() {
        return Err(
            "A game is already running. Close it before switching versions or profiles.".into(),
        );
    }
    let library = store.library.lock().map_err(|e| e.to_string())?.clone();
    let profile = library
        .profiles
        .iter()
        .find(|p| p.id == profile_id)
        .ok_or("Profile not found")?
        .clone();
    let builtin = game_id == "builtin";
    if !builtin && is_flatpak() {
        return Err("Standalone game binaries cannot be launched inside this Flatpak.".into());
    }
    if !builtin && profile.id != "default" {
        return Err(
            "Older game builds do not support isolated launcher profiles. Select Existing save."
                .into(),
        );
    }
    let path = if builtin {
        std::env::current_exe().map_err(|e| e.to_string())?
    } else {
        PathBuf::from(
            &library
                .games
                .iter()
                .find(|g| g.id == game_id)
                .ok_or("Installation not found")?
                .path,
        )
    };
    verify_executable(&path)?;
    let logs = data_root(&app)?.join("logs");
    fs::create_dir_all(&logs).map_err(|e| e.to_string())?;
    let started = now();
    let log_path = logs.join(format!("game-{started}.log"));
    let log = File::create(&log_path).map_err(|e| e.to_string())?;
    let mut command = Command::new(&path);
    command.current_dir(path.parent().ok_or("Missing installation folder")?);
    command.env_remove("GARDENDLESS_LAUNCH_CONTEXT");
    apply_gpu(&mut command, &profile.gpu)?;
    if builtin {
        let open_tab =
            open_tab.filter(|t| ["mods", "tools", "performance", "settings"].contains(&t.as_str()));
        command.arg("--game").env(
            "GARDENDLESS_LAUNCH_CONTEXT",
            serde_json::to_string(&GameContext {
                profile: profile.clone(),
                open_tab,
            })
            .map_err(|e| e.to_string())?,
        );
    }
    command
        .stdout(Stdio::from(log.try_clone().map_err(|e| e.to_string())?))
        .stderr(Stdio::from(log));
    let child = command
        .spawn()
        .map_err(|e| format!("Could not launch game: {e}"))?;
    let info = RunningGame {
        game_id: game_id.clone(),
        profile_id,
        pid: child.id(),
        started_at: started,
        log_path: log_path.to_string_lossy().into(),
    };
    *session = Some(Session {
        child,
        info: info.clone(),
    });
    drop(session);
    if !builtin {
        if let Err(error) = store.update(|lib| {
            if let Some(g) = lib.games.iter_mut().find(|g| g.id == game_id) {
                g.last_played = Some(started);
            }
            Ok(())
        }) {
            eprintln!("[Launcher] Could not store last played: {error}");
        }
    }
    Ok(info)
}
#[tauri::command]
pub fn launcher_game_context(window: WebviewWindow) -> Result<Option<GameContext>, String> {
    if window.label() != "main" {
        return Err("Game only".into());
    }
    game_context()
}

#[tauri::command]
pub fn game_discord_available(window: WebviewWindow) -> Result<bool, String> {
    if window.label() != "main" {
        return Err("Game only".into());
    }
    #[cfg(target_os = "linux")]
    {
        use std::os::unix::fs::FileTypeExt;
        let Some(runtime) = std::env::var_os("XDG_RUNTIME_DIR") else {
            return Ok(false);
        };
        Ok((0..10).any(|index| {
            fs::metadata(PathBuf::from(&runtime).join(format!("discord-ipc-{index}")))
                .is_ok_and(|metadata| metadata.file_type().is_socket())
        }))
    }
    #[cfg(not(target_os = "linux"))]
    Ok(true)
}
#[tauri::command]
pub fn launcher_open_folder(
    window: WebviewWindow,
    app: tauri::AppHandle,
    kind: String,
    profile_id: Option<String>,
) -> Result<(), String> {
    require_launcher(&window)?;
    let path = match kind.as_str() {
        "logs" => data_root(&app)?.join("logs"),
        "versions" => data_root(&app)?.join("versions"),
        "mods" => {
            let id = profile_id.unwrap_or_else(|| "default".into());
            if !valid_id(&id)
                || !app
                    .state::<LauncherStore>()
                    .library
                    .lock()
                    .map_err(|e| e.to_string())?
                    .profiles
                    .iter()
                    .any(|p| p.id == id)
            {
                return Err("Unknown profile".into());
            }
            app.path()
                .data_dir()
                .map_err(|e| e.to_string())?
                .join(if id == "default" {
                    IDENTIFIER.into()
                } else {
                    format!("{IDENTIFIER}.profile.{id}")
                })
                .join("gp-next/packs")
        }
        "profile" => {
            let id = profile_id.unwrap_or_else(|| "default".into());
            if !app
                .state::<LauncherStore>()
                .library
                .lock()
                .map_err(|e| e.to_string())?
                .profiles
                .iter()
                .any(|p| p.id == id)
            {
                return Err("Unknown profile".into());
            }
            app.path()
                .data_dir()
                .map_err(|e| e.to_string())?
                .join(if id == "default" {
                    IDENTIFIER.into()
                } else {
                    format!("{IDENTIFIER}.profile.{id}")
                })
        }
        _ => return Err("Unknown folder".into()),
    };
    fs::create_dir_all(&path).map_err(|e| e.to_string())?;
    app.opener()
        .open_path(path.to_string_lossy(), None::<&str>)
        .map_err(|e| e.to_string())
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn profile_ids_reject_paths() {
        for id in ["../default", "a/b", ".", "", "a\\b"] {
            assert!(!valid_id(id));
        }
        assert!(valid_id("p123-ab"));
    }
    #[test]
    fn profiles_validate_limits() {
        let mut p = Profile::default();
        p.frame_rate = 2000;
        assert!(validate_profile(&p).is_err());
        p.frame_rate = 120;
        assert!(validate_profile(&p).is_ok());
    }
    #[test]
    fn library_roundtrip_keeps_default_settings() {
        let lib = Library::default();
        let decoded: Library = serde_json::from_slice(&serde_json::to_vec(&lib).unwrap()).unwrap();
        assert!(!decoded.profiles[0].apply_settings);
    }
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RuntimeCheck {
    name: String,
    status: String,
    detail: String,
}
#[tauri::command]
pub async fn launcher_diagnostics(window: WebviewWindow) -> Result<Vec<RuntimeCheck>, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(|| {
        let mut checks=Vec::new();
        #[cfg(target_os="linux")]
        for (plugin,name) in [("autoaudiosink","Audio output"),("audioconvert","Audio conversion"),("audioresample","Audio resampling"),("mpg123audiodec","MP3 decoder")]{
            match Command::new("gst-inspect-1.0").arg(plugin).output(){
                Ok(output)=>checks.push(RuntimeCheck{name:name.into(),status:if output.status.success(){"available"}else{"missing"}.into(),detail:if output.status.success(){format!("{plugin} is available")}else{format!("{plugin} was not found. On Arch/CachyOS: sudo pacman -Syu --needed gst-plugins-base gst-plugins-good")}}),
                Err(_)=>{checks.push(RuntimeCheck{name:"GStreamer inspection".into(),status:"unknown".into(),detail:"gst-inspect-1.0 is unavailable; plugin availability could not be checked.".into()});break;}
            }
        }
        #[cfg(not(target_os="linux"))]
        checks.push(RuntimeCheck{name:"Audio runtime".into(),status:"info".into(),detail:"Windows uses the WebView2 audio runtime. GStreamer is not required.".into()});
        checks
    }).await.map_err(|e|e.to_string())
}
