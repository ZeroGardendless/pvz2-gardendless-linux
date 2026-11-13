import assert from 'node:assert/strict';
import {createNeutralVisualState} from '../../mods/aurum/src/NeutralVisuals.js';
const saturation=()=>0, state=createNeutralVisualState(saturation);
function create(){const pass={_rootBlock:new ArrayBuffer(96)};const material={passes:[pass]};return {material,body:{db:{customMaterial:material,color:{r:255,g:255,b:255,a:255}}},additionalSatuation:saturation,hurting:0,TotalRGB:0,worldPositionX:700,hiddenWhenTooFar:true};}
const zombie=create();let calls=0;
const original=()=>{calls++;new Float32Array(zombie.material.passes[0]._rootBlock).fill(0);zombie.body.db.customMaterial=zombie.material;};
state.material(zombie,original);state.material(zombie,original);assert.equal(calls,1);
new Float32Array(zombie.material.passes[0]._rootBlock)[2]=9;
state.material(zombie,original);assert.equal(calls,2,'Direct external uniform edits must be restored through upstream');
zombie.body.db.customMaterial={foreign:true};state.material(zombie,original);assert.equal(calls,3);
for(const [key,value]of Object.entries({hurting:2,teleporting:true,poisoned:true,havePlantfood:true,oldestCD:.1,warningCD:.2,_potionInvisible:true,perfume:1,darkmatter:1,chill:1,freeze:1,iceblock:{dead:true},icebloom_block:{},TotalRGB:2,potionSpeedLevel:1,potionToughnessLevel:1,haveSun:1,glittering:1,CarriedSporeShroom:true,dead:true,fallingInSky:true})){
 const sample=create();sample[key]=value;let run=0;state.material(sample,()=>run++);state.material(sample,()=>run++);assert.equal(run,2,key+' must retain all upstream effect updates');
}
const custom=create();custom.additionalSatuation=()=>.2;let customCalls=0;state.material(custom,()=>customCalls++);state.material(custom,()=>customCalls++);assert.equal(customCalls,2);
let colors=0;state.color(zombie,()=>colors++);assert.equal(colors,0);
for(const change of [{displayedStuck:true},{worldPositionX:1300},{iceblock:{}},{coloredWhenHypnotized:true,hypnotized:true},{dead:true},{body:{db:{color:{r:80,g:255,b:255,a:255}}}}]){state.color({...create(),...change},()=>colors++);}
assert.equal(colors,6,'Visibility, effects and external tint edits retain original color logic');
state.clear();state.material(zombie,original);assert.equal(calls,4);
console.log('Neutral visuals: unchanged state, external uniform/material/tint edits, all effect fallbacks and cleanup passed.');
