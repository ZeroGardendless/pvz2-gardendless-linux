import assert from 'node:assert/strict';
import {DeferredAudioPlayer} from '../../public/gpnext/audio/DeferredAudioPlayer.js';
let creates=0,resolve,plays=0,destroys=0;const listeners=new Map();
function actual(){return {state:0,duration:2,sampleRate:48000,currentTime:0,volume:1,playbackRate:1,loop:false,on(event,fn){if(!listeners.has(event))listeners.set(event,new Set());listeners.get(event).add(fn);},off(){},onEnded(fn){this.on('ended',fn);},async seek(time){this.currentTime=time;},async play(){plays++;this.state=1;},async pause(){this.state=2;},async stop(){this.state=3;},destroy(){destroys++;}};}
const make=()=>{creates++;return new Promise(r=>resolve=r);};
const player=new DeferredAudioPlayer({},'m4a',{duration:2,sampleRate:48000},make);
assert.equal(creates,0,'Preload must not decode PCM or create a voice');
player.volume=.25;player.playbackRate=1.5;player.loop=true;await player.seek(.4);
const pending=player.play();await Promise.resolve();await player.pause();resolve(actual());await pending;
assert.equal(plays,0,'Paused pending decode must not start a late voice');
await player.play();assert.equal(creates,1);assert.equal(plays,1);assert.equal(player.player.volume,.25);assert.equal(player.player.playbackRate,1.5);assert.equal(player.currentTime,.4);
await player.stop();await player.play();assert.equal(player.currentTime,0);assert.equal(creates,1,'Replay reuses the materialized player');
player.destroy();player.destroy();assert.equal(destroys,1);
const late=new DeferredAudioPlayer({},'m4a',{duration:2,sampleRate:48000},make);const attempt=late.play();await Promise.resolve();late.destroy();resolve(actual());await attempt;assert.equal(destroys,2);
const broken=new DeferredAudioPlayer({},'m4a',{duration:2,sampleRate:48000},()=>Promise.reject(Error('decode failed')));await assert.rejects(broken.play(),/decode failed/);broken.destroy();
console.log('Deferred audio: no PCM at preload, settings/seek transfer, replay, pause/destroy races and failures passed.');
const {NativeAudioEngine}=await import('../../public/gpnext/audio/NativeAudio.js');
const engine=Object.create(NativeAudioEngine.prototype);engine.host={location:{href:'http://localhost/index.html'}};engine.metadata=new Map();
let probes=0,prepares=0;engine.invoke=async command=>{assert.equal(command,'native_audio_metadata');probes++;return{duration:2,sampleRate:48000};};engine.loadPrepared=async()=>{prepares++;return actual();};
for(const extension of ['mp3','m4a']){
 const deferred=await engine.load('/assets/sound.'+extension);
 assert.equal(prepares,probes-1,'Both full MP3 and Lite M4A preload only metadata');
 await deferred.play();assert.equal(prepares,probes,'Decoding is deferred until first play');deferred.destroy();
}
assert.equal(probes,2);
console.log('Native preload routing: full-release MP3 and Lite M4A both defer preparation until playback.');
const bounded=Object.create(NativeAudioEngine.prototype);bounded.host=engine.host;bounded.metadata=new Map();let inflight=0,maximum=0;const completions=[];
bounded.invoke=()=>new Promise(resolve=>{inflight++;maximum=Math.max(maximum,inflight);completions.push(()=>{inflight--;resolve({duration:1,sampleRate:48000});});});
bounded.loadPrepared=()=>{throw Error('Preload must not prepare PCM');};
const requests=Array.from({length:12},(_,i)=>bounded.load('/assets/clip'+i+'.mp3'));
for(let batch=0;batch<3;batch++){
 await new Promise(resolve=>setImmediate(resolve));assert.equal(inflight,4);
 for(const finish of completions.splice(0))finish();
}
for(const player of await Promise.all(requests))player.destroy();assert.equal(maximum,4);
console.log('Native metadata preload concurrency stays at four during larger asset bursts.');
