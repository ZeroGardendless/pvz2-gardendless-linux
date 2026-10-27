import { n as e, r as t } from "../platform/CloudJson.js";
import { i as n, n as r, r as i } from "./ModOwnedData.js";
import { c as a, d as o, f as s, i as c, n as l, o as u, r as d, s as f, t as p } from "../platform/FileSystem.js";
var m = { baseDir: s.AppData }, h = `gp-next/mod-data`, g = () => Object.assign(Error(`Mod-owned data changed before publication`), { code: `MOD_DATA_CONFLICT` });
async function _(e2) {
  return [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, new TextEncoder().encode(e2)))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
}
function v(v2 = { exists: p, mkdir: d, readTextFile: u, writeTextFile: o, rename: a, remove: f, readDir: c, lstat: l }) {
  let y = Promise.resolve(), b = (e2) => {
    let t2 = y.then(e2);
    return y = t2.catch(() => {
    }), t2;
  }, x = async (e2) => `${h}/${await _(JSON.stringify(e2))}`, S = async (e2, t2) => await v2.exists(e2, m) ? n(JSON.parse(await v2.readTextFile(e2, m)), t2) : null, C = async (e2, t2, n2 = () => {
  }) => {
    let r2 = `${e2}.${crypto.randomUUID()}.pending`;
    try {
      if (await v2.writeTextFile(r2, t2, m), await v2.readTextFile(r2, m) !== t2) throw Error(`Mod data write verification failed`);
      n2(), await v2.rename(r2, e2, { oldPathBaseDir: s.AppData, newPathBaseDir: s.AppData });
    } catch (e3) {
      try {
        await v2.exists(r2, m) && await v2.remove(r2, m);
      } catch (t3) {
        throw AggregateError([e3, t3], `Mod data write and cleanup failed`);
      }
      throw e3;
    }
  }, w = async (a2 = 512, o2 = 2e6, s2 = []) => {
    let c2 = new Set(await Promise.all(s2.map(async (e2) => _(JSON.stringify(r(e2))))));
    if (!await v2.exists(h, m)) return [];
    let l2 = await v2.lstat(h, m);
    if (!l2.isDirectory || l2.isSymlink) throw Error(`CLOUD_MOD_DATA_LAYOUT`);
    let u2 = await v2.readDir(h, m);
    if (u2.length > a2) throw Error(`CLOUD_MOD_DATA_COUNT`);
    let d2 = [], f2 = 0;
    for (let e2 of u2.sort((e3, t2) => e3.name.localeCompare(t2.name))) {
      if (!e2.isDirectory || e2.isSymlink || !/^[a-f0-9]{64}$/.test(e2.name)) throw Error(`CLOUD_MOD_DATA_LAYOUT`);
      let i2 = `${h}/${e2.name}/current.json`;
      if (!await v2.exists(i2, m) && c2.has(e2.name)) {
        if ((await v2.readDir(`${h}/${e2.name}`, m)).some((e3) => !e3.isFile || e3.isSymlink || !/^(?:schema-[1-9][0-9]*-[a-f0-9]{64}\.json|current\.json\.[a-f0-9-]{36}\.pending)$/.test(e3.name))) throw Error(`CLOUD_MOD_DATA_LAYOUT`);
        continue;
      }
      let a3 = await v2.lstat(i2, m);
      if (!a3.isFile || a3.isSymlink || f2 + a3.size > o2) throw Error(`CLOUD_MOD_DATA_SIZE`);
      let s3 = await v2.readTextFile(i2, m);
      if (f2 += new TextEncoder().encode(s3).length, f2 > o2) throw Error(`CLOUD_MOD_DATA_SIZE`);
      let l3 = t(s3, o2), u3 = r(l3.identity);
      if (await _(JSON.stringify(u3)) !== e2.name) throw Error(`CLOUD_MOD_DATA_IDENTITY`);
      d2.push(n(l3, u3));
    }
    return e(i(d2), o2);
  };
  return Object.freeze({ exportAll({ maxRecords: e2 = 512, maxBytes: t2 = 2e6, allowAbsent: n2 = [] } = {}) {
    return b(() => w(e2, t2, n2));
  }, replaceAll(t2, { assertClosed: i2, allowAbsent: a2 = [] }) {
    if (t2 = e(t2, 2e6), !Array.isArray(t2) || t2.length > 512 || typeof i2 != `function`) throw Error(`CLOUD_MOD_DATA_IMPORT`);
    let o2 = /* @__PURE__ */ new Set();
    return t2 = t2.map((e2) => {
      let t3 = r(e2.identity), i3 = JSON.stringify(t3);
      if (o2.has(i3)) throw Error(`CLOUD_MOD_DATA_DUPLICATE`);
      return o2.add(i3), n(e2, t3);
    }), b(async () => {
      i2();
      let e2 = await w(512, 2e6, a2);
      for (let e3 of t2) {
        i2();
        let t3 = await x(e3.identity);
        await v2.mkdir(t3, { ...m, recursive: true }), await C(`${t3}/current.json`, JSON.stringify(e3), i2);
      }
      for (let t3 of e2) o2.has(JSON.stringify(t3.identity)) || (i2(), await v2.remove(`${await x(t3.identity)}`, { ...m, recursive: true }));
      for (let e3 of a2) if (!o2.has(JSON.stringify(r(e3)))) {
        let t3 = await x(r(e3));
        await v2.exists(t3, m) && !await v2.exists(`${t3}/current.json`, m) && (i2(), await v2.remove(t3, { ...m, recursive: true }));
      }
      i2();
      let n2 = await w(), s2 = (e3) => e3.map((e4) => JSON.stringify(e4)).sort();
      if (JSON.stringify(s2(n2)) !== JSON.stringify(s2(t2))) throw Error(`CLOUD_MOD_DATA_VERIFY`);
    });
  }, read(e2) {
    return e2 = r(e2), b(async () => S(`${await x(e2)}/current.json`, e2));
  }, replace(e2, t2, i2, { assertAccess: a2 = () => {
  }, reportMutation: o2 = () => {
  } } = {}) {
    if (e2 = r(e2), t2 = n(t2, e2), i2 = i2 === null ? null : n(i2, e2), t2.revision !== (i2?.revision || 0) + 1 || i2 && t2.schemaVersion < i2.schemaVersion) throw g();
    return b(async () => {
      a2();
      let n2 = await x(e2), r2 = `${n2}/current.json`;
      if (JSON.stringify(await S(r2, e2)) !== JSON.stringify(i2)) throw g();
      if (await v2.mkdir(n2, { ...m, recursive: true }), i2 && i2.schemaVersion !== t2.schemaVersion) {
        let e3 = JSON.stringify(i2);
        await C(`${n2}/schema-${i2.schemaVersion}-${await _(e3)}.json`, e3);
      }
      await C(r2, JSON.stringify(t2), () => {
        a2(), o2({ domain: `mod-owned-data`, operation: `modData.write`, status: `unknown` });
      }), o2({ domain: `mod-owned-data`, operation: `modData.write`, status: `changed` });
    });
  } });
}
export {
  v as t
};
