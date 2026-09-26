//! Select graphics before GTK/WebKit initialize. Cache PCI identity, never card numbers.
use serde::{Deserialize, Serialize};
use std::{
    env, fs,
    path::{Path, PathBuf},
};

const AMD: &str = "0x1002";
const INTEL: &str = "0x8086";
const NVIDIA: &str = "0x10de";
const POLICY_VERSION: u32 = 1;

#[derive(Clone, Debug, PartialEq, Eq)]
struct Gpu {
    pci: String,
    vendor: String,
    device: String,
    driver: String,
    render_node: PathBuf,
    primary: bool,
    internal_display: bool,
}
impl Gpu {
    fn mesa(&self) -> bool {
        matches!(self.vendor.as_str(), AMD | INTEL)
            && matches!(self.driver.as_str(), "amdgpu" | "radeon" | "i915" | "xe")
    }
    fn prime_id(&self) -> String {
        format!("pci-{}", self.pci.replace([':', '.'], "_"))
    }
    fn identity(&self) -> String {
        format!(
            "{}:{}:{}:{}:{}:{}",
            self.pci, self.vendor, self.device, self.driver, self.primary, self.internal_display
        )
    }
}

#[derive(Serialize, Deserialize)]
struct SavedSelection {
    version: u32,
    hardware: Vec<String>,
    pci: String,
}

fn read(path: impl AsRef<Path>) -> String {
    fs::read_to_string(path)
        .unwrap_or_default()
        .trim()
        .to_owned()
}
fn discover(drm: &Path, dev_dri: &Path) -> Vec<Gpu> {
    let mut gpus = Vec::new();
    let Ok(entries) = fs::read_dir(drm) else {
        return gpus;
    };
    for entry in entries.flatten() {
        let name = entry.file_name().to_string_lossy().into_owned();
        let Some(number) = name.strip_prefix("card") else {
            continue;
        };
        if number.is_empty() || !number.bytes().all(|b| b.is_ascii_digit()) {
            continue;
        }
        let Ok(device_path) = fs::canonicalize(entry.path().join("device")) else {
            continue;
        };
        let pci = device_path
            .file_name()
            .unwrap_or_default()
            .to_string_lossy()
            .into_owned();
        if !valid_pci(&pci) {
            continue;
        }
        let Ok(nodes) = fs::read_dir(device_path.join("drm")) else {
            continue;
        };
        let Some(render_node) = nodes.flatten().find_map(|node| {
            let name = node.file_name().to_string_lossy().into_owned();
            name.strip_prefix("renderD")
                .filter(|n| !n.is_empty() && n.bytes().all(|b| b.is_ascii_digit()))?;
            let path = dev_dri.join(name);
            // Only choose devices the current user can actually open.
            fs::OpenOptions::new()
                .read(true)
                .write(true)
                .open(&path)
                .ok()?;
            Some(path)
        }) else {
            continue;
        };
        let driver = fs::read_link(device_path.join("driver"))
            .ok()
            .and_then(|p| p.file_name().map(|n| n.to_string_lossy().into_owned()))
            .unwrap_or_default();
        let internal_display = fs::read_dir(drm)
            .into_iter()
            .flatten()
            .flatten()
            .any(|connector| {
                let connector_name = connector.file_name().to_string_lossy().into_owned();
                let Some(suffix) = connector_name.strip_prefix(&format!("{name}-")) else {
                    return false;
                };
                ["eDP-", "LVDS-", "DSI-"]
                    .iter()
                    .any(|prefix| suffix.starts_with(prefix))
                    && read(connector.path().join("status")) == "connected"
            });
        gpus.push(Gpu {
            pci,
            vendor: read(device_path.join("vendor")),
            device: read(device_path.join("device")),
            driver,
            render_node,
            primary: read(device_path.join("boot_vga")) == "1",
            internal_display,
        });
    }
    gpus.sort_by(|a, b| a.pci.cmp(&b.pci));
    gpus
}
fn valid_pci(pci: &str) -> bool {
    let bytes = pci.as_bytes();
    bytes.len() == 12
        && bytes[4] == b':'
        && bytes[7] == b':'
        && bytes[10] == b'.'
        && bytes
            .iter()
            .enumerate()
            .all(|(i, b)| matches!(i, 4 | 7 | 10) || b.is_ascii_hexdigit())
}
fn preferred(gpus: &[Gpu]) -> Option<&Gpu> {
    // Primary AMD wins, even if an Intel integrated GPU is also present.
    // Built-in panel ownership is evidence of integrated graphics; Intel bus 00
    // is a secondary hint. Do not classify every Intel GPU as integrated (Arc).
    gpus.iter()
        .filter(|gpu| gpu.mesa())
        .min_by_key(|gpu| {
            let rank = if gpu.vendor == AMD && gpu.primary {
                0
            } else if gpu.internal_display {
                1
            } else if gpu.vendor == INTEL && gpu.pci.starts_with("0000:00:") {
                2
            } else if gpu.primary {
                3
            } else {
                4
            };
            (rank, &gpu.pci)
        })
        .or_else(|| gpus.iter().find(|gpu| gpu.primary))
        .or_else(|| gpus.first())
}
fn choose<'a>(gpus: &'a [Gpu], saved: Option<&SavedSelection>) -> Option<&'a Gpu> {
    let hardware: Vec<_> = gpus.iter().map(Gpu::identity).collect();
    if let Some(saved) =
        saved.filter(|saved| saved.version == POLICY_VERSION && saved.hardware == hardware)
    {
        if let Some(gpu) = gpus.iter().find(|gpu| gpu.pci == saved.pci) {
            return Some(gpu);
        }
    }
    preferred(gpus)
}
fn cache_path() -> Option<PathBuf> {
    let base = env::var_os("XDG_CONFIG_HOME")
        .map(PathBuf::from)
        .filter(|p| p.is_absolute())
        .or_else(|| env::var_os("HOME").map(|p| PathBuf::from(p).join(".config")))?;
    Some(base.join("com.zero.gardendless/gpu-selection.json"))
}
fn save(path: &Path, gpu: &Gpu, gpus: &[Gpu]) -> std::io::Result<()> {
    let value = SavedSelection {
        version: POLICY_VERSION,
        hardware: gpus.iter().map(Gpu::identity).collect(),
        pci: gpu.pci.clone(),
    };
    let bytes = serde_json::to_vec_pretty(&value)?;
    if fs::read(path).ok().as_deref() == Some(bytes.as_slice()) {
        return Ok(());
    }
    fs::create_dir_all(path.parent().unwrap())?;
    let temporary = path.with_extension(format!("{}.tmp", std::process::id()));
    fs::write(&temporary, bytes)?;
    let result = fs::rename(&temporary, path);
    if result.is_err() {
        let _ = fs::remove_file(temporary);
    }
    result
}
fn configure_dmabuf(nvidia: bool) {
    match env::var("GARDENDLESS_DMABUF").ok().as_deref() {
        Some("0") => env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1"),
        Some("1") => env::remove_var("WEBKIT_DISABLE_DMABUF_RENDERER"),
        _ if nvidia && env::var_os("WEBKIT_DISABLE_DMABUF_RENDERER").is_none() => {
            env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1")
        }
        _ => {}
    }
}

/// Call once from main, before GTK/WebKit and any graphics threads start.
pub fn configure() {
    let gpus = discover(Path::new("/sys/class/drm"), Path::new("/dev/dri"));
    // Explicit launch options take precedence over automatic selection. Avoid
    // partially applying auto settings on top of a user's different GPU choice.
    let manual = [
        "DRI_PRIME",
        "WEBKIT_WEB_RENDER_DEVICE_FILE",
        "__NV_PRIME_RENDER_OFFLOAD",
        "__GLX_VENDOR_LIBRARY_NAME",
        "__EGL_VENDOR_LIBRARY_FILENAMES",
    ]
    .iter()
    .any(|key| env::var_os(key).is_some());
    if manual {
        let prime = env::var("DRI_PRIME").unwrap_or_default();
        let node = env::var_os("WEBKIT_WEB_RENDER_DEVICE_FILE").map(PathBuf::from);
        let selected = gpus
            .iter()
            .find(|gpu| node.as_ref() == Some(&gpu.render_node))
            .or_else(|| {
                gpus.iter()
                    .find(|gpu| gpu.prime_id() == prime.trim_end_matches('!'))
            });
        let nvidia = selected.map(|gpu| gpu.vendor == NVIDIA).unwrap_or_else(|| {
            env::var("__NV_PRIME_RENDER_OFFLOAD").as_deref() == Ok("1")
                || env::var("__GLX_VENDOR_LIBRARY_NAME").as_deref() == Ok("nvidia")
                || gpus.iter().any(|gpu| gpu.primary && gpu.vendor == NVIDIA)
        });
        configure_dmabuf(nvidia);
        eprintln!("[GPU] Keeping explicit graphics environment overrides");
        return;
    }
    let path = cache_path();
    let saved = path
        .as_ref()
        .and_then(|p| fs::read(p).ok())
        .and_then(|bytes| serde_json::from_slice::<SavedSelection>(&bytes).ok());
    let Some(gpu) = choose(&gpus, saved.as_ref()) else {
        eprintln!("[GPU] No accessible PCI render devices; using system graphics selection");
        configure_dmabuf(Path::new("/sys/module/nvidia").exists());
        return;
    };
    if gpu.mesa() {
        env::set_var("DRI_PRIME", gpu.prime_id());
        env::set_var("WEBKIT_WEB_RENDER_DEVICE_FILE", &gpu.render_node);
        // Prevent GLVND from loading NVIDIA's EGL implementation on hybrid PCs.
        let mesa_egl = Path::new("/usr/share/glvnd/egl_vendor.d/50_mesa.json");
        if gpus.iter().any(|gpu| gpu.vendor == NVIDIA) && mesa_egl.is_file() {
            env::set_var("__EGL_VENDOR_LIBRARY_FILENAMES", mesa_egl);
        }
    }
    configure_dmabuf(gpu.vendor == NVIDIA);
    if let Some(path) = path {
        if let Err(error) = save(&path, gpu, &gpus) {
            eprintln!("[GPU] Could not save automatic selection: {error}");
        }
    }
    eprintln!(
        "[GPU] Selected {} GPU {} ({}, {}); NVIDIA DMA-BUF fallback: {}",
        gpu.vendor,
        gpu.pci,
        gpu.driver,
        gpu.render_node.display(),
        gpu.vendor == NVIDIA
    );
}

#[cfg(test)]
mod tests {
    use super::*;
    fn gpu(pci: &str, vendor: &str, primary: bool, internal_display: bool) -> Gpu {
        Gpu {
            pci: pci.into(),
            vendor: vendor.into(),
            device: "0x1234".into(),
            driver: match vendor {
                AMD => "amdgpu",
                INTEL => "i915",
                _ => "nvidia",
            }
            .into(),
            render_node: "/dev/dri/renderD128".into(),
            primary,
            internal_display,
        }
    }
    #[test]
    fn primary_amd_beats_integrated_intel() {
        let gpus = [
            gpu("0000:00:02.0", INTEL, false, true),
            gpu("0000:01:00.0", AMD, true, false),
        ];
        assert_eq!(preferred(&gpus).unwrap().vendor, AMD);
    }
    #[test]
    fn nvidia_primary_uses_integrated_graphics() {
        let gpus = [
            gpu("0000:01:00.0", NVIDIA, true, false),
            gpu("0000:04:00.0", AMD, false, true),
        ];
        assert_eq!(preferred(&gpus).unwrap().vendor, AMD);
        let gpus = [
            gpu("0000:01:00.0", NVIDIA, true, false),
            gpu("0000:00:02.0", INTEL, false, false),
        ];
        assert_eq!(preferred(&gpus).unwrap().vendor, INTEL);
    }
    #[test]
    fn nvidia_only_remains_usable() {
        let gpus = [gpu("0000:01:00.0", NVIDIA, true, false)];
        assert_eq!(preferred(&gpus).unwrap().vendor, NVIDIA);
        assert!(preferred(&[]).is_none());
    }
    #[test]
    fn cache_survives_render_node_renumbering_but_not_hardware_changes() {
        let mut gpus = vec![gpu("0000:04:00.0", AMD, true, true)];
        let saved = SavedSelection {
            version: POLICY_VERSION,
            hardware: gpus.iter().map(Gpu::identity).collect(),
            pci: gpus[0].pci.clone(),
        };
        gpus[0].render_node = "/dev/dri/renderD129".into();
        assert_eq!(
            choose(&gpus, Some(&saved)).unwrap().render_node,
            PathBuf::from("/dev/dri/renderD129")
        );
        gpus[0] = gpu("0000:00:02.0", INTEL, true, true);
        assert_eq!(choose(&gpus, Some(&saved)).unwrap().vendor, INTEL);
    }
    #[test]
    fn invalid_cache_does_not_force_removed_gpu() {
        let gpus = [gpu("0000:04:00.0", AMD, true, true)];
        let saved = SavedSelection {
            version: POLICY_VERSION,
            hardware: gpus.iter().map(Gpu::identity).collect(),
            pci: "0000:99:00.0".into(),
        };
        assert_eq!(choose(&gpus, Some(&saved)).unwrap().vendor, AMD);
    }
    #[test]
    fn pci_ids_are_validated_and_formatted_for_mesa() {
        assert!(valid_pci("0000:04:00.0"));
        assert!(!valid_pci("card0"));
        assert!(!valid_pci("../../bad"));
        assert_eq!(
            gpu("0000:04:00.0", AMD, true, true).prime_id(),
            "pci-0000_04_00_0"
        );
    }
    #[test]
    fn discovers_accessible_devices_and_persists_pci_identity() {
        use std::os::unix::fs::symlink;
        let root = env::temp_dir().join(format!("gardendless-gpu-fixture-{}", std::process::id()));
        let _ = fs::remove_dir_all(&root);
        let drm = root.join("drm");
        let nodes = root.join("nodes");
        let device = root.join("devices/0000:04:00.0");
        fs::create_dir_all(drm.join("card7")).unwrap();
        fs::create_dir_all(drm.join("card7-eDP-1")).unwrap();
        fs::create_dir_all(device.join("drm/renderD137")).unwrap();
        fs::create_dir_all(&nodes).unwrap();
        symlink(&device, drm.join("card7/device")).unwrap();
        symlink("/drivers/amdgpu", device.join("driver")).unwrap();
        fs::write(device.join("vendor"), AMD).unwrap();
        fs::write(device.join("device"), "0x1681").unwrap();
        fs::write(device.join("boot_vga"), "1").unwrap();
        fs::write(drm.join("card7-eDP-1/status"), "connected").unwrap();
        assert!(discover(&drm, &nodes).is_empty());
        fs::write(nodes.join("renderD137"), "").unwrap();
        let gpus = discover(&drm, &nodes);
        assert_eq!(gpus.len(), 1);
        assert_eq!(gpus[0].pci, "0000:04:00.0");
        assert!(gpus[0].internal_display && gpus[0].primary);
        let cache = root.join("config/gpu-selection.json");
        save(&cache, &gpus[0], &gpus).unwrap();
        let saved: SavedSelection = serde_json::from_slice(&fs::read(&cache).unwrap()).unwrap();
        assert_eq!(choose(&gpus, Some(&saved)), Some(&gpus[0]));
        fs::remove_dir_all(root).unwrap();
    }
}
