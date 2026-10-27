var e = (e2, t2) => Object.assign(Error(t2), { code: e2 });
function t(t2) {
  let n2 = JSON.stringify(t2, (t3, n3) => {
    if (n3 === void 0 || typeof n3 == `function` || typeof n3 == `symbol` || typeof n3 == `bigint` || typeof n3 == `number` && !Number.isFinite(n3)) throw e(`MOD_DATA_INVALID`, `Mod data must contain JSON values`);
    return n3;
  });
  return JSON.parse(n2);
}
function n(t2) {
  if (!t2 || typeof t2.modId != `string` || !t2.modId.trim()) throw e(`MOD_DATA_IDENTITY`, `Mod identity is required`);
  if (t2.kind === `global` && t2.saveId === void 0) return { modId: t2.modId, kind: `global` };
  if (t2.kind === `save` && typeof t2.saveId == `string` && t2.saveId.trim()) return { modId: t2.modId, kind: `save`, saveId: t2.saveId };
  throw e(`MOD_DATA_IDENTITY`, `Choose global data or an identified save explicitly`);
}
function r(r2, i2) {
  let a2 = n(r2?.identity);
  if (!r2 || r2.formatVersion !== 1 || Object.keys(r2.identity).length !== Object.keys(a2).length || JSON.stringify(a2) !== JSON.stringify(n(i2)) || !Number.isSafeInteger(r2.schemaVersion) || r2.schemaVersion < 1 || !Number.isSafeInteger(r2.revision) || r2.revision < 1 || !Object.hasOwn(r2, `data`)) throw e(`MOD_DATA_INVALID`, `Invalid mod-owned data record`);
  return t({ ...r2, identity: a2 });
}
function i(e2) {
  let t2 = (e3) => JSON.stringify(n(e3.identity));
  return [...e2].sort((e3, n2) => t2(e3) < t2(n2) ? -1 : +(t2(e3) > t2(n2)));
}
function a(i2) {
  let a2 = Promise.resolve(), o = false, s = () => {
    if (o) throw e(`MOD_DATA_CAPTURING`, `Mod data writes are closed for capture`);
  }, c = (e2, t2 = false) => {
    t2 && s();
    let n2 = a2.then(e2);
    return a2 = n2.catch(() => {
    }), n2;
  };
  return Object.freeze({ assertWriteAdmission: s, async quiesceWrites({ signal: e2 } = {}) {
    e2?.throwIfAborted(), s(), o = true;
    let t2 = true, n2, r2 = () => {
      t2 && (t2 = false, o = false, e2?.removeEventListener(`abort`, i3));
    }, i3 = () => {
      r2(), n2(e2.reason || Error(`CLOUD_CANCELLED`));
    }, c2 = new Promise((e3, t3) => {
      n2 = t3;
    });
    e2?.addEventListener(`abort`, i3, { once: true });
    try {
      return await Promise.race([a2, c2]), e2?.throwIfAborted(), r2;
    } catch (e3) {
      throw r2(), e3;
    }
  }, open(a3, o2, { assertAccess: s2 = () => {
  }, reportMutation: l = () => {
  } } = {}) {
    a3 = n(a3);
    let u = o2?.version, d = o2?.migrate, f = o2?.validate;
    if (!Number.isSafeInteger(u) || u < 1 || typeof f != `function`) throw e(`MOD_DATA_SCHEMA`, `A positive schema version and validator are required`);
    let p = t(o2.defaults), m = async (n2) => {
      let r2 = t(n2);
      if (await f(t(r2)) !== true) throw e(`MOD_DATA_SCHEMA`, `Mod data does not match its schema`);
      return r2;
    }, h = async () => {
      s2();
      let e2 = await i2.read(a3);
      return e2 === null ? null : r(e2, a3);
    }, g = async (e2, n2) => {
      let r2 = { formatVersion: 1, identity: a3, schemaVersion: u, revision: (e2?.revision || 0) + 1, data: await m(n2) };
      return s2(), await i2.replace(a3, r2, e2, { assertAccess: s2, reportMutation: l }), t(r2.data);
    }, _ = async () => {
      let t2 = await h();
      if (t2?.schemaVersion !== u) throw e(`MOD_DATA_VERSION`, `Reopen mod data with its current schema`);
      return t2;
    };
    return c(async () => {
      let n2 = await h();
      if (n2 === null) await g(null, p);
      else if (n2.schemaVersion > u) throw e(`MOD_DATA_DOWNGRADE`, `Stored mod data uses a newer schema; original data was retained`);
      else if (n2.schemaVersion < u) {
        if (typeof d != `function`) throw e(`MOD_DATA_MIGRATION`, `A data migration is required`);
        await g(n2, await d(t(n2.data), n2.schemaVersion, u));
      } else await m(n2.data);
      return s2(), Object.freeze({ read: () => c(async () => {
        let e2 = await _();
        return s2(), t(e2.data);
      }), update: (n3) => c(async () => {
        if (typeof n3 != `function`) throw e(`MOD_DATA_INVALID`, `An update function is required`);
        let r2 = await _();
        return g(r2, await n3(t(r2.data)));
      }, true) });
    }, true);
  } });
}
export {
  r as i,
  n,
  i as r,
  a as t
};
