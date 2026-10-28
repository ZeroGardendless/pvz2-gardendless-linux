# Gardendless 0.16.1 / GP-Next 1.5.5

Pinned upstream: official international Windows release `0.16.1`, published
2026-10-24 (GitHub prerelease), with bundled GP-Next `1.5.5`.
Archive: https://github.com/Gzh0821/pvzg_site/releases/download/0.16.1/pvzge-0.16.1.zip
SHA-256: `eeb87b1ae7f0dacdba188ac2f6347f4158faf03020a69c6dd8d9b2a6ad626707`.
TauriDumper: official Mas0nShi 0.2.2. Extraction and downloaded executables remain
outside the repository in `/home/zero/gardendless-reference/update-20261027`.
Original content and GP-Next credits remain with their authors.

Restore points: `backups/update-20261027/public` and
`backups/update-20261027/host-and-tools.tar`. Existing saves/profiles were not edited.

| Area | Result |
| --- | --- |
| Game content and Cocos | Replaced from pinned extraction; 3392 code/data files match upstream. No compiled game-code patches. |
| GP-Next | 119 readable PascalCase modules; upstream mod configuration, recovery, APIs, trainer, diagnostics and tools retained with host adapters. |
| Audio | New named sound API and Cocos players use shared/native audio. Cancellation, predecode controls, fades and loops checked in fixtures. |
| Rendering | Sleeping FPS scheduler, hidden-overlay lifecycle control, optional 100/85/75/50 percent render buffers. No game simulation changes. |
| Launcher | Gardenest catalog/download/update with checksum validation, canonical GP-Next installer, disabled default, review and profile isolation. Local imports use the same installer. |
| UI | Restored our customized 1.5.0 overlay appearance and seven-tab navigation; retained 1.5.5 functionality. Cached mod artwork, lightweight press feedback, coalesced resize handling, and stable launcher dropdowns. |
| Version | Build reads the game's actual InsideVersion and regenerates Play metadata. |
| Assets | Stable root gpnicon.png and widescreen artwork preserved; 621 PNGs checked, 615 reduced, about 201 MB saved with identical decoded pixels. |
| Logs/permissions | 21 saved session logs showed no Tauri permission-denial records. Required center/close permissions added; frontend errors now reach rotating logs. |
| Cloud | Native cloud authorization unavailable without upstream Rust implementation; explicitly deferred by user. Official account/tasks/publishing open the Gardenest website. |

Validation: frontend/module/audio/render/installer/editor checks pass. Rust tests:
36 passed, 3 ignored. Browser startup reaches GP-Next ready at 1.5.5; 75 percent
scaling changes 1280x720 buffer to 960x540 without changing CSS dimensions.
Recorded native mixer output passed: gain follows requested volume in both directions, zero is silent, and the pause fade reaches silence in 0.5 seconds. The host WebKit media fallback volume check showed a gain mismatch; it remains an unresolved fallback limitation. No normal-level FPS comparison or full audible gameplay acceptance is claimed.
Flatpak build/install and GitHub release status are recorded in HANDOFF.md.

User authorized publishing v0.16.1 with a short changelog, Flatpak only.

## Restoration and import fixes (2026-10-28)

The replacement skin was removed in response to user feedback. Mods again show
thumbnail cards and vertical controls, and Settings is a scrolling page. Trainer
and diagnostics live in Tools; experiments remain in Settings. Native cloud
integration remains deferred rather than represented as working.

A real public Gardenest Luxis Lib archive reproduced `NEST_ZIP_EXTRA`: it contains
the standard NTFS timestamp extra field (0x000a). The bounded worker now accepts
that field without relaxing path, CRC, size, or symlink checks. Canonical installs
remain disabled until explicitly enabled; disabled JS packages may be installed
without opting into execution. Browser File handles are used for launcher drops
because native host paths may be unavailable inside Flatpak. Root and single-folder
wrapped ZIPs are supported. Tests installed the real archive only into a virtual
filesystem; no third-party JS ran or user mods were changed.

The Levels editor catalog is generated from the bundled resource index (1,289
level IDs) and each world map's own serialized data, including Epic worlds. It
supports individual statuses, world/category completion, and all-level completion
in the selected player's draft. Apply retains the existing backup and revision
checks. Rewards, world unlocks, and endless-run state are not fabricated. Legacy
advancedLevels entries migrate only when editing level progress.

Launcher dropdown regression passes in WebKitGTK: scroll/resize and unrelated
mutations keep the same menu, keyboard selection/Escape work, and modal animation
has no temporary transform containing block. Background page refresh waits for
an open menu to close. Browser preview verified completion in a fresh test draft;
no real save was edited. Physical desktop file drops and full gameplay remain
user acceptance checks.

## Follow-up after user acceptance feedback

The initial restore omitted the original Mods action panel and kept Tools too
crowded. Restored Reload All Patches, Restore All Originals, folder/status details,
mod-settings navigation, and always-visible Save & Reload / Discard controls.
Save uses the canonical configuration and application review rather than bypassing
1.5.5 journaling. Tools now has one UUID field; preference backups and diagnostics
are secondary pages. About imports the version constant instead of the data-type
list. The Levels layout uses explicit spacing and versioned launcher stylesheets.

The user's existing enabled JS mods exposed a missing feature-state dependency
in PackPreparation: launcher inspection options were discarded before final
preflight. The option is now passed through every preparation layer, with runtime
defaults preserved elsewhere. Reinstall/update also preserves an existing mod's
enabled state, so updating Luxis Lib cannot implicitly disable a dependency of
Luxis Roguelike. Brand-new mods remain disabled. Regression tests cover enabled
script mods with runtime opt-in off, and inspection of a read-only in-memory copy
of the user's actual installed profile with the real Luxis Lib archive. This
inspection neither wrote user files nor executed mod scripts.
