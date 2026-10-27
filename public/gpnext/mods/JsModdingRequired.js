import { s as e } from "../GameBootstrap.js";
import { setJsModdingRuntimeEnabledFromConsole, getSettings } from "../core/SettingsStore.js";
import { o as r } from "../ui/Translations.js";
import { m as i, n, p as o, r as s } from "../ui/Components.js";
function showJsModdingRequired() {
  i(getSettings().theme);
  let c2 = document.createElement(`section`);
  c2.className = `gp-startup-screen`;
  let l = document.createElement(`style`);
  l.textContent = o, document.head.append(l);
  let u = document.createElement(`div`);
  u.className = `gp-startup-card`, c2.append(u), u.setAttribute(`role`, `dialog`), u.setAttribute(`aria-label`, r(`requirements.saveTitle`));
  let d = false, f = (e2, t2) => {
    let n2 = document.createElement(e2);
    return n2.textContent = r(t2), n2;
  }, p = (e2, t2) => n(r(e2), t2);
  function m() {
    if (u.replaceChildren(f(`h2`, `requirements.saveTitle`), f(`p`, `requirements.saveBody`)), d) {
      let e2 = document.createElement(`div`);
      e2.className = `gp-inline-confirm`;
      let n2 = p(`common.cancel`, () => {
        d = false, m(), u.querySelector(`button`)?.focus();
      });
      e2.append(f(`p`, `experimental.jsModdingRisk`), s(n2, p(`experimental.jsModdingEnable`, () => {
        setJsModdingRuntimeEnabledFromConsole(true), location.reload();
      }))), u.append(e2), n2.focus();
    } else u.append(s(p(`experimental.jsModdingEnable`, () => {
      d = true, m();
    })));
    u.append(s(p(`startup.recovery`, () => location.replace(e()))));
  }
  m(), document.body.append(c2), u.querySelector(`button`)?.focus();
}
export {
  showJsModdingRequired
};
