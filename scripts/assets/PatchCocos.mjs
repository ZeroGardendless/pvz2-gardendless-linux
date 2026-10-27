import {readFile, readdir} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

/** Validate the runtime boundary without rewriting upstream game/engine code. */
export async function findEngineFile() {
  const root = new URL('../../public/cocos-js/', import.meta.url);
  const files = (await readdir(root)).filter(name => /^_virtual_cc-[a-f0-9]+\.js$/.test(name));
  if (files.length !== 1) throw new Error('Expected one matching Cocos engine bundle');
  return new URL(files[0], root);
}
export function patchCocosSource(source) { return source; }
export async function applyCocosPatches() {
  const source = await readFile(await findEngineFile(), 'utf8');
  for (const marker of ['loadOneShotAudio', 'onPreProjectInitDelegate', 'onPostProjectInitDelegate', '_stTime']) {
    if (!source.includes(marker)) throw new Error(`Cocos compatibility changed: missing ${marker}`);
  }
  const manifest = JSON.parse(await readFile(new URL('../../public/audio/manifest.json', import.meta.url), 'utf8'));
  if (!Object.keys(manifest).length || Object.values(manifest).some(path => typeof path !== 'string' || path.split('/').includes('..'))) throw new Error('Invalid named audio manifest');
  console.log('Validated Cocos runtime hooks and named audio manifest; upstream bundles remain unchanged.');
}
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) await applyCocosPatches();
