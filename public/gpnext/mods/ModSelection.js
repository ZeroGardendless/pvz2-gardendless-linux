import { readPackArtwork } from "./PackArtwork.js";
import { r as e } from "../GameBootstrap.js";
import { r as t } from "./ConfigurationModSettings.js";
import { a as n, n as r } from "../core/SettingsStore.js";
import { o as i, s as a } from "../ui/Translations.js";
import { i as o } from "./FileLoader.js";
import { r as s } from "./ModVersion.js";
import { t as c } from "./ModPackPreflight.js";
import { r as l } from "./PackPreparation.js";
import { n as u, t as d } from "../data/DataEntityLedger.js";
import { a as f, i as p, o as m, r as h, t as g } from "./PendingModSelection.js";
import { t as _ } from "./ModRequirements.js";
async function v(e2, { signal: t2 } = {}) {
  let n2 = () => {
    if (t2?.throwIfAborted(), e2.director.getScene()) throw Error(`Native data preparation requires a cold startup`);
  };
  n2();
  let r2 = await new Promise((t3, n3) => e2.assetManager.loadBundle(`resources`, (e3, r3) => e3 ? n3(e3) : t3(r3)));
  n2();
  let i2 = await Promise.all([[`plantFeatures`, `json/Features/PlantFeatures`, `PLANTS`], [`zombieFeatures`, `json/Features/ZombieFeatures`, `ZOMBIES`], [`plantProps`, `json/Objects/PlantProps`, `objects`], [`zombieProps`, `json/Objects/ZombieProps`, `objects`], [`plantTypes`, `json/Objects/PlantTypes`, `objects`], [`plantAlmanac`, `json/Objects/PlantAlmanac`, `objects`], [`musicFeatures`, `json/Features/MusicFeatures`, null], [`worldMusic`, `json/Features/WorldMusic`, null], [`eventList`, `json/Features/EventList`, null]].map(async ([t3, i3, a2]) => {
    let o2 = await new Promise((t4, n3) => r2.load(i3, e2.JsonAsset, (e3, r3) => e3 ? n3(e3) : t4(r3)));
    if (n2(), !(a2 ? Array.isArray(o2?.json?.[a2]) : o2?.json && typeof o2.json == `object` && !Array.isArray(o2.json))) throw Error(`Invalid native startup data: ${i3}`);
    return [t3, o2.json];
  }));
  return Object.freeze(Object.fromEntries(i2));
}
async function y({ candidate: t2, patcher: i2, loader: o2, cc: s2, saveBoundary: c2, previousLedger: f2, beforeScripts: p2, afterScripts: m2, signal: h2, attempt: g2 = false }) {
  let _2 = l(t2, { allowBlocked: true }), y2 = new Set(_2.blocked.map((e2) => e2.dir)), b2 = _2.allPacks.map((e2) => y2.has(e2.dir) ? { ...e2, enabled: false } : e2), x = new Set(t2.errors.map((e2) => e2.message)), S = (e2) => e2.errors.filter((e3) => !x.has(e3)), C = () => {
    if (h2?.throwIfAborted(), s2.director.getScene()) throw Error(`Cold mod activation cannot follow a scene launch`);
  };
  if (C(), o2.bindServices({ hasFeature: r }), typeof p2 != `function`) throw Error(`Durable preparation callback is required before startup scripts`);
  if (!Array.isArray(f2)) throw Error(`Previous entity ledger is required`);
  let w = new Map(_2.snapshots), T = Object.freeze({ getPackSnapshotFrom: (e2) => w.get(e2) || null, readTextFrom: async (e2, t3) => {
    let n2 = w.get(e2);
    if (!n2) throw Error(`Missing prepared package snapshot`);
    return n2.readText(t3.replaceAll(`\\`, `/`));
  } }), E, D = `preparing`, O = async () => {
    let e2 = [];
    try {
      E && await o2.abortStartup(E);
    } catch (t3) {
      e2.push(t3);
    }
    if (e2.length) throw AggregateError(e2, `Cold mod preparation cleanup failed`);
  };
  try {
    a(s2), e(`gp-next:native-data:start`);
    let r2 = await v(s2, { signal: h2 });
    e(`gp-next:native-data:end`);
    let l2 = g2 ? null : d(r2);
    C(), i2.initCacheScan();
    let y3 = await i2.consumePrepared(t2, { deferRuntime: true, allowBlocked: true });
    if (C(), !g2 && S(y3).length) throw Object.assign(Error(`Cold data application failed: ` + S(y3).join(`, `)), { restartRequired: true });
    let x2 = g2 ? [] : u({ original: l2, patched: r2, previousLedger: f2 });
    n() || c2.checkAvailable(f2, x2);
    let w2 = { ledger: f2 };
    e(`gp-next:save-backup:start`);
    let k = await c2.capture();
    return e(`gp-next:save-backup:end`), C(), await p2(Object.freeze({ plan: w2, backup: k })), C(), E = await o2.beginStartupFromPacks(b2, { fileLoader: T }), C(), w2.ledger = await E.prepareRegistrations({ previousIdentities: f2, identities: x2 }), c2.checkAvailable(f2, w2.ledger), await m2(w2.ledger), C(), D = `prepared`, Object.freeze({ plan: w2, backup: k, patcher: i2, loader: o2, result: y3, getState: () => D, getResourceConsumers: () => Object.freeze(E.getResources()), getBlockedStatus: () => _2.blocked.map((e2) => ({ namespace: e2.meta.uuid || e2.meta.name, name: e2.name, state: `failed`, phase: `preflight`, errors: e2.preflightErrors })), publish() {
      if (C(), D !== `prepared`) throw Error(`Cold mod runtime is not ready for publication`);
      c2.checkAvailable(f2, w2.ledger), E.markInUse(), D = `publishing`;
      try {
        if (i2.publishPreparedDataIdentities(), E.publishRegistrations(), g2 || i2.validatePreparedDataIdentities(x2), !i2.installLoadHook()) throw Error(`Native data load hook is unavailable`);
        i2.installSceneHook(), c2.beginNativeReads(), D = `published`;
      } catch (e2) {
        throw D = `failed-restart-required`, e2;
      }
    }, async activate() {
      if (D !== `published` || !s2.director.getScene()) throw Error(`Native startup must finish before mod activation`);
      D = `activating`;
      try {
        return h2?.throwIfAborted(), await i2.activatePreparedRuntime(), h2?.throwIfAborted(), await o2.completeStartup(E, { isolateFailures: true }), h2?.throwIfAborted(), D = `active`, y3;
      } catch (e2) {
        throw D = `failed-restart-required`, Object.assign(e2, { restartRequired: true });
      }
    }, async abort() {
      if (D !== `aborted`) {
        if (D !== `prepared`) throw Error(`Published cold runtime requires restart`);
        D = `aborted`, await O();
      }
    } });
  } catch (e2) {
    try {
      await O();
    } catch (t3) {
      throw AggregateError([e2, t3], `Cold mod preparation failed`);
    }
    throw e2;
  }
}
function b(e2, { prepare: n2, installStore: r2, canEdit: a2 = () => true, getEditState: l2 = () => a2() ? `ready` : `busy`, subscribeEditState: u2, refresh: d2, getRuntimeStatus: v2 = () => [], restart: y2 = () => globalThis.location.reload() }) {
  let b2 = /* @__PURE__ */ new Map(), x = () => {
    let t2 = e2.getState(), n3 = h(t2.desired);
    return n3 === t2.desired ? t2 : { ...t2, desired: n3 };
  }, S = () => {
    let t2 = e2.getState();
    return l2() === `ready` && !t2.journal && !t2.recovery?.required ? `ready` : `restart-required`;
  };
  return Object.freeze({ getState: x, getEditState: S, subscribe: (t2) => {
    let n3 = () => t2(x()), r3 = e2.subscribe(n3), i2 = u2?.(n3), a3 = f(n3);
    return () => {
      r3(), i2?.(), a3();
    };
  }, getRuntimeStatus: v2, refresh: d2, async readListMetadata() {
    let t2 = e2.getState().desired.mods, n3 = new Set(t2.map((e3) => JSON.stringify([e3.id, e3.version, e3.contentDigest])));
    for (let e3 of b2.keys()) n3.has(e3) || b2.delete(e3);
    let i2 = /* @__PURE__ */ new Map();
    for (let e3 of t2) {
      let t3 = JSON.stringify([e3.id, e3.version, e3.contentDigest]);
      b2.has(t3) || b2.set(t3, (async () => {
        try {
          let t4 = await r2.read(e3.contentDigest);
          if (t4?.digest !== e3.contentDigest) throw Error(`Installed content differs`);
          let { meta: n5 } = await o(/* @__PURE__ */ new Map([[`list`, t4]])).describeInstalled(`list`, e3), i3 = ``;
          for (let [e4, n6] of [[`thumbnail.png`, `image/png`], [`thumbnail.ico`, `image/x-icon`]]) {
            let r3 = t4.readBytes(e4);
            if (!r3 || r3.length > 128 * 1024) continue;
            let a4 = ``;
            for (let e5 = 0; e5 < r3.length; e5 += 8192) a4 += String.fromCharCode(...r3.subarray(e5, e5 + 8192));
            i3 = `data:${n6};base64,${btoa(a4)}`;
            break;
          }
          return Object.freeze({ name: n5.name, thumbnailUrl: i3, unavailable: false });
        } catch {
          return Object.freeze({ name: e3.fallbackName || e3.id, thumbnailUrl: ``, unavailable: true });
        }
      })());
      let n4 = b2.get(t3), a3 = await n4;
      a3.unavailable && b2.get(t3) === n4 && b2.delete(t3), i2.set(e3.id, a3);
    }
    return i2;
  }, async prepareApplication() {
    if (S() === `ready`) try {
      await g(e2);
    } catch (e3) {
      if (S() === `ready` && e3.message !== `CLOUD_CONFIGURATION_CAPTURING`) throw e3;
    }
    let t2 = await this.prepareRestart();
    return Object.freeze({ mode: `restart-required`, ...t2 });
  }, async prepareRestart() {
    let e3 = JSON.stringify(p()), t2 = () => {
      if (JSON.stringify(p()) !== e3) throw Error(`Mod selection changed; check it again before restarting`);
    };
    return t2(), Object.freeze({ restart() {
      t2(), y2();
    } });
  }, async discardPending(n3) {
    let r3 = x();
    if (r3.desired.revision !== n3) throw Error(`Mod configuration changed; reload the selection`);
    let i2 = r3.active.configuration, a3 = {};
    for (let [e3, n4] of Object.entries(i2.modSettings?.mods || {})) {
      let o2 = r3.desired.mods.find((n5) => t(n5) === e3), s2 = i2.mods.find((e4) => e4.id === o2?.id);
      o2 && s2?.version === o2.version && s2.contentDigest === o2.contentDigest && (a3[e3] = { version: o2.version, contentDigest: o2.contentDigest, settings: n4 });
    }
    if (m(i2.mods, a3), S() === `ready`) try {
      await g(e2);
    } catch (e3) {
      if (e3.message !== `CLOUD_CONFIGURATION_CAPTURING`) throw e3;
    }
    return x();
  }, async requirements(e3 = x().desired) {
    return _(e3, r2, { runtime: v2() });
  }, async prepareUninstall(t2) {
    let r3 = e2.getState(), i2 = () => {
      if (!a2() || r3.journal || r3.recovery?.required || e2.getState() !== r3) throw Error(`Mod configuration changed; review the uninstall again`);
    };
    i2();
    let o2 = r3.desired.mods.find((e3) => e3.id === t2);
    if (!o2 || o2.legacy !== false && !o2.managed) throw Error(`Only mods imported through this manager can be uninstalled`);
    let s2 = [...await this.requirements(r3.desired)].filter(([e3, n3]) => e3 !== t2 && r3.desired.mods.find((t3) => t3.id === e3).enabled && n3.pack.meta.depends.includes(t2)).map(([e3, t3]) => ({ id: e3, name: t3.pack.meta.name }));
    if (i2(), s2.length) throw Object.assign(Error(`Enabled mods still require this mod`), { dependents: s2 });
    let c2 = { ...r3.desired, revision: r3.desired.revision + 1, mods: r3.desired.mods.filter((e3) => e3.id !== t2) };
    o2.sourceKey && (c2.ignoredLocalSources = { ...c2.ignoredLocalSources, [o2.sourceKey]: o2.sourceDigest || o2.contentDigest }), await n2(c2), i2();
    let l3 = false;
    return Object.freeze({ name: o2.fallbackName || t2, async commit() {
      if (i2(), l3) throw Error(`Uninstall already committed`);
      return await n2(c2), i2(), l3 = true, e2.saveDesired(c2, r3.desired.revision);
    } });
  }, async describe(n3) {
    let a3 = e2.getState(), l3 = x(), u3 = l3.desired.mods.find((e3) => e3.id === n3);
    if (!u3) throw Error(`Mod is no longer installed`);
    let d3, f2, p2 = false;
    try {
      if (d3 = await r2.read(u3.contentDigest), d3?.digest !== u3.contentDigest) throw Error(`Installed content does not match the selected version`);
      f2 = (await o(/* @__PURE__ */ new Map([[`details`, d3]])).describeInstalled(`details`, u3)).meta;
    } catch (e3) {
      if (u3.enabled) throw e3;
      p2 = true, f2 = { name: u3.fallbackName || u3.id, version: u3.version, depends: [], optionalDepends: [] };
    }
    if (e2.getState() !== a3) throw Error(`Mod configuration changed; reopen the details`);
    let m2 = (await this.requirements(l3.desired)).get(n3).requirements;
    if (e2.getState() !== a3) throw Error(`Mod configuration changed; reopen the details`);
    let h2 = l3.active.configuration.mods.find((e3) => e3.id === n3 && e3.enabled), g2 = !!h2 !== u3.enabled || !!h2 && (h2.contentDigest !== u3.contentDigest || JSON.stringify(h2.settings) !== JSON.stringify(u3.settings));
    return Object.freeze({ id: n3, canUninstall: u3.legacy === false || u3.managed === true, requirements: m2, thumbnailUrl: p2 ? "" : readPackArtwork(d3), capabilities: f2.capabilities, namespace: t(u3), pending: g2, activeVersion: h2?.version ?? null, name: f2.name, version: f2.version, author: f2.author, description: f2.description, depends: Object.freeze([...f2.depends]), optionalDepends: Object.freeze([...f2.optionalDepends]), gpNextVersion: s(f2), warnings: Object.freeze(p2 ? [i(`modDetail.contentUnavailable`)] : c(f2)), containsScripts: p2 ? null : !!f2.js, files: Object.freeze(p2 ? [] : d3.listPaths()) });
  }, async save(t2, n3) {
    let r3 = structuredClone(t2), i2 = x();
    if (!Array.isArray(r3) || new Set(r3.map((e3) => e3.id)).size !== r3.length || r3.some((e3) => typeof e3.id != `string` || !e3.id || typeof e3.enabled != `boolean`)) throw Error(`Selection requires unique mod identities and enabled states`);
    let a3 = h(i2.desired, { mods: r3 }).mods;
    if (JSON.stringify(a3) === JSON.stringify(i2.desired.mods)) return i2;
    if (m(r3), S() === `ready`) try {
      await g(e2);
    } catch (e3) {
      if (S() === `ready` && e3.message !== `CLOUD_CONFIGURATION_CAPTURING`) throw e3;
    }
    return x();
  } });
}
export {
  y as n,
  b as t
};
