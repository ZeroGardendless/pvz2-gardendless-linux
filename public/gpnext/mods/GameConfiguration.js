import { f as e } from "../platform/FileSystem.js";
var t = `1.5.5`, n = e.AppData, r = { ROOT: `gp-next`, PACKS_ROOT: `gp-next\\packs`, SINGLE_PATCHES: `gp-next\\patches`, GPN_EDITS: `gp-next\\__gpn_edits` }, i = `gp-next\\settings.json`, a = `gp-next/mod-settings.json`, o = [{ type: `PlantFeatures`, key: `PLANTS`, extraKeys: [{ key: `SEEDCHOOSERDEFAULTORDER` }, { key: `ALMANACHIDDENORDER` }, { key: `BASEUNLOCKLIST` }, { key: `SANDBOX` }] }, { type: `ZombieFeatures`, key: `ZOMBIES`, extraKeys: [{ key: `ALMANAC` }] }, { type: `ProjectileFeatures`, key: `PROJECTILES` }, { type: `TombstonesFeatures`, key: `Tombstones` }, { type: `UpgradeFeatures`, key: `UPGRADES` }, { type: `ArmorFeatures`, key: `ARMORS` }, { type: `DinosaurFeatures`, key: `DINOSAURS` }, { type: `LawnFeatures`, key: `LAWNS` }, { type: `TrophyFeatures`, key: `TROPHIES` }, { type: `TilesFeatures`, key: `Tiles` }, { type: `TileLiquidsFeatures`, key: `Tiles` }, { type: `MintObtainRoute`, key: `ROUTES`, idKey: `Family` }, { type: `PinataFeatures`, key: `PINATAS` }, { type: `VaseFeatures`, key: `VASES` }, { type: `NoteFeatures`, key: `NOTES` }, { type: `StoreCommodityFeatures`, key: null, extraKeys: [{ key: `Plants`, idKey: `CommodityName`, typeFilter: { field: `CommodityType`, value: `plant` } }, { key: `Upgrade`, idKey: `CommodityName`, typeFilter: { field: `CommodityType`, value: `upgrade` } }, { key: `Gem` }, { key: `Coin` }, { key: `Zen` }] }, { type: `WorldmapFeatures`, key: `WORLDMAPS` }], s = [{ type: `PlantAlmanac` }, { type: `PlantProps` }, { type: `PlantTypes` }, { type: `ZombieAlmanac` }, { type: `ZombieProps` }, { type: `ZombieTypes` }, { type: `BoardGridMaps` }, { type: `_GridItemProps`, deprecated: true }, { type: `GridItemTypes`, deprecated: true }, { type: `ProjectileProps` }, { type: `ProjectileTypes` }, { type: `TileProps` }, { type: `TileLiquidProps` }, { type: `TombstoneProps` }, { type: `ArmorProps` }, { type: `ArmorTypes` }, { type: `LawnProps` }, { type: `DinosaurTypes` }, { type: `DinosaurProps` }, { type: `RectangleProps` }, { type: `PortalTypes` }, { type: `PortalProps` }, { type: `PropertySheets` }, { type: `NarrativeList` }, { type: `LevelModules` }], c = [...o.map((e2) => e2.type), ...s.filter((e2) => !e2.deprecated).map((e2) => e2.type)], l = (e2, t2) => JSON.stringify([e2, String(t2)]);
function u(e2) {
  try {
    let t2 = JSON.parse(e2);
    return Array.isArray(t2) && t2.length === 2 && t2.every((e3) => typeof e3 == `string`) ? t2 : null;
  } catch {
    return null;
  }
}
function d(e2, t2) {
  if (!t2) return [];
  if (e2.key) {
    let n3 = e2.idKey || `CODENAME`;
    return (t2[e2.key] || []).map((e3) => ({ id: e3[n3] === void 0 ? `?` : String(e3[n3]), label: e3[n3] === void 0 ? `?` : String(e3[n3]), name: e3.NAME }));
  }
  let n2 = [];
  for (let r2 of e2.extraKeys || []) if (!(!r2.idKey || !t2[r2.key])) for (let e3 of t2[r2.key]) n2.push({ id: l(r2.key, e3[r2.idKey] ?? `?`), label: `${r2.key}: ${e3[r2.idKey] ?? `?`}`, name: e3.NAME });
  return n2;
}
function f(e2, t2, n2) {
  if (!t2) return null;
  if (e2.key) {
    let r3 = e2.idKey || `CODENAME`, i3 = (t2[e2.key] || []).find((e3) => String(e3[r3]) === n2);
    return i3 ? { entry: i3, section: e2.key, idKey: r3 } : null;
  }
  let r2 = u(n2), i2 = [];
  for (let a2 of e2.extraKeys || []) {
    if (!a2.idKey || !t2[a2.key] || r2 && r2[0] !== a2.key) continue;
    let e3 = t2[a2.key].find((e4) => String(e4[a2.idKey]) === (r2 ? r2[1] : n2));
    e3 && i2.push({ entry: e3, section: a2.key, idKey: a2.idKey });
  }
  return i2.length === 1 ? i2[0] : null;
}
export {
  s as a,
  t as c,
  d,
  u as f,
  a as i,
  l,
  o as n,
  n as o,
  r,
  i as s,
  c as t,
  f as u
};
