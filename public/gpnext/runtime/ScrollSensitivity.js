import { t } from "../core/Logger.js";
import { getSettings } from "../core/SettingsStore.js";
import { c as n, f as r, s as i, v as a } from "./Engine.js";
var o = new t(`scroll-sensitivity`), s = Object.freeze({ animationController: [`chunks:///_virtual/AnimationController.ts`, `AnimationController`], cards: [`chunks:///_virtual/Cards.ts`, `Cards`], sandBoxZombieCards: [`chunks:///_virtual/SandBoxZombieCards.ts`, `SandBoxZombieCards`], worldMapChooser: [`chunks:///_virtual/WorldMapChooser.ts`, `WorldMapChooser`], uiInGame: [`chunks:///_virtual/UI.ts`, `UIInGame`], sandBoxLevelSettingWindow: [`chunks:///_virtual/SandBoxLevelSettingWindow.ts`, `SandBoxLevelSettingWindow`], levelPlay: [`chunks:///_virtual/levelController.ts`, `LevelPlay`] }), c = Object.freeze({ enabled: true, wheel: 1, discreteMinIntervalMs: 0 }), l = 60, u = 60, d = 180, f = 4, p = 10, m = { ...c }, h = false, g = false, _ = /* @__PURE__ */ new WeakMap();
function v(e2, t2, n2) {
  return Math.max(t2, Math.min(n2, e2));
}
function y(e2, t2, n2, r2 = 1) {
  let i2 = Number(e2);
  return !Number.isFinite(i2) || i2 < t2 ? r2 : v(i2, t2, n2);
}
function b(e2) {
  let t2 = e2 && typeof e2 == `object` ? e2 : {};
  return { enabled: t2.enabled !== false, wheel: y(t2.wheel, 0.05, 3, 1), discreteMinIntervalMs: Math.round(y(t2.discreteMinIntervalMs, 0, 400, 0)) };
}
function x() {
  return m.enabled !== false;
}
function S(e2) {
  return Number.isFinite(e2) ? e2 * m.wheel : e2;
}
function C(e2) {
  let t2 = _.get(e2);
  return t2 || (t2 = /* @__PURE__ */ Object.create(null), _.set(e2, t2)), t2;
}
function w(e2, t2, i2 = t2) {
  return r(e2, t2) || n(i2);
}
function T(e2) {
  let t2 = i()?.director?.getScene?.();
  if (!t2 || !e2 || typeof t2.getComponentInChildren != `function`) return null;
  try {
    return t2.getComponentInChildren(e2);
  } catch {
    return null;
  }
}
function E(e2) {
  let t2 = Number(e2?._gpNextRawScrollY);
  if (Number.isFinite(t2) && t2 !== 0) return t2 > 0 ? 1 : -1;
  let n2 = Number(e2?.getScrollY?.() || 0);
  return !Number.isFinite(n2) || n2 === 0 ? 0 : n2 > 0 ? 1 : -1;
}
function D(e2) {
  let t2 = Number(e2?._gpNextRawScrollY);
  if (Number.isFinite(t2) && t2 !== 0) return Math.abs(t2);
  let n2 = Number(e2?.getScrollY?.() || 0);
  return !Number.isFinite(n2) || n2 === 0 ? 0 : Math.abs(n2);
}
function O() {
  return l;
}
function k(e2) {
  return e2 > 0 && e2 < u;
}
function A(e2, t2, n2, r2, i2) {
  return i2 || t2 !== e2.lastDirection || !k(n2) || e2.lastAcceptedAt <= 0 || r2 - e2.lastAcceptedAt > d ? false : e2.momentumLocked && n2 <= e2.lastMagnitude + f ? true : e2.lastMagnitude > 0 && n2 <= e2.lastMagnitude + f && e2.lastMagnitude <= e2.prevMagnitude + f ? !(n2 > e2.lastMagnitude + p) : false;
}
function j(e2, t2, n2) {
  if (!e2) return 0;
  let r2 = E(n2);
  if (!r2) return 0;
  let i2 = C(e2), a2 = i2[t2] && typeof i2[t2] == `object` ? i2[t2] : { lastAcceptedAt: 0, lastEventAt: 0, lastDirection: 0, lastMagnitude: 0, prevMagnitude: 0, momentumLocked: false }, o2 = Date.now(), s2 = o2 - a2.lastEventAt > O(), c2 = D(n2);
  return (s2 || r2 !== a2.lastDirection) && (a2.momentumLocked = false), A(a2, r2, c2, o2, s2) ? (a2.momentumLocked = true, a2.prevMagnitude = a2.lastMagnitude, a2.lastMagnitude = c2, a2.lastEventAt = o2, a2.lastDirection = r2, i2[t2] = a2, 0) : a2.lastAcceptedAt > 0 && o2 - a2.lastAcceptedAt < m.discreteMinIntervalMs ? (a2.prevMagnitude = a2.lastMagnitude, a2.lastMagnitude = c2, a2.lastEventAt = o2, a2.lastDirection = r2, i2[t2] = a2, 0) : (a2.lastAcceptedAt = o2, a2.prevMagnitude = a2.lastMagnitude, a2.lastMagnitude = c2, a2.lastEventAt = o2, a2.lastDirection = r2, a2.momentumLocked = false, i2[t2] = a2, r2);
}
function M(e2, t2, n2 = 1) {
  if (!e2) return false;
  let r2 = C(e2), i2 = r2[t2] && typeof r2[t2] == `object` ? r2[t2] : { lastAcceptedAt: 0, lastEventAt: 0, lastDirection: 0, lastMagnitude: 0, prevMagnitude: 0, momentumLocked: false }, a2 = Date.now();
  return i2.lastEventAt = a2, i2.lastDirection = n2, i2.lastAcceptedAt > 0 && a2 - i2.lastAcceptedAt < m.discreteMinIntervalMs ? (r2[t2] = i2, false) : (i2.lastAcceptedAt = a2, i2.momentumLocked = false, r2[t2] = i2, true);
}
function N() {
  let e2 = (window.cc?.EventMouse || window.cc?.Event?.EventMouse)?.prototype;
  if (!e2) return o.warn(`EventMouse prototype not available \u2014 scroll sensitivity skipped`), false;
  if (e2._gpNextScrollPatched) return true;
  let t2 = false, n2 = e2.setScrollData;
  typeof n2 == `function` && (e2._gpNextOrigSetScrollData = n2, e2.setScrollData = function(t3, n3) {
    return this._gpNextRawScrollX = t3, this._gpNextRawScrollY = n3, x() ? e2._gpNextOrigSetScrollData.call(this, S(t3), S(n3)) : e2._gpNextOrigSetScrollData.call(this, t3, n3);
  }, t2 = true);
  let r2 = e2.getScrollX;
  typeof r2 == `function` && (e2._gpNextOrigGetScrollX = r2, e2.getScrollX = function() {
    if (!x()) return e2._gpNextOrigGetScrollX.call(this);
    let t3 = this._gpNextRawScrollX;
    return S(Number.isFinite(t3) ? t3 : e2._gpNextOrigGetScrollX.call(this));
  }, t2 = true);
  let i2 = e2.getScrollY;
  return typeof i2 == `function` && (e2._gpNextOrigGetScrollY = i2, e2.getScrollY = function() {
    if (!x()) return e2._gpNextOrigGetScrollY.call(this);
    let t3 = this._gpNextRawScrollY;
    return S(Number.isFinite(t3) ? t3 : e2._gpNextOrigGetScrollY.call(this));
  }, t2 = true), t2 ? (e2._gpNextScrollPatched = true, true) : (o.warn(`EventMouse scroll accessors not available \u2014 scroll sensitivity skipped`), false);
}
function P() {
  let e2 = w(...s.cards), t2 = w(...s.levelPlay, `LevelPlay`), n2 = w(...s.sandBoxLevelSettingWindow), r2 = e2?.prototype;
  if (!r2 || r2._gpNextDiscreteScrollPatched) return !!r2;
  let i2 = r2.onMouseScroll;
  return r2._gpNextDiscreteScrollPatched = true, r2._gpNextOrigOnMouseScroll = i2, r2.onMouseScroll = function(e3) {
    if (!x() || !t2?.sandBoxModeOn || !t2?.gameStarted || !this.CFs?.length) return typeof i2 == `function` ? i2.call(this, e3) : void 0;
    let r3 = j(this, `cards`, e3);
    if (!r3) return;
    let a2 = n2?.plantList;
    if (!Array.isArray(a2) || !a2.length) return;
    let o2 = this.CFs[0]?.ID, s2 = a2.indexOf(o2);
    s2 < 0 && (s2 = 0), s2 = ((s2 - r3) % a2.length + a2.length) % a2.length, this.CFs.forEach((e4, t3) => {
      let n3 = a2[(s2 + t3) % a2.length];
      e4.FORCE_BOOSTED = false, e4.PP_BOOSTED = false, e4.cardGrouper(n3);
    });
  }, true;
}
function F() {
  let e2 = w(...s.sandBoxZombieCards)?.prototype;
  if (!e2 || e2._gpNextDiscreteScrollPatched) return !!e2;
  let t2 = e2.onMouseScroll;
  return e2._gpNextDiscreteScrollPatched = true, e2._gpNextOrigOnMouseScroll = t2, e2.onMouseScroll = function(e3) {
    if (!x() || !this.zombieCards?.length) return typeof t2 == `function` ? t2.call(this, e3) : void 0;
    let n2 = j(this, `sandboxZombieCards`, e3);
    if (!n2) return;
    let r2 = (this.zombieCards[0]?.ID || 0) - n2;
    this.zombieCards.forEach((e4, t3) => {
      e4.cardGrouper(r2 + t3, false);
    });
  }, true;
}
function I() {
  let e2 = w(...s.worldMapChooser), t2 = e2?.prototype;
  if (!t2 || t2._gpNextDiscreteScrollPatched) return !!t2;
  let n2 = t2.onMouseWheel;
  t2._gpNextDiscreteScrollPatched = true, t2._gpNextOrigOnMouseWheel = n2, t2.onMouseWheel = function(e3) {
    if (!x()) return typeof n2 == `function` ? n2.call(this, e3) : void 0;
    let t3 = j(this, `worldMapChooser`, e3);
    t3 && this.moveBy(-t3);
  };
  let r2 = T(e2), a2 = r2?.wheelListener, o2 = i(), c2 = o2?.Input?.EventType?.MOUSE_WHEEL || o2?.Node?.EventType?.MOUSE_WHEEL;
  if (r2 && a2?.on && c2) {
    try {
      typeof a2.targetOff == `function` && a2.targetOff(r2);
    } catch {
    }
    a2.on(c2, r2.onMouseWheel, r2);
  }
  return true;
}
function L(e2) {
  let t2 = i(), n2 = t2?.Node?.EventType?.MOUSE_WHEEL || t2?.Input?.EventType?.MOUSE_WHEEL, r2 = e2?.SBZombieArmorIconSlot, a2 = [r2, r2?.parent].filter(Boolean);
  if (!n2 || !a2.length || !e2?.switchSBZombieAddArmor) return false;
  e2._gpNextArmorWheelHandler ||= function(t3) {
    if (t3.preventSwallow = true, !x()) {
      t3.getScrollY() > 0 ? e2.switchSBZombieAddArmor(-1) : t3.getScrollY() < 0 && e2.switchSBZombieAddArmor(1);
      return;
    }
    let n3 = j(e2, `sandboxZombieArmor`, t3);
    n3 && e2.switchSBZombieAddArmor(-n3);
  };
  let o2 = e2._gpNextArmorWheelHandler;
  for (let t3 of a2) if (t3?.on) {
    try {
      typeof t3.targetOff == `function` && t3.targetOff(e2);
    } catch {
    }
    t3.on(n2, o2, e2);
  }
  return true;
}
function R() {
  let e2 = w(...s.uiInGame), t2 = e2?.prototype;
  if (!t2 || t2._gpNextArmorWheelPatched) return !!t2;
  let n2 = t2._gameStart;
  if (typeof n2 != `function`) return false;
  t2._gpNextArmorWheelPatched = true, t2._gpNextOrigGameStart = n2;
  let r2 = t2.switchSBZombieAddArmor;
  return typeof r2 == `function` && (t2._gpNextOrigSwitchSBZombieAddArmor = r2, t2.switchSBZombieAddArmor = function(...e3) {
    let n3 = t2._gpNextOrigSwitchSBZombieAddArmor.apply(this, e3);
    return n3 && typeof n3.then == `function` ? n3.then((e4) => (L(this), e4), (e4) => {
      throw L(this), e4;
    }) : (L(this), n3);
  }), t2._gameStart = function(...e3) {
    let n3 = t2._gpNextOrigGameStart.apply(this, e3);
    return L(this), n3;
  }, L(e2.component || T(e2)), true;
}
function z() {
  let e2 = w(...s.animationController), t2 = w(...s.levelPlay, `LevelPlay`), n2 = e2?.prototype;
  if (!n2 || n2._gpNextSandboxPlantCostumePatched) return !!n2;
  let r2 = (e3, r3) => {
    let i2 = n2[e3];
    typeof i2 == `function` && (n2[`_gpNextOrig_${e3}`] = i2, n2[e3] = function(...e4) {
      if (!x() || !t2?.sandBoxModeOn || !t2?.gameStarted || M(this, `sandboxPlantCostume`, r3)) return i2.apply(this, e4);
    });
  };
  return r2(`rollCostumeUp`, 1), r2(`rollCostumeUpFree`, 1), r2(`rollCostumeDownFree`, -1), n2._gpNextSandboxPlantCostumePatched = true, true;
}
function B() {
  return { sandboxPlantCostume: z(), cards: P(), sandBoxZombieCards: F(), worldMapChooser: I(), sandboxArmor: R() };
}
function V() {
  g ||= (a(() => {
    B();
  }), true);
}
function getConfig() {
  return { ...m };
}
function applySettings(e2 = null) {
  let n2 = m.enabled;
  return m = b(e2 && typeof e2 == `object` ? { ...m, ...e2 } : getSettings().scrollSensitivity), n2 !== m.enabled && (_ = /* @__PURE__ */ new WeakMap()), getConfig();
}
function install() {
  if (h) return true;
  applySettings();
  let e2 = N();
  return B(), V(), h = true, o.info(e2 ? `Scroll sensitivity patch installed` : `Scroll sensitivity patch installed (discrete handlers only)`), e2;
}
export {
  applySettings,
  getConfig,
  install
};
