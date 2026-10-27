import {readFile, writeFile} from 'node:fs/promises';
import {transform} from 'esbuild';

// Preserve cooldown order and object identity without copying the list or
// searching and shifting it once per expired sound.
export function advanceCooldowns(entries, delta) {
  let write = 0;
  for (let read = 0; read < entries.length; read++) {
    const entry = entries[read];
    if (entry.cooldown > 0) entry.cooldown -= delta * entry.speed;
    if (!(entry.cooldown <= 0)) entries[write++] = entry;
  }
  entries.length = write;
}

export function advancePauseFade(controller, paused, delta) {
  const step = Math.max(0, Number(delta) || 0) * 2;
  controller._volumeScalePause = paused
    ? Math.max(0, controller._volumeScalePause - step)
    : Math.min(1, controller._volumeScalePause + step);
  // Keep normal pitch until the fade finishes. A zero playback rate is not
  // supported by the media backend; silence is controlled by volume instead.
  controller._speedScalePause = 1;
  // Suspend native music only after it is silent. Resume from its frozen
  // position as the gain rises; menu sound effects remain available.
  globalThis.window?.__gdAudio?.setPauseFade?.(paused && controller._volumeScalePause === 0);
}

const gameFile = new URL('../../public/assets/main/index.js', import.meta.url);

export async function patchGameAudioSource(source) {
  const compact = async fn => {
    // Keep a declaration: minifying an unused function expression erases it.
    const {code} = await transform(`var gdAudioPatch = ${fn.toString()}`, {
      minifyWhitespace: true, minifySyntax: true, minifyIdentifiers: false, treeShaking: false,
    });
    return `(${code.trim().replace(/^var gdAudioPatch=/, '').replace(/;$/, '')})`;
  };
  const cooldown = await compact(advanceCooldowns);
  const fade = await compact(advancePauseFade);
  for (const field of ['coolingDownSounds', 'coolingDownSoundArrays']) {
    const original = `this.${field}.concat().forEach((function(e){if(e.cooldown>0&&(e.cooldown-=t*e.speed),e.cooldown<=0){var n=i.${field}.indexOf(e);-1!=n&&i.${field}.splice(n,1)}}))`;
    const patched = `${cooldown}(this.${field},t)`;
    if (source.includes(patched)) continue;
    if (source.split(original).length !== 2) throw new Error(`Game audio changed: review ${field} before patching.`);
    source = source.replace(original, patched);
  }
  const original = 'this.paused&&H._volumeScalePause>0?(H._volumeScalePause=Math.max(0,H._volumeScalePause-1/60),H._speedScalePause=Math.sign(H._volumeScalePause)):!this.paused&&H._volumeScalePause<1&&(H._volumeScalePause=Math.min(1,H._volumeScalePause+1/60),H._speedScalePause=Math.sign(H._volumeScalePause))';
  const patched = `${fade}(H,this.paused,e)`;
  if (!source.includes(patched)) {
    if (source.split(original).length === 2) source = source.replace(original, patched);
    else {
      const end = source.indexOf('(H,this.paused,e)');
      const begin = source.lastIndexOf('(function(', end);
      const previous = source.slice(begin, end);
      if (begin < 0 || previous.length > 800 || !previous.endsWith('controller._speedScalePause=1})') || !previous.includes('controller._volumeScalePause')) {
        throw new Error('Game pause fade changed: review UI.ts before patching.');
      }
      source = source.slice(0, begin) + fade + source.slice(end);
    }
  }
  return source;
}

export async function applyGameAudioPatches() {
  const source = await readFile(gameFile, 'utf8');
  const patched = await patchGameAudioSource(source);
  if (source !== patched) {
    await writeFile(gameFile, patched);
    console.log('Updated game audio cooldowns and half-second pause fade.');
  }
}
