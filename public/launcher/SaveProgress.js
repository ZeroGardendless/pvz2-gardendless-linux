import { escapeHtml as esc } from './Store.js';
import { PLANTS, UPGRADES } from './SaveCatalog.js';
export { PLANTS, UPGRADES } from './SaveCatalog.js';

export const WORLDS = [
    ['chooser', 'World Chooser'], ['egypt', 'Ancient Egypt'], ['pirate', 'Pirate Seas'],
    ['cowboy', 'Wild West'], ['future', 'Far Future'], ['dark', 'Dark Ages'],
    ['beach', 'Big Wave Beach'], ['iceage', 'Frostbite Caves'], ['lostcity', 'Lost City'],
    ['epic', 'Epic Levels'], ['eighties', 'Neon Mixtape Tour'], ['dino', 'Jurassic Marsh'],
    ['modern', 'Modern Day'], ['kongfu', 'Kongfu Temple'],
    ['epic_egypt', 'Epic Egypt'], ['epic_pirate', 'Epic Pirate Seas'], ['epic_cowboy', 'Epic Wild West'],
    ['epic_future', 'Epic Far Future'], ['epic_dark', 'Epic Dark Ages'], ['epic_beach', 'Epic Big Wave Beach'],
    ['epic_iceage', 'Epic Frostbite Caves'], ['epic_lostcity', 'Epic Lost City'], ['epic_eighties', 'Epic Neon Mixtape Tour'],
    ['epic_dino', 'Epic Jurassic Marsh'], ['epic_modern', 'Epic Modern Day'], ['epic_kongfu', 'Epic Kongfu Temple'],
    ['sky', 'Aerial Fortress'], ['epic_sky', 'Epic Aerial Fortress'],
];
export const FEATURES = {
    feature_zengarden: 'Zen Garden', feature_almanac: 'Almanac', feature_coins: 'Coins',
    feature_worldmap: 'World Map', feature_worldkeys: 'World Keys', feature_plantfood: 'Plant Food',
    feature_shovel: 'Shovel', feature_powerup: 'Power-ups', feature_store: 'Store',
    feature_plantfood_purchase: 'Plant Food Purchase', feature_lod: 'Level of the Day',
};
export const TUTORIALS = {
    plantfood: 'Plant Food', worldmap: 'World Map', worldkey: 'World Keys',
    almanac_open: 'Unlock Almanac', almanac_intro: 'Almanac Introduction',
    zengarden_open: 'Unlock Zen Garden', zengarden_intro: 'Zen Garden Introduction',
    store_open: 'Unlock Store', store_intro: 'Store Introduction',
    premium_light_up: 'Highlight Premium Plants', premium_bring_out: 'Premium Plant Selection', premium_unlock: 'Unlock Premium Plants',
};
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const unsafe = new Set(['__proto__', 'prototype', 'constructor']);
const clone = value => JSON.parse(JSON.stringify(value));
export const newPlant = () => ({ progress: 2, tutorialLevel: 0, costume: -1, costumes: [], boost: 0, medal: false });
export function setPlantUnlocked(player, id, unlocked) {
    if (!PLANTS.some(plant => plant.id === id) && !Object.hasOwn(player.plantProps || {}, id)) throw new Error('Unknown plant.');
    const plants = prepareCollection(player, 'plantProps');
    if (unlocked) plants[id] = { ...newPlant(), ...plants[id], progress: 2 };
    else if (plants[id]) plants[id].progress = 0;
}
export function unlockAllPlants(player) {
    for (const plant of PLANTS) setPlantUnlocked(player, plant.id, true);
    return PLANTS.length;
}
export const newEndless = () => ({ level: 1, plants: [], plants_choice: null, plantfood: 0, mower: [true, true, true, true, true], plantChosen: false });
export function newPlayer() {
    return {
        name: 'New Player', version: '0.14.4', forceLevel: 'tutorial1', coin: 0, gem: 0, ticket: 0, sprout: 0, worldkey: 0,
        time: 0, difficulty: 3, date: { date: 1, month: 1, year: 1, hour: 0, minute: 0, second: 0, plantCostumeToday: [] },
        plantProps: {}, zombieProps: {}, player_trophies: {}, levelProps: {}, cardDecks: [], memoryPlantChoose: [],
        zengarden: { sprout: 0, plantsInMain: [], plantsInMushroom: [], plantsInBeach: [], plantsInNight: [], plantInCart: null },
        arcade_plant_decoding: { played_today: false, gem_today: 0, max_base_count: 5, max_code_count: 4 }, yeti_spawned_today: false,
        worldProps: { ...Object.fromEntries(WORLDS.map((_, i) => [i, { unlocked: i === 1, viewed: false, wmx: 0 }])), currentWM: 0, worldChooserPos: 1 },
        player_dangerroom: Object.fromEntries(WORLDS.map(([id]) => [id, newEndless()])),
        player_dangerroom_minigame: Object.fromEntries(WORLDS.map(([id]) => [id, { level: 1 }])),
        player_upgrades: Object.fromEntries(UPGRADES.map(({ id }) => [id, { progress: 0, enabled: true }])),
        tutorial: Object.fromEntries(Object.keys(TUTORIALS).map(key => [key, false])),
        features: Object.fromEntries(Object.keys(FEATURES).map(key => [key, ['feature_coins', 'feature_worldmap', 'feature_plantfood', 'feature_shovel'].includes(key)])),
    };
}

/** Preserve mod fields and untouched legacy data. Migrate a collection only when editing it. */
export function prepareCollection(player, collection) {
    if (player[collection] != null && !object(player[collection])) throw new Error(`${collection} must be a JSON object.`);
    player[collection] ||= {};
    if (collection === 'player_upgrades') {
        for (const [index, upgrade] of UPGRADES.entries()) {
            const legacy = player.upgradeProps?.[index] || player.obtainedUpgrades?.find(item => item.upgradeID === index);
            if (legacy && !player[collection][upgrade.id]) player[collection][upgrade.id] = clone(legacy);
        }
        // Leave unknown legacy entries intact; remove only migrated entries which the game would reapply.
        if (object(player.upgradeProps)) for (const index of UPGRADES.keys()) delete player.upgradeProps[index];
        if (Array.isArray(player.obtainedUpgrades)) player.obtainedUpgrades = player.obtainedUpgrades.filter(item => !UPGRADES[item.upgradeID]);
    }
    if (collection === 'plantProps' && Array.isArray(player.obtainedPlants)) {
        const remaining = [];
        for (const entry of player.obtainedPlants) {
            const plant = PLANTS.find(item => item.legacyId === entry.plantID);
            if (plant) player.plantProps[plant.id] ||= { ...newPlant(), ...clone(entry) };
            else remaining.push(entry);
        }
        player.obtainedPlants = remaining;
    }
    if (collection === 'worldProps' && Array.isArray(player.worldProgress)) {
        const remaining = [];
        for (const entry of player.worldProgress) {
            if (WORLDS[entry.worldID]) player.worldProps[entry.worldID] ||= clone(entry);
            else remaining.push(entry);
        }
        player.worldProgress = remaining;
    }
    return player[collection];
}
export function setProgressValue(player, path, value) {
    if (!Array.isArray(path) || !path.length || path.some(part => typeof part !== 'string' || unsafe.has(part))) throw new Error('Invalid save field.');
    let target = player;
    if (path.length > 1) prepareCollection(player, path[0]);
    for (const part of path.slice(0, -1)) {
        if (target[part] != null && !object(target[part])) throw new Error('This save field is not an object. Use Advanced JSON to inspect it.');
        target = target[part] ||= {};
    }
    target[path.at(-1)] = value;
}
export function plantProperties(player, id) {
    return player.plantProps?.[id] || player.obtainedPlants?.find(item => item.plantID === PLANTS.find(plant => plant.id === id)?.legacyId);
}
export function worldProperties(player, index) {
    return player.worldProps?.[index] || player.worldProgress?.find(item => item.worldID === index) || {};
}
export function upgradeProperties(player, id) {
    const index = UPGRADES.findIndex(upgrade => upgrade.id === id);
    return player.player_upgrades?.[id] || player.upgradeProps?.[index] || player.obtainedUpgrades?.find(item => item.upgradeID === index) || {};
}
export function endlessPath(player, index) {
    const code = WORLDS[index][0];
    // Old saves store this inside worldProps. Modern games move it into player_dangerroom.
    return player.player_dangerroom?.[code] ? ['player_dangerroom', code, 'level'] :
        worldProperties(player, index).endlessProps ? ['worldProps', String(index), 'endlessProps', 'level'] : ['player_dangerroom', code, 'level'];
}
export function progressValue(player, path) { return path.reduce((value, part) => value?.[part], player); }
export function validateProgress(player) {
    const integer = (value, label, min = 0, max = Number.MAX_SAFE_INTEGER) => {
        if (value !== undefined && (!Number.isSafeInteger(value) || value < min || value > max)) throw new Error(`${label} must be a whole number from ${min} to ${max}.`);
    };
    const bool = (value, label) => { if (value !== undefined && typeof value !== 'boolean') throw new Error(`${label} must be on or off.`); };
    for (const key of ['plantProps', 'player_upgrades', 'worldProps', 'player_dangerroom', 'arcade_plant_decoding', 'features', 'tutorial']) {
        if (player[key] != null && !object(player[key])) throw new Error(`${key} must be a JSON object.`);
    }
    for (const [id, plant] of Object.entries(player.plantProps || {})) {
        if (!object(plant)) throw new Error(`Plant ${id} must be an object.`);
        integer(plant.progress, `${id} status`, 0, 2); integer(plant.tutorialLevel, `${id} tutorial level`); integer(plant.boost, `${id} boost`);
        integer(plant.costume, `${id} costume`, -1); bool(plant.medal, `${id} medal`);
        if (plant.costumes !== undefined && (!Array.isArray(plant.costumes) || plant.costumes.some(value => !Number.isSafeInteger(value) || value < 0))) throw new Error(`${id} costumes must be a list of non-negative costume IDs.`);
    }
    for (const [id, upgrade] of Object.entries(player.player_upgrades || {})) {
        if (!object(upgrade)) throw new Error(`Upgrade ${id} must be an object.`);
        integer(upgrade.progress, `${id} status`, 0, 2); bool(upgrade.enabled, `${id} enabled`);
    }
    WORLDS.forEach((_, index) => {
        const world = worldProperties(player, index);
        bool(world.unlocked, 'World unlocked'); integer(progressValue(player, endlessPath(player, index)), 'Endless level', 1);
    });
    const daily = player.arcade_plant_decoding || {};
    bool(daily.played_today, 'Decoding played today'); integer(daily.gem_today, 'Daily gems');
    integer(daily.max_base_count, 'Decoding base count', 3, 10); integer(daily.max_code_count, 'Decoding code count', 3, 10);
    bool(player.yeti_spawned_today, 'Yeti spawned today');
    for (const [section, keys] of [['features', FEATURES], ['tutorial', TUTORIALS]]) for (const key of Object.keys(keys)) bool(player[section]?.[key], keys[key]);
    return player;
}

const action = (id, text, attrs = '') => `<button type="button" class="button secondary" data-progress-action="${id}" ${attrs}>${text}</button>`;
const pathAttr = path => `data-progress-path="${esc(JSON.stringify(path))}"`;
const number = (label, path, value, min = 0, max = Number.MAX_SAFE_INTEGER) => `<label class="field">${esc(label)}<input type="number" min="${min}" max="${max}" step="1" ${pathAttr(path)} data-progress-type="number" value="${esc(value ?? min)}"></label>`;
const toggle = (label, path, value, type = 'boolean') => `<label class="toggle-row"><span><strong>${esc(label)}</strong></span><input type="checkbox" ${pathAttr(path)} data-progress-type="${type}" ${value ? 'checked' : ''}><span class="switch" aria-hidden="true"></span></label>`;
const status = (path, value, labels = ['Locked', 'Available to unlock', 'Unlocked']) => `<label class="field">Status<select ${pathAttr(path)} data-progress-type="number">${labels.map((label, index) => `<option value="${index}" ${index === (value ?? 0) ? 'selected' : ''}>${label}</option>`).join('')}</select></label>`;

export function renderProgress(player, state, disabled) {
    state.progressPage ||= 'plants'; state.plantId ||= 'peashooter'; state.progressQuery ||= '';
    const tabs = { plants: 'Plants', worlds: 'Worlds', upgrades: 'Upgrades', daily: 'Daily state', features: 'Features', tutorials: 'Tutorials' };
    const query = state.progressQuery.trim().toLowerCase();
    let body = '';
    if (state.progressPage === 'plants') {
        const catalog = [...PLANTS, ...Object.keys(player.plantProps || {}).filter(id => !PLANTS.some(plant => plant.id === id)).map(id => ({ id, name: id }))];
        const choices = catalog.filter(plant => `${plant.name} ${plant.id}`.toLowerCase().includes(query));
        const plant = catalog.find(plant => plant.id === state.plantId); const props = plantProperties(player, state.plantId);
        const unlocked = catalog.filter(item => plantProperties(player, item.id)?.progress === 2).length;
        body = `<div class="plant-toolbar"><label class="field">Search plants<input type="search" data-progress-search value="${esc(state.progressQuery)}" placeholder="Name or codename"></label><span class="badge green">${unlocked} / ${catalog.length} unlocked</span>${action('unlock-all-plants', 'Unlock all plants')}</div><p class="muted">Select a card for details. Use its switch to unlock or lock it in this draft; Apply creates a backup before saving.</p><div class="plant-workspace"><div class="plant-list" role="group" aria-label="Plants">${choices.map(item => { const owned = plantProperties(player, item.id)?.progress === 2; return `<article class="plant-card ${item.id === state.plantId ? 'active' : ''} ${owned ? 'unlocked' : ''}"><button type="button" class="plant-choice" data-progress-action="select-plant" data-plant="${esc(item.id)}" aria-pressed="${item.id === state.plantId}"><span class="plant-avatar" aria-hidden="true">${esc(item.name.charAt(0))}</span><span class="plant-card-copy"><strong>${esc(item.name)}</strong><small>${esc(item.id)}</small></span></button><label class="plant-card-toggle" title="${owned ? 'Lock' : 'Unlock'} ${esc(item.name)}"><input type="checkbox" data-progress-plant="${esc(item.id)}" ${owned ? 'checked' : ''} aria-label="Unlock ${esc(item.name)}"><span class="switch" aria-hidden="true"></span></label></article>`; }).join('') || '<p class="muted">No matching plants.</p>'}</div><div class="plant-detail"><h3>${esc(plant?.name || state.plantId)}</h3><p class="muted">${esc(state.plantId)}</p>${props ? `${status(['plantProps', state.plantId, 'progress'], props.progress)}${toggle('Boosted', ['plantProps', state.plantId, 'boost'], props.boost, 'boost')}${toggle('Medal earned', ['plantProps', state.plantId, 'medal'], props.medal)}<div class="form-pair">${number('Tutorial level', ['plantProps', state.plantId, 'tutorialLevel'], props.tutorialLevel)}${number('Active costume (−1: default)', ['plantProps', state.plantId, 'costume'], props.costume ?? -1, -1)}</div><label class="field">Owned costume IDs<input ${pathAttr(['plantProps', state.plantId, 'costumes'])} data-progress-type="ids" value="${esc((props.costumes || []).join(', '))}" placeholder="0, 1, 2"></label><p class="muted">Costume IDs depend on the plant and installed mods.</p>${action('remove-plant', 'Remove from save')}` : `<p>This plant has no saved entry yet.</p>${action('add-plant', 'Add unlocked plant')}`}<a data-editor-almanac class="button quiet" href="https://pvzge.com/en/almanac/" target="_blank" rel="noopener noreferrer">Open online almanac ↗</a></div></div>`;
    } else if (state.progressPage === 'worlds') {
        body = `<p class="muted">Endless progress uses the format found in this save. Other run details stay unchanged.</p><div class="progress-grid">${WORLDS.map(([, name], index) => `<article class="progress-card">${toggle(name, ['worldProps', String(index), 'unlocked'], worldProperties(player, index).unlocked)}${number('Endless level', endlessPath(player, index), progressValue(player, endlessPath(player, index)) ?? worldProperties(player, index).endlessProps?.level ?? 1, 1)}</article>`).join('')}</div>`;
    } else if (state.progressPage === 'upgrades') {
        const catalog = [...UPGRADES, ...Object.keys(player.player_upgrades || {}).filter(id => !UPGRADES.some(upgrade => upgrade.id === id)).map(id => ({ id, name: id, description: 'Mod upgrade' }))];
        body = `<label class="field">Search upgrades<input type="search" data-progress-search value="${esc(state.progressQuery)}" placeholder="Name, description, or world"></label><div class="progress-grid">${catalog.filter(item => `${item.id} ${item.name} ${item.description} ${item.world}`.toLowerCase().includes(query)).map(item => { const props = upgradeProperties(player, item.id); return `<article class="progress-card"><h3>${esc(item.name)}</h3><p class="muted">${esc(item.description)}</p>${status(['player_upgrades', item.id, 'progress'], props.progress, ['Locked', 'Pending collection', 'Obtained'])}${toggle('Enabled', ['player_upgrades', item.id, 'enabled'], props.enabled !== false)}</article>`; }).join('')}</div>`;
    } else if (state.progressPage === 'daily') {
        const path = key => ['arcade_plant_decoding', key]; const daily = player.arcade_plant_decoding || {};
        body = `<h3>Plant Decoding</h3>${toggle('Played today', path('played_today'), daily.played_today)}<div class="editor-fields">${number('Gems earned today', path('gem_today'), daily.gem_today)}${number('Base count', path('max_base_count'), daily.max_base_count ?? 5, 3, 10)}${number('Code count', path('max_code_count'), daily.max_code_count ?? 4, 3, 10)}</div>${action('reset-daily', "Reset today's decoding")}<p class="muted">Resets play and reward records, keeping difficulty limits.</p>${toggle('Yeti spawned today', ['yeti_spawned_today'], player.yeti_spawned_today)}`;
    } else {
        const section = state.progressPage === 'tutorials' ? 'tutorial' : 'features';
        const labels = section === 'tutorial' ? TUTORIALS : FEATURES;
        body = `${section === 'tutorial' ? action('complete-tutorials', 'Complete all tutorials') : ''}<div class="progress-grid">${Object.entries(labels).map(([key, label]) => toggle(label, [section, key], player[section]?.[key])).join('')}</div>`;
    }
    return `<section class="panel save-progress"><div class="editor-heading"><div><h2>Progression</h2><p class="muted">Changes affect only the selected player. Apply or export when finished.</p></div></div><div class="progress-tabs" role="group" aria-label="Progression categories">${Object.entries(tabs).map(([id, label]) => action('page', label, `data-progress-page="${id}" aria-pressed="${state.progressPage === id}"`)).join('')}</div><fieldset class="progress-fields" ${disabled ? 'disabled' : ''}>${body}</fieldset></section>`;
}
