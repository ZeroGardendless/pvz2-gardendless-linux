import { deadline } from "./AudioAssets.js";
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, Number(value) || 0));
class AudioPlayer {
  constructor(engine, url, asset) {
    this.engine = engine;
    this.src = url;
    this.asset = asset;
    this.duration = asset.duration;
    this.type = asset.kind === "buffer" ? 1 : 0;
    this.sampleRate = asset.buffer?.sampleRate || 0;
    this.state = 0;
    this.offset = 0;
    this.startedAt = 0;
    this.token = 0;
    this.desired = false;
    this.destroyed = false;
    this.listeners = /* @__PURE__ */ new Map();
    this._volume = 1;
    this._rate = 1;
    this._loop = false;
    this.media = null;
    this.source = null;
    this.gain = null;
    this.pendingPlay = null;
    this.isEffect = false;
    this.effectShot = null;
    this.mediaClockRunning = false;
    this.mediaClockAt = 0;
    this.mediaListeners = null;
    engine.players.add(this);
  }
  get volume() {
    return this._volume;
  }
  set volume(value) {
    const volume = clamp(value, 0, 1);
    if (volume === this._volume) return;
    this._volume = volume;
    if (this.gain) this.gain.gain.value = this._volume;
    if (this.media) {
      this.media.audio.volume = this._volume;
      this.media.audio.muted = this._volume === 0;
    }
  }
  get playbackRate() {
    return this._rate;
  }
  set playbackRate(value) {
    const rate = clamp(value, 0.0625, 16);
    if (rate === this._rate) return;
    this.offset = this.currentTime;
    this.startedAt = this.engine.now();
    this.mediaClockAt = this.engine.mediaNow();
    this._rate = rate;
    if (this.source) this.source.playbackRate.value = this._rate;
    if (this.media) this.media.audio.playbackRate = this._rate;
  }
  get loop() {
    return this._loop;
  }
  set loop(value) {
    this._loop = Boolean(value);
    if (this.source) this.source.loop = this._loop;
    if (this.media) this.media.audio.loop = this._loop;
  }
  get currentTime() {
    if (this.media) {
      const time2 = this.offset + (this.mediaClockRunning ? Math.max(0, this.engine.mediaNow() - this.mediaClockAt) * this._rate : 0);
      return this._loop && this.duration > 0 ? time2 % this.duration : this.duration > 0 ? Math.min(time2, this.duration) : time2;
    }
    const time = this.offset + (this.state === 1 ? (this.engine.now() - this.startedAt) * this._rate : 0);
    return this._loop && this.duration > 0 ? time % this.duration : Math.min(time, this.duration);
  }
  async play() {
    if (this.destroyed) throw new Error("Cannot play destroyed audio");
    if (this.state === 1) return;
    if (this.pendingPlay) return this.pendingPlay;
    this.desired = true;
    const token = ++this.token;
    const task = this.start(token).catch((error) => {
      if (!this.valid(token)) return;
      this.release(false);
      if (!this.isEffect && (error.name === "NotAllowedError" || error.message.includes("Audio context"))) {
        this.engine.waiting.add(this);
        this.engine.report("waiting for user gesture", this.src, error);
        return;
      }
      this.desired = false;
      this.state = 2;
      this.engine.report("playback", this.src, error);
      throw error;
    }).finally(() => {
      if (this.pendingPlay === task) this.pendingPlay = null;
    });
    this.pendingPlay = task;
    return task;
  }
  valid(token) {
    return token === this.token && this.desired && !this.destroyed;
  }
  async prepareMedia() {
    if (this.asset.kind !== "stream") return;
    if (!this.media) this.media = this.isEffect ? this.engine.acquireEffectMedia(this.asset) : this.engine.createMedia(this.asset);
    try {
      await this.engine.mediaReady(this.media.audio);
      this.duration = this.media.audio.duration || this.asset.duration;
    } catch (error) {
      this.release(false);
      throw error;
    }
  }
  trackMedia(audio) {
    const sync = (running) => {
      this.offset = Math.max(0, Number(audio.currentTime) || 0);
      this.mediaClockAt = this.engine.mediaNow();
      this.mediaClockRunning = running;
    };
    const listeners = {
      timeupdate: () => sync(this.mediaClockRunning && !audio.paused),
      playing: () => sync(true),
      waiting: () => sync(false),
      pause: () => sync(false)
    };
    this.mediaListeners = { audio, listeners };
    for (const [event, listener] of Object.entries(listeners)) audio.addEventListener(event, listener);
  }
  async start(token) {
    const asset = this.asset;
    if (!this.valid(token)) return;
    this.duration = asset.duration;
    this.type = asset.kind === "buffer" ? 1 : 0;
    this.sampleRate = asset.buffer?.sampleRate || 0;
    if (asset.kind === "buffer") {
      const context = this.engine.context();
      await deadline(context.resume(), 1500, "Audio context resume");
      if (!this.valid(token)) return;
      if (context.state !== "running") throw new Error(`Audio context is ${context.state}`);
      const source = context.createBufferSource();
      const gain = context.createGain();
      this.source = source;
      this.gain = gain;
      source.buffer = asset.buffer;
      source.loop = this._loop;
      source.playbackRate.value = this._rate;
      gain.gain.value = this._volume;
      source.connect(gain);
      gain.connect(context.destination);
      source.onended = () => this.finish(token);
      source.start(0, Math.min(this.offset, Math.max(0, this.duration - 1e-3)));
    } else {
      await this.prepareMedia();
      if (!this.valid(token)) return;
      const audio = this.media.audio;
      if (!this.mediaListeners) this.trackMedia(audio);
      audio.volume = this._volume;
      audio.muted = this._volume === 0;
      audio.loop = this._loop;
      audio.playbackRate = this._rate;
      audio.preservesPitch = false;
      audio.currentTime = Math.min(this.offset, Math.max(0, this.duration - 1e-3));
      this.mediaClockAt = this.engine.mediaNow();
      this.mediaClockRunning = false;
      audio.onended = () => this.finish(token);
      audio.onerror = () => {
        if (!this.valid(token)) return;
        this.engine.report("media playback", this.src, new Error(audio.error?.message || "Media pipeline failed"));
        this.release(false);
        if (this.isEffect) this.effectShot?.stop();
        else this.stop();
      };
      await deadline(audio.play(), 15e3, "Music playback");
      if (!this.valid(token)) return;
      this.mediaClockAt = this.engine.mediaNow();
      this.mediaClockRunning = !audio.paused;
    }
    this.startedAt = this.engine.now();
    this.state = 1;
    this.engine.waiting.delete(this);
    this.emit("played");
  }
  release(reuseEffectMedia = true) {
    if (this.mediaListeners) {
      const { audio, listeners } = this.mediaListeners;
      for (const [event, listener] of Object.entries(listeners)) audio.removeEventListener(event, listener);
      this.mediaListeners = null;
    }
    this.mediaClockRunning = false;
    if (this.source) {
      this.source.onended = null;
      try {
        this.source.stop();
      } catch {
      }
      this.source.disconnect();
      this.source = null;
    }
    if (this.gain) {
      this.gain.disconnect();
      this.gain = null;
    }
    if (this.media) {
      if (this.isEffect && reuseEffectMedia) this.engine.recycleEffectMedia(this.media, this.asset);
      else this.media.dispose();
      this.media = null;
    }
  }
  cancel() {
    this.token++;
    this.desired = false;
    this.pendingPlay = null;
    this.engine.waiting.delete(this);
  }
  async pause() {
    this.offset = this.currentTime;
    this.mediaClockRunning = false;
    this.cancel();
    if (this.media && !this.isEffect) {
      this.media.audio.onended = null;
      this.media.audio.onerror = null;
      this.media.audio.pause();
    } else {
      this.release();
    }
    this.state = 2;
  }
  async stop() {
    this.cancel();
    this.release();
    this.offset = 0;
    this.state = 3;
  }
  async seek(time) {
    const maximum = this.duration > 0 ? Math.max(0, this.duration - 1e-3) : 0;
    const position = clamp(time, 0, maximum);
    this.offset = position;
    this.mediaClockAt = this.engine.mediaNow();
    if (this.media) {
      if (this.media.audio.readyState >= 1) this.media.audio.currentTime = position;
      return;
    }
    if (!this.source) return;
    const resume = this.desired;
    this.cancel();
    this.release();
    this.state = 2;
    if (resume) await this.play();
  }
  finish(token) {
    if (!this.valid(token)) return;
    this.cancel();
    this.release();
    this.offset = 0;
    this.state = 0;
    this.emit("ended");
  }
  destroy() {
    if (this.destroyed) return;
    this.stop();
    this.destroyed = true;
    this.listeners.clear();
    this.engine.players.delete(this);
  }
  getPCMData(channel) {
    const data = this.asset.buffer?.getChannelData(channel);
    return data ? { length: data.length, getData: (index) => data[index] } : void 0;
  }
  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, /* @__PURE__ */ new Set());
    this.listeners.get(event).add(callback);
  }
  off(event, callback) {
    if (callback) this.listeners.get(event)?.delete(callback);
    else this.listeners.get(event)?.clear();
  }
  emit(event) {
    for (const callback of [...this.listeners.get(event) || []]) {
      try {
        callback();
      } catch (error) {
        this.engine.report("audio listener", this.src, error);
      }
    }
  }
  onEnded(callback) {
    this.on("ended", callback);
  }
  offEnded(callback) {
    this.off("ended", callback);
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
}
export {
  AudioPlayer
};
