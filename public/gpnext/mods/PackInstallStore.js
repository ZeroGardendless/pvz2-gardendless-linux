import { f as e } from "../platform/CloudJson.js";
import { a as t, c as n, f as r, i, n as a, r as o, s, t as c, u as l } from "../platform/FileSystem.js";
import { n as u, t as d } from "./PackSnapshot.js";
var f = `gp-next/installed`, p = { baseDir: r.AppData }, m = { installSnapshot: (t2, n2) => e(`gp_next_install_pack`, { digest: t2, files: n2.listPaths().map((e2) => {
  let t3 = n2.readBytes(e2), r2 = ``;
  for (let e3 = 0; e3 < t3.length; e3 += 8192) r2 += String.fromCharCode(...t3.subarray(e3, e3 + 8192));
  return { path: e2, base64: btoa(r2) };
}) }), async readSnapshot(t2) {
  let n2 = await e(`gp_next_read_installed_pack`, { digest: t2 });
  return n2 === null ? null : u(n2.map((e2) => [e2.path, Uint8Array.from(atob(e2.base64), (e3) => e3.charCodeAt(0))]));
}, exists: (e2) => c(e2, p), mkdir: (e2) => o(e2, { ...p, recursive: true }), readDir: (e2) => i(e2, p), readFile: (e2) => t(e2, p), writeFile: (e2, t2) => l(e2, t2, p), lstat: (e2) => a(e2, p), rename: (e2, t2) => n(e2, t2, { oldPathBaseDir: r.AppData, newPathBaseDir: r.AppData }), remove: (e2) => s(e2, { ...p, recursive: true }) }, h = (e2, t2, n2) => Object.assign(Error(t2), { code: e2, path: n2 }), g = /* @__PURE__ */ new WeakMap();
function _(e2) {
  if (typeof e2 != `string` || !/^[a-f0-9]{64}$/.test(e2)) throw h(`INSTALL_INVALID_DIGEST`, `Invalid package digest`);
}
function v(e2) {
  if (e2?.aborted) throw h(`INSTALL_CANCELLED`, `Package installation cancelled`);
}
function createPackInstallStore(e2 = m) {
  if (g.has(e2)) return g.get(e2);
  let t2 = Promise.resolve(), n2 = /* @__PURE__ */ new Map();
  async function r2(t3) {
    let n3 = t3.split(`/`);
    for (let t4 = 1; t4 <= n3.length; t4++) {
      let r3 = n3.slice(0, t4).join(`/`), i3 = await e2.lstat(r3);
      if (i3.isSymlink || !i3.isDirectory) throw h(`INSTALL_INVALID_PATH`, `Cache path is not a regular directory`, r3);
    }
  }
  async function i2(t3, n3) {
    _(t3);
    let r3 = `${f}/${t3}`;
    if (e2.readSnapshot) try {
      let r4 = await e2.readSnapshot(t3);
      if (r4 && !n3 && r4.digest !== t3) throw Error(`Package digest does not match stored bytes`);
      return r4;
    } catch (e3) {
      throw Object.assign(h(`INSTALL_CORRUPT`, `Installed package is corrupt`, r3), { cause: e3 });
    }
    if (!await e2.exists(r3) && (!await e2.exists(f) || !(await e2.readDir(f)).some((e3) => e3.name === t3))) return null;
    try {
      let i3 = await d(r3, e2);
      if (!n3 && i3.digest !== t3) throw Error(`Package digest does not match stored bytes`);
      return i3;
    } catch (e3) {
      throw Object.assign(h(`INSTALL_CORRUPT`, `Installed package is corrupt`, r3), { cause: e3 });
    }
  }
  async function a2(e3, { allowContentMismatch: t3 = false, verify: r3 = false } = {}) {
    if (_(e3), t3) return i2(e3, true);
    if (r3 && n2.delete(e3), !n2.has(e3)) {
      let t4 = i2(e3, false).then((r4) => (!r4 && n2.get(e3) === t4 && n2.delete(e3), r4)).catch((r4) => {
        throw n2.get(e3) === t4 && n2.delete(e3), r4;
      });
      n2.set(e3, t4);
    }
    return n2.get(e3);
  }
  let o2 = Object.freeze({ read: a2, install(i3, { signal: o3 } = {}) {
    let s2, c2;
    try {
      c2 = i3.digest, _(c2), s2 = i3.listPaths().map((e3) => {
        let t3 = i3.readBytes(e3);
        if (!(t3 instanceof Uint8Array)) throw h(`INSTALL_INVALID_SNAPSHOT`, `Missing snapshot bytes`, e3);
        return [e3, t3.slice()];
      });
    } catch (e3) {
      return Promise.reject(e3);
    }
    let l2 = t2.then(async () => {
      v(o3);
      let t3 = await u(s2);
      if (t3.digest !== c2) throw h(`INSTALL_INVALID_SNAPSHOT`, `Snapshot digest does not match bytes`);
      if (e2.installSnapshot) {
        v(o3);
        let r3 = await e2.installSnapshot(c2, t3);
        return n2.set(c2, Promise.resolve(t3)), Object.freeze({ digest: c2, reused: r3 });
      }
      if (await a2(c2)) return Object.freeze({ digest: c2, reused: true });
      for (let t4 of [`gp-next`, f]) await e2.exists(t4) ? await r2(t4) : await e2.mkdir(t4);
      await r2(f);
      let i4 = `${f}/pending-${globalThis.crypto.randomUUID()}`, l3 = `${f}/${c2}`, p2 = false;
      try {
        if (await e2.exists(i4)) throw h(`INSTALL_TEMP_EXISTS`, `Temporary cache path already exists`, i4);
        await e2.mkdir(i4), p2 = true;
        for (let n3 of t3.listPaths()) {
          v(o3);
          let r3 = n3.lastIndexOf(`/`);
          r3 >= 0 && await e2.mkdir(`${i4}/${n3.slice(0, r3)}`), await e2.writeFile(`${i4}/${n3}`, t3.readBytes(n3));
        }
        if ((await d(i4, e2)).digest !== c2) throw h(`INSTALL_CORRUPT`, `Temporary package failed byte verification`, i4);
        if (v(o3), await a2(c2)) return await e2.remove(i4), p2 = false, Object.freeze({ digest: c2, reused: true });
        v(o3);
        try {
          await e2.rename(i4, l3);
        } catch (t4) {
          if (!await a2(c2)) throw t4;
          return await e2.remove(i4), p2 = false, Object.freeze({ digest: c2, reused: true });
        }
        return p2 = false, await a2(c2), Object.freeze({ digest: c2, reused: false });
      } catch (t4) {
        if (p2) try {
          await e2.remove(i4);
        } catch (e3) {
          throw Object.assign(AggregateError([t4, e3], `Install failed; temporary cache remains`), { code: `INSTALL_CLEANUP_FAILED`, path: i4 });
        }
        throw t4;
      }
    });
    return t2 = l2.catch(() => {
    }), l2;
  }, collectUnused(i3) {
    let a3 = /* @__PURE__ */ new Set(), o3 = (e3) => {
      !e3 || typeof e3 != `object` || (typeof e3.contentDigest == `string` && a3.add(e3.contentDigest), Object.values(e3).forEach(o3));
    };
    o3(i3);
    let s2 = t2.then(async () => {
      if (await e2.exists(f)) {
        await r2(f);
        for (let t3 of await e2.readDir(f)) {
          if (!/^[a-f0-9]{64}$/.test(t3.name) || a3.has(t3.name)) continue;
          let i4 = `${f}/${t3.name}`;
          await r2(i4), await e2.remove(i4), n2.delete(t3.name);
        }
      }
    });
    return t2 = s2.catch(() => {
    }), s2;
  }, async inspect() {
    if (await t2, !await e2.exists(f)) return [];
    await r2(f);
    let n3 = [];
    for (let t3 of await e2.readDir(f)) {
      let e3 = t3.name;
      if (/^[a-f0-9]{64}$/.test(e3)) try {
        await a2(e3, { verify: true }), n3.push({ name: e3, status: `valid` });
      } catch (t4) {
        n3.push({ name: e3, status: `corrupt`, error: t4.message });
      }
      else n3.push({ name: e3, status: /^(?:\.)?pending-/.test(e3) ? `pending` : `unknown` });
    }
    return n3;
  } });
  return g.set(e2, o2), o2;
}
export {
  createPackInstallStore
};
