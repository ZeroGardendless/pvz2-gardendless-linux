import assert from 'node:assert/strict';
import {readMusicPackFiles} from '../../public/gpnext/platform/GameFiles.js';
import {prepareMusicPack,validateMusicManifest} from '../../public/game-music-packs.js';
import {gameFetch} from '../../public/game-http.js';
const manifest={id:'fixture.music',audio:{first:'audio/clip.mp3',second:'audio/clip.mp3'}};
let reads=0;
const fs={stat:async path=>({size:path.endsWith('pack.json')?100:3}),readTextFile:async()=>JSON.stringify(manifest),readFile:async path=>{assert.equal(path,'/chosen/audio/clip.mp3');reads++;return new Uint8Array([1,2,3]);}};
const files=await readMusicPackFiles('/chosen',fs),pack=await prepareMusicPack(files);
assert.equal(reads,1);assert.deepEqual([...pack.audioFiles['audio/clip.mp3']],[1,2,3]);
for(const path of ['../outside.mp3','/absolute.mp3','audio/../../outside.mp3','C:\\audio.mp3','audio//clip.mp3'])assert.throws(()=>validateMusicManifest({...manifest,audio:{clip:path}}),/Invalid audio path/);
await assert.rejects(()=>readMusicPackFiles('/chosen',{...fs,stat:async()=>({size:129*1024*1024})}),/manifest exceeds/);
await assert.rejects(()=>readMusicPackFiles('/chosen',{...fs,readFile:async()=>new Uint8Array(2)}),/changed while reading/);
const previous=globalThis.window;
try{
 globalThis.window={__TAURI_INTERNALS__:{invoke:async(command,args)=>{assert.equal(command,'game_http_get');assert.equal(args.limit,100);return new TextEncoder().encode('{"works":true}').buffer;}}};
 assert.deepEqual(await(await gameFetch('https://pvzge.com/jsons/gameinfo.json',100)).json(),{works:true});
}finally{if(previous===undefined)delete globalThis.window;else globalThis.window=previous;}
console.log('Game windows: declared-file imports, deduplication, limits, byte preservation and native binary response decoding passed.');
