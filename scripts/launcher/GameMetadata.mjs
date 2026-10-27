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
assert.ok(version,'Could not find the bundled game InsideVersion; refusing to display a guessed version.');
const metadata={version};
const json=JSON.stringify(metadata,null,2)+'\n';
const js='// Generated from the bundled Cocos Links asset.\n'+`export const GAME_VERSION = ${JSON.stringify(version)};\n`;
for (const [file, content] of [['public/launcher/GameMetadata.json',json],['public/launcher/GameMetadata.js',js]]) {
  if (process.argv.includes('--check')) assert.equal(await readFile(file,'utf8'),content,'Run node scripts/launcher/GameMetadata.mjs after replacing game assets.');
  else await writeFile(file,content);
}
console.log(`Bundled game version: ${version}`);
