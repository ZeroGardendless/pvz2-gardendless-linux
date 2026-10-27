import { renderUuidGenerator } from "../tools/UuidGenerator.js";
import { renderPreferenceTransfer } from "../tools/PreferenceTransfer.js";
import { renderTroubleshooting } from "../tools/Troubleshooting.js";
import { o } from "../Translations.js";
import { l } from "../Components.js";
import { renderHpSettings, t } from "./Settings.js";
function createToolsTab() {
  return { render(i2) {
    let a = document.createElement(`div`);
    renderHpSettings(a), i2.appendChild(l(o(`settings.hpOverlay`), [a])), t(i2);
    renderUuidGenerator(i2);
    renderPreferenceTransfer(i2);
    renderTroubleshooting(i2);
  } };
}
export {
  createToolsTab
};
