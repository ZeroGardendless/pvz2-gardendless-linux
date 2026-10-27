import { a, i as t, n } from "../platform/FileSystem.js";
import { t as r } from "./PackSnapshot.js";
import { t as i } from "../platform/Dialog.js";
async function pickModPackage({ directory: a2 = false } = {}) {
  let o = await i({ directory: a2, recursive: a2, multiple: false, ...a2 ? {} : { filters: [{ name: `Mod ZIP`, extensions: [`zip`] }] } });
  if (o === null) return null;
  if (typeof o != `string`) throw Error(`Select one mod package`);
  let s = a2 ? `selection` : `selection.zip`, c = (e2) => {
    if (e2 !== s && !e2.startsWith(s + `/`)) throw Error(`Read is outside the selected mod`);
    return o.replace(/[\\/]+$/, ``) + e2.slice(s.length);
  };
  return r(s, { lstat: (e2) => n(c(e2)), readDir: (e2) => t(c(e2)), readFile: (t2) => a(c(t2)) });
}
export {
  pickModPackage
};
