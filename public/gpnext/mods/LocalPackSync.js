import { r as e } from "../vendor/ModuleHelpers.js";
import { f as t } from "../platform/CloudJson.js";
import { t as n } from "../core/Logger.js";
import { r } from "./ModOperationPlan.js";
import { a as i } from "./ConfigurationModSettings.js";
import { a, n as o } from "../core/SettingsStore.js";
import { n as s } from "./PackSnapshot.js";
import { a as c, c as l, h as u, i as d, loadSettings } from "./FileLoader.js";
import { i as p, n as m } from "./ModPackPreflight.js";
import { t as h } from "./ModRequirements.js";
import { n as g } from "./JsModdingSelection.js";
var _ = e(u(), 1);
async function v({ snapshot: e2, configurationState: t2, installStore: n2, canEdit: a2, hasFeature: o2, sourceKey: c2, sourceFingerprint: u2, fallbackName: f2 = `pack-${e2.digest.slice(0, 12)}`, enabled: g2 = false }) {
  let v2 = t2.getState(), y2 = () => {
    if (!a2() || v2.journal || v2.recovery?.required || t2.getState() !== v2) throw Error(`Mod configuration changed; prepare the installation again`);
  };
  y2();
  let b2 = await s(e2.listPaths().map((t3) => [t3, e2.readBytes(t3)]));
  if (b2.digest !== e2.digest) throw Error(`Import bytes do not match their digest`);
  let x = _.default.parse(b2.readText(`pack.json`) || `{}`);
  if (!x || typeof x != `object` || Array.isArray(x)) throw Error(`pack.json must be an object`);
  if (x.uuid !== void 0 && (typeof x.uuid != `string` || x.uuid !== x.uuid.trim() || x.uuid.startsWith(`legacy:`))) throw Error(`Invalid pack.json uuid`);
  let S = String(x.name || x.uuid || f2), C = !x.uuid, w = C && v2.desired.mods.find((e3) => e3.legacy && (c2 && e3.sourceKey === c2 || x.name && e3.runtimeNamespace === S || e3.contentDigest === b2.digest)), T = C ? new Uint8Array(await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(x.name || c2 || b2.digest))) : null, E = x.uuid || w?.id || `legacy:` + [...T].map((e3) => e3.toString(16).padStart(2, `0`)).join(``), D = v2.desired.mods.find((e3) => e3.id === E);
  C && D && !x.name && (S = D.fallbackName || S);
  let O = { ...D, id: E, version: String(x.version || `1.0.0`), contentDigest: b2.digest, fallbackName: S, runtimeNamespace: x.uuid || S, legacy: C, managed: true, enabled: D?.enabled ?? g2, ...c2 ? { sourceKey: c2, sourceDigest: b2.digest, ...u2 ? { sourceFingerprint: u2 } : {} } : {} }, k = D?.contentDigest === b2.digest && D.enabled === O.enabled && D.sourceKey === O.sourceKey && D.sourceDigest === O.sourceDigest && D.sourceFingerprint === O.sourceFingerprint, A = d(/* @__PURE__ */ new Map([[`incoming`, b2]])), j = await A.describeInstalled(`incoming`, O);
  Object.assign(O, { containsScripts: !!j.meta.js, depends: [...j.meta.depends], requiredGpNextFeatures: [...j.meta.requiredGpNextFeatures] });
  let M = D ? v2.desired.mods.map((e3) => e3.id === O.id ? O : e3) : [...v2.desired.mods, O], N = (await h({ ...v2.desired, mods: M }, { read: (e3) => e3 === b2.digest ? Promise.resolve(b2) : n2.read(e3) }, { hasFeature: o2 })).get(O.id).requirements;
  try {
    let { warnings: e3 } = p(j, { hasFeature: () => true });
    if (j.meta.js) {
      let e4 = await m(j, { fileLoader: A, hasFeature: () => true });
      if (e4.errors.length) throw Error(e4.errors.join(`; `));
    }
    let a3 = await l(`incoming`, A);
    if (a3.errors.length) throw Error(a3.errors.join(`; `));
    let o3 = D ? v2.desired.mods.map((e4) => e4.id === O.id ? O : e4) : [...v2.desired.mods, O], s2 = r(i({ ...v2.desired, revision: v2.desired.revision + 1, mods: o3 }, v2.desired.modSettings));
    y2();
    let c3 = !!D && D.contentDigest !== b2.digest && !!j.meta.js, u3 = false, d2 = false;
    return Object.freeze({ preview: r({ id: O.id, name: j.meta.name, version: j.meta.version, previousVersion: D?.version ?? null, update: !!D, enabled: O.enabled, containsScripts: !!j.meta.js, requirements: N, unchanged: k, requiresTrust: c3, contentDigest: b2.digest, warnings: [...e3, ...a3.warnings] }), async commit({ trustedContentDigest: e4 } = {}) {
      if (u3 || d2) throw Error(`Installation is already committing or committed`);
      if (c3 && e4 !== b2.digest) throw Error(`Confirm trust in the updated script package before installation`);
      y2(), u3 = true;
      try {
        if (k) return d2 = true, v2;
        await n2.install(b2), y2();
        let e5 = await t2.saveDesired(s2, v2.desired.revision);
        return d2 = true, e5;
      } finally {
        u3 = false;
      }
    } });
  } catch (e3) {
    throw e3.requirements = N, e3;
  }
}
var y = new n(`local-packs`);
function createLocalPackSync({ configurationState: e2, installStore: n2, canEdit: r2 = () => true, createReader: i2 = d, readSettings: s2 = loadSettings, hasFeature: l2 = o, jsEnabled: u2 = a, readInventory: p2 = () => globalThis.window?.__TAURI_INTERNALS__ ? t(`gp_next_local_package_inventory`) : null }) {
  let m2 = null;
  async function h2() {
    let t2 = e2.getState();
    if (!r2() || t2.journal || t2.recovery?.required) return t2;
    let a2 = await s2(), o2 = i2(), d2 = await p2(), f2 = new Map((d2 || []).map((e3) => [e3.path, e3.fingerprint]));
    if (d2) {
      let e3 = o2.listDir;
      o2.listDir = async (n3) => {
        let r3 = await e3(n3);
        return n3.replaceAll(`\\`, `/`) === `gp-next/packs` ? r3.filter((e4) => {
          let n4 = `gp-next/packs/${e4.name}`, r4 = f2.get(n4);
          return !r4 || !t2.desired.mods.some((e5) => e5.sourceKey === n4 && e5.sourceFingerprint === r4);
        }) : r3;
      };
    }
    let m3 = o2.loadZip;
    o2.loadZip = async (e3) => {
      try {
        return await m3(e3);
      } catch (t3) {
        return y.warn(`${e3}: ${String(t3.message || t3)}`), null;
      }
    };
    let h3 = await c(a2.packOrder, a2.disabledPacks, o2);
    for (let t3 of h3) {
      let i3 = t3.dir.replaceAll(`\\`, `/`);
      try {
        let a3 = await o2.capture(t3);
        if (e2.getState().desired.ignoredLocalSources?.[i3] === a3.digest) continue;
        let s3 = e2.getState().desired.mods.find((e3) => e3.sourceKey === i3 || t3.meta.uuid && e3.id === t3.meta.uuid);
        if (s3?.sourceKey === i3 && s3.sourceDigest === a3.digest) {
          let t4 = f2.get(i3);
          if (!t4 || s3.sourceFingerprint === t4) continue;
          if (s3.contentDigest !== a3.digest) {
            let n3 = e2.getState();
            await e2.saveDesired({ ...n3.desired, revision: n3.desired.revision + 1, mods: n3.desired.mods.map((e3) => e3.id === s3.id ? { ...e3, sourceFingerprint: t4 } : e3) }, n3.desired.revision);
            continue;
          }
        }
        let c2 = await v({ snapshot: a3, configurationState: e2, installStore: n2, canEdit: r2, hasFeature: l2, sourceKey: i3, sourceFingerprint: f2.get(i3), fallbackName: t3.meta.name, enabled: t3.enabled !== false });
        await c2.commit({ trustedContentDigest: c2.preview.contentDigest });
      } catch (e3) {
        y.warn(`${i3}: ${String(e3.message || e3)}`);
      }
    }
    for (let [t3, i3] of [[`patches`, `gp-next/patches`], [`edits`, `gp-next/__gpn_edits`]]) {
      if (!f2.has(i3)) continue;
      let a3 = e2.getState(), s3 = f2.get(i3), c2 = a3.desired.overrides.find((e3) => e3.kind === t3);
      if (!(!c2 || s3 && c2.sourceFingerprint === s3)) try {
        let c3 = await o2.captureOptional(i3);
        if (!r2() || e2.getState() !== a3) continue;
        await n2.install(c3), await e2.saveDesired({ ...a3.desired, revision: a3.desired.revision + 1, overrides: a3.desired.overrides.map((e3) => e3.kind === t3 ? { ...e3, contentDigest: c3.digest, sourceFingerprint: s3 } : e3) }, a3.desired.revision);
      } catch (e3) {
        y.warn(`${i3}: retaining the previous override snapshot`, e3);
      }
    }
    return await g(e2, n2, u2()), e2.getState();
  }
  return () => (m2 ||= h2().catch((t2) => (y.warn(`Local source synchronization failed; retaining installed selection`, t2), e2.getState())).finally(() => {
    m2 = null;
  }), m2);
}
export {
  createLocalPackSync,
  v as t
};
