#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Fast audio file reads over Tauri IPC. Fetching through the tauri:// custom
// protocol starves under load (hundreds of queued requests), which froze the
// page during SFX storms; raw IPC responses have none of that overhead.
#[tauri::command]
fn read_audio(path: String) -> Result<tauri::ipc::Response, String> {
    use std::sync::OnceLock;
    static ROOT: OnceLock<std::path::PathBuf> = OnceLock::new();
    let root = ROOT.get_or_init(|| {
        std::fs::canonicalize(
            std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../public"),
        )
        .unwrap_or_else(|_| {
            std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../public")
        })
    });
    let full = root.join(path.trim_start_matches('/'));
    // Path traversal guard: only files under the frontend root are served.
    let canon = std::fs::canonicalize(&full).map_err(|_| "not found".to_string())?;
    if !canon.starts_with(root) {
        return Err("forbidden".into());
    }
    let bytes = std::fs::read(&canon).map_err(|e| e.to_string())?;
    Ok(tauri::ipc::Response::new(bytes))
}

// Local asset server. WebKitGTK's media pipeline (GStreamer) cannot fetch
// tauri:// custom-scheme URLs at all, and fetches through that handler starve
// under the game's preload storm. Serving the frontend directory over real
// HTTP on loopback lets <audio> elements load natively, quickly, and in
// parallel.
const ASSET_PORT: u16 = 8123;

// The frontend must live next to the binary (or one level up for dev
// layouts); the compiled-in path is only a dev-machine fallback.
fn find_public_dir() -> std::path::PathBuf {
    if let Ok(exe) = std::env::current_exe() {
        if let Some(dir) = exe.parent() {
            for cand in [dir.join("public"), dir.parent().unwrap_or(dir).join("public")] {
                if cand.join("index.html").exists() {
                    return cand;
                }
            }
        }
    }
    if let Ok(cwd) = std::env::current_dir() {
        if cwd.join("public").join("index.html").exists() {
            return cwd.join("public");
        }
    }
    std::path::PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../public")
}

fn spawn_asset_server(root: std::path::PathBuf) {
    std::thread::spawn(move || {
        use std::io::{Read, Write};
        // Canonicalize so the traversal guard below never trips on the root's
        // own ".." component (e.g. "src-tauri/../public").
        let root = std::fs::canonicalize(&root).unwrap_or(root);
        let listener = match std::net::TcpListener::bind(("127.0.0.1", ASSET_PORT)) {
            Ok(l) => l,
            Err(e) => {
                eprintln!("[asset-server] failed to bind port {ASSET_PORT}: {e}");
                return;
            }
        };
        eprintln!("[asset-server] serving {} on port {ASSET_PORT}", root.display());
        for stream in listener.incoming() {
            let Ok(mut stream) = stream else { continue };
            let root = root.clone();
            std::thread::spawn(move || {
                let mut buf = [0u8; 4096];
                let n = match stream.read(&mut buf) {
                    Ok(n) => n,
                    Err(_) => return,
                };
                let req = String::from_utf8_lossy(&buf[..n]);
                let path = req.split(' ').nth(1).unwrap_or("/").split('?').next().unwrap_or("/");
                let clean = path.trim_start_matches('/');
                let full = root.join(clean);
                // Path traversal guard: only files under root are served.
                if full.components().any(|c| c.as_os_str() == "..") {
                    let _ = stream.write_all(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nAccess-Control-Allow-Origin: *\r\n\r\n");
                    return;
                }
                match std::fs::read(&full) {
                    Ok(data) => {
                        let mime = match full.extension().and_then(|e| e.to_str()) {
                            Some("mp3") => "audio/mpeg",
                            Some("json") => "application/json",
                            Some("png") => "image/png",
                            Some("js") => "application/javascript",
                            _ => "application/octet-stream",
                        };
                        let head = format!(
                            "HTTP/1.1 200 OK\r\nContent-Type: {mime}\r\nContent-Length: {}\r\nAccess-Control-Allow-Origin: *\r\nConnection: close\r\n\r\n",
                            data.len()
                        );
                        let _ = stream.write_all(head.as_bytes());
                        let _ = stream.write_all(&data);
                    }
                    Err(_) => {
                        let _ = stream.write_all(b"HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nAccess-Control-Allow-Origin: *\r\n\r\n");
                    }
                }
            });
        }
    });
}

fn main() {
    // Force WebKit/GStreamer to look in standard system directories inside AppImages
    #[cfg(target_os = "linux")]
    {
        if std::env::var("GST_PLUGIN_SYSTEM_PATH_1_0").is_err() {
            std::env::set_var(
                "GST_PLUGIN_SYSTEM_PATH_1_0",
                "/usr/lib/gstreamer-1.0:/usr/lib/x86_64-linux-gnu/gstreamer-1.0",
            );
        }

        // WebKitGTK's DMABUF renderer crashes on many Wayland setups with
        // "Error 71 (Protocol error) dispatching to Wayland display" - fine on
        // the dev machine, fatal on others. Ship safe: disable unless the user
        // opts back in with GARDENDLESS_DMABUF=1.
        if std::env::var("WEBKIT_DISABLE_DMABUF_RENDERER").is_err()
            && std::env::var("GARDENDLESS_DMABUF").ok().as_deref() != Some("1")
        {
            std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
    }

    // Serve the frontend over loopback HTTP for the media pipeline.
    spawn_asset_server(find_public_dir());

    tauri::Builder::default()
    .plugin(tauri_plugin_opener::init())
    .plugin(tauri_plugin_drpc::init())
    .plugin(tauri_plugin_fs::init())
    .plugin(tauri_plugin_deep_link::init())
    .plugin(tauri_plugin_dialog::init())
    .invoke_handler(tauri::generate_handler![read_audio])
    .setup(|_app| {
        // Automatically bridge Flatpak, Snap, or custom Discord client sockets on Linux
        #[cfg(target_os = "linux")]
        {
            if let Ok(runtime_dir) = std::env::var("XDG_RUNTIME_DIR") {
                let runtime_path = std::path::PathBuf::from(&runtime_dir);
                let base_socket = runtime_path.join("discord-ipc-0");

                if !base_socket.exists() {
                    let candidate_paths = [
                        // Official Discord
                        "app/com.discordapp.Discord/discord-ipc-0",
                        "app/com.discordapp.DiscordCanary/discord-ipc-0",
                        "snap.discord/discord-ipc-0",
                        "snap.discord-canary/discord-ipc-0",
                        // Equibop candidates
                        "app/io.github.equibop.Equibop/discord-ipc-0",
                        "app/com.equibop.Equibop/discord-ipc-0",
                        "app/org.equibop.Equibop/discord-ipc-0",
                        // Vesktop / Vencord
                        "app/dev.vencord.Vesktop/discord-ipc-0",
                    ];

                    let mut target_socket = candidate_paths
                    .iter()
                    .map(|p| runtime_path.join(p))
                    .find(|p| p.exists());

                    // Dynamic fallback scan inside $XDG_RUNTIME_DIR/app/ for any flatpak client exposing discord-ipc-0
                    if target_socket.is_none() {
                        if let Ok(entries) = std::fs::read_dir(runtime_path.join("app")) {
                            for entry in entries.flatten() {
                                let candidate = entry.path().join("discord-ipc-0");
                                if candidate.exists() {
                                    target_socket = Some(candidate);
                                    break;
                                }
                            }
                        }
                    }

                    if let Some(socket) = target_socket {
                        let _ = std::os::unix::fs::symlink(&socket, &base_socket);
                    }
                }
            }
        }

        // DevTools: disabled by default — it runs an entire second WebKit
        // process (~700MB) and contributed to system freezes under load.
        // Re-enable temporarily when debugging:
        // let window = app.get_webview_window("main").unwrap();
        // let _ = window.open_devtools();

        Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
