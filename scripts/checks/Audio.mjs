import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {AudioEngine} from '../../public/gpnext/audio/AudioEngine.js';
import {mp3Duration, deadline} from '../../public/gpnext/audio/AudioAssets.js';
import {usesLinuxAudio} from '../../public/gpnext/audio/Bootstrap.js';
import {patchCocosSource} from '../assets/PatchCocos.mjs';

function mp3(frames) {
  const bytes = new Uint8Array(417 * frames);
  for (let i = 0; i < frames; i++) bytes.set([255,251,144,0], i * 417);
  return bytes.buffer;
}
assert.ok(Math.abs(mp3Duration(mp3(100)) - 100 * 1152 / 44100) < 0.001);
assert.equal(mp3Duration(new ArrayBuffer(100)), null);
assert.equal(usesLinuxAudio('Linux AppleWebKit/605 Safari/605'), true);
assert.equal(usesLinuxAudio('Linux AppleWebKit/537 Chrome/130'), false);
assert.equal(usesLinuxAudio('Windows NT AppleWebKit/537 Edg/130'), false);
await assert.rejects(deadline(new Promise(() => {}), 5, 'test operation'), /timed out/);

class Media extends EventTarget {
  constructor() { super(); this.readyState = 0; this.duration = 30; this.currentTime = 0; this.paused = true; this.volume = 1; }
  set src(value) { this.url = value; this.readyState = 0; queueMicrotask(() => { this.readyState = 1; this.dispatchEvent(new Event('loadedmetadata')); }); }
  play() { this.paused = false; return Promise.resolve(); }
  pause() { this.paused = true; }
  removeAttribute() { this.url = ''; }
  load() {}
}
class Context {
  constructor() { this.state = 'running'; this.currentTime = 0; this.destination = {}; this.sources = []; this.gains = []; this.decodes = 0; }
  resume() { this.state = 'running'; return Promise.resolve(); }
  async decodeAudioData() {
    this.decodes++;
    return {duration: 2, length: 44100 * 2, numberOfChannels: 1, sampleRate: 44100,
      getChannelData: () => new Float32Array([0,0.5,-0.5])};
  }
  createBufferSource() {
    const node = {playbackRate: {value: 1}, connect() {}, disconnect() {},
      start(when, offset) { this.started = true; this.offset = offset; }, stop() { this.stopped = true; }};
    this.sources.push(node); return node;
  }
  createGain() {
    const node = {gain: {value: 1}, connect() {}, disconnect() {}};
    this.gains.push(node); return node;
  }
}
let fetches = 0, failFetch = false;
const events = new Map(), blobs = new Set();
const host = {
  location: {href: 'tauri://localhost/'}, Audio: Media, AudioContext: Context, Blob,
  URL: {createObjectURL() { const url = 'blob:test/' + Math.random(); blobs.add(url); return url; }, revokeObjectURL(url) { blobs.delete(url); }},
  console: {warn() {}}, addEventListener(name, callback) { events.set(name, callback); },
  async fetch(url) {
    fetches++;
    if (failFetch) throw new Error('Network fixture failure');
    return {ok: true, arrayBuffer: async () => mp3(url.includes('music') ? 1000 : 80)};
  }
};
const engine = new AudioEngine(host);
const [left, right] = await Promise.all([engine.load('sfx.mp3'), engine.load('sfx.mp3')]);
assert.equal(fetches, 1, 'concurrent loads share fetch and decode');
const context = engine.context();
assert.equal(context.decodes, 1);
await Promise.all([left.play(), right.play()]);
assert.equal(context.sources.length, 2, 'overlapping SFX have independent sources');
left.volume = 0.25;
assert.equal(context.gains[0].gain.value, 0.25, 'volume applies during playback');
context.currentTime = 0.5;
assert.equal(left.currentTime, 0.5);
left.playbackRate = 2;
context.currentTime = 0.75;
assert.equal(left.currentTime, 1, 'rate changes preserve the preceding elapsed time');
await left.pause();
assert.equal(left.currentTime, 1);
await left.play();
assert.equal(context.sources.at(-1).offset, 1, 'resume uses paused offset');
await left.seek(0.2);
assert.equal(context.sources.at(-1).offset, 0.2);
left.loop = true;
assert.equal(context.sources.at(-1).loop, true);
await left.stop();
assert.equal(left.currentTime, 0);
const beforeReplay = context.sources.length;
await left.play();
assert.equal(context.sources.length, beforeReplay + 1, 'stopped sources are never reused');
let ended = 0;
left.onEnded(() => ended++);
const end = context.sources.at(-1).onended;
end(); end();
assert.equal(ended, 1, 'ended fires once');
assert.equal(right.state, 1, 'ending one voice leaves another voice playing');
left.destroy(); right.destroy();

const decodeCount = context.decodes;
const music = await engine.load('music.mp3');
assert.equal(context.decodes, decodeCount, 'music never enters the Web Audio decoder');
assert.equal(blobs.size, 0, 'preloading music does not create a media pipeline');
await music.play();
assert.equal(blobs.size, 1);
music.volume = 0.3;
assert.equal(music.media.audio.volume, 0.3);
music.media.audio.currentTime = 4;
const pausedMusicPipeline = music.media;
await music.pause();
assert.equal(music.offset, 4);
assert.equal(music.media, pausedMusicPipeline, 'pause retains the music pipeline');
assert.equal(blobs.size, 1, 'pause keeps the stream ready for resume');
await music.play();
assert.equal(music.media, pausedMusicPipeline, 'resume reuses the music pipeline');
assert.equal(music.media.audio.currentTime, 4);
const activeMusicPipeline = music.media;
await music.seek(7);
assert.equal(music.media, activeMusicPipeline, 'seeking music does not tear down its media pipeline');
assert.equal(music.media.audio.currentTime, 7, 'media seek applies immediately');
music.destroy();
assert.equal(blobs.size, 0);

const domMode = await engine.load('short-dom.mp3', {audioLoadMode: 0});
assert.equal(domMode.asset.kind, 'stream', 'Cocos DOM_AUDIO mode overrides the short-clip heuristic');
await domMode.play();
assert.ok(domMode.media, 'DOM_AUDIO creates a native media pipeline');
domMode.destroy();

const immediateSeek = await engine.load('immediate-seek-music.mp3', {audioLoadMode: 0});
const pendingMusic = immediateSeek.play();
await immediateSeek.seek(5);
await pendingMusic;
assert.equal(immediateSeek.state, 1, 'Cocos play followed by seek keeps music playing');
assert.equal(immediateSeek.currentTime, 5, 'Cocos play followed by seek applies the new position');
immediateSeek.destroy();

const cancelled = await engine.load('cancel.mp3');
let resume;
context.resume = () => new Promise(resolve => { resume = resolve; });
const pendingPlay = cancelled.play();
await new Promise(resolve => setImmediate(resolve));
const beforeCancel = context.sources.length;
await cancelled.stop();
resume(); await pendingPlay;
assert.equal(context.sources.length, beforeCancel, 'stop cancels pending playback');
context.resume = Context.prototype.resume;
cancelled.destroy();

let plays = 0, ends = 0;
const shot = await engine.loadOneShotAudio('shot.mp3', 0.2, {audioLoadMode: 1});
const shotPlayer = [...engine.players].at(-1);
assert.equal(shotPlayer.asset.kind, 'stream', 'one-shot effects use audible native media output');
shot.onPlay = () => plays++; shot.onEnd = () => ends++;
shot.play();
await new Promise(resolve => setImmediate(resolve));
shotPlayer.media.audio.onended();
assert.equal(plays, 1); assert.equal(ends, 1);
assert.equal(engine.players.size, 0, 'one-shot completion releases its player');
const recycledAudio = engine.idleEffectMedia.at(-1).media.audio;
const repeatedShot = await engine.loadOneShotAudio('shot.mp3');
const repeatedPlayer = [...engine.players].at(-1);
assert.equal(repeatedPlayer.media.audio, recycledAudio, 'repeated effects reuse their media pipeline');
repeatedShot.stop();
const crossAssetMedia = engine.idleEffectMedia.at(-1).media.audio;
const differentShot = await engine.loadOneShotAudio('different-shot.mp3');
const differentPlayer = [...engine.players].at(-1);
assert.equal(differentPlayer.media.audio, crossAssetMedia, 'effect pipeline is reused across different clips');
assert.equal(blobs.size, engine.mediaResources.size, 'old object URL is revoked on clip change');
differentShot.stop();

engine.maxEffectVoices = 2;
const firstVoice = await engine.loadOneShotAudio('voice.mp3');
const secondVoice = await engine.loadOneShotAudio('voice.mp3');
let evictions = 0;
firstVoice.onEnd = () => evictions++;
firstVoice.play(); secondVoice.play();
const thirdVoice = await engine.loadOneShotAudio('voice.mp3');
thirdVoice.play();
assert.equal(evictions, 1, 'the oldest effect is retired at the voice limit');
assert.equal(engine.activeEffects.size, 2, 'native effect voices stay bounded');
secondVoice.stop(); thirdVoice.stop();
engine.maxEffectVoices = 4;
assert.ok(engine.idleEffectMedia.length <= engine.maxIdleEffectMedia, 'idle pipeline pool stays bounded');

const cocosDomShot = await engine.loadOneShotAudio('short-cocos-dom.mp3', 0.5, {audioLoadMode: 0});
const cocosDomPlayer = [...engine.players].at(-1);
assert.equal(cocosDomPlayer.asset.kind, 'stream', 'Cocos DOM_AUDIO effects use native media');
cocosDomShot.stop();

let unlockedPlays = 0;
const blocked = await engine.load('blocked-music.mp3', {audioLoadMode: 0});
blocked.on('played', () => unlockedPlays++);
const nativePlay = Media.prototype.play;
Media.prototype.play = () => Promise.reject(Object.assign(new Error('Gesture required'), {name: 'NotAllowedError'}));
await blocked.play();
await new Promise(resolve => setImmediate(resolve));
assert.equal(engine.waiting.size, 1);
Media.prototype.play = nativePlay;
events.get('pointerdown')();
await new Promise(resolve => setImmediate(resolve));
assert.equal(unlockedPlays, 1, 'gesture retry starts blocked music');
assert.equal(engine.waiting.size, 0);
blocked.stop();
blocked.destroy();
const deniedShot = await engine.loadOneShotAudio('denied.mp3');
Media.prototype.play = () => Promise.reject(Object.assign(new Error('Gesture required'), {name:'NotAllowedError'}));
deniedShot.play();
await new Promise(resolve => setImmediate(resolve));
assert.equal(engine.activeEffects.size, 0, 'rejected one-shots leave no active effect');
assert.equal(engine.waiting.size, 0, 'rejected one-shots do not queue stale retries');
Media.prototype.play = nativePlay;
engine.maxPendingEffects = 0;
await assert.rejects(engine.loadOneShotAudio('overload.mp3'), /queue is full/);
assert.equal(engine.droppedEffects, 1, 'excess effects are dropped before allocating media');
engine.maxPendingEffects = 8;

failFetch = true;
await assert.rejects(engine.load('retry.mp3'), /Network/);
failFetch = false;
const retried = await engine.load('retry.mp3');
retried.destroy();
assert.equal(engine.assets.pending.size, 0, 'failed tasks do not poison the cache');
engine.assets.budget = 44100 * 2 * 4;
engine.assets.clear();
const one = await engine.load('first.mp3'), two = await engine.load('second.mp3');
assert.ok(engine.assets.bytes <= engine.assets.budget);
assert.equal(engine.assets.cache.size, 1);
one.destroy(); two.destroy();

// Execute the actual patched Cocos factory, rather than only checking strings.
const source = await readFile('public/cocos-js/_virtual_cc-9deb4621.js', 'utf8');
assert.equal(patchCocosSource(source), source, 'the patcher is idempotent');
const start = source.indexOf('N9=function(){');
const factory = source.slice(start, source.indexOf('N9.maxAudioChannel', start));
const gameEvents = new Map();
const game = {on(event, callback) { gameEvents.set(event, callback); }};
function descriptors(type, entries) {
  for (const {key, ...descriptor} of entries) Object.defineProperty(type.prototype, key, descriptor);
}
const fallback = {load: async () => ({marker: 'native'}), loadNative: async () => 'native', loadOneShotAudio: async () => ({})};
class OneShotFacade {
  constructor(audio) { this.audio = audio; }
  play(rate = 1) { this.audio.play(rate); }
  stop() { this.audio.stop(); }
  get onEnd() { return this.audio.onEnd; }
  set onEnd(callback) { this.audio.onEnd = callback; }
}
const api = runInNewContext('var N9;' + factory + ';N9', {
  window: {__gdAudio: engine}, EB: game, bB: {EVENT_PAUSE:'pause', EVENT_RESUME:'resume'},
  n: descriptors, L9: OneShotFacade,
  O9: fallback, b9: fallback, R9: {support:true}, u9: {DOM_AUDIO:0}, tt() {}
});
const cocosPlayer = await api.load('factory.mp3');
await cocosPlayer.play();
assert.equal(cocosPlayer.state, 1);
gameEvents.get('pause')();
assert.equal(cocosPlayer.state, 4);
gameEvents.get('resume')();
await new Promise(resolve => setImmediate(resolve));
assert.equal(cocosPlayer.state, 1, 'Cocos game interruption resumes active audio');
assert.ok(await api.loadNative('factory.mp3'), 'native factory returns instead of evaluating returnfalse');
cocosPlayer.destroy();
const cocosMusic = await api.load('factory-music.mp3', {audioLoadMode: 0});
const cocosMusicStarted = cocosMusic.play();
await cocosMusic.seek(10);
await cocosMusicStarted;
assert.equal(cocosMusic.state, 1, 'Cocos play followed by seek keeps music playing');
assert.equal(cocosMusic.currentTime, 10, 'Cocos play followed by seek starts at the requested position');
cocosMusic.destroy();
const cocosShot = await api.loadOneShotAudio('factory-sfx.mp3', 0.6, {audioLoadMode: 1});
const cocosShotPlayer = [...engine.players].at(-1);
let cocosShotEnded = 0;
cocosShot.onEnd = () => cocosShotEnded++;
cocosShot.play();
await new Promise(resolve => setImmediate(resolve));
assert.equal(cocosShotPlayer.state, 1, 'Cocos one-shot factory starts native playback');
assert.equal(cocosShotPlayer.media.audio.volume, 0.6, 'Cocos one-shot volume reaches native playback');
cocosShotPlayer.media.audio.onended();
assert.equal(cocosShotEnded, 1, 'Cocos one-shot end callback fires');
const nativeApi = runInNewContext('var N9;' + factory + ';N9', {
  window: {}, n: descriptors, L9: class {}, O9: fallback, b9: fallback,
  R9: {support:true}, u9: {DOM_AUDIO:0}, tt() {}
});
assert.equal(await nativeApi.loadNative('windows.mp3'), 'native', 'Windows retains the original Cocos backend');
const frames = [];
let frameTime = 700;
host.requestAnimationFrame = callback => frames.push(callback);
host.document = {visibilityState: 'visible'};
host.performance = {now: () => frameTime};
engine.monitorFrames();
const recoveryLeft = await engine.loadOneShotAudio('recovery-left.mp3');
const recoveryRight = await engine.loadOneShotAudio('recovery-right.mp3');
recoveryLeft.play(); recoveryRight.play();
for (const time of [100, 400, 700]) frames.shift()(time);
assert.equal(engine.activeEffects.size, 0, 'sustained slow frames stop active effect voices');
assert.equal(engine.idleEffectMedia.length, 0, 'recovery releases idle native pipelines');
assert.equal(engine.audioRecoveries, 1);
await assert.rejects(engine.loadOneShotAudio('backoff.mp3'), /recover frame rate/);
frameTime = 3701;
const afterRecovery = await engine.loadOneShotAudio('backoff.mp3');
afterRecovery.stop();
events.get('pagehide')();
assert.equal(engine.assets.bytes, 0);
console.log('Passed: actual Cocos factories, SFX overlap/replay/volume/rate/seek, cancellation, music without PCM decoding, blob cleanup, cache eviction, retries and Windows fallback.');
