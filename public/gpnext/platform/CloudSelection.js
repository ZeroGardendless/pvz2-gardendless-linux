import { a as e, c as t, i as n, l as r, n as i, o as a, s as o, t as s } from "./CloudJson.js";
import { i as c, r as l } from "../mods/ModOwnedData.js";
import { t as u } from "./CloudPortablePreferences.js";
var d = e.preferenceMaxBytes, f = Object.freeze([`theme`, `locale`, `builtinTranslations`, `hpOverlay`]), p = [...f, `overlayHotkey`, `scrollSensitivity`, `frameRate`], m = (e2) => {
  if (!e2) throw Error(`CLOUD_PREFERENCES`);
};
function h(e2) {
  let t2 = o(new TextEncoder().encode(JSON.stringify(i(e2, d)))), n2 = t2.settings.overlayHotkey;
  return n2 && m(/^(?:F(?:[1-9]|1[0-9]|2[0-4])|Key[A-Z]|Digit[0-9]|Arrow(?:Up|Down|Left|Right)|Space|Tab|Enter|Escape|Backquote|Minus|Equal|BracketLeft|BracketRight|Backslash|Semicolon|Quote|Comma|Period|Slash|Home|End|PageUp|PageDown|Insert|Delete)$/.test(n2.code)), t2;
}
function g(e2, t2 = f) {
  return m(Array.isArray(t2) && t2.length > 0 && new Set(t2).size === t2.length && t2.every((e3) => p.includes(e3))), h({ format: `gardenest-preferences`, version: 1, settings: Object.fromEntries(t2.map((t3) => [t3, e2[t3]])) });
}
var _ = (e2) => new TextEncoder().encode(e2), v = () => {
  throw Error(`CLOUD_DOWNLOAD_IDENTITY`);
};
function y(e2) {
  (!e2 || ![`save`, `preferences`].includes(e2.kind) || !Array.isArray(e2.objects) || e2.objects.length < 1 || e2.objects.length > 2) && v();
  let r2 = null, i2 = null, s2 = null;
  for (let n2 of e2.objects) n2.kind === `save` ? ((r2 || e2.kind !== `save` || n2.id !== e2.snapshotId) && v(), r2 = t(_(n2.text))) : n2.kind === `preferences` ? ((i2 || e2.kind === `preferences` && n2.id !== e2.snapshotId) && v(), i2 = h(o(_(n2.text))), s2 = n2.id) : v();
  e2.kind === `save` && (!r2 || (r2.preferenceId ?? null) !== s2) && v(), e2.kind === `preferences` && (!i2 || r2) && v();
  let c2 = { format: `gardenest-backup`, version: 1, save: r2, preferences: i2 };
  return a(_(n(c2))), { exported: c2, snapshotId: e2.snapshotId, grantId: e2.grantId, kind: e2.kind };
}
var b = `__gpNextSaveId`, x = r, S = (e2) => {
  throw Error(e2);
};
function C(t2) {
  (!Array.isArray(t2) || !t2.length || t2.length > e.maxPlayers || t2.some((e2) => !e2 || typeof e2 != `object` || Array.isArray(e2))) && S(`CLOUD_PLAYERS`);
  let n2 = /* @__PURE__ */ new Set();
  for (let e2 of t2) {
    let t3 = e2[b];
    t3 !== void 0 && ((typeof t3 != `string` || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(t3) || n2.has(t3)) && S(`CLOUD_SAVE_IDENTITY`), n2.add(t3));
  }
  return n2;
}
function w(t2, n2) {
  let r2 = C(n2), i2 = /* @__PURE__ */ new Set();
  return (!Array.isArray(t2) || t2.length > e.maxModRecords) && S(`CLOUD_MOD_DATA_COUNT`), t2.map((e2) => {
    let t3 = c(e2, e2?.identity), n3 = JSON.stringify(t3.identity);
    return i2.has(n3) && S(`CLOUD_MOD_DATA_DUPLICATE`), i2.add(n3), t3.identity.kind === `save` && !r2.has(t3.identity.saveId) && S(`CLOUD_MOD_DATA_ORPHAN`), t3;
  });
}
function T({ allPlayers: e2, native: n2, records: r2, environment: a2, game: o2 }, { playerIndices: s2, nativeSettings: c2 = true, globalData: l2 = false } = {}) {
  C(e2);
  let u2 = s2 ?? e2.map((e3, t2) => t2);
  (!Array.isArray(u2) || !u2.length || new Set(u2).size !== u2.length || u2.some((t2, n3) => !Number.isSafeInteger(t2) || t2 < 0 || t2 >= e2.length || n3 && t2 <= u2[n3 - 1])) && S(`CLOUD_PLAYER_SELECTION`);
  let d2 = u2.map((t2) => e2[t2]);
  (!n2 || typeof n2 != `object` || Array.isArray(n2)) && S(`CLOUD_SETTINGS`);
  let f2 = c2 ? Object.fromEntries(x.filter((e3) => Object.hasOwn(n2, e3)).map((e3) => [e3, n2[e3]])) : {};
  if (c2 && Object.hasOwn(f2, `PlayerIndex`)) {
    (!Number.isSafeInteger(f2.PlayerIndex) || f2.PlayerIndex < 0 || f2.PlayerIndex >= e2.length) && S(`CLOUD_PLAYER_INDEX`);
    let t2 = u2.indexOf(f2.PlayerIndex);
    t2 < 0 ? delete f2.PlayerIndex : f2.PlayerIndex = t2;
  }
  let p2 = C(d2), m2 = w(r2, e2).filter((e3) => e3.identity.kind === `global` ? l2 : p2.has(e3.identity.saveId));
  return t(new TextEncoder().encode(JSON.stringify(i({ format: `gardenest-save`, version: 1, game: o2, players: d2, settings: f2, modData: m2, environment: a2 }))));
}
function E({ local: e2, remote: t2, baseline: n2 }) {
  return e2 === t2 ? `equal` : n2 ? e2 === n2 ? `remote_changed` : t2 === n2 ? `local_changed` : `conflict` : `choose`;
}
var D = (e2) => {
  throw Error(e2);
}, O = (e2, t2) => {
  (!e2 || typeof e2 != `object` || Array.isArray(e2) || Object.keys(e2).length !== t2.length || t2.some((t3) => !Object.hasOwn(e2, t3))) && D(`CLOUD_SELECTION`);
}, k = (e2, t2) => Number.isSafeInteger(e2) && e2 >= 0 && e2 < t2, A = (e2) => Array.isArray(e2) && new Set(e2).size === e2.length, j = (e2, t2) => [...new Set(e2.filter((e3) => e3.identity.kind === `save` && e3.identity.saveId === t2).map((e3) => e3.identity.modId))].sort(), M = (e2) => [...new Set(e2.filter((e3) => e3.identity.kind === `global`).map((e3) => e3.identity.modId))].sort(), N = (e2) => e2.map(({ id: e3, kind: t2, digest: n2, bytes: r2, etag: i2 }) => ({ id: e3, kind: t2, digest: n2, bytes: r2, etag: i2 ?? null })), P = (e2, t2) => e2.map((e3, n2) => ({ index: n2, name: typeof e3.name == `string` ? Array.from(e3.name).slice(0, 80).join(``) : ``, id: e3.__gpNextSaveId ?? null, mods: j(t2, e3.__gpNextSaveId) })), F = (e2, t2) => {
  if (e2.length) w(t2, e2);
  else for (let e3 of t2) c(e3, e3.identity), e3.identity.kind === `save` && D(`CLOUD_MOD_DATA_ORPHAN`);
};
async function I({ mode: e2, sourceBackup: t2, sourceId: n2, sourceObjects: a2 = [], exported: o2 = {} }) {
  let c2 = t2.components, l2 = c2.players.present ? c2.players.value : [];
  F(l2, c2.modData);
  let d2 = e2 === `capture` ? l2 : o2.save?.players || [], f2 = e2 === `capture` ? c2.modData : o2.save?.modData || [], p2 = e2 === `capture` ? c2.nativeSettings.value || {} : o2.save?.settings || {}, m2 = { mode: e2, sourceId: n2, sourceObjects: N(a2), backupDigest: await s(t2), local: { players: P(l2, c2.modData), activeIndex: k(c2.nativeSettings.value?.PlayerIndex, l2.length) ? c2.nativeSettings.value.PlayerIndex : l2.length ? 0 : null }, source: { players: P(d2, f2), activeIndex: e2 === `capture` ? c2.nativeSettings.value?.PlayerIndex ?? 0 : o2.save?.settings?.PlayerIndex ?? 0, nativeFields: Object.keys(p2).filter((e3) => e3 !== `PlayerIndex` && r.includes(e3)), preferenceFields: e2 === `capture` ? [...u] : Object.keys(o2.preferences?.settings || {}), globalMods: M(f2) } };
  return e2 === `capture` && (m2.backupScope = c2.preferences.cloudBackup || { players: true, nativeSettings: true, preferenceFields: [...u] }), i({ ...m2, binding: await s(m2) }, 256e3);
}
function L(e2, t2) {
  if (e2?.binding !== t2.binding && D(`CLOUD_SELECTION_CHANGED`), t2.mode === `capture`) O(e2, [`binding`, `playerIndices`, `nativeSettings`, `globalData`, `preferenceFields`]), (!A(e2.playerIndices) || e2.playerIndices.some((n2, r2) => !k(n2, t2.source.players.length) || r2 && n2 <= e2.playerIndices[r2 - 1])) && D(`CLOUD_PLAYER_SELECTION`), (typeof e2.nativeSettings != `boolean` || typeof e2.globalData != `boolean` || e2.globalData && !t2.source.globalMods.length) && D(`CLOUD_SELECTION`), !e2.playerIndices.length && (e2.nativeSettings || e2.globalData) && D(`CLOUD_BACKUP_REQUIRES_PLAYERS`), !e2.playerIndices.length && !e2.preferenceFields?.length && D(`CLOUD_EMPTY_SELECTION`);
  else {
    O(e2, [`binding`, `players`, `nativeSettings`, `globalData`, `preferenceFields`, `activePlayer`]), (!Array.isArray(e2.players) || typeof e2.nativeSettings != `boolean` || ![`keep`, `replace`].includes(e2.globalData)) && D(`CLOUD_SELECTION`);
    let n2 = e2.players.some((e3) => e3.mode === `replace`);
    n2 && (e2.players.length !== t2.source.players.length || e2.players.some((e3, t3) => e3.mode !== `replace` || e3.sourceIndex !== t3 || e3.targetIndex !== t3 || e3.excludeMods.length) || e2.activePlayer?.kind !== `import` || !k(e2.activePlayer.index, t2.source.players.length)) && D(`CLOUD_PLAYER_SELECTION`);
    let r2 = /* @__PURE__ */ new Set();
    for (let [i2, a2] of e2.players.entries()) {
      O(a2, [`sourceIndex`, `mode`, `targetIndex`, `excludeMods`]), (!k(a2.sourceIndex, t2.source.players.length) || i2 && a2.sourceIndex <= e2.players[i2 - 1].sourceIndex || ![`new`, `overwrite`, `replace`].includes(a2.mode) || !A(a2.excludeMods) || a2.excludeMods.some((e3) => !t2.source.players[a2.sourceIndex].mods.includes(e3))) && D(`CLOUD_PLAYER_SELECTION`), !n2 && (a2.mode === `new` ? a2.targetIndex !== null : !k(a2.targetIndex, t2.local.players.length) || r2.has(a2.targetIndex)) && D(`CLOUD_PLAYER_TARGET`), a2.mode === `overwrite` && r2.add(a2.targetIndex);
      let o2 = t2.source.players[a2.sourceIndex];
      !n2 && o2.mods.some((e3) => !a2.excludeMods.includes(e3)) && (a2.mode === `new` || !o2.id || o2.id !== t2.local.players[a2.targetIndex].id) && D(`CLOUD_MOD_DATA_REMAP_UNSUPPORTED`);
    }
    e2.nativeSettings && !t2.source.nativeFields.length && D(`CLOUD_SETTINGS_MISSING`), !n2 && e2.globalData === `replace` && !t2.source.globalMods.length && D(`CLOUD_GLOBAL_MISSING`), !n2 && e2.globalData === `replace` && (t2.source.players.length !== t2.local.players.length || t2.source.players.some((e3, n3) => !e3.id || e3.id !== t2.local.players[n3].id) || e2.players.some((e3) => e3.mode !== `overwrite` || e3.sourceIndex !== e3.targetIndex)) && D(`CLOUD_GLOBAL_REMAP_UNSUPPORTED`), e2.activePlayer !== null && (O(e2.activePlayer, [`kind`, `index`]), (e2.activePlayer.kind === `local` ? !k(e2.activePlayer.index, t2.local.players.length) : e2.activePlayer.kind !== `import` || !e2.players.some((t3) => t3.sourceIndex === e2.activePlayer.index)) && D(`CLOUD_ACTIVE_PLAYER`)), !e2.players.length && !e2.nativeSettings && e2.globalData === `keep` && !e2.preferenceFields?.length && D(`CLOUD_EMPTY_SELECTION`);
  }
  return (!A(e2.preferenceFields) || e2.preferenceFields.some((e3) => !t2.source.preferenceFields.includes(e3))) && D(`CLOUD_PREFERENCE_SELECTION`), i(e2, 128e3);
}
function R({ save: t2, current: r2, plan: a2, createId: o2 = () => crypto.randomUUID() }) {
  let s2 = i(r2.players.present ? r2.players.value : []), c2 = i(r2.modData);
  (!Array.isArray(a2.players) || ![`keep`, `replace`].includes(a2.globalData)) && D(`CLOUD_SELECTION`);
  let u2 = s2.length;
  if (F(s2, c2), w(t2.modData, t2.players), a2.players.some((e2) => e2.mode === `replace`)) {
    (a2.players.length !== t2.players.length || a2.players.some((e3, t3) => e3.mode !== `replace` || e3.sourceIndex !== t3 || e3.targetIndex !== t3 || e3.excludeMods.length) || a2.activePlayer?.kind !== `import` || !k(a2.activePlayer.index, t2.players.length)) && D(`CLOUD_PLAYER_SELECTION`), a2.globalData === `keep` && c2.some((e3) => e3.identity.kind === `global`) && n(s2.map((e3) => e3.__gpNextSaveId ?? null)) !== n(t2.players.map((e3) => e3.__gpNextSaveId ?? null)) && D(`CLOUD_GLOBAL_REMAP_UNSUPPORTED`);
    let e2 = l([...t2.modData.filter((e3) => e3.identity.kind === `save` || a2.globalData === `replace`), ...a2.globalData === `keep` ? c2.filter((e3) => e3.identity.kind === `global`) : []]);
    return w(e2, t2.players), { players: i(t2.players), modData: e2, playerIndex: a2.activePlayer.index, changes: a2.players.map((e3) => ({ sourceIndex: e3.sourceIndex, targetIndex: e3.targetIndex, mode: `replace`, sourceName: t2.players[e3.sourceIndex].name || ``, targetName: s2[e3.targetIndex]?.name || ``, excludedMods: [], replacedMods: [] })) };
  }
  let d2 = new Set(s2.map((e2) => e2.__gpNextSaveId).filter(Boolean)), f2 = /* @__PURE__ */ new Set(), p2 = /* @__PURE__ */ new Map(), m2 = [], h2 = [], g2 = /* @__PURE__ */ new Set(), _2 = -1;
  for (let e2 of a2.players) {
    (!k(e2.sourceIndex, t2.players.length) || e2.sourceIndex <= _2 || ![`new`, `overwrite`].includes(e2.mode) || (e2.mode === `new` ? e2.targetIndex !== null : !k(e2.targetIndex, u2) || g2.has(e2.targetIndex)) || !A(e2.excludeMods) || e2.excludeMods.some((n3) => !j(t2.modData, t2.players[e2.sourceIndex].__gpNextSaveId).includes(n3))) && D(`CLOUD_PLAYER_SELECTION`), _2 = e2.sourceIndex, e2.mode === `overwrite` && g2.add(e2.targetIndex);
    let n2 = t2.players[e2.sourceIndex], r3 = e2.mode === `new` ? s2.length : e2.targetIndex, a3 = e2.mode === `overwrite` && typeof s2[r3].name == `string` ? Array.from(s2[r3].name).slice(0, 80).join(``) : ``, l2 = e2.mode === `overwrite` ? s2[r3].__gpNextSaveId : null;
    l2 || (l2 = o2(), (typeof l2 != `string` || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(l2) || d2.has(l2) || t2.players.some((e3) => e3.__gpNextSaveId === l2)) && D(`CLOUD_SAVE_IDENTITY`), d2.add(l2)), e2.mode === `overwrite` && s2[r3].__gpNextSaveId && f2.add(s2[r3].__gpNextSaveId);
    let v3 = t2.modData.filter((e3) => e3.identity.kind === `save` && e3.identity.saveId === n2.__gpNextSaveId);
    for (let t3 of v3) e2.excludeMods.includes(t3.identity.modId) || (n2.__gpNextSaveId !== l2 && D(`CLOUD_MOD_DATA_REMAP_UNSUPPORTED`), m2.push(i({ ...t3, identity: { ...t3.identity, saveId: l2 } })));
    s2[r3] = i({ ...n2, __gpNextSaveId: l2 }), p2.set(e2.sourceIndex, r3), h2.push({ sourceIndex: e2.sourceIndex, targetIndex: r3, mode: e2.mode, sourceName: typeof n2.name == `string` ? Array.from(n2.name).slice(0, 80).join(``) : ``, targetName: a3, excludedMods: e2.excludeMods, replacedMods: e2.mode === `overwrite` ? j(c2, l2) : [] });
  }
  a2.globalData === `replace` && (s2.length !== t2.players.length || t2.players.some((e2, t3) => !e2.__gpNextSaveId || e2.__gpNextSaveId !== s2[t3].__gpNextSaveId)) && D(`CLOUD_GLOBAL_REMAP_UNSUPPORTED`);
  let v2 = l([...c2.filter((e2) => e2.identity.kind === `global` ? a2.globalData === `keep` : !f2.has(e2.identity.saveId)), ...m2, ...a2.globalData === `replace` ? t2.modData.filter((e2) => e2.identity.kind === `global`) : []]);
  (s2.length > e.maxPlayers || v2.length > e.maxModRecords) && D(`CLOUD_LOCAL_LIMIT`), C(s2), w(v2, s2), i(s2, e.saveMaxBytes), i(v2, e.saveMaxBytes);
  let y2 = a2.activePlayer;
  y2 && (y2.kind === `local` ? !k(y2.index, u2) : y2.kind !== `import` || !p2.has(y2.index)) && D(`CLOUD_ACTIVE_PLAYER`);
  let b2 = r2.nativeSettings.value?.PlayerIndex;
  return { players: s2, modData: v2, playerIndex: y2 ? y2.kind === `local` ? y2.index : p2.get(y2.index) : k(b2, u2) ? b2 : s2.length ? 0 : null, changes: h2 };
}
async function z(e2, t2, r2) {
  (e2.backupDigest !== await s(t2) || n(e2.sourceObjects) !== n(r2)) && D(`CLOUD_SELECTION_CHANGED`);
}
export {
  L as a,
  w as c,
  g as d,
  h as f,
  I as i,
  C as l,
  R as n,
  T as o,
  N as r,
  E as s,
  z as t,
  y as u
};
