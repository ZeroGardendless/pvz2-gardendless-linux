var NATIVE_PLAYER_SAVE_KEY = `PvZ2_PlayerProperties`, t = new TextEncoder(), n = /* @__PURE__ */ new Set([`plants`, `plants_choice`, `obtainedPlants`, `plantsToChoose`, `initialPlants`]);
function r(e2, t2, n2 = {}) {
  return Object.assign(Error(t2), { code: e2, ...n2 });
}
function i(e2) {
  if (e2 === null) return [];
  let t2;
  try {
    t2 = JSON.parse(e2);
  } catch {
    throw r(`SAVE_INVALID`, `Native player save is not valid JSON`);
  }
  if (!Array.isArray(t2) || t2.some((e3) => !e3 || typeof e3 != `object` || Array.isArray(e3))) throw r(`SAVE_INVALID`, `Native player save has an unsupported root`);
  return t2;
}
function findNativeContentReferences(e2, t2) {
  let r2 = i(e2), a2 = /* @__PURE__ */ new Map();
  for (let e3 of t2) e3.codename && (a2.has(e3.codename) || a2.set(e3.codename, []), a2.get(e3.codename).push(e3));
  let o2 = (e3) => new Map(t2.filter((t3) => t3.kind === e3 && Number.isInteger(t3.engineId)).map((e4) => [e4.engineId, e4])), s2 = o2(`plant`), c = o2(`zombie`), l = /* @__PURE__ */ new Set(), u = (e3) => {
    e3 && l.add(e3.id);
  }, d = (e3) => {
    for (let t3 of a2.get(e3) || []) u(t3);
  }, f = (e3) => {
    (typeof e3 == `number` || typeof e3 == `string`) && String(e3).trim() !== `` && Number.isInteger(Number(e3)) && u(s2.get(Number(e3)));
  };
  for (let e3 of r2) {
    if (Array.isArray(e3.obtainedPlants)) for (let t4 of e3.obtainedPlants) f(t4?.plantID);
    let t3 = e3.zengarden;
    if (t3 && typeof t3 == `object`) {
      for (let e4 of [`plantsInMain`, `plantsInNight`, `plantsInMushroom`, `plantsInBeach`]) if (Array.isArray(t3[e4])) for (let n2 of t3[e4]) f(n2?.ID);
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
        for (let r3 of e3) n.has(t3) && f(r3), p(r3);
        return;
      }
      for (let [n2, r3] of Object.entries(e3)) d(n2), /^(0|[1-9][0-9]*)$/.test(n2) && (t3 === `plantProps` && u(s2.get(Number(n2))), t3 === `zombieProps` && u(c.get(Number(n2)))), p(r3, n2);
    }
  }
  return p(r2), [...l].sort();
}
async function o(n2) {
  let r2 = t.encode(JSON.stringify([NATIVE_PLAYER_SAVE_KEY, n2]));
  return [...new Uint8Array(await crypto.subtle.digest(`SHA-256`, r2))].map((e2) => e2.toString(16).padStart(2, `0`)).join(``);
}
function createNativeSaveBoundary({ storage: t2, backups: n2 }) {
  let s2 = false, c = false, l = () => {
    if (s2) throw r(`SAVE_SESSION_RUNNING`, `Restart before restoring a native save`);
  }, u = async (e2, t3 = false) => {
    if (t3 || l(), c) throw r(`SAVE_OPERATION_PENDING`, `A save operation is already pending`);
    c = true;
    try {
      return await e2();
    } finally {
      c = false;
    }
  }, d = () => t2.getItem(NATIVE_PLAYER_SAVE_KEY), f = (e2, t3 = false) => {
    if (t3 || l(), d() !== e2) throw r(`SAVE_CHANGED`, `Native save changed during preparation`);
  }, p = (t3) => u(async () => {
    let r2 = d();
    i(r2);
    let a2 = await o(r2);
    f(r2, t3);
    let s3 = { formatVersion: 1, saveKey: NATIVE_PLAYER_SAVE_KEY, digest: a2, raw: r2 };
    return await n2.write(a2, s3), f(r2, t3), Object.freeze({ id: a2, digest: a2, ...t3 ? { assertCurrent: () => f(r2, true) } : {} });
  }, t3);
  return Object.freeze({ checkAvailable(e2, t3) {
    l();
    let n3 = new Map(t3.map((e3) => [e3.id, e3])), i2 = e2.filter((e3) => {
      let t4 = n3.get(e3.id);
      return !t4 || t4.codename !== e3.codename || t4.kind !== e3.kind;
    }), o2 = e2.filter((e3) => n3.has(e3.id) && n3.get(e3.id).engineId !== e3.engineId).map((e3) => ({ ...e3, codename: `` })), s3 = d(), c2 = [.../* @__PURE__ */ new Set([...findNativeContentReferences(s3, i2), ...findNativeContentReferences(s3, o2)])].sort();
    if (c2.length) throw r(`SAVE_CONTENT_MISSING`, `This save requires unavailable mod content`, { missing: c2 });
    return { checked: true };
  }, capture: () => p(false), captureRuntime: () => p(true), restore: (a2) => u(async () => {
    if (!/^[a-f0-9]{64}$/.test(a2)) throw r(`SAVE_BACKUP_INVALID`, `Invalid save backup identity`);
    let s3 = d(), c2 = structuredClone(await n2.read(a2));
    if (c2?.formatVersion !== 1 || c2.saveKey !== `PvZ2_PlayerProperties` || c2.digest !== a2 || !(c2.raw === null || typeof c2.raw == `string`)) throw r(`SAVE_BACKUP_INVALID`, `Invalid native save backup`);
    if (i(c2.raw), await o(c2.raw) !== a2) throw r(`SAVE_BACKUP_INVALID`, `Native save backup checksum differs`);
    if (f(s3), c2.raw === null ? t2.removeItem(NATIVE_PLAYER_SAVE_KEY) : t2.setItem(NATIVE_PLAYER_SAVE_KEY, c2.raw), d() !== c2.raw) throw r(`SAVE_RESTORE_UNCONFIRMED`, `Native save restore could not be verified`);
    return { restored: true, digest: a2 };
  }), beginNativeReads() {
    s2 = true;
  } });
}
export {
  NATIVE_PLAYER_SAVE_KEY,
  createNativeSaveBoundary,
  findNativeContentReferences
};
