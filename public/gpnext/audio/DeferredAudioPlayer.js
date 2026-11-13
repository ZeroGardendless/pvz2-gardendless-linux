class DeferredAudioPlayer {
  constructor(engine, src, metadata, createPlayer) {
    this.engine = engine;
    this.src = src;
    this.duration = metadata.duration;
    this.sampleRate = metadata.sampleRate;
    this._type = 1;
    this.player = null;
    this.loading = null;
    this.pendingPlay = null;
    this.createPlayer = createPlayer;
    this.listeners = /* @__PURE__ */ new Map();
    this.destroyed = false;
    this.desired = false;
    this.token = 0;
    this.offset = 0;
    this._state = 0;
    this._volume = 1;
    this._rate = 1;
    this._loop = false;
  }
  get type() {
    return this.player?.type ?? this._type;
  }
  get state() {
    return this.player?.state ?? this._state;
  }
  get volume() {
    return this.player?.volume ?? this._volume;
  }
  set volume(value) {
    this._volume = value;
    if (this.player) this.player.volume = value;
  }
  get playbackRate() {
    return this.player?.playbackRate ?? this._rate;
  }
  set playbackRate(value) {
    this._rate = value;
    if (this.player) this.player.playbackRate = value;
  }
  get loop() {
    return this.player?.loop ?? this._loop;
  }
  set loop(value) {
    this._loop = Boolean(value);
    if (this.player) this.player.loop = this._loop;
  }
  get currentTime() {
    return this.player?.currentTime ?? this.offset;
  }
  async materialize() {
    if (this.player) return this.player;
    if (!this.loading) this.loading = Promise.resolve().then(this.createPlayer).then((player) => {
      if (this.destroyed || this.engine.closed) {
        player.destroy();
        return null;
      }
      this.player = player;
      player.volume = this._volume;
      player.playbackRate = this._rate;
      player.loop = this._loop;
      player.isEffect = this.isEffect;
      if (this.isEffect) player.pausedForFade = false;
      this.duration = player.duration;
      this.sampleRate = player.sampleRate;
      player.onEnded(() => {
        this.offset = 0;
        this.desired = false;
        this._state = 3;
      });
      for (const [event, callbacks] of this.listeners) for (const callback of callbacks) player.on(event, callback);
      return player;
    }).finally(() => {
      this.loading = null;
    });
    return this.loading;
  }
  async play() {
    if (this.destroyed) throw new Error("Cannot play destroyed audio");
    if (this.state === 1) return;
    if (this.pendingPlay) return this.pendingPlay;
    this.desired = true;
    const token = ++this.token;
    const task = (async () => {
      const player = await this.materialize();
      if (!player || !this.desired || this.destroyed || token !== this.token) return;
      await player.seek(this.offset);
      if (!this.desired || this.destroyed || token !== this.token) return;
      await player.play();
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
    this._state = 2;
    await this.player?.pause();
  }
  async stop() {
    this.offset = 0;
    this.desired = false;
    this.token++;
    this.pendingPlay = null;
    this._state = 3;
    await this.player?.stop();
  }
  async seek(value) {
    this.offset = Math.max(0, Math.min(this.duration, Number(value) || 0));
    await this.player?.seek(this.offset);
  }
  on(event, callback) {
    if (!this.listeners.has(event)) this.listeners.set(event, /* @__PURE__ */ new Set());
    if (this.listeners.get(event).has(callback)) return;
    this.listeners.get(event).add(callback);
    this.player?.on(event, callback);
  }
  off(event, callback) {
    if (callback) this.listeners.get(event)?.delete(callback);
    else this.listeners.get(event)?.clear();
    this.player?.off(event, callback);
  }
  getPCMData() {
    return this.player?.getPCMData();
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
  destroy() {
    if (this.destroyed) return;
    this.destroyed = true;
    this.desired = false;
    this.token++;
    this.pendingPlay = null;
    this._state = 3;
    this.player?.destroy();
    this.listeners.clear();
  }
}
export {
  DeferredAudioPlayer
};
