import { installCocosAudio } from "./audio/CocosAudio.js";
import { applyFrameRate } from "./runtime/FrameRate.js";
import { getSettings } from "./core/SettingsStore.js";
import { initializeGameAudio } from "./audio/GameAudioBridge.js";
const __vite__mapDeps = (i2, m2 = __vite__mapDeps, d2 = m2.f || (m2.f = ["gpnext/platform/WindowBridge.js", "gpnext/platform/CloudJson.js", "gpnext/platform/Events.js", "gpnext/platform/FileSystem.js", "gpnext/platform/Opener.js", "gpnext/runtime/CocosStartup.js", "gpnext/platform/Dialog.js", "gpnext/ui/Components.js", "gpnext/core/SettingsStore.js", "gpnext/vendor/ModuleHelpers.js", "gpnext/platform/CloudPortablePreferences.js", "gpnext/runtime/TrainerShortcuts.js", "gpnext/mods/JsModdingRequired.js", "gpnext/ui/Translations.js", "gpnext/core/Logger.js", "gpnext/runtime/StartupAttempt.js", "gpnext/mods/PackPreparation.js", "gpnext/mods/FileLoader.js", "gpnext/mods/PackSnapshot.js", "gpnext/mods/GameConfiguration.js", "gpnext/mods/ModOperationPlan.js", "gpnext/mods/ModPackPreflight.js", "gpnext/mods/ModVersion.js", "gpnext/core/BuildIdentity.js", "gpnext/mods/ModConfigurationStorage.js", "gpnext/mods/FreshInstallation.js", "gpnext/mods/ModConfigurationState.js", "gpnext/mods/ConfigurationModSettings.js", "gpnext/mods/PackInstallStore.js", "gpnext/mods/JsModdingSelection.js", "gpnext/mods/Patcher.js", "gpnext/data/DataEntityLedger.js", "gpnext/mods/Isolation.js", "gpnext/runtime/PlantLevelState.js", "gpnext/mods/RestoreUtils.js", "gpnext/ui/Toast.js", "gpnext/mods/ModSaveBackupStorage.js", "gpnext/mods/ModSaveProtection.js", "gpnext/runtime/ColdStartHost.js", "gpnext/mods/JsModLoader.js", "gpnext/mods/ModApi.js", "gpnext/data/EntityInspector.js", "gpnext/mods/ModControlsRegistry.js", "gpnext/mods/ModOwnedDataStorage.js", "gpnext/mods/ModOwnedData.js", "gpnext/mods/ModSettingsRegistry.js", "gpnext/mods/ModSelection.js", "gpnext/runtime/StartupAttemptHost.js", "gpnext/platform/CloudColdHost.js", "gpnext/platform/CloudSelection.js", "gpnext/platform/CloudEnvironment.js", "gpnext/mods/ConfigurationRecovery.js", "gpnext/Main.js", "gpnext/core/ClientEdition.js", "gpnext/runtime/FrameSettings.js", "gpnext/ui/Overlay.js", "gpnext/data/DataDrawer.js"])) => i2.map((i3) => d2[i3]);
import { n as e } from "./vendor/ModuleHelpers.js";
import { f as t, i as n, n as r, p as i, r as a, t as o } from "./platform/CloudJson.js";
var s = 10 * 1024 * 1024, c = Object.freeze({ maxDepth: 36, maxNodes: 6e5 }), l = s, u = (e2) => r(e2, l, c), d = [`prepared`, `applying`, `verified`, `completed`, `rolling_back`, `rolled_back`], f = (e2) => {
  throw Error(e2);
};
async function p(e2, t2 = [`players`, `nativeSettings`, `modData`, `preferences`]) {
  let n2 = u(e2);
  (Object.keys(n2).some((e3) => ![`format`, `version`, `operationId`, `phase`, `components`].includes(e3)) || n2?.format !== `gp-next-cloud-restore` || n2.version !== 1 || !d.includes(n2.phase) || typeof n2.operationId != `string` || !/^[0-9a-f-]{36}$/.test(n2.operationId) || !Array.isArray(n2.components) || !n2.components.length || n2.components.length > t2.length) && f(`CLOUD_JOURNAL`);
  let r2 = /* @__PURE__ */ new Set();
  for (let e3 of n2.components) (Object.keys(e3).some((e4) => ![`name`, `previous`, `target`, `previousDigest`, `targetDigest`, `applied`].includes(e4)) || !t2.includes(e3.name) || r2.has(e3.name) || typeof e3.applied != `boolean` || await o(e3.previous) !== e3.previousDigest || await o(e3.target) !== e3.targetDigest) && f(`CLOUD_JOURNAL`), r2.add(e3.name);
  return n2;
}
function m({ components: e2, journal: t2, assertBoundary: r2, assertConfigurationIdle: i2, createOperationId: a2 = () => crypto.randomUUID() }) {
  let s2 = false, c2 = Object.keys(e2).sort(), l2 = async () => {
    r2(), await i2(), r2();
  }, d2 = (e3) => p(e3, c2), m2 = async (e3) => {
    await l2(), await t2.write(u(e3)), n(await d2(await t2.read())) !== n(e3) && f(`CLOUD_JOURNAL_WRITE`);
  }, h2 = async (e3) => {
    s2 && f(`CLOUD_BUSY`), s2 = true;
    try {
      return await l2(), await e3();
    } finally {
      s2 = false;
    }
  }, g2 = async (t3) => (await l2(), u(await e2[t3.name].read())), _2 = async (t3, n2, r3) => {
    await o(await g2(t3)) !== r3 && f(`CLOUD_RESTORE_CHANGED`), await l2(), await e2[t3.name].write(u(n2)), await o(await g2(t3)) !== await o(n2) && f(`CLOUD_RESTORE_VERIFY`);
  };
  return Object.freeze({ prepare(n2, r3) {
    return h2(async () => {
      let i3 = await t2.read();
      i3 && ![`completed`, `rolled_back`].includes((await d2(i3)).phase) && f(`CLOUD_RECOVERY_REQUIRED`);
      let s3 = Object.keys(n2).sort();
      (!s3.length || s3.some((e3) => !c2.includes(e3))) && f(`CLOUD_COMPONENTS`);
      let l3 = [];
      for (let t3 of s3) {
        let r4 = u(await e2[t3].read()), i4 = u(n2[t3]);
        await e2[t3].validate(i4), l3.push({ name: t3, previous: r4, target: i4, previousDigest: await o(r4), targetDigest: await o(i4), applied: false });
      }
      await o(l3.map(({ name: e3, previous: t3 }) => ({ name: e3, value: t3 }))) !== r3 && f(`CLOUD_RESTORE_CHANGED`);
      let p2 = { format: `gp-next-cloud-restore`, version: 1, operationId: a2(), phase: `prepared`, components: l3 };
      u(p2);
      for (let e3 of l3) await o(await g2(e3)) !== e3.previousDigest && f(`CLOUD_RESTORE_CHANGED`);
      return await m2(p2), { operationId: p2.operationId };
    });
  }, apply(n2) {
    return h2(async () => {
      let r3 = await d2(await t2.read());
      (r3.operationId !== n2 || r3.phase !== `prepared`) && f(`CLOUD_RESTORE_PHASE`);
      for (let t3 of r3.components) await o(await g2(t3)) !== t3.previousDigest && f(`CLOUD_RESTORE_CHANGED`), await e2[t3.name].validate(u(t3.target));
      r3.phase = `applying`, await m2(r3);
      for (let e3 of r3.components) await _2(e3, e3.target, e3.previousDigest), e3.applied = true, await m2(r3);
      for (let e3 of r3.components) await o(await g2(e3)) !== e3.targetDigest && f(`CLOUD_RESTORE_VERIFY`);
      return r3.phase = `verified`, await m2(r3), r3.phase = `completed`, await m2(r3), { restored: true, operationId: n2 };
    });
  }, inspectRollback(n2) {
    return h2(async () => {
      let r3 = await d2(await t2.read());
      r3.operationId !== n2 && f(`CLOUD_RESTORE_PHASE`);
      let i3 = false;
      for (let t3 of r3.components) {
        let n3 = await g2(t3), a3 = await o(n3), s3 = [`applying`, `rolling_back`].includes(r3.phase) && await e2[t3.name].isIntermediate?.(n3, t3.previous, t3.target);
        ![t3.previousDigest, t3.targetDigest].includes(a3) && !s3 && (i3 = true);
      }
      return { changed: i3 };
    });
  }, prepareRollback(n2) {
    return h2(async () => {
      let r3 = await d2(await t2.read());
      (r3.operationId !== n2 || r3.phase !== `completed` || typeof t2.archive != `function`) && f(`CLOUD_RESTORE_PHASE`);
      let i3 = [];
      for (let t3 of r3.components) {
        let n3 = await g2(t3), r4 = u(t3.previous);
        await e2[t3.name].validate(r4), i3.push({ name: t3.name, previous: n3, target: r4, previousDigest: await o(n3), targetDigest: t3.previousDigest, applied: false });
      }
      await l2(), await t2.archive(u(r3));
      for (let e3 of i3) await o(await g2(e3)) !== e3.previousDigest && f(`CLOUD_RESTORE_CHANGED`);
      let s3 = { format: `gp-next-cloud-restore`, version: 1, operationId: a2(), phase: `prepared`, components: i3 };
      return await m2(s3), { operationId: s3.operationId };
    });
  }, rollback(n2) {
    return h2(async () => {
      let r3 = await d2(await t2.read());
      (r3.operationId !== n2 || r3.phase === `rolled_back`) && f(`CLOUD_RESTORE_PHASE`);
      for (let t3 of r3.components) {
        let n3 = await g2(t3), i3 = await o(n3), a3 = [`applying`, `rolling_back`].includes(r3.phase) && await e2[t3.name].isIntermediate?.(n3, t3.previous, t3.target);
        ![t3.previousDigest, t3.targetDigest].includes(i3) && !a3 && f(`CLOUD_RESTORE_CHANGED`);
      }
      r3.phase = `rolling_back`, await m2(r3);
      for (let e3 of [...r3.components].reverse()) {
        let t3 = await o(await g2(e3));
        t3 !== e3.previousDigest && await _2(e3, e3.previous, t3), e3.applied = false, await m2(r3);
      }
      for (let e3 of r3.components) await o(await g2(e3)) !== e3.previousDigest && f(`CLOUD_RESTORE_VERIFY`);
      return r3.phase = `rolled_back`, await m2(r3), { rolledBack: true, operationId: n2 };
    });
  }, async inspect() {
    await l2();
    let e3 = await t2.read();
    if (e3 === null) return { required: false };
    let n2 = await d2(e3);
    return { required: ![`completed`, `rolled_back`].includes(n2.phase), phase: n2.phase, operationId: n2.operationId };
  } });
}
async function h(e2) {
  let t2 = await e2();
  if (t2 === null) return { blocked: false };
  let n2 = await p(a(t2, s, c));
  return { blocked: ![`completed`, `rolled_back`].includes(n2.phase), operationId: n2.operationId, phase: n2.phase };
}
var g;
async function _() {
  if (!globalThis.window?.__TAURI_INTERNALS__) return false;
  let e2;
  try {
    if ((await h(() => t(`cloud_journal_read`))).blocked) throw Error(`CLOUD_RECOVERY_REQUIRED`);
    return false;
  } catch (t2) {
    e2 = /^CLOUD_[A-Z_]+$/.test(t2?.message || ``) ? t2.message : `CLOUD_RECOVERY_INVALID`;
  }
  let n2 = navigator.language.toLowerCase().startsWith(`zh`), r2 = document.createElement(`main`);
  r2.style.cssText = `position:fixed;inset:0;z-index:999999;padding:32px;background:#181c22;color:#eee;font:16px system-ui;line-height:1.6`;
  let i2 = document.createElement(`h1`);
  i2.textContent = n2 ? `\u4E91\u5B58\u6863\u6062\u590D\u5C1A\u672A\u5B8C\u6210` : `Cloud save recovery is incomplete`;
  let a2 = document.createElement(`p`);
  a2.textContent = n2 ? `\u6E38\u620F\u542F\u52A8\u5DF2\u505C\u6B62\uFF0C\u539F\u5B58\u6863\u548C\u6062\u590D\u65E5\u5FD7\u5DF2\u4FDD\u7559\u3002` : `Game startup stopped. The original save and recovery log were retained.`;
  let o2 = document.createElement(`code`);
  o2.textContent = e2;
  let s2 = document.createElement(`button`);
  return s2.textContent = n2 ? `\u6253\u5F00\u6062\u590D\u7A97\u53E3` : `Open recovery window`, s2.onclick = () => t(`cloud_open`).catch(() => {
    o2.textContent = `CLOUD_WINDOW`;
  }), r2.append(i2, a2, o2, s2), document.body.append(r2), true;
}
function v() {
  return g ??= _(), g;
}
var y = `.avif`, b = 8, x = `.webp`;
async function S(e2) {
  await installCocosAudio(e2);
  let t2 = e2.macro?.SUPPORT_TEXTURE_FORMATS, n2 = e2.ImageAsset?.extnames;
  if (!Array.isArray(t2) || !Array.isArray(n2)) throw Error(`Cocos image format tables are unavailable`);
  if (t2.includes(y) || t2.push(y), n2.includes(y) || n2.push(y), n2.indexOf(y) !== b) throw Error(`Cocos AVIF format index must be ${b}`);
  let r2 = [[e2.assetManager?.downloader, `_downloaders`], [e2.assetManager?.factory, `_producers`], [e2.assetManager?.parser, `_parsers`]];
  for (let [e3, t3] of r2) {
    let n3 = e3?.[t3]?.[x];
    if (!e3?.register || typeof n3 != `function`) throw Error(`Cocos AVIF registration source is unavailable: ${t3}`);
    e3.register(y, n3);
  }
}
async function E() {
  await initializeGameAudio();
}
var D = `modulepreload`, O = function(e2) {
  return `/` + e2;
}, k = {}, A = function(e2, t2, n2) {
  let r2 = Promise.resolve();
  if (t2 && t2.length > 0) {
    let o2 = function(e4) {
      return Promise.all(e4.map((e5) => Promise.resolve(e5).then((e6) => ({ status: `fulfilled`, value: e6 }), (e6) => ({ status: `rejected`, reason: e6 }))));
    };
    let e3 = document.getElementsByTagName(`link`), i3 = document.querySelector(`meta[property=csp-nonce]`), a2 = i3?.nonce || i3?.getAttribute(`nonce`);
    r2 = o2(t2.map((t3) => {
      if (t3 = O(t3, n2), t3 in k) return;
      k[t3] = true;
      let r3 = t3.endsWith(`.css`), i4 = r3 ? `[rel="stylesheet"]` : ``;
      if (n2) for (let n3 = e3.length - 1; n3 >= 0; n3--) {
        let i5 = e3[n3];
        if (i5.href === t3 && (!r3 || i5.rel === `stylesheet`)) return;
      }
      else if (document.querySelector(`link[href="${t3}"]${i4}`)) return;
      let o3 = document.createElement(`link`);
      if (o3.rel = r3 ? `stylesheet` : D, r3 || (o3.as = `script`), o3.crossOrigin = ``, o3.href = t3, a2 && o3.setAttribute(`nonce`, a2), document.head.appendChild(o3), r3) return new Promise((e4, n3) => {
        o3.addEventListener(`load`, e4), o3.addEventListener(`error`, () => n3(Error(`Unable to preload CSS for ${t3}`)));
      });
    }));
  }
  function i2(e3) {
    let t3 = new Event(`vite:preloadError`, { cancelable: true });
    if (t3.payload = e3, window.dispatchEvent(t3), !t3.defaultPrevented) throw e3;
  }
  return r2.then((t3) => {
    for (let e3 of t3 || []) e3.status === `rejected` && i2(e3.reason);
    return e2().catch(i2);
  });
};
async function j() {
  i() && await A(() => import("./platform/WindowBridge.js"), __vite__mapDeps([0, 1, 2, 3, 4])), await E();
}
var M = `gpn-startup-failure`;
function N(e2 = globalThis.location?.href) {
  return !!e2 && new URL(e2).searchParams.get(`gpn-recovery`) === `1`;
}
function P(e2 = globalThis.location.href) {
  let t2 = new URL(e2);
  return t2.searchParams.set(`gpn-recovery`, `1`), t2.href;
}
function F(e2 = globalThis.location.href) {
  let t2 = new URL(e2);
  return t2.searchParams.delete(`gpn-recovery`), t2.href;
}
function I(e2) {
  let t2 = [], n2 = /* @__PURE__ */ new Map(), r2 = /* @__PURE__ */ new Set();
  for (let i2 = e2; i2 && !r2.has(i2) && t2.length < 6; i2 = i2.cause) {
    r2.add(i2);
    for (let e3 of Array.isArray(i2.status) ? i2.status : []) e3.state !== `failed` || !e3.namespace || n2.set(e3.namespace, { id: e3.namespace, name: e3.name || e3.namespace, version: e3.version || ``, evidence: `runtime`, phase: e3.phase || ``, errors: (e3.errors || []).map(String).slice(0, 5) });
    for (let e3 of i2.candidate?.packs || []) {
      let t3 = (i2.candidate.errors || []).filter((t4) => t4.dir === e3.dir).map((e4) => String(e4.message));
      !t3.length || !e3.meta?.uuid || n2.has(e3.meta.uuid) || n2.set(e3.meta.uuid, { id: e3.meta.uuid, name: e3.meta.name || e3.meta.uuid, version: e3.meta.version || ``, evidence: `preflight`, phase: `preflight`, errors: t3.slice(0, 5) });
    }
    t2.push({ code: typeof i2.code == `string` ? i2.code : ``, message: String(i2.message || i2).slice(0, 8e3) });
  }
  return { time: (/* @__PURE__ */ new Date()).toISOString(), phase: String(e2?.phase || `bootstrap`), causes: t2, modIssues: [...n2.values()] };
}
function L(e2, t2 = sessionStorage) {
  let n2 = I(e2);
  return t2.setItem(M, JSON.stringify(n2)), n2;
}
function R(e2 = sessionStorage) {
  try {
    let t2 = JSON.parse(e2.getItem(M));
    if (t2 && Array.isArray(t2.causes) && t2.causes.every((e3) => e3 && typeof e3.message == `string` && typeof e3.code == `string`) && typeof t2.phase == `string`) return t2;
  } catch {
  }
  return { phase: `bootstrap`, causes: [], time: null };
}
function z(e2) {
  let t2 = e2.causes.map((e3) => e3.code || ``), n2 = e2.causes.map((e3) => e3.message || ``).join(`
`);
  return t2.some((e3) => /SAVE_(INVALID|CONTENT_MISSING|BACKUP)/.test(e3)) ? `save` : /WebGL|graphics device|GPU|context lost/i.test(n2) ? `graphics` : /ENOENT|not found|missing|differs|dependency|incompatible|requires recovery|configuration|manifest/i.test(n2) ? `configuration` : /timed out|timeout/i.test(n2) ? `timeout` : `unknown`;
}
function B(e2, { redact: t2 = true, backup: n2 = null } = {}) {
  return { version: 1, time: e2.time, phase: e2.phase, category: z(e2), backup: n2 ? { time: n2.time, verified: true } : null, modIssues: (e2.modIssues || []).map((e3) => ({ id: e3.id, evidence: e3.evidence, phase: e3.phase, ...t2 ? {} : { name: e3.name, version: e3.version, errors: e3.errors } })), errors: e2.causes.map((e3) => ({ code: /^[A-Z][A-Z0-9_]{0,79}$/.test(e3.code) ? e3.code : `STARTUP_FAILED`, ...t2 ? {} : { message: e3.message } })) };
}
var V = e({ STARTUP_PHASES: () => H, StartupFailure: () => U, openStartupRecovery: () => G, showStartupFailure: () => K, startCocos: () => W }), H = Object.freeze([`beforeEngineImport`, `beforeEngineInit`, `beforeProject`, `afterProject`, `beforeRun`]), U = class extends Error {
  constructor(e2, t2) {
    super(`Cocos startup failed at ${e2}: ${t2?.message || String(t2)}`, { cause: t2 }), this.name = `StartupFailure`, this.phase = e2, this.restartRequired = true;
  }
};
async function W({ importEngine: e2, configureEngine: t2, initOptions: n2, phases: r2 = {}, timeoutMs: i2 = 3e4, onPhase: a2 = () => {
} }) {
  for (let [e3, t3] of Object.entries(r2)) if (!H.includes(e3) || typeof t3 != `function`) throw TypeError(`Invalid startup task: ${e3}`);
  if (!Number.isFinite(i2) || i2 <= 0) throw TypeError(`Invalid startup timeout`);
  let o2 = { ...r2 }, s2 = new AbortController(), c2 = `beforeEngineImport`, l2, u2 = [], d2 = { signal: s2.signal }, f2 = 0, p2 = async (e3) => {
    if (l2) throw l2;
    if (c2 = e3, e3 !== H[f2]) throw Error(`Unexpected startup phase: ${e3}`);
    if (f2 += 1, a2(e3), !o2[e3]) return;
    let t3, n3;
    try {
      await Promise.race([Promise.resolve().then(() => o2[e3](Object.freeze({ ...d2, phase: e3 }))), new Promise((e4, r3) => {
        t3 = setTimeout(() => r3(Error(`Task timed out after ${i2}ms`)), i2), n3 = () => {
          clearTimeout(t3), r3(s2.signal.reason);
        }, s2.signal.addEventListener(`abort`, n3, { once: true });
      })]);
    } catch (t4) {
      throw l2 = t4 instanceof U ? t4 : new U(e3, t4), s2.abort(l2), l2;
    } finally {
      clearTimeout(t3), s2.signal.removeEventListener(`abort`, n3);
    }
  };
  try {
    await p2(`beforeEngineImport`), c2 = `engineImport`;
    let r3 = await e2();
    d2.cc = r3, c2 = `engineConfiguration`, await t2(r3);
    for (let e3 of [`onPreProjectInitDelegate`, `onPostProjectInitDelegate`]) if (typeof r3.game[e3]?.add != `function` || typeof r3.game[e3]?.remove != `function`) throw Error(`Missing Cocos delegate: ${e3}`);
    for (let [e3, t3] of [[r3.game.onPreProjectInitDelegate, `beforeProject`], [r3.game.onPostProjectInitDelegate, `afterProject`]]) {
      let n3 = () => p2(t3);
      e3.add(n3), u2.push([e3, n3]);
    }
    return await p2(`beforeEngineInit`), c2 = `engineInit`, await r3.game.init(typeof n2 == `function` ? n2(r3) : n2), await p2(`beforeRun`), c2 = `gameRun`, await r3.game.run(), r3;
  } catch (e3) {
    throw l2 = e3 instanceof U ? e3 : new U(c2, e3), s2.abort(l2), l2;
  } finally {
    for (let [e3, t3] of u2) e3.remove(t3);
  }
}
async function G() {
  if (!N()) return false;
  try {
    let { renderStartupRecovery: e2 } = await A(async () => {
      let { renderStartupRecovery: e3 } = await import("./runtime/CocosStartup.js");
      return { renderStartupRecovery: e3 };
    }, __vite__mapDeps([5, 3, 1, 6, 7]));
    await e2(R());
  } catch (e2) {
    let t2 = document.createElement(`pre`);
    t2.style.cssText = `position:fixed;inset:24px;z-index:2147483647;background:#1c1c1e;color:#fff;padding:24px;white-space:pre-wrap`, t2.textContent = `Recovery unavailable: ${e2.message || e2}`, document.body.append(t2);
  }
  return true;
}
async function K(e2) {
  console.error(`[Cocos Bootstrap] failed to start game`, e2);
  try {
    L(e2);
  } catch {
  }
  let { isJsModdingRuntimeEnabled: t2 } = await A(async () => {
    let { isJsModdingRuntimeEnabled: e3 } = await import("./core/SettingsStore.js").then((e4) => e4.u);
    return { isJsModdingRuntimeEnabled: e3 };
  }, __vite__mapDeps([8, 9, 10, 11])), n2 = R();
  if (e2.jsModdingSuspended && !t2() && n2.causes.some((e3) => e3.code === `SAVE_CONTENT_MISSING`)) {
    let { showJsModdingRequired: e3 } = await A(async () => {
      let { showJsModdingRequired: e4 } = await import("./mods/JsModdingRequired.js");
      return { showJsModdingRequired: e4 };
    }, __vite__mapDeps([12, 13, 9, 8, 10, 11, 14, 7]));
    e3();
    return;
  }
  globalThis.location.replace(P());
}
var q, J, Y, X = false, Z = null;
function Q() {
  return J || null;
}
var ee = { async beforeEngineImport() {
  if (!globalThis.window?.__TAURI_INTERNALS__) return;
  let { consumeStartupAttempt: e2, assertStartupAttempt: t2, prepareStartupAttempt: n2 } = await A(async () => {
    let { consumeStartupAttempt: e3, assertStartupAttempt: t3, prepareStartupAttempt: n3 } = await import("./runtime/StartupAttempt.js");
    return { consumeStartupAttempt: e3, assertStartupAttempt: t3, prepareStartupAttempt: n3 };
  }, __vite__mapDeps([15, 16, 17, 9, 3, 1, 18, 19, 14, 20, 21, 22, 13, 8, 10, 11, 23])), r2 = e2(), { createConfigurationStorage: i2 } = await A(async () => {
    let { createConfigurationStorage: e3 } = await import("./mods/ModConfigurationStorage.js");
    return { createConfigurationStorage: e3 };
  }, __vite__mapDeps([24, 3, 1])), a2 = i2(), o2 = await a2.read();
  if (o2 === null) {
    let [{ initializeFreshPlatform: e3 }, { createPackInstallStore: t3 }] = await Promise.all([A(() => import("./mods/FreshInstallation.js"), __vite__mapDeps([25, 3, 1, 18, 26, 9, 27, 20, 14])), A(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([28, 3, 1, 18]))]);
    if (o2 = await e3({ storage: a2, installStore: t3() }), o2 === null) return;
  }
  let { createConfigurationState: s2 } = await A(async () => {
    let { createConfigurationState: e3 } = await import("./mods/ModConfigurationState.js").then((e4) => e4.r);
    return { createConfigurationState: e3 };
  }, __vite__mapDeps([26, 9, 27, 20, 14]));
  q = s2({ storage: a2 });
  let c2 = await q.load();
  if (r2) {
    let { createPackInstallStore: e3 } = await A(async () => {
      let { createPackInstallStore: e4 } = await import("./mods/PackInstallStore.js");
      return { createPackInstallStore: e4 };
    }, __vite__mapDeps([28, 3, 1, 18]));
    Z = await n2(c2, e3()), t2(r2, Z.binding), X = true;
    return;
  }
  await q.prepareFreshStartup({ isFresh: () => !X && !J });
  let [{ reconcileJsModdingSelection: l2 }, { createPackInstallStore: u2 }, { isJsModdingRuntimeEnabled: d2 }] = await Promise.all([A(() => import("./mods/JsModdingSelection.js"), __vite__mapDeps([29, 17, 9, 3, 1, 18, 19, 14])), A(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([28, 3, 1, 18])), A(() => import("./core/SettingsStore.js").then((e3) => e3.u), __vite__mapDeps([8, 9, 10, 11]))]);
  await l2(q, u2(), d2()), X = true;
}, async afterProject({ cc: e2, signal: t2 }) {
  if (!q) return;
  let [{ CorePatcher: n2 }, { createPackInstallStore: r2 }, { createNativeSaveBackupStorage: i2 }, { createNativeSaveBoundary: a2 }, { prepareColdStartHost: o2 }] = await Promise.all([A(() => import("./mods/Patcher.js"), __vite__mapDeps([30, 9, 3, 1, 6, 17, 18, 19, 14, 16, 20, 21, 22, 13, 8, 10, 11, 31, 32, 33, 34, 35])), A(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([28, 3, 1, 18])), A(() => import("./mods/ModSaveBackupStorage.js"), __vite__mapDeps([36, 3, 1, 37, 9])), A(() => import("./mods/ModSaveProtection.js").then((e3) => e3.r), __vite__mapDeps([37, 9])), A(() => import("./runtime/ColdStartHost.js"), __vite__mapDeps([38, 9, 18, 17, 3, 1, 19, 14, 16, 20, 21, 22, 13, 8, 10, 11, 23, 27, 39, 40, 41, 42, 43, 44, 37, 45, 35, 46, 31]))]);
  t2.throwIfAborted();
  let s2 = i2();
  if (Z) {
    let { createConfigurationStorage: i3 } = await A(async () => {
      let { createConfigurationStorage: e3 } = await import("./mods/ModConfigurationStorage.js");
      return { createConfigurationStorage: e3 };
    }, __vite__mapDeps([24, 3, 1]));
    if (localStorage.getItem(`gp-next-settings`) !== Z.preferences || JSON.stringify(await i3().read()) !== JSON.stringify(q.getState())) throw Error(`Configuration changed before startup attempt`);
    let { prepareStartupAttemptHost: o3 } = await A(async () => {
      let { prepareStartupAttemptHost: e3 } = await import("./runtime/StartupAttemptHost.js");
      return { prepareStartupAttemptHost: e3 };
    }, __vite__mapDeps([47, 39, 18, 17, 9, 3, 1, 19, 14, 22, 40, 13, 8, 10, 11, 41, 42, 20, 43, 44, 21, 37, 45, 35, 46, 16, 27, 31]));
    J = await o3({ review: Z, record: q.getState(), installStore: r2(), saveBoundary: a2({ storage: window.localStorage, backups: s2 }), patcher: new n2(), cc: e2, signal: t2 });
    return;
  }
  J = await o2({ configurationState: q, installStore: r2(), backups: s2, saveBoundary: a2({ storage: window.localStorage, backups: s2 }), patcher: new n2(), cc: e2, signal: t2 });
}, async beforeRun({ cc }) {
  applyFrameRate(cc.game, getSettings().frameRate);
  J && await J.publish();
} };
async function $(e2) {
  if (Y) return Y;
  if (Y = e2, globalThis.window?.__TAURI_INTERNALS__ && await (await A(async () => {
    let { reportCloudStartup: e3 } = await import("./platform/CloudColdHost.js");
    return { reportCloudStartup: e3 };
  }, __vite__mapDeps([48, 1, 49, 10, 44, 50, 26, 9, 27, 20, 14, 11, 19, 3]))).reportCloudStartup(false).catch(() => {
  }), J && J.getPhase() !== `active` && J.getPhase() !== `failed-restart-required`) try {
    await J.fail(e2);
  } catch (e3) {
    Y = e3;
  }
  let t2 = X ? q?.getState() : null;
  if (t2?.recovery?.required && (Y.recoveryRequiresRestart = true), t2?.desired.mods.some((e3) => e3.suspendedByJsModding) && (Y.jsModdingSuspended = true), t2 && !t2.journal && !t2.recovery?.required && !J) {
    let { revision: e3, ...n2 } = t2.active.configuration, { revision: r2, ...i2 } = t2.desired;
    JSON.stringify(n2) !== JSON.stringify(i2) && (Y.recoveryAction = async () => {
      let [{ restoreLastActiveSelection: e4 }, { createPackInstallStore: t3 }, { isJsModdingRuntimeEnabled: n3 }] = await Promise.all([A(() => import("./mods/ConfigurationRecovery.js"), __vite__mapDeps([51, 16, 17, 9, 3, 1, 18, 19, 14, 20, 21, 22, 13, 8, 10, 11, 37])), A(() => import("./mods/PackInstallStore.js"), __vite__mapDeps([28, 3, 1, 18])), A(() => import("./core/SettingsStore.js").then((e5) => e5.u), __vite__mapDeps([8, 9, 10, 11]))]);
      return e4({ configurationState: q, installStore: t3(), assertCandidateAllowed(e5) {
        if (e5.packs.some((e6) => e6.enabled !== false && e6.meta.js) && !n3()) throw Error(`JavaScript modding is disabled for this session`);
      } });
    });
  }
  return Y;
}
async function te() {
  if (!await v() && !await G()) try {
    await j();
    let e2 = document.getElementById(`GameCanvas`);
    if (!e2?.parentElement) throw Error(`GameCanvas or its parent was not found`);
    e2.addEventListener(`contextmenu`, (e3) => e3.preventDefault());
    let t2 = e2.parentElement.getBoundingClientRect();
    e2.width = t2.width, e2.height = t2.height, await W({ phases: ee, importEngine: () => window.System.import(`cc`), configureEngine: S, initOptions: (e3) => ({ debugMode: e3.DebugMode.ERROR, settingsPath: `src/settings.json`, overrideSettings: { profiling: { showFPS: false } } }) });
  } catch (e2) {
    K(await $(e2));
  }
}
if (typeof document !== "undefined" && document.getElementById("GameCanvas")) {
  te(), v().then((e2) => {
    e2 || N() || (A(() => import("./Main.js"), __vite__mapDeps([52, 9, 1, 2, 3, 6, 4, 18, 17, 19, 14, 22, 53, 13, 8, 10, 11, 54, 32, 7, 55, 56, 35])), A(() => import("./platform/WindowBridge.js"), __vite__mapDeps([0, 1, 2, 3, 4])));
  });
}
export {
  N as a,
  B as c,
  z as i,
  A as l,
  Q as n,
  F as o,
  V as r,
  P as s,
  $ as t,
  m as u
};
