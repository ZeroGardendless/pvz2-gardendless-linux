import { n as e } from "../vendor/ModuleHelpers.js";
import { i as t } from "./FileLoader.js";
var n = e({ projectJsModdingSelection: () => r, reconcileJsModdingSelection: () => i });
function r(e2, t2, n2) {
  let r2 = /* @__PURE__ */ new Set();
  if (!n2) {
    for (let t3 of e2.mods) t3.suspendedByJsModding && r2.add(t3.id);
    for (let e3 of t2) (e3.meta.js || (e3.meta.requiredGpNextFeatures || []).some((e4) => [`experimental.jsModding`, `runtime.jsModding`].includes(e4))) && r2.add(e3.meta.uuid);
    let n3;
    do {
      n3 = false;
      for (let e3 of t2) !r2.has(e3.meta.uuid) && e3.meta.depends.some((e4) => r2.has(e4)) && (r2.add(e3.meta.uuid), n3 = true);
    } while (n3);
  }
  let i2 = e2.mods.map((e3) => {
    let { suspendedByJsModding: t3, ...i3 } = e3, a = e3.enabled || t3 === true;
    return !n2 && r2.has(e3.id) && a ? { ...i3, enabled: false, suspendedByJsModding: true } : { ...i3, enabled: a };
  });
  return JSON.stringify(i2) === JSON.stringify(e2.mods) ? e2 : { ...e2, revision: e2.revision + 1, mods: i2 };
}
async function i(e2, n2, i2) {
  let a = e2.getState();
  if (a.journal || a.recovery?.required) throw Error(`Resolve recovery before changing the JS selection`);
  let o = await Promise.all(a.desired.mods.map(async (e3) => {
    if (!e3.enabled && !(i2 && e3.suspendedByJsModding)) return { meta: { uuid: e3.id, depends: [] } };
    if (typeof e3.containsScripts == `boolean` && Array.isArray(e3.depends) && Array.isArray(e3.requiredGpNextFeatures)) return { meta: { uuid: e3.id, js: e3.containsScripts, depends: e3.depends, requiredGpNextFeatures: e3.requiredGpNextFeatures } };
    let r2 = await n2.read(e3.contentDigest);
    if (!r2 || r2.digest !== e3.contentDigest) throw Error(`Configured installed snapshot is missing or differs`);
    return t(/* @__PURE__ */ new Map([[`selection`, r2]])).describeInstalled(`selection`, e3);
  })), s = r(a.desired, o, i2);
  if (e2.getState() !== a) throw Error(`Mod configuration changed during JS selection preparation`);
  s !== a.desired && await e2.saveDesired(s, a.desired.revision);
}
export {
  i as n,
  n as t
};
