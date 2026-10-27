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
    let requested = std::env::var("GARDENDLESS_WINDOW_BACKEND").unwrap_or_else(|_| "auto".into());
    let nvidia_fallback = std::env::var("WEBKIT_DISABLE_DMABUF_RENDERER").as_deref() == Ok("1")
        && (std::path::Path::new("/sys/module/nvidia").exists()
            || gpu_selection::discover(
                std::path::Path::new("/sys/class/drm"),
                std::path::Path::new("/dev/dri"),
            )
            .iter()
            .any(|gpu| gpu.vendor == "0x10de"));
    let backend = window_backend(
        &requested,
        nvidia_fallback,
        std::env::var_os("DISPLAY").is_some(),
        std::env::var_os("WAYLAND_DISPLAY").is_some(),
    );
    if let Some(backend) = backend {
        if requested != "auto" || std::env::var_os("GDK_BACKEND").is_none() {
            std::env::set_var("GDK_BACKEND", backend);
            eprintln!("[GPU] Window backend: {backend}; WebGL acceleration remains enabled");
        }
    }
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

// X11 avoids the NVIDIA/Wayland buffer-sharing path while preserving WebGL.
fn window_backend(
    requested: &str,
    fallback: bool,
    x11: bool,
    wayland: bool,
) -> Option<&'static str> {
    match requested {
        "x11" if x11 => Some("x11"),
        "wayland" if wayland => Some("wayland"),
        "auto" if fallback && x11 => Some("x11"),
        _ => None,
    }
}
#[cfg(test)]
mod backend_tests {
    use super::window_backend;
    #[test]
    fn nvidia_fallback_uses_available_x11_without_forcing_software() {
        assert_eq!(window_backend("auto", true, true, true), Some("x11"));
        assert_eq!(window_backend("auto", true, false, true), None);
        assert_eq!(window_backend("auto", false, true, true), None);
        assert_eq!(window_backend("wayland", true, true, true), Some("wayland"));
    }
}
