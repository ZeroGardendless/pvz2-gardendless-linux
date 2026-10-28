import { installRendering } from "./runtime/Rendering.js";
import { connectLauncherOverlay } from "./platform/Launcher.js";
import { initWidescreen } from "./runtime/Widescreen.js";
const __vite__mapDeps = (i2, m2 = __vite__mapDeps, d2 = m2.f || (m2.f = ["gpnext/platform/DeepLink.js", "gpnext/platform/CloudJson.js", "gpnext/platform/Events.js", "gpnext/ui/tabs/Diagnostics.js", "gpnext/ui/Translations.js", "gpnext/vendor/ModuleHelpers.js", "gpnext/core/SettingsStore.js", "gpnext/platform/CloudPortablePreferences.js", "gpnext/runtime/TrainerShortcuts.js", "gpnext/core/Logger.js", "gpnext/ui/Components.js", "gpnext/ui/tabs/Pages.js", "gpnext/mods/ModTroubleshooting.js", "gpnext/platform/FileSystem.js", "gpnext/platform/Dialog.js", "gpnext/core/ClientEdition.js", "gpnext/mods/GameConfiguration.js", "gpnext/mods/ModDiagnosticReport.js", "gpnext/ui/Toast.js", "gpnext/ui/tabs/Log.js", "gpnext/runtime/ScrollSensitivity.js", "gpnext/ui/tabs/Tools.js", "gpnext/ui/tabs/Settings.js", "gpnext/runtime/HpOverlay.js", "gpnext/data/EntityInspector.js", "gpnext/mods/ModSettingsRegistry.js", "gpnext/ui/Overlay.js", "gpnext/data/DataDrawer.js", "gpnext/mods/FileLoader.js", "gpnext/mods/PackSnapshot.js", "gpnext/ui/tabs/Cheats.js", "gpnext/ui/tabs/Preferences.js", "gpnext/platform/Opener.js", "gpnext/ui/tabs/Experimental.js", "gpnext/runtime/FrameSettings.js", "gpnext/ui/tabs/PerformanceSection.js", "gpnext/mods/Patcher.js", "gpnext/mods/PackPreparation.js", "gpnext/mods/ModOperationPlan.js", "gpnext/mods/ModPackPreflight.js", "gpnext/mods/ModVersion.js", "gpnext/data/DataEntityLedger.js", "gpnext/mods/Isolation.js", "gpnext/runtime/PlantLevelState.js", "gpnext/mods/RestoreUtils.js", "gpnext/data/DataStore.js", "gpnext/mods/JsModLoader.js", "gpnext/GameBootstrap.js", "gpnext/mods/ModApi.js", "gpnext/mods/ModControlsRegistry.js", "gpnext/mods/ModOwnedDataStorage.js", "gpnext/mods/ModOwnedData.js", "gpnext/mods/ModSaveProtection.js", "gpnext/runtime/WorldmapJsonPatcher.js", "gpnext/ui/tabs/Patcher.js", "gpnext/ui/tabs/Mods.js", "gpnext/ui/tabs/ModManager.js", "gpnext/mods/LegacyRuntimeMigration.js", "gpnext/mods/ConfigurationModSettings.js", "gpnext/mods/ModConfigurationState.js", "gpnext/mods/PackInstallStore.js", "gpnext/mods/ModConfigurationStorage.js", "gpnext/mods/ModPackagePicker.js", "gpnext/ui/tabs/Data.js", "gpnext/platform/CloudSaveRequest.js", "gpnext/core/BuildIdentity.js", "gpnext/platform/CloudSelection.js", "gpnext/platform/CloudEnvironment.js", "gpnext/platform/DiscordPresence.js", "gpnext/platform/WindowBridge.js", "gpnext/platform/CloudColdHost.js"])) => i2.map((i3) => d2[i3]);
import { r as e } from "./vendor/ModuleHelpers.js";
import { f } from "./platform/CloudJson.js";
import { l as n, n as r, t as i } from "./GameBootstrap.js";
import { i as a } from "./platform/Events.js";
import { u } from "./platform/FileSystem.js";
import { c as s } from "./mods/GameConfiguration.js";
import { s as c } from "./runtime/TrainerShortcuts.js";
import { t as l } from "./core/Logger.js";
import { isJsModdingRuntimeEnabled, setJsModdingRuntimeEnabledFromConsole, getGpNextFeatureState, isPlantLevelSystemEnabled, getSettings, isWorldMapJsonEnabled } from "./core/SettingsStore.js";
import { a as ee, g, n as _, o, r as y, t as b, v } from "./ui/Translations.js";
import { n as S, r as te } from "./ui/Components.js";
import { n as C, t as w } from "./ui/Toast.js";
import { n as T } from "./mods/PackSnapshot.js";
import { h } from "./mods/FileLoader.js";
import { n as D } from "./ui/Overlay.js";
import { n as O } from "./mods/ModVersion.js";
import { n as k } from "./platform/Dialog.js";
import { t as A } from "./mods/Isolation.js";
import { t as ne } from "./runtime/FrameSettings.js";
import { t as re } from "./core/ClientEdition.js";
import { n as j, t as ie } from "./platform/Opener.js";
var ae = false;
function oe() {
  if (!globalThis.window?.__TAURI_INTERNALS__ || ae) return;
  ae = true;
  let e2 = HTMLElement.prototype.click;
  HTMLElement.prototype.click = function() {
    if (this instanceof HTMLAnchorElement && this.hasAttribute(`download`) && this.href) {
      let e3 = this.getAttribute(`download`) || `download`, t2 = this.href;
      if (t2.startsWith(`blob:`)) {
        (async () => {
          try {
            C(o(`toast.saving`, e3), ``, 4e3);
            let n2 = new Uint8Array(await (await fetch(t2)).arrayBuffer()), r2 = await k({ defaultPath: e3, filters: [{ name: `File`, extensions: [e3.includes(`.`) ? e3.split(`.`).pop() : `*`] }] });
            r2 && (await u(r2, n2), C(o(`toast.saved`, e3), `success`));
          } catch (t3) {
            console.error(`[GP Next] Download intercept failed:`, t3), C(o(`toast.saveFailed`, e3), `error`);
          }
        })();
        return;
      }
      C(o(`toast.downloading`, e3), ``);
    }
    return e2.call(this);
  };
}
function se({ patcher: e2, before: t2, after: n2, persist: r2 }) {
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
var M = e(h(), 1), ce = `chunks:///_virtual/KeyListener.ts`, le = `chunks:///_virtual/levelController.ts`, ue = /* @__PURE__ */ new Set([`preSplashScene`, `splashScene`]), de = /* @__PURE__ */ new Set([`inGameScene`, `arcadePlantDecoding`]), fe = /* @__PURE__ */ new Set([`mainScene`, `worldMapScene`, `storeScene`, `zenGardenScene`, `almanacScene`]), N = false;
function P() {
  if (N) return { ok: false, waitable: false, reason: `launch-busy` };
  let e2 = g();
  return e2 ? e2 === `inGameScene` ? { ok: false, waitable: false, reason: `in-game` } : de.has(e2) ? { ok: false, waitable: false, reason: `blocked-scene`, sceneName: e2 } : fe.has(e2) ? { ok: true, sceneName: e2 } : ue.has(e2) ? { ok: false, waitable: true, reason: `startup`, sceneName: e2 } : { ok: false, waitable: false, reason: `unsupported-scene`, sceneName: e2 } : { ok: false, waitable: true, reason: `unknown` };
}
async function pe(e2 = 15e3) {
  let t2 = Date.now();
  for (; Date.now() - t2 < e2; ) {
    let e3 = P();
    if (e3.ok || !e3.waitable) return e3;
    await new Promise((e4) => setTimeout(e4, 250));
  }
  return P();
}
async function me(e2 = 1e4) {
  let t2 = Date.now();
  for (; Date.now() - t2 < e2; ) {
    let e3 = v(ce, `KeyListener`), t3 = v(le, `LevelPlay`);
    if (e3?.darken && e3?.GoToGame && t3) return { KeyListener: e3, LevelPlay: t3 };
    await new Promise((e4) => setTimeout(e4, 200));
  }
  throw Error(`Level runtime exports are unavailable`);
}
function he(e2, t2) {
  let n2 = e2?.objects;
  if (!Array.isArray(n2) || n2.length === 0) throw Error(`Level JSON has no objects array`);
  if (!n2.some((e3) => e3?.objclass === `LevelDefinition`)) throw Error(`Level JSON has no LevelDefinition`);
  if (typeof t2?.getLevelDefinition == `function` && !t2.getLevelDefinition(n2)?.objdata) throw Error(`Level definition cannot be resolved`);
  return n2;
}
async function ge(e2, t2) {
  let n2 = P();
  if (!n2.ok) throw Error(n2.reason);
  N = true;
  try {
    let { KeyListener: n3, LevelPlay: r2 } = t2;
    r2.levelData = e2, r2.thisLevelsID = [], r2.nextLevelsID = [], await n3.darken(), r2.thisLevelsID = [], await n3.GoToGame([r2.levelData]);
  } finally {
    N = false;
  }
}
var _e = new l(`daily-level`), ve = new URL(`daily/current.json`, `https://daily-level-api.pvzge.com/api/v1/`).toString(), ye = `https://daily-level-api.pvzge.com`, be = false, F = false, I = false, L = null, R = { state: `idle`, lastUrl: ``, lastError: ``, pending: false };
function xe() {
  return typeof window < `u` && (window.__TAURI_INTERNALS__ || window.__TAURI__);
}
function z(e2) {
  R = { ...R, ...e2, pending: !!L };
}
function Se(e2) {
  return Array.isArray(e2) ? e2.map(String).filter(Boolean) : e2 == null ? [] : [String(e2)].filter(Boolean);
}
function Ce(e2) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e2 || ``)) return null;
  let t2 = /* @__PURE__ */ new Date(`${e2}T00:00:00.000Z`);
  return Number.isNaN(t2.getTime()) ? null : t2.toISOString().slice(0, 10) === e2 ? e2 : null;
}
function we(e2) {
  let t2;
  try {
    t2 = new URL(String(e2 || ``));
  } catch {
    return { ok: false, reason: `bad-url` };
  }
  let n2 = t2.pathname.replace(/\/+$/, ``), r2 = Ce(t2.searchParams.get(`date`) || ``), i2 = Number(t2.searchParams.get(`slot`)), a2 = t2.searchParams.get(`slug`) || ``;
  return t2.protocol === `pvzge:` ? t2.hostname === `daily-level` ? n2 === `/open` ? r2 ? !Number.isInteger(i2) || i2 < 0 ? { ok: false, reason: `slot` } : /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(a2) ? { ok: true, rawUrl: String(e2), date: r2, slot: i2, slug: a2 } : { ok: false, reason: `slug` } : { ok: false, reason: `date` } : { ok: false, reason: `path` } : { ok: false, reason: `host` } : { ok: false, reason: `scheme` };
}
function Te(e2) {
  L = e2, z({ state: `queued`, lastUrl: e2.rawUrl, lastError: `` });
}
async function Ee(e2) {
  let t2 = await fetch(e2, { cache: `no-store` });
  if (!t2.ok) throw Error(`${t2.status} ${t2.statusText}`);
  return M.default.parse(await t2.text());
}
function De(e2, t2) {
  let n2 = e2?.daily, r2 = n2?.level;
  return !n2 || !r2 ? false : n2.date === t2.date && Number(n2.slot) === t2.slot && r2.slug === t2.slug;
}
function Oe(e2, t2) {
  let n2 = new URL(String(e2?.rawUrl || ``), `${ye}/`), r2 = `/levels/${t2}/`;
  if (n2.origin !== ye || !n2.pathname.startsWith(r2)) throw Error(`Daily Level raw URL is outside the API level path`);
  return n2.toString();
}
function ke(e2) {
  if (e2.reason === `in-game`) {
    C(o(`dailyLevel.exitCurrentLevel`), `warning`);
    return;
  }
  C(o(`dailyLevel.sceneUnavailable`), `warning`);
}
async function Ae(e2) {
  z({ state: `validating`, lastUrl: e2.rawUrl, lastError: `` });
  let t2 = await pe();
  if (!t2.ok) return z({ state: `blocked`, lastError: t2.reason }), ke(t2), { ok: false, reason: t2.reason };
  let n2 = await Ee(ve);
  if (!De(n2, e2)) return z({ state: `stale`, lastError: `daily-level-refreshed` }), C(o(`dailyLevel.refreshed`), `warning`), { ok: false, reason: `daily-level-refreshed` };
  let r2 = await me(), i2 = he(await Ee(Oe(n2.daily.level, e2.slug)), r2.LevelPlay), a2 = P();
  return a2.ok ? (z({ state: `launching`, lastError: `` }), C(o(`dailyLevel.opening`)), await ge(i2, r2), z({ state: `launched`, lastError: `` }), { ok: true }) : (z({ state: `blocked`, lastError: a2.reason }), ke(a2), { ok: false, reason: a2.reason });
}
async function B() {
  if (I || !F || !L) return;
  let e2 = L;
  L = null, I = true;
  try {
    await Ae(e2);
  } catch (e3) {
    z({ state: `failed`, lastError: e3 instanceof Error ? e3.message : String(e3) }), _e.error(`Daily Level deep link failed: ` + e3), C(o(`dailyLevel.loadFailed`), `error`);
  } finally {
    I = false, L && B();
  }
}
async function je() {
  if (!be) {
    if (be = true, !xe()) {
      z({ state: `unavailable`, lastError: `tauri-runtime-unavailable` });
      return;
    }
    try {
      let e2 = await n(() => import("./platform/DeepLink.js"), __vite__mapDeps([0, 1, 2])), t2 = await e2.getCurrent();
      for (let e3 of Se(t2)) await V(e3);
      await e2.onOpenUrl(async (e3) => {
        for (let t3 of Se(e3)) await V(t3);
      }), z({ state: `listening`, lastError: `` });
    } catch (e2) {
      z({ state: `failed`, lastError: e2 instanceof Error ? e2.message : String(e2) }), _e.warn(`Daily Level deep-link listener unavailable: ` + e2);
    }
  }
}
async function V(e2) {
  let t2 = we(e2);
  return t2.ok ? F ? (Te(t2), await B(), { ok: true }) : (Te(t2), { ok: true, queued: true }) : (z({ state: `ignored`, lastUrl: String(e2 || ``), lastError: t2.reason }), { ok: false, reason: t2.reason });
}
function Me() {
  F = true, B();
}
function Ne() {
  return { ...R };
}
var Pe = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
function Fe(e2) {
  let t2;
  try {
    t2 = new URL(e2);
  } catch {
    return null;
  }
  if (t2.protocol !== `pvzge:` || t2.hostname !== `nest`) return null;
  if (t2.pathname !== `/import` || t2.username || t2.password || t2.port || t2.hash || [...t2.searchParams.keys()].length !== 1 || !Pe.test(t2.searchParams.get(`version`) || ``)) throw Error(`NEST_INTENT`);
  return { versionId: t2.searchParams.get(`version`) };
}
function Ie(e2, t2) {
  if (e2?.protocolVersion !== 1 || e2.versionId !== t2 || !Pe.test(e2.projectId?.replace(/^prj_/, ``) || ``) || !e2.projectId.startsWith(`prj_`) || typeof e2.name != `string` || !e2.name || typeof e2.version != `string` || !e2.version || !/^[a-f0-9]{64}$/.test(e2.sha256 || ``) || !Number.isSafeInteger(e2.byteLength) || e2.byteLength <= 0) throw Error(`NEST_DESCRIPTOR`);
  let n2 = e2.type === `level` && [`json`, `json5`].includes(e2.format), r2 = [`datapack`, `mod`].includes(e2.type) && e2.format === `zip`;
  if (!n2 && !r2) throw Error(`NEST_UNSUPPORTED_FORMAT`);
  if (e2.byteLength > (n2 ? 1e7 : 5e7)) throw Error(`NEST_LENGTH`);
  if (!Number.isFinite(Date.parse(e2.expiresAt))) throw Error(`NEST_DESCRIPTOR`);
  return e2;
}
async function Le(e2, t2) {
  let n2 = e2 instanceof Uint8Array ? e2 : new Uint8Array(e2);
  if (n2.length < 4) throw Error(`NEST_DESCRIPTOR`);
  let r2 = new DataView(n2.buffer, n2.byteOffset, n2.byteLength).getUint32(0, true);
  if (r2 > 16384 || r2 + 4 > n2.length) throw Error(`NEST_DESCRIPTOR`);
  let i2 = Ie(JSON.parse(new TextDecoder(`utf-8`, { fatal: true }).decode(n2.subarray(4, 4 + r2))), t2), a2 = n2.slice(4 + r2);
  if (a2.length !== i2.byteLength) throw Error(`NEST_LENGTH`);
  let o2 = new Uint8Array(await crypto.subtle.digest(`SHA-256`, a2));
  if (Array.from(o2, (e3) => e3.toString(16).padStart(2, `0`)).join(``) !== i2.sha256) throw Error(`NEST_HASH`);
  return { descriptor: i2, bytes: a2 };
}
function Re(e2, t2) {
  if (e2.length > 1e7) throw Error(`NEST_LENGTH`);
  let n2 = new TextDecoder(`utf-8`, { fatal: true }).decode(e2), r2 = 0, i2 = ``, a2 = false, o2 = false;
  for (let e3 = 0; e3 < n2.length; e3++) {
    let t3 = n2[e3], s3 = n2[e3 + 1];
    if (a2) {
      /[\n\r\u2028\u2029]/.test(t3) && (a2 = false);
      continue;
    }
    if (o2) {
      t3 === `*` && s3 === `/` && (o2 = false, e3++);
      continue;
    }
    if (i2) {
      t3 === `\\` ? e3++ : t3 === i2 && (i2 = ``);
      continue;
    }
    if (t3 === `/` && s3 === `/`) {
      a2 = true, e3++;
      continue;
    }
    if (t3 === `/` && s3 === `*`) {
      o2 = true, e3++;
      continue;
    }
    if (t3 === `"` || t3 === `'`) {
      i2 = t3;
      continue;
    }
    if ((t3 === `{` || t3 === `[`) && ++r2 > 64) throw Error(`NEST_LEVEL_DEPTH`);
    (t3 === `}` || t3 === `]`) && r2--;
  }
  let s2 = t2 === `json` ? JSON.parse(n2) : M.default.parse(n2), c2 = [s2];
  for (let e3 = 0; e3 < c2.length; e3++) {
    let t3 = c2[e3];
    if (typeof t3 == `number` && !Number.isFinite(t3)) throw Error(`NEST_LEVEL_NUMBER`);
    if (t3 && typeof t3 == `object`) for (let e4 of Object.values(t3)) {
      if (c2.length >= 2e5) throw Error(`NEST_LEVEL_NODES`);
      c2.push(e4);
    }
  }
  return s2;
}
function ze({ download: e2, snapshot: t2, prepareInstall: n2, reviewInstall: r2, waitScene: i2, getScene: a2, runtime: o2, validateLevel: s2, launchLevel: c2, notify: l2 }) {
  let u2 = false, d2 = null, f2 = null, p2 = /* @__PURE__ */ new Set(), m2 = { state: `idle`, versionId: null, error: `` }, h2 = (e3, t3 = ``) => {
    m2 = { state: e3, versionId: d2?.versionId || m2.versionId, error: t3 }, l2?.({ ...m2 });
  };
  async function ee2() {
    if (!u2 || !d2 || f2) return;
    let l3 = d2;
    f2 = (async () => {
      try {
        h2(`downloading`);
        let { descriptor: u3, bytes: d3 } = await e2(l3.versionId);
        if (Ie(u3, l3.versionId), u3.type === `level`) {
          let e3 = await i2();
          if (!e3.ok) throw Error(e3.reason);
          let t3 = await o2(), n3 = s2(Re(d3, u3.format), t3.LevelPlay), r3 = a2();
          if (!r3.ok) throw Error(r3.reason);
          h2(`launching`), await c2(n3, t3), h2(`launched`);
        } else {
          let e3 = await n2(await t2(d3), { forceDisabled: true });
          if (h2(`reviewing`), !await r2(e3)) {
            h2(`cancelled`);
            return;
          }
          h2(`installed`);
        }
        p2.add(l3.versionId), p2.size > 32 && p2.delete(p2.values().next().value);
      } catch (e3) {
        h2(`failed`, e3.message || String(e3));
      } finally {
        d2 = null, f2 = null;
      }
    })(), await f2;
  }
  return { async handle(e3) {
    let t3;
    try {
      t3 = Fe(e3);
    } catch (e4) {
      return h2(`failed`, e4.message), { ok: false, reason: e4.message };
    }
    return t3 ? p2.has(t3.versionId) || d2?.versionId === t3.versionId ? { ok: true, duplicate: true } : d2 || f2 ? { ok: false, reason: `NEST_BUSY` } : (d2 = t3, m2.versionId = t3.versionId, h2(`queued`), u2 && await ee2(), { ok: m2.state !== `failed`, queued: !u2 }) : { ok: false, ignored: true };
  }, async setReady() {
    u2 = true, await ee2();
  }, status: () => ({ ...m2 }) };
}
async function Be(e2) {
  return T(await new Promise((t2, n2) => {
    let r2 = new Worker(new URL(`/gpnext/core/NestPackWorker.js`, `` + import.meta.url), { type: `module` }), i2 = (e3, i3) => {
      clearTimeout(a2), r2.terminate(), e3 ? n2(e3) : t2(i3);
    }, a2 = setTimeout(() => i2(Error(`NEST_ZIP_TIMEOUT`)), 3e4);
    r2.onerror = () => i2(Error(`NEST_ZIP_WORKER`)), r2.onmessage = ({ data: e3 }) => e3.error ? i2(Error(e3.error)) : i2(null, e3.entries);
    let o2 = e2.slice();
    r2.postMessage(o2, [o2.buffer]);
  }));
}
function Ve(e2) {
  return new Promise((t2) => {
    let n2 = document.createElement(`dialog`);
    n2.className = `gp-nest-review`;
    let r2 = document.createElement(`style`);
    r2.textContent = `.gp-nest-review { color:var(--gp-text-primary,#f1f5f9); background:var(--gp-panel,#1c1c1e); border:1px solid var(--gp-border,#48484a); border-radius:12px; padding:24px; max-width:min(520px,90vw); font:14px/1.6 var(--gp-font-ui); color-scheme:var(--gp-color-scheme,dark); overflow-wrap:anywhere; } .gp-nest-review::backdrop { background:#0008; } .gp-nest-review .gp-btn { padding:8px 14px; border:1px solid var(--gp-border,#636366); border-radius:7px; color:inherit; background:var(--gp-surface,#343438); cursor:pointer; } .gp-nest-review .gp-btn:disabled { opacity:.5; } .gp-nest-review .gp-btn-row { display:flex; gap:10px; flex-wrap:wrap; } .gp-nest-review h2 { font-size:18px; margin:0 0 14px; }`;
    let i2 = (e3, t3 = `p`) => {
      let r3 = document.createElement(t3);
      return r3.textContent = e3, n2.append(r3), r3;
    }, a2 = e2.preview;
    i2(o(`nestImport.review`), `h2`), i2(a2.name + ` \xB7 ` + a2.version), a2.update && i2(o(`installation.previous`, a2.previousVersion)), i2(o(`nestImport.disabled`)), a2.containsScripts && i2(o(a2.requiresTrust ? `installation.trustUpdate` : `installation.trusted`));
    for (let e3 of a2.requirements || []) e3.status !== `ready` && i2(`${e3.name || e3.id}: ${o(`requirements.` + e3.status)}`);
    for (let e3 of a2.warnings || []) i2(e3);
    let o2 = false, s2 = (e3) => {
      n2.close(), n2.remove(), r2.remove(), t2(e3);
    }, c2 = S(o(`migration.cancel`), () => s2(false)), l2 = S(o(a2.requiresTrust ? `installation.trustAndUpdate` : a2.update ? `installation.update` : `installation.install`), async () => {
      if (!o2) {
        o2 = true, l2.disabled = c2.disabled = true;
        try {
          await e2.commit({ trustedContentDigest: a2.contentDigest }), s2(true);
        } catch (e3) {
          i2(e3.message || String(e3)), l2.remove(), o2 = false, c2.disabled = false;
        }
      }
    });
    n2.append(te(l2, c2)), n2.addEventListener(`cancel`, (e3) => {
      e3.preventDefault(), o2 || s2(false);
    }), document.head.append(r2), document.body.append(n2), n2.showModal(), l2.focus();
  });
}
var He = null, Ue = false, We = new l(`nest-import`), Ge = ze({ download: async (e2) => Le(await f(`download_nest_import`, { versionId: e2 }), e2), snapshot: Be, prepareInstall: (e2, t2) => {
  if (!He) throw Error(`NEST_PLATFORM_UNAVAILABLE`);
  return He.prepareInstall(e2, t2);
}, reviewInstall: Ve, waitScene: pe, getScene: P, runtime: me, validateLevel: he, launchLevel: ge, notify: (e2) => {
  e2.state === `downloading` && C(o(`nestImport.downloading`)), e2.state === `installed` && C(o(`nestImport.installed`)), e2.state === `launched` && C(o(`nestImport.launched`)), e2.state === `failed` && (We.warn(`Import failed: ` + e2.error), C([`in-game`, `blocked-scene`, `unsupported-scene`, `launch-busy`].includes(e2.error) ? o(`nestImport.exitLevel`) : o(`nestImport.failed`, e2.error), `error`));
} });
async function Ke(e2) {
  let t2 = await Ge.handle(e2);
  return t2.reason === `NEST_BUSY` && C(o(`nestImport.busy`), `warning`), t2;
}
var qe = Ge.status;
function Je(e2) {
  return He = e2, Ge.setReady();
}
async function Ye() {
  if (Ue || !window.__TAURI_INTERNALS__) return;
  Ue = true;
  let e2 = await n(() => import("./platform/DeepLink.js"), __vite__mapDeps([0, 1, 2]));
  await e2.onOpenUrl(async (e3) => {
    for (let t2 of e3) await Ke(t2);
  });
  for (let t2 of await e2.getCurrent() || []) await Ke(t2);
}
var H = new l(`update-checker`), Xe = `https://pvzge.com/jsons/gp-next-info.json`, Ze = 8e3, U = [], W = null, Qe = false, $e = { status: `idle`, currentVersion: s, latestVersion: ``, checkedAt: 0, error: `` };
function et() {
  let e2 = G();
  for (let t2 of U.slice()) try {
    t2(e2);
  } catch {
  }
}
function tt(e2) {
  $e = { ...$e, ...e2 }, et();
}
function G() {
  return { ...$e };
}
function nt(e2) {
  return typeof e2 == `function` ? (U.push(e2), e2(G()), () => {
    let t2 = U.indexOf(e2);
    t2 !== -1 && U.splice(t2, 1);
  }) : () => {
  };
}
function rt(e2 = b()) {
  return _(`download`, e2);
}
async function it() {
  let e2 = rt();
  try {
    return await j(e2), true;
  } catch (t2) {
    H.warn(`Failed to open external browser via Tauri opener: ${t2}`);
    try {
      if (window.electron?.shell?.openExternal) return await window.electron.shell.openExternal(e2), true;
    } catch (e3) {
      H.warn(`Fallback opener failed: ${e3}`);
    }
    return window.open(e2, `_blank`, `noopener,noreferrer`), true;
  }
}
async function at(e2 = {}) {
  let t2 = e2.manual === true;
  if (W) return W;
  tt({ status: `checking`, error: `` });
  let n2 = (async () => {
    let e3 = new AbortController(), n3 = setTimeout(() => e3.abort(), Ze);
    try {
      let n4 = await fetch(`${Xe}?t=${Date.now()}`, { cache: `no-store`, signal: e3.signal });
      if (!n4.ok) throw Error(`HTTP ${n4.status}`);
      let r2 = await n4.json(), i2 = String(r2?.version || ``).trim();
      if (!i2) throw Error(`Missing version field`);
      let a2 = O(i2, s) > 0;
      return tt({ status: a2 ? `update-available` : `up-to-date`, latestVersion: i2, checkedAt: Date.now(), error: `` }), a2 ? (!Qe || t2) && (C(o(`toast.updateAvailable`, i2), ``, 5e3), Qe = true) : t2 && C(o(`toast.updateUpToDate`, s), `success`), H.info(`Update check complete: local=${s}, latest=${i2}, newer=${a2}`), G();
    } catch (e4) {
      let n4 = e4?.name === `AbortError` ? `timeout` : String(e4?.message || e4);
      return tt({ status: `error`, checkedAt: Date.now(), error: n4 }), H.warn(`Update check failed: ${n4}`), t2 && C(o(`toast.updateCheckFailed`), `error`), G();
    } finally {
      clearTimeout(n3), W = null;
    }
  })();
  return W = n2, n2;
}
var K = new l(`main`), ot = () => c(getSettings().overlayHotkey), st = `gp-next://menu-action`, ct = `JS modding executes third-party code without a security sandbox. Loading custom JS scripts may affect game runtime logic and save data, and may create security risks. Only obtain JS mod packages from trusted sources, and inspect script contents before enabling them.`, q = { toggleOverlay: `gpn-menu-toggle-overlay`, reloadPatches: `gpn-menu-reload-patches`, openPatchFolder: `gpn-menu-open-patch-folder`, reloadGame: `gpn-menu-reload-game`, checkUpdates: `gpn-menu-check-updates`, openGpNextGuide: `gpn-menu-open-gp-next-guide`, openDownload: `gpn-menu-open-download`, openWebsite: `gpn-menu-open-website`, openDiscord: `gpn-menu-open-discord` }, lt = ``;
K.info(`GP-Next loading...`);
var ut = getSettings();
w(), je().catch((e2) => K.debug(`Daily Level deep-link listener skipped: ` + e2)), Ye().catch(() => K.warn(`Nest deep-link listener unavailable`)), oe();
var J = D();
connectLauncherOverlay(J);
initWidescreen();
J.setVersion(s), J.setHotkey(ut.overlayHotkey), J.bindUpdateActions({ onCheck: () => at({ manual: true }), onOpen: () => it() }), nt((e2) => J.setUpdateState(e2)), J.updateStatus(o(`header.status.waiting`)), at().catch((e2) => K.debug(`Startup update check skipped: ` + e2));
function Y(e2) {
  e2 && (e2.editsCount > 0 ? J.updateStatusKey(`header.status.compactWithEdits`, e2.packs.length, e2.loaded.length, e2.editsCount) : J.updateStatusKey(`header.status.compact`, e2.packs.length, e2.loaded.length));
}
function dt() {
  return typeof window < `u` && (window.__TAURI_INTERNALS__ || window.__TAURI__);
}
function ft() {
  return _();
}
function pt() {
  return _(`guide/mod`);
}
function mt() {
  let e2 = String(lt || ``).replace(/[\\/]+$/, ``);
  return e2 ? `${e2}/gp-next` : ``;
}
function ht() {
  return { app: o(`menu.app`), about: o(`menu.about`), services: o(`menu.services`), hide: o(`menu.hide`), hideOthers: o(`menu.hideOthers`), showAll: o(`menu.showAll`), quit: o(`menu.quit`), file: o(`menu.file`), closeWindow: o(`menu.closeWindow`), edit: o(`menu.edit`), undo: o(`menu.undo`), redo: o(`menu.redo`), cut: o(`menu.cut`), copy: o(`menu.copy`), paste: o(`menu.paste`), selectAll: o(`menu.selectAll`), gpNext: o(`menu.gpNext`), toggleOverlay: o(`menu.toggleOverlay`), reloadPatches: o(`menu.reloadPatches`), openPatchFolder: o(`menu.openPatchFolder`), reloadGame: o(`menu.reloadGame`), checkUpdates: o(`menu.checkUpdates`), openGpNextGuide: o(`menu.openGpNextGuide`), window: o(`menu.window`), minimize: o(`menu.minimize`), zoom: o(`menu.zoom`), bringAllToFront: o(`menu.bringAllToFront`), help: o(`menu.help`), website: o(`menu.website`), downloadPage: o(`menu.downloadPage`), discord: o(`menu.discord`) };
}
async function X() {
  if (dt() && /Mac/.test(navigator.platform || "")) try {
    await f(`update_macos_menu`, { labels: ht() });
  } catch (e2) {
    K.debug(`macOS menu update skipped: ` + e2);
  }
}
async function gt(e2) {
  switch (e2) {
    case q.toggleOverlay:
      J.toggle();
      break;
    case q.reloadPatches:
      if (typeof window.gpNext?.reload != `function`) {
        C(o(`common.loading`));
        return;
      }
      try {
        Y(await window.gpNext.reload()), C(o(`toast.patchReloaded`));
      } catch (e3) {
        K.error(`Menu reload failed: ` + e3), C(o(`common.failed`));
      }
      break;
    case q.openPatchFolder: {
      let e3 = mt();
      if (!e3) {
        C(o(`common.loading`));
        return;
      }
      try {
        await ie(e3);
      } catch (e4) {
        C(`${o(`common.failed`)}: ${String(e4)}`, `error`);
      }
      break;
    }
    case q.reloadGame:
      window.location.reload();
      break;
    case q.checkUpdates:
      await at({ manual: true });
      break;
    case q.openGpNextGuide:
      await j(pt());
      break;
    case q.openDownload:
      await it();
      break;
    case q.openWebsite:
      await j(ft());
      break;
    case q.openDiscord:
      await j(`https://discord.gg/ZEfb2tBQFW`);
      break;
  }
}
function _t() {
  dt() && (X(), y(() => {
    X();
  }), a(st, (e2) => {
    gt(e2.payload).catch((e3) => {
      K.debug(`macOS menu action failed: ` + e3);
    });
  }).catch((e2) => {
    K.debug(`macOS menu listener skipped: ` + e2);
  }));
}
var Z = [{ id: `patcher`, labelKey: `tab.mods` }, { id: `data`, labelKey: `tab.data` }, { id: `tools`, labelKey: `sections.tools` }, { id: `settings`, labelKey: `tab.settings` }, { id: `performance`, labelKey: `tab.performance` }, { id: `log`, labelKey: `tab.log` }, { id: `about`, labelKey: `tab.about` }];
const tabSearch = {
  patcher: ["mods datapacks install update dependencies load order permissions"],
  tools: ["guide.uuidSectionTitle", "settings.hpOverlay", "settings.transfer", "tools.troubleshooting", "trainer sun zombies diagnostics reports"],
  cheats: ["trainer sun coins gems tickets world keys fusion plants zombies"],
  data: ["plant zombie projectile features properties JSON edit"],
  settings: ["settings.appearance", "settings.frameRate", "settings.widescreen", "settings.scrollSensitivity", "settings.overlayHotkey", "settings.trainerHotkeys", "render resolution graphics audio volume theme accent opacity blur radius experiments JS Modding Worldmap Modding Plant Level System"],
  experimental: ["Worldmap Modding Plant Level System JS Modding scripts scheduler"],
  diagnostics: ["logs errors report privacy troubleshooting recovery"]
};
for (const tab of Z) tab.searchKeys = tabSearch[tab.id] || [];
for (let e2 of Z) J.registerTab({ id: e2.id, labelKey: e2.labelKey, searchKeys: e2.searchKeys, render(e3) {
  let t2 = document.createElement(`div`);
  t2.className = `gp-text-muted`, t2.textContent = o(`common.loading`), e3.appendChild(t2);
} });
var vt = /* @__PURE__ */ new Set();
function yt(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.className = `gp-text-muted`, n2.textContent = `${o(`common.failed`)}: ${String(t2?.message || t2)}`, e2.appendChild(n2);
}
async function Q(e2, t2) {
  let n2 = await A(`Tab '${e2.id}' initialization`, t2, { logger: K });
  return n2.ok ? J.registerTab({ id: e2.id, labelKey: e2.labelKey, searchKeys: e2.searchKeys, ...n2.value }) : J.registerTab({ id: e2.id, labelKey: e2.labelKey, render: (e3) => yt(e3, n2.error) }), vt.add(e2.id), n2;
}
function bt(e2) {
  for (let t2 of Z) vt.has(t2.id) || (J.registerTab({ id: t2.id, labelKey: t2.labelKey, render: (t3) => yt(t3, e2) }), vt.add(t2.id));
}
Q(Z.find((tab) => tab.id === "about"), async () => ({ render: (await import("./ui/tabs/About.js")).render }));
Q(Z.find((tab) => tab.id === "log"), async () => await import("./ui/tabs/Log.js"));
var xt = Promise.resolve();
window.gpNext = { version: s, clientEdition: re, debug: ut.debug === true, toggle: J.toggle, show: J.show, hide: J.hide, nestImport: { openFromUrl: Ke, status: qe }, dailyLevel: { openFromUrl: V, status: Ne } }, _t(), K.info(`Phase 1 complete \u2014 overlay mounted. Press ${ot()} to toggle.`);
var $ = `phase-2:engine-import`;
(async () => {
  let { waitForEngine: e2 } = await n(async () => {
    let { waitForEngine: e3 } = await import("./ui/Translations.js").then((e4) => e4.c);
    return { waitForEngine: e3 };
  }, __vite__mapDeps([4, 5, 6, 7, 8, 9])), t2;
  $ = `phase-2:engine-wait`;
  try {
    t2 = await e2(3e4, { continueAfterTimeout: true });
  } catch (e3) {
    J.updateStatus(o(`header.status.timeout`)), K.error(`Engine wait failed \u2014 patcher features unavailable: ` + e3), bt(e3);
    return;
  }
  installRendering(t2);
  $ = `phase-2:runtime-setup`, J.updateStatus(o(`header.status.engineReady`)), ee(), X(), Me(), await A(`Frame scheduler initialization`, () => ne(t2.game, ut), { logger: K }), await A(`Scroll sensitivity initialization`, async () => (await n(() => import("./runtime/ScrollSensitivity.js").then((e3) => e3.n), __vite__mapDeps([20, 5, 4, 6, 7, 8, 9]))).install(), { logger: K }), $ = `phase-2:independent-tabs`, await xt, await Promise.all([Q(Z.find((e3) => e3.id === `tools`), async () => (await n(() => import("./ui/tabs/Tools.js"), __vite__mapDeps([21, 4, 5, 6, 7, 8, 9, 22, 1, 13, 14, 23, 24, 25, 16, 20, 10, 26, 27, 28, 29, 18]))).createToolsTab()), Q(Z.find((e3) => e3.id === `settings`), async () => (await n(() => import("./ui/tabs/Preferences.js"), __vite__mapDeps([31, 32, 1, 15, 16, 13, 4, 5, 6, 7, 8, 9, 22, 14, 23, 24, 25, 20, 10, 26, 27, 28, 29, 18, 11]))).createPreferencesTab()), Q(Z.find((e3) => e3.id === `performance`), async () => (await n(() => import("./ui/tabs/PerformanceSection.js"), __vite__mapDeps([35, 1, 13, 14, 16, 4, 5, 6, 7, 8, 9, 23, 24, 10, 26, 27, 28, 29, 18]))).createPerformanceTab())]), $ = `phase-3:core-imports`;
  let { CorePatcher: i2 } = await n(async () => {
    let { CorePatcher: e3 } = await import("./mods/Patcher.js");
    return { CorePatcher: e3 };
  }, __vite__mapDeps([36, 5, 13, 1, 14, 28, 29, 16, 9, 37, 38, 39, 40, 4, 6, 7, 8, 41, 42, 43, 44, 18])), { DataStore: a2 } = await n(async () => {
    let { DataStore: e3 } = await import("./data/DataStore.js");
    return { DataStore: e3 };
  }, __vite__mapDeps([45, 13, 1, 14, 4, 5, 6, 7, 8, 9, 44, 18])), { getBasePath: o2 } = await n(async () => {
    let { getBasePath: e3 } = await import("./mods/FileLoader.js").then((e4) => e4.o);
    return { getBasePath: e3 };
  }, __vite__mapDeps([28, 5, 13, 1, 29, 16, 9])), c2 = await n(() => import("./runtime/PlantLevelState.js"), __vite__mapDeps([43, 5, 4, 6, 7, 8, 9])), l2 = r(), g2 = l2?.patcher || new i2();
  l2 || g2.initCacheScan(), l2 || (g2.installSceneHook(), g2.installLoadHook()), $ = `phase-3:patch-load`;
  let _2 = l2 ? l2.result : await g2.loadAllPatches(), y2 = new a2(g2.getOriginalData()), b2 = await A(`GP-Next base path resolution`, () => o2(), { logger: K }), x2 = b2.ok ? b2.value : ``;
  lt = x2;
  let S2 = () => isJsModdingRuntimeEnabled(), te2 = () => isWorldMapJsonEnabled(), w2 = { getOriginalData: (e3) => {
    let t3 = g2.getOriginalData();
    return e3 ? t3?.[e3] ?? null : t3;
  }, getCurrentData: (e3) => e3 ? y2.getCurrent(e3) ?? null : null, restoreData: (e3) => y2.restore(e3), restoreAllData: () => y2.restoreAll(), listBackups: () => y2.listBackups(), hasBackup: (e3) => y2.hasBackup(e3), exportJson: (...e3) => y2.exportJson(...e3), exportLang: (...e3) => g2.exportLang(...e3), setObjectsData: (...e3) => g2.setObjectsData(...e3) }, T2 = null, E2 = null, D2 = await A(`JS Mod loader initialization`, async () => {
    let { createJsModLoader: e3 } = await n(async () => {
      let { createJsModLoader: e4 } = await import("./mods/JsModLoader.js");
      return { createJsModLoader: e4 };
    }, __vite__mapDeps([46, 47, 5, 1, 29, 28, 13, 16, 9, 40, 48, 4, 6, 7, 8, 24, 49, 38, 50, 51, 39, 52, 25, 18])), r2 = l2?.loader || e3();
    return r2.notifyEngineReady({ cc: t2 }), r2;
  }, { logger: K });
  if (D2.ok) T2 = D2.value;
  else if (l2) throw D2.error;
  let O2 = await A(`Worldmap JSON module initialization`, async () => {
    let { createWorldMapJsonPatcher: e3 } = await n(async () => {
      let { createWorldMapJsonPatcher: e4 } = await import("./runtime/WorldmapJsonPatcher.js");
      return { createWorldMapJsonPatcher: e4 };
    }, __vite__mapDeps([53, 5, 28, 13, 1, 29, 16, 9, 48, 4, 6, 7, 8, 24])), t3 = e3();
    return t3.bindServices(w2), t3;
  }, { logger: K });
  O2.ok && (E2 = O2.value);
  let k2 = async (e3, t3) => {
    if (!E2) return [];
    if (!te2()) return await A(`Worldmap JSON clear (${t3})`, () => E2.clear(), { logger: K }), [];
    let n2 = await A(`Worldmap JSON load (${t3})`, () => E2.reloadFromPacks(e3.filter((e4) => !e4.preflightErrors?.length)), { cleanup: () => E2.clear(), logger: K });
    if (l2 && !n2.ok) throw n2.error;
    return n2.ok ? n2.value : [];
  }, j2 = async (e3, t3) => {
    if (!T2) return [];
    let n2 = await A(`JS Mod runtime load (${t3})`, () => S2() ? T2.reloadFromPacks(e3, { reason: t3, emitReloadEvents: false }) : T2.disposeAll(t3), { cleanup: () => T2.disposeAll(`${t3}-failure-cleanup`), logger: K });
    return n2.ok ? n2.value : [];
  }, ie2 = async (e3) => {
    let t3 = [], n2 = (e4) => {
      if (e4.ok || t3.push(e4.error), e4.cleanupError && t3.push(e4.cleanupError), e4.value?.ok === false) t3.push(Object.assign(Error(`Mod cleanup requires a restart`), { report: e4.value }));
      else {
        for (let n3 of e4.value?.errors || []) t3.push(n3);
        e4.value?.timedOut && !e4.value?.errors?.length && t3.push(Error(`Mod reload notification timed out`));
      }
    };
    if (T2 && (n2(await A(`JS Mod pre-reload event (${e3})`, () => T2.emitAsync(`mods:reload-before`, { reason: e3 }), { logger: K })), n2(await A(`JS Mod disposal (${e3})`, () => T2.disposeAll(e3), { logger: K }))), E2 && n2(await A(`Worldmap JSON disposal (${e3})`, () => E2.clear(), { logger: K })), t3.length) throw Object.assign(AggregateError(t3, `Runtime cleanup failed; restart required`), { code: `RUNTIME_CLEANUP_FAILED` });
  }, ae2 = async (e3, t3) => {
    await k2(e3.packs, t3), await j2(e3.packs, t3), T2 && (await A(`JS Mod patch notification (${t3})`, () => T2.notifyPatchesLoaded({ result: e3 }), { logger: K }), await A(`JS Mod post-reload event (${t3})`, () => T2.emitAsync(`mods:reload-after`, { reason: t3, status: T2.getStatus() }), { logger: K }));
  }, oe2 = se({ patcher: g2, before: ie2, after: async (e3, t3) => {
    await ae2(e3, t3), Y(e3);
  }, persist: async (e3) => (await n(async () => {
    let { saveSettings: e4 } = await import("./mods/FileLoader.js").then((e5) => e5.o);
    return { saveSettings: e4 };
  }, __vite__mapDeps([28, 5, 13, 1, 29, 16, 9]))).saveSettings(e3) }), M2 = (...e3) => {
    if (l2) throw Object.assign(Error(`This mod configuration requires a restart to apply changes`), { code: `MOD_RESTART_REQUIRED` });
    return oe2(...e3);
  }, ce2 = async () => {
    if (l2) return K.warn(ct), setJsModdingRuntimeEnabledFromConsole(true), { restartRequired: true };
    if (!T2) return K.error(`JS Mod loader is unavailable`), [];
    K.warn(ct);
    let e3 = isJsModdingRuntimeEnabled();
    setJsModdingRuntimeEnabledFromConsole(true);
    try {
      await M2(`console-enable-js-modding`);
    } catch (t3) {
      throw setJsModdingRuntimeEnabledFromConsole(e3), e3 || await T2.disposeAll(`enable-js-modding-failed`).catch((e4) => K.error(e4)), t3;
    }
    return T2.getStatus();
  }, le2 = async (e3 = `disable-js-modding`) => l2 ? (setJsModdingRuntimeEnabledFromConsole(false), { restartRequired: true }) : (setJsModdingRuntimeEnabledFromConsole(false), T2 ? (await A(`JS Mod pre-disable event (${e3})`, () => T2.emitAsync(`mods:reload-before`, { reason: e3 }), { logger: K }), await A(`JS Mod disable (${e3})`, () => T2.disposeAll(e3), { logger: K }), await A(`JS Mod post-disable event (${e3})`, () => T2.emitAsync(`mods:reload-after`, { reason: e3, status: T2.getStatus() }), { logger: K }), T2.getStatus()) : []);
  if (T2) {
    let e3 = await A(`JS Mod service binding`, () => T2.bindServices({ ...w2, reloadAll: M2, getPatcherStatus: () => g2.getStatus(), hasFeature: (e4) => getGpNextFeatureState(e4) }), { cleanup: () => T2.disposeAll(`service-binding-failure`), logger: K });
    if (!e3.ok) {
      if (l2) throw e3.error;
      T2 = null;
    }
  }
  $ = `phase-3:optional-runtimes`, await k2(_2.packs, `initial-load`), l2 ? await l2.activate() : await j2(_2.packs, `initial-load`), T2 && await A(`JS Mod initial patch notification`, () => T2.notifyPatchesLoaded({ result: _2 }), { logger: K });
  let [{ bindDiagnostics: ue2 }, { createModDiagnosticReport: de2 }] = await Promise.all([n(() => import("./ui/tabs/Log.js"), __vite__mapDeps([19, 13, 1, 14, 4, 5, 6, 7, 8, 9, 10, 18])), n(() => import("./mods/ModDiagnosticReport.js").then((e3) => e3.n), __vite__mapDeps([17, 5]))]), fe2 = () => {
    let e3 = null;
    try {
      e3 = g2.getAppliedSourceSnapshot().sources;
    } catch {
    }
    return de2({ version: s, clientEdition: re, state: l2?.modSelection.getState(), diagnostics: T2?.getDiagnostics(), sources: e3, patchStatus: g2.getStatus(), redact: getSettings().redactDiagnostics });
  };
  ue2(fe2);
  let { bindTroubleshooting: N2 } = await n(async () => {
    let { bindTroubleshooting: e3 } = await import("./mods/ModTroubleshooting.js");
    return { bindTroubleshooting: e3 };
  }, __vite__mapDeps([12, 13, 1, 14, 15, 16, 4, 5, 6, 7, 8, 9, 17, 10, 18]));
  N2(() => ({ status: g2.getStatus(), diagnostics: T2?.getDiagnostics() || {} }), fe2), $ = `phase-3:tab-registration`, await Promise.all([Q(Z.find((e3) => e3.id === `patcher`), async () => {
    (await n(() => import("./ui/tabs/Patcher.js"), __vite__mapDeps([54, 32, 1, 28, 5, 13, 29, 16, 9, 40, 4, 6, 7, 8, 39, 10, 18]))).bindPatcher(g2, y2, x2, { reload: M2 });
    let [e3, t3] = await Promise.all([n(() => import("./ui/tabs/Mods.js"), __vite__mapDeps([55, 4, 5, 6, 7, 8, 9, 49, 10])), n(() => import("./ui/tabs/ModManager.js"), __vite__mapDeps([56, 32, 1, 4, 5, 6, 7, 8, 9, 25, 13, 16, 22, 14, 23, 24, 20, 10, 26, 27, 28, 29, 18, 11, 55, 49, 54, 40, 39]))]);
    if (e3.bindMods(T2), l2) {
      let { bindModSettingsRegistry: e4 } = await n(async () => {
        let { bindModSettingsRegistry: e5 } = await import("./ui/tabs/Settings.js");
        return { bindModSettingsRegistry: e5 };
      }, __vite__mapDeps([22, 1, 13, 14, 7, 4, 5, 6, 8, 9, 23, 24, 25, 16, 20, 10, 26, 27, 28, 29, 18]));
      e4(l2.desiredSettings);
    }
    let r2 = null;
    if (!l2 && window.__TAURI_INTERNALS__) {
      let [{ prepareLegacyRuntimeMigration: e4 }, { createPackInstallStore: t4 }, { createConfigurationStorage: i4 }] = await Promise.all([n(() => import("./mods/LegacyRuntimeMigration.js"), __vite__mapDeps([57, 5, 29, 28, 13, 1, 16, 9, 37, 38, 39, 40, 4, 6, 7, 8, 58, 59, 25])), n(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([60, 13, 1, 29])), n(() => import("./mods/ModConfigurationStorage.js"), __vite__mapDeps([61, 13, 1]))]), a4 = t4();
      r2 = { storage: i4(), prepare: () => e4({ patcher: g2, installStore: a4 }) };
    }
    let i3 = l2 ? { pick: async (e4) => (await n(async () => {
      let { pickModPackage: e5 } = await import("./mods/ModPackagePicker.js");
      return { pickModPackage: e5 };
    }, __vite__mapDeps([62, 13, 1, 14, 29]))).pickModPackage(e4), prepare: l2.prepareInstall } : null, a3 = l2 && { ...l2.modSelection, async openRequirementSettings(e4) {
      J.switchTab(e4 === `experimental` ? `settings` : e4), e4 === `settings` && (await n(async () => {
        let { openPreferencesRoot: e5 } = await import("./ui/tabs/Preferences.js");
        return { openPreferencesRoot: e5 };
      }, __vite__mapDeps([31, 32, 1, 15, 16, 13, 4, 5, 6, 7, 8, 9, 22, 14, 23, 24, 25, 20, 10, 26, 27, 28, 29, 18, 11]))).openPreferencesRoot();
    }, async prepareApplication() {
      let e4 = await l2.modSelection.prepareApplication();
      return e4.mode === `immediate` ? { ...e4, async apply() {
        await e4.apply(), Y(g2.getStatus());
      } } : e4;
    } };
    return t3.createModManager(l2?.desiredSettings, r2, a3, i3);
  }), Q(Z.find((e3) => e3.id === `data`), async () => {
    let e3 = await n(() => import("./ui/tabs/Data.js"), __vite__mapDeps([63, 28, 5, 13, 1, 29, 16, 9, 4, 6, 7, 8, 10, 27, 18]));
    e3.bindData(g2, y2);
    let { bindGpnEditsEditor: t3 } = await n(async () => {
      let { bindGpnEditsEditor: e4 } = await import("./mods/FileLoader.js").then((e5) => e5.o);
      return { bindGpnEditsEditor: e4 };
    }, __vite__mapDeps([28, 5, 13, 1, 29, 16, 9]));
    return t3(l2 ? l2.edits || { save() {
      throw Error(`Restart normally before editing data`);
    }, remove() {
      throw Error(`Restart normally before editing data`);
    }, clear() {
      throw Error(`Restart normally before editing data`);
    }, async readJson() {
      return null;
    } } : null), { render: e3.render };
  })]), Je(l2).catch((e3) => K.warn(`Nest import readiness failed: ` + e3)), Y(_2), K.info(`Phase 3 complete \u2014 ${_2.packs.length} pack(s), ${_2.loaded.length} type(s) applied`), await A(`Cloud background operations`, async () => {
    if (!globalThis.window?.__TAURI_INTERNALS__) return;
    await (await n(async () => {
      let { installCloudSaveRequests: e3 } = await import("./platform/CloudSaveRequest.js");
      return { installCloudSaveRequests: e3 };
    }, __vite__mapDeps([64, 1, 47, 5, 2, 65, 66, 7, 51, 67, 59, 58, 38, 9, 8, 16, 13, 4, 6, 23, 24, 61, 50, 20, 10, 26, 27, 28, 29, 18]))).installCloudSaveRequests();
  }, { logger: K }), $ = `phase-4:post-init`, await A(`Discord RPC initialization`, async () => {
    let { updateActivity: e3 } = await n(async () => {
      let { updateActivity: e4 } = await import("./platform/DiscordPresence.js");
      return { updateActivity: e4 };
    }, __vite__mapDeps([68, 69, 1, 2, 13, 32]));
    await e3(`Using GP-Next 1.5.5`, `Playing version 0.16.1`) && K.info(`Discord RPC activity queued`);
  }, { logger: { error: (e3) => K.debug(e3) } }), Object.assign(window.gpNext, { init: () => M2(`manual-init`), reload: () => M2(), status: () => g2.getStatus(), setObjectsData: (...e3) => g2.setObjectsData(...e3), mods: { status: () => T2?.getStatus() || [], enableJsModding: () => ce2(), disableJsModding: () => le2(`console-disable-js-modding`), reload: async () => !T2 || !S2() ? [] : (await M2(`mods-reload`), T2.getStatus()), disposeAll: () => T2?.disposeAll() || [] }, worldMapJson: { status: () => E2?.getStatus() || { specs: [] }, reload: () => E2 ? k2(g2.getStatus().packs, `worldmap-only-reload`) : [] }, plantLevels: { isEnabled: () => isPlantLevelSystemEnabled(), status: () => g2.getPlantLevelSystemDebug(), get: (e3) => {
    let t3 = g2.getPlantLevelConfig(e3);
    return t3 ? c2.getPlantLevelState(e3, t3) : null;
  }, ensure: (e3) => {
    let t3 = g2.getPlantLevelConfig(e3);
    return t3 ? c2.ensurePlantLevelState(e3, t3) : null;
  }, setUnlocked: (e3, t3, n2) => {
    let r2 = g2.getPlantLevelConfig(e3);
    return r2 ? c2.setUnlockedLevel(e3, t3, r2, n2) : null;
  }, setSelected: (e3, t3, n2) => {
    let r2 = g2.getPlantLevelConfig(e3);
    return r2 ? c2.setSelectedLevel(e3, t3, r2, n2) : null;
  }, getBaseCodename: (e3) => g2.getPlantLevelBaseCodename(e3), getCloneCodename: (e3, t3) => g2.getPlantLevelCloneCodename(e3, t3) }, exportJson: (...e3) => y2.exportJson(...e3), exportLevel: (...e3) => y2.exportLevel(...e3), exportLang: (...e3) => g2.exportLang(...e3), restoreOriginal: (e3) => y2.restore(e3), restoreAll: () => y2.restoreAll(), listOrigins: () => y2.listBackups(), hasOrigin: (e3) => y2.hasBackup(e3), setFrameRate: (e3) => t2.game.setFrameRate(e3), cheats: { setSun: (e3) => {
    let n2 = t2.js.getClassByName(`SunCount`)?.component;
    n2 && n2.setSunCount(e3);
  }, addSun: (e3) => {
    let n2 = t2.js.getClassByName(`SunCount`)?.component;
    n2 && n2.SunAdd(e3 || 1e3);
  }, winLevel: () => {
    let e3 = t2.js.getClassByName(`levelController`), n2 = e3 ? t2.director.getScene()?.getComponentInChildren(e3) : null;
    n2 && n2.victory();
  } }, _toast: C, debug: { getPlantRegistry: () => g2.getPlantRegistryDebug(), getPlantLevels: () => g2.getPlantLevelSystemDebug(), getPlantLevelBadges: () => g2.getPlantLevelBadgeDebug() }, help: () => {
    console.log(`[GP Next] ========================================`), console.log(`[GP Next] GP-Next (Gardendless Patcher Next) v` + s), console.log(`[GP Next] Game Version: 0.16.1`), console.log(`[GP Next] Client Edition: ` + re), console.log(`[GP Next] ========================================`), console.log(``), console.log(`[GP Next] UI:`), console.log(`[GP Next]   .toggle()                   - Toggle overlay panel (${ot()})`), console.log(``), console.log(`[GP Next] PATCHER:`), console.log(`[GP Next]   .init()                     - Load all patches`), console.log(`[GP Next]   .reload()                   - Reload all patches from disk`), console.log(`[GP Next]   .status()                   - Show patcher status`), console.log(`[GP Next]   .setObjectsData(Type, alias, key, val)`), console.log(`[GP Next]   .setObjectsData(Type, alias, {key: val})`), console.log(`[GP Next]   .debug.getPlantRegistry()   - Inspect dynamic plant registry`), console.log(`[GP Next]   .debug.getPlantLevels()     - Inspect plant level registry`), console.log(`[GP Next]   .debug.getPlantLevelBadges()- Inspect level badge patch status`), console.log(`[GP Next]   .mods.status()              - Show JS mod runtime status`), console.log(`[GP Next]   .mods.reload()              - Reload JS mods from current pack set`), console.log(`[GP Next]   .plantLevels.status()       - Show plant level registry status`), console.log(`[GP Next]   .plantLevels.get(base)      - Read one plant level save entry`), console.log(`[GP Next]   .plantLevels.setUnlocked(base, level)`), console.log(`[GP Next]   .plantLevels.setSelected(base, level)`), console.log(``), console.log(`[GP Next] DATA:`), console.log(`[GP Next]   .exportJson(Type, useOriginal?, autoDownload?)`), console.log(`[GP Next]   .exportLevel(levelId, autoDownload?)`), console.log(`[GP Next]   .exportLang(useOriginal?, autoDownload?)`), console.log(`[GP Next]   .restoreOriginal(Type)      - Restore one type`), console.log(`[GP Next]   .restoreAll()               - Restore all types`), console.log(`[GP Next]   .listOrigins()              - List backed up types`), console.log(`[GP Next]   .hasOrigin(Type)            - Check if backup exists`), console.log(``), console.log(`[GP Next] GAME:`), console.log(`[GP Next]   .setFrameRate(fps)          - Change frame rate`), console.log(``), console.log(`[GP Next] CHEATS:`), console.log(`[GP Next]   .cheats.setSun(value)       - Set sun count`), console.log(`[GP Next]   .cheats.addSun(value)       - Add sun (default 1000)`), console.log(`[GP Next]   .cheats.winLevel()          - Win current level`), console.log(``);
    let e3 = String(x2 || ``).replace(/[\\/]+$/, ``);
    console.log(`[GP Next] Patch files: ` + e3 + `/patches`), console.log(`[GP Next] Docs: ` + pt());
  } }), window.__TAURI_INTERNALS__ && await (await n(async () => {
    let { reportCloudStartup: e3 } = await import("./platform/CloudColdHost.js");
    return { reportCloudStartup: e3 };
  }, __vite__mapDeps([70, 1, 47, 5, 66, 7, 51, 67, 59, 58, 38, 9, 8, 16, 13]))).reportCloudStartup(true), $ = `ready`, K.info(`Phase 4 complete \u2014 GP-Next fully initialized. Run gpNext.help() for commands.`);
})().catch(async (e2) => {
  if (r()) {
    let t3 = await i(e2), { showStartupFailure: r2 } = await n(async () => {
      let { showStartupFailure: e3 } = await import("./GameBootstrap.js").then((e4) => e4.r);
      return { showStartupFailure: e3 };
    }, __vite__mapDeps([47, 5, 1]));
    window.cc?.game?.pause(), r2(t3);
  }
  let t2 = e2?.stack || e2;
  K.error(`Initialization failed at ${$}: ${t2}`), bt(e2);
});
