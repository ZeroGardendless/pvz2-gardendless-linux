import { d as e } from "../platform/FileSystem.js";
import { t } from "../core/Logger.js";
import { S, l as r, o as i, w } from "../ui/Translations.js";
import { n as o } from "../ui/Toast.js";
import { n as s } from "../platform/Dialog.js";
import { n as c, t as l } from "../mods/RestoreUtils.js";
var u = new t(`data-store`);
async function d(t2, n2, r2, a2) {
  if (a2) {
    try {
      let a3 = await s({ defaultPath: n2, filters: [{ name: `JSON`, extensions: [`json`] }] });
      a3 ? (await e(a3, r2), u.info(`Exported ${t2} to ${a3} (${r2.length} chars)`), o(i(`toast.exportSuccess`, t2), `success`)) : (u.info(`Export cancelled`), o(i(`toast.exportCancelled`), ``));
    } catch (e2) {
      u.error(`Export failed: ${e2}`), console.log(`[GP Next] ===== ${t2} JSON =====`), console.log(r2), console.log(`[GP Next] ===== END =====`);
    }
    return;
  }
  console.log(`[GP Next] ===== ${t2} JSON =====`), console.log(r2), console.log(`[GP Next] ===== END =====`), u.info(`${t2} output to console (${r2.length} chars)`);
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
    let n2 = l(this._originalData[e2]);
    return t2.json && typeof t2.json == `object` ? c(t2.json, n2) : t2.json = n2, u.info(`Restored: ${e2}`), o(i(`toast.restoreSuccess`, e2), `success`), true;
  }
  restoreAll() {
    let e2 = Object.keys(this._originalData);
    if (e2.length === 0) return u.info(`No backups to restore`), { success: 0, failed: 0 };
    let t2 = 0, n2 = 0;
    for (let r2 of e2) this.restore(r2) ? t2++ : n2++;
    return u.info(`Restore complete: ${t2} succeeded, ${n2} failed`), { success: t2, failed: n2 };
  }
  async exportJson(e2, t2 = false, n2 = true) {
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
    return await d(e2, t2 ? `${e2}_original.json` : `${e2}.json`, a2, n2), a2;
  }
  async exportLevel(e2, t2 = true) {
    let r2 = f(e2);
    if (!r2) return u.error(`Invalid level ID: ${String(e2)}`), null;
    let i2 = null, o2;
    try {
      if (i2 = await S(`levels/${r2}`), !i2?.json || typeof i2.json != `object`) throw Error(`loaded asset has no JSON data`);
      o2 = JSON.stringify(i2.json, null, 2);
    } catch (e3) {
      return u.error(`Failed to export level '${r2}': ${e3}`), null;
    } finally {
      i2 && w(i2);
    }
    return await d(`Level:${r2}`, `${r2}.json`, o2, t2), o2;
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
