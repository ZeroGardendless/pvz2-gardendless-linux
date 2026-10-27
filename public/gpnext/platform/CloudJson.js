(function() {
  if (typeof document === "undefined") return;
  let e2 = document.createElement(`link`).relList;
  if (e2 && e2.supports && e2.supports(`modulepreload`)) return;
  for (let e3 of document.querySelectorAll(`link[rel="modulepreload"]`)) n2(e3);
  new MutationObserver((e3) => {
    for (let t3 of e3) if (t3.type === `childList`) for (let e4 of t3.addedNodes) e4.tagName === `LINK` && e4.rel === `modulepreload` && n2(e4);
  }).observe(document, { childList: true, subtree: true });
  function t2(e3) {
    let t3 = {};
    return e3.integrity && (t3.integrity = e3.integrity), e3.referrerPolicy && (t3.referrerPolicy = e3.referrerPolicy), e3.crossOrigin === `use-credentials` ? t3.credentials = `include` : e3.crossOrigin === `anonymous` ? t3.credentials = `omit` : t3.credentials = `same-origin`, t3;
  }
  function n2(e3) {
    if (e3.ep) return;
    e3.ep = true;
    let n3 = t2(e3);
    fetch(e3.href, n3);
  }
})();
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
function s() {
  return !!(globalThis || window).isTauri;
}
var c = Object.freeze({ saveMaxBytes: 2e6, preferenceMaxBytes: 32e3, maxDepth: 32, maxNodes: 1e5, maxStringCharacters: 2e5, maxPlayers: 100, maxModRecords: 512, maxEnvironmentEntries: 256 }), l = class extends Error {
  code;
  constructor(e2) {
    super(e2), this.code = e2, this.name = `CloudContentError`;
  }
}, u = (e2) => {
  throw new l(e2);
}, d = (e2, t2 = `cloud-invalid-content`) => {
  e2 || u(t2);
}, f = (e2) => typeof e2 == `object` && !!e2 && !Array.isArray(e2), p = (e2) => [`__proto__`, `prototype`, `constructor`].includes(e2), m = /[\x00-\x1f\x7f]/, h = (e2, t2) => typeof e2 == `string` && e2.length > 0 && e2.length <= t2 && !m.test(e2), g = (e2) => typeof e2 == `string` && /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(e2), _ = (e2, t2, n2 = 2 ** 53 - 1) => Number.isSafeInteger(e2) && e2 >= t2 && e2 <= n2;
function v(e2, t2, n2 = []) {
  d(f(e2));
  let r2 = e2;
  d(Object.keys(r2).every((e3) => t2.includes(e3)) && n2.every((e3) => Object.hasOwn(r2, e3)));
}
function y(e2, t2, n2 = c) {
  d(e2.byteLength > 0 && e2.byteLength <= t2, `cloud-byte-limit`);
  let r2;
  try {
    r2 = new TextDecoder(`utf-8`, { fatal: true }).decode(e2);
  } catch {
    return u(`cloud-invalid-utf8`);
  }
  let i2 = /-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/y, a2 = 0, o2 = 0, s2 = () => {
    for (; /^[\x20\x09\x0a\x0d]$/.test(r2[a2] ?? ``); ) a2++;
  }, l2 = () => {
    let e3 = a2++;
    for (; a2 < r2.length; ) {
      let t3 = r2[a2++];
      if (t3 === `"`) {
        let t4;
        try {
          t4 = JSON.parse(r2.slice(e3, a2));
        } catch {
          return u(`cloud-invalid-json`);
        }
        return d(!t4.includes(`\0`), `cloud-invalid-string`), d(t4.length <= c.maxStringCharacters, `cloud-string-limit`), d(!/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/u.test(t4), `cloud-invalid-unicode`), t4;
      }
      t3 === `\\` ? (d(a2 < r2.length, `cloud-invalid-json`), a2++) : d(t3.charCodeAt(0) >= 32, `cloud-invalid-json`);
    }
    return u(`cloud-invalid-json`);
  }, f2 = (e3) => {
    d(e3 <= n2.maxDepth, `cloud-depth-limit`), d(++o2 <= n2.maxNodes, `cloud-node-limit`), s2();
    let t3 = r2[a2];
    if (t3 === `"`) return l2();
    if (t3 === `{`) {
      a2++, s2();
      let t4 = /* @__PURE__ */ Object.create(null), n3 = /* @__PURE__ */ new Set();
      if (r2[a2] === `}`) return a2++, t4;
      for (; ; ) {
        s2(), d(r2[a2] === `"`, `cloud-invalid-json`);
        let i3 = l2();
        d(!n3.has(i3), `cloud-duplicate-key`), d(!p(i3), `cloud-unsafe-key`), n3.add(i3), s2(), d(r2[a2++] === `:`, `cloud-invalid-json`), t4[i3] = f2(e3 + 1), s2();
        let o3 = r2[a2++];
        if (o3 === `}`) return t4;
        d(o3 === `,`, `cloud-invalid-json`);
      }
    }
    if (t3 === `[`) {
      a2++, s2();
      let t4 = [];
      if (r2[a2] === `]`) return a2++, t4;
      for (; ; ) {
        t4.push(f2(e3 + 1)), s2();
        let n3 = r2[a2++];
        if (n3 === `]`) return t4;
        d(n3 === `,`, `cloud-invalid-json`);
      }
    }
    for (let [e4, t4] of [[`true`, true], [`false`, false], [`null`, null]]) if (r2.startsWith(e4, a2)) return a2 += e4.length, t4;
    i2.lastIndex = a2;
    let c2 = i2.exec(r2);
    d(c2, `cloud-invalid-json`), a2 += c2[0].length;
    let u2 = Number(c2[0]);
    return d(Number.isFinite(u2), `cloud-invalid-number`), u2;
  }, m2 = f2(0);
  return s2(), d(a2 === r2.length, `cloud-invalid-json`), m2;
}
var b = Object.freeze([`PlayerIndex`, `Language`, `MusicVolume`, `SFXVolume`, `MusicSpeedMin`, `MusicSpeedMax`, `CardsLayer`, `ShowKeyTips`, `PlantKeyTips`, `ClassicCardBG`]);
function x(e2) {
  let t2 = y(e2, c.saveMaxBytes);
  v(t2, [`format`, `version`, `game`, `players`, `settings`, `modData`, `environment`, `preferenceId`], [`format`, `version`, `game`, `players`, `settings`, `modData`, `environment`]), d(t2.format === `gardenest-save` && t2.version === 1, `cloud-schema-unsupported`), v(t2.game, [`version`, `gpNextVersion`], [`version`, `gpNextVersion`]), d(h(t2.game.version, 64) && h(t2.game.gpNextVersion, 64)), d(Array.isArray(t2.players) && t2.players.length > 0 && t2.players.length <= c.maxPlayers && t2.players.every(f));
  let n2 = t2.players, r2 = /* @__PURE__ */ new Set();
  for (let e3 of n2) Object.hasOwn(e3, `__gpNextSaveId`) && (d(g(e3.__gpNextSaveId) && !r2.has(e3.__gpNextSaveId), `cloud-save-identity-conflict`), r2.add(e3.__gpNextSaveId));
  v(t2.settings, [...b]);
  for (let [e3, r3] of Object.entries(t2.settings)) e3 === `PlayerIndex` ? d(_(r3, 0, n2.length - 1)) : e3 === `CardsLayer` ? d(_(r3, 0, 2)) : e3 === `Language` ? d(_(r3, 0, 32)) : [`MusicVolume`, `SFXVolume`].includes(e3) ? d(typeof r3 == `number` && r3 >= 0 && r3 <= 1) : [`MusicSpeedMin`, `MusicSpeedMax`].includes(e3) ? d(typeof r3 == `number` && r3 > 0 && r3 <= 10) : d(typeof r3 == `boolean`);
  d(Array.isArray(t2.modData) && t2.modData.length <= c.maxModRecords);
  let i2 = /* @__PURE__ */ new Set();
  for (let e3 of t2.modData) {
    v(e3, [`formatVersion`, `identity`, `schemaVersion`, `revision`, `data`], [`formatVersion`, `identity`, `schemaVersion`, `revision`, `data`]), d(e3.formatVersion === 1 && _(e3.schemaVersion, 1) && _(e3.revision, 1)), v(e3.identity, [`modId`, `kind`, `saveId`], [`modId`, `kind`]), d(h(e3.identity.modId, 256)), d(e3.identity.kind === `global` ? !Object.hasOwn(e3.identity, `saveId`) : e3.identity.kind === `save` && g(e3.identity.saveId) && r2.has(e3.identity.saveId), `cloud-mod-data-identity`);
    let t3 = JSON.stringify([e3.identity.modId, e3.identity.kind, e3.identity.saveId ?? null]);
    d(!i2.has(t3), `cloud-mod-data-identity`), i2.add(t3);
  }
  d(Array.isArray(t2.environment) && t2.environment.length <= c.maxEnvironmentEntries);
  let a2 = /* @__PURE__ */ new Set();
  for (let e3 of t2.environment) v(e3, [`modId`, `version`, `contentDigest`], [`modId`, `version`, `contentDigest`]), d(h(e3.modId, 256) && !a2.has(e3.modId) && h(e3.version, 64) && typeof e3.contentDigest == `string` && /^[a-f0-9]{64}$/.test(e3.contentDigest)), a2.add(e3.modId);
  return Object.hasOwn(t2, `preferenceId`) && d(g(t2.preferenceId)), t2;
}
function S(e2) {
  let t2 = y(e2, c.preferenceMaxBytes);
  v(t2, [`format`, `version`, `settings`], [`format`, `version`, `settings`]), d(t2.format === `gardenest-preferences` && t2.version === 1, `cloud-schema-unsupported`), v(t2.settings, [`theme`, `locale`, `builtinTranslations`, `hpOverlay`, `overlayHotkey`, `scrollSensitivity`, `frameRate`]);
  let n2 = t2.settings;
  d(Object.keys(n2).length > 0);
  for (let [e3, t3] of Object.entries(n2)) e3 === `theme` ? d(t3 === `light` || t3 === `dark`) : e3 === `locale` ? d(t3 === null || [`en`, `zh-CN`, `es`].includes(t3)) : e3 === `builtinTranslations` ? d(typeof t3 == `boolean`) : e3 === `frameRate` ? d([`0`, `30`, `60`, `90`, `120`, `144`, `165`, `240`].includes(t3)) : e3 === `hpOverlay` ? (v(t3, [`showPlant`, `showZombie`, `showTomb`]), d(Object.keys(t3).length > 0 && Object.values(t3).every((e4) => typeof e4 == `boolean`))) : e3 === `overlayHotkey` ? (v(t3, [`key`, `code`, `ctrl`, `alt`, `shift`, `meta`], [`key`, `code`, `ctrl`, `alt`, `shift`, `meta`]), d(h(t3.key, 64) && h(t3.code, 64) && [`ctrl`, `alt`, `shift`, `meta`].every((e4) => typeof t3[e4] == `boolean`))) : (v(t3, [`enabled`, `wheel`, `discreteMinIntervalMs`]), d(Object.keys(t3).length > 0), Object.hasOwn(t3, `enabled`) && d(typeof t3.enabled == `boolean`), Object.hasOwn(t3, `wheel`) && d(typeof t3.wheel == `number` && t3.wheel >= 0.05 && t3.wheel <= 3), Object.hasOwn(t3, `discreteMinIntervalMs`) && d(_(t3.discreteMinIntervalMs, 0, 400)));
  return t2;
}
function C(e2) {
  return Array.isArray(e2) ? `[` + e2.map(C).join(`,`) + `]` : f(e2) ? `{` + Object.keys(e2).sort().map((t2) => JSON.stringify(t2) + `:` + C(e2[t2])).join(`,`) + `}` : JSON.stringify(e2);
}
var w = c.saveMaxBytes + c.preferenceMaxBytes + 1024;
function T(e2) {
  let t2 = y(e2, w, { maxDepth: c.maxDepth + 1, maxNodes: c.maxNodes * 2 + 3 });
  v(t2, [`format`, `version`, `save`, `preferences`], [`format`, `version`, `save`, `preferences`]), d(t2.format === `gardenest-backup` && t2.version === 1, `cloud-schema-unsupported`), d(t2.save !== null || t2.preferences !== null);
  let n2 = (e3) => new TextEncoder().encode(C(e3));
  return { format: `gardenest-backup`, version: 1, save: t2.save === null ? null : x(n2(t2.save)), preferences: t2.preferences === null ? null : S(n2(t2.preferences)) };
}
function E(e2, t2 = c.saveMaxBytes, n2) {
  if (typeof e2 != `string`) throw Error(`CLOUD_JSON`);
  return y(new TextEncoder().encode(e2), t2, n2);
}
function D(e2, t2, n2) {
  return E(JSON.stringify(e2, (e3, t3) => {
    if (t3 === void 0 || typeof t3 == `function` || typeof t3 == `symbol` || typeof t3 == `bigint` || typeof t3 == `number` && !Number.isFinite(t3)) throw Error(`CLOUD_JSON`);
    return t3;
  }), t2, n2);
}
async function O(e2) {
  return [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(C(e2))))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
}
export {
  c as a,
  x as c,
  r as d,
  a as f,
  C as i,
  b as l,
  i as m,
  D as n,
  T as o,
  s as p,
  E as r,
  S as s,
  O as t,
  o as u
};
