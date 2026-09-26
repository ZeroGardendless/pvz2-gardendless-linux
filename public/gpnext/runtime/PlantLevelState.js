import { n as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
import { a as n } from "./Engine.js";
var r = e({ bridgePlantLevelStates: () => bridgePlantLevelStates, ensurePlantLevelState: () => ensurePlantLevelState, ensurePlantLevelStates: () => ensurePlantLevelStates, getPlantLevelState: () => getPlantLevelState, isPlantObtained: () => isPlantObtained, setSelectedLevel: () => setSelectedLevel, setUnlockedLevel: () => setUnlockedLevel }), i = new t(`plant-level-state`), a = { progress: 0, tutorialLevel: 0, medal: false, costume: -1, costumes: [], boost: 0 };
function o() {
  return n() || null;
}
function s() {
  return o()?.currentPlayer ?? null;
}
function c() {
  let e2 = o();
  return e2?.savePP ? (e2.savePP(), true) : false;
}
function l(e2, t2) {
  return (!e2[t2] || typeof e2[t2] != `object` || Array.isArray(e2[t2])) && (e2[t2] = {}), e2[t2];
}
function u(e2 = false) {
  let t2 = s();
  return t2 ? e2 ? l(l(t2, `gpNext`), `plantLevels`) : t2?.gpNext?.plantLevels ?? null : null;
}
function d(e2) {
  return s()?.plantProps?.[e2]?.progress ?? 0;
}
function f(e2) {
  let t2 = String(e2 || ``).trim();
  return t2 ? s()?.plantProps?.[t2] ?? null : null;
}
function p(e2) {
  return Number(d(e2)) > 0;
}
function m(e2) {
  let t2 = s();
  if (!t2) return null;
  let n2 = l(t2, `plantProps`), r2 = String(e2 || ``).trim();
  return r2 ? ((!n2[r2] || typeof n2[r2] != `object` || Array.isArray(n2[r2])) && (n2[r2] = { progress: a.progress, tutorialLevel: a.tutorialLevel, medal: a.medal, costume: a.costume, costumes: a.costumes.slice(), boost: a.boost }), n2[r2]) : null;
}
function h(e2, t2) {
  let n2 = ensurePlantLevelState(e2, t2, { persist: false }) || { unlockedLevel: 0, selectedLevel: 1 }, r2 = Array.isArray(t2?.levelEntries) ? t2.levelEntries : [], i2 = n2.selectedLevel > 0 && r2.find((e3) => e3?.level === n2.selectedLevel)?.cloneCodename || null, a2 = [];
  i2 && a2.push(i2), a2.push(String(e2 || ``).trim());
  for (let e3 = Number(n2.unlockedLevel) || 0; e3 >= 1; --e3) {
    let t3 = r2.find((t4) => t4?.level === e3)?.cloneCodename || null;
    t3 && a2.push(t3);
  }
  let o2 = /* @__PURE__ */ new Set(), s2 = [];
  for (let e3 of a2) {
    let t3 = String(e3 || ``).trim();
    !t3 || o2.has(t3) || (o2.add(t3), s2.push(t3));
  }
  for (let e3 of r2) {
    let t3 = String(e3?.cloneCodename || ``).trim();
    !t3 || o2.has(t3) || !f(t3) && Number(e3?.level) > (Number(n2.unlockedLevel) || 0) || (o2.add(t3), s2.push(t3));
  }
  return s2;
}
function g(e2 = []) {
  for (let t2 of e2) {
    let e3 = Number(f(t2)?.costume);
    if (Number.isFinite(e3) && e3 >= 0) return e3;
  }
  return a.costume;
}
function _(e2 = []) {
  let t2 = [], n2 = /* @__PURE__ */ new Set();
  for (let r2 of e2) {
    let e3 = Array.isArray(f(r2)?.costumes) ? f(r2).costumes : [];
    for (let r3 of e3) {
      let e4 = Number(r3);
      !Number.isFinite(e4) || e4 < 0 || n2.has(e4) || (n2.add(e4), t2.push(e4));
    }
  }
  return t2;
}
function v(e2, t2) {
  let n2 = h(e2, t2);
  if (!n2.length) return 0;
  let r2 = n2.map((e3) => f(e3)).filter((e3) => e3 && typeof e3 == `object` && !Array.isArray(e3));
  if (!r2.length) return 0;
  let i2 = { medal: r2.some((e3) => e3?.medal === true), tutorialLevel: r2.reduce((e3, t3) => Math.max(e3, Number(t3?.tutorialLevel) || 0), 0), costume: g(n2), costumes: _(n2) }, a2 = 0;
  for (let e3 of n2) {
    let t3 = m(e3);
    if (!t3) continue;
    !!t3.medal !== i2.medal && (t3.medal = i2.medal, a2 += 1), Number(t3.tutorialLevel) !== i2.tutorialLevel && (t3.tutorialLevel = i2.tutorialLevel, a2 += 1), Number(t3.costume) !== i2.costume && (t3.costume = i2.costume, a2 += 1);
    let n3 = Array.isArray(t3.costumes) ? t3.costumes.map((e4) => Number(e4)).filter(Number.isFinite) : [];
    n3.length === i2.costumes.length && n3.every((e4, t4) => e4 === i2.costumes[t4]) || (t3.costumes = i2.costumes.slice(), a2 += 1);
  }
  return a2;
}
function y(e2, t2) {
  let n2 = Number(e2);
  return Number.isFinite(n2) ? Math.max(0, Math.min(t2, Math.floor(n2))) : 0;
}
function b(e2, t2, n2) {
  let r2 = Number(e2), i2 = n2 > 0 ? n2 : 1;
  return Number.isFinite(r2) ? Math.max(1, Math.min(Math.max(1, n2), t2, Math.floor(r2))) : i2;
}
function x(e2, t2) {
  let n2 = Math.max(1, Number(t2?.maxLevel) || 1), r2 = +!!p(e2);
  for (let e3 of t2?.levelEntries || []) p(e3.cloneCodename) && (r2 = Math.max(r2, e3.level));
  return Math.min(n2, r2);
}
function S(e2, t2, n2) {
  let r2 = Math.max(1, Number(t2?.maxLevel) || 1), i2 = x(e2, t2), a2 = y(n2?.unlockedLevel, r2);
  a2 < i2 && (a2 = i2);
  let o2 = b(n2?.selectedLevel, r2, a2);
  return { unlockedLevel: a2, selectedLevel: o2 };
}
function getPlantLevelState(e2, t2) {
  return !e2 || !t2 ? null : S(e2, t2, u(false)?.[e2]);
}
function ensurePlantLevelState(e2, t2, n2 = {}) {
  if (!e2 || !t2) return null;
  let r2 = u(true);
  if (!r2) return i.debug(`[plant-levels] Player state not ready; ensure skipped`), null;
  let a2 = r2[e2], o2 = S(e2, t2, a2);
  return (!a2 || Number(a2.unlockedLevel) !== o2.unlockedLevel || Number(a2.selectedLevel) !== o2.selectedLevel) && (r2[e2] = o2, n2.persist !== false && c()), r2[e2] || o2;
}
function ensurePlantLevelStates(e2 = [], t2 = {}) {
  let n2 = u(true);
  if (!n2) return i.debug(`[plant-levels] Player state not ready; batch ensure skipped`), { changed: false, count: 0 };
  let r2 = false, a2 = 0;
  for (let t3 of Array.isArray(e2) ? e2 : []) {
    let e3 = String(t3?.baseCodename || ``).trim(), i2 = t3?.config || null;
    if (!e3 || !i2) continue;
    let o2 = n2[e3], s2 = S(e3, i2, o2);
    (!o2 || Number(o2.unlockedLevel) !== s2.unlockedLevel || Number(o2.selectedLevel) !== s2.selectedLevel) && (n2[e3] = s2, r2 = true), a2 += 1;
  }
  return r2 && t2.persist !== false && c(), { changed: r2, count: a2 };
}
function bridgePlantLevelStates(e2 = [], t2 = {}) {
  let n2 = u(true);
  if (!n2) return i.debug(`[plant-levels] Player state not ready; bridge skipped`), { changed: false, count: 0, syncedProgress: 0, syncedSharedFields: 0 };
  let r2 = false, a2 = 0, o2 = 0, s2 = 0;
  for (let i2 of Array.isArray(e2) ? e2 : []) {
    let e3 = String(i2?.baseCodename || ``).trim(), c2 = i2?.config || null;
    if (!e3 || !c2) continue;
    let l2 = n2[e3], u2 = S(e3, c2, l2);
    if ((!l2 || Number(l2.unlockedLevel) !== u2.unlockedLevel || Number(l2.selectedLevel) !== u2.selectedLevel) && (n2[e3] = u2, r2 = true), t2.syncProgress !== false && u2.unlockedLevel > 0) {
      let t3 = m(e3);
      t3 && Number(t3.progress) !== 2 && (t3.progress = 2, o2 += 1, r2 = true);
      for (let e4 of c2.levelEntries || []) {
        if (Number(e4?.level) > u2.unlockedLevel) continue;
        let t4 = m(e4.cloneCodename);
        t4 && Number(t4.progress) !== 2 && (t4.progress = 2, o2 += 1, r2 = true);
      }
    }
    if (t2.syncSharedFields !== false) {
      let t3 = v(e3, c2);
      t3 > 0 && (s2 += t3, r2 = true);
    }
    a2 += 1;
  }
  return r2 && t2.persist !== false && c(), { changed: r2, count: a2, syncedProgress: o2, syncedSharedFields: s2 };
}
function setUnlockedLevel(e2, t2, n2, r2 = {}) {
  if (!e2 || !n2) return null;
  let i2 = u(true);
  if (!i2) return null;
  let a2 = ensurePlantLevelState(e2, n2, { persist: false }) || { unlockedLevel: 0, selectedLevel: 1 }, o2 = Math.max(1, Number(n2?.maxLevel) || 1), s2 = y(t2, o2);
  return i2[e2] = { unlockedLevel: s2, selectedLevel: r2.autoSelect === true && s2 > 0 ? s2 : b(a2.selectedLevel, o2, s2) }, r2.persist !== false && c(), i2[e2];
}
function setSelectedLevel(e2, t2, n2, r2 = {}) {
  if (!e2 || !n2) return null;
  let i2 = u(true);
  if (!i2) return null;
  let a2 = ensurePlantLevelState(e2, n2, { persist: false }) || { unlockedLevel: 0, selectedLevel: 1 }, o2 = b(t2, Math.max(1, Number(n2?.maxLevel) || 1), a2.unlockedLevel);
  return i2[e2] = { unlockedLevel: a2.unlockedLevel, selectedLevel: o2 }, r2.persist !== false && c(), i2[e2];
}
function isPlantObtained(e2) {
  return d(e2) === 2;
}
export {
  bridgePlantLevelStates,
  ensurePlantLevelState,
  ensurePlantLevelStates,
  getPlantLevelState,
  isPlantObtained,
  r as o,
  setSelectedLevel,
  setUnlockedLevel
};
