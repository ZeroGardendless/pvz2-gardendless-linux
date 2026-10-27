import { n as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
import { i as n, r, t as i } from "./ModOperationPlan.js";
import { i as a, n as o, r as s, t as c } from "./ConfigurationModSettings.js";
var l = e({ createConfigurationState: () => D, createLegacyConfigurationRecord: () => E }), u = new t(`configuration-state`), d = [`restored`, `restart-required`, `unknown`], f = [`unchanged`, `changed`, `unknown`], p = [`immediate`, `scene-boundary`, `restart-required`], m = (e2, t2) => JSON.stringify(e2) === JSON.stringify(t2), h = (e2) => e2 === null || typeof e2 == `string` && /^[a-f0-9]{64}$/.test(e2);
function g(e2) {
  if (e2 === null) return;
  if (!Array.isArray(e2)) throw Error(`Invalid entity ledger`);
  let t2 = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Set();
  for (let i2 of e2) {
    if (!i2 || typeof i2.id != `string` || !i2.id.trim() || ![`plant`, `zombie`].includes(i2.kind) || typeof i2.codename != `string` || !i2.codename.trim() || !Number.isSafeInteger(i2.engineId) || i2.engineId < 0 || t2.has(i2.id) || n2.has(`${i2.kind}:${i2.codename}`) || r2.has(`${i2.kind}:${i2.engineId}`)) throw Error(`Invalid or conflicting entity ledger`);
    t2.add(i2.id), n2.add(`${i2.kind}:${i2.codename}`), r2.add(`${i2.kind}:${i2.engineId}`);
  }
}
function _(e2) {
  if (g(e2.entityLedger), !h(e2.backupId)) throw Error(`Invalid save backup identity`);
  if (e2.entityLedgerProof !== void 0 && (typeof e2.entityLedgerProof != `string` || !e2.entityLedgerProof.trim())) throw Error(`Invalid entity ledger migration proof`);
}
var v = (e2) => ({ ...e2, entityLedger: e2.entityLedger === void 0 ? null : e2.entityLedger, backupId: e2.backupId === void 0 ? null : e2.backupId }), y = (e2) => ({ token: e2.token, entityLedger: e2.target.entityLedger, backupId: e2.target.backupId });
function b(e2) {
  let { revision: t2, ...n2 } = e2;
  return n2;
}
function x(e2) {
  if (e2.modSettings !== void 0 && !m(a(e2, e2.modSettings).mods, e2.mods)) throw Error(`Mod settings values differ from the configuration snapshot`);
}
function S(e2) {
  if (n(e2?.configuration), x(e2.configuration), !Array.isArray(e2.packages)) throw Error(`Invalid package snapshots`);
  n({ revision: 0, mods: e2.packages.map((e3) => ({ ...e3, enabled: true })) });
  let t2 = e2.configuration.mods.filter((e3) => e3.enabled);
  if (t2.length !== e2.packages.length || t2.some((t3) => !e2.packages.some((e3) => e3.id === t3.id && e3.version === t3.version && e3.contentDigest === t3.contentDigest))) throw Error(`Package snapshots do not match configuration`);
  if (e2.ordered !== void 0 && (!Array.isArray(e2.ordered) || e2.ordered.length !== t2.length || new Set(e2.ordered).size !== t2.length || e2.ordered.some((e3) => !t2.some((t3) => t3.id === e3)))) throw Error(`Invalid active order`);
}
function C(e2) {
  if (S(e2), !Number.isSafeInteger(e2.generation) || e2.generation < 0) throw Error(`Invalid active generation`);
}
function w(e2, t2 = false) {
  if (e2?.formatVersion !== (t2 ? 1 : 2) || !Number.isSafeInteger(e2.sequence) || e2.sequence < 0) throw Error(`Invalid configuration state`);
  if (n(e2.desired), x(e2.desired), C(e2.active), !t2) {
    if (_(e2.active), !Array.isArray(e2.failedEntityTargets)) throw Error(`Invalid failed entity history`);
    let t3 = /* @__PURE__ */ new Set();
    for (let n2 of e2.failedEntityTargets) {
      if (!n2 || typeof n2.token != `string` || !n2.token || t3.has(n2.token)) throw Error(`Invalid failed entity history token`);
      _(n2), t3.add(n2.token);
    }
  }
  if (e2.journal !== null) {
    let n2 = e2.journal;
    if (!n2 || typeof n2 != `object`) throw Error(`Invalid application journal`);
    if (C(n2.previousActive), S(n2.target), !t2) {
      if (_(n2.previousActive), _(n2.target), ![`operation`, `cold-start`].includes(n2.kind) || e2.failedEntityTargets.some((e3) => e3.token === n2.token)) throw Error(`Invalid journal kind or history binding`);
      if (n2.kind === `cold-start`) {
        if (n2.level !== `restart-required` || n2.previousActive.entityLedger === null || n2.target.entityLedger === null || n2.target.backupId === null) throw Error(`Incomplete cold-start identity or backup`);
      } else {
        if (!m(n2.target.entityLedger, n2.previousActive.entityLedger)) throw Error(`Operation cannot change entity identity`);
        if (n2.runtimeBackupId !== void 0) {
          if (!h(n2.runtimeBackupId) || n2.runtimeBackupId === null || n2.previousActive.entityLedger === null || ![`immediate`, `scene-boundary`].includes(n2.level) || n2.target.backupId !== n2.runtimeBackupId) throw Error(`Invalid runtime operation backup`);
        } else if (n2.target.backupId !== n2.previousActive.backupId) throw Error(`Operation cannot change entity identity`);
      }
    }
    if (n2.settingsNamespaces !== void 0) {
      let e3 = new Set(n2.target.configuration.mods.filter((e4) => e4.enabled).map(o));
      if (!Array.isArray(n2.settingsNamespaces) || new Set(n2.settingsNamespaces).size !== n2.settingsNamespaces.length || n2.settingsNamespaces.some((t3) => !e3.has(t3))) throw Error(`Invalid staged settings ownership`);
    }
    if (!p.includes(n2.level) || !Number.isSafeInteger(n2.desiredRevision) || n2.desiredRevision !== e2.desired.revision || n2.desiredRevision !== n2.target.configuration.revision || !m(n2.previousActive, e2.active) || !m(n2.target.configuration, e2.desired) || e2.sequence < 1 || n2.token !== `${e2.active.generation}:${n2.desiredRevision}:${e2.sequence}`) throw Error(`Invalid journal binding`);
  }
  if (e2.recovery !== null) {
    let n2 = e2.recovery;
    if (!n2 || typeof n2.required != `boolean` || typeof n2.reason != `string` || !n2.reason || !d.includes(n2.session) || !f.includes(n2.persistent) || typeof n2.saveRestored != `boolean` || n2.saveRestored && (n2.required || n2.restoredBackupId !== n2.failedTarget?.backupId || !n2.restoredBackupId || !h(n2.restoredBackupId) || !n2.replacedSaveBackupId || !h(n2.replacedSaveBackupId)) || !n2.required && n2.session !== `restored` || n2.required && e2.journal || n2.sessionProof != null && typeof n2.sessionProof != `string`) throw Error(`Invalid recovery state`);
    if (S(n2.failedTarget), !t2 && (_(n2.failedTarget), typeof n2.failedToken != `string` || !e2.failedEntityTargets.some((e3) => e3.token === n2.failedToken && m(e3.entityLedger, n2.failedTarget.entityLedger) && e3.backupId === n2.failedTarget.backupId))) throw Error(`Recovery entity history is missing`);
  }
}
function T(e2) {
  w(e2, true);
  let t2 = e2.recovery && { ...e2.recovery, failedTarget: v(e2.recovery.failedTarget), failedToken: `legacy-recovery:${e2.sequence}` }, n2 = { ...e2, formatVersion: 2, active: v(e2.active), failedEntityTargets: [], journal: e2.journal && { ...e2.journal, kind: `operation`, previousActive: v(e2.journal.previousActive), target: v(e2.journal.target) }, recovery: t2 };
  return t2 && n2.failedEntityTargets.push({ token: t2.failedToken, entityLedger: t2.failedTarget.entityLedger, backupId: t2.failedTarget.backupId }), n2;
}
function E({ active: e2, desired: t2 }) {
  let n2 = r({ formatVersion: 2, sequence: 0, active: e2, desired: t2, journal: null, recovery: null, failedEntityTargets: [] });
  if (w(n2), !Array.isArray(e2.entityLedger) || !e2.entityLedgerProof) throw Error(`Verified legacy entity identity is required`);
  return n2;
}
function D({ storage: e2, initial: t2 }) {
  let l2 = /* @__PURE__ */ new Set(), p2 = null, _2 = Promise.resolve(), x2 = false, S2 = () => {
    if (x2) throw Error(`CLOUD_CONFIGURATION_CAPTURING`);
  }, C2 = (e3) => {
    S2();
    let t3 = _2.then(e3);
    return _2 = t3.catch(() => {
    }), t3;
  }, E2 = async (t3) => {
    w(t3);
    let n2 = r(t3);
    await e2.write(n2), p2 = n2;
    for (let e3 of [...l2]) try {
      e3(p2);
    } catch (e4) {
      u.warn(`Configuration observer failed`, e4);
    }
    return p2;
  }, D2 = () => {
    if (!p2) throw Error(`Configuration state is not loaded`);
  }, O = (e3) => {
    if (D2(), !p2.journal || p2.journal.token !== e3) throw Error(`Application transaction is stale or absent`);
    return p2.journal;
  };
  return { async quiesceWrites({ signal: e3 } = {}) {
    e3?.throwIfAborted(), S2(), x2 = true;
    let t3 = true, n2, r2 = () => {
      t3 && (t3 = false, x2 = false, e3?.removeEventListener(`abort`, i2));
    }, i2 = () => {
      r2(), n2(e3.reason || Error(`CLOUD_CANCELLED`));
    }, a2 = new Promise((e4, t4) => {
      n2 = t4;
    });
    e3?.addEventListener(`abort`, i2, { once: true });
    try {
      return await Promise.race([_2, a2]), e3?.throwIfAborted(), r2;
    } catch (e4) {
      throw r2(), e4;
    }
  }, getState() {
    return D2(), p2;
  }, subscribe(e3) {
    return l2.add(e3), () => l2.delete(e3);
  }, load: () => C2(async () => {
    if (p2) return p2;
    let n2 = await e2.read(), i2 = n2?.formatVersion === 1 ? T(n2) : n2 ?? { formatVersion: 2, sequence: 0, desired: t2.configuration, active: v(t2), journal: null, recovery: null, failedEntityTargets: [] };
    return w(i2), i2.journal ? E2({ ...i2, desired: i2.journal.kind === `cold-start` ? i2.desired : { ...i2.journal.previousActive.configuration, revision: i2.desired.revision + 1 }, active: i2.journal.previousActive, journal: null, failedEntityTargets: [...i2.failedEntityTargets, y(i2.journal)], recovery: { required: true, reason: `interrupted-application`, failedTarget: i2.journal.target, failedToken: i2.journal.token, session: `restart-required`, persistent: `unknown`, saveRestored: false } }) : (p2 = r(i2), p2);
  }), prepareFreshStartup: ({ isFresh: e3 }) => C2(async () => {
    if (D2(), !e3() || p2.journal) throw Error(`A fresh document is required to retry startup`);
    if (!p2.recovery?.required) return p2;
    let t3 = p2.desired, n2 = p2.recovery.failedTarget.configuration;
    return t3.revision === n2.revision + 1 && m(b(t3), b(p2.active.configuration)) && !m(b(t3), b(n2)) && (t3 = { ...n2, revision: t3.revision + 1 }), E2({ ...p2, desired: t3, recovery: { ...p2.recovery, required: false, session: `restored`, sessionProof: `fresh document: previous execution ended; persistent data not restored; cold checks pending` } });
  }), saveDesired: (e3, t3) => {
    let i2 = r(e3);
    return C2(async () => {
      if (D2(), n(i2), p2.journal) throw Error(`Cannot edit configuration during application`);
      if (t3 !== p2.desired.revision || i2.revision !== t3 + 1) throw Error(`Configuration revision changed`);
      return E2({ ...p2, desired: i2 });
    });
  }, begin: (e3, t3, n2 = {}) => {
    let a2 = r({ plan: e3, currentInput: t3, execution: n2 });
    return C2(async () => {
      let { plan: e4, currentInput: t4, execution: n3 } = a2;
      if (D2(), p2.journal || p2.recovery?.required) throw Error(`Resolve the pending application or recovery first`);
      if (i(e4, { ...t4, desired: p2.desired, active: p2.active }), e4.level === `blocked` || e4.noChanges) throw Error(`Plan cannot be applied`);
      let r2 = Object.hasOwn(n3, `runtimeBackupId`);
      if (r2 && (!h(n3.runtimeBackupId) || n3.runtimeBackupId === null || p2.active.entityLedger === null || ![`immediate`, `scene-boundary`].includes(e4.level))) throw Error(`Runtime application requires a current backup and known entity ledger`);
      let s2 = p2.sequence + 1, c2 = `${p2.active.generation}:${p2.desired.revision}:${s2}`;
      return await E2({ ...p2, sequence: s2, journal: { token: c2, kind: `operation`, level: e4.level, previousActive: p2.active, target: { ...e4.target, entityLedger: p2.active.entityLedger, backupId: r2 ? n3.runtimeBackupId : p2.active.backupId }, desiredRevision: p2.desired.revision, ...r2 ? { runtimeBackupId: n3.runtimeBackupId } : {}, settingsNamespaces: e4.target.configuration.mods.filter((t5) => t5.enabled && e4.affected.includes(t5.id)).map(o) } }), c2;
    });
  }, beginColdStart: (e3) => {
    let t3 = r(e3);
    return C2(async () => {
      if (D2(), p2.journal || p2.recovery?.required) throw Error(`Resolve the pending application or recovery first`);
      let { targetEntityLedger: e4, previousEntityLedger: n2, migrationProof: r2, backupId: a2, plan: o2, currentInput: s2 } = t3;
      if (g(e4), e4 === null || !h(a2) || a2 === null) throw Error(`Known target entity ledger and exact backup are required`);
      let c2 = p2.active;
      if (c2.entityLedger === null) {
        if (g(n2), n2 === null || typeof r2 != `string` || !r2.trim()) throw Error(`Verified previous entity ledger migration is required`);
        c2 = { ...c2, entityLedger: n2, entityLedgerProof: r2 };
      } else if (n2 !== void 0 && !m(n2, c2.entityLedger)) throw Error(`Previous entity ledger differs from Active`);
      let l3 = m(b(p2.desired), b(p2.active.configuration)), u2;
      if (o2 !== void 0) {
        if (i(o2, { ...s2, desired: p2.desired, active: p2.active }), o2.level === `blocked`) throw Error(`Plan cannot be applied`);
        u2 = o2.target;
      } else {
        if (!l3) throw Error(`Changed cold-start configuration requires a verified operation plan`);
        u2 = { configuration: p2.desired, packages: p2.active.packages, ...p2.active.ordered === void 0 ? {} : { ordered: p2.active.ordered } };
      }
      if (!l3 && o2.noChanges) throw Error(`Changed configuration cannot use a noChanges plan`);
      let d2 = p2.sequence + 1, f2 = `${p2.active.generation}:${p2.desired.revision}:${d2}`;
      return await E2({ ...p2, active: c2, sequence: d2, journal: { token: f2, kind: `cold-start`, level: `restart-required`, previousActive: c2, target: { ...u2, entityLedger: e4, backupId: a2 }, desiredRevision: p2.desired.revision } }), f2;
    });
  }, updateColdStartIdentities: (e3, t3) => {
    let n2 = structuredClone(t3);
    if (g(n2), !Array.isArray(n2)) throw Error(`Prepared identities are required`);
    return C2(async () => {
      let t4 = O(e3);
      if (t4.kind !== `cold-start`) throw Error(`Only cold startup can register identities`);
      await E2({ ...p2, journal: { ...t4, target: { ...t4.target, entityLedger: n2 } } });
    });
  }, complete: (e3, t3) => {
    let n2 = r(t3);
    return C2(async () => {
      t3 = n2;
      let r2 = O(e3);
      if (t3?.success !== true || t3.level !== r2.level || r2.kind === `cold-start` && t3.coldStartVerified !== true) throw Error(`Verified activation result is required`);
      if (p2.desired.revision !== r2.desiredRevision) throw Error(`Configuration changed during activation`);
      let i2 = r2.target.configuration;
      if (Object.hasOwn(t3, `modSettings`)) {
        if (r2.kind !== `cold-start`) {
          let e4 = s(i2.modSettings), n3 = s(t3.modSettings), { mods: a2, ...o2 } = e4, { mods: c2, ...l3 } = n3;
          if (!m(o2, l3)) throw Error(`Staged mod settings metadata changed`);
          let u2 = new Set(r2.settingsNamespaces || []);
          for (let e5 of /* @__PURE__ */ new Set([...Object.keys(a2), ...Object.keys(c2)])) if (!m(a2[e5], c2[e5]) && !u2.has(e5)) throw Error(`Staged mod settings cross operation ownership`);
        }
        i2 = a(i2, t3.modSettings), m(i2, r2.target.configuration) || (i2 = { ...i2, revision: i2.revision + 1 });
      }
      return E2({ ...p2, desired: i2, active: { ...r2.target, configuration: i2, generation: p2.active.generation + 1 }, journal: null, recovery: null });
    });
  }, writeActiveModSettings: (e3) => {
    let t3 = r(e3);
    return C2(async () => {
      if (D2(), p2.journal || p2.recovery?.required) throw Error(`Cannot write active settings during application or recovery`);
      return E2(c(p2, t3));
    });
  }, fail: (e3, t3 = {}) => C2(async () => {
    let n2 = O(e3), r2 = d.includes(t3.session) ? t3.session : `unknown`, i2 = f.includes(t3.persistent) ? t3.persistent : `unknown`;
    return E2({ ...p2, desired: n2.kind === `cold-start` ? p2.desired : { ...n2.previousActive.configuration, revision: p2.desired.revision + 1 }, active: n2.previousActive, journal: null, failedEntityTargets: [...p2.failedEntityTargets, y(n2)], recovery: { required: true, reason: String(t3.reason || `activation-failed`), failedTarget: n2.target, failedToken: n2.token, session: r2, persistent: i2, saveRestored: false } });
  }), suspendForRecovery: (e3, t3) => {
    let i2 = r(e3);
    return C2(async () => {
      if (D2(), n(i2), p2.journal || p2.desired.revision !== t3 || i2.revision !== t3 + 1) throw Error(`Recovery selection changed`);
      let e4 = ({ enabled: e5, suspendedByJsModding: t4, ...n2 }) => n2;
      if (!m(i2.mods.map(e4), p2.desired.mods.map(e4)) || !m({ ...i2, revision: 0, mods: [] }, { ...p2.desired, revision: 0, mods: [] }) || i2.mods.some((e5, t4) => e5.enabled && !p2.desired.mods[t4].enabled)) throw Error(`Recovery may only disable selected mods`);
      return E2({ ...p2, desired: i2, recovery: p2.recovery ? { ...p2.recovery, required: false, session: `restored`, sessionProof: `fresh recovery document: execution disabled; save and entity checks deferred to cold startup` } : null });
    });
  }, acknowledgeRecovery: (e3 = {}) => {
    let t3 = r(e3);
    return C2(async () => {
      if (D2(), p2.journal) throw Error(`Application is still pending`);
      if (!p2.recovery) return p2;
      if (t3.restoreActiveConfiguration && (t3.expectedRecoveryToken !== p2.recovery.failedToken || t3.expectedDesiredRevision !== p2.desired.revision || t3.expectedGeneration !== p2.active.generation)) throw Error(`Recovery selection changed`);
      if (p2.recovery.session !== `restored` && (t3.sessionRestored !== true || !t3.proof)) throw Error(`Verified session recovery is required; acknowledging cannot clean native state`);
      if (t3.restoredBackupId && (t3.restoredBackupId !== p2.recovery.failedTarget.backupId || !h(t3.restoredBackupId) || !t3.replacedSaveBackupId || !h(t3.replacedSaveBackupId))) throw Error(`Verified save restoration identities are required`);
      return E2({ ...p2, ...t3.restoreActiveConfiguration ? { desired: { ...p2.active.configuration, revision: p2.desired.revision + 1 } } : {}, recovery: { ...p2.recovery, required: false, session: `restored`, sessionProof: t3.proof || null, ...t3.restoredBackupId ? { saveRestored: true, restoredBackupId: t3.restoredBackupId, replacedSaveBackupId: t3.replacedSaveBackupId } : {} } });
    });
  } };
}
export {
  E as n,
  l as r,
  D as t
};
