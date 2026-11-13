import { r as e } from "./ModOperationPlan.js";
var t = (e2, t2) => JSON.stringify(e2) === JSON.stringify(t2), n = (e2) => e2 && typeof e2 == `object` && !Array.isArray(e2), r = (e2) => String(e2.runtimeNamespace || e2.id).trim(), i = (e2) => ({ mods: e2.mods.map(({ id: e3, version: t2, contentDigest: n2, enabled: r2, suspendedByJsModding: i2, settings: a2 }) => ({ id: e3, version: t2, contentDigest: n2, enabled: r2, suspendedByJsModding: i2, settings: a2 })), overrides: e2.overrides?.map(({ kind: e3, contentDigest: t2 }) => ({ kind: e3, contentDigest: t2 })), modSettings: e2.modSettings });
function a(e2) {
  if (e2?.version !== 1 || !n(e2.mods)) throw Error(`Captured mod settings are required`);
  for (let [t2, r2] of Object.entries(e2.mods)) if (!t2 || t2.trim() !== t2 || !n(r2) || !Number.isFinite(r2.schemaVersion) || !n(r2.values)) throw Error(`Invalid captured mod settings`);
  return e2;
}
function o(e2, t2) {
  a(t2);
  let n2 = e2.mods.map(r);
  if (new Set(n2).size !== n2.length) throw Error(`Ambiguous mod settings namespace`);
  return { ...e2, modSettings: t2, mods: e2.mods.map((e3) => ({ ...e3, settings: t2.mods[r(e3)]?.values || {} })) };
}
function s(n2, i2) {
  if (n2.active.generation !== i2.generation) throw Error(`Mod settings generation changed`);
  let s2 = n2.active.configuration, c = n2.desired;
  a(s2.modSettings), a(c.modSettings);
  let l = s2.mods.find((e2) => e2.enabled && r(e2) === i2.namespace), u = l && c.mods.find((e2) => e2.id === l.id);
  if (!l || !u || u.version !== l.version || u.contentDigest !== l.contentDigest) throw Error(`Mod settings target changed`);
  let d = s2.modSettings.mods[i2.namespace];
  if (!t(d, i2.previous)) throw Error(`Active mod settings changed`);
  let f = i2.next;
  a({ version: 1, mods: { [i2.namespace]: f } });
  let p = c.modSettings.mods[i2.namespace];
  if (!d && p || d && (!p || p.schemaVersion !== d.schemaVersion)) throw Error(`Pending mod settings conflict`);
  let m = d || { schemaVersion: f.schemaVersion, values: {} }, h = p || m, g = { ...h.values };
  for (let e2 of /* @__PURE__ */ new Set([...Object.keys(m.values), ...Object.keys(f.values)])) {
    let n3 = Object.hasOwn(m.values, e2), r2 = Object.hasOwn(f.values, e2);
    if (!(n3 === r2 && t(m.values[e2], f.values[e2]))) {
      if (Object.hasOwn(h.values, e2) !== n3 || !t(h.values[e2], m.values[e2])) throw Error(`Pending mod settings conflict`);
      r2 ? Object.defineProperty(g, e2, { value: f.values[e2], enumerable: true, writable: true, configurable: true }) : delete g[e2];
    }
  }
  let _ = { ...s2.modSettings, mods: { ...s2.modSettings.mods, [i2.namespace]: f } }, v = { ...c.modSettings, mods: { ...c.modSettings.mods, [i2.namespace]: { schemaVersion: f.schemaVersion, values: g } } };
  return e({ ...n2, active: { ...n2.active, configuration: { ...o(s2, _), revision: s2.revision + 1 } }, desired: { ...o(c, v), revision: c.revision + 1 } });
}
export {
  o as a,
  a as i,
  s as n,
  r,
  i as t
};
