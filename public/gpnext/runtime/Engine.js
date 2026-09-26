import { n as e } from "../vendor/ModuleHelpers.js";
import { t } from "../core/Logger.js";
var n = e({ bindStartupEngine: () => l, findAssetByName: () => m, findSceneComponent: () => b, getAllPlayerProperties: () => D, getAssetCache: () => f, getCc: () => T, getClassByName: () => _, getCurrentScene: () => v, getCurrentSceneName: () => y, getJsonAssets: () => p, getModuleExport: () => C, getSystemModule: () => x, isReady: () => E, listSystemModules: () => S, loadResourceAsset: () => h, onGameInited: () => u, onSceneLaunch: () => d, releaseAsset: () => g, requireModuleExport: () => w, waitForEngine: () => waitForEngine }), r = new t(`engine`), i = null, a = [`PlantFeatures`, `ZombieFeatures`, `ProjectileFeatures`, `PlantProps`, `ZombieProps`, `ProjectileProps`];
function o(e2 = globalThis.window?.cc) {
  let t2 = e2?.assetManager?.assets, n2 = t2?._map, r2 = e2?.director?.getScene?.(), i2 = e2?.js?.getClassByName?.(`MultiLanguage`), o2 = new Set(Object.values(n2 || {}).filter((e3) => typeof e3 == `object` && e3?.json).map((e3) => e3._name)), s2 = a.filter((e3) => !o2.has(e3));
  return { cc: e2, ready: !!(e2?.game?.setFrameRate && e2?.resources?.load && n2 && s2.length === 0 && r2 && i2?.lyrics), assetCount: Number.isFinite(Number(t2?.count)) ? Number(t2.count) : `unavailable`, sceneName: r2?.name || `unavailable`, missingJsonAnchors: s2, hasMultiLanguage: !!i2?.lyrics };
}
function s(e2) {
  let t2 = e2.missingJsonAnchors.length > 0 ? `missing=${e2.missingJsonAnchors.join(`,`)}` : `ready`;
  return `cc=${!!e2.cc}, assets=${e2.assetCount}, data=${t2}, scene=${e2.sceneName}, language=${e2.hasMultiLanguage}`;
}
function waitForEngine(e2 = 3e4, t2 = {}) {
  let { continueAfterTimeout: n2 = true, pollInterval: a2 = 200, slowPollInterval: c2 = 1e3 } = t2;
  return new Promise((t3, l2) => {
    let u2 = Date.now(), d2 = false, f2 = () => {
      let p2 = o();
      if (p2.ready) {
        i = p2.cc, r.info(`Engine ready, assets: ${p2.assetCount}, scene: ${p2.sceneName}`), t3(i);
        return;
      }
      if (!d2 && Date.now() - u2 >= e2) {
        d2 = true;
        let t4 = s(p2);
        if (!n2) {
          r.error(`Engine not detected after ${e2}ms (${t4})`), l2(Error(`Engine wait timeout (${t4})`));
          return;
        }
        r.warn(`Engine still loading after ${e2}ms; continuing to wait (${t4})`);
      }
      setTimeout(f2, d2 ? c2 : a2);
    };
    f2();
  });
}
function l(e2) {
  if (!e2?.assetManager?.assets || typeof e2?.resources?.load != `function` || typeof e2?.js?.getClassByName != `function` || typeof e2?.director?.getScene != `function` || e2.director.getScene()) throw Error(`Invalid cold-start engine boundary`);
  if (i && i !== e2) throw Error(`A different engine is already bound`);
  i = e2;
}
function u(e2) {
  if (!i) {
    r.warn(`onGameInited: engine not ready`);
    return;
  }
  if (i.director?.getScene()) {
    e2();
    return;
  }
  i.game.on(i.Game.EVENT_GAME_INITED, e2);
}
function d(e2) {
  if (!i) {
    r.warn(`onSceneLaunch: engine not ready`);
    return;
  }
  i.director.on(i.Director.EVENT_AFTER_SCENE_LAUNCH, () => {
    e2(i.director.getScene()?.name || `unknown`);
  });
}
function f() {
  return i?.assetManager?.assets || null;
}
function p() {
  let e2 = f();
  return e2 ? Object.values(e2._map).filter((e3) => typeof e3 == `object` && e3.json) : [];
}
function m(e2) {
  return p().find((t2) => t2._name === e2) || null;
}
function h(e2) {
  let t2 = i?.resources;
  return t2?.load ? new Promise((n2, r2) => {
    try {
      t2.load(e2, (t3, i2) => {
        t3 ? r2(t3) : i2 ? n2(i2) : r2(Error(`Resource '${e2}' returned no asset`));
      });
    } catch (e3) {
      r2(e3);
    }
  }) : Promise.reject(Error(`cc.resources.load is unavailable`));
}
function g(e2) {
  e2 && i?.assetManager?.releaseAsset?.(e2);
}
function _(e2) {
  return i?.js?.getClassByName(e2) || null;
}
function v() {
  return i?.director?.getScene?.() || null;
}
function y() {
  return v()?.name || null;
}
function b(e2) {
  let t2 = v();
  if (!t2) return null;
  let n2 = typeof e2 == `string` ? _(e2) : e2;
  if (!n2) return null;
  try {
    return t2.getComponentInChildren(n2) ?? null;
  } catch {
    return null;
  }
}
function x(e2) {
  try {
    return window.System?.get?.(e2) || null;
  } catch (t2) {
    return r.debug(`SystemJS get failed for '${e2}': ${t2}`), null;
  }
}
function S() {
  let e2 = globalThis.window?.System || globalThis.System;
  if (typeof e2?.entries != `function`) return null;
  try {
    return [...e2.entries()].filter((e3) => Array.isArray(e3) && typeof e3[0] == `string` && e3[1] && typeof e3[1] == `object`).map(([e3, t2]) => [e3, t2]);
  } catch (e3) {
    return r.debug(`SystemJS entries failed: ${e3}`), null;
  }
}
function C(e2, t2) {
  return x(e2)?.[t2] ?? null;
}
function w(e2, t2) {
  let n2 = C(e2, t2);
  return n2 ?? r.warn(`SystemJS export missing: ${e2} -> ${t2}`), n2;
}
function T() {
  return i;
}
function E() {
  return i !== null;
}
function D() {
  return C(`chunks:///_virtual/PlayerProperties.ts`, `AllPlayerProperties`);
}
export {
  u as _,
  D as a,
  w as b,
  _ as c,
  p as d,
  C as f,
  h as g,
  S as h,
  b as i,
  v as l,
  E as m,
  n,
  f as o,
  x as p,
  m as r,
  T as s,
  l as t,
  y as u,
  d as v,
  waitForEngine,
  g as y
};
