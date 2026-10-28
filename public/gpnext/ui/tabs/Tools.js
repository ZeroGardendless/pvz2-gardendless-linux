import { createCheatsTab } from "./Cheats.js";
import { createDiagnosticsTab } from "./Diagnostics.js";
import { renderUuidGenerator } from "../tools/UuidGenerator.js";
import { renderPreferenceTransfer } from "../tools/PreferenceTransfer.js";
import { renderTroubleshooting } from "../tools/Troubleshooting.js";
import { o } from "../Translations.js";
import { l } from "../Components.js";
import { renderHpSettings, t } from "./Settings.js";
function createToolsTab() {
  const trainer = createCheatsTab(), diagnostics = createDiagnosticsTab();
  return {
    render(i2) {
      trainer.render(i2);
      let a = document.createElement(`div`);
      renderHpSettings(a), i2.appendChild(l(o(`settings.hpOverlay`), [a])), t(i2);
      renderUuidGenerator(i2);
      renderPreferenceTransfer(i2);
      renderTroubleshooting(i2);
      const diagnosticSection = document.createElement("div");
      i2.append(diagnosticSection);
      diagnostics.render(diagnosticSection);
    },
    onActivate() {
      trainer.onActivate?.();
      diagnostics.onActivate?.();
    },
    onDeactivate() {
      trainer.onDeactivate?.();
      diagnostics.onDeactivate?.();
    },
    onBack: () => diagnostics.onBack?.()
  };
}
export {
  createToolsTab
};
