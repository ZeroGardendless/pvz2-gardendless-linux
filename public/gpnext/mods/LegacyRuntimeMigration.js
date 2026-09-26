import { r as e } from "../vendor/ModuleHelpers.js";
import { O, P, c as r, j, o as a } from "./FileLoader.js";
import { i as o } from "./PackSnapshot.js";
import { r as s } from "./ModOperationPlan.js";
import { i as c } from "./PackPreparation.js";
import { i as l } from "./ModSettingsRegistry.js";
import { i as u } from "./ConfigurationModSettings.js";
import { n } from "./ModConfigurationState.js";
var f = e(O(), 1), p = /^[a-f0-9]{64}$/, m = (e2) => o(e2, { label: `legacy source` });
async function h(e2) {
  return `legacy:` + [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(e2)))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
}
async function g(e2) {
  let { packs: t2, previousMods: n2 = [], overrides: r2, modSettings: i2 } = structuredClone(e2);
  if (!Array.isArray(t2) || !Array.isArray(n2)) throw Error(`Migration needs package and previous mod arrays`);
  let a2 = [], o2 = [], c2 = [], l2 = [], u2 = (e3, t3, n3) => a2.push({ code: e3, source: t3, message: n3 }), d2 = /* @__PURE__ */ new Map(), f2 = /* @__PURE__ */ new Set();
  for (let e3 of n2) {
    if (typeof e3.id != `string` || !e3.id || f2.has(e3.id)) {
      u2(`PREVIOUS_ID_CONFLICT`, e3.sourceKey, `Previous installation identities are invalid or duplicated`);
      continue;
    }
    if (f2.add(e3.id), !e3.sourceKey) continue;
    let t3 = m(e3.sourceKey);
    d2.has(t3) ? u2(`PREVIOUS_SOURCE_CONFLICT`, t3, `Multiple previous identities share one source`) : d2.set(t3, e3);
  }
  let g2 = /* @__PURE__ */ new Set(), _2 = /* @__PURE__ */ new Set(), v2 = /* @__PURE__ */ new Map();
  for (let e3 of t2) {
    let t3 = m(e3.dir);
    _2.has(t3) && u2(`SOURCE_CONFLICT`, t3, `Source occurs more than once`), _2.add(t3);
    let r3 = e3.meta || {};
    (r3.js || (r3.capabilities || []).includes(`js`)) && u2(`LEGACY_SCRIPT_UNSUPPORTED`, t3, `\u65E7\u7248 JS \u6A21\u7EC4\u4E0D\u652F\u6301\u8FC1\u79FB\uFF0C\u8BF7\u79FB\u9664\u540E\u6309\u65B0\u89C4\u8303\u91CD\u65B0\u5B89\u88C5`);
    let a3 = String(r3.uuid || ``), s2 = !a3, l3 = d2.get(t3), f3 = String(e3.fallbackName || r3.name || t3.split(`/`).at(-1).replace(/\.zip$/i, ``)), y3 = String(a3 || r3.name || e3.dir).trim(), b2 = a3;
    s2 ? (l3 && (!l3.legacy || !/^legacy:[a-f0-9]{64}$/.test(l3.id)) && u2(`IDENTITY_ADOPTION_REQUIRED`, t3, `Source identity changed; explicit reconciliation is required`), b2 = l3?.legacy && /^legacy:[a-f0-9]{64}$/.test(l3.id) ? l3.id : await h(t3)) : (a3.startsWith(`legacy:`) || l3 && l3.id !== a3) && u2(`IDENTITY_ADOPTION_REQUIRED`, t3, `Author UUID conflicts with the previous or reserved local identity`), g2.has(b2) && u2(`ID_CONFLICT`, t3, `Duplicate installation identity: ${b2}`), g2.add(b2), !y3 || v2.has(y3) ? u2(`NAMESPACE_CONFLICT`, t3, `Ambiguous runtime namespace: ${y3}`) : v2.set(y3, b2), p.test(e3.contentDigest || ``) || u2(`SNAPSHOT_REQUIRED`, t3, `Package requires a verified content digest`);
    for (let n3 of [...e3.preflightErrors || [], ...e3.errors || []]) u2(`PACK_REJECTED`, t3, String(n3));
    let x = n2.find((e4) => e4.id === b2), S = { id: b2, version: String(r3.version || `1.0.0`), contentDigest: e3.contentDigest, enabled: e3.enabled !== false, settings: x?.settings ?? i2?.mods?.[y3]?.values ?? {}, legacy: s2, sourceKey: t3, fallbackName: f3, runtimeNamespace: y3 };
    o2.push(S), c2.push({ ...S, declaredDepends: r3.depends || [], declaredOptionalDepends: r3.optionalDepends || [] });
  }
  for (let e3 of c2) {
    let t3 = (t4, n3) => {
      if (!Array.isArray(t4) || t4.some((e4) => typeof e4 != `string` || !e4.trim())) return u2(`DEPENDENCY_INVALID`, e3.sourceKey, `Dependencies must be non-empty identity strings`), [];
      let r3 = [];
      for (let i3 of new Set(t4.map((e4) => e4.trim()))) {
        let t5 = v2.get(i3);
        t5 ? r3.push(t5) : n3 && u2(`DEPENDENCY_MISSING`, e3.sourceKey, `Missing required runtime namespace: ${i3}`);
      }
      return r3;
    };
    e3.depends = t3(e3.declaredDepends, true), e3.optionalDepends = t3(e3.declaredOptionalDepends, false);
  }
  let y2 = n2.filter((e3) => !g2.has(e3.id)), b = o2.filter((e3) => e3.legacy && !f2.has(e3.id));
  for (let e3 of y2) {
    let t3 = e3.legacy && p.test(e3.contentDigest || ``) ? b.filter((t4) => t4.contentDigest === e3.contentDigest) : [], n3 = y2.filter((t4) => t4.legacy && t4.contentDigest === e3.contentDigest);
    t3.length === 1 && n3.length === 1 ? (l2.push({ id: e3.id, sourceKey: e3.sourceKey, proposedSourceKey: t3[0].sourceKey, contentDigest: e3.contentDigest }), u2(`RELOCATION_CONFIRMATION_REQUIRED`, e3.sourceKey, `An identical snapshot moved; confirm the source association`)) : u2(`PREVIOUS_SOURCE_MISSING`, e3.sourceKey, `Previous installation is missing; do not silently discard its configuration`);
  }
  return s({ mods: o2, installed: c2, overrides: [`patches`, `edits`].map((e3) => {
    let t3 = r2?.[e3];
    return p.test(t3 || ``) || u2(`OVERRIDE_SNAPSHOT_REQUIRED`, e3, `Local overrides require a captured digest`), { kind: e3, contentDigest: t3 };
  }), modSettings: i2, relocations: l2, missingPreviousMods: y2, blockers: a2, ready: a2.length === 0 });
}
async function _(e2) {
  let t2 = a(), r2 = await t2.pathExists(`gp-next\\settings.json`) ? await t2.readText(P) : null, i2 = await l();
  if (r2 !== e2.packs || i2.raw !== e2.mods || i2.path !== e2.modSettingsPath) throw Error(`Legacy settings changed after migration preview`);
}
async function v({ installStore: e2, previousMods: t2 = [], signal: o2 }) {
  t2 = structuredClone(t2);
  let d2 = a(), p2 = async () => {
    let e3 = await d2.pathExists(`gp-next\\settings.json`) ? await d2.readText(P) : null, t3 = e3 === null ? {} : f.default.parse(e3);
    if (!t3 || typeof t3 != `object` || Array.isArray(t3)) throw Error(`Invalid legacy pack settings`);
    let r2 = { version: 1, packOrder: [], disabledPacks: [], ...t3 };
    if (r2.version !== void 0 && r2.version !== 1 || !Array.isArray(r2.packOrder) || !Array.isArray(r2.disabledPacks) || [...r2.packOrder, ...r2.disabledPacks].some((e4) => typeof e4 != `string`)) throw Error(`Invalid legacy pack settings`);
    return { raw: e3, value: r2 };
  }, m2 = await p2(), h2 = await l();
  o2?.throwIfAborted();
  let _2 = await r(m2.value.packOrder, m2.value.disabledPacks, d2), v2 = /* @__PURE__ */ new Map();
  for (let e3 of _2) {
    o2?.throwIfAborted();
    let t3 = await d2.capture(e3);
    e3.contentDigest = t3.digest, v2.set(t3.digest, t3);
  }
  let y2 = {};
  for (let [e3, t3] of [[`patches`, j.SINGLE_PATCHES], [`edits`, j.GPN_EDITS]]) {
    let n2 = await d2.captureOptional(t3);
    y2[e3] = n2.digest, v2.set(n2.digest, n2);
  }
  let b = await g({ packs: _2, previousMods: t2, overrides: y2, modSettings: h2.data });
  if (!b.ready) throw Object.assign(Error(`Legacy migration requires resolution`), { blockers: b.blockers });
  let x = s(u({ revision: 0, mods: b.mods, overrides: b.overrides }, b.modSettings));
  await c({ configuration: x, installStore: { read: async (e3) => v2.get(e3) }, signal: o2 });
  for (let t3 of v2.values()) o2?.throwIfAborted(), await e2.install(t3, { signal: o2 });
  let S = await p2(), C = await l();
  if (o2?.throwIfAborted(), S.raw !== m2.raw || C.path !== h2.path || C.raw !== h2.raw) throw Error(`Legacy settings changed during migration`);
  return s({ configuration: x, installed: b.installed, sourceSettings: { packs: m2.raw, mods: h2.raw, modSettingsPath: h2.path } });
}
async function prepareLegacyRuntimeMigration({ patcher: e2, installStore: t2, signal: n2 }) {
  let r2 = e2.getAppliedSourceSnapshot();
  if (r2.sources.some((e3) => e3.kind === `mod` && e3.meta.js)) throw Object.assign(Error(`\u65E7\u7248 JS \u6A21\u7EC4\u4E0D\u652F\u6301\u8FC1\u79FB\uFF0C\u8BF7\u79FB\u9664\u540E\u6309\u65B0\u89C4\u8303\u91CD\u65B0\u5B89\u88C5`), { code: `LEGACY_SCRIPT_UNSUPPORTED` });
  let i2 = e2.captureLegacyEntityLedger(), a2 = () => {
    if (n2?.throwIfAborted(), e2.getAppliedSourceSnapshot() !== r2 || JSON.stringify(e2.captureLegacyEntityLedger()) !== JSON.stringify(i2)) throw Error(`Legacy runtime changed during migration`);
  };
  a2();
  let o2 = await v({ installStore: t2, signal: n2 });
  a2();
  let c2 = [], l2 = {}, f2 = new Map(r2.sources.filter((e3) => e3.kind === `mod`).map((e3) => [e3.dir, e3]));
  for (let e3 of r2.packs) if (e3.enabled === false) {
    let t3 = o2.configuration.mods.find((t4) => t4.sourceKey === e3.dir.replaceAll(`\\`, `/`));
    if (!t3) throw Error(`Disabled legacy package disappeared during migration: ` + e3.dir);
    if (t3.version !== String(e3.meta.version || `1.0.0`) || t3.runtimeNamespace !== String(e3.meta.uuid || e3.meta.name || e3.dir).trim()) throw Error(`Disabled package identity changed during migration: ` + e3.dir);
    c2.push({ ...e3, contentDigest: t3.contentDigest });
  } else {
    let t3 = f2.get(e3.dir);
    if (!t3) throw Error(`Applied legacy package is missing: ` + e3.dir);
    c2.push({ ...e3, meta: t3.meta, contentDigest: t3.contentDigest });
  }
  for (let e3 of r2.sources) {
    a2();
    let i3 = r2.getSnapshot(e3.dir);
    if (!i3 || i3.digest !== e3.contentDigest) throw Error(`Applied package snapshot is missing: ` + e3.dir);
    await t2.install(i3, { signal: n2 }), e3.kind !== `mod` && (l2[e3.kind] = i3.digest);
  }
  a2();
  let p2 = await g({ packs: c2, overrides: l2, modSettings: o2.configuration.modSettings });
  if (!p2.ready) throw Object.assign(Error(`Active legacy configuration requires resolution`), { blockers: p2.blockers });
  let m2 = u({ revision: 0, mods: p2.mods, overrides: p2.overrides }, p2.modSettings), h2 = r2.sources.filter((e3) => e3.kind === `mod`).map((e3) => {
    let t3 = p2.mods.find((t4) => t4.sourceKey === e3.dir.replaceAll(`\\`, `/`));
    if (!t3) throw Error(`Applied source has no migration identity`);
    return t3.id;
  });
  a2();
  let y2 = s({ desired: o2.configuration, active: { generation: 0, configuration: m2, packages: p2.installed.filter((e3) => e3.enabled), ordered: h2, entityLedger: i2, backupId: null, entityLedgerProof: `legacy-live-data-enums-v1` }, sourceSettings: o2.sourceSettings }), b = false, x = false;
  return Object.freeze({ preview: y2, assertCurrent: a2, async commit(n3) {
    if (b || x) throw Error(`Migration is already committing or committed`);
    b = true;
    try {
      return await e2.commitLegacyMigration(r2, async () => {
        a2();
        let e3 = n(y2);
        return await n3.initialize(e3, async () => {
          let e4 = [y2.active.configuration, y2.desired], n4 = new Set(e4.flatMap((e5) => [...e5.mods, ...e5.overrides].map((e6) => e6.contentDigest)));
          for (let e5 of n4) {
            let n5 = await t2.read(e5);
            if (!n5 || n5.digest !== e5) throw Error(`Installed migration snapshot is missing: ` + e5);
            a2();
          }
          await _(y2.sourceSettings), a2();
        }), x = true, e3;
      });
    } finally {
      b = false;
    }
  } });
}
export {
  prepareLegacyRuntimeMigration
};
