import {createAurumHost} from './Host.js';
export {createAurumHost};
export const aurumHost = createAurumHost();
if (typeof window !== 'undefined') {
  Object.defineProperty(globalThis, '__gardendlessAurumHost', {value: aurumHost, configurable: true});
}
