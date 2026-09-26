import { normalizeFilePath } from "../platform/Paths.js";
import { n as e, r as t, t as n } from "../vendor/ModuleHelpers.js";
import { t as r } from "../core/Logger.js";
import { a as i, d as a, f as o, i as s, n as c, o as l, r as u, s as d, t as f, u as p } from "../platform/FileSystem.js";
import { a as m, i as h, n as g, r as _, t as ee } from "./PackSnapshot.js";
var te = `1.5.0-pre.1`, v = a.AppData, y = { ROOT: `gp-next`, PACKS_ROOT: `gp-next\\packs`, SINGLE_PATCHES: `gp-next\\patches`, GPN_EDITS: `gp-next\\__gpn_edits` }, b = `gp-next\\settings.json`, ne = `gp-next/mod-settings.json`, x = [{ type: `PlantFeatures`, key: `PLANTS`, extraKeys: [{ key: `SEEDCHOOSERDEFAULTORDER` }, { key: `ALMANACHIDDENORDER` }, { key: `BASEUNLOCKLIST` }, { key: `SANDBOX` }] }, { type: `ZombieFeatures`, key: `ZOMBIES`, extraKeys: [{ key: `ALMANAC` }] }, { type: `ProjectileFeatures`, key: `PROJECTILES` }, { type: `TombstonesFeatures`, key: `Tombstones` }, { type: `UpgradeFeatures`, key: `UPGRADES` }, { type: `ArmorFeatures`, key: `ARMORS` }, { type: `DinosaurFeatures`, key: `DINOSAURS` }, { type: `LawnFeatures`, key: `LAWNS` }, { type: `TrophyFeatures`, key: `TROPHIES` }, { type: `TilesFeatures`, key: `Tiles` }, { type: `TileLiquidsFeatures`, key: `Tiles` }, { type: `MintObtainRoute`, key: `ROUTES`, idKey: `Family` }, { type: `PinataFeatures`, key: `PINATAS` }, { type: `StoreCommodityFeatures`, key: null, extraKeys: [{ key: `Plants`, idKey: `CommodityName`, typeFilter: { field: `CommodityType`, value: `plant` } }, { key: `Upgrade`, idKey: `CommodityName`, typeFilter: { field: `CommodityType`, value: `upgrade` } }, { key: `Gem` }, { key: `Coin` }, { key: `Zen` }] }, { type: `WorldmapFeatures`, key: `WORLDMAPS` }], S = [{ type: `PlantAlmanac` }, { type: `PlantProps` }, { type: `PlantTypes` }, { type: `ZombieAlmanac` }, { type: `ZombieProps` }, { type: `ZombieTypes` }, { type: `BoardGridMaps` }, { type: `_GridItemProps`, deprecated: true }, { type: `GridItemTypes`, deprecated: true }, { type: `ProjectileProps` }, { type: `ProjectileTypes` }, { type: `TileProps` }, { type: `TileLiquidProps` }, { type: `TombstoneProps` }, { type: `ArmorProps` }, { type: `ArmorTypes` }, { type: `LawnProps` }, { type: `DinosaurTypes` }, { type: `DinosaurProps` }, { type: `RectangleProps` }, { type: `PortalTypes` }, { type: `PortalProps` }, { type: `PropertySheets` }, { type: `NarrativeList` }, { type: `LevelModules` }], re = [...x.map((e2) => e2.type), ...S.filter((e2) => !e2.deprecated).map((e2) => e2.type)];
function C(e2, t2) {
  if (!t2) return [];
  if (e2.key) {
    let n3 = e2.idKey || `CODENAME`;
    return (t2[e2.key] || []).map((e3) => ({ id: e3[n3] === void 0 ? `?` : String(e3[n3]), label: e3[n3] === void 0 ? `?` : String(e3[n3]), name: e3.NAME }));
  }
  let n2 = [];
  for (let r2 of e2.extraKeys || []) if (!(!r2.idKey || !t2[r2.key])) for (let e3 of t2[r2.key]) n2.push({ id: e3[r2.idKey] === void 0 ? `?` : String(e3[r2.idKey]), label: e3[r2.idKey] === void 0 ? `?` : String(e3[r2.idKey]), name: e3.NAME });
  return n2;
}
function w(e2, t2, n2) {
  if (!t2) return null;
  if (e2.key) {
    let r2 = e2.idKey || `CODENAME`, i2 = (t2[e2.key] || []).find((e3) => String(e3[r2]) === n2);
    return i2 ? { entry: i2, section: e2.key, idKey: r2 } : null;
  }
  for (let r2 of e2.extraKeys || []) {
    if (!r2.idKey || !t2[r2.key]) continue;
    let e3 = t2[r2.key].find((e4) => String(e4[r2.idKey]) === n2);
    if (e3) return { entry: e3, section: r2.key, idKey: r2.idKey };
  }
  return null;
}
var ie = n(((e2, t2) => {
  (function(n2, r2) {
    typeof e2 == `object` && t2 !== void 0 ? t2.exports = r2() : typeof define == `function` && define.amd ? define(r2) : n2.JSON5 = r2();
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
    }, ee2 = 0, te2 = Math.random(), v2 = function(e4) {
      return `Symbol(${e4 === void 0 ? `` : e4})_${(++ee2 + te2).toString(36)}`;
    }, y2 = false, b2 = e3(function(e4) {
      var r3 = `__core-js_shared__`, i3 = t3[r3] || (t3[r3] = {});
      (e4.exports = function(e5, t4) {
        return i3[e5] || (i3[e5] = t4 === void 0 ? {} : t4);
      })(`versions`, []).push({ version: n2.version, mode: y2 ? `pure` : `global`, copyright: `\xA9 2019 Denis Pushkarev (zloirock.ru)` });
    })(`native-function-to-string`, Function.toString), ne2 = e3(function(e4) {
      var r3 = v2(`src`), i3 = `toString`, a3 = (`` + b2).split(i3);
      n2.inspectSource = function(e5) {
        return b2.call(e5);
      }, (e4.exports = function(e5, n3, i4, o3) {
        var s3 = typeof i4 == `function`;
        s3 && (_2(i4, `name`) || h2(i4, `name`, n3)), e5[n3] !== i4 && (s3 && (_2(i4, r3) || h2(i4, r3, e5[n3] ? `` + e5[n3] : a3.join(String(n3)))), e5 === t3 ? e5[n3] = i4 : o3 ? e5[n3] ? e5[n3] = i4 : h2(e5, n3, i4) : (delete e5[n3], h2(e5, n3, i4)));
      })(Function.prototype, i3, function() {
        return typeof this == `function` && this[r3] || b2.call(this);
      });
    }), x2 = function(e4) {
      if (typeof e4 != `function`) throw TypeError(e4 + ` is not a function!`);
      return e4;
    }, S2 = function(e4, t4, n3) {
      if (x2(e4), t4 === void 0) return e4;
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
    }, re2 = `prototype`, C2 = function(e4, r3, i3) {
      var a3 = e4 & C2.F, o3 = e4 & C2.G, s3 = e4 & C2.S, c3 = e4 & C2.P, l3 = e4 & C2.B, u3 = o3 ? t3 : s3 ? t3[r3] || (t3[r3] = {}) : (t3[r3] || {})[re2], d3 = o3 ? n2 : n2[r3] || (n2[r3] = {}), f3 = d3[re2] || (d3[re2] = {}), p3, m3, g3, _3;
      for (p3 in o3 && (i3 = r3), i3) m3 = !a3 && u3 && u3[p3] !== void 0, g3 = (m3 ? u3 : i3)[p3], _3 = l3 && m3 ? S2(g3, t3) : c3 && typeof g3 == `function` ? S2(Function.call, g3) : g3, u3 && ne2(u3, p3, g3, e4 & C2.U), d3[p3] != g3 && h2(d3, p3, _3), c3 && f3[p3] != g3 && (f3[p3] = g3);
    };
    t3.core = n2, C2.F = 1, C2.G = 2, C2.S = 4, C2.P = 8, C2.B = 16, C2.W = 32, C2.U = 64, C2.R = 128;
    var w2 = C2, ie2 = Math.ceil, ae2 = Math.floor, T2 = function(e4) {
      return isNaN(e4 = +e4) ? 0 : (e4 > 0 ? ae2 : ie2)(e4);
    }, E2 = function(e4) {
      if (e4 == null) throw TypeError(`Can't call method on  ` + e4);
      return e4;
    }, oe2 = /* @__PURE__ */ (function(e4) {
      return function(t4, n3) {
        var r3 = String(E2(t4)), i3 = T2(n3), a3 = r3.length, o3, s3;
        return i3 < 0 || i3 >= a3 ? e4 ? `` : void 0 : (o3 = r3.charCodeAt(i3), o3 < 55296 || o3 > 56319 || i3 + 1 === a3 || (s3 = r3.charCodeAt(i3 + 1)) < 56320 || s3 > 57343 ? e4 ? r3.charAt(i3) : o3 : e4 ? r3.slice(i3, i3 + 2) : (o3 - 55296 << 10) + (s3 - 56320) + 65536);
      };
    })(false);
    w2(w2.P, `String`, { codePointAt: function(e4) {
      return oe2(this, e4);
    } }), n2.String.codePointAt;
    var D2 = Math.max, O2 = Math.min, se2 = function(e4, t4) {
      return e4 = T2(e4), e4 < 0 ? D2(e4 + t4, 0) : O2(e4, t4);
    }, k2 = String.fromCharCode, ce2 = String.fromCodePoint;
    w2(w2.S + w2.F * (!!ce2 && ce2.length != 1), `String`, { fromCodePoint: function(e4) {
      for (var t4 = arguments, n3 = [], r3 = arguments.length, i3 = 0, a3; r3 > i3; ) {
        if (a3 = +t4[i3++], se2(a3, 1114111) !== a3) throw RangeError(a3 + ` is not a valid code point`);
        n3.push(a3 < 65536 ? k2(a3) : k2(((a3 -= 65536) >> 10) + 55296, a3 % 1024 + 56320));
      }
      return n3.join(``);
    } }), n2.String.fromCodePoint;
    var A2 = { Space_Separator: /[\u1680\u2000-\u200A\u202F\u205F\u3000]/, ID_Start: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDF00-\uDF19]|\uD806[\uDCA0-\uDCDF\uDCFF\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE83\uDE86-\uDE89\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]/, ID_Continue: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08BD\u08D4-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1CD0-\u1CD2\u1CD4-\u1CF9\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312E\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FEA\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7AE\uA7B0-\uA7B7\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB65\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDCA-\uDDCC\uDDD0-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9\uDF00-\uDF19\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDCA0-\uDCE9\uDCFF\uDE00-\uDE3E\uDE47\uDE50-\uDE83\uDE86-\uDE99\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F\uDFE0\uDFE1]|\uD821[\uDC00-\uDFEC]|\uD822[\uDC00-\uDEF2]|\uD82C[\uDC00-\uDD1E\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4A\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/ }, j2 = { isSpaceSeparator: function(e4) {
      return typeof e4 == `string` && A2.Space_Separator.test(e4);
    }, isIdStartChar: function(e4) {
      return typeof e4 == `string` && (e4 >= `a` && e4 <= `z` || e4 >= `A` && e4 <= `Z` || e4 === `$` || e4 === `_` || A2.ID_Start.test(e4));
    }, isIdContinueChar: function(e4) {
      return typeof e4 == `string` && (e4 >= `a` && e4 <= `z` || e4 >= `A` && e4 <= `Z` || e4 >= `0` && e4 <= `9` || e4 === `$` || e4 === `_` || e4 === `\u200C` || e4 === `\u200D` || A2.ID_Continue.test(e4));
    }, isDigit: function(e4) {
      return typeof e4 == `string` && /[0-9]/.test(e4);
    }, isHexDigit: function(e4) {
      return typeof e4 == `string` && /[0-9A-Fa-f]/.test(e4);
    } }, M2, N2, P2, le2, F2, I2, L2, R2, z2, ue2 = function(e4, t4) {
      M2 = String(e4), N2 = `start`, P2 = [], le2 = 0, F2 = 1, I2 = 0, L2 = void 0, R2 = void 0, z2 = void 0;
      do
        L2 = de2(), he2[N2]();
      while (L2.type !== `eof`);
      return typeof t4 == `function` ? B2({ "": z2 }, ``, t4) : z2;
    };
    function B2(e4, t4, n3) {
      var r3 = e4[t4];
      if (typeof r3 == `object` && r3) if (Array.isArray(r3)) for (var i3 = 0; i3 < r3.length; i3++) {
        var a3 = String(i3), o3 = B2(r3, a3, n3);
        o3 === void 0 ? delete r3[a3] : Object.defineProperty(r3, a3, { value: o3, writable: true, enumerable: true, configurable: true });
      }
      else for (var s3 in r3) {
        var c3 = B2(r3, s3, n3);
        c3 === void 0 ? delete r3[s3] : Object.defineProperty(r3, s3, { value: c3, writable: true, enumerable: true, configurable: true });
      }
      return n3.call(e4, t4, r3);
    }
    var V2, H2, U2, W2, G2;
    function de2() {
      for (V2 = `default`, H2 = ``, U2 = false, W2 = 1; ; ) {
        G2 = K2();
        var e4 = J2[V2]();
        if (e4) return e4;
      }
    }
    function K2() {
      if (M2[le2]) return String.fromCodePoint(M2.codePointAt(le2));
    }
    function q2() {
      var e4 = K2();
      return e4 === `
` ? (F2++, I2 = 0) : e4 ? I2 += e4.length : I2++, e4 && (le2 += e4.length), e4;
    }
    var J2 = { default: function() {
      switch (G2) {
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
          q2();
          return;
        case `/`:
          q2(), V2 = `comment`;
          return;
        case void 0:
          return q2(), Y2(`eof`);
      }
      if (j2.isSpaceSeparator(G2)) {
        q2();
        return;
      }
      return J2[N2]();
    }, comment: function() {
      switch (G2) {
        case `*`:
          q2(), V2 = `multiLineComment`;
          return;
        case `/`:
          q2(), V2 = `singleLineComment`;
          return;
      }
      throw Q2(q2());
    }, multiLineComment: function() {
      switch (G2) {
        case `*`:
          q2(), V2 = `multiLineCommentAsterisk`;
          return;
        case void 0:
          throw Q2(q2());
      }
      q2();
    }, multiLineCommentAsterisk: function() {
      switch (G2) {
        case `*`:
          q2();
          return;
        case `/`:
          q2(), V2 = `default`;
          return;
        case void 0:
          throw Q2(q2());
      }
      q2(), V2 = `multiLineComment`;
    }, singleLineComment: function() {
      switch (G2) {
        case `
`:
        case `\r`:
        case `\u2028`:
        case `\u2029`:
          q2(), V2 = `default`;
          return;
        case void 0:
          return q2(), Y2(`eof`);
      }
      q2();
    }, value: function() {
      switch (G2) {
        case `{`:
        case `[`:
          return Y2(`punctuator`, q2());
        case `n`:
          return q2(), X2(`ull`), Y2(`null`, null);
        case `t`:
          return q2(), X2(`rue`), Y2(`boolean`, true);
        case `f`:
          return q2(), X2(`alse`), Y2(`boolean`, false);
        case `-`:
        case `+`:
          q2() === `-` && (W2 = -1), V2 = `sign`;
          return;
        case `.`:
          H2 = q2(), V2 = `decimalPointLeading`;
          return;
        case `0`:
          H2 = q2(), V2 = `zero`;
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
          H2 = q2(), V2 = `decimalInteger`;
          return;
        case `I`:
          return q2(), X2(`nfinity`), Y2(`numeric`, 1 / 0);
        case `N`:
          return q2(), X2(`aN`), Y2(`numeric`, NaN);
        case `"`:
        case `'`:
          U2 = q2() === `"`, H2 = ``, V2 = `string`;
          return;
      }
      throw Q2(q2());
    }, identifierNameStartEscape: function() {
      if (G2 !== `u`) throw Q2(q2());
      q2();
      var e4 = me2();
      switch (e4) {
        case `$`:
        case `_`:
          break;
        default:
          if (!j2.isIdStartChar(e4)) throw _e2();
          break;
      }
      H2 += e4, V2 = `identifierName`;
    }, identifierName: function() {
      switch (G2) {
        case `$`:
        case `_`:
        case `\u200C`:
        case `\u200D`:
          H2 += q2();
          return;
        case `\\`:
          q2(), V2 = `identifierNameEscape`;
          return;
      }
      if (j2.isIdContinueChar(G2)) {
        H2 += q2();
        return;
      }
      return Y2(`identifier`, H2);
    }, identifierNameEscape: function() {
      if (G2 !== `u`) throw Q2(q2());
      q2();
      var e4 = me2();
      switch (e4) {
        case `$`:
        case `_`:
        case `\u200C`:
        case `\u200D`:
          break;
        default:
          if (!j2.isIdContinueChar(e4)) throw _e2();
          break;
      }
      H2 += e4, V2 = `identifierName`;
    }, sign: function() {
      switch (G2) {
        case `.`:
          H2 = q2(), V2 = `decimalPointLeading`;
          return;
        case `0`:
          H2 = q2(), V2 = `zero`;
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
          H2 = q2(), V2 = `decimalInteger`;
          return;
        case `I`:
          return q2(), X2(`nfinity`), Y2(`numeric`, W2 * (1 / 0));
        case `N`:
          return q2(), X2(`aN`), Y2(`numeric`, NaN);
      }
      throw Q2(q2());
    }, zero: function() {
      switch (G2) {
        case `.`:
          H2 += q2(), V2 = `decimalPoint`;
          return;
        case `e`:
        case `E`:
          H2 += q2(), V2 = `decimalExponent`;
          return;
        case `x`:
        case `X`:
          H2 += q2(), V2 = `hexadecimal`;
          return;
      }
      return Y2(`numeric`, W2 * 0);
    }, decimalInteger: function() {
      switch (G2) {
        case `.`:
          H2 += q2(), V2 = `decimalPoint`;
          return;
        case `e`:
        case `E`:
          H2 += q2(), V2 = `decimalExponent`;
          return;
      }
      if (j2.isDigit(G2)) {
        H2 += q2();
        return;
      }
      return Y2(`numeric`, W2 * Number(H2));
    }, decimalPointLeading: function() {
      if (j2.isDigit(G2)) {
        H2 += q2(), V2 = `decimalFraction`;
        return;
      }
      throw Q2(q2());
    }, decimalPoint: function() {
      switch (G2) {
        case `e`:
        case `E`:
          H2 += q2(), V2 = `decimalExponent`;
          return;
      }
      if (j2.isDigit(G2)) {
        H2 += q2(), V2 = `decimalFraction`;
        return;
      }
      return Y2(`numeric`, W2 * Number(H2));
    }, decimalFraction: function() {
      switch (G2) {
        case `e`:
        case `E`:
          H2 += q2(), V2 = `decimalExponent`;
          return;
      }
      if (j2.isDigit(G2)) {
        H2 += q2();
        return;
      }
      return Y2(`numeric`, W2 * Number(H2));
    }, decimalExponent: function() {
      switch (G2) {
        case `+`:
        case `-`:
          H2 += q2(), V2 = `decimalExponentSign`;
          return;
      }
      if (j2.isDigit(G2)) {
        H2 += q2(), V2 = `decimalExponentInteger`;
        return;
      }
      throw Q2(q2());
    }, decimalExponentSign: function() {
      if (j2.isDigit(G2)) {
        H2 += q2(), V2 = `decimalExponentInteger`;
        return;
      }
      throw Q2(q2());
    }, decimalExponentInteger: function() {
      if (j2.isDigit(G2)) {
        H2 += q2();
        return;
      }
      return Y2(`numeric`, W2 * Number(H2));
    }, hexadecimal: function() {
      if (j2.isHexDigit(G2)) {
        H2 += q2(), V2 = `hexadecimalInteger`;
        return;
      }
      throw Q2(q2());
    }, hexadecimalInteger: function() {
      if (j2.isHexDigit(G2)) {
        H2 += q2();
        return;
      }
      return Y2(`numeric`, W2 * Number(H2));
    }, string: function() {
      switch (G2) {
        case `\\`:
          q2(), H2 += fe2();
          return;
        case `"`:
          if (U2) return q2(), Y2(`string`, H2);
          H2 += q2();
          return;
        case `'`:
          if (!U2) return q2(), Y2(`string`, H2);
          H2 += q2();
          return;
        case `
`:
        case `\r`:
          throw Q2(q2());
        case `\u2028`:
        case `\u2029`:
          ve2(G2);
          break;
        case void 0:
          throw Q2(q2());
      }
      H2 += q2();
    }, start: function() {
      switch (G2) {
        case `{`:
        case `[`:
          return Y2(`punctuator`, q2());
      }
      V2 = `value`;
    }, beforePropertyName: function() {
      switch (G2) {
        case `$`:
        case `_`:
          H2 = q2(), V2 = `identifierName`;
          return;
        case `\\`:
          q2(), V2 = `identifierNameStartEscape`;
          return;
        case `}`:
          return Y2(`punctuator`, q2());
        case `"`:
        case `'`:
          U2 = q2() === `"`, V2 = `string`;
          return;
      }
      if (j2.isIdStartChar(G2)) {
        H2 += q2(), V2 = `identifierName`;
        return;
      }
      throw Q2(q2());
    }, afterPropertyName: function() {
      if (G2 === `:`) return Y2(`punctuator`, q2());
      throw Q2(q2());
    }, beforePropertyValue: function() {
      V2 = `value`;
    }, afterPropertyValue: function() {
      switch (G2) {
        case `,`:
        case `}`:
          return Y2(`punctuator`, q2());
      }
      throw Q2(q2());
    }, beforeArrayValue: function() {
      if (G2 === `]`) return Y2(`punctuator`, q2());
      V2 = `value`;
    }, afterArrayValue: function() {
      switch (G2) {
        case `,`:
        case `]`:
          return Y2(`punctuator`, q2());
      }
      throw Q2(q2());
    }, end: function() {
      throw Q2(q2());
    } };
    function Y2(e4, t4) {
      return { type: e4, value: t4, line: F2, column: I2 };
    }
    function X2(e4) {
      for (var t4 = 0, n3 = e4; t4 < n3.length; t4 += 1) {
        var r3 = n3[t4];
        if (K2() !== r3) throw Q2(q2());
        q2();
      }
    }
    function fe2() {
      switch (K2()) {
        case `b`:
          return q2(), `\b`;
        case `f`:
          return q2(), `\f`;
        case `n`:
          return q2(), `
`;
        case `r`:
          return q2(), `\r`;
        case `t`:
          return q2(), `	`;
        case `v`:
          return q2(), `\v`;
        case `0`:
          if (q2(), j2.isDigit(K2())) throw Q2(q2());
          return `\0`;
        case `x`:
          return q2(), pe2();
        case `u`:
          return q2(), me2();
        case `
`:
        case `\u2028`:
        case `\u2029`:
          return q2(), ``;
        case `\r`:
          return q2(), K2() === `
` && q2(), ``;
        case `1`:
        case `2`:
        case `3`:
        case `4`:
        case `5`:
        case `6`:
        case `7`:
        case `8`:
        case `9`:
          throw Q2(q2());
        case void 0:
          throw Q2(q2());
      }
      return q2();
    }
    function pe2() {
      var e4 = ``, t4 = K2();
      if (!j2.isHexDigit(t4) || (e4 += q2(), t4 = K2(), !j2.isHexDigit(t4))) throw Q2(q2());
      return e4 += q2(), String.fromCodePoint(parseInt(e4, 16));
    }
    function me2() {
      for (var e4 = ``, t4 = 4; t4-- > 0; ) {
        var n3 = K2();
        if (!j2.isHexDigit(n3)) throw Q2(q2());
        e4 += q2();
      }
      return String.fromCodePoint(parseInt(e4, 16));
    }
    var he2 = { start: function() {
      if (L2.type === `eof`) throw $2();
      ge2();
    }, beforePropertyName: function() {
      switch (L2.type) {
        case `identifier`:
        case `string`:
          R2 = L2.value, N2 = `afterPropertyName`;
          return;
        case `punctuator`:
          Z2();
          return;
        case `eof`:
          throw $2();
      }
    }, afterPropertyName: function() {
      if (L2.type === `eof`) throw $2();
      N2 = `beforePropertyValue`;
    }, beforePropertyValue: function() {
      if (L2.type === `eof`) throw $2();
      ge2();
    }, beforeArrayValue: function() {
      if (L2.type === `eof`) throw $2();
      if (L2.type === `punctuator` && L2.value === `]`) {
        Z2();
        return;
      }
      ge2();
    }, afterPropertyValue: function() {
      if (L2.type === `eof`) throw $2();
      switch (L2.value) {
        case `,`:
          N2 = `beforePropertyName`;
          return;
        case `}`:
          Z2();
      }
    }, afterArrayValue: function() {
      if (L2.type === `eof`) throw $2();
      switch (L2.value) {
        case `,`:
          N2 = `beforeArrayValue`;
          return;
        case `]`:
          Z2();
      }
    }, end: function() {
    } };
    function ge2() {
      var e4;
      switch (L2.type) {
        case `punctuator`:
          switch (L2.value) {
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
          e4 = L2.value;
          break;
      }
      if (z2 === void 0) z2 = e4;
      else {
        var t4 = P2[P2.length - 1];
        Array.isArray(t4) ? t4.push(e4) : Object.defineProperty(t4, R2, { value: e4, writable: true, enumerable: true, configurable: true });
      }
      if (typeof e4 == `object` && e4) P2.push(e4), N2 = Array.isArray(e4) ? `beforeArrayValue` : `beforePropertyName`;
      else {
        var n3 = P2[P2.length - 1];
        N2 = n3 == null ? `end` : Array.isArray(n3) ? `afterArrayValue` : `afterPropertyValue`;
      }
    }
    function Z2() {
      P2.pop();
      var e4 = P2[P2.length - 1];
      N2 = e4 == null ? `end` : Array.isArray(e4) ? `afterArrayValue` : `afterPropertyValue`;
    }
    function Q2(e4) {
      return be2(e4 === void 0 ? `JSON5: invalid end of input at ` + F2 + `:` + I2 : `JSON5: invalid character '` + ye2(e4) + `' at ` + F2 + `:` + I2);
    }
    function $2() {
      return be2(`JSON5: invalid end of input at ` + F2 + `:` + I2);
    }
    function _e2() {
      return I2 -= 5, be2(`JSON5: invalid identifier character at ` + F2 + `:` + I2);
    }
    function ve2(e4) {
      console.warn(`JSON5: '` + ye2(e4) + `' in strings is not valid ECMAScript; consider escaping`);
    }
    function ye2(e4) {
      var t4 = { "'": `\\'`, '"': `\\"`, "\\": `\\\\`, "\b": `\\b`, "\f": `\\f`, "\n": `\\n`, "\r": `\\r`, "	": `\\t`, "\v": `\\v`, "\0": `\\0`, "\u2028": `\\u2028`, "\u2029": `\\u2029` };
      if (t4[e4]) return t4[e4];
      if (e4 < ` `) {
        var n3 = e4.charCodeAt(0).toString(16);
        return `\\x` + (`00` + n3).substring(n3.length);
      }
      return e4;
    }
    function be2(e4) {
      var t4 = SyntaxError(e4);
      return t4.lineNumber = F2, t4.columnNumber = I2, t4;
    }
    return { parse: ue2, stringify: function(e4, t4, n3) {
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
              if (j2.isDigit(e5[i4 + 1])) {
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
        if (!j2.isIdStartChar(t5)) return m3(e5, true);
        for (var n4 = t5.length; n4 < e5.length; n4++) if (!j2.isIdContinueChar(String.fromCodePoint(e5.codePointAt(n4)))) return m3(e5, true);
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
})), ae = e({ bindDiscoveredPackSnapshot: () => G, bindPackSnapshot: () => H, capturePackSnapshotFrom: () => De, clearAllGpnEdits: () => Le, clearCache: () => $, createCandidateReader: () => ze, createZipContentMap: () => I, discoverPacks: () => ve, getBasePath: () => getBasePath, getPackSnapshotFrom: () => U, listDirFrom: () => ke, loadFeaturePatchesFrom: () => be, loadJsonPatchingConfigFrom: () => ye, loadLangPatchFrom: () => Se, loadLevelPatchesFrom: () => we, loadObjectsPatchesFrom: () => xe, loadPlantLevelConfigFrom: () => Ce, loadSettings: () => Me, pathExistsFrom: () => Ae, prepareDataPack: () => Re, readBytesFrom: () => Ee, readJsonFrom: () => Oe, readTextFrom: () => Te, removeGpnEdit: () => Ie, saveGpnEdit: () => Fe, saveSettings: () => saveSettings }), T = t(ie(), 1), E = new r(`file-loader`), oe = /* @__PURE__ */ new Set([`merge`, `replace`]);
function D(e2) {
  return normalizeFilePath(e2);
}
function O(e2) {
  return String(e2 || ``).replace(/\//g, `\\`);
}
async function se(e2) {
  return i(D(e2), { baseDir: v });
}
async function k(e2) {
  return l(D(e2), { baseDir: v });
}
async function ce(e2) {
  return s(D(e2), { baseDir: v });
}
async function A(e2, t2) {
  return p(D(e2), t2, { baseDir: v });
}
async function j(e2) {
  return f(D(e2), { baseDir: v });
}
async function M(e2, t2 = true) {
  return u(D(e2), { baseDir: v, recursive: t2 });
}
async function N(e2, t2 = true) {
  return d(D(e2), { baseDir: v, recursive: t2 });
}
function P(e2) {
  let t2 = ``, n2 = 8192;
  for (let r2 = 0; r2 < e2.length; r2 += n2) t2 += String.fromCharCode(...e2.subarray(r2, r2 + n2));
  return btoa(t2);
}
var le = new TextDecoder(`utf-8`, { fatal: true });
function F(e2) {
  try {
    return le.decode(e2);
  } catch {
    return null;
  }
}
function I(e2, t2 = ``) {
  let n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Map(), i2 = 0;
  for (let [a2, o2] of Object.entries(e2 || {})) {
    if (a2.endsWith(`/`)) continue;
    if (t2 && !a2.startsWith(t2)) throw Error(`ZIP entry outside package root`);
    let e3 = h(t2 ? a2.slice(t2.length) : a2).replace(/\//g, `\\`);
    if (n2.has(e3)) throw Error(`Duplicate ZIP path: ` + e3);
    r2.set(e3, o2.slice());
    let s2 = F(o2);
    n2.set(e3, s2), s2 !== null && (i2 += 1);
  }
  return { contentMap: n2, byteMap: r2, textCount: i2 };
}
var L = /* @__PURE__ */ new Map(), R = /* @__PURE__ */ new Map(), z = /* @__PURE__ */ new Map(), ue = /* @__PURE__ */ new WeakMap(), B = 0;
function V(e2) {
  let t2 = D(e2);
  for (let [e3, { snapshot: n2 }] of z) {
    if (t2 === e3) return { snapshot: n2, relative: `` };
    if (t2.startsWith(e3 + `/`)) return { snapshot: n2, relative: t2.slice(e3.length + 1) };
  }
  return null;
}
function H(e2, t2) {
  z.set(h(e2), { snapshot: t2 });
}
function U(e2) {
  return z.get(h(e2))?.snapshot ?? null;
}
function W(e2) {
  let { thumbnailUrl: t2, ...n2 } = e2;
  return JSON.stringify(n2);
}
async function G(e2, t2) {
  let n2 = ue.get(e2), r2 = B;
  if (!n2 || n2.generation !== r2 || n2.dir !== e2.dir || n2.meta !== e2.meta || n2.signature !== W(e2.meta)) throw Error(`Package discovery changed or is unavailable; discover the package again`);
  if (t2.readText(`pack.json`) !== n2.manifest) throw Error(`Package manifest changed after discovery`);
  let i2 = h(e2.dir), a2 = z.get(i2);
  H(i2, t2);
  let o2 = z.get(i2);
  try {
    let t3 = await Q(n2.manifest ? T.default.parse(n2.manifest) : null, n2.fallbackName, e2.dir);
    if (B !== r2 || z.get(i2) !== o2) throw Error(`Package snapshot binding changed during validation; discover the package again`);
    if (W(t3) !== n2.signature) throw Error(`Package content metadata changed after discovery`);
    if (e2.dir !== n2.dir || e2.meta !== n2.meta || W(e2.meta) !== n2.signature) throw Error(`Package discovery changed during snapshot binding`);
  } catch (e3) {
    throw B === r2 && z.get(i2) === o2 && (a2 ? z.set(i2, a2) : z.delete(i2)), e3;
  }
}
function de(e2, t2, n2, r2) {
  return ue.set(e2, { dir: e2.dir, meta: e2.meta, signature: W(e2.meta), manifest: t2 ?? null, fallbackName: n2, generation: r2 }), e2;
}
async function K(e2) {
  try {
    let t2 = m(await se(e2)), n2 = Object.keys(t2).filter((e3) => !e3.endsWith(`/`)), r2 = n2.some((e3) => !e3.includes(`/`)), i2 = ``;
    if (!r2 && n2.length > 0) {
      let e3 = n2.map((e4) => e4.split(`/`)[0]);
      e3.every((t3) => t3 === e3[0]) && (i2 = e3[0] + `/`);
    }
    let { contentMap: a2, byteMap: o2, textCount: s2 } = I(t2, i2), c2 = O(e2);
    return L.set(c2, a2), R.set(c2, o2), E.info(`Loaded ZIP: ${c2} (${s2} text file(s), ${a2.size} indexed file(s))`), a2;
  } catch (t2) {
    return E.error(`Failed to load ZIP ${e2}: ${t2}`), null;
  }
}
function q(e2, t2) {
  let n2 = T.default.parse(e2);
  if (t2 && (!n2 || typeof n2 != `object` || Array.isArray(n2))) throw Error(`Expected object root`);
  return n2;
}
async function J(e2, t2 = false) {
  let n2 = V(e2);
  if (n2) {
    let e3 = n2.snapshot.readText(n2.relative);
    return e3 === null ? null : q(e3, t2);
  }
  let r2 = O(e2);
  for (let [n3, i3] of L) {
    let a2 = n3 + `\\`;
    if (r2.startsWith(a2)) {
      let n4 = r2.slice(a2.length), o2 = i3.get(n4);
      if (typeof o2 != `string`) return null;
      try {
        return q(o2, t2);
      } catch (t3) {
        throw E.error(`Failed to parse ${e2}: ${t3}`), Error(`ParseError: ${e2}`);
      }
    }
  }
  let i2;
  try {
    i2 = await k(e2);
  } catch {
    return null;
  }
  try {
    return q(i2, t2);
  } catch (t3) {
    throw E.error(`Failed to parse ${e2}: ${t3}`), Error(`ParseError: ${e2}`);
  }
}
async function Y(e2) {
  let t2 = V(e2);
  if (t2) {
    let e3 = t2.relative ? t2.relative + `/` : ``, n3 = /* @__PURE__ */ new Map();
    for (let r2 of t2.snapshot.listPaths()) {
      if (!r2.startsWith(e3)) continue;
      let t3 = r2.slice(e3.length), i2 = t3.split(`/`)[0], a2 = !t3.includes(`/`);
      n3.set(i2, { name: i2, isFile: a2, isDirectory: !a2 });
    }
    return [...n3.values()];
  }
  let n2 = O(e2);
  for (let [e3, t3] of L) {
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
    return await ce(e2);
  } catch {
    return [];
  }
}
async function X(e2) {
  let t2 = V(e2);
  if (t2) return t2.snapshot.readText(t2.relative);
  let n2 = O(e2);
  for (let [e3, t3] of L) {
    let r2 = e3 + `\\`;
    if (!n2.startsWith(r2)) continue;
    let i2 = n2.slice(r2.length);
    return t3.has(i2) ? t3.get(i2) : null;
  }
  try {
    return await k(e2);
  } catch {
    return null;
  }
}
async function fe(e2) {
  let t2 = V(e2);
  if (t2) return !t2.relative || t2.snapshot.listPaths().some((e3) => e3 === t2.relative || e3.startsWith(t2.relative + `/`));
  let n2 = O(e2);
  for (let [e3, t3] of L) {
    let r2 = e3 + `\\`;
    if (!n2.startsWith(r2)) continue;
    let i2 = n2.slice(r2.length);
    if (t3.has(i2)) return true;
    let a2 = i2 ? i2 + `\\` : ``;
    for (let e4 of t3.keys()) if (e4.startsWith(a2)) return true;
    return false;
  }
  try {
    return await j(e2);
  } catch {
    return false;
  }
}
function pe(e2, t2, n2) {
  let r2 = String(e2 || ``).trim().toLowerCase();
  return r2 ? oe.has(r2) ? r2 : (n2?.push(`${t2}: invalid mode "${e2}"`), null) : null;
}
function me(e2, t2, n2, r2) {
  let i2 = {};
  if (!e2 || typeof e2 != `object` || Array.isArray(e2)) return i2;
  let a2 = new Set(t2);
  for (let [t3, o2] of Object.entries(e2)) {
    if (!a2.has(t3)) {
      r2?.push(`${n2}.${t3}: unknown type`);
      continue;
    }
    if (!o2 || typeof o2 != `object` || Array.isArray(o2)) {
      r2?.push(`${n2}.${t3}: expected object`);
      continue;
    }
    let e3 = pe(o2.mode, `${n2}.${t3}.mode`, r2);
    e3 && (i2[t3] = { mode: e3 });
  }
  return i2;
}
async function he(e2) {
  let t2 = await Y(e2);
  return Array.isArray(t2) && t2.length > 0;
}
function ge(e2) {
  let t2 = Array.isArray(e2) ? e2 : [], n2 = [], r2 = /* @__PURE__ */ new Set();
  for (let e3 of t2) {
    let t3 = String(e3 || ``).trim().toLowerCase();
    !t3 || r2.has(t3) || (r2.add(t3), n2.push(t3));
  }
  return n2;
}
function Z(e2) {
  let t2 = [], n2 = /* @__PURE__ */ new Set();
  if (!Array.isArray(e2)) return t2;
  for (let r2 of e2) {
    let e3 = String(r2 || ``).trim();
    !e3 || n2.has(e3) || (n2.add(e3), t2.push(e3));
  }
  return t2;
}
async function Q(e2, t2, n2, r2 = null) {
  let i2 = r2?.pathExists || fe, a2 = r2 ? async (e3) => (await r2.listDir(e3)).length > 0 : he, o2 = { packFormatVersion: 1, uuid: ``, name: t2, version: `1.0.0`, priority: 100, description: ``, author: ``, thumbnailUrl: ``, gameVersion: ``, minGpNextVersion: ``, maxGpNextVersion: ``, apiVersion: 0, featureFlags: [], requiredGpNextFeatures: [], capabilities: [], js: null, depends: [], optionalDepends: [] };
  e2 && typeof e2 == `object` && Object.assign(o2, e2), o2.validationErrors = [], e2 && Object.hasOwn(e2, `packFormatVersion`) && (![`number`, `string`].includes(typeof e2.packFormatVersion) || !Number.isInteger(Number(e2.packFormatVersion)) || Number(e2.packFormatVersion) < 1) && o2.validationErrors.push(`packFormatVersion must be a positive integer`);
  for (let t3 of [`requiredGpNextFeatures`, `depends`, `optionalDepends`]) e2 && Object.hasOwn(e2, t3) && (!Array.isArray(e2[t3]) || e2[t3].some((e3) => typeof e3 != `string` || !e3.trim())) && o2.validationErrors.push(`${t3} must be an array of non-empty strings`);
  for (let t3 of [`minGpNextVersion`, `maxGpNextVersion`]) e2 && Object.hasOwn(e2, t3) && typeof e2[t3] != `string` && o2.validationErrors.push(`${t3} must be a version string`);
  e2?.js != null && (typeof e2.js != `object` || Array.isArray(e2.js) ? o2.validationErrors.push(`js must be an object`) : Object.hasOwn(e2.js, `entry`) && (typeof e2.js.entry != `string` || !e2.js.entry.trim()) && o2.validationErrors.push(`js.entry must be a non-empty relative script path`)), e2?.js && Object.hasOwn(e2.js, `startup`) && typeof e2.js.startup != `boolean` && o2.validationErrors.push(`js.startup must be a boolean`), o2.packFormatVersion = Number.isFinite(Number(o2.packFormatVersion)) ? Number(o2.packFormatVersion) : 1, o2.name = String(o2.name || t2 || `(unnamed)`), o2.version = String(o2.version || `1.0.0`), o2.priority = Number.isFinite(Number(o2.priority)) ? Number(o2.priority) : 100, o2.description = typeof o2.description == `string` ? o2.description : ``, o2.author = typeof o2.author == `string` ? o2.author : ``, o2.uuid = typeof o2.uuid == `string` ? o2.uuid : ``, o2.gameVersion = typeof o2.gameVersion == `string` ? o2.gameVersion : ``, o2.minGpNextVersion = typeof o2.minGpNextVersion == `string` ? o2.minGpNextVersion : ``, o2.maxGpNextVersion = typeof o2.maxGpNextVersion == `string` ? o2.maxGpNextVersion : ``, o2.apiVersion = Number.isFinite(Number(o2.apiVersion)) ? Number(o2.apiVersion) : 0, o2.featureFlags = Array.isArray(o2.featureFlags) ? o2.featureFlags.map((e3) => String(e3)) : [], o2.requiredGpNextFeatures = Z(o2.requiredGpNextFeatures), o2.depends = Z(o2.depends), o2.optionalDepends = Z(o2.optionalDepends);
  let s2 = ge(o2.capabilities), c2 = [];
  (await a2(`${n2}\\jsons\\features`) || await a2(`${n2}\\jsons\\objects`) || await a2(`${n2}\\jsons\\levels`) || await a2(`${n2}\\jsons\\gp-next`) || await a2(`${n2}\\jsons\\worldmap`)) && c2.push(`json`), (await i2(`${n2}\\jsons\\lang\\lang.json`) || await i2(`${n2}\\jsons\\lang\\lang.json5`)) && c2.push(`lang`);
  let l2 = o2.js && typeof o2.js == `object` ? { ...o2.js } : null, u2 = typeof l2?.entry == `string` && l2.entry.trim() ? l2.entry.trim() : await i2(`${n2}\\scripts\\main.js`) ? `scripts/main.js` : ``;
  !u2 && l2?.startup === true && o2.validationErrors.push(`js.startup requires a script entry`), u2 ? (o2.js = { entry: String(u2).replace(/\\/g, `/`), startup: l2?.startup === void 0 ? false : l2.startup, reloadable: l2?.reloadable !== false, requiresTrustedExecution: l2?.requiresTrustedExecution !== false, setupTimeoutMs: Number.isFinite(Number(l2?.setupTimeoutMs)) ? Number(l2.setupTimeoutMs) : void 0, importTimeoutMs: Number.isFinite(Number(l2?.importTimeoutMs)) ? Number(l2.importTimeoutMs) : void 0, cleanupTimeoutMs: Number.isFinite(Number(l2?.cleanupTimeoutMs)) ? Number(l2.cleanupTimeoutMs) : void 0, permissions: Z(l2?.permissions) }, c2.push(`js`)) : o2.js = null;
  let d2 = await i2(`${n2}\\assets\\manifest.json`) || await i2(`${n2}\\assets\\manifest.json5`), f2 = await a2(`${n2}\\assets`);
  return (d2 || f2) && c2.push(`asset`), o2.capabilities = ge([...s2, ...c2]), o2;
}
function $() {
  B++, L.clear(), R.clear(), z.clear(), E.debug(`ZIP content cache cleared`);
}
function _e(e2, t2) {
  return new Promise((n2) => {
    let r2 = new Image();
    r2.onload = () => n2(r2.width <= t2 && r2.height <= t2), r2.onerror = () => n2(false), r2.src = e2;
  });
}
async function ve(e2 = [], t2 = [], n2 = null) {
  let r2 = B;
  if (!n2) try {
    await M(y.ROOT), await M(y.PACKS_ROOT), await M(y.SINGLE_PATCHES);
  } catch (e3) {
    E.error(`Failed to create base directories: ${e3}`);
  }
  let i2 = await (n2?.listDir || Y)(y.PACKS_ROOT), a2 = [];
  for (let e3 of i2) {
    if (e3.isFile) {
      if (!e3.name.endsWith(`.zip`)) continue;
      let i4 = `${y.PACKS_ROOT}\\${e3.name}`, o3 = await (n2?.loadZip || K)(i4);
      if (!o3) continue;
      let s3 = null, c3 = o3.get(`pack.json`), l2 = false;
      if (c3) try {
        s3 = await Q(T.default.parse(c3), e3.name.replace(/\.zip$/, ``), i4, n2), l2 = true;
      } catch (t3) {
        E.error(`Pack ${e3.name} pack.json parse error: ${t3}`);
      }
      else E.error(`Pack ${e3.name} is missing pack.json`);
      s3 ||= await Q(null, e3.name.replace(/\.zip$/, ``), i4, n2), l2 && (s3.uuid || E.warn(`ZIP pack '${e3.name}' has no uuid in pack.json \u2014 order persistence disabled for this pack`), s3.name === e3.name.replace(/\.zip$/, ``) && E.warn(`ZIP pack '${e3.name}' has no custom name in pack.json`)), a2.push((n2?.remember || de)({ dir: i4, meta: s3, preflightErrors: s3.validationErrors, enabled: !s3.uuid || !t2.includes(s3.uuid) }, c3, e3.name.replace(/\.zip$/, ``), r2));
      continue;
    }
    let i3 = `${y.PACKS_ROOT}\\${e3.name}`, o2 = null, s2 = false, c2 = null;
    try {
      c2 = await (n2?.readText || X)(`${i3}\\pack.json`);
      let t3 = c2 ? T.default.parse(c2) : null;
      t3 ? (o2 = await Q(t3, e3.name, i3, n2), s2 = true) : E.error(`Pack '${e3.name}' is missing pack.json`);
    } catch (t3) {
      E.error(`Pack '${e3.name}' pack.json parse error: ${t3}`);
    }
    o2 ||= await Q(null, e3.name, i3, n2), s2 && (o2.uuid || E.warn(`Pack '${e3.name}' has no uuid in pack.json \u2014 order persistence disabled for this pack`), o2.name === e3.name && E.warn(`Pack '${e3.name}' has no custom name in pack.json`));
    for (let e4 of [`png`, `ico`]) {
      let t3 = `${i3}\\thumbnail.${e4}`;
      try {
        let n3 = await se(t3), r3 = `data:${e4 === `ico` ? `image/x-icon` : `image/${e4}`};base64,${P(n3)}`;
        await _e(r3, 128) ? o2.thumbnailUrl = r3 : E.warn(`Thumbnail ${t3} ignored: dimensions exceed 128x128.`);
        break;
      } catch {
      }
    }
    a2.push((n2?.remember || de)({ dir: i3, meta: o2, preflightErrors: o2.validationErrors, enabled: !o2.uuid || !t2.includes(o2.uuid) }, c2, e3.name, r2));
  }
  return e2.length > 0 ? a2.sort((t3, n3) => {
    let r3 = t3.meta.uuid ? e2.indexOf(t3.meta.uuid) : -1, i3 = n3.meta.uuid ? e2.indexOf(n3.meta.uuid) : -1;
    return r3 !== -1 && i3 !== -1 ? r3 - i3 : r3 === -1 ? i3 === -1 ? t3.meta.priority - n3.meta.priority || t3.meta.name.localeCompare(n3.meta.name) : 1 : -1;
  }) : a2.sort((e3, t3) => e3.meta.priority - t3.meta.priority || e3.meta.name.localeCompare(t3.meta.name)), E.info(`Discovered ${a2.length} datapack(s)`), a2;
}
async function ye(e2, t2 = null) {
  let n2 = { defaultMode: `merge`, features: {}, objects: {}, errors: [] }, r2 = null;
  try {
    r2 = await (t2?.readFile || J)(`${e2}\\jsons\\config\\patching.json`, true), r2 ||= await (t2?.readFile || J)(`${e2}\\jsons\\config\\patching.json5`, true);
  } catch (e3) {
    return n2.errors.push(`patching config parse error: ${e3}`), n2;
  }
  if (!r2) return n2;
  if (typeof r2 != `object` || Array.isArray(r2)) return n2.errors.push(`patching config: expected object root`), n2;
  let i2 = pe(r2.defaultMode, `defaultMode`, n2.errors);
  if (i2 && (n2.defaultMode = i2), n2.features = me(r2.features, x.map((e3) => e3.type), `features`, n2.errors), n2.objects = me(r2.objects, S.map((e3) => e3.type), `objects`, n2.errors), n2.errors.length) for (let t3 of n2.errors) E.warn(`[${e2}] ${t3}`);
  return n2;
}
async function be(e2, t2 = null, n2 = null) {
  let r2 = /* @__PURE__ */ new Map(), i2 = [], a2 = `${e2}\\jsons\\features`, o2 = t2?.defaultMode === `replace` ? `replace` : `merge`;
  for (let s2 of x) try {
    let i3 = await (n2?.readFile || J)(`${a2}\\${s2.type}.json`, true);
    if (i3 ||= await (n2?.readFile || J)(`${a2}\\${s2.type}.json5`, true), i3) {
      let n3 = t2?.features?.[s2.type]?.mode === `replace` ? `replace` : o2;
      r2.set(s2.type, { data: i3, config: s2, mode: n3 }), E.debug(`[${e2}] Loaded feature: ${s2.type}`);
    }
  } catch {
    i2.push(s2.type);
  }
  return { patches: r2, errors: i2 };
}
async function xe(e2, t2 = null, n2 = null) {
  let r2 = /* @__PURE__ */ new Map(), i2 = [], a2 = `${e2}\\jsons\\objects`, o2 = t2?.defaultMode === `replace` ? `replace` : `merge`;
  for (let e3 of S) try {
    let i3 = await (n2?.readFile || J)(`${a2}\\${e3.type}.json`, true);
    if (i3 ||= await (n2?.readFile || J)(`${a2}\\${e3.type}.json5`, true), i3) {
      let n3 = t2?.objects?.[e3.type]?.mode === `replace` ? `replace` : o2;
      r2.set(e3.type, { data: i3, config: e3, mode: n3 });
    }
  } catch {
    i2.push(e3.type);
  }
  return { patches: r2, errors: i2 };
}
async function Se(e2, t2 = null) {
  try {
    let n2 = await (t2?.readFile || J)(`${e2}\\jsons\\lang\\lang.json`, true);
    return n2 ||= await (t2?.readFile || J)(`${e2}\\jsons\\lang\\lang.json5`, true), { data: n2 || null, error: false };
  } catch {
    return { data: null, error: true };
  }
}
async function Ce(e2, t2 = null) {
  try {
    let n2 = await (t2?.readFile || J)(`${e2}\\jsons\\extensions\\plant-levels.json`, true);
    return n2 ||= await (t2?.readFile || J)(`${e2}\\jsons\\extensions\\plant-levels.json5`, true), { data: n2 || null, error: false };
  } catch {
    return { data: null, error: true };
  }
}
async function we(e2, t2 = null) {
  let n2 = /* @__PURE__ */ new Map(), r2 = [], i2 = `${e2}\\jsons\\levels`, a2 = await (t2?.listDir || Y)(i2);
  for (let o2 of a2) {
    if (!o2.isFile) continue;
    let a3 = o2.name.toLowerCase();
    if (!(!a3.endsWith(`.json`) && !a3.endsWith(`.json5`))) try {
      let r3 = await (t2?.readFile || J)(`${i2}\\${o2.name}`, true);
      r3 && (n2.set(o2.name, r3), E.debug(`[${e2}] Loaded level: ${o2.name}`));
    } catch {
      r2.push(o2.name);
    }
  }
  return { patches: n2, errors: r2 };
}
async function Te(e2, t2) {
  let n2 = String(t2 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return n2 ? X(`${e2}\\${n2}`) : null;
}
async function Ee(e2, t2) {
  let n2 = h(t2, { label: `resource path` }), r2 = V(`${e2}/${n2}`);
  if (r2) return r2.snapshot.readBytes(r2.relative);
  let i2 = O(e2), a2 = R.get(i2);
  if (a2) {
    let e3 = a2.get(O(n2));
    return e3 ? e3.slice() : null;
  }
  try {
    let t3 = h(`${e2}/${n2}`, { label: `pack resource` }), r3 = t3.split(`/`);
    for (let e3 = 1; e3 <= r3.length; e3++) if ((await c(r3.slice(0, e3).join(`/`), { baseDir: v })).isSymlink) return null;
    return await se(t3);
  } catch {
    return null;
  }
}
function De(e2) {
  return ee(e2, { lstat: (e3) => c(e3, { baseDir: v }), readDir: ce, readFile: se });
}
async function Oe(e2, t2) {
  let n2 = String(t2 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return n2 ? J(`${e2}\\${n2}`) : null;
}
async function ke(e2, t2) {
  let n2 = String(t2 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return Y(n2 ? `${e2}\\${n2}` : e2);
}
async function Ae(e2, t2) {
  let n2 = String(t2 || ``).replace(/^[/\\]+/, ``).replace(/\//g, `\\`);
  return fe(n2 ? `${e2}\\${n2}` : e2);
}
async function getBasePath() {
  try {
    return await o();
  } catch {
    return `(unknown)`;
  }
}
async function Me() {
  try {
    let e2 = await J(b);
    return !e2 || typeof e2 != `object` ? { packOrder: [], disabledPacks: [], version: 1 } : { packOrder: Array.isArray(e2.packOrder) ? e2.packOrder : [], disabledPacks: Array.isArray(e2.disabledPacks) ? e2.disabledPacks : [], version: e2.version || 1 };
  } catch {
    return { packOrder: [], disabledPacks: [], version: 1 };
  }
}
async function saveSettings(e2) {
  try {
    return await A(b, JSON.stringify({ version: 1, ...e2 }, null, 2)), E.info(`Settings saved`), true;
  } catch (e3) {
    return E.error(`Failed to save settings: ${e3}`), false;
  }
}
async function Pe() {
  let e2 = y.GPN_EDITS;
  try {
    await M(e2), await M(`${e2}\\jsons\\features`), await M(`${e2}\\jsons\\objects`), await M(`${e2}\\jsons\\levels`);
  } catch (e3) {
    E.error(`Failed to create GPN edits directories: ${e3}`);
  }
  let t2 = `${e2}\\pack.json`;
  if (!await j(t2)) {
    let e3 = { uuid: `gpn_edits`, name: `GP-Next Internal Edits`, version: `1.0.0`, priority: 1e4, description: `Locally saved manual edits from GP-Next Data Viewer. DO NOT DELETE manually.` };
    try {
      await A(t2, JSON.stringify(e3, null, 2));
    } catch (e4) {
      E.error(`Failed to create pack.json for GPN edits: ${e4}`);
    }
  }
}
async function Fe(e2, t2, n2) {
  try {
    await Pe();
    let r2 = `objects`, i2 = null, a2 = `CODENAME`, o2 = x.find((t3) => t3.type === e2);
    o2 ? (r2 = `features`, i2 = o2.key || null, a2 = o2.idKey || `CODENAME`) : e2.startsWith(`Level:`) && (r2 = `levels`);
    let s2 = `${y.GPN_EDITS}\\jsons\\${r2}\\${e2}.json`, c2 = {};
    if (await j(s2)) {
      let e3 = await k(s2);
      try {
        c2 = T.default.parse(e3);
      } catch {
      }
    }
    if (r2 === `features`) if (i2) {
      c2[i2] || (c2[i2] = []);
      let e3 = c2[i2], r3 = e3.findIndex((e4) => e4[a2] === t2);
      r3 === -1 ? e3.push(n2) : e3[r3] = n2;
    } else {
      let r3 = x.find((t3) => t3.type === e2), i3 = (r3?.extraKeys || []).find((e3) => e3.idKey ? e3.typeFilter ? n2?.[e3.typeFilter.field] === e3.typeFilter.value : c2[e3.key]?.some((n3) => n3[e3.idKey] === t2) : false) || (r3?.extraKeys || []).find((e3) => e3.idKey);
      if (i3?.idKey) {
        c2[i3.key] || (c2[i3.key] = []);
        let e3 = c2[i3.key], r4 = e3.findIndex((e4) => e4[i3.idKey] === t2);
        r4 === -1 ? e3.push(n2) : e3[r4] = n2;
      }
    }
    else if (r2 === `objects`) {
      c2.objects ||= [];
      let e3 = c2.objects, r3 = e3.findIndex((e4) => e4.aliases?.[0] === t2);
      r3 === -1 ? e3.push(n2) : e3[r3] = n2;
    } else c2 = n2;
    return await A(s2, JSON.stringify(c2, null, 2)), E.info(`Saved manual edit for ${e2} -> ${t2}`), true;
  } catch (e3) {
    return E.error(`Failed to save GPN edit: ${e3}`), false;
  }
}
async function Ie(e2, t2) {
  try {
    let n2 = `objects`, r2 = null, i2 = `CODENAME`, a2 = x.find((t3) => t3.type === e2);
    a2 && (n2 = `features`, r2 = a2.key || null, i2 = a2.idKey || `CODENAME`);
    let o2 = `${y.GPN_EDITS}\\jsons\\${n2}\\${e2}.json`;
    if (!await j(o2)) return true;
    let s2 = await k(o2), c2 = {};
    try {
      c2 = T.default.parse(s2);
    } catch {
      return false;
    }
    let l2 = false;
    if (n2 === `features` && r2 && c2[r2]) {
      let e3 = c2[r2], n3 = e3.length;
      c2[r2] = e3.filter((e4) => e4[i2] !== t2), l2 = c2[r2].length !== n3;
    } else if (n2 === `features` && !r2 && a2?.extraKeys) for (let e3 of a2.extraKeys) {
      if (!e3.idKey || !c2[e3.key]) continue;
      let n3 = c2[e3.key], r3 = n3.length;
      c2[e3.key] = n3.filter((n4) => n4[e3.idKey] !== t2), c2[e3.key].length !== r3 && (l2 = true);
    }
    else if (n2 === `objects` && c2.objects) {
      let e3 = c2.objects, n3 = e3.length;
      c2.objects = e3.filter((e4) => e4.aliases?.[0] !== t2), l2 = c2.objects.length !== n3;
    }
    return l2 && (await A(o2, JSON.stringify(c2, null, 2)), E.info(`Removed manual edit for ${e2} -> ${t2}`)), true;
  } catch (e3) {
    return E.error(`Failed to remove GPN edit: ${e3}`), false;
  }
}
async function Le() {
  try {
    let e2 = `${y.GPN_EDITS}\\jsons`;
    return await j(e2) && await N(e2), E.info(`Cleared all GPN manual edits`), true;
  } catch (e2) {
    return E.error(`Failed to clear GPN edits: ${e2}`), false;
  }
}
async function Re(e2, t2 = null) {
  let n2 = await ye(e2, t2), [r2, i2, a2, o2, s2] = await Promise.all([be(e2, n2, t2), xe(e2, n2, t2), we(e2, t2), Se(e2, t2), Ce(e2, t2)]), c2 = [...n2.errors, ...r2.errors, ...i2.errors, ...a2.errors];
  return o2.error && c2.push(`lang: invalid JSON`), s2.error && c2.push(`plant-levels: invalid JSON`), { config: n2, features: r2, objects: i2, levels: a2, lang: o2, plantLevels: s2, errors: c2 };
}
function ze(e2 = null) {
  let t2 = e2 !== null, n2 = new Map([...e2 || []].map(([e3, t3]) => [D(e3), t3])), r2 = /* @__PURE__ */ new WeakMap(), i2 = (e3) => {
    let t3 = D(e3);
    for (let [e4, r3] of n2) if (t3 === e4 || t3.startsWith(e4 + `/`)) return { snapshot: r3, relative: t3.slice(e4.length).replace(/^\//, ``) };
    return null;
  }, a2 = async (e3, n3, r3) => {
    if (t2) throw Error(`Path is outside installed snapshots: ${e3}`);
    try {
      return await n3(e3);
    } catch (t3) {
      if (await j(e3)) throw t3;
      return r3;
    }
  }, o2 = { readText: async (e3) => {
    let t3 = i2(e3);
    return t3 ? t3.snapshot.readText(t3.relative) : a2(e3, k, null);
  }, readFile: async (e3, t3 = false) => {
    let n3 = await o2.readText(e3);
    return n3 === null ? null : q(n3, t3);
  }, listDir: async (e3) => {
    let t3 = i2(e3);
    if (!t3) return a2(e3, ce, []);
    let n3 = t3.relative ? t3.relative + `/` : ``, r3 = /* @__PURE__ */ new Map();
    for (let e4 of t3.snapshot.listPaths()) if (e4.startsWith(n3)) {
      let t4 = e4.slice(n3.length), i3 = t4.split(`/`)[0];
      r3.set(i3, { name: i3, isFile: !t4.includes(`/`), isDirectory: t4.includes(`/`) });
    }
    return [...r3.values()];
  }, pathExists: async (e3) => {
    let n3 = i2(e3);
    if (!n3 && t2) throw Error(`Path is outside installed snapshots: ${e3}`);
    return n3 ? !n3.relative || n3.snapshot.listPaths().some((e4) => e4 === n3.relative || e4.startsWith(n3.relative + `/`)) : j(e3);
  }, loadZip: async (e3) => {
    if (t2) throw Error(`Installed snapshots are already unpacked`);
    let r3 = await _(await se(e3));
    return n2.set(D(e3), r3), /* @__PURE__ */ new Map([[`pack.json`, r3.readText(`pack.json`)]]);
  }, remember(e3, t3, n3) {
    return r2.set(e3, { dir: e3.dir, meta: e3.meta, signature: W(e3.meta), manifest: t3 ?? null, fallbackName: n3 }), e3;
  }, async capture(e3) {
    let i3 = r2.get(e3);
    if (!i3 || i3.dir !== e3.dir || i3.meta !== e3.meta || i3.signature !== W(e3.meta)) throw Error(`Candidate discovery changed`);
    let a3 = t2 ? n2.get(D(e3.dir)) : await De(e3.dir);
    if (!a3) throw Error(`Installed package snapshot is missing`);
    if (a3.readText(`pack.json`) !== i3.manifest) throw Error(`Package manifest changed after discovery`);
    if (n2.set(D(e3.dir), a3), W(await Q(i3.manifest ? T.default.parse(i3.manifest) : null, i3.fallbackName, e3.dir, o2)) !== i3.signature) throw Error(`Package content metadata changed after discovery`);
    return a3;
  }, async captureOptional(e3) {
    if (t2) {
      let t3 = n2.get(D(e3));
      if (!t3) throw Error(`Installed override snapshot is missing: ${e3}`);
      return t3;
    }
    let r3 = await j(e3) ? await De(e3) : await g([]);
    return n2.set(D(e3), r3), r3;
  }, async describeInstalled(e3, { id: r3, version: i3, enabled: a3 = true, legacy: s2 = false, fallbackName: c2 = r3, runtimeNamespace: l2 }) {
    if (!t2) throw Error(`Installed descriptors require fixed snapshots`);
    let u2 = n2.get(D(e3));
    if (!u2) throw Error(`Installed package snapshot is missing`);
    let d2 = u2.readText(`pack.json`);
    if (!d2 && !s2) throw Error(`Installed packages require pack.json`);
    if (typeof c2 != `string` || !c2.trim()) throw Error(`Installed fallback name is missing`);
    let f2 = await Q(d2 ? T.default.parse(d2) : null, c2, e3, o2);
    if (!r3 || f2.version !== i3) throw Error(`Installed manifest identity differs from selection`);
    if (s2) {
      if (s2 !== true || !/^legacy:[a-f0-9]{64}$/.test(r3) || f2.uuid || f2.js || l2 !== f2.name) throw Error(`Invalid legacy installed identity or script content`);
    } else if (f2.uuid !== r3) throw Error(`Installed manifest identity differs from selection`);
    return o2.remember({ dir: e3, meta: f2, enabled: a3, contentDigest: u2.digest, installationId: r3 }, d2, c2);
  }, readTextFrom(e3, t3) {
    return o2.readText(`${e3}/${h(t3)}`);
  } };
  return o2;
}
export {
  x as A,
  Oe as C,
  Fe as E,
  te as F,
  w as I,
  C as L,
  ne as M,
  S as N,
  ie as O,
  b as P,
  Ee as S,
  Ie as T,
  xe as _,
  $ as a,
  Ae as b,
  ve as c,
  U as d,
  ke as f,
  we as g,
  getBasePath,
  Se as h,
  Le as i,
  y as j,
  re as k,
  ae as l,
  ye as m,
  H as n,
  ze as o,
  be as p,
  De as r,
  I as s,
  saveSettings,
  G as t,
  Ce as v,
  Te as w,
  Re as x,
  Me as y
};
