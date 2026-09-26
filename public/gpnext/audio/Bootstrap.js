import {AudioEngine} from './AudioEngine.js';

export function usesLinuxAudio(userAgent) {
  return /Linux/.test(userAgent) && !/(?:Chrome|Chromium|Edg)\//.test(userAgent);
}

if (typeof window !== 'undefined' && usesLinuxAudio(globalThis.navigator?.userAgent || '')) {
  window.__gdAudio = new AudioEngine(window);
  console.debug('[Audio] GPNext audio: cached effects and streamed music ready');
}
