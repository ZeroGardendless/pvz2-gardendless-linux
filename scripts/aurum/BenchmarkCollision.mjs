import ts from 'typescript';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {installCollisionBroadPhase} from '../../mods/aurum/src/Collision.js';
const text=await readFile('public/assets/main/index.js','utf8'),source=ts.createSourceFile('Game.js',text,99,true,1);
let module;for(const node of source.statements){const call=node.expression;if(ts.isCallExpression(call)&&ts.isStringLiteral(call.arguments[0])&&call.arguments[0].text.endsWith('/CharacterManager.ts'))module=node;}
assert.ok(module);let factory,line;
function visit(node){
 if(ts.isCallExpression(node)&&node.arguments[0]&&ts.isStringLiteral(node.arguments[0])&&node.arguments[0].text==='Rectangle')factory=node.arguments[1].getText(source);
 if(ts.isFunctionDeclaration(node)&&node.name?.text==='D')line=node.getText(source);
 ts.forEachChild(node,visit);
}visit(module);assert.ok(factory&&line);
const Rectangle=vm.runInNewContext(line+'\n('+factory+')',{h:class Vec2{constructor(x,y){this.x=x;this.y=y;}},u:{HALF_PI:Math.PI/2},Math,NaN});
globalThis.window={};globalThis.localStorage={getItem:()=>null,setItem(){}};
const {createJsModLoader}=await import('../../public/gpnext/mods/JsModLoader.js');
const {aurumHost}=await import('../../public/gpnext/runtime/AurumHost.js');
const manager=createJsModLoader()._hookManager,session=aurumHost.createSession();session.configure({enabled:true,hookCache:true});
const hooks={wrapMethod:options=>manager.wrapMethod({owner:'fixture.collision',...options})};
const original=Rectangle.prototype.judgeCrossRec;
let seed=173;
const random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
const make=(x,y,w,h,angle=0)=>Rectangle.createRectangleCenter({x,y},w,h,angle);
const pairs=[];
for(let i=0;i<30000;i++){
 const x=i%17===0?0:random()*2000-1000,y=i%23===0?0:random()*1000-500;
 const a=make(x,y,(i%31===0?0:random()*140)*(i%7===0?-1:1),random()*200,i%4===0?random()*360:0);
 const b=make(x+(random()-.5)*400,y+(random()-.5)*400,random()*180,random()*200,i%5===0?random()*360:0);
 pairs.push([a,b,original.call(a,b)]);
}
const special=[make(0,0,10,10),make(10,0,10,10),make(NaN,5,10,10),make(5,5,0,20),make(Infinity,0,10,10)];
for(const a of special)for(const b of special)pairs.push([a,b,original.call(a,b)]);
let skipped=false;const log={info(){},warn(message){skipped=true;console.log(message);}};
let remove=await installCollisionBroadPhase(Rectangle,hooks,log);assert.equal(skipped,false,'Exact current game function matches compatibility guard');
for(const [a,b,expected] of pairs)assert.equal(a.judgeCrossRec(b),expected,'Collision outcome must match the actual bundled implementation');
remove();assert.equal(Rectangle.prototype.judgeCrossRec,original);
const workload=Array.from({length:2048},(_,i)=>[make(i%100*20+1,i%5*100+1,20,30),make((i*7)%100*20+1,(i*3)%5*100+1,30,40)]);
const run=()=>{let hits=0;const start=performance.now();for(let i=0;i<200000;i++){const [a,b]=workload[i%workload.length];if(a.judgeCrossRec(b))hits++;}return {ms:performance.now()-start,hits};};
const baseline=[],optimized=[];let hits;
for(let i=0;i<5;i++){
 run();const before=run();baseline.push(before.ms);hits=before.hits;
 remove=await installCollisionBroadPhase(Rectangle,hooks,log);run();const after=run();optimized.push(after.ms);assert.equal(after.hits,hits);remove();
}
session.dispose();const median=xs=>[...xs].sort((a,b)=>a-b)[2];
const result={kind:'Actual bundled collision narrow phase vs guarded broad phase through actual GP-Next hook dispatcher; Node query benchmark, not gameplay FPS',oraclePairs:pairs.length,queries:200000,baselineMs:baseline,optimizedMs:optimized,baselineMedianMs:median(baseline),optimizedMedianMs:median(optimized),hits};
await writeFile('docs/aurum/CollisionBenchmark.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
