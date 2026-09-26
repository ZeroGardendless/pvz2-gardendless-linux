import {AudioAssets, WorkQueue, deadline} from './AudioAssets.js';
import {AudioPlayer} from './AudioPlayer.js';

export class AudioEngine {
  constructor(host = globalThis) {
    this.host = host;
    this.players = new Set();
    this.waiting = new Set();
    this.assets = new AudioAssets(this);
    this.audioContext = null;
    this.errors = [];
    this.game = null;
    this.mediaResources = new Set();
    this.idleEffectMedia = [];
    this.activeEffects = new Set();
    this.effectPreparation = new WorkQueue(2);
    this.pendingEffects = 0;
    this.droppedEffects = 0;
    this.maxEffectVoices = 4;
    this.maxPendingEffects = 8;
    this.maxIdleEffectMedia = 4;
    this.effectBackoffUntil = 0;
    this.audioRecoveries = 0;
    this.monitoringFrames = false;
    this.closed = false;
    this.unlock = () => {
      try {
        const context = this.context();
        if (context.state === 'suspended') context.resume().catch(error => this.report('resume', '', error));
      } catch (error) { this.report('resume', '', error); }
      for (const player of [...this.waiting]) {
        this.waiting.delete(player);
        player.play().catch(() => {}); // play() records the error with its URL.
      }
    };
    for (const event of ['pointerdown', 'touchend', 'keydown']) host.addEventListener(event, this.unlock, true);
    host.addEventListener('pagehide', () => {
      this.closed = true;
      for (const player of [...this.players]) player.destroy();
      for (const media of [...this.mediaResources]) media.dispose();
      this.idleEffectMedia.length = 0;
      this.activeEffects.clear();
      this.assets.clear();
    });
  }
  context() {
    if (!this.audioContext) {
      const Context = this.host.AudioContext || this.host.webkitAudioContext;
      if (!Context) throw new Error('Web Audio is unavailable');
      this.audioContext = new Context({latencyHint: 'interactive'});
    }
    return this.audioContext;
  }
  now() { return this.audioContext?.currentTime || 0; }
  report(stage, url, error) {
    const record = {stage, url, message: error?.message || String(error), time: Date.now()};
    this.errors.push(record);
    if (this.errors.length > 30) this.errors.shift();
    this.host.console.warn(`[Audio] ${stage}: ${record.message}`, url);
  }
  createMedia(asset) {
    const audio = new this.host.Audio();
    let url = this.host.URL.createObjectURL(asset.blob);
    audio.preload = 'auto';
    try { audio.src = url; } catch (error) {
      this.host.URL.revokeObjectURL(url);
      throw error;
    }
    let disposed = false;
    const media = {audio, setAsset: nextAsset => {
      if (nextAsset === media.asset) return;
      const nextUrl = this.host.URL.createObjectURL(nextAsset.blob);
      try {
        audio.pause();
        audio.src = nextUrl;
        audio.load();
      } catch (error) {
        this.host.URL.revokeObjectURL(nextUrl);
        throw error;
      }
      this.host.URL.revokeObjectURL(url);
      url = nextUrl;
      media.asset = nextAsset;
    }, dispose: () => {
      if (disposed) return;
      disposed = true;
      audio.onended = null;
      audio.onerror = null;
      try {
        audio.pause();
        audio.removeAttribute('src');
        audio.load();
      } finally {
        this.host.URL.revokeObjectURL(url);
        this.mediaResources.delete(media);
      }
    }, asset};
    this.mediaResources.add(media);
    return media;
  }
  acquireEffectMedia(asset) {
    for (let index = this.idleEffectMedia.length - 1; index >= 0; index--) {
      const entry = this.idleEffectMedia[index];
      if (entry.asset !== asset) continue;
      this.idleEffectMedia.splice(index, 1);
      if (!entry.media.audio.error) return entry.media;
      entry.media.dispose();
    }
    while (this.idleEffectMedia.length) {
      const entry = this.idleEffectMedia.pop();
      if (entry.media.audio.error) { entry.media.dispose(); continue; }
      try {
        entry.media.setAsset(asset);
        return entry.media;
      } catch (error) {
        entry.media.dispose();
        this.report('effect pipeline reset', '', error);
      }
    }
    return this.createMedia(asset);
  }
  recycleEffectMedia(media, asset) {
    const audio = media.audio;
    audio.onended = null;
    audio.onerror = null;
    try {
      audio.pause();
      if (audio.error) throw audio.error;
    } catch {
      media.dispose();
      return;
    }
    this.idleEffectMedia.push({asset, media});
    while (this.idleEffectMedia.length > this.maxIdleEffectMedia) {
      this.idleEffectMedia.shift().media.dispose();
    }
  }
  async mediaReady(audio) {
    if (audio.readyState >= 1) return;
    let ready, failed;
    try {
      await deadline(new Promise((resolve, reject) => {
        ready = resolve;
        failed = () => reject(new Error(audio.error?.message || 'Music metadata failed'));
        audio.addEventListener('loadedmetadata', ready, {once: true});
        audio.addEventListener('error', failed, {once: true});
        if (audio.error) failed();
      }), 15000, 'Music metadata');
    } finally {
      audio.removeEventListener('loadedmetadata', ready);
      audio.removeEventListener('error', failed);
    }
  }
  async load(rawUrl, options) {
    const url = new URL(rawUrl, this.host.location.href).href;
    try {
      const asset = await this.assets.get(url, options);
      return new AudioPlayer(this, url, asset);
    } catch (error) {
      this.report('load', url, error);
      throw error;
    }
  }
  async loadNative(rawUrl, options) {
    // Cocos callers needing the native resource get its real media object.
    const url = new URL(rawUrl, this.host.location.href).href;
    try {
      const asset = await this.assets.get(url, options);
      if (asset.buffer) return asset.buffer;
      const media = this.createMedia(asset);
      try { await this.mediaReady(media.audio); } catch (error) {
        media.dispose();
        throw error;
      }
      media.audio.__gdDispose = media.dispose;
      return media.audio;
    } catch (error) {
      this.report('native load', url, error);
      throw error;
    }
  }
  async loadOneShotAudio(url, volume = 1, options) {
    // Web Audio renders PCM on WebKitGTK but may produce no audible device output.
    // Limit media pipeline creation so a sound-heavy level cannot stall WebKit.
    if (this.host.performance?.now?.() < this.effectBackoffUntil) {
      this.droppedEffects++;
      throw new Error('Effects paused to recover frame rate');
    }
    if (this.pendingEffects >= this.maxPendingEffects) {
      this.droppedEffects++;
      throw new Error('Effect preparation queue is full');
    }
    this.pendingEffects++;
    let player;
    try {
      player = await this.load(url, {...options, audioLoadMode: 0});
      player.isEffect = true;
      if (this.activeEffects.size >= this.maxEffectVoices) {
        this.activeEffects.values().next().value.stop();
      }
      await this.effectPreparation.run(() => player.prepareMedia());
      player.volume = volume;
      let stopped = false;
      const shot = {
        onPlay: null, onEnd: null,
        play: (rate = 1) => {
          if (stopped) return;
          if (this.activeEffects.size >= this.maxEffectVoices) {
            this.activeEffects.values().next().value.stop();
          }
          this.activeEffects.add(shot);
          player.playbackRate = rate;
          player.play().catch(() => shot.stop());
        },
        stop: () => {
          if (stopped) return;
          stopped = true;
          this.activeEffects.delete(shot);
          player.destroy();
          shot.onEnd?.();
        },
      };
      player.effectShot = shot;
      player.on('played', () => shot.onPlay?.());
      player.onEnded(() => shot.stop());
      return shot;
    } catch (error) {
      player?.destroy();
      if (player) this.report('effect preparation', player.src, error);
      throw error;
    } finally {
      this.pendingEffects--;
    }
  }
  bindGame(game, pauseEvent, resumeEvent) {
    if (this.game === game) return;
    this.game = game;
    this.monitorFrames();
    game.on(pauseEvent, () => {
      for (const player of this.players) {
        if (!player.desired) continue;
        if (player.isEffect) { player.effectShot?.stop(); continue; }
        player.pause();
        player.state = 4;
        player.emit('interruptionBegin');
      }
    });
    game.on(resumeEvent, () => {
      for (const player of this.players) {
        if (player.state !== 4) continue;
        player.play().then(() => player.emit('interruptionEnd')).catch(() => {});
      }
    });
  }
  monitorFrames() {
    if (this.monitoringFrames || !this.host.requestAnimationFrame) return;
    this.monitoringFrames = true;
    let lastFrame = 0;
    let slowFrames = 0;
    const frame = now => {
      if (this.closed) return;
      if (this.host.document?.visibilityState === 'hidden') {
        slowFrames = 0;
      } else if (lastFrame && now - lastFrame > 250 && this.activeEffects.size > 0) {
        slowFrames++;
      } else {
        slowFrames = 0;
      }
      lastFrame = now;
      if (slowFrames >= 2) {
        for (const effect of [...this.activeEffects]) effect.stop();
        for (const entry of this.idleEffectMedia.splice(0)) entry.media.dispose();
        this.effectBackoffUntil = now + 3000;
        this.audioRecoveries++;
        slowFrames = 0;
        this.host.console.warn('[Audio] Released effect pipelines after sustained frame stalls');
      }
      this.host.requestAnimationFrame(frame);
    };
    this.host.requestAnimationFrame(frame);
  }
  diagnostics() {
    return {context: this.audioContext?.state || 'unused', players: this.players.size,
      playing: [...this.players].filter(player => player.state === 1).length,
      cacheBytes: this.assets.bytes, cacheEntries: this.assets.cache.size,
      pending: this.assets.pending.size, waitingForGesture: this.waiting.size,
      activeEffects: this.activeEffects.size, pendingEffects: this.pendingEffects,
      idleEffectMedia: this.idleEffectMedia.length, mediaPipelines: this.mediaResources.size,
      droppedEffects: this.droppedEffects, audioRecoveries: this.audioRecoveries,
      errors: this.errors.slice()};
  }
}
