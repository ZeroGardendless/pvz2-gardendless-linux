import {execFileSync} from 'node:child_process';
import {readFile,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {build} from 'esbuild';
import {a as withSettings} from '../../public/gpnext/mods/ConfigurationModSettings.js';

// Reuse the canonical installer with an entirely separate test profile.
const directory=path.resolve('src-tauri/target/aurum/native-probe/data/com.zero.gardendless');
execFileSync(process.execPath,['scripts/checks/Gardenest.mjs'],{
  env:{...process.env,GARDENDLESS_TEST_EXPORT:directory},stdio:'inherit',
});
const file=path.join(directory,'gp-next/configuration-state.json');
const state=JSON.parse(await readFile(file,'utf8'));
const settings=state.desired.modSettings||{version:1,mods:{}};
settings.mods['gardendless.aurum']={schemaVersion:1,values:{neutralVisuals:process.argv.includes('--acceptance')}};
// Keep the mod's settings and the captured settings snapshot aligned.
state.desired=withSettings({...state.desired,revision:state.desired.revision+1},settings);
await writeFile(file,JSON.stringify(state,null,2)+'\n');
await build({entryPoints:['scripts/aurum/LevelFixture.js'],outfile:'src-tauri/target/aurum/LevelFixture.js',bundle:true,format:'iife',target:'es2020'});
console.log('Prepared the disposable Modern Day 16 fixture; real saves and installed mod choices were not edited.');
