//! Batched package I/O for GP-Next 1.5.10. Never executes package code.
use base64::{engine::general_purpose::STANDARD, Engine};
use serde::{Deserialize, Serialize};
use sha2::{Digest, Sha256};
use std::{
    collections::BTreeMap,
    fs,
    io::Read,
    path::{Path, PathBuf},
    time::UNIX_EPOCH,
};
use tauri::{Manager, WebviewWindow};

const FILE_LIMIT: usize = 20_000;
const BYTE_LIMIT: usize = 512 * 1024 * 1024;
const SINGLE_LIMIT: u64 = 64 * 1024 * 1024;
#[derive(Deserialize, Serialize)]
pub struct PackFile {
    path: String,
    base64: String,
}
#[derive(Serialize)]
pub struct Capture {
    zip: Option<String>,
    files: Vec<PackFile>,
}
#[derive(Serialize)]
pub struct InventoryEntry {
    path: String,
    fingerprint: String,
}

fn digest_valid(value: &str) -> bool {
    value.len() == 64
        && value
            .bytes()
            .all(|c| c.is_ascii_digit() || (b'a'..=b'f').contains(&c))
}
fn components(value: &str) -> Result<Vec<&str>, String> {
    if value.is_empty() || value.contains(['\\', ':', '\0']) || value.len() > 1024 {
        return Err("Invalid package path".into());
    }
    let parts: Vec<_> = value.split('/').collect();
    if parts.len() > 32
        || parts
            .iter()
            .any(|p| p.is_empty() || *p == "." || *p == "..")
    {
        return Err("Invalid package path".into());
    }
    Ok(parts)
}
fn resolve(root: &Path, relative: &str) -> Result<PathBuf, String> {
    let mut path = root.to_owned();
    for part in components(relative)? {
        path.push(part);
        if fs::symlink_metadata(&path).is_ok_and(|m| m.file_type().is_symlink()) {
            return Err("Package symlinks are not supported".into());
        }
    }
    Ok(path)
}
fn read_limited(path: &Path, limit: u64) -> Result<Vec<u8>, String> {
    let metadata = fs::symlink_metadata(path).map_err(|e| e.to_string())?;
    if !metadata.is_file() || metadata.len() > limit {
        return Err("Package entry is not a bounded regular file".into());
    }
    let mut bytes = Vec::new();
    fs::File::open(path)
        .map_err(|e| e.to_string())?
        .take(limit + 1)
        .read_to_end(&mut bytes)
        .map_err(|e| e.to_string())?;
    if bytes.len() as u64 > limit {
        return Err("Package entry exceeds size limit".into());
    }
    Ok(bytes)
}
fn read_tree(root: &Path) -> Result<BTreeMap<String, Vec<u8>>, String> {
    fn walk(
        root: &Path,
        current: &Path,
        out: &mut BTreeMap<String, Vec<u8>>,
        total: &mut usize,
        depth: usize,
    ) -> Result<(), String> {
        if depth > 32 {
            return Err("Package nesting exceeds limit".into());
        }
        for entry in fs::read_dir(current).map_err(|e| e.to_string())? {
            let entry = entry.map_err(|e| e.to_string())?;
            let kind = entry.file_type().map_err(|e| e.to_string())?;
            if kind.is_symlink() {
                return Err("Package symlinks are not supported".into());
            }
            let path = entry.path();
            if kind.is_dir() {
                walk(root, &path, out, total, depth + 1)?;
            } else if kind.is_file() {
                let relative = path
                    .strip_prefix(root)
                    .map_err(|e| e.to_string())?
                    .to_str()
                    .ok_or("Package path is not UTF-8")?
                    .replace('\\', "/");
                components(&relative)?;
                if out.len() >= FILE_LIMIT {
                    return Err("Package has too many files".into());
                }
                let bytes = read_limited(&path, SINGLE_LIMIT)?;
                *total += bytes.len();
                if *total > BYTE_LIMIT {
                    return Err("Package exceeds size limit".into());
                }
                out.insert(relative, bytes);
            } else {
                return Err("Unsupported package entry".into());
            }
        }
        Ok(())
    }
    let metadata = fs::symlink_metadata(root).map_err(|e| e.to_string())?;
    if !metadata.is_dir() || metadata.file_type().is_symlink() {
        return Err("Package root is not a regular directory".into());
    }
    let mut out = BTreeMap::new();
    walk(root, root, &mut out, &mut 0, 0)?;
    Ok(out)
}
fn snapshot_digest(files: &BTreeMap<String, Vec<u8>>) -> String {
    let mut hash = Sha256::new();
    hash.update(b"gp-next-pack-snapshot-v1\0");
    // JS Array.sort compares UTF-16 code units, including supplementary names.
    let mut ordered: Vec<_> = files.iter().collect();
    ordered.sort_by(|a, b| a.0.encode_utf16().cmp(b.0.encode_utf16()));
    for (name, bytes) in ordered {
        hash.update((name.len() as u32).to_be_bytes());
        hash.update((bytes.len() as u64).to_be_bytes());
        hash.update(name.as_bytes());
        hash.update(bytes);
    }
    format!("{:x}", hash.finalize())
}
fn encoded(files: BTreeMap<String, Vec<u8>>) -> Vec<PackFile> {
    files
        .into_iter()
        .map(|(path, bytes)| PackFile {
            path,
            base64: STANDARD.encode(bytes),
        })
        .collect()
}
fn read_installed(root: &Path, digest: &str) -> Result<Option<Vec<PackFile>>, String> {
    if !digest_valid(digest) {
        return Err("Invalid package digest".into());
    }
    let path = resolve(root, &format!("gp-next/installed/{digest}"))?;
    if !path.try_exists().map_err(|e| e.to_string())? {
        return Ok(None);
    }
    // The frontend verifies the same canonical digest, including during startup.
    Ok(Some(encoded(read_tree(&path)?)))
}
fn install(root: &Path, digest: &str, input: Vec<PackFile>) -> Result<bool, String> {
    if !digest_valid(digest) || input.len() > FILE_LIMIT {
        return Err("Invalid package snapshot".into());
    }
    let mut files = BTreeMap::new();
    let mut total = 0;
    for entry in input {
        components(&entry.path)?;
        if entry.base64.len() > (SINGLE_LIMIT as usize + 2) / 3 * 4 {
            return Err("Package entry exceeds size limit".into());
        }
        let bytes = STANDARD.decode(entry.base64).map_err(|e| e.to_string())?;
        total += bytes.len();
        if bytes.len() as u64 > SINGLE_LIMIT
            || total > BYTE_LIMIT
            || files.insert(entry.path, bytes).is_some()
        {
            return Err("Invalid or oversized package snapshot".into());
        }
    }
    for name in files.keys() {
        let parts = components(name)?;
        for index in 1..parts.len() {
            if files.contains_key(&parts[..index].join("/")) {
                return Err("Package file/directory collision".into());
            }
        }
    }
    if snapshot_digest(&files) != digest {
        return Err("Package snapshot digest mismatch".into());
    }
    let parent = resolve(root, "gp-next/installed")?;
    fs::create_dir_all(&parent).map_err(|e| e.to_string())?;
    let target = resolve(root, &format!("gp-next/installed/{digest}"))?;
    if target.exists() {
        if snapshot_digest(&read_tree(&target)?) != digest {
            return Err("Installed snapshot failed verification".into());
        }
        return Ok(true);
    }
    let temporary = parent.join(format!(
        "pending-{}",
        format!(
            "{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .map_err(|e| e.to_string())?
                .as_nanos()
        )
    ));
    fs::create_dir(&temporary).map_err(|e| e.to_string())?;
    let result = (|| {
        for (name, bytes) in &files {
            let path = resolve(&temporary, name)?;
            fs::create_dir_all(path.parent().ok_or("Missing parent")?)
                .map_err(|e| e.to_string())?;
            fs::write(path, bytes).map_err(|e| e.to_string())?;
        }
        if snapshot_digest(&read_tree(&temporary)?) != digest {
            return Err("Staged snapshot failed verification".into());
        }
        match fs::rename(&temporary, &target) {
            Ok(()) => Ok(false),
            Err(_) if target.exists() && snapshot_digest(&read_tree(&target)?) == digest => {
                Ok(true)
            }
            Err(error) => Err(error.to_string()),
        }
    })();
    if temporary.exists() {
        let _ = fs::remove_dir_all(temporary);
    }
    result
}
fn capture(root: &Path, source: &str) -> Result<Option<Capture>, String> {
    let parts = components(source)?;
    if !(matches!(source, "gp-next/patches" | "gp-next/__gpn_edits")
        || parts.len() == 3 && parts[..2] == ["gp-next", "packs"])
    {
        return Err("Source is outside local packages".into());
    }
    let path = resolve(root, source)?;
    if !path.try_exists().map_err(|e| e.to_string())? {
        return Ok(None);
    }
    if path.is_dir() {
        Ok(Some(Capture {
            zip: None,
            files: encoded(read_tree(&path)?),
        }))
    } else if path
        .extension()
        .is_some_and(|e| e.eq_ignore_ascii_case("zip"))
    {
        Ok(Some(Capture {
            zip: Some(STANDARD.encode(read_limited(&path, BYTE_LIMIT as u64)?)),
            files: vec![],
        }))
    } else {
        Err("Expected a package folder or ZIP".into())
    }
}
fn inventory(root: &Path) -> Result<Vec<InventoryEntry>, String> {
    fn fingerprint(
        path: &Path,
        hash: &mut Sha256,
        count: &mut usize,
        depth: usize,
    ) -> Result<(), String> {
        if depth > 32 || *count >= FILE_LIMIT {
            return Err("Local package inventory exceeds limits".into());
        }
        let m = fs::symlink_metadata(path).map_err(|e| e.to_string())?;
        *count += 1;
        if m.file_type().is_symlink() {
            return Err("Package symlinks are not supported".into());
        }
        hash.update(m.len().to_be_bytes());
        hash.update(
            m.modified()
                .map_err(|e| e.to_string())?
                .duration_since(UNIX_EPOCH)
                .map_err(|e| e.to_string())?
                .as_nanos()
                .to_be_bytes(),
        );
        if m.is_dir() {
            let mut entries = fs::read_dir(path)
                .map_err(|e| e.to_string())?
                .collect::<Result<Vec<_>, _>>()
                .map_err(|e| e.to_string())?;
            entries.sort_by_key(|entry| entry.file_name());
            for entry in entries {
                hash.update(entry.file_name().to_string_lossy().as_bytes());
                hash.update([0]);
                fingerprint(&entry.path(), hash, count, depth + 1)?;
            }
        } else if !m.is_file() {
            return Err("Unsupported local package entry".into());
        }
        Ok(())
    }
    let path = resolve(root, "gp-next/packs")?;
    if !path.exists() {
        return Ok(vec![]);
    }
    let mut result = Vec::new();
    for entry in fs::read_dir(path).map_err(|e| e.to_string())? {
        let entry = entry.map_err(|e| e.to_string())?;
        let name = entry
            .file_name()
            .to_str()
            .ok_or("Package name is not UTF-8")?
            .to_owned();
        if name.starts_with('.') {
            continue;
        }
        components(&name)?;
        let ty = entry.file_type().map_err(|e| e.to_string())?;
        if !ty.is_dir()
            && !(ty.is_file()
                && entry
                    .path()
                    .extension()
                    .is_some_and(|e| e.eq_ignore_ascii_case("zip")))
        {
            continue;
        }
        let mut hash = Sha256::new();
        fingerprint(&entry.path(), &mut hash, &mut 0, 0)?;
        result.push(InventoryEntry {
            path: format!("gp-next/packs/{name}"),
            fingerprint: format!("{:x}", hash.finalize()),
        });
        if result.len() > FILE_LIMIT {
            return Err("Too many local packages".into());
        }
    }
    result.sort_by(|a, b| a.path.cmp(&b.path));
    Ok(result)
}
fn root(window: &WebviewWindow, app: &tauri::AppHandle) -> Result<PathBuf, String> {
    super::require_game(window)?;
    app.path().app_data_dir().map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn gp_next_read_installed_pack(
    window: WebviewWindow,
    app: tauri::AppHandle,
    digest: String,
) -> Result<Option<Vec<PackFile>>, String> {
    let root = root(&window, &app)?;
    tauri::async_runtime::spawn_blocking(move || read_installed(&root, &digest))
        .await
        .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn gp_next_install_pack(
    window: WebviewWindow,
    app: tauri::AppHandle,
    digest: String,
    files: Vec<PackFile>,
) -> Result<bool, String> {
    let root = root(&window, &app)?;
    tauri::async_runtime::spawn_blocking(move || install(&root, &digest, files))
        .await
        .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn gp_next_capture_local_pack(
    window: WebviewWindow,
    app: tauri::AppHandle,
    source: String,
) -> Result<Option<Capture>, String> {
    let root = root(&window, &app)?;
    tauri::async_runtime::spawn_blocking(move || capture(&root, &source))
        .await
        .map_err(|e| e.to_string())?
}
#[tauri::command]
pub async fn gp_next_local_package_inventory(
    window: WebviewWindow,
    app: tauri::AppHandle,
) -> Result<Vec<InventoryEntry>, String> {
    let root = root(&window, &app)?;
    tauri::async_runtime::spawn_blocking(move || inventory(&root))
        .await
        .map_err(|e| e.to_string())?
}

#[cfg(test)]
mod tests {
    use super::*;
    fn temporary() -> PathBuf {
        let path = std::env::temp_dir().join(format!(
            "gpnext-pack-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir(&path).unwrap();
        path
    }
    #[test]
    fn canonical_empty_and_roundtrip() {
        let root = temporary();
        let empty = BTreeMap::new();
        assert_eq!(
            snapshot_digest(&empty),
            "6b4a732c1fb6f9a72454c36888622037f9e9964a67d44fcac7417083a966b9db"
        );
        let files = BTreeMap::from([
            ("pack.json".into(), b"{}".to_vec()),
            ("nested/a.bin".into(), vec![0, 255, 128]),
        ]);
        let digest = snapshot_digest(&files);
        assert!(!install(&root, &digest, encoded(files.clone())).unwrap());
        assert!(install(&root, &digest, encoded(files.clone())).unwrap());
        let read = read_installed(&root, &digest).unwrap().unwrap();
        assert_eq!(read.len(), 2);
        assert_eq!(STANDARD.decode(&read[0].base64).unwrap(), vec![0, 255, 128]);
        assert_eq!(
            read_tree(&root.join("gp-next/installed").join(&digest)).unwrap(),
            files
        );
        assert!(
            !root.join("gp-next/installed").read_dir().unwrap().any(|e| e
                .unwrap()
                .file_name()
                .to_string_lossy()
                .starts_with("pending-"))
        );
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn reject_tampering_and_unsafe_paths() {
        let root = temporary();
        for path in ["../outside", "/absolute", "a//b", "a/./b", "a\\b", "C:bad"] {
            assert!(install(
                &root,
                &"a".repeat(64),
                vec![PackFile {
                    path: path.into(),
                    base64: STANDARD.encode(b"bad")
                }]
            )
            .is_err());
        }
        assert!(install(&root, &"a".repeat(64), vec![]).is_err());
        assert!(capture(&root, "gp-next/settings.json").is_err());
        assert!(read_installed(&root, "../escape").is_err());
        assert!(read_installed(&root, &"a".repeat(64)).unwrap().is_none());
        fs::remove_dir_all(root).unwrap();
    }
    #[test]
    fn capture_and_inventory_track_changes() {
        let root = temporary();
        let pack = root.join("gp-next/packs/Example");
        fs::create_dir_all(&pack).unwrap();
        fs::write(pack.join("pack.json"), b"{}").unwrap();
        let before = inventory(&root).unwrap();
        assert_eq!(before.len(), 1);
        let captured = capture(&root, "gp-next/packs/Example").unwrap().unwrap();
        assert!(captured.zip.is_none());
        assert_eq!(captured.files.len(), 1);
        fs::write(pack.join("new.js"), b"export default 1").unwrap();
        assert_ne!(
            before[0].fingerprint,
            inventory(&root).unwrap()[0].fingerprint
        );
        assert!(capture(&root, "gp-next/patches").unwrap().is_none());
        fs::remove_dir_all(root).unwrap();
    }
    #[cfg(unix)]
    #[test]
    fn reject_symlink_packages() {
        let root = temporary();
        let external = temporary();
        fs::create_dir_all(root.join("gp-next/installed")).unwrap();
        std::os::unix::fs::symlink(
            &external,
            root.join("gp-next/installed").join("a".repeat(64)),
        )
        .unwrap();
        assert!(read_installed(&root, &"a".repeat(64)).is_err());
        fs::create_dir_all(root.join("gp-next/packs/Example")).unwrap();
        std::os::unix::fs::symlink(&external, root.join("gp-next/packs/Example/link")).unwrap();
        assert!(capture(&root, "gp-next/packs/Example").is_err());
        fs::remove_dir_all(root).unwrap();
        fs::remove_dir_all(external).unwrap();
    }
}
