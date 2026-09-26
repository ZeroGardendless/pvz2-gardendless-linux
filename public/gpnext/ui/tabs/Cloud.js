import { a } from "../Translations.js";
import { n as t } from "../Toast.js";
import { i as n, l, n as i, r, t as o } from "../Components.js";
var s = null;
function bindCloudSaver(e2) {
  s = e2;
}
function isCloudAvailable() {
  return false;
}
function u(e2, t2, n2 = {}) {
  let r2 = i(e2, t2, n2);
  return r2.disabled = true, r2;
}
function render(i2) {
  let c2 = !!s?.token, l2 = o(c2 ? a(`cloud.loggedInAs`, s?.username || `?`) : a(`cloud.notLoggedIn`), c2 ? `success` : `warning`), f = u(a(c2 ? `cloud.logout` : `cloud.login`), async () => {
    try {
      c2 ? s.logout() : await s.login(), i2.innerHTML = ``, render(i2);
    } catch (e2) {
      t(String(e2), `error`);
    }
  }, { variant: c2 ? `danger` : `default` }), p = [l2];
  p.push(n(a(`cloud.unavailable`))), p.push(f);
  let m = l(a(`cloud.title`), p);
  i2.appendChild(m);
  {
    let n2 = u(a(`cloud.upload`), async () => {
      if (confirm(a(`cloud.uploadConfirm`))) try {
        await s.uploadWithBackup(), t(a(`common.success`), `success`);
      } catch (e2) {
        t(String(e2), `error`);
      }
    }), o2 = u(a(`cloud.download`), async () => {
      if (confirm(a(`cloud.downloadConfirm`))) try {
        await s.downloadWithBackup(), t(a(`common.success`), `success`);
      } catch (e2) {
        t(String(e2), `error`);
      }
    }, { variant: `success` }), c3 = l(a(`cloud.title`), [r(n2, o2)]);
    i2.appendChild(c3);
    let l3 = document.createElement(`pre`);
    l3.className = `gp-code gp-cloud-compare`, l3.hidden = true;
    let d2 = u(a(`cloud.comparison`), async () => {
      try {
        let e2 = await s.compareSaves();
        e2 && (l3.hidden = false, l3.textContent = JSON.stringify(e2, null, 2));
      } catch (e2) {
        t(String(e2), `error`);
      }
    }, { small: true }), f2 = l(a(`cloud.comparison`), [d2, l3], true);
    i2.appendChild(f2);
  }
}
export {
  bindCloudSaver,
  isCloudAvailable,
  render
};
