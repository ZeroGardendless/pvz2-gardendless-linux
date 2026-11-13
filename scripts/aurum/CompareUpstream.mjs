import ts from 'typescript';
import path from 'node:path';
import {readFile,readdir,writeFile} from 'node:fs/promises';
const reference=process.argv[2] || '/home/zero/gardendless-reference/update-20261027/extracted/assets';
function fingerprint(text){
 const source=ts.createSourceFile('Module.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),strings=new Set();
 function visit(node){
  if((ts.isStringLiteral(node)||ts.isNoSubstitutionTemplateLiteral(node))&&node.text.length>=4&&!/\.js(?:$|\?)/.test(node.text)&&!node.text.includes('gpnext/'))strings.add(node.text);
  ts.forEachChild(node,visit);
 }
 visit(source);return strings;
}
async function files(root,prefix=''){
 const result=[];
 for(const entry of await readdir(root,{withFileTypes:true})){
  const relative=path.join(prefix,entry.name);
  if(entry.isDirectory())result.push(...await files(path.join(root,entry.name),relative));
  else if(entry.name.endsWith('.js'))result.push(relative);
 }
 return result;
}
const local=await Promise.all((await files('public/gpnext')).map(async name=>({name,strings:fingerprint(await readFile(path.join('public/gpnext',name),'utf8'))})));
const proposals=[];
for(const name of await files(reference)){
 const strings=fingerprint(await readFile(path.join(reference,name),'utf8'));
 const candidates=local.map(file=>{
  const intersection=[...strings].filter(value=>file.strings.has(value)).length;
  return {file:file.name,intersection,score:intersection/(strings.size+file.strings.size-intersection||1)};
 }).sort((a,b)=>b.score-a.score);
 proposals.push({upstream:name,stringCount:strings.size,candidates:candidates.slice(0,3),reviewRequired:true});
}
await writeFile('docs/aurum/ModuleMatchCandidates.json',JSON.stringify({reference,note:'Review proposals only; never use uncertain matches to overwrite local adapters.',proposals},null,2)+'\n');
console.log(`${proposals.length} reference modules compared to ${local.length} local modules. No source overwritten.`);
