import { n as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
var n = e({ NATIVE_PLAYER_SAVE_KEY: () => i, createNativeSaveBoundary: () => d, findNativeContentReferences: () => l }), r = new t(`save-content`), i = `PvZ2_PlayerProperties`, a = new TextEncoder(), o = /* @__PURE__ */ new Set([`plants`, `plants_choice`, `obtainedPlants`, `plantsToChoose`, `initialPlants`]);
function s(e2, t2, n2 = {}) {
  return Object.assign(Error(t2), { code: e2, ...n2 });
}
function c(e2) {
  if (e2 === null) return [];
  let t2;
  try {
    t2 = JSON.parse(e2);
  } catch {
    throw s(`SAVE_INVALID`, `Native player save is not valid JSON`);
  }
  if (!Array.isArray(t2) || t2.some((e3) => !e3 || typeof e3 != `object` || Array.isArray(e3))) throw s(`SAVE_INVALID`, `Native player save has an unsupported root`);
  return t2;
}
function l(e2, t2) {
  let n2 = c(e2), r2 = /* @__PURE__ */ new Map();
  for (let e3 of t2) e3.codename && (r2.has(e3.codename) || r2.set(e3.codename, []), r2.get(e3.codename).push(e3));
  let i2 = (e3) => new Map(t2.filter((t3) => t3.kind === e3 && Number.isInteger(t3.engineId)).map((e4) => [e4.engineId, e4])), a2 = i2(`plant`), s2 = i2(`zombie`), l2 = /* @__PURE__ */ new Set(), u2 = (e3) => {
    e3 && l2.add(e3.id);
  }, d2 = (e3) => {
    for (let t3 of r2.get(e3) || []) u2(t3);
  }, f = (e3) => {
    (typeof e3 == `number` || typeof e3 == `string`) && String(e3).trim() !== `` && Number.isInteger(Number(e3)) && u2(a2.get(Number(e3)));
  };
  for (let e3 of n2) {
    if (Array.isArray(e3.obtainedPlants)) for (let t4 of e3.obtainedPlants) f(t4?.plantID);
    let t3 = e3.zengarden;
    if (t3 && typeof t3 == `object`) {
      for (let e4 of [`plantsInMain`, `plantsInNight`, `plantsInMushroom`, `plantsInBeach`]) if (Array.isArray(t3[e4])) for (let n3 of t3[e4]) f(n3?.ID);
      f(t3.plantInCart?.ID);
    }
  }
  function p(e3, t3 = ``) {
    if (typeof e3 == `string`) {
      d2(e3);
      return;
    }
    if (!(!e3 || typeof e3 != `object`)) {
      if (Array.isArray(e3)) {
        for (let n3 of e3) o.has(t3) && f(n3), p(n3);
        return;
      }
      for (let [n3, r3] of Object.entries(e3)) d2(n3), /^(0|[1-9][0-9]*)$/.test(n3) && (t3 === `plantProps` && u2(a2.get(Number(n3))), t3 === `zombieProps` && u2(s2.get(Number(n3)))), p(r3, n3);
    }
  }
  return p(n2), [...l2].sort();
}
async function u(e2) {
  let t2 = a.encode(JSON.stringify([i, e2]));
  return [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, t2))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
}
function d({ storage: e2, backups: t2 }) {
  let n2 = false, a2 = false, o2 = /* @__PURE__ */ new Set(), d2 = () => {
    if (n2) throw s(`SAVE_SESSION_RUNNING`, `Restart before restoring a native save`);
  }, f = async (e3, t3 = false) => {
    if (t3 || d2(), a2) throw s(`SAVE_OPERATION_PENDING`, `A save operation is already pending`);
    a2 = true;
    try {
      return await e3();
    } finally {
      a2 = false;
    }
  }, p = () => e2.getItem(i), m = (e3, t3 = false) => {
    if (t3 || d2(), p() !== e3) throw s(`SAVE_CHANGED`, `Native save changed during preparation`);
  }, h = (e3, n3 = false) => f(async () => {
    let r2 = p();
    n3 || c(r2);
    let a3 = await u(r2);
    m(r2, e3);
    let o3 = { formatVersion: 1, saveKey: i, digest: a3, raw: r2 };
    return await t2.write(a3, o3), m(r2, e3), Object.freeze({ id: a3, digest: a3, ...e3 ? { assertCurrent: () => m(r2, true) } : {} });
  }, e3);
  return Object.freeze({ checkAvailable(e3, t3) {
    d2();
    let n3 = new Map(t3.map((e4) => [e4.id, e4])), i2 = e3.filter((e4) => {
      let t4 = n3.get(e4.id);
      return !t4 || t4.codename !== e4.codename || t4.kind !== e4.kind;
    }), a3 = e3.filter((e4) => n3.has(e4.id) && n3.get(e4.id).engineId !== e4.engineId).map((e4) => ({ ...e4, codename: `` })), s2 = p(), c2 = [.../* @__PURE__ */ new Set([...l(s2, i2), ...l(s2, a3)])].sort(), u2 = c2.filter((e4) => !o2.has(e4));
    if (u2.length) {
      for (let e4 of u2) o2.add(e4);
      r.warn(`SAVE_CONTENT_UNVERIFIED: saved mod references differ from the prepared entity ledger; continuing startup`, { identities: u2 });
    }
    return { checked: true, missing: c2 };
  }, capture: () => h(false), captureRaw: () => h(false, true), captureRuntime: () => h(true), restore: (n3) => f(async () => {
    if (!/^[a-f0-9]{64}$/.test(n3)) throw s(`SAVE_BACKUP_INVALID`, `Invalid save backup identity`);
    let r2 = p(), a3 = structuredClone(await t2.read(n3));
    if (a3?.formatVersion !== 1 || a3.saveKey !== `PvZ2_PlayerProperties` || a3.digest !== n3 || !(a3.raw === null || typeof a3.raw == `string`)) throw s(`SAVE_BACKUP_INVALID`, `Invalid native save backup`);
    if (c(a3.raw), await u(a3.raw) !== n3) throw s(`SAVE_BACKUP_INVALID`, `Native save backup checksum differs`);
    if (m(r2), a3.raw === null ? e2.removeItem(i) : e2.setItem(i, a3.raw), p() !== a3.raw) throw s(`SAVE_RESTORE_UNCONFIRMED`, `Native save restore could not be verified`);
    return { restored: true, digest: n3 };
  }), beginNativeReads() {
    n2 = true;
  } });
}
export {
  d as n,
  n as r,
  i as t
};
