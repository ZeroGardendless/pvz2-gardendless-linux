import { n as e, r as t, t as n } from "../vendor/ModuleHelpers.js";
import { a as r, d as i, i as a, n as o, o as s, p as c, r as l, s as u, t as d } from "../platform/FileSystem.js";
import { a as f, f as p, n as m, o as h, r as g, s as _, u as ee } from "./GameConfiguration.js";
import { t as te } from "../core/Logger.js";
import { a as ne, i as v, n as re, r as ie, t as ae } from "./PackSnapshot.js";
var oe = n(((e2, t22) => {
  (function(n2, r2) {
    typeof e2 == `object` && t22 !== void 0 ? t22.exports = r2() : typeof define == `function` && define.amd ? define(r2) : n2.JSON5 = r2();
  })(e2, (function() {
    function e3(e4, t4) {
      return t4 = { exports: {} }, e4(t4, t4.exports), t4.exports;
    }
    var t3 = e3(function(e4) {
      var t4 = e4.exports = typeof window < `u` && window.Math == Math ? window : typeof self < `u` && self.Math == Math ? self : Function(`return this`)();
      typeof __g == `number` && (__g = t4);
    }), n2 = e3(function(e4) {
      var t4 = e4.exports = { version: `2.6.5` };
      typeof __e == `number` && (__e = t4);
    });
    n2.version;
    var r2 = function(e4) {
      return typeof e4 == `object` ? e4 !== null : typeof e4 == `function`;
    }, i2 = function(e4) {
      if (!r2(e4)) throw TypeError(e4 + ` is not an object!`);
      return e4;
    }, a2 = function(e4) {
      try {
        return !!e4();
      } catch {
        return true;
      }
    }, o2 = !a2(function() {
      return Object.defineProperty({}, "a", { get: function() {
        return 7;
      } }).a != 7;
    }), s2 = t3.document, c2 = r2(s2) && r2(s2.createElement), l2 = function(e4) {
      return c2 ? s2.createElement(e4) : {};
    }, u2 = !o2 && !a2(function() {
      return Object.defineProperty(l2(`div`), "a", { get: function() {
        return 7;
      } }).a != 7;
    }), d2 = function(e4, t4) {
      if (!r2(e4)) return e4;
      var n3, i3;
      if (t4 && typeof (n3 = e4.toString) == `function` && !r2(i3 = n3.call(e4)) || typeof (n3 = e4.valueOf) == `function` && !r2(i3 = n3.call(e4)) || !t4 && typeof (n3 = e4.toString) == `function` && !r2(i3 = n3.call(e4))) return i3;
      throw TypeError(`Can't convert object to primitive value`);
    }, f2 = Object.defineProperty, p2 = { f: o2 ? Object.defineProperty : function(e4, t4, n3) {
      if (i2(e4), t4 = d2(t4, true), i2(n3), u2) try {
        return f2(e4, t4, n3);
      } catch {
      }
      if (`get` in n3 || `set` in n3) throw TypeError(`Accessors not supported!`);
      return `value` in n3 && (e4[t4] = n3.value), e4;
    } }, m2 = function(e4, t4) {
      return { enumerable: !(e4 & 1), configurable: !(e4 & 2), writable: !(e4 & 4), value: t4 };
    }, h2 = o2 ? function(e4, t4, n3) {
      return p2.f(e4, t4, m2(1, n3));
    } : function(e4, t4, n3) {
      return e4[t4] = n3, e4;
    }, g2 = {}.hasOwnProperty, _2 = function(e4, t4) {
      return g2.call(e4, t4);
    }, ee2 = 0, te2 = Math.random(), ne2 = function(e4) {
      return `Symbol(${e4 === void 0 ? `` : e4})_${(++ee2 + te2).toString(36)}`;
    }, v2 = false, re2 = e3(function(e4) {
      var r3 = `__core-js_shared__`, i3 = t3[r3] || (t3[r3] = {});
      (e4.exports = function(e5, t4) {
        return i3[e5] || (i3[e5] = t4 === void 0 ? {} : t4);
      })(`versions`, []).push({ version: n2.version, mode: v2 ? `pure` : `global`, copyright: `\xA9 2019 Denis Pushkarev (zloirock.ru)` });
    })(`native-function-to-string`, Function.toString), ie2 = e3(function(e4) {
      var r3 = ne2(`src`), i3 = `toString`, a3 = (`` + re2).split(i3);
      n2.inspectSource = function(e5) {
        return re2.call(e5);
      }, (e4.exports = function(e5, n3, i4, o3) {
        var s3 = typeof i4 == `function`;
        s3 && (_2(i4, `name`) || h2(i4, `name`, n3)), e5[n3] !== i4 && (s3 && (_2(i4, r3) || h2(i4, r3, e5[n3] ? `` + e5[n3] : a3.join(String(n3)))), e5 === t3 ? e5[n3] = i4 : o3 ? e5[n3] ? e5[n3] = i4 : h2(e5, n3, i4) : (delete e5[n3], h2(e5, n3, i4)));
      })(Function.prototype, i3, function() {
        return typeof this == `function` && this[r3] || re2.call(this);
      });
    }), ae2 = function(e4) {
      if (typeof e4 != `function`) throw TypeError(e4 + ` is not a function!`);
      return e4;
    }, oe2 = function(e4, t4, n3) {
      if (ae2(e4), t4 === void 0) return e4;
      switch (n3) {
        case 1:
          return function(n4) {
            return e4.call(t4, n4);
          };
        case 2:
          return function(n4, r3) {
            return e4.call(t4, n4, r3);
          };
        case 3:
          return function(n4, r3, i3) {
            return e4.call(t4, n4, r3, i3);
          };
      }
      return function() {
        return e4.apply(t4, arguments);
      };
    }, y2 = `prototype`, b2 = function(e4, r3, i3) {
      var a3 = e4 & b2.F, o3 = e4 & b2.G, s3 = e4 & b2.S, c3 = e4 & b2.P, l3 = e4 & b2.B, u3 = o3 ? t3 : s3 ? t3[r3] || (t3[r3] = {}) : (t3[r3] || {})[y2], d3 = o3 ? n2 : n2[r3] || (n2[r3] = {}), f3 = d3[y2] || (d3[y2] = {}), p3, m3, g3, _3;
      for (p3 in o3 && (i3 = r3), i3) m3 = !a3 && u3 && u3[p3] !== void 0, g3 = (m3 ? u3 : i3)[p3], _3 = l3 && m3 ? oe2(g3, t3) : c3 && typeof g3 == `function` ? oe2(Function.call, g3) : g3, u3 && ie2(u3, p3, g3, e4 & b2.U), d3[p3] != g3 && h2(d3, p3, _3), c3 && f3[p3] != g3 && (f3[p3] = g3);
    };
    t3.core = n2, b2.F = 1, b2.G = 2, b2.S = 4, b2.P = 8, b2.B = 16, b2.W = 32, b2.U = 64, b2.R = 128;
    var x2 = b2, se2 = Math.ceil, S2 = Math.floor, ce2 = function(e4) {
      return isNaN(e4 = +e4) ? 0 : (e4 > 0 ? S2 : se2)(e4);
    }, C2 = function(e4) {
      if (e4 == null) throw TypeError(`Can't call method on  ` + e4);
      return e4;
    }, w2 = /* @__PURE__ */ (function(e4) {
      return function(t4, n3) {
        var r3 = String(C2(t4)), i3 = ce2(n3), a3 = r3.length, o3, s3;
        return i3 < 0 || i3 >= a3 ? e4 ? `` : void 0 : (o3 = r3.charCodeAt(i3), o3 < 55296 || o3 > 56319 || i3 + 1 === a3 || (s3 = r3.charCodeAt(i3 + 1)) < 56320 || s3 > 57343 ? e4 ? r3.charAt(i3) : o3 : e4 ? r3.slice(i3, i3 + 2) : (o3 - 55296 << 10) + (s3 - 56320) + 65536);
      };
    })(false);
    x2(x2.P, `String`, { codePointAt: function(e4) {
      return w2(this, e4);
    } }), n2.String.codePointAt;
    var T2 = Math.max, E2 = Math.min, le2 = function(e4, t4) {
      return e4 = ce2(e4), e4 < 0 ? T2(e4 + t4, 0) : E2(e4, t4);
    }, D2 = String.fromCharCode, O2 = String.fromCodePoint;
    x2(x2.S + x2.F * (!!O2 && O2.length != 1), `String`, { fromCodePoint: function(e4) {
      for (var t4 = arguments, n3 = [], r3 = arguments.length, i3 = 0, a3; r3 > i3; ) {
        if (a3 = +t4[i3++], le2(a3, 1114111) !== a3) throw RangeError(a3 + ` is not a valid code point`);
        n3.push(a3 < 65536 ? D2(a3) : D2(((a3 -= 65536) >> 10) + 55296, a3 % 1024 + 56320));
      }
      return n3.join(``);
    } }), n2.String.fromCodePoint;
    var k2 = { Space_Separator: /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, ID_Start: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/, ID_Continue: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/ }, A2 = { isSpaceSeparator: function(e4) {
      return typeof e4 == `string` && k2.Space_Separator.test(e4);
    }, isIdStartChar: function(e4) {
      return typeof e4 == `string` && (e4 >= `a` && e4 <= `z` || e4 >= `A` && e4 <= `Z` || e4 === `$` || e4 === `_` || k2.ID_Start.test(e4));
    }, isIdContinueChar: function(e4) {
      return typeof e4 == `string` && (e4 >= `a` && e4 <= `z` || e4 >= `A` && e4 <= `Z` || e4 >= `0` && e4 <= `9` || e4 === `$` || e4 === `_` || e4 === `\u200C` || e4 === `\u200D` || k2.ID_Continue.test(e4));
    }, isDigit: function(e4) {
      return typeof e4 == `string` && /[0-9]/.test(e4);
    }, isHexDigit: function(e4) {
      return typeof e4 == `string` && /[0-9A-Fa-f]/.test(e4);
    } }, ue2, j2, M2, N2, P2, F2, I2, de2, L2, R2 = function(e4, t4) {
      ue2 = String(e4), j2 = `start`, M2 = [], N2 = 0, P2 = 1, F2 = 0, I2 = void 0, de2 = void 0, L2 = void 0;
      do
        I2 = fe2(), _e2[j2]();
      while (I2.type !== `eof`);
      return typeof t4 == `function` ? z2({ "": L2 }, ``, t4) : L2;
    };
    function z2(e4, t4, n3) {
      var r3 = e4[t4];
      if (typeof r3 == `object` && r3) if (Array.isArray(r3)) for (var i3 = 0; i3 < r3.length; i3++) {
        var a3 = String(i3), o3 = z2(r3, a3, n3);
        o3 === void 0 ? delete r3[a3] : Object.defineProperty(r3, a3, { value: o3, writable: true, enumerable: true, configurable: true });
      }
      else for (var s3 in r3) {
        var c3 = z2(r3, s3, n3);
        c3 === void 0 ? delete r3[s3] : Object.defineProperty(r3, s3, { value: c3, writable: true, enumerable: true, configurable: true });
      }
      return n3.call(e4, t4, r3);
    }
    var B2, V2, H2, U2, W2;
    function fe2() {
      for (B2 = `default`, V2 = ``, H2 = false, U2 = 1; ; ) {
        W2 = G2();
        var e4 = pe2[B2]();
        if (e4) return e4;
      }
    }
    function G2() {
      if (ue2[N2]) return String.fromCodePoint(ue2.codePointAt(N2));
    }
    function K2() {
      var e4 = G2();
      return e4 === `
` ? (P2++, F2 = 0) : e4 ? F2 += e4.length : F2++, e4 && (N2 += e4.length), e4;
    }
    var pe2 = { default: function() {
      switch (W2) {
        case `	`:
        case `\v`:
        case `\f`:
        case ` `:
        case `\xA0`:
        case `\uFEFF`:
        case `
`:
        case `\r`:
        case `\u2028`:
        case `\u2029`:
          K2();
          return;
        case `/`:
          K2(), B2 = `comment`;
          return;
        case void 0:
          return K2(), q2(`eof`);
      }
      if (A2.isSpaceSeparator(W2)) {
        K2();
        return;
      }
      return pe2[j2]();
    }, comment: function() {
      switch (W2) {
        case `*`:
          K2(), B2 = `multiLineComment`;
          return;
        case `/`:
          K2(), B2 = `singleLineComment`;
          return;
      }
      throw Z2(K2());
    }, multiLineComment: function() {
      switch (W2) {
        case `*`:
          K2(), B2 = `multiLineCommentAsterisk`;
          return;
        case void 0:
          throw Z2(K2());
      }
      K2();
    }, multiLineCommentAsterisk: function() {
      switch (W2) {
        case `*`:
          K2();
          return;
        case `/`:
          K2(), B2 = `default`;
          return;
        case void 0:
          throw Z2(K2());
      }
      K2(), B2 = `multiLineComment`;
    }, singleLineComment: function() {
      switch (W2) {
        case `
`:
        case `\r`:
        case `\u2028`:
        case `\u2029`:
          K2(), B2 = `default`;
          return;
        case void 0:
          return K2(), q2(`eof`);
      }
      K2();
    }, value: function() {
      switch (W2) {
        case `{`:
        case `[`:
          return q2(`punctuator`, K2());
        case `n`:
          return K2(), J2(`ull`), q2(`null`, null);
        case `t`:
          return K2(), J2(`rue`), q2(`boolean`, true);
        case `f`:
          return K2(), J2(`alse`), q2(`boolean`, false);
        case `-`:
        case `+`:
          K2() === `-` && (U2 = -1), B2 = `sign`;
          return;
        case `.`:
          V2 = K2(), B2 = `decimalPointLeading`;
          return;
        case `0`:
          V2 = K2(), B2 = `zero`;
          return;
        case `1`:
        case `2`:
        case `3`:
        case `4`:
        case `5`:
        case `6`:
        case `7`:
        case `8`:
        case `9`:
          V2 = K2(), B2 = `decimalInteger`;
          return;
        case `I`:
          return K2(), J2(`nfinity`), q2(`numeric`, 1 / 0);
        case `N`:
          return K2(), J2(`aN`), q2(`numeric`, NaN);
        case `"`:
        case `'`:
          H2 = K2() === `"`, V2 = ``, B2 = `string`;
          return;
      }
      throw Z2(K2());
    }, identifierNameStartEscape: function() {
      if (W2 !== `u`) throw Z2(K2());
      K2();
      var e4 = ge2();
      switch (e4) {
        case `$`:
        case `_`:
          break;
        default:
          if (!A2.isIdStartChar(e4)) throw ve2();
          break;
      }
      V2 += e4, B2 = `identifierName`;
    }, identifierName: function() {
      switch (W2) {
        case `$`:
        case `_`:
        case `\u200C`:
        case `\u200D`:
          V2 += K2();
          return;
        case `\\`:
          K2(), B2 = `identifierNameEscape`;
          return;
      }
      if (A2.isIdContinueChar(W2)) {
        V2 += K2();
        return;
      }
      return q2(`identifier`, V2);
    }, identifierNameEscape: function() {
      if (W2 !== `u`) throw Z2(K2());
      K2();
      var e4 = ge2();
      switch (e4) {
        case `$`:
        case `_`:
        case `\u200C`:
        case `\u200D`:
          break;
        default:
          if (!A2.isIdContinueChar(e4)) throw ve2();
          break;
      }
      V2 += e4, B2 = `identifierName`;
    }, sign: function() {
      switch (W2) {
        case `.`:
          V2 = K2(), B2 = `decimalPointLeading`;
          return;
        case `0`:
          V2 = K2(), B2 = `zero`;
          return;
        case `1`:
        case `2`:
        case `3`:
        case `4`:
        case `5`:
        case `6`:
        case `7`:
        case `8`:
        case `9`:
          V2 = K2(), B2 = `decimalInteger`;
          return;
        case `I`:
          return K2(), J2(`nfinity`), q2(`numeric`, U2 * (1 / 0));
        case `N`:
          return K2(), J2(`aN`), q2(`numeric`, NaN);
      }
      throw Z2(K2());
    }, zero: function() {
      switch (W2) {
        case `.`:
          V2 += K2(), B2 = `decimalPoint`;
          return;
        case `e`:
        case `E`:
          V2 += K2(), B2 = `decimalExponent`;
          return;
        case `x`:
        case `X`:
          V2 += K2(), B2 = `hexadecimal`;
          return;
      }
      return q2(`numeric`, U2 * 0);
    }, decimalInteger: function() {
      switch (W2) {
        case `.`:
          V2 += K2(), B2 = `decimalPoint`;
          return;
        case `e`:
        case `E`:
          V2 += K2(), B2 = `decimalExponent`;
          return;
      }
      if (A2.isDigit(W2)) {
        V2 += K2();
        return;
      }
      return q2(`numeric`, U2 * Number(V2));
    }, decimalPointLeading: function() {
      if (A2.isDigit(W2)) {
        V2 += K2(), B2 = `decimalFraction`;
        return;
      }
      throw Z2(K2());
    }, decimalPoint: function() {
      switch (W2) {
        case `e`:
        case `E`:
          V2 += K2(), B2 = `decimalExponent`;
          return;
      }
      if (A2.isDigit(W2)) {
        V2 += K2(), B2 = `decimalFraction`;
        return;
      }
      return q2(`numeric`, U2 * Number(V2));
    }, decimalFraction: function() {
      switch (W2) {
        case `e`:
        case `E`:
          V2 += K2(), B2 = `decimalExponent`;
          return;
      }
      if (A2.isDigit(W2)) {
        V2 += K2();
        return;
      }
      return q2(`numeric`, U2 * Number(V2));
    }, decimalExponent: function() {
      switch (W2) {
        case `+`:
        case `-`:
          V2 += K2(), B2 = `decimalExponentSign`;
          return;
      }
      if (A2.isDigit(W2)) {
        V2 += K2(), B2 = `decimalExponentInteger`;
        return;
      }
      throw Z2(K2());
    }, decimalExponentSign: function() {
      if (A2.isDigit(W2)) {
        V2 += K2(), B2 = `decimalExponentInteger`;
        return;
      }
      throw Z2(K2());
    }, decimalExponentInteger: function() {
      if (A2.isDigit(W2)) {
        V2 += K2();
        return;
      }
      return q2(`numeric`, U2 * Number(V2));
    }, hexadecimal: function() {
      if (A2.isHexDigit(W2)) {
        V2 += K2(), B2 = `hexadecimalInteger`;
        return;
      }
      throw Z2(K2());
    }, hexadecimalInteger: function() {
      if (A2.isHexDigit(W2)) {
        V2 += K2();
        return;
      }
      return q2(`numeric`, U2 * Number(V2));
    }, string: function() {
      switch (W2) {
        case `\\`:
          K2(), V2 += me2();
          return;
        case `"`:
          if (H2) return K2(), q2(`string`, V2);
          V2 += K2();
          return;
        case `'`:
          if (!H2) return K2(), q2(`string`, V2);
          V2 += K2();
          return;
        case `
`:
        case `\r`:
          throw Z2(K2());
        case `\u2028`:
        case `\u2029`:
          ye2(W2);
          break;
        case void 0:
          throw Z2(K2());
      }
      V2 += K2();
    }, start: function() {
      switch (W2) {
        case `{`:
        case `[`:
          return q2(`punctuator`, K2());
      }
      B2 = `value`;
    }, beforePropertyName: function() {
      switch (W2) {
        case `$`:
        case `_`:
          V2 = K2(), B2 = `identifierName`;
          return;
        case `\\`:
          K2(), B2 = `identifierNameStartEscape`;
          return;
        case `}`:
          return q2(`punctuator`, K2());
        case `"`:
        case `'`:
          H2 = K2() === `"`, B2 = `string`;
          return;
      }
      if (A2.isIdStartChar(W2)) {
        V2 += K2(), B2 = `identifierName`;
        return;
      }
      throw Z2(K2());
    }, afterPropertyName: function() {
      if (W2 === `:`) return q2(`punctuator`, K2());
      throw Z2(K2());
    }, beforePropertyValue: function() {
      B2 = `value`;
    }, afterPropertyValue: function() {
      switch (W2) {
        case `,`:
        case `}`:
          return q2(`punctuator`, K2());
      }
      throw Z2(K2());
    }, beforeArrayValue: function() {
      if (W2 === `]`) return q2(`punctuator`, K2());
      B2 = `value`;
    }, afterArrayValue: function() {
      switch (W2) {
        case `,`:
        case `]`:
          return q2(`punctuator`, K2());
      }
      throw Z2(K2());
    }, end: function() {
      throw Z2(K2());
    } };
    function q2(e4, t4) {
      return { type: e4, value: t4, line: P2, column: F2 };
    }
    function J2(e4) {
      for (var t4 = 0, n3 = e4; t4 < n3.length; t4 += 1) {
        var r3 = n3[t4];
        if (G2() !== r3) throw Z2(K2());
        K2();
      }
    }
    function me2() {
      switch (G2()) {
        case `b`:
          return K2(), `\b`;
        case `f`:
          return K2(), `\f`;
        case `n`:
          return K2(), `
`;
        case `r`:
          return K2(), `\r`;
        case `t`:
          return K2(), `	`;
        case `v`:
          return K2(), `\v`;
        case `0`:
          if (K2(), A2.isDigit(G2())) throw Z2(K2());
          return `\0`;
        case `x`:
          return K2(), he2();
        case `u`:
          return K2(), ge2();
        case `
`:
        case `\u2028`:
        case `\u2029`:
          return K2(), ``;
        case `\r`:
          return K2(), G2() === `
` && K2(), ``;
        case `1`:
        case `2`:
        case `3`:
        case `4`:
        case `5`:
        case `6`:
        case `7`:
        case `8`:
        case `9`:
          throw Z2(K2());
        case void 0:
          throw Z2(K2());
      }
      return K2();
    }
    function he2() {
      var e4 = ``, t4 = G2();
      if (!A2.isHexDigit(t4) || (e4 += K2(), t4 = G2(), !A2.isHexDigit(t4))) throw Z2(K2());
      return e4 += K2(), String.fromCodePoint(parseInt(e4, 16));
    }
    function ge2() {
      for (var e4 = ``, t4 = 4; t4-- > 0; ) {
        var n3 = G2();
        if (!A2.isHexDigit(n3)) throw Z2(K2());
        e4 += K2();
      }
      return String.fromCodePoint(parseInt(e4, 16));
    }
    var _e2 = { start: function() {
      if (I2.type === `eof`) throw Q2();
      Y2();
    }, beforePropertyName: function() {
      switch (I2.type) {
        case `identifier`:
        case `string`:
          de2 = I2.value, j2 = `afterPropertyName`;
          return;
        case `punctuator`:
          X2();
          return;
        case `eof`:
          throw Q2();
      }
    }, afterPropertyName: function() {
      if (I2.type === `eof`) throw Q2();
      j2 = `beforePropertyValue`;
    }, beforePropertyValue: function() {
      if (I2.type === `eof`) throw Q2();
      Y2();
    }, beforeArrayValue: function() {
      if (I2.type === `eof`) throw Q2();
      if (I2.type === `punctuator` && I2.value === `]`) {
        X2();
        return;
      }
      Y2();
    }, afterPropertyValue: function() {
      if (I2.type === `eof`) throw Q2();
      switch (I2.value) {
        case `,`:
          j2 = `beforePropertyName`;
          return;
        case `}`:
          X2();
      }
    }, afterArrayValue: function() {
      if (I2.type === `eof`) throw Q2();
      switch (I2.value) {
        case `,`:
          j2 = `beforeArrayValue`;
          return;
        case `]`:
          X2();
      }
    }, end: function() {
    } };
    function Y2() {
      var e4;
      switch (I2.type) {
        case `punctuator`:
          switch (I2.value) {
            case `{`:
              e4 = {};
              break;
            case `[`:
              e4 = [];
              break;
          }
          break;
        case `null`:
        case `boolean`:
        case `numeric`:
        case `string`:
          e4 = I2.value;
          break;
      }
      if (L2 === void 0) L2 = e4;
      else {
        var t4 = M2[M2.length - 1];
        Array.isArray(t4) ? t4.push(e4) : Object.defineProperty(t4, de2, { value: e4, writable: true, enumerable: true, configurable: true });
      }
      if (typeof e4 == `object` && e4) M2.push(e4), j2 = Array.isArray(e4) ? `beforeArrayValue` : `beforePropertyName`;
      else {
        var n3 = M2[M2.length - 1];
        j2 = n3 == null ? `end` : Array.isArray(n3) ? `afterArrayValue` : `afterPropertyValue`;
      }
    }
    function X2() {
      M2.pop();
      var e4 = M2[M2.length - 1];
      j2 = e4 == null ? `end` : Array.isArray(e4) ? `afterArrayValue` : `afterPropertyValue`;
    }
    function Z2(e4) {
      return xe2(e4 === void 0 ? `JSON5: invalid end of input at ` + P2 + `:` + F2 : `JSON5: invalid character '` + be2(e4) + `' at ` + P2 + `:` + F2);
    }
    function Q2() {
      return xe2(`JSON5: invalid end of input at ` + P2 + `:` + F2);
    }
    function ve2() {
      return F2 -= 5, xe2(`JSON5: invalid identifier character at ` + P2 + `:` + F2);
    }
    function ye2(e4) {
      console.warn(`JSON5: '` + be2(e4) + `' in strings is not valid ECMAScript; consider escaping`);
    }
    function be2(e4) {
      var t4 = { "'": `\\'`, '"': `\\"`, "\\": `\\\\`, "\b": `\\b`, "\f": `\\f`, "\n": `\\n`, "\r": `\\r`, "	": `\\t`, "\v": `\\v`, "\0": `\\0`, "\u2028": `\\u2028`, "\u2029": `\\u2029` };
      if (t4[e4]) return t4[e4];
      if (e4 < ` `) {
        var n3 = e4.charCodeAt(0).toString(16);
        return `\\x` + (`00` + n3).substring(n3.length);
      }
      return e4;
    }
    function xe2(e4) {
      var t4 = SyntaxError(e4);
      return t4.lineNumber = P2, t4.columnNumber = F2, t4;
    }
    return { parse: R2, stringify: function(e4, t4, n3) {
      var r3 = [], i3 = ``, a3, o3, s3 = ``, c3;
      if (typeof t4 == `object` && t4 && !Array.isArray(t4) && (n3 = t4.space, c3 = t4.quote, t4 = t4.replacer), typeof t4 == `function`) o3 = t4;
      else if (Array.isArray(t4)) {
        a3 = [];
        for (var l3 = 0, u3 = t4; l3 < u3.length; l3 += 1) {
          var d3 = u3[l3], f3 = void 0;
          typeof d3 == `string` ? f3 = d3 : (typeof d3 == `number` || d3 instanceof String || d3 instanceof Number) && (f3 = String(d3)), f3 !== void 0 && a3.indexOf(f3) < 0 && a3.push(f3);
        }
      }
      return n3 instanceof Number ? n3 = Number(n3) : n3 instanceof String && (n3 = String(n3)), typeof n3 == `number` ? n3 > 0 && (n3 = Math.min(10, Math.floor(n3)), s3 = `          `.substr(0, n3)) : typeof n3 == `string` && (s3 = n3.substr(0, 10)), p3(``, { "": e4 });
      function p3(e5, t5) {
        var n4 = t5[e5];
        switch (n4 != null && (typeof n4.toJSON5 == `function` ? n4 = n4.toJSON5(e5) : typeof n4.toJSON == `function` && (n4 = n4.toJSON(e5))), o3 && (n4 = o3.call(t5, e5, n4)), n4 instanceof Number ? n4 = Number(n4) : n4 instanceof String ? n4 = String(n4) : n4 instanceof Boolean && (n4 = n4.valueOf()), n4) {
          case null:
            return `null`;
          case true:
            return `true`;
          case false:
            return `false`;
        }
        if (typeof n4 == `string`) return m3(n4, false);
        if (typeof n4 == `number`) return String(n4);
        if (typeof n4 == `object`) return Array.isArray(n4) ? _3(n4) : h3(n4);
      }
      function m3(e5) {
        for (var t5 = { "'": 0.1, '"': 0.2 }, n4 = { "'": `\\'`, '"': `\\"`, "\\": `\\\\`, "\b": `\\b`, "\f": `\\f`, "\n": `\\n`, "\r": `\\r`, "	": `\\t`, "\v": `\\v`, "\0": `\\0`, "\u2028": `\\u2028`, "\u2029": `\\u2029` }, r4 = ``, i4 = 0; i4 < e5.length; i4++) {
          var a4 = e5[i4];
          switch (a4) {
            case `'`:
            case `"`:
              t5[a4]++, r4 += a4;
              continue;
            case `\0`:
              if (A2.isDigit(e5[i4 + 1])) {
                r4 += `\\x00`;
                continue;
              }
          }
          if (n4[a4]) {
            r4 += n4[a4];
            continue;
          }
          if (a4 < ` `) {
            var o4 = a4.charCodeAt(0).toString(16);
            r4 += `\\x` + (`00` + o4).substring(o4.length);
            continue;
          }
          r4 += a4;
        }
        var s4 = c3 || Object.keys(t5).reduce(function(e6, n5) {
          return t5[e6] < t5[n5] ? e6 : n5;
        });
        return r4 = r4.replace(new RegExp(s4, `g`), n4[s4]), s4 + r4 + s4;
      }
      function h3(e5) {
        if (r3.indexOf(e5) >= 0) throw TypeError(`Converting circular structure to JSON5`);
        r3.push(e5);
        var t5 = i3;
        i3 += s3;
        for (var n4 = a3 || Object.keys(e5), o4 = [], c4 = 0, l4 = n4; c4 < l4.length; c4 += 1) {
          var u4 = l4[c4], d4 = p3(u4, e5);
          if (d4 !== void 0) {
            var f4 = g3(u4) + `:`;
            s3 !== `` && (f4 += ` `), f4 += d4, o4.push(f4);
          }
        }
        var m4;
        if (o4.length === 0) m4 = `{}`;
        else {
          var h4;
          if (s3 === ``) h4 = o4.join(`,`), m4 = `{` + h4 + `}`;
          else {
            var _4 = `,
` + i3;
            h4 = o4.join(_4), m4 = `{
` + i3 + h4 + `,
` + t5 + `}`;
          }
        }
        return r3.pop(), i3 = t5, m4;
      }
      function g3(e5) {
        if (e5.length === 0) return m3(e5, true);
        var t5 = String.fromCodePoint(e5.codePointAt(0));
        if (!A2.isIdStartChar(t5)) return m3(e5, true);
        for (var n4 = t5.length; n4 < e5.length; n4++) if (!A2.isIdContinueChar(String.fromCodePoint(e5.codePointAt(n4)))) return m3(e5, true);
        return e5;
      }
      function _3(e5) {
        if (r3.indexOf(e5) >= 0) throw TypeError(`Converting circular structure to JSON5`);
        r3.push(e5);
        var t5 = i3;
        i3 += s3;
        for (var n4 = [], a4 = 0; a4 < e5.length; a4++) {
          var o4 = p3(String(a4), e5);
          n4.push(o4 === void 0 ? `null` : o4);
        }
        var c4;
        if (n4.length === 0) c4 = `[]`;
        else if (s3 === ``) c4 = `[` + n4.join(`,`) + `]`;
        else {
          var l4 = `,
` + i3, u4 = n4.join(l4);
          c4 = `[
` + i3 + u4 + `,
` + t5 + `]`;
        }
        return r3.pop(), i3 = t5, c4;
      }
    } };
  }));
})), y = t(oe(), 1);
function b(e2) {
  return `jsons/${m.some((t22) => t22.type === e2) ? `features` : e2.startsWith(`Level:`) ? `levels` : `objects`}/${e2}.json`;
}
function x(e2, t22, n2, r2) {
  let i2 = m.find((e3) => e3.type === t22), a2 = `objects`, o2 = null, s2 = n2;
  if (i2) if (i2.key) a2 = i2.key, o2 = i2.idKey || `CODENAME`;
  else {
    let t3 = p(n2), c3 = (i2.extraKeys || []).filter((e3) => e3.idKey), l3 = t3 ? c3.find((e3) => e3.key === t3[0]) : r2 ? c3.find((e3) => e3.typeFilter && r2[e3.typeFilter.field] === e3.typeFilter.value) : c3.find((t4) => t4.key === ee(i2, e2, n2)?.section);
    if (!l3) throw Error(`A unique feature section is required`);
    a2 = l3.key, o2 = l3.idKey, s2 = t3 ? t3[1] : n2;
  }
  else if (t22.startsWith(`Level:`)) return r2;
  let c2 = e2[a2] || [], l2 = c2.findIndex((e3) => String(o2 ? e3[o2] : e3.aliases?.[0]) === s2);
  return r2 === null ? l2 !== -1 && c2.splice(l2, 1) : l2 === -1 ? c2.push(r2) : c2[l2] = r2, c2.length ? e2[a2] = c2 : delete e2[a2], e2;
}
var se = e({ bindDiscoveredPackSnapshot: () => H, bindGpnEditsEditor: () => Fe, bindPackSnapshot: () => z, capturePackSnapshotFrom: () => Ee, clearAllGpnEdits: () => Be, clearCache: () => X, createCandidateReader: () => He, createZipContentMap: () => N, discoverPacks: () => Q, getBasePath: () => getBasePath, getPackSnapshotFrom: () => B, listDirFrom: () => Oe, loadFeaturePatchesFrom: () => ye, loadJsonPatchingConfigFrom: () => ve, loadLangPatchFrom: () => xe, loadLevelPatchesFrom: () => Ce, loadObjectsPatchesFrom: () => be, loadPlantLevelConfigFrom: () => Se, loadSettings: () => loadSettings, pathExistsFrom: () => ke, prepareDataPack: () => Ve, readBytesFrom: () => Te, readJsonFrom: () => De, readTextFrom: () => we, removeGpnEdit: () => ze, saveGpnEdit: () => Re, saveSettings: () => saveSettings }), S = new te(`file-loader`), ce = /* @__PURE__ */ new Set([`merge`, `replace`]);
function C(e2) {
  let t22 = String(e2 || ``).replace(/\\/g, `/`);
  return t22.replace(/\/+/g, `/`).replace(/^\//, t22.startsWith(`//`) ? `//` : `/`);
}
function w(e2) {
  return String(e2 || ``).replace(/\//g, `\\`);
}
async function T(e2) {
  return r(C(e2), { baseDir: h });
}
async function E(e2) {
  return s(C(e2), { baseDir: h });
}
async function le(e2) {
  return a(C(e2), { baseDir: h });
}
async function D(e2, t22) {
  return i(C(e2), t22, { baseDir: h });
}
async function O(e2) {
  return d(C(e2), { baseDir: h });
}
async function k(e2, t22 = true) {
  return l(C(e2), { baseDir: h, recursive: t22 });
}
async function A(e2, t22 = true) {
  return u(C(e2), { baseDir: h, recursive: t22 });
}
function ue(e2) {
  let t22 = ``, n2 = 8192;
  for (let r2 = 0; r2 < e2.length; r2 += n2) t22 += String.fromCharCode(...e2.subarray(r2, r2 + n2));
  return btoa(t22);
}
var j = new TextDecoder(`utf-8`, { fatal: true });
function M(e2) {
  try {
    return j.decode(e2);
  } catch {
    return null;
  }
}
function N(e2, t22 = ``) {
  let n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Map(), i2 = 0;
  t22 = t22.replace(/\\/g, `/`);
  for (let [a2, o2] of Object.entries(e2 || {})) {
    let e3 = a2.replace(/\\/g, `/`);
    if (e3.endsWith(`/`)) continue;
    if (t22 && !e3.startsWith(t22)) throw Error(`ZIP entry outside package root`);
    let s2 = v(t22 ? e3.slice(t22.length) : e3).replace(/\//g, `\\`);
    if (n2.has(s2)) throw Error(`Duplicate ZIP path: ` + s2);
    r2.set(s2, o2.slice());
    let c2 = M(o2);
    n2.set(s2, c2), c2 !== null && (i2 += 1);
  }
  return { contentMap: n2, byteMap: r2, textCount: i2 };
}
var P = /* @__PURE__ */ new Map(), F = /* @__PURE__ */ new Map(), I = /* @__PURE__ */ new Map(), de = /* @__PURE__ */ new WeakMap(), L = 0;
function R(e2) {
  let t22 = C(e2);
  for (let [e3, { snapshot: n2 }] of I) {
    if (t22 === e3) return { snapshot: n2, relative: `` };
    if (t22.startsWith(e3 + `/`)) return { snapshot: n2, relative: t22.slice(e3.length + 1) };
  }
  return null;
}
function z(e2, t22) {
  I.set(v(e2), { snapshot: t22 });
}
function B(e2) {
  return I.get(v(e2))?.snapshot ?? null;
}
function V(e2) {
  let { thumbnailUrl: t22, ...n2 } = e2;
  return JSON.stringify(n2);
}
async function H(e2, t22) {
  let n2 = de.get(e2), r2 = L;
  if (!n2 || n2.generation !== r2 || n2.dir !== e2.dir || n2.meta !== e2.meta || n2.signature !== V(e2.meta)) throw Error(`Package discovery changed or is unavailable; discover the package again`);
  if (t22.readText(`pack.json`) !== n2.manifest) throw Error(`Package manifest changed after discovery`);
  let i2 = v(e2.dir), a2 = I.get(i2);
  z(i2, t22);
  let o2 = I.get(i2);
  try {
    let t3 = await Y(n2.manifest ? y.default.parse(n2.manifest) : null, n2.fallbackName, e2.dir);
    if (L !== r2 || I.get(i2) !== o2) throw Error(`Package snapshot binding changed during validation; discover the package again`);
    if (V(t3) !== n2.signature) throw Error(`Package content metadata changed after discovery`);
    if (e2.dir !== n2.dir || e2.meta !== n2.meta || V(e2.meta) !== n2.signature) throw Error(`Package discovery changed during snapshot binding`);
  } catch (e3) {
    throw L === r2 && I.get(i2) === o2 && (a2 ? I.set(i2, a2) : I.delete(i2)), e3;
  }
}
function U(e2, t22, n2, r2) {
  return de.set(e2, { dir: e2.dir, meta: e2.meta, signature: V(e2.meta), manifest: t22 ?? null, fallbackName: n2, generation: r2 }), e2;
}
async function W(e2) {
  try {
    let t22 = ne(await T(e2)), n2 = Object.keys(t22).map((e3) => e3.replace(/\\/g, `/`)).filter((e3) => !e3.endsWith(`/`)), r2 = n2.some((e3) => !e3.includes(`/`)), i2 = ``;
    if (!r2 && n2.length > 0) {
      let e3 = n2.map((e4) => e4.split(`/`)[0]);
      e3.every((t3) => t3 === e3[0]) && (i2 = e3[0] + `/`);
    }
    let { contentMap: a2, byteMap: o2, textCount: s2 } = N(t22, i2), c2 = w(e2);
    return P.set(c2, a2), F.set(c2, o2), S.info(`Loaded ZIP: ${c2} (${s2} text file(s), ${a2.size} indexed file(s))`), a2;
  } catch (t22) {
    return S.error(`Failed to load ZIP ${e2}: ${t22}`), null;
  }
}
function fe(e2, t22) {
  let n2 = y.default.parse(e2);
  if (t22 && (!n2 || typeof n2 != `object` || Array.isArray(n2))) throw Error(`Expected object root`);
  return n2;
}
async function G(e2, t22 = false) {
  let n2 = R(e2);
  if (n2) {
    let e3 = n2.snapshot.readText(n2.relative);
    return e3 === null ? null : fe(e3, t22);
  }
  let r2 = w(e2);
  for (let [n3, i3] of P) {
    let a2 = n3 + `\\`;
    if (r2.startsWith(a2)) {
      let n4 = r2.slice(a2.length), o2 = i3.get(n4);
      if (typeof o2 != `string`) return null;
      try {
        return fe(o2, t22);
      } catch (t3) {
        throw S.error(`Failed to parse ${e2}: ${t3}`), Error(`ParseError: ${e2}`);
      }
    }
  }
  let i2;
  try {
    i2 = await E(e2);
  } catch {
    return null;
  }
  try {
    return fe(i2, t22);
  } catch (t3) {
    throw S.error(`Failed to parse ${e2}: ${t3}`), Error(`ParseError: ${e2}`);
  }
}
async function K(e2) {
  let t22 = R(e2);
  if (t22) {
    let e3 = t22.relative ? t22.relative + `/` : ``, n3 = /* @__PURE__ */ new Map();
    for (let r2 of t22.snapshot.listPaths()) {
      if (!r2.startsWith(e3)) continue;
      let t3 = r2.slice(e3.length), i2 = t3.split(`/`)[0], a2 = !t3.includes(`/`);
      n3.set(i2, { name: i2, isFile: a2, isDirectory: !a2 });
    }
    return [...n3.values()];
  }
  let n2 = w(e2);
  for (let [e3, t3] of P) {
    let r2 = e3 + `\\`;
    if (n2 !== e3 && !n2.startsWith(r2)) continue;
    let i2 = n2 === e3 ? `` : n2.slice(r2.length) + `\\`, a2 = /* @__PURE__ */ new Map();
    for (let e4 of t3.keys()) {
      if (i2 && !e4.startsWith(i2)) continue;
      let t4 = e4.slice(i2.length), n3 = t4.indexOf(`\\`);
      n3 === -1 ? a2.set(t4, true) : a2.set(t4.slice(0, n3), false);
    }
    return Array.from(a2.entries()).map(([e4, t4]) => ({ name: e4, isFile: t4 }));
  }
  try {
    return await le(e2);
  } catch {
    return [];
  }
}
async function pe(e2) {
  let t22 = R(e2);
  if (t22) return t22.snapshot.readText(t22.relative);
  let n2 = w(e2);
  for (let [e3, t3] of P) {
    let r2 = e3 + `\\`;
    if (!n2.startsWith(r2)) continue;
    let i2 = n2.slice(r2.length);
    return t3.has(i2) ? t3.get(i2) : null;
  }
  try {
    return await E(e2);
  } catch {
    return null;
  }
}
async function q(e2) {
  let t22 = R(e2);
  if (t22) return !t22.relative || t22.snapshot.listPaths().some((e3) => e3 === t22.relative || e3.startsWith(t22.relative + `/`));
  let n2 = w(e2);
  for (let [e3, t3] of P) {
    let r2 = e3 + `\\`;
    if (!n2.startsWith(r2)) continue;
    let i2 = n2.slice(r2.length);
    if (t3.has(i2)) return true;
    let a2 = i2 ? i2 + `\\` : ``;
    for (let e4 of t3.keys()) if (e4.startsWith(a2)) return true;
    return false;
  }
  try {
    return await O(e2);
  } catch {
    return false;
  }
}
function J(e2, t22, n2) {
  let r2 = String(e2 || ``).trim().toLowerCase();
  return r2 ? ce.has(r2) ? r2 : (n2?.push(`${t22}: invalid mode "${e2}"`), null) : null;
}
function me(e2, t22, n2, r2) {
  let i2 = {};
  if (!e2 || typeof e2 != `object` || Array.isArray(e2)) return i2;
  let a2 = new Set(t22);
  for (let [t3, o2] of Object.entries(e2)) {
    if (!a2.has(t3)) {
      r2?.push(`${n2}.${t3}: unknown type`);
      continue;
    }
    if (!o2 || typeof o2 != `object` || Array.isArray(o2)) {
      r2?.push(`${n2}.${t3}: expected object`);
      continue;
    }
    let e3 = J(o2.mode, `${n2}.${t3}.mode`, r2);
    e3 && (i2[t3] = { mode: e3 });
  }
  return i2;
}
async function he(e2) {
  let t22 = await K(e2);
  return Array.isArray(t22) && t22.length > 0;
}
function ge(e2) {
  let t22 = Array.isArray(e2) ? e2 : [], n2 = [], r2 = /* @__PURE__ */ new Set();
  for (let e3 of t22) {
    let t3 = String(e3 || ``).trim().toLowerCase();
    !t3 || r2.has(t3) || (r2.add(t3), n2.push(t3));
  }
  return n2;
}
function _e(e2) {
  let t22 = [], n2 = /* @__PURE__ */ new Set();
  if (!Array.isArray(e2)) return t22;
  for (let r2 of e2) {
    let e3 = String(r2 || ``).trim();
    !e3 || n2.has(e3) || (n2.add(e3), t22.push(e3));
  }
  return t22;
}
async function Y(e2, t22, n2, r2 = null) {
  let i2 = r2?.pathExists || q, a2 = r2 ? async (e3) => (await r2.listDir(e3)).length > 0 : he, o2 = { packFormatVersion: 1, uuid: ``, name: t22, version: `1.0.0`, priority: 100, description: ``, author: ``, thumbnailUrl: ``, gameVersion: ``, minGpNextVersion: ``, maxGpNextVersion: ``, apiVersion: 0, featureFlags: [], requiredGpNextFeatures: [], capabilities: [], js: null, depends: [], optionalDepends: [] };
  e2 && typeof e2 == `object` && Object.assign(o2, e2), o2.validationErrors = [], e2 && Object.hasOwn(e2, `packFormatVersion`) && (![`number`, `string`].includes(typeof e2.packFormatVersion) || !Number.isInteger(Number(e2.packFormatVersion)) || Number(e2.packFormatVersion) < 1) && o2.validationErrors.push(`packFormatVersion must be a positive integer`);
  for (let t3 of [`requiredGpNextFeatures`, `depends`, `optionalDepends`]) e2 && Object.hasOwn(e2, t3) && (!Array.isArray(e2[t3]) || e2[t3].some((e3) => typeof e3 != `string` || !e3.trim())) && o2.validationErrors.push(`${t3} must be an array of non-empty strings`);
  e2?.js != null && (typeof e2.js != `object` || Array.isArray(e2.js) ? o2.validationErrors.push(`js must be an object`) : Object.hasOwn(e2.js, `entry`) && (typeof e2.js.entry != `string` || !e2.js.entry.trim()) && o2.validationErrors.push(`js.entry must be a non-empty relative script path`)), e2?.js && Object.hasOwn(e2.js, `startup`) && typeof e2.js.startup != `boolean` && o2.validationErrors.push(`js.startup must be a boolean`), o2.packFormatVersion = Number.isFinite(Number(o2.packFormatVersion)) ? Number(o2.packFormatVersion) : 1, o2.name = String(o2.name || t22 || `(unnamed)`), o2.version = String(o2.version || `1.0.0`), o2.priority = Number.isFinite(Number(o2.priority)) ? Number(o2.priority) : 100, o2.description = typeof o2.description == `string` ? o2.description : ``, o2.author = typeof o2.author == `string` ? o2.author : ``, o2.uuid = typeof o2.uuid == `string` ? o2.uuid : ``, o2.gameVersion = typeof o2.gameVersion == `string` ? o2.gameVersion : ``, o2.apiVersion = Number.isFinite(Number(o2.apiVersion)) ? Number(o2.apiVersion) : 0, o2.featureFlags = Array.isArray(o2.featureFlags) ? o2.featureFlags.map((e3) => String(e3)) : [], o2.requiredGpNextFeatures = _e(o2.requiredGpNextFeatures), o2.depends = _e(o2.depends), o2.optionalDepends = _e(o2.optionalDepends);
  let s2 = ge(o2.capabilities), c2 = [];
  (await a2(`${n2}\\jsons\\features`) || await a2(`${n2}\\jsons\\objects`) || await a2(`${n2}\\jsons\\levels`) || await a2(`${n2}\\jsons\\gp-next`) || await a2(`${n2}\\jsons\\worldmap`)) && c2.push(`json`), (await i2(`${n2}\\jsons\\lang\\lang.json`) || await i2(`${n2}\\jsons\\lang\\lang.json5`)) && c2.push(`lang`);
  let l2 = o2.js && typeof o2.js == `object` ? { ...o2.js } : null, u2 = typeof l2?.entry == `string` && l2.entry.trim() ? l2.entry.trim() : await i2(`${n2}\\scripts\\main.js`) ? `scripts/main.js` : ``;
  !u2 && l2?.startup === true && o2.validationErrors.push(`js.startup requires a script entry`), u2 ? (o2.js = { entry: String(u2).replace(/\\/g, `/`), startup: l2?.startup === void 0 ? false : l2.startup, reloadable: l2?.reloadable !== false, requiresTrustedExecution: l2?.requiresTrustedExecution !== false, setupTimeoutMs: Number.isFinite(Number(l2?.setupTimeoutMs)) ? Number(l2.setupTimeoutMs) : void 0, importTimeoutMs: Number.isFinite(Number(l2?.importTimeoutMs)) ? Number(l2.importTimeoutMs) : void 0, cleanupTimeoutMs: Number.isFinite(Number(l2?.cleanupTimeoutMs)) ? Number(l2.cleanupTimeoutMs) : void 0, permissions: _e(l2?.permissions) }, c2.push(`js`)) : o2.js = null;
  let d2 = await i2(`${n2}\\assets\\manifest.json`) || await i2(`${n2}\\assets\\manifest.json5`), f2 = await a2(`${n2}\\assets`);
  return (d2 || f2) && c2.push(`asset`), o2.capabilities = ge([...s2, ...c2]), o2;
}
function X() {
  L++, P.clear(), F.clear(), I.clear(), S.debug(`ZIP content cache cleared`);
}
function Z(e2, t22) {
  return new Promise((n2) => {
    let r2 = new Image();
    r2.onload = () => n2(r2.width <= t22 && r2.height <= t22), r2.onerror = () => n2(false), r2.src = e2;
  });
}
async function Q(e2 = [], t22 = [], n2 = null) {
  let r2 = L;
  if (!n2) try {
    await k(g.ROOT), await k(g.PACKS_ROOT), await k(g.SINGLE_PATCHES);
  } catch (e3) {
    S.error(`Failed to create base directories: ${e3}`);
  }
  let i2 = await (n2?.listDir || K)(g.PACKS_ROOT), a2 = [];
  for (let e3 of i2) {
    if (e3.isFile) {
      if (!/\.zip$/i.test(e3.name)) continue;
      let i4 = `${g.PACKS_ROOT}\\${e3.name}`, o3 = await (n2?.loadZip || W)(i4);
      if (!o3) continue;
      let s3 = null, c3 = o3.get(`pack.json`), l2 = false;
      if (c3) try {
        s3 = await Y(y.default.parse(c3), e3.name.replace(/\.zip$/i, ``), i4, n2), l2 = true;
      } catch (t3) {
        S.error(`Pack ${e3.name} pack.json parse error: ${t3}`);
      }
      else S.error(`Pack ${e3.name} is missing pack.json`);
      s3 ||= await Y(null, e3.name.replace(/\.zip$/i, ``), i4, n2), l2 && (s3.uuid || S.warn(`ZIP pack '${e3.name}' has no uuid in pack.json \u2014 order persistence disabled for this pack`), s3.name === e3.name.replace(/\.zip$/i, ``) && S.warn(`ZIP pack '${e3.name}' has no custom name in pack.json`)), a2.push((n2?.remember || U)({ dir: i4, meta: s3, preflightErrors: s3.validationErrors, enabled: !s3.uuid || !t22.includes(s3.uuid) }, c3, e3.name.replace(/\.zip$/i, ``), r2));
      continue;
    }
    let i3 = `${g.PACKS_ROOT}\\${e3.name}`, o2 = null, s2 = false, c2 = null;
    try {
      c2 = await (n2?.readText || pe)(`${i3}\\pack.json`);
      let t3 = c2 ? y.default.parse(c2) : null;
      t3 ? (o2 = await Y(t3, e3.name, i3, n2), s2 = true) : S.error(`Pack '${e3.name}' is missing pack.json`);
    } catch (t3) {
      S.error(`Pack '${e3.name}' pack.json parse error: ${t3}`);
    }
    o2 ||= await Y(null, e3.name, i3, n2), s2 && (o2.uuid || S.warn(`Pack '${e3.name}' has no uuid in pack.json \u2014 order persistence disabled for this pack`), o2.name === e3.name && S.warn(`Pack '${e3.name}' has no custom name in pack.json`));
    for (let e4 of [`png`, `ico`]) {
      let t3 = `${i3}\\thumbnail.${e4}`;
      try {
        let n3 = await T(t3), r3 = `data:${e4 === `ico` ? `image/x-icon` : `image/${e4}`};base64,${ue(n3)}`;
        await Z(r3, 128) ? o2.thumbnailUrl = r3 : S.warn(`Thumbnail ${t3} ignored: dimensions exceed 128x128.`);
        break;
      } catch {
      }
    }
    a2.push((n2?.remember || U)({ dir: i3, meta: o2, preflightErrors: o2.validationErrors, enabled: !o2.uuid || !t22.includes(o2.uuid) }, c2, e3.name, r2));
  }
  return e2.length > 0 ? a2.sort((t3, n3) => {
    let r3 = t3.meta.uuid ? e2.indexOf(t3.meta.uuid) : -1, i3 = n3.meta.uuid ? e2.indexOf(n3.meta.uuid) : -1;
    return r3 !== -1 && i3 !== -1 ? r3 - i3 : r3 === -1 ? i3 === -1 ? t3.meta.priority - n3.meta.priority || t3.meta.name.localeCompare(n3.meta.name) : 1 : -1;
  }) : a2.sort((e3, t3) => e3.meta.priority - t3.meta.priority || e3.meta.name.localeCompare(t3.meta.name)), S.info(`Discovered ${a2.length} datapack(s)`), a2;
}
async function ve(e2, t22 = null) {
  let n2 = { defaultMode: `merge`, features: {}, objects: {}, errors: [] }, r2 = null;
  try {
    r2 = await (t22?.readFile || G)(`${e2}\\jsons\\config\\patching.json`, true), r2 ||= await (t22?.readFile || G)(`${e2}\\jsons\\config\\patching.json5`, true);
  } catch (e3) {
    return n2.errors.push(`patching config parse error: ${e3}`), n2;
  }
  if (!r2) return n2;
  if (typeof r2 != `object` || Array.isArray(r2)) return n2.errors.push(`patching config: expected object root`), n2;
  let i2 = J(r2.defaultMode, `defaultMode`, n2.errors);
  if (i2 && (n2.defaultMode = i2), n2.features = me(r2.features, m.map((e3) => e3.type), `features`, n2.errors), n2.objects = me(r2.objects, f.map((e3) => e3.type), `objects`, n2.errors), n2.errors.length) for (let t3 of n2.errors) S.warn(`[${e2}] ${t3}`);
  return n2;
}
async function ye(e2, t22 = null, n2 = null) {
  let r2 = /* @__PURE__ */ new Map(), i2 = [], a2 = `${e2}\\jsons\\features`, o2 = t22?.defaultMode === `replace` ? `replace` : `merge`;
  for (let s2 of m) try {
    let i3 = await (n2?.readFile || G)(`${a2}\\${s2.type}.json`, true);
    if (i3 ||= await (n2?.readFile || G)(`${a2}\\${s2.type}.json5`, true), i3) {
      let n3 = t22?.features?.[s2.type]?.mode ?? o2;
      r2.set(s2.type, { data: i3, config: s2, mode: n3 }), S.debug(`[${e2}] Loaded feature: ${s2.type}`);
    }
  } catch {
    i2.push(s2.type);
  }
  return { patches: r2, errors: i2 };
}
async function be(e2, t22 = null, n2 = null) {
  let r2 = /* @__PURE__ */ new Map(), i2 = [], a2 = `${e2}\\jsons\\objects`, o2 = t22?.defaultMode === `replace` ? `replace` : `merge`;
  for (let e3 of f) try {
    let i3 = await (n2?.readFile || G)(`${a2}\\${e3.type}.json`, true);
    if (i3 ||= await (n2?.readFile || G)(`${a2}\\${e3.type}.json5`, true), i3) {
      let n3 = t22?.objects?.[e3.type]?.mode ?? o2;
      r2.set(e3.type, { data: i3, config: e3, mode: n3 });
    }
  } catch {
    i2.push(e3.type);
  }
  return { patches: r2, errors: i2 };
}
async function xe(e2, t22 = null) {
  try {
    let n2 = await (t22?.readFile || G)(`${e2}\\jsons\\lang\\lang.json`, true);
    return n2 ||= await (t22?.readFile || G)(`${e2}\\jsons\\lang\\lang.json5`, true), { data: n2 || null, error: false };
  } catch {
    return { data: null, error: true };
  }
}
async function Se(e2, t22 = null) {
  try {
    let n2 = await (t22?.readFile || G)(`${e2}\\jsons\\extensions\\plant-levels.json`, true);
    return n2 ||= await (t22?.readFile || G)(`${e2}\\jsons\\extensions\\plant-levels.json5`, true), { data: n2 || null, error: false };
  } catch {
    return { data: null, error: true };
  }
}
async function Ce(e2, t22 = null) {
  let n2 = /* @__PURE__ */ new Map(), r2 = [], i2 = `${e2}\\jsons\\levels`, a2 = await (t22?.listDir || K)(i2);
  for (let o2 of a2) {
    if (!o2.isFile) continue;
    let a3 = o2.name.toLowerCase();
    if (!(!a3.endsWith(`.json`) && !a3.endsWith(`.json5`))) try {
      let r3 = await (t22?.readFile || G)(`${i2}\\${o2.name}`, true);
      r3 && (n2.set(o2.name, r3), S.debug(`[${e2}] Loaded level: ${o2.name}`));
    } catch {
      r2.push(o2.name);
    }
  }
  return { patches: n2, errors: r2 };
}
async function we(e2, t22) {
  let n2 = String(t22 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return n2 ? pe(`${e2}\\${n2}`) : null;
}
async function Te(e2, t22) {
  let n2 = v(t22, { label: `resource path` }), r2 = R(`${e2}/${n2}`);
  if (r2) return r2.snapshot.readBytes(r2.relative);
  let i2 = w(e2), a2 = F.get(i2);
  if (a2) {
    let e3 = a2.get(w(n2));
    return e3 ? e3.slice() : null;
  }
  try {
    let t3 = v(`${e2}/${n2}`, { label: `pack resource` }), r3 = t3.split(`/`);
    for (let e3 = 1; e3 <= r3.length; e3++) if ((await o(r3.slice(0, e3).join(`/`), { baseDir: h })).isSymlink) return null;
    return await T(t3);
  } catch {
    return null;
  }
}
function Ee(e2) {
  return ae(e2, { lstat: (e3) => o(e3, { baseDir: h }), readDir: le, readFile: T });
}
async function De(e2, t22) {
  if ($ && C(e2) === C(g.GPN_EDITS)) return await Pe, $.readJson(t22);
  let n2 = String(t22 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return n2 ? G(`${e2}\\${n2}`) : null;
}
async function Oe(e2, t22) {
  let n2 = String(t22 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return K(n2 ? `${e2}\\${n2}` : e2);
}
async function ke(e2, t22) {
  let n2 = String(t22 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return q(n2 ? `${e2}\\${n2}` : e2);
}
async function getBasePath() {
  try {
    return await c();
  } catch {
    return `(unknown)`;
  }
}
async function loadSettings() {
  try {
    let e2 = await G(_);
    return !e2 || typeof e2 != `object` ? { packOrder: [], disabledPacks: [], version: 1 } : { packOrder: Array.isArray(e2.packOrder) ? e2.packOrder : [], disabledPacks: Array.isArray(e2.disabledPacks) ? e2.disabledPacks : [], version: e2.version || 1 };
  } catch {
    return { packOrder: [], disabledPacks: [], version: 1 };
  }
}
async function saveSettings(e2) {
  try {
    return await D(_, JSON.stringify({ version: 1, ...e2 }, null, 2)), S.info(`Settings saved`), true;
  } catch (e3) {
    return S.error(`Failed to save settings: ${e3}`), false;
  }
}
async function Ne() {
  let e2 = g.GPN_EDITS;
  try {
    await k(e2), await k(`${e2}\\jsons\\features`), await k(`${e2}\\jsons\\objects`), await k(`${e2}\\jsons\\levels`);
  } catch (e3) {
    S.error(`Failed to create GPN edits directories: ${e3}`);
  }
  let t22 = `${e2}\\pack.json`;
  if (!await O(t22)) {
    let e3 = { uuid: `gpn_edits`, name: `GP-Next Internal Edits`, version: `1.0.0`, priority: 1e4, description: `Locally saved manual edits from GP-Next Data Viewer. DO NOT DELETE manually.` };
    try {
      await D(t22, JSON.stringify(e3, null, 2));
    } catch (e4) {
      S.error(`Failed to create pack.json for GPN edits: ${e4}`);
    }
  }
}
var $ = null, Pe = Promise.resolve();
function Fe(e2) {
  $ = e2;
}
function Ie(e2) {
  let t22 = Pe.then(e2).catch((e3) => (S.error(`Manual edit failed: ${e3}`), false));
  return Pe = t22, t22;
}
async function Le(e2, t22, n2) {
  n2 !== null && await Ne();
  let r2 = `${g.GPN_EDITS}/${b(e2)}`;
  if (n2 === null && !await O(r2)) return true;
  let i2 = await O(r2) ? y.default.parse(await E(r2)) : {};
  return await D(r2, JSON.stringify(x(i2, e2, t22, n2), null, 2)), true;
}
function Re(e2, t22, n2) {
  let r2 = structuredClone(n2);
  return Ie(() => $ ? $.save(e2, t22, r2) : Le(e2, t22, r2));
}
function ze(e2, t22) {
  return Ie(() => $ ? $.remove(e2, t22) : Le(e2, t22, null));
}
function Be() {
  return Ie(async () => {
    if ($) return $.clear();
    let e2 = `${g.GPN_EDITS}/jsons`;
    return await O(e2) && await A(e2), true;
  });
}
async function Ve(e2, t22 = null) {
  let n2 = await ve(e2, t22), [r2, i2, a2, o2, s2] = await Promise.all([ye(e2, n2, t22), be(e2, n2, t22), Ce(e2, t22), xe(e2, t22), Se(e2, t22)]), c2 = [...n2.errors, ...r2.errors, ...i2.errors, ...a2.errors];
  return o2.error && c2.push(`lang: invalid JSON`), s2.error && c2.push(`plant-levels: invalid JSON`), { config: n2, features: r2, objects: i2, levels: a2, lang: o2, plantLevels: s2, errors: c2 };
}
function He(e2 = null) {
  let t22 = e2 !== null, n2 = new Map([...e2 || []].map(([e3, t3]) => [C(e3), t3])), r2 = /* @__PURE__ */ new WeakMap(), i2 = (e3) => {
    let t3 = C(e3);
    for (let [e4, r3] of n2) if (t3 === e4 || t3.startsWith(e4 + `/`)) return { snapshot: r3, relative: t3.slice(e4.length).replace(/^\//, ``) };
    return null;
  }, a2 = async (e3, n3, r3) => {
    if (t22) throw Error(`Path is outside installed snapshots: ${e3}`);
    try {
      return await n3(e3);
    } catch (t3) {
      if (await O(e3)) throw t3;
      return r3;
    }
  }, o2 = { readText: async (e3) => {
    let t3 = i2(e3);
    return t3 ? t3.snapshot.readText(t3.relative) : a2(e3, E, null);
  }, readFile: async (e3, t3 = false) => {
    let n3 = await o2.readText(e3);
    return n3 === null ? null : fe(n3, t3);
  }, listDir: async (e3) => {
    let t3 = i2(e3);
    if (!t3) return a2(e3, le, []);
    let n3 = t3.relative ? t3.relative + `/` : ``, r3 = /* @__PURE__ */ new Map();
    for (let e4 of t3.snapshot.listPaths()) if (e4.startsWith(n3)) {
      let t4 = e4.slice(n3.length), i3 = t4.split(`/`)[0];
      r3.set(i3, { name: i3, isFile: !t4.includes(`/`), isDirectory: t4.includes(`/`) });
    }
    return [...r3.values()];
  }, pathExists: async (e3) => {
    let n3 = i2(e3);
    if (!n3 && t22) throw Error(`Path is outside installed snapshots: ${e3}`);
    return n3 ? !n3.relative || n3.snapshot.listPaths().some((e4) => e4 === n3.relative || e4.startsWith(n3.relative + `/`)) : O(e3);
  }, loadZip: async (e3) => {
    if (t22) throw Error(`Installed snapshots are already unpacked`);
    let r3 = await ie(await T(e3));
    return n2.set(C(e3), r3), /* @__PURE__ */ new Map([[`pack.json`, r3.readText(`pack.json`)]]);
  }, remember(e3, t3, n3) {
    return r2.set(e3, { dir: e3.dir, meta: e3.meta, signature: V(e3.meta), manifest: t3 ?? null, fallbackName: n3 }), e3;
  }, async capture(e3) {
    let i3 = r2.get(e3);
    if (!i3 || i3.dir !== e3.dir || i3.meta !== e3.meta || i3.signature !== V(e3.meta)) throw Error(`Candidate discovery changed`);
    let a3 = t22 ? n2.get(C(e3.dir)) : await Ee(e3.dir);
    if (!a3) throw Error(`Installed package snapshot is missing`);
    if (a3.readText(`pack.json`) !== i3.manifest) throw Error(`Package manifest changed after discovery`);
    if (n2.set(C(e3.dir), a3), V(await Y(i3.manifest ? y.default.parse(i3.manifest) : null, i3.fallbackName, e3.dir, o2)) !== i3.signature) throw Error(`Package content metadata changed after discovery`);
    return a3;
  }, async captureOptional(e3) {
    if (t22) {
      let t3 = n2.get(C(e3));
      if (!t3) throw Error(`Installed override snapshot is missing: ${e3}`);
      return t3;
    }
    let r3 = await O(e3) ? await Ee(e3) : await re([]);
    return n2.set(C(e3), r3), r3;
  }, async describeInstalled(e3, { id: r3, version: i3, enabled: a3 = true, legacy: s2 = false, fallbackName: c2 = r3, runtimeNamespace: l2 }) {
    if (!t22) throw Error(`Installed descriptors require fixed snapshots`);
    let u2 = n2.get(C(e3));
    if (!u2) throw Error(`Installed package snapshot is missing`);
    let d2 = u2.readText(`pack.json`);
    if (!d2 && !s2) throw Error(`Installed packages require pack.json`);
    if (typeof c2 != `string` || !c2.trim()) throw Error(`Installed fallback name is missing`);
    let f2 = await Y(d2 ? y.default.parse(d2) : null, c2, e3, o2);
    if (!r3 || f2.version !== i3) throw Error(`Installed manifest identity differs from selection`);
    if (s2) {
      if (s2 !== true || !/^legacy:[a-f0-9]{64}$/.test(r3) || f2.uuid || f2.js || l2 !== f2.name) throw Error(`Invalid legacy installed identity or script content`);
    } else if (f2.uuid !== r3) throw Error(`Installed manifest identity differs from selection`);
    return o2.remember({ dir: e3, meta: f2, enabled: a3, contentDigest: u2.digest, installationId: r3 }, d2, c2);
  }, readTextFrom(e3, t3) {
    return o2.readText(`${e3}/${v(t3)}`);
  } };
  return o2;
}
import { t as t2 } from "./GameConfiguration.js";
export {
  t2 as F,
  Q as a,
  Ve as c,
  ze as d,
  Re as f,
  getBasePath,
  oe as h,
  He as i,
  De as l,
  loadSettings,
  b as m,
  Be as n,
  se as o,
  x as p,
  X as r,
  loadSettings as s,
  saveSettings,
  z as t,
  we as u
};
