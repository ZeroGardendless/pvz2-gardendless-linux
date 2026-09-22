// GP-Next About
// Standalone ES module: export { render }
const CSS = `
    .gp-about{display:flex;flex-direction:column;gap:10px;overflow-y:auto;padding:4px 2px}
    .gp-about h1{font-size:20px;margin:0;font-family:var(--gp-font-game);letter-spacing:.5px}
    .gp-about h2{font-size:14px;margin:10px 0 2px;color:#7dd3fc}
    .gp-about p{margin:2px 0;font-size:12.5px;line-height:1.55}
    .gp-about .gp-credit{display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.07);border-radius:8px}
    .gp-about .gp-credit b{color:#e2e8f0}
    .gp-about .gp-credit span{color:#94a3b8}
    .gp-about code{background:rgba(255,255,255,.06);padding:1px 5px;border-radius:4px;font-size:11.5px}
`;
const HTML = `
    <h1>GP-Next</h1>
    <p class="gp-text-muted">A community modding overlay for PvZ2 Gardendless - live patching, datapacks, cheats, JS mods and deep engine introspection.</p>
    <h2>Credits</h2>
    <div class="gp-credit"><div><b>GP-Next</b><br><span class="gp-text-muted">overlay, patcher and modding framework</span></div><span>by LingMo</span></div>
    <div class="gp-credit"><div><b>PvZ2: Gardendless - Linux port</b><br><span class="gp-text-muted">this Tauri build, the audio engine overhaul and Linux integration</span></div><span>by Zero</span></div>
    <h2>The tabs</h2>
    <p class="gp-text-muted"><b>Patcher</b> - apply datapack patches to game JSON, with pack management and per-record backups.<br><b>Data</b> - inspect and edit live game data.<br><b>Mods</b> - datapack and JS mod loading.<br><b>Trainer</b> - in-game cheats: sun, coins, plant boosts and more.<br><b>Settings</b> - overlay behavior, appearance, and experimental features (JS modding, world map JSON, plant level system).<br><b>Performance</b> - frame rate and rendering options.<br><b>Log</b> - live diagnostics for everything above.</p>
    <h2>Audio engine (Linux port)</h2>
    <p class="gp-text-muted">The Linux port replaces the browser audio path: a local asset server feeds GStreamer, short sounds decode once into WebAudio buffers, and music streams through a small pool of media elements.</p>
    <h2>Stack</h2>
    <p class="gp-text-muted">Game: <code>PvZ2 Gardendless</code> | Overlay: <code>GP-Next</code> by LingMo | Linux port by <code>Zero</code></p>
`;
function render(container) {
    container.innerHTML = "";
    const style = document.createElement("style");
    style.textContent = CSS;
    container.appendChild(style);
    const wrap = document.createElement("div");
    wrap.className = "gp-about";
    wrap.innerHTML = HTML;
    container.appendChild(wrap);
}
export { render };
