function e(e2) {
  return e2?.stack || e2?.message || String(e2);
}
async function t(t2, n, r = {}) {
  if (typeof n != `function`) throw TypeError(`runIsolatedStep requires an operation`);
  try {
    return { ok: true, value: await n(), error: null, cleanupError: null };
  } catch (n2) {
    r.logger?.error?.(`${t2} failed: ${e(n2)}`);
    let i = null;
    if (typeof r.cleanup == `function`) try {
      await r.cleanup(n2);
    } catch (n3) {
      i = n3, r.logger?.error?.(`${t2} cleanup failed: ${e(n3)}`);
    }
    return { ok: false, value: void 0, error: n2, cleanupError: i };
  }
}
export {
  t
};
