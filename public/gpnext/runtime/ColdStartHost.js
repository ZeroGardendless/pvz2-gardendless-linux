import { r as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/BuildIdentity.js";
import { t as n } from "../core/Logger.js";
import { n as r, r as i, t as a } from "../mods/ModOperationPlan.js";
import { i as o, n as s, r as c } from "../mods/ConfigurationModSettings.js";
import { isJsModdingRuntimeEnabled, getGpNextFeatureState } from "../core/SettingsStore.js";
import { n as d } from "../mods/PackSnapshot.js";
import { c as f, h as p, i as m, m as h, p as g } from "../mods/FileLoader.js";
import { i as _, n as v } from "../mods/ModPackPreflight.js";
import { i as y, r as b, t as x } from "../mods/PackPreparation.js";
import { n as S, r as C, t as w } from "../mods/ModSelection.js";
import { t as T } from "../mods/ModSettingsRegistry.js";
import { createJsModLoader } from "../mods/JsModLoader.js";
function D({ configurationState: e2, saveBoundary: t2, backups: n2, operationPlan: r2, currentInput: i2, resolveOperation: a2 }) {
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
function O(e2) {
  let t2 = e2.getState(), n2 = structuredClone(c(t2.desired.modSettings)), r2 = `staging`, i2, a2, l2 = new Set(t2.desired.mods.filter((e3) => e3.enabled).map(s)), u2 = T({ initialData: n2, canNotify: () => [`active`, `suspending`].includes(r2), storage: { async write(t3, a3) {
    if (!l2.has(a3.namespace)) throw Error(`Mod settings namespace is not active in this configuration`);
    if (![`staging`, `sealing`, `active`, `suspending`].includes(r2)) throw Error(`Mod settings transaction is closed or committing`);
    for (let e3 of /* @__PURE__ */ new Set([...Object.keys(n2.mods), ...Object.keys(t3.mods)])) if (e3 !== a3.namespace && JSON.stringify(n2.mods[e3]) !== JSON.stringify(t3.mods[e3])) throw Error(`Mod settings write crosses namespace ownership`);
    (r2 === `active` || r2 === `suspending`) && await e2.writeActiveModSettings({ generation: i2, namespace: a3.namespace, previous: n2.mods[a3.namespace], next: t3.mods[a3.namespace] }), n2 = structuredClone(t3);
  } } }), d2 = () => {
    let t3 = e2.getState();
    if (t3.journal || t3.recovery?.required || t3.active.generation !== i2 || JSON.stringify(t3.active.configuration.modSettings) !== JSON.stringify(n2)) throw Error(`Active mod settings changed or require recovery`);
  };
  return Object.freeze({ registry: u2, async seal() {
    if (r2 !== `staging`) throw Error(`Mod settings are not staging`);
    if (a2 = u2.suspendMutations(), r2 = `sealing`, await a2.ready, r2 !== `sealing`) throw Error(`Mod settings transaction is closed`);
    return r2 = `committing`, structuredClone(n2);
  }, activate() {
    if (r2 !== `committing`) throw Error(`Mod settings have not been sealed`);
    let s2 = e2.getState(), c2 = o(t2.desired, n2);
    if (s2.journal || s2.recovery?.required || s2.active.generation !== t2.active.generation + 1 || JSON.stringify({ ...s2.active.configuration, revision: 0 }) !== JSON.stringify({ ...c2, revision: 0 })) throw Error(`Mod settings activation was not committed`);
    i2 = s2.active.generation, a2.resume(), a2 = null, r2 = `active`;
  }, async suspend() {
    if (r2 !== `active`) throw Error(`Mod settings are not active`);
    if (a2 = u2.suspendMutations(), r2 = `suspending`, await a2.ready, r2 !== `suspending`) throw Error(`Mod settings transaction is closed`);
    return r2 = `suspended`, d2(), structuredClone(n2);
  }, resume() {
    if (r2 !== `suspended`) throw Error(`Mod settings are not suspended`);
    d2(), a2.resume(), a2 = null, r2 = `active`;
  }, discard() {
    a2 ||= u2.suspendMutations(), a2.close(), r2 = `closed`;
  } });
}
function k(e2, t2) {
  let n2 = () => {
    let n3 = e2.getState();
    return n3.journal || n3.recovery?.required ? [] : t2.getRegisteredModSettings().filter((e3) => {
      let t3 = n3.active.configuration.mods.find((t4) => t4.enabled && s(t4) === e3.namespace), r3 = t3 && n3.desired.mods.find((e4) => e4.id === t3.id);
      return r3 && r3.version === t3.version && r3.contentDigest === t3.contentDigest;
    });
  }, r2 = async (t3, r3) => {
    let i2 = n2().find((e3) => e3.namespace === t3);
    if (!i2) throw Error(`Settings for this selected mod version are unavailable`);
    let a2 = e2.getState(), c2 = a2.desired.modSettings.mods[t3];
    if (!c2 || c2.schemaVersion !== i2.schemaVersion) throw Error(`Selected mod settings require migration`);
    let l2 = T({ initialData: a2.desired.modSettings, storage: { async write(t4) {
      if (e2.getState() !== a2) throw Error(`Mod settings changed; reopen the settings panel`);
      JSON.stringify(t4) !== JSON.stringify(a2.desired.modSettings) && (await e2.saveDesired({ ...o(a2.desired, t4), revision: a2.desired.revision + 1 }, a2.desired.revision), a2 = e2.getState());
    } } });
    await l2.registerModSettings(i2);
    let u2 = a2.desired.mods.find((e3) => s(e3) === t3);
    return r3(l2, { version: u2.version, contentDigest: u2.contentDigest, schemaVersion: i2.schemaVersion }, a2.desired.revision);
  };
  return Object.freeze({ getRegisteredModSettings: n2, subscribe(t3, n3) {
    let r3 = (e3) => JSON.stringify({ settings: e3.desired.modSettings.mods[t3], selected: e3.desired.mods.find((e4) => s(e4) === t3), active: e3.active.configuration.mods.find((e4) => s(e4) === t3), journal: e3.journal?.token ?? null, recovery: e3.recovery }), i2 = r3(e2.getState());
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
function A({ candidate: e2, state: t2, buildId: n2, cc: i2 }) {
  if (typeof n2 != `string` || !/^[a-f0-9]{64}$/.test(n2)) throw Error(`Native build identity is unavailable`);
  if (i2.director.getScene()) throw Error(`Cold operation plan requires a fresh native session`);
  x(e2, t2.desired);
  let a2 = new Map(e2.packs.map((e3, n3) => [String(e3.meta.uuid || e3.meta.name || e3.dir).trim(), t2.desired.mods[n3].id])), o2 = e2.packs.map((e3, n3) => ({ ...t2.desired.mods[n3], depends: (e3.meta.depends || []).map((e4) => a2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => a2.has(e4) ? [a2.get(e4)] : []) })), s2 = { desired: t2.desired, active: t2.active, installed: o2, buildId: n2, evidence: { buildId: n2, revision: 1, consumers: { complete: true, edges: [], lifetime: `fresh-process` }, operations: [] } }, c2 = r(s2);
  return s2.evidence.operations = c2.operations.map((e3) => ({ ...e3, verified: true, level: `restart-required`, proof: `cold-v1: exact installed bytes, native baseline and data validated before first scene; all runtimes recreated`, paths: { coldStart: true } })), { plan: r(s2), input: s2 };
}
var j = e(p(), 1);
async function preparePackageInstall({ snapshot: e2, configurationState: t2, installStore: n2, canEdit: r2, hasFeature: a2, assertCandidateAllowed: s2, forceDisabled: c2 = false }) {
  let l2 = t2.getState(), u2 = () => {
    if (!r2() || l2.journal || l2.recovery?.required || t2.getState() !== l2) throw Error(`Mod configuration changed; prepare the installation again`);
  };
  u2();
  let p2 = await d(e2.listPaths().map((t3) => [t3, e2.readBytes(t3)]));
  if (p2.digest !== e2.digest) throw Error(`Import bytes do not match their digest`);
  let h2 = j.default.parse(p2.readText(`pack.json`) || `null`);
  if (!h2 || typeof h2.uuid != `string` || !h2.uuid.trim() || h2.uuid !== h2.uuid.trim() || h2.uuid.startsWith(`legacy:`)) throw Error(`Imported mods require a stable pack.json uuid`);
  let g2 = l2.desired.mods.find((e3) => e3.id === h2.uuid), b2 = { ...g2, id: h2.uuid, version: String(h2.version || `1.0.0`), contentDigest: p2.digest, fallbackName: String(h2.name || h2.uuid), runtimeNamespace: h2.uuid, legacy: false, enabled: c2 ? false : g2?.enabled ?? false };
  c2 && delete b2.suspendedByJsModding;
  let x2 = g2?.contentDigest === p2.digest && g2.enabled === b2.enabled && (!c2 || !g2.suspendedByJsModding), C2 = m(/* @__PURE__ */ new Map([[`incoming`, p2]])), w2 = await C2.describeInstalled(`incoming`, b2), T2 = g2 ? l2.desired.mods.map((e3) => e3.id === b2.id ? b2 : e3) : [...l2.desired.mods, b2], E2 = (await S({ ...l2.desired, mods: T2 }, { read: (e3) => e3 === p2.digest ? Promise.resolve(p2) : n2.read(e3) }, { hasFeature: a2 })).get(b2.id).requirements, D2 = () => {
    if (w2.meta.js && a2?.(`experimental.jsModding`) !== true) throw Object.assign(Error(`JavaScript modding is disabled for this session`), { requirements: [{ kind: `feature`, id: `experimental.jsModding`, optional: false, status: `disabled` }] });
  };
  try {
    D2();
    let { warnings: e3 } = _(w2, { hasFeature: a2 });
    if (w2.meta.js) {
      let e4 = await v(w2, { fileLoader: C2, hasFeature: a2 });
      if (e4.errors.length) throw Error(e4.errors.join(`; `));
    }
    let r3 = await f(`incoming`, C2);
    if (r3.errors.length) throw Error(r3.errors.join(`; `));
    let c3 = g2 ? l2.desired.mods.map((e4) => e4.id === b2.id ? b2 : e4) : [...l2.desired.mods, b2], d2 = i(o({ ...l2.desired, revision: l2.desired.revision + 1, mods: c3 }, l2.desired.modSettings)), m2 = await y({ configuration: d2, installStore: { read: (e4) => e4 === p2.digest ? Promise.resolve(p2) : n2.read(e4) }, hasFeature: a2 });
    s2(m2), u2();
    let h3 = !!g2 && g2.contentDigest !== p2.digest && !!w2.meta.js, S2 = false, T3 = false;
    return Object.freeze({ preview: i({ id: b2.id, name: w2.meta.name, version: w2.meta.version, previousVersion: g2?.version ?? null, update: !!g2, enabled: b2.enabled, containsScripts: !!w2.meta.js, requirements: E2, unchanged: x2, requiresTrust: h3, contentDigest: p2.digest, warnings: e3 }), async commit({ trustedContentDigest: e4 } = {}) {
      if (S2 || T3) throw Error(`Installation is already committing or committed`);
      if (h3 && e4 !== p2.digest) throw Error(`Confirm trust in the updated script package before installation`);
      u2(), D2(), s2(m2), S2 = true;
      try {
        if (x2) return T3 = true, l2;
        await n2.install(p2), u2(), D2(), s2(m2);
        let e5 = await t2.saveDesired(d2, l2.desired.revision);
        return T3 = true, e5;
      } finally {
        S2 = false;
      }
    } });
  } catch (e3) {
    throw e3.requirements = E2, e3;
  }
}
function N({ configurationState: e2, saveBoundary: t2, backups: n2, plan: r2, getCurrentInput: o2 }) {
  let s2 = i(r2), c2 = e2.getState();
  if (c2.journal || c2.recovery?.required) throw Error(`Resolve application recovery first`);
  if (![`immediate`, `scene-boundary`].includes(s2.level) || s2.noChanges) throw Error(`A verified runtime operation is required`);
  if (!Array.isArray(c2.active.entityLedger)) throw Error(`Known runtime entity identities are required`);
  let l2 = `ready`, u2 = null, d2 = () => a(s2, o2());
  d2();
  let f2 = async (t3) => {
    if (!u2 || ![`pending`, `beginning`].includes(l2)) throw Error(`Runtime journal is not pending`);
    l2 = `failing`;
    try {
      await e2.fail(u2, { reason: t3?.message || `runtime-application-failed`, session: `restart-required`, persistent: `unknown` }), l2 = `failed`;
    } catch (e3) {
      throw l2 = `pending`, e3;
    }
  };
  return Object.freeze({ getPhase: () => l2, async begin() {
    if (l2 !== `ready`) throw Error(`Runtime journal has already been used`);
    l2 = `beginning`;
    try {
      if (e2.getState() !== c2) throw Error(`Configuration changed before runtime application`);
      d2();
      let r3 = await t2.captureRuntime(), i2 = await n2.read(r3.id);
      if (r3.digest !== r3.id || i2?.digest !== r3.id) throw Error(`Verified runtime save backup is missing`);
      if (r3.assertCurrent(), e2.getState() !== c2) throw Error(`Configuration changed during runtime backup`);
      return d2(), u2 = await e2.begin(s2, o2(), { runtimeBackupId: r3.id }), r3.assertCurrent(), d2(), l2 = `pending`, Object.freeze({ token: u2, backupId: r3.id });
    } catch (e3) {
      if (u2) try {
        await f2(e3);
      } catch (t3) {
        throw AggregateError([e3, t3], `Runtime preparation and recovery failed`);
      }
      else l2 = `failed`;
      throw e3;
    }
  }, async complete(t3) {
    if (l2 !== `pending`) throw Error(`Runtime journal is not pending`);
    l2 = `completing`;
    try {
      let n3 = await e2.complete(u2, { success: true, level: s2.level, ...t3 === void 0 ? {} : { modSettings: t3 } });
      return l2 = `complete`, n3;
    } catch (e3) {
      throw l2 = `pending`, e3;
    }
  }, fail: f2 });
}
async function P({ configurationState: e2, currentSettings: t2, loader: n2, candidate: a2, plan: o2, getCurrentInput: c2, saveBoundary: l2, backups: u2, packageChanges: d2 = false, publishPackages: f2, futureLevels: p2 = false }) {
  let m2 = i(o2), h2 = e2.getState(), g2 = c2();
  if (JSON.stringify(r(g2)) !== JSON.stringify(m2) || m2.level !== `immediate` || m2.noChanges || m2.operations.some((e3) => !(d2 ? [`settings`, `rebuild`, `enable`, `disable`, `update`, ...p2 ? [`order`] : []] : [`settings`, `rebuild`]).includes(e3.kind))) throw Error(`A verified immediate settings plan is required`);
  x(a2, h2.desired);
  let _2 = ({ revision: e3, modSettings: t3, ...n3 }) => ({ ...n3, mods: n3.mods.map(({ settings: e4, ...t4 }) => t4) });
  if (!d2 && JSON.stringify(_2(h2.desired)) !== JSON.stringify(_2(h2.active.configuration))) throw Error(`Settings operation cannot change package content or selection`);
  let v2 = b(a2), y2 = new Map(v2.allPacks.map((e3) => [e3.meta.uuid, e3])), S2 = new Set(m2.affected), C2 = n2.getDiagnostics(), w2 = h2.active.configuration.mods.filter((e3) => e3.enabled && S2.has(e3.id)).map(s).filter((e3) => !p2 || C2.runtimes.some((t3) => t3.namespace === e3)), T2 = h2.desired.mods.filter((e3) => e3.enabled && S2.has(e3.id)).filter((e3) => !p2 || y2.get(s(e3))?.meta.js).map((e3) => {
    let t3 = s(e3), n3 = y2.get(t3);
    if (!n3?.meta.js?.entry || n3.meta.js.startup) throw Error(`Affected runtime requires restart`);
    return t3;
  });
  if (!p2 && !T2.length && !w2.length) throw Error(`No runtime consumers selected`);
  let E2 = /* @__PURE__ */ new Set([...w2, ...T2]);
  if (w2.some((e3) => !C2.runtimes.some((t3) => t3.namespace === e3 && [`active`, `degraded`].includes(t3.state)))) throw Error(`Affected runtime is not active`);
  let D2 = C2.runtimes.filter((e3) => [`active`, `degraded`].includes(e3.state) && !E2.has(e3.namespace)).map((e3) => e3.namespace), k2 = new Map(v2.snapshots), A2, j2, M2 = false, P2 = false;
  try {
    if (M2 = true, await t2.suspend(), e2.getState() !== h2) throw Error(`Settings changed while preparing the operation`);
    A2 = O(e2);
    for (let e3 of t2.registry.captureRetainedSettings(D2)) if (JSON.stringify(e3.entry) !== JSON.stringify(h2.desired.modSettings.mods[e3.namespace] ?? null)) throw Error(`Retained settings differ from the selected configuration`);
    j2 = N({ configurationState: e2, saveBoundary: l2, backups: u2, plan: m2, getCurrentInput: c2 }), await j2.begin(), P2 = true, w2.length && await n2.disposeRuntimeSubset(w2, { expectedGeneration: C2.generation, reason: `settings-application` }), await n2.loadRuntimeSubset(v2.allPacks, { namespaces: T2, expectedGeneration: C2.generation, fileLoader: { getPackSnapshotFrom: (e3) => k2.get(e3) }, modSettingsRegistry: A2.registry });
    let r2 = await A2.seal();
    return D2.length && await n2.transferRuntimeSettings({ namespaces: D2, expectedGeneration: n2.getDiagnostics().generation, sourceRegistry: t2.registry, targetRegistry: A2.registry }), f2?.(), await j2.complete(r2), A2.activate(), t2.discard(), A2;
  } catch (r2) {
    let i2 = [r2];
    if (P2) {
      let e3 = n2.getDiagnostics(), t3 = e3.runtimes.filter((e4) => E2.has(e4.namespace) && e4.generation > C2.generation && [`active`, `degraded`].includes(e4.state)).map((e4) => e4.namespace);
      if (t3.length) try {
        await n2.disposeRuntimeSubset(t3, { expectedGeneration: e3.generation, reason: `settings-application-failed` });
      } catch (e4) {
        i2.push(e4);
      }
    }
    if (A2?.discard(), j2?.getPhase() === `pending`) try {
      await j2.fail(r2);
    } catch (e3) {
      i2.push(e3);
    }
    let a3 = e2.getState();
    if (M2 && !P2 && !a3.journal && !a3.recovery?.required) try {
      t2.resume();
    } catch (e3) {
      i2.push(e3);
    }
    else M2 && t2.discard();
    throw Object.assign(i2.length === 1 ? r2 : AggregateError(i2, `Runtime settings application failed`), { restartRequired: P2 || i2.length > 1 || !!a3.journal || !!a3.recovery?.required });
  }
}
async function F({ configurationState: e2, currentSettings: t2, loader: n2, candidate: i2, buildId: a2, saveBoundary: o2, backups: c2 }) {
  let l2 = e2.getState(), u2 = n2.getLiveSettingsSupport(), d2 = ({ revision: e3, modSettings: t3, ...n3 }) => ({ ...n3, mods: n3.mods.map(({ settings: e4, ...t4 }) => t4) });
  if (JSON.stringify(d2(l2.desired)) !== JSON.stringify(d2(l2.active.configuration))) return null;
  let f2 = [];
  for (let e3 of l2.desired.mods) {
    let t3 = s(e3), n3 = l2.active.configuration.modSettings.mods[t3], r2 = l2.desired.modSettings.mods[t3];
    if (JSON.stringify(n3) !== JSON.stringify(r2)) {
      if (!e3.enabled || !n3 || !r2 || n3.schemaVersion !== r2.schemaVersion || !u2.runtimes.some((e4) => e4.namespace === t3 && e4.supported)) return null;
      f2.push({ namespace: t3, previous: n3, next: r2 });
    }
  }
  if (!f2.length || [.../* @__PURE__ */ new Set([...Object.keys(l2.desired.modSettings.mods), ...Object.keys(l2.active.configuration.modSettings.mods)])].some((e3) => JSON.stringify(l2.desired.modSettings.mods[e3]) !== JSON.stringify(l2.active.configuration.modSettings.mods[e3]) && !f2.some((t3) => t3.namespace === e3))) return null;
  let p2 = T({ initialData: l2.desired.modSettings, storage: { async write() {
  } } }), m2 = t2.registry.getRegisteredModSettings();
  for (let e3 of f2) {
    let t3 = m2.find((t4) => t4.namespace === e3.namespace);
    if (!t3 || t3.schemaVersion !== e3.next.schemaVersion) return null;
    if (Object.keys(e3.next.values).some((e4) => !t3.fields.some((t4) => t4.key === e4))) throw Error(`Unknown mod setting`);
    await p2.registerModSettings(t3);
    for (let [t4, n3] of Object.entries(e3.next.values)) await p2.updateModSetting(e3.namespace, t4, n3);
    if (JSON.stringify((await p2.getModSettings(e3.namespace)).values) !== JSON.stringify(e3.next.values)) throw Error(`Invalid mod setting value`);
  }
  let h2 = new Map(i2.packs.map((e3, t3) => [e3.meta.uuid, l2.desired.mods[t3].id])), g2 = i2.packs.map((e3, t3) => ({ ...l2.desired.mods[t3], depends: (e3.meta.depends || []).map((e4) => h2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => h2.has(e4) ? [h2.get(e4)] : []) })), _2 = () => ({ desired: e2.getState().desired, active: e2.getState().active, installed: g2, buildId: a2, evidence: { mode: `live-settings`, buildId: a2, revision: u2.revision, handlers: n2.getLiveSettingsSupport(), consumers: { complete: false, edges: [], coverage: `settings-notification-only` }, operations: v2 } }), v2 = [];
  v2 = r(_2()).operations.map((e3) => ({ ...e3, verified: true, level: `immediate`, proof: `live-settings-v1: unchanged installed content and schema; active scoped application handler; scopes and resources retained`, paths: { settingsNotification: true } }));
  let y2 = r(_2());
  if (y2.level !== `immediate` || y2.operations.some((e3) => e3.kind !== `settings`)) return null;
  if (e2.getState() !== l2 || JSON.stringify(n2.getLiveSettingsSupport()) !== JSON.stringify(u2)) throw Error(`Settings changed during application review`);
  let b2 = false;
  return Object.freeze({ mode: `immediate`, async apply() {
    if (b2) throw Error(`Settings application has already been used`);
    b2 = true;
    let r2, i3, a3 = false, s2 = false;
    try {
      if (a3 = true, await t2.suspend(), e2.getState() !== l2) throw Error(`Settings changed before application`);
      r2 = O(e2), i3 = N({ configurationState: e2, saveBoundary: o2, backups: c2, plan: y2, getCurrentInput: _2 }), await i3.begin(), s2 = true, await n2.applyLiveSettings(f2.map((e3) => ({ namespace: e3.namespace, previous: e3.previous.values, values: e3.next.values })), u2);
      let d3 = await r2.seal();
      return await n2.transferRuntimeSettings({ namespaces: u2.runtimes.map((e3) => e3.namespace), expectedGeneration: u2.generation, sourceRegistry: t2.registry, targetRegistry: r2.registry, updates: f2 }), await i3.complete(d3), r2.activate(), t2.discard(), r2;
    } catch (n3) {
      let o3 = [n3];
      if (r2?.discard(), i3?.getPhase() === `pending`) try {
        await i3.fail(n3);
      } catch (e3) {
        o3.push(e3);
      }
      let c3 = e2.getState();
      if (a3 && !s2 && !c3.journal && !c3.recovery?.required) try {
        t2.resume();
      } catch (e3) {
        o3.push(e3);
      }
      else a3 && t2.discard();
      throw Object.assign(o3.length === 1 ? n3 : AggregateError(o3, `Live settings application failed`), { restartRequired: s2 || o3.length > 1 || !!c3.journal || !!c3.recovery?.required });
    }
  } });
}
function I({ configurationState: e2, currentSettings: t2, loader: n2, candidate: i2, patcher: a2, buildId: o2, saveBoundary: s2, backups: c2 }) {
  let l2 = e2.getState(), u2 = b(i2), d2 = a2.getAppliedSourceSnapshot(), f2 = () => !n2.getDiagnostics().operationPending && n2.getDiagnostics().runtimes.length === 0;
  if (!f2() || [...d2.packs, ...u2.allPacks].some((e3) => e3.enabled !== false && e3.meta.js) || JSON.stringify(l2.active.configuration.modSettings) !== JSON.stringify(l2.desired.modSettings) || JSON.stringify(l2.active.configuration.overrides) !== JSON.stringify(l2.desired.overrides)) return null;
  let p2;
  try {
    p2 = a2.prepareLevelPackageAdoption(i2);
  } catch {
    return null;
  }
  let m2 = new Map(i2.packs.map((e3, t3) => [e3.meta.uuid, l2.desired.mods[t3].id])), h2 = i2.packs.map((e3, t3) => ({ ...l2.desired.mods[t3], depends: (e3.meta.depends || []).map((e4) => m2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => m2.has(e4) ? [m2.get(e4)] : []) })), g2 = [], _2 = () => ({ desired: e2.getState().desired, active: e2.getState().active, installed: h2, buildId: o2, evidence: { buildId: o2, revision: 0, consumers: { complete: true, lifetime: `future-level-loads`, edges: [] }, operations: g2 } }), v2 = r(_2());
  if (v2.noChanges || v2.operations.some((e3) => ![`enable`, `disable`, `update`, `order`, `configuration`].includes(e3.kind))) return null;
  g2 = v2.operations.map((e3) => ({ ...e3, level: `immediate`, verified: true, proof: `future-level-load-v1: no scripts; unchanged non-level sources; detached JSON before native load callback`, paths: { scopeCleanup: true, dataRestore: true, resourceRelease: true, consumerRebuild: true } }));
  let y2 = r(_2());
  if (y2.level !== `immediate`) return null;
  let x2 = false;
  return Object.freeze({ mode: `immediate`, effect: `next-level`, async apply() {
    if (x2) throw Error(`Level application has already been used`);
    if (x2 = true, !f2() || e2.getState() !== l2) throw Error(`Configuration changed during level review`);
    let n3, r2, i3 = false;
    await t2.suspend();
    try {
      if (e2.getState() !== l2) throw Error(`Settings changed during level review`);
      n3 = O(e2), r2 = N({ configurationState: e2, saveBoundary: s2, backups: c2, plan: y2, getCurrentInput: _2 }), await r2.begin();
      let a3 = await n3.seal();
      if (!f2()) throw Error(`Runtime started during level application`);
      return i3 = true, p2(), await r2.complete(a3), n3.activate(), t2.discard(), n3;
    } catch (a3) {
      if (n3?.discard(), r2?.getPhase() === `pending`) try {
        await r2.fail(a3);
      } catch (e3) {
        a3 = AggregateError([a3, e3], `Level application recovery failed`);
      }
      let o3 = i3 || !!e2.getState().journal || !!e2.getState().recovery?.required;
      throw o3 ? t2.discard() : t2.resume(), Object.assign(a3, { restartRequired: o3 });
    }
  } });
}
function L({ configurationState: e2, currentSettings: t2, loader: n2, candidate: i2, getRuntimeConsumers: a2, buildId: o2, saveBoundary: s2, backups: c2, preparePackageAdoption: l2, prepareLevelAdoption: u2 }) {
  let d2 = e2.getState(), f2 = ({ revision: e3, modSettings: t3, ...n3 }) => ({ ...n3, mods: n3.mods.map(({ settings: e4, ...t4 }) => t4) }), p2 = JSON.stringify(f2(d2.desired)) !== JSON.stringify(f2(d2.active.configuration));
  if (JSON.stringify(d2.desired.overrides) !== JSON.stringify(d2.active.configuration.overrides) || p2 && !l2) return null;
  let m2 = a2();
  if (m2.operationPending || m2.unresolved.length || m2.references.length || m2.coverage.length < 5 || m2.runtimes.some((e3) => e3.state !== `active` || e3.startupOwned !== false || !Array.isArray(e3.unmanagedDomains) || e3.unmanagedDomains.length)) return null;
  let h2 = new Map(i2.packs.map((e3, t3) => [e3.meta.uuid, d2.desired.mods[t3].id])), g2 = i2.packs.map((e3, t3) => ({ ...d2.desired.mods[t3], depends: (e3.meta.depends || []).map((e4) => h2.get(e4) || e4), optionalDepends: (e3.meta.optionalDepends || []).flatMap((e4) => h2.has(e4) ? [h2.get(e4)] : []) })), _2 = [], v2 = () => {
    let t3 = a2();
    return { desired: e2.getState().desired, active: e2.getState().active, installed: g2, buildId: o2, evidence: { buildId: o2, revision: t3.revision, observation: t3, consumers: { complete: true, lifetime: `managed-api-scopes`, edges: t3.edges }, operations: _2 } };
  }, y2 = r(v2());
  if (y2.noChanges || y2.operations.some((e3) => ![`settings`, `rebuild`, `enable`, `disable`, `update`, `order`].includes(e3.kind))) return null;
  let b2, x2 = false;
  if (p2) try {
    b2 = l2(i2);
  } catch {
    if (!u2) return null;
    try {
      b2 = u2(i2), x2 = true;
    } catch {
      return null;
    }
  }
  if (!x2 && y2.operations.some((e3) => e3.kind === `order`)) return null;
  let S2 = new Set(m2.runtimes.map((e3) => e3.namespace));
  if (y2.affected.some((e3) => {
    let t3 = i2.packs.find((t4) => h2.get(t4.meta.uuid) === e3), n3 = d2.desired.mods.find((t4) => t4.id === e3), r2 = d2.active.configuration.mods.some((t4) => t4.id === e3 && t4.enabled);
    return n3?.enabled && (t3?.meta.js?.startup || !x2 && !t3?.meta.js?.entry) || r2 && !x2 && !S2.has(t3?.meta.uuid);
  })) return null;
  _2 = y2.operations.map((e3) => ({ ...e3, level: `immediate`, verified: true, proof: x2 ? `managed-level-v1: detached future level recipes; managed-only scopes; observed dependency closure; guarded teardown/setup` : `managed-runtime-v1: unchanged automatic data/resource sources; ordinary managed-only scopes; observed dependency closure; guarded teardown/setup`, paths: { scopeCleanup: true, dataRestore: true, resourceRelease: true, consumerRebuild: true } }));
  let C2 = r(v2());
  if (C2.level !== `immediate`) return null;
  let w2 = false;
  return Object.freeze({ mode: `immediate`, ...x2 ? { effect: `next-level` } : {}, async apply() {
    if (w2) throw Error(`Settings rebuild has already been used`);
    w2 = true;
    let r2 = n2.beginManagedRebuild();
    try {
      return await P({ configurationState: e2, currentSettings: t2, loader: n2, candidate: i2, plan: C2, getCurrentInput: v2, saveBoundary: s2, backups: c2, packageChanges: p2, publishPackages: b2, futureLevels: x2 });
    } finally {
      r2();
    }
  } });
}
var R = [`fileConsumers`, `serviceConsumers`, `dataConsumers`, `eventConsumers`, `hookConsumers`];
function z({ getActive: e2, getDiagnostics: t2, getResources: n2 }) {
  let r2 = null, a2 = 0;
  return () => {
    let o2 = e2(), c2 = t2(), l2 = n2(), u2 = /* @__PURE__ */ new Map(), d2 = [], f2 = [], p2 = [], m2 = [];
    for (let e3 of o2.configuration.mods.filter((e4) => e4.enabled)) {
      let t3 = s(e3);
      if (u2.has(t3)) throw Error(`Ambiguous active runtime namespace: ${t3}`);
      u2.set(t3, e3);
    }
    let h2 = (e3, t3, n3) => {
      let r3 = u2.get(e3);
      return !r3 || !t3 || r3.contentDigest !== t3 ? (p2.push({ domain: n3, namespace: e3, reason: r3 ? t3 ? `digest-mismatch` : `missing-digest` : `not-active` }), null) : r3.id;
    }, g2 = (e3, t3, n3) => {
      let r3 = n3 === `services` ? `${t3}RuntimeGeneration` : `${t3}Generation`;
      if (!Object.hasOwn(e3, r3)) return true;
      let i2 = c2.runtimes.find((n4) => n4.namespace === e3[t3]);
      return !i2 || i2.generation !== e3[r3] || ![`active`, `degraded`].includes(i2.state) ? (p2.push({ domain: n3, namespace: e3[t3], reason: `runtime-mismatch` }), false) : true;
    };
    for (let e3 of R) {
      let t3 = c2[e3];
      if (!t3) {
        p2.push({ domain: e3, reason: `unavailable` });
        continue;
      }
      m2.push({ domain: t3.domain, revision: t3.revision, coverage: t3.coverage ?? null, complete: t3.complete === true });
      for (let e4 of t3.edges) {
        let n3 = h2(e4.provider, e4.providerDigest, t3.domain), r3 = h2(e4.consumer, e4.consumerDigest, t3.domain), i2 = g2(e4, `provider`, t3.domain), a3 = g2(e4, `consumer`, t3.domain);
        n3 && r3 && i2 && a3 && d2.push({ ...e4, provider: n3, consumer: r3, providerNamespace: e4.provider, consumerNamespace: e4.consumer });
      }
    }
    if (!Array.isArray(l2)) p2.push({ domain: `entity-resources`, reason: `unavailable` });
    else for (let e3 of l2) {
      m2.push({ domain: e3.domain, revision: e3.revision, complete: e3.complete === true });
      for (let t3 of e3.references) {
        let n3 = h2(t3.provider, t3.providerDigest, e3.domain);
        n3 && f2.push({ ...t3, provider: n3, providerNamespace: t3.provider });
      }
    }
    let _2 = { activeGeneration: o2.generation, activeRevision: o2.configuration.revision, runtimeGeneration: c2.generation, operationPending: c2.operationPending, runtimes: c2.runtimes.map(({ namespace: e3, generation: t3, state: n3, pendingTasks: r3, taskRevision: i2, persistentActivity: a3, startupOwned: o3, unmanagedDomains: s2 }) => ({ namespace: e3, generation: t3, state: n3, startupOwned: o3, unmanagedDomains: s2, pendingTasks: Number.isSafeInteger(r3) && r3 >= 0 ? r3 : null, taskRevision: Number.isSafeInteger(i2) && i2 >= 0 ? i2 : null, persistentActivity: a3 ?? null })), coverage: m2, edges: d2, references: f2, unresolved: p2 }, v2 = JSON.stringify(_2);
    return r2 !== null && r2 !== v2 && a2++, r2 = v2, i({ domain: `runtime`, complete: false, revision: a2, ..._2 });
  };
}
function B({ configurationState: e2, installStore: t2, canEdit: n2 }) {
  let r2 = Promise.resolve(), i2 = async () => {
    let n3 = e2.getState(), r3 = n3.desired.overrides.find((e3) => e3.kind === `edits`), i3 = await t2.read(r3.contentDigest);
    if (i3?.digest !== r3.contentDigest) throw Error(`Manual edits snapshot is unavailable`);
    return { state: n3, snapshot: i3 };
  }, a2 = (a3) => {
    let o3 = r2.then(async () => {
      let { state: r3, snapshot: o4 } = await i2(), s2 = () => {
        if (!n2() || r3.journal || r3.recovery?.required || e2.getState() !== r3) throw Error(`Configuration changed while saving manual edits`);
      };
      s2();
      let c2 = new Map(o4.listPaths().map((e3) => [e3, o4.readBytes(e3)]));
      a3(c2);
      let l2 = await d([...c2]);
      return l2.digest === o4.digest ? true : (await t2.install(l2), s2(), await e2.saveDesired({ ...r3.desired, revision: r3.desired.revision + 1, overrides: r3.desired.overrides.map((e3) => e3.kind === `edits` ? { ...e3, contentDigest: l2.digest } : e3) }, r3.desired.revision), true);
    });
    return r2 = o3.catch(() => {
    }), o3;
  }, o2 = (e3, t3, n3) => {
    let r3 = structuredClone(n3);
    return a2((n4) => {
      let i3 = h(e3), a3 = n4.get(i3), o3 = g(a3 ? j.default.parse(new TextDecoder().decode(a3)) : {}, e3, t3, r3);
      !o3 || !Object.keys(o3).length ? n4.delete(i3) : n4.set(i3, new TextEncoder().encode(JSON.stringify(o3, null, 2)));
    });
  };
  return Object.freeze({ save: (e3, t3, n3) => o2(e3, t3, n3), remove: (e3, t3) => o2(e3, t3, null), clear: () => a2((e3) => {
    for (let t3 of e3.keys()) t3.startsWith(`jsons/`) && e3.delete(t3);
  }), async readJson(e3) {
    await r2;
    let { snapshot: t3 } = await i2(), n3 = t3.readText(e3);
    return n3 === null ? null : j.default.parse(n3);
  } });
}
async function prepareColdStartHost({ configurationState: e2, installStore: r2, backups: i2, saveBoundary: a2, operationPlan: o2, currentInput: s2, ...c2 }) {
  let d2 = e2.getState(), f2, p2 = ({ revision: e3, ...t2 }) => t2, m2 = JSON.stringify(p2(d2.desired)) !== JSON.stringify(p2(d2.active.configuration)), h2 = D({ configurationState: e2, saveBoundary: a2, backups: i2, operationPlan: o2, currentInput: s2, resolveOperation: o2 === void 0 && m2 ? () => A({ candidate: f2, state: d2, buildId: t, cc: c2.cc }) : void 0 }), g2 = O(e2), _2, v2 = `preparing`, b2 = false, S2 = () => {
    if (b2 && !isJsModdingRuntimeEnabled()) throw Error(`JavaScript modding is disabled for this session`);
  }, T2 = (e3) => {
    if (e3.packs.some((e4) => e4.enabled !== false && e4.meta.js) && !isJsModdingRuntimeEnabled()) throw Error(`JavaScript modding is disabled for this session`);
  }, j2 = () => {
    if (c2.signal?.throwIfAborted(), e2.getState() !== d2) throw Error(`Configuration changed during cold preparation`);
  }, N2 = async (e3) => {
    g2.discard(), v2 = `failed-restart-required`;
    let t2 = [e3];
    if (_2?.getState() === `prepared`) try {
      await _2.abort();
    } catch (e4) {
      t2.push(e4);
    }
    try {
      await h2.fail(e3);
    } catch (e4) {
      t2.push(e4);
    }
    throw t2.length > 1 ? AggregateError(t2, `Cold startup failed; recovery or cleanup also failed`) : e3;
  };
  try {
    f2 = await y({ configuration: d2.desired, installStore: r2, signal: c2.signal }), j2(), x(f2, d2.desired), b2 = f2.packs.some((e3) => e3.enabled !== false && e3.meta.js), S2(), _2 = await C({ ...c2, candidate: f2, previousLedger: d2.active.entityLedger, loader: createJsModLoader({ modSettingsRegistry: g2.registry }), saveBoundary: { capture: () => a2.capture(), checkAvailable: (e3, t2) => h2.checkAvailable(t2), beginNativeReads: () => a2.beginNativeReads() }, afterScripts: (e3) => h2.prepared(e3), beforeScripts: async (e3) => {
      S2(), await h2.beforeScripts(e3), S2();
    } }), v2 = `prepared`;
  } catch (e3) {
    return N2(e3);
  }
  let R2 = async () => {
    try {
      await r2.collectUnused?.(e2.getState());
    } catch (e3) {
      new n(`mod-cache`).warn(`Unused package cleanup deferred`, e3);
    }
  }, V2 = z({ getActive: () => e2.getState().active, getDiagnostics: () => _2.loader.getDiagnostics(), getResources: () => _2.getResourceConsumers() });
  return Object.freeze({ patcher: _2.patcher, loader: _2.loader, result: _2.result, get settingsRegistry() {
    return g2.registry;
  }, desiredSettings: k(e2, { getRegisteredModSettings: () => g2.registry.getRegisteredModSettings() }), edits: B({ configurationState: e2, installStore: r2, canEdit: () => v2 === `active` }), prepareInstall: (t2, { forceDisabled: n2 = false } = {}) => preparePackageInstall({ snapshot: t2, configurationState: e2, installStore: r2, forceDisabled: n2, canEdit: () => v2 === `active`, hasFeature: getGpNextFeatureState, assertCandidateAllowed: T2 }), modSelection: w(e2, { installStore: r2, getRuntimeStatus: () => _2.loader.getStatus(), canEdit: () => v2 === `active`, prepareApplication: async () => {
    if (v2 !== `active`) throw Error(`Cold host is not active`);
    let n2 = e2.getState().desired, o3 = await y({ configuration: n2, installStore: r2 });
    if (T2(o3), e2.getState().desired !== n2) throw Error(`Configuration changed during review`);
    let s3 = await F({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: o3, buildId: t, saveBoundary: a2, backups: i2 });
    return s3 ??= L({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: o3, getRuntimeConsumers: V2, buildId: t, saveBoundary: a2, backups: i2, preparePackageAdoption: (e3) => _2.patcher.prepareManagedPackageAdoption(e3), prepareLevelAdoption: (e3) => _2.patcher.prepareManagedLevelAdoption(e3) }), s3 ??= I({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: o3, patcher: _2.patcher, buildId: t, saveBoundary: a2, backups: i2 }), s3 ? Object.freeze({ mode: `immediate`, effect: s3.effect, async apply() {
      if (v2 !== `active`) throw Error(`Cold host is not active`);
      v2 = `applying`;
      try {
        g2 = await s3.apply(), await R2(), v2 = `active`;
      } catch (e3) {
        throw v2 = e3.restartRequired ? `failed-restart-required` : `active`, e3;
      }
    } }) : null;
  }, prepare: async (e3) => {
    let t2 = await y({ configuration: e3, installStore: r2 });
    return T2(t2), t2;
  } }), async applyRuntimeSettings({ plan: t2, getCurrentInput: n2 }) {
    if (v2 !== `active`) throw Error(`Cold host is not active`);
    v2 = `applying`;
    try {
      S2();
      let o3 = await y({ configuration: e2.getState().desired, installStore: r2, signal: c2.signal });
      T2(o3), g2 = await P({ configurationState: e2, currentSettings: g2, loader: _2.loader, candidate: o3, plan: t2, getCurrentInput: n2, saveBoundary: a2, backups: i2 }), v2 = `active`;
    } catch (e3) {
      throw v2 = e3.restartRequired ? `failed-restart-required` : `active`, e3;
    }
  }, async quiesceConfigurationWrites(t2) {
    if (v2 !== `active`) throw Error(`CLOUD_CONFIGURATION_BUSY`);
    v2 = `cloud-save-pending`;
    try {
      let n2 = await e2.quiesceWrites(t2);
      return () => {
        n2(), v2 = `active`;
      };
    } catch (e3) {
      throw v2 = `active`, e3;
    }
  }, getPhase: () => v2, getResourceConsumers: () => _2.getResourceConsumers(), getRuntimeConsumers: V2, async publish() {
    if (v2 !== `prepared`) throw Error(`Cold host is not ready for publication`);
    v2 = `publishing`;
    try {
      c2.signal?.throwIfAborted(), S2(), _2.publish(), v2 = `published`;
    } catch (e3) {
      return N2(e3);
    }
  }, async activate() {
    if (v2 !== `published`) throw Error(`Cold host must publish before activation`);
    v2 = `activating`;
    try {
      S2();
      let e3 = await _2.activate();
      return c2.signal?.throwIfAborted(), S2(), await h2.complete(await g2.seal()), g2.activate(), await R2(), v2 = `active`, e3;
    } catch (e3) {
      return N2(e3);
    }
  }, fail: N2 });
}
export {
  prepareColdStartHost,
  preparePackageInstall
};
