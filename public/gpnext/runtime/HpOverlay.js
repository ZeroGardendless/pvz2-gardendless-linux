import { setSettings, getSettings } from "../core/SettingsStore.js";
import { h as n, m as r, p as i, v as a } from "../ui/Translations.js";
import { t } from "../data/EntityInspector.js";
var s = `__gp_hp_label`, c = 200, l = 42, u = 22, d = false, f = null, p = false, m = false, h = false, g = null, _ = /* @__PURE__ */ new Map(), v = /* @__PURE__ */ new Map();
function y() {
  let e2 = getSettings();
  p = e2.hpOverlay?.showPlant === true, m = e2.hpOverlay?.showZombie === true, h = e2.hpOverlay?.showTomb === true;
}
function b() {
  setSettings({ hpOverlay: { showPlant: p, showZombie: m, showTomb: h } });
}
function x(e2) {
  return !!e2 && e2.isValid !== false;
}
function S(e2) {
  return !!e2 && x(e2.node);
}
function C(e2) {
  if (!S(e2) || e2.enabled === false || e2.node?.active === false || e2.node?.activeInHierarchy === false || e2.dead === true || e2.blew === true || e2.fallingInSky === true || e2.displayed === true) return false;
  let t2 = e2.isAlive;
  if (typeof t2 == `function`) try {
    if (t2.call(e2) === false) return false;
  } catch {
  }
  return true;
}
function w(e2, t2) {
  for (let n2 of t2) {
    let t3 = e2?.[n2];
    if (typeof t3 == `number` && Number.isFinite(t3)) return t3;
  }
  return null;
}
function T(e2, t2) {
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
function E(e2, t2) {
  for (let n2 of t2) {
    let t3 = e2?.[n2];
    if (typeof t3 == `number` && Number.isFinite(t3)) return t3;
  }
  return null;
}
function D(e2) {
  let t2 = Array.isArray(e2?.armors) ? e2.armors : [], n2 = 0, r2 = 0;
  for (let e3 of t2) {
    if (!e3) continue;
    let t3 = E(e3, [`health`, `_health`]) ?? 0, i2 = E(e3, [`toughness`]) ?? E(e3?.props, [`Toughness`, `toughness`]) ?? Math.max(t3, 0);
    n2 += Math.max(0, t3), r2 += Math.max(0, i2);
  }
  return { current: n2, max: r2 };
}
function O(e2) {
  let t2 = E(e2, [`paperHealth`, `_paperHealth`]) ?? 0, n2 = E(e2, [`_paperToughness`]) ?? E(e2?.objdataOwn, [`NewspaperHealth`]) ?? E(e2?._objdataOwn, [`NewspaperHealth`]) ?? E(e2?.objdataOwnOrg, [`NewspaperHealth`]) ?? t2, r2 = E(e2, [`ponchoHealth`, `_ponchoHealth`]) ?? 0, i2 = E(e2?.objdataOwn, [`PonchoToughness`]) ?? E(e2?._objdataOwn, [`PonchoToughness`]) ?? E(e2?.objdataOwnOrg, [`PonchoToughness`]) ?? r2, a2 = E(e2, [`plateHealth`, `_plateHealth`]) ?? 0, o2 = E(e2?.objdataOwn, [`ShieldToughness`]) ?? E(e2?._objdataOwn, [`ShieldToughness`]) ?? E(e2?.objdataOwnOrg, [`ShieldToughness`]) ?? a2, s2 = E(e2, [`bdHealth`, `_bdHealth`]) ?? 0, c2 = E(e2?.objdataOwn, [`BoardToughness`]) ?? E(e2?._objdataOwn, [`BoardToughness`]) ?? E(e2?.objdataOwnOrg, [`BoardToughness`]) ?? s2, l2 = t2 + r2 + a2 + s2, u2 = T(e2, [`extraHealth`]) ?? 0;
  return { current: Math.max(0, l2, u2), max: Math.max(0, n2 + i2 + o2 + c2, u2) };
}
function ee(e2) {
  let t2 = E(e2, [`innerHealth`, `_innerHealth`]) ?? 0, n2 = E(e2?.innerZombie, [`toughness`]) ?? E(e2?.innerZombie?.objdataOwn, [`Toughness`]) ?? t2;
  return t2 <= 0 && n2 <= 0 ? null : { current: Math.max(0, t2), max: Math.max(0, n2 || t2) };
}
function k(e2) {
  let t2 = E(e2, [`armorHealth`, `_armorHealth`]) ?? 0, n2 = T(e2, [`armorToughness`]) ?? E(e2?.objdataOwn, [`ArmorToughness`]) ?? E(e2?._objdataOwn, [`ArmorToughness`]) ?? E(e2?.objdataOwnOrg, [`ArmorToughness`]) ?? t2, r2 = E(e2, [`shield_health`, `_shield_health`]) ?? 0, i2 = E(e2?.objdataOwn, [`ShieldToughness`]) ?? E(e2?._objdataOwn, [`ShieldToughness`]) ?? E(e2?.objdataOwnOrg, [`ShieldToughness`]) ?? r2, a2 = E(e2, [`jelly_health`, `_jelly_health`]) ?? 0, o2 = E(e2?.objdataOwn, [`JellyToughness`]) ?? E(e2?._objdataOwn, [`JellyToughness`]) ?? E(e2?.objdataOwnOrg, [`JellyToughness`]) ?? a2, s2 = t2 + r2 + a2, c2 = n2 + i2 + o2;
  return s2 <= 0 && c2 <= 0 ? null : { current: Math.max(0, s2), max: Math.max(0, c2 || s2) };
}
function A(e2) {
  if (!e2) return false;
  if (Array.isArray(e2.armors) || typeof e2.extraHealth == `function`) return true;
  let t2 = String(e2.constructor?.name || e2.name || ``), n2 = I(e2.node);
  return /zombie|undead|walker|zmb/i.test(t2) || /zombie|undead|walker|zmb/i.test(n2);
}
function j(e2) {
  if (!e2) return false;
  let t2 = String(e2.constructor?.name || e2.name || ``);
  return !!(/armor/i.test(t2) || `owner` in e2 && E(e2, [`health`, `_health`]) !== null && (E(e2, [`toughness`]) !== null || E(e2?.props, [`Toughness`, `toughness`]) !== null));
}
function M(e2) {
  if (!e2) return false;
  let t2 = String(e2.constructor?.name || e2.name || ``);
  if (/tomb/i.test(t2) || e2.Tomb_Type_Data != null || e2.Tombstone_Type != null || e2.tombInLnC != null) return true;
  let n2 = I(e2.node);
  return /tomb|grave|gravestone|rack|surfboard|speaker|backpack|tent/i.test(t2) || /tomb|grave|gravestone|rack|surfboard|speaker|backpack|tent/i.test(n2);
}
function N(e2) {
  let t2 = w(e2, [`health`, `Health`, `hp`, `HP`, `_health`, `_hp`, `currentHealth`, `curHealth`, `life`, `blood`, `hitPoints`]) ?? T(e2, [`getHealth`, `getHP`, `getHp`]) ?? w(e2?.data, [`health`, `hp`, `currentHealth`]) ?? w(e2?.stats, [`health`, `hp`, `currentHealth`]) ?? w(e2?.objdataOwn, [`Health`, `health`]) ?? w(e2?._objdataOwn, [`Health`, `health`]);
  if (t2 === null) return null;
  let n2 = w(e2, [`toughness`, `Toughness`, `_toughness`, `maxHealth`, `MaxHealth`, `maxHP`, `hpMax`, `_maxHealth`, `_hpMax`, `maxHp`, `maxLife`, `bloodMax`, `maxHitPoints`]) ?? T(e2, [`getMaxHealth`, `getMaxHP`, `getMaxHp`]) ?? w(e2?.objdataOwn, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? w(e2?._objdataOwn, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? w(e2?.objdataOwnOrg, [`Toughness`, `toughness`]) ?? w(e2?._objdataOwnOrg, [`Toughness`, `toughness`]) ?? w(e2?.props, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? w(e2?.data, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? w(e2?.stats, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]);
  if (A(e2)) {
    let r3 = D(e2), i2 = O(e2), a2 = ee(e2), o2 = t2 + r3.current + i2.current, s2 = (typeof n2 == `number` && Number.isFinite(n2) && n2 > 0 ? n2 : t2) + r3.max + i2.max;
    if (a2) return { current: Math.max(0, Math.round(a2.current)), max: Math.max(0, Math.round(a2.max)), secondaryCurrent: o2 > 0 ? Math.round(o2) : null, secondaryMax: s2 > 0 ? Math.round(s2) : null };
    let c2 = r3.current + i2.current, l2 = r3.max + i2.max;
    return { current: Math.max(0, Math.round(t2)), max: Math.max(0, Math.round(typeof n2 == `number` && Number.isFinite(n2) && n2 > 0 ? n2 : t2)), secondaryCurrent: c2 > 0 ? Math.round(c2) : null, secondaryMax: l2 > 0 ? Math.round(l2) : null };
  }
  let r2 = k(e2);
  return { current: Math.max(0, Math.round(t2)), max: typeof n2 == `number` && Number.isFinite(n2) && n2 > 0 ? Math.round(n2) : null, secondaryCurrent: r2?.current ? Math.round(r2.current) : null, secondaryMax: r2?.max ? Math.round(r2.max) : null };
}
function P(e2, t2) {
  let n2 = [];
  for (let r2 of t2) if (r2) try {
    let t3 = e2.getComponentsInChildren(r2);
    Array.isArray(t3) && t3.length > 0 && n2.push(...t3);
  } catch {
  }
  return n2;
}
function F(e2) {
  let t2 = [], n2 = [], r2 = [], i2 = [e2];
  for (; i2.length > 0; ) {
    let e3 = i2.pop();
    if (!e3) continue;
    let a2 = e3.components || e3._components || [], o2 = I(e3);
    for (let i3 of a2) {
      if (!S(i3) || j(i3) || N(i3) === null) continue;
      if (M(i3)) {
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
function I(e2) {
  let t2 = [], n2 = e2, r2 = 0;
  for (; n2 && r2 < 10; ) t2.push(String(n2.name || ``)), n2 = n2.parent, r2++;
  return t2.join(`/`);
}
function L(e2) {
  let t2 = t(e2);
  return t2 ? { current: t2.current, max: t2.max, secondaryCurrent: t2.secondary?.current ?? null, secondaryMax: t2.secondary?.max ?? null } : null;
}
function R(e2) {
  let t2 = [], n2 = [e2];
  for (; n2.length > 0; ) {
    let e3 = n2.pop();
    if (!e3) continue;
    let r2 = e3.components || e3._components || [];
    for (let e4 of r2) if (S(e4) && !j(e4) && N(e4) !== null) {
      t2.push(e4);
      break;
    }
    let i2 = e3.children || [];
    for (let e4 of i2) n2.push(e4);
  }
  return t2;
}
function z(e2, t2) {
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
function B(e2, t2, n2) {
  let r2 = e2.getChildByName(t2);
  (!r2 || !x(r2)) && (r2 = new n2.Node(t2), e2.addChild(r2)), r2.active = true, r2.layer = e2.layer, n2.UITransform && !r2.getComponent(n2.UITransform) && r2.addComponent(n2.UITransform);
  let i2 = r2.getComponent(n2.Label);
  return i2 ||= r2.addComponent(n2.Label), { node: r2, label: i2 };
}
function V(e2, t2, n2, r2, i2) {
  if (t2.fontSize = r2 ? i2 ? 23 : 28 : i2 ? 22 : 26, t2.lineHeight = r2 ? i2 ? 25 : 30 : i2 ? 24 : 28, t2.overflow = n2.Label.Overflow?.NONE ?? t2.overflow, g) try {
    t2.font = g, t2.isSystemFontUsed = false;
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
function H(e2, t2, n2, r2) {
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
function U(e2) {
  return e2 && typeof e2 == `object` ? e2 : typeof e2 == `number` && Number.isFinite(e2) && e2 > 0 ? { primary: e2 } : {};
}
function W(e2, t2) {
  let n2 = e2.node?.uuid;
  if (!n2) return { primary: String(t2.current), secondary: typeof t2.secondaryCurrent == `number` ? String(t2.secondaryCurrent) : `` };
  let r2 = U(v.get(n2)), i2 = H(r2, `primary`, t2.current, t2.max), a2 = typeof t2.secondaryCurrent == `number` && t2.secondaryCurrent > 0 ? H(r2, `secondary`, t2.secondaryCurrent, t2.secondaryMax) : ``;
  return v.set(n2, r2), { primary: i2, secondary: a2 };
}
function G(e2, t2, n2) {
  let r2 = e2.node?.uuid;
  if (!r2) return null;
  let i2 = _.get(r2);
  if (i2 && x(i2.node) && S(i2.owner) && i2.primaryLabel && i2.secondaryLabel) return i2.node.parent !== e2.node && i2.node.setParent(e2.node), i2.node.layer = e2.node.layer, i2.node.setSiblingIndex(Math.max((e2.node.children?.length || 1) - 1, 0)), i2.primaryNode && (i2.primaryNode.layer = e2.node.layer, i2.primaryNode.active = true), i2.secondaryNode && (i2.secondaryNode.layer = e2.node.layer, i2.secondaryNode.active = true), i2;
  i2?.node && x(i2.node) && (i2.node.destroy(), _.delete(r2));
  let a2 = e2.node.getChildByName(s);
  (!a2 || !x(a2)) && (a2 = new t2.Node(s), e2.node.addChild(a2)), a2.active = true, a2.layer = e2.node.layer, a2.setSiblingIndex(Math.max((e2.node.children?.length || 1) - 1, 0)), t2.UITransform && !a2.getComponent(t2.UITransform) && a2.addComponent(t2.UITransform);
  let o2 = a2.getComponent(t2.Label);
  o2 && (o2.string = ``);
  let c2 = B(a2, `__gp_hp_primary`, t2), l2 = B(a2, `__gp_hp_secondary`, t2);
  c2.node.layer = e2.node.layer, l2.node.layer = e2.node.layer, c2.label.string = ``, l2.label.string = ``;
  let u2 = { owner: e2, node: a2, primaryNode: c2.node, primaryLabel: c2.label, secondaryNode: l2.node, secondaryLabel: l2.label };
  return V(c2.node, c2.label, t2, n2, false), V(l2.node, l2.label, t2, n2, true), _.set(r2, u2), u2;
}
function K(e2, t2) {
  let n2 = e2.owner?.node;
  if (!x(n2) || !x(e2.node)) return;
  let r2 = e2.type === `plant` ? 110 : 96;
  if (t2.UITransform) {
    let i3 = n2.getComponent(t2.UITransform);
    i3?.contentSize?.height && (r2 = e2.type === `plant` ? Math.max(98, Math.round(i3.contentSize.height * 1.5)) : Math.max(88, Math.round(i3.contentSize.height * 1.3)));
  }
  let i2 = e2._stackIndex || 0;
  e2.node.layer = n2.layer, e2.node.setSiblingIndex(Math.max((n2.children?.length || 1) - 1, 0)), e2.primaryNode && (e2.primaryNode.layer = n2.layer), e2.secondaryNode && (e2.secondaryNode.layer = n2.layer), e2.node.setPosition(0, r2 + i2 * l, 0), e2.primaryNode?.setPosition(0, 0, 0), e2.secondaryNode && e2.secondaryNode.setPosition(0, u, 0);
  let a2 = n2.worldScale || n2.getWorldScale?.() || n2.scale, o2 = a2?.x < 0 ? -1 : 1, s2 = a2?.y < 0 ? -1 : 1;
  e2.node.setScale(o2, s2, 1);
}
function q() {
  for (let [e2, t2] of _) (!C(t2.owner) || !x(t2.node)) && (x(t2.node) && t2.node.destroy(), _.delete(e2), v.delete(e2));
}
function J(e2) {
  let t2 = e2?.node?.uuid;
  if (!t2) return;
  let n2 = _.get(t2);
  n2 && x(n2.node) && n2.node.destroy(), _.delete(t2), v.delete(t2);
}
function Y() {
  for (let [, e2] of _) x(e2.node) && e2.node.destroy();
  _.clear(), v.clear();
}
function X(e2) {
  for (let [t2, n2] of _) n2.type === e2 && (x(n2.node) && n2.node.destroy(), _.delete(t2), v.delete(t2));
}
function Z() {
  if (!d) return;
  let e2 = i();
  if (!e2) return;
  let t2 = e2.director?.getScene();
  if (!t2 || t2.name !== `inGameScene`) {
    Y();
    return;
  }
  g ||= z(t2, e2);
  let n2 = r(`Plant`), o2 = a(`chunks:///_virtual/Zombie.ts`, `Zombie`), s2 = r(`Tomb`);
  if (!n2 && !o2 && !s2) return;
  let c2 = P(t2, [n2]), l2 = P(t2, [o2]), u2 = P(t2, [s2]);
  if (c2.length === 0 || l2.length === 0 || u2.length === 0) {
    let e3 = F(t2);
    c2.length === 0 && (c2 = e3.plants), l2.length === 0 && (l2 = e3.zombies), u2.length === 0 && (u2 = e3.tombs);
  }
  l2.length === 0 && (l2 = R(t2).filter((e3) => {
    let t3 = String(e3.constructor?.name || ``), n3 = I(e3.node);
    return /zombie|undead|walker|zmb/i.test(t3) || /zombie|undead|walker|zmb/i.test(n3);
  })), p || X(`plant`), m || X(`zombie`), h || X(`tomb`);
  let f2 = /* @__PURE__ */ new Map(), _2 = (e3, t3) => {
    let n3 = e3?.node?.worldPosition;
    if (!n3) return 0;
    let r2 = `${t3}_${Math.round(n3.x / 48)}_${Math.round(n3.y / 32)}`, i2 = f2.get(r2) || 0;
    return f2.set(r2, i2 + 1), i2;
  };
  if (p) for (let t3 of c2) {
    if (!C(t3)) {
      J(t3);
      continue;
    }
    let n3 = L(t3);
    if (n3 === null || !C(t3)) {
      J(t3);
      continue;
    }
    let r2 = G(t3, e2, true);
    if (!r2) continue;
    r2.type = `plant`, r2._stackIndex = _2(t3, `plant`);
    let i2 = W(t3, n3);
    r2.primaryLabel.string = i2.primary, r2.secondaryLabel.string = i2.secondary, r2.primaryNode.active = !!i2.primary, r2.secondaryNode.active = !!i2.secondary, K(r2, e2);
  }
  if (m) for (let t3 of l2) {
    if (!C(t3)) {
      J(t3);
      continue;
    }
    let n3 = L(t3);
    if (n3 === null || !C(t3)) {
      J(t3);
      continue;
    }
    let r2 = G(t3, e2, false);
    if (!r2) continue;
    r2.type = `zombie`, r2._stackIndex = _2(t3, `zombie`);
    let i2 = W(t3, n3);
    r2.primaryLabel.string = i2.primary, r2.secondaryLabel.string = i2.secondary, r2.primaryNode.active = !!i2.primary, r2.secondaryNode.active = !!i2.secondary, K(r2, e2);
  }
  if (h) for (let t3 of u2) {
    if (!C(t3)) {
      J(t3);
      continue;
    }
    let n3 = L(t3);
    if (n3 === null || !C(t3)) {
      J(t3);
      continue;
    }
    let r2 = G(t3, e2, false);
    if (!r2) continue;
    r2.type = `tomb`, r2._stackIndex = _2(t3, `tomb`);
    let i2 = W(t3, n3);
    r2.primaryLabel.string = i2.primary, r2.secondaryLabel.string = i2.secondary, r2.primaryNode.active = !!i2.primary, r2.secondaryNode.active = !!i2.secondary, K(r2, e2);
  }
  q();
}
function Q() {
  d || (d = true, Z(), f = setInterval(Z, c));
}
function te() {
  !d && !f && _.size === 0 || (d = false, f &&= (clearInterval(f), null), Y(), g = null);
}
function ne(e2 = {}) {
  typeof e2.showPlant == `boolean` && (p = e2.showPlant), typeof e2.showZombie == `boolean` && (m = e2.showZombie), typeof e2.showTomb == `boolean` && (h = e2.showTomb), b(), d && (p || X(`plant`), m || X(`zombie`), h || X(`tomb`), Z());
}
function $() {
  return { showPlant: p, showZombie: m, showTomb: h };
}
function re() {
  let e2 = { plant: 0, zombie: 0, tomb: 0, unknown: 0 };
  for (let [, t2] of _) {
    let n2 = t2?.type || `unknown`;
    e2[n2] = (e2[n2] || 0) + 1;
  }
  return { enabled: d, timerActive: !!f, labelCount: _.size, byType: e2, visibility: $() };
}
function ie(e2 = null) {
  let t2 = e2 || n();
  if (!t2) return { status: `unavailable`, reason: `scene-unavailable` };
  let i2 = r(`Plant`), o2 = a(`chunks:///_virtual/Zombie.ts`, `Zombie`), s2 = r(`Tomb`), c2 = P(t2, [i2]), l2 = P(t2, [o2]), u2 = P(t2, [s2]), d2 = { plant: false, zombie: false, tomb: false };
  if (c2.length === 0 || l2.length === 0 || u2.length === 0) {
    let e3 = F(t2);
    i2 || (d2.plant = true), o2 || (d2.zombie = true), s2 || (d2.tomb = true), c2.length === 0 && e3.plants.length > 0 && (c2 = e3.plants, d2.plant = true), l2.length === 0 && e3.zombies.length > 0 && (l2 = e3.zombies, d2.zombie = true), u2.length === 0 && e3.tombs.length > 0 && (u2 = e3.tombs, d2.tomb = true);
  }
  return { status: `available`, source: d2.plant || d2.zombie || d2.tomb ? `class+fallback-scan` : `class-scan`, counts: { plant: c2.length, zombie: l2.length, tomb: u2.length }, classAvailable: { plant: !!i2, zombie: !!o2, tomb: !!s2 }, fallbackUsed: d2 };
}
y(), (p || m || h) && Q();
export {
  $ as a,
  ie as i,
  Q as n,
  ne as o,
  re as r,
  te as t
};
