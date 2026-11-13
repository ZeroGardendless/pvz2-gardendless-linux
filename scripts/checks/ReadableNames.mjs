import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL,fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=await mkdtemp(path.join(tmpdir(),'aurum-names-'));
try{
 const modules=path.join(root,'public/gpnext');await mkdir(modules,{recursive:true});
 await writeFile(path.join(root,'package.json'),'{"type":"module"}');
 await writeFile(path.join(modules,'Function.js'),'export function calculate(values){return values.length;}');
 await writeFile(path.join(modules,'Caller.js'),'import {calculate as aliased} from "./Function.js"; export function run({calculate=7}={}) {return aliased([1,2])+calculate;}');
 const result=spawnSync(process.execPath,[fileURLToPath(new URL('../gpnext/NameExports.mjs',import.meta.url))],{cwd:root,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
 const module=await import(pathToFileURL(path.join(modules,'Caller.js')).href);
 assert.equal(module.run(),9,'Readable naming cannot capture an imported function inside a parameter scope');
 console.log('Readable names: imported function/parameter capture regression passed.');
}finally{await rm(root,{recursive:true,force:true});}
