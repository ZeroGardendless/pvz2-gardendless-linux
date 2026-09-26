import { n as e } from "../vendor/ModuleHelpers.js";
var t = e({ clearModControls: () => l, getModControlDefinition: () => d, getRegisteredModControls: () => u, onModControlsChange: () => f, registerModControls: () => s, unregisterModControls: () => c }), n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Set();
function i(e2) {
  return Array.isArray(e2) ? e2.map((e3) => ({ ...e3, items: Array.isArray(e3?.items) ? e3.items.map((e4) => ({ ...e4 })) : [] })) : [];
}
function a(e2) {
  return String(e2 || ``).trim();
}
function o() {
  for (let e2 of r) try {
    e2();
  } catch (e3) {
    console.error(`[gp-next] mod controls listener failed`, e3);
  }
}
function s(e2) {
  let t2 = a(e2?.namespace);
  if (!t2) throw Error(`registerModControls() requires a namespace`);
  let r2 = { namespace: t2, title: String(e2?.title || t2), description: typeof e2?.description == `string` ? e2.description : ``, groups: Array.isArray(e2?.groups) ? e2.groups.map((e3) => ({ ...e3, items: Array.isArray(e3?.items) ? e3.items.map((e4) => ({ ...e4 })) : [] })) : [] };
  return n.set(t2, r2), o(), r2;
}
function c(e2) {
  let t2 = a(e2);
  t2 && (n.delete(t2), o());
}
function l() {
  n.size !== 0 && (n.clear(), o());
}
function u() {
  return Array.from(n.values()).map((e2) => ({ namespace: e2.namespace, title: e2.title, description: e2.description, groups: i(e2.groups || []) })).sort((e2, t2) => e2.title.localeCompare(t2.title));
}
function d(e2) {
  return n.get(a(e2)) || null;
}
function f(e2) {
  return typeof e2 == `function` ? (r.add(e2), () => r.delete(e2)) : () => {
  };
}
export {
  t
};
