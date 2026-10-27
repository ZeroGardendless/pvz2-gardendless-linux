import assert from "node:assert/strict";
import {GameAudioBridge} from "../../public/gpnext/audio/GameAudioBridge.js";

let time = 0, resolveLoad;
const players = [];
function player() {
  const value = {volume: 1, playbackRate: 1, currentTime: 0, duration: 10, state: 0, destroyed: false,
    async play() {this.state = 1;}, async pause() {this.state = 2;}, async seek(value) {this.currentTime = value;},
    onEnded(callback) {this.ended = callback;}, destroy() {this.destroyed = true;}};
  players.push(value); return value;
}
const engine = {mediaNow: () => time, report() {}, load: () => new Promise(resolve => {resolveLoad = resolve;})};
let timer;
const bridge = new GameAudioBridge(engine, {Music_Test:"Music/Test.mp3", Test:"Sounds/Test.mp3"}, "http://localhost/audio/", {setTimeout(callback) {timer = callback; return 1;}, clearTimeout() {timer = null;}});
const cancelled = bridge.play("Test"); bridge.destroy(cancelled);
const first = player(); resolveLoad(first); await new Promise(resolve => setImmediate(resolve));
assert.equal(first.destroyed, true, "cancelled decodes do not create late voices");
const id = bridge.play("Music_Test", 1, 0.5);
bridge.setVolume(id, 0.4); bridge.seek(id, 3); bridge.setPlaying(id, false);
const music = player(); resolveLoad(music); await new Promise(resolve => setImmediate(resolve));
assert.equal(music.volume, 0.4); assert.equal(music.currentTime, 3); assert.equal(music.state, 0);
bridge.setPlaying(id, true); assert.equal(music.state, 1);
bridge.fadeOut(id, 500); time = 0.25; timer();
assert.equal(music.volume, 0.2); bridge.setVolume(id, 0.4); assert.equal(music.volume, 0.2, "game volume writes cannot undo a fade");
time = 0.5; timer(); assert.equal(music.destroyed, true); assert.deepEqual(bridge.getPosition(id), [0,null]);
assert.equal(bridge.timer, null);
const loopId = bridge.play("Music_Test",2); const looping = player();resolveLoad(looping);await new Promise(resolve => setImmediate(resolve));
bridge.setRestartBeforeEnd(loopId, 1000);looping.currentTime=9.6;timer();assert.equal(looping.currentTime,0);
bridge.destroy(loopId);
assert.equal(bridge.play("missing"),null);
console.log("Passed: named game audio API, delayed cancellation, pre-decode controls, fade gain, looping and cleanup.");

globalThis.localStorage = {getItem:()=>null,setItem(){}};
globalThis.window = {};
const {getSettings,setSettings} = await import("../../public/gpnext/core/SettingsStore.js");
const {installRendering} = await import("../../public/gpnext/runtime/Rendering.js");
const listeners = new Map(), canvas = {width:1920,height:1200};
const events = {on(event, callback) {listeners.set(event,callback);}, off(event) {listeners.delete(event);}};
const cc={game:{canvas},screen:{...events,windowSize:{width:1920,height:1200}},view:{...events},director:{root:{mainWindow:{width:1920,height:1200},resize(width,height){this.mainWindow={width,height};canvas.width=width;canvas.height=height;}}}};
const rendering=installRendering(cc,{addEventListener(){},removeEventListener(){}});
setSettings({renderScale:75});rendering.apply();
assert.deepEqual([canvas.width,canvas.height,cc.director.root.mainWindow.width,cc.director.root.mainWindow.height],[1440,900,1440,900]);
canvas.width=1920;canvas.height=1200;listeners.get("canvas-resize")();await new Promise(resolve=>queueMicrotask(resolve));
assert.deepEqual([canvas.width,canvas.height],[1440,900],"engine layout cannot leave full canvas paired with smaller swapchain");
setSettings({renderScale:100});rendering.apply();assert.deepEqual([canvas.width,canvas.height],[1920,1200]);
setSettings({renderScale:4});assert.equal(getSettings().renderScale,100);
rendering.dispose();
console.log("Passed: render buffer/swapchain scaling, resize reapplication, native restoration and invalid preferences.");
