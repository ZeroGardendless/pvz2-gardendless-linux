mod platform;

pub fn run(context: tauri::Context<tauri::Wry>) {
    // GPU and driver configuration must precede GTK/WebKit initialization.
    #[cfg(target_os = "linux")]
    platform::linux::configure_environment();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_drpc::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_dialog::init())
        .setup(|_app| {
            #[cfg(target_os = "linux")]
            {
                use tauri::Manager;
                if let Some(window) = _app.get_webview_window("main") {
                    platform::linux::hide_titlebar_for_tiling_window_manager(&window)?;
                    window.with_webview(|webview| {
                        platform::linux::rendering::configure(&webview.inner())
                    })?;
                }
                platform::linux::bridge_discord();
            }
            Ok(())
        })
        .run(context)
        .expect("error while running tauri application");
}
