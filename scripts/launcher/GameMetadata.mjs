import {readFile, writeFile, readdir} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

// Cocos packs the splash screen's Links JSON; read its actual InsideVersion,
// rather than requiring a launcher-source edit after each asset replacement.
const root='public/assets/resources/import';
let version;
function visit(value) {
  if (!value || typeof value !== 'object') return;
  if (typeof value.InsideVersion === 'string' && /^\d+\.\d+(?:\.\d+)*(?:[-+][\w.-]+)?$/.test(value.InsideVersion)) {
    if (version && version !== value.InsideVersion) throw new Error('Conflicting bundled game versions');
    version=value.InsideVersion;
  }
  for (const child of Object.values(value)) visit(child);
}
for (const directory of await readdir(root,{withFileTypes:true})) {
  if (!directory.isDirectory()) continue;
  for (const file of await readdir(path.join(root,directory.name))) {
    if (file.endsWith('.json')) visit(JSON.parse(await readFile(path.join(root,directory.name,file),'utf8')));
  }
}
if (!version) {
  // 0.16.15 moved the version out of the packed Links asset into app-info.json.
  const game = await readFile('public/assets/main/index.js', 'utf8');
  assert.ok(game.includes('getVersionInfo'), 'Game has no supported version metadata reference.');
  const platform = await readFile('public/game-platform.js', 'utf8');
  assert.ok(platform.includes('app-info.json'), 'Platform does not reference official version metadata.');
  const info = JSON.parse(await readFile('public/app-info.json', 'utf8'));
  assert.match(info.Version, /^\d+\.\d+(?:\.\d+)*(?:[-+][\w.-]+)?$/, 'Invalid official app-info version');
  version = info.Version;
}
assert.ok(version,'Could not find the bundled game InsideVersion; refusing to display a guessed version.');
const metadata={version};
const json=JSON.stringify(metadata,null,2)+'\n';
const js='// Generated from bundled game version metadata.\n'+`export const GAME_VERSION = ${JSON.stringify(version)};\n`;
for (const [file, content] of [['public/launcher/GameMetadata.json',json],['public/launcher/GameMetadata.js',js]]) {
  if (process.argv.includes('--check')) assert.equal(await readFile(file,'utf8'),content,'Run node scripts/launcher/GameMetadata.mjs after replacing game assets.');
  else await writeFile(file,content);
}
console.log(`Bundled game version: ${version}`);
