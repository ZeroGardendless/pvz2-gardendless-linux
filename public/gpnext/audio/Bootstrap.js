import { AudioEngine } from "./AudioEngine.js";
function usesLinuxAudio(userAgent) {
  return /Linux/.test(userAgent) && !/(?:Chrome|Chromium|Edg)\//.test(userAgent);
}
if (typeof window !== "undefined" && usesLinuxAudio(globalThis.navigator?.userAgent || "")) {
  window.__gdAudio = new AudioEngine(window, { preferMedia: true });
  const invoke = window.__TAURI_INTERNALS__?.invoke;
  if (invoke) {
    try {
      await invoke("native_audio_ready");
      const { listen } = window.__TAURI__.event;
      const { NativeAudioEngine } = await import("./NativeAudio.js");
      const fallback = window.__gdAudio;
      const native = new NativeAudioEngine(window, invoke, listen);
      await native.ready;
      window.__gdAudio = native;
      fallback.closed = true;
      for (const event of ["pointerdown", "touchend", "keydown"]) window.removeEventListener(event, fallback.unlock, true);
      console.debug("[Audio] Native single-stream mixer ready");
    } catch (error) {
      console.warn("[Audio] Native mixer unavailable; using media fallback", error);
    }
  }
}
export {
  usesLinuxAudio
};
