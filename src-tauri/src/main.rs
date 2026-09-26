#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    // Keep embedded assets in the executable, out of the reusable library archive.
    gardendless::run(tauri::generate_context!());
}
