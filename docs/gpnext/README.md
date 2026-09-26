# GPNext development

The live overlay lives in `public/gpnext/`. `public/index.html` loads `Main.js`;
there is no generated chunk-name mapping or additional frontend build step.

| Folder | Responsibility |
| --- | --- |
| `core/` | Preferences, logging, client edition and module preloading |
| `runtime/` | Cocos integration, frame pacing, widescreen and game extensions |
| `mods/` | Installation, patching, configuration, recovery and JS mod APIs |
| `data/` | Data browser, inspection and edit tracking |
| `ui/` | Overlay shell, components and translations |
| `ui/tabs/` | Tab renderers and their lifecycle hooks |
| `platform/` | Tauri APIs, desktop integration and cloud client |
| `vendor/` | Imported module helpers |

Module filenames are PascalCase. Thirteen redundant forwarding modules were
collapsed into their implementations. The JS mod entry retains its deliberate
side-effect import. Some private variables still retain short names from the
original distributed bundles; this is not a claim to have recovered their source.

Local snapshots are preserved in `backups/gpnext/GpnBackup1` and `GpnBackup2`.
They are excluded from Git and the embedded application. Game assets retain their
existing directories in `public/assets/`.

## Frame pacing and overlay cost

The default is **120 FPS**. Old Unlimited values migrate to 120; the selectable
limits are 30, 60, 90, 120, 144, 165 and 240. `runtime/FrameRate.js` schedules one
sleeping timer at a time with fractional deadlines. A single message handoff
after that timer avoids nested browser timer clamping; messages never self-post. Missed frames are discarded
rather than replayed after a stall. All limits use the same scheduler, independent
of browser RAF; the Cocos pacer still owns pause/resume. Hidden windows return to
the browser scheduler. GPNext retains control if the game's own settings attempt
to restore a different frame rate. These are game-loop limits, not a promise that
a monitor displays more distinct frames than its physical refresh rate.

The Performance tab records actual Cocos draw events in a bounded circular
history, without shifting its sample array every frame. UI polling runs four times
per second. Logs coalesce bursts into at most ten automatic refreshes per second,
reuse row elements, and cancel pending work when the tab closes.

`runtime/Widescreen.js` loads only the selected artwork and coalesces resize
callbacks. None clears all artwork. The fixed visible-width cutoff is 1920 CSS
pixels regardless of window height; see `public/assets/widescreen/README.md`.

## Validation and building

- `npm run check`: module imports/exports/preloads, actual Cocos pacing, settings
  persistence, performance history, widescreen and PCM-cache regression tests.
- `npm run gpnext:readable`: format modules and recover exported symbol names.
- `npm run gpnext:readable:check`: verify the formatting and module graph.
- `npm run build:binary`: validate, snapshot the frontend, then run Tauri build
  with `--no-bundle`. Output: `src-tauri/target/release/gardendless` on Linux.
- `cargo test --manifest-path src-tauri/Cargo.toml --lib`: GPU selection tests.

`scripts/checks/WebKitSmoke.html` exercises module imports, FPS controls,
About/Logs rendering, burst logging and real WebKit timer pacing. It needs the
live frontend served at `/` and a `/__checks/modules.json` module manifest. It uses
mock Tauri window metadata and Discord IPC and does not exercise real native
IPC or full gameplay. High limits are workload-dependent; the smoke test checks
that they never run above the requested cap.

`npm run assets:optimize -- --oxipng /path/to/oxipng` runs level-2 compression with
two threads. Python and Pillow are required. It backs up PNGs, verifies dimensions
and decoded RGBA frames, and restores failures. Reports/backups are written under
`src-tauri/target/png-optimization/`. It does not use lossy transparent-pixel edits
or strip metadata.

Linux-specific launcher code is in `src-tauri/src/platform/linux/`; the executable
entry point delegates to the shared Tauri application setup in `src-tauri/src/lib.rs`.
Embedded assets are generated in the executable entry point, avoiding a second
large copy in the library archive. WebKit rendering configuration retains the
existing 60-FPS-preference override.

## Linux automatic GPU selection

Before GTK/WebKit initialize, the launcher scans accessible DRM render devices.
On first launch it prefers the firmware-primary AMD GPU. Otherwise it prefers a
Mesa GPU attached to a built-in panel, then the usual integrated Intel PCI bus,
then other available AMD/Intel graphics. These are discovery hints, not a claim
that every GPU can be identified as integrated from sysfs. If only NVIDIA is
available it retains system graphics and enables the NVIDIA DMA-BUF fallback.

The automatic choice is saved in `$XDG_CONFIG_HOME/com.zero.gardendless/gpu-selection.json`
(or `~/.config/com.zero.gardendless/gpu-selection.json`). It stores PCI identity
and reselects when hardware changes; render-node renumbering is harmless. Delete
that file to redo first-launch selection. Failed discovery/cache writes do not
prevent launching.

Selection sets Mesa's `DRI_PRIME` and WebKit's `WEBKIT_WEB_RENDER_DEVICE_FILE`.
On hybrid NVIDIA/Mesa systems, an installed Mesa EGL manifest is selected too.
Explicit GPU environment overrides take precedence. `GARDENDLESS_DMABUF=0`
forces the fallback; `=1` forces DMA-BUF on. The automatic fallback follows the
chosen GPU rather than merely checking whether an NVIDIA driver is loaded.

Run `cargo test --manifest-path src-tauri/Cargo.toml --lib` for the GPU discovery,
selection, persistence, and hardware-change tests. Actual hybrid-GPU operation
still needs validation on those machines.

## Tools and recovery

Tools now includes a UUID v4 generator with copy, a ten-item session history and
an online documentation link. Mod troubleshooting lists validation/runtime errors
and names the mods sharing a hook, with refresh-on-demand diagnostics. Sharing a
hook is reported as a possible conflict, not proof that the mods are incompatible.
Diagnostic exports now include runtime error messages and shared-hook owners.

Settings includes JSON preference export and a validated import preview. Applying
an import restarts the game. It transfers appearance, language, FPS, input and HP
display preferences; it does not enable experimental mods, copy saves or alter pack
selection. Native file-dialog permissions are included.

Recovery mode is available from Tools and the startup failure screen. It restarts
with `?gpnext-recovery=1`, bypasses both mod startup paths and uses fresh in-memory
local storage. Normal game saves and mod selections are untouched. Recovery
progress/preferences disappear on reload or exit; return with the visible button.
The recovery UI disables Mods/Data management and skips cloud initialization.

## Measured GPNext changes

Data views take one game-data snapshot, precompute search text, and memoize the
visible-entry comparisons. A fresh view after editing or reopening the tab
invalidates the cache. A 10,000-entry fixture across 20 repeated queries performs
100 comparisons rather than 2,000 for the same visible rows. This is a controlled
operation-count measurement, not a claim about gameplay FPS.

Mod status reporting builds shared-hook counts once, rather than scanning all
hooks for every mod. A 50-runtime fixture verifies one scan instead of 50. The
new `scripts/checks/Features.mjs` covers these measurements, UUID generation,
preference imports, recovery storage, Windows paths and audio-hook gating.

See [Windows builds](../platforms/Windows.md) for local and GitHub Actions builds,
and [the launcher roadmap](../LauncherRoadmap.md) for the next phase.
