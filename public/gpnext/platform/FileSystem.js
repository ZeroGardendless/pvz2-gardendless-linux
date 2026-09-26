import { r as e, t } from "./Bridge.js";
var n;
(function(e2) {
  e2[e2.Audio = 1] = `Audio`, e2[e2.Cache = 2] = `Cache`, e2[e2.Config = 3] = `Config`, e2[e2.Data = 4] = `Data`, e2[e2.LocalData = 5] = `LocalData`, e2[e2.Document = 6] = `Document`, e2[e2.Download = 7] = `Download`, e2[e2.Picture = 8] = `Picture`, e2[e2.Public = 9] = `Public`, e2[e2.Video = 10] = `Video`, e2[e2.Resource = 11] = `Resource`, e2[e2.Temp = 12] = `Temp`, e2[e2.AppConfig = 13] = `AppConfig`, e2[e2.AppData = 14] = `AppData`, e2[e2.AppLocalData = 15] = `AppLocalData`, e2[e2.AppCache = 16] = `AppCache`, e2[e2.AppLog = 17] = `AppLog`, e2[e2.Desktop = 18] = `Desktop`, e2[e2.Executable = 19] = `Executable`, e2[e2.Font = 20] = `Font`, e2[e2.Home = 21] = `Home`, e2[e2.Runtime = 22] = `Runtime`, e2[e2.Template = 23] = `Template`;
})(n ||= {});
async function r() {
  return e(`plugin:path|resolve_directory`, { directory: n.AppData });
}
var i;
(function(e2) {
  e2[e2.Start = 0] = `Start`, e2[e2.Current = 1] = `Current`, e2[e2.End = 2] = `End`;
})(i ||= {});
function a(e2) {
  return { isFile: e2.isFile, isDirectory: e2.isDirectory, isSymlink: e2.isSymlink, size: e2.size, mtime: e2.mtime === null ? null : new Date(e2.mtime), atime: e2.atime === null ? null : new Date(e2.atime), birthtime: e2.birthtime === null ? null : new Date(e2.birthtime), readonly: e2.readonly, fileAttributes: e2.fileAttributes, dev: e2.dev, ino: e2.ino, mode: e2.mode, nlink: e2.nlink, uid: e2.uid, gid: e2.gid, rdev: e2.rdev, blksize: e2.blksize, blocks: e2.blocks };
}
function o(e2) {
  let t2 = new Uint8ClampedArray(e2), n2 = t2.byteLength, r2 = 0;
  for (let e3 = 0; e3 < n2; e3++) {
    let n3 = t2[e3];
    r2 *= 256, r2 += n3;
  }
  return r2;
}
var s = class extends t {
  async read(t2) {
    if (t2.byteLength === 0) return 0;
    let n2 = await e(`plugin:fs|read`, { rid: this.rid, len: t2.byteLength }), r2 = o(n2.slice(-8)), i2 = n2 instanceof ArrayBuffer ? new Uint8Array(n2) : n2;
    return t2.set(i2.slice(0, i2.length - 8)), r2 === 0 ? null : r2;
  }
  async seek(t2, n2) {
    return await e(`plugin:fs|seek`, { rid: this.rid, offset: t2, whence: n2 });
  }
  async stat() {
    return a(await e(`plugin:fs|fstat`, { rid: this.rid }));
  }
  async truncate(t2) {
    await e(`plugin:fs|ftruncate`, { rid: this.rid, len: t2 });
  }
  async write(t2) {
    return await e(`plugin:fs|write`, { rid: this.rid, data: t2 });
  }
};
async function c(t2, n2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  return new s(await e(`plugin:fs|open`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 }));
}
async function l(t2, n2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  await e(`plugin:fs|mkdir`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 });
}
async function u(t2, n2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  return await e(`plugin:fs|read_dir`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 });
}
async function d(t2, n2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  let r2 = await e(`plugin:fs|read_file`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 });
  return r2 instanceof ArrayBuffer ? new Uint8Array(r2) : Uint8Array.from(r2);
}
async function f(t2, n2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  let r2 = await e(`plugin:fs|read_text_file`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 }), i2 = r2 instanceof ArrayBuffer ? r2 : Uint8Array.from(r2);
  return new TextDecoder(n2?.encoding ?? `utf-8`).decode(i2);
}
async function p(t2, n2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  await e(`plugin:fs|remove`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 });
}
async function m(t2, n2, r2) {
  if (t2 instanceof URL && t2.protocol !== `file:` || n2 instanceof URL && n2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  await e(`plugin:fs|rename`, { oldPath: t2 instanceof URL ? t2.toString() : t2, newPath: n2 instanceof URL ? n2.toString() : n2, options: r2 });
}
async function h(t2, n2) {
  return a(await e(`plugin:fs|lstat`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 }));
}
async function g(t2, n2, r2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  if (n2 instanceof ReadableStream) {
    let e2 = await c(t2, { read: false, create: true, write: true, ...r2 }), i2 = n2.getReader();
    try {
      for (; ; ) {
        let { done: t3, value: n3 } = await i2.read();
        if (t3) break;
        await e2.write(n3);
      }
    } finally {
      i2.releaseLock(), await e2.close();
    }
  } else await e(`plugin:fs|write_file`, n2, { headers: { path: encodeURIComponent(t2 instanceof URL ? t2.toString() : t2), options: JSON.stringify(r2) } });
}
async function _(t2, n2, r2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  await e(`plugin:fs|write_text_file`, new TextEncoder().encode(n2), { headers: { path: encodeURIComponent(t2 instanceof URL ? t2.toString() : t2), options: JSON.stringify(r2) } });
}
async function v(t2, n2) {
  if (t2 instanceof URL && t2.protocol !== `file:`) throw TypeError(`Must be a file URL.`);
  return await e(`plugin:fs|exists`, { path: t2 instanceof URL ? t2.toString() : t2, options: n2 });
}
export {
  d as a,
  m as c,
  n as d,
  r as f,
  u as i,
  g as l,
  h as n,
  f as o,
  l as r,
  p as s,
  v as t,
  _ as u
};
