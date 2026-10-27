import { n as e } from "../vendor/ModuleHelpers.js";
var t = e({ createModDiagnosticReport: () => i }), n = (e2, t2) => Object.fromEntries(t2.flatMap((t3) => {
  let n2 = e2?.[t3];
  return [`string`, `number`, `boolean`].includes(typeof n2) ? [[t3, n2]] : [];
})), r = (e2) => e2 ? { revision: e2.revision, mods: e2.mods.map((e3) => n(e3, [`id`, `version`, `contentDigest`, `enabled`])) } : null;
function i({ version: e2, clientEdition: t2, state: i2 = null, diagnostics: a = {}, sources: o = null, redact: s = true, patchStatus: c = {} }) {
  let l = (e3) => (e3 || []).map((e4) => s ? { code: /^[A-Z][A-Z0-9_]{0,63}$/.test(e4?.code || ``) ? e4.code : `DETAILS_REDACTED` } : { message: String(e4?.message || e4), ...e4?.code ? { code: String(e4.code) } : {} });
  return a ||= {}, { redacted: s, patchErrors: l(c.errors), packs: (c.packs || []).map((e3) => ({ id: e3.meta?.uuid || ``, errors: l([...e3.preflightErrors || [], ...e3.errors || []]) })).filter((e3) => e3.errors.length), sharedHooks: (a.conflicts || []).map((e3) => ({ ...n(e3, [`key`, `kind`]), owners: [...e3.owners || []] })), formatVersion: 1, version: e2, clientEdition: t2, sourcesAvailable: o !== null, sources: (o || []).map((e3) => ({ ...n(e3, [`kind`, `contentDigest`]), ...n(e3.meta, [`uuid`, `name`, `version`, `apiVersion`]) })), configuration: i2 ? { desired: r(i2.desired), active: r(i2.active.configuration), generation: i2.active.generation, applying: i2.journal !== null, recovery: i2.recovery ? n(i2.recovery, [`required`, `session`, `persistent`, `saveRestored`]) : null } : null, runtimes: (a.runtimes || []).map((e3) => ({ ...n(e3, [`namespace`, `version`, `apiVersion`, `state`, `phase`, `generation`, `pendingTasks`, `conflicts`]), errorCount: e3.errors?.length || 0, warningCount: e3.warnings?.length || 0, errors: l(e3.errors), warnings: l(e3.warnings) })), consumers: Object.fromEntries([`fileConsumers`, `serviceConsumers`, `dataConsumers`, `eventConsumers`, `hookConsumers`].filter((e3) => a[e3]).map((e3) => [e3, { ...n(a[e3], [`complete`, `coverage`, `revision`]), edges: (a[e3].edges || []).map((e4) => n(e4, [`provider`, `consumer`, `kind`])) }])) };
}
export {
  t as n,
  i as t
};
