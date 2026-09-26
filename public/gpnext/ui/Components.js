function e(e2) {
  let t2 = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
  t2.setAttribute(`viewBox`, `0 0 24 24`), t2.setAttribute(`width`, `18`), t2.setAttribute(`height`, `18`), t2.setAttribute(`fill`, `none`), t2.setAttribute(`stroke`, `currentColor`), t2.setAttribute(`stroke-width`, `1.75`), t2.setAttribute(`aria-hidden`, `true`), t2.classList.add(`gp-icon`);
  let n2 = document.createElementNS(`http://www.w3.org/2000/svg`, `path`);
  return n2.setAttribute(`d`, e2), t2.appendChild(n2), t2;
}
function t(e2, t2, n2 = {}) {
  let r2 = document.createElement(`button`);
  r2.type = `button`;
  let i2 = `gp-btn`;
  return n2.variant === `danger` ? i2 += ` gp-btn-danger` : n2.variant === `success` && (i2 += ` gp-btn-success`), n2.small && (i2 += ` gp-btn-sm`), n2.className && (i2 += ` ` + n2.className), r2.className = i2, r2.textContent = e2, r2.addEventListener(`click`, t2), r2;
}
function n(n2, r2) {
  let i2 = t(n2, r2, { className: `gp-navigation-row` });
  return i2.appendChild(e(`m9 6 6 6-6 6`)), i2;
}
function r(e2, t2, n2) {
  let r2 = document.createElement(`div`);
  r2.className = `gp-toggle-wrap`;
  let i2 = document.createElement(`span`);
  i2.className = `gp-toggle-label`, i2.textContent = e2;
  let a2 = document.createElement(`button`);
  a2.type = `button`, a2.className = `gp-toggle` + (t2 ? ` gp-toggle-on` : ``), a2.tabIndex = 0, a2.setAttribute(`role`, `switch`), a2.setAttribute(`aria-checked`, t2 ? `true` : `false`), a2.setAttribute(`aria-label`, e2);
  let o2 = document.createElement(`div`);
  o2.className = `gp-toggle-knob`, a2.appendChild(o2);
  let s2 = t2, c2 = () => {
    s2 = !s2, a2.classList.toggle(`gp-toggle-on`, s2), a2.setAttribute(`aria-checked`, s2 ? `true` : `false`), n2(s2);
  };
  return a2.addEventListener(`click`, c2), a2.addEventListener(`keydown`, (e3) => {
    (e3.key === ` ` || e3.key === `Enter`) && (e3.preventDefault(), c2());
  }), r2.appendChild(i2), r2.appendChild(a2), r2._setValue = (e3) => {
    s2 = e3, a2.classList.toggle(`gp-toggle-on`, s2), a2.setAttribute(`aria-checked`, String(s2));
  }, r2;
}
function i(e2, t2, n2, r2, i2, a2 = {}) {
  let o2 = document.createElement(`div`);
  o2.className = `gp-slider-wrap`;
  let s2 = document.createElement(`div`);
  s2.className = `gp-slider-header`;
  let c2 = document.createElement(`span`);
  c2.className = `gp-slider-label`, c2.textContent = e2;
  let l2 = document.createElement(`span`);
  l2.className = `gp-slider-value`;
  let u2 = a2.formatValue || ((e3) => String(e3));
  l2.textContent = u2(r2), s2.appendChild(c2), s2.appendChild(l2);
  let d2 = document.createElement(`input`);
  return d2.type = `range`, d2.className = `gp-slider`, d2.min = String(t2), d2.max = String(n2), d2.value = String(r2), a2.step && (d2.step = String(a2.step)), d2.addEventListener(`input`, () => {
    let e3 = Number(d2.value);
    l2.textContent = u2(e3), a2.commitOnChange || i2(e3);
  }), a2.commitOnChange && d2.addEventListener(`change`, () => i2(Number(d2.value))), o2.appendChild(s2), o2.appendChild(d2), o2._setValue = (e3) => {
    d2.value = String(e3), l2.textContent = u2(e3);
  }, o2;
}
function a(e2, t2, n2, r2 = {}) {
  let i2 = document.createElement(`div`);
  i2.className = `gp-input-wrap`;
  let a2 = document.createElement(`span`);
  a2.className = `gp-input-label`, a2.textContent = e2;
  let o2 = document.createElement(`input`);
  return o2.type = `number`, o2.className = `gp-input`, o2.value = String(t2), o2.inputMode = `decimal`, r2.min !== void 0 && (o2.min = String(r2.min)), r2.max !== void 0 && (o2.max = String(r2.max)), r2.step !== void 0 && (o2.step = String(r2.step)), o2.addEventListener(`change`, () => {
    n2(Number(o2.value));
  }), i2.appendChild(a2), i2.appendChild(o2), i2._setValue = (e3) => {
    o2.value = String(e3);
  }, i2._getInput = () => o2, i2;
}
function o(e2, t2, n2, r2) {
  let i2 = document.createElement(`div`);
  i2.className = `gp-select-wrap`;
  let a2 = document.createElement(`span`);
  a2.className = `gp-select-label`, a2.textContent = e2;
  let o2 = document.createElement(`select`);
  o2.className = `gp-select`, o2.title = e2;
  for (let e3 of t2) {
    let t3 = document.createElement(`option`);
    t3.value = e3.value, t3.textContent = e3.label, e3.value === n2 && (t3.selected = true), o2.appendChild(t3);
  }
  return o2.addEventListener(`change`, () => {
    r2(o2.value);
  }), i2.appendChild(a2), i2.appendChild(o2), i2._setValue = (e3) => {
    o2.value = e3;
  }, i2;
}
function s(t2, n2 = [], r2 = false) {
  let i2 = document.createElement(`div`);
  i2.className = `gp-section` + (r2 ? ` gp-collapsed` : ``);
  let a2 = document.createElement(r2 ? `button` : `h3`);
  a2.className = `gp-section-title`;
  let o2 = document.createElement(`span`);
  if (o2.textContent = t2, r2) {
    a2.type = `button`, a2.setAttribute(`aria-expanded`, `false`);
    let t3 = document.createElement(`span`);
    t3.className = `gp-section-arrow`, t3.appendChild(e(`m6 9 6 6 6-6`)), a2.appendChild(t3), a2.addEventListener(`click`, () => {
      i2.classList.toggle(`gp-collapsed`), a2.setAttribute(`aria-expanded`, i2.classList.contains(`gp-collapsed`) ? `false` : `true`);
    });
  }
  a2.appendChild(o2);
  let s2 = document.createElement(`div`);
  s2.className = `gp-section-body`;
  for (let e2 of n2) s2.appendChild(e2);
  return i2.appendChild(a2), i2.appendChild(s2), i2._body = s2, i2._setTitle = (e2) => {
    o2.textContent = e2;
  }, i2;
}
function c(e2, t2 = `info`) {
  let n2 = document.createElement(`span`);
  return n2.className = `gp-badge gp-badge-${t2}`, n2.textContent = e2, n2;
}
function l(e2, t2, n2 = 200) {
  let r2 = document.createElement(`div`);
  r2.className = `gp-search-wrap`;
  let i2 = document.createElement(`input`);
  i2.className = `gp-search`, i2.type = `text`, i2.placeholder = e2, i2.autocomplete = `off`, i2.spellcheck = false;
  let a2 = null;
  return i2.addEventListener(`input`, () => {
    clearTimeout(a2), a2 = setTimeout(() => t2(i2.value.trim()), n2);
  }), r2.appendChild(i2), r2._getInput = () => i2, r2._setValue = (e3) => {
    i2.value = e3;
  }, r2;
}
function u(...e2) {
  let t2 = document.createElement(`div`);
  t2.className = `gp-btn-row`;
  for (let n2 of e2) t2.appendChild(n2);
  return t2;
}
function d(e2) {
  let t2 = document.createElement(`div`);
  return t2.className = `gp-text-muted`, t2.textContent = e2, t2;
}
export {
  e as a,
  l as c,
  i as d,
  r as f,
  d as i,
  s as l,
  t as n,
  n as o,
  u as r,
  a as s,
  c as t,
  o as u
};
