import { a as e } from "../Translations.js";
import { a as t, n, r } from "../Components.js";
function i(i2) {
  let a = `root`, o = null, s = false, c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map();
  function u() {
    o && c.set(a, o.scrollTop);
  }
  function d(s2, u2 = false) {
    o = s2, o.innerHTML = ``;
    let d2 = i2[a];
    if (a !== `root`) {
      let i3 = n(e(`sections.back`), () => f(`root`));
      i3.prepend(t(`m14 6-6 6 6 6`));
      let a2 = document.createElement(`strong`);
      a2.textContent = e(d2.labelKey);
      let s3 = r(i3, a2);
      s3.classList.add(`gp-subpage-header`), o.appendChild(s3);
    }
    d2.renderHeader?.(o, f);
    let p = d2.retain && u2 ? l.get(a) : null;
    p || (p = document.createElement(`div`), p.className = `gp-page-body`, d2.render(p, f), d2.retain && l.set(a, p)), o.appendChild(p), o.scrollTop = c.get(a) || 0;
  }
  function f(e2) {
    !i2[e2] || e2 === a || (u(), s && i2[a].onDeactivate?.(), a = e2, d(o, true), s && i2[a].onActivate?.(), o.querySelector(`button`)?.focus({ preventScroll: true }));
  }
  return { render: d, onActivate() {
    s = true, i2[a].onActivate?.();
  }, onDeactivate() {
    u(), s = false, i2[a].onDeactivate?.();
  }, onBack() {
    return a === `root` ? false : (f(`root`), true);
  } };
}
export {
  i as t
};
