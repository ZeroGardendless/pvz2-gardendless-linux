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
const source = '// Generated from the bundled game by scripts/launcher/SaveCatalog.mjs.\n' +
    `export const PLANTS = ${JSON.stringify(plants, null, 2)};\nexport const UPGRADES = ${JSON.stringify(upgrades, null, 2)};\n`;
const output = 'public/launcher/SaveCatalog.js';
if (process.argv.includes('--check')) assert.equal(await readFile(output, 'utf8'), source, 'Run npm run launcher:catalog after replacing game assets.');
else await writeFile(output, source);
console.log(`Save catalog: ${plants.length} plants, ${upgrades.length} upgrades match the bundled game.`);
