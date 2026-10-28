function installOverlayControls() {
}
function installOverlayPolish() {
  if (document.getElementById("gp-polish")) return;
  const style = document.createElement("style");
  style.id = "gp-polish";
  style.textContent = `
    #gp-overlay:not(.gp-open){visibility:hidden;pointer-events:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
    #gp-overlay.gp-open{visibility:visible}
    #gp-overlay .gp-btn:active:not(:disabled){transform:translateY(1px)}
    #gp-overlay .gp-appearance-toggle{display:grid!important;grid-template-columns:32px minmax(0,1fr)!important;gap:16px;text-align:left;align-items:center}
    #gp-overlay .gp-appearance-toggle>span{text-align:left!important}
    #gp-overlay select{padding-inline:12px 30px}
    #gp-overlay .gp-mod-selection-row{padding:10px;gap:12px}
    #gp-overlay .gp-mod-selection-row .gp-pack-thumb{flex:none}
    #gp-overlay .gp-pack-thumb img{width:100%;height:100%;object-fit:cover;border-radius:4px}
    #gp-overlay .gp-mod-name{padding:0;border:0;background:transparent;text-align:left;color:inherit;font-weight:600}
    #gp-overlay .gp-pack-disabled{opacity:.65}
    #gp-overlay .gp-mod-selection-row .gp-pack-ctrl{flex:none;flex-direction:column;align-items:stretch}
    #gp-overlay .gp-tools{display:flex;flex-direction:column;gap:16px;min-width:0}
    #gp-overlay .gp-tools>.gp-section{margin:0}
    #gp-overlay .gp-tools .gp-section-body{display:flex;flex-direction:column;gap:12px}
    #gp-overlay .gp-tools .gp-section-body>p{margin:0;line-height:1.5}
    #gp-overlay .gp-tools .gp-inline-actions{display:flex;flex-wrap:wrap;gap:8px}
    #gp-overlay .gp-log-row{content-visibility:auto;contain-intrinsic-size:auto 44px}
    @media(prefers-reduced-motion:reduce){#gp-overlay,#gp-overlay *{transition:none!important;animation:none!important}}
  `;
  document.head.append(style);
}
export {
  installOverlayControls,
  installOverlayPolish
};
