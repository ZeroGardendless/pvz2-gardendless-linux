import { applyFrameRate } from "./FrameRate.js";
function applyFrameSettings(game, settings) {
  applyFrameRate(game, settings.experimental.frameScheduler ? settings.experimental.frameRate : settings.frameRate);
}
export {
  applyFrameSettings,
  applyFrameSettings as t
};
