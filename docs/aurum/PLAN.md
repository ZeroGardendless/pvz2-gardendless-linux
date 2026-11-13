# Aurum: current implementation and next measurements

The user reports roughly **four seconds from window to title screen** and requests
**one second**. One second is the current target, not an achieved result.

## Current checkpoint — 2026-11-11

Official 0.16.15 **Lite** installed as the game payload, with its actually bundled
GP-Next **1.5.10**. Full 0.16.15 bundles 1.5.9; do not mix their bootstrap aliases.
Pins, backup paths, codec differences and subsystem choices are in
`docs/MIGRATION_STATUS.md`. Reference/decompiled code stays outside the checkout.
Our original overlay, launcher, Linux, audio, rendering and widescreen integrations
are retained. No compiled game-code modifications were made.

A Lite-only checkpoint Flatpak built successfully while Aurum work continued from
an independent snapshot. The final build adds the latest GP-Next and Aurum control.
The workspace-4 terminal runs `python build.py` independently of this chat. Its
log is `src-tauri/target/aurum/build.log`; the final source snapshot is under
`src-tauri/target/flatpak/source`. PNG optimization is part of the normal build;
Lite AVIF/WebP are not passed through a PNG optimizer.

## Implemented Aurum alpha

- Canonical, trusted-review package `public/builtin/Aurum.zip`; no JS opt-in bypass.
  Installs disabled; selected-profile enable/disable is a vertical switch beside
  Play. The switch reads desired configuration, never runs mod code in launcher.
  Runtime changes are locked while a game is running.
- Hook-order cache uses WeakMap + manager revision. Preserve priority/tie order,
  receiver/arguments/results/errors, removal invalidation and in-flight snapshots.
  Activates only while an enabled Aurum runtime session exists; disposal cannot
  disable another session. No cache of gameplay state or changed simulation ticks.
- Short startup cover fade: change only the matching 1.33-second cover tween to
  0.12 seconds. The temporary Tween.to hook is removed synchronously after splash
  start, including exceptions; no permanent per-animation dispatch overhead.
  This removes an intentional startup delay, not measured engine work.
- Optional speculative prefetch (OFF by default), 13 resource groups, concurrency
  1–4, deduplicated. Use resources.preload; keep original initialization order.
  Queued requests cancel; in-flight engine work is not falsely called aborted.
- Explicit 30-second CPU update-to-after-draw sample, fixed 2,048-sample storage,
  no idle listeners, cleanup on disposal. It does not measure GPU/presentation FPS.

## Evidence and limits

Core/lifecycle tests and actual current GP-Next dispatcher test pass. Node median
for 200,000 six-hook calls: baseline 60.00 ms, cached 21.85 ms on this run. This
is JS dispatcher overhead, **not gameplay FPS or WebKit performance**.
Actual bundled Aurum ZIP passes canonical inspection, disabled installation and
both enable/disable operations in isolated storage; no third-party script runs.
Real WebKit/Cocos fixture reaches mainScene with the short cover fade and all 13
prefetch paths, then disposes hooks. Default boot also reaches mainScene. The
headless software-rendered fixture took about 15 seconds without Aurum and is
not comparable to the user's physical-window four-second baseline.

Responsive launcher smoke passes at 1,180 / 800 / 360 pixels. Native bridge
recovery retains the primary error and does not attempt unavailable native repair.
Lite AVIF, WebP and M4A samples decode in host WebKit. No physical audio or dense
level A/B claim is made. No one-second startup or Sodium-scale FPS claim is made.

## Research retained

Luxis Lib: installed pack apiVersion 2, trusted/reloadable JS, setup(ctx), settings
and cleanup owned by GP-Next. Use it as API reference, never copy its compiled code.
GP-Next >=1.5.6 property getters must explicitly callNext; old pre-read-value
semantics are not restored. Keep updated upstream hooks and startup architecture.
Square.getLane already caches components; getLnC directly indexes the grid.
Do not cache shared mutable Vec2 results: callers own their returned positions.
Static getComponent counts only identify profiling candidates, not CPU bottlenecks.

## Architecture

1. Version-matched upstream integration; preserve Linux/audio/UI/save/launcher and
   widescreen behavior, add an explicit per-module adaptation matrix.
2. Early host work measures native start, asset server ready, WebKit document,
   GP-Next preparation, Cocos load, first visible menu. A late setup(ctx) mod cannot
   accelerate work that completed before its own import.
3. Aurum JS pack supplies settings, diagnostics, supported gameplay/render hooks,
   cleanup and restart-required controls. No global JS opt-in bypass.
4. Low-cost bounded profiling, disabled by default. Separate cold/warm startup,
   menu, ordinary level, and dense animated-zombie workload. Keep audio, shaders,
   render scale, frame limit and mod selection fixed between A/B runs.
5. Individually switchable optimizations; compatibility guards fail open to the
   original code. Diagnostics show active/skipped patches and the reason.

## Required validation

- Pin archive SHA and bundled GP-Next version before edits.
- Preserve user work in full backup before replacing asset directories.
- Inspect module API differences and Luxis hooks; never silently drop new APIs.
- Correctness tests: hook priority/ties, dynamic add/remove, nested calls, receiver,
  arguments, return values, exceptions, cleanup and mod reload.
- Representative A/B gameplay: frame-time percentiles, not just average FPS;
  wave outcomes and audio continuity; fixed render size and graphics settings.
- Startup timing must start at process launch and end at an interactive visible
  menu. Report cold and warm caches separately. No unsupported speedup claims.
- Final Flatpak build/install and runtime acceptance are distinct milestones.


## Next work

Measure process/window-to-interactive-title time and the upstream startup timeline
on the real Flatpak, separately cold and warm, with identical mods/audio/render
settings. Compare default vs Aurum short fade and prefetch independently. Profile
normal levels and dense animated-zombie scenes; only then add guarded rendering
or calculation patches where evidence shows a bottleneck. Never skip waves,
collisions, sound or animation ticks to produce a misleading FPS gain.

Final checkpoint built/installed: see HANDOFF.md for checksum and OSTree commit.
All 3,163 Lite M4A clips additionally pass the actual native decoder in isolation;
zero failures and zero oversized fallbacks. Physical playback remains unverified.
The user's real mod configuration also passes read-only copied-state inspection.

## 2026-11-12: Aurum 0.3 follow-up

The corrected frame-0 render archive is `exports/gardendless-0.16.15-idle-renders.zip`:
1,458 PNGs, 623 codenames and 392 costumes. Archive entries are taken from the final
healthy-arm manifest only; temporary/custom test renders are excluded. ZIP CRCs
verified; 33,661,127 bytes, SHA256
`3595ef68c5007726bed84f876e873ccde4f10aa16a27ffb810d415cddd0cb96e`.

Added an opt-out, exact-function-hash-guarded RTID parsing cache. Maximum 256 parsed
strings, no game object/result/current-level caching. The original object filter
still runs on every call, so replacement arrays, property edits, level changes and
mod hooks on getObjects remain live. Returned arrays are fresh. This removes
repeated replace/split temporaries, not complete game object allocation. Actual
bundled function oracle tests cover malformed inputs, filters, current-level
selection, live mutations, missing references, return isolation and teardown.
Node benchmark through actual GP-Next dispatcher: 200k queries median 100.59ms
original vs 22.41ms optimized. This is not a gameplay FPS or retained-RAM result.

Real Cocos/WebKit rendering fixture now runs 120 and 500 animated Basic Zombies,
without gameplay AI/audio/collisions. Median of three mean CPU frame durations:
120 entities 5.37ms original vs 5.32ms batching; 500 entities 17.85ms vs 16.77ms.
Small/inconsistent at 120, about 6% in the 500 case; do not advertise large FPS
improvements from batching. Headless/software rendering cannot establish the
user's physical GPU result. JSON evidence is in RenderingBenchmark120/500.json.

Added explicit ten-second CPU hotspot action under Aurum diagnostics: records
at most 64 methods (skeletal animation/attachments, collision, object resolution,
character/level updates and present scene-specific plant/zombie AI). No permanent
profiling overhead. Reports are inclusive synchronous times, nested rows must not
be summed, and instrumented timing includes profiler overhead. Return values,
receivers, exceptions and cleanup are tested. A real dense-level sample remains
necessary before changing AI scheduling, collision rules or animation sampling.

Real debug-Tauri isolated-profile probe reached mainScene, confirmed the new
lookup wrapper and live plant-data result, retained short splash fade/batching,
and confirmed unused audio preload added zero PCM decodes. This is separate from
physical audio, true process RSS, cold startup and gameplay FPS validation.

## 2026-11-12: Aurum 0.4 — measured zombie visual work

Added default-on, restart-required `neutralVisuals` toggle. Reuses unchanged neutral
shader buffers and existing white tints, guarded by exact current-game method
hashes, actual buffer contents and per-entity state. No animation/simulation/audio
updates are omitted. Active effects, teleport armour side effects, foreign buffer
writes/material replacements, and custom saturation logic keep the original code.
Snapshots use weak entity keys, maximum 4KiB per eligible buffer; snapshot bytes
are compared in place. This reduces repeated UBO uploads and temporary colour
construction; it is not a measured process-RAM reduction. Counters are included in
Aurum's Memory snapshot report; no permanent profiler hooks were added.

Final evidence: `NeutralVisualsBenchmark.json`, unobstructed Modern Day 16 at
verified 1920x1080, 100 added Basic Zombies plus the mission's normal entities.
Three alternating instrumented CPU comparisons: 32.42/20.01, 30.77/20.21,
28.83/26.92ms (baseline/optimized). Median means 30.77 -> 20.21ms (~34.3% lower).
The third, more effect-heavy optimized window had p95 39ms versus 38ms baseline;
no claim of universal FPS or worst-frame improvement. Preliminary reports with
intro/objective overlays are labelled separately and superseded for main results.
Real material-byte/tint oracle passed 11 states in each round. Final screenshot
`src-tauri/target/aurum/modern16-gameplay.png` inspected. Software/headless WebKit is
not a substitute for physical GPU, audible-playback or whole-process RSS testing.

Reproduce (no simultaneous native fixture):
```
node scripts/aurum/PrepareLevelFixture.mjs
python scripts/aurum/RunNativeProbe.py --script src-tauri/target/aurum/LevelFixture.js --phase level-profile --screenshot src-tauri/target/aurum/modern16-gameplay.png --timeout 180
```
Requires the existing debug native harness; fixture installer writes only under
`src-tauri/target/aurum`. `--acceptance` prepares an enabled 0.4 pack instead of A/B
mode (use completion phase `level-acceptance`). Native standalone startup/audio
probe confirms 0.4 visual hooks activate and unused audio preloads still decode
zero PCM. Your real profile was never edited by these tests.
