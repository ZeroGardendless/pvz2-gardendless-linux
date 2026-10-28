import { createModCardLoader } from "../ModCard.js";
import { l as packSection } from "../Components.js";
import { isJsModdingRuntimeEnabled } from "../../core/SettingsStore.js";
import { o as t } from "../Translations.js";
import { a as n, n as r, o as i, r as a } from "../Components.js";
import { n as o } from "../Toast.js";
import { n as s } from "../../mods/ModSettingsRegistry.js";
import { n as c } from "../../platform/Opener.js";
import { t as l } from "./Pages.js";
import { createOpenFolderButton, hasPendingPackChanges, render as f } from "./Patcher.js";
import { render as p, renderRuntimeControls } from "./Mods.js";
import { renderModSettings } from "./Settings.js";
function g(e2) {
  let t2 = e2.active.configuration, n2 = e2.desired, r2 = [], i2 = new Map(t2.mods.map((e3) => [e3.id, e3])), a2 = new Map(n2.mods.map((e3) => [e3.id, e3]));
  for (let e3 of /* @__PURE__ */ new Set([...i2.keys(), ...a2.keys()])) {
    let t3 = i2.get(e3), n3 = a2.get(e3), o3 = n3 || t3, s3 = [];
    t3 ? n3 ? (t3.enabled !== n3.enabled && s3.push(n3.enabled ? `migration.enabled` : `migration.disabled`), t3.contentDigest !== n3.contentDigest && s3.push(`migration.filesChanged`)) : s3.push(`migration.removed`) : s3.push(`migration.added`), s3.length && r2.push({ name: o3.fallbackName || o3.runtimeNamespace || o3.id, labels: s3 });
  }
  let o2 = (e3) => e3.mods.filter((e4) => e4.enabled).map((e4) => e4.id), s2 = e2.active.ordered || o2(t2), c2 = o2(n2), l2 = s2.filter((e3) => c2.includes(e3));
  JSON.stringify(l2) !== JSON.stringify(c2.filter((e3) => l2.includes(e3))) && r2.push({ labels: [`migration.orderChanged`] });
  for (let e3 of n2.overrides) t2.overrides.find((t3) => t3.kind === e3.kind)?.contentDigest !== e3.contentDigest && r2.push({ nameKey: e3.kind === `edits` ? `migration.edits` : `migration.patches`, labels: [`migration.filesChanged`] });
  return r2;
}
function _({ prepare: e2, storage: n2, hasUnsavedChanges: i2, restart: o2 = () => globalThis.location.reload() }) {
  let s2 = false, c2 = `idle`, l2 = null, u2 = null, d2, f2, p2 = (e3) => {
    let t2 = document.createElement(`p`);
    t2.textContent = e3, d2.appendChild(t2);
  };
  function m2() {
    if (d2) {
      if (d2.replaceChildren(), f2.inert = [`preparing`, `preview`, `committing`, `done`].includes(c2), f2.hidden = c2 === `done`, c2 === `done`) {
        p2(t(s2 ? `application.leaveGame` : `migration.restart`)), d2.appendChild(r(t(`application.restart`), () => {
          s2 ? o2() : (s2 = true, m2());
        })), s2 && d2.appendChild(r(t(`migration.cancel`), () => {
          s2 = false, m2();
        }));
        return;
      }
      if (c2 === `preparing` || c2 === `committing`) {
        p2(t(`migration.` + c2));
        return;
      }
      if (u2 && (p2(t(u2 === `unsaved` ? `migration.unsaved` : `migration.failed`)), u2 !== `unsaved`)) {
        let e3 = document.createElement(`details`), n3 = document.createElement(`summary`), r2 = document.createElement(`p`);
        n3.textContent = t(`migration.reason`), r2.textContent = u2.message || String(u2), e3.append(n3, r2), d2.appendChild(e3);
      }
      if (c2 === `preview`) {
        p2(t(`migration.confirmHint`));
        for (let e3 of g(l2.preview)) {
          let n3 = e3.nameKey ? t(e3.nameKey) : e3.name;
          p2((n3 ? n3 + `: ` : ``) + e3.labels.map((e4) => t(e4)).join(` \xB7 `));
        }
        d2.appendChild(a(r(t(`migration.confirm`), async () => {
          if (c2 === `preview`) {
            c2 = `committing`, u2 = null, m2();
            try {
              await l2.commit(n2), c2 = `done`;
            } catch (e3) {
              u2 = e3, c2 = `idle`, l2 = null;
            }
            m2();
          }
        }), r(t(`migration.cancel`), () => {
          c2 = `idle`, l2 = null, u2 = null, m2();
        })));
        return;
      }
      d2.appendChild(r(t(`migration.prepare`), async () => {
        if (c2 === `idle`) {
          if (i2()) {
            u2 = `unsaved`, m2();
            return;
          }
          c2 = `preparing`, u2 = null, m2();
          try {
            l2 = await e2(), c2 = `preview`;
          } catch (e3) {
            u2 = e3, c2 = `idle`;
          }
          m2();
        }
      }));
    }
  }
  return { render(e3, t2) {
    d2 = e3, f2 = t2, m2();
  } };
}
function v(e2, i2 = null, o2 = null, s2 = null) {
  const loadCard = createModCardLoader((id) => e2.describe(id));
  let c2, l2, u2, d2 = false, f2 = false, p2 = null, m2 = null, h2 = null, g2 = false, _2 = null, v2 = null, y2 = null, b = null, x = 0, S = null, C = (e3) => JSON.stringify(e3.map(({ id: e4, enabled: t2 }) => ({ id: e4, enabled: t2 }))), w = () => l2 && C(l2) !== C(u2.desired.mods), T = () => {
    u2 = e2.getState(), l2 = structuredClone(u2.desired.mods), m2 = null;
  }, E = (e3) => {
    let t2 = document.createElement(`p`);
    return t2.textContent = e3, t2;
  }, D = (e3) => {
    for (let t2 of e3 || []) {
      let e4 = E(t2);
      e4.className = `gp-pack-requirement-warning`, c2.appendChild(e4);
    }
  }, O = () => c2.closest(`.gp-content`) || c2;
  function k(e3) {
    x = O().scrollTop, S = e3, O().scrollTop = 0;
  }
  function A() {
    return d2 || f2 || g2 || !b && !p2 ? false : (b = null, p2 = null, y2 = null, m2 = null, F(), O().scrollTop = x, [...c2.querySelectorAll(`[data-mod-focus]`)].find((e3) => e3.dataset.modFocus === S)?.focus({ preventScroll: true }), true);
  }
  let j = { "experimental.jsModding": [`experimental.jsModding`, `experimental`], "runtime.jsModding": [`experimental.jsModding`, `experimental`], "experimental.worldMapJson": [`experimental.worldMapJson`, `experimental`], "runtime.worldMapJson": [`experimental.worldMapJson`, `experimental`], "experimental.plantLevelSystem": [`experimental.plantLevelSystem`, `experimental`], "runtime.plantLevelSystem": [`experimental.plantLevelSystem`, `experimental`], "runtime.dynamicPlantRegistry": [`settings.dynamicPlantRegistry`, `settings`], "runtime.shopExtensions": [`settings.shopExtensions`, `settings`], "runtime.scrollSensitivity": [`settings.scrollSensitivityEnabled`, `settings`] };
  function M(n2 = []) {
    if (!n2.length) return;
    let i3 = document.createElement(`ul`);
    i3.className = `gp-requirements`;
    for (let a2 of n2) {
      let n3 = j[a2.id], o3 = a2.kind === `feature` ? n3 ? t(n3[0]) : a2.id : a2.name, s3 = document.createElement(`li`);
      s3.className = `gp-requirement`;
      let c3 = document.createElement(`div`);
      c3.className = `gp-requirement-body`;
      let l3 = document.createElement(`span`);
      l3.className = `gp-requirement-name`, l3.textContent = o3;
      let u3 = document.createElement(`span`);
      if (u3.className = `gp-mod-status`, u3.textContent = t(`requirements.` + a2.status) + (a2.optional ? ` \xB7 ` + t(`requirements.optional`) : ``), a2.status !== `ready` && !a2.optional && u3.classList.add(`gp-mod-status-warning`), c3.append(l3, u3), a2.kind === `mod` && o3 !== a2.id) {
        let e3 = document.createElement(`span`);
        e3.className = `gp-requirement-id`, e3.textContent = a2.id, c3.append(e3);
      }
      s3.append(c3), a2.kind === `feature` && a2.status === `disabled` && n3 && e2.openRequirementSettings && s3.appendChild(r(t(`requirements.open.` + n3[1]), () => e2.openRequirementSettings(n3[1]), { small: true })), i3.appendChild(s3);
    }
    c2.appendChild(i3);
  }
  function N(e3) {
    M(e3.requirements?.filter((e4) => e4.status !== `ready`)), e3.dependents?.length && c2.appendChild(E(t(`uninstall.dependents`, e3.dependents.map((e4) => e4.name + ` (` + e4.id + `)`).join(`, `))));
    let n2 = document.createElement(`details`), r2 = document.createElement(`summary`);
    r2.textContent = t(`migration.reason`), n2.append(r2, E(e3.message || String(e3))), c2.appendChild(n2);
  }
  function P() {
    let i3 = r(t(`sections.back`), A);
    if (i3.dataset.modFocus = `detail:back`, i3.prepend(n(`m14 6-6 6 6 6`)), c2.appendChild(a(i3)), b.loading) {
      c2.appendChild(E(t(`modDetail.loading`)));
      return;
    }
    if (b.error) {
      c2.appendChild(E(t(`modDetail.failed`)), E(b.error.message || String(b.error)));
      return;
    }
    let l3 = b.value, u3 = document.createElement(`h3`);
    if (u3.textContent = l3.name, c2.appendChild(u3), c2.appendChild(E(l3.version + (l3.author ? ` \xB7 ` + l3.author : ``))), l3.pending && (l3.activeVersion && c2.appendChild(E(t(`modDetail.activeVersion`, l3.activeVersion))), c2.appendChild(E(t(`selection.restart`)))), m2 && N(m2), M(l3.requirements), l3.description && c2.appendChild(E(l3.description)), l3.gpNextVersion && c2.appendChild(E(t(`patcher.packMetaGpnOnly`, l3.gpNextVersion))), D(l3.warnings), l3.containsScripts && c2.appendChild(E(t(`installation.trusted`))), o2) {
      let e3 = document.createElement(`div`);
      c2.appendChild(e3), v2 = o2(e3, l3.namespace);
    }
    if (s2) {
      let e3 = document.createElement(`div`);
      c2.appendChild(e3), s2(e3, l3.namespace);
    }
    for (let [e3, n2] of [[`modDetail.files`, l3.files]]) {
      if (!n2.length) continue;
      let r2 = document.createElement(`details`), i4 = document.createElement(`summary`), a2 = document.createElement(`ul`);
      i4.textContent = t(e3), r2.append(i4, a2);
      for (let e4 of n2) {
        let t2 = document.createElement(`li`);
        t2.textContent = e4, a2.appendChild(t2);
      }
      c2.appendChild(r2);
    }
    if (l3.canUninstall && e2.prepareUninstall) if (y2) {
      let e3 = document.createElement(`div`);
      e3.className = `gp-inline-confirm`, e3.setAttribute(`role`, `group`), e3.setAttribute(`aria-label`, t(`uninstall.action`)), e3.appendChild(E(t(`uninstall.confirm`, l3.name)));
      let n2 = r(t(`uninstall.action`), async () => {
        if (!d2) {
          d2 = true, m2 = null, F();
          try {
            await y2.commit(), y2 = null, b = null, T();
          } catch (e4) {
            m2 = e4, y2 = null;
          } finally {
            d2 = false, F();
          }
        }
      }, { variant: `danger` }), i4 = r(t(`migration.cancel`), () => {
        y2 = null, F();
      });
      n2.disabled = i4.disabled = d2, e3.appendChild(a(i4, n2)), c2.appendChild(e3);
    } else {
      let n2 = r(t(`uninstall.action`), async () => {
        if (!d2) {
          if (w()) {
            m2 = Error(t(`installation.unsaved`)), F();
            return;
          }
          d2 = true, m2 = null, F();
          try {
            y2 = await e2.prepareUninstall(l3.id);
          } catch (e3) {
            m2 = e3;
          } finally {
            d2 = false, F();
          }
        }
      }, { variant: `danger` });
      n2.disabled = d2, c2.appendChild(a(n2));
    }
  }
  function F() {
    v2?.(), v2 = null;
    let o3 = c2.contains(document.activeElement) && document.activeElement.dataset.modFocus;
    if (c2.replaceChildren(), c2.classList.add(`gp-configured-mods`), b) {
      P(), o3 === `detail:back` && c2.querySelector(`button`)?.focus({ preventScroll: true });
      return;
    }
    let s3 = d2 || f2 || g2 || !!h2 || !!p2, y3 = e2.getState(), x2 = ({ revision: e3, ...t2 }) => t2, S2 = JSON.stringify(x2(y3.active.configuration)) !== JSON.stringify(x2(y3.desired));
    _2 === `next-level` && c2.appendChild(E(t(`application.nextLevel`)));
    let C2 = y3.active.configuration.mods.filter((e3) => !y3.desired.mods.some((t2) => t2.id === e3.id));
    if (C2.length && c2.appendChild(E(t(`uninstall.pending`, C2.map((e3) => e3.fallbackName || e3.id).join(`, `)))), S2 || h2) {
      if (S2 && c2.appendChild(E(t(`selection.restart`))), h2) c2.appendChild(E(t(`application.leaveGame`))), c2.appendChild(a(r(t(`application.restart`), () => {
        try {
          h2.restart();
        } catch (e3) {
          m2 = Object.assign(e3, { operation: `apply` }), h2 = null, F();
        }
      }), r(t(`migration.cancel`), () => {
        h2 = null, F();
      })));
      else if (e2.prepareRestart) {
        let n2 = r(t(g2 ? `application.checking` : `application.review`), async () => {
          if (!(s3 || w())) {
            g2 = true, m2 = null, F();
            try {
              let t2 = e2.prepareApplication ? await e2.prepareApplication() : await e2.prepareRestart();
              t2.mode === `immediate` ? (await t2.apply(), T(), _2 = t2.effect) : h2 = t2;
            } catch (e3) {
              m2 = Object.assign(e3, { operation: `apply` }), e3.restartRequired && (h2 = { restart: () => globalThis.location.reload() });
            } finally {
              g2 = false, F();
            }
          }
        }), i3 = r(t(`application.discard`), async () => {
          if (!(s3 || w())) {
            d2 = true, m2 = null, F();
            try {
              await e2.discardPending(y3.desired.revision), T();
            } catch (e3) {
              m2 = e3;
            } finally {
              d2 = false, F();
            }
          }
        });
        n2.disabled = i3.disabled = s3 || w();
        let o4 = [n2, i3];
        if (e2.prepareApplication) {
          let n3 = r(t(`application.restart`), async () => {
            if (!(s3 || w())) {
              g2 = true, m2 = null, F();
              try {
                h2 = await e2.prepareRestart();
              } catch (e3) {
                m2 = Object.assign(e3, { operation: `apply` });
              } finally {
                g2 = false, F();
              }
            }
          });
          n3.disabled = s3 || w(), o4.push(n3);
        }
        c2.appendChild(a(...o4));
      }
    }
    if (m2 && (c2.appendChild(E(t(m2.operation === `import` ? `installation.failed` : m2.operation === `apply` ? `application.failed` : `selection.failed`))), N(m2)), i2) {
      let e3 = (e4) => {
        let n2 = r(t(e4 ? `installation.folder` : `installation.zip`), async () => {
          if (!(d2 || f2 || p2)) {
            if (w()) {
              m2 = Error(t(`installation.unsaved`)), F();
              return;
            }
            f2 = true, m2 = null, F();
            try {
              let t2 = await i2.pick({ directory: e4 });
              t2 && (p2 = await i2.prepare(t2), k(e4 ? `import:folder` : `import:zip`));
            } catch (e5) {
              m2 = Object.assign(e5, { operation: `import` });
            } finally {
              f2 = false, F(), p2 && c2.querySelector(`button:not(:disabled)`)?.focus({ preventScroll: true });
            }
          }
        });
        return n2.disabled = s3, n2.dataset.modFocus = e4 ? `import:folder` : `import:zip`, n2;
      };
      if (p2 || c2.appendChild(a(e3(false), e3(true))), f2 && c2.appendChild(E(t(p2 ? `migration.committing` : `installation.working`))), p2) {
        let e4 = p2.preview;
        if (c2.appendChild(E(e4.name + ` \xB7 ` + e4.version)), e4.update && c2.appendChild(E(t(`installation.previous`, e4.previousVersion))), e4.containsScripts) {
          let n3 = E(t(e4.requiresTrust ? `installation.trustUpdate` : `installation.trusted`));
          n3.className = `gp-risk-notice`, c2.append(n3);
        }
        M(e4.requirements), D(e4.warnings), !e4.enabled && !e4.unchanged && c2.appendChild(E(t(`installation.disabled`))), e4.unchanged && c2.appendChild(E(t(`installation.unchanged`)));
        let n2 = r(t(e4.requiresTrust ? `installation.trustAndUpdate` : e4.update ? `installation.update` : `installation.install`), async () => {
          if (f2) return;
          let e5 = p2;
          f2 = true, F();
          try {
            await e5.commit({ trustedContentDigest: e5.preview.contentDigest }), T(), p2 = null;
          } catch (e6) {
            m2 = Object.assign(e6, { operation: `import` }), p2 = null;
          } finally {
            f2 = false, F();
          }
        }), i3 = r(t(`migration.cancel`), A);
        n2.disabled = f2 || e4.unchanged, i3.disabled = f2, c2.appendChild(a(n2, i3));
        return;
      }
    }
    if (l2.some((e3) => e3.suspendedByJsModding)) {
      let n2 = document.createElement(`div`);
      n2.className = `gp-mod-notice`, n2.append(E(t(`requirements.jsSuspended`))), e2.openRequirementSettings && n2.append(r(t(`requirements.open.experimental`), () => e2.openRequirementSettings(`experimental`), { small: true })), c2.append(n2);
    }
    const packGroups = /* @__PURE__ */ new Map();
    for (const enabled of [true, false]) if (l2.some((pack) => Boolean(pack.enabled || pack.suspendedByJsModding) === enabled)) {
      const section = packSection(t(enabled ? "patcher.packs" : "patcher.disabledPacks"), []);
      c2.append(section);
      packGroups.set(enabled, section._body);
    }
    if (l2.length || c2.appendChild(E(t(`selection.empty`))), l2.forEach((i3, o4) => {
      let u3 = document.createElement(`div`);
      u3.className = `gp-pack-card gp-mod-selection-row`;
      const artwork = document.createElement("div");
      artwork.className = "gp-pack-thumb gp-pack-thumb-fallback";
      artwork.textContent = "PK";
      u3.classList.toggle("gp-pack-disabled", !i3.enabled);
      let d3 = document.createElement(`div`), p3 = i3.fallbackName || i3.runtimeNamespace || i3.id, h3 = r(p3, async () => {
        k(i3.id + `:details`);
        let t2 = { loading: true };
        b = t2, F(), c2.querySelector(`button`)?.focus({ preventScroll: true });
        try {
          t2.value = await e2.describe(i3.id);
        } catch (e3) {
          t2.error = e3;
        }
        t2.loading = false, b === t2 && F();
      });
      h3.classList.add(`gp-mod-name`), h3.disabled = s3, h3.dataset.modFocus = i3.id + `:details`;
      let g3 = document.createElement(`div`);
      if (g3.className = `gp-mod-info gp-pack-info`, g3.append(h3), i3.suspendedByJsModding) {
        let e3 = document.createElement(`span`);
        e3.className = `gp-mod-status`, e3.textContent = t(`requirements.paused`), g3.append(e3);
      }
      const toggle = r(t(i3.enabled ? "patcher.disablePack" : "patcher.enablePack"), () => {
        i3.enabled = !i3.enabled;
        m2 = null;
        F();
      }, { small: true, variant: i3.enabled ? "danger" : "success" });
      toggle.disabled = s3 || i3.suspendedByJsModding === true;
      toggle.dataset.modFocus = i3.id + `:toggle`;
      d3.append(toggle);
      u3.append(artwork, g3);
      loadCard(i3, artwork, g3);
      let _3 = (e3, a2, c3) => {
        let u4 = r(``, () => {
          let t2 = o4 + e3;
          [l2[o4], l2[t2]] = [l2[t2], l2[o4]], m2 = null, F();
        });
        return u4.appendChild(n(a2)), u4.title = t(c3), u4.setAttribute(`aria-label`, t(c3)), u4.dataset.modFocus = i3.id + `:` + e3, u4.disabled = s3 || o4 + e3 < 0 || o4 + e3 >= l2.length, u4;
      };
      const controls = a(_3(-1, `m6 14 6-6 6 6`, `selection.up`), _3(1, `m6 10 6 6 6-6`, `selection.down`));
      controls.classList.add("gp-pack-ctrl");
      controls.append(d3);
      u3.append(controls);
      packGroups.get(Boolean(i3.enabled || i3.suspendedByJsModding)).append(u3);
    }), w() || d2) {
      let n2 = r(t(d2 ? `migration.committing` : `migration.confirm`), async () => {
        if (!d2) {
          d2 = true, m2 = null, F();
          try {
            await e2.save(l2.map(({ id: e3, enabled: t2 }) => ({ id: e3, enabled: t2 })), u2.desired.revision), T();
          } catch (e3) {
            m2 = e3;
          } finally {
            d2 = false, F();
          }
        }
      }), i3 = r(t(`selection.discard`), () => {
        T(), F();
      });
      n2.disabled = i3.disabled = s3, c2.appendChild(a(n2, i3));
    }
    o3 && [...c2.querySelectorAll(`[data-mod-focus]`)].find((e3) => e3.dataset.modFocus === o3)?.focus({ preventScroll: true });
  }
  return { onDeactivate() {
    v2?.(), v2 = null, d2 || (y2 = null);
  }, onBack: A, render(e3) {
    c2 = e3, !w() && !d2 && !f2 && !p2 && T(), F();
  } };
}
function createModManager(g2 = { getRegisteredModSettings: s }, y2 = null, b = null, x = null) {
  let S = /* @__PURE__ */ new Map(), C = null, w = y2 && _({ ...y2, hasUnsavedChanges: hasPendingPackChanges }), T = b && v(b, x, (e2, t2) => renderModSettings(e2, { registry: g2, namespace: t2, pending: true, draftsByNamespace: S }), renderRuntimeControls), E = l({ root: { retain: !T, onDeactivate() {
    T?.onDeactivate();
  }, renderHeader(s2, l2) {
    let d2 = r(t(`mods.browseNest`), async () => {
      try {
        await c(`https://nest.pvzge.com/`);
      } catch (e2) {
        o(`${t(`common.failed`)}: ${String(e2)}`, `error`);
      }
    }, { small: true });
    d2.appendChild(n(`M14 4h6v6M20 4 10 14M10 4H4v16h16v-6`));
    let f2 = [d2], p2 = T && createOpenFolderButton();
    p2 && f2.unshift(p2), isJsModdingRuntimeEnabled() && f2.unshift(i(t(`sections.modRuntime`), () => l2(`runtime`))), !T && g2.getRegisteredModSettings().length && f2.unshift(i(t(`settings.modSettings`), () => l2(`settings`))), f2.length && s2.appendChild(a(...f2));
  }, render(e2) {
    if (T) {
      T.render(e2);
      return;
    }
    if (!w) {
      f(e2);
      return;
    }
    let t2 = document.createElement(`div`), n2 = document.createElement(`div`);
    t2.className = `gp-migration-panel`, e2.append(t2, n2), f(n2), w.render(t2, n2);
  } }, runtime: { labelKey: `sections.modRuntime`, render: p }, settings: { labelKey: `settings.modSettings`, render(e2) {
    C?.(), C = renderModSettings(e2, { draftsByNamespace: S });
  }, onDeactivate() {
    C?.(), C = null;
  } } });
  return { ...E, onBack() {
    return E.onBack() || T?.onBack() || false;
  } };
}
export {
  createModManager
};
