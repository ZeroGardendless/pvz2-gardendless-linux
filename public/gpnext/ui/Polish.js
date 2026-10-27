import { installControls } from "../../launcher/Controls.js";
function installOverlayControls() {
  installControls(document.getElementById("gp-overlay"));
}
function installOverlayPolish() {
  if (document.getElementById("gp-polish")) return;
  const style = document.createElement("style");
  style.id = "gp-polish";
  style.textContent = `
  @font-face{font-family:Google Sans Flex;src:url(/launcher/fonts/GoogleSansFlex-latin.woff2) format('woff2');font-weight:100 1000;font-display:swap}
  #gp-overlay{--gp-font-ui:'Google Sans Flex',system-ui,sans-serif;font-family:var(--gp-font-ui);contain:layout style;box-shadow:8px 0 48px #0003;border-radius:0 24px 24px 0}
  #gp-overlay:not(.gp-open){visibility:hidden;pointer-events:none!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;transition:transform 180ms ease,visibility 0s 180ms}
  #gp-overlay.gp-open{visibility:visible;transition:transform 220ms cubic-bezier(.2,0,0,1)}
  #gp-overlay .gp-content{overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:rgba(var(--gp-accent-rgb),.4) transparent;scroll-behavior:auto}
  #gp-overlay .gp-btn,#gp-overlay .gp-tab{touch-action:manipulation;transition:background-color 140ms ease,color 140ms ease,transform 110ms ease;border-radius:12px}
  #gp-overlay .gp-btn:active:not(:disabled),#gp-overlay .gp-tab:active{transform:scale(.97)}
  #gp-overlay .gp-section{border-radius:16px;border-color:rgba(var(--gp-accent-rgb),.14)}
  #gp-overlay .gp-preference-link{display:flex;align-items:center;gap:16px;padding:18px;min-height:84px;text-align:left;border-radius:18px;background:rgba(var(--gp-surface-rgb),.6)}
  #gp-overlay .gp-preference-link>span{display:grid;gap:5px;flex:1;min-width:0}#gp-overlay .gp-preference-link small{color:var(--gp-text-muted);font-size:12px;white-space:normal}#gp-overlay .gp-preference-link strong{font-weight:550}
  #gp-overlay .gp-section-title{min-height:44px}
  #gp-overlay .gp-appearance-toggle{display:grid!important;grid-template-columns:32px minmax(0,1fr)!important;gap:16px;text-align:left;align-items:center}
  #gp-overlay .gp-appearance-toggle>span{justify-self:stretch;text-align:left!important}
  #gp-overlay .gp-header{min-height:64px}#gp-overlay .gp-logo img{width:38px;height:38px;object-fit:contain}
  #gp-overlay .select-control{display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:42px;padding:10px 14px;border:1px solid rgba(var(--gp-accent-rgb),.24);border-radius:12px;background:rgba(var(--gp-control-rgb),.75);color:var(--gp-text-primary);font:inherit;cursor:pointer;min-width:140px;max-width:100%}
  #gp-overlay .select-control span:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #gp-overlay .select-arrow{width:8px;height:8px;border-right:1.6px solid currentColor;border-bottom:1.6px solid currentColor;transform:rotate(45deg);margin:0 2px 4px 8px;flex:none}
  .select-menu{position:fixed;z-index:2147483647;overflow-y:auto;padding:6px;background:rgb(var(--gp-raised-rgb,21,30,48));color:var(--gp-text-primary,#f5f7fc);border:1px solid rgba(var(--gp-accent-rgb,74,158,255),.25);border-radius:16px;box-shadow:0 12px 36px #0005;font:14px/1.5 'Google Sans Flex',system-ui;overscroll-behavior:contain}
  .select-option{padding:10px 14px;min-height:42px;border-radius:10px;cursor:pointer}.select-option.focused,.select-option:hover{background:rgba(var(--gp-accent-rgb,74,158,255),.14)}.select-option[aria-selected=true]{color:rgb(var(--gp-accent-rgb,74,158,255));font-weight:600}
  #gp-overlay .press-ripple{position:absolute;border-radius:50%;background:currentColor;opacity:.1;pointer-events:none;transform:scale(0);animation:gp-press 500ms ease-out forwards}#gp-overlay button{position:relative;overflow:hidden}@keyframes gp-press{to{transform:scale(1);opacity:0}}
  #gp-overlay .gp-input,#gp-overlay .gp-select{min-height:40px;border-radius:12px}
  #gp-overlay .gp-log-row{content-visibility:auto;contain-intrinsic-size:auto 44px}
  :root[data-gp-theme=light] #gp-overlay{--gp-panel-rgb:246,248,252!important;--gp-surface-rgb:236,240,246!important;--gp-raised-rgb:255,255,255!important;--gp-control-rgb:255,255,255!important;background:rgba(var(--gp-panel-rgb),.97)!important;color:#192331}
  :root[data-gp-theme=light] #gp-overlay :is(.gp-btn,.gp-tab,.gp-section-title,.gp-logo,.gp-input,.gp-select,.gp-appearance-color-copy strong,.gp-appearance-toggle strong,.gp-setting-row strong){color:#192331!important}
  :root[data-gp-theme=light] #gp-overlay :is(.gp-text-muted,.gp-setting-row small,.gp-appearance-toggle small,.gp-appearance-color-copy small){color:#54647a!important}
  :root[data-gp-theme=light] .select-menu{background:#fff;color:#192331}
  @media(max-width:560px){#gp-overlay{min-width:0!important;width:100vw!important;border-radius:0}#gp-overlay .gp-content{padding:12px}#gp-overlay .gp-btn-row{flex-wrap:wrap}#gp-overlay .gp-appearance-range{grid-template-columns:1fr}}
  @media(prefers-reduced-motion:reduce){#gp-overlay,#gp-overlay *{transition:none!important;animation:none!important}}
  `;
  document.head.append(style);
}
export {
  installOverlayControls,
  installOverlayPolish
};
