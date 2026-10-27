var e = `
.ge-toast{background:var(--gp-panel,#232832);color:var(--gp-text-primary,#f5f7fc);padding:12px 14px;border-radius:12px;font-size:13px;font-family:var(--gp-font-ui,system-ui,sans-serif);font-weight:500;
  box-shadow:0 8px 24px rgba(0,0,0,.25),inset 0 1px rgba(255,255,255,.06);opacity:0;transform:translateX(12px);transition:opacity .2s,transform .2s;border:1px solid var(--gp-border,rgba(225,235,255,.16));border-left:3px solid var(--gp-accent,#a4ccff);max-width:280px;overflow-wrap:anywhere;line-height:1.6;cursor:pointer;}
.ge-toast.ge-show{opacity:1;transform:translateX(0);}
.ge-toast.ge-success{border-left-color:var(--gp-success,#a8e6bc);}
.ge-toast.ge-error{border-left-color:var(--gp-error,#ffb4ad);}
@supports ((backdrop-filter:blur(1px)) or (-webkit-backdrop-filter:blur(1px))){.ge-toast{background:var(--gp-panel-glass,rgba(24,29,38,.9));-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);}}
@media (prefers-reduced-transparency:reduce),(prefers-contrast:more){.ge-toast{background:var(--gp-panel,#232832);-webkit-backdrop-filter:none;backdrop-filter:none;}}
@media (prefers-contrast:more){.ge-toast{border-color:#8996aa;}}
@media (prefers-reduced-motion:reduce){.ge-toast{transition:none;transform:none;}}
`, t = null, n = false;
function r() {
  if (n) return;
  n = true;
  let r2 = document.createElement(`style`);
  r2.id = `gp-next-toast-styles`, r2.textContent = e, document.head.appendChild(r2), t = document.createElement(`div`), t.id = `ge-toast-wrap`, t.style.cssText = `position:fixed;top:16px;right:16px;z-index:2147483647;display:flex;flex-direction:column;gap:8px;pointer-events:none;`, document.body.appendChild(t);
}
function i(e2, i2 = ``, a = 3500) {
  n || r();
  let o = document.createElement(`div`);
  for (o.className = `ge-toast${i2 ? ` ge-` + i2 : ``}`, o.textContent = e2, o.style.pointerEvents = `auto`, o.addEventListener(`click`, () => {
    o.classList.remove(`ge-show`), setTimeout(() => o.remove(), 250);
  }), t.appendChild(o), requestAnimationFrame(() => o.classList.add(`ge-show`)), setTimeout(() => {
    o.classList.remove(`ge-show`), setTimeout(() => o.remove(), 250);
  }, a); t.children.length > 5; ) t.firstChild.remove();
}
export {
  i as n,
  r as t
};
