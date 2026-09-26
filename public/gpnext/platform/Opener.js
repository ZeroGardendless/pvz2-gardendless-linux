import { r } from "./Bridge.js";
async function t(t2, n2) {
  await r(`plugin:opener|open_url`, { url: t2, with: n2 });
}
async function n(t2, n2) {
  await r(`plugin:opener|open_path`, { path: t2, with: n2 });
}
export {
  t as n,
  n as t
};
