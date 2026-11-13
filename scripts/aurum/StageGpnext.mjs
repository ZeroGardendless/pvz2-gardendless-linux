// Prepare an isolated upstream tree for review. Never overwrites the live overlay.
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {transform} from 'esbuild';
const root=path.resolve(process.argv[2] || '/home/zero/gardendless-reference/update-20261111');
const input=path.join(root,'extracted/assets'),output=path.join(root,'gpnext-stage');
const old=JSON.parse(await readFile('docs/aurum/ModuleMatchCandidates.json','utf8'));
const manual={
 'build-identity':'core/BuildIdentity.js','frame-settings':'runtime/FrameSettings.js',
 'drpc':'platform/Presence.js','pack-zip-worker':'core/NestPackWorker.js',
 'tab-tools':'ui/tabs/Tools.js','tab-preferences':'ui/tabs/Preferences.js','local-pack-sync':'mods/LocalPackSync.js',
 'pending-mod-selection':'mods/PendingModSelection.js','mod-requirements':'mods/ModRequirements.js'
};
const stem=name=>name.replace(/-[a-zA-Z0-9_-]{8}\.js$/, '');
const mapping=new Map();
const review=[];
for(const name of await readdir(input)){
 if(!name.endsWith('.js'))continue;
 const base=stem(name);
 const matched=old.proposals.find(item=>item.upstream===name) || old.proposals.find(item=>stem(item.upstream)===base);
 let target=manual[base];
 if(!target&&matched?.candidates[0].score>=0.45)target=matched.candidates[0].file;
 if(!target)throw new Error(`Unmapped upstream module ${name}; review before staging.`);
 if([...mapping.values()].includes(target))throw new Error(`Duplicate mapping for ${target}`);
 mapping.set(name,target);
 review.push({upstream:name,target,decision:'staged only; integration and adapter review pending'});
}
await mkdir(output,{recursive:true});
for(const [name,target] of mapping){
 let text=await readFile(path.join(input,name),'utf8');
 // Imports and Vite dependency strings both carry the upstream module filenames.
 text=text.replace(/(["'`])(?:\.\/)?([^"'`]+\.js)\1/g,(whole,quote,dependency)=>{
  if(dependency.startsWith('assets/') && mapping.has(dependency.slice(7)))return quote+'gpnext/'+mapping.get(dependency.slice(7))+quote;
  if(!mapping.has(dependency))return whole;
  let relative=path.relative(path.dirname(target),mapping.get(dependency)).split(path.sep).join('/');
  if(!relative.startsWith('.'))relative='./'+relative;
  return quote+relative+quote;
 });
 const formatted=await transform(text,{loader:'js',format:'esm',minify:false,target:'esnext'});
 const file=path.join(output,target);await mkdir(path.dirname(file),{recursive:true});await writeFile(file,formatted.code);
}
await writeFile(path.join(root,'gpnext-stage-map.json'),JSON.stringify(review,null,2)+'\n');
console.log(`Staged ${mapping.size} upstream GP-Next modules outside the checkout. Live overlay was not replaced.`);
