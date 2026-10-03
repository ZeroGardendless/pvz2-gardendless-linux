mod discord;
pub(crate) mod gpu_selection;
pub mod rendering;
mod window;

pub fn configure_environment() {
    // Match the desktop entry on Wayland and X11, including isolated save profiles.
    // The storage identifier may vary per profile; desktop identity must not.
    webkit2gtk::glib::set_prgname(Some("com.zero.gardendless"));
    webkit2gtk::glib::set_application_name("PvZ2 Gardendless");
    if std::env::args().any(|argument| argument == "--safe-graphics") {
        std::env::set_var("GARDENDLESS_GPU_MODE", "system");
        std::env::set_var("GARDENDLESS_DMABUF", "0");
        // XWayland is a useful escape hatch for compositor/driver interop bugs.
        // Never request it on a session which has no X display.
        if std::env::var_os("DISPLAY").is_some() {
            std::env::set_var("GDK_BACKEND", "x11");
        }
        eprintln!("[GPU] Compatibility mode: system GPU, DMA-BUF disabled");
    }
    // Request unsynchronized swaps for this app and its WebKit children.
    // Mesa and NVIDIA use different options. Preserve explicit user overrides;
    // Wayland/compositor presentation may still follow the monitor refresh.
    for variable in ["vblank_mode", "__GL_SYNC_TO_VBLANK"] {
        if std::env::var_os(variable).is_none() {
            std::env::set_var(variable, "0");
        }
    }
    // Let GStreamer discover its distribution's plugin directories. Overriding
    // GST_PLUGIN_SYSTEM_PATH_1_0 hides defaults such as /usr/lib64 on Fedora.

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
