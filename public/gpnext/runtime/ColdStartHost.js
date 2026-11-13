import { r as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
import { n, r, t as i } from "../mods/ModOperationPlan.js";
import { a, i as o, r as s } from "../mods/ConfigurationModSettings.js";
import { a as c, n as l } from "../core/SettingsStore.js";
import { n as u } from "../mods/PackSnapshot.js";
import { h as d, m as f, p } from "../mods/FileLoader.js";
import { i as m, r as h, t as g } from "../mods/PackPreparation.js";
import { n as _, t as v } from "../mods/ModSelection.js";
import { t as y } from "../mods/ModSettingsRegistry.js";
import { createJsModLoader } from "../mods/JsModLoader.js";
import { a as x, r as S, s as C, t as w } from "../mods/PendingModSelection.js";
import { createLocalPackSync, t as E } from "../mods/LocalPackSync.js";
function D({ configurationState: e2, saveBoundary: t22, backups: n2, operationPlan: r2, currentInput: i2, resolveOperation: a2 }) {
  let o2 = e2.getState();
  if (o2.journal || o2.recovery?.required) throw Error(`Resolve startup recovery before loading mods`);
  let s2 = [o2.active.entityLedger, ...o2.failedEntityTargets.map((e3) => e3.entityLedger)];
  if (s2.some((e3) => !Array.isArray(e3))) throw Error(`Previous mod entity identities require migration`);
  let c2 = structuredClone({ operationPlan: r2, currentInput: i2 }), l2 = null, u2 = `ready`, d2 = () => {
    if (e2.getState() !== o2) throw Error(`Configuration changed during cold preparation`);
  }, f2 = (e3) => {
    for (let n3 of s2) t22.checkAvailable(n3, e3);
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
  let t22 = e2.getState(), n2 = structuredClone(o(t22.desired.modSettings)), r2 = `staging`, i2, c2, l2 = new Set(t22.desired.mods.filter((e3) => e3.enabled).map(s)), u2 = y({ initialData: n2, canNotify: () => [`active`, `suspending`].includes(r2), storage: { async write(t3, a2) {
    if (!l2.has(a2.namespace)) throw Error(`Mod settings namespace is not active in this configuration`);
    if (![`staging`, `sealing`, `active`, `suspending`].includes(r2)) throw Error(`Mod settings transaction is closed or committing`);
    for (let e3 of /* @__PURE__ */ new Set([...Object.keys(n2.mods), ...Object.keys(t3.mods)])) if (e3 !== a2.namespace && JSON.stringify(n2.mods[e3]) !== JSON.stringify(t3.mods[e3])) throw Error(`Mod settings write crosses namespace ownership`);
    (r2 === `active` || r2 === `suspending`) && await e2.writeActiveModSettings({ generation: i2, namespace: a2.namespace, previous: n2.mods[a2.namespace], next: t3.mods[a2.namespace] }), n2 = structuredClone(t3);
  } } }), d2 = () => {
    let t3 = e2.getState();
    if (t3.journal || t3.recovery?.required || t3.active.generation !== i2 || JSON.stringify(t3.active.configuration.modSettings) !== JSON.stringify(n2)) throw Error(`Active mod settings changed or require recovery`);
  };
  return Object.freeze({ registry: u2, async seal() {
    if (r2 !== `staging`) throw Error(`Mod settings are not staging`);
    if (c2 = u2.suspendMutations(), r2 = `sealing`, await c2.ready, r2 !== `sealing`) throw Error(`Mod settings transaction is closed`);
    return r2 = `committing`, structuredClone(n2);
  }, activate() {
    if (r2 !== `committing`) throw Error(`Mod settings have not been sealed`);
    let o2 = e2.getState(), s2 = a(t22.desired, n2);
    if (o2.journal || o2.recovery?.required || o2.active.generation !== t22.active.generation + 1 || JSON.stringify({ ...o2.active.configuration, revision: 0 }) !== JSON.stringify({ ...s2, revision: 0 })) throw Error(`Mod settings activation was not committed`);
    i2 = o2.active.generation, c2.resume(), c2 = null, r2 = `active`;
  }, async suspend() {
    if (r2 !== `active`) throw Error(`Mod settings are not active`);
    if (c2 = u2.suspendMutations(), r2 = `suspending`, await c2.ready, r2 !== `suspending`) throw Error(`Mod settings transaction is closed`);
    return r2 = `suspended`, d2(), structuredClone(n2);
  }, resume() {
    if (r2 !== `suspended`) throw Error(`Mod settings are not suspended`);
    d2(), c2.resume(), c2 = null, r2 = `active`;
  }, discard() {
    c2 ||= u2.suspendMutations(), c2.close(), r2 = `closed`;
  } });
}
function k(e2, t22) {
  let n2 = () => {
    let t3 = e2.getState();
    return { ...t3, desired: S(t3.desired) };
  }, r2 = /* @__PURE__ */ new Map(), i2 = () => {
    let e3 = n2();
    for (let n3 of t22.getRegisteredModSettings()) {
      let t3 = e3.active.configuration.mods.find((e4) => e4.enabled && s(e4) === n3.namespace);
      t3 && r2.set(n3.namespace, { definition: n3, version: t3.version, contentDigest: t3.contentDigest });
    }
    return [...r2.values()].filter(({ definition: t3, version: n3, contentDigest: r3 }) => {
      let i3 = e3.desired.mods.find((e4) => s(e4) === t3.namespace);
      return i3 && i3.version === n3 && i3.contentDigest === r3;
    }).map(({ definition: e4 }) => e4);
  }, a2 = async (t3, r3) => {
    let a3 = i2().find((e3) => e3.namespace === t3);
    if (!a3) throw Error(`Settings for this selected mod version are unavailable`);
    let o2 = n2(), c2 = o2.desired.modSettings.mods[t3];
    if (!c2 || c2.schemaVersion !== a3.schemaVersion) throw Error(`Selected mod settings require migration`);
    let l2 = y({ initialData: o2.desired.modSettings, storage: { async write(r4) {
      let i3 = n2();
      if (JSON.stringify(i3.desired.modSettings.mods[t3]) !== JSON.stringify(o2.desired.modSettings.mods[t3])) throw Error(`Mod settings changed; reopen the settings panel`);
      if (JSON.stringify(r4) === JSON.stringify(o2.desired.modSettings)) return;
      C(i3.desired, t3, r4.mods[t3]);
      let a4 = e2.getState();
      if (!a4.journal && !a4.recovery?.required) try {
        await w(e2);
      } catch (e3) {
        if (e3.message !== `CLOUD_CONFIGURATION_CAPTURING`) throw e3;
      }
      o2 = n2();
    } } });
    await l2.registerModSettings(a3);
    let u2 = o2.desired.mods.find((e3) => s(e3) === t3);
    return r3(l2, { version: u2.version, contentDigest: u2.contentDigest, schemaVersion: a3.schemaVersion }, o2.desired.revision);
  };
  return Object.freeze({ getRegisteredModSettings: i2, subscribe(t3, r3) {
    let i3 = (e3) => JSON.stringify({ settings: e3.desired.modSettings.mods[t3], selected: e3.desired.mods.find((e4) => s(e4) === t3), active: e3.active.configuration.mods.find((e4) => s(e4) === t3), journal: e3.journal?.token ?? null, recovery: e3.recovery }), a3 = i3(n2()), o2 = () => {
      let e3 = i3(n2());
      e3 !== a3 && (a3 = e3, r3());
    }, c2 = e2.subscribe(o2), l2 = x(o2);
    return () => {
      c2(), l2();
    };
  }, getModSettings: (e3) => a2(e3, async (t3, n3, r3) => ({ ...await t3.getModSettings(e3), editIdentity: n3, revision: r3 })), updateModSetting: (e3, t3, n3, r3) => {
    let i3 = structuredClone(n3), o2 = r3 && structuredClone(r3);
    return a2(e3, async (n4, r4) => {
      let a3 = await n4.getModSettings(e3);
      if (o2 && JSON.stringify(o2.editIdentity) !== JSON.stringify(r4)) throw Object.assign(Error(`The mod version or settings schema changed; reopen the panel`), { code: `MOD_SETTING_CONTEXT_CHANGED` });
      if (o2 && JSON.stringify(o2.value) !== JSON.stringify(a3.values[t3])) throw Object.assign(Error(`This setting changed since it was displayed`), { code: `MOD_SETTING_CONFLICT`, currentValue: structuredClone(a3.values[t3]), editIdentity: r4 });
      return n4.updateModSetting(e3, t3, i3);
    });
  }, resetModSettings: (e3) => a2(e3, (t3) => t3.resetModSettings(e3)), exportModSettings: (e3) => a2(e3, (t3) => t3.exportModSettings(e3)) });
}
function A({ configurationState: e2, saveBoundary: t22, backups: n2, plan: a2, getCurrentInput: o2 }) {
  let s2 = r(a2), c2 = e2.getState();
  if (c2.journal || c2.recovery?.required) throw Error(`Resolve application recovery first`);
  if (![`immediate`, `scene-boundary`].includes(s2.level) || s2.noChanges) throw Error(`A verified runtime operation is required`);
  if (!Array.isArray(c2.active.entityLedger)) throw Error(`Known runtime entity identities are required`);
  let l2 = `ready`, u2 = null, d2 = () => i(s2, o2());
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
      let r2 = await t22.captureRuntime(), i2 = await n2.read(r2.id);
      if (r2.digest !== r2.id || i2?.digest !== r2.id) throw Error(`Verified runtime save backup is missing`);
      if (r2.assertCurrent(), e2.getState() !== c2) throw Error(`Configuration changed during runtime backup`);
      return d2(), u2 = await e2.begin(s2, o2(), { runtimeBackupId: r2.id }), r2.assertCurrent(), d2(), l2 = `pending`, Object.freeze({ token: u2, backupId: r2.id });
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
async function j({ configurationState: e2, currentSettings: t22, loader: i2, candidate: a2, plan: o2, getCurrentInput: c2, saveBoundary: l2, backups: u2, packageChanges: d2 = false, publishPackages: f2, futureLevels: p2 = false }) {
  let m2 = r(o2), _2 = e2.getState(), v2 = c2();
  if (JSON.stringify(n(v2)) !== JSON.stringify(m2) || m2.level !== `immediate` || m2.noChanges || m2.operations.some((e3) => !(d2 ? [`settings`, `rebuild`, `enable`, `disable`, `update`, ...p2 ? [`order`] : []] : [`settings`, `rebuild`]).includes(e3.kind))) throw Error(`A verified immediate settings plan is required`);
  g(a2, _2.desired);
  let y2 = ({ revision: e3, modSettings: t3, ...n2 }) => ({ ...n2, mods: n2.mods.map(({ settings: e4, ...t4 }) => t4) });
  if (!d2 && JSON.stringify(y2(_2.desired)) !== JSON.stringify(y2(_2.active.configuration))) throw Error(`Settings operation cannot change package content or selection`);
  let b2 = h(a2), x2 = new Map(b2.allPacks.map((e3) => [e3.meta.uuid, e3])), S2 = new Set(m2.affected), C2 = i2.getDiagnostics(), w2 = _2.active.configuration.mods.filter((e3) => e3.enabled && S2.has(e3.id)).map(s).filter((e3) => !p2 || C2.runtimes.some((t3) => t3.namespace === e3)), T2 = _2.desired.mods.filter((e3) => e3.enabled && S2.has(e3.id)).filter((e3) => !p2 || x2.get(s(e3))?.meta.js).map((e3) => {
    let t3 = s(e3), n2 = x2.get(t3);
    if (!n2?.meta.js?.entry || n2.meta.js.startup) throw Error(`Affected runtime requires restart`);
    return t3;
  });
  if (!p2 && !T2.length && !w2.length) throw Error(`No runtime consumers selected`);
  let E2 = /* @__PURE__ */ new Set([...w2, ...T2]);
  if (w2.some((e3) => !C2.runtimes.some((t3) => t3.namespace === e3 && [`active`, `degraded`].includes(t3.state)))) throw Error(`Affected runtime is not active`);
  let D2 = C2.runtimes.filter((e3) => [`active`, `degraded`].includes(e3.state) && !E2.has(e3.namespace)).map((e3) => e3.namespace), k2 = new Map(b2.snapshots), j2, M2, N2 = false, P2 = false;
  try {
    if (N2 = true, await t22.suspend(), e2.getState() !== _2) throw Error(`Settings changed while preparing the operation`);
    j2 = O(e2);
    for (let e3 of t22.registry.captureRetainedSettings(D2)) if (JSON.stringify(e3.entry) !== JSON.stringify(_2.desired.modSettings.mods[e3.namespace] ?? null)) throw Error(`Retained settings differ from the selected configuration`);
    M2 = A({ configurationState: e2, saveBoundary: l2, backups: u2, plan: m2, getCurrentInput: c2 }), await M2.begin(), P2 = true, w2.length && await i2.disposeRuntimeSubset(w2, { expectedGeneration: C2.generation, reason: `settings-application` }), await i2.loadRuntimeSubset(b2.allPacks, { namespaces: T2, expectedGeneration: C2.generation, fileLoader: { getPackSnapshotFrom: (e3) => k2.get(e3) }, modSettingsRegistry: j2.registry });
    let n2 = await j2.seal();
    return D2.length && await i2.transferRuntimeSettings({ namespaces: D2, expectedGeneration: i2.getDiagnostics().generation, sourceRegistry: t22.registry, targetRegistry: j2.registry }), f2?.(), await M2.complete(n2), j2.activate(), t22.discard(), j2;
  } catch (n2) {
    let r2 = [n2];
    if (P2) {
      let e3 = i2.getDiagnostics(), t3 = e3.runtimes.filter((e4) => E2.has(e4.namespace) && e4.generation > C2.generation && [`active`, `degraded`].includes(e4.state)).map((e4) => e4.namespace);
      if (t3.length) try {
        await i2.disposeRuntimeSubset(t3, { expectedGeneration: e3.generation, reason: `settings-application-failed` });
      } catch (e4) {
        r2.push(e4);
      }
    }
    if (j2?.discard(), M2?.getPhase() === `pending`) try {
      await M2.fail(n2);
    } catch (e3) {
      r2.push(e3);
    }
    let a3 = e2.getState();
    if (N2 && !P2 && !a3.journal && !a3.recovery?.required) try {
      t22.resume();
    } catch (e3) {
      r2.push(e3);
    }
    else N2 && t22.discard();
    throw Object.assign(r2.length === 1 ? n2 : AggregateError(r2, `Runtime settings application failed`), { restartRequired: P2 || r2.length > 1 || !!a3.journal || !!a3.recovery?.required });
  }
}
var M = [`fileConsumers`, `serviceConsumers`, `dataConsumers`, `eventConsumers`, `hookConsumers`];
function N({ getActive: e2, getDiagnostics: t22, getResources: n2 }) {
  let i2 = null, a2 = 0;
  return () => {
    let o2 = e2(), c2 = t22(), l2 = n2(), u2 = /* @__PURE__ */ new Map(), d2 = [], f2 = [], p2 = [], m2 = [];
    for (let e3 of o2.configuration.mods.filter((e4) => e4.enabled)) {
      let t3 = s(e3);
      if (u2.has(t3)) throw Error(`Ambiguous active runtime namespace: ${t3}`);
      u2.set(t3, e3);
    }
    let h2 = (e3, t3, n3) => {
      let r2 = u2.get(e3);
      return !r2 || !t3 || r2.contentDigest !== t3 ? (p2.push({ domain: n3, namespace: e3, reason: r2 ? t3 ? `digest-mismatch` : `missing-digest` : `not-active` }), null) : r2.id;
    }, g2 = (e3, t3, n3) => {
      let r2 = n3 === `services` ? `${t3}RuntimeGeneration` : `${t3}Generation`;
      if (!Object.hasOwn(e3, r2)) return true;
      let i3 = c2.runtimes.find((n4) => n4.namespace === e3[t3]);
      return !i3 || i3.generation !== e3[r2] || ![`active`, `degraded`].includes(i3.state) ? (p2.push({ domain: n3, namespace: e3[t3], reason: `runtime-mismatch` }), false) : true;
    };
    for (let e3 of M) {
      let t3 = c2[e3];
      if (!t3) {
        p2.push({ domain: e3, reason: `unavailable` });
        continue;
      }
      m2.push({ domain: t3.domain, revision: t3.revision, coverage: t3.coverage ?? null, complete: t3.complete === true });
      for (let e4 of t3.edges) {
        let n3 = h2(e4.provider, e4.providerDigest, t3.domain), r2 = h2(e4.consumer, e4.consumerDigest, t3.domain), i3 = g2(e4, `provider`, t3.domain), a3 = g2(e4, `consumer`, t3.domain);
        n3 && r2 && i3 && a3 && d2.push({ ...e4, provider: n3, consumer: r2, providerNamespace: e4.provider, consumerNamespace: e4.consumer });
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
    let _2 = { activeGeneration: o2.generation, activeRevision: o2.configuration.revision, runtimeGeneration: c2.generation, operationPending: c2.operationPending, runtimes: c2.runtimes.map(({ namespace: e3, generation: t3, state: n3, pendingTasks: r2, taskRevision: i3, persistentActivity: a3, startupOwned: o3, unmanagedDomains: s2 }) => ({ namespace: e3, generation: t3, state: n3, startupOwned: o3, unmanagedDomains: s2, pendingTasks: Number.isSafeInteger(r2) && r2 >= 0 ? r2 : null, taskRevision: Number.isSafeInteger(i3) && i3 >= 0 ? i3 : null, persistentActivity: a3 ?? null })), coverage: m2, edges: d2, references: f2, unresolved: p2 }, v2 = JSON.stringify(_2);
    return i2 !== null && i2 !== v2 && a2++, i2 = v2, r({ domain: `runtime`, complete: false, revision: a2, ..._2 });
  };
}
var P = e(d(), 1);
function F({ configurationState: e2, installStore: t22, canEdit: n2 }) {
  let r2 = Promise.resolve(), i2 = async () => {
    let n3 = e2.getState(), r3 = n3.desired.overrides.find((e3) => e3.kind === `edits`), i3 = await t22.read(r3.contentDigest);
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
      let l2 = await u([...c2]);
      return l2.digest === o4.digest ? true : (await t22.install(l2), s2(), await e2.saveDesired({ ...r3.desired, revision: r3.desired.revision + 1, overrides: r3.desired.overrides.map((e3) => e3.kind === `edits` ? { ...e3, contentDigest: l2.digest } : e3) }, r3.desired.revision), true);
    });
    return r2 = o3.catch(() => {
    }), o3;
  }, o2 = (e3, t3, n3) => {
    let r3 = structuredClone(n3);
    return a2((n4) => {
      let i3 = f(e3), a3 = n4.get(i3), o3 = p(a3 ? P.default.parse(new TextDecoder().decode(a3)) : {}, e3, t3, r3);
      !o3 || !Object.keys(o3).length ? n4.delete(i3) : n4.set(i3, new TextEncoder().encode(JSON.stringify(o3, null, 2)));
    });
  };
  return Object.freeze({ save: (e3, t3, n3) => o2(e3, t3, n3), remove: (e3, t3) => o2(e3, t3, null), clear: () => a2((e3) => {
    for (let t3 of e3.keys()) t3.startsWith(`jsons/`) && e3.delete(t3);
  }), async readJson(e3) {
    await r2;
    let { snapshot: t3 } = await i2(), n3 = t3.readText(e3);
    return n3 === null ? null : P.default.parse(n3);
  } });
}
async function prepareColdStartHost({ configurationState: e2, installStore: n2, backups: r2, saveBoundary: i2, operationPlan: a2, currentInput: o2, ...s2 }) {
  let u2 = e2.getState(), d2, f2 = D({ configurationState: e2, saveBoundary: i2, backups: r2, operationPlan: a2, currentInput: o2 }), p2 = O(e2), h2, y2 = `preparing`, x2 = /* @__PURE__ */ new Set(), S2 = (e3) => {
    y2 = e3;
    for (let e4 of x2) try {
      e4();
    } catch (e5) {
      new t(`mod-selection`).warn(`Edit state observer failed`, e5);
    }
  }, C2 = false, w2 = () => {
    if (C2 && !c()) throw Error(`JavaScript modding is disabled for this session`);
  }, A2 = (e3) => {
    if (e3.packs.some((e4) => e4.enabled !== false && e4.meta.js) && !c()) throw Error(`JavaScript modding is disabled for this session`);
  }, M2 = () => {
    if (s2.signal?.throwIfAborted(), e2.getState() !== u2) throw Error(`Configuration changed during cold preparation`);
  }, P2 = async (e3) => {
    p2.discard(), S2(`failed-restart-required`);
    let t22 = [e3];
    if (h2?.getState() === `prepared`) try {
      await h2.abort();
    } catch (e4) {
      t22.push(e4);
    }
    try {
      await f2.fail(e3);
    } catch (e4) {
      t22.push(e4);
    }
    throw t22.length > 1 ? AggregateError(t22, `Cold startup failed; recovery or cleanup also failed`) : e3;
  };
  try {
    d2 = await m({ configuration: u2.desired, installStore: n2, signal: s2.signal, allowBlocked: true }), M2(), g(d2, u2.desired), d2.errors.length && new t(`startup`).warn(`Unavailable mod content skipped`, d2.errors), C2 = d2.packs.some((e3) => e3.enabled !== false && e3.meta.js), w2(), h2 = await _({ ...s2, candidate: d2, previousLedger: u2.active.entityLedger, loader: createJsModLoader({ modSettingsRegistry: p2.registry }), saveBoundary: { capture: () => i2.capture(), checkAvailable: (e3, t22) => f2.checkAvailable(t22), beginNativeReads: () => i2.beginNativeReads() }, afterScripts: (e3) => f2.prepared(e3), beforeScripts: async (e3) => {
      w2(), await f2.beforeScripts(e3), w2();
    } }), S2(`prepared`);
  } catch (e3) {
    return P2(e3);
  }
  let I2 = async () => {
    try {
      await n2.collectUnused?.(e2.getState());
    } catch (e3) {
      new t(`mod-cache`).warn(`Unused package cleanup deferred`, e3);
    }
  }, L = N({ getActive: () => e2.getState().active, getDiagnostics: () => h2.loader.getDiagnostics(), getResources: () => h2.getResourceConsumers() });
  return Object.freeze({ patcher: h2.patcher, loader: h2.loader, result: h2.result, get settingsRegistry() {
    return p2.registry;
  }, desiredSettings: k(e2, { getRegisteredModSettings: () => [...p2.registry.getRegisteredModSettings(), ...h2.loader.getFailedSettingsSchemas()] }), edits: F({ configurationState: e2, installStore: n2, canEdit: () => y2 === `active` }), prepareInstall: (t22) => E({ snapshot: t22, configurationState: e2, installStore: n2, canEdit: () => y2 === `active`, hasFeature: l }), modSelection: v(e2, { installStore: n2, refresh: createLocalPackSync({ configurationState: e2, installStore: n2, canEdit: () => y2 === `active` }), getRuntimeStatus: () => [...h2.getBlockedStatus(), ...h2.loader.getStatus()], canEdit: () => y2 === `active`, getEditState: () => y2 === `failed-restart-required` ? `restart-required` : y2 === `active` ? `ready` : `busy`, subscribeEditState(e3) {
    return x2.add(e3), () => x2.delete(e3);
  }, prepare: async (e3) => {
    let t22 = await m({ configuration: e3, installStore: n2 });
    return A2(t22), t22;
  } }), async applyRuntimeSettings({ plan: t22, getCurrentInput: a3 }) {
    if (y2 !== `active`) throw Error(`Cold host is not active`);
    S2(`applying`);
    try {
      w2();
      let o3 = await m({ configuration: e2.getState().desired, installStore: n2, signal: s2.signal });
      A2(o3), p2 = await j({ configurationState: e2, currentSettings: p2, loader: h2.loader, candidate: o3, plan: t22, getCurrentInput: a3, saveBoundary: i2, backups: r2 }), S2(`active`);
    } catch (e3) {
      throw S2(e3.restartRequired ? `failed-restart-required` : `active`), e3;
    }
  }, async quiesceConfigurationWrites(t22) {
    if (y2 !== `active`) throw Error(`CLOUD_CONFIGURATION_BUSY`);
    S2(`cloud-save-pending`);
    try {
      let n3 = await e2.quiesceWrites(t22);
      return () => {
        n3(), S2(`active`);
      };
    } catch (e3) {
      throw S2(`active`), e3;
    }
  }, getPhase: () => y2, getResourceConsumers: () => h2.getResourceConsumers(), getRuntimeConsumers: L, async publish() {
    if (y2 !== `prepared`) throw Error(`Cold host is not ready for publication`);
    S2(`publishing`);
    try {
      s2.signal?.throwIfAborted(), w2(), h2.publish(), S2(`published`);
    } catch (e3) {
      return P2(e3);
    }
  }, async activate() {
    if (y2 !== `published`) throw Error(`Cold host must publish before activation`);
    S2(`activating`);
    try {
      w2();
      let e3 = await h2.activate();
      return s2.signal?.throwIfAborted(), w2(), await f2.complete(await p2.seal()), p2.activate(), await I2(), S2(`active`), e3;
    } catch (e3) {
      return P2(e3);
    }
  }, fail: P2 });
}
import { t as preparePackageInstall } from "../mods/LocalPackSync.js";
export {
  prepareColdStartHost,
  preparePackageInstall
};
