import { n as e, r as t, t as n } from "../../runtime/TrainerShortcuts.js";
import { getSettings } from "../../core/SettingsStore.js";
import { b as i, c as a, d as o, m as s, o as c, p as l, v as u } from "../Translations.js";
import { f as d, i as f, l as p, n as m, r as h, s as ee, t as g, u as _ } from "../Components.js";
import { n as v } from "../Toast.js";
function te(e2, t2) {
  let n2 = e2?.prototype, r2 = n2?.addEvolvedPlant;
  if (typeof r2 != `function`) throw Error(`Evolution limit hook unavailable`);
  let i2 = true;
  function a2(e3, ...n3) {
    if (!i2 || !t2()) return r2.call(this, e3, ...n3);
    let a3 = Object.getOwnPropertyDescriptor(e3, `MaxCount`);
    try {
      return e3.MaxCount = 1 / 0, r2.call(this, e3, ...n3);
    } finally {
      a3 ? Object.defineProperty(e3, "MaxCount", a3) : delete e3.MaxCount;
    }
  }
  return n2.addEvolvedPlant = a2, () => {
    i2 = false, n2.addEvolvedPlant === a2 && (n2.addEvolvedPlant = r2);
  };
}
var y = Object.freeze({ sun: `SunCount`, coin: `CoinCount`, gem: `GemCount`, sprout: `SproutCount`, ticket: `TicketCount`, worldkey: `WorldKeyCount` });
function ne(e2, t2) {
  let n2 = /* @__PURE__ */ new Map(), r2 = () => e2.getAllPlayerProperties()?.currentPlayer, i2 = () => e2.getCc()?.director?.getScene(), a2 = (e3) => e3?.node?.isValid === true, o2 = (e3) => n2.get(e3.kind) === e3 && t2() && r2() === e3.player && (e3.kind !== `sun` || i2() === e3.scene && a2(e3.component));
  function s2(e3) {
    let t3 = n2.get(e3);
    if (t3) {
      n2.delete(e3);
      for (let e4 of t3.restore.reverse()) e4();
    }
  }
  function c2() {
    for (let [e3, t3] of n2) o2(t3) || s2(e3);
  }
  function l2(e3, t3, n3) {
    let r3 = Object.getOwnPropertyDescriptor(t3, n3) ?? (e3.kind !== `sun` && !(n3 in t3) ? { value: 0, writable: true, configurable: true, enumerable: true } : null);
    if (!r3?.configurable || !r3.writable || !(`value` in r3)) throw Error(`Unsupported resource field`);
    let i3 = r3.value, a3 = () => i3;
    Object.defineProperty(t3, n3, { configurable: true, enumerable: r3.enumerable, get: a3, set: (t4) => {
      i3 = o2(e3) ? e3.value : t4;
    } }), e3.restore.push(() => {
      Object.getOwnPropertyDescriptor(t3, n3)?.get === a3 && Object.defineProperty(t3, n3, { ...r3, value: i3 });
    });
  }
  function u2(e3, t3) {
    let n3 = t3.prototype, r3 = Object.getOwnPropertyDescriptor(n3, `value`), i3 = n3;
    for (; i3 && !Object.getOwnPropertyDescriptor(i3, `value`); ) i3 = Object.getPrototypeOf(i3);
    let a3 = i3 && Object.getOwnPropertyDescriptor(i3, `value`);
    if (!a3?.get || !a3.set) throw Error(`Unsupported currency setter`);
    let s3 = function(t4) {
      a3.set.call(this, o2(e3) ? e3.value : t4);
    };
    Object.defineProperty(n3, "value", { ...a3, configurable: true, set: s3 }), e3.restore.push(() => {
      Object.getOwnPropertyDescriptor(n3, `value`)?.set === s3 && (r3 ? Object.defineProperty(n3, "value", r3) : delete n3.value);
    });
  }
  return { refresh: c2, stop: s2, clear() {
    for (let e3 of [...n2.keys()]) s2(e3);
  }, active(e3) {
    return c2(), e3 ? n2.has(e3) : n2.size > 0;
  }, value(e3) {
    return c2(), n2.get(e3)?.value;
  }, set(r3, o3) {
    if (c2(), !Object.hasOwn(y, r3) || !t2() || !Number.isSafeInteger(o3) || o3 < 0 || o3 > (r3 === `sun` ? 99999 : 9999999)) return false;
    let d2 = e2.getAllPlayerProperties();
    if (!d2?.currentPlayer || typeof d2.savePP != `function`) return false;
    let f2 = e2.getClassByName(y[r3]);
    if (!f2 || r3 === `sun` && (i2()?.name !== `inGameScene` || !a2(f2.component))) return false;
    s2(r3);
    let p2 = { kind: r3, value: o3, player: d2.currentPlayer, scene: i2(), component: f2.component, restore: [] };
    n2.set(r3, p2);
    try {
      if (r3 === `sun`) {
        for (let e3 of [`CurrentValue`, `TargetValue`, `ShownValue`]) l2(p2, p2.component, e3);
        p2.component.setSunCount(o3), p2.component.JudgeCardAffordable();
      } else u2(p2, f2), l2(p2, p2.player, r3), p2.player[r3] = o3, a2(f2.component) ? f2.component.value = o3 : d2.savePP();
      return true;
    } catch {
      return s2(r3), false;
    }
  } };
}
var re = /* @__PURE__ */ new Set([`gravestone_tutorial`, `gravestone_egypt`, `gravestone_pirate`, `gravestone_cowboy`, `gravestone_future`, `gravestone_dark`, `gravestoneSunOnDestruction`, `gravestonePlantfoodOnDestruction`, `gravestone_iceage`, `gravestone_lostcity`]);
function b() {
  try {
    let e2 = JSON.parse(localStorage.getItem(`PvZ2_Settings`));
    return typeof e2?.AllowCheats == `boolean` ? e2.AllowCheats : e2?.AllowCheat === true;
  } catch {
    return false;
  }
}
var x = (e2) => e2?.node?.isValid && e2.node.activeInHierarchy !== false && e2.dead !== true, S = (e2) => ({ ok: false, reason: e2 });
function C(e2 = a) {
  let t2 = (t3, n3) => e2.getModuleExport(`chunks:///_virtual/${t3}.ts`, n3);
  function n2() {
    if (!b()) return null;
    let n3 = e2.getCc()?.director?.getScene(), r3 = t2(`levelController`, `LevelPlay`), i3 = r3?.component;
    return n3?.name !== `inGameScene` || !x(i3) || !r3.gameStarted || !r3.gaming ? null : { scene: n3, Level: r3, level: i3 };
  }
  function r2(e3) {
    let t3 = n2();
    return t3 && t3.scene === e3.scene && t3.level === e3.level;
  }
  function i2(t3, i3) {
    let a2 = n2();
    if (!a2) return S(`context`);
    let o3 = e2.getClassByName(t3);
    if (!o3) return S(`unavailable`);
    let s3 = 0;
    try {
      for (let e3 of a2.scene.getComponentsInChildren(o3)) {
        if (!r2(a2)) return S(`context`);
        x(e3) && i3(e3) && s3++;
      }
      return { ok: true, count: s3 };
    } catch {
      return S(`failed`);
    }
  }
  function o2() {
    let t3 = n2(), r3 = e2.getClassByName(`Cards`)?.component;
    return !t3 || !x(r3) || !r3.gameStarted || !Array.isArray(r3.cardsUIUpper) || t3.Level.isBeghouled || t3.level.conveyor ? null : { ...t3, cards: r3 };
  }
  function s2() {
    let n3 = t2(`Plants`, `plants`), r3 = t2(`Plants`, `PlantEnum`), i3 = e2.getClassByName(`MultiLanguage`);
    if (!n3 || !Number.isInteger(r3?.amount)) return [];
    let a2 = [];
    for (let e3 = 0; e3 < r3.amount; e3++) {
      let t3 = n3.getPlantFeature(e3);
      !t3?.CODENAME || t3.CODENAME === `imitater` || !t3.RES?.Plant || !t3._CARDSPRITENAME || n3.getPlantEnumByCodename(t3.CODENAME, false) === e3 && a2.push({ value: t3.CODENAME, label: i3?.getString?.(t3.NAME, false) || t3.CODENAME });
    }
    return a2;
  }
  function c2() {
    let e3 = o2();
    return e3 ? e3.cards.CFs.flatMap((t3, n3) => {
      let r3 = e3.cards.cardsUIUpper[n3];
      return !x(t3) || !x(r3) || r3.cf !== t3 || !r3.coolShadow ? [] : [{ index: n3, card: t3, upper: r3, scene: e3.scene, level: e3.level, cards: e3.cards, type: t3.Type }];
    }) : [];
  }
  return { plantChoices: s2, slots: c2, clearGravestones() {
    let e3 = t2(`Tombs`, `TombEnum`);
    return i2(`Tomb`, (t3) => !re.has(e3?.[t3.ID]) || typeof t3.die != `function` ? false : (t3.die(), true));
  }, healPlants() {
    return i2(`Plant`, (e3) => !e3.plantInLnC?.isInLawn?.() || !(e3.health > 0) || !Number.isFinite(e3.toughness) || e3.health >= e3.toughness || typeof e3.heal != `function` ? false : (e3.heal(e3.toughness - e3.health), true));
  }, async replaceCard(e3, n3) {
    let r3 = o2(), i3 = t2(`Plants`, `plants`), a2 = () => {
      let t3 = o2();
      return t3 && t3.scene === e3?.scene && t3.level === e3.level && t3.cards === e3.cards && x(e3.card) && x(e3.upper) && t3.cards.CFs[e3.index] === e3.card && t3.cards.cardsUIUpper[e3.index] === e3.upper && e3.upper.cf === e3.card && e3.card.Type === e3.type;
    };
    if (!r3 || !a2()) return S(`context`);
    if (!s2().some((e4) => e4.value === n3)) return S(`unavailable`);
    let c3 = i3.getPlantFeature(i3.getPlantEnumByCodename(n3, false)), l2 = i3.getPlantEnumWithPropByPlantTypes;
    try {
      return await i3.loadPlantsInCardByType(n3), !a2() || t2(`Plants`, `plants`) !== i3 || i3.getPlantEnumWithPropByPlantTypes !== l2 || i3.getPlantFeature(i3.getPlantEnumByCodename(n3, false)) !== c3 ? S(`context`) : (r3.cards.ui.tryChangingIndex(-1), e3.card.isImitater = false, e3.card.FORCE_BOOSTED = e3.card.PP_BOOSTED = false, e3.card.CooldownFrom = 1, e3.card.cardGrouperByType(n3), e3.upper.coolStart(1), e3.upper.cardUpdate(0), r3.cards.JudgeSelection(), { ok: true, count: 1 });
    } catch {
      return S(`failed`);
    }
  } };
}
var w = C(), T = null, E = null, D = null, O = null, k = null, A = null, j = null, M = null, N = [], P = /* @__PURE__ */ new Map();
function ie() {
  return Q.active() || T !== null || I.freePlant || I.invincible || I.noCooldown || I.freePF || I.autoCollect || I.freeBuy || I._origBuy !== null || I._origCostumeBuy !== null || I._origSunDec !== null || I._origCoolStart !== null || I._origPFDec !== null;
}
function F() {
  O ||= setInterval(() => {
    Q.refresh(), ie() && Ne(), ie() && !_isCheatAllowed() && he();
  }, 1500);
}
function onActivate() {
  F(), D && clearInterval(D), me(), D = setInterval(() => {
    let e2 = _isCheatAllowed(), t2 = z(), n2 = l(), r2 = n2 && n2.director?.getScene()?.name || null, i2 = t2 !== A;
    if ((e2 !== k || i2 || r2 !== j) && E && (i2 && (t2 ? U() : W()), k = e2, A = t2, j = r2, E.innerHTML = ``, render(E)), _refreshPlayerTools(), E) for (let [e3, t3] of P) {
      if (!t3 || !document.body.contains(t3)) {
        P.delete(e3);
        continue;
      }
      if (document.activeElement === t3) continue;
      let n3 = e3.indexOf(`:`), r3 = Y(e3.slice(0, n3), e3.slice(n3 + 1));
      String(t3.value) !== String(r3) && (t3.value = r3);
    }
  }, 1500);
}
function onDeactivate() {
  D &&= (clearInterval(D), null), P.clear();
}
function createCheatsTab() {
  return initializeShortcuts(), { render(e2) {
    let t2 = document.createElement(`div`);
    e2.appendChild(t2), render(t2);
  }, onActivate, onDeactivate };
}
var I = { freePlant: false, invincible: false, noCooldown: false, freePF: false, autoCollect: false, freeBuy: false, timeStop: false, _origSunDec: null, _origCoolStart: null, _origCoolDown: null, _origPFDec: null, _origBuy: null, _origCostumeBuy: null, _autoCollectInterval: null, _origTimeScale: 1 };
function ce(e2) {
  if (I.freePlant !== e2) if (I.freePlant = e2, z()) {
    let t2 = s(`SunCount`);
    I._origSunDec && t2 && (t2.prototype.SunDec = I._origSunDec, I._origSunDec = null), V(`_freePlant`, `reverseFreePlant`, e2);
  } else {
    let t2 = s(`SunCount`);
    if (!t2) return;
    e2 ? (I._origSunDec = t2.prototype.SunDec, t2.prototype.SunDec = function() {
    }) : I._origSunDec &&= (t2.prototype.SunDec = I._origSunDec, null);
  }
}
function le(e2) {
  if (I.freePF !== e2) if (I.freePF = e2, z()) {
    let t2 = s(`PlantFoodCount`);
    I._origPFDec && t2 && (t2.prototype.plantFoodDec = I._origPFDec, I._origPFDec = null), V(`_freePF`, `reverseFreePF`, e2);
  } else {
    let t2 = s(`PlantFoodCount`);
    if (!t2) return;
    e2 ? (I._origPFDec = t2.prototype.plantFoodDec, t2.prototype.plantFoodDec = function() {
    }) : I._origPFDec &&= (t2.prototype.plantFoodDec = I._origPFDec, null);
  }
}
function ue(e2) {
  if (I.autoCollect === e2) return;
  I.autoCollect = e2;
  let t2 = l();
  t2 && (e2 ? I._autoCollectInterval = setInterval(() => {
    if (K() !== `inGameScene`) return;
    let e3 = t2.js.getClassByName(`dropping`), n2 = t2.js.getClassByName(`sunbomb`), r2 = t2.director?.getScene();
    !r2 || !e3 || r2.getComponentsInChildren(e3).forEach((e4) => {
      n2 && e4 instanceof n2 || e4.collected || e4.collect();
    });
  }, 300) : I._autoCollectInterval &&= (clearInterval(I._autoCollectInterval), null));
}
function de(e2) {
  if (I.invincible === e2) return;
  I.invincible = e2;
  let t2 = s(`Plant`);
  t2 && (e2 ? (t2.prototype._gpOrigDealDamage = t2.prototype.dealDamage, t2.prototype.dealDamage = function() {
    return this.health;
  }) : t2.prototype._gpOrigDealDamage && (t2.prototype.dealDamage = t2.prototype._gpOrigDealDamage, delete t2.prototype._gpOrigDealDamage));
}
function fe(e2) {
  if (I.noCooldown !== e2) if (I.noCooldown = e2, z()) {
    let t2 = s(`CardUIUpper`);
    t2 && (I._origCoolStart && (t2.prototype.coolStart = I._origCoolStart), I._origCoolDown && (t2.prototype.coolDown = I._origCoolDown), I._origCoolStart = null, I._origCoolDown = null), V(`_noCDPlant`, `reverseNoCDPlant`, e2);
  } else {
    let t2 = s(`CardUIUpper`);
    if (!t2) return;
    if (e2) {
      I._origCoolStart = t2.prototype.coolStart, I._origCoolDown = t2.prototype.coolDown, t2.prototype.coolStart = function() {
      };
      let e3 = I._origCoolDown;
      t2.prototype.coolDown = function(t3) {
        this.CD = 0, e3.call(this, 0);
      };
    } else I._origCoolStart && (t2.prototype.coolStart = I._origCoolStart), I._origCoolDown && (t2.prototype.coolDown = I._origCoolDown), I._origCoolStart = null, I._origCoolDown = null;
  }
}
function L() {
  return s(`SandBoxLevelSettingWindow`);
}
function R() {
  let e2 = L();
  return e2?.cp ? e2.cp.node?.isValid ? e2.cp : (e2.cp = null, null) : null;
}
function z() {
  let e2 = l();
  return !e2 || e2.director?.getScene()?.name !== `inGameScene` || !L() ? false : R() ? true : pe();
}
function pe() {
  try {
    let e2 = l();
    if (!e2) return false;
    let t2 = e2.js.getClassByName(`levelController`);
    if (!t2) return false;
    let n2 = e2.director.getScene()?.getComponentInChildren(t2);
    if (!n2) return false;
    let r2 = n2.levelNameString;
    return !!r2 && String(r2).toLowerCase().startsWith(`sandbox`);
  } catch {
    return false;
  }
}
function me() {
  let e2 = s(`SandBoxLevelSettingWindow`);
  if (!e2 || e2._gpHooked) return;
  let t2 = e2.prototype.onLoad;
  e2.prototype.onLoad = function() {
    e2.cp = this, t2 && t2.call(this);
  }, e2._gpHooked = true;
}
function B(e2) {
  let t2 = L();
  return t2 ? t2[e2] ?? false : false;
}
function V(e2, t2, n2) {
  let r2 = L(), i2 = R();
  if (!i2) {
    r2 && (r2[e2] = n2);
    return;
  }
  (r2[e2] ?? false) !== n2 && i2[t2]();
}
function H() {
  let e2 = s(`SunCount`);
  I._origSunDec && e2 && (e2.prototype.SunDec = I._origSunDec, I._origSunDec = null);
  let t2 = s(`PlantFoodCount`);
  I._origPFDec && t2 && (t2.prototype.plantFoodDec = I._origPFDec, I._origPFDec = null);
  let n2 = s(`CardUIUpper`);
  n2 && (I._origCoolStart && (n2.prototype.coolStart = I._origCoolStart), I._origCoolDown && (n2.prototype.coolDown = I._origCoolDown), I._origCoolStart = null, I._origCoolDown = null);
}
function he() {
  Q.clear(), z() && (V(`_freePlant`, `reverseFreePlant`, false), V(`_noCDPlant`, `reverseNoCDPlant`, false), V(`_freePF`, `reverseFreePF`, false)), T?.(), T = null, H();
  let e2 = s(`Plant`);
  e2?.prototype._gpOrigDealDamage && (e2.prototype.dealDamage = e2.prototype._gpOrigDealDamage, delete e2.prototype._gpOrigDealDamage);
  let t2 = s(`StoreCommodity`);
  I._origBuy && t2 && (t2.prototype.buy = I._origBuy, I._origBuy = null);
  let n2 = s(`StoreCostumeSeller`);
  I._origCostumeBuy && n2 && (n2.prototype.buy = I._origCostumeBuy, I._origCostumeBuy = null), I._autoCollectInterval &&= (clearInterval(I._autoCollectInterval), null), I.freePlant = false, I.invincible = false, I.noCooldown = false, I.freePF = false, I.autoCollect = false, I.freeBuy = false;
}
function U() {
  H();
  let e2 = L();
  e2 && (R() ? (V(`_freePlant`, `reverseFreePlant`, true), V(`_noCDPlant`, `reverseNoCDPlant`, true), V(`_freePF`, `reverseFreePF`, true)) : (e2._freePlant = true, e2._noCDPlant = true, e2._freePF = true)), I.freePlant = true, I.noCooldown = true, I.freePF = true;
}
function W() {
  H(), I.freePlant = false, I.noCooldown = false, I.freePF = false;
  let e2 = L();
  e2 && (e2._freePlant = false, e2._noCDPlant = false, e2._freePF = false);
}
function ge() {
  return s(`SunCount`)?.component;
}
function G() {
  return s(`PlantFoodCount`)?.component;
}
function _e() {
  let e2 = l();
  if (!e2) return null;
  let t2 = e2.js.getClassByName(`levelController`);
  return t2 ? e2.director.getScene()?.getComponentInChildren(t2) ?? null : null;
}
function K() {
  let e2 = l();
  return e2 && e2.director?.getScene()?.name || null;
}
function ve(e2) {
  let t2 = document.createElement(`div`);
  return t2.className = `gp-input-label`, t2.textContent = e2, t2;
}
function ye(e2) {
  if (!e2?.node?.isValid) return false;
  let t2 = e2?.constructor?.name || ``, n2 = e2?.node?.name || ``, r2 = e2?.node?.path || ``;
  return /zombie|undead|walker|zmb/i.test(t2) || /zombie|undead|walker|zmb/i.test(n2) || /zombie|undead|walker|zmb/i.test(r2) ? typeof e2.playDie == `function` || typeof e2.judgeDeath == `function` || typeof e2.kill == `function` || Number.isFinite(e2?.health) || Number.isFinite(e2?._health) : false;
}
function be() {
  let e2 = l(), t2 = e2?.director?.getScene();
  if (!e2 || !t2) return [];
  let n2 = [], r2 = /* @__PURE__ */ new Set(), i2 = (e3) => {
    if (!e3?.node?.isValid) return;
    let t3 = e3.node.uuid || e3.uuid || `${e3.constructor?.name}:${e3.node.name}`;
    r2.has(t3) || (r2.add(t3), n2.push(e3));
  }, a2 = u(`chunks:///_virtual/Zombie.ts`, `Zombie`);
  if (a2) try {
    (t2.getComponentsInChildren(a2) || []).forEach(i2);
  } catch {
  }
  if (n2.length === 0) try {
    (t2.getComponentsInChildren(e2.Component) || []).filter(ye).forEach(i2);
  } catch {
  }
  return n2.filter((e3) => {
    if (!e3?.node?.isValid || e3.dead === true) return false;
    if (typeof e3.isAlive == `function`) try {
      return e3.isAlive();
    } catch {
      return true;
    }
    return true;
  });
}
function xe(e2) {
  if (!e2?.node?.isValid || e2.dead === true) return false;
  if (typeof e2.isAlive == `function`) try {
    if (!e2.isAlive()) return false;
  } catch {
  }
  try {
    if (typeof e2.playDie == `function`) return e2.playDie(), true;
    if (typeof e2.kill == `function`) return e2.kill(), true;
    if (`health` in e2 && (e2.health = 0), `_health` in e2 && (e2._health = 0), typeof e2.judgeDeath == `function`) return e2.judgeDeath(0), true;
    if (typeof e2.die == `function`) return e2.die(), true;
  } catch {
  }
  return false;
}
function Se() {
  let e2 = be(), t2 = 0;
  return e2.forEach((e3) => {
    xe(e3) && t2++;
  }), t2;
}
var _isCheatAllowed = b;
function _renderPlayerTools(e2) {
  M = document.createElement(`div`), e2.appendChild(M), N = w.slots(), Te(M, N);
}
function _refreshPlayerTools() {
  if (!M) return;
  let e2 = w.slots();
  e2.length === N.length && e2.every((e3, t2) => {
    let n2 = N[t2];
    return e3.card === n2.card && e3.upper === n2.upper && e3.scene === n2.scene && e3.level === n2.level && e3.cards === n2.cards && e3.type === n2.type;
  }) || (N = e2, M.replaceChildren(), Te(M, e2));
}
function Te(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.setAttribute(`role`, `status`), n2.hidden = true;
  let r2 = (e3) => {
    n2.hidden = false, n2.textContent = e3.ok ? c(`cheats.actionDone`, e3.count) : c(`cheats.action.${e3.reason}`);
  }, i2 = [h(m(c(`cheats.clearGravestones`), () => r2(w.clearGravestones())), m(c(`cheats.healPlants`), () => r2(w.healPlants()), { variant: `success` }))], a2 = w.plantChoices();
  if (t2.length && a2.length) {
    let e3 = t2[0], n3 = a2[0].value;
    i2.push(_(c(`cheats.cardSlot`), t2.map((e4) => ({ value: String(e4.index), label: String(e4.index + 1) })), String(e3.index), (n4) => {
      e3 = t2.find((e4) => e4.index === Number(n4));
    })), i2.push(_(c(`cheats.plant`), a2, n3, (e4) => {
      n3 = e4;
    }));
    let o2 = m(c(`cheats.replaceCard`), async () => {
      o2.disabled = true;
      let t3 = await w.replaceCard(e3, n3);
      r2(t3), t3.ok && (e3.type = e3.card.Type), o2.disabled = false;
    });
    i2.push(o2);
  }
  i2.push(n2), e2.appendChild(p(c(`cheats.battleTools`), i2));
}
function render(e2) {
  if (M = null, E = e2, !i()) {
    e2.appendChild(f(c(`header.status.waiting`)));
    return;
  }
  if (!_isCheatAllowed()) {
    k = false, he();
    let t3 = f(c(`cheats.allowCheatRequired`));
    t3.style.color = `var(--gp-warning, #ff9800)`, e2.appendChild(t3);
    return;
  }
  k = true;
  let t2 = K(), n2 = z();
  if (A !== null && n2 !== A && (n2 ? U() : W()), A = n2, j = t2, t2 === `inGameScene`) Ee(e2, n2);
  else if (t2 === `worldMapScene`) De(e2);
  else if (t2 === `storeScene`) Oe(e2);
  else if (t2 === `zenGardenScene`) ke(e2);
  else {
    let t3 = f(c(`cheats.unsupportedScene`));
    t3.style.color = `var(--gp-warning, #ff9800)`, t3.style.marginTop = `12px`, e2.appendChild(t3);
  }
}
function Ee(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.style.cssText = `margin-bottom:8px;`, t2 ? n2.appendChild(g(c(`cheats.sandboxMode`), `success`)) : n2.appendChild(g(c(`cheats.normalLevel`), `primary`)), e2.appendChild(n2);
  let r2 = ee(c(`cheats.sun`), Q.value(`sun`) ?? 0, (e3) => {
  }, { min: 0, max: 99999, step: 50 }), i2 = m(c(`cheats.setSun`), () => {
    let e3 = ge(), t3 = r2._getInput();
    if (e3 && t3) {
      let n3 = Number(t3.value);
      Q.active(`sun`) ? Q.set(`sun`, n3) : e3.setSunCount(n3);
    }
  }, { small: true }), a2 = m(c(`cheats.addSun200`), () => $(200), { small: true, variant: `success` }), o2 = m(c(`cheats.addSun500`), () => $(500), { small: true, variant: `success` }), u2 = m(c(`cheats.addSun`), () => $(1e3), { small: true, variant: `success` }), f2 = m(c(`cheats.addSun5000`), () => $(5e3), { small: true, variant: `success` }), _2 = t2 ? B(`_freePlant`) : I.freePlant;
  I.freePlant = _2;
  let y2 = d(c(`cheats.freePlant`), _2, ce), ne2 = m(`+1`, () => {
    let e3 = G();
    e3 && e3.plantFoodAdd();
  }, { small: true }), re2 = m(c(`cheats.fillPlantFood`), () => {
    let e3 = G();
    e3 && e3.setPlantFoodNum(e3.maxCount);
  }, { small: true, variant: `success` }), b2 = m(c(`cheats.clearPlantFood`), () => {
    let e3 = G();
    e3 && e3.setPlantFoodNum(0);
  }, { small: true, variant: `danger` }), x2 = t2 ? B(`_freePF`) : I.freePF;
  I.freePF = x2;
  let S2 = d(c(`cheats.freePF`), x2, le);
  _renderPlayerTools(e2);
  let C2 = m(c(`cheats.restoreMowers`), () => {
    let e3 = l();
    if (!e3) return;
    let t3 = e3.js.getClassByName(`levelController`);
    if (!t3) return;
    let n3 = e3.director?.getScene()?.getComponentInChildren(t3);
    n3 && typeof n3.spawnMowers == `function` && n3.spawnMowers();
  }, { variant: `success` });
  t2 && (C2.disabled = true, C2.title = c(`cheats.restoreMowersSandboxDisabled`), C2.style.opacity = `0.45`);
  let w2 = d(c(`cheats.autoCollect`), I.autoCollect, ue), E2 = m(c(`cheats.instantWin`), () => {
    let e3 = _e();
    e3 && e3.victory();
  }, { variant: `success` });
  t2 && (E2.disabled = true, E2.title = c(`cheats.instantWinSandboxDisabled`), E2.style.opacity = `0.45`), e2.appendChild(p(c(`cheats.level`), [w2, C2, E2])), e2.appendChild(p(c(`cheats.resources`), [r2, h(i2, a2, o2, u2, f2), Me(`sun`, r2._getInput()), y2, ve(c(`cheats.plantFood`)), h(ne2, re2, b2), S2]));
  let D2 = d(c(`cheats.invincible`), I.invincible, de), O2 = t2 ? B(`_noCDPlant`) : I.noCooldown;
  I.noCooldown = O2;
  let k2 = d(c(`cheats.noCooldown`), O2, fe), A2 = d(c(`cheats.unlimitedFusion`), T !== null, (e3) => {
    try {
      e3 ? T ||= te(s(`levelController`), _isCheatAllowed) : (T?.(), T = null);
    } catch {
      A2._setValue(false), v(c(`common.failed`), `error`);
    }
  });
  e2.appendChild(p(c(`cheats.plant`), [D2, k2, A2]));
  let j2 = m(c(`cheats.killAllZombies`), () => {
    Se();
  }, { variant: `danger` });
  e2.appendChild(p(c(`cheats.zombie`), [j2]));
  let M2 = m(c(`cheats.resetSpeed`), () => {
    let e3 = s(`UIInGame`);
    e3?.component && e3.component.s2xButton && e3.component.s2xButton.normalSprite === e3.component.pressed2x && e3.component.speedUp(false);
  }, { small: true }), N2 = m(c(`cheats.speed2x`), () => {
    let e3 = s(`UIInGame`);
    e3?.component && e3.component.s2xButton && e3.component.s2xButton.normalSprite !== e3.component.pressed2x && e3.component.speedUp(false);
  }, { small: true });
  e2.appendChild(p(c(`cheats.gameSpeed`), [h(M2, N2)]));
}
var Y = (e2, t2) => {
  let n2 = s(t2);
  if (n2?.component) return n2.component._value ?? 0;
  try {
    let t3 = localStorage.getItem(`PvZ2_PlayerProperties`);
    if (t3) {
      let n3 = JSON.parse(t3);
      if (Array.isArray(n3) && n3.length > 0) return n3[0][e2] ?? 0;
    }
  } catch {
  }
  return 0;
}, X = (e2, t2, n2) => {
  if (Q.active(e2)) return Q.set(e2, t2);
  let r2 = s(n2);
  if (r2?.component) {
    r2.component.value = t2;
    return;
  }
  try {
    let n3 = localStorage.getItem(`PvZ2_PlayerProperties`);
    if (n3) {
      let r3 = JSON.parse(n3);
      Array.isArray(r3) && r3.length > 0 && (r3[0][e2] = t2, localStorage.setItem(`PvZ2_PlayerProperties`, JSON.stringify(r3)));
    }
  } catch {
  }
};
function Z(e2, t2, n2, r2, i2, a2) {
  let o2 = t2 === `coin` ? [1e3, 5e3, 1e4, 5e4, 1e5] : [`sprout`, `worldkey`].includes(t2) ? [1, 5, 10, 50, 100] : [50, 100, 500, 1e3, 5e3], s2 = t2 === `coin` ? [`cheats.add1000`, `cheats.add5000`, `cheats.add10000`, `cheats.add50000`, `cheats.add100000`] : [`sprout`, `worldkey`].includes(t2) ? [`cheats.add1`, `cheats.add5`, `cheats.add10`, `cheats.add50`, `cheats.add100`] : [`cheats.add50`, `cheats.add100`, `cheats.add500`, `cheats.add1000`, `cheats.add5000`], l2 = ee(r2, Y(t2, n2), () => {
  }, { min: 0, max: 9999999, step: [`sprout`, `worldkey`].includes(t2) ? 1 : 100 }), u2 = l2.querySelector(`input`);
  P.set(`${t2}:${n2}`, u2);
  let d2 = m(i2, () => {
    u2 && X(t2, Number(u2.value), n2);
  }, { small: true }), f2 = m(a2, () => {
    X(t2, 0, n2), u2 && (u2.value = 0);
  }, { small: true, variant: `danger` }), g2 = o2.map((e3, r3) => m(c(s2[r3]), () => {
    let r4 = Y(t2, n2) + e3;
    X(t2, r4, n2), u2 && (u2.value = r4);
  }, { small: true, variant: `success` }));
  e2.appendChild(p(r2, [l2, h(d2, f2), h(...g2), Me(t2, u2)]));
}
function De(e2) {
  let t2 = document.createElement(`div`);
  t2.style.cssText = `margin-bottom:8px;`, t2.appendChild(g(c(`cheats.worldMap`), `warning`)), e2.appendChild(t2), Z(e2, `coin`, `CoinCount`, c(`cheats.coins`), c(`cheats.setCoins`), c(`cheats.clearCoins`)), Z(e2, `gem`, `GemCount`, c(`cheats.gems`), c(`cheats.setGems`), c(`cheats.clearGems`)), Z(e2, `worldkey`, `WorldKeyCount`, c(`cheats.worldKeys`), c(`cheats.setWorldKeys`), c(`cheats.clearGems`));
}
function Oe(e2) {
  let t2 = document.createElement(`div`);
  t2.style.cssText = `margin-bottom:8px;`, t2.appendChild(g(c(`cheats.storeScene`), `warning`)), e2.appendChild(t2), Z(e2, `coin`, `CoinCount`, c(`cheats.coins`), c(`cheats.setCoins`), c(`cheats.clearCoins`)), Z(e2, `gem`, `GemCount`, c(`cheats.gems`), c(`cheats.setGems`), c(`cheats.clearGems`)), Z(e2, `ticket`, `TicketCount`, c(`cheats.tickets`), c(`cheats.setTickets`), c(`cheats.clearGems`));
  let n2 = d(c(`cheats.freeBuy`), I.freeBuy, (e3) => {
    I.freeBuy = e3;
    let t3 = s(`StoreCommodity`), n3 = s(`StoreCostumeSeller`);
    e3 ? (t3 && (I._origBuy = t3.prototype.buy, t3.prototype.buy = function() {
      this.soldout || this.unlockCommodity();
    }), n3 && (I._origCostumeBuy = n3.prototype.buy, n3.prototype.buy = function() {
      this.soldout ||= (this.unlockCommodity(), true);
    })) : (I._origBuy && t3 && (t3.prototype.buy = I._origBuy, I._origBuy = null), I._origCostumeBuy && n3 && (n3.prototype.buy = I._origCostumeBuy, I._origCostumeBuy = null));
  }), r2 = m(c(`cheats.refreshCostume`), () => {
    let e3 = o();
    e3?.currentPlayer?.date && (e3.currentPlayer.date.date = -1), s(`Store`)?.component?.switchToCostume?.();
  }, { variant: `success` });
  e2.appendChild(p(c(`cheats.freeBuy`), [n2, r2]));
}
function ke(e2) {
  let t2 = document.createElement(`div`);
  t2.style.cssText = `margin-bottom:8px;`, t2.appendChild(g(c(`cheats.zenGardenScene`), `warning`)), e2.appendChild(t2), Z(e2, `coin`, `CoinCount`, c(`cheats.coins`), c(`cheats.setCoins`), c(`cheats.clearCoins`)), Z(e2, `gem`, `GemCount`, c(`cheats.gems`), c(`cheats.setGems`), c(`cheats.clearGems`)), Z(e2, `sprout`, `SproutCount`, c(`cheats.seeds`), c(`cheats.setSeeds`), c(`cheats.clearSeeds`));
  let n2 = m(c(`cheats.quickGrow`), () => {
    let e3 = l();
    if (e3) try {
      let t4 = e3.js.getClassByName(`ZenGarden`), n3 = e3.director?.getScene();
      t4 && n3 && n3.getComponentsInChildren(t4).forEach((e4) => {
        e4.initialized && e4.slots.forEach((e5) => {
          if (e5.plant) {
            if (e5.stuck && (e5.plant.stuck = false, e5.requirePar)) {
              try {
                e5.requirePar.node?.destroy();
              } catch {
              }
              e5.requirePar = null;
            }
            e5.plant.waterCD = 9999 * 1e3, e5.grow(4);
          }
        });
      });
    } catch {
    }
    let t3 = o();
    if (t3?.currentPlayer?.zengarden) {
      let e4 = t3.currentPlayer.zengarden, n3 = 86400001;
      [`plantsInMain`, `plantsInMushroom`, `plantsInBeach`, `plantsInNight`].forEach((t4) => {
        let r2 = e4[t4];
        Array.isArray(r2) && r2.forEach((e5) => {
          e5 && (e5.grownTime = n3, e5.stuck = false, e5.waterCD = 9999999);
        });
      }), t3.currentPlayer.zengarden.plantInCart && (t3.currentPlayer.zengarden.plantInCart.grownTime = n3, t3.currentPlayer.zengarden.plantInCart.stuck = false), t3.savePP();
    }
  }, { variant: `success` });
  e2.appendChild(p(c(`cheats.quickGrow`), [n2]));
}
var Q = ne(a, b), Ae = { sun: `cheats.lockSun`, coin: `cheats.lockCoins`, gem: `cheats.lockGems`, sprout: `cheats.lockSeeds`, ticket: `cheats.lockTickets`, worldkey: `cheats.lockWorldKeys` }, je = false;
function Me(e2, t2) {
  let n2 = d(c(Ae[e2]), Q.active(e2), (r2) => {
    r2 ? Q.set(e2, Number(t2.value)) || (n2._setValue(false), v(c(`common.failed`), `error`)) : Q.stop(e2), F();
  });
  return n2;
}
function Ne() {
  let e2 = z();
  e2 !== A && (e2 ? U() : A === true && W(), A = e2);
}
function $(e2) {
  let t2 = ge();
  return t2?.node?.isValid ? Q.active(`sun`) ? Q.set(`sun`, Math.min(99999, Q.value(`sun`) + e2)) : (t2.SunAdd(e2), true) : false;
}
function Pe(e2) {
  if (!b()) return false;
  Q.refresh(), Ne();
  let t2 = { sunLock: `sun`, coinLock: `coin`, gemLock: `gem`, sproutLock: `sprout`, ticketLock: `ticket`, worldkeyLock: `worldkey` }[e2];
  if (t2) {
    if (Q.active(t2)) Q.stop(t2);
    else if (!Q.set(t2, t2 === `sun` ? 9900 : 9999999)) return false;
  } else {
    if (K() !== `inGameScene`) return false;
    let t3 = { freePlant: ce, freePF: le, noCooldown: fe, invincible: de, autoCollect: ue };
    if (t3[e2]) {
      let n2 = { freePlant: `SunCount`, freePF: `PlantFoodCount`, noCooldown: `CardUIUpper`, invincible: `Plant`, autoCollect: `dropping` }[e2];
      if (!s(n2)) return false;
      let r3 = { freePlant: `_freePlant`, freePF: `_freePF`, noCooldown: `_noCDPlant` }[e2];
      z() && r3 && (I[e2] = B(r3)), t3[e2](!I[e2]);
    } else if (e2 === `addSun`) {
      if (!$(1e3)) return false;
    } else if (e2 === `speed`) {
      let e3 = s(`UIInGame`)?.component;
      if (!e3?.node?.isValid || !e3.s2xButton) return false;
      e3.speedUp(false);
    } else return false;
  }
  F(), E?.isConnected && (E.innerHTML = ``, render(E));
  let r2 = t2 ? Q.active(t2) : I[e2];
  return v(c(n[e2]) + (typeof r2 == `boolean` ? `: ` + c(r2 ? `common.on` : `common.off`) : ``), `success`), true;
}
function initializeShortcuts() {
  je || (je = true, document.addEventListener(`keydown`, (n2) => {
    t(n2, s(`KeyListener`)?.KeyBinds, u(window.System.resolve(`cc`), `KeyCode`)) || e(n2, getSettings().trainerHotkeys, Pe);
  }, true));
}
export {
  _isCheatAllowed,
  _refreshPlayerTools,
  _renderPlayerTools,
  createCheatsTab,
  initializeShortcuts,
  onActivate,
  onDeactivate,
  render
};
