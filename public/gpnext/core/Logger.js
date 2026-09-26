var e = [], t = 200, n = null;
function r() {
  return e;
}
function i(e2) {
  n = e2;
}
function a(r2, i2, a2, o2) {
  let s = { level: r2, module: i2, msg: o2.length ? a2 + ` ` + o2.map((e2) => {
    try {
      return typeof e2 == `object` ? JSON.stringify(e2) : String(e2);
    } catch {
      return String(e2);
    }
  }).join(` `) : a2, time: Date.now() };
  e.push(s), e.length > t && e.shift(), n && n(s);
}
var o = class {
  constructor(e2) {
    this.module = e2, this._prefix = `[GP Next:${e2}]`;
  }
  info(e2, ...t2) {
    console.log(this._prefix, e2, ...t2), a(`info`, this.module, e2, t2);
  }
  warn(e2, ...t2) {
    console.warn(this._prefix, e2, ...t2), a(`warn`, this.module, e2, t2);
  }
  error(e2, ...t2) {
    console.error(this._prefix, e2, ...t2), a(`error`, this.module, e2, t2);
  }
  debug(e2, ...t2) {
    globalThis.window?.gpNext?.debug && console.log(`${this._prefix} [DEBUG]`, e2, ...t2), a(`debug`, this.module, e2, t2);
  }
};
export {
  r as n,
  i as r,
  o as t
};
