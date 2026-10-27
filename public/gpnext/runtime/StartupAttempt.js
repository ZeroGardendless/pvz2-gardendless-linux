import { t } from "../core/BuildIdentity.js";
import { isJsModdingRuntimeEnabled } from "../core/SettingsStore.js";
import { a, r } from "../mods/PackPreparation.js";
var i = `gpn-startup-attempt`, STARTUP_ATTEMPT_CHECKS = Object.freeze([`dependencies`, `feature-requirements`, `data-content-digest`, `entity-mapping`, `save-content`, `previous-session`]);
async function startupAttemptBinding(t2, n2, r2, i2 = t) {
  let o2 = new TextEncoder().encode(JSON.stringify([t2, n2, r2, i2, STARTUP_ATTEMPT_CHECKS]));
  return [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, o2))].map((e2) => e2.toString(16).padStart(2, `0`)).join(``);
}
function authorizeStartupAttempt(e2, t2 = sessionStorage) {
  let n2 = { binding: e2, checks: STARTUP_ATTEMPT_CHECKS, issuedAt: Date.now() };
  if (t2.setItem(i, JSON.stringify(n2)), t2.getItem(i) !== JSON.stringify(n2)) throw Error(`Startup attempt confirmation could not be saved`);
}
function consumeStartupAttempt(e2 = sessionStorage) {
  let t2 = e2.getItem(i);
  if (e2.removeItem(i), !t2) return null;
  let n2 = JSON.parse(t2);
  if (!/^[a-f0-9]{64}$/.test(n2.binding) || JSON.stringify(n2.checks) !== JSON.stringify(STARTUP_ATTEMPT_CHECKS) || !Number.isFinite(n2.issuedAt) || Date.now() - n2.issuedAt < 0 || Date.now() - n2.issuedAt > 6e4) throw Error(`Startup attempt confirmation expired`);
  return n2;
}
function assertStartupAttempt(e2, t2) {
  if (!e2 || e2.binding !== t2) throw Error(`Configuration or package content changed; confirm a new startup attempt`);
}
async function prepareStartupAttempt(e2, i2, { preferences: a2 = localStorage.getItem(`gp-next-settings`), jsEnabled: s2 = isJsModdingRuntimeEnabled() } = {}) {
  let c2 = e2.recovery?.required ? e2.recovery.failedTarget.configuration : e2.desired, l2 = [], u2 = [], d = [];
  for (let e3 of c2.mods) {
    let t2 = await i2.read(e3.contentDigest, { allowContentMismatch: true });
    if (!t2) throw Error(`Installed package is unavailable: ${e3.fallbackName || e3.id}`);
    if (t2.digest !== e3.contentDigest && t2.listPaths().some((e4) => /\.(?:m?js|cjs)$/i.test(e4))) throw Error(`Script package changed; import it again and confirm trust: ${e3.fallbackName || e3.id}`);
    l2.push({ ...e3, snapshot: t2, contentDigest: t2.digest }), u2.push([e3.id, t2.digest]);
  }
  for (let e3 of c2.overrides) {
    let t2 = await i2.read(e3.contentDigest, { allowContentMismatch: true });
    if (!t2) throw Error(`Installed overrides are unavailable: ${e3.kind}`);
    d.push([e3.kind === `patches` ? `gp-next/patches` : `gp-next/__gpn_edits`, t2]), u2.push([e3.kind, t2.digest]);
  }
  let f = await a({ packages: l2, overrides: d, attempt: true, settings: { packOrder: c2.mods.map((e3) => e3.id), disabledPacks: c2.mods.filter((e3) => !e3.enabled).map((e3) => e3.id) } });
  r(f);
  for (let e3 of f.packs.filter((e4) => e4.enabled !== false)) if ((e3.meta.js || e3.meta.requiredGpNextFeatures.some((e4) => [`experimental.jsModding`, `runtime.jsModding`].includes(e4))) && !s2) throw Error(`JavaScript modding is disabled`);
  return Object.freeze({ candidate: f, configuration: c2, preferences: a2, binding: await startupAttemptBinding(e2, a2, u2) });
}
export {
  STARTUP_ATTEMPT_CHECKS,
  assertStartupAttempt,
  authorizeStartupAttempt,
  consumeStartupAttempt,
  prepareStartupAttempt,
  startupAttemptBinding
};
