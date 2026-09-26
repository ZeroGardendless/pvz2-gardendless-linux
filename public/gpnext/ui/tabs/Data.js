import { createListSnapshot } from "../../data/ListSnapshot.js";
import { a as e } from "../Translations.js";
import { n as t } from "../Toast.js";
import { c as n, i as r, n as i, r as a, t as o, u as s } from "../Components.js";
import { A as c, I as l, L as u, T, i as f, k as p } from "../../mods/FileLoader.js";
import { n as m, r as h } from "../../data/DataDrawer.js";
var g = null, _ = null, v = p[0] || ``, y = ``, b = null, x = 100, S = 0;
function bindData(e2, t2) {
  g = e2, _ = t2;
}
function w(e2, t2 = _?.getCurrent(e2)) {
  if (!t2) return [];
  let n2 = c.find((t3) => t3.type === e2);
  if (n2) {
    let e3 = u(n2, t2);
    if (e3.length > 0 || n2.key != null) return e3;
  }
  return t2.objects ? t2.objects.map((e3) => ({ id: e3.aliases?.[0] || `?`, label: e3.aliases?.[0] || `?`, objclass: e3.objclass })) : Object.keys(t2).map((e3) => ({ id: e3, label: e3 }));
}
function render(u2) {
  let C2 = u2;
  if (u2.classList.add(`gp-data-content`), b) {
    let e2 = b.id;
    m(g, _, v, b, u2, () => {
      b = null, C2.innerHTML = ``, render(C2), Array.from(C2.querySelectorAll(`.gp-data-item`)).find((t2) => t2.dataset.entryId === e2)?.focus({ preventScroll: true });
    });
    return;
  }
  h(), u2 = document.createElement(`div`), u2.className = `gp-data-list-page`, C2.appendChild(u2), u2.addEventListener(`scroll`, () => {
    S = u2.scrollTop;
  });
  let D = p.map((e2) => ({ value: e2, label: e2 })), O = s(e(`data.selectType`), D, v, (e2) => {
    v = e2, y = ``, x = 100, S = 0, C2.innerHTML = ``, render(C2);
  });
  u2.appendChild(O);
  let k = n(e(`data.searchPlaceholder`), (e2) => {
    y = e2, x = 100, S = 0, u2.scrollTop = 0, R();
  });
  k._setValue(y);
  let A = i(e(`data.exportCurrent`), async () => {
    _ && await _.exportJson(v, false);
  }, { small: true }), j = i(e(`data.exportOriginal`), async () => {
    _ && await _.exportJson(v, true);
  }, { small: true }), M = i(e(`data.drawer.restoreType`), async () => {
    let n2 = w(v), r2 = 0;
    for (let e2 of n2) await T(v, e2.id) && r2++;
    t(e(`data.drawer.restoreCount`, r2), `success`), y = ``, C2.innerHTML = ``, render(C2);
  }, { small: true, variant: `danger` }), N = i(e(`data.drawer.restoreAll`), async () => {
    await f() ? (t(e(`data.drawer.saveSuccess`), `success`), y = ``, C2.innerHTML = ``, render(C2)) : t(e(`data.drawer.saveFail`), `error`);
  }, { small: true, variant: `danger` }), P = document.createElement(`div`);
  P.className = `gp-toolbar`;
  let F = document.createElement(`div`);
  F.className = `gp-toolbar-controls`, F.appendChild(O), F.appendChild(k);
  let I = a(A, j, M, N);
  I.classList.add(`gp-toolbar-actions`), P.appendChild(F), P.appendChild(I), u2.appendChild(P);
  let L = document.createElement(`div`);
  L.className = `gp-mt-8`, u2.appendChild(L);
  const original = _?.getOriginal(v), current = _?.getCurrent(v);
  const feature = c.find((item) => item.type === v);
  const originals = new Map((original?.objects || []).map((item) => [item.aliases?.[0], item]));
  const currents = new Map((current?.objects || []).map((item) => [item.aliases?.[0], item]));
  const snapshot = createListSnapshot(
    w(v, current),
    (id) => feature ? l(feature, original, id)?.entry : originals.get(id),
    (id) => feature ? l(feature, current, id)?.entry : currents.get(id)
  );
  function R() {
    L.innerHTML = ``;
    let t2 = snapshot.search(y), n2 = document.createElement(`div`);
    if (n2.className = `gp-toolbar-meta`, n2.appendChild(o(v, `info`)), n2.appendChild(o(e(`data.entries`, t2.length), t2.length > 0 ? `success` : `warning`)), L.appendChild(n2), t2.length === 0) {
      L.appendChild(r(e(`data.noData`)));
      return;
    }
    let i2 = document.createElement(`div`);
    i2.className = `gp-list gp-mt-8`, x = Math.min(Math.max(100, x), t2.length);
    function a2(entry) {
      try {
        return snapshot.isModified(entry);
      } catch {
        return false;
      }
    }
    function s2(e2, t3, n3) {
      for (let r2 of e2.slice(t3, n3)) {
        let e3 = document.createElement(`div`);
        e3.className = `gp-list-item gp-data-item`, e3.style.cursor = `pointer`, e3.title = r2.id, e3.dataset.entryId = r2.id, e3.tabIndex = 0, e3.setAttribute(`role`, `button`), a2(r2) && e3.classList.add(`gp-data-item-modified`);
        let t4 = document.createElement(`div`);
        t4.className = `gp-data-item-main`;
        let n4 = document.createElement(`span`);
        n4.className = `gp-text-mono gp-data-item-title`, n4.textContent = r2.label;
        let o2 = document.createElement(`span`);
        o2.className = `gp-text-muted gp-data-item-meta`, o2.textContent = r2.objclass || r2.name?.en || r2.name?.zh || ``, t4.appendChild(n4), o2.textContent && t4.appendChild(o2), e3.appendChild(t4);
        let s3 = () => {
          S = u2.scrollTop, b = r2, C2.innerHTML = ``, render(C2);
        };
        e3.addEventListener(`click`, s3), e3.addEventListener(`keydown`, (e4) => {
          e4.key !== `Enter` && e4.key !== ` ` || (e4.preventDefault(), e4.stopPropagation(), s3());
        }), i2.appendChild(e3);
      }
    }
    s2(t2, 0, x);
    function d2() {
      let n3 = t2.length - x;
      if (n3 <= 0) return;
      let r2 = document.createElement(`div`);
      r2.className = `gp-list-item gp-text-muted gp-data-load-more`, r2.textContent = e(`data.drawer.loadMore`, n3), r2.onclick = () => {
        let e2 = Math.min(x + 100, t2.length);
        r2.remove(), s2(t2, x, e2), x = e2, d2();
      }, i2.appendChild(r2);
    }
    d2(), L.appendChild(i2);
  }
  R(), u2.scrollTop = S;
}
export {
  bindData,
  render
};
