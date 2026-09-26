import { summarizeModProblems } from "../../mods/Troubleshooting.js";
import { l, n, i } from "../Components.js";
import { renderRecoveryControl } from "../../runtime/Recovery.js";
let provider = () => ({ status: {}, diagnostics: {} });
function bindTroubleshooting(next) {
  provider = next;
}
function renderTroubleshooting(container) {
  const list = document.createElement("div");
  const refresh = () => {
    list.replaceChildren();
    try {
      const { status, diagnostics } = provider();
      const issues = summarizeModProblems(status, diagnostics);
      if (!issues.length) list.append(i("No problems reported by the loaded mod runtimes. This does not rule out gameplay bugs."));
      for (const issue of issues.slice(0, 100)) {
        const details = document.createElement("details");
        details.className = "gp-section";
        const title = document.createElement("summary");
        title.textContent = `${issue.kind}: ${issue.name}`;
        const detail = i(issue.detail);
        detail.style.whiteSpace = "pre-wrap";
        details.append(title, detail, i(issue.advice));
        list.append(details);
      }
      if (issues.length > 100) list.append(i("Showing the first 100 problems. Export diagnostics from Logs for the full report."));
    } catch (error) {
      list.append(i(`Could not read diagnostics: ${error.message}`));
    }
  };
  container.append(l("Mod troubleshooting", [n("Refresh diagnostics", refresh), list]));
  renderRecoveryControl(container);
  refresh();
}
export {
  bindTroubleshooting,
  renderTroubleshooting
};
