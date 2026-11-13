import ts from 'typescript';
import {readFile,writeFile} from 'node:fs/promises';
const oldPath='/home/zero/gardendless-reference/update-20261027/extracted/assets/i18n-BQ7SvvRz.js';
import {readdir} from 'node:fs/promises';
const oldRoot='/home/zero/gardendless-reference/update-20261027/extracted/assets';
const oldName=(await readdir(oldRoot)).find(name=>name.startsWith('i18n-'));
function dictionaries(text){
 const source=ts.createSourceFile('Translations.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),result=new Map();
 function visit(node){
  if(ts.isPropertyAssignment(node)&&['en','zh','es'].includes(node.name.text)&&ts.isObjectLiteralExpression(node.initializer)){
   const pairs=node.initializer.properties.filter(item=>ts.isPropertyAssignment(item)&&(ts.isStringLiteral(item.initializer)||ts.isNoSubstitutionTemplateLiteral(item.initializer))).map(item=>[item.name.text,item.initializer.text]);
   if(pairs.some(([key])=>key==='tab.mods'))result.set(node.name.text,{node:node.initializer,values:Object.fromEntries(pairs)});
  }
  ts.forEachChild(node,visit);
 }visit(source);return {source,result};
}
const base=dictionaries(await readFile(oldRoot+'/'+oldName,'utf8'));
const ours=dictionaries(await readFile('public/gpnext/ui/Translations.js','utf8'));
const target=process.argv[2];let text=await readFile(target,'utf8');const upstream=dictionaries(text),edits=[];
for(const [locale,old] of ours.result){
 const incoming=upstream.result.get(locale);if(!incoming)continue;
 const merged={...old.values,...incoming.values};
 for(const [key,value] of Object.entries(old.values))if(base.result.get(locale)?.values[key]!==value)merged[key]=value;
 edits.push({start:incoming.node.getStart(upstream.source),end:incoming.node.end,text:JSON.stringify(merged,null,2)});
}
for(const edit of edits.sort((a,b)=>b.start-a.start))text=text.slice(0,edit.start)+edit.text+text.slice(edit.end);
await writeFile(target,text);console.log('Merged custom captions and missing legacy UI labels into the new translation dictionaries.');
