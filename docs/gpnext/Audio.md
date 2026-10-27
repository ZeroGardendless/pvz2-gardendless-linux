# Linux audio

`public/gpnext/audio/Bootstrap.js` installs the Cocos audio adapter before the
game loads. Linux first tries `NativeAudioEngine`; Windows/WebView2 keeps the
original Cocos backend. `scripts/assets/PatchCocos.mjs` patches the Cocos audio
factories and runs `PatchGameAudio.mjs`. Unknown engine signatures fail the
build, so replacing game files cannot silently bypass the integration.

## Native mixer

`src-tauri/src/audio/` decodes compressed audio with Symphonia on blocking
workers. One dedicated mixer thread sends 48 kHz stereo float samples to
PulseAudio, including PipeWire's PulseAudio compatibility service. Its ten
millisecond mixing blocks use one output stream, rather than one WebKit/GStreamer
pipeline per effect. The requested output buffer is forty milliseconds.

Embedded game clips are read directly through Tauri's asset resolver. Blob and
external mod clips are fetched by the adapter and submitted for decoding.
Decoded clips share a 256 MiB LRU cache. Idle players hold metadata and weak
references; active voices retain their samples until playback stops. The per-clip
limit is 256 MiB. All 4,187 MP3 files in the current bundled assets pass the
native decoder check, including long music and files with incomplete initial
MP3 bit-reservoir packets.

`NativeAudio.js` implements Cocos's playback, seek, loop and event interface.
It batches property changes through IPC, uses a local playback clock, and
releases finished voices and clip handles. Asynchronous preparation is guarded
against stop, destruction and rapid pause/resume races. Normal overlapping
sounds are retained. An emergency limit of 512 simultaneous native voices
reports an error instead of allowing an unbounded mod workload.

Gain is applied directly in the mixer. The game pause patch fades gain to
silence in about 0.5 seconds using elapsed time, keeps normal playback speed,
and then freezes the music timeline. Resume continues from that position.
The mixer performs no automatic gain boost. Summed samples are clamped to the
output range, so exceptionally dense, loud effects can still clip.

## Media fallback

If native output is unavailable or a clip cannot be decoded, the adapter retains
`AudioEngine`, `AudioAssets` and `AudioPlayer` as a WebKit media fallback. Its
compressed asset requests are deduplicated, and position reads use a clock
synchronized by media events instead of calling GStreamer every game frame.
It also avoids allocating an unused AudioContext just to unlock media playback.

GP-Next's media sound profiles apply to this fallback. They intentionally bound
its media pipelines and pending effects; they do not discard native mixer voices
in response to slow rendering frames. The fallback can still inherit WebKitGTK
or GStreamer behavior, including gain inconsistencies observed in the real
output fixture. Check `window.__gdAudio.diagnostics()` for the selected backend,
active players, queued updates and errors.

## Validation

`npm run check` covers player state, gain, seeking, overlapping playback,
cancellation, disposal and the actual generated Cocos factories. It also checks
the delta-time pause helper and the original Windows backend.

The Rust tests cover decoding, mixing, gain, voice retention and paused position.
Two opt-in integration checks need separate commands:

```sh
cd src-tauri
cargo test --release --lib audio::tests::decode_bundled_audio -- --ignored --nocapture
```

For recorded output, use the built Rust test executable with the helper. It
creates a temporary null sink, records the volume phases, verifies monotonic
RMS in both directions and silence, and removes the sink afterward:

```sh
python scripts/checks/AudioVolume.py --native <Rust-test-executable> audio::tests::real_output --ignored --nocapture
```

The 128-voice mixing test is a CPU microbenchmark, not a gameplay FPS result.
Decoder checks do not establish that every game event triggers the right sound.
Recorded tones establish output gain and fade behavior; full level playback,
Bluetooth reconnects and NVIDIA rendering still require runtime acceptance.
