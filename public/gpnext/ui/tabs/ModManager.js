import { isJsModdingRuntimeEnabled } from "../../core/SettingsStore.js";
import { a as t } from "../Translations.js";
import { a as n, n as r, o as i, r as a } from "../Components.js";
import { n as o } from "../../mods/ModSettingsRegistry.js";
import { t as s } from "./Pages.js";
import { render as c, createOpenFolderButton, hasPendingPackChanges } from "./Patcher.js";
import { render as d, renderRuntimeControls } from "./Mods.js";
import { a as p } from "./Settings.js";
function m(e2) {
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
function h({ prepare: e2, storage: n2, hasUnsavedChanges: i2, restart: o2 = () => globalThis.location.reload() }) {
  let s2 = false, c2 = `idle`, l2 = null, u2 = null, d2, f2, p2 = (e3) => {
    let t2 = document.createElement(`p`);
    t2.textContent = e3, d2.appendChild(t2);
  };
  function h2() {
    if (d2) {
      if (d2.replaceChildren(), f2.inert = [`preparing`, `preview`, `committing`, `done`].includes(c2), f2.hidden = c2 === `done`, c2 === `done`) {
        p2(t(s2 ? `application.leaveGame` : `migration.restart`)), d2.appendChild(r(t(`application.restart`), () => {
          s2 ? o2() : (s2 = true, h2());
        })), s2 && d2.appendChild(r(t(`migration.cancel`), () => {
          s2 = false, h2();
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
        for (let e3 of m(l2.preview)) {
          let n3 = e3.nameKey ? t(e3.nameKey) : e3.name;
          p2((n3 ? n3 + `: ` : ``) + e3.labels.map((e4) => t(e4)).join(` \xB7 `));
        }
        d2.appendChild(a(r(t(`migration.confirm`), async () => {
          if (c2 === `preview`) {
            c2 = `committing`, u2 = null, h2();
            try {
              await l2.commit(n2), c2 = `done`;
            } catch (e3) {
              u2 = e3, c2 = `idle`, l2 = null;
            }
            h2();
          }
        }), r(t(`migration.cancel`), () => {
          c2 = `idle`, l2 = null, u2 = null, h2();
        })));
        return;
      }
      d2.appendChild(r(t(`migration.prepare`), async () => {
        if (c2 === `idle`) {
          if (i2()) {
            u2 = `unsaved`, h2();
            return;
          }
          c2 = `preparing`, u2 = null, h2();
          try {
            l2 = await e2(), c2 = `preview`;
          } catch (e3) {
            u2 = e3, c2 = `idle`;
          }
          h2();
        }
      }));
    }
  }
  return { render(e3, t2) {
    d2 = e3, f2 = t2, h2();
  } };
}
function g(e2, i2 = null, o2 = null, s2 = null) {
  let c2, l2, u2, d2 = false, f2 = false, p2 = null, m2 = null, h2 = null, g2 = false, _2 = null, v = null, y = null, b = 0, x = null, S = (e3) => JSON.stringify(e3.map(({ id: e4, enabled: t2 }) => ({ id: e4, enabled: t2 }))), C = () => l2 && S(l2) !== S(u2.desired.mods), w = () => {
    u2 = e2.getState(), l2 = structuredClone(u2.desired.mods), m2 = null;
  }, T = (e3) => {
    let t2 = document.createElement(`p`);
    return t2.textContent = e3, t2;
  }, E = () => c2.closest(`.gp-content`) || c2;
  function D(e3) {
    b = E().scrollTop, x = e3, E().scrollTop = 0;
  }
  function O() {
    return d2 || f2 || g2 || !y && !p2 ? false : (y = null, p2 = null, m2 = null, A(), E().scrollTop = b, [...c2.querySelectorAll(`[data-mod-focus]`)].find((e3) => e3.dataset.modFocus === x)?.focus({ preventScroll: true }), true);
  }
  function k() {
    let e3 = r(t(`sections.back`), O);
    if (e3.dataset.modFocus = `detail:back`, e3.prepend(n(`m14 6-6 6 6 6`)), c2.appendChild(a(e3)), y.loading) {
      c2.appendChild(T(t(`modDetail.loading`)));
      return;
    }
    if (y.error) {
      c2.appendChild(T(t(`modDetail.failed`)), T(y.error.message || String(y.error)));
      return;
    }
    let i3 = y.value, l3 = document.createElement(`h3`);
    if (l3.textContent = i3.name, c2.appendChild(l3), c2.appendChild(T(i3.version + (i3.author ? ` \xB7 ` + i3.author : ``))), i3.pending && (i3.activeVersion && c2.appendChild(T(t(`modDetail.activeVersion`, i3.activeVersion))), c2.appendChild(T(t(`selection.restart`)))), i3.description && c2.appendChild(T(i3.description)), i3.containsScripts && c2.appendChild(T(t(`installation.trusted`))), o2) {
      let e4 = document.createElement(`div`);
      c2.appendChild(e4), v = o2(e4, i3.namespace);
    }
    if (s2) {
      let e4 = document.createElement(`div`);
      c2.appendChild(e4), s2(e4, i3.namespace);
    }
    for (let [e4, n2] of [[`modDetail.depends`, i3.depends], [`modDetail.optional`, i3.optionalDepends], [`modDetail.files`, i3.files]]) {
      if (!n2.length) continue;
      let r2 = document.createElement(`details`), i4 = document.createElement(`summary`), a2 = document.createElement(`ul`);
      i4.textContent = t(e4), r2.append(i4, a2);
      for (let e5 of n2) {
        let t2 = document.createElement(`li`);
        t2.textContent = e5, a2.appendChild(t2);
      }
      c2.appendChild(r2);
    }
  }
  function A() {
    v?.(), v = null;
    let o3 = c2.contains(document.activeElement) && document.activeElement.dataset.modFocus;
    if (c2.replaceChildren(), c2.classList.add(`gp-configured-mods`), y) {
      k(), o3 === `detail:back` && c2.querySelector(`button`)?.focus({ preventScroll: true });
      return;
    }
    let s3 = d2 || f2 || g2 || !!h2 || !!p2, b2 = e2.getState(), x2 = ({ revision: e3, ...t2 }) => t2, S2 = JSON.stringify(x2(b2.active.configuration)) !== JSON.stringify(x2(b2.desired));
    if (_2 === `next-level` && c2.appendChild(T(t(`application.nextLevel`))), S2 || h2) {
      if (S2 && c2.appendChild(T(t(`selection.restart`))), h2) c2.appendChild(T(t(`application.leaveGame`))), c2.appendChild(a(r(t(`application.restart`), () => {
        try {
          h2.restart();
        } catch (e3) {
          m2 = Object.assign(e3, { operation: `apply` }), h2 = null, A();
        }
      }), r(t(`migration.cancel`), () => {
        h2 = null, A();
      })));
      else if (e2.prepareRestart) {
        let n2 = r(t(g2 ? `application.checking` : `application.review`), async () => {
          if (!(s3 || C())) {
            g2 = true, m2 = null, A();
            try {
              let t2 = e2.prepareApplication ? await e2.prepareApplication() : await e2.prepareRestart();
              t2.mode === `immediate` ? (await t2.apply(), w(), _2 = t2.effect) : h2 = t2;
            } catch (e3) {
              m2 = Object.assign(e3, { operation: `apply` }), e3.restartRequired && (h2 = { restart: () => globalThis.location.reload() });
            } finally {
              g2 = false, A();
            }
          }
        }), i3 = r(t(`application.discard`), async () => {
          if (!(s3 || C())) {
            d2 = true, m2 = null, A();
            try {
              await e2.discardPending(b2.desired.revision), w();
            } catch (e3) {
              m2 = e3;
            } finally {
              d2 = false, A();
            }
          }
        });
        n2.disabled = i3.disabled = s3 || C();
        let o4 = [n2, i3];
        if (e2.prepareApplication) {
          let n3 = r(t(`application.restart`), async () => {
            if (!(s3 || C())) {
              g2 = true, m2 = null, A();
              try {
                h2 = await e2.prepareRestart();
              } catch (e3) {
                m2 = Object.assign(e3, { operation: `apply` });
              } finally {
                g2 = false, A();
              }
            }
          });
          n3.disabled = s3 || C(), o4.push(n3);
        }
        c2.appendChild(a(...o4));
      }
    }
    if (m2) {
      let e3 = document.createElement(`details`), n2 = document.createElement(`summary`);
      c2.appendChild(T(t(m2.operation === `import` ? `installation.failed` : m2.operation === `apply` ? `application.failed` : `selection.failed`))), n2.textContent = t(`migration.reason`), e3.append(n2, T(m2.message || String(m2))), c2.appendChild(e3);
    }
    if (i2) {
      let e3 = (e4) => {
        let n2 = r(t(e4 ? `installation.folder` : `installation.zip`), async () => {
          if (!(d2 || f2 || p2)) {
            if (C()) {
              m2 = Error(t(`installation.unsaved`)), A();
              return;
            }
            f2 = true, m2 = null, A();
            try {
              let t2 = await i2.pick({ directory: e4 });
              t2 && (p2 = await i2.prepare(t2), D(e4 ? `import:folder` : `import:zip`));
            } catch (e5) {
              m2 = Object.assign(e5, { operation: `import` });
            } finally {
              f2 = false, A(), p2 && c2.querySelector(`button:not(:disabled)`)?.focus({ preventScroll: true });
            }
          }
        });
        return n2.disabled = s3, n2.dataset.modFocus = e4 ? `import:folder` : `import:zip`, n2;
      };
      if (p2 || c2.appendChild(a(e3(false), e3(true))), f2 && c2.appendChild(T(t(p2 ? `migration.committing` : `installation.working`))), p2) {
        let e4 = p2.preview;
        c2.appendChild(T(e4.name + ` \xB7 ` + e4.version)), e4.update && c2.appendChild(T(t(`installation.previous`, e4.previousVersion))), e4.containsScripts && c2.appendChild(T(t(`installation.trusted`))), !e4.enabled && !e4.unchanged && c2.appendChild(T(t(`installation.disabled`))), e4.unchanged && c2.appendChild(T(t(`installation.unchanged`)));
        let n2 = r(t(e4.update ? `installation.update` : `installation.install`), async () => {
          if (f2) return;
          let e5 = p2;
          f2 = true, A();
          try {
            await e5.commit(), w(), p2 = null;
          } catch (e6) {
            m2 = Object.assign(e6, { operation: `import` }), p2 = null;
          } finally {
            f2 = false, A();
          }
        }), i3 = r(t(`migration.cancel`), O);
        n2.disabled = f2 || e4.unchanged, i3.disabled = f2, c2.appendChild(a(n2, i3));
        return;
      }
    }
    if (l2.length || c2.appendChild(T(t(`selection.empty`))), l2.forEach((i3, o4) => {
      let u3 = document.createElement(`div`);
      u3.className = `gp-mod-selection-row`;
      let d3 = document.createElement(`label`), f3 = document.createElement(`input`), p3 = i3.fallbackName || i3.runtimeNamespace || i3.id, h3 = r(p3, async () => {
        D(i3.id + `:details`);
        let t2 = { loading: true };
        y = t2, A(), c2.querySelector(`button`)?.focus({ preventScroll: true });
        try {
          t2.value = await e2.describe(i3.id);
        } catch (e3) {
          t2.error = e3;
        }
        t2.loading = false, y === t2 && A();
      });
      h3.classList.add(`gp-mod-name`), h3.disabled = s3, h3.dataset.modFocus = i3.id + `:details`, f3.type = `checkbox`, f3.checked = i3.enabled, f3.disabled = s3, f3.dataset.modFocus = i3.id + `:toggle`, f3.setAttribute(`aria-label`, t(`modDetail.enable`, p3)), f3.addEventListener(`change`, () => {
        i3.enabled = f3.checked, m2 = null, A();
      }), d3.append(f3), u3.append(d3, h3);
      let g3 = (e3, a2, c3) => {
        let u4 = r(``, () => {
          let t2 = o4 + e3;
          [l2[o4], l2[t2]] = [l2[t2], l2[o4]], m2 = null, A();
        });
        return u4.appendChild(n(a2)), u4.title = t(c3), u4.setAttribute(`aria-label`, t(c3)), u4.dataset.modFocus = i3.id + `:` + e3, u4.disabled = s3 || o4 + e3 < 0 || o4 + e3 >= l2.length, u4;
      };
      u3.appendChild(a(g3(-1, `m6 14 6-6 6 6`, `selection.up`), g3(1, `m6 10 6 6 6-6`, `selection.down`))), c2.appendChild(u3);
    }), C() || d2) {
      let n2 = r(t(d2 ? `migration.committing` : `migration.confirm`), async () => {
        if (!d2) {
          d2 = true, m2 = null, A();
          try {
            await e2.save(l2.map(({ id: e3, enabled: t2 }) => ({ id: e3, enabled: t2 })), u2.desired.revision), w();
          } catch (e3) {
            m2 = e3;
          } finally {
            d2 = false, A();
          }
        }
      }), i3 = r(t(`selection.discard`), () => {
        w(), A();
      });
      n2.disabled = i3.disabled = s3, c2.appendChild(a(n2, i3));
    }
    o3 && [...c2.querySelectorAll(`[data-mod-focus]`)].find((e3) => e3.dataset.modFocus === o3)?.focus({ preventScroll: true });
  }
  return { onDeactivate() {
    v?.(), v = null;
  }, onBack: O, render(e3) {
    c2 = e3, !C() && !d2 && !f2 && !p2 && w(), A();
  } };
}
function createModManager(n2 = { getRegisteredModSettings: o }, r2 = null, m2 = null, _2 = null) {
  let v = /* @__PURE__ */ new Map(), y = null, b = r2 && h({ ...r2, hasUnsavedChanges: hasPendingPackChanges }), x = m2 && g(m2, _2, (e2, t2) => p(e2, { registry: n2, namespace: t2, pending: true, draftsByNamespace: v }), renderRuntimeControls), S = s({ root: { retain: !x, onDeactivate() {
    x?.onDeactivate();
  }, renderHeader(r3, o2) {
    let s2 = [], c2 = x && createOpenFolderButton();
    c2 && s2.unshift(c2), isJsModdingRuntimeEnabled() && s2.unshift(i(t(`sections.modRuntime`), () => o2(`runtime`))), !x && n2.getRegisteredModSettings().length && s2.unshift(i(t(`settings.modSettings`), () => o2(`settings`))), s2.length && r3.appendChild(a(...s2));
  }, render(e2) {
    if (x) {
      x.render(e2);
      return;
    }
    if (!b) {
      c(e2);
      return;
    }
    let t2 = document.createElement(`div`), n3 = document.createElement(`div`);
    t2.className = `gp-migration-panel`, c(n3);
    let r3 = Array.from(n3.children), i3 = r3.findIndex((e3) => e3.classList.contains(`gp-section`) && e3.querySelector(`.gp-section-title`)?.textContent.includes(t(`patcher.packs`))), a3 = i3 < 0 ? r3.length : i3 + 1;
    for (let e3 of r3.slice(0, a3)) e2.appendChild(e3);
    e2.appendChild(t2);
    for (let e3 of r3.slice(a3)) e2.appendChild(e3);
    let o3 = { set inert(e3) {
      for (let t3 of r3) t3.inert = e3;
    }, set hidden(e3) {
      for (let t3 of r3) t3.hidden = e3;
    } };
    b.render(t2, o3);
  } }, runtime: { labelKey: `sections.modRuntime`, render: d }, settings: { labelKey: `settings.modSettings`, render(e2) {
    y?.(), y = p(e2, { draftsByNamespace: v });
  }, onDeactivate() {
    y?.(), y = null;
  } } });
  return { ...S, onBack() {
    return S.onBack() || x?.onBack() || false;
  } };
}
export {
  createModManager
};
