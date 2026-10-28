//! Datapack inspection and staged installation; mod code is never executed here.
use super::{require_launcher, valid_id, LauncherStore, IDENTIFIER};
use base64::{engine::general_purpose::STANDARD, Engine};
use serde::Serialize;
use std::{
    fs::{self, File},
    io::Read,
    path::{Component, Path, PathBuf},
};
use tauri::{Manager, WebviewWindow};
const PACKAGE_LIMIT: u64 = 512 * 1024 * 1024;
const CONTENT_LIMIT: u64 = 2 * 1024 * 1024 * 1024;
const FILE_LIMIT: usize = 20_000;
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Package {
    file_name: String,
    name: String,
    description: String,
    author: String,
    version: String,
    uuid: String,
    game_version: String,
    icon: Option<String>,
    kind: String,
    warning: Option<String>,
    managed: bool,
    enabled: bool,
    pending: bool,
}
fn limited_file(path: &Path, limit: u64) -> Result<Vec<u8>, String> {
    let metadata = fs::symlink_metadata(path).map_err(|e| e.to_string())?;
    if !metadata.is_file() || metadata.len() > limit {
        return Err("File is too large or not a regular file".into());
    }
    let mut bytes = Vec::new();
    File::open(path)
        .map_err(|e| e.to_string())?
        .take(limit + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() as u64 > limit {
        return Err("File exceeds size limit".into());
    }
    Ok(bytes)
}
fn zip_bytes(zip: &mut zip::ZipArchive<File>, name: &str, limit: u64) -> Result<Vec<u8>, String> {
    let mut entry = zip.by_name(name).map_err(|e| e.to_string())?;
    if entry.size() > limit {
        return Err("Archive entry exceeds size limit".into());
    }
    let mut bytes = Vec::new();
    (&mut entry)
        .take(limit + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() as u64 > limit {
        return Err("Archive entry exceeds size limit".into());
    }
    Ok(bytes)
}
fn inspect(path: &Path) -> Result<Package, String> {
    let file_name = path
        .file_name()
        .ok_or("Missing filename")?
        .to_string_lossy()
        .into_owned();
    let metadata = fs::symlink_metadata(path).map_err(|e| e.to_string())?;
    let mut zip = if metadata.is_file()
        && path
            .extension()
            .is_some_and(|e| e.eq_ignore_ascii_case("zip"))
    {
        if metadata.len() > PACKAGE_LIMIT {
            return Err("ZIP exceeds 512 MiB".into());
        }
        Some(
            zip::ZipArchive::new(File::open(path).map_err(|e| e.to_string())?)
                .map_err(|e| e.to_string())?,
        )
    } else if metadata.is_dir() {
        None
    } else {
        return Err("Choose a datapack folder or ZIP".into());
    };
    let prefix = if let Some(zip) = zip.as_mut() {
        if zip.file_names().any(|name| name == "pack.json") {
            String::new()
        } else {
            let names: Vec<_> = zip.file_names().filter(|name| !name.ends_with('/') && !name.starts_with("__MACOSX/") && !name.ends_with(".DS_Store")).map(str::to_owned).collect();
            let first = names.first().ok_or("Empty datapack ZIP")?;
            let (folder, _) = first.split_once('/').ok_or("ZIP is missing pack.json")?;
            let prefix = format!("{folder}/");
            if !names.iter().all(|name| name.starts_with(&prefix)) || !names.iter().any(|name| name == &format!("{prefix}pack.json")) {
                return Err("ZIP needs pack.json at its root or inside one enclosing folder".into());
            }
            prefix
        }
    } else { String::new() };
    let manifest = match zip.as_mut() {
        Some(zip) => zip_bytes(zip, &format!("{prefix}pack.json"), 128 * 1024),
        None => limited_file(&path.join("pack.json"), 128 * 1024),
    }?;
    let value: serde_json::Value = json5::from_str(
        std::str::from_utf8(&manifest)
            .map_err(|e| e.to_string())?
            .trim_start_matches('\u{feff}'),
    )
    .map_err(|e| format!("Invalid pack.json: {e}"))?;
    if !value.is_object() {
        return Err("pack.json must be an object".into());
    }
    let text = |key: &str, max: usize| {
        value
            .get(key)
            .and_then(|v| v.as_str())
            .unwrap_or("")
            .chars()
            .take(max)
            .collect::<String>()
    };
    let mut thumbnail = None;
    for (name, mime) in [
        ("thumbnail.png", "image/png"),
        ("thumbnail.ico", "image/x-icon"),
        ("icon.png", "image/png"),
        ("thumbnail.jpg", "image/jpeg"),
        ("thumbnail.webp", "image/webp"),
    ] {
        let bytes = match zip.as_mut() {
            Some(zip) => zip_bytes(zip, &format!("{prefix}{name}"), 1024 * 1024),
            None => limited_file(&path.join(name), 1024 * 1024),
        };
        if let Ok(bytes) = bytes {
            // Only raster signatures are accepted; never embed an SVG or arbitrary HTML.
            let raster = match mime {
                "image/png" => bytes.starts_with(b"\x89PNG\r\n\x1a\n"),
                "image/x-icon" => bytes.starts_with(&[0, 0, 1, 0]),
                "image/jpeg" => bytes.starts_with(&[255, 216, 255]),
                _ => bytes.starts_with(b"RIFF") && bytes.get(8..12) == Some(b"WEBP"),
            };
            if raster {
                thumbnail = Some(format!("data:{mime};base64,{}", STANDARD.encode(bytes)));
                break;
            }
        }
    }
    let name = text("name", 200);
    Ok(Package {
        name: if name.is_empty() {
            file_name.trim_end_matches(".zip").to_owned()
        } else {
            name
        },
        description: text("description", 4000),
        author: text("author", 200),
        version: text("version", 100),
        uuid: text("uuid", 200),
        game_version: text("gameVersion", 100),
        icon: thumbnail,
        kind: if zip.is_some() { "ZIP" } else { "Folder" }.into(),
        warning: None,
        managed: false,
        enabled: false,
        pending: false,
        file_name,
    })
}
pub(crate) fn root(app: &tauri::AppHandle, id: &str) -> Result<PathBuf, String> {
    if !valid_id(id)
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
    Ok(app
        .path()
        .data_dir()
        .map_err(|e| e.to_string())?
        .join(if id == "default" {
            IDENTIFIER.into()
        } else {
            format!("{IDENTIFIER}.profile.{id}")
        })
        .join("gp-next/packs"))
}
fn list(root: &Path) -> Result<Vec<Package>, String> {
    if !root.exists() {
        return Ok(Vec::new());
    }
    let mut paths = fs::read_dir(root)
        .map_err(|e| e.to_string())?
        .filter_map(Result::ok)
        .filter(|e| !e.file_name().to_string_lossy().starts_with('.'))
        .map(|e| e.path())
        .collect::<Vec<_>>();
    paths.sort();
    paths.truncate(300);
    let mut packages = Vec::new();
    for path in paths {
        let Ok(metadata) = fs::symlink_metadata(&path) else {
            continue;
        };
        if !metadata.is_dir()
            && !(metadata.is_file()
                && path
                    .extension()
                    .is_some_and(|e| e.eq_ignore_ascii_case("zip")))
        {
            continue;
        }
        match inspect(&path) {
            Ok(package) => packages.push(package),
            Err(warning) => packages.push(Package {
                file_name: path.file_name().unwrap().to_string_lossy().into_owned(),
                name: path
                    .file_stem()
                    .unwrap_or_default()
                    .to_string_lossy()
                    .into_owned(),
                description: String::new(),
                author: String::new(),
                version: String::new(),
                uuid: String::new(),
                game_version: String::new(),
                icon: None,
                kind: if metadata.is_dir() { "Folder" } else { "ZIP" }.into(),
                warning: Some(warning),
                managed: false,
                enabled: false,
                pending: false,
            }),
        }
    }
    Ok(packages)
}
fn validate_zip(path: &Path) -> Result<(), String> {
    let mut zip = zip::ZipArchive::new(File::open(path).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    if zip.len() > FILE_LIMIT {
        return Err("Too many files in datapack".into());
    }
    let mut total = 0u64;
    for index in 0..zip.len() {
        let entry = zip.by_index(index).map_err(|e| e.to_string())?;
        if entry.enclosed_name().is_none()
            || entry.name().contains('\\')
            || entry
                .unix_mode()
                .is_some_and(|mode| mode & 0o170000 == 0o120000)
        {
            return Err("Unsafe archive path or symbolic link".into());
        }
        total = total
            .checked_add(entry.size())
            .ok_or("Datapack exceeds size limit")?;
        if total > CONTENT_LIMIT {
            return Err("Unpacked datapack exceeds 2 GiB".into());
        }
    }
    Ok(())
}
fn copy_tree(
    source: &Path,
    dest: &Path,
    depth: usize,
    count: &mut usize,
    total: &mut u64,
) -> Result<(), String> {
    if depth > 32 {
        return Err("Datapack folders are nested too deeply".into());
    }
    let metadata = fs::symlink_metadata(source).map_err(|e| e.to_string())?;
    if metadata.is_dir() {
        fs::create_dir(dest).map_err(|e| e.to_string())?;
        for entry in fs::read_dir(source).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            copy_tree(
                &entry.path(),
                &dest.join(entry.file_name()),
                depth + 1,
                count,
                total,
            )?;
        }
    } else if metadata.is_file() {
        *count += 1;
        *total = total
            .checked_add(metadata.len())
            .ok_or("Datapack exceeds size limit")?;
        if *count > FILE_LIMIT || *total > CONTENT_LIMIT {
            return Err("Datapack exceeds file or size limit".into());
        }
        let mut input = File::open(source)
            .map_err(|e| e.to_string())?
            .take(CONTENT_LIMIT - (*total - metadata.len()) + 1);
        let mut output = fs::OpenOptions::new()
            .write(true)
            .create_new(true)
            .open(dest)
            .map_err(|e| e.to_string())?;
        let copied = std::io::copy(&mut input, &mut output).map_err(|e| e.to_string())?;
        if copied != metadata.len() {
            return Err("Datapack changed while copying".into());
        }
    } else {
        return Err("Datapacks cannot contain symbolic links or special files".into());
    }
    Ok(())
}
fn install(source: &Path, root: &Path) -> Result<String, String> {
    let package = inspect(source)?;
    if package.uuid.is_empty() {
        return Err("A datapack needs a UUID in pack.json before it can be imported".into());
    }
    if source.is_file() {
        validate_zip(source)?;
    }
    fs::create_dir_all(root).map_err(|e| e.to_string())?;
    let source = fs::canonicalize(source).map_err(|e| e.to_string())?;
    let root = fs::canonicalize(root).map_err(|e| e.to_string())?;
    if source.starts_with(&root) || root.starts_with(&source) {
        return Err("This folder is already in the profile, or contains the profile".into());
    }
    let name = source
        .file_name()
        .ok_or("Missing filename")?
        .to_string_lossy()
        .into_owned();
    if name.starts_with('.')
        || name.len() > 120
        || Path::new(&name)
            .components()
            .any(|c| !matches!(c, Component::Normal(_)))
    {
        return Err("Invalid datapack filename".into());
    }
    let destination = root.join(&name);
    if destination.exists() {
        return Err(format!(
            "{name} is already installed. Existing files were kept."
        ));
    }
    let stage = root.join(format!(
        ".import-{}{}",
        super::new_id(),
        if source.is_file() { ".zip" } else { "" }
    ));
    let result = (|| {
        copy_tree(&source, &stage, 0, &mut 0, &mut 0)?;
        inspect(&stage)?;
        if source.is_file() {
            validate_zip(&stage)?;
        }
        if destination.exists() {
            return Err("A datapack with this filename was installed concurrently".into());
        }
        use sha2::{Digest, Sha256};
        let marker = root.join(format!(
            ".pending-import-{:x}.json",
            Sha256::digest(package.uuid.as_bytes())
        ));
        fs::write(
            &marker,
            serde_json::to_vec(&package.uuid).map_err(|e| e.to_string())?,
        )
        .map_err(|e| e.to_string())?;
        fs::rename(&stage, &destination).map_err(|e| e.to_string())?;
        Ok(name)
    })();
    if stage.is_dir() {
        let _ = fs::remove_dir_all(&stage);
    } else {
        let _ = fs::remove_file(&stage);
    }
    result
}
fn list_profile(root: &Path) -> Result<Vec<Package>, String> {
    let base = root.parent().ok_or("Missing GP-Next directory")?;
    let state_path = base.join("configuration-state.json");
    let mut managed = Vec::new();
    if state_path.is_file() {
        let state: serde_json::Value =
            serde_json::from_slice(&limited_file(&state_path, 16 * 1024 * 1024)?)
                .map_err(|e| e.to_string())?;
        if let Some(mods) = state["desired"]["mods"].as_array() {
            for entry in mods.iter().take(300) {
                let digest = entry["contentDigest"]
                    .as_str()
                    .ok_or("Missing installed package digest")?;
                if digest.len() != 64 || !digest.bytes().all(|b| b.is_ascii_hexdigit()) {
                    return Err("Invalid installed package digest".into());
                }
                let mut package = inspect(&base.join("installed").join(digest))?;
                package.file_name = entry["id"].as_str().unwrap_or(&package.uuid).to_owned();
                package.managed = true;
                package.enabled = entry["enabled"] == true;
                let active = state["active"]["configuration"]["mods"]
                    .as_array()
                    .and_then(|mods| mods.iter().find(|item| item["id"] == entry["id"]));
                package.pending = active.is_none_or(|active| {
                    active["contentDigest"] != entry["contentDigest"]
                        || active["enabled"] != entry["enabled"]
                });
                managed.push(package);
            }
        }
    }
    for package in list(root)? {
        if !managed.iter().any(|item| item.uuid == package.uuid) {
            managed.push(package);
        }
    }
    Ok(managed)
}
#[tauri::command]
pub async fn launcher_gpnext_packages(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
) -> Result<Vec<Package>, String> {
    require_launcher(&window)?;
    let root = root(&app, &profile_id)?;
    tauri::async_runtime::spawn_blocking(move || list_profile(&root))
        .await
        .map_err(|e| e.to_string())?
}
#[derive(Serialize)]
pub struct ImportResult {
    pub installed: Vec<String>,
    pub errors: Vec<String>,
}
#[tauri::command]
pub async fn launcher_import_packages(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
    paths: Vec<String>,
) -> Result<ImportResult, String> {
    require_launcher(&window)?;
    let root = root(&app, &profile_id)?;
    if paths.is_empty() || paths.len() > 20 {
        return Err("Drop between 1 and 20 datapacks at a time".into());
    }
    tauri::async_runtime::spawn_blocking(move || {
        // Hold the same session lock as launch while staging packs, so a game
        // cannot start with an incomplete import or before its disable marker.
        let store = app.state::<LauncherStore>();
        let session = store.session.lock().map_err(|e| e.to_string())?;
        if session.is_some() {
            return Err("Close the game before installing datapacks".into());
        }
        let mut result = ImportResult {
            installed: Vec::new(),
            errors: Vec::new(),
        };
        for path in paths {
            match install(Path::new(&path), &root) {
                Ok(name) => result.installed.push(name),
                Err(error) => result.errors.push(format!(
                    "{}: {error}",
                    Path::new(&path)
                        .file_name()
                        .unwrap_or_default()
                        .to_string_lossy()
                )),
            }
        }
        Ok(result)
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn launcher_pick_packages(
    window: WebviewWindow,
    app: tauri::AppHandle,
    folder: bool,
) -> Result<Vec<String>, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        use tauri_plugin_dialog::DialogExt;
        let builder = app.dialog().file().set_title("Import GP-Next datapacks");
        let files = if folder {
            builder.blocking_pick_folder().map(|p| vec![p])
        } else {
            builder
                .add_filter("Datapack ZIP", &["zip"])
                .blocking_pick_files()
        };
        files
            .unwrap_or_default()
            .into_iter()
            .map(|p| {
                p.into_path()
                    .map(|p| p.to_string_lossy().into_owned())
                    .map_err(|e| e.to_string())
            })
            .collect()
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Transfer newly imported IDs into GP-Next's disabled list before mod discovery.
#[tauri::command]
pub fn launcher_pending_packages(
    window: WebviewWindow,
    app: tauri::AppHandle,
    applied: Vec<String>,
) -> Result<Vec<String>, String> {
    if window.label() != "main" {
        return Err("Game only".into());
    }
    if applied.len() > 300 {
        return Err("Too many imported IDs".into());
    }
    let root = app
        .path()
        .data_dir()
        .map_err(|e| e.to_string())?
        .join(&app.config().identifier)
        .join("gp-next/packs");
    if !root.exists() {
        return Ok(Vec::new());
    }
    let mut ids = Vec::new();
    for entry in fs::read_dir(root)
        .map_err(|e| e.to_string())?
        .filter_map(Result::ok)
    {
        let name = entry.file_name().to_string_lossy().into_owned();
        if !name.starts_with(".pending-import-") || !name.ends_with(".json") {
            continue;
        }
        let Ok(bytes) = limited_file(&entry.path(), 2048) else {
            continue;
        };
        let Ok(id) = serde_json::from_slice::<String>(&bytes) else {
            continue;
        };
        if applied.contains(&id) {
            fs::remove_file(entry.path()).map_err(|e| e.to_string())?;
        } else {
            ids.push(id);
        }
        if ids.len() > 300 {
            return Err("Too many pending datapacks".into());
        }
    }
    ids.sort();
    ids.dedup();
    Ok(ids)
}

#[cfg(test)]
mod tests {
    use super::*;
    use std::io::Write;
    fn workspace() -> PathBuf {
        let root = std::env::temp_dir().join(format!("gd-packs-{}", super::super::new_id()));
        fs::create_dir(&root).unwrap();
        root
    }
    fn fixture(root: &Path, name: &str) -> PathBuf {
        let path = root.join(name);
        fs::create_dir(&path).unwrap();
        fs::write(path.join("pack.json"), "{uuid:'test-pack', name:'A garden mod', description:'With plants', author:'Tester', version:'1.2',}").unwrap();
        path
    }
    #[test]
    fn metadata_supports_json5_and_raster_icons() {
        let root = workspace();
        let path = fixture(&root, "example");
        fs::write(path.join("thumbnail.png"), b"\x89PNG\r\n\x1a\n").unwrap();
        let pack = inspect(&path).unwrap();
        assert_eq!(pack.name, "A garden mod");
        assert_eq!(pack.description, "With plants");
        assert!(pack.icon.unwrap().starts_with("data:image/png;base64,"));
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn installation_preserves_existing_files_and_stages_disabled_import() {
        let root = workspace();
        let source = fixture(&root, "example");
        let destination = root.join("installed");
        install(&source, &destination).unwrap();
        assert!(destination.join("example/pack.json").exists());
        assert!(install(&source, &destination).is_err());
        assert_eq!(list(&destination).unwrap().len(), 1);
        assert!(fs::read_dir(&destination).unwrap().any(|e| e
            .unwrap()
            .file_name()
            .to_string_lossy()
            .starts_with(".pending-import-")));
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn zip_manifest_and_unsafe_entries_are_checked() {
        let root = workspace();
        let path = root.join("example.zip");
        let mut zip = zip::ZipWriter::new(File::create(&path).unwrap());
        zip.start_file("pack.json", zip::write::SimpleFileOptions::default())
            .unwrap();
        zip.write_all(b"{uuid:'zip-pack', name:'ZIP mod'}").unwrap();
        zip.finish().unwrap();
        assert_eq!(inspect(&path).unwrap().name, "ZIP mod");
        install(&path, &root.join("installed")).unwrap();
        assert_eq!(list(&root.join("installed")).unwrap()[0].kind, "ZIP");
        let unsafe_zip = root.join("unsafe.zip");
        let mut zip = zip::ZipWriter::new(File::create(&unsafe_zip).unwrap());
        zip.start_file("../escape", zip::write::SimpleFileOptions::default())
            .unwrap();
        zip.write_all(b"bad").unwrap();
        zip.finish().unwrap();
        assert!(validate_zip(&unsafe_zip).is_err());
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn enclosing_folder_zip_can_be_inspected_and_imported() {
        let root = workspace();
        let path = root.join("wrapped.zip");
        fs::write(&path, include_bytes!("../../../scripts/checks/WrappedPackageFixture.zip")).unwrap();
        assert_eq!(inspect(&path).unwrap().uuid, "fixture.mod");
        validate_zip(&path).unwrap();
        install(&path, &root.join("installed")).unwrap();
        fs::remove_dir_all(root).unwrap();
    }
    #[cfg(unix)]
    #[test]
    fn symlinked_folder_contents_are_rejected_and_stage_is_cleaned() {
        let root = workspace();
        let source = fixture(&root, "example");
        std::os::unix::fs::symlink("/etc/passwd", source.join("outside")).unwrap();
        let destination = root.join("installed");
        assert!(install(&source, &destination).is_err());
        assert_eq!(fs::read_dir(&destination).unwrap().count(), 0);
        fs::remove_dir_all(root).unwrap();
    }
}
