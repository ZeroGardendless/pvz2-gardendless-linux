import { getSettings, setSettings } from "./SettingsStore.js";
const settingsKeys = ["locale", "builtinTranslations", "frameRate", "widescreen", "debug", "overlayHotkey", "scrollSensitivity", "hpOverlay"];
const appearanceKeys = ["blur", "accent", "tint", "opacity", "radius", "compact", "reduceMotion"];
const pick = (value, keys) => Object.fromEntries(keys.filter((key) => Object.hasOwn(value, key)).map((key) => [key, value[key]]));
const object = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
function check(condition, message) {
  if (!condition) throw new Error(message);
}
function parsePreferences(text) {
  check(typeof text === "string" && text.length <= 262144, "Settings files must be smaller than 256 KiB.");
  const data = JSON.parse(text);
  check(data?.format === "gpnext-preferences" && data.version === 1, "This is not a supported GPNext preferences file.");
  check(object(data.settings) && object(data.appearance), "Settings and appearance must be objects.");
  const settings = pick(data.settings, settingsKeys), appearance = pick(data.appearance, appearanceKeys);
  for (const [key, value] of Object.entries(settings)) {
    if (["builtinTranslations", "debug"].includes(key)) check(typeof value === "boolean", `Invalid ${key}.`);
    if (key === "locale") check(value === null || typeof value === "string" && value.length <= 32, "Invalid language.");
    if (key === "frameRate") check(["30", "60", "90", "120", "144", "165", "240"].includes(value), "Choose a supported FPS limit.");
    if (key === "widescreen") check(["none", "fog", "bushes"].includes(value), "Invalid widescreen style.");
    if (["overlayHotkey", "scrollSensitivity", "hpOverlay"].includes(key)) {
      check(object(value), `Invalid ${key}.`);
      const fields = key === "overlayHotkey" ? ["key", "code", "ctrl", "alt", "shift", "meta"] : key === "scrollSensitivity" ? ["enabled", "wheel", "discreteMinIntervalMs"] : ["showPlant", "showZombie", "showTomb"];
      settings[key] = pick(value, fields);
      for (const [field, item] of Object.entries(settings[key])) {
        if (["key", "code"].includes(field)) check(typeof item === "string" && item.length > 0 && item.length <= 64, "Invalid hotkey.");
        else if (["wheel", "discreteMinIntervalMs"].includes(field)) check(Number.isFinite(item) && item >= 0 && item <= 1e3, "Invalid scrolling preference.");
        else check(typeof item === "boolean", `Invalid ${field}.`);
      }
    }
  }
  for (const [key, value] of Object.entries(appearance)) {
    if (["blur", "compact", "reduceMotion"].includes(key)) check(typeof value === "boolean", `Invalid ${key}.`);
    else if (key === "accent") check(Array.isArray(value) && value.length === 3 && value.every((channel) => Number.isInteger(channel) && channel >= 0 && channel <= 255), "Invalid accent color.");
    else {
      const [min, max] = { tint: [0, 45], opacity: [70, 100], radius: [6, 18] }[key];
      check(Number.isFinite(value) && value >= min && value <= max, `Invalid ${key}.`);
    }
  }
  return { format: "gpnext-preferences", version: 1, settings, appearance };
}
function exportPreferences(storage = localStorage) {
  let appearance = {};
  try {
    const saved = JSON.parse(storage.getItem("gpnext-ui") || "{}");
    if (object(saved)) appearance = pick(saved, appearanceKeys);
  } catch {
  }
  return JSON.stringify({ format: "gpnext-preferences", version: 1, settings: pick(getSettings(), settingsKeys), appearance }, null, 2);
}
function importPreferences(text, storage = localStorage) {
  const data = parsePreferences(text);
  const previousSettings = getSettings(), previousAppearance = storage.getItem("gpnext-ui");
  let current = {};
  try {
    const saved = JSON.parse(previousAppearance || "{}");
    if (object(saved)) current = pick(saved, appearanceKeys);
  } catch {
  }
  try {
    storage.setItem("gpnext-ui", JSON.stringify({ ...current, ...data.appearance }));
    setSettings(data.settings);
  } catch (error) {
    try {
      setSettings(previousSettings);
      if (previousAppearance === null) storage.removeItem("gpnext-ui");
      else storage.setItem("gpnext-ui", previousAppearance);
    } catch {
    }
    throw error;
  }
  return data;
}
export {
  exportPreferences,
  importPreferences,
  parsePreferences
};
