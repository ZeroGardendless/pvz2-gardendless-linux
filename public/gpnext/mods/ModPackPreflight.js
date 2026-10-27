import { c as e } from "./GameConfiguration.js";
import { o as t } from "../ui/Translations.js";
import { i as n } from "./PackSnapshot.js";
import { t as r } from "./ModVersion.js";
var i = /* @__PURE__ */ new WeakMap();
function a(e2) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/.test(e2)) throw Error(`JS mod uuid must be 3-128 characters using letters, numbers, dot, underscore, or hyphen`);
}
function o(n2) {
  let i2 = r(e, n2);
  return i2.ok ? [] : [t(i2.invalid ? `patcher.invalidGpNextVersion` : `patcher.incompatibleGpNextVersion`, i2.requirement, e)];
}
function s(e2, { hasFeature: t2, attempt: n2 = false } = {}) {
  if (e2?.meta?.validationErrors?.length) throw Error(e2.meta.validationErrors.join(`; `));
  if (Number(e2?.meta?.packFormatVersion ?? +!e2?.meta?.js) !== 1) throw Error(`${e2?.meta?.js ? `JS mods` : `Mods`} require packFormatVersion 1; pack declares ${e2?.meta?.packFormatVersion ?? `unspecified`}`);
  let r2 = Array.isArray(e2?.meta?.requiredGpNextFeatures) ? e2.meta.requiredGpNextFeatures : [];
  if (r2.length > 0) {
    let e3 = n2 ? r2.filter((e4) => [`experimental.jsModding`, `runtime.jsModding`].includes(e4)) : r2, i2 = e3.filter((e4) => t2?.(e4) === false), a2 = e3.filter((e4) => t2?.(e4) == null);
    if (i2.length > 0) throw Error(`Required GP-Next features are disabled: ${i2.join(`, `)}`);
    if (a2.length > 0) throw Error(`Unknown GP-Next feature requirements: ${a2.join(`, `)}`);
  }
  return { warnings: o(e2?.meta) };
}
function c(e2, { hasFeature: t2, attempt: r2 = false } = {}) {
  if (!String(e2?.meta?.uuid || ``).trim()) throw Error(`JS mods require a stable pack.json uuid`);
  a(String(e2?.meta?.uuid || e2?.meta?.name || e2?.dir || `unknown.mod`).trim());
  let i2 = Number(e2?.meta?.apiVersion || 0);
  if (i2 !== 2) {
    let e3 = i2 > 0 ? `v${i2}` : `unspecified`;
    throw Error(`JS mods must declare apiVersion 2; pack declares ${e3}`);
  }
  let { warnings: o2 } = s(e2, { hasFeature: t2, attempt: r2 });
  if (e2?.meta?.js?.startup !== void 0 && typeof e2.meta.js.startup != `boolean`) throw Error(`js.startup must be a boolean`);
  if (e2?.meta?.js?.reloadable === false && e2.meta.js.startup !== true) throw Error(`Non-reloadable JS mods are not supported; setup must be fully disposable`);
  if (e2?.meta?.js?.requiresTrustedExecution === false) throw Error(`Sandboxed execution is not implemented; this loader only runs explicitly trusted JS mods`);
  let c2 = n(e2?.meta?.js?.entry, { label: `js.entry` });
  if (!/\.(?:m?js)$/i.test(c2)) throw Error(`js.entry must point to a .js or .mjs single-file bundle`);
  return { entryPath: c2, warnings: o2 };
}
async function l(e2, { fileLoader: t2, hasFeature: n2, attempt: r2 = false } = {}) {
  let a2 = e2?.meta;
  a2 && typeof a2 == `object` && i.set(a2, null);
  let o2 = [];
  try {
    let s2 = c(e2, { hasFeature: n2, attempt: r2 });
    o2 = s2.warnings;
    let { entryPath: l2 } = s2, u2 = JSON.stringify(a2), d = e2.dir, f = await t2.readTextFrom(e2.dir, l2.replace(/\//g, `\\`));
    if (!f) throw Error(`JS entry not found or empty: ${l2}`);
    if (e2.meta !== a2 || e2.dir !== d || JSON.stringify(a2) !== u2) throw Error(`Prepared JS pack plan changed while reading the entry; prepare the pack again before activation`);
    return i.set(a2, { dir: d, signature: u2, script: Object.freeze({ entryPath: l2, source: f }) }), { errors: [], warnings: o2 };
  } catch (e3) {
    return { errors: [String(e3?.message || e3 || `Unknown error`)], warnings: o2 };
  }
}
function u(e2) {
  if (!i.has(e2?.meta)) return null;
  let t2 = i.get(e2?.meta), n2 = false;
  try {
    n2 = t2 && t2.dir === e2.dir && t2.signature === JSON.stringify(e2.meta);
  } catch {
  }
  if (!n2) throw Error(`Prepared JS pack plan is stale or unavailable; prepare the pack again before activation`);
  return t2.script;
}
export {
  c as a,
  s as i,
  l as n,
  u as r,
  o as t
};
