# Linux audio

The Linux WebKit audio backend lives in `public/gpnext/audio/`. `Bootstrap.js`
installs it before Cocos loads. Windows/WebView2 and Chromium keep Cocos's native
backend. `scripts/assets/PatchCocos.mjs` connects the three Cocos audio factories
to the new backend and migrates the older DOM-only patches. Unknown engine
signatures stop the build so replacement game files cannot silently bypass it.

`AudioAssets.js` fetches compressed assets with four concurrent requests and
deduplicates requests for the same URL and Cocos audio mode. It reads MP3 frame
headers to identify long clips; music and one-shot effects use native HTML media
playback from a compressed Blob. Explicit Web Audio clips use a decoder with at
most two concurrent decodes. The shared cache has a 128 MiB budget; active
playback retains its resource until it stops.
Fetch, decode, metadata and playback operations have timeouts and failed loads
can be retried. An unsupported short clip can fall back to native media playback.

`AudioPlayer.js` owns each voice's source, gain, position and event handlers.
New Web Audio sources are created for replay; HTML media elements are never
shared between players. A seek during a pending play updates its starting
position without cancelling playback. Live media seeks keep the same pipeline,
and unchanged volume or playback rate values do not reconfigure it every game
frame. One-shot effects prepare their native media before Cocos starts them and
release their players when they end. Up to four idle effect pipelines are kept
for reuse, including across different clips; changing a clip revokes its old
object URL. Errored pipelines are discarded. Rejected one-shots are stopped
immediately rather than waiting for a future click. Music retains its native pipeline while
paused so resume can use the same player; stop and destruction release its
object URL.

`AudioEngine.js` handles the Cocos player interface, game interruptions and
browser autoplay restrictions. User input unlocks Web Audio and retries blocked
music. It caps native SFX at four active voices, two concurrent preparations,
and eight pending requests. Excess requests are dropped before they can create an
unbounded WebKit media backlog. If audio effects accompany two consecutive frames
longer than 250 ms, it clears those voices and pauses new effects for three seconds.
Linux WebKit permits music to start after an
asynchronous scene load.
Read `window.__gdAudio.diagnostics()` in the console for cache size, active
voices, pending loads, media pipelines, dropped effects, recovery events, gesture waits and the
latest errors. Native resources
returned by `loadNative()` expose `__gdDispose()` for explicit cleanup.

## Validation

`npm run check` includes `scripts/checks/Audio.mjs`: it exercises independent
voices, live controls, cancellation, gesture retries, cleanup, caching and the
actual patched Cocos factories, including the Windows fallback.

The integration probe uses real game MP3 files and WebKitGTK's `tauri://` scheme.
It generates a trusted click in a virtual X11 display, measures decoded Web
Audio samples with an analyser, and checks that a native SFX voice advances
alongside streaming music. It also checks music playback and seeking. It uses
very low playback volume and needs GTK/WebKitGTK, XTest and Xvfb development/runtime
packages plus access to an audio service:

```sh
cc scripts/checks/WebKitAudio.c -o src-tauri/target/checks/webkit-audio $(pkg-config --cflags --libs webkit2gtk-4.1 xtst x11)
xvfb-run -a src-tauri/target/checks/webkit-audio
```
