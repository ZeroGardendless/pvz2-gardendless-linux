import { isJsModdingRuntimeEnabled } from "../../core/SettingsStore.js";
import { a as t } from "../Translations.js";
import { f as n, i as r, l as i, n as a, s as o, t as s, u as c } from "../Components.js";
import { t as l } from "../../mods/ModControlsRegistry.js";
var u = null;
function bindMods(e2) {
  u = e2;
}
function f(e2, t2, n2) {
  let r2 = document.createElement(`div`);
  r2.className = `gp-input-wrap`;
  let i2 = document.createElement(`span`);
  i2.className = `gp-input-label`, i2.textContent = e2;
  let a2 = document.createElement(`input`);
  return a2.type = `text`, a2.className = `gp-input`, a2.value = t2 == null ? `` : String(t2), a2.addEventListener(`change`, () => n2(a2.value)), r2.appendChild(i2), r2.appendChild(a2), r2;
}
function p(e2, r2) {
  if (!e2?.type) return null;
  let i2 = e2.label || e2.key || t(`mods.action`);
  if (!(typeof e2.visible == `function` ? e2.visible() : e2.visible !== false)) return null;
  let s2 = typeof e2.disabled == `function` ? e2.disabled() : e2.disabled === true, l2 = e2.type === `action` ? void 0 : typeof e2.getValue == `function` ? e2.getValue() : e2.value, u2;
  switch (e2.type) {
    case `action`:
      u2 = a(i2, () => r2(e2), { variant: e2.variant || `default` });
      break;
    case `toggle`:
      u2 = n(i2, l2 === true, (t2) => r2(e2, t2));
      break;
    case `select`:
      u2 = c(i2, Array.isArray(e2.options) ? e2.options : [], String(l2 ?? ``), (t2) => r2(e2, t2));
      break;
    case `number`:
      u2 = o(i2, Number(l2 ?? 0), (t2) => r2(e2, t2), { min: Number.isFinite(Number(e2.min)) ? Number(e2.min) : void 0, max: Number.isFinite(Number(e2.max)) ? Number(e2.max) : void 0, step: Number.isFinite(Number(e2.step)) ? Number(e2.step) : void 0 });
      break;
    case `text`:
      u2 = f(i2, l2 ?? ``, (t2) => r2(e2, t2));
      break;
    case `readonly`:
      return u2 = document.createElement(`p`), u2.textContent = `${i2}: ${l2 ?? ``}`, u2;
    default:
      return null;
  }
  let d2 = u2.matches(`button`) ? u2 : u2.querySelector(`input, select, button`);
  return d2 && (d2.disabled = s2, d2.setAttribute(`aria-label`, i2)), e2.description && (u2.title = e2.description), u2;
}
function m(e2) {
  let n2 = (u?.getStatus() || []).map((e3) => {
    let n3 = document.createElement(`div`);
    n3.className = `gp-list-item`;
    let r2 = document.createElement(`div`);
    r2.style.cssText = `display:flex;flex-direction:column;gap:2px;min-width:0;`;
    let i2 = document.createElement(`span`);
    if (i2.className = `gp-text-mono`, i2.textContent = e3.name, r2.appendChild(i2), e3.entry) {
      let t2 = document.createElement(`span`);
      t2.className = `gp-text-muted`, t2.textContent = e3.entry, r2.appendChild(t2);
    }
    if (e3.warnings?.length > 0) {
      let t2 = document.createElement(`span`);
      t2.className = `gp-text-muted`, t2.style.color = `#ffb04d`, t2.textContent = e3.warnings[0], r2.appendChild(t2);
    }
    if (e3.errors?.length > 0) {
      let t2 = document.createElement(`span`);
      t2.className = `gp-text-muted`, t2.style.color = `#ff7d7d`, t2.textContent = e3.errors[0], r2.appendChild(t2);
    }
    n3.appendChild(r2);
    let a2 = document.createElement(`div`);
    a2.style.cssText = `display:flex;gap:4px;flex-wrap:wrap;justify-content:flex-end;`;
    let o2 = e3.state === `active` ? `success` : e3.state === `degraded` ? `warning` : e3.state === `failed` ? `error` : `info`;
    return a2.appendChild(s(t(`mods.state.${e3.state}`), o2)), a2.appendChild(s(`API v${e3.apiVersion || `?`}`, `info`)), e3.hasSettings && a2.appendChild(s(t(`mods.badge.settings`), `info`)), e3.hasControls && a2.appendChild(s(t(`mods.badge.controls`), `warning`)), e3.conflicts > 0 && a2.appendChild(s(t(`mods.badge.conflicts`, e3.conflicts), `error`)), e3.pendingTasks > 0 && a2.appendChild(s(`\u23F3 ${e3.pendingTasks}`, `warning`)), n3.appendChild(a2), n3;
  });
  n2.length === 0 && n2.push(r(t(`mods.empty`))), e2.appendChild(i(t(`mods.status`), n2));
}
function renderRuntimeControls(n2, r2 = null, { loader: a2 = u, registry: o2 = l } = {}) {
  if (isJsModdingRuntimeEnabled()) for (let s2 of o2.getRegisteredModControls()) {
    let _ = function(n3) {
      if (f2.replaceChildren(), h2()) {
        for (let [n4, r3] of (c2.groups || []).entries()) {
          let i2 = document.createElement(`div`);
          for (let [a3, o3] of (r3.items || []).entries()) {
            let r4 = `${n4}:${a3}`, s3 = p(o3, async (n5, i3) => {
              if (m2) return;
              m2 = true, f2.inert = true, d2.hidden = true;
              let a4;
              try {
                if (!h2() || !isJsModdingRuntimeEnabled()) throw Error(t(`mods.operationStale`));
                let r5 = typeof n5.disabled == `function` ? n5.disabled() : n5.disabled === true, a5 = typeof n5.visible == `function` ? n5.visible() : n5.visible !== false;
                if (r5 || !a5) throw Error(t(`mods.operationUnavailable`));
                n5.type === `action` ? await n5.onClick?.() : await n5.setValue?.(i3);
              } catch (e2) {
                a4 = e2;
              }
              f2.inert = false;
              try {
                _(r4);
              } catch (e2) {
                f2.replaceChildren(), a4 ||= e2;
              }
              a4 && g2(a4), m2 = false;
            });
            if (!s3) continue;
            let c3 = s3.matches(`button`) ? s3 : s3.querySelector(`input, select, button`);
            c3 && (c3.dataset.modControl = r4), i2.appendChild(s3);
          }
          if (i2.childElementCount) {
            if (c2.groups.length > 1 && r3.title) {
              let e2 = document.createElement(`h4`);
              e2.textContent = r3.title, f2.appendChild(e2);
            }
            f2.appendChild(i2);
          }
        }
        n3 && u2.isConnected && [...f2.querySelectorAll(`[data-mod-control]`)].find((e2) => e2.dataset.modControl === n3)?.focus({ preventScroll: true });
      }
    };
    if (r2 && s2.namespace !== r2) continue;
    let c2 = o2.getModControlDefinition(s2.namespace), l2 = a2?.getStatus().find((e2) => e2.namespace === s2.namespace);
    if (!l2 || ![`active`, `degraded`].includes(l2.state)) continue;
    let u2 = document.createElement(`div`), d2 = document.createElement(`p`), f2 = document.createElement(`div`);
    d2.setAttribute(`role`, `status`), d2.hidden = true, u2.append(d2, f2);
    let m2 = false, h2 = () => {
      let t2 = a2?.getStatus().find((e2) => e2.namespace === s2.namespace);
      return isJsModdingRuntimeEnabled() && o2.getModControlDefinition(s2.namespace) === c2 && t2?.generation === l2.generation && [`active`, `degraded`].includes(t2?.state);
    }, g2 = (e2) => {
      d2.textContent = t(`mods.operationFailed`) + ` ` + (e2.message || String(e2)), d2.hidden = false;
    };
    try {
      _();
    } catch (e2) {
      g2(e2);
    }
    if (!f2.childElementCount && d2.hidden) continue;
    let v = r2 ? t(`mods.currentControls`, l2.version) : c2.title || c2.namespace;
    n2.appendChild(i(v, [u2]));
  }
}
function render(n2) {
  if (!isJsModdingRuntimeEnabled()) {
    n2.appendChild(i(t(`mods.status`), [r(t(`experimental.jsModdingDesc`))]));
    return;
  }
  m(n2), renderRuntimeControls(n2);
}
export {
  bindMods,
  render,
  renderRuntimeControls
};
