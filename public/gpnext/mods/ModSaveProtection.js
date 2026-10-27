import { n as e } from "../vendor/ModuleHelpers.js";
var t = e({ NATIVE_PLAYER_SAVE_KEY: () => n, createNativeSaveBoundary: () => l, findNativeContentReferences: () => s }), n = `PvZ2_PlayerProperties`, r = new TextEncoder(), i = /* @__PURE__ */ new Set([`plants`, `plants_choice`, `obtainedPlants`, `plantsToChoose`, `initialPlants`]);
function a(e2, t2, n2 = {}) {
  return Object.assign(Error(t2), { code: e2, ...n2 });
}
function o(e2) {
  if (e2 === null) return [];
  let t2;
  try {
    t2 = JSON.parse(e2);
  } catch {
    throw a(`SAVE_INVALID`, `Native player save is not valid JSON`);
  }
  if (!Array.isArray(t2) || t2.some((e3) => !e3 || typeof e3 != `object` || Array.isArray(e3))) throw a(`SAVE_INVALID`, `Native player save has an unsupported root`);
  return t2;
}
function s(e2, t2) {
  let n2 = o(e2), r2 = /* @__PURE__ */ new Map();
  for (let e3 of t2) e3.codename && (r2.has(e3.codename) || r2.set(e3.codename, []), r2.get(e3.codename).push(e3));
  let a2 = (e3) => new Map(t2.filter((t3) => t3.kind === e3 && Number.isInteger(t3.engineId)).map((e4) => [e4.engineId, e4])), s2 = a2(`plant`), c2 = a2(`zombie`), l2 = /* @__PURE__ */ new Set(), u = (e3) => {
    e3 && l2.add(e3.id);
  }, d = (e3) => {
    for (let t3 of r2.get(e3) || []) u(t3);
  }, f = (e3) => {
    (typeof e3 == `number` || typeof e3 == `string`) && String(e3).trim() !== `` && Number.isInteger(Number(e3)) && u(s2.get(Number(e3)));
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
      d(e3);
      return;
    }
    if (!(!e3 || typeof e3 != `object`)) {
      if (Array.isArray(e3)) {
        for (let n3 of e3) i.has(t3) && f(n3), p(n3);
        return;
      }
      for (let [n3, r3] of Object.entries(e3)) d(n3), /^(0|[1-9][0-9]*)$/.test(n3) && (t3 === `plantProps` && u(s2.get(Number(n3))), t3 === `zombieProps` && u(c2.get(Number(n3)))), p(r3, n3);
    }
  }
  return p(n2), [...l2].sort();
}
async function c(e2) {
  let t2 = r.encode(JSON.stringify([n, e2]));
  return [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, t2))].map((e3) => e3.toString(16).padStart(2, `0`)).join(``);
}
function l({ storage: e2, backups: t2 }) {
  let r2 = false, i2 = false, l2 = () => {
    if (r2) throw a(`SAVE_SESSION_RUNNING`, `Restart before restoring a native save`);
  }, u = async (e3, t3 = false) => {
    if (t3 || l2(), i2) throw a(`SAVE_OPERATION_PENDING`, `A save operation is already pending`);
    i2 = true;
    try {
      return await e3();
    } finally {
      i2 = false;
    }
  }, d = () => e2.getItem(n), f = (e3, t3 = false) => {
    if (t3 || l2(), d() !== e3) throw a(`SAVE_CHANGED`, `Native save changed during preparation`);
  }, p = (e3, r3 = false) => u(async () => {
    let i3 = d();
    r3 || o(i3);
    let a2 = await c(i3);
    f(i3, e3);
    let s2 = { formatVersion: 1, saveKey: n, digest: a2, raw: i3 };
    return await t2.write(a2, s2), f(i3, e3), Object.freeze({ id: a2, digest: a2, ...e3 ? { assertCurrent: () => f(i3, true) } : {} });
  }, e3);
  return Object.freeze({ checkAvailable(e3, t3) {
    l2();
    let n2 = new Map(t3.map((e4) => [e4.id, e4])), r3 = e3.filter((e4) => {
      let t4 = n2.get(e4.id);
      return !t4 || t4.codename !== e4.codename || t4.kind !== e4.kind;
    }), i3 = e3.filter((e4) => n2.has(e4.id) && n2.get(e4.id).engineId !== e4.engineId).map((e4) => ({ ...e4, codename: `` })), o2 = d(), c2 = [.../* @__PURE__ */ new Set([...s(o2, r3), ...s(o2, i3)])].sort();
    if (c2.length) throw a(`SAVE_CONTENT_MISSING`, `This save requires unavailable mod content`, { missing: c2 });
    return { checked: true };
  }, capture: () => p(false), captureRaw: () => p(false, true), captureRuntime: () => p(true), restore: (r3) => u(async () => {
    if (!/^[a-f0-9]{64}$/.test(r3)) throw a(`SAVE_BACKUP_INVALID`, `Invalid save backup identity`);
    let i3 = d(), s2 = structuredClone(await t2.read(r3));
    if (s2?.formatVersion !== 1 || s2.saveKey !== `PvZ2_PlayerProperties` || s2.digest !== r3 || !(s2.raw === null || typeof s2.raw == `string`)) throw a(`SAVE_BACKUP_INVALID`, `Invalid native save backup`);
    if (o(s2.raw), await c(s2.raw) !== r3) throw a(`SAVE_BACKUP_INVALID`, `Native save backup checksum differs`);
    if (f(i3), s2.raw === null ? e2.removeItem(n) : e2.setItem(n, s2.raw), d() !== s2.raw) throw a(`SAVE_RESTORE_UNCONFIRMED`, `Native save restore could not be verified`);
    return { restored: true, digest: r3 };
  }), beginNativeReads() {
    r2 = true;
  } });
}
export {
  l as n,
  t as r,
  n as t
};
