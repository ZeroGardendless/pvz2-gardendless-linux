import { f as e, i as t, n, r, t as i } from "./CloudJson.js";
import { n as a, u as o } from "../GameBootstrap.js";
import { i as s } from "./Events.js";
import { a as c, c as l, d as u, i as d, l as f, o as p, r as m, u as h } from "./CloudSelection.js";
import { t as g } from "./CloudPortablePreferences.js";
import { t as _ } from "../core/BuildIdentity.js";
import { c as v } from "../mods/GameConfiguration.js";
import { n as y, t as b } from "./CloudEnvironment.js";
import { setSettings, getSettings } from "../core/SettingsStore.js";
import { d as C, g as w, h as T, i as E, m as D, v as O } from "../ui/Translations.js";
import { t as k } from "../mods/ModOwnedDataStorage.js";
import { createConfigurationStorage } from "../mods/ModConfigurationStorage.js";
import { m as j } from "../ui/Components.js";
import { i as M } from "../ui/Overlay.js";
import { o as N } from "../runtime/HpOverlay.js";
import { t as P } from "../runtime/ScrollSensitivity.js";
var F = (e2) => {
  throw Error(e2);
}, I = /* @__PURE__ */ new Set([`PvZ2_PlayerProperties`, `PvZ2_Settings`, `gp-next-settings`]);
function L({ host: e2, game: i2, storage: a2, storagePrototype: o2, getPlayers: s2, getSettings: c2, configuration: u2, modData: d2, getScene: f2, shield: p2, canceled: m2 = () => false, signal: h2, timeoutMs: g2 = 5e3 }) {
  let _2 = () => {
    m2() && F(`CLOUD_CANCELLED`);
    let e3 = s2();
    return (!e3 || !Array.isArray(e3.allPlayers) || e3.allPlayers.filter((t2) => t2 === e3.currentPlayer).length !== 1 || typeof e3.savePP != `function`) && F(`CLOUD_NATIVE_SAVE`), e3;
  }, v2 = async () => {
    let e3 = _2(), t2 = r(a2.getItem(`PvZ2_Settings`) || `{}`);
    t2.PlayerIndex !== e3.allPlayers.indexOf(e3.currentPlayer) && F(`CLOUD_PLAYER_INDEX`);
    let n2 = await d2.exportAll(), i3 = r(JSON.stringify(e3.allPlayers));
    return l(n2, i3), { format: `gpn-cloud-source`, version: 1, components: { players: { present: true, value: i3 }, nativeSettings: { present: true, value: t2 }, modData: n2, preferences: c2() } };
  };
  return Object.freeze({ async review() {
    h2?.throwIfAborted();
    let e3, t2;
    try {
      let n2 = new Promise((e4, n3) => {
        t2 = () => n3(h2.reason || Error(`CLOUD_CANCELLED`)), h2?.addEventListener(`abort`, t2, { once: true });
      });
      return await Promise.race([v2(), n2, new Promise((t3, n3) => {
        e3 = setTimeout(() => n3(Error(`CLOUD_WRITERS_PENDING`)), g2);
      })]);
    } finally {
      clearTimeout(e3), h2?.removeEventListener(`abort`, t2);
    }
  }, async capture(s3) {
    e2.getPhase() !== `active` && F(`CLOUD_CONFIGURATION_BUSY`);
    let l2 = _2(), d3 = f2(), m3 = l2.currentPlayer, y2 = l2.allPlayers;
    d3 || F(`CLOUD_SCENE_CHANGED`);
    let x2 = new AbortController(), S2 = () => x2.abort(h2.reason || Error(`CLOUD_CANCELLED`));
    h2?.throwIfAborted(), h2?.addEventListener(`abort`, S2, { once: true });
    let C2, w2 = new Promise((e3, t2) => {
      C2 = t2;
    });
    x2.signal.addEventListener(`abort`, () => C2(x2.signal.reason), { once: true });
    let T2 = false, E2 = false, D2 = false, O2, k2, A2, j2, M2 = false, N2, P2 = () => {
      let t2 = _2();
      (T2 || e2.getPhase() !== `cloud-save-pending` || f2() !== d3 || t2.currentPlayer !== m3 || t2.allPlayers !== y2) && F(`CLOUD_CAPTURE_CHANGED`);
    };
    try {
      j2 = p2(), i2.isPaused() || (i2.pause(), M2 = true);
      let l3 = (e3, t2) => Promise.resolve(e3).then((e4) => {
        T2 ? e4() : t2(e4);
      });
      return await Promise.race([(async () => {
        await Promise.all([l3(Promise.resolve().then(() => e2.loader._ownedDataService.quiesceWrites({ signal: x2.signal })), (e3) => {
          O2 = e3;
        }), l3(Promise.resolve().then(() => e2.quiesceConfigurationWrites({ signal: x2.signal })), (e3) => {
          k2 = e3;
        })]), P2();
        let i3 = t(r(JSON.stringify(y2)));
        a2.setItem(`PvZ2_PlayerProperties`, JSON.stringify(y2)), t(r(a2.getItem(`PvZ2_PlayerProperties`))) !== i3 && F(`CLOUD_NATIVE_SAVE`);
        let d4 = o2.setItem, f3 = o2.removeItem, p3 = o2.clear, m4 = function(e3, t2) {
          return !E2 && this === a2 && I.has(String(e3)) && F(`CLOUD_SAVE_CLOSED`), d4.call(this, e3, t2);
        }, g3 = function(e3) {
          return !E2 && this === a2 && I.has(String(e3)) && F(`CLOUD_SAVE_CLOSED`), f3.call(this, e3);
        }, _3 = function() {
          return !E2 && this === a2 && F(`CLOUD_SAVE_CLOSED`), p3.call(this);
        };
        o2.setItem = m4, o2.removeItem = g3, o2.clear = _3, A2 = () => {
          o2.setItem === m4 && (o2.setItem = d4), o2.removeItem === g3 && (o2.removeItem = f3), o2.clear === _3 && (o2.clear = p3);
        };
        let C3 = a2.getItem(`PvZ2_PlayerProperties`), w3 = a2.getItem(`PvZ2_Settings`), T3 = a2.getItem(`gp-next-settings`), j3 = t(c2()), M3 = await b(await u2.read(), c2());
        P2();
        let L2 = await v2(), R2 = await b(await u2.read(), c2());
        P2(), (t(r(JSON.stringify(y2))) !== i3 || a2.getItem(`PvZ2_PlayerProperties`) !== C3 || a2.getItem(`PvZ2_Settings`) !== w3 || a2.getItem(`gp-next-settings`) !== T3 || t(c2()) !== j3 || R2.configurationDigest !== M3.configurationDigest || t(R2.environment) !== t(M3.environment)) && F(`CLOUD_CAPTURE_CHANGED`);
        let z2 = { source: n(L2, 10 * 1024 * 1024, { maxDepth: 36, maxNodes: 6e5 }), context: M3 };
        return s3 ? (clearTimeout(N2), h2?.removeEventListener(`abort`, S2), await s3({ ...z2, assertBoundary: P2, retainIsolation() {
          D2 = true;
        }, writeLocal(e3) {
          P2(), E2 = true;
          try {
            return e3();
          } finally {
            E2 = false;
          }
        } })) : z2;
      })(), new Promise((e3, t2) => {
        N2 = setTimeout(() => t2(Error(`CLOUD_WRITERS_PENDING`)), g2);
      }), w2]);
    } finally {
      if (clearTimeout(N2), h2?.removeEventListener(`abort`, S2), !D2) {
        T2 = true, h2?.removeEventListener(`abort`, S2), x2.abort(Error(`CLOUD_CANCELLED`));
        try {
          A2?.();
        } finally {
          try {
            O2?.();
          } finally {
            try {
              k2?.();
            } finally {
              try {
                j2?.();
              } finally {
                M2 && i2.resume();
              }
            }
          }
        }
      }
    }
  } });
}
var R = (e2) => {
  throw Error(e2);
}, z = (e2, n2) => t(e2) === t(n2);
function B(e2) {
  return e2.preferenceFields.every((e3) => g.includes(e3));
}
function ee({ source: e2, native: i2, storage: a2, modData: o2, preferences: s2, applyPreferences: c2, applyNativeSettings: u2 = () => {
}, synchronizePlayer: d2 = () => {
}, targetPlayers: p2, targetActiveIndex: m2, assertBoundary: h2, writeLocal: _2 }) {
  let v2 = i2.currentPlayer, y2 = i2.allPlayers, b2 = y2.indexOf(v2), x2 = new Map(e2.components.modData.map((e3) => [t(e3.identity), e3.identity])), S2 = () => {
    h2(), (i2.currentPlayer !== v2 || i2.allPlayers !== y2 || y2.filter((e3) => e3 === v2).length !== 1) && R(`CLOUD_ACTIVE_PLAYER_CHANGED`);
  };
  return { players: { read: async () => (S2(), { present: true, value: r(JSON.stringify(y2)) }), validate: async (t2) => {
    t2?.present || R(`CLOUD_PLAYERS`), f(t2.value);
    let n2 = z(t2.value, e2.components.players.value) ? b2 : m2 ?? b2;
    (!Number.isInteger(n2) || !t2.value[n2]) && R(`CLOUD_PLAYER_INDEX`), (!Object.isExtensible(v2) || !Object.isExtensible(y2) || Object.values(Object.getOwnPropertyDescriptors(v2)).some((e3) => !e3.configurable || !Object.hasOwn(e3, `value`)) || Object.getOwnPropertyDescriptor(y2, `length`)?.writable !== true) && R(`CLOUD_NATIVE_PLAYER_SHAPE`);
  }, write: async (t2) => {
    S2(), t2.present || R(`CLOUD_PLAYERS`);
    let i3 = z(t2.value, e2.components.players.value) ? b2 : m2 ?? b2;
    t2.value[i3] || R(`CLOUD_PLAYER_INDEX`), _2(() => {
      if (a2.setItem(`PvZ2_PlayerProperties`, JSON.stringify(t2.value)), !z(t2.value[i3], r(JSON.stringify(v2)))) {
        for (let e4 of Object.keys(v2)) delete v2[e4];
        Object.assign(v2, n(t2.value[i3]));
      }
      let e3 = t2.value.map((e4, t3) => t3 === i3 ? v2 : y2[t3] !== v2 && z(e4, r(JSON.stringify(y2[t3] ?? null))) ? y2[t3] : n(e4));
      Array.prototype.splice.call(y2, 0, y2.length, ...e3), d2(v2);
    }), S2(), z(JSON.parse(a2.getItem(`PvZ2_PlayerProperties`)), t2.value) || R(`CLOUD_LOCAL_WRITE`);
  } }, nativeSettings: { read: async () => {
    S2();
    let e3 = a2.getItem(`PvZ2_Settings`);
    return e3 === null ? { present: false, value: null } : { present: true, value: r(e3) };
  }, validate: async (e3) => {
    (!e3?.present || !e3.value || typeof e3.value != `object` || Array.isArray(e3.value)) && R(`CLOUD_SETTINGS`);
  }, write: async (e3) => {
    S2(), _2(() => {
      a2.setItem(`PvZ2_Settings`, t(e3.value)), u2(e3.value);
    }), S2();
  } }, modData: { read: async () => (S2(), o2.exportAll({ allowAbsent: [...x2.values()] })), validate: async (n2) => {
    l(n2, z(n2, e2.components.modData) ? e2.components.players.value : p2 || y2);
    for (let e3 of n2) x2.set(t(e3.identity), e3.identity);
  }, write: async (e3) => {
    S2(), await o2.replaceAll(e3, { assertClosed: S2, allowAbsent: [...x2.values()] }), S2();
  }, isIntermediate: (e3, t2, n2) => e3.every((e4) => [...t2, ...n2].some((t3) => z(e4, t3))) }, preferences: { read: async () => (S2(), s2.getSettings()), validate: async (t2) => {
    let n2 = e2.components.preferences;
    [.../* @__PURE__ */ new Set([...Object.keys(t2), ...Object.keys(n2)])].some((e3) => !g.includes(e3) && !z(t2[e3] ?? null, n2[e3] ?? null)) && R(`CLOUD_SETTINGS`);
  }, write: async (e3) => {
    S2(), _2(() => {
      s2.setSettings(e3), c2(e3);
    }), S2();
  } } };
}
function te(e2, t2 = D) {
  for (let [n2, r2] of [[`CoinCount`, `coin`], [`GemCount`, `gem`], [`WorldKeyCount`, `worldkey`], [`SproutCount`, `sprout`], [`TicketCount`, `ticket`]]) {
    let i2 = t2(n2)?.component;
    if (!i2?.node?.isValid) continue;
    let a2 = typeof e2[r2] == `number` ? e2[r2] : 0;
    i2._value = a2, i2.shownValue = a2;
  }
}
function ne(e2, t2 = O, n2 = D) {
  let r2 = t2(`chunks:///_virtual/SoundsController.ts`, `MusicController`), i2 = t2(`chunks:///_virtual/SoundsController.ts`, `SoundFXController`), a2 = t2(`chunks:///_virtual/ArrayGet.ts`, `ValueRange`);
  r2 && (e2.MusicVolume !== void 0 && (r2.MusicVolume = e2.MusicVolume), a2 && e2.MusicSpeedMin !== void 0 && e2.MusicSpeedMax !== void 0 && (r2.MusicSpeedRange = new a2(e2.MusicSpeedMax, e2.MusicSpeedMin))), i2 && e2.SFXVolume !== void 0 && (i2.SoundFXVolume = e2.SFXVolume);
  let o2 = n2(`UIInGame`), s2 = n2(`SettingWindow`), c2 = n2(`MultiLanguage`);
  if (o2 && e2.CardsLayer !== void 0 && (o2.CardsLayer = e2.CardsLayer), s2) for (let [t3, n3] of [[`showKeyTips`, `ShowKeyTips`], [`plantKeyTips`, `PlantKeyTips`], [`classicCardBG`, `ClassicCardBG`]]) e2[n3] !== void 0 && (s2[t3] = e2[n3]);
  c2 && e2.Language !== void 0 && (c2.currentLanguage = c2.isWhiteList ? e2.Language : 0);
}
function re() {
  let e2 = document.createElement(`div`);
  e2.style.cssText = `position:fixed;inset:0;z-index:2147483647;cursor:wait`;
  let t2 = [`keydown`, `keyup`, `pointerdown`, `pointerup`, `wheel`, `click`], n2 = (e3) => {
    e3.preventDefault(), e3.stopImmediatePropagation();
  };
  for (let e3 of t2) window.addEventListener(e3, n2, { capture: true, passive: false });
  return document.body.append(e2), () => {
    for (let e3 of t2) window.removeEventListener(e3, n2, true);
    e2.remove();
  };
}
var V = (e2) => t({ local: e2.local, source: e2.source });
async function installCloudSaveRequests() {
  let n2 = false, r2 = false, l2 = null, f2 = null;
  await s(`cloud-cancel-local`, () => {
    l2?.abort(Error(`CLOUD_CANCELLED`));
  });
  let g2 = async (s2) => {
    let O2 = s2.payload?.operationId;
    if (typeof O2 != `string` || r2) return;
    if (n2) {
      f2 = s2;
      return;
    }
    n2 = true;
    let F2 = new AbortController();
    l2 = F2;
    let I2 = () => F2.signal.aborted;
    try {
      let n3 = a();
      if (n3?.getPhase() !== `active`) throw Error(`CLOUD_CONFIGURATION_BUSY`);
      let l3 = D(`mainScene`)?.version;
      if (typeof l3 != `string` || !l3) throw Error(`CLOUD_GAME_VERSION`);
      let g3 = { version: l3, gpNextVersion: v }, R2 = s2.payload.mode, z2 = createConfigurationStorage(), H2 = k(), U = await b(await z2.read(), getSettings()), ie = { game: g3, buildId: _, configurationDigest: U.configurationDigest, environmentDigest: await i(U.environment) }, W = L({ host: n3, game: window.cc.game, storage: localStorage, storagePrototype: Storage.prototype, getPlayers: C, getSettings, configuration: z2, modData: H2, getScene: () => window.cc.director._loadingScene ? null : T(), shield: re, canceled: I2, signal: F2.signal }), G = R2 === `restore` ? s2.payload.remote : null, K = G ? h(G) : null, q = await W.review(), J = await d({ mode: R2, sourceBackup: q, sourceId: G?.snapshotId || O2, sourceObjects: G ? m(G.objects) : [], exported: K?.exported || {} }), ae = await e(`cloud_active_start`, { operationId: O2, metadata: ie, context: J }), Y = (t2, n4 = {}) => {
        if (I2()) throw Error(`CLOUD_CANCELLED`);
        return e(`cloud_cold_step`, { token: ae.token, step: { type: t2, ...n4 } });
      }, X = async (e2) => {
        let t2 = Date.now() + 3e5;
        for (; ; ) {
          if (Date.now() >= t2) throw Error(`CLOUD_SELECTION_TIMEOUT`);
          let n4 = await Y(e2);
          if (n4[e2 === `selection` ? `plan` : `decision`]) return n4[e2 === `selection` ? `plan` : `decision`];
          await new Promise((e3) => setTimeout(e3, 250));
        }
      }, Z = c(await X(`selection`), J), oe = async (e2) => {
        if (I2()) throw Error(`CLOUD_CANCELLED`);
        let n4 = await d({ mode: R2, sourceBackup: e2.source, sourceId: G?.snapshotId || O2, sourceObjects: G ? m(G.objects) : [], exported: K?.exported || {} });
        if (V(n4) !== V(J) || e2.context.configurationDigest !== U.configurationDigest || t(e2.context.environment) !== t(U.environment)) throw Error(`CLOUD_SELECTION_CHANGED`);
        return n4;
      };
      if (R2 === `capture`) {
        let e2 = await W.capture();
        await oe(e2);
        let n4 = e2.source.components, r3 = Z.playerIndices.length ? p({ allPlayers: n4.players.value, native: n4.nativeSettings.value, records: n4.modData, environment: e2.context.environment, game: g3 }, Z) : null, i2 = Z.preferenceFields.length ? u(n4.preferences, Z.preferenceFields) : null;
        await Y(`publish_capture`, { saveText: r3 ? t(r3) : null, preferencesText: i2 ? t(i2) : null }), await Y(`finish`);
        return;
      }
      if (!B(Z)) throw Error(`CLOUD_SETTINGS`);
      if (w() !== `mainScene`) for (await Y(`wait_menu`); w() !== `mainScene`; ) {
        if (I2()) throw Error(`CLOUD_CANCELLED`);
        await new Promise((e2) => setTimeout(e2, 250));
      }
      let se = Object.fromEntries(Object.entries(q.components).map(([e2, t2]) => [e2, { read: async () => structuredClone(t2) }])), ce = await y({ exported: K.exported, components: se, currentEnvironment: { game: g3, environment: U.environment }, selection: Z, context: J }), Q = crypto.randomUUID(), $ = {};
      if (K.exported.save) {
        let e2 = structuredClone(K.exported.save);
        delete e2.preferenceId, $.saveDigest = await i(e2);
      }
      if (K.exported.preferences && ($.preferencesDigest = await i(K.exported.preferences)), await Y(`review`, { operationId: Q, summary: { ...$, ...ce.summary, selectionDigest: await i(Z), previousPlayers: q.components.players.value.length, targetPlayers: ce.targets.players?.value.length ?? null, recovery: false } }), await X(`decision`) === `rollback`) {
        await Y(`abort_local`);
        return;
      }
      await W.capture(async (e2) => {
        let n4 = await oe(e2);
        if (!B(Z, n4.local.activeIndex)) throw Error(`CLOUD_SELECTION_CHANGED`);
        let r3 = Object.fromEntries(Object.entries(e2.source.components).map(([e3, t2]) => [e3, { read: async () => structuredClone(t2) }])), { targets: a2 } = await y({ exported: K.exported, components: r3, currentEnvironment: { game: g3, environment: e2.context.environment }, selection: { ...Z, binding: n4.binding }, context: n4 }), s3 = ee({ source: e2.source, native: C(), storage: localStorage, modData: H2, preferences: { getSettings, setSettings }, assertBoundary: e2.assertBoundary, writeLocal: e2.writeLocal, targetPlayers: a2.players?.value, targetActiveIndex: a2.nativeSettings?.value?.PlayerIndex, synchronizePlayer(e3) {
          te(e3);
        }, applyNativeSettings(e3) {
          ne(e3);
        }, applyPreferences(e3) {
          j(e3.theme), M(e3.overlayHotkey), N(e3.hpOverlay), P(e3.scrollSensitivity), E(e3.locale), window.cc.game.setFrameRate(Number(e3.frameRate) || 60);
        } }), c2 = o({ components: s3, journal: { async read() {
          let e3 = await Y(`journal`);
          return e3 === null ? null : JSON.parse(e3);
        }, async write(e3) {
          await Y(`write_journal`, { text: t(e3) });
        } }, assertBoundary: e2.assertBoundary, createOperationId: () => Q, assertConfigurationIdle: async () => {
          if ((await b(await z2.read(), getSettings())).configurationDigest !== U.configurationDigest) throw Error(`CLOUD_CONFIGURATION_CHANGED`);
        } }), l4 = await Promise.all(Object.keys(a2).sort().map(async (e3) => ({ name: e3, value: await s3[e3].read() }))), u2 = l4.some(({ name: e3, value: n5 }) => t(n5) !== t(a2[e3]));
        await c2.prepare(a2, await i(l4));
        try {
          await c2.apply(Q);
        } catch (t2) {
          await Y(`rollback_failed`);
          try {
            await c2.rollback(Q);
          } catch {
            throw e2.retainIsolation(), Error(`CLOUD_RECOVERY_REQUIRED`);
          }
          throw t2;
        }
        return await Y(`finish`), u2;
      }) && (r2 = true, f2 = null, window.location.reload());
    } catch (t2) {
      await e(`cloud_save_failed`, { operationId: O2, reason: t2?.message }).catch(() => {
      });
    } finally {
      if (F2.abort(Error(`CLOUD_CANCELLED`)), l2 === F2 && (l2 = null), n2 = false, f2 && !r2) {
        let e2 = f2;
        f2 = null, queueMicrotask(() => g2(e2));
      }
    }
  };
  return s(`cloud-request-save`, g2);
}
export {
  installCloudSaveRequests
};
