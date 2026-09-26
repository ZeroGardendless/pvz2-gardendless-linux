function e(e2) {
  let t2 = String(e2 || ``).trim().replace(/^v/i, ``).split(`+`, 1)[0], n2 = t2.indexOf(`-`), r = n2 === -1 ? t2 : t2.slice(0, n2), i = n2 === -1 ? `` : t2.slice(n2 + 1), a = r.split(`.`).map((e3) => {
    let t3 = e3.match(/^\d+/);
    return t3 ? Number(t3[0]) : 0;
  });
  return { parts: [a[0] || 0, a[1] || 0, a[2] || 0], prerelease: i };
}
function t(t2, n2) {
  let r = e(t2), i = e(n2);
  for (let e2 = 0; e2 < 3; e2++) if (r.parts[e2] !== i.parts[e2]) return r.parts[e2] < i.parts[e2] ? -1 : 1;
  if (r.prerelease === i.prerelease) return 0;
  if (!r.prerelease) return 1;
  if (!i.prerelease) return -1;
  let a = r.prerelease.split(`.`), o = i.prerelease.split(`.`);
  for (let e2 = 0; e2 < Math.max(a.length, o.length); e2++) {
    if (e2 === a.length) return -1;
    if (e2 === o.length) return 1;
    let t3 = a[e2], n3 = o[e2];
    if (t3 === n3) continue;
    let r2 = /^\d+$/.test(t3), i2 = /^\d+$/.test(n3);
    return r2 && i2 ? BigInt(t3) < BigInt(n3) ? -1 : 1 : r2 === i2 ? t3 < n3 ? -1 : 1 : r2 ? -1 : 1;
  }
  return 0;
}
function n(e2, n2 = {}) {
  let r = String(n2.min || ``).trim(), i = String(n2.max || ``).trim();
  return r && t(e2, r) < 0 ? { ok: false, reason: `Requires GP-Next ${r} or newer` } : i && t(e2, i) > 0 ? { ok: false, reason: `Requires GP-Next ${i} or older` } : { ok: true, reason: `` };
}
export {
  t as n,
  n as t
};
