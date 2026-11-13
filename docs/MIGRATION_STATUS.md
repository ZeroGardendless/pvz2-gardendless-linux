# Current baseline — full-quality 0.16.24 / GP-Next 1.5.11

User requested this update on 2026-11-13 and changed the authorized release tag
to v0.16.24. Official full Windows archive: `pvzge-0.16.24.zip`, asset 739829796,
1,199,547,980 bytes. SHA-256:
`c1ecb7a68f9ffeb4736d83acffcf06b9d6393aadfc64ca1866ae491dfaa16ffc`.
Verified hash and ZIP CRC before extracting without execution. Reference and
pre-migration public backup remain outside the checkout under update-20261113.

Imported main/resources changes and matching HTML windows/vendor assets. Cocos,
src and named audio are unchanged from full 0.16.15. All 622 PNGs are pixel-identical
to the new full reference; the new atlas was losslessly optimized. Save catalog now
contains 1,298 levels. No game logic or Cocos implementation was patched locally.

GP-Next 1.5.11 comparison: core mod loader/snapshot changes are import aliases;
version/build identity updated, obsolete website-keybind Spanish record removed,
new game windows and music-pack ordering retained. Our adapters/export aliases,
classic overlay, Linux/audio/launcher/widescreen integrations remain deliberate.

HTML Markdown uses upstream marked + DOMPurify with credits retained; keybind HTML
runs in its sandbox and applies through the game's callback. Public community/update
reads use bounded native Tauri transport. Music imports use the Tauri directory
picker and declared paths; typed-array storage avoids a reproduced WebKit IndexedDB
Blob-write stall while still reading existing Blob records.

Rectangle judgeCrossRec implementations match 0.16.15 exactly. The new upstream
optimization changes character logic scheduling; Aurum retains this and does not
replace it. Aurum 0.5 adds guarded offscreen/opaque-window draw culling, without
skipping bones, events, simulation or sound. Cocos/WebKit pixel oracle passed 12
builtin/game-colour shader cases plus opaque-window restoration/translucency.
This does not establish a new gameplay FPS improvement. Old benchmark files below
remain evidence for their explicitly recorded 0.16.15 baseline only.

Closed GP-Next uses hidden + inert + display:none, including drawers and popup
cleanup. The shortcut hint stays visible as requested. Shared HTML dropdowns,
stable overflow item identities, no-op launcher refresh reuse and non-fading page
entrances address the reported flicker; browser regressions cover those states.

Previous sections below are historical.

# Current media baseline — full-quality 0.16.15 / GP-Next 1.5.10

User requested normal-release PNG assets on 2026-11-12, superseding Lite media.
The working game assets and JSON metadata now match the pinned full 0.16.15
archive: SHA-256 `922d42e4474ba7bac06490d4615e9305fc8c33ee0901f234c5b6cde81447ff10`.
All 622 PNGs were decoded and compared against the full reference: identical RGBA
pixels and dimensions. Lossless PNG compression is retained. Evidence:
`docs/aurum/FullPngVerification.json`. Full MP3 media and its named audio manifest
are retained; native metadata-only preloads now support both MP3 and M4A.

Our GP-Next 1.5.10 host, launcher, audio/Linux/widescreen integrations and Aurum
remain intact. We did not restore the full archive's older GP-Next 1.5.9 UI.
Game asset URLs carry a stable build fingerprint so Lite image/import caches
cannot mask replacement textures; saves and preferences are not cleared.
Render exports now use normal PNG atlases and an explicit output scale, rather
than silently relying on small game-scale screenshots. Build/install verification
is recorded in HANDOFF.md. The Lite section below is historical.

# Gardendless 0.16.15 Lite / GP-Next 1.5.10

Active source: official `Gzh0821/pvzg_site` release `0.16.15`, Lite asset
`pvzge-lite-0.16.15.zip`, GitHub asset ID `735744891`, 384,702,844 bytes.
SHA-256: `cc14cba32c245313e7691836fd8f485cb8253ef02ac890dec7594085b5b11895`.
The full archive's bundled GP-Next is 1.5.9; **Lite actually bundles 1.5.10**.
Both downloaded archives passed pinned hash verification. Lite passed ZIP CRC
verification before extracting its executable with TauriDumper 0.2.2, without
executing it. Reference code stays outside the repository at
`/home/zero/gardendless-reference/update-20261111/lite`.

The Lite extraction is 525,282,242 bytes versus 1,391,002,225 for full. Game
`assets/main/index.js`, Cocos, settings and resource catalog are identical;
616 PNG resources become 605 AVIF + 11 WebP and 3,163 MP3 resources become M4A.
This is an upstream codec change, not a claim of pixel/audio-identical compression.
Full comparison is in `docs/aurum/LiteComparison.json`. The named audio manifest
has 697 matching entries, and all referenced clips exist.

| Subsystem | Adaptation |
| --- | --- |
| Game | Replaced main/internal/resources, cocos-js and src from verified Lite. No patches to game logic or Cocos source. |
| GP-Next | Latest mod/data core, 1.5.10 metadata, local-pack sync, pending selection, requirement checks, startup hosts and property-hook semantics. |
| UI | Existing customized overlay and tab layout preserved; new translations merged with our captions. Artwork restored in describe results. |
| Linux/audio/rendering | Existing platform bridge, native/shared audio, FPS and resolution scaling preserved. Lite startup calls our audio before Cocos initialization. |
| Launcher | Scoped fresh installation retained alongside upstream native migration. Version and keybind defaults read from current game; 235 plants, 14 upgrades, 1,289 levels. |
| Startup | New Lite startup context is forwarded through its beforeRun wrapper. Browser-only recovery keeps original error and avoids native repairs without a host/backup. |
| Aurum | Built-in reviewed ZIP, installed disabled. Vertical per-profile switch beside Play. Cache is opt-in through the mod lifecycle; short splash fade, optional bounded prefetch, bounded diagnostics; all cleanup retained. |
| Deliberate deviations | Our named/native audio replaces upstream pooled HTML audio. Existing Linux/GPU/widescreen/UI integration retained. Native cloud authorization remains deferred by the user. |

Validation completed: full frontend checks; real Aurum archive installed/enabled/
disabled in isolated fixture storage; native WebKit overlay smoke; Lite AVIF,
WebP and M4A sample decode; title-scene boot; real Cocos Aurum short-fade,
13-resource prefetch and cleanup smoke; Play/Aurum alignment and no horizontal
overflow at 1,180 / 800 / 360 pixels. Xvfb software rendering is not a startup or
FPS benchmark. No physical audio, normal-level A/B or one-second startup result
is claimed. Flatpak build/install status is recorded in HANDOFF.md.

Preexisting changes and complete public tree were backed up before replacement.
No user saves or mod configurations were edited by tests. Upstream credits retained.
The sections below are historical validation of the previous baseline.

# Previous baseline: Gardendless 0.16.1 / GP-Next 1.5.5

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

The user's final acceptance explicitly defers an additional live Gardenest
storage-host request failure to the next update and authorizes publication of the
current build. This network/download limitation is listed in the release notes;
passing preflight fixtures does not establish that all live downloads succeed.

Lite also ships its own bootstrap rendering defaults: WebGL antialiasing is off,
and shading pixel ratio is capped at 1.5 on high-DPI displays. Those upstream Lite
choices and its startup timeline are retained alongside our render-scale control.
