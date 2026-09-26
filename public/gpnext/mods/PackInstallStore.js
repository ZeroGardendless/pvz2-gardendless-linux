import { a as e, c as t, d as n, i as r, l as i, n as a, r as o, s, t as c } from "../platform/FileSystem.js";
import { n as l, t as u } from "./PackSnapshot.js";
var d = `gp-next/installed`, f = { baseDir: n.AppData }, p = { exists: (e2) => c(e2, f), mkdir: (e2) => o(e2, { ...f, recursive: true }), readDir: (e2) => r(e2, f), readFile: (t2) => e(t2, f), writeFile: (e2, t2) => i(e2, t2, f), lstat: (e2) => a(e2, f), rename: (e2, r2) => t(e2, r2, { oldPathBaseDir: n.AppData, newPathBaseDir: n.AppData }), remove: (e2) => s(e2, { ...f, recursive: true }) }, m = (e2, t2, n2) => Object.assign(Error(t2), { code: e2, path: n2 });
function h(e2) {
  if (typeof e2 != `string` || !/^[a-f0-9]{64}$/.test(e2)) throw m(`INSTALL_INVALID_DIGEST`, `Invalid package digest`);
}
function g(e2) {
  if (e2?.aborted) throw m(`INSTALL_CANCELLED`, `Package installation cancelled`);
}
function createPackInstallStore(e2 = p) {
  let t2 = Promise.resolve();
  async function n2(t3) {
    let n3 = t3.split(`/`);
    for (let t4 = 1; t4 <= n3.length; t4++) {
      let r3 = n3.slice(0, t4).join(`/`), i2 = await e2.lstat(r3);
      if (i2.isSymlink || !i2.isDirectory) throw m(`INSTALL_INVALID_PATH`, `Cache path is not a regular directory`, r3);
    }
  }
  async function r2(t3) {
    h(t3);
    let n3 = `${d}/${t3}`;
    if (!await e2.exists(n3) && (!await e2.exists(d) || !(await e2.readDir(d)).some((e3) => e3.name === t3))) return null;
    try {
      let r3 = await u(n3, e2);
      if (r3.digest !== t3) throw Error(`Package digest does not match stored bytes`);
      return r3;
    } catch (e3) {
      throw Object.assign(m(`INSTALL_CORRUPT`, `Installed package is corrupt`, n3), { cause: e3 });
    }
  }
  return Object.freeze({ read: r2, install(i2, { signal: a2 } = {}) {
    let o2, s2;
    try {
      s2 = i2.digest, h(s2), o2 = i2.listPaths().map((e3) => {
        let t3 = i2.readBytes(e3);
        if (!(t3 instanceof Uint8Array)) throw m(`INSTALL_INVALID_SNAPSHOT`, `Missing snapshot bytes`, e3);
        return [e3, t3.slice()];
      });
    } catch (e3) {
      return Promise.reject(e3);
    }
    let c2 = t2.then(async () => {
      g(a2);
      let t3 = await l(o2);
      if (t3.digest !== s2) throw m(`INSTALL_INVALID_SNAPSHOT`, `Snapshot digest does not match bytes`);
      if (await r2(s2)) return Object.freeze({ digest: s2, reused: true });
      for (let t4 of [`gp-next`, d]) await e2.exists(t4) ? await n2(t4) : await e2.mkdir(t4);
      await n2(d);
      let i3 = `${d}/pending-${globalThis.crypto.randomUUID()}`, c3 = `${d}/${s2}`, f2 = false;
      try {
        if (await e2.exists(i3)) throw m(`INSTALL_TEMP_EXISTS`, `Temporary cache path already exists`, i3);
        await e2.mkdir(i3), f2 = true;
        for (let n3 of t3.listPaths()) {
          g(a2);
          let r3 = n3.lastIndexOf(`/`);
          r3 >= 0 && await e2.mkdir(`${i3}/${n3.slice(0, r3)}`), await e2.writeFile(`${i3}/${n3}`, t3.readBytes(n3));
        }
        if ((await u(i3, e2)).digest !== s2) throw m(`INSTALL_CORRUPT`, `Temporary package failed byte verification`, i3);
        if (g(a2), await r2(s2)) return await e2.remove(i3), f2 = false, Object.freeze({ digest: s2, reused: true });
        g(a2);
        try {
          await e2.rename(i3, c3);
        } catch (t4) {
          if (!await r2(s2)) throw t4;
          return await e2.remove(i3), f2 = false, Object.freeze({ digest: s2, reused: true });
        }
        return f2 = false, await r2(s2), Object.freeze({ digest: s2, reused: false });
      } catch (t4) {
        if (f2) try {
          await e2.remove(i3);
        } catch (e3) {
          throw Object.assign(AggregateError([t4, e3], `Install failed; temporary cache remains`), { code: `INSTALL_CLEANUP_FAILED`, path: i3 });
        }
        throw t4;
      }
    });
    return t2 = c2.catch(() => {
    }), c2;
  }, async inspect() {
    if (await t2, !await e2.exists(d)) return [];
    await n2(d);
    let i2 = [];
    for (let t3 of await e2.readDir(d)) {
      let e3 = t3.name;
      if (/^[a-f0-9]{64}$/.test(e3)) try {
        await r2(e3), i2.push({ name: e3, status: `valid` });
      } catch (t4) {
        i2.push({ name: e3, status: `corrupt`, error: t4.message });
      }
      else i2.push({ name: e3, status: /^(?:\.)?pending-/.test(e3) ? `pending` : `unknown` });
    }
    return i2;
  } });
}
export {
  createPackInstallStore
};
