import assert from 'node:assert/strict';
import {createHookOrderCache} from '../../mods/aurum/src/HookOrder.js';
const ordered=createHookOrderCache();
const hooks=[{priority:0,order:2},{priority:3,order:3},{priority:3,order:1}];
const record={hooks};const first=ordered(record,0);
assert.deepEqual(first,[hooks[2],hooks[1],hooks[0]]);
assert.equal(ordered(record,0),first,'Repeated dispatch avoids allocation/sorting');
record.hooks=hooks.filter(hook=>hook!==hooks[2]);
const next=ordered(record,1);
assert.deepEqual(next,[hooks[1],hooks[0]]);
assert.equal(first.length,3,'Removing a hook cannot change an in-flight call snapshot');
assert.notEqual(next,first);
assert.equal(ordered(record,1),next);
assert.deepEqual(hooks.map(hook=>hook.order),[2,3,1],'Never sort the registered array in place');
console.log('Aurum hook-order core: ordering, mutation invalidation, snapshot isolation and allocation reuse passed.');

const {createPreloadQueue} = await import('../../mods/aurum/src/PreloadQueue.js');
const pending = new Map(), started = [];
const queue = createPreloadQueue(path => {
  started.push(path);
  return new Promise((resolve,reject) => pending.set(path,{resolve,reject}));
});
const a = queue.add('materials'), b = queue.add('plants'), c = queue.add('zombies');
assert.equal(queue.add('plants'), b, 'Duplicate preloads share work');
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(started,['materials','plants']);
assert.equal(queue.active,2);
pending.get('plants').reject(new Error('Network failed'));
assert.equal((await b).status,'failed','Speculative errors do not reject the original game load');
await new Promise(resolve => setImmediate(resolve));
assert.deepEqual(started,['materials','plants','zombies']);
const cancelled=queue.add('dinosaurs');
queue.cancel();
assert.equal((await cancelled).status,'cancelled');
pending.get('materials').resolve(); pending.get('zombies').resolve();
assert.equal((await a).status,'ready'); assert.equal((await c).status,'ready');
assert.equal((await queue.add('music')).status,'cancelled');
assert.throws(()=>createPreloadQueue(()=>{}, {concurrency:20}),/Concurrency/);
console.log('Aurum preload core: bounded concurrency, deduplication, cancellation and failure fallback passed.');

const {setup}=await import('../../mods/aurum/src/Entry.js');
const listeners=new Map(), capturedHooks=[],timers=[],panels=[],logs=[],preloads=[];
const splash={start(){},...Object.fromEntries(['loadMaterials','loadPlants','loadZombies','loadDinosaurs','loadMusics','loadSFXs','loadLevelNodes','loadDroppings','loadTrophies','loadParticles','loadWorldmaps','loadZenGarden','loadOthers'].map(name=>[name,()=>{}]))};
let flags={enabled:true,startupPrefetch:false,prefetchConcurrency:2},change;
const cleanup=await setup({
 settings:{async defineSchema(){},async getAll(){return flags;},onChange(fn){change=fn;}},
 unsafe:{engine:{getCc:()=>({Prefab:class{},resources:{preload(path,type,done){preloads.push(path);done();}},Director:{EVENT_BEFORE_UPDATE:'before',EVENT_AFTER_DRAW:'after'},director:{on(event,fn){listeners.set(event,fn);},off(event){listeners.delete(event);}}}),getClassByName:()=>({prototype:splash})},hooks:{wrapMethod(hook){capturedHooks.push(hook);}}},
 runtime:{setTimeout(fn){timers.push(fn);}},controls:{definePanel(panel){panels.push(panel);}},
 ui:{toast(){}},log:{info(message){logs.push(message);},warn(message){logs.push(message);}}
});
assert.equal(capturedHooks.length,0,'Early startup hooks belong to startup(ctx), not late setup(ctx)');
assert.equal(listeners.size,0,'No idle frame profiler listeners');
panels[0].groups[0].items[0].onClick();
assert.equal(listeners.size,2);
listeners.get('before')();listeners.get('after')();timers[0]();
assert.equal(listeners.size,0);
const report=JSON.parse(logs.find(message=>message.startsWith('{')));
assert.equal(report.frames,1);assert.ok(report.kind.includes('not GPU'));
panels[0].groups[0].items[0].onClick();cleanup();
assert.equal(listeners.size,0,'Disposal removes frame listeners');
console.log('Aurum alpha setup: late-setup isolation, explicit sampling and cleanup passed in a mock engine.');
const {createAurumHost}=await import('../../mods/aurum/src/Host.js');
const host=createAurumHost(),session=host.createSession();
assert.equal(host.active,false);
session.configure({enabled:true,hookCache:true});assert.equal(host.active,true);
const cachedOne=host.orderedHooks(record,1);assert.equal(host.orderedHooks(record,1),cachedOne);
const second=host.createSession();second.configure({enabled:true,hookCache:true});
session.dispose();assert.equal(host.active,true,'Old cleanup cannot switch off a newer runtime');
second.dispose();assert.equal(host.active,false);
assert.notEqual(host.orderedHooks(record,1),host.orderedHooks(record,1),'Disabling restores uncached dispatch');
console.log('Aurum host: opt-in, cache reuse, overlapping runtime lifetimes and disposal passed.');

const {startWithShortFade}=await import('../../mods/aurum/src/FastSplash.js');
const cover={},other={},splashInstance={screenColor:cover};let tweenHook,removed=0;
const fadeHooks={wrapMethod(definition){tweenHook=definition.handler;return()=>{removed++;};}};
const ccTween={Tween:class {to(){}}};
const invokeTween=(target,args)=>tweenHook({thisArg:{_target:target},args,callNext:(...next)=>next.length?next:args});
assert.equal(startWithShortFade({thisArg:splashInstance,callNext(){
 assert.deepEqual(invokeTween(cover,[1.33,{a:0}]),[0.12,{a:0}]);
 assert.deepEqual(invokeTween(other,[1.33,{a:0}]),[1.33,{a:0}]);
 assert.deepEqual(invokeTween(cover,[1.33,{a:0,x:5}]),[1.33,{a:0,x:5}]);
 assert.deepEqual(invokeTween(cover,[0.5,{a:0}]),[0.5,{a:0}]);
 return 42;
}},ccTween,fadeHooks),42);
assert.equal(removed,1,'Temporary animation hook removed after start');
assert.throws(()=>startWithShortFade({thisArg:splashInstance,callNext(){throw Error('original failure');}},ccTween,fadeHooks),/original failure/);
assert.equal(removed,2,'Original exception propagates after hook removal');
assert.equal(startWithShortFade({callNext:()=>99},{},fadeHooks),99,'Unknown engine retains original startup');
console.log('Short splash: only the exact cover tween changes; no persistent animation hook, with original return/error behavior.');
