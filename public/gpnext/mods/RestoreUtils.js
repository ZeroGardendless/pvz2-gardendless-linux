function e(e2) {
  try {
    return structuredClone(e2);
  } catch {
    return JSON.parse(JSON.stringify(e2));
  }
}
function t(e2, n) {
  if (Array.isArray(e2) && Array.isArray(n)) {
    e2.length > n.length && e2.splice(n.length);
    for (let r = 0; r < n.length; r++) r < e2.length && e2[r] !== null && typeof e2[r] == `object` && n[r] !== null && typeof n[r] == `object` && Array.isArray(e2[r]) === Array.isArray(n[r]) ? t(e2[r], n[r]) : e2[r] = n[r];
  } else if (!Array.isArray(e2) && !Array.isArray(n) && typeof e2 == `object` && e2 && typeof n == `object` && n) {
    for (let t2 of Object.keys(e2)) t2 in n || delete e2[t2];
    for (let r of Object.keys(n)) r in e2 && e2[r] !== null && typeof e2[r] == `object` && n[r] !== null && typeof n[r] == `object` && Array.isArray(e2[r]) === Array.isArray(n[r]) ? t(e2[r], n[r]) : e2[r] = n[r];
  }
}
export {
  t as n,
  e as t
};
