import { invoke, isDesktop } from './Store.js';
export const palettes = { garden: 'Garden', lavender: 'Lavender', ocean: 'Ocean', rose: 'Rose', caelestia: 'Follow Caelestia' };
export const modes = { dark: 'Dark', light: 'Light', system: 'System' };
let preferences = { palette: 'garden', mode: 'dark' };
try {
    const saved = JSON.parse(localStorage.getItem('launcher-appearance') || '{}');
    if (Object.hasOwn(palettes, saved.palette)) preferences.palette = saved.palette;
    if (Object.hasOwn(modes, saved.mode)) preferences.mode = saved.mode;
} catch { /* Start with the default when storage is unavailable or invalid. */ }
const system = window.matchMedia('(prefers-color-scheme: dark)');
let scheme = null;
const colorRoles = {
    primary: 'primary', onPrimary: 'on-primary', primaryContainer: 'primary-container', onPrimaryContainer: 'on-primary-container',
    secondary: 'secondary', onSecondary: 'on-secondary', secondaryContainer: 'secondary-container', onSecondaryContainer: 'on-secondary-container',
    tertiary: 'tertiary', tertiaryContainer: 'tertiary-container', onTertiaryContainer: 'on-tertiary-container',
    surface: 'surface', surfaceContainerLowest: 'surface-container-lowest', surfaceContainerLow: 'surface-container-low',
    surfaceContainer: 'surface-container', surfaceContainerHigh: 'surface-container-high', surfaceContainerHighest: 'surface-container-highest',
    onSurface: 'on-surface', onSurfaceVariant: 'on-surface-variant', outline: 'outline', outlineVariant: 'outline-variant',
    error: 'error', errorContainer: 'error-container', onErrorContainer: 'on-error-container',
    inverseSurface: 'inverse-surface', inverseOnSurface: 'inverse-on-surface',
};
export function validCaelestiaScheme(value) {
    return value && (value.mode === 'dark' || value.mode === 'light') && value.colours &&
        Object.keys(colorRoles).every(role => /^[0-9a-fA-F]{6}$/.test(value.colours[role] || ''));
}
function apply() {
    const useScheme = preferences.palette === 'caelestia' && validCaelestiaScheme(scheme);
    document.documentElement.dataset.palette = preferences.palette === 'caelestia' && !useScheme ? 'garden' : preferences.palette;
    document.documentElement.dataset.mode = useScheme ? scheme.mode : preferences.mode === 'system' ? (system.matches ? 'dark' : 'light') : preferences.mode;
    for (const [role, cssName] of Object.entries(colorRoles)) {
        const name = `--md-${cssName}`;
        if (useScheme) document.documentElement.style.setProperty(name, `#${scheme.colours[role]}`);
        else document.documentElement.style.removeProperty(name);
    }
}
export async function refreshCaelestiaScheme() {
    if (!isDesktop) return false;
    try {
        const value = await invoke('launcher_caelestia_scheme');
        const next = validCaelestiaScheme(value) ? value : null;
        if (JSON.stringify(next) !== JSON.stringify(scheme)) { scheme = next; apply(); }
        return Boolean(next);
    } catch { return false; }
}
export function startCaelestiaSync() {
    refreshCaelestiaScheme();
    setInterval(() => { if (preferences.palette === 'caelestia' && !document.hidden) refreshCaelestiaScheme(); }, 5000);
}
export function getAppearance() { return {...preferences}; }
export function setAppearance(key, value) {
    if (key === 'palette' && Object.hasOwn(palettes, value) || key === 'mode' && Object.hasOwn(modes, value)) {
        preferences[key] = value;
        try { localStorage.setItem('launcher-appearance', JSON.stringify(preferences)); } catch {}
        apply();
        if (value === 'caelestia') refreshCaelestiaScheme();
    }
}
system.addEventListener('change', apply);
apply();
