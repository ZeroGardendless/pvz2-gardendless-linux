import { c as e, d, o as n, r, s as i, t, u as o } from "../platform/FileSystem.js";
var s = `gp-next`, c = `${s}/configuration-state.json`, l = `${c}.pending`, u = { baseDir: d.AppData };
function createConfigurationStorage(d2 = { exists: t, mkdir: r, readTextFile: n, writeTextFile: o, rename: e, remove: i }) {
  let f = Promise.resolve(), p = (e2, n2) => {
    let r2 = JSON.stringify(e2);
    if (r2 === void 0) throw TypeError(`Configuration record must be JSON`);
    let i2 = f.then(async () => {
      if (n2 && await d2.exists(c, u)) throw Error(`Platform configuration already exists`);
      await d2.mkdir(s, { ...u, recursive: true });
      try {
        if (await d2.writeTextFile(l, r2, u), n2 && (await n2(), await d2.exists(c, u))) throw Error(`Platform configuration already exists`);
        await d2.rename(l, c, { oldPathBaseDir: d.AppData, newPathBaseDir: d.AppData });
      } catch (e3) {
        try {
          await d2.exists(l, u) && await d2.remove(l, u);
        } catch (t2) {
          throw AggregateError([e3, t2], `Configuration write and temporary-file cleanup failed`);
        }
        throw e3;
      }
    });
    return f = i2.catch(() => {
    }), i2;
  };
  return { async read() {
    return await f, await d2.exists(c, u) ? JSON.parse(await d2.readTextFile(c, u)) : null;
  }, write: p, initialize(e2, t2) {
    if (typeof t2 != `function`) throw Error(`Migration revalidation is required`);
    return p(e2, t2);
  } };
}
export {
  createConfigurationStorage
};
