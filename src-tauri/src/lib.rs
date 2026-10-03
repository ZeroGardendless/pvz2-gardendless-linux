mod launcher;
mod platform;
use tauri::Manager;

pub fn run(mut context: tauri::Context<tauri::Wry>) {
    let game_mode = std::env::args().any(|arg| arg == "--game");
    let launch_context = if game_mode {
        launcher::game_context().expect("Invalid game launch profile")
    } else {
        None
    };
    if let Some(profile) = launch_context
        .as_ref()
        .map(|c| &c.profile)
        .filter(|p| p.id != "default")
    {
        context.config_mut().identifier =
            format!("{}.profile.{}", launcher::IDENTIFIER, profile.id);
    }
    let mut window_config = context
        .config()
        .app
        .windows
        .first()
        .cloned()
        .unwrap_or_default();
    context.config_mut().app.windows.clear();
    if !game_mode {
        window_config.label = "launcher".into();
        window_config.title = "Gardendless Launcher".into();
        window_config.url = tauri::WebviewUrl::App("launcher/index.html".into());
        window_config.width = 1180.;
        window_config.height = 780.;
        window_config.min_width = Some(360.);
        window_config.min_height = Some(480.);
    }
    #[cfg(target_os = "linux")]
    platform::linux::configure_environment();

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_drpc::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            launcher::launcher_state,
            launcher::launcher_running,
            launcher::launcher_diagnostics,
            launcher::launcher_caelestia_scheme,
            launcher::launcher_gpnext_packages,
            launcher::launcher_pick_game,
            launcher::launcher_export_json,
            launcher::saves::launcher_save_sources,
            launcher::saves::launcher_save_read,
            launcher::saves::launcher_save_write,
            launcher::saves::launcher_save_restore,
            launcher::launcher_import_game,
            launcher::launcher_remove_game,
            launcher::launcher_save_profile,
            launcher::launcher_delete_profile,
            launcher::launcher_launch,
            launcher::launcher_game_context,
            launcher::game_discord_available,
            launcher::launcher_open_folder,
            launcher::releases::launcher_releases,
            launcher::releases::launcher_install_release,
            launcher::releases::launcher_cancel_download,
            launcher::releases::launcher_download_status,
        ])
        .setup(move |app| {
            let mut builder = tauri::WebviewWindowBuilder::from_config(app, &window_config)?;
            if game_mode {
                app.manage(launcher::GameLock {
                    _file: launcher::profile_lock(app.handle())?,
                });
            } else {
                app.manage(launcher::LauncherStore::new(app.handle())?);
                app.manage(launcher::releases::Downloads::default());
                builder =
                    builder.data_directory(launcher::data_root(app.handle())?.join("webview"));
            }
            let _window = builder.build()?;
            #[cfg(target_os = "linux")]
            {
                platform::linux::hide_titlebar_for_tiling_window_manager(&_window)?;
                if game_mode {
                    _window.with_webview(|webview| {
                        platform::linux::rendering::configure(&webview.inner())
                    })?;
                    platform::linux::bridge_discord();
                }
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            if window.label() == "launcher" {
                if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                    if window
                        .app_handle()
                        .try_state::<launcher::LauncherStore>()
                        .and_then(|s| s.running().ok().flatten())
                        .is_some()
                    {
                        // Keep process ownership and profile locks while the game runs.
                        api.prevent_close();
                        let _ = window.minimize();
                    }
                }
            }
        })
        .run(context)
        .expect("error while running Gardendless");
}
