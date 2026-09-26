var e = Uint8Array, t = Uint16Array, n = Int32Array, r = new e([0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 0, 0, 0]), i = new e([0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 0, 0]), a = new e([16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15]), o = function(e2, r2) {
  for (var i2 = new t(31), a2 = 0; a2 < 31; ++a2) i2[a2] = r2 += 1 << e2[a2 - 1];
  for (var o2 = new n(i2[30]), a2 = 1; a2 < 30; ++a2) for (var s2 = i2[a2]; s2 < i2[a2 + 1]; ++s2) o2[s2] = s2 - i2[a2] << 5 | a2;
  return { b: i2, r: o2 };
}, s = o(r, 2), c = s.b, l = s.r;
c[28] = 258, l[258] = 28;
var u = o(i, 0), d = u.b;
u.r;
for (var f = new t(32768), p = 0; p < 32768; ++p) {
  var m = (p & 43690) >> 1 | (p & 21845) << 1;
  m = (m & 52428) >> 2 | (m & 13107) << 2, m = (m & 61680) >> 4 | (m & 3855) << 4, f[p] = ((m & 65280) >> 8 | (m & 255) << 8) >> 1;
}
for (var h = (function(e2, n2, r2) {
  for (var i2 = e2.length, a2 = 0, o2 = new t(n2); a2 < i2; ++a2) e2[a2] && ++o2[e2[a2] - 1];
  var s2 = new t(n2);
  for (a2 = 1; a2 < n2; ++a2) s2[a2] = s2[a2 - 1] + o2[a2 - 1] << 1;
  var c2;
  if (r2) {
    c2 = new t(1 << n2);
    var l2 = 15 - n2;
    for (a2 = 0; a2 < i2; ++a2) if (e2[a2]) for (var u2 = a2 << 4 | e2[a2], d2 = n2 - e2[a2], p = s2[e2[a2] - 1]++ << d2, m = p | (1 << d2) - 1; p <= m; ++p) c2[f[p] >> l2] = u2;
  } else for (c2 = new t(i2), a2 = 0; a2 < i2; ++a2) e2[a2] && (c2[a2] = f[s2[e2[a2] - 1]++] >> 15 - e2[a2]);
  return c2;
}), g = new e(288), p = 0; p < 144; ++p) g[p] = 8;
for (var p = 144; p < 256; ++p) g[p] = 9;
for (var p = 256; p < 280; ++p) g[p] = 7;
for (var p = 280; p < 288; ++p) g[p] = 8;
for (var _ = new e(32), p = 0; p < 32; ++p) _[p] = 5;
var v = h(g, 9, 1), ee = h(_, 5, 1), y = function(e2) {
  for (var t2 = e2[0], n2 = 1; n2 < e2.length; ++n2) e2[n2] > t2 && (t2 = e2[n2]);
  return t2;
}, b = function(e2, t2, n2) {
  var r2 = t2 / 8 | 0;
  return (e2[r2] | e2[r2 + 1] << 8) >> (t2 & 7) & n2;
}, x = function(e2, t2) {
  var n2 = t2 / 8 | 0;
  return (e2[n2] | e2[n2 + 1] << 8 | e2[n2 + 2] << 16) >> (t2 & 7);
}, te = function(e2) {
  return (e2 + 7) / 8 | 0;
}, S = function(t2, n2, r2) {
  return (n2 == null || n2 < 0) && (n2 = 0), (r2 == null || r2 > t2.length) && (r2 = t2.length), new e(t2.subarray(n2, r2));
}, C = [`unexpected EOF`, `invalid block type`, `invalid length/literal`, `invalid distance`, `stream finished`, `no stream handler`, , `no callback`, `invalid UTF-8 data`, `extra field too long`, `date not in range 1980-2099`, `filename too long`, `stream finishing`, `invalid zip data`], w = function(e2, t2, n2) {
  var r2 = Error(t2 || C[e2]);
  if (r2.code = e2, Error.captureStackTrace && Error.captureStackTrace(r2, w), !n2) throw r2;
  return r2;
}, T = function(t2, n2, o2, s2) {
  var l2 = t2.length, u2 = s2 ? s2.length : 0;
  if (!l2 || n2.f && !n2.l) return o2 || new e(0);
  var f = !o2, p = f || n2.i != 2, m = n2.i;
  f && (o2 = new e(l2 * 3));
  var g = function(t3) {
    var n3 = o2.length;
    if (t3 > n3) {
      var r2 = new e(Math.max(n3 * 2, t3));
      r2.set(o2), o2 = r2;
    }
  }, _ = n2.f || 0, C2 = n2.p || 0, T2 = n2.b || 0, E2 = n2.l, D2 = n2.d, O2 = n2.m, k2 = n2.n, A2 = l2 * 8;
  do {
    if (!E2) {
      _ = b(t2, C2, 1);
      var j2 = b(t2, C2 + 1, 3);
      if (C2 += 3, !j2) {
        var M2 = te(C2) + 4, N2 = t2[M2 - 4] | t2[M2 - 3] << 8, P2 = M2 + N2;
        if (P2 > l2) {
          m && w(0);
          break;
        }
        p && g(T2 + N2), o2.set(t2.subarray(M2, P2), T2), n2.b = T2 += N2, n2.p = C2 = P2 * 8, n2.f = _;
        continue;
      } else if (j2 == 1) E2 = v, D2 = ee, O2 = 9, k2 = 5;
      else if (j2 == 2) {
        var F2 = b(t2, C2, 31) + 257, I2 = b(t2, C2 + 10, 15) + 4, L2 = F2 + b(t2, C2 + 5, 31) + 1;
        C2 += 14;
        for (var R2 = new e(L2), z2 = new e(19), B2 = 0; B2 < I2; ++B2) z2[a[B2]] = b(t2, C2 + B2 * 3, 7);
        C2 += I2 * 3;
        for (var V2 = y(z2), H2 = (1 << V2) - 1, U2 = h(z2, V2, 1), B2 = 0; B2 < L2; ) {
          var W2 = U2[b(t2, C2, H2)];
          C2 += W2 & 15;
          var M2 = W2 >> 4;
          if (M2 < 16) R2[B2++] = M2;
          else {
            var G2 = 0, K2 = 0;
            for (M2 == 16 ? (K2 = 3 + b(t2, C2, 3), C2 += 2, G2 = R2[B2 - 1]) : M2 == 17 ? (K2 = 3 + b(t2, C2, 7), C2 += 3) : M2 == 18 && (K2 = 11 + b(t2, C2, 127), C2 += 7); K2--; ) R2[B2++] = G2;
          }
        }
        var q2 = R2.subarray(0, F2), J2 = R2.subarray(F2);
        O2 = y(q2), k2 = y(J2), E2 = h(q2, O2, 1), D2 = h(J2, k2, 1);
      } else w(1);
      if (C2 > A2) {
        m && w(0);
        break;
      }
    }
    p && g(T2 + 131072);
    for (var ne = (1 << O2) - 1, re = (1 << k2) - 1, Y = C2; ; Y = C2) {
      var G2 = E2[x(t2, C2) & ne], X = G2 >> 4;
      if (C2 += G2 & 15, C2 > A2) {
        m && w(0);
        break;
      }
      if (G2 || w(2), X < 256) o2[T2++] = X;
      else if (X == 256) {
        Y = C2, E2 = null;
        break;
      } else {
        var ie = X - 254;
        if (X > 264) {
          var B2 = X - 257, Z = r[B2];
          ie = b(t2, C2, (1 << Z) - 1) + c[B2], C2 += Z;
        }
        var Q = D2[x(t2, C2) & re], $ = Q >> 4;
        Q || w(3), C2 += Q & 15;
        var J2 = d[$];
        if ($ > 3) {
          var Z = i[$];
          J2 += x(t2, C2) & (1 << Z) - 1, C2 += Z;
        }
        if (C2 > A2) {
          m && w(0);
          break;
        }
        p && g(T2 + 131072);
        var ae = T2 + ie;
        if (T2 < J2) {
          var oe = u2 - J2, se = Math.min(J2, ae);
          for (oe + T2 < 0 && w(3); T2 < se; ++T2) o2[T2] = s2[oe + T2];
        }
        for (; T2 < ae; ++T2) o2[T2] = o2[T2 - J2];
      }
    }
    n2.l = E2, n2.p = Y, n2.b = T2, n2.f = _, E2 && (_ = 1, n2.m = O2, n2.d = D2, n2.n = k2);
  } while (!_);
  return T2 != o2.length && f ? S(o2, 0, T2) : o2.subarray(0, T2);
}, E = new e(0), D = function(e2, t2) {
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
function L(t2, n2) {
  for (var r2 = {}, i2 = t2.length - 22; O(t2, i2) != 101010256; --i2) (!i2 || t2.length - i2 > 65558) && w(13);
  var a2 = D(t2, i2 + 8);
  if (!a2) return {};
  var o2 = O(t2, i2 + 16), s2 = O(t2, i2 - 20) == 117853008;
  if (s2) {
    var c2 = O(t2, i2 - 12);
    s2 = O(t2, c2) == 101075792, s2 && (a2 = O(t2, c2 + 32), o2 = O(t2, c2 + 48));
  }
  for (var l2 = n2 && n2.filter, u2 = 0; u2 < a2; ++u2) {
    var d2 = F(t2, o2, s2), f = d2[0], p = d2[1], m = d2[2], h = d2[3], g = d2[4], _ = d2[5], v2 = P(t2, _);
    o2 = g, (!l2 || l2({ name: h, size: p, originalSize: m, compression: f })) && (f ? f == 8 ? r2[h] = A(t2.subarray(v2, v2 + p), { out: new e(m) }) : w(14, `unknown compression type ` + f) : r2[h] = S(t2, v2, v2 + p));
  }
  return r2;
}
function R(e2, t2 = {}) {
  let n2 = String(e2 || ``).trim().replace(/\\/g, `/`);
  if (!n2) throw Error(`${t2.label || `path`} is required`);
  if (n2.startsWith(`/`) || /^[a-zA-Z]:/.test(n2) || n2.includes(`\0`)) throw Error(`${t2.label || `path`} must be relative to the pack root`);
  let r2 = n2.split(`/`).filter((e3) => e3 && e3 !== `.`);
  if (r2.some((e3) => e3 === `..`)) throw Error(`${t2.label || `path`} cannot contain parent-directory segments`);
  let i2 = r2.join(`/`);
  if (!i2) throw Error(`${t2.label || `path`} is required`);
  return i2;
}
var z = new TextEncoder(), B = new TextDecoder(`utf-8`, { fatal: true }), V = (e2) => R(e2, { label: `snapshot path` }), H = (e2, t2) => e2.length === t2.length && e2.every((e3, n2) => e3 === t2[n2]);
async function U(e2) {
  let t2 = /* @__PURE__ */ new Map();
  for (let [n3, r3] of e2) {
    let e3 = V(n3);
    if (t2.has(e3)) throw Error(`Duplicate package path: ${e3}`);
    if (!(r3 instanceof Uint8Array)) throw Error(`Expected file bytes: ${e3}`);
    t2.set(e3, r3.slice());
  }
  let n2 = [...t2.keys()].sort();
  for (let e3 of n2) {
    let n3 = e3.split(`/`);
    for (let r3 = 1; r3 < n3.length; r3++) if (t2.has(n3.slice(0, r3).join(`/`))) throw Error(`File/directory collision: ${e3}`);
  }
  let r2 = z.encode(`gp-next-pack-snapshot-v1\0`), i2 = n2.map((e3) => z.encode(e3)), a2 = r2.length + n2.reduce((e3, n3, r3) => e3 + 12 + i2[r3].length + t2.get(n3).length, 0), o2 = new Uint8Array(a2), s2 = new DataView(o2.buffer);
  o2.set(r2);
  let c2 = r2.length;
  for (let e3 = 0; e3 < n2.length; e3++) {
    let r3 = i2[e3], a3 = t2.get(n2[e3]);
    s2.setUint32(c2, r3.length), c2 += 4, s2.setBigUint64(c2, BigInt(a3.length)), c2 += 8, o2.set(r3, c2), c2 += r3.length, o2.set(a3, c2), c2 += a3.length;
  }
  let l2 = new Uint8Array(await globalThis.crypto.subtle.digest(`SHA-256`, o2)), u2 = Array.from(l2, (e3) => e3.toString(16).padStart(2, `0`)).join(``);
  return Object.freeze({ digest: u2, listPaths: () => [...n2], readBytes(e3) {
    return t2.get(V(e3))?.slice() ?? null;
  }, readText(e3) {
    let n3 = t2.get(V(e3));
    if (!n3) return null;
    try {
      return B.decode(n3);
    } catch {
      throw Object.assign(Error(`Package file is not valid UTF-8: ${e3}`), { code: `FILES_INVALID_UTF8` });
    }
  } });
}
function W(e2) {
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
async function G(e2) {
  let t2 = e2.slice(), n2 = W(t2), r2 = /* @__PURE__ */ new Set(), i2 = 0, a2 = L(t2, { filter(e3) {
    let t3 = n2[i2++] || /[\\/]$/.test(e3.name), a3 = V(e3.name);
    if (r2.has(a3)) throw Error(`Duplicate ZIP path: ${a3}`);
    return r2.add(a3), !t3;
  } }), o2 = Object.entries(a2), s2 = o2.map(([e3]) => V(e3)), c2 = s2[0]?.split(`/`)[0], l2 = s2.length > 0 && s2.every((e3) => e3.includes(`/`) && e3.split(`/`)[0] === c2);
  return U(o2.map(([, e3], t3) => [l2 ? s2[t3].slice(c2.length + 1) : s2[t3], e3]));
}
async function K(e2, t2) {
  let n2 = e2.split(`/`), r2;
  for (let e3 = 1; e3 <= n2.length; e3++) {
    if (r2 = await t2.lstat(n2.slice(0, e3).join(`/`)), r2.isSymlink) throw Error(`Package path is a symlink: ${n2.slice(0, e3).join(`/`)}`);
    if (e3 < n2.length && !r2.isDirectory) throw Error(`Package ancestor is not a directory`);
  }
  return r2;
}
async function q(e2, t2) {
  if (!(await K(e2, t2)).isDirectory) throw Error(`Package root is not a directory`);
  let n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Set();
  async function i2(e3, a2) {
    for (let o2 of await t2.readDir(a2)) {
      if (!o2.name || /[\\/]/.test(o2.name) || o2.name === `.` || o2.name === `..`) throw Error(`Invalid directory entry name`);
      let s2 = V(e3 ? `${e3}/${o2.name}` : o2.name);
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
async function J(e2, t2) {
  let n2 = V(e2), r2 = await K(n2, t2);
  if (r2.isDirectory) {
    let e3 = await q(n2, t2), r3 = await q(n2, t2);
    if (e3.size !== r3.size || [...e3].some(([e4, t3]) => !r3.has(e4) || !H(t3, r3.get(e4)))) throw Error(`Package changed during snapshot capture`);
    return U(e3);
  }
  if (!r2.isFile || !/\.zip$/i.test(n2)) throw Error(`Expected a package directory or ZIP file`);
  let i2 = (await t2.readFile(n2)).slice();
  if (!(await K(n2, t2)).isFile || !H(i2, await t2.readFile(n2))) throw Error(`Package changed during snapshot capture`);
  return G(i2);
}
export {
  L as a,
  R as i,
  U as n,
  G as r,
  J as t
};
