import assert from 'node:assert/strict';
import {beginHotspotSample} from '../../mods/aurum/src/Hotspots.js';
let clock=0, removals=0;
const target={value:7,run(delta){clock+=delta;return this.value;},fail(){clock+=3;throw Error('original');}};
const original=target.run;
const hooks={wrapMethod({target,methodName,handler}){const method=target[methodName];target[methodName]=function(...args){return handler({thisArg:this,args,callNext:()=>method.apply(this,args)});};return()=>{removals++;target[methodName]=method;};}};
const stop=beginHotspotSample([{label:'run',target,methodName:'run'},{label:'duplicate',target,methodName:'run'},{label:'fail',target,methodName:'fail'}],hooks,()=>clock);
assert.equal(target.run(4),7);assert.throws(()=>target.fail(),/original/);
const report=stop();assert.equal(report.methods.length,2);assert.equal(report.methods[0].inclusiveMs,4);assert.equal(report.methods[1].calls,1);assert.equal(target.run,original);stop();assert.equal(removals,2);
report.methods[0].calls=99;assert.equal(stop().methods[0].calls,1,'Reports cannot mutate accumulated statistics');
let attempts=0;assert.throws(()=>beginHotspotSample([{label:'run',target,methodName:'run'},{label:'fail',target,methodName:'fail'}],{wrapMethod(options){if(++attempts===2)throw Error('registration');return hooks.wrapMethod(options);}}),/registration/);assert.equal(target.run,original,'Partial setup must remove every installed wrapper');
console.log('Aurum hotspot sampler: receiver/result/error preservation, duplicate suppression, bounded setup and complete teardown passed.');
const {collectHotspotTargets}=await import('../../mods/aurum/src/Hotspots.js');
class Zombie {characterUpdate(){} characterUpdateOnDisplayed(){}}
class Plant {characterUpdate(){} lateUpdate(){}}
const classes={Zombie,Plant};
const targets=collectHotspotTargets({getModuleExport:(module,name)=>classes[name]},{});
assert.ok(targets.some(item=>item.label==='Zombie.characterUpdate'));
assert.ok(targets.some(item=>item.label==='Plant.characterUpdate'));
console.log('Hotspot engine adapter: current character-update method names covered.');
