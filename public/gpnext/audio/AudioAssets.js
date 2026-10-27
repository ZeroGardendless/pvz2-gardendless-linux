const MPEG1_BITRATES = [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320];
const MPEG2_BITRATES = [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160];
const MPEG_SAMPLE_RATES = [44100, 48e3, 32e3];
function mp3Duration(bytes) {
  const data = new Uint8Array(bytes);
  let position = 0;
  if (data[0] === 73 && data[1] === 68 && data[2] === 51 && data.length >= 10) {
    position = 10 + ((data[6] & 127) * 2097152 + (data[7] & 127) * 16384 + (data[8] & 127) * 128 + (data[9] & 127));
  }
  let seconds = 0, frames = 0;
  const searchEnd = Math.min(data.length, position + 65536);
  while (position + 4 <= data.length) {
    const a = data[position], b = data[position + 1], c = data[position + 2];
    const version = b >> 3 & 3, layer = b >> 1 & 3;
    const rateIndex = c >> 4, sampleIndex = c >> 2 & 3;
    if (a !== 255 || (b & 224) !== 224 || version === 1 || layer !== 1 || rateIndex === 0 || rateIndex === 15 || sampleIndex === 3) {
      if (frames || position >= searchEnd) break;
      position++;
      continue;
    }
    const rates = version === 3 ? MPEG1_BITRATES : MPEG2_BITRATES;
    const sampleRate = MPEG_SAMPLE_RATES[sampleIndex] / (version === 3 ? 1 : version === 2 ? 2 : 4);
    const size = Math.floor((version === 3 ? 144e3 : 72e3) * rates[rateIndex] / sampleRate) + (c >> 1 & 1);
    if (position + size > data.length) break;
    seconds += (version === 3 ? 1152 : 576) / sampleRate;
    frames++;
    position += size;
  }
  return frames >= 2 ? seconds : null;
}
function deadline(promise, milliseconds, label) {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out`)), milliseconds);
  })]).finally(() => clearTimeout(timer));
}
class WorkQueue {
  constructor(limit) {
    this.limit = limit;
    this.running = 0;
    this.jobs = [];
  }
  run(work) {
    return new Promise((resolve, reject) => {
      this.jobs.push({ work, resolve, reject });
      this.pump();
    });
  }
  pump() {
    while (this.running < this.limit && this.jobs.length) {
      const job = this.jobs.shift();
      this.running++;
      Promise.resolve().then(job.work).then(job.resolve, job.reject).finally(() => {
        this.running--;
        this.pump();
      });
    }
  }
}
class AudioAssets {
  constructor(engine, budget = 128 * 1024 * 1024) {
    this.engine = engine;
    this.budget = budget;
    this.bytes = 0;
    this.cache = /* @__PURE__ */ new Map();
    this.pending = /* @__PURE__ */ new Map();
    this.fetches = new WorkQueue(4);
    this.decodes = new WorkQueue(2);
  }
  cacheKey(url, options) {
    const mode = this.engine.preferMedia ? 0 : options?.audioLoadMode;
    return `${url}\0${mode === 0 || mode === 1 ? mode : "auto"}`;
  }
  async get(url, options) {
    const key = this.cacheKey(url, options);
    const cached = this.cache.get(key);
    if (cached) {
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached;
    }
    if (this.pending.has(key)) return this.pending.get(key);
    const task = this.load(url, options).then((asset) => {
      if (asset.bytes <= this.budget) {
        this.cache.set(key, asset);
        this.bytes += asset.bytes;
        while (this.bytes > this.budget) {
          const oldest = this.cache.keys().next().value;
          this.bytes -= this.cache.get(oldest).bytes;
          this.cache.delete(oldest);
        }
      }
      return asset;
    }).finally(() => this.pending.delete(key));
    this.pending.set(key, task);
    return task;
  }
  async load(url, options) {
    const bytes = await this.fetches.run(async () => {
      const controller = new AbortController();
      try {
        return await deadline((async () => {
          const response = await this.engine.host.fetch(url, { signal: controller.signal });
          if (!response.ok) throw new Error(`Audio request returned ${response.status}: ${url}`);
          return response.arrayBuffer();
        })(), 15e3, "Audio fetch");
      } finally {
        controller.abort();
      }
    });
    const estimated = mp3Duration(bytes);
    const mode = this.engine.preferMedia ? 0 : options?.audioLoadMode;
    const stream = mode === 0 ? true : mode === 1 ? false : estimated !== null ? estimated > 12 : bytes.byteLength > 256 * 1024;
    if (!stream) {
      try {
        const buffer = await this.decodes.run(() => deadline(
          this.engine.context().decodeAudioData(bytes.slice(0)),
          1e4,
          "Sound effect decode"
        ));
        return {
          kind: "buffer",
          buffer,
          duration: buffer.duration,
          bytes: buffer.length * buffer.numberOfChannels * 4
        };
      } catch (error) {
        this.engine.report("decode fallback", url, error);
      }
    }
    const extension = new URL(url).pathname.split(".").pop().toLowerCase();
    const mime = { mp3: "audio/mpeg", ogg: "audio/ogg", wav: "audio/wav", m4a: "audio/mp4" }[extension] || "audio/mpeg";
    const blob = new this.engine.host.Blob([bytes], { type: mime });
    const asset = { kind: "stream", blob, duration: estimated, bytes: bytes.byteLength };
    if (asset.duration === null) {
      const media = this.engine.createMedia(asset);
      try {
        await this.engine.mediaReady(media.audio);
        asset.duration = media.audio.duration;
      } finally {
        media.dispose();
      }
    }
    return asset;
  }
  clear() {
    this.cache.clear();
    this.bytes = 0;
  }
}
export {
  AudioAssets,
  WorkQueue,
  deadline,
  mp3Duration
};
