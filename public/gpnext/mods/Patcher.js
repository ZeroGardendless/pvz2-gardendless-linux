import { t as e } from "../vendor/ModuleHelpers.js";
import { d as t } from "../platform/FileSystem.js";
import { a as n, n as r } from "./GameConfiguration.js";
import { t as i } from "../core/Logger.js";
import { r as a } from "./ModOperationPlan.js";
import { isPlantLevelSystemEnabled, getSettings } from "../core/SettingsStore.js";
import { C as c, _ as l, a as u, c as d, d as f, g as p, l as m, m as h, o as g, p as _, r as v, v as y, y as b } from "../ui/Translations.js";
import { n as x } from "../ui/Toast.js";
import { r as S, t as ee } from "./FileLoader.js";
import { n as C, o as te, r as ne } from "./PackPreparation.js";
import { n as re, r as ie, t as ae } from "../data/DataEntityLedger.js";
import { n as oe } from "../platform/Dialog.js";
import { n as se, t as ce } from "./RestoreUtils.js";
import { t as le } from "./Isolation.js";
import { ensurePlantLevelStates, t as de } from "../runtime/PlantLevelState.js";
var fe = e(((e2, t2) => {
  (function() {
    var n2, r2 = `4.18.1`, i2 = 200, a2 = `Unsupported core-js use. Try https://npms.io/search?q=ponyfill.`, o2 = `Expected a function`, s2 = "Invalid `variable` option passed into `_.template`", c2 = "Invalid `imports` option passed into `_.template`", l2 = `__lodash_hash_undefined__`, u2 = 500, d2 = `__lodash_placeholder__`, f2 = 1, p2 = 2, m2 = 4, h2 = 1, g2 = 2, _2 = 1, v2 = 2, y2 = 4, b2 = 8, x2 = 16, S2 = 32, ee2 = 64, C2 = 128, te2 = 256, ne2 = 512, re2 = 30, ie2 = `...`, ae2 = 800, oe2 = 16, se2 = 1, ce2 = 2, le2 = 3, ue2 = 1 / 0, de2 = 9007199254740991, fe2 = 17976931348623157e292, pe2 = NaN, me2 = 4294967295, he2 = me2 - 1, ge2 = me2 >>> 1, _e2 = [[`ary`, C2], [`bind`, _2], [`bindKey`, v2], [`curry`, b2], [`curryRight`, x2], [`flip`, ne2], [`partial`, S2], [`partialRight`, ee2], [`rearg`, te2]], ve2 = `[object Arguments]`, ye2 = `[object Array]`, be2 = `[object AsyncFunction]`, xe2 = `[object Boolean]`, Se2 = `[object Date]`, Ce2 = `[object DOMException]`, we2 = `[object Error]`, Te2 = `[object Function]`, Ee2 = `[object GeneratorFunction]`, De2 = `[object Map]`, Oe2 = `[object Number]`, ke2 = `[object Null]`, Ae2 = `[object Object]`, je2 = `[object Promise]`, Me2 = `[object Proxy]`, Ne2 = `[object RegExp]`, w2 = `[object Set]`, Pe2 = `[object String]`, Fe2 = `[object Symbol]`, Ie2 = `[object Undefined]`, Le2 = `[object WeakMap]`, Re2 = `[object WeakSet]`, ze2 = `[object ArrayBuffer]`, Be2 = `[object DataView]`, Ve2 = `[object Float32Array]`, He2 = `[object Float64Array]`, Ue2 = `[object Int8Array]`, We2 = `[object Int16Array]`, Ge2 = `[object Int32Array]`, Ke2 = `[object Uint8Array]`, qe2 = `[object Uint8ClampedArray]`, Je2 = `[object Uint16Array]`, Ye2 = `[object Uint32Array]`, Xe2 = /\b__p \+= '';/g, Ze2 = /\b(__p \+=) '' \+/g, Qe2 = /(__e\(.*?\)|\b__t\)) \+\n'';/g, $e2 = /&(?:amp|lt|gt|quot|#39);/g, et2 = /[&<>"']/g, tt2 = RegExp($e2.source), nt2 = RegExp(et2.source), rt2 = /<%-([\s\S]+?)%>/g, it2 = /<%([\s\S]+?)%>/g, at2 = /<%=([\s\S]+?)%>/g, ot2 = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, st2 = /^\w*$/, ct2 = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g, lt2 = /[\\^$.*+?()[\]{}|]/g, ut2 = RegExp(lt2.source), dt2 = /^\s+/, T2 = /\s/, ft2 = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, pt2 = /\{\n\/\* \[wrapped with (.+)\] \*/, mt2 = /,? & /, ht2 = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g, gt2 = /[()=,{}\[\]\/\s]/, _t2 = /\\(\\)?/g, vt2 = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g, yt2 = /\w*$/, bt2 = /^[-+]0x[0-9a-f]+$/i, E2 = /^0b[01]+$/i, D2 = /^\[object .+?Constructor\]$/, xt2 = /^0o[0-7]+$/i, St2 = /^(?:0|[1-9]\d*)$/, Ct2 = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g, wt2 = /($^)/, Tt2 = /['\n\r\u2028\u2029\\]/g, Et2 = `\\ud800-\\udfff`, Dt2 = `\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff`, Ot2 = `\\u2700-\\u27bf`, O2 = `a-z\\xdf-\\xf6\\xf8-\\xff`, kt2 = `\\xac\\xb1\\xd7\\xf7`, At2 = `\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf`, k2 = `\\u2000-\\u206f`, jt2 = ` \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000`, Mt2 = `A-Z\\xc0-\\xd6\\xd8-\\xde`, Nt2 = `\\ufe0e\\ufe0f`, Pt2 = kt2 + At2 + k2 + jt2, Ft2 = `['\u2019]`, A2 = `[` + Et2 + `]`, It2 = `[` + Pt2 + `]`, Lt2 = `[` + Dt2 + `]`, Rt2 = `\\d+`, zt2 = `[` + Ot2 + `]`, Bt2 = `[` + O2 + `]`, Vt2 = `[^` + Et2 + Pt2 + Rt2 + Ot2 + O2 + Mt2 + `]`, Ht2 = `\\ud83c[\\udffb-\\udfff]`, Ut2 = `(?:` + Lt2 + `|` + Ht2 + `)`, Wt2 = `[^` + Et2 + `]`, Gt2 = `(?:\\ud83c[\\udde6-\\uddff]){2}`, Kt2 = `[\\ud800-\\udbff][\\udc00-\\udfff]`, qt2 = `[` + Mt2 + `]`, Jt2 = `\\u200d`, Yt2 = `(?:` + Bt2 + `|` + Vt2 + `)`, Xt2 = `(?:` + qt2 + `|` + Vt2 + `)`, Zt2 = `(?:` + Ft2 + `(?:d|ll|m|re|s|t|ve))?`, Qt2 = `(?:` + Ft2 + `(?:D|LL|M|RE|S|T|VE))?`, $t2 = Ut2 + `?`, en2 = `[` + Nt2 + `]?`, tn2 = `(?:` + Jt2 + `(?:` + [Wt2, Gt2, Kt2].join(`|`) + `)` + en2 + $t2 + `)*`, nn2 = `\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])`, rn2 = `\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])`, an2 = en2 + $t2 + tn2, on2 = `(?:` + [zt2, Gt2, Kt2].join(`|`) + `)` + an2, sn2 = `(?:` + [Wt2 + Lt2 + `?`, Lt2, Gt2, Kt2, A2].join(`|`) + `)`, cn2 = RegExp(Ft2, `g`), ln2 = RegExp(Lt2, `g`), un2 = RegExp(Ht2 + `(?=` + Ht2 + `)|` + sn2 + an2, `g`), dn2 = RegExp([qt2 + `?` + Bt2 + `+` + Zt2 + `(?=` + [It2, qt2, `$`].join(`|`) + `)`, Xt2 + `+` + Qt2 + `(?=` + [It2, qt2 + Yt2, `$`].join(`|`) + `)`, qt2 + `?` + Yt2 + `+` + Zt2, qt2 + `+` + Qt2, rn2, nn2, Rt2, on2].join(`|`), `g`), fn2 = RegExp(`[` + Jt2 + Et2 + Dt2 + Nt2 + `]`), j2 = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/, pn2 = `Array.Buffer.DataView.Date.Error.Float32Array.Float64Array.Function.Int8Array.Int16Array.Int32Array.Map.Math.Object.Promise.RegExp.Set.String.Symbol.TypeError.Uint8Array.Uint8ClampedArray.Uint16Array.Uint32Array.WeakMap._.clearTimeout.isFinite.parseInt.setTimeout`.split(`.`), mn2 = -1, M2 = {};
    M2[Ve2] = M2[He2] = M2[Ue2] = M2[We2] = M2[Ge2] = M2[Ke2] = M2[qe2] = M2[Je2] = M2[Ye2] = true, M2[ve2] = M2[ye2] = M2[ze2] = M2[xe2] = M2[Be2] = M2[Se2] = M2[we2] = M2[Te2] = M2[De2] = M2[Oe2] = M2[Ae2] = M2[Ne2] = M2[w2] = M2[Pe2] = M2[Le2] = false;
    var N2 = {};
    N2[ve2] = N2[ye2] = N2[ze2] = N2[Be2] = N2[xe2] = N2[Se2] = N2[Ve2] = N2[He2] = N2[Ue2] = N2[We2] = N2[Ge2] = N2[De2] = N2[Oe2] = N2[Ae2] = N2[Ne2] = N2[w2] = N2[Pe2] = N2[Fe2] = N2[Ke2] = N2[qe2] = N2[Je2] = N2[Ye2] = true, N2[we2] = N2[Te2] = N2[Le2] = false;
    var P2 = { \u00C0: `A`, \u00C1: `A`, \u00C2: `A`, \u00C3: `A`, \u00C4: `A`, \u00C5: `A`, \u00E0: `a`, \u00E1: `a`, \u00E2: `a`, \u00E3: `a`, \u00E4: `a`, \u00E5: `a`, \u00C7: `C`, \u00E7: `c`, \u00D0: `D`, \u00F0: `d`, \u00C8: `E`, \u00C9: `E`, \u00CA: `E`, \u00CB: `E`, \u00E8: `e`, \u00E9: `e`, \u00EA: `e`, \u00EB: `e`, \u00CC: `I`, \u00CD: `I`, \u00CE: `I`, \u00CF: `I`, \u00EC: `i`, \u00ED: `i`, \u00EE: `i`, \u00EF: `i`, \u00D1: `N`, \u00F1: `n`, \u00D2: `O`, \u00D3: `O`, \u00D4: `O`, \u00D5: `O`, \u00D6: `O`, \u00D8: `O`, \u00F2: `o`, \u00F3: `o`, \u00F4: `o`, \u00F5: `o`, \u00F6: `o`, \u00F8: `o`, \u00D9: `U`, \u00DA: `U`, \u00DB: `U`, \u00DC: `U`, \u00F9: `u`, \u00FA: `u`, \u00FB: `u`, \u00FC: `u`, \u00DD: `Y`, \u00FD: `y`, \u00FF: `y`, \u00C6: `Ae`, \u00E6: `ae`, \u00DE: `Th`, \u00FE: `th`, \u00DF: `ss`, \u0100: `A`, \u0102: `A`, \u0104: `A`, \u0101: `a`, \u0103: `a`, \u0105: `a`, \u0106: `C`, \u0108: `C`, \u010A: `C`, \u010C: `C`, \u0107: `c`, \u0109: `c`, \u010B: `c`, \u010D: `c`, \u010E: `D`, \u0110: `D`, \u010F: `d`, \u0111: `d`, \u0112: `E`, \u0114: `E`, \u0116: `E`, \u0118: `E`, \u011A: `E`, \u0113: `e`, \u0115: `e`, \u0117: `e`, \u0119: `e`, \u011B: `e`, \u011C: `G`, \u011E: `G`, \u0120: `G`, \u0122: `G`, \u011D: `g`, \u011F: `g`, \u0121: `g`, \u0123: `g`, \u0124: `H`, \u0126: `H`, \u0125: `h`, \u0127: `h`, \u0128: `I`, \u012A: `I`, \u012C: `I`, \u012E: `I`, \u0130: `I`, \u0129: `i`, \u012B: `i`, \u012D: `i`, \u012F: `i`, \u0131: `i`, \u0134: `J`, \u0135: `j`, \u0136: `K`, \u0137: `k`, \u0138: `k`, \u0139: `L`, \u013B: `L`, \u013D: `L`, \u013F: `L`, \u0141: `L`, \u013A: `l`, \u013C: `l`, \u013E: `l`, \u0140: `l`, \u0142: `l`, \u0143: `N`, \u0145: `N`, \u0147: `N`, \u014A: `N`, \u0144: `n`, \u0146: `n`, \u0148: `n`, \u014B: `n`, \u014C: `O`, \u014E: `O`, \u0150: `O`, \u014D: `o`, \u014F: `o`, \u0151: `o`, \u0154: `R`, \u0156: `R`, \u0158: `R`, \u0155: `r`, \u0157: `r`, \u0159: `r`, \u015A: `S`, \u015C: `S`, \u015E: `S`, \u0160: `S`, \u015B: `s`, \u015D: `s`, \u015F: `s`, \u0161: `s`, \u0162: `T`, \u0164: `T`, \u0166: `T`, \u0163: `t`, \u0165: `t`, \u0167: `t`, \u0168: `U`, \u016A: `U`, \u016C: `U`, \u016E: `U`, \u0170: `U`, \u0172: `U`, \u0169: `u`, \u016B: `u`, \u016D: `u`, \u016F: `u`, \u0171: `u`, \u0173: `u`, \u0174: `W`, \u0175: `w`, \u0176: `Y`, \u0177: `y`, \u0178: `Y`, \u0179: `Z`, \u017B: `Z`, \u017D: `Z`, \u017A: `z`, \u017C: `z`, \u017E: `z`, \u0132: `IJ`, \u0133: `ij`, \u0152: `Oe`, \u0153: `oe`, \u0149: `'n`, \u017F: `s` }, hn2 = { "&": `&amp;`, "<": `&lt;`, ">": `&gt;`, '"': `&quot;`, "'": `&#39;` }, gn2 = { "&amp;": `&`, "&lt;": `<`, "&gt;": `>`, "&quot;": `"`, "&#39;": `'` }, _n2 = { "\\": `\\`, "'": `'`, "\n": `n`, "\r": `r`, "\u2028": `u2028`, "\u2029": `u2029` }, vn2 = parseFloat, F2 = parseInt, yn2 = typeof global == `object` && global && global.Object === Object && global, bn2 = typeof self == `object` && self && self.Object === Object && self, I2 = yn2 || bn2 || Function(`return this`)(), xn2 = typeof e2 == `object` && e2 && !e2.nodeType && e2, Sn2 = xn2 && typeof t2 == `object` && t2 && !t2.nodeType && t2, Cn2 = Sn2 && Sn2.exports === xn2, wn2 = Cn2 && yn2.process, L2 = (function() {
      try {
        return Sn2 && Sn2.require && Sn2.require(`util`).types || wn2 && wn2.binding && wn2.binding(`util`);
      } catch {
      }
    })(), Tn2 = L2 && L2.isArrayBuffer, En2 = L2 && L2.isDate, Dn2 = L2 && L2.isMap, On2 = L2 && L2.isRegExp, kn2 = L2 && L2.isSet, An2 = L2 && L2.isTypedArray;
    function R2(e3, t3, n3) {
      switch (n3.length) {
        case 0:
          return e3.call(t3);
        case 1:
          return e3.call(t3, n3[0]);
        case 2:
          return e3.call(t3, n3[0], n3[1]);
        case 3:
          return e3.call(t3, n3[0], n3[1], n3[2]);
      }
      return e3.apply(t3, n3);
    }
    function jn2(e3, t3, n3, r3) {
      for (var i3 = -1, a3 = e3 == null ? 0 : e3.length; ++i3 < a3; ) {
        var o3 = e3[i3];
        t3(r3, o3, n3(o3), e3);
      }
      return r3;
    }
    function Mn2(e3, t3) {
      for (var n3 = -1, r3 = e3 == null ? 0 : e3.length; ++n3 < r3 && t3(e3[n3], n3, e3) !== false; ) ;
      return e3;
    }
    function Nn2(e3, t3) {
      for (var n3 = e3 == null ? 0 : e3.length; n3-- && t3(e3[n3], n3, e3) !== false; ) ;
      return e3;
    }
    function Pn2(e3, t3) {
      for (var n3 = -1, r3 = e3 == null ? 0 : e3.length; ++n3 < r3; ) if (!t3(e3[n3], n3, e3)) return false;
      return true;
    }
    function Fn2(e3, t3) {
      for (var n3 = -1, r3 = e3 == null ? 0 : e3.length, i3 = 0, a3 = []; ++n3 < r3; ) {
        var o3 = e3[n3];
        t3(o3, n3, e3) && (a3[i3++] = o3);
      }
      return a3;
    }
    function In2(e3, t3) {
      return !!(e3 != null && e3.length) && qn2(e3, t3, 0) > -1;
    }
    function Ln2(e3, t3, n3) {
      for (var r3 = -1, i3 = e3 == null ? 0 : e3.length; ++r3 < i3; ) if (n3(t3, e3[r3])) return true;
      return false;
    }
    function z2(e3, t3) {
      for (var n3 = -1, r3 = e3 == null ? 0 : e3.length, i3 = Array(r3); ++n3 < r3; ) i3[n3] = t3(e3[n3], n3, e3);
      return i3;
    }
    function Rn2(e3, t3) {
      for (var n3 = -1, r3 = t3.length, i3 = e3.length; ++n3 < r3; ) e3[i3 + n3] = t3[n3];
      return e3;
    }
    function zn2(e3, t3, n3, r3) {
      var i3 = -1, a3 = e3 == null ? 0 : e3.length;
      for (r3 && a3 && (n3 = e3[++i3]); ++i3 < a3; ) n3 = t3(n3, e3[i3], i3, e3);
      return n3;
    }
    function Bn2(e3, t3, n3, r3) {
      var i3 = e3 == null ? 0 : e3.length;
      for (r3 && i3 && (n3 = e3[--i3]); i3--; ) n3 = t3(n3, e3[i3], i3, e3);
      return n3;
    }
    function Vn2(e3, t3) {
      for (var n3 = -1, r3 = e3 == null ? 0 : e3.length; ++n3 < r3; ) if (t3(e3[n3], n3, e3)) return true;
      return false;
    }
    var Hn2 = Zn2(`length`);
    function Un2(e3) {
      return e3.split(``);
    }
    function Wn2(e3) {
      return e3.match(ht2) || [];
    }
    function Gn2(e3, t3, n3) {
      var r3;
      return n3(e3, function(e4, n4, i3) {
        if (t3(e4, n4, i3)) return r3 = n4, false;
      }), r3;
    }
    function Kn2(e3, t3, n3, r3) {
      for (var i3 = e3.length, a3 = n3 + (r3 ? 1 : -1); r3 ? a3-- : ++a3 < i3; ) if (t3(e3[a3], a3, e3)) return a3;
      return -1;
    }
    function qn2(e3, t3, n3) {
      return t3 === t3 ? Sr(e3, t3, n3) : Kn2(e3, Yn2, n3);
    }
    function Jn2(e3, t3, n3, r3) {
      for (var i3 = n3 - 1, a3 = e3.length; ++i3 < a3; ) if (r3(e3[i3], t3)) return i3;
      return -1;
    }
    function Yn2(e3) {
      return e3 !== e3;
    }
    function Xn2(e3, t3) {
      var n3 = e3 == null ? 0 : e3.length;
      return n3 ? tr2(e3, t3) / n3 : pe2;
    }
    function Zn2(e3) {
      return function(t3) {
        return t3 == null ? n2 : t3[e3];
      };
    }
    function Qn2(e3) {
      return function(t3) {
        return e3 == null ? n2 : e3[t3];
      };
    }
    function $n2(e3, t3, n3, r3, i3) {
      return i3(e3, function(e4, i4, a3) {
        n3 = r3 ? (r3 = false, e4) : t3(n3, e4, i4, a3);
      }), n3;
    }
    function er2(e3, t3) {
      var n3 = e3.length;
      for (e3.sort(t3); n3--; ) e3[n3] = e3[n3].value;
      return e3;
    }
    function tr2(e3, t3) {
      for (var r3, i3 = -1, a3 = e3.length; ++i3 < a3; ) {
        var o3 = t3(e3[i3]);
        o3 !== n2 && (r3 = r3 === n2 ? o3 : r3 + o3);
      }
      return r3;
    }
    function nr2(e3, t3) {
      for (var n3 = -1, r3 = Array(e3); ++n3 < e3; ) r3[n3] = t3(n3);
      return r3;
    }
    function rr2(e3, t3) {
      return z2(t3, function(t4) {
        return [t4, e3[t4]];
      });
    }
    function ir2(e3) {
      return e3 && e3.slice(0, Er(e3) + 1).replace(dt2, ``);
    }
    function ar2(e3) {
      return function(t3) {
        return e3(t3);
      };
    }
    function or2(e3, t3) {
      return z2(t3, function(t4) {
        return e3[t4];
      });
    }
    function B2(e3, t3) {
      return e3.has(t3);
    }
    function sr2(e3, t3) {
      for (var n3 = -1, r3 = e3.length; ++n3 < r3 && qn2(t3, e3[n3], 0) > -1; ) ;
      return n3;
    }
    function cr2(e3, t3) {
      for (var n3 = e3.length; n3-- && qn2(t3, e3[n3], 0) > -1; ) ;
      return n3;
    }
    function lr(e3, t3) {
      for (var n3 = e3.length, r3 = 0; n3--; ) e3[n3] === t3 && ++r3;
      return r3;
    }
    var ur = Qn2(P2), dr = Qn2(hn2);
    function fr(e3) {
      return `\\` + _n2[e3];
    }
    function pr(e3, t3) {
      return e3 == null ? n2 : e3[t3];
    }
    function mr(e3) {
      return fn2.test(e3);
    }
    function hr(e3) {
      return j2.test(e3);
    }
    function gr(e3) {
      for (var t3, n3 = []; !(t3 = e3.next()).done; ) n3.push(t3.value);
      return n3;
    }
    function _r(e3) {
      var t3 = -1, n3 = Array(e3.size);
      return e3.forEach(function(e4, r3) {
        n3[++t3] = [r3, e4];
      }), n3;
    }
    function vr(e3, t3) {
      return function(n3) {
        return e3(t3(n3));
      };
    }
    function yr(e3, t3) {
      for (var n3 = -1, r3 = e3.length, i3 = 0, a3 = []; ++n3 < r3; ) {
        var o3 = e3[n3];
        (o3 === t3 || o3 === d2) && (e3[n3] = d2, a3[i3++] = n3);
      }
      return a3;
    }
    function br(e3) {
      var t3 = -1, n3 = Array(e3.size);
      return e3.forEach(function(e4) {
        n3[++t3] = e4;
      }), n3;
    }
    function xr(e3) {
      var t3 = -1, n3 = Array(e3.size);
      return e3.forEach(function(e4) {
        n3[++t3] = [e4, e4];
      }), n3;
    }
    function Sr(e3, t3, n3) {
      for (var r3 = n3 - 1, i3 = e3.length; ++r3 < i3; ) if (e3[r3] === t3) return r3;
      return -1;
    }
    function Cr(e3, t3, n3) {
      for (var r3 = n3 + 1; r3--; ) if (e3[r3] === t3) return r3;
      return r3;
    }
    function wr(e3) {
      return mr(e3) ? Or(e3) : Hn2(e3);
    }
    function Tr(e3) {
      return mr(e3) ? kr(e3) : Un2(e3);
    }
    function Er(e3) {
      for (var t3 = e3.length; t3-- && T2.test(e3.charAt(t3)); ) ;
      return t3;
    }
    var Dr = Qn2(gn2);
    function Or(e3) {
      for (var t3 = un2.lastIndex = 0; un2.test(e3); ) ++t3;
      return t3;
    }
    function kr(e3) {
      return e3.match(un2) || [];
    }
    function Ar(e3) {
      return e3.match(dn2) || [];
    }
    var jr = (function e3(t3) {
      t3 = t3 == null ? I2 : jr.defaults(I2.Object(), t3, jr.pick(I2, pn2));
      var T3 = t3.Array, ht3 = t3.Date, Et3 = t3.Error, Dt3 = t3.Function, Ot3 = t3.Math, O3 = t3.Object, kt3 = t3.RegExp, At3 = t3.String, k3 = t3.TypeError, jt3 = T3.prototype, Mt3 = Dt3.prototype, Nt3 = O3.prototype, Pt3 = t3[`__core-js_shared__`], Ft3 = Mt3.toString, A3 = Nt3.hasOwnProperty, It3 = 0, Lt3 = (function() {
        var e4 = /[^.]+$/.exec(Pt3 && Pt3.keys && Pt3.keys.IE_PROTO || ``);
        return e4 ? `Symbol(src)_1.` + e4 : ``;
      })(), Rt3 = Nt3.toString, zt3 = Ft3.call(O3), Bt3 = I2._, Vt3 = kt3(`^` + Ft3.call(A3).replace(lt2, `\\$&`).replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, `$1.*?`) + `$`), Ht3 = Cn2 ? t3.Buffer : n2, Ut3 = t3.Symbol, Wt3 = t3.Uint8Array, Gt3 = Ht3 ? Ht3.allocUnsafe : n2, Kt3 = vr(O3.getPrototypeOf, O3), qt3 = O3.create, Jt3 = Nt3.propertyIsEnumerable, Yt3 = jt3.splice, Xt3 = Ut3 ? Ut3.isConcatSpreadable : n2, Zt3 = Ut3 ? Ut3.iterator : n2, Qt3 = Ut3 ? Ut3.toStringTag : n2, $t3 = (function() {
        try {
          var e4 = ns(O3, `defineProperty`);
          return e4({}, ``, {}), e4;
        } catch {
        }
      })(), en3 = t3.clearTimeout !== I2.clearTimeout && t3.clearTimeout, tn3 = ht3 && ht3.now !== I2.Date.now && ht3.now, nn3 = t3.setTimeout !== I2.setTimeout && t3.setTimeout, rn3 = Ot3.ceil, an3 = Ot3.floor, on3 = O3.getOwnPropertySymbols, sn3 = Ht3 ? Ht3.isBuffer : n2, un3 = t3.isFinite, dn3 = jt3.join, fn3 = vr(O3.keys, O3), j3 = Ot3.max, P3 = Ot3.min, hn3 = ht3.now, gn3 = t3.parseInt, _n3 = Ot3.random, yn3 = jt3.reverse, bn3 = ns(t3, `DataView`), xn3 = ns(t3, `Map`), Sn3 = ns(t3, `Promise`), wn3 = ns(t3, `Set`), L3 = ns(t3, `WeakMap`), Hn3 = ns(O3, `create`), Un3 = L3 && new L3(), Qn3 = {}, Sr2 = Bs(bn3), Or2 = Bs(xn3), kr2 = Bs(Sn3), Mr = Bs(wn3), Nr = Bs(L3), Pr = Ut3 ? Ut3.prototype : n2, Fr = Pr ? Pr.valueOf : n2, Ir = Pr ? Pr.toString : n2;
      function V(e4) {
        if (X(e4) && !q(e4) && !(e4 instanceof H)) {
          if (e4 instanceof zr) return e4;
          if (A3.call(e4, `__wrapped__`)) return Hs(e4);
        }
        return new zr(e4);
      }
      var Lr = /* @__PURE__ */ (function() {
        function e4() {
        }
        return function(t4) {
          if (!Y(t4)) return {};
          if (qt3) return qt3(t4);
          e4.prototype = t4;
          var r3 = new e4();
          return e4.prototype = n2, r3;
        };
      })();
      function Rr() {
      }
      function zr(e4, t4) {
        this.__wrapped__ = e4, this.__actions__ = [], this.__chain__ = !!t4, this.__index__ = 0, this.__values__ = n2;
      }
      V.templateSettings = { escape: rt2, evaluate: it2, interpolate: at2, variable: ``, imports: { _: V } }, V.prototype = Rr.prototype, V.prototype.constructor = V, zr.prototype = Lr(Rr.prototype), zr.prototype.constructor = zr;
      function H(e4) {
        this.__wrapped__ = e4, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = false, this.__iteratees__ = [], this.__takeCount__ = me2, this.__views__ = [];
      }
      function Br() {
        var e4 = new H(this.__wrapped__);
        return e4.__actions__ = mo(this.__actions__), e4.__dir__ = this.__dir__, e4.__filtered__ = this.__filtered__, e4.__iteratees__ = mo(this.__iteratees__), e4.__takeCount__ = this.__takeCount__, e4.__views__ = mo(this.__views__), e4;
      }
      function Vr() {
        if (this.__filtered__) {
          var e4 = new H(this);
          e4.__dir__ = -1, e4.__filtered__ = true;
        } else e4 = this.clone(), e4.__dir__ *= -1;
        return e4;
      }
      function Hr() {
        var e4 = this.__wrapped__.value(), t4 = this.__dir__, n3 = q(e4), r3 = t4 < 0, i3 = n3 ? e4.length : 0, a3 = os(0, i3, this.__views__), o3 = a3.start, s3 = a3.end, c3 = s3 - o3, l3 = r3 ? s3 : o3 - 1, u3 = this.__iteratees__, d3 = u3.length, f3 = 0, p3 = P3(c3, this.__takeCount__);
        if (!n3 || !r3 && i3 == c3 && p3 == c3) return Ja(e4, this.__actions__);
        var m3 = [];
        outer: for (; c3-- && f3 < p3; ) {
          l3 += t4;
          for (var h3 = -1, g3 = e4[l3]; ++h3 < d3; ) {
            var _3 = u3[h3], v3 = _3.iteratee, y3 = _3.type, b3 = v3(g3);
            if (y3 == ce2) g3 = b3;
            else if (!b3) {
              if (y3 == se2) continue outer;
              break outer;
            }
          }
          m3[f3++] = g3;
        }
        return m3;
      }
      H.prototype = Lr(Rr.prototype), H.prototype.constructor = H;
      function Ur(e4) {
        var t4 = -1, n3 = e4 == null ? 0 : e4.length;
        for (this.clear(); ++t4 < n3; ) {
          var r3 = e4[t4];
          this.set(r3[0], r3[1]);
        }
      }
      function Wr() {
        this.__data__ = Hn3 ? Hn3(null) : {}, this.size = 0;
      }
      function Gr(e4) {
        var t4 = this.has(e4) && delete this.__data__[e4];
        return this.size -= +!!t4, t4;
      }
      function Kr(e4) {
        var t4 = this.__data__;
        if (Hn3) {
          var r3 = t4[e4];
          return r3 === l2 ? n2 : r3;
        }
        return A3.call(t4, e4) ? t4[e4] : n2;
      }
      function qr(e4) {
        var t4 = this.__data__;
        return Hn3 ? t4[e4] !== n2 : A3.call(t4, e4);
      }
      function Jr(e4, t4) {
        var r3 = this.__data__;
        return this.size += +!this.has(e4), r3[e4] = Hn3 && t4 === n2 ? l2 : t4, this;
      }
      Ur.prototype.clear = Wr, Ur.prototype.delete = Gr, Ur.prototype.get = Kr, Ur.prototype.has = qr, Ur.prototype.set = Jr;
      function Yr(e4) {
        var t4 = -1, n3 = e4 == null ? 0 : e4.length;
        for (this.clear(); ++t4 < n3; ) {
          var r3 = e4[t4];
          this.set(r3[0], r3[1]);
        }
      }
      function Xr() {
        this.__data__ = [], this.size = 0;
      }
      function Zr(e4) {
        var t4 = this.__data__, n3 = Si(t4, e4);
        return n3 < 0 ? false : (n3 == t4.length - 1 ? t4.pop() : Yt3.call(t4, n3, 1), --this.size, true);
      }
      function Qr(e4) {
        var t4 = this.__data__, r3 = Si(t4, e4);
        return r3 < 0 ? n2 : t4[r3][1];
      }
      function $r(e4) {
        return Si(this.__data__, e4) > -1;
      }
      function ei(e4, t4) {
        var n3 = this.__data__, r3 = Si(n3, e4);
        return r3 < 0 ? (++this.size, n3.push([e4, t4])) : n3[r3][1] = t4, this;
      }
      Yr.prototype.clear = Xr, Yr.prototype.delete = Zr, Yr.prototype.get = Qr, Yr.prototype.has = $r, Yr.prototype.set = ei;
      function ti(e4) {
        var t4 = -1, n3 = e4 == null ? 0 : e4.length;
        for (this.clear(); ++t4 < n3; ) {
          var r3 = e4[t4];
          this.set(r3[0], r3[1]);
        }
      }
      function ni() {
        this.size = 0, this.__data__ = { hash: new Ur(), map: new (xn3 || Yr)(), string: new Ur() };
      }
      function ri(e4) {
        var t4 = es(this, e4).delete(e4);
        return this.size -= +!!t4, t4;
      }
      function ii(e4) {
        return es(this, e4).get(e4);
      }
      function ai(e4) {
        return es(this, e4).has(e4);
      }
      function oi(e4, t4) {
        var n3 = es(this, e4), r3 = n3.size;
        return n3.set(e4, t4), this.size += n3.size == r3 ? 0 : 1, this;
      }
      ti.prototype.clear = ni, ti.prototype.delete = ri, ti.prototype.get = ii, ti.prototype.has = ai, ti.prototype.set = oi;
      function si(e4) {
        var t4 = -1, n3 = e4 == null ? 0 : e4.length;
        for (this.__data__ = new ti(); ++t4 < n3; ) this.add(e4[t4]);
      }
      function ci(e4) {
        return this.__data__.set(e4, l2), this;
      }
      function li(e4) {
        return this.__data__.has(e4);
      }
      si.prototype.add = si.prototype.push = ci, si.prototype.has = li;
      function ui(e4) {
        var t4 = this.__data__ = new Yr(e4);
        this.size = t4.size;
      }
      function di() {
        this.__data__ = new Yr(), this.size = 0;
      }
      function fi(e4) {
        var t4 = this.__data__, n3 = t4.delete(e4);
        return this.size = t4.size, n3;
      }
      function pi(e4) {
        return this.__data__.get(e4);
      }
      function mi(e4) {
        return this.__data__.has(e4);
      }
      function hi(e4, t4) {
        var n3 = this.__data__;
        if (n3 instanceof Yr) {
          var r3 = n3.__data__;
          if (!xn3 || r3.length < i2 - 1) return r3.push([e4, t4]), this.size = ++n3.size, this;
          n3 = this.__data__ = new ti(r3);
        }
        return n3.set(e4, t4), this.size = n3.size, this;
      }
      ui.prototype.clear = di, ui.prototype.delete = fi, ui.prototype.get = pi, ui.prototype.has = mi, ui.prototype.set = hi;
      function gi(e4, t4) {
        var n3 = q(e4), r3 = !n3 && hu(e4), i3 = !n3 && !r3 && yu(e4), a3 = !n3 && !r3 && !i3 && Wu(e4), o3 = n3 || r3 || i3 || a3, s3 = o3 ? nr2(e4.length, At3) : [], c3 = s3.length;
        for (var l3 in e4) (t4 || A3.call(e4, l3)) && !(o3 && (l3 == `length` || i3 && (l3 == `offset` || l3 == `parent`) || a3 && (l3 == `buffer` || l3 == `byteLength` || l3 == `byteOffset`) || ms(l3, c3))) && s3.push(l3);
        return s3;
      }
      function _i(e4) {
        var t4 = e4.length;
        return t4 ? e4[Oa(0, t4 - 1)] : n2;
      }
      function vi(e4, t4) {
        return Ls(mo(e4), Oi(t4, 0, e4.length));
      }
      function yi(e4) {
        return Ls(mo(e4));
      }
      function bi(e4, t4, r3) {
        (r3 !== n2 && !fu(e4[t4], r3) || r3 === n2 && !(t4 in e4)) && Ei(e4, t4, r3);
      }
      function xi(e4, t4, r3) {
        var i3 = e4[t4];
        (!(A3.call(e4, t4) && fu(i3, r3)) || r3 === n2 && !(t4 in e4)) && Ei(e4, t4, r3);
      }
      function Si(e4, t4) {
        for (var n3 = e4.length; n3--; ) if (fu(e4[n3][0], t4)) return n3;
        return -1;
      }
      function Ci(e4, t4, n3, r3) {
        return Pi(e4, function(e5, i3, a3) {
          t4(r3, e5, n3(e5), a3);
        }), r3;
      }
      function wi(e4, t4) {
        return e4 && ho(t4, $(t4), e4);
      }
      function Ti(e4, t4) {
        return e4 && ho(t4, wd(t4), e4);
      }
      function Ei(e4, t4, n3) {
        t4 == `__proto__` && $t3 ? $t3(e4, t4, { configurable: true, enumerable: true, value: n3, writable: true }) : e4[t4] = n3;
      }
      function Di(e4, t4) {
        for (var r3 = -1, i3 = t4.length, a3 = T3(i3), o3 = e4 == null; ++r3 < i3; ) a3[r3] = o3 ? n2 : vd(e4, t4[r3]);
        return a3;
      }
      function Oi(e4, t4, r3) {
        return e4 === e4 && (r3 !== n2 && (e4 = e4 <= r3 ? e4 : r3), t4 !== n2 && (e4 = e4 >= t4 ? e4 : t4)), e4;
      }
      function ki(e4, t4, r3, i3, a3, o3) {
        var s3, c3 = t4 & f2, l3 = t4 & p2, u3 = t4 & m2;
        if (r3 && (s3 = a3 ? r3(e4, i3, a3, o3) : r3(e4)), s3 !== n2) return s3;
        if (!Y(e4)) return e4;
        var d3 = q(e4);
        if (d3) {
          if (s3 = ls(e4), !c3) return mo(e4, s3);
        } else {
          var h3 = K(e4), g3 = h3 == Te2 || h3 == Ee2;
          if (yu(e4)) return ro(e4, c3);
          if (h3 == Ae2 || h3 == ve2 || g3 && !a3) {
            if (s3 = l3 || g3 ? {} : us(e4), !c3) return l3 ? _o(e4, Ti(s3, e4)) : go(e4, wi(s3, e4));
          } else {
            if (!N2[h3]) return a3 ? e4 : {};
            s3 = ds(e4, h3, c3);
          }
        }
        o3 ||= new ui();
        var _3 = o3.get(e4);
        if (_3) return _3;
        o3.set(e4, s3), Vu(e4) ? e4.forEach(function(n3) {
          s3.add(ki(n3, t4, r3, n3, e4, o3));
        }) : Au(e4) && e4.forEach(function(n3, i4) {
          s3.set(i4, ki(n3, t4, r3, i4, e4, o3));
        });
        var v3 = d3 ? n2 : (u3 ? l3 ? Xo : Yo : l3 ? wd : $)(e4);
        return Mn2(v3 || e4, function(n3, i4) {
          v3 && (i4 = n3, n3 = e4[i4]), xi(s3, i4, ki(n3, t4, r3, i4, e4, o3));
        }), s3;
      }
      function Ai(e4) {
        var t4 = $(e4);
        return function(n3) {
          return ji(n3, e4, t4);
        };
      }
      function ji(e4, t4, r3) {
        var i3 = r3.length;
        if (e4 == null) return !i3;
        for (e4 = O3(e4); i3--; ) {
          var a3 = r3[i3], o3 = t4[a3], s3 = e4[a3];
          if (s3 === n2 && !(a3 in e4) || !o3(s3)) return false;
        }
        return true;
      }
      function Mi(e4, t4, r3) {
        if (typeof e4 != `function`) throw new k3(o2);
        return Ns(function() {
          e4.apply(n2, r3);
        }, t4);
      }
      function Ni(e4, t4, n3, r3) {
        var a3 = -1, o3 = In2, s3 = true, c3 = e4.length, l3 = [], u3 = t4.length;
        if (!c3) return l3;
        n3 && (t4 = z2(t4, ar2(n3))), r3 ? (o3 = Ln2, s3 = false) : t4.length >= i2 && (o3 = B2, s3 = false, t4 = new si(t4));
        outer: for (; ++a3 < c3; ) {
          var d3 = e4[a3], f3 = n3 == null ? d3 : n3(d3);
          if (d3 = r3 || d3 !== 0 ? d3 : 0, s3 && f3 === f3) {
            for (var p3 = u3; p3--; ) if (t4[p3] === f3) continue outer;
            l3.push(d3);
          } else o3(t4, f3, r3) || l3.push(d3);
        }
        return l3;
      }
      var Pi = bo(Hi), Fi = bo(Ui, true);
      function Ii(e4, t4) {
        var n3 = true;
        return Pi(e4, function(e5, r3, i3) {
          return n3 = !!t4(e5, r3, i3), n3;
        }), n3;
      }
      function Li(e4, t4, r3) {
        for (var i3 = -1, a3 = e4.length; ++i3 < a3; ) {
          var o3 = e4[i3], s3 = t4(o3);
          if (s3 != null && (c3 === n2 ? s3 === s3 && !Uu(s3) : r3(s3, c3))) var c3 = s3, l3 = o3;
        }
        return l3;
      }
      function Ri(e4, t4, r3, i3) {
        var a3 = e4.length;
        for (r3 = Z(r3), r3 < 0 && (r3 = -r3 > a3 ? 0 : a3 + r3), i3 = i3 === n2 || i3 > a3 ? a3 : Z(i3), i3 < 0 && (i3 += a3), i3 = r3 > i3 ? 0 : Qu(i3); r3 < i3; ) e4[r3++] = t4;
        return e4;
      }
      function zi(e4, t4) {
        var n3 = [];
        return Pi(e4, function(e5, r3, i3) {
          t4(e5, r3, i3) && n3.push(e5);
        }), n3;
      }
      function U(e4, t4, n3, r3, i3) {
        var a3 = -1, o3 = e4.length;
        for (n3 ||= ps, i3 ||= []; ++a3 < o3; ) {
          var s3 = e4[a3];
          t4 > 0 && n3(s3) ? t4 > 1 ? U(s3, t4 - 1, n3, r3, i3) : Rn2(i3, s3) : r3 || (i3[i3.length] = s3);
        }
        return i3;
      }
      var Bi = xo(), Vi = xo(true);
      function Hi(e4, t4) {
        return e4 && Bi(e4, t4, $);
      }
      function Ui(e4, t4) {
        return e4 && Vi(e4, t4, $);
      }
      function Wi(e4, t4) {
        return Fn2(t4, function(t5) {
          return Du(e4[t5]);
        });
      }
      function Gi(e4, t4) {
        t4 = $a(t4, e4);
        for (var r3 = 0, i3 = t4.length; e4 != null && r3 < i3; ) e4 = e4[zs(t4[r3++])];
        return r3 && r3 == i3 ? e4 : n2;
      }
      function Ki(e4, t4, n3) {
        var r3 = t4(e4);
        return q(e4) ? r3 : Rn2(r3, n3(e4));
      }
      function qi(e4) {
        return e4 == null ? e4 === n2 ? Ie2 : ke2 : Qt3 && Qt3 in O3(e4) ? rs(e4) : Ds(e4);
      }
      function Ji(e4, t4) {
        return e4 > t4;
      }
      function Yi(e4, t4) {
        return e4 != null && A3.call(e4, t4);
      }
      function Xi(e4, t4) {
        return e4 != null && t4 in O3(e4);
      }
      function Zi(e4, t4, n3) {
        return e4 >= P3(t4, n3) && e4 < j3(t4, n3);
      }
      function Qi(e4, t4, r3) {
        for (var i3 = r3 ? Ln2 : In2, a3 = e4[0].length, o3 = e4.length, s3 = o3, c3 = T3(o3), l3 = 1 / 0, u3 = []; s3--; ) {
          var d3 = e4[s3];
          s3 && t4 && (d3 = z2(d3, ar2(t4))), l3 = P3(d3.length, l3), c3[s3] = !r3 && (t4 || a3 >= 120 && d3.length >= 120) ? new si(s3 && d3) : n2;
        }
        d3 = e4[0];
        var f3 = -1, p3 = c3[0];
        outer: for (; ++f3 < a3 && u3.length < l3; ) {
          var m3 = d3[f3], h3 = t4 ? t4(m3) : m3;
          if (m3 = r3 || m3 !== 0 ? m3 : 0, !(p3 ? B2(p3, h3) : i3(u3, h3, r3))) {
            for (s3 = o3; --s3; ) {
              var g3 = c3[s3];
              if (!(g3 ? B2(g3, h3) : i3(e4[s3], h3, r3))) continue outer;
            }
            p3 && p3.push(h3), u3.push(m3);
          }
        }
        return u3;
      }
      function $i(e4, t4, n3, r3) {
        return Hi(e4, function(e5, i3, a3) {
          t4(r3, n3(e5), i3, a3);
        }), r3;
      }
      function ea(e4, t4, r3) {
        t4 = $a(t4, e4), e4 = ks(e4, t4);
        var i3 = e4 == null ? e4 : e4[zs(pc(t4))];
        return i3 == null ? n2 : R2(i3, e4, r3);
      }
      function ta(e4) {
        return X(e4) && qi(e4) == ve2;
      }
      function na(e4) {
        return X(e4) && qi(e4) == ze2;
      }
      function ra(e4) {
        return X(e4) && qi(e4) == Se2;
      }
      function ia(e4, t4, n3, r3, i3) {
        return e4 === t4 ? true : e4 == null || t4 == null || !X(e4) && !X(t4) ? e4 !== e4 && t4 !== t4 : aa(e4, t4, n3, r3, ia, i3);
      }
      function aa(e4, t4, n3, r3, i3, a3) {
        var o3 = q(e4), s3 = q(t4), c3 = o3 ? ye2 : K(e4), l3 = s3 ? ye2 : K(t4);
        c3 = c3 == ve2 ? Ae2 : c3, l3 = l3 == ve2 ? Ae2 : l3;
        var u3 = c3 == Ae2, d3 = l3 == Ae2, f3 = c3 == l3;
        if (f3 && yu(e4)) {
          if (!yu(t4)) return false;
          o3 = true, u3 = false;
        }
        if (f3 && !u3) return a3 ||= new ui(), o3 || Wu(e4) ? Go(e4, t4, n3, r3, i3, a3) : Ko(e4, t4, c3, n3, r3, i3, a3);
        if (!(n3 & h2)) {
          var p3 = u3 && A3.call(e4, `__wrapped__`), m3 = d3 && A3.call(t4, `__wrapped__`);
          if (p3 || m3) {
            var g3 = p3 ? e4.value() : e4, _3 = m3 ? t4.value() : t4;
            return a3 ||= new ui(), i3(g3, _3, n3, r3, a3);
          }
        }
        return f3 ? (a3 ||= new ui(), qo(e4, t4, n3, r3, i3, a3)) : false;
      }
      function oa(e4) {
        return X(e4) && K(e4) == De2;
      }
      function sa(e4, t4, r3, i3) {
        var a3 = r3.length, o3 = a3, s3 = !i3;
        if (e4 == null) return !o3;
        for (e4 = O3(e4); a3--; ) {
          var c3 = r3[a3];
          if (s3 && c3[2] ? c3[1] !== e4[c3[0]] : !(c3[0] in e4)) return false;
        }
        for (; ++a3 < o3; ) {
          c3 = r3[a3];
          var l3 = c3[0], u3 = e4[l3], d3 = c3[1];
          if (s3 && c3[2]) {
            if (u3 === n2 && !(l3 in e4)) return false;
          } else {
            var f3 = new ui();
            if (i3) var p3 = i3(u3, d3, l3, e4, t4, f3);
            if (!(p3 === n2 ? ia(d3, u3, h2 | g2, i3, f3) : p3)) return false;
          }
        }
        return true;
      }
      function ca(e4) {
        return !Y(e4) || ys(e4) ? false : (Du(e4) ? Vt3 : D2).test(Bs(e4));
      }
      function la(e4) {
        return X(e4) && qi(e4) == Ne2;
      }
      function ua(e4) {
        return X(e4) && K(e4) == w2;
      }
      function da(e4) {
        return X(e4) && ku(e4.length) && !!M2[qi(e4)];
      }
      function fa(e4) {
        return typeof e4 == `function` ? e4 : e4 == null ? Mf : typeof e4 == `object` ? q(e4) ? va(e4[0], e4[1]) : _a(e4) : Gf(e4);
      }
      function pa(e4) {
        if (!xs(e4)) return fn3(e4);
        var t4 = [];
        for (var n3 in O3(e4)) A3.call(e4, n3) && n3 != `constructor` && t4.push(n3);
        return t4;
      }
      function ma(e4) {
        if (!Y(e4)) return Es(e4);
        var t4 = xs(e4), n3 = [];
        for (var r3 in e4) r3 == `constructor` && (t4 || !A3.call(e4, r3)) || n3.push(r3);
        return n3;
      }
      function ha(e4, t4) {
        return e4 < t4;
      }
      function ga(e4, t4) {
        var n3 = -1, r3 = _u(e4) ? T3(e4.length) : [];
        return Pi(e4, function(e5, i3, a3) {
          r3[++n3] = t4(e5, i3, a3);
        }), r3;
      }
      function _a(e4) {
        var t4 = ts(e4);
        return t4.length == 1 && t4[0][2] ? Cs(t4[0][0], t4[0][1]) : function(n3) {
          return n3 === e4 || sa(n3, e4, t4);
        };
      }
      function va(e4, t4) {
        return gs(e4) && Ss(t4) ? Cs(zs(e4), t4) : function(r3) {
          var i3 = vd(r3, e4);
          return i3 === n2 && i3 === t4 ? bd(r3, e4) : ia(t4, i3, h2 | g2);
        };
      }
      function ya(e4, t4, r3, i3, a3) {
        e4 !== t4 && Bi(t4, function(o3, s3) {
          if (a3 ||= new ui(), Y(o3)) ba(e4, t4, s3, r3, ya, i3, a3);
          else {
            var c3 = i3 ? i3(js(e4, s3), o3, s3 + ``, e4, t4, a3) : n2;
            c3 === n2 && (c3 = o3), bi(e4, s3, c3);
          }
        }, wd);
      }
      function ba(e4, t4, r3, i3, a3, o3, s3) {
        var c3 = js(e4, r3), l3 = js(t4, r3), u3 = s3.get(l3);
        if (u3) {
          bi(e4, r3, u3);
          return;
        }
        var d3 = o3 ? o3(c3, l3, r3 + ``, e4, t4, s3) : n2, f3 = d3 === n2;
        if (f3) {
          var p3 = q(l3), m3 = !p3 && yu(l3), h3 = !p3 && !m3 && Wu(l3);
          d3 = l3, p3 || m3 || h3 ? q(c3) ? d3 = c3 : J(c3) ? d3 = mo(c3) : m3 ? (f3 = false, d3 = ro(l3, true)) : h3 ? (f3 = false, d3 = co(l3, true)) : d3 = [] : Ru(l3) || hu(l3) ? (d3 = c3, hu(c3) ? d3 = ed(c3) : (!Y(c3) || Du(c3)) && (d3 = us(l3))) : f3 = false;
        }
        f3 && (s3.set(l3, d3), a3(d3, l3, i3, o3, s3), s3.delete(l3)), bi(e4, r3, d3);
      }
      function xa(e4, t4) {
        var r3 = e4.length;
        if (r3) return t4 += t4 < 0 ? r3 : 0, ms(t4, r3) ? e4[t4] : n2;
      }
      function Sa(e4, t4, n3) {
        t4 = t4.length ? z2(t4, function(e5) {
          return q(e5) ? function(t5) {
            return Gi(t5, e5.length === 1 ? e5[0] : e5);
          } : e5;
        }) : [Mf];
        var r3 = -1;
        return t4 = z2(t4, ar2(G())), er2(ga(e4, function(e5, n4, i3) {
          return { criteria: z2(t4, function(t5) {
            return t5(e5);
          }), index: ++r3, value: e5 };
        }), function(e5, t5) {
          return uo(e5, t5, n3);
        });
      }
      function Ca(e4, t4) {
        return wa(e4, t4, function(t5, n3) {
          return bd(e4, n3);
        });
      }
      function wa(e4, t4, n3) {
        for (var r3 = -1, i3 = t4.length, a3 = {}; ++r3 < i3; ) {
          var o3 = t4[r3], s3 = Gi(e4, o3);
          n3(s3, o3) && Na(a3, $a(o3, e4), s3);
        }
        return a3;
      }
      function Ta(e4) {
        return function(t4) {
          return Gi(t4, e4);
        };
      }
      function Ea(e4, t4, n3, r3) {
        var i3 = r3 ? Jn2 : qn2, a3 = -1, o3 = t4.length, s3 = e4;
        for (e4 === t4 && (t4 = mo(t4)), n3 && (s3 = z2(e4, ar2(n3))); ++a3 < o3; ) for (var c3 = 0, l3 = t4[a3], u3 = n3 ? n3(l3) : l3; (c3 = i3(s3, u3, c3, r3)) > -1; ) s3 !== e4 && Yt3.call(s3, c3, 1), Yt3.call(e4, c3, 1);
        return e4;
      }
      function Da(e4, t4) {
        for (var n3 = e4 ? t4.length : 0, r3 = n3 - 1; n3--; ) {
          var i3 = t4[n3];
          if (n3 == r3 || i3 !== a3) {
            var a3 = i3;
            ms(i3) ? Yt3.call(e4, i3, 1) : Ga(e4, i3);
          }
        }
        return e4;
      }
      function Oa(e4, t4) {
        return e4 + an3(_n3() * (t4 - e4 + 1));
      }
      function ka(e4, t4, n3, r3) {
        for (var i3 = -1, a3 = j3(rn3((t4 - e4) / (n3 || 1)), 0), o3 = T3(a3); a3--; ) o3[r3 ? a3 : ++i3] = e4, e4 += n3;
        return o3;
      }
      function Aa(e4, t4) {
        var n3 = ``;
        if (!e4 || t4 < 1 || t4 > de2) return n3;
        do
          t4 % 2 && (n3 += e4), t4 = an3(t4 / 2), t4 && (e4 += e4);
        while (t4);
        return n3;
      }
      function W(e4, t4) {
        return Ps(Os(e4, t4, Mf), e4 + ``);
      }
      function ja(e4) {
        return _i(Hd(e4));
      }
      function Ma(e4, t4) {
        var n3 = Hd(e4);
        return Ls(n3, Oi(t4, 0, n3.length));
      }
      function Na(e4, t4, r3, i3) {
        if (!Y(e4)) return e4;
        t4 = $a(t4, e4);
        for (var a3 = -1, o3 = t4.length, s3 = o3 - 1, c3 = e4; c3 != null && ++a3 < o3; ) {
          var l3 = zs(t4[a3]), u3 = r3;
          if (l3 === `__proto__` || l3 === `constructor` || l3 === `prototype`) return e4;
          if (a3 != s3) {
            var d3 = c3[l3];
            u3 = i3 ? i3(d3, l3, c3) : n2, u3 === n2 && (u3 = Y(d3) ? d3 : ms(t4[a3 + 1]) ? [] : {});
          }
          xi(c3, l3, u3), c3 = c3[l3];
        }
        return e4;
      }
      var Pa = Un3 ? function(e4, t4) {
        return Un3.set(e4, t4), e4;
      } : Mf, Fa = $t3 ? function(e4, t4) {
        return $t3(e4, `toString`, { configurable: true, enumerable: false, value: Of(t4), writable: true });
      } : Mf;
      function Ia(e4) {
        return Ls(Hd(e4));
      }
      function La(e4, t4, n3) {
        var r3 = -1, i3 = e4.length;
        t4 < 0 && (t4 = -t4 > i3 ? 0 : i3 + t4), n3 = n3 > i3 ? i3 : n3, n3 < 0 && (n3 += i3), i3 = t4 > n3 ? 0 : n3 - t4 >>> 0, t4 >>>= 0;
        for (var a3 = T3(i3); ++r3 < i3; ) a3[r3] = e4[r3 + t4];
        return a3;
      }
      function Ra(e4, t4) {
        var n3;
        return Pi(e4, function(e5, r3, i3) {
          return n3 = t4(e5, r3, i3), !n3;
        }), !!n3;
      }
      function za(e4, t4, n3) {
        var r3 = 0, i3 = e4 == null ? r3 : e4.length;
        if (typeof t4 == `number` && t4 === t4 && i3 <= ge2) {
          for (; r3 < i3; ) {
            var a3 = r3 + i3 >>> 1, o3 = e4[a3];
            o3 !== null && !Uu(o3) && (n3 ? o3 <= t4 : o3 < t4) ? r3 = a3 + 1 : i3 = a3;
          }
          return i3;
        }
        return Ba(e4, t4, Mf, n3);
      }
      function Ba(e4, t4, r3, i3) {
        var a3 = 0, o3 = e4 == null ? 0 : e4.length;
        if (o3 === 0) return 0;
        t4 = r3(t4);
        for (var s3 = t4 !== t4, c3 = t4 === null, l3 = Uu(t4), u3 = t4 === n2; a3 < o3; ) {
          var d3 = an3((a3 + o3) / 2), f3 = r3(e4[d3]), p3 = f3 !== n2, m3 = f3 === null, h3 = f3 === f3, g3 = Uu(f3);
          if (s3) var _3 = i3 || h3;
          else _3 = u3 ? h3 && (i3 || p3) : c3 ? h3 && p3 && (i3 || !m3) : l3 ? h3 && p3 && !m3 && (i3 || !g3) : m3 || g3 ? false : i3 ? f3 <= t4 : f3 < t4;
          _3 ? a3 = d3 + 1 : o3 = d3;
        }
        return P3(o3, he2);
      }
      function Va(e4, t4) {
        for (var n3 = -1, r3 = e4.length, i3 = 0, a3 = []; ++n3 < r3; ) {
          var o3 = e4[n3], s3 = t4 ? t4(o3) : o3;
          if (!n3 || !fu(s3, c3)) {
            var c3 = s3;
            a3[i3++] = o3 === 0 ? 0 : o3;
          }
        }
        return a3;
      }
      function Ha(e4) {
        return typeof e4 == `number` ? e4 : Uu(e4) ? pe2 : +e4;
      }
      function Ua(e4) {
        if (typeof e4 == `string`) return e4;
        if (q(e4)) return z2(e4, Ua) + ``;
        if (Uu(e4)) return Ir ? Ir.call(e4) : ``;
        var t4 = e4 + ``;
        return t4 == `0` && 1 / e4 == -ue2 ? `-0` : t4;
      }
      function Wa(e4, t4, n3) {
        var r3 = -1, a3 = In2, o3 = e4.length, s3 = true, c3 = [], l3 = c3;
        if (n3) s3 = false, a3 = Ln2;
        else if (o3 >= i2) {
          var u3 = t4 ? null : zo(e4);
          if (u3) return br(u3);
          s3 = false, a3 = B2, l3 = new si();
        } else l3 = t4 ? [] : c3;
        outer: for (; ++r3 < o3; ) {
          var d3 = e4[r3], f3 = t4 ? t4(d3) : d3;
          if (d3 = n3 || d3 !== 0 ? d3 : 0, s3 && f3 === f3) {
            for (var p3 = l3.length; p3--; ) if (l3[p3] === f3) continue outer;
            t4 && l3.push(f3), c3.push(d3);
          } else a3(l3, f3, n3) || (l3 !== c3 && l3.push(f3), c3.push(d3));
        }
        return c3;
      }
      function Ga(e4, t4) {
        t4 = $a(t4, e4);
        var n3 = -1, r3 = t4.length;
        if (!r3) return true;
        for (; ++n3 < r3; ) {
          var i3 = zs(t4[n3]);
          if (i3 === `__proto__` && !A3.call(e4, `__proto__`) || (i3 === `constructor` || i3 === `prototype`) && n3 < r3 - 1) return false;
        }
        var a3 = ks(e4, t4);
        return a3 == null || delete a3[zs(pc(t4))];
      }
      function Ka(e4, t4, n3, r3) {
        return Na(e4, t4, n3(Gi(e4, t4)), r3);
      }
      function qa(e4, t4, n3, r3) {
        for (var i3 = e4.length, a3 = r3 ? i3 : -1; (r3 ? a3-- : ++a3 < i3) && t4(e4[a3], a3, e4); ) ;
        return n3 ? La(e4, r3 ? 0 : a3, r3 ? a3 + 1 : i3) : La(e4, r3 ? a3 + 1 : 0, r3 ? i3 : a3);
      }
      function Ja(e4, t4) {
        var n3 = e4;
        return n3 instanceof H && (n3 = n3.value()), zn2(t4, function(e5, t5) {
          return t5.func.apply(t5.thisArg, Rn2([e5], t5.args));
        }, n3);
      }
      function Ya(e4, t4, n3) {
        var r3 = e4.length;
        if (r3 < 2) return r3 ? Wa(e4[0]) : [];
        for (var i3 = -1, a3 = T3(r3); ++i3 < r3; ) for (var o3 = e4[i3], s3 = -1; ++s3 < r3; ) s3 != i3 && (a3[i3] = Ni(a3[i3] || o3, e4[s3], t4, n3));
        return Wa(U(a3, 1), t4, n3);
      }
      function Xa(e4, t4, r3) {
        for (var i3 = -1, a3 = e4.length, o3 = t4.length, s3 = {}; ++i3 < a3; ) {
          var c3 = i3 < o3 ? t4[i3] : n2;
          r3(s3, e4[i3], c3);
        }
        return s3;
      }
      function Za(e4) {
        return J(e4) ? e4 : [];
      }
      function Qa(e4) {
        return typeof e4 == `function` ? e4 : Mf;
      }
      function $a(e4, t4) {
        return q(e4) ? e4 : gs(e4, t4) ? [e4] : Rs(Q(e4));
      }
      var eo = W;
      function to(e4, t4, r3) {
        var i3 = e4.length;
        return r3 = r3 === n2 ? i3 : r3, !t4 && r3 >= i3 ? e4 : La(e4, t4, r3);
      }
      var no = en3 || function(e4) {
        return I2.clearTimeout(e4);
      };
      function ro(e4, t4) {
        if (t4) return e4.slice();
        var n3 = e4.length, r3 = Gt3 ? Gt3(n3) : new e4.constructor(n3);
        return e4.copy(r3), r3;
      }
      function io(e4) {
        var t4 = new e4.constructor(e4.byteLength);
        return new Wt3(t4).set(new Wt3(e4)), t4;
      }
      function ao(e4, t4) {
        var n3 = t4 ? io(e4.buffer) : e4.buffer;
        return new e4.constructor(n3, e4.byteOffset, e4.byteLength);
      }
      function oo(e4) {
        var t4 = new e4.constructor(e4.source, yt2.exec(e4));
        return t4.lastIndex = e4.lastIndex, t4;
      }
      function so(e4) {
        return Fr ? O3(Fr.call(e4)) : {};
      }
      function co(e4, t4) {
        var n3 = t4 ? io(e4.buffer) : e4.buffer;
        return new e4.constructor(n3, e4.byteOffset, e4.length);
      }
      function lo(e4, t4) {
        if (e4 !== t4) {
          var r3 = e4 !== n2, i3 = e4 === null, a3 = e4 === e4, o3 = Uu(e4), s3 = t4 !== n2, c3 = t4 === null, l3 = t4 === t4, u3 = Uu(t4);
          if (!c3 && !u3 && !o3 && e4 > t4 || o3 && s3 && l3 && !c3 && !u3 || i3 && s3 && l3 || !r3 && l3 || !a3) return 1;
          if (!i3 && !o3 && !u3 && e4 < t4 || u3 && r3 && a3 && !i3 && !o3 || c3 && r3 && a3 || !s3 && a3 || !l3) return -1;
        }
        return 0;
      }
      function uo(e4, t4, n3) {
        for (var r3 = -1, i3 = e4.criteria, a3 = t4.criteria, o3 = i3.length, s3 = n3.length; ++r3 < o3; ) {
          var c3 = lo(i3[r3], a3[r3]);
          if (c3) return r3 >= s3 ? c3 : c3 * (n3[r3] == `desc` ? -1 : 1);
        }
        return e4.index - t4.index;
      }
      function fo(e4, t4, n3, r3) {
        for (var i3 = -1, a3 = e4.length, o3 = n3.length, s3 = -1, c3 = t4.length, l3 = j3(a3 - o3, 0), u3 = T3(c3 + l3), d3 = !r3; ++s3 < c3; ) u3[s3] = t4[s3];
        for (; ++i3 < o3; ) (d3 || i3 < a3) && (u3[n3[i3]] = e4[i3]);
        for (; l3--; ) u3[s3++] = e4[i3++];
        return u3;
      }
      function po(e4, t4, n3, r3) {
        for (var i3 = -1, a3 = e4.length, o3 = -1, s3 = n3.length, c3 = -1, l3 = t4.length, u3 = j3(a3 - s3, 0), d3 = T3(u3 + l3), f3 = !r3; ++i3 < u3; ) d3[i3] = e4[i3];
        for (var p3 = i3; ++c3 < l3; ) d3[p3 + c3] = t4[c3];
        for (; ++o3 < s3; ) (f3 || i3 < a3) && (d3[p3 + n3[o3]] = e4[i3++]);
        return d3;
      }
      function mo(e4, t4) {
        var n3 = -1, r3 = e4.length;
        for (t4 ||= T3(r3); ++n3 < r3; ) t4[n3] = e4[n3];
        return t4;
      }
      function ho(e4, t4, r3, i3) {
        var a3 = !r3;
        r3 ||= {};
        for (var o3 = -1, s3 = t4.length; ++o3 < s3; ) {
          var c3 = t4[o3], l3 = i3 ? i3(r3[c3], e4[c3], c3, r3, e4) : n2;
          l3 === n2 && (l3 = e4[c3]), a3 ? Ei(r3, c3, l3) : xi(r3, c3, l3);
        }
        return r3;
      }
      function go(e4, t4) {
        return ho(e4, is(e4), t4);
      }
      function _o(e4, t4) {
        return ho(e4, as(e4), t4);
      }
      function vo(e4, t4) {
        return function(n3, r3) {
          var i3 = q(n3) ? jn2 : Ci, a3 = t4 ? t4() : {};
          return i3(n3, e4, G(r3, 2), a3);
        };
      }
      function yo(e4) {
        return W(function(t4, r3) {
          var i3 = -1, a3 = r3.length, o3 = a3 > 1 ? r3[a3 - 1] : n2, s3 = a3 > 2 ? r3[2] : n2;
          for (o3 = e4.length > 3 && typeof o3 == `function` ? (a3--, o3) : n2, s3 && hs(r3[0], r3[1], s3) && (o3 = a3 < 3 ? n2 : o3, a3 = 1), t4 = O3(t4); ++i3 < a3; ) {
            var c3 = r3[i3];
            c3 && e4(t4, c3, i3, o3);
          }
          return t4;
        });
      }
      function bo(e4, t4) {
        return function(n3, r3) {
          if (n3 == null) return n3;
          if (!_u(n3)) return e4(n3, r3);
          for (var i3 = n3.length, a3 = t4 ? i3 : -1, o3 = O3(n3); (t4 ? a3-- : ++a3 < i3) && r3(o3[a3], a3, o3) !== false; ) ;
          return n3;
        };
      }
      function xo(e4) {
        return function(t4, n3, r3) {
          for (var i3 = -1, a3 = O3(t4), o3 = r3(t4), s3 = o3.length; s3--; ) {
            var c3 = o3[e4 ? s3 : ++i3];
            if (n3(a3[c3], c3, a3) === false) break;
          }
          return t4;
        };
      }
      function So(e4, t4, n3) {
        var r3 = t4 & _2, i3 = To(e4);
        function a3() {
          return (this && this !== I2 && this instanceof a3 ? i3 : e4).apply(r3 ? n3 : this, arguments);
        }
        return a3;
      }
      function Co(e4) {
        return function(t4) {
          t4 = Q(t4);
          var r3 = mr(t4) ? Tr(t4) : n2, i3 = r3 ? r3[0] : t4.charAt(0), a3 = r3 ? to(r3, 1).join(``) : t4.slice(1);
          return i3[e4]() + a3;
        };
      }
      function wo(e4) {
        return function(t4) {
          return zn2(Cf(Yd(t4).replace(cn2, ``)), e4, ``);
        };
      }
      function To(e4) {
        return function() {
          var t4 = arguments;
          switch (t4.length) {
            case 0:
              return new e4();
            case 1:
              return new e4(t4[0]);
            case 2:
              return new e4(t4[0], t4[1]);
            case 3:
              return new e4(t4[0], t4[1], t4[2]);
            case 4:
              return new e4(t4[0], t4[1], t4[2], t4[3]);
            case 5:
              return new e4(t4[0], t4[1], t4[2], t4[3], t4[4]);
            case 6:
              return new e4(t4[0], t4[1], t4[2], t4[3], t4[4], t4[5]);
            case 7:
              return new e4(t4[0], t4[1], t4[2], t4[3], t4[4], t4[5], t4[6]);
          }
          var n3 = Lr(e4.prototype), r3 = e4.apply(n3, t4);
          return Y(r3) ? r3 : n3;
        };
      }
      function Eo(e4, t4, r3) {
        var i3 = To(e4);
        function a3() {
          for (var o3 = arguments.length, s3 = T3(o3), c3 = o3, l3 = $o(a3); c3--; ) s3[c3] = arguments[c3];
          var u3 = o3 < 3 && s3[0] !== l3 && s3[o3 - 1] !== l3 ? [] : yr(s3, l3);
          return o3 -= u3.length, o3 < r3 ? Lo(e4, t4, ko, a3.placeholder, n2, s3, u3, n2, n2, r3 - o3) : R2(this && this !== I2 && this instanceof a3 ? i3 : e4, this, s3);
        }
        return a3;
      }
      function Do(e4) {
        return function(t4, r3, i3) {
          var a3 = O3(t4);
          if (!_u(t4)) {
            var o3 = G(r3, 3);
            t4 = $(t4), r3 = function(e5) {
              return o3(a3[e5], e5, a3);
            };
          }
          var s3 = e4(t4, r3, i3);
          return s3 > -1 ? a3[o3 ? t4[s3] : s3] : n2;
        };
      }
      function Oo(e4) {
        return Jo(function(t4) {
          var r3 = t4.length, i3 = r3, a3 = zr.prototype.thru;
          for (e4 && t4.reverse(); i3--; ) {
            var s3 = t4[i3];
            if (typeof s3 != `function`) throw new k3(o2);
            if (a3 && !c3 && Qo(s3) == `wrapper`) var c3 = new zr([], true);
          }
          for (i3 = c3 ? i3 : r3; ++i3 < r3; ) {
            s3 = t4[i3];
            var l3 = Qo(s3), u3 = l3 == `wrapper` ? Zo(s3) : n2;
            c3 = u3 && vs(u3[0]) && u3[1] == (C2 | b2 | S2 | te2) && !u3[4].length && u3[9] == 1 ? c3[Qo(u3[0])].apply(c3, u3[3]) : s3.length == 1 && vs(s3) ? c3[l3]() : c3.thru(s3);
          }
          return function() {
            var e5 = arguments, n3 = e5[0];
            if (c3 && e5.length == 1 && q(n3)) return c3.plant(n3).value();
            for (var i4 = 0, a4 = r3 ? t4[i4].apply(this, e5) : n3; ++i4 < r3; ) a4 = t4[i4].call(this, a4);
            return a4;
          };
        });
      }
      function ko(e4, t4, r3, i3, a3, o3, s3, c3, l3, u3) {
        var d3 = t4 & C2, f3 = t4 & _2, p3 = t4 & v2, m3 = t4 & (b2 | x2), h3 = t4 & ne2, g3 = p3 ? n2 : To(e4);
        function y3() {
          for (var n3 = arguments.length, _3 = T3(n3), v3 = n3; v3--; ) _3[v3] = arguments[v3];
          if (m3) var b3 = $o(y3), x3 = lr(_3, b3);
          if (i3 && (_3 = fo(_3, i3, a3, m3)), o3 && (_3 = po(_3, o3, s3, m3)), n3 -= x3, m3 && n3 < u3) {
            var S3 = yr(_3, b3);
            return Lo(e4, t4, ko, y3.placeholder, r3, _3, S3, c3, l3, u3 - n3);
          }
          var ee3 = f3 ? r3 : this, C3 = p3 ? ee3[e4] : e4;
          return n3 = _3.length, c3 ? _3 = As(_3, c3) : h3 && n3 > 1 && _3.reverse(), d3 && l3 < n3 && (_3.length = l3), this && this !== I2 && this instanceof y3 && (C3 = g3 || To(C3)), C3.apply(ee3, _3);
        }
        return y3;
      }
      function Ao(e4, t4) {
        return function(n3, r3) {
          return $i(n3, e4, t4(r3), {});
        };
      }
      function jo(e4, t4) {
        return function(r3, i3) {
          var a3;
          if (r3 === n2 && i3 === n2) return t4;
          if (r3 !== n2 && (a3 = r3), i3 !== n2) {
            if (a3 === n2) return i3;
            typeof r3 == `string` || typeof i3 == `string` ? (r3 = Ua(r3), i3 = Ua(i3)) : (r3 = Ha(r3), i3 = Ha(i3)), a3 = e4(r3, i3);
          }
          return a3;
        };
      }
      function Mo(e4) {
        return Jo(function(t4) {
          return t4 = z2(t4, ar2(G())), W(function(n3) {
            var r3 = this;
            return e4(t4, function(e5) {
              return R2(e5, r3, n3);
            });
          });
        });
      }
      function No(e4, t4) {
        t4 = t4 === n2 ? ` ` : Ua(t4);
        var r3 = t4.length;
        if (r3 < 2) return r3 ? Aa(t4, e4) : t4;
        var i3 = Aa(t4, rn3(e4 / wr(t4)));
        return mr(t4) ? to(Tr(i3), 0, e4).join(``) : i3.slice(0, e4);
      }
      function Po(e4, t4, n3, r3) {
        var i3 = t4 & _2, a3 = To(e4);
        function o3() {
          for (var t5 = -1, s3 = arguments.length, c3 = -1, l3 = r3.length, u3 = T3(l3 + s3), d3 = this && this !== I2 && this instanceof o3 ? a3 : e4; ++c3 < l3; ) u3[c3] = r3[c3];
          for (; s3--; ) u3[c3++] = arguments[++t5];
          return R2(d3, i3 ? n3 : this, u3);
        }
        return o3;
      }
      function Fo(e4) {
        return function(t4, r3, i3) {
          return i3 && typeof i3 != `number` && hs(t4, r3, i3) && (r3 = i3 = n2), t4 = Zu(t4), r3 === n2 ? (r3 = t4, t4 = 0) : r3 = Zu(r3), i3 = i3 === n2 ? t4 < r3 ? 1 : -1 : Zu(i3), ka(t4, r3, i3, e4);
        };
      }
      function Io(e4) {
        return function(t4, n3) {
          return typeof t4 == `string` && typeof n3 == `string` || (t4 = $u(t4), n3 = $u(n3)), e4(t4, n3);
        };
      }
      function Lo(e4, t4, r3, i3, a3, o3, s3, c3, l3, u3) {
        var d3 = t4 & b2, f3 = d3 ? s3 : n2, p3 = d3 ? n2 : s3, m3 = d3 ? o3 : n2, h3 = d3 ? n2 : o3;
        t4 |= d3 ? S2 : ee2, t4 &= ~(d3 ? ee2 : S2), t4 & y2 || (t4 &= ~(_2 | v2));
        var g3 = [e4, t4, a3, m3, f3, h3, p3, c3, l3, u3], x3 = r3.apply(n2, g3);
        return vs(e4) && Ms(x3, g3), x3.placeholder = i3, Fs(x3, e4, t4);
      }
      function Ro(e4) {
        var t4 = Ot3[e4];
        return function(e5, n3) {
          if (e5 = $u(e5), n3 = n3 == null ? 0 : P3(Z(n3), 292), n3 && un3(e5)) {
            var r3 = (Q(e5) + `e`).split(`e`);
            return r3 = (Q(t4(r3[0] + `e` + (+r3[1] + n3))) + `e`).split(`e`), +(r3[0] + `e` + (+r3[1] - n3));
          }
          return t4(e5);
        };
      }
      var zo = wn3 && 1 / br(new wn3([, -0]))[1] == ue2 ? function(e4) {
        return new wn3(e4);
      } : Bf;
      function Bo(e4) {
        return function(t4) {
          var n3 = K(t4);
          return n3 == De2 ? _r(t4) : n3 == w2 ? xr(t4) : rr2(t4, e4(t4));
        };
      }
      function Vo(e4, t4, r3, i3, a3, s3, c3, l3) {
        var u3 = t4 & v2;
        if (!u3 && typeof e4 != `function`) throw new k3(o2);
        var d3 = i3 ? i3.length : 0;
        if (d3 || (t4 &= ~(S2 | ee2), i3 = a3 = n2), c3 = c3 === n2 ? c3 : j3(Z(c3), 0), l3 = l3 === n2 ? l3 : Z(l3), d3 -= a3 ? a3.length : 0, t4 & ee2) {
          var f3 = i3, p3 = a3;
          i3 = a3 = n2;
        }
        var m3 = u3 ? n2 : Zo(e4), h3 = [e4, t4, r3, i3, a3, f3, p3, s3, c3, l3];
        if (m3 && Ts(h3, m3), e4 = h3[0], t4 = h3[1], r3 = h3[2], i3 = h3[3], a3 = h3[4], l3 = h3[9] = h3[9] === n2 ? u3 ? 0 : e4.length : j3(h3[9] - d3, 0), !l3 && t4 & (b2 | x2) && (t4 &= ~(b2 | x2)), !t4 || t4 == _2) var g3 = So(e4, t4, r3);
        else g3 = t4 == b2 || t4 == x2 ? Eo(e4, t4, l3) : (t4 == S2 || t4 == (_2 | S2)) && !a3.length ? Po(e4, t4, r3, i3) : ko.apply(n2, h3);
        return Fs((m3 ? Pa : Ms)(g3, h3), e4, t4);
      }
      function Ho(e4, t4, r3, i3) {
        return e4 === n2 || fu(e4, Nt3[r3]) && !A3.call(i3, r3) ? t4 : e4;
      }
      function Uo(e4, t4, r3, i3, a3, o3) {
        return Y(e4) && Y(t4) && (o3.set(t4, e4), ya(e4, t4, n2, Uo, o3), o3.delete(t4)), e4;
      }
      function Wo(e4) {
        return Ru(e4) ? n2 : e4;
      }
      function Go(e4, t4, r3, i3, a3, o3) {
        var s3 = r3 & h2, c3 = e4.length, l3 = t4.length;
        if (c3 != l3 && !(s3 && l3 > c3)) return false;
        var u3 = o3.get(e4), d3 = o3.get(t4);
        if (u3 && d3) return u3 == t4 && d3 == e4;
        var f3 = -1, p3 = true, m3 = r3 & g2 ? new si() : n2;
        for (o3.set(e4, t4), o3.set(t4, e4); ++f3 < c3; ) {
          var _3 = e4[f3], v3 = t4[f3];
          if (i3) var y3 = s3 ? i3(v3, _3, f3, t4, e4, o3) : i3(_3, v3, f3, e4, t4, o3);
          if (y3 !== n2) {
            if (y3) continue;
            p3 = false;
            break;
          }
          if (m3) {
            if (!Vn2(t4, function(e5, t5) {
              if (!B2(m3, t5) && (_3 === e5 || a3(_3, e5, r3, i3, o3))) return m3.push(t5);
            })) {
              p3 = false;
              break;
            }
          } else if (!(_3 === v3 || a3(_3, v3, r3, i3, o3))) {
            p3 = false;
            break;
          }
        }
        return o3.delete(e4), o3.delete(t4), p3;
      }
      function Ko(e4, t4, n3, r3, i3, a3, o3) {
        switch (n3) {
          case Be2:
            if (e4.byteLength != t4.byteLength || e4.byteOffset != t4.byteOffset) return false;
            e4 = e4.buffer, t4 = t4.buffer;
          case ze2:
            return !(e4.byteLength != t4.byteLength || !a3(new Wt3(e4), new Wt3(t4)));
          case xe2:
          case Se2:
          case Oe2:
            return fu(+e4, +t4);
          case we2:
            return e4.name == t4.name && e4.message == t4.message;
          case Ne2:
          case Pe2:
            return e4 == t4 + ``;
          case De2:
            var s3 = _r;
          case w2:
            var c3 = r3 & h2;
            if (s3 ||= br, e4.size != t4.size && !c3) return false;
            var l3 = o3.get(e4);
            if (l3) return l3 == t4;
            r3 |= g2, o3.set(e4, t4);
            var u3 = Go(s3(e4), s3(t4), r3, i3, a3, o3);
            return o3.delete(e4), u3;
          case Fe2:
            if (Fr) return Fr.call(e4) == Fr.call(t4);
        }
        return false;
      }
      function qo(e4, t4, r3, i3, a3, o3) {
        var s3 = r3 & h2, c3 = Yo(e4), l3 = c3.length;
        if (l3 != Yo(t4).length && !s3) return false;
        for (var u3 = l3; u3--; ) {
          var d3 = c3[u3];
          if (!(s3 ? d3 in t4 : A3.call(t4, d3))) return false;
        }
        var f3 = o3.get(e4), p3 = o3.get(t4);
        if (f3 && p3) return f3 == t4 && p3 == e4;
        var m3 = true;
        o3.set(e4, t4), o3.set(t4, e4);
        for (var g3 = s3; ++u3 < l3; ) {
          d3 = c3[u3];
          var _3 = e4[d3], v3 = t4[d3];
          if (i3) var y3 = s3 ? i3(v3, _3, d3, t4, e4, o3) : i3(_3, v3, d3, e4, t4, o3);
          if (!(y3 === n2 ? _3 === v3 || a3(_3, v3, r3, i3, o3) : y3)) {
            m3 = false;
            break;
          }
          g3 ||= d3 == `constructor`;
        }
        if (m3 && !g3) {
          var b3 = e4.constructor, x3 = t4.constructor;
          b3 != x3 && `constructor` in e4 && `constructor` in t4 && !(typeof b3 == `function` && b3 instanceof b3 && typeof x3 == `function` && x3 instanceof x3) && (m3 = false);
        }
        return o3.delete(e4), o3.delete(t4), m3;
      }
      function Jo(e4) {
        return Ps(Os(e4, n2, nc), e4 + ``);
      }
      function Yo(e4) {
        return Ki(e4, $, is);
      }
      function Xo(e4) {
        return Ki(e4, wd, as);
      }
      var Zo = Un3 ? function(e4) {
        return Un3.get(e4);
      } : Bf;
      function Qo(e4) {
        for (var t4 = e4.name + ``, n3 = Qn3[t4], r3 = A3.call(Qn3, t4) ? n3.length : 0; r3--; ) {
          var i3 = n3[r3], a3 = i3.func;
          if (a3 == null || a3 == e4) return i3.name;
        }
        return t4;
      }
      function $o(e4) {
        return (A3.call(V, `placeholder`) ? V : e4).placeholder;
      }
      function G() {
        var e4 = V.iteratee || Nf;
        return e4 = e4 === Nf ? fa : e4, arguments.length ? e4(arguments[0], arguments[1]) : e4;
      }
      function es(e4, t4) {
        var n3 = e4.__data__;
        return _s(t4) ? n3[typeof t4 == `string` ? `string` : `hash`] : n3.map;
      }
      function ts(e4) {
        for (var t4 = $(e4), n3 = t4.length; n3--; ) {
          var r3 = t4[n3], i3 = e4[r3];
          t4[n3] = [r3, i3, Ss(i3)];
        }
        return t4;
      }
      function ns(e4, t4) {
        var r3 = pr(e4, t4);
        return ca(r3) ? r3 : n2;
      }
      function rs(e4) {
        var t4 = A3.call(e4, Qt3), r3 = e4[Qt3];
        try {
          e4[Qt3] = n2;
          var i3 = true;
        } catch {
        }
        var a3 = Rt3.call(e4);
        return i3 && (t4 ? e4[Qt3] = r3 : delete e4[Qt3]), a3;
      }
      var is = on3 ? function(e4) {
        return e4 == null ? [] : (e4 = O3(e4), Fn2(on3(e4), function(t4) {
          return Jt3.call(e4, t4);
        }));
      } : Yf, as = on3 ? function(e4) {
        for (var t4 = []; e4; ) Rn2(t4, is(e4)), e4 = Kt3(e4);
        return t4;
      } : Yf, K = qi;
      (bn3 && K(new bn3(new ArrayBuffer(1))) != Be2 || xn3 && K(new xn3()) != De2 || Sn3 && K(Sn3.resolve()) != je2 || wn3 && K(new wn3()) != w2 || L3 && K(new L3()) != Le2) && (K = function(e4) {
        var t4 = qi(e4), r3 = t4 == Ae2 ? e4.constructor : n2, i3 = r3 ? Bs(r3) : ``;
        if (i3) switch (i3) {
          case Sr2:
            return Be2;
          case Or2:
            return De2;
          case kr2:
            return je2;
          case Mr:
            return w2;
          case Nr:
            return Le2;
        }
        return t4;
      });
      function os(e4, t4, n3) {
        for (var r3 = -1, i3 = n3.length; ++r3 < i3; ) {
          var a3 = n3[r3], o3 = a3.size;
          switch (a3.type) {
            case `drop`:
              e4 += o3;
              break;
            case `dropRight`:
              t4 -= o3;
              break;
            case `take`:
              t4 = P3(t4, e4 + o3);
              break;
            case `takeRight`:
              e4 = j3(e4, t4 - o3);
              break;
          }
        }
        return { start: e4, end: t4 };
      }
      function ss(e4) {
        var t4 = e4.match(pt2);
        return t4 ? t4[1].split(mt2) : [];
      }
      function cs(e4, t4, n3) {
        t4 = $a(t4, e4);
        for (var r3 = -1, i3 = t4.length, a3 = false; ++r3 < i3; ) {
          var o3 = zs(t4[r3]);
          if (!(a3 = e4 != null && n3(e4, o3))) break;
          e4 = e4[o3];
        }
        return a3 || ++r3 != i3 ? a3 : (i3 = e4 == null ? 0 : e4.length, !!i3 && ku(i3) && ms(o3, i3) && (q(e4) || hu(e4)));
      }
      function ls(e4) {
        var t4 = e4.length, n3 = new e4.constructor(t4);
        return t4 && typeof e4[0] == `string` && A3.call(e4, `index`) && (n3.index = e4.index, n3.input = e4.input), n3;
      }
      function us(e4) {
        return typeof e4.constructor == `function` && !xs(e4) ? Lr(Kt3(e4)) : {};
      }
      function ds(e4, t4, n3) {
        var r3 = e4.constructor;
        switch (t4) {
          case ze2:
            return io(e4);
          case xe2:
          case Se2:
            return new r3(+e4);
          case Be2:
            return ao(e4, n3);
          case Ve2:
          case He2:
          case Ue2:
          case We2:
          case Ge2:
          case Ke2:
          case qe2:
          case Je2:
          case Ye2:
            return co(e4, n3);
          case De2:
            return new r3();
          case Oe2:
          case Pe2:
            return new r3(e4);
          case Ne2:
            return oo(e4);
          case w2:
            return new r3();
          case Fe2:
            return so(e4);
        }
      }
      function fs(e4, t4) {
        var n3 = t4.length;
        if (!n3) return e4;
        var r3 = n3 - 1;
        return t4[r3] = (n3 > 1 ? `& ` : ``) + t4[r3], t4 = t4.join(n3 > 2 ? `, ` : ` `), e4.replace(ft2, `{
/* [wrapped with ` + t4 + `] */
`);
      }
      function ps(e4) {
        return q(e4) || hu(e4) || !!(Xt3 && e4 && e4[Xt3]);
      }
      function ms(e4, t4) {
        var n3 = typeof e4;
        return t4 ??= de2, !!t4 && (n3 == `number` || n3 != `symbol` && St2.test(e4)) && e4 > -1 && e4 % 1 == 0 && e4 < t4;
      }
      function hs(e4, t4, n3) {
        if (!Y(n3)) return false;
        var r3 = typeof t4;
        return (r3 == `number` ? _u(n3) && ms(t4, n3.length) : r3 == `string` && t4 in n3) ? fu(n3[t4], e4) : false;
      }
      function gs(e4, t4) {
        if (q(e4)) return false;
        var n3 = typeof e4;
        return n3 == `number` || n3 == `symbol` || n3 == `boolean` || e4 == null || Uu(e4) ? true : st2.test(e4) || !ot2.test(e4) || t4 != null && e4 in O3(t4);
      }
      function _s(e4) {
        var t4 = typeof e4;
        return t4 == `string` || t4 == `number` || t4 == `symbol` || t4 == `boolean` ? e4 !== `__proto__` : e4 === null;
      }
      function vs(e4) {
        var t4 = Qo(e4), n3 = V[t4];
        if (typeof n3 != `function` || !(t4 in H.prototype)) return false;
        if (e4 === n3) return true;
        var r3 = Zo(n3);
        return !!r3 && e4 === r3[0];
      }
      function ys(e4) {
        return !!Lt3 && Lt3 in e4;
      }
      var bs = Pt3 ? Du : Xf;
      function xs(e4) {
        var t4 = e4 && e4.constructor;
        return e4 === (typeof t4 == `function` && t4.prototype || Nt3);
      }
      function Ss(e4) {
        return e4 === e4 && !Y(e4);
      }
      function Cs(e4, t4) {
        return function(r3) {
          return r3 == null ? false : r3[e4] === t4 && (t4 !== n2 || e4 in O3(r3));
        };
      }
      function ws(e4) {
        var t4 = Jl(e4, function(e5) {
          return n3.size === u2 && n3.clear(), e5;
        }), n3 = t4.cache;
        return t4;
      }
      function Ts(e4, t4) {
        var n3 = e4[1], r3 = t4[1], i3 = n3 | r3, a3 = i3 < (_2 | v2 | C2), o3 = r3 == C2 && n3 == b2 || r3 == C2 && n3 == te2 && e4[7].length <= t4[8] || r3 == (C2 | te2) && t4[7].length <= t4[8] && n3 == b2;
        if (!(a3 || o3)) return e4;
        r3 & _2 && (e4[2] = t4[2], i3 |= n3 & _2 ? 0 : y2);
        var s3 = t4[3];
        if (s3) {
          var c3 = e4[3];
          e4[3] = c3 ? fo(c3, s3, t4[4]) : s3, e4[4] = c3 ? yr(e4[3], d2) : t4[4];
        }
        return s3 = t4[5], s3 && (c3 = e4[5], e4[5] = c3 ? po(c3, s3, t4[6]) : s3, e4[6] = c3 ? yr(e4[5], d2) : t4[6]), s3 = t4[7], s3 && (e4[7] = s3), r3 & C2 && (e4[8] = e4[8] == null ? t4[8] : P3(e4[8], t4[8])), e4[9] ??= t4[9], e4[0] = t4[0], e4[1] = i3, e4;
      }
      function Es(e4) {
        var t4 = [];
        if (e4 != null) for (var n3 in O3(e4)) t4.push(n3);
        return t4;
      }
      function Ds(e4) {
        return Rt3.call(e4);
      }
      function Os(e4, t4, r3) {
        return t4 = j3(t4 === n2 ? e4.length - 1 : t4, 0), function() {
          for (var n3 = arguments, i3 = -1, a3 = j3(n3.length - t4, 0), o3 = T3(a3); ++i3 < a3; ) o3[i3] = n3[t4 + i3];
          i3 = -1;
          for (var s3 = T3(t4 + 1); ++i3 < t4; ) s3[i3] = n3[i3];
          return s3[t4] = r3(o3), R2(e4, this, s3);
        };
      }
      function ks(e4, t4) {
        return t4.length < 2 ? e4 : Gi(e4, La(t4, 0, -1));
      }
      function As(e4, t4) {
        for (var r3 = e4.length, i3 = P3(t4.length, r3), a3 = mo(e4); i3--; ) {
          var o3 = t4[i3];
          e4[i3] = ms(o3, r3) ? a3[o3] : n2;
        }
        return e4;
      }
      function js(e4, t4) {
        if (!(t4 === `constructor` && typeof e4[t4] == `function`) && t4 != `__proto__`) return e4[t4];
      }
      var Ms = Is(Pa), Ns = nn3 || function(e4, t4) {
        return I2.setTimeout(e4, t4);
      }, Ps = Is(Fa);
      function Fs(e4, t4, n3) {
        var r3 = t4 + ``;
        return Ps(e4, fs(r3, Vs(ss(r3), n3)));
      }
      function Is(e4) {
        var t4 = 0, r3 = 0;
        return function() {
          var i3 = hn3(), a3 = oe2 - (i3 - r3);
          if (r3 = i3, a3 > 0) {
            if (++t4 >= ae2) return arguments[0];
          } else t4 = 0;
          return e4.apply(n2, arguments);
        };
      }
      function Ls(e4, t4) {
        var r3 = -1, i3 = e4.length, a3 = i3 - 1;
        for (t4 = t4 === n2 ? i3 : t4; ++r3 < t4; ) {
          var o3 = Oa(r3, a3), s3 = e4[o3];
          e4[o3] = e4[r3], e4[r3] = s3;
        }
        return e4.length = t4, e4;
      }
      var Rs = ws(function(e4) {
        var t4 = [];
        return e4.charCodeAt(0) === 46 && t4.push(``), e4.replace(ct2, function(e5, n3, r3, i3) {
          t4.push(r3 ? i3.replace(_t2, `$1`) : n3 || e5);
        }), t4;
      });
      function zs(e4) {
        if (typeof e4 == `string` || Uu(e4)) return e4;
        var t4 = e4 + ``;
        return t4 == `0` && 1 / e4 == -ue2 ? `-0` : t4;
      }
      function Bs(e4) {
        if (e4 != null) {
          try {
            return Ft3.call(e4);
          } catch {
          }
          try {
            return e4 + ``;
          } catch {
          }
        }
        return ``;
      }
      function Vs(e4, t4) {
        return Mn2(_e2, function(n3) {
          var r3 = `_.` + n3[0];
          t4 & n3[1] && !In2(e4, r3) && e4.push(r3);
        }), e4.sort();
      }
      function Hs(e4) {
        if (e4 instanceof H) return e4.clone();
        var t4 = new zr(e4.__wrapped__, e4.__chain__);
        return t4.__actions__ = mo(e4.__actions__), t4.__index__ = e4.__index__, t4.__values__ = e4.__values__, t4;
      }
      function Us(e4, t4, r3) {
        t4 = (r3 ? hs(e4, t4, r3) : t4 === n2) ? 1 : j3(Z(t4), 0);
        var i3 = e4 == null ? 0 : e4.length;
        if (!i3 || t4 < 1) return [];
        for (var a3 = 0, o3 = 0, s3 = T3(rn3(i3 / t4)); a3 < i3; ) s3[o3++] = La(e4, a3, a3 += t4);
        return s3;
      }
      function Ws(e4) {
        for (var t4 = -1, n3 = e4 == null ? 0 : e4.length, r3 = 0, i3 = []; ++t4 < n3; ) {
          var a3 = e4[t4];
          a3 && (i3[r3++] = a3);
        }
        return i3;
      }
      function Gs() {
        var e4 = arguments.length;
        if (!e4) return [];
        for (var t4 = T3(e4 - 1), n3 = arguments[0], r3 = e4; r3--; ) t4[r3 - 1] = arguments[r3];
        return Rn2(q(n3) ? mo(n3) : [n3], U(t4, 1));
      }
      var Ks = W(function(e4, t4) {
        return J(e4) ? Ni(e4, U(t4, 1, J, true)) : [];
      }), qs = W(function(e4, t4) {
        var r3 = pc(t4);
        return J(r3) && (r3 = n2), J(e4) ? Ni(e4, U(t4, 1, J, true), G(r3, 2)) : [];
      }), Js = W(function(e4, t4) {
        var r3 = pc(t4);
        return J(r3) && (r3 = n2), J(e4) ? Ni(e4, U(t4, 1, J, true), n2, r3) : [];
      });
      function Ys(e4, t4, r3) {
        var i3 = e4 == null ? 0 : e4.length;
        return i3 ? (t4 = r3 || t4 === n2 ? 1 : Z(t4), La(e4, t4 < 0 ? 0 : t4, i3)) : [];
      }
      function Xs(e4, t4, r3) {
        var i3 = e4 == null ? 0 : e4.length;
        return i3 ? (t4 = r3 || t4 === n2 ? 1 : Z(t4), t4 = i3 - t4, La(e4, 0, t4 < 0 ? 0 : t4)) : [];
      }
      function Zs(e4, t4) {
        return e4 && e4.length ? qa(e4, G(t4, 3), true, true) : [];
      }
      function Qs(e4, t4) {
        return e4 && e4.length ? qa(e4, G(t4, 3), true) : [];
      }
      function $s(e4, t4, n3, r3) {
        var i3 = e4 == null ? 0 : e4.length;
        return i3 ? (n3 && typeof n3 != `number` && hs(e4, t4, n3) && (n3 = 0, r3 = i3), Ri(e4, t4, n3, r3)) : [];
      }
      function ec(e4, t4, n3) {
        var r3 = e4 == null ? 0 : e4.length;
        if (!r3) return -1;
        var i3 = n3 == null ? 0 : Z(n3);
        return i3 < 0 && (i3 = j3(r3 + i3, 0)), Kn2(e4, G(t4, 3), i3);
      }
      function tc(e4, t4, r3) {
        var i3 = e4 == null ? 0 : e4.length;
        if (!i3) return -1;
        var a3 = i3 - 1;
        return r3 !== n2 && (a3 = Z(r3), a3 = r3 < 0 ? j3(i3 + a3, 0) : P3(a3, i3 - 1)), Kn2(e4, G(t4, 3), a3, true);
      }
      function nc(e4) {
        return e4 != null && e4.length ? U(e4, 1) : [];
      }
      function rc(e4) {
        return e4 != null && e4.length ? U(e4, ue2) : [];
      }
      function ic(e4, t4) {
        return e4 != null && e4.length ? (t4 = t4 === n2 ? 1 : Z(t4), U(e4, t4)) : [];
      }
      function ac(e4) {
        for (var t4 = -1, n3 = e4 == null ? 0 : e4.length, r3 = {}; ++t4 < n3; ) {
          var i3 = e4[t4];
          Ei(r3, i3[0], i3[1]);
        }
        return r3;
      }
      function oc(e4) {
        return e4 && e4.length ? e4[0] : n2;
      }
      function sc(e4, t4, n3) {
        var r3 = e4 == null ? 0 : e4.length;
        if (!r3) return -1;
        var i3 = n3 == null ? 0 : Z(n3);
        return i3 < 0 && (i3 = j3(r3 + i3, 0)), qn2(e4, t4, i3);
      }
      function cc(e4) {
        return e4 != null && e4.length ? La(e4, 0, -1) : [];
      }
      var lc = W(function(e4) {
        var t4 = z2(e4, Za);
        return t4.length && t4[0] === e4[0] ? Qi(t4) : [];
      }), uc = W(function(e4) {
        var t4 = pc(e4), r3 = z2(e4, Za);
        return t4 === pc(r3) ? t4 = n2 : r3.pop(), r3.length && r3[0] === e4[0] ? Qi(r3, G(t4, 2)) : [];
      }), dc = W(function(e4) {
        var t4 = pc(e4), r3 = z2(e4, Za);
        return t4 = typeof t4 == `function` ? t4 : n2, t4 && r3.pop(), r3.length && r3[0] === e4[0] ? Qi(r3, n2, t4) : [];
      });
      function fc(e4, t4) {
        return e4 == null ? `` : dn3.call(e4, t4);
      }
      function pc(e4) {
        var t4 = e4 == null ? 0 : e4.length;
        return t4 ? e4[t4 - 1] : n2;
      }
      function mc(e4, t4, r3) {
        var i3 = e4 == null ? 0 : e4.length;
        if (!i3) return -1;
        var a3 = i3;
        return r3 !== n2 && (a3 = Z(r3), a3 = a3 < 0 ? j3(i3 + a3, 0) : P3(a3, i3 - 1)), t4 === t4 ? Cr(e4, t4, a3) : Kn2(e4, Yn2, a3, true);
      }
      function hc(e4, t4) {
        return e4 && e4.length ? xa(e4, Z(t4)) : n2;
      }
      var gc = W(_c);
      function _c(e4, t4) {
        return e4 && e4.length && t4 && t4.length ? Ea(e4, t4) : e4;
      }
      function vc(e4, t4, n3) {
        return e4 && e4.length && t4 && t4.length ? Ea(e4, t4, G(n3, 2)) : e4;
      }
      function yc(e4, t4, r3) {
        return e4 && e4.length && t4 && t4.length ? Ea(e4, t4, n2, r3) : e4;
      }
      var bc = Jo(function(e4, t4) {
        var n3 = e4 == null ? 0 : e4.length, r3 = Di(e4, t4);
        return Da(e4, z2(t4, function(e5) {
          return ms(e5, n3) ? +e5 : e5;
        }).sort(lo)), r3;
      });
      function xc(e4, t4) {
        var n3 = [];
        if (!(e4 && e4.length)) return n3;
        var r3 = -1, i3 = [], a3 = e4.length;
        for (t4 = G(t4, 3); ++r3 < a3; ) {
          var o3 = e4[r3];
          t4(o3, r3, e4) && (n3.push(o3), i3.push(r3));
        }
        return Da(e4, i3), n3;
      }
      function Sc(e4) {
        return e4 == null ? e4 : yn3.call(e4);
      }
      function Cc(e4, t4, r3) {
        var i3 = e4 == null ? 0 : e4.length;
        return i3 ? (r3 && typeof r3 != `number` && hs(e4, t4, r3) ? (t4 = 0, r3 = i3) : (t4 = t4 == null ? 0 : Z(t4), r3 = r3 === n2 ? i3 : Z(r3)), La(e4, t4, r3)) : [];
      }
      function wc(e4, t4) {
        return za(e4, t4);
      }
      function Tc(e4, t4, n3) {
        return Ba(e4, t4, G(n3, 2));
      }
      function Ec(e4, t4) {
        var n3 = e4 == null ? 0 : e4.length;
        if (n3) {
          var r3 = za(e4, t4);
          if (r3 < n3 && fu(e4[r3], t4)) return r3;
        }
        return -1;
      }
      function Dc(e4, t4) {
        return za(e4, t4, true);
      }
      function Oc(e4, t4, n3) {
        return Ba(e4, t4, G(n3, 2), true);
      }
      function kc(e4, t4) {
        if (e4 != null && e4.length) {
          var n3 = za(e4, t4, true) - 1;
          if (fu(e4[n3], t4)) return n3;
        }
        return -1;
      }
      function Ac(e4) {
        return e4 && e4.length ? Va(e4) : [];
      }
      function jc(e4, t4) {
        return e4 && e4.length ? Va(e4, G(t4, 2)) : [];
      }
      function Mc(e4) {
        var t4 = e4 == null ? 0 : e4.length;
        return t4 ? La(e4, 1, t4) : [];
      }
      function Nc(e4, t4, r3) {
        return e4 && e4.length ? (t4 = r3 || t4 === n2 ? 1 : Z(t4), La(e4, 0, t4 < 0 ? 0 : t4)) : [];
      }
      function Pc(e4, t4, r3) {
        var i3 = e4 == null ? 0 : e4.length;
        return i3 ? (t4 = r3 || t4 === n2 ? 1 : Z(t4), t4 = i3 - t4, La(e4, t4 < 0 ? 0 : t4, i3)) : [];
      }
      function Fc(e4, t4) {
        return e4 && e4.length ? qa(e4, G(t4, 3), false, true) : [];
      }
      function Ic(e4, t4) {
        return e4 && e4.length ? qa(e4, G(t4, 3)) : [];
      }
      var Lc = W(function(e4) {
        return Wa(U(e4, 1, J, true));
      }), Rc = W(function(e4) {
        var t4 = pc(e4);
        return J(t4) && (t4 = n2), Wa(U(e4, 1, J, true), G(t4, 2));
      }), zc = W(function(e4) {
        var t4 = pc(e4);
        return t4 = typeof t4 == `function` ? t4 : n2, Wa(U(e4, 1, J, true), n2, t4);
      });
      function Bc(e4) {
        return e4 && e4.length ? Wa(e4) : [];
      }
      function Vc(e4, t4) {
        return e4 && e4.length ? Wa(e4, G(t4, 2)) : [];
      }
      function Hc(e4, t4) {
        return t4 = typeof t4 == `function` ? t4 : n2, e4 && e4.length ? Wa(e4, n2, t4) : [];
      }
      function Uc(e4) {
        if (!(e4 && e4.length)) return [];
        var t4 = 0;
        return e4 = Fn2(e4, function(e5) {
          if (J(e5)) return t4 = j3(e5.length, t4), true;
        }), nr2(t4, function(t5) {
          return z2(e4, Zn2(t5));
        });
      }
      function Wc(e4, t4) {
        if (!(e4 && e4.length)) return [];
        var r3 = Uc(e4);
        return t4 == null ? r3 : z2(r3, function(e5) {
          return R2(t4, n2, e5);
        });
      }
      var Gc = W(function(e4, t4) {
        return J(e4) ? Ni(e4, t4) : [];
      }), Kc = W(function(e4) {
        return Ya(Fn2(e4, J));
      }), qc = W(function(e4) {
        var t4 = pc(e4);
        return J(t4) && (t4 = n2), Ya(Fn2(e4, J), G(t4, 2));
      }), Jc = W(function(e4) {
        var t4 = pc(e4);
        return t4 = typeof t4 == `function` ? t4 : n2, Ya(Fn2(e4, J), n2, t4);
      }), Yc = W(Uc);
      function Xc(e4, t4) {
        return Xa(e4 || [], t4 || [], xi);
      }
      function Zc(e4, t4) {
        return Xa(e4 || [], t4 || [], Na);
      }
      var Qc = W(function(e4) {
        var t4 = e4.length, r3 = t4 > 1 ? e4[t4 - 1] : n2;
        return r3 = typeof r3 == `function` ? (e4.pop(), r3) : n2, Wc(e4, r3);
      });
      function $c(e4) {
        var t4 = V(e4);
        return t4.__chain__ = true, t4;
      }
      function el(e4, t4) {
        return t4(e4), e4;
      }
      function tl(e4, t4) {
        return t4(e4);
      }
      var nl = Jo(function(e4) {
        var t4 = e4.length, r3 = t4 ? e4[0] : 0, i3 = this.__wrapped__, a3 = function(t5) {
          return Di(t5, e4);
        };
        return t4 > 1 || this.__actions__.length || !(i3 instanceof H) || !ms(r3) ? this.thru(a3) : (i3 = i3.slice(r3, +r3 + +!!t4), i3.__actions__.push({ func: tl, args: [a3], thisArg: n2 }), new zr(i3, this.__chain__).thru(function(e5) {
          return t4 && !e5.length && e5.push(n2), e5;
        }));
      });
      function rl() {
        return $c(this);
      }
      function il() {
        return new zr(this.value(), this.__chain__);
      }
      function al() {
        this.__values__ === n2 && (this.__values__ = Xu(this.value()));
        var e4 = this.__index__ >= this.__values__.length;
        return { done: e4, value: e4 ? n2 : this.__values__[this.__index__++] };
      }
      function ol() {
        return this;
      }
      function sl(e4) {
        for (var t4, r3 = this; r3 instanceof Rr; ) {
          var i3 = Hs(r3);
          i3.__index__ = 0, i3.__values__ = n2, t4 ? a3.__wrapped__ = i3 : t4 = i3;
          var a3 = i3;
          r3 = r3.__wrapped__;
        }
        return a3.__wrapped__ = e4, t4;
      }
      function cl() {
        var e4 = this.__wrapped__;
        if (e4 instanceof H) {
          var t4 = e4;
          return this.__actions__.length && (t4 = new H(this)), t4 = t4.reverse(), t4.__actions__.push({ func: tl, args: [Sc], thisArg: n2 }), new zr(t4, this.__chain__);
        }
        return this.thru(Sc);
      }
      function ll() {
        return Ja(this.__wrapped__, this.__actions__);
      }
      var ul = vo(function(e4, t4, n3) {
        A3.call(e4, n3) ? ++e4[n3] : Ei(e4, n3, 1);
      });
      function dl(e4, t4, r3) {
        var i3 = q(e4) ? Pn2 : Ii;
        return r3 && hs(e4, t4, r3) && (t4 = n2), i3(e4, G(t4, 3));
      }
      function fl(e4, t4) {
        return (q(e4) ? Fn2 : zi)(e4, G(t4, 3));
      }
      var pl = Do(ec), ml = Do(tc);
      function hl(e4, t4) {
        return U(wl(e4, t4), 1);
      }
      function gl(e4, t4) {
        return U(wl(e4, t4), ue2);
      }
      function _l(e4, t4, r3) {
        return r3 = r3 === n2 ? 1 : Z(r3), U(wl(e4, t4), r3);
      }
      function vl(e4, t4) {
        return (q(e4) ? Mn2 : Pi)(e4, G(t4, 3));
      }
      function yl(e4, t4) {
        return (q(e4) ? Nn2 : Fi)(e4, G(t4, 3));
      }
      var bl = vo(function(e4, t4, n3) {
        A3.call(e4, n3) ? e4[n3].push(t4) : Ei(e4, n3, [t4]);
      });
      function xl(e4, t4, n3, r3) {
        e4 = _u(e4) ? e4 : Hd(e4), n3 = n3 && !r3 ? Z(n3) : 0;
        var i3 = e4.length;
        return n3 < 0 && (n3 = j3(i3 + n3, 0)), Hu(e4) ? n3 <= i3 && e4.indexOf(t4, n3) > -1 : !!i3 && qn2(e4, t4, n3) > -1;
      }
      var Sl = W(function(e4, t4, n3) {
        var r3 = -1, i3 = typeof t4 == `function`, a3 = _u(e4) ? T3(e4.length) : [];
        return Pi(e4, function(e5) {
          a3[++r3] = i3 ? R2(t4, e5, n3) : ea(e5, t4, n3);
        }), a3;
      }), Cl = vo(function(e4, t4, n3) {
        Ei(e4, n3, t4);
      });
      function wl(e4, t4) {
        return (q(e4) ? z2 : ga)(e4, G(t4, 3));
      }
      function Tl(e4, t4, r3, i3) {
        return e4 == null ? [] : (q(t4) || (t4 = t4 == null ? [] : [t4]), r3 = i3 ? n2 : r3, q(r3) || (r3 = r3 == null ? [] : [r3]), Sa(e4, t4, r3));
      }
      var El = vo(function(e4, t4, n3) {
        e4[+!n3].push(t4);
      }, function() {
        return [[], []];
      });
      function Dl(e4, t4, n3) {
        var r3 = q(e4) ? zn2 : $n2, i3 = arguments.length < 3;
        return r3(e4, G(t4, 4), n3, i3, Pi);
      }
      function Ol(e4, t4, n3) {
        var r3 = q(e4) ? Bn2 : $n2, i3 = arguments.length < 3;
        return r3(e4, G(t4, 4), n3, i3, Fi);
      }
      function kl(e4, t4) {
        return (q(e4) ? Fn2 : zi)(e4, Yl(G(t4, 3)));
      }
      function Al(e4) {
        return (q(e4) ? _i : ja)(e4);
      }
      function jl(e4, t4, r3) {
        return t4 = (r3 ? hs(e4, t4, r3) : t4 === n2) ? 1 : Z(t4), (q(e4) ? vi : Ma)(e4, t4);
      }
      function Ml(e4) {
        return (q(e4) ? yi : Ia)(e4);
      }
      function Nl(e4) {
        if (e4 == null) return 0;
        if (_u(e4)) return Hu(e4) ? wr(e4) : e4.length;
        var t4 = K(e4);
        return t4 == De2 || t4 == w2 ? e4.size : pa(e4).length;
      }
      function Pl(e4, t4, r3) {
        var i3 = q(e4) ? Vn2 : Ra;
        return r3 && hs(e4, t4, r3) && (t4 = n2), i3(e4, G(t4, 3));
      }
      var Fl = W(function(e4, t4) {
        if (e4 == null) return [];
        var n3 = t4.length;
        return n3 > 1 && hs(e4, t4[0], t4[1]) ? t4 = [] : n3 > 2 && hs(t4[0], t4[1], t4[2]) && (t4 = [t4[0]]), Sa(e4, U(t4, 1), []);
      }), Il = tn3 || function() {
        return I2.Date.now();
      };
      function Ll(e4, t4) {
        if (typeof t4 != `function`) throw new k3(o2);
        return e4 = Z(e4), function() {
          if (--e4 < 1) return t4.apply(this, arguments);
        };
      }
      function Rl(e4, t4, r3) {
        return t4 = r3 ? n2 : t4, t4 = e4 && t4 == null ? e4.length : t4, Vo(e4, C2, n2, n2, n2, n2, t4);
      }
      function zl(e4, t4) {
        var r3;
        if (typeof t4 != `function`) throw new k3(o2);
        return e4 = Z(e4), function() {
          return --e4 > 0 && (r3 = t4.apply(this, arguments)), e4 <= 1 && (t4 = n2), r3;
        };
      }
      var Bl = W(function(e4, t4, n3) {
        var r3 = _2;
        if (n3.length) {
          var i3 = yr(n3, $o(Bl));
          r3 |= S2;
        }
        return Vo(e4, r3, t4, n3, i3);
      }), Vl = W(function(e4, t4, n3) {
        var r3 = _2 | v2;
        if (n3.length) {
          var i3 = yr(n3, $o(Vl));
          r3 |= S2;
        }
        return Vo(t4, r3, e4, n3, i3);
      });
      function Hl(e4, t4, r3) {
        t4 = r3 ? n2 : t4;
        var i3 = Vo(e4, b2, n2, n2, n2, n2, n2, t4);
        return i3.placeholder = Hl.placeholder, i3;
      }
      function Ul(e4, t4, r3) {
        t4 = r3 ? n2 : t4;
        var i3 = Vo(e4, x2, n2, n2, n2, n2, n2, t4);
        return i3.placeholder = Ul.placeholder, i3;
      }
      function Wl(e4, t4, r3) {
        var i3, a3, s3, c3, l3, u3, d3 = 0, f3 = false, p3 = false, m3 = true;
        if (typeof e4 != `function`) throw new k3(o2);
        t4 = $u(t4) || 0, Y(r3) && (f3 = !!r3.leading, p3 = `maxWait` in r3, s3 = p3 ? j3($u(r3.maxWait) || 0, t4) : s3, m3 = `trailing` in r3 ? !!r3.trailing : m3);
        function h3(t5) {
          var r4 = i3, o3 = a3;
          return i3 = a3 = n2, d3 = t5, c3 = e4.apply(o3, r4), c3;
        }
        function g3(e5) {
          return d3 = e5, l3 = Ns(y3, t4), f3 ? h3(e5) : c3;
        }
        function _3(e5) {
          var n3 = e5 - u3, r4 = e5 - d3, i4 = t4 - n3;
          return p3 ? P3(i4, s3 - r4) : i4;
        }
        function v3(e5) {
          var r4 = e5 - u3, i4 = e5 - d3;
          return u3 === n2 || r4 >= t4 || r4 < 0 || p3 && i4 >= s3;
        }
        function y3() {
          var e5 = Il();
          if (v3(e5)) return b3(e5);
          l3 = Ns(y3, _3(e5));
        }
        function b3(e5) {
          return l3 = n2, m3 && i3 ? h3(e5) : (i3 = a3 = n2, c3);
        }
        function x3() {
          l3 !== n2 && no(l3), d3 = 0, i3 = u3 = a3 = l3 = n2;
        }
        function S3() {
          return l3 === n2 ? c3 : b3(Il());
        }
        function ee3() {
          var e5 = Il(), r4 = v3(e5);
          if (i3 = arguments, a3 = this, u3 = e5, r4) {
            if (l3 === n2) return g3(u3);
            if (p3) return no(l3), l3 = Ns(y3, t4), h3(u3);
          }
          return l3 === n2 && (l3 = Ns(y3, t4)), c3;
        }
        return ee3.cancel = x3, ee3.flush = S3, ee3;
      }
      var Gl = W(function(e4, t4) {
        return Mi(e4, 1, t4);
      }), Kl = W(function(e4, t4, n3) {
        return Mi(e4, $u(t4) || 0, n3);
      });
      function ql(e4) {
        return Vo(e4, ne2);
      }
      function Jl(e4, t4) {
        if (typeof e4 != `function` || t4 != null && typeof t4 != `function`) throw new k3(o2);
        var n3 = function() {
          var r3 = arguments, i3 = t4 ? t4.apply(this, r3) : r3[0], a3 = n3.cache;
          if (a3.has(i3)) return a3.get(i3);
          var o3 = e4.apply(this, r3);
          return n3.cache = a3.set(i3, o3) || a3, o3;
        };
        return n3.cache = new (Jl.Cache || ti)(), n3;
      }
      Jl.Cache = ti;
      function Yl(e4) {
        if (typeof e4 != `function`) throw new k3(o2);
        return function() {
          var t4 = arguments;
          switch (t4.length) {
            case 0:
              return !e4.call(this);
            case 1:
              return !e4.call(this, t4[0]);
            case 2:
              return !e4.call(this, t4[0], t4[1]);
            case 3:
              return !e4.call(this, t4[0], t4[1], t4[2]);
          }
          return !e4.apply(this, t4);
        };
      }
      function Xl(e4) {
        return zl(2, e4);
      }
      var Zl = eo(function(e4, t4) {
        t4 = t4.length == 1 && q(t4[0]) ? z2(t4[0], ar2(G())) : z2(U(t4, 1), ar2(G()));
        var n3 = t4.length;
        return W(function(r3) {
          for (var i3 = -1, a3 = P3(r3.length, n3); ++i3 < a3; ) r3[i3] = t4[i3].call(this, r3[i3]);
          return R2(e4, this, r3);
        });
      }), Ql = W(function(e4, t4) {
        return Vo(e4, S2, n2, t4, yr(t4, $o(Ql)));
      }), $l = W(function(e4, t4) {
        return Vo(e4, ee2, n2, t4, yr(t4, $o($l)));
      }), eu = Jo(function(e4, t4) {
        return Vo(e4, te2, n2, n2, n2, t4);
      });
      function tu(e4, t4) {
        if (typeof e4 != `function`) throw new k3(o2);
        return t4 = t4 === n2 ? t4 : Z(t4), W(e4, t4);
      }
      function nu(e4, t4) {
        if (typeof e4 != `function`) throw new k3(o2);
        return t4 = t4 == null ? 0 : j3(Z(t4), 0), W(function(n3) {
          var r3 = n3[t4], i3 = to(n3, 0, t4);
          return r3 && Rn2(i3, r3), R2(e4, this, i3);
        });
      }
      function ru(e4, t4, n3) {
        var r3 = true, i3 = true;
        if (typeof e4 != `function`) throw new k3(o2);
        return Y(n3) && (r3 = `leading` in n3 ? !!n3.leading : r3, i3 = `trailing` in n3 ? !!n3.trailing : i3), Wl(e4, t4, { leading: r3, maxWait: t4, trailing: i3 });
      }
      function iu(e4) {
        return Rl(e4, 1);
      }
      function au(e4, t4) {
        return Ql(Qa(t4), e4);
      }
      function ou() {
        if (!arguments.length) return [];
        var e4 = arguments[0];
        return q(e4) ? e4 : [e4];
      }
      function su(e4) {
        return ki(e4, m2);
      }
      function cu(e4, t4) {
        return t4 = typeof t4 == `function` ? t4 : n2, ki(e4, m2, t4);
      }
      function lu(e4) {
        return ki(e4, f2 | m2);
      }
      function uu(e4, t4) {
        return t4 = typeof t4 == `function` ? t4 : n2, ki(e4, f2 | m2, t4);
      }
      function du(e4, t4) {
        return t4 == null || ji(e4, t4, $(t4));
      }
      function fu(e4, t4) {
        return e4 === t4 || e4 !== e4 && t4 !== t4;
      }
      var pu = Io(Ji), mu = Io(function(e4, t4) {
        return e4 >= t4;
      }), hu = ta(/* @__PURE__ */ (function() {
        return arguments;
      })()) ? ta : function(e4) {
        return X(e4) && A3.call(e4, `callee`) && !Jt3.call(e4, `callee`);
      }, q = T3.isArray, gu = Tn2 ? ar2(Tn2) : na;
      function _u(e4) {
        return e4 != null && ku(e4.length) && !Du(e4);
      }
      function J(e4) {
        return X(e4) && _u(e4);
      }
      function vu(e4) {
        return e4 === true || e4 === false || X(e4) && qi(e4) == xe2;
      }
      var yu = sn3 || Xf, bu = En2 ? ar2(En2) : ra;
      function xu(e4) {
        return X(e4) && e4.nodeType === 1 && !Ru(e4);
      }
      function Su(e4) {
        if (e4 == null) return true;
        if (_u(e4) && (q(e4) || typeof e4 == `string` || typeof e4.splice == `function` || yu(e4) || Wu(e4) || hu(e4))) return !e4.length;
        var t4 = K(e4);
        if (t4 == De2 || t4 == w2) return !e4.size;
        if (xs(e4)) return !pa(e4).length;
        for (var n3 in e4) if (A3.call(e4, n3)) return false;
        return true;
      }
      function Cu(e4, t4) {
        return ia(e4, t4);
      }
      function wu(e4, t4, r3) {
        r3 = typeof r3 == `function` ? r3 : n2;
        var i3 = r3 ? r3(e4, t4) : n2;
        return i3 === n2 ? ia(e4, t4, n2, r3) : !!i3;
      }
      function Tu(e4) {
        if (!X(e4)) return false;
        var t4 = qi(e4);
        return t4 == we2 || t4 == Ce2 || typeof e4.message == `string` && typeof e4.name == `string` && !Ru(e4);
      }
      function Eu(e4) {
        return typeof e4 == `number` && un3(e4);
      }
      function Du(e4) {
        if (!Y(e4)) return false;
        var t4 = qi(e4);
        return t4 == Te2 || t4 == Ee2 || t4 == be2 || t4 == Me2;
      }
      function Ou(e4) {
        return typeof e4 == `number` && e4 == Z(e4);
      }
      function ku(e4) {
        return typeof e4 == `number` && e4 > -1 && e4 % 1 == 0 && e4 <= de2;
      }
      function Y(e4) {
        var t4 = typeof e4;
        return e4 != null && (t4 == `object` || t4 == `function`);
      }
      function X(e4) {
        return typeof e4 == `object` && !!e4;
      }
      var Au = Dn2 ? ar2(Dn2) : oa;
      function ju(e4, t4) {
        return e4 === t4 || sa(e4, t4, ts(t4));
      }
      function Mu(e4, t4, r3) {
        return r3 = typeof r3 == `function` ? r3 : n2, sa(e4, t4, ts(t4), r3);
      }
      function Nu(e4) {
        return Lu(e4) && e4 != +e4;
      }
      function Pu(e4) {
        if (bs(e4)) throw new Et3(a2);
        return ca(e4);
      }
      function Fu(e4) {
        return e4 === null;
      }
      function Iu(e4) {
        return e4 == null;
      }
      function Lu(e4) {
        return typeof e4 == `number` || X(e4) && qi(e4) == Oe2;
      }
      function Ru(e4) {
        if (!X(e4) || qi(e4) != Ae2) return false;
        var t4 = Kt3(e4);
        if (t4 === null) return true;
        var n3 = A3.call(t4, `constructor`) && t4.constructor;
        return typeof n3 == `function` && n3 instanceof n3 && Ft3.call(n3) == zt3;
      }
      var zu = On2 ? ar2(On2) : la;
      function Bu(e4) {
        return Ou(e4) && e4 >= -de2 && e4 <= de2;
      }
      var Vu = kn2 ? ar2(kn2) : ua;
      function Hu(e4) {
        return typeof e4 == `string` || !q(e4) && X(e4) && qi(e4) == Pe2;
      }
      function Uu(e4) {
        return typeof e4 == `symbol` || X(e4) && qi(e4) == Fe2;
      }
      var Wu = An2 ? ar2(An2) : da;
      function Gu(e4) {
        return e4 === n2;
      }
      function Ku(e4) {
        return X(e4) && K(e4) == Le2;
      }
      function qu(e4) {
        return X(e4) && qi(e4) == Re2;
      }
      var Ju = Io(ha), Yu = Io(function(e4, t4) {
        return e4 <= t4;
      });
      function Xu(e4) {
        if (!e4) return [];
        if (_u(e4)) return Hu(e4) ? Tr(e4) : mo(e4);
        if (Zt3 && e4[Zt3]) return gr(e4[Zt3]());
        var t4 = K(e4);
        return (t4 == De2 ? _r : t4 == w2 ? br : Hd)(e4);
      }
      function Zu(e4) {
        return e4 ? (e4 = $u(e4), e4 === ue2 || e4 === -ue2 ? (e4 < 0 ? -1 : 1) * fe2 : e4 === e4 ? e4 : 0) : e4 === 0 ? e4 : 0;
      }
      function Z(e4) {
        var t4 = Zu(e4), n3 = t4 % 1;
        return t4 === t4 ? n3 ? t4 - n3 : t4 : 0;
      }
      function Qu(e4) {
        return e4 ? Oi(Z(e4), 0, me2) : 0;
      }
      function $u(e4) {
        if (typeof e4 == `number`) return e4;
        if (Uu(e4)) return pe2;
        if (Y(e4)) {
          var t4 = typeof e4.valueOf == `function` ? e4.valueOf() : e4;
          e4 = Y(t4) ? t4 + `` : t4;
        }
        if (typeof e4 != `string`) return e4 === 0 ? e4 : +e4;
        e4 = ir2(e4);
        var n3 = E2.test(e4);
        return n3 || xt2.test(e4) ? F2(e4.slice(2), n3 ? 2 : 8) : bt2.test(e4) ? pe2 : +e4;
      }
      function ed(e4) {
        return ho(e4, wd(e4));
      }
      function td(e4) {
        return e4 ? Oi(Z(e4), -de2, de2) : e4 === 0 ? e4 : 0;
      }
      function Q(e4) {
        return e4 == null ? `` : Ua(e4);
      }
      var nd = yo(function(e4, t4) {
        if (xs(t4) || _u(t4)) {
          ho(t4, $(t4), e4);
          return;
        }
        for (var n3 in t4) A3.call(t4, n3) && xi(e4, n3, t4[n3]);
      }), rd = yo(function(e4, t4) {
        ho(t4, wd(t4), e4);
      }), id = yo(function(e4, t4, n3, r3) {
        ho(t4, wd(t4), e4, r3);
      }), ad = yo(function(e4, t4, n3, r3) {
        ho(t4, $(t4), e4, r3);
      }), od = Jo(Di);
      function sd(e4, t4) {
        var n3 = Lr(e4);
        return t4 == null ? n3 : wi(n3, t4);
      }
      var cd = W(function(e4, t4) {
        e4 = O3(e4);
        var r3 = -1, i3 = t4.length, a3 = i3 > 2 ? t4[2] : n2;
        for (a3 && hs(t4[0], t4[1], a3) && (i3 = 1); ++r3 < i3; ) for (var o3 = t4[r3], s3 = wd(o3), c3 = -1, l3 = s3.length; ++c3 < l3; ) {
          var u3 = s3[c3], d3 = e4[u3];
          (d3 === n2 || fu(d3, Nt3[u3]) && !A3.call(e4, u3)) && (e4[u3] = o3[u3]);
        }
        return e4;
      }), ld = W(function(e4) {
        return e4.push(n2, Uo), R2(Od, n2, e4);
      });
      function ud(e4, t4) {
        return Gn2(e4, G(t4, 3), Hi);
      }
      function dd(e4, t4) {
        return Gn2(e4, G(t4, 3), Ui);
      }
      function fd(e4, t4) {
        return e4 == null ? e4 : Bi(e4, G(t4, 3), wd);
      }
      function pd(e4, t4) {
        return e4 == null ? e4 : Vi(e4, G(t4, 3), wd);
      }
      function md(e4, t4) {
        return e4 && Hi(e4, G(t4, 3));
      }
      function hd(e4, t4) {
        return e4 && Ui(e4, G(t4, 3));
      }
      function gd(e4) {
        return e4 == null ? [] : Wi(e4, $(e4));
      }
      function _d(e4) {
        return e4 == null ? [] : Wi(e4, wd(e4));
      }
      function vd(e4, t4, r3) {
        var i3 = e4 == null ? n2 : Gi(e4, t4);
        return i3 === n2 ? r3 : i3;
      }
      function yd(e4, t4) {
        return e4 != null && cs(e4, t4, Yi);
      }
      function bd(e4, t4) {
        return e4 != null && cs(e4, t4, Xi);
      }
      var xd = Ao(function(e4, t4, n3) {
        t4 != null && typeof t4.toString != `function` && (t4 = Rt3.call(t4)), e4[t4] = n3;
      }, Of(Mf)), Sd = Ao(function(e4, t4, n3) {
        t4 != null && typeof t4.toString != `function` && (t4 = Rt3.call(t4)), A3.call(e4, t4) ? e4[t4].push(n3) : e4[t4] = [n3];
      }, G), Cd = W(ea);
      function $(e4) {
        return _u(e4) ? gi(e4) : pa(e4);
      }
      function wd(e4) {
        return _u(e4) ? gi(e4, true) : ma(e4);
      }
      function Td(e4, t4) {
        var n3 = {};
        return t4 = G(t4, 3), Hi(e4, function(e5, r3, i3) {
          Ei(n3, t4(e5, r3, i3), e5);
        }), n3;
      }
      function Ed(e4, t4) {
        var n3 = {};
        return t4 = G(t4, 3), Hi(e4, function(e5, r3, i3) {
          Ei(n3, r3, t4(e5, r3, i3));
        }), n3;
      }
      var Dd = yo(function(e4, t4, n3) {
        ya(e4, t4, n3);
      }), Od = yo(function(e4, t4, n3, r3) {
        ya(e4, t4, n3, r3);
      }), kd = Jo(function(e4, t4) {
        var n3 = {};
        if (e4 == null) return n3;
        var r3 = false;
        t4 = z2(t4, function(t5) {
          return t5 = $a(t5, e4), r3 ||= t5.length > 1, t5;
        }), ho(e4, Xo(e4), n3), r3 && (n3 = ki(n3, f2 | p2 | m2, Wo));
        for (var i3 = t4.length; i3--; ) Ga(n3, t4[i3]);
        return n3;
      });
      function Ad(e4, t4) {
        return Md(e4, Yl(G(t4)));
      }
      var jd = Jo(function(e4, t4) {
        return e4 == null ? {} : Ca(e4, t4);
      });
      function Md(e4, t4) {
        if (e4 == null) return {};
        var n3 = z2(Xo(e4), function(e5) {
          return [e5];
        });
        return t4 = G(t4), wa(e4, n3, function(e5, n4) {
          return t4(e5, n4[0]);
        });
      }
      function Nd(e4, t4, r3) {
        t4 = $a(t4, e4);
        var i3 = -1, a3 = t4.length;
        for (a3 || (a3 = 1, e4 = n2); ++i3 < a3; ) {
          var o3 = e4 == null ? n2 : e4[zs(t4[i3])];
          o3 === n2 && (i3 = a3, o3 = r3), e4 = Du(o3) ? o3.call(e4) : o3;
        }
        return e4;
      }
      function Pd(e4, t4, n3) {
        return e4 == null ? e4 : Na(e4, t4, n3);
      }
      function Fd(e4, t4, r3, i3) {
        return i3 = typeof i3 == `function` ? i3 : n2, e4 == null ? e4 : Na(e4, t4, r3, i3);
      }
      var Id = Bo($), Ld = Bo(wd);
      function Rd(e4, t4, n3) {
        var r3 = q(e4), i3 = r3 || yu(e4) || Wu(e4);
        if (t4 = G(t4, 4), n3 == null) {
          var a3 = e4 && e4.constructor;
          n3 = i3 ? r3 ? new a3() : [] : Y(e4) && Du(a3) ? Lr(Kt3(e4)) : {};
        }
        return (i3 ? Mn2 : Hi)(e4, function(e5, r4, i4) {
          return t4(n3, e5, r4, i4);
        }), n3;
      }
      function zd(e4, t4) {
        return e4 == null ? true : Ga(e4, t4);
      }
      function Bd(e4, t4, n3) {
        return e4 == null ? e4 : Ka(e4, t4, Qa(n3));
      }
      function Vd(e4, t4, r3, i3) {
        return i3 = typeof i3 == `function` ? i3 : n2, e4 == null ? e4 : Ka(e4, t4, Qa(r3), i3);
      }
      function Hd(e4) {
        return e4 == null ? [] : or2(e4, $(e4));
      }
      function Ud(e4) {
        return e4 == null ? [] : or2(e4, wd(e4));
      }
      function Wd(e4, t4, r3) {
        return r3 === n2 && (r3 = t4, t4 = n2), r3 !== n2 && (r3 = $u(r3), r3 = r3 === r3 ? r3 : 0), t4 !== n2 && (t4 = $u(t4), t4 = t4 === t4 ? t4 : 0), Oi($u(e4), t4, r3);
      }
      function Gd(e4, t4, r3) {
        return t4 = Zu(t4), r3 === n2 ? (r3 = t4, t4 = 0) : r3 = Zu(r3), e4 = $u(e4), Zi(e4, t4, r3);
      }
      function Kd(e4, t4, r3) {
        if (r3 && typeof r3 != `boolean` && hs(e4, t4, r3) && (t4 = r3 = n2), r3 === n2 && (typeof t4 == `boolean` ? (r3 = t4, t4 = n2) : typeof e4 == `boolean` && (r3 = e4, e4 = n2)), e4 === n2 && t4 === n2 ? (e4 = 0, t4 = 1) : (e4 = Zu(e4), t4 === n2 ? (t4 = e4, e4 = 0) : t4 = Zu(t4)), e4 > t4) {
          var i3 = e4;
          e4 = t4, t4 = i3;
        }
        if (r3 || e4 % 1 || t4 % 1) {
          var a3 = _n3();
          return P3(e4 + a3 * (t4 - e4 + vn2(`1e-` + ((a3 + ``).length - 1))), t4);
        }
        return Oa(e4, t4);
      }
      var qd = wo(function(e4, t4, n3) {
        return t4 = t4.toLowerCase(), e4 + (n3 ? Jd(t4) : t4);
      });
      function Jd(e4) {
        return Sf(Q(e4).toLowerCase());
      }
      function Yd(e4) {
        return e4 = Q(e4), e4 && e4.replace(Ct2, ur).replace(ln2, ``);
      }
      function Xd(e4, t4, r3) {
        e4 = Q(e4), t4 = Ua(t4);
        var i3 = e4.length;
        r3 = r3 === n2 ? i3 : Oi(Z(r3), 0, i3);
        var a3 = r3;
        return r3 -= t4.length, r3 >= 0 && e4.slice(r3, a3) == t4;
      }
      function Zd(e4) {
        return e4 = Q(e4), e4 && nt2.test(e4) ? e4.replace(et2, dr) : e4;
      }
      function Qd(e4) {
        return e4 = Q(e4), e4 && ut2.test(e4) ? e4.replace(lt2, `\\$&`) : e4;
      }
      var $d = wo(function(e4, t4, n3) {
        return e4 + (n3 ? `-` : ``) + t4.toLowerCase();
      }), ef = wo(function(e4, t4, n3) {
        return e4 + (n3 ? ` ` : ``) + t4.toLowerCase();
      }), tf = Co(`toLowerCase`);
      function nf(e4, t4, n3) {
        e4 = Q(e4), t4 = Z(t4);
        var r3 = t4 ? wr(e4) : 0;
        if (!t4 || r3 >= t4) return e4;
        var i3 = (t4 - r3) / 2;
        return No(an3(i3), n3) + e4 + No(rn3(i3), n3);
      }
      function rf(e4, t4, n3) {
        e4 = Q(e4), t4 = Z(t4);
        var r3 = t4 ? wr(e4) : 0;
        return t4 && r3 < t4 ? e4 + No(t4 - r3, n3) : e4;
      }
      function af(e4, t4, n3) {
        e4 = Q(e4), t4 = Z(t4);
        var r3 = t4 ? wr(e4) : 0;
        return t4 && r3 < t4 ? No(t4 - r3, n3) + e4 : e4;
      }
      function of(e4, t4, n3) {
        return n3 || t4 == null ? t4 = 0 : t4 &&= +t4, gn3(Q(e4).replace(dt2, ``), t4 || 0);
      }
      function sf(e4, t4, r3) {
        return t4 = (r3 ? hs(e4, t4, r3) : t4 === n2) ? 1 : Z(t4), Aa(Q(e4), t4);
      }
      function cf() {
        var e4 = arguments, t4 = Q(e4[0]);
        return e4.length < 3 ? t4 : t4.replace(e4[1], e4[2]);
      }
      var lf = wo(function(e4, t4, n3) {
        return e4 + (n3 ? `_` : ``) + t4.toLowerCase();
      });
      function uf(e4, t4, r3) {
        return r3 && typeof r3 != `number` && hs(e4, t4, r3) && (t4 = r3 = n2), r3 = r3 === n2 ? me2 : r3 >>> 0, r3 ? (e4 = Q(e4), e4 && (typeof t4 == `string` || t4 != null && !zu(t4)) && (t4 = Ua(t4), !t4 && mr(e4)) ? to(Tr(e4), 0, r3) : e4.split(t4, r3)) : [];
      }
      var df = wo(function(e4, t4, n3) {
        return e4 + (n3 ? ` ` : ``) + Sf(t4);
      });
      function ff(e4, t4, n3) {
        return e4 = Q(e4), n3 = n3 == null ? 0 : Oi(Z(n3), 0, e4.length), t4 = Ua(t4), e4.slice(n3, n3 + t4.length) == t4;
      }
      function pf(e4, t4, r3) {
        var i3 = V.templateSettings;
        r3 && hs(e4, t4, r3) && (t4 = n2), e4 = Q(e4), t4 = ad({}, t4, i3, Ho);
        var a3 = ad({}, t4.imports, i3.imports, Ho), o3 = $(a3), l3 = or2(a3, o3);
        Mn2(o3, function(e5) {
          if (gt2.test(e5)) throw new Et3(c2);
        });
        var u3, d3, f3 = 0, p3 = t4.interpolate || wt2, m3 = `__p += '`, h3 = kt3((t4.escape || wt2).source + `|` + p3.source + `|` + (p3 === at2 ? vt2 : wt2).source + `|` + (t4.evaluate || wt2).source + `|$`, `g`), g3 = `//# sourceURL=` + (A3.call(t4, `sourceURL`) ? (t4.sourceURL + ``).replace(/\s/g, ` `) : `lodash.templateSources[` + ++mn2 + `]`) + `
`;
        e4.replace(h3, function(t5, n3, r4, i4, a4, o4) {
          return r4 ||= i4, m3 += e4.slice(f3, o4).replace(Tt2, fr), n3 && (u3 = true, m3 += `' +
__e(` + n3 + `) +
'`), a4 && (d3 = true, m3 += `';
` + a4 + `;
__p += '`), r4 && (m3 += `' +
((__t = (` + r4 + `)) == null ? '' : __t) +
'`), f3 = o4 + t5.length, t5;
        }), m3 += `';
`;
        var _3 = A3.call(t4, `variable`) && t4.variable;
        if (!_3) m3 = `with (obj) {
` + m3 + `
}
`;
        else if (gt2.test(_3)) throw new Et3(s2);
        m3 = (d3 ? m3.replace(Xe2, ``) : m3).replace(Ze2, `$1`).replace(Qe2, `$1;`), m3 = `function(` + (_3 || `obj`) + `) {
` + (_3 ? `` : `obj || (obj = {});
`) + `var __t, __p = ''` + (u3 ? `, __e = _.escape` : ``) + (d3 ? `, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
` : `;
`) + m3 + `return __p
}`;
        var v3 = wf(function() {
          return Dt3(o3, g3 + `return ` + m3).apply(n2, l3);
        });
        if (v3.source = m3, Tu(v3)) throw v3;
        return v3;
      }
      function mf(e4) {
        return Q(e4).toLowerCase();
      }
      function hf(e4) {
        return Q(e4).toUpperCase();
      }
      function gf(e4, t4, r3) {
        if (e4 = Q(e4), e4 && (r3 || t4 === n2)) return ir2(e4);
        if (!e4 || !(t4 = Ua(t4))) return e4;
        var i3 = Tr(e4), a3 = Tr(t4);
        return to(i3, sr2(i3, a3), cr2(i3, a3) + 1).join(``);
      }
      function _f(e4, t4, r3) {
        if (e4 = Q(e4), e4 && (r3 || t4 === n2)) return e4.slice(0, Er(e4) + 1);
        if (!e4 || !(t4 = Ua(t4))) return e4;
        var i3 = Tr(e4);
        return to(i3, 0, cr2(i3, Tr(t4)) + 1).join(``);
      }
      function vf(e4, t4, r3) {
        if (e4 = Q(e4), e4 && (r3 || t4 === n2)) return e4.replace(dt2, ``);
        if (!e4 || !(t4 = Ua(t4))) return e4;
        var i3 = Tr(e4);
        return to(i3, sr2(i3, Tr(t4))).join(``);
      }
      function yf(e4, t4) {
        var r3 = re2, i3 = ie2;
        if (Y(t4)) {
          var a3 = `separator` in t4 ? t4.separator : a3;
          r3 = `length` in t4 ? Z(t4.length) : r3, i3 = `omission` in t4 ? Ua(t4.omission) : i3;
        }
        e4 = Q(e4);
        var o3 = e4.length;
        if (mr(e4)) {
          var s3 = Tr(e4);
          o3 = s3.length;
        }
        if (r3 >= o3) return e4;
        var c3 = r3 - wr(i3);
        if (c3 < 1) return i3;
        var l3 = s3 ? to(s3, 0, c3).join(``) : e4.slice(0, c3);
        if (a3 === n2) return l3 + i3;
        if (s3 && (c3 += l3.length - c3), zu(a3)) {
          if (e4.slice(c3).search(a3)) {
            var u3, d3 = l3;
            for (a3.global || (a3 = kt3(a3.source, Q(yt2.exec(a3)) + `g`)), a3.lastIndex = 0; u3 = a3.exec(d3); ) var f3 = u3.index;
            l3 = l3.slice(0, f3 === n2 ? c3 : f3);
          }
        } else if (e4.indexOf(Ua(a3), c3) != c3) {
          var p3 = l3.lastIndexOf(a3);
          p3 > -1 && (l3 = l3.slice(0, p3));
        }
        return l3 + i3;
      }
      function bf(e4) {
        return e4 = Q(e4), e4 && tt2.test(e4) ? e4.replace($e2, Dr) : e4;
      }
      var xf = wo(function(e4, t4, n3) {
        return e4 + (n3 ? ` ` : ``) + t4.toUpperCase();
      }), Sf = Co(`toUpperCase`);
      function Cf(e4, t4, r3) {
        return e4 = Q(e4), t4 = r3 ? n2 : t4, t4 === n2 ? hr(e4) ? Ar(e4) : Wn2(e4) : e4.match(t4) || [];
      }
      var wf = W(function(e4, t4) {
        try {
          return R2(e4, n2, t4);
        } catch (e5) {
          return Tu(e5) ? e5 : new Et3(e5);
        }
      }), Tf = Jo(function(e4, t4) {
        return Mn2(t4, function(t5) {
          t5 = zs(t5), Ei(e4, t5, Bl(e4[t5], e4));
        }), e4;
      });
      function Ef(e4) {
        var t4 = e4 == null ? 0 : e4.length, n3 = G();
        return e4 = t4 ? z2(e4, function(e5) {
          if (typeof e5[1] != `function`) throw new k3(o2);
          return [n3(e5[0]), e5[1]];
        }) : [], W(function(n4) {
          for (var r3 = -1; ++r3 < t4; ) {
            var i3 = e4[r3];
            if (R2(i3[0], this, n4)) return R2(i3[1], this, n4);
          }
        });
      }
      function Df(e4) {
        return Ai(ki(e4, f2));
      }
      function Of(e4) {
        return function() {
          return e4;
        };
      }
      function kf(e4, t4) {
        return e4 == null || e4 !== e4 ? t4 : e4;
      }
      var Af = Oo(), jf = Oo(true);
      function Mf(e4) {
        return e4;
      }
      function Nf(e4) {
        return fa(typeof e4 == `function` ? e4 : ki(e4, f2));
      }
      function Pf(e4) {
        return _a(ki(e4, f2));
      }
      function Ff(e4, t4) {
        return va(e4, ki(t4, f2));
      }
      var If = W(function(e4, t4) {
        return function(n3) {
          return ea(n3, e4, t4);
        };
      }), Lf = W(function(e4, t4) {
        return function(n3) {
          return ea(e4, n3, t4);
        };
      });
      function Rf(e4, t4, n3) {
        var r3 = $(t4), i3 = Wi(t4, r3);
        n3 == null && !(Y(t4) && (i3.length || !r3.length)) && (n3 = t4, t4 = e4, e4 = this, i3 = Wi(t4, $(t4)));
        var a3 = !(Y(n3) && `chain` in n3) || !!n3.chain, o3 = Du(e4);
        return Mn2(i3, function(n4) {
          var r4 = t4[n4];
          e4[n4] = r4, o3 && (e4.prototype[n4] = function() {
            var t5 = this.__chain__;
            if (a3 || t5) {
              var n5 = e4(this.__wrapped__);
              return (n5.__actions__ = mo(this.__actions__)).push({ func: r4, args: arguments, thisArg: e4 }), n5.__chain__ = t5, n5;
            }
            return r4.apply(e4, Rn2([this.value()], arguments));
          });
        }), e4;
      }
      function zf() {
        return I2._ === this && (I2._ = Bt3), this;
      }
      function Bf() {
      }
      function Vf(e4) {
        return e4 = Z(e4), W(function(t4) {
          return xa(t4, e4);
        });
      }
      var Hf = Mo(z2), Uf = Mo(Pn2), Wf = Mo(Vn2);
      function Gf(e4) {
        return gs(e4) ? Zn2(zs(e4)) : Ta(e4);
      }
      function Kf(e4) {
        return function(t4) {
          return e4 == null ? n2 : Gi(e4, t4);
        };
      }
      var qf = Fo(), Jf = Fo(true);
      function Yf() {
        return [];
      }
      function Xf() {
        return false;
      }
      function Zf() {
        return {};
      }
      function Qf() {
        return ``;
      }
      function $f() {
        return true;
      }
      function ep(e4, t4) {
        if (e4 = Z(e4), e4 < 1 || e4 > de2) return [];
        var n3 = me2, r3 = P3(e4, me2);
        t4 = G(t4), e4 -= me2;
        for (var i3 = nr2(r3, t4); ++n3 < e4; ) t4(n3);
        return i3;
      }
      function tp(e4) {
        return q(e4) ? z2(e4, zs) : Uu(e4) ? [e4] : mo(Rs(Q(e4)));
      }
      function np(e4) {
        var t4 = ++It3;
        return Q(e4) + t4;
      }
      var rp = jo(function(e4, t4) {
        return e4 + t4;
      }, 0), ip = Ro(`ceil`), ap = jo(function(e4, t4) {
        return e4 / t4;
      }, 1), op = Ro(`floor`);
      function sp(e4) {
        return e4 && e4.length ? Li(e4, Mf, Ji) : n2;
      }
      function cp(e4, t4) {
        return e4 && e4.length ? Li(e4, G(t4, 2), Ji) : n2;
      }
      function lp(e4) {
        return Xn2(e4, Mf);
      }
      function up(e4, t4) {
        return Xn2(e4, G(t4, 2));
      }
      function dp(e4) {
        return e4 && e4.length ? Li(e4, Mf, ha) : n2;
      }
      function fp(e4, t4) {
        return e4 && e4.length ? Li(e4, G(t4, 2), ha) : n2;
      }
      var pp = jo(function(e4, t4) {
        return e4 * t4;
      }, 1), mp = Ro(`round`), hp = jo(function(e4, t4) {
        return e4 - t4;
      }, 0);
      function gp(e4) {
        return e4 && e4.length ? tr2(e4, Mf) : 0;
      }
      function _p(e4, t4) {
        return e4 && e4.length ? tr2(e4, G(t4, 2)) : 0;
      }
      return V.after = Ll, V.ary = Rl, V.assign = nd, V.assignIn = rd, V.assignInWith = id, V.assignWith = ad, V.at = od, V.before = zl, V.bind = Bl, V.bindAll = Tf, V.bindKey = Vl, V.castArray = ou, V.chain = $c, V.chunk = Us, V.compact = Ws, V.concat = Gs, V.cond = Ef, V.conforms = Df, V.constant = Of, V.countBy = ul, V.create = sd, V.curry = Hl, V.curryRight = Ul, V.debounce = Wl, V.defaults = cd, V.defaultsDeep = ld, V.defer = Gl, V.delay = Kl, V.difference = Ks, V.differenceBy = qs, V.differenceWith = Js, V.drop = Ys, V.dropRight = Xs, V.dropRightWhile = Zs, V.dropWhile = Qs, V.fill = $s, V.filter = fl, V.flatMap = hl, V.flatMapDeep = gl, V.flatMapDepth = _l, V.flatten = nc, V.flattenDeep = rc, V.flattenDepth = ic, V.flip = ql, V.flow = Af, V.flowRight = jf, V.fromPairs = ac, V.functions = gd, V.functionsIn = _d, V.groupBy = bl, V.initial = cc, V.intersection = lc, V.intersectionBy = uc, V.intersectionWith = dc, V.invert = xd, V.invertBy = Sd, V.invokeMap = Sl, V.iteratee = Nf, V.keyBy = Cl, V.keys = $, V.keysIn = wd, V.map = wl, V.mapKeys = Td, V.mapValues = Ed, V.matches = Pf, V.matchesProperty = Ff, V.memoize = Jl, V.merge = Dd, V.mergeWith = Od, V.method = If, V.methodOf = Lf, V.mixin = Rf, V.negate = Yl, V.nthArg = Vf, V.omit = kd, V.omitBy = Ad, V.once = Xl, V.orderBy = Tl, V.over = Hf, V.overArgs = Zl, V.overEvery = Uf, V.overSome = Wf, V.partial = Ql, V.partialRight = $l, V.partition = El, V.pick = jd, V.pickBy = Md, V.property = Gf, V.propertyOf = Kf, V.pull = gc, V.pullAll = _c, V.pullAllBy = vc, V.pullAllWith = yc, V.pullAt = bc, V.range = qf, V.rangeRight = Jf, V.rearg = eu, V.reject = kl, V.remove = xc, V.rest = tu, V.reverse = Sc, V.sampleSize = jl, V.set = Pd, V.setWith = Fd, V.shuffle = Ml, V.slice = Cc, V.sortBy = Fl, V.sortedUniq = Ac, V.sortedUniqBy = jc, V.split = uf, V.spread = nu, V.tail = Mc, V.take = Nc, V.takeRight = Pc, V.takeRightWhile = Fc, V.takeWhile = Ic, V.tap = el, V.throttle = ru, V.thru = tl, V.toArray = Xu, V.toPairs = Id, V.toPairsIn = Ld, V.toPath = tp, V.toPlainObject = ed, V.transform = Rd, V.unary = iu, V.union = Lc, V.unionBy = Rc, V.unionWith = zc, V.uniq = Bc, V.uniqBy = Vc, V.uniqWith = Hc, V.unset = zd, V.unzip = Uc, V.unzipWith = Wc, V.update = Bd, V.updateWith = Vd, V.values = Hd, V.valuesIn = Ud, V.without = Gc, V.words = Cf, V.wrap = au, V.xor = Kc, V.xorBy = qc, V.xorWith = Jc, V.zip = Yc, V.zipObject = Xc, V.zipObjectDeep = Zc, V.zipWith = Qc, V.entries = Id, V.entriesIn = Ld, V.extend = rd, V.extendWith = id, Rf(V, V), V.add = rp, V.attempt = wf, V.camelCase = qd, V.capitalize = Jd, V.ceil = ip, V.clamp = Wd, V.clone = su, V.cloneDeep = lu, V.cloneDeepWith = uu, V.cloneWith = cu, V.conformsTo = du, V.deburr = Yd, V.defaultTo = kf, V.divide = ap, V.endsWith = Xd, V.eq = fu, V.escape = Zd, V.escapeRegExp = Qd, V.every = dl, V.find = pl, V.findIndex = ec, V.findKey = ud, V.findLast = ml, V.findLastIndex = tc, V.findLastKey = dd, V.floor = op, V.forEach = vl, V.forEachRight = yl, V.forIn = fd, V.forInRight = pd, V.forOwn = md, V.forOwnRight = hd, V.get = vd, V.gt = pu, V.gte = mu, V.has = yd, V.hasIn = bd, V.head = oc, V.identity = Mf, V.includes = xl, V.indexOf = sc, V.inRange = Gd, V.invoke = Cd, V.isArguments = hu, V.isArray = q, V.isArrayBuffer = gu, V.isArrayLike = _u, V.isArrayLikeObject = J, V.isBoolean = vu, V.isBuffer = yu, V.isDate = bu, V.isElement = xu, V.isEmpty = Su, V.isEqual = Cu, V.isEqualWith = wu, V.isError = Tu, V.isFinite = Eu, V.isFunction = Du, V.isInteger = Ou, V.isLength = ku, V.isMap = Au, V.isMatch = ju, V.isMatchWith = Mu, V.isNaN = Nu, V.isNative = Pu, V.isNil = Iu, V.isNull = Fu, V.isNumber = Lu, V.isObject = Y, V.isObjectLike = X, V.isPlainObject = Ru, V.isRegExp = zu, V.isSafeInteger = Bu, V.isSet = Vu, V.isString = Hu, V.isSymbol = Uu, V.isTypedArray = Wu, V.isUndefined = Gu, V.isWeakMap = Ku, V.isWeakSet = qu, V.join = fc, V.kebabCase = $d, V.last = pc, V.lastIndexOf = mc, V.lowerCase = ef, V.lowerFirst = tf, V.lt = Ju, V.lte = Yu, V.max = sp, V.maxBy = cp, V.mean = lp, V.meanBy = up, V.min = dp, V.minBy = fp, V.stubArray = Yf, V.stubFalse = Xf, V.stubObject = Zf, V.stubString = Qf, V.stubTrue = $f, V.multiply = pp, V.nth = hc, V.noConflict = zf, V.noop = Bf, V.now = Il, V.pad = nf, V.padEnd = rf, V.padStart = af, V.parseInt = of, V.random = Kd, V.reduce = Dl, V.reduceRight = Ol, V.repeat = sf, V.replace = cf, V.result = Nd, V.round = mp, V.runInContext = e3, V.sample = Al, V.size = Nl, V.snakeCase = lf, V.some = Pl, V.sortedIndex = wc, V.sortedIndexBy = Tc, V.sortedIndexOf = Ec, V.sortedLastIndex = Dc, V.sortedLastIndexBy = Oc, V.sortedLastIndexOf = kc, V.startCase = df, V.startsWith = ff, V.subtract = hp, V.sum = gp, V.sumBy = _p, V.template = pf, V.times = ep, V.toFinite = Zu, V.toInteger = Z, V.toLength = Qu, V.toLower = mf, V.toNumber = $u, V.toSafeInteger = td, V.toString = Q, V.toUpper = hf, V.trim = gf, V.trimEnd = _f, V.trimStart = vf, V.truncate = yf, V.unescape = bf, V.uniqueId = np, V.upperCase = xf, V.upperFirst = Sf, V.each = vl, V.eachRight = yl, V.first = oc, Rf(V, (function() {
        var e4 = {};
        return Hi(V, function(t4, n3) {
          A3.call(V.prototype, n3) || (e4[n3] = t4);
        }), e4;
      })(), { chain: false }), V.VERSION = r2, Mn2([`bind`, `bindKey`, `curry`, `curryRight`, `partial`, `partialRight`], function(e4) {
        V[e4].placeholder = V;
      }), Mn2([`drop`, `take`], function(e4, t4) {
        H.prototype[e4] = function(r3) {
          r3 = r3 === n2 ? 1 : j3(Z(r3), 0);
          var i3 = this.__filtered__ && !t4 ? new H(this) : this.clone();
          return i3.__filtered__ ? i3.__takeCount__ = P3(r3, i3.__takeCount__) : i3.__views__.push({ size: P3(r3, me2), type: e4 + (i3.__dir__ < 0 ? `Right` : ``) }), i3;
        }, H.prototype[e4 + `Right`] = function(t5) {
          return this.reverse()[e4](t5).reverse();
        };
      }), Mn2([`filter`, `map`, `takeWhile`], function(e4, t4) {
        var n3 = t4 + 1, r3 = n3 == se2 || n3 == le2;
        H.prototype[e4] = function(e5) {
          var t5 = this.clone();
          return t5.__iteratees__.push({ iteratee: G(e5, 3), type: n3 }), t5.__filtered__ = t5.__filtered__ || r3, t5;
        };
      }), Mn2([`head`, `last`], function(e4, t4) {
        var n3 = `take` + (t4 ? `Right` : ``);
        H.prototype[e4] = function() {
          return this[n3](1).value()[0];
        };
      }), Mn2([`initial`, `tail`], function(e4, t4) {
        var n3 = `drop` + (t4 ? `` : `Right`);
        H.prototype[e4] = function() {
          return this.__filtered__ ? new H(this) : this[n3](1);
        };
      }), H.prototype.compact = function() {
        return this.filter(Mf);
      }, H.prototype.find = function(e4) {
        return this.filter(e4).head();
      }, H.prototype.findLast = function(e4) {
        return this.reverse().find(e4);
      }, H.prototype.invokeMap = W(function(e4, t4) {
        return typeof e4 == `function` ? new H(this) : this.map(function(n3) {
          return ea(n3, e4, t4);
        });
      }), H.prototype.reject = function(e4) {
        return this.filter(Yl(G(e4)));
      }, H.prototype.slice = function(e4, t4) {
        e4 = Z(e4);
        var r3 = this;
        return r3.__filtered__ && (e4 > 0 || t4 < 0) ? new H(r3) : (e4 < 0 ? r3 = r3.takeRight(-e4) : e4 && (r3 = r3.drop(e4)), t4 !== n2 && (t4 = Z(t4), r3 = t4 < 0 ? r3.dropRight(-t4) : r3.take(t4 - e4)), r3);
      }, H.prototype.takeRightWhile = function(e4) {
        return this.reverse().takeWhile(e4).reverse();
      }, H.prototype.toArray = function() {
        return this.take(me2);
      }, Hi(H.prototype, function(e4, t4) {
        var r3 = /^(?:filter|find|map|reject)|While$/.test(t4), i3 = /^(?:head|last)$/.test(t4), a3 = V[i3 ? `take` + (t4 == `last` ? `Right` : ``) : t4], o3 = i3 || /^find/.test(t4);
        a3 && (V.prototype[t4] = function() {
          var t5 = this.__wrapped__, s3 = i3 ? [1] : arguments, c3 = t5 instanceof H, l3 = s3[0], u3 = c3 || q(t5), d3 = function(e5) {
            var t6 = a3.apply(V, Rn2([e5], s3));
            return i3 && f3 ? t6[0] : t6;
          };
          u3 && r3 && typeof l3 == `function` && l3.length != 1 && (c3 = u3 = false);
          var f3 = this.__chain__, p3 = !!this.__actions__.length, m3 = o3 && !f3, h3 = c3 && !p3;
          if (!o3 && u3) {
            t5 = h3 ? t5 : new H(this);
            var g3 = e4.apply(t5, s3);
            return g3.__actions__.push({ func: tl, args: [d3], thisArg: n2 }), new zr(g3, f3);
          }
          return m3 && h3 ? e4.apply(this, s3) : (g3 = this.thru(d3), m3 ? i3 ? g3.value()[0] : g3.value() : g3);
        });
      }), Mn2([`pop`, `push`, `shift`, `sort`, `splice`, `unshift`], function(e4) {
        var t4 = jt3[e4], n3 = /^(?:push|sort|unshift)$/.test(e4) ? `tap` : `thru`, r3 = /^(?:pop|shift)$/.test(e4);
        V.prototype[e4] = function() {
          var e5 = arguments;
          if (r3 && !this.__chain__) {
            var i3 = this.value();
            return t4.apply(q(i3) ? i3 : [], e5);
          }
          return this[n3](function(n4) {
            return t4.apply(q(n4) ? n4 : [], e5);
          });
        };
      }), Hi(H.prototype, function(e4, t4) {
        var n3 = V[t4];
        if (n3) {
          var r3 = n3.name + ``;
          A3.call(Qn3, r3) || (Qn3[r3] = []), Qn3[r3].push({ name: t4, func: n3 });
        }
      }), Qn3[ko(n2, v2).name] = [{ name: `wrapper`, func: n2 }], H.prototype.clone = Br, H.prototype.reverse = Vr, H.prototype.value = Hr, V.prototype.at = nl, V.prototype.chain = rl, V.prototype.commit = il, V.prototype.next = al, V.prototype.plant = sl, V.prototype.reverse = cl, V.prototype.toJSON = V.prototype.valueOf = V.prototype.value = ll, V.prototype.first = V.prototype.head, Zt3 && (V.prototype[Zt3] = ol), V;
    })();
    typeof define == `function` && typeof define.amd == `object` && define.amd ? (I2._ = jr, define(function() {
      return jr;
    })) : Sn2 ? ((Sn2.exports = jr)._ = jr, xn2._ = jr) : I2._ = jr;
  }).call(e2);
}))(), pe = new i(`plant-registry`), me = `chunks:///_virtual/Plants.ts`, he = `chunks:///_virtual/SandBoxLevelSettingWindow.ts`, ge = `chunks:///_virtual/JSONs.ts`, _e = Symbol.for(`gp-next.wrapperOwner`), ve = Symbol.for(`gp-next.wrapperOriginal`), ye = `plant-registry`;
function be(e2) {
  return typeof e2 == `string` && /^RTID\((.+?)@[^)]+\)$/.exec(e2.trim())?.[1] || ``;
}
function xe(e2) {
  let t2 = e2?.TAGS ?? e2?.TYPE;
  return Array.isArray(t2) ? t2 : [];
}
function Se(e2) {
  if (typeof e2 != `object` || !e2) return e2;
  try {
    return structuredClone(e2);
  } catch {
    return JSON.parse(JSON.stringify(e2));
  }
}
function Ce(e2) {
  let t2 = /* @__PURE__ */ new Map();
  for (let n2 of e2?.objects || []) {
    let e3 = n2?.aliases?.[0];
    e3 && t2.set(e3, n2?.objdata || {});
  }
  return t2;
}
function we(e2) {
  if (!Array.isArray(e2) || e2.length <= 0) return null;
  let t2 = e2.reduce((e3, t3) => e3 + (Number(t3?.Weight) || 0), 0);
  if (t2 <= 0) return e2[0]?.Type ?? null;
  let n2 = Math.random() * t2;
  for (let t3 of e2) if (n2 -= Number(t3?.Weight) || 0, n2 <= 0) return t3?.Type ?? null;
  return e2[e2.length - 1]?.Type ?? null;
}
function Te(e2) {
  let t2 = {};
  for (let n2 of Object.getOwnPropertyNames(e2 || {})) t2[n2] = e2[n2];
  return t2;
}
function Ee(e2, t2) {
  let n2 = new Set(Reflect.ownKeys(t2));
  for (let t3 of Reflect.ownKeys(e2)) n2.has(t3) || delete e2[t3];
  Object.defineProperties(e2, t2);
}
function De(e2, t2) {
  if (!t2) return null;
  let n2 = {};
  for (let [t3, r2] of Object.entries(e2 || {})) n2[t3] = Se(r2);
  for (let [e3, r2] of Object.entries(t2 || {})) r2 != null && (n2[e3] = Se(r2));
  return n2;
}
function Oe(e2, t2) {
  return y(ge, `PvZ2Object`)?.getObjectsByRTID?.(e2, t2)?.[0]?.objdata || null;
}
function ke(e2) {
  if (typeof e2 != `function`) return e2;
  let t2 = e2[ve];
  return typeof t2 == `function` ? t2 : e2;
}
function Ae(e2, t2) {
  if (typeof e2 != `function`) return e2;
  try {
    e2[_e] = ye, e2[ve] = ke(t2);
  } catch {
  }
  return e2;
}
function je() {
  return new Me();
}
var Me = class {
  constructor() {
    this._state = null;
  }
  _readRegistrySource() {
    let e2 = m(`PlantFeatures`), t2 = m(`PlantTypes`), n2 = m(`PlantProps`), r2 = m(`PlantAlmanac`), i2 = e2?.json, a2 = t2?.json, o2 = n2?.json, s2 = r2?.json;
    if (!i2?.PLANTS || !a2?.objects || !o2?.objects || !s2?.objects) return null;
    let c2 = i2.PLANTS, l2 = /* @__PURE__ */ new Map(), u2 = /* @__PURE__ */ new Map();
    c2.forEach((e3, t3) => {
      let n3 = e3?.CODENAME;
      n3 && (l2.has(n3) && pe.warn(`Duplicate plant CODENAME detected: '${n3}'`), l2.set(n3, t3));
      let r3 = Number(e3?.ID);
      Number.isFinite(r3) && !u2.has(r3) && u2.set(r3, t3);
    });
    let d2 = Ce(a2), f2 = Ce(o2), p2 = Ce(s2), h2 = /* @__PURE__ */ new Map();
    for (let [e3, t3] of d2.entries()) {
      let n3 = l2.get(e3);
      n3 == null && t3?.PlantBasedOn && (n3 = l2.get(t3.PlantBasedOn)), n3 != null && h2.set(e3, n3);
    }
    return { featureJson: i2, features: c2, codenameToIndex: l2, jsonIdToIndex: u2, typeByAlias: d2, propsByAlias: f2, almanacByAlias: p2, typeToIndex: h2 };
  }
  _resolveRuntimeIndex(e2, t2 = true) {
    let n2 = this._state?.registry;
    if (!n2) return t2 ? 0 : NaN;
    if (typeof e2 == `string`) return n2.codenameToIndex.has(e2) ? n2.codenameToIndex.get(e2) : n2.typeToIndex.has(e2) ? n2.typeToIndex.get(e2) : t2 ? 0 : NaN;
    let r2 = Number(e2);
    if (Number.isFinite(r2)) {
      if (r2 >= 0 && r2 < n2.features.length) return r2;
      if (n2.jsonIdToIndex.has(r2)) return n2.jsonIdToIndex.get(r2);
    }
    return t2 ? 0 : NaN;
  }
  _getFeatureById(e2, t2 = true) {
    let n2 = this._state?.registry;
    if (!n2?.features?.length) return null;
    let r2 = this._resolveRuntimeIndex(e2, t2);
    return Number.isFinite(r2) ? n2.features[r2] || (t2 ? n2.features[0] : null) : null;
  }
  _syncDerivedPlantLists(e2) {
    let t2 = this._state?.registry;
    if (!t2 || !e2) return;
    let n2 = Array.isArray(t2.featureJson.SEEDCHOOSERDEFAULTORDER) ? t2.featureJson.SEEDCHOOSERDEFAULTORDER.filter((e3) => t2.codenameToIndex.has(e3)) : t2.features.map((e3) => e3?.CODENAME).filter(Boolean);
    e2.defaultPlantChooserOrder = n2;
    let r2 = [];
    for (let e3 of n2) {
      let n3 = t2.codenameToIndex.get(e3), i3 = t2.features[n3];
      xe(i3).includes(`sunProducer`) && r2.push(e3);
    }
    e2.sunProducers = r2, e2.plantRes && (e2.plantRes.PlantFeatures = t2.features);
    let i2 = y(he, `SandBoxLevelSettingWindow`);
    i2 && Array.isArray(t2.featureJson.SANDBOX) && (i2.plantList = t2.featureJson.SANDBOX.map((e3) => this._resolveRuntimeIndex(e3, false)).filter(Number.isFinite));
  }
  _rebuildPlantEnum(e2) {
    if (!e2 || !this._state?.registry) return;
    let t2 = this._state.registry, n2 = this._state.origPlantEnum;
    for (let t3 of this._state.dynamicEnumKeys) delete e2[t3];
    this._state.dynamicEnumKeys = [], e2.amount = t2.features.length;
    for (let r2 of t2.features) {
      let i2 = r2?.CODENAME, a2 = t2.codenameToIndex.get(i2);
      !i2 || !Number.isFinite(a2) || (i2 in e2 || (e2[i2] = a2, this._state.dynamicEnumKeys.push(i2)), (n2[a2] === `amount` || !(String(a2) in n2) && !(String(a2) in e2)) && (Object.defineProperty(e2, String(a2), { value: i2, writable: false, enumerable: false, configurable: true }), this._state.dynamicEnumKeys.push(String(a2))));
    }
    Object.defineProperty(e2, String(t2.features.length), { value: `amount`, writable: false, enumerable: false, configurable: true }), this._state.dynamicEnumKeys.push(String(t2.features.length)), pe.info(`[plant] Runtime PlantEnum rebuilt: ${t2.features.length} entries`);
  }
  apply() {
    let e2 = this._readRegistrySource();
    if (!e2) return pe.warn(`[plant] Plant registry source incomplete \u2014 dynamic registry skipped`), false;
    let t2 = b(me), n2 = t2?.plants, r2 = t2?.PlantEnum;
    if (!n2 || !r2) return pe.warn(`[plant] Plants.ts exports not available \u2014 dynamic registry skipped`), false;
    if (!this._state) {
      this._state = { registry: e2, plantsModule: t2, plantsObj: n2, plantEnum: r2, origPlantEnum: Te(r2), origPlantEnumDescriptors: Object.getOwnPropertyDescriptors(r2), dynamicEnumKeys: [], origGetPlantEnumByCodename: ke(n2.getPlantEnumByCodename), origGetPlantFeature: ke(n2.getPlantFeature), origGetPlantProps: ke(n2.getPlantProps), origGetPlantAlmanac: ke(n2.getPlantAlmanac), origGetPlantEnumWithPropByPlantTypes: ke(n2.getPlantEnumWithPropByPlantTypes) };
      let i2 = this;
      n2.getPlantEnumByCodename = Ae(function(e3, t3 = true) {
        if (typeof e3 == `string` && e3.startsWith(`tool_powertile_`)) return i2._state.origGetPlantEnumByCodename.call(this, e3, t3);
        let n3 = i2._resolveRuntimeIndex(e3, false);
        return Number.isFinite(n3) ? n3 : t3 ? (console.warn(`Can't find '${e3}' as a Plant Codename.`), 0) : NaN;
      }, i2._state.origGetPlantEnumByCodename), n2.getPlantFeature = Ae(function(e3) {
        return i2._getFeatureById(e3, true) || i2._state.origGetPlantFeature.call(this, e3);
      }, i2._state.origGetPlantFeature), n2.getPlantProps = Ae(function(e3) {
        let t3 = i2._getFeatureById(e3, true), n3 = be(t3?.PROPS) || t3?.CODENAME;
        return i2._state.registry.propsByAlias.get(n3) || i2._state.origGetPlantProps.call(this, e3);
      }, i2._state.origGetPlantProps), n2.getPlantAlmanac = Ae(function(e3, t3) {
        let n3 = t3 || i2._getFeatureById(e3, true), r3 = be(n3?.ALMANAC) || n3?.CODENAME, a2 = i2._state.registry.almanacByAlias.get(r3);
        if (!a2) return i2._state.origGetPlantAlmanac.call(this, e3, t3);
        let o2 = {};
        for (let [e4, t4] of Object.entries(a2)) o2[e4] = Se(t4);
        if (t3) {
          let e4 = be(t3.ALMANAC), n4 = i2._state.registry.almanacByAlias.get(e4);
          if (n4) for (let [e5, t4] of Object.entries(n4)) t4 != null && (o2[e5] = Se(t4));
        }
        return o2;
      }, i2._state.origGetPlantAlmanac), n2.getPlantEnumWithPropByPlantTypes = Ae(function(e3) {
        let t3 = i2._state.origGetPlantEnumWithPropByPlantTypes ? i2._state.origGetPlantEnumWithPropByPlantTypes.call(this, e3) : null, n3 = this.getPlantType(e3);
        if (n3?.PlantRedirection?.length) {
          let e4 = we(n3.PlantRedirection);
          if (e4) return this.getPlantEnumWithPropByPlantTypes(e4);
        }
        let r3 = i2._resolveRuntimeIndex(e3, false);
        if (!Number.isFinite(r3) && n3?.PlantBasedOn && (r3 = i2._resolveRuntimeIndex(n3.PlantBasedOn, false)), !Number.isFinite(r3)) return t3;
        let a2 = Number(t3?.id), o2 = Number.isFinite(a2) && a2 === r3, s2 = be(n3?.Properties), c2 = Oe(n3?.Properties, `PlantProperties`), l2 = i2._state.registry.propsByAlias.get(s2), u2 = null;
        (c2 || l2) && (u2 = this.getFilledPlantProps(c2 || l2, r3)), !u2 && o2 && (u2 = t3?.prop);
        let d2 = o2 ? t3?.spf : null;
        return !d2 && n3?.ShiftedPlantFeatures && (d2 = De(this.getPlantFeature(r3), n3.ShiftedPlantFeatures)), { ...t3 || {}, id: r3, prop: u2 || t3?.prop, spf: d2, filled_type: n3 };
      }, i2._state.origGetPlantEnumWithPropByPlantTypes);
    }
    return this._state.registry = e2, this._rebuildPlantEnum(this._state.plantEnum), this._syncDerivedPlantLists(this._state.plantsObj), pe.info(`[plant] Dynamic registry active: ${e2.features.length} feature(s), ${e2.typeByAlias.size} type alias(es), ${e2.propsByAlias.size} prop alias(es)`), true;
  }
  restore() {
    if (!this._state) return;
    let { plantsObj: e2, plantEnum: t2, origPlantEnumDescriptors: n2, origGetPlantEnumByCodename: r2, origGetPlantFeature: i2, origGetPlantProps: a2, origGetPlantAlmanac: o2, origGetPlantEnumWithPropByPlantTypes: s2 } = this._state;
    e2 && (r2 && (e2.getPlantEnumByCodename = r2), i2 && (e2.getPlantFeature = i2), a2 && (e2.getPlantProps = a2), o2 && (e2.getPlantAlmanac = o2), s2 && (e2.getPlantEnumWithPropByPlantTypes = s2)), t2 && n2 && Ee(t2, n2), this._state = null, pe.info(`[plant] Dynamic registry restored`);
  }
  getDebugInfo() {
    let e2 = this._state?.registry;
    return e2 ? { featureCount: e2.features.length, typeCount: e2.typeByAlias.size, propCount: e2.propsByAlias.size, almanacCount: e2.almanacByAlias.size, codenames: e2.features.map((e3) => e3?.CODENAME).filter(Boolean) } : null;
  }
}, Ne = new i(`plant-levels`), w = `wood`, Pe = /* @__PURE__ */ new Set([`wood`, `silver`, `gold`, `star`]);
function Fe(e2) {
  if (typeof e2 != `object` || !e2) return e2;
  try {
    return structuredClone(e2);
  } catch {
    return JSON.parse(JSON.stringify(e2));
  }
}
function Ie(e2) {
  return typeof e2 == `string` && /^RTID\((.+?)@[^)]+\)$/.exec(e2.trim())?.[1] || ``;
}
function Le(e2, t2 = []) {
  let n2 = /* @__PURE__ */ new Set(), r2 = m(e2)?.json;
  for (let e3 of r2?.objects || []) {
    let t3 = String(e3?.aliases?.[0] || ``).trim();
    t3 && n2.add(t3);
  }
  for (let e3 of Array.isArray(t2) ? t2 : []) for (let t3 of e3?.objects || []) {
    let e4 = String(t3?.aliases?.[0] || ``).trim();
    e4 && n2.add(e4);
  }
  return n2;
}
function Re(e2 = []) {
  let t2 = { plantFeatures: [], plantTypes: [], plantProps: [], plantAlmanac: [] };
  for (let n2 of Array.isArray(e2) ? e2 : []) {
    let e3 = n2?.plantData || null;
    e3?.plantFeatures && t2.plantFeatures.push(e3.plantFeatures), e3?.plantTypes && t2.plantTypes.push(e3.plantTypes), e3?.plantProps && t2.plantProps.push(e3.plantProps), e3?.plantAlmanac && t2.plantAlmanac.push(e3.plantAlmanac);
  }
  return t2;
}
function ze(e2 = []) {
  let t2 = Re(e2), n2 = m(`PlantFeatures`)?.json, r2 = Array.isArray(n2?.PLANTS) ? n2.PLANTS : [], i2 = t2.plantFeatures.flatMap((e3) => Array.isArray(e3?.PLANTS) ? e3.PLANTS : []);
  if (!r2.length && !i2.length) return null;
  let a2 = /* @__PURE__ */ new Map();
  for (let e3 of r2) {
    let t3 = String(e3?.CODENAME || ``).trim();
    t3 && a2.set(t3, e3);
  }
  for (let e3 of i2) {
    let t3 = String(e3?.CODENAME || ``).trim();
    t3 && a2.set(t3, e3);
  }
  return { featureByCodename: a2, typeAliases: Le(`PlantTypes`, t2.plantTypes), propsAliases: Le(`PlantProps`, t2.plantProps), almanacAliases: Le(`PlantAlmanac`, t2.plantAlmanac) };
}
function Be(e2, t2, n2, r2) {
  let i2 = t2.featureByCodename.get(e2);
  if (!i2) return n2.push(`${r2}: missing PlantFeatures entry '${e2}'`), false;
  let a2 = Ie(i2.TYPE) || e2, o2 = Ie(i2.PROPS) || e2, s2 = Ie(i2.ALMANAC) || e2;
  return t2.typeAliases.has(a2) || n2.push(`${r2}: missing PlantTypes alias '${a2}'`), t2.propsAliases.has(o2) || n2.push(`${r2}: missing PlantProps alias '${o2}'`), t2.almanacAliases.has(s2) || n2.push(`${r2}: missing PlantAlmanac alias '${s2}'`), n2.length === 0;
}
function Ve(e2, t2, n2, r2) {
  if (n2 == null || n2 === ``) return w;
  let i2 = String(n2 || ``).trim().toLowerCase();
  return Pe.has(i2) ? i2 : (r2.push(`${e2}: level ${t2} has invalid icon '${n2}' (expected wood/silver/gold/star)`), w);
}
function He(e2, t2, n2, r2) {
  if (n2 == null) return null;
  if (typeof n2 == `string`) return String(n2 || ``).trim() || (r2.push(`${e2}: level ${t2} has empty displayName`), null);
  if (typeof n2 == `object` && !Array.isArray(n2)) {
    let i2 = {};
    for (let [e3, t3] of Object.entries(n2 || {})) {
      if (typeof t3 != `string`) continue;
      let n3 = t3.trim();
      n3 && (i2[e3] = n3);
    }
    return typeof i2[`zh-CN`] == `string` && typeof i2.zh != `string` && (i2.zh = i2[`zh-CN`]), Object.keys(i2).length === 0 ? (r2.push(`${e2}: level ${t2} has empty displayName`), null) : i2;
  }
  return r2.push(`${e2}: level ${t2} displayName must be a string or localized object`), null;
}
function Ue(e2, t2, n2, r2, i2) {
  let a2 = Number(t2);
  if (!Number.isInteger(a2) || a2 < 1) return i2.push(`${e2}: invalid level '${t2}'`), null;
  let o2 = ``, s2 = w, c2 = null, l2 = false;
  if (typeof n2 == `string`) o2 = String(n2 || ``).trim();
  else if (n2 && typeof n2 == `object` && !Array.isArray(n2)) o2 = String(n2.cloneCodename || ``).trim(), s2 = Ve(e2, a2, n2.icon, i2), c2 = He(e2, a2, n2.displayName, i2), l2 = n2.hideText === true;
  else return i2.push(`${e2}: level ${a2} must be a string or object`), null;
  return o2 ? (Be(o2, r2, i2, `${e2} level ${a2}`), { level: a2, cloneCodename: o2, badgeIcon: s2, displayName: c2, hideText: l2 }) : (i2.push(`${e2}: level ${a2} has empty clone codename`), null);
}
function We(e2, t2, n2) {
  let r2 = [], i2 = String(e2 || ``).trim();
  if (!i2) return r2.push(`base codename is empty`), { valid: false, errors: r2 };
  if (!t2 || typeof t2 != `object` || Array.isArray(t2)) return r2.push(`${i2}: expected object config`), { valid: false, errors: r2 };
  Be(i2, n2, r2, i2);
  let a2 = t2.levels;
  if (!a2 || typeof a2 != `object` || Array.isArray(a2)) return r2.push(`${i2}: levels must be an object`), { valid: false, errors: r2 };
  let o2 = [], s2 = /* @__PURE__ */ new Set(), c2 = false;
  for (let [e3, t3] of Object.entries(a2)) {
    let a3 = Ue(i2, e3, t3, n2, r2);
    if (!a3) continue;
    let { level: l2, cloneCodename: u2 } = a3;
    if (s2.has(u2)) {
      r2.push(`${i2}: duplicate clone codename '${u2}'`);
      continue;
    }
    s2.add(u2), u2 === i2 && (c2 = true), o2.push(a3);
  }
  if (o2.length === 0) return r2.push(`${i2}: no valid levels found`), { valid: false, errors: r2 };
  o2.sort((e3, t3) => e3.level - t3.level);
  for (let e3 = 0; e3 < o2.length; e3++) {
    let t3 = e3 + 1;
    if (o2[e3].level !== t3) {
      r2.push(`${i2}: levels must be contiguous from 1 (missing ${t3})`);
      break;
    }
  }
  return r2.length > 0 ? { valid: false, errors: r2 } : { valid: true, baseCodename: i2, levels: Object.fromEntries(o2.map((e3) => [e3.level, e3.cloneCodename])), levelMeta: Object.fromEntries(o2.map((e3) => [e3.level, { cloneCodename: e3.cloneCodename, badgeIcon: e3.badgeIcon, displayName: e3.displayName, hideText: e3.hideText === true }])), levelEntries: o2, levelNumbers: o2.map((e3) => e3.level), maxLevel: o2[o2.length - 1].level, usesBaseAsLevel: c2, ui: t2.ui && typeof t2.ui == `object` && !Array.isArray(t2.ui) ? Fe(t2.ui) : {}, almanacUpgrade: t2.almanacUpgrade && typeof t2.almanacUpgrade == `object` && !Array.isArray(t2.almanacUpgrade) ? Fe(t2.almanacUpgrade) : {} };
}
function Ge() {
  return new Ke();
}
var Ke = class {
  constructor() {
    this._state = null;
  }
  apply(e2 = []) {
    let t2 = ze(e2);
    if (!t2) return Ne.warn(`[plant-levels] Plant data assets are not ready; registry skipped`), this._state = { index: null, baseConfigs: /* @__PURE__ */ new Map(), cloneToBase: /* @__PURE__ */ new Map(), cloneToLevel: /* @__PURE__ */ new Map() }, false;
    let n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Map(), i2 = /* @__PURE__ */ new Map();
    for (let a2 of Array.isArray(e2) ? e2 : []) {
      let e3 = String(a2?.source || a2?.name || a2?.dir || `unknown-source`), o2 = a2?.data;
      if (!o2) continue;
      if (typeof o2 != `object` || Array.isArray(o2)) {
        Ne.warn(`[${e3}] plant-levels root must be an object`);
        continue;
      }
      let s2 = Object.prototype.hasOwnProperty.call(o2, `plants`), c2 = s2 ? o2.plants : o2;
      if (s2 && (!c2 || typeof c2 != `object` || Array.isArray(c2))) {
        Ne.warn(`[${e3}] plant-levels.plants must be an object`);
        continue;
      }
      for (let [a3, o3] of Object.entries(c2 || {})) {
        if (a3 === `$schema`) continue;
        let s3 = We(a3, o3, t2);
        if (!s3.valid) {
          for (let t3 of s3.errors) Ne.warn(`[${e3}] ${t3}`);
          continue;
        }
        let c3 = n2.get(s3.baseCodename);
        if (c3) for (let e4 of c3.levelEntries) e4.cloneCodename !== c3.baseCodename && (r2.delete(e4.cloneCodename), i2.delete(e4.cloneCodename));
        let l2 = false;
        for (let t3 of s3.levelEntries) {
          if (t3.cloneCodename === s3.baseCodename) continue;
          let n3 = r2.get(t3.cloneCodename);
          if (n3 && n3 !== s3.baseCodename) {
            Ne.warn(`[${e3}] ${s3.baseCodename}: clone '${t3.cloneCodename}' is already owned by '${n3}'`), l2 = true;
            break;
          }
        }
        if (l2) {
          if (c3) for (let e4 of c3.levelEntries) e4.cloneCodename !== c3.baseCodename && (r2.set(e4.cloneCodename, c3.baseCodename), i2.set(e4.cloneCodename, e4.level));
          continue;
        }
        n2.set(s3.baseCodename, s3);
        for (let e4 of s3.levelEntries) e4.cloneCodename !== s3.baseCodename && (r2.set(e4.cloneCodename, s3.baseCodename), i2.set(e4.cloneCodename, e4.level));
        Ne.info(`[${e3}] Registered plant levels for '${s3.baseCodename}' (${s3.maxLevel} level(s))`);
      }
    }
    return this._state = { index: t2, baseConfigs: n2, cloneToBase: r2, cloneToLevel: i2 }, Ne.info(`[plant-levels] Registry active: ${n2.size} base plant(s), ${r2.size} clone mapping(s)`), n2.size > 0;
  }
  restore() {
    this._state && (this._state = null, Ne.info(`[plant-levels] Registry restored`));
  }
  getConfig(e2) {
    let t2 = String(e2 || ``).trim();
    return !t2 || !this._state?.baseConfigs ? null : this._state.baseConfigs.get(t2) || null;
  }
  getBaseCodename(e2) {
    let t2 = String(e2 || ``).trim();
    return !t2 || !this._state ? null : this._state.baseConfigs.has(t2) ? t2 : this._state.cloneToBase.get(t2) || null;
  }
  getCloneCodenameForLevel(e2, t2) {
    let n2 = this.getConfig(e2);
    return n2 && n2.levels?.[Number(t2)] || null;
  }
  getLevelForCodename(e2) {
    let t2 = String(e2 || ``).trim();
    return !t2 || !this._state?.cloneToLevel ? null : this._state.cloneToLevel.get(t2) ?? null;
  }
  getExactLevelForCodename(e2) {
    let t2 = String(e2 || ``).trim();
    if (!t2 || !this._state?.baseConfigs) return null;
    let n2 = this._state.cloneToLevel?.get(t2);
    if (Number.isInteger(n2) && n2 >= 1) return n2;
    let r2 = this.getBaseCodename(t2), i2 = r2 ? this.getConfig(r2) : null;
    return i2?.levelEntries?.length ? i2.levelEntries.find((e3) => e3?.cloneCodename === t2)?.level ?? null : null;
  }
  getLevelBindingForCodename(e2) {
    let t2 = String(e2 || ``).trim();
    if (!t2) return null;
    let n2 = this.getBaseCodename(t2);
    if (!n2) return null;
    let r2 = this.getConfig(n2);
    if (!r2) return null;
    let i2 = this.getExactLevelForCodename(t2);
    return !Number.isInteger(i2) || i2 < 1 ? null : { codename: t2, baseCodename: n2, level: i2, config: r2, levelEntry: this.getLevelEntry(n2, i2) };
  }
  getLevelEntry(e2, t2) {
    let n2 = this.getConfig(e2);
    if (!n2) return null;
    let r2 = Number(t2);
    return !Number.isInteger(r2) || r2 < 1 ? null : n2.levelEntries?.find((e3) => e3.level === r2) || null;
  }
  getLevelBadgeIcon(e2, t2) {
    return this.getLevelEntry(e2, t2)?.badgeIcon || w;
  }
  getLevelDisplayName(e2, t2) {
    return this.getLevelEntry(e2, t2)?.displayName || null;
  }
  getBaseEntries() {
    return this._state?.baseConfigs ? Array.from(this._state.baseConfigs.values()) : [];
  }
  getDebugInfo() {
    let e2 = this.getBaseEntries();
    return { baseCount: e2.length, cloneCount: this._state?.cloneToBase?.size || 0, bases: e2.map((e3) => ({ baseCodename: e3.baseCodename, maxLevel: e3.maxLevel, levels: Fe(e3.levels), levelMeta: Fe(e3.levelMeta), usesBaseAsLevel: e3.usesBaseAsLevel === true, showInAlmanac: e3.ui?.showInAlmanac === true, showLevelBadge: e3.ui?.showLevelBadge === true, almanacUpgradeEnabled: e3.almanacUpgrade?.enabled === true })) };
  }
}, qe = new i(`plant-level-bridge`), Je = `chunks:///_virtual/PlayerProperties.ts`, Ye = `chunks:///_virtual/Plants.ts`, Xe = Symbol.for(`gp-next.wrapperOriginal`), Ze = `plant-level-bridge`;
function Qe(e2) {
  if (typeof e2 != `function`) return e2;
  let t2 = e2[Xe];
  return typeof t2 == `function` ? t2 : e2;
}
function $e(e2, t2) {
  if (typeof e2 != `function`) return e2;
  try {
    e2[Symbol.for(`gp-next.wrapperOwner`)] = Ze, e2[Xe] = Qe(t2);
  } catch {
  }
  return e2;
}
function et(e2 = {}) {
  return new tt(e2);
}
var tt = class {
  constructor(e2 = {}) {
    this._registry = e2.plantLevelRegistry || null, this._stateApi = e2.plantLevelState || null, this._state = null, this._syncing = false;
  }
  _getEntries() {
    return (this._registry?.getBaseEntries?.() || []).map((e2) => ({ baseCodename: e2.baseCodename, config: e2 }));
  }
  _bridge(e2 = {}) {
    if (!this._stateApi?.bridgePlantLevelStates) return { changed: false, count: 0, syncedProgress: 0, syncedSharedFields: 0 };
    let t2 = this._getEntries();
    return t2.length ? this._stateApi.bridgePlantLevelStates(t2, { persist: false, syncProgress: e2.syncProgress !== false, syncSharedFields: e2.syncSharedFields !== false }) : { changed: false, count: 0, syncedProgress: 0, syncedSharedFields: 0 };
  }
  _persistWithOriginalSave() {
    if (!this._state?.origSavePP) return false;
    try {
      return this._syncing = true, this._state.origSavePP.call(this._state.allPlayerProperties), true;
    } finally {
      this._syncing = false;
    }
  }
  _getPlantsObject() {
    return b(Ye)?.plants || null;
  }
  _getUnlockBindingByPlantId(e2) {
    let t2 = Number(e2);
    if (!Number.isFinite(t2) || !this._registry) return null;
    let n2 = this._state?.plantsObj || this._getPlantsObject(), r2 = n2?.getPlantFeature?.call(n2, t2), i2 = String(r2?.CODENAME || ``).trim();
    return i2 && this._registry.getLevelBindingForCodename?.(i2) || null;
  }
  _bridgeUnlockFromPlantId(e2) {
    let t2 = this._getUnlockBindingByPlantId(e2);
    if (!t2?.baseCodename || !t2?.config || !Number.isInteger(t2?.level)) return null;
    let n2 = this._stateApi?.getPlantLevelState?.(t2.baseCodename, t2.config) || null, r2 = Number(n2?.unlockedLevel) || 0, i2 = Math.max(r2, t2.level);
    if (i2 < 1) return null;
    this._stateApi?.setUnlockedLevel?.(t2.baseCodename, i2, t2.config, { persist: false, autoSelect: false });
    let a2 = this._stateApi?.bridgePlantLevelStates?.([{ baseCodename: t2.baseCodename, config: t2.config }], { persist: false, syncProgress: true }) || { changed: false, count: 0, syncedProgress: 0 };
    return { ...t2, summary: a2, changed: i2 !== r2 || a2.changed || a2.syncedProgress > 0 };
  }
  syncNow(e2 = {}) {
    let t2 = this._bridge(e2);
    return t2.changed && e2.persist !== false && this._persistWithOriginalSave(), t2;
  }
  apply() {
    let e2 = y(Je, `AllPlayerProperties`);
    if (!e2?.savePP) return qe.warn(`[plant-levels] AllPlayerProperties.savePP not available \u2014 bridge skipped`), false;
    this._state ||= { allPlayerProperties: e2, origSavePP: Qe(e2.savePP), origUnlockPlant: Qe(e2.unlockPlant), plantsObj: this._getPlantsObject() };
    let t2 = this;
    e2.savePP = $e(function(...e3) {
      return t2._syncing || t2._bridge({ syncProgress: true }), t2._state.origSavePP.apply(this, e3);
    }, t2._state.origSavePP), typeof this._state.origUnlockPlant == `function` && (e2.unlockPlant = $e(function(...e3) {
      if (!t2._syncing) try {
        t2._bridgeUnlockFromPlantId(e3[0]);
      } catch (e4) {
        qe.warn(`[plant-levels] unlock bridge failed before unlockPlant`, e4);
      }
      return t2._state.origUnlockPlant.apply(this, e3);
    }, t2._state.origUnlockPlant));
    let n2 = this.syncNow({ persist: true, syncProgress: true });
    return n2.changed || n2.syncedProgress > 0 || n2.syncedSharedFields > 0 ? qe.info(`[plant-levels] Bridge synced ${n2.count} base entr${n2.count === 1 ? `y` : `ies`}, ${n2.syncedProgress} progress write(s), ${n2.syncedSharedFields} shared-field write(s)`) : qe.info(`[plant-levels] Bridge active: no pending sync needed`), true;
  }
  restore() {
    return this._state?.allPlayerProperties?.savePP ? (this._state.allPlayerProperties.savePP = this._state.origSavePP, typeof this._state.origUnlockPlant == `function` && (this._state.allPlayerProperties.unlockPlant = this._state.origUnlockPlant), this._state = null, this._syncing = false, qe.info(`[plant-levels] Bridge restored`), true) : false;
  }
  getStatus() {
    return { applied: !!this._state, syncing: this._syncing };
  }
}, nt = new i(`plant-level-resolver`), rt = `chunks:///_virtual/Plants.ts`, it = Symbol.for(`gp-next.wrapperOriginal`), at = `plant-level-resolver`;
function ot(e2, t2) {
  let n2 = Math.max(1, Number(t2?.maxLevel) || 1), r2 = Math.max(0, Math.min(n2, Number(e2?.unlockedLevel) || 0)), i2 = Math.max(1, Math.min(n2, Number(e2?.selectedLevel) || 1));
  return r2 < 1 ? 0 : Math.min(i2, r2);
}
function st(e2) {
  return typeof e2 == `function` ? e2 : null;
}
function ct(e2, t2) {
  if (typeof e2 != `function`) return e2;
  try {
    e2[Symbol.for(`gp-next.wrapperOwner`)] = at, e2[it] = st(t2);
  } catch {
  }
  return e2;
}
function lt(e2 = {}) {
  return new ut(e2);
}
var ut = class {
  constructor(e2 = {}) {
    this._registry = e2.plantLevelRegistry || null, this._stateApi = e2.plantLevelState || null, this._state = null;
  }
  _shouldBypassSceneResolution() {
    return p?.() === `storeScene`;
  }
  _getCurrentState(e2, t2) {
    return !e2 || !t2 || !this._stateApi ? null : typeof this._stateApi.getPlantLevelState == `function` ? this._stateApi.getPlantLevelState(e2, t2) : typeof this._stateApi.get == `function` ? this._stateApi.get(e2, t2) : null;
  }
  _resolveEffectiveCloneCodename(e2) {
    if (!e2 || !this._registry) return null;
    let t2 = this._registry.getConfig?.(e2);
    if (!t2) return null;
    let n2 = ot(this._getCurrentState(e2, t2), t2);
    return n2 < 1 ? null : this._registry.getCloneCodenameForLevel?.(e2, n2) || this._registry.getCloneCodename?.(e2, n2) || null;
  }
  _resolveEffectiveCodename(e2) {
    if (e2 == null) return e2;
    let t2 = String(e2 || ``).trim();
    if (!t2 || !this._registry?.getBaseCodename || this._shouldBypassSceneResolution()) return t2;
    let n2 = this._registry.getBaseCodename(t2);
    return !n2 || n2 !== t2 ? t2 : this._resolveEffectiveCloneCodename(n2) || t2;
  }
  _resolveEffectiveId(e2, t2) {
    let n2 = Number(e2);
    if (!Number.isFinite(n2) || !t2 || !this._state || this._shouldBypassSceneResolution()) return e2;
    let r2 = this._state.origGetPlantFeature?.call(t2, n2), i2 = String(r2?.CODENAME || ``).trim();
    if (!i2) return e2;
    let a2 = this._resolveEffectiveCodename(i2);
    if (!a2 || a2 === i2) return e2;
    let o2 = this._state.origGetPlantEnumByCodename?.call(t2, a2, true);
    return Number.isFinite(Number(o2)) ? o2 : e2;
  }
  apply() {
    let e2 = b(rt)?.plants;
    if (!e2) return nt.warn(`[plant-levels] Plants.ts exports not available \u2014 resolver skipped`), false;
    this._state ||= { plantsObj: e2, origGetPlantEnumByCodename: st(e2.getPlantEnumByCodename), origGetPlantEnumWithPropByPlantTypes: st(e2.getPlantEnumWithPropByPlantTypes), origGetPlantsInCard: st(e2.getPlantsInCard), origLoadPlantsInCard: st(e2.loadPlantsInCard), origGetPlantBGSprite: st(e2.getPlantBGSprite), origGetPlantFeature: st(e2.getPlantFeature) };
    let t2 = this;
    return typeof this._state.origGetPlantEnumByCodename == `function` && (e2.getPlantEnumByCodename = ct(function(e3, n2 = true) {
      return t2._state.origGetPlantEnumByCodename.call(this, t2._resolveEffectiveCodename(e3), n2);
    }, t2._state.origGetPlantEnumByCodename)), typeof this._state.origGetPlantEnumWithPropByPlantTypes == `function` && (e2.getPlantEnumWithPropByPlantTypes = ct(function(e3) {
      return t2._state.origGetPlantEnumWithPropByPlantTypes.call(this, t2._resolveEffectiveCodename(e3));
    }, t2._state.origGetPlantEnumWithPropByPlantTypes)), typeof this._state.origGetPlantsInCard == `function` && (e2.getPlantsInCard = ct(function(e3, ...n2) {
      return t2._state.origGetPlantsInCard.call(this, t2._resolveEffectiveId(e3, this), ...n2);
    }, t2._state.origGetPlantsInCard)), typeof this._state.origLoadPlantsInCard == `function` && (e2.loadPlantsInCard = ct(function(e3, ...n2) {
      return t2._state.origLoadPlantsInCard.call(this, t2._resolveEffectiveId(e3, this), ...n2);
    }, t2._state.origLoadPlantsInCard)), typeof this._state.origGetPlantBGSprite == `function` && (e2.getPlantBGSprite = ct(function(e3, ...n2) {
      return t2._state.origGetPlantBGSprite.call(this, t2._resolveEffectiveId(e3, this), ...n2);
    }, t2._state.origGetPlantBGSprite)), nt.info(`[plant-levels] Runtime resolver active`), true;
  }
  restore() {
    if (!this._state?.plantsObj) return false;
    let { plantsObj: e2, origGetPlantEnumByCodename: t2, origGetPlantEnumWithPropByPlantTypes: n2, origGetPlantsInCard: r2, origLoadPlantsInCard: i2, origGetPlantBGSprite: a2 } = this._state;
    return typeof t2 == `function` && (e2.getPlantEnumByCodename = t2), typeof n2 == `function` && (e2.getPlantEnumWithPropByPlantTypes = n2), typeof r2 == `function` && (e2.getPlantsInCard = r2), typeof i2 == `function` && (e2.loadPlantsInCard = i2), typeof a2 == `function` && (e2.getPlantBGSprite = a2), this._state = null, nt.info(`[plant-levels] Runtime resolver restored`), true;
  }
  getStatus() {
    return { applied: !!this._state };
  }
}, dt = 32, T = `GPNextPlantLevelBadge`, ft = `GPNextPlantLevelBadgeIcon`, pt = /* @__PURE__ */ new Set([T, ft, `GPNextPlantLevelBadge`, `GPNextLevelBadge`, `GpnPlantLevelBadge`, `PlantLevelBadge`, `LevelBadge`]), mt = `wood`, ht = { wood: `Wood`, silver: `Silver`, gold: `Gold`, star: `Star` }, gt = { wood: `bk_lv_wood`, silver: `bk_lv_silver`, gold: `bk_lv_gold`, star: `bk_lv_star` }, _t = { default: { badgePosXMul: 0.15, badgePosYMul: 0.17, badgeScale: 0.6, iconOffsetXMul: 0.36, iconOffsetYMul: -0.1, iconScale: 0.8, forceAlign: null }, card: { badgePosXMul: 0.15, badgePosYMul: 0.17, badgeScale: 0.6, iconOffsetXMul: 0.36, iconOffsetYMul: -0.1, iconScale: 0.8, forceAlign: null }, "upper-slot": { badgePosXMul: 0.15, badgePosYMul: 0.17, badgeScale: 0.6, iconOffsetXMul: 0.36, iconOffsetYMul: -0.1, iconScale: 0.8, forceAlign: null }, store: { badgePosXMul: 0.92, badgePosYMul: 0.72, badgeScale: 0.9, iconOffsetXMul: 0.5, iconOffsetYMul: -0.12, iconScale: 1.3, forceAlign: null } }, vt = null, yt = null, bt = /* @__PURE__ */ new Map();
function E() {
  return window.cc || null;
}
function D(e2) {
  if (!e2) return false;
  let t2 = E();
  if (typeof t2?.isValid == `function`) try {
    return t2.isValid(e2);
  } catch {
    return false;
  }
  return e2.isValid !== false;
}
function xt(e2) {
  let t2 = String(e2?.name || ``);
  if (!t2) return false;
  if (pt.has(t2)) return true;
  let n2 = t2.toLowerCase();
  return n2.includes(`level`) && n2.includes(`badge`) || n2.includes(`gpn`) && n2.includes(`badge`);
}
function St(e2) {
  if (!D(e2)) return false;
  try {
    if (typeof e2.destroy == `function`) return e2.destroy(), true;
  } catch {
  }
  return false;
}
function Ct(e2, t2) {
  if (!D(e2) || typeof t2 != `function`) return;
  let n2 = Array.isArray(e2.children) ? e2.children.slice() : [];
  for (let e3 of n2) D(e3) && t2(e3) !== false && Ct(e3, t2);
}
function wt(e2) {
  Ct(e2, (e3) => xt(e3) ? (St(e3), false) : true);
}
function Tt(e2, t2, n2) {
  if (!t2 || !n2 || typeof e2?.getCloneCodenameForLevel != `function` && typeof e2?.getCloneCodename != `function`) return null;
  for (let r2 = 1; r2 <= dt; r2 += 1) if ((e2?.getCloneCodenameForLevel?.(t2, r2) ?? e2?.getCloneCodename?.(t2, r2)) === n2) return r2;
  return null;
}
function Et(e2, t2, n2) {
  if (!n2 || !t2) return null;
  let r2 = null;
  if (typeof t2?.getPlantLevelState == `function`) {
    let i3 = typeof e2?.getConfig == `function` ? e2.getConfig(n2) : null;
    r2 = i3 ? t2.getPlantLevelState(n2, i3) : null;
  } else typeof t2?.get == `function` && (r2 = t2.get(n2));
  let i2 = Number(r2?.selectedLevel);
  return Number.isFinite(i2) && i2 >= 1 ? i2 : null;
}
function Dt(e2, t2) {
  let n2 = t2?.[0];
  if (typeof n2 == `string` && n2) return n2;
  let r2 = e2?.feature?.CODENAME;
  if (typeof r2 == `string` && r2) return r2;
  let i2 = e2?.cardType || e2?._cardType || e2?.plantTypeString;
  return typeof i2 == `string` && i2 ? i2 : null;
}
function Ot(e2) {
  let t2 = e2?.ca?._priceDB || null;
  return !t2 || !D(t2) || !D(t2.node) ? null : t2;
}
function O(e2) {
  return D(e2) && e2._components?.find((e3) => e3 && `string` in e3) || null;
}
function kt(e2, t2) {
  if (!D(e2) || !t2) return null;
  try {
    return e2.getChildByName?.(t2) || null;
  } catch {
    return null;
  }
}
function At(e2) {
  let t2 = e2?.parent || null;
  return D(t2) ? t2 : null;
}
function k(e2, t2, n2) {
  let r2 = At(t2), i2 = [e2?.__gpnPlantLevelBadgeIconNode, e2?.__gpnPlantLevelBadgeIconSpriteNode, kt(r2, n2), kt(t2, n2)];
  for (let e3 of i2) if (D(e3) && String(e3.name || ``) === n2) return e3;
  return null;
}
function jt(e2, t2, n2 = null) {
  let r2 = [At(t2), t2], i2 = /* @__PURE__ */ new Set([ft, `${ft}Sprite`]), a2 = D(n2) ? n2 : null;
  for (let e3 of r2) if (!(!D(e3) || !Array.isArray(e3.children))) for (let t3 of e3.children.slice()) D(t3) && i2.has(String(t3.name || ``)) && (a2 && t3 === a2 || St(t3));
  a2 && e2 && (String(a2.name || ``) === ft ? e2.__gpnPlantLevelBadgeIconNode = a2 : String(a2.name || ``) === `${ft}Sprite` && (e2.__gpnPlantLevelBadgeIconSpriteNode = a2));
}
function Mt(e2) {
  let t2 = E()?.assetManager?.assets?._map;
  return t2 && Object.values(t2).find((t3) => t3?._name === e2) || null;
}
function Nt(e2 = [], t2 = null) {
  let n2 = Array.isArray(e2) ? e2 : [e2];
  for (let e3 of n2) {
    let n3 = Mt(e3);
    if (n3 && !(typeof t2 == `function` && !t2(n3))) return n3;
  }
  return null;
}
function Pt() {
  if (D(vt?.dragonAsset) && D(vt?.atlasAsset)) return vt;
  let e2 = Nt([`SeedPacker`, `SeedPacker_ske`], (e3) => e3?._dragonBonesJson != null), t2 = Nt([`SeedPacker_tex`, `SeedPacker`], (e3) => e3?._atlasJsonData != null || e3?._atlasJson != null);
  return !e2 || !t2 ? null : (vt = { dragonAsset: e2, atlasAsset: t2 }, vt);
}
function Ft() {
  if (yt) return yt;
  let e2 = Pt()?.atlasAsset;
  if (!e2) return null;
  let t2 = e2.atlasJsonData || e2._atlasJsonData || e2.atlasJson || e2._atlasJson || null;
  if (!t2) return null;
  try {
    yt = typeof t2 == `string` ? JSON.parse(t2) : t2;
  } catch {
    yt = null;
  }
  return yt;
}
function A(e2) {
  let t2 = E(), n2 = O(e2), r2 = t2?.HorizontalTextAlignment || null, i2 = Number(n2?.horizontalAlign);
  return r2 && i2 === r2.RIGHT ? { side: `right`, value: i2 } : r2 && i2 === r2.LEFT ? { side: `left`, value: i2 } : i2 === 2 ? { side: `right`, value: i2 } : i2 === 0 ? { side: `left`, value: i2 } : { side: `center`, value: i2 };
}
function It(e2 = `card`) {
  return _t[e2] || _t.default;
}
function Lt(e2, t2 = `card`) {
  if (!D(e2)) return false;
  let n2 = E(), r2 = O(e2);
  if (!r2) return false;
  let i2 = It(t2), a2 = n2?.HorizontalTextAlignment || null;
  try {
    i2.forceAlign === `right` ? r2.horizontalAlign = a2?.RIGHT ?? 2 : i2.forceAlign === `left` ? r2.horizontalAlign = a2?.LEFT ?? 0 : i2.forceAlign === `center` && (r2.horizontalAlign = a2?.CENTER ?? 1);
  } catch {
  }
  return true;
}
function Rt(e2) {
  if (!D(e2)) return false;
  let t2 = E(), n2 = t2?.Widget, r2 = t2?.Layout, i2 = t2?.UITransform;
  try {
    let t3 = typeof n2 == `function` ? e2.getComponent?.(n2) : null;
    t3 && (t3.enabled = false, `isAlignLeft` in t3 && (t3.isAlignLeft = false), `isAlignRight` in t3 && (t3.isAlignRight = false), `isAlignTop` in t3 && (t3.isAlignTop = false), `isAlignBottom` in t3 && (t3.isAlignBottom = false), `isAlignHorizontalCenter` in t3 && (t3.isAlignHorizontalCenter = false), `isAlignVerticalCenter` in t3 && (t3.isAlignVerticalCenter = false));
  } catch {
  }
  try {
    let t3 = typeof r2 == `function` ? e2.getComponent?.(r2) : null;
    t3 && (t3.enabled = false);
  } catch {
  }
  try {
    let t3 = typeof i2 == `function` ? e2.getComponent?.(i2) : null;
    t3 && (`anchorX` in t3 && (t3.anchorX = 0.5), `anchorY` in t3 && (t3.anchorY = 0.5));
  } catch {
  }
  return true;
}
function zt(e2, t2, n2 = `card`) {
  let r2 = E();
  if (!D(e2) || !D(t2)) return false;
  let i2 = e2.parent || null;
  if (!D(i2)) return false;
  let a2 = It(n2);
  try {
    t2.parent !== i2 && (t2.parent = i2);
  } catch {
  }
  let o2 = typeof r2?.UITransform == `function` ? e2.getComponent(r2.UITransform) : null, s2 = Number(o2?.width) || 140, c2 = Number(o2?.height) || 96, l2 = A(e2), u2 = s2 * (Number(a2.iconOffsetXMul) || 0), d2 = l2.side === `right` ? u2 : l2.side === `left` ? -u2 : 0, f2 = c2 * (Number(a2.iconOffsetYMul) || 0), p2 = Number(a2.iconScale) || 0.8, m2 = e2.position || { x: 0, y: 0, z: 0 };
  t2.active = true;
  try {
    t2.setPosition(Number(m2.x || 0) + d2, Number(m2.y || 0) + f2, Number(m2.z || 0));
  } catch {
  }
  try {
    typeof t2.setLayerWithAllChildren == `function` ? t2.setLayerWithAllChildren(i2.layer) : `layer` in t2 && `layer` in i2 && (t2.layer = i2.layer);
  } catch {
  }
  try {
    let n3 = typeof e2.getSiblingIndex == `function` ? e2.getSiblingIndex() : i2.children.indexOf(e2);
    typeof t2.setSiblingIndex == `function` && Number.isFinite(n3) && t2.setSiblingIndex(Math.max(0, n3 - 1)), typeof e2.setSiblingIndex == `function` && e2.setSiblingIndex(i2.children.length - 1);
  } catch {
  }
  try {
    let e3 = t2.scale?.clone?.() || t2.scale;
    e3 && typeof e3 == `object` && (e3.x = p2, e3.y = p2, t2.scale = e3);
  } catch {
  }
  return true;
}
function Bt(e2) {
  if (!D(e2)) return null;
  let t2 = E()?.dragonBones?.ArmatureDisplay;
  if (typeof t2 != `function`) return null;
  try {
    return e2.getComponent?.(t2) ?? null;
  } catch {
    return null;
  }
}
function Vt(e2, t2, n2 = `card`) {
  let r2 = E(), i2 = r2?.dragonBones?.ArmatureDisplay;
  if (!D(t2) || typeof i2 != `function`) return null;
  let a2 = k(e2, t2, ft), o2 = D(e2?.__gpnPlantLevelBadgeIconDisplay) && e2.__gpnPlantLevelBadgeIconDisplay || Bt(a2);
  if (a2 && o2) return jt(e2, t2, a2), zt(t2, a2, n2), e2.__gpnPlantLevelBadgeIconNode = a2, e2.__gpnPlantLevelBadgeIconDisplay = o2, o2;
  let s2 = Pt();
  if (!s2) return null;
  let c2 = a2;
  if (!D(c2)) try {
    c2 = new r2.Node(ft);
  } catch {
    return null;
  }
  if (!D(c2)) return null;
  try {
    c2.parent !== t2 && (c2.parent = t2);
  } catch {
  }
  try {
    typeof r2?.UITransform == `function` && !c2.getComponent?.(r2.UITransform) && c2.addComponent(r2.UITransform);
  } catch {
  }
  let l2 = Bt(c2);
  if (!l2) try {
    l2 = c2.addComponent(i2);
  } catch {
    return null;
  }
  if (!l2) return null;
  try {
    l2.dragonAsset = s2.dragonAsset, l2.dragonAtlasAsset = s2.atlasAsset, l2._dragonAsset = s2.dragonAsset, l2._dragonAtlasAsset = s2.atlasAsset, l2.armatureName = `lv`, l2._armatureName = `lv`;
  } catch {
  }
  return jt(e2, t2, c2), zt(t2, c2, n2), e2.__gpnPlantLevelBadgeIconNode = c2, e2.__gpnPlantLevelBadgeIconDisplay = l2, l2;
}
function Ht(e2) {
  let t2 = E(), n2 = t2?.SpriteFrame, r2 = t2?.Rect, i2 = t2?.Size, a2 = t2?.Vec2;
  if (typeof n2 != `function` || typeof r2 != `function` || typeof i2 != `function` || typeof a2 != `function`) return null;
  let o2 = Pt(), s2 = Ft(), c2 = o2?.atlasAsset?._texture || o2?.atlasAsset?.texture || o2?.atlasAsset?._textureSource || o2?.atlasAsset?.textureSource || null;
  if (!s2 || !c2) return null;
  let l2 = Array.isArray(s2?.SubTexture) ? s2.SubTexture.find((t3) => t3?.name === e2) : null;
  if (!l2) return null;
  let u2 = Number(l2.width || 0), d2 = Number(l2.height || 0);
  if (u2 <= 0 || d2 <= 0) return null;
  let f2 = new r2(Number(l2.x || 0), Number(l2.y || 0), u2, d2), p2 = new i2(Number(l2.frameWidth || u2), Number(l2.frameHeight || d2)), m2 = new a2(Number(l2.frameX || 0), Number(l2.frameY || 0)), h2 = new n2();
  try {
    typeof h2.reset == `function` ? h2.reset({ texture: c2, rect: f2, originalSize: p2, offset: m2, isRotate: false, borderTop: 0, borderBottom: 0, borderLeft: 0, borderRight: 0 }) : (h2.texture = c2, h2.rect = f2, h2.originalSize = p2, h2.offset = m2, h2.rotated = false);
  } catch {
    return null;
  }
  return h2;
}
function Ut(e2) {
  let t2 = gt[String(e2 || mt).trim().toLowerCase()] || gt[mt];
  if (!t2) return null;
  if (bt.has(t2)) return bt.get(t2) || null;
  let n2 = Ht(t2);
  return bt.set(t2, n2 || null), n2 || null;
}
function Wt() {
  let e2 = Pt(), t2 = Ft(), n2 = e2?.atlasAsset?._texture || e2?.atlasAsset?.texture || e2?.atlasAsset?._textureSource || e2?.atlasAsset?.textureSource || null;
  return { dragonAssetName: String(e2?.dragonAsset?._name || ``), atlasAssetName: String(e2?.atlasAsset?._name || ``), hasDragonAsset: !!e2?.dragonAsset, hasAtlasAsset: !!e2?.atlasAsset, hasAtlasData: !!t2, hasAtlasTexture: !!n2, cachedSpriteFrames: bt.size };
}
function Gt(e2, t2, n2 = `card`) {
  let r2 = E(), i2 = r2?.Sprite;
  if (!D(t2) || typeof i2 != `function`) return null;
  let a2 = `${ft}Sprite`, o2 = k(e2, t2, a2);
  if (!D(o2)) try {
    o2 = new r2.Node(a2);
  } catch {
    return null;
  }
  if (!D(o2)) return null;
  try {
    o2.parent !== t2 && (o2.parent = t2);
  } catch {
  }
  try {
    typeof r2?.UITransform == `function` && !o2.getComponent?.(r2.UITransform) && o2.addComponent(r2.UITransform);
  } catch {
  }
  let s2 = o2.getComponent?.(i2) || null;
  if (!s2) try {
    s2 = o2.addComponent(i2);
  } catch {
    return null;
  }
  return s2 ? (jt(e2, t2, o2), zt(t2, o2, n2), e2.__gpnPlantLevelBadgeIconSpriteNode = o2, e2.__gpnPlantLevelBadgeIconSprite = s2, s2) : null;
}
function Kt(e2, t2, n2, r2 = `card`) {
  let i2 = String(n2 || mt).trim().toLowerCase(), a2 = ht[i2] || ht[mt], o2 = Ut(i2), s2 = o2 ? Gt(e2, t2, r2) : null;
  if (s2 && o2) {
    try {
      s2.spriteFrame = o2;
    } catch {
    }
    try {
      let e3 = E()?.UITransform, t4 = typeof e3 == `function` ? s2.node?.getComponent?.(e3) : null;
      t4 && o2?.originalSize && t4.setContentSize?.(o2.originalSize);
    } catch {
    }
    s2.node.active = true;
    let t3 = e2?.__gpnPlantLevelBadgeIconNode || null;
    return D(t3) && (t3.active = false), true;
  }
  let c2 = Vt(e2, t2, r2);
  if (!c2) return false;
  let l2 = e2?.__gpnPlantLevelBadgeIconNode || c2?.node || null;
  l2 && zt(t2, l2, r2);
  try {
    c2.armatureName = `lv`, c2._armatureName = `lv`;
  } catch {
  }
  try {
    c2.animationName = a2, c2._animationName = a2;
  } catch {
  }
  try {
    c2.playAnimation?.(a2, 1);
  } catch {
  }
  return true;
}
function qt(e2, t2, n2 = `card`) {
  let r2 = E();
  if (!D(e2) || !D(t2)) return false;
  let i2 = It(n2);
  try {
    t2.parent !== e2 && (t2.parent = e2);
  } catch {
  }
  t2.active = true, Rt(t2), Lt(t2, n2);
  let a2 = typeof r2?.UITransform == `function` ? e2.getComponent(r2.UITransform) : null, o2 = Number(a2?.width) || 180, s2 = Number(a2?.height) || 240, c2 = o2 * (Number(i2.badgePosXMul) || 0), l2 = s2 * (Number(i2.badgePosYMul) || 0);
  try {
    t2.setPosition(c2, l2, 0);
  } catch {
  }
  try {
    t2.setSiblingIndex(e2.children.length - 1);
  } catch {
  }
  try {
    typeof t2.setLayerWithAllChildren == `function` ? t2.setLayerWithAllChildren(e2.layer) : `layer` in t2 && `layer` in e2 && (t2.layer = e2.layer);
  } catch {
  }
  try {
    let e3 = t2.scale?.clone?.() || t2.scale;
    if (e3 && typeof e3 == `object`) {
      let n3 = Number(i2.badgeScale) || 0.6;
      e3.x = n3, e3.y = n3, t2.scale = e3;
    }
  } catch {
  }
  return true;
}
function Jt(e2, t2, n2 = `card`, r2 = null) {
  let i2 = r2 || e2?.node || null, a2 = E();
  if (!D(i2) || !D(t2?.node) || typeof a2?.instantiate != `function`) return null;
  let o2 = D(e2?.__gpnPlantLevelBadgeNode) && e2.__gpnPlantLevelBadgeNode || i2.getChildByName?.(T) || null, s2 = o2 && D(o2) && O(o2) || null;
  if (o2 && s2) return qt(i2, o2, n2), e2.__gpnPlantLevelBadgeNode = o2, e2.__gpnPlantLevelBadgeLabel = s2, e2.__gpnPlantLevelBadgeHostNode = i2, s2;
  wt(i2);
  let c2 = null;
  try {
    c2 = a2.instantiate(t2.node);
  } catch {
    return null;
  }
  if (!D(c2)) return null;
  c2.name = T, Rt(c2), Lt(c2, n2), qt(i2, c2, n2);
  let l2 = O(c2);
  return l2 ? (e2.__gpnPlantLevelBadgeNode = c2, e2.__gpnPlantLevelBadgeLabel = l2, e2.__gpnPlantLevelBadgeHostNode = i2, l2) : (St(c2), null);
}
function Yt(e2, t2, n2) {
  if (!n2 || typeof e2?.getBaseCodename != `function`) return null;
  let r2 = e2.getBaseCodename(n2) || n2;
  return r2 ? r2 === n2 ? Et(e2, t2, r2) || null : Tt(e2, r2, n2) : null;
}
function Xt(e2) {
  return `LVL ${e2}`;
}
function Zt(e2, t2, n2) {
  if (!n2 || typeof e2?.getBaseCodename != `function`) return null;
  let r2 = e2.getBaseCodename(n2) || n2;
  if (!r2) return null;
  let i2 = Yt(e2, t2, n2);
  if (!i2) return null;
  let a2 = typeof e2?.getConfig == `function` ? e2.getConfig(r2) : null, o2 = typeof e2?.getLevelEntry == `function` ? e2.getLevelEntry(r2, i2) : null;
  return { baseCodename: r2, level: i2, config: a2, badgeIcon: o2?.badgeIcon || mt, displayName: o2?.hideText === true ? `` : o2?.displayName ?? Xt(i2) };
}
function Qt(e2, t2) {
  if (!t2 || typeof e2?.getLevelBindingForCodename != `function`) return null;
  let n2 = e2.getLevelBindingForCodename(t2);
  return !n2?.baseCodename || !Number.isInteger(n2?.level) ? null : { baseCodename: n2.baseCodename, level: n2.level, config: n2.config || null, badgeIcon: n2.levelEntry?.badgeIcon || mt, displayName: n2.levelEntry?.hideText === true ? `` : n2.levelEntry?.displayName ?? Xt(n2.level) };
}
function $t(e2 = {}) {
  let { engine: t2 = null, logger: n2 = console, plantLevelRegistry: r2 = null, plantLevelState: i2 = null } = e2, a2 = false, o2 = null, s2 = /* @__PURE__ */ new Set();
  function c2(e3, t3) {
    try {
      n2?.warn?.(`[GP-Next][PlantLevelBadge] ${e3}`, t3);
    } catch {
    }
  }
  function l2(e3) {
    if (e3 == null) return ``;
    if (typeof e3 == `string`) return e3;
    let n3 = t2?.getClassByName?.(`MultiLanguage`) || null;
    if (n3 && typeof n3.getString == `function`) try {
      return String(n3.getString(e3, false) || ``);
    } catch {
    }
    return String(e3?.en || e3?.zh || e3?.es || e3?.[`zh-CN`] || ``);
  }
  function u2() {
    return t2?.getClassByName?.(`CardFeature`) || E()?.js?.getClassByName?.(`CardFeature`) || null;
  }
  function d2() {
    return t2?.getClassByName?.(`CardUIUpper`) || E()?.js?.getClassByName?.(`CardUIUpper`) || null;
  }
  function f2() {
    return t2?.getClassByName?.(`Conveyor`) || E()?.js?.getClassByName?.(`Conveyor`) || null;
  }
  function p2() {
    return t2?.getClassByName?.(`Cards`) || E()?.js?.getClassByName?.(`Cards`) || null;
  }
  function m2() {
    return t2?.getClassByName?.(`StoreCommodity`) || E()?.js?.getClassByName?.(`StoreCommodity`) || null;
  }
  function h2() {
    return t2?.getClassByName?.(`LevelIsland`) || E()?.js?.getClassByName?.(`LevelIsland`) || null;
  }
  function g2() {
    return t2?.getSystemModule?.(`chunks:///_virtual/Plants.ts`)?.plants || null;
  }
  function _2(e3) {
    if (!D(e3)) return null;
    let t3 = u2();
    if (!t3) return null;
    let n3 = typeof e3.getComponent == `function` ? e3.getComponent(t3) : null;
    if (n3) return n3;
    let r3 = Array.isArray(e3.children) ? e3.children.slice() : [];
    for (; r3.length; ) {
      let e4 = r3.shift();
      if (D(e4)) {
        try {
          let n4 = typeof e4.getComponent == `function` ? e4.getComponent(t3) : null;
          if (n4) return n4;
        } catch {
        }
        Array.isArray(e4.children) && e4.children.length && r3.push(...e4.children);
      }
    }
    return null;
  }
  function v2(e3) {
    let t3 = e3?.cf || null;
    if (t3) return t3;
    let n3 = e3?.CardUpper || e3?.node?.getChildByName?.(`CardUpper`) || null;
    if (n3) {
      let e4 = _2(n3);
      if (e4) return e4;
    }
    return _2(e3?.node || null);
  }
  function y2(e3) {
    if (!e3) return;
    let t3 = e3.__gpnPlantLevelBadgeNode;
    D(t3) ? t3.active = false : wt(e3.__gpnPlantLevelBadgeHostNode || e3.node);
    let n3 = e3.__gpnPlantLevelBadgeIconNode;
    D(n3) && (n3.active = false);
    let r3 = e3.__gpnPlantLevelBadgeIconSpriteNode;
    D(r3) && (r3.active = false), e3.__gpnPlantLevelBadgeIconNode = null, e3.__gpnPlantLevelBadgeIconDisplay = null, e3.__gpnPlantLevelBadgeIconSpriteNode = null, e3.__gpnPlantLevelBadgeIconSprite = null, e3.__gpnPlantLevelBadgeMeta = null, e3.__gpnPlantLevelBadgeVisible = false, e3.__gpnPlantLevelBadgeHostNode = null;
  }
  function b2(e3, t3, n3 = `card`) {
    if (!e3) return;
    let a3 = Zt(r2, i2, Dt(e3, t3)), o3 = a3?.level || null, c3 = a3?.config || null;
    if (!o3 || c3?.ui?.showLevelBadge === false) {
      y2(e3);
      return;
    }
    let u3 = Jt(e3, Ot(e3), n3);
    if (!u3) return;
    let d3 = l2(a3.displayName);
    u3.string = d3, u3.node && (u3.node.active = true, e3.__gpnPlantLevelBadgeHostNode = e3.node, qt(e3.node, u3.node, n3), Kt(e3, u3.node, a3.badgeIcon, n3)), e3.__gpnPlantLevelBadgeMeta = { baseCodename: a3.baseCodename, level: o3, badgeIcon: a3.badgeIcon, displayName: d3 }, e3.__gpnPlantLevelBadgeVisible = true, s2.add(e3);
  }
  function x2(e3, t3, n3 = `card`) {
    if (!e3) return;
    let i3 = Qt(r2, String(t3 || ``).trim()), a3 = i3?.config || null;
    if (!i3?.level || a3?.ui?.showLevelBadge === false) {
      y2(e3);
      return;
    }
    let o3 = Jt(e3, Ot(e3), n3);
    if (!o3) return;
    let c3 = l2(i3.displayName);
    o3.string = c3, o3.node && (o3.node.active = true, e3.__gpnPlantLevelBadgeHostNode = e3.node, qt(e3.node, o3.node, n3), Kt(e3, o3.node, i3.badgeIcon, n3)), e3.__gpnPlantLevelBadgeMeta = { baseCodename: i3.baseCodename, level: i3.level, badgeIcon: i3.badgeIcon, displayName: c3, mode: `exact-card` }, e3.__gpnPlantLevelBadgeVisible = true, s2.add(e3);
  }
  function S2(e3, t3) {
    if (!e3) return;
    let n3 = Qt(r2, String(t3?.[0]?.CommodityName || e3?.currentCommodity?.CommodityName || ``).trim()), i3 = n3?.config || null, a3 = e3?.displaySlot || null, o3 = e3?.nameLabel || null;
    if (!n3?.level || i3?.ui?.showLevelBadge === false || !D(a3) || !D(o3?.node)) {
      y2(e3);
      return;
    }
    let c3 = Jt(e3, o3, `store`, a3);
    if (!c3) return;
    let u3 = l2(n3.displayName);
    c3.string = u3, c3.node && (c3.node.active = true, e3.__gpnPlantLevelBadgeHostNode = a3, qt(a3, c3.node, `store`), Kt(e3, c3.node, n3.badgeIcon, `store`)), e3.__gpnPlantLevelBadgeMeta = { baseCodename: n3.baseCodename, level: n3.level, badgeIcon: n3.badgeIcon, displayName: u3, mode: `store` }, e3.__gpnPlantLevelBadgeVisible = true, s2.add(e3);
  }
  function ee2(e3) {
    if (!e3?._plantOnDisplay || !Number.isFinite(Number(e3?.plantDisplayed))) return;
    let t3 = _2(e3._plantOnDisplay);
    if (!t3) return;
    let n3 = g2()?.getPlantFeature?.(Number(e3.plantDisplayed)) || null, r3 = String(n3?.CODENAME || t3?.Type || t3?.PF?.CODENAME || ``).trim();
    if (r3) try {
      x2(t3, r3, `card`);
    } catch (e4) {
      c2(`World map plant reward refresh failed`, e4);
    }
  }
  function C2(e3) {
    let t3 = v2(e3);
    if (t3) try {
      b2(t3, [t3.Type || t3.PF?.CODENAME || null], `upper-slot`);
    } catch (e4) {
      c2(`CardUIUpper refresh failed`, e4);
    }
  }
  function te2(e3) {
    let t3 = typeof e3?.getCards == `function` ? e3.getCards() : [];
    if (Array.isArray(t3)) for (let e4 of t3) try {
      b2(e4, [e4?.Type || e4?.PF?.CODENAME || null], `card`);
    } catch (e5) {
      c2(`Conveyor refresh failed`, e5);
    }
  }
  function ne2(e3, t3) {
    let n3 = t3?.cf || e3?.CFs?.[e3.CFs.length - 1] || null;
    if (n3) try {
      b2(n3, [n3.Type || n3.PF?.CODENAME || null], `upper-slot`);
    } catch (e4) {
      c2(`Cards chooser refresh failed`, e4);
    }
  }
  function re2(e3) {
    let t3 = Array.isArray(e3?.CUs) ? e3.CUs : [];
    if (t3.length) {
      for (let e4 of t3) if (v2(e4)) try {
        C2(e4);
      } catch (e5) {
        c2(`Cards upper-slot refresh failed`, e5);
      }
    }
  }
  function ie2(e3, t3 = 0.35) {
    if (!e3) return;
    let n3 = () => {
      try {
        re2(e3);
      } catch (e4) {
        c2(`Cards chooser delayed refresh failed`, e4);
      }
    };
    try {
      if (typeof e3.scheduleOnce == `function`) {
        e3.scheduleOnce(n3, t3);
        return;
      }
    } catch {
    }
    setTimeout(n3, Math.max(0, Math.round(t3 * 1e3)));
  }
  function ae2(e3, t3, n3 = null) {
    let r3 = e3?.[t3];
    return typeof r3 == `function` ? (e3[t3] = function(...e4) {
      let i3 = r3.apply(this, e4), a3 = () => {
        try {
          typeof n3 == `function` ? n3(this, e4, i3) : b2(this, e4);
        } catch (e5) {
          c2(`${t3} refresh failed`, e5);
        }
      };
      return i3 && typeof i3.then == `function` ? (i3.then(a3).catch((e5) => {
        c2(`${t3} async refresh failed`, e5);
      }), i3) : (a3(), i3);
    }, r3) : null;
  }
  function oe2() {
    let e3 = E()?.director?.getScene?.();
    D(e3) && wt(e3);
  }
  return { apply() {
    if (a2) return false;
    let e3 = u2(), t3 = d2(), n3 = f2(), r3 = p2(), i3 = m2(), s3 = h2();
    if (!e3?.prototype && !t3?.prototype && !n3?.prototype && !r3?.prototype && !i3?.prototype && !s3?.prototype) return c2(`CardFeature not found`), false;
    let l3 = e3?.prototype ? ae2(e3.prototype, `cardGrouper`) : null, g3 = e3?.prototype ? ae2(e3.prototype, `cardGrouperByType`) : null, _3 = t3?.prototype ? ae2(t3.prototype, `gameStart`, (e4) => C2(e4)) : null, v3 = n3?.prototype ? ae2(n3.prototype, `sendPlant`, (e4) => te2(e4)) : null, y3 = r3?.prototype ? ae2(r3.prototype, `addCard`, (e4, t4, n4) => {
      ne2(e4, n4), ie2(e4);
    }) : null, b3 = r3?.prototype ? ae2(r3.prototype, `addCardByType`, (e4) => {
      ne2(e4, null), ie2(e4);
    }) : null, x3 = r3?.prototype ? ae2(r3.prototype, `cardChooseOn`, (e4) => {
      ie2(e4);
    }) : null, re3 = r3?.prototype ? ae2(r3.prototype, `spliceCard`, (e4) => {
      ie2(e4);
    }) : null, se2 = i3?.prototype ? ae2(i3.prototype, `readCommodity`, (e4, t4) => {
      S2(e4, t4);
    }) : null, ce2 = s3?.prototype ? ae2(s3.prototype, `showPlant`, (e4, t4) => {
      t4?.[0] === true && ee2(e4);
    }) : null;
    return !l3 && !g3 && !_3 && !v3 && !y3 && !b3 && !x3 && !re3 && !se2 && !ce2 ? (c2(`No card grouper methods found`), false) : (o2 = { CardFeature: e3, CardUIUpper: t3, Conveyor: n3, Cards: r3, cardGrouper: l3, cardGrouperByType: g3, cardUIUpperGameStart: _3, conveyorSendPlant: v3, cardsAddCard: y3, cardsAddCardByType: b3, cardsCardChooseOn: x3, cardsSpliceCard: re3, StoreCommodity: i3, storeReadCommodity: se2, LevelIsland: s3, levelIslandShowPlant: ce2 }, a2 = true, oe2(), true);
  }, restore() {
    if (!a2) return false;
    o2?.CardFeature?.prototype && typeof o2.cardGrouper == `function` && (o2.CardFeature.prototype.cardGrouper = o2.cardGrouper), o2?.CardFeature?.prototype && typeof o2.cardGrouperByType == `function` && (o2.CardFeature.prototype.cardGrouperByType = o2.cardGrouperByType), o2?.CardUIUpper?.prototype && typeof o2.cardUIUpperGameStart == `function` && (o2.CardUIUpper.prototype.gameStart = o2.cardUIUpperGameStart), o2?.Conveyor?.prototype && typeof o2.conveyorSendPlant == `function` && (o2.Conveyor.prototype.sendPlant = o2.conveyorSendPlant), o2?.Cards?.prototype && typeof o2.cardsAddCard == `function` && (o2.Cards.prototype.addCard = o2.cardsAddCard), o2?.Cards?.prototype && typeof o2.cardsAddCardByType == `function` && (o2.Cards.prototype.addCardByType = o2.cardsAddCardByType), o2?.Cards?.prototype && typeof o2.cardsCardChooseOn == `function` && (o2.Cards.prototype.cardChooseOn = o2.cardsCardChooseOn), o2?.Cards?.prototype && typeof o2.cardsSpliceCard == `function` && (o2.Cards.prototype.spliceCard = o2.cardsSpliceCard), o2?.StoreCommodity?.prototype && typeof o2.storeReadCommodity == `function` && (o2.StoreCommodity.prototype.readCommodity = o2.storeReadCommodity), o2?.LevelIsland?.prototype && typeof o2.levelIslandShowPlant == `function` && (o2.LevelIsland.prototype.showPlant = o2.levelIslandShowPlant);
    for (let e3 of s2) try {
      y2(e3);
    } catch {
    }
    return s2.clear(), oe2(), o2 = null, a2 = false, true;
  }, getStatus() {
    return { applied: a2, liveCards: s2.size, mode: `card-and-runtime-badge`, iconSupport: Wt() };
  }, getDebugInfo() {
    return this.getStatus();
  } };
}
var en = new i(`plant-level-almanac`), tn = `chunks:///_virtual/Plants.ts`, nn = `plant-level-almanac`, rn = Symbol.for(`gp-next.wrapperOriginal`), an = Symbol.for(`gp-next.wrapperOwner`), on = `info`, sn = `level`, cn = `GPNextPlantLevelToggleButton`, ln = `GPNextPlantLevelToggleIcon`, un = `GPNextPlantLevelSwitchButton`, dn = `GPNextPlantLevelPanel`, fn = `gold`, j = `silver`;
function pn(e2) {
  if (typeof e2 != `function`) return e2;
  let t2 = e2[rn];
  return typeof t2 == `function` ? t2 : e2;
}
function mn(e2, t2) {
  if (typeof e2 != `function`) return e2;
  try {
    e2[an] = nn, e2[rn] = pn(t2);
  } catch {
  }
  return e2;
}
function M() {
  return _() || window.cc || null;
}
function N(e2) {
  if (!e2) return false;
  let t2 = M();
  if (typeof t2?.isValid == `function`) try {
    return t2.isValid(e2);
  } catch {
    return false;
  }
  return e2.isValid !== false;
}
function P(e2) {
  if (!N(e2)) return false;
  try {
    return e2.destroy?.(), true;
  } catch {
    return false;
  }
}
function hn(e2) {
  return N(e2) && e2._components?.find((e3) => e3 && e3._contentSize) || null;
}
function gn(e2, t2, n2, r2 = null) {
  if (!N(e2)) return false;
  try {
    return r2 == null ? e2.setPosition?.(t2, n2) : e2.setPosition?.(t2, n2, r2), true;
  } catch {
    return false;
  }
}
function _n(e2) {
  return N(e2) && e2._components?.find((e3) => e3 && `string` in e3) || null;
}
function vn(e2) {
  if (!N(e2)) return null;
  let t2 = _n(e2);
  if (t2) return t2;
  let n2 = Array.isArray(e2.children) ? e2.children.slice() : [];
  for (; n2.length > 0; ) {
    let e3 = n2.shift();
    if (!N(e3)) continue;
    let t3 = _n(e3);
    if (t3) return t3;
    Array.isArray(e3.children) && e3.children.length > 0 && n2.push(...e3.children);
  }
  return null;
}
function F(e2, t2) {
  return !N(e2) || !t2 ? null : e2.getChildByName?.(t2) || null;
}
function yn(e2) {
  if (e2 == null) return ``;
  if (typeof e2 == `string`) return e2;
  let t2 = h(`MultiLanguage`);
  if (typeof t2?.getString == `function`) try {
    return String(t2.getString(e2, false) || ``);
  } catch {
  }
  return typeof e2?.en == `string` ? e2.en : typeof e2?.zh == `string` ? e2.zh : ``;
}
function bn() {
  return b(tn)?.plants || null;
}
function I(e2) {
  if (N(e2)) for (let t2 of e2._components || []) t2 && (Array.isArray(t2.clickEvents) && (t2.clickEvents = []), Array.isArray(t2._clickEvents) && (t2._clickEvents = []), `interactable` in t2 && (t2.interactable = true));
}
function xn(e2) {
  if (!N(e2)) return;
  let t2 = [e2];
  for (; t2.length > 0; ) {
    let e3 = t2.pop();
    if (N(e3)) {
      for (let t3 of e3._components || []) t3 && (`_alignFlags` in t3 || `_hadAlignOnce` in t3) && (t3.enabled = false);
      Array.isArray(e3.children) && e3.children.length > 0 && t2.push(...e3.children);
    }
  }
}
function Sn(e2, t2) {
  if (!N(e2)) return;
  let n2 = vn(e2), r2 = t2 ? 0.72 : 0.68;
  try {
    e2.setScale?.(r2, r2, 1);
  } catch {
  }
  if (e2.opacity = t2 ? 255 : 224, n2?.color) try {
    n2.color.r = t2 ? 255 : 236, n2.color.g = t2 ? 232 : 236, n2.color.b = t2 ? 176 : 236, n2.color.a = 255;
  } catch {
  }
}
function Cn(e2) {
  let t2 = M()?.assetManager?.assets?._map;
  return t2 && Object.values(t2).find((t3) => t3?._name === e2) || null;
}
function wn(e2 = [], t2 = null) {
  let n2 = Array.isArray(e2) ? e2 : [e2];
  for (let e3 of n2) {
    let n3 = Cn(e3);
    if (n3 && !(typeof t2 == `function` && !t2(n3))) return n3;
  }
  return null;
}
var L = null, Tn = null, En = /* @__PURE__ */ new Map();
function Dn() {
  if (N(L?.dragonAsset) && N(L?.atlasAsset)) return L;
  let e2 = wn([`SeedPacker`, `SeedPacker_ske`], (e3) => e3?._dragonBonesJson != null), t2 = wn([`SeedPacker_tex`, `SeedPacker`], (e3) => e3?._atlasJsonData != null || e3?._atlasJson != null);
  return !e2 || !t2 ? null : (L = { dragonAsset: e2, atlasAsset: t2 }, L);
}
function On() {
  if (Tn) return Tn;
  let e2 = Dn()?.atlasAsset || null, t2 = e2?.atlasJsonData || e2?._atlasJsonData || e2?.atlasJson || e2?._atlasJson || null;
  if (!t2) return null;
  try {
    Tn = typeof t2 == `string` ? JSON.parse(t2) : t2;
  } catch {
    Tn = null;
  }
  return Tn;
}
function kn(e2) {
  let t2 = M(), n2 = t2?.SpriteFrame, r2 = t2?.Rect, i2 = t2?.Size, a2 = t2?.Vec2;
  if (typeof n2 != `function` || typeof r2 != `function` || typeof i2 != `function` || typeof a2 != `function`) return null;
  let o2 = Dn(), s2 = On(), c2 = o2?.atlasAsset?._texture || o2?.atlasAsset?.texture || o2?.atlasAsset?._textureSource || o2?.atlasAsset?.textureSource || null, l2 = Array.isArray(s2?.SubTexture) ? s2.SubTexture.find((t3) => t3?.name === e2) : null;
  if (!c2 || !l2) return null;
  let u2 = Number(l2.width || 0), d2 = Number(l2.height || 0);
  if (u2 <= 0 || d2 <= 0) return null;
  let f2 = new n2();
  try {
    typeof f2.reset == `function` && f2.reset({ texture: c2, rect: new r2(Number(l2.x || 0), Number(l2.y || 0), u2, d2), originalSize: new i2(Number(l2.frameWidth || u2), Number(l2.frameHeight || d2)), offset: new a2(Number(l2.frameX || 0), Number(l2.frameY || 0)), isRotate: false, borderTop: 0, borderBottom: 0, borderLeft: 0, borderRight: 0 });
  } catch {
    return null;
  }
  return f2;
}
function An(e2 = fn) {
  let t2 = e2 === `gold` ? `bk_lv_gold` : `bk_lv_${e2}`;
  if (En.has(t2)) return En.get(t2) || null;
  let n2 = kn(t2);
  return En.set(t2, n2 || null), n2 || null;
}
function R(e2) {
  let t2 = M(), n2 = t2?.Sprite;
  if (!N(e2) || typeof n2 != `function`) return null;
  let r2 = F(e2, ln);
  if (!N(r2)) {
    r2 = new t2.Node(ln), r2.parent = e2;
    let n3 = t2?.UITransform;
    typeof n3 == `function` && !r2.getComponent?.(n3) && r2.addComponent(n3);
  }
  let i2 = r2.getComponent?.(n2) || null;
  if (i2 ||= r2.addComponent?.(n2) || null, !i2) return null;
  let a2 = An(fn);
  if (a2) {
    i2.spriteFrame = a2;
    let e3 = hn(r2);
    e3?.setContentSize && a2.originalSize && e3.setContentSize(a2.originalSize);
  }
  return r2.setScale?.(0.72, 0.72, 1), r2;
}
function jn(e2, t2) {
  let n2 = R(e2);
  if (!N(n2)) return null;
  let r2 = n2._components?.find((e3) => e3 && `spriteFrame` in e3) || null, i2 = An(t2 || fn);
  return r2 && i2 && (r2.spriteFrame = i2), n2;
}
function Mn(e2, t2, n2) {
  if (!t2 || !Number.isFinite(Number(n2)) || Number(n2) < 1) return ``;
  let r2 = e2?.getLevelDisplayName?.(t2, Number(n2));
  return yn(r2) || `LVL ${Number(n2)}`;
}
function Nn(e2) {
  let t2 = bn();
  if (!t2 || !e2) return null;
  let n2 = null;
  try {
    n2 = t2.getPlantEnumByCodename?.(e2, true);
  } catch {
  }
  if (!Number.isFinite(Number(n2))) return null;
  let r2 = null, i2 = null, a2 = null;
  try {
    r2 = t2.getPlantFeature?.(n2) || null;
  } catch {
  }
  try {
    i2 = t2.getPlantProps?.(n2) || null;
  } catch {
  }
  try {
    a2 = t2.getPlantAlmanac?.(n2) || null;
  } catch {
  }
  return { id: Number(n2), codename: e2, feature: r2, props: i2, almanac: a2, name: yn(r2?.NAME) || e2, brief: yn(a2?.BriefIntroduction) || yn(a2?.Introduction) || `` };
}
function Pn(e2, t2, n2, r2 = null) {
  let i2 = String(n2 || ``).trim(), a2 = String(r2 || ``).trim(), o2 = i2 || a2;
  if (!e2 || !o2) return null;
  let s2 = e2.getBaseCodename?.(o2);
  if (!s2) return null;
  let c2 = e2.getConfig?.(s2);
  if (!c2 || c2.ui?.showInAlmanac === false) return null;
  let l2 = t2?.getPlantLevelState?.(s2, c2) || null, u2 = Math.max(0, Number(l2?.unlockedLevel) || 0), d2 = u2 > 0 ? Math.max(1, Math.min(u2, Number(l2?.selectedLevel) || 1)) : 0, f2 = (i2 && i2 !== s2 ? e2.getLevelForCodename?.(i2) : null) || d2 || 1, p2 = e2.getCloneCodenameForLevel?.(s2, f2) || a2 || i2, m2 = d2 > 0 ? e2.getCloneCodenameForLevel?.(s2, d2) || p2 : null, h2 = u2 < (Number(c2.maxLevel) || 1) ? u2 + 1 : 0;
  return { baseCodename: s2, config: c2, unlockedLevel: u2, selectedLevel: d2, currentLevel: f2, entryCodename: i2 || p2, currentCodename: a2 || p2, currentCloneCodename: p2, selectedCloneCodename: m2, nextLevel: h2, levels: (c2.levelEntries || []).map((t3) => ({ level: t3.level, codename: t3.cloneCodename, label: Mn(e2, s2, t3.level), state: t3.level === d2 ? `selected` : t3.level <= u2 ? `unlocked` : `locked`, snapshot: Nn(t3.cloneCodename) })), currentSnapshot: Nn(p2), nextSnapshot: h2 > 0 ? Nn(e2.getCloneCodenameForLevel?.(s2, h2)) : null };
}
function Fn(e2) {
  let t2 = e2?.almanacUpgrade;
  if (!t2 || typeof t2 != `object` || Array.isArray(t2)) return false;
  if (t2.enabled === true || typeof t2.lockedReasonText == `string` && t2.lockedReasonText.trim()) return true;
  let n2 = t2.costs;
  return !!(n2 && typeof n2 == `object` && !Array.isArray(n2) && Object.keys(n2).length > 0);
}
function In(e2) {
  return !e2?.config || e2.config.ui?.showInAlmanac === false ? false : Fn(e2.config) ? true : Array.isArray(e2.levels) && e2.levels.length > 1;
}
function Ln(e2) {
  return e2 ? [g(`plantLevels.almanac.highestLevel`, `LVL ${e2.config?.maxLevel || e2.currentLevel}`), g(`plantLevels.almanac.currentLevel`, `LVL ${e2.currentLevel}`), g(`plantLevels.almanac.unlockedLevel`, e2.unlockedLevel > 0 ? `LVL ${e2.unlockedLevel}` : g(`plantLevels.almanac.none`))].join(`
`) : g(`plantLevels.almanac.noData`);
}
function z(e2) {
  if (!e2?.currentSnapshot) return g(`plantLevels.almanac.noLevels`);
  let t2 = [g(`plantLevels.almanac.currentCodenameTitle`), e2.currentSnapshot.codename || e2.currentCloneCodename || g(`plantLevels.almanac.none`)], n2 = String(e2.currentSnapshot.brief || ``).trim();
  return n2 && (t2.push(``), t2.push(g(`plantLevels.almanac.currentBriefTitle`)), t2.push(n2)), t2.join(`
`);
}
function Rn(e2) {
  return e2 ? `` : g(`plantLevels.almanac.noData`);
}
function zn(e2) {
  if (!e2?.levels?.length) return [];
  let t2 = Math.max(0, Number(e2.unlockedLevel) || 0);
  return e2.levels.filter((e3) => Number(e3?.level) >= 1 && Number(e3.level) <= t2).map((e3) => Number(e3.level));
}
function Bn(e2) {
  return !e2?.baseCodename || !e2?.entryCodename || e2.entryCodename !== e2.baseCodename ? false : zn(e2).length > 1;
}
function Vn(e2, t2, n2) {
  let r2 = e2?.[t2];
  return typeof r2 == `function` ? (e2[t2] = mn(function(...e3) {
    let i2 = r2.apply(this, e3), a2 = () => {
      try {
        n2?.(this, e3, i2);
      } catch (e4) {
        en.warn(`[plant-levels] Almanac ${t2} hook failed`, e4);
      }
    };
    return i2 && typeof i2.then == `function` ? (i2.then(a2).catch((e4) => {
      en.warn(`[plant-levels] Almanac ${t2} async hook failed`, e4);
    }), i2) : (a2(), i2);
  }, r2), r2) : null;
}
function Hn(e2 = {}) {
  return new Un(e2);
}
var Un = class {
  constructor(e2 = {}) {
    this._registry = e2.plantLevelRegistry || null, this._stateApi = e2.plantLevelState || null, this._state = null;
  }
  _ensurePageState(e2) {
    if (!e2 || !N(e2.node)) return null;
    if (e2.__gpnPlantLevelAlmanacState && N(e2.__gpnPlantLevelAlmanacState.levelPanel)) return e2.__gpnPlantLevelAlmanacState;
    let t2 = M();
    if (!t2?.instantiate) return null;
    let n2 = F(F(e2.node, `window`), `Introduction`), r2 = F(e2.node, `window`), i2 = F(e2.node, `windowLime`), a2 = e2.viewMap_button?.node || F(F(e2.node, `windowLime`), `ViewButton`);
    if (!N(n2) || !N(a2) || !N(r2) || !N(i2)) return null;
    let o2 = t2.instantiate(n2);
    if (!N(o2)) return null;
    o2.name = dn, o2.active = false, o2.parent = n2.parent, gn(o2, n2.position?.x || 0, n2.position?.y || 0, n2.position?.z || 0);
    let s2 = F(F(F(o2, `view`), `content`), `elements`), c2 = F(F(F(o2, `view`), `content`), `texts`), l2 = F(c2, `introduction`), u2 = F(c2, `special`), d2 = F(c2, `chat`);
    s2 && (s2.active = false), u2 && (u2.active = true);
    let f2 = vn(l2), p2 = vn(u2), m2 = vn(d2), h2 = t2.instantiate(a2);
    h2.name = cn, h2.parent = i2, h2.active = false, xn(h2), I(h2), R(h2);
    let _2 = t2.instantiate(a2);
    _2.name = un, _2.parent = o2, _2.active = false, xn(_2), I(_2);
    let v2 = vn(h2);
    v2 && (v2.string = g(`plantLevels.almanac.toggleToLevel`));
    let y2 = vn(_2);
    y2 && (y2.string = ``);
    let b2 = { introNode: n2, windowNode: r2, windowLimeNode: i2, levelPanel: o2, summaryLabel: f2, levelsLabel: p2, detailsLabel: m2, summaryNode: l2, levelsNode: u2, detailsNode: d2, toggleButton: h2, toggleLabel: v2, levelSwitchButton: _2, levelSwitchLabel: y2, activeTab: on, hasLevelData: false, showToggle: false }, x2 = (e3) => {
      b2.activeTab = e3 === sn ? sn : on, b2.introNode.active = b2.activeTab !== sn, b2.levelPanel.active = b2.showToggle && b2.activeTab === sn, this._updateToggleButton(b2);
    };
    return h2.on?.(t2.Node.EventType.TOUCH_END, () => {
      b2.showToggle && x2(b2.activeTab === sn ? on : sn);
    }), _2.on?.(t2.Node.EventType.TOUCH_END, () => {
      this._cycleSelectedLevel(e2, b2);
    }), x2(on), e2.__gpnPlantLevelAlmanacState = b2, b2;
  }
  _layoutToggleButton(e2, t2 = ``) {
    let n2 = e2?.toggleButton;
    if (!N(n2)) return;
    let r2 = hn(n2), i2 = String(t2 || ``).trim(), a2 = Math.max(338, Math.min(468, 200 + i2.length * 38));
    r2?.setContentSize ? r2.setContentSize(a2, 108) : r2?._contentSize && (r2._contentSize.width = a2, r2._contentSize.height = 108);
    let o2 = F(n2, ln);
    N(o2) && gn(o2, -(a2 * 0.18), 4, 0);
    let s2 = e2.toggleLabel || vn(n2);
    s2?.node && gn(s2.node, a2 * 0.07, s2.node.position?.y || 0, s2.node.position?.z || 0);
    let c2 = e2.windowLimeNode, l2 = F(c2, `PD`), u2 = hn(F(l2, `plantDisplayBackground`)), d2 = Number(l2?.position?.x || 0), f2 = Number(l2?.position?.y || 0), p2 = Number(u2?._contentSize?.width || u2?.width || 555), m2 = Number(u2?._contentSize?.height || u2?.height || 470), h2 = Number(n2.scale?.x || 0.84), g2 = a2 * h2, _2 = 108 * h2;
    gn(n2, d2 + p2 * 0.5 - 18 - g2 * 0.5, f2 - m2 * 0.5 + 18 + _2 * 0.5, 0);
  }
  _layoutLevelSwitchButton(e2, t2 = ``) {
    let n2 = e2?.levelSwitchButton;
    if (!N(n2)) return;
    let r2 = hn(n2), i2 = String(t2 || ``).trim(), a2 = Math.max(260, Math.min(360, 152 + i2.length * 24));
    r2?.setContentSize ? r2.setContentSize(a2, 92) : r2?._contentSize && (r2._contentSize.width = a2, r2._contentSize.height = 92);
    let o2 = e2.levelSwitchLabel || vn(n2);
    o2?.node && gn(o2.node, 0, o2.node.position?.y || 0, o2.node.position?.z || 0);
    let s2 = hn(e2.levelPanel), c2 = Number(s2?._contentSize?.width || s2?.width || 1830), l2 = Number(s2?._contentSize?.height || s2?.height || 808), u2 = Number(n2.scale?.x || 0.56), d2 = a2 * u2, f2 = 92 * u2;
    gn(n2, c2 * 0.5 - 38 - d2 * 0.5, l2 * 0.5 - 34 - f2 * 0.5, 0);
  }
  async _applyInfoPanelFromModel(e2, t2) {
    if (!e2 || !t2?.currentSnapshot?.almanac) return false;
    let n2 = t2.currentSnapshot, r2 = n2.almanac, i2 = f(), a2 = i2?.getPlantProgressByID?.(n2.id) || i2?.currentPlayer?.plantProps?.[n2.codename] || null;
    e2.plantNameLabel && (e2.plantNameLabel.string = n2.name || n2.codename || ``), e2.introductionLabel && (e2.introductionLabel.string = e2.getIntroduction?.(r2) || ``);
    let o2 = e2.getSpecial?.(r2) || ``;
    if (e2.specialLabel && (e2.specialLabel.string = o2, e2.specialLabel.node && (e2.specialLabel.node.active = o2.length > 0)), e2.chatLabel && (e2.chatLabel.string = e2.getChat?.(r2) || ``), e2.costumeScroller) {
      let t3 = Array.isArray(a2?.costumes) ? a2.costumes : [];
      e2.costumeScroller.active = t3.length > 0;
    }
    try {
      e2.getPlantElements?.(n2.id, r2);
    } catch {
    }
    try {
      await e2.getPlantDis?.(n2.id, r2, Number(a2?.progress || 0) <= 0);
    } catch {
    }
    return true;
  }
  _scheduleInfoPanelSync(e2, t2) {
    if (!e2 || !t2) return;
    let n2 = Number(e2.__gpnPlantLevelInfoSyncToken || 0) + 1;
    e2.__gpnPlantLevelInfoSyncToken = n2, Promise.resolve().then(async () => {
      e2.__gpnPlantLevelInfoSyncToken === n2 && await this._applyInfoPanelFromModel(e2, t2);
    }).catch((e3) => {
      en.warn(`[plant-levels] Almanac info sync failed`, e3);
    });
  }
  _refreshPlantCardList(e2) {
    if (!e2 || !Array.isArray(e2.plantCFs) || e2.plantCFs.length <= 0) return false;
    let t2 = f(), n2 = false;
    for (let r2 of e2.plantCFs) {
      if (!r2 || typeof r2.cardGrouperByType != `function`) continue;
      let i2 = String(r2.Type || ``).trim();
      if (i2) try {
        r2.cardGrouperByType(i2);
        let a2 = t2?.getPlantProgressByID?.(r2.oID) || null;
        if (r2.PlayerProps = a2, r2.ca && (r2.ca.locked = Number(a2?.progress || 0) <= 0), r2.ca) {
          let t3 = r2 === e2.currentPlantCF;
          r2.ca.chosen = t3, r2.ca.Chosen = +!!t3;
        }
        n2 = true;
      } catch (e3) {
        en.warn(`[plant-levels] Almanac card list refresh failed`, e3);
      }
    }
    return n2;
  }
  _updateLevelSwitchButton(e2, t2) {
    let n2 = e2?.levelSwitchButton;
    if (!N(n2)) return;
    let r2 = zn(t2), i2 = Bn(t2);
    if (n2.active = i2, !i2) return;
    let a2 = Number(t2?.currentLevel) || Number(r2[0]) || 1, o2 = g(`plantLevels.almanac.levelSwitch`, `${a2}`, `${Number(t2?.unlockedLevel) || a2}`), s2 = e2.levelSwitchLabel || vn(n2);
    s2 && (s2.string = o2), Sn(n2, true), this._layoutLevelSwitchButton(e2, o2);
  }
  _cycleSelectedLevel(e2, t2) {
    if (!e2 || !t2?.showToggle) return false;
    let n2 = bn()?.getPlantFeature?.(e2?.currentPlantCF?.ID), r2 = String(e2?.currentPlantCF?.Type || ``).trim(), i2 = String(n2?.CODENAME || ``).trim(), a2 = Pn(this._registry, this._stateApi, r2, i2);
    if (!Bn(a2)) return false;
    let o2 = zn(a2);
    if (o2.length <= 1) return false;
    let s2 = Number(a2?.currentLevel) || o2[0], c2 = o2[(Math.max(0, o2.indexOf(s2)) + 1) % o2.length], l2 = a2?.config || null;
    return !l2 || !a2?.baseCodename || !Number.isInteger(c2) ? false : (this._stateApi?.setSelectedLevel?.(a2.baseCodename, c2, l2, { persist: true }), this._refreshPage(e2), true);
  }
  _updateToggleButton(e2) {
    if (!e2) return;
    let t2 = e2.toggleLabel || vn(e2.toggleButton);
    if (e2.toggleButton.active = e2.showToggle === true, !e2.showToggle) return;
    let n2 = e2.activeTab !== sn, r2 = g(n2 ? `plantLevels.almanac.toggleToLevel` : `plantLevels.almanac.toggleToInfo`);
    t2 && (t2.string = r2), jn(e2.toggleButton, n2 ? fn : j), Sn(e2.toggleButton, true), this._layoutToggleButton(e2, r2);
  }
  _refreshPage(e2) {
    let t2 = this._ensurePageState(e2);
    if (!t2) return false;
    this._refreshPlantCardList(e2);
    let n2 = bn()?.getPlantFeature?.(e2?.currentPlantCF?.ID), r2 = String(e2?.currentPlantCF?.Type || ``).trim(), i2 = String(n2?.CODENAME || ``).trim(), a2 = Pn(this._registry, this._stateApi, r2, i2), o2 = !!a2;
    return t2.hasLevelData = o2, t2.showToggle = o2 && In(a2), t2.levelPanel.active = t2.showToggle && t2.activeTab === sn, t2.showToggle ? (t2.summaryLabel && (t2.summaryLabel.string = Ln(a2)), t2.levelsLabel && (t2.levelsLabel.string = z(a2)), t2.detailsLabel && (t2.detailsLabel.string = Rn(a2)), t2.levelsNode && (t2.levelsNode.active = true), t2.detailsNode && (t2.detailsNode.active = t2.detailsLabel ? String(t2.detailsLabel.string || ``).trim().length > 0 : false), t2.introNode.active = t2.activeTab !== sn, t2.levelPanel.active = t2.activeTab === sn, this._updateLevelSwitchButton(t2, a2), this._updateToggleButton(t2), this._scheduleInfoPanelSync(e2, a2), true) : (t2.activeTab = on, t2.introNode.active = true, t2.summaryLabel && (t2.summaryLabel.string = g(`plantLevels.almanac.noData`)), t2.levelsLabel && (t2.levelsLabel.string = g(`plantLevels.almanac.noLevels`)), t2.detailsLabel && (t2.detailsLabel.string = ``), t2.levelsNode && (t2.levelsNode.active = true), t2.detailsNode && (t2.detailsNode.active = false), t2.levelSwitchButton && (t2.levelSwitchButton.active = false), this._updateToggleButton(t2), true);
  }
  _cleanupPage(e2) {
    let t2 = e2?.__gpnPlantLevelAlmanacState;
    t2 && (P(t2.toggleButton), P(t2.levelSwitchButton), P(t2.levelPanel), N(t2.introNode) && (t2.introNode.active = true), e2.__gpnPlantLevelAlmanacState = null);
  }
  apply() {
    let e2 = h(`AlmanacPlantPage`), t2 = h(`Almanac`);
    if (!e2?.prototype) return en.warn(`[plant-levels] AlmanacPlantPage class not found \u2014 almanac level page skipped`), false;
    if (!this._state) {
      let n3 = e2.prototype;
      this._state = { proto: n3, almanacProto: t2?.prototype || null, offLocaleChange: v(() => {
        let e3 = h(`Almanac`)?.component?.almanacPlant || null;
        e3 && this._refreshPage(e3);
      }), originals: { start: Vn(n3, `start`, (e3) => this._refreshPage(e3)), init: Vn(n3, `init`, (e3) => this._refreshPage(e3)), switchPlantID: Vn(n3, `switchPlantID`, (e3) => this._refreshPage(e3)), refresh: Vn(n3, `refresh`, (e3) => this._refreshPage(e3)), close: Vn(n3, `close`, (e3) => this._refreshPage(e3)) }, almanacOriginals: {} }, t2?.prototype && (this._state.almanacOriginals.switchToPlants = Vn(t2.prototype, `switchToPlants`, (e3) => this._refreshPage(e3?.almanacPlant || null)), this._state.almanacOriginals.refresh = Vn(t2.prototype, `refresh`, (e3) => this._refreshPage(e3?.almanacPlant || null)));
    }
    let n2 = h(`Almanac`)?.component?.almanacPlant || null;
    return n2 && this._refreshPage(n2), en.info(`[plant-levels] Almanac level page hook active`), true;
  }
  restore() {
    if (!this._state?.proto) return false;
    let { proto: e2, originals: t2, almanacProto: n2, almanacOriginals: r2, offLocaleChange: i2 } = this._state;
    for (let [n3, r3] of Object.entries(t2 || {})) typeof r3 == `function` && (e2[n3] = r3);
    if (n2) for (let [e3, t3] of Object.entries(r2 || {})) typeof t3 == `function` && (n2[e3] = t3);
    let a2 = h(`Almanac`)?.component?.almanacPlant || null;
    return a2 && this._cleanupPage(a2), i2?.(), this._state = null, en.info(`[plant-levels] Almanac level page hook restored`), true;
  }
  getStatus() {
    let e2 = h(`Almanac`)?.component?.almanacPlant || null, t2 = e2?.__gpnPlantLevelAlmanacState || null;
    return { applied: !!this._state, hasLivePage: !!e2, hasInjectedUi: !!t2, activeTab: t2?.activeTab || on, hasLevelData: t2?.hasLevelData === true, showToggle: t2?.showToggle === true };
  }
}, Wn = new i(`shop-extensions`), Gn = `chunks:///_virtual/Plants.ts`, Kn = `__gpnStore`, qn = Symbol.for(`gp-next.wrapperOriginal`), Jn = `shop-extensions`;
function Yn(e2) {
  if (typeof e2 != `function`) return e2;
  let t2 = e2[qn];
  return typeof t2 == `function` ? t2 : e2;
}
function Xn(e2, t2) {
  if (typeof e2 != `function`) return e2;
  try {
    e2[Symbol.for(`gp-next.wrapperOwner`)] = Jn, e2[qn] = Yn(t2);
  } catch {
  }
  return e2;
}
function Zn() {
  return b(Gn)?.plants || null;
}
function Qn() {
  return f?.() || null;
}
function $n(e2) {
  let t2 = e2?.[Kn];
  return t2 && typeof t2 == `object` && !Array.isArray(t2) ? t2 : null;
}
function er(e2) {
  return (Array.isArray(e2) ? e2 : e2 == null ? [] : [e2]).map((e3) => String(e3 || ``).trim()).filter(Boolean);
}
function tr(e2) {
  let t2 = Zn(), n2 = t2?.getPlantEnumByCodename?.(e2, false);
  if (!Number.isFinite(Number(n2))) return e2;
  let r2 = t2?.getPlantFeature?.(Number(n2)), i2 = h(`MultiLanguage`);
  try {
    return String(i2?.getString?.(r2?.NAME, false) || e2);
  } catch {
    return e2;
  }
}
function nr(e2) {
  if (e2?.CommodityType !== `plant`) return [];
  let t2 = er($n(e2)?.requirePlants);
  if (!t2.length) return [];
  let n2 = Zn(), r2 = Qn();
  return t2.filter((t3) => {
    let i2 = n2?.getPlantEnumByCodename?.(t3, false);
    if (!Number.isFinite(Number(i2))) return Wn.warn(`[shop] Unknown prerequisite plant codename '${t3}' in ${e2?.CommodityName || `?`}'s ${Kn}.requirePlants`), true;
    let a2 = r2?.getPlantProgressByID?.(Number(i2));
    return Number(a2?.progress || 0) <= 0;
  });
}
function rr(e2) {
  let t2 = nr(e2);
  return t2.length ? g(`shopExtensions.requirePlantsToast`, t2.map(tr).join(`, `)) : ``;
}
function ir() {
  return new ar();
}
var ar = class {
  constructor() {
    this._state = null;
  }
  apply() {
    let e2 = h(`StoreCommodity`);
    if (!e2?.prototype) return Wn.warn(`[shop] StoreCommodity class not found \u2014 shop extensions skipped`), false;
    this._state ||= { StoreCommodity: e2, origReadCommodity: Yn(e2.prototype.readCommodity), origUnlockable: Yn(e2.prototype.unlockable), origBuy: Yn(e2.prototype.buy) };
    let t2 = this;
    return typeof this._state.origReadCommodity == `function` && (e2.prototype.readCommodity = Xn(async function(...e3) {
      let n2 = await t2._state.origReadCommodity.apply(this, e3);
      return nr(this?.currentCommodity || e3?.[0] || null).length > 0 && this.node?.destroy?.(), n2;
    }, this._state.origReadCommodity)), typeof this._state.origUnlockable == `function` && (e2.prototype.unlockable = Xn(function(...e3) {
      return t2._state.origUnlockable.apply(this, e3) ? nr(this?.currentCommodity).length === 0 : false;
    }, this._state.origUnlockable)), typeof this._state.origBuy == `function` && (e2.prototype.buy = Xn(function(...e3) {
      let n2 = rr(this?.currentCommodity || null);
      if (n2) {
        x(n2, `warning`);
        return;
      }
      return t2._state.origBuy.apply(this, e3);
    }, this._state.origBuy)), Wn.info(`[shop] Shop extensions active`), true;
  }
  restore() {
    if (!this._state?.StoreCommodity?.prototype) return false;
    let { StoreCommodity: e2, origReadCommodity: t2, origUnlockable: n2, origBuy: r2 } = this._state;
    return typeof t2 == `function` && (e2.prototype.readCommodity = t2), typeof n2 == `function` && (e2.prototype.unlockable = n2), typeof r2 == `function` && (e2.prototype.buy = r2), this._state = null, Wn.info(`[shop] Shop extensions restored`), true;
  }
  getStatus() {
    return { applied: !!this._state };
  }
};
function or(e2, t2) {
  if (Array.isArray(t2)) return t2.slice();
}
var B = new i(`patcher`);
function sr() {
  return { loaded: [], skipped: [], errors: [], packs: [], disabledPacks: [], singleFile: null, editsPack: null, editsCount: 0 };
}
var CorePatcher = class {
  constructor() {
    this._jsonAssetsList = [], this._patchRegistry = /* @__PURE__ */ new Map(), this._originalData = {}, this._appliedSourceSnapshot = null, this._legacyMigrationCommitted = false, this._patchLog = [], this._pipelineActive = false, this._patchedInstances = /* @__PURE__ */ new WeakSet(), this._loadResult = sr(), this._originalLyrics = null, this._langExtension = null, this._collectedExtraLangs = null, this._langUnlockBypass = null, this._operationQueue = Promise.resolve(), this._plantRegistry = je(), this._plantLevelRegistry = Ge(), this._plantLevelBridge = et({ plantLevelRegistry: this._plantLevelRegistry, plantLevelState: de }), this._plantLevelResolver = lt({ plantLevelRegistry: this._plantLevelRegistry, plantLevelState: de }), this._plantLevelBadge = $t({ engine: d, logger: B, plantLevelRegistry: this._plantLevelRegistry, plantLevelState: de }), this._plantLevelAlmanac = Hn({ plantLevelRegistry: this._plantLevelRegistry, plantLevelState: de }), this._shopExtensions = ir(), this._collectedPlantLevelConfigs = null, this._pendingPreparedRuntime = null;
  }
  _isDynamicPlantRegistryEnabled() {
    return getSettings().dynamicPlantRegistry !== false;
  }
  _isPlantLevelSystemEnabled() {
    return isPlantLevelSystemEnabled();
  }
  _isShopExtensionsEnabled() {
    return getSettings().shopExtensions === true;
  }
  async _runOptionalRuntime(e2, t2, n2 = null) {
    let r2 = await le(`Runtime extension '${e2}'`, t2, { cleanup: n2, logger: B });
    if (!r2.ok) {
      let t3 = `[runtime] ${e2}`;
      this._loadResult.errors.includes(t3) || this._loadResult.errors.push(t3);
    }
    return r2;
  }
  _restorePlantLevelRuntime() {
    let e2 = [], t2 = [this._plantLevelAlmanac, this._plantLevelBadge, this._plantLevelResolver, this._plantLevelBridge, this._plantLevelRegistry];
    for (let n2 of t2) try {
      n2.restore();
    } catch (t3) {
      e2.push(t3);
    }
    if (e2.length === 1) throw e2[0];
    if (e2.length > 1) throw AggregateError(e2, `Plant level runtime cleanup failed`);
  }
  initCacheScan() {
    if (this._jsonAssetsList = l(), B.info(`Cache scan: ${this._jsonAssetsList.length} JSON assets found`), !this._originalLyrics) {
      let e2 = h(`MultiLanguage`);
      if (e2 && e2.lyrics) {
        try {
          this._originalLyrics = structuredClone(e2.lyrics);
        } catch {
          this._originalLyrics = JSON.parse(JSON.stringify(e2.lyrics));
        }
        B.debug(`MultiLanguage.lyrics original backed up`);
      }
    }
  }
  _findAsset(e2) {
    return this._jsonAssetsList.find((t2) => t2._name === e2) || null;
  }
  _backup(e2, t2) {
    if (!this._originalData[e2]) {
      try {
        this._originalData[e2] = structuredClone(t2);
      } catch {
        this._originalData[e2] = JSON.parse(JSON.stringify(t2));
      }
      B.debug(`Backed up original: ${e2}`);
    }
  }
  _registerPatch(e2, t2) {
    let n2 = e2.toLowerCase();
    this._patchRegistry.has(n2) || this._patchRegistry.set(n2, []), this._patchRegistry.get(n2).push(t2);
  }
  _mergeFeatures(e2, t2, n2, r2 = `merge`) {
    if (r2 === `replace`) {
      e2.json = ce(t2);
      return;
    }
    let i2 = e2.json, a2 = n2.key, o2 = n2.idKey || `CODENAME`;
    if (n2.key && i2[a2] && t2[a2]) {
      for (let e3 of t2[a2]) if (e3[o2] !== void 0) {
        let t3 = i2[a2].findIndex((t4) => t4?.[o2] === e3[o2]);
        t3 === -1 ? i2[a2].push(e3) : i2[a2][t3] = (0, fe.mergeWith)(i2[a2][t3], e3, or);
      }
    }
    for (let e3 of n2.extraKeys || []) if (e3.key in t2) if (e3.idKey) {
      if (i2[e3.key]) {
        for (let n3 of t2[e3.key]) if (n3[e3.idKey] !== void 0) {
          let t3 = i2[e3.key].findIndex((t4) => t4?.[e3.idKey] === n3[e3.idKey]);
          t3 === -1 ? i2[e3.key].push(n3) : i2[e3.key][t3] = (0, fe.mergeWith)(i2[e3.key][t3], n3, or);
        }
      }
    } else i2[e3.key] = t2[e3.key];
  }
  _mergeObjects(e2, t2, n2 = `merge`) {
    if (n2 === `replace`) {
      e2.json = ce(t2);
      return;
    }
    let r2 = e2.json;
    if (r2?.objects && t2.objects) {
      for (let e3 of t2.objects) if (e3?.aliases?.[0]) {
        let t3 = r2.objects.findIndex((t4) => t4?.aliases?.[0] === e3.aliases[0]);
        t3 === -1 ? r2.objects.push(e3) : r2.objects[t3] = (0, fe.mergeWith)(r2.objects[t3], e3, or);
      }
    }
  }
  _mergeLevel(e2, t2) {
    e2.json = t2;
  }
  _resolveTranslationLeaf(e2, t2) {
    let n2 = e2;
    for (let e3 of t2 || []) {
      if (n2 == null) return null;
      n2 = n2[e3];
    }
    return n2;
  }
  _applyTranslationValues(e2, t2) {
    if (!e2 || typeof e2 != `object` || Array.isArray(e2) || typeof e2.en != `string` || typeof e2.zh != `string`) return false;
    let n2 = false;
    for (let [r2, i2] of Object.entries(t2 || {})) {
      if (typeof i2 != `string`) continue;
      let t3 = i2.trim();
      t3 && (e2[r2] = t3, n2 = true);
    }
    return n2;
  }
  _findFeatureTranslationTarget(e2, t2, n2) {
    let r2 = n2?.section || t2?.key;
    if (!r2) return null;
    let i2 = e2?.[r2];
    if (i2 == null) return null;
    if (n2?.mode === `id`) {
      if (!Array.isArray(i2)) return null;
      let e3 = n2.idKey || t2?.idKey || `CODENAME`;
      return i2.find((t3) => String(t3?.[e3]) === String(n2.id)) || null;
    }
    return n2?.mode === `index` ? Array.isArray(i2) ? i2[n2.index] ?? null : null : i2;
  }
  _applyFeatureTranslationRecords(e2, t2, n2) {
    let r2 = 0;
    for (let i2 of t2 || []) {
      let t3 = this._findFeatureTranslationTarget(e2, n2, i2.match);
      if (!t3) continue;
      let a2 = this._resolveTranslationLeaf(t3, i2.path);
      this._applyTranslationValues(a2, i2.values) && (r2 += 1);
    }
    return r2;
  }
  _applyObjectTranslationRecords(e2, t2) {
    let n2 = Array.isArray(e2?.objects) ? e2.objects : [], r2 = 0;
    for (let e3 of t2 || []) {
      let t3 = String(e3?.match?.id ?? ``);
      if (!t3) continue;
      let i2 = n2.find((e4) => String(e4?.aliases?.[0]) === t3);
      if (!i2) continue;
      let a2 = this._resolveTranslationLeaf(i2, e3.path);
      this._applyTranslationValues(a2, e3.values) && (r2 += 1);
    }
    return r2;
  }
  _applyLyricsTranslationRecords(e2, t2) {
    let n2 = 0;
    for (let r2 of t2 || []) {
      let t3 = this._resolveTranslationLeaf(e2, r2.path);
      this._applyTranslationValues(t3, r2.values) && (n2 += 1);
    }
    return n2;
  }
  _applyBuiltinTranslationSource(e2, t2, n2, i2) {
    if (!e2) return false;
    let a2 = false;
    for (let t3 of e2.extraLanguages || []) t3?.code && !this._collectedExtraLangs.some((e3) => e3.code === t3.code) && this._collectedExtraLangs.push(t3);
    let o2 = () => {
      let r2 = Array.isArray(e2.lyrics) ? e2.lyrics : [];
      if (r2.length) {
        let o3 = h(`MultiLanguage`);
        if (o3?.lyrics) {
          let i3 = this._applyLyricsTranslationRecords(o3.lyrics, r2);
          i3 > 0 && (t2.loaded.push(`lang`), n2.add(`lang`), this._patchLog.push({ type: `lang`, time: Date.now(), source: e2.meta.name }), B.info(`[${e2.meta.name}] Patched: lang (${i3} record(s))`), a2 = true);
        } else t2.errors.push(`lang`), i2.add(`lang`), B.warn(`[${e2.meta.name}] MultiLanguage.lyrics not available \u2014 builtin translations skipped`), a2 = true;
      }
    };
    this._deferPreparedLanguage ? this._pendingPreparedRuntime.languageTasks.push(o2) : o2();
    for (let [o3, s2] of Object.entries(e2.features || {})) {
      let c2 = r.find((e3) => e3.type === o3);
      if (!c2) {
        t2.errors.push(o3), i2.add(o3);
        continue;
      }
      this._registerPatch(o3, { type: `featureTranslations`, data: s2, config: c2 }), t2.registered.push(o3);
      let l2 = this._findAsset(o3);
      if (!l2?.json) {
        B.info(`[${e2.meta.name}] ${o3} not in startup cache \u2014 registered for load-hook`), a2 = true;
        continue;
      }
      this._originalData[o3] || this._backup(o3, l2.json);
      let u2 = this._applyFeatureTranslationRecords(l2.json, s2, c2);
      this._patchedInstances.add(l2), u2 > 0 ? (t2.loaded.push(o3), n2.add(o3), this._patchLog.push({ type: o3, time: Date.now(), source: e2.meta.name }), B.info(`[${e2.meta.name}] Patched: ${o3} (${u2} record(s))`)) : B.warn(`[${e2.meta.name}] No feature translation records applied for ${o3}`), a2 = true;
    }
    for (let [r2, i3] of Object.entries(e2.objects || {})) {
      this._registerPatch(r2, { type: `objectTranslations`, data: i3 }), t2.registered.push(r2);
      let o3 = this._findAsset(r2);
      if (!o3?.json) {
        B.info(`[${e2.meta.name}] ${r2} not in startup cache \u2014 registered for load-hook`), a2 = true;
        continue;
      }
      this._originalData[r2] || this._backup(r2, o3.json);
      let s2 = this._applyObjectTranslationRecords(o3.json, i3);
      this._patchedInstances.add(o3), s2 > 0 ? (t2.loaded.push(r2), n2.add(r2), this._patchLog.push({ type: r2, time: Date.now(), source: e2.meta.name }), B.info(`[${e2.meta.name}] Patched: ${r2} (${s2} record(s))`)) : B.warn(`[${e2.meta.name}] No object translation records applied for ${r2}`), a2 = true;
    }
    return a2;
  }
  async loadAllPatches() {
    return this._enqueueOperation(`loadAllPatches`, () => this._loadAllPatchesImpl());
  }
  prepare(e2) {
    return this._enqueueOperation(`prepare`, () => te(e2));
  }
  consumePrepared(e2, { reload: t2 = false, deferRuntime: n2 = false } = {}) {
    if (t2 && n2) throw Error(`Cannot defer runtime extensions during reload`);
    return this._enqueueOperation(`consumePrepared`, () => t2 ? this._reloadPatchesImpl(e2) : this._consumePreparedImpl(e2, { deferRuntime: n2 }));
  }
  async _loadAllPatchesImpl() {
    let e2 = await te();
    return this._consumePreparedImpl(e2, { allowBlocked: true });
  }
  async _consumePreparedImpl(e2, t2 = {}) {
    if (this._pendingPreparedRuntime) throw Error(`Prepared runtime activation is still pending`);
    let { allPacks: n2, blocked: r2, sources: i2, snapshots: o2 } = C(e2, t2);
    this._futureLevelNames = null, this._appliedSourceSnapshot = null;
    let s2 = a(i2.filter((e3) => !e3.isBuiltinTranslations).map((e3) => ({ dir: e3.dir, meta: e3.meta, contentDigest: e3.contentDigest, kind: e3.isEdits ? `edits` : e3.isSingle ? `patches` : `mod` }))), c2 = new Map(s2.map((e3) => [e3.dir, o2.get(e3.dir)])), l2 = Object.freeze({ sources: s2, packs: a(n2), settings: a(e2.settings), getSnapshot: (e3) => c2.get(e3) || null });
    this._loadResult = sr(), this._loadResult.disabledPacks = n2.filter((e3) => e3.enabled === false), this._loadResult.packs.push(...r2), this._collectedExtraLangs = [], this._collectedPlantLevelConfigs = [], S();
    for (let e3 of i2) {
      let t3 = o2.get(e3.dir);
      t3 && ee(e3.dir, t3);
    }
    let u2 = /* @__PURE__ */ new Set(), d2 = new Set(e2.errors.map((e3) => e3.message));
    this._pendingPreparedRuntime = { languageTasks: [], allLoadedSet: u2, allErrorSet: d2, applied: l2 }, this._deferPreparedLanguage = t2.deferRuntime === true;
    for (let e3 of i2) {
      let t3 = { name: e3.meta.name, dir: e3.dir, meta: e3.meta, contentDigest: e3.contentDigest, isSingle: e3.isSingle, loaded: [], registered: [], errors: [], warnings: [...e3.preflightWarnings || []] }, n3 = false;
      if (e3.isBuiltinTranslations) {
        this._applyBuiltinTranslationSource(e3.translationBundle, t3, u2, d2);
        continue;
      }
      let { patches: r3, errors: i3 } = e3.preparedData.features;
      i3 && (t3.errors.push(...i3.map((e4) => `[JSON] ${e4}`)), i3.forEach((e4) => d2.add(`[JSON] ${e4}`)), n3 = true);
      for (let [i4, { data: a3, config: o4, mode: s4 }] of r3) {
        this._registerPatch(i4, { type: `features`, data: a3, config: o4, mode: s4 }), t3.registered.push(i4);
        let r4 = this._findAsset(i4);
        if (!r4?.json) {
          B.info(`[${e3.meta.name}] ${i4} not in startup cache \u2014 registered for load-hook`), n3 = true;
          continue;
        }
        this._originalData[i4] || this._backup(i4, r4.json);
        try {
          if (this._mergeFeatures(r4, a3, o4, s4), this._patchedInstances.add(r4), e3.isEdits) {
            if (o4.key && Array.isArray(a3[o4.key])) this._loadResult.editsCount += a3[o4.key].length;
            else if (!o4.key && o4.extraKeys) for (let e4 of o4.extraKeys) e4.idKey && Array.isArray(a3[e4.key]) && (this._loadResult.editsCount += a3[e4.key].length);
          }
          t3.loaded.push(i4), u2.add(i4), this._patchLog.push({ type: i4, time: Date.now(), source: e3.meta.name }), B.info(`[${e3.meta.name}] Patched: ${i4}`), n3 = true;
        } catch (r5) {
          B.error(`[${e3.meta.name}] Failed to apply ${i4}: ${r5}`), t3.errors.push(i4), d2.add(i4), n3 = true;
        }
      }
      let { patches: a2, errors: o3 } = e3.preparedData.objects;
      o3 && (t3.errors.push(...o3.map((e4) => `[JSON] ${e4}`)), o3.forEach((e4) => d2.add(`[JSON] ${e4}`)), n3 = true);
      for (let [r4, { data: i4, mode: o4 }] of a2) {
        this._registerPatch(r4, { type: `objects`, data: i4, mode: o4 }), t3.registered.push(r4);
        let a3 = this._findAsset(r4);
        if (!a3?.json) {
          B.info(`[${e3.meta.name}] ${r4} not in startup cache \u2014 registered for load-hook`), n3 = true;
          continue;
        }
        this._originalData[r4] || this._backup(r4, a3.json);
        try {
          this._mergeObjects(a3, i4, o4), this._patchedInstances.add(a3), e3.isEdits && Array.isArray(i4.objects) && (this._loadResult.editsCount += i4.objects.length), t3.loaded.push(r4), u2.add(r4), this._patchLog.push({ type: r4, time: Date.now(), source: e3.meta.name }), B.info(`[${e3.meta.name}] Patched: ${r4}`), n3 = true;
        } catch (i5) {
          B.error(`[${e3.meta.name}] Failed to apply ${r4}: ${i5}`), t3.errors.push(r4), d2.add(r4), n3 = true;
        }
      }
      let s3 = () => {
        let { data: r4 } = e3.preparedData.lang;
        if (r4) {
          if (Array.isArray(r4._languages) && r4._languages.length) for (let e4 of r4._languages) e4?.code && !this._collectedExtraLangs.some((t4) => t4.code === e4.code) && this._collectedExtraLangs.push(e4);
          let { _languages: i4, ...a3 } = r4;
          if (Object.keys(a3).length) {
            let r5 = h(`MultiLanguage`);
            if (r5 && r5.lyrics) try {
              (0, fe.mergeWith)(r5.lyrics, a3, or), t3.loaded.push(`lang`), u2.add(`lang`), this._patchLog.push({ type: `lang`, time: Date.now(), source: e3.meta.name }), B.info(`[${e3.meta.name}] Patched: lang`), n3 = true;
            } catch (r6) {
              B.error(`[${e3.meta.name}] Failed to merge lang: ${r6}`), t3.errors.push(`lang`), d2.add(`lang`), n3 = true;
            }
            else B.warn(`[${e3.meta.name}] MultiLanguage.lyrics not available \u2014 lang patch skipped`);
          } else r4._languages?.length && (t3.loaded.push(`lang`), u2.add(`lang`), this._patchLog.push({ type: `lang`, time: Date.now(), source: e3.meta.name }), B.info(`[${e3.meta.name}] Registered: _languages (${r4._languages.length} extra lang(s))`), n3 = true);
        }
      };
      this._deferPreparedLanguage ? this._pendingPreparedRuntime.languageTasks.push(s3) : s3();
      let { patches: c3, errors: l3 } = e3.preparedData.levels;
      l3 && (t3.errors.push(...l3.map((e4) => `[JSON] ${e4}`)), l3.forEach((e4) => d2.add(`[JSON] ${e4}`)), n3 = true);
      for (let [r4, i4] of c3) {
        let a3 = r4.replace(/\.json5?$/i, ``), o4 = this._jsonAssetsList.find((e4) => {
          let t4 = e4._name?.toLowerCase() || ``;
          return t4 === a3.toLowerCase() || t4 === r4.toLowerCase();
        });
        o4 ? (this._originalData[a3] || this._backup(a3, o4.json), this._mergeLevel(o4, i4), t3.loaded.push(`Level:${a3}`), u2.add(`Level:${a3}`), this._patchLog.push({ type: `Level:${a3}`, time: Date.now(), source: e3.meta.name }), B.info(`[${e3.meta.name}] Patched level: ${a3}`)) : B.info(`[${e3.meta.name}] Level ${a3} not in cache \u2014 registered for load-hook`), this._registerPatch(a3, { type: `level`, data: i4 }), t3.registered.push(`Level:${a3}`), n3 = true;
      }
      let { data: f3 } = e3.preparedData.plantLevels;
      f3 && (this._collectedPlantLevelConfigs.push({ source: e3.meta.name, dir: e3.dir, data: f3, plantData: { plantFeatures: r3.get(`PlantFeatures`)?.data || null, plantTypes: a2.get(`PlantTypes`)?.data || null, plantProps: a2.get(`PlantProps`)?.data || null, plantAlmanac: a2.get(`PlantAlmanac`)?.data || null } }), B.info(`[${e3.meta.name}] Registered plant-level config`), n3 = true), e3.isSingle ? n3 && (this._loadResult.singleFile = t3) : e3.isEdits ? n3 && (this._loadResult.editsPack = t3) : this._loadResult.packs.push(t3);
    }
    let f2 = new Map(n2.map((e3, t3) => [e3.dir, t3]));
    this._loadResult.packs.sort((e3, t3) => f2.get(e3.dir) - f2.get(t3.dir)), this._updatePreparedLoadLists(u2, d2), t2.deferRuntime || await this._activateRuntimeExtensionsImpl();
    let p2 = this._loadResult.loaded.length;
    return B.info(`Patches loaded: ${p2} applied (${n2.length - r2.length - this._loadResult.disabledPacks.length} pack(s) + single-file), ${this._loadResult.skipped.length} skipped, ${this._loadResult.errors.length} errors`), this._loadResult;
  }
  _updatePreparedLoadLists(e2, t2) {
    this._loadResult.loaded = [...e2], this._loadResult.errors = [...t2];
    let i2 = [...r.map((e3) => e3.type), ...n.filter((e3) => !e3.deprecated).map((e3) => e3.type)];
    this._loadResult.skipped = i2.filter((n2) => !e2.has(n2) && !t2.has(n2));
  }
  activatePreparedRuntime() {
    return this._enqueueOperation(`activatePreparedRuntime`, () => this._activateRuntimeExtensionsImpl());
  }
  publishPreparedDataIdentities() {
    if (!this._pendingPreparedRuntime || _().director.getScene()) throw Error(`Data identities require a prepared cold runtime`);
    if (this._isDynamicPlantRegistryEnabled() && !this._pendingPreparedRuntime.dataIdentitiesPublished && !this._plantRegistry.apply()) throw Error(`Cold dynamic plant registry is unavailable`);
    this._pendingPreparedRuntime.dataIdentitiesPublished = true;
  }
  validatePreparedDataIdentities(e2) {
    if (!this._pendingPreparedRuntime?.dataIdentitiesPublished || _().director.getScene()) throw Error(`Data identity validation requires cold publication`);
    let t2 = b(`chunks:///_virtual/Plants.ts`), n2 = b(`chunks:///_virtual/Zombies.ts`);
    ie(e2, { plant: t2?.PlantEnum, zombie: n2?.ZombieEnum });
  }
  async _activateRuntimeExtensionsImpl() {
    let e2 = this._pendingPreparedRuntime;
    if (!e2) return this._loadResult;
    this.initCacheScan();
    for (let t2 of e2.languageTasks) t2();
    return this._updatePreparedLoadLists(e2.allLoadedSet, e2.allErrorSet), this._deferPreparedLanguage = false, await this._runOptionalRuntime(`language-unlock`, () => this._applyLanguageUnlockBypass(), () => this._restoreLanguageUnlockBypass()), this._collectedExtraLangs.length ? await this._runOptionalRuntime(`language-extension`, () => this._applyLangExtension(this._collectedExtraLangs), () => this._restoreLangExtension()) : await this._runOptionalRuntime(`language-state`, () => this._sanitizeLanguageState(2)), this._collectedExtraLangs = null, this._isDynamicPlantRegistryEnabled() && !e2.dataIdentitiesPublished ? await this._runOptionalRuntime(`dynamic-plant-registry`, () => this._plantRegistry.apply(), () => this._plantRegistry.restore()) : this._isDynamicPlantRegistryEnabled() || B.info(`[plant] Dynamic plant registry disabled by settings`), this._isShopExtensionsEnabled() ? await this._runOptionalRuntime(`shop-extensions`, () => this._shopExtensions.apply(), () => this._shopExtensions.restore()) : (await this._runOptionalRuntime(`shop-extensions`, () => this._shopExtensions.restore()), B.info(`[shop] Shop extensions disabled by settings`)), this._isPlantLevelSystemEnabled() ? await this._runOptionalRuntime(`plant-level-system`, () => {
      this._plantLevelRegistry.apply(this._collectedPlantLevelConfigs);
      let e3 = ensurePlantLevelStates(this._plantLevelRegistry.getBaseEntries().map((e4) => ({ baseCodename: e4.baseCodename, config: e4 })));
      e3.changed && B.info(`[plant-levels] Initialized ${e3.count} plant-level save entr${e3.count === 1 ? `y` : `ies`}`), this._plantLevelBridge.apply(), this._plantLevelResolver.apply(), this._plantLevelBadge.apply(), this._plantLevelAlmanac.apply();
    }, () => this._restorePlantLevelRuntime()) : (await this._runOptionalRuntime(`plant-level-system`, () => this._restorePlantLevelRuntime()), B.info(`[plant-levels] Experimental plant level system disabled by settings`)), this._collectedPlantLevelConfigs = null, this._loadResult.errors.length || (this._appliedSourceSnapshot = e2.applied), this._pendingPreparedRuntime = null, this._loadResult;
  }
  async reloadPatches() {
    return this._enqueueOperation(`reloadPatches`, async () => this._reloadPatchesImpl(await te()));
  }
  async _reloadPatchesImpl(e2) {
    if (this._pendingPreparedRuntime) throw Error(`Prepared runtime activation is still pending`);
    ne(e2), this._appliedSourceSnapshot = null, B.info(`Reloading all patches...`);
    for (let [e3, t2] of Object.entries(this._originalData)) {
      let n2 = this._findAsset(e3) || m(e3);
      if (n2) {
        let e4 = ce(t2);
        n2.json && typeof n2.json == `object` ? se(n2.json, e4) : n2.json = e4;
      }
    }
    if (this._originalLyrics) {
      let e3 = h(`MultiLanguage`);
      if (e3) try {
        e3.lyrics = structuredClone(this._originalLyrics);
      } catch {
        e3.lyrics = JSON.parse(JSON.stringify(this._originalLyrics));
      }
    }
    await this._runOptionalRuntime(`language-runtime`, () => {
      this._restoreLangExtension(), this._restoreLanguageUnlockBypass();
    }), await this._runOptionalRuntime(`shop-extensions`, () => this._shopExtensions.restore()), await this._runOptionalRuntime(`plant-level-system`, () => this._restorePlantLevelRuntime()), await this._runOptionalRuntime(`dynamic-plant-registry`, () => this._plantRegistry.restore()), this._patchRegistry.clear();
    for (let e3 of Object.keys(this._originalData)) delete this._originalData[e3];
    return this._patchLog = [], this._patchedInstances = /* @__PURE__ */ new WeakSet(), this._loadResult = sr(), this.initCacheScan(), await this._consumePreparedImpl(e2);
  }
  _enqueueOperation(e2, t2) {
    let n2 = this._operationQueue.catch(() => {
    }).then(async () => {
      try {
        if (this._legacyMigrationCommitted && [`loadAllPatches`, `consumePrepared`, `reloadPatches`, `migrateLegacy`].includes(e2)) throw Object.assign(Error(`Restart to use the migrated mod configuration`), { code: `MOD_RESTART_REQUIRED` });
        return await t2();
      } catch (t3) {
        throw B.error(`${e2} failed: ${t3}`), t3;
      }
    });
    return this._operationQueue = n2.then(() => void 0, () => void 0), n2;
  }
  _persistLanguageSetting() {
    let e2 = h(`MultiLanguage`), t2 = y(`chunks:///_virtual/SettingWindow.ts`, `Setting`);
    if (!(!e2 || !t2?.saveSettings)) try {
      t2.saveSettings();
    } catch (e3) {
      B.warn(`[lang] Failed to save language: ` + e3);
    }
  }
  installSceneHook() {
    c((e2) => {
      let t2 = l(), n2 = 0;
      for (let e3 of t2) {
        if (!e3?.json || !e3._name || this._patchedInstances.has(e3)) continue;
        let t3 = this._patchRegistry.get(e3._name.toLowerCase());
        !t3 || t3.some((e4) => e4.type === `level`) || (this._applyPatchIfRegistered(e3, `scene`), this._patchedInstances.add(e3), n2++);
      }
      !this._pendingPreparedRuntime && this._isDynamicPlantRegistryEnabled() && this._plantRegistry.apply(), !this._pendingPreparedRuntime && this._isPlantLevelSystemEnabled() && (this._plantLevelBadge.apply(), this._plantLevelAlmanac.apply()), n2 > 0 && B.info(`Scene hook: patched ${n2} new assets after '${e2}'`);
    }), B.info(`Scene hook installed \u2014 Features/Objects patches applied on scene launch`);
  }
  installLoadHook() {
    let e2 = _()?.resources;
    if (!e2?.load) return B.warn(`cc.resources.load not available \u2014 level patches will not be applied`), false;
    this._loadHookInstalled = true;
    let t2 = this, n2 = e2.load.bind(e2);
    return e2.load = function(...e3) {
      for (let n3 = e3.length - 1; n3 >= 0; n3--) if (typeof e3[n3] == `function`) {
        let r2 = e3[n3];
        e3[n3] = function(e4, n4) {
          let i2 = null;
          try {
            if (!e4) {
              let e5 = Array.isArray(n4) ? n4 : [n4];
              for (let n5 of e5) if (!(!n5?.json || !n5._name)) {
                if (t2._futureLevelNames?.has(n5._name.toLowerCase())) {
                  t2._applyFutureLevel(n5);
                  continue;
                }
                t2._patchedInstances.has(n5) || t2._patchRegistry.has(n5._name.toLowerCase()) && (t2._applyPatchIfRegistered(n5, `load`), t2._patchedInstances.add(n5));
              }
            }
          } catch (e5) {
            i2 = e5 instanceof Error ? e5 : Error(String(e5)), B.error(`Failed to patch loaded JSON: ` + i2.message);
          }
          if (i2) return r2.call(this, i2, null);
          r2.apply(this, arguments);
        };
        break;
      }
      return n2(...e3);
    }, B.info(`Load hook installed \u2014 level JSON patches applied before game callback`), true;
  }
  installPipelineHook() {
    let e2 = _();
    if (!e2?.assetManager?.pipeline) return B.warn(`Pipeline API not available \u2014 using cache-scan only`), false;
    try {
      return e2.assetManager.pipeline.append(this._patchPipe.bind(this)), this._pipelineActive = true, B.info(`Pipeline hook installed`), true;
    } catch (e3) {
      return B.error(`Failed to install pipeline hook: ${e3}`), false;
    }
  }
  _patchPipe(e2) {
    try {
      let t2 = e2.output;
      if (!t2) return;
      let n2 = Array.isArray(t2) ? t2 : [t2];
      for (let e3 of n2) e3 && (!e3.json || !e3._name || this._applyPatchIfRegistered(e3, `pipeline`));
    } catch (e3) {
      B.error(`Pipeline pipe error: ${e3}`);
    }
  }
  _applyPatchIfRegistered(e2, t2 = `scene`) {
    let n2 = e2._name, r2 = this._patchRegistry.get(n2.toLowerCase());
    if (!(!r2 || r2.length === 0)) {
      this._backup(n2, e2.json);
      for (let t3 of r2) switch (t3.type) {
        case `features`:
          this._mergeFeatures(e2, t3.data, t3.config, t3.mode);
          break;
        case `featureTranslations`:
          this._applyFeatureTranslationRecords(e2.json, t3.data, t3.config);
          break;
        case `objects`:
          this._mergeObjects(e2, t3.data, t3.mode);
          break;
        case `objectTranslations`:
          this._applyObjectTranslationRecords(e2.json, t3.data);
          break;
        case `level`:
          this._mergeLevel(e2, t3.data);
          break;
      }
      this._patchLog.push({ type: n2, time: Date.now(), source: t2 }), B.info(`Patched (${t2}): ${n2}`);
    }
  }
  setObjectsData(e2, t2, ...n2) {
    let r2 = this._findAsset(e2) || m(e2);
    if (!r2?.json?.objects) return B.error(`${e2} not found or has no objects array`), false;
    let i2 = r2.json.objects, a2 = i2.findIndex((e3) => e3?.aliases?.[0] === t2);
    if (a2 === -1 || !i2[a2].objdata) return B.error(`Alias "${t2}" not found in ${e2}`), false;
    if (n2.length === 2 && typeof n2[0] == `string`) i2[a2].objdata[n2[0]] = n2[1], B.info(`Set ${e2} ${t2} ${n2[0]} = ${n2[1]}`);
    else if (n2.length === 1 && typeof n2[0] == `object`) i2[a2].objdata = (0, fe.mergeWith)(i2[a2].objdata, n2[0], or), B.info(`Merged ${e2} ${t2} objdata`);
    else return B.error(`setObjectsData: invalid arguments`), false;
    return true;
  }
  async exportLang(e2 = false, n2 = true) {
    let r2;
    if (e2) {
      if (!this._originalLyrics) return B.error(`[lang] Original lyrics not available \u2014 engine may not be initialized yet`), null;
      r2 = this._originalLyrics;
    } else {
      let e3 = h(`MultiLanguage`);
      if (!e3?.lyrics) return B.error(`[lang] MultiLanguage.lyrics not available`), null;
      r2 = e3.lyrics;
    }
    let i2 = e2 ? `MultiLanguage_original` : `MultiLanguage`, a2 = JSON.stringify(r2, null, 2);
    if (n2) try {
      let e3 = await oe({ defaultPath: `${i2}.json`, filters: [{ name: `JSON`, extensions: [`json`] }] });
      e3 ? (await t(e3, a2), B.info(`[lang] Exported ${i2} to ${e3} (${a2.length} chars)`), x(g(`toast.exportSuccess`, i2), `success`)) : (B.info(`[lang] Export cancelled`), x(g(`toast.exportCancelled`), ``));
    } catch (e3) {
      B.error(`[lang] Export failed: ${e3}`), console.log(`[GP Next] ===== ${i2} JSON =====`), console.log(a2), console.log(`[GP Next] ===== END =====`);
    }
    else console.log(`[GP Next] ===== ${i2} JSON =====`), console.log(a2), console.log(`[GP Next] ===== END =====`), B.info(`[lang] ${i2} output to console (${a2.length} chars)`);
    return a2;
  }
  _applyLangExtension(e2) {
    let t2 = h(`MultiLanguage`);
    if (!t2) {
      B.warn(`[lang] MultiLanguage class not found \u2014 language extension skipped`);
      return;
    }
    let n2 = { 0: `en`, 1: `zh` }, r2 = { 0: false, 1: true };
    e2.forEach(({ code: e3, isCJK: t3 }, i3) => {
      n2[2 + i3] = e3.toLowerCase(), r2[2 + i3] = !!t3;
    });
    let i2 = window.System?.get?.(`chunks:///_virtual/MultiLanguage.ts`)?.LanguageEnum, a2 = i2?.amount ?? 2, o2 = [];
    i2 ? (e2.forEach(({ code: e3 }, t3) => {
      let n3 = e3.toUpperCase();
      i2[n3] = 2 + t3, o2.push(n3);
    }), i2.amount = 2 + e2.length) : B.warn(`[lang] LanguageEnum not found via SystemJS \u2014 language cycling in Settings may not work`);
    let s2 = t2.getString;
    t2.getString = function(e3, r3) {
      if (!e3) return ``;
      let i3 = n2[t2.currentLanguage];
      return i3 === void 0 ? s2.call(this, e3, r3) : e3?.[i3]?.concat() ?? e3?.en?.concat() ?? ``;
    };
    let c2 = t2.getStringAndGraghicalLength;
    t2.getStringAndGraghicalLength = function(e3) {
      let n3 = t2.getString(e3), i3 = r2[t2.currentLanguage] ? 3.1 : 1;
      return { str: n3, length: n3.length * i3 };
    };
    let l2 = h(`SettingWindow`), u2 = l2?.prototype?.readLanguage;
    l2 && u2 && (l2.prototype.readLanguage = function() {
      let n3 = t2.currentLanguage;
      n3 >= 2 && e2[n3 - 2] ? this.languageName.string = e2[n3 - 2].name : u2.call(this);
    }), this._langExtension = { ML: t2, LE: i2, SW: l2, extraLangs: e2, addedKeys: o2, origAmount: a2, origGetString: s2, origGetSL: c2, origReadLang: u2 }, B.info(`[lang] Language extension applied: +${e2.length} lang(s) [${e2.map((e3) => `${e3.code}(${e3.name})`).join(`, `)}]`);
  }
  _restoreLangExtension() {
    if (!this._langExtension) return;
    let { ML: e2, LE: t2, SW: n2, addedKeys: r2, origAmount: i2, origGetString: a2, origGetSL: o2, origReadLang: s2 } = this._langExtension;
    e2 && (a2 && (e2.getString = a2), o2 && (e2.getStringAndGraghicalLength = o2)), n2 && s2 && (n2.prototype.readLanguage = s2), t2 && (r2.forEach((e3) => delete t2[e3]), t2.amount = i2), this._langExtension = null, B.info(`[lang] Language extension restored`);
  }
  _applyLanguageUnlockBypass() {
    if (this._langUnlockBypass) return;
    let e2 = h(`MultiLanguage`);
    if (!e2) {
      B.warn(`[lang] MultiLanguage class not found \u2014 language unlock bypass skipped`);
      return;
    }
    let t2 = h(`SettingWindow`), n2 = Object.prototype.hasOwnProperty.call(e2, `isWhiteList`), r2 = Object.getOwnPropertyDescriptor(e2, `isWhiteList`), i2 = t2?.prototype?.switchLanguage;
    Object.defineProperty(e2, "isWhiteList", { get: () => true, configurable: true, enumerable: true }), t2 && typeof i2 == `function` && (t2.prototype.switchLanguage = function(...e3) {
      let t3 = i2.apply(this, e3);
      return u(), t3;
    }), this._langUnlockBypass = { ML: e2, SW: t2, hasOwnIsWhiteList: n2, origIsWhiteListDescriptor: r2, origSwitchLanguage: i2 }, B.info(`[lang] Base language unlock bypass applied`);
  }
  _restoreLanguageUnlockBypass() {
    if (!this._langUnlockBypass) return;
    let { ML: e2, SW: t2, hasOwnIsWhiteList: n2, origIsWhiteListDescriptor: r2, origSwitchLanguage: i2 } = this._langUnlockBypass;
    if (e2) try {
      n2 ? Object.defineProperty(e2, "isWhiteList", r2) : delete e2.isWhiteList;
    } catch {
    }
    t2 && typeof i2 == `function` && (t2.prototype.switchLanguage = i2), this._langUnlockBypass = null, B.info(`[lang] Base language unlock bypass restored`);
  }
  _sanitizeLanguageState(e2 = 2) {
    let t2 = h(`MultiLanguage`);
    if (!t2) return;
    let n2 = y(`chunks:///_virtual/SettingWindow.ts`, `Setting`), r2 = Number(t2.currentLanguage), i2 = Number(n2?.getSettings?.()?.Language), a2 = i2 >= 0 && i2 < e2 ? i2 : 0, o2 = Number.isFinite(r2) && r2 >= 0 && r2 < e2 ? r2 : a2;
    o2 !== r2 && (t2.currentLanguage = o2, this._persistLanguageSetting(), B.info(`[lang] Sanitized invalid currentLanguage -> ${o2}`));
  }
  getStatus() {
    return { loaded: this._loadResult.loaded, skipped: this._loadResult.skipped, errors: this._loadResult.errors, packs: this._loadResult.packs, disabledPacks: this._loadResult.disabledPacks, singleFile: this._loadResult.singleFile, editsPack: this._loadResult.editsPack, pipelineActive: this._pipelineActive, totalAssets: this._jsonAssetsList.length, editsCount: this._loadResult.editsCount || 0, extraLanguages: this._langExtension?.extraLangs ?? [], languageUnlockBypassActive: !!this._langUnlockBypass, plantRegistry: this._plantRegistry.getDebugInfo(), dynamicPlantRegistryEnabled: this._isDynamicPlantRegistryEnabled(), plantLevels: this._plantLevelRegistry.getDebugInfo(), plantLevelSystemEnabled: this._isPlantLevelSystemEnabled(), plantLevelBridge: this._plantLevelBridge.getStatus(), plantLevelResolver: this._plantLevelResolver.getStatus(), plantLevelBadges: this._plantLevelBadge.getStatus(), plantLevelAlmanac: this._plantLevelAlmanac.getStatus() };
  }
  getPatchLog() {
    return this._patchLog;
  }
  getOriginalData() {
    return this._originalData;
  }
  prepareManagedPackageAdoption(e2) {
    return this._preparePackageAdoption(e2, false);
  }
  prepareLevelPackageAdoption(e2) {
    if (!this._loadHookInstalled) throw Error(`Level load interception is unavailable`);
    return this._preparePackageAdoption(e2, true);
  }
  prepareManagedLevelAdoption(e2) {
    if (!this._loadHookInstalled) throw Error(`Level load interception is unavailable`);
    return this._preparePackageAdoption(e2, true, true);
  }
  _applyFutureLevel(e2) {
    let t2 = e2._name.toLowerCase(), n2 = Object.keys(this._originalData).find((e3) => e3.toLowerCase() === t2);
    n2 || this._backup(e2._name, e2.json);
    let r2 = (this._patchRegistry.get(t2) || []).at(-1);
    e2.json = structuredClone(r2 ? r2.data : this._originalData[n2 || e2._name]), this._patchedInstances.add(e2);
  }
  _preparePackageAdoption(e2, t2, n2 = false) {
    let r2 = this.getAppliedSourceSnapshot(), i2 = ne(e2), o2 = i2.sources.filter((e3) => !e3.isBuiltinTranslations), s2 = r2.sources.map((e3) => [e3.dir, e3.kind]), c2 = o2.map((e3) => [e3.dir, e3.isEdits ? `edits` : e3.isSingle ? `patches` : `mod`]), l2 = new Set([...s2, ...c2].filter(([e3]) => !s2.some((t3) => t3[0] === e3) || !c2.some((t3) => t3[0] === e3)).map(([e3]) => e3));
    for (let e3 of l2) {
      let a2 = o2.find((t3) => t3.dir === e3) || r2.sources.find((t3) => t3.dir === e3), s3 = i2.snapshots.get(e3) || r2.getSnapshot(e3), c3 = s3?.listPaths() || [], l3 = t2 ? a2?.meta && (!a2.meta.js || n2 && a2.meta.js.entry && !a2.meta.js.startup) && !c3.some((e4) => /^(jsons\/(?!levels\/)|content\/entities\.json$)/i.test(e4)) : a2?.meta?.js?.entry && !a2.meta.js.startup && !c3.some((e4) => /^(jsons\/|levels\/|content\/entities\.json$)/i.test(e4));
      if (!s3 || !l3) throw Error(`Package has startup data or resources; restart required`);
    }
    let u2 = (e3) => {
      let t3 = o2.find((t4) => t4.dir === e3) || r2.sources.find((t4) => t4.dir === e3), a2 = i2.snapshots.get(e3) || r2.getSnapshot(e3);
      return t3?.meta && (!t3.meta.js || n2 && t3.meta.js.entry && !t3.meta.js.startup) && a2 && !a2.listPaths().some((e4) => /^(jsons\/(?!levels\/)|content\/entities\.json$)/i.test(e4));
    }, d2 = (e3) => e3.filter(([e4]) => !l2.has(e4) && !(t2 && u2(e4)));
    if (JSON.stringify(d2(s2)) !== JSON.stringify(d2(c2))) throw Error(`Applied data order changed; restart required`);
    if (n2 && ![...o2, ...r2.sources].some((e3) => (i2.snapshots.get(e3.dir) || r2.getSnapshot(e3.dir))?.listPaths().some((e4) => /^jsons\/levels\/[^/]+\.json5?$/i.test(e4)))) throw Error(`No level recipes selected`);
    let f2 = /* @__PURE__ */ new Map();
    if (t2) for (let e3 of o2) for (let [t3, n3] of e3.preparedData.levels.patches) {
      let e4 = t3.replace(/\.json5?$/i, ``).toLowerCase();
      if (this._patchRegistry.get(e4)?.some((e5) => e5.type !== `level`)) throw Error(`Level name overlaps another data type`);
      f2.has(e4) || f2.set(e4, []), f2.get(e4).push({ type: `level`, data: n3 });
    }
    return () => {
      if (this.getAppliedSourceSnapshot() !== r2) throw Error(`Applied package sources changed`);
      if (C(e2), t2) {
        this._futureLevelNames ??= /* @__PURE__ */ new Set();
        for (let [e3, t3] of this._patchRegistry) t3.every((e4) => e4.type === `level`) && (this._futureLevelNames.add(e3), this._patchRegistry.delete(e3));
        for (let [e3, t3] of f2) this._futureLevelNames.add(e3), this._patchRegistry.set(e3, t3);
      }
      let n3 = new Map(this._loadResult.packs.map((e3) => [e3.dir, e3]));
      this._loadResult.packs = i2.allPacks.filter((e3) => e3.enabled !== false).map((e3) => n3.get(e3.dir) || { name: e3.meta.name, dir: e3.dir, meta: e3.meta, contentDigest: e3.contentDigest, loaded: [], registered: [], errors: [], warnings: [...e3.preflightWarnings || []] }), this._loadResult.disabledPacks = i2.allPacks.filter((e3) => e3.enabled === false), S();
      for (let e3 of i2.sources) {
        let t3 = i2.snapshots.get(e3.dir);
        t3 && ee(e3.dir, t3);
      }
      this._appliedSourceSnapshot = Object.freeze({ sources: a(o2.map((e3) => ({ dir: e3.dir, meta: e3.meta, contentDigest: e3.contentDigest, kind: e3.isEdits ? `edits` : e3.isSingle ? `patches` : `mod` }))), packs: a(i2.allPacks), settings: a(e2.settings), getSnapshot: (e3) => i2.snapshots.get(e3) || null });
    };
  }
  getAppliedSourceSnapshot() {
    if (!this._appliedSourceSnapshot || this._pendingPreparedRuntime || this._loadResult.errors.length) throw Error(`Applied package sources are not available`);
    return this._appliedSourceSnapshot;
  }
  commitLegacyMigration(e2, t2) {
    return this._enqueueOperation(`migrateLegacy`, async () => {
      if (this.getAppliedSourceSnapshot() !== e2) throw Error(`Applied sources changed before migration`);
      let n2 = await t2();
      return this._legacyMigrationCommitted = true, n2;
    });
  }
  captureLegacyEntityLedger() {
    if (this.getAppliedSourceSnapshot(), this._isPlantLevelSystemEnabled()) throw Error(`Plant level identity migration is not yet available`);
    let e2 = {}, t2 = {};
    for (let n3 of [`plant`, `zombie`]) {
      let r2 = n3 === `plant` ? `PlantFeatures` : `ZombieFeatures`;
      e2[n3 + `Features`] = this._findAsset(r2)?.json, t2[n3 + `Features`] = this._originalData[r2] || e2[n3 + `Features`];
    }
    let n2 = ae(e2);
    for (let e3 of [`plant`, `zombie`]) {
      let t3 = b(`chunks:///_virtual/${e3 === `plant` ? `Plants` : `Zombies`}.ts`)?.[e3 === `plant` ? `PlantEnum` : `ZombieEnum`];
      for (let [r2, i2] of n2[e3].entries()) {
        let e4 = t3?.[r2];
        if (t3?.[i2] !== r2 || typeof e4 != `string` || e4 === `amount` || e4 === `zombieAmount` || t3[e4] !== r2) throw Error(`Legacy entity mapping does not match loaded data: ` + i2);
      }
    }
    return re({ original: ae(t2), patched: e2 });
  }
  getPlantRegistryDebug() {
    return this._plantRegistry.getDebugInfo();
  }
  getPlantLevelSystemDebug() {
    return this._plantLevelRegistry.getDebugInfo();
  }
  getPlantLevelBadgeDebug() {
    return this._plantLevelBadge.getStatus();
  }
  getPlantLevelConfig(e2) {
    return this._plantLevelRegistry.getConfig(e2);
  }
  getPlantLevelBaseCodename(e2) {
    return this._plantLevelRegistry.getBaseCodename(e2);
  }
  getPlantLevelCloneCodename(e2, t2) {
    return this._plantLevelRegistry.getCloneCodenameForLevel(e2, t2);
  }
};
export {
  CorePatcher
};
