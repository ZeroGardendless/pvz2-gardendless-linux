mod discord;
mod gpu_selection;
pub mod rendering;
mod window;

pub fn configure_environment() {
    // Request unsynchronized swaps for this app and its WebKit children.
    // Mesa and NVIDIA use different options. Preserve explicit user overrides;
    // Wayland/compositor presentation may still follow the monitor refresh.
    for variable in ["vblank_mode", "__GL_SYNC_TO_VBLANK"] {
        if std::env::var_os(variable).is_none() {
            std::env::set_var(variable, "0");
        }
    }
    if std::env::var("GST_PLUGIN_SYSTEM_PATH_1_0").is_err() {
        std::env::set_var(
            "GST_PLUGIN_SYSTEM_PATH_1_0",
            "/usr/lib/gstreamer-1.0:/usr/lib/x86_64-linux-gnu/gstreamer-1.0",
        );
    }

    gpu_selection::configure();
}

pub fn bridge_discord() {
    discord::bridge_socket();
}

pub fn hide_titlebar_for_tiling_window_manager(window: &tauri::WebviewWindow) -> tauri::Result<()> {
    if window::is_tiling_window_manager() {
        window.set_decorations(false)?;
    }
    Ok(())
}
