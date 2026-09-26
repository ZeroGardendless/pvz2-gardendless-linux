import { r as e } from "../vendor/ModuleHelpers.js";
import { isJsModdingRuntimeEnabled, getGpNextFeatureState } from "../core/SettingsStore.js";
import { t as r } from "./Engine.js";
import { O as i, o as a, x as o } from "../mods/FileLoader.js";
import { n as s } from "../mods/PackSnapshot.js";
import { n as c, r as l, t as u } from "../mods/ModOperationPlan.js";
import { r as d, t as f } from "../mods/ModPackPreflight.js";
import { i as p, r as m, t as h } from "../mods/PackPreparation.js";
import { n as g, t as _ } from "../data/DataEntityLedger.js";
import { t as v } from "../mods/ModSettingsRegistry.js";
import { i as y, n as b, r as x } from "../mods/ConfigurationModSettings.js";
import { createJsModLoader } from "../mods/JsModLoader.js";
async function C(e2, { signal: t2 } = {}) {
  let n2 = () => {
    if (t2?.throwIfAborted(), e2.director.getScene()) throw Error(`Native data preparation requires a cold startup`);
  };
  n2();
  let r2 = await new Promise((t3, n3) => e2.assetManager.loadBundle(`resources`, (e3, r3) => e3 ? n3(e3) : t3(r3)));
  n2();
  let i2 = [[`plantFeatures`, `json/Features/PlantFeatures`, `PLANTS`], [`zombieFeatures`, `json/Features/ZombieFeatures`, `ZOMBIES`], [`plantProps`, `json/Objects/PlantProps`, `objects`], [`zombieProps`, `json/Objects/ZombieProps`, `objects`], [`plantTypes`, `json/Objects/PlantTypes`, `objects`], [`plantAlmanac`, `json/Objects/PlantAlmanac`, `objects`]], a2 = {};
  for (let [t3, o2, s2] of i2) {
    let i3 = await new Promise((t4, n3) => r2.load(o2, e2.JsonAsset, (e3, r3) => e3 ? n3(e3) : t4(r3)));
    if (n2(), !Array.isArray(i3?.json?.[s2])) throw Error(`Invalid native startup data: ${o2}`);
    a2[t3] = i3.json;
  }
  return Object.freeze(a2);
}
async function w({ candidate: e2, patcher: t2, loader: n2, cc: i2, saveBoundary: a2, previousLedger: o2, beforeScripts: s2, afterScripts: c2, signal: l2 }) {
  let u2 = m(e2), d2 = () => {
    if (l2?.throwIfAborted(), i2.director.getScene()) throw Error(`Cold mod activation cannot follow a scene launch`);
  };
  if (d2(), typeof s2 != `function`) throw Error(`Durable preparation callback is required before startup scripts`);
  if (!Array.isArray(o2)) throw Error(`Previous entity ledger is required`);
  let f2 = new Map(u2.snapshots), p2 = Object.freeze({ getPackSnapshotFrom: (e3) => f2.get(e3) || null, readTextFrom: async (e3, t3) => {
    let n3 = f2.get(e3);
    if (!n3) throw Error(`Missing prepared package snapshot`);
    return n3.readText(t3.replaceAll(`\\`, `/`));
  } }), h2, v2 = `preparing`, y2 = async () => {
    let e3 = [];
    try {
      h2 && await n2.abortStartup(h2);
    } catch (t3) {
      e3.push(t3);
    }
    if (e3.length) throw AggregateError(e3, `Cold mod preparation cleanup failed`);
  };
  try {
    r(i2);
    let f3 = await C(i2, { signal: l2 }), m2 = _(f3);
    d2(), t2.initCacheScan();
    let b2 = await t2.consumePrepared(e2, { deferRuntime: true });
    if (d2(), b2.errors.length) throw Error(`Cold data application failed: ` + b2.errors.join(`, `));
    let x2 = g({ original: m2, patched: f3, previousLedger: o2 }), S2 = { ledger: o2 }, w2 = await a2.capture();
    return d2(), await s2(Object.freeze({ plan: S2, backup: w2 })), d2(), h2 = await n2.beginStartupFromPacks(u2.allPacks, { fileLoader: p2 }), d2(), S2.ledger = await h2.prepareRegistrations({ previousIdentities: o2, identities: x2 }), a2.checkAvailable(o2, S2.ledger), await c2(S2.ledger), d2(), v2 = `prepared`, Object.freeze({ plan: S2, backup: w2, patcher: t2, loader: n2, result: b2, getState: () => v2, getResourceConsumers: () => Object.freeze(h2.getResources()), publish() {
      if (d2(), v2 !== `prepared`) throw Error(`Cold mod runtime is not ready for publication`);
      a2.checkAvailable(o2, S2.ledger), h2.markInUse(), v2 = `publishing`;
      try {
        if (t2.publishPreparedDataIdentities(x2), h2.publishRegistrations(), !t2.installLoadHook()) throw Error(`Native data load hook is unavailable`);
        t2.installSceneHook(), a2.beginNativeReads(), v2 = `published`;
      } catch (e3) {
        throw v2 = `failed-restart-required`, e3;
      }
    }, async activate() {
      if (v2 !== `published` || !i2.director.getScene()) throw Error(`Native startup must finish before mod activation`);
      v2 = `activating`;
      try {
        if (l2?.throwIfAborted(), await t2.activatePreparedRuntime(), l2?.throwIfAborted(), b2.errors.length) throw Error(`Runtime extensions failed: ` + b2.errors.join(`, `));
        return await n2.completeStartup(h2), l2?.throwIfAborted(), v2 = `active`, b2;
      } catch (e3) {
        throw v2 = `failed-restart-required`, e3;
      }
    }, async abort() {
      if (v2 !== `aborted`) {
        if (v2 !== `prepared`) throw Error(`Published cold runtime requires restart`);
        v2 = `aborted`, await y2();
      }
    } });
  } catch (e3) {
    try {
      await y2();
    } catch (t3) {
      throw AggregateError([e3, t3], `Cold mod preparation failed`);
    }
    throw e3;
  }
}
function T({ configurationState: e2, saveBoundary: t2, backups: n2, operationPlan: r2, currentInput: i2, resolveOperation: a2 }) {
  let o2 = e2.getState();
  if (o2.journal || o2.recovery?.required) throw Error(`Resolve startup recovery before loading mods`);
  let s2 = [o2.active.entityLedger, ...o2.failedEntityTargets.map((e3) => e3.entityLedger)];
  if (s2.some((e3) => !Array.isArray(e3))) throw Error(`Previous mod entity identities require migration`);
  let c2 = structuredClone({ operationPlan: r2, currentInput: i2 }), l2 = null, u2 = `ready`, d2 = () => {
    if (e2.getState() !== o2) throw Error(`Configuration changed during cold preparation`);
  }, f2 = (e3) => {
    for (let n3 of s2) t2.checkAvailable(n3, e3);
  };
  return Object.freeze({ getPhase: () => u2, checkAvailable: f2, async beforeScripts({ plan: t3, backup: r3 }) {
    if (u2 !== `ready`) throw Error(`Cold startup journal has already been used`);
    u2 = `preparing`;
    try {
      let i3 = structuredClone(t3.ledger), s3 = r3.id;
      if (r3.digest !== s3) throw Error(`Verified native save backup is missing`);
      d2(), f2(i3);
      let p2 = await n2.read(s3);
      if (!p2 || p2.digest !== s3) throw Error(`Verified native save backup is missing`);
      d2(), f2(i3);
      let m2 = a2 ? a2() : { plan: c2.operationPlan, input: c2.currentInput };
      l2 = await e2.beginColdStart({ targetEntityLedger: i3, backupId: s3, previousEntityLedger: o2.active.entityLedger, ...m2?.plan === void 0 ? {} : { plan: m2.plan, currentInput: m2.input } }), u2 = `pending`;
    } catch (e3) {
      throw u2 = `failed`, e3;
    }
  }, async prepared(t3) {
    if (u2 !== `pending`) throw Error(`Cold startup journal is not pending`);
    f2(t3), await e2.updateColdStartIdentities(l2, t3);
  }, async complete(t3) {
    if (u2 !== `pending`) throw Error(`Cold startup journal is not pending`);
    u2 = `completing`;
    try {
      let n3 = await e2.complete(l2, { success: true, level: `restart-required`, coldStartVerified: true, ...t3 === void 0 ? {} : { modSettings: t3 } });
      return u2 = `complete`, n3;
    } catch (e3) {
      throw u2 = `pending`, e3;
    }
  }, async fail(t3) {
    if (u2 === `complete` || u2 === `failing` || u2 === `completing` || u2 === `preparing`) throw Error(`Cold startup journal cannot fail in this phase`);
    if (!(!l2 || u2 === `failed`)) {
      u2 = `failing`;
      try {
        await e2.fail(l2, { reason: t3?.message || `cold-start-failed`, session: `restart-required`, persistent: `unknown` }), u2 = `failed`;
      } catch (e3) {
        throw u2 = `pending`, e3;
      }
    }
  } });
}
function E(e2) {
  let t2 = e2.getState(), n2 = structuredClone(x(t2.desired.modSettings)), r2 = `staging`, i2, a2, o2 = new Set(t2.desired.mods.filter((e3) => e3.enabled).map(b)), s2 = v({ initialData: n2, canNotify: () => [`active`, `suspending`].includes(r2), storage: { async write(t3, a3) {
    if (!o2.has(a3.namespace)) throw Error(`Mod settings namespace is not active in this configuration`);
    if (![`staging`, `sealing`, `active`, `suspending`].includes(r2)) throw Error(`Mod settings transaction is closed or committing`);
    for (let e3 of /* @__PURE__ */ new Set([...Object.keys(n2.mods), ...Object.keys(t3.mods)])) if (e3 !== a3.namespace && JSON.stringify(n2.mods[e3]) !== JSON.stringify(t3.mods[e3])) throw Error(`Mod settings write crosses namespace ownership`);
    (r2 === `active` || r2 === `suspending`) && await e2.writeActiveModSettings({ generation: i2, namespace: a3.namespace, previous: n2.mods[a3.namespace], next: t3.mods[a3.namespace] }), n2 = structuredClone(t3);
  } } }), c2 = () => {
    let t3 = e2.getState();
    if (t3.journal || t3.recovery?.required || t3.active.generation !== i2 || JSON.stringify(t3.active.configuration.modSettings) !== JSON.stringify(n2)) throw Error(`Active mod settings changed or require recovery`);
  };
  return Object.freeze({ registry: s2, async seal() {
    if (r2 !== `staging`) throw Error(`Mod settings are not staging`);
    if (a2 = s2.suspendMutations(), r2 = `sealing`, await a2.ready, r2 !== `sealing`) throw Error(`Mod settings transaction is closed`);
    return r2 = `committing`, structuredClone(n2);
  }, activate() {
    if (r2 !== `committing`) throw Error(`Mod settings have not been sealed`);
    let o3 = e2.getState(), s3 = y(t2.desired, n2);
    if (o3.journal || o3.recovery?.required || o3.active.generation !== t2.active.generation + 1 || JSON.stringify({ ...o3.active.configuration, revision: 0 }) !== JSON.stringify({ ...s3, revision: 0 })) throw Error(`Mod settings activation was not committed`);
    i2 = o3.active.generation, a2.resume(), a2 = null, r2 = `active`;
  }, async suspend() {
    if (r2 !== `active`) throw Error(`Mod settings are not active`);
    if (a2 = s2.suspendMutations(), r2 = `suspending`, await a2.ready, r2 !== `suspending`) throw Error(`Mod settings transaction is closed`);
    return r2 = `suspended`, c2(), structuredClone(n2);
  }, resume() {
    if (r2 !== `suspended`) throw Error(`Mod settings are not suspended`);
    c2(), a2.resume(), a2 = null, r2 = `active`;
  }, discard() {
    a2 ||= s2.suspendMutations(), a2.close(), r2 = `closed`;
  } });
}
function D(e2, t2) {
  let n2 = () => {
    let n3 = e2.getState();
    return n3.journal || n3.recovery?.required ? [] : t2.getRegisteredModSettings().filter((e3) => {
      let t3 = n3.active.configuration.mods.find((t4) => t4.enabled && b(t4) === e3.namespace), r3 = t3 && n3.desired.mods.find((e4) => e4.id === t3.id);
      return r3 && r3.version === t3.version && r3.contentDigest === t3.contentDigest;
    });
  }, r2 = async (t3, r3) => {
    let i2 = n2().find((e3) => e3.namespace === t3);
    if (!i2) throw Error(`Settings for this selected mod version are unavailable`);
    let a2 = e2.getState(), o2 = a2.desired.modSettings.mods[t3];
    if (!o2 || o2.schemaVersion !== i2.schemaVersion) throw Error(`Selected mod settings require migration`);
    let s2 = v({ initialData: a2.desired.modSettings, storage: { async write(t4) {
      if (e2.getState() !== a2) throw Error(`Mod settings changed; reopen the settings panel`);
      JSON.stringify(t4) !== JSON.stringify(a2.desired.modSettings) && (await e2.saveDesired({ ...y(a2.desired, t4), revision: a2.desired.revision + 1 }, a2.desired.revision), a2 = e2.getState());
    } } });
    await s2.registerModSettings(i2);
    let c2 = a2.desired.mods.find((e3) => b(e3) === t3);
    return r3(s2, { version: c2.version, contentDigest: c2.contentDigest, schemaVersion: i2.schemaVersion }, a2.desired.revision);
  };
  return Object.freeze({ getRegisteredModSettings: n2, subscribe(t3, n3) {
    let r3 = (e3) => JSON.stringify({ settings: e3.desired.modSettings.mods[t3], selected: e3.desired.mods.find((e4) => b(e4) === t3), active: e3.active.configuration.mods.find((e4) => b(e4) === t3), journal: e3.journal?.token ?? null, recovery: e3.recovery }), i2 = r3(e2.getState());
    return e2.subscribe((e3) => {
      let t4 = r3(e3);
      t4 !== i2 && (i2 = t4, n3());
    });
  }, getModSettings: (e3) => r2(e3, async (t3, n3, r3) => ({ ...await t3.getModSettings(e3), editIdentity: n3, revision: r3 })), updateModSetting: (e3, t3, n3, i2) => {
    let a2 = structuredClone(n3), o2 = i2 && structuredClone(i2);
    return r2(e3, async (n4, r3) => {
      let i3 = await n4.getModSettings(e3);
      if (o2 && JSON.stringify(o2.editIdentity) !== JSON.stringify(r3)) throw Object.assign(Error(`The mod version or settings schema changed; reopen the panel`), { code: `MOD_SETTING_CONTEXT_CHANGED` });
      if (o2 && JSON.stringify(o2.value) !== JSON.stringify(i3.values[t3])) throw Object.assign(Error(`This setting changed since it was displayed`), { code: `MOD_SETTING_CONFLICT`, currentValue: structuredClone(i3.values[t3]), editIdentity: r3 });
      return n4.updateModSetting(e3, t3, a2);
    });
  }, resetModSettings: (e3) => r2(e3, (t3) => t3.resetModSettings(e3)), exportModSettings: (e3) => r2(e3, (t3) => t3.exportModSettings(e3)) });
}
function O({ candidate: e2, state: t2, buildId: n2, cc: r2 }) {
  if (typeof n2 != `string` || !/^[a-f0-9]{64}$/.test(n2)) throw Error(`Native build identity is unavailable`);
  if (r2.director.getScene()) throw Error(`Cold operation plan requires a fresh native session`);
  h(e2, t2.desired);
  let i2 = new Map(e2.packs.map((e3, n3) => [String(e3.meta.uuid || e3.meta.name || e3.dir).trim(), t2.desired.mods[n3].id])), a2 = e2.packs.map((e3, n3) => ({ ...t2.desired.mods[n3], depends: (e3.meta.depends || []).map((e4) => i2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => i2.has(e4) ? [i2.get(e4)] : []) })), o2 = { desired: t2.desired, active: t2.active, installed: a2, buildId: n2, evidence: { buildId: n2, revision: 1, consumers: { complete: true, edges: [], lifetime: `fresh-process` }, operations: [] } }, s2 = c(o2);
  return o2.evidence.operations = s2.operations.map((e3) => ({ ...e3, verified: true, level: `restart-required`, proof: `cold-v1: exact installed bytes, native baseline and data validated before first scene; all runtimes recreated`, paths: { coldStart: true } })), { plan: c(o2), input: o2 };
}
function k(e2, { prepare: t2, installStore: n2, canEdit: r2 = () => true, prepareApplication: i2, restart: o2 = () => globalThis.location.reload() }) {
  return Object.freeze({ getState: () => e2.getState(), async prepareApplication() {
    let e3 = await i2?.();
    if (e3) return e3;
    let t3 = await this.prepareRestart();
    return Object.freeze({ mode: `restart-required`, ...t3 });
  }, async prepareRestart() {
    let n3 = e2.getState();
    if (!r2() || n3.journal || n3.recovery?.required) throw Error(`Mod configuration is not ready for application`);
    await t2(n3.desired);
    let i3 = () => {
      if (!r2() || e2.getState() !== n3) throw Error(`Mod configuration changed; check it again before restarting`);
    };
    return i3(), Object.freeze({ restart() {
      i3(), o2();
    } });
  }, async discardPending(n3) {
    let i3 = e2.getState();
    if (!r2() || i3.journal || i3.recovery?.required) throw Error(`Mod configuration is not ready for editing`);
    if (i3.desired.revision !== n3) throw Error(`Mod configuration changed; reload the selection`);
    let a2 = { ...i3.active.configuration, revision: n3 + 1 };
    if (await t2(a2), !r2() || e2.getState() !== i3) throw Error(`Mod configuration changed during validation`);
    return e2.saveDesired(a2, n3);
  }, async describe(t3) {
    let r3 = e2.getState(), i3 = r3.desired.mods.find((e3) => e3.id === t3);
    if (!i3) throw Error(`Mod is no longer installed`);
    let o3 = await n2.read(i3.contentDigest);
    if (o3.digest !== i3.contentDigest) throw Error(`Installed content does not match the selected version`);
    let { meta: s2 } = await a(/* @__PURE__ */ new Map([[`details`, o3]])).describeInstalled(`details`, i3);
    if (e2.getState() !== r3) throw Error(`Mod configuration changed; reopen the details`);
    let c2 = r3.active.configuration.mods.find((e3) => e3.id === t3 && e3.enabled), l2 = !!c2 !== i3.enabled || !!c2 && (c2.contentDigest !== i3.contentDigest || JSON.stringify(c2.settings) !== JSON.stringify(i3.settings));
    return Object.freeze({ namespace: b(i3), pending: l2, activeVersion: c2?.version ?? null, name: s2.name, version: s2.version, author: s2.author, description: s2.description, depends: Object.freeze([...s2.depends]), optionalDepends: Object.freeze([...s2.optionalDepends]), containsScripts: !!s2.js, files: Object.freeze(o3.listPaths()) });
  }, async save(n3, i3) {
    let a2 = structuredClone(n3), o3 = e2.getState();
    if (!r2() || o3.journal || o3.recovery?.required) throw Error(`Mod configuration is not ready for editing`);
    if (o3.desired.revision !== i3) throw Error(`Mod configuration changed; reload the selection`);
    let s2 = new Map(o3.desired.mods.map((e3) => [e3.id, e3]));
    if (!Array.isArray(a2) || a2.length !== s2.size || new Set(a2.map((e3) => e3.id)).size !== s2.size || a2.some((e3) => !s2.has(e3.id) || typeof e3.enabled != `boolean`)) throw Error(`Selection must contain every installed mod exactly once`);
    let c2 = a2.map((e3) => ({ ...s2.get(e3.id), enabled: e3.enabled }));
    if (JSON.stringify(c2) === JSON.stringify(o3.desired.mods)) return o3;
    let l2 = { ...o3.desired, revision: i3 + 1, mods: c2 };
    if (await t2(l2), !r2() || e2.getState() !== o3) throw Error(`Mod configuration changed during validation`);
    return e2.saveDesired(l2, i3);
  } });
}
var A = e(i(), 1);
async function j({ snapshot: e2, configurationState: t2, installStore: n2, canEdit: r2, hasFeature: i2, assertCandidateAllowed: c2 }) {
  let u2 = t2.getState(), m2 = () => {
    if (!r2() || u2.journal || u2.recovery?.required || t2.getState() !== u2) throw Error(`Mod configuration changed; prepare the installation again`);
  };
  m2();
  let h2 = await s(e2.listPaths().map((t3) => [t3, e2.readBytes(t3)]));
  if (h2.digest !== e2.digest) throw Error(`Import bytes do not match their digest`);
  let g2 = A.default.parse(h2.readText(`pack.json`) || `null`);
  if (!g2 || typeof g2.uuid != `string` || !g2.uuid.trim() || g2.uuid !== g2.uuid.trim() || g2.uuid.startsWith(`legacy:`)) throw Error(`Imported mods require a stable pack.json uuid`);
  let _2 = u2.desired.mods.find((e3) => e3.id === g2.uuid), v2 = { ..._2, id: g2.uuid, version: String(g2.version || `1.0.0`), contentDigest: h2.digest, fallbackName: String(g2.name || g2.uuid), runtimeNamespace: g2.uuid, legacy: false, enabled: _2?.enabled ?? false }, b2 = a(/* @__PURE__ */ new Map([[`incoming`, h2]])), x2 = await b2.describeInstalled(`incoming`, v2);
  if (d(x2, { hasFeature: i2 }), x2.meta.js) {
    let e3 = await f(x2, { fileLoader: b2, hasFeature: i2 });
    if (e3.errors.length) throw Error(e3.errors.join(`; `));
  }
  let S2 = await o(`incoming`, b2);
  if (S2.errors.length) throw Error(S2.errors.join(`; `));
  let C2 = _2 ? u2.desired.mods.map((e3) => e3.id === v2.id ? v2 : e3) : [...u2.desired.mods, v2], w2 = l(y({ ...u2.desired, revision: u2.desired.revision + 1, mods: C2 }, u2.desired.modSettings)), T2 = await p({ configuration: w2, installStore: { read: (e3) => e3 === h2.digest ? Promise.resolve(h2) : n2.read(e3) } });
  c2(T2), m2();
  let E2 = false, D2 = false;
  return Object.freeze({ preview: l({ id: v2.id, name: x2.meta.name, version: x2.meta.version, previousVersion: _2?.version ?? null, update: !!_2, enabled: v2.enabled, containsScripts: !!x2.meta.js, unchanged: _2?.contentDigest === h2.digest }), async commit() {
    if (E2 || D2) throw Error(`Installation is already committing or committed`);
    m2(), c2(T2), E2 = true;
    try {
      if (_2?.contentDigest === h2.digest) return D2 = true, u2;
      await n2.install(h2), m2(), c2(T2);
      let e3 = await t2.saveDesired(w2, u2.desired.revision);
      return D2 = true, e3;
    } finally {
      E2 = false;
    }
  } });
}
function M({ configurationState: e2, saveBoundary: t2, backups: n2, plan: r2, getCurrentInput: i2 }) {
  let a2 = l(r2), o2 = e2.getState();
  if (o2.journal || o2.recovery?.required) throw Error(`Resolve application recovery first`);
  if (![`immediate`, `scene-boundary`].includes(a2.level) || a2.noChanges) throw Error(`A verified runtime operation is required`);
  if (!Array.isArray(o2.active.entityLedger)) throw Error(`Known runtime entity identities are required`);
  let s2 = `ready`, c2 = null, d2 = () => u(a2, i2());
  d2();
  let f2 = async (t3) => {
    if (!c2 || ![`pending`, `beginning`].includes(s2)) throw Error(`Runtime journal is not pending`);
    s2 = `failing`;
    try {
      await e2.fail(c2, { reason: t3?.message || `runtime-application-failed`, session: `restart-required`, persistent: `unknown` }), s2 = `failed`;
    } catch (e3) {
      throw s2 = `pending`, e3;
    }
  };
  return Object.freeze({ getPhase: () => s2, async begin() {
    if (s2 !== `ready`) throw Error(`Runtime journal has already been used`);
    s2 = `beginning`;
    try {
      if (e2.getState() !== o2) throw Error(`Configuration changed before runtime application`);
      d2();
      let r3 = await t2.captureRuntime(), l2 = await n2.read(r3.id);
      if (r3.digest !== r3.id || l2?.digest !== r3.id) throw Error(`Verified runtime save backup is missing`);
      if (r3.assertCurrent(), e2.getState() !== o2) throw Error(`Configuration changed during runtime backup`);
      return d2(), c2 = await e2.begin(a2, i2(), { runtimeBackupId: r3.id }), r3.assertCurrent(), d2(), s2 = `pending`, Object.freeze({ token: c2, backupId: r3.id });
    } catch (e3) {
      if (c2) try {
        await f2(e3);
      } catch (t3) {
        throw AggregateError([e3, t3], `Runtime preparation and recovery failed`);
      }
      else s2 = `failed`;
      throw e3;
    }
  }, async complete(t3) {
    if (s2 !== `pending`) throw Error(`Runtime journal is not pending`);
    s2 = `completing`;
    try {
      let n3 = await e2.complete(c2, { success: true, level: a2.level, ...t3 === void 0 ? {} : { modSettings: t3 } });
      return s2 = `complete`, n3;
    } catch (e3) {
      throw s2 = `pending`, e3;
    }
  }, fail: f2 });
}
async function N({ configurationState: e2, currentSettings: t2, loader: n2, candidate: r2, plan: i2, getCurrentInput: a2, saveBoundary: o2, backups: s2, packageChanges: u2 = false, publishPackages: d2, futureLevels: f2 = false }) {
  let p2 = l(i2), g2 = e2.getState(), _2 = a2();
  if (JSON.stringify(c(_2)) !== JSON.stringify(p2) || p2.level !== `immediate` || p2.noChanges || p2.operations.some((e3) => !(u2 ? [`settings`, `rebuild`, `enable`, `disable`, `update`, ...f2 ? [`order`] : []] : [`settings`, `rebuild`]).includes(e3.kind))) throw Error(`A verified immediate settings plan is required`);
  h(r2, g2.desired);
  let v2 = ({ revision: e3, modSettings: t3, ...n3 }) => ({ ...n3, mods: n3.mods.map(({ settings: e4, ...t4 }) => t4) });
  if (!u2 && JSON.stringify(v2(g2.desired)) !== JSON.stringify(v2(g2.active.configuration))) throw Error(`Settings operation cannot change package content or selection`);
  let y2 = m(r2), x2 = new Map(y2.allPacks.map((e3) => [e3.meta.uuid, e3])), S2 = new Set(p2.affected), C2 = n2.getDiagnostics(), w2 = g2.active.configuration.mods.filter((e3) => e3.enabled && S2.has(e3.id)).map(b).filter((e3) => !f2 || C2.runtimes.some((t3) => t3.namespace === e3)), T2 = g2.desired.mods.filter((e3) => e3.enabled && S2.has(e3.id)).filter((e3) => !f2 || x2.get(b(e3))?.meta.js).map((e3) => {
    let t3 = b(e3), n3 = x2.get(t3);
    if (!n3?.meta.js?.entry || n3.meta.js.startup) throw Error(`Affected runtime requires restart`);
    return t3;
  });
  if (!f2 && !T2.length && !w2.length) throw Error(`No runtime consumers selected`);
  let D2 = /* @__PURE__ */ new Set([...w2, ...T2]);
  if (w2.some((e3) => !C2.runtimes.some((t3) => t3.namespace === e3 && [`active`, `degraded`].includes(t3.state)))) throw Error(`Affected runtime is not active`);
  let O2 = C2.runtimes.filter((e3) => [`active`, `degraded`].includes(e3.state) && !D2.has(e3.namespace)).map((e3) => e3.namespace), k2 = new Map(y2.snapshots), A2, j2, N2 = false, P2 = false;
  try {
    if (N2 = true, await t2.suspend(), e2.getState() !== g2) throw Error(`Settings changed while preparing the operation`);
    A2 = E(e2);
    for (let e3 of t2.registry.captureRetainedSettings(O2)) if (JSON.stringify(e3.entry) !== JSON.stringify(g2.desired.modSettings.mods[e3.namespace] ?? null)) throw Error(`Retained settings differ from the selected configuration`);
    j2 = M({ configurationState: e2, saveBoundary: o2, backups: s2, plan: p2, getCurrentInput: a2 }), await j2.begin(), P2 = true, w2.length && await n2.disposeRuntimeSubset(w2, { expectedGeneration: C2.generation, reason: `settings-application` }), await n2.loadRuntimeSubset(y2.allPacks, { namespaces: T2, expectedGeneration: C2.generation, fileLoader: { getPackSnapshotFrom: (e3) => k2.get(e3) }, modSettingsRegistry: A2.registry });
    let r3 = await A2.seal();
    return O2.length && await n2.transferRuntimeSettings({ namespaces: O2, expectedGeneration: n2.getDiagnostics().generation, sourceRegistry: t2.registry, targetRegistry: A2.registry }), d2?.(), await j2.complete(r3), A2.activate(), t2.discard(), A2;
  } catch (r3) {
    let i3 = [r3];
    if (P2) {
      let e3 = n2.getDiagnostics(), t3 = e3.runtimes.filter((e4) => D2.has(e4.namespace) && e4.generation > C2.generation && [`active`, `degraded`].includes(e4.state)).map((e4) => e4.namespace);
      if (t3.length) try {
        await n2.disposeRuntimeSubset(t3, { expectedGeneration: e3.generation, reason: `settings-application-failed` });
      } catch (e4) {
        i3.push(e4);
      }
    }
    if (A2?.discard(), j2?.getPhase() === `pending`) try {
      await j2.fail(r3);
    } catch (e3) {
      i3.push(e3);
    }
    let a3 = e2.getState();
    if (N2 && !P2 && !a3.journal && !a3.recovery?.required) try {
      t2.resume();
    } catch (e3) {
      i3.push(e3);
    }
    else N2 && t2.discard();
    throw Object.assign(i3.length === 1 ? r3 : AggregateError(i3, `Runtime settings application failed`), { restartRequired: P2 || i3.length > 1 || !!a3.journal || !!a3.recovery?.required });
  }
}
async function P({ configurationState: e2, currentSettings: t2, loader: n2, candidate: r2, buildId: i2, saveBoundary: a2, backups: o2 }) {
  let s2 = e2.getState(), l2 = n2.getLiveSettingsSupport(), u2 = ({ revision: e3, modSettings: t3, ...n3 }) => ({ ...n3, mods: n3.mods.map(({ settings: e4, ...t4 }) => t4) });
  if (JSON.stringify(u2(s2.desired)) !== JSON.stringify(u2(s2.active.configuration))) return null;
  let d2 = [];
  for (let e3 of s2.desired.mods) {
    let t3 = b(e3), n3 = s2.active.configuration.modSettings.mods[t3], r3 = s2.desired.modSettings.mods[t3];
    if (JSON.stringify(n3) !== JSON.stringify(r3)) {
      if (!e3.enabled || !n3 || !r3 || n3.schemaVersion !== r3.schemaVersion || !l2.runtimes.some((e4) => e4.namespace === t3 && e4.supported)) return null;
      d2.push({ namespace: t3, previous: n3, next: r3 });
    }
  }
  if (!d2.length || [.../* @__PURE__ */ new Set([...Object.keys(s2.desired.modSettings.mods), ...Object.keys(s2.active.configuration.modSettings.mods)])].some((e3) => JSON.stringify(s2.desired.modSettings.mods[e3]) !== JSON.stringify(s2.active.configuration.modSettings.mods[e3]) && !d2.some((t3) => t3.namespace === e3))) return null;
  let f2 = v({ initialData: s2.desired.modSettings, storage: { async write() {
  } } }), p2 = t2.registry.getRegisteredModSettings();
  for (let e3 of d2) {
    let t3 = p2.find((t4) => t4.namespace === e3.namespace);
    if (!t3 || t3.schemaVersion !== e3.next.schemaVersion) return null;
    if (Object.keys(e3.next.values).some((e4) => !t3.fields.some((t4) => t4.key === e4))) throw Error(`Unknown mod setting`);
    await f2.registerModSettings(t3);
    for (let [t4, n3] of Object.entries(e3.next.values)) await f2.updateModSetting(e3.namespace, t4, n3);
    if (JSON.stringify((await f2.getModSettings(e3.namespace)).values) !== JSON.stringify(e3.next.values)) throw Error(`Invalid mod setting value`);
  }
  let m2 = new Map(r2.packs.map((e3, t3) => [e3.meta.uuid, s2.desired.mods[t3].id])), h2 = r2.packs.map((e3, t3) => ({ ...s2.desired.mods[t3], depends: (e3.meta.depends || []).map((e4) => m2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => m2.has(e4) ? [m2.get(e4)] : []) })), g2 = () => ({ desired: e2.getState().desired, active: e2.getState().active, installed: h2, buildId: i2, evidence: { mode: `live-settings`, buildId: i2, revision: l2.revision, handlers: n2.getLiveSettingsSupport(), consumers: { complete: false, edges: [], coverage: `settings-notification-only` }, operations: _2 } }), _2 = [];
  _2 = c(g2()).operations.map((e3) => ({ ...e3, verified: true, level: `immediate`, proof: `live-settings-v1: unchanged installed content and schema; active scoped application handler; scopes and resources retained`, paths: { settingsNotification: true } }));
  let y2 = c(g2());
  if (y2.level !== `immediate` || y2.operations.some((e3) => e3.kind !== `settings`)) return null;
  if (e2.getState() !== s2 || JSON.stringify(n2.getLiveSettingsSupport()) !== JSON.stringify(l2)) throw Error(`Settings changed during application review`);
  let x2 = false;
  return Object.freeze({ mode: `immediate`, async apply() {
    if (x2) throw Error(`Settings application has already been used`);
    x2 = true;
    let r3, i3, c2 = false, u3 = false;
    try {
      if (c2 = true, await t2.suspend(), e2.getState() !== s2) throw Error(`Settings changed before application`);
      r3 = E(e2), i3 = M({ configurationState: e2, saveBoundary: a2, backups: o2, plan: y2, getCurrentInput: g2 }), await i3.begin(), u3 = true, await n2.applyLiveSettings(d2.map((e3) => ({ namespace: e3.namespace, previous: e3.previous.values, values: e3.next.values })), l2);
      let f3 = await r3.seal();
      return await n2.transferRuntimeSettings({ namespaces: l2.runtimes.map((e3) => e3.namespace), expectedGeneration: l2.generation, sourceRegistry: t2.registry, targetRegistry: r3.registry, updates: d2 }), await i3.complete(f3), r3.activate(), t2.discard(), r3;
    } catch (n3) {
      let a3 = [n3];
      if (r3?.discard(), i3?.getPhase() === `pending`) try {
        await i3.fail(n3);
      } catch (e3) {
        a3.push(e3);
      }
      let o3 = e2.getState();
      if (c2 && !u3 && !o3.journal && !o3.recovery?.required) try {
        t2.resume();
      } catch (e3) {
        a3.push(e3);
      }
      else c2 && t2.discard();
      throw Object.assign(a3.length === 1 ? n3 : AggregateError(a3, `Live settings application failed`), { restartRequired: u3 || a3.length > 1 || !!o3.journal || !!o3.recovery?.required });
    }
  } });
}
function F({ configurationState: e2, currentSettings: t2, loader: n2, candidate: r2, patcher: i2, buildId: a2, saveBoundary: o2, backups: s2 }) {
  let l2 = e2.getState(), u2 = m(r2), d2 = i2.getAppliedSourceSnapshot(), f2 = () => !n2.getDiagnostics().operationPending && n2.getDiagnostics().runtimes.length === 0;
  if (!f2() || [...d2.packs, ...u2.allPacks].some((e3) => e3.enabled !== false && e3.meta.js) || JSON.stringify(l2.active.configuration.modSettings) !== JSON.stringify(l2.desired.modSettings) || JSON.stringify(l2.active.configuration.overrides) !== JSON.stringify(l2.desired.overrides)) return null;
  let p2;
  try {
    p2 = i2.prepareLevelPackageAdoption(r2);
  } catch {
    return null;
  }
  let h2 = new Map(r2.packs.map((e3, t3) => [e3.meta.uuid, l2.desired.mods[t3].id])), g2 = r2.packs.map((e3, t3) => ({ ...l2.desired.mods[t3], depends: (e3.meta.depends || []).map((e4) => h2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => h2.has(e4) ? [h2.get(e4)] : []) })), _2 = [], v2 = () => ({ desired: e2.getState().desired, active: e2.getState().active, installed: g2, buildId: a2, evidence: { buildId: a2, revision: 0, consumers: { complete: true, lifetime: `future-level-loads`, edges: [] }, operations: _2 } }), y2 = c(v2());
  if (y2.noChanges || y2.operations.some((e3) => ![`enable`, `disable`, `update`, `order`, `configuration`].includes(e3.kind))) return null;
  _2 = y2.operations.map((e3) => ({ ...e3, level: `immediate`, verified: true, proof: `future-level-load-v1: no scripts; unchanged non-level sources; detached JSON before native load callback`, paths: { scopeCleanup: true, dataRestore: true, resourceRelease: true, consumerRebuild: true } }));
  let b2 = c(v2());
  if (b2.level !== `immediate`) return null;
  let x2 = false;
  return Object.freeze({ mode: `immediate`, effect: `next-level`, async apply() {
    if (x2) throw Error(`Level application has already been used`);
    if (x2 = true, !f2() || e2.getState() !== l2) throw Error(`Configuration changed during level review`);
    let n3, r3, i3 = false;
    await t2.suspend();
    try {
      if (e2.getState() !== l2) throw Error(`Settings changed during level review`);
      n3 = E(e2), r3 = M({ configurationState: e2, saveBoundary: o2, backups: s2, plan: b2, getCurrentInput: v2 }), await r3.begin();
      let a3 = await n3.seal();
      if (!f2()) throw Error(`Runtime started during level application`);
      return i3 = true, p2(), await r3.complete(a3), n3.activate(), t2.discard(), n3;
    } catch (a3) {
      if (n3?.discard(), r3?.getPhase() === `pending`) try {
        await r3.fail(a3);
      } catch (e3) {
        a3 = AggregateError([a3, e3], `Level application recovery failed`);
      }
      let o3 = i3 || !!e2.getState().journal || !!e2.getState().recovery?.required;
      throw o3 ? t2.discard() : t2.resume(), Object.assign(a3, { restartRequired: o3 });
    }
  } });
}
function I({ configurationState: e2, currentSettings: t2, loader: n2, candidate: r2, getRuntimeConsumers: i2, buildId: a2, saveBoundary: o2, backups: s2, preparePackageAdoption: l2, prepareLevelAdoption: u2 }) {
  let d2 = e2.getState(), f2 = ({ revision: e3, modSettings: t3, ...n3 }) => ({ ...n3, mods: n3.mods.map(({ settings: e4, ...t4 }) => t4) }), p2 = JSON.stringify(f2(d2.desired)) !== JSON.stringify(f2(d2.active.configuration));
  if (JSON.stringify(d2.desired.overrides) !== JSON.stringify(d2.active.configuration.overrides) || p2 && !l2) return null;
  let m2 = i2();
  if (m2.operationPending || m2.unresolved.length || m2.references.length || m2.coverage.length < 5 || m2.runtimes.some((e3) => e3.state !== `active` || e3.startupOwned !== false || !Array.isArray(e3.unmanagedDomains) || e3.unmanagedDomains.length)) return null;
  let h2 = new Map(r2.packs.map((e3, t3) => [e3.meta.uuid, d2.desired.mods[t3].id])), g2 = r2.packs.map((e3, t3) => ({ ...d2.desired.mods[t3], depends: (e3.meta.depends || []).map((e4) => h2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => h2.has(e4) ? [h2.get(e4)] : []) })), _2 = [], v2 = () => {
    let t3 = i2();
    return { desired: e2.getState().desired, active: e2.getState().active, installed: g2, buildId: a2, evidence: { buildId: a2, revision: t3.revision, observation: t3, consumers: { complete: true, lifetime: `managed-api-scopes`, edges: t3.edges }, operations: _2 } };
  }, y2 = c(v2());
  if (y2.noChanges || y2.operations.some((e3) => ![`settings`, `rebuild`, `enable`, `disable`, `update`, `order`].includes(e3.kind))) return null;
  let b2, x2 = false;
  if (p2) try {
    b2 = l2(r2);
  } catch {
    if (!u2) return null;
    try {
      b2 = u2(r2), x2 = true;
    } catch {
      return null;
    }
  }
  if (!x2 && y2.operations.some((e3) => e3.kind === `order`)) return null;
  let S2 = new Set(m2.runtimes.map((e3) => e3.namespace));
  if (y2.affected.some((e3) => {
    let t3 = r2.packs.find((t4) => h2.get(t4.meta.uuid) === e3), n3 = d2.desired.mods.find((t4) => t4.id === e3), i3 = d2.active.configuration.mods.some((t4) => t4.id === e3 && t4.enabled);
    return n3?.enabled && (t3?.meta.js?.startup || !x2 && !t3?.meta.js?.entry) || i3 && !x2 && !S2.has(t3?.meta.uuid);
  })) return null;
  _2 = y2.operations.map((e3) => ({ ...e3, level: `immediate`, verified: true, proof: x2 ? `managed-level-v1: detached future level recipes; managed-only scopes; observed dependency closure; guarded teardown/setup` : `managed-runtime-v1: unchanged automatic data/resource sources; ordinary managed-only scopes; observed dependency closure; guarded teardown/setup`, paths: { scopeCleanup: true, dataRestore: true, resourceRelease: true, consumerRebuild: true } }));
  let C2 = c(v2());
  if (C2.level !== `immediate`) return null;
  let w2 = false;
  return Object.freeze({ mode: `immediate`, ...x2 ? { effect: `next-level` } : {}, async apply() {
    if (w2) throw Error(`Settings rebuild has already been used`);
    w2 = true;
    let i3 = n2.beginManagedRebuild();
    try {
      return await N({ configurationState: e2, currentSettings: t2, loader: n2, candidate: r2, plan: C2, getCurrentInput: v2, saveBoundary: o2, backups: s2, packageChanges: p2, publishPackages: b2, futureLevels: x2 });
    } finally {
      i3();
    }
  } });
}
var L = [`fileConsumers`, `serviceConsumers`, `dataConsumers`, `eventConsumers`, `hookConsumers`];
function R({ getActive: e2, getDiagnostics: t2, getResources: n2 }) {
  let r2 = null, i2 = 0;
  return () => {
    let a2 = e2(), o2 = t2(), s2 = n2(), c2 = /* @__PURE__ */ new Map(), u2 = [], d2 = [], f2 = [], p2 = [];
    for (let e3 of a2.configuration.mods.filter((e4) => e4.enabled)) {
      let t3 = b(e3);
      if (c2.has(t3)) throw Error(`Ambiguous active runtime namespace: ${t3}`);
      c2.set(t3, e3);
    }
    let m2 = (e3, t3, n3) => {
      let r3 = c2.get(e3);
      return !r3 || !t3 || r3.contentDigest !== t3 ? (f2.push({ domain: n3, namespace: e3, reason: r3 ? t3 ? `digest-mismatch` : `missing-digest` : `not-active` }), null) : r3.id;
    }, h2 = (e3, t3, n3) => {
      let r3 = n3 === `services` ? `${t3}RuntimeGeneration` : `${t3}Generation`;
      if (!Object.hasOwn(e3, r3)) return true;
      let i3 = o2.runtimes.find((n4) => n4.namespace === e3[t3]);
      return !i3 || i3.generation !== e3[r3] || ![`active`, `degraded`].includes(i3.state) ? (f2.push({ domain: n3, namespace: e3[t3], reason: `runtime-mismatch` }), false) : true;
    };
    for (let e3 of L) {
      let t3 = o2[e3];
      if (!t3) {
        f2.push({ domain: e3, reason: `unavailable` });
        continue;
      }
      p2.push({ domain: t3.domain, revision: t3.revision, coverage: t3.coverage ?? null, complete: t3.complete === true });
      for (let e4 of t3.edges) {
        let n3 = m2(e4.provider, e4.providerDigest, t3.domain), r3 = m2(e4.consumer, e4.consumerDigest, t3.domain), i3 = h2(e4, `provider`, t3.domain), a3 = h2(e4, `consumer`, t3.domain);
        n3 && r3 && i3 && a3 && u2.push({ ...e4, provider: n3, consumer: r3, providerNamespace: e4.provider, consumerNamespace: e4.consumer });
      }
    }
    if (!Array.isArray(s2)) f2.push({ domain: `entity-resources`, reason: `unavailable` });
    else for (let e3 of s2) {
      p2.push({ domain: e3.domain, revision: e3.revision, complete: e3.complete === true });
      for (let t3 of e3.references) {
        let n3 = m2(t3.provider, t3.providerDigest, e3.domain);
        n3 && d2.push({ ...t3, provider: n3, providerNamespace: t3.provider });
      }
    }
    let g2 = { activeGeneration: a2.generation, activeRevision: a2.configuration.revision, runtimeGeneration: o2.generation, operationPending: o2.operationPending, runtimes: o2.runtimes.map(({ namespace: e3, generation: t3, state: n3, pendingTasks: r3, taskRevision: i3, persistentActivity: a3, startupOwned: o3, unmanagedDomains: s3 }) => ({ namespace: e3, generation: t3, state: n3, startupOwned: o3, unmanagedDomains: s3, pendingTasks: Number.isSafeInteger(r3) && r3 >= 0 ? r3 : null, taskRevision: Number.isSafeInteger(i3) && i3 >= 0 ? i3 : null, persistentActivity: a3 ?? null })), coverage: p2, edges: u2, references: d2, unresolved: f2 }, _2 = JSON.stringify(g2);
    return r2 !== null && r2 !== _2 && i2++, r2 = _2, l({ domain: `runtime`, complete: false, revision: i2, ...g2 });
  };
}
async function prepareColdStartHost({ configurationState: e2, installStore: r2, backups: i2, saveBoundary: a2, operationPlan: o2, currentInput: s2, ...c2 }) {
  let l2 = e2.getState(), u2, d2 = ({ revision: e3, ...t2 }) => t2, f2 = JSON.stringify(d2(l2.desired)) !== JSON.stringify(d2(l2.active.configuration)), m2 = T({ configurationState: e2, saveBoundary: a2, backups: i2, operationPlan: o2, currentInput: s2, resolveOperation: o2 === void 0 && f2 ? () => O({ candidate: u2, state: l2, buildId: null, cc: c2.cc }) : void 0 }), g2 = E(e2), _2, v2 = `preparing`, y2 = false, b2 = () => {
    if (y2 && !isJsModdingRuntimeEnabled()) throw Error(`JavaScript modding is disabled for this session`);
  }, x2 = (e3) => {
    if (e3.packs.some((e4) => e4.enabled !== false && e4.meta.js) && !isJsModdingRuntimeEnabled()) throw Error(`JavaScript modding is disabled for this session`);
  }, C2 = () => {
    if (c2.signal?.throwIfAborted(), e2.getState() !== l2) throw Error(`Configuration changed during cold preparation`);
  }, A2 = async (e3) => {
    g2.discard(), v2 = `failed-restart-required`;
    let t2 = [e3];
    if (_2?.getState() === `prepared`) try {
      await _2.abort();
    } catch (e4) {
      t2.push(e4);
    }
    try {
      await m2.fail(e3);
    } catch (e4) {
      t2.push(e4);
    }
    throw t2.length > 1 ? AggregateError(t2, `Cold startup failed; recovery or cleanup also failed`) : e3;
  };
  try {
    u2 = await p({ configuration: l2.desired, installStore: r2, signal: c2.signal }), C2(), h(u2, l2.desired), y2 = u2.packs.some((e3) => e3.enabled !== false && e3.meta.js), b2(), _2 = await w({ ...c2, candidate: u2, previousLedger: l2.active.entityLedger, loader: createJsModLoader({ modSettingsRegistry: g2.registry }), saveBoundary: { capture: () => a2.capture(), checkAvailable: (e3, t2) => m2.checkAvailable(t2), beginNativeReads: () => a2.beginNativeReads() }, afterScripts: (e3) => m2.prepared(e3), beforeScripts: async (e3) => {
      b2(), await m2.beforeScripts(e3), b2();
    } }), v2 = `prepared`;
  } catch (e3) {
    return A2(e3);
  }
  let M2 = R({ getActive: () => e2.getState().active, getDiagnostics: () => _2.loader.getDiagnostics(), getResources: () => _2.getResourceConsumers() });
  return Object.freeze({ patcher: _2.patcher, loader: _2.loader, result: _2.result, get settingsRegistry() {
    return g2.registry;
  }, desiredSettings: D(e2, { getRegisteredModSettings: () => g2.registry.getRegisteredModSettings() }), prepareInstall: (t2) => j({ snapshot: t2, configurationState: e2, installStore: r2, canEdit: () => v2 === `active`, hasFeature: getGpNextFeatureState, assertCandidateAllowed: x2 }), modSelection: k(e2, { installStore: r2, canEdit: () => v2 === `active`, prepareApplication: async () => {
    if (v2 !== `active`) throw Error(`Cold host is not active`);
    let t2 = e2.getState().desired, n2 = await p({ configuration: t2, installStore: r2 });
    if (x2(n2), e2.getState().desired !== t2) throw Error(`Configuration changed during review`);
    let o3 = await P({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: n2, buildId: null, saveBoundary: a2, backups: i2 });
    return o3 ??= I({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: n2, getRuntimeConsumers: M2, buildId: null, saveBoundary: a2, backups: i2, preparePackageAdoption: (e3) => _2.patcher.prepareManagedPackageAdoption(e3), prepareLevelAdoption: (e3) => _2.patcher.prepareManagedLevelAdoption(e3) }), o3 ??= F({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: n2, patcher: _2.patcher, buildId: null, saveBoundary: a2, backups: i2 }), o3 ? Object.freeze({ mode: `immediate`, effect: o3.effect, async apply() {
      if (v2 !== `active`) throw Error(`Cold host is not active`);
      v2 = `applying`;
      try {
        g2 = await o3.apply(), v2 = `active`;
      } catch (e3) {
        throw v2 = e3.restartRequired ? `failed-restart-required` : `active`, e3;
      }
    } }) : null;
  }, prepare: async (e3) => {
    let t2 = await p({ configuration: e3, installStore: r2 });
    return x2(t2), t2;
  } }), async applyRuntimeSettings({ plan: t2, getCurrentInput: n2 }) {
    if (v2 !== `active`) throw Error(`Cold host is not active`);
    v2 = `applying`;
    try {
      b2();
      let o3 = await p({ configuration: e2.getState().desired, installStore: r2, signal: c2.signal });
      x2(o3), g2 = await N({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: o3, plan: t2, getCurrentInput: n2, saveBoundary: a2, backups: i2 }), v2 = `active`;
    } catch (e3) {
      throw v2 = e3.restartRequired ? `failed-restart-required` : `active`, e3;
    }
  }, getPhase: () => v2, getResourceConsumers: () => _2.getResourceConsumers(), getRuntimeConsumers: M2, async publish() {
    if (v2 !== `prepared`) throw Error(`Cold host is not ready for publication`);
    v2 = `publishing`;
    try {
      c2.signal?.throwIfAborted(), b2(), _2.publish(), v2 = `published`;
    } catch (e3) {
      return A2(e3);
    }
  }, async activate() {
    if (v2 !== `published`) throw Error(`Cold host must publish before activation`);
    v2 = `activating`;
    try {
      b2();
      let e3 = await _2.activate();
      return c2.signal?.throwIfAborted(), b2(), await m2.complete(await g2.seal()), g2.activate(), v2 = `active`, e3;
    } catch (e3) {
      return A2(e3);
    }
  }, fail: A2 });
}
export {
  prepareColdStartHost
};
