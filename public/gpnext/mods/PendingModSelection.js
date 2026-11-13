import { n as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
import { a as n, i as r, r as i } from "./ConfigurationModSettings.js";
var a = e({ applyPendingModSelection: () => v, clearPendingModSelection: () => h, projectModSelection: () => _, readPendingModSelection: () => d, subscribePendingModSelection: () => g, writePendingModSelection: () => f, writePendingModSettings: () => m }), o = `gp-next-pending-selection`, s = /* @__PURE__ */ new Set(), c = new t(`mod-selection`), l = /* @__PURE__ */ new Set(), u = () => {
  for (let e2 of s) try {
    e2();
  } catch (e3) {
    c.warn(`Selection observer failed`, e3);
  }
};
function d() {
  let e2 = localStorage.getItem(o);
  if (e2 === null) return null;
  try {
    let t2 = JSON.parse(e2);
    if (t2.version !== 1 || !Array.isArray(t2.mods) || new Set(t2.mods.map((e3) => e3.id)).size !== t2.mods.length || t2.mods.some((e3) => typeof e3.id != `string` || !e3.id || typeof e3.enabled != `boolean`)) throw Error(`Invalid pending selection`);
    if (t2.settings !== void 0) {
      if (!t2.settings || typeof t2.settings != `object` || Array.isArray(t2.settings)) throw Error(`Invalid pending settings`);
      for (let [e3, n2] of Object.entries(t2.settings)) {
        if (!n2 || typeof n2.version != `string` || !/^[a-f0-9]{64}$/.test(n2.contentDigest)) throw Error(`Invalid pending settings identity`);
        r({ version: 1, mods: { [e3]: n2.settings } });
      }
    }
    return t2;
  } catch (e3) {
    return c.warn(`Unable to read pending mod selection`, e3), null;
  }
}
function f(e2, t2 = d()?.settings) {
  return p({ version: 1, mods: e2.map(({ id: e3, enabled: t3 }) => ({ id: e3, enabled: t3 })), ...t2 && Object.keys(t2).length ? { settings: t2 } : {} });
}
function p(e2) {
  let t2 = JSON.stringify(e2);
  if (localStorage.setItem(o, t2), localStorage.getItem(o) !== t2) throw Error(`Pending mod selection could not be saved`);
  return u(), e2;
}
function m(e2, t2, n2) {
  r({ version: 1, mods: { [t2]: n2 } });
  let a2 = e2.mods.find((e3) => i(e3) === t2);
  if (!a2) throw Error(`Settings target is no longer installed`);
  let o2 = d();
  return p({ version: 1, mods: o2?.mods || e2.mods.map(({ id: e3, enabled: t3, suspendedByJsModding: n3 }) => ({ id: e3, enabled: t3 || n3 === true })), settings: { ...o2?.settings, [t2]: { version: a2.version, contentDigest: a2.contentDigest, settings: structuredClone(n2) } } });
}
function h(e2) {
  JSON.stringify(d()) === JSON.stringify(e2) && (localStorage.removeItem(o), u());
}
function g(e2) {
  return s.add(e2), () => s.delete(e2);
}
function _(e2, t2 = d()) {
  if (!t2) return e2;
  let r2 = new Map(e2.mods.map((e3) => [e3.id, e3])), a2 = [];
  for (let e3 of t2.mods) {
    let t3 = r2.get(e3.id);
    if (!t3) continue;
    let n2 = { ...t3, enabled: t3.suspendedByJsModding && e3.enabled ? false : e3.enabled };
    e3.enabled || delete n2.suspendedByJsModding, a2.push(n2), r2.delete(e3.id);
  }
  let o2 = { ...e2, mods: [...a2, ...r2.values()] };
  if (t2.settings) {
    let r3 = { ...e2.modSettings.mods };
    for (let [e3, n2] of Object.entries(t2.settings)) {
      let t3 = o2.mods.find((t4) => i(t4) === e3);
      if (t3) {
        if (t3.version !== n2.version || t3.contentDigest !== n2.contentDigest) {
          let r4 = `${e3}:${n2.contentDigest}:${t3.contentDigest}`;
          l.has(r4) || (l.add(r4), c.warn(`Pending settings retained for a different mod version`, { namespace: e3, selectedVersion: t3.version, settingsVersion: n2.version }));
          continue;
        }
        r3[e3] = n2.settings;
      }
    }
    o2 = n(o2, { version: 1, mods: r3 });
  }
  return o2;
}
async function v(e2) {
  let t2 = d();
  if (!t2) return e2.getState();
  let n2 = e2.getState(), r2 = _(n2.desired, t2);
  if (JSON.stringify(r2) !== JSON.stringify(n2.desired) && await e2.saveDesired({ ...r2, revision: r2.revision + 1 }, r2.revision), JSON.stringify(d()) === JSON.stringify(t2)) {
    let e3 = Object.fromEntries(Object.entries(t2.settings || {}).filter(([e4, t3]) => {
      let n3 = r2.mods.find((t4) => i(t4) === e4);
      return n3 && (n3.version !== t3.version || n3.contentDigest !== t3.contentDigest);
    }));
    Object.keys(e3).length ? p({ ...t2, mods: r2.mods.map(({ id: e4, enabled: t3, suspendedByJsModding: n3 }) => ({ id: e4, enabled: t3 || n3 === true })), settings: e3 }) : h(t2);
  }
  return e2.getState();
}
export {
  g as a,
  d as i,
  a as n,
  f as o,
  _ as r,
  m as s,
  v as t
};
