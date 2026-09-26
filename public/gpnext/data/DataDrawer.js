import { a as e } from "../ui/Translations.js";
import { n as t } from "../ui/Toast.js";
import { n, r } from "../ui/Components.js";
import { A as i, C as a, E as o, I as s, T as c, j as l } from "../mods/FileLoader.js";
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
function k(e2, t2, n2) {
  if (!e2) return null;
  let r2 = i.find((e3) => e3.type === t2);
  return r2 ? s(r2, e2, n2)?.entry ?? null : e2.objects ? e2.objects.find((e3) => e3.aliases?.[0] === n2) ?? null : e2[n2] ?? null;
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
function F(t2, r2, i2, a2, o2, s2) {
  j(), v = r2, y = i2, b = a2, x = s2;
  let c2 = JSON.stringify([i2, a2.id]);
  g.has(c2) || g.set(c2, u(A())), _ = g.get(c2), O = true, o2.innerHTML = ``, o2.classList.add(`gp-data-content`), S = document.createElement(`section`), S.className = `gp-data-detail`;
  let l2 = document.createElement(`div`);
  l2.className = `gp-data-detail-header`;
  let d2 = P(e(`data.detail.back`), `m14 6-6 6 6 6`, N), f2 = document.createElement(`strong`);
  f2.textContent = a2.id;
  let p2 = P(e(_.expanded ? `data.detail.narrow` : `data.detail.expand`), `M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5`, () => {
    j(), _.expanded = !_.expanded, document.getElementById(`gp-overlay`).classList.toggle(`gp-data-expanded`, _.expanded), p2.setAttribute(`aria-label`, e(_.expanded ? `data.detail.narrow` : `data.detail.expand`)), p2.title = e(_.expanded ? `data.detail.narrow` : `data.detail.expand`);
  });
  l2.append(d2, f2, p2);
  let m2 = document.createElement(`div`);
  m2.className = `gp-drawer-tabs`;
  for (let [t3, r3] of [[`tree`, `treeView`], [`json`, `rawJson`], [`diff`, `comparison`], [`edit`, `edit`]]) {
    let i3 = n(e(`data.drawer.${r3}`), () => {
      j(), _.tab = t3;
      for (let e2 of m2.children) e2.classList.toggle(`gp-active`, e2.dataset.detailTab === t3);
      R();
    });
    i3.className = `gp-drawer-tab` + (_.tab === t3 ? ` gp-active` : ``), i3.dataset.detailTab = t3, m2.appendChild(i3);
  }
  C = document.createElement(`div`), C.className = `gp-data-detail-body`, S.append(l2, m2, C), o2.appendChild(S), document.getElementById(`gp-overlay`).classList.toggle(`gp-data-expanded`, _.expanded), R(), I(_, i2, a2.id);
}
async function I(e2, t2, n2) {
  if (e2.saving) return;
  let r2 = e2.readVersion = (e2.readVersion || 0) + 1;
  e2.savedLoaded = false, L(e2);
  let o2 = i.some((e3) => e3.type === t2) ? `features` : `objects`, s2 = await a(l.GPN_EDITS, `jsons/${o2}/${t2}.json`);
  e2.readVersion === r2 && (e2.saved = k(s2, t2, n2), e2.savedLoaded = true, L(e2));
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
function z(t2) {
  t2 !== _ || !O || (T.textContent = t2.error, E && (E.textContent = t2.draft === t2.savedDraft ? `` : e(`data.detail.unsaved`)), D && (D.disabled = t2.saving));
}
function B() {
  let i2 = _, a2 = y, s2 = b.id;
  E = document.createElement(`span`), E.className = `gp-data-dirty`, w = document.createElement(`textarea`), w.className = `gp-textarea-edit`, w.value = i2.draft, w.spellcheck = false, w.setAttribute(`aria-label`, e(`data.detail.sourceDraft`));
  let c2 = w;
  w.addEventListener(`input`, () => {
    i2.draft = c2.value, z(i2);
  }), D = n(e(`data.drawer.save`), async () => {
    if (i2.saving) return;
    let n2 = i2.draft, r2;
    try {
      if (r2 = JSON.parse(n2), !r2 || typeof r2 != `object` || Array.isArray(r2)) throw Error(e(`data.detail.objectRequired`));
    } catch (t2) {
      i2.error = `${e(`data.detail.invalidJson`)}: ${t2.message}`, z(i2);
      return;
    }
    i2.error = ``, i2.saving = true, i2.readVersion = (i2.readVersion || 0) + 1, z(i2);
    let c3 = await o(a2, s2, r2);
    i2.saving = false, c3 ? (i2.saved = r2, i2.savedLoaded = true, i2.savedDraft = n2) : i2.error = e(`data.drawer.saveFail`), z(i2), L(i2), c3 && t(e(`data.drawer.saveSuccess`), `success`);
  }, { variant: `success` });
  let l2 = document.createElement(`div`);
  l2.className = `gp-text-muted`, l2.textContent = e(`data.drawer.editHint`), C.append(l2, E, w, r(D)), w.setSelectionRange(i2.selectionStart, i2.selectionEnd, i2.selectionDirection), w.scrollTop = i2.editorScrollTop, w.scrollLeft = i2.editorScrollLeft, z(i2);
}
function V() {
  let r2 = _, i2 = y, a2 = b.id, o2 = document.createElement(`div`);
  o2.className = `gp-data-detail-footer`;
  let s2 = () => {
    o2.innerHTML = ``, o2.appendChild(n(e(`data.drawer.restoreItem`), () => {
      o2.innerHTML = ``;
      let l2 = document.createElement(`span`);
      l2.textContent = e(`data.drawer.restoreConfirm`), o2.append(l2, n(e(`common.cancel`), s2), n(e(`common.confirm`), async () => {
        if (r2.saving) return;
        r2.saving = true, r2.readVersion = (r2.readVersion || 0) + 1, z(r2);
        let n2 = await c(i2, a2);
        r2.saving = false, n2 ? (r2.saved = null, r2.savedDraft = ``, r2.error = ``) : r2.error = e(`data.drawer.saveFail`), z(r2), s2(), L(r2), n2 && t(e(`data.drawer.saveSuccess`), `success`);
      }, { variant: `danger` }));
    }, { variant: `danger` }));
  };
  s2(), C.appendChild(o2);
}
function H() {
  let t2 = { original: k(v?.getOriginal(y), y, b.id), current: A(), saved: _.savedLoaded ? _.saved : null };
  try {
    t2.draft = JSON.parse(_.draft);
  } catch {
  }
  let n2 = Object.keys(t2).filter((e2) => t2[e2] !== null && t2[e2] !== void 0);
  if (!n2.length) {
    T.textContent = e(`data.noData`);
    return;
  }
  let r2 = document.createElement(`div`);
  r2.className = `gp-data-compare-controls`;
  for (let [t3, i3] of [[`left`, `leftSource`], [`right`, `rightSource`]]) {
    let a3 = n2.includes(_[i3]) ? n2 : [...n2, _[i3]], o3 = document.createElement(`select`);
    o3.className = `gp-select`, o3.dataset.detailControl = t3, o3.setAttribute(`aria-label`, e(`data.detail.${t3}Source`));
    for (let t4 of a3) {
      let r3 = document.createElement(`option`);
      r3.disabled = !n2.includes(t4), r3.value = t4, r3.textContent = e(`data.detail.source${t4[0].toUpperCase()}${t4.slice(1)}`), o3.appendChild(r3);
    }
    o3.value = _[i3], o3.addEventListener(`change`, () => {
      j(), _[i3] = o3.value, R(), C.querySelector(`[data-detail-control="${t3}"]`)?.focus({ preventScroll: true });
    }), r2.appendChild(o3);
  }
  for (let t3 of [`onlyChanged`, `syncScroll`]) {
    let n3 = document.createElement(`label`), i3 = document.createElement(`input`);
    i3.type = `checkbox`, i3.checked = _[t3], i3.dataset.detailControl = t3, i3.addEventListener(`change`, () => {
      j(), _[t3] = i3.checked, R(), C.querySelector(`[data-detail-control="${t3}"]`)?.focus({ preventScroll: true });
    }), n3.append(i3, document.createTextNode(e(`data.detail.${t3}`))), r2.appendChild(n3);
  }
  C.appendChild(r2);
  let i2 = [_.leftSource, _.rightSource].filter((e2) => !n2.includes(e2));
  if (i2.length) {
    T.textContent = e(i2.includes(`draft`) ? `data.detail.invalidDraft` : `data.detail.sourceUnavailable`);
    return;
  }
  let a2 = h(t2[_.leftSource], t2[_.rightSource]).filter((e2) => !_.onlyChanged || e2.changed), o2 = document.createElement(`div`);
  o2.className = `gp-data-compare`;
  let s2 = _, c2 = [`left`, `right`].map((t3) => {
    let n3 = document.createElement(`div`);
    n3.className = `gp-data-compare-pane`, n3.tabIndex = 0, n3.setAttribute(`aria-label`, e(`data.detail.${t3}Source`));
    for (let e2 of a2) {
      let r3 = document.createElement(`div`);
      r3.className = `gp-data-compare-row` + (e2.changed ? ` gp-data-compare-changed` : ``);
      let i3 = document.createElement(`div`);
      i3.className = `gp-data-compare-path`, i3.textContent = e2.path;
      let a3 = document.createElement(`pre`);
      a3.textContent = e2[`${t3}Missing`] ? `\u2014` : e2[t3], a3.style.minHeight = `${e2.lines * 1.5}em`, r3.append(i3, a3), n3.appendChild(r3);
    }
    return n3.addEventListener(`scroll`, () => {
      if (!O || s2 !== _ || !C.contains(n3) || (s2.scroll[`diff-${t3}`] = { top: n3.scrollTop, left: n3.scrollLeft }, !s2.syncScroll)) return;
      let e2 = c2[+(t3 === `left`)];
      e2.scrollTop !== n3.scrollTop && (e2.scrollTop = n3.scrollTop), e2.scrollLeft !== n3.scrollLeft && (e2.scrollLeft = n3.scrollLeft);
    }), o2.appendChild(n3), n3;
  });
  C.appendChild(o2), c2.forEach((e2, t3) => {
    let n3 = s2.scroll[`diff-${t3 === 0 ? `left` : `right`}`];
    e2.scrollTop = n3?.top || 0, e2.scrollLeft = n3?.left || 0;
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
