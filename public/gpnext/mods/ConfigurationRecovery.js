import { i as e } from "./PackPreparation.js";
import { createNativeSaveBoundary } from "./ModSaveProtection.js";
async function restoreLastActiveSelection({ configurationState: t2, installStore: n2, assertCandidateAllowed: r2 }) {
  let i = t2.getState();
  if (i.journal || i.recovery?.required) throw Error(`Interrupted operation requires verified recovery`);
  if (r2(await e({ configuration: i.active.configuration, installStore: n2 })), t2.getState() !== i) throw Error(`Recovery selection changed`);
  return t2.saveDesired({ ...i.active.configuration, revision: i.desired.revision + 1 }, i.desired.revision);
}
async function recoverLastActiveConfiguration({ configurationState: n2, installStore: r2, saveBoundary: i, backups: a, restoreSave: o = false, isFresh: s, assertCandidateAllowed: c }) {
  let l = n2.getState(), u = () => {
    if (!s() || n2.getState() !== l) throw Error(`Recovery state changed; restart before trying again`);
  };
  if (u(), l.journal || !l.recovery?.required) throw Error(`No interrupted configuration is awaiting recovery`);
  let d = l.active.entityLedger, f = [d, ...l.failedEntityTargets.map((e2) => e2.entityLedger)];
  if (f.some((e2) => !Array.isArray(e2))) throw Error(`Unknown legacy entity identities prevent automatic recovery`);
  let p = i, m = null, h = null;
  if (o) {
    if (m = l.recovery.failedTarget.backupId, !m || !a) throw Error(`Startup save backup is unavailable`);
    let e2 = await a.read(m);
    if (u(), !e2) throw Error(`Startup save backup is missing`);
    p = createNativeSaveBoundary({ storage: { getItem: () => e2.raw } });
  }
  let g = () => {
    for (let e2 of f) p.checkAvailable(e2, d);
  };
  g();
  let _ = await e({ configuration: l.active.configuration, installStore: r2 });
  if (u(), c(_), g(), o) {
    let e2 = await i.capture();
    u(), h = e2.id;
    let t2 = await i.restore(m);
    if (u(), !t2.restored || t2.digest !== m) throw Error(`Save restoration could not be verified`);
  }
  return n2.acknowledgeRecovery({ sessionRestored: true, proof: `before-engine-import: fixed installed configuration and all failed identity references checked`, restoreActiveConfiguration: true, expectedRecoveryToken: l.recovery.failedToken, expectedDesiredRevision: l.desired.revision, expectedGeneration: l.active.generation, ...o ? { restoredBackupId: m, replacedSaveBackupId: h } : {} });
}
export {
  recoverLastActiveConfiguration,
  restoreLastActiveSelection
};
