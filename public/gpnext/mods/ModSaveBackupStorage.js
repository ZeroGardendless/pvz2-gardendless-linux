import { c as e, d as t, o as n, r, s, t as a, u as o } from "../platform/FileSystem.js";
import { NATIVE_PLAYER_SAVE_KEY } from "./ModSaveProtection.js";
var c = `gp-next/save-backups/native-player`, l = { baseDir: t.AppData }, u = (e2) => Object.assign(Error(e2), { code: `SAVE_BACKUP_INVALID` });
function d(e2) {
  if (typeof e2 != `string` || !/^[a-f0-9]{64}$/.test(e2)) throw u(`Invalid native save backup identity`);
  return `${c}/${e2}.json`;
}
async function f(e2, t2) {
  if (!t2 || t2.formatVersion !== 1 || t2.saveKey !== `PvZ2_PlayerProperties` || t2.digest !== e2 || !(t2.raw === null || typeof t2.raw == `string`)) throw u(`Unsupported or invalid native save backup record`);
  if (t2.raw !== null) {
    let e3;
    try {
      e3 = JSON.parse(t2.raw);
    } catch {
      throw u(`Native save backup contains invalid player JSON`);
    }
    if (!Array.isArray(e3) || e3.some((e4) => !e4 || typeof e4 != `object` || Array.isArray(e4))) throw u(`Native save backup has unsupported player data`);
  }
  let n2 = new TextEncoder().encode(JSON.stringify([NATIVE_PLAYER_SAVE_KEY, t2.raw])), r2 = [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, n2))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
  if (r2 !== e2) throw u(`Native save backup checksum differs`);
  return { formatVersion: 1, saveKey: NATIVE_PLAYER_SAVE_KEY, digest: r2, raw: t2.raw };
}
function p(e2) {
  try {
    return JSON.parse(e2);
  } catch {
    throw u(`Native save backup file is corrupt`);
  }
}
function createNativeSaveBackupStorage(s2 = { exists: a, mkdir: r, readTextFile: n, writeTextFile: o, rename: e, remove: s }) {
  let m2 = Promise.resolve(), h = (e2) => {
    let t2 = m2.then(e2);
    return m2 = t2.catch(() => {
    }), t2;
  };
  return Object.freeze({ read(e2) {
    let t2 = d(e2);
    return h(async () => await s2.exists(t2, l) ? f(e2, p(await s2.readTextFile(t2, l))) : null);
  }, write(e2, n2) {
    let r2 = d(e2), i2 = { formatVersion: n2?.formatVersion, saveKey: n2?.saveKey, digest: n2?.digest, raw: n2?.raw };
    return h(async () => {
      let n3 = await f(e2, i2);
      if (await s2.exists(r2, l)) {
        if ((await f(e2, p(await s2.readTextFile(r2, l)))).raw !== n3.raw) throw u(`Native save backup identity conflicts`);
        return Object.freeze({ id: e2, digest: e2 });
      }
      await s2.mkdir(c, { ...l, recursive: true });
      let a2 = `${r2}.${crypto.randomUUID()}.pending`, o2 = JSON.stringify(n3);
      try {
        if (await s2.writeTextFile(a2, o2, l), await s2.readTextFile(a2, l) !== o2) throw u(`Native save backup write could not be verified`);
        await s2.rename(a2, r2, { oldPathBaseDir: t.AppData, newPathBaseDir: t.AppData });
      } catch (e3) {
        try {
          await s2.exists(a2, l) && await s2.remove(a2, l);
        } catch (t2) {
          throw AggregateError([e3, t2], `Native save backup write and cleanup failed`);
        }
        throw e3;
      }
      return Object.freeze({ id: e2, digest: e2 });
    });
  } });
}
export {
  createNativeSaveBackupStorage
};
