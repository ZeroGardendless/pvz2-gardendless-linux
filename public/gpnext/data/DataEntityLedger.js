var e = (e2) => [...new TextEncoder().encode(e2)].map((e3) => e3.toString(16).padStart(2, `0`)).join(``), t = (t2, n2) => `data:${t2}:${e(n2)}`;
function n(e2) {
  let t2 = {};
  for (let [n2, r2] of [[`plant`, `PLANTS`], [`zombie`, `ZOMBIES`]]) {
    let i = e2[`${n2}Features`]?.[r2];
    if (!Array.isArray(i)) throw Error(`Native identity baseline is missing`);
    let a = i.map((e3) => e3?.CODENAME);
    if (a.some((e3) => typeof e3 != `string` || !e3) || new Set(a).size !== a.length) throw Error(`Native identity baseline is ambiguous`);
    t2[n2] = Object.freeze(a);
  }
  return Object.freeze(t2);
}
function r({ original: e2, patched: r2, previousLedger: i = [] }) {
  let a = n(r2), o = /* @__PURE__ */ new Set();
  for (let e3 of i.filter((e4) => e4.origin === `data`)) {
    if (![`plant`, `zombie`].includes(e3.kind) || e3.id !== t(e3.kind, e3.codename)) throw Error(`Invalid previous data entity identity`);
    o.add(e3.id);
  }
  let s = [];
  for (let n2 of [`plant`, `zombie`]) {
    let r3 = new Map(e2[n2].map((e3, t2) => [e3, t2]));
    for (let [e3, i2] of a[n2].entries()) {
      let a2 = t(n2, i2);
      (r3.get(i2) !== e3 || o.has(a2)) && s.push(Object.freeze({ id: a2, kind: n2, engineId: e3, codename: i2, origin: `data` }));
    }
  }
  return Object.freeze(s);
}
export {
  r as n,
  n as t
};
