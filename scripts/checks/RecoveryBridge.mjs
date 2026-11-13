import assert from 'node:assert/strict';
import {r as invoke} from '../../public/gpnext/platform/Bridge.js';
import {f as invokeCloud} from '../../public/gpnext/platform/CloudJson.js';
const previous=globalThis.window;globalThis.window={};
try {
 for(const call of [invoke,invokeCloud])await assert.rejects(call('fixture'),/Native desktop connection unavailable/);
 let request;
 globalThis.window.__TAURI_INTERNALS__={invoke:async(...args)=>{request=args;return 'native reply';}};
 for(const call of [invoke,invokeCloud]){
  assert.equal(await call('fixture',{profile:'test'}),'native reply');
  assert.deepEqual(request,['fixture',{profile:'test'},undefined]);
 }
 globalThis.window.__TAURI_INTERNALS__.invoke=async()=>{throw Error('Permission denied fixture');};
 await assert.rejects(invoke('fixture'),/Permission denied fixture/);
 console.log('Native bridge: missing-host errors are actionable; valid requests and native errors pass through.');
}finally{globalThis.window=previous;}
