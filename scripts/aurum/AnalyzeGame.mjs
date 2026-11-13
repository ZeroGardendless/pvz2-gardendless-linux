import ts from 'typescript';
import {readFile,writeFile} from 'node:fs/promises';
const text=await readFile('public/assets/main/index.js','utf8');
const source=ts.createSourceFile('Game.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
const expensive=new Set(['getComponent','getComponentsInChildren','getChildByName','filter','find','indexOf','includes','sort','load','loadDir','preload','preloadScene','loadScene','loadBundle','parse','stringify']);
const modules=[];
for(const statement of source.statements){
 const call=statement.expression;
 if(!ts.isCallExpression(call)||call.expression.getText(source)!=='System.register'||!ts.isStringLiteral(call.arguments[0]))continue;
 const record={module:call.arguments[0].text,bytes:Buffer.byteLength(statement.getText(source)),functions:0,loops:0,allocations:0,calls:{}};
 function visit(node){
  if(ts.isFunctionLike(node))record.functions++;
  if(ts.isIterationStatement(node,false))record.loops++;
  if(ts.isNewExpression(node))record.allocations++;
  if(ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression)){
   const name=node.expression.name.text;
   if(expensive.has(name))record.calls[name]=(record.calls[name]||0)+1;
  }
  ts.forEachChild(node,visit);
 }
 visit(statement);modules.push(record);
}
const metadata=JSON.parse(await readFile('public/launcher/GameMetadata.json','utf8'));
const report={gameVersion:metadata.version,generatedAt:new Date().toISOString(),kind:'Static inventory, not runtime profiling',moduleCount:modules.length,modules:modules.sort((a,b)=>b.bytes-a.bytes)};
await writeFile('docs/aurum/StaticInventory.json',JSON.stringify(report,null,2)+'\n');
console.log(`${modules.length} modules inventoried for ${metadata.version}. Counts identify investigation targets; they do not prove CPU cost.`);
