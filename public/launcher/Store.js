export const isDesktop = Boolean(globalThis.window?.__TAURI_INTERNALS__);
export function invoke(command, args = {}) {
    if (!isDesktop)
        return Promise.reject(new Error('Open the desktop launcher to use this action. This browser is a read-only preview.'));
    return window.__TAURI_INTERNALS__.invoke(command, args);
}
export function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
export function formatSize(bytes) {
    return bytes >= 1024 ** 3 ? `${(bytes / 1024 ** 3).toFixed(2)} GB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}
export function freshProfile() {
    return { id: '', name: '', gpu: 'auto', frameRate: 120, widescreen: 'none', audioProfile: 'balanced', recovery: false, jsModding: false, worldMapJson: false, plantLevelSystem: false, applySettings: true, updatedAt: 0 };
}
export async function loadState() {
    if (isDesktop)
        return invoke('launcher_state');
    return { games: [{ id: 'builtin', name: 'PvZ2 Gardendless', version: '0.15.0 · launcher edition', builtin: true, available: true, path: 'Embedded game' }], profiles: [{ ...freshProfile(), id: 'default', name: 'Existing save', applySettings: false }], gpus: [], running: null, platform: 'browser', launcherVersion: '0.15.0', dataDir: 'Available in the desktop app' };
}
