var e = [[`_codename`], [`codename`], [`CODENAME`], [`TypeName`], [`typeName`], [`_typeName`], [`Plant_Type`], [`PlantType`], [`plantType`], [`plantTypeString`], [`Zombie_Type`], [`ZombieType`], [`zombieType`], [`Projectile_Type`], [`ProjectileType`], [`projectileType`], [`Plant_Type_Data`, `CODENAME`], [`Zombie_Type_Data`, `CODENAME`], [`Projectile_Type_Data`, `CODENAME`], [`TypeData`, `CODENAME`], [`filled_type`, `CODENAME`], [`_filled_type`, `CODENAME`], [`PF`, `CODENAME`], [`feature`, `CODENAME`], [`_feature`, `CODENAME`], [`plantFeature`, `CODENAME`], [`_plantFeature`, `CODENAME`], [`_objdataOwn`, `CODENAME`], [`objdataOwn`, `CODENAME`], [`_objdata`, `CODENAME`], [`objdata`, `CODENAME`]];
function t(e2, t2) {
  let n2 = e2;
  for (let e3 of t2) {
    if (n2 == null) return null;
    try {
      n2 = n2[e3];
    } catch {
      return null;
    }
  }
  return n2;
}
function n(n2) {
  for (let r2 of e) {
    let e2 = t(n2, r2);
    if (typeof e2 != `string`) continue;
    let i2 = e2.trim();
    if (i2) return i2;
  }
  return null;
}
function r(e2, t2) {
  for (let n2 of t2) {
    let t3 = e2?.[n2];
    if (typeof t3 == `number` && Number.isFinite(t3)) return t3;
  }
  return null;
}
function i(e2, t2) {
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
function a(e2, t2) {
  return r(e2, t2);
}
function o(e2) {
  let t2 = Array.isArray(e2?.armors) ? e2.armors : [], n2 = 0, r2 = 0;
  for (let e3 of t2) {
    if (!e3) continue;
    let t3 = a(e3, [`health`, `_health`]) ?? 0, i2 = a(e3, [`toughness`]) ?? a(e3?.props, [`Toughness`, `toughness`]) ?? Math.max(t3, 0);
    n2 += Math.max(0, t3), r2 += Math.max(0, i2);
  }
  return { current: n2, max: r2 };
}
function s(e2) {
  let t2 = a(e2, [`paperHealth`, `_paperHealth`]) ?? 0, n2 = a(e2, [`_paperToughness`]) ?? a(e2?.objdataOwn, [`NewspaperHealth`]) ?? a(e2?._objdataOwn, [`NewspaperHealth`]) ?? a(e2?.objdataOwnOrg, [`NewspaperHealth`]) ?? t2, r2 = a(e2, [`ponchoHealth`, `_ponchoHealth`]) ?? 0, o2 = a(e2?.objdataOwn, [`PonchoToughness`]) ?? a(e2?._objdataOwn, [`PonchoToughness`]) ?? a(e2?.objdataOwnOrg, [`PonchoToughness`]) ?? r2, s2 = a(e2, [`plateHealth`, `_plateHealth`]) ?? 0, c2 = a(e2?.objdataOwn, [`ShieldToughness`]) ?? a(e2?._objdataOwn, [`ShieldToughness`]) ?? a(e2?.objdataOwnOrg, [`ShieldToughness`]) ?? s2, l2 = a(e2, [`bdHealth`, `_bdHealth`]) ?? 0, u2 = a(e2?.objdataOwn, [`BoardToughness`]) ?? a(e2?._objdataOwn, [`BoardToughness`]) ?? a(e2?.objdataOwnOrg, [`BoardToughness`]) ?? l2, d2 = i(e2, [`extraHealth`]) ?? 0;
  return { current: Math.max(0, t2 + r2 + s2 + l2, d2), max: Math.max(0, n2 + o2 + c2 + u2, d2) };
}
function c(e2) {
  let t2 = a(e2, [`innerHealth`, `_innerHealth`]) ?? 0, n2 = a(e2?.innerZombie, [`toughness`]) ?? a(e2?.innerZombie?.objdataOwn, [`Toughness`]) ?? t2;
  return t2 <= 0 && n2 <= 0 ? null : { current: Math.max(0, t2), max: Math.max(0, n2 || t2) };
}
function l(e2) {
  let t2 = a(e2, [`armorHealth`, `_armorHealth`]) ?? 0, n2 = i(e2, [`armorToughness`]) ?? a(e2?.objdataOwn, [`ArmorToughness`]) ?? a(e2?._objdataOwn, [`ArmorToughness`]) ?? a(e2?.objdataOwnOrg, [`ArmorToughness`]) ?? t2, r2 = a(e2, [`shield_health`, `_shield_health`]) ?? 0, o2 = a(e2?.objdataOwn, [`ShieldToughness`]) ?? a(e2?._objdataOwn, [`ShieldToughness`]) ?? a(e2?.objdataOwnOrg, [`ShieldToughness`]) ?? r2, s2 = a(e2, [`jelly_health`, `_jelly_health`]) ?? 0, c2 = a(e2?.objdataOwn, [`JellyToughness`]) ?? a(e2?._objdataOwn, [`JellyToughness`]) ?? a(e2?.objdataOwnOrg, [`JellyToughness`]) ?? s2, l2 = t2 + r2 + s2, u2 = n2 + o2 + c2;
  return l2 <= 0 && u2 <= 0 ? null : { current: Math.max(0, l2), max: Math.max(0, u2 || l2) };
}
function u(e2) {
  if (!e2) return false;
  if (Array.isArray(e2.armors) || typeof e2.extraHealth == `function`) return true;
  let t2 = String(e2.constructor?.name || e2.name || ``), n2 = String(e2.node?.name || ``);
  return /zombie|undead|walker|zmb/i.test(t2) || /zombie|undead|walker|zmb/i.test(n2);
}
function d(e2) {
  let t2 = r(e2, [`health`, `Health`, `hp`, `HP`, `_health`, `_hp`, `currentHealth`, `curHealth`, `life`, `blood`, `hitPoints`]) ?? i(e2, [`getHealth`, `getHP`, `getHp`]) ?? r(e2?.data, [`health`, `hp`, `currentHealth`]) ?? r(e2?.stats, [`health`, `hp`, `currentHealth`]) ?? r(e2?.objdataOwn, [`Health`, `health`]) ?? r(e2?._objdataOwn, [`Health`, `health`]);
  if (t2 === null) return null;
  let n2 = r(e2, [`toughness`, `Toughness`, `_toughness`, `maxHealth`, `MaxHealth`, `maxHP`, `hpMax`, `_maxHealth`, `_hpMax`, `maxHp`, `maxLife`, `bloodMax`, `maxHitPoints`]) ?? i(e2, [`getMaxHealth`, `getMaxHP`, `getMaxHp`]) ?? r(e2?.objdataOwn, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? r(e2?._objdataOwn, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? r(e2?.objdataOwnOrg, [`Toughness`, `toughness`]) ?? r(e2?._objdataOwnOrg, [`Toughness`, `toughness`]) ?? r(e2?.props, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? r(e2?.data, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]) ?? r(e2?.stats, [`Toughness`, `toughness`, `maxHealth`, `maxHp`]);
  if (u(e2)) {
    let r2 = o(e2), i2 = s(e2), a3 = c(e2), l2 = t2 + r2.current + i2.current, u2 = (typeof n2 == `number` && n2 > 0 ? n2 : t2) + r2.max + i2.max;
    return a3 ? { current: a3.current, max: a3.max, secondaryCurrent: l2 > 0 ? l2 : null, secondaryMax: u2 > 0 ? u2 : null } : { current: t2, max: typeof n2 == `number` && n2 > 0 ? n2 : t2, secondaryCurrent: r2.current + i2.current > 0 ? r2.current + i2.current : null, secondaryMax: r2.max + i2.max > 0 ? r2.max + i2.max : null };
  }
  let a2 = l(e2);
  return { current: t2, max: typeof n2 == `number` && n2 > 0 ? n2 : null, secondaryCurrent: a2?.current > 0 ? a2.current : null, secondaryMax: a2?.max > 0 ? a2.max : null };
}
function f(e2) {
  if (!e2) return -1;
  let t2 = +!!Number.isFinite(e2.current);
  return Number.isFinite(e2.max) && e2.max > 0 && (t2 += 4), Number.isFinite(e2.secondaryCurrent) && (t2 += 1), Number.isFinite(e2.secondaryMax) && e2.secondaryMax > 0 && (t2 += 2), t2;
}
function p(e2, t2) {
  return e2 ? t2 ? { current: e2.current ?? t2.current ?? null, max: e2.max > 0 ? e2.max : t2.max > 0 ? t2.max : null, secondaryCurrent: e2.secondaryCurrent ?? t2.secondaryCurrent ?? null, secondaryMax: e2.secondaryMax > 0 ? e2.secondaryMax : t2.secondaryMax > 0 ? t2.secondaryMax : null } : e2 : t2;
}
function m(e2) {
  return e2 ? /armor/i.test(String(e2.constructor?.name || e2.name || ``)) ? true : `owner` in e2 && a(e2, [`health`, `_health`]) !== null && (a(e2, [`toughness`]) !== null || a(e2?.props, [`Toughness`, `toughness`]) !== null) : false;
}
function h(e2, t2) {
  let n2 = null, r2 = -1;
  for (let i2 of e2?.components || e2?._components || []) {
    if (!i2 || i2 !== t2 && m(i2)) continue;
    let e3 = d(i2), a2 = f(e3);
    a2 > r2 && (n2 = e3, r2 = a2);
  }
  return n2;
}
function g(e2) {
  return Number.isFinite(e2) ? Math.max(0, Math.round(e2)) : null;
}
function _(e2, t2) {
  let n2 = g(e2);
  if (n2 === null) return null;
  let r2 = g(t2);
  return { current: n2, max: r2, ratio: r2 > 0 ? Math.max(0, Math.min(1, n2 / r2)) : null };
}
function v(e2) {
  let t2 = p(d(e2), h(e2?.node, e2));
  if (!t2) return null;
  let n2 = _(t2.current, t2.max);
  if (!n2) return null;
  let r2 = _(t2.secondaryCurrent, t2.secondaryMax), i2 = n2.current + (r2?.current || 0), a2 = n2.max != null && (!r2 || r2.max != null) ? n2.max + (r2?.max || 0) : null;
  return { current: n2.current, max: n2.max, ratio: n2.ratio, secondary: r2, totalCurrent: i2, totalMax: a2 };
}
export {
  n,
  v as t
};
