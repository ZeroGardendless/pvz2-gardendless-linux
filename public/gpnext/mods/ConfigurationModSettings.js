import { r as e } from "./ModOperationPlan.js";
var t = (e2, t2) => JSON.stringify(e2) === JSON.stringify(t2), n = (e2) => e2 && typeof e2 == `object` && !Array.isArray(e2), r = (e2) => String(e2.runtimeNamespace || e2.id).trim();
function i(e2) {
  if (e2?.version !== 1 || !n(e2.mods)) throw Error(`Captured mod settings are required`);
  for (let [t2, r2] of Object.entries(e2.mods)) if (!t2 || t2.trim() !== t2 || !n(r2) || !Number.isFinite(r2.schemaVersion) || !n(r2.values)) throw Error(`Invalid captured mod settings`);
  return e2;
}
function a(e2, t2) {
  i(t2);
  let n2 = e2.mods.map(r);
  if (new Set(n2).size !== n2.length) throw Error(`Ambiguous mod settings namespace`);
  return { ...e2, modSettings: t2, mods: e2.mods.map((e3) => ({ ...e3, settings: t2.mods[r(e3)]?.values || {} })) };
}
function o(n2, o2) {
  if (n2.active.generation !== o2.generation) throw Error(`Mod settings generation changed`);
  let s = n2.active.configuration, c = n2.desired;
  i(s.modSettings), i(c.modSettings);
  let l = s.mods.find((e2) => e2.enabled && r(e2) === o2.namespace), u = l && c.mods.find((e2) => e2.id === l.id);
  if (!l || !u || u.version !== l.version || u.contentDigest !== l.contentDigest) throw Error(`Mod settings target changed`);
  let d = s.modSettings.mods[o2.namespace];
  if (!t(d, o2.previous)) throw Error(`Active mod settings changed`);
  let f = o2.next;
  i({ version: 1, mods: { [o2.namespace]: f } });
  let p = c.modSettings.mods[o2.namespace];
  if (!d && p || d && (!p || p.schemaVersion !== d.schemaVersion)) throw Error(`Pending mod settings conflict`);
  let m = d || { schemaVersion: f.schemaVersion, values: {} }, h = p || m, g = { ...h.values };
  for (let e2 of /* @__PURE__ */ new Set([...Object.keys(m.values), ...Object.keys(f.values)])) {
    let n3 = Object.hasOwn(m.values, e2), r2 = Object.hasOwn(f.values, e2);
    if (!(n3 === r2 && t(m.values[e2], f.values[e2]))) {
      if (Object.hasOwn(h.values, e2) !== n3 || !t(h.values[e2], m.values[e2])) throw Error(`Pending mod settings conflict`);
      r2 ? Object.defineProperty(g, e2, { value: f.values[e2], enumerable: true, writable: true, configurable: true }) : delete g[e2];
    }
  }
  let _ = { ...s.modSettings, mods: { ...s.modSettings.mods, [o2.namespace]: f } }, v = { ...c.modSettings, mods: { ...c.modSettings.mods, [o2.namespace]: { schemaVersion: f.schemaVersion, values: g } } };
  return e({ ...n2, active: { ...n2.active, configuration: { ...a(s, _), revision: s.revision + 1 } }, desired: { ...a(c, v), revision: c.revision + 1 } });
}
export {
  a as i,
  r as n,
  i as r,
  o as t
};
