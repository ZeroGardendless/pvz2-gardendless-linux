//! Profile save access. Only the game's two JSON records are exposed; authentication
//! tokens and unrelated WebKit storage never leave the native side.
#[cfg(target_os = "linux")]
use super::{data_root, now};
use super::{require_launcher, valid_id, LauncherStore, IDENTIFIER};
#[cfg(target_os = "linux")]
use serde::Deserialize;
use serde::Serialize;
use serde_json::Value;
#[cfg(target_os = "linux")]
use std::fs;
use std::path::PathBuf;
use tauri::{Manager, WebviewWindow};

#[cfg(target_os = "linux")]
const PLAYERS: &str = "PvZ2_PlayerProperties";
#[cfg(target_os = "linux")]
const SETTINGS: &str = "PvZ2_Settings";
#[cfg(target_os = "linux")]
const MAX_JSON: usize = 32 * 1024 * 1024;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveSource {
    id: String,
    label: String,
    path: String,
    has_players: bool,
    has_settings: bool,
    modified_at: u64,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct BackupInfo {
    id: String,
    created_at: u64,
    label: String,
    source_id: String,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveSources {
    supported: bool,
    message: Option<String>,
    sources: Vec<SaveSource>,
    backups: Vec<BackupInfo>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct SaveSnapshot {
    source_id: String,
    revision: String,
    players: Option<Value>,
    settings: Option<Value>,
}

fn profile_dir(app: &tauri::AppHandle, id: &str) -> Result<PathBuf, String> {
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
        return Err("Save profile not found.".into());
    }
    Ok(app
        .path()
        .data_dir()
        .map_err(|e| e.to_string())?
        .join(if id == "default" {
            IDENTIFIER.to_owned()
        } else {
            format!("{IDENTIFIER}.profile.{id}")
        }))
}

#[cfg(target_os = "linux")]
fn backups_dir(app: &tauri::AppHandle, id: &str) -> Result<PathBuf, String> {
    // Callers validate the profile before using this private helper.
    Ok(data_root(app)?.join("save-backups").join(id))
}

#[cfg(target_os = "linux")]
mod native {
    use super::*;
    use rusqlite::{params, types::ValueRef, Connection, OpenFlags, OptionalExtension};
    use sha2::{Digest, Sha256};
    use std::{
        fs::{File, OpenOptions},
        io::Write,
        os::unix::fs::{MetadataExt, OpenOptionsExt},
        path::Path,
        sync::atomic::{AtomicU64, Ordering},
        time::{Duration, UNIX_EPOCH},
    };

    #[derive(Clone, Debug, PartialEq, Serialize, Deserialize)]
    struct Cell {
        // SQLite TEXT is UTF-8; WebKit's BLOB records are UTF-16LE.
        text: bool,
        bytes: Vec<u8>,
    }

    #[derive(Clone, Serialize, Deserialize)]
    struct Records {
        players: Option<Cell>,
        settings: Option<Cell>,
    }

    #[derive(Serialize, Deserialize)]
    #[serde(rename_all = "camelCase")]
    struct Backup {
        format_version: u8,
        profile_id: String,
        source_id: String,
        created_at: u64,
        records: Records,
    }

    fn decode(cell: &Cell) -> Result<String, String> {
        if cell.bytes.len() > MAX_JSON * 2 {
            return Err("The save record exceeds the editor's 32 MiB limit.".into());
        }
        if cell.text {
            return String::from_utf8(cell.bytes.clone()).map_err(|e| e.to_string());
        }
        if !cell.bytes.len().is_multiple_of(2) {
            return Err("This WebKit save has an invalid UTF-16 value.".into());
        }
        String::from_utf16(
            &cell
                .bytes
                .chunks_exact(2)
                .map(|b| u16::from_le_bytes([b[0], b[1]]))
                .collect::<Vec<_>>(),
        )
        .map_err(|_| "This WebKit save has an invalid UTF-16 value.".into())
    }

    fn parse(cell: &Cell) -> Result<Value, String> {
        serde_json::from_str(&decode(cell)?).map_err(|e| format!("Save JSON is invalid: {e}"))
    }

    fn encode(value: &Value, previous: Option<&Cell>) -> Result<Cell, String> {
        let raw = serde_json::to_string(value).map_err(|e| e.to_string())?;
        if raw.len() > MAX_JSON {
            return Err("The save record exceeds the editor's 32 MiB limit.".into());
        }
        let text = previous.is_some_and(|cell| cell.text);
        let bytes = if text {
            raw.into_bytes()
        } else {
            raw.encode_utf16().flat_map(u16::to_le_bytes).collect()
        };
        Ok(Cell { text, bytes })
    }

    fn open(path: &Path, writable: bool) -> Result<Connection, String> {
        let flags = if writable {
            OpenFlags::SQLITE_OPEN_READ_WRITE
        } else {
            OpenFlags::SQLITE_OPEN_READ_ONLY
        };
        let conn = Connection::open_with_flags(path, flags)
            .map_err(|e| format!("Could not open game storage: {e}"))?;
        conn.busy_timeout(Duration::from_millis(300))
            .map_err(|e| e.to_string())?;
        // Disallow an untrusted database schema from invoking extension functions.
        conn.execute_batch("PRAGMA trusted_schema=OFF;")
            .map_err(|e| e.to_string())?;
        Ok(conn)
    }

    fn cell(conn: &Connection, key: &str) -> Result<Option<Cell>, String> {
        conn.query_row(
            "SELECT value FROM ItemTable WHERE key=?1",
            [key],
            |row| match row.get_ref(0)? {
                ValueRef::Blob(bytes) => Ok(Cell {
                    text: false,
                    bytes: bytes.to_vec(),
                }),
                ValueRef::Text(bytes) => Ok(Cell {
                    text: true,
                    bytes: bytes.to_vec(),
                }),
                _ => Err(rusqlite::Error::InvalidColumnType(
                    0,
                    "value".into(),
                    row.get_ref(0)?.data_type(),
                )),
            },
        )
        .optional()
        .map_err(|e| format!("Could not read game storage: {e}"))
    }

    fn records(conn: &Connection) -> Result<Records, String> {
        Ok(Records {
            players: cell(conn, PLAYERS)?,
            settings: cell(conn, SETTINGS)?,
        })
    }

    fn revision(records: &Records) -> String {
        let mut hash = Sha256::new();
        for cell in [&records.players, &records.settings] {
            match cell {
                None => hash.update([0]),
                Some(cell) => {
                    hash.update([if cell.text { 1 } else { 2 }]);
                    hash.update((cell.bytes.len() as u64).to_le_bytes());
                    hash.update(&cell.bytes);
                }
            }
        }
        format!("{:x}", hash.finalize())
    }

    fn snapshot(source_id: &str, records: &Records) -> Result<SaveSnapshot, String> {
        Ok(SaveSnapshot {
            source_id: source_id.into(),
            revision: revision(records),
            players: records.players.as_ref().map(parse).transpose()?,
            settings: records.settings.as_ref().map(parse).transpose()?,
        })
    }

    fn scan(directory: &Path, depth: u8, paths: &mut Vec<PathBuf>) -> Result<(), String> {
        if depth > 5 || !directory.is_dir() {
            return Ok(());
        }
        if fs::symlink_metadata(directory)
            .map_err(|e| e.to_string())?
            .is_symlink()
        {
            return Err("The save editor does not follow linked storage directories.".into());
        }
        for entry in fs::read_dir(directory).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let kind = entry.file_type().map_err(|e| e.to_string())?;
            // Do not follow links out of the selected profile.
            if kind.is_symlink() {
                continue;
            }
            let path = entry.path();
            if kind.is_dir() {
                scan(&path, depth + 1, paths)?;
            } else if kind.is_file()
                && (path.extension().is_some_and(|e| e == "localstorage")
                    || path.file_name().is_some_and(|n| {
                        n == "localstorage.sqlite3" || n == "LocalStorage.sqlite3"
                    }))
            {
                if paths.len() >= 128 {
                    return Err("Too many WebKit databases in this profile.".into());
                }
                paths.push(path);
            }
        }
        Ok(())
    }

    pub(super) fn sources(root: &Path) -> Result<Vec<SaveSource>, String> {
        let mut paths = Vec::new();
        // Never recurse through mod packs, launcher webviews, or other applications.
        scan(&root.join("localstorage"), 0, &mut paths)?;
        scan(&root.join("storage"), 0, &mut paths)?;
        paths.sort();
        let mut result = Vec::new();
        for path in paths {
            let conn = open(&path, false)?;
            let records = records(&conn)?;
            if records.players.is_none() && records.settings.is_none() {
                continue;
            }
            let relative = path.strip_prefix(root).map_err(|e| e.to_string())?;
            let id = format!(
                "{:x}",
                Sha256::digest(relative.to_string_lossy().as_bytes())
            );
            let name = path.file_name().unwrap_or_default().to_string_lossy();
            let label = if name == "tauri_localhost_0.localstorage" {
                "Gardendless game save".to_owned()
            } else {
                format!("Game storage · {}", relative.to_string_lossy())
            };
            result.push(SaveSource {
                id,
                label,
                path: path.to_string_lossy().into(),
                has_players: records.players.is_some(),
                has_settings: records.settings.is_some(),
                modified_at: fs::metadata(&path)
                    .and_then(|m| m.modified())
                    .ok()
                    .and_then(|t| t.duration_since(UNIX_EPOCH).ok())
                    .map(|t| t.as_millis() as u64)
                    .unwrap_or(0),
            });
        }
        Ok(result)
    }

    fn source(root: &Path, id: &str) -> Result<SaveSource, String> {
        sources(root)?
            .into_iter()
            .find(|s| s.id == id)
            .ok_or_else(|| "Save source no longer exists. Refresh the editor.".into())
    }

    pub(super) fn read(root: &Path, source_id: &str) -> Result<SaveSnapshot, String> {
        let source = source(root, source_id)?;
        let mut conn = open(Path::new(&source.path), false)?;
        let transaction = conn.transaction().map_err(|e| e.to_string())?;
        snapshot(source_id, &records(&transaction)?)
    }

    /// Older releases do not own game-session.lock. Refuse to edit a database
    /// which any other user-owned process has open, including WebKit subprocesses.
    fn ensure_closed(path: &Path, known_games: &[PathBuf]) -> Result<(), String> {
        let user = fs::metadata("/proc/self").map_err(|e| e.to_string())?.uid();
        let expected = path.canonicalize().map_err(|e| e.to_string())?;
        let parent = expected.parent().ok_or("Missing storage directory")?;
        let name = expected
            .file_name()
            .ok_or("Missing storage filename")?
            .to_string_lossy();
        for process in fs::read_dir("/proc").map_err(|e| e.to_string())? {
            let process = process.map_err(|e| e.to_string())?;
            let Ok(pid) = process.file_name().to_string_lossy().parse::<u32>() else {
                continue;
            };
            if pid == std::process::id() {
                continue;
            }
            let Ok(metadata) = process.metadata() else {
                continue;
            };
            if metadata.uid() != user {
                continue;
            }
            let comm = fs::read_to_string(process.path().join("comm")).unwrap_or_default();
            let executable = fs::read_link(process.path().join("exe")).ok();
            if comm.trim().to_ascii_lowercase().starts_with("gardendless")
                || executable
                    .as_ref()
                    .is_some_and(|exe| known_games.contains(exe))
            {
                return Err(format!("Gardendless is running in process {pid}. Close all game windows before editing."));
            }
            let may_be_game = comm.is_empty() || comm.starts_with("WebKit");
            let fds = match fs::read_dir(process.path().join("fd")) {
                Ok(fds) => fds,
                Err(e) if e.kind() == std::io::ErrorKind::NotFound => continue,
                Err(_) if !may_be_game => continue,
                Err(_) => return Err("Cannot verify that game storage is closed. Close all Gardendless game windows before editing.".into()),
            };
            for fd in fds.flatten() {
                let target = match fs::read_link(fd.path()) {
                    Ok(target) => target,
                    Err(e) if e.kind() == std::io::ErrorKind::NotFound => continue,
                    Err(_) if !may_be_game => continue,
                    Err(_) => return Err("Cannot inspect an open process. Close all Gardendless game windows before editing.".into()),
                };
                if target.parent() == Some(parent)
                    && target.file_name().is_some_and(|f| {
                        f == expected.file_name().unwrap()
                            || f == format!("{name}-wal").as_str()
                            || f == format!("{name}-shm").as_str()
                    })
                {
                    return Err(format!("Game storage is still open in process {pid}. Close the game and try again."));
                }
            }
        }
        Ok(())
    }

    fn lock_profile(root: &Path) -> Result<File, String> {
        let file = OpenOptions::new()
            .create(true)
            .truncate(false)
            .read(true)
            .write(true)
            .mode(0o600)
            .open(root.join("game-session.lock"))
            .map_err(|e| e.to_string())?;
        file.try_lock()
            .map_err(|_| "Close this profile's game window before editing its save.".to_owned())?;
        Ok(file)
    }

    fn validate_players(value: &Value) -> Result<(), String> {
        let players = value
            .as_array()
            .ok_or("Player save must be a JSON array.")?;
        if players.is_empty() || players.len() > 1000 {
            return Err("A save must contain between 1 and 1,000 players.".into());
        }
        for player in players {
            let player = player
                .as_object()
                .ok_or("Every player must be a JSON object.")?;
            if !player
                .get("name")
                .is_some_and(|n| n.as_str().is_some_and(|n| n.chars().count() <= 256))
            {
                return Err("Every player needs a name of up to 256 characters.".into());
            }
            for key in ["coin", "gem", "ticket", "worldkey", "sprout"] {
                if let Some(number) = player.get(key) {
                    if !number.as_u64().is_some_and(|n| n <= 9_007_199_254_740_991) {
                        return Err(format!("Player {key} must be a nonnegative whole number within JavaScript's safe range."));
                    }
                }
            }
        }
        Ok(())
    }

    fn validate_settings(value: &Value) -> Result<(), String> {
        let settings = value
            .as_object()
            .ok_or("Game settings must be a JSON object.")?;
        if let Some(bindings) = settings.get("KeyBinds") {
            let bindings = bindings
                .as_object()
                .ok_or("KeyBinds must be a JSON object.")?;
            if bindings.len() > 1000 {
                return Err("Too many key bindings.".into());
            }
            for (action, code) in bindings {
                if action.starts_with("__") {
                    continue;
                }
                if !code.as_str().is_some_and(valid_key_code) {
                    return Err(format!(
                        "{action} must use a Cocos key name such as KEY_A or SPACE."
                    ));
                }
            }
        }
        Ok(())
    }

    // Cocos KeyCode names used by the bundled game. Do not accept DOM event.key
    // names ("a", "ArrowLeft"), which silently reset to defaults in KeyListener.
    fn valid_key_code(code: &str) -> bool {
        for (prefix, range) in [
            ("KEY_", b'A'..=b'Z'),
            ("DIGIT_", b'0'..=b'9'),
            ("NUM_", b'0'..=b'9'),
        ] {
            if let Some(suffix) = code.strip_prefix(prefix) {
                if suffix.len() == 1 && range.contains(&suffix.as_bytes()[0]) {
                    return true;
                }
            }
        }
        if code
            .strip_prefix('F')
            .and_then(|n| n.parse::<u8>().ok())
            .is_some_and(|n| (1..=12).contains(&n) && code == format!("F{n}"))
        {
            return true;
        }
        [
            "NONE",
            "MOBILE_BACK",
            "BACKSPACE",
            "TAB",
            "ENTER",
            "SHIFT_LEFT",
            "CTRL_LEFT",
            "ALT_LEFT",
            "PAUSE",
            "CAPS_LOCK",
            "ESCAPE",
            "SPACE",
            "PAGE_UP",
            "PAGE_DOWN",
            "END",
            "HOME",
            "ARROW_LEFT",
            "ARROW_UP",
            "ARROW_RIGHT",
            "ARROW_DOWN",
            "INSERT",
            "DELETE",
            "NUM_MULTIPLY",
            "NUM_PLUS",
            "NUM_SUBTRACT",
            "NUM_DECIMAL",
            "NUM_DIVIDE",
            "NUM_LOCK",
            "SCROLL_LOCK",
            "SEMICOLON",
            "EQUAL",
            "COMMA",
            "DASH",
            "PERIOD",
            "SLASH",
            "BACK_QUOTE",
            "BRACKET_LEFT",
            "BACKSLASH",
            "BRACKET_RIGHT",
            "QUOTE",
            "SHIFT_RIGHT",
            "CTRL_RIGHT",
            "ALT_RIGHT",
            "NUM_ENTER",
        ]
        .contains(&code)
    }

    fn write_cell(conn: &Connection, key: &str, cell: &Option<Cell>) -> Result<(), String> {
        match cell {
            Some(cell) if cell.text => {
                let value = String::from_utf8(cell.bytes.clone()).map_err(|e| e.to_string())?;
                conn.execute(
                    "INSERT INTO ItemTable(key,value) VALUES(?1,?2) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                    params![key, value],
                )
            }
            Some(cell) => conn.execute(
                "INSERT INTO ItemTable(key,value) VALUES(?1,?2) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
                params![key, cell.bytes],
            ),
            None => conn.execute("DELETE FROM ItemTable WHERE key=?1", [key]),
        }
        .map(|_| ())
        .map_err(|e| format!("Could not write save: {e}"))
    }

    fn backup(
        directory: &Path,
        profile_id: &str,
        source_id: &str,
        records: &Records,
    ) -> Result<(), String> {
        static NEXT: AtomicU64 = AtomicU64::new(0);
        fs::create_dir_all(directory).map_err(|e| e.to_string())?;
        let created_at = now();
        let id = format!(
            "{created_at}-{}-{}",
            std::process::id(),
            NEXT.fetch_add(1, Ordering::Relaxed)
        );
        let record = Backup {
            format_version: 1,
            profile_id: profile_id.into(),
            source_id: source_id.into(),
            created_at,
            records: records.clone(),
        };
        let mut file = OpenOptions::new()
            .create_new(true)
            .write(true)
            .mode(0o600)
            .open(directory.join(format!("{id}.json")))
            .map_err(|e| e.to_string())?;
        serde_json::to_writer(&mut file, &record).map_err(|e| e.to_string())?;
        file.flush()
            .and_then(|_| file.sync_all())
            .map_err(|e| e.to_string())?;
        // Make the backup's directory entry durable before committing the database.
        File::open(directory)
            .and_then(|f| f.sync_all())
            .map_err(|e| e.to_string())?;
        Ok(())
    }

    fn load_backup(directory: &Path, id: &str, profile_id: &str) -> Result<Backup, String> {
        if !valid_id(id) {
            return Err("Invalid backup identifier.".into());
        }
        let path = directory.join(format!("{id}.json"));
        let metadata = fs::symlink_metadata(&path).map_err(|e| e.to_string())?;
        if !metadata.is_file() || metadata.len() > (MAX_JSON * 16) as u64 {
            return Err("Unsupported backup file.".into());
        }
        let backup: Backup = serde_json::from_slice(&fs::read(path).map_err(|e| e.to_string())?)
            .map_err(|e| format!("Could not read backup: {e}"))?;
        if backup.format_version != 1 || backup.profile_id != profile_id {
            return Err("This backup belongs to a different save profile or format.".into());
        }
        Ok(backup)
    }

    pub(super) fn backups(directory: &Path, profile_id: &str) -> Result<Vec<BackupInfo>, String> {
        if !directory.is_dir() {
            return Ok(Vec::new());
        }
        let mut files = fs::read_dir(directory)
            .map_err(|e| e.to_string())?
            .filter_map(Result::ok)
            .filter(|e| e.path().extension().is_some_and(|e| e == "json"))
            .collect::<Vec<_>>();
        files.sort_by_key(|e| std::cmp::Reverse(e.file_name()));
        let mut result = Vec::new();
        for entry in files.into_iter().take(100) {
            let id = entry
                .path()
                .file_stem()
                .unwrap_or_default()
                .to_string_lossy()
                .into_owned();
            if let Ok(backup) = load_backup(directory, &id, profile_id) {
                result.push(BackupInfo {
                    id,
                    created_at: backup.created_at,
                    label: "Before save edit".into(),
                    source_id: backup.source_id,
                });
            }
        }
        result.sort_by_key(|b| std::cmp::Reverse(b.created_at));
        Ok(result)
    }

    pub(super) fn write(
        app: &tauri::AppHandle,
        profile_id: &str,
        source_id: &str,
        expected_revision: &str,
        players: Option<Value>,
        settings: Option<Value>,
        restore_id: Option<&str>,
    ) -> Result<SaveSnapshot, String> {
        let root = profile_dir(app, profile_id)?;
        let directory = backups_dir(app, profile_id)?;
        let store = app.state::<LauncherStore>();
        store.running()?;
        // Serialize against launcher_launch, so a game cannot start mid-transaction.
        let session = store.session.lock().map_err(|e| e.to_string())?;
        if session
            .as_ref()
            .is_some_and(|s| s.info.profile_id == profile_id)
        {
            return Err("Close this profile's game window before editing its save.".into());
        }
        let _profile_lock = lock_profile(&root)?;
        let source = source(&root, source_id)?;
        let path = Path::new(&source.path);
        let mut known_games = store
            .library
            .lock()
            .map_err(|e| e.to_string())?
            .games
            .iter()
            .filter_map(|game| Path::new(&game.path).canonicalize().ok())
            .collect::<Vec<_>>();
        if let Ok(exe) = std::env::current_exe() {
            known_games.push(exe);
        }
        ensure_closed(path, &known_games)?;
        let mut conn = open(path, true)?;
        commit_changes(
            &mut conn,
            &directory,
            profile_id,
            source_id,
            expected_revision,
            players,
            settings,
            restore_id,
        )
    }

    fn commit_changes(
        conn: &mut Connection,
        directory: &Path,
        profile_id: &str,
        source_id: &str,
        expected_revision: &str,
        players: Option<Value>,
        settings: Option<Value>,
        restore_id: Option<&str>,
    ) -> Result<SaveSnapshot, String> {
        let transaction = conn
            .transaction_with_behavior(rusqlite::TransactionBehavior::Immediate)
            .map_err(|e| format!("Game storage is busy; close the game and retry: {e}"))?;
        let before = records(&transaction)?;
        if revision(&before) != expected_revision {
            return Err(
                "The save changed since it was loaded. Refresh before applying your edits.".into(),
            );
        }
        let after = if let Some(id) = restore_id {
            let backup = load_backup(&directory, id, profile_id)?;
            if backup.source_id != source_id {
                return Err("Select the backup's original save source first.".into());
            }
            backup.records
        } else {
            if let Some(value) = &players {
                validate_players(value)?;
            }
            if let Some(value) = &settings {
                validate_settings(value)?;
            }
            Records {
                players: players
                    .as_ref()
                    .map(|v| encode(v, before.players.as_ref()))
                    .transpose()?
                    .or_else(|| before.players.clone()),
                settings: settings
                    .as_ref()
                    .map(|v| encode(v, before.settings.as_ref()))
                    .transpose()?
                    .or_else(|| before.settings.clone()),
            }
        };
        // Parse before touching disk, including restore files, which may be edited.
        let result = snapshot(source_id, &after)?;
        if revision(&before) == result.revision {
            return Ok(result);
        }
        backup(&directory, profile_id, source_id, &before)?;
        write_cell(&transaction, PLAYERS, &after.players)?;
        write_cell(&transaction, SETTINGS, &after.settings)?;
        transaction
            .commit()
            .map_err(|e| format!("Save could not be committed; your backup is available: {e}"))?;
        Ok(result)
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        fn temporary() -> PathBuf {
            static NEXT: AtomicU64 = AtomicU64::new(0);
            let path = std::env::temp_dir().join(format!(
                "gardendless-saves-test-{}-{}-{}",
                std::process::id(),
                now(),
                NEXT.fetch_add(1, Ordering::Relaxed)
            ));
            fs::create_dir(&path).unwrap();
            path
        }

        #[test]
        fn utf16_and_text_preserve_unicode_and_storage_type() {
            let value = serde_json::json!([{"name":"雪 🌻", "coin":123}]);
            let blob = encode(&value, None).unwrap();
            assert!(!blob.text);
            assert_eq!(parse(&blob).unwrap(), value);
            let text = encode(
                &value,
                Some(&Cell {
                    text: true,
                    bytes: vec![],
                }),
            )
            .unwrap();
            assert!(text.text);
            assert_eq!(parse(&text).unwrap(), value);
            assert!(decode(&Cell {
                text: false,
                bytes: vec![1]
            })
            .is_err());
        }

        #[test]
        fn database_roundtrip_keeps_other_keys_and_exact_backups() {
            let root = temporary();
            fs::create_dir(root.join("localstorage")).unwrap();
            let path = root.join("localstorage/tauri_localhost_0.localstorage");
            let mut conn = Connection::open(&path).unwrap();
            conn.execute_batch("CREATE TABLE ItemTable(key TEXT UNIQUE, value BLOB NOT NULL); INSERT INTO ItemTable VALUES('unrelated',X'0102');").unwrap();
            let original = Records {
                players: Some(
                    encode(&serde_json::json!([{"name":"雪 🌻","coin":1}]), None).unwrap(),
                ),
                settings: Some(
                    encode(
                        &serde_json::json!({"KeyBinds":{"Game_Pause":"SPACE"},"MusicVolume":0.5}),
                        None,
                    )
                    .unwrap(),
                ),
            };
            write_cell(&conn, PLAYERS, &original.players).unwrap();
            write_cell(&conn, SETTINGS, &original.settings).unwrap();
            let source = sources(&root).unwrap().remove(0);
            let before = read(&root, &source.id).unwrap();
            assert_eq!(before.players.as_ref().unwrap()[0]["name"], "雪 🌻");
            let directory = root.join("backups");
            backup(&directory, "default", &source.id, &original).unwrap();
            let list = backups(&directory, "default").unwrap();
            assert_eq!(list.len(), 1);
            let restored = load_backup(&directory, &list[0].id, "default").unwrap();
            assert_eq!(revision(&restored.records), before.revision);
            assert!(load_backup(&directory, &list[0].id, "other").is_err());
            assert!(load_backup(&directory, "../outside", "default").is_err());
            {
                let transaction = conn.transaction().unwrap();
                write_cell(
                    &transaction,
                    PLAYERS,
                    &Some(encode(&serde_json::json!([{"name":"Changed","coin":2}]), None).unwrap()),
                )
                .unwrap();
                // Dropping an uncommitted transaction must leave both records intact.
            }
            assert_eq!(revision(&records(&conn).unwrap()), before.revision);
            assert_eq!(
                conn.query_row(
                    "SELECT value FROM ItemTable WHERE key='unrelated'",
                    [],
                    |r| r.get::<_, Vec<u8>>(0)
                )
                .unwrap(),
                vec![1, 2]
            );
            drop(conn);
            fs::remove_dir_all(root).unwrap();
        }

        #[test]
        fn commit_rejects_stale_edits_and_restores_backup() {
            let root = temporary();
            let path = root.join("save.localstorage");
            let mut conn = Connection::open(&path).unwrap();
            conn.execute_batch("CREATE TABLE ItemTable(key TEXT UNIQUE,value BLOB NOT NULL); INSERT INTO ItemTable VALUES('unrelated',X'0102');").unwrap();
            let original = serde_json::json!([{"name":"Fixture","coin":7,"unknown":{"keep":true}}]);
            write_cell(&conn, PLAYERS, &Some(encode(&original, None).unwrap())).unwrap();
            let before = snapshot("fixture", &records(&conn).unwrap()).unwrap();
            let directory = root.join("backups");
            let changed = serde_json::json!([{"name":"Fixture","coin":9,"unknown":{"keep":true}}]);
            let after = commit_changes(
                &mut conn,
                &directory,
                "default",
                "fixture",
                &before.revision,
                Some(changed),
                None,
                None,
            )
            .unwrap();
            assert!(commit_changes(
                &mut conn,
                &directory,
                "default",
                "fixture",
                &before.revision,
                Some(original.clone()),
                None,
                None
            )
            .is_err());
            let list = backups(&directory, "default").unwrap();
            assert_eq!(list.len(), 1);
            let restored = commit_changes(
                &mut conn,
                &directory,
                "default",
                "fixture",
                &after.revision,
                None,
                None,
                Some(&list[0].id),
            )
            .unwrap();
            assert_eq!(restored.revision, before.revision);
            assert_eq!(restored.players, Some(original));
            assert_eq!(backups(&directory, "default").unwrap().len(), 2);
            assert_eq!(
                conn.query_row(
                    "SELECT value FROM ItemTable WHERE key='unrelated'",
                    [],
                    |row| row.get::<_, Vec<u8>>(0)
                )
                .unwrap(),
                vec![1, 2]
            );
            drop(conn);
            fs::remove_dir_all(root).unwrap();
        }

        #[test]
        fn validation_rejects_malformed_save_and_settings() {
            assert!(validate_players(&serde_json::json!([{"name":"Player","coin":-1}])).is_err());
            assert!(validate_players(&serde_json::json!([])).is_err());
            assert!(validate_players(&serde_json::json!([{"name":"Player","coin":2}])).is_ok());
            assert!(validate_settings(&serde_json::json!({"KeyBinds":{"Game_Pause":42}})).is_err());
        }

        #[test]
        fn profile_lock_blocks_concurrent_writer() {
            let root = temporary();
            let held = lock_profile(&root).unwrap();
            assert!(lock_profile(&root).is_err());
            drop(held);
            assert!(lock_profile(&root).is_ok());
            fs::remove_dir_all(root).unwrap();
        }
    }
}

#[tauri::command]
pub async fn launcher_save_sources(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
) -> Result<SaveSources, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        let root = profile_dir(&app, &profile_id)?;
        #[cfg(target_os = "linux")]
        {
            let sources = native::sources(&root)?;
            let message = sources.is_empty().then(|| "No local game save yet. Launch this profile and create a player, then close the game and refresh.".into());
            Ok(SaveSources { supported:true, message, sources, backups:native::backups(&backups_dir(&app,&profile_id)?, &profile_id)? })
        }
        #[cfg(not(target_os = "linux"))]
        {
            let _ = root;
            Ok(SaveSources { supported:false, message:Some("Direct access to WebView2 saves is not available yet. Import a JSON export from the game to edit it here, then import the edited file in GP-Next.".into()), sources:vec![], backups:vec![] })
        }
    }).await.map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn launcher_save_read(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
    source_id: String,
) -> Result<SaveSnapshot, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        let root = profile_dir(&app, &profile_id)?;
        #[cfg(target_os = "linux")]
        {
            native::read(&root, &source_id)
        }
        #[cfg(not(target_os = "linux"))]
        {
            let _ = (root, source_id);
            Err("Direct save access is currently supported on Linux.".into())
        }
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn launcher_save_write(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
    source_id: String,
    revision: String,
    players: Option<Value>,
    settings: Option<Value>,
) -> Result<SaveSnapshot, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        #[cfg(target_os = "linux")]
        {
            native::write(
                &app,
                &profile_id,
                &source_id,
                &revision,
                players,
                settings,
                None,
            )
        }
        #[cfg(not(target_os = "linux"))]
        {
            let _ = (app, profile_id, source_id, revision, players, settings);
            Err("Direct save editing is currently supported on Linux.".into())
        }
    })
    .await
    .map_err(|e| e.to_string())?
}

#[tauri::command]
pub async fn launcher_save_restore(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
    source_id: String,
    backup_id: String,
    revision: String,
) -> Result<SaveSnapshot, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        #[cfg(target_os = "linux")]
        {
            native::write(
                &app,
                &profile_id,
                &source_id,
                &revision,
                None,
                None,
                Some(&backup_id),
            )
        }
        #[cfg(not(target_os = "linux"))]
        {
            let _ = (app, profile_id, source_id, backup_id, revision);
            Err("Direct save restore is currently supported on Linux.".into())
        }
    })
    .await
    .map_err(|e| e.to_string())?
}
