import { n } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
import { getSettings } from "../core/SettingsStore.js";
import { C as r, m as i, p as a, v as o } from "../ui/Translations.js";
var s = n({ applySettings: () => G, getConfig: () => W, install: () => K }), c = new t(`scroll-sensitivity`), l = Object.freeze({ animationController: [`chunks:///_virtual/AnimationController.ts`, `AnimationController`], cards: [`chunks:///_virtual/Cards.ts`, `Cards`], sandBoxZombieCards: [`chunks:///_virtual/SandBoxZombieCards.ts`, `SandBoxZombieCards`], worldMapChooser: [`chunks:///_virtual/WorldMapChooser.ts`, `WorldMapChooser`], uiInGame: [`chunks:///_virtual/UI.ts`, `UIInGame`], sandBoxLevelSettingWindow: [`chunks:///_virtual/SandBoxLevelSettingWindow.ts`, `SandBoxLevelSettingWindow`], levelPlay: [`chunks:///_virtual/levelController.ts`, `LevelPlay`] }), u = Object.freeze({ enabled: true, wheel: 1, discreteMinIntervalMs: 0 }), d = 60, f = 60, p = 180, m = 4, h = 10, g = { ...u }, _ = false, v = false, y = /* @__PURE__ */ new WeakMap();
function b(e2, t2, n2) {
  return Math.max(t2, Math.min(n2, e2));
}
function x(e2, t2, n2, r2 = 1) {
  let i2 = Number(e2);
  return !Number.isFinite(i2) || i2 < t2 ? r2 : b(i2, t2, n2);
}
function S(e2) {
  let t2 = e2 && typeof e2 == `object` ? e2 : {};
  return { enabled: t2.enabled !== false, wheel: x(t2.wheel, 0.05, 3, 1), discreteMinIntervalMs: Math.round(x(t2.discreteMinIntervalMs, 0, 400, 0)) };
}
function C() {
  return g.enabled !== false;
}
function w(e2) {
  return Number.isFinite(e2) ? e2 * g.wheel : e2;
}
function T(e2) {
  let t2 = y.get(e2);
  return t2 || (t2 = /* @__PURE__ */ Object.create(null), y.set(e2, t2)), t2;
}
function E(e2, t2, n2 = t2) {
  return o(e2, t2) || i(n2);
}
function D(e2) {
  let t2 = a()?.director?.getScene?.();
  if (!t2 || !e2 || typeof t2.getComponentInChildren != `function`) return null;
  try {
    return t2.getComponentInChildren(e2);
  } catch {
    return null;
  }
}
function O(e2) {
  let t2 = Number(e2?._gpNextRawScrollY);
  if (Number.isFinite(t2) && t2 !== 0) return t2 > 0 ? 1 : -1;
  let n2 = Number(e2?.getScrollY?.() || 0);
  return !Number.isFinite(n2) || n2 === 0 ? 0 : n2 > 0 ? 1 : -1;
}
function k(e2) {
  let t2 = Number(e2?._gpNextRawScrollY);
  if (Number.isFinite(t2) && t2 !== 0) return Math.abs(t2);
  let n2 = Number(e2?.getScrollY?.() || 0);
  return !Number.isFinite(n2) || n2 === 0 ? 0 : Math.abs(n2);
}
function A() {
  return d;
}
function j(e2) {
  return e2 > 0 && e2 < f;
}
function M(e2, t2, n2, r2, i2) {
  return i2 || t2 !== e2.lastDirection || !j(n2) || e2.lastAcceptedAt <= 0 || r2 - e2.lastAcceptedAt > p ? false : e2.momentumLocked && n2 <= e2.lastMagnitude + m ? true : e2.lastMagnitude > 0 && n2 <= e2.lastMagnitude + m && e2.lastMagnitude <= e2.prevMagnitude + m ? !(n2 > e2.lastMagnitude + h) : false;
}
function N(e2, t2, n2) {
  if (!e2) return 0;
  let r2 = O(n2);
  if (!r2) return 0;
  let i2 = T(e2), a2 = i2[t2] && typeof i2[t2] == `object` ? i2[t2] : { lastAcceptedAt: 0, lastEventAt: 0, lastDirection: 0, lastMagnitude: 0, prevMagnitude: 0, momentumLocked: false }, o2 = Date.now(), s2 = o2 - a2.lastEventAt > A(), c2 = k(n2);
  return (s2 || r2 !== a2.lastDirection) && (a2.momentumLocked = false), M(a2, r2, c2, o2, s2) ? (a2.momentumLocked = true, a2.prevMagnitude = a2.lastMagnitude, a2.lastMagnitude = c2, a2.lastEventAt = o2, a2.lastDirection = r2, i2[t2] = a2, 0) : a2.lastAcceptedAt > 0 && o2 - a2.lastAcceptedAt < g.discreteMinIntervalMs ? (a2.prevMagnitude = a2.lastMagnitude, a2.lastMagnitude = c2, a2.lastEventAt = o2, a2.lastDirection = r2, i2[t2] = a2, 0) : (a2.lastAcceptedAt = o2, a2.prevMagnitude = a2.lastMagnitude, a2.lastMagnitude = c2, a2.lastEventAt = o2, a2.lastDirection = r2, a2.momentumLocked = false, i2[t2] = a2, r2);
}
function P(e2, t2, n2 = 1) {
  if (!e2) return false;
  let r2 = T(e2), i2 = r2[t2] && typeof r2[t2] == `object` ? r2[t2] : { lastAcceptedAt: 0, lastEventAt: 0, lastDirection: 0, lastMagnitude: 0, prevMagnitude: 0, momentumLocked: false }, a2 = Date.now();
  return i2.lastEventAt = a2, i2.lastDirection = n2, i2.lastAcceptedAt > 0 && a2 - i2.lastAcceptedAt < g.discreteMinIntervalMs ? (r2[t2] = i2, false) : (i2.lastAcceptedAt = a2, i2.momentumLocked = false, r2[t2] = i2, true);
}
function F() {
  let e2 = (window.cc?.EventMouse || window.cc?.Event?.EventMouse)?.prototype;
  if (!e2) return c.warn(`EventMouse prototype not available \u2014 scroll sensitivity skipped`), false;
  if (e2._gpNextScrollPatched) return true;
  let t2 = false, n2 = e2.setScrollData;
  typeof n2 == `function` && (e2._gpNextOrigSetScrollData = n2, e2.setScrollData = function(t3, n3) {
    return this._gpNextRawScrollX = t3, this._gpNextRawScrollY = n3, C() ? e2._gpNextOrigSetScrollData.call(this, w(t3), w(n3)) : e2._gpNextOrigSetScrollData.call(this, t3, n3);
  }, t2 = true);
  let r2 = e2.getScrollX;
  typeof r2 == `function` && (e2._gpNextOrigGetScrollX = r2, e2.getScrollX = function() {
    if (!C()) return e2._gpNextOrigGetScrollX.call(this);
    let t3 = this._gpNextRawScrollX;
    return w(Number.isFinite(t3) ? t3 : e2._gpNextOrigGetScrollX.call(this));
  }, t2 = true);
  let i2 = e2.getScrollY;
  return typeof i2 == `function` && (e2._gpNextOrigGetScrollY = i2, e2.getScrollY = function() {
    if (!C()) return e2._gpNextOrigGetScrollY.call(this);
    let t3 = this._gpNextRawScrollY;
    return w(Number.isFinite(t3) ? t3 : e2._gpNextOrigGetScrollY.call(this));
  }, t2 = true), t2 ? (e2._gpNextScrollPatched = true, true) : (c.warn(`EventMouse scroll accessors not available \u2014 scroll sensitivity skipped`), false);
}
function I() {
  let e2 = E(...l.cards), t2 = E(...l.levelPlay, `LevelPlay`), n2 = E(...l.sandBoxLevelSettingWindow), r2 = e2?.prototype;
  if (!r2 || r2._gpNextDiscreteScrollPatched) return !!r2;
  let i2 = r2.onMouseScroll;
  return r2._gpNextDiscreteScrollPatched = true, r2._gpNextOrigOnMouseScroll = i2, r2.onMouseScroll = function(e3) {
    if (!C() || !t2?.sandBoxModeOn || !t2?.gameStarted || !this.CFs?.length) return typeof i2 == `function` ? i2.call(this, e3) : void 0;
    let r3 = N(this, `cards`, e3);
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
function L() {
  let e2 = E(...l.sandBoxZombieCards)?.prototype;
  if (!e2 || e2._gpNextDiscreteScrollPatched) return !!e2;
  let t2 = e2.onMouseScroll;
  return e2._gpNextDiscreteScrollPatched = true, e2._gpNextOrigOnMouseScroll = t2, e2.onMouseScroll = function(e3) {
    if (!C() || !this.zombieCards?.length) return typeof t2 == `function` ? t2.call(this, e3) : void 0;
    let n2 = N(this, `sandboxZombieCards`, e3);
    if (!n2) return;
    let r2 = (this.zombieCards[0]?.ID || 0) - n2;
    this.zombieCards.forEach((e4, t3) => {
      e4.cardGrouper(r2 + t3, false);
    });
  }, true;
}
function R() {
  let e2 = E(...l.worldMapChooser), t2 = e2?.prototype;
  if (!t2 || t2._gpNextDiscreteScrollPatched) return !!t2;
  let n2 = t2.onMouseWheel;
  t2._gpNextDiscreteScrollPatched = true, t2._gpNextOrigOnMouseWheel = n2, t2.onMouseWheel = function(e3) {
    if (!C()) return typeof n2 == `function` ? n2.call(this, e3) : void 0;
    let t3 = N(this, `worldMapChooser`, e3);
    t3 && this.moveBy(-t3);
  };
  let r2 = D(e2), i2 = r2?.wheelListener, o2 = a(), s2 = o2?.Input?.EventType?.MOUSE_WHEEL || o2?.Node?.EventType?.MOUSE_WHEEL;
  if (r2 && i2?.on && s2) {
    try {
      typeof i2.targetOff == `function` && i2.targetOff(r2);
    } catch {
    }
    i2.on(s2, r2.onMouseWheel, r2);
  }
  return true;
}
function z(e2) {
  let t2 = a(), n2 = t2?.Node?.EventType?.MOUSE_WHEEL || t2?.Input?.EventType?.MOUSE_WHEEL, r2 = e2?.SBZombieArmorIconSlot, i2 = [r2, r2?.parent].filter(Boolean);
  if (!n2 || !i2.length || !e2?.switchSBZombieAddArmor) return false;
  e2._gpNextArmorWheelHandler ||= function(t3) {
    if (t3.preventSwallow = true, !C()) {
      t3.getScrollY() > 0 ? e2.switchSBZombieAddArmor(-1) : t3.getScrollY() < 0 && e2.switchSBZombieAddArmor(1);
      return;
    }
    let n3 = N(e2, `sandboxZombieArmor`, t3);
    n3 && e2.switchSBZombieAddArmor(-n3);
  };
  let o2 = e2._gpNextArmorWheelHandler;
  for (let t3 of i2) if (t3?.on) {
    try {
      typeof t3.targetOff == `function` && t3.targetOff(e2);
    } catch {
    }
    t3.on(n2, o2, e2);
  }
  return true;
}
function B() {
  let e2 = E(...l.uiInGame), t2 = e2?.prototype;
  if (!t2 || t2._gpNextArmorWheelPatched) return !!t2;
  let n2 = t2._gameStart;
  if (typeof n2 != `function`) return false;
  t2._gpNextArmorWheelPatched = true, t2._gpNextOrigGameStart = n2;
  let r2 = t2.switchSBZombieAddArmor;
  return typeof r2 == `function` && (t2._gpNextOrigSwitchSBZombieAddArmor = r2, t2.switchSBZombieAddArmor = function(...e3) {
    let n3 = t2._gpNextOrigSwitchSBZombieAddArmor.apply(this, e3);
    return n3 && typeof n3.then == `function` ? n3.then((e4) => (z(this), e4), (e4) => {
      throw z(this), e4;
    }) : (z(this), n3);
  }), t2._gameStart = function(...e3) {
    let n3 = t2._gpNextOrigGameStart.apply(this, e3);
    return z(this), n3;
  }, z(e2.component || D(e2)), true;
}
function V() {
  let e2 = E(...l.animationController), t2 = E(...l.levelPlay, `LevelPlay`), n2 = e2?.prototype;
  if (!n2 || n2._gpNextSandboxPlantCostumePatched) return !!n2;
  let r2 = (e3, r3) => {
    let i2 = n2[e3];
    typeof i2 == `function` && (n2[`_gpNextOrig_${e3}`] = i2, n2[e3] = function(...e4) {
      if (!C() || !t2?.sandBoxModeOn || !t2?.gameStarted || P(this, `sandboxPlantCostume`, r3)) return i2.apply(this, e4);
    });
  };
  return r2(`rollCostumeUp`, 1), r2(`rollCostumeUpFree`, 1), r2(`rollCostumeDownFree`, -1), n2._gpNextSandboxPlantCostumePatched = true, true;
}
function H() {
  return { sandboxPlantCostume: V(), cards: I(), sandBoxZombieCards: L(), worldMapChooser: R(), sandboxArmor: B() };
}
function U() {
  v ||= (r(() => {
    H();
  }), true);
}
function W() {
  return { ...g };
}
function G(e2 = null) {
  let t2 = g.enabled;
  return g = S(e2 && typeof e2 == `object` ? { ...g, ...e2 } : getSettings().scrollSensitivity), t2 !== g.enabled && (y = /* @__PURE__ */ new WeakMap()), W();
}
function K() {
  if (_) return true;
  G();
  let e2 = F();
  return H(), U(), _ = true, c.info(e2 ? `Scroll sensitivity patch installed` : `Scroll sensitivity patch installed (discrete handlers only)`), e2;
}
export {
  s as n,
  G as t
};
