// GP-Next UI Settings
// Standalone ES module: export { render }
// Overlay appearance: font scale, density, accent color, game font.
const KEY = "gpnext-ui";
const DEFAULTS = { fontScale: 1, density: 34, accent: "#3b82f6", gameFont: false };
let state = { ...DEFAULTS };
try { state = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (_) {}

let styleEl = null;
function apply() {
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "gpnext-ui-overrides";
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = `
        @font-face{font-family:'PvZ2 Game';src:url('/assets/resources/native/86/86615cb2-9939-4358-b8e2-ec2d020efeea/FBUSV8C5EI.ttf') format('truetype');font-display:swap}
        .gp-next{--gp-ctrl-h:${state.density}px;--gp-accent:${state.accent};font-size:${(state.fontScale * 100).toFixed(0)}%}
        /* unified controls */
        .gp-next button,.gp-next input,.gp-next select,.gp-next textarea{border-radius:7px;transition:background .12s ease,border-color .12s ease,box-shadow .12s ease}
        .gp-next .gp-btn:not(.gp-btn-danger):not(.gp-btn-success):hover{box-shadow:inset 0 0 0 999px ${state.accent}22}
        .gp-next .gp-btn:active{transform:translateY(1px)}
        .gp-next button:focus-visible,.gp-next input:focus-visible,.gp-next select:focus-visible,.gp-next [role="switch"]:focus-visible{outline:2px solid ${state.accent};outline-offset:1px}
        .gp-next .gp-toggle{transition:background .12s ease}
        .gp-next .gp-toggle.gp-toggle-on{background:${state.accent}}
        .gp-next .gp-slider{accent-color:${state.accent}}
        .gp-next .gp-input:focus,.gp-next select:focus{border-color:${state.accent}}
        /* unified sections */
        .gp-next .gp-section{border-radius:8px;overflow:hidden}
        .gp-next .gp-section-title{transition:background .12s ease}
        .gp-next .gp-section-title:hover{background:${state.accent}18}
        /* unified scrollbars */
        .gp-next ::-webkit-scrollbar{width:10px;height:10px}
        .gp-next ::-webkit-scrollbar-thumb{border-radius:5px}
        .gp-next ::-webkit-scrollbar-thumb:hover{background:${state.accent}88}
        ${state.gameFont ? `.gp-next h1,.gp-next h2,.gp-next h3,.gp-next .gp-header,.gp-next .gp-tabs button,.gp-next .gp-section-title,.gp-next label{font-family:'PvZ2 Game',Inter,Segoe UI,Arial,sans-serif}` : ""}
    `;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
}

function render(container) {
    container.innerHTML = "";
    const root = document.createElement("div");
    root.style.cssText = "display:flex;flex-direction:column;gap:14px;max-width:520px;padding:8px";
    root.innerHTML = `
        <div>
            <label style="display:block;margin-bottom:4px">Font size: <b id="uiFontVal">${Math.round(state.fontScale * 100)}%</b></label>
            <input id="uiFont" type="range" min="80" max="140" step="5" value="${Math.round(state.fontScale * 100)}" style="width:100%">
        </div>
        <div>
            <label style="display:block;margin-bottom:4px">Control density: <b id="uiDensVal">${state.density}px</b></label>
            <input id="uiDens" type="range" min="26" max="46" step="2" value="${state.density}" style="width:100%">
        </div>
        <div>
            <label style="display:block;margin-bottom:4px">Accent color</label>
            <input id="uiAccent" type="color" value="${state.accent}" style="width:64px;height:32px">
        </div>
        <div>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                <input id="uiGameFont" type="checkbox" ${state.gameFont ? "checked" : ""}>
                Use the game font for titles and labels
            </label>
        </div>
        <div>
            <button id="uiReset" type="button">Reset to defaults</button>
        </div>
    `;
    container.appendChild(root);
    root.querySelector("#uiFont").oninput = e => {
        state.fontScale = Number(e.target.value) / 100;
        root.querySelector("#uiFontVal").textContent = e.target.value + "%";
        apply();
    };
    root.querySelector("#uiDens").oninput = e => {
        state.density = Number(e.target.value);
        root.querySelector("#uiDensVal").textContent = state.density + "px";
        apply();
    };
    root.querySelector("#uiAccent").oninput = e => {
        state.accent = e.target.value;
        apply();
    };
    root.querySelector("#uiGameFont").onchange = e => {
        state.gameFont = e.target.checked;
        apply();
    };
    root.querySelector("#uiReset").onclick = () => {
        state = { ...DEFAULTS };
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
        render(container);
    };
    apply();
}

export { render, apply };
