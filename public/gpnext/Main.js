import "./audio/Bootstrap.js";
import { isRecoverySession, renderRecoveryControl } from "./runtime/Recovery.js";
import { renderPreferenceTransfer } from "./ui/tools/PreferenceTransfer.js";
import { bindTroubleshooting } from "./ui/tools/Troubleshooting.js";
import { applyFrameRate } from "./runtime/FrameRate.js";
import { initWidescreen, renderWidescreenSettings } from "./runtime/Widescreen.js";
const __vite__mapDeps = (i2, m2 = __vite__mapDeps, d2 = m2.f || (m2.f = ["gpnext/mods/ModConfigurationStorage.js", "gpnext/platform/FileSystem.js", "gpnext/platform/Bridge.js", "gpnext/mods/FreshInstallation.js", "gpnext/mods/PackSnapshot.js", "gpnext/mods/ModConfigurationState.js", "gpnext/mods/ConfigurationModSettings.js", "gpnext/mods/ModOperationPlan.js", "gpnext/core/Logger.js", "gpnext/mods/PackInstallStore.js", "gpnext/mods/ModConfigurationState.js", "gpnext/mods/ConfigurationRecovery.js", "gpnext/mods/PackPreparation.js", "gpnext/mods/FileLoader.js", "gpnext/vendor/ModuleHelpers.js", "gpnext/mods/ModPackPreflight.js", "gpnext/mods/ModVersion.js", "gpnext/core/SettingsStore.js", "gpnext/mods/ModSaveProtection.js", "gpnext/mods/ModSaveProtection.js", "gpnext/core/SettingsStore.js", "gpnext/mods/ModSaveBackupStorage.js", "gpnext/mods/Patcher.js", "gpnext/platform/Dialog.js", "gpnext/data/DataEntityLedger.js", "gpnext/runtime/Engine.js", "gpnext/mods/Isolation.js", "gpnext/runtime/PlantLevelState.js", "gpnext/mods/RestoreUtils.js", "gpnext/ui/Translations.js", "gpnext/ui/Toast.js", "gpnext/runtime/ColdStartHost.js", "gpnext/mods/JsModLoader.js", "gpnext/core/Preload.js", "gpnext/mods/ModApi.js", "gpnext/data/EntityInspector.js", "gpnext/mods/ModControlsRegistry.js", "gpnext/mods/ModSettingsRegistry.js", "gpnext/platform/DeepLink.js", "gpnext/platform/Events.js", "gpnext/ui/tabs/Log.js", "gpnext/ui/Components.js", "gpnext/runtime/Engine.js", "gpnext/runtime/ScrollSensitivity.js", "gpnext/runtime/ScrollSensitivity.js", "gpnext/ui/tabs/Tools.js", "gpnext/ui/tabs/Settings.js", "gpnext/ui/Overlay.js", "gpnext/data/DataDrawer.js", "gpnext/ui/tabs/Pages.js", "gpnext/ui/tabs/Cloud.js", "gpnext/ui/tabs/Cloud.js", "gpnext/ui/tabs/Preferences.js", "gpnext/platform/Opener.js", "gpnext/core/ClientEdition.js", "gpnext/ui/tabs/Experimental.js", "gpnext/ui/tabs/PerformanceSection.js", "gpnext/data/DataStore.js", "gpnext/mods/FileLoader.js", "gpnext/runtime/PlantLevelState.js", "gpnext/mods/JsModEntry.js", "gpnext/runtime/WorldmapJsonPatcher.js", "gpnext/ui/tabs/Patcher.js", "gpnext/ui/tabs/Patcher.js", "gpnext/ui/tabs/Mods.js", "gpnext/ui/tabs/Mods.js", "gpnext/ui/tabs/ModManager.js", "gpnext/ui/tabs/Settings.js", "gpnext/mods/LegacyRuntimeMigration.js", "gpnext/mods/ModPackagePicker.js", "gpnext/ui/tabs/Data.js", "gpnext/platform/DiscordPresence.js", "gpnext/platform/DiscordPresence.js", "gpnext/runtime/CocosStartup.js", "gpnext/runtime/CocosStartup.js"])) => i2.map((i3) => d2[i3]);
import { r as e } from "./vendor/ModuleHelpers.js";
import { i as t, showStartupFailure } from "./runtime/CocosStartup.js";
import { t as r } from "./core/Preload.js";
import { t as i } from "./core/Logger.js";
import { isJsModdingRuntimeEnabled, setJsModdingRuntimeEnabledFromConsole, d as s, getGpNextFeatureState, isPlantLevelSystemEnabled, getSettings, isWorldMapJsonEnabled } from "./core/SettingsStore.js";
import { f, u as d } from "./runtime/Engine.js";
import { a, i as ne, n as p, r as m, t as h } from "./ui/Translations.js";
import { n as g, t as _ } from "./ui/Toast.js";
import { r as re } from "./platform/Bridge.js";
import { n as v } from "./platform/Dialog.js";
import { u as ie } from "./platform/FileSystem.js";
import { createOverlay } from "./ui/Overlay.js";
import { F as y, O as b } from "./mods/FileLoader.js";
import { t as oe } from "./core/ClientEdition.js";
import { t as x } from "./mods/Isolation.js";
import { n as S, t as C } from "./platform/Opener.js";
import { n as w } from "./mods/ModVersion.js";
import { i as se } from "./platform/Events.js";
import "./platform/DiscordPresence.js";
(function() {
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
var T = `.avif`, E = 8, ce = `.webp`;
function le(e2) {
  let t2 = e2.macro?.SUPPORT_TEXTURE_FORMATS, n2 = e2.ImageAsset?.extnames;
  if (!Array.isArray(t2) || !Array.isArray(n2)) throw Error(`Cocos image format tables are unavailable`);
  if (t2.includes(T) || t2.push(T), n2.includes(T) || n2.push(T), n2.indexOf(T) !== E) throw Error(`Cocos AVIF format index must be ${E}`);
  let r2 = [[e2.assetManager?.downloader, `_downloaders`], [e2.assetManager?.factory, `_producers`], [e2.assetManager?.parser, `_parsers`]];
  for (let [e3, t3] of r2) {
    let n3 = e3?.[t3]?.[ce];
    if (!e3?.register || typeof n3 != `function`) throw Error(`Cocos AVIF registration source is unavailable: ${t3}`);
    e3.register(T, n3);
  }
}
var D, O, k, A = false;
function ue() {
  return O || null;
}
var de = { async beforeEngineImport() {
  if (isRecoverySession() || !globalThis.window?.__TAURI_INTERNALS__) return;
  let { createConfigurationStorage: e2 } = await r(async () => {
    let { createConfigurationStorage: e3 } = await import("./mods/ModConfigurationStorage.js");
    return { createConfigurationStorage: e3 };
  }, __vite__mapDeps([0, 1, 2])), t2 = e2(), n2 = await t2.read();
  if (n2 === null) {
    let [{ initializeFreshPlatform: e3 }, { createPackInstallStore: i3 }] = await Promise.all([r(() => import("./mods/FreshInstallation.js"), __vite__mapDeps([3, 1, 2, 4, 5, 6, 7, 8])), r(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([9, 1, 2, 4]))]);
    if (n2 = await e3({ storage: t2, installStore: i3() }), n2 === null) return;
  }
  let { createConfigurationState: i2 } = await r(async () => {
    let { createConfigurationState: e3 } = await import("./mods/ModConfigurationState.js");
    return { createConfigurationState: e3 };
  }, __vite__mapDeps([10, 5, 6, 7, 8]));
  D = i2({ storage: t2 });
  let a2 = await D.load();
  if (a2.recovery?.required) {
    let e3 = Error(`Previous mod startup requires recovery`);
    throw e3.recoveryAction = async ({ restoreSave: e4 = false } = {}) => {
      let [{ recoverLastActiveConfiguration: t3 }, { createPackInstallStore: n3 }, { createNativeSaveBoundary: i3 }, { isJsModdingRuntimeEnabled: a3 }, { createNativeSaveBackupStorage: o2 }] = await Promise.all([r(() => import("./mods/ConfigurationRecovery.js"), __vite__mapDeps([11, 12, 13, 14, 1, 2, 4, 8, 7, 15, 16, 17, 18])), r(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([9, 1, 2, 4])), r(() => import("./mods/ModSaveProtection.js"), __vite__mapDeps([19, 18])), r(() => import("./core/SettingsStore.js"), __vite__mapDeps([20, 17])), r(() => import("./mods/ModSaveBackupStorage.js"), __vite__mapDeps([21, 1, 2, 18]))]), s2 = o2();
      return t3({ configurationState: D, installStore: n3(), saveBoundary: i3({ storage: window.localStorage, backups: s2 }), backups: s2, restoreSave: e4, isFresh: () => !A && !O, assertCandidateAllowed(e5) {
        if (e5.packs.some((e6) => e6.enabled !== false && e6.meta.js) && !a3()) throw Error(`JavaScript modding is disabled for this session`);
      } });
    }, e3.hasSaveBackup = !!a2.recovery.failedTarget.backupId, e3;
  }
  A = true;
}, async afterProject({ cc: e2, signal: t2 }) {
  if (!D) return;
  let [{ CorePatcher: n2 }, { createPackInstallStore: i2 }, { createNativeSaveBackupStorage: a2 }, { createNativeSaveBoundary: o2 }, { prepareColdStartHost: s2 }] = await Promise.all([r(() => import("./mods/Patcher.js"), __vite__mapDeps([22, 14, 1, 2, 23, 13, 4, 8, 12, 7, 15, 16, 17, 24, 25, 26, 27, 28, 29, 30])), r(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([9, 1, 2, 4])), r(() => import("./mods/ModSaveBackupStorage.js"), __vite__mapDeps([21, 1, 2, 18])), r(() => import("./mods/ModSaveProtection.js"), __vite__mapDeps([19, 18])), r(() => import("./runtime/ColdStartHost.js"), __vite__mapDeps([31, 14, 4, 13, 1, 2, 8, 12, 7, 15, 16, 17, 6, 24, 25, 32, 33, 34, 35, 36, 18, 37, 30]))]);
  t2.throwIfAborted();
  let c2 = a2();
  O = await s2({ configurationState: D, installStore: i2(), backups: c2, saveBoundary: o2({ storage: window.localStorage, backups: c2 }), patcher: new n2(), cc: e2, signal: t2 });
}, async beforeRun() {
  O && await O.publish();
} };
async function j(e2) {
  if (k) return k;
  if (k = e2, O && O.getPhase() !== `active` && O.getPhase() !== `failed-restart-required`) try {
    await O.fail(e2);
  } catch (e3) {
    k = e3;
  }
  let t2 = A ? D?.getState() : null;
  if (t2?.recovery?.required && (k.recoveryRequiresRestart = true), t2 && !t2.journal && !t2.recovery?.required && !O) {
    let { revision: e3, ...n2 } = t2.active.configuration, { revision: i2, ...a2 } = t2.desired;
    JSON.stringify(n2) !== JSON.stringify(a2) && (k.recoveryAction = async () => {
      let [{ restoreLastActiveSelection: e4 }, { createPackInstallStore: t3 }, { isJsModdingRuntimeEnabled: n3 }] = await Promise.all([r(() => import("./mods/ConfigurationRecovery.js"), __vite__mapDeps([11, 12, 13, 14, 1, 2, 4, 8, 7, 15, 16, 17, 18])), r(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([9, 1, 2, 4])), r(() => import("./core/SettingsStore.js"), __vite__mapDeps([20, 17]))]);
      return e4({ configurationState: D, installStore: t3(), assertCandidateAllowed(e5) {
        if (e5.packs.some((e6) => e6.enabled !== false && e6.meta.js) && !n3()) throw Error(`JavaScript modding is disabled for this session`);
      } });
    });
  }
  return k;
}
async function fe() {
  try {
    let e2 = document.getElementById(`GameCanvas`);
    if (!e2?.parentElement) throw Error(`GameCanvas or its parent was not found`);
    let n2 = e2.parentElement.getBoundingClientRect();
    e2.width = n2.width, e2.height = n2.height, await t({ phases: de, importEngine: () => window.System.import(`cc`), configureEngine: le, initOptions: (e3) => ({ debugMode: e3.DebugMode.ERROR, settingsPath: `src/settings.json`, overrideSettings: { profiling: { showFPS: false } } }) });
  } catch (e2) {
    showStartupFailure(await j(e2));
  }
}
fe();
var pe = false;
function me() {
  if (pe) return;
  pe = true;
  let e2 = HTMLElement.prototype.click;
  HTMLElement.prototype.click = function() {
    if (this instanceof HTMLAnchorElement && this.hasAttribute(`download`) && this.href) {
      let e3 = this.getAttribute(`download`) || `download`, t2 = this.href;
      if (t2.startsWith(`blob:`)) {
        (async () => {
          try {
            g(a(`toast.saving`, e3), ``, 4e3);
            let n2 = await v({ defaultPath: e3, filters: [{ name: `File`, extensions: [e3.includes(`.`) ? e3.split(`.`).pop() : `*`] }] });
            n2 && (await ie(n2, await (await fetch(t2)).text()), g(a(`toast.saved`, e3), `success`));
          } catch (t3) {
            console.error(`[GP Next] Download intercept failed:`, t3), g(a(`toast.saveFailed`, e3), `error`);
          }
        })();
        return;
      }
      g(a(`toast.downloading`, e3), ``);
    }
    return e2.call(this);
  };
}
function he({ patcher: e2, before: t2, after: n2, persist: r2 }) {
  let i2 = Promise.resolve();
  return (a2 = `manual-reload`, o2) => {
    let s2 = o2 === void 0 ? void 0 : structuredClone(o2), c2 = i2.then(async () => {
      let i3 = await e2.prepare(s2);
      if (!i3.ready) throw Object.assign(Error(i3.errors.map((e3) => `${e3.dir}: ${e3.message}`).join(`
`)), { code: `PACK_PREFLIGHT_FAILED`, errors: i3.errors });
      await t2(a2);
      let o3 = await e2.consumePrepared(i3, { reload: true });
      if (await n2(o3, a2), s2 !== void 0 && await r2(s2) !== true) throw Object.assign(Error(`Applied package selection could not be saved`), { code: `PACK_SELECTION_WRITE_FAILED` });
      return o3;
    });
    return i2 = c2.catch(() => {
    }), c2;
  };
}
var ge = e(b(), 1), _e = new i(`daily-level`), ve = new URL(`daily/current.json`, `https://daily-level-api.pvzge.com/api/v1/`).toString(), ye = `https://daily-level-api.pvzge.com`, be = `chunks:///_virtual/KeyListener.ts`, xe = `chunks:///_virtual/levelController.ts`, Se = /* @__PURE__ */ new Set([`preSplashScene`, `splashScene`]), Ce = /* @__PURE__ */ new Set([`inGameScene`, `arcadePlantDecoding`]), we = /* @__PURE__ */ new Set([`mainScene`, `worldMapScene`, `storeScene`, `zenGardenScene`, `almanacScene`]), Te = false, M = false, N = false, P = null, F = { state: `idle`, lastUrl: ``, lastError: ``, pending: false };
function Ee() {
  return typeof window < `u` && (window.__TAURI_INTERNALS__ || window.__TAURI__);
}
function I(e2) {
  F = { ...F, ...e2, pending: !!P };
}
function De(e2) {
  return Array.isArray(e2) ? e2.map(String).filter(Boolean) : e2 == null ? [] : [String(e2)].filter(Boolean);
}
function Oe(e2) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e2 || ``)) return null;
  let t2 = /* @__PURE__ */ new Date(`${e2}T00:00:00.000Z`);
  return Number.isNaN(t2.getTime()) ? null : t2.toISOString().slice(0, 10) === e2 ? e2 : null;
}
function ke(e2) {
  let t2;
  try {
    t2 = new URL(String(e2 || ``));
  } catch {
    return { ok: false, reason: `bad-url` };
  }
  let n2 = t2.pathname.replace(/\/+$/, ``), r2 = Oe(t2.searchParams.get(`date`) || ``), i2 = Number(t2.searchParams.get(`slot`)), a2 = t2.searchParams.get(`slug`) || ``;
  return t2.protocol === `pvzge:` ? t2.hostname === `daily-level` ? n2 === `/open` ? r2 ? !Number.isInteger(i2) || i2 < 0 ? { ok: false, reason: `slot` } : /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a2) ? { ok: true, rawUrl: String(e2), date: r2, slot: i2, slug: a2 } : { ok: false, reason: `slug` } : { ok: false, reason: `date` } : { ok: false, reason: `path` } : { ok: false, reason: `host` } : { ok: false, reason: `scheme` };
}
function Ae(e2) {
  P = e2, I({ state: `queued`, lastUrl: e2.rawUrl, lastError: `` });
}
function L() {
  let e2 = d();
  return e2 ? e2 === `inGameScene` ? { ok: false, waitable: false, reason: `in-game` } : Ce.has(e2) ? { ok: false, waitable: false, reason: `blocked-scene`, sceneName: e2 } : we.has(e2) ? { ok: true, sceneName: e2 } : Se.has(e2) ? { ok: false, waitable: true, reason: `startup`, sceneName: e2 } : { ok: false, waitable: false, reason: `unsupported-scene`, sceneName: e2 } : { ok: false, waitable: true, reason: `unknown` };
}
async function je(e2 = 15e3) {
  let t2 = Date.now();
  for (; Date.now() - t2 < e2; ) {
    let e3 = L();
    if (e3.ok || !e3.waitable) return e3;
    await new Promise((e4) => setTimeout(e4, 250));
  }
  return L();
}
async function Me(e2 = 1e4) {
  let t2 = Date.now();
  for (; Date.now() - t2 < e2; ) {
    let e3 = f(be, `KeyListener`), t3 = f(xe, `LevelPlay`);
    if (e3?.darken && e3?.GoToGame && t3) return { KeyListener: e3, LevelPlay: t3 };
    await new Promise((e4) => setTimeout(e4, 200));
  }
  throw Error(`Daily Level runtime exports are unavailable`);
}
async function Ne(e2) {
  let t2 = await fetch(e2, { cache: `no-store` });
  if (!t2.ok) throw Error(`${t2.status} ${t2.statusText}`);
  return ge.default.parse(await t2.text());
}
function Pe(e2, t2) {
  let n2 = e2?.daily, r2 = n2?.level;
  return !n2 || !r2 ? false : n2.date === t2.date && Number(n2.slot) === t2.slot && r2.slug === t2.slug;
}
function Fe(e2, t2) {
  let n2 = new URL(String(e2?.rawUrl || ``), `${ye}/`), r2 = `/levels/${t2}/`;
  if (n2.origin !== ye || !n2.pathname.startsWith(r2)) throw Error(`Daily Level raw URL is outside the API level path`);
  return n2.toString();
}
function Ie(e2, t2) {
  let n2 = e2?.objects;
  if (!Array.isArray(n2) || n2.length === 0) throw Error(`Daily Level JSON has no objects array`);
  if (!n2.some((e3) => e3?.objclass === `LevelDefinition`)) throw Error(`Daily Level JSON has no LevelDefinition`);
  if (typeof t2?.getLevelDefinition == `function` && !t2.getLevelDefinition(n2)?.objdata) throw Error(`Daily Level definition cannot be resolved`);
  return n2;
}
function Le(e2) {
  if (e2.reason === `in-game`) {
    g(a(`dailyLevel.exitCurrentLevel`), `warning`);
    return;
  }
  g(a(`dailyLevel.sceneUnavailable`), `warning`);
}
async function Re(e2, t2) {
  let { KeyListener: n2, LevelPlay: r2 } = t2;
  r2.levelData = e2, r2.thisLevelsID = [], r2.nextLevelsID = [], await n2.darken(), r2.thisLevelsID = [], await n2.GoToGame([r2.levelData]);
}
async function ze(e2) {
  I({ state: `validating`, lastUrl: e2.rawUrl, lastError: `` });
  let t2 = await je();
  if (!t2.ok) return I({ state: `blocked`, lastError: t2.reason }), Le(t2), { ok: false, reason: t2.reason };
  let n2 = await Ne(ve);
  if (!Pe(n2, e2)) return I({ state: `stale`, lastError: `daily-level-refreshed` }), g(a(`dailyLevel.refreshed`), `warning`), { ok: false, reason: `daily-level-refreshed` };
  let r2 = await Me(), i2 = Ie(await Ne(Fe(n2.daily.level, e2.slug)), r2.LevelPlay), a2 = L();
  return a2.ok ? (I({ state: `launching`, lastError: `` }), g(a(`dailyLevel.opening`)), await Re(i2, r2), I({ state: `launched`, lastError: `` }), { ok: true }) : (I({ state: `blocked`, lastError: a2.reason }), Le(a2), { ok: false, reason: a2.reason });
}
async function R() {
  if (N || !M || !P) return;
  let e2 = P;
  P = null, N = true;
  try {
    await ze(e2);
  } catch (e3) {
    I({ state: `failed`, lastError: e3 instanceof Error ? e3.message : String(e3) }), _e.error(`Daily Level deep link failed: ` + e3), g(a(`dailyLevel.loadFailed`), `error`);
  } finally {
    N = false, P && R();
  }
}
async function Be() {
  if (!Te) {
    if (Te = true, !Ee()) {
      I({ state: `unavailable`, lastError: `tauri-runtime-unavailable` });
      return;
    }
    try {
      let e2 = await r(() => import("./platform/DeepLink.js"), __vite__mapDeps([38, 2, 39])), t2 = await e2.getCurrent();
      for (let e3 of De(t2)) await z(e3);
      await e2.onOpenUrl(async (e3) => {
        for (let t3 of De(e3)) await z(t3);
      }), I({ state: `listening`, lastError: `` });
    } catch (e2) {
      I({ state: `failed`, lastError: e2 instanceof Error ? e2.message : String(e2) }), _e.warn(`Daily Level deep-link listener unavailable: ` + e2);
    }
  }
}
async function z(e2) {
  let t2 = ke(e2);
  return t2.ok ? M ? (Ae(t2), await R(), { ok: true }) : (Ae(t2), { ok: true, queued: true }) : (I({ state: `ignored`, lastUrl: String(e2 || ``), lastError: t2.reason }), { ok: false, reason: t2.reason });
}
function Ve() {
  M = true, R();
}
function He() {
  return { ...F };
}
var B = new i(`update-checker`), Ue = `https://pvzge.com/jsons/gp-next-info.json`, We = 8e3, V = [], H = null, Ge = false, U = { status: `idle`, currentVersion: y, latestVersion: ``, checkedAt: 0, error: `` };
function Ke() {
  let e2 = G();
  for (let t2 of V.slice()) try {
    t2(e2);
  } catch {
  }
}
function W(e2) {
  U = { ...U, ...e2 }, Ke();
}
function G() {
  return { ...U };
}
function qe(e2) {
  return typeof e2 == `function` ? (V.push(e2), e2(G()), () => {
    let t2 = V.indexOf(e2);
    t2 !== -1 && V.splice(t2, 1);
  }) : () => {
  };
}
function Je(e2 = h()) {
  return p(`download`, e2);
}
async function Ye() {
  let e2 = Je();
  try {
    return await S(e2), true;
  } catch (t2) {
    B.warn(`Failed to open external browser via Tauri opener: ${t2}`);
    try {
      if (window.electron?.shell?.openExternal) return await window.electron.shell.openExternal(e2), true;
    } catch (e3) {
      B.warn(`Fallback opener failed: ${e3}`);
    }
    return window.open(e2, `_blank`, `noopener,noreferrer`), true;
  }
}
async function Xe(e2 = {}) {
  let t2 = e2.manual === true;
  if (H) return H;
  W({ status: `checking`, error: `` });
  let n2 = (async () => {
    let e3 = new AbortController(), n3 = setTimeout(() => e3.abort(), We);
    try {
      let n4 = await fetch(`${Ue}?t=${Date.now()}`, { cache: `no-store`, signal: e3.signal });
      if (!n4.ok) throw Error(`HTTP ${n4.status}`);
      let r2 = await n4.json(), i2 = String(r2?.version || ``).trim();
      if (!i2) throw Error(`Missing version field`);
      let a2 = w(i2, y) > 0;
      return W({ status: a2 ? `update-available` : `up-to-date`, latestVersion: i2, checkedAt: Date.now(), error: `` }), a2 ? (!Ge || t2) && (g(a(`toast.updateAvailable`, i2), ``, 5e3), Ge = true) : t2 && g(a(`toast.updateUpToDate`, y), `success`), B.info(`Update check complete: local=${y}, latest=${i2}, newer=${a2}`), G();
    } catch (e4) {
      let n4 = e4?.name === `AbortError` ? `timeout` : String(e4?.message || e4);
      return W({ status: `error`, checkedAt: Date.now(), error: n4 }), B.warn(`Update check failed: ${n4}`), t2 && g(a(`toast.updateCheckFailed`), `error`), G();
    } finally {
      clearTimeout(n3), H = null;
    }
  })();
  return H = n2, n2;
}
var K = new i(`main`), Ze = () => s(getSettings().overlayHotkey), Qe = `gp-next://menu-action`, $e = `JS modding is currently in limited rollout testing. All functionality may be removed or changed in the future. Loading custom JS scripts may affect game runtime logic and save data, and may create security risks. Only obtain JS mod packages from trusted sources, and inspect script contents before enabling them.`, q = { toggleOverlay: `gpn-menu-toggle-overlay`, reloadPatches: `gpn-menu-reload-patches`, openPatchFolder: `gpn-menu-open-patch-folder`, reloadGame: `gpn-menu-reload-game`, checkUpdates: `gpn-menu-check-updates`, openGpNextGuide: `gpn-menu-open-gp-next-guide`, openDownload: `gpn-menu-open-download`, openWebsite: `gpn-menu-open-website`, openDiscord: `gpn-menu-open-discord` }, et = ``;
K.info(`GP-Next loading...`);
var J = getSettings();
_(), Be().catch((e2) => K.debug(`Daily Level deep-link listener skipped: ` + e2)), me();
var Y = createOverlay();
Y.setVersion(y), Y.setHotkey(J.overlayHotkey), Y.bindUpdateActions({ onCheck: () => Xe({ manual: true }), onOpen: () => Ye() }), qe((e2) => Y.setUpdateState(e2)), Y.updateStatus(a(`header.status.waiting`)), Xe().catch((e2) => K.debug(`Startup update check skipped: ` + e2));
function X(e2) {
  e2 && (e2.editsCount > 0 ? Y.updateStatusKey(`header.status.compactWithEdits`, e2.packs.length, e2.loaded.length, e2.editsCount) : Y.updateStatusKey(`header.status.compact`, e2.packs.length, e2.loaded.length));
}
function tt() {
  return typeof window < `u` && (window.__TAURI_INTERNALS__ || window.__TAURI__);
}
function nt() {
  return p();
}
function rt() {
  return p(`guide/mod`);
}
function it() {
  let e2 = String(et || ``).replace(/[\\/]+$/, ``);
  return e2 ? `${e2}/gp-next` : ``;
}
function at() {
  return { app: a(`menu.app`), about: a(`menu.about`), services: a(`menu.services`), hide: a(`menu.hide`), hideOthers: a(`menu.hideOthers`), showAll: a(`menu.showAll`), quit: a(`menu.quit`), file: a(`menu.file`), closeWindow: a(`menu.closeWindow`), edit: a(`menu.edit`), undo: a(`menu.undo`), redo: a(`menu.redo`), cut: a(`menu.cut`), copy: a(`menu.copy`), paste: a(`menu.paste`), selectAll: a(`menu.selectAll`), gpNext: a(`menu.gpNext`), toggleOverlay: a(`menu.toggleOverlay`), reloadPatches: a(`menu.reloadPatches`), openPatchFolder: a(`menu.openPatchFolder`), reloadGame: a(`menu.reloadGame`), checkUpdates: a(`menu.checkUpdates`), openGpNextGuide: a(`menu.openGpNextGuide`), window: a(`menu.window`), minimize: a(`menu.minimize`), zoom: a(`menu.zoom`), bringAllToFront: a(`menu.bringAllToFront`), help: a(`menu.help`), website: a(`menu.website`), downloadPage: a(`menu.downloadPage`), discord: a(`menu.discord`) };
}
async function ot() {
  if (tt()) try {
    await re(`update_macos_menu`, { labels: at() });
  } catch (e2) {
    K.debug(`macOS menu update skipped: ` + e2);
  }
}
async function st(e2) {
  switch (e2) {
    case q.toggleOverlay:
      Y.toggle();
      break;
    case q.reloadPatches:
      if (typeof window.gpNext?.reload != `function`) {
        g(a(`common.loading`));
        return;
      }
      try {
        X(await window.gpNext.reload()), g(a(`toast.patchReloaded`));
      } catch (e3) {
        K.error(`Menu reload failed: ` + e3), g(a(`common.failed`));
      }
      break;
    case q.openPatchFolder: {
      let e3 = it();
      if (!e3) {
        g(a(`common.loading`));
        return;
      }
      try {
        await C(e3);
      } catch (e4) {
        g(`${a(`common.failed`)}: ${String(e4)}`, `error`);
      }
      break;
    }
    case q.reloadGame:
      window.location.reload();
      break;
    case q.checkUpdates:
      await Xe({ manual: true });
      break;
    case q.openGpNextGuide:
      await S(rt());
      break;
    case q.openDownload:
      await Ye();
      break;
    case q.openWebsite:
      await S(nt());
      break;
    case q.openDiscord:
      await S(`https://discord.gg/ZEfb2tBQFW`);
      break;
  }
}
function ct() {
  tt() && (ot(), m(() => {
    ot();
  }), se(Qe, (e2) => {
    st(e2.payload).catch((e3) => {
      K.debug(`macOS menu action failed: ` + e3);
    });
  }).catch((e2) => {
    K.debug(`macOS menu listener skipped: ` + e2);
  }));
}
var Z = [{ id: `patcher`, labelKey: `tab.mods`, searchKeys: [`patcher.packs`, `patcher.disabledPacks`, `patcher.singleFile`, `patcher.openDir`, `migration.prepare`, `settings.modSettings`, `sections.modRuntime`, `installation.folder`, `installation.zip`] }, { id: `data`, labelKey: `tab.data`, searchKeys: [`data.title`, `data.searchPlaceholder`, `data.entries`, `data.exportCurrent`, `data.drawer.comparison`, `data.drawer.edit`, `data.drawer.restoreAll`] }, { id: `cheats`, labelKey: `sections.tools`, searchKeys: [`cheats.title`, `cheats.sun`, `cheats.gameSpeed`, `cheats.freePlant`, `cheats.invincible`, `cheats.instantWin`, `cloud.title`, `dailyLevel.opening`, `guide.uuidSectionTitle`, `guide.docs`, `tools.troubleshooting`] }, { id: `settings`, labelKey: `tab.settings`, searchKeys: [`settings.widescreen`, `settings.widescreenFog`, `settings.widescreenBushes`, `settings.general`, `settings.language`, `settings.overlayHotkey`, `settings.scrollSensitivity`, `settings.frameRate`, `settings.debugMode`, `settings.runtimeExtensions`, `settings.dynamicPlantRegistry`, `settings.shopExtensions`, `settings.hpOverlay`, `settings.appearance`, `settings.blurBackground`, `settings.accentColor`, `settings.accentTint`, `settings.panelOpacity`, `settings.cornerRadius`, `settings.compactLayout`, `settings.reduceMotion`, `experimental.title`, `experimental.jsModding`, `experimental.worldMapJson`, `experimental.plantLevelSystem`, `settings.transfer`] }, { id: `performance`, labelKey: `tab.performance`, searchKeys: [`performance.avgFps`, `performance.frameP95`, `performance.frameP99Value`, `performance.webgl`, `performance.nativeMetrics`, `performance.assetCount`, `performance.runtimeTargetFps`] }, { id: `log`, labelKey: `tab.log`, searchKeys: [`log.search`, `log.filterAll`, `log.exportDiagnostics`, `log.copyAll`] }, { id: `about`, labelKey: `tab.about`, searchKeys: [`about.patcherVersion`, `about.clientEdition`, `about.features`, `guide.docs`] }];
for (let e2 of Z) Y.registerTab({ id: e2.id, labelKey: e2.labelKey, searchKeys: e2.searchKeys, render(e3) {
  let t2 = document.createElement(`div`);
  t2.className = `gp-text-muted`, t2.textContent = a(`common.loading`), e3.appendChild(t2);
} });
var lt = /* @__PURE__ */ new Set();
function ut(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.className = `gp-text-muted`, n2.textContent = `${a(`common.failed`)}: ${String(t2?.message || t2)}`, e2.appendChild(n2);
}
async function Q(e2, t2) {
  let n2 = await x(`Tab '${e2.id}' initialization`, t2, { logger: K });
  return n2.ok ? Y.registerTab({ id: e2.id, labelKey: e2.labelKey, searchKeys: e2.searchKeys, ...n2.value }) : Y.registerTab({ id: e2.id, labelKey: e2.labelKey, searchKeys: e2.searchKeys, render: (e3) => ut(e3, n2.error) }), lt.add(e2.id), n2;
}
function dt(e2) {
  for (let t2 of Z) lt.has(t2.id) || (Y.registerTab({ id: t2.id, labelKey: t2.labelKey, searchKeys: t2.searchKeys, render: (t3) => ut(t3, e2) }), lt.add(t2.id));
}
var ft = Q(Z.find((e2) => e2.id === `about`), async () => ({ render: (await import("./ui/tabs/About.js")).render }));
Q(Z.find((e2) => e2.id === `log`), async () => {
  let e2 = await r(() => import("./ui/tabs/Log.js"), __vite__mapDeps([40, 1, 2, 23, 41, 29, 25, 14, 8, 17, 30]));
  return { render: e2.render, onActivate: e2.onActivate, onDeactivate: e2.onDeactivate };
});
window.gpNext = { version: y, clientEdition: oe, debug: J.debug === true, toggle: Y.toggle, show: Y.show, hide: Y.hide, dailyLevel: { openFromUrl: z, status: He } }, ct(), K.info(`Phase 1 complete \u2014 overlay mounted. Press ${Ze()} to toggle.`);
initWidescreen();
var $ = `phase-2:engine-import`;
(async () => {
  let { waitForEngine: e2 } = await r(async () => {
    let { waitForEngine: e3 } = await import("./runtime/Engine.js");
    return { waitForEngine: e3 };
  }, __vite__mapDeps([42, 25, 14, 8])), t2;
  $ = `phase-2:engine-wait`;
  try {
    t2 = await e2(3e4, { continueAfterTimeout: true });
  } catch (e3) {
    Y.updateStatus(a(`header.status.timeout`)), K.error(`Engine wait failed \u2014 patcher features unavailable: ` + e3), dt(e3);
    return;
  }
  $ = `phase-2:runtime-setup`, Y.updateStatus(a(`header.status.engineReady`)), ne(), ot(), Ve();
  applyFrameRate(t2.game, J.frameRate);
  await x(`Scroll sensitivity initialization`, async () => (await r(() => import("./runtime/ScrollSensitivity.js"), __vite__mapDeps([43, 44, 25, 14, 8, 17]))).install(), { logger: K });
  let i2 = null;
  $ = `phase-2:independent-tabs`, await ft, await Promise.all([Q(Z.find((e3) => e3.id === `cheats`), async () => {
    let [e3, t3] = await Promise.all([r(() => import("./ui/tabs/Tools.js"), __vite__mapDeps([45, 25, 14, 8, 46, 35, 37, 1, 2, 13, 4, 44, 17, 41, 47, 48, 29, 30, 49, 50])), r(() => import("./ui/tabs/Cloud.js"), __vite__mapDeps([51, 50, 41, 29, 25, 14, 8, 17, 30]))]);
    return i2 = t3.bindCloudSaver, e3.createToolsTab();
  }), Q(Z.find((e3) => e3.id === `settings`), async () => {
    const exp = await r(() => import("./ui/tabs/Experimental.js"), __vite__mapDeps([55, 17, 41, 29, 25, 14, 8]));
    const settingsUi = await import("./ui/tabs/Settings.js");
    return { render(e3) {
      const mk = (title) => {
        const section = document.createElement(`div`);
        section.className = `gp-section`;
        const button = document.createElement(`button`);
        button.type = `button`, button.className = `gp-section-title`, button.setAttribute(`aria-expanded`, `true`);
        const arrow = document.createElement(`span`);
        arrow.className = `gp-section-arrow`, arrow.textContent = `\u25BC`;
        const label = document.createElement(`span`);
        label.textContent = title, button.append(arrow, label);
        button.addEventListener(`click`, () => {
          section.classList.toggle(`gp-collapsed`), button.setAttribute(`aria-expanded`, String(!section.classList.contains(`gp-collapsed`)));
        });
        const body = document.createElement(`div`);
        body.className = `gp-section-body`, section.append(button, body), e3.appendChild(section);
        return body;
      };
      const appearance = mk(a(`settings.appearance`));
      appearance.innerHTML = `<div class="gp-appearance-controls"><label class="gp-appearance-toggle"><input type="checkbox" id="gpnBlur"><span><strong>${a(`settings.blurBackground`)}</strong><small>${a(`settings.blurBackgroundDesc`)}</small></span></label><label class="gp-appearance-toggle"><input type="checkbox" id="gpnCompact"><span><strong>${a(`settings.compactLayout`)}</strong><small>${a(`settings.compactLayoutDesc`)}</small></span></label><label class="gp-appearance-toggle"><input type="checkbox" id="gpnReduceMotion"><span><strong>${a(`settings.reduceMotion`)}</strong><small>${a(`settings.reduceMotionDesc`)}</small></span></label><label class="gp-appearance-color-row" for="gpnAccent"><span class="gp-appearance-color-copy"><strong>${a(`settings.accentColor`)}</strong><small>${a(`settings.accentColorDesc`)}</small><code id="gpnAccentValue"></code></span><input type="color" id="gpnAccent" value="#4a9eff" aria-label="${a(`settings.accentColor`)}"></label><div id="gpnAppearanceRanges"></div></div>`;
      const storageKey = `gpnext-ui`;
      const ui = { blur: true, accent: [74, 158, 255], tint: 24, opacity: 92, radius: 11, compact: false, reduceMotion: false };
      try {
        const saved = JSON.parse(localStorage.getItem(storageKey) || `{}`);
        if (saved && typeof saved === `object`) {
          for (const key of [`blur`, `compact`, `reduceMotion`]) if (key in saved) ui[key] = saved[key] === true;
          if (Array.isArray(saved.accent) && saved.accent.length === 3 && saved.accent.every((value) => Number.isFinite(Number(value)))) ui.accent = saved.accent.map((value) => Math.max(0, Math.min(255, Number(value))));
          if (Number.isFinite(Number(saved.tint))) ui.tint = Math.max(0, Math.min(45, Number(saved.tint)));
          if (Number.isFinite(Number(saved.opacity))) ui.opacity = Math.max(70, Math.min(100, Number(saved.opacity)));
          if (Number.isFinite(Number(saved.radius))) ui.radius = Math.max(6, Math.min(18, Number(saved.radius)));
        }
      } catch {
      }
      const apply = () => {
        let style = document.getElementById(`gpnext-ui-overrides`);
        if (!style) {
          style = document.createElement(`style`), style.id = `gpnext-ui-overrides`, document.head.appendChild(style);
        }
        const blend = (base) => base.map((channel, index) => Math.round(channel * (1 - ui.tint / 100) + ui.accent[index] * (ui.tint / 100))).join(`,`);
        const [red, green, blue] = ui.accent;
        style.textContent = `:root{--gp-accent-rgb:${red},${green},${blue};--gp-panel-rgb:${blend([5, 9, 21])};--gp-surface-rgb:${blend([13, 20, 36])};--gp-raised-rgb:${blend([21, 30, 48])};--gp-control-rgb:${blend([4, 8, 19])}}#gp-overlay{--gp-accent-rgb:${red},${green},${blue};--gp-panel-rgb:${blend([5, 9, 21])};--gp-surface-rgb:${blend([13, 20, 36])};--gp-raised-rgb:${blend([21, 30, 48])};--gp-control-rgb:${blend([4, 8, 19])};--gp-overlay-opacity:${ui.opacity / 100};--gp-surface-opacity:${(ui.opacity / 100 * 0.82).toFixed(2)};--gp-raised-opacity:${(ui.opacity / 100 * 0.92).toFixed(2)};--gp-card-opacity:${(ui.opacity / 100 * 0.44).toFixed(2)};--gp-ui-radius:${ui.radius}px;background:linear-gradient(135deg,rgba(${red},${green},${blue},.16),transparent 72%),rgba(var(--gp-panel-rgb),var(--gp-overlay-opacity))}` + (ui.blur ? `` : `#gp-overlay{backdrop-filter:none !important;-webkit-backdrop-filter:none !important}`) + (ui.compact ? `#gp-overlay.gp-compact-ui .gp-content{padding:10px}#gp-overlay.gp-compact-ui .gp-section{padding:9px}#gp-overlay.gp-compact-ui .gp-section-body{gap:5px}#gp-overlay.gp-compact-ui .gp-list-item{padding:8px}#gp-overlay.gp-compact-ui .gp-appearance-toggle,#gp-overlay.gp-compact-ui .gp-appearance-color-row{padding:9px}` : ``) + (ui.reduceMotion ? `#gp-overlay.gp-reduce-motion *,#gp-overlay.gp-reduce-motion *::before,#gp-overlay.gp-reduce-motion *::after{scroll-behavior:auto !important;animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}` : ``);
        document.getElementById(`gp-overlay`)?.classList.toggle(`gp-compact-ui`, ui.compact);
        document.getElementById(`gp-overlay`)?.classList.toggle(`gp-reduce-motion`, ui.reduceMotion);
        document.body.classList.toggle(`gpn-noblur`, !ui.blur);
        try {
          localStorage.setItem(storageKey, JSON.stringify(ui));
        } catch {
        }
      };
      const blurToggle = appearance.querySelector(`#gpnBlur`);
      const compactToggle = appearance.querySelector(`#gpnCompact`);
      const motionToggle = appearance.querySelector(`#gpnReduceMotion`);
      const colorPicker = appearance.querySelector(`#gpnAccent`);
      const colorValue = appearance.querySelector(`#gpnAccentValue`);
      blurToggle.checked = ui.blur, compactToggle.checked = ui.compact, motionToggle.checked = ui.reduceMotion;
      const updateColor = () => {
        const hex = colorPicker.value;
        ui.accent = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
        colorValue.textContent = hex.toUpperCase(), apply();
      };
      colorPicker.value = `#${ui.accent.map((channel) => channel.toString(16).padStart(2, `0`)).join(``)}`, colorValue.textContent = colorPicker.value.toUpperCase();
      blurToggle.addEventListener(`change`, () => {
        ui.blur = blurToggle.checked, apply();
      });
      compactToggle.addEventListener(`change`, () => {
        ui.compact = compactToggle.checked, apply();
      });
      motionToggle.addEventListener(`change`, () => {
        ui.reduceMotion = motionToggle.checked, apply();
      });
      colorPicker.addEventListener(`input`, updateColor);
      const ranges = appearance.querySelector(`#gpnAppearanceRanges`);
      const addRange = (key, titleKey, descriptionKey, min, max, suffix) => {
        const row = document.createElement(`label`), copy = document.createElement(`span`), title = document.createElement(`strong`), description = document.createElement(`small`), value = document.createElement(`output`), input = document.createElement(`input`);
        row.className = `gp-appearance-range`, copy.className = `gp-appearance-color-copy`, title.textContent = a(titleKey), description.textContent = a(descriptionKey), value.textContent = `${ui[key]}${suffix}`;
        input.type = `range`, input.min = String(min), input.max = String(max), input.step = `1`, input.value = String(ui[key]), input.setAttribute(`aria-label`, a(titleKey));
        input.addEventListener(`input`, () => {
          ui[key] = Number(input.value), value.textContent = `${ui[key]}${suffix}`, apply();
        });
        copy.append(title, description, value), row.append(copy, input), ranges.appendChild(row);
      };
      addRange(`tint`, `settings.accentTint`, `settings.accentTintDesc`, 0, 45, `%`);
      addRange(`opacity`, `settings.panelOpacity`, `settings.panelOpacityDesc`, 70, 100, `%`);
      addRange(`radius`, `settings.cornerRadius`, `settings.cornerRadiusDesc`, 6, 18, `px`);
      apply();
      renderPreferenceTransfer(mk("Import / export preferences"));
      settingsUi.renderGeneralSettings(mk(a(`settings.general`)));
      const gameplay = mk(a(`settings.gameplay`));
      settingsUi.renderFrameRate(gameplay);
      renderWidescreenSettings(mk(a(`settings.widescreen`)));
      settingsUi.renderHealthOverlay(mk(a(`settings.hpOverlay`)));
      exp.render(mk(a(`experimental.title`)));
    } };
  }), Q(Z.find((e3) => e3.id === `performance`), async () => (await r(() => import("./ui/tabs/PerformanceSection.js"), __vite__mapDeps([56, 2, 1, 23, 13, 14, 4, 8, 25, 46, 35, 37, 44, 17, 41, 47, 48, 29, 30]))).createPerformanceTab())]), $ = `phase-3:core-imports`;
  if (isRecoverySession()) {
    Y.updateStatus("Recovery mode \xB7 temporary saves");
    for (const id of ["patcher", "data"]) await Q(Z.find((tab) => tab.id === id), async () => ({ render: renderRecoveryControl }));
    renderRecoveryControl(document.body, { floating: true });
    return;
  }
  let { CorePatcher: s2 } = await r(async () => {
    let { CorePatcher: e3 } = await import("./mods/Patcher.js");
    return { CorePatcher: e3 };
  }, __vite__mapDeps([22, 14, 1, 2, 23, 13, 4, 8, 12, 7, 15, 16, 17, 24, 25, 26, 27, 28, 29, 30])), { DataStore: l2 } = await r(async () => {
    let { DataStore: e3 } = await import("./data/DataStore.js");
    return { DataStore: e3 };
  }, __vite__mapDeps([57, 1, 2, 23, 25, 14, 8, 28, 29, 17, 30])), { getBasePath: u2 } = await r(async () => {
    let { getBasePath: e3 } = await import("./mods/FileLoader.js");
    return { getBasePath: e3 };
  }, __vite__mapDeps([58, 13, 14, 1, 2, 4, 8])), d2 = await r(() => import("./runtime/PlantLevelState.js"), __vite__mapDeps([59, 27, 14, 25, 8])), p2 = ue(), m2 = p2?.patcher || new s2();
  p2 || m2.initCacheScan(), p2 || (m2.installSceneHook(), m2.installLoadHook()), $ = `phase-3:patch-load`;
  let h2 = p2 ? p2.result : await m2.loadAllPatches(), _2 = new l2(m2.getOriginalData()), re2 = await x(`GP-Next base path resolution`, () => u2(), { logger: K }), v2 = re2.ok ? re2.value : ``;
  et = v2;
  let ie2 = () => isJsModdingRuntimeEnabled(), ae2 = () => isWorldMapJsonEnabled(), b2 = { getOriginalData: (e3) => {
    let t3 = m2.getOriginalData();
    return e3 ? t3?.[e3] ?? null : t3;
  }, getCurrentData: (e3) => e3 ? _2.getCurrent(e3) ?? null : null, restoreData: (e3) => _2.restore(e3), restoreAllData: () => _2.restoreAll(), listBackups: () => _2.listBackups(), hasBackup: (e3) => _2.hasBackup(e3), exportJson: (...e3) => _2.exportJson(...e3), exportLang: (...e3) => m2.exportLang(...e3), setObjectsData: (...e3) => m2.setObjectsData(...e3) }, S2 = null, C2 = null, w2 = await x(`JS Mod loader initialization`, async () => {
    let { createJsModLoader: e3 } = await r(async () => {
      let { createJsModLoader: e4 } = await import("./mods/JsModEntry.js");
      return { createJsModLoader: e4 };
    }, __vite__mapDeps([60, 4, 32, 33, 1, 2, 13, 14, 8, 34, 25, 35, 36, 7, 15, 16, 18, 37, 30])), n3 = p2?.loader || e3();
    return n3.notifyEngineReady({ cc: t2 }), n3;
  }, { logger: K });
  if (w2.ok) S2 = w2.value;
  else if (p2) throw w2.error;
  let se2 = await x(`Worldmap JSON module initialization`, async () => {
    let { createWorldMapJsonPatcher: e3 } = await r(async () => {
      let { createWorldMapJsonPatcher: e4 } = await import("./runtime/WorldmapJsonPatcher.js");
      return { createWorldMapJsonPatcher: e4 };
    }, __vite__mapDeps([61, 14, 13, 1, 2, 4, 8, 34, 25, 35])), t3 = e3();
    return t3.bindServices(b2), t3;
  }, { logger: K });
  se2.ok && (C2 = se2.value);
  let T2 = async (e3, t3) => {
    if (!C2) return [];
    if (!ae2()) return await x(`Worldmap JSON clear (${t3})`, () => C2.clear(), { logger: K }), [];
    let n3 = await x(`Worldmap JSON load (${t3})`, () => C2.reloadFromPacks(e3.filter((e4) => !e4.preflightErrors?.length)), { cleanup: () => C2.clear(), logger: K });
    if (p2 && !n3.ok) throw n3.error;
    return n3.ok ? n3.value : [];
  }, E2 = async (e3, t3) => {
    if (!S2) return [];
    let n3 = await x(`JS Mod runtime load (${t3})`, () => ie2() ? S2.reloadFromPacks(e3, { reason: t3, emitReloadEvents: false }) : S2.disposeAll(t3), { cleanup: () => S2.disposeAll(`${t3}-failure-cleanup`), logger: K });
    return n3.ok ? n3.value : [];
  }, ce2 = async (e3) => {
    let t3 = [], n3 = (e4) => {
      if (e4.ok || t3.push(e4.error), e4.cleanupError && t3.push(e4.cleanupError), e4.value?.ok === false) t3.push(Object.assign(Error(`Mod cleanup requires a restart`), { report: e4.value }));
      else {
        for (let n4 of e4.value?.errors || []) t3.push(n4);
        e4.value?.timedOut && !e4.value?.errors?.length && t3.push(Error(`Mod reload notification timed out`));
      }
    };
    if (S2 && (n3(await x(`JS Mod pre-reload event (${e3})`, () => S2.emitAsync(`mods:reload-before`, { reason: e3 }), { logger: K })), n3(await x(`JS Mod disposal (${e3})`, () => S2.disposeAll(e3), { logger: K }))), C2 && n3(await x(`Worldmap JSON disposal (${e3})`, () => C2.clear(), { logger: K })), t3.length) throw Object.assign(AggregateError(t3, `Runtime cleanup failed; restart required`), { code: `RUNTIME_CLEANUP_FAILED` });
  }, le2 = async (e3, t3) => {
    await T2(e3.packs, t3), await E2(e3.packs, t3), S2 && (await x(`JS Mod patch notification (${t3})`, () => S2.notifyPatchesLoaded({ result: e3 }), { logger: K }), await x(`JS Mod post-reload event (${t3})`, () => S2.emitAsync(`mods:reload-after`, { reason: t3, status: S2.getStatus() }), { logger: K }));
  }, D2 = he({ patcher: m2, before: ce2, after: async (e3, t3) => {
    await le2(e3, t3), X(e3);
  }, persist: async (e3) => (await r(async () => {
    let { saveSettings: e4 } = await import("./mods/FileLoader.js");
    return { saveSettings: e4 };
  }, __vite__mapDeps([58, 13, 14, 1, 2, 4, 8]))).saveSettings(e3) }), O2 = (...e3) => {
    if (p2) throw Object.assign(Error(`This mod configuration requires a restart to apply changes`), { code: `MOD_RESTART_REQUIRED` });
    return D2(...e3);
  }, k2 = async () => p2 ? (K.warn($e), setJsModdingRuntimeEnabledFromConsole(true), { restartRequired: true }) : S2 ? (K.warn($e), setJsModdingRuntimeEnabledFromConsole(true), await O2(`console-enable-js-modding`), S2.getStatus()) : (K.error(`JS Mod loader is unavailable`), []), A2 = async (e3 = `disable-js-modding`) => {
    if (p2) throw Object.assign(Error(`Restart is required to change this mod configuration`), { code: `MOD_RESTART_REQUIRED` });
    return setJsModdingRuntimeEnabledFromConsole(false), S2 ? (await x(`JS Mod pre-disable event (${e3})`, () => S2.emitAsync(`mods:reload-before`, { reason: e3 }), { logger: K }), await x(`JS Mod disable (${e3})`, () => S2.disposeAll(e3), { logger: K }), await x(`JS Mod post-disable event (${e3})`, () => S2.emitAsync(`mods:reload-after`, { reason: e3, status: S2.getStatus() }), { logger: K }), S2.getStatus()) : [];
  };
  if (S2) {
    let e3 = await x(`JS Mod service binding`, () => S2.bindServices({ ...b2, reloadAll: O2, getPatcherStatus: () => m2.getStatus(), hasFeature: (e4) => getGpNextFeatureState(e4) }), { cleanup: () => S2.disposeAll(`service-binding-failure`), logger: K });
    if (!e3.ok) {
      if (p2) throw e3.error;
      S2 = null;
    }
  }
  $ = `phase-3:optional-runtimes`, await T2(h2.packs, `initial-load`), p2 ? await p2.activate() : await E2(h2.packs, `initial-load`), S2 && await x(`JS Mod initial patch notification`, () => S2.notifyPatchesLoaded({ result: h2 }), { logger: K });
  let [{ bindDiagnostics: de2 }, { createModDiagnosticReport: j2 }] = await Promise.all([r(() => import("./ui/tabs/Log.js"), __vite__mapDeps([40, 1, 2, 23, 41, 29, 25, 14, 8, 17, 30])), r(() => import("./mods/ModDiagnosticReport.js"), [])]);
  bindTroubleshooting(() => ({ status: m2.getStatus(), diagnostics: S2?.getDiagnostics() || {} }));
  de2(() => {
    let e3 = null;
    try {
      e3 = m2.getAppliedSourceSnapshot().sources;
    } catch {
    }
    return j2({ version: y, clientEdition: oe, state: p2?.modSelection.getState(), diagnostics: S2?.getDiagnostics(), sources: e3 });
  }), $ = `phase-3:tab-registration`, await Promise.all([Q(Z.find((e3) => e3.id === `patcher`), async () => {
    (await r(() => import("./ui/tabs/Patcher.js"), __vite__mapDeps([62, 63, 53, 2, 13, 14, 1, 4, 8, 17, 41, 29, 25, 30]))).bindPatcher(m2, _2, v2, { reload: O2 });
    let [e3, t3] = await Promise.all([r(() => import("./ui/tabs/Mods.js"), __vite__mapDeps([64, 65, 36, 14, 17, 41, 29, 25, 8])), r(() => import("./ui/tabs/ModManager.js"), __vite__mapDeps([66, 46, 25, 14, 8, 35, 37, 1, 2, 13, 4, 44, 17, 41, 47, 48, 29, 30, 49, 65, 36, 63, 53]))]);
    if (e3.bindMods(S2), p2) {
      let { bindModSettingsRegistry: e4 } = await r(async () => {
        let { bindModSettingsRegistry: e5 } = await import("./ui/tabs/Settings.js");
        return { bindModSettingsRegistry: e5 };
      }, __vite__mapDeps([67, 46, 25, 14, 8, 35, 37, 1, 2, 13, 4, 44, 17, 41, 47, 48, 29, 30]));
      e4(p2.desiredSettings);
    }
    let n3 = null;
    if (!p2 && window.__TAURI_INTERNALS__) {
      let [{ prepareLegacyRuntimeMigration: e4 }, { createPackInstallStore: t4 }, { createConfigurationStorage: i4 }] = await Promise.all([r(() => import("./mods/LegacyRuntimeMigration.js"), __vite__mapDeps([68, 14, 4, 13, 1, 2, 8, 12, 7, 15, 16, 17, 6, 5, 37])), r(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([9, 1, 2, 4])), r(() => import("./mods/ModConfigurationStorage.js"), __vite__mapDeps([0, 1, 2]))]), a3 = t4();
      n3 = { storage: i4(), prepare: () => e4({ patcher: m2, installStore: a3 }) };
    }
    let i3 = p2 ? { pick: async (e4) => (await r(async () => {
      let { pickModPackage: e5 } = await import("./mods/ModPackagePicker.js");
      return { pickModPackage: e5 };
    }, __vite__mapDeps([69, 1, 2, 23, 4]))).pickModPackage(e4), prepare: p2.prepareInstall } : null, a2 = p2 && { ...p2.modSelection, async prepareApplication() {
      let e4 = await p2.modSelection.prepareApplication();
      return e4.mode === `immediate` ? { ...e4, async apply() {
        await e4.apply(), X(m2.getStatus());
      } } : e4;
    } };
    return t3.createModManager(p2?.desiredSettings, n3, a2, i3);
  }), Q(Z.find((e3) => e3.id === `data`), async () => {
    const { bindData, render } = await import("./ui/tabs/Data.js");
    bindData(m2, _2);
    return { render };
  })]), X(h2), K.info(`Phase 3 complete \u2014 ${h2.packs.length} pack(s), ${h2.loaded.length} type(s) applied`), $ = `phase-4:post-init`, await x(`Cloud save module initialization`, async () => {
    let e3 = (await r(async () => {
      let { default: e4 } = await import("./platform/CloudSaveClient.js");
      return { default: e4 };
    }, [])).default;
    await e3.init(), window.cloudSaver = e3, i2?.(e3), K.info(`Cloud save module ready`);
  }, { logger: { error: (e3) => K.warn(e3) } }), await x(`Discord RPC initialization`, async () => {
    let { updateActivity: e3 } = await r(async () => {
      let { updateActivity: e4 } = await import("./platform/DiscordPresence.js");
      return { updateActivity: e4 };
    }, __vite__mapDeps([71, 72, 2, 39, 53]));
    await e3(`Using GP-Next ` + y, `Playing version 0.14.0`), K.info(`Discord RPC updated`);
  }, { logger: { error: (e3) => K.debug(e3) } }), Object.assign(window.gpNext, { init: () => O2(`manual-init`), reload: () => O2(), status: () => m2.getStatus(), setObjectsData: (...e3) => m2.setObjectsData(...e3), mods: { status: () => S2?.getStatus() || [], enableJsModding: () => k2(), disableJsModding: () => A2(`console-disable-js-modding`), reload: async () => !S2 || !ie2() ? [] : (await O2(`mods-reload`), S2.getStatus()), disposeAll: () => S2?.disposeAll() || [] }, worldMapJson: { status: () => C2?.getStatus() || { specs: [] }, reload: () => C2 ? T2(m2.getStatus().packs, `worldmap-only-reload`) : [] }, plantLevels: { isEnabled: () => isPlantLevelSystemEnabled(), status: () => m2.getPlantLevelSystemDebug(), get: (e3) => {
    let t3 = m2.getPlantLevelConfig(e3);
    return t3 ? d2.getPlantLevelState(e3, t3) : null;
  }, ensure: (e3) => {
    let t3 = m2.getPlantLevelConfig(e3);
    return t3 ? d2.ensurePlantLevelState(e3, t3) : null;
  }, setUnlocked: (e3, t3, n3) => {
    let r2 = m2.getPlantLevelConfig(e3);
    return r2 ? d2.setUnlockedLevel(e3, t3, r2, n3) : null;
  }, setSelected: (e3, t3, n3) => {
    let r2 = m2.getPlantLevelConfig(e3);
    return r2 ? d2.setSelectedLevel(e3, t3, r2, n3) : null;
  }, getBaseCodename: (e3) => m2.getPlantLevelBaseCodename(e3), getCloneCodename: (e3, t3) => m2.getPlantLevelCloneCodename(e3, t3) }, exportJson: (...e3) => _2.exportJson(...e3), exportLevel: (...e3) => _2.exportLevel(...e3), exportLang: (...e3) => m2.exportLang(...e3), restoreOriginal: (e3) => _2.restore(e3), restoreAll: () => _2.restoreAll(), listOrigins: () => _2.listBackups(), hasOrigin: (e3) => _2.hasBackup(e3), setFrameRate: (e3) => t2.game.setFrameRate(e3), cheats: { setSun: (e3) => {
    let n3 = t2.js.getClassByName(`SunCount`)?.component;
    n3 && n3.setSunCount(e3);
  }, addSun: (e3) => {
    let n3 = t2.js.getClassByName(`SunCount`)?.component;
    n3 && n3.SunAdd(e3 || 1e3);
  }, winLevel: () => {
    let e3 = t2.js.getClassByName(`levelController`), n3 = e3 ? t2.director.getScene()?.getComponentInChildren(e3) : null;
    n3 && n3.victory();
  } }, _toast: g, debug: { getPlantRegistry: () => m2.getPlantRegistryDebug(), getPlantLevels: () => m2.getPlantLevelSystemDebug(), getPlantLevelBadges: () => m2.getPlantLevelBadgeDebug() }, help: () => {
    console.log(`[GP Next] ========================================`), console.log(`[GP Next] GP-Next (Gardendless Patcher Next) v` + y), console.log(`[GP Next] Game Version: 0.14.0`), console.log(`[GP Next] Client Edition: ` + oe), console.log(`[GP Next] ========================================`), console.log(``), console.log(`[GP Next] UI:`), console.log(`[GP Next]   .toggle()                   - Toggle overlay panel (${Ze()})`), console.log(``), console.log(`[GP Next] PATCHER:`), console.log(`[GP Next]   .init()                     - Load all patches`), console.log(`[GP Next]   .reload()                   - Reload all patches from disk`), console.log(`[GP Next]   .status()                   - Show patcher status`), console.log(`[GP Next]   .setObjectsData(Type, alias, key, val)`), console.log(`[GP Next]   .setObjectsData(Type, alias, {key: val})`), console.log(`[GP Next]   .debug.getPlantRegistry()   - Inspect dynamic plant registry`), console.log(`[GP Next]   .debug.getPlantLevels()     - Inspect plant level registry`), console.log(`[GP Next]   .debug.getPlantLevelBadges()- Inspect level badge patch status`), console.log(`[GP Next]   .mods.status()              - Show JS mod runtime status`), console.log(`[GP Next]   .mods.reload()              - Reload JS mods from current pack set`), console.log(`[GP Next]   .plantLevels.status()       - Show plant level registry status`), console.log(`[GP Next]   .plantLevels.get(base)      - Read one plant level save entry`), console.log(`[GP Next]   .plantLevels.setUnlocked(base, level)`), console.log(`[GP Next]   .plantLevels.setSelected(base, level)`), console.log(``), console.log(`[GP Next] DATA:`), console.log(`[GP Next]   .exportJson(Type, useOriginal?, autoDownload?)`), console.log(`[GP Next]   .exportLevel(levelId, autoDownload?)`), console.log(`[GP Next]   .exportLang(useOriginal?, autoDownload?)`), console.log(`[GP Next]   .restoreOriginal(Type)      - Restore one type`), console.log(`[GP Next]   .restoreAll()               - Restore all types`), console.log(`[GP Next]   .listOrigins()              - List backed up types`), console.log(`[GP Next]   .hasOrigin(Type)            - Check if backup exists`), console.log(``), console.log(`[GP Next] GAME:`), console.log(`[GP Next]   .setFrameRate(fps)          - Change frame rate`), console.log(``), console.log(`[GP Next] CHEATS:`), console.log(`[GP Next]   .cheats.setSun(value)       - Set sun count`), console.log(`[GP Next]   .cheats.addSun(value)       - Add sun (default 1000)`), console.log(`[GP Next]   .cheats.winLevel()          - Win current level`), console.log(``);
    let e3 = String(v2 || ``).replace(/[\\/]+$/, ``);
    console.log(`[GP Next] Patch files: ` + e3 + `/patches`), console.log(`[GP Next] Docs: ` + rt());
  } }), $ = `ready`, K.info(`Phase 4 complete \u2014 GP-Next fully initialized. Run gpNext.help() for commands.`);
})().catch(async (e2) => {
  if (ue()) {
    let t3 = await j(e2), { showStartupFailure: n2 } = await r(async () => {
      let { showStartupFailure: e3 } = await import("./runtime/CocosStartup.js");
      return { showStartupFailure: e3 };
    }, __vite__mapDeps([73, 74]));
    window.cc?.game?.pause(), n2(t3);
  }
  let t2 = e2?.stack || e2;
  K.error(`Initialization failed at ${$}: ${t2}`), dt(e2);
});
