import { n as a, t as c, i, r as o, s } from "./components-CBbpXSWx.js";
import { t as u } from "./dist-js-BfJhZoDA.js";
import { b as l } from "./file-loader-CwId5kgu.js";
import { a as n } from "./i18n-lC03d84Z.js";
import { n as e, r as t } from "./settings-store-ClY3sNI-.js";
import { n as r } from "./toast-CnLSOsm-.js";
var d = null,
    f = null,
    p = ``,
    m = null,
    h = [],
    g = [],
    _ = null,
    v = null,
    y = null,
    b = {
        "experimental.jsModding": { labelKey: `experimental.jsModding` },
        "experimental.worldMapJson": { labelKey: `experimental.worldMapJson` },
        "experimental.plantLevelSystem": { labelKey: `experimental.plantLevelSystem` },
        "runtime.dynamicPlantRegistry": { labelKey: `settings.dynamicPlantRegistry` },
        "runtime.shopExtensions": { labelKey: `settings.shopExtensions` },
        "runtime.scrollSensitivity": { labelKey: `settings.scrollSensitivity` },
    };
function x(e) {
    let t = String(e || ``).replace(/[\\/]+$/, ``);
    return t ? `${t}/gp-next` : `gp-next`;
}
function S(e, t, n, r) {
    ((d = e), (f = t), (p = n), (m = r || null));
}
async function C(e) {
    if (!d) return null;
    typeof m?.before == `function` && (await m.before(e));
    let t = await d.reloadPatches();
    return (
        typeof m == `function`
            ? await Promise.resolve(m(t, e))
            : typeof m?.after == `function` && (await m.after(t, e)),
        t
    );
}
function w(e, t) {
    let r = document.createElement(`div`);
    r.className = `gp-list-item`;
    let i = document.createElement(`span`);
    return (
        (i.textContent = e),
        r.appendChild(i),
        r.appendChild(c(n(t ? `patcher.active` : `patcher.inactive`), t ? `success` : `warning`)),
        r
    );
}
function T(e, t) {
    if (t < 0 || t >= h.length) return;
    let [n] = h.splice(e, 1);
    (h.splice(t, 0, n), N());
}
async function E() {
    return l({
        packOrder: h.filter(e => e.meta?.uuid).map(e => e.meta.uuid),
        disabledPacks: g.filter(e => e.meta?.uuid).map(e => e.meta.uuid),
        version: 1,
    });
}
function D(e) {
    let [t] = h.splice(e, 1);
    (g.push(t), N(), P());
}
function O(e) {
    let [t] = g.splice(e, 1);
    (h.push(t), N(), P());
}
function k(r, i = t()) {
    let a = Array.isArray(r?.meta?.requiredGpNextFeatures) ? r.meta.requiredGpNextFeatures : [],
        o = [],
        s = [];
    for (let t of a) {
        let r = b[t];
        if (!r) {
            s.push(t);
            continue;
        }
        e(t) !== !0 && o.push({ label: n(r.labelKey) });
    }
    return { missing: o, unknown: s };
}
function A(e) {
    let t = document.createElement(`div`);
    return ((t.className = `gp-pack-requirement-warning`), (t.textContent = e), t);
}
function j() {
    let e = t();
    return h
        .map(t => ({ pack: t, state: k(t, e) }))
        .filter(e => e.state.missing.length > 0 || e.state.unknown.length > 0);
}
function M() {
    if (!y) return;
    y.innerHTML = ``;
    let e = j();
    if (e.length === 0) return;
    let t = document.createElement(`div`);
    t.className = `gp-list-item`;
    let r = document.createElement(`span`);
    ((r.textContent = n(`patcher.requiredFeaturesSummary`, e.length)),
        t.appendChild(r),
        t.appendChild(c(n(`patcher.requiresFeatureBadge`), `warning`)),
        y.appendChild(t),
        y.appendChild(i(n(`patcher.requiredFeaturesHint`))));
}
function N() {
    if (_) {
        if ((M(), (_.innerHTML = ``), h.length === 0)) {
            _.appendChild(i(n(`patcher.noPacks`)));
            return;
        }
        h.forEach((e, t) => {
            _.appendChild(F(e, t, !0));
        });
    }
}
function P() {
    v &&
        ((v.innerHTML = ``),
        g.forEach((e, t) => {
            v.appendChild(F(e, t, !1));
        }));
}
function F(e, t, r) {
    let i = document.createElement(`div`);
    ((i.className = `gp-pack-card`), r || (i.style.opacity = `0.6`));
    let o = document.createElement(`div`);
    if (((o.className = `gp-pack-thumb`), e.meta?.thumbnailUrl)) {
        let t = document.createElement(`img`);
        ((t.src = e.meta.thumbnailUrl),
            (t.alt = e.meta?.name ? `${e.meta.name} thumbnail` : `Pack thumbnail`),
            (t.style.cssText = `width:100%;height:100%;object-fit:cover;border-radius:3px;`),
            (t.onerror = () => {
                ((o.innerHTML = ``), (o.textContent = `PK`), o.classList.add(`gp-pack-thumb-fallback`));
            }),
            o.appendChild(t));
    } else ((o.textContent = `PK`), o.classList.add(`gp-pack-thumb-fallback`));
    i.appendChild(o);
    let s = document.createElement(`div`);
    s.className = `gp-pack-info`;
    let l = document.createElement(`div`);
    l.className = `gp-pack-name-row`;
    let u = document.createElement(`span`);
    ((u.className = `gp-pack-name`), (u.textContent = e.meta?.name || `(unnamed)`), l.appendChild(u), s.appendChild(l));
    let d = document.createElement(`div`);
    ((d.className = `gp-pack-badge-row`),
        e.dir?.endsWith(`.zip`) && d.appendChild(c(`ZIP`, `warning`)),
        e.meta?.version && d.appendChild(c(`v` + e.meta.version, `info`)));
    for (let t of e.meta?.capabilities || []) {
        let e = n(`patcher.capability.${t}`),
            r = t === `js` ? `warning` : t === `asset` ? `info` : `success`;
        d.appendChild(c(e, r));
    }
    let f = r ? k(e) : { missing: [], unknown: [] };
    if (
        ((f.missing.length > 0 || f.unknown.length > 0) &&
            d.appendChild(c(n(`patcher.requiresFeatureBadge`), `warning`)),
        r && e.loaded?.length > 0 && d.appendChild(c(n(`patcher.packItems`, e.loaded.length), `success`)),
        r && e.errors?.length > 0 && d.appendChild(c(n(`patcher.packErrors`, e.errors.length), `error`)),
        d.childNodes.length > 0 && s.appendChild(d),
        e.meta?.author)
    ) {
        let t = document.createElement(`div`);
        ((t.className = `gp-text-muted`), (t.textContent = n(`patcher.packAuthor`, e.meta.author)), s.appendChild(t));
    }
    let p = e.meta?.gameVersion,
        m = e.meta?.minGpNextVersion,
        g = e.meta?.maxGpNextVersion,
        _ = m && g ? `${m} – ${g}` : m ? `≥ ${m}` : g ? `≤ ${g}` : ``;
    if (p || _) {
        let e = document.createElement(`div`);
        ((e.className = `gp-text-muted`),
            (e.style.fontSize = `10px`),
            p && _
                ? (e.textContent = n(`patcher.packMeta`, p, _))
                : p
                  ? (e.textContent = n(`patcher.packMetaGameOnly`, p))
                  : (e.textContent = n(`patcher.packMetaGpnOnly`, _)),
            s.appendChild(e));
    }
    if (e.meta?.js?.entry || e.meta?.apiVersion > 0 || e.meta?.packFormatVersion > 1) {
        let t = document.createElement(`div`);
        ((t.className = `gp-text-muted`), (t.style.fontSize = `10px`));
        let r = [];
        (e.meta?.js?.entry && r.push(n(`patcher.jsEntry`, e.meta.js.entry)),
            e.meta?.apiVersion > 0 && r.push(n(`patcher.apiVersion`, e.meta.apiVersion)),
            e.meta?.packFormatVersion > 1 && r.push(n(`patcher.packFormatVersion`, e.meta.packFormatVersion)),
            (t.textContent = r.join(` · `)),
            s.appendChild(t));
    }
    if (!e.meta?.uuid) {
        let e = document.createElement(`div`);
        ((e.className = `gp-text-muted`),
            (e.style.color = `#ff9800`),
            (e.textContent = n(`patcher.noUuid`)),
            s.appendChild(e));
    }
    (r &&
        f.missing.length > 0 &&
        s.appendChild(A(n(`patcher.missingRequiredFeatures`, f.missing.map(e => e.label).join(`, `)))),
        r && f.unknown.length > 0 && s.appendChild(A(n(`patcher.unknownRequiredFeatures`, f.unknown.join(`, `)))),
        i.appendChild(s));
    let v = document.createElement(`div`);
    if (((v.className = `gp-pack-ctrl`), r)) {
        let e = a(`↑`, () => T(t, t - 1), { small: !0 });
        ((e.disabled = t === 0), (e.title = n(`patcher.moveUp`)));
        let r = a(`↓`, () => T(t, t + 1), { small: !0 });
        ((r.disabled = t === h.length - 1), (r.title = n(`patcher.moveDown`)));
        let i = a(n(`patcher.disablePack`), () => D(t), { small: !0, variant: `danger` });
        ((i.title = n(`patcher.disablePack`)), v.appendChild(e), v.appendChild(r), v.appendChild(i));
    } else {
        let e = a(n(`patcher.enablePack`), () => O(t), { small: !0, variant: `success` });
        ((e.title = n(`patcher.enablePack`)), v.appendChild(e));
    }
    return (i.appendChild(v), i);
}
function I(e) {
    let t = d?.getStatus(),
        l = [];
    if ((l.push(w(n(`patcher.engineState`), !!t)), t?.totalAssets)) {
        let e = document.createElement(`div`);
        e.className = `gp-list-item`;
        let r = document.createElement(`span`);
        ((r.textContent = n(`patcher.assetCount`)),
            e.appendChild(r),
            e.appendChild(c(String(t.totalAssets), `info`)),
            l.push(e));
    }
    let m = s(n(`patcher.title`), l);
    if ((e.appendChild(m), t)) {
        ((h = (t.packs || []).filter(e => !e.isSingle)),
            (g = t.disabledPacks || []),
            (y = document.createElement(`div`)),
            (y.style.cssText = `display:flex;flex-direction:column;gap:4px;`),
            (_ = document.createElement(`div`)),
            (_.style.cssText = `display:flex;flex-direction:column;gap:6px;`),
            N());
        let r = i(n(`patcher.loadOrderHint`));
        r.style.cssText = `margin-top:4px;`;
        let l;
        ((l = a(
            n(`patcher.saveAndReload`),
            async () => {
                ((l.disabled = !0), (l.textContent = n(`patcher.saveAndReloading`)));
                let t = await E();
                t && d
                    ? (await C(`patcher-save-and-reload`), (e.innerHTML = ``), I(e))
                    : ((l.textContent = n(t ? `patcher.orderSaved` : `common.failed`)),
                      setTimeout(() => {
                          ((l.textContent = n(`patcher.saveAndReload`)), (l.disabled = !1));
                      }, 2e3));
            },
            { small: !0 },
        )),
            e.appendChild(s(n(`patcher.packs`), [y, _, r, o(l)])),
            (v = document.createElement(`div`)),
            (v.style.cssText = `display:flex;flex-direction:column;gap:6px;`),
            P());
        let u = s(n(`patcher.disabledPacks`), [v], g.length === 0);
        e.appendChild(u);
        let f = t.singleFile,
            p = f?.registered?.length ?? f?.loaded?.length ?? 0;
        if (f && (p > 0 || f.errors.length > 0)) {
            let t = document.createElement(`div`);
            t.className = `gp-list-item`;
            let r = document.createElement(`span`);
            ((r.textContent = n(`patcher.singleFile`)), t.appendChild(r));
            let i = document.createElement(`span`);
            ((i.style.cssText = `display:flex; gap:4px;`),
                p > 0 && i.appendChild(c(n(`patcher.packItems`, p), `success`)),
                f.errors.length > 0 && i.appendChild(c(n(`patcher.packErrors`, f.errors.length), `error`)),
                t.appendChild(i),
                e.appendChild(s(n(`patcher.singleFileSection`), [t])));
        }
        if (t.editsCount > 0 || t.editsPack?.errors?.length > 0) {
            let r = document.createElement(`div`);
            r.className = `gp-list-item`;
            let i = document.createElement(`span`);
            ((i.textContent = n(`patcher.gpnEdits`)), r.appendChild(i));
            let a = document.createElement(`span`);
            ((a.style.cssText = `display:flex; gap:4px;`),
                t.editsCount > 0 && a.appendChild(c(n(`patcher.packItems`, t.editsCount), `info`)),
                t.editsPack?.errors?.length > 0 &&
                    a.appendChild(c(n(`patcher.packErrors`, t.editsPack.errors.length), `error`)),
                r.appendChild(a),
                e.appendChild(s(n(`patcher.gpnEditsSection`), [r])));
        }
        if (t.errors.length > 0) {
            let r = t.errors.map(e => {
                let t = document.createElement(`div`);
                t.className = `gp-list-item`;
                let r = document.createElement(`span`);
                return (
                    (r.className = `gp-text-mono`),
                    (r.textContent = e),
                    t.appendChild(r),
                    t.appendChild(c(n(`patcher.error`), `error`)),
                    t
                );
            });
            e.appendChild(s(n(`patcher.errors`), r));
        }
    }
    let b = a(n(`patcher.reloadAll`), async () => {
            ((b.textContent = n(`patcher.reloading`)), (b.disabled = !0));
            try {
                (await C(`patcher-reload-all`), (e.innerHTML = ``), I(e));
            } finally {
                b.disabled = !1;
            }
        }),
        S = a(
            n(`patcher.restoreAll`),
            () => {
                f &&
                    ((S.textContent = n(`patcher.restored`, f.restoreAll().success)),
                    setTimeout(() => {
                        ((e.innerHTML = ``), I(e));
                    }, 1500));
            },
            { variant: `danger` },
        ),
        T = s(n(`patcher.actions`), [o(b, S)]);
    if ((e.appendChild(T), p)) {
        let t = x(p),
            o = a(
                n(`patcher.openDir`),
                async () => {
                    try {
                        await u(t);
                    } catch (e) {
                        r(`${n(`common.failed`)}: ${String(e)}`, `error`);
                    }
                },
                { small: !0 },
            ),
            c = s(n(`patcher.basePath`), [i(t), o]);
        e.appendChild(c);
    }
}
export { S as bindPatcher, I as render };
