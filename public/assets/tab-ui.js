// GP-Next UI Settings
// Standalone ES module: export { render }
// Controls the real overlay shell (#gp-overlay) and its stylesheet variables.
const KEY = "gpnext-ui";
const DEFAULTS = { scale: 1, width: 820, gameFont: false, compact: false };
let state = { ...DEFAULTS };
try { state = { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch (_) {}

let styleEl = null;
function apply() {
    if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "gpnext-ui-overrides";
        document.head.appendChild(styleEl);
    }
    const scalePct = Math.round(state.scale * 100);
    styleEl.textContent = `
        #gp-overlay { zoom: ${state.scale}; }
        #gp-overlay { --gp-overlay-width: min(${state.width}px, 90vw) !important; }
        ${state.compact ? `
        #gp-overlay .gp-btn { min-height: 26px; padding: 4px 10px; font-size: 11px; }
        #gp-overlay .gp-content { gap: 6px; }
        #gp-overlay .gp-section-body { gap: 6px; }
        ` : ""}
        ${state.gameFont ? `
        #gp-overlay .gp-pack-name,
        #gp-overlay .gp-header h1,
        #gp-overlay .gp-tab,
        #gp-overlay .gp-section-title span:last-child { font-family: var(--gp-font-game); }
        ` : ""}
    `;
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
}

function render(container) {
    const scalePct = Math.round(state.scale * 100);
    container.innerHTML = "";
    const root = document.createElement("div");
    root.style.cssText = "display:flex;flex-direction:column;gap:16px;max-width:560px;padding:10px";
    root.innerHTML = `
        <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span>Interface scale</span><b id="uiScaleVal">${scalePct}%</b>
            </div>
            <input id="uiScale" type="range" min="70" max="140" step="5" value="${scalePct}" style="width:100%">
        </div>
        <div>
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
                <span>Overlay width</span><b id="uiWidthVal">${state.width}px</b>
            </div>
            <input id="uiWidth" type="range" min="480" max="1100" step="20" value="${state.width}" style="width:100%">
        </div>
        <div style="display:flex;flex-direction:column;gap:10px">
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
                <input id="uiGameFont" type="checkbox" ${state.gameFont ? "checked" : ""}>
                Game font for pack names and headers
            </label>
            <label style="display:flex;align-items:center;gap:10px;cursor:pointer">
                <input id="uiCompact" type="checkbox" ${state.compact ? "checked" : ""}>
                Compact mode (tighter controls)
            </label>
        </div>
        <div>
            <button id="uiReset" type="button" class="gp-btn">Reset to defaults</button>
        </div>
    `;
    container.appendChild(root);
    root.querySelector("#uiScale").oninput = e => {
        state.scale = Number(e.target.value) / 100;
        root.querySelector("#uiScaleVal").textContent = e.target.value + "%";
        apply();
    };
    root.querySelector("#uiWidth").oninput = e => {
        state.width = Number(e.target.value);
        root.querySelector("#uiWidthVal").textContent = state.width + "px";
        apply();
    };
    root.querySelector("#uiGameFont").onchange = e => { state.gameFont = e.target.checked; apply(); };
    root.querySelector("#uiCompact").onchange = e => { state.compact = e.target.checked; apply(); };
    root.querySelector("#uiReset").onclick = () => {
        state = { ...DEFAULTS };
        try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
        render(container);
    };
    apply();
}

export { render, apply };
