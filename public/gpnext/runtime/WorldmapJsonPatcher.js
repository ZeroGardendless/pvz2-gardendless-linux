import { r as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
import { O as n, w as r } from "../mods/FileLoader.js";
import { t as i } from "../mods/ModApi.js";
var a = e(n(), 1), o = new t(`worldmap-json`), s = [`jsons/worldmap/gpn-worldmap.json5`, `jsons/worldmap/gpn-worldmap.json`], c = 1;
function l(e2) {
  let t2 = e2?.advanced?.worldMap;
  if (typeof t2?.onWorldLoaded != `function`) throw Error(`World-map runtime API is unavailable`);
  return t2;
}
function u(e2) {
  return String(e2 ?? ``).trim().toLowerCase();
}
function d(e2) {
  if (e2 == null) return e2;
  try {
    return structuredClone(e2);
  } catch {
    return JSON.parse(JSON.stringify(e2));
  }
}
function f(e2) {
  return Array.isArray(e2) ? e2 : e2 == null ? [] : [e2];
}
async function p(e2) {
  for (let t2 of s) {
    let n2 = await r(e2.dir, t2);
    if (n2) try {
      let e3 = a.default.parse(n2);
      if (Number(e3?.apiVersion) !== c) throw Error(`Unsupported apiVersion '${e3?.apiVersion ?? null}', expected ${c}`);
      return { path: t2, data: e3 };
    } catch (e3) {
      throw Error(`Failed to parse ${t2}: ${e3}`);
    }
  }
  return null;
}
function m(e2) {
  return typeof e2 == `string` ? e2.includes(`:`) ? { id: e2 } : { levelId: e2 } : e2;
}
function h(e2) {
  return String(e2 ?? ``).trim().toLowerCase();
}
function g(e2 = {}) {
  return m(e2?.match || e2?.selector || e2?.id || e2?.customId);
}
function _(e2) {
  return e2?.map && typeof e2.map == `object` ? e2.map : null;
}
function v(e2, t2 = [], n2 = /* @__PURE__ */ new Set()) {
  let r2 = [];
  e2 && r2.push(e2), r2.push(...f(t2));
  let i2 = [], a2 = /* @__PURE__ */ new Set();
  for (let e3 of r2) {
    let t3 = E(S(e3, n2));
    a2.has(t3) || (a2.add(t3), i2.push(e3));
  }
  return i2;
}
function y(e2 = {}) {
  let t2 = Array.isArray(e2?.mainline) ? e2.mainline.map((e3) => d(e3)) : [];
  if (!t2.length) return [];
  let n2 = Array.isArray(e2?.branches) ? e2.branches.map((e3) => d(e3)) : [], r2 = [...t2, ...n2], i2 = new Set(r2.map((e3) => String(e3?.id || ``)).filter(Boolean));
  for (let e3 = 0; e3 < t2.length; e3 += 1) {
    let n3 = t2[e3];
    !n3 || typeof n3 != `object` || (n3.children = v((e3 + 1 < t2.length ? String(t2[e3 + 1]?.id || ``) : ``) || null, n3.children, i2), delete n3.mainChild);
  }
  for (let e3 of n2) !e3 || typeof e3 != `object` || delete e3.mainChild;
  return r2;
}
function b(e2) {
  return y(_(e2));
}
function x(e2) {
  return _(e2)?.mode === `replace`;
}
function S(e2, t2 = /* @__PURE__ */ new Set()) {
  return typeof e2 == `string` && t2.has(e2) ? { id: e2 } : m(e2);
}
function C(e2, t2) {
  if (!e2 || !t2) return false;
  let n2 = String(e2?.type || ``).trim();
  if (n2 === `level`) {
    let n3 = f(e2?.levels).map((e3) => String(e3 || ``)).filter(Boolean);
    if (!n3.length) return false;
    let r2 = new Set([...f(t2?.levelIds), ...f(t2?.endlessLevelIds)].map((e3) => String(e3 || ``)).filter(Boolean));
    return n3.every((e3) => r2.has(e3));
  }
  if (n2 === `epicPortal`) {
    let n3 = f(e2?.portalLevels).map((e3) => String(e3 || ``)).filter(Boolean);
    if (!n3.length) return false;
    let r2 = new Set(f(t2?.epicLevelIds).map((e3) => String(e3 || ``)).filter(Boolean));
    return n3.every((e3) => r2.has(e3));
  }
  return n2 === `plant` && e2?.plantReward != null ? String(t2?.plantDisplayed || ``) === String(e2.plantReward) : n2 === `upgrade` && e2?.upgradeReward != null ? String(t2?.upgradeDisplayed || ``) === String(e2.upgradeReward) : false;
}
function w(e2, t2, n2) {
  if (!e2 || !t2 || typeof t2 != `object`) return false;
  let r2 = String(n2 || ``).trim();
  if (r2 !== `giftBox` && r2 !== `epicPortal` || !(r2 === `giftBox` ? e2?.raw?._giftbox : e2?.raw?._epicPortalDB) || t2.id != null && String(e2?.id || ``) !== String(t2.id) || t2.customId != null && String(e2?.customId || ``) !== String(t2.customId) || t2.index != null && Number(e2?.index) !== Number(t2.index) || t2.type != null && String(t2.type) !== r2 || t2.levelNodeName != null && String(e2?.levelNodeName || ``) !== String(t2.levelNodeName) || t2.levelId != null && !new Set(f(e2?.levelIds).map((e3) => String(e3 || ``))).has(String(t2.levelId))) return false;
  if (t2.levelIds != null) {
    let n3 = new Set(f(e2?.levelIds).map((e3) => String(e3 || ``)));
    for (let e3 of f(t2.levelIds).map((e4) => String(e4 || ``))) if (!n3.has(e3)) return false;
  }
  if (t2.portalLevelId != null && !new Set(f(e2?.epicLevelIds).map((e3) => String(e3 || ``))).has(String(t2.portalLevelId))) return false;
  if (t2.portalLevelIds != null) {
    let n3 = new Set(f(e2?.epicLevelIds).map((e3) => String(e3 || ``)));
    for (let e3 of f(t2.portalLevelIds).map((e4) => String(e4 || ``))) if (!n3.has(e3)) return false;
  }
  return true;
}
function T(e2, t2, n2, r2) {
  let i2 = e2.getIslands({ runtimeMap: t2 }), a2 = i2.find((e3) => w(e3, n2, r2));
  if (a2?.raw) return a2;
  let o2 = String(r2 || ``).trim(), s2 = n2 && typeof n2 == `object` ? Object.keys(n2).filter((e3) => n2[e3] != null) : [];
  return s2.length === 1 && s2[0] === `type` && String(n2.type) === o2 ? i2.find((e3) => e3?.raw ? o2 === `giftBox` ? e3.type === `giftBox` || !!e3.raw._giftbox : e3.type === `epicPortal` || !!e3.raw._epicPortalDB : false) ?? null : null;
}
function E(e2) {
  if (typeof e2 == `string`) return e2;
  if (e2 && typeof e2 == `object`) {
    if (e2.id != null) return String(e2.id);
    if (e2.levelId != null) return `level:${String(e2.levelId)}`;
  }
  return String(e2 ?? ``);
}
function D(e2 = {}, t2 = /* @__PURE__ */ new Set()) {
  return f(e2?.children).map((e3) => S(e3, t2));
}
function O(e2 = []) {
  let t2 = new Set(e2.map((e3) => String(e3?.id || ``)).filter(Boolean)), n2 = /* @__PURE__ */ new Set();
  for (let r2 of e2) for (let e3 of f(r2?.children)) typeof e3 == `string` && t2.has(e3) && n2.add(e3);
  return e2.filter((e3) => {
    let t3 = String(e3?.id || ``);
    return t3 && !n2.has(t3);
  });
}
function k(e2) {
  let t2 = b(e2);
  if (!t2.length) return {};
  let n2 = [], r2 = [];
  for (let e3 of t2) e3?.type === `level` && Array.isArray(e3?.levels) && n2.push(...e3.levels), e3?.type === `plant` && typeof e3?.plantReward == `string` && r2.push(e3.plantReward);
  return { levels: n2, plants: r2, startingLevels: O(t2).filter((e3) => e3?.type === `level` && Array.isArray(e3?.levels) && e3.levels[0]).map((e3) => e3.levels[0]) };
}
function A(e2) {
  let t2 = e2?.endless;
  if (t2 == null) return false;
  if (Array.isArray(t2)) return t2.length > 0;
  if (t2 && typeof t2 == `object`) {
    if (t2.keepOriginal === true) return false;
    if (Array.isArray(t2.nodes)) return t2.nodes.length > 0;
  }
  return true;
}
function j(e2) {
  return /dangerroom/i.test(String(e2 ?? ``));
}
function M(e2) {
  return f(e2?.levelIds).some(j);
}
function N(e2 = []) {
  let t2 = e2.filter((e3) => e3 && !M(e3));
  if (!t2.length) return [];
  let n2 = new Map(t2.map((e3) => [String(e3?.id || ``), e3])), r2 = /* @__PURE__ */ new Set();
  for (let e3 of t2) for (let t3 of f(e3?.nextIds).map((e4) => String(e4 || ``)).filter(Boolean)) n2.has(t3) && r2.add(t3);
  let i2 = t2.filter((e3) => {
    let t3 = String(e3?.id || ``);
    return t3 && !r2.has(t3);
  })[0] || t2[0];
  if (!i2) return t2;
  let a2 = [], o2 = /* @__PURE__ */ new Set(), s2 = i2;
  for (; s2; ) {
    let e3 = String(s2?.id || ``);
    if (!e3 || o2.has(e3)) break;
    o2.add(e3), a2.push(s2);
    let t3 = f(s2?.nextIds).map((e4) => String(e4 || ``)).find((e4) => n2.has(e4) && !o2.has(e4));
    s2 = t3 ? n2.get(t3) : null;
  }
  return a2.length ? a2 : t2;
}
function P(e2 = [], t2 = []) {
  let n2 = /* @__PURE__ */ new Map();
  return e2.forEach((e3, r2) => {
    let i2 = String(e3?.id || ``);
    if (!i2) return;
    let a2 = t2[r2] || null;
    a2 && n2.set(i2, a2);
  }), n2;
}
function F(e2, t2) {
  if (!t2) return false;
  let n2 = String(e2?.type || ``).trim();
  if (t2?.type !== n2) return false;
  if (n2 !== `level`) return true;
  let r2 = h(e2?.appearance);
  return !r2 || h(t2?.appearance) === r2;
}
function I(e2, t2, n2 = []) {
  let r2 = String(e2?.type || ``).trim(), i2 = h(e2?.appearance), a2 = n2.filter((e3) => e3?.type === r2), o2 = a2.filter((t3) => C(e2, t3)), s2 = a2.filter((t3) => F(e2, t3)), c2 = (e3) => e3 ? n2.some((t3) => f(t3?.nextIds).includes(e3.id)) : false, l2 = (e3 = []) => {
    if (r2 !== `level` || i2 !== `normal`) return e3;
    let t3 = e3.filter((e4) => c2(e4));
    return t3.length ? t3 : e3;
  };
  return F(e2, t2) ? l2([t2])[0] || t2 : o2.length ? l2(o2)[0] || o2[0] : l2(s2)[0] || l2(a2)[0] || null;
}
function L(e2, t2, n2 = []) {
  let r2 = String(e2?.type || ``).trim();
  if (r2 !== `giftBox` && r2 !== `epicPortal`) return I(e2, t2, n2);
  let i2 = n2.filter((e3) => e3?.type === `level`);
  return t2 || i2[0] || n2[0] || null;
}
function R(e2 = []) {
  let t2 = new Set(e2.map((e3) => String(e3?.id || ``)).filter(Boolean)), n2 = /* @__PURE__ */ new Map();
  for (let r2 of e2) {
    let e3 = String(r2?.id || ``);
    if (!e3) continue;
    let i2 = D(r2, t2);
    for (let [r3, a2] of i2.entries()) {
      let i3 = typeof a2 == `string` ? a2 : a2?.id == null ? null : String(a2.id);
      !i3 || !t2.has(i3) || n2.has(i3) || n2.set(i3, { parentId: e3, branchIndex: r3 });
    }
  }
  return n2;
}
function z(e2, t2 = [], n2 = /* @__PURE__ */ new Map(), r2 = []) {
  let i2 = _(e2) || e2 || {}, a2 = new Map(t2.map((e3) => [String(e3?.id || ``), e3])), o2 = R(t2), s2 = i2.autoLayout || {}, c2 = i2.reuseOriginalPositions !== false, l2 = [...n2.values()], u2 = Number(s2.baseX ?? l2[0]?.position?.x ?? r2[0]?.position?.x ?? 0), d2 = Number(s2.baseY ?? l2[0]?.position?.y ?? r2[0]?.position?.y ?? 0), p2 = Number(s2.xStep ?? 330), m2 = Number(s2.yStep ?? 180), h2 = /* @__PURE__ */ new Map();
  function g2(e3, t3 = /* @__PURE__ */ new Set()) {
    if (!e3 || t3.has(e3)) return null;
    t3.add(e3);
    let r3 = a2.get(e3);
    if (!r3) return null;
    if (r3.position && typeof r3.position == `object`) return { x: r3.position.x, y: r3.position.y, z: r3.position.z ?? 0 };
    let i3 = n2.get(e3);
    if (i3?.position) return { x: i3.position.x, y: i3.position.y, z: i3.position.z ?? 0 };
    for (let e4 of f(r3.children).filter((e5) => typeof e5 == `string`)) {
      let n3 = g2(e4, t3);
      if (n3) return n3;
    }
    return null;
  }
  function v2(e3, t3 = /* @__PURE__ */ new Set()) {
    if (!e3) return null;
    if (h2.has(e3)) return h2.get(e3);
    if (t3.has(e3)) return null;
    t3.add(e3);
    let r3 = a2.get(e3);
    if (!r3) return null;
    if (r3.position && typeof r3.position == `object`) {
      let t4 = { x: r3.position.x, y: r3.position.y, z: r3.position.z ?? 0 };
      return h2.set(e3, t4), t4;
    }
    let i3 = o2.get(e3);
    if (r3.relativePosition && typeof r3.relativePosition == `object` && i3?.parentId) {
      let n3 = v2(i3.parentId, t3);
      if (n3) {
        let t4 = { x: Number(n3.x ?? 0) + Number(r3.relativePosition.x ?? 0), y: Number(n3.y ?? 0) + Number(r3.relativePosition.y ?? 0), z: Number(n3.z ?? 0) + Number(r3.relativePosition.z ?? 0) };
        return h2.set(e3, t4), t4;
      }
    }
    let s3 = c2 ? n2.get(e3) : null;
    if (s3?.position) {
      let t4 = { x: s3.position.x, y: s3.position.y, z: s3.position.z ?? 0 };
      return h2.set(e3, t4), t4;
    }
    let l3 = i3 ? v2(i3.parentId, t3) : null, _2 = f(r3.children).filter((e4) => typeof e4 == `string`).map((e4) => g2(e4)).find(Boolean);
    if (l3 && _2) {
      let t4 = i3?.branchIndex ? i3.branchIndex * m2 : 0, n3 = { x: (l3.x + _2.x) / 2, y: (l3.y + _2.y) / 2 + t4, z: 0 };
      return h2.set(e3, n3), n3;
    }
    let y2 = i3 ? ((v2(i3.parentId, t3)?.x ?? u2) - u2) / p2 + 1 : 0, b2 = i3?.branchIndex ? i3.branchIndex : 0, x2 = { x: u2 + y2 * p2, y: d2 + b2 * m2, z: 0 };
    return h2.set(e3, x2), x2;
  }
  return function(e3, t3) {
    return v2(String(e3?.id || ``)) || { x: u2 + t3 * p2, y: d2, z: 0 };
  };
}
function B(e2 = {}, t2 = {}) {
  let n2 = { ...e2 };
  for (let [e3, r2] of Object.entries(t2 || {})) r2 != null && (n2[e3] = d(r2));
  return n2;
}
function V(e2, t2) {
  return u(e2) === u(t2);
}
function H(e2, t2, n2, r2) {
  if (!e2 || typeof e2[t2] != `function` || typeof n2 != `function`) return () => {
  };
  let i2 = e2[t2], a2 = function(...e3) {
    return n2({ thisArg: this, args: e3, callNext: (...t3) => i2.apply(this, t3.length > 0 ? t3 : e3) });
  };
  e2[t2] = a2;
  let o2 = () => {
    e2[t2] === a2 && (e2[t2] = i2);
  };
  return r2.push(o2), o2;
}
function createWorldMapJsonPatcher() {
  let e2 = { services: {}, specs: [], cleanups: [], api: null }, t2 = { wrapMethod(t3 = {}) {
    return H(t3.target, t3.methodName, t3.handler, e2.cleanups);
  } };
  function n2(n3 = {}) {
    e2.services = n3, e2.api = i({ ...n3, behaviorTools: t2 });
  }
  async function r2(t3 = []) {
    e2.specs = [];
    for (let n3 of t3) try {
      let t4 = await p(n3);
      if (!t4?.data) continue;
      e2.specs.push({ pack: n3, path: t4.path, data: t4.data }), o.info(`[${n3.meta?.name || n3.dir}] loaded worldmap json spec from ${t4.path}`);
    } catch (e3) {
      o.error(`[${n3.meta?.name || n3.dir}] ${e3}`);
    }
    return e2.specs;
  }
  function a2(e3, t3, n3, r3) {
    !e3 || !r3 || (e3.patchWorld(t3, (e4) => {
      Array.isArray(r3.levels) && (e4.LEVELS = [...r3.levels]), Array.isArray(r3.plants) && (e4.PLANTS = [...r3.plants]), Array.isArray(r3.startingLevels) && (e4.STARTINGLEVELS = [...r3.startingLevels]), typeof r3.epicTarget == `string` && (e4.EPIC_TARGET = r3.epicTarget), typeof r3.intro == `string` && (e4.INTRO = r3.intro);
    }), n3?.MapProps && (Array.isArray(r3.levels) && (n3.MapProps.LEVELS = [...r3.levels]), Array.isArray(r3.plants) && (n3.MapProps.PLANTS = [...r3.plants]), Array.isArray(r3.startingLevels) && (n3.MapProps.STARTINGLEVELS = [...r3.startingLevels]), typeof r3.epicTarget == `string` && (n3.MapProps.EPIC_TARGET = r3.epicTarget), typeof r3.intro == `string` && (n3.MapProps.INTRO = r3.intro)));
  }
  function s2(e3, t3, n3) {
    !Array.isArray(n3?.sequence) || n3.sequence.length < 2 || e3.setPathSequence(n3.sequence.map(m), { runtimeMap: t3, keepTail: n3.keepTail === true });
  }
  function c2(e3, t3, n3) {
    return e3.createNode({ customId: n3?.id || n3?.customId || null, type: n3?.type, template: m(n3?.template), title: n3?.title, position: n3?.position, levels: n3?.levels, portalLevels: n3?.portalLevels, plantReward: n3?.plantReward, upgradeReward: n3?.upgradeReward }, { runtimeMap: t3 })?.id ?? n3?.id ?? n3?.customId ?? null;
  }
  function u2(e3, t3, n3, r3 = []) {
    let i2 = g(n3);
    if (!i2) return;
    let a3 = e3.findIsland(i2, { runtimeMap: t3 });
    if (!a3) {
      o.warn(`[worldmap-json] island not found for selector ${JSON.stringify(i2)}`);
      return;
    }
    if (typeof n3.title == `string` && e3.setNodeTitle(i2, n3.title, { runtimeMap: t3 }), n3.position && typeof n3.position == `object` && e3.relayout(i2, { x: n3.position.x, y: n3.position.y, z: n3.position.z }, { runtimeMap: t3 }), Array.isArray(n3.levels) && a3.type === `level` && (a3.raw.levelJsonsID = [...n3.levels]), Array.isArray(n3.portalLevels) && a3.type === `epicPortal` && (a3.raw.epicLevelJsonsID = [...n3.portalLevels]), n3.plantReward != null && a3.type === `plant` && e3.setPlantReward(i2, n3.plantReward, { runtimeMap: t3 }), n3.upgradeReward != null && a3.type === `upgrade` && e3.setUpgradeReward(i2, n3.upgradeReward, { runtimeMap: t3 }), Array.isArray(n3.children) && r3.push(() => {
      e3.setChildren(i2, n3.children.map(m), { runtimeMap: t3 });
    }), n3.parent != null && r3.push(() => {
      e3.link(m(n3.parent), i2, { runtimeMap: t3, replacePrimary: n3.primary === true });
    }), n3.warnOverlap !== false) {
      let r4 = e3.checkOverlap(i2, { runtimeMap: t3, threshold: Number(n3.overlapThreshold || 100) });
      r4 && o.warn(`[worldmap-json] node ${JSON.stringify(i2)} overlaps with '${r4}'`);
    }
  }
  function d2(e3, t3, n3, r3, i2, a3, s3, c3 = []) {
    if (!n3 || typeof n3 != `object` || !n3.id) return null;
    let l2 = s3.get(String(n3.id)) || null, u3 = String(n3?.type || ``).trim(), d3 = null;
    if (n3.template != null) {
      let r4 = S(n3.template, i2);
      d3 = ((u3 === `giftBox` || u3 === `epicPortal` ? T(e3, t3, r4, u3) : null) ?? e3.findIsland(r4, { runtimeMap: t3 }))?.raw ?? null, !d3 && u3 !== `giftBox` && u3 !== `epicPortal` && o.warn(`[worldmap-json] template selector ${JSON.stringify(r4)} did not match a runtime island`);
    } else (u3 === `giftBox` || u3 === `epicPortal`) && (d3 = T(e3, t3, { type: u3 }, u3)?.raw ?? null), d3 ||= L(n3, l2, c3)?.raw ?? null;
    !d3 && (u3 === `giftBox` || u3 === `epicPortal`) && (d3 = L(n3, l2, c3)?.raw ?? null);
    let f2 = e3.createNode({ customId: n3.id, type: n3.type || `level`, template: d3, appearance: n3.appearance, title: n3.title, position: a3(n3, r3), levels: n3.levels, portalLevels: n3.portalLevels, plantReward: n3.plantReward, upgradeReward: n3.upgradeReward }, { runtimeMap: t3, skipRefresh: true });
    return f2?.raw && (f2.raw.affectsMaxX = n3?.affectsMaxX !== false), f2;
  }
  function h2(e3, t3 = []) {
    for (let n3 of t3) try {
      n3._inWorldMap = e3, n3.start?.();
    } catch (e4) {
      o.error(`[worldmap-json] island start failed: ${e4}`);
    }
    for (let e4 of t3) try {
      e4.laterStart?.();
    } catch (e5) {
      o.error(`[worldmap-json] island laterStart failed: ${e5}`);
    }
  }
  function v2(e3, t3 = []) {
    if (!e3) return;
    let n3 = t3.map((e4) => e4?.islandNode).filter(Boolean);
    e3.nextIsland = n3[0] ?? null, e3.otherNextIslands = n3.slice(1);
  }
  function y2(e3, t3, n3) {
    let r3 = _(n3), i2 = b(n3);
    if (!r3 || !i2.length) return false;
    let a3 = e3.getIslands({ runtimeMap: t3 }), s3 = a3.filter((e4) => !M(e4)), c3 = N(s3), l2 = a3.filter((e4) => M(e4)), u3 = new Set(i2.map((e4) => String(e4?.id || ``)).filter(Boolean)), p2 = P(Array.isArray(r3?.mainline) ? r3.mainline : [], c3), m2 = z(n3, i2, p2, c3), g2 = [], y3 = /* @__PURE__ */ new Map();
    A(n3) && o.warn(`[worldmap-json] custom endless override is currently disabled; keeping vanilla endless islands unchanged`);
    for (let [n4, r4] of i2.entries()) {
      let i3 = d2(e3, t3, r4, n4, u3, m2, p2, c3);
      i3?.raw && (g2.push(i3.raw), y3.set(String(r4?.id || ``), i3.raw));
    }
    for (let n4 of i2) {
      if (!n4?.id) continue;
      let r4 = D(n4, u3);
      v2(y3.get(String(n4.id || ``)) ?? null, r4.map((n5) => n5?.id == null ? e3.getIsland(n5, { runtimeMap: t3 })?.raw ?? null : y3.get(String(n5.id || ``)) ?? null).filter(Boolean));
    }
    let x2 = [], S2 = l2.map((e4) => e4.raw).filter(Boolean);
    for (let n4 of s3.map((e4) => e4.raw).filter(Boolean)) e3.removeNode(n4, { runtimeMap: t3, skipRefresh: true });
    t3.levelIslands = [...g2, ...S2].filter(Boolean), t3.startingLevels = Array.isArray(t3?.MapProps?.STARTINGLEVELS) ? [...t3.MapProps.STARTINGLEVELS] : [], h2(t3, [...g2, ...x2]), n3.refreshPaths !== false && e3.refreshPaths({ runtimeMap: t3 }), e3.cleanupOrphanNodes?.({ runtimeMap: t3 });
    try {
      t3.setIslandActive?.(), t3.moveZombossHead?.();
    } catch {
    }
    let C3 = [...i2, ...f([])];
    for (let n4 of C3) {
      if (n4?.warnOverlap === false) continue;
      let i3 = e3.checkOverlap({ id: n4.id }, { runtimeMap: t3, threshold: Number(n4?.overlapThreshold || r3?.overlapThreshold || 100) });
      i3 && o.warn(`[worldmap-json] node '${n4.id}' overlaps with '${i3}'`);
    }
    return true;
  }
  function C2(t3, n3) {
    let r3 = l(e2.api), i2 = t3?.data?.worlds;
    if (!(!i2 || typeof i2 != `object`)) for (let [e3, l2] of Object.entries(i2)) {
      if (!V(n3.worldId, e3)) continue;
      let i3 = x(l2), d3 = B(i3 ? k(l2) : {}, l2?.data || {});
      a2(r3, e3, n3.runtimeMap, d3), i3 ? y2(r3, n3.runtimeMap, l2) : s2(r3, n3.runtimeMap, l2);
      let p2 = [];
      if (!i3) {
        for (let e4 of f(l2.removeNodes)) {
          let t4 = g(e4);
          t4 && r3.removeNode(t4, { runtimeMap: n3.runtimeMap });
        }
        for (let e4 of f(l2.addNodes)) {
          if (!e4 || typeof e4 != `object`) continue;
          let t4 = c2(r3, n3.runtimeMap, e4);
          t4 && Array.isArray(e4.children) && p2.push(() => {
            r3.setChildren({ id: t4 }, e4.children.map(m), { runtimeMap: n3.runtimeMap });
          }), t4 && e4.parent != null && p2.push(() => {
            r3.link(m(e4.parent), { id: t4 }, { runtimeMap: n3.runtimeMap, replacePrimary: e4.primary === true });
          });
        }
        for (let e4 of f(l2.nodes)) !e4 || typeof e4 != `object` || u2(r3, n3.runtimeMap, e4, p2);
      }
      for (let e4 of p2) try {
        e4();
      } catch (e5) {
        o.error(`[worldmap-json] deferred link failed: ${e5}`);
      }
      !i3 && l2.refreshPaths !== false && r3.refreshPaths({ runtimeMap: n3.runtimeMap }), o.info(`[${t3.pack.meta?.name || t3.pack.dir}] applied worldmap json patch to world '${e3}'`);
    }
  }
  function w2() {
    if (!e2.api || e2.specs.length === 0) return;
    let t3 = l(e2.api).onWorldLoaded((t4) => {
      for (let n3 of e2.specs) try {
        C2(n3, t4);
      } catch (e3) {
        o.error(`[${n3.pack.meta?.name || n3.pack.dir}] apply failed: ${e3}`);
      }
    });
    typeof t3 == `function` && e2.cleanups.push(t3);
  }
  async function E2(t3 = []) {
    return O2(), await r2(t3), w2(), e2.specs;
  }
  function O2() {
    for (let t3 of [...e2.cleanups].reverse()) try {
      t3();
    } catch {
    }
    e2.cleanups = [];
  }
  function j2() {
    O2(), e2.specs = [];
  }
  function F2() {
    return { specs: e2.specs.map((e3) => ({ pack: e3.pack.meta?.name || e3.pack.dir, path: e3.path, worlds: Object.keys(e3.data?.worlds || {}) })) };
  }
  return { bindServices: n2, loadFromPacks: r2, reloadFromPacks: E2, install: w2, dispose: O2, clear: j2, getStatus: F2 };
}
export {
  createWorldMapJsonPatcher
};
