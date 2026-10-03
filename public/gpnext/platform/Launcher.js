// This module must stay independent of SettingsStore and the engine: the host
// reads the launch profile before those modules can cache saved preferences.
let context = null;
export function getLauncherContext() { return context; }
export function profileRevision(profile) { return `${profile.id}:${profile.updatedAt || 0}`; }
export function profileSettings(profile) {
  return {
    frameRate: String(profile.frameRate), widescreen: profile.widescreen,
    experimental: { jsModding: profile.jsModding, worldMapJson: profile.worldMapJson, plantLevelSystem: profile.plantLevelSystem }
  };
}
export async function initializeLauncherContext() {
  const invoke = globalThis.window?.__TAURI_INTERNALS__?.invoke;
  if (!invoke) return;
  try { context = await invoke('launcher_game_context'); }
  catch { return; } // Browser previews and older native hosts have no launcher.
  if (!context?.profile) return;
  const profile = context.profile;
  // Session storage survives page reloads but is discarded with the game window.
  const recoveryKey = `gardendless-recovery:${profileRevision(profile)}`;
  if (profile.recovery && !sessionStorage.getItem(recoveryKey)) {
    sessionStorage.setItem(recoveryKey, '1');
    const url = new URL(location.href);
    url.searchParams.set('gpnext-recovery', '1');
    history.replaceState(null, '', url);
  }
  // Install temporary recovery storage before any preference reads or writes.
  await import('../runtime/Recovery.js');
  const revision = profileRevision(profile);
  if (profile.applySettings && localStorage.getItem('gardendless-launch-profile') !== revision) {
    const { setSettings } = await import('../core/SettingsStore.js');
    setSettings(profileSettings(profile));
    const { writeAudioProfile } = await import('../audio/AudioTuning.js');
    writeAudioProfile(profile.audioProfile || 'balanced');
    localStorage.setItem('gardendless-launch-profile', revision);
  }
}
export function connectLauncherOverlay(overlay) {
  if (!context) return;
  const tab = { mods: 'patcher', tools: 'cheats', performance: 'performance', settings: 'settings' }[context.openTab];
  if (tab && !sessionStorage.getItem('gardendless-launch-tab')) {
    sessionStorage.setItem('gardendless-launch-tab', '1');
    overlay.switchTab(tab);
    overlay.show();
  }
}
