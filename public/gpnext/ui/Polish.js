import { installControls } from "../../launcher/Controls.js";
let overlayControls;
function installOverlayControls() {
  const root = document.getElementById("gp-overlay");
  if (!overlayControls && root) overlayControls = installControls(root, {
    menuClass: "gp-select-menu",
    buttonClass: "gp-select-control",
    ripples: false
  });
}
function closeOverlayControls() {
  overlayControls?.close();
}
function installOverlayPolish() {
  if (document.getElementById("gp-polish")) return;
  const style = document.createElement("style");
  style.id = "gp-polish";
  style.textContent = `
    #gp-overlay[hidden]{display:none!important}
    #gp-overlay:not(.gp-open){visibility:hidden;pointer-events:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important}
    #gp-overlay.gp-open{visibility:visible}
    #gp-overlay .gp-select-control{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;min-width:0;min-height:40px;padding:9px 12px;border:1px solid var(--gp-border);border-radius:9px;background:var(--gp-field);color:var(--gp-text-primary);font:inherit;text-align:left}
    #gp-overlay .gp-select-control>span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    #gp-overlay .select-arrow{width:8px;height:8px;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);flex-shrink:0}
    .gp-select-menu{position:fixed;z-index:100010;overflow-y:auto;overscroll-behavior:contain;padding:6px;border:1px solid var(--gp-border);border-radius:10px;background:var(--gp-option,#151e30);color:var(--gp-text-primary,#edf4ff);font:14px/1.5 var(--gp-font-ui,system-ui);box-shadow:0 8px 24px #0005;animation:none}
    .gp-select-menu .select-option{padding:10px 12px;border-radius:7px;cursor:pointer;overflow-wrap:anywhere}
    .gp-select-menu .select-option:hover,.gp-select-menu .select-option.focused{background:rgba(var(--gp-accent-rgb,74,158,255),.18)}
    .gp-select-menu .select-option[aria-selected=true]{outline:1px solid var(--gp-accent,#8dbaff);outline-offset:-1px}
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
  closeOverlayControls,
  installOverlayControls,
  installOverlayPolish
};
