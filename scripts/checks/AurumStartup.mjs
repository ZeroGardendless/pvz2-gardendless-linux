import assert from 'node:assert/strict';
import {startup} from '../../mods/aurum/src/Startup.js';
import {createAurumHost} from '../../mods/aurum/src/Host.js';
const previous=globalThis.__gardendlessAurumHost;
for(const prefetch of [false,true]){
 const host=createAurumHost();host.setStartupOptions({fastSplash:true,startupPrefetch:prefetch,prefetchConcurrency:2});globalThis.__gardendlessAurumHost=host;
 const events=new Map(),paths=[],durations=[];
 class Tween{constructor(target){this._target=target;}to(seconds){durations.push(seconds);return this;}}
 const originalTween=Tween.prototype.to;
 class Splash{start(){this.screenColor={a:255};new Tween(this.screenColor).to(1.33,{a:0});return 42;}}
 const originalStart=Splash.prototype.start;let registered=false,registration,phase='collecting';
 const cc={Tween,Prefab:class{},js:{getClassByName:()=>registered?Splash:null},Director:{EVENT_BEFORE_SCENE_LAUNCH:'beforeScene'},director:{on(event,fn){events.set(event,fn);},off(event){events.delete(event);}},resources:{preload(path,type,done){paths.push(path);done();}}};
 const dispose=startup({registrations:{add(name,value){assert.equal(name,'startup-performance');registration=value;}},engine:{getCc(){assert.equal(phase,'prepare');return cc;}}});
 phase='prepare';registration.prepare();phase='publish';registration.publish();
 assert.equal(Splash.prototype.start,originalStart,'Wait until the scene class actually exists');
 registered=true;events.get('beforeScene')();
 assert.equal(new Splash().start(),42);await new Promise(resolve=>setImmediate(resolve));
 assert.deepEqual(durations,[0.12]);assert.equal(paths.length,prefetch?13:0);assert.equal(host.startupStatus.shortFade,true);
 assert.equal(Splash.prototype.start,originalStart);assert.equal(Tween.prototype.to,originalTween);assert.equal(events.size,0);
 registration.dispose();dispose();
}
globalThis.__gardendlessAurumHost=previous;
console.log('Early Aurum startup: prepare/publish boundaries, late scene registration, one-shot fade, optional 13-group prefetch and restoration passed.');
