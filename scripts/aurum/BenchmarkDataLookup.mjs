import ts from 'typescript';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {performance} from 'node:perf_hooks';
import {installDataLookup} from '../../mods/aurum/src/DataLookup.js';
const source = ts.createSourceFile('Game.js', await readFile('public/assets/main/index.js','utf8'),99,true,1);
let factory;
for (const statement of source.statements) {
  const call = statement.expression;
  if (!call || !ts.isCallExpression(call) || !call.arguments[0]?.text?.endsWith('/JSONs.ts')) continue;
  function visit(node) {
    if (ts.isCallExpression(node) && node.arguments[0]?.text === 'PvZ2Object') factory = node.arguments[1].getText(source);
    ts.forEachChild(node, visit);
  }
  visit(statement);
}
assert.ok(factory);
const containers = {PlantTypes:[{aliases:['pea'],objclass:'PlantType',objdata:{value:1}},{aliases:['pea'],objclass:'Other',objdata:{value:2}}]};
const ObjectType = vm.runInNewContext('('+factory+')',{v:containers});
const original=ObjectType.getObjectsByRTID;
console.log('Current game lookup SHA256:',createHash('sha256').update(original.toString()).digest('hex'));
globalThis.window={};globalThis.localStorage={getItem:()=>null,setItem(){}};
const {createJsModLoader}=await import('../../public/gpnext/mods/JsModLoader.js');
const {aurumHost}=await import('../../public/gpnext/runtime/AurumHost.js');
const session=aurumHost.createSession();session.configure({enabled:true,hookCache:true});
const manager=createJsModLoader()._hookManager;
const hooks={wrapMethod:options=>manager.wrapMethod({owner:'fixture.data',...options})};
let skipped=false;
const dispose=await installDataLookup(ObjectType,containers,hooks,{info(){},warn(message){skipped=true;console.log(message);}});
assert.equal(skipped,false);
const references=['RTID(pea@PlantTypes)','RTID(pea@.)','RTID(pea@CurrentLevel)','none','RTID(bad)','RTID(a@b@c)','xRTID(pea@PlantTypes)extra',null,undefined,5];
const levels=[null,[],[{aliases:['pea'],objclass:'PlantType',objdata:{level:true}}]];
function result(fn,args){try{return {value:Array.from(fn.apply(ObjectType,args))};}catch(error){return {error:error.constructor.name};}}
for(let revision=0;revision<4;revision++){
 for(const reference of references)for(const filter of [undefined,null,'PlantType','Other'])for(const level of levels) {
  const args=[reference,filter,level];assert.deepEqual(result(ObjectType.getObjectsByRTID,args),result(original,args));
 }
 containers.PlantTypes.reverse();containers.CurrentLevel=levels[2];
 containers.PlantTypes[0].objdata.value=revision;
}
const first=ObjectType.getObjectsByRTID('RTID(pea@PlantTypes)');first.length=0;
assert.notEqual(ObjectType.getObjectsByRTID('RTID(pea@PlantTypes)').length,0,'Returned arrays must never be shared');
const run=fn=>{const start=performance.now();let hits=0;for(let i=0;i<200000;i++)hits+=fn.call(ObjectType,'RTID(pea@PlantTypes)','PlantType').length;return {ms:performance.now()-start,hits};};
const baseline=[],optimized=[];
for(let i=0;i<7;i++){run(original);baseline.push(run(original));run(ObjectType.getObjectsByRTID);optimized.push(run(ObjectType.getObjectsByRTID));}
dispose();assert.equal(ObjectType.getObjectsByRTID,original);session.dispose();
const report={kind:'Actual bundled RTID lookup vs bounded parsed-string cache through actual GP-Next hooks; Node query benchmark, not gameplay FPS',queries:200000,baseline,optimized};
await writeFile('docs/aurum/DataLookupBenchmark.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
