//! Stream PNG renders into an completed ZIP export; no save/profile access.
use base64::{engine::general_purpose::STANDARD, Engine};
use std::{
    fs::{self, File},
    io::Write,
    path::PathBuf,
    sync::Mutex,
};
use tauri::{Manager, WebviewWindow};
use tauri_plugin_dialog::DialogExt;
use zip::{write::SimpleFileOptions, ZipWriter};
struct Job {
    writer: ZipWriter<File>,
    temporary: PathBuf,
    destination: PathBuf,
    entries: std::collections::HashSet<String>,
}
#[derive(Default)]
pub struct RenderExports(Mutex<Option<Job>>);
fn exporter(window: &WebviewWindow) -> Result<(), String> {
    if window.label() == "render-export" {
        Ok(())
    } else {
        Err("Only the render exporter can write this archive".into())
    }
}
#[tauri::command]
pub async fn launcher_render_export(
    window: WebviewWindow,
    app: tauri::AppHandle,
    generator: Option<bool>,
) -> Result<bool, String> {
    super::require_launcher(&window)?;
    if let Some(existing) = app.get_webview_window("render-export") {
        existing.set_focus().map_err(|e| e.to_string())?;
        return Ok(true);
    }
    let handle = app.clone();
    let destination = tauri::async_runtime::spawn_blocking(move || {
        handle
            .dialog()
            .file()
            .set_title("Export character and misc PNGs")
            .set_file_name("gardendless-renders.zip")
            .add_filter("ZIP", &["zip"])
            .blocking_save_file()
    })
    .await
    .map_err(|e| e.to_string())?;
    let Some(destination) = destination else {
        return Ok(false);
    };
    let destination = destination.into_path().map_err(|e| e.to_string())?;
    // A save portal may grant only the chosen file, not sibling temporaries.
    let cache = app
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("render-exports");
    fs::create_dir_all(&cache).map_err(|e| e.to_string())?;
    let temporary = cache.join(format!("renders-{}.zip.part", super::now()));
    let file = fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&temporary)
        .map_err(|e| e.to_string())?;
    *app.state::<RenderExports>()
        .0
        .lock()
        .map_err(|e| e.to_string())? = Some(Job {
        writer: ZipWriter::new(file),
        temporary,
        destination,
        entries: Default::default(),
    });
    if let Err(error) = tauri::WebviewWindowBuilder::new(
        &app,
        "render-export",
        tauri::WebviewUrl::App("launcher/RenderExport.html".into()),
    )
    .title("Gardendless · Character renders")
    .initialization_script(if generator.unwrap_or(false) {
        "window.__GD_RENDER_GENERATOR__ = true;"
    } else {
        "window.__GD_RENDER_GENERATOR__ = false;"
    })
    .inner_size(800., 720.)
    .data_directory(
        app.path()
            .app_cache_dir()
            .map_err(|e| e.to_string())?
            .join("render-webview-full-png-v1"),
    )
    .build()
    {
        abort(&app);
        return Err(error.to_string());
    }
    Ok(true)
}
fn valid_name(name: &str) -> bool {
    !name.is_empty()
        && name.len() < 500
        && !name.contains(['\\', ':', '\0'])
        && name
            .split('/')
            .all(|p| !p.is_empty() && p != "." && p != "..")
}
#[tauri::command]
pub async fn render_export_png(
    window: WebviewWindow,
    app: tauri::AppHandle,
    name: String,
    base64: String,
) -> Result<(), String> {
    exporter(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        if !valid_name(&name)
            || !name.ends_with(".png")
            || !(name.starts_with("plants/")
                || name.starts_with("zombies/")
                || name.starts_with("misc/"))
            || base64.len() > 24 * 1024 * 1024
        {
            return Err("Invalid rendered PNG entry".into());
        }
        let bytes = STANDARD.decode(base64).map_err(|e| e.to_string())?;
        if bytes.len() < 24 || &bytes[..8] != b"\x89PNG\r\n\x1a\n" || &bytes[12..16] != b"IHDR" {
            return Err("Expected PNG data".into());
        }
        let width = u32::from_be_bytes(bytes[16..20].try_into().unwrap());
        let height = u32::from_be_bytes(bytes[20..24].try_into().unwrap());
        if width == 0 || height == 0 || width > 4096 || height > 4096 {
            return Err("PNG dimensions exceed limits".into());
        }
        let state = app.state::<RenderExports>();
        let mut state = state.0.lock().map_err(|e| e.to_string())?;
        let job = state.as_mut().ok_or("No render export is active")?;
        if job.entries.len() >= 100000 || !job.entries.insert(name.clone()) {
            return Err("Duplicate or excessive render entries".into());
        }
        job.writer
            .start_file(
                name,
                SimpleFileOptions::default().compression_method(zip::CompressionMethod::Stored),
            )
            .map_err(|e| e.to_string())?;
        job.writer.write_all(&bytes).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn render_export_finish(
    window: WebviewWindow,
    app: tauri::AppHandle,
    manifest: serde_json::Value,
) -> Result<String, String> {
    exporter(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        let json = serde_json::to_vec_pretty(&manifest).map_err(|e| e.to_string())?;
        if json.len() > 64 * 1024 * 1024 {
            return Err("Render manifest is too large".into());
        }
        let mut job = app
            .state::<RenderExports>()
            .0
            .lock()
            .map_err(|e| e.to_string())?
            .take()
            .ok_or("No render export is active")?;
        let result = (|| {
            job.writer
                .start_file("manifest.json", SimpleFileOptions::default())
                .map_err(|e| e.to_string())?;
            job.writer.write_all(&json).map_err(|e| e.to_string())?;
            job.writer
                .finish()
                .map_err(|e| e.to_string())?
                .sync_all()
                .map_err(|e| e.to_string())?;
            fs::copy(&job.temporary, &job.destination).map_err(|e| e.to_string())?;
            fs::remove_file(&job.temporary).map_err(|e| e.to_string())?;
            Ok(job.destination.to_string_lossy().into_owned())
        })();
        if result.is_err() {
            let _ = fs::remove_file(&job.temporary);
        }
        result
    })
    .await
    .map_err(|e| e.to_string())?
}
pub fn abort(app: &tauri::AppHandle) {
    if let Ok(mut state) = app.state::<RenderExports>().0.lock() {
        if let Some(job) = state.take() {
            drop(job.writer);
            let _ = fs::remove_file(job.temporary);
        }
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn archive_names_are_relative() {
        for n in [
            "../x.png",
            "/x.png",
            "plants/../x.png",
            "plants/a\\b.png",
            "plants/a:stream.png",
            "",
        ] {
            assert!(!valid_name(n));
        }
        assert!(valid_name("plants/peashooter/peashooter__Idle.png"));
    }
}
