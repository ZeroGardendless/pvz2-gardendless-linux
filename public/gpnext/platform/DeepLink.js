import { r } from "./Bridge.js";
import { i } from "./Events.js";
async function getCurrent() {
  return await r(`plugin:deep-link|get_current`);
}
async function register(t2) {
  return await r(`plugin:deep-link|register`, { protocol: t2 });
}
async function unregister(t2) {
  return await r(`plugin:deep-link|unregister`, { protocol: t2 });
}
async function isRegistered(t2) {
  return await r(`plugin:deep-link|is_registered`, { protocol: t2 });
}
async function onOpenUrl(e2) {
  return await i(`deep-link://new-url`, (t2) => {
    e2(t2.payload);
  });
}
export {
  getCurrent,
  isRegistered,
  onOpenUrl,
  register,
  unregister
};
