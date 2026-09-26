import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {applyFrameRate, FRAME_RATE_OPTIONS, normalizeFrameRate} from '../../public/gpnext/runtime/FrameRate.js';

// Exercise the exact Pacer shipped with Cocos against a deterministic clock.
const engine = await readFile(new URL('../../public/cocos-js/_virtual_cc-9deb4621.js', import.meta.url), 'utf8');
const start = engine.indexOf('DD=function');
const end = engine.indexOf(',BD=', start);
assert.ok(start >= 0 && end > start, 'update the Pacer fixture after a Cocos upgrade');
let clock = 0, nextId = 0, ticks = 0;
const timers = new Map(), raf = new Map();
const fakePerformance = {now: () => clock};
const fakeSetTimeout = (fn, delay) => {
  const id = ++nextId;
  timers.set(id, {fn, at: clock + delay});
  return id;
};
const fakeClearTimeout = id => timers.delete(id);
const nativeWindow = {
  requestAnimationFrame(fn) {const id = ++nextId; raf.set(id, fn); return id;},
  cancelAnimationFrame(id) {raf.delete(id);}
};
const Pacer = runInNewContext(`(${engine.slice(start + 3, end)})`, {
  performance: fakePerformance, window: nativeWindow,
  setTimeout: fakeSetTimeout, clearTimeout: fakeClearTimeout,
  n(type, descriptors) {
    for (const {key, ...descriptor} of descriptors) Object.defineProperty(type.prototype, key, {...descriptor, configurable: true});
  }
});
Object.defineProperty(globalThis, 'performance', {value: fakePerformance, configurable: true});
globalThis.setTimeout = fakeSetTimeout;
globalThis.clearTimeout = fakeClearTimeout;
globalThis.document = {hidden: false};
const messages = [];
globalThis.MessageChannel = class {
  port1 = {onmessage: null};
  port2 = {postMessage: data => messages.push(() => this.port1.onmessage({data}))};
};
class Game {
  _pacer = new Pacer();
  get frameRate() {return this._frameRate;}
  set frameRate(rate) {
    this._frameRate = rate;
    this.frameTime = 1000 / rate;
    this._pacer.targetFrameRate = rate;
  }
  setFrameRate(rate) {this.frameRate = rate;}
}
const game = new Game();
game._pacer.onTick = () => ticks++;
function step() {
  assert.equal(timers.size, 1, 'exactly one frame timer queued');
  const [id, timer] = timers.entries().next().value;
  clock = Math.max(clock, timer.at);
  timers.delete(id);
  timer.fn();
  assert.equal(messages.length, 1, 'one handoff after the sleeping timer');
  assert.equal(timers.size, 0, 'wait for the handoff before queuing another frame');
  messages.shift()();
  assert.equal(messages.length, 0, 'messages must never self-post in a hot loop');
}
for (const setting of [...FRAME_RATE_OPTIONS, 0, Infinity, -10, 2000]) {
  const rate = normalizeFrameRate(setting);
  applyFrameRate(game, setting);
  game._pacer.start();
  const initialTicks = ticks;
  const until = clock + 10000;
  while ([...timers.values()][0]?.at <= until) step();
  assert.ok(Math.abs(ticks - initialTicks - rate * 10) <= 1, `${setting}: ${ticks-initialTicks} frames over 10 seconds`);
  assert.equal(raf.size, 0, 'foreground rate must not depend on monitor RAF');
  game.frameRate = 60;
  assert.equal(game.frameRate, rate, 'game menu must not overwrite the GPNext limit');
  assert.equal(game.frameTime, 1000/rate);
  game._pacer.stop();
  assert.equal(timers.size, 0);
}
applyFrameRate(game, 120);
game._pacer.start();
clock += 5000;
step();
const afterStall = ticks;
step();
assert.equal(ticks, afterStall + 1);
assert.ok([...timers.values()][0].at > clock, 'no catch-up burst after a stall');
// Change limits without stopping the running game.
applyFrameRate(game, 30);
const beforeChange = ticks;
const changeStart = clock;
for(let i=0;i<30;i++) step();
assert.equal(ticks-beforeChange, 30);
assert.ok(Math.abs(clock-changeStart-1000) <= 1);
// A hidden webview returns to the browser's throttled scheduler.
document.hidden = true;
const beforeHidden = ticks;
step();
assert.equal(ticks, beforeHidden);
assert.equal(timers.size, 0);
assert.equal(raf.size, 1);
game._pacer.stop();
assert.equal(raf.size, 0, 'hidden fallback must cancel cleanly');
document.hidden = false;
game._pacer.start(); step();
assert.equal(ticks, beforeHidden+1);
game._pacer.stop();
assert.equal(timers.size, 0);
console.log('Passed: real Cocos scheduler at 30–240 FPS, Unlimited migration to 120, live rate changes, pause/resume, background throttling and stall recovery.');

const {FrameHistory} = await import('../../public/gpnext/runtime/FrameHistory.js');
const history = new FrameHistory(3);
history.push({ts: 1}); history.push({ts: 2});
assert.deepEqual(history.toArray().map(frame => frame.ts), [1, 2]);
for (let ts = 3; ts <= 10000; ts++) history.push({ts});
assert.deepEqual(history.toArray().map(frame => frame.ts), [9998, 9999, 10000]);
const snapshot = history.toArray(); history.push({ts: 10001});
assert.deepEqual(snapshot.map(frame => frame.ts), [9998, 9999, 10000]);
console.log('Passed: bounded performance history retains chronological samples across wraparound.');

// Cancelling between the timer and its message must not deliver a stale frame.
game._pacer.start();
const [pendingId, pendingTimer] = timers.entries().next().value;
clock = pendingTimer.at; timers.delete(pendingId); pendingTimer.fn();
const beforeCancel = ticks;
game._pacer.stop(); messages.shift()();
assert.equal(ticks, beforeCancel);
assert.equal(timers.size, 0);
console.log('Passed: pending message cancellation without rendering or requeuing.');
