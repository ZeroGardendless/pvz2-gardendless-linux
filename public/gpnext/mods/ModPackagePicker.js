import { t as e } from "../platform/Dialog.js";
import { a, i as n, n as r } from "../platform/FileSystem.js";
import { t as i } from "./PackSnapshot.js";
async function pickModPackage({ directory: a2 = false } = {}) {
  let o = await e({ directory: a2, recursive: a2, multiple: false, ...a2 ? {} : { filters: [{ name: `Mod ZIP`, extensions: [`zip`] }] } });
  if (o === null) return null;
  if (typeof o != `string`) throw Error(`Select one mod package`);
  let s = a2 ? `selection` : `selection.zip`, c = (e2) => {
    if (e2 !== s && !e2.startsWith(s + `/`)) throw Error(`Read is outside the selected mod`);
    return o.replace(/[\\/]+$/, ``) + e2.slice(s.length);
  };
  return i(s, { lstat: (e2) => r(c(e2)), readDir: (e2) => n(c(e2)), readFile: (e2) => a(c(e2)) });
}
export {
  pickModPackage
};
