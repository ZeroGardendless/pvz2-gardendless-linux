//! Native services required by the bundled GP-Next startup/window bridge.
use std::fs;
use tauri::{Manager, WebviewWindow};

fn require_game(window: &WebviewWindow) -> Result<(), String> {
    if window.label() != "main" {
        return Err("This command is available only in the game".into());
    }
    Ok(())
}

#[tauri::command]
pub fn cloud_journal_read(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<Option<String>, String> {
    require_game(&window)?;
    let path = app
        .path()
        .app_data_dir()
        .map_err(|e| e.to_string())?
        .join("gp-next/cloud-restore-journal.json");
    match fs::read_to_string(path) {
        Ok(text) if text.len() <= 10 * 1024 * 1024 => Ok(Some(text)),
        Ok(_) => Err("CLOUD_JOURNAL_TOO_LARGE".into()),
        Err(error) if error.kind() == std::io::ErrorKind::NotFound => Ok(None),
        Err(error) => Err(error.to_string()),
    }
}
#[tauri::command]
pub fn open_devtools(window: WebviewWindow) -> Result<(), String> {
    require_game(&window)?;
    window.open_devtools();
    Ok(())
}
#[tauri::command]
pub fn close_devtools(window: WebviewWindow) -> Result<(), String> {
    require_game(&window)?;
    window.close_devtools();
    Ok(())
}
#[tauri::command]
pub fn toggle_devtools(window: WebviewWindow) -> Result<(), String> {
    require_game(&window)?;
    if window.is_devtools_open() {
        window.close_devtools();
    } else {
        window.open_devtools();
    }
    Ok(())
}

#[derive(serde::Deserialize)]
pub struct UiLogEntry {
    level: String,
    message: String,
}
#[tauri::command]
pub fn ui_log(
    window: WebviewWindow,
    app: tauri::AppHandle,
    entries: Vec<UiLogEntry>,
) -> Result<(), String> {
    if !["main", "launcher"].contains(&window.label()) {
        return Err("Unknown local UI".into());
    }
    if entries.len() > 20 {
        return Err("Too many UI log entries".into());
    }
    let mut lines = String::new();
    for entry in entries {
        if !["warn", "error"].contains(&entry.level.as_str()) || entry.message.len() > 16384 {
            return Err("Invalid UI log entry".into());
        }
        lines.push_str(&format!(
            "[UI:{}] {}\n",
            entry.level,
            entry.message.replace('\0', "")
        ));
    }
    if window.label() == "main" {
        eprint!("{lines}");
        return Ok(());
    }
    use std::io::Write;
    let root = crate::launcher::data_root(&app)?.join("logs");
    fs::create_dir_all(&root).map_err(|e| e.to_string())?;
    let path = root.join("launcher-0.log");
    if fs::metadata(&path).is_ok_and(|m| m.len() > 1024 * 1024) {
        let _ = fs::rename(&path, root.join("launcher-1.log"));
    }
    let mut file = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(path)
        .map_err(|e| e.to_string())?;
    file.write_all(lines.as_bytes()).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn cloud_open(window: WebviewWindow, app: tauri::AppHandle) -> Result<(), String> {
    require_game(&window)?;
    if let Some(existing) = app.get_webview_window("cloud-status") {
        existing.show().map_err(|e| e.to_string())?;
        return existing.set_focus().map_err(|e| e.to_string());
    }
    tauri::WebviewWindowBuilder::new(
        &app,
        "cloud-status",
        tauri::WebviewUrl::App("launcher/CloudStatus.html".into()),
    )
    .title("Cloud saves · Gardendless")
    .inner_size(520., 500.)
    .min_inner_size(360., 360.)
    .build()
    .map_err(|e| e.to_string())?;
    Ok(())
}
