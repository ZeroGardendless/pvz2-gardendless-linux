import { n as e, r as t, u as n } from "../mods/GameConfiguration.js";
import { o as r } from "../ui/Translations.js";
import { n as i, r as a } from "../ui/Components.js";
import { n as o } from "../ui/Toast.js";
import { d as s, f as c, l } from "../mods/FileLoader.js";
function u(e2) {
  let t2 = JSON.stringify(e2, null, 2);
  return { draft: t2, savedDraft: t2, saved: null, savedLoaded: false, tab: `tree`, expanded: false, leftSource: `original`, rightSource: `current`, onlyChanged: false, syncScroll: true, scroll: {}, treeCollapsed: /* @__PURE__ */ new Set(), selectionStart: 0, selectionEnd: 0, selectionDirection: `none`, editorScrollTop: 0, editorScrollLeft: 0, error: ``, saving: false };
}
var d = Symbol(`missing`), f = (e2) => typeof e2 == `object` && !!e2 && !Array.isArray(e2), p = (e2) => e2 === d ? `` : JSON.stringify(e2, null, 2), m = (e2) => e2.replace(/~/g, `~0`).replace(/\//g, `~1`);
function h(e2, t2) {
  let n2 = [];
  function r2(e3, t3, i2) {
    if ((f(e3) || e3 === d) && (f(t3) || t3 === d)) {
      let n3 = [.../* @__PURE__ */ new Set([...Object.keys(e3 === d ? {} : e3), ...Object.keys(t3 === d ? {} : t3)])];
      if (n3.length) {
        for (let a3 of n3) r2(e3 !== d && Object.hasOwn(e3, a3) ? e3[a3] : d, t3 !== d && Object.hasOwn(t3, a3) ? t3[a3] : d, `${i2}/${m(a3)}`);
        return;
      }
    }
    let a2 = p(e3), o2 = p(t3);
    n2.push({ path: i2 || `/`, left: a2, right: o2, leftMissing: e3 === d, rightMissing: t3 === d, changed: a2 !== o2, lines: Math.max(a2.split(`
`).length, o2.split(`
`).length) });
  }
  return r2(e2 === void 0 ? d : e2, t2 === void 0 ? d : t2, ``), n2;
}
var g = /* @__PURE__ */ new Map(), _, v, y, b, x, S, C, w, T, E, D, O = false;
function k(t2, r2, i2) {
  if (!t2) return null;
  let a2 = e.find((e2) => e2.type === r2);
  return a2 ? n(a2, t2, i2)?.entry ?? null : t2.objects ? t2.objects.find((e2) => e2.aliases?.[0] === i2) ?? null : t2[i2] ?? null;
}
function A() {
  return k(v?.getCurrent(y), y, b.id);
}
function j() {
  !O || !_ || !C || (_.scroll[_.tab] = { top: C.scrollTop, left: C.scrollLeft }, Array.from(C.querySelectorAll(`.gp-data-compare-pane`)).forEach((e2, t2) => {
    _.scroll[`diff-${t2 === 0 ? `left` : `right`}`] = { top: e2.scrollTop, left: e2.scrollLeft };
  }), w && (_.draft = w.value, _.selectionStart = w.selectionStart, _.selectionEnd = w.selectionEnd, _.selectionDirection = w.selectionDirection, _.editorScrollTop = w.scrollTop, _.editorScrollLeft = w.scrollLeft));
}
function M() {
  j(), O = false, document.getElementById(`gp-overlay`)?.classList.remove(`gp-data-expanded`);
}
function N() {
  return O ? (M(), x?.(), true) : false;
}
function P(e2, t2, n2) {
  let r2 = document.createElement(`button`);
  return r2.type = `button`, r2.className = `gp-data-icon`, r2.setAttribute(`aria-label`, e2), r2.title = e2, r2.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="${t2}"/></svg>`, r2.addEventListener(`click`, n2), r2;
}
function F(e2, t2, n2, a2, o2, s2) {
  j(), v = t2, y = n2, b = a2, x = s2;
  let c2 = JSON.stringify([n2, a2.id]);
  g.has(c2) || g.set(c2, u(A())), _ = g.get(c2), O = true, o2.innerHTML = ``, o2.classList.add(`gp-data-content`), S = document.createElement(`section`), S.className = `gp-data-detail`;
  let l2 = document.createElement(`div`);
  l2.className = `gp-data-detail-header`;
  let d2 = P(r(`data.detail.back`), `m14 6-6 6 6 6`, N), f2 = document.createElement(`strong`);
  f2.textContent = a2.label || a2.id;
  let p2 = P(r(_.expanded ? `data.detail.narrow` : `data.detail.expand`), `M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5`, () => {
    j(), _.expanded = !_.expanded, document.getElementById(`gp-overlay`).classList.toggle(`gp-data-expanded`, _.expanded), p2.setAttribute(`aria-label`, r(_.expanded ? `data.detail.narrow` : `data.detail.expand`)), p2.title = r(_.expanded ? `data.detail.narrow` : `data.detail.expand`);
  });
  l2.append(d2, f2, p2);
  let m2 = document.createElement(`div`);
  m2.className = `gp-drawer-tabs`;
  for (let [e3, t3] of [[`tree`, `treeView`], [`json`, `rawJson`], [`diff`, `comparison`], [`edit`, `edit`]]) {
    let n3 = i(r(`data.drawer.${t3}`), () => {
      j(), _.tab = e3;
      for (let t4 of m2.children) t4.classList.toggle(`gp-active`, t4.dataset.detailTab === e3);
      R();
    });
    n3.className = `gp-drawer-tab` + (_.tab === e3 ? ` gp-active` : ``), n3.dataset.detailTab = e3, m2.appendChild(n3);
  }
  C = document.createElement(`div`), C.className = `gp-data-detail-body`, S.append(l2, m2, C), o2.appendChild(S), document.getElementById(`gp-overlay`).classList.toggle(`gp-data-expanded`, _.expanded), R(), I(_, n2, a2.id);
}
async function I(n2, r2, i2) {
  if (n2.saving) return;
  let a2 = n2.readVersion = (n2.readVersion || 0) + 1;
  n2.savedLoaded = false, L(n2);
  let o2 = e.some((e2) => e2.type === r2) ? `features` : `objects`, s2 = await l(t.GPN_EDITS, `jsons/${o2}/${r2}.json`);
  n2.readVersion === a2 && (n2.saved = k(s2, r2, i2), n2.savedLoaded = true, L(n2));
}
function L(e2) {
  if (e2 !== _ || !O || e2.tab !== `diff`) return;
  let t2 = C.contains(document.activeElement) ? document.activeElement.dataset.detailControl : null;
  j(), R(), t2 && C.querySelector(`[data-detail-control="${t2}"]`)?.focus({ preventScroll: true });
}
function R() {
  C.innerHTML = ``, w = null, E = null, D = null, T = document.createElement(`div`), T.className = `gp-data-error`, T.setAttribute(`role`, `status`), T.textContent = _.error, C.appendChild(T);
  let e2 = A();
  if (_.tab === `tree` && U(C, e2), _.tab === `json`) {
    let t3 = document.createElement(`pre`);
    t3.className = `gp-code`, t3.textContent = JSON.stringify(e2, null, 2), C.appendChild(t3);
  }
  _.tab === `diff` && H(), _.tab === `edit` && B(), V();
  let t2 = _.scroll[_.tab];
  C.scrollTop = t2?.top || 0, C.scrollLeft = t2?.left || 0;
}
function z(e2) {
  e2 !== _ || !O || (T.textContent = e2.error, E && (E.textContent = e2.draft === e2.savedDraft ? `` : r(`data.detail.unsaved`)), D && (D.disabled = e2.saving));
}
function B() {
  let e2 = _, t2 = y, n2 = b.id;
  E = document.createElement(`span`), E.className = `gp-data-dirty`, w = document.createElement(`textarea`), w.className = `gp-textarea-edit`, w.value = e2.draft, w.spellcheck = false, w.setAttribute(`aria-label`, r(`data.detail.sourceDraft`));
  let s2 = w;
  w.addEventListener(`input`, () => {
    e2.draft = s2.value, z(e2);
  }), D = i(r(`data.drawer.save`), async () => {
    if (e2.saving) return;
    let i2 = e2.draft, a2;
    try {
      if (a2 = JSON.parse(i2), !a2 || typeof a2 != `object` || Array.isArray(a2)) throw Error(r(`data.detail.objectRequired`));
    } catch (t3) {
      e2.error = `${r(`data.detail.invalidJson`)}: ${t3.message}`, z(e2);
      return;
    }
    e2.error = ``, e2.saving = true, e2.readVersion = (e2.readVersion || 0) + 1, z(e2);
    let s3 = await c(t2, n2, a2);
    e2.saving = false, s3 ? (e2.saved = a2, e2.savedLoaded = true, e2.savedDraft = i2) : e2.error = r(`data.drawer.saveFail`), z(e2), L(e2), s3 && o(r(`data.drawer.saveSuccess`), `success`);
  }, { variant: `success` });
  let l2 = document.createElement(`div`);
  l2.className = `gp-text-muted`, l2.textContent = r(`data.drawer.editHint`), C.append(l2, E, w, a(D)), w.setSelectionRange(e2.selectionStart, e2.selectionEnd, e2.selectionDirection), w.scrollTop = e2.editorScrollTop, w.scrollLeft = e2.editorScrollLeft, z(e2);
}
function V() {
  let e2 = _, t2 = y, n2 = b.id, a2 = document.createElement(`div`);
  a2.className = `gp-data-detail-footer`;
  let c2 = () => {
    a2.innerHTML = ``, a2.appendChild(i(r(`data.drawer.restoreItem`), () => {
      a2.innerHTML = ``;
      let l2 = document.createElement(`span`);
      l2.textContent = r(`data.drawer.restoreConfirm`), a2.append(l2, i(r(`common.cancel`), c2), i(r(`common.confirm`), async () => {
        if (e2.saving) return;
        e2.saving = true, e2.readVersion = (e2.readVersion || 0) + 1, z(e2);
        let i2 = await s(t2, n2);
        e2.saving = false, i2 ? (e2.saved = null, e2.savedDraft = ``, e2.error = ``) : e2.error = r(`data.drawer.saveFail`), z(e2), c2(), L(e2), i2 && o(r(`data.drawer.saveSuccess`), `success`);
      }, { variant: `danger` }));
    }, { variant: `danger` }));
  };
  c2(), C.appendChild(a2);
}
function H() {
  let e2 = { original: k(v?.getOriginal(y), y, b.id), current: A(), saved: _.savedLoaded ? _.saved : null };
  try {
    e2.draft = JSON.parse(_.draft);
  } catch {
  }
  let t2 = Object.keys(e2).filter((t3) => e2[t3] !== null && e2[t3] !== void 0);
  if (!t2.length) {
    T.textContent = r(`data.noData`);
    return;
  }
  let n2 = document.createElement(`div`);
  n2.className = `gp-data-compare-controls`;
  for (let [e3, i3] of [[`left`, `leftSource`], [`right`, `rightSource`]]) {
    let a3 = t2.includes(_[i3]) ? t2 : [...t2, _[i3]], o3 = document.createElement(`select`);
    o3.className = `gp-select`, o3.dataset.detailControl = e3, o3.setAttribute(`aria-label`, r(`data.detail.${e3}Source`));
    for (let e4 of a3) {
      let n3 = document.createElement(`option`);
      n3.disabled = !t2.includes(e4), n3.value = e4, n3.textContent = r(`data.detail.source${e4[0].toUpperCase()}${e4.slice(1)}`), o3.appendChild(n3);
    }
    o3.value = _[i3], o3.addEventListener(`change`, () => {
      j(), _[i3] = o3.value, R(), C.querySelector(`[data-detail-control="${e3}"]`)?.focus({ preventScroll: true });
    }), n2.appendChild(o3);
  }
  for (let e3 of [`onlyChanged`, `syncScroll`]) {
    let t3 = document.createElement(`label`), i3 = document.createElement(`input`);
    i3.type = `checkbox`, i3.className = `gp-checkbox`, i3.checked = _[e3], i3.dataset.detailControl = e3, i3.addEventListener(`change`, () => {
      j(), _[e3] = i3.checked, R(), C.querySelector(`[data-detail-control="${e3}"]`)?.focus({ preventScroll: true });
    }), t3.append(i3, document.createTextNode(r(`data.detail.${e3}`))), n2.appendChild(t3);
  }
  C.appendChild(n2);
  let i2 = [_.leftSource, _.rightSource].filter((e3) => !t2.includes(e3));
  if (i2.length) {
    T.textContent = r(i2.includes(`draft`) ? `data.detail.invalidDraft` : `data.detail.sourceUnavailable`);
    return;
  }
  let a2 = h(e2[_.leftSource], e2[_.rightSource]).filter((e3) => !_.onlyChanged || e3.changed), o2 = document.createElement(`div`);
  o2.className = `gp-data-compare`;
  let s2 = _, c2 = [`left`, `right`].map((e3) => {
    let t3 = document.createElement(`div`);
    t3.className = `gp-data-compare-pane`, t3.tabIndex = 0, t3.setAttribute(`aria-label`, r(`data.detail.${e3}Source`));
    for (let n3 of a2) {
      let r2 = document.createElement(`div`);
      r2.className = `gp-data-compare-row` + (n3.changed ? ` gp-data-compare-changed` : ``);
      let i3 = document.createElement(`div`);
      i3.className = `gp-data-compare-path`, i3.textContent = n3.path;
      let a3 = document.createElement(`pre`);
      a3.textContent = n3[`${e3}Missing`] ? `\u2014` : n3[e3], a3.style.minHeight = `${n3.lines * 1.5}em`, r2.append(i3, a3), t3.appendChild(r2);
    }
    return t3.addEventListener(`scroll`, () => {
      if (!O || s2 !== _ || !C.contains(t3) || (s2.scroll[`diff-${e3}`] = { top: t3.scrollTop, left: t3.scrollLeft }, !s2.syncScroll)) return;
      let n3 = c2[+(e3 === `left`)];
      n3.scrollTop !== t3.scrollTop && (n3.scrollTop = t3.scrollTop), n3.scrollLeft !== t3.scrollLeft && (n3.scrollLeft = t3.scrollLeft);
    }), o2.appendChild(t3), t3;
  });
  C.appendChild(o2), c2.forEach((e3, t3) => {
    let n3 = s2.scroll[`diff-${t3 === 0 ? `left` : `right`}`];
    e3.scrollTop = n3?.top || 0, e3.scrollLeft = n3?.left || 0;
  });
}
function U(e2, t2) {
  let n2 = document.createElement(`div`);
  n2.className = `gp-tree`;
  function r2(e3, t3, n3, i2 = ``) {
    let a2 = document.createElement(`div`);
    a2.className = `gp-tree-node`;
    let o2 = document.createElement(`span`);
    if (o2.className = `gp-tree-key`, o2.textContent = e3 === null ? `` : `"${e3}": `, t3 === null) {
      let e4 = document.createElement(`span`);
      e4.className = `gp-tree-val-null`, e4.textContent = `null`, a2.appendChild(o2), a2.appendChild(e4);
    } else if (typeof t3 == `boolean`) {
      let e4 = document.createElement(`span`);
      e4.className = `gp-tree-val-bool`, e4.textContent = t3.toString(), a2.appendChild(o2), a2.appendChild(e4);
    } else if (typeof t3 == `number`) {
      let e4 = document.createElement(`span`);
      e4.className = `gp-tree-val-num`, e4.textContent = t3.toString(), a2.appendChild(o2), a2.appendChild(e4);
    } else if (typeof t3 == `string`) {
      let e4 = document.createElement(`span`);
      e4.className = `gp-tree-val-str`, e4.textContent = `"${t3}"`, a2.appendChild(o2), a2.appendChild(e4);
    } else if (Array.isArray(t3)) {
      let e4 = document.createElement(`span`);
      e4.className = `gp-tree-caret`, e4.textContent = `\u25BC`, a2.appendChild(e4), a2.appendChild(o2), a2.appendChild(document.createTextNode(`[  (${t3.length})`));
      let n4 = document.createElement(`div`), s2 = _.treeCollapsed.has(i2);
      n4.style.display = s2 ? `none` : `block`, e4.classList.toggle(`gp-collapsed`, s2), e4.onclick = () => {
        s2 = !s2, s2 ? _.treeCollapsed.add(i2) : _.treeCollapsed.delete(i2), e4.classList.toggle(`gp-collapsed`, s2), n4.style.display = s2 ? `none` : `block`;
      }, t3.forEach((e5, t4) => r2(null, e5, n4, `${i2}/${t4}`)), a2.appendChild(n4), a2.appendChild(document.createTextNode(`]`));
    } else if (typeof t3 == `object`) {
      let e4 = document.createElement(`span`);
      e4.className = `gp-tree-caret`, e4.textContent = `\u25BC`, a2.appendChild(e4), a2.appendChild(o2), a2.appendChild(document.createTextNode(`{`));
      let n4 = document.createElement(`div`), s2 = _.treeCollapsed.has(i2);
      n4.style.display = s2 ? `none` : `block`, e4.classList.toggle(`gp-collapsed`, s2), e4.onclick = () => {
        s2 = !s2, s2 ? _.treeCollapsed.add(i2) : _.treeCollapsed.delete(i2), e4.classList.toggle(`gp-collapsed`, s2), n4.style.display = s2 ? `none` : `block`;
      };
      for (let [e5, a3] of Object.entries(t3)) r2(e5, a3, n4, `${i2}/${e5.replace(/~/g, `~0`).replace(/\//g, `~1`)}`);
      a2.appendChild(n4), a2.appendChild(document.createTextNode(`}`));
    }
    n3.appendChild(a2);
  }
  r2(null, t2, n2), e2.appendChild(n2);
}
export {
  F as n,
  M as r,
  N as t
};
