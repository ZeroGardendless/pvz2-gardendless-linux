import { normalizeFrameRate } from "../runtime/FrameRate.js";
var e = /* @__PURE__ */ new Set([`ShiftLeft`, `ShiftRight`, `ControlLeft`, `ControlRight`, `AltLeft`, `AltRight`, `MetaLeft`, `MetaRight`]), t = /* @__PURE__ */ new Set([`Shift`, `Control`, `Ctrl`, `Alt`, `Meta`]), n = { Escape: `Escape`, Esc: `Escape`, Enter: `Enter`, Tab: `Tab`, Space: `Space`, " ": `Space`, Backspace: `Backspace`, Delete: `Delete`, Insert: `Insert`, Home: `Home`, End: `End`, PageUp: `PageUp`, "Page Up": `PageUp`, PageDown: `PageDown`, "Page Down": `PageDown`, ArrowLeft: `ArrowLeft`, Left: `ArrowLeft`, ArrowRight: `ArrowRight`, Right: `ArrowRight`, ArrowUp: `ArrowUp`, Up: `ArrowUp`, ArrowDown: `ArrowDown`, Down: `ArrowDown`, Backquote: `Backquote`, "`": `Backquote`, Minus: `Minus`, "-": `Minus`, Equal: `Equal`, "=": `Equal`, BracketLeft: `BracketLeft`, "[": `BracketLeft`, BracketRight: `BracketRight`, "]": `BracketRight`, Backslash: `Backslash`, "\\": `Backslash`, Semicolon: `Semicolon`, ";": `Semicolon`, Quote: `Quote`, "'": `Quote`, Comma: `Comma`, ",": `Comma`, Period: `Period`, ".": `Period`, Slash: `Slash`, "/": `Slash` }, r = { Escape: `Esc`, Enter: `Enter`, Tab: `Tab`, Space: `Space`, Backspace: `Backspace`, Delete: `Delete`, Insert: `Insert`, Home: `Home`, End: `End`, PageUp: `Page Up`, PageDown: `Page Down`, ArrowLeft: `Left`, ArrowRight: `Right`, ArrowUp: `Up`, ArrowDown: `Down`, Backquote: "`", Minus: `-`, Equal: `=`, BracketLeft: `[`, BracketRight: `]`, Backslash: `\\`, Semicolon: `;`, Quote: `'`, Comma: `,`, Period: `.`, Slash: `/` }, i = Object.freeze({ key: `F9`, code: `F9`, ctrl: false, alt: false, shift: false, meta: false });
function a(e2) {
  return e2 === true;
}
function o(n2, r2) {
  return e.has(n2) || t.has(r2);
}
function s(e2) {
  if (typeof e2 != `string`) return ``;
  let t2 = e2.trim();
  return t2 ? n[t2] ? n[t2] : /^F\d{1,2}$/i.test(t2) ? t2.toUpperCase() : /^[a-z]$/i.test(t2) ? `Key${t2.toUpperCase()}` : /^\d$/.test(t2) ? `Digit${t2}` : `` : ``;
}
function c(e2, t2 = ``) {
  if (typeof e2 == `string` && e2) {
    if (r[e2]) return r[e2];
    if (/^Key[A-Z]$/.test(e2)) return e2.slice(3);
    if (/^Digit\d$/.test(e2)) return e2.slice(5);
    if (/^Numpad\d$/.test(e2)) return `Num ${e2.slice(6)}`;
    if (/^F\d{1,2}$/.test(e2)) return e2;
  }
  let n2 = typeof t2 == `string` ? t2.trim() : ``;
  return n2 ? n2 === ` ` ? `Space` : n2.length === 1 ? n2.toUpperCase() : n2 === `Escape` ? `Esc` : n2.startsWith(`Arrow`) ? n2.slice(5) : n2 : ``;
}
function l(e2, t2) {
  return (typeof e2 == `string` ? e2.trim() : ``) || s(t2);
}
function u(e2, t2 = i) {
  let n2 = e2 && typeof e2 == `object` ? e2 : {}, r2 = t2 && typeof t2 == `object` ? t2 : i, u2 = l(n2.code, n2.key), d2 = c(u2, n2.key);
  return !d2 || o(u2, d2) ? { ...r2 } : { key: d2, code: u2 || s(d2), ctrl: a(n2.ctrl), alt: a(n2.alt), shift: a(n2.shift), meta: a(n2.meta) };
}
function d(e2) {
  let t2 = u(e2), n2 = [];
  return t2.ctrl && n2.push(`Ctrl`), t2.alt && n2.push(`Alt`), t2.shift && n2.push(`Shift`), t2.meta && n2.push(`Win`), n2.push(t2.key), n2.join(`+`);
}
function f(e2) {
  if (!e2) return null;
  let t2 = l(e2.code, e2.key), n2 = c(t2, e2.key);
  return !n2 || o(t2, n2) ? null : u({ key: n2, code: t2, ctrl: e2.ctrlKey, alt: e2.altKey, shift: e2.shiftKey, meta: e2.metaKey });
}
function p(e2, t2) {
  if (!t2 || t2.repeat) return false;
  let n2 = u(e2);
  if (!!t2.ctrlKey !== n2.ctrl || !!t2.altKey !== n2.alt || !!t2.shiftKey !== n2.shift || !!t2.metaKey !== n2.meta) return false;
  let r2 = l(t2.code, t2.key);
  return r2 && n2.code ? r2 === n2.code : c(``, t2.key) === n2.key;
}
function m(e2) {
  let t2 = u(e2);
  return t2.ctrl || t2.alt || t2.meta;
}
var h = `gp-next-settings`, g = 5, _ = Object.freeze({ key: `F10`, code: `F10`, ctrl: false, alt: false, shift: false, meta: false }), v = { version: g, locale: null, builtinTranslations: true, frameRate: `120`, widescreen: `none`, debug: false, overlayHotkey: { ...i }, experimental: { jsModding: false, worldMapJson: false, plantLevelSystem: false }, dynamicPlantRegistry: true, shopExtensions: true, scrollSensitivity: { enabled: true, wheel: 1, discreteMinIntervalMs: 0 }, hpOverlay: { showPlant: false, showZombie: false, showTomb: false } }, y = null;
function b(e2) {
  return JSON.parse(JSON.stringify(e2));
}
function x(e2) {
  let t2 = Number(e2);
  return !Number.isFinite(t2) || t2 <= 0 ? 1 : Math.max(0.05, Math.min(3, t2));
}
function S(e2) {
  let t2 = Number(e2);
  return !Number.isFinite(t2) || t2 < 0 ? 0 : Math.round(Math.max(0, Math.min(400, t2)));
}
function C(e2, t2) {
  return e2?.key === t2?.key && e2?.code === t2?.code && e2?.ctrl === t2?.ctrl && e2?.alt === t2?.alt && e2?.shift === t2?.shift && e2?.meta === t2?.meta;
}
function w(e2) {
  let t2 = e2 && typeof e2 == `object` ? e2 : {}, n2 = { ...v.experimental, ...t2.experimental && typeof t2.experimental == `object` ? t2.experimental : {} }, r2 = Number(t2.version) || 0, a2 = u(t2.overlayHotkey, i), o2 = r2 < 3 && C(a2, _) ? { ...i } : a2;
  return { version: g, locale: typeof t2.locale == `string` ? t2.locale : null, builtinTranslations: t2.builtinTranslations !== false, frameRate: (() => {
    const fr = Number(t2.frameRate);
    return String(normalizeFrameRate(r2 < 4 && fr === 60 ? 0 : fr));
  })(), widescreen: [`fog`, `bushes`].includes(t2.widescreen) ? t2.widescreen : `none`, debug: t2.debug === true, overlayHotkey: o2, experimental: { jsModding: n2.jsModding === true, worldMapJson: n2.worldMapJson === true, plantLevelSystem: n2.plantLevelSystem === true }, dynamicPlantRegistry: t2.dynamicPlantRegistry !== false, shopExtensions: t2.shopExtensions !== false, scrollSensitivity: { enabled: t2.scrollSensitivity?.enabled !== false, wheel: x(t2.scrollSensitivity?.wheel), discreteMinIntervalMs: S(t2.scrollSensitivity?.discreteMinIntervalMs) }, hpOverlay: { showPlant: t2.hpOverlay?.showPlant === true, showZombie: t2.hpOverlay?.showZombie === true, showTomb: typeof t2.hpOverlay?.showTomb == `boolean` ? t2.hpOverlay.showTomb === true : t2.hpOverlay?.showZombie === true } };
}
function T() {
  let e2 = {}, t2 = localStorage.getItem(`gp-next-locale`);
  return t2 && (e2.locale = t2), e2;
}
function E() {
  localStorage.setItem(h, JSON.stringify(y));
}
function getSettings() {
  if (y) return b(y);
  let e2 = null;
  try {
    e2 = JSON.parse(localStorage.getItem(h) || `null`);
  } catch {
    e2 = null;
  }
  y = w({ ...v, ...e2 || {} });
  let t2 = T();
  return y.locale == null && t2.locale && (y.locale = t2.locale), E(), b(y);
}
function setSettings(e2) {
  let t2 = getSettings();
  return y = w({ ...t2, ...e2 || {}, overlayHotkey: { ...t2.overlayHotkey, ...e2?.overlayHotkey || {} }, scrollSensitivity: { ...t2.scrollSensitivity, ...e2?.scrollSensitivity || {} }, hpOverlay: { ...t2.hpOverlay, ...e2?.hpOverlay || {} }, experimental: { ...t2.experimental || {}, ...e2?.experimental || {} }, version: g }), E(), b(y);
}
function getExperimentalSettings() {
  return b(getSettings().experimental || v.experimental);
}
function isWorldMapJsonEnabled() {
  return getExperimentalSettings().worldMapJson === true;
}
function isPlantLevelSystemEnabled() {
  return getExperimentalSettings().plantLevelSystem === true;
}
function isJsModdingRuntimeEnabled() {
  return getExperimentalSettings().jsModding === true;
}
function setJsModdingRuntimeEnabledFromConsole(e2) {
  return setSettings({ experimental: { jsModding: e2 === true } });
}
function getGpNextFeatureState(e2, t2 = getSettings()) {
  switch (String(e2 || ``)) {
    case `experimental.jsModding`:
    case `runtime.jsModding`:
      return t2.experimental?.jsModding === true;
    case `experimental.worldMapJson`:
    case `runtime.worldMapJson`:
      return t2.experimental?.worldMapJson === true;
    case `experimental.plantLevelSystem`:
    case `runtime.plantLevelSystem`:
      return t2.experimental?.plantLevelSystem === true;
    case `runtime.dynamicPlantRegistry`:
      return t2.dynamicPlantRegistry !== false;
    case `runtime.shopExtensions`:
      return t2.shopExtensions === true;
    case `runtime.scrollSensitivity`:
      return t2.scrollSensitivity?.enabled !== false;
    default:
      return null;
  }
}
function isBuiltinTranslationsEnabled() {
  return getSettings().builtinTranslations !== false;
}
export {
  d,
  f,
  getExperimentalSettings,
  getGpNextFeatureState,
  getSettings,
  u as h,
  isBuiltinTranslationsEnabled,
  isJsModdingRuntimeEnabled,
  isPlantLevelSystemEnabled,
  isWorldMapJsonEnabled,
  p as m,
  m as p,
  setJsModdingRuntimeEnabledFromConsole,
  setSettings,
  i as u
};
