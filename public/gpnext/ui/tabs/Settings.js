import { applyFrameRate, FRAME_RATE_OPTIONS } from "../../runtime/FrameRate.js";
import { d as e, f as t, h as n, setSettings, getSettings, u as a } from "../../core/SettingsStore.js";
import { c as o, f as s, l as c, s as l } from "../../runtime/Engine.js";
import { a as u } from "../Translations.js";
import { setOverlayHotkey } from "../Overlay.js";
import { d as f, f as p, i, l as h, n as g, r as _, s as v, u as y } from "../Components.js";
import { r as b } from "../../mods/ModSettingsRegistry.js";
import { t as x } from "../../data/EntityInspector.js";
import { applySettings } from "../../runtime/ScrollSensitivity.js";
var C = `__gp_hp_label`, w = 200, T = 42, E = 22, D = false, O = null, k = false, A = false, j = false, M = null, N = /* @__PURE__ */ new Map(), P = /* @__PURE__ */ new Map();
function ee() {
  let e2 = getSettings();
  k = e2.hpOverlay?.showPlant === true, A = e2.hpOverlay?.showZombie === true, j = e2.hpOverlay?.showTomb === true;
}
function te() {
  setSettings({ hpOverlay: { showPlant: k, showZombie: A, showTomb: j } });
}
function F(e2) {
  return !!e2 && e2.isValid !== false;
}
function I(e2) {
  return !!e2 && F(e2.node);
}
function L(e2) {
  if (!I(e2) || e2.enabled === false || e2.node?.active === false || e2.node?.activeInHierarchy === false || e2.dead === true || e2.blew === true || e2.fallingInSky === true || e2.displayed === true) return false;
  let t2 = e2.isAlive;
  if (typeof t2 == `function`) try {
    if (t2.call(e2) === false) return false;
  } catch {
  }
  return true;
}
function R(e2, t2) {
  for (let n2 of t2) {
    let t3 = e2?.[n2];
    if (typeof t3 == `number` && Number.isFinite(t3)) return t3;
  }
  return null;
}
function z(e2, t2) {
  for (let n2 of t2) {
    let t3 = e2?.[n2];
    if (typeof t3 == `function`) try {
      let n3 = t3.call(e2);
      if (typeof n3 == `number` && Number.isFinite(n3)) return n3;
    } catch {
    }
  }
  return null;
}
function B(e2, t2) {
  for (let n2 of t2) {
    let t3 = e2?.[n2];
    if (typeof t3 == `number` && Number.isFinite(t3)) return t3;
  }
  return null;
}
function ne(e2) {
  let t2 = Array.isArray(e2?.armors) ? e2.armors : [], n2 = 0, r2 = 0;
  for (let e3 of t2) {
    if (!e3) continue;
    let t3 = B(e3, [`health`, `_health`]) ?? 0, i2 = B(e3, [`toughness`]) ?? B(e3?.props, [`Toughness`, `toughness`]) ?? Math.max(t3, 0);
    n2 += Math.max(0, t3), r2 += Math.max(0, i2);
  }
  return { current: n2, max: r2 };
}
function re(e2) {
  let t2 = B(e2, [`paperHealth`, `_paperHealth`]) ?? 0, n2 = B(e2, [`_paperToughness`]) ?? B(e2?.objdataOwn, [`NewspaperHealth`]) ?? B(e2?._objdataOwn, [`NewspaperHealth`]) ?? B(e2?.objdataOwnOrg, [`NewspaperHealth`]) ?? t2, r2 = B(e2, [`ponchoHealth`, `_ponchoHealth`]) ?? 0, i2 = B(e2?.objdataOwn, [`PonchoToughness`]) ?? B(e2?._objdataOwn, [`PonchoToughness`]) ?? B(e2?.objdataOwnOrg, [`PonchoToughness`]) ?? r2, a2 = B(e2, [`plateHealth`, `_plateHealth`]) ?? 0, o2 = B(e2?.objdataOwn, [`ShieldToughness`]) ?? B(e2?._objdataOwn, [`ShieldToughness`]) ?? B(e2?.objdataOwnOrg, [`ShieldToughness`]) ?? a2, s2 = B(e2, [`bdHealth`, `_bdHealth`]) ?? 0, c2 = B(e2?.objdataOwn, [`BoardToughness`]) ?? B(e2?._objdataOwn, [`BoardToughness`]) ?? B(e2?.objdataOwnOrg, [`BoardToughness`]) ?? s2, l2 = t2 + r2 + a2 + s2, u2 = z(e2, [`extraHealth`]) ?? 0;
  return { current: Math.max(0, l2, u2), max: Math.max(0, n2 + i2 + o2 + c2, u2) };
}
function ie(e2) {
  let t2 = B(e2, [`innerHealth`, `_innerHealth`]) ?? 0, n2 = B(e2?.innerZombie, [`toughness`]) ?? B(e2?.innerZombie?.objdataOwn, [`Toughness`]) ?? t2;
  return t2 <= 0 && n2 <= 0 ? null : { current: Math.max(0, t2), max: Math.max(0, n2 || t2) };
}
function ae(e2) {
  let t2 = B(e2, [`armorHealth`, `_armorHealth`]) ?? 0, n2 = z(e2, [`armorToughness`]) ?? B(e2?.objdataOwn, [`ArmorToughness`]) ?? B(e2?._objdataOwn, [`ArmorToughness`]) ?? B(e2?.objdataOwnOrg, [`ArmorToughness`]) ?? t2, r2 = B(e2, [`shield_health`, `_shield_health`]) ?? 0, i2 = B(e2?.objdataOwn, [`ShieldToughness`]) ?? B(e2?._objdataOwn, [`ShieldToughness`]) ?? B(e2?.objdataOwnOrg, [`ShieldToughness`]) ?? r2, a2 = B(e2, [`jelly_health`, `_jelly_health`]) ?? 0, o2 = B(e2?.objdataOwn, [`JellyToughness`]) ?? B(e2?._objdataOwn, [`JellyToughness`]) ?? B(e2?.objdataOwnOrg, [`JellyToughness`]) ?? a2, s2 = t2 + r2 + a2, c2 = n2 + i2 + o2;
  return s2 <= 0 && c2 <= 0 ? null : { current: Math.max(0, s2), max: Math.max(0, c2 || s2) };
}
function oe(e2) {
  if (!e2) return false;
  if (Array.isArray(e2.armors) || typeof e2.extraHealth == `function`) return true;
  let t2 = String(e2.constructor?.name || e2.name || ``), n2 = H(e2.node);
  return /zombie|undead|walker|zmb/i.test(t2) || /zombie|undead|walker|zmb/i.test(n2);
}
function se(e2) {
  if (!e2) return false;
  let t2 = String(e2.constructor?.name || e2.name || ``);
  return !!(/armor/i.test(t2) || `owner` in e2 && B(e2, [`health`, `_health`]) !== null && (B(e2, [`toughness`]) !== null || B(e2?.props, [`Toughness`, `toughness`]) !== null));
}
function ce(e2) {
  if (!e2) return false;
  let t2 = String(e2.constructor?.name || e2.name || ``);
  if (/tomb/i.test(t2) || e2.Tomb_Type_Data != null || e2.Tombstone_Type != null || e2.tombInLnC != null) return true;
  let n2 = H(e2.node);
  return /tomb|grave|gravestone|rack|surfboard|speaker|backpack|tent/i.test(t2) || /tomb|grave|gravestone|rack|surfboard|speaker|backpack|tent/i.test(n2);
}
function le(e2) {
  let t2 = R(e2, [`health`, `Health`, `hp`, `HP`, `_health`, `_hp`, `currentHealth`, `curHealth`, `life`, `blood`, `hitPoints`]) ?? z(e2, [`getHealth`, `getHP`, `getHp`]) ?? R(e2?.data, [`health`, `hp`, `currentHealth`]) ?? R(e2?.stats, [`health`, `hp`, `currentHealth`]) ?? R(e2?.objdataOwn, [`Health`, `health`]) ?? R(e2?._objdataOwn, [`Health`, `health`]);
  if (t2 === null) return null;
  let n2 = R(e2, [`toughness`, `Toughness`, `_toughness`, `maxHealth`, `MaxHealth`, `maxHP`, `hpMax`, `_maxHealth`, `_hpMax`, `maxHp`, `maxLife`, `bloodMax`, `maxHitPoints`]) ?? z(e2, [`getMaxHealth`, `getMaxHP`, `getMaxHp`]) ?? R(e2?.objdataOwn, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? R(e2?._objdataOwn, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? R(e2?.objdataOwnOrg, [`Toughness`, `toughness`]) ?? R(e2?._objdataOwnOrg, [`Toughness`, `toughness`]) ?? R(e2?.props, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? R(e2?.data, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? R(e2?.stats, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]);
  if (oe(e2)) {
    let r3 = ne(e2), i2 = re(e2), a2 = ie(e2), o2 = t2 + r3.current + i2.current, s2 = (typeof n2 == `number` && Number.isFinite(n2) && n2 > 0 ? n2 : t2) + r3.max + i2.max;
    if (a2) return { current: Math.max(0, Math.round(a2.current)), max: Math.max(0, Math.round(a2.max)), secondaryCurrent: o2 > 0 ? Math.round(o2) : null, secondaryMax: s2 > 0 ? Math.round(s2) : null };
    let c2 = r3.current + i2.current, l2 = r3.max + i2.max;
    return { current: Math.max(0, Math.round(t2)), max: Math.max(0, Math.round(typeof n2 == `number` && Number.isFinite(n2) && n2 > 0 ? n2 : t2)), secondaryCurrent: c2 > 0 ? Math.round(c2) : null, secondaryMax: l2 > 0 ? Math.round(l2) : null };
  }
  let r2 = ae(e2);
  return { current: Math.max(0, Math.round(t2)), max: typeof n2 == `number` && Number.isFinite(n2) && n2 > 0 ? Math.round(n2) : null, secondaryCurrent: r2?.current ? Math.round(r2.current) : null, secondaryMax: r2?.max ? Math.round(r2.max) : null };
}
function V(e2, t2) {
  let n2 = [];
  for (let r2 of t2) if (r2) try {
    let t3 = e2.getComponentsInChildren(r2);
    Array.isArray(t3) && t3.length > 0 && n2.push(...t3);
  } catch {
  }
  return n2;
}
function ue(e2) {
  let t2 = [], n2 = [], r2 = [], i2 = [e2];
  for (; i2.length > 0; ) {
    let e3 = i2.pop();
    if (!e3) continue;
    let a2 = e3.components || e3._components || [], o2 = H(e3);
    for (let i3 of a2) {
      if (!I(i3) || se(i3) || le(i3) === null) continue;
      if (ce(i3)) {
        r2.push(i3);
        continue;
      }
      let a3 = String(i3.constructor?.name || i3.name || ``), s3 = String(e3.name || ``), c2 = /zombie|undead|walker|zmb/i.test(a3) || /zombie|undead|walker|zmb/i.test(s3) || /zombie|undead|walker|zmb/i.test(o2), l2 = /plant|seed|flora/i.test(a3) || /plant|seed|flora/i.test(s3) || /plant|seed|flora/i.test(o2);
      c2 && !l2 ? n2.push(i3) : l2 && !c2 ? t2.push(i3) : c2 && n2.push(i3);
    }
    let s2 = e3.children || [];
    for (let e4 of s2) i2.push(e4);
  }
  return { plants: t2, zombies: n2, tombs: r2 };
}
function H(e2) {
  let t2 = [], n2 = e2, r2 = 0;
  for (; n2 && r2 < 10; ) t2.push(String(n2.name || ``)), n2 = n2.parent, r2++;
  return t2.join(`/`);
}
function U(e2) {
  let t2 = x(e2);
  return t2 ? { current: t2.current, max: t2.max, secondaryCurrent: t2.secondary?.current ?? null, secondaryMax: t2.secondary?.max ?? null } : null;
}
function de(e2) {
  let t2 = [], n2 = [e2];
  for (; n2.length > 0; ) {
    let e3 = n2.pop();
    if (!e3) continue;
    let r2 = e3.components || e3._components || [];
    for (let e4 of r2) if (I(e4) && !se(e4) && le(e4) !== null) {
      t2.push(e4);
      break;
    }
    let i2 = e3.children || [];
    for (let e4 of i2) n2.push(e4);
  }
  return t2;
}
function fe(e2, t2) {
  try {
    let n2 = [e2];
    for (; n2.length > 0; ) {
      let e3 = n2.pop();
      if (!e3) continue;
      let r2 = e3.getComponent?.(t2.Label);
      if (r2?.font) return r2.font;
      let i2 = e3.children || [];
      for (let e4 of i2) n2.push(e4);
    }
  } catch {
  }
  return null;
}
function pe(e2, t2, n2) {
  let r2 = e2.getChildByName(t2);
  (!r2 || !F(r2)) && (r2 = new n2.Node(t2), e2.addChild(r2)), r2.active = true, r2.layer = e2.layer, n2.UITransform && !r2.getComponent(n2.UITransform) && r2.addComponent(n2.UITransform);
  let i2 = r2.getComponent(n2.Label);
  return i2 ||= r2.addComponent(n2.Label), { node: r2, label: i2 };
}
function me(e2, t2, n2, r2, i2) {
  if (t2.fontSize = r2 ? i2 ? 23 : 28 : i2 ? 22 : 26, t2.lineHeight = r2 ? i2 ? 25 : 30 : i2 ? 24 : 28, t2.overflow = n2.Label.Overflow?.NONE ?? t2.overflow, M) try {
    t2.font = M, t2.isSystemFontUsed = false;
  } catch {
    t2.isSystemFontUsed = true;
  }
  else t2.isSystemFontUsed = true;
  if (n2.Color && (t2.color = r2 ? i2 ? new n2.Color(150, 214, 165, 255) : new n2.Color(210, 255, 220, 255) : i2 ? new n2.Color(224, 183, 118, 255) : new n2.Color(255, 220, 170, 255)), n2.LabelOutline) {
    let t3 = e2.getComponent(n2.LabelOutline);
    t3 ||= e2.addComponent(n2.LabelOutline), t3.width = i2 ? 2 : 3, n2.Color && (t3.color = new n2.Color(20, 20, 20, 255));
  }
  if (n2.LabelShadow) {
    let t3 = e2.getComponent(n2.LabelShadow);
    t3 ||= e2.addComponent(n2.LabelShadow), n2.Color && (t3.color = new n2.Color(0, 0, 0, 180)), n2.Vec2 && (t3.offset = new n2.Vec2(2, -2)), t3.blur = 2;
  }
}
function he(e2, t2, n2, r2) {
  if (typeof n2 != `number` || !Number.isFinite(n2)) return ``;
  let i2 = typeof r2 == `number` && Number.isFinite(r2) && r2 > 0, a2 = e2?.[t2];
  if (i2) {
    let i3 = Math.max(r2, n2, typeof a2 == `number` ? a2 : 0);
    return e2[t2] = i3, `${n2}/${i3}`;
  }
  if (typeof a2 == `number` && Number.isFinite(a2) && a2 > 0) {
    let r3 = Math.max(a2, n2);
    return e2[t2] = r3, `${n2}/${r3}`;
  }
  return e2[t2] = n2, `${n2}/${n2}`;
}
function ge(e2) {
  return e2 && typeof e2 == `object` ? e2 : typeof e2 == `number` && Number.isFinite(e2) && e2 > 0 ? { primary: e2 } : {};
}
function W(e2, t2) {
  let n2 = e2.node?.uuid;
  if (!n2) return { primary: String(t2.current), secondary: typeof t2.secondaryCurrent == `number` ? String(t2.secondaryCurrent) : `` };
  let r2 = ge(P.get(n2)), i2 = he(r2, `primary`, t2.current, t2.max), a2 = typeof t2.secondaryCurrent == `number` && t2.secondaryCurrent > 0 ? he(r2, `secondary`, t2.secondaryCurrent, t2.secondaryMax) : ``;
  return P.set(n2, r2), { primary: i2, secondary: a2 };
}
function G(e2, t2, n2) {
  let r2 = e2.node?.uuid;
  if (!r2) return null;
  let i2 = N.get(r2);
  if (i2 && F(i2.node) && I(i2.owner) && i2.primaryLabel && i2.secondaryLabel) return i2.node.parent !== e2.node && i2.node.setParent(e2.node), i2.node.layer = e2.node.layer, i2.node.setSiblingIndex(Math.max((e2.node.children?.length || 1) - 1, 0)), i2.primaryNode && (i2.primaryNode.layer = e2.node.layer, i2.primaryNode.active = true), i2.secondaryNode && (i2.secondaryNode.layer = e2.node.layer, i2.secondaryNode.active = true), i2;
  i2?.node && F(i2.node) && (i2.node.destroy(), N.delete(r2));
  let a2 = e2.node.getChildByName(C);
  (!a2 || !F(a2)) && (a2 = new t2.Node(C), e2.node.addChild(a2)), a2.active = true, a2.layer = e2.node.layer, a2.setSiblingIndex(Math.max((e2.node.children?.length || 1) - 1, 0)), t2.UITransform && !a2.getComponent(t2.UITransform) && a2.addComponent(t2.UITransform);
  let o2 = a2.getComponent(t2.Label);
  o2 && (o2.string = ``);
  let s2 = pe(a2, `__gp_hp_primary`, t2), c2 = pe(a2, `__gp_hp_secondary`, t2);
  s2.node.layer = e2.node.layer, c2.node.layer = e2.node.layer, s2.label.string = ``, c2.label.string = ``;
  let l2 = { owner: e2, node: a2, primaryNode: s2.node, primaryLabel: s2.label, secondaryNode: c2.node, secondaryLabel: c2.label };
  return me(s2.node, s2.label, t2, n2, false), me(c2.node, c2.label, t2, n2, true), N.set(r2, l2), l2;
}
function K(e2, t2) {
  let n2 = e2.owner?.node;
  if (!F(n2) || !F(e2.node)) return;
  let r2 = e2.type === `plant` ? 110 : 96;
  if (t2.UITransform) {
    let i3 = n2.getComponent(t2.UITransform);
    i3?.contentSize?.height && (r2 = e2.type === `plant` ? Math.max(98, Math.round(i3.contentSize.height * 1.5)) : Math.max(88, Math.round(i3.contentSize.height * 1.3)));
  }
  let i2 = e2._stackIndex || 0;
  e2.node.layer = n2.layer, e2.node.setSiblingIndex(Math.max((n2.children?.length || 1) - 1, 0)), e2.primaryNode && (e2.primaryNode.layer = n2.layer), e2.secondaryNode && (e2.secondaryNode.layer = n2.layer), e2.node.setPosition(0, r2 + i2 * T, 0), e2.primaryNode?.setPosition(0, 0, 0), e2.secondaryNode && e2.secondaryNode.setPosition(0, E, 0);
  let a2 = n2.worldScale || n2.getWorldScale?.() || n2.scale, o2 = a2?.x < 0 ? -1 : 1, s2 = a2?.y < 0 ? -1 : 1;
  e2.node.setScale(o2, s2, 1);
}
function _e() {
  for (let [e2, t2] of N) (!L(t2.owner) || !F(t2.node)) && (F(t2.node) && t2.node.destroy(), N.delete(e2), P.delete(e2));
}
function q(e2) {
  let t2 = e2?.node?.uuid;
  if (!t2) return;
  let n2 = N.get(t2);
  n2 && F(n2.node) && n2.node.destroy(), N.delete(t2), P.delete(t2);
}
function ve() {
  for (let [, e2] of N) F(e2.node) && e2.node.destroy();
  N.clear(), P.clear();
}
function J(e2) {
  for (let [t2, n2] of N) n2.type === e2 && (F(n2.node) && n2.node.destroy(), N.delete(t2), P.delete(t2));
}
function Y() {
  if (!D) return;
  let e2 = l();
  if (!e2) return;
  let t2 = e2.director?.getScene();
  if (!t2 || t2.name !== `inGameScene`) {
    ve();
    return;
  }
  M ||= fe(t2, e2);
  let n2 = o(`Plant`), r2 = s(`chunks:///_virtual/Zombie.ts`, `Zombie`), i2 = o(`Tomb`);
  if (!n2 && !r2 && !i2) return;
  let a2 = V(t2, [n2]), c2 = V(t2, [r2]), u2 = V(t2, [i2]);
  if (a2.length === 0 || c2.length === 0 || u2.length === 0) {
    let e3 = ue(t2);
    a2.length === 0 && (a2 = e3.plants), c2.length === 0 && (c2 = e3.zombies), u2.length === 0 && (u2 = e3.tombs);
  }
  c2.length === 0 && (c2 = de(t2).filter((e3) => {
    let t3 = String(e3.constructor?.name || ``), n3 = H(e3.node);
    return /zombie|undead|walker|zmb/i.test(t3) || /zombie|undead|walker|zmb/i.test(n3);
  })), k || J(`plant`), A || J(`zombie`), j || J(`tomb`);
  let d2 = /* @__PURE__ */ new Map(), f2 = (e3, t3) => {
    let n3 = e3?.node?.worldPosition;
    if (!n3) return 0;
    let r3 = `${t3}_${Math.round(n3.x / 48)}_${Math.round(n3.y / 32)}`, i3 = d2.get(r3) || 0;
    return d2.set(r3, i3 + 1), i3;
  };
  if (k) for (let t3 of a2) {
    if (!L(t3)) {
      q(t3);
      continue;
    }
    let n3 = U(t3);
    if (n3 === null || !L(t3)) {
      q(t3);
      continue;
    }
    let r3 = G(t3, e2, true);
    if (!r3) continue;
    r3.type = `plant`, r3._stackIndex = f2(t3, `plant`);
    let i3 = W(t3, n3);
    r3.primaryLabel.string = i3.primary, r3.secondaryLabel.string = i3.secondary, r3.primaryNode.active = !!i3.primary, r3.secondaryNode.active = !!i3.secondary, K(r3, e2);
  }
  if (A) for (let t3 of c2) {
    if (!L(t3)) {
      q(t3);
      continue;
    }
    let n3 = U(t3);
    if (n3 === null || !L(t3)) {
      q(t3);
      continue;
    }
    let r3 = G(t3, e2, false);
    if (!r3) continue;
    r3.type = `zombie`, r3._stackIndex = f2(t3, `zombie`);
    let i3 = W(t3, n3);
    r3.primaryLabel.string = i3.primary, r3.secondaryLabel.string = i3.secondary, r3.primaryNode.active = !!i3.primary, r3.secondaryNode.active = !!i3.secondary, K(r3, e2);
  }
  if (j) for (let t3 of u2) {
    if (!L(t3)) {
      q(t3);
      continue;
    }
    let n3 = U(t3);
    if (n3 === null || !L(t3)) {
      q(t3);
      continue;
    }
    let r3 = G(t3, e2, false);
    if (!r3) continue;
    r3.type = `tomb`, r3._stackIndex = f2(t3, `tomb`);
    let i3 = W(t3, n3);
    r3.primaryLabel.string = i3.primary, r3.secondaryLabel.string = i3.secondary, r3.primaryNode.active = !!i3.primary, r3.secondaryNode.active = !!i3.secondary, K(r3, e2);
  }
  _e();
}
function X() {
  D || (D = true, Y(), O = setInterval(Y, w));
}
function Z() {
  !D && !O && N.size === 0 || (D = false, O &&= (clearInterval(O), null), ve(), M = null);
}
function Q(e2 = {}) {
  typeof e2.showPlant == `boolean` && (k = e2.showPlant), typeof e2.showZombie == `boolean` && (A = e2.showZombie), typeof e2.showTomb == `boolean` && (j = e2.showTomb), te(), D && (k || J(`plant`), A || J(`zombie`), j || J(`tomb`), Y());
}
function $() {
  return { showPlant: k, showZombie: A, showTomb: j };
}
function ye() {
  let e2 = { plant: 0, zombie: 0, tomb: 0, unknown: 0 };
  for (let [, t2] of N) {
    let n2 = t2?.type || `unknown`;
    e2[n2] = (e2[n2] || 0) + 1;
  }
  return { enabled: D, timerActive: !!O, labelCount: N.size, byType: e2, visibility: $() };
}
function be(e2 = null) {
  let t2 = e2 || c();
  if (!t2) return { status: `unavailable`, reason: `scene-unavailable` };
  let n2 = o(`Plant`), r2 = s(`chunks:///_virtual/Zombie.ts`, `Zombie`), i2 = o(`Tomb`), a2 = V(t2, [n2]), l2 = V(t2, [r2]), u2 = V(t2, [i2]), d2 = { plant: false, zombie: false, tomb: false };
  if (a2.length === 0 || l2.length === 0 || u2.length === 0) {
    let e3 = ue(t2);
    n2 || (d2.plant = true), r2 || (d2.zombie = true), i2 || (d2.tomb = true), a2.length === 0 && e3.plants.length > 0 && (a2 = e3.plants, d2.plant = true), l2.length === 0 && e3.zombies.length > 0 && (l2 = e3.zombies, d2.zombie = true), u2.length === 0 && e3.tombs.length > 0 && (u2 = e3.tombs, d2.tomb = true);
  }
  return { status: `available`, source: d2.plant || d2.zombie || d2.tomb ? `class+fallback-scan` : `class-scan`, counts: { plant: a2.length, zombie: l2.length, tomb: u2.length }, classAvailable: { plant: !!n2, zombie: !!r2, tomb: !!i2 }, fallbackUsed: d2 };
}
ee(), (k || A || j) && X();
var xe = b;
function bindModSettingsRegistry(e2) {
  xe = e2;
}
function Ce(e2, t2, n2) {
  let r2 = document.createElement(`div`);
  r2.className = `gp-input-wrap`;
  let i2 = document.createElement(`span`);
  i2.className = `gp-input-label`, i2.textContent = e2;
  let a2 = document.createElement(`input`);
  return a2.type = `text`, a2.className = `gp-input`, a2.value = t2 == null ? `` : String(t2), a2.addEventListener(`change`, () => n2(a2.value)), r2.appendChild(i2), r2.appendChild(a2), r2;
}
function we(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.className = `gp-input-wrap`;
  let r2 = document.createElement(`span`);
  r2.className = `gp-input-label`, r2.textContent = e2;
  let i2 = document.createElement(`input`);
  return i2.type = `text`, i2.className = `gp-input`, i2.value = t2 == null ? `` : String(t2), i2.readOnly = true, n2.appendChild(r2), n2.appendChild(i2), n2._setValue = (e3) => {
    i2.value = e3 == null ? `` : String(e3);
  }, n2;
}
function Te(i2) {
  let o2 = n(i2, a), s2 = false, c2 = we(u(`settings.overlayHotkeyCurrent`), e(o2)), l2 = g(u(`settings.overlayHotkeyRecord`), () => {
    s2 = !s2, p2(), s2 && l2.focus();
  }, { small: true });
  l2.dataset.gpHotkeyRecorder = `true`, l2.addEventListener(`blur`, () => {
    s2 && (s2 = false, p2());
  }), l2.addEventListener(`keydown`, (i3) => {
    if (!s2) return;
    i3.preventDefault(), i3.stopPropagation();
    let l3 = t(i3);
    if (!l3) return;
    o2 = n(l3, a);
    let u2 = e(o2);
    c2._setValue(u2), setSettings({ overlayHotkey: o2 }), setOverlayHotkey(o2), s2 = false, p2();
  });
  let f2 = g(u(`settings.overlayHotkeyReset`), () => {
    o2 = { ...a }, c2._setValue(e(o2)), setSettings({ overlayHotkey: o2 }), setOverlayHotkey(o2), s2 = false, p2();
  }, { small: true });
  function p2() {
    l2.textContent = u(s2 ? `settings.overlayHotkeyRecording` : `settings.overlayHotkeyRecord`);
  }
  return [c2, _(l2, f2)];
}
function Ee(e2, t2, n2) {
  if (!e2?.key || !e2?.type) return null;
  let r2 = e2.label || e2.key, i2 = t2?.[e2.key];
  switch (e2.type) {
    case `toggle`:
      return p(r2, i2 === true, (e3) => {
        n2(e3 === true);
      });
    case `select`:
      return y(r2, Array.isArray(e2.options) ? e2.options : [], String(i2 ?? e2.default ?? ``), n2);
    case `slider`:
      return f(r2, Number.isFinite(Number(e2.min)) ? Number(e2.min) : 0, Number.isFinite(Number(e2.max)) ? Number(e2.max) : 100, Number.isFinite(Number(i2)) ? Number(i2) : Number(e2.default) || 0, n2, { step: Number.isFinite(Number(e2.step)) ? Number(e2.step) : 1, commitOnChange: true, formatValue: typeof e2.formatValue == `function` ? e2.formatValue : void 0 });
    case `number`:
      return v(r2, Number(i2 ?? e2.default ?? 0), n2, { min: Number.isFinite(Number(e2.min)) ? Number(e2.min) : void 0, max: Number.isFinite(Number(e2.max)) ? Number(e2.max) : void 0, step: Number.isFinite(Number(e2.step)) ? Number(e2.step) : void 0 });
    case `text`:
      return Ce(r2, i2 ?? e2.default ?? ``, n2);
    case `readonly`:
      return i(typeof i2 == `string` ? `${r2}: ${i2}` : r2);
    default:
      return i(u(`settings.modSettingsUnsupportedField`, r2, e2.type));
  }
}
function renderGeneralSettings(e2) {
  let t2 = getSettings(), n2 = (e3) => `${Math.round(e3)}%`, a2 = (e3) => `${Math.round(e3)} ms`, o2 = t2.scrollSensitivity || {}, s2 = Number(o2.wheel), c2 = Number(o2.discreteMinIntervalMs), l2 = { enabled: o2.enabled !== false, wheel: Number.isFinite(s2) && s2 > 0 ? s2 : 1, discreteMinIntervalMs: Number.isFinite(c2) && c2 >= 0 ? Math.round(c2) : 0 };
  function d2(e3) {
    Object.assign(l2, e3 || {}), setSettings({ scrollSensitivity: { enabled: l2.enabled, wheel: l2.wheel, discreteMinIntervalMs: l2.discreteMinIntervalMs } }), applySettings({ enabled: l2.enabled, wheel: l2.wheel, discreteMinIntervalMs: l2.discreteMinIntervalMs });
  }
  function g2(e3, t3) {
    e3 && (e3.style.opacity = t3 ? `1` : `0.5`, e3.style.pointerEvents = t3 ? `auto` : `none`);
  }
  let _2 = p(u(`settings.builtinTranslations`), t2.builtinTranslations !== false, (e3) => {
    setSettings({ builtinTranslations: e3 === true });
  }), v2 = h(u(`settings.language`), [_2, i(u(`settings.builtinTranslationsReloadHint`))]);
  e2.appendChild(v2);
  let y2 = h(u(`settings.overlayHotkey`), Te(t2.overlayHotkey));
  e2.appendChild(y2);
  let b2 = p(u(`settings.scrollSensitivityEnabled`), l2.enabled, (e3) => {
    d2({ enabled: e3 === true }), g2(x2, l2.enabled), g2(C2, l2.enabled);
  }), x2 = f(u(`settings.scrollSensitivityWheel`), 5, 300, Math.round(l2.wheel * 100), (e3) => {
    d2({ wheel: e3 / 100 });
  }, { step: 5, formatValue: n2 }), C2 = f(u(`settings.scrollSensitivityDiscreteInterval`), 0, 400, l2.discreteMinIntervalMs, (e3) => {
    d2({ discreteMinIntervalMs: Math.round(e3) });
  }, { step: 10, formatValue: a2 });
  g2(x2, l2.enabled), g2(C2, l2.enabled);
  let w2 = h(u(`settings.scrollSensitivity`), [b2, x2, C2]);
  e2.appendChild(w2);
  let T2 = p(u(`settings.debugMode`), t2.debug === true, (e3) => {
    window.gpNext && (window.gpNext.debug = e3), setSettings({ debug: e3 === true });
  }), E2 = h(u(`settings.debugMode`), [T2]);
  e2.appendChild(E2);
  let D2 = p(u(`settings.dynamicPlantRegistry`), t2.dynamicPlantRegistry !== false, (e3) => {
    setSettings({ dynamicPlantRegistry: e3 === true });
  }), O2 = p(u(`settings.shopExtensions`), t2.shopExtensions === true, (e3) => {
    setSettings({ shopExtensions: e3 === true });
  }), k2 = h(u(`settings.runtimeExtensions`), [i(u(`settings.runtimeExtensionsReloadHint`)), D2, O2]);
  e2.appendChild(k2);
}
function renderFrameRate(e2) {
  let t2 = getSettings(), n2 = FRAME_RATE_OPTIONS.map((rate) => ({ value: String(rate), label: `${rate} FPS` })), a2 = n2.some((e3) => e3.value === t2.frameRate) ? t2.frameRate : `120`, o2 = y(u(`settings.frameRate`), n2, a2, (e3) => {
    setSettings({ frameRate: e3 });
    let t3 = l();
    if (t3) {
      applyFrameRate(t3.game, e3);
    }
  });
  e2.appendChild(o2);
}
function renderHealthOverlay(e2) {
  let t2 = $(), n2 = p(u(`settings.showPlantHp`), !!t2.showPlant, (e3) => {
    let t3 = $();
    Q({ showPlant: e3, showZombie: t3.showZombie, showTomb: t3.showTomb }), e3 || t3.showZombie || t3.showTomb ? X() : Z();
  }), r2 = p(u(`settings.showZombieHp`), !!t2.showZombie, (e3) => {
    let t3 = $();
    Q({ showPlant: t3.showPlant, showZombie: e3, showTomb: t3.showTomb }), e3 || t3.showPlant || t3.showTomb ? X() : Z();
  }), i2 = p(u(`settings.showTombHp`), !!t2.showTomb, (e3) => {
    let t3 = $();
    Q({ showPlant: t3.showPlant, showZombie: t3.showZombie, showTomb: e3 }), e3 || t3.showPlant || t3.showZombie ? X() : Z();
  });
  e2.appendChild(n2), e2.appendChild(r2), e2.appendChild(i2);
}
function Ae(e2, { registry: t2 = xe, namespace: n2 = null, pending: r2 = false, draftsByNamespace: i2 = /* @__PURE__ */ new Map() } = {}) {
  let a2 = [], o2 = t2.getRegisteredModSettings().filter((e3) => !n2 || e3.namespace === n2);
  for (let s2 of o2) {
    let w2 = function(e3) {
      e3 && o3.isConnected && [...l2.querySelectorAll(`[data-mod-setting]`)].find((t3) => t3.dataset.modSetting === e3)?.focus({ preventScroll: true });
    }, E2 = function() {
      !v2 || f2 || m2 || (v2 = false, C2().catch((e3) => {
        m2 || S2(e3);
      }));
    };
    let o3 = document.createElement(`div`), c2 = document.createElement(`p`), l2 = document.createElement(`div`);
    c2.setAttribute(`role`, `status`), c2.hidden = true;
    let d2 = document.createElement(`div`);
    o3.append(c2, d2, l2), e2.appendChild(h(n2 ? u(`settings.modSettings`) : s2.title || s2.namespace, [o3], !n2));
    let f2 = false, p2 = false, m2 = false, v2 = false, y2 = 0, b2 = /* @__PURE__ */ new Map();
    i2.has(s2.namespace) || i2.set(s2.namespace, /* @__PURE__ */ new Map());
    let x2 = i2.get(s2.namespace), S2 = (e3) => {
      c2.textContent = u(`settings.modSettingsFailed`) + ` ` + (e3.message || String(e3)), c2.hidden = false;
    };
    async function C2(e3 = null) {
      let n3 = ++y2, r3 = await t2.getModSettings(s2.namespace);
      if (m2 || n3 !== y2) return;
      e3 !== null && (b2.delete(e3), x2.delete(e3));
      let i3 = !f2 && l2.contains(document.activeElement) ? document.activeElement : null, a3 = [];
      for (let e4 of s2.fields || []) {
        if (b2.has(e4.key)) {
          let t3 = b2.get(e4.key);
          a3.push(t3.control), JSON.stringify(t3.value) !== JSON.stringify(r3.values[e4.key]) && (c2.textContent = (e4.label || e4.key) + `: ` + u(`settings.modSettingsConflict`, JSON.stringify(r3.values[e4.key])), c2.hidden = false);
          continue;
        }
        let n4 = x2.get(e4.key), i4 = n4?.review || { value: r3.values[e4.key], editIdentity: r3.editIdentity }, o5 = (n5, r4 = i4) => T2(() => t2.updateModSetting(s2.namespace, e4.key, n5, r4), e4.key, true, (t3) => {
          c2.textContent = u(`settings.modSettingsConflict`, JSON.stringify(t3.currentValue)), d2.appendChild(_(g(u(`settings.modSettingsUseCurrent`), async () => {
            if (!f2) {
              f2 = true, l2.inert = true;
              try {
                await C2(e4.key), d2.replaceChildren(), c2.hidden = true;
              } catch (e5) {
                S2(e5);
              } finally {
                f2 = false, l2.inert = false, w2(e4.key), E2();
              }
            }
          }), g(u(`settings.modSettingsKeepInput`), () => o5(n5, { value: t3.currentValue, editIdentity: t3.editIdentity }))));
        }), p4 = Ee(e4, n4 ? { ...r3.values, [e4.key]: n4.raw } : r3.values, (e5) => o5(e5));
        if (!p4) continue;
        e4.description && (p4.title = e4.description);
        let h2 = p4.querySelector(`input, select, button, [role="switch"]`);
        h2 && (h2.dataset.modSetting = e4.key, h2.setAttribute(`aria-label`, e4.label || e4.key), n4 && (h2.value = n4.raw, b2.set(e4.key, { control: p4, value: n4.review.value }), JSON.stringify(n4.review.value) !== JSON.stringify(r3.values[e4.key]) && (c2.textContent = (e4.label || e4.key) + `: ` + u(`settings.modSettingsConflict`, JSON.stringify(r3.values[e4.key])), c2.hidden = false)), h2.addEventListener(`input`, () => {
          m2 || (b2.set(e4.key, { control: p4, value: i4.value }), x2.set(e4.key, { raw: h2.value, review: structuredClone(i4), revision: n4?.revision ?? r3.revision }));
        })), a3.push(p4);
      }
      let o4 = g(u(`settings.modSettingsReset`), () => T2(() => t2.resetModSettings(s2.namespace), `:reset`), { variant: `danger` });
      o4.dataset.modSetting = `:reset`;
      let p3 = g(u(`settings.modSettingsExport`), () => T2(async () => {
        let e4 = await t2.exportModSettings(s2.namespace);
        if (!navigator.clipboard) throw Error(u(`settings.modSettingsClipboard`));
        await navigator.clipboard.writeText(e4);
      }, `:export`, false));
      if (p3.dataset.modSetting = `:export`, a3.push(_(p3, o4)), a3.forEach((e4, t3) => {
        let n4 = l2.children[t3];
        n4 !== e4 && (n4 ? l2.replaceChild(e4, n4) : l2.appendChild(e4));
      }), i3 && !l2.contains(i3)) {
        w2(i3.dataset.modSetting);
        let e4 = document.activeElement;
        typeof i3.selectionStart == `number` && e4?.setSelectionRange && e4.setSelectionRange(i3.selectionStart, i3.selectionEnd, i3.selectionDirection);
      }
    }
    async function T2(e3, t3, n3 = true, i3 = null) {
      if (f2 || m2) return;
      y2++;
      let a3 = new Map(x2);
      f2 = true, l2.inert = true, c2.hidden = true, d2.replaceChildren();
      let o4;
      try {
        await e3();
      } catch (e4) {
        o4 = e4;
      }
      if (!o4) {
        if (n3) {
          t3 === `:reset` ? b2.clear() : b2.delete(t3);
          for (let [e4, n4] of a3) (t3 === `:reset` || e4 === t3) && x2.get(e4) === n4 && x2.delete(e4);
        }
        try {
          await C2();
        } catch (e4) {
          o4 = e4;
        }
      }
      if (o4) S2(o4), o4.code === `MOD_SETTING_CONFLICT` && i3 && i3(o4);
      else {
        p2 ||= n3;
        let e4 = [];
        n3 || e4.push(u(`settings.modSettingsCopied`)), r2 && p2 && e4.push(u(`selection.restart`)), c2.textContent = e4.join(`
`), c2.hidden = !e4.length;
      }
      f2 = false, l2.inert = false, o4 || w2(t3), E2();
    }
    let D2 = t2.subscribe?.(s2.namespace, () => {
      v2 = true, E2();
    });
    a2.push(() => {
      m2 = true, y2++, D2?.();
    }), C2().catch((e3) => {
      m2 || S2(e3);
    });
  }
  return () => a2.forEach((e3) => e3());
}
export {
  Ae as a,
  bindModSettingsRegistry,
  renderHealthOverlay as i,
  renderGeneralSettings as n,
  ye as o,
  renderFrameRate as r,
  renderFrameRate,
  renderGeneralSettings,
  renderHealthOverlay,
  be as s
};
