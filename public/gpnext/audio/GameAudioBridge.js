import { AudioEngine } from "./AudioEngine.js";
const clampVolume = (value) => Math.max(0, Math.min(1, Number(value) || 0));
class GameAudioBridge {
  constructor(engine, manifest, root, timers = globalThis) {
    this.engine = engine;
    this.manifest = manifest;
    this.root = root;
    this.timers = timers;
    this.voices = /* @__PURE__ */ new Map();
    this.timed = /* @__PURE__ */ new Set();
    this.nextId = 1;
    this.timer = null;
  }
  listClips() {
    return Object.keys(this.manifest);
  }
  play(name, speed = 1, volume = 0.9) {
    const path = this.manifest[name];
    if (!path) return null;
    const id = this.nextId++;
    const voice = {
      id,
      player: null,
      playing: true,
      volume: clampVolume(volume),
      speed,
      position: 0,
      fade: null,
      restartBeforeEnd: null
    };
    this.voices.set(id, voice);
    const url = new URL(path.split("/").map(encodeURIComponent).join("/"), this.root).href;
    this.engine.load(url).then(async (player) => {
      if (!this.voices.has(id)) {
        player.destroy();
        return;
      }
      voice.player = player;
      player.isEffect = !name.startsWith("Music_");
      if (player.isEffect) player.pausedForFade = false;
      player.volume = voice.volume;
      player.playbackRate = voice.speed;
      player.onEnded(() => this.destroy(id));
      if (voice.position) await player.seek(voice.position);
      if (voice.playing) await player.play();
      this.schedule();
    }).catch((error) => {
      this.engine.report("named clip", url, error);
      this.destroy(id);
    });
    return id;
  }
  setVolume(id, value) {
    const voice = this.voices.get(id);
    if (!voice) return;
    voice.volume = clampVolume(value);
    if (voice.player) voice.player.volume = voice.volume * this.fadeGain(voice);
  }
  setPlaying(id, playing) {
    const voice = this.voices.get(id);
    if (!voice) return;
    voice.playing = Boolean(playing);
    if (voice.player) Promise.resolve(playing ? voice.player.play() : voice.player.pause()).catch((error) => this.engine.report("named playback", "", error));
    this.schedule();
  }
  seek(id, time) {
    const voice = this.voices.get(id);
    if (!voice) return;
    voice.position = Math.max(0, Number(time) || 0);
    voice.player?.seek(voice.position);
  }
  getPosition(id) {
    const voice = this.voices.get(id);
    return voice ? [voice.player?.currentTime ?? voice.position, this.getDuration(id)] : [0, null];
  }
  getDuration(id) {
    return this.voices.get(id)?.player?.duration ?? null;
  }
  fadeGain(voice) {
    return voice.fade ? Math.max(0, 1 - (this.engine.mediaNow() - voice.fade.start) / voice.fade.duration) : 1;
  }
  fadeOut(id, durationMs) {
    const voice = this.voices.get(id);
    if (!voice || voice.fade) return;
    if (!(durationMs > 0)) {
      this.destroy(id);
      return;
    }
    this.timed.add(voice);
    voice.fade = { start: this.engine.mediaNow(), duration: durationMs / 1e3 };
    this.schedule();
  }
  setRestartBeforeEnd(id, beforeMs) {
    const voice = this.voices.get(id);
    if (!voice) return;
    this.timed.add(voice);
    voice.restartBeforeEnd = Math.max(0, Number(beforeMs) || 0) / 1e3;
    this.schedule();
  }
  schedule() {
    if (this.timer !== null || !this.timed.size) return;
    this.timer = this.timers.setTimeout(() => {
      this.timer = null;
      for (const voice of this.timed) {
        if (voice.fade) {
          const gain = this.fadeGain(voice);
          if (gain <= 0) {
            this.destroy(voice.id);
            continue;
          }
          if (voice.player) voice.player.volume = voice.volume * gain;
        }
        const player = voice.player;
        if (voice.playing && voice.restartBeforeEnd !== null && player?.duration > 0) {
          const boundary = Math.max(0, player.duration - voice.restartBeforeEnd / Math.max(0.0625, voice.speed));
          if (player.currentTime >= boundary && player.currentTime > 0) player.seek(0);
        }
      }
      this.schedule();
    }, 30);
  }
  destroy(id) {
    const voice = this.voices.get(id);
    if (!voice) return;
    this.voices.delete(id);
    this.timed.delete(voice);
    voice.player?.destroy();
    if (!this.voices.size && this.timer !== null) {
      this.timers.clearTimeout(this.timer);
      this.timer = null;
    }
  }
  cleanupFinished() {
    let count = 0;
    for (const voice of this.voices.values()) {
      if (voice.player?.state === 3) {
        this.destroy(voice.id);
        count++;
      }
    }
    return count;
  }
}
async function initializeGameAudio(host = window) {
  const root = new URL("audio/", host.document.baseURI);
  const response = await host.fetch(new URL("manifest.json", root));
  if (!response.ok) throw new Error(`Audio manifest HTTP ${response.status}`);
  host.__gdAudio ||= new AudioEngine(host);
  host.audioEngine = new GameAudioBridge(host.__gdAudio, await response.json(), root, host);
  host.addEventListener("pagehide", () => {
    for (const id of host.audioEngine.voices.keys()) host.audioEngine.destroy(id);
  }, { once: true });
}
export {
  GameAudioBridge,
  initializeGameAudio
};
