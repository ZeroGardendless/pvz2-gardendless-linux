import { t as e } from "../core/Logger.js";
import { d as t, h as n, m as r, p as i, getSettings, u as o } from "../core/SettingsStore.js";
import { a as s, i as c, r as ee } from "./Translations.js";
import { a as l } from "./Components.js";
import { r as u, t as d } from "../data/DataDrawer.js";
var te = `
:root {
    --gp-font-ui: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", "Helvetica Neue", Arial, sans-serif;
    --gp-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "DejaVu Sans Mono", monospace;
}

/* Migration stays inside the mod sidebar and uses its normal reading size. */
.gp-migration-panel { margin-bottom: 12px; overflow-wrap: anywhere; }
.gp-migration-panel p { margin: 8px 0; font: inherit; line-height: 1.5; }
.gp-migration-panel summary { cursor: pointer; padding: 6px 0; }
.gp-migration-panel + [inert] { opacity: 0.5; }

.gp-mod-selection-row { display: flex; align-items: center; gap: 8px; padding: 8px 0; }
.gp-mod-selection-row label { display: grid; place-items: center; flex: none; min-width: 24px; min-height: 40px; cursor: pointer; }
.gp-mod-selection-row .gp-mod-name { flex: 1; min-width: 0; text-align: left; justify-content: flex-start; white-space: normal; overflow-wrap: anywhere; border-color: transparent; background: transparent; padding: 8px 0; }
.gp-configured-mods { overflow-wrap: anywhere; }
.gp-configured-mods p { margin: 10px 0; font: inherit; line-height: 1.5; white-space: pre-wrap; }
.gp-configured-mods h3 { font-size: 17px; margin: 16px 0 8px; }
.gp-configured-mods summary { cursor: pointer; padding: 10px 0; }
.gp-configured-mods ul { margin: 0; padding-left: 22px; line-height: 1.5; }
.gp-mod-selection-row input { flex: none; margin: 0; }
.gp-mod-selection-row > .gp-btn-row { flex: none; }
.gp-mod-selection-row .gp-btn:disabled { opacity: 0.4; cursor: default; }

/* One spacing system for pages, navigation rows and adjacent action groups. */
#gp-overlay *, #gp-overlay *::before, #gp-overlay *::after { box-sizing: border-box; }
.gp-page-body { display: flex; flex-direction: column; gap: 12px; min-width: 0; }
.gp-page-body > .gp-section { margin-bottom: 0; }
.gp-configured-mods { display: flex; flex-direction: column; gap: 12px; }
.gp-configured-mods > p, .gp-configured-mods > h3 { margin: 0; }
.gp-content > .gp-btn-row { margin-bottom: 10px; }
.gp-btn-row + .gp-btn-row { margin-top: 6px; }
.gp-btn.gp-navigation-row {
    width: 100%; justify-content: space-between; text-align: left;
    min-height: 48px; padding: 12px; background: rgba(255,255,255,0.04);
}
.gp-navigation-row + .gp-navigation-row { margin-top: 8px; }
.gp-section-title:not(button) { cursor: default; }
button.gp-section-title { cursor: pointer; }
#gp-overlay button:disabled { cursor: default; opacity: 0.45; }

/* ===== Overlay Container ===== */
#gp-overlay {
    position: fixed;
    top: 0; left: 0;
    width: min(420px, 92vw);
    height: 100%;
    background: #1c1c1e;
    color: #f1f5f9;
    z-index: 99999;
    transform: translateX(-100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: var(--gp-font-ui);
    font-variant-numeric: tabular-nums;
    font-size: 15px;
    line-height: 1.5;
    color-scheme: dark;
    display: flex;
    flex-direction: column;
    box-shadow: 4px 0 24px rgba(0,0,0,0.6);
    user-select: text;
    text-align: left;
}
#gp-overlay.gp-open {
    transform: translateX(0);
}

.gp-icon { display: block; flex: 0 0 18px; }
.gp-close-btn, .gp-footer-refresh { display: grid; place-items: center; width: 40px; height: 40px; flex: 0 0 40px; }

#gp-overlay [hidden] { display: none !important; }

/* ===== Header ===== */
.gp-header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 14px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
}
.gp-logo {
    font-weight: 700;
    font-size: 16px;
    color: #fff;
    letter-spacing: 0.5px;
}
.gp-status {
    margin-left: auto;
    font-size: 13px;
    color: #4a9eff;
    flex: 1;
    min-width: 0;
    max-width: 160px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: right;
}
.gp-close-btn {
    background: none;
    border: none;
    color: #888;
    font-size: 18px;
    cursor: pointer;
    padding: 0 4px;
    line-height: 1;
    transition: color 0.15s;
}
.gp-close-btn:hover {
    color: #fff;
}

/* ===== Tab Bar ===== */
.gp-tab-navigation {
    display: flex;
    position: relative;
    flex-shrink: 0;
    min-width: 0;
    border-bottom: 1px solid rgba(255,255,255,0.08);
}
.gp-tab-picker {
    flex: 0 0 auto;
    align-self: center;
    display: grid;
    place-items: center;
    width: 2.667em;
    min-height: 2.667em;
    margin: 2px;
    border: 0;
    border-radius: 9px;
    font: 15px var(--gp-font-ui);
    background: transparent;
    color: #cbd5e1;
    cursor: pointer;
}
.gp-tab-picker:hover, .gp-tab-picker:active { background: rgba(255,255,255,0.1); }
.gp-tab-menu {
    position: absolute;
    right: 6px;
    top: calc(100% + 4px);
    z-index: 2;
    width: max-content;
    min-width: 160px;
    max-width: calc(100% - 12px);
    max-height: calc(100dvh - 140px);
    overflow-y: auto;
    overscroll-behavior: contain;
    padding: 4px;
    border: 1px solid #475569;
    border-radius: 6px;
    background: #0f172a;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.gp-tab-menu button {
    display: block;
    width: 100%;
    min-height: 40px;
    padding: 8px 12px;
    border: 0;
    border-radius: 3px;
    font: 15px var(--gp-font-ui);
    color: #e2e8f0;
    background: transparent;
    text-align: left;
    overflow-wrap: anywhere;
    cursor: pointer;
}
.gp-tab-menu button:hover, .gp-tab-menu button[aria-checked="true"] { background: #1e293b; }
.gp-tab-picker:focus-visible, .gp-tab-menu button:focus-visible { outline: 2px solid #4a9eff; outline-offset: -2px; }
.gp-tab-picker[hidden], .gp-tab-menu[hidden] { display: none; }

.gp-tabs {
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    flex: 1;
    min-width: 0;
    padding: 0 2px;
    scrollbar-width: none;
}
.gp-tabs::-webkit-scrollbar { display: none; }
.gp-tab {
    background: none;
    border: none;
    color: #888;
    font-size: 15px;
    font-family: inherit;
    padding: 8px 12px;
    min-height: 40px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s;
    flex: 0 0 auto;
}
.gp-tab:hover {
    color: #ccc;
}
.gp-tab.gp-tab-active {
    color: #fff;
    border-bottom-color: #4a9eff;
}

/* ===== Content Area ===== */
.gp-content {
    flex: 1;
    overflow-y: auto;
    padding: 14px 16px 16px;
    scroll-padding-bottom: 24px;
}

.gp-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 9px 12px;
    border-top: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.03);
    flex-shrink: 0;
}
.gp-footer-version {
    font-size: 13px;
    color: #80889b;
    white-space: nowrap;
}
.gp-footer-right {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex-wrap: wrap;
    justify-content: flex-end;
}
.gp-footer-update,
.gp-footer-refresh {
    background: none;
    border: none;
    color: #8d97ab;
    font: inherit;
    padding: 0;
}
.gp-footer-update {
    font-size: 13px;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: default;
}
.gp-footer-update:disabled {
    opacity: 1;
}
.gp-footer-update-hot {
    color: #4a9eff;
    cursor: pointer;
}
.gp-footer-update-hot:hover {
    color: #7cb9ff;
    text-decoration: underline;
}
.gp-footer-refresh {
    font-size: 14px;
    line-height: 1;
    cursor: pointer;
    transition: color 0.15s, transform 0.15s;
}
.gp-footer-refresh:hover:not(:disabled) {
    color: #d8e6ff;
    transform: rotate(20deg);
}
.gp-footer-refresh:disabled {
    cursor: default;
    opacity: 0.7;
}
.gp-spinning {
    animation: gp-next-spin 0.9s linear infinite;
}

@keyframes gp-next-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* ===== Scrollbar ===== */
#gp-overlay ::-webkit-scrollbar { width: 5px; }
#gp-overlay ::-webkit-scrollbar-track { background: transparent; }
#gp-overlay ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
#gp-overlay ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }

/* ===== Hotkey Hint Badge ===== */
.gp-f1-hint {
    position: fixed;
    top: 8px; left: 8px;
    background: rgba(16,16,24,0.85);
    color: #888;
    font-family: var(--gp-font-ui);
    font-size: 13px;
    padding: 3px 7px;
    border-radius: 9px;
    z-index: 99998;
    cursor: pointer;
    transition: opacity 0.2s, color 0.15s;
    pointer-events: auto;
}
.gp-f1-hint:hover {
    color: #ccc;
}
.gp-f1-hint.gp-hidden {
    opacity: 0;
    pointer-events: none;
}

/* ===== Components: Button ===== */
.gp-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: rgba(255,255,255,0.08);
    color: #f2f2f7;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 9px;
    padding: 6px 12px;
    min-height: 40px;
    font-size: 15px;
    font-family: inherit;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
    line-height: 1.4;
    text-align: center;
    font-weight: 500;
}
.gp-btn:hover {
    background: rgba(74,158,255,0.25);
    border-color: rgba(74,158,255,0.5);
}
.gp-btn:active {
    background: rgba(74,158,255,0.35);
}
.gp-btn-danger {
    background: rgba(244,67,54,0.12);
    color: #f44336;
    border-color: rgba(244,67,54,0.3);
}
.gp-btn-danger:hover {
    background: rgba(244,67,54,0.22);
    border-color: rgba(244,67,54,0.5);
}
.gp-btn-success {
    background: rgba(76,175,80,0.12);
    color: #4caf50;
    border-color: rgba(76,175,80,0.3);
}
.gp-btn-success:hover {
    background: rgba(76,175,80,0.22);
    border-color: rgba(76,175,80,0.5);
}
.gp-btn-sm {
    padding: 4px 9px;
    font-size: 15px;
    min-height: 40px;
}
.gp-btn-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    row-gap: 10px;
    margin-block: 4px;
}

/* ===== Components: Toggle ===== */
.gp-toggle-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 2px 0;
}
.gp-toggle-label {
    font-size: 15px;
    color: #ccc;
    line-height: 1.4;
}
.gp-toggle {
    position: relative;
    width: 40px; height: 40px;
    padding: 0; border: 0;
    background: transparent;
    cursor: pointer;
    transition: background 0.2s;
    flex-shrink: 0;
}
.gp-toggle::before { content: ""; position: absolute; inset: 9px 0; border-radius: 11px; background: rgba(255,255,255,0.16); }
.gp-toggle.gp-toggle-on::before { background: rgba(74,158,255,0.7); }
.gp-toggle-knob {
    position: absolute;
    top: 11px; left: 2px;
    width: 18px; height: 18px;
    background: #e0e0e0;
    border-radius: 50%;
    transition: transform 0.2s;
}
.gp-toggle.gp-toggle-on .gp-toggle-knob {
    transform: translateX(18px);
    background: #fff;
}

/* ===== Components: Slider ===== */
.gp-slider-wrap {
    padding: 4px 0;
}
.gp-slider-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
}
.gp-slider-label { font-size: 15px; color: #ccc; }
.gp-slider-value { font-size: 15px; color: #4a9eff; font-weight: 600; }
.gp-slider {
    -webkit-appearance: none;
    width: 100%; height: 4px;
    background: rgba(255,255,255,0.12);
    border-radius: 2px;
    outline: none;
}
.gp-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px; height: 14px;
    background: #4a9eff;
    border-radius: 50%;
    cursor: pointer;
}

/* ===== Components: Input ===== */
.gp-input-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 0;
}
.gp-input-label {
    font-size: 15px;
    color: #ccc;
    flex: 0 0 auto;
    white-space: normal;
    overflow-wrap: anywhere;
    flex: 0 0 42%;
    min-width: 0;
    max-width: 42%;
}
.gp-input {
    flex: 1 1 0;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px;
    color: #e0e0e0;
    padding: 4px 8px;
    font-size: 15px;
    font-family: inherit;
    outline: none;
    transition: border-color 0.15s;
    width: 100%;
    min-width: 0;

    min-height: 40px;
    box-sizing: border-box;
}
.gp-input:focus {
    border-color: rgba(74,158,255,0.5);
}

/* ===== Components: Select ===== */
.gp-select-wrap {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 2px 0;
}
.gp-select-label {
    font-size: 15px;
    color: #ccc;
    white-space: normal;
    flex: 0 0 42%;
    min-width: 0;
    overflow-wrap: anywhere;
}
.gp-select {
    -webkit-appearance: none;
    appearance: none;
    background-color: rgba(30,30,45,0.95);
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23888'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 8px center;
    background-size: 10px 6px;
    border: 1px solid rgba(255,255,255,0.18);
    border-radius: 9px;
    color: #e0e0e0;
    padding: 4px 26px 4px 8px;
    font-size: 15px;
    font-family: inherit;
    outline: none;
    cursor: pointer;
    width: 100%;
    min-width: 0;

    min-height: 40px;
    box-sizing: border-box;
}
.gp-select:focus {
    border-color: rgba(74,158,255,0.5);
}
.gp-select option {
    background-color: #1e1e2e;
    color: #e0e0e0;
}
.gp-select option:checked {
    background-color: #1a4a8a;
    color: #ffffff;
}

/* ===== Components: Section ===== */
.gp-section {
    margin: 0 0 16px;
    padding: 0;
}
.gp-section-title {
    width: 100%;
    font-size: 15px;
    font-weight: 600;
    color: #f2f2f7;
    text-transform: none;
    letter-spacing: normal;
    min-height: 40px;
    font-family: inherit;
    margin: 0 0 6px;
    padding: 0;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    user-select: none;
    display: flex;
    align-items: center;
    gap: 6px;
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    text-align: left;
}
.gp-section-arrow {
    font-size: 13px;
    transition: transform 0.15s;
}
.gp-section.gp-collapsed .gp-section-arrow {
    transform: rotate(-90deg);
}
.gp-section-body {
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.gp-section.gp-collapsed .gp-section-body {
    display: none;
}

/* ===== Components: Badge ===== */
.gp-badge {
    display: inline-block;
    font-size: 13px;
    font-weight: 600;
    padding: 1px 6px;
    border-radius: 3px;
    line-height: 1.4;
}
.gp-badge-info { background: rgba(74,158,255,0.2); color: #4a9eff; }
.gp-badge-success { background: rgba(76,175,80,0.2); color: #4caf50; }
.gp-badge-warning { background: rgba(255,152,0,0.2); color: #ff9800; }
.gp-badge-error { background: rgba(244,67,54,0.2); color: #f44336; }

/* ===== Components: List ===== */
.gp-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}
.gp-list-item {
    padding: 8px 10px;
    border-radius: 6px;
    font-size: 15px;
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}
.gp-list-item .gp-text-mono {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
    flex: 1;
}
.gp-list-item .gp-text-muted {
    flex-shrink: 0;
    white-space: nowrap;
}
.gp-list-item:hover {
    background: rgba(255,255,255,0.04);
}

/* ===== Components: Search ===== */
.gp-search-wrap {
    padding: 4px 0 8px;
}
.gp-search {
    width: 100%;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 9px;
    color: #e0e0e0;
    padding: 6px 10px;
    font-size: 15px;
    font-family: inherit;
    outline: none;
    box-sizing: border-box;

    min-height: 40px;
    box-sizing: border-box;
}
.gp-search:focus {
    border-color: rgba(74,158,255,0.5);
}

/* ===== Utilities ===== */
.gp-text-muted { color: #666; font-size: 13px; }
.gp-text-mono { font-family: var(--gp-font-mono); font-size: 13px; }
.gp-mt-8 { margin-top: 8px; }
.gp-mb-8 { margin-bottom: 8px; }
.gp-gap-4 { gap: 4px; }
.gp-code {
    font-family: var(--gp-font-mono);
    font-size: 15px;
    background: rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 9px;
    padding: 8px 10px;
    margin: 4px 0;
    white-space: pre;
    overflow-x: auto;
    line-height: 1.5;
    color: #b0c9e0;
    display: block;
    text-align: left;
    user-select: text;
    cursor: text;
}

/* ===== Pack Card ===== */
.gp-pack-card {
    display: grid;
    grid-template-columns: 44px minmax(0, 1fr) auto;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
}
.gp-pack-card:hover {
    background: rgba(255,255,255,0.055);
}
.gp-pack-thumb {
    width: 44px;
    height: 44px;
    flex-shrink: 0;
    border-radius: 9px;
    background: rgba(255,255,255,0.06);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    line-height: 1;
}
.gp-pack-thumb-fallback {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: #9cdcfe;
}
.gp-pack-info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}
.gp-pack-name-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
}
.gp-pack-name {
    font-weight: 600;
    font-size: 15px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.35;
}
.gp-pack-badge-row {
    display: flex;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;
}
.gp-pack-ctrl {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex-shrink: 0;
}
.gp-pack-requirement-warning {
    color: #ffb74d;
    font-size: 13px;
    line-height: 1.35;
}

/* ===== In-place Data Detail ===== */
#gp-overlay.gp-data-expanded { width: min(1120px, 94vw); }
.gp-content.gp-data-content { padding: 0; overflow: hidden; min-height: 0; }
.gp-data-list-page { height: 100%; overflow: auto; padding: 14px 16px 16px; box-sizing: border-box; }
.gp-data-detail { display: flex; flex-direction: column; height: 100%; min-height: 0; font-size: 15px; }
.gp-data-detail-header { display: flex; align-items: flex-start; gap: 8px; padding: 8px; flex-shrink: 0; }
.gp-data-detail-header strong { flex: 1; min-width: 0; overflow-wrap: anywhere; padding-top: 8px; font: 600 15px/1.5 var(--gp-font-mono); }
.gp-data-icon { display: grid; place-items: center; flex: 0 0 40px; min-height: 40px; border: 0; border-radius: 9px; background: transparent; color: #cbd5e1; cursor: pointer; }
.gp-data-icon:hover, .gp-data-icon:active { background: rgba(255,255,255,0.1); }
.gp-data-icon:focus-visible { outline: 2px solid #4a9eff; outline-offset: -2px; }
.gp-data-detail-body { flex: 1; min-height: 0; overflow: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; }
.gp-data-detail-footer { display: flex; flex-wrap: wrap; gap: 8px; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 12px; }
.gp-data-detail-footer span { flex-basis: 100%; }
.gp-data-detail .gp-drawer-tab { font-size: 15px; min-height: 40px; }
.gp-data-error { color: #fca5a5; overflow-wrap: anywhere; }
.gp-data-dirty { color: #fcd34d; }
.gp-data-error:empty, .gp-data-dirty:empty { display: none; }
.gp-data-compare-controls { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
.gp-data-compare-controls select { flex: 1 1 140px; min-width: 0; font-size: 15px; }
.gp-data-compare-controls label { display: inline-flex; align-items: center; gap: 6px; }
.gp-data-compare { display: grid; grid-template-columns: minmax(0, 1fr); gap: 12px; }
.gp-data-compare-pane { overflow: auto; max-height: 48vh; min-width: 0; background: rgba(0,0,0,0.25); overscroll-behavior: contain; font: 15px/1.5 var(--gp-font-mono); }
.gp-data-compare-row { padding: 8px; width: max-content; min-width: 100%; box-sizing: border-box; }
.gp-data-compare-path { color: #94a3b8; white-space: pre; }
.gp-data-compare-row pre { font: inherit; line-height: 1.5; white-space: pre; margin: 0; }
.gp-data-compare-changed { background: rgba(255,180,60,0.13); border-left: 2px solid #d6a43d; }
@media (min-width: 850px) {
    #gp-overlay.gp-data-expanded .gp-data-compare { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

/* Data Detail Sub Tabs */
.gp-drawer-tabs {
    display: flex;
    overflow-x: auto;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 0 16px;
    flex-shrink: 0;
}
.gp-drawer-tab {
    background: none;
    border: none;
    color: #888;
    font-size: 13px;
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
}
.gp-drawer-tab:hover { color: #ccc; }
.gp-drawer-tab.gp-active { color: #fff; border-bottom-color: #4a9eff; }

/* Tree View */
.gp-tree {
    font-family: 'Consolas', monospace;
    font-size: 13px;
    line-height: 1.6;
    user-select: text;
}
.gp-tree-node {
    padding-left: 14px;
    position: relative;
}
.gp-tree-caret {
    cursor: pointer;
    user-select: none;
    color: #888;
    font-size: 13px;
    position: absolute;
    left: 0;
    top: 3px;
    transition: transform 0.1s;
}
.gp-tree-caret:hover { color: #ccc; }
.gp-tree-caret.gp-collapsed { transform: rotate(-90deg); }
.gp-tree-key { color: #9cdcfe; margin-right: 4px; }
.gp-tree-val-str { color: #ce9178; }
.gp-tree-val-num { color: #b5cea8; }
.gp-tree-val-bool { color: #569cd6; }
.gp-tree-val-null { color: #888; }
.gp-tree-collapsed-text { color: #666; font-style: italic; cursor: pointer; }
.gp-tree-edit-input {
    background: rgba(0,0,0,0.5);
    border: 1px solid #4a9eff;
    color: #fff;
    font-family: inherit;
    font-size: inherit;
    padding: 0 2px;
    outline: none;
    width: auto;
    min-width: 40px;
}
.gp-textarea-edit {
    width: 100%;
    flex: 1;
    min-height: 200px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e0e0e0;
    font-family: 'Consolas', monospace;
    font-size: 13px;
    padding: 8px;
    outline: none;
    resize: vertical;
    white-space: pre;
    tab-size: 2;
}
.gp-textarea-edit:focus { border-color: rgba(74,158,255,0.5); }

.gp-toolbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 12px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
}
.gp-toolbar-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.gp-toolbar-actions {
    margin-top: 2px;
}
.gp-toolbar-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}
.gp-data-item {
    align-items: flex-start;
}
.gp-data-item-main {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;
}
.gp-data-item-title {
    font-size: 13px;
}
.gp-data-item-meta {
    white-space: normal;
    overflow-wrap: anywhere;
}
.gp-data-item-modified {
    border-left: 3px solid rgba(255, 180, 60, 0.7);
    padding-left: 9px;
}
.gp-data-load-more {
    justify-content: center;
    cursor: pointer;
}
.gp-empty-state {
    padding: 16px;
}
.gp-log-toolbar {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 6px;
    margin-bottom: 8px;
}
.gp-log-title-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
}
.gp-log-title {
    font-size: 15px;
    font-weight: 600;
    color: #ccc;
    white-space: nowrap;
    flex-shrink: 0;
}
.gp-log-filter { width: auto; max-width: 60%; }
.gp-log-actions .gp-btn { white-space: nowrap; flex-shrink: 0; }
.gp-inline-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}
.gp-log-list {
    max-height: clamp(280px, 58vh, 560px);
}
.gp-log-entry {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
}
.gp-log-entry-top {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    min-width: 0;
}
.gp-log-entry-top .gp-badge { flex-shrink: 0; white-space: nowrap; }
.gp-log-entry-top .gp-log-module { flex: 1 1 0; min-width: 0; }
.gp-log-entry-time {
    margin-left: auto;
    font-size: 13px;
}
.gp-log-entry-message {
    font-size: 13px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    padding-left: 0;
    width: 100%;
}
.gp-cloud-compare {
    max-height: 240px;
    white-space: pre-wrap;
    word-break: break-word;
}

.gp-btn:focus-visible,
.gp-tab:focus-visible,
.gp-close-btn:focus-visible,
.gp-footer-update-hot:focus-visible,
.gp-footer-refresh:focus-visible,
.gp-section-title:focus-visible,
.gp-toggle:focus-visible,
.gp-select:focus-visible,
.gp-input:focus-visible,
.gp-search:focus-visible,
.gp-drawer-tab:focus-visible,
.gp-textarea-edit:focus-visible {
    outline: 2px solid rgba(74,158,255,0.7);
    outline-offset: 2px;
}

/* ===== Performance Tab ===== */
.gp-perf-shell {
    display: flex;
    flex-direction: column;
    gap: 12px;
}
.gp-perf-hero {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
    padding: 12px;
    border-radius: 8px;
    background: rgba(255,255,255,0.035);
    border: 1px solid rgba(255,255,255,0.07);
    box-shadow: inset 3px 0 0 rgba(74,158,255,0.36);
}
.gp-perf-hero-main {
    min-width: 0;
}
.gp-perf-title-row {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}
.gp-perf-title {
    font-size: 13px;
    font-weight: 700;
    text-transform: none;
    letter-spacing: normal;
    min-height: 40px;
    font-family: inherit;
    color: #8da1bb;
}
.gp-perf-hero-fps-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-top: 8px;
}
.gp-perf-hero-fps {
    font-family: var(--gp-font-mono);
    font-size: 34px;
    line-height: 1;
    font-weight: 700;
    color: #f1f5f9;
}
.gp-perf-hero-unit {
    font-size: 13px;
    color: #4a9eff;
    font-weight: 700;
}
.gp-perf-hero-meta {
    margin-top: 7px;
    color: #9aa5b7;
    font-size: 13px;
    line-height: 1.45;
}
.gp-perf-actions {
    display: flex;
    flex-direction: column;
    gap: 7px;
    min-width: 0;
}
.gp-perf-actions .gp-btn-row {
    flex-wrap: wrap;
}
.gp-perf-actions .gp-btn:disabled {
    opacity: 0.55;
    cursor: default;
}
.gp-perf-sample-status {
    color: #7c879a;
    font-size: 13px;
    line-height: 1.45;
}
.gp-perf-metric-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
}
.gp-perf-metric {
    min-height: 86px;
    padding: 10px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    box-sizing: border-box;
}
.gp-perf-metric-label {
    color: #8d98aa;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 700;
    min-height: 14px;
}
.gp-perf-metric-value {
    margin-top: 8px;
    font-family: var(--gp-font-mono);
    color: #f1f5f9;
    font-size: 22px;
    line-height: 1.05;
    font-weight: 700;
    word-break: break-word;
}
.gp-perf-metric-meta {
    margin-top: 7px;
    color: #7d8798;
    font-size: 13px;
    line-height: 1.35;
}
.gp-perf-good {
    border-color: rgba(76,175,80,0.24);
}
.gp-perf-good .gp-perf-metric-value {
    color: #94e2a0;
}
.gp-perf-warn {
    border-color: rgba(245,158,11,0.3);
}
.gp-perf-warn .gp-perf-metric-value {
    color: #fbbf24;
}
.gp-perf-bad {
    border-color: rgba(244,67,54,0.34);
}
.gp-perf-bad .gp-perf-metric-value {
    color: #fb7185;
}
.gp-perf-neutral {
    border-color: rgba(148,163,184,0.16);
}
.gp-perf-two-col,
.gp-perf-detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 8px;
}
.gp-perf-panel {
    padding: 10px;
    border-radius: 8px;
    background: rgba(255,255,255,0.028);
    border: 1px solid rgba(255,255,255,0.055);
    min-width: 0;
}
.gp-perf-panel-title {
    color: #888;
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    margin-bottom: 9px;
}
.gp-perf-chart-wrap {
    min-width: 0;
}
.gp-perf-chart {
    width: 100%;
    height: 112px;
    display: block;
}
.gp-perf-chart-bg {
    fill: rgba(0,0,0,0.28);
    stroke: rgba(255,255,255,0.08);
}
.gp-perf-chart-grid {
    stroke: rgba(148,163,184,0.14);
    stroke-width: 1;
}
.gp-perf-chart-budget {
    stroke: rgba(245,158,11,0.8);
    stroke-width: 1.5;
    stroke-dasharray: 5 4;
}
.gp-perf-chart-line {
    fill: none;
    stroke: #4a9eff;
    stroke-width: 2.4;
    stroke-linejoin: round;
    stroke-linecap: round;
}
.gp-perf-chart-empty {
    fill: #64748b;
    font-size: 13px;
    font-family: var(--gp-font-ui);
}
.gp-perf-chart-legend {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    color: #758195;
    font-size: 13px;
    line-height: 1.35;
    margin-top: 6px;
}
.gp-perf-bars {
    display: flex;
    flex-direction: column;
    gap: 9px;
}
.gp-perf-bar-top {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-bottom: 4px;
    color: #a8b2c2;
    font-size: 13px;
}
.gp-perf-bar-track {
    height: 8px;
    border-radius: 999px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(148,163,184,0.12);
    overflow: hidden;
}
.gp-perf-bar-fill {
    height: 100%;
    min-width: 2px;
    border-radius: 999px;
    background: #4a9eff;
}
.gp-perf-kv {
    display: flex;
    flex-direction: column;
    gap: 5px;
}
.gp-perf-kv-row {
    display: grid;
    grid-template-columns: minmax(96px, 0.8fr) minmax(0, 1.2fr);
    gap: 8px;
    align-items: start;
    min-width: 0;
    font-size: 13px;
    line-height: 1.35;
}
.gp-perf-kv-label {
    color: #738096;
}
.gp-perf-kv-value {
    min-width: 0;
    color: #cbd5e1;
    text-align: right;
    overflow-wrap: anywhere;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 6px;
}
.gp-perf-report {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.gp-perf-report-summary {
    display: flex;
    gap: 7px;
    align-items: center;
    flex-wrap: wrap;
}

@media (max-width: 760px) {
    #gp-overlay.gp-data-expanded {
        width: 100vw;
    }
    .gp-header,
    .gp-content {
        padding-left: 12px;
        padding-right: 12px;
    }
    .gp-tab {
        padding: 8px 10px;
    }
    .gp-log-toolbar {
        flex-direction: column;
        align-items: stretch;
    }
    .gp-perf-metric-grid {
        grid-template-columns: 1fr;
    }
    .gp-perf-kv-row {
        grid-template-columns: 1fr;
        gap: 2px;
    }
    .gp-perf-kv-value {
        text-align: left;
        justify-content: flex-start;
    }
    .gp-pack-card {
        grid-template-columns: 44px minmax(0, 1fr);
    }
    .gp-pack-name-row {
        flex-direction: column;
        align-items: stretch;
    }
    .gp-pack-ctrl {
        grid-column: 2;
        flex-direction: row;
        flex-wrap: wrap;
    }
}

@media (max-width: 460px) {
    .gp-input-wrap,
    .gp-select-wrap {
        flex-direction: column;
        align-items: stretch;
        gap: 6px;
    }
    .gp-input-label,
    .gp-select-label {
        max-width: none;
        min-width: 0;
        white-space: normal;
    }
    .gp-btn-row .gp-btn {
        flex: 1 1 136px;
    }
}

#gp-overlay .gp-subpage-header .gp-btn { flex: 0 0 auto; }
.gp-subpage-header { margin-bottom: 16px; }

@media (prefers-reduced-motion: reduce) {
    #gp-overlay,
    .gp-tab,
    .gp-btn,
    .gp-toggle,
    .gp-toggle-knob,
    .gp-section-arrow,
    .gp-footer-refresh,
    .gp-perf-chart-line {
        transition: none !important;
        animation: none !important;
    }
}

`, f = new e(`overlay`), p = null, m = null, h = null, g = null, _ = null, v = null, y = null, b = null, x = null, S = false, C = null, w = [], T = ``, E = { status: `idle`, latestVersion: ``, error: `` }, D = { onCheck: null, onOpen: null }, O = n(getSettings().overlayHotkey, o), k = [], A = null;
const te2 = `
/* classic data drawer (restored) */
.gp-drawer {
    position: absolute;
    top: 0;
    left: 100%;
    width: min(680px, calc(100vw - 460px));
    min-width: 360px;
    max-width: calc(100vw - 32px);
    height: 100%;
    background: rgba(16, 16, 24, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.08);
    border-left: none;
    border-radius: 0 8px 8px 0;
    display: flex;
    flex-direction: column;
    transform: translateX(-20px);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s;
    z-index: -1;
    box-shadow: 4px 0 24px rgba(0,0,0,0.6);
}
.gp-drawer.gp-drawer-open {
    transform: translateX(0);
    opacity: 1;
    pointer-events: auto;
}
.gp-drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
}
.gp-drawer-title {
    font-weight: 600;
    font-size: 13px;
    color: #fff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: 'Consolas', monospace;
}
.gp-drawer-close {
    background: none;
    border: none;
    color: #888;
    font-size: 18px;
    cursor: pointer;
    line-height: 1;
    padding: 0 4px;
}
.gp-drawer-close:hover {
    color: #fff;
}
.gp-drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
}

/* Data Detail Sub Tabs */
.gp-drawer-tabs {
    display: flex;
    overflow-x: auto;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    padding: 0 16px;
    flex-shrink: 0;
}
.gp-drawer-tab {
    background: none;
    border: none;
    color: #888;
    font-size: 11px;
    padding: 8px 12px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
}
.gp-drawer-tab:hover { color: #ccc; }
.gp-drawer-tab.gp-active { color: #fff; border-bottom-color: #4a9eff; }

/* Tree View */
.gp-tree {
    font-family: 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.6;
    user-select: text;
}
.gp-tree-node {
    padding-left: 14px;
    position: relative;
}
.gp-tree-caret {
    cursor: pointer;
    user-select: none;
    color: #888;
    font-size: 10px;
    position: absolute;
    left: 0;
    top: 3px;
    transition: transform 0.1s;
}
.gp-tree-caret:hover { color: #ccc; }
.gp-tree-caret.gp-collapsed { transform: rotate(-90deg); }
.gp-tree-key { color: #9cdcfe; margin-right: 4px; }
.gp-tree-val-str { color: #ce9178; }
.gp-tree-val-num { color: #b5cea8; }
.gp-tree-val-bool { color: #569cd6; }
.gp-tree-val-null { color: #888; }
.gp-tree-collapsed-text { color: #666; font-style: italic; cursor: pointer; }
.gp-tree-edit-input {
    background: rgba(0,0,0,0.5);
    border: 1px solid #4a9eff;
    color: #fff;
    font-family: inherit;
    font-size: inherit;
    padding: 0 2px;
    outline: none;
    width: auto;
    min-width: 40px;
}
/* Diff View */
.gp-diff-container {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-family: 'Consolas', monospace;
    font-size: 11px;
}
.gp-diff-row {
    display: flex;
    gap: 8px;
}
.gp-diff-col {
    flex: 1;
    min-width: 0;
    background: rgba(0,0,0,0.3);
    border-radius: 4px;
    padding: 8px;
    overflow-x: auto;
}
.gp-diff-col-title {
    color: #888;
    font-size: 10px;
    margin-bottom: 4px;
    text-transform: uppercase;
}
.gp-diff-line { white-space: pre; line-height: 1.4; display: flex; }
.gp-diff-add { background: rgba(76,175,80,0.15); color: #81c784; }
.gp-diff-sub { background: rgba(244,67,54,0.15); color: #e57373; }
.gp-diff-mod { background: rgba(255,152,0,0.15); color: #ffb74d; }

.gp-textarea-edit {
    width: 100%;
    flex: 1;
    min-height: 200px;
    background: rgba(0,0,0,0.3);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e0e0e0;
    font-family: 'Consolas', monospace;
    font-size: 12px;
    padding: 8px;
    outline: none;
    resize: vertical;
    white-space: pre;
    tab-size: 2;
}
.gp-textarea-edit:focus { border-color: rgba(74,158,255,0.5); }

.gp-toolbar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 12px;
    margin-bottom: 12px;
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.05);
}
.gp-toolbar-controls {
    display: flex;
    flex-direction: column;
    gap: 8px;
}
.gp-toolbar-actions {
    margin-top: 2px;
}
.gp-toolbar-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}
.gp-data-item {
    align-items: flex-start;
}
.gp-data-item-main {
    display: flex;
    flex-direction: column;
    gap: 3px;
    min-width: 0;
    flex: 1;
}
.gp-data-item-title {
    font-size: 12px;
}
.gp-data-item-meta {
    white-space: normal;
    overflow-wrap: anywhere;
}
.gp-data-item-modified {
    border-left: 3px solid rgba(255, 180, 60, 0.7);
    padding-left: 9px;
}
.gp-data-load-more {
    justify-content: center;
    cursor: pointer;
}
.gp-empty-state {
    padding: 16px;
}
.gp-log-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 8px;
}
.gp-log-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
}
.gp-log-title {
    font-size: 11px;
    font-weight: 600;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 0.8px;
}
.gp-inline-actions {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}
.gp-log-list {
    max-height: clamp(280px, 58vh, 560px);
}
.gp-log-entry {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
}
.gp-log-entry-top {
    display: flex;
    align-items: center;
    gap: 6px;
    width: 100%;
    min-width: 0;
}
.gp-log-entry-time {
    margin-left: auto;
    font-size: 10px;
}
.gp-log-entry-message {
    font-size: 11px;
    word-break: break-word;
    padding-left: 4px;
    width: 100%;
}
.gp-cloud-compare {
    max-height: 240px;
    white-space: pre-wrap;
    word-break: break-word;
}

.gp-btn:focus-visible,
.gp-tab:focus-visible,
.gp-close-btn:focus-visible,
.gp-footer-update-hot:focus-visible,
.gp-footer-refresh:focus-visible,
.gp-section-title:focus-visible,
.gp-toggle:focus-visible,
.gp-select:focus-visible,
.gp-input:focus-visible,
.gp-search:focus-visible,
.gp-drawer-tab:focus-visible,
.gp-drawer-close:focus-visible,
.gp-textarea-edit:focus-visible {
    outline: 2px solid rgba(74,158,255,0.7);
    outline-offset: 2px;
}


/* classic blue restoration */
#gp-overlay{background:rgba(2,6,23,.86) !important;backdrop-filter:blur(18px) saturate(1.25);-webkit-backdrop-filter:blur(18px) saturate(1.25);width:var(--gp-overlay-width,min(820px,82vw));min-width:480px}
#gp-overlay .gp-input-wrap,#gp-overlay .gp-select-wrap,#gp-overlay .gp-slider-wrap,#gp-overlay .gp-toggle-wrap,#gp-overlay .gp-card,#gp-overlay .gp-asset-card{border-radius:8px}
#gp-overlay .gp-pack-thumb,#gp-overlay .gp-asset-thumb{border-radius:6px}
#gp-overlay .gp-btn{min-height:32px;font-size:12px;padding:6px 12px;background:rgba(var(--gp-accent-rgb,74,158,255),.15);color:rgb(var(--gp-accent-rgb,74,158,255));border:1px solid rgba(var(--gp-accent-rgb,74,158,255),.3);border-radius:8px;font-weight:600}
#gp-overlay .gp-btn:hover{background:rgba(var(--gp-accent-rgb,74,158,255),.28);border-color:rgba(var(--gp-accent-rgb,74,158,255),.55);box-shadow:0 0 0 1px rgba(var(--gp-accent-rgb,74,158,255),.25)}
#gp-overlay .gp-btn:active{transform:translateY(1px)}
#gp-overlay .gp-btn-danger{background:rgba(244,67,54,.14);color:#f44336;border-color:rgba(244,67,54,.35)}
#gp-overlay .gp-btn-success{background:rgba(76,175,80,.14);color:#4caf50;border-color:rgba(76,175,80,.35)}
#gp-overlay .gp-input,#gp-overlay select,#gp-overlay textarea{background:rgba(2,6,23,.6);border:1px solid rgba(var(--gp-accent-rgb,74,158,255),.25);color:#dbeafe;border-radius:7px}
#gp-overlay .gp-input:focus,#gp-overlay select:focus{border-color:rgba(var(--gp-accent-rgb,74,158,255),.6);box-shadow:0 0 0 2px rgba(var(--gp-accent-rgb,74,158,255),.18)}
#gp-overlay .gp-toggle{background:transparent;border-radius:999px}
#gp-overlay .gp-toggle.gp-toggle-on{border-radius:999px}
#gp-overlay .gp-toggle.gp-toggle-on::before{background:rgba(var(--gp-accent-rgb,74,158,255),.7)}
#gp-overlay .gp-toggle .gp-toggle-knob{border-radius:999px}

#gp-overlay .gp-section{background:rgba(var(--gp-accent-rgb,74,158,255),.05);border:1px solid rgba(var(--gp-accent-rgb,74,158,255),.12)}
#gp-overlay .gp-tab{color:#93c5fd}
#gp-overlay .gp-tab.active{color:#fff;background:rgba(var(--gp-accent-rgb,74,158,255),.22)}
#gp-overlay .gp-header{border-bottom:1px solid rgba(var(--gp-accent-rgb,74,158,255),.18)}
#gp-overlay .gp-slider{accent-color:rgb(var(--gp-accent-rgb,74,158,255))}
#gp-overlay .gp-overlay-resizer{position:absolute;top:0;right:-4px;width:8px;height:100%;cursor:ew-resize;z-index:100000}
#gp-overlay .gp-overlay-resizer::after{content:'';position:absolute;top:50%;right:2px;width:2px;height:56px;transform:translateY(-50%);background:rgba(148,163,184,.35);border-radius:2px}
#gp-overlay.gp-resizing{transition:none !important;user-select:none !important}
`;
let commandPalette = null, commandPaletteInput = null, commandPaletteResults = null, commandPaletteTrigger = null, commandPaletteReturnFocus = null;
const uiRefreshCss = `
/* Unified GP-Next surface and control system. */
#gp-overlay {
    --gp-ui-border: rgba(var(--gp-accent-rgb,74,158,255), .22);
    --gp-ui-border-strong: rgba(var(--gp-accent-rgb, 74, 158, 255), .5);
    --gp-ui-surface: rgba(var(--gp-surface-rgb,13,20,36), var(--gp-surface-opacity,.72));
    --gp-ui-surface-raised: rgba(var(--gp-raised-rgb,21,30,48), var(--gp-raised-opacity,.84));
    --gp-ui-muted: #94a3b8;
    --gp-ui-radius: 11px;
    color: #e2e8f0;
    border-right: 1px solid var(--gp-ui-border);
    background: linear-gradient(145deg,rgba(var(--gp-accent-rgb,74,158,255),.16),transparent 62%),rgba(var(--gp-panel-rgb,8,13,28),.96);
}
#gp-overlay .gp-header {
    min-height: 66px;
    padding: 10px 16px;
    gap: 10px;
    background: linear-gradient(110deg, rgba(var(--gp-accent-rgb, 74, 158, 255), .22), rgba(var(--gp-panel-rgb,8,13,28),.88) 70%);
    border-bottom-color: var(--gp-ui-border-strong);
}
#gp-overlay .gp-logo { display: inline-flex; align-items: center; white-space: nowrap; letter-spacing: .15px; }
#gp-overlay .gp-logo img { width: 32px !important; height: 32px !important; margin-right: 10px !important; flex: none; border-radius: 8px; }
#gp-overlay .gp-status { color: #a5b4fc; font-size: 12px; }
#gp-overlay .gp-command-trigger,
#gp-overlay .gp-close-btn {
    display: inline-grid;
    place-items: center;
    flex: 0 0 36px;
    width: 36px;
    height: 36px;
    padding: 0;
    border: 1px solid transparent;
    border-radius: 9px;
    color: #cbd5e1;
    background: transparent;
    cursor: pointer;
}
#gp-overlay .gp-command-trigger:hover,
#gp-overlay .gp-close-btn:hover {
    color: #fff;
    background: rgba(148, 163, 184, .12);
    border-color: var(--gp-ui-border);
}
#gp-overlay .gp-command-trigger:focus-visible,
#gp-overlay .gp-close-btn:focus-visible {
    outline: 2px solid rgb(var(--gp-accent-rgb, 74, 158, 255));
    outline-offset: 2px;
}
#gp-overlay .gp-tab-navigation {
    padding: 5px 12px;
    background: rgba(var(--gp-panel-rgb,8,13,28), .76);
    border-bottom-color: var(--gp-ui-border);
}
#gp-overlay .gp-tabs { gap: 4px; padding: 0; }
#gp-overlay .gp-tab {
    min-height: 36px;
    margin: 0;
    padding: 7px 11px;
    border: 1px solid transparent;
    border-radius: 8px;
    color: #aebbd0;
    font-size: 13px;
    font-weight: 550;
}
#gp-overlay .gp-tab:hover { color: #f8fafc; background: rgba(148, 163, 184, .09); }
#gp-overlay .gp-tab.gp-tab-active {
    color: #eff6ff;
    background: rgba(var(--gp-accent-rgb, 74, 158, 255), .17);
    border-color: rgba(var(--gp-accent-rgb, 74, 158, 255), .27);
    box-shadow: inset 0 -1px 0 rgba(var(--gp-accent-rgb, 74, 158, 255), .4);
}
#gp-overlay .gp-content {
    padding: 16px;
    background: linear-gradient(155deg,rgba(var(--gp-accent-rgb,74,158,255),.065),transparent 58%);
    scrollbar-color: rgba(148, 163, 184, .38) transparent;
    scrollbar-width: thin;
}
#gp-overlay .gp-page-body { gap: 12px; }
#gp-overlay .gp-page-body > .gp-section,
#gp-overlay .gp-section {
    margin: 0;
    padding: 12px;
    border: 1px solid var(--gp-ui-border);
    border-radius: var(--gp-ui-radius);
    background: var(--gp-ui-surface);
}
#gp-overlay .gp-section-title {
    min-height: 30px;
    margin: 0 0 10px;
    padding: 0 0 8px;
    border-bottom-color: var(--gp-ui-border);
    color: #f1f5f9;
    font-size: 13px;
    font-weight: 650;
}
#gp-overlay .gp-section-body { gap: 8px; }
#gp-overlay .gp-btn {
    min-height: 36px;
    padding: 7px 12px;
    border-radius: 8px;
    background: rgba(var(--gp-accent-rgb,74,158,255), .10);
    color: #dbeafe;
    border-color: rgba(var(--gp-accent-rgb,74,158,255), .24);
    font-size: 13px;
    font-weight: 600;
    box-shadow: none;
    transition: background .15s ease, border-color .15s ease, color .15s ease, transform .12s ease;
}
#gp-overlay .gp-btn:hover:not(:disabled) {
    background: rgba(var(--gp-accent-rgb, 74, 158, 255), .14);
    color: #fff;
    border-color: var(--gp-ui-border-strong);
    box-shadow: none;
}
#gp-overlay .gp-btn:active:not(:disabled) { transform: translateY(1px); }
#gp-overlay .gp-btn-sm { min-height: 30px; padding: 5px 9px; font-size: 12px; }
#gp-overlay .gp-btn-danger { color: #fca5a5; background: rgba(244, 67, 54, .12); border-color: rgba(244, 67, 54, .25); }
#gp-overlay .gp-btn-success { color: #86efac; background: rgba(76, 175, 80, .12); border-color: rgba(76, 175, 80, .25); }
#gp-overlay .gp-btn-row { gap: 7px; row-gap: 7px; margin-block: 6px; }
#gp-overlay .gp-input,
#gp-overlay .gp-search,
#gp-overlay .gp-select,
#gp-overlay select {
    min-height: 36px;
    padding: 7px 10px;
    border: 1px solid var(--gp-ui-border);
    border-radius: 8px;
    background: rgba(var(--gp-control-rgb,4,8,19), .92);
    color: #e2e8f0;
    font: 13px var(--gp-font-ui);
}
#gp-overlay .gp-input:focus,
#gp-overlay .gp-search:focus,
#gp-overlay .gp-select:focus,
#gp-overlay select:focus {
    outline: none;
    border-color: var(--gp-ui-border-strong);
    box-shadow: 0 0 0 3px rgba(var(--gp-accent-rgb, 74, 158, 255), .12);
}
#gp-overlay .gp-input::placeholder,
#gp-overlay .gp-search::placeholder { color: #7f8da4; }
#gp-overlay .gp-toggle-wrap {
    min-height: 38px;
    padding: 3px 8px;
    border-radius: 8px;
}
#gp-overlay .gp-toggle-wrap:hover { background: rgba(var(--gp-accent-rgb,74,158,255), .08); }
#gp-overlay .gp-toggle-label { color: #d3dbea; font-size: 13px; }
#gp-overlay .gp-appearance-controls { display: grid; gap: 11px; }
#gp-overlay .gp-appearance-toggle,
#gp-overlay .gp-appearance-color-row {
    display: grid;
    align-items: center;
    gap: 14px;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid var(--gp-ui-border);
    border-radius: 11px;
    background: rgba(2,6,23,.2);
    cursor: pointer;
}
#gp-overlay .gp-appearance-toggle { grid-template-columns: auto minmax(0,1fr); }
#gp-overlay .gp-appearance-color-row { grid-template-columns: minmax(0,1fr) auto; }
#gp-overlay .gp-appearance-toggle:hover,
#gp-overlay .gp-appearance-color-row:hover { border-color: var(--gp-ui-border-strong); background: rgba(var(--gp-accent-rgb,74,158,255),.055); }
#gp-overlay .gp-appearance-toggle > span,
#gp-overlay .gp-appearance-color-copy { display: grid; gap: 4px; min-width: 0; }
#gp-overlay .gp-appearance-toggle strong,
#gp-overlay .gp-appearance-color-copy strong { color: #e2e8f0; font-size: 14px; font-weight: 650; }
#gp-overlay .gp-appearance-toggle small,
#gp-overlay .gp-appearance-color-copy small { color: #94a3b8; font-size: 12px; line-height: 1.45; }
#gp-overlay .gp-appearance-toggle input[type="checkbox"] { width: 20px; height: 20px; margin: 0 2px; cursor: pointer; }
#gp-overlay input[type="checkbox"] {
    -webkit-appearance: none; appearance: none; position: relative; display: inline-grid; place-content: center;
    width: 19px; height: 19px; flex: 0 0 19px; margin: 0;
    border: 1.5px solid rgba(var(--gp-accent-rgb,74,158,255),.52); border-radius: 5px;
    background: rgba(var(--gp-control-rgb,4,8,19),.94); box-shadow: inset 0 1px 2px rgba(0,0,0,.22);
    cursor: pointer; transition: background .14s ease,border-color .14s ease,box-shadow .14s ease;
}
#gp-overlay input[type="checkbox"]::after {
    content: ""; width: 9px; height: 5px; border: solid #fff; border-width: 0 0 2px 2px;
    transform: translateY(-1px) rotate(-45deg) scale(0); transition: transform .12s ease;
}
#gp-overlay input[type="checkbox"]:checked { border-color: rgb(var(--gp-accent-rgb,74,158,255)); background: rgb(var(--gp-accent-rgb,74,158,255)); box-shadow: 0 0 0 3px rgba(var(--gp-accent-rgb,74,158,255),.14); }
#gp-overlay input[type="checkbox"]:checked::after { transform: translateY(-1px) rotate(-45deg) scale(1); }
#gp-overlay input[type="checkbox"]:focus-visible { outline: 2px solid rgba(var(--gp-accent-rgb,74,158,255),.7); outline-offset: 2px; }
#gp-overlay input[type="checkbox"]:disabled { opacity: .45; cursor: not-allowed; }
#gp-overlay .gp-appearance-color-copy code { width: max-content; padding: 3px 7px; border: 1px solid var(--gp-ui-border); border-radius: 6px; background: rgba(2,6,23,.35); color: #cbd5e1; font: 12px var(--gp-font-mono); }
#gp-overlay .gp-appearance-color-row input[type="color"] { width: 84px; height: 58px; padding: 5px; border: 1px solid var(--gp-ui-border-strong); border-radius: 10px; background: rgba(2,6,23,.55); cursor: pointer; }
#gp-overlay .gp-appearance-color-row input[type="color"]::-webkit-color-swatch-wrapper { padding: 2px; }
#gp-overlay .gp-appearance-color-row input[type="color"]::-webkit-color-swatch { border: 0; border-radius: 6px; }
#gp-overlay #gpnAppearanceRanges { display: grid; gap: 10px; }
#gp-overlay .gp-appearance-range { display: grid; grid-template-columns: minmax(0,1fr) minmax(110px,.7fr); align-items: center; gap: 16px; padding: 12px 14px; border: 1px solid var(--gp-ui-border); border-radius: 11px; background: rgba(var(--gp-surface-rgb,13,20,36),.88); cursor: pointer; }
#gp-overlay .gp-appearance-range input[type="range"] { width: 100%; accent-color: rgb(var(--gp-accent-rgb,74,158,255)); cursor: pointer; }
#gp-overlay .gp-appearance-range output { color: rgb(var(--gp-accent-rgb,74,158,255)); font: 12px var(--gp-font-mono); }
#gp-overlay .gp-badge { padding: 3px 8px; border-radius: 999px; font-size: 11px; line-height: 1.3; }
#gp-overlay .gp-card,
#gp-overlay .gp-asset-card,
#gp-overlay .gp-pack-card,
#gp-overlay .gp-perf-panel,
#gp-overlay .gp-perf-hero,
#gp-overlay .gp-perf-metric,
#gp-overlay .gp-data-item {
    border-color: var(--gp-ui-border);
    border-radius: var(--gp-ui-radius);
    background-color: rgba(var(--gp-surface-rgb,13,20,36),var(--gp-card-opacity,.40));
}
#gp-overlay .gp-list { gap: 4px; }
#gp-overlay .gp-list-item { border-radius: var(--gp-ui-radius); background-color: rgba(var(--gp-raised-rgb,21,30,48),var(--gp-card-opacity,.40)); }
#gp-overlay .gp-footer {
    min-height: 42px;
    padding: 6px 14px;
    background: linear-gradient(90deg,rgba(var(--gp-accent-rgb,74,158,255),.10),rgba(var(--gp-panel-rgb,8,13,28),.72));
    border-top: 1px solid var(--gp-ui-border);
}
#gp-overlay .gp-footer-version { color: var(--gp-ui-muted); font-size: 11px; }
#gp-overlay .gp-log-toolbar { display: grid; grid-template-columns: minmax(0,1fr) minmax(140px,.7fr); align-items: center; gap: 9px; margin-bottom: 12px; }
#gp-overlay .gp-log-title-group { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; min-width: 0; }
#gp-overlay .gp-log-title { margin: 0; color: #f1f5f9; font-size: 15px; font-weight: 650; }
#gp-overlay .gp-log-count { flex: 1 1 auto; font-size: 11px; }
#gp-overlay .gp-log-filter { width: auto; min-width: 84px; max-width: 120px; }
#gp-overlay .gp-log-search { width: 100%; min-width: 0; }
#gp-overlay .gp-log-actions { grid-column: 1 / -1; display: flex; flex-wrap: wrap; gap: 7px; }
#gp-overlay .gp-log-actions .gp-btn { flex: 1 1 auto; white-space: normal; }
#gp-overlay .gp-log-list { display: flex; flex-direction: column; gap: 6px; max-height: calc(100vh - 270px); overflow: auto; }
#gp-overlay .gp-log-entry { display: flex; padding: 10px 11px; border: 1px solid var(--gp-ui-border); border-radius: 9px; background: rgba(2,6,23,.23); }
#gp-overlay .gp-log-entry-top { display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0; }
#gp-overlay .gp-log-module { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
#gp-overlay .gp-log-entry-time { flex: 0 0 auto; margin-left: auto; font-size: 11px; }
#gp-overlay .gp-log-entry-message { width: 100%; color: #d4dce8; font: 12px/1.5 var(--gp-font-mono); overflow-wrap: anywhere; white-space: pre-wrap; }
#gp-overlay .gp-log-empty { margin: 0; padding: 18px 12px; border: 1px dashed var(--gp-ui-border); border-radius: 9px; text-align: center; }
#gp-overlay .gp-overlay-resizer::after { background: rgba(var(--gp-accent-rgb, 74, 158, 255), .45); }
#gp-overlay *::-webkit-scrollbar { width: 8px; height: 8px; }
#gp-overlay *::-webkit-scrollbar-thumb { border: 2px solid transparent; border-radius: 99px; background: rgba(var(--gp-accent-rgb,74,158,255), .34); background-clip: padding-box; }
#gp-overlay *::-webkit-scrollbar-thumb:hover { background: rgba(var(--gp-accent-rgb,74,158,255), .58); background-clip: padding-box; }

/* Searchable tab launcher */
.gp-command-backdrop[hidden] { display: none !important; }
.gp-command-backdrop {
    position: fixed;
    inset: 0;
    z-index: 100001;
    display: grid;
    place-items: start center;
    padding: min(14vh, 116px) 16px 20px;
    background: rgba(1, 5, 15, .68);
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
}
.gp-command-dialog {
    width: min(560px, calc(100vw - 32px));
    max-height: min(70vh, 620px);
    overflow: hidden;
    border: 1px solid rgba(var(--gp-accent-rgb,74,158,255), .32);
    border-radius: 14px;
    background: linear-gradient(145deg,rgba(var(--gp-accent-rgb,74,158,255),.12),transparent 72%),rgba(var(--gp-panel-rgb,9,15,29), .98);
    color: #e2e8f0;
    box-shadow: 0 24px 80px rgba(0, 0, 0, .55), 0 0 0 1px rgba(255, 255, 255, .025);
    font: 14px var(--gp-font-ui);
}
.gp-command-heading { display: flex; align-items: center; justify-content: space-between; padding: 15px 18px 10px; }
.gp-command-title { color: #f8fafc; font-size: 14px; font-weight: 650; }
.gp-command-close { display: grid; place-items: center; width: 30px; height: 30px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: #94a3b8; cursor: pointer; }
.gp-command-close:hover { border-color: rgba(148, 163, 184, .18); background: rgba(148, 163, 184, .1); color: #fff; }
.gp-command-search-wrap { padding: 0 16px 13px; }
.gp-command-search {
    box-sizing: border-box;
    width: 100%;
    min-height: 44px;
    padding: 10px 12px;
    border: 1px solid rgba(var(--gp-accent-rgb, 74, 158, 255), .35);
    border-radius: 9px;
    outline: none;
    background: rgba(var(--gp-control-rgb,2,6,23), .9);
    color: #f1f5f9;
    font: 14px var(--gp-font-ui);
}
.gp-command-search:focus { border-color: rgba(var(--gp-accent-rgb, 74, 158, 255), .7); box-shadow: 0 0 0 3px rgba(var(--gp-accent-rgb, 74, 158, 255), .14); }
.gp-command-search::placeholder { color: #7f8da4; }
.gp-command-results { max-height: min(46vh, 420px); overflow-y: auto; padding: 0 8px 8px; }
.gp-command-option { display: flex; align-items: center; width: 100%; min-height: 42px; padding: 8px 11px; border: 1px solid transparent; border-radius: 8px; background: transparent; color: #cbd5e1; font: 13px var(--gp-font-ui); text-align: left; cursor: pointer; }
.gp-command-option:hover, .gp-command-option:focus-visible, .gp-command-option[aria-selected="true"] { outline: none; border-color: rgba(var(--gp-accent-rgb, 74, 158, 255), .22); background: rgba(var(--gp-accent-rgb, 74, 158, 255), .12); color: #f8fafc; }
.gp-command-empty { margin: 0; padding: 15px 12px 18px; color: #94a3b8; font-size: 13px; text-align: center; }
.gp-command-hint { padding: 9px 16px; border-top: 1px solid rgba(148, 163, 184, .12); color: #77859b; font-size: 11px; }
@media (max-width: 480px) {
    #gp-overlay { min-width: 0; width: 100vw; }
    #gp-overlay .gp-header { padding-inline: 11px; }
    #gp-overlay .gp-content { padding: 12px; }
    #gp-overlay .gp-tab-navigation { padding-inline: 8px; }
    .gp-command-backdrop { padding: 7vh 12px 12px; }
    .gp-command-dialog { width: calc(100vw - 24px); }
}
@media (max-width: 560px) {
    #gp-overlay .gp-log-toolbar { grid-template-columns: minmax(0,1fr); }
    #gp-overlay .gp-log-title-group { flex-wrap: wrap; }
    #gp-overlay .gp-log-filter { margin-left: auto; }
    #gp-overlay .gp-log-actions { grid-column: auto; }
    #gp-overlay .gp-log-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
    #gp-overlay .gp-log-actions .gp-btn { min-width: 0; flex: 1 1 auto; white-space: normal; }
    #gp-overlay .gp-log-actions .gp-btn:last-child:nth-child(odd) { grid-column: 1 / -1; }
}
@media (max-width: 360px) {
    #gp-overlay .gp-logo { font-size: 14px; }
    #gp-overlay .gp-logo img { width: 28px !important; height: 28px !important; }
    #gp-overlay .gp-header { gap: 6px; padding-inline: 8px; }
    #gp-overlay .gp-status { display: none; }
    #gp-overlay .gp-command-trigger, #gp-overlay .gp-close-btn { flex-basis: 32px; width: 32px; height: 32px; }
    #gp-overlay .gp-content { padding: 9px; }
    #gp-overlay .gp-appearance-toggle, #gp-overlay .gp-appearance-color-row { padding: 11px; gap: 10px; }
    #gp-overlay .gp-appearance-color-row input[type="color"] { width: 70px; height: 52px; }
    #gp-overlay .gp-appearance-range { grid-template-columns: minmax(0,1fr); gap: 10px; padding: 11px; }
}
@media (prefers-reduced-motion: reduce) {
    #gp-overlay .gp-btn, #gp-overlay .gp-tab, .gp-command-backdrop, .gp-command-dialog { transition: none !important; animation: none !important; }
}
`;
function injectOverlayStyles() {
  let e2 = document.createElement(`style`);
  e2.id = `gp-next-styles`, e2.textContent = te + te2 + uiRefreshCss, document.head.appendChild(e2);
}
function buildOverlayDom() {
  p = document.createElement(`div`), p.id = `gp-overlay`;
  let e2 = document.createElement(`div`);
  e2.className = `gp-header`;
  let t2 = document.createElement(`span`);
  t2.className = `gp-logo`, t2.textContent = `GP-Next`, y = document.createElement(`span`), y.className = `gp-status`, y.textContent = s(`header.status.waiting`);
  const _gpi = document.createElement(`img`);
  _gpi.src = `/assets/gpnicon.png`;
  _gpi.style.cssText = `width:32px;height:32px;margin-right:10px;vertical-align:middle`;
  _gpi.alt = ``;
  t2.insertBefore(_gpi, t2.firstChild);
  const _rsz = document.createElement(`div`);
  _rsz.className = `gp-overlay-resizer`;
  let _rszOn = false, _rszX = 0, _rszW = 0;
  _rsz.addEventListener(`pointerdown`, (e3) => {
    _rszOn = true, _rszX = e3.clientX, _rszW = p.getBoundingClientRect().width, p.classList.add(`gp-resizing`), _rsz.setPointerCapture?.(e3.pointerId), e3.preventDefault(), e3.stopPropagation();
  });
  _rsz.addEventListener(`pointermove`, (e3) => {
    if (!_rszOn) return;
    let t3 = Math.min(Math.max(_rszW + e3.clientX - _rszX, 480), Math.max(480, innerWidth - 16));
    p.style.width = `${t3}px`;
    try {
      window._gpNextUIState = window._gpNextUIState || {}, window._gpNextUIState.overlayWidth = t3;
    } catch {
    }
  });
  _rsz.addEventListener(`pointerup`, () => {
    if (!_rszOn) return;
    _rszOn = false, p.classList.remove(`gp-resizing`);
    try {
      window._gpNextUIState = window._gpNextUIState || {}, window._gpNextUIState.overlayWidth = p.getBoundingClientRect().width;
    } catch {
    }
  });
  p.appendChild(_rsz);
  ;
  let n2 = document.createElement(`button`);
  n2.className = `gp-close-btn`, n2.setAttribute(`aria-label`, s(`common.close`)), n2.appendChild(l(`m6 6 12 12M18 6 6 18`)), n2.addEventListener(`click`, hideOverlay);
  commandPaletteTrigger = document.createElement(`button`);
  commandPaletteTrigger.type = `button`, commandPaletteTrigger.className = `gp-command-trigger`, commandPaletteTrigger.setAttribute(`aria-haspopup`, `dialog`), commandPaletteTrigger.setAttribute(`aria-controls`, `gp-command-dialog`), commandPaletteTrigger.setAttribute(`aria-expanded`, `false`), commandPaletteTrigger.appendChild(l(`M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm11 3-5-5`)), commandPaletteTrigger.addEventListener(`click`, openCommandPalette);
  e2.appendChild(t2), e2.appendChild(y), e2.appendChild(commandPaletteTrigger), e2.appendChild(n2), h = document.createElement(`div`), h.className = `gp-tab-navigation`, m = document.createElement(`div`), m.className = `gp-tabs`, m.id = `gp-tab-bar`, m.setAttribute(`role`, `tablist`), m.addEventListener(`scroll`, updateTabOverflowMenu, { passive: true }), m.addEventListener(`keydown`, handleTabNavigationKeydown), g = document.createElement(`button`), g.type = `button`, g.className = `gp-tab-picker`, g.hidden = true, g.setAttribute(`aria-haspopup`, `menu`), g.setAttribute(`aria-expanded`, `false`), g.setAttribute(`aria-controls`, `gp-tab-menu`), g.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`, g.addEventListener(`click`, () => {
    if (!_.hidden) return closeTabPicker();
    updateTabOverflowMenu(), !g.hidden && (_.hidden = false, g.setAttribute(`aria-expanded`, `true`), _.querySelector(`button`)?.focus());
  }), _ = document.createElement(`div`), _.id = `gp-tab-menu`, _.className = `gp-tab-menu`, _.setAttribute(`role`, `menu`), _.hidden = true, _.addEventListener(`keydown`, handleTabNavigationKeydown), h.append(m, g, _), h.addEventListener(`focusout`, () => {
    queueMicrotask(() => {
      h.contains(document.activeElement) || closeTabPicker();
    });
  }), document.addEventListener(`pointerdown`, (e3) => {
    h.contains(e3.target) || closeTabPicker();
  }, true);
  let r2 = () => {
    updateTabOverflowMenu(), scrollSelectedTabIntoView();
  };
  new ResizeObserver(r2).observe(h), document.fonts?.ready.then(r2), v = document.createElement(`div`), v.className = `gp-content`, v.id = `gp-content`, v.setAttribute(`role`, `tabpanel`), b = document.createElement(`div`), b.className = `gp-footer`, p.appendChild(e2), p.appendChild(h), p.appendChild(v), p.appendChild(b), document.body.appendChild(p), x = document.createElement(`div`), x.className = `gp-f1-hint`, x.addEventListener(`click`, toggleOverlay), document.body.appendChild(x), buildCommandPalette(), refreshCommandPaletteStrings(), updateHotkeyHint();
}
function buildCommandPalette() {
  const backdrop = document.createElement(`div`);
  backdrop.className = `gp-command-backdrop`, backdrop.hidden = true;
  backdrop.addEventListener(`pointerdown`, (event) => {
    event.target === backdrop && closeCommandPalette();
  });
  const dialog = document.createElement(`section`);
  dialog.id = `gp-command-dialog`, dialog.className = `gp-command-dialog`, dialog.setAttribute(`role`, `dialog`), dialog.setAttribute(`aria-modal`, `true`), dialog.setAttribute(`aria-labelledby`, `gp-command-title`);
  const heading = document.createElement(`div`);
  heading.className = `gp-command-heading`;
  const title = document.createElement(`span`);
  title.id = `gp-command-title`, title.className = `gp-command-title`;
  const close = document.createElement(`button`);
  close.type = `button`, close.className = `gp-command-close`, close.appendChild(l(`m6 6 12 12M18 6 6 18`)), close.addEventListener(`click`, closeCommandPalette);
  heading.append(title, close);
  const searchWrap = document.createElement(`div`);
  searchWrap.className = `gp-command-search-wrap`;
  commandPaletteInput = document.createElement(`input`), commandPaletteInput.type = `search`, commandPaletteInput.className = `gp-command-search`, commandPaletteInput.autocomplete = `off`, commandPaletteInput.spellcheck = false, commandPaletteInput.setAttribute(`aria-controls`, `gp-command-results`), commandPaletteInput.setAttribute(`aria-haspopup`, `listbox`), commandPaletteInput.addEventListener(`input`, renderCommandPaletteResults);
  searchWrap.appendChild(commandPaletteInput);
  commandPaletteResults = document.createElement(`div`), commandPaletteResults.id = `gp-command-results`, commandPaletteResults.className = `gp-command-results`, commandPaletteResults.setAttribute(`role`, `listbox`);
  const hint = document.createElement(`div`);
  hint.className = `gp-command-hint`, hint.textContent = `\u2191 \u2193 to navigate \xB7 Enter to open \xB7 Esc to close`;
  dialog.addEventListener(`keydown`, handleCommandPaletteKeydown), dialog.append(heading, searchWrap, commandPaletteResults, hint), backdrop.appendChild(dialog), document.body.appendChild(backdrop), commandPalette = backdrop;
}
function refreshCommandPaletteStrings() {
  if (!commandPalette) return;
  const title = commandPalette.querySelector(`#gp-command-title`);
  const close = commandPalette.querySelector(`.gp-command-close`);
  const hint = commandPalette.querySelector(`.gp-command-hint`);
  const shortcut = /Mac|iPhone|iPad/.test(navigator.platform) ? `\u2318K` : `Ctrl+K`;
  title.textContent = s(`command.open`), commandPaletteInput.placeholder = s(`command.placeholder`), commandPaletteInput.setAttribute(`aria-label`, s(`command.placeholder`)), close.setAttribute(`aria-label`, s(`common.close`)), close.title = s(`common.close`), hint.textContent = s(`command.hint`), commandPaletteTrigger.setAttribute(`aria-label`, s(`command.open`)), commandPaletteTrigger.title = `${s(`command.open`)} (${shortcut})`;
  renderCommandPaletteResults();
}
function renderCommandPaletteResults() {
  if (!commandPaletteResults || commandPalette.hidden) return;
  const query = commandPaletteInput.value.trim().toLocaleLowerCase();
  const matches = [];
  for (const tab of k) {
    const tabLabel = s(tab.labelKey);
    if (!query || `${tabLabel} ${tab.id}`.toLocaleLowerCase().includes(query)) {
      matches.push({ tab, tabLabel, sectionLabel: "" });
      continue;
    }
    for (const key of tab.searchKeys || []) {
      const sectionLabel = s(key);
      if (sectionLabel.toLocaleLowerCase().includes(query)) matches.push({ tab, tabLabel, sectionLabel });
    }
  }
  commandPaletteResults.replaceChildren();
  for (const match of matches) {
    const option = document.createElement(`button`);
    option.type = `button`, option.className = `gp-command-option`, option.setAttribute(`role`, `option`), option.setAttribute(`aria-selected`, String(match.tab.id === A)), option.textContent = match.sectionLabel ? `${match.tabLabel} \u203A ${match.sectionLabel}` : match.tabLabel, option.addEventListener(`click`, () => {
      switchTab(match.tab.id), closeCommandPalette();
      if (match.sectionLabel) requestAnimationFrame(() => {
        const label = match.sectionLabel.toLocaleLowerCase();
        const target = [...v.querySelectorAll(`.gp-section-title,.gp-input-label,.gp-select-label,.gp-slider-label,.gp-toggle-label,strong`)].find((element) => element.textContent.trim().toLocaleLowerCase().includes(label));
        const section = target?.closest(`.gp-collapsed`);
        section?.querySelector(`.gp-section-title`)?.click();
        const scrollTarget = target?.closest(`.gp-section,.gp-input-wrap,.gp-select-wrap,.gp-slider-wrap,.gp-toggle-wrap,.gp-appearance-range`) || target;
        scrollTarget?.scrollIntoView({ behavior: `smooth`, block: `start` });
      });
    }), commandPaletteResults.appendChild(option);
  }
  if (!matches.length) {
    const empty = document.createElement(`p`);
    empty.className = `gp-command-empty`, empty.textContent = s(`command.empty`), commandPaletteResults.appendChild(empty);
  }
}
function openCommandPalette() {
  if (!commandPalette) return;
  commandPaletteReturnFocus = document.activeElement, commandPaletteInput.value = ``, commandPalette.hidden = false, commandPaletteTrigger.setAttribute(`aria-expanded`, `true`), renderCommandPaletteResults(), requestAnimationFrame(() => commandPaletteInput.focus());
}
function closeCommandPalette() {
  if (!commandPalette || commandPalette.hidden) return;
  commandPalette.hidden = true, commandPaletteTrigger.setAttribute(`aria-expanded`, `false`);
  commandPaletteReturnFocus?.isConnected && commandPaletteReturnFocus.focus({ preventScroll: true });
  commandPaletteReturnFocus = null;
}
function handleCommandPaletteKeydown(event) {
  event.stopPropagation();
  if (event.key === `ArrowDown` || event.key === `ArrowUp`) {
    const options = Array.from(commandPaletteResults.querySelectorAll(`.gp-command-option`));
    if (!options.length) return;
    const currentIndex = options.indexOf(document.activeElement);
    const nextIndex = event.key === `ArrowDown` ? Math.min(currentIndex + 1, options.length - 1) : currentIndex < 0 ? options.length - 1 : Math.max(currentIndex - 1, 0);
    event.preventDefault(), options[nextIndex].focus();
  } else if (event.key === `Enter` && event.target === commandPaletteInput) {
    const first = commandPaletteResults.querySelector(`.gp-command-option`);
    first && (event.preventDefault(), first.click());
  } else if (event.key === `Tab`) {
    const focusable = [commandPaletteInput, ...commandPalette.querySelectorAll(`.gp-command-option`), commandPalette.querySelector(`.gp-command-close`)];
    const index = focusable.indexOf(document.activeElement);
    if (event.shiftKey && index <= 0) event.preventDefault(), focusable.at(-1)?.focus();
    else if (!event.shiftKey && index === focusable.length - 1) event.preventDefault(), commandPaletteInput.focus();
  }
}
function renderFooter() {
  if (!b) return;
  b.innerHTML = ``;
  let e2 = document.createElement(`span`);
  e2.className = `gp-footer-version`, e2.textContent = s(`footer.version`, T || `?`), b.appendChild(e2);
  let t2 = document.createElement(`div`);
  t2.className = `gp-footer-right`;
  let n2 = document.createElement(`button`);
  n2.type = `button`, n2.className = `gp-footer-update`, n2.disabled = E.status !== `update-available`, E.status === `update-available` ? (n2.classList.add(`gp-footer-update-hot`), n2.textContent = s(`footer.updateAvailable`, E.latestVersion || `?`), n2.title = s(`footer.openDownload`), n2.addEventListener(`click`, () => {
    D.onOpen && D.onOpen();
  })) : E.status === `checking` ? n2.textContent = s(`footer.updateChecking`) : E.status === `up-to-date` ? n2.textContent = s(`footer.upToDate`) : E.status === `error` ? (n2.textContent = s(`footer.updateCheckFailed`), n2.title = E.error || s(`footer.updateCheckFailed`)) : n2.textContent = s(`footer.updateIdle`), t2.appendChild(n2);
  let r2 = document.createElement(`button`);
  r2.type = `button`, r2.className = `gp-footer-refresh`, r2.appendChild(l(`M20 7v5h-5M20 12a8 8 0 1 0-2.4 5.7`)), r2.setAttribute(`aria-label`, s(`footer.checkNow`)), r2.title = s(`footer.checkNow`), E.status === `checking` && (r2.disabled = true, r2.classList.add(`gp-spinning`)), r2.addEventListener(`click`, () => {
    D.onCheck && D.onCheck();
  }), t2.appendChild(r2), b.appendChild(t2);
}
function bindOverlayKeyboardShortcuts() {
  document.addEventListener(`keydown`, (e2) => {
    if (shouldHandleToggleHotkey(e2) && r(O, e2)) {
      e2.preventDefault(), e2.stopPropagation(), toggleOverlay();
      return;
    }
    if ((e2.ctrlKey || e2.metaKey) && !e2.altKey && e2.key.toLowerCase() === `k` && S && !isEditableTarget(e2.target)) {
      e2.preventDefault(), e2.stopPropagation(), openCommandPalette();
      return;
    }
    if (e2.key === `Escape` && commandPalette && !commandPalette.hidden) {
      e2.preventDefault(), e2.stopPropagation(), closeCommandPalette();
      return;
    }
    if (e2.key === `Escape` && S && !_.hidden) {
      e2.preventDefault(), e2.stopPropagation(), closeTabPicker(true);
      return;
    }
    if (e2.key === `Escape` && S) {
      if (e2.preventDefault(), e2.stopPropagation(), d() || k.find((e3) => e3.id === A)?.onBack?.()) return;
      hideOverlay();
    }
  }, true);
}
function setCanvasPointerEvents(e2) {
  let t2 = document.getElementById(`GameCanvas`) || document.querySelector(`canvas`);
  t2 && (t2.style.pointerEvents = e2 ? `none` : ``);
}
function renderTabButtons() {
  closeTabPicker(), m.setAttribute(`aria-label`, s(`header.tabs`)), g.setAttribute(`aria-label`, s(`header.moreTabs`)), _.setAttribute(`aria-label`, s(`header.moreTabs`)), m.innerHTML = ``;
  for (let e2 of k) {
    let t2 = document.createElement(`button`);
    t2.type = `button`, t2.className = `gp-tab` + (e2.id === A ? ` gp-tab-active` : ``), t2.textContent = s(e2.labelKey), t2.dataset.tabId = e2.id, t2.id = `gp-tab-${e2.id}`, t2.setAttribute(`role`, `tab`), t2.setAttribute(`aria-controls`, `gp-content`), t2.setAttribute(`aria-selected`, String(e2.id === A)), t2.tabIndex = e2.id === A ? 0 : -1, t2.addEventListener(`click`, () => switchTab(e2.id)), m.appendChild(t2);
  }
  updateTabOverflowMenu(), scrollSelectedTabIntoView();
}
function closeTabPicker(e2 = false) {
  _ && (_.hidden = true, g.setAttribute(`aria-expanded`, `false`), e2 && g.focus({ preventScroll: true }));
}
function getTabButtons() {
  return Array.from(m.querySelectorAll(`.gp-tab`));
}
function scrollSelectedTabIntoView() {
  let e2 = getTabButtons().find((e3) => e3.dataset.tabId === A);
  if (!e2) return;
  let t2 = m.getBoundingClientRect(), n2 = e2.getBoundingClientRect();
  n2.left < t2.left || n2.width > t2.width ? m.scrollLeft += n2.left - t2.left : n2.right > t2.right && (m.scrollLeft += n2.right - t2.right), updateTabOverflowMenu();
}
function updateTabOverflowMenu() {
  if (!m) return;
  let e2 = document.activeElement === g || _.contains(document.activeElement);
  if (g.hidden = m.scrollWidth <= h.clientWidth + 1, g.hidden) {
    closeTabPicker(), _.innerHTML = ``, e2 && getTabButtons().find((e3) => e3.dataset.tabId === A)?.focus({ preventScroll: true });
    return;
  }
  let t2 = m.getBoundingClientRect(), n2 = getTabButtons().filter((e3) => {
    let n3 = e3.getBoundingClientRect();
    return n3.left < t2.left - 1 || n3.right > t2.right + 1;
  }), r2 = _.contains(document.activeElement) ? document.activeElement.dataset.tabId : null;
  _.innerHTML = ``;
  for (let e3 of n2) {
    let t3 = document.createElement(`button`);
    t3.type = `button`, t3.tabIndex = -1, t3.dataset.tabId = e3.dataset.tabId, t3.textContent = e3.textContent, t3.setAttribute(`role`, `menuitemradio`), t3.setAttribute(`aria-checked`, String(e3.dataset.tabId === A)), t3.addEventListener(`click`, () => {
      closeTabPicker(), switchTab(e3.dataset.tabId), scrollSelectedTabIntoView(), getTabButtons().find((t4) => t4.dataset.tabId === e3.dataset.tabId)?.focus({ preventScroll: true });
    }), _.appendChild(t3);
  }
  if (r2) {
    let e3 = Array.from(_.children).find((e4) => e4.dataset.tabId === r2);
    e3 ? e3.focus({ preventScroll: true }) : closeTabPicker(true);
  }
}
function handleTabNavigationKeydown(e2) {
  let t2 = e2.currentTarget === _ ? Array.from(_.children) : getTabButtons(), n2 = t2.indexOf(e2.target);
  if (n2 < 0) return;
  let r2;
  if (e2.key === `ArrowRight` || e2.currentTarget === _ && e2.key === `ArrowDown`) r2 = (n2 + 1) % t2.length;
  else if (e2.key === `ArrowLeft` || e2.currentTarget === _ && e2.key === `ArrowUp`) r2 = (n2 - 1 + t2.length) % t2.length;
  else if (e2.key === `Home`) r2 = 0;
  else if (e2.key === `End`) r2 = t2.length - 1;
  else return;
  e2.preventDefault(), e2.stopPropagation(), e2.currentTarget === m && switchTab(t2[r2].dataset.tabId), t2[r2].focus({ preventScroll: true });
}
function isEditableTarget(e2) {
  return !e2 || typeof e2.closest != `function` || e2.closest(`[data-gp-hotkey-recorder="true"]`) ? false : !!e2.closest(`input, textarea, select, [contenteditable="true"], [contenteditable=""]`);
}
function shouldHandleToggleHotkey(e2) {
  return !(!e2 || isEditableTarget(e2.target) && !i(O));
}
function updateHotkeyHint() {
  if (!x) return;
  let e2 = t(O);
  x.textContent = e2, x.title = s(`header.hotkeyTitle`, e2);
}
function renderActiveTab() {
  u(), v.classList.remove(`gp-data-content`), v.innerHTML = ``;
  let e2 = k.find((e3) => e3.id === A);
  if (e2 && e2.render) try {
    e2.render(v);
  } catch (t2) {
    f.error(`Tab '${e2.id}' render failed: ${t2?.stack || t2}`), v.innerHTML = ``;
    let n2 = document.createElement(`div`);
    n2.className = `gp-text-muted`, n2.textContent = `${s(`common.failed`)}: ${String(t2?.message || t2)}`, v.appendChild(n2);
  }
}
function runTabLifecycleHook(e2, t2) {
  if (typeof e2?.[t2] == `function`) try {
    Promise.resolve(e2[t2]()).catch((n2) => {
      f.error(`Tab '${e2.id}' ${t2} failed: ${n2?.stack || n2}`);
    });
  } catch (n2) {
    f.error(`Tab '${e2.id}' ${t2} failed: ${n2?.stack || n2}`);
  }
}
function showOverlay() {
  p && (c(), S = true, p.classList.add(`gp-open`), x.classList.add(`gp-hidden`), setCanvasPointerEvents(true), updateTabOverflowMenu(), scrollSelectedTabIntoView(), renderActiveTab(), runTabLifecycleHook(k.find((e2) => e2.id === A), `onActivate`));
}
function hideOverlay() {
  p && (closeCommandPalette(), S = false, closeTabPicker(), p.classList.remove(`gp-open`), x.classList.remove(`gp-hidden`), setCanvasPointerEvents(false), u(), runTabLifecycleHook(k.find((e2) => e2.id === A), `onDeactivate`));
}
function toggleOverlay() {
  S ? hideOverlay() : showOverlay();
}
function isOverlayOpen() {
  return S;
}
function setStatus(e2) {
  C = null, w = [], y && (y.textContent = e2);
}
function setStatusFromKey(e2, ...t2) {
  C = e2, w = t2, y && (y.textContent = s(e2, ...t2));
}
function setVersion(e2) {
  T = String(e2 || ``), renderFooter();
}
function setOverlayHotkey(e2) {
  O = n(e2, o), updateHotkeyHint();
}
function getOverlayHotkey() {
  return { ...O };
}
function setUpdateState(e2) {
  E = { ...E, ...e2 || {} }, renderFooter();
}
function bindUpdateActions(e2 = {}) {
  D = { onCheck: typeof e2.onCheck == `function` ? e2.onCheck : null, onOpen: typeof e2.onOpen == `function` ? e2.onOpen : null }, renderFooter();
}
function registerTab(e2) {
  let t2 = k.findIndex((t3) => t3.id === e2.id), n2 = t2 !== -1 && A === e2.id;
  t2 === -1 ? k.push(e2) : k[t2] = e2, m && (renderTabButtons(), A ? n2 && (renderActiveTab(), runTabLifecycleHook(k.find((e3) => e3.id === A), `onActivate`)) : switchTab(e2.id)), commandPalette && !commandPalette.hidden && renderCommandPaletteResults();
}
function switchTab(e2) {
  let t2 = k.find((t3) => t3.id === e2);
  t2 && (A === e2 && v.children.length > 0 || (runTabLifecycleHook(k.find((e3) => e3.id === A), `onDeactivate`), A = e2, m.querySelectorAll(`.gp-tab`).forEach((t3) => {
    t3.classList.toggle(`gp-tab-active`, t3.dataset.tabId === e2), t3.setAttribute(`aria-selected`, String(t3.dataset.tabId === e2)), t3.tabIndex = t3.dataset.tabId === e2 ? 0 : -1;
  }), v.setAttribute(`aria-labelledby`, `gp-tab-${e2}`), scrollSelectedTabIntoView(), renderActiveTab(), runTabLifecycleHook(t2, `onActivate`)));
}
function createOverlay() {
  return injectOverlayStyles(), buildOverlayDom(), bindOverlayKeyboardShortcuts(), ee(() => {
    p.querySelector(`.gp-close-btn`)?.setAttribute(`aria-label`, s(`common.close`)), renderTabButtons(), A && renderActiveTab(), refreshCommandPaletteStrings(), updateHotkeyHint(), C && y && (y.textContent = s(C, ...w)), renderFooter();
  }), renderFooter(), { show: showOverlay, hide: hideOverlay, toggle: toggleOverlay, isOpen: isOverlayOpen, updateStatus: setStatus, updateStatusKey: setStatusFromKey, setVersion, setHotkey: setOverlayHotkey, getHotkey: getOverlayHotkey, setUpdateState, bindUpdateActions, registerTab, switchTab };
}
export {
  showOverlay as a,
  createOverlay,
  hideOverlay,
  setOverlayHotkey as i,
  isOverlayOpen,
  createOverlay as n,
  isOverlayOpen as r,
  setOverlayHotkey,
  showOverlay,
  hideOverlay as t
};
