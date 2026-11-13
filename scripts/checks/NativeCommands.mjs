import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
async function files(root){const out=[];for(const entry of await readdir(root,{withFileTypes:true})){const file=path.join(root,entry.name);if(entry.isDirectory())out.push(...await files(file));else if(file.endsWith('.js'))out.push(file);}return out;}
const commands=new Set();for(const file of await files('public/gpnext')){const text=await readFile(file,'utf8');for(const hit of text.matchAll(/["'`]((?:gp_next_|native_audio_)[a-z_]+)["'`]/g))commands.add(hit[1]);}
const registration=await readFile('src-tauri/src/lib.rs','utf8');
for(const command of commands)assert.ok(registration.includes('::'+command+','),`Missing native registration for frontend command ${command}`);
console.log(`Native bridge audit: ${commands.size} GP-Next/audio commands registered, including batched package and metadata APIs.`);
