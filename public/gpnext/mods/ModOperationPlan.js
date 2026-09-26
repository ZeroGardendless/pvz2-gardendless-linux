function e(e2) {
  return String(e2?.meta?.uuid || e2?.meta?.name || e2?.dir || ``).trim();
}
function t(e2) {
  return Array.isArray(e2) ? [...new Set(e2.map((e3) => String(e3 || ``).trim()).filter(Boolean))] : [];
}
function n(n2 = []) {
  let r2 = Array.isArray(n2) ? n2.filter((e2) => e2 && e2.enabled !== false) : [], i2 = new Set(r2.map(e).filter(Boolean)), a2 = /* @__PURE__ */ new Map(), o2 = /* @__PURE__ */ new Map();
  for (let t2 of r2) {
    let n3 = e(t2);
    if (n3) {
      if (a2.has(n3)) {
        o2.set(n3, { pack: t2, errors: [`Duplicate mod namespace: ${n3}`], warnings: [] });
        continue;
      }
      a2.set(n3, t2), t2.preflightErrors?.length && o2.set(n3, { pack: t2, errors: [...t2.preflightErrors], warnings: [] });
    }
  }
  let s2 = /* @__PURE__ */ new Map();
  for (let [e2, n3] of a2) {
    if (o2.has(e2)) continue;
    let r3 = t(n3?.meta?.depends), c3 = t(n3?.meta?.optionalDepends), l3 = r3.filter((e3) => !i2.has(e3));
    if (l3.length > 0) {
      o2.set(e2, { pack: n3, errors: [`Missing required dependencies: ${l3.join(`, `)}`], warnings: [] });
      continue;
    }
    s2.set(e2, { required: r3.filter((e3) => a2.has(e3)), optional: c3.filter((e3) => a2.has(e3)) });
  }
  let c2 = () => {
    let e2 = true;
    for (; e2; ) {
      e2 = false;
      for (let [t2, n3] of s2) {
        if (o2.has(t2)) continue;
        let r3 = n3.required.filter((e3) => o2.has(e3));
        r3.length !== 0 && (o2.set(t2, { pack: a2.get(t2), errors: [`Dependencies failed to load: ${r3.join(`, `)}`], warnings: [] }), e2 = true);
      }
    }
  };
  c2();
  let l2 = /* @__PURE__ */ new Set(), u2 = /* @__PURE__ */ new Set(), d2 = /* @__PURE__ */ new Set(), f2 = (e2, t2 = []) => {
    if (o2.has(e2) || u2.has(e2)) return;
    if (l2.has(e2)) {
      let n4 = t2.indexOf(e2);
      for (let e3 of t2.slice(Math.max(0, n4))) d2.add(e3);
      d2.add(e2);
      return;
    }
    l2.add(e2);
    let n3 = [...t2, e2], r3 = s2.get(e2) || { required: [], optional: [] };
    for (let e3 of r3.required) f2(e3, n3);
    l2.delete(e2), u2.add(e2);
  };
  for (let e2 of a2.keys()) f2(e2);
  for (let e2 of d2) o2.set(e2, { pack: a2.get(e2), errors: [`Circular mod dependency involving: ${[...d2].join(`, `)}`], warnings: [] });
  c2();
  let p = /* @__PURE__ */ new Map();
  for (let [e2, t2] of s2) p.set(e2, [...t2.required]);
  let m = (e2, t2, n3 = /* @__PURE__ */ new Set()) => e2 === t2 ? true : n3.has(e2) ? false : (n3.add(e2), (p.get(e2) || []).some((e3) => m(e3, t2, n3)));
  for (let [e2, t2] of s2) {
    if (o2.has(e2)) continue;
    let n3 = p.get(e2);
    for (let r3 of t2.optional) o2.has(r3) || n3.includes(r3) || m(r3, e2) || n3.push(r3);
  }
  let h = [], g = /* @__PURE__ */ new Set(), _ = /* @__PURE__ */ new Set(), v = (e2) => {
    if (!(o2.has(e2) || _.has(e2) || g.has(e2))) {
      g.add(e2);
      for (let t2 of p.get(e2) || []) v(t2);
      g.delete(e2), _.add(e2), h.push(a2.get(e2));
    }
  };
  for (let e2 of a2.keys()) v(e2);
  let y = /* @__PURE__ */ new Map();
  for (let e2 of a2.keys()) {
    let t2 = /* @__PURE__ */ new Set(), n3 = (e3) => {
      for (let r3 of s2.get(e3)?.required || []) t2.has(r3) || (t2.add(r3), n3(r3));
    };
    n3(e2), y.set(e2, [...t2]);
  }
  return { ordered: h, blocked: o2, required: y };
}
function r(e2 = []) {
  let t2 = n(e2);
  return { required: t2.required, ordered: t2.ordered.filter((e3) => e3?.meta?.js?.entry), blocked: new Map([...t2.blocked].filter(([, e3]) => e3.pack?.meta?.js?.entry)) };
}
function i(e2) {
  let t2 = structuredClone(e2), n2 = (e3) => !e3 || typeof e3 != `object` || Object.isFrozen(e3) ? e3 : (Object.values(e3).forEach(n2), Object.freeze(e3));
  return n2(t2);
}
function a(e2) {
  return Array.isArray(e2) ? `[` + e2.map(a).join(`,`) + `]` : e2 && typeof e2 == `object` ? `{` + Object.keys(e2).sort().map((t2) => JSON.stringify(t2) + `:` + a(e2[t2])).join(`,`) + `}` : JSON.stringify(e2);
}
function o(e2) {
  if (!Number.isSafeInteger(e2?.revision) || e2.revision < 0 || !Array.isArray(e2.mods)) throw Error(`Invalid configuration revision or mods`);
  let t2 = /* @__PURE__ */ new Set();
  for (let n2 of e2.mods) {
    if (typeof n2.id != `string` || !n2.id.trim() || t2.has(n2.id)) throw Error(`Configuration requires unique stable mod identities`);
    if (typeof n2.version != `string` || !/^[a-f0-9]{64}$/i.test(n2.contentDigest)) throw Error(`Missing captured content identity: ${n2.id}`);
    if (typeof n2.enabled != `boolean`) throw Error(`Missing enabled state: ${n2.id}`);
    t2.add(n2.id);
  }
  return e2;
}
function s({ desired: e2, active: t2, installed: n2, buildId: r2, evidence: i2 }) {
  return a({ desired: e2, active: t2, installed: n2, buildId: r2, evidence: i2 });
}
function c(e2, t2, n2 = ``) {
  return a(e2) === a(t2) ? [] : e2 && t2 && typeof e2 == `object` && typeof t2 == `object` && !Array.isArray(e2) && !Array.isArray(t2) ? [.../* @__PURE__ */ new Set([...Object.keys(e2), ...Object.keys(t2)])].sort().flatMap((r2) => c(e2[r2], t2[r2], `${n2}/${r2.replace(/~/g, `~0`).replace(/\//g, `~1`)}`)) : [n2 || `/`];
}
var l = [`immediate`, `scene-boundary`, `restart-required`, `blocked`], u = [`scopeCleanup`, `dataRestore`, `resourceRelease`, `consumerRebuild`];
function d(e2) {
  let { desired: t2, active: r2, installed: d2 = [], buildId: f2, evidence: p = {} } = e2;
  if (o(t2), o(r2.configuration), !Number.isSafeInteger(r2.generation) || r2.generation < 0) throw Error(`Invalid active generation`);
  let m = [], h = [];
  for (let e3 of t2.mods.filter((e4) => e4.enabled)) {
    let t3 = d2.filter((t4) => t4.id === e3.id && t4.version === e3.version && t4.contentDigest === e3.contentDigest);
    if (t3.length !== 1) {
      m.push({ id: e3.id, reason: `Installed snapshot missing or ambiguous` });
      continue;
    }
    let n2 = t3[0];
    h.push(n2);
    for (let t4 of n2.errors || []) m.push({ id: e3.id, reason: t4 });
  }
  let g = (e3) => e3.map((e4) => ({ meta: { uuid: e4.id, depends: e4.depends, optionalDepends: e4.optionalDepends }, preflightErrors: e4.errors })), _ = n(g(h.map((e3) => ({ ...e3, depends: [.../* @__PURE__ */ new Set([...e3.depends || [], ...(p.consumers?.edges || []).filter((t3) => ![`data-contribution`, `data-observation`, `event-observation`, `hook-sharing`].includes(t3.kind) && t3.consumer === e3.id && h.some((e4) => e4.id === t3.provider)).map((e4) => e4.provider)])] }))));
  for (let [e3, t3] of _.blocked) for (let n2 of t3.errors) m.push({ id: e3, reason: n2 });
  let v = _.ordered.map((e3) => e3.meta.uuid), y = r2.configuration.mods.filter((e3) => e3.enabled), b = t2.mods.filter((e3) => e3.enabled), x = new Map(y.map((e3) => [e3.id, e3])), S = new Map(b.map((e3) => [e3.id, e3])), C = [], w = (e3, t3) => {
    C.some((n2) => n2.id === e3 && n2.kind === t3) || C.push({ id: e3, kind: t3 });
  };
  for (let e3 of y) S.has(e3.id) || w(e3.id, `disable`);
  for (let e3 of b) {
    let t3 = x.get(e3.id);
    t3 ? ((t3.version !== e3.version || t3.contentDigest !== e3.contentDigest) && w(e3.id, `update`), a(t3.settings) !== a(e3.settings) && (w(e3.id, `settings`), C.find((t4) => t4.id === e3.id && t4.kind === `settings`).fields = c(t3.settings, e3.settings))) : w(e3.id, `enable`);
  }
  let T = y.map((e3) => e3.id).filter((e3) => S.has(e3)), E = b.map((e3) => e3.id);
  for (let e3 = 0; e3 < T.length; e3++) for (let t3 = e3 + 1; t3 < T.length; t3++) E.indexOf(T[e3]) > E.indexOf(T[t3]) && (w(T[e3], `order`), w(T[t3], `order`));
  a(r2.configuration.overrides) !== a(t2.overrides) && w(`*`, `overrides`);
  let { revision: D, ...O } = r2.configuration, { revision: k, ...A } = t2;
  !C.length && a(O) !== a(A) && w(`*`, `configuration`);
  let j = p.mode === `live-settings` && C.length > 0 && C.every((e3) => e3.kind === `settings`), M = new Set(C.filter((e3) => e3.id !== `*`).map((e3) => e3.id));
  if (C.length && p.consumers?.lifetime === `fresh-process`) for (let e3 of [...y, ...b]) M.add(e3.id);
  if (C.some((e3) => e3.id === `*`)) for (let e3 of [...y, ...b]) M.add(e3.id);
  let N = [...p.consumers?.edges || []];
  for (let e3 of [...r2.packages || [], ...h]) for (let t3 of [...e3.depends || [], ...e3.optionalDepends || []]) N.push({ provider: t3, consumer: e3.id });
  let P = !j;
  for (; P; ) {
    P = false;
    for (let { provider: e3, consumer: t3 } of N) M.has(e3) && !M.has(t3) && (x.has(t3) || S.has(t3)) && (M.add(t3), P = true);
  }
  for (let e3 of M) C.some((t3) => t3.id === e3) || w(e3, `rebuild`);
  C.length && (!f2 || p.buildId !== f2 || !Number.isSafeInteger(p.revision) || p.revision < 0 || !j && !p.consumers?.complete) && m.push({ id: `*`, reason: `Missing build-bound capability evidence or complete consumer graph` });
  let F = `immediate`, I = C.map((e3) => {
    let t3 = (p.operations || []).filter((t4) => t4.id === e3.id && t4.kind === e3.kind), n2 = t3.length === 1 ? t3[0] : null, r3 = n2?.level, i2 = n2?.verified === true && typeof n2.proof == `string` && n2.proof.trim(), o2 = u.every((e4) => n2?.paths?.[e4] === true);
    return (!i2 || e3.kind === `settings` && a([...n2?.fields || []].sort()) !== a([...e3.fields].sort()) || !l.includes(r3) || r3 === `blocked` || r3 === `immediate` && (j ? n2?.paths?.settingsNotification !== true : !o2) || r3 === `scene-boundary` && (!o2 || n2.paths.sceneBoundary !== true) || r3 === `restart-required` && n2.paths?.coldStart !== true) && (r3 = `blocked`, m.push({ id: e3.id, reason: `Unverified operation: ${e3.kind}`, detail: n2?.reason || null })), l.indexOf(r3) > l.indexOf(F) && (F = r3), { ...e3, level: r3, proof: n2?.proof || null };
  });
  m.length && (F = `blocked`);
  let L = r2.packages || [];
  for (let e3 of y) L.some((t3) => t3.id === e3.id && t3.version === e3.version && t3.contentDigest === e3.contentDigest) || m.push({ id: e3.id, reason: `Active package snapshot metadata is missing` });
  let R = n(g(L.map((e3) => ({ ...e3, depends: [.../* @__PURE__ */ new Set([...e3.depends || [], ...(p.consumers?.edges || []).filter((t3) => ![`data-contribution`, `data-observation`, `event-observation`, `hook-sharing`].includes(t3.kind) && t3.consumer === e3.id && x.has(t3.provider)).map((e4) => e4.provider)])] }))));
  for (let [e3, t3] of R.blocked) for (let n2 of t3.errors) m.push({ id: e3, reason: `Active consumers: ${n2}` });
  return m.length && (F = `blocked`), i({ formatVersion: 1, buildId: f2, evidenceRevision: p.revision ?? null, baseRevision: r2.configuration.revision, desiredRevision: t2.revision, generation: r2.generation, binding: s(e2), base: r2, target: { configuration: t2, packages: h, ordered: v }, operations: I, affected: [...M], ordered: v, stopOrder: R.ordered.map((e3) => e3.meta.uuid).reverse().filter((e3) => M.has(e3)), level: F, blockers: m, noChanges: C.length === 0 });
}
function f(e2, t2) {
  if (e2.binding !== s(t2)) throw Error(`Operation plan is stale; preflight again`);
}
export {
  r as a,
  o as i,
  d as n,
  n as o,
  i as r,
  f as t
};
