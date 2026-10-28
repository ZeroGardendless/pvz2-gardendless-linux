import { renderSettingsGroup, renderFrameRate } from "./Settings.js";
import { renderAppearance } from "../Appearance.js";
import { renderAudioTuning } from "../../audio/AudioTuning.js";
import { renderWidescreenSettings } from "../../runtime/Widescreen.js";
import { renderRenderingSettings } from "../../runtime/Rendering.js";
import { renderPreferenceTransfer } from "../tools/PreferenceTransfer.js";
import { render as renderExperiments, onDeactivate } from "./Experimental.js";
function createPreferencesTab() {
  return { render(container) {
    const general = document.createElement("div");
    renderSettingsGroup(general, "all");
    const themeSection = general.firstElementChild;
    renderAppearance(container);
    const appearance = container.lastElementChild.querySelector(".gp-section-body");
    if (themeSection) appearance.prepend(...themeSection.querySelector(".gp-section-body").children);
    themeSection?.remove();
    renderFrameRate(container);
    renderWidescreenSettings(container);
    renderRenderingSettings(container);
    container.append(...general.children);
    renderAudioTuning(container);
    renderExperiments(container);
    renderPreferenceTransfer(container);
  }, onDeactivate };
}
function openPreferencesRoot() {
}
export {
  createPreferencesTab,
  openPreferencesRoot
};
