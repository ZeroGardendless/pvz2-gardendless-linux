import { d as e } from "../platform/FileSystem.js";
import { c } from "./GameConfiguration.js";
import { n } from "../core/Logger.js";
import { setSettings, getSettings } from "../core/SettingsStore.js";
import { o as a } from "../ui/Translations.js";
import { f as o, n as s, r } from "../ui/Components.js";
import { n as l } from "../ui/Toast.js";
import { n as u } from "../platform/Dialog.js";
import { t as d } from "./ModDiagnosticReport.js";
import { t as f } from "../core/ClientEdition.js";
var p = () => ({ status: { errors: n().filter((e2) => e2.level === `error`).map((e2) => e2.msg) }, diagnostics: {} }), m = () => d({ version: c, clientEdition: f, patchStatus: p().status, redact: getSettings().redactDiagnostics });
function getTroubleshootingReport() {
  return m();
}
function bindTroubleshooting(e2, t2) {
  p = e2, m = t2;
}
function renderTroubleshooting(t2) {
  t2.classList.add(`gp-diagnostics-content`);
  let n2 = document.createElement(`div`);
  n2.className = `gp-diagnostics-list`;
  let d2 = (e2) => String(e2?.message || e2), f2 = () => {
    if (n2.replaceChildren(), !p) {
      n2.textContent = a(`header.status.waiting`);
      return;
    }
    try {
      let { status: e2, diagnostics: t3 } = p(), r2 = [];
      for (let t4 of e2.packs || []) for (let e3 of [...t4.preflightErrors || [], ...t4.errors || []]) r2.push([t4.meta?.name || t4.meta?.uuid || a(`tab.patcher`), d2(e3)]);
      for (let e3 of t3.runtimes || []) for (let t4 of e3.errors || []) r2.push([e3.name || e3.namespace, d2(t4)]);
      for (let t4 of e2.errors || []) r2.push([a(`tab.patcher`), d2(t4)]);
      let i2 = new Map((t3.runtimes || []).map((e3) => [e3.namespace, e3.name || e3.namespace]));
      for (let e3 of t3.conflicts || []) r2.push([a(`diagnostics.sharedHook`), `${e3.key || e3.kind}: ${(e3.owners || []).map((e4) => i2.get(e4) || e4).join(`, `)}`]);
      r2.length || (n2.textContent = a(`diagnostics.clear`));
      for (let [e3, t4] of r2) {
        let r3 = document.createElement(`div`);
        r3.className = `gp-list-item gp-diagnostic-entry`;
        let i3 = document.createElement(`strong`);
        i3.textContent = e3;
        let a2 = document.createElement(`div`);
        a2.textContent = t4, r3.append(i3, a2), n2.append(r3);
      }
    } catch {
      n2.textContent = a(`common.failed`);
    }
  }, h2 = s(a(`log.exportDiagnostics`), async () => {
    h2.disabled = true;
    try {
      if (!m) throw Error(`Diagnostics unavailable`);
      let t3 = JSON.stringify(m(), null, 2), n3 = await u({ defaultPath: `gp-next-diagnostics.json`, filters: [{ name: `JSON`, extensions: [`json`] }] });
      n3 && await e(n3, t3);
    } catch {
      l(a(`common.failed`), `error`);
    } finally {
      h2.disabled = false;
    }
  });
  t2.append(o(a(`diagnostics.redact`), getSettings().redactDiagnostics, (e2) => setSettings({ redactDiagnostics: e2 })), r(s(a(`diagnostics.refresh`), f2), h2), n2), f2();
}
export {
  bindTroubleshooting,
  getTroubleshootingReport,
  renderTroubleshooting
};
