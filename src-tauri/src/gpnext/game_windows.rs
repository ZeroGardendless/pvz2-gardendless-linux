//! Bounded native reads for the game's community-level and update windows.
use std::{io::Read, time::Duration};
use tauri::WebviewWindow;

fn allowed(url: &reqwest::Url) -> bool {
    if url.scheme() != "https"
        || !url.username().is_empty()
        || url.password().is_some()
        || url.port().is_some_and(|port| port != 443)
        || url.fragment().is_some()
    {
        return false;
    }
    match url.host_str() {
        Some("pvzge.com") => url.path() == "/jsons/gameinfo.json" && url.query().is_none(),
        Some("levels.pvzge.com") => {
            (url.path() == "/api/github-levels/git/trees/main"
                && url.query() == Some("recursive=1"))
                || (url.path().starts_with("/api/github-levels/raw/main/") && url.query().is_none())
        }
        _ => false,
    }
}

#[tauri::command]
pub async fn game_http_get(
    window: WebviewWindow,
    url: String,
    limit: usize,
) -> Result<tauri::ipc::Response, String> {
    super::require_game(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        let url = reqwest::Url::parse(&url).map_err(|error| error.to_string())?;
        if !allowed(&url) || limit == 0 || limit > 25 * 1024 * 1024 {
            return Err("Unsupported game-window request".into());
        }
        let client = reqwest::blocking::Client::builder()
            .user_agent(concat!("Gardendless/", env!("CARGO_PKG_VERSION")))
            .connect_timeout(Duration::from_secs(10))
            .timeout(Duration::from_secs(20))
            .redirect(reqwest::redirect::Policy::none())
            .build()
            .map_err(|error| error.to_string())?;
        let response = client
            .get(url)
            .send()
            .map_err(|error| error.to_string())?
            .error_for_status()
            .map_err(|error| error.to_string())?;
        if response.status().is_redirection()
            || response
                .content_length()
                .is_some_and(|size| size > limit as u64)
        {
            return Err("Game-window response exceeds limits or redirects".into());
        }
        let mut bytes = Vec::new();
        response
            .take(limit as u64 + 1)
            .read_to_end(&mut bytes)
            .map_err(|error| error.to_string())?;
        if bytes.len() > limit {
            return Err("Game-window response exceeds limits".into());
        }
        Ok(tauri::ipc::Response::new(bytes))
    })
    .await
    .map_err(|error| error.to_string())?
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn game_windows_only_read_expected_public_endpoints() {
        for url in [
            "https://pvzge.com/jsons/gameinfo.json",
            "https://levels.pvzge.com/api/github-levels/git/trees/main?recursive=1",
            "https://levels.pvzge.com/api/github-levels/raw/main/world/level.json",
        ] {
            assert!(allowed(&url.parse().unwrap()), "{url}");
        }
        for url in [
            "http://pvzge.com/jsons/gameinfo.json",
            "https://pvzge.com.evil.test/jsons/gameinfo.json",
            "https://localhost/api/github-levels/raw/main/a",
            "https://levels.pvzge.com:8443/api/github-levels/raw/main/a",
            "https://pvzge.com/jsons/gameinfo.json?secret=a",
            "https://user@pvzge.com/jsons/gameinfo.json",
            "https://levels.pvzge.com/api/github-levels/raw/main/a?redirect=x",
        ] {
            assert!(!allowed(&url.parse().unwrap()), "{url}");
        }
    }
}
