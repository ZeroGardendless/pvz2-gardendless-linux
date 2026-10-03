import {readFile, writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const engineFile = new URL('../../public/cocos-js/_virtual_cc-9deb4621.js', import.meta.url);
const webCondition = argument => `(null==${argument}?void 0:${argument}.audioLoadMode)!==u9.DOM_AUDIO&&R9.support`;
const bindGame = 'window.__gdAudio.bindGame(EB,bB.EVENT_PAUSE,bB.EVENT_RESUME);';

export function patchCocosSource(source) {
  // Migrate the old DOM-only patch, including its missing space after return.
  source = source
    .replace('var n=window.__gdAcquireAudio?window.__gdAcquireAudio(t):document.createElement("audio"),r="canplaythrough"',
      'var n=document.createElement("audio"),r="canplaythrough"')
    .replace('0===n.readyState?h():o()}),3e4),a=function()', '0===n.readyState?h():o()}),8e3),a=function()')
    .replace('false?O9.load(e)', `${webCondition('i')}?O9.load(e)`)
    .replace('returnfalse?O9.loadNative(t)', `return${webCondition('e')}?O9.loadNative(t)`)
    .replace('return false?O9.loadNative(t)', `return${webCondition('e')}?O9.loadNative(t)`)
    .replace('false?O9.loadOneShotAudio(t,e)', `${webCondition('i')}?O9.loadOneShotAudio(t,e)`);

  const hooks = [
    ['frame-rate default', 'this._targetFrameRate=60,', 'this._targetFrameRate=999,'],
    ['audio player factory',
      `t.load=function(e,i){return new Promise((function(n,r){${webCondition('i')}?O9.load(e)`,
      `t.load=function(e,i){if(window.__gdAudio){${bindGame}return window.__gdAudio.load(e,i).then(function(e){return new t(e)})}return new Promise((function(n,r){${webCondition('i')}?O9.load(e)`],
    ['native audio factory',
      `t.loadNative=function(t,e){return${webCondition('e')}?O9.loadNative(t)`,
      `t.loadNative=function(t,e){if(window.__gdAudio)return window.__gdAudio.loadNative(t,e);return${webCondition('e')}?O9.loadNative(t)`],
    ['one-shot audio factory',
      `t.loadOneShotAudio=function(t,e,i){return new Promise((function(n,r){${webCondition('i')}?O9.loadOneShotAudio(t,e)`,
      `t.loadOneShotAudio=function(t,e,i){if(window.__gdAudio){${bindGame}return window.__gdAudio.loadOneShotAudio(t,e,i).then(function(t){return new L9(t)})}return new Promise((function(n,r){${webCondition('i')}?O9.loadOneShotAudio(t,e)`],
  ];
  for (const [name, upstream, patched] of hooks) {
    if (source.includes(patched)) continue;
    if (source.split(upstream).length !== 2) {
      throw new Error(`Cannot restore ${name}: Cocos changed. Review ${engineFile.pathname} before building.`);
    }
    source = source.replace(upstream, patched);
  }
  if (source.includes('returnfalse') || source.includes('__gdAcquireAudio')) {
    throw new Error('An obsolete Cocos audio patch remains; refusing to build.');
  }
  return source;
}

export async function applyCocosPatches() {
  const original = await readFile(engineFile, 'utf8');
  const patched = patchCocosSource(original);
  if (patched !== original) {
    await writeFile(engineFile, patched);
    console.log('Updated Cocos factories for the GPNext audio engine.');
  }
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await applyCocosPatches();
