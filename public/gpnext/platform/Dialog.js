import { r } from "./Bridge.js";
async function t(t2 = {}) {
  return typeof t2 == `object` && Object.freeze(t2), await r(`plugin:dialog|open`, { options: t2 });
}
async function n(t2 = {}) {
  return typeof t2 == `object` && Object.freeze(t2), await r(`plugin:dialog|save`, { options: t2 });
}
export {
  n,
  t
};
