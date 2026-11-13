import {createHookOrderCache} from './HookOrder.js';
/** Only active Aurum sessions enable caching; disposal cannot disable a newer session. */
export function createAurumHost() {
  const sessions = new Map();
  let startupOptions=Object.freeze({fastSplash:true,startupPrefetch:false,prefetchConcurrency:2});
  let startupStatus=Object.freeze({phase:'not-started'});
  let nextId = 0, enabled = false, cachedOrder = createHookOrderCache();
  function refresh() {
    const next = [...sessions.values()].some(value => value);
    if (next !== enabled) cachedOrder = createHookOrderCache();
    enabled = next;
  }
  return Object.freeze({
    get active() { return enabled; },
    get startupOptions() { return startupOptions; },
    get startupStatus() { return startupStatus; },
    setStartupOptions(value={}) {
      startupOptions=Object.freeze({fastSplash:value.fastSplash!==false,startupPrefetch:value.startupPrefetch===true,prefetchConcurrency:Math.max(1,Math.min(4,Math.round(Number(value.prefetchConcurrency)||2)))});
    },
    reportStartup(value) { startupStatus=Object.freeze({...value}); },
    orderedHooks(record, revision) {
      return enabled ? cachedOrder(record, revision) : [...record.hooks].sort((a,b) => b.priority-a.priority || a.order-b.order);
    },
    createSession() {
      const id = ++nextId;
      sessions.set(id, false);
      return Object.freeze({
        configure(options) { if (sessions.has(id)) { sessions.set(id, options.enabled === true && options.hookCache === true); refresh(); } },
        dispose() { sessions.delete(id); refresh(); }
      });
    }
  });
}
