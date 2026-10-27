import { f } from "./CloudJson.js";
async function t(t2 = {}) {
  return typeof t2 == `object` && Object.freeze(t2), await f(`plugin:dialog|open`, { options: t2 });
}
async function n(t2 = {}) {
  return typeof t2 == `object` && Object.freeze(t2), await f(`plugin:dialog|save`, { options: t2 });
}
export {
  n,
  t
};
