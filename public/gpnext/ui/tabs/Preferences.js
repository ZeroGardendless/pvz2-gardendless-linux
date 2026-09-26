import { a as e, n as t } from "../Translations.js";
import { n } from "../Toast.js";
import { a as r, l as i, n as a, o, t as s } from "../Components.js";
import { F } from "../../mods/FileLoader.js";
import { t as l } from "../../core/ClientEdition.js";
import { n as u } from "../../platform/Opener.js";
import { t as d } from "./Pages.js";
import { renderGeneralSettings } from "./Settings.js";
function p() {
  let i2 = a(e(`guide.docs`), async () => {
    try {
      await u(t(`guide/mod`));
    } catch (e2) {
      n(String(e2), `error`);
    }
  }, { className: `gp-navigation-row` });
  return i2.appendChild(r(`M14 4h6v6M20 4 10 14M10 4H4v16h16v-6`)), i2;
}
var m = `0.14.0`;
function h(t2) {
  let n2 = [], r2 = document.createElement(`div`);
  r2.className = `gp-list-item`;
  let a2 = document.createElement(`span`);
  a2.textContent = e(`about.patcherVersion`), r2.appendChild(a2), r2.appendChild(s(`v` + F, `info`)), n2.push(r2);
  let o2 = document.createElement(`div`);
  o2.className = `gp-list-item`;
  let u2 = document.createElement(`span`);
  u2.textContent = e(`about.gameVersion`), o2.appendChild(u2), o2.appendChild(s(m, `info`)), n2.push(o2);
  let d2 = document.createElement(`div`);
  d2.className = `gp-list-item`;
  let f2 = document.createElement(`span`);
  f2.textContent = e(`about.clientEdition`), d2.appendChild(f2), d2.appendChild(s(e(`about.clientEdition.${l}`), `info`)), n2.push(d2);
  let p2 = document.createElement(`div`);
  p2.className = `gp-list-item`;
  let h2 = document.createElement(`span`);
  h2.textContent = e(`about.createdBy`), p2.appendChild(h2);
  let g2 = document.createElement(`span`);
  g2.textContent = `LingMo`, g2.style.cssText = `color:inherit;`, p2.appendChild(g2), n2.push(p2);
  let _ = i(e(`about.title`), n2);
  t2.appendChild(_);
}
function createPreferencesTab() {
  return d({ root: { render(t2, n2) {
    renderGeneralSettings(t2), t2.appendChild(p()), t2.appendChild(o(e(`tab.about`), () => n2(`about`)));
  } }, about: { labelKey: `tab.about`, render: h } });
}
export {
  createPreferencesTab
};
