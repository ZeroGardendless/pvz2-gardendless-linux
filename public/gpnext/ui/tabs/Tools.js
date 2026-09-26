import { renderTroubleshooting } from "../tools/Troubleshooting.js";
import { renderUuidGenerator } from "../tools/UuidGenerator.js";
import { a as e, c as t, f as n, m as r, n as i, s as a } from "../../runtime/Engine.js";
import { a as o } from "../Translations.js";
import { f as s, i as c, l, n as u, o as d, r as f, s as p, t as m, u as h } from "../Components.js";
import { isCloudAvailable, render } from "./Cloud.js";
import { t as v } from "./Pages.js";
import { renderHealthOverlay } from "./Settings.js";
var b = /* @__PURE__ */ new Set([`gravestone_tutorial`, `gravestone_egypt`, `gravestone_pirate`, `gravestone_cowboy`, `gravestone_future`, `gravestone_dark`, `gravestoneSunOnDestruction`, `gravestonePlantfoodOnDestruction`, `gravestone_iceage`, `gravestone_lostcity`]);
function x() {
  try {
    let e2 = JSON.parse(localStorage.getItem(`PvZ2_Settings`));
    return typeof e2?.AllowCheats == `boolean` ? e2.AllowCheats : e2?.AllowCheat === true;
  } catch {
    return false;
  }
}
var S = (e2) => e2?.node?.isValid && e2.node.activeInHierarchy !== false && e2.dead !== true, C = (e2) => ({ ok: false, reason: e2 });
function w(e2 = i) {
  let t2 = (t3, n3) => e2.getModuleExport(`chunks:///_virtual/${t3}.ts`, n3);
  function n2() {
    if (!x()) return null;
    let n3 = e2.getCc()?.director?.getScene(), r3 = t2(`levelController`, `LevelPlay`), i2 = r3?.component;
    return n3?.name !== `inGameScene` || !S(i2) || !r3.gameStarted || !r3.gaming ? null : { scene: n3, Level: r3, level: i2 };
  }
  function r2(e3) {
    let t3 = n2();
    return t3 && t3.scene === e3.scene && t3.level === e3.level;
  }
  function a2(t3, i2) {
    let a3 = n2();
    if (!a3) return C(`context`);
    let o3 = e2.getClassByName(t3);
    if (!o3) return C(`unavailable`);
    let s3 = 0;
    try {
      for (let e3 of a3.scene.getComponentsInChildren(o3)) {
        if (!r2(a3)) return C(`context`);
        S(e3) && i2(e3) && s3++;
      }
      return { ok: true, count: s3 };
    } catch {
      return C(`failed`);
    }
  }
  function o2() {
    let t3 = n2(), r3 = e2.getClassByName(`Cards`)?.component;
    return !t3 || !S(r3) || !r3.gameStarted || !Array.isArray(r3.cardsUIUpper) || t3.Level.isBeghouled || t3.level.conveyor ? null : { ...t3, cards: r3 };
  }
  function s2() {
    let n3 = t2(`Plants`, `plants`), r3 = t2(`Plants`, `PlantEnum`), i2 = e2.getClassByName(`MultiLanguage`);
    if (!n3 || !Number.isInteger(r3?.amount)) return [];
    let a3 = [];
    for (let e3 = 0; e3 < r3.amount; e3++) {
      let t3 = n3.getPlantFeature(e3);
      !t3?.CODENAME || t3.CODENAME === `imitater` || !t3.RES?.Plant || !t3._CARDSPRITENAME || n3.getPlantEnumByCodename(t3.CODENAME, false) === e3 && a3.push({ value: t3.CODENAME, label: i2?.getString?.(t3.NAME, false) || t3.CODENAME });
    }
    return a3;
  }
  function c2() {
    let e3 = o2();
    return e3 ? e3.cards.CFs.flatMap((t3, n3) => {
      let r3 = e3.cards.cardsUIUpper[n3];
      return !S(t3) || !S(r3) || r3.cf !== t3 || !r3.coolShadow ? [] : [{ index: n3, card: t3, upper: r3, scene: e3.scene, level: e3.level, cards: e3.cards, type: t3.Type }];
    }) : [];
  }
  return { plantChoices: s2, slots: c2, clearGravestones() {
    let e3 = t2(`Tombs`, `TombEnum`);
    return a2(`Tomb`, (t3) => !b.has(e3?.[t3.ID]) || typeof t3.die != `function` ? false : (t3.die(), true));
  }, healPlants() {
    return a2(`Plant`, (e3) => !e3.plantInLnC?.isInLawn?.() || !(e3.health > 0) || !Number.isFinite(e3.toughness) || e3.health >= e3.toughness || typeof e3.heal != `function` ? false : (e3.heal(e3.toughness - e3.health), true));
  }, async replaceCard(e3, n3) {
    let r3 = o2(), i2 = t2(`Plants`, `plants`), a3 = () => {
      let t3 = o2();
      return t3 && t3.scene === e3?.scene && t3.level === e3.level && t3.cards === e3.cards && S(e3.card) && S(e3.upper) && t3.cards.CFs[e3.index] === e3.card && t3.cards.cardsUIUpper[e3.index] === e3.upper && e3.upper.cf === e3.card && e3.card.Type === e3.type;
    };
    if (!r3 || !a3()) return C(`context`);
    if (!s2().some((e4) => e4.value === n3)) return C(`unavailable`);
    let c3 = i2.getPlantFeature(i2.getPlantEnumByCodename(n3, false)), l2 = i2.getPlantEnumWithPropByPlantTypes;
    try {
      return await i2.loadPlantsInCardByType(n3), !a3() || t2(`Plants`, `plants`) !== i2 || i2.getPlantEnumWithPropByPlantTypes !== l2 || i2.getPlantFeature(i2.getPlantEnumByCodename(n3, false)) !== c3 ? C(`context`) : (r3.cards.ui.tryChangingIndex(-1), e3.card.isImitater = false, e3.card.FORCE_BOOSTED = e3.card.PP_BOOSTED = false, e3.card.CooldownFrom = 1, e3.card.cardGrouperByType(n3), e3.upper.coolStart(1), e3.upper.cardUpdate(0), r3.cards.JudgeSelection(), { ok: true, count: 1 });
    } catch {
      return C(`failed`);
    }
  } };
}
var T = w(), E = null, D = null, O = null, k = null, A = null, j = null, M = null, N = [], P = /* @__PURE__ */ new Map();
function ee() {
  return F.freePlant || F.invincible || F.noCooldown || F.freePF || F.autoCollect || F.freeBuy || F._origBuy !== null || F._origCostumeBuy !== null || F._origSunDec !== null || F._origCoolStart !== null || F._origPFDec !== null;
}
function te() {
  O ||= setInterval(() => {
    ee() && !J() && H();
  }, 1500);
}
function ne() {
  te(), D && clearInterval(D), ae(), D = setInterval(() => {
    let e2 = J(), t2 = R(), n2 = a(), r2 = n2 && n2.director?.getScene()?.name || null, i2 = t2 !== A;
    if ((e2 !== k || i2 || r2 !== j) && E && (i2 && (t2 ? U() : W()), k = e2, A = t2, j = r2, E.innerHTML = ``, X(E)), pe(), E) for (let [e3, t3] of P) {
      if (!t3 || !document.body.contains(t3)) {
        P.delete(e3);
        continue;
      }
      if (document.activeElement === t3) continue;
      let n3 = e3.indexOf(`:`), r3 = Z(e3.slice(0, n3), e3.slice(n3 + 1));
      String(t3.value) !== String(r3) && (t3.value = r3);
    }
  }, 1500);
}
function re() {
  D &&= (clearInterval(D), null), P.clear();
}
var F = { freePlant: false, invincible: false, noCooldown: false, freePF: false, autoCollect: false, freeBuy: false, timeStop: false, _origSunDec: null, _origCoolStart: null, _origCoolDown: null, _origPFDec: null, _origBuy: null, _origCostumeBuy: null, _autoCollectInterval: null, _origTimeScale: 1 };
function I() {
  return t(`SandBoxLevelSettingWindow`);
}
function L() {
  let e2 = I();
  return e2?.cp ? e2.cp.node?.isValid ? e2.cp : (e2.cp = null, null) : null;
}
function R() {
  let e2 = a();
  return !e2 || e2.director?.getScene()?.name !== `inGameScene` || !I() ? false : L() ? true : ie();
}
function ie() {
  try {
    let e2 = a();
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
function ae() {
  let e2 = t(`SandBoxLevelSettingWindow`);
  if (!e2 || e2._gpHooked) return;
  let n2 = e2.prototype.onLoad;
  e2.prototype.onLoad = function() {
    e2.cp = this, n2 && n2.call(this);
  }, e2._gpHooked = true;
}
function z(e2) {
  let t2 = I();
  return t2 ? t2[e2] ?? false : false;
}
function B(e2, t2, n2) {
  let r2 = I(), i2 = r2?.cp;
  i2 && (r2[e2] ?? false) !== n2 && i2[t2]();
}
function V() {
  let e2 = t(`SunCount`);
  F._origSunDec && e2 && (e2.prototype.SunDec = F._origSunDec, F._origSunDec = null);
  let n2 = t(`PlantFoodCount`);
  F._origPFDec && n2 && (n2.prototype.plantFoodDec = F._origPFDec, F._origPFDec = null);
  let r2 = t(`CardUIUpper`);
  r2 && (F._origCoolStart && (r2.prototype.coolStart = F._origCoolStart), F._origCoolDown && (r2.prototype.coolDown = F._origCoolDown), F._origCoolStart = null, F._origCoolDown = null);
}
function H() {
  V();
  let e2 = t(`Plant`);
  e2?.prototype._gpOrigDealDamage && (e2.prototype.dealDamage = e2.prototype._gpOrigDealDamage, delete e2.prototype._gpOrigDealDamage);
  let n2 = t(`StoreCommodity`);
  F._origBuy && n2 && (n2.prototype.buy = F._origBuy, F._origBuy = null);
  let r2 = t(`StoreCostumeSeller`);
  F._origCostumeBuy && r2 && (r2.prototype.buy = F._origCostumeBuy, F._origCostumeBuy = null), F._autoCollectInterval &&= (clearInterval(F._autoCollectInterval), null), F.freePlant = false, F.invincible = false, F.noCooldown = false, F.freePF = false, F.autoCollect = false, F.freeBuy = false;
}
function U() {
  V();
  let e2 = I();
  e2 && (L() ? (B(`_freePlant`, `reverseFreePlant`, true), B(`_noCDPlant`, `reverseNoCDPlant`, true), B(`_freePF`, `reverseFreePF`, true)) : (e2._freePlant = true, e2._noCDPlant = true, e2._freePF = true)), F.freePlant = true, F.noCooldown = true, F.freePF = true;
}
function W() {
  V(), F.freePlant = false, F.noCooldown = false, F.freePF = false;
  let e2 = I();
  e2 && (e2._freePlant = false, e2._noCDPlant = false, e2._freePF = false);
}
function G() {
  return t(`SunCount`)?.component;
}
function K() {
  return t(`PlantFoodCount`)?.component;
}
function oe() {
  let e2 = a();
  if (!e2) return null;
  let t2 = e2.js.getClassByName(`levelController`);
  return t2 ? e2.director.getScene()?.getComponentInChildren(t2) ?? null : null;
}
function q() {
  let e2 = a();
  return e2 && e2.director?.getScene()?.name || null;
}
function se(e2) {
  let t2 = document.createElement(`div`);
  return t2.className = `gp-input-label`, t2.textContent = e2, t2;
}
function ce(e2) {
  if (!e2?.node?.isValid) return false;
  let t2 = e2?.constructor?.name || ``, n2 = e2?.node?.name || ``, r2 = e2?.node?.path || ``;
  return /zombie|undead|walker|zmb/i.test(t2) || /zombie|undead|walker|zmb/i.test(n2) || /zombie|undead|walker|zmb/i.test(r2) ? typeof e2.playDie == `function` || typeof e2.judgeDeath == `function` || typeof e2.kill == `function` || Number.isFinite(e2?.health) || Number.isFinite(e2?._health) : false;
}
function le() {
  let e2 = a(), t2 = e2?.director?.getScene();
  if (!e2 || !t2) return [];
  let r2 = [], i2 = /* @__PURE__ */ new Set(), o2 = (e3) => {
    if (!e3?.node?.isValid) return;
    let t3 = e3.node.uuid || e3.uuid || `${e3.constructor?.name}:${e3.node.name}`;
    i2.has(t3) || (i2.add(t3), r2.push(e3));
  }, s2 = n(`chunks:///_virtual/Zombie.ts`, `Zombie`);
  if (s2) try {
    (t2.getComponentsInChildren(s2) || []).forEach(o2);
  } catch {
  }
  if (r2.length === 0) try {
    (t2.getComponentsInChildren(e2.Component) || []).filter(ce).forEach(o2);
  } catch {
  }
  return r2.filter((e3) => {
    if (!e3?.node?.isValid || e3.dead === true) return false;
    if (typeof e3.isAlive == `function`) try {
      return e3.isAlive();
    } catch {
      return true;
    }
    return true;
  });
}
function ue(e2) {
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
function de() {
  let e2 = le(), t2 = 0;
  return e2.forEach((e3) => {
    ue(e3) && t2++;
  }), t2;
}
var J = x;
function fe(e2) {
  M = document.createElement(`div`), e2.appendChild(M), N = T.slots(), Y(M, N);
}
function pe() {
  if (!M) return;
  let e2 = T.slots();
  e2.length === N.length && e2.every((e3, t2) => {
    let n2 = N[t2];
    return e3.card === n2.card && e3.upper === n2.upper && e3.scene === n2.scene && e3.level === n2.level && e3.cards === n2.cards && e3.type === n2.type;
  }) || (N = e2, M.replaceChildren(), Y(M, e2));
}
function Y(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.setAttribute(`role`, `status`), n2.hidden = true;
  let r2 = (e3) => {
    n2.hidden = false, n2.textContent = e3.ok ? o(`cheats.actionDone`, e3.count) : o(`cheats.action.${e3.reason}`);
  }, i2 = [f(u(o(`cheats.clearGravestones`), () => r2(T.clearGravestones())), u(o(`cheats.healPlants`), () => r2(T.healPlants()), { variant: `success` }))], a2 = T.plantChoices();
  if (t2.length && a2.length) {
    let e3 = t2[0], n3 = a2[0].value;
    i2.push(h(o(`cheats.cardSlot`), t2.map((e4) => ({ value: String(e4.index), label: String(e4.index + 1) })), String(e3.index), (n4) => {
      e3 = t2.find((e4) => e4.index === Number(n4));
    })), i2.push(h(o(`cheats.plant`), a2, n3, (e4) => {
      n3 = e4;
    }));
    let s2 = u(o(`cheats.replaceCard`), async () => {
      s2.disabled = true;
      let t3 = await T.replaceCard(e3, n3);
      r2(t3), t3.ok && (e3.type = e3.card.Type), s2.disabled = false;
    });
    i2.push(s2);
  }
  i2.push(n2), e2.appendChild(l(o(`cheats.battleTools`), i2));
}
function X(e2) {
  if (M = null, E = e2, !r()) {
    e2.appendChild(c(o(`header.status.waiting`)));
    return;
  }
  if (!J()) {
    k = false, H();
    let t3 = c(o(`cheats.allowCheatRequired`));
    t3.style.color = `#ff9800`, e2.appendChild(t3);
    return;
  }
  k = true;
  let t2 = q(), n2 = R();
  if (A !== null && n2 !== A && (n2 ? U() : W()), A = n2, j = t2, t2 === `inGameScene`) me(e2, n2);
  else if (t2 === `worldMapScene`) he(e2);
  else if (t2 === `storeScene`) ge(e2);
  else if (t2 === `zenGardenScene`) _e(e2);
  else {
    let t3 = c(o(`cheats.unsupportedScene`));
    t3.style.color = `#ff9800`, t3.style.marginTop = `12px`, e2.appendChild(t3);
  }
}
function me(e2, n2) {
  let r2 = document.createElement(`div`);
  r2.style.cssText = `margin-bottom:8px;`, n2 ? r2.appendChild(m(o(`cheats.sandboxMode`), `success`)) : r2.appendChild(m(o(`cheats.normalLevel`), `primary`)), e2.appendChild(r2);
  let i2 = p(o(`cheats.sun`), 0, (e3) => {
  }, { min: 0, max: 99999, step: 50 }), c2 = u(o(`cheats.setSun`), () => {
    let e3 = G(), t2 = i2._getInput();
    e3 && t2 && e3.setSunCount(Number(t2.value));
  }, { small: true }), d2 = u(o(`cheats.addSun200`), () => {
    let e3 = G();
    e3 && e3.SunAdd(200);
  }, { small: true, variant: `success` }), h2 = u(o(`cheats.addSun500`), () => {
    let e3 = G();
    e3 && e3.SunAdd(500);
  }, { small: true, variant: `success` }), g2 = u(o(`cheats.addSun`), () => {
    let e3 = G();
    e3 && e3.SunAdd(1e3);
  }, { small: true, variant: `success` }), _2 = u(o(`cheats.addSun5000`), () => {
    let e3 = G();
    e3 && e3.SunAdd(5e3);
  }, { small: true, variant: `success` }), v2 = n2 ? z(`_freePlant`) : F.freePlant;
  F.freePlant = v2;
  let y2 = s(o(`cheats.freePlant`), v2, (e3) => {
    if (F.freePlant = e3, n2) {
      let n3 = t(`SunCount`);
      F._origSunDec && n3 && (n3.prototype.SunDec = F._origSunDec, F._origSunDec = null), B(`_freePlant`, `reverseFreePlant`, e3);
    } else {
      let n3 = t(`SunCount`);
      if (!n3) return;
      e3 ? (F._origSunDec = n3.prototype.SunDec, n3.prototype.SunDec = function() {
      }) : F._origSunDec &&= (n3.prototype.SunDec = F._origSunDec, null);
    }
  }), b2 = u(`+1`, () => {
    let e3 = K();
    e3 && e3.plantFoodAdd();
  }, { small: true }), x2 = u(o(`cheats.fillPlantFood`), () => {
    let e3 = K();
    e3 && e3.setPlantFoodNum(e3.maxCount);
  }, { small: true, variant: `success` }), S2 = u(o(`cheats.clearPlantFood`), () => {
    let e3 = K();
    e3 && e3.setPlantFoodNum(0);
  }, { small: true, variant: `danger` }), C2 = n2 ? z(`_freePF`) : F.freePF;
  F.freePF = C2;
  let w2 = s(o(`cheats.freePF`), C2, (e3) => {
    if (F.freePF = e3, n2) {
      let n3 = t(`PlantFoodCount`);
      F._origPFDec && n3 && (n3.prototype.plantFoodDec = F._origPFDec, F._origPFDec = null), B(`_freePF`, `reverseFreePF`, e3);
    } else {
      let n3 = t(`PlantFoodCount`);
      if (!n3) return;
      e3 ? (F._origPFDec = n3.prototype.plantFoodDec, n3.prototype.plantFoodDec = function() {
      }) : F._origPFDec &&= (n3.prototype.plantFoodDec = F._origPFDec, null);
    }
  });
  fe(e2);
  let T2 = u(o(`cheats.restoreMowers`), () => {
    let e3 = a();
    if (!e3) return;
    let t2 = e3.js.getClassByName(`levelController`);
    if (!t2) return;
    let n3 = e3.director?.getScene()?.getComponentInChildren(t2);
    n3 && typeof n3.spawnMowers == `function` && n3.spawnMowers();
  }, { variant: `success` });
  n2 && (T2.disabled = true, T2.title = o(`cheats.restoreMowersSandboxDisabled`), T2.style.opacity = `0.45`);
  let E2 = s(o(`cheats.autoCollect`), F.autoCollect, (e3) => {
    F.autoCollect = e3;
    let t2 = a();
    t2 && (e3 ? F._autoCollectInterval = setInterval(() => {
      if (q() !== `inGameScene`) return;
      let e4 = t2.js.getClassByName(`dropping`), n3 = t2.director?.getScene();
      !n3 || !e4 || n3.getComponentsInChildren(e4).forEach((e5) => {
        e5.collected || e5.collect();
      });
    }, 300) : F._autoCollectInterval &&= (clearInterval(F._autoCollectInterval), null));
  }), D2 = u(o(`cheats.instantWin`), () => {
    let e3 = oe();
    e3 && e3.victory();
  }, { variant: `success` });
  n2 && (D2.disabled = true, D2.title = o(`cheats.instantWinSandboxDisabled`), D2.style.opacity = `0.45`), e2.appendChild(l(o(`cheats.level`), [E2, T2, D2])), e2.appendChild(l(o(`cheats.resources`), [i2, f(c2, d2, h2, g2, _2), y2, se(o(`cheats.plantFood`)), f(b2, x2, S2), w2]));
  let O2 = s(o(`cheats.invincible`), F.invincible, (e3) => {
    F.invincible = e3;
    let n3 = t(`Plant`);
    n3 && (e3 ? (n3.prototype._gpOrigDealDamage = n3.prototype.dealDamage, n3.prototype.dealDamage = function() {
      return this.health;
    }) : n3.prototype._gpOrigDealDamage && (n3.prototype.dealDamage = n3.prototype._gpOrigDealDamage, delete n3.prototype._gpOrigDealDamage));
  }), k2 = n2 ? z(`_noCDPlant`) : F.noCooldown;
  F.noCooldown = k2;
  let A2 = s(o(`cheats.noCooldown`), k2, (e3) => {
    if (F.noCooldown = e3, n2) {
      let n3 = t(`CardUIUpper`);
      n3 && (F._origCoolStart && (n3.prototype.coolStart = F._origCoolStart), F._origCoolDown && (n3.prototype.coolDown = F._origCoolDown), F._origCoolStart = null, F._origCoolDown = null), B(`_noCDPlant`, `reverseNoCDPlant`, e3);
    } else {
      let n3 = t(`CardUIUpper`);
      if (!n3) return;
      if (e3) {
        F._origCoolStart = n3.prototype.coolStart, F._origCoolDown = n3.prototype.coolDown, n3.prototype.coolStart = function() {
        };
        let e4 = F._origCoolDown;
        n3.prototype.coolDown = function(t2) {
          this.CD = 0, e4.call(this, 0);
        };
      } else F._origCoolStart && (n3.prototype.coolStart = F._origCoolStart), F._origCoolDown && (n3.prototype.coolDown = F._origCoolDown), F._origCoolStart = null, F._origCoolDown = null;
    }
  });
  e2.appendChild(l(o(`cheats.plant`), [O2, A2]));
  let j2 = u(o(`cheats.killAllZombies`), () => {
    de();
  }, { variant: `danger` });
  e2.appendChild(l(o(`cheats.zombie`), [j2]));
  let M2 = u(o(`cheats.resetSpeed`), () => {
    let e3 = t(`UIInGame`);
    e3?.component && e3.component.s2xButton && e3.component.s2xButton.normalSprite === e3.component.pressed2x && e3.component.speedUp(false);
  }, { small: true }), N2 = u(o(`cheats.speed2x`), () => {
    let e3 = t(`UIInGame`);
    e3?.component && e3.component.s2xButton && e3.component.s2xButton.normalSprite !== e3.component.pressed2x && e3.component.speedUp(false);
  }, { small: true });
  e2.appendChild(l(o(`cheats.gameSpeed`), [f(M2, N2)]));
}
var Z = (e2, n2) => {
  let r2 = t(n2);
  if (r2?.component) return r2.component._value ?? 0;
  try {
    let t2 = localStorage.getItem(`PvZ2_PlayerProperties`);
    if (t2) {
      let n3 = JSON.parse(t2);
      if (Array.isArray(n3) && n3.length > 0) return n3[0][e2] ?? 0;
    }
  } catch {
  }
  return 0;
}, Q = (e2, n2, r2) => {
  let i2 = t(r2);
  if (i2?.component) {
    i2.component.value = n2;
    return;
  }
  try {
    let t2 = localStorage.getItem(`PvZ2_PlayerProperties`);
    if (t2) {
      let r3 = JSON.parse(t2);
      Array.isArray(r3) && r3.length > 0 && (r3[0][e2] = n2, localStorage.setItem(`PvZ2_PlayerProperties`, JSON.stringify(r3)));
    }
  } catch {
  }
};
function $(e2, t2, n2, r2, i2, a2) {
  let s2 = t2 === `coin` ? [1e3, 5e3, 1e4, 5e4, 1e5] : t2 === `sprout` ? [1, 5, 10, 50, 100] : [50, 100, 500, 1e3, 5e3], c2 = t2 === `coin` ? [`cheats.add1000`, `cheats.add5000`, `cheats.add10000`, `cheats.add50000`, `cheats.add100000`] : t2 === `sprout` ? [`cheats.add1`, `cheats.add5`, `cheats.add10`, `cheats.add50`, `cheats.add100`] : [`cheats.add50`, `cheats.add100`, `cheats.add500`, `cheats.add1000`, `cheats.add5000`], d2 = p(r2, Z(t2, n2), () => {
  }, { min: 0, max: 9999999, step: t2 === `sprout` ? 1 : 100 }), m2 = d2.querySelector(`input`);
  P.set(`${t2}:${n2}`, m2);
  let h2 = u(i2, () => {
    m2 && Q(t2, Number(m2.value), n2);
  }, { small: true }), g2 = u(a2, () => {
    Q(t2, 0, n2), m2 && (m2.value = 0);
  }, { small: true, variant: `danger` }), _2 = s2.map((e3, r3) => u(o(c2[r3]), () => {
    let r4 = Z(t2, n2) + e3;
    Q(t2, r4, n2), m2 && (m2.value = r4);
  }, { small: true, variant: `success` }));
  e2.appendChild(l(r2, [d2, f(h2, g2), f(..._2)]));
}
function he(e2) {
  let t2 = document.createElement(`div`);
  t2.style.cssText = `margin-bottom:8px;`, t2.appendChild(m(o(`cheats.worldMap`), `warning`)), e2.appendChild(t2), $(e2, `coin`, `CoinCount`, o(`cheats.coins`), o(`cheats.setCoins`), o(`cheats.clearCoins`)), $(e2, `gem`, `GemCount`, o(`cheats.gems`), o(`cheats.setGems`), o(`cheats.clearGems`));
}
function ge(n2) {
  let r2 = document.createElement(`div`);
  r2.style.cssText = `margin-bottom:8px;`, r2.appendChild(m(o(`cheats.storeScene`), `warning`)), n2.appendChild(r2), $(n2, `coin`, `CoinCount`, o(`cheats.coins`), o(`cheats.setCoins`), o(`cheats.clearCoins`)), $(n2, `gem`, `GemCount`, o(`cheats.gems`), o(`cheats.setGems`), o(`cheats.clearGems`));
  let i2 = s(o(`cheats.freeBuy`), F.freeBuy, (e2) => {
    F.freeBuy = e2;
    let n3 = t(`StoreCommodity`), r3 = t(`StoreCostumeSeller`);
    e2 ? (n3 && (F._origBuy = n3.prototype.buy, n3.prototype.buy = function() {
      this.soldout || this.unlockCommodity();
    }), r3 && (F._origCostumeBuy = r3.prototype.buy, r3.prototype.buy = function() {
      this.soldout ||= (this.unlockCommodity(), true);
    })) : (F._origBuy && n3 && (n3.prototype.buy = F._origBuy, F._origBuy = null), F._origCostumeBuy && r3 && (r3.prototype.buy = F._origCostumeBuy, F._origCostumeBuy = null));
  }), a2 = u(o(`cheats.refreshCostume`), () => {
    let n3 = e();
    n3?.currentPlayer?.date && (n3.currentPlayer.date.date = -1), t(`Store`)?.component?.switchToCostume?.();
  }, { variant: `success` });
  n2.appendChild(l(o(`cheats.freeBuy`), [i2, a2]));
}
function _e(t2) {
  let n2 = document.createElement(`div`);
  n2.style.cssText = `margin-bottom:8px;`, n2.appendChild(m(o(`cheats.zenGardenScene`), `warning`)), t2.appendChild(n2), $(t2, `coin`, `CoinCount`, o(`cheats.coins`), o(`cheats.setCoins`), o(`cheats.clearCoins`)), $(t2, `gem`, `GemCount`, o(`cheats.gems`), o(`cheats.setGems`), o(`cheats.clearGems`)), $(t2, `sprout`, `SproutCount`, o(`cheats.seeds`), o(`cheats.setSeeds`), o(`cheats.clearSeeds`));
  let r2 = u(o(`cheats.quickGrow`), () => {
    let t3 = a();
    if (t3) try {
      let e2 = t3.js.getClassByName(`ZenGarden`), n4 = t3.director?.getScene();
      e2 && n4 && n4.getComponentsInChildren(e2).forEach((e3) => {
        e3.initialized && e3.slots.forEach((e4) => {
          if (e4.plant) {
            if (e4.stuck && (e4.plant.stuck = false, e4.requirePar)) {
              try {
                e4.requirePar.node?.destroy();
              } catch {
              }
              e4.requirePar = null;
            }
            e4.plant.waterCD = 9999 * 1e3, e4.grow(4);
          }
        });
      });
    } catch {
    }
    let n3 = e();
    if (n3?.currentPlayer?.zengarden) {
      let e2 = n3.currentPlayer.zengarden, t4 = 86400001;
      [`plantsInMain`, `plantsInMushroom`, `plantsInBeach`, `plantsInNight`].forEach((n4) => {
        let r3 = e2[n4];
        Array.isArray(r3) && r3.forEach((e3) => {
          e3 && (e3.grownTime = t4, e3.stuck = false, e3.waterCD = 9999999);
        });
      }), n3.currentPlayer.zengarden.plantInCart && (n3.currentPlayer.zengarden.plantInCart.grownTime = t4, n3.currentPlayer.zengarden.plantInCart.stuck = false), n3.savePP();
    }
  }, { variant: `success` });
  t2.appendChild(l(o(`cheats.quickGrow`), [r2]));
}
function createToolsTab() {
  return v({ root: { render(e2, t2) {
    renderUuidGenerator(e2);
    renderTroubleshooting(e2);
    let n2 = document.createElement(`div`);
    e2.appendChild(n2), X(n2);
    let r2 = document.createElement(`div`);
    renderHealthOverlay(r2), e2.appendChild(l(o(`settings.hpOverlay`), [r2])), isCloudAvailable() && e2.appendChild(d(o(`tab.cloud`), () => t2(`cloud`)));
  }, onActivate: ne, onDeactivate: re }, cloud: { labelKey: `tab.cloud`, render } });
}
export {
  createToolsTab
};
