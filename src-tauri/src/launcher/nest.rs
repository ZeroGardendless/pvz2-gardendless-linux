//! Public Gardenest catalog and verified package downloads. No account cookies
//! or script execution are needed to discover and install public creations.
use super::{require_launcher, LauncherStore};
use reqwest::blocking::Client;
use serde_json::{json, Value};
use sha2::{Digest, Sha256};
use std::{io::Read, time::Duration};
use tauri::{Manager, WebviewWindow};

const SITE: &str = "https://nest.pvzge.com";
fn uuid(value: &str) -> bool {
    value.len() == 36
        && value.bytes().enumerate().all(|(i, c)| {
            if [8, 13, 18, 23].contains(&i) {
                c == b'-'
            } else {
                c.is_ascii_hexdigit()
            }
        })
}
fn public_id(value: &str) -> bool {
    value.strip_prefix("prj_").is_some_and(uuid)
}
fn allowed(url: &reqwest::Url) -> bool {
    url.scheme() == "https"
        && url.username().is_empty()
        && url.password().is_none()
        && url.port().is_none()
        && url.host_str().is_some_and(|host| {
            host == "nest.pvzge.com" || host.ends_with(".r2.cloudflarestorage.com")
        })
}
fn client() -> Result<Client, String> {
    Client::builder()
        .user_agent("Gardendless/0.16.1 GP-Next/1.5.5")
        .connect_timeout(Duration::from_secs(15))
        .timeout(Duration::from_secs(90))
        .redirect(reqwest::redirect::Policy::custom(|next| {
            if next.previous().len() >= 5 || !allowed(next.url()) {
                next.error("Unexpected Gardenest redirect")
            } else {
                next.follow()
            }
        }))
        .build()
        .map_err(|e| e.to_string())
}
fn bytes(client: &Client, url: reqwest::Url, limit: usize) -> Result<Vec<u8>, String> {
    if !allowed(&url) {
        return Err("Untrusted Gardenest download URL".into());
    }
    let response = client
        .get(url)
        .header("Accept", "application/json, application/octet-stream")
        .send()
        .map_err(|e| e.to_string())?;
    let status = response.status();
    if !status.is_success() {
        return Err(format!("Gardenest returned HTTP {status}"));
    }
    if response
        .content_length()
        .is_some_and(|size| size > limit as u64)
    {
        return Err("Gardenest response exceeds size limit".into());
    }
    let mut data = Vec::new();
    response
        .take(limit as u64 + 1)
        .read_to_end(&mut data)
        .map_err(|e| e.to_string())?;
    if data.len() > limit {
        return Err("Gardenest response exceeds size limit".into());
    }
    Ok(data)
}
fn get(client: &Client, path: &str) -> Result<Value, String> {
    serde_json::from_slice(&bytes(
        client,
        format!("{SITE}{path}")
            .parse::<reqwest::Url>()
            .map_err(|e| e.to_string())?,
        2 * 1024 * 1024,
    )?)
    .map_err(|e| e.to_string())
}
fn descriptor(client: &Client, id: &str) -> Result<Value, String> {
    if !uuid(id) {
        return Err("Invalid Gardenest version ID".into());
    }
    let value = get(client, &format!("/api/game-imports/{id}"))?;
    if value["protocolVersion"] != 1
        || value["versionId"] != id
        || !value["projectId"].as_str().is_some_and(public_id)
        || !matches!(value["type"].as_str(), Some("mod" | "datapack" | "level"))
        || !matches!(value["format"].as_str(), Some("zip" | "json" | "json5"))
        || !value["sha256"]
            .as_str()
            .is_some_and(|hash| hash.len() == 64 && hash.bytes().all(|c| c.is_ascii_hexdigit()))
        || !value["byteLength"]
            .as_u64()
            .is_some_and(|n| n > 0 && n <= 50_000_000)
    {
        return Err("Invalid Gardenest import descriptor".into());
    }
    Ok(value)
}
fn payload(client: &Client, value: &Value) -> Result<Vec<u8>, String> {
    let url = value["url"]
        .as_str()
        .ok_or("Missing Gardenest download URL")?
        .parse::<reqwest::Url>()
        .map_err(|e| e.to_string())?;
    let payload = bytes(client, url, 50_000_000)?;
    if payload.len() as u64 != value["byteLength"].as_u64().unwrap_or(0)
        || format!("{:x}", Sha256::digest(&payload)) != value["sha256"].as_str().unwrap_or("")
    {
        return Err("Gardenest download failed SHA-256/size verification".into());
    }
    Ok(payload)
}
#[tauri::command]
pub async fn launcher_nest_catalog(
    window: WebviewWindow,
    query: String,
    kind: String,
    page: u32,
    project_id: Option<String>,
) -> Result<Value, String> {
    require_launcher(&window)?;
    tauri::async_runtime::spawn_blocking(move || {
        let client = client()?;
        if let Some(id) = project_id {
            if !public_id(&id) {
                return Err("Invalid Gardenest project ID".into());
            }
            return get(
                &client,
                &format!("/api/catalog/projects/{id}?page=1&pageSize=20&gpNextVersion=1.5.5"),
            );
        }
        if !["mod", "datapack", "level", "tool"].contains(&kind.as_str())
            || query.len() > 256
            || !(1..=10000).contains(&page)
        {
            return Err("Invalid catalog query".into());
        }
        let mut url = reqwest::Url::parse(&format!("{SITE}/api/catalog/projects"))
            .map_err(|e| e.to_string())?;
        url.query_pairs_mut()
            .append_pair("sort", "updated")
            .append_pair("page", &page.to_string())
            .append_pair("pageSize", "20")
            .append_pair("type", &kind)
            .append_pair("q", query.trim())
            .append_pair("gpNextVersion", "1.5.5");
        serde_json::from_slice(&bytes(&client, url, 2 * 1024 * 1024)?).map_err(|e| e.to_string())
    })
    .await
    .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn download_nest_import(
    window: WebviewWindow,
    version_id: String,
) -> Result<tauri::ipc::Response, String> {
    if !["main", "launcher"].contains(&window.label()) {
        return Err("NEST imports are available only in the game/launcher".into());
    }
    tauri::async_runtime::spawn_blocking(move || {
        let client = client()?;
        let descriptor = descriptor(&client, &version_id)?;
        let payload = payload(&client, &descriptor)?;
        let json = serde_json::to_vec(&descriptor).map_err(|e| e.to_string())?;
        let mut response = Vec::with_capacity(4 + json.len() + payload.len());
        response.extend_from_slice(&(json.len() as u32).to_le_bytes());
        response.extend(json);
        response.extend(payload);
        Ok(tauri::ipc::Response::new(response))
    })
    .await
    .map_err(|e| e.to_string())?
}

/// Profile-scoped filesystem adapter for GP-Next's own installer. This keeps
/// immutable snapshots/configuration behavior shared with the in-game manager.
#[tauri::command]
pub async fn launcher_gpnext_fs(
    window: WebviewWindow,
    app: tauri::AppHandle,
    profile_id: String,
    op: String,
    path: String,
    target: Option<String>,
    data: Option<String>,
) -> Result<Value, String> {
    require_launcher(&window)?;
    let root = super::packages::root(&app, &profile_id)?
        .parent()
        .ok_or("Missing GP-Next root")?
        .to_path_buf();
    tauri::async_runtime::spawn_blocking(move|| {
        use base64::{Engine,engine::general_purpose::STANDARD};
        use std::{fs,path::{Component,Path,PathBuf}};
        let store=app.state::<LauncherStore>();let session=store.session.lock().map_err(|e|e.to_string())?;
        if session.is_some() {return Err("Close the game before changing datapacks".into());}
        // FreshInstallation checks for the legacy top-level patches directory.
        // Permit this existence probe only; package writes stay inside gp-next.
        if op == "exists" && path == "patches" {
            let legacy = root.parent().ok_or("Missing profile root")?.join("patches");
            return Ok(json!(fs::symlink_metadata(legacy).is_ok()));
        }
        let resolve=|value:&str|->Result<PathBuf,String> {
            let relative=value.strip_prefix("gp-next/").or_else(||(value=="gp-next").then_some("")).ok_or("Path is outside GP-Next")?;
            if Path::new(relative).components().any(|c|!matches!(c,Component::Normal(_))) {return Err("Invalid GP-Next path".into());}
            let mut result=root.clone();
            for component in Path::new(relative).components() {result.push(component);if fs::symlink_metadata(&result).is_ok_and(|m|m.file_type().is_symlink()){return Err("GP-Next paths cannot contain symlinks".into());}}
            Ok(result)
        };
        let path=resolve(&path)?;
        match op.as_str() {
            "exists"=>Ok(json!(path.exists())),
            "mkdir"=>{fs::create_dir_all(path).map_err(|e|e.to_string())?;Ok(Value::Null)},
            "readText"=>{let text=fs::read_to_string(path).map_err(|e|e.to_string())?;if text.len()>16*1024*1024{return Err("GP-Next JSON exceeds size limit".into());}Ok(json!(text))},
            "read"=>{if fs::metadata(&path).map_err(|e|e.to_string())?.len()>64*1024*1024{return Err("GP-Next file exceeds size limit".into());}Ok(json!(STANDARD.encode(fs::read(path).map_err(|e|e.to_string())?)))},
            "writeText"|"write"=>{let data=data.ok_or("Missing file data")?;if data.len()>90*1024*1024{return Err("GP-Next file exceeds size limit".into());}let bytes=if op=="write"{STANDARD.decode(data).map_err(|e|e.to_string())?}else{data.into_bytes()};fs::write(path,bytes).map_err(|e|e.to_string())?;Ok(Value::Null)},
            "rename"=>{fs::rename(path,resolve(&target.ok_or("Missing rename target")?)?).map_err(|e|e.to_string())?;Ok(Value::Null)},
            "remove"=>{if path==root{return Err("Cannot remove GP-Next root".into());}if path.is_dir(){fs::remove_dir_all(path)}else{fs::remove_file(path)}.map_err(|e|e.to_string())?;Ok(Value::Null)},
            "stat"=>{let m=fs::symlink_metadata(path).map_err(|e|e.to_string())?;Ok(json!({"isFile":m.is_file(),"isDirectory":m.is_dir(),"isSymlink":m.file_type().is_symlink(),"size":m.len()}))},
            "readDir"=>{let entries=fs::read_dir(path).map_err(|e|e.to_string())?.map(|entry|{let entry=entry.map_err(|e|e.to_string())?;let ty=entry.file_type().map_err(|e|e.to_string())?;Ok(json!({"name":entry.file_name().to_string_lossy(),"isFile":ty.is_file(),"isDirectory":ty.is_dir(),"isSymlink":ty.is_symlink()}))}).collect::<Result<Vec<Value>,String>>()?;Ok(json!(entries))},
            _=>Err("Unknown GP-Next filesystem operation".into())
        }
    }).await.map_err(|e|e.to_string())?
}
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn identities_and_origins_are_scoped() {
        assert!(public_id("prj_cfcc9e09-a734-40f7-91c7-56439880c472"));
        assert!(!uuid("../etc/passwd"));
        assert!(allowed(
            &"https://nest.pvzge.com/api/catalog/projects"
                .parse()
                .unwrap()
        ));
        for url in [
            "http://nest.pvzge.com/",
            "https://nest.pvzge.com.evil.test/",
            "https://127.0.0.1/",
            "https://user@nest.pvzge.com/",
        ] {
            assert!(!allowed(&url.parse().unwrap()));
        }
    }
}
