/** Speculative fetching only. The game's original load/initialization order stays intact. */
export function createPreloadQueue(load, {concurrency = 2} = {}) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) throw new RangeError('Concurrency must be 1–4.');
  const queued = [], entries = new Map();
  let active = 0, cancelled = false;
  function pump() {
    while (!cancelled && active < concurrency && queued.length) {
      const job = queued.shift();
      active++;
      Promise.resolve().then(() => load(job.path)).then(
        () => job.resolve({path: job.path, status: 'ready'}),
        error => job.resolve({path: job.path, status: 'failed', message: String(error?.message || error)})
      ).finally(() => { active--; pump(); });
    }
  }
  return {
    add(path) {
      if (cancelled) return Promise.resolve({path, status: 'cancelled'});
      if (!entries.has(path)) {
        const result = new Promise(resolve => queued.push({path, resolve}));
        entries.set(path, result);
        pump();
      }
      return entries.get(path);
    },
    cancel() {
      cancelled = true;
      for (const job of queued.splice(0)) job.resolve({path: job.path, status: 'cancelled'});
      // In-flight engine requests are not falsely reported as aborted.
    },
    get pending() { return queued.length; },
    get active() { return active; }
  };
}
