import { createCheatsTab } from "./Cheats.js";
import { createDiagnosticsTab } from "./Diagnostics.js";
import { renderUuidGenerator } from "../tools/UuidGenerator.js";
import { renderPreferenceTransfer } from "../tools/PreferenceTransfer.js";
import { o } from "../Translations.js";
import { l, o as navigationButton, r } from "../Components.js";
import { renderHpSettings, t } from "./Settings.js";
import { t as createPages } from "./Pages.js";
function createToolsTab() {
  const trainer = createCheatsTab(), diagnostics = createDiagnosticsTab();
  return createPages({
    root: {
      render(container, navigate) {
        container.classList.add("gp-tools");
        renderUuidGenerator(container);
        const gameTools = document.createElement("div");
        container.append(gameTools);
        trainer.render(gameTools);
        const health = document.createElement("div");
        renderHpSettings(health);
        container.append(l(o("settings.hpOverlay"), [health]));
        t(container);
        container.append(r(
          navigationButton("Preferences backup", () => navigate("preferences")),
          navigationButton(o("diagnostics.title"), () => navigate("diagnostics"))
        ));
      },
      onActivate: () => trainer.onActivate?.(),
      onDeactivate: () => trainer.onDeactivate?.()
    },
    preferences: { labelKey: "Preferences backup", render: renderPreferenceTransfer },
    diagnostics: {
      labelKey: "diagnostics.title",
      render: (container) => diagnostics.render(container),
      onActivate: () => diagnostics.onActivate?.(),
      onDeactivate: () => diagnostics.onDeactivate?.(),
      onBack: () => diagnostics.onBack?.()
    }
  });
}
export {
  createToolsTab
};
