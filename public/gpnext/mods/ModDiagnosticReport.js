var e = (e2, t2) => Object.fromEntries(t2.flatMap((t3) => {
  let n2 = e2?.[t3];
  return [`string`, `number`, `boolean`].includes(typeof n2) ? [[t3, n2]] : [];
})), t = (t2) => t2 ? { revision: t2.revision, mods: t2.mods.map((t3) => e(t3, [`id`, `version`, `contentDigest`, `enabled`])) } : null;
function createModDiagnosticReport({ version: n2, clientEdition: r, state: i = null, diagnostics: a = {}, sources: o = null }) {
  a ||= {};
  return { conflicts: (a.conflicts || []).map((item) => ({ key: item.key, kind: item.kind, owners: [...item.owners || []] })), formatVersion: 1, version: n2, clientEdition: r, sourcesAvailable: o !== null, sources: (o || []).map((t2) => ({ ...e(t2, [`kind`, `contentDigest`]), ...e(t2.meta, [`uuid`, `name`, `version`, `apiVersion`]) })), configuration: i ? { desired: t(i.desired), active: t(i.active.configuration), generation: i.active.generation, applying: i.journal !== null, recovery: i.recovery ? e(i.recovery, [`required`, `session`, `persistent`, `saveRestored`]) : null } : null, runtimes: (a.runtimes || []).map((t2) => ({ ...e(t2, [`namespace`, `version`, `apiVersion`, `state`, `phase`, `generation`, `pendingTasks`, `conflicts`]), errors: (t2.errors || []).map((error) => String(error?.message || error)), warnings: (t2.warnings || []).map((error) => String(error?.message || error)), errorCount: t2.errors?.length || 0, warningCount: t2.warnings?.length || 0 })), consumers: Object.fromEntries([`fileConsumers`, `serviceConsumers`, `dataConsumers`, `eventConsumers`, `hookConsumers`].filter((e2) => a[e2]).map((t2) => [t2, { ...e(a[t2], [`complete`, `coverage`, `revision`]), edges: (a[t2].edges || []).map((t3) => e(t3, [`provider`, `consumer`, `kind`])) }])) };
}
export {
  createModDiagnosticReport
};
