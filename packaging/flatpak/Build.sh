#!/bin/sh
set -eu

# Build inside the SDK: an executable linked on the host can require a newer
# glibc than the runtime provides. Game assets are embedded by Tauri as usual.
cargo build --manifest-path src-tauri/Cargo.toml --release --locked --offline
install -Dm755 "${CARGO_TARGET_DIR:-src-tauri/target}/release/gardendless" /app/bin/gardendless
install -Dm644 packaging/flatpak/com.zero.gardendless.desktop /app/share/applications/com.zero.gardendless.desktop
install -Dm644 packaging/flatpak/com.zero.gardendless.metainfo.xml /app/share/metainfo/com.zero.gardendless.metainfo.xml
install -Dm644 src-tauri/icons/128x128@2x.png /app/share/icons/hicolor/256x256/apps/com.zero.gardendless.png
