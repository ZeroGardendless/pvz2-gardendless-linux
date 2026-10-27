const __vite__mapDeps = (i2, m2 = __vite__mapDeps, d2 = m2.f || (m2.f = ["gpnext/mods/ModConfigurationState.js", "gpnext/vendor/ModuleHelpers.js", "gpnext/mods/ConfigurationModSettings.js", "gpnext/mods/ModOperationPlan.js", "gpnext/core/Logger.js", "gpnext/mods/ModConfigurationStorage.js", "gpnext/platform/FileSystem.js", "gpnext/platform/CloudJson.js", "gpnext/mods/ModSaveBackupStorage.js", "gpnext/mods/ModSaveProtection.js", "gpnext/runtime/StartupAttempt.js", "gpnext/mods/PackPreparation.js", "gpnext/mods/FileLoader.js", "gpnext/mods/PackSnapshot.js", "gpnext/mods/GameConfiguration.js", "gpnext/mods/ModPackPreflight.js", "gpnext/mods/ModVersion.js", "gpnext/ui/Translations.js", "gpnext/core/SettingsStore.js", "gpnext/platform/CloudPortablePreferences.js", "gpnext/runtime/TrainerShortcuts.js", "gpnext/core/BuildIdentity.js", "gpnext/mods/PackInstallStore.js", "gpnext/mods/JsModdingSelection.js", "gpnext/mods/ConfigurationRecovery.js"])) => i2.map((i3) => d2[i3]);
import { a as e, c as t, i as n, l as r, o as i } from "../GameBootstrap.js";
import { c as a, d as o, f as s, l as c, o as l, r as u, s as d, t as f } from "../platform/FileSystem.js";
import { f as p, l as m, m as h, n as g, p as _, r as v, t as ee } from "../ui/Components.js";
import { n as te } from "../platform/Dialog.js";
var y = [`gp-next/configuration-state.json`, `gp-next/settings.json`, `gp-next/mod-settings.json`], b = `gp-next/save-backups/startup-recovery`, x = { baseDir: s.AppData }, S = { exists: f, mkdir: u, readTextFile: l, writeTextFile: o, rename: a, remove: d, stat: c };
function C(e2) {
  let t2 = {};
  for (let n2 = 0; n2 < e2.length; n2++) {
    let r2 = e2.key(n2);
    r2 && (r2.startsWith(`PvZ2_`) || r2 === `gp-next-settings`) && (t2[r2] = e2.getItem(r2));
  }
  return t2;
}
function ne({ storage: t2 = localStorage, fs: n2 = S, isFresh: i2 = e, installStore: a2 = null, attemptStorage: o2 } = {}) {
  let c2 = null, l2 = false, u2 = null, d2 = null, f2 = () => {
    if (!i2()) throw Error(`Restart into recovery before changing data`);
  }, p2 = async () => {
    let e2 = {};
    for (let t3 of y) e2[t3] = await n2.exists(t3, x) ? await n2.readTextFile(t3, x) : null;
    return e2;
  }, m2 = async () => {
    f2(), c2 = null;
    let e2 = { storage: C(t2), files: await p2() }, r2 = JSON.stringify(e2), i3 = [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(r2)))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``), a3 = { version: 1, time: (/* @__PURE__ */ new Date()).toISOString(), digest: i3, data: e2 }, o3 = `${b}/${Date.now()}-${crypto.randomUUID()}.json`, l3 = `${o3}.pending`;
    await n2.mkdir(b, { ...x, recursive: true });
    let u3 = JSON.stringify(a3);
    try {
      if (await n2.writeTextFile(l3, u3, x), await n2.readTextFile(l3, x) !== u3) throw Error(`Backup verification failed`);
      if (JSON.stringify({ storage: C(t2), files: await p2() }) !== r2) throw Error(`Data changed during backup`);
      if (await n2.rename(l3, o3, { oldPathBaseDir: s.AppData, newPathBaseDir: s.AppData }), await n2.readTextFile(o3, x) !== u3) throw Error(`Published backup verification failed`);
    } catch (e3) {
      throw await n2.exists(l3, x) && await n2.remove(l3, x), e3;
    }
    return c2 = { ...a3, path: o3 }, c2;
  }, h2 = async (e2) => {
    if (l2) throw Error(`A recovery operation is already running`);
    l2 = true;
    try {
      return f2(), await e2();
    } finally {
      l2 = false;
    }
  };
  return { getBackup: () => c2, backup: () => h2(m2), async inspect() {
    return h2(async () => {
      if (await m2(), (await n2.exists(y[0], x) ? await n2.readTextFile(y[0], x) : null) === null) return { canRecover: false, saveBackup: null };
      let { createConfigurationState: e2 } = await r(async () => {
        let { createConfigurationState: e3 } = await import("../mods/ModConfigurationState.js").then((e4) => e4.r);
        return { createConfigurationState: e3 };
      }, __vite__mapDeps([0, 1, 2, 3, 4])), { createConfigurationStorage: i3 } = await r(async () => {
        let { createConfigurationStorage: e3 } = await import("../mods/ModConfigurationStorage.js");
        return { createConfigurationStorage: e3 };
      }, __vite__mapDeps([5, 6, 7])), o3 = e2({ storage: i3(n2) }), s2 = await o3.load();
      u2 = { state: o3, record: s2 };
      let { revision: c3, ...l3 } = s2.desired, { revision: f3, ...p3 } = s2.active.configuration, h3 = !!s2.recovery || JSON.stringify(l3) !== JSON.stringify(p3), g2 = s2.recovery?.failedTarget?.backupId, _2 = null;
      if (g2) {
        let { createNativeSaveBackupStorage: e3 } = await r(async () => {
          let { createNativeSaveBackupStorage: e4 } = await import("../mods/ModSaveBackupStorage.js");
          return { createNativeSaveBackupStorage: e4 };
        }, __vite__mapDeps([8, 6, 7, 9, 1])), t3 = await e3(n2).read(g2);
        if (t3) {
          let e4 = JSON.parse(t3.raw ?? `[]`);
          if (!Array.isArray(e4)) throw Error(`Save backup has an invalid player list`);
          _2 = { id: g2, time: (await n2.stat(`gp-next/save-backups/native-player/${g2}.json`, x)).mtime, players: e4.length };
        }
      }
      let v2 = (s2.recovery?.failedTarget?.configuration || s2.desired).mods.filter((e3) => e3.enabled && JSON.stringify(e3) !== JSON.stringify(s2.active.configuration.mods.find((t3) => t3.id === e3.id))).map((e3) => ({ id: e3.id, name: e3.fallbackName || e3.id, version: e3.version, evidence: `changed`, errors: [] }));
      d2 = null;
      try {
        let [{ prepareStartupAttempt: e3 }, { createPackInstallStore: n3 }] = await Promise.all([r(() => import("./StartupAttempt.js"), __vite__mapDeps([10, 11, 12, 1, 6, 7, 13, 14, 4, 3, 15, 16, 17, 18, 19, 20, 21])), r(() => import("../mods/PackInstallStore.js"), __vite__mapDeps([22, 6, 7, 13]))]);
        d2 = await e3(s2, a2 || n3(), { preferences: t2.getItem(`gp-next-settings`) });
      } catch {
      }
      return { canRecover: h3, saveBackup: _2, suspects: v2, canDisableMods: true, canAttempt: !!d2 };
    });
  }, attemptStartup: () => h2(async () => {
    if (!u2 || !d2) throw Error(`No reviewed startup attempt is available`);
    await m2();
    let e2 = u2.state.getState();
    if (JSON.stringify(JSON.parse(await n2.readTextFile(y[0], x))) !== JSON.stringify(e2)) throw Error(`Configuration changed; reopen recovery`);
    let [{ prepareStartupAttempt: i3, assertStartupAttempt: s2, authorizeStartupAttempt: c3 }, { createPackInstallStore: l3 }] = await Promise.all([r(() => import("./StartupAttempt.js"), __vite__mapDeps([10, 11, 12, 1, 6, 7, 13, 14, 4, 3, 15, 16, 17, 18, 19, 20, 21])), r(() => import("../mods/PackInstallStore.js"), __vite__mapDeps([22, 6, 7, 13]))]), p3 = await i3(e2, a2 || l3(), { preferences: t2.getItem(`gp-next-settings`) });
    s2(d2, p3.binding), f2(), c3(p3.binding, o2 || sessionStorage), d2 = null;
  }), disableMods: ({ all: e2 = false } = {}) => h2(async () => {
    await m2();
    let i3 = JSON.parse(t2.getItem(`gp-next-settings`) || `{}`);
    if (!i3 || typeof i3 != `object` || Array.isArray(i3)) throw Error(`GP-Next preferences are invalid`);
    if (u2) {
      let t3 = u2.state.getState();
      if (JSON.stringify(JSON.parse(await n2.readTextFile(y[0], x))) !== JSON.stringify(t3)) throw Error(`Configuration changed; reopen recovery`);
      let i4;
      if (e2) i4 = { ...t3.desired, mods: t3.desired.mods.map(({ suspendedByJsModding: e3, ...t4 }) => ({ ...t4, enabled: false })) };
      else {
        let [{ projectJsModdingSelection: e3 }, { createCandidateReader: n3 }, { createPackInstallStore: o4 }] = await Promise.all([r(() => import("../mods/JsModdingSelection.js"), __vite__mapDeps([23, 12, 1, 6, 7, 13, 14, 4])), r(() => import("../mods/FileLoader.js").then((e4) => e4.o), __vite__mapDeps([12, 1, 6, 7, 13, 14, 4])), r(() => import("../mods/PackInstallStore.js"), __vite__mapDeps([22, 6, 7, 13]))]), s2 = a2 || o4(), c3 = await Promise.all(t3.desired.mods.map(async (e4) => {
          let t4 = await s2.read(e4.contentDigest);
          if (!t4 || t4.digest !== e4.contentDigest) throw Error(`Installed package is unavailable; use Disable all mods`);
          return n3(/* @__PURE__ */ new Map([[`recovery`, t4]])).describeInstalled(`recovery`, e4);
        }));
        i4 = e3(t3.desired, c3, false);
      }
      f2(), await u2.state.suspendForRecovery({ ...i4, revision: t3.desired.revision + 1 }, t3.desired.revision);
    } else if (e2) throw Error(`Mod configuration has not been verified`);
    f2();
    let o3 = JSON.stringify({ ...i3, experimental: { ...i3.experimental, jsModding: false } });
    if (t2.setItem(`gp-next-settings`, o3), t2.getItem(`gp-next-settings`) !== o3) throw Error(`JS Modding preference write failed`);
  }), resetPreferences: () => h2(async () => {
    if (await m2(), t2.removeItem(`gp-next-settings`), t2.getItem(`gp-next-settings`) !== null) throw Error(`Preference reset could not be verified`);
  }), recover: ({ restoreSave: e2 = false } = {}) => h2(async () => {
    if (!u2) throw Error(`No verified previous configuration`);
    await m2();
    let [{ recoverLastActiveConfiguration: a3, restoreLastActiveSelection: o3 }, { createPackInstallStore: s2 }, { createNativeSaveBoundary: c3 }, { createNativeSaveBackupStorage: l3 }, { isJsModdingRuntimeEnabled: d3 }] = await Promise.all([r(() => import("../mods/ConfigurationRecovery.js"), __vite__mapDeps([24, 11, 12, 1, 6, 7, 13, 14, 4, 3, 15, 16, 17, 18, 19, 20, 9])), r(() => import("../mods/PackInstallStore.js"), __vite__mapDeps([22, 6, 7, 13])), r(() => import("../mods/ModSaveProtection.js").then((e3) => e3.r), __vite__mapDeps([9, 1])), r(() => import("../mods/ModSaveBackupStorage.js"), __vite__mapDeps([8, 6, 7, 9, 1])), r(() => import("../core/SettingsStore.js").then((e3) => e3.u), __vite__mapDeps([18, 1, 19, 20]))]), f3 = { configurationState: u2.state, installStore: s2(), assertCandidateAllowed: (e3) => {
      if (e3.packs.some((e4) => e4.enabled !== false && e4.meta.js) && !d3()) throw Error(`JavaScript modding is disabled`);
    } };
    if (await n2.readTextFile(y[0], x) !== JSON.stringify(u2.state.getState())) {
      let e3 = JSON.parse(await n2.readTextFile(y[0], x));
      if (JSON.stringify(e3) !== JSON.stringify(u2.state.getState())) throw Error(`Configuration changed; reopen recovery`);
    }
    if (u2.record.recovery) {
      let r2 = l3(n2);
      return a3({ ...f3, backups: r2, restoreSave: e2, isFresh: i2, saveBoundary: c3({ storage: t2, backups: r2 }) });
    }
    if (e2) throw Error(`No save rollback is available`);
    return o3(f3);
  }) };
}
var re = { zh: { title: `\u542F\u52A8\u6062\u590D`, attempt: `\u5C1D\u8BD5\u5F3A\u5236\u542F\u52A8`, attemptPrompt: `\u672C\u6B21\u5C06\u8DF3\u8FC7\u4F9D\u8D56\u3001\u5305\u6570\u636E\u5B8C\u6574\u6027\u3001\u5B9E\u4F53\u53CA\u5B58\u6863\u7B49\u68C0\u67E5\uFF0C\u53EF\u80FD\u5BFC\u81F4\u6E38\u620F\u4E0D\u7A33\u5B9A\u3001\u8FDB\u5EA6\u4E22\u5931\u6216\u5B58\u6863\u635F\u574F\u3002\u5F53\u524D\u6570\u636E\u4F1A\u5148\u5907\u4EFD\u3002\u662F\u5426\u7EE7\u7EED\uFF1F`, related: `\u76F8\u5173\u6A21\u7EC4`, runtime: `\u52A0\u8F7D\u62A5\u9519`, preflight: `\u9884\u68C0\u672A\u901A\u8FC7`, changed: `\u5931\u8D25\u914D\u7F6E\u4E2D\u6709\u53D8\u66F4\uFF0C\u53EF\u80FD\u76F8\u5173`, noMod: `\u76EE\u524D\u6CA1\u6709\u8DB3\u591F\u8BC1\u636E\u5B9A\u4F4D\u5177\u4F53\u6A21\u7EC4\u3002`, disableJs: `\u5173\u95ED JS Modding`, disableAll: `\u7981\u7528\u6240\u6709\u6A21\u7EC4`, disableJsPrompt: `\u6682\u505C JS \u6A21\u7EC4\u53CA\u5176\u5FC5\u9700\u4F9D\u8D56\u6D88\u8D39\u8005\u540E\u91CD\u542F\uFF0C\u4FDD\u7559\u539F\u542F\u7528\u9009\u62E9\u3001\u5305\u6587\u4EF6\u548C\u5B58\u6863\u3002`, disableAllPrompt: `\u53D6\u6D88\u6240\u6709\u5DF2\u5B89\u88C5\u6A21\u7EC4\u7684\u542F\u7528\u9009\u62E9\u5E76\u5173\u95ED JS Modding\uFF0C\u4FDD\u7559\u5305\u6587\u4EF6\u3001\u8BBE\u7F6E\u548C\u5B58\u6863\u3002\u5B58\u6863\u5F15\u7528\u6A21\u7EC4\u5185\u5BB9\u65F6\u4ECD\u4F1A\u963B\u6B62\u52A0\u8F7D\u3002`, restart: `\u91CD\u65B0\u542F\u52A8`, backupPending: `\u6B63\u5728\u5907\u4EFD\u5F53\u524D\u6570\u636E\u2026`, backupReady: `\u5F53\u524D\u6570\u636E\u5DF2\u5907\u4EFD`, backupFailed: `\u5907\u4EFD\u5931\u8D25\uFF0C\u4FEE\u590D\u64CD\u4F5C\u5DF2\u505C\u7528`, retryBackup: `\u91CD\u65B0\u68C0\u67E5`, exportSave: `\u5BFC\u51FA\u5B58\u6863`, diagnose: `\u8BCA\u65AD`, details: `\u9519\u8BEF\u8BE6\u60C5`, exportReport: `\u5BFC\u51FA\u8BCA\u65AD`, redact: `\u9690\u85CF\u654F\u611F\u4FE1\u606F`, repair: `\u4FEE\u590D\u914D\u7F6E`, reset: `\u91CD\u7F6E GP-Next \u8BBE\u7F6E`, previous: `\u6062\u590D\u4E0A\u6B21\u914D\u7F6E`, restoreSave: `\u6062\u590D\u914D\u7F6E\u4E0E\u5B58\u6863`, recommended: `\u63A8\u8350`, confirm: `\u786E\u8BA4\u5E76\u91CD\u542F`, cancel: `\u53D6\u6D88`, failed: `\u64CD\u4F5C\u672A\u5B8C\u6210`, resetPrompt: `\u6062\u590D GP-Next \u9ED8\u8BA4\u8BBE\u7F6E\uFF0C\u4FDD\u7559\u5B58\u6863\u548C\u6A21\u7EC4\u914D\u7F6E\u3002\u5F53\u524D\u6570\u636E\u4F1A\u5148\u5907\u4EFD\u3002`, configPrompt: `\u6062\u590D\u4E0A\u6B21\u6210\u529F\u5E94\u7528\u7684\u6A21\u7EC4\u914D\u7F6E\uFF0C\u4FDD\u7559\u5F53\u524D\u5B58\u6863\u3002`, savePrompt: `\u6240\u6709\u73A9\u5BB6\u8FDB\u5EA6\u5C06\u56DE\u9000\u5230\u6B64\u5907\u4EFD\u3002\u5F53\u524D\u5B58\u6863\u4F1A\u53E6\u884C\u5907\u4EFD\uFF1B\u6A21\u7EC4\u81EA\u6709\u6587\u4EF6\u4E0D\u56DE\u9000\u3002`, saveTitle: `\u5B58\u6863\u6062\u590D`, players: `\u4F4D\u73A9\u5BB6`, unknown: `\u8BF7\u67E5\u770B\u9519\u8BEF\u8BE6\u60C5\u6216\u5BFC\u51FA\u8BCA\u65AD\u3002`, configuration: `\u68C0\u6D4B\u5230\u6A21\u7EC4\u914D\u7F6E\u6216\u8D44\u6E90\u95EE\u9898\u3002`, save: `\u68C0\u6D4B\u5230\u5B58\u6863\u6216\u6A21\u7EC4\u5185\u5BB9\u4F9D\u8D56\u95EE\u9898\u3002`, graphics: `\u68C0\u6D4B\u5230\u56FE\u5F62\u521D\u59CB\u5316\u9519\u8BEF\uFF0C\u8BF7\u68C0\u67E5\u663E\u5361\u9A71\u52A8\u6216\u6E38\u620F\u6587\u4EF6\u3002`, timeout: `\u542F\u52A8\u6B65\u9AA4\u8D85\u65F6\uFF0C\u53EF\u91CD\u542F\u6216\u67E5\u770B\u9519\u8BEF\u8BE6\u60C5\u3002`, inspectFailed: `\u914D\u7F6E\u68C0\u67E5\u672A\u5B8C\u6210`, saved: `\u5DF2\u5BFC\u51FA` }, en: { title: `Startup recovery`, attempt: `Try force start`, attemptPrompt: `This attempt skips dependency, package data integrity, entity and save checks. It may cause instability, lost progress or damaged saves. Current data will be backed up first. Continue?`, related: `Related mods`, runtime: `Loading failed`, preflight: `Preflight failed`, changed: `Changed in the failed configuration; possibly related`, noMod: `There is not enough evidence to identify a specific mod.`, disableJs: `Turn off JS Modding`, disableAll: `Disable all mods`, disableJsPrompt: `Pause JS mods and their required dependents, then restart. Keep selections, package files and saves.`, disableAllPrompt: `Clear all installed mod selections and turn off JS Modding. Keep packages, settings and saves. Missing mod content may still block a save.`, restart: `Restart`, backupPending: `Backing up current data\u2026`, backupReady: `Current data backed up`, backupFailed: `Backup failed; repairs disabled`, retryBackup: `Check again`, exportSave: `Export saves`, diagnose: `Diagnostics`, details: `Error details`, exportReport: `Export diagnostics`, redact: `Hide sensitive information`, repair: `Repair configuration`, reset: `Reset GP-Next settings`, previous: `Restore previous configuration`, restoreSave: `Restore configuration and saves`, recommended: `Recommended`, confirm: `Confirm and restart`, cancel: `Cancel`, failed: `Operation incomplete`, resetPrompt: `Reset GP-Next preferences; keep saves and mod configuration. Current data will be backed up first.`, configPrompt: `Restore the last successfully applied mod configuration; keep current saves.`, savePrompt: `All players return to this backup. Current saves will be backed up first; mod-owned files are not restored.`, saveTitle: `Save recovery`, players: `players`, unknown: `Review the error details or export diagnostics.`, configuration: `A mod configuration or resource problem was detected.`, save: `A save or mod-content dependency problem was detected.`, graphics: `Graphics initialization failed. Check graphics drivers or game files.`, timeout: `A startup step timed out. Restart or review the error details.`, inspectFailed: `Configuration check incomplete`, saved: `Exported` } }, ie = `
.gp-recovery-screen { position:fixed; inset:0; z-index:2147483647; overflow:auto; background:var(--gp-panel,#151517); color:var(--gp-text-primary,#f1f5f9); font:15px/1.6 var(--gp-font-ui); padding:32px 20px; color-scheme:var(--gp-color-scheme,dark); text-align:left; }
.gp-recovery-screen *, .gp-recovery-screen *::before { box-sizing:border-box; }
.gp-recovery-card { max-width:700px; margin:0 auto; background:var(--gp-card,#1c1c1e); border:1px solid var(--gp-border,#343438); border-radius:14px; padding:28px; box-shadow:0 16px 48px #0004; display:flex; flex-direction:column; gap:20px; }
.gp-recovery-card h1 { font:600 23px/1.35 var(--gp-font-ui); margin:4px 0 8px; }
.gp-recovery-card p { margin:0; }
.gp-recovery-card .gp-section { margin:0; }
.gp-recovery-card .gp-section-body { gap:12px; }
.gp-recovery-card .gp-btn { min-height:40px; white-space:normal; line-height:1.45; }
.gp-recovery-card .gp-btn-row { gap:10px; flex-wrap:wrap; }
.gp-recovery-card button[hidden] { display:none; }
.gp-recovery-card button:disabled { opacity:.45; cursor:default; }
.gp-recovery-card pre { margin:10px 0 0; max-height:240px; overflow:auto; white-space:pre-wrap; overflow-wrap:anywhere; font:13px/1.65 var(--gp-font-mono); color:var(--gp-secondary,#c7c7cc); }
.gp-recovery-card summary { cursor:pointer; padding:8px 0; }
.gp-recovery-status { padding:12px 14px; background:var(--gp-surface,#242426); border-radius:8px; overflow-wrap:anywhere; }
.gp-recovery-confirm { padding:16px; border:1px solid #b78a46; border-radius:8px; background:var(--gp-confirm,#30291f); display:flex; flex-direction:column; gap:12px; }
.gp-recovery-confirm[hidden] { display:none; }
.gp-recovery-error { color:var(--gp-error,#ff9b95); white-space:pre-wrap; overflow-wrap:anywhere; }
.gp-recovery-card .gp-badge { margin-left:8px; vertical-align:middle; flex:none; white-space:nowrap; }
.gp-recovery-mod { padding:14px 16px; background:var(--gp-surface,#ffffff05); border:1px solid var(--gp-border,#ffffff12); border-radius:10px; }
.gp-recovery-mod + .gp-recovery-mod { margin-top:8px; }
.gp-recovery-mod strong { display:block; font-size:15px; font-weight:600; }
.gp-recovery-mod-meta { font:12px/1.6 var(--gp-font-mono); color:var(--gp-muted,#aeb2bc); overflow-wrap:anywhere; }
.gp-recovery-evidence { margin-top:6px !important; color:var(--gp-warning,#dfbe86); font-size:13px; }
.gp-recovery-card .gp-text-muted { color:var(--gp-muted,#afb2bb); line-height:1.5; }
.gp-recovery-card .gp-section-title { letter-spacing:0; }
.gp-recovery-card .gp-btn:focus-visible { outline:2px solid #8bbfff; outline-offset:3px; }
@media(max-width:540px) { .gp-recovery-screen { padding:12px; } .gp-recovery-card { padding:18px; gap:16px; } .gp-recovery-card .gp-section-body > .gp-btn-row { flex-direction:column; } .gp-recovery-card .gp-section-body > .gp-btn-row .gp-btn { flex:0 0 auto; width:100%; } }
`;
async function renderStartupRecovery(e2, { service: r2 = ne(), locale: a2 } = {}) {
  if (!a2) try {
    a2 = JSON.parse(localStorage.getItem(`gp-next-settings`))?.locale;
  } catch {
  }
  let s2 = re[(typeof a2 == `string` ? a2 : navigator.language).startsWith(`zh`) ? `zh` : `en`], c2 = `dark`;
  try {
    c2 = JSON.parse(localStorage.getItem(`gp-next-settings`))?.theme;
  } catch {
  }
  h(c2);
  let l2 = document.createElement(`style`);
  l2.textContent = _ + ie, document.head.append(l2), document.querySelector(`.gp-recovery-screen`)?.remove();
  let u2 = document.createElement(`main`);
  u2.className = `gp-recovery-screen`;
  let d2 = document.createElement(`div`);
  d2.className = `gp-recovery-card`, u2.append(d2);
  let f2 = (e3, t2 = ``) => {
    let n2 = document.createElement(`p`);
    return n2.className = t2, n2.textContent = e3, n2;
  }, y2 = document.createElement(`header`);
  y2.append(f2(`GP-Next`, `gp-text-muted`));
  let b2 = document.createElement(`h1`);
  b2.textContent = s2.title, y2.append(b2, f2(s2[n(e2)])), d2.append(y2);
  let x2 = [], S2 = document.createElement(`div`), w2 = (t2) => {
    S2.replaceChildren();
    let n2 = new Map((e2.modIssues || []).map((e3) => [e3.id, e3]));
    for (let e3 of t2 || []) n2.has(e3.id) || n2.set(e3.id, e3);
    if (x2 = [...n2.values()], !n2.size) {
      S2.append(f2(s2.noMod, `gp-text-muted`));
      return;
    }
    for (let e3 of n2.values()) {
      let t3 = document.createElement(`article`);
      t3.className = `gp-recovery-mod`;
      let n3 = document.createElement(`strong`);
      if (n3.textContent = e3.name || e3.id, t3.append(n3, f2(`${e3.id}${e3.version ? ` \xB7 ` + e3.version : ``}`, `gp-recovery-mod-meta`), f2(s2[e3.evidence] || s2.changed, `gp-recovery-evidence`)), e3.errors?.length) {
        let n4 = document.createElement(`details`), r3 = document.createElement(`summary`), i2 = document.createElement(`pre`);
        r3.textContent = s2.details, i2.textContent = e3.errors.join(`
`), n4.append(r3, i2), t3.append(n4);
      }
      S2.append(t3);
    }
  };
  w2(), d2.append(m(s2.related, [S2]));
  let T = f2(s2.backupPending, `gp-recovery-status`);
  T.setAttribute(`role`, `status`), d2.append(T);
  let E = f2(``, `gp-recovery-error`);
  E.setAttribute(`role`, `status`);
  let D = false, O = true, k = [], A = [], j = (e3) => {
    D = e3;
    for (let t2 of k) t2.disabled = e3;
    for (let t2 of A) t2.disabled = e3 || !r2.getBackup();
  }, M = async (e3) => {
    if (!D) {
      j(true), E.textContent = ``;
      try {
        await e3();
      } catch (e4) {
        E.textContent = `${s2.failed} \xB7 ${e4.message || e4}`;
      } finally {
        j(false);
      }
    }
  }, N = (e3, t2, n2) => {
    let r3 = g(e3, () => M(t2), n2);
    return k.push(r3), r3;
  }, P = () => location.replace(i()), F = N(s2.restart, P), I = v(F);
  d2.append(I);
  let L = document.createElement(`div`);
  L.className = `gp-recovery-confirm`, L.hidden = true, L.setAttribute(`role`, `group`);
  let R = (e3, t2, n2) => {
    L.replaceChildren(), L.setAttribute(`aria-label`, e3);
    let r3 = document.createElement(`strong`);
    r3.textContent = e3;
    let i2 = N(s2.confirm, async () => {
      await n2(), P();
    }, { variant: `danger` }), a3 = N(s2.cancel, () => {
      L.hidden = true;
    });
    L.append(r3, f2(t2), v(a3, i2)), L.hidden = false, a3.focus(), L.scrollIntoView({ block: `nearest` });
  }, z = N(s2.attempt, () => R(s2.attempt, s2.attemptPrompt, () => r2.attemptStartup()));
  z.hidden = true, I.append(z), A.push(z);
  let B = document.createElement(`div`);
  B.className = `gp-btn-row`;
  let V = N(s2.reset, () => R(s2.reset, s2.resetPrompt, () => r2.resetPreferences())), H = N(s2.disableJs, () => R(s2.disableJs, s2.disableJsPrompt, () => r2.disableMods())), U = N(s2.disableAll, () => R(s2.disableAll, s2.disableAllPrompt, () => r2.disableMods({ all: true })));
  U.hidden = true, B.append(H, U, V), A.push(H, U, V);
  let W = m(s2.repair, [B]);
  d2.append(W, L);
  let G = async (e3, t2) => {
    let n2 = await te({ defaultPath: e3, filters: [{ name: `JSON`, extensions: [`json`] }] });
    n2 && (await o(n2, JSON.stringify(t2, null, 2)), E.textContent = s2.saved);
  }, ae = N(s2.exportSave, () => G(`gp-next-saves.json`, { version: 1, time: (/* @__PURE__ */ new Date()).toISOString(), storage: Object.fromEntries(Object.entries(C(localStorage)).filter(([e3]) => e3.startsWith(`PvZ2_`))) })), K = N(s2.retryBackup, () => $()), oe = v(ae, K);
  d2.insertBefore(oe, I);
  let q = document.createElement(`details`), J = document.createElement(`summary`);
  J.textContent = s2.details;
  let Y = document.createElement(`pre`);
  Y.textContent = [e2.phase, ...e2.causes.map((e3) => `${e3.code || ``} ${e3.message}`.trim())].join(`

`), q.append(J, Y);
  let se = N(s2.exportReport, () => G(`gp-next-startup-diagnostics.json`, t({ ...e2, modIssues: x2 }, { redact: O, backup: r2.getBackup() })));
  d2.append(m(s2.diagnose, [p(s2.redact, true, (e3) => {
    O = e3;
  }), v(se), q]), E);
  let X = (e3) => e3 ? new Date(e3).toLocaleString() : `\u2014`, Z = null, Q = null;
  async function $() {
    T.textContent = s2.backupPending, Z?.remove(), Z = null, Q?.remove(), Q = null;
    let t2 = false;
    z.hidden = true;
    try {
      let i3 = await r2.inspect();
      if (t2 = true, w2(i3.suspects), U.hidden = !i3.canDisableMods, z.hidden = !i3.canAttempt, i3.canRecover && (Z = N(s2.previous, () => R(s2.previous, s2.configPrompt, () => r2.recover())), A.push(Z), B.prepend(Z), [`configuration`, `save`].includes(n(e2)) && Z.append(ee(s2.recommended, `info`))), i3.canRecover && i3.saveBackup) {
        let e3 = i3.saveBackup, t3 = `${X(e3.time)} \xB7 ${e3.players} ${s2.players}`, n2 = N(s2.restoreSave, () => R(s2.restoreSave, `${t3}
${s2.savePrompt}`, () => r2.recover({ restoreSave: true })), { variant: `danger` });
        A.push(n2), Q = m(s2.saveTitle, [f2(t3), v(n2)]), d2.insertBefore(Q, L);
      }
    } catch (e3) {
      E.textContent = `${s2.inspectFailed} \xB7 ${e3.message || e3}`;
    }
    let i2 = r2.getBackup();
    T.textContent = i2 ? `${s2.backupReady} \xB7 ${X(i2.time)}` : s2.backupFailed, K.hidden = t2, j(D);
  }
  return document.body.append(u2), await M($), F.focus(), u2;
}
export {
  renderStartupRecovery
};
