import assert from 'node:assert/strict';
globalThis.localStorage={getItem:()=>null,setItem(){}};
let scene=null;
const names=['PlantFeatures','ZombieFeatures','ProjectileFeatures','PlantProps','ZombieProps','ProjectileProps'];
const legacy={assetManager:{assets:{_map:Object.fromEntries(names.map(name=>[name,{_name:name,json:{}}]))}},resources:{load(){}},game:{setFrameRate(){}},js:{getClassByName:()=>({lyrics:{}})},director:{getScene:()=>scene}};
const namespace={...legacy,dragonBones:{ArmatureDisplay:class{}}};globalThis.window={cc:legacy};
const {s:bind,p:getCc,c:api}=await import('../../public/gpnext/ui/Translations.js');
bind(namespace);scene={name:'mainScene'};const ready=await api.waitForEngine();assert.equal(ready,namespace);assert.equal(getCc(),namespace);assert.ok(getCc().dragonBones);
console.log('Engine binding: readiness polling preserves the complete cold-start module namespace instead of replacing it with legacy globals.');
