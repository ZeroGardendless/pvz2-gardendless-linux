import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source = readFileSync(new URL('../../public/gpnext/core/NestPackWorker.js', import.meta.url), 'utf8');
export function unpackFixture(bytes) {
  let result;
  const context = {Uint8Array, Uint16Array, Int32Array, DataView, TextDecoder, TextEncoder};
  context.self = {postMessage(data, transfer) { result = structuredClone(data, {transfer}); }};
  vm.runInNewContext(source, context);
  context.self.onmessage({data: bytes});
  if (result.error) throw new Error(result.error);
  return result.entries;
}
