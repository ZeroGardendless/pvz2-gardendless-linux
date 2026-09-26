function e(e2, t2, n2, r2) {
  if (n2 === `a` && !r2) throw TypeError(`Private accessor was defined without a getter`);
  if (typeof t2 == `function` ? e2 !== t2 || !r2 : !t2.has(e2)) throw TypeError(`Cannot read private member from an object whose class did not declare it`);
  return n2 === `m` ? r2 : n2 === `a` ? r2.call(e2) : r2 ? r2.value : t2.get(e2);
}
function t(e2, t2, n2, r2, i2) {
  if (r2 === `m`) throw TypeError(`Private method is not writable`);
  if (r2 === `a` && !i2) throw TypeError(`Private accessor was defined without a setter`);
  if (typeof t2 == `function` ? e2 !== t2 || !i2 : !t2.has(e2)) throw TypeError(`Cannot write private member to an object whose class did not declare it`);
  return r2 === `a` ? i2.call(e2, n2) : i2 ? i2.value = n2 : t2.set(e2, n2), n2;
}
var n, r = `__TAURI_TO_IPC_KEY__`;
function i(e2, t2 = false) {
  return window.__TAURI_INTERNALS__.transformCallback(e2, t2);
}
async function a(e2, t2 = {}, n2) {
  return window.__TAURI_INTERNALS__.invoke(e2, t2, n2);
}
var o = class {
  get rid() {
    return e(this, n, `f`);
  }
  constructor(e2) {
    n.set(this, void 0), t(this, n, e2, `f`);
  }
  async close() {
    return a(`plugin:resources|close`, { rid: this.rid });
  }
};
n = /* @__PURE__ */ new WeakMap();
export {
  i,
  r as n,
  a as r,
  o as t
};
