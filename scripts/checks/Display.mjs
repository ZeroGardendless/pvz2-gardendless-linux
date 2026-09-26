import assert from 'node:assert/strict';

let saved = null;
globalThis.localStorage = {
  getItem(key) { return key === 'gp-next-settings' ? saved : null; },
  setItem(key, value) { if (key === 'gp-next-settings') saved = value; }
};
for (const [input, expected] of [
  [null, '120'], [{version: 3, frameRate: '60'}, '120'],
  [{version: 3, frameRate: '0'}, '120'], [{version: 3, frameRate: '144'}, '144'],
  [{version: 4, frameRate: '60'}, '60']
]) {
  saved = JSON.stringify(input);
  const store = await import(`../../public/gpnext/core/SettingsStore.js?case=${expected}-${JSON.stringify(input)}`);
  assert.equal(store.getSettings().frameRate, expected);
  store.setSettings({widescreen: 'fog'});
  assert.equal(JSON.parse(saved).widescreen, 'fog');
  store.setSettings({widescreen: 'invalid'});
  assert.equal(store.getSettings().widescreen, 'none');
}
// Exercise the actual renderer with controlled image loads and canvas sizes.
class Element {
  style = {}; children = []; hidden = false;
  append(...children) { this.children.push(...children); }
  appendChild(child) {this.append(child);}
  addEventListener(event, callback) {this[event] = callback;}
  setAttribute() {}
  get firstChild() { return this.children[0]; }
  get lastChild() { return this.children.at(-1); }
}
let rectangle = {left: 0, top: 0, width: 2560, height: 1080};
const canvas = {getBoundingClientRect: () => rectangle};
const body = new Element();
globalThis.document = {body, getElementById: () => canvas, createElement: () => new Element(), addEventListener() {}};
globalThis.window = {addEventListener() {}};
let resize;
globalThis.ResizeObserver = class {constructor(callback) {resize = callback;} observe() {}};
const frames = [];
globalThis.requestAnimationFrame = callback => {frames.push(callback); return frames.length;};
let failImages = false;
let requireSubfolder = true;
globalThis.Image = class {
  naturalWidth = 270; naturalHeight = 1080;
  set src(url) {this.url = url; this.naturalWidth = url.includes("_middle.png") ? 1080 : 270; queueMicrotask(() => failImages || (requireSubfolder && !url.includes("/widescreen/fog/") && !url.includes("/widescreen/bushes/")) ? this.onerror() : this.onload());}
  get src() {return this.url;}
};
const store = await import('../../public/gpnext/core/SettingsStore.js');
store.setSettings({widescreen: 'fog'});
const display = await import('../../public/gpnext/runtime/Widescreen.js');
assert.equal(display.widescreenGeometry(3840,2160).gutter, 960);
assert.equal(display.widescreenGeometry(1920,1080).gutter, 0);
assert.equal(display.widescreenGeometry(1080,1920).gutter, 0);
assert.equal(display.widescreenGeometry(5120,1440).gutter, 1600);
for (const height of [400, 1080, 1200, 1440, 2160]) {
  assert.equal(display.widescreenGeometry(1920,height).gutter, 0);
  assert.equal(display.widescreenGeometry(2560,height).gutter, 320);
}
display.initWidescreen();
await new Promise(resolve => setImmediate(resolve));
const layer = body.firstChild;
assert.equal(layer.hidden, false);
assert.match(layer.firstChild.firstChild.style.backgroundImage, /widescreen\/fog\/fog_left/);
assert.equal(layer.firstChild.style.width, '590px');
assert.equal(layer.firstChild.firstChild.style.width, '270px');
assert.equal(layer.firstChild.lastChild.style.width, '321px');
rectangle = {...rectangle, width: 1920};
resize(); resize();
assert.equal(frames.length, 1, 'coalesce resize callbacks');
frames.shift()();
assert.equal(layer.hidden, true);
assert.equal(layer.style.display, 'none', 'must override the game global div display rule');
console.log('Passed: settings migration/persistence, widescreen geometry/rendering and coalesced resize.');

const panel = new Element();
display.renderWidescreenSettings(panel);
const picker = panel.firstChild.children[1];
const flush = () => new Promise(resolve => setImmediate(resolve));
picker.value = 'none'; picker.change(); await flush();
assert.equal(layer.firstChild.firstChild.style.backgroundImage, 'none');
assert.equal(layer.lastChild.firstChild.style.backgroundImage, 'none');
assert.equal(layer.firstChild.lastChild.style.backgroundImage, 'none');
assert.equal(layer.hidden, true);
assert.equal(layer.style.display, 'none', 'must override the game global div display rule');
failImages = true;
picker.value = 'bushes'; picker.change(); await flush();
assert.equal(layer.hidden, true);
assert.equal(layer.style.display, 'none', 'must override the game global div display rule');
assert.match(panel.lastChild.textContent, /missing/i);
failImages = false;
rectangle = {...rectangle, width: 3440, height: 1440};
picker.value = 'none'; picker.change(); await flush();
assert.equal(layer.firstChild.firstChild.style.backgroundImage, 'none');
assert.equal(layer.lastChild.firstChild.style.backgroundImage, 'none');
assert.equal(layer.firstChild.lastChild.style.backgroundImage, 'none');
picker.value = 'bushes'; picker.change(); await flush();
assert.equal(layer.hidden, false);
assert.equal(layer.firstChild.style.width, '1120px');
assert.equal(store.getSettings().widescreen, 'bushes');
assert.match(layer.firstChild.firstChild.style.backgroundImage, /bushes_left\.png/);
picker.value = 'none'; picker.change(); await flush();
assert.equal(layer.firstChild.firstChild.style.backgroundImage, 'none');
assert.equal(layer.lastChild.firstChild.style.backgroundImage, 'none');
assert.equal(layer.firstChild.lastChild.style.backgroundImage, 'none');
assert.equal(layer.hidden, true);
assert.equal(layer.style.display, 'none', 'must override the game global div display rule');
console.log('Passed: None/Fog/Bushes controls, missing artwork fallback and retry.');
