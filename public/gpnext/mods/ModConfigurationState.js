import { t as e } from "../core/Logger.js";
import { i as t, r as n, t as r } from "./ModOperationPlan.js";
import { i, n as a, r as o, t as s } from "./ConfigurationModSettings.js";
var c = new e(`configuration-state`), l = [`restored`, `restart-required`, `unknown`], u = [`unchanged`, `changed`, `unknown`], d = [`immediate`, `scene-boundary`, `restart-required`], f = (e2, t2) => JSON.stringify(e2) === JSON.stringify(t2), p = (e2) => e2 === null || typeof e2 == `string` && /^[a-f0-9]{64}$/.test(e2);
function m(e2) {
  if (e2 === null) return;
  if (!Array.isArray(e2)) throw Error(`Invalid entity ledger`);
  let t2 = /* @__PURE__ */ new Set(), n2 = /* @__PURE__ */ new Set(), r2 = /* @__PURE__ */ new Set();
  for (let i2 of e2) {
    if (!i2 || typeof i2.id != `string` || !i2.id.trim() || ![`plant`, `zombie`].includes(i2.kind) || typeof i2.codename != `string` || !i2.codename.trim() || !Number.isSafeInteger(i2.engineId) || i2.engineId < 0 || t2.has(i2.id) || n2.has(`${i2.kind}:${i2.codename}`) || r2.has(`${i2.kind}:${i2.engineId}`)) throw Error(`Invalid or conflicting entity ledger`);
    t2.add(i2.id), n2.add(`${i2.kind}:${i2.codename}`), r2.add(`${i2.kind}:${i2.engineId}`);
  }
}
function h(e2) {
  if (m(e2.entityLedger), !p(e2.backupId)) throw Error(`Invalid save backup identity`);
  if (e2.entityLedgerProof !== void 0 && (typeof e2.entityLedgerProof != `string` || !e2.entityLedgerProof.trim())) throw Error(`Invalid entity ledger migration proof`);
}
var g = (e2) => ({ ...e2, entityLedger: e2.entityLedger === void 0 ? null : e2.entityLedger, backupId: e2.backupId === void 0 ? null : e2.backupId }), _ = (e2) => ({ token: e2.token, entityLedger: e2.target.entityLedger, backupId: e2.target.backupId });
function v(e2) {
  let { revision: t2, ...n2 } = e2;
  return n2;
}
function y(e2) {
  if (e2.modSettings !== void 0 && !f(i(e2, e2.modSettings).mods, e2.mods)) throw Error(`Mod settings values differ from the configuration snapshot`);
}
function b(e2) {
  if (t(e2?.configuration), y(e2.configuration), !Array.isArray(e2.packages)) throw Error(`Invalid package snapshots`);
  t({ revision: 0, mods: e2.packages.map((e3) => ({ ...e3, enabled: true })) });
  let n2 = e2.configuration.mods.filter((e3) => e3.enabled);
  if (n2.length !== e2.packages.length || n2.some((t2) => !e2.packages.some((e3) => e3.id === t2.id && e3.version === t2.version && e3.contentDigest === t2.contentDigest))) throw Error(`Package snapshots do not match configuration`);
  if (e2.ordered !== void 0 && (!Array.isArray(e2.ordered) || e2.ordered.length !== n2.length || new Set(e2.ordered).size !== n2.length || e2.ordered.some((e3) => !n2.some((t2) => t2.id === e3)))) throw Error(`Invalid active order`);
}
function x(e2) {
  if (b(e2), !Number.isSafeInteger(e2.generation) || e2.generation < 0) throw Error(`Invalid active generation`);
}
function S(e2, n2 = false) {
  if (e2?.formatVersion !== (n2 ? 1 : 2) || !Number.isSafeInteger(e2.sequence) || e2.sequence < 0) throw Error(`Invalid configuration state`);
  if (t(e2.desired), y(e2.desired), x(e2.active), !n2) {
    if (h(e2.active), !Array.isArray(e2.failedEntityTargets)) throw Error(`Invalid failed entity history`);
    let t2 = /* @__PURE__ */ new Set();
    for (let n3 of e2.failedEntityTargets) {
      if (!n3 || typeof n3.token != `string` || !n3.token || t2.has(n3.token)) throw Error(`Invalid failed entity history token`);
      h(n3), t2.add(n3.token);
    }
  }
  if (e2.journal !== null) {
    let t2 = e2.journal;
    if (!t2 || typeof t2 != `object`) throw Error(`Invalid application journal`);
    if (x(t2.previousActive), b(t2.target), !n2) {
      if (h(t2.previousActive), h(t2.target), ![`operation`, `cold-start`].includes(t2.kind) || e2.failedEntityTargets.some((e3) => e3.token === t2.token)) throw Error(`Invalid journal kind or history binding`);
      if (t2.kind === `cold-start`) {
        if (t2.level !== `restart-required` || t2.previousActive.entityLedger === null || t2.target.entityLedger === null || t2.target.backupId === null) throw Error(`Incomplete cold-start identity or backup`);
      } else {
        if (!f(t2.target.entityLedger, t2.previousActive.entityLedger)) throw Error(`Operation cannot change entity identity`);
        if (t2.runtimeBackupId !== void 0) {
          if (!p(t2.runtimeBackupId) || t2.runtimeBackupId === null || t2.previousActive.entityLedger === null || ![`immediate`, `scene-boundary`].includes(t2.level) || t2.target.backupId !== t2.runtimeBackupId) throw Error(`Invalid runtime operation backup`);
        } else if (t2.target.backupId !== t2.previousActive.backupId) throw Error(`Operation cannot change entity identity`);
      }
    }
    if (t2.settingsNamespaces !== void 0) {
      let e3 = new Set(t2.target.configuration.mods.filter((e4) => e4.enabled).map(a));
      if (!Array.isArray(t2.settingsNamespaces) || new Set(t2.settingsNamespaces).size !== t2.settingsNamespaces.length || t2.settingsNamespaces.some((t3) => !e3.has(t3))) throw Error(`Invalid staged settings ownership`);
    }
    if (!d.includes(t2.level) || !Number.isSafeInteger(t2.desiredRevision) || t2.desiredRevision !== e2.desired.revision || t2.desiredRevision !== t2.target.configuration.revision || !f(t2.previousActive, e2.active) || !f(t2.target.configuration, e2.desired) || e2.sequence < 1 || t2.token !== `${e2.active.generation}:${t2.desiredRevision}:${e2.sequence}`) throw Error(`Invalid journal binding`);
  }
  if (e2.recovery !== null) {
    let t2 = e2.recovery;
    if (!t2 || typeof t2.required != `boolean` || typeof t2.reason != `string` || !t2.reason || !l.includes(t2.session) || !u.includes(t2.persistent) || typeof t2.saveRestored != `boolean` || t2.saveRestored && (t2.required || t2.restoredBackupId !== t2.failedTarget?.backupId || !t2.restoredBackupId || !p(t2.restoredBackupId) || !t2.replacedSaveBackupId || !p(t2.replacedSaveBackupId)) || !t2.required && t2.session !== `restored` || t2.required && e2.journal || t2.sessionProof != null && typeof t2.sessionProof != `string`) throw Error(`Invalid recovery state`);
    if (b(t2.failedTarget), !n2 && (h(t2.failedTarget), typeof t2.failedToken != `string` || !e2.failedEntityTargets.some((e3) => e3.token === t2.failedToken && f(e3.entityLedger, t2.failedTarget.entityLedger) && e3.backupId === t2.failedTarget.backupId))) throw Error(`Recovery entity history is missing`);
  }
}
function C(e2) {
  S(e2, true);
  let t2 = e2.recovery && { ...e2.recovery, failedTarget: g(e2.recovery.failedTarget), failedToken: `legacy-recovery:${e2.sequence}` }, n2 = { ...e2, formatVersion: 2, active: g(e2.active), failedEntityTargets: [], journal: e2.journal && { ...e2.journal, kind: `operation`, previousActive: g(e2.journal.previousActive), target: g(e2.journal.target) }, recovery: t2 };
  return t2 && n2.failedEntityTargets.push({ token: t2.failedToken, entityLedger: t2.failedTarget.entityLedger, backupId: t2.failedTarget.backupId }), n2;
}
function w({ active: e2, desired: t2 }) {
  let r2 = n({ formatVersion: 2, sequence: 0, active: e2, desired: t2, journal: null, recovery: null, failedEntityTargets: [] });
  if (S(r2), !Array.isArray(e2.entityLedger) || !e2.entityLedgerProof) throw Error(`Verified legacy entity identity is required`);
  return r2;
}
function createConfigurationState({ storage: e2, initial: d2 }) {
  let h2 = /* @__PURE__ */ new Set(), y2 = null, b2 = Promise.resolve(), x2 = (e3) => {
    let t2 = b2.then(e3);
    return b2 = t2.catch(() => {
    }), t2;
  }, w2 = async (t2) => {
    S(t2);
    let r2 = n(t2);
    await e2.write(r2), y2 = r2;
    for (let e3 of [...h2]) try {
      e3(y2);
    } catch (e4) {
      c.warn(`Configuration observer failed`, e4);
    }
    return y2;
  }, T2 = () => {
    if (!y2) throw Error(`Configuration state is not loaded`);
  }, E = (e3) => {
    if (T2(), !y2.journal || y2.journal.token !== e3) throw Error(`Application transaction is stale or absent`);
    return y2.journal;
  };
  return { getState() {
    return T2(), y2;
  }, subscribe(e3) {
    return h2.add(e3), () => h2.delete(e3);
  }, load: () => x2(async () => {
    if (y2) return y2;
    let t2 = await e2.read(), r2 = t2?.formatVersion === 1 ? C(t2) : t2 ?? { formatVersion: 2, sequence: 0, desired: d2.configuration, active: g(d2), journal: null, recovery: null, failedEntityTargets: [] };
    return S(r2), r2.journal ? w2({ ...r2, desired: { ...r2.journal.previousActive.configuration, revision: r2.desired.revision + 1 }, active: r2.journal.previousActive, journal: null, failedEntityTargets: [...r2.failedEntityTargets, _(r2.journal)], recovery: { required: true, reason: `interrupted-application`, failedTarget: r2.journal.target, failedToken: r2.journal.token, session: `restart-required`, persistent: `unknown`, saveRestored: false } }) : (y2 = n(r2), y2);
  }), saveDesired: (e3, r2) => {
    let i2 = n(e3);
    return x2(async () => {
      if (T2(), t(i2), y2.journal) throw Error(`Cannot edit configuration during application`);
      if (r2 !== y2.desired.revision || i2.revision !== r2 + 1) throw Error(`Configuration revision changed`);
      return w2({ ...y2, desired: i2 });
    });
  }, begin: (e3, t2, i2 = {}) => {
    let o2 = n({ plan: e3, currentInput: t2, execution: i2 });
    return x2(async () => {
      let { plan: e4, currentInput: t3, execution: n2 } = o2;
      if (T2(), y2.journal || y2.recovery?.required) throw Error(`Resolve the pending application or recovery first`);
      if (r(e4, { ...t3, desired: y2.desired, active: y2.active }), e4.level === `blocked` || e4.noChanges) throw Error(`Plan cannot be applied`);
      let i3 = Object.hasOwn(n2, `runtimeBackupId`);
      if (i3 && (!p(n2.runtimeBackupId) || n2.runtimeBackupId === null || y2.active.entityLedger === null || ![`immediate`, `scene-boundary`].includes(e4.level))) throw Error(`Runtime application requires a current backup and known entity ledger`);
      let s2 = y2.sequence + 1, c2 = `${y2.active.generation}:${y2.desired.revision}:${s2}`;
      return await w2({ ...y2, sequence: s2, journal: { token: c2, kind: `operation`, level: e4.level, previousActive: y2.active, target: { ...e4.target, entityLedger: y2.active.entityLedger, backupId: i3 ? n2.runtimeBackupId : y2.active.backupId }, desiredRevision: y2.desired.revision, ...i3 ? { runtimeBackupId: n2.runtimeBackupId } : {}, settingsNamespaces: e4.target.configuration.mods.filter((t4) => t4.enabled && e4.affected.includes(t4.id)).map(a) } }), c2;
    });
  }, beginColdStart: (e3) => {
    let t2 = n(e3);
    return x2(async () => {
      if (T2(), y2.journal || y2.recovery?.required) throw Error(`Resolve the pending application or recovery first`);
      let { targetEntityLedger: e4, previousEntityLedger: n2, migrationProof: i2, backupId: a2, plan: o2, currentInput: s2 } = t2;
      if (m(e4), e4 === null || !p(a2) || a2 === null) throw Error(`Known target entity ledger and exact backup are required`);
      let c2 = y2.active;
      if (c2.entityLedger === null) {
        if (m(n2), n2 === null || typeof i2 != `string` || !i2.trim()) throw Error(`Verified previous entity ledger migration is required`);
        c2 = { ...c2, entityLedger: n2, entityLedgerProof: i2 };
      } else if (n2 !== void 0 && !f(n2, c2.entityLedger)) throw Error(`Previous entity ledger differs from Active`);
      let l2 = f(v(y2.desired), v(y2.active.configuration)), u2;
      if (o2 !== void 0) {
        if (r(o2, { ...s2, desired: y2.desired, active: y2.active }), o2.level === `blocked`) throw Error(`Plan cannot be applied`);
        u2 = o2.target;
      } else {
        if (!l2) throw Error(`Changed cold-start configuration requires a verified operation plan`);
        u2 = { configuration: y2.desired, packages: y2.active.packages, ...y2.active.ordered === void 0 ? {} : { ordered: y2.active.ordered } };
      }
      if (!l2 && o2.noChanges) throw Error(`Changed configuration cannot use a noChanges plan`);
      let d3 = y2.sequence + 1, h3 = `${y2.active.generation}:${y2.desired.revision}:${d3}`;
      return await w2({ ...y2, active: c2, sequence: d3, journal: { token: h3, kind: `cold-start`, level: `restart-required`, previousActive: c2, target: { ...u2, entityLedger: e4, backupId: a2 }, desiredRevision: y2.desired.revision } }), h3;
    });
  }, updateColdStartIdentities: (e3, t2) => {
    let n2 = structuredClone(t2);
    if (m(n2), !Array.isArray(n2)) throw Error(`Prepared identities are required`);
    return x2(async () => {
      let t3 = E(e3);
      if (t3.kind !== `cold-start`) throw Error(`Only cold startup can register identities`);
      await w2({ ...y2, journal: { ...t3, target: { ...t3.target, entityLedger: n2 } } });
    });
  }, complete: (e3, t2) => {
    let r2 = n(t2);
    return x2(async () => {
      t2 = r2;
      let n2 = E(e3);
      if (t2?.success !== true || t2.level !== n2.level || n2.kind === `cold-start` && t2.coldStartVerified !== true) throw Error(`Verified activation result is required`);
      if (y2.desired.revision !== n2.desiredRevision) throw Error(`Configuration changed during activation`);
      let a2 = n2.target.configuration;
      if (Object.hasOwn(t2, `modSettings`)) {
        if (n2.kind !== `cold-start`) {
          let e4 = o(a2.modSettings), r3 = o(t2.modSettings), { mods: i2, ...s2 } = e4, { mods: c2, ...l2 } = r3;
          if (!f(s2, l2)) throw Error(`Staged mod settings metadata changed`);
          let u2 = new Set(n2.settingsNamespaces || []);
          for (let e5 of /* @__PURE__ */ new Set([...Object.keys(i2), ...Object.keys(c2)])) if (!f(i2[e5], c2[e5]) && !u2.has(e5)) throw Error(`Staged mod settings cross operation ownership`);
        }
        a2 = i(a2, t2.modSettings), f(a2, n2.target.configuration) || (a2 = { ...a2, revision: a2.revision + 1 });
      }
      return w2({ ...y2, desired: a2, active: { ...n2.target, configuration: a2, generation: y2.active.generation + 1 }, journal: null, recovery: null });
    });
  }, writeActiveModSettings: (e3) => {
    let t2 = n(e3);
    return x2(async () => {
      if (T2(), y2.journal || y2.recovery?.required) throw Error(`Cannot write active settings during application or recovery`);
      return w2(s(y2, t2));
    });
  }, fail: (e3, t2 = {}) => x2(async () => {
    let n2 = E(e3), r2 = l.includes(t2.session) ? t2.session : `unknown`, i2 = u.includes(t2.persistent) ? t2.persistent : `unknown`;
    return w2({ ...y2, desired: { ...n2.previousActive.configuration, revision: y2.desired.revision + 1 }, active: n2.previousActive, journal: null, failedEntityTargets: [...y2.failedEntityTargets, _(n2)], recovery: { required: true, reason: String(t2.reason || `activation-failed`), failedTarget: n2.target, failedToken: n2.token, session: r2, persistent: i2, saveRestored: false } });
  }), acknowledgeRecovery: (e3 = {}) => {
    let t2 = n(e3);
    return x2(async () => {
      if (T2(), y2.journal) throw Error(`Application is still pending`);
      if (!y2.recovery) return y2;
      if (t2.restoreActiveConfiguration && (t2.expectedRecoveryToken !== y2.recovery.failedToken || t2.expectedDesiredRevision !== y2.desired.revision || t2.expectedGeneration !== y2.active.generation)) throw Error(`Recovery selection changed`);
      if (y2.recovery.session !== `restored` && (t2.sessionRestored !== true || !t2.proof)) throw Error(`Verified session recovery is required; acknowledging cannot clean native state`);
      if (t2.restoredBackupId && (t2.restoredBackupId !== y2.recovery.failedTarget.backupId || !p(t2.restoredBackupId) || !t2.replacedSaveBackupId || !p(t2.replacedSaveBackupId))) throw Error(`Verified save restoration identities are required`);
      return w2({ ...y2, ...t2.restoreActiveConfiguration ? { desired: { ...y2.active.configuration, revision: y2.desired.revision + 1 } } : {}, recovery: { ...y2.recovery, required: false, session: `restored`, sessionProof: t2.proof || null, ...t2.restoredBackupId ? { saveRestored: true, restoredBackupId: t2.restoredBackupId, replacedSaveBackupId: t2.replacedSaveBackupId } : {} } });
    });
  } };
}
export {
  createConfigurationState,
  w as n
};
