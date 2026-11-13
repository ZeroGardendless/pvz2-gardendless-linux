import {createHash} from 'node:crypto';
import {createReadStream} from 'node:fs';
import {readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('public/assets');
const digest=createHash('sha256');
let count=0;
async function walk(directory){
 for(const entry of (await readdir(directory,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name,'en'))){
  const file=path.join(directory,entry.name);
  if(entry.isDirectory())await walk(file);
  else if(entry.isFile()){
   digest.update(path.relative(root,file).replaceAll(path.sep,'/')+'\0');
   for await(const bytes of createReadStream(file))digest.update(bytes);
   digest.update('\0');count++;
  }
 }
}
await walk(root);
const revision=digest.digest('hex');
await writeFile('public/GameAssetRevision.js',`// Generated from the exact bundled game asset bytes.\nexport const GAME_ASSET_REVISION=${JSON.stringify(revision)};\n`);
console.log(`Game asset revision: ${revision.slice(0,16)} (${count} files)`);
