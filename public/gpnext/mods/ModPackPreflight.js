import { F } from "./FileLoader.js";
import { i as t } from "./PackSnapshot.js";
import { t as n } from "./ModVersion.js";
var r = /* @__PURE__ */ new WeakMap();
function i(e2) {
  if (!/^[A-Za-z0-9][A-Za-z0-9._-]{2,127}$/.test(e2)) throw Error(`JS mod uuid must be 3-128 characters using letters, numbers, dot, underscore, or hyphen`);
}
function a(t2, { hasFeature: r2 } = {}) {
  if (t2?.meta?.validationErrors?.length) throw Error(t2.meta.validationErrors.join(`; `));
  if (Number(t2?.meta?.packFormatVersion ?? +!t2?.meta?.js) !== 1) throw Error(`${t2?.meta?.js ? `JS mods` : `Mods`} require packFormatVersion 1; pack declares ${t2?.meta?.packFormatVersion ?? `unspecified`}`);
  let i2 = n(F, { min: t2?.meta?.minGpNextVersion, max: t2?.meta?.maxGpNextVersion });
  if (!i2.ok) throw Error(i2.reason);
  let a2 = Array.isArray(t2?.meta?.requiredGpNextFeatures) ? t2.meta.requiredGpNextFeatures : [];
  if (a2.length > 0) {
    let e2 = a2.filter((e3) => r2?.(e3) === false), t3 = a2.filter((e3) => r2?.(e3) == null);
    if (e2.length > 0) throw Error(`Required GP-Next features are disabled: ${e2.join(`, `)}`);
    if (t3.length > 0) throw Error(`Unknown GP-Next feature requirements: ${t3.join(`, `)}`);
  }
  return { warnings: [] };
}
function o(e2, { hasFeature: n2 } = {}) {
  if (!String(e2?.meta?.uuid || ``).trim()) throw Error(`JS mods require a stable pack.json uuid`);
  i(String(e2?.meta?.uuid || e2?.meta?.name || e2?.dir || `unknown.mod`).trim());
  let r2 = Number(e2?.meta?.apiVersion || 0);
  if (r2 !== 2) {
    let e3 = r2 > 0 ? `v${r2}` : `unspecified`;
    throw Error(`JS mods must declare apiVersion 2; pack declares ${e3}`);
  }
  let { warnings: o2 } = a(e2, { hasFeature: n2 });
  if (e2?.meta?.js?.startup !== void 0 && typeof e2.meta.js.startup != `boolean`) throw Error(`js.startup must be a boolean`);
  if (e2?.meta?.js?.reloadable === false && e2.meta.js.startup !== true) throw Error(`Non-reloadable JS mods are not supported; setup must be fully disposable`);
  if (e2?.meta?.js?.requiresTrustedExecution === false) throw Error(`Sandboxed execution is not implemented; this loader only runs explicitly trusted JS mods`);
  let s2 = t(e2?.meta?.js?.entry, { label: `js.entry` });
  if (!/\.(?:m?js)$/i.test(s2)) throw Error(`js.entry must point to a .js or .mjs single-file bundle`);
  return { entryPath: s2, warnings: o2 };
}
async function s(e2, { fileLoader: t2, hasFeature: n2 } = {}) {
  let i2 = e2?.meta;
  i2 && typeof i2 == `object` && r.set(i2, null);
  let a2 = [];
  try {
    let s2 = o(e2, { hasFeature: n2 });
    a2 = s2.warnings;
    let { entryPath: c2 } = s2, l = JSON.stringify(i2), u = e2.dir, d = await t2.readTextFrom(e2.dir, c2.replace(/\//g, `\\`));
    if (!d) throw Error(`JS entry not found or empty: ${c2}`);
    if (e2.meta !== i2 || e2.dir !== u || JSON.stringify(i2) !== l) throw Error(`Prepared JS pack plan changed while reading the entry; prepare the pack again before activation`);
    return r.set(i2, { dir: u, signature: l, script: Object.freeze({ entryPath: c2, source: d }) }), { errors: [], warnings: a2 };
  } catch (e3) {
    return { errors: [String(e3?.message || e3 || `Unknown error`)], warnings: a2 };
  }
}
function c(e2) {
  if (!r.has(e2?.meta)) return null;
  let t2 = r.get(e2?.meta), n2 = false;
  try {
    n2 = t2 && t2.dir === e2.dir && t2.signature === JSON.stringify(e2.meta);
  } catch {
  }
  if (!n2) throw Error(`Prepared JS pack plan is stale or unavailable; prepare the pack again before activation`);
  return t2.script;
}
export {
  o as i,
  c as n,
  a as r,
  s as t
};
