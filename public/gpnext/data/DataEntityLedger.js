import { t as e } from "../core/Logger.js";
var t = new e(`data-identities`), n = (e2) => [...new TextEncoder().encode(e2)].map((e3) => e3.toString(16).padStart(2, `0`)).join(``), r = (e2, t2) => `data:${e2}:${n(t2)}`;
function i(e2) {
  let t2 = {};
  for (let [n2, r2] of [[`plant`, `PLANTS`], [`zombie`, `ZOMBIES`]]) {
    let i2 = e2[`${n2}Features`]?.[r2];
    if (!Array.isArray(i2)) throw Error(`Native identity baseline is missing`);
    let a2 = i2.map((e3) => e3?.CODENAME);
    if (a2.some((e3) => typeof e3 != `string` || !e3) || new Set(a2).size !== a2.length) throw Error(`Native identity baseline is ambiguous`);
    t2[n2] = Object.freeze(a2);
  }
  return Object.freeze(t2);
}
function a({ original: e2, patched: t2, previousLedger: n2 = [] }) {
  let a2 = i(t2), o2 = /* @__PURE__ */ new Set();
  for (let e3 of n2.filter((e4) => e4.origin === `data`)) {
    if (![`plant`, `zombie`].includes(e3.kind) || e3.id !== r(e3.kind, e3.codename)) throw Error(`Invalid previous data entity identity`);
    o2.add(e3.id);
  }
  let s = [];
  for (let t3 of [`plant`, `zombie`]) {
    let n3 = new Map(e2[t3].map((e3, t4) => [e3, t4]));
    for (let [e3, i2] of a2[t3].entries()) {
      let a3 = r(t3, i2);
      (n3.get(i2) !== e3 || o2.has(a3)) && s.push(Object.freeze({ id: a3, kind: t3, engineId: e3, codename: i2, origin: `data` }));
    }
  }
  return Object.freeze(s);
}
function o(e2, n2) {
  let r2 = [];
  for (let t2 of e2) {
    let e3 = n2[t2.kind];
    (e3?.[t2.codename] !== t2.engineId || e3?.[t2.engineId] !== t2.codename) && r2.push(t2.id);
  }
  r2.length && t.warn(`DATA_ENTITY_MAPPING_UNVERIFIED: prepared entity slots differ from runtime enumerations; continuing startup`, { identities: r2 });
}
export {
  a as n,
  o as r,
  i as t
};
