import { normalizeRenderScale } from "../runtime/RenderOptions.js";
import { normalizeFrameRate } from "../runtime/FrameRate.js";
import { n as e } from "../vendor/ModuleHelpers.js";
import { t } from "../platform/CloudPortablePreferences.js";
import { d as n, i as r, o as i } from "../runtime/TrainerShortcuts.js";
var a = e({ getExperimentalSettings: () => getExperimentalSettings, getGpNextFeatureState: () => getGpNextFeatureState, getSettings: () => getSettings, isBuiltinTranslationsEnabled: () => isBuiltinTranslationsEnabled, isJsModdingRuntimeEnabled: () => isJsModdingRuntimeEnabled, isPlantLevelSystemEnabled: () => isPlantLevelSystemEnabled, isWorldMapJsonEnabled: () => isWorldMapJsonEnabled, setJsModdingRuntimeEnabledFromConsole: () => setJsModdingRuntimeEnabledFromConsole, setSettings: () => setSettings }), o = `gp-next-settings`, s = 6, c = Object.freeze({ key: `F10`, code: `F10`, ctrl: false, alt: false, shift: false, meta: false }), l = { version: s, locale: null, theme: `dark`, builtinTranslations: true, frameRate: `120`, widescreen: `none`, renderScale: 100, debug: false, redactDiagnostics: true, overlayHotkey: { ...i }, trainerHotkeys: {}, cloudBackup: { players: true, nativeSettings: true, preferenceFields: [...t] }, experimental: { frameScheduler: false, frameRate: 120, jsModding: false, worldMapJson: false, plantLevelSystem: false }, dynamicPlantRegistry: true, shopExtensions: true, scrollSensitivity: { enabled: true, wheel: 1, discreteMinIntervalMs: 0 }, hpOverlay: { showPlant: false, showZombie: false, showTomb: false } }, u = null;
function d(e2) {
  return JSON.parse(JSON.stringify(e2));
}
function f(e2) {
  let t2 = Number(e2);
  return !Number.isFinite(t2) || t2 <= 0 ? 1 : Math.max(0.05, Math.min(3, t2));
}
function p(e2) {
  let t2 = Number(e2);
  return !Number.isFinite(t2) || t2 < 0 ? 0 : Math.round(Math.max(0, Math.min(400, t2)));
}
function m(e2, t2) {
  return e2?.key === t2?.key && e2?.code === t2?.code && e2?.ctrl === t2?.ctrl && e2?.alt === t2?.alt && e2?.shift === t2?.shift && e2?.meta === t2?.meta;
}
function h(e2) {
  let a2 = e2 && typeof e2 == `object` ? e2 : {}, o2 = { ...l.experimental, ...a2.experimental && typeof a2.experimental == `object` ? a2.experimental : {} }, u2 = Number(a2.version) || 0, d2 = n(a2.overlayHotkey, i), h2 = u2 < s && m(d2, c) ? { ...i } : d2;
  return { version: s, locale: typeof a2.locale == `string` ? a2.locale : null, theme: a2.theme === `light` ? `light` : `dark`, builtinTranslations: a2.builtinTranslations !== false, frameRate: String(normalizeFrameRate(u2 < 4 && Number(a2.frameRate) === 60 ? 0 : a2.frameRate)), widescreen: [`fog`, `bushes`].includes(a2.widescreen) ? a2.widescreen : `none`, renderScale: normalizeRenderScale(a2.renderScale), debug: a2.debug === true, redactDiagnostics: a2.redactDiagnostics !== false, overlayHotkey: h2, trainerHotkeys: r(a2.trainerHotkeys), cloudBackup: { players: a2.cloudBackup?.players !== false, nativeSettings: a2.cloudBackup?.players !== false && a2.cloudBackup?.nativeSettings !== false, preferenceFields: Array.isArray(a2.cloudBackup?.preferenceFields) ? t.filter((e3) => a2.cloudBackup.preferenceFields.includes(e3)) : [...t] }, experimental: { frameScheduler: o2.frameScheduler === true, frameRate: [30, 60, 90, 120, 144, 165, 240].includes(o2.frameRate) ? o2.frameRate : 120, jsModding: o2.jsModding === true, worldMapJson: o2.worldMapJson === true, plantLevelSystem: o2.plantLevelSystem === true }, dynamicPlantRegistry: a2.dynamicPlantRegistry !== false, shopExtensions: a2.shopExtensions !== false, scrollSensitivity: { enabled: a2.scrollSensitivity?.enabled !== false, wheel: f(a2.scrollSensitivity?.wheel), discreteMinIntervalMs: p(a2.scrollSensitivity?.discreteMinIntervalMs) }, hpOverlay: { showPlant: a2.hpOverlay?.showPlant === true, showZombie: a2.hpOverlay?.showZombie === true, showTomb: typeof a2.hpOverlay?.showTomb == `boolean` ? a2.hpOverlay.showTomb === true : a2.hpOverlay?.showZombie === true } };
}
function g() {
  let e2 = {}, t2 = localStorage.getItem(`gp-next-locale`);
  return t2 && (e2.locale = t2), e2;
}
function _() {
  localStorage.setItem(o, JSON.stringify(u));
}
function getSettings() {
  if (u) return d(u);
  let e2 = null;
  try {
    e2 = JSON.parse(localStorage.getItem(o) || `null`);
  } catch {
    e2 = null;
  }
  u = h({ ...l, ...e2 || {} });
  let t2 = g();
  return u.locale == null && t2.locale && (u.locale = t2.locale), _(), d(u);
}
function setSettings(e2) {
  let t2 = getSettings(), n2 = h({ ...t2, ...e2 || {}, overlayHotkey: { ...t2.overlayHotkey, ...e2?.overlayHotkey || {} }, scrollSensitivity: { ...t2.scrollSensitivity, ...e2?.scrollSensitivity || {} }, hpOverlay: { ...t2.hpOverlay, ...e2?.hpOverlay || {} }, cloudBackup: { ...t2.cloudBackup, ...e2?.cloudBackup || {} }, experimental: { ...t2.experimental || {}, ...e2?.experimental || {} }, version: s });
  return localStorage.setItem(o, JSON.stringify(n2)), u = n2, d(u);
}
function getExperimentalSettings() {
  return d(getSettings().experimental || l.experimental);
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
  isJsModdingRuntimeEnabled as a,
  setJsModdingRuntimeEnabledFromConsole as c,
  getExperimentalSettings,
  getGpNextFeatureState,
  getSettings,
  isBuiltinTranslationsEnabled as i,
  isBuiltinTranslationsEnabled,
  isJsModdingRuntimeEnabled,
  isPlantLevelSystemEnabled,
  isWorldMapJsonEnabled,
  setSettings as l,
  getGpNextFeatureState as n,
  isPlantLevelSystemEnabled as o,
  getSettings as r,
  isWorldMapJsonEnabled as s,
  setJsModdingRuntimeEnabledFromConsole,
  setSettings,
  getExperimentalSettings as t,
  a as u
};
