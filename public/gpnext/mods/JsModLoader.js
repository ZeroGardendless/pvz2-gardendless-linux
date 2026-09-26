import { t as e } from "../core/Preload.js";
import { t } from "../core/Logger.js";
import { a as n, c as r, f as i, m as a, n as o, p as s, s as c, v as l } from "../runtime/Engine.js";
import { n as u } from "../ui/Toast.js";
import { c as d, d as f, o as p, r as m, s as h, t as g, u as _ } from "../platform/FileSystem.js";
import { F as ee, l as v } from "./FileLoader.js";
import { n as y } from "./ModVersion.js";
import { a as b, o as x, r as S } from "./ModOperationPlan.js";
import { i as C, n as te, r as ne } from "./ModPackPreflight.js";
import { r as re } from "./ModSettingsRegistry.js";
import { t as ie } from "./ModControlsRegistry.js";
import { n as ae, r as w, t as oe } from "./ModApi.js";
import { NATIVE_PLAYER_SAVE_KEY } from "./ModSaveProtection.js";
function ce(e2) {
  let t2 = /* @__PURE__ */ new Map(), n2 = [], r2 = `collecting`, i2 = () => {
    if (r2 !== `collecting`) throw Error(`Startup registration is closed`);
  }, a2 = (e3, t3) => {
    if (typeof t3 != `string` || !/^[a-zA-Z][a-zA-Z0-9_.-]*$/.test(t3)) throw Error(`Invalid registration id`);
    return `${e3}:${t3}`;
  };
  return { context(o2) {
    let s2 = o2.namespace, c2 = () => o2.scope.assertActive(`startup`);
    return { engine: Object.freeze(Object.fromEntries([`getCc`, `getClassByName`, `getSystemModule`, `getModuleExport`].map((t3) => [t3, (...n3) => {
      if (c2(), ![`collecting`, `preparing`].includes(r2)) throw Error(`Startup engine access is closed`);
      return e2[t3](...n3);
    }]))), registry: Object.freeze({ provide(e3, n3) {
      c2(), i2();
      let r3 = a2(s2, e3);
      if (t2.has(r3)) throw Error(`Duplicate registration: ${r3}`);
      t2.set(r3, n3);
    }, resolve(e3, n3) {
      if (c2(), i2(), e3 !== s2 && ![...o2.pack.meta.depends || [], ...o2.pack.meta.optionalDepends || []].includes(e3)) throw Error(`Registry provider requires a direct dependency`);
      let r3 = a2(e3, n3);
      if (!t2.has(r3)) throw Error(`Registration unavailable: ${r3}`);
      return t2.get(r3);
    } }), registrations: Object.freeze({ add(e3, t3) {
      c2(), i2();
      let r3 = a2(s2, e3);
      if (n2.some((e4) => e4.name === r3)) throw Error(`Duplicate registration: ${r3}`);
      if (!t3 || typeof t3.prepare != `function` || typeof t3.publish != `function` || typeof t3.dispose != `function`) throw Error(`Registration requires prepare, publish and dispose`);
      n2.push({ name: r3, registration: t3, prepared: false });
    } }) };
  }, seal() {
    i2(), r2 = `collected`;
  }, async prepare(e3) {
    if (![`collecting`, `collected`].includes(r2)) throw Error(`Startup registration is closed`);
    r2 = `preparing`;
    let t3 = [...e3.identities];
    for (let r3 of n2) {
      r3.prepared = true;
      let n3 = await r3.registration.prepare(Object.freeze({ previousIdentities: structuredClone(e3.previousIdentities), identities: structuredClone(t3) }));
      n3?.identities && t3.push(...structuredClone(n3.identities));
    }
    return r2 = `ready`, t3;
  }, publish() {
    if (r2 !== `ready`) throw Error(`Startup registrations are not ready`);
    r2 = `published`;
    for (let { registration: e3 } of n2) if (e3.publish()?.then) throw Error(`Startup publication must be synchronous`);
  }, getResources() {
    return n2.flatMap(({ registration: e3 }) => e3.getResources?.() || []);
  }, async dispose() {
    if (r2 === `published`) throw Error(`Published startup registrations require restart`);
    if (r2 === `disposed`) return;
    r2 = `disposed`;
    let e3 = [];
    for (let { registration: t3, prepared: r3 } of [...n2].reverse()) if (r3) try {
      await t3.dispose();
    } catch (t4) {
      e3.push(t4);
    }
    if (t2.clear(), e3.length) throw AggregateError(e3, `Startup registration cleanup failed`);
  } };
}
function le() {
  let e2 = /* @__PURE__ */ new WeakMap(), t2 = /* @__PURE__ */ new Map(), n2 = /* @__PURE__ */ new Set(), r2 = 1, i2 = 0, a2 = 0, o2 = (o3, s2, c2, l2 = false) => {
    if (o3.scope.assertActive(`content access`), !c2 || typeof c2 != `object`) return;
    e2.has(c2) || e2.set(c2, r2++);
    let u2 = e2.get(c2);
    if (n2.has(u2)) throw Error(`Data provider is retiring`);
    t2.has(o3) || (t2.set(o3, /* @__PURE__ */ new Map()), o3.scope.signal.addEventListener(`abort`, () => {
      t2.delete(o3), a2++;
    }, { once: true }));
    let d2 = t2.get(o3);
    d2.has(u2) || (d2.set(u2, { objectId: u2, type: String(s2), writeOrder: null }), a2++), l2 && d2.get(u2).writeOrder === null && (d2.get(u2).writeOrder = ++i2, a2++);
  };
  return Object.freeze({ read: (e3, t3, n3) => o2(e3, t3, n3), write: (e3, t3, n3) => o2(e3, t3, n3, true), getConsumers() {
    let e3 = /* @__PURE__ */ new Map(), n3 = [], r3 = [];
    for (let [n4, i4] of t2) for (let t3 of i4.values()) {
      let i5 = { ...t3, namespace: n4.namespace, runtimeGeneration: n4.generation, contentDigest: n4.pack.contentDigest };
      r3.push(Object.freeze(i5)), e3.has(t3.objectId) || e3.set(t3.objectId, []), e3.get(t3.objectId).push(i5);
    }
    let i3 = (e4, t3, n4) => Object.freeze({ provider: e4.namespace, consumer: t3.namespace, kind: n4, objectId: e4.objectId, type: e4.type, providerDigest: e4.contentDigest, consumerDigest: t3.contentDigest, providerGeneration: e4.runtimeGeneration, consumerGeneration: t3.runtimeGeneration });
    for (let t3 of e3.values()) {
      let e4 = t3.filter((e5) => e5.writeOrder !== null).sort((e5, t4) => e5.writeOrder - t4.writeOrder);
      for (let r4 of e4) for (let e5 of t3) e5 !== r4 && n3.push(i3(r4, e5, `data-observation`));
      for (let t4 = 1; t4 < e4.length; t4++) n3.push(i3(e4[t4 - 1], e4[t4], `data-snapshot-order`));
    }
    return Object.freeze({ domain: `data`, coverage: `managed-api-only`, complete: false, revision: a2, accesses: Object.freeze(r3), edges: Object.freeze(n3) });
  }, closeAdmission(e3) {
    let r3 = /* @__PURE__ */ new Set();
    for (let [n3, i3] of t2) if (e3.has(n3.namespace)) for (let e4 of i3.values()) e4.writeOrder !== null && r3.add(e4.objectId);
    if ([...r3].some((e4) => n2.has(e4))) throw Error(`Data provider is already retiring`);
    for (let e4 of r3) n2.add(e4);
    return () => {
      for (let e4 of r3) n2.delete(e4);
    };
  } });
}
function ue() {
  let e2 = /* @__PURE__ */ new Map(), t2 = /* @__PURE__ */ new Set(), n2 = 0, r2 = (r3, i2, a2) => {
    if (r3.scope.assertActive(`event access`), t2.has(i2)) throw Error(`Event provider is retiring`);
    e2.has(r3) || (e2.set(r3, { publish: /* @__PURE__ */ new Set(), subscribe: /* @__PURE__ */ new Set() }), r3.scope.signal.addEventListener(`abort`, () => {
      e2.delete(r3), n2++;
    }, { once: true }));
    let o2 = e2.get(r3)[a2];
    o2.has(i2) || (o2.add(i2), n2++);
  };
  return Object.freeze({ publish: (e3, t3) => r2(e3, t3, `publish`), subscribe: (e3, t3) => r2(e3, t3, `subscribe`), getConsumers() {
    let t3 = [];
    for (let [n3, r3] of e2) for (let i2 of r3.publish) for (let [r4, a2] of e2) r4 !== n3 && a2.subscribe.has(i2) && t3.push(Object.freeze({ provider: n3.namespace, consumer: r4.namespace, kind: `event-observation`, event: i2, providerGeneration: n3.generation, consumerGeneration: r4.generation, providerDigest: n3.pack.contentDigest, consumerDigest: r4.pack.contentDigest }));
    return Object.freeze({ domain: `events`, coverage: `managed-event-bus-only`, complete: false, revision: n2, edges: Object.freeze(t3) });
  }, closeAdmission(n3) {
    let r3 = /* @__PURE__ */ new Set();
    for (let [t3, i2] of e2) if (n3.has(t3.namespace)) for (let e3 of i2.publish) r3.add(e3);
    if ([...r3].some((e3) => t2.has(e3))) throw Error(`Event provider is already retiring`);
    for (let e3 of r3) t2.add(e3);
    return () => {
      for (let e3 of r3) t2.delete(e3);
    };
  } });
}
function de({ clone: e2, restore: t2 }) {
  let n2 = /* @__PURE__ */ new WeakMap();
  return Object.freeze({ capture(r2) {
    let i2 = { snapshot: e2(r2), retired: false }, a2 = n2.get(r2) || [];
    a2.push(i2), n2.set(r2, a2);
    let o2 = false;
    return () => {
      if (o2) return;
      i2.retired = true;
      let e3 = a2.length;
      for (; e3 > 0 && a2[e3 - 1].retired; ) e3--;
      e3 < a2.length && (t2(r2, a2[e3].snapshot), a2.splice(e3), a2.length || n2.delete(r2)), o2 = true;
    };
  } });
}
var fe = class {
  constructor(e2 = {}) {
    this._listeners = /* @__PURE__ */ new Map(), this._onError = typeof e2.onError == `function` ? e2.onError : null;
  }
  _report(e2, t2, n2) {
    try {
      this._onError?.(e2, { eventName: t2, listener: n2 });
    } catch {
    }
  }
  on(e2, t2, n2 = {}) {
    let r2 = String(e2 || ``);
    if (!r2 || typeof t2 != `function`) return () => {
    };
    this._listeners.has(r2) || this._listeners.set(r2, /* @__PURE__ */ new Set());
    let i2 = this._listeners.get(r2), a2 = true, o2 = n2.once === true ? (...e3) => (s2(), t2(...e3)) : t2, s2 = () => a2 ? (a2 = false, i2.delete(o2), i2.size === 0 && this._listeners.delete(r2), n2.signal?.removeEventListener?.(`abort`, s2), true) : false;
    return n2.signal?.aborted ? s2 : (i2.add(o2), n2.signal?.addEventListener?.(`abort`, s2, { once: true }), s2);
  }
  once(e2, t2, n2 = {}) {
    return this.on(e2, t2, { ...n2, once: true });
  }
  emit(e2, ...t2) {
    let n2 = String(e2 || ``), r2 = this._listeners.get(n2), i2 = { eventName: n2, delivered: 0, pending: 0, errors: [] };
    if (!r2 || r2.size === 0) return i2;
    for (let e3 of [...r2]) try {
      let r3 = e3(...t2);
      i2.delivered += 1, r3?.then && typeof r3.then == `function` && (i2.pending += 1, Promise.resolve(r3).catch((t3) => {
        i2.errors.push(t3), this._report(t3, n2, e3);
      }));
    } catch (t3) {
      i2.errors.push(t3), this._report(t3, n2, e3);
    }
    return i2;
  }
  async emitAsync(e2, ...t2) {
    let n2 = String(e2 || ``), r2 = this._listeners.get(n2), i2 = { eventName: n2, delivered: 0, errors: [] };
    if (!r2 || r2.size === 0) return i2;
    for (let e3 of [...r2]) try {
      await e3(...t2), i2.delivered += 1;
    } catch (t3) {
      i2.errors.push(t3), this._report(t3, n2, e3);
    }
    return i2;
  }
  listenerCount(e2) {
    return this._listeners.get(String(e2 || ``))?.size || 0;
  }
  getListenerCounts() {
    return Object.fromEntries([...this._listeners.entries()].filter(([, e2]) => e2.size > 0).map(([e2, t2]) => [e2, t2.size]));
  }
  clear() {
    this._listeners.clear();
  }
}, T = new t(`hook-manager`);
function E(e2) {
  return String(e2 || `anonymous-mod`);
}
function D(e2) {
  return String(e2 || ``);
}
function O(e2, t2) {
  let n2 = e2;
  for (; n2; ) {
    let e3 = Object.getOwnPropertyDescriptor(n2, t2);
    if (e3) return { owner: n2, descriptor: e3 };
    n2 = Object.getPrototypeOf(n2);
  }
  return null;
}
var pe = class {
  constructor() {
    this._methodRecords = /* @__PURE__ */ new WeakMap(), this._propertyRecords = /* @__PURE__ */ new WeakMap(), this._records = /* @__PURE__ */ new Set(), this._targetIds = /* @__PURE__ */ new WeakMap(), this._nextTargetId = 1, this._nextHookId = 1, this._revision = 0, this._retiringTargets = /* @__PURE__ */ new WeakMap();
  }
  _targetId(e2) {
    return this._targetIds.has(e2) || this._targetIds.set(e2, this._nextTargetId++), this._targetIds.get(e2);
  }
  _sortedHooks(e2) {
    return [...e2.hooks].sort((e3, t2) => e3.priority === t2.priority ? e3.order - t2.order : t2.priority - e3.priority);
  }
  _getTargetRecord(e2, t2, n2) {
    return e2.get(t2)?.get(n2) || null;
  }
  _setTargetRecord(e2, t2, n2, r2) {
    e2.has(t2) || e2.set(t2, /* @__PURE__ */ new Map()), e2.get(t2).set(n2, r2), this._records.add(r2);
  }
  _deleteTargetRecord(e2, t2, n2, r2) {
    let i2 = e2.get(t2);
    i2?.delete(n2), i2?.size === 0 && e2.delete(t2), this._records.delete(r2);
  }
  _recordSummary(e2) {
    let t2 = [...new Set(e2.hooks.map((e3) => e3.owner))];
    return { key: e2.key, kind: e2.kind, count: e2.hooks.length, owners: t2, hooks: this._sortedHooks(e2).map((e3) => ({ owner: e3.owner, priority: e3.priority, id: e3.id })) };
  }
  getHooks() {
    return [...this._records].filter((e2) => e2.hooks.length > 0).map((e2) => this._recordSummary(e2));
  }
  getConflicts() {
    return this.getHooks().filter((e2) => e2.count > 1);
  }
  getConsumers() {
    let e2 = [];
    for (let t2 of this._records) {
      let n2 = [...new Set(t2.hooks.map((e3) => e3.owner))], r2 = this._targetId(t2.host || t2.target);
      for (let i2 of n2) for (let a2 of n2) i2 !== a2 && e2.push(Object.freeze({ provider: i2, consumer: a2, kind: `hook-sharing`, targetId: r2, key: t2.key }));
    }
    return Object.freeze({ domain: `hooks`, coverage: `managed-method-property-hooks`, complete: false, revision: this._revision, edges: Object.freeze(e2) });
  }
  _assertAdmission(e2, t2) {
    if (this._retiringTargets.get(e2)?.has(t2)) throw Error(`Hook target is retiring`);
  }
  closeOwnerAdmission(e2) {
    let t2 = /* @__PURE__ */ new Map();
    for (let n2 of this._records) if (n2.hooks.some((t3) => e2.has(t3.owner))) {
      let e3 = n2.host || n2.target, r2 = n2.methodName || n2.property;
      this._assertAdmission(e3, r2), t2.has(e3) || t2.set(e3, /* @__PURE__ */ new Set()), t2.get(e3).add(r2);
    }
    for (let [e3, n2] of t2) {
      this._retiringTargets.has(e3) || this._retiringTargets.set(e3, /* @__PURE__ */ new Set());
      for (let t3 of n2) this._retiringTargets.get(e3).add(t3);
    }
    return () => {
      for (let [e3, n2] of t2) {
        let t3 = this._retiringTargets.get(e3);
        for (let e4 of n2) t3?.delete(e4);
        t3?.size || this._retiringTargets.delete(e3);
      }
    };
  }
  wrapMethod({ owner: e2, className: t2, target: n2, methodName: i2, handler: a2, isStatic: o2 = false, priority: s2 = 0 }) {
    let c2 = E(e2), l2 = D(i2);
    if (!l2) throw Error(`wrapMethod() requires methodName`);
    if (typeof a2 != `function`) throw Error(`wrapMethod() requires handler`);
    let u2 = n2;
    if (!u2 && t2) {
      let e3 = r(t2);
      u2 = o2 ? e3 : e3?.prototype;
    }
    if (!u2) throw Error(`wrapMethod() target not found for ${t2 || `<custom target>`}.${l2}`);
    this._assertAdmission(u2, l2);
    let d2 = this._getTargetRecord(this._methodRecords, u2, l2);
    if (!d2) {
      let e3 = O(u2, l2), n3 = u2[l2];
      if (typeof n3 != `function`) throw Error(`wrapMethod() target ${l2} is not a function`);
      let r2 = Object.prototype.hasOwnProperty.call(u2, l2), i3 = Object.getOwnPropertyDescriptor(u2, l2);
      if (i3 && i3.configurable === false && i3.writable === false) throw Error(`wrapMethod() target ${l2} is not writable or configurable`);
      d2 = { kind: `method`, key: `${t2 || `target#${this._targetId(u2)}`}::${l2}${o2 ? `::static` : ``}`, host: u2, methodName: l2, original: n3, originalOwner: e3?.owner || u2, hadOwn: r2, ownDescriptor: i3, hooks: [], dispatcher: null };
      let a3 = this;
      d2.dispatcher = function(...e4) {
        let t3 = this, n4 = a3._sortedHooks(d2), r3 = (e5, i4) => {
          if (e5 >= n4.length) return d2.original.apply(t3, i4);
          let a4 = n4[e5];
          return a4.handler({ owner: a4.owner, args: i4, thisArg: t3, target: d2.host, original: d2.original, callNext: (...t4) => r3(e5 + 1, t4.length > 0 ? t4 : i4), callBase: (...e6) => d2.original.apply(t3, e6.length > 0 ? e6 : i4) });
        };
        return r3(0, e4);
      }, Object.defineProperty(u2, l2, { configurable: true, enumerable: i3?.enumerable ?? e3?.descriptor?.enumerable ?? false, writable: true, value: d2.dispatcher }), this._setTargetRecord(this._methodRecords, u2, l2, d2);
    }
    let f2 = { id: this._nextHookId++, owner: c2, priority: Number.isFinite(Number(s2)) ? Number(s2) : 0, order: this._nextHookId, handler: a2 };
    d2.hooks.push(f2), this._revision++, T.debug(`[${c2}] wrapMethod ${d2.key}`);
    let p2 = true;
    return () => p2 ? (p2 = false, d2.hooks = d2.hooks.filter((e3) => e3 !== f2), this._revision++, d2.hooks.length > 0 || this._restoreRecord(d2), true) : false;
  }
  wrapModuleExport({ owner: e2, modulePath: t2, exportName: n2, handler: r2, priority: i2 = 0 }) {
    let a2 = D(n2);
    if (!t2 || !a2) throw Error(`wrapModuleExport() requires modulePath and exportName`);
    if (typeof r2 != `function`) throw Error(`wrapModuleExport() requires handler`);
    let o2 = s(t2);
    if (!o2) throw Error(`SystemJS module not found: ${t2}`);
    if (!(a2 in o2)) throw Error(`SystemJS export missing: ${t2} -> ${a2}`);
    let c2 = Object.getOwnPropertyDescriptor(o2, a2);
    if (c2 && c2.configurable === false && c2.writable === false) throw Error(`SystemJS export is immutable and cannot be wrapped: ${t2} -> ${a2}`);
    let l2 = o2[a2];
    if (typeof l2 == `function`) return this.wrapMethod({ owner: e2, target: o2, methodName: a2, handler: r2, priority: i2 });
    let u2 = r2({ owner: E(e2), modulePath: t2, exportName: a2, value: l2, module: o2 });
    o2[a2] = u2;
    let d2 = true;
    return () => d2 ? (d2 = false, o2[a2] === u2 && (o2[a2] = l2), true) : false;
  }
  wrapProperty({ owner: e2, target: t2, key: n2, get: r2, set: i2, priority: a2 = 0 }) {
    let o2 = E(e2), s2 = D(n2);
    if (!t2 || !s2) throw Error(`wrapProperty() requires target and key`);
    if (typeof r2 != `function` && typeof i2 != `function`) throw Error(`wrapProperty() requires get and/or set`);
    this._assertAdmission(t2, s2);
    let c2 = this._getTargetRecord(this._propertyRecords, t2, s2);
    if (!c2) {
      let e3 = O(t2, s2), n3 = Object.prototype.hasOwnProperty.call(t2, s2), r3 = Object.getOwnPropertyDescriptor(t2, s2);
      if (r3?.configurable === false) throw Error(`wrapProperty() target ${s2} is not configurable`);
      let i3 = r3 || e3?.descriptor, a3 = i3?.value ?? t2[s2];
      c2 = { kind: `property`, key: `target#${this._targetId(t2)}::${s2}::property`, target: t2, property: s2, hadOwn: n3, ownDescriptor: r3, baseDescriptor: i3, hooks: [], getValue(e4) {
        return typeof i3?.get == `function` ? i3.get.call(e4) : a3;
      }, setValue(e4, t3) {
        typeof i3?.set == `function` ? i3.set.call(e4, t3) : a3 = t3;
      } };
      let o3 = this;
      Object.defineProperty(t2, s2, { configurable: true, enumerable: i3?.enumerable !== false, get() {
        let e4 = c2.getValue(this);
        for (let n4 of o3._sortedHooks(c2)) typeof n4.get == `function` && (e4 = n4.get({ owner: n4.owner, value: e4, target: t2, key: s2, thisArg: this }));
        return e4;
      }, set(e4) {
        let n4 = e4, r4 = c2.getValue(this);
        for (let e5 of o3._sortedHooks(c2)) typeof e5.set == `function` && (n4 = e5.set({ owner: e5.owner, value: r4, nextValue: n4, target: t2, key: s2, thisArg: this }));
        c2.setValue(this, n4);
      } }), c2.dispatcherDescriptor = Object.getOwnPropertyDescriptor(t2, s2), this._setTargetRecord(this._propertyRecords, t2, s2, c2);
    }
    let l2 = { id: this._nextHookId++, owner: o2, priority: Number.isFinite(Number(a2)) ? Number(a2) : 0, order: this._nextHookId, get: r2, set: i2 };
    c2.hooks.push(l2), this._revision++, T.debug(`[${o2}] wrapProperty ${c2.key}`);
    let u2 = true;
    return () => u2 ? (u2 = false, c2.hooks = c2.hooks.filter((e3) => e3 !== l2), this._revision++, c2.hooks.length > 0 || this._restoreRecord(c2), true) : false;
  }
  _restoreRecord(e2) {
    let t2 = e2.kind === `method`, n2 = t2 ? e2.host : e2.target, r2 = t2 ? e2.methodName : e2.property, i2 = t2 ? this._methodRecords : this._propertyRecords;
    try {
      let i3 = Object.getOwnPropertyDescriptor(n2, r2);
      if (!(t2 ? i3?.value === e2.dispatcher : i3?.get === e2.dispatcherDescriptor?.get && i3?.set === e2.dispatcherDescriptor?.set)) throw Object.assign(Error(`Cannot restore ${e2.key}: target changed outside HookManager`), { code: `HOOK_TARGET_CHANGED`, hookKey: e2.key });
      e2.hadOwn && e2.ownDescriptor ? Object.defineProperty(n2, r2, e2.ownDescriptor) : delete n2[r2];
    } finally {
      this._deleteTargetRecord(i2, n2, r2, e2);
    }
  }
  restoreAll() {
    let e2 = [];
    for (let t2 of [...this._records]) {
      t2.hooks = [], this._revision++;
      try {
        this._restoreRecord(t2);
      } catch (t3) {
        e2.push(t3);
      }
    }
    if (e2.length) throw AggregateError(e2, `Hook restoration failed`);
  }
};
function k(e2 = `Operation aborted`) {
  try {
    return new DOMException(e2, `AbortError`);
  } catch {
    let t2 = Error(e2);
    return t2.name = `AbortError`, t2;
  }
}
function me(e2) {
  let t2 = Number(e2);
  return !Number.isFinite(t2) || t2 < 0 ? 0 : Math.min(t2, 2147483647);
}
function he(e2) {
  if (e2 == null) return null;
  if (typeof e2 != `object` || typeof e2.aborted != `boolean` || typeof e2.addEventListener != `function` || typeof e2.removeEventListener != `function`) throw TypeError(`Runtime timer signal must be an AbortSignal`);
  return e2;
}
function ge(e2) {
  let t2 = Number(e2);
  return Number.isFinite(t2) ? Math.max(10, Math.min(6e4, Math.round(t2))) : 2e3;
}
var _e = class {
  constructor(e2 = {}) {
    this.namespace = String(e2.namespace || `anonymous-mod`), this.state = `active`, this.reason = ``, this._controller = new AbortController(), this._cleanups = /* @__PURE__ */ new Map(), this._nextCleanupId = 1, this._tasks = /* @__PURE__ */ new Set(), this._taskRevision = 0, this._disposePromise = null, this._cleanupTimeoutMs = ge(e2.cleanupTimeoutMs), this._onError = typeof e2.onError == `function` ? e2.onError : null, this._setTimeout = e2.setTimeout || globalThis.setTimeout?.bind(globalThis), this._clearTimeout = e2.clearTimeout || globalThis.clearTimeout?.bind(globalThis), this._setInterval = e2.setInterval || globalThis.setInterval?.bind(globalThis), this._clearInterval = e2.clearInterval || globalThis.clearInterval?.bind(globalThis);
  }
  get signal() {
    return this._controller.signal;
  }
  get isActive() {
    return this.state === `active` && !this.signal.aborted;
  }
  get taskRevision() {
    return this._taskRevision;
  }
  get pendingTaskCount() {
    return this._tasks.size;
  }
  _report(e2, t2 = `runtime callback`) {
    try {
      this._onError?.(e2, { namespace: this.namespace, label: t2 });
    } catch {
    }
  }
  assertActive(e2 = `operation`) {
    if (!this.isActive) throw k(`[${this.namespace}] ${e2} rejected because the mod runtime is ${this.state}`);
  }
  addCleanup(e2, t2 = `cleanup`) {
    if (typeof e2 != `function`) return () => false;
    if (!this.isActive) return Promise.resolve().then(() => e2()).catch((e3) => this._report(e3, t2)), () => false;
    let n2 = { id: this._nextCleanupId++, cleanup: e2, label: String(t2 || `cleanup`), active: true };
    return this._cleanups.set(n2.id, n2), () => n2.active ? (n2.active = false, n2.cleanup = null, this._cleanups.delete(n2.id), true) : false;
  }
  guard(e2, t2 = {}) {
    if (typeof e2 != `function`) return () => void 0;
    let n2 = String(t2.label || e2.name || `guarded callback`);
    return (...r2) => {
      if (this.isActive) try {
        let t3 = e2(...r2);
        return t3?.then && typeof t3.then == `function` ? this.track(t3, { label: n2 }) : t3;
      } catch (e3) {
        if (this._report(e3, n2), t2.rethrow === true) throw e3;
        return;
      }
    };
  }
  track(e2, t2 = {}) {
    this.assertActive(t2.label || `track task`);
    let n2 = Promise.resolve(e2);
    return this._tasks.has(n2) || this._taskRevision++, this._tasks.add(n2), n2.finally(() => {
      this._tasks.delete(n2) && this._taskRevision++;
    }).catch(() => {
    }), t2.report !== false && n2.catch((e3) => {
      e3?.name !== `AbortError` && this._report(e3, t2.label || `tracked task`);
    }), n2;
  }
  setTimeout(e2, t2 = 0, n2 = {}) {
    if (this.assertActive(`setTimeout`), typeof e2 != `function`) throw TypeError(`setTimeout requires a callback`);
    if (typeof this._setTimeout != `function`) throw Error(`setTimeout is unavailable`);
    let r2 = String(n2.label || `timeout callback`), i2 = he(n2.signal);
    if (i2?.aborted) return () => false;
    let a2 = true, o2 = null, s2 = null, c2 = () => a2 ? (a2 = false, i2?.removeEventListener(`abort`, c2), s2 != null && this._clearTimeout?.(s2), o2?.(), true) : false;
    return s2 = this._setTimeout(() => {
      a2 && (a2 = false, i2?.removeEventListener(`abort`, c2), o2?.(), this.guard(e2, { label: r2 })(...Array.isArray(n2.args) ? n2.args : []));
    }, me(t2)), a2 && (o2 = this.addCleanup(c2, `cancel ${r2}`), i2?.addEventListener(`abort`, c2, { once: true }), i2?.aborted && c2()), c2;
  }
  setInterval(e2, t2 = 0, n2 = {}) {
    if (this.assertActive(`setInterval`), typeof e2 != `function`) throw TypeError(`setInterval requires a callback`);
    if (typeof this._setInterval != `function`) throw Error(`setInterval is unavailable`);
    let r2 = String(n2.label || `interval callback`), i2 = he(n2.signal);
    if (i2?.aborted) return () => false;
    let a2 = this.guard(e2, { label: r2 }), o2 = true, s2 = null, c2 = this._setInterval(() => {
      o2 && a2();
    }, me(t2)), l2 = () => o2 ? (o2 = false, i2?.removeEventListener(`abort`, l2), this._clearInterval?.(c2), s2?.(), true) : false;
    return s2 = this.addCleanup(l2, `cancel ${r2}`), i2?.addEventListener(`abort`, l2, { once: true }), i2?.aborted && l2(), l2;
  }
  sleep(e2 = 0, t2 = {}) {
    this.assertActive(`sleep`);
    let n2 = t2.signal;
    return this.track(new Promise((t3, r2) => {
      let i2 = false, a2 = null, o2 = (e3, t4) => {
        i2 || (i2 = true, a2?.(), this.signal.removeEventListener(`abort`, s2), n2?.removeEventListener?.(`abort`, s2), e3(t4));
      }, s2 = () => o2(r2, k(`[${this.namespace}] sleep aborted`));
      a2 = this.setTimeout(() => o2(t3), e2, { label: `sleep timer`, signal: n2 }), this.signal.addEventListener(`abort`, s2, { once: true }), n2?.addEventListener?.(`abort`, s2, { once: true }), n2?.aborted && s2();
    }), { label: t2.label || `sleep`, report: false });
  }
  async dispose(e2 = `dispose`) {
    return this._disposePromise ||= this._dispose(e2), this._disposePromise;
  }
  async _dispose(e2) {
    if (this.state === `disposed`) return { errors: [], pendingTasks: 0 };
    this.state = `disposing`, this.reason = String(e2 || `dispose`), this._controller.abort(this.reason);
    let t2 = [], n2 = [...this._cleanups.values()].reverse();
    this._cleanups.clear();
    for (let e3 of n2) if (e3.active) {
      e3.active = false;
      try {
        let t3 = e3.cleanup, n3 = Promise.resolve().then(() => t3?.());
        n3.catch(() => {
        });
        let r2 = null;
        await Promise.race([n3, new Promise((t4, n4) => {
          r2 = this._setTimeout?.(() => {
            n4(Error(`[${this.namespace}] ${e3.label} timed out after ${this._cleanupTimeoutMs}ms`));
          }, this._cleanupTimeoutMs);
        })]).finally(() => this._clearTimeout?.(r2));
      } catch (n3) {
        t2.push(n3), this._report(n3, e3.label);
      } finally {
        e3.cleanup = null;
      }
    }
    if (this._tasks.size) {
      let e3 = null;
      try {
        await Promise.race([Promise.allSettled([...this._tasks]), new Promise((t3, n3) => {
          e3 = this._setTimeout(() => n3(Error(`[${this.namespace}] pending tasks timed out after ${this._cleanupTimeoutMs}ms`)), this._cleanupTimeoutMs);
        })]);
      } catch (e4) {
        t2.push(e4), this._report(e4, `pending tasks`);
      } finally {
        this._clearTimeout(e3);
      }
    }
    return this.state = `disposed`, { errors: t2, pendingTasks: this._tasks.size };
  }
};
function ve(e2 = {}) {
  return new _e(e2);
}
var ye = /^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/, be = /^\d+(?:\.\d+){0,2}(?:-[A-Za-z0-9.-]+)?$/, xe = /* @__PURE__ */ new Set([`__proto__`, `constructor`, `prototype`]);
function A(e2, t2 = `service-error`) {
  let n2 = Error(e2);
  return n2.name = `ModServiceError`, n2.code = t2, n2;
}
function Se(e2, t2 = `service-unavailable`) {
  return A(`Service '${e2}' is unavailable`, t2);
}
function j(e2) {
  let t2 = String(e2 || ``).trim();
  if (!ye.test(t2)) throw A(`Service id must be 3-128 characters using letters, numbers, dot, underscore, or hyphen`, `invalid-id`);
  return t2;
}
function M(e2) {
  let t2 = String(e2 || ``).trim();
  if (!be.test(t2)) throw A(`Service version must be a numeric version with an optional prerelease suffix`, `invalid-version`);
  return t2;
}
function N(e2) {
  if (e2 == null) return Object.freeze([]);
  if (!Array.isArray(e2)) throw A(`Service capabilities must be an array`, `invalid-capabilities`);
  let t2 = /* @__PURE__ */ new Set(), n2 = [];
  for (let r2 of e2) {
    let e3 = String(r2 || ``).trim();
    !e3 || t2.has(e3) || (t2.add(e3), n2.push(e3));
  }
  return Object.freeze(n2.sort());
}
function Ce(e2) {
  if (!e2 || typeof e2 != `object` || Array.isArray(e2)) throw A(`Service api must be a plain object of functions`, `invalid-api`);
  let t2 = Object.getPrototypeOf(e2);
  if (t2 !== Object.prototype && t2 !== null) throw A(`Service api must be a plain object of functions`, `invalid-api`);
  if (Object.getOwnPropertySymbols(e2).length > 0) throw A(`Service api cannot contain symbol keys`, `invalid-api`);
  let n2 = /* @__PURE__ */ new Map();
  for (let t3 of Object.keys(e2)) {
    if (xe.has(t3) || typeof e2[t3] != `function`) throw A(`Service api member '${t3}' must be a callable method`, `invalid-api`);
    n2.set(t3, e2[t3]);
  }
  if (n2.size === 0) throw A(`Service api must expose at least one method`, `invalid-api`);
  return n2;
}
function P(e2, t2) {
  if (!e2 || typeof e2.addCleanup != `function` || !e2.signal || e2.isActive !== true) throw A(`${t2} requires an active managed mod runtime`, `runtime-inactive`);
}
function F(e2) {
  return Object.freeze({ id: e2.id, version: e2.version, provider: e2.provider, capabilities: e2.capabilities });
}
function I(e2, t2, n2 = {}) {
  return Object.freeze({ ok: false, reason: t2, id: e2, service: null, ...n2 });
}
var we = class {
  constructor() {
    this._providers = /* @__PURE__ */ new Map(), this._nextGeneration = 1, this._consumerRelations = /* @__PURE__ */ new Map(), this._consumerRevision = 0, this._retiringProviders = /* @__PURE__ */ new Set();
  }
  provide(e2, t2, n2 = {}, r2 = {}) {
    P(t2, `services.provide()`);
    let i2 = String(e2 || ``).trim();
    if (this._retiringProviders.has(i2)) throw A(`Service provider is retiring`, `provider-retiring`);
    let a2 = j(n2.id), o2 = M(n2.version), s2 = N(n2.capabilities), c2 = Ce(n2.api), l2 = this._providers.get(a2);
    if (l2?.active) throw A(`Service '${a2}' is already provided by '${l2.provider}'`, `provider-conflict`);
    let u2 = { id: a2, version: o2, provider: i2, capabilities: s2, methods: c2, generation: this._nextGeneration++, contentDigest: r2.contentDigest ?? null, runtimeGeneration: r2.runtimeGeneration ?? null, active: true, controller: new AbortController(), consumers: /* @__PURE__ */ new Set(), unregisterCleanup: null };
    this._providers.set(a2, u2);
    let d2 = (e3 = `provider-disposed`) => this._disposeProvider(u2, e3);
    return u2.unregisterCleanup = t2.addCleanup(() => d2(`provider-runtime-disposed`), `unregister mod service ${a2}`), Object.freeze({ ...F(u2), signal: u2.controller.signal, isActive: () => u2.active, dispose: d2 });
  }
  resolve(e2, t2, n2, r2 = {}, i2 = {}) {
    P(t2, `services.resolve()`);
    let a2 = j(n2), o2 = this._providers.get(a2), s2 = null;
    if (!o2?.active) s2 = I(a2, `not-found`);
    else if (this._retiringProviders.has(o2.provider)) s2 = I(a2, `provider-retiring`);
    else {
      let e3 = String(r2.minVersion || ``).trim(), t3 = String(r2.maxVersion || ``).trim();
      if (e3 && y(o2.version, M(e3)) < 0) s2 = I(a2, `version-too-low`, { available: F(o2) });
      else if (t3 && y(o2.version, M(t3)) > 0) s2 = I(a2, `version-too-high`, { available: F(o2) });
      else {
        let e4 = N(r2.capabilities).filter((e5) => !o2.capabilities.includes(e5));
        e4.length > 0 && (s2 = I(a2, `missing-capabilities`, { available: F(o2), missingCapabilities: Object.freeze(e4) }));
      }
    }
    if (s2) {
      if (r2.required === true) throw A(`Service '${a2}' could not be resolved: ${s2.reason}`, s2.reason);
      return s2;
    }
    return Object.freeze({ ok: true, reason: null, id: a2, service: this._createConsumer(o2, String(e2 || ``).trim(), t2, i2) });
  }
  closeProviderAdmission(e2) {
    let t2 = new Set(e2);
    if ([...t2].some((e3) => this._retiringProviders.has(e3))) throw Error(`Service provider admission is already closed`);
    for (let e3 of t2) this._retiringProviders.add(e3);
    let n2 = false;
    return () => {
      if (n2) return false;
      n2 = true;
      for (let e3 of t2) this._retiringProviders.delete(e3);
      return true;
    };
  }
  list() {
    return Object.freeze([...this._providers.values()].filter((e2) => e2.active).sort((e2, t2) => e2.id.localeCompare(t2.id)).map(F));
  }
  clear(e2 = `registry-clear`) {
    for (let t2 of [...this._providers.values()]) this._disposeProvider(t2, e2);
  }
  getStatus() {
    return Object.freeze({ providers: this.list(), consumerCount: [...this._providers.values()].reduce((e2, t2) => e2 + t2.consumers.size, 0) });
  }
  getConsumers() {
    return Object.freeze({ domain: `services`, complete: false, revision: this._consumerRevision, edges: Object.freeze([...this._consumerRelations.values()].flatMap((e2) => [...e2.values()])) });
  }
  _recordConsumer(e2, t2, n2, r2) {
    if (e2.provider === t2) return;
    let i2 = this._consumerRelations.get(n2);
    i2 || (i2 = /* @__PURE__ */ new Map(), this._consumerRelations.set(n2, i2), n2.signal.addEventListener(`abort`, () => {
      this._consumerRelations.delete(n2) && this._consumerRevision++;
    }, { once: true }));
    let a2 = JSON.stringify([e2.id, e2.generation, t2]);
    i2.has(a2) || (i2.set(a2, Object.freeze({ provider: e2.provider, consumer: t2, kind: `service`, serviceId: e2.id, serviceVersion: e2.version, providerGeneration: e2.generation, providerDigest: e2.contentDigest, consumerDigest: r2.contentDigest ?? null, providerRuntimeGeneration: e2.runtimeGeneration, consumerRuntimeGeneration: r2.runtimeGeneration ?? null })), this._consumerRevision++);
  }
  _createConsumer(e2, t2, n2, r2) {
    let i2 = { owner: t2, active: true, controller: new AbortController(), unregisterCleanup: null, onScopeAbort: null }, a2 = (t3 = `consumer-disposed`) => i2.active ? (i2.active = false, n2.signal.removeEventListener(`abort`, i2.onScopeAbort), e2.consumers.delete(i2), i2.unregisterCleanup?.(), i2.controller.abort(Object.freeze({ type: `service-unavailable`, reason: t3, id: e2.id })), true) : false;
    i2.retire = a2, i2.onScopeAbort = () => a2(`consumer-runtime-disposed`), n2.signal.addEventListener(`abort`, i2.onScopeAbort, { once: true }), i2.unregisterCleanup = n2.addCleanup(() => a2(`consumer-runtime-disposed`), `release mod service ${e2.id}`), e2.consumers.add(i2), this._recordConsumer(e2, t2, n2, r2);
    let o2 = {};
    for (let [t3, r3] of e2.methods) Object.defineProperty(o2, t3, { enumerable: true, value: (...t4) => {
      if (!i2.active || !e2.active || !n2.isActive) throw Se(e2.id);
      return Reflect.apply(r3, void 0, t4);
    } });
    return Object.freeze({ ...F(e2), signal: i2.controller.signal, api: Object.freeze(o2), isActive: () => i2.active && e2.active && n2.isActive });
  }
  _disposeProvider(e2, t2) {
    if (!e2?.active) return false;
    e2.active = false, this._providers.get(e2.id) === e2 && this._providers.delete(e2.id), e2.unregisterCleanup?.(), e2.controller.abort(Object.freeze({ type: `service-provider-disposed`, reason: t2, id: e2.id }));
    for (let n2 of [...e2.consumers]) n2.retire?.(t2);
    return e2.consumers.clear(), e2.methods.clear(), true;
  }
};
function Te() {
  return new we();
}
function L(e2, t2) {
  throw Object.assign(Error(t2), { code: e2 });
}
function R(e2, { fileLoader: t2, hasFeature: n2, getRuntime: r2, isCurrent: i2, isStartupRuntime: a2 = () => false }) {
  let o2 = x(e2), s2 = /* @__PURE__ */ new Map(), c2 = /* @__PURE__ */ new Map(), l2 = 0;
  for (let e3 of o2.ordered) {
    let r3 = String(e3.meta?.uuid || ``).trim();
    if (!(!r3 || e3.errors?.length)) try {
      ne(e3, { hasFeature: n2 });
      let i3 = t2.getPackSnapshotFrom?.(e3.dir);
      if (!i3 || i3.digest !== e3.contentDigest) continue;
      s2.set(r3, Object.freeze({ namespace: r3, version: String(e3.meta.version || `0.0.0`), contentDigest: i3.digest, script: !!e3.meta.js?.entry, depends: Object.freeze([...e3.meta.depends || []]), optionalDepends: Object.freeze([...e3.meta.optionalDepends || []]), required: Object.freeze([...o2.required.get(r3) || []]), snapshot: i3 }));
    } catch {
    }
  }
  function u2(e3, t3) {
    e3 || L(`FILES_UNAVAILABLE`, `Package snapshot is unavailable for this load plan`);
    for (let n3 of [e3.namespace, ...e3.required]) {
      let e4 = s2.get(n3);
      if (e4 || L(`FILES_UNAVAILABLE`, `Package provider is unavailable: ${n3}`), e4.script) {
        let e5 = r2(n3), i3 = a2(t3), o3 = e5 === t3 && e5?.scope?.isActive && ([`setup`, `active`, `degraded`].includes(e5.state) || i3 && e5.state === `startup`), s3 = i3 && a2(e5) && e5?.state === `startup-ready`;
        !o3 && (!e5?.scope?.isActive || !s3 && ![`active`, `degraded`].includes(e5.state)) && L(`FILES_UNAVAILABLE`, `Package provider is not active: ${n3}`);
      }
    }
  }
  return { getProviderBindings(e3) {
    let t3 = s2.get(e3);
    if (!t3) return [];
    let n3 = /* @__PURE__ */ new Set([e3, ...t3.depends, ...t3.optionalDepends]);
    for (let t4 of s2.values()) !t4.script && t4.depends.includes(e3) && n3.add(t4.namespace);
    return [...n3].filter((e4) => s2.has(e4)).sort().map((e4) => Object.freeze({ namespace: e4, contentDigest: s2.get(e4).contentDigest }));
  }, getConsumers() {
    return Object.freeze({ domain: `files`, revision: l2, complete: false, edges: Object.freeze([...c2.values()]) });
  }, forRuntime(e3) {
    let t3 = s2.get(e3.namespace), n3 = () => {
      (!i2(e3) || !e3.scope.isActive) && L(`FILES_INACTIVE`, `Package reader belongs to an inactive mod generation`);
    }, r3 = (r4, i3 = `files`) => {
      if (n3(), u2(r4, e3), r4.namespace !== e3.namespace) {
        let n4 = JSON.stringify([r4.namespace, e3.namespace, i3]);
        c2.has(n4) || (c2.set(n4, Object.freeze({ provider: r4.namespace, consumer: e3.namespace, kind: i3, providerDigest: r4.contentDigest, consumerDigest: t3.contentDigest })), l2++);
      }
      let a3 = () => {
        n3(), u2(r4, e3);
      }, o3 = async (e4, t4) => {
        a3();
        let n4 = await r4.snapshot[e4](t4);
        return a3(), n4;
      };
      return Object.freeze({ namespace: r4.namespace, version: r4.version, contentDigest: r4.contentDigest, listPaths() {
        return a3(), r4.snapshot.listPaths();
      }, readText: (e4) => o3(`readText`, e4), readBytes: (e4) => o3(`readBytes`, e4) });
    };
    return Object.freeze({ own: () => r3(t3), from(i3) {
      return n3(), u2(t3, e3), !t3.depends.includes(i3) && !t3.optionalDepends.includes(i3) && L(`FILES_ACCESS_DENIED`, `Package dependency is not declared: ${i3}`), r3(s2.get(i3));
    }, contributions() {
      n3(), u2(t3, e3);
      let i3 = [];
      for (let t4 of s2.values()) if (!(t4.script || !t4.depends.includes(e3.namespace))) {
        try {
          u2(t4, e3);
        } catch {
          continue;
        }
        i3.push(r3(t4, `data-contribution`));
      }
      return i3;
    } });
  } };
}
function Ee() {
  let e2 = /* @__PURE__ */ new Map(), t2 = false;
  return Object.freeze({ record(n2) {
    if ([`mod-owned-data`, `native-player-save`].includes(n2?.domain) && /^modData\.(write|saveIdentity)$/.test(n2.operation) && [`unknown`, `changed`].includes(n2.status)) {
      e2.set(n2.operation, n2.status);
      return;
    }
    if (n2?.domain === `native-player-save`) {
      if (n2.operation === `player.raw`) {
        t2 = true;
        return;
      }
      !/^player\.(save|setProperty|addProperty|setCurrency|addCurrency|mutateZenGarden|addPlantFood)$/.test(n2.operation) || ![`unknown`, `changed`].includes(n2.status) || e2.set(n2.operation, n2.status);
    }
  }, raw() {
    t2 = true;
  }, snapshot() {
    return Object.freeze({ coverage: `managed-api-only`, observed: t2 || [...e2.values()].includes(`unknown`) ? `unknown` : e2.size ? `changed` : `unobserved`, operations: Object.freeze([...e2.keys()].sort()), rawAccess: t2, saveRestored: false });
  } });
}
var z = (e2, t2) => Object.assign(Error(t2), { code: e2 });
function B(e2) {
  let t2 = JSON.stringify(e2, (e3, t3) => {
    if (t3 === void 0 || typeof t3 == `function` || typeof t3 == `symbol` || typeof t3 == `bigint` || typeof t3 == `number` && !Number.isFinite(t3)) throw z(`MOD_DATA_INVALID`, `Mod data must contain JSON values`);
    return t3;
  });
  return JSON.parse(t2);
}
function V(e2) {
  if (!e2 || typeof e2.modId != `string` || !e2.modId.trim()) throw z(`MOD_DATA_IDENTITY`, `Mod identity is required`);
  if (e2.kind === `global` && e2.saveId === void 0) return { modId: e2.modId, kind: `global` };
  if (e2.kind === `save` && typeof e2.saveId == `string` && e2.saveId.trim()) return { modId: e2.modId, kind: `save`, saveId: e2.saveId };
  throw z(`MOD_DATA_IDENTITY`, `Choose global data or an identified save explicitly`);
}
function H(e2, t2) {
  if (!e2 || e2.formatVersion !== 1 || JSON.stringify(e2.identity) !== JSON.stringify(V(t2)) || !Number.isSafeInteger(e2.schemaVersion) || e2.schemaVersion < 1 || !Number.isSafeInteger(e2.revision) || e2.revision < 1 || !Object.hasOwn(e2, `data`)) throw z(`MOD_DATA_INVALID`, `Invalid mod-owned data record`);
  return B(e2);
}
function De(e2) {
  let t2 = Promise.resolve(), n2 = (e3) => {
    let n3 = t2.then(e3);
    return t2 = n3.catch(() => {
    }), n3;
  };
  return Object.freeze({ open(t3, r2, { assertAccess: i2 = () => {
  }, reportMutation: a2 = () => {
  } } = {}) {
    t3 = V(t3);
    let o2 = r2?.version, s2 = r2?.migrate, c2 = r2?.validate;
    if (!Number.isSafeInteger(o2) || o2 < 1 || typeof c2 != `function`) throw z(`MOD_DATA_SCHEMA`, `A positive schema version and validator are required`);
    let l2 = B(r2.defaults), u2 = async (e3) => {
      let t4 = B(e3);
      if (await c2(B(t4)) !== true) throw z(`MOD_DATA_SCHEMA`, `Mod data does not match its schema`);
      return t4;
    }, d2 = async () => {
      i2();
      let n3 = await e2.read(t3);
      return n3 === null ? null : H(n3, t3);
    }, f2 = async (n3, r3) => {
      let s3 = { formatVersion: 1, identity: t3, schemaVersion: o2, revision: (n3?.revision || 0) + 1, data: await u2(r3) };
      return i2(), await e2.replace(t3, s3, n3, { assertAccess: i2, reportMutation: a2 }), B(s3.data);
    }, p2 = async () => {
      let e3 = await d2();
      if (e3?.schemaVersion !== o2) throw z(`MOD_DATA_VERSION`, `Reopen mod data with its current schema`);
      return e3;
    };
    return n2(async () => {
      let e3 = await d2();
      if (e3 === null) await f2(null, l2);
      else if (e3.schemaVersion > o2) throw z(`MOD_DATA_DOWNGRADE`, `Stored mod data uses a newer schema; original data was retained`);
      else if (e3.schemaVersion < o2) {
        if (typeof s2 != `function`) throw z(`MOD_DATA_MIGRATION`, `A data migration is required`);
        await f2(e3, await s2(B(e3.data), e3.schemaVersion, o2));
      } else await u2(e3.data);
      return i2(), Object.freeze({ read: () => n2(async () => {
        let e4 = await p2();
        return i2(), B(e4.data);
      }), update: (e4) => n2(async () => {
        if (typeof e4 != `function`) throw z(`MOD_DATA_INVALID`, `An update function is required`);
        let t4 = await p2();
        return f2(t4, await e4(B(t4.data)));
      }) });
    });
  } });
}
var U = { baseDir: f.AppData }, Oe = `gp-next/mod-data`, ke = () => Object.assign(Error(`Mod-owned data changed before publication`), { code: `MOD_DATA_CONFLICT` });
async function Ae(e2) {
  return [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(e2)))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
}
function je(e2 = { exists: g, mkdir: m, readTextFile: p, writeTextFile: _, rename: d, remove: h }) {
  let t2 = Promise.resolve(), n2 = (e3) => {
    let n3 = t2.then(e3);
    return t2 = n3.catch(() => {
    }), n3;
  }, r2 = async (e3) => `${Oe}/${await Ae(JSON.stringify(e3))}`, i2 = async (t3, n3) => await e2.exists(t3, U) ? H(JSON.parse(await e2.readTextFile(t3, U)), n3) : null, a2 = async (t3, n3, r3 = () => {
  }) => {
    let i3 = `${t3}.${crypto.randomUUID()}.pending`;
    try {
      if (await e2.writeTextFile(i3, n3, U), await e2.readTextFile(i3, U) !== n3) throw Error(`Mod data write verification failed`);
      r3(), await e2.rename(i3, t3, { oldPathBaseDir: f.AppData, newPathBaseDir: f.AppData });
    } catch (t4) {
      try {
        await e2.exists(i3, U) && await e2.remove(i3, U);
      } catch (e3) {
        throw AggregateError([t4, e3], `Mod data write and cleanup failed`);
      }
      throw t4;
    }
  };
  return Object.freeze({ read(e3) {
    return e3 = V(e3), n2(async () => i2(`${await r2(e3)}/current.json`, e3));
  }, replace(t3, o2, s2, { assertAccess: c2 = () => {
  }, reportMutation: l2 = () => {
  } } = {}) {
    if (t3 = V(t3), o2 = H(o2, t3), s2 = s2 === null ? null : H(s2, t3), o2.revision !== (s2?.revision || 0) + 1 || s2 && o2.schemaVersion < s2.schemaVersion) throw ke();
    return n2(async () => {
      c2();
      let n3 = await r2(t3), u2 = `${n3}/current.json`;
      if (JSON.stringify(await i2(u2, t3)) !== JSON.stringify(s2)) throw ke();
      if (await e2.mkdir(n3, { ...U, recursive: true }), s2 && s2.schemaVersion !== o2.schemaVersion) {
        let e3 = JSON.stringify(s2);
        await a2(`${n3}/schema-${s2.schemaVersion}-${await Ae(e3)}.json`, e3);
      }
      await a2(u2, JSON.stringify(o2), () => {
        c2(), l2({ domain: `mod-owned-data`, operation: `modData.write`, status: `unknown` });
      }), l2({ domain: `mod-owned-data`, operation: `modData.write`, status: `changed` });
    });
  } });
}
var Me = `__gpNextSaveId`, Ne = (e2) => typeof e2 == `string` && /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(e2), W = (e2, t2) => {
  throw Object.assign(Error(t2), { code: e2 });
};
function Pe({ getPlayers: e2, storage: t2, reportMutation: n2 = () => {
}, createId: r2 = () => crypto.randomUUID() }) {
  let i2 = () => {
    let t3 = e2(), n3 = t3?.currentPlayer, r3 = t3?.allPlayers;
    (!n3 || !Array.isArray(r3) || r3.filter((e3) => e3 === n3).length !== 1 || typeof t3.savePP != `function`) && W(`MOD_SAVE_UNAVAILABLE`, `No loaded native save`);
    let i3 = n3[Me];
    return i3 !== void 0 && !Ne(i3) && W(`MOD_SAVE_ID_INVALID`, `Native save has an invalid mod identity`), i3 && r3.some((e3) => e3 !== n3 && e3?.__gpNextSaveId === i3) && W(`MOD_SAVE_ID_CONFLICT`, `Multiple native saves share one mod identity`), { players: t3, current: n3, all: r3, id: i3 };
  }, a2 = ({ all: e3, current: n3, id: r3 }) => {
    let i3 = t2.getItem(NATIVE_PLAYER_SAVE_KEY), a3;
    try {
      a3 = JSON.parse(i3);
    } catch {
      W(`MOD_SAVE_UNCONFIRMED`, `Native save could not be read back`);
    }
    (!Array.isArray(a3) || a3[e3.indexOf(n3)]?.__gpNextSaveId !== r3 || a3.filter((e4) => e4?.__gpNextSaveId === r3).length !== 1) && W(`MOD_SAVE_UNCONFIRMED`, `Native save identity was not persisted uniquely`);
  };
  return Object.freeze({ capture() {
    let e3 = i2();
    if (e3.id) a2(e3);
    else {
      let t4 = r2();
      (!Ne(t4) || e3.all.some((e4) => e4?.__gpNextSaveId === t4)) && W(`MOD_SAVE_ID_INVALID`, `Could not allocate a unique save identity`), e3.current[Me] = t4, n2({ domain: `native-player-save`, operation: `modData.saveIdentity`, status: `unknown` }), e3.players.savePP(), e3 = i2(), a2(e3), n2({ domain: `native-player-save`, operation: `modData.saveIdentity`, status: `changed` });
    }
    let { current: t3, id: o2 } = e3;
    return Object.freeze({ id: o2, assertCurrent() {
      let e4 = i2();
      (e4.current !== t3 || e4.id !== o2) && W(`MOD_SAVE_CHANGED`, `The active native save changed; reopen mod data`), a2(e4);
    } });
  } });
}
function Fe({ namespace: e2, scope: t2, service: n2, saveIdentity: r2, reportMutation: i2 }) {
  let a2 = (e3) => (t2.assertActive(`storage`), t2.track(Promise.resolve().then(e3), { label: `storage`, report: false }));
  return Object.freeze({ open: (o2) => a2(async () => {
    if (t2.assertActive(`storage.open`), !o2 || ![`global`, `save`].includes(o2.scope)) throw Object.assign(Error(`Choose global or save scope explicitly`), { code: `MOD_DATA_IDENTITY` });
    let s2 = o2.scope === `save` ? r2.capture() : null, c2 = () => {
      t2.assertActive(`storage`), s2?.assertCurrent();
    }, l2 = s2 ? { modId: e2, kind: `save`, saveId: s2.id } : { modId: e2, kind: `global` }, u2 = await n2.open(l2, o2, { assertAccess: c2, reportMutation: i2 });
    return c2(), Object.freeze({ read: () => a2(() => u2.read()), update: (e3) => a2(() => u2.update(e3)) });
  }) });
}
var Ie = De(je()), G = new t(`js-mod-loader`), Le = 15e3, Re = 1e4, ze = 2e3, Be = /* @__PURE__ */ new Set([`engine:ready`, `patches:loaded`, `scene:after-launch`, `mods:reload-before`, `mods:reload-after`]);
function K(e2) {
  return String(e2?.meta?.uuid || e2?.meta?.name || e2?.dir || `unknown.mod`).trim();
}
function Ve(e2) {
  return e2?.default && typeof e2.default == `object` ? e2.default : e2?.default && typeof e2.default == `function` ? { setup: e2.default, startup: e2.startup, dispose: typeof e2.dispose == `function` ? e2.dispose : null } : typeof e2?.setup == `function` ? { setup: e2.setup, startup: e2.startup, dispose: typeof e2.dispose == `function` ? e2.dispose : null } : null;
}
function q(e2, t2, n2 = 1e3) {
  let r2 = Number(e2);
  return Number.isFinite(r2) ? Math.max(n2, Math.min(6e4, Math.round(r2))) : t2;
}
function J(e2) {
  return String(e2?.message || e2 || `Unknown error`);
}
function He(e2, t2) {
  return `gp-next://${encodeURIComponent(e2)}/${t2.split(`/`).map(encodeURIComponent).join(`/`)}`;
}
function Y(e2) {
  if (e2 == null) return e2;
  try {
    return structuredClone(e2);
  } catch {
    return JSON.parse(JSON.stringify(e2));
  }
}
function Ue(e2, t2) {
  if (Array.isArray(e2) && Array.isArray(t2)) return e2.splice(0, e2.length, ...Y(t2)), true;
  if (!e2 || typeof e2 != `object` || !t2 || typeof t2 != `object`) return false;
  for (let t3 of Object.keys(e2)) delete e2[t3];
  return Object.assign(e2, Y(t2)), true;
}
function We(e2, t2) {
  let n2 = [`onClick`, `getValue`, `setValue`, `disabled`, `visible`];
  return { ...e2 || {}, groups: Array.isArray(e2?.groups) ? e2.groups.map((e3) => ({ ...e3, items: Array.isArray(e3?.items) ? e3.items.map((e4) => {
    let r2 = { ...e4 };
    for (let i2 of n2) typeof e4?.[i2] == `function` && (r2[i2] = t2.guard(e4[i2], { label: `control ${e4.key || e4.label || `item`}.${i2}`, rethrow: true }));
    return r2;
  }) : [] })) : [] };
}
function X(e2, t2, n2 = {}) {
  let r2 = String(t2 || ``).trim();
  if (!r2) throw Error(`event name is required`);
  if (Be.has(r2)) {
    if (n2.forEmit === true) throw Error(`Platform event '${r2}' is read-only`);
    return r2;
  }
  return r2.startsWith(`mod:`) ? r2 : `mod:${e2}:${r2}`;
}
function Z(e2, t2, n2) {
  let r2 = null, i2 = new Promise((e3, i3) => {
    r2 = setTimeout(() => i3(Error(`${n2} timed out after ${t2}ms`)), t2);
  });
  return Promise.race([Promise.resolve(e2), i2]).finally(() => clearTimeout(r2));
}
function Ge(e2, t2, n2) {
  return URL.createObjectURL(new Blob([`${e2}
//# sourceURL=${He(t2, n2)}
`], { type: `text/javascript` }));
}
async function Q(e2, t2, n2 = `dispose`) {
  if (t2.cleanupReport) return t2.cleanupReport;
  t2.phase = `disposing`;
  let r2 = [...t2.initialCleanupErrors || []], i2 = 0, a2 = async (e3, t3) => {
    try {
      await t3();
    } catch (t4) {
      r2.push({ stage: e3, error: t4, message: J(t4) });
    }
  };
  return await a2(`scope`, async () => {
    let e3 = await t2.scope?.dispose(n2);
    i2 = e3?.pendingTasks || 0;
    for (let t3 of e3?.errors || []) r2.push({ stage: `scope`, error: t3, message: J(t3) });
  }), r2.length && t2.warnings.push(`${r2.length} cleanup operation(s) failed`), await a2(`controls`, () => e2._modControlsRegistry.unregisterModControls(t2.namespace)), await a2(`settings`, () => t2.settingsRegistry.unregisterModSettings(t2.namespace)), t2.url &&= (await a2(`module-url`, () => e2._revokeObjectUrl(t2.url)), ``), t2.state = `disposed`, t2.phase = `disposed`, t2.disposedAt = Date.now(), t2.cleanupReport = Object.freeze({ namespace: t2.namespace, generation: t2.generation, errors: Object.freeze(r2.map((e3) => Object.freeze(e3))), pendingTasks: i2, persistentActivity: t2.persistenceAudit?.snapshot() || null }), t2.cleanupReport;
}
function Ke(e2) {
  return { get signal() {
    return e2.signal;
  }, isActive: () => e2.isActive, assertActive: (t2) => e2.assertActive(t2), onDispose: (t2, n2 = `author cleanup`) => e2.addCleanup(t2, n2), guard: (t2, n2) => e2.guard(t2, n2), track: (t2, n2) => e2.track(t2, n2), sleep: (t2, n2) => e2.sleep(t2, n2), setTimeout: (t2, n2, r2) => e2.setTimeout(t2, n2, r2), setInterval: (t2, n2, r2) => e2.setInterval(t2, n2, r2) };
}
function qe(e2, t2, o2) {
  let l2 = Object.freeze({ contentDigest: e2._executedScripts.get(o2)?.contentDigest ?? null, runtimeGeneration: o2.generation }), u2 = o2.namespace, d2 = o2.scope, f2 = e2._modControlsRegistry, p2 = /* @__PURE__ */ new WeakSet(), m2 = (e3, t3) => (typeof e3 == `function` && d2.addCleanup(e3, t3), e3), h2 = Ke(d2), g2 = (t3, n2, r2) => (d2.assertActive(r2), m2(e2._hookManager[t3]({ ...n2, owner: u2 }), r2)), _2 = { wrapMethod: (e3) => {
    if (typeof e3?.handler != `function`) throw TypeError(`Method hook requires a handler`);
    let t3 = d2.guard(e3.handler, { label: `method hook ${e3.methodName}`, rethrow: true });
    return g2(`wrapMethod`, { ...e3, handler: (e4) => d2.isActive ? t3(e4) : e4.callNext() }, `restore method hook ${e3.methodName}`);
  }, onEvent: (t3, n2, r2 = false) => e2._subscribeEvent(o2, t3, n2, r2), defineCleanup: m2 }, v2 = e2._createApi({ ...e2._services, apiVersion: Number(t2?.meta?.apiVersion || 0), behaviorTools: _2, runtime: h2, modNamespace: u2, combatModifierRegistry: e2._combatModifierRegistry, reportPersistentMutation: (e3) => o2.persistenceAudit.record(e3), reportDataRead: (t3, n2) => e2._dataConsumers.read(o2, t3, n2), beforeDataMutation(t3, n2) {
    if (!n2 || p2.has(n2)) return;
    e2._dataConsumers.write(o2, t3, n2);
    let r2 = e2._dataRestoration.capture(n2);
    p2.add(n2), m2(r2, `restore data mutation ${t3}`);
  } }), y2 = (t3) => {
    if (o2.unmanagedDomains.add(t3), e2._managedRebuildGuard) throw Error(`API requires restart during managed rebuild: ${t3}`);
  }, b2 = { getCc: () => (o2.persistenceAudit.raw(), c()), getClassByName: (e3) => (o2.persistenceAudit.raw(), r(e3)), getSystemModule: (e3) => (o2.persistenceAudit.raw(), s(e3)), getModuleExport: (e3, t3) => (o2.persistenceAudit.raw(), i(e3, t3)), getAllPlayerProperties: () => (o2.persistenceAudit.raw(), n()), isReady: () => a() }, x2 = { defineCleanup: (e3, t3 = `author cleanup`) => m2(e3, t3), wrapMethod: (e3) => _2.wrapMethod(e3), wrapProperty: (e3) => (y2(`unsafe.hooks.wrapProperty`), g2(`wrapProperty`, e3, `restore property hook ${e3?.key || ``}`)), wrapModuleExport: (e3) => (y2(`unsafe.hooks.wrapModuleExport`), g2(`wrapModuleExport`, e3, `restore module export ${e3?.modulePath || ``}:${e3?.exportName || ``}`)), getHooks: () => e2._hookManager.getHooks(), getConflicts: () => e2._hookManager.getConflicts() }, S2 = { meta: Object.freeze({ namespace: u2, id: u2, name: t2?.meta?.name || u2, version: t2?.meta?.version || `0.0.0`, packFormatVersion: t2?.meta?.packFormatVersion || 1, apiVersion: t2?.meta?.apiVersion || 0, capabilities: Object.freeze([...t2?.meta?.capabilities || []]), depends: Object.freeze([...t2?.meta?.depends || []]), optionalDepends: Object.freeze([...t2?.meta?.optionalDepends || []]) }), compat: { getApiVersion: () => 2, getPlatformVersion: () => ee, getPackFormatVersion: () => t2?.meta?.packFormatVersion || 1, hasDeclaredFeature: (e3) => Array.isArray(t2?.meta?.featureFlags) && t2.meta.featureFlags.includes(e3), hasFeature: (t3) => e2._services?.hasFeature?.(t3) === true, warnDeprecated: (e3) => G.warn(`[${u2}] ${e3}`), markDegraded: (e3) => {
    o2.state = `degraded`, o2.warnings.push(String(e3 || `degraded`));
  } }, runtime: h2, ui: { toast: (n2, r2 = `info`) => (d2.assertActive(`ui.toast`), e2._showToast(`[${t2?.meta?.name || u2}] ${n2}`, r2)) }, settings: { onApply: (t3, n2 = {}) => {
    if (d2.assertActive(`settings.onApply`), typeof t3 != `function`) throw TypeError(`settings.onApply requires a handler`);
    if (o2.settingsApplyHandler) throw Error(`Only one settings application handler is allowed`);
    let r2 = { callback: d2.guard(t3, { label: `settings application`, rethrow: true }) }, i2 = w({ runtime: d2, signal: n2.signal, label: n2.label || `settings application`, onCancel: () => {
      o2.settingsApplyHandler === r2 && (o2.settingsApplyHandler = null, e2._settingsApplyRevision++);
    } });
    return i2.active && (o2.settingsApplyHandler = r2, e2._settingsApplyRevision++), i2.cancel;
  }, onChange: (e3, t3 = {}) => {
    if (d2.assertActive(`settings.onChange`), typeof e3 != `function`) throw TypeError(`settings.onChange requires a listener`);
    let n2 = String(t3.label || `settings change`), r2 = { callback: null, off: null }, i2 = w({ runtime: d2, signal: t3.signal, label: n2, onCancel: () => {
      r2.off?.(), o2.settingsSubscriptions.delete(r2);
    } });
    if (!i2.active) return i2.cancel;
    let a2 = d2.guard(e3, { label: n2 });
    r2.callback = (e4) => i2.active ? a2(e4) : void 0;
    try {
      r2.off = o2.settingsRegistry.subscribe(u2, r2.callback), o2.settingsSubscriptions.add(r2);
    } catch (e4) {
      throw i2.cancel(), e4;
    }
    return i2.cancel;
  }, defineSchema: async (e3) => (d2.assertActive(`settings.defineSchema`), o2.settingsSchema = await o2.settingsRegistry.registerModSettings({ ...e3, namespace: u2 }), m2(() => o2.settingsRegistry.unregisterModSettings(u2), `unregister settings schema`), o2.settingsSchema), get: async (e3) => (d2.assertActive(`settings.get`), (await o2.settingsRegistry.getModSettings(u2)).values?.[e3]), set: async (e3, t3) => (d2.assertActive(`settings.set`), o2.settingsRegistry.updateModSetting(u2, e3, t3)), getAll: async () => (d2.assertActive(`settings.getAll`), (await o2.settingsRegistry.getModSettings(u2)).values), reset: async () => (d2.assertActive(`settings.reset`), o2.settingsRegistry.resetModSettings(u2)), export: async () => (d2.assertActive(`settings.export`), o2.settingsRegistry.exportModSettings(u2)), import: async (e3) => (d2.assertActive(`settings.import`), o2.settingsRegistry.importModSettings(u2, e3)) }, controls: { definePanel: (e3) => {
    d2.assertActive(`controls.definePanel`);
    let t3 = f2.registerModControls({ ...We(e3, d2), namespace: u2 });
    return m2(() => f2.unregisterModControls(u2), `unregister runtime controls`), t3;
  }, clear: () => (d2.assertActive(`controls.clear`), f2.unregisterModControls(u2)) }, events: { onDispose: (e3, t3) => m2(e3, t3 || `event dispose handler`), on: (t3, n2, r2) => e2._subscribeEvent(o2, X(u2, t3), n2, false, r2), once: (t3, n2, r2) => e2._subscribeEvent(o2, X(u2, t3), n2, true, r2), emit: (t3, ...n2) => {
    d2.assertActive(`events.emit`);
    let r2 = X(u2, t3, { forEmit: true });
    return e2._eventConsumers.publish(o2, r2), e2._eventBus.emit(r2, ...n2);
  }, emitAsync: (t3, ...n2) => {
    d2.assertActive(`events.emitAsync`);
    let r2 = X(u2, t3, { forEmit: true });
    return e2._eventConsumers.publish(o2, r2), e2._eventBus.emitAsync(r2, ...n2);
  } }, services: { provide: (t3) => (d2.assertActive(`services.provide`), e2._modServiceRegistry.provide(u2, d2, t3, l2)), resolve: (t3, n2) => (d2.assertActive(`services.resolve`), e2._modServiceRegistry.resolve(u2, d2, t3, n2, l2)), list: () => (d2.assertActive(`services.list`), e2._modServiceRegistry.list()) }, files: o2.filesPlan.forRuntime(o2), storage: Fe({ namespace: u2, scope: d2, service: e2._ownedDataService, saveIdentity: e2._createSaveIdentity((e3) => o2.persistenceAudit.record(e3)), reportMutation: (e3) => o2.persistenceAudit.record(e3) }), gpn: { reload: () => (d2.assertActive(`gpn.reload`), e2._services?.reloadAll?.()), status: () => e2._services?.getPatcherStatus?.() ?? null, getOriginalData: (t3) => e2._services?.getOriginalData?.(t3) ?? null }, log: { info: (e3) => G.info(`[${u2}] ${e3}`), warn: (e3) => G.warn(`[${u2}] ${e3}`), error: (e3) => G.error(`[${u2}] ${e3}`) }, unsafe: { get engine() {
    return y2(`unsafe.engine`), b2;
  }, hooks: x2 }, ...v2 }, C2 = /* @__PURE__ */ new Set([`meta`, `compat`, `runtime`, `ui`, `settings`, `controls`, `events`, `services`, `files`, `storage`, `log`, `unsafe`]);
  for (let e3 of Object.keys(S2)) {
    if (C2.has(e3)) continue;
    let t3 = S2[e3];
    Object.defineProperty(S2, e3, { enumerable: true, configurable: false, get() {
      return y2(e3), t3;
    } });
  }
  return S2;
}
var $ = class {
  constructor(t2 = {}) {
    this._runtimes = /* @__PURE__ */ new Map(), this._hookManager = t2.hookManager || new pe(), this._services = null, this._sceneListenerInstalled = false, this._stickyEvents = /* @__PURE__ */ new Map(), this._operation = Promise.resolve(), this._operationActive = 0, this._executedScripts = /* @__PURE__ */ new WeakMap(), this._generation = 0, this._settingsApplyRevision = 0, this._startupSession = null, this._filePlanIds = /* @__PURE__ */ new WeakMap(), this._nextFilePlanId = 1, this._fileConsumerRevision = 0, this._fileConsumerSignature = null, this._cleanupFailure = null, this._lastCleanupReport = null, this._ownedDataService = t2.ownedDataService || Ie, this._createSaveIdentity = t2.createSaveIdentity || ((e2) => Pe({ getPlayers: () => n(), storage: { getItem: (e3) => globalThis.localStorage.getItem(e3) }, reportMutation: e2 })), this._fileLoader = t2.fileLoader || v, this._modSettingsRegistry = t2.modSettingsRegistry || re, this._modControlsRegistry = t2.modControlsRegistry || ie, this._createApi = t2.createApi || oe, this._showToast = t2.showToast || u, this._moduleImporter = t2.moduleImporter || ((t3) => e(() => import(t3), [])), this._createObjectUrl = t2.createObjectUrl || Ge, this._revokeObjectUrl = t2.revokeObjectUrl || ((e2) => URL.revokeObjectURL(e2)), this._setupTimeoutMs = q(t2.defaultSetupTimeoutMs, Le, 10), this._importTimeoutMs = q(t2.defaultImportTimeoutMs, Re, 10), this._eventTimeoutMs = q(t2.defaultEventTimeoutMs, ze, 10), this._eventBus = t2.eventBus || new fe({ onError: (e2, t3) => G.error(`Event '${t3.eventName}' listener failed: ${e2}`) }), this._dataConsumers = le(), this._eventConsumers = ue(), this._dataRestoration = de({ clone: Y, restore: Ue }), this._modServiceRegistry = t2.modServiceRegistry || Te(), this._combatModifierRegistry = t2.combatModifierRegistry || ae({ onError: (e2, t3) => G.error(`[${t3.owner || `unknown`}] combat listener failed: ${e2}`) });
  }
  _runExclusive(e2) {
    this._operationActive += 1;
    let t2 = async () => {
      try {
        return await e2();
      } finally {
        --this._operationActive;
      }
    }, n2 = this._operation.then(t2, t2);
    return this._operation = n2.catch(() => {
    }), n2;
  }
  getStatus() {
    const conflictCounts = /* @__PURE__ */ new Map();
    for (const conflict of this._hookManager.getConflicts()) {
      for (const owner of new Set(conflict.owners)) conflictCounts.set(owner, (conflictCounts.get(owner) || 0) + 1);
    }
    return Array.from(this._runtimes.values()).map((e2) => ({ namespace: e2.namespace, name: e2.pack?.meta?.name || e2.namespace, version: e2.pack?.meta?.version || ``, apiVersion: Number(e2.pack?.meta?.apiVersion || 0), state: e2.state, phase: e2.phase, errors: [...e2.errors], warnings: [...e2.warnings], hasControls: e2.hasControls === true, hasSettings: e2.hasSettings === true, entry: e2.pack?.meta?.js?.entry || ``, conflicts: conflictCounts.get(e2.namespace) || 0, generation: e2.generation, setupDurationMs: e2.setupDurationMs ?? null, startupOwned: e2.startupOwned, unmanagedDomains: [...e2.unmanagedDomains].sort(), pendingTasks: e2.scope?.pendingTaskCount || 0, taskRevision: e2.scope?.taskRevision ?? null, persistentActivity: e2.persistenceAudit?.snapshot() || null })).sort((e2, t2) => e2.name.localeCompare(t2.name));
  }
  _getFileConsumers() {
    if (!this._filesPlan) return null;
    let e2 = [...this._runtimes.values()].filter((e3) => e3.scope?.isActive), t2 = /* @__PURE__ */ new Set([this._filesPlan, ...e2.map((e3) => e3.filesPlan)]), n2 = [], r2 = [];
    for (let e3 of t2) {
      this._filePlanIds.has(e3) || this._filePlanIds.set(e3, this._nextFilePlanId++);
      let t3 = e3.getConsumers();
      r2.push([this._filePlanIds.get(e3), t3.revision]), n2.push(...t3.edges.filter((t4) => {
        let n3 = this._runtimes.get(t4.consumer);
        return n3?.scope?.isActive && n3.filesPlan === e3;
      }));
    }
    let i2 = JSON.stringify([r2, e2.map((e3) => [e3.namespace, e3.generation])]);
    return this._fileConsumerSignature !== null && this._fileConsumerSignature !== i2 && this._fileConsumerRevision++, this._fileConsumerSignature = i2, Object.freeze({ domain: `files`, complete: false, revision: this._fileConsumerRevision, edges: Object.freeze(n2) });
  }
  _getHookConsumers() {
    let e2 = this._hookManager.getConsumers(), t2 = e2.edges.flatMap((e3) => {
      let t3 = this._runtimes.get(e3.provider), n2 = this._runtimes.get(e3.consumer);
      return !t3?.scope?.isActive || !n2?.scope?.isActive ? [] : [Object.freeze({ ...e3, providerGeneration: t3.generation, consumerGeneration: n2.generation, providerDigest: t3.pack.contentDigest, consumerDigest: n2.pack.contentDigest })];
    });
    return Object.freeze({ ...e2, edges: Object.freeze(t2) });
  }
  getDiagnostics() {
    let e2 = this._eventBus.getListenerCounts?.() || {};
    return { generation: this._generation, operationPending: this._operationActive > 0, runtimes: this.getStatus(), fileConsumers: this._getFileConsumers(), serviceConsumers: this._modServiceRegistry.getConsumers(), dataConsumers: this._dataConsumers.getConsumers(), eventConsumers: this._eventConsumers.getConsumers(), hookConsumers: this._getHookConsumers(), hooks: this._hookManager.getHooks(), conflicts: this._hookManager.getConflicts(), services: this._modServiceRegistry.getStatus(), combatModifiers: this._combatModifierRegistry.getStatus(), listenerCounts: e2, listenerTotal: Object.values(e2).reduce((e3, t2) => e3 + Number(t2 || 0), 0) };
  }
  _subscribeEvent(e2, t2, n2, r2 = false, i2 = {}) {
    if (typeof n2 != `function`) return () => false;
    e2.scope.assertActive(`subscribe to ${t2}`);
    let a2 = String(t2 || ``);
    if (!a2) throw Error(`events.on() requires an event name`);
    i2 = i2 && typeof i2 == `object` ? i2 : {};
    let o2 = String(i2.label || `event listener ${a2}`), s2 = e2.scope.guard(n2, { label: o2 }), c2 = this._stickyEvents.has(a2), l2 = () => false, u2 = w({ runtime: e2.scope, signal: i2.signal, label: o2, onCancel: () => l2() });
    if (!u2.active) return u2.cancel;
    if (!Be.has(a2)) try {
      this._eventConsumers.subscribe(e2, a2);
    } catch (e3) {
      throw u2.cancel(), e3;
    }
    if (r2 && c2) return s2(this._stickyEvents.get(a2)), u2.cancel(), u2.cancel;
    !r2 && c2 && s2(this._stickyEvents.get(a2));
    let d2 = r2 ? (...e3) => {
      try {
        return s2(...e3);
      } finally {
        u2.cancel();
      }
    } : s2;
    return l2 = this._eventBus.on(a2, d2), u2.cancel;
  }
  bindServices(e2 = {}) {
    this._services = { reloadAll: typeof e2.reloadAll == `function` ? e2.reloadAll : null, getPatcherStatus: typeof e2.getPatcherStatus == `function` ? e2.getPatcherStatus : null, getOriginalData: typeof e2.getOriginalData == `function` ? e2.getOriginalData : null, getCurrentData: typeof e2.getCurrentData == `function` ? e2.getCurrentData : null, restoreData: typeof e2.restoreData == `function` ? e2.restoreData : null, restoreAllData: typeof e2.restoreAllData == `function` ? e2.restoreAllData : null, listBackups: typeof e2.listBackups == `function` ? e2.listBackups : null, hasBackup: typeof e2.hasBackup == `function` ? e2.hasBackup : null, exportJson: typeof e2.exportJson == `function` ? e2.exportJson : null, exportLang: typeof e2.exportLang == `function` ? e2.exportLang : null, setObjectsData: typeof e2.setObjectsData == `function` ? e2.setObjectsData : null, hasFeature: typeof e2.hasFeature == `function` ? e2.hasFeature : null };
  }
  notifyEngineReady(e2 = {}) {
    this._stickyEvents.set(`engine:ready`, e2), this._eventBus.emit(`engine:ready`, e2), !this._sceneListenerInstalled && a() && (l((e3) => {
      this._eventBus.emit(`scene:after-launch`, { sceneName: e3 });
    }), this._sceneListenerInstalled = true);
  }
  notifyPatchesLoaded(e2 = {}) {
    this._stickyEvents.set(`patches:loaded`, e2), this._eventBus.emit(`patches:loaded`, e2);
  }
  emit(e2, t2) {
    return this._eventBus.emit(e2, t2);
  }
  async emitAsync(e2, t2, n2 = {}) {
    let r2 = q(n2.timeoutMs, this._eventTimeoutMs, 10);
    try {
      return await Z(this._eventBus.emitAsync(e2, t2), r2, `Event '${e2}'`);
    } catch (t3) {
      return G.warn(`${t3}`), { eventName: e2, delivered: 0, errors: [t3], timedOut: true };
    }
  }
  _startupError(e2, t2) {
    return Object.assign(Error(t2), { code: e2, restartRequired: true, status: this.getStatus() });
  }
  beginStartupFromPacks(e2, { fileLoader: t2 = this._fileLoader } = {}) {
    return this._runExclusive(async () => {
      if (this._startupSession || this._generation || this._runtimes.size) throw this._startupError(`MOD_RESTART_REQUIRED`, `Startup needs a fresh loader`);
      let n2 = b(e2);
      if (n2.blocked.size) throw this._startupError(`STARTUP_PLAN_INVALID`, `Startup dependency plan is blocked`);
      for (let e3 of n2.ordered) C(e3, { hasFeature: this._services?.hasFeature });
      let r2 = n2.ordered.filter((e3) => e3.meta.js.startup === true), i2 = new Set(r2.map(K)), a2 = new Set(n2.ordered.map(K));
      for (let e3 of r2) for (let t3 of n2.required.get(K(e3)) || []) if (a2.has(t3) && !i2.has(t3)) throw this._startupError(`STARTUP_DEPENDENCY_LATE`, `Startup dependency must opt in: ${t3}`);
      this._generation++;
      let s2 = this._generation, c2 = () => JSON.stringify(e2.map((e3) => [e3.dir, e3.meta, e3.contentDigest, e3.enabled, e3.preflightErrors, e3.errors])), l2 = { phase: `starting`, inUse: false, reader: t2, registrations: ce(o), plan: n2, signature: c2(), signatureNow: c2 };
      l2.assertCurrent = () => {
        let e3 = false;
        try {
          e3 = l2.signature === l2.signatureNow();
        } catch {
        }
        if (!e3) {
          l2.phase = `failed`;
          for (let e4 of this._runtimes.values()) e4.state = `failed`, e4.phase = l2.inUse ? `failed-restart-required` : `failed`, e4.errors.push(`Startup package plan changed`);
          throw this._startupError(`STARTUP_PLAN_STALE`, `Startup package plan changed`);
        }
      }, this._startupSession = l2, this._filesPlan = R(e2, { fileLoader: t2, hasFeature: this._services?.hasFeature, getRuntime: (e3) => this._runtimes.get(e3), isCurrent: (e3) => this._runtimes.get(e3.namespace) === e3 && l2.phase !== `aborted`, isStartupRuntime: (e3) => !!e3 && i2.has(e3.namespace) && e3.generation === s2 && [`startup`, `startup-ready`].includes(e3.state) });
      let u2 = Object.freeze({ prepareRegistrations: (e3) => {
        if (l2.phase !== `ready`) throw Error(`Startup registration plan is unavailable`);
        return l2.assertCurrent(), l2.registrations.prepare(e3);
      }, publishRegistrations: () => (l2.assertCurrent(), l2.registrations.publish()), getResources: () => l2.registrations.getResources(), markInUse: () => {
        if (l2.phase !== `ready`) throw Error(`Startup session is not ready for publication`);
        return l2.assertCurrent(), l2.inUse ? false : (l2.inUse = true, true);
      } });
      l2.handle = u2;
      try {
        for (let e3 of r2) if (l2.assertCurrent(), await this._loadPack(e3, { startup: true }), l2.assertCurrent(), this._runtimes.get(K(e3))?.state !== `startup-ready`) throw this._startupError(`STARTUP_FAILED`, `Startup mod failed`);
        return l2.registrations.seal(), l2.phase = `ready`, u2;
      } catch (e3) {
        throw l2.phase = `failed`, await this._disposeAll(`startup-failed`), await l2.registrations.dispose(), e3;
      }
    });
  }
  completeStartup(e2) {
    return this._runExclusive(async () => {
      let t2 = this._startupSession;
      if (!t2 || t2.handle !== e2 || t2.phase !== `ready`) throw this._startupError(`STARTUP_SESSION_INVALID`, `Invalid startup completion`);
      t2.assertCurrent(), t2.phase = `completing`;
      try {
        for (let e3 of t2.plan.ordered) {
          t2.assertCurrent(), await this._loadPack(e3, { resume: e3.meta.js.startup === true }), t2.assertCurrent();
          let n2 = this._runtimes.get(K(e3));
          if (![`active`, `degraded`].includes(n2?.state)) throw this._startupError(`STARTUP_SETUP_FAILED`, `Late setup failed`);
        }
        return t2.phase = `complete`, this.getStatus();
      } catch (e3) {
        throw t2.phase = `failed`, t2.inUse || (await this._disposeAll(`startup-setup-failed`), await t2.registrations.dispose()), e3;
      }
    });
  }
  abortStartup(e2) {
    return this._runExclusive(async () => {
      let t2 = this._startupSession;
      if (!t2 || t2.handle !== e2) throw Error(`Invalid startup session`);
      if (t2.inUse) throw this._startupError(`MOD_RESTART_REQUIRED`, `Published startup scopes require restart`);
      t2.phase = `aborted`;
      let n2 = await this._disposeAll(`startup-aborted`);
      return await t2.registrations.dispose(), n2;
    });
  }
  loadFromPacks(e2, t2 = {}) {
    return this._runExclusive(() => this._loadFromPacks(e2, t2));
  }
  async _loadFromPacks(e2, t2 = {}) {
    if (this._startupSession) throw this._startupError(`MOD_RESTART_REQUIRED`, `Cold-start JS session requires restart`);
    if (e2.some((e3) => e3.enabled !== false && e3.meta?.js?.startup === true)) throw this._startupError(`STARTUP_PHASE_REQUIRED`, `Startup mods require the cold-start lifecycle`);
    let n2 = t2.reason || `reload`;
    t2.emitReloadEvents !== false && await this.emitAsync(`mods:reload-before`, { reason: n2 });
    let r2 = await this._disposeAll(n2);
    if (!r2.ok) throw Object.assign(Error(`Previous JS mod cleanup failed; restart the game before reloading`), { code: `MOD_CLEANUP_FAILED`, report: r2, restartRequired: true });
    this._generation += 1, this._filesPlan = R(e2, { fileLoader: this._fileLoader, hasFeature: this._services?.hasFeature, getRuntime: (e3) => this._runtimes.get(e3), isCurrent: (e3) => this._runtimes.get(e3.namespace) === e3 });
    let i2 = b(e2), a2 = (e3, t3, n3, r3 = []) => {
      this._runtimes.set(e3, { namespace: e3, pack: t3, state: `failed`, phase: `dependency-check`, startupOwned: false, unmanagedDomains: /* @__PURE__ */ new Set(), settingsRegistry: this._modSettingsRegistry, errors: [...n3], warnings: [...r3], hasControls: false, hasSettings: false, generation: this._generation, scope: null });
    };
    for (let [e3, t3] of i2.blocked) a2(e3, t3.pack, t3.errors, t3.warnings);
    for (let e3 of i2.ordered) {
      let t3 = (i2.required.get(K(e3)) || []).filter((e4) => {
        let t4 = this._runtimes.get(String(e4 || ``));
        return t4 && t4.state !== `active` && t4.state !== `degraded`;
      });
      if (t3.length > 0) {
        a2(K(e3), e3, [`Dependencies failed to activate: ${t3.join(`, `)}`]);
        continue;
      }
      await this._loadPack(e3);
    }
    return t2.emitReloadEvents !== false && await this.emitAsync(`mods:reload-after`, { reason: n2, status: this.getStatus() }), this.getStatus();
  }
  reloadFromPacks(e2, t2 = {}) {
    return this.loadFromPacks(e2, { reason: t2.reason || `reload`, emitReloadEvents: t2.emitReloadEvents !== false });
  }
  disposeAll(e2 = `dispose-all`) {
    return this._runExclusive(async () => {
      this._startupSession && !this._startupSession.inUse && (this._startupSession.phase = `aborted`);
      let t2 = await this._disposeAll(e2);
      return this._startupSession && !this._startupSession.inUse && await this._startupSession.registrations.dispose(), t2;
    });
  }
  disposeRuntimeSubset(e2, { expectedGeneration: t2, reason: n2 = `configuration-change` } = {}) {
    if (!Array.isArray(e2) || !e2.length || e2.some((e3) => typeof e3 != `string` || !e3.trim()) || new Set(e2).size !== e2.length) return Promise.reject(Error(`Unique runtime namespaces are required`));
    let r2 = new Set(e2);
    return this._runExclusive(async () => {
      if (t2 !== this._generation) throw Error(`Runtime generation changed before grouped cleanup`);
      if (this._cleanupFailure) throw this._startupError(`MOD_CLEANUP_FAILED`, `Previous cleanup requires restart`);
      if (this._startupSession && this._startupSession.phase !== `complete`) throw this._startupError(`STARTUP_SESSION_INVALID`, `Startup has not completed`);
      this._startupSession?.assertCurrent();
      for (let e4 of r2) {
        let t3 = this._runtimes.get(e4);
        if (!t3?.scope?.isActive || ![`active`, `degraded`].includes(t3.state)) throw Error(`Runtime is not active: ${e4}`);
        if (t3.startupOwned) throw this._startupError(`MOD_RESTART_REQUIRED`, `Startup scope requires restart: ${e4}`);
      }
      let e3 = [...this._runtimes.values()].filter((e4) => e4.scope?.isActive), i2 = new Set(e3.map((e4) => e4.namespace)), a2 = [];
      for (let t3 of e3) {
        let e4 = this._executedScripts.get(t3);
        if (!e4) throw Error(`Runtime execution identity is missing: ${t3.namespace}`);
        let n3 = JSON.parse(e4.signature);
        for (let e5 of [...n3.depends || [], ...n3.optionalDepends || []]) i2.has(e5) && a2.push({ provider: e5, consumer: t3.namespace });
      }
      a2.push(...this._getFileConsumers()?.edges || [], ...this._modServiceRegistry.getConsumers().edges, ...this._dataConsumers.getConsumers().edges, ...this._eventConsumers.getConsumers().edges, ...this._getHookConsumers().edges);
      let o2 = new Set(a2.filter((e4) => r2.has(e4.provider) && i2.has(e4.consumer) && !r2.has(e4.consumer)).map((e4) => e4.consumer));
      if (o2.size) throw Error(`Grouped cleanup omits consumers: ${[...o2].sort().join(`, `)}`);
      let s2 = x(e3.filter((e4) => r2.has(e4.namespace)).map((e4) => ({ meta: { uuid: e4.namespace, depends: [...new Set(a2.filter((t3) => ![`data-contribution`, `data-observation`, `event-observation`, `hook-sharing`].includes(t3.kind) && t3.consumer === e4.namespace && r2.has(t3.provider)).map((e5) => e5.provider))] } })));
      if (s2.blocked.size) throw Error(`Runtime consumer ordering is blocked`);
      let c2 = this._dataConsumers.closeAdmission(r2), l2, u2, d2;
      try {
        d2 = this._hookManager.closeOwnerAdmission(r2), u2 = this._eventConsumers.closeAdmission(r2), l2 = this._modServiceRegistry.closeProviderAdmission(r2);
      } catch (e4) {
        throw d2?.(), u2?.(), c2(), e4;
      }
      let f2 = [], p2 = [];
      for (let e4 of [...s2.ordered].reverse()) {
        let t3 = e4.meta.uuid;
        if (!r2.has(t3)) continue;
        let i3 = this._runtimes.get(t3), a3 = await Q(this, i3, n2);
        f2.push(a3);
        for (let e5 of a3.errors) p2.push(Object.freeze({ namespace: t3, ...e5 }));
        this._runtimes.delete(t3);
      }
      let m2 = Object.freeze({ ok: p2.length === 0, reason: n2, generation: this._generation, mods: Object.freeze(f2), errors: Object.freeze(p2), restartRequired: p2.length > 0 });
      return this._lastCleanupReport = m2, p2.length ? this._cleanupFailure = m2 : (l2(), d2(), u2(), c2()), m2;
    });
  }
  beginManagedRebuild() {
    if (this._managedRebuildGuard || this._cleanupFailure || this._operationActive) throw Error(`Runtime is not ready for managed rebuild`);
    if (this.getStatus().filter((e2) => e2.state !== `disposed`).some((e2) => e2.state !== `active` || e2.startupOwned || e2.unmanagedDomains.length)) throw Error(`Runtime uses APIs that require restart`);
    return this._managedRebuildGuard = true, () => {
      this._managedRebuildGuard = false;
    };
  }
  getLiveSettingsSupport() {
    return S({ generation: this._generation, revision: this._settingsApplyRevision, runtimes: [...this._runtimes.values()].filter((e2) => e2.scope?.isActive && [`active`, `degraded`].includes(e2.state)).map((e2) => ({ namespace: e2.namespace, generation: e2.generation, supported: e2.state === `active` && !!e2.settingsApplyHandler })) });
  }
  applyLiveSettings(e2, t2) {
    let n2 = S(e2);
    return this._runExclusive(async () => {
      if (JSON.stringify(this.getLiveSettingsSupport()) !== JSON.stringify(t2) || this._cleanupFailure) throw Error(`Settings application handlers changed`);
      for (let e3 of n2) {
        let t3 = this._runtimes.get(e3.namespace), n3 = t3?.settingsApplyHandler;
        if (!n3 || !t3.scope.isActive) throw Error(`Settings application handler is unavailable`);
        if (await Z(Promise.resolve().then(() => n3.callback(e3)), this._eventTimeoutMs, `Settings application`), !t3.scope.isActive || t3.settingsApplyHandler !== n3) throw Error(`Settings application handler retired`);
      }
    });
  }
  transferRuntimeSettings({ namespaces: e2, expectedGeneration: t2, sourceRegistry: n2, targetRegistry: r2, updates: i2 = [] } = {}) {
    if (!Array.isArray(e2) || !e2.length || e2.some((e3) => typeof e3 != `string` || !e3.trim()) || new Set(e2).size !== e2.length || n2 === r2) return Promise.reject(Error(`Unique runtime namespaces and distinct settings registries are required`));
    let a2 = [...e2];
    return this._runExclusive(() => {
      if (t2 !== this._generation) throw Error(`Runtime generation changed before settings transfer`);
      if (this._cleanupFailure) throw this._startupError(`MOD_CLEANUP_FAILED`, `Previous cleanup requires restart`);
      if (this._startupSession && this._startupSession.phase !== `complete`) throw this._startupError(`STARTUP_SESSION_INVALID`, `Startup has not completed`);
      let e3 = a2.map((e4) => {
        let t3 = this._runtimes.get(e4);
        if (!t3?.scope?.isActive || ![`active`, `degraded`].includes(t3.state) || t3.settingsRegistry !== n2) throw Error(`Runtime settings owner changed: ${e4}`);
        return t3;
      }), o2 = n2.captureRetainedSettings(a2);
      for (let e4 of i2) {
        let t3 = o2.find((t4) => t4.namespace === e4.namespace);
        if (!t3 || JSON.stringify(t3.entry) !== JSON.stringify(e4.previous) || !t3.definition || e4.next?.schemaVersion !== t3.definition.schemaVersion) throw Error(`Live settings transfer does not match its source schema`);
        t3.entry = structuredClone(e4.next);
      }
      let s2 = [];
      try {
        for (let t3 of e3) for (let e4 of t3.settingsSubscriptions) s2.push({ record: e4, off: r2.subscribe(t3.namespace, e4.callback) });
        r2.adoptRetainedSettings(o2);
      } catch (e4) {
        for (let e5 of s2) e5.off();
        throw e4;
      }
      for (let { record: e4, off: t3 } of s2) e4.off(), e4.off = t3;
      for (let t3 of e3) t3.settingsRegistry = r2, n2.unregisterModSettings(t3.namespace);
      return Object.freeze({ namespaces: Object.freeze(a2), generation: this._generation });
    });
  }
  loadRuntimeSubset(e2, { namespaces: t2, expectedGeneration: n2, fileLoader: r2, modSettingsRegistry: i2 } = {}) {
    if (!Array.isArray(e2) || !Array.isArray(t2) || t2.some((e3) => typeof e3 != `string` || !e3.trim()) || new Set(t2).size !== t2.length) return Promise.reject(Error(`Captured packages and unique runtime namespaces are required`));
    let a2 = new Set(t2), o2 = S(e2.map(({ dir: e3, meta: t3, contentDigest: n3, enabled: r3, errors: i3, preflightErrors: a3 }) => ({ dir: e3, meta: t3, contentDigest: n3, enabled: r3, errors: i3, preflightErrors: a3 })));
    return this._runExclusive(async () => {
      if (n2 !== this._generation) throw Error(`Runtime generation changed before grouped loading`);
      if (this._cleanupFailure) throw this._startupError(`MOD_CLEANUP_FAILED`, `Previous cleanup requires restart`);
      if (this._startupSession && this._startupSession.phase !== `complete`) throw this._startupError(`STARTUP_SESSION_INVALID`, `Startup has not completed`);
      if (this._startupSession?.assertCurrent(), !i2 || typeof r2?.getPackSnapshotFrom != `function`) throw Error(`Captured files and settings registry are required`);
      let e3 = x(o2), t3 = { ...e3, ordered: e3.ordered.filter((e4) => e4.meta?.js?.entry) };
      if (t3.blocked.size) throw Error(`Grouped runtime target dependencies are blocked`);
      let s2 = /* @__PURE__ */ new Map();
      for (let e4 of o2.filter((e5) => e5.enabled !== false)) {
        if (e4.errors?.length) throw Error(`Target package failed preparation: ${K(e4)}`);
        ne(e4, { hasFeature: this._services?.hasFeature });
        let t4 = r2.getPackSnapshotFrom(e4.dir);
        if (!/^[a-f0-9]{64}$/.test(e4.contentDigest || ``) || t4?.digest !== e4.contentDigest) throw Error(`Captured package identity is missing: ${K(e4)}`);
        if (s2.has(e4.dir)) throw Error(`Captured package directories are ambiguous`);
        s2.set(e4.dir, t4);
      }
      let c2 = Object.freeze({ getPackSnapshotFrom: (e4) => s2.get(e4) || null, readTextFrom: async (e4, t4) => s2.get(e4)?.readText(t4.replaceAll(`\\`, `/`)) ?? null }), l2 = R(o2, { fileLoader: c2, hasFeature: this._services?.hasFeature, getRuntime: (e4) => this._runtimes.get(e4), isCurrent: (e4) => this._runtimes.get(e4.namespace) === e4 }), u2 = new Map(t3.ordered.map((e4) => [K(e4), e4]));
      for (let e4 of a2) {
        let t4 = u2.get(e4);
        if (!t4) throw Error(`Selected runtime is not in the target: ${e4}`);
        if (this._runtimes.has(e4)) throw Error(`Stop the previous runtime before loading: ${e4}`);
        if (t4.meta.js.startup === true) throw this._startupError(`MOD_RESTART_REQUIRED`, `Startup scope requires restart: ${e4}`);
        let { entryPath: n3 } = C(t4, { hasFeature: this._services?.hasFeature });
        if (!s2.get(t4.dir).readText(n3)) throw Error(`Captured JS entry is empty: ${e4}`);
      }
      let d2 = (e4) => {
        let { thumbnailUrl: t4, ...n3 } = e4;
        return JSON.stringify(n3);
      };
      for (let e4 of this._runtimes.values()) {
        if (!e4.scope?.isActive) continue;
        let t4 = u2.get(e4.namespace), n3 = this._executedScripts.get(e4);
        if (!t4 || !n3 || ![`active`, `degraded`].includes(e4.state) || t4.contentDigest !== n3.contentDigest || d2(t4.meta) !== d2(JSON.parse(n3.signature))) throw Error(`Target changes a retained runtime: ${e4.namespace}`);
        if ([...t4.meta.depends || [], ...t4.meta.optionalDepends || []].some((e5) => a2.has(e5))) throw Error(`Stop runtime consumers before loading providers: ${e4.namespace}`);
        if (JSON.stringify(e4.filesPlan.getProviderBindings(e4.namespace)) !== JSON.stringify(l2.getProviderBindings(e4.namespace))) throw Error(`Target changes retained file providers: ${e4.namespace}`);
      }
      for (let e4 of u2.keys()) if (!a2.has(e4) && !this._runtimes.get(e4)?.scope?.isActive) throw Error(`Target runtime was not selected for loading: ${e4}`);
      this._filesPlan = l2, this._generation++;
      let f2 = [];
      try {
        for (let e4 of t3.ordered) {
          let t4 = K(e4);
          if (!a2.has(t4)) continue;
          f2.push(t4), await this._loadPack(e4, { reader: c2, filesPlan: l2, settingsRegistry: i2, subset: true });
          let n3 = this._runtimes.get(t4);
          if (![`active`, `degraded`].includes(n3?.state)) throw Error(`Grouped setup failed: ${t4}: ${n3?.errors.join(`; `)}`);
        }
        return this.getStatus();
      } catch (e4) {
        let t4 = [], n3 = [];
        for (let e5 of f2.reverse()) {
          let r4 = this._runtimes.get(e5);
          if (!r4) continue;
          let i3 = await Q(this, r4, `grouped-load-failed`);
          t4.push(i3);
          for (let t5 of i3.errors) n3.push(Object.freeze({ namespace: e5, ...t5 }));
          this._runtimes.delete(e5);
        }
        let r3 = Object.freeze({ ok: n3.length === 0, reason: `grouped-load-failed`, generation: this._generation, mods: Object.freeze(t4), errors: Object.freeze(n3), restartRequired: n3.length > 0 });
        throw this._lastCleanupReport = r3, n3.length && (this._cleanupFailure = r3), Object.assign(Error(`Runtime replacement failed: ${J(e4)}`), { code: `MOD_SUBSET_LOAD_FAILED`, cause: e4, cleanup: r3, restartRequired: true });
      }
    });
  }
  getCleanupReport() {
    return this._lastCleanupReport;
  }
  async _disposeAll(e2 = `dispose-all`) {
    if (this._startupSession?.inUse) throw this._startupError(`MOD_RESTART_REQUIRED`, `Published startup scopes require restart`);
    if (this._cleanupFailure && this._runtimes.size === 0) return this._cleanupFailure;
    let t2 = [], n2 = [];
    for (let r2 of [...this._runtimes.values()].reverse()) {
      let i2 = await Q(this, r2, e2);
      t2.push(i2);
      for (let e3 of i2.errors) n2.push(Object.freeze({ namespace: r2.namespace, ...e3 }));
    }
    this._runtimes.clear();
    for (let [t3, r2] of [[`controls`, () => this._modControlsRegistry.clearModControls()], [`hooks`, () => this._hookManager.restoreAll()], [`services`, () => this._modServiceRegistry.clear(e2)], [`combat-modifiers`, () => this._combatModifierRegistry.clear(e2)]]) try {
      await r2();
    } catch (e3) {
      n2.push(Object.freeze({ namespace: null, stage: t3, error: e3, message: J(e3) }));
    }
    return this._cleanupFailure ? this._lastCleanupReport = this._cleanupFailure : (this._lastCleanupReport = Object.freeze({ ok: n2.length === 0, reason: e2, generation: this._generation, mods: Object.freeze(t2), errors: Object.freeze(n2), restartRequired: n2.length > 0 }), n2.length && (this._cleanupFailure = this._lastCleanupReport)), this._lastCleanupReport;
  }
  async _loadPack(e2, { startup: t2 = false, resume: n2 = false, reader: r2 = this._startupSession?.reader || this._fileLoader, filesPlan: i2 = this._filesPlan, settingsRegistry: a2 = this._modSettingsRegistry, subset: o2 = false } = {}) {
    let s2 = K(e2), c2 = n2 ? this._runtimes.get(s2) : { namespace: s2, startupOwned: t2, unmanagedDomains: /* @__PURE__ */ new Set(), reader: r2, filesPlan: i2, settingsRegistry: a2, settingsSubscriptions: /* @__PURE__ */ new Set(), persistenceAudit: Ee(), pack: e2, state: `discovered`, phase: `discovered`, url: ``, errors: [], warnings: [], settingsSchema: null, hasControls: false, hasSettings: false, generation: this._generation, setupDurationMs: null, scope: null };
    n2 || (c2.scope = ve({ namespace: s2, cleanupTimeoutMs: q(e2?.meta?.js?.cleanupTimeoutMs, 2e3, 10), onError: (e3, t3) => {
      c2.warnings.push(`${t3.label}: ${J(e3)}`), G.warn(`[${s2}] ${t3.label} failed: ${e3}`);
    } })), this._runtimes.set(s2, c2);
    let l2 = c2.modDef || null, u2 = c2.ctx || null, d2 = c2.moduleDisposeRegistered === true;
    try {
      let { entryPath: r3, warnings: i3 } = C(e2, { hasFeature: this._services?.hasFeature });
      if (c2.warnings.push(...i3), !n2) {
        c2.state = `importing`, c2.phase = `read-entry`;
        let t3 = JSON.stringify(e2.meta), n3 = e2.dir, i4 = e2.contentDigest, a4 = te(e2), o4 = a4 ? a4.source : await c2.reader.readTextFrom(e2.dir, r3.replace(/\//g, `\\`));
        if (!o4) throw Error(`JS entry not found or empty: ${r3}`);
        if (e2.dir !== n3 || JSON.stringify(e2.meta) !== t3 || e2.contentDigest !== i4) throw Error(`JS package changed while reading its entry`);
        this._executedScripts.set(c2, Object.freeze({ dir: n3, signature: t3, contentDigest: i4, entryPath: r3, source: o4 })), c2.phase = `import-module`, c2.url = this._createObjectUrl(o4, s2, r3);
        let u3 = q(e2?.meta?.js?.importTimeoutMs, this._importTimeoutMs), d3 = await Z(this._moduleImporter(c2.url, { source: o4, pack: e2, runtime: c2 }), u3, `JS module import`);
        if (this._startupSession?.assertCurrent(), l2 = Ve(d3), typeof l2?.setup != `function`) throw Error(`JS mod must export setup(ctx) or a default object with setup(ctx)`);
        c2.modDef = l2;
      }
      if (t2) {
        if (typeof l2.startup != `function`) throw Error(`js.startup requires startup(ctx)`);
        c2.state = `startup`, c2.phase = `startup`;
        let t3 = this._startupSession;
        u2 = Object.freeze({ meta: Object.freeze({ namespace: s2, version: e2.meta.version }), files: c2.filesPlan.forRuntime(c2), runtime: Ke(c2.scope), log: Object.freeze(Object.fromEntries([`info`, `warn`, `error`].map((e3) => [e3, (t4) => G[e3](`[${s2}] ${t4}`)]))), ...t3.registrations.context(c2) }), c2.ctx = u2;
        let n3 = Promise.resolve(l2.startup(u2));
        n3.then(async (e3) => {
          if (!c2.scope.isActive && typeof e3 == `function`) try {
            await e3();
          } catch {
            G.warn(`[${s2}] late startup cleanup failed`);
          }
        }).catch(() => {
        });
        let r4 = await Z(n3, q(e2.meta.js.setupTimeoutMs, this._setupTimeoutMs), `JS mod startup`);
        typeof r4 == `function` && c2.scope.addCleanup(r4, `startup() returned cleanup`), this._startupSession?.assertCurrent(), typeof l2.dispose == `function` && (c2.scope.addCleanup(() => l2.dispose(c2.ctx), `module dispose()`), c2.moduleDisposeRegistered = d2 = true), c2.state = c2.phase = `startup-ready`;
        return;
      }
      c2.state = `setup`, c2.phase = `setup`, u2 = c2.ctx = qe(this, e2, c2);
      let a3 = Date.now(), o3 = q(e2?.meta?.js?.setupTimeoutMs, this._setupTimeoutMs), f2 = Promise.resolve(l2.setup(u2));
      f2.then(async (e3) => {
        if (!(c2.scope.isActive || typeof e3 != `function`)) try {
          await e3();
        } catch (e4) {
          G.warn(`[${s2}] late setup cleanup failed: ${e4}`);
        }
      }).catch(() => {
      });
      let p2 = await Z(f2, o3, `JS mod setup`);
      c2.setupDurationMs = Date.now() - a3, typeof p2 == `function` && c2.scope.addCleanup(p2, `setup() returned cleanup`), !d2 && typeof l2.dispose == `function` && (c2.scope.addCleanup(() => l2.dispose(u2), `module dispose()`), d2 = true), this._startupSession?.assertCurrent(), c2.hasControls = !!this._modControlsRegistry.getModControlDefinition(s2), c2.hasSettings = !!c2.settingsSchema, c2.state = c2.warnings.length > 0 ? `degraded` : `active`, c2.phase = `active`, G.info(`[${s2}] JS mod activated`);
    } catch (e3) {
      if (c2.errors.push(J(e3)), c2.state = `failed`, c2.phase = `rollback`, this._startupSession?.inUse && !o2) throw c2.phase = `failed-restart-required`, this._startupError(e3?.code === `STARTUP_PLAN_STALE` ? e3.code : `STARTUP_SETUP_FAILED`, J(e3));
      if (!d2 && typeof l2?.dispose == `function` && u2) try {
        await l2.dispose(u2);
      } catch (e4) {
        c2.warnings.push(`module dispose() after failure: ${J(e4)}`), c2.initialCleanupErrors = [{ stage: `module-dispose`, error: e4, message: J(e4) }];
      }
      await Q(this, c2, `load-failed`), c2.state = `failed`, c2.phase = `failed`, G.error(`[${s2}] JS mod failed: ${e3}`);
    }
  }
};
function createJsModLoader(e2 = {}) {
  return new $(e2);
}
export {
  createJsModLoader,
  $ as t
};
