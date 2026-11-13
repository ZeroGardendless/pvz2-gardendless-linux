import ts from 'typescript';
import path from 'node:path';
import {readFile,readdir,writeFile} from 'node:fs/promises';
const root='/home/zero/gardendless-reference/update-20261111/gpnext-stage';
async function collect(directory,prefix=''){
 const result=[];for(const item of await readdir(directory,{withFileTypes:true})){
  const name=path.posix.join(prefix,item.name);
  if(item.isDirectory())result.push(...await collect(path.join(directory,item.name),name));else if(item.name.endsWith('.js'))result.push(name);
 }return result;
}
function analyze(text){
 const source=ts.createSourceFile('Module.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),exports=new Set(),imports=[];
 for(const node of source.statements){
  if(ts.isExportDeclaration(node)&&node.exportClause&&ts.isNamedExports(node.exportClause))for(const item of node.exportClause.elements)exports.add(item.name.text);
  if(ts.isImportDeclaration(node)){
   const bindings=node.importClause?.namedBindings;
   imports.push({path:node.moduleSpecifier.text,names:bindings&&ts.isNamedImports(bindings)?bindings.elements.map(item=>(item.propertyName||item.name).text):[]});
  }
 }return {exports,imports};
}
const modules=new Map();for(const name of await collect(root))modules.set(name,analyze(await readFile(path.join(root,name),'utf8')));
const brokenStage=[],adapterReview=[];
for(const [name,record] of modules)for(const dependency of record.imports){
 if(!dependency.path.startsWith('.'))continue;
 const target=path.posix.normalize(path.posix.join(path.posix.dirname(name),dependency.path));
 const staged=modules.get(target);
 if(!staged){brokenStage.push({module:name,target,reason:'Missing staged dependency'});continue;}
 const missing=dependency.names.filter(item=>!staged.exports.has(item));
 if(missing.length)brokenStage.push({module:name,target,missing});
 try{
  const live=analyze(await readFile(path.join('public/gpnext',target),'utf8'));
  const missing=dependency.names.filter(item=>!live.exports.has(item));
  if(missing.length)adapterReview.push({module:name,target,missing});
 }catch{adapterReview.push({module:name,target,reason:'New module'});}
}
await writeFile('docs/aurum/ExportAudit.json',JSON.stringify({brokenStage,adapterReview,note:'Export names alone do not establish semantic compatibility.'},null,2)+'\n');
console.log(`Staged module graph: ${brokenStage.length} errors. Live adapter export differences: ${adapterReview.length}.`);
if(brokenStage.length)process.exitCode=1;
