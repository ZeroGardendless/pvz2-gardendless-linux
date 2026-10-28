import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const config = JSON.parse(await readFile('public/assets/resources/config.json', 'utf8'));
const collections = new Map();
function visit(value) {
    if (!value || typeof value !== 'object') return;
    for (const name of ['PLANTS', 'UPGRADES']) if (Array.isArray(value[name])) collections.set(name, value[name]);
    for (const child of Object.values(value)) visit(child);
}
const packs = new Set();
for (const [index, [name]] of Object.entries(config.paths)) {
    if (!['json/Features/PlantFeatures', 'json/Features/UpgradeFeatures'].includes(name)) continue;
    const pack = Object.entries(config.packs).find(([, ids]) => ids.includes(Number(index)))?.[0];
    assert.ok(pack, `Find the asset pack for ${name}`); packs.add(pack);
}
for (const pack of packs) visit(JSON.parse(await readFile(`public/assets/resources/import/${pack.slice(0, 2)}/${pack}.json`, 'utf8')));
assert.ok(collections.get('PLANTS')?.length); assert.ok(collections.get('UPGRADES')?.length);
const plants = collections.get('PLANTS').map(p => ({ id: p.CODENAME, name: p.NAME.en, legacyId: p.ID, costumes: p.COSTUME || 0 }));
const upgrades = collections.get('UPGRADES').map(p => ({ id: p.CODENAME, name: p.NAME.en, description: p.DESCRIPTION.en, world: p.OBTAINWORLD }));
// The resource index includes unvisited levels; a player's save does not.
const levels = Object.values(config.paths).map(([path]) => path)
    .filter(path => path.startsWith('levels/')).map(path => path.slice(7))
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
assert.ok(levels.includes('egypt1') && levels.includes('modern16'), 'Bundled level catalog is present.');
assert.equal(levels.length, new Set(levels).size, 'Level IDs must be unique.');
// Read each world map's own serialized data, not the other assets sharing its pack.
function expandUuid(value) {
    if (value.length !== 22) return value;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let hex = value.slice(0, 2);
    for (let i = 2; i < value.length; i += 2) {
        const a = alphabet.indexOf(value[i]), b = alphabet.indexOf(value[i + 1]);
        assert.ok(a >= 0 && b >= 0, 'Valid compressed resource UUID');
        hex += (a >> 2).toString(16) + (((a & 3) << 2) | (b >> 4)).toString(16) + (b & 15).toString(16);
    }
    return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
}
const knownLevels = new Set(levels), worldLevels = {}, packCache = new Map();
function collectLevelIds(value, result) {
    if (typeof value === 'string' && knownLevels.has(value)) result.add(value);
    else if (Array.isArray(value)) for (const child of value) collectLevelIds(child, result);
    else if (value && typeof value === 'object') for (const child of Object.values(value)) collectLevelIds(child, result);
}
for (const [index, [path]] of Object.entries(config.paths)) {
    if (!path.startsWith('worldmaps/')) continue;
    const match = path.split('/').at(-1).match(/^(Epic)?(.+?)WORLDMAP$/);
    if (!match || match[2] === 'WorldmapChooser') continue;
    const group = (match[1] ? 'epic_' : '') + match[2].toLowerCase();
    const packed = Object.entries(config.packs).find(([, ids]) => ids.includes(Number(index)));
    const asset = packed?.[0] || expandUuid(config.uuids[Number(index)]);
    if (!packCache.has(asset)) packCache.set(asset, JSON.parse(await readFile(`public/assets/resources/import/${asset.slice(0, 2)}/${asset}.json`, 'utf8')));
    const data = packCache.get(asset);
    const found = new Set();
    collectLevelIds(packed ? data[5][packed[1].indexOf(Number(index))] : data[5], found);
    if (found.size) worldLevels[group] = [...found].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
}
assert.ok(worldLevels.egypt?.includes('egypt1') && worldLevels.epic_egypt?.includes('appease1_0'), 'World map level references match the game.');
const source = '// Generated from the bundled game by scripts/launcher/SaveCatalog.mjs.\n' +
    `export const PLANTS = ${JSON.stringify(plants, null, 2)};\nexport const UPGRADES = ${JSON.stringify(upgrades, null, 2)};\nexport const LEVELS = ${JSON.stringify(levels, null, 2)};\nexport const WORLD_LEVELS = ${JSON.stringify(worldLevels, null, 2)};\n`;
const output = 'public/launcher/SaveCatalog.js';
if (process.argv.includes('--check')) assert.equal(await readFile(output, 'utf8'), source, 'Run npm run launcher:catalog after replacing game assets.');
else await writeFile(output, source);
console.log(`Save catalog: ${plants.length} plants, ${upgrades.length} upgrades, ${levels.length} levels match the bundled game.`);
