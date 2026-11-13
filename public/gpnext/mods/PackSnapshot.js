import { a as e } from "../GameBootstrap.js";
var t = Uint8Array, n = Uint16Array, r = Int32Array, i = new t([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), a = new t([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), o = new t([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), s = function(e2, t2) {
  for (var i2 = new n(31), a2 = 0; a2 < 31; ++a2) i2[a2] = t2 += 1 << e2[a2 - 1];
  for (var o2 = new r(i2[30]), a2 = 1; a2 < 30; ++a2) for (var s2 = i2[a2]; s2 < i2[a2 + 1]; ++s2) o2[s2] = s2 - i2[a2] << 5 | a2;
  return { b: i2, r: o2 };
}, c = s(i, 2), l = c.b, u = c.r;
l[28] = 258, u[258] = 28;
var d = s(a, 0), f = d.b;
d.r;
for (var p = new n(32768), m = 0; m < 32768; ++m) {
  var h = (m & 43690) >> 1 | (m & 21845) << 1;
  h = (h & 52428) >> 2 | (h & 13107) << 2, h = (h & 61680) >> 4 | (h & 3855) << 4, p[m] = ((h & 65280) >> 8 | (h & 255) << 8) >> 1;
}
for (var g = (function(e2, t2, r2) {
  for (var i2 = e2.length, a2 = 0, o2 = new n(t2); a2 < i2; ++a2) e2[a2] && ++o2[e2[a2] - 1];
  var s2 = new n(t2);
  for (a2 = 1; a2 < t2; ++a2) s2[a2] = s2[a2 - 1] + o2[a2 - 1] << 1;
  var c2;
  if (r2) {
    c2 = new n(1 << t2);
    var l2 = 15 - t2;
    for (a2 = 0; a2 < i2; ++a2) if (e2[a2]) for (var u2 = a2 << 4 | e2[a2], d2 = t2 - e2[a2], f2 = s2[e2[a2] - 1]++ << d2, m = f2 | (1 << d2) - 1; f2 <= m; ++f2) c2[p[f2] >> l2] = u2;
  } else for (c2 = new n(i2), a2 = 0; a2 < i2; ++a2) e2[a2] && (c2[a2] = p[s2[e2[a2] - 1]++] >> 15 - e2[a2]);
  return c2;
}), _ = new t(288), m = 0; m < 144; ++m) _[m] = 8;
for (var m = 144; m < 256; ++m) _[m] = 9;
for (var m = 256; m < 280; ++m) _[m] = 7;
for (var m = 280; m < 288; ++m) _[m] = 8;
for (var v = new t(32), m = 0; m < 32; ++m) v[m] = 5;
var ee = g(_, 9, 1), te = g(v, 5, 1), y = function(e2) {
  for (var t2 = e2[0], n2 = 1; n2 < e2.length; ++n2) e2[n2] > t2 && (t2 = e2[n2]);
  return t2;
}, b = function(e2, t2, n2) {
  var r2 = t2 / 8 | 0;
  return (e2[r2] | e2[r2 + 1] << 8) >> (t2 & 7) & n2;
}, x = function(e2, t2) {
  var n2 = t2 / 8 | 0;
  return (e2[n2] | e2[n2 + 1] << 8 | e2[n2 + 2] << 16) >> (t2 & 7);
}, ne = function(e2) {
  return (e2 + 7) / 8 | 0;
}, S = function(e2, n2, r2) {
  return (n2 == null || n2 < 0) && (n2 = 0), (r2 == null || r2 > e2.length) && (r2 = e2.length), new t(e2.subarray(n2, r2));
}, C = [`unexpected EOF`, `invalid block type`, `invalid length/literal`, `invalid distance`, `stream finished`, `no stream handler`, , `no callback`, `invalid UTF-8 data`, `extra field too long`, `date not in range 1980-2099`, `filename too long`, `stream finishing`, `invalid zip data`], w = function(e2, t2, n2) {
  var r2 = Error(t2 || C[e2]);
  if (r2.code = e2, Error.captureStackTrace && Error.captureStackTrace(r2, w), !n2) throw r2;
  return r2;
}, T = function(e2, n2, r2, s2) {
  var c2 = e2.length, u2 = s2 ? s2.length : 0;
  if (!c2 || n2.f && !n2.l) return r2 || new t(0);
  var d2 = !r2, p = d2 || n2.i != 2, m = n2.i;
  d2 && (r2 = new t(c2 * 3));
  var h = function(e3) {
    var n3 = r2.length;
    if (e3 > n3) {
      var i2 = new t(Math.max(n3 * 2, e3));
      i2.set(r2), r2 = i2;
    }
  }, _ = n2.f || 0, v = n2.p || 0, C2 = n2.b || 0, T2 = n2.l, E2 = n2.d, D2 = n2.m, O2 = n2.n, k2 = c2 * 8;
  do {
    if (!T2) {
      _ = b(e2, v, 1);
      var A2 = b(e2, v + 1, 3);
      if (v += 3, !A2) {
        var j2 = ne(v) + 4, M2 = e2[j2 - 4] | e2[j2 - 3] << 8, N2 = j2 + M2;
        if (N2 > c2) {
          m && w(0);
          break;
        }
        p && h(C2 + M2), r2.set(e2.subarray(j2, N2), C2), n2.b = C2 += M2, n2.p = v = N2 * 8, n2.f = _;
        continue;
      } else if (A2 == 1) T2 = ee, E2 = te, D2 = 9, O2 = 5;
      else if (A2 == 2) {
        var P2 = b(e2, v, 31) + 257, F2 = b(e2, v + 10, 15) + 4, I2 = P2 + b(e2, v + 5, 31) + 1;
        v += 14;
        for (var L2 = new t(I2), R2 = new t(19), z2 = 0; z2 < F2; ++z2) R2[o[z2]] = b(e2, v + z2 * 3, 7);
        v += F2 * 3;
        for (var B2 = y(R2), V2 = (1 << B2) - 1, re2 = g(R2, B2, 1), z2 = 0; z2 < I2; ) {
          var H2 = re2[b(e2, v, V2)];
          v += H2 & 15;
          var j2 = H2 >> 4;
          if (j2 < 16) L2[z2++] = j2;
          else {
            var U2 = 0, W2 = 0;
            for (j2 == 16 ? (W2 = 3 + b(e2, v, 3), v += 2, U2 = L2[z2 - 1]) : j2 == 17 ? (W2 = 3 + b(e2, v, 7), v += 3) : j2 == 18 && (W2 = 11 + b(e2, v, 127), v += 7); W2--; ) L2[z2++] = U2;
          }
        }
        var G2 = L2.subarray(0, P2), K2 = L2.subarray(P2);
        D2 = y(G2), O2 = y(K2), T2 = g(G2, D2, 1), E2 = g(K2, O2, 1);
      } else w(1);
      if (v > k2) {
        m && w(0);
        break;
      }
    }
    p && h(C2 + 131072);
    for (var q2 = (1 << D2) - 1, J2 = (1 << O2) - 1, Y2 = v; ; Y2 = v) {
      var U2 = T2[x(e2, v) & q2], X2 = U2 >> 4;
      if (v += U2 & 15, v > k2) {
        m && w(0);
        break;
      }
      if (U2 || w(2), X2 < 256) r2[C2++] = X2;
      else if (X2 == 256) {
        Y2 = v, T2 = null;
        break;
      } else {
        var Z2 = X2 - 254;
        if (X2 > 264) {
          var z2 = X2 - 257, Q = i[z2];
          Z2 = b(e2, v, (1 << Q) - 1) + l[z2], v += Q;
        }
        var $ = E2[x(e2, v) & J2], ie = $ >> 4;
        $ || w(3), v += $ & 15;
        var K2 = f[ie];
        if (ie > 3) {
          var Q = a[ie];
          K2 += x(e2, v) & (1 << Q) - 1, v += Q;
        }
        if (v > k2) {
          m && w(0);
          break;
        }
        p && h(C2 + 131072);
        var ae = C2 + Z2;
        if (C2 < K2) {
          var oe = u2 - K2, se = Math.min(K2, ae);
          for (oe + C2 < 0 && w(3); C2 < se; ++C2) r2[C2] = s2[oe + C2];
        }
        for (; C2 < ae; ++C2) r2[C2] = r2[C2 - K2];
      }
    }
    n2.l = T2, n2.p = Y2, n2.b = C2, n2.f = _, T2 && (_ = 1, n2.m = D2, n2.d = E2, n2.n = O2);
  } while (!_);
  return C2 != r2.length && d2 ? S(r2, 0, C2) : r2.subarray(0, C2);
}, E = new t(0), D = function(e2, t2) {
  return e2[t2] | e2[t2 + 1] << 8;
}, O = function(e2, t2) {
  return (e2[t2] | e2[t2 + 1] << 8 | e2[t2 + 2] << 16 | e2[t2 + 3] << 24) >>> 0;
}, k = function(e2, t2) {
  return O(e2, t2) + O(e2, t2 + 4) * 4294967296;
};
function A(e2, t2) {
  return T(e2, { i: 2 }, t2 && t2.out, t2 && t2.dictionary);
}
var j = typeof TextDecoder < `u` && new TextDecoder();
try {
  j.decode(E, { stream: true });
} catch {
}
var M = function(e2) {
  for (var t2 = ``, n2 = 0; ; ) {
    var r2 = e2[n2++], i2 = (r2 > 127) + (r2 > 223) + (r2 > 239);
    if (n2 + i2 > e2.length) return { s: t2, r: S(e2, n2 - 1) };
    i2 ? i2 == 3 ? (r2 = ((r2 & 15) << 18 | (e2[n2++] & 63) << 12 | (e2[n2++] & 63) << 6 | e2[n2++] & 63) - 65536, t2 += String.fromCharCode(55296 | r2 >> 10, 56320 | r2 & 1023)) : i2 & 1 ? t2 += String.fromCharCode((r2 & 31) << 6 | e2[n2++] & 63) : t2 += String.fromCharCode((r2 & 15) << 12 | (e2[n2++] & 63) << 6 | e2[n2++] & 63) : t2 += String.fromCharCode(r2);
  }
};
function N(e2, t2) {
  if (t2) {
    for (var n2 = ``, r2 = 0; r2 < e2.length; r2 += 16384) n2 += String.fromCharCode.apply(null, e2.subarray(r2, r2 + 16384));
    return n2;
  } else if (j) return j.decode(e2);
  else {
    var i2 = M(e2), a2 = i2.s, n2 = i2.r;
    return n2.length && w(8), a2;
  }
}
var P = function(e2, t2) {
  return t2 + 30 + D(e2, t2 + 26) + D(e2, t2 + 28);
}, F = function(e2, t2, n2) {
  var r2 = D(e2, t2 + 28), i2 = D(e2, t2 + 30), a2 = N(e2.subarray(t2 + 46, t2 + 46 + r2), !(D(e2, t2 + 8) & 2048)), o2 = t2 + 46 + r2, s2 = I(e2, o2, i2, n2, O(e2, t2 + 20), O(e2, t2 + 24), O(e2, t2 + 42)), c2 = s2[0], l2 = s2[1], u2 = s2[2];
  return [D(e2, t2 + 10), c2, l2, a2, o2 + i2 + D(e2, t2 + 32), u2];
}, I = function(e2, t2, n2, r2, i2, a2, o2) {
  var s2 = i2 == 4294967295, c2 = a2 == 4294967295, l2 = o2 == 4294967295, u2 = t2 + n2, d2 = s2 + c2 + l2;
  if (r2 && d2) {
    for (; t2 + 4 < u2; t2 += 4 + D(e2, t2 + 2)) if (D(e2, t2) == 1) return [s2 ? k(e2, t2 + 4 + 8 * c2) : i2, c2 ? k(e2, t2 + 4) : a2, l2 ? k(e2, t2 + 4 + 8 * (c2 + s2)) : o2, 1];
    r2 < 2 && w(13);
  }
  return [i2, a2, o2, 0];
};
function L(e2, n2) {
  for (var r2 = {}, i2 = e2.length - 22; O(e2, i2) != 101010256; --i2) (!i2 || e2.length - i2 > 65558) && w(13);
  var a2 = D(e2, i2 + 8);
  if (!a2) return {};
  var o2 = O(e2, i2 + 16), s2 = O(e2, i2 - 20) == 117853008;
  if (s2) {
    var c2 = O(e2, i2 - 12);
    s2 = O(e2, c2) == 101075792, s2 && (a2 = O(e2, c2 + 32), o2 = O(e2, c2 + 48));
  }
  for (var l2 = n2 && n2.filter, u2 = 0; u2 < a2; ++u2) {
    var d2 = F(e2, o2, s2), f2 = d2[0], p = d2[1], m = d2[2], h = d2[3], g = d2[4], _ = d2[5], v = P(e2, _);
    o2 = g, (!l2 || l2({ name: h, size: p, originalSize: m, compression: f2 })) && (f2 ? f2 == 8 ? r2[h] = A(e2.subarray(v, v + p), { out: new t(m) }) : w(14, `unknown compression type ` + f2) : r2[h] = S(e2, v, v + p));
  }
  return r2;
}
var R = /* @__PURE__ */ new Set([`__macosx`, `thumbs.db`, `ehthumbs.db`, `ehthumbs_vista.db`, `desktop.ini`, `$recycle.bin`, `system volume information`, `icon\r`]);
function z(e2) {
  return e2.replace(/\\/g, `/`).split(`/`).some((e3) => e3.startsWith(`.`) && e3 !== `.` && e3 !== `..` || R.has(e3.toLowerCase()));
}
function B(e2, t2 = {}) {
  let n2 = String(e2 || ``).trim().replace(/\\/g, `/`);
  if (!n2) throw Error(`${t2.label || `path`} is required`);
  if (n2.startsWith(`/`) || /^[a-zA-Z]:/.test(n2) || n2.includes(`\0`)) throw Error(`${t2.label || `path`} must be relative to the pack root`);
  let r2 = n2.split(`/`).filter((e3) => e3 && e3 !== `.`);
  if (r2.some((e3) => e3 === `..`)) throw Error(`${t2.label || `path`} cannot contain parent-directory segments`);
  let i2 = r2.join(`/`);
  if (!i2) throw Error(`${t2.label || `path`} is required`);
  return i2;
}
var V = (e2) => B(e2, { label: `snapshot path` });
function re(e2) {
  let t2 = new DataView(e2.buffer, e2.byteOffset, e2.byteLength), n2 = e2.length - 22;
  for (; n2 >= Math.max(0, e2.length - 65557) && !(t2.getUint32(n2, true) === 101010256 && n2 + 22 + t2.getUint16(n2 + 20, true) === e2.length); n2--) ;
  if (n2 < Math.max(0, e2.length - 65557)) throw Error(`Invalid ZIP directory`);
  let r2 = t2.getUint16(n2 + 10, true), i2 = t2.getUint32(n2 + 16, true);
  if (r2 === 65535 || i2 === 4294967295 || n2 >= 20 && t2.getUint32(n2 - 20, true) === 117853008) throw Error(`ZIP64 package snapshots are not supported`);
  if (t2.getUint16(n2 + 4, true) || t2.getUint16(n2 + 6, true) || t2.getUint16(n2 + 8, true) !== r2) throw Error(`Multi-disk ZIP packages are not supported`);
  let a2 = [];
  for (let e3 = 0; e3 < r2; e3++) {
    if (i2 + 46 > n2 || t2.getUint32(i2, true) !== 33639248) throw Error(`Invalid ZIP entry`);
    let e4 = t2.getUint32(i2 + 38, true) >>> 16 & 61440;
    if (e4 && e4 !== 32768 && e4 !== 16384) throw Error(`ZIP contains a symlink or non-regular entry`);
    a2.push(e4 === 16384 || !!(t2.getUint32(i2 + 38, true) & 16)), i2 += 46 + t2.getUint16(i2 + 28, true) + t2.getUint16(i2 + 30, true) + t2.getUint16(i2 + 32, true);
  }
  if (i2 !== n2) throw Error(`Invalid ZIP central directory size`);
  return a2;
}
function H(e2) {
  let t2 = e2.slice(), n2 = re(t2), r2 = /* @__PURE__ */ new Set(), i2 = 0, a2 = L(t2, { filter(e3) {
    let t3 = n2[i2++] || /[\\/]$/.test(e3.name), a3 = V(e3.name);
    if (z(e3.name) || z(a3)) return false;
    if (r2.has(a3)) throw Error(`Duplicate ZIP path: ${a3}`);
    return r2.add(a3), !t3;
  } }), o2 = Object.entries(a2), s2 = o2.map(([e3]) => V(e3)), c2 = s2[0]?.split(`/`)[0], l2 = s2.length > 0 && s2.every((e3) => e3.includes(`/`) && e3.split(`/`)[0] === c2);
  return o2.map(([, e3], t3) => [l2 ? s2[t3].slice(c2.length + 1) : s2[t3], e3]);
}
var U = new TextEncoder(), W = new TextDecoder(`utf-8`, { fatal: true }), G = (e2) => B(e2, { label: `snapshot path` }), K = (e2, t2) => e2.length === t2.length && e2.every((e3, n2) => e3 === t2[n2]);
async function q(e2) {
  let t2 = /* @__PURE__ */ new Map();
  for (let [n3, r3] of e2) {
    let e3 = G(n3);
    if (t2.has(e3)) throw Error(`Duplicate package path: ${e3}`);
    if (!(r3 instanceof Uint8Array)) throw Error(`Expected file bytes: ${e3}`);
    t2.set(e3, r3.slice());
  }
  let n2 = [...t2.keys()].sort();
  for (let e3 of n2) {
    let n3 = e3.split(`/`);
    for (let r3 = 1; r3 < n3.length; r3++) if (t2.has(n3.slice(0, r3).join(`/`))) throw Error(`File/directory collision: ${e3}`);
  }
  let r2 = U.encode(`gp-next-pack-snapshot-v1\0`), i2 = n2.map((e3) => U.encode(e3)), a2 = r2.length + n2.reduce((e3, n3, r3) => e3 + 12 + i2[r3].length + t2.get(n3).length, 0), o2 = new Uint8Array(a2), s2 = new DataView(o2.buffer);
  o2.set(r2);
  let c2 = r2.length;
  for (let e3 = 0; e3 < n2.length; e3++) {
    let r3 = i2[e3], a3 = t2.get(n2[e3]);
    s2.setUint32(c2, r3.length), c2 += 4, s2.setBigUint64(c2, BigInt(a3.length)), c2 += 8, o2.set(r3, c2), c2 += r3.length, o2.set(a3, c2), c2 += a3.length;
  }
  let l2 = new Uint8Array(await globalThis.crypto.subtle.digest(`SHA-256`, o2)), u2 = Array.from(l2, (e3) => e3.toString(16).padStart(2, `0`)).join(``);
  return Object.freeze({ digest: u2, listPaths: () => [...n2], readBytes(e3) {
    return t2.get(G(e3))?.slice() ?? null;
  }, readText(e3) {
    let n3 = t2.get(G(e3));
    if (!n3) return null;
    try {
      return W.decode(n3);
    } catch {
      throw Object.assign(Error(`Package file is not valid UTF-8: ${e3}`), { code: `FILES_INVALID_UTF8` });
    }
  } });
}
async function J(t2) {
  if (typeof Worker != `function` || t2.byteLength < 512 * 1024) return q(H(t2));
  let { default: n2 } = await e(async () => {
    let { default: e2 } = await import("../core/NestPackWorker.js");
    return { default: e2 };
  }, []);
  return q(await new Promise((e2, r2) => {
    let i2 = new n2();
    i2.onmessage = ({ data: t3 }) => {
      i2.terminate(), t3.error ? r2(Error(t3.error)) : e2(t3.entries);
    }, i2.onerror = (e3) => {
      i2.terminate(), r2(Error(e3.message || `Package ZIP worker failed`));
    };
    let a2 = t2.slice();
    i2.postMessage(a2.buffer, [a2.buffer]);
  }));
}
async function Y(e2, t2) {
  let n2 = e2.split(`/`), r2;
  for (let e3 = 1; e3 <= n2.length; e3++) {
    if (r2 = await t2.lstat(n2.slice(0, e3).join(`/`)), r2.isSymlink) throw Error(`Package path is a symlink: ${n2.slice(0, e3).join(`/`)}`);
    if (e3 < n2.length && !r2.isDirectory) throw Error(`Package ancestor is not a directory`);
  }
  return r2;
}
async function X(e2, t2) {
  if (!(await Y(e2, t2)).isDirectory) throw Error(`Package root is not a directory`);
  let n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Set();
  async function i2(e3, a2) {
    for (let o2 of await t2.readDir(a2)) {
      if (!o2.name || /[\\/]/.test(o2.name) || o2.name === `.` || o2.name === `..`) throw Error(`Invalid directory entry name`);
      if (z(o2.name)) continue;
      let s2 = G(e3 ? `${e3}/${o2.name}` : o2.name);
      if (r2.has(s2)) throw Error(`Duplicate directory path: ${s2}`);
      r2.add(s2);
      let c2 = `${a2}/${o2.name}`, l2 = await t2.lstat(c2);
      if (l2.isSymlink) throw Error(`Package path is a symlink: ${s2}`);
      if (l2.isDirectory) await i2(s2, c2);
      else if (l2.isFile) n2.set(s2, (await t2.readFile(c2)).slice());
      else throw Error(`Non-regular package entry: ${s2}`);
    }
  }
  return await i2(``, e2), n2;
}
async function Z(e2, t2) {
  let n2 = G(e2), r2 = await Y(n2, t2);
  if (r2.isDirectory) {
    let e3 = await X(n2, t2), r3 = await X(n2, t2);
    if (e3.size !== r3.size || [...e3].some(([e4, t3]) => !r3.has(e4) || !K(t3, r3.get(e4)))) throw Error(`Package changed during snapshot capture`);
    return q(e3);
  }
  if (!r2.isFile || !/\.zip$/i.test(n2)) throw Error(`Expected a package directory or ZIP file`);
  let i2 = (await t2.readFile(n2)).slice();
  if (!(await Y(n2, t2)).isFile || !K(i2, await t2.readFile(n2))) throw Error(`Package changed during snapshot capture`);
  return J(i2);
}
export {
  B as a,
  z as i,
  q as n,
  L as o,
  J as r,
  Z as t
};
