import { o as e } from "../Translations.js";
import { l, n, o as r, r as i } from "../Components.js";
import { getTroubleshootingReport, renderTroubleshooting } from "../../mods/ModTroubleshooting.js";
import { t } from "./Pages.js";
import { bindDiagnostics, onActivate, onDeactivate, render } from "./Log.js";
function createDiagnosticsTab() {
  return bindDiagnostics(getTroubleshootingReport), t({ root: { render(a2, s2) {
    let c2 = i(n(e(`diagnostics.restart`), () => window.location.reload()));
    a2.appendChild(c2), a2.appendChild(r(e(`tab.log`), () => s2(`log`)));
    let l2 = document.createElement(`div`);
    renderTroubleshooting(l2), a2.appendChild(l(e(`diagnostics.title`), [l2]));
  } }, log: { labelKey: `tab.log`, render, onActivate, onDeactivate } });
}
export {
  createDiagnosticsTab
};
