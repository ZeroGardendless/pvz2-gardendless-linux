import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
globalThis.window={};globalThis.localStorage={getItem:()=>null,setItem(){}};
const {createJsModLoader}=await import('../../public/gpnext/mods/JsModLoader.js');
const {aurumHost}=await import('../../public/gpnext/runtime/AurumHost.js');
const manager=createJsModLoader()._hookManager,session=aurumHost.createSession();
const object={base:3,run(value){return this.base+value;}},seen=[];
const remove=manager.wrapMethod({owner:'fixture.low',target:object,methodName:'run',priority:0,handler:ctx=>{seen.push('low');return ctx.callNext(...ctx.args)+2;}});
manager.wrapMethod({owner:'fixture.high',target:object,methodName:'run',priority:4,handler:ctx=>{seen.push('high');return ctx.callNext()*2;}});
for(const enabled of [false,true]){
 session.configure({enabled,hookCache:true});seen.length=0;
 assert.equal(object.run(5),20);assert.deepEqual(seen,['high','low']);
}
remove();assert.equal(object.run(5),16,'Removal invalidates ordering');
const target={run(value){return value+1;}};
for(let i=0;i<6;i++)manager.wrapMethod({owner:'fixture.'+i,target,methodName:'run',priority:i,handler:ctx=>ctx.callNext()});
const iterations=200000;
function measure(enabled){
 session.configure({enabled,hookCache:true});let sum=0;
 const start=performance.now();for(let i=0;i<iterations;i++)sum+=target.run(i);
 const elapsed=performance.now()-start;assert.equal(sum,iterations*(iterations+1)/2);return elapsed;
}
measure(false);measure(true);
const baseline=[],cached=[];
for(let i=0;i<5;i++)if(i%2){cached.push(measure(true));baseline.push(measure(false));}else{baseline.push(measure(false));cached.push(measure(true));}
const median=values=>[...values].sort((a,b)=>a-b)[2];
const result={kind:'Node microbenchmark of real GP-Next 1.5.10 dispatch and actual Aurum host toggle; not WebKit or game FPS',iterations,hooks:6,baselineMs:baseline,cachedMs:cached,baselineMedianMs:median(baseline),cachedMedianMs:median(cached)};
session.dispose();await writeFile('docs/aurum/HookBenchmark.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
