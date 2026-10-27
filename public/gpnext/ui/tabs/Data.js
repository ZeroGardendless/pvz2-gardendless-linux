import { d as e, l as t, n, t as r } from "../../mods/GameConfiguration.js";
import { o as i } from "../Translations.js";
import { c as a, i as o, n as s, r as c, u as l } from "../Components.js";
import { n as u } from "../Toast.js";
import { d, n as f } from "../../mods/FileLoader.js";
import { n as p, r as m } from "../../data/DataDrawer.js";
function h(e2, t2) {
  let n2, r2 = [], i2 = /* @__PURE__ */ new Map(), a2 = /* @__PURE__ */ new Map(), o2 = /* @__PURE__ */ new Map();
  return { refresh(s2, c2) {
    let l2 = JSON.stringify([s2, c2]);
    l2 !== n2 && (n2 = l2, r2 = e2(c2).map((e3) => ({ entry: e3, search: `${e3.id}
${e3.label}`.toLowerCase() })), i2 = t2(s2), a2 = t2(c2), o2.clear());
  }, search(e3) {
    let t3 = e3.toLowerCase();
    return r2.filter((e4) => !t3 || e4.search.includes(t3)).map((e4) => e4.entry);
  }, isModified(e3) {
    if (!o2.has(e3)) {
      let t3 = i2.get(e3), n3 = a2.get(e3);
      o2.set(e3, !!t3 && !!n3 && JSON.stringify(t3) !== JSON.stringify(n3));
    }
    return o2.get(e3);
  } };
}
var g = null, _ = null, v = r[0] || ``, y = ``, b = null, x = 100, S = 0;
function bindData(e2, t2) {
  g = e2, _ = t2;
}
function w(t2, r2 = _?.getCurrent(t2)) {
  if (!r2) return [];
  let i2 = n.find((e2) => e2.type === t2);
  if (i2) {
    let t3 = e(i2, r2);
    if (t3.length > 0 || i2.key != null) return t3;
  }
  return r2.objects ? r2.objects.map((e2) => ({ id: e2.aliases?.[0] || `?`, label: e2.aliases?.[0] || `?`, objclass: e2.objclass })) : Object.keys(r2).map((e2) => ({ id: e2, label: e2 }));
}
function render(e2) {
  let C2 = e2;
  if (e2.classList.add(`gp-data-content`), b) {
    let t2 = b.id;
    p(g, _, v, b, e2, () => {
      b = null, C2.innerHTML = ``, render(C2), Array.from(C2.querySelectorAll(`.gp-data-item`)).find((e3) => e3.dataset.entryId === t2)?.focus({ preventScroll: true });
    });
    return;
  }
  m(), e2 = document.createElement(`div`), e2.className = `gp-data-list-page`, C2.appendChild(e2), e2.addEventListener(`scroll`, () => {
    S = e2.scrollTop;
  });
  let E = r.map((e3) => ({ value: e3, label: e3 })), D = l(i(`data.selectType`), E, v, (e3) => {
    v = e3, y = ``, x = 100, S = 0, C2.innerHTML = ``, render(C2);
  });
  e2.appendChild(D);
  let O = a(i(`data.searchPlaceholder`), (t2) => {
    y = t2, x = 100, S = 0, e2.scrollTop = 0, z();
  });
  O._setValue(y);
  let k = s(i(`data.exportCurrent`), async () => {
    _ && await _.exportJson(v, false);
  }, { small: true }), A = s(i(`data.exportOriginal`), async () => {
    _ && await _.exportJson(v, true);
  }, { small: true }), j = s(i(`data.drawer.restoreType`), async () => {
    let e3 = w(v), t2 = 0;
    for (let n2 of e3) await d(v, n2.id) && t2++;
    u(i(`data.drawer.restoreCount`, t2), `success`), y = ``, C2.innerHTML = ``, render(C2);
  }, { small: true, variant: `danger` }), M = s(i(`data.drawer.restoreAll`), async () => {
    await f() ? (u(i(`data.drawer.saveSuccess`), `success`), y = ``, C2.innerHTML = ``, render(C2)) : u(i(`data.drawer.saveFail`), `error`);
  }, { small: true, variant: `danger` }), N = document.createElement(`div`);
  N.className = `gp-toolbar`;
  let P = document.createElement(`div`);
  P.className = `gp-toolbar-controls`, P.appendChild(D), P.appendChild(O);
  let F = c(k, A, j, M);
  F.classList.add(`gp-toolbar-actions`), N.appendChild(P), N.appendChild(F), e2.appendChild(N);
  let I = document.createElement(`div`);
  I.className = `gp-mt-8`, e2.appendChild(I);
  let L = n.find((e3) => e3.type === v), R = h((e3) => w(v, e3), (e3) => {
    if (!e3) return /* @__PURE__ */ new Map();
    if (L) {
      let n2 = /* @__PURE__ */ new Map(), r2 = L.key ? [{ key: L.key, idKey: L.idKey || `CODENAME` }] : (L.extraKeys || []).filter((e4) => e4.idKey);
      for (let i2 of r2) for (let r3 of e3[i2.key] || []) {
        let e4 = L.key ? String(r3[i2.idKey]) : t(i2.key, r3[i2.idKey]);
        n2.has(e4) || n2.set(e4, r3);
      }
      return n2;
    }
    return new Map((e3.objects || []).map((e4) => [e4.aliases?.[0], e4]));
  });
  function z() {
    I.innerHTML = ``, R.refresh(_?.getOriginal(v), _?.getCurrent(v));
    let t2 = R.search(y), n2 = document.createElement(`div`);
    if (n2.className = `gp-toolbar-meta`, n2.appendChild(o(i(`data.entries`, t2.length))), I.appendChild(n2), t2.length === 0) {
      I.appendChild(o(i(`data.noData`)));
      return;
    }
    let r2 = document.createElement(`div`);
    r2.className = `gp-list gp-mt-8`, x = Math.min(Math.max(100, x), t2.length);
    function a2(t3, n3, i2) {
      for (let a3 of t3.slice(n3, i2)) {
        let t4 = document.createElement(`div`);
        t4.className = `gp-list-item gp-data-item`, t4.style.cursor = `pointer`, t4.title = a3.id, t4.dataset.entryId = a3.id, t4.tabIndex = 0, t4.setAttribute(`role`, `button`), R.isModified(a3.id) && t4.classList.add(`gp-data-item-modified`);
        let n4 = document.createElement(`div`);
        n4.className = `gp-data-item-main`;
        let i3 = document.createElement(`span`);
        i3.className = `gp-text-mono gp-data-item-title`, i3.textContent = a3.label;
        let o2 = document.createElement(`span`);
        o2.className = `gp-text-muted gp-data-item-meta`, o2.textContent = a3.objclass || a3.name?.en || a3.name?.zh || ``, n4.appendChild(i3), o2.textContent && n4.appendChild(o2), t4.appendChild(n4);
        let s3 = () => {
          S = e2.scrollTop, b = a3, C2.innerHTML = ``, render(C2);
        };
        t4.addEventListener(`click`, s3), t4.addEventListener(`keydown`, (e3) => {
          e3.key !== `Enter` && e3.key !== ` ` || (e3.preventDefault(), e3.stopPropagation(), s3());
        }), r2.appendChild(t4);
      }
    }
    a2(t2, 0, x);
    function s2() {
      let e3 = t2.length - x;
      if (e3 <= 0) return;
      let n3 = document.createElement(`div`);
      n3.className = `gp-list-item gp-text-muted gp-data-load-more`, n3.textContent = i(`data.drawer.loadMore`, e3), n3.onclick = () => {
        x += 100, z();
      }, r2.appendChild(n3);
    }
    s2(), I.appendChild(r2);
  }
  z(), e2.scrollTop = S;
}
export {
  bindData,
  render
};
