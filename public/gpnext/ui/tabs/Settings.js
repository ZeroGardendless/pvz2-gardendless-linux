import { applyFrameRate, FRAME_RATE_OPTIONS } from "../../runtime/FrameRate.js";
import { c as engine } from "../Translations.js";
import { f as e } from "../../platform/CloudJson.js";
import { t } from "../../platform/CloudPortablePreferences.js";
import { d as n, o as r } from "../../platform/FileSystem.js";
import { a as i, c as a, d as o, o as s, r as c, s as l, t as u } from "../../runtime/TrainerShortcuts.js";
import { setSettings, getSettings } from "../../core/SettingsStore.js";
import { m as p, o as m, t as h, v as g } from "../Translations.js";
import { d as _, f as v, i as y, l as b, m as x, n as S, r as C, s as w, u as T } from "../Components.js";
import { n as E } from "../Toast.js";
import { i as D } from "../Overlay.js";
import { a as O, n as k, o as A, t as j } from "../../runtime/HpOverlay.js";
import { t as M } from "../../runtime/ScrollSensitivity.js";
import { r as N } from "../../mods/ModSettingsRegistry.js";
import { n as P, t as F } from "../../platform/Dialog.js";
function I() {
  return !!globalThis.window?.__TAURI_INTERNALS__;
}
function L(t2) {
  I() && t2.appendChild(S(m(`cloud.title`), async () => {
    try {
      await e(`cloud_open`, { locale: h(), theme: getSettings().theme });
    } catch {
      E(m(`common.error`), `error`);
    }
  }));
}
var R = [`builtinTranslations`, `debug`, `redactDiagnostics`], z = { overlayHotkey: { key: `text`, code: `text`, ctrl: `boolean`, alt: `boolean`, shift: `boolean`, meta: `boolean` }, scrollSensitivity: { enabled: `boolean`, wheel: [0.05, 3], discreteMinIntervalMs: [0, 400] }, hpOverlay: { showPlant: `boolean`, showZombie: `boolean`, showTomb: `boolean` } }, B = [`locale`, `theme`, `frameRate`, ...R, ...Object.keys(z)], V = (e2) => typeof e2 == `object` && !!e2 && !Array.isArray(e2), H = (e2) => {
  if (!e2) throw TypeError(`Invalid preferences`);
};
function U(e2) {
  H(typeof e2 == `string` && new TextEncoder().encode(e2).length <= 256 * 1024);
  let t2 = JSON.parse(e2);
  H(t2?.format === `gp-next-preferences` && t2.version === 1 && V(t2.settings));
  let n2 = {};
  for (let e3 of B) {
    if (!Object.hasOwn(t2.settings, e3)) continue;
    let r2 = t2.settings[e3];
    if (e3 === `locale`) H(r2 === null || typeof r2 == `string` && r2.length <= 32);
    else if (e3 === `theme`) H(r2 === `dark` || r2 === `light`);
    else if (e3 === `frameRate`) H([`0`, `30`, `60`, `90`, `120`, `144`, `165`, `240`].includes(r2));
    else if (R.includes(e3)) H(typeof r2 == `boolean`);
    else {
      H(V(r2)), n2[e3] = {};
      for (let [t3, i2] of Object.entries(z[e3])) {
        if (!Object.hasOwn(r2, t3)) continue;
        let a2 = r2[t3];
        H(i2 === `text` ? typeof a2 == `string` && a2.length > 0 && a2.length <= 64 : i2 === `boolean` ? typeof a2 == `boolean` : Number.isFinite(a2) && a2 >= i2[0] && a2 <= i2[1]), n2[e3][t3] = a2;
      }
      continue;
    }
    n2[e3] = r2;
  }
  return H(Object.keys(n2).length > 0), n2;
}
function W() {
  let e2 = getSettings();
  return JSON.stringify({ format: `gp-next-preferences`, version: 1, settings: Object.fromEntries(B.map((t2) => [t2, e2[t2]])) }, null, 2);
}
function G(e2) {
  return setSettings(U(e2));
}
function K(e2) {
  let t2 = null, i2 = document.createElement(`pre`);
  i2.className = `gp-text-mono`, i2.style.cssText = `white-space:pre-wrap;overflow-wrap:anywhere;max-height:240px;overflow:auto`, i2.hidden = true;
  let a2 = S(m(`preferences.apply`), () => {
    try {
      G(t2), window.location.reload();
    } catch {
      E(m(`preferences.failed`), `error`);
    }
  });
  a2.hidden = true;
  let o2 = S(m(`preferences.import`), async () => {
    t2 = null, i2.hidden = a2.hidden = true, o2.disabled = true;
    try {
      let e3 = await F({ multiple: false, filters: [{ name: `JSON`, extensions: [`json`] }] });
      if (!e3 || Array.isArray(e3)) return;
      let n2 = await r(e3), o3 = U(n2);
      t2 = n2;
      let s3 = { theme: `settings.theme`, locale: `settings.language`, frameRate: `settings.frameRate`, builtinTranslations: `settings.builtinTranslations`, debug: `settings.debugMode`, redactDiagnostics: `diagnostics.redact`, overlayHotkey: `settings.overlayHotkey`, scrollSensitivity: `settings.scrollSensitivity`, hpOverlay: `settings.hpOverlay` };
      i2.textContent = Object.entries(o3).map(([e4, t3]) => {
        let n3 = typeof t3 == `boolean` ? m(t3 ? `preferences.on` : `preferences.off`) : t3 ?? m(`preferences.auto`);
        return e4 === `theme` && (n3 = m(t3 === `light` ? `settings.themeLight` : `settings.themeDark`)), e4 === `overlayHotkey` && (n3 = l(t3)), e4 === `scrollSensitivity` && (n3 = `${t3.wheel ?? `\u2014`}\xD7 / ${t3.discreteMinIntervalMs ?? `\u2014`} ms`), e4 === `hpOverlay` && (n3 = [`showPlant`, `showZombie`, `showTomb`].filter((e5) => t3[e5]).map((e5) => m(`preferences.${e5}`)).join(`, `) || m(`preferences.off`)), `${m(s3[e4])}: ${n3}`;
      }).join(`
`), i2.hidden = a2.hidden = false;
    } catch {
      E(m(`preferences.failed`), `error`);
    } finally {
      o2.disabled = false;
    }
  }), s2 = S(m(`preferences.export`), async () => {
    s2.disabled = true;
    try {
      let e3 = await P({ defaultPath: `gp-next-preferences.json`, filters: [{ name: `JSON`, extensions: [`json`] }] });
      e3 && await n(e3, W());
    } catch {
      E(m(`preferences.failed`), `error`);
    } finally {
      s2.disabled = false;
    }
  });
  e2.appendChild(b(m(`preferences.title`), [C(o2, s2), i2, a2]));
}
var q = N;
function bindModSettingsRegistry(e2) {
  q = e2;
}
function Y(e2, t2, n2) {
  let r2 = document.createElement(`div`);
  r2.className = `gp-input-wrap`;
  let i2 = document.createElement(`span`);
  i2.className = `gp-input-label`, i2.textContent = e2;
  let a2 = document.createElement(`input`);
  return a2.type = `text`, a2.className = `gp-input`, a2.value = t2 == null ? `` : String(t2), a2.addEventListener(`change`, () => n2(a2.value)), r2.appendChild(i2), r2.appendChild(a2), r2;
}
function X(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.className = `gp-input-wrap`;
  let r2 = document.createElement(`span`);
  r2.className = `gp-input-label`, r2.textContent = e2;
  let i2 = document.createElement(`input`);
  return i2.type = `text`, i2.className = `gp-input`, i2.value = t2 == null ? `` : String(t2), i2.readOnly = true, n2.appendChild(r2), n2.appendChild(i2), n2._setValue = (e3) => {
    i2.value = e3 == null ? `` : String(e3);
  }, n2;
}
function Z(e2, t2 = `overlay`) {
  let n2 = t2 === `overlay` ? o(e2, s) : e2, r2 = false, h2 = (e3) => e3 ? l(e3) : m(`settings.hotkeyUnbound`), _2 = X(m(t2 === `overlay` ? `settings.overlayHotkeyCurrent` : u[t2]), h2(n2));
  function v2(e3) {
    let r3 = getSettings(), a2 = e3 && i(e3, r3, t2);
    return a2 ? (E(m(`settings.hotkeyConflict`, m(a2 === `overlay` ? `settings.overlayHotkey` : u[a2])), `error`), false) : (t2 === `overlay` ? (setSettings({ overlayHotkey: e3 }), D(e3)) : setSettings({ trainerHotkeys: { ...r3.trainerHotkeys, [t2]: e3 } }), n2 = e3, _2._setValue(h2(e3)), true);
  }
  let y2 = S(m(`settings.overlayHotkeyRecord`), () => {
    r2 = !r2, x2(), r2 && y2.focus();
  }, { small: true });
  y2.dataset.gpHotkeyRecorder = `true`, y2.addEventListener(`blur`, () => {
    r2 && (r2 = false, x2());
  }), y2.addEventListener(`keydown`, (e3) => {
    if (!r2) return;
    e3.preventDefault(), e3.stopPropagation();
    let n3 = a(e3);
    if (n3) {
      if (t2 !== `overlay` && c(e3, p(`KeyListener`)?.KeyBinds, g(window.System.resolve(`cc`), `KeyCode`))) {
        E(m(`settings.hotkeyGameConflict`), `error`);
        return;
      }
      e3.isComposing || e3.repeat || !v2(n3) || (r2 = false, x2());
    }
  });
  let b2 = S(m(t2 === `overlay` ? `settings.overlayHotkeyReset` : `settings.hotkeyClear`), () => {
    v2(t2 === `overlay` ? { ...s } : null) && (r2 = false, x2());
  }, { small: true });
  function x2() {
    y2.textContent = m(r2 ? `settings.overlayHotkeyRecording` : `settings.overlayHotkeyRecord`);
  }
  return [_2, C(y2, b2)];
}
function Q(e2, t2, n2) {
  if (!e2?.key || !e2?.type) return null;
  let r2 = e2.label || e2.key, i2 = t2?.[e2.key];
  switch (e2.type) {
    case `toggle`:
      return v(r2, i2 === true, (e3) => {
        n2(e3 === true);
      });
    case `select`:
      return T(r2, Array.isArray(e2.options) ? e2.options : [], String(i2 ?? e2.default ?? ``), n2);
    case `slider`:
      return _(r2, Number.isFinite(Number(e2.min)) ? Number(e2.min) : 0, Number.isFinite(Number(e2.max)) ? Number(e2.max) : 100, Number.isFinite(Number(i2)) ? Number(i2) : Number(e2.default) || 0, n2, { step: Number.isFinite(Number(e2.step)) ? Number(e2.step) : 1, commitOnChange: true, formatValue: typeof e2.formatValue == `function` ? e2.formatValue : void 0 });
    case `number`:
      return w(r2, Number(i2 ?? e2.default ?? 0), n2, { min: Number.isFinite(Number(e2.min)) ? Number(e2.min) : void 0, max: Number.isFinite(Number(e2.max)) ? Number(e2.max) : void 0, step: Number.isFinite(Number(e2.step)) ? Number(e2.step) : void 0 });
    case `text`:
      return Y(r2, i2 ?? e2.default ?? ``, n2);
    case `readonly`:
      return y(typeof i2 == `string` ? `${r2}: ${i2}` : r2);
    default:
      return y(m(`settings.modSettingsUnsupportedField`, r2, e2.type));
  }
}
function render(e2, group = e2.dataset?.settingsGroup || "all") {
  e2.dataset.settingsGroup = group;
  e2.replaceChildren();
  let n2 = getSettings(), r2 = (e3) => `${Math.round(e3)}%`, i2 = (e3) => `${Math.round(e3)} ms`, a2 = n2.scrollSensitivity || {}, o2 = Number(a2.wheel), s2 = Number(a2.discreteMinIntervalMs), c2 = { enabled: a2.enabled !== false, wheel: Number.isFinite(o2) && o2 > 0 ? o2 : 1, discreteMinIntervalMs: Number.isFinite(s2) && s2 >= 0 ? Math.round(s2) : 0 };
  function l2(e3) {
    Object.assign(c2, e3 || {}), setSettings({ scrollSensitivity: { enabled: c2.enabled, wheel: c2.wheel, discreteMinIntervalMs: c2.discreteMinIntervalMs } }), M({ enabled: c2.enabled, wheel: c2.wheel, discreteMinIntervalMs: c2.discreteMinIntervalMs });
  }
  function p2(e3, t2) {
    e3 && (e3.style.opacity = t2 ? `1` : `0.5`, e3.style.pointerEvents = t2 ? `auto` : `none`);
  }
  e2.appendChild(b(m(`settings.appearance`), [T(m(`settings.theme`), [{ value: `dark`, label: m(`settings.themeDark`) }, { value: `light`, label: m(`settings.themeLight`) }], n2.theme, (e3) => {
    x(setSettings({ theme: e3 }).theme);
  })]));
  let h2 = v(m(`settings.builtinTranslations`), n2.builtinTranslations !== false, (e3) => {
    setSettings({ builtinTranslations: e3 === true });
  }), g2 = b(m(`settings.language`), [h2, y(m(`settings.builtinTranslationsReloadHint`))]);
  e2.appendChild(g2);
  let S2 = b(m(`settings.overlayHotkey`), Z(n2.overlayHotkey));
  e2.appendChild(S2);
  let C2 = document.createElement(`div`), w2 = (e3) => {
    C2.replaceChildren(...Z(getSettings().trainerHotkeys[e3], e3));
  };
  w2(`sunLock`), e2.appendChild(b(m(`settings.trainerHotkeys`), [T(m(`settings.hotkeyAction`), Object.entries(u).map(([e3, t2]) => ({ value: e3, label: m(t2) })), `sunLock`, w2), C2]));
  let E2 = v(m(`settings.scrollSensitivityEnabled`), c2.enabled, (e3) => {
    l2({ enabled: e3 === true }), p2(D2, c2.enabled), p2(O2, c2.enabled);
  }), D2 = _(m(`settings.scrollSensitivityWheel`), 5, 300, Math.round(c2.wheel * 100), (e3) => {
    l2({ wheel: e3 / 100 });
  }, { step: 5, formatValue: r2 }), O2 = _(m(`settings.scrollSensitivityDiscreteInterval`), 0, 400, c2.discreteMinIntervalMs, (e3) => {
    l2({ discreteMinIntervalMs: Math.round(e3) });
  }, { step: 10, formatValue: i2 });
  p2(D2, c2.enabled), p2(O2, c2.enabled);
  let k2 = b(m(`settings.scrollSensitivity`), [E2, D2, O2]);
  e2.appendChild(k2);
  let A2 = v(m(`settings.debugMode`), n2.debug === true, (e3) => {
    window.gpNext && (window.gpNext.debug = e3), setSettings({ debug: e3 === true });
  }), j2 = b(m(`settings.debugMode`), [A2]);
  e2.appendChild(j2), K(e2);
  let N2 = v(m(`settings.dynamicPlantRegistry`), n2.dynamicPlantRegistry !== false, (e3) => {
    setSettings({ dynamicPlantRegistry: e3 === true });
  }), P2 = v(m(`settings.shopExtensions`), n2.shopExtensions === true, (e3) => {
    setSettings({ shopExtensions: e3 === true });
  }), F2 = b(m(`settings.runtimeExtensions`), [y(m(`settings.runtimeExtensionsReloadHint`)), N2, P2]);
  e2.appendChild(F2), I() && e2.appendChild(b(m(`settings.cloudBackup`), [v(m(`cloud.native.progress`), n2.cloudBackup.players, (t2) => {
    setSettings({ cloudBackup: { players: t2, nativeSettings: t2 && getSettings().cloudBackup.nativeSettings } }), render(e2);
  }), v(m(`cloud.native.gameSettings`), n2.cloudBackup.players && n2.cloudBackup.nativeSettings, (t2) => {
    setSettings({ cloudBackup: { nativeSettings: t2, ...t2 ? { players: true } : {} } }), render(e2);
  }), ...t.map((e3) => v(m(`cloud.native.field.${e3}`), n2.cloudBackup.preferenceFields.includes(e3), (t2) => {
    let n3 = new Set(getSettings().cloudBackup.preferenceFields);
    t2 ? n3.add(e3) : n3.delete(e3), setSettings({ cloudBackup: { preferenceFields: [...n3] } });
  }))]));
  const groups = {
    appearance: ["settings.appearance"],
    controls: ["settings.overlayHotkey", "settings.trainerHotkeys", "settings.scrollSensitivity"],
    game: ["settings.language", "settings.runtimeExtensions"],
    backup: ["settings.debugMode", "preferences.title", "settings.cloudBackup"]
  };
  if (group !== "all") {
    const titles = (groups[group] || []).map((key) => m(key));
    for (const child of [...e2.children]) {
      const title = child.querySelector(".gp-section-title")?.textContent?.trim();
      if (!titles.includes(title)) child.remove();
    }
  }
}
function renderHpSettings(e2) {
  let t2 = O(), n2 = v(m(`settings.showPlantHp`), !!t2.showPlant, (e3) => {
    let t3 = O();
    A({ showPlant: e3, showZombie: t3.showZombie, showTomb: t3.showTomb }), e3 || t3.showZombie || t3.showTomb ? k() : j();
  }), r2 = v(m(`settings.showZombieHp`), !!t2.showZombie, (e3) => {
    let t3 = O();
    A({ showPlant: t3.showPlant, showZombie: e3, showTomb: t3.showTomb }), e3 || t3.showPlant || t3.showTomb ? k() : j();
  }), i2 = v(m(`settings.showTombHp`), !!t2.showTomb, (e3) => {
    let t3 = O();
    A({ showPlant: t3.showPlant, showZombie: t3.showZombie, showTomb: e3 }), e3 || t3.showPlant || t3.showZombie ? k() : j();
  });
  e2.appendChild(n2), e2.appendChild(r2), e2.appendChild(i2);
}
function renderModSettings(e2, { registry: t2 = q, namespace: n2 = null, pending: r2 = false, draftsByNamespace: i2 = /* @__PURE__ */ new Map() } = {}) {
  let a2 = [], o2 = t2.getRegisteredModSettings().filter((e3) => !n2 || e3.namespace === n2);
  for (let s2 of o2) {
    let w2 = function(e3) {
      e3 && o3.isConnected && [...l2.querySelectorAll(`[data-mod-setting]`)].find((t3) => t3.dataset.modSetting === e3)?.focus({ preventScroll: true });
    }, E2 = function() {
      !h2 || d2 || p2 || (h2 = false, x2().catch((e3) => {
        p2 || y2(e3);
      }));
    };
    let o3 = document.createElement(`div`), c2 = document.createElement(`p`), l2 = document.createElement(`div`);
    c2.setAttribute(`role`, `status`), c2.hidden = true;
    let u2 = document.createElement(`div`);
    o3.append(c2, u2, l2), e2.appendChild(b(n2 ? m(`settings.modSettings`) : s2.title || s2.namespace, [o3], !n2));
    let d2 = false, f2 = false, p2 = false, h2 = false, g2 = 0, _2 = /* @__PURE__ */ new Map();
    i2.has(s2.namespace) || i2.set(s2.namespace, /* @__PURE__ */ new Map());
    let v2 = i2.get(s2.namespace), y2 = (e3) => {
      c2.textContent = m(`settings.modSettingsFailed`) + ` ` + (e3.message || String(e3)), c2.hidden = false;
    };
    async function x2(e3 = null) {
      let n3 = ++g2, r3 = await t2.getModSettings(s2.namespace);
      if (p2 || n3 !== g2) return;
      e3 !== null && (_2.delete(e3), v2.delete(e3));
      let i3 = !d2 && l2.contains(document.activeElement) ? document.activeElement : null, a3 = [];
      for (let e4 of s2.fields || []) {
        if (_2.has(e4.key)) {
          let t3 = _2.get(e4.key);
          a3.push(t3.control), JSON.stringify(t3.value) !== JSON.stringify(r3.values[e4.key]) && (c2.textContent = (e4.label || e4.key) + `: ` + m(`settings.modSettingsConflict`, JSON.stringify(r3.values[e4.key])), c2.hidden = false);
          continue;
        }
        let n4 = v2.get(e4.key), i4 = n4?.review || { value: r3.values[e4.key], editIdentity: r3.editIdentity }, o5 = (n5, r4 = i4) => T2(() => t2.updateModSetting(s2.namespace, e4.key, n5, r4), e4.key, true, (t3) => {
          c2.textContent = m(`settings.modSettingsConflict`, JSON.stringify(t3.currentValue)), u2.appendChild(C(S(m(`settings.modSettingsUseCurrent`), async () => {
            if (!d2) {
              d2 = true, l2.inert = true;
              try {
                await x2(e4.key), u2.replaceChildren(), c2.hidden = true;
              } catch (e5) {
                y2(e5);
              } finally {
                d2 = false, l2.inert = false, w2(e4.key), E2();
              }
            }
          }), S(m(`settings.modSettingsKeepInput`), () => o5(n5, { value: t3.currentValue, editIdentity: t3.editIdentity }))));
        }), f4 = Q(e4, n4 ? { ...r3.values, [e4.key]: n4.raw } : r3.values, (e5) => o5(e5));
        if (!f4) continue;
        e4.description && (f4.title = e4.description);
        let h3 = f4.querySelector(`input, select, button, [role="switch"]`);
        h3 && (h3.dataset.modSetting = e4.key, h3.setAttribute(`aria-label`, e4.label || e4.key), n4 && (h3.value = n4.raw, _2.set(e4.key, { control: f4, value: n4.review.value }), JSON.stringify(n4.review.value) !== JSON.stringify(r3.values[e4.key]) && (c2.textContent = (e4.label || e4.key) + `: ` + m(`settings.modSettingsConflict`, JSON.stringify(r3.values[e4.key])), c2.hidden = false)), h3.addEventListener(`input`, () => {
          p2 || (_2.set(e4.key, { control: f4, value: i4.value }), v2.set(e4.key, { raw: h3.value, review: structuredClone(i4), revision: n4?.revision ?? r3.revision }));
        })), a3.push(f4);
      }
      let o4 = S(m(`settings.modSettingsReset`), () => T2(() => t2.resetModSettings(s2.namespace), `:reset`), { variant: `danger` });
      o4.dataset.modSetting = `:reset`;
      let f3 = S(m(`settings.modSettingsExport`), () => T2(async () => {
        let e4 = await t2.exportModSettings(s2.namespace);
        if (!navigator.clipboard) throw Error(m(`settings.modSettingsClipboard`));
        await navigator.clipboard.writeText(e4);
      }, `:export`, false));
      if (f3.dataset.modSetting = `:export`, a3.push(C(f3, o4)), a3.forEach((e4, t3) => {
        let n4 = l2.children[t3];
        n4 !== e4 && (n4 ? l2.replaceChild(e4, n4) : l2.appendChild(e4));
      }), i3 && !l2.contains(i3)) {
        w2(i3.dataset.modSetting);
        let e4 = document.activeElement;
        typeof i3.selectionStart == `number` && e4?.setSelectionRange && e4.setSelectionRange(i3.selectionStart, i3.selectionEnd, i3.selectionDirection);
      }
    }
    async function T2(e3, t3, n3 = true, i3 = null) {
      if (d2 || p2) return;
      g2++;
      let a3 = new Map(v2);
      d2 = true, l2.inert = true, c2.hidden = true, u2.replaceChildren();
      let o4;
      try {
        await e3();
      } catch (e4) {
        o4 = e4;
      }
      if (!o4) {
        if (n3) {
          t3 === `:reset` ? _2.clear() : _2.delete(t3);
          for (let [e4, n4] of a3) (t3 === `:reset` || e4 === t3) && v2.get(e4) === n4 && v2.delete(e4);
        }
        try {
          await x2();
        } catch (e4) {
          o4 = e4;
        }
      }
      if (o4) y2(o4), o4.code === `MOD_SETTING_CONFLICT` && i3 && i3(o4);
      else {
        f2 ||= n3;
        let e4 = [];
        n3 || e4.push(m(`settings.modSettingsCopied`)), r2 && f2 && e4.push(m(`selection.restart`)), c2.textContent = e4.join(`
`), c2.hidden = !e4.length;
      }
      d2 = false, l2.inert = false, o4 || w2(t3), E2();
    }
    let D2 = t2.subscribe?.(s2.namespace, () => {
      h2 = true, E2();
    });
    a2.push(() => {
      p2 = true, g2++, D2?.();
    }), x2().catch((e3) => {
      p2 || y2(e3);
    });
  }
  return () => a2.forEach((e3) => e3());
}
function renderFrameRate(container) {
  container.appendChild(b(m("settings.frameRate"), [T(m("settings.frameRate"), FRAME_RATE_OPTIONS.map((rate) => ({ value: String(rate), label: `${rate} FPS` })), getSettings().frameRate, (value) => {
    const settings = setSettings({ frameRate: value });
    const cc = engine.getCc();
    if (cc) applyFrameRate(cc.game, settings.frameRate);
  })]));
}
function renderSettingsGroup(container, group) {
  render(container, group);
}
export {
  bindModSettingsRegistry,
  render,
  renderFrameRate,
  renderHpSettings,
  renderModSettings,
  renderSettingsGroup,
  L as t
};
