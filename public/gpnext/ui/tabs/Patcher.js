import { getGpNextFeatureState, getSettings } from "../../core/SettingsStore.js";
import { a as n } from "../Translations.js";
import { n as r } from "../Toast.js";
import { i, l as a, n as o, r as s, t as c } from "../Components.js";
import "../../mods/FileLoader.js";
import { t as l } from "../../platform/Opener.js";
var u = null, d = null, f = ``, p = null, m = [], h = [], g = false;
function hasPendingPackChanges() {
  return g;
}
var v = null, y = null, b = null, x = null, S = { "experimental.jsModding": { labelKey: `experimental.jsModding` }, "experimental.worldMapJson": { labelKey: `experimental.worldMapJson` }, "experimental.plantLevelSystem": { labelKey: `experimental.plantLevelSystem` }, "runtime.dynamicPlantRegistry": { labelKey: `settings.dynamicPlantRegistry` }, "runtime.shopExtensions": { labelKey: `settings.shopExtensions` }, "runtime.scrollSensitivity": { labelKey: `settings.scrollSensitivity` } };
function C(e2) {
  let t2 = String(e2 || ``).replace(/[\\/]+$/, ``);
  return t2 ? `${t2}/gp-next` : `gp-next`;
}
function createOpenFolderButton() {
  return !f || f === `(unknown)` ? null : o(n(`patcher.openDir`), async () => {
    try {
      await l(C(f));
    } catch (e2) {
      r(`${n(`common.failed`)}: ${String(e2)}`, `error`);
    }
  }, { small: true });
}
function bindPatcher(e2, t2, n2, r2) {
  u = e2, d = t2, f = n2, p = r2 || null;
}
async function E(e2, t2) {
  if (!u) return null;
  if (typeof p?.reload == `function`) return p.reload(e2, t2);
  typeof p?.before == `function` && await p.before(e2);
  let n2 = await u.reloadPatches();
  return typeof p == `function` ? await Promise.resolve(p(n2, e2)) : typeof p?.after == `function` && await p.after(n2, e2), n2;
}
function D(e2, t2) {
  let r2 = document.createElement(`div`);
  r2.className = `gp-list-item`;
  let i2 = document.createElement(`span`);
  return i2.textContent = e2, r2.appendChild(i2), r2.appendChild(c(n(t2 ? `patcher.active` : `patcher.inactive`), t2 ? `success` : `warning`)), r2;
}
function O(e2, t2) {
  if (t2 < 0 || t2 >= m.length) return;
  let [n2] = m.splice(e2, 1);
  m.splice(t2, 0, n2), g = true, I();
}
function k() {
  return { packOrder: m.filter((e2) => e2.meta?.uuid).map((e2) => e2.meta.uuid), disabledPacks: h.filter((e2) => e2.meta?.uuid).map((e2) => e2.meta.uuid), version: 1 };
}
function A(e2) {
  let [t2] = m.splice(e2, 1);
  h.push(t2), g = true, I(), L();
}
function j(e2) {
  let [t2] = h.splice(e2, 1);
  m.push(t2), g = true, I(), L();
}
function M(r2, i2 = getSettings()) {
  let a2 = Array.isArray(r2?.meta?.requiredGpNextFeatures) ? r2.meta.requiredGpNextFeatures : [], o2 = [], s2 = [];
  for (let t2 of a2) {
    let r3 = S[t2];
    if (!r3) {
      s2.push(t2);
      continue;
    }
    getGpNextFeatureState(t2) !== true && o2.push({ label: n(r3.labelKey) });
  }
  return { missing: o2, unknown: s2 };
}
function N(e2) {
  let t2 = document.createElement(`div`);
  return t2.className = `gp-pack-requirement-warning`, t2.textContent = e2, t2;
}
function P() {
  let e2 = getSettings();
  return m.map((t2) => ({ pack: t2, state: M(t2, e2) })).filter((e3) => e3.state.missing.length > 0 || e3.state.unknown.length > 0);
}
function F() {
  if (!x) return;
  x.innerHTML = ``;
  let e2 = P();
  if (e2.length === 0) return;
  let t2 = document.createElement(`div`);
  t2.className = `gp-list-item`;
  let r2 = document.createElement(`span`);
  r2.textContent = n(`patcher.requiredFeaturesSummary`, e2.length), t2.appendChild(r2), t2.appendChild(c(n(`patcher.requiresFeatureBadge`), `warning`)), x.appendChild(t2), x.appendChild(i(n(`patcher.requiredFeaturesHint`)));
}
function I() {
  if (v) {
    if (F(), v.innerHTML = ``, m.length === 0) {
      v.appendChild(i(n(`patcher.noPacks`)));
      return;
    }
    m.forEach((e2, t2) => {
      v.appendChild(R(e2, t2, true));
    });
  }
}
function L() {
  y && (b && (b.hidden = h.length === 0), y.innerHTML = ``, h.forEach((e2, t2) => {
    y.appendChild(R(e2, t2, false));
  }));
}
function R(e2, t2, r2) {
  let i2 = document.createElement(`div`);
  i2.className = `gp-pack-card`, r2 || (i2.style.opacity = `0.6`);
  let a2 = document.createElement(`div`);
  if (a2.className = `gp-pack-thumb`, e2.meta?.thumbnailUrl) {
    let t3 = document.createElement(`img`);
    t3.src = e2.meta.thumbnailUrl, t3.alt = e2.meta?.name ? `${e2.meta.name} thumbnail` : `Pack thumbnail`, t3.style.cssText = `width:100%;height:100%;object-fit:cover;border-radius:3px;`, t3.onerror = () => {
      a2.innerHTML = ``, a2.textContent = `PK`, a2.classList.add(`gp-pack-thumb-fallback`);
    }, a2.appendChild(t3);
  } else a2.textContent = `PK`, a2.classList.add(`gp-pack-thumb-fallback`);
  i2.appendChild(a2);
  let s2 = document.createElement(`div`);
  s2.className = `gp-pack-info`;
  let l2 = document.createElement(`div`);
  l2.className = `gp-pack-name-row`;
  let u2 = document.createElement(`span`);
  u2.className = `gp-pack-name`, u2.textContent = e2.meta?.name || `(unnamed)`, l2.appendChild(u2), s2.appendChild(l2);
  let d2 = document.createElement(`div`);
  d2.className = `gp-pack-badge-row`, e2.dir?.endsWith(`.zip`) && d2.appendChild(c(`ZIP`, `warning`)), e2.meta?.version && d2.appendChild(c(`v` + e2.meta.version, `info`));
  for (let t3 of e2.meta?.capabilities || []) {
    let e3 = n(`patcher.capability.${t3}`), r3 = t3 === `js` ? `warning` : t3 === `asset` ? `info` : `success`;
    d2.appendChild(c(e3, r3));
  }
  let f2 = r2 ? M(e2) : { missing: [], unknown: [] };
  if ((f2.missing.length > 0 || f2.unknown.length > 0) && d2.appendChild(c(n(`patcher.requiresFeatureBadge`), `warning`)), r2 && e2.loaded?.length > 0 && d2.appendChild(c(n(`patcher.packItems`, e2.loaded.length), `success`)), r2 && e2.errors?.length > 0 && d2.appendChild(c(n(`patcher.packErrors`, e2.errors.length), `error`)), d2.childNodes.length > 0 && s2.appendChild(d2), e2.meta?.author) {
    let t3 = document.createElement(`div`);
    t3.className = `gp-text-muted`, t3.textContent = n(`patcher.packAuthor`, e2.meta.author), s2.appendChild(t3);
  }
  let p2 = e2.meta?.gameVersion, h2 = e2.meta?.minGpNextVersion, g2 = e2.meta?.maxGpNextVersion, _2 = h2 && g2 ? `${h2} \u2013 ${g2}` : h2 ? `\u2265 ${h2}` : g2 ? `\u2264 ${g2}` : ``;
  if (p2 || _2) {
    let e3 = document.createElement(`div`);
    e3.className = `gp-text-muted`, p2 && _2 ? e3.textContent = n(`patcher.packMeta`, p2, _2) : p2 ? e3.textContent = n(`patcher.packMetaGameOnly`, p2) : e3.textContent = n(`patcher.packMetaGpnOnly`, _2), s2.appendChild(e3);
  }
  if (!e2.meta?.uuid) {
    let e3 = document.createElement(`div`);
    e3.className = `gp-text-muted`, e3.style.color = `#ff9800`, e3.textContent = n(`patcher.noUuid`), s2.appendChild(e3);
  }
  r2 && f2.missing.length > 0 && s2.appendChild(N(n(`patcher.missingRequiredFeatures`, f2.missing.map((e3) => e3.label).join(`, `)))), r2 && f2.unknown.length > 0 && s2.appendChild(N(n(`patcher.unknownRequiredFeatures`, f2.unknown.join(`, `)))), i2.appendChild(s2);
  let v2 = document.createElement(`div`);
  if (v2.className = `gp-pack-ctrl`, r2) {
    let e3 = o(`\u2191`, () => O(t2, t2 - 1), { small: true });
    e3.disabled = t2 === 0, e3.title = n(`patcher.moveUp`);
    let r3 = o(`\u2193`, () => O(t2, t2 + 1), { small: true });
    r3.disabled = t2 === m.length - 1, r3.title = n(`patcher.moveDown`);
    let i3 = o(n(`patcher.disablePack`), () => A(t2), { small: true, variant: `danger` });
    i3.title = n(`patcher.disablePack`), v2.appendChild(e3), v2.appendChild(r3), v2.appendChild(i3);
  } else {
    let e3 = o(n(`patcher.enablePack`), () => j(t2), { small: true, variant: `success` });
    e3.title = n(`patcher.enablePack`), v2.appendChild(e3);
  }
  return i2.appendChild(v2), i2;
}
function render(e2) {
  let t2 = u?.getStatus();
  if (t2 || e2.appendChild(D(n(`patcher.engineState`), false)), t2) {
    m = (t2.packs || []).filter((e3) => !e3.isSingle), h = t2.disabledPacks || [], g = false, x = document.createElement(`div`), x.style.cssText = `display:flex;flex-direction:column;gap:4px;`, v = document.createElement(`div`), v.style.cssText = `display:flex;flex-direction:column;gap:6px;`, I();
    let l3 = i(n(`patcher.loadOrderHint`));
    l3.style.cssText = `margin-top:4px;`;
    let u2;
    u2 = o(n(`patcher.saveAndReload`), async () => {
      u2.disabled = true, u2.textContent = n(`patcher.saveAndReloading`);
      try {
        await E(`patcher-save-and-reload`, k()), g = false, e2.innerHTML = ``, render(e2);
      } catch (e3) {
        r(String(e3.message || e3), `error`);
      } finally {
        u2.textContent = n(`patcher.saveAndReload`), u2.disabled = false;
      }
    }, { small: true }), e2.appendChild(a(n(`patcher.packs`), [x, v, l3, s(u2)])), y = document.createElement(`div`), y.style.cssText = `display:flex;flex-direction:column;gap:6px;`, b = a(n(`patcher.disabledPacks`), [y]), L(), e2.appendChild(b);
    let d2 = t2.singleFile, f2 = d2?.registered?.length ?? d2?.loaded?.length ?? 0;
    if (d2 && (f2 > 0 || d2.errors.length > 0)) {
      let t3 = document.createElement(`div`);
      t3.className = `gp-list-item`;
      let r2 = document.createElement(`span`);
      r2.textContent = n(`patcher.singleFile`), t3.appendChild(r2);
      let i2 = document.createElement(`span`);
      i2.style.cssText = `display:flex; gap:4px;`, f2 > 0 && i2.appendChild(c(n(`patcher.packItems`, f2), `success`)), d2.errors.length > 0 && i2.appendChild(c(n(`patcher.packErrors`, d2.errors.length), `error`)), t3.appendChild(i2), e2.appendChild(a(n(`patcher.singleFileSection`), [t3]));
    }
    if (t2.editsCount > 0 || t2.editsPack?.errors?.length > 0) {
      let r2 = document.createElement(`div`);
      r2.className = `gp-list-item`;
      let i2 = document.createElement(`span`);
      i2.textContent = n(`patcher.gpnEdits`), r2.appendChild(i2);
      let o2 = document.createElement(`span`);
      o2.style.cssText = `display:flex; gap:4px;`, t2.editsCount > 0 && o2.appendChild(c(n(`patcher.packItems`, t2.editsCount), `info`)), t2.editsPack?.errors?.length > 0 && o2.appendChild(c(n(`patcher.packErrors`, t2.editsPack.errors.length), `error`)), r2.appendChild(o2), e2.appendChild(a(n(`patcher.gpnEditsSection`), [r2]));
    }
    if (t2.errors.length > 0) {
      let r2 = t2.errors.map((e3) => {
        let t3 = document.createElement(`div`);
        t3.className = `gp-list-item`;
        let r3 = document.createElement(`span`);
        return r3.className = `gp-text-mono`, r3.textContent = e3, t3.appendChild(r3), t3.appendChild(c(n(`patcher.error`), `error`)), t3;
      });
      e2.appendChild(a(n(`patcher.errors`), r2));
    }
  }
  let l2 = o(n(`patcher.reloadAll`), async () => {
    l2.textContent = n(`patcher.reloading`), l2.disabled = true;
    try {
      await E(`patcher-reload-all`), e2.innerHTML = ``, render(e2);
    } catch (e3) {
      r(String(e3.message || e3), `error`);
    } finally {
      l2.disabled = false, l2.textContent = n(`patcher.reloadAll`);
    }
  }), p2 = o(n(`patcher.restoreAll`), () => {
    d && (p2.textContent = n(`patcher.restored`, d.restoreAll().success), setTimeout(() => {
      e2.innerHTML = ``, render(e2);
    }, 1500));
  }, { variant: `danger` }), _2 = a(n(`patcher.actions`), [s(l2, p2)]);
  if (e2.appendChild(_2), f && f !== `(unknown)`) {
    let t3 = C(f), r2 = createOpenFolderButton(), o2 = a(n(`patcher.basePath`), [i(t3), r2]);
    e2.appendChild(o2);
  }
}
export {
  bindPatcher,
  createOpenFolderButton,
  hasPendingPackChanges,
  render
};
