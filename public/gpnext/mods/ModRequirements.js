import { o as e } from "./ModOperationPlan.js";
import { n as t } from "../core/SettingsStore.js";
import { i as n } from "./FileLoader.js";
async function r(r2, i, { hasFeature: a = t, runtime: o = [] } = {}) {
  let s = await Promise.all(r2.mods.map(async (e2) => {
    try {
      let t2 = await i.read(e2.contentDigest);
      if (t2?.digest !== e2.contentDigest) throw Error(`Installed content differs`);
      return await n(/* @__PURE__ */ new Map([[`details`, t2]])).describeInstalled(`details`, e2);
    } catch {
      return { enabled: e2.enabled, meta: { uuid: e2.id, name: e2.fallbackName || e2.id, depends: [], optionalDepends: [], requiredGpNextFeatures: [] }, preflightErrors: [`Installed content is unavailable`] };
    }
  })), c = new Map(s.map((e2, t2) => [r2.mods[t2].id, e2])), l = new Set(o.filter((e2) => [`failed`, `blocked`].includes(e2.state)).map((e2) => e2.namespace));
  for (let e2 of s) (l.has(e2.meta.uuid) || e2.meta.js && a(`experimental.jsModding`) !== true || (e2.meta.requiredGpNextFeatures || []).some((e3) => a(e3) !== true)) && (e2.preflightErrors = [`Requirements are unavailable`]);
  let u = e(s);
  return new Map(s.map((e2, t2) => {
    let n2 = (e3, t3) => {
      let n3 = c.get(e3);
      return { kind: `mod`, id: e3, name: n3?.meta.name || e3, optional: t3, status: n3 ? n3.enabled === false ? `disabled` : u.blocked.has(e3) ? `blocked` : `ready` : `missing` };
    }, i2 = [...e2.meta.requiredGpNextFeatures || []];
    e2.meta.js && !i2.some((e3) => [`experimental.jsModding`, `runtime.jsModding`].includes(e3)) && i2.unshift(`experimental.jsModding`);
    let o2 = [...i2.map((e3) => ({ kind: `feature`, id: e3, optional: false, status: a(e3) == null ? `unknown` : a(e3) ? `ready` : `disabled` })), ...(e2.meta.depends || []).map((e3) => n2(e3, false)), ...(e2.meta.optionalDepends || []).map((e3) => n2(e3, true))];
    return [r2.mods[t2].id, { requirements: o2, pack: e2, blocked: u.blocked.has(e2.meta.uuid) }];
  }));
}
export {
  r as t
};
