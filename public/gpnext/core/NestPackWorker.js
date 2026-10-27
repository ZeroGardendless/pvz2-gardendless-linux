(function() {
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
      for (a2 = 0; a2 < i2; ++a2) if (e2[a2]) for (var u2 = a2 << 4 | e2[a2], d2 = n2 - e2[a2], p2 = s2[e2[a2] - 1]++ << d2, m2 = p2 | (1 << d2) - 1; p2 <= m2; ++p2) c2[f[p2] >> l2] = u2;
    } else for (c2 = new t(i2), a2 = 0; a2 < i2; ++a2) e2[a2] && (c2[a2] = f[s2[e2[a2] - 1]++] >> 15 - e2[a2]);
    return c2;
  }), g = new e(288), p = 0; p < 144; ++p) g[p] = 8;
  for (var p = 144; p < 256; ++p) g[p] = 9;
  for (var p = 256; p < 280; ++p) g[p] = 7;
  for (var p = 280; p < 288; ++p) g[p] = 8;
  for (var _ = new e(32), p = 0; p < 32; ++p) _[p] = 5;
  var v = h(g, 9, 1), y = h(_, 5, 1), b = function(e2) {
    for (var t2 = e2[0], n2 = 1; n2 < e2.length; ++n2) e2[n2] > t2 && (t2 = e2[n2]);
    return t2;
  }, x = function(e2, t2, n2) {
    var r2 = t2 / 8 | 0;
    return (e2[r2] | e2[r2 + 1] << 8) >> (t2 & 7) & n2;
  }, S = function(e2, t2) {
    var n2 = t2 / 8 | 0;
    return (e2[n2] | e2[n2 + 1] << 8 | e2[n2 + 2] << 16) >> (t2 & 7);
  }, C = function(e2) {
    return (e2 + 7) / 8 | 0;
  }, w = function(t2, n2, r2) {
    return (n2 == null || n2 < 0) && (n2 = 0), (r2 == null || r2 > t2.length) && (r2 = t2.length), new e(t2.subarray(n2, r2));
  }, T = [`unexpected EOF`, `invalid block type`, `invalid length/literal`, `invalid distance`, `stream finished`, `no stream handler`, , `no callback`, `invalid UTF-8 data`, `extra field too long`, `date not in range 1980-2099`, `filename too long`, `stream finishing`, `invalid zip data`], E = function(e2, t2, n2) {
    var r2 = Error(t2 || T[e2]);
    if (r2.code = e2, Error.captureStackTrace && Error.captureStackTrace(r2, E), !n2) throw r2;
    return r2;
  }, D = function(t2, n2, o2, s2) {
    var l2 = t2.length, u2 = s2 ? s2.length : 0;
    if (!l2 || n2.f && !n2.l) return o2 || new e(0);
    var f2 = !o2, p2 = f2 || n2.i != 2, m2 = n2.i;
    f2 && (o2 = new e(l2 * 3));
    var g2 = function(t3) {
      var n3 = o2.length;
      if (t3 > n3) {
        var r2 = new e(Math.max(n3 * 2, t3));
        r2.set(o2), o2 = r2;
      }
    }, _2 = n2.f || 0, T2 = n2.p || 0, D2 = n2.b || 0, O2 = n2.l, k2 = n2.d, A2 = n2.m, j2 = n2.n, M2 = l2 * 8;
    do {
      if (!O2) {
        _2 = x(t2, T2, 1);
        var N2 = x(t2, T2 + 1, 3);
        if (T2 += 3, !N2) {
          var P2 = C(T2) + 4, F2 = t2[P2 - 4] | t2[P2 - 3] << 8, I2 = P2 + F2;
          if (I2 > l2) {
            m2 && E(0);
            break;
          }
          p2 && g2(D2 + F2), o2.set(t2.subarray(P2, I2), D2), n2.b = D2 += F2, n2.p = T2 = I2 * 8, n2.f = _2;
          continue;
        } else if (N2 == 1) O2 = v, k2 = y, A2 = 9, j2 = 5;
        else if (N2 == 2) {
          var L2 = x(t2, T2, 31) + 257, R2 = x(t2, T2 + 10, 15) + 4, z2 = L2 + x(t2, T2 + 5, 31) + 1;
          T2 += 14;
          for (var B2 = new e(z2), V2 = new e(19), H2 = 0; H2 < R2; ++H2) V2[a[H2]] = x(t2, T2 + H2 * 3, 7);
          T2 += R2 * 3;
          for (var U2 = b(V2), W2 = (1 << U2) - 1, ee2 = h(V2, U2, 1), H2 = 0; H2 < z2; ) {
            var G2 = ee2[x(t2, T2, W2)];
            T2 += G2 & 15;
            var P2 = G2 >> 4;
            if (P2 < 16) B2[H2++] = P2;
            else {
              var K = 0, q = 0;
              for (P2 == 16 ? (q = 3 + x(t2, T2, 3), T2 += 2, K = B2[H2 - 1]) : P2 == 17 ? (q = 3 + x(t2, T2, 7), T2 += 3) : P2 == 18 && (q = 11 + x(t2, T2, 127), T2 += 7); q--; ) B2[H2++] = K;
            }
          }
          var te = B2.subarray(0, L2), J = B2.subarray(L2);
          A2 = b(te), j2 = b(J), O2 = h(te, A2, 1), k2 = h(J, j2, 1);
        } else E(1);
        if (T2 > M2) {
          m2 && E(0);
          break;
        }
      }
      p2 && g2(D2 + 131072);
      for (var ne = (1 << A2) - 1, re = (1 << j2) - 1, Y = T2; ; Y = T2) {
        var K = O2[S(t2, T2) & ne], X = K >> 4;
        if (T2 += K & 15, T2 > M2) {
          m2 && E(0);
          break;
        }
        if (K || E(2), X < 256) o2[D2++] = X;
        else if (X == 256) {
          Y = T2, O2 = null;
          break;
        } else {
          var ie = X - 254;
          if (X > 264) {
            var H2 = X - 257, Z = r[H2];
            ie = x(t2, T2, (1 << Z) - 1) + c[H2], T2 += Z;
          }
          var Q = k2[S(t2, T2) & re], $ = Q >> 4;
          Q || E(3), T2 += Q & 15;
          var J = d[$];
          if ($ > 3) {
            var Z = i[$];
            J += S(t2, T2) & (1 << Z) - 1, T2 += Z;
          }
          if (T2 > M2) {
            m2 && E(0);
            break;
          }
          p2 && g2(D2 + 131072);
          var ae = D2 + ie;
          if (D2 < J) {
            var oe = u2 - J, se = Math.min(J, ae);
            for (oe + D2 < 0 && E(3); D2 < se; ++D2) o2[D2] = s2[oe + D2];
          }
          for (; D2 < ae; ++D2) o2[D2] = o2[D2 - J];
        }
      }
      n2.l = O2, n2.p = Y, n2.b = D2, n2.f = _2, O2 && (_2 = 1, n2.m = A2, n2.d = k2, n2.n = j2);
    } while (!_2);
    return D2 != o2.length && f2 ? w(o2, 0, D2) : o2.subarray(0, D2);
  }, O = new e(0), k = function(e2, t2) {
    return e2[t2] | e2[t2 + 1] << 8;
  }, A = function(e2, t2) {
    return (e2[t2] | e2[t2 + 1] << 8 | e2[t2 + 2] << 16 | e2[t2 + 3] << 24) >>> 0;
  }, j = function(e2, t2) {
    return A(e2, t2) + A(e2, t2 + 4) * 4294967296;
  };
  function M(e2, t2) {
    return D(e2, { i: 2 }, t2 && t2.out, t2 && t2.dictionary);
  }
  var N = typeof TextDecoder < `u` && new TextDecoder();
  try {
    N.decode(O, { stream: true });
  } catch {
  }
  var P = function(e2) {
    for (var t2 = ``, n2 = 0; ; ) {
      var r2 = e2[n2++], i2 = (r2 > 127) + (r2 > 223) + (r2 > 239);
      if (n2 + i2 > e2.length) return { s: t2, r: w(e2, n2 - 1) };
      i2 ? i2 == 3 ? (r2 = ((r2 & 15) << 18 | (e2[n2++] & 63) << 12 | (e2[n2++] & 63) << 6 | e2[n2++] & 63) - 65536, t2 += String.fromCharCode(55296 | r2 >> 10, 56320 | r2 & 1023)) : i2 & 1 ? t2 += String.fromCharCode((r2 & 31) << 6 | e2[n2++] & 63) : t2 += String.fromCharCode((r2 & 15) << 12 | (e2[n2++] & 63) << 6 | e2[n2++] & 63) : t2 += String.fromCharCode(r2);
    }
  };
  function F(e2, t2) {
    if (t2) {
      for (var n2 = ``, r2 = 0; r2 < e2.length; r2 += 16384) n2 += String.fromCharCode.apply(null, e2.subarray(r2, r2 + 16384));
      return n2;
    } else if (N) return N.decode(e2);
    else {
      var i2 = P(e2), a2 = i2.s, n2 = i2.r;
      return n2.length && E(8), a2;
    }
  }
  var I = function(e2, t2) {
    return t2 + 30 + k(e2, t2 + 26) + k(e2, t2 + 28);
  }, L = function(e2, t2, n2) {
    var r2 = k(e2, t2 + 28), i2 = k(e2, t2 + 30), a2 = F(e2.subarray(t2 + 46, t2 + 46 + r2), !(k(e2, t2 + 8) & 2048)), o2 = t2 + 46 + r2, s2 = R(e2, o2, i2, n2, A(e2, t2 + 20), A(e2, t2 + 24), A(e2, t2 + 42)), c2 = s2[0], l2 = s2[1], u2 = s2[2];
    return [k(e2, t2 + 10), c2, l2, a2, o2 + i2 + k(e2, t2 + 32), u2];
  }, R = function(e2, t2, n2, r2, i2, a2, o2) {
    var s2 = i2 == 4294967295, c2 = a2 == 4294967295, l2 = o2 == 4294967295, u2 = t2 + n2, d2 = s2 + c2 + l2;
    if (r2 && d2) {
      for (; t2 + 4 < u2; t2 += 4 + k(e2, t2 + 2)) if (k(e2, t2) == 1) return [s2 ? j(e2, t2 + 4 + 8 * c2) : i2, c2 ? j(e2, t2 + 4) : a2, l2 ? j(e2, t2 + 4 + 8 * (c2 + s2)) : o2, 1];
      r2 < 2 && E(13);
    }
    return [i2, a2, o2, 0];
  };
  function z(t2, n2) {
    for (var r2 = {}, i2 = t2.length - 22; A(t2, i2) != 101010256; --i2) (!i2 || t2.length - i2 > 65558) && E(13);
    var a2 = k(t2, i2 + 8);
    if (!a2) return {};
    var o2 = A(t2, i2 + 16), s2 = A(t2, i2 - 20) == 117853008;
    if (s2) {
      var c2 = A(t2, i2 - 12);
      s2 = A(t2, c2) == 101075792, s2 && (a2 = A(t2, c2 + 32), o2 = A(t2, c2 + 48));
    }
    for (var l2 = n2 && n2.filter, u2 = 0; u2 < a2; ++u2) {
      var d2 = L(t2, o2, s2), f2 = d2[0], p2 = d2[1], m2 = d2[2], h2 = d2[3], g2 = d2[4], _2 = d2[5], v2 = I(t2, _2);
      o2 = g2, (!l2 || l2({ name: h2, size: p2, originalSize: m2, compression: f2 })) && (f2 ? f2 == 8 ? r2[h2] = M(t2.subarray(v2, v2 + p2), { out: new e(m2) }) : E(14, `unknown compression type ` + f2) : r2[h2] = w(t2, v2, v2 + p2));
    }
    return r2;
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
  let V = (e2) => e2.split(`/`).some((e3) => e3.toLowerCase() === `__macosx`) || /^(?:\.ds_store|thumbs\.db|desktop\.ini|\._.*)$/i.test(e2.split(`/`).at(-1)), H = new TextDecoder(`utf-8`, { fatal: true, ignoreBOM: true }), U = (e2) => {
    throw Error(`NEST_ZIP_` + e2);
  }, W = Uint32Array.from({ length: 256 }, (e2, t2) => {
    for (let e3 = 0; e3 < 8; e3++) t2 = t2 & 1 ? 3988292384 ^ t2 >>> 1 : t2 >>> 1;
    return t2 >>> 0;
  }), ee = (e2) => {
    let t2 = 4294967295;
    for (let n2 of e2) t2 = W[(t2 ^ n2) & 255] ^ t2 >>> 8;
    return (t2 ^ 4294967295) >>> 0;
  };
  function G(e2) {
    (!(e2 instanceof Uint8Array) || e2.length > 5e7) && U(`SIZE`);
    let t2 = new DataView(e2.buffer, e2.byteOffset, e2.byteLength), n2 = (t3, n3, r3 = e2.length) => {
      (t3 < 0 || n3 < 0 || t3 + n3 > r3) && U(`TRUNCATED`);
    }, r2 = (e3) => (n2(e3, 2), t2.getUint16(e3, true)), i2 = (e3) => (n2(e3, 4), t2.getUint32(e3, true)), a2 = e2.length - 22;
    for (; a2 >= Math.max(0, e2.length - 65557) && !(i2(a2) === 101010256 && a2 + 22 + r2(a2 + 20) === e2.length); a2--) ;
    a2 < Math.max(0, e2.length - 65557) && U(`DIRECTORY`);
    let o2 = r2(a2 + 10), s2 = i2(a2 + 16);
    (o2 === 65535 || s2 === 4294967295 || a2 >= 20 && i2(a2 - 20) === 117853008) && U(`ZIP64`), (r2(a2 + 4) || r2(a2 + 6) || r2(a2 + 8) !== o2) && U(`MULTIDISK`), (!o2 || o2 > 2e3 || s2 + i2(a2 + 12) !== a2) && U(`DIRECTORY`);
    let c2 = (e3, t3) => {
      let i3 = e3 + t3, a3 = /* @__PURE__ */ new Set();
      for (n2(e3, t3); e3 < i3; ) {
        n2(e3, 4, i3);
        let t4 = r2(e3), o3 = r2(e3 + 2);
        (a3.has(t4) || ![21589, 30837].includes(t4)) && U(`EXTRA`), a3.add(t4), e3 += 4, n2(e3, o3, i3), e3 += o3;
      }
    }, l2 = s2, u2 = 0, d2 = [], f2 = /* @__PURE__ */ new Set(), p2 = /* @__PURE__ */ new Set();
    for (let t3 = 0; t3 < o2; t3++) {
      n2(l2, 46, a2), i2(l2) !== 33639248 && U(`HEADER`);
      let t4 = r2(l2 + 6), o3 = r2(l2 + 8), m3 = r2(l2 + 10);
      (t4 > 20 || o3 & -2063 || ![0, 8].includes(m3) || m3 === 0 && o3 & 6) && U(`FORMAT`);
      let h3 = i2(l2 + 16), g3 = i2(l2 + 20), _3 = i2(l2 + 24), v3 = r2(l2 + 28), y3 = r2(l2 + 30), b2 = r2(l2 + 32), x2 = i2(l2 + 42);
      (_3 > 5e7 || (u2 += _3) > 1e8) && U(`EXPANDED_SIZE`), (r2(l2 + 34) || [g3, _3, x2].includes(4294967295)) && U(`FORMAT`), n2(l2 + 46, v3 + y3 + b2, a2), (!v3 || v3 > 1024) && U(`PATH`);
      let S2 = e2.subarray(l2 + 46, l2 + 46 + v3);
      !(o3 & 2048) && S2.some((e3) => e3 > 127) && U(`ENCODING`);
      let C2 = H.decode(S2), w2 = B(C2), T2 = w2.split(`/`);
      (C2.includes(`\\`) || C2 !== w2 + (C2.endsWith(`/`) ? `/` : ``) || T2.length > 32 || T2.some((e3) => /[<>:"|?*\u0000-\u001f]/.test(e3) || /[. ]$/.test(e3) || /^(?:con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(e3))) && U(`PATH`), (f2.has(C2) || p2.has(w2.toLowerCase())) && U(`DUPLICATE_PATH`), f2.add(C2), p2.add(w2.toLowerCase());
      let E2 = i2(l2 + 38), D2 = E2 >>> 16 & 61440;
      (D2 && D2 !== 32768 && D2 !== 16384 || E2 & 8) && U(`ENTRY_KIND`);
      let O2 = C2.endsWith(`/`);
      ((D2 === 16384 || E2 & 16) && !O2 || D2 === 32768 && O2 || O2 && (_3 || h3)) && U(`ENTRY_KIND`), c2(l2 + 46 + v3, y3), n2(x2, 30, s2), (i2(x2) !== 67324752 || r2(x2 + 4) !== t4 || r2(x2 + 6) !== o3 || r2(x2 + 8) !== m3 || i2(x2 + 10) !== i2(l2 + 12)) && U(`LOCAL_HEADER`);
      let k2 = r2(x2 + 26), A2 = r2(x2 + 28);
      n2(x2 + 30, k2 + A2, s2), (k2 !== v3 || !S2.every((t5, n3) => t5 === e2[x2 + 30 + n3])) && U(`LOCAL_NAME`), c2(x2 + 30 + k2, A2), [i2(x2 + 14), i2(x2 + 18), i2(x2 + 22)].some((e3, t5) => e3 !== [h3, g3, _3][t5] && (!(o3 & 8) || e3 !== 0)) && U(`LOCAL_SIZE`);
      let j2 = x2 + 30 + k2 + A2 + g3;
      n2(x2, j2 - x2, s2), o3 & 8 && (i2(j2) === 134695760 && (j2 += 4), n2(j2, 12, s2), (i2(j2) !== h3 || i2(j2 + 4) !== g3 || i2(j2 + 8) !== _3) && U(`DESCRIPTOR`), j2 += 12), d2.push({ name: C2, path: w2, size: _3, crc: h3, dir: O2, local: x2, end: j2 }), l2 += 46 + v3 + y3 + b2;
    }
    l2 !== a2 && U(`DIRECTORY`);
    let m2 = 0;
    for (let e3 of [...d2].sort((e4, t3) => e4.local - t3.local)) e3.local !== m2 && U(`HIDDEN_RECORD`), m2 = e3.end;
    m2 !== s2 && U(`HIDDEN_RECORD`);
    let h2 = z(e2, { filter: (e3) => !e3.name.endsWith(`/`) && !V(e3.name) }), g2 = [];
    for (let e3 of d2) {
      if (e3.dir || V(e3.name)) continue;
      let t3 = h2[e3.name];
      (!t3 || t3.length !== e3.size || ee(t3) !== e3.crc) && U(`CONTENT`), g2.push([e3.path, t3]);
    }
    let _2 = g2[0]?.[0].split(`/`)[0], v2 = g2.length && g2.every(([e3]) => e3.includes(`/`) && e3.split(`/`)[0] === _2), y2 = g2.map(([e3, t3]) => [v2 ? e3.slice(_2.length + 1) : e3, t3]);
    return y2.some(([e3]) => e3 === `pack.json`) || U(`MANIFEST`), y2;
  }
  self.onmessage = ({ data: e2 }) => {
    try {
      let t2 = G(e2);
      self.postMessage({ entries: t2 }, t2.map(([, e3]) => e3.buffer));
    } catch (e3) {
      self.postMessage({ error: e3.message || `NEST_ZIP` });
    }
  };
})();
