import { i as e } from "./FileLoader.js";
function projectJsModdingSelection(e2, t2, n2) {
  let r = /* @__PURE__ */ new Set();
  if (!n2) {
    for (let t3 of e2.mods) t3.suspendedByJsModding && r.add(t3.id);
    for (let e3 of t2) (e3.meta.js || (e3.meta.requiredGpNextFeatures || []).some((e4) => [`experimental.jsModding`, `runtime.jsModding`].includes(e4))) && r.add(e3.meta.uuid);
    let n3;
    do {
      n3 = false;
      for (let e3 of t2) !r.has(e3.meta.uuid) && e3.meta.depends.some((e4) => r.has(e4)) && (r.add(e3.meta.uuid), n3 = true);
    } while (n3);
  }
  let i = e2.mods.map((e3) => {
    let { suspendedByJsModding: t3, ...i2 } = e3, a = e3.enabled || t3 === true;
    return !n2 && r.has(e3.id) && a ? { ...i2, enabled: false, suspendedByJsModding: true } : { ...i2, enabled: a };
  });
  return JSON.stringify(i) === JSON.stringify(e2.mods) ? e2 : { ...e2, revision: e2.revision + 1, mods: i };
}
async function reconcileJsModdingSelection(n2, r, i) {
  let a = n2.getState();
  if (a.journal || a.recovery?.required) throw Error(`Resolve recovery before changing the JS selection`);
  let o = await Promise.all(a.desired.mods.map(async (t2) => {
    if (!t2.enabled && !(i && t2.suspendedByJsModding)) return { meta: { uuid: t2.id, depends: [] } };
    let n3 = await r.read(t2.contentDigest);
    if (!n3 || n3.digest !== t2.contentDigest) throw Error(`Configured installed snapshot is missing or differs`);
    return e(/* @__PURE__ */ new Map([[`selection`, n3]])).describeInstalled(`selection`, t2);
  })), s = projectJsModdingSelection(a.desired, o, i);
  if (n2.getState() !== a) throw Error(`Mod configuration changed during JS selection preparation`);
  s !== a.desired && await n2.saveDesired(s, a.desired.revision);
}
export {
  projectJsModdingSelection,
  reconcileJsModdingSelection
};
