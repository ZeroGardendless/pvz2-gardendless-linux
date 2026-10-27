import { f as e } from "../../platform/CloudJson.js";
import { d as t } from "../../platform/FileSystem.js";
import { c as n } from "../../mods/GameConfiguration.js";
import { n as r } from "../../core/Logger.js";
import { isJsModdingRuntimeEnabled, getSettings } from "../../core/SettingsStore.js";
import { C as o, _ as s, b as c, f as l, g as u, h as ee, m as te, o as d, p as f, v as p } from "../Translations.js";
import { n as m, r as ne, t as h } from "../Components.js";
import { n as g } from "../Toast.js";
import { a, r as ie, t as ae } from "../Overlay.js";
import { i, r as se } from "../../runtime/HpOverlay.js";
import { n as ce } from "../../platform/Dialog.js";
var le = 1500, _ = null, v = 0, y = null;
function b() {
  return typeof window < `u` && !!(window.__TAURI_INTERNALS__ || window.__TAURI__);
}
function x() {
  return performance?.now?.() ?? Date.now();
}
function S(e2, t2 = null) {
  return { source: `tauri`, status: `unavailable`, reason: e2, details: t2, collectedAtMs: Date.now(), os: null, app: null, process: null, system: null };
}
function ue(e2) {
  return !e2 || typeof e2 != `object` ? S(`empty-native-snapshot`) : { ...e2, source: e2.source || `tauri/sysinfo`, status: e2.status || `available` };
}
function de(e2 = {}) {
  let t2 = e2.refresh !== false;
  return _ ||= S(b() ? `not-sampled-yet` : `tauri-runtime-unavailable`), t2 && fe().catch(() => {
  }), _;
}
async function fe(t2 = {}) {
  let n2 = t2.force === true, r2 = x() - v;
  return !n2 && _ && r2 < le ? _ : y || (b() ? (y = e(`get_native_performance_snapshot`).then((e2) => (_ = ue(e2), v = x(), _)).catch((e2) => (_ = S(`tauri-invoke-failed`, String(e2)), v = x(), _)).finally(() => {
    y = null;
  }), y) : (_ = S(`tauri-runtime-unavailable`), v = x(), _));
}
var pe = class {
  constructor(e2) {
    if (!Number.isInteger(e2) || e2 < 1) throw RangeError(`Invalid frame history capacity`);
    this.capacity = e2, this.values = Array(e2), this.count = 0, this.next = 0;
  }
  push(e2) {
    this.values[this.next] = e2, this.next = (this.next + 1) % this.capacity, this.count = Math.min(this.count + 1, this.capacity);
  }
  snapshot() {
    return Array.from({ length: this.count }, (e2, t2) => this.values[(this.next - this.count + t2 + this.capacity) % this.capacity]);
  }
}, me = 5e3, he = 8, ge = false, C = [], w = null, T = 0, E = ``;
function _e() {
  return performance?.now?.() ?? Date.now();
}
function ve(e2, t2 = 1) {
  if (!Number.isFinite(e2)) return null;
  let n2 = 10 ** t2;
  return Math.round(e2 * n2) / n2;
}
function ye(e2) {
  return e2 ? Number.isFinite(Number(e2.count)) ? Number(e2.count) : e2._map && typeof e2._map == `object` ? Object.keys(e2._map).length : e2.map && typeof e2.map == `object` ? Object.keys(e2.map).length : null : null;
}
function be() {
  let e2 = f(), t2 = e2?.game?._frameRate ?? e2?.game?.frameRate ?? null, n2 = Number(t2);
  if (Number.isFinite(n2) && n2 > 0) return n2;
  let r2 = getSettings()?.frameRate;
  if (r2 === `0`) return null;
  let i2 = Number(r2);
  return Number.isFinite(i2) && i2 > 0 ? i2 : null;
}
function xe(e2) {
  switch (e2) {
    case `inGameScene`:
      return `inGame`;
    case `worldMapScene`:
      return `worldMap`;
    case `storeScene`:
      return `store`;
    case `zenGardenScene`:
      return `zenGarden`;
    default:
      return e2 ? `unknown` : `unavailable`;
  }
}
function Se() {
  ge || !c() || (ge = true, o((e2) => {
    for (C.push({ sceneName: e2 || `unknown`, family: xe(e2), time: Date.now() }); C.length > he; ) C.shift();
    w = null;
  }));
}
function Ce() {
  if (Se(), !c()) return { source: `cocos`, status: `unavailable`, reason: `engine-not-ready` };
  let e2 = f(), t2 = u(), n2 = l(), r2 = e2?.assetManager?.bundles, i2 = null;
  try {
    i2 = s().length;
  } catch {
    i2 = null;
  }
  return { source: `cocos`, status: `available`, sceneName: t2 || null, sceneFamily: xe(t2), assetCount: ye(n2), jsonAssetCount: i2, bundleCount: ye(r2), targetFrameRate: ve(be(), 0), schedulerTimeScale: ve(Number(e2?.director?._scheduler?._timeScale), 3), sceneHistory: C.slice(-8) };
}
function we() {
  let e2 = Ce();
  return { source: `cocos`, status: e2.status, capturedAt: (/* @__PURE__ */ new Date()).toISOString(), capturedAtMs: Date.now(), sceneName: e2.sceneName || null, sceneFamily: e2.sceneFamily || `unavailable` };
}
function Te(e2, t2 = Date.now()) {
  Se();
  let n2 = Number(e2), r2 = Number(t2);
  return Number.isFinite(n2) ? C.filter((e3) => {
    let t3 = Number(e3?.time);
    return Number.isFinite(t3) && t3 >= n2 && (!Number.isFinite(r2) || t3 <= r2);
  }).map((e3) => ({ ...e3 })) : [];
}
function Ee(e2) {
  let t2 = [e2], n2 = 0, r2 = 0;
  for (; t2.length; ) {
    let e3 = t2.pop();
    if (!e3 || e3.isValid === false) continue;
    n2 += 1;
    let i2 = e3.components || e3._components || [];
    r2 += Array.isArray(i2) ? i2.length : 0;
    let a2 = e3.children || [];
    for (let e4 = 0; e4 < a2.length; e4 += 1) t2.push(a2[e4]);
  }
  return { nodeCount: n2, componentCount: r2 };
}
function De(e2, t2) {
  let n2 = t2 === `Zombie` ? p(`chunks:///_virtual/Zombie.ts`, `Zombie`) : te(t2);
  if (!n2 || !e2?.getComponentsInChildren) return { status: `unavailable`, count: null, reason: `class-unavailable` };
  try {
    let t3 = e2.getComponentsInChildren(n2);
    return { status: `available`, count: Array.isArray(t3) ? t3.length : 0, reason: null };
  } catch {
    return { status: `unavailable`, count: null, reason: `scan-failed` };
  }
}
function Oe(e2, t2, n2) {
  let r2 = t2?.counts?.[n2], i2 = t2?.fallbackUsed?.[n2] === true;
  return t2?.status === `available` && Number.isFinite(Number(r2)) ? { status: `available`, count: Number(r2), source: i2 ? `fallback-scan` : `class-scan`, reason: null, classAvailable: t2?.classAvailable?.[n2] === true } : { ...e2, source: `class-scan` };
}
function ke(e2 = {}) {
  let t2 = e2.force === true, n2 = Number.isFinite(Number(e2.maxAgeMs)) ? Number(e2.maxAgeMs) : me, r2 = ee(), i2 = u() || ``, a2 = _e();
  if (!t2 && w && E === i2 && a2 - T <= n2) return w;
  if (!c() || !r2) return w = { source: `cocos`, status: `unavailable`, reason: c() ? `scene-unavailable` : `engine-not-ready`, capturedAt: (/* @__PURE__ */ new Date()).toISOString() }, T = a2, E = i2, w;
  let o2 = _e(), s2 = Ee(r2), l2 = De(r2, `Plant`), te2 = De(r2, `Zombie`), d2 = De(r2, `Tomb`), f2 = typeof se == `function` ? se() : null, p2 = typeof i == `function` ? i(r2) : null, m2 = _e() - o2;
  return w = { source: `cocos`, status: `available`, capturedAt: (/* @__PURE__ */ new Date()).toISOString(), sceneName: i2 || null, sceneFamily: xe(i2), scanDurationMs: ve(m2, 2), nodeCount: s2.nodeCount, componentCount: s2.componentCount, entityCounts: { source: p2?.source || `class-scan`, status: p2?.status || `available`, reason: p2?.reason || null, plant: Oe(l2, p2, `plant`), zombie: Oe(te2, p2, `zombie`), tomb: Oe(d2, p2, `tomb`) }, hpOverlay: f2 ? { source: `gp-next`, status: `available`, ...f2 } : { source: `gp-next`, status: `unavailable`, reason: `debug-info-unavailable` } }, T = a2, E = i2, w;
}
var Ae = 1, je = 900, Me = 1e3, Ne = [33, 50, 100], Pe = `0.16.1`;
function D() {
  return performance?.now?.() ?? Date.now();
}
function O(e2, t2 = 1) {
  if (!Number.isFinite(e2)) return null;
  let n2 = 10 ** t2;
  return Math.round(e2 * n2) / n2;
}
function k(e2) {
  return e2.length ? e2.reduce((e3, t2) => e3 + t2, 0) / e2.length : null;
}
function Fe(e2, t2) {
  if (!e2.length) return null;
  let n2 = [...e2].sort((e3, t3) => e3 - t3);
  return n2[Math.min(n2.length - 1, Math.max(0, Math.ceil(t2 / 100 * n2.length) - 1))];
}
function A(e2) {
  let t2 = k(e2);
  return t2 && t2 > 0 ? 1e3 / t2 : null;
}
function Ie(e2, t2) {
  if (!e2.length) return null;
  let n2 = [...e2].sort((e3, t3) => t3 - e3), r2 = Math.max(1, Math.ceil(n2.length * t2)), i2 = k(n2.slice(0, r2));
  return i2 && i2 > 0 ? 1e3 / i2 : null;
}
function Le(e2, t2, n2) {
  let r2 = t2 - n2;
  return e2.filter((e3) => e3.ts >= r2);
}
function Re() {
  let e2 = window.cc, t2 = e2?.game?._frameRate ?? e2?.game?.frameRate ?? null, n2 = Number(t2);
  if (Number.isFinite(n2) && n2 > 0) return n2;
  let r2 = getSettings()?.frameRate;
  if (r2 === `0`) return null;
  let i2 = Number(r2);
  return Number.isFinite(i2) && i2 > 0 ? i2 : null;
}
function ze(e2, t2, n2) {
  let r2 = e2.map((e3) => e3.duration).filter(Number.isFinite), i2 = Le(e2, n2, 1e3).map((e3) => e3.duration), a2 = Le(e2, n2, 5e3).map((e3) => e3.duration), o2 = {};
  for (let e3 of Ne) o2[`gt${e3}ms`] = r2.filter((t3) => t3 > e3).length;
  let s2 = Re(), c2 = s2 && s2 < 240 ? 1e3 / s2 : null;
  return { source: `cocos`, status: r2.length ? `available` : `unavailable`, frameCount: r2.length, durationMs: O(n2 - t2, 0), targetFps: s2 ? O(s2, 0) : null, frameBudgetMs: O(c2, 2), avgFps: O(A(r2), 1), fps1s: O(A(i2), 1), fps5s: O(A(a2), 1), onePercentLowFps: O(Ie(r2, 0.01), 1), zeroOnePercentLowFps: O(Ie(r2, 1e-3), 1), minFrameMs: O(r2.length ? Math.min(...r2) : null, 2), maxFrameMs: O(r2.length ? Math.max(...r2) : null, 2), avgFrameMs: O(k(r2), 2), p95FrameMs: O(Fe(r2, 95), 2), p99FrameMs: O(Fe(r2, 99), 2), longFrames: o2, recentFrameMs: r2.slice(-120).map((e3) => O(e3, 2)) };
}
function Be() {
  return typeof PerformanceObserver < `u` && Array.isArray(PerformanceObserver.supportedEntryTypes) && PerformanceObserver.supportedEntryTypes.includes(`longtask`);
}
function Ve(e2, t2, n2, r2, i2) {
  let a2 = Math.max(1, r2 - n2), o2 = e2.map((e3) => e3.duration).filter(Number.isFinite), s2 = o2.reduce((e3, t3) => e3 + t3, 0), c2 = i2 ? Math.min(100, s2 / a2 * 100) : null;
  return { source: `browser`, status: i2 ? `available` : `unavailable`, longTaskSupported: i2, longTaskCount: o2.length, totalLongTaskMs: O(s2, 1), maxLongTaskMs: O(o2.length ? Math.max(...o2) : 0, 1), busyRatio: O(c2, 1), timerDriftAvgMs: O(k(t2), 1), timerDriftMaxMs: O(t2.length ? Math.max(...t2.map((e3) => Math.abs(e3))) : null, 1), recentLongTasks: e2.slice(-8).map((e3) => ({ startTime: O(e3.startTime, 1), duration: O(e3.duration, 1), name: e3.name || `longtask` })) };
}
function He() {
  return document.getElementById(`GameCanvas`) || document.querySelector(`canvas`);
}
function Ue() {
  let e2 = He();
  if (!e2) return { source: `browser`, status: `unavailable`, reason: `canvas-not-found` };
  let t2 = e2.getBoundingClientRect();
  return { source: `browser`, status: `available`, id: e2.id || ``, cssWidth: O(t2.width, 0), cssHeight: O(t2.height, 0), backingWidth: Number(e2.width) || null, backingHeight: Number(e2.height) || null, devicePixelRatio: O(window.devicePixelRatio || 1, 2), renderedPixels: (Number(e2.width) || 0) * (Number(e2.height) || 0) };
}
function We(e2) {
  if (!e2?.getContext) return { gl: null, type: null };
  for (let t2 of [`webgl2`, `webgl`, `experimental-webgl`]) try {
    let n2 = e2.getContext(t2);
    if (n2) return { gl: n2, type: t2 };
  } catch {
  }
  return { gl: null, type: null };
}
function Ge() {
  let e2 = He(), { gl: t2, type: n2 } = We(e2);
  if (!t2) return { source: `browser`, status: `unavailable`, reason: e2 ? `webgl-context-unavailable` : `canvas-not-found` };
  let r2 = t2.getExtension?.(`WEBGL_debug_renderer_info`), i2 = t2.getSupportedExtensions?.() || [], a2 = null;
  try {
    a2 = t2.getContextAttributes?.() || null;
  } catch {
    a2 = null;
  }
  return { source: `browser`, status: `available`, version: n2 === `webgl2` ? `WebGL 2` : `WebGL 1`, contextType: n2, vendor: j(t2, t2.VENDOR), renderer: j(t2, t2.RENDERER), unmaskedVendor: r2 ? j(t2, r2.UNMASKED_VENDOR_WEBGL) : null, unmaskedRenderer: r2 ? j(t2, r2.UNMASKED_RENDERER_WEBGL) : null, debugRendererInfoAvailable: !!r2, maxTextureSize: j(t2, t2.MAX_TEXTURE_SIZE), maxRenderbufferSize: j(t2, t2.MAX_RENDERBUFFER_SIZE), maxTextureImageUnits: j(t2, t2.MAX_TEXTURE_IMAGE_UNITS), maxCombinedTextureImageUnits: j(t2, t2.MAX_COMBINED_TEXTURE_IMAGE_UNITS), contextAttributes: a2, extensionCount: i2.length, extensions: i2 };
}
function j(e2, t2) {
  try {
    return e2.getParameter(t2);
  } catch {
    return null;
  }
}
function Ke() {
  let e2 = performance?.memory ? { source: `browser`, status: `available`, usedJSHeapSize: performance.memory.usedJSHeapSize, totalJSHeapSize: performance.memory.totalJSHeapSize, jsHeapSizeLimit: performance.memory.jsHeapSizeLimit } : { source: `browser`, status: `unavailable`, reason: `performance-memory-unsupported` };
  return { source: `browser`, status: `available`, userAgent: navigator.userAgent, platform: navigator.platform, language: navigator.language, hardwareConcurrency: navigator.hardwareConcurrency ?? null, deviceMemory: navigator.deviceMemory ?? null, visibilityState: document.visibilityState, hasFocus: document.hasFocus?.() ?? null, memory: e2 };
}
function qe(e2) {
  return String(e2 || ``).replace(/\/Users\/[^/\s"']+(?:\/[^\s"']*)?/g, `[path]`).replace(/[A-Z]:\\Users\\[^\\\s"']+(?:\\[^\s"']*)?/gi, `[path]`);
}
function Je() {
  let e2 = getSettings() || {};
  return { source: `gp-next-settings`, status: `available`, frameRate: e2.frameRate, hpOverlay: { showPlant: e2.hpOverlay?.showPlant === true, showZombie: e2.hpOverlay?.showZombie === true, showTomb: e2.hpOverlay?.showTomb === true }, scrollSensitivity: { enabled: e2.scrollSensitivity?.enabled !== false, wheel: e2.scrollSensitivity?.wheel ?? null, discreteMinIntervalMs: e2.scrollSensitivity?.discreteMinIntervalMs ?? null }, dynamicPlantRegistry: e2.dynamicPlantRegistry !== false, shopExtensions: e2.shopExtensions !== false, experimental: { worldMapJson: e2.experimental?.worldMapJson === true, plantLevelSystem: e2.experimental?.plantLevelSystem === true, jsModding: isJsModdingRuntimeEnabled() } };
}
function Ye() {
  let e2 = r(), t2 = e2.filter((e3) => e3.level === `warn`), n2 = e2.filter((e3) => e3.level === `error`), i2 = e2.filter((e3) => e3.level === `warn` || e3.level === `error`).slice(-10).map((e3) => ({ level: e3.level, module: e3.module, time: e3.time, msg: qe(e3.msg).slice(0, 500) }));
  return { source: `gp-next-logger`, status: `available`, warningCount: t2.length, errorCount: n2.length, recentIssues: i2 };
}
function Xe(e2) {
  return { browser: { status: `available`, mainThread: e2.mainThread?.status || `unavailable`, canvas: e2.canvas?.status || `unavailable`, webgl: e2.webgl?.status || `unavailable`, environment: e2.environment?.status || `unavailable` }, cocos: { fps: e2.fps?.status || `unavailable`, runtime: e2.gameRuntime?.status || `unavailable`, sceneScan: e2.sceneScan?.status || `unavailable`, sampleContext: e2.sampleContext?.status || `unavailable` }, tauri: { native: e2.native?.status || `unavailable` } };
}
function Ze(e2) {
  return { source: `gp-next`, status: `available`, supportPackageVersion: 1, availability: Xe(e2), runtimeExtensions: Je(), logSummary: Ye() };
}
function Qe(e2, t2) {
  let n2 = Date.now(), r2 = Number(e2?.capturedAtMs), i2 = Number.isFinite(r2) ? Te(r2, n2) : [], a2 = e2?.sceneName || null, o2 = t2?.sceneName || null, s2 = !!(a2 && o2 && a2 !== o2), c2 = i2.some((e3) => e3.sceneName && e3.sceneName !== a2);
  return { source: `cocos`, status: e2?.status === `available` || t2?.status === `available` ? `available` : `unavailable`, start: e2 || null, end: { source: `cocos`, status: t2?.status || `unavailable`, capturedAt: (/* @__PURE__ */ new Date()).toISOString(), capturedAtMs: n2, sceneName: o2, sceneFamily: t2?.sceneFamily || `unavailable` }, sceneChangedDuringSample: s2 || c2, transitionCount: i2.length, transitions: i2.map((e3) => ({ sceneName: e3.sceneName || `unknown`, family: e3.family || `unknown`, time: e3.time, relativeMs: Number.isFinite(r2) ? O(e3.time - r2, 0) : null })) };
}
var $e = class {
  constructor(e2 = {}) {
    this.maxFrames = e2.maxFrames || je, this.onUpdate = typeof e2.onUpdate == `function` ? e2.onUpdate : null, this.frames = new pe(this.maxFrames), this.longTasks = [], this.timerDrifts = [], this.running = false, this.startTime = 0, this.endTime = 0, this._uiTimerId = null, this._frameDirector = null, this._frameEvent = null, this._onGameFrame = () => this._onFrame(D()), this._lastFrameTs = null, this._observer = null, this._timerId = null, this._expectedTimerTs = 0, this._longTaskSupported = Be(), this._sampleStartRuntime = null;
  }
  start({ reset: e2 = true } = {}) {
    this.running || (e2 && this.reset(), this.running = true, this.startTime = D(), this.endTime = this.startTime, this._lastFrameTs = null, this._sampleStartRuntime = we(), this._startLongTaskObserver(), this._startTimerProbe(), this._refreshFrameSource(), this._uiTimerId = setTimeout(() => this._onBrowserFrame(), 250));
  }
  stop() {
    if (this.running) {
      if (this.running = false, this.endTime = D(), this._detachFrameSource(), this._uiTimerId !== null && (clearTimeout(this._uiTimerId), this._uiTimerId = null), this._observer) {
        try {
          this._observer.disconnect();
        } catch {
        }
        this._observer = null;
      }
      this._timerId !== null && (clearInterval(this._timerId), this._timerId = null);
    }
  }
  reset() {
    this.frames = new pe(this.maxFrames), this.longTasks = [], this.timerDrifts = [], this.startTime = D(), this.endTime = this.startTime, this._lastFrameTs = null, this._sampleStartRuntime = null;
  }
  getSnapshot() {
    let e2 = this.running ? D() : this.endTime || D();
    return M({ startTime: this.startTime || e2, endTime: e2, frames: this.frames.snapshot(), longTasks: this.longTasks, timerDrifts: this.timerDrifts, longTaskSupported: this._longTaskSupported, sampleStartRuntime: this._sampleStartRuntime });
  }
  getReportSnapshot() {
    let e2 = this.running ? D() : this.endTime || D();
    return M({ startTime: this.startTime || e2, endTime: e2, frames: this.frames.snapshot(), longTasks: this.longTasks, timerDrifts: this.timerDrifts, longTaskSupported: this._longTaskSupported, forceSceneScan: true, sampleStartRuntime: this._sampleStartRuntime });
  }
  async getReportSnapshotAsync() {
    let e2 = this.running ? D() : this.endTime || D(), t2 = this.startTime || e2, n2 = await fe({ force: true });
    return M({ startTime: t2, endTime: e2, frames: this.frames.snapshot(), longTasks: this.longTasks, timerDrifts: this.timerDrifts, longTaskSupported: this._longTaskSupported, forceSceneScan: true, sampleStartRuntime: this._sampleStartRuntime, nativeSnapshot: n2 });
  }
  _onFrame(e2) {
    if (this.running) {
      if (this._lastFrameTs !== null) {
        let t2 = e2 - this._lastFrameTs;
        Number.isFinite(t2) && t2 > 0 && this.frames.push({ ts: e2, duration: t2 });
      }
      this._lastFrameTs = e2, this.endTime = e2;
    }
  }
  _detachFrameSource() {
    this._frameDirector && this._frameDirector.off(this._frameEvent, this._onGameFrame), this._frameDirector = null, this._frameEvent = null, this._lastFrameTs = null;
  }
  _refreshFrameSource() {
    let e2 = window.cc, t2 = e2?.director, n2 = e2?.Director?.EVENT_AFTER_DRAW;
    t2 === this._frameDirector && n2 === this._frameEvent || (this._detachFrameSource(), !(!n2 || typeof t2?.on != `function` || typeof t2?.off != `function`) && (this._frameDirector = t2, this._frameEvent = n2, t2.on(n2, this._onGameFrame)));
  }
  _onBrowserFrame() {
    this.running && (this._refreshFrameSource(), this.onUpdate && this.onUpdate(), this._uiTimerId = setTimeout(() => this._onBrowserFrame(), 250));
  }
  _startLongTaskObserver() {
    if (this._longTaskSupported) try {
      this._observer = new PerformanceObserver((e2) => {
        for (let t2 of e2.getEntries()) this.longTasks.push({ startTime: t2.startTime, duration: t2.duration, name: t2.name });
        for (; this.longTasks.length > 120; ) this.longTasks.shift();
      }), this._observer.observe({ entryTypes: [`longtask`] });
    } catch {
      this._longTaskSupported = false, this._observer = null;
    }
  }
  _startTimerProbe() {
    this._expectedTimerTs = D() + Me, this._timerId = setInterval(() => {
      let e2 = D();
      for (this.timerDrifts.push(e2 - this._expectedTimerTs); this.timerDrifts.length > 120; ) this.timerDrifts.shift();
      this._expectedTimerTs += Me;
    }, Me);
  }
};
function M(e2) {
  Se();
  let t2 = e2.startTime || D(), r2 = e2.endTime || D(), i2 = Array.isArray(e2.frames) ? e2.frames : [], a2 = Array.isArray(e2.longTasks) ? e2.longTasks : [], o2 = Array.isArray(e2.timerDrifts) ? e2.timerDrifts : [], s2 = Ce(), c2 = ze(i2, t2, r2), l2 = Ve(a2, o2, t2, r2, !!e2.longTaskSupported), u2 = Ue(), ee2 = Ge(), te2 = Ke(), d2 = Qe(e2.sampleStartRuntime, s2), f2 = ke({ force: e2.forceSceneScan === true, maxAgeMs: e2.forceSceneScan === true ? 0 : 5e3 }), p2 = e2.nativeSnapshot || de(), m2 = { performanceReportVersion: Ae, collectedAt: (/* @__PURE__ */ new Date()).toISOString(), gpNextVersion: n, gameVersion: Pe, sample: { source: `browser`, status: `available`, startTime: O(t2, 1), endTime: O(r2, 1), durationMs: O(Math.max(0, r2 - t2), 0) }, fps: c2, mainThread: l2, canvas: u2, webgl: ee2, environment: te2, sampleContext: d2, gameRuntime: s2, sceneScan: f2, native: p2 };
  return m2.support = Ze(m2), m2;
}
function et(e2 = 3e4) {
  return new Promise((t2) => {
    let n2 = new $e({ maxFrames: Math.max(je, Math.ceil(e2 / 8)) });
    n2.start(), setTimeout(async () => {
      n2.stop(), t2(await n2.getReportSnapshotAsync());
    }, Math.max(1e3, Number(e2) || 3e4));
  });
}
var tt = 3e4, nt = 850, N = 320, P = 96, rt = 120, F = null, I = {}, L = null, R = false, it = 0, z = new $e({ maxFrames: 900, onUpdate: () => {
  let e2 = performance.now();
  e2 - it < nt || (it = e2, $());
} });
function B(e2, t2 = ``, n2 = ``) {
  let r2 = document.createElement(e2);
  return t2 && (r2.className = t2), n2 && (r2.textContent = n2), r2;
}
function V(e2, t2 = ``, n2 = 1) {
  if (e2 == null || e2 === `` || !Number.isFinite(Number(e2))) return d(`performance.unavailable`);
  let r2 = Number(e2);
  return `${Number.isInteger(r2) ? String(r2) : r2.toFixed(n2)}${t2}`;
}
function H(e2) {
  return V(e2, `ms`, 1);
}
function U(e2) {
  return V(e2, `%`, 1);
}
function at(e2) {
  if (e2 == null || e2 === `` || !Number.isFinite(Number(e2))) return d(`performance.unavailable`);
  let t2 = Number(e2);
  return t2 >= 1e6 ? `${(t2 / 1e6).toFixed(2)}MP` : t2 >= 1e3 ? `${Math.round(t2 / 1e3)}K` : String(t2);
}
function W(e2) {
  if (e2 == null || e2 === ``) return d(`performance.unavailable`);
  let t2 = Number(e2);
  return Number.isFinite(t2) ? t2 >= 1024 * 1024 * 1024 ? `${(t2 / (1024 * 1024 * 1024)).toFixed(2)}GB` : t2 >= 1024 * 1024 ? `${(t2 / (1024 * 1024)).toFixed(1)}MB` : t2 >= 1024 ? `${(t2 / 1024).toFixed(1)}KB` : `${Math.round(t2)}B` : d(`performance.unavailable`);
}
function ot(e2, t2) {
  return !Number.isFinite(Number(e2)) || !Number.isFinite(Number(t2)) ? d(`performance.unavailable`) : `${W(e2)} / ${W(t2)}`;
}
function st() {
  return `gp-next-performance-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, `-`)}.json`;
}
function ct() {
  return L || z.getSnapshot();
}
function lt() {
  return d(L ? `performance.modeSnapshot` : `performance.modeLive`);
}
function ut(e2) {
  let t2 = e2?.fps?.avgFps;
  if (!Number.isFinite(t2)) return `neutral`;
  let n2 = e2?.fps?.targetFps && e2.fps.targetFps < 240 ? e2.fps.targetFps : 60;
  return t2 >= n2 * 0.9 ? `good` : t2 >= n2 * 0.72 ? `warn` : `bad`;
}
function dt(e2) {
  return Number.isFinite(e2) ? e2 <= 33 ? `good` : e2 <= 50 ? `warn` : `bad` : `neutral`;
}
function ft(e2, t2) {
  return !t2 || !Number.isFinite(e2) ? `neutral` : e2 <= 8 ? `good` : e2 <= 20 ? `warn` : `bad`;
}
function pt(e2) {
  return Number.isFinite(e2) ? e2 <= 8 ? `good` : e2 <= 24 ? `warn` : `bad` : `neutral`;
}
function mt(e2) {
  return `gp-perf-${e2 || `neutral`}`;
}
function G(e2, t2, n2, r2 = `neutral`) {
  let i2 = B(`div`, `gp-perf-metric ${mt(r2)}`), a2 = B(`div`, `gp-perf-metric-label`, e2), o2 = B(`div`, `gp-perf-metric-value`, t2), s2 = B(`div`, `gp-perf-metric-meta`, n2);
  return i2.appendChild(a2), i2.appendChild(o2), i2.appendChild(s2), i2;
}
function K(e2, t2) {
  let n2 = B(`div`, `gp-perf-panel`), r2 = B(`div`, `gp-perf-panel-title`, e2);
  return n2.appendChild(r2), n2.appendChild(t2), n2;
}
function q(e2) {
  let t2 = B(`div`, `gp-perf-kv`);
  for (let [n2, r2, i2] of e2) {
    let e3 = B(`div`, `gp-perf-kv-row`);
    e3.appendChild(B(`span`, `gp-perf-kv-label`, n2));
    let a2 = B(`span`, `gp-perf-kv-value`);
    (!i2 || String(r2) !== i2.text) && (a2.textContent = r2), i2 && a2.appendChild(h(i2.text, i2.type)), e3.appendChild(a2), t2.appendChild(e3);
  }
  return t2;
}
function ht(e2) {
  let t2 = e2?.fps?.recentFrameMs || [], n2 = document.createElementNS(`http://www.w3.org/2000/svg`, `svg`);
  n2.setAttribute(`viewBox`, `0 0 ${N} ${P}`), n2.setAttribute(`class`, `gp-perf-chart`), n2.setAttribute(`role`, `img`), n2.setAttribute(`aria-label`, d(`performance.frameChart`));
  let r2 = document.createElementNS(`http://www.w3.org/2000/svg`, `rect`);
  r2.setAttribute(`x`, `0`), r2.setAttribute(`y`, `0`), r2.setAttribute(`width`, String(N)), r2.setAttribute(`height`, String(P)), r2.setAttribute(`rx`, `8`), r2.setAttribute(`class`, `gp-perf-chart-bg`), n2.appendChild(r2);
  for (let e3 of [16.7, 33.3, 50]) {
    let t3 = gt(e3), r3 = document.createElementNS(`http://www.w3.org/2000/svg`, `line`);
    r3.setAttribute(`x1`, `0`), r3.setAttribute(`x2`, String(N)), r3.setAttribute(`y1`, String(t3)), r3.setAttribute(`y2`, String(t3)), r3.setAttribute(`class`, `gp-perf-chart-grid`), n2.appendChild(r3);
  }
  if (e2?.fps?.frameBudgetMs) {
    let t3 = gt(e2.fps.frameBudgetMs), r3 = document.createElementNS(`http://www.w3.org/2000/svg`, `line`);
    r3.setAttribute(`x1`, `0`), r3.setAttribute(`x2`, String(N)), r3.setAttribute(`y1`, String(t3)), r3.setAttribute(`y2`, String(t3)), r3.setAttribute(`class`, `gp-perf-chart-budget`), n2.appendChild(r3);
  }
  if (t2.length > 1) {
    let e3 = t2.map((e4, n3) => `${(n3 / (t2.length - 1) * N).toFixed(1)},${gt(e4).toFixed(1)}`).join(` `), r3 = document.createElementNS(`http://www.w3.org/2000/svg`, `polyline`);
    r3.setAttribute(`points`, e3), r3.setAttribute(`class`, `gp-perf-chart-line`), n2.appendChild(r3);
  } else {
    let e3 = document.createElementNS(`http://www.w3.org/2000/svg`, `text`);
    e3.setAttribute(`x`, String(N / 2)), e3.setAttribute(`y`, String(P / 2)), e3.setAttribute(`text-anchor`, `middle`), e3.setAttribute(`class`, `gp-perf-chart-empty`), e3.textContent = d(`performance.waitingForFrames`), n2.appendChild(e3);
  }
  return n2;
}
function gt(e2) {
  return P - Math.max(0, Math.min(rt, Number(e2) || 0)) / rt * (P - 12) - 6;
}
function _t(e2) {
  let t2 = B(`div`, `gp-perf-bars`), n2 = Math.max(1, e2?.fps?.frameCount || 0), r2 = [[`>33ms`, e2?.fps?.longFrames?.gt33ms || 0], [`>50ms`, e2?.fps?.longFrames?.gt50ms || 0], [`>100ms`, e2?.fps?.longFrames?.gt100ms || 0]];
  for (let [e3, i2] of r2) {
    let r3 = B(`div`, `gp-perf-bar-row`), a2 = B(`div`, `gp-perf-bar-top`);
    a2.appendChild(B(`span`, ``, e3)), a2.appendChild(B(`span`, `gp-text-mono`, String(i2)));
    let o2 = B(`div`, `gp-perf-bar-track`), s2 = B(`div`, `gp-perf-bar-fill`);
    s2.style.width = `${Math.min(100, i2 / n2 * 100 * 4)}%`, o2.appendChild(s2), r3.appendChild(a2), r3.appendChild(o2), t2.appendChild(r3);
  }
  return t2;
}
function vt(e2) {
  let t2 = e2?.mainThread || {};
  return t2.longTaskSupported ? U(t2.busyRatio) : H(t2.timerDriftAvgMs);
}
function yt(e2) {
  let t2 = e2?.mainThread || {};
  return t2.longTaskSupported ? d(`performance.longTaskCountValue`, t2.longTaskCount ?? 0) : d(`performance.timerDriftEstimate`);
}
function bt(e2) {
  let t2 = e2?.mainThread || {};
  return t2.longTaskSupported ? ft(t2.busyRatio, true) : pt(t2.timerDriftAvgMs);
}
function xt(e2) {
  let t2 = e2?.mainThread || {};
  if (t2.longTaskSupported) return U(t2.busyRatio);
  let n2 = H(t2.timerDriftAvgMs);
  return n2 === d(`performance.unavailable`) ? n2 : d(`performance.driftValue`, n2);
}
function St(e2) {
  return e2?.status === `available` ? V(e2.count, ``, 0) : d(`performance.unavailable`);
}
function J(e2) {
  if (!e2) return d(`performance.unavailable`);
  let t2 = `performance.reason.${e2}`, n2 = d(t2);
  return n2 === t2 ? e2 : n2;
}
function Y(e2) {
  return e2 === `available` ? { text: d(`performance.available`), type: `success` } : e2 === `warming` ? { text: d(`performance.nativeWarming`), type: `warning` } : { text: d(`performance.unavailable`), type: `warning` };
}
function X(e2) {
  return !e2 || e2.status !== `available` ? { text: J(e2?.reason), type: `warning` } : e2.source === `fallback-scan` ? { text: d(`performance.entitySource.fallback`), type: `warning` } : { text: d(`performance.entitySource.class`), type: `info` };
}
function Ct(e2) {
  return e2 === `class+fallback-scan` ? d(`performance.entitySource.classFallback`) : e2 === `fallback-scan` ? d(`performance.entitySource.fallback`) : e2 === `class-scan` ? d(`performance.entitySource.class`) : e2 || d(`performance.unavailable`);
}
function wt(e2) {
  let t2 = Number(e2);
  return Number.isFinite(t2) ? t2 > 33 ? { text: d(`performance.scanCostSlow`), type: `error` } : t2 > 16 ? { text: d(`performance.scanCostHigh`), type: `warning` } : { text: d(`performance.scanCostOk`), type: `success` } : null;
}
function Tt(e2) {
  let t2 = Number(e2);
  if (!Number.isFinite(t2)) return d(`performance.unavailable`);
  let n2 = Math.max(0, (Date.now() - t2) / 1e3);
  return n2 < 60 ? d(`performance.secondsAgo`, V(n2, `s`, 0)) : d(`performance.minutesAgo`, V(n2 / 60, `m`, 1));
}
function Z(e2) {
  return e2 ? { text: d(`performance.sceneFamily.${e2}`), type: `info` } : null;
}
function Et(e2) {
  let t2 = e2?.sampleContext || {}, n2 = t2.start || {}, r2 = t2.end || {}, i2 = t2.sceneChangedDuringSample === true, a2 = [[d(`performance.sampleStartScene`), n2.sceneName || d(`performance.unavailable`), Z(n2.sceneFamily)], [d(`performance.sampleEndScene`), r2.sceneName || d(`performance.unavailable`), Z(r2.sceneFamily)], [d(`performance.sceneChanged`), d(i2 ? `performance.sceneChangedYes` : `performance.sceneChangedNo`), { text: d(i2 ? `performance.changed` : `performance.stable`), type: i2 ? `warning` : `success` }], [d(`performance.sceneTransitionCount`), V(t2.transitionCount, ``, 0)]];
  Q(I.sampleContext, K(d(`performance.sampleContext`), q(a2)));
}
function Dt(e2) {
  let t2 = B(`div`, `gp-perf-metric-grid`);
  t2.appendChild(G(d(`performance.avgFps`), V(e2?.fps?.avgFps), d(`performance.targetValue`, V(e2?.fps?.targetFps, ` FPS`, 0)), ut(e2))), t2.appendChild(G(d(`performance.frameP95`), H(e2?.fps?.p95FrameMs), d(`performance.frameP99Value`, H(e2?.fps?.p99FrameMs)), dt(e2?.fps?.p95FrameMs))), t2.appendChild(G(d(`performance.onePercentLow`), V(e2?.fps?.onePercentLowFps), d(`performance.zeroOneLowValue`, V(e2?.fps?.zeroOnePercentLowFps)), ut({ fps: { avgFps: e2?.fps?.onePercentLowFps, targetFps: e2?.fps?.targetFps } }))), t2.appendChild(G(d(`performance.mainThreadBusy`), vt(e2), yt(e2), bt(e2))), Q(I.metrics, t2);
}
function Ot(e2) {
  let t2 = B(`div`, `gp-perf-chart-wrap`);
  t2.appendChild(ht(e2));
  let n2 = B(`div`, `gp-perf-chart-legend`);
  n2.appendChild(B(`span`, ``, d(`performance.frameTimeMs`))), n2.appendChild(B(`span`, ``, d(`performance.frameBudgetValue`, H(e2?.fps?.frameBudgetMs)))), t2.appendChild(n2), Q(I.chart, K(d(`performance.frameChart`), t2));
}
function kt(e2) {
  let t2 = B(`div`, ``);
  t2.appendChild(_t(e2)), Q(I.longFrames, K(d(`performance.longFrames`), t2));
}
function At(e2) {
  let t2 = e2?.mainThread || {}, n2 = [[d(`performance.longTaskSupport`), t2.longTaskSupported ? d(`performance.available`) : d(`performance.unavailable`)], [d(`performance.mainThreadMetricSource`), t2.longTaskSupported ? d(`performance.longTaskBusyRatio`) : d(`performance.timerDriftEstimate`)], [d(`performance.longTaskTotal`), H(t2.totalLongTaskMs)], [d(`performance.longTaskMax`), H(t2.maxLongTaskMs)], [d(`performance.timerDriftAvg`), H(t2.timerDriftAvgMs)], [d(`performance.timerDriftMax`), H(t2.timerDriftMaxMs)]];
  Q(I.mainThread, K(d(`performance.mainThread`), q(n2)));
}
function jt(e2) {
  let t2 = e2?.gameRuntime || {}, n2 = Array.isArray(t2.sceneHistory) ? t2.sceneHistory : [], r2 = n2.length ? n2[n2.length - 1] : null, i2 = [[d(`performance.sceneName`), t2.sceneName || d(`performance.unavailable`), Z(t2.sceneFamily)], [d(`performance.assetCount`), V(t2.assetCount, ``, 0)], [d(`performance.jsonAssetCount`), V(t2.jsonAssetCount, ``, 0)], [d(`performance.bundleCount`), V(t2.bundleCount, ``, 0)], [d(`performance.runtimeTargetFps`), V(t2.targetFrameRate, ` FPS`, 0)], [d(`performance.schedulerTimeScale`), V(t2.schedulerTimeScale, ``, 3)], [d(`performance.lastSceneLaunch`), r2 ? `${r2.sceneName} \xB7 ${Tt(r2.time)}` : d(`performance.unavailable`)]];
  Q(I.gameRuntime, K(d(`performance.gameRuntime`), q(i2)));
}
function Mt(e2) {
  let t2 = e2?.sceneScan || {}, n2 = t2.entityCounts || {}, r2 = t2.hpOverlay || {}, i2 = t2.status === `available` ? [[d(`performance.scanScene`), t2.sceneName || d(`performance.unavailable`), Z(t2.sceneFamily)], [d(`performance.nodeCount`), V(t2.nodeCount, ``, 0)], [d(`performance.componentCount`), V(t2.componentCount, ``, 0)], [d(`performance.scanDuration`), H(t2.scanDurationMs), wt(t2.scanDurationMs)], [d(`performance.entityCountSource`), Ct(n2.source)], [d(`performance.plantCount`), St(n2.plant), X(n2.plant)], [d(`performance.zombieCount`), St(n2.zombie), X(n2.zombie)], [d(`performance.tombCount`), St(n2.tomb), X(n2.tomb)], [d(`performance.hpOverlayLabels`), r2.status === `available` ? V(r2.labelCount, ``, 0) : d(`performance.unavailable`)]] : [[d(`performance.scanStatus`), d(`performance.unavailable`)], [d(`performance.scanReason`), J(t2.reason)]];
  Q(I.sceneScan, K(d(`performance.sceneScan`), q(i2)));
}
function Nt(e2) {
  let t2 = e2?.webgl || {}, n2 = [[d(`performance.webglVersion`), t2.version || d(`performance.unavailable`)], [d(`performance.webglRenderer`), t2.unmaskedRenderer || t2.renderer || d(`performance.unavailable`)], [d(`performance.webglVendor`), t2.unmaskedVendor || t2.vendor || d(`performance.unavailable`)], [d(`performance.webglDebugInfo`), t2.debugRendererInfoAvailable ? d(`performance.available`) : d(`performance.unavailable`)], [d(`performance.maxTextureSize`), V(t2.maxTextureSize, `px`, 0)], [d(`performance.maxRenderbufferSize`), V(t2.maxRenderbufferSize, `px`, 0)], [d(`performance.textureUnits`), V(t2.maxCombinedTextureImageUnits, ``, 0)], [d(`performance.webglExtensions`), V(t2.extensionCount, ``, 0)]];
  Q(I.webgl, K(d(`performance.webgl`), q(n2)));
}
function Pt(e2) {
  let t2 = e2?.canvas || {}, n2 = [[d(`performance.canvasCssSize`), t2.status === `available` ? `${t2.cssWidth} x ${t2.cssHeight}` : d(`performance.unavailable`)], [d(`performance.canvasBackingSize`), t2.status === `available` ? `${t2.backingWidth} x ${t2.backingHeight}` : d(`performance.unavailable`)], [d(`performance.devicePixelRatio`), V(t2.devicePixelRatio, ``, 2)], [d(`performance.renderedPixels`), at(t2.renderedPixels)]];
  Q(I.canvas, K(d(`performance.canvas`), q(n2)));
}
function Ft(e2) {
  let t2 = e2?.environment || {}, n2 = t2.memory || {}, r2 = [[d(`performance.platform`), t2.platform || d(`performance.unavailable`)], [d(`performance.hardwareConcurrency`), V(t2.hardwareConcurrency, ``, 0)], [d(`performance.visibility`), t2.visibilityState || d(`performance.unavailable`)], [d(`performance.focus`), t2.hasFocus === null ? d(`performance.unavailable`) : t2.hasFocus ? d(`common.on`) : d(`common.off`)], [d(`performance.jsHeapUsed`), n2.status === `available` ? W(n2.usedJSHeapSize) : d(`performance.unavailable`)], [d(`performance.jsHeapTotal`), n2.status === `available` ? W(n2.totalJSHeapSize) : d(`performance.unavailable`)]];
  Q(I.environment, K(d(`performance.environment`), q(r2)));
}
function It(e2) {
  let t2 = e2?.native || {}, n2 = t2.process || {}, r2 = t2.system || {}, i2 = t2.os || {}, a2 = t2.app || {}, o2 = n2.cpuStatus || t2.status, s2 = r2.cpuStatus || t2.status, c2 = t2.status === `available` ? [[d(`performance.nativeStatus`), d(`performance.available`), Y(t2.status)], [d(`performance.nativeSource`), t2.source || d(`performance.unavailable`)], [d(`performance.osName`), i2.longVersion || i2.name || d(`performance.unavailable`)], [d(`performance.osArch`), i2.arch || d(`performance.unavailable`)], [d(`performance.appVersion`), a2.version || d(`performance.unavailable`)], [d(`performance.processPid`), V(n2.pid, ``, 0)], [d(`performance.processCpu`), o2 === `available` ? U(n2.cpuUsage) : d(`performance.nativeWarming`), Y(o2)], [d(`performance.systemCpu`), s2 === `available` ? U(r2.cpuUsage) : d(`performance.nativeWarming`), Y(s2)], [d(`performance.processMemory`), W(n2.memoryBytes)], [d(`performance.systemMemory`), ot(r2.usedMemoryBytes, r2.totalMemoryBytes)]] : [[d(`performance.nativeStatus`), d(`performance.unavailable`), Y(t2.status)], [d(`performance.nativeSource`), t2.source || `tauri`], [d(`performance.scanReason`), J(t2.reason)]];
  Q(I.native, K(d(`performance.nativeMetrics`), q(c2)));
}
function Lt(e2) {
  let t2 = L || e2, n2 = (t2?.support || {}).logSummary || {}, r2 = t2?.native?.status || `unavailable`, i2 = B(`div`, `gp-perf-report`), a2 = B(`div`, `gp-perf-report-summary`);
  t2?.sampleContext?.sceneChangedDuringSample && a2.appendChild(h(d(`performance.sceneChangedBadge`), `warning`)), a2.appendChild(B(`span`, `gp-text-muted`, d(`performance.reportDuration`, V(t2?.sample?.durationMs, `ms`, 0)))), a2.appendChild(B(`span`, `gp-text-muted`, d(`performance.reportFrames`, t2?.fps?.frameCount ?? 0))), i2.appendChild(a2);
  let o2 = [[d(`performance.reportNativeStatus`), r2 === `available` ? d(`performance.available`) : J(t2?.native?.reason), Y(r2)]];
  (Number(n2.warningCount) > 0 || Number(n2.errorCount) > 0) && o2.push([d(`performance.reportLogSummary`), d(`performance.reportWarningsErrors`, n2.warningCount ?? 0, n2.errorCount ?? 0)]), i2.appendChild(q(o2)), Q(I.report, K(d(`performance.report`), i2));
}
function Rt(e2) {
  I.modeBadge.textContent = lt(), I.modeBadge.className = `gp-badge ${L ? `gp-badge-info` : `gp-badge-success`}`, I.heroFps.textContent = V(e2?.fps?.avgFps), I.heroMeta.textContent = d(`performance.heroMeta`, H(e2?.fps?.p95FrameMs), e2?.fps?.longFrames?.gt50ms ?? 0, xt(e2));
}
function zt() {
  I.sampleBtn && (I.sampleBtn.disabled = R, I.quickBtn.disabled = R, I.resetBtn.disabled = R || !L, I.copyBtn.disabled = R, I.saveBtn.disabled = R, I.sampleStatus.textContent = R ? d(`performance.sampleRunning`) : ``);
}
function Q(e2, t2) {
  e2 && (e2.innerHTML = ``, e2.appendChild(t2));
}
function $() {
  if (!F) return;
  let e2 = ct();
  Rt(e2), Dt(e2), Ot(e2), kt(e2), Et(e2), jt(e2), Mt(e2), At(e2), Nt(e2), Pt(e2), Ft(e2), It(e2), Lt(e2), zt();
}
function Bt(e2) {
  L = e2, $();
}
function Vt() {
  L = null, $();
}
async function Ht() {
  let e2 = L || await z.getReportSnapshotAsync(), t2 = JSON.stringify(e2, null, 2);
  try {
    await Wt(t2), g(d(`performance.reportCopied`));
  } catch (e3) {
    g(d(`performance.reportCopyFailed`) + `: ` + e3, `error`);
  }
}
async function Ut() {
  if (!b()) {
    g(d(`performance.reportSaveUnavailable`));
    return;
  }
  let e2 = L || await z.getReportSnapshotAsync(), n2 = st();
  try {
    let r2 = await ce({ defaultPath: n2, filters: [{ name: `JSON`, extensions: [`json`] }] });
    if (!r2) return;
    await t(r2, JSON.stringify(e2, null, 2)), g(d(`performance.reportSaved`));
  } catch (e3) {
    g(d(`performance.reportSaveFailed`) + `: ` + e3, `error`);
  }
}
function Wt(e2) {
  return navigator.clipboard?.writeText ? navigator.clipboard.writeText(e2) : new Promise((t2, n2) => {
    let r2 = document.createElement(`textarea`);
    r2.value = e2, r2.style.position = `fixed`, r2.style.left = `-9999px`, document.body.appendChild(r2), r2.select();
    try {
      document.execCommand(`copy`) ? t2() : n2(Error(`copy unavailable`));
    } catch (e3) {
      n2(e3);
    } finally {
      r2.remove();
    }
  });
}
function Gt(e2) {
  return new Promise((t2) => setTimeout(t2, e2));
}
async function Kt() {
  if (R) return;
  R = true, zt();
  let e2 = ie();
  I.sampleStatus.textContent = d(`performance.samplePreparing`), await Gt(650), e2 && ae(), L = await et(tt), R = false, e2 ? a() : $(), g(d(`performance.sampleComplete`));
}
function qt(e2) {
  F = e2, I = {};
  let t2 = B(`div`, `gp-perf-shell`), n2 = B(`div`, `gp-perf-hero`), r2 = B(`div`, `gp-perf-hero-main`), i2 = B(`div`, `gp-perf-title-row`);
  i2.appendChild(B(`span`, `gp-perf-title`, d(`performance.title`))), I.modeBadge = h(lt(), L ? `info` : `success`), i2.appendChild(I.modeBadge), r2.appendChild(i2);
  let a2 = B(`div`, `gp-perf-hero-fps-row`);
  I.heroFps = B(`span`, `gp-perf-hero-fps`, `--`), a2.appendChild(I.heroFps), a2.appendChild(B(`span`, `gp-perf-hero-unit`, `FPS`)), r2.appendChild(a2), I.heroMeta = B(`div`, `gp-perf-hero-meta`, ``), r2.appendChild(I.heroMeta);
  let o2 = B(`div`, `gp-perf-actions`);
  I.quickBtn = m(d(`performance.quickSnapshot`), async () => Bt(await z.getReportSnapshotAsync()), { small: true }), I.sampleBtn = m(d(`performance.sample30s`), () => {
    Kt();
  }, { small: true, variant: `success` }), I.resetBtn = m(d(`performance.resetSample`), Vt, { small: true }), I.copyBtn = m(d(`performance.copyReport`), () => {
    Ht();
  }, { small: true }), I.saveBtn = m(d(`performance.saveReport`), () => {
    Ut();
  }, { small: true }), I.resetBtn.classList.add(`gp-perf-reset`), i2.appendChild(I.resetBtn), o2.appendChild(ne(I.quickBtn, I.sampleBtn, I.copyBtn, I.saveBtn)), I.sampleStatus = B(`div`, `gp-perf-sample-status`), o2.appendChild(I.sampleStatus), n2.appendChild(r2), n2.appendChild(o2), t2.appendChild(n2), I.metrics = B(`div`), I.chart = B(`div`), I.longFrames = B(`div`), I.sampleContext = B(`div`), I.gameRuntime = B(`div`), I.sceneScan = B(`div`), I.mainThread = B(`div`), I.webgl = B(`div`), I.canvas = B(`div`), I.environment = B(`div`), I.native = B(`div`), I.report = B(`div`), t2.appendChild(I.metrics);
  let s2 = B(`div`, `gp-perf-two-col`);
  s2.appendChild(I.chart), s2.appendChild(I.longFrames), t2.appendChild(s2);
  let c2 = B(`div`, `gp-perf-detail-grid`);
  c2.appendChild(I.sampleContext), c2.appendChild(I.gameRuntime), c2.appendChild(I.sceneScan), c2.appendChild(I.mainThread), c2.appendChild(I.webgl), c2.appendChild(I.canvas), c2.appendChild(I.environment), c2.appendChild(I.native), c2.appendChild(I.report), t2.appendChild(c2), e2.appendChild(t2), $();
}
function Jt() {
  z.start({ reset: true }), $();
}
function Yt() {
  z.stop(), F = null, I = {};
}
function createPerformanceTab() {
  return { render: qt, onActivate: Jt, onDeactivate: Yt };
}
export {
  createPerformanceTab
};
