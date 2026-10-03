//! GitHub downloads are staged, checked against the published digest, and only
//! registered after a complete install. Downloaded executables never run here.
use super::{data_root, register_download, require_launcher, verify_executable, LauncherState};
use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    collections::HashSet,
    fs::{self, File},
    io::{Read, Write},
    path::{Component, Path, PathBuf},
    sync::{
        atomic::{AtomicBool, Ordering},
        Mutex,
    },
    time::{Duration, Instant},
};
use tauri::{Manager, WebviewWindow};
const API: &str =
    "https://api.github.com/repos/ZeroGardendless/pvz2-gardendless-linux/releases?per_page=30";
const MAX_SIZE: u64 = 4 * 1024 * 1024 * 1024;
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReleaseAsset {
    id: u64,
    name: String,
    size: u64,
    digest: Option<String>,
    compatible: bool,
    reason: Option<String>,
    url: String,
}
#[derive(Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Release {
    id: u64,
    tag: String,
    name: String,
    body: String,
    published_at: String,
    prerelease: bool,
    url: String,
    assets: Vec<ReleaseAsset>,
}
#[derive(Serialize)]
pub struct ReleaseList {
    releases: Vec<Release>,
    cached: bool,
    warning: Option<String>,
}
#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Progress {
    asset_id: u64,
    received: u64,
    total: u64,
    status: String,
}
#[derive(Default)]
pub struct Downloads {
    active: AtomicBool,
    cancel: AtomicBool,
    status: Mutex<Option<Progress>>,
}
fn client() -> Result<Client, String> {
    Client::builder()
        .user_agent("Gardendless-Launcher/0.1.0")
        .connect_timeout(Duration::from_secs(15))
        .timeout(Duration::from_secs(25))
        .redirect(reqwest::redirect::Policy::custom(|attempt| {
            let url = attempt.url();
            let host = url.host_str().unwrap_or("");
            if attempt.previous().len() > 8
                || url.scheme() != "https"
                || !(host == "github.com"
                    || host == "api.github.com"
                    || host.ends_with(".githubusercontent.com"))
            {
                attempt.error("Unexpected download redirect")
            } else {
                attempt.follow()
            }
        }))
        .build()
        .map_err(|e| e.to_string())
}
fn valid_digest(value: Option<&str>) -> bool {
    value
        .and_then(|v| v.strip_prefix("sha256:"))
        .is_some_and(|v| v.len() == 64 && v.bytes().all(|c| c.is_ascii_hexdigit()))
}
fn binary_for_platform(name: &str) -> bool {
    if cfg!(target_os = "linux") {
        name == "gardendless-linux-x64"
    } else if cfg!(target_os = "windows") {
        name == "gardendless-windows-x64.exe"
            || name == "gardendless-windows-x64-test.zip"
            || name == "gardendless-windows-x64.zip"
    } else {
        false
    }
}
fn fetch_releases() -> Result<Vec<Release>, String> {
    let response = client()?
        .get(API)
        .header("Accept", "application/vnd.github+json")
        .timeout(Duration::from_secs(25))
        .send()
        .and_then(|r| r.error_for_status())
        .map_err(|e| format!("GitHub could not be reached: {e}"))?;
    let mut bytes = Vec::new();
    response
        .take(4 * 1024 * 1024 + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() > 4 * 1024 * 1024 {
        return Err("Release metadata is too large.".into());
    }
    let values: Vec<serde_json::Value> =
        serde_json::from_slice(&bytes).map_err(|e| e.to_string())?;
    Ok(values
        .into_iter()
        .filter(|r| r["draft"] != true)
        .filter_map(|r| {
            let id = r["id"].as_u64()?;
            let tag = r["tag_name"].as_str()?.to_string();
            let assets = r["assets"].as_array()?;
            let needs_sidecar = assets.iter().any(|a| a["name"] == "public-assets.zip");
            let assets = assets
                .iter()
                .filter_map(|a| {
                    let name = a["name"].as_str()?.to_owned();
                    let size = a["size"].as_u64()?;
                    let digest = a["digest"].as_str().map(str::to_owned);
                    let reason = if !binary_for_platform(&name) {
                        Some("Different platform or supporting file")
                    } else if needs_sidecar {
                        Some("Legacy build needs separate assets; install manually")
                    } else if !valid_digest(digest.as_deref()) {
                        Some("No published SHA-256; install manually")
                    } else if size == 0 || size > MAX_SIZE {
                        Some("Unsupported download size")
                    } else {
                        None
                    };
                    Some(ReleaseAsset {
                        id: a["id"].as_u64()?,
                        name,
                        size,
                        digest,
                        compatible: reason.is_none(),
                        reason: reason.map(str::to_owned),
                        url: a["browser_download_url"].as_str()?.into(),
                    })
                })
                .collect();
            Some(Release {
                id,
                tag: tag.clone(),
                name: r["name"]
                    .as_str()
                    .filter(|n| !n.is_empty())
                    .unwrap_or(&tag)
                    .into(),
                body: r["body"].as_str().unwrap_or("").into(),
                published_at: r["published_at"].as_str().unwrap_or("").into(),
                prerelease: r["prerelease"] == true,
                url: r["html_url"]
                    .as_str()
                    .unwrap_or("https://github.com/ZeroGardendless/pvz2-gardendless-linux/releases")
                    .into(),
                assets,
            })
        })
        .collect())
}
fn list(app: &tauri::AppHandle) -> Result<ReleaseList, String> {
    let cache = data_root(app)?.join("releases.json");
    match fetch_releases() {
        Ok(releases) => {
            if let Ok(bytes) = serde_json::to_vec(&releases) {
                let _ = fs::write(cache, bytes);
            }
            Ok(ReleaseList {
                releases,
                cached: false,
                warning: None,
            })
        }
        Err(error) => {
            let releases = fs::read(cache)
                .ok()
                .and_then(|b| serde_json::from_slice(&b).ok())
                .ok_or(error.clone())?;
            Ok(ReleaseList {
                releases,
                cached: true,
                warning: Some(error),
            })
        }
    }
}
#[tauri::command]
pub async fn launcher_releases(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<ReleaseList, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || list(&app))
        .await
        .map_err(|e| e.to_string())?
}
#[tauri::command]
pub fn launcher_download_status(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<Option<Progress>, String> {
    require_launcher(&window)?;
    Ok(app
        .state::<Downloads>()
        .status
        .lock()
        .map_err(|e| e.to_string())?
        .clone())
}
#[tauri::command]
pub fn launcher_cancel_download(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<(), String> {
    require_launcher(&window)?;
    app.state::<Downloads>()
        .cancel
        .store(true, Ordering::SeqCst);
    Ok(())
}
fn progress(downloads: &Downloads, id: u64, received: u64, total: u64, status: &str) {
    if let Ok(mut slot) = downloads.status.lock() {
        *slot = Some(Progress {
            asset_id: id,
            received,
            total,
            status: status.into(),
        });
    }
}
fn check_cancel(downloads: &Downloads) -> Result<(), String> {
    if downloads.cancel.load(Ordering::SeqCst) {
        Err("Download cancelled.".into())
    } else {
        Ok(())
    }
}
fn extract_windows(
    archive: &Path,
    folder: &Path,
    downloads: &Downloads,
) -> Result<PathBuf, String> {
    let mut zip = zip::ZipArchive::new(File::open(archive).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    if zip.len() > 32 {
        return Err("Unexpectedly large archive directory.".into());
    }
    let mut names = HashSet::new();
    let mut executable = None;
    let mut total = 0;
    for i in 0..zip.len() {
        check_cancel(downloads)?;
        let mut entry = zip.by_index(i).map_err(|e| e.to_string())?;
        let path = entry.enclosed_name().ok_or("Unsafe archive path")?;
        if path
            .components()
            .any(|c| !matches!(c, Component::Normal(_)))
            || entry.name().contains('\\')
            || entry.unix_mode().is_some_and(|m| m & 0o170000 == 0o120000)
        {
            return Err("Unsafe archive entry.".into());
        }
        if entry.is_dir() {
            continue;
        }
        let name = path
            .file_name()
            .and_then(|n| n.to_str())
            .ok_or("Invalid filename")?;
        let lower = name.to_ascii_lowercase();
        if !names.insert(lower.clone()) {
            return Err("Duplicate archive filename.".into());
        }
        total += entry.size();
        if total > MAX_SIZE {
            return Err("Archive is too large when extracted.".into());
        }
        let is_exe = lower.ends_with(".exe");
        if !is_exe && lower != "webview2loader.dll" && !lower.ends_with(".txt") {
            return Err("Unexpected file in game archive.".into());
        }
        let destination = folder.join(name);
        if is_exe && executable.replace(destination.clone()).is_some() {
            return Err("Archive contains multiple executables.".into());
        }
        let mut output = File::create(&destination).map_err(|e| e.to_string())?;
        let mut buffer = [0; 65536];
        loop {
            check_cancel(downloads)?;
            let n = entry.read(&mut buffer).map_err(|e| e.to_string())?;
            if n == 0 {
                break;
            }
            output.write_all(&buffer[..n]).map_err(|e| e.to_string())?;
        }
        output.sync_all().map_err(|e| e.to_string())?;
    }
    executable.ok_or("No executable found in archive.".into())
}
fn install(app: &tauri::AppHandle, asset_id: u64) -> Result<LauncherState, String> {
    let downloads = app.state::<Downloads>();
    // Re-read trusted GitHub metadata instead of accepting a caller-supplied URL.
    let releases = fetch_releases()?;
    let (release, asset) = releases
        .iter()
        .find_map(|r| r.assets.iter().find(|a| a.id == asset_id).map(|a| (r, a)))
        .ok_or("Release asset no longer exists.")?;
    if !asset.compatible {
        return Err(asset.reason.clone().unwrap_or("Unsupported asset".into()));
    }
    let url = reqwest::Url::parse(&asset.url).map_err(|e| e.to_string())?;
    if url.scheme() != "https"
        || url.host_str() != Some("github.com")
        || !url
            .path()
            .starts_with("/ZeroGardendless/pvz2-gardendless-linux/releases/download/")
    {
        return Err("Unexpected release URL.".into());
    }
    let versions = data_root(app)?.join("versions");
    fs::create_dir_all(&versions).map_err(|e| e.to_string())?;
    let destination = versions.join(asset_id.to_string());
    if destination.exists() {
        return Err("This version's files are already installed. Import its executable from the Versions folder.".into());
    }
    let staging = versions.join(format!("pending-{asset_id}-{}", super::now()));
    fs::create_dir(&staging).map_err(|e| e.to_string())?;
    let result = (|| {
        let archive = staging.join("download.part");
        let mut file = File::create(&archive).map_err(|e| e.to_string())?;
        let mut response = client()?
            .get(url)
            .send()
            .and_then(|r| r.error_for_status())
            .map_err(|e| e.to_string())?;
        let mut digest = Sha256::new();
        let mut buffer = [0; 131072];
        let mut received = 0;
        let mut last = Instant::now();
        progress(&downloads, asset_id, 0, asset.size, "downloading");
        loop {
            check_cancel(&downloads)?;
            let n = response.read(&mut buffer).map_err(|e| e.to_string())?;
            if n == 0 {
                break;
            }
            received += n as u64;
            if received > asset.size {
                return Err("Download exceeds published size.".into());
            }
            digest.update(&buffer[..n]);
            file.write_all(&buffer[..n]).map_err(|e| e.to_string())?;
            if last.elapsed() > Duration::from_millis(150) {
                progress(&downloads, asset_id, received, asset.size, "downloading");
                last = Instant::now();
            }
        }
        file.sync_all().map_err(|e| e.to_string())?;
        drop(file);
        progress(&downloads, asset_id, received, asset.size, "verifying");
        let expected = asset
            .digest
            .as_deref()
            .and_then(|d| d.strip_prefix("sha256:"))
            .ok_or("Missing checksum")?;
        if received != asset.size
            || !format!("{:x}", digest.finalize()).eq_ignore_ascii_case(expected)
        {
            return Err("Download verification failed. Nothing was installed.".into());
        }
        check_cancel(&downloads)?;
        let executable = if asset.name.ends_with(".zip") {
            let p = extract_windows(&archive, &staging, &downloads)?;
            fs::remove_file(&archive).map_err(|e| e.to_string())?;
            p
        } else {
            let p = staging.join(&asset.name);
            fs::rename(&archive, &p).map_err(|e| e.to_string())?;
            p
        };
        verify_executable(&executable)?;
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            fs::set_permissions(&executable, fs::Permissions::from_mode(0o755))
                .map_err(|e| e.to_string())?;
        }
        check_cancel(&downloads)?;
        let filename = executable
            .file_name()
            .ok_or("No executable name")?
            .to_owned();
        fs::rename(&staging, &destination).map_err(|e| e.to_string())?;
        let state = register_download(
            app,
            destination.join(filename),
            format!("Gardendless {}", release.tag),
            release.tag.clone(),
        )?;
        progress(&downloads, asset_id, received, asset.size, "installed");
        Ok(state)
    })();
    if staging.exists() {
        let _ = fs::remove_dir_all(&staging);
    }
    if result.is_err() {
        progress(
            &downloads,
            asset_id,
            0,
            asset.size,
            if downloads.cancel.load(Ordering::SeqCst) {
                "cancelled"
            } else {
                "failed"
            },
        );
    }
    result
}
#[tauri::command]
pub async fn launcher_install_release(
    window: WebviewWindow,
    app: tauri::AppHandle,
    asset_id: u64,
) -> Result<LauncherState, String> {
    require_launcher(&window)?;
    if super::is_flatpak() {
        return Err("Update the Flatpak package to install a new game version.".into());
    }
    let downloads = app.state::<Downloads>();
    if downloads.active.swap(true, Ordering::SeqCst) {
        return Err("Another download is in progress.".into());
    }
    downloads.cancel.store(false, Ordering::SeqCst);
    let worker_app = app.clone();
    let result = tauri::async_runtime::spawn_blocking(move || install(&worker_app, asset_id))
        .await
        .map_err(|e| e.to_string())
        .and_then(|r| r);
    downloads.active.store(false, Ordering::SeqCst);
    result
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn digest_validation() {
        assert!(!valid_digest(None));
        assert!(!valid_digest(Some("sha256:bad")));
        assert!(valid_digest(Some(&format!("sha256:{}", "a".repeat(64)))));
    }
    #[test]
    fn archive_is_not_a_linux_binary() {
        if cfg!(target_os = "linux") {
            assert!(binary_for_platform("gardendless-linux-x64"));
            assert!(!binary_for_platform("public-assets.zip"));
            assert!(!binary_for_platform("../gardendless-linux-x64"));
        }
    }
}

#[cfg(test)]
mod archive_tests {
    use super::*;
    use zip::write::SimpleFileOptions;
    fn fixture(files: &[(&str, &[u8])]) -> (PathBuf, PathBuf) {
        let root = std::env::temp_dir().join(format!("gardendless-zip-{}", super::super::new_id()));
        fs::create_dir_all(&root).unwrap();
        let path = root.join("input.zip");
        let mut zip = zip::ZipWriter::new(File::create(&path).unwrap());
        for (name, bytes) in files {
            zip.start_file(*name, SimpleFileOptions::default()).unwrap();
            zip.write_all(bytes).unwrap();
        }
        zip.finish().unwrap();
        (root, path)
    }
    #[test]
    fn windows_archive_keeps_loader_beside_executable() {
        let (root, path) = fixture(&[
            ("game/gardendless.exe", b"exe"),
            ("game/WebView2Loader.dll", b"dll"),
        ]);
        let result = extract_windows(&path, &root, &Downloads::default()).unwrap();
        assert_eq!(result, root.join("gardendless.exe"));
        assert_eq!(fs::read(root.join("WebView2Loader.dll")).unwrap(), b"dll");
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn traversal_and_duplicate_executables_are_rejected() {
        for files in [
            vec![("../escape.exe", &b"exe"[..])],
            vec![("a.exe", &b"exe"[..]), ("b.exe", &b"exe"[..])],
            vec![("one/game.exe", &b"exe"[..]), ("two/GAME.exe", &b"exe"[..])],
        ] {
            let (root, path) = fixture(&files);
            assert!(extract_windows(&path, &root, &Downloads::default()).is_err());
            fs::remove_dir_all(root).unwrap();
        }
    }
    #[test]
    fn cancelled_extraction_does_not_write_executable() {
        let (root, path) = fixture(&[("gardendless.exe", b"exe")]);
        let download = Downloads::default();
        download.cancel.store(true, Ordering::SeqCst);
        assert!(extract_windows(&path, &root, &download).is_err());
        assert!(!root.join("gardendless.exe").exists());
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    #[ignore = "requires network; run manually to validate GitHub metadata/TLS"]
    fn github_release_metadata() {
        let releases = fetch_releases().unwrap();
        assert!(!releases.is_empty());
        assert!(releases
            .iter()
            .any(|r| r.assets.iter().any(|a| a.compatible)));
    }
}
