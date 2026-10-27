import { AudioEngine } from "./AudioEngine.js";
const clamp = (value, low, high) => Math.min(high, Math.max(low, Number(value) || 0));
class NativeAudioEngine extends AudioEngine {
  constructor(host, invoke, listen) {
    super(host, { preferMedia: true });
    this.invoke = invoke;
    this.backend = "native-pulse";
    this.sequence = 0;
    this.pauseFade = false;
    this.updates = /* @__PURE__ */ new Map();
    this.releases = /* @__PURE__ */ new Set();
    this.flushing = false;
    this.flushTimer = null;
    this.nativePlayers = /* @__PURE__ */ new Map();
    this.unlisten = [];
    this.ready = Promise.all([
      listen("native-audio-ended", (event) => {
        for (const id of event.payload) this.nativePlayers.get(id)?.finish();
      }),
      listen("native-audio-error", (event) => this.report("native output", "", new Error(event.payload)))
    ]).then((callbacks) => {
      this.unlisten = callbacks;
    });
    host.addEventListener("pagehide", () => {
      for (const stop of this.unlisten) stop();
    });
  }
  now() {
    return this.mediaNow();
  }
  queue(player, position, remove = false) {
    const previous = this.updates.get(player.id);
    this.updates.set(player.id, {
      id: player.id,
      clip: player.asset.clip,
      playing: player.state === 1 && !player.pausedForFade,
      volume: player.volume,
      rate: player.playbackRate,
      looping: player.loop,
      position: position ?? previous?.position ?? null,
      remove
    });
    if (!this.flushTimer && !this.flushing) this.flushTimer = setTimeout(() => this.flush(), 8);
  }
  async flush() {
    clearTimeout(this.flushTimer);
    this.flushTimer = null;
    if (this.flushing || !this.updates.size && !this.releases.size) return;
    this.flushing = true;
    const updates = [...this.updates.values()], release = [...this.releases];
    this.updates.clear();
    this.releases.clear();
    try {
      await this.invoke("native_audio_update", { updates, release });
    } catch (error) {
      this.report("native commands", "", error);
      for (const update of updates) this.nativePlayers.get(update.id)?.finish();
    } finally {
      this.flushing = false;
      if (this.updates.size || this.releases.size) this.flushTimer = setTimeout(() => this.flush(), 8);
    }
  }
  setPauseFade(paused) {
    if (this.pauseFade === paused) return;
    this.pauseFade = paused;
    for (const player of this.nativePlayers.values()) {
      if (player.isEffect) continue;
      player.offset = player.currentTime;
      player.startedAt = this.now();
      player.pausedForFade = paused;
      this.queue(player, player.offset);
    }
  }
  async prepare(rawUrl) {
    await this.ready;
    const url = new URL(rawUrl, this.host.location.href);
    const path = decodeURIComponent(url.pathname).replace(/^\//, "");
    const local = url.origin === new URL(this.host.location.href).origin || ["localhost", "127.0.0.1"].includes(url.hostname);
    const embedded = local && (path.startsWith("assets/") || path.startsWith("audio/"));
    const key = embedded ? path : url.href;
    const task = (async () => {
      let bytes = null;
      if (!embedded) {
        const response = await this.host.fetch(url.href);
        if (!response.ok) throw new Error(`Audio request returned ${response.status}`);
        bytes = Array.from(new Uint8Array(await response.arrayBuffer()));
      }
      return this.invoke("native_audio_prepare", { path: key, bytes });
    })();
    return task;
  }
  async load(rawUrl) {
    try {
      return new NativeAudioPlayer(this, new URL(rawUrl, this.host.location.href).href, await this.prepare(rawUrl));
    } catch (error) {
      this.report("native decode fallback", rawUrl, error);
      return super.load(rawUrl);
    }
  }
  async loadOneShotAudio(url, volume = 1) {
    const player = await this.load(url);
    player.isEffect = true;
    player.pausedForFade = false;
    player.volume = volume;
    let stopped = false;
    const shot = {
      onPlay: null,
      onEnd: null,
      play: (rate = 1) => {
        if (!stopped) {
          this.activeEffects.add(shot);
          player.playbackRate = rate;
          player.play().catch(() => shot.stop());
        }
      },
      stop: () => {
        if (stopped) return;
        stopped = true;
        this.activeEffects.delete(shot);
        player.destroy();
        shot.onEnd?.();
      }
    };
    player.effectShot = shot;
    player.on("played", () => shot.onPlay?.());
    player.onEnded(() => shot.stop());
    return shot;
  }
  monitorFrames() {
  }
  diagnostics() {
    return { ...super.diagnostics(), backend: this.backend, queuedCommands: this.updates.size };
  }
}
class NativeAudioPlayer {
  constructor(engine, src, asset) {
    this.engine = engine;
    this.src = src;
    this.asset = asset;
    this.id = ++engine.sequence;
    this.duration = asset.duration;
    this.sampleRate = asset.sampleRate;
    this.type = 1;
    this.pausedForFade = engine.pauseFade;
    this.state = 0;
    this.offset = 0;
    this.startedAt = engine.now();
    this._volume = 1;
    this._rate = 1;
    this._loop = false;
    this.desired = false;
    this.destroyed = false;
    this.isEffect = false;
    this.listeners = /* @__PURE__ */ new Map();
    this.token = 0;
    this.pendingPlay = null;
    engine.players.add(this);
    engine.nativePlayers.set(this.id, this);
  }
  get volume() {
    return this._volume;
  }
  set volume(value) {
    const next = clamp(value, 0, 1);
    if (next === this._volume) return;
    this._volume = next;
    this.engine.queue(this);
  }
  get playbackRate() {
    return this._rate;
  }
  set playbackRate(value) {
    const next = clamp(value, 0.0625, 16);
    if (next === this._rate) return;
    this.offset = this.currentTime;
    this.startedAt = this.engine.now();
    this._rate = next;
    this.engine.queue(this);
  }
  get loop() {
    return this._loop;
  }
  set loop(value) {
    this._loop = Boolean(value);
    this.engine.queue(this);
  }
  get currentTime() {
    const time = this.offset + (this.state === 1 && !this.pausedForFade ? (this.engine.now() - this.startedAt) * this._rate : 0);
    return this._loop && this.duration > 0 ? time % this.duration : Math.min(time, this.duration);
  }
  async play() {
    if (this.destroyed) throw new Error("Cannot play destroyed audio");
    if (this.state === 1) return;
    if (this.pendingPlay) return this.pendingPlay;
    this.desired = true;
    const token = ++this.token;
    const task = (async () => {
      const asset = await this.engine.prepare(this.src);
      if (this.destroyed || !this.desired || token !== this.token) {
        this.engine.releases.add(asset.clip);
        if (!this.engine.flushTimer && !this.engine.flushing)
          this.engine.flushTimer = setTimeout(() => this.engine.flush(), 8);
        return;
      }
      this.engine.releases.add(this.asset.clip);
      this.asset = asset;
      this.state = 1;
      this.startedAt = this.engine.now();
      this.engine.queue(this, this.offset);
      this.emit("played");
    })().finally(() => {
      if (this.pendingPlay === task) this.pendingPlay = null;
    });
    this.pendingPlay = task;
    return task;
  }
  async pause() {
    this.offset = this.currentTime;
    this.desired = false;
    this.token++;
    this.pendingPlay = null;
    this.state = 2;
    this.engine.queue(this);
  }
  async stop() {
    this.offset = 0;
    this.desired = false;
    this.token++;
    this.pendingPlay = null;
    this.state = 3;
    this.engine.queue(this, 0, true);
  }
  async seek(time) {
    this.offset = clamp(time, 0, this.duration);
    this.startedAt = this.engine.now();
    this.engine.queue(this, this.offset);
  }
  finish() {
    if (this.destroyed || this.state !== 1) return;
    this.state = 3;
    this.offset = 0;
    this.desired = false;
    this.engine.queue(this, 0, true);
    this.emit("ended");
  }
  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, /* @__PURE__ */ new Set());
    this.listeners.get(event).add(callback);
  }
  off(event, callback) {
    if (callback) this.listeners.get(event)?.delete(callback);
    else this.listeners.get(event)?.clear();
  }
  getPCMData() {
    return void 0;
  }
  onInterruptionBegin(callback) {
    this.on("interruptionBegin", callback);
  }
  offInterruptionBegin(callback) {
    this.off("interruptionBegin", callback);
  }
  onInterruptionEnd(callback) {
    this.on("interruptionEnd", callback);
  }
  offInterruptionEnd(callback) {
    this.off("interruptionEnd", callback);
  }
  onEnded(callback) {
    this.on("ended", callback);
  }
  offEnded(callback) {
    this.off("ended", callback);
  }
  emit(event) {
    for (const callback of [...this.listeners.get(event) || []]) {
      try {
        callback();
      } catch (error) {
        this.engine.report("native listener", this.src, error);
      }
    }
  }
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.desired = false;
    this.token++;
    this.pendingPlay = null;
    this.state = 3;
    this.engine.queue(this, null, true);
    this.engine.releases.add(this.asset.clip);
    this.engine.players.delete(this);
    this.engine.nativePlayers.delete(this.id);
    this.listeners.clear();
  }
}
export {
  NativeAudioEngine,
  NativeAudioPlayer
};
