import { i as e, r as t } from "./Bridge.js";
var n;
(function(e2) {
  e2.WINDOW_RESIZED = `tauri://resize`, e2.WINDOW_MOVED = `tauri://move`, e2.WINDOW_CLOSE_REQUESTED = `tauri://close-requested`, e2.WINDOW_DESTROYED = `tauri://destroyed`, e2.WINDOW_FOCUS = `tauri://focus`, e2.WINDOW_BLUR = `tauri://blur`, e2.WINDOW_SCALE_FACTOR_CHANGED = `tauri://scale-change`, e2.WINDOW_THEME_CHANGED = `tauri://theme-changed`, e2.WINDOW_CREATED = `tauri://window-created`, e2.WINDOW_SUSPENDED = `tauri://suspended`, e2.WINDOW_RESUMED = `tauri://resumed`, e2.WEBVIEW_CREATED = `tauri://webview-created`, e2.DRAG_ENTER = `tauri://drag-enter`, e2.DRAG_OVER = `tauri://drag-over`, e2.DRAG_DROP = `tauri://drag-drop`, e2.DRAG_LEAVE = `tauri://drag-leave`;
})(n ||= {});
async function r(e2, n2) {
  window.__TAURI_EVENT_PLUGIN_INTERNALS__.unregisterListener(e2, n2), await t(`plugin:event|unlisten`, { event: e2, eventId: n2 });
}
async function i(n2, i2, a2) {
  return t(`plugin:event|listen`, { event: n2, target: typeof a2?.target == `string` ? { kind: `AnyLabel`, label: a2.target } : a2?.target ?? { kind: `Any` }, handler: e(i2) }).then((e2) => async () => r(n2, e2));
}
async function a(e2, t2, n2) {
  return i(e2, (n3) => {
    r(e2, n3.id), t2(n3);
  }, n2);
}
async function o(e2, n2) {
  await t(`plugin:event|emit`, { event: e2, payload: n2 });
}
async function s(e2, n2, r2) {
  await t(`plugin:event|emit_to`, { target: typeof e2 == `string` ? { kind: `AnyLabel`, label: e2 } : e2, event: n2, payload: r2 });
}
export {
  a,
  i,
  o as n,
  s as r,
  n as t
};
