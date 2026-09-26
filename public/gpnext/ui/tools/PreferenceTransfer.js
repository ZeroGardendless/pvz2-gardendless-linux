import { exportPreferences, parsePreferences, importPreferences } from "../../core/PreferenceTransfer.js";
import { n as button, i } from "../Components.js";
import { n as saveDialog } from "../../platform/Dialog.js";
import { u } from "../../platform/FileSystem.js";
function renderPreferenceTransfer(container) {
  const text = document.createElement("textarea");
  text.className = "gp-input gp-text-mono";
  text.rows = 6;
  text.style.cssText = "width:100%;box-sizing:border-box;resize:vertical;";
  text.placeholder = "Paste exported GPNext preferences here, or choose a JSON file.";
  text.setAttribute("aria-label", "Preferences JSON");
  const status = i("Transfers appearance, language, FPS and input preferences. Saves, mod files and mod-enabling switches are excluded.");
  status.setAttribute("role", "status");
  const actions = document.createElement("div");
  actions.className = "gp-inline-actions";
  const apply = button("Apply & restart", () => {
    try {
      importPreferences(text.value);
      location.reload();
    } catch (error) {
      status.textContent = error.message;
    }
  });
  apply.disabled = true;
  text.addEventListener("input", () => {
    apply.disabled = true;
  });
  const file = document.createElement("input");
  file.type = "file";
  file.accept = ".json,application/json";
  file.setAttribute("aria-label", "Import preferences file");
  file.addEventListener("change", async () => {
    apply.disabled = true;
    try {
      const selected = file.files[0];
      if (!selected) return;
      if (selected.size > 262144) throw new Error("Settings files must be smaller than 256 KiB.");
      text.value = await selected.text();
      status.textContent = "File loaded. Preview it before applying.";
    } catch (error) {
      status.textContent = error.message;
    }
  });
  actions.append(button("Export JSON", async () => {
    try {
      const data = exportPreferences();
      text.value = data;
      apply.disabled = true;
      if (window.__TAURI_INTERNALS__) {
        const path = await saveDialog({ defaultPath: "gpnext-preferences.json", filters: [{ name: "JSON", extensions: ["json"] }] });
        if (path) {
          await u(path, data);
          status.textContent = "Preferences exported.";
        }
      } else {
        status.textContent = "Exported JSON is ready to copy below.";
      }
    } catch (error) {
      status.textContent = error.message;
    }
  }), button("Preview import", () => {
    try {
      const data = parsePreferences(text.value);
      const fields = [...Object.keys(data.settings), ...Object.keys(data.appearance)];
      if (!fields.length) throw new Error("The file contains no supported preferences.");
      status.textContent = `Will update: ${fields.join(", ")}. Applying restarts the current game session.`;
      apply.disabled = false;
    } catch (error) {
      apply.disabled = true;
      status.textContent = error.message;
    }
  }), apply);
  container.append(status, file, text, actions);
}
export {
  renderPreferenceTransfer
};
