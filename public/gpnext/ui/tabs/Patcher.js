import { getGpNextFeatureState, getSettings } from "../../core/SettingsStore.js";
import { o as n } from "../Translations.js";
import { i as r, l as i, n as a, r as o, t as s } from "../Components.js";
import { n as c } from "../Toast.js";
import "../../mods/FileLoader.js";
import { r as l } from "../../mods/ModVersion.js";
import { t as u } from "../../mods/ModPackPreflight.js";
import { t as d } from "../../platform/Opener.js";
var f = null, p = null, m = ``, h = null, g = [], _ = [], v = false;
function hasPendingPackChanges() {
  return v;
}
var b = null, x = null, S = null, C = null, w = { "experimental.jsModding": { labelKey: `experimental.jsModding` }, "experimental.worldMapJson": { labelKey: `experimental.worldMapJson` }, "experimental.plantLevelSystem": { labelKey: `experimental.plantLevelSystem` }, "runtime.dynamicPlantRegistry": { labelKey: `settings.dynamicPlantRegistry` }, "runtime.shopExtensions": { labelKey: `settings.shopExtensions` }, "runtime.scrollSensitivity": { labelKey: `settings.scrollSensitivity` } };
function T(e2) {
  let t2 = String(e2 || ``).replace(/[\\/]+$/, ``);
  return t2 ? `${t2}/gp-next` : `gp-next`;
}
function createOpenFolderButton() {
  return !m || m === `(unknown)` ? null : a(n(`patcher.openDir`), async () => {
    try {
      await d(T(m));
    } catch (e2) {
      c(`${n(`common.failed`)}: ${String(e2)}`, `error`);
    }
  }, { small: true });
}
function bindPatcher(e2, t2, n2, r2) {
  f = e2, p = t2, m = n2, h = r2 || null;
}
async function O(e2, t2) {
  if (!f) return null;
  if (typeof h?.reload == `function`) return h.reload(e2, t2);
  typeof h?.before == `function` && await h.before(e2);
  let n2 = await f.reloadPatches();
  return typeof h == `function` ? await Promise.resolve(h(n2, e2)) : typeof h?.after == `function` && await h.after(n2, e2), n2;
}
function k(e2, t2) {
  let r2 = document.createElement(`div`);
  r2.className = `gp-list-item`;
  let i2 = document.createElement(`span`);
  return i2.textContent = e2, r2.appendChild(i2), r2.appendChild(s(n(t2 ? `patcher.active` : `patcher.inactive`), t2 ? `success` : `warning`)), r2;
}
function A(e2, t2) {
  if (t2 < 0 || t2 >= g.length) return;
  let [n2] = g.splice(e2, 1);
  g.splice(t2, 0, n2), v = true, R();
}
function j() {
  return { packOrder: g.filter((e2) => e2.meta?.uuid).map((e2) => e2.meta.uuid), disabledPacks: _.filter((e2) => e2.meta?.uuid).map((e2) => e2.meta.uuid), version: 1 };
}
function M(e2) {
  let [t2] = g.splice(e2, 1);
  _.push(t2), v = true, R(), z();
}
function N(e2) {
  let [t2] = _.splice(e2, 1);
  g.push(t2), v = true, R(), z();
}
function P(r2, i2 = getSettings()) {
  let a2 = Array.isArray(r2?.meta?.requiredGpNextFeatures) ? r2.meta.requiredGpNextFeatures : [], o2 = [], s2 = [];
  for (let t2 of a2) {
    let r3 = w[t2];
    if (!r3) {
      s2.push(t2);
      continue;
    }
    getGpNextFeatureState(t2) !== true && o2.push({ label: n(r3.labelKey) });
  }
  return { missing: o2, unknown: s2 };
}
function F(e2) {
  let t2 = document.createElement(`div`);
  return t2.className = `gp-pack-requirement-warning`, t2.textContent = e2, t2;
}
function I() {
  let e2 = getSettings();
  return g.map((t2) => ({ pack: t2, state: P(t2, e2) })).filter((e3) => e3.state.missing.length > 0 || e3.state.unknown.length > 0);
}
function L() {
  if (!C) return;
  C.innerHTML = ``;
  let e2 = I();
  if (e2.length === 0) return;
  let t2 = document.createElement(`div`);
  t2.className = `gp-list-item`;
  let i2 = document.createElement(`span`);
  i2.textContent = n(`patcher.requiredFeaturesSummary`, e2.length), t2.appendChild(i2), t2.appendChild(s(n(`patcher.requiresFeatureBadge`), `warning`)), C.appendChild(t2), C.appendChild(r(n(`patcher.requiredFeaturesHint`)));
}
function R() {
  if (b) {
    if (L(), b.innerHTML = ``, g.length === 0) {
      b.appendChild(r(n(`patcher.noPacks`)));
      return;
    }
    g.forEach((e2, t2) => {
      b.appendChild(B(e2, t2, true));
    });
  }
}
function z() {
  x && (S && (S.hidden = _.length === 0), x.innerHTML = ``, _.forEach((e2, t2) => {
    x.appendChild(B(e2, t2, false));
  }));
}
function B(e2, t2, i2) {
  let o2 = document.createElement(`div`);
  o2.className = `gp-pack-card`, i2 || (o2.style.opacity = `0.6`);
  let c2 = document.createElement(`div`);
  if (c2.className = `gp-pack-thumb`, e2.meta?.thumbnailUrl) {
    let t3 = document.createElement(`img`);
    t3.src = e2.meta.thumbnailUrl, t3.alt = e2.meta?.name ? `${e2.meta.name} thumbnail` : `Pack thumbnail`, t3.style.cssText = `width:100%;height:100%;object-fit:cover;border-radius:3px;`, t3.onerror = () => {
      c2.innerHTML = ``, c2.textContent = `PK`, c2.classList.add(`gp-pack-thumb-fallback`);
    }, c2.appendChild(t3);
  } else c2.textContent = `PK`, c2.classList.add(`gp-pack-thumb-fallback`);
  o2.appendChild(c2);
  let d2 = document.createElement(`div`);
  d2.className = `gp-pack-info`;
  let f2 = document.createElement(`div`);
  f2.className = `gp-pack-name-row`;
  let p2 = document.createElement(`span`);
  p2.className = `gp-pack-name`, p2.textContent = e2.meta?.name || `(unnamed)`, f2.appendChild(p2), d2.appendChild(f2);
  let m2 = document.createElement(`div`);
  m2.className = `gp-pack-badge-row`, e2.dir?.endsWith(`.zip`) && m2.appendChild(r(`ZIP`)), e2.meta?.version && m2.appendChild(r(`v` + e2.meta.version));
  for (let t3 of e2.meta?.capabilities || []) {
    let e3 = n(`patcher.capability.${t3}`);
    m2.appendChild(r(e3));
  }
  let h2 = i2 ? P(e2) : { missing: [], unknown: [] };
  if ((h2.missing.length > 0 || h2.unknown.length > 0) && m2.appendChild(s(n(`patcher.requiresFeatureBadge`), `warning`)), i2 && e2.loaded?.length > 0 && m2.appendChild(r(n(`patcher.packItems`, e2.loaded.length))), i2 && e2.errors?.length > 0 && m2.appendChild(s(n(`patcher.packErrors`, e2.errors.length), `error`)), m2.childNodes.length > 0 && d2.appendChild(m2), e2.meta?.author) {
    let t3 = document.createElement(`div`);
    t3.className = `gp-text-muted`, t3.textContent = n(`patcher.packAuthor`, e2.meta.author), d2.appendChild(t3);
  }
  let _2 = e2.meta?.gameVersion, v2 = l(e2.meta);
  if (_2 || v2) {
    let e3 = document.createElement(`div`);
    e3.className = `gp-text-muted`, _2 && v2 ? e3.textContent = n(`patcher.packMeta`, _2, v2) : _2 ? e3.textContent = n(`patcher.packMetaGameOnly`, _2) : e3.textContent = n(`patcher.packMetaGpnOnly`, v2), d2.appendChild(e3);
  }
  for (let t3 of u(e2.meta)) d2.appendChild(F(t3));
  if (!e2.meta?.uuid) {
    let e3 = document.createElement(`div`);
    e3.className = `gp-text-muted`, e3.style.color = `var(--gp-warning, #ff9800)`, e3.textContent = n(`patcher.noUuid`), d2.appendChild(e3);
  }
  i2 && h2.missing.length > 0 && d2.appendChild(F(n(`patcher.missingRequiredFeatures`, h2.missing.map((e3) => e3.label).join(`, `)))), i2 && h2.unknown.length > 0 && d2.appendChild(F(n(`patcher.unknownRequiredFeatures`, h2.unknown.join(`, `)))), o2.appendChild(d2);
  let y2 = document.createElement(`div`);
  if (y2.className = `gp-pack-ctrl`, i2) {
    let e3 = a(`\u2191`, () => A(t2, t2 - 1), { small: true });
    e3.disabled = t2 === 0, e3.title = n(`patcher.moveUp`);
    let r2 = a(`\u2193`, () => A(t2, t2 + 1), { small: true });
    r2.disabled = t2 === g.length - 1, r2.title = n(`patcher.moveDown`);
    let i3 = a(n(`patcher.disablePack`), () => M(t2), { small: true, variant: `danger` });
    i3.title = n(`patcher.disablePack`), y2.appendChild(e3), y2.appendChild(r2), y2.appendChild(i3);
  } else {
    let e3 = a(n(`patcher.enablePack`), () => N(t2), { small: true, variant: `success` });
    e3.title = n(`patcher.enablePack`), y2.appendChild(e3);
  }
  return o2.appendChild(y2), o2;
}
function render(e2) {
  let t2 = f?.getStatus();
  if (t2 || e2.appendChild(k(n(`patcher.engineState`), false)), t2) {
    g = (t2.packs || []).filter((e3) => !e3.isSingle), _ = t2.disabledPacks || [], v = false, C = document.createElement(`div`), C.style.cssText = `display:flex;flex-direction:column;gap:4px;`, b = document.createElement(`div`), b.style.cssText = `display:flex;flex-direction:column;gap:12px;`, R();
    let l3 = r(n(`patcher.loadOrderHint`));
    l3.style.cssText = `margin-top:4px;`;
    let u3;
    u3 = a(n(`patcher.saveAndReload`), async () => {
      u3.disabled = true, u3.textContent = n(`patcher.saveAndReloading`);
      try {
        await O(`patcher-save-and-reload`, j()), v = false, e2.innerHTML = ``, render(e2);
      } catch (e3) {
        c(String(e3.message || e3), `error`);
      } finally {
        u3.textContent = n(`patcher.saveAndReload`), u3.disabled = false;
      }
    }, { small: true }), e2.appendChild(i(n(`patcher.packs`), [C, b, l3, o(u3)])), x = document.createElement(`div`), x.style.cssText = `display:flex;flex-direction:column;gap:12px;`, S = i(n(`patcher.disabledPacks`), [x]), z(), e2.appendChild(S);
    let d3 = t2.singleFile, f2 = d3?.registered?.length ?? d3?.loaded?.length ?? 0;
    if (d3 && (f2 > 0 || d3.errors.length > 0)) {
      let t3 = document.createElement(`div`);
      t3.className = `gp-list-item`;
      let r2 = document.createElement(`span`);
      r2.textContent = n(`patcher.singleFile`), t3.appendChild(r2);
      let a2 = document.createElement(`span`);
      a2.className = `gp-badge-group`, f2 > 0 && a2.appendChild(s(n(`patcher.packItems`, f2), `success`)), d3.errors.length > 0 && a2.appendChild(s(n(`patcher.packErrors`, d3.errors.length), `error`)), t3.appendChild(a2), e2.appendChild(i(n(`patcher.singleFileSection`), [t3]));
    }
    if (t2.editsCount > 0 || t2.editsPack?.errors?.length > 0) {
      let r2 = document.createElement(`div`);
      r2.className = `gp-list-item`;
      let a2 = document.createElement(`span`);
      a2.textContent = n(`patcher.gpnEdits`), r2.appendChild(a2);
      let o2 = document.createElement(`span`);
      o2.className = `gp-badge-group`, t2.editsCount > 0 && o2.appendChild(s(n(`patcher.packItems`, t2.editsCount), `info`)), t2.editsPack?.errors?.length > 0 && o2.appendChild(s(n(`patcher.packErrors`, t2.editsPack.errors.length), `error`)), r2.appendChild(o2), e2.appendChild(i(n(`patcher.gpnEditsSection`), [r2]));
    }
    if (t2.errors.length > 0) {
      let r2 = t2.errors.map((e3) => {
        let t3 = document.createElement(`div`);
        t3.className = `gp-list-item`;
        let r3 = document.createElement(`span`);
        return r3.className = `gp-text-mono`, r3.textContent = e3, t3.appendChild(r3), t3.appendChild(s(n(`patcher.error`), `error`)), t3;
      });
      e2.appendChild(i(n(`patcher.errors`), r2));
    }
  }
  let l2 = a(n(`patcher.reloadAll`), async () => {
    l2.textContent = n(`patcher.reloading`), l2.disabled = true;
    try {
      await O(`patcher-reload-all`), e2.innerHTML = ``, render(e2);
    } catch (e3) {
      c(String(e3.message || e3), `error`);
    } finally {
      l2.disabled = false, l2.textContent = n(`patcher.reloadAll`);
    }
  }), u2 = a(n(`patcher.restoreAll`), () => {
    p && (u2.textContent = n(`patcher.restored`, p.restoreAll().success), setTimeout(() => {
      e2.innerHTML = ``, render(e2);
    }, 1500));
  }, { variant: `danger` }), d2 = i(n(`patcher.actions`), [o(l2, u2)]);
  if (e2.appendChild(d2), m && m !== `(unknown)`) {
    let t3 = T(m), a2 = createOpenFolderButton(), o2 = i(n(`patcher.basePath`), [r(t3), a2]);
    e2.appendChild(o2);
  }
}
export {
  bindPatcher,
  createOpenFolderButton,
  hasPendingPackChanges,
  render
};
