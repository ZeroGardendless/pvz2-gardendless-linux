import { o as e } from "./ModOperationPlan.js";
import { n as t } from "./ConfigurationModSettings.js";
import { isJsModdingRuntimeEnabled, getGpNextFeatureState } from "../core/SettingsStore.js";
import { o as i, s as a } from "../ui/Translations.js";
import { i as o } from "./FileLoader.js";
import { r as s } from "./ModVersion.js";
import { t as c } from "./ModPackPreflight.js";
import { r as l } from "./PackPreparation.js";
import { n as u, t as d } from "../data/DataEntityLedger.js";
async function f(e2, { signal: t2 } = {}) {
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
async function p({ candidate: e2, patcher: t2, loader: i2, cc: o2, saveBoundary: s2, previousLedger: c2, beforeScripts: p2, afterScripts: m2, signal: h2, attempt: g = false }) {
  let _ = l(e2), v = () => {
    if (h2?.throwIfAborted(), o2.director.getScene()) throw Error(`Cold mod activation cannot follow a scene launch`);
  };
  if (v(), i2.bindServices({ hasFeature: getGpNextFeatureState }), typeof p2 != `function`) throw Error(`Durable preparation callback is required before startup scripts`);
  if (!Array.isArray(c2)) throw Error(`Previous entity ledger is required`);
  let y = new Map(_.snapshots), b = Object.freeze({ getPackSnapshotFrom: (e3) => y.get(e3) || null, readTextFrom: async (e3, t3) => {
    let n2 = y.get(e3);
    if (!n2) throw Error(`Missing prepared package snapshot`);
    return n2.readText(t3.replaceAll(`\\`, `/`));
  } }), x, S = `preparing`, C = async () => {
    let e3 = [];
    try {
      x && await i2.abortStartup(x);
    } catch (t3) {
      e3.push(t3);
    }
    if (e3.length) throw AggregateError(e3, `Cold mod preparation cleanup failed`);
  };
  try {
    a(o2);
    let r2 = await f(o2, { signal: h2 }), l2 = g ? null : d(r2);
    v(), t2.initCacheScan();
    let y2 = await t2.consumePrepared(e2, { deferRuntime: true });
    if (v(), !g && y2.errors.length) throw Error(`Cold data application failed: ` + y2.errors.join(`, `));
    let w = g ? [] : u({ original: l2, patched: r2, previousLedger: c2 });
    isJsModdingRuntimeEnabled() || s2.checkAvailable(c2, w);
    let T = { ledger: c2 }, E = await s2.capture();
    return v(), await p2(Object.freeze({ plan: T, backup: E })), v(), x = await i2.beginStartupFromPacks(_.allPacks, { fileLoader: b }), v(), T.ledger = await x.prepareRegistrations({ previousIdentities: c2, identities: w }), s2.checkAvailable(c2, T.ledger), await m2(T.ledger), v(), S = `prepared`, Object.freeze({ plan: T, backup: E, patcher: t2, loader: i2, result: y2, getState: () => S, getResourceConsumers: () => Object.freeze(x.getResources()), publish() {
      if (v(), S !== `prepared`) throw Error(`Cold mod runtime is not ready for publication`);
      s2.checkAvailable(c2, T.ledger), x.markInUse(), S = `publishing`;
      try {
        if (t2.publishPreparedDataIdentities(), x.publishRegistrations(), g || t2.validatePreparedDataIdentities(w), !t2.installLoadHook()) throw Error(`Native data load hook is unavailable`);
        t2.installSceneHook(), s2.beginNativeReads(), S = `published`;
      } catch (e3) {
        throw S = `failed-restart-required`, e3;
      }
    }, async activate() {
      if (S !== `published` || !o2.director.getScene()) throw Error(`Native startup must finish before mod activation`);
      S = `activating`;
      try {
        if (h2?.throwIfAborted(), await t2.activatePreparedRuntime(), h2?.throwIfAborted(), !g && y2.errors.length) throw Error(`Runtime extensions failed: ` + y2.errors.join(`, `));
        return await i2.completeStartup(x), h2?.throwIfAborted(), S = `active`, y2;
      } catch (e3) {
        throw S = `failed-restart-required`, e3;
      }
    }, async abort() {
      if (S !== `aborted`) {
        if (S !== `prepared`) throw Error(`Published cold runtime requires restart`);
        S = `aborted`, await C();
      }
    } });
  } catch (e3) {
    try {
      await C();
    } catch (t3) {
      throw AggregateError([e3, t3], `Cold mod preparation failed`);
    }
    throw e3;
  }
}
async function m(t2, n2, { hasFeature: i2 = getGpNextFeatureState, runtime: a2 = [] } = {}) {
  let s2 = await Promise.all(t2.mods.map(async (e2) => {
    try {
      let t3 = await n2.read(e2.contentDigest);
      if (t3?.digest !== e2.contentDigest) throw Error(`Installed content differs`);
      return await o(/* @__PURE__ */ new Map([[`details`, t3]])).describeInstalled(`details`, e2);
    } catch {
      return { enabled: e2.enabled, meta: { uuid: e2.id, name: e2.fallbackName || e2.id, depends: [], optionalDepends: [], requiredGpNextFeatures: [] }, preflightErrors: [`Installed content is unavailable`] };
    }
  })), c2 = new Map(s2.map((e2, n3) => [t2.mods[n3].id, e2])), l2 = new Set(a2.filter((e2) => [`failed`, `blocked`].includes(e2.state)).map((e2) => e2.namespace));
  for (let e2 of s2) (l2.has(e2.meta.uuid) || e2.meta.js && i2(`experimental.jsModding`) !== true || (e2.meta.requiredGpNextFeatures || []).some((e3) => i2(e3) !== true)) && (e2.preflightErrors = [`Requirements are unavailable`]);
  let u2 = e(s2);
  return new Map(s2.map((e2, n3) => {
    let r2 = (e3, t3) => {
      let n4 = c2.get(e3);
      return { kind: `mod`, id: e3, name: n4?.meta.name || e3, optional: t3, status: n4 ? n4.enabled === false ? `disabled` : u2.blocked.has(e3) ? `blocked` : `ready` : `missing` };
    }, a3 = [...e2.meta.requiredGpNextFeatures || []];
    e2.meta.js && !a3.some((e3) => [`experimental.jsModding`, `runtime.jsModding`].includes(e3)) && a3.unshift(`experimental.jsModding`);
    let o2 = [...a3.map((e3) => ({ kind: `feature`, id: e3, optional: false, status: i2(e3) == null ? `unknown` : i2(e3) ? `ready` : `disabled` })), ...(e2.meta.depends || []).map((e3) => r2(e3, false)), ...(e2.meta.optionalDepends || []).map((e3) => r2(e3, true))];
    return [t2.mods[n3].id, { requirements: o2, pack: e2, blocked: u2.blocked.has(e2.meta.uuid) }];
  }));
}
function h(e2, { prepare: n2, installStore: r2, canEdit: a2 = () => true, prepareApplication: l2, getRuntimeStatus: u2 = () => [], restart: d2 = () => globalThis.location.reload() }) {
  return Object.freeze({ getState: () => e2.getState(), async prepareApplication() {
    let e3 = await l2?.();
    if (e3) return e3;
    let t2 = await this.prepareRestart();
    return Object.freeze({ mode: `restart-required`, ...t2 });
  }, async prepareRestart() {
    let t2 = e2.getState();
    if (!a2() || t2.journal || t2.recovery?.required) throw Error(`Mod configuration is not ready for application`);
    await n2(t2.desired);
    let r3 = () => {
      if (!a2() || e2.getState() !== t2) throw Error(`Mod configuration changed; check it again before restarting`);
    };
    return r3(), Object.freeze({ restart() {
      r3(), d2();
    } });
  }, async discardPending(t2) {
    let r3 = e2.getState();
    if (!a2() || r3.journal || r3.recovery?.required) throw Error(`Mod configuration is not ready for editing`);
    if (r3.desired.revision !== t2) throw Error(`Mod configuration changed; reload the selection`);
    let i2 = { ...r3.active.configuration, revision: t2 + 1 };
    if (await n2(i2), !a2() || e2.getState() !== r3) throw Error(`Mod configuration changed during validation`);
    return e2.saveDesired(i2, t2);
  }, async requirements(t2 = e2.getState().desired) {
    return m(t2, r2, { runtime: u2() });
  }, async prepareUninstall(t2) {
    let r3 = e2.getState(), i2 = () => {
      if (!a2() || r3.journal || r3.recovery?.required || e2.getState() !== r3) throw Error(`Mod configuration changed; review the uninstall again`);
    };
    i2();
    let o2 = r3.desired.mods.find((e3) => e3.id === t2);
    if (!o2 || o2.legacy !== false) throw Error(`Only mods imported through this manager can be uninstalled`);
    let s2 = [...await this.requirements(r3.desired)].filter(([e3, n3]) => e3 !== t2 && r3.desired.mods.find((t3) => t3.id === e3).enabled && n3.pack.meta.depends.includes(t2)).map(([e3, t3]) => ({ id: e3, name: t3.pack.meta.name }));
    if (i2(), s2.length) throw Object.assign(Error(`Enabled mods still require this mod`), { dependents: s2 });
    let c2 = { ...r3.desired, revision: r3.desired.revision + 1, mods: r3.desired.mods.filter((e3) => e3.id !== t2) };
    await n2(c2), i2();
    let l3 = false;
    return Object.freeze({ name: o2.fallbackName || t2, async commit() {
      if (i2(), l3) throw Error(`Uninstall already committed`);
      return await n2(c2), i2(), l3 = true, e2.saveDesired(c2, r3.desired.revision);
    } });
  }, async describe(n3) {
    let a3 = e2.getState(), l3 = a3.desired.mods.find((e3) => e3.id === n3);
    if (!l3) throw Error(`Mod is no longer installed`);
    let u3, d3, f2 = false;
    try {
      if (u3 = await r2.read(l3.contentDigest), u3?.digest !== l3.contentDigest) throw Error(`Installed content does not match the selected version`);
      d3 = (await o(/* @__PURE__ */ new Map([[`details`, u3]])).describeInstalled(`details`, l3)).meta;
    } catch (e3) {
      if (l3.enabled) throw e3;
      f2 = true, d3 = { name: l3.fallbackName || l3.id, version: l3.version, depends: [], optionalDepends: [] };
    }
    if (e2.getState() !== a3) throw Error(`Mod configuration changed; reopen the details`);
    let p2 = (await this.requirements(a3.desired)).get(n3).requirements;
    if (e2.getState() !== a3) throw Error(`Mod configuration changed; reopen the details`);
    let m2 = a3.active.configuration.mods.find((e3) => e3.id === n3 && e3.enabled), h2 = !!m2 !== l3.enabled || !!m2 && (m2.contentDigest !== l3.contentDigest || JSON.stringify(m2.settings) !== JSON.stringify(l3.settings));
    return Object.freeze({ id: n3, canUninstall: l3.legacy === false, requirements: p2, namespace: t(l3), pending: h2, activeVersion: m2?.version ?? null, name: d3.name, version: d3.version, author: d3.author, description: d3.description, depends: Object.freeze([...d3.depends]), optionalDepends: Object.freeze([...d3.optionalDepends]), gpNextVersion: s(d3), warnings: Object.freeze(f2 ? [i(`modDetail.contentUnavailable`)] : c(d3)), containsScripts: f2 ? null : !!d3.js, files: Object.freeze(f2 ? [] : u3.listPaths()) });
  }, async save(t2, r3) {
    let i2 = structuredClone(t2), o2 = e2.getState();
    if (!a2() || o2.journal || o2.recovery?.required) throw Error(`Mod configuration is not ready for editing`);
    if (o2.desired.revision !== r3) throw Error(`Mod configuration changed; reload the selection`);
    let s2 = new Map(o2.desired.mods.map((e3) => [e3.id, e3]));
    if (!Array.isArray(i2) || i2.length !== s2.size || new Set(i2.map((e3) => e3.id)).size !== s2.size || i2.some((e3) => !s2.has(e3.id) || typeof e3.enabled != `boolean`)) throw Error(`Selection must contain every installed mod exactly once`);
    let c2 = i2.map((e3) => ({ ...s2.get(e3.id), enabled: e3.enabled }));
    if (JSON.stringify(c2) === JSON.stringify(o2.desired.mods)) return o2;
    let l3 = { ...o2.desired, revision: r3 + 1, mods: c2 };
    try {
      await n2(l3);
    } catch (e3) {
      throw e3.requirements = [...(await this.requirements(l3)).values()].flatMap((e4) => e4.requirements).filter((e4) => !e4.optional && e4.status !== `ready`), e3;
    }
    if (!a2() || e2.getState() !== o2) throw Error(`Mod configuration changed during validation`);
    return e2.saveDesired(l3, r3);
  } });
}
export {
  m as n,
  p as r,
  h as t
};
