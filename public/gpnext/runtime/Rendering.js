import { getSettings, setSettings } from "../core/SettingsStore.js";
import { l, u, f, i } from "../ui/Components.js";
import { RENDER_SCALES, normalizeRenderScale } from "./RenderOptions.js";
let active = null;
function installRendering(cc, host = window) {
  if (active?.cc === cc) return active;
  active?.dispose();
  let queued = false, disposed = false;
  const canvas = cc.game.canvas;
  const apply = () => {
    queued = false;
    if (disposed || !cc.director.root || !canvas) return;
    const size = cc.screen.windowSize, scale = normalizeRenderScale(getSettings().renderScale) / 100;
    const width = Math.max(1, Math.round(size.width * scale)), height = Math.max(1, Math.round(size.height * scale));
    const root = cc.director.root;
    if (root.mainWindow.width !== width || root.mainWindow.height !== height) root.resize(width, height);
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
  };
  const schedule = () => {
    if (!queued && !disposed) {
      queued = true;
      queueMicrotask(apply);
    }
  };
  cc.view.on("canvas-resize", schedule);
  cc.screen.on("window-resize", schedule);
  cc.screen.on("fullscreen-change", schedule);
  host.addEventListener("pageshow", schedule);
  active = { cc, apply, dispose() {
    disposed = true;
    cc.view.off("canvas-resize", schedule);
    cc.screen.off("window-resize", schedule);
    cc.screen.off("fullscreen-change", schedule);
    host.removeEventListener("pageshow", schedule);
  } };
  schedule();
  return active;
}
function renderRenderingSettings(container) {
  const settings = getSettings();
  container.appendChild(l("Rendering", [
    u("Render resolution", RENDER_SCALES.map((value) => ({ value: String(value), label: `${value}%${value === 100 ? " \xB7 Native" : value === 75 ? " \xB7 Balanced" : value === 50 ? " \xB7 Performance" : ""}` })), String(settings.renderScale), (value) => {
      setSettings({ renderScale: normalizeRenderScale(value) });
      active?.apply();
    }),
    i("Lower resolutions reduce GPU pixel work while keeping the interface and input layout at their original size. CPU-heavy animation and simulation may still limit FPS.")
  ]));
}
export {
  RENDER_SCALES,
  installRendering,
  normalizeRenderScale,
  renderRenderingSettings
};
