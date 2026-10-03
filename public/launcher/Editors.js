import { invoke, isDesktop, escapeHtml as esc } from './Store.js';
import { renderProgress, validateProgress, newPlayer, newPlant, newEndless, prepareCollection, setProgressValue, setPlantUnlocked, unlockAllPlants, WORLDS, TUTORIALS } from './SaveProgress.js';
import { DEFAULT_KEYBINDS, KEY_CODES } from './EditorsData.js';

export { DEFAULT_KEYBINDS, KEY_CODES } from './EditorsData.js';
export const MAX_JSON_BYTES = 8 * 1024 * 1024;
const own = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const clone = value => JSON.parse(JSON.stringify(value));
const reserved = new Set(['__proto__', 'prototype', 'constructor']);
const validCodes = new Set(KEY_CODES);
const currencyFields = Object.freeze({ coin: 'Coins', gem: 'Gems', worldkey: 'World keys', ticket: 'Tickets', sprout: 'Sprouts' });
const drafts = new Map();

/** Parse JSON without coercing values or merging untrusted object properties. */
export function parseEditorJson(text) {
    if (typeof text !== 'string' || new TextEncoder().encode(text).length > MAX_JSON_BYTES)
        throw new Error('Choose a JSON file smaller than 8 MiB.');
    const value = JSON.parse(text);
    const pending = [{ value, depth: 0 }];
    while (pending.length) {
        const item = pending.pop();
        if (item.depth > 64) throw new Error('JSON is nested too deeply (maximum 64 levels).');
        if (item.value && typeof item.value === 'object') {
            for (const key of Object.keys(item.value)) {
                if (reserved.has(key)) throw new Error(`Unsupported JSON property: ${key}.`);
                pending.push({ value: item.value[key], depth: item.depth + 1 });
            }
        } else if (typeof item.value === 'number' && !Number.isFinite(item.value)) {
            throw new Error('JSON numbers must be finite.');
        }
    }
    return value;
}

export function validatePlayers(players) {
    if (!Array.isArray(players) || !players.length || players.length > 100)
        throw new Error('A save must contain between 1 and 100 players.');
    players.forEach((player, index) => {
        if (!record(player) || typeof player.name !== 'string')
            throw new Error(`Player ${index + 1} needs a name and a JSON object.`);
        validateProgress(player);
        for (const key of Object.keys(currencyFields)) {
            if (own(player, key) && (!Number.isSafeInteger(player[key]) || player[key] < 0))
                throw new Error(`${currencyFields[key]} for player ${index + 1} must be a non-negative whole number.`);
        }
    });
    return players;
}

export function validateKeybinds(bindings) {
    if (!record(bindings)) throw new Error('Keybindings must be a JSON object.');
    for (const [key, value] of Object.entries(bindings)) {
        if (reserved.has(key)) throw new Error(`Unsupported keybinding property: ${key}.`);
        if (own(DEFAULT_KEYBINDS, key) && !validCodes.has(value))
            throw new Error(`${actionLabel(key)} uses an unsupported key: ${String(value)}.`);
    }
    return bindings;
}

/** A single-player import updates only the selected player; full arrays are explicit replacements. */
export function importPlayers(value, current = null, playerIndex = 0) {
    if (Array.isArray(value)) return clone(validatePlayers(value));
    validatePlayers([value]);
    const result = current ? clone(current) : [];
    result[current ? Math.min(playerIndex, current.length - 1) : 0] = clone(value);
    return validatePlayers(result);
}

export function importKeybinds(value, settings = {}) {
    if (!record(value)) throw new Error('Choose a keybinding map or game settings JSON object.');
    const bindings = own(value, 'KeyBinds') ? value.KeyBinds : value;
    validateKeybinds(bindings);
    if (!Object.keys(bindings).some(key => own(DEFAULT_KEYBINDS, key)))
        throw new Error('This file has no recognized Gardendless keybindings.');
    const result = clone(settings || {});
    // A keybind import must never replace sound, language, player index, or other settings.
    result.KeyBinds = { ...(result.KeyBinds || {}), ...clone(bindings) };
    return result;
}

export function actionLabel(action) {
    const direct = { Game_Pause: 'Pause game', Game_SpeedUp: 'Speed up', Game_Plantfood: 'Plant food', Game_UIUpper: 'Move UI upward', Game_BananaLauncher: 'Banana Launcher', Game_MissileToe: 'Missile Toe', Game_IceShroom: 'Ice-shroom', ZenGarden_DealWithAll: 'Tend all plants', AirRaid_W: 'Move up', AirRaid_A: 'Move left', AirRaid_S: 'Move down', AirRaid_D: 'Move right' };
    if (own(direct, action)) return direct[action];
    return action.replace(/^[^_]+_/, '').replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/(\D)(\d)/g, '$1 $2').replace(/^Card /, 'Card slot ');
}

export function keyLabel(code) {
    return String(code).replace(/^KEY_/, '').replace(/^DIGIT_/, '').replace(/^NUM_/, 'Numpad ').replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, character => character.toUpperCase());
}

export function eventKeyCode(event) {
    if (/^Key[A-Z]$/.test(event.code)) return `KEY_${event.code.slice(3)}`;
    if (/^Digit[0-9]$/.test(event.code)) return `DIGIT_${event.code.slice(5)}`;
    if (/^Numpad[0-9]$/.test(event.code)) return `NUM_${event.code.slice(6)}`;
    const names = { Space: 'SPACE', Escape: 'ESCAPE', Enter: 'ENTER', Tab: 'TAB', Backspace: 'BACKSPACE', Delete: 'DELETE', Insert: 'INSERT', Home: 'HOME', End: 'END', PageUp: 'PAGE_UP', PageDown: 'PAGE_DOWN', ArrowLeft: 'ARROW_LEFT', ArrowRight: 'ARROW_RIGHT', ArrowUp: 'ARROW_UP', ArrowDown: 'ARROW_DOWN', ShiftLeft: 'SHIFT_LEFT', ShiftRight: 'SHIFT_RIGHT', ControlLeft: 'CTRL_LEFT', ControlRight: 'CTRL_RIGHT', AltLeft: 'ALT_LEFT', AltRight: 'ALT_RIGHT', CapsLock: 'CAPS_LOCK', NumLock: 'NUM_LOCK', ScrollLock: 'SCROLL_LOCK', Pause: 'PAUSE', Semicolon: 'SEMICOLON', Equal: 'EQUAL', Comma: 'COMMA', Minus: 'DASH', Period: 'PERIOD', Slash: 'SLASH', Backquote: 'BACK_QUOTE', BracketLeft: 'BRACKET_LEFT', BracketRight: 'BRACKET_RIGHT', Backslash: 'BACKSLASH', Quote: 'QUOTE', NumpadEnter: 'NUM_ENTER', NumpadMultiply: 'NUM_MULTIPLY', NumpadAdd: 'NUM_PLUS', NumpadSubtract: 'NUM_SUBTRACT', NumpadDecimal: 'NUM_DECIMAL', NumpadDivide: 'NUM_DIVIDE' };
    return names[event.code] || (validCodes.has(event.code) ? event.code : null);
}

export function sharedBindings(bindings) {
    const groups = new Map();
    for (const [action, defaultKey] of Object.entries(DEFAULT_KEYBINDS)) {
        const key = bindings?.[action] ?? defaultKey;
        const identity = `${action.split('_')[0]}:${key}`;
        const group = groups.get(identity) || [];
        group.push(action);
        groups.set(identity, group);
    }
    return [...groups.values()].filter(group => group.length > 1);
}

function emptyDraft() {
    return { sourceId: '', revision: '', players: null, settings: null, original: null, playerIndex: 0, dirty: false, rawDirty: false, raw: '', query: '', group: 'All', importing: '', status: '' };
}
const button = (action, label, style = 'secondary', attrs = '') => `<button type="button" class="button ${style}" data-editor-action="${action}" ${attrs}>${label}</button>`;

/** A scoped editor with persistent per-profile drafts; it never writes until Apply is pressed. */
export function mountEditors(container, { profileId = 'default', profileName = 'Existing save', notify = () => {}, mode = 'save' } = {}) {
    const draftKey = `${profileId}:${mode}`;
    const state = drafts.get(draftKey) || emptyDraft();
    drafts.set(draftKey, state);
    let listing = { supported: false, sources: [], backups: [], message: null };
    let active = true, busy = false, error = '', recording = null;
    const isSave = mode === 'save';
    const data = () => isSave ? state.players : state.settings?.KeyBinds;
    const dirty = () => state.dirty || state.rawDirty;
    const setStatus = message => { state.status = message; error = ''; };
    const source = () => listing.sources.find(item => item.id === state.sourceId);
    const edit = () => { state.dirty = true; state.status = 'Changes are ready to review. Apply them when finished.'; };
    const errorMessage = failure => String(failure?.message || failure || 'The action failed.');

    function render() {
        if (!active) return;
        const available = data() != null;
        const sources = listing.sources.filter(item => isSave ? item.hasPlayers : item.hasSettings);
        const sourceOptions = sources.map(item => `<option value="${esc(item.id)}" ${item.id === state.sourceId ? 'selected' : ''}>${esc(item.label)}</option>`).join('');
        container.innerHTML = `<div class="editors" aria-busy="${busy}">
            <section class="panel editor-source"><div class="editor-heading"><div><h2>${isSave ? 'Player saves' : 'Game keybindings'}</h2><p class="muted">Profile: <strong>${esc(profileName)}</strong> · Close the game before loading or applying local changes.</p></div><span class="badge ${dirty() ? '' : 'green'}">${dirty() ? 'Unsaved changes' : available ? 'Ready' : 'No file loaded'}</span></div>
            ${!isDesktop ? '<p class="editor-hint">Browser preview: local saves are available in the desktop launcher. You can still import, edit, and export JSON here.</p>' : listing.message ? `<p class="editor-hint">${esc(listing.message)}</p>` : ''}
            <div class="editor-toolbar"><label class="field editor-source-choice">Local save source<select data-editor-source ${!sources.length || busy || dirty() ? 'disabled' : ''}><option value="">Choose a local save…</option>${sourceOptions}</select></label>${button('load', 'Load local save', 'secondary', `${!isDesktop || !state.sourceId || busy || dirty() ? 'disabled' : ''}`)}${button('refresh', 'Find saves', 'quiet', `${!isDesktop || busy ? 'disabled' : ''}`)}${button('import', 'Import JSON', 'secondary', busy ? 'disabled' : '')}${isSave && available ? button('clear-draft', 'Clear editor', 'quiet', busy ? 'disabled' : '') : ''}<input data-editor-file type="file" accept=".json,application/json" hidden></div>
            ${source() ? `<p class="editor-location">${esc(source().path)}</p>` : ''}
            ${state.importing ? `<p class="editor-hint">Imported <strong>${esc(state.importing)}</strong>. ${state.sourceId ? 'Apply will update the loaded local save.' : 'Export your edits, or revert and load a local save before importing to apply it.'}</p>` : ''}
            ${error ? `<p class="editor-error" role="alert">${esc(error)}</p>` : ''}<p class="editor-status" role="status">${esc(state.status)}</p></section>
            ${available ? (isSave ? renderPlayers() + renderProgress(state.players[state.playerIndex], state, busy || state.rawDirty) : renderBindings()) : renderEmpty()}
            ${available ? `<section class="panel editor-review"><div><h2>Review and apply</h2><p class="muted">Applying creates a local backup first. Other ${isSave ? 'game settings' : 'save progress and settings'} are kept. A changed source must be reloaded before applying.</p></div><div class="editor-toolbar">${button('apply', 'Back up & apply', 'primary', !isDesktop || !listing.supported || !state.revision || busy || !dirty() ? 'disabled' : '')}${button('export', isSave ? 'Export selected player' : 'Export keybindings', 'secondary', busy ? 'disabled' : '')}${isSave ? button('export-all', 'Export all players', 'quiet', busy ? 'disabled' : '') : ''}${button('revert', 'Revert changes', 'quiet', !dirty() || busy ? 'disabled' : '')}</div></section>${renderRaw()}` : ''}
            ${renderBackups()}
        </div>`;
    }

    function renderEmpty() {
        return `<section class="panel editor-empty"><div class="editor-empty-symbol" aria-hidden="true">${isSave ? '◇' : '⌘'}</div><h2>${isSave ? 'Choose a save to edit' : 'Bring your controls into the launcher'}</h2><p>${isSave ? 'Load the saves already stored by this profile, or import a player JSON exported from Gardendless.' : 'Load your existing game settings or import a KeyBinds JSON file. Defaults match the included game.'}</p>${!isSave ? button('defaults', 'Start with default keybindings', 'secondary') : button('new-save', 'Create a new save', 'secondary')}</section>`;
    }

    function renderPlayers() {
        const player = state.players[state.playerIndex] || state.players[0];
        return `<section class="panel editor-player"><div class="editor-heading"><h2>Player details</h2><label class="field">Player<select data-editor-player ${busy ? 'disabled' : ''}>${state.players.map((item, index) => `<option value="${index}" ${index === state.playerIndex ? 'selected' : ''}>${esc(item.name || `Player ${index + 1}`)}</option>`).join('')}</select></label></div>
            <div class="editor-fields"><label class="field editor-name">Name<input data-editor-field="name" value="${esc(player.name)}" ${busy || state.rawDirty ? 'disabled' : ''}></label>${Object.entries(currencyFields).map(([key, label]) => `<label class="field">${label}<input type="number" min="0" max="${Number.MAX_SAFE_INTEGER}" step="1" data-editor-field="${key}" value="${esc(player[key] ?? 0)}" ${busy || state.rawDirty ? 'disabled' : ''}></label>`).join('')}</div>
            <div class="editor-facts"><span>Game version <strong>${esc(player.version || 'Unspecified')}</strong></span><span>Players in save <strong>${state.players.length}</strong></span><span>Other progression fields are preserved</span></div>${state.rawDirty ? '<p class="editor-hint">Validate the JSON below, or revert it, to continue using the form.</p>' : ''}</section>`;
    }

    function renderBindings() {
        const bindings = state.settings.KeyBinds || {};
        const groups = ['All', 'Game', 'ZenGarden', 'Sandbox', 'Rhythm', 'AirRaid'];
        const groupLabel = group => ({ ZenGarden: 'Zen Garden', AirRaid: 'Air Raid' })[group] || group;
        const query = state.query.trim().toLowerCase();
        const actions = Object.keys(DEFAULT_KEYBINDS).filter(action => (state.group === 'All' || action.startsWith(`${state.group}_`)) && `${action} ${actionLabel(action)} ${groupLabel(action.split('_')[0])} ${keyLabel(bindings[action] ?? DEFAULT_KEYBINDS[action])}`.toLowerCase().includes(query));
        const shares = sharedBindings(bindings);
        const changed = Object.entries(DEFAULT_KEYBINDS).filter(([key, value]) => bindings[key] && bindings[key] !== value).length;
        return `<section class="panel editor-keybindings"><div class="editor-heading"><div><h2>Keyboard controls</h2><p class="muted">${Object.keys(DEFAULT_KEYBINDS).length} actions · ${changed} customized · Click a key to change it.</p></div>${button('reset-all', 'Use defaults', 'quiet', busy || state.rawDirty ? 'disabled' : '')}</div><label class="field editor-search">Search actions, categories, or keys<input type="search" data-editor-search value="${esc(state.query)}" placeholder="Try conveyor, garden, or Space"></label>
            <div class="editor-tabs" role="group" aria-label="Control categories">${groups.map(group => button('group', groupLabel(group), group === state.group ? 'secondary active' : 'quiet', `data-editor-group="${group}" aria-pressed="${group === state.group}"`)).join('')}</div>
            <div class="editor-bindings">${actions.map(action => `<div class="editor-binding"><div><strong>${esc(actionLabel(action))}</strong><small>${esc(action)}</small></div><div class="editor-binding-buttons">${button('capture', esc(keyLabel(bindings[action] ?? DEFAULT_KEYBINDS[action])), 'secondary editor-key', `data-editor-key="${action}" aria-label="Change ${esc(actionLabel(action))}" ${busy || state.rawDirty ? 'disabled' : ''}`)}${button('reset-key', 'Reset', 'quiet', `data-editor-key="${action}" aria-label="Reset ${esc(actionLabel(action))}" ${busy || state.rawDirty || !bindings[action] || bindings[action] === DEFAULT_KEYBINDS[action] ? 'disabled' : ''}`)}</div></div>`).join('') || '<p class="muted">No matching controls.</p>'}</div>
            ${shares.length ? `<details class="editor-shared"><summary>${shares.length} shared bindings in the same category</summary><p class="muted">Some defaults intentionally share keys, such as normal and conveyor cards. Shared keys may activate more than one action in the same scene.</p>${shares.map(actions => `<p><kbd>${esc(keyLabel(bindings[actions[0]] ?? DEFAULT_KEYBINDS[actions[0]]))}</kbd> ${actions.map(actionLabel).map(esc).join(' · ')}</p>`).join('')}</details>` : ''}
            ${recording ? `<div class="editor-capture" role="group" aria-label="Change keybinding"><strong>${esc(actionLabel(recording))}</strong><p>Press one key, or choose it below. Escape cancels recording. Modifier combinations are not supported by the game.</p><label class="field">Key<select data-editor-pick><option value="">Choose a key…</option>${KEY_CODES.map(key => `<option value="${key}">${esc(keyLabel(key))}</option>`).join('')}</select></label>${button('cancel-capture', 'Cancel', 'quiet')}</div>` : ''}</section>`;
    }

    function renderRaw() {
        const value = state.rawDirty ? state.raw : JSON.stringify(data(), null, 2);
        return `<details class="panel editor-advanced" ${state.rawDirty ? 'open' : ''}><summary>Advanced JSON</summary><p class="muted">${isSave ? 'All players in this save. Unknown fields are preserved.' : 'Only keybindings. Other game settings are kept.'} Structure and known fields are checked; custom game rules cannot all be validated.</p><label class="field">${isSave ? 'Players JSON' : 'Keybindings JSON'}<textarea data-editor-json spellcheck="false" ${busy ? 'disabled' : ''}>${esc(value)}</textarea></label><div class="editor-toolbar">${button('validate-json', 'Validate JSON edits', 'secondary', busy ? 'disabled' : '')}${button('revert-json', 'Discard JSON edits', 'quiet', !state.rawDirty || busy ? 'disabled' : '')}</div></details>`;
    }

    function renderBackups() {
        const backups = listing.backups.filter(item => item.sourceId === state.sourceId);
        if (!backups.length) return '';
        return `<details class="panel editor-backups"><summary>Automatic backups (${backups.length})</summary><p class="muted">Restore replaces both player saves and game settings from that backup. The current data is backed up again first.</p>${backups.map(item => `<div class="editor-backup"><div><strong>${esc(item.label)}</strong><small>${esc(new Date(Number(item.createdAt) * (Number(item.createdAt) < 1e12 ? 1000 : 1)).toLocaleString())}</small></div>${button('restore', 'Restore…', 'secondary', `data-editor-backup="${esc(item.id)}" ${busy || dirty() || !state.revision ? 'disabled' : ''}`)}</div>`).join('')}</details>`;
    }

    async function run(operation) {
        if (busy) return;
        busy = true; error = ''; render();
        try { await operation(); }
        catch (failure) { error = errorMessage(failure); }
        finally { busy = false; render(); }
    }

    async function refresh() {
        if (!isDesktop) return;
        listing = await invoke('launcher_save_sources', { profileId });
        if (!state.sourceId) {
            const options = listing.sources.filter(item => isSave ? item.hasPlayers : item.hasSettings);
            if (options.length === 1) state.sourceId = options[0].id;
        }
    }

    function acceptSnapshot(snapshot) {
        state.sourceId = snapshot.sourceId;
        state.revision = snapshot.revision;
        state.players = snapshot.players == null ? null : clone(snapshot.players);
        state.settings = snapshot.settings == null ? null : clone(snapshot.settings);
        if (!isSave && state.settings) state.settings.KeyBinds ||= {};
        state.playerIndex = Math.max(0, Math.min(state.playerIndex, (state.players?.length || 1) - 1));
        state.original = clone({ players: state.players, settings: state.settings });
        state.dirty = false; state.rawDirty = false; state.importing = '';
    }

    function validateRaw() {
        if (!state.rawDirty) return;
        const value = parseEditorJson(state.raw);
        if (isSave) state.players = clone(validatePlayers(value));
        else state.settings.KeyBinds = clone(validateKeybinds(value));
        state.playerIndex = Math.min(state.playerIndex, (state.players?.length || 1) - 1);
        state.rawDirty = false; edit();
    }

    async function exportJson(all = false) {
        validateRaw();
        if (isSave) validatePlayers(state.players); else validateKeybinds(state.settings.KeyBinds);
        const value = isSave ? (all ? state.players : state.players[state.playerIndex]) : state.settings.KeyBinds;
        const filename = isSave ? (all ? 'Gardendless-Players.json' : 'Gardendless-Player.json') : 'KeyBinds.json';
        if (isDesktop) {
            const path = await invoke('launcher_export_json', { name: filename, data: value });
            if (path) setStatus(`Exported to ${path}`);
        } else {
            const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: 'application/json' }));
            const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
            anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
            setStatus('JSON exported.');
        }
    }

    function setKey(action, code) {
        if (!own(DEFAULT_KEYBINDS, action) || !validCodes.has(code)) throw new Error('Unsupported keybinding.');
        state.settings.KeyBinds[action] = code; recording = null; edit(); render();
    }

    const click = event => {
        const almanac = event.target.closest('[data-editor-almanac]');
        if (almanac && isDesktop) {
            event.preventDefault();
            invoke('plugin:opener|open_url', { url: 'https://pvzge.com/en/almanac/' }).catch(failure => notify(errorMessage(failure), true));
            return;
        }
        const progress = event.target.closest('[data-progress-action]');
        if (progress && container.contains(progress) && !progress.disabled && !busy) {
            const action = progress.dataset.progressAction;
            if (action === 'page') { state.progressPage = progress.dataset.progressPage; state.progressQuery = ''; render(); return; }
            if (action === 'select-plant') { state.plantId = progress.dataset.plant; render(); return; }
            if (state.rawDirty) return;
            const player = state.players[state.playerIndex];
            try {
                if (action === 'add-plant') prepareCollection(player, 'plantProps')[state.plantId] = newPlant();
                if (action === 'remove-plant') delete prepareCollection(player, 'plantProps')[state.plantId];
                if (action === 'unlock-all-plants') { unlockAllPlants(player); setStatus('All catalog plants unlocked in this draft. Review and Apply to save.'); }
                if (action === 'reset-daily') {
                    setProgressValue(player, ['arcade_plant_decoding', 'played_today'], false);
                    setProgressValue(player, ['arcade_plant_decoding', 'gem_today'], 0);
                }
                if (action === 'complete-tutorials') for (const key of Object.keys(TUTORIALS)) setProgressValue(player, ['tutorial', key], true);
                edit(); render();
            } catch (failure) { error = errorMessage(failure); render(); }
            return;
        }
        const target = event.target.closest('[data-editor-action]');
        if (!target || !container.contains(target) || target.disabled) return;
        const action = target.dataset.editorAction;
        if (action === 'import') { container.querySelector('[data-editor-file]').click(); return; }
        if (action === 'group') { state.group = target.dataset.editorGroup; render(); return; }
        if (action === 'capture') { recording = target.dataset.editorKey; render(); const capture = container.querySelector('.editor-capture'); capture.tabIndex = -1; capture.focus(); return; }
        if (action === 'cancel-capture') { recording = null; render(); return; }
        if (action === 'reset-key') { setKey(target.dataset.editorKey, DEFAULT_KEYBINDS[target.dataset.editorKey]); return; }
        run(async () => {
            if (action === 'new-save') { state.players = [newPlayer()]; state.original = { players: null, settings: null }; state.playerIndex = 0; state.dirty = true; setStatus('New save created for export. Load a local source and import this JSON to replace an existing player.'); }
            if (action === 'clear-draft') { state.players = null; state.original = null; state.revision = ''; state.playerIndex = 0; state.dirty = false; state.rawDirty = false; state.importing = ''; setStatus('Editor cleared. No game data was deleted.'); }
            if (action === 'refresh') { await refresh(); setStatus('Local save sources refreshed.'); }
            if (action === 'load') { acceptSnapshot(await invoke('launcher_save_read', { profileId, sourceId: state.sourceId })); setStatus('Loaded local data. Changes stay in this editor until applied.'); }
            if (action === 'defaults') { state.settings = { KeyBinds: { ...DEFAULT_KEYBINDS } }; state.original = { players: null, settings: clone(state.settings) }; state.dirty = true; setStatus('Default keybindings are ready to customize and export. Load a local source first to apply them to this profile.'); }
            if (action === 'reset-all') { state.settings.KeyBinds = { ...state.settings.KeyBinds, ...DEFAULT_KEYBINDS }; edit(); }
            if (action === 'validate-json') { validateRaw(); setStatus('JSON validated. Review and apply, or export it.'); }
            if (action === 'revert-json') { state.rawDirty = false; setStatus('JSON edits discarded.'); }
            if (action === 'revert') { state.players = clone(state.original?.players ?? null); state.settings = clone(state.original?.settings ?? null); state.playerIndex = 0; state.dirty = false; state.rawDirty = false; state.importing = ''; setStatus('Unsaved changes reverted.'); }
            if (action === 'export' || action === 'export-all') await exportJson(action === 'export-all');
            if (action === 'apply') {
                validateRaw();
                if (isSave) validatePlayers(state.players); else validateKeybinds(state.settings.KeyBinds);
                const snapshot = await invoke('launcher_save_write', { profileId, sourceId: state.sourceId, revision: state.revision, players: isSave ? state.players : null, settings: isSave ? null : state.settings });
                acceptSnapshot(snapshot); setStatus('Saved. A backup was created before applying your changes.'); notify('Changes applied. Your previous data was backed up.'); await refresh();
            }
            if (action === 'restore') {
                const backup = listing.backups.find(item => item.id === target.dataset.editorBackup);
                if (!backup) return;
                const confirmed = await confirmRestore(container, backup.label);
                if (!confirmed || !active) return;
                acceptSnapshot(await invoke('launcher_save_restore', { profileId, sourceId: state.sourceId, backupId: backup.id, revision: state.revision }));
                setStatus('Backup restored. The previous data was backed up first.'); await refresh();
            }
        });
    };

    const input = event => {
        const target = event.target;
        if (target.matches('[data-progress-plant]') && !state.rawDirty && !busy) {
            try { setPlantUnlocked(state.players[state.playerIndex], target.dataset.progressPlant, target.checked); edit(); render(); }
            catch (failure) { error = errorMessage(failure); render(); }
            return;
        }
        if (target.matches('[data-progress-search]')) {
            const cursor = target.selectionStart; state.progressQuery = target.value; render();
            const search = container.querySelector('[data-progress-search]'); search.focus(); search.setSelectionRange(cursor, cursor); return;
        }
        if (target.matches('[data-progress-path]') && !state.rawDirty && !busy) {
            const path = JSON.parse(target.dataset.progressPath), type = target.dataset.progressType;
            let value = target.value;
            if (type === 'boolean') value = target.checked;
            if (type === 'boost') value = target.checked ? 1 : 0;
            if (type === 'number') value = target.value.trim() ? Number(target.value) : '';
            if (type === 'ids') value = target.value.trim() ? target.value.split(',').map(part => part.trim() === '' ? '' : Number(part.trim())) : [];
            try {
                const player = state.players[state.playerIndex];
                if (path[0] === 'player_dangerroom') {
                    const runs = prepareCollection(player, 'player_dangerroom'); runs[path[1]] ||= newEndless();
                }
                setProgressValue(player, path, value);
                edit(); updateDirtyControls();
                validateProgress(player); target.setCustomValidity('');
            } catch (failure) { target.setCustomValidity(errorMessage(failure)); target.reportValidity(); }
            return;
        }
        if (target.matches('[data-editor-search]')) {
            const cursor = target.selectionStart; state.query = target.value; render();
            const search = container.querySelector('[data-editor-search]'); search.focus(); search.setSelectionRange(cursor, cursor); return;
        }
        if (target.matches('[data-editor-json]')) { state.raw = target.value; state.rawDirty = true; updateDirtyControls(); return; }
        if (target.matches('[data-editor-field]')) {
            const key = target.dataset.editorField;
            const value = key === 'name' ? target.value : Number(target.value);
            if (key !== 'name' && (!target.value.trim() || !Number.isSafeInteger(value) || value < 0)) { state.players[state.playerIndex][key] = target.value; edit(); updateDirtyControls(); target.setCustomValidity('Enter a non-negative whole number.'); target.reportValidity(); return; }
            target.setCustomValidity(''); state.players[state.playerIndex][key] = value; edit(); updateDirtyControls();
        }
    };

    function updateDirtyControls() {
        // Keep the advanced view in sync without replacing the focused form.
        // Otherwise opening it after a field edit could show an older save.
        const json = container.querySelector('[data-editor-json]');
        if (json && !state.rawDirty) json.value = JSON.stringify(data(), null, 2);
        const apply = container.querySelector('[data-editor-action="apply"]');
        if (apply) apply.disabled = !isDesktop || !listing.supported || !state.revision || busy || !dirty();
        const revert = container.querySelector('[data-editor-action="revert"]'); if (revert) revert.disabled = !dirty() || busy;
        const rawRevert = container.querySelector('[data-editor-action="revert-json"]'); if (rawRevert) rawRevert.disabled = !state.rawDirty || busy;
        for (const item of container.querySelectorAll('[data-editor-source], [data-editor-action="load"], [data-editor-action="restore"]')) item.disabled = true;
        if (state.rawDirty) for (const item of container.querySelectorAll('.progress-fields, [data-editor-field], [data-editor-action="capture"], [data-editor-action="reset-key"], [data-editor-action="reset-all"]')) item.disabled = true;
        const status = container.querySelector('.editor-status'); if (status) status.textContent = state.rawDirty ? 'JSON edits need validation before applying.' : state.status;
        const badge = container.querySelector('.editor-source .badge'); if (badge) { badge.textContent = 'Unsaved changes'; badge.classList.remove('green'); }
    }

    const change = event => {
        const target = event.target;
        if (target.matches('[data-editor-source]')) { state.sourceId = target.value; state.revision = ''; state.original = null; state.players = null; state.settings = null; render(); }
        if (target.matches('[data-editor-player]')) { state.playerIndex = Number(target.value); render(); }
        if (target.matches('[data-editor-pick]') && target.value && recording) setKey(recording, target.value);
        if (target.matches('[data-editor-file]') && target.files?.[0]) {
            const file = target.files[0];
            run(async () => {
                if (file.size > MAX_JSON_BYTES) throw new Error('Choose a JSON file smaller than 8 MiB.');
                const value = parseEditorJson(await file.text());
                if (!state.original) state.original = clone({ players: state.players, settings: state.settings });
                if (isSave) state.players = importPlayers(value, state.players, state.playerIndex);
                else state.settings = importKeybinds(value, state.settings);
                state.playerIndex = Math.min(state.playerIndex, (state.players?.length || 1) - 1);
                state.importing = file.name; state.rawDirty = false; edit();
            });
        }
    };
    const keydown = event => {
        if (!recording || !active) return;
        if (event.key === 'Escape') { event.preventDefault(); recording = null; render(); return; }
        if (event.target.matches('select') || event.target.closest('.select-control, .select-menu')) return;
        event.preventDefault();
        const code = eventKeyCode(event);
        if (code) setKey(recording, code);
    };
    const unload = event => { if (dirty()) { event.preventDefault(); event.returnValue = ''; } };
    container.addEventListener('click', click);
    container.addEventListener('input', input);
    container.addEventListener('change', change);
    container.addEventListener('keydown', keydown);
    window.addEventListener('beforeunload', unload);
    render();
    run(refresh);
    return () => { active = false; recording = null; container.removeEventListener('click', click); container.removeEventListener('input', input); container.removeEventListener('change', change); container.removeEventListener('keydown', keydown); window.removeEventListener('beforeunload', unload); };
}

function confirmRestore(container, label) {
    return new Promise(resolve => {
        const dialog = document.createElement('dialog'); dialog.className = 'editor-confirm';
        dialog.innerHTML = `<h2>Restore this backup?</h2><p>${esc(label)}</p><p>This replaces player saves and game settings in this source. The current data is backed up first.</p><form method="dialog"><button class="button secondary" value="cancel">Cancel</button><button class="button primary" value="restore">Restore backup</button></form>`;
        dialog.addEventListener('close', () => { resolve(dialog.returnValue === 'restore'); dialog.remove(); }, { once: true });
        container.append(dialog); dialog.showModal();
    });
}
