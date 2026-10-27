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
| GP-Next | 117 readable PascalCase modules; upstream mod configuration, recovery, APIs, trainer, diagnostics and tools retained with host adapters. |
| Audio | New named sound API and Cocos players use shared/native audio. Cancellation, predecode controls, fades and loops checked in fixtures. |
| Rendering | Sleeping FPS scheduler, hidden-overlay lifecycle control, optional 100/85/75/50 percent render buffers. No game simulation changes. |
| Launcher | Gardenest catalog/download/update with checksum validation, canonical GP-Next installer, disabled default, review and profile isolation. Local imports use the same installer. |
| UI | Shared font, polished controls, custom dropdowns, settings pages, icons and spacing. |
| Version | Build reads the game's actual InsideVersion and regenerates Play metadata. |
| Assets | Stable root gpnicon.png and widescreen artwork preserved; 621 PNGs checked, 615 reduced, about 201 MB saved with identical decoded pixels. |
| Logs/permissions | 21 saved session logs showed no Tauri permission-denial records. Required center/close permissions added; frontend errors now reach rotating logs. |
| Cloud | Native cloud authorization unavailable without upstream Rust implementation; explicitly deferred by user. Official account/tasks/publishing open the Gardenest website. |

Validation: frontend/module/audio/render/installer/editor checks pass. Rust tests:
35 passed, 3 ignored. Browser startup reaches GP-Next ready at 1.5.5; 75 percent
scaling changes 1280x720 buffer to 960x540 without changing CSS dimensions.
Recorded native mixer output passed: gain follows requested volume in both directions, zero is silent, and the pause fade reaches silence in 0.5 seconds. The host WebKit media fallback volume check showed a gain mismatch; it remains an unresolved fallback limitation. No normal-level FPS comparison or full audible gameplay acceptance is claimed.
Flatpak build/install and GitHub release status are recorded in HANDOFF.md.

User authorized publishing v0.16.1 with a short changelog, Flatpak only.
