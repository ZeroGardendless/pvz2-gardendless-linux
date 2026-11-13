#!/usr/bin/env bash
set -euo pipefail
cd /home/zero/gardendless
mkdir -p src-tauri/target/aurum
exec 9>src-tauri/target/aurum/build.lock
flock -n 9 || { echo 'An Aurum build watcher is already running.'; exit 1; }
echo 'Aurum Flatpak build: waiting for the verified-source checkpoint.'
echo 'Compile command: python build.py'
echo 'This terminal continues independently of Codex. Ctrl+C cancels.'
while [[ ! -f src-tauri/target/aurum/BUILD_READY ]]; do sleep 5; done
python build.py 2>&1 | tee src-tauri/target/aurum/build.log
printf '\nBuild finished. Artifact: src-tauri/target/flatpak/gardendless-linux-x64.flatpak\n'
