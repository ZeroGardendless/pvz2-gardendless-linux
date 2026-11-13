import assert from 'node:assert/strict';
import {installArmatureBatching} from '../../mods/aurum/src/Rendering.js';
const listeners=new Map(),existing=[];let preloads=0,destroys=0;
class Display {
 constructor(customMaterial=null){this.customMaterial=customMaterial;this._batch=false;this.isValid=true;}
 get customMaterial(){return this._customMaterial;}set customMaterial(value){this._customMaterial=value;}
 get enableBatch(){return this._batch;}set enableBatch(value){this._batch=value;}
 __preload(){preloads++;return 42;}onDestroy(){destroys++;this.isValid=false;}
}
const hooks={wrapProperty({target,key,set}){const descriptor=Object.getOwnPropertyDescriptor(target,key);Object.defineProperty(target,key,{...descriptor,set(value){return set({thisArg:this,nextValue:value,callNext:next=>descriptor.set.call(this,next)});}});return()=>Object.defineProperty(target,key,descriptor);},wrapMethod({target,methodName,handler}){const original=target[methodName];target[methodName]=function(...args){return handler({thisArg:this,args,callNext:()=>original.apply(this,args)});};return()=>{target[methodName]=original;};}};
const cc={dragonBones:{ArmatureDisplay:Display},director:{getScene:()=>({getComponentsInChildren:()=>existing})}};
const first=new Display(),custom=new Display({shader:'custom'}),already=new Display();already.enableBatch=true;existing.push(first,custom,already);
const cleanup=installArmatureBatching(cc,hooks,{info(){},warn(){}});assert.equal(first.enableBatch,true);assert.equal(custom.enableBatch,false);
first.customMaterial={shader:'dynamic'};assert.equal(first.enableBatch,false,'Dynamic colour uniforms must remain independent');first.customMaterial=null;assert.equal(first.enableBatch,true);
const next=new Display();assert.equal(next.__preload(),42);assert.equal(next.enableBatch,true);next.onDestroy();assert.equal(destroys,1);
cleanup();assert.equal(first.enableBatch,false);assert.equal(already.enableBatch,true,'Preexisting batching retained');assert.equal(custom.enableBatch,false);
const later=new Display();later.__preload();assert.equal(later.enableBatch,false,'Lifecycle hooks removed on disposal');
console.log('Armature batching: existing/new instances, custom shader exclusion, destruction and restoration passed.');
