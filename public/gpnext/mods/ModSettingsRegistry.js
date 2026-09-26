import { n as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
import { d as n, o as r, r as i, s as a, t as o, u as s } from "../platform/FileSystem.js";
import { M as c, j as l } from "./FileLoader.js";
var u = e({ createModSettingsRegistry: () => T, exportModSettings: () => I, getModSettings: () => N, getRegisteredModSettings: () => M, importModSettings: () => L, loadModSettingsFile: () => O, readLegacyModSettingsSnapshot: () => m, registerModSettings: () => A, removeModSettingsNamespaces: () => k, resetModSettings: () => F, stripModSettingsNamespaces: () => w, subscribe: () => D, unregisterModSettings: () => j, updateModSetting: () => P }), d = new t(`mod-settings`), f = 1, p = `gp-next\\mod-settings.json`;
async function m() {
  let e2 = { baseDir: n.AppData }, t2 = y(c), i2 = await o(t2, e2) ? t2 : p !== t2 && await o(p, e2) ? p : null, a2 = i2 === null ? null : await r(i2, e2), s2 = a2 === null ? { version: 1, mods: {} } : JSON.parse(a2);
  if (!s2 || s2.version !== void 0 && s2.version !== 1 || !s2.mods || typeof s2.mods != `object` || Array.isArray(s2.mods)) throw Error(`Unsupported legacy mod settings`);
  for (let [e3, t3] of Object.entries(s2.mods)) if (!e3.trim() || e3.trim() !== e3 || !t3 || !Number.isFinite(t3.schemaVersion) || !t3.values || typeof t3.values != `object` || Array.isArray(t3.values)) throw Error(`Invalid legacy mod settings entry`);
  return { path: i2, raw: a2, data: b(s2) };
}
function h(e2) {
  return JSON.parse(JSON.stringify(e2));
}
function g(e2) {
  return Array.isArray(e2) ? e2.map(g) : e2 && typeof e2 == `object` ? Object.fromEntries(Object.entries(e2).map(([e3, t2]) => [e3, g(t2)])) : e2;
}
function _(e2) {
  return { namespace: e2.namespace, title: e2.title, description: e2.description, schemaVersion: e2.schemaVersion, fields: Array.isArray(e2.fields) ? e2.fields.map(g) : [] };
}
function v(e2) {
  return String(e2 || ``).trim();
}
function y(e2) {
  return String(e2 || ``).replace(/\\/g, `/`).replace(/\/+/g, `/`);
}
function b(e2) {
  let t2 = e2 && typeof e2 == `object` ? e2 : {}, n2 = t2.mods && typeof t2.mods == `object` ? t2.mods : {}, r2 = {};
  for (let [e3, t3] of Object.entries(n2)) {
    let n3 = v(e3);
    n3 && (r2[n3] = { schemaVersion: Number.isFinite(Number(t3?.schemaVersion)) ? Number(t3.schemaVersion) : 1, values: t3?.values && typeof t3.values == `object` ? { ...t3.values } : {} });
  }
  return { version: f, mods: r2 };
}
function x(e2) {
  let t2 = {};
  for (let n2 of Array.isArray(e2?.fields) ? e2.fields : []) n2?.key && (t2[n2.key] = n2.default);
  return t2;
}
function S(e2, t2) {
  let n2 = t2 && typeof t2 == `object` ? { schemaVersion: Number.isFinite(Number(t2.schemaVersion)) ? Number(t2.schemaVersion) : 1, values: t2.values && typeof t2.values == `object` ? { ...t2.values } : {} } : { schemaVersion: 1, values: {} };
  if (!e2 || n2.schemaVersion >= e2.schemaVersion) return n2;
  let r2 = { ...n2.values };
  for (let t3 of Array.isArray(e2.fields) ? e2.fields : []) if (!(!t3?.key || typeof t3.migrate != `function`)) try {
    let e3 = t3.migrate(r2[t3.key], n2.schemaVersion);
    e3 !== void 0 && (r2[t3.key] = e3);
  } catch (n3) {
    d.warn(`migrate() failed for ${e2.namespace}.${t3.key}: ${n3}`);
  }
  return { schemaVersion: e2.schemaVersion, values: r2 };
}
function C(e2, t2) {
  if (!e2) return t2;
  if (typeof e2.validate == `function`) try {
    let n2 = e2.validate(t2);
    if (n2 !== void 0) return n2;
  } catch (t3) {
    d.warn(`validate() failed for ${e2.key}: ${t3}`);
  }
  switch (e2.type) {
    case `toggle`:
      return t2 === true;
    case `number`:
    case `slider`: {
      let n2 = Number(t2);
      if (!Number.isFinite(n2)) return e2.default;
      let r2 = n2;
      if (Number.isFinite(Number(e2.min)) && (r2 = Math.max(Number(e2.min), r2)), Number.isFinite(Number(e2.max)) && (r2 = Math.min(Number(e2.max), r2)), Number.isFinite(Number(e2.step)) && Number(e2.step) > 0) {
        let t3 = Number(e2.step), n3 = Number.isFinite(Number(e2.min)) ? Number(e2.min) : 0;
        r2 = Math.round((r2 - n3) / t3) * t3 + n3;
      }
      return r2;
    }
    case `select`:
      return (Array.isArray(e2.options) ? e2.options : []).map((e3) => String(e3?.value)).includes(String(t2)) ? String(t2) : e2.default;
    default:
      return t2 == null ? e2.default ?? `` : String(t2);
  }
}
function w(e2, t2) {
  let n2 = b(e2), r2 = new Set(Array.from(t2 || [], (e3) => v(e3)).filter(Boolean));
  for (let e3 of r2) delete n2.mods[e3];
  return n2;
}
function T(e2 = {}) {
  let t2 = Object.hasOwn(e2, `initialData`);
  if (t2 && typeof e2.storage?.write != `function`) throw Error(`Captured settings require storage.write`);
  let u2 = /* @__PURE__ */ new Map(), f2 = /* @__PURE__ */ new Map(), m2 = /* @__PURE__ */ new Map(), T2 = t2 ? b(h(e2.initialData)) : null, E2 = null, D2 = Promise.resolve(), O2 = null;
  async function k2(n2, r2) {
    let i2 = T2?.mods[r2.namespace]?.values || {}, a2 = b(h(n2));
    t2 ? await e2.storage.write(h(a2), Object.freeze({ ...r2 })) : await M2(a2), T2 = a2;
    let o2 = a2.mods[r2.namespace]?.values || {};
    if (!(![`set`, `reset`, `import`].includes(r2.operation) || e2.canNotify?.() === false || JSON.stringify(i2) === JSON.stringify(o2))) for (let e3 of [...u2.get(r2.namespace) || []]) {
      if (!u2.get(r2.namespace)?.has(e3)) continue;
      let t3 = { namespace: r2.namespace, operation: r2.operation, previous: h(i2), values: h(o2) };
      try {
        Promise.resolve(e3(t3)).catch((e4) => d.warn(`Settings observer failed`, e4));
      } catch (e4) {
        d.warn(`Settings observer failed`, e4);
      }
    }
  }
  function A2(e3, t3) {
    let n2 = v(e3);
    if (!n2 || typeof t3 != `function`) throw Error(`Settings subscription requires a namespace and listener`);
    u2.has(n2) || u2.set(n2, /* @__PURE__ */ new Set());
    let r2 = u2.get(n2);
    return r2.add(t3), () => {
      r2.delete(t3), !r2.size && u2.get(n2) === r2 && u2.delete(n2);
    };
  }
  async function j2() {
    await i(y(l.ROOT), { baseDir: n.AppData, recursive: true });
  }
  async function M2(e3 = T2) {
    await j2(), await s(y(c), JSON.stringify(e3, null, 2), { baseDir: n.AppData });
  }
  function N2(e3) {
    if (O2) return Promise.reject(Error(`Mod settings writes are suspended or closed`));
    let t3 = D2.then(e3, e3);
    return D2 = t3.catch(() => {
    }), t3;
  }
  function P2() {
    if (O2) throw Error(`Mod settings writes are already suspended or closed`);
    let e3 = { closed: false, drained: false };
    O2 = e3;
    let t3 = D2.then(() => {
      e3.drained = true;
    });
    return Object.freeze({ ready: t3, resume() {
      if (O2 !== e3 || e3.closed || !e3.drained) throw Error(`Mod settings barrier cannot resume`);
      O2 = null;
    }, close() {
      e3.closed = true;
    } });
  }
  function F2() {
    if (!O2?.drained || O2.closed || !T2) throw Error(`Settings transfer requires suspended, drained registries`);
  }
  function I2(e3) {
    return F2(), e3.map((e4) => ({ namespace: e4, entry: Object.hasOwn(T2.mods, e4) ? h(T2.mods[e4]) : null, definition: f2.has(e4) ? _(f2.get(e4)) : null }));
  }
  function L2(e3) {
    F2();
    let t3 = /* @__PURE__ */ new Set(), n2 = e3.map(({ namespace: e4, entry: n3, definition: r2 }) => {
      if (!e4 || t3.has(e4) || f2.has(e4) || r2 && r2.namespace !== e4) throw Error(`Retained settings schema conflicts with target registry`);
      t3.add(e4);
      let i2 = T2.mods[e4] ?? null;
      if (JSON.stringify(i2) !== JSON.stringify(n3)) throw Error(`Retained settings changed: ${e4}`);
      return r2 ? _(r2) : null;
    });
    for (let e4 of n2) e4 && (m2.set(e4.namespace, {}), f2.set(e4.namespace, e4));
  }
  async function R() {
    if (E2) return h(await E2);
    if (T2) return h(T2);
    if (t2) throw Error(`Captured mod settings are unavailable`);
    E2 = (async () => {
      try {
        let e3 = y(c), t3 = await o(e3, { baseDir: n.AppData }), i2 = !t3 && p !== e3 && await o(p, { baseDir: n.AppData });
        if (!t3 && !i2) {
          let e4 = b(null);
          return await M2(e4), T2 = e4, T2;
        }
        let s2 = await r(t3 ? e3 : p, { baseDir: n.AppData }), l2 = null;
        try {
          l2 = JSON.parse(s2);
        } catch (e4) {
          d.error(`Failed to parse mod-settings.json: ${e4}`);
        }
        let u3 = b(l2);
        return await M2(u3), T2 = u3, i2 && await a(p, { baseDir: n.AppData }).catch((e4) => {
          d.warn(`Unable to remove legacy mod settings path: ${e4}`);
        }), T2;
      } catch (e3) {
        return d.error(`Failed to load mod settings file: ${e3}`), T2 = b(null), T2;
      }
    })();
    try {
      return h(await E2);
    } finally {
      E2 = null;
    }
  }
  async function z(e3) {
    return e3 = Array.from(e3 || [], v), N2(async () => {
      let t3 = await R(), n2 = w(t3, e3), r2 = Object.keys(t3.mods).length - Object.keys(n2.mods).length;
      return await k2(n2, { namespace: null, operation: `removeNamespaces` }), r2;
    });
  }
  async function B(e3) {
    let t3 = v(e3?.namespace);
    if (!t3) throw Error(`registerModSettings() requires a namespace`);
    let n2 = m2.get(t3);
    n2 || (n2 = {}, m2.set(t3, n2));
    let r2 = { namespace: t3, title: String(e3?.title || t3), description: typeof e3?.description == `string` ? e3.description : ``, schemaVersion: Number.isFinite(Number(e3?.schemaVersion)) ? Number(e3.schemaVersion) : 1, fields: Array.isArray(e3?.fields) ? e3.fields.map(g) : [] };
    return N2(async () => {
      let e4 = await R(), i2 = e4.mods[t3];
      return i2 ? e4.mods[t3] = S(r2, i2) : e4.mods[t3] = { schemaVersion: r2.schemaVersion, values: x(r2) }, await k2(e4, { namespace: t3, operation: `register` }), m2.get(t3) === n2 && f2.set(t3, r2), _(r2);
    });
  }
  function V(e3) {
    e3 = v(e3), m2.delete(e3), f2.delete(e3), u2.delete(e3);
  }
  function H() {
    return Array.from(f2.values()).map((e3) => _(e3)).sort((e3, t3) => e3.title.localeCompare(t3.title));
  }
  async function U(e3) {
    let t3 = v(e3), n2 = await R(), r2 = f2.get(t3), i2 = S(r2, n2.mods[t3] || { schemaVersion: 1, values: {} }), a2 = { ...x(r2) };
    for (let e4 of Array.isArray(r2?.fields) ? r2.fields : []) e4?.key && (a2[e4.key] = C(e4, i2.values?.[e4.key]));
    for (let [e4, t4] of Object.entries(i2.values || {})) a2[e4] === void 0 && (a2[e4] = t4);
    return { namespace: t3, schemaVersion: i2.schemaVersion || r2?.schemaVersion || 1, values: h(a2) };
  }
  async function W(e3, t3, n2) {
    return n2 = n2 === void 0 ? void 0 : h(n2), N2(async () => {
      let r2 = v(e3), i2 = await R(), a2 = f2.get(r2), o2 = Array.isArray(a2?.fields) ? a2.fields.find((e4) => e4?.key === t3) : null;
      return i2.mods[r2] || (i2.mods[r2] = { schemaVersion: a2?.schemaVersion || 1, values: {} }), i2.mods[r2].schemaVersion = a2?.schemaVersion || i2.mods[r2].schemaVersion || 1, i2.mods[r2].values[t3] = C(o2, n2), await k2(i2, { namespace: r2, operation: `set`, key: t3 }), U(r2);
    });
  }
  async function G(e3) {
    return N2(async () => {
      let t3 = v(e3), n2 = await R(), r2 = f2.get(t3);
      return n2.mods[t3] = { schemaVersion: r2?.schemaVersion || 1, values: x(r2) }, await k2(n2, { namespace: t3, operation: `reset` }), U(t3);
    });
  }
  async function K(e3) {
    let t3 = v(e3), n2 = await U(t3);
    return JSON.stringify({ namespace: t3, schemaVersion: n2.schemaVersion, values: n2.values }, null, 2);
  }
  async function q(e3, t3) {
    return t3 = t3 === void 0 ? void 0 : h(t3), N2(async () => {
      let n2 = v(e3), r2 = f2.get(n2), i2 = await R(), a2 = t3;
      typeof t3 == `string` && (a2 = JSON.parse(t3));
      let o2 = a2 && typeof a2 == `object` ? a2 : { values: {} }, s2 = S(r2, { schemaVersion: o2.schemaVersion, values: o2.values });
      return i2.mods[n2] = s2, await k2(i2, { namespace: n2, operation: `import` }), U(n2);
    });
  }
  return Object.freeze({ subscribe: A2, suspendMutations: P2, captureRetainedSettings: I2, adoptRetainedSettings: L2, loadModSettingsFile: R, removeModSettingsNamespaces: z, registerModSettings: B, unregisterModSettings: V, getRegisteredModSettings: H, getModSettings: U, updateModSetting: W, resetModSettings: G, exportModSettings: K, importModSettings: q });
}
var E = T(), D = (...e2) => E.subscribe(...e2), O = (...e2) => E.loadModSettingsFile(...e2), k = (...e2) => E.removeModSettingsNamespaces(...e2), A = (...e2) => E.registerModSettings(...e2), j = (...e2) => E.unregisterModSettings(...e2), M = (...e2) => E.getRegisteredModSettings(...e2), N = (...e2) => E.getModSettings(...e2), P = (...e2) => E.updateModSetting(...e2), F = (...e2) => E.resetModSettings(...e2), I = (...e2) => E.exportModSettings(...e2), L = (...e2) => E.importModSettings(...e2);
export {
  m as i,
  M as n,
  u as r,
  T as t
};
