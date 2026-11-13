// Cache only immutable RTID string parsing. Object arrays, current-level data,
// filters and returned arrays remain live; mods can edit them between calls.
export function createRtidParser(limit = 256) {
  const cache = new Map();
  return Object.freeze({
    parse(reference) {
      if (cache.has(reference)) return cache.get(reference);
      const parts = reference.includes('RTID') ? reference.replace('RTID(', '').replace(')', '').split('@') : [];
      const parsed = parts.length === 2 ? Object.freeze({alias: parts[0], namespace: parts[1] === '.' ? 'CurrentLevel' : parts[1]}) : null;
      if (cache.size >= limit) cache.delete(cache.keys().next().value);
      cache.set(reference, parsed);
      return parsed;
    },
    clear() {cache.clear();},
    get size() {return cache.size;},
  });
}

export async function installDataLookup(ObjectType, containers, hooks, log) {
  const original = ObjectType?.getObjectsByRTID;
  if (typeof original !== 'function' || !containers) return () => {};
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(original.toString()));
  const hash = Array.from(new Uint8Array(bytes), value => value.toString(16).padStart(2, '0')).join('');
  if (hash !== EXPECTED_LOOKUP) {
    log.warn('RTID parsing cache skipped: bundled lookup changed or another mod owns it.');
    return () => {};
  }
  const parser = createRtidParser();
  const remove = hooks.wrapMethod({target: ObjectType, methodName: 'getObjectsByRTID', handler(call) {
    const [reference, classFilter = null, currentLevel = null] = call.args;
    if (typeof reference !== 'string') return call.callNext();
    const parsed = parser.parse(reference);
    if (!parsed) return [];
    if (parsed.namespace === 'CurrentLevel' && currentLevel?.length) {
      return call.thisArg.getObjects(parsed.alias, currentLevel, classFilter);
    }
    const candidates = containers[parsed.namespace];
    return candidates?.length > 0 ? call.thisArg.getObjects(parsed.alias, candidates, classFilter) : [];
  }});
  log.info('RTID parsing cache active: at most 256 strings; level data and modded objects remain uncached.');
  return () => {remove();parser.clear();};
}
const EXPECTED_LOOKUP = '127583875cd3e05257ce1ad3309db785da235a5bdb3945c3e895b73a31739776';
