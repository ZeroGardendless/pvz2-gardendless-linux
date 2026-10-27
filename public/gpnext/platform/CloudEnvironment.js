import { c as e, i as t, n, t as r } from "./CloudJson.js";
import { a as i, d as a, f as o, n as s, o as c, t as l } from "./CloudSelection.js";
import { a as u, d } from "../runtime/TrainerShortcuts.js";
import "../mods/ModConfigurationState.js";
var f = (e2) => e2 && typeof e2 == `object` && !Array.isArray(e2), p = (e2) => {
  throw Error(e2);
};
function m(e2, n2) {
  (e2.game.version !== n2.game.version || e2.game.gpNextVersion !== n2.game.gpNextVersion || t(e2.environment) !== t(n2.environment)) && p(`CLOUD_ENVIRONMENT_MISMATCH`);
}
async function h({ exported: h2, components: g2, currentEnvironment: _2, selection: v, context: y, createId: b }) {
  let x = Object.fromEntries(await Promise.all(Object.entries(g2).map(async ([e2, t2]) => [e2, await t2.read()])));
  await l(y, { format: `gpn-cloud-source`, version: 1, components: x }, y.sourceObjects);
  let S = i(v, y), C = S.preferenceFields, w = {}, T = [], E = null, D = false, O = true;
  if (h2.save) {
    let n2 = e(new TextEncoder().encode(t(h2.save)));
    (S.players.length || S.globalData === `replace`) && m(n2, _2);
    let i2 = x.nativeSettings;
    i2.present && !f(i2.value) && p(`CLOUD_SETTINGS`);
    let a2 = { ...i2.value || {} };
    if (S.nativeSettings) for (let [e2, t2] of Object.entries(n2.settings)) e2 !== `PlayerIndex` && (a2[e2] = t2);
    if (S.players.length || S.globalData === `replace`) {
      let e2 = s({ save: n2, current: x, plan: S, createId: b });
      if (T = e2.changes, e2.playerIndex !== null && (E = { index: e2.playerIndex, name: typeof e2.players[e2.playerIndex].name == `string` ? Array.from(e2.players[e2.playerIndex].name).slice(0, 80).join(``) : `` }), S.players.length && (w.players = { present: true, value: e2.players }), w.modData = e2.modData, e2.playerIndex !== null && (a2.PlayerIndex = e2.playerIndex), S.players.some((e3) => e3.mode === `replace`)) {
        let t2 = c({ allPlayers: e2.players, native: a2, records: e2.modData, environment: n2.environment, game: n2.game }, { playerIndices: e2.players.map((e3, t3) => t3), nativeSettings: true, globalData: true }), i3 = structuredClone(n2);
        delete i3.preferenceId, O = await r(t2) !== await r(i3);
      }
    } else S.activePlayer !== null && p(`CLOUD_ACTIVE_PLAYER`);
    (S.nativeSettings || t(a2) !== t(i2.value || {})) && (w.nativeSettings = { present: true, value: a2 });
  }
  if (C.length) {
    h2.preferences || p(`CLOUD_PREFERENCES_MISSING`);
    let e2 = o(h2.preferences);
    (new Set(C).size !== C.length || C.some((t3) => !Object.hasOwn(e2.settings, t3))) && p(`CLOUD_PREFERENCE_SELECTION`);
    let t2 = await g2.preferences.read();
    w.preferences = n(t2, 32e3), C.includes(`overlayHotkey`) && u(e2.settings.overlayHotkey, t2, `overlay`) && p(`CLOUD_HOTKEY_CONFLICT`);
    for (let n2 of C) {
      let r2 = e2.settings[n2];
      if (n2 === `overlayHotkey`) {
        w.preferences[n2] = d(r2);
        continue;
      }
      w.preferences[n2] = f(r2) ? { ...t2[n2], ...r2 } : r2;
    }
    D = C.length !== Object.keys(e2.settings).length || await r(a(w.preferences, Object.keys(e2.settings))) !== await r(e2);
  }
  return Object.keys(w).length || p(`CLOUD_EMPTY_SELECTION`), { targets: w, summary: { changes: T, activePlayer: E, nativeSettings: S.nativeSettings, nativeFields: S.nativeSettings ? Object.keys(h2.save.settings).filter((e2) => e2 !== `PlayerIndex`) : [], globalData: S.globalData, preferenceFields: C, clearPreferencesBaseline: D, clearSaveBaseline: O && Object.keys(w).some((e2) => e2 !== `preferences`) } };
}
var g = (e2) => `gp-next-host:${e2}`;
async function _(e2, t2 = {}) {
  if (!e2 || e2.journal || e2.recovery?.required || !e2.active) throw Error(`CLOUD_CONFIGURATION_BUSY`);
  let n2 = e2.active, i2 = n2.packages.map((e3) => ({ modId: e3.id, version: e3.version, contentDigest: e3.contentDigest }));
  for (let e3 of n2.configuration.overrides || []) {
    let t3 = g(e3.kind);
    if (i2.some((e4) => e4.modId === t3)) throw Error(`CLOUD_ENVIRONMENT_COLLISION`);
    i2.push({ modId: t3, version: `1`, contentDigest: e3.contentDigest });
  }
  let a2 = `gp-next-host:runtime`;
  if (i2.some((e3) => e3.modId === a2)) throw Error(`CLOUD_ENVIRONMENT_COLLISION`);
  return i2.push({ modId: a2, version: `1`, contentDigest: await r({ entityLedger: n2.entityLedger ?? null, modSettings: n2.configuration.modSettings || { version: 1, mods: {} }, runtime: { dynamicPlantRegistry: t2.dynamicPlantRegistry === true, shopExtensions: t2.shopExtensions === true, jsModding: t2.experimental?.jsModding === true, worldMapJson: t2.experimental?.worldMapJson === true, plantLevelSystem: t2.experimental?.plantLevelSystem === true } }) }), { environment: i2, configurationDigest: await r(e2) };
}
export {
  h as n,
  _ as t
};
