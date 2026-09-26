pub fn bridge_socket() {
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
