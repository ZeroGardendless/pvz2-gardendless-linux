//! The official signed-in Gardenest UI stays in an isolated remote webview.
//! No launcher/game IPC capability is granted to this window.
use super::{data_root, require_launcher};
use serde::Serialize;
use tauri::{
    webview::DownloadEvent, Emitter, Manager, WebviewUrl, WebviewWindow, WebviewWindowBuilder,
};
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Download {
    path: Option<String>,
    name: String,
    success: bool,
}
fn route(section: &str) -> Result<&'static str, String> {
    match section {
        "discover" => Ok("/discover"),
        "account" => Ok("/login"),
        "tasks" => Ok("/tasks"),
        "creator" => Ok("/author"),
        _ => Err("Unknown Gardenest section".into()),
    }
}
#[tauri::command]
pub fn launcher_gardenest(
    window: WebviewWindow,
    app: tauri::AppHandle,
    section: String,
) -> Result<(), String> {
    require_launcher(&window)?;
    let url: tauri::Url = format!("https://nest.pvzge.com{}", route(&section)?)
        .parse::<tauri::Url>()
        .map_err(|e| e.to_string())?;
    if let Some(existing) = app.get_webview_window("gardenest") {
        existing.navigate(url).map_err(|e| e.to_string())?;
        existing.show().map_err(|e| e.to_string())?;
        return existing.set_focus().map_err(|e| e.to_string());
    }
    let downloads = data_root(&app)?.join("gardenest-downloads");
    std::fs::create_dir_all(&downloads).map_err(|e| e.to_string())?;
    let events = app.clone();
    WebviewWindowBuilder::new(&app, "gardenest", WebviewUrl::External(url))
        .title("Gardenest · Gardendless")
        .inner_size(1080.0, 760.0)
        .min_inner_size(360.0, 480.0)
        .on_navigation(|url| url.scheme() == "https" || url.scheme() == "about")
        .on_download(move |_, event| {
            match event {
                DownloadEvent::Requested { url, destination } => {
                    // Authenticated downloads remain in the official site's webview;
                    // the launcher never reads or stores credentials itself.
                    if !(url.scheme() == "https"
                        || url.as_str().starts_with("blob:https://nest.pvzge.com/"))
                    {
                        return false;
                    }
                    let name = destination
                        .file_name()
                        .and_then(|n| n.to_str())
                        .unwrap_or("download.zip");
                    let name: String = name
                        .chars()
                        .filter(|c| c.is_alphanumeric() || " ._-".contains(*c))
                        .take(100)
                        .collect();
                    if name.is_empty() {
                        return false;
                    }
                    *destination = downloads.join(format!("{}-{name}", super::new_id()));
                    true
                }
                DownloadEvent::Finished { path, success, .. } => {
                    let name = path
                        .as_ref()
                        .and_then(|p| p.file_name())
                        .unwrap_or_default()
                        .to_string_lossy()
                        .into_owned();
                    let _ = events.emit_to(
                        "launcher",
                        "gardenest-download",
                        Download {
                            path: path.map(|p| p.to_string_lossy().into_owned()),
                            name,
                            success,
                        },
                    );
                    true
                }
                _ => false,
            }
        })
        .build()
        .map_err(|e| e.to_string())?;
    Ok(())
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn official_routes_only() {
        assert_eq!(route("tasks").unwrap(), "/tasks");
        assert!(route("https://example.com").is_err());
    }
}
