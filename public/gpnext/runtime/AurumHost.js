function createHookOrderCache() {
  const records = /* @__PURE__ */ new WeakMap();
  return function ordered(record, revision) {
    const cached = records.get(record);
    if (cached?.revision === revision) return cached.order;
    const order = [...record.hooks].sort((a, b) => b.priority - a.priority || a.order - b.order);
    records.set(record, { revision, order });
    return order;
  };
}
function createAurumHost() {
  const sessions = /* @__PURE__ */ new Map();
  let startupOptions = Object.freeze({ fastSplash: true, startupPrefetch: false, prefetchConcurrency: 2 });
  let startupStatus = Object.freeze({ phase: "not-started" });
  let nextId = 0, enabled = false, cachedOrder = createHookOrderCache();
  function refresh() {
    const next = [...sessions.values()].some((value) => value);
    if (next !== enabled) cachedOrder = createHookOrderCache();
    enabled = next;
  }
  return Object.freeze({
    get active() {
      return enabled;
    },
    get startupOptions() {
      return startupOptions;
    },
    get startupStatus() {
      return startupStatus;
    },
    setStartupOptions(value = {}) {
      startupOptions = Object.freeze({ fastSplash: value.fastSplash !== false, startupPrefetch: value.startupPrefetch === true, prefetchConcurrency: Math.max(1, Math.min(4, Math.round(Number(value.prefetchConcurrency) || 2))) });
    },
    reportStartup(value) {
      startupStatus = Object.freeze({ ...value });
    },
    orderedHooks(record, revision) {
      return enabled ? cachedOrder(record, revision) : [...record.hooks].sort((a, b) => b.priority - a.priority || a.order - b.order);
    },
    createSession() {
      const id = ++nextId;
      sessions.set(id, false);
      return Object.freeze({
        configure(options) {
          if (sessions.has(id)) {
            sessions.set(id, options.enabled === true && options.hookCache === true);
            refresh();
          }
        },
        dispose() {
          sessions.delete(id);
          refresh();
        }
      });
    }
  });
}
var aurumHost = createAurumHost();
if (typeof window !== "undefined") {
  Object.defineProperty(globalThis, "__gardendlessAurumHost", { value: aurumHost, configurable: true });
}
export {
  aurumHost,
  createAurumHost
};
