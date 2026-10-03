import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { DEFAULT_KEYBINDS, KEY_CODES, MAX_JSON_BYTES, parseEditorJson, validatePlayers, validateKeybinds, importPlayers, importKeybinds, eventKeyCode, sharedBindings } from '../../public/launcher/Editors.js';

const players = [
    { name: 'Regular garden', version: '0.14.4', coin: 200, gem: 25, worldkey: 2, ticket: 3, sprout: 4, plantProps: { peashooter: { progress: 2 } }, customMod: { state: [1, 'retained'] } },
    { name: 'Experiment', coin: 10, gem: 1, unknownFutureField: { value: true } },
];
const original = JSON.stringify(players);
assert.deepEqual(validatePlayers(players), players);
assert.throws(() => validatePlayers({ name: 'Player' }), /between 1 and 100/);
assert.throws(() => validatePlayers([]), /between 1 and 100/);
assert.throws(() => validatePlayers([{ name: 'Player', coin: -1 }]), /whole number/);
assert.throws(() => validatePlayers([{ name: 'Player', coin: '42' }]), /whole number/);
assert.throws(() => validatePlayers([{ name: 'Player', coin: 1.2 }]), /whole number/);
assert.throws(() => validatePlayers([{ name: 'Player', coin: Number.MAX_SAFE_INTEGER + 1 }]), /whole number/);
assert.throws(() => validatePlayers([{ gem: 12 }]), /name/);

const single = importPlayers({ ...players[0], coin: 999 }, players, 0);
assert.equal(single[0].coin, 999);
assert.deepEqual(single[0].customMod, players[0].customMod);
assert.deepEqual(single[1], players[1]);
single[0].customMod.state.push('changed copy');
assert.equal(JSON.stringify(players), original, 'Editing a draft must not mutate its original or other players.');
assert.deepEqual(importPlayers(players), players);
assert.deepEqual(importPlayers(players[0]), [players[0]]);

const settings = { MusicVolume: 0.4, SFXVolume: 0.7, PlayerIndex: 1, KeyBinds: { Game_Pause: 'SPACE', CustomModAction: 'F2', __KeyCodeList__: 'https://docs.cocos.com/creator/3.8/api/zh/enumeration/KeyCode' }, FutureFeature: { enabled: true } };
const keybindImport = importKeybinds({ Game_Pause: 'KEY_P' }, settings);
assert.equal(keybindImport.KeyBinds.Game_Pause, 'KEY_P');
assert.equal(keybindImport.KeyBinds.CustomModAction, 'F2');
assert.equal(keybindImport.KeyBinds.__KeyCodeList__, settings.KeyBinds.__KeyCodeList__);
assert.equal(keybindImport.MusicVolume, 0.4);
assert.equal(keybindImport.PlayerIndex, 1);
assert.deepEqual(keybindImport.FutureFeature, settings.FutureFeature);
assert.equal(settings.KeyBinds.Game_Pause, 'SPACE');
const importedSettings = importKeybinds({ MusicVolume: 0, KeyBinds: { Game_Shovel: 'KEY_Z' } }, settings);
assert.equal(importedSettings.MusicVolume, 0.4, 'Importing keybinds must not import unrelated game settings.');
assert.equal(importedSettings.KeyBinds.Game_Shovel, 'KEY_Z');
assert.throws(() => importKeybinds({ unrelated: 'file' }), /no recognized/);
assert.throws(() => validateKeybinds({ Game_Pause: 'Ctrl+P' }), /unsupported key/);
assert.throws(() => validateKeybinds({ Game_Pause: 32 }), /unsupported key/);
assert.throws(() => validateKeybinds([]), /JSON object/);

for (const key of ['__proto__', 'constructor', 'prototype'])
    assert.throws(() => parseEditorJson(`{"nested":{"${key}":{"polluted":true}}}`), /Unsupported JSON property/);
assert.equal({}.polluted, undefined);
assert.throws(() => parseEditorJson('['.repeat(66) + '0' + ']'.repeat(66)), /deeply/);
assert.throws(() => parseEditorJson('{"coin":1e999}'), /finite/);
assert.throws(() => parseEditorJson(' '.repeat(MAX_JSON_BYTES + 1)), /8 MiB/);
assert.throws(() => parseEditorJson('"' + '🌻'.repeat(MAX_JSON_BYTES / 4) + '"'), /8 MiB/, 'Limit is bytes, not JavaScript string length.');
assert.deepEqual(parseEditorJson(original), players);

assert.equal(eventKeyCode({ code: 'KeyP' }), 'KEY_P');
assert.equal(eventKeyCode({ code: 'Digit7' }), 'DIGIT_7');
assert.equal(eventKeyCode({ code: 'Numpad7' }), 'NUM_7');
assert.equal(eventKeyCode({ code: 'NumpadEnter' }), 'NUM_ENTER');
assert.equal(eventKeyCode({ code: 'ControlRight' }), 'CTRL_RIGHT');
assert.equal(eventKeyCode({ code: 'Backquote' }), 'BACK_QUOTE');
assert.equal(eventKeyCode({ code: 'F12' }), 'F12');
assert.equal(eventKeyCode({ code: 'MetaLeft' }), null);
assert.equal(eventKeyCode({ code: 'F99' }), null);
assert.ok(sharedBindings(DEFAULT_KEYBINDS).some(group => group.includes('Game_BananaLauncher') && group.includes('Game_MissileToe')));
assert.ok(sharedBindings(DEFAULT_KEYBINDS).every(group => group.every(action => action.split('_')[0] === group[0].split('_')[0])), 'Bindings in different game modes are not conflicts.');

// The official online editor targets an older release; verify our defaults against the bundled game.
const game = await readFile('public/assets/main/index.js', 'utf8');
const defaultsSource = game.match(/\.DefaultKeyBinds=\{([^}]+)\}/)?.[1];
assert.ok(defaultsSource, 'Locate actual game DefaultKeyBinds after replacing assets.');
const actualDefaults = Object.fromEntries([...defaultsSource.matchAll(/(\w+):"([A-Z_0-9]+)"/g)].map(match => [match[1], match[2]]));
assert.deepEqual(DEFAULT_KEYBINDS, actualDefaults, 'Update EditorsData.js if the bundled game changes keybinding defaults.');
assert.equal(KEY_CODES.length, new Set(KEY_CODES).size);
for (const code of Object.values(DEFAULT_KEYBINDS)) assert.ok(KEY_CODES.includes(code), `${code} must be an available Cocos key.`);
console.log('Passed: editor JSON bounds/prototype protection, currency validation, multi-player preservation, settings isolation, key capture, shared bindings, and all current game defaults.');

const { newPlayer, validateProgress, setProgressValue, prepareCollection, setPlantUnlocked, unlockAllPlants, endlessPath, PLANTS, UPGRADES } = await import('../../public/launcher/SaveProgress.js');
const fresh = newPlayer();
validatePlayers([fresh]);
assert.ok(PLANTS.length >= 200, 'Plant catalog reflects the bundled game.');
assert.equal(UPGRADES.length, 14);
const progressSave = { ...fresh, customMod: { secret: [1, 2] } };
progressSave.plantProps.peashooter = { progress: 1, modField: 'kept' };
setPlantUnlocked(progressSave, 'peashooter', true);
assert.deepEqual(progressSave.plantProps.peashooter, { progress: 2, tutorialLevel: 0, costume: -1, costumes: [], boost: 0, medal: false, modField: 'kept' });
setPlantUnlocked(progressSave, 'peashooter', false);
assert.equal(progressSave.plantProps.peashooter.progress, 0);
assert.equal(unlockAllPlants(progressSave), PLANTS.length);
assert.equal(Object.keys(progressSave.plantProps).length, PLANTS.length);
assert.equal(progressSave.plantProps.peashooter.modField, 'kept');
setProgressValue(progressSave, ['plantProps', 'peashooter', 'progress'], 2);
setProgressValue(progressSave, ['plantProps', 'peashooter', 'medal'], true);
assert.deepEqual(progressSave.customMod, { secret: [1, 2] });
validateProgress(progressSave);
setProgressValue(progressSave, ['plantProps', 'peashooter', 'costumes'], [0, 2]);
validateProgress(progressSave);
assert.throws(() => setProgressValue(progressSave, ['plantProps', '__proto__', 'polluted'], true), /Invalid/);
assert.throws(() => validateProgress({ plantProps: { pea: { progress: 3 } } }), /status/);
assert.throws(() => validateProgress({ plantProps: { pea: { costumes: [-1] } } }), /costume IDs/);
assert.throws(() => validateProgress({ arcade_plant_decoding: { max_base_count: 2 } }), /base count/);
assert.throws(() => validateProgress({ features: { feature_coins: 1 } }), /on or off/);
const legacy = { plantProps: {}, obtainedPlants: [{ plantID: 0, progress: 1, modField: true }], upgradeProps: { 0: { progress: 2, enabled: false, extra: 8 }, 999: { progress: 1 } } };
prepareCollection(legacy, 'plantProps');
assert.equal(legacy.plantProps.peashooter.progress, 1);
assert.equal(legacy.plantProps.peashooter.modField, true);
assert.deepEqual(legacy.obtainedPlants, []);
prepareCollection(legacy, 'player_upgrades');
assert.equal(legacy.player_upgrades[UPGRADES[0].id].extra, 8);
assert.deepEqual(legacy.upgradeProps, { 999: { progress: 1 } });
const oldWorld = { worldProps: { 1: { unlocked: true, endlessProps: { level: 8, plants: ['sunflower'], other: 4 } } } };
setProgressValue(oldWorld, endlessPath(oldWorld, 1), 42);
assert.deepEqual(oldWorld.worldProps[1].endlessProps, { level: 42, plants: ['sunflower'], other: 4 });
const modernWorld = { player_dangerroom: { egypt: { level: 12, plants: ['peashooter'], mower: [false] } } };
setProgressValue(modernWorld, endlessPath(modernWorld, 1), 64);
assert.deepEqual(modernWorld.player_dangerroom.egypt, { level: 64, plants: ['peashooter'], mower: [false] });
console.log('Passed: plant/world/upgrade edits, modern and legacy endless saves, unknown-field preservation, progression validation, and unsafe-path rejection.');
