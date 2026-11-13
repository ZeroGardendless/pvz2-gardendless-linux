# Gardendless update journal

## 2026-10-27 — official 0.16.1 / GP-Next 1.5.5

User requested updating game content from the official GitHub Windows release,
extracting its executable with TauriDumper, and incorporating upstream GP-Next
features into our readable/customized implementation. Flatpak-only remains the
packaging preference. See `docs/MIGRATION_STATUS.md` for pinned hashes, backups,
the adaptation matrix and acceptance boundaries.

Initial findings: the official website reports game 0.16.1 and GP-Next 1.5.5.
GitHub marks the release as a prerelease, so `/releases/latest` returns 404;
the release collection and website metadata identify the correct source.
The shared modding knowledge-base lookup failed because its network lookup was
unavailable. Recon of the project directory misidentified the engine; actual
project files identify Tauri hosting a Cocos web export. No anti-cheat is involved.
Existing frontend checks passed before modification. Original game and overlay
are backed up; the reference extraction is kept outside this repository.

## Completed migration and release preparation

Imported game 0.16.1 and GP-Next 1.5.5, adapted native/shared audio and rendering
hooks without rewriting game bundles, added canonical launcher mod installs and
Gardenest public downloads/updates, polished UI controls, generated the game
version label from assets, and added rotating frontend diagnostics. Lossless PNG
optimization saved about 201 MB. Frontend checks pass; Rust: 35 passed, 3 ignored.
Browser startup and render scaling checked. User authorized v0.16.1 publication.
Native GP-Next cloud authorization remains explicitly deferred.

## 2026-10-28 — preserve the old overlay and repair imports

Restored the customized 1.5.0 visual layout while retaining upstream 1.5.5 logic.
Added bounded/cached datapack artwork and restored Enable/Disable cards. Fixed
Gardenest's valid NTFS timestamp ZIP metadata, disabled-JS installation, wrapped
ZIP inspection, and Flatpak-friendly browser File drops. Kept canonical review
and disabled-by-default imports. Added launcher menu stability fixes and a Levels
save editor using generated resource and world-map catalogs. Completion edits
remain drafts until backup-before-apply; real saves were not modified in testing.
Frontend and native WebKit regression checks pass. Release/install details follow
in docs/HANDOFF.md after final packaging.

## Accepted follow-up build

Restored the omitted Mods actions and Save & Reload flow; cleaned Tools down to
one UUID field with secondary utility pages; corrected the About version import;
and fixed Levels spacing and stylesheet caching. Full-profile preflight now
receives launcher inspection capabilities, and updates retain existing enabled
dependencies. Inherited game settings no longer use a stale file check when
editing desired mod selection; runtime JS opt-in is still enforced at startup.
A read-only copy of the actual profile passed Luxis Lib inspection without script
execution. The user accepted deferring a remaining live storage-host request
failure and explicitly requested publication. See HANDOFF.md for final artifact
hash, installed commit, and release state.

## 2026-11-11 — Aurum and official update investigation

User requests latest official game/GP-Next integration and a configurable built-in
optimization mod, Aurum. Official release API reports 0.16.15 (prerelease); GP-Next
site metadata reports 1.5.9, pending verification from its actual executable.
Preserved preexisting changes as backups/aurum-20261111/preexisting.patch. Download
and read-only module extraction live outside the checkout. Workspace-4 terminal
Aurum-build waits for a verified-source checkpoint before the Flatpak build.
Chosen route: existing GP-Next API v2 plus explicit early-host integration where
JS setup runs too late for startup work. No replacement game engine or speculative
simulation shortcuts. See docs/aurum/PLAN.md for evidence, acceptance and next work.

## 2026-11-11 — Lite payload and Aurum alpha

Switched to verified official 0.16.15 Lite (GP-Next 1.5.10), preserving our overlay,
Linux audio/rendering and launcher integration. Kept original game code unchanged.
Version metadata, keybind defaults and save catalog follow the updated payload.
Fixed startup-context forwarding and native-unavailable recovery diagnostics.

Aurum is bundled for explicit reviewed installation. A vertical per-profile switch
beside Play controls its next-launch selection. It provides lifecycle-scoped hook
sorting reuse, a shorter cover fade, optional bounded resource prefetch and an
explicit CPU-work sampler. All controls preserve canonical JS trust/opt-in checks.
Startup patches passed real Cocos smoke tests; cache gains are dispatcher-only
measurements. One-second startup and large gameplay FPS improvements remain targets.

## 2026-11-12 — Aurum 0.4 neutral zombie visual state

Pinned game remains official 0.16.15 Lite / GP-Next 1.5.10. Read-only reference
analysis identified Zombie.shouldMaterial issuing ~19 uniform writes every tick.
Cocos Pass.setUniform marks the whole material root UBO dirty unconditionally;
Pass.update uploads that buffer, even if all its values were identical. Every
zombie retains its own material and animations/simulation remain unchanged.

NeutralVisuals.js skips only a previously established neutral state, checking
actual uniform bytes and material/pass/buffer identities. Relevant effects and
nondefault additionalSatuation implementations retain the original functions.
Colour optimization skips the known white assignment only when the actual tint
already matches. Teleport armour side effects always retain the upstream path.
Snapshots use weak entity keys and reject foreign/oversized buffers (>4KiB).
No shared mutable positions, game object result caches or simulation throttling.
Hash guards match current shouldMaterial, shouldColor, additionalSatuation.

Validation: effect/external-write/lifecycle tests; real Cocos material buffers and
colour values compared against original methods for 11 states, repeated in three
alternating level comparisons. Initial fixtures had intro/objective overlays;
these are retained as explicitly named preliminary reports. Final fixture
completed the dialogue/objectives and verified a 1920x1080 client. Screenshot
inspected. Modern Day 16 +100 Basic Zombies (plus natural mission entities),
software-rendered headless WebKit, CPU update-to-after-draw timing. Median of three
window means: 30.77ms baseline / 20.21ms optimized, about 34.3% lower. Individual
pairs: 32.42/20.01, 30.77/20.21, 28.83/26.92ms. Final pair was more effect-heavy;
its p95 was 38/39ms. Effects falling back reduce the benefit; do not advertise
universal FPS or worst-frame improvement. Physical GPU/FPS, audible gameplay and
whole-process RSS remain separate measurements.


## 2026-11-13 — v0.16.24 and Aurum0.5

Moved to pinned official full0.16.24 and GP-Next1.5.11 while retaining our adapters,
classic overlay, launcher/audio/Linux integration and full PNGs. Imported matching
Markdown/keybind/community/music windows, native bounded public HTTP reads and
Tauri folder imports. Fixed a reproduced music IndexedDB Blob-write stall using
typed arrays with old-record compatibility. Removed unused legacy document/audio
stubs from bootstrap. Fixed zero-opacity menu entrances, no-op launcher rerenders,
overflow item recreation and closed-panel drawable leaks; kept the hotkey hint.

Aurum0.5 guards draw submissions using current mesh geometry, all relevant cameras
and verified vertex shaders. Bones, logic, events and audio continue. Pixel oracles
pass for12builtin/colour-shader cases and opaque/translucent window restoration.
Upstream changed character scheduling; collision math is unchanged from0.16.15,
so the existing guarded broad phase remains. Npm checks,42native tests and real
WebKit UI/window regressions pass; no new physical-GPU FPS/audibility claim.
