import { isJsModdingRuntimeEnabled, setJsModdingRuntimeEnabledFromConsole, setSettings, getSettings, getExperimentalSettings } from "../../core/SettingsStore.js";
import { a } from "../Translations.js";
import { f, i, l } from "../Components.js";
import { n } from "../Toast.js";
function render(container) {
  const experimental = getSettings().experimental || getExperimentalSettings();
  container.appendChild(i(a("experimental.reloadHint")));
  const jsEnabled = isJsModdingRuntimeEnabled();
  const jsToggle = f(a("experimental.jsModding"), jsEnabled, async (enabled) => {
    const modApi = window.gpNext?.mods;
    if (enabled) {
      if (typeof modApi?.enableJsModding !== "function") {
        jsToggle._setValue(false);
        n(a("experimental.jsModdingUnavailable"), "error");
        return;
      }
      try {
        await modApi.enableJsModding();
        jsToggle._setValue(true);
      } catch (error) {
        setJsModdingRuntimeEnabledFromConsole(false);
        jsToggle._setValue(false);
        n(error?.message || String(error), "error");
      }
      return;
    }
    try {
      if (typeof modApi?.disableJsModding === "function") await modApi.disableJsModding();
      setJsModdingRuntimeEnabledFromConsole(false);
      container.replaceChildren();
      render(container);
    } catch (error) {
      jsToggle._setValue(true);
      n(error?.message || String(error), "error");
    }
  });
  container.appendChild(l(a("experimental.jsModding"), [
    jsToggle,
    i(a("experimental.jsModdingDesc"))
  ]));
  const worldMapToggle = f(a("experimental.worldMapJson"), experimental.worldMapJson === true, (enabled) => {
    setSettings({ experimental: { worldMapJson: enabled === true } });
  });
  container.appendChild(l(a("experimental.worldMapJson"), [
    worldMapToggle,
    i(a("experimental.worldMapJsonDesc"))
  ]));
  const plantLevelToggle = f(a("experimental.plantLevelSystem"), experimental.plantLevelSystem === true, (enabled) => {
    setSettings({ experimental: { plantLevelSystem: enabled === true } });
  });
  container.appendChild(l(a("experimental.plantLevelSystem"), [
    plantLevelToggle,
    i(a("experimental.plantLevelSystemDesc"))
  ]));
}
export {
  render
};
