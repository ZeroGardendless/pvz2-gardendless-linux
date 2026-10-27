import { o as translate, n as docsUrl } from "../Translations.js";
import { a, o as navButton, i } from "../Components.js";
import { n as openUrl } from "../../platform/Opener.js";
import { t } from "./Pages.js";
import { renderSettingsGroup, renderFrameRate } from "./Settings.js";
import { renderAppearance } from "../Appearance.js";
import { renderAudioTuning } from "../../audio/AudioTuning.js";
import { renderWidescreenSettings } from "../../runtime/Widescreen.js";
import { renderRenderingSettings } from "../../runtime/Rendering.js";
import { renderPreferenceTransfer } from "../tools/PreferenceTransfer.js";
import { render } from "./About.js";
const sections = [
  ["appearance", "settings.appearance", "Accent, transparency, spacing and motion", "M12 3a9 9 0 1 0 0 18h2a2 2 0 0 0 0-4h-1a2 2 0 0 1 0-4h2a6 6 0 0 0-3-10Z"],
  ["graphics", "settings.gameplay", "Frame rate, render resolution and widescreen", "M3 4h18v13H3ZM8 21h8m-4-4v4"],
  ["controls", "settings.overlayHotkey", "Overlay, trainer shortcuts and scrolling", "M3 6h18v12H3Zm4 4h1m3 0h1m3 0h1M7 14h10"],
  ["audio", "settings.audio", "Audio engine and fallback preferences", "M4 9h4l5-4v14l-5-4H4Zm12-1a6 6 0 0 1 0 8"],
  ["game", "settings.general", "Translations and runtime extensions", "M4 5h16v14H4Zm4 4h8m-8 4h5"],
  ["backup", "preferences.title", "Import, export and diagnostic preferences", "M4 16v4h16v-4M12 3v12m-4-4 4 4 4-4"]
];
let pages;
function openPreferencesRoot() {
  pages?.onBack();
}
function createPreferencesTab() {
  pages = t({
    root: { render(container, navigate) {
      container.classList.add("gp-preferences-index");
      for (const [id, key, description, path] of sections) {
        const button = navButton(translate(key), () => navigate(id));
        button.classList.add("gp-preference-link");
        const copy = document.createElement("span"), title = document.createElement("strong"), detail = document.createElement("small");
        title.textContent = translate(key);
        detail.textContent = description;
        copy.append(title, detail);
        button.replaceChildren(a(path), copy, a("m9 6 6 6-6 6"));
        container.append(button);
      }
      container.append(navButton(translate("guide.docs"), () => openUrl(docsUrl("guide/mod"))), navButton(translate("tab.about"), () => navigate("about")));
    } },
    appearance: { labelKey: "settings.appearance", render(container) {
      renderSettingsGroup(container, "appearance");
      renderAppearance(container);
    } },
    graphics: { labelKey: "settings.gameplay", render(container) {
      renderRenderingSettings(container);
      renderFrameRate(container);
      renderWidescreenSettings(container);
    } },
    controls: { labelKey: "settings.overlayHotkey", render: (container) => renderSettingsGroup(container, "controls") },
    audio: { labelKey: "settings.audio", render: renderAudioTuning },
    game: { labelKey: "settings.general", render: (container) => renderSettingsGroup(container, "game") },
    backup: { labelKey: "preferences.title", render(container) {
      renderSettingsGroup(container, "backup");
      renderPreferenceTransfer(container);
    } },
    about: { labelKey: "tab.about", render }
  });
  return pages;
}
export {
  createPreferencesTab,
  openPreferencesRoot
};
