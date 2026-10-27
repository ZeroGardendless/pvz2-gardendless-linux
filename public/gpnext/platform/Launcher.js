let context = null;
function getLauncherContext() {
  return context;
}
function profileRevision(profile) {
  return `${profile.id}:${profile.updatedAt || 0}`;
}
function profileSettings(profile) {
  return {
    frameRate: String(profile.frameRate),
    widescreen: profile.widescreen,
    renderScale: profile.renderScale ?? 100,
    experimental: { jsModding: profile.jsModding, worldMapJson: profile.worldMapJson, plantLevelSystem: profile.plantLevelSystem }
  };
}
async function initializeLauncherContext() {
  const invoke = globalThis.window?.__TAURI_INTERNALS__?.invoke;
  if (!invoke) return;
  try {
    context = await invoke("launcher_game_context");
  } catch {
    return;
  }
  if (!context?.profile) {
    await applyPendingImports(invoke);
    return;
  }
  const profile = context.profile;
  const recoveryKey = `gardendless-recovery:${profileRevision(profile)}`;
  if (profile.recovery && !sessionStorage.getItem(recoveryKey)) {
    sessionStorage.setItem(recoveryKey, "1");
    const url = new URL(location.href);
    url.searchParams.set("gpnext-recovery", "1");
    history.replaceState(null, "", url);
  }
  await import("../runtime/Recovery.js");
  const revision = profileRevision(profile);
  if (profile.applySettings && localStorage.getItem("gardendless-launch-profile") !== revision) {
    const { setSettings } = await import("../core/SettingsStore.js");
    setSettings(profileSettings(profile));
    const { writeAudioProfile } = await import("../audio/AudioTuning.js");
    writeAudioProfile(profile.audioProfile || "balanced");
    localStorage.setItem("gardendless-launch-profile", revision);
  }
  if (!profile.recovery) await applyPendingImports(invoke);
}
function connectLauncherOverlay(overlay) {
  if (!context) return;
  const tab = { mods: "patcher", tools: "cheats", performance: "performance", settings: "settings" }[context.openTab];
  if (tab && !sessionStorage.getItem("gardendless-launch-tab")) {
    sessionStorage.setItem("gardendless-launch-tab", "1");
    overlay.switchTab(tab);
    overlay.show();
  }
}
async function applyPendingImports(invoke) {
  let ids;
  try {
    ids = await invoke("launcher_pending_packages", { applied: [] });
  } catch {
    return;
  }
  if (!Array.isArray(ids) || !ids.length) return;
  const { loadSettings, saveSettings } = await import("../mods/FileLoader.js");
  const settings = await loadSettings();
  const saved = await saveSettings({ ...settings, disabledPacks: [.../* @__PURE__ */ new Set([...settings.disabledPacks, ...ids])] });
  if (!saved) throw new Error("Could not disable newly imported datapacks before loading them.");
  await invoke("launcher_pending_packages", { applied: ids });
}
export {
  connectLauncherOverlay,
  getLauncherContext,
  initializeLauncherContext,
  profileRevision,
  profileSettings
};
