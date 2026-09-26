import { t as e } from "../core/Logger.js";
import { g, r, y } from "../runtime/Engine.js";
import { a as i } from "../ui/Translations.js";
import { n as a } from "../ui/Toast.js";
import { n as o } from "../platform/Dialog.js";
import { u as s } from "../platform/FileSystem.js";
import { n as c, t as l } from "../mods/RestoreUtils.js";
var u = new e(`data-store`);
async function d(e2, t2, n2, r2) {
  if (r2) {
    try {
      let r3 = await o({ defaultPath: t2, filters: [{ name: `JSON`, extensions: [`json`] }] });
      r3 ? (await s(r3, n2), u.info(`Exported ${e2} to ${r3} (${n2.length} chars)`), a(i(`toast.exportSuccess`, e2), `success`)) : (u.info(`Export cancelled`), a(i(`toast.exportCancelled`), ``));
    } catch (t3) {
      u.error(`Export failed: ${t3}`), console.log(`[GP Next] ===== ${e2} JSON =====`), console.log(n2), console.log(`[GP Next] ===== END =====`);
    }
    return;
  }
  console.log(`[GP Next] ===== ${e2} JSON =====`), console.log(n2), console.log(`[GP Next] ===== END =====`), u.info(`${e2} output to console (${n2.length} chars)`);
}
function f(e2) {
  if (typeof e2 != `string`) return null;
  let t2 = e2.trim().replace(/\.json$/i, ``);
  return /^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(t2) ? t2 : null;
}
var DataStore = class {
  constructor(e2) {
    this._originalData = e2;
  }
  restore(e2) {
    if (!this._originalData[e2]) return u.error(`No backup for ${e2}`), false;
    let t2 = r(e2);
    if (!t2) return u.error(`${e2} not found in game assets`), false;
    let r2 = l(this._originalData[e2]);
    return t2.json && typeof t2.json == `object` ? c(t2.json, r2) : t2.json = r2, u.info(`Restored: ${e2}`), a(i(`toast.restoreSuccess`, e2), `success`), true;
  }
  restoreAll() {
    let e2 = Object.keys(this._originalData);
    if (e2.length === 0) return u.info(`No backups to restore`), { success: 0, failed: 0 };
    let t2 = 0, n2 = 0;
    for (let r2 of e2) this.restore(r2) ? t2++ : n2++;
    return u.info(`Restore complete: ${t2} succeeded, ${n2} failed`), { success: t2, failed: n2 };
  }
  async exportJson(e2, t2 = false, r2 = true) {
    let i2;
    if (t2) if (this._originalData[e2]) i2 = this._originalData[e2];
    else {
      let t3 = r(e2);
      if (!t3?.json) return u.error(`No data available for ${e2}`), null;
      u.info(`${e2} has no patch backup \u2014 exporting current (= original) data`), i2 = t3.json;
    }
    else {
      let t3 = r(e2);
      if (!t3?.json) return u.error(`${e2} not found in game assets`), null;
      i2 = t3.json;
    }
    let a2 = JSON.stringify(i2, null, 2);
    return await d(e2, t2 ? `${e2}_original.json` : `${e2}.json`, a2, r2), a2;
  }
  async exportLevel(e2, n2 = true) {
    let i2 = f(e2);
    if (!i2) return u.error(`Invalid level ID: ${String(e2)}`), null;
    let a2 = null, o2;
    try {
      if (a2 = await g(`levels/${i2}`), !a2?.json || typeof a2.json != `object`) throw Error(`loaded asset has no JSON data`);
      o2 = JSON.stringify(a2.json, null, 2);
    } catch (e3) {
      return u.error(`Failed to export level '${i2}': ${e3}`), null;
    } finally {
      a2 && y(a2);
    }
    return await d(`Level:${i2}`, `${i2}.json`, o2, n2), o2;
  }
  listBackups() {
    return Object.keys(this._originalData);
  }
  hasBackup(e2) {
    return !!this._originalData[e2];
  }
  getOriginal(e2) {
    return this._originalData[e2];
  }
  getCurrent(e2) {
    return r(e2)?.json;
  }
};
export {
  DataStore
};
