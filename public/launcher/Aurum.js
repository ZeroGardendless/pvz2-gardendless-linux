import {AURUM_CONTENT_DIGEST} from './AurumVersion.js';
import {escapeHtml} from './Store.js';
export const AURUM_ID = 'gardendless.aurum';

/** Read desired selection only: the launcher never executes mod code. */
export async function readAurumSelection(fs) {
    const path = 'gp-next/configuration-state.json';
    if (!await fs.exists(path)) return {status: 'ready', installed: false, enabled: false};
    const record = JSON.parse(await fs.readTextFile(path));
    if (!Array.isArray(record?.desired?.mods)) throw new Error('GP-Next configuration needs review.');
    const pack = record.desired.mods.find(mod => mod.id === AURUM_ID);
    return {status: 'ready', installed: Boolean(pack), enabled: pack?.enabled === true, needsUpdate: Boolean(pack && pack.contentDigest !== AURUM_CONTENT_DIGEST),
        blocked: Boolean(record.journal || record.recovery?.required)};
}

export function aurumKnobMarkup(selection, {available = true, busy = false, running = false} = {}) {
    const loading = selection.status === 'loading';
    const enabled = selection.enabled === true;
    const disabled = !available || busy || running || loading || selection.status === 'error' || selection.blocked;
    const label = !available ? 'Included game' : loading ? 'Checking…' : selection.status === 'error' ? 'Unavailable'
        : selection.blocked ? 'Recovery needed' : !selection.installed ? 'Set up' : selection.needsUpdate ? 'Update' : enabled ? 'On' : 'Off';
    const title = selection.error || (running ? 'Close the game to change Aurum.' : !selection.installed
        ? 'Review and install Aurum for this profile.' : selection.needsUpdate ? 'Review the bundled Aurum update. Your selection and settings are preserved.' : `${enabled ? 'Disable' : 'Enable'} Aurum for the next launch.`);
    return `<button type="button" class="aurum-knob" role="switch" aria-label="Aurum" aria-checked="${enabled}"
        aria-describedby="aurum-state" title="${escapeHtml(title)}" data-action="toggle-aurum" ${disabled ? 'disabled' : ''}>
        <span class="aurum-track" aria-hidden="true"><span class="aurum-thumb"></span></span>
    </button><span class="aurum-caption">Aurum<small id="aurum-state">${label}</small></span>`;
}
