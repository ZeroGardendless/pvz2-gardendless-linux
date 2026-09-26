import { t as e } from "../core/Logger.js";
import { a as t, c as n, f as r, h as i, i as a, l as o, p as s, r as c, s as l, u } from "../runtime/Engine.js";
import { A as d, I as f, L as p, N as m, k as h } from "./FileLoader.js";
import { n as g, t as _ } from "../data/EntityInspector.js";
var v = 1e-9;
function y(e2) {
  return typeof e2 == `number` && Number.isFinite(e2) ? e2 : null;
}
function b(e2, t2, { absentAsZero: n2 = false } = {}) {
  let r2 = y(e2?.current), i2 = y(t2?.current);
  return n2 && (r2 !== null || i2 !== null) && (r2 ??= 0, i2 ??= 0), r2 === null || i2 === null ? null : i2 - r2;
}
function x(e2) {
  return e2 !== null && Math.abs(e2) > v;
}
function ee(e2, t2) {
  let n2 = e2?.health || null, r2 = t2?.health || null, i2 = b(n2, r2), a2 = b(n2?.secondary, r2?.secondary, { absentAsZero: true }), o2 = y(n2?.totalCurrent), s2 = y(r2?.totalCurrent), c2 = [i2, a2].filter((e3) => e3 !== null).reduce((e3, t3) => e3 + t3, 0), l2 = o2 !== null && s2 !== null ? s2 - o2 : i2 !== null || a2 !== null ? c2 : null, u2 = [];
  x(i2) && u2.push(`core`), x(a2) && u2.push(`secondary`);
  let d2 = `unchanged`;
  return x(l2) ? d2 = l2 < 0 ? `damage` : `healing` : u2.length > 0 && (d2 = `redistribution`), Object.freeze({ change: d2, amount: l2 === null ? null : Math.abs(l2), totalDelta: l2, coreDelta: i2, secondaryDelta: a2, affectedLayers: Object.freeze(u2), depleted: t2?.alive === false || s2 !== null && s2 <= 0 });
}
var S = Object.freeze([`active-in-hierarchy-changed`, `parent-changed`]), C = /* @__PURE__ */ new WeakMap();
function te(e2) {
  return typeof e2 == `object` && !!e2 || typeof e2 == `function`;
}
function ne(e2) {
  let t2 = e2?.node;
  return t2 ? t2.isValid !== false && t2.active !== false : true;
}
function re(e2) {
  let t2 = e2?.node;
  return t2 ? !(!ne(e2) || `parent` in t2 && t2.parent == null) : true;
}
function ie(e2, t2 = {}) {
  let n2 = /* @__PURE__ */ new Set(), r2 = new AbortController(), i2 = { signal: r2.signal, terminalEvent: null, disposed: false, retired: false, retirementReason: null, disposalReason: null, disposalComplete: false, readyForReplacement: false, observedActive: re(e2), lastKnownCollected: typeof e2?.collected == `boolean` ? e2.collected : null, spawnClaimed: t2.spawnClaimed === true, onTerminal(e3) {
    if (typeof e3 != `function`) return () => false;
    if (i2.disposed || i2.retired) {
      try {
        e3(i2);
      } catch {
      }
      return () => false;
    }
    return n2.add(e3), () => n2.delete(e3);
  }, retire(e3 = `natural-inactive`) {
    return i2.disposed || i2.retired ? false : (i2.retired = true, i2.readyForReplacement = true, i2.retirementReason = String(e3 || `natural-inactive`), s2(), o2(), true);
  }, markDisposed(e3 = `dispose`) {
    return i2.disposed || i2.retired ? false : (i2.disposed = true, i2.disposalReason = String(e3 || `dispose`), s2(), true);
  }, completeDisposal(t3 = true) {
    return i2.disposed ? (i2.disposalComplete = true, (t3 || !re(e2)) && (i2.readyForReplacement = true, o2()), true) : false;
  } }, a2 = false, o2 = () => false, s2 = () => {
    i2.terminalEvent || (i2.terminalEvent = Object.freeze({ type: i2.disposed ? `disposed` : `retired`, reason: String(i2.disposed ? i2.disposalReason || `dispose` : i2.retirementReason || `retired`) }), r2.abort(i2.terminalEvent));
    let e3 = [...n2];
    n2.clear();
    for (let t3 of e3) try {
      t3(i2);
    } catch {
    }
  }, c2 = e2?.node;
  if (c2 && typeof c2.on == `function` && typeof c2.off == `function`) {
    let t3 = () => {
      if (re(e2)) {
        !i2.disposed && !i2.retired && (i2.observedActive = true);
        return;
      }
      if (i2.disposed) {
        i2.readyForReplacement = true, o2();
        return;
      }
      i2.observedActive && i2.retire(`node-inactive`);
    };
    o2 = () => {
      if (!a2) return false;
      a2 = false;
      for (let e3 of S) try {
        c2.off(e3, t3);
      } catch {
      }
      return true;
    };
    try {
      a2 = true;
      for (let e3 of S) c2.on(e3, t3);
    } catch {
      o2();
    }
  }
  return i2;
}
function ae(e2) {
  return e2?.disposed === true || e2?.retired === true;
}
function oe(e2) {
  if (!te(e2)) return null;
  let t2 = C.get(e2) || null;
  if (t2 && !ae(t2) || t2 && (!t2.readyForReplacement || !re(e2))) return t2;
  let n2 = ie(e2);
  return n2.observedActive || n2.retire(`initial-inactive`), C.set(e2, n2), n2;
}
function se(e2) {
  if (!te(e2)) return null;
  let t2 = C.get(e2) || null;
  if (t2 && !ae(t2) && t2.spawnClaimed !== true) return t2.spawnClaimed = true, t2;
  t2 && !ae(t2) && t2.retire(`pooled-reuse`);
  let n2 = ie(e2, { spawnClaimed: true });
  return C.set(e2, n2), n2;
}
var ce = Object.freeze([`plant`, `zombie`, `projectile`, `resource`, `tomb`, `tile-liquid`]), le = Object.freeze({ plants: `plant`, zombies: `zombie`, projectiles: `projectile`, resources: `resource`, tombs: `tomb`, tombstone: `tomb`, tombstones: `tomb`, tileliquid: `tile-liquid`, tileliquids: `tile-liquid`, "tile-liquids": `tile-liquid` }), ue = Object.freeze({ plants: `plant`, zombies: `zombie` });
function w(e2) {
  let t2 = String(e2 || ``).trim().toLowerCase();
  return le[t2] || t2;
}
function de(e2, t2) {
  let n2 = null;
  try {
    n2 = typeof e2.getCapability == `function` ? e2.getCapability(t2) : { available: true };
  } catch (e3) {
    n2 = { available: false, reason: `capability-check-failed`, message: String(e3?.message || e3) };
  }
  return n2 === true && (n2 = { available: true }), (n2 === false || n2 == null) && (n2 = { available: false, reason: `adapter-unavailable` }), Object.freeze({ kind: e2.kind, adapter: e2.id, native: e2.native === true, available: n2.available === true, reason: n2.available === true ? null : String(n2.reason || `adapter-unavailable`), placements: Object.freeze([...n2.placements || e2.placements || [`cell`]]), motionKinds: Object.freeze([...n2.motionKinds || e2.motionKinds || []]), targetSides: Object.freeze([...n2.targetSides || e2.targetSides || []]), types: Object.freeze([...n2.types || e2.types || []]), message: n2.message ? String(n2.message) : null });
}
var fe = class {
  constructor(e2 = {}) {
    this._knownKinds = new Set([...e2.knownKinds || ce].map(w).filter(Boolean)), this._adapters = /* @__PURE__ */ new Map();
  }
  register(e2) {
    let t2 = w(e2?.kind), n2 = String(e2?.id || ``).trim();
    if (!t2 || !n2 || typeof e2?.spawn != `function`) throw Error(`Spawn adapters require id, kind, and spawn()`);
    if (this._adapters.has(n2)) throw Error(`Spawn adapter '${n2}' is already registered`);
    let r2 = Object.freeze({ ...e2, id: n2, kind: t2, priority: Number.isFinite(Number(e2.priority)) ? Number(e2.priority) : 0, placements: Object.freeze([...e2.placements || [`cell`]]) });
    return this._knownKinds.add(t2), this._adapters.set(n2, r2), () => this._adapters.delete(n2);
  }
  list(e2 = null) {
    let t2 = e2 == null ? null : w(e2);
    return [...this._adapters.values()].filter((e3) => t2 == null || e3.kind === t2).sort((e3, t3) => t3.priority - e3.priority || e3.id.localeCompare(t3.id));
  }
  resolve(e2, t2 = {}) {
    for (let n2 of this.list(e2)) {
      let e3 = de(n2, t2);
      if (e3.available) return { adapter: n2, capability: e3 };
    }
    return null;
  }
  getCapabilities(e2 = {}) {
    let t2 = {};
    for (let n2 of [...this._knownKinds].sort()) {
      let r2 = this.list(n2).map((t3) => de(t3, e2));
      t2[n2] = r2.find((e3) => e3.available) || r2[0] || Object.freeze({ kind: n2, adapter: null, native: false, available: false, reason: `adapter-unavailable`, placements: Object.freeze([]), motionKinds: Object.freeze([]), targetSides: Object.freeze([]), types: Object.freeze([]), message: null });
    }
    return Object.freeze(t2);
  }
  supports(e2, t2 = {}) {
    return this.resolve(e2, t2) != null;
  }
};
function T(e2, t2, n2 = {}) {
  let r2 = { ok: false, kind: w(e2?.kind), type: String(e2?.type || ``), adapter: n2.adapter || null, native: n2.native === true, entities: Object.freeze([]), reason: String(t2 || `spawn-failed`), message: n2.message ? String(n2.message) : null, get disposed() {
    return true;
  }, async dispose() {
    return Object.freeze({ ok: true, disposed: false, results: Object.freeze([]) });
  } };
  return Object.freeze(r2);
}
function pe(e2) {
  if (!e2 || typeof e2 != `object` || Array.isArray(e2)) return { ok: false, reason: `invalid-descriptor`, descriptor: {} };
  let t2 = w(e2.kind), n2 = String(e2.type || ``).trim(), r2 = t2 === `resource` ? n2.toLowerCase() : n2, i2 = Number(e2.at?.laneIndex), a2 = Number(e2.at?.columnIndex);
  if (!t2 || !r2) return { ok: false, reason: `invalid-descriptor`, descriptor: { kind: t2, type: r2 } };
  if (!Number.isInteger(i2) || !Number.isInteger(a2)) return { ok: false, reason: `invalid-location`, descriptor: { kind: t2, type: r2 } };
  let o2 = { kind: t2, type: r2, at: Object.freeze({ laneIndex: i2, columnIndex: a2 }), required: e2.required === true };
  if (t2 === `projectile`) {
    let t3 = String(e2.targetSide || ``).trim().toLowerCase(), n3 = ue[t3] || t3;
    if (n3 !== `plant` && n3 !== `zombie`) return { ok: false, reason: `invalid-target-side`, descriptor: o2 };
    let r3 = String(e2.motion?.kind || ``).trim().toLowerCase(), i3 = Number(e2.motion?.velocity?.columnsPerSecond), a3 = Number(e2.motion?.velocity?.lanesPerSecond), s2 = e2.motion?.heightInCells == null ? 0.5 : Number(e2.motion.heightInCells);
    if (r3 !== `linear` || !(Number.isFinite(i3) && Number.isFinite(a3) && (i3 !== 0 || a3 !== 0) && Math.abs(i3) <= 100 && Math.abs(a3) <= 100) || !Number.isFinite(s2) || s2 < 0 || s2 > 10) return { ok: false, reason: `invalid-motion`, descriptor: o2 };
    o2.targetSide = n3, o2.motion = Object.freeze({ kind: `linear`, velocity: Object.freeze({ columnsPerSecond: i3, lanesPerSecond: a3 }), heightInCells: s2 });
  }
  return { ok: true, descriptor: Object.freeze(o2) };
}
function me(e2) {
  let t2 = Number(e2);
  return Number.isFinite(t2) ? Math.max(250, Math.min(3e4, Math.round(t2))) : 15e3;
}
function he(e2 = {}) {
  let t2 = e2.registry || new fe(), n2 = e2.runtime || null, r2 = /* @__PURE__ */ new Map(), i2 = (e3) => {
    let t3 = e3?.entities ?? e3?.value;
    return (Array.isArray(t3) ? t3 : [t3]).filter(Boolean);
  }, a2 = async (t3, n3, r3, i3) => {
    let a3 = (Array.isArray(n3) ? n3 : [n3]).filter(Boolean);
    for (let n4 of [...a3].reverse()) try {
      typeof t3.dispose == `function` ? await t3.dispose(n4, { ...e2, descriptor: r3, reason: i3 }) : await e2.disposeRaw?.(n4, r3.kind, i3);
    } catch {
    }
  }, o2 = async (t3, r3) => {
    let o3 = n2?.signal;
    if (n2?.isActive?.() === false || o3?.aborted) return { kind: `aborted`, reason: `runtime-disposed` };
    let s3 = Promise.resolve().then(() => t3.spawn(r3, e2)), c2 = null, l2 = null, u2 = me(e2.timeoutMs), d2 = new Promise((e3) => {
      c2 = globalThis.setTimeout?.(() => e3({ kind: `timeout`, reason: `spawn-timeout` }), u2), o3 && (l2 = () => e3({ kind: `aborted`, reason: `runtime-disposed` }), o3.addEventListener(`abort`, l2, { once: true }));
    }), f2 = s3.then((e3) => ({ kind: `value`, value: e3 }), (e3) => ({ kind: `error`, error: e3 })), p2 = await Promise.race([f2, d2]);
    return globalThis.clearTimeout?.(c2), l2 && o3?.removeEventListener(`abort`, l2), (p2.kind === `timeout` || p2.kind === `aborted`) && f2.then(async (e3) => {
      e3.kind === `value` && await a2(t3, i2(e3.value), r3, `late-${p2.reason}`);
    }).catch(() => {
    }), p2;
  }, s2 = async (r3) => {
    let s3 = t2.resolve(r3.kind, e2);
    if (!s3) return T(r3, `adapter-unavailable`);
    let { adapter: c2, capability: l2 } = s3;
    if (typeof c2.dispose != `function` && typeof e2.disposeRaw != `function`) return T(r3, `cleanup-unavailable`, { adapter: c2.id, native: l2.native });
    let u2 = await o2(c2, r3);
    if (u2.kind !== `value`) {
      let e3 = u2.kind === `error` ? String(u2.error?.message || u2.error) : null;
      return T(r3, u2.reason || `spawn-failed`, { adapter: c2.id, native: l2.native, message: e3 });
    }
    let d2 = u2.value;
    if (!d2?.ok) return await a2(c2, i2(d2), r3, `spawn-rejected`), T(r3, d2?.reason || `spawn-rejected`, { adapter: c2.id, native: l2.native, message: d2?.message });
    let f2 = i2(d2);
    if (f2.length === 0) return T(r3, `spawn-rejected`, { adapter: c2.id, native: l2.native });
    if (n2?.isActive?.() === false || n2?.signal?.aborted) return await a2(c2, f2, r3, `runtime-disposed`), T(r3, `runtime-disposed`, { adapter: c2.id, native: l2.native });
    let p2 = { codename: r3.type, spawnKind: r3.kind, spawnAdapter: c2.id, native: l2.native, spawnAt: r3.at }, m2 = f2.map((e3) => se(e3)), h2 = null;
    try {
      h2 = Object.freeze(f2.map((t3, n3) => e2.wrapEntity?.(t3, r3.kind, Object.freeze({ ...p2, managedSpawnState: m2[n3] }))).filter(Boolean));
    } catch (e3) {
      for (let e4 of m2) e4?.markDisposed?.(`entity-wrap-failed`);
      await a2(c2, f2, r3, `entity-wrap-failed`);
      for (let e4 of m2) e4?.completeDisposal?.(true);
      return T(r3, `entity-wrap-failed`, { adapter: c2.id, native: l2.native, message: String(e3?.message || e3) });
    }
    if (h2.length !== f2.length) {
      for (let e3 of m2) e3?.markDisposed?.(`entity-wrap-failed`);
      await a2(c2, f2, r3, `entity-wrap-failed`);
      for (let e3 of m2) e3?.completeDisposal?.(true);
      return T(r3, `entity-wrap-failed`, { adapter: c2.id, native: l2.native });
    }
    let g2 = false, _2 = null, v2 = null, y2 = () => {
      if (m2.every((e3) => e3?.retired === true)) {
        try {
          v2?.();
        } catch {
        }
        v2 = null;
      }
    };
    for (let e3 of m2) e3?.onTerminal?.(y2);
    let b2 = async (t3) => {
      g2 = true;
      let n3 = [], i3 = m2.map((e3) => e3?.retired === true);
      for (let e3 of m2) ae(e3) || e3?.markDisposed?.(t3);
      try {
        for (let a3 = f2.length - 1; a3 >= 0; a3--) {
          let o3 = f2[a3], s4 = m2[a3];
          if (i3[a3]) {
            n3.push({ ok: true, methodName: null, reason: `already-retired` });
            continue;
          }
          try {
            let i4 = typeof c2.dispose == `function` ? await c2.dispose(o3, { ...e2, descriptor: r3, reason: t3 }) : await e2.disposeRaw?.(o3, r3.kind, t3);
            n3.push(i4 ?? null), s4?.completeDisposal?.(i4?.ok !== false);
          } catch (e3) {
            n3.push({ ok: false, reason: `dispose-failed`, message: String(e3?.message || e3) }), s4?.completeDisposal?.(false);
          }
        }
      } finally {
        try {
          v2?.();
        } catch {
        }
        v2 = null;
      }
      return Object.freeze({ ok: n3.every((e3) => e3?.ok !== false), disposed: true, results: Object.freeze(n3) });
    }, x2 = (e3 = `manual`) => _2 || (g2 ? Promise.resolve(Object.freeze({ ok: true, disposed: false, results: Object.freeze([]) })) : (_2 = b2(e3).finally(() => {
      _2 = null;
    }), _2));
    return v2 = n2?.onDispose?.(() => x2(`mod-dispose`), `dispose spawn ${r3.kind}:${r3.type}`) || null, y2(), Object.freeze({ ok: true, kind: r3.kind, type: r3.type, adapter: c2.id, native: l2.native, entities: h2, reason: null, message: null, get disposed() {
      return g2 || m2.every(ae);
    }, dispose: x2 });
  };
  return Object.freeze({ getCapabilities: () => t2.getCapabilities(e2), supports: (n3) => t2.supports(n3, e2), spawn: (e3) => {
    let t3 = pe(e3);
    if (!t3.ok) {
      let n3 = T(t3.descriptor, t3.reason);
      return e3?.required === true ? Promise.reject(Error(`spawns.spawn(): ${n3.reason}`)) : Promise.resolve(n3);
    }
    let i3 = t3.descriptor, a3 = `${i3.at.laneIndex}:${i3.at.columnIndex}`, o3 = (r2.get(a3) || Promise.resolve()).catch(() => {
    }).then(() => s2(i3)).then((e4) => {
      if (!e4.ok && i3.required) throw Error(`spawns.spawn(${i3.kind}:${i3.type}): ${e4.reason}`);
      return e4;
    }).finally(() => {
      r2.get(a3) === o3 && r2.delete(a3);
    });
    return r2.set(a3, o3), n2?.track ? n2.track(o3, { label: `spawn ${i3.kind}:${i3.type}` }) : o3;
  } });
}
var ge = `chunks:///_virtual/Droppings.ts`, _e = `chunks:///_virtual/NodePools.ts`, ve = Object.freeze({ "sun.tiny": Object.freeze({ prefab: `SunTiny`, componentModule: `sun.ts`, component: `sun`, motion: `drop` }), "sun.small": Object.freeze({ prefab: `SunSmall`, componentModule: `sun.ts`, component: `sun`, motion: `drop` }), "sun.mid": Object.freeze({ prefab: `SunMid`, componentModule: `sun.ts`, component: `sun`, motion: `drop` }), "sun.large": Object.freeze({ prefab: `SunLarge`, componentModule: `sun.ts`, component: `sun`, motion: `drop` }), "coin.silver": Object.freeze({ prefab: `CoinSilver`, componentModule: `coin.ts`, component: `coin`, motion: `drop` }), "coin.gold": Object.freeze({ prefab: `CoinGold`, componentModule: `coin.ts`, component: `coin`, motion: `drop` }), gem: Object.freeze({ prefab: `Gem`, componentModule: `gem.ts`, component: `gem`, motion: `drop` }), sprout: Object.freeze({ prefab: `Sprout`, componentModule: `sprout.ts`, component: `sprout`, motion: `drop` }), "plant-food": Object.freeze({ prefab: `plantFood`, componentModule: `plantFood.ts`, component: `plantFood`, motion: `float` }) });
function ye(e2) {
  return `chunks:///_virtual/${e2}`;
}
function be(e2) {
  return { droppings: e2.getModuleExport?.(ge, `droppings`), instantiatePooly: e2.getModuleExport?.(_e, `instantiatePooly`), destroyPooly: e2.getModuleExport?.(_e, `destroyPooly`), Vec2: e2.getCc?.()?.Vec2 };
}
function xe(e2, t2 = be(e2)) {
  return !t2.droppings?.layer || typeof t2.instantiatePooly != `function` || typeof t2.destroyPooly != `function` || typeof t2.Vec2 != `function` ? [] : Object.entries(ve).filter(([, n2]) => t2.droppings[n2.prefab] && typeof e2.getModuleExport?.(ye(n2.componentModule), n2.component) == `function`).map(([e3]) => e3);
}
function Se(e2, t2, n2) {
  let r2 = e2?.node?.worldPosition || e2?.worldPosition;
  return Number.isFinite(Number(r2?.x)) && Number.isFinite(Number(r2?.y)) ? r2 : t2.getWorldPosition?.(n2.at.laneIndex, n2.at.columnIndex) || null;
}
function E(e2, t2, n2) {
  if (e2.height = 0, t2 === `float`) {
    let t3 = Math.random() * Math.PI * 2;
    e2.linearVelocity = new n2(Math.cos(t3) * 5, Math.sin(t3) * 5), e2.bodyLinearVelocity = 0, e2.gravity = 0;
    return;
  }
  e2.linearVelocity = new n2(Math.random() * 6 - 3, 0), e2.bodyLinearVelocity = 10, e2.gravity = 1;
}
function Ce(e2, t2) {
  return !e2 || e2.collected === true || e2.node?.isValid === false ? { ok: true, methodName: null, reason: `already-inactive` } : typeof e2.shrink == `function` ? (e2.shrink(0.05), { ok: true, methodName: `shrink`, reason: null }) : e2.node && typeof t2.destroyPooly == `function` ? (t2.destroyPooly(e2.node), { ok: true, methodName: `destroyPooly`, reason: null }) : { ok: false, methodName: null, reason: `cleanup-unavailable` };
}
function we(e2 = {}) {
  return { id: `native.dropping.resource`, kind: `resource`, native: true, placements: [`cell`], types: Object.freeze(Object.keys(ve)), getCapability() {
    let t2 = xe(e2);
    return { available: t2.length > 0, reason: t2.length > 0 ? null : `native-resource-runtime-unavailable`, types: t2 };
  }, async spawn(t2) {
    if (e2.getSceneName?.() !== `inGameScene`) return { ok: false, reason: `scene-unavailable` };
    let n2 = ve[t2.type];
    if (!n2) return { ok: false, reason: `type-not-supported` };
    let r2 = be(e2);
    if (!xe(e2, r2).includes(t2.type)) return { ok: false, reason: `type-unavailable` };
    let i2 = e2.getCell?.(t2.at.laneIndex, t2.at.columnIndex), a2 = Se(i2, e2, t2);
    if (!i2 || !a2) return { ok: false, reason: `cell-unavailable` };
    let o2 = e2.getModuleExport?.(ye(n2.componentModule), n2.component), s2 = null;
    try {
      if (s2 = r2.instantiatePooly(r2.droppings[n2.prefab]), !s2) return { ok: false, reason: `native-resource-create-failed` };
      s2.parent = r2.droppings.layer;
      let e3 = s2.getComponent?.(o2);
      return !e3 || typeof e3.collect != `function` ? (r2.destroyPooly(s2), { ok: false, reason: `native-resource-shape-unsupported` }) : (e3.worldPosition = new r2.Vec2(a2.x, a2.y), E(e3, n2.motion, r2.Vec2), { ok: true, entities: [e3] });
    } catch (e3) {
      if (s2) try {
        r2.destroyPooly(s2);
      } catch {
      }
      throw e3;
    }
  }, dispose(t2) {
    return Ce(t2, be(e2));
  } };
}
var Te = `chunks:///_virtual/LnC.ts`, Ee = `chunks:///_virtual/TileLiquids.ts`, De = `chunks:///_virtual/JSONs.ts`, Oe = `chunks:///_virtual/NodePools.ts`;
function ke(e2) {
  return { LnC: e2.getModuleExport?.(Te, `LnC`), tileliquids: e2.getModuleExport?.(Ee, `tileliquids`), TileLiquidEnum: e2.getModuleExport?.(Ee, `TileLiquidEnum`), PvZ2Object: e2.getModuleExport?.(De, `PvZ2Object`), PvZ2ObjectContainer: e2.getModuleExport?.(De, `PvZ2ObjectContainer`), destroyPooly: e2.getModuleExport?.(Oe, `destroyPooly`) };
}
function Ae(e2, t2, n2) {
  let r2 = [];
  try {
    let n3 = e2.PvZ2ObjectContainer?.[t2];
    Array.isArray(n3) && r2.push(...n3);
  } catch {
  }
  try {
    let e3 = n2.getCurrentData?.(t2), i2 = Array.isArray(e3?.objects) ? e3.objects : [];
    r2.push(...i2);
  } catch {
  }
  return r2;
}
function je(e2, t2) {
  let n2 = /* @__PURE__ */ new Set();
  for (let r2 of [...Ae(e2, `CurrentLevel`, t2), ...Ae(e2, `GridItemTypes`, t2)]) if (r2?.objclass === `TileLiquidType`) for (let e3 of Array.isArray(r2.aliases) ? r2.aliases : []) {
    let t3 = String(e3 || ``).trim();
    t3 && n2.add(t3);
  }
  return [...n2].sort((e3, t3) => e3.localeCompare(t3));
}
function Me(e2, t2 = ke(e2)) {
  return typeof t2.LnC?.prototype?.SpawnTileLiquid == `function` ? typeof t2.tileliquids?.getTileLiquidType == `function` && t2.tileliquids?.res != null && Array.isArray(t2.tileliquids?.res?.features) && t2.TileLiquidEnum != null && typeof t2.PvZ2Object?.getObjectsByRTID == `function` ? typeof t2.destroyPooly == `function` ? { available: true, reason: null, types: je(t2, e2) } : { available: false, reason: `native-tile-liquid-cleanup-unavailable` } : { available: false, reason: `native-tile-liquid-runtime-unavailable` } : { available: false, reason: `native-method-unavailable` };
}
function D(e2, t2) {
  let n2 = String(t2 || ``).trim();
  if (!n2) return null;
  try {
    return e2.PvZ2Object.getObjectsByRTID(n2, `TileLiquidProperties`)[0]?.objdata ?? null;
  } catch {
    return null;
  }
}
function Ne(e2, t2, n2) {
  let r2 = String(t2?.TileLiquidBasedOn || e2 || ``).trim(), i2 = n2.TileLiquidEnum?.[r2], a2 = Number.isInteger(i2) ? n2.tileliquids.res.features[i2] : null;
  return !Number.isInteger(i2) || i2 < 0 || a2?.CODENAME !== r2 || !String(a2?.RES || ``).trim() ? { ok: false, reason: `type-host-not-found`, message: `Tile liquid '${e2}' references unknown native host '${r2}'` } : D(n2, a2.PROPS) ? D(n2, t2?.Properties) ? { ok: true } : { ok: false, reason: `type-properties-not-found`, message: `Tile liquid '${e2}' has unresolved properties` } : { ok: false, reason: `type-properties-not-found`, message: `Tile liquid host '${r2}' has unresolved base properties` };
}
function Pe(e2, t2) {
  let n2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Set(), i2 = (e3) => {
    let a2 = String(e3 || ``).trim();
    if (!a2) return { ok: false, reason: `type-redirection-invalid`, message: `Tile liquid redirection has no type` };
    if (n2.has(a2)) return { ok: true };
    if (r2.has(a2)) return { ok: false, reason: `type-redirection-cycle`, message: `Tile liquid redirection cycle includes '${a2}'` };
    let o2 = null;
    try {
      o2 = t2.tileliquids.getTileLiquidType(a2, true);
    } catch {
    }
    if (!o2) return { ok: false, reason: `type-not-found`, message: `Tile liquid type '${a2}' was not found` };
    r2.add(a2);
    let s2 = Array.isArray(o2.TileLiquidRedirection) ? o2.TileLiquidRedirection : [];
    if (s2.length > 0) {
      let e4 = false;
      for (let t3 of s2) {
        let n3 = Number(t3?.Weight);
        if (!Number.isFinite(n3) || n3 < 0) return r2.delete(a2), { ok: false, reason: `type-redirection-invalid`, message: `Tile liquid '${a2}' has an invalid redirection weight` };
        n3 > 0 && (e4 = true);
        let o3 = i2(t3?.Type);
        if (!o3.ok) return r2.delete(a2), o3;
      }
      if (!e4) return r2.delete(a2), { ok: false, reason: `type-redirection-invalid`, message: `Tile liquid '${a2}' has no positive redirection weight` };
    } else {
      let e4 = Ne(a2, o2, t2);
      if (!e4.ok) return r2.delete(a2), e4;
    }
    return r2.delete(a2), n2.add(a2), { ok: true };
  };
  return i2(e2);
}
function Fe(e2, t2) {
  if (t2.getSceneName?.() !== `inGameScene`) return { ok: false, reason: `scene-unavailable` };
  let n2 = ke(t2), r2 = Me(t2, n2);
  if (!r2.available) return { ok: false, reason: r2.reason };
  let i2 = Pe(e2.type, n2);
  if (!i2.ok) return i2;
  let a2 = t2.getCell?.(e2.at.laneIndex, e2.at.columnIndex);
  return a2 ? typeof a2.SpawnTileLiquid == `function` ? { ok: true, cell: a2, runtime: n2 } : { ok: false, reason: `native-method-unavailable` } : { ok: false, reason: `cell-unavailable` };
}
function Ie(e2, t2) {
  let n2 = e2?.node;
  if (!e2 || !n2 || n2.isValid === false || (`parent` in n2 ? n2.parent == null : n2.active === false)) return { ok: true, methodName: null, reason: `already-inactive` };
  let r2 = [];
  if (typeof e2.die != `function`) r2.push(Error(`Tile liquid die() is unavailable`));
  else try {
    e2.die();
  } catch (e3) {
    r2.push(e3);
  }
  if (n2.isValid !== false && (!(`parent` in n2) || n2.parent != null)) try {
    t2.destroyPooly(n2);
  } catch (e3) {
    r2.push(e3);
  }
  return { ok: r2.length === 0, methodName: `die+destroyPooly`, reason: r2.length === 0 ? null : `dispose-failed`, message: r2.length > 0 ? r2.map((e3) => String(e3?.message || e3)).join(`; `) : null };
}
function Le(e2 = {}) {
  return { id: `native.lnc.tile-liquid`, kind: `tile-liquid`, native: true, placements: [`cell`], getCapability: () => Me(e2), async spawn(t2) {
    let n2 = Fe(t2, e2);
    if (!n2.ok) return n2;
    let r2 = await n2.cell.SpawnTileLiquid(t2.type);
    return r2 ? !r2.node || typeof r2.die != `function` ? (Ie(r2, n2.runtime), { ok: false, reason: `native-tile-liquid-shape-unsupported` }) : { ok: true, entities: [r2] } : { ok: false, reason: `spawn-rejected` };
  }, dispose(t2) {
    return Ie(t2, ke(e2));
  } };
}
var Re = `chunks:///_virtual/LnC.ts`, ze = `chunks:///_virtual/Projectiles.ts`, Be = `chunks:///_virtual/Character.ts`, Ve = `chunks:///_virtual/levelController.ts`, He = `chunks:///_virtual/NodePools.ts`;
function Ue(e2) {
  return e2.getModuleExport?.(Re, `LnC`)?.prototype || null;
}
function We(e2, t2) {
  let n2 = typeof Ue(e2)?.[t2] == `function`;
  return { available: n2, reason: n2 ? null : `native-method-unavailable` };
}
function Ge(e2, t2, n2) {
  if (t2.getSceneName?.() !== `inGameScene`) return { ok: false, reason: `scene-unavailable` };
  if (t2.hasType?.(e2.kind, e2.type) !== true) return { ok: false, reason: `type-not-found` };
  let r2 = t2.getCell?.(e2.at.laneIndex, e2.at.columnIndex);
  return r2 ? typeof r2[n2] == `function` ? { ok: true, cell: r2 } : { ok: false, reason: `native-method-unavailable` } : { ok: false, reason: `cell-unavailable` };
}
function Ke(e2) {
  return { projectileRes: e2.getModuleExport?.(ze, `projectileRes`), projectile: e2.getModuleExport?.(ze, `projectile`), characterType: e2.getModuleExport?.(Be, `CharacterType`), levelPlay: e2.getModuleExport?.(Ve, `LevelPlay`), destroyPooly: e2.getModuleExport?.(He, `destroyPooly`), Vec2: e2.getCc?.()?.Vec2 };
}
function qe(e2, t2) {
  return !e2 || e2.dead === true || e2.node?.isValid === false ? { ok: true, methodName: null, reason: `already-inactive` } : typeof e2.fade == `function` ? (e2.fade(true), { ok: true, methodName: `fade`, reason: null }) : e2.node && typeof t2.destroyPooly == `function` ? (t2.destroyPooly(e2.node), { ok: true, methodName: `destroyPooly`, reason: null }) : { ok: false, methodName: null, reason: `cleanup-unavailable` };
}
function Je(e2) {
  let t2 = Ke(e2), n2 = e2.getSquareSize?.(), r2 = typeof t2.projectileRes?.getProjectile == `function` && t2.projectileRes?.res != null && typeof t2.projectile?.registerProjectile == `function` && Array.isArray(t2.projectile?.manager?.prjPool) && Number.isFinite(t2.characterType?.plant) && Number.isFinite(t2.characterType?.zombie) && typeof t2.destroyPooly == `function` && typeof t2.Vec2 == `function` && Number(n2?.width) > 0 && Number(n2?.height) > 0 && typeof e2.getWorldPosition == `function`;
  return { available: r2, reason: r2 ? null : `native-projectile-runtime-unavailable`, motionKinds: [`linear`], targetSides: [`plant`, `zombie`] };
}
function Ye(e2, t2) {
  if (t2.getSceneName?.() !== `inGameScene`) return { ok: false, reason: `scene-unavailable` };
  if (t2.hasType?.(`projectile`, e2.type) !== true) return { ok: false, reason: `type-not-found` };
  let n2 = Je(t2);
  if (!n2.available) return { ok: false, reason: n2.reason };
  let r2 = t2.getCell?.(e2.at.laneIndex, e2.at.columnIndex), i2 = r2?.inLane?.prjLayer, a2 = r2?.node?.worldPosition || r2?.worldPosition, o2 = t2.getWorldPosition?.(e2.at.laneIndex, e2.at.columnIndex), s2 = Number.isFinite(Number(a2?.x)) && Number.isFinite(Number(a2?.y)) ? a2 : o2;
  return !r2 || !i2 || !s2 ? { ok: false, reason: `cell-unavailable` } : { ok: true, cell: r2, parent: i2, worldPosition: s2, runtime: Ke(t2) };
}
function Xe(e2) {
  let t2 = We(e2, `SpawnTomb`);
  if (!t2.available) return t2;
  let n2 = e2.getModuleExport?.(He, `destroyPooly`);
  return { available: typeof n2 == `function`, reason: typeof n2 == `function` ? null : `native-tomb-cleanup-unavailable` };
}
function Ze(e2, t2) {
  if (!e2 || e2.node?.isValid === false || e2.node?.active === false) return { ok: true, methodName: null, reason: `already-inactive` };
  let n2 = t2.getModuleExport?.(He, `destroyPooly`);
  return !e2.node || typeof n2 != `function` ? { ok: false, methodName: null, reason: `cleanup-unavailable` } : (n2(e2.node), { ok: true, methodName: `destroyPooly`, reason: null });
}
function Qe(e2 = {}) {
  return [{ id: `native.lnc.plant`, kind: `plant`, native: true, placements: [`cell`], getCapability: () => We(e2, `SpawnPlantByType`), async spawn(t2) {
    let n2 = Ge(t2, e2, `SpawnPlantByType`);
    if (!n2.ok) return n2;
    let r2 = await n2.cell.SpawnPlantByType(t2.type, true, false, true, true, false, true);
    return r2 ? { ok: true, entities: [r2] } : { ok: false, reason: `spawn-rejected` };
  } }, { id: `native.lnc.zombie`, kind: `zombie`, native: true, placements: [`cell`], getCapability() {
    let t2 = We(e2, `SpawnZombieByZombieType`);
    if (!t2.available) return t2;
    let n2 = e2.getModuleExport?.(Re, `LnCSpawnZombieStyleEnum`);
    return { available: Number.isFinite(n2?.appear), reason: Number.isFinite(n2?.appear) ? null : `native-enum-unavailable` };
  }, async spawn(t2) {
    let n2 = Ge(t2, e2, `SpawnZombieByZombieType`);
    if (!n2.ok) return n2;
    let r2 = e2.getModuleExport?.(Re, `LnCSpawnZombieStyleEnum`);
    if (!Number.isFinite(r2?.appear)) return { ok: false, reason: `native-enum-unavailable` };
    let i2 = await n2.cell.SpawnZombieByZombieType(t2.type, r2.appear, true, 0.5, 0, null, true, false, false);
    return Array.isArray(i2) && i2.length > 0 ? { ok: true, entities: i2 } : { ok: false, reason: `spawn-rejected` };
  } }, { id: `native.lnc.tomb`, kind: `tomb`, native: true, placements: [`cell`], getCapability: () => Xe(e2), async spawn(t2) {
    let n2 = Ge(t2, e2, `SpawnTomb`);
    if (!n2.ok) return n2;
    let r2 = await n2.cell.SpawnTomb(t2.type, true, false, false, true, true, false);
    return r2 ? { ok: true, entities: [r2] } : { ok: false, reason: `spawn-rejected` };
  }, dispose(t2) {
    return Ze(t2, e2);
  } }, { id: `native.projectile.linear`, kind: `projectile`, native: true, placements: [`cell`], motionKinds: [`linear`], targetSides: [`plant`, `zombie`], getCapability: () => Je(e2), async spawn(t2) {
    let n2 = Ye(t2, e2);
    if (!n2.ok) return n2;
    let { projectileRes: r2, projectile: i2, characterType: a2, levelPlay: o2, Vec2: s2 } = n2.runtime, c2 = e2.getSquareSize(), l2 = null;
    try {
      if (l2 = await r2.getProjectile(t2.type, n2.parent, false), !l2?.node || typeof l2.fade != `function`) return qe(l2, n2.runtime), { ok: false, reason: `native-projectile-shape-unsupported` };
      let e3 = t2.motion.velocity;
      return l2.worldPosition = new s2(n2.worldPosition.x, n2.worldPosition.y), l2.height = t2.motion.heightInCells * c2.height, l2.linearVelocity = new s2(e3.columnsPerSecond * c2.width / 60, -e3.lanesPerSecond * c2.height / 60), l2.bodyLinearVelocity = 0, l2.gravity = Number.isFinite(Number(o2?.ExtraGravity)) ? Number(o2.ExtraGravity) : 0, l2.JudgesZombieBodyRecForShooter = true, i2.registerProjectile(l2, a2[t2.targetSide]), l2.rotate?.(), { ok: true, entities: [l2] };
    } catch (e3) {
      try {
        qe(l2, n2.runtime);
      } catch {
      }
      throw e3;
    }
  }, dispose(t2) {
    return qe(t2, Ke(e2));
  } }, Le(e2), we(e2)];
}
function $e(e2, t2) {
  if (e2 == null) return null;
  if (typeof e2 != `object` || typeof e2.aborted != `boolean` || typeof e2.addEventListener != `function` || typeof e2.removeEventListener != `function`) throw TypeError(`${t2} signal must be an AbortSignal`);
  return e2;
}
function et(e2 = {}) {
  let t2 = String(e2.label || `subscription`), n2 = $e(e2.signal, t2), r2 = e2.runtime || null;
  r2?.assertActive?.(t2);
  let i2 = true, a2 = false, o2 = null, s2 = () => {
    if (!i2) return false;
    i2 = false, a2 && (a2 = false, n2.removeEventListener(`abort`, s2));
    let t3 = o2;
    return o2 = null, t3?.(), e2.onCancel?.(), true;
  };
  return n2?.aborted && (i2 = false), i2 && n2 && (n2.addEventListener(`abort`, s2, { once: true }), a2 = true, n2.aborted && s2()), i2 && (typeof r2?.onDispose == `function` ? o2 = r2.onDispose(s2, `cancel ${t2}`) : typeof r2?.addCleanup == `function` && (o2 = r2.addCleanup(s2, `cancel ${t2}`))), Object.freeze({ get active() {
    return i2;
  }, cancel: s2 });
}
var tt = Object.freeze([`stun`, `chill`, `freeze`, `butter`, `dark-matter`, `perfume`, `chili-stun`, `glittering`, `sap`, `poison`]);
function O(e2) {
  try {
    return String(e2 || ``).trim().toLowerCase();
  } catch {
    return ``;
  }
}
function nt(e2) {
  let t2 = NaN;
  try {
    t2 = Number(e2);
  } catch {
  }
  return !Number.isFinite(t2) || t2 <= 0 ? null : Math.min(3600, t2);
}
function rt(e2, t2, n2 = {}) {
  return Object.freeze({ ok: false, effect: O(e2), appliedEffect: null, adapter: n2.adapter || null, methodName: n2.methodName || null, requestedDuration: n2.requestedDuration ?? null, extended: false, before: n2.before || null, after: n2.after || null, changes: ct(n2.before || null, n2.after || null), reason: String(t2 || `effect-failed`), message: n2.message ? String(n2.message) : null });
}
var it = class {
  constructor(e2 = {}) {
    this._knownEffects = new Set([...e2.knownEffects || tt].map(O).filter(Boolean)), this._adapters = /* @__PURE__ */ new Map();
  }
  register(e2) {
    let t2 = String(e2?.id || ``).trim(), n2 = O(e2?.effect);
    if (!t2 || !n2 || typeof e2?.supports != `function` || typeof e2?.apply != `function` || typeof e2?.read != `function`) throw Error(`Status adapters require id, effect, supports(), read(), and apply()`);
    if (this._adapters.has(t2)) throw Error(`Status adapter '${t2}' is already registered`);
    let r2 = Object.freeze({ ...e2, id: t2, effect: n2, priority: Number.isFinite(Number(e2.priority)) ? Number(e2.priority) : 0 });
    return this._knownEffects.add(n2), this._adapters.set(t2, r2), () => this._adapters.delete(t2);
  }
  list(e2 = null) {
    let t2 = e2 == null ? null : O(e2);
    return [...this._adapters.values()].filter((e3) => t2 == null || e3.effect === t2).sort((e3, t3) => t3.priority - e3.priority || e3.id.localeCompare(t3.id));
  }
  resolve(e2, t2) {
    for (let n2 of this.list(t2)) try {
      if (n2.supports(e2) === true) return n2;
    } catch {
    }
    return null;
  }
  effects() {
    return [...this._knownEffects].sort();
  }
};
function k(e2, t2, n2 = true) {
  let r2 = {};
  for (let n3 of e2.effects()) {
    let i2 = e2.resolve(t2, n3), a2 = null, o2 = null;
    if (i2) try {
      let e3 = i2.read(t2), n4 = Number(e3 && typeof e3 == `object` ? e3.remaining : e3);
      a2 = Number.isFinite(n4) ? Math.max(0, n4) : null, o2 = e3 && typeof e3 == `object` && e3.details && typeof e3.details == `object` ? Object.freeze({ ...e3.details }) : null;
    } catch {
    }
    r2[n3] = Object.freeze({ effect: n3, available: !!i2, adapter: i2?.id || null, active: a2 !== null && a2 > 0, remaining: a2, details: o2 });
  }
  return Object.freeze({ effects: Object.freeze(r2), clearAll: n2 && typeof t2?.clearBuff == `function`, targetActive: n2 === true });
}
function at(e2, t2, n2, r2) {
  let i2 = Array.isArray(e2.observedEffects) && e2.observedEffects.length > 0 ? e2.observedEffects.map(O) : [e2.effect];
  for (let a2 of i2) {
    let i3 = Number(t2.effects?.[a2]?.remaining || 0), o2 = Number(n2.effects?.[a2]?.remaining || 0);
    if (o2 > i3 || a2 === e2.effect && i3 >= r2 && o2 >= i3) return a2;
  }
  return null;
}
function ot(e2, t2) {
  if (typeof e2?.clear != `function`) return false;
  if (typeof e2.canClear != `function`) return true;
  try {
    return e2.canClear(t2) === true;
  } catch {
    return false;
  }
}
function st(e2, t2) {
  if (e2 === t2) return true;
  try {
    return JSON.stringify(e2) === JSON.stringify(t2);
  } catch {
    return false;
  }
}
function ct(e2, t2) {
  if (!e2?.effects || !t2?.effects) return Object.freeze([]);
  let n2 = [.../* @__PURE__ */ new Set([...Object.keys(e2.effects), ...Object.keys(t2.effects)])].sort(), r2 = [];
  for (let i2 of n2) {
    let n3 = e2.effects[i2] || null, a2 = t2.effects[i2] || null;
    if (!n3 || !a2) continue;
    let o2 = [];
    if (!n3.active && a2.active) o2.push(`activated`);
    else if (n3.active && !a2.active) o2.push(`deactivated`);
    else if (n3.active && a2.active) {
      let e3 = Number(n3.remaining), t3 = Number(a2.remaining);
      Number.isFinite(e3) && Number.isFinite(t3) && (t3 > e3 + 1e-6 ? o2.push(`extended`) : t3 < e3 - 1e-6 && o2.push(`shortened`));
    }
    (n3.available !== a2.available || n3.adapter !== a2.adapter) && o2.push(`adapter`), st(n3.details, a2.details) || o2.push(`details`), o2.length !== 0 && r2.push(Object.freeze({ effect: i2, changes: Object.freeze(o2), before: n3, after: a2 }));
  }
  return Object.freeze(r2);
}
function lt(e2, t2) {
  let n2 = [];
  e2.active !== t2.active && n2.push(`active`), (e2.available !== t2.available || e2.adapter !== t2.adapter) && n2.push(`adapter`), st(e2.details, t2.details) || n2.push(`details`);
  let r2 = Number(e2.remaining), i2 = Number(t2.remaining);
  return e2.active && t2.active && Number.isFinite(r2) && Number.isFinite(i2) && i2 > r2 + 1e-6 && n2.push(`remaining`), n2;
}
function ut(e2 = {}) {
  let t2 = e2.registry || new it(), n2 = typeof e2.unwrap == `function` ? e2.unwrap : (e3) => e3, r2 = (t3, n3) => {
    if (typeof e2.isActive != `function`) return true;
    try {
      return e2.isActive(t3, n3) !== false;
    } catch {
      return false;
    }
  };
  return Object.freeze({ getCapabilities(e3) {
    let i2 = n2(e3), a2 = r2(e3, i2), o2 = a2 ? k(t2, i2) : k(t2, null, false), s2 = {};
    for (let [e4, n3] of Object.entries(o2.effects)) {
      let r3 = a2 ? t2.resolve(i2, e4) : null;
      s2[e4] = Object.freeze({ effect: e4, available: a2 && n3.available, adapter: a2 ? n3.adapter : null, clearable: a2 && ot(r3, i2) });
    }
    return Object.freeze({ effects: Object.freeze(s2), clearAll: a2 && o2.clearAll });
  }, getState(e3) {
    let i2 = n2(e3);
    return r2(e3, i2) ? k(t2, i2) : k(t2, null, false);
  }, supports(e3, i2) {
    let a2 = n2(e3);
    return r2(e3, a2) && t2.resolve(a2, i2) != null;
  }, apply(e3, i2 = {}) {
    i2 = i2 && typeof i2 == `object` ? i2 : {};
    let a2 = n2(e3), o2 = O(i2.effect), s2 = nt(i2.duration), c2 = (e4, t3 = {}) => {
      let n3 = rt(o2, e4, { requestedDuration: s2, ...t3 });
      if (i2.required === true) throw Error(`status.apply(${o2 || `unknown`}): ${n3.reason}`);
      return n3;
    };
    if (!a2 || !o2) return c2(`invalid-descriptor`);
    if (!r2(e3, a2)) return c2(`entity-inactive`);
    if (s2 === null) return c2(`invalid-duration`);
    let l2 = t2.resolve(a2, o2);
    if (!l2) return c2(`adapter-unavailable`);
    let u2 = { ...i2, effect: o2, duration: s2 };
    if (typeof l2.validate == `function`) {
      let e4 = null;
      try {
        e4 = l2.validate(u2);
      } catch {
        e4 = `invalid-descriptor`;
      }
      if (e4) return c2(e4, { adapter: l2.id, methodName: l2.methodName });
    }
    let d2 = k(t2, a2), f2;
    try {
      f2 = l2.apply(a2, u2);
    } catch (e4) {
      return c2(`effect-threw`, { adapter: l2.id, methodName: l2.methodName, before: d2, after: k(t2, a2), message: e4?.message || e4 });
    }
    let p2 = k(t2, a2), m2 = at(l2, d2, p2, s2);
    if (f2 === false || !m2) return c2(`effect-rejected`, { adapter: l2.id, methodName: l2.methodName, before: d2, after: p2 });
    let h2 = Number(d2.effects[m2]?.remaining || 0), g2 = Number(p2.effects[m2]?.remaining || 0);
    return Object.freeze({ ok: true, effect: o2, appliedEffect: m2, adapter: l2.id, methodName: l2.methodName, requestedDuration: s2, extended: g2 > h2, before: d2, after: p2, changes: ct(d2, p2), reason: null, message: null });
  }, clear(e3, i2, a2 = {}) {
    a2 = a2 && typeof a2 == `object` ? a2 : {};
    let o2 = n2(e3), s2 = O(i2), c2 = (e4, t3 = {}) => {
      let n3 = Object.freeze({ ok: false, effect: s2, adapter: t3.adapter || null, methodName: t3.methodName || null, cleared: false, before: t3.before || null, after: t3.after || null, changes: ct(t3.before || null, t3.after || null), reason: e4, message: t3.message ? String(t3.message) : null });
      if (a2.required === true) throw Error(`status.clear(${s2 || `unknown`}): ${e4}`);
      return n3;
    };
    if (!o2 || !s2) return c2(`invalid-descriptor`);
    if (!r2(e3, o2)) return c2(`entity-inactive`);
    let l2 = t2.resolve(o2, s2);
    if (!l2) return c2(`adapter-unavailable`);
    if (!ot(l2, o2)) return c2(`clear-adapter-unavailable`, { adapter: l2.id, methodName: l2.clearMethodName || null });
    let u2 = k(t2, o2);
    if (u2.effects?.[s2]?.active !== true) return Object.freeze({ ok: true, effect: s2, adapter: l2.id, methodName: l2.clearMethodName || null, cleared: false, before: u2, after: u2, changes: Object.freeze([]), reason: `effect-inactive`, message: null });
    let d2;
    try {
      d2 = l2.clear(o2, { effect: s2 });
    } catch (e4) {
      return c2(`clear-threw`, { adapter: l2.id, methodName: l2.clearMethodName || null, before: u2, after: k(t2, o2), message: e4?.message || e4 });
    }
    let f2 = k(t2, o2);
    return d2 === false || f2.effects?.[s2]?.active === true ? c2(`clear-rejected`, { adapter: l2.id, methodName: l2.clearMethodName || null, before: u2, after: f2 }) : Object.freeze({ ok: true, effect: s2, adapter: l2.id, methodName: l2.clearMethodName || null, cleared: true, before: u2, after: f2, changes: ct(u2, f2), reason: null, message: null });
  }, clearAll(e3, i2 = {}) {
    i2 = i2 && typeof i2 == `object` ? i2 : {};
    let a2 = n2(e3), o2 = (e4, t3 = {}) => {
      let n3 = Object.freeze({ ok: false, methodName: null, before: t3.before || null, after: t3.after || null, changes: ct(t3.before || null, t3.after || null), reason: e4, message: t3.message ? String(t3.message) : null });
      if (i2.required === true) throw Error(`status.clearAll(): ${e4}`);
      return n3;
    };
    if (!a2) return o2(`invalid-target`);
    if (!r2(e3, a2)) return o2(`entity-inactive`);
    if (typeof a2.clearBuff != `function`) return o2(`clear-adapter-unavailable`);
    let s2 = k(t2, a2);
    try {
      a2.clearBuff();
    } catch (e4) {
      return o2(`clear-threw`, { before: s2, after: k(t2, a2), message: e4?.message || e4 });
    }
    let c2 = k(t2, a2);
    return Object.freeze({ ok: true, methodName: `clearBuff`, before: s2, after: c2, changes: ct(s2, c2), reason: null, message: null });
  }, watch(i2, a2, o2 = {}) {
    if (typeof a2 != `function`) throw Error(`status.watch() requires a listener`);
    o2 = o2 && typeof o2 == `object` ? o2 : {};
    let s2 = e2.runtime;
    if (!s2?.setInterval || !s2?.track) throw Error(`status.watch() requires a managed mod runtime`);
    let c2 = new Set(t2.effects()), l2 = o2.effects == null ? [...c2] : Array.isArray(o2.effects) ? [...new Set(o2.effects.map(O).filter((e3) => c2.has(e3)))] : [];
    if (l2.length === 0) throw Error(`status.watch() requires at least one known effect`);
    let u2 = Math.max(50, Math.min(1e4, Number(o2.intervalMs) || 100)), d2 = () => {
      try {
        return typeof s2.isActive != `function` || s2.isActive() !== false;
      } catch {
        return false;
      }
    }, f2 = null, p2 = false, m2 = null, h2 = et({ runtime: s2, signal: o2.signal, label: o2.label || `status watch`, onCancel() {
      f2 = null, m2?.();
    } });
    if (!h2.active) return h2.cancel;
    let g2 = async () => {
      if (!(!h2.active || p2 || !d2())) {
        p2 = true;
        try {
          let e3 = n2(i2), s3 = r2(i2, e3), c3 = s3 ? k(t2, e3) : k(t2, null, false), u3 = Date.now(), d3 = [];
          if (f2) for (let e4 of l2) {
            let t3 = f2.effects[e4], n3 = c3.effects[e4], r3 = lt(t3, n3), a3 = null;
            !t3.active && n3.active ? a3 = `started` : t3.active && !n3.active ? a3 = `ended` : t3.active && n3.active && r3.length > 0 && (a3 = `updated`), a3 && d3.push(Object.freeze({ type: a3, effect: e4, target: i2, previous: t3, current: n3, changes: Object.freeze(r3), reason: a3 === `ended` ? s3 ? `expired-or-cleared` : `target-inactive` : a3 === `started` ? `activated` : `extended-or-updated`, timestamp: u3 }));
          }
          else if (o2.emitInitial === true) for (let e4 of l2) {
            let t3 = c3.effects[e4];
            t3.active && d3.push(Object.freeze({ type: `started`, effect: e4, target: i2, previous: null, current: t3, changes: Object.freeze([`initial`]), reason: `initial`, timestamp: u3 }));
          }
          f2 = c3, s3 || h2.cancel(), d3.length > 0 && await Promise.all(d3.map((e4) => Promise.resolve().then(() => a2(e4))));
        } finally {
          p2 = false;
        }
      }
    };
    return s2.track(Promise.resolve().then(g2), { label: o2.label || `status watch initial scan` }), m2 = s2.setInterval(g2, u2, { label: o2.label || `status watch` }), h2.cancel;
  } });
}
function A(e2, t2, n2, r2 = {}) {
  return { id: `native.duration.${e2}`, effect: e2, methodName: t2, clearMethodName: r2.clearMethodName || `clear:${n2}`, priority: Number(r2.priority || 0), observedEffects: r2.observedEffects || [e2], supports(e3) {
    return typeof e3?.[t2] != `function` || !Number.isFinite(Number(e3?.[n2])) ? false : typeof r2.supports != `function` || r2.supports(e3) === true;
  }, read(e3) {
    let t3 = Number(e3?.[n2]);
    return Number.isFinite(t3) ? t3 : 0;
  }, apply(e3, n3) {
    return e3[t2](n3.duration, ...r2.extraArgs || []);
  }, clear: typeof r2.clear == `function` ? (e3) => r2.clear(e3) : void 0 };
}
function dt(e2) {
  e2?.shouldColor?.(), e2?.shouldMaterial?.();
}
function j(e2, t2 = null) {
  return (n2) => {
    n2[e2] = 0, t2?.(n2), dt(n2);
  };
}
function M(e2) {
  return typeof e2?.clearBuff == `function`;
}
function ft() {
  return { id: `native.duration.stun.plant`, effect: `stun`, methodName: `setStun`, clearMethodName: `specialPlantOnUnsheepend`, priority: 10, supports: (e2) => typeof e2?.setStun == `function` && Number.isFinite(Number(e2?.stunned)) && typeof e2?.specialPlantOnUnsheepend == `function` && typeof e2?.clearBuff != `function`, read: (e2) => Math.max(0, Number(e2?.stunned) || 0), apply: (e2, t2) => e2.setStun(t2.duration), clear(e2) {
    let t2 = Number(e2?.stunned) > 0;
    e2.stunned = 0, t2 && e2.specialPlantOnUnsheepend();
  } };
}
function pt() {
  return [ft(), A(`stun`, `setStun`, `stunned`, { supports: M, clear: j(`stunned`) }), A(`chill`, `setChill`, `chill`, { supports: M, clear: j(`chill`) }), A(`freeze`, `setFreeze`, `freeze`, { observedEffects: [`freeze`, `chill`], extraArgs: [true], supports: M, clear: j(`freeze`, (e2) => {
    let t2 = e2.icetrapDB == null ? `icetrapParticle` : `icetrapDB`;
    e2[t2]?.playAnimation?.(`Die`, 1), e2[t2] = null;
  }) }), A(`butter`, `setButter`, `butterStun`, { extraArgs: [false], supports: M, clear: j(`butterStun`, (e2) => {
    e2.butterFace?.node && (e2.butterFace.node.active = false);
  }) }), A(`dark-matter`, `setDarkMatter`, `darkmatter`, { supports: M, clear: j(`darkmatter`) }), A(`perfume`, `setPerfume`, `perfume`, { supports: M, clear: j(`perfume`) }), A(`chili-stun`, `setChiliStun`, `chiliStun`, { supports: M, clear: j(`chiliStun`) }), A(`glittering`, `setGlittering`, `glittering`, { supports: M, clear: j(`glittering`) }), A(`sap`, `setSapfling`, `sapflingCD`, { supports: M, clear: (e2) => {
    e2.sapflingCD = 0;
  } })];
}
var mt = /* @__PURE__ */ new Set([`none`, `contact`]);
function ht(e2) {
  try {
    if (typeof e2?.isValid == `function`) return e2.isValid() === true;
  } catch {
    return false;
  }
  return Number(e2?.DPS) > 0 && Number(e2?.duration) > 0;
}
function gt() {
  return { id: `native.poison.zombie`, effect: `poison`, methodName: `setPoison`, clearMethodName: `clear:poison`, supports: (e2) => M(e2) && typeof e2?.setPoison == `function` && e2?.poison && Number.isFinite(Number(e2.poison.DPS)) && Number.isFinite(Number(e2.poison.duration)), validate(e2) {
    let t2 = Number(e2.damagePerSecond);
    if (!Number.isFinite(t2) || t2 <= 0 || t2 > 1e6) return `invalid-damage-per-second`;
    let n2 = String(e2.propagation || `none`).trim().toLowerCase();
    return mt.has(n2) ? null : `invalid-propagation`;
  }, read(e2) {
    let t2 = e2?.poison;
    return { remaining: Number(t2?.duration) || 0, details: Object.freeze({ damagePerSecond: Math.max(0, Number(t2?.DPS) || 0), propagation: t2?.infective === true ? `contact` : `none` }) };
  }, apply(e2, t2) {
    let n2 = e2.poison, r2 = Math.max(Number(n2?.DPS) || 0, Number(t2.damagePerSecond)), i2 = Math.max(Number(n2?.duration) || 0, t2.duration), a2 = n2?.infective === true || String(t2.propagation || `none`).toLowerCase() === `contact`;
    return e2.setPoison(r2, i2, a2);
  }, canClear(e2) {
    return Array.isArray(e2?._poison_stacked) && Array.isArray(e2?.poisonfaceSlots) && e2.poisonfaceSlots.every((e3) => typeof e3?._setDisplayIndex == `function`) && typeof e2?.shouldColor == `function`;
  }, clear(e2) {
    e2.poison.DPS = 0, e2.poison.duration = 0, e2.poison.infective = false;
    let t2 = e2._poison_stacked.some(ht);
    e2.poisonfaceSlots.forEach((e3) => e3._setDisplayIndex(t2 ? 0 : -1)), e2.shouldColor();
  } };
}
function _t() {
  return [...pt(), gt()];
}
var vt = Object.freeze([`poison`, `speed-multiplier`]);
function yt(e2) {
  try {
    return String(e2 || ``).trim().toLowerCase();
  } catch {
    return ``;
  }
}
function bt(e2) {
  let t2 = NaN;
  try {
    t2 = Number(e2);
  } catch {
  }
  return !Number.isFinite(t2) || t2 <= 0 || t2 > 3600 ? null : t2;
}
function xt(e2) {
  return e2 && typeof e2 == `object` ? Object.freeze({ ...e2 }) : null;
}
function St(e2, t2 = e2.state) {
  return Object.freeze({ effect: e2.effect, active: false, remaining: 0, details: e2.lastDetails, reason: String(t2 || `layer-inactive`) });
}
function Ct(e2, t2, n2 = {}) {
  return Object.freeze({ ok: false, effect: yt(e2), adapter: n2.adapter || null, layer: null, state: null, reason: String(t2 || `layer-failed`), message: n2.message ? String(n2.message) : null });
}
var wt = class {
  constructor(e2 = {}) {
    this._knownEffects = new Set([...e2.knownEffects || vt].map(yt).filter(Boolean)), this._adapters = /* @__PURE__ */ new Map();
  }
  register(e2) {
    let t2 = String(e2?.id || ``).trim(), n2 = yt(e2?.effect);
    if (!t2 || !n2 || typeof e2?.supports != `function` || typeof e2?.create != `function` || typeof e2?.insert != `function` || typeof e2?.contains != `function` || typeof e2?.read != `function` || typeof e2?.remove != `function`) throw Error(`Status layer adapters require id, effect, supports(), create(), insert(), contains(), read(), and remove()`);
    if (this._adapters.has(t2)) throw Error(`Status layer adapter '${t2}' is already registered`);
    let r2 = Object.freeze({ ...e2, id: t2, effect: n2, priority: Number.isFinite(Number(e2.priority)) ? Number(e2.priority) : 0 });
    return this._knownEffects.add(n2), this._adapters.set(t2, r2), () => this._adapters.delete(t2);
  }
  list(e2 = null) {
    let t2 = e2 == null ? null : yt(e2);
    return [...this._adapters.values()].filter((e3) => t2 == null || e3.effect === t2).sort((e3, t3) => t3.priority - e3.priority || e3.id.localeCompare(t3.id));
  }
  resolve(e2, t2) {
    for (let n2 of this.list(t2)) try {
      if (n2.supports(e2) === true) return n2;
    } catch {
    }
    return null;
  }
  effects() {
    return [...this._knownEffects].sort();
  }
};
function Tt(e2 = {}) {
  let t2 = e2.registry || new wt(), n2 = typeof e2.unwrap == `function` ? e2.unwrap : (e3) => e3, r2 = e2.runtime || null, i2 = /* @__PURE__ */ new Set(), a2 = null, o2 = null, s2 = false, c2 = () => typeof r2?.onDispose == `function` && typeof r2?.setInterval == `function`, l2 = () => {
    if (!c2()) return false;
    try {
      return typeof r2.isActive != `function` || r2.isActive() !== false;
    } catch {
      return false;
    }
  }, u2 = (t3, n3) => {
    if (typeof e2.isActive != `function`) return true;
    try {
      return e2.isActive(t3, n3) !== false;
    } catch {
      return false;
    }
  }, d2 = (t3) => {
    try {
      return e2.getGenerationState?.(t3) || null;
    } catch {
      return null;
    }
  }, f2 = (e3) => {
    let t3 = null;
    try {
      t3 = e3.adapter.read(e3.target, e3.nativeLayer);
    } catch {
      return null;
    }
    let n3 = Number(t3 && typeof t3 == `object` ? t3.remaining : t3);
    if (!Number.isFinite(n3)) return null;
    let r3 = Math.max(0, n3), i3 = xt(t3 && typeof t3 == `object` ? t3.details : null);
    return i3 && (e3.lastDetails = i3), Object.freeze({ effect: e3.effect, active: true, remaining: r3, details: e3.lastDetails, reason: null });
  }, p2 = () => {
    if (s2 || i2.size > 0) return;
    let e3 = a2;
    a2 = null;
    try {
      e3?.();
    } catch {
    }
    let t3 = o2;
    o2 = null;
    try {
      t3?.();
    } catch {
    }
  }, m2 = (e3, t3, n3 = true) => {
    if (e3.state !== `active`) return false;
    if (n3) try {
      e3.adapter.remove(e3.target, e3.nativeLayer);
    } catch {
    }
    e3.state = String(t3 || `disposed`), i2.delete(e3);
    let r3 = e3.unsubscribeTerminal;
    e3.unsubscribeTerminal = null;
    try {
      r3?.();
    } catch {
    }
    return p2(), true;
  }, h2 = (e3) => {
    if (e3.state !== `active`) return St(e3);
    if (!u2(e3.subject, e3.target)) return m2(e3, `target-inactive`, true), St(e3);
    let t3 = false;
    try {
      t3 = e3.adapter.contains(e3.target, e3.nativeLayer) === true;
    } catch {
    }
    return t3 ? f2(e3) || (m2(e3, `adapter-unreadable`, true), St(e3)) : (m2(e3, `expired`, false), St(e3));
  }, g2 = (e3 = `runtime-disposed`) => {
    if (s2) return false;
    s2 = true;
    try {
      for (let t3 of [...i2]) m2(t3, e3, true);
    } finally {
      s2 = false;
      let e4 = a2;
      a2 = null;
      try {
        e4?.();
      } catch {
      }
      o2 = null;
    }
    return true;
  }, _2 = () => {
    for (let e3 of [...i2]) h2(e3);
  }, v2 = () => !c2() || i2.size === 0 ? false : (o2 ||= r2.onDispose(() => g2(`runtime-disposed`), `dispose owned status layers`), a2 ||= r2.setInterval(_2, 100, { label: `status layer retirement sweep` }), true);
  return Object.freeze({ getCapabilities(e3) {
    let r3 = n2(e3), i3 = l2() && !!r3 && u2(e3, r3), a3 = {};
    for (let e4 of t2.effects()) {
      let n3 = i3 ? t2.resolve(r3, e4) : null;
      a3[e4] = Object.freeze({ effect: e4, available: !!n3, adapter: n3?.id || null, sourceOwned: !!n3 });
    }
    return Object.freeze({ effects: Object.freeze(a3) });
  }, supports(e3, r3) {
    let i3 = n2(e3), a3 = yt(r3);
    return l2() && !!i3 && u2(e3, i3) && t2.resolve(i3, a3) != null;
  }, apply(e3, r3 = {}) {
    r3 = r3 && typeof r3 == `object` ? r3 : {};
    let a3 = n2(e3), o3 = yt(r3.effect), s3 = bt(r3.duration), f3 = (e4, t3 = {}) => {
      let n3 = Ct(o3, e4, t3);
      if (r3.required === true) throw Error(`status.layers.apply(${o3 || `unknown`}): ${n3.reason}`);
      return n3;
    };
    if (!c2() || !l2()) return f3(`runtime-unavailable`);
    if (!a3 || !o3) return f3(`invalid-descriptor`);
    if (!u2(e3, a3)) return f3(`entity-inactive`);
    if (s3 === null) return f3(`invalid-duration`);
    let p3 = t2.resolve(a3, o3);
    if (!p3) return f3(`adapter-unavailable`);
    let g3 = { ...r3, effect: o3, duration: s3 };
    if (typeof p3.validate == `function`) {
      let e4 = null;
      try {
        e4 = p3.validate(g3);
      } catch {
        e4 = `invalid-descriptor`;
      }
      if (e4) return f3(e4, { adapter: p3.id });
    }
    let _3, y2;
    try {
      _3 = p3.create(g3), y2 = p3.insert(a3, _3, g3);
    } catch (e4) {
      return f3(`layer-threw`, { adapter: p3.id, message: e4?.message || e4 });
    }
    let b2 = false;
    try {
      b2 = !!y2 && p3.contains(a3, y2) === true;
    } catch {
    }
    if (!b2) {
      try {
        y2 && p3.remove(a3, y2);
      } catch {
      }
      return f3(`layer-rejected`, { adapter: p3.id });
    }
    let x2 = { state: `active`, effect: o3, adapter: p3, subject: e3, target: a3, nativeLayer: y2, lastDetails: null, unsubscribeTerminal: null, handle: null };
    x2.handle = Object.freeze({ get effect() {
      return o3;
    }, get target() {
      return e3;
    }, isActive() {
      return h2(x2).active;
    }, getState() {
      return h2(x2);
    }, dispose() {
      let e4 = h2(x2);
      if (!e4.active) return Object.freeze({ ok: true, disposed: false, before: e4, after: e4, reason: e4.reason || `layer-inactive` });
      m2(x2, `disposed`, true);
      let t3 = St(x2);
      return Object.freeze({ ok: true, disposed: true, before: e4, after: t3, reason: null });
    } }), i2.add(x2);
    let ee2 = d2(e3);
    if (typeof ee2?.onTerminal == `function` && (x2.unsubscribeTerminal = ee2.onTerminal(() => m2(x2, `target-inactive`, true))), x2.state !== `active`) return f3(`entity-inactive`, { adapter: p3.id });
    try {
      v2();
    } catch (e4) {
      return m2(x2, `runtime-unavailable`, true), f3(`runtime-unavailable`, { adapter: p3.id, message: e4?.message || e4 });
    }
    let S2 = h2(x2);
    return S2.active ? Object.freeze({ ok: true, effect: o3, adapter: p3.id, layer: x2.handle, state: S2, reason: null, message: null }) : f3(S2.reason || `layer-rejected`, { adapter: p3.id });
  } });
}
function Et(e2, t2, n2) {
  let r2 = e2?.[t2];
  if (!Array.isArray(r2)) return false;
  let i2 = false;
  for (let e3 = r2.length - 1; e3 >= 0; e3--) r2[e3] === n2 && (r2.splice(e3, 1), i2 = true);
  return i2;
}
function Dt(e2) {
  try {
    if (typeof e2?.isValid == `function`) return e2.isValid() === true;
  } catch {
    return false;
  }
  return Number(e2?.DPS) > 0 && Number(e2?.duration) > 0;
}
function Ot(e2, t2, n2, r2) {
  let i2 = e2?.[t2];
  if (!Array.isArray(i2)) return null;
  let a2 = new Set(i2);
  try {
    r2();
  } catch (r3) {
    let i3 = Array.isArray(e2?.[t2]) ? e2[t2] : [];
    for (let r4 of i3) (r4 === n2 || !a2.has(r4)) && Et(e2, t2, r4);
    throw r3;
  }
  let o2 = (Array.isArray(e2?.[t2]) ? e2[t2] : []).filter((e3) => !a2.has(e3));
  if (o2.length === 1) return o2[0];
  for (let n3 of o2) Et(e2, t2, n3);
  return null;
}
function kt(e2) {
  let t2 = Dt(e2?.poison) || Array.isArray(e2?._poison_stacked) && e2._poison_stacked.some(Dt);
  for (let n2 of e2?.poisonfaceSlots || []) n2?._setDisplayIndex?.(t2 ? 0 : -1);
  e2?.shouldColor?.();
}
function At(e2 = {}) {
  let t2 = null, n2 = () => {
    if (typeof t2 == `function`) return t2;
    let n3 = e2.getModuleExport?.(`chunks:///_virtual/Zombie.ts`, `ZombiePoison`);
    return typeof n3 == `function` && (t2 = n3), t2;
  };
  return { id: `native.layer.poison`, effect: `poison`, supports(e3) {
    return typeof n2() == `function` && typeof e3?.pushPoisonStacked == `function` && Array.isArray(e3?._poison_stacked) && Array.isArray(e3?.poisonfaceSlots) && e3.poisonfaceSlots.every((e4) => typeof e4?._setDisplayIndex == `function`) && typeof e3?.shouldColor == `function`;
  }, validate(e3) {
    let t3 = Number(e3.damagePerSecond);
    return Number.isFinite(t3) && t3 > 0 && t3 <= 1e6 ? null : `invalid-damage-per-second`;
  }, create(e3) {
    let t3 = n2();
    if (typeof t3 != `function`) throw Error(`ZombiePoison constructor is unavailable`);
    let r2 = new t3(Number(e3.damagePerSecond), e3.duration);
    return r2.infective = false, r2;
  }, insert(e3, t3) {
    return Ot(e3, `_poison_stacked`, t3, () => e3.pushPoisonStacked(t3));
  }, contains: (e3, t3) => Array.isArray(e3?._poison_stacked) && e3._poison_stacked.includes(t3), read(e3, t3) {
    return { remaining: Math.max(0, Number(t3?.duration) || 0), details: { damagePerSecond: Math.max(0, Number(t3?.DPS) || 0) } };
  }, remove(e3, t3) {
    let n3 = Et(e3, `_poison_stacked`, t3);
    return n3 && kt(e3), n3;
  } };
}
function jt() {
  return { id: `native.layer.speed-multiplier`, effect: `speed-multiplier`, supports: (e2) => typeof e2?.pushSpeedStacked == `function` && Array.isArray(e2?._speed_stacked), validate(e2) {
    let t2 = Number(e2.multiplier);
    return Number.isFinite(t2) && t2 >= 0 && t2 <= 10 ? null : `invalid-multiplier`;
  }, create: (e2) => ({ SpeedMult: Number(e2.multiplier), Duration: e2.duration }), insert(e2, t2) {
    return Ot(e2, `_speed_stacked`, t2, () => e2.pushSpeedStacked(t2));
  }, contains: (e2, t2) => Array.isArray(e2?._speed_stacked) && e2._speed_stacked.includes(t2), read(e2, t2) {
    return { remaining: Math.max(0, Number(t2?.Duration) || 0), details: { multiplier: Math.max(0, Number(t2?.SpeedMult) || 0) } };
  }, remove: (e2, t2) => Et(e2, `_speed_stacked`, t2) };
}
function Mt(e2 = {}) {
  return [At(e2), jt()];
}
var Nt = new e(`projectile-impacts`), Pt = `chunks:///_virtual/commonShot.ts`, Ft = `chunks:///_virtual/Plant.ts`, It = `chunks:///_virtual/Tomb.ts`, Lt = Object.freeze([Object.freeze({ targetKind: `zombie`, methodName: `dealDamageToZombie` }), Object.freeze({ targetKind: `plant`, methodName: `dealDamageToPlant` })]), Rt = `dealSplashDamage`, zt = `detectEnemyNormal`, Bt = Object.freeze([`dealDamageToZombie`, `dealDamageToPlant`, Rt, zt]), Vt = Object.freeze([Object.freeze({ domain: `kongfu-boss-explode-bomb`, modulePath: `chunks:///_virtual/kongfuBossExplodeBomb.ts`, exportName: `kongfuBossExplodeBomb`, methods: Object.freeze([Object.freeze({ targetKind: `zombie`, methodName: `dealDamageToZombie`, impactKind: `splash` }), Object.freeze({ targetKind: `plant`, methodName: `dealDamageToPlant`, impactKind: `splash` })]) })]), Ht = Object.freeze([Object.freeze({ targetKind: `plant`, modulePath: Ft, exportName: `Plant`, methodName: `dealDamage`, impactKinds: [`splash`] }), Object.freeze({ targetKind: `tomb`, modulePath: It, exportName: `Tomb`, methodName: `dealDamage`, impactKinds: [`direct`, `splash`] })]);
function Ut(e2, t2 = {}) {
  return new Set((e2 == null ? [] : Array.isArray(e2) ? e2 : [e2]).map((e3) => String(e3 || ``).trim().toLowerCase()).map((e3) => t2[e3] || e3).filter(Boolean));
}
function Wt(e2) {
  return e2.getModuleExport?.(Pt, `commonShot`) || null;
}
function N(e2, t2) {
  return typeof e2?.prototype?.[t2] == `function`;
}
function Gt(e2, t2) {
  return typeof e2?.prototype?.[t2] == `function` && Object.prototype.hasOwnProperty.call(e2.prototype, t2);
}
function Kt(e2, t2) {
  return e2.getModuleExport?.(t2.modulePath, t2.exportName) || null;
}
function qt(e2, t2) {
  return e2.getModuleExport?.(t2.modulePath, t2.exportName) || null;
}
function Jt(e2) {
  return Vt.filter((t2) => {
    let n2 = qt(e2, t2);
    return t2.methods.some((e3) => Gt(n2, e3.methodName));
  }).map((e3) => e3.domain);
}
function Yt(e2, t2) {
  if (typeof e2 != `function` || e2 === t2 || !e2.prototype || !t2?.prototype) return false;
  try {
    return t2.prototype.isPrototypeOf(e2.prototype);
  } catch {
    return false;
  }
}
function Xt(e2, t2) {
  let n2 = null;
  try {
    n2 = e2.listModuleEntries?.() ?? null;
  } catch {
  }
  if (!Array.isArray(n2)) return Object.freeze({ available: false, complete: false, coverage: `unknown`, scannedModules: 0, discoveredOverrideClasses: 0, uncovered: Object.freeze([]) });
  let r2 = /* @__PURE__ */ new Map();
  for (let t3 of Vt) {
    let n3 = qt(e2, t3);
    if (typeof n3 != `function`) continue;
    let i3 = r2.get(n3) || /* @__PURE__ */ new Set();
    for (let e3 of t3.methods) i3.add(e3.methodName);
    r2.set(n3, i3);
  }
  let i2 = /* @__PURE__ */ new Set(), a2 = [], o2 = 0;
  for (let e3 of n2) {
    if (!Array.isArray(e3) || typeof e3[0] != `string` || !e3[1] || typeof e3[1] != `object`) continue;
    let [n3, s2] = e3;
    for (let [e4, c2] of Object.entries(s2)) {
      if (!Yt(c2, t2) || i2.has(c2)) continue;
      i2.add(c2);
      let s3 = Bt.filter((e5) => Gt(c2, e5));
      if (s3.length === 0) continue;
      o2 += 1;
      let l2 = r2.get(c2) || /* @__PURE__ */ new Set(), u2 = s3.filter((e5) => !l2.has(e5));
      u2.length !== 0 && a2.push(Object.freeze({ modulePath: n3, exportName: e4, className: String(c2.prototype?.__classname__ || c2.name || e4 || ``), methods: Object.freeze(u2) }));
    }
  }
  return a2.sort((e3, t3) => e3.modulePath.localeCompare(t3.modulePath) || e3.exportName.localeCompare(t3.exportName)), Object.freeze({ available: true, complete: a2.length === 0, coverage: a2.length === 0 ? `audited` : `partial`, scannedModules: n2.length, discoveredOverrideClasses: o2, uncovered: Object.freeze(a2) });
}
function Zt(e2, t2) {
  let n2 = {};
  for (let t3 of Lt) {
    let r3 = N(e2, t3.methodName);
    n2[t3.targetKind] = Object.freeze({ direct: r3, splash: t3.targetKind === `zombie` && r3 && N(e2, Rt), unclassified: t3.targetKind === `zombie` && r3 });
  }
  let r2 = Kt(t2, Ht[0]), i2 = Kt(t2, Ht[1]), a2 = N(e2, Rt);
  n2.plant = Object.freeze({ ...n2.plant, splash: a2 && typeof r2?.prototype?.dealDamage == `function` });
  let o2 = typeof i2?.prototype?.dealDamage == `function`;
  n2.tomb = Object.freeze({ direct: o2 && N(e2, zt) && a2, splash: o2 && a2, unclassified: false });
  for (let e3 of Vt) {
    let r3 = qt(t2, e3);
    for (let t3 of e3.methods) Gt(r3, t3.methodName) && (n2[t3.targetKind] = Object.freeze({ ...n2[t3.targetKind], [t3.impactKind]: true }));
  }
  return Object.freeze(n2);
}
function Qt(e2 = {}) {
  let t2 = () => {
    let t3 = Wt(e2), n2 = Zt(t3, e2), r2 = Xt(e2, t3), i2 = typeof e2.wrapMethod == `function` && typeof e2.wrapEntity == `function` && typeof e2.runtime?.track == `function` && Object.values(n2).some((e3) => e3.direct || e3.splash || e3.unclassified);
    return Object.freeze({ available: i2, adapter: i2 ? `native.common-shot` : null, sourceKinds: Object.freeze([`projectile`]), sourceDomains: Object.freeze([...N(t3, `dealDamageToZombie`) || N(t3, `dealDamageToPlant`) ? [`common-shot`] : [], ...Jt(e2)]), overrideAudit: r2, targetKinds: n2, reason: i2 ? null : `native-impact-observer-unavailable` });
  };
  return Object.freeze({ getCapabilities: t2, supports: (e3, n2 = `direct`) => {
    let r2 = String(e3 || ``).trim().toLowerCase().replace(/s$/, ``), i2 = String(n2 || `direct`).trim().toLowerCase();
    return t2().targetKinds?.[r2]?.[i2] === true;
  }, watch: (n2, r2 = {}) => {
    if (typeof n2 != `function`) throw Error(`impacts.watch() requires a listener`);
    r2 = r2 && typeof r2 == `object` ? r2 : {};
    let i2 = t2();
    if (!i2.available) throw Error(`impacts.watch(): ${i2.reason}`);
    let a2 = Wt(e2), o2 = Ut(r2.targetKind ?? r2.targetKinds, { plants: `plant`, zombies: `zombie`, tombs: `tomb` }), s2 = Ut(r2.impactKind ?? r2.impactKinds), c2 = Ut(r2.sourceType ?? r2.sourceTypes), l2 = typeof r2.filter == `function` ? r2.filter : null, u2 = [], d2 = [], f2 = et({ runtime: e2.runtime, signal: r2.signal, label: r2.label || `projectile impact watch`, onCancel() {
      for (let e3 of [...u2].reverse()) try {
        e3();
      } catch {
      }
      u2.length = 0;
    } });
    if (!f2.active) return f2.cancel;
    let p2 = (t3) => {
      try {
        let n3 = e2.wrapMethod(t3);
        if (typeof n3 != `function`) throw Error(`native Hook registration returned no cleanup`);
        u2.push(n3);
      } catch (e3) {
        throw f2.cancel(), e3;
      }
    }, m2 = (t3) => {
      if (!(!f2.active || e2.runtime?.isActive?.() === false)) try {
        let i3 = Promise.resolve().then(() => {
          if (!(!f2.active || e2.runtime?.isActive?.() === false)) return n2(t3);
        });
        e2.runtime.track(i3, { label: r2.label || `projectile impact listener` });
      } catch (e3) {
        Nt.error(e3);
      }
    }, h2 = (e3, t3, n3, r3 = {}) => {
      d2.push({ sourceRaw: e3, impactKind: t3, ...r3 });
      try {
        return n3();
      } finally {
        d2.pop();
      }
    }, g2 = (e3 = null) => {
      for (let t3 = d2.length - 1; t3 >= 0; t3--) {
        let n3 = d2[t3];
        if (!e3 || n3.sourceRaw === e3) return n3;
      }
      return null;
    }, _2 = (e3) => {
      try {
        (!l2 || l2(e3) !== false) && m2(e3);
      } catch (e4) {
        Nt.error(e4);
      }
    }, v2 = ({ sourceRaw: t3, targetRaw: n3, targetKind: r3, impactKind: i3, invoke: a3, acceptedFromValue: o3 = false, deferDispatch: l3 = false, onObserved: u3 = null }) => {
      if (s2.size > 0 && !s2.has(i3)) return a3();
      let d3 = null, f3 = null, p3 = null, m3 = null;
      try {
        if (d3 = e2.wrapEntity(t3, `projectile`), f3 = e2.wrapEntity(n3, r3), !d3 || !f3 || c2.size > 0 && !c2.has(String(d3.codename || ``).toLowerCase())) return a3();
        p3 = d3.snapshot(), m3 = f3.snapshot();
      } catch (e3) {
        return Nt.error(e3), a3();
      }
      let h3 = a3();
      try {
        let t4 = d3.snapshot(), n4 = f3.snapshot(), a4 = ee({ alive: m3.alive, health: m3.health }, { alive: n4.alive, health: n4.health }), s3 = Object.freeze({ type: `projectile-impact`, impactKind: i3, targetKind: r3, accepted: o3 ? h3 !== false : true, source: d3, target: f3, sourceBefore: p3, sourceSnapshot: t4, targetBefore: m3, targetAfter: n4, health: a4, sceneName: e2.getSceneName?.() ?? null, timestamp: Date.now() });
        typeof u3 == `function` && u3(s3), l3 || _2(s3);
      } catch (e3) {
        Nt.error(e3);
      }
      return h3;
    }, y2 = (e3, t3) => {
      if (!t3) return;
      let n3 = g2(e3);
      if (n3?.impactKind !== `direct` || !Array.isArray(n3.pendingTombImpacts)) return;
      let r3 = n3.pendingTombImpacts.findIndex((e4) => e4.targetRaw === t3);
      if (r3 < 0) return;
      let [i3] = n3.pendingTombImpacts.splice(r3, 1);
      _2(i3.event);
    }, b2 = o2.size === 0 || [...o2].some((e3) => i2.targetKinds?.[e3]?.splash), x2 = s2.size === 0 || s2.has(`splash`), S2 = (o2.size === 0 || o2.has(`tomb`)) && (s2.size === 0 || s2.has(`direct`)) && i2.targetKinds?.tomb?.direct === true, C2 = b2 && x2;
    (C2 || S2) && N(a2, Rt) && p2({ target: a2.prototype, methodName: Rt, priority: Number(r2.priority || 0), handler({ thisArg: e3, args: t3, callNext: n3 }) {
      return y2(e3, t3[1]), C2 ? h2(e3, `splash`, () => n3(...t3)) : n3(...t3);
    } }), S2 && p2({ target: a2.prototype, methodName: zt, priority: Number(r2.priority || 0), handler({ thisArg: e3, args: t3, callNext: n3 }) {
      return h2(e3, `direct`, () => n3(...t3), { pendingTombImpacts: [] });
    } });
    for (let e3 of Lt) {
      if (!N(a2, e3.methodName) || o2.size > 0 && !o2.has(e3.targetKind)) continue;
      let t3 = e3.targetKind === `zombie` ? [`direct`, `splash`, `unclassified`] : [`direct`];
      s2.size > 0 && !t3.some((e4) => s2.has(e4)) || p2({ target: a2.prototype, methodName: e3.methodName, priority: Number(r2.priority || 0), handler({ thisArg: t4, args: n3, callNext: r3 }) {
        let i3 = g2(t4)?.impactKind === `splash`;
        if (e3.targetKind === `plant` && i3) return r3(...n3);
        let a3 = i3 ? `splash` : e3.targetKind === `zombie` && n3[1] === false ? `unclassified` : `direct`;
        return v2({ sourceRaw: t4, targetRaw: n3[0], targetKind: e3.targetKind, impactKind: a3, invoke: () => r3(...n3), acceptedFromValue: e3.targetKind === `plant` });
      } });
    }
    for (let t3 of Vt) {
      let n3 = qt(e2, t3);
      for (let e3 of t3.methods) Gt(n3, e3.methodName) && (o2.size > 0 && !o2.has(e3.targetKind) || s2.size > 0 && !s2.has(e3.impactKind) || p2({ target: n3.prototype, methodName: e3.methodName, priority: Number(r2.priority || 0), handler({ thisArg: t4, args: n4, callNext: r3 }) {
        return v2({ sourceRaw: t4, targetRaw: n4[0], targetKind: e3.targetKind, impactKind: e3.impactKind, invoke: () => r3(...n4) });
      } }));
    }
    for (let t3 of Ht) {
      if (o2.size > 0 && !o2.has(t3.targetKind) || s2.size > 0 && !t3.impactKinds.some((e3) => s2.has(e3))) continue;
      let n3 = Kt(e2, t3);
      typeof n3?.prototype?.[t3.methodName] == `function` && p2({ target: n3.prototype, methodName: t3.methodName, priority: Number(r2.priority || 0), handler({ thisArg: e3, args: n4, callNext: r3 }) {
        let i3 = g2();
        return !i3 || !t3.impactKinds.includes(i3.impactKind) ? r3(...n4) : t3.targetKind === `tomb` && i3.impactKind === `direct` ? v2({ sourceRaw: i3.sourceRaw, targetRaw: e3, targetKind: t3.targetKind, impactKind: i3.impactKind, invoke: () => r3(...n4), deferDispatch: true, onObserved(t4) {
          i3.pendingTombImpacts.push({ targetRaw: e3, event: t4 });
        } }) : v2({ sourceRaw: i3.sourceRaw, targetRaw: e3, targetKind: t3.targetKind, impactKind: i3.impactKind, invoke: () => r3(...n4) });
      } });
    }
    if (u2.length === 0) throw f2.cancel(), Error(`impacts.watch(): no compatible native hit methods`);
    return f2.cancel;
  } });
}
function $t(e2 = `Operation aborted`) {
  try {
    return new DOMException(e2, `AbortError`);
  } catch {
    let t2 = Error(e2);
    return t2.name = `AbortError`, t2;
  }
}
function en(e2, { allowZero: t2 = true } = {}) {
  let n2 = Number(e2);
  if (!Number.isFinite(n2) || n2 < 0 || !t2 && n2 === 0) throw TypeError(`Game-clock delay must be a ${t2 ? `non-negative` : `positive`} finite number`);
  return n2;
}
function tn(e2) {
  if (e2 == null) return null;
  if (typeof e2 != `object` || typeof e2.aborted != `boolean` || typeof e2.addEventListener != `function` || typeof e2.removeEventListener != `function`) throw TypeError(`Game-clock signal must be an AbortSignal`);
  return e2;
}
function nn(e2, t2 = 0) {
  let n2 = Number(e2?.deltaSeconds ?? e2), r2 = Number(e2?.scale), i2 = Number(e2?.frame);
  return Object.freeze({ deltaSeconds: Number.isFinite(n2) && n2 > 0 ? n2 : 0, scale: Number.isFinite(r2) && r2 >= 0 ? r2 : null, paused: e2?.paused === true || n2 <= 0, frame: Number.isFinite(i2) ? Math.trunc(i2) : t2 });
}
function rn() {
  let e2 = l(), t2 = e2?.director, n2 = e2?.Director, r2 = Number(t2?.gameSpeed), i2 = !!t2?.on && !!t2?.off && !!n2?.EVENT_BEFORE_UPDATE && !!n2?.EVENT_AFTER_UPDATE;
  return Object.freeze({ available: i2, scale: Number.isFinite(r2) && r2 >= 0 ? r2 : null, paused: i2 && (t2?.isPaused?.() === true || r2 === 0) });
}
function an(e2) {
  let t2 = l(), n2 = t2?.director, r2 = t2?.Director;
  if (!n2?.on || !n2?.off || !r2?.EVENT_BEFORE_UPDATE || !r2?.EVENT_AFTER_UPDATE) throw Error(`Game clock is unavailable`);
  let i2 = 0, a2 = null, o2 = true, s2 = () => {
    let e3 = Number(t2?.game?.deltaTime), r3 = Number(n2.gameSpeed);
    a2 = Number.isFinite(r3) && r3 >= 0 ? r3 : null, i2 = Number.isFinite(e3) && e3 > 0 && a2 != null ? e3 * a2 : 0;
  }, c2 = () => {
    o2 && e2({ deltaSeconds: i2, scale: a2, paused: n2?.isPaused?.() === true || i2 <= 0, frame: n2?.getTotalFrames?.() ?? 0 });
  };
  return n2.on(r2.EVENT_BEFORE_UPDATE, s2), n2.on(r2.EVENT_AFTER_UPDATE, c2), () => o2 ? (o2 = false, n2.off(r2.EVENT_BEFORE_UPDATE, s2), n2.off(r2.EVENT_AFTER_UPDATE, c2), true) : false;
}
function on(e2 = {}) {
  let t2 = e2.runtime || null, n2 = typeof e2.subscribeGameTick == `function` ? e2.subscribeGameTick : an, r2 = typeof e2.getGameClockState == `function` ? e2.getGameClockState : rn, i2 = /* @__PURE__ */ new Set(), a2 = null, o2 = null, s2 = 0, c2 = (e3, n3) => typeof t2?.onDispose == `function` ? t2.onDispose(e3, n3) : typeof t2?.addCleanup == `function` ? t2.addCleanup(e3, n3) : null, l2 = () => {
    a2 || (a2 = n2((e3) => {
      let t3 = nn(e3, ++s2);
      if (!(t3.deltaSeconds <= 0)) for (let e4 of [...i2]) e4.onTick(t3);
    }), typeof a2 != `function` && (a2 = () => false), o2 = c2(p2, `dispose game clock`));
  }, u2 = () => {
    if (i2.size > 0 || !a2) return;
    let e3 = a2;
    a2 = null;
    let t3 = o2;
    o2 = null, t3?.(), e3();
  }, d2 = (e3, n3) => {
    t2?.assertActive?.(`game clock subscription`);
    let r3 = tn(n3);
    if (r3?.aborted) return () => false;
    i2.add(e3);
    try {
      l2();
    } catch (t3) {
      throw i2.delete(e3), t3;
    }
    let a3 = true, o3 = () => a3 ? (a3 = false, r3?.removeEventListener(`abort`, o3), i2.delete(e3), u2(), true) : false;
    return r3?.addEventListener(`abort`, o3, { once: true }), r3?.aborted && o3(), o3;
  }, f2 = (e3, n3, r3, i3) => {
    if (e3.pending) return false;
    let a3 = (t2?.guard?.(n3, { label: i3 }) || n3)(r3);
    return a3?.then && typeof a3.then == `function` && (e3.pending = true, a3.finally(() => {
      e3.pending = false;
    }).catch(() => {
    })), true;
  }, p2 = () => {
    for (let e3 of [...i2]) e3.cancel?.();
    i2.clear(), u2();
  }, m2 = { isAvailable() {
    try {
      return r2()?.available === true;
    } catch {
      return false;
    }
  }, getState() {
    let e3 = null;
    try {
      e3 = r2();
    } catch {
    }
    let t3 = e3?.scale == null ? NaN : Number(e3.scale), n3 = e3?.available === true;
    return Object.freeze({ available: n3, scale: Number.isFinite(t3) && t3 >= 0 ? t3 : null, paused: n3 && (e3?.paused === true || t3 === 0) });
  }, onTick(e3, t3 = {}) {
    if (typeof e3 != `function`) throw TypeError(`clock.onTick() requires a callback`);
    let n3 = String(t3?.label || `game clock tick`), r3 = { pending: false, onTick: (t4) => f2(r3, e3, t4, n3), cancel: null };
    return r3.cancel = d2(r3, t3?.signal), r3.cancel;
  }, setTimeout(e3, t3 = 0, n3 = {}) {
    if (typeof e3 != `function`) throw TypeError(`clock.setTimeout() requires a callback`);
    let r3 = en(t3), i3 = String(n3?.label || `game clock timeout`), a3 = { elapsed: 0, pending: false, cancel: null, onTick(t4) {
      a3.elapsed += t4.deltaSeconds, !(a3.elapsed < r3) && (a3.cancel(), f2(a3, e3, t4, i3));
    } };
    return a3.cancel = d2(a3, n3?.signal), a3.cancel;
  }, setInterval(e3, t3, n3 = {}) {
    if (typeof e3 != `function`) throw TypeError(`clock.setInterval() requires a callback`);
    let r3 = en(t3, { allowZero: false }), i3 = String(n3?.label || `game clock interval`), a3 = { elapsed: 0, pending: false, cancel: null, onTick(t4) {
      a3.elapsed += t4.deltaSeconds, !(a3.elapsed < r3 || a3.pending) && (a3.elapsed %= r3, f2(a3, e3, t4, i3));
    } };
    return a3.cancel = d2(a3, n3?.signal), a3.cancel;
  }, sleep(e3 = 0, n3 = {}) {
    let r3 = en(e3), i3 = n3?.signal, a3 = new Promise((e4, a4) => {
      let o3 = false, s3 = null, c3 = (e5, n4) => {
        o3 || (o3 = true, s3?.(), t2?.signal?.removeEventListener?.(`abort`, l3), i3?.removeEventListener?.(`abort`, l3), e5(n4));
      }, l3 = () => c3(a4, $t(`Game-clock sleep aborted`));
      s3 = m2.setTimeout(() => c3(e4), r3, { label: n3?.label || `game clock sleep` }), t2?.signal?.addEventListener?.(`abort`, l3, { once: true }), i3?.addEventListener?.(`abort`, l3, { once: true }), (t2?.signal?.aborted || i3?.aborted) && l3();
    });
    return t2?.track?.(a3, { label: n3?.label || `game clock sleep`, report: false }) || a3;
  } };
  return Object.freeze(m2);
}
var sn = Object.freeze([`plant`, `zombie`, `neutral`, `unknown`]), cn = Object.freeze([`identity`, `targeting`]), ln = Object.freeze({ plants: `plant`, zombies: `zombie` });
function P(e2) {
  let t2 = String(e2 || ``).trim().toLowerCase(), n2 = ln[t2] || t2;
  return sn.includes(n2) ? n2 : null;
}
function un(e2) {
  let t2 = String(e2 || ``).trim().toLowerCase();
  return cn.includes(t2) ? t2 : null;
}
function dn({ available: e2 = false, adapters: t2 = [], teams: n2 = [], reason: r2 = null } = {}) {
  return Object.freeze({ available: e2 === true, adapters: Object.freeze([...new Set(t2.map(String).filter(Boolean))]), teams: Object.freeze([...new Set(n2.map(P).filter(Boolean))]), reason: e2 === true ? null : String(r2 || `adapter-unavailable`) });
}
var fn = Object.freeze({ team: `unknown`, targetTeam: `unknown` }), pn = class {
  constructor() {
    this._adapters = /* @__PURE__ */ new Map();
  }
  register(e2) {
    let t2 = String(e2?.id || ``).trim();
    if (!t2 || typeof e2?.read != `function`) throw Error(`Team adapters require id and read()`);
    if (this._adapters.has(t2)) throw Error(`Team adapter '${t2}' is already registered`);
    let n2 = Object.freeze({ ...e2, id: t2, priority: Number.isFinite(Number(e2.priority)) ? Number(e2.priority) : 0, identityTeams: Object.freeze([...e2.identityTeams || []].map(P).filter((e3) => e3 && e3 !== `unknown`)), targetingTeams: Object.freeze([...e2.targetingTeams || []].map(P).filter((e3) => e3 && e3 !== `unknown`)) });
    if (n2.identityTeams.length === 0 && n2.targetingTeams.length === 0) throw Error(`Team adapter '${t2}' must declare identityTeams or targetingTeams`);
    return this._adapters.set(t2, n2), () => this._adapters.delete(t2);
  }
  list() {
    return [...this._adapters.values()].sort((e2, t2) => t2.priority - e2.priority || e2.id.localeCompare(t2.id));
  }
};
function mn(e2 = {}) {
  let t2 = e2.registry || new pn(), n2 = typeof e2.unwrap == `function` ? e2.unwrap : (e3) => e3, r2 = typeof e2.getKind == `function` ? e2.getKind : () => null, i2 = (e3, i3 = null) => {
    let a2 = n2(e3), o2 = String(i3 || r2(e3) || ``).trim().toLowerCase(), s2 = Object.freeze({ subject: e3, target: a2, kind: o2 }), c2 = { identity: [], targeting: [] }, l2 = { identity: [], targeting: [] }, u2 = { identity: [], targeting: [] };
    if (a2) for (let e4 of t2.list()) {
      let t3 = true;
      try {
        t3 = typeof e4.matches != `function` || e4.matches(a2, s2) === true;
      } catch {
        t3 = false;
      }
      if (!t3) continue;
      e4.identityTeams.length > 0 && l2.identity.push(e4), e4.targetingTeams.length > 0 && l2.targeting.push(e4);
      let n3 = null;
      try {
        n3 = e4.read(a2, s2) || null;
      } catch (t4) {
        e4.identityTeams.length > 0 && u2.identity.push({ adapter: e4, error: t4 }), e4.targetingTeams.length > 0 && u2.targeting.push({ adapter: e4, error: t4 });
        continue;
      }
      let r3 = P(n3?.team ?? n3?.identity), i4 = P(n3?.targetTeam ?? n3?.targeting);
      r3 && r3 !== `unknown` && e4.identityTeams.includes(r3) && c2.identity.push({ adapter: e4, team: r3 }), i4 && i4 !== `unknown` && e4.targetingTeams.includes(i4) && c2.targeting.push({ adapter: e4, team: i4 });
    }
    let d2 = (e4) => {
      let t3 = c2[e4], n3 = l2[e4], r3 = u2[e4], i4 = t3.map((e5) => e5.adapter.id), a3 = n3.flatMap((t4) => e4 === `identity` ? t4.identityTeams : t4.targetingTeams), o3 = [...new Set(t3.map((e5) => e5.team))];
      return o3.length > 1 ? { team: `unknown`, capability: dn({ adapters: i4, teams: a3, reason: `conflicting-team-evidence` }) } : o3.length === 1 ? { team: o3[0], capability: dn({ available: true, adapters: i4, teams: a3 }) } : { team: `unknown`, capability: dn({ adapters: n3.map((e5) => e5.id), teams: a3, reason: r3.length > 0 ? `adapter-read-failed` : n3.length > 0 ? `team-state-unavailable` : `adapter-unavailable` }) };
    }, f2 = d2(`identity`), p2 = d2(`targeting`);
    return Object.freeze({ state: Object.freeze({ team: f2.team, targetTeam: p2.team }), capabilities: Object.freeze({ identity: f2.capability, targeting: p2.capability }) });
  };
  return Object.freeze({ getState(e3, t3 = null) {
    return e3 ? i2(e3, t3).state : fn;
  }, getCapabilities(e3, t3 = null) {
    return i2(e3, t3).capabilities;
  }, supports(e3, t3, n3 = null) {
    let r3 = un(t3);
    return r3 ? i2(e3, n3).capabilities[r3].available : false;
  } });
}
var hn = `chunks:///_virtual/Character.ts`;
function gn(e2) {
  return e2.getModuleExport?.(hn, `CharacterType`) || null;
}
function _n(e2 = {}) {
  return [{ id: `native.entity.plant-identity`, priority: 100, identityTeams: [`plant`], matches: (e3, t2) => t2.kind === `plant`, read: () => ({ team: `plant` }) }, { id: `native.entity.zombie-hypnosis`, priority: 100, identityTeams: [`plant`, `zombie`], matches: (e3, t2) => t2.kind === `zombie`, read(e3) {
    return typeof e3?.hypnotized == `boolean` ? { team: e3.hypnotized ? `plant` : `zombie` } : null;
  } }, { id: `native.entity.tomb-hypnosis`, priority: 100, identityTeams: [`plant`, `zombie`], matches: (e3, t2) => t2.kind === `tomb`, read(e3) {
    return typeof e3?.hypnotized == `boolean` ? { team: e3.hypnotized ? `plant` : `zombie` } : null;
  } }, { id: `native.projectile.target-team`, priority: 100, targetingTeams: [`plant`, `zombie`], matches: (e3, t2) => t2.kind === `projectile`, read(t2) {
    if (!Number.isFinite(Number(t2?.enemyType))) return null;
    let n2 = gn(e2);
    return !Number.isFinite(n2?.plant) || !Number.isFinite(n2?.zombie) ? null : Number(t2.enemyType) === Number(n2.plant) ? { targetTeam: `plant` } : Number(t2.enemyType) === Number(n2.zombie) ? { targetTeam: `zombie` } : null;
  } }];
}
var vn = Object.freeze([`source`, `target`]), yn = Object.freeze([`add`, `multiply`, `clamp`, `block`]), bn = Object.freeze({ source: 0, target: 1 });
function xn(e2) {
  try {
    return String(e2 ?? ``).trim();
  } catch {
    return ``;
  }
}
function Sn(e2) {
  try {
    return Number(e2);
  } catch {
    return NaN;
  }
}
function Cn(e2) {
  return xn(e2).toLowerCase();
}
function wn(e2) {
  let t2 = Cn(e2 || `physical`);
  return { physicle: `physical`, electric: `electricity`, flame: `fire` }[t2] || t2 || `physical`;
}
function Tn(e2) {
  let t2 = Cn(e2);
  return { plants: `plant`, zombies: `zombie`, projectiles: `projectile`, resources: `resource`, armors: `armor`, tombs: `tomb`, dinosaurs: `dinosaur` }[t2] || t2;
}
function F(e2, t2 = Cn) {
  return Object.freeze([...new Set((e2 == null ? [] : Array.isArray(e2) ? e2 : [e2]).map(t2).filter(Boolean))].sort());
}
function En(e2) {
  return F(e2, (e3) => P(e3));
}
function Dn(e2 = {}) {
  let t2 = e2 && typeof e2 == `object` ? e2 : {};
  return Object.freeze({ damageTypes: F(t2.damageType ?? t2.damageTypes, wn), tagsAll: F(t2.tagsAll), tagsAny: F(t2.tagsAny), sourceKinds: F(t2.sourceKind ?? t2.sourceKinds, Tn), sourceCodenames: F(t2.sourceCodename ?? t2.sourceCodenames), sourceTeams: En(t2.sourceTeam ?? t2.sourceTeams), targetKinds: F(t2.targetKind ?? t2.targetKinds, Tn), targetCodenames: F(t2.targetCodename ?? t2.targetCodenames), targetTeams: En(t2.targetTeam ?? t2.targetTeams) });
}
function On(e2) {
  return !e2 || typeof e2 != `object` ? null : { key: e2.key ?? null, kind: Tn(e2.kind), codename: Cn(e2.codename), team: P(e2.team) || `unknown` };
}
function I(e2, t2) {
  return e2.length === 0 || e2.includes(t2);
}
function kn(e2, t2) {
  let n2 = e2.phase === `source` ? t2.source : t2.target;
  if (e2.subjectKey != null && n2?.key !== e2.subjectKey) return false;
  let r2 = e2.match;
  return !(!I(r2.damageTypes, t2.damageType) || r2.tagsAll.some((e3) => !t2.tags.includes(e3)) || r2.tagsAny.length > 0 && !r2.tagsAny.some((e3) => t2.tags.includes(e3)) || !I(r2.sourceKinds, t2.source?.kind || ``) || !I(r2.sourceCodenames, t2.source?.codename || ``) || !I(r2.sourceTeams, t2.source?.team || `unknown`) || !I(r2.targetKinds, t2.target?.kind || ``) || !I(r2.targetCodenames, t2.target?.codename || ``) || !I(r2.targetTeams, t2.target?.team || `unknown`));
}
function An(e2, t2 = {}) {
  if (!t2 || typeof t2 != `object`) throw Error(`combat.modifiers.add() requires a descriptor`);
  let n2 = xn(t2.id);
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/.test(n2)) throw Error(`Combat modifier id must be 1-128 characters using letters, numbers, dot, underscore, or hyphen`);
  let r2 = Cn(t2.phase);
  if (!vn.includes(r2)) throw Error(`Combat modifier phase must be 'source' or 'target'`);
  let i2 = Cn(t2.operation);
  if (!yn.includes(i2)) throw Error(`Unsupported combat modifier operation '${i2 || `unknown`}'`);
  let a2 = Sn(t2.priority ?? 0);
  if (!Number.isFinite(a2)) throw Error(`Combat modifier priority must be finite`);
  let o2 = null, s2 = null, c2 = null;
  if (i2 === `add`) {
    if (o2 = Sn(t2.value), !Number.isFinite(o2)) throw Error(`Combat modifier 'add' requires a finite value`);
  } else if (i2 === `multiply`) {
    if (o2 = Sn(t2.value), !Number.isFinite(o2) || o2 < 0) throw Error(`Combat modifier 'multiply' requires a finite non-negative value`);
  } else if (i2 === `clamp`) {
    if (s2 = t2.min == null ? null : Sn(t2.min), c2 = t2.max == null ? null : Sn(t2.max), s2 == null && c2 == null) throw Error(`Combat modifier 'clamp' requires min and/or max`);
    if (s2 != null && (!Number.isFinite(s2) || s2 < 0) || c2 != null && (!Number.isFinite(c2) || c2 < 0)) throw Error(`Combat modifier clamp bounds must be finite and non-negative`);
    if (s2 != null && c2 != null && s2 > c2) throw Error(`Combat modifier clamp min cannot exceed max`);
  }
  let l2 = i2 === `block` ? xn(t2.reason) || `blocked-by-modifier` : null, u2 = Dn(t2.match), d2 = Object.freeze({ id: n2, owner: e2, phase: r2, priority: a2, operation: i2, value: o2, min: s2, max: c2, reason: l2, subjectScoped: t2.subjectKey != null, match: u2 });
  return { id: n2, owner: e2, key: `${e2}:${n2}`, phase: r2, priority: a2, operation: i2, value: o2, min: s2, max: c2, reason: l2, subjectKey: t2.subjectKey ?? null, match: u2, metadata: d2 };
}
function jn(e2) {
  return Object.freeze({ ...e2.metadata, active: e2.state === `active`, state: e2.state, stateReason: e2.stateReason });
}
var Mn = class {
  constructor(e2 = {}) {
    this._records = /* @__PURE__ */ new Map(), this._listeners = /* @__PURE__ */ new Set(), this._onError = typeof e2.onError == `function` ? e2.onError : () => {
    };
  }
  register(e2, t2, n2) {
    let r2 = xn(e2);
    if (!r2) throw Error(`Combat modifier owner is required`);
    if (typeof t2?.onDispose != `function`) throw Error(`Combat modifiers require a managed mod runtime`);
    if (t2.signal?.aborted || typeof t2.isActive == `function` && t2.isActive() === false) throw Error(`Cannot add a combat modifier to an inactive runtime`);
    let i2 = An(r2, n2);
    if (this._records.has(i2.key)) throw Error(`Combat modifier '${i2.id}' is already registered by '${r2}'`);
    let a2 = new AbortController(), o2 = { ...i2, controller: a2, state: `active`, stateReason: null, unregisterScopeCleanup: null, handle: null }, s2 = (e3 = `disposed`, t3 = false) => {
      if (o2.state !== `active`) return false;
      if (o2.state = `disposed`, o2.stateReason = xn(e3) || `disposed`, this._records.delete(o2.key), !t3) {
        let e4 = o2.unregisterScopeCleanup;
        o2.unregisterScopeCleanup = null;
        try {
          e4?.();
        } catch {
        }
      }
      return a2.abort(Object.freeze({ type: `disposed`, reason: o2.stateReason })), true;
    };
    o2.handle = Object.freeze({ id: o2.id, owner: o2.owner, phase: o2.phase, signal: a2.signal, isActive: () => o2.state === `active`, snapshot: () => jn(o2), dispose: s2 }), this._records.set(o2.key, o2);
    try {
      o2.unregisterScopeCleanup = t2.onDispose(() => s2(`runtime-disposed`, true), `dispose combat modifier ${o2.id}`);
    } catch (e3) {
      throw s2(`registration-failed`, true), e3;
    }
    return o2.handle;
  }
  list() {
    return this._sortedRecords().map((e2) => e2.metadata);
  }
  _sortedRecords() {
    return [...this._records.values()].filter((e2) => e2.state === `active`).sort((e2, t2) => bn[e2.phase] - bn[t2.phase] || t2.priority - e2.priority || e2.owner.localeCompare(t2.owner) || e2.id.localeCompare(t2.id));
  }
  evaluate(e2 = {}) {
    let t2 = Sn(e2.requestedAmount ?? e2.amount), n2 = wn(e2.damageType), r2 = F(e2.tags), i2 = { requestedAmount: t2, amount: t2, damageType: n2, tags: r2, source: On(e2.source), target: On(e2.target) };
    if (!Number.isFinite(t2) || t2 <= 0) return Object.freeze({ ok: false, requestedAmount: t2, amount: t2, damageType: n2, tags: r2, blocked: false, reason: `invalid-amount`, applications: Object.freeze([]) });
    let a2 = [], o2 = false, s2 = null;
    for (let e3 of this._sortedRecords()) {
      if (!kn(e3, i2)) continue;
      let c2 = i2.amount, l2 = c2;
      if (e3.operation === `add` ? l2 += e3.value : e3.operation === `multiply` ? l2 *= e3.value : e3.operation === `clamp` ? (e3.min != null && (l2 = Math.max(e3.min, l2)), e3.max != null && (l2 = Math.min(e3.max, l2))) : e3.operation === `block` && (o2 = true, s2 = e3.reason), !Number.isFinite(l2)) return Object.freeze({ ok: false, requestedAmount: t2, amount: c2, damageType: n2, tags: r2, blocked: false, reason: `modifier-result-invalid`, applications: Object.freeze(a2) });
      if (i2.amount = Math.max(0, l2), a2.push(Object.freeze({ id: e3.id, owner: e3.owner, phase: e3.phase, operation: e3.operation, before: c2, after: i2.amount, blocked: o2, reason: o2 ? s2 : null })), o2) break;
      if (i2.amount <= 0) {
        o2 = true, s2 = `damage-reduced-to-zero`;
        break;
      }
    }
    return Object.freeze({ ok: true, requestedAmount: t2, amount: i2.amount, damageType: n2, tags: r2, blocked: o2, reason: s2, applications: Object.freeze(a2) });
  }
  subscribe(e2, t2) {
    if (typeof t2 != `function`) throw Error(`Combat damage listener must be a function`);
    let n2 = { owner: xn(e2), listener: t2, active: true };
    return this._listeners.add(n2), () => n2.active ? (n2.active = false, this._listeners.delete(n2), true) : false;
  }
  emit(e2) {
    let t2 = [...this._listeners].filter((e3) => e3.active).sort((e3, t3) => e3.owner.localeCompare(t3.owner));
    for (let n2 of t2) try {
      n2.listener(e2);
    } catch (e3) {
      this._onError(e3, { owner: n2.owner });
    }
  }
  getStatus() {
    return Object.freeze({ modifiers: Object.freeze(this.list()), listenerCount: this._listeners.size });
  }
  clear(e2 = `registry-cleared`) {
    for (let t2 of [...this._records.values()]) t2.handle.dispose(e2);
    this._listeners.clear();
  }
};
function Nn(e2 = {}) {
  return new Mn(e2);
}
var Pn = new Map(d.map((e2) => [e2.type, e2])), Fn = new Map(m.map((e2) => [e2.type, e2]));
new e(`worldmap-runtime`);
var In = new e(`combat-modifiers`), Ln = /* @__PURE__ */ new WeakMap(), Rn = { coin: `CoinCount`, gem: `GemCount`, sprout: `SproutCount` };
function L(e2) {
  return Ln.get(e2) || null;
}
function R(e2) {
  return L(e2)?.target || e2;
}
function zn(e2) {
  return L(e2)?.kind || null;
}
function Bn(e2) {
  let t2 = L(e2)?.managedState;
  return t2?.disposed === true || t2?.retired === true;
}
function Vn(e2) {
  let t2 = L(e2);
  return t2?.managedState || t2?.target || `entity:${e2?.id || `unknown`}`;
}
function z(e2) {
  if (e2 == null) return e2;
  try {
    return structuredClone(e2);
  } catch {
    return JSON.parse(JSON.stringify(e2));
  }
}
function B(e2, t2) {
  return z(t2);
}
function V(e2, t2) {
  let n2 = typeof e2?.getCurrentData == `function` ? e2.getCurrentData(t2) : c(t2)?.json ?? null;
  return n2 && e2?.reportDataRead?.(t2, n2), n2;
}
function H(e2, t2) {
  return typeof e2?.getOriginalData == `function` ? e2.getOriginalData(t2) : null;
}
function Hn(e2) {
  let t2 = Pn.get(e2);
  if (t2) return { type: e2, kind: `features`, category: Wn(e2), config: t2 };
  let n2 = Fn.get(e2);
  return n2 ? { type: e2, kind: `objects`, category: Wn(e2), config: n2 } : String(e2 || ``).toLowerCase() === `lang` ? { type: `lang`, kind: `lang`, category: `localization`, config: null } : { type: e2, kind: `unknown`, category: Wn(e2), config: null };
}
function Un(e2) {
  let t2 = Hn(e2);
  return Object.freeze({ type: t2.type, kind: t2.kind, category: t2.category });
}
function Wn(e2) {
  let t2 = String(e2 || ``);
  return /^Plant/.test(t2) ? `plants` : /^Zombie/.test(t2) ? `zombies` : /^Projectile/.test(t2) ? `projectiles` : /^Armor/.test(t2) ? `armors` : /^TileLiquid/.test(t2) ? `tileLiquids` : /^Tile/.test(t2) || /^Tiles/.test(t2) ? `tiles` : /^Tomb/.test(t2) ? `tombstones` : /^Dinosaur/.test(t2) ? `dinosaurs` : /^Lawn/.test(t2) || t2 === `BoardGridMaps` ? `lawns` : /^Upgrade/.test(t2) || t2 === `MintObtainRoute` ? `upgrades` : /^Worldmap/.test(t2) ? `worldMap` : /^Store/.test(t2) ? `store` : t2 === `LevelModules` ? `levelModules` : t2 === `NarrativeList` || t2 === `PropertySheets` ? `meta` : t2 === `lang` ? `localization` : `misc`;
}
function Gn(e2, t2, n2 = false) {
  let r2 = n2 ? H(e2, t2) : V(e2, t2);
  if (!r2) return [];
  let i2 = Pn.get(t2);
  return i2 ? p(i2, r2) : Array.isArray(r2?.objects) ? r2.objects.map((e3) => ({ id: String(e3?.aliases?.[0] ?? `?`), label: String(e3?.aliases?.[0] ?? `?`), aliases: Array.isArray(e3?.aliases) ? [...e3.aliases] : [] })) : [];
}
function Kn(e2, t2, n2, r2 = {}) {
  let i2 = r2.useOriginal === true ? H(e2, t2) : V(e2, t2);
  if (!i2) return null;
  let a2 = Pn.get(t2);
  return a2 ? B(e2, f(a2, i2, String(n2 || ``))?.entry ?? null) : Array.isArray(i2?.objects) ? B(e2, i2.objects.find((e3) => String(e3?.aliases?.[0]) === String(n2 || ``)) ?? null) : null;
}
function U(e2, t2, n2, r2 = {}) {
  if (typeof n2 != `function`) throw Error(`mutate() requires a mutator function`);
  let i2 = V(e2, t2);
  if (!i2) return null;
  e2?.beforeDataMutation?.(t2, i2);
  let a2 = n2(i2, { type: t2, current: i2, original: H(e2, t2), info: Hn(t2) });
  return a2 === void 0 ? i2 : a2;
}
function qn() {
  return a(`levelController`);
}
function Jn() {
  return n(`UIInGame`)?.component ?? null;
}
function Yn() {
  return r(`chunks:///_virtual/levelController.ts`, `LevelPlay`)?.component ?? null;
}
function Xn() {
  return n(`SunCount`)?.component ?? null;
}
function Zn() {
  return n(`PlantFoodCount`)?.component ?? null;
}
function W() {
  return t();
}
function Qn(e2, t2, r2 = () => {
}) {
  let i2 = (e3) => (e3 && (typeof e3 == `object` || typeof e3 == `function`) && r2(`unknown`), e3), a2 = String(t2 || Rn[e2] || ``), o2 = a2 ? n(a2) : null;
  if (o2?.component) return i2(o2.component._value ?? o2.component.value ?? 0);
  let s2 = W();
  if (s2?.currentPlayer && e2 in s2.currentPlayer) return i2(s2.currentPlayer[e2]);
  try {
    let t3 = localStorage.getItem(`PvZ2_PlayerProperties`), n2 = t3 ? JSON.parse(t3) : null;
    if (Array.isArray(n2) && n2[0] && e2 in n2[0]) return n2[0][e2];
  } catch {
  }
  return 0;
}
function $n(e2, t2, r2, i2 = () => {
}) {
  let a2 = String(r2 || Rn[e2] || ``), o2 = a2 ? n(a2) : null;
  if (o2?.component) return i2(`unknown`), o2.component.value = t2, i2(`changed`), t2;
  let s2 = W();
  if (s2?.currentPlayer) return i2(`unknown`), s2.currentPlayer[e2] = t2, s2.savePP?.(), typeof s2.savePP == `function` && i2(`changed`), t2;
  try {
    let n2 = localStorage.getItem(`PvZ2_PlayerProperties`), r3 = n2 ? JSON.parse(n2) : null;
    if (Array.isArray(r3) && r3[0]) {
      r3[0][e2] = t2;
      let n3 = JSON.stringify(r3);
      i2(`unknown`), localStorage.setItem(`PvZ2_PlayerProperties`, n3), i2(`changed`);
    }
  } catch {
  }
  return t2;
}
function er(e2, t2, n2, r2) {
  return $n(e2, Number(Qn(e2, n2) || 0) + Number(t2 || 0), n2, r2);
}
function G(e2) {
  return Array.isArray(e2) ? e2.filter(Boolean).map(String) : e2 == null ? [] : [String(e2)];
}
function tr(e2) {
  let t2 = G(e2);
  for (let e3 of t2) {
    let t3 = e3 === `Zombie` || e3 === `Armor` ? r(`chunks:///_virtual/${e3}.ts`, e3) : n(e3);
    if (t3) return { name: e3, cls: t3 };
  }
  return null;
}
function nr(e2, t2) {
  for (let n2 of G(t2)) if (typeof e2?.[n2] == `function`) return n2;
  return null;
}
var rr = `chunks:///_virtual/worldMapScene.ts`, ir = `chunks:///_virtual/WorldMap.ts`, ar = `chunks:///_virtual/EndlessZoneEntrance.ts`, or = `chunks:///_virtual/Plants.ts`, sr = `chunks:///_virtual/Trophies.ts`, cr = `chunks:///_virtual/LevelNodes.ts`, lr = `chunks:///_virtual/NodePools.ts`, ur = { 0: `level`, 1: `plant`, 2: `giftBox`, 3: `upgrade`, 4: `epicPortal` }, dr = { 0: `normal`, 1: `minigame`, 2: `gargantuar`, 3: `zomboss` };
function fr() {
  return r(rr, `worldMapScene`) || n(`worldMapScene`) || null;
}
function pr() {
  return fr()?.component || a(fr()) || a(`worldMapScene`) || null;
}
function mr() {
  return r(ir, `WorldMap`) || n(`WorldMap`) || null;
}
function hr() {
  return pr()?.currentWM ?? null;
}
function gr() {
  return r(ar, `EndlessZoneEntrance`) || n(`EndlessZoneEntrance`) || null;
}
function _r(e2) {
  let t2 = gr();
  if (!t2 || !e2?.islandNode) return null;
  try {
    return e2.islandNode.getComponentInChildren?.(t2) ?? null;
  } catch {
    return null;
  }
}
function vr() {
  return r(`chunks:///_virtual/PlayerProperties.ts`, `WorldMapSceneDisplayEnum`) ?? null;
}
function yr() {
  return r(ir, `islandDisplayEnum`) ?? null;
}
function br() {
  return r(cr, `levelNodeRes`) ?? null;
}
function xr() {
  return r(lr, `instantiatePooly`);
}
function Sr() {
  return r(or, `plants`) ?? null;
}
function Cr() {
  return r(sr, `UpgradeEnum`) ?? null;
}
function K(e2) {
  return String(e2 ?? ``).trim().toLowerCase();
}
function wr(e2, t2) {
  if (!e2) return null;
  if (typeof t2 == `string`) return Object.keys(e2).find((e3) => Number.isNaN(Number(e3)) && e3.toLowerCase() === t2.toLowerCase()) ?? null;
  let n2 = e2?.[t2];
  return typeof n2 == `string` ? n2 : null;
}
function Tr(e2, t2) {
  if (!e2 || t2 == null) return null;
  if (typeof t2 == `number` && Number.isFinite(t2)) return t2;
  let n2 = K(t2);
  for (let t3 of Object.keys(e2)) if (Number.isNaN(Number(t3)) && K(t3) === n2) {
    let n3 = e2[t3];
    return typeof n3 == `number` ? n3 : null;
  }
  return null;
}
function Er(e2, t2 = false) {
  let n2 = t2 ? H(e2, `WorldmapFeatures`) : V(e2, `WorldmapFeatures`);
  return Array.isArray(n2?.WORLDMAPS) ? n2.WORLDMAPS : [];
}
function Dr(e2, t2) {
  if (!Array.isArray(e2) || e2.length === 0) return -1;
  if (typeof t2 == `number` && Number.isInteger(t2) && t2 >= 0 && t2 < e2.length) return t2;
  let n2 = Tr(vr(), t2);
  if (n2 != null && e2[n2]) return n2;
  let r2 = K(t2);
  return r2 ? e2.findIndex((e3) => K(e3?.CODENAME) === r2) : -1;
}
function Or(e2, t2) {
  let n2 = Dr(e2, t2);
  return n2 >= 0 ? e2[n2] : null;
}
function kr(e2, t2, n2 = false) {
  let r2 = Er(e2, n2);
  if (!t2) return null;
  let i2 = t2.displayEnum;
  return Or(r2, i2) || Or(r2, t2?.MapProps?.CODENAME) || null;
}
function Ar(e2) {
  let t2 = e2?.islandDisplay;
  return ur[t2] ?? wr(yr(), t2) ?? `unknown`;
}
function jr(e2, t2 = 0) {
  if (e2?.__gpnCustomId) return String(e2.__gpnCustomId);
  let n2 = Ar(e2);
  if (n2 === `level` && Array.isArray(e2?.levelJsonsID) && e2.levelJsonsID.length > 0) return `level:${String(e2.levelJsonsID[0])}`;
  let r2 = _r(e2);
  return n2 === `level` && Array.isArray(r2?.levelsID) && r2.levelsID.length > 0 ? `level:${String(r2.levelsID[0])}` : n2 === `plant` && e2?.plantDisplayed != null ? `plant:${String(e2.plantDisplayed)}` : n2 === `upgrade` && e2?.upgradeDisplayed != null ? `upgrade:${String(e2.upgradeDisplayed)}` : n2 === `epicPortal` && Array.isArray(e2?.epicLevelJsonsID) && e2.epicLevelJsonsID.length > 0 ? `epic:${String(e2.epicLevelJsonsID[0])}` : n2 === `giftBox` ? `giftBox:${String(e2?.levelNodeName || t2)}` : `${n2}:${String(e2?.levelNodeName || t2)}`;
}
function Mr(e2) {
  let t2 = e2?.islandNode, n2 = t2?.worldPosition ?? null, r2 = t2?.position ?? null;
  return { x: Number(r2?.x ?? 0), y: Number(r2?.y ?? 0), z: Number(r2?.z ?? 0), worldX: Number(n2?.x ?? 0), worldY: Number(n2?.y ?? 0), worldZ: Number(n2?.z ?? 0) };
}
function Nr(e2) {
  return dr[e2?.levelNodeAppearance] ?? `normal`;
}
function Pr(e2) {
  let t2 = (Array.isArray(e2?.levelIslands) ? e2.levelIslands : []).map((e3, t3) => {
    let n3 = _r(e3);
    return { id: jr(e3, t3), index: t3, type: Ar(e3), appearance: Ar(e3) === `level` ? Nr(e3) : null, customId: e3?.__gpnCustomId ? String(e3.__gpnCustomId) : null, levelIds: Array.isArray(e3?.levelJsonsID) ? [...e3.levelJsonsID] : [], endlessLevelIds: Array.isArray(n3?.levelsID) ? [...n3.levelsID] : [], epicLevelIds: Array.isArray(e3?.epicLevelJsonsID) ? [...e3.epicLevelJsonsID] : [], plantDisplayed: e3?.plantDisplayed ?? null, upgradeDisplayed: e3?.upgradeDisplayed ?? null, levelNodeName: e3?.levelNodeName ?? ``, affectsMaxX: e3?.affectsMaxX !== false, rawDisplayEnum: e3?.islandDisplay ?? null, unlocked: e3?._unlocked === true, finished: e3?._finished === true, willPush: e3?._willPush === true, position: Mr(e3), raw: e3, islandNode: e3?.islandNode ?? null, nextIds: [] };
  }), n2 = new Map(t2.map((e3) => [e3.islandNode, e3.id]));
  for (let e3 of t2) {
    let t3 = e3.raw, r2 = [];
    t3?.nextIsland && r2.push(t3.nextIsland), Array.isArray(t3?.otherNextIslands) && r2.push(...t3.otherNextIslands), e3.nextIds = r2.map((e4) => n2.get(e4)).filter(Boolean);
  }
  return t2;
}
function Fr(e2, t2) {
  if (!e2 || t2 == null) return false;
  if (t2 === e2.raw || t2 === e2.islandNode) return true;
  if (typeof t2 == `function`) return t2(e2) === true;
  if (typeof t2 == `string`) {
    let n3 = K(t2);
    return K(e2.id) === n3 || K(e2.levelNodeName) === n3 || e2.levelIds.some((e3) => K(e3) === n3) || Array.isArray(e2.endlessLevelIds) && e2.endlessLevelIds.some((e3) => K(e3) === n3) || e2.epicLevelIds.some((e3) => K(e3) === n3);
  }
  if (typeof t2 == `number`) return e2.index === t2;
  if (typeof t2 != `object`) return false;
  if (t2.id != null) {
    let n3 = K(t2.id), r2 = K(e2.id) === n3, i2 = K(e2.customId) === n3;
    if (!r2 && !i2) return false;
  }
  if (t2.customId != null) {
    let n3 = K(t2.customId), r2 = K(e2.customId) === n3, i2 = K(e2.id) === n3;
    if (!r2 && !i2) return false;
  }
  if (t2.index != null && Number(t2.index) !== e2.index || t2.type != null && String(t2.type) !== e2.type || t2.appearance != null && String(t2.appearance) !== String(e2.appearance)) return false;
  let n2 = [...e2.levelIds, ...Array.isArray(e2.endlessLevelIds) ? e2.endlessLevelIds : []];
  if (t2.levelId != null && !n2.some((e3) => K(e3) === K(t2.levelId))) return false;
  if (t2.levelIds != null) {
    let e3 = Array.isArray(t2.levelIds) ? t2.levelIds : [t2.levelIds], r2 = new Set(n2.map(K));
    for (let t3 of e3.map(K)) if (!r2.has(t3)) return false;
  }
  if (t2.portalLevelId != null && !e2.epicLevelIds.some((e3) => K(e3) === K(t2.portalLevelId))) return false;
  if (t2.portalLevelIds != null) {
    let n3 = Array.isArray(t2.portalLevelIds) ? t2.portalLevelIds : [t2.portalLevelIds], r2 = new Set(e2.epicLevelIds.map(K));
    for (let e3 of n3.map(K)) if (!r2.has(e3)) return false;
  }
  return !(t2.plantDisplayed != null && String(t2.plantDisplayed) !== String(e2.plantDisplayed) || t2.upgradeDisplayed != null && String(t2.upgradeDisplayed) !== String(e2.upgradeDisplayed) || t2.levelNodeName != null && K(t2.levelNodeName) !== K(e2.levelNodeName) || typeof t2.predicate == `function` && t2.predicate(e2) !== true);
}
function q(e2, t2) {
  return Pr(e2).find((e3) => Fr(e3, t2)) ?? null;
}
function Ir(e2, t2 = {}) {
  let n2 = Pr(e2);
  if (!n2.length) return null;
  let r2 = String(t2?.type || ``).trim(), i2 = r2 === `level` ? String(t2?.appearance || ``).trim() : ``, a2 = n2.filter((e3) => e3?.type === r2);
  if (!a2.length) return null;
  let o2 = r2 === `level` && i2 ? a2.filter((e3) => String(e3?.appearance || ``).trim() === i2) : a2, s2 = o2.length ? o2 : a2, c2 = (e3) => n2.some((t3) => (Array.isArray(t3?.nextIds) ? t3.nextIds : []).includes(e3.id));
  if (r2 === `level`) {
    let e3 = s2.filter((e4) => c2(e4));
    if (e3.length) return e3[0]?.raw ?? null;
  }
  return s2[0]?.raw ?? null;
}
function Lr(e2) {
  let t2 = [];
  return e2 ? (e2.nextIsland && t2.push(e2.nextIsland), Array.isArray(e2.otherNextIslands) && t2.push(...e2.otherNextIslands), t2.filter(Boolean)) : t2;
}
function Rr(e2) {
  if (!e2 || !Array.isArray(e2.levelIslands)) return;
  let t2 = 0, n2 = 0;
  for (let r2 of e2.levelIslands) {
    if (!r2?.affectsMaxX) continue;
    let e3 = Number(r2?.islandNode?.position?.x ?? 0);
    e3 < t2 && (t2 = e3), e3 > n2 && (n2 = e3);
  }
  e2.minMapX = t2, e2.maxMapX = n2;
}
function zr(e2 = {}) {
  return e2?.skipRefresh !== true && e2?.refresh !== false;
}
function J(e2) {
  if (!e2?.levelPathLayer) return;
  let t2 = l(), n2 = xr() || ((e3) => t2?.instantiate?.(e3)), r2 = br();
  if (typeof n2 != `function` || typeof r2?.path != `function`) return;
  for (let t3 of e2.levelIslands || []) {
    for (let e3 of t3?._pathDBs || []) try {
      e3?.node?.parent?.destroy?.();
    } catch {
    }
    t3._pathDBs = [];
  }
  let i2 = t2?.Vec2, a2 = t2?.Vec3;
  for (let o2 of e2.levelIslands || []) {
    let s2 = o2?.islandNode?.worldPosition;
    if (!s2) continue;
    let c2 = [];
    for (let l2 of Lr(o2)) {
      let o3 = l2?.worldPosition;
      if (!o3) continue;
      let u2 = n2(r2.path());
      if (!u2) continue;
      u2.parent = e2.levelPathLayer, a2 && (u2.worldPosition = new a2(s2.x, s2.y, s2.z || 0));
      let d2 = Number(o3.x || 0) - Number(s2.x || 0), f2 = Number(o3.y || 0) - Number(s2.y || 0), p2 = i2 ? new i2(d2, f2).length() : Math.sqrt(d2 * d2 + f2 * f2), m2 = 90 * Math.atan2(f2, d2) / (t2?.HALF_PI || Math.PI / 2);
      u2.worldScale &&= new a2(p2 / 330, u2.worldScale.y, 1), u2.angle = m2;
      let h2 = t2?.dragonBones?.ArmatureDisplay, g2 = u2.getChildByName?.(`display`), _2 = typeof h2 == `function` ? g2?.getComponent?.(h2) : null;
      _2 && c2.push(_2);
    }
    o2._pathDBs = c2;
    for (let e3 of c2) try {
      e3.playAnimation(o2?._finished ? `Idle` : `Idle_Thin`, 1 / 0);
    } catch {
    }
  }
}
function Br(e2, t2 = {}) {
  let n2 = l()?.Vec3, r2 = e2?.islandNode;
  if (!r2 || !n2) return null;
  let i2 = new n2(t2.x ?? r2.position.x, t2.y ?? r2.position.y, t2.z ?? r2.position.z ?? 0), a2 = r2.worldPosition?.clone?.() ?? null;
  r2.position = i2;
  let o2 = r2.worldPosition?.clone?.() ?? null, s2 = (e3) => {
    if (!e3 || !a2 || !o2) return;
    let t3 = Number(e3.worldPosition?.x ?? 0) - Number(a2.x || 0), r3 = Number(e3.worldPosition?.y ?? 0) - Number(a2.y || 0);
    e3.worldPosition = new n2(Number(o2.x || 0) + t3, Number(o2.y || 0) + r3, Number(o2.z || 0));
  };
  return s2(e2?._levelNode), s2(e2?._plantOnDisplay), s2(e2?._upgradeOnDisplay?.node), s2(e2?._epicPortalDB?.node?.parent), s2(e2?._giftbox?.node), s2(e2?.zombossHead?.node?.parent), i2;
}
function Vr(e2) {
  if (!e2) return null;
  let t2 = l();
  try {
    return t2?.instantiate?.(e2) ?? e2.clone?.() ?? null;
  } catch {
    return null;
  }
}
function Hr(e2, t2) {
  if (!e2 || !t2) return null;
  let n2 = e2?.constructor;
  if (typeof n2 != `function`) return null;
  try {
    return t2.getComponent?.(n2) ?? null;
  } catch {
    return null;
  }
}
function Ur(e2) {
  let t2 = Vr(e2);
  return t2 && e2?.parent && (t2.parent = e2.parent), t2;
}
function Wr(e2, t2) {
  if (!Array.isArray(e2) || !e2.length || !t2) return [];
  let n2 = e2.find((e3) => e3?.constructor)?.constructor;
  if (typeof n2 != `function`) return [];
  try {
    let e3 = t2.getComponentsInChildren?.(n2) ?? [];
    return Array.isArray(e3) ? e3 : [];
  } catch {
    return [];
  }
}
function Gr(e2, t2) {
  if (!e2 || !t2) return null;
  let n2 = e2?.constructor;
  if (typeof n2 != `function`) return null;
  try {
    let e3 = t2.getComponentsInChildren?.(n2) ?? [];
    return Array.isArray(e3) ? e3[0] ?? null : null;
  } catch {
    return null;
  }
}
function Kr(e2, t2 = {}) {
  let n2 = t2?.template == null ? Ir(e2, t2) : q(e2, t2.template)?.raw ?? null;
  if (!n2) return null;
  let r2 = null;
  try {
    r2 = typeof n2?.constructor == `function` ? new n2.constructor() : Object.create(Object.getPrototypeOf(n2) || Object.prototype);
  } catch {
    r2 = Object.create(Object.getPrototypeOf(n2) || Object.prototype);
  }
  r2.islandDisplay = n2?.islandDisplay, r2.upgradeDisplayed = n2?.upgradeDisplayed, r2.plantDisplayed = n2?.plantDisplayed, r2.levelNodeAppearance = n2?.levelNodeAppearance, r2.zombossHeadPFB = n2?.zombossHeadPFB ?? null, r2.affectsMaxX = n2?.affectsMaxX !== false, r2.levelNodeName = typeof n2?.levelNodeName == `string` ? n2.levelNodeName : ``, r2._inWorldMap = e2, r2.__gpnTemplateRaw = n2, r2._islandRank = Number.isFinite(n2?._islandRank) ? n2._islandRank : 0, r2.__gpnCustomId = t2.customId ? String(t2.customId) : null, r2.levelJsonsID = Array.isArray(n2?.levelJsonsID) ? [...n2.levelJsonsID] : [], r2.epicLevelJsonsID = Array.isArray(n2?.epicLevelJsonsID) ? [...n2.epicLevelJsonsID] : [], r2.otherNextIslands = [], r2.nextIsland = null, r2.displayedIslandDBs = [], r2._pathDBs = [], r2._levelNodeDB = null, r2._epicPortalDB = null, r2._giftbox = null, r2._finished = false, r2._unlocked = false, r2._willPush = false, r2._plantIcon = null, r2._commodity = n2?._commodity?.constructor ? new n2._commodity.constructor() : n2?._commodity ?? null, r2.islandNode = Ur(n2?.islandNode), r2._levelNode = Ur(n2?._levelNode), r2._plantOnDisplay = Ur(n2?._plantOnDisplay);
  let i2 = Ur(n2?._upgradeOnDisplay?.node);
  r2._upgradeOnDisplay = Hr(n2?._upgradeOnDisplay, i2);
  let a2 = Ur(n2?.zombossHead?.node?.parent);
  return r2.zombossHead = Gr(n2?.zombossHead, a2), r2.displayedIslandDBs = Wr(n2?.displayedIslandDBs, r2.islandNode), e2.levelIslands.push(r2), r2;
}
function Y(e2) {
  try {
    e2?.destroy?.();
  } catch {
  }
}
function qr(e2, t2, n2) {
  let r2 = String(t2 || ``).trim(), i2 = String(n2 || ``).trim();
  r2 === `level` ? i2 !== `zomboss` && (Y(e2?.zombossHead?.node?.parent), e2.zombossHead = null) : (Y(e2?._levelNode), e2._levelNode = null, e2._levelNodeDB = null, Y(e2?.zombossHead?.node?.parent), e2.zombossHead = null), r2 !== `plant` && (Y(e2?._plantOnDisplay), e2._plantOnDisplay = null), r2 !== `upgrade` && (Y(e2?._upgradeOnDisplay?.node), e2._upgradeOnDisplay = null), r2 !== `epicPortal` && (Y(e2?._epicPortalDB?.node?.parent), e2._epicPortalDB = null), r2 !== `giftBox` && (Y(e2?._giftbox?.node), e2._giftbox = null);
}
function Jr(e2, t2) {
  switch (String(t2 || ``).trim()) {
    case `level`:
      return !!e2?._levelNode;
    case `plant`:
      return !!e2?._plantOnDisplay;
    case `upgrade`:
      return !!e2?._upgradeOnDisplay;
    case `epicPortal`:
      return !!e2?._epicPortalDB;
    case `giftBox`:
      return !!e2?._giftbox;
    default:
      return false;
  }
}
function Yr(e2, t2, n2) {
  if (!e2 || !t2) return false;
  let r2 = l(), i2 = br(), a2 = xr() || ((e3) => r2?.instantiate?.(e3)), o2 = e2.levelNodeLayer, s2 = t2?.islandNode?.worldPosition, c2 = r2?.Vec3, u2 = r2?.dragonBones?.ArmatureDisplay, d2 = t2?.__gpnTemplateRaw ?? null;
  if (!o2 || typeof a2 != `function`) return false;
  let f2 = (e3) => {
    if (!e3) return null;
    try {
      return a2(e3) ?? null;
    } catch {
    }
    try {
      return r2?.instantiate?.(e3) ?? null;
    } catch {
      return null;
    }
  }, p2 = (e3) => {
    if (!e3) return false;
    if (e3.parent = o2, c2) {
      let n3 = t2?.islandNode?.position ?? null;
      e3.worldPosition = new c2(Number(s2?.x ?? n3?.x ?? 0), Number(s2?.y ?? n3?.y ?? 0), Number(s2?.z ?? n3?.z ?? 0)), e3.scale = new c2(0.4, 0.4, 1);
    }
    return true;
  }, m2 = (e3) => {
    if (!e3) return null;
    let t3 = [e3];
    for (; t3.length; ) {
      let e4 = t3.shift();
      if (!e4) continue;
      let n3 = (Array.isArray(e4?._components) ? e4._components : Array.isArray(e4?.components) ? e4.components : []).find((e5) => typeof e5?.playAnimation == `function` && e5?.node);
      if (n3) return n3;
      let r3 = Array.isArray(e4?.children) ? e4.children : [];
      t3.push(...r3);
    }
    return null;
  }, h2 = (e3, t3 = null) => {
    if (!e3) return null;
    let n3 = t3 ? e3.getChildByName?.(t3) : null;
    return (typeof u2 == `function` ? n3?.getComponent?.(u2) ?? e3.getComponent?.(u2) ?? e3.getComponentInChildren?.(u2) : null) ?? m2(n3) ?? m2(e3) ?? null;
  }, g2 = (e3, t3, n3 = null, r3) => {
    let i3 = (t4) => t4 ? e3 ? Hr(e3, t4) ?? Gr(e3, t4) ?? null : h2(t4, n3) : null, a3 = (e4, t4 = null) => {
      if (!e4 || !p2(e4)) return false;
      let n4 = t4 ?? i3(e4);
      return n4 ? (r3(n4), true) : false;
    };
    return a3(Ur(t3)) ? true : a3(t3, e3 ?? null);
  };
  if (String(n2 || ``).trim() === `epicPortal`) {
    if (g2(d2?._epicPortalDB ?? null, d2?._epicPortalDB?.node?.parent ?? null, `display`, (e4) => {
      t2._epicPortalDB = e4;
    })) return true;
    if (typeof i2?.epicPortal != `function`) return false;
    let e3 = f2(i2.epicPortal());
    return !e3 || !p2(e3) ? false : (t2._epicPortalDB = h2(e3, `display`), !!t2._epicPortalDB);
  }
  if (String(n2 || ``).trim() === `giftBox`) {
    if (g2(d2?._giftbox ?? null, d2?._giftbox?.node ?? null, null, (e4) => {
      t2._giftbox = e4;
    })) return true;
    if (typeof i2?.giftbox != `function`) return false;
    let e3 = f2(i2.giftbox());
    return !e3 || !p2(e3) ? false : (t2._giftbox = h2(e3), !!t2._giftbox);
  }
  return false;
}
function Xr(e2, t2) {
  if (!e2 || !t2) return false;
  let n2 = (Ir(e2, { type: `level`, appearance: `normal` }) || Ir(e2, { type: `level` }))?.raw ?? null;
  return n2 ? (Y(t2?.islandNode), t2.islandNode = Ur(n2?.islandNode), t2.displayedIslandDBs = t2.islandNode ? Wr(n2?.displayedIslandDBs, t2.islandNode) : [], !!t2.islandNode) : false;
}
function Zr(e2) {
  return e2 && (e2._giftbox && !e2?._giftbox?.node && (e2._giftbox = null), e2._epicPortalDB && !e2?._epicPortalDB?.node && (e2._epicPortalDB = null), Array.isArray(e2.displayedIslandDBs) && (e2.displayedIslandDBs = e2.displayedIslandDBs.filter((e3) => e3?.node)), Array.isArray(e2._pathDBs) && (e2._pathDBs = e2._pathDBs.filter((e3) => e3?.node)), e2);
}
function Qr(e2) {
  if (!e2) return false;
  let t2 = (e3) => {
    try {
      e3?.destroy?.();
    } catch {
    }
  };
  t2(e2?.islandNode), t2(e2?._levelNode), t2(e2?._plantOnDisplay), t2(e2?._upgradeOnDisplay?.node), t2(e2?._epicPortalDB?.node?.parent), t2(e2?._giftbox?.node), t2(e2?.zombossHead?.node?.parent);
  for (let n2 of e2?._pathDBs || []) t2(n2?.node?.parent);
  return e2._pathDBs = [], true;
}
function $r(e2, t2) {
  if (!e2 || !t2) return null;
  let n2 = e2;
  for (; n2?.parent && n2.parent !== t2; ) n2 = n2.parent;
  return n2?.parent === t2 ? n2 : null;
}
function ei(e2) {
  let t2 = /* @__PURE__ */ new Map(), n2 = (e3, n3) => {
    if (!e3 || !n3) return;
    let r2 = $r(n3, e3);
    if (!r2) return;
    let i2 = t2.get(e3);
    i2 || (i2 = /* @__PURE__ */ new Set(), t2.set(e3, i2)), i2.add(r2);
  };
  for (let t3 of e2?.levelIslands || []) {
    n2(t3?.islandNode?.parent ?? null, t3?.islandNode), n2(e2?.levelNodeLayer, t3?._levelNode), n2(e2?.levelNodeLayer, t3?._plantOnDisplay), n2(e2?.levelNodeLayer, t3?._upgradeOnDisplay?.node), n2(e2?.levelNodeLayer, t3?._epicPortalDB?.node?.parent), n2(e2?.levelNodeLayer, t3?._giftbox?.node), n2(e2?.levelNodeLayer, t3?.zombossHead?.node?.parent);
    for (let r2 of t3?._pathDBs || []) n2(e2?.levelPathLayer, r2?.node?.parent);
  }
  return t2;
}
function ti(e2) {
  if (!e2) return false;
  let t2 = ei(e2), n2 = false;
  for (let [e3, r2] of t2.entries()) {
    let t3 = Array.isArray(e3?.children) ? [...e3.children] : [];
    for (let e4 of t3) if (!r2.has(e4)) try {
      e4?.destroy?.(), n2 = true;
    } catch {
    }
  }
  return n2;
}
function ni(e2, t2, n2 = 100) {
  let r2 = t2?.islandNode, i2 = r2?.position;
  if (!r2 || !i2 || !Array.isArray(e2?.levelIslands)) return null;
  for (let r3 of e2.levelIslands) {
    if (!r3?.islandNode || r3 === t2) continue;
    let e3 = Number(r3.islandNode.position?.x ?? 0) - Number(i2.x ?? 0), a2 = Number(r3.islandNode.position?.y ?? 0) - Number(i2.y ?? 0);
    if (Math.sqrt(e3 * e3 + a2 * a2) < n2) return jr(r3);
  }
  return null;
}
function ri(e2) {
  if (typeof e2 == `number` && Number.isFinite(e2)) return e2;
  let t2 = Sr();
  if (!t2 || e2 == null) return null;
  try {
    let n2 = t2.getPlantEnumByCodename?.(String(e2));
    if (typeof n2 == `number`) return n2;
  } catch {
  }
  try {
    return t2.getPlantEnumWithPropByPlantTypes?.(String(e2))?.id ?? null;
  } catch {
    return null;
  }
}
function ii(e2) {
  let t2 = Cr();
  return t2 ? Tr(t2, e2) : typeof e2 == `number` ? e2 : null;
}
function ai(e2, t2) {
  let n2 = ri(t2);
  if (n2 == null || !e2) return null;
  e2.plantDisplayed = n2;
  let r2 = W()?.getPlantProgressByID?.(n2)?.progress ?? 0;
  try {
    e2.showPlant?.(r2 <= 0);
  } catch {
  }
  return n2;
}
function oi(e2) {
  let t2 = yr();
  if (t2) {
    let n2 = Tr(t2, e2);
    if (n2 != null) return n2;
  }
  return { level: 0, plant: 1, giftBox: 2, upgrade: 3, epicPortal: 4 }[String(e2 || ``)] ?? null;
}
function si(e2) {
  return typeof e2 == `number` && Number.isFinite(e2) ? e2 : { normal: 0, minigame: 1, gargantuar: 2, zomboss: 3 }[String(e2 || ``).trim()] ?? null;
}
function ci(e2, t2) {
  let n2 = ii(t2);
  if (n2 == null || !e2) return null;
  e2.upgradeDisplayed = n2;
  let r2 = (W()?.getUpgradeProgressByID?.(n2)?.progress ?? 0) > 0;
  try {
    e2._upgradeOnDisplay?.readID?.(n2, r2);
  } catch {
  }
  return n2;
}
function li(e2, t2) {
  if (!e2) return null;
  for (let n2 of G(t2)) if (typeof e2?.[n2] == `function`) return { target: e2, methodName: n2, method: e2[n2] };
  return null;
}
function ui(e2, t2, n2 = [], r2 = {}) {
  e2 = R(e2);
  let i2 = li(e2, t2);
  if (!i2) {
    if (r2.required === true) throw Error(`No supported method found: ${G(t2).join(`, `)}`);
    return { ok: false, methodName: null, value: void 0, reason: `method-not-found` };
  }
  try {
    return { ok: true, methodName: i2.methodName, value: i2.method.apply(e2, Array.isArray(n2) ? n2 : [n2]), reason: null };
  } catch (e3) {
    if (r2.required === true) throw e3;
    return { ok: false, methodName: i2.methodName, value: void 0, reason: `method-threw`, error: e3 };
  }
}
function di(e2, t2 = {}) {
  let n2 = `chunks:///_virtual/CharacterManager.ts`, i2 = r(n2, `ZombieDamageDetails`), a2 = r(n2, `ZombieDamageType`);
  if (typeof i2 != `function`) return null;
  let o2 = t2.damageType ?? t2.type ?? `physicle`, s2 = typeof o2 == `number` ? o2 : a2?.[String(o2)] ?? a2?.physicle;
  return new i2(Number(e2 || 0), t2.armorProtection !== false, t2.armorKnockSound !== false, t2.bodyKnockSound !== false, t2.direction ?? null, s2, t2.flash !== false, t2.armorAlsoDamagedWhenNotProtecting === true);
}
function fi(e2, t2 = {}) {
  let n2 = (e3) => {
    let t3 = L(e3)?.managedState || null;
    if (t3?.disposed === true || t3?.retired === true || (e3 = R(e3), !e3)) return false;
    let n3 = true;
    if (t3 && typeof e3.collected == `boolean` && (t3.lastKnownCollected = e3.collected), e3.collected === true && typeof e3.collect == `function` && (n3 = false), (e3.node?.isValid === false || e3.node?.active === false) && (n3 = false), t3 && e3.node && `parent` in e3.node && e3.node.parent == null && (n3 = false), n3 && typeof e3.isAlive == `function`) try {
      n3 = e3.isAlive() === true;
    } catch {
      n3 = false;
    }
    else n3 && typeof e3.dead == `boolean` ? n3 = e3.dead !== true : n3 && typeof e3.isValid == `boolean` && (n3 = e3.isValid);
    return t3 && (n3 ? t3.observedActive = true : t3.observedActive && (typeof t3.retire == `function` ? t3.retire(`observed-inactive`) : t3.retired = true), t3.disposed === true || t3.retired === true) ? false : n3;
  }, i2 = (e3) => {
    if (Bn(e3)) return Object.freeze({ inspect: false, damage: false, heal: false, eliminate: false, moveToCell: false, collect: false });
    let i3 = R(e3), a3 = n2(e3), o3 = String(zn(e3) || mi(i3)), s3 = !!li(i3, [`dealDamage`, `takeDamage`]), c3 = _(i3) !== null, l2 = !(o3 === `zombie` || o3 === `tomb`) || typeof t2.createDamageDetails == `function` || typeof r(`chunks:///_virtual/CharacterManager.ts`, `ZombieDamageDetails`) == `function`, u2 = !!i3 && (typeof i3.setInLnC == `function` || `worldPositionX` in Object(i3) || `worldPositionY` in Object(i3));
    return Object.freeze({ inspect: !!i3, damage: a3 && c3 && s3 && l2, heal: a3 && c3 && !!li(i3, [`heal`]), eliminate: a3 && !!li(i3, [`kill`, `playDie`, `die`]), moveToCell: a3 && u2, collect: a3 && !!li(i3, [`collect`]) });
  }, a2 = (e3, t3) => {
    let n3 = String(t3 || ``).trim();
    return n3 ? i2(e3)[n3] === true : false;
  }, o2 = (e3) => {
    let t3 = R(e3), r2 = L(e3) ? e3 : null;
    return { alive: n2(e3), health: r2 && typeof r2.getHealth == `function` ? r2.getHealth() : _(t3) };
  }, s2 = (e3, t3, n3, r2 = {}) => {
    let i3 = o2(t3);
    return { ...e3, ...r2, observed: { before: n3, after: i3, ...ee(n3, i3) } };
  }, c2 = (e3) => {
    let t3 = NaN;
    try {
      t3 = Number(e3);
    } catch {
    }
    return { amount: t3, valid: Number.isFinite(t3) && t3 > 0 };
  };
  return { getCapabilities: i2, supports: a2, invoke(e3, t3 = {}) {
    if (L(e3)?.managedState && !n2(e3)) {
      if (t3.required === true) throw Error(`entity-inactive`);
      return { ok: false, methodName: null, value: void 0, reason: `entity-inactive` };
    }
    return ui(e3, t3.methods || t3.methodNames || t3.method, t3.args || [], t3);
  }, damage(e3, n3, r2 = {}) {
    let i3 = R(e3), a3 = r2 && typeof r2 == `object` ? r2 : {}, l2 = c2(n3), u2 = l2.amount, d2 = o2(e3);
    if (!l2.valid) return { ...s2({ ok: false, methodName: null, value: void 0, reason: `invalid-amount` }, e3, d2, { requestedAmount: u2 }), accepted: false, appliedAmount: 0 };
    if (!d2.alive) return { ...s2({ ok: false, methodName: null, value: void 0, reason: `entity-inactive` }, e3, d2, { requestedAmount: u2 }), accepted: false, appliedAmount: 0 };
    if (!d2.health) return { ...s2({ ok: false, methodName: null, value: void 0, reason: `health-unavailable` }, e3, d2, { requestedAmount: u2 }), accepted: false, appliedAmount: 0 };
    let f2 = String(a3.kind || zn(e3) || mi(i3)), p2 = [u2];
    if (f2 === `zombie` || f2 === `tomb`) {
      let n4 = null;
      try {
        n4 = typeof t2.createDamageDetails == `function` ? t2.createDamageDetails(u2, a3) : di(u2, a3);
      } catch (t3) {
        if (a3.required === true) throw t3;
        return { ...s2({ ok: false, methodName: null, value: void 0, reason: `damage-adapter-threw`, error: t3 }, e3, d2, { requestedAmount: u2 }), accepted: false, appliedAmount: 0 };
      }
      if (!n4) return { ...s2({ ok: false, methodName: null, value: void 0, reason: `damage-adapter-unavailable` }, e3, d2, { requestedAmount: u2 }), accepted: false, appliedAmount: 0 };
      p2 = [n4];
    }
    let m2 = s2(ui(i3, [`dealDamage`, `takeDamage`], p2, a3), e3, d2, { requestedAmount: u2 }), h2 = m2.observed?.totalDelta, g2 = typeof h2 == `number` && Number.isFinite(h2) && h2 < 0 ? Math.abs(h2) : 0, _2 = m2.ok === true && g2 > 0;
    return { ...m2, accepted: _2, appliedAmount: g2, reason: m2.ok === true && !_2 ? `damage-no-change` : m2.reason };
  }, heal(e3, t3, n3 = {}) {
    let r2 = R(e3), i3 = c2(t3), a3 = i3.amount, l2 = n3 && typeof n3 == `object` ? n3 : {}, u2 = o2(e3);
    if (!i3.valid) return { ...s2({ ok: false, methodName: null, value: void 0, reason: `invalid-amount` }, e3, u2, { requestedAmount: a3 }), accepted: false, appliedAmount: 0 };
    if (!u2.alive) return { ...s2({ ok: false, methodName: null, value: void 0, reason: `entity-inactive` }, e3, u2, { requestedAmount: a3 }), accepted: false, appliedAmount: 0 };
    if (!u2.health) return { ...s2({ ok: false, methodName: null, value: void 0, reason: `health-unavailable` }, e3, u2, { requestedAmount: a3 }), accepted: false, appliedAmount: 0 };
    let d2 = s2(ui(r2, [`heal`], [a3], l2), e3, u2, { requestedAmount: a3 }), f2 = d2.observed?.totalDelta, p2 = typeof f2 == `number` && Number.isFinite(f2) && f2 > 0 ? f2 : 0, m2 = d2.ok === true && p2 > 0;
    return { ...d2, accepted: m2, appliedAmount: p2, reason: d2.ok === true && !m2 ? `heal-no-change` : d2.reason };
  }, eliminate(e3, t3 = {}) {
    let n3 = R(e3), r2 = t3 && typeof t3 == `object` ? t3 : {}, i3 = o2(e3);
    return i3.alive ? s2(ui(n3, [`kill`, `playDie`, `die`], [], r2), e3, i3) : s2({ ok: false, methodName: null, value: void 0, reason: `entity-inactive` }, e3, i3);
  }, collect(e3, t3 = {}) {
    let r2 = L(e3)?.managedState || null, i3 = R(e3), a3 = t3 && typeof t3 == `object` ? t3 : {};
    if (!n2(e3)) return { ok: false, accepted: false, collected: r2 ? r2.lastKnownCollected === true : i3?.collected === true, methodName: null, value: void 0, reason: `entity-inactive` };
    let o3 = null;
    if (typeof i3?.collectable == `function`) try {
      o3 = i3.collectable() === true;
    } catch {
      o3 = false;
    }
    if (o3 === false) return { ok: true, accepted: false, collected: i3?.collected === true, methodName: `collect`, value: void 0, reason: `collect-rejected` };
    let s3 = ui(i3, [`collect`], [], a3), c3 = i3?.collected === true, l2 = typeof i3?.collected == `boolean`, u2 = s3.ok === true && (l2 ? c3 : s3.value !== false);
    return { ...s3, accepted: u2, collected: c3, reason: s3.ok === true && !u2 ? `collect-rejected` : s3.reason };
  }, moveToCell(t3, r2, i3) {
    return n2(t3) ? e2.snapEntityToCell(R(t3), r2, i3) : false;
  }, isAlive: n2 };
}
function pi(e2 = {}) {
  let t2 = e2.registry || Nn({ onError: (e3) => In.error(e3) }), n2 = String(e2.owner || `anonymous-mod`), r2 = e2.runtime || null, i2 = e2.actions, a2 = e2.teams, o2 = (t3) => {
    if (!t3) return null;
    let n3 = R(t3), r3 = zn(t3) || mi(n3), i3 = null;
    try {
      i3 = L(t3) ? t3.snapshot?.() : null;
    } catch {
    }
    let o3 = null;
    try {
      o3 = a2?.getState(t3, r3);
    } catch {
    }
    return { key: Vn(t3), kind: i3?.kind || r3, codename: i3?.codename || _i(n3, r3, e2.services), team: i3?.team || o3?.team || `unknown` };
  }, s2 = (e3) => e3 ? Object.freeze({ kind: String(e3.kind || `entity`), codename: e3.codename == null ? null : String(e3.codename), team: P(e3.team) || `unknown` }) : null, c2 = (e3) => {
    let t3 = R(e3), n3 = null;
    try {
      n3 = L(e3) && typeof e3.getHealth == `function` ? e3.getHealth() : _(t3);
    } catch {
    }
    return { alive: i2.isAlive(e3), health: z(n3) };
  }, l2 = (e3, t3) => {
    let n3 = c2(e3);
    return { before: t3, after: n3, ...ee(t3, n3) };
  }, u2 = (e3, n3) => {
    let r3 = Object.freeze({ type: `damage-resolved`, request: e3, result: Object.freeze({ ok: n3.ok === true, accepted: n3.accepted === true, reason: n3.reason || null, requestedAmount: n3.requestedAmount, finalAmount: n3.finalAmount, appliedAmount: Number(n3.appliedAmount || 0), observed: z(n3.observed) }), timestamp: Date.now() });
    t2.emit(r3);
  }, d2 = { ...i2, damage(e3, n3, r3 = {}) {
    let a3 = r3 && typeof r3 == `object` ? r3 : {}, d3 = a3.source ?? null, f2 = L(e3) ? e3 : null, p2 = L(d3) ? d3 : null, m2 = o2(e3), h2 = p2 ? o2(p2) : null, g2 = c2(e3);
    if (d3 != null && !p2) return { ok: false, accepted: false, methodName: null, value: void 0, reason: `source-handle-required`, requestedAmount: NaN, finalAmount: 0, appliedAmount: 0, observed: l2(e3, g2) };
    let _2 = t2.evaluate({ requestedAmount: n3, damageType: a3.damageType ?? a3.type ?? `physical`, tags: a3.tags, source: h2, target: m2 }), v2 = Object.freeze({ source: p2, target: f2, sourceSnapshot: s2(h2), targetSnapshot: s2(m2), requestedAmount: _2.requestedAmount, amount: _2.amount, damageType: _2.damageType, tags: _2.tags, blocked: _2.blocked, blockReason: _2.blocked ? _2.reason : null, applications: _2.applications }), y2 = null;
    if (!_2.ok) y2 = { ok: false, accepted: false, methodName: null, value: void 0, reason: _2.reason, requestedAmount: _2.requestedAmount, finalAmount: _2.amount, appliedAmount: 0, observed: l2(e3, g2), combat: v2 };
    else if (_2.blocked) y2 = { ok: true, accepted: false, methodName: null, value: void 0, reason: `damage-blocked`, requestedAmount: _2.requestedAmount, finalAmount: _2.amount, appliedAmount: 0, observed: l2(e3, g2), combat: v2 };
    else {
      let t3 = { ...a3 };
      delete t3.source, delete t3.tags, y2 = { ...i2.damage(e3, _2.amount, t3), requestedAmount: _2.requestedAmount, finalAmount: _2.amount, combat: v2 };
    }
    return u2(v2, y2), y2;
  } };
  return Object.freeze({ actions: Object.freeze(d2), api: Object.freeze({ getCapabilities() {
    return Object.freeze({ available: true, coverage: `api-actions-only`, nativeInterception: false, sourceAttribution: true, typedDamage: true, operations: yn });
  }, modifiers: Object.freeze({ add: (e3 = {}) => {
    let a3 = e3?.subject ?? null;
    if (a3 != null && !L(a3)) throw Error(`combat.modifiers.add(): subject must be a stable entity handle`);
    if (a3 != null && !i2.isAlive(a3)) throw Error(`combat.modifiers.add(): subject entity is inactive`);
    let o3 = t2.register(n2, r2, { ...e3, subjectKey: a3 == null ? null : Vn(a3) });
    return a3?.onInactive(() => o3.dispose(`subject-inactive`), { signal: o3.signal, label: `combat modifier ${o3.id} subject lifetime` }), o3;
  }, list: () => t2.list() }), watchDamage: (e3, i3 = {}) => {
    if (typeof e3 != `function`) throw Error(`combat.watchDamage() requires a listener`);
    if (typeof r2?.track != `function`) throw Error(`combat.watchDamage() requires a managed mod runtime`);
    i3 = i3 && typeof i3 == `object` ? i3 : {};
    let a3 = String(i3.label || `combat damage watch`), o3 = typeof r2.guard == `function` ? r2.guard(e3, { label: a3 }) : e3, s3 = () => false, c3 = et({ runtime: r2, signal: i3.signal, label: a3, onCancel: () => s3() });
    return c3.active && (s3 = t2.subscribe(n2, (e4) => {
      if (!c3.active) return;
      let t3 = Promise.resolve().then(() => o3(e4));
      r2.track(t3, { label: a3 });
    })), c3.cancel;
  } }) });
}
function mi(e2) {
  let t2 = String(e2?.constructor?.name || e2?.name || ``).toLowerCase();
  return t2.includes(`plant`) ? `plant` : t2.includes(`zombie`) ? `zombie` : t2.includes(`projectile`) || t2.includes(`shot`) ? `projectile` : t2.includes(`armor`) ? `armor` : t2.includes(`tomb`) ? `tomb` : t2.includes(`tileliquid`) || t2.includes(`tile-liquid`) ? `tile-liquid` : t2.includes(`dinosaur`) ? `dinosaur` : `entity`;
}
function hi(e2) {
  let t2 = String(e2 || ``).trim().toLowerCase();
  return !t2 || t2 === `all` || t2 === `entity` || t2 === `entities` ? null : { plants: `plant`, zombies: `zombie`, projectiles: `projectile`, armors: `armor`, tombs: `tomb`, tileliquid: `tile-liquid`, tileliquids: `tile-liquid`, "tile-liquids": `tile-liquid`, dinosaurs: `dinosaur` }[t2] || t2;
}
function gi(e2, t2) {
  let n2 = String(e2?.node?.name || ``).replace(/\(clone\)$/i, ``).replace(/prj$/i, ``).trim().toLowerCase();
  if (!n2) return null;
  let r2 = Pn.get(`ProjectileFeatures`), i2 = V(t2, `ProjectileFeatures`), a2 = r2?.key && Array.isArray(i2?.[r2.key]) ? i2[r2.key] : [], o2 = new Set(a2.filter((e3) => String(e3?.RES || ``).trim().toLowerCase() === n2).map((e3) => String(e3?.[r2?.idKey || `CODENAME`] || ``).trim()).filter(Boolean));
  return o2.size === 1 ? [...o2][0] : null;
}
function _i(e2, t2 = null, n2 = null, r2 = null) {
  let i2 = r2?.codename;
  if (typeof i2 == `string` && i2.trim()) return i2.trim();
  let a2 = g(e2);
  if (a2) return a2;
  let o2 = hi(t2) || mi(e2);
  if (o2 === `projectile`) return gi(e2, n2);
  if (o2 !== `plant`) return null;
  let c2 = Number(e2?.ID);
  if (!Number.isFinite(c2)) return null;
  let l2 = s(`chunks:///_virtual/Plants.ts`)?.PlantEnum?.[c2];
  return typeof l2 == `string` && l2.trim() ? l2.trim() : null;
}
function vi(e2, t2, n2, r2 = null, i2 = null, a2 = null, o2 = null) {
  if (!e2) return null;
  let s2 = i2 && typeof i2 == `object` ? Object.freeze({ ...i2 }) : null, c2 = hi(r2) || mi(e2), l2 = s2?.managedSpawnState || oe(e2), u2 = Object.freeze({ id: String(e2?.uuid || e2?.node?.uuid || e2?.name || e2?.constructor?.name || `entity`), className: String(e2?.constructor?.name || ``), codename: _i(e2, c2, a2, s2), nodeName: String(e2?.node?.name || ``), numericId: Number.isFinite(Number(e2?.ID)) ? Number(e2.ID) : null }), d2 = (e3) => ({ laneIndex: Number.isInteger(e3?.laneIndex) && e3.laneIndex >= 0 ? e3.laneIndex : s2?.spawnAt?.laneIndex ?? null, columnIndex: Number.isInteger(e3?.columnIndex) && e3.columnIndex >= 0 ? e3.columnIndex : s2?.spawnAt?.columnIndex ?? null, position: e3?.world ? { x: Number(e3.world.x || 0), y: Number(e3.world.y || 0), z: Number(e3.world.z || 0) } : null }), f2 = l2 ? d2(t2.describe(e2)) : null, p2 = l2 ? z(_(e2)) : null, m2 = o2?.getState(e2, c2) ?? Object.freeze({ team: `unknown`, targetTeam: `unknown` }), h2 = null, g2 = { get id() {
    return u2.id;
  }, get kind() {
    return c2;
  }, get className() {
    return u2.className;
  }, get codename() {
    return u2.codename;
  }, get signal() {
    return l2?.signal ?? null;
  }, onInactive(e3, t3 = {}) {
    if (typeof e3 != `function`) throw Error(`entity.onInactive() requires a listener`);
    if (!l2?.onTerminal) return () => false;
    let n3 = a2?.runtime, r3 = String(t3?.label || `entity inactive listener`), i3 = typeof n3?.guard == `function` ? n3.guard(e3, { label: r3 }) : e3, o3 = (e4) => {
      let t4 = e4?.terminalEvent || { type: e4?.disposed ? `disposed` : `retired`, reason: e4?.disposalReason || e4?.retirementReason || `inactive` };
      i3(Object.freeze({ type: t4.type, reason: t4.reason, entity: g2 }));
    }, s3 = () => false, c3 = et({ runtime: n3, signal: t3?.signal, label: r3, onCancel: () => s3?.() });
    return c3.active ? l2.signal?.aborted ? (c3.cancel(), o3(l2), c3.cancel) : (s3 = l2.onTerminal((e4) => {
      c3.active && (c3.cancel(), o3(e4));
    }), c3.cancel) : c3.cancel;
  }, getHealth() {
    if (l2 && !n2.isAlive(g2)) return z(p2);
    let t3 = _(e2);
    return l2 && (p2 = z(t3)), t3;
  }, getCapabilities() {
    return n2.getCapabilities(g2);
  }, supports(e3) {
    return n2.supports(g2, e3);
  }, snapshot() {
    let r3 = n2.isAlive(g2);
    if (l2 && !r3) {
      let e3 = h2 ? z(h2) : { id: u2.id, kind: c2, className: u2.className, codename: u2.codename, nodeName: u2.nodeName, numericId: u2.numericId, laneIndex: f2?.laneIndex ?? s2?.spawnAt?.laneIndex ?? null, columnIndex: f2?.columnIndex ?? s2?.spawnAt?.columnIndex ?? null, position: z(f2?.position ?? null), health: z(p2), team: m2.team, targetTeam: m2.targetTeam };
      return e3.alive = false, e3.health = z(p2), e3.capabilities = n2.getCapabilities(g2), e3;
    }
    let i3 = d2(t2.describe(e2));
    l2 && (f2 = z(i3));
    let a3 = o2?.getState(e2, c2) ?? Object.freeze({ team: `unknown`, targetTeam: `unknown` });
    l2 && (m2 = a3);
    let _2 = { id: this.id, kind: this.kind, className: this.className, codename: this.codename, nodeName: u2.nodeName, numericId: u2.numericId, laneIndex: i3.laneIndex, columnIndex: i3.columnIndex, position: i3.position, alive: r3, health: this.getHealth(), team: a3.team, targetTeam: a3.targetTeam, capabilities: this.getCapabilities() };
    return l2 && (h2 = z(_2)), _2;
  }, isAlive() {
    return n2.isAlive(g2);
  }, damage(e3, t3 = {}) {
    return n2.damage(g2, e3, t3);
  }, heal(e3, t3 = {}) {
    return n2.heal(g2, e3, t3);
  }, eliminate(e3 = {}) {
    return n2.eliminate(g2, e3);
  }, collect(e3 = {}) {
    return n2.collect(g2, e3);
  }, moveToCell(e3, t3) {
    return n2.moveToCell(g2, e3, t3);
  } };
  return Ln.set(g2, { target: e2, kind: c2, managedState: l2 }), Object.freeze(g2);
}
function yi(e2, t2 = {}) {
  let n2 = e2.snapshot();
  if (typeof t2.alive == `boolean` && n2.alive !== t2.alive) return false;
  let r2 = (e3, t3) => {
    if (e3 == null) return true;
    let n3 = (Array.isArray(e3) ? e3 : [e3]).map(P).filter(Boolean);
    return n3.length > 0 && n3.includes(t3);
  };
  if (!r2(t2.team ?? t2.teams, n2.team) || !r2(t2.targetTeam ?? t2.targetTeams, n2.targetTeam)) return false;
  let i2 = t2.codename ?? t2.codenames;
  if (i2 != null) {
    let e3 = new Set((Array.isArray(i2) ? i2 : [i2]).map((e4) => String(e4 || ``).trim().toLowerCase()).filter(Boolean));
    if (!n2.codename || !e3.has(n2.codename.toLowerCase())) return false;
  }
  let a2 = t2.capability ?? t2.capabilities;
  return !(a2 != null && !(Array.isArray(a2) ? a2 : [a2]).map((e3) => String(e3 || ``).trim()).filter(Boolean).every((e3) => n2.capabilities?.[e3] === true));
}
function bi(e2, t2) {
  return JSON.stringify(e2 ?? null) === JSON.stringify(t2 ?? null);
}
function xi(e2, t2, n2) {
  let r2 = [];
  return n2.has(`identity`) && !bi([e2?.kind, e2?.className, e2?.codename, e2?.numericId], [t2?.kind, t2?.className, t2?.codename, t2?.numericId]) && r2.push(`identity`), n2.has(`grid`) && !bi([e2?.laneIndex, e2?.columnIndex], [t2?.laneIndex, t2?.columnIndex]) && r2.push(`grid`), n2.has(`position`) && !bi(e2?.position, t2?.position) && r2.push(`position`), n2.has(`health`) && !bi(e2?.health, t2?.health) && r2.push(`health`), n2.has(`alive`) && e2?.alive !== t2?.alive && r2.push(`alive`), n2.has(`team`) && !bi([e2?.team, e2?.targetTeam], [t2?.team, t2?.targetTeam]) && r2.push(`team`), n2.has(`capabilities`) && !bi(e2?.capabilities, t2?.capabilities) && r2.push(`capabilities`), r2;
}
function Si() {
  return s(`chunks:///_virtual/Square.ts`);
}
function Ci(e2) {
  let t2 = Si();
  return t2?.[e2] ?? t2?.Square?.[e2] ?? null;
}
function wi() {
  let e2 = Ci(`getAllLane`);
  if (typeof e2 != `function`) return [];
  try {
    let t2 = e2();
    return Array.isArray(t2) ? t2 : [];
  } catch {
    return [];
  }
}
function Ti(e2) {
  let t2 = Ci(`getLane`);
  if (typeof t2 == `function`) try {
    let n2 = t2(Number(e2));
    if (n2) return n2;
  } catch {
  }
  return wi().find((t3) => Number(t3?.LaneIndex) === Number(e2)) ?? null;
}
function Ei(e2, t2) {
  let n2 = Ci(`getLnC`);
  if (typeof n2 == `function`) try {
    return n2(Number(e2), Number(t2)) ?? null;
  } catch {
  }
  let r2 = Ti(e2);
  return (Array.isArray(r2?.laneLnCs) ? r2.laneLnCs : []).find((e3) => Number(e3?.cIndex) === Number(t2)) ?? null;
}
function Di(e2, t2, ...n2) {
  let r2 = Ci(`getSquareWorldPosition`);
  if (typeof r2 != `function`) return null;
  try {
    return r2(Number(e2), Number(t2), ...n2) ?? null;
  } catch {
    return null;
  }
}
function Oi() {
  let e2 = Si();
  return { width: Number(e2?.SquareWidth || e2?.Square?.SquareWidth || 0), height: Number(e2?.SquareHeight || e2?.Square?.SquareHeight || 0) };
}
function ki(e2) {
  if (!e2) return null;
  if (typeof e2.worldPositionX == `number` || typeof e2.worldPositionY == `number`) return { x: Number(e2.worldPositionX || 0), y: Number(e2.worldPositionY || 0) };
  let t2 = e2.worldPosition || e2.node?.worldPosition || e2.worldPositionVec3;
  return t2 && typeof t2 == `object` ? { x: Number(t2.x || 0), y: Number(t2.y || 0) } : null;
}
function X(e2 = []) {
  let t2 = /* @__PURE__ */ new Set(), n2 = [];
  for (let r2 of e2) {
    if (!r2) continue;
    let e3 = r2?.node?.uuid || r2?.uuid || r2;
    t2.has(e3) || (t2.add(e3), n2.push(r2));
  }
  return n2;
}
function Ai(e2, t2) {
  let n2 = Number(e2?.x || 0) - Number(t2?.x || 0), r2 = Number(e2?.y || 0) - Number(t2?.y || 0);
  return n2 * n2 + r2 * r2;
}
function Z(e2) {
  return e2 ? typeof e2?.LaneIndex == `number` ? { laneIndex: Number(e2.LaneIndex), columnIndex: e2?.cIndex == null ? null : Number(e2.cIndex), lane: e2, cell: null, world: ki(e2) } : typeof e2?.lIndex == `number` || typeof e2?.cIndex == `number` ? { laneIndex: e2?.lIndex == null ? null : Number(e2.lIndex), columnIndex: e2?.cIndex == null ? null : Number(e2.cIndex), lane: e2?.inLane ?? (e2?.lIndex == null ? null : Ti(e2.lIndex)), cell: e2?.inLnC ?? (e2?.lIndex != null && e2?.cIndex != null ? Ei(e2.lIndex, e2.cIndex) : null), world: ki(e2), actor: e2 } : e2?.inLnC || e2?.inLane ? Z({ lIndex: e2?.inLnC?.lIndex ?? e2?.inLane?.LaneIndex, cIndex: e2?.inLnC?.cIndex ?? e2?.cIndex, inLnC: e2?.inLnC ?? null, inLane: e2?.inLane ?? null, worldPositionX: e2?.worldPositionX, worldPositionY: e2?.worldPositionY }) : typeof e2?.laneIndex == `number` || typeof e2?.columnIndex == `number` ? { laneIndex: e2?.laneIndex == null ? null : Number(e2.laneIndex), columnIndex: e2?.columnIndex == null ? null : Number(e2.columnIndex), lane: e2?.laneIndex == null ? null : Ti(e2.laneIndex), cell: e2?.laneIndex != null && e2?.columnIndex != null ? Ei(e2.laneIndex, e2.columnIndex) : null, world: e2?.world ?? ki(e2) } : { laneIndex: null, columnIndex: null, lane: null, cell: null, world: ki(e2) } : null;
}
function Q(e2, t2 = `all`) {
  if (!e2) return [];
  let n2 = () => X([e2?.tombPool?.(), e2?.tombPool?.(0), e2?.tombPool?.(1), e2?.tombPool?.(2)].flat().filter(Boolean));
  switch (String(t2 || `all`)) {
    case `plant`:
    case `plants`:
      return Array.isArray(e2?.plantPool?.()) ? e2.plantPool() : [];
    case `zombie`:
    case `zombies`:
      return X([...Array.isArray(e2?.zombiePool?.()) ? e2.zombiePool() : [], ...Array.isArray(e2?.hypnoZombiePool?.()) ? e2.hypnoZombiePool() : []]);
    case `projectile`:
    case `projectiles`:
      return X([...Array.isArray(e2?.prjPool?.()) ? e2.prjPool() : [], ...Array.isArray(e2?.gumPool?.()) ? e2.gumPool() : [], ...Array.isArray(e2?.gumPool?.(1)) ? e2.gumPool(1) : [], ...Array.isArray(e2?.gumPool?.(-1)) ? e2.gumPool(-1) : []]);
    case `tomb`:
    case `tombs`:
    case `tombstone`:
    case `tombstones`:
      return n2();
    default:
      return X([...Q(e2, `plants`), ...Q(e2, `zombies`), ...Q(e2, `projectiles`), ...n2()]);
  }
}
function ji(e2 = {}) {
  return { getSquareSize() {
    return typeof e2.getSquareSize == `function` ? e2.getSquareSize() : Oi();
  }, getWorldPosition(t2, n2, ...r2) {
    return typeof e2.getWorldPosition == `function` ? e2.getWorldPosition(t2, n2, ...r2) : Di(t2, n2, ...r2);
  }, getLanes() {
    if (typeof e2.getLanes == `function`) {
      let t2 = e2.getLanes();
      return Array.isArray(t2) ? t2 : [];
    }
    return wi();
  }, getLane(t2) {
    return typeof e2.getLane == `function` ? e2.getLane(t2) ?? null : Ti(t2);
  }, getCell(t2, n2) {
    return typeof e2.getCell == `function` ? e2.getCell(t2, n2) ?? null : Ei(t2, n2);
  }, getCells() {
    if (typeof e2.getCells == `function`) {
      let t3 = e2.getCells();
      return X(Array.isArray(t3) ? t3 : []);
    }
    let t2 = this.getLanes(), n2 = [];
    for (let e3 of t2) {
      if (Array.isArray(e3?.laneLnCs) && e3.laneLnCs.length > 0) {
        n2.push(...e3.laneLnCs);
        continue;
      }
      for (let t3 = 0; t3 < 9; t3++) {
        let r2 = this.getCell(e3?.LaneIndex, t3);
        r2 && n2.push(r2);
      }
    }
    return X(n2);
  }, describe(e3) {
    return Z(e3);
  }, isSameCell(e3, t2) {
    let n2 = Z(e3), r2 = Z(t2);
    return n2?.laneIndex != null && n2?.columnIndex != null && n2.laneIndex === r2?.laneIndex && n2.columnIndex === r2?.columnIndex;
  }, getNeighbors(e3, t2 = {}) {
    let n2 = Z(e3);
    if (n2?.laneIndex == null || n2?.columnIndex == null) return [];
    let r2 = Math.max(1, Math.floor(Number(t2.distance || 1))), i2 = t2.diagonals !== false, a2 = t2.includeSelf === true, o2 = [];
    for (let e4 = -r2; e4 <= r2; e4++) for (let t3 = -r2; t3 <= r2; t3++) {
      if (!a2 && e4 === 0 && t3 === 0 || !i2 && e4 !== 0 && t3 !== 0) continue;
      let r3 = Ei(n2.laneIndex + e4, n2.columnIndex + t3);
      r3 && o2.push(r3);
    }
    return X(o2);
  }, getLaneEntities(e3, t2 = `all`) {
    return Q(Ti(e3), t2);
  }, getCellEntities(e3, t2, n2 = {}) {
    let r2 = Z(typeof e3 == `number` ? { laneIndex: e3, columnIndex: t2 } : e3);
    if (!r2?.cell) return [];
    let i2 = Array.isArray(n2.kind || n2.kinds) ? n2.kind || n2.kinds : [n2.kind || n2.kinds || `all`], a2 = typeof n2.filter == `function` ? n2.filter : null, o2 = X(Q(r2.lane, `all`).filter((e4) => e4?.inLnC === r2.cell)).filter((e4) => i2.includes(`all`) || i2.some((t3) => Q(r2.lane, t3).includes(e4)));
    return a2 ? o2.filter((e4) => a2(e4) !== false) : o2;
  }, listEntities(t2 = {}) {
    if (typeof e2.listEntities == `function`) {
      let n3 = e2.listEntities(t2);
      return X(Array.isArray(n3) ? n3 : []);
    }
    let n2 = Z(t2.around || t2.center || t2.actor || t2.cell), r2 = Math.max(0, Math.floor(Number(t2.includeAdjacentLanes ?? t2.laneRadius ?? 0))), i2 = Number(t2.radius ?? t2.maxDistance ?? 0), a2 = typeof t2.filter == `function` ? t2.filter : null, o2 = [];
    if (n2?.laneIndex != null) for (let e3 = n2.laneIndex - r2; e3 <= n2.laneIndex + r2; e3++) {
      let t3 = Ti(e3);
      t3 && o2.push(t3);
    }
    else if (t2.laneIndex != null) {
      let e3 = Ti(t2.laneIndex);
      e3 && (o2 = [e3]);
    } else o2 = wi();
    let s2 = t2.kind || t2.kinds || `all`, c2 = Array.isArray(s2) ? s2 : [s2];
    return X(o2.flatMap((e3) => c2.flatMap((t3) => Q(e3, t3)))).filter((e3) => {
      if (n2?.cell && t2.sameCell === true && e3?.inLnC !== n2.cell) return false;
      if (i2 > 0 && n2?.world) {
        let t3 = ki(e3);
        if (!t3 || Ai(n2.world, t3) > i2 * i2) return false;
      }
      return a2 ? a2(e3) !== false : true;
    });
  }, findNearest(e3, t2 = {}) {
    let n2 = Z(e3);
    if (!n2?.world) return null;
    let r2 = this.listEntities({ ...t2, around: e3 }), i2 = null, a2 = 1 / 0;
    for (let t3 of r2) {
      if (t3 === e3 || t3 === n2.actor) continue;
      let r3 = ki(t3);
      if (!r3) continue;
      let o2 = Ai(n2.world, r3);
      o2 < a2 && (a2 = o2, i2 = t3);
    }
    return i2;
  }, moveEntityToCell(e3, t2, n2) {
    return this.snapEntityToCell(e3, t2, n2);
  }, snapEntityToCell(e3, t2, n2) {
    let r2 = Ei(t2, n2);
    if (!e3 || !r2) return false;
    try {
      if (typeof e3.setInLnC == `function`) return e3.setInLnC(r2), true;
    } catch {
    }
    let i2 = Di(t2, n2);
    if (!i2) return false;
    try {
      return `worldPositionX` in e3 && (e3.worldPositionX = Number(i2.x || 0)), `worldPositionY` in e3 && (e3.worldPositionY = Number(i2.y || 0)), e3.judgeInLnC?.(), true;
    } catch {
      return false;
    }
  }, swapEntities(e3, t2) {
    let n2 = Z(e3), r2 = Z(t2);
    if (!n2?.actor || !r2?.actor || n2.laneIndex == null || n2.columnIndex == null || r2.laneIndex == null || r2.columnIndex == null) return false;
    let i2 = this.snapEntityToCell(n2.actor, r2.laneIndex, r2.columnIndex), a2 = this.snapEntityToCell(r2.actor, n2.laneIndex, n2.columnIndex);
    return i2 && a2;
  } };
}
function Mi(e2 = {}) {
  let t2 = (t3) => {
    let n2 = typeof t3 == `string` ? t3 : t3?.domain || t3?.actorDomain || t3?.kind || `plants`, r2 = String(n2 || `plants`);
    return e2[r2] || e2[`${r2}s`] || null;
  };
  return { getDomain(e3) {
    return t2(e3);
  }, resolveClass(e3, n2) {
    return t2(e3)?.resolveClass?.(n2) ?? null;
  }, overrideAction(e3 = {}) {
    let n2 = t2(e3);
    if (!n2?.overrideAction) throw Error(`combat.overrideAction(): unsupported domain '${e3?.domain || `unknown`}'`);
    return n2.overrideAction(e3);
  }, onSpawn(e3, n2 = {}) {
    let r2 = t2(n2);
    if (!r2?.onSpawn) throw Error(`combat.onSpawn(): unsupported domain '${n2?.domain || `unknown`}'`);
    return r2.onSpawn(e3, n2);
  }, onHit(e3, n2 = {}) {
    let r2 = t2(n2);
    if (!r2?.onHit) throw Error(`combat.onHit(): unsupported domain '${n2?.domain || `unknown`}'`);
    return r2.onHit(e3, n2);
  }, onDeath(e3, n2 = {}) {
    let r2 = t2(n2);
    if (!r2?.onDeath) throw Error(`combat.onDeath(): unsupported domain '${n2?.domain || `unknown`}'`);
    return r2.onDeath(e3, n2);
  }, onAction(e3, n2 = {}) {
    let r2 = t2(n2);
    if (!r2?.onAfterAction) throw Error(`combat.onAction(): unsupported domain '${n2?.domain || `unknown`}'`);
    return r2.onAfterAction(e3, n2);
  }, applyDamage(t3, n2, r2 = {}) {
    return e2.actions?.damage?.(t3, n2, r2) ?? null;
  }, kill(t3, n2 = {}) {
    return e2.actions?.eliminate?.(t3, n2) ?? null;
  }, isAlive(t3) {
    return e2.actions?.isAlive?.(t3) === true;
  } };
}
function Ni(e2, t2) {
  let n2 = G(e2.classCandidates), r2 = (r3 = {}) => {
    let i3 = G(r3.classNames || r3.className || n2), a3 = tr(i3);
    if (!a3) {
      if (r3.optional === true) return null;
      throw Error(`[${e2.label}] target class not found: ${i3.join(`, `) || `(none)`}`);
    }
    let o3 = r3.isStatic === true ? a3.cls : a3.cls?.prototype, s3 = G(r3.methodNames || r3.methodName), c3 = nr(o3, s3);
    if (!c3) {
      if (r3.optional === true) return null;
      throw Error(`[${e2.label}] target method not found on ${a3.name}: ${s3.join(`, `) || `(none)`}`);
    }
    let l3 = typeof r3.handler == `function` ? r3.handler : null;
    if (!l3) throw Error(`[${e2.label}] wrapClassMethod() requires handler`);
    return t2.wrapMethod({ target: o3, methodName: c3, handler(e3) {
      return l3({ ...e3, resolvedClassName: a3.name, resolvedMethodName: c3, resolvedClass: a3.cls });
    } });
  }, i2 = (t3, i3 = `after`) => (a3, o3 = {}) => {
    if (typeof a3 != `function`) throw Error(`[${e2.label}] lifecycle hook requires listener`);
    return r2({ classNames: o3.classNames || o3.className || n2, methodNames: o3.methodNames || o3.methodName || t3, optional: o3.optional !== false, isStatic: o3.isStatic === true, handler(e3) {
      if (i3 === `before`) return a3(e3), e3.callNext(...e3.args);
      let t4 = e3.callNext(...e3.args);
      return t4?.then && typeof t4.then == `function` ? t4.then((t5) => (a3({ ...e3, result: t5 }), t5)) : (a3({ ...e3, result: t4 }), t4);
    } });
  }, a2 = i2(e2.spawnMethodCandidates || [`onEnable`, `characterOnEnable`], `after`), o2 = i2(e2.spawnMethodCandidates || [`onEnable`, `characterOnEnable`], `before`), s2 = i2(e2.deathMethodCandidates || [`playDie`, `die`], `after`), c2 = i2(e2.deathMethodCandidates || [`playDie`, `die`], `before`), l2 = i2(e2.hitMethodCandidates || [`dealDamage`, `onDamaged`, `judgeDeath`], `after`), u2 = i2(e2.hitMethodCandidates || [`dealDamage`, `onDamaged`, `judgeDeath`], `before`), d2 = i2(e2.actionMethodCandidates || [`attack`, `shoot`], `before`), f2 = i2(e2.actionMethodCandidates || [`attack`, `shoot`], `after`), p2 = (t3 = {}) => r2({ classNames: t3.classNames || t3.className || n2, methodNames: t3.methodNames || t3.methodName || e2.actionMethodCandidates, optional: t3.optional === true, isStatic: t3.isStatic === true, handler: t3.override });
  return { resolveClass(e3 = n2) {
    return tr(e3);
  }, wrapClassMethod: r2, onSpawn: a2, onBeforeSpawn: o2, onDeath: s2, onBeforeDeath: c2, onHit: l2, onBeforeHit: u2, onBeforeAction: d2, onAfterAction: f2, actionOverride: p2, overrideAction: p2 };
}
function Pi(e2, t2) {
  let n2 = { listFeatureEntries(n3 = {}) {
    return Gn(e2, t2.featureType, n3.useOriginal === true);
  }, getFeature(n3, r2 = {}) {
    return Kn(e2, t2.featureType, n3, r2);
  }, getFeatureData(n3 = {}) {
    return B(e2, n3.useOriginal === true ? H(e2, t2.featureType) : V(e2, t2.featureType));
  }, mutateFeatures(n3) {
    return U(e2, t2.featureType, n3);
  } };
  for (let [r2, i2] of Object.entries(t2.objectTypes || {})) {
    let t3 = r2.charAt(0).toUpperCase() + r2.slice(1);
    n2[`list${t3}Entries`] = (t4 = {}) => Gn(e2, i2, t4.useOriginal === true), n2[`get${t3}`] = (t4, n3 = {}) => Kn(e2, i2, t4, n3), n2[`get${t3}Data`] = (t4 = {}) => B(e2, t4.useOriginal === true ? H(e2, i2) : V(e2, i2)), n2[`mutate${t3}`] = (t4) => U(e2, i2, t4);
  }
  return n2.getBundle = (n3 = {}) => {
    let r2 = {};
    t2.featureType && (r2.features = n3.useOriginal === true ? H(e2, t2.featureType) : V(e2, t2.featureType));
    for (let [i2, a2] of Object.entries(t2.objectTypes || {})) r2[i2] = n3.useOriginal === true ? H(e2, a2) : V(e2, a2);
    return B(e2, r2);
  }, { api: n2, behavior: Ni(t2, e2.behaviorTools || {}) };
}
function $(e2, t2, n2 = {}) {
  return { type: t2, getData(n3 = {}) {
    return B(e2, n3.useOriginal === true ? H(e2, t2) : V(e2, t2));
  }, listEntries(n3 = {}) {
    return Gn(e2, t2, n3.useOriginal === true);
  }, getEntry(n3, r2 = {}) {
    return Kn(e2, t2, n3, r2);
  }, mutate(n3) {
    return U(e2, t2, n3);
  }, export(n3 = {}) {
    return t2 === `lang` ? e2?.exportLang?.(n3.useOriginal === true, n3.autoDownload !== false) ?? null : e2?.exportJson?.(t2, n3.useOriginal === true, n3.autoDownload !== false) ?? null;
  }, ...n2 };
}
function Fi(e2 = {}) {
  let t2 = (t3) => (n2) => {
    try {
      e2.reportPersistentMutation?.(Object.freeze({ domain: `native-player-save`, operation: t3, status: n2 }));
    } catch {
      console.warn(`[GP Next:mod-api] Persistent mutation reporter failed`);
    }
  }, s2 = on({ runtime: e2.runtime, subscribeGameTick: e2.subscribeGameTick, getGameClockState: e2.getGameClockState }), c2 = () => {
    let t3 = e2.getSceneName?.() ?? u() ?? null, n2 = e2.getLevelController?.() ?? qn(), r2 = e2.getUiInGame?.() ?? Jn(), i2 = t3 === `inGameScene` && !!n2, a2 = false;
    try {
      a2 = n2?.gaming === true;
    } catch {
    }
    let o2 = i2 && n2?.gameStarted === true, c3 = i2 && n2?.gameWon === true, l2 = i2 && n2?.gameLost === true, d3 = i2 && (c3 || l2 || n2?.gameOver === true), f3 = s2.getState(), p3 = i2 && !d3 && (r2?.paused === true || f3.paused === true), m3 = i2 && o2 && a2 && !p3 && !d3, h2 = `outside`;
    i2 && (h2 = c3 ? `won` : l2 ? `lost` : d3 ? `ended` : p3 ? `paused` : !o2 || n2?.lastStandPrepareStarted === true ? `preparing` : m3 ? `running` : `waiting`);
    let g3 = i2 ? e2.getCurrentLevelName?.() ?? n2?.levelNameString ?? n2?.levelName ?? null : null;
    return Object.freeze({ available: i2, sceneName: t3, levelName: g3, phase: h2, started: o2, running: m3, paused: p3, ended: d3, outcome: c3 ? `won` : l2 ? `lost` : null });
  }, d2 = { listTypes() {
    return [...h];
  }, listTypeInfos() {
    return h.map((e3) => Un(e3));
  }, getTypeInfo(e3) {
    return Un(e3);
  }, getCurrent(t3) {
    return B(e2, V(e2, t3));
  }, getOriginal(t3) {
    return B(e2, H(e2, t3));
  }, listEntries(t3, n2 = {}) {
    return Gn(e2, t3, n2.useOriginal === true);
  }, getEntry(t3, n2, r2 = {}) {
    return Kn(e2, t3, n2, r2);
  }, mutate(t3, n2) {
    return U(e2, t3, n2);
  }, hasBackup(t3) {
    return typeof e2?.hasBackup == `function` ? e2.hasBackup(t3) : H(e2, t3) != null;
  }, listBackups() {
    return typeof e2?.listBackups == `function` ? e2.listBackups() : [];
  }, restore(t3) {
    let n2 = V(e2, t3);
    return n2 && e2?.beforeDataMutation?.(t3, n2), typeof e2?.restoreData == `function` ? e2.restoreData(t3) : false;
  }, export(t3, n2 = false, r2 = true) {
    return t3 === `lang` ? e2?.exportLang?.(n2, r2) ?? null : e2?.exportJson?.(t3, n2, r2) ?? null;
  }, setObjectsData(t3, n2, ...r2) {
    let i2 = V(e2, t3);
    return i2 && e2?.beforeDataMutation?.(t3, i2), e2?.setObjectsData?.(t3, n2, ...r2) ?? false;
  } }, f2 = { getName() {
    return u();
  }, getCurrent() {
    return o();
  }, is(e3) {
    return u() === String(e3 || ``);
  }, getComponent(e3) {
    return a(e3);
  } }, p2 = { getController() {
    return qn();
  }, getCurrentLevelName() {
    if (typeof e2?.getCurrentLevelName == `function`) return e2.getCurrentLevelName() ?? null;
    let t3 = qn();
    return t3?.levelNameString || t3?.levelName || null;
  }, getDefinition(t3) {
    let n2 = String(t3 || p2.getCurrentLevelName() || ``);
    return n2 ? V(e2, n2) : null;
  }, getOriginalDefinition(t3) {
    let n2 = String(t3 || p2.getCurrentLevelName() || ``);
    return n2 ? H(e2, n2) : null;
  }, mutateDefinition(t3, n2) {
    let r2 = typeof t3 == `function`, i2 = r2 ? t3 : n2, a2 = String((r2 ? null : t3) || p2.getCurrentLevelName() || ``);
    return a2 ? U(e2, a2, i2) : null;
  }, getModulesData(t3 = {}) {
    return t3.useOriginal === true ? H(e2, `LevelModules`) : V(e2, `LevelModules`);
  }, mutateModules(t3) {
    return U(e2, `LevelModules`, t3);
  }, forceWin() {
    return Yn()?.victory?.();
  }, forceLose() {
    return Jn()?.loseDarken?.();
  }, restoreMowers() {
    return qn()?.spawnMowers?.();
  }, onLevelLoaded(t3) {
    return typeof e2?.behaviorTools?.onEvent == `function` ? e2.behaviorTools.onEvent(`scene:after-launch`, (e3) => {
      e3?.sceneName === `inGameScene` && t3({ sceneName: e3.sceneName, levelName: p2.getCurrentLevelName(), controller: p2.getController() });
    }) : () => {
    };
  } }, m2 = { getAll() {
    let e3 = W();
    return e3?.currentPlayer && t2(`player.raw`)(`unknown`), e3?.currentPlayer ?? null;
  }, getRawController() {
    let e3 = W();
    return e3 && t2(`player.raw`)(`unknown`), e3;
  }, save() {
    let e3 = W();
    if (typeof e3?.savePP != `function`) return;
    let n2 = t2(`player.save`);
    n2(`unknown`);
    let r2 = e3.savePP();
    return n2(`changed`), r2;
  }, getProperty(e3, n2) {
    return Qn(e3, n2, t2(`player.raw`));
  }, setProperty(e3, n2, r2) {
    return $n(e3, n2, r2, t2(`player.setProperty`));
  }, addProperty(e3, n2, r2) {
    return er(e3, n2, r2, t2(`player.addProperty`));
  }, getCurrency(e3) {
    return Qn(e3, Rn[e3], t2(`player.raw`));
  }, setCurrency(e3, n2) {
    return $n(e3, n2, Rn[e3], t2(`player.setCurrency`));
  }, addCurrency(e3, n2) {
    return er(e3, n2, Rn[e3], t2(`player.addCurrency`));
  }, getZenGardenState() {
    let e3 = W()?.currentPlayer?.zengarden ?? null;
    return e3 && t2(`player.raw`)(`unknown`), e3;
  }, mutateZenGarden(e3) {
    let n2 = m2.getZenGardenState();
    if (!n2 || typeof e3 != `function`) return null;
    let r2 = t2(`player.mutateZenGarden`);
    r2(`unknown`);
    let i2 = e3(n2, { player: m2.getAll() });
    return m2.save(), typeof W()?.savePP == `function` && r2(`changed`), i2 === void 0 ? n2 : i2;
  }, addSun(e3) {
    return Xn()?.SunAdd?.(Number(e3 || 0));
  }, setSun(e3) {
    return Xn()?.setSunCount?.(Number(e3 || 0));
  }, addPlantFood(e3 = 1) {
    let n2 = Zn();
    if (!n2) return null;
    let r2 = Math.max(0, Number(e3 || 0));
    for (let e4 = 0; e4 < r2; e4++) if (typeof n2.plantFoodAdd == `function`) {
      let e5 = t2(`player.addPlantFood`);
      e5(`unknown`), n2.plantFoodAdd(), e5(`changed`);
    }
    return t2(`player.raw`)(`unknown`), n2;
  }, setPlantFood(e3) {
    return Zn()?.setPlantFoodNum?.(Number(e3 || 0));
  } }, g2 = { getUiInGame() {
    return Jn();
  }, getLevelPlay() {
    return Yn();
  }, setSpeedUp(e3) {
    return Jn()?.speedUp?.(e3 === true);
  }, getFrameRate() {
    return l()?.game?._frameRate ?? null;
  }, setFrameRate(e3) {
    return l()?.game?.setFrameRate?.(Number(e3 || 60));
  } }, _2 = { getLyrics() {
    return typeof e2?.getLyrics == `function` ? e2.getLyrics() ?? null : n(`MultiLanguage`)?.lyrics ?? null;
  }, getCurrentLanguage() {
    return n(`MultiLanguage`)?.currentLanguage ?? 0;
  }, setCurrentLanguage(e3) {
    let t3 = n(`MultiLanguage`);
    return t3 ? (t3.currentLanguage = Number(e3 || 0), t3.currentLanguage) : null;
  }, export(t3 = false, n2 = true) {
    return e2?.exportLang?.(t3, n2) ?? null;
  } }, v2 = ji(e2), y2 = fi(v2, e2), b2 = new pn();
  for (let t3 of _n({ getModuleExport: (t4, n2) => e2.getModuleExport?.(t4, n2) ?? r(t4, n2) })) b2.register(t3);
  let x2 = mn({ registry: b2, unwrap: R, getKind: (e3) => zn(e3) || mi(R(e3)) }), S2 = { list(t3 = {}) {
    if ([t3.around, t3.center, t3.actor, t3.cell].some(Bn)) return [];
    let n2 = typeof t3.filter == `function` ? t3.filter : null, r2 = { ...t3, around: R(t3.around), center: R(t3.center), actor: R(t3.actor), cell: R(t3.cell), filter: null }, i2 = hi(Array.isArray(t3.kind || t3.kinds) ? null : t3.kind || t3.kinds), a2 = v2.listEntities(r2).map((t4) => vi(t4, v2, y2, i2, null, e2, x2)).filter(Boolean).filter((e3) => yi(e3, t3));
    return n2 ? a2.filter((e3) => n2(e3) !== false) : a2;
  }, findNearest(e3, t3 = {}) {
    if (Bn(e3)) return null;
    let n2 = this.describe(e3)?.position;
    if (!n2) return null;
    let r2 = R(e3), i2 = null, a2 = 1 / 0;
    for (let o2 of this.list({ ...t3, around: e3 })) {
      if (R(o2) === r2) continue;
      let e4 = o2.snapshot().position;
      if (!e4) continue;
      let t4 = e4.x - n2.x, s3 = e4.y - n2.y, c3 = t4 * t4 + s3 * s3;
      c3 < a2 && (i2 = o2, a2 = c3);
    }
    return i2;
  }, describe(t3) {
    return L(t3) ? t3.snapshot?.() ?? null : vi(R(t3), v2, y2, zn(t3), null, e2, x2)?.snapshot() ?? null;
  }, listInLane(t3, n2 = `all`) {
    return v2.getLaneEntities(t3, n2).map((t4) => vi(t4, v2, y2, n2, null, e2, x2));
  }, listInCell(t3, n2, r2 = {}) {
    let i2 = n2;
    if (typeof t3 != `number` && n2 && typeof n2 == `object` && !Array.isArray(n2) && (r2 = n2, i2 = void 0), typeof t3 != `number` && Bn(t3)) return [];
    let a2 = R(t3);
    return v2.getCellEntities(a2, i2, { ...r2, filter: null }).map((t4) => vi(t4, v2, y2, null, null, e2, x2)).filter((e3) => yi(e3, r2)).filter((e3) => typeof r2.filter != `function` || r2.filter(e3) !== false);
  }, fromRaw(t3, n2 = null) {
    return vi(t3, v2, y2, n2, null, e2, x2);
  }, watch(t3 = {}, n2, r2 = {}) {
    if (typeof n2 != `function`) throw Error(`entities.watch() requires a listener`);
    let i2 = e2.runtime;
    if (!i2?.setInterval || !i2?.track) throw Error(`entities.watch() requires a managed mod runtime`);
    r2 = r2 && typeof r2 == `object` ? r2 : {};
    let a2 = Math.max(50, Math.min(1e4, Number(r2.intervalMs) || 250)), o2 = Array.isArray(r2.fields) && r2.fields.length > 0 ? r2.fields : [`identity`, `grid`, `health`, `alive`, `team`, `capabilities`], s3 = new Set(o2.map((e3) => String(e3 || ``).trim()).filter(Boolean)), c3 = () => {
      try {
        return typeof i2.isActive != `function` || i2.isActive() !== false;
      } catch {
        return false;
      }
    }, l2 = /* @__PURE__ */ new Map(), d3 = false, f3 = false, p3 = null, m3 = et({ runtime: i2, signal: r2.signal, label: r2.label || `entity watch`, onCancel() {
      l2.clear(), p3?.();
    } });
    if (!m3.active) return m3.cancel;
    let h2 = async (e3, t4) => {
      !m3.active || !c3() || await n2(Object.freeze({ ...e3, changes: Object.freeze([...e3.changes]), previous: z(e3.previous), current: z(e3.current), sceneName: t4.sceneName, timestamp: t4.timestamp }));
    }, g3 = async () => {
      if (!(!m3.active || f3 || !c3())) {
        f3 = true;
        try {
          let e3 = /* @__PURE__ */ new Map();
          for (let n4 of S2.list(t3)) {
            let t4 = Vn(n4);
            e3.set(t4, { key: t4, id: n4.id, handle: n4, snapshot: n4.snapshot() });
          }
          let n3 = d3 ? [...l2.keys()].filter((t4) => !e3.has(t4)) : [], i3 = [...e3.keys()].filter((e4) => !l2.has(e4)), a3 = /* @__PURE__ */ new Map();
          for (let e4 of n3) {
            let t4 = l2.get(e4).id, n4 = a3.get(t4) || [];
            n4.push(e4), a3.set(t4, n4);
          }
          let o3 = /* @__PURE__ */ new Set(), c4 = /* @__PURE__ */ new Set();
          for (let t4 of i3) {
            let n4 = a3.get(e3.get(t4).id);
            n4?.length && (o3.add(n4.shift()), c4.add(t4));
          }
          let f4 = [];
          if (d3 && r2.emitRemoved !== false) for (let e4 of n3) {
            let t4 = l2.get(e4);
            f4.push({ type: `removed`, changes: o3.has(e4) ? [`presence`, `generation`] : [`presence`], handle: t4.handle, previous: t4.snapshot, current: null });
          }
          if (d3 || r2.emitInitial === true) for (let [t4, n4] of e3) {
            let e4 = l2.get(t4);
            if (!e4) {
              f4.push({ type: `added`, changes: c4.has(t4) ? [`presence`, `generation`] : [`presence`], handle: n4.handle, previous: null, current: n4.snapshot });
              continue;
            }
            let r3 = xi(e4.snapshot, n4.snapshot, s3);
            r3.length > 0 && f4.push({ type: `changed`, changes: r3, handle: n4.handle, previous: e4.snapshot, current: n4.snapshot });
          }
          if (l2 = e3, d3 = true, f4.length > 0) {
            let e4 = Object.freeze({ sceneName: u(), timestamp: Date.now() }), t4 = [];
            for (let n4 of f4) try {
              await h2(n4, e4);
            } catch (e5) {
              t4.push(e5);
            }
            if (t4.length > 0) {
              let e5 = Error(`entities.watch() listener failed for ${t4.length} event(s)`);
              throw e5.causes = t4, e5;
            }
          }
        } finally {
          f3 = false;
        }
      }
    };
    return i2.track(g3(), { label: r2.label || `entity watch initial scan` }), p3 = i2.setInterval(g3, a2, { label: r2.label || `entity watch` }), m3.cancel;
  }, watchHealth(e3 = {}, t3, n2 = {}) {
    if (typeof t3 != `function`) throw Error(`entities.watchHealth() requires a listener`);
    return this.watch(e3, async (e4) => {
      if (e4.type !== `changed` || !e4.changes.includes(`health`)) return;
      let n3 = ee(e4.previous, e4.current);
      n3.change !== `unchanged` && await t3(Object.freeze({ type: `health-changed`, ...n3, handle: e4.handle, before: e4.previous.health, after: e4.current.health, previous: e4.previous, current: e4.current, sceneName: e4.sceneName, timestamp: e4.timestamp }));
    }, { ...n2, emitInitial: false, emitRemoved: false, fields: [`health`] });
  }, getCapabilities(e3) {
    return y2.getCapabilities(e3);
  }, supports(e3, t3) {
    return y2.supports(e3, t3);
  }, isAlive(e3) {
    return y2.isAlive(e3);
  } }, C2 = pi({ registry: e2.combatModifierRegistry, owner: e2.modNamespace, runtime: e2.runtime, actions: y2, teams: x2, services: e2 });
  y2 = C2.actions;
  let te2 = new fe(), ne2 = { getSceneName: () => e2.getSceneName?.() ?? u(), getCell: (t3, n2) => e2.getCell?.(t3, n2) ?? v2.getCell(t3, n2), getWorldPosition: (t3, n2) => e2.getWorldPosition?.(t3, n2) ?? v2.getWorldPosition(t3, n2), getSquareSize: () => e2.getSquareSize?.() ?? v2.getSquareSize(), getCc: () => e2.getCc?.() ?? l(), getCurrentData: (t3) => V(e2, t3), getModuleExport: (t3, n2) => e2.getModuleExport?.(t3, n2) ?? r(t3, n2), hasType(t3, n2) {
    if (typeof e2.hasEntityType == `function`) return e2.hasEntityType(t3, n2) === true;
    let r2 = t3 === `plant` ? `PlantFeatures` : t3 === `zombie` ? `ZombieFeatures` : t3 === `projectile` ? `ProjectileFeatures` : t3 === `tomb` ? `TombstonesFeatures` : null;
    return r2 ? Kn(e2, r2, n2) != null : false;
  } };
  for (let e3 of Qe(ne2)) te2.register(e3);
  let re2 = he({ registry: te2, runtime: e2.runtime, timeoutMs: 15e3, ...ne2, wrapEntity: (t3, n2, r2) => vi(t3, v2, y2, n2, r2, e2, x2), disposeRaw(e3, t3) {
    return y2.isAlive(e3) ? y2.eliminate(e3, { kind: t3 }) : { ok: true, methodName: null, value: void 0, reason: `already-inactive` };
  } }), ie2 = new it();
  for (let e3 of _t()) ie2.register(e3);
  let ae2 = ut({ registry: ie2, unwrap: R, isActive: (e3) => y2.isAlive(e3), runtime: e2.runtime }), oe2 = new wt();
  for (let t3 of Mt({ getModuleExport: (t4, n2) => e2.getModuleExport?.(t4, n2) ?? r(t4, n2) })) oe2.register(t3);
  let se2 = Tt({ registry: oe2, unwrap: R, isActive: (e3) => y2.isAlive(e3), getGenerationState: (e3) => L(e3)?.managedState || null, runtime: e2.runtime }), ce2 = Object.freeze({ ...ae2, layers: se2 }), le2 = Qt({ getModuleExport: (t3, n2) => e2.getModuleExport?.(t3, n2) ?? r(t3, n2), listModuleEntries: () => e2.listModuleEntries?.() ?? i(), wrapMethod: typeof e2.behaviorTools?.wrapMethod == `function` ? (t3) => e2.behaviorTools.wrapMethod(t3) : null, wrapEntity: (t3, n2) => vi(t3, v2, y2, n2, null, e2, x2), getSceneName: () => e2.getSceneName?.() ?? u(), runtime: e2.runtime }), ue2 = Pi(e2, { label: `plants`, classCandidates: [`Plant`], spawnMethodCandidates: [`characterOnEnable`, `onEnable`], deathMethodCandidates: [`playDie`, `die`], hitMethodCandidates: [`dealDamage`, `onDamaged`], actionMethodCandidates: [`attack`, `shoot`], featureType: `PlantFeatures`, objectTypes: { props: `PlantProps`, type: `PlantTypes`, almanac: `PlantAlmanac` } }), w2 = Pi(e2, { label: `zombies`, classCandidates: [`Zombie`], spawnMethodCandidates: [`characterOnEnable`, `onEnable`], deathMethodCandidates: [`playDie`, `die`], hitMethodCandidates: [`dealDamage`, `onDamaged`, `judgeDeath`], actionMethodCandidates: [`detectPlant`, `attack`], featureType: `ZombieFeatures`, objectTypes: { props: `ZombieProps`, type: `ZombieTypes`, almanac: `ZombieAlmanac` } }), de2 = Pi(e2, { label: `projectiles`, classCandidates: [`commonShot`], spawnMethodCandidates: [`onEnable`, `characterOnEnable`], deathMethodCandidates: [`judgeDeath`, `die`], hitMethodCandidates: [`judgeDeath`, `dealDamage`], actionMethodCandidates: [`shoot`, `move`], featureType: `ProjectileFeatures`, objectTypes: { props: `ProjectileProps`, type: `ProjectileTypes` } }), T2 = Pi(e2, { label: `armor`, classCandidates: [`Armor`], spawnMethodCandidates: [`onEnable`, `characterOnEnable`], deathMethodCandidates: [`playDie`, `die`], hitMethodCandidates: [`dealDamage`, `onDamaged`], featureType: `ArmorFeatures`, objectTypes: { props: `ArmorProps`, type: `ArmorTypes` } }), pe2 = Pi(e2, { label: `armors`, classCandidates: [`Armor`], spawnMethodCandidates: [`onEnable`, `characterOnEnable`], deathMethodCandidates: [`playDie`, `die`], hitMethodCandidates: [`dealDamage`, `onDamaged`], featureType: `ArmorFeatures`, objectTypes: { props: `ArmorProps`, type: `ArmorTypes` } }), me2 = Pi(e2, { label: `dinosaurs`, classCandidates: [`Dinosaur`], spawnMethodCandidates: [`characterOnEnable`, `onEnable`], deathMethodCandidates: [`playDie`, `die`], hitMethodCandidates: [`dealDamage`, `onDamaged`], featureType: `DinosaurFeatures`, objectTypes: { props: `DinosaurProps`, type: `DinosaurTypes` } }), ge2 = ue2.api, _e2 = w2.api, ve2 = de2.api;
  T2.api;
  let ye2 = pe2.api, be2 = me2.api, xe2 = { plants: ue2.behavior, zombies: w2.behavior, projectiles: de2.behavior, armor: T2.behavior, armors: pe2.behavior, dinosaurs: me2.behavior }, Se2 = Mi({ ...xe2, actions: y2 }), E2 = $(e2, `WorldmapFeatures`, { getWorlds(t3 = {}) {
    return Er(e2, t3.useOriginal === true);
  }, getWorld(e3, t3 = {}) {
    return Or(this.getWorlds(t3), e3);
  }, getCurrentWorldScene() {
    return pr();
  }, getCurrentRuntimeMap() {
    return hr();
  }, getCurrentWorld(t3 = {}) {
    return kr(e2, hr(), t3.useOriginal === true);
  }, getCurrentDisplayEnum() {
    return hr()?.displayEnum ?? pr()?.currentWM?.displayEnum ?? null;
  }, mutateWorlds(t3, n2 = {}) {
    return this.mutate((r2, i2) => {
      let a2 = Array.isArray(r2?.WORLDMAPS) ? r2.WORLDMAPS : [], o2 = t3(a2, { ...i2, currentWorld: kr(e2, hr(), n2.useOriginal === true) });
      return o2 === void 0 ? a2 : o2;
    });
  }, patchWorld(e3, t3, n2 = {}) {
    return this.mutateWorlds((r2) => {
      let i2 = Or(r2, e3);
      return !i2 || typeof t3 != `function` ? i2 : t3(i2, { world: i2, worlds: r2, options: n2 }) ?? i2;
    }, n2);
  }, replaceWorldLevels(e3, t3 = []) {
    return this.patchWorld(e3, (e4) => {
      e4.LEVELS = Array.isArray(t3) ? [...t3] : [];
    });
  }, replaceWorldPlants(e3, t3 = []) {
    return this.patchWorld(e3, (e4) => {
      e4.PLANTS = Array.isArray(t3) ? [...t3] : [];
    });
  }, getIslands(e3 = {}) {
    return Pr(e3.runtimeMap || this.getCurrentRuntimeMap());
  }, findIsland(e3, t3 = {}) {
    return q(t3.runtimeMap || this.getCurrentRuntimeMap(), e3);
  }, getIsland(e3, t3 = {}) {
    return this.findIsland(e3, t3);
  }, getIslandOrder(e3 = {}) {
    return this.getIslands(e3).map((e4) => e4.id);
  }, patchIslands(e3, t3 = {}) {
    let n2 = t3.runtimeMap || this.getCurrentRuntimeMap();
    if (!n2 || typeof e3 != `function`) return null;
    let r2 = Pr(n2);
    return e3(r2, { runtimeMap: n2, find: (e4) => q(n2, e4) }) ?? r2;
  }, createNode(e3 = {}, t3 = {}) {
    let n2 = t3.runtimeMap || this.getCurrentRuntimeMap(), r2 = String(e3?.type || ``).trim();
    if (!n2 || !r2) return null;
    let i2 = r2 === `giftBox` || r2 === `epicPortal`, a2 = Kr(n2, e3);
    if (!a2) return null;
    let o2 = oi(r2);
    if (o2 != null && (a2.islandDisplay = o2), r2 === `level`) {
      let t4 = si(e3?.appearance);
      t4 != null && (a2.levelNodeAppearance = t4);
    }
    return qr(a2, r2, e3?.appearance), i2 && Xr(n2, a2), Array.isArray(e3.levels) && r2 === `level` && (a2.levelJsonsID = [...e3.levels]), Array.isArray(e3.portalLevels) && r2 === `epicPortal` && (a2.epicLevelJsonsID = [...e3.portalLevels]), e3.title != null && this.setNodeTitle(a2.__gpnCustomId || jr(a2), e3.title, { runtimeMap: n2 }), e3.plantReward != null && r2 === `plant` && ai(a2, e3.plantReward), e3.upgradeReward != null && r2 === `upgrade` && ci(a2, e3.upgradeReward), e3.position && typeof e3.position == `object` && Br(a2, e3.position), i2 && Yr(n2, a2, r2), Zr(a2), Jr(a2, r2) ? (zr(t3) && (Rr(n2), J(n2)), { id: a2.__gpnCustomId || jr(a2), customId: a2.__gpnCustomId ? String(a2.__gpnCustomId) : null, type: Ar(a2), raw: a2, islandNode: a2?.islandNode ?? null }) : (n2.levelIslands = (n2.levelIslands || []).filter((e4) => e4 !== a2), Qr(a2), null);
  }, removeNode(e3, t3 = {}) {
    let n2 = t3.runtimeMap || this.getCurrentRuntimeMap(), r2 = q(n2, e3)?.raw;
    if (!n2 || !r2) return false;
    for (let e4 of n2.levelIslands || []) if (!(!e4 || e4 === r2)) if (e4.nextIsland === r2.islandNode) {
      let t4 = Array.isArray(e4.otherNextIslands) ? [...e4.otherNextIslands] : [];
      e4.nextIsland = t4.shift() ?? null, e4.otherNextIslands = t4.filter((e5) => e5 !== r2.islandNode);
    } else e4.otherNextIslands = (e4.otherNextIslands || []).filter((e5) => e5 !== r2.islandNode);
    return n2.levelIslands = (n2.levelIslands || []).filter((e4) => e4 !== r2), Qr(r2), ti(n2), zr(t3) && (Rr(n2), J(n2), ti(n2)), true;
  }, cleanupOrphanNodes(e3 = {}) {
    let t3 = e3.runtimeMap || this.getCurrentRuntimeMap();
    return t3 ? ti(t3) : false;
  }, setNodeTitle(e3, t3, n2 = {}) {
    let r2 = q(n2.runtimeMap || this.getCurrentRuntimeMap(), e3)?.raw;
    if (!r2) return null;
    r2.levelNodeName = String(t3 ?? ``);
    let i2 = l()?.Label, a2 = r2?._levelNode?.getChildByName?.(`title`), o2 = typeof i2 == `function` ? a2?.getComponent?.(i2) : null;
    return o2 && (o2.string = r2.levelNodeName), r2.levelNodeName;
  }, setChildren(e3, t3 = [], n2 = {}) {
    let r2 = n2.runtimeMap || this.getCurrentRuntimeMap(), i2 = q(r2, e3)?.raw;
    if (!r2 || !i2) return false;
    let a2 = (Array.isArray(t3) ? t3 : [t3]).map((e4) => q(r2, e4)?.raw?.islandNode).filter(Boolean);
    return i2.nextIsland = a2[0] ?? null, i2.otherNextIslands = a2.slice(1), zr(n2) && J(r2), true;
  }, refreshPaths(e3 = {}) {
    let t3 = e3.runtimeMap || this.getCurrentRuntimeMap();
    return t3 ? (Rr(t3), J(t3), true) : false;
  }, relayout(e3, t3 = {}, n2 = {}) {
    let r2 = n2.runtimeMap || this.getCurrentRuntimeMap(), i2 = q(r2, e3);
    if (!r2 || !i2) return null;
    let a2 = Br(i2.raw, t3);
    return zr(n2) && (Rr(r2), J(r2)), a2;
  }, checkOverlap(e3, t3 = {}) {
    let n2 = t3.runtimeMap || this.getCurrentRuntimeMap(), r2 = q(n2, e3)?.raw;
    return ni(n2, r2, Number(t3.threshold || 100));
  }, setIslandPosition(e3, t3 = {}, n2 = {}) {
    return this.relayout(e3, t3, n2);
  }, link(e3, t3, n2 = {}) {
    let r2 = n2.runtimeMap || this.getCurrentRuntimeMap(), i2 = q(r2, e3), a2 = q(r2, t3);
    if (!r2 || !i2?.raw || !a2?.raw?.islandNode) return false;
    let o2 = i2.raw, s3 = a2.raw.islandNode;
    return n2.exclusive === true ? (o2.nextIsland = s3, o2.otherNextIslands = []) : !o2.nextIsland || n2.replacePrimary === true ? (o2.nextIsland && o2.nextIsland !== s3 && (o2.otherNextIslands = [o2.nextIsland, ...o2.otherNextIslands || []].filter((e4, t4, n3) => e4 && n3.indexOf(e4) === t4 && e4 !== s3)), o2.nextIsland = s3) : [o2.nextIsland, ...o2.otherNextIslands || []].includes(s3) || (o2.otherNextIslands = [...o2.otherNextIslands || [], s3]), zr(n2) && J(r2), true;
  }, unlink(e3, t3, n2 = {}) {
    let r2 = n2.runtimeMap || this.getCurrentRuntimeMap(), i2 = q(r2, e3), a2 = q(r2, t3);
    if (!r2 || !i2?.raw || !a2?.raw?.islandNode) return false;
    let o2 = a2.raw.islandNode;
    if (i2.raw.nextIsland === o2) {
      let e4 = Array.isArray(i2.raw.otherNextIslands) ? [...i2.raw.otherNextIslands] : [];
      i2.raw.nextIsland = e4.shift() ?? null, i2.raw.otherNextIslands = e4;
    } else i2.raw.otherNextIslands = (i2.raw.otherNextIslands || []).filter((e4) => e4 !== o2);
    return zr(n2) && J(r2), true;
  }, setPathSequence(e3 = [], t3 = {}) {
    let n2 = t3.runtimeMap || this.getCurrentRuntimeMap();
    if (!n2 || !Array.isArray(e3) || e3.length < 2) return false;
    let r2 = e3.map((e4) => q(n2, e4)).filter(Boolean);
    if (r2.length < 2) return false;
    for (let e4 = 0; e4 < r2.length - 1; e4++) {
      let t4 = r2[e4]?.raw, n3 = r2[e4 + 1]?.raw?.islandNode;
      !t4 || !n3 || (t4.nextIsland = n3, t4.otherNextIslands = []);
    }
    if (t3.keepTail !== true) {
      let e4 = r2[r2.length - 1]?.raw;
      e4 && (e4.nextIsland = null, e4.otherNextIslands = []);
    }
    return zr(t3) && J(n2), true;
  }, setPlantReward(e3, t3, n2 = {}) {
    let r2 = q(n2.runtimeMap || this.getCurrentRuntimeMap(), e3)?.raw;
    return ai(r2, t3);
  }, setUpgradeReward(e3, t3, n2 = {}) {
    let r2 = q(n2.runtimeMap || this.getCurrentRuntimeMap(), e3)?.raw;
    return ci(r2, t3);
  }, onWorldLoaded(t3, n2 = {}) {
    let r2 = mr();
    return !r2?.prototype?.init || typeof e2?.behaviorTools?.wrapMethod != `function` ? () => {
    } : e2.behaviorTools.wrapMethod({ target: r2.prototype, methodName: `init`, handler: ({ thisArg: r3, args: i2, callNext: a2 }) => {
      let o2 = () => {
        let i3 = kr(e2, r3), a3 = { runtimeMap: r3, world: i3, worldId: i3?.CODENAME ?? wr(vr(), r3?.displayEnum) ?? null, displayEnum: r3?.displayEnum ?? null, islands: Pr(r3), api: this };
        typeof n2.filter == `function` && n2.filter(a3) !== true || t3(a3);
      }, s3 = a2(...i2);
      return s3?.then && typeof s3.then == `function` ? s3.then((e3) => (o2(), e3)) : (o2(), s3);
    } });
  } }), Ce2 = { getName: () => f2.getName(), is: (e3) => f2.is(e3) }, we2 = { setSpeedUp: (e3) => g2.setSpeedUp(e3), getFrameRate: () => g2.getFrameRate(), setFrameRate: (e3) => g2.setFrameRate(e3), getState: () => c2(), watchState(t3, n2 = {}) {
    if (typeof t3 != `function`) throw Error(`game.watchState() requires a listener`);
    let r2 = e2.runtime;
    if (!r2?.setInterval || !r2?.track) throw Error(`game.watchState() requires a managed mod runtime`);
    n2 = n2 && typeof n2 == `object` ? n2 : {};
    let i2 = Math.max(50, Math.min(1e4, Number(n2.intervalMs) || 100)), a2 = [`available`, `sceneName`, `levelName`, `phase`, `started`, `running`, `paused`, `ended`, `outcome`], o2 = true, s3 = false, l2 = null, u2 = null, d3 = et({ runtime: r2, signal: n2.signal, label: n2.label || `game state watch`, onCancel() {
      o2 = false, l2 = null, u2?.();
    } });
    if (!d3.active) return d3.cancel;
    let f3 = () => {
      try {
        return typeof r2.isActive != `function` || r2.isActive() !== false;
      } catch {
        return false;
      }
    }, p3 = async () => {
      if (!(!o2 || s3 || !f3())) {
        s3 = true;
        try {
          let e3 = c2(), r3 = l2 ? a2.filter((t4) => l2[t4] !== e3[t4]) : a2, i3 = l2;
          if (l2 = e3, !i3 && n2.emitInitial === false || i3 && r3.length === 0) return;
          await t3(Object.freeze({ type: i3 ? `changed` : `initial`, changes: Object.freeze(r3), previous: i3, current: e3, timestamp: Date.now() }));
        } finally {
          s3 = false;
        }
      }
    };
    return r2.track(p3(), { label: n2.label || `game state initial scan` }), u2 = r2.setInterval(p3, i2, { label: n2.label || `game state watch` }), d3.cancel;
  } }, Te2 = { getProperty: (...e3) => m2.getProperty(...e3), setProperty: (...e3) => m2.setProperty(...e3), addProperty: (...e3) => m2.addProperty(...e3), getCurrency: (...e3) => m2.getCurrency(...e3), setCurrency: (...e3) => m2.setCurrency(...e3), addCurrency: (...e3) => m2.addCurrency(...e3), addSun: (...e3) => m2.addSun(...e3), setSun: (...e3) => m2.setSun(...e3), addPlantFood: (...e3) => m2.addPlantFood(...e3), setPlantFood: (...e3) => m2.setPlantFood(...e3) }, Ee2 = { getCurrentLevelName: () => p2.getCurrentLevelName(), getDefinition: (...t3) => B(e2, p2.getDefinition(...t3)), getOriginalDefinition: (...t3) => B(e2, p2.getOriginalDefinition(...t3)), mutateDefinition: (...e3) => p2.mutateDefinition(...e3), getModulesData: (...t3) => B(e2, p2.getModulesData(...t3)), mutateModules: (...e3) => p2.mutateModules(...e3), onLevelLoaded(e3) {
    if (typeof e3 != `function`) throw Error(`levels.onLevelLoaded() requires a listener`);
    return p2.onLevelLoaded((t3) => e3(Object.freeze({ sceneName: t3?.sceneName ?? null, levelName: t3?.levelName ?? null })));
  } }, De2 = { getLyrics: () => B(e2, _2.getLyrics()), getCurrentLanguage: () => _2.getCurrentLanguage(), setCurrentLanguage: (e3) => _2.setCurrentLanguage(e3), export: (...e3) => _2.export(...e3) }, Oe2 = { getData: (...t3) => B(e2, E2.getData(...t3)), listEntries: (...t3) => B(e2, E2.listEntries(...t3)), getEntry: (...t3) => B(e2, E2.getEntry(...t3)), mutate: (...e3) => E2.mutate(...e3), export: (...e3) => E2.export(...e3), getWorlds: (...t3) => B(e2, E2.getWorlds(...t3)), getWorld: (...t3) => B(e2, E2.getWorld(...t3)), mutateWorlds: (...e3) => E2.mutateWorlds(...e3), patchWorld: (...e3) => E2.patchWorld(...e3), replaceWorldLevels: (...e3) => E2.replaceWorldLevels(...e3), replaceWorldPlants: (...e3) => E2.replaceWorldPlants(...e3) }, ke2 = { list: (...e3) => S2.list(...e3), findNearest: (...e3) => S2.findNearest(...e3), describe: (...e3) => S2.describe(...e3), listInLane: (...e3) => S2.listInLane(...e3), listInCell: (...e3) => S2.listInCell(...e3), watch: (...e3) => S2.watch(...e3), watchHealth: (...e3) => S2.watchHealth(...e3), getCapabilities: (...e3) => S2.getCapabilities(...e3), supports: (...e3) => S2.supports(...e3), isAlive: (...e3) => S2.isAlive(...e3) }, Ae2 = (e3) => Object.freeze({ available: false, adapters: Object.freeze([]), teams: Object.freeze([]), reason: e3 }), je2 = { getState(e3) {
    if (!L(e3)) return Object.freeze({ team: `unknown`, targetTeam: `unknown` });
    if (Bn(e3)) {
      let t3 = e3.snapshot();
      return Object.freeze({ team: P(t3?.team) || `unknown`, targetTeam: P(t3?.targetTeam) || `unknown` });
    }
    return x2.getState(e3);
  }, getCapabilities(e3) {
    let t3 = L(e3);
    if (!t3 || Bn(e3)) {
      let e4 = t3 ? `entity-inactive` : `entity-handle-required`;
      return Object.freeze({ identity: Ae2(e4), targeting: Ae2(e4) });
    }
    return x2.getCapabilities(e3);
  }, supports(e3, t3) {
    let n2 = String(t3 || ``).trim().toLowerCase();
    return n2 !== `identity` && n2 !== `targeting` ? false : je2.getCapabilities(e3)[n2].available;
  } }, Me2 = (e3, t3) => {
    if (e3 == null || t3 == null) return null;
    let n2 = Number(e3), r2 = Number(t3);
    return !Number.isInteger(n2) || !Number.isInteger(r2) ? null : Object.freeze({ laneIndex: n2, columnIndex: r2 });
  }, D2 = (e3) => {
    if (!e3) return null;
    if (L(e3) && typeof e3.snapshot == `function`) {
      let t4 = e3.snapshot();
      return Me2(t4?.laneIndex, t4?.columnIndex);
    }
    let t3 = v2.describe(R(e3));
    return Me2(t3?.laneIndex, t3?.columnIndex);
  }, Ne2 = { getCell(e3, t3) {
    let n2 = Me2(e3, t3);
    if (!n2) return null;
    let r2 = v2.getCell(n2.laneIndex, n2.columnIndex);
    return r2 ? D2(r2) || n2 : null;
  }, resolveCell(e3) {
    return D2(e3);
  }, listCells(e3 = {}) {
    e3 = e3 && typeof e3 == `object` ? e3 : {};
    let t3 = new Set((Array.isArray(e3.laneIndexes) ? e3.laneIndexes : e3.laneIndex == null ? [] : [e3.laneIndex]).map(Number).filter(Number.isInteger)), n2 = new Set((Array.isArray(e3.columnIndexes) ? e3.columnIndexes : e3.columnIndex == null ? [] : [e3.columnIndex]).map(Number).filter(Number.isInteger)), r2 = typeof e3.filter == `function` ? e3.filter : null, i2 = /* @__PURE__ */ new Set(), a2 = [];
    for (let e4 of v2.getCells()) {
      let o2 = D2(e4);
      if (!o2) continue;
      let s3 = `${o2.laneIndex}:${o2.columnIndex}`;
      i2.has(s3) || t3.size > 0 && !t3.has(o2.laneIndex) || n2.size > 0 && !n2.has(o2.columnIndex) || r2 && r2(o2) === false || (i2.add(s3), a2.push(o2));
    }
    return Object.freeze(a2);
  }, getNeighbors(e3, t3 = {}) {
    t3 = t3 && typeof t3 == `object` ? t3 : {};
    let n2 = D2(e3);
    if (!n2) return Object.freeze([]);
    let r2 = Number(t3.distance ?? 1), i2 = Number.isFinite(r2) ? Math.max(1, Math.min(64, Math.floor(r2))) : 1, a2 = t3.diagonals !== false, o2 = t3.includeSelf === true, s3 = [];
    for (let e4 = -i2; e4 <= i2; e4++) for (let t4 = -i2; t4 <= i2; t4++) {
      if (!o2 && e4 === 0 && t4 === 0 || !a2 && e4 !== 0 && t4 !== 0) continue;
      let r3 = this.getCell(n2.laneIndex + e4, n2.columnIndex + t4);
      r3 && s3.push(r3);
    }
    return Object.freeze(s3);
  }, isSameCell(e3, t3) {
    let n2 = D2(e3), r2 = D2(t3);
    return !!n2 && !!r2 && n2.laneIndex === r2.laneIndex && n2.columnIndex === r2.columnIndex;
  }, distance(e3, t3, n2 = `euclidean`) {
    let r2 = D2(e3), i2 = D2(t3);
    if (!r2 || !i2) return null;
    let a2 = Math.abs(r2.laneIndex - i2.laneIndex), o2 = Math.abs(r2.columnIndex - i2.columnIndex);
    switch (String(n2 || `euclidean`)) {
      case `manhattan`:
        return a2 + o2;
      case `chebyshev`:
        return Math.max(a2, o2);
      case `euclidean`:
        return Math.sqrt(a2 ** 2 + o2 ** 2);
      default:
        return null;
    }
  } }, Pe2 = { getCapabilities: (...e3) => y2.getCapabilities(...e3), supports: (...e3) => y2.supports(...e3), damage: (...e3) => y2.damage(...e3), heal: (...e3) => y2.heal(...e3), eliminate: (...e3) => y2.eliminate(...e3), collect: (...e3) => y2.collect(...e3), moveToCell: (...e3) => y2.moveToCell(...e3), isAlive: (...e3) => y2.isAlive(...e3) }, Fe2 = { board: v2, combat: Se2, behaviors: xe2, entities: S2, actions: y2, scenes: f2, game: g2, player: m2, levels: p2, worldMap: E2, localization: _2, debug: { snapshot(t3) {
    return z(V(e2, t3));
  } } };
  return { content: d2, clock: s2, scenes: Ce2, game: we2, localization: De2, board: Ne2, entities: ke2, teams: je2, combat: C2.api, actions: Pe2, spawns: re2, status: ce2, impacts: le2, player: Te2, plants: ge2, zombies: _e2, projectiles: ve2, armors: ye2, dinosaurs: be2, tiles: $(e2, `TilesFeatures`, { getPropsData(t3 = {}) {
    return B(e2, t3.useOriginal === true ? H(e2, `TileProps`) : V(e2, `TileProps`));
  }, mutateProps(t3) {
    return U(e2, `TileProps`, t3);
  } }), tileLiquids: $(e2, `TileLiquidsFeatures`, { getPropsData(t3 = {}) {
    return B(e2, t3.useOriginal === true ? H(e2, `TileLiquidProps`) : V(e2, `TileLiquidProps`));
  }, mutateProps(t3) {
    return U(e2, `TileLiquidProps`, t3);
  } }), tombs: $(e2, `TombstonesFeatures`, { getPropsData(t3 = {}) {
    return B(e2, t3.useOriginal === true ? H(e2, `TombstoneProps`) : V(e2, `TombstoneProps`));
  }, mutateProps(t3) {
    return U(e2, `TombstoneProps`, t3);
  } }), lawns: $(e2, `LawnFeatures`, { getPropsData(t3 = {}) {
    return B(e2, t3.useOriginal === true ? H(e2, `LawnProps`) : V(e2, `LawnProps`));
  }, getBoardGridMaps(t3 = {}) {
    return B(e2, t3.useOriginal === true ? H(e2, `BoardGridMaps`) : V(e2, `BoardGridMaps`));
  }, mutateProps(t3) {
    return U(e2, `LawnProps`, t3);
  }, mutateBoardGridMaps(t3) {
    return U(e2, `BoardGridMaps`, t3);
  } }), levels: Ee2, levelModules: $(e2, `LevelModules`), worldMap: Oe2, shop: $(e2, `StoreCommodityFeatures`, { getCommodities(t3, n2 = {}) {
    let r2 = n2.useOriginal === true ? H(e2, `StoreCommodityFeatures`) : V(e2, `StoreCommodityFeatures`);
    return B(e2, Array.isArray(r2?.[t3]) ? r2[t3] : []);
  }, getCommodity(e3, t3, n2 = {}) {
    return this.getCommodities(e3, n2).find((e4) => String(e4?.CommodityName) === String(t3 || ``)) ?? null;
  } }), upgrades: $(e2, `UpgradeFeatures`, { getRoutes(t3 = {}) {
    return B(e2, t3.useOriginal === true ? H(e2, `MintObtainRoute`) : V(e2, `MintObtainRoute`));
  }, mutateRoutes(t3) {
    return U(e2, `MintObtainRoute`, t3);
  } }), trophies: $(e2, `TrophyFeatures`), garden: { getState() {
    return B(e2, m2.getZenGardenState());
  }, mutateState(e3) {
    return m2.mutateZenGarden(e3);
  }, finishAllGrowth() {
    return m2.mutateZenGarden((e3) => {
      let t3 = 1e9;
      for (let n2 of [`plantsInMain`, `plantsInMushroom`, `plantsInBeach`, `plantsInNight`]) for (let r2 of Array.isArray(e3?.[n2]) ? e3[n2] : []) !r2 || typeof r2 != `object` || (r2.grownTime = t3, r2.stuck = false, r2.waterCD = t3);
      e3?.plantInCart && (e3.plantInCart.grownTime = t3, e3.plantInCart.stuck = false);
    });
  } }, gameMetadata: { propertySheets: $(e2, `PropertySheets`), narrative: $(e2, `NarrativeList`) }, advanced: Fe2 };
}
export {
  Nn as n,
  et as r,
  Fi as t
};
