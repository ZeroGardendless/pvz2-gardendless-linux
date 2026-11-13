# Gardendless 0.16.1 handoff

Read MIGRATION_STATUS.md for pinned upstream sources and adaptation decisions.
Game 0.16.1 / GP-Next 1.5.5 are integrated. The customized 1.5.0 overlay appearance
and seven-tab layout are restored. Public Gardenest installation/update, package
artwork, wrapped ZIPs, File-based drops, stable launcher menus, and the Levels
save editor are implemented. Native cloud-save authorization remains deferred.

Build only Flatpak: `python build.py` after replacing assets. Use `--skip-png`
only for unchanged/already verified PNGs. The final build uses
`src-tauri/target/flatpak/gardendless-linux-x64.flatpak` and its SHA-256 companion.

## Accepted final build, 2026-10-28

Source: `a421ed76da578079d7e3e033d36c6898a761830a`.
OSTree app commit: `009be9e68776f86de376836e46cd032adcbc19c19fb93c81a38adb88c58b94b6`.
Flatpak: 1,011,158,296 bytes.
SHA-256: `a32430bc93a995a65b9951c312d6388f94273dd7eeee26d8fc940c43626eb110`.
`python build.py --skip-png` completed successfully; source snapshot matches the
final profile-preflight, inherited-settings, original-controls and spacing fixes.
The app was installed directly from the local repository and its deployed commit
was verified. Installation from the exact final bundle and release upload follow.

The user explicitly accepted deferring a remaining Gardenest storage-host request
failure (signed Cloudflare R2 download) and requested publication of this build.
The release notes list this known issue. Do not claim all live downloads work.

## Evidence boundaries

Frontend checks and readable-module checks pass (119 GP-Next modules). Rust tests:
36 passed, 3 ignored. WebKitGTK regression fixtures verify original navigation and
mod logos, File/ZIP worker imports, and dropdown scroll/resize/keyboard/modal
stability. A real public Luxis Lib archive passed canonical installation into a
virtual filesystem only; its JS was never run. Browser preview verified per-world
and all-level completion in fresh drafts. User saves/mods were not edited.

Earlier native mixer recordings passed requested gain, silence and 0.5-second
pause fade. The host WebKit media fallback gain mismatch is still unresolved.
Full gameplay FPS, audible gameplay and physical desktop drag-and-drop remain
user acceptance checks. Updating an installed Flatpak does not replace an
already-running process; relaunch to use the new build.

User authorized GitHub v0.16.1 publication with a short changelog and Flatpak only.

## 2026-11-11: 0.16.15 Lite and Aurum alpha checkpoint

Active payload and bundled GP-Next are now official **0.16.15 Lite / 1.5.10**.
See MIGRATION_STATUS.md for both archive pins, codec changes and preserved adapters.
The first Lite checkpoint Flatpak completed independently of Aurum work and was
retained at src-tauri/target/aurum/gardendless-lite-checkpoint.flatpak.
The final desktop-4 build adds reviewed Aurum installation, latest GP-Next, the
vertical switch next to Play, and recovery diagnostics. Its authoritative output
and checks are in src-tauri/target/aurum/build.log.

Aurum is available through Review Aurum in Datapacks or Set up beside Play. It is
installed disabled; the switch then enables it for the next launch. JS modding
must be enabled for the profile; inherited game preferences are checked at cold
startup. Short splash fade defaults on; speculative prefetch defaults off. Tuning
and CPU sampling live in GP-Next's mod settings/controls. No automatic JS execution
or changes to existing saves/mod selections occurred during testing.

Passed: full frontend checks, actual ZIP canonical fixture install and both toggle
states; real WebKit title-scene boot and codecs; real Cocos short fade + 13 prefetch
paths + cleanup; original overlay UI; responsive Play/Aurum grouping at 1180/800/360.
Aurum host tests include session lifetimes and in-flight hook snapshots. One-second
window-to-title and normal-level/dense-scene FPS A/B are still unverified. Do not
present Node dispatch microbenchmarks or headless startup times as gameplay gains.
No GitHub publication was performed for this update.

Final result: Flatpak built and installed on 2026-11-11.
Artifact: src-tauri/target/flatpak/gardendless-linux-x64.flatpak (386,105,048 bytes).
SHA-256: 3a9351301d63f50e25e8b0a65bf00b7835efb5026b4cf50418ae7bed546f76a1.
Installed OSTree commit verified equal to build:
86d0f656e0f6a697b57ba6788ffd4f3d8a4ecde7ea4c258ddfe2bfb2e1e6529a.
Flathub TLS lookup failed on the first install attempt; installation succeeded with
--no-deps --no-related using the already installed runtime. No runtime was removed.

Additional validation: every one of the 3,163 Lite M4A files decoded with the exact
current native Clip/decode implementation and the project's built Symphonia backend
in an isolated harness: zero failures, zero oversized fallbacks. This does not prove
physical playback. A WebKit interaction test also preserves switch DOM identity,
focus and on/off state through asynchronous updates without rebuilding menus.
A read-only in-memory copy of the user's real installed-mod configuration accepted
Aurum inspection; original files and third-party scripts were not written/executed.

## 2026-11-12: heavier Aurum work and idle-frame exporter

New native package commands implement GP-Next 1.5.10 batch snapshot I/O and local
inventory, fixing skipped installed content. Native startup probe with disposable
profile now confirms Aurum activation. Engine readiness retains the complete
Cocos namespace, including DragonBones, rather than overwriting it with legacy
window.cc. Aurum 0.2 uses the official startup registration phase; its cover fade
is confirmed applied before splash.start. The prior late setup was too late.

Audio: bundled M4A preloads read metadata, defer PCM/voice creation until playback,
and preserve native/browser fallback. PCM cache is 96 MiB rather than 256 MiB;
pending-play leases survive eviction, and live clips can be reused without another
decode. Native probe: 280 metadata entries, 14 decoded clips / 13,296,620 cached
PCM bytes after title; preloading three more files adds zero PCM decodes. This is
cache evidence, not whole-process RSS or physical audible verification.

Collision: guarded non-overlap rejection, actual game narrow phase for rotations,
contacts and unusual cases. 30,025 oracle pairs match; Node sparse query benchmark
is ~145ms original vs ~14ms optimized for 200,000 calls through actual GP-Next hooks.
These are query results, not gameplay FPS. Skeletal draw batching preserves real
animation and excludes custom materials, including materials assigned later.

Datapacks page opens a dedicated idle-render exporter. It reads 235 plant and
388 zombie feature CODENAME/RES mappings and renders active visual hierarchies at
time zero. Starting armour is resolved from ZombieTypes/Properties/ArmorTypes and
attached through the original skeleton sockets; 85 variants have starting armour.
Inactive temporary effects (including butter) are excluded. Body and attachments
share one PNG per body idle animation. Cowboy hat, Halloween/Kongfu helmet and
Dark shoulder rules follow the bundled visual methods without running gameplay.
Paths: kind/codename/codename__animation.png. Native-scale, transparent, padded.
Manifest lists sources, armour, animation, dimensions and failures. The exporter
uses an isolated WebKit data directory and never opens a game save/profile.
Before special appearance rules, a real WebKit full-catalog pass produced 860 PNGs
for all 623 codenames with zero render failures. Basic/Cone/Bucket, flag carrier
and Gargantuar images were inspected visually. This supersedes the incorrect raw
armature exporter that emitted butter images and omitted starting armour.
Native save portal uses app-cache staging then copies to the granted destination.

Renderer follow-up: plant AnimationController.Vineback/PotFront/PlantUpper prefabs
are now composed too (Umbrella Leaf's separate upper prefab contains its leaves).
All 392 feature-declared plant costumes are exported via the actual COS slot
selection rule, with base and costumes separated into codename/costumes/NN/.
Final real-WebKit catalogue pass: 1,458 PNGs, 623 distinct codenames, 392 distinct
costumes, zero reported failures. Every costume differs from its base in at least
one exported pose. Umbrella Leaf, Peashooter costume, Conehead, Buckethead, flag
carrier, Gargantuar, Cowboy cone and Knight images inspected visually.

Custom zombie generator in Datapacks: choose zombie, starting/no/custom armour,
body idle animation, butter and poison face. Preview then save one PNG plus its
selection manifest in a ZIP. Uses original sockets and POISONFACE slots, not a
painted tint. Unsupported effects produce an explicit error. Tested automated
preview/save flow in real WebKit with a Basic Zombie + bucket + butter + poison;
resulting PNG inspected. This uses a mocked native save bridge in the WebKit
harness; actual desktop portal interaction remains a separate manual check.
Source checks pass; native tests: 41 passed, 3 ignored. No additional gameplay FPS,
whole-process RAM, one-second cold-start or physical-audio claim is made here.

User caught exposed severed-arm stubs in the initially inspected zombie images.
Exporter now also mirrors current BodyGrouper.showArm(true)/showHead(true):
_HAND/_HEAD slots visible, _ARM stubs hidden, followed by costume/poison/helmet
rules. This is a visibility-state fix; atlas pixels and authored z-order remain
unchanged. Corrected custom buckethead PNG inspected; final rebuild supersedes
commit a157e4ac003008c8b5f6bf8babbebd29af134f8b68adcffc8ecb6563999e0d72.
Generator also disables editable controls during preview generation to prevent
saving a preview under a newer, mismatched selection.
Final healthy-arm full-catalog rerun: 1,458 PNGs across all 623 codenames, zero
render failures. Corrected Knight inspected after this run; arm stub is hidden.
Final Flatpak built and installed 2026-11-12. Installed commit verified:
4fef4c981ea5838f90eadecfc8a590a8a5769397d41d0af1088c9e90c7e12ef4.
Artifact SHA256: 018259b38e54b7683af80022f9a7df67c7db910735f18f3bdfc9573ef5e8e19b.
Owned headless renderer test server stopped; no real game save/profile used.
Aurum bundled version is 0.2.0-alpha; existing 0.1 installs need the launcher's
Aurum Update/review action to install the changed pack; installed preferences and
saves were deliberately not edited by the test harness.

## 2026-11-12: corrected archive delivered and Aurum 0.3

Downloadable render ZIP created under exports/ from the final manifest only;
1,458 PNGs plus manifest and README; CRC test passes. See docs/aurum/PLAN.md for
size/hash. Extra custom/old test images are excluded. Generated ZIPs ignored by Git.
Aurum 0.3 adds exact-hash-guarded bounded RTID parsing reuse and a transient CPU
hotspot action. Actual-game oracle/real GPNext hook benchmark and native isolated
Tauri activation pass. Source checks pass. No new physical gameplay/FPS/RSS claim.
Rendering benchmark evidence for 120/500 real skeletons shows batching has modest
CPU impact here; do not present it as a large general performance improvement.
Existing user saves/mod choices were not altered. Built-in Aurum still uses its
explicit Update/review workflow. Source descriptions and user preferences retained.
Final Aurum 0.3 Flatpak built and installed; installed commit matches build:
b9d5c8a8ecca3f9f7d81fdfceffaea33fab0a76930fb93a74896ba430f3fd94a.
Artifact SHA256: 5d3343eb916d5aee15ba81bb5ab1f5917aa17169f16a4cdc42d56ecf813d0e16.
Owned benchmark server/probes stopped. Restart launcher and apply built-in Aurum
Update/review to replace the installed old pack. For next optimization pass,
request the ten-second hotspot report from a real crowded level; synthetic
rendering and lookup microbenchmarks do not establish a whole-game FPS result.

## Active follow-up: full PNG restore, expanded renders, v0.16.15 publication

LATEST USER SCOPE: normal full-quality PNG media instead of Lite, fix Yeti costume
overlays, shadow forms, plant-food/permanent defensive armour, Lychee shell stages,
more action/damage/special poses, miscellaneous renders; normal Abbot must hide its
helmet extension. Continue Aurum after render work. Explicitly authorized GitHub
release **v0.16.15** with comprehensive changelog, finished Flatpak (no EXE/AppImage).

Current public/assets and named audio were already restored on disk when inspected:
all full-reference JSON files match exactly; all 622 PNGs decoded pixel-identically
to pinned full release (losslessly optimized bytes). Report FullPngVerification.json.
Normal source has 3493 MP3 files. NativeAudio metadata routing and Rust path guard
now accept MP3+M4A; four-header queue prevents preload bursts. All 3493 MP3 headers
pass real native parser without PCM decoding. Full native game title probe passes,
Aurum 0.4 hooks active, 293 metadata entries with only 1 decoded clip (~5.6MB cache);
unused 3 MP3 preloads add zero decodes. Physical playback/RSS remain unverified.

Renderer source: RenderStates.js supplies shadow (_DARK index1), Wallnut-derived
ARMOR indices 0–2, Lychee SHELL0–5 normal/PF indices0/1, Yeti COS_world exclusivity
and BP damage layers. Every named action clip gets 0/.5/.95 samples; idle at0.
Default scale4 (cap4096), PNG source retained. RenderExtras.js finds embedded
collectible/effect SpriteFrames/Prefabs in resource containers; static misc catalog
includes projectiles/scenery/armour/plant/zombie helper parts. Native ZIP supports
misc/, up to100k PNGs and64MiB manifest. Custom preview now has category, appearance,
costume, any animation/progress/scale controls. State tests pass; representative
real WebKit pass produced907 PNGs with zero failures and images visually checked:
Yeti normal/egypt separate, shadow pea, PF wall armour, PF degraded Lychee. Abbot
normal/helmet check produced26 PNGs; helmet extension now keyed by actual slot,
not exact prefab name (inherits Kongfu class). Normal/armoured images inspected.

Per-build game-asset fingerprint: GameAssetRevision.js generated by
scripts/launcher/AssetRevision.mjs (currently d41a28b81ba5d3f8...); AssetCache.js versions
local Cocos file requests while preserving caching/saves and remote mod sources.
Native renderer uses fresh render-webview-full-png-v1 data dir. URL/callback tests pass.

CURRENT LONG-RUNNING BULK CHECK: RunRenderWorkers.py owns HTTP server and 2 WebKit
workers for plants/zombies/misc. It was restarted under one controller after the
separate asset-server process was interrupted. Tool session76943. Host parent
PID106867, server106868; workers106907/106908 (verify live before kill). The controller
starts misc after a slot frees and stops its server on completion. Generated PNGs
under src-tauri/target/aurum/render-full-quality; manifests are manifest-plants.json,
manifest-zombies.json, manifest-misc.json. DO NOT use old manifest.json/manifest-all
or old leftovers when packaging; build new ZIP from the union of current manifests
only. Paths now encode base/costume/state/category/progress. Some helper/effect
assets may be unsupported/empty; inspect full manifests, fix actual errors, report
legitimate limitations. Current tool source RenderWebKitSmoke.c compiled to target
webkit-render-probe; accepts timeout seconds, tests use7200. Renderer helpers stay
under scripts/launcher; no decompiled game code published.

Release preparation: app/package/Cargo/tauri versions bumped0.16.15, Flatpak metadata
updated. docs/releases/v0.16.15.md comprehensive draft; generated ReleaseNotes.js
shows it offline on launcher Releases page. Build regenerates notes + fingerprint +
render catalog + Aurum. Source npm check passes after adapting native audio contract
tests to loadPrepared and testing MP3/M4A lazy routing/concurrency. Rust tests41passed,
4ignored plus explicit full-header test passes. Run final checks after later edits.

GitHub: target repo ZeroGardendless/pvz2-gardendless-linux; v0.16.15 currently absent.
v0.16.1 old notes read via gh; use same friendly/professional style. Connector has no
release upload capability; local gh client works. No new branch/commit/tag/draft/upload
has been made yet. Need inspect source diff, preserve existing user work, create
codex/ release branch if needed, commit appropriate project source only (exports/
fully ignored; reference code outside repo; root main/index.js is tracked upstream
payload and differs due requested migration), push source/tag, build/install final
Flatpak, upload bundle+checksum (possibly new render ZIP if manageable), publish and
VERIFY remote isDraft/assets/tag. Never call publication complete on EOF. User gave
explicit publication authorization; no additional permission question needed.

Still required: finish bulk render verification and new ZIP; finish requested Aurum
follow-up after renderer (0.4 already measured; possible next candidate is armour's
11 unchanged shader writes per tick—read-only investigation in /tmp/render-Armor.ts.js,
not implemented). Full release build/install and native/UI smoke; source release and
GitHub publication. Previous installed0.16.1/Aurum0.4 artifact remains old Lite and is
NOT the new release. Source full normal debug binary built with MP3/header fixes;
latest native full probe passed in native-full-probe-result.log. Tests touch only
native-probe XDG directories. Old extracted render ZIP/folder under exports/ belongs
to user; preserve it, don't commit it.


## 2026-11-13 — active v0.16.24 release checkpoint

User superseded the unpublished v0.16.15 release with official full 0.16.24,
confirmed GitHub tag v0.16.24, and requested autonomous build/install/upload
terminals on workspace 7. Preserve the shortcut hint; the GP-Next panel itself
is hidden/inert/display:none while closed. No 0.16.15 tag/release was published.

Game assets now match the pinned 0.16.24 full reference; 622 PNGs decoded-identically
verified. New atlas optimized losslessly. Game metadata .24, GP-Next1.5.11, Aurum0.5.
Core scheduling is upstream's implementation, collision methods unchanged from.15.
No local edits to game logic or engine. See MIGRATION_STATUS and release notes.

Native tests42passed/4ignored. Npm check passes. Real WebKit stable-menu/closed-overlay
regression, original overlay cards/actions/version regression and game-window tests
pass. Game-window tests cover Markdown, sandboxed keybind apply, mocked native
community transport with real git-blob hashing/play callback, update window, music
imports/order. A real WebKit IndexedDB Blob-write stall was reproduced and fixed
by storing typed arrays while retaining compatibility with old Blob records.
Culling pixel oracle passed12builtin/colour-shader cases including visible actors
following culled actors in shared buffers, partial/mirrored/offscreen states, opaque
window hiding/restoration, and translucent windows. It is not an FPS benchmark.

scripts/release/ReleasePipeline.sh has independent build/install/publish modes
with source-pinned receipts and failure markers. PublishV01624.sh uploads Flatpak
and checksum to a draft, verifies asset sizes/digests and notes, then publishes.
Markers/logs live under src-tauri/target/flatpak/pipeline-v0.16.24-<source-prefix>.
Do not claim new installation/publication until respective ready markers/remote
assets and draft=false are verified. The currently installed old package before
these jobs is .16.15 commit f77b8a9743dd0cdd4ba55f51cdbd6b95485a1e4e9e9947a738e0cfc027755548.
Aurum existing installations still require canonical Update/review; do not silently
change user's mod selection or trust. The large full render ZIP in exports/ is an
explicitly .16.15 archive (20967PNGs, CRC verified), not new .24 renders.
