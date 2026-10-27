//! Read only launcher-created session logs; never accept arbitrary filesystem paths.
use super::{data_root, require_launcher};
use serde::Serialize;
use std::{
    fs::{self, File},
    io::{Read, Seek, SeekFrom},
    path::Path,
};
use tauri::WebviewWindow;
fn valid_log(name: &str) -> bool {
    name.strip_prefix("game-")
        .or_else(|| name.strip_prefix("launcher-"))
        .and_then(|s| s.strip_suffix(".log"))
        .is_some_and(|id| {
            !id.is_empty() && id.len() <= 20 && id.bytes().all(|b| b.is_ascii_digit())
        })
}
#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
pub struct LogFile {
    name: String,
    size: u64,
    modified_at: u64,
}
#[derive(Serialize)]
pub struct LogText {
    pub text: String,
    pub truncated: bool,
}
fn tail(path: &Path) -> Result<LogText, String> {
    let metadata = fs::symlink_metadata(path).map_err(|e| e.to_string())?;
    if !metadata.is_file() {
        return Err("Not a regular session log".into());
    }
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let length = metadata.len();
    let start = length.saturating_sub(256 * 1024);
    file.seek(SeekFrom::Start(start))
        .map_err(|e| e.to_string())?;
    let mut bytes = Vec::new();
    file.take(256 * 1024)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if start > 0 {
        if let Some(newline) = bytes.iter().position(|b| *b == b'\n') {
            bytes.drain(..=newline);
        }
    }
    Ok(LogText {
        text: String::from_utf8_lossy(&bytes).into_owned(),
        truncated: start > 0,
    })
}
#[tauri::command]
pub fn launcher_logs(window: WebviewWindow, app: tauri::AppHandle) -> Result<Vec<LogFile>, String> {
    require_launcher(&window)?;
    let root = data_root(&app)?.join("logs");
    if !root.exists() {
        return Ok(Vec::new());
    }
    let mut result = Vec::new();
    for entry in fs::read_dir(root)
        .map_err(|e| e.to_string())?
        .filter_map(Result::ok)
    {
        let name = entry.file_name().to_string_lossy().into_owned();
        if !valid_log(&name) {
            continue;
        }
        let Ok(metadata) = fs::symlink_metadata(entry.path()) else {
            continue;
        };
        if !metadata.is_file() {
            continue;
        }
        let modified_at = metadata
            .modified()
            .ok()
            .and_then(|t| t.duration_since(std::time::UNIX_EPOCH).ok())
            .map(|d| d.as_millis() as u64)
            .unwrap_or_default();
        result.push(LogFile {
            name,
            size: metadata.len(),
            modified_at,
        });
    }
    result.sort_unstable_by(|a, b| b.modified_at.cmp(&a.modified_at));
    result.truncate(100);
    Ok(result)
}
#[tauri::command]
pub fn launcher_log_read(
    window: WebviewWindow,
    app: tauri::AppHandle,
    name: String,
) -> Result<LogText, String> {
    require_launcher(&window)?;
    if !valid_log(&name) {
        return Err("Invalid session log".into());
    }
    tail(&data_root(&app)?.join("logs").join(name))
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn log_names_are_scoped() {
        assert!(valid_log("game-123.log"));
        for name in [
            "../game-123.log",
            "game-.log",
            "game-123.log/../secret",
            "other.log",
        ] {
            assert!(!valid_log(name));
        }
    }
    #[test]
    fn large_log_tail_is_bounded() {
        let path = std::env::temp_dir().join(format!("gd-log-{}.txt", super::super::new_id()));
        fs::write(&path, "line\n".repeat(80_000)).unwrap();
        let result = tail(&path).unwrap();
        assert!(result.truncated);
        assert!(result.text.len() <= 256 * 1024);
        assert!(result.text.starts_with("line\n"));
        fs::remove_file(path).unwrap();
    }
}
