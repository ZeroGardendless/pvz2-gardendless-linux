// mods/aurum/src/Occlusion.js
var RENDER_HASH = "1832dc0be12dcd643d315b8e7177ea93847b9c446c4376afc231793dd739dbcc";
var VERTEX_HASHES = [{
  glsl3: "20a2e83c7b01595f9e606295f8cd91fc462927ceb56142d946ba82dedfb751df",
  glsl1: "8ce3b7a1af670f7f0e266cc198a7814fc5832b550cc8824f724c24a7eb523c7b"
}, { glsl3: "635e58d9968ddf5cc0933108f067adeff8b511ccf17701ced29a9f53171160a0", glsl1: "1f63be8e90d81ea17e561d42578cd1e434b01ab490348158051da193be9a26d3" }];
var matrixKeys = Array.from({ length: 16 }, (_, index) => "m" + String(index).padStart(2, "0"));
async function hash(value) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
function inside(rect, point, margin = 0) {
  return point.x > rect.left + margin && point.x < rect.right - margin && point.y > rect.top + margin && point.y < rect.bottom - margin;
}
function hiddenBounds(bounds, viewport, occluders) {
  if (![bounds.left, bounds.right, bounds.top, bounds.bottom].every(Number.isFinite)) return null;
  if (bounds.right < viewport.left - 2 || bounds.left > viewport.right + 2 || bounds.bottom < viewport.top - 2 || bounds.top > viewport.bottom + 2) return "offscreen";
  if (occluders.some((rect) => inside(rect, { x: bounds.left, y: bounds.top }, 2) && inside(rect, { x: bounds.right, y: bounds.bottom }, 2))) return "occluded";
  return null;
}
function opaqueWindows() {
  const rectangles = [];
  for (const element of document.querySelectorAll("dialog[open],#gp-overlay.gp-open")) {
    const style = getComputedStyle(element), color = style.backgroundColor;
    if (style.visibility !== "visible" || style.display === "none" || Number(style.opacity) !== 1 || style.filter !== "none" || style.mixBlendMode !== "normal" || !/^rgb\([^,/]+,[^,/]+,[^,/]+\)$/.test(color) && !/^rgba\([^,/]+,[^,/]+,[^,/]+,\s*1\s*\)$/.test(color)) continue;
    let opaque = true;
    for (let parent = element.parentElement; parent; parent = parent.parentElement) {
      if (Number(getComputedStyle(parent).opacity) !== 1) {
        opaque = false;
        break;
      }
    }
    if (!opaque) continue;
    const radius = Math.max(...["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].map((key) => parseFloat(style[key])));
    if (!Number.isFinite(radius) || ["borderTopLeftRadius", "borderTopRightRadius", "borderBottomLeftRadius", "borderBottomRightRadius"].some((key) => style[key].includes("%"))) continue;
    if (style.transform !== "none") {
      const matrix = new DOMMatrixReadOnly(style.transform);
      if (!matrix.is2D || matrix.b !== 0 || matrix.c !== 0) continue;
    }
    const rect = element.getBoundingClientRect(), inset = Math.max(radius, 4);
    if (rect.width > inset * 2 && rect.height > inset * 2) rectangles.push({ left: rect.left + inset, right: rect.right - inset, top: rect.top + inset, bottom: rect.bottom - inset });
  }
  return rectangles;
}
function project(matrix, x, y, z, viewport, output) {
  const w = matrix.m03 * x + matrix.m07 * y + matrix.m11 * z + matrix.m15;
  if (!Number.isFinite(w) || Math.abs(w - 1) > 1e-5) return null;
  const nx = matrix.m00 * x + matrix.m04 * y + matrix.m08 * z + matrix.m12;
  const ny = matrix.m01 * x + matrix.m05 * y + matrix.m09 * z + matrix.m13;
  output.x = viewport.left + (nx + 1) * 0.5 * (viewport.right - viewport.left);
  output.y = viewport.top + (1 - ny) * 0.5 * (viewport.bottom - viewport.top);
  return output;
}
async function installOcclusion(cc, hooks, log, effect, { allowRenderTexture = false } = {}) {
  const prototype = cc?.dragonBones?.ArmatureDisplay?.prototype;
  if (typeof prototype?._render !== "function" || await hash(prototype._render.toString()) !== RENDER_HASH) {
    log.warn("Draw culling skipped: unsupported or modified renderer.");
    return () => {
    };
  }
  const trustedEffects = /* @__PURE__ */ new WeakMap(), examined = /* @__PURE__ */ new WeakSet();
  async function trust(asset) {
    if (!asset || examined.has(asset)) return;
    examined.add(asset);
    if (asset.shaders?.length !== 1) return;
    const shader = asset.shaders[0], glsl3 = shader.glsl3?.vert, glsl1 = shader.glsl1?.vert;
    const hashes = { glsl3: await hash(glsl3 || ""), glsl1: await hash(glsl1 || "") };
    if (VERTEX_HASHES.some((expected) => expected.glsl3 === hashes.glsl3 && expected.glsl1 === hashes.glsl1)) {
      trustedEffects.set(asset, { shader, glsl3, glsl1 });
    }
  }
  const getEffect = typeof effect === "function" ? effect : () => effect;
  await trust(getEffect());
  await trust(cc.builtinResMgr?.get("default-spine-material")?.effectAsset);
  const stats = { calls: 0, offscreen: 0, occluded: 0, fallbacks: 0 };
  let cameras = [], occluders = [];
  const previous = /* @__PURE__ */ new WeakMap();
  function prepare() {
    void trust(getEffect());
    void trust(cc.builtinResMgr?.get("default-spine-material")?.effectAsset);
    const canvas = cc.game?.canvas;
    if (!canvas) {
      cameras = [];
      return;
    }
    const rect = canvas.getBoundingClientRect();
    occluders = opaqueWindows();
    cameras = [];
    for (const scene of cc.director.root?.scenes || []) for (const camera of scene.cameras || []) {
      if (!camera.enabled || !allowRenderTexture && camera.window !== cc.director.root.mainWindow) continue;
      const matrix = camera.matViewProj, nodeMatrix = camera.node?.getWorldMatrix?.();
      const viewport = camera.viewport;
      if (!matrix || !nodeMatrix || !viewport) {
        cameras.push({ camera, stable: false });
        continue;
      }
      const signature = [...matrixKeys.map((key) => matrix[key]), ...matrixKeys.map((key) => nodeMatrix[key]), rect.left, rect.top, rect.width, rect.height, viewport.x, viewport.y, viewport.width, viewport.height];
      const last = previous.get(camera), stable = camera.projectionType === 0 && !camera._isProjDirty && last?.length === signature.length && signature.every((value, index) => Number.isFinite(value) && value === last[index]);
      previous.set(camera, signature);
      cameras.push({ camera, stable, matrix, viewport: { left: rect.left + viewport.x * rect.width, right: rect.left + (viewport.x + viewport.width) * rect.width, top: rect.top + (1 - viewport.y - viewport.height) * rect.height, bottom: rect.top + (1 - viewport.y) * rect.height } });
    }
  }
  function compatible(display) {
    const material = display.customMaterial || display.getSharedMaterial?.(0);
    const asset = material?.effectAsset, record = asset && trustedEffects.get(asset);
    return !!record && asset.shaders?.length === 1 && asset.shaders[0] === record.shader && record.shader.glsl3?.vert === record.glsl3 && record.shader.glsl1?.vert === record.glsl1 && material.passes?.length > 0 && material.passes.every((pass) => pass.defines && !pass.defines.USE_LOCAL && !pass.defines.USE_PIXEL_ALIGNMENT);
  }
  const pointBuffer = { x: 0, y: 0 };
  const remove = hooks.wrapMethod({ target: prototype, methodName: "_render", handler(call) {
    stats.calls++;
    const display = call.thisArg, data = display.renderData, vertices = data?.chunk?.vb, count = data?.vertexCount, stride = data?.floatStride;
    if (!cameras.length || !compatible(display) || !vertices || stride !== 9 || !count || count > 8192 || count * stride > vertices.length || display.debugBones || Number.isFinite(display.stencilStage) && display.stencilStage !== 0) {
      stats.fallbacks++;
      return call.callNext();
    }
    let reason = "offscreen", relevant = false;
    for (const { camera, stable, matrix, viewport } of cameras) {
      if ((camera.visibility & display.node.layer) === 0) continue;
      relevant = true;
      if (!stable) return call.callNext();
      const position = display.node.worldPosition, anchor = project(matrix, position.x, position.y, position.z, viewport, pointBuffer);
      if (!anchor || inside(viewport, anchor) && !occluders.some((rect) => inside(rect, anchor))) return call.callNext();
      const bounds = { left: Infinity, right: -Infinity, top: Infinity, bottom: -Infinity };
      for (let index = 0; index < count; index++) {
        const offset = index * stride, point = project(matrix, vertices[offset], vertices[offset + 1], vertices[offset + 2], viewport, pointBuffer);
        if (!point) return call.callNext();
        bounds.left = Math.min(bounds.left, point.x);
        bounds.right = Math.max(bounds.right, point.x);
        bounds.top = Math.min(bounds.top, point.y);
        bounds.bottom = Math.max(bounds.bottom, point.y);
      }
      const hidden = hiddenBounds(bounds, viewport, occluders);
      if (!hidden) return call.callNext();
      if (hidden === "occluded") reason = hidden;
    }
    if (!relevant) return call.callNext();
    stats[reason]++;
    return void 0;
  } });
  const event = cc.Director.EVENT_BEFORE_DRAW;
  cc.director.on(event, prepare);
  log.info("Draw culling active: current posed meshes outside cameras or fully covered by opaque windows; all simulation and animation retained.");
  const dispose = () => {
    remove();
    cc.director.off(event, prepare);
    cameras = [];
    occluders = [];
  };
  Object.defineProperty(dispose, "stats", { get: () => ({ ...stats }) });
  return dispose;
}

// mods/aurum/src/NeutralVisuals.js
function createNeutralVisualState(defaultSaturation) {
  let snapshots = /* @__PURE__ */ new WeakMap();
  const stats = { materialCalls: 0, materialSkips: 0, colorCalls: 0, colorSkips: 0 };
  function neutral(zombie) {
    return zombie.additionalSatuation === defaultSaturation && !zombie.dead && !zombie.fallingInSky && !zombie.teleporting && !(zombie.perfume > 0) && !(zombie.darkmatter > 0) && !zombie.poisoned && !(zombie.warningCD > 0) && !(zombie.oldestCD > 0) && !zombie._potionInvisible && !zombie.potionInvisible && !zombie.havePlantfood && !(zombie.haveSun > 0) && !(zombie.potionSpeedLevel > 0) && !(zombie.potionToughnessLevel > 0) && zombie.hurting === 0 && !(zombie.glittering > 0) && !zombie.CarriedSporeShroom && !(zombie.chill > 0) && !(zombie.freeze > 0) && !zombie.iceblock && !zombie.iceblocked && !zombie.icebloom_block && zombie.TotalRGB === 0;
  }
  return Object.freeze({
    material(zombie, next, context) {
      stats.materialCalls++;
      const pass = zombie.material?.passes?.[0], block = pass?._rootBlock;
      if (!neutral(zombie) || !(block instanceof ArrayBuffer) || !block.byteLength || block.byteLength > 4096 || block.byteLength % 4) {
        snapshots.delete(zombie);
        return next.call(context);
      }
      const previous = snapshots.get(zombie);
      if (previous?.pass === pass && previous.block === block && zombie.body?.db?.customMaterial === zombie.material) {
        let equal = true;
        for (let index = 0; index < previous.words.length; index++) {
          if (previous.words[index] !== previous.saved[index]) {
            equal = false;
            break;
          }
        }
        if (equal) {
          stats.materialSkips++;
          return void 0;
        }
      }
      const result = next.call(context);
      if (pass?._rootBlock === block) {
        const words = new Uint32Array(block);
        snapshots.set(zombie, { pass, block, words, saved: words.slice() });
      }
      return result;
    },
    color(zombie, next, context) {
      stats.colorCalls++;
      const color = zombie.body?.db?.color;
      const visible = !zombie.displayedStuck && (zombie.displayed || !zombie.hiddenWhenTooFar || zombie.worldPositionX <= 1200 && zombie.worldPositionX >= -200);
      if (visible && !zombie.dead && !zombie.iceblock && !zombie.icebloom_block && !(zombie.coloredWhenHypnotized && zombie.hypnotized) && color?.r === 255 && color.g === 255 && color.b === 255 && color.a === 255) {
        stats.colorSkips++;
        return void 0;
      }
      return next.call(context);
    },
    clear() {
      snapshots = /* @__PURE__ */ new WeakMap();
    },
    get stats() {
      return { ...stats };
    }
  });
}
var EXPECTED = {
  shouldMaterial: "e3ada15678cccd8c7cd155f495c6f66785a9ec3535282d14ad9d7ad4681e02e6",
  shouldColor: "f51a2dcb705ef85f53ff19c976a5f33fa47b6f52be69d0249e5e6635721bd193",
  additionalSatuation: "d4a340aa0f8375ff31ca3a453233b608786ef7e46633ec2ae36fe9dcac840921"
};
async function installNeutralVisuals(Zombie, hooks, log) {
  const prototype = Zombie?.prototype;
  if (!prototype) return () => {
  };
  for (const [name, expected] of Object.entries(EXPECTED)) {
    if (typeof prototype[name] !== "function") return () => {
    };
    const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(prototype[name].toString()));
    const hash2 = Array.from(new Uint8Array(bytes), (value) => value.toString(16).padStart(2, "0")).join("");
    if (hash2 !== expected) {
      log.warn("Neutral visual reuse skipped: game visual methods changed or another mod owns them.");
      return () => {
      };
    }
  }
  const state = createNeutralVisualState(prototype.additionalSatuation), removers = [];
  try {
    for (const [methodName, key] of [["shouldMaterial", "material"], ["shouldColor", "color"]]) {
      removers.push(hooks.wrapMethod({ target: prototype, methodName, handler: (call) => state[key](call.thisArg, call.callNext, call) }));
    }
  } catch (error) {
    for (const remove of removers.reverse()) remove();
    state.clear();
    throw error;
  }
  log.info("Neutral zombie visuals: unchanged shader buffers and white tints reused; effects retain upstream updates.");
  const dispose = () => {
    for (const remove of removers.reverse()) remove();
    state.clear();
  };
  Object.defineProperty(dispose, "stats", { get: () => state.stats });
  return dispose;
}

// mods/aurum/src/Hotspots.js
function beginHotspotSample(targets, hooks, now = () => performance.now()) {
  const removers = [], records = [], seen = /* @__PURE__ */ new Map();
  let stopped = false;
  try {
    for (const { label, target, methodName } of targets) {
      if (records.length >= 64 || typeof target?.[methodName] !== "function") continue;
      let keys = seen.get(target);
      if (!keys) seen.set(target, keys = /* @__PURE__ */ new Set());
      if (keys.has(methodName)) continue;
      keys.add(methodName);
      const record = { label, calls: 0, inclusiveMs: 0, maxMs: 0 };
      const remove = hooks.wrapMethod({ target, methodName, handler(call) {
        const start = now();
        try {
          return call.callNext();
        } finally {
          const elapsed = Math.max(0, now() - start);
          record.calls++;
          record.inclusiveMs += elapsed;
          record.maxMs = Math.max(record.maxMs, elapsed);
        }
      } });
      records.push(record);
      removers.push(remove);
    }
  } catch (error) {
    for (const remove of removers.reverse()) remove();
    throw error;
  }
  return () => {
    if (!stopped) {
      stopped = true;
      for (const remove of removers.reverse()) remove();
    }
    return { kind: "Instrumented synchronous CPU time, including nested calls and profiler overhead. Do not sum inclusive rows or treat them as GPU time.", methods: records.map((record) => ({ ...record })).sort((a, b) => b.inclusiveMs - a.inclusiveMs) };
  };
}
function collectHotspotTargets(engine, cc) {
  const targets = [];
  function add(label, target, names) {
    for (const methodName of names) if (typeof target?.[methodName] === "function") targets.push({ label: label + "." + methodName, target, methodName });
  }
  add("DragonBones", cc?.dragonBones?.ArmatureDisplay?.prototype, ["updateAnimation", "syncAttachedNode"]);
  for (const [module, name, methods, isStatic] of [
    ["CharacterManager", "Rectangle", ["judgeCrossRec", "judgeInRec"]],
    ["JSONs", "PvZ2Object", ["getObjectsByRTID"], true],
    ["Character", "Character", ["update", "lateUpdate"]],
    ["Zombie", "Zombie", ["characterUpdate", "characterUpdateOnDisplayed", "shouldMaterial", "shouldColor", "setBodyRec", "setPlantDetectorRec", "defaultDetectPlant", "correctDepth"]],
    ["Plant", "Plant", ["characterUpdate", "lateUpdate"]],
    ["levelController", "LevelPlay", ["update", "lateUpdate"]]
  ]) {
    const exported = engine.getModuleExport?.(`chunks:///_virtual/${module}.ts`, name);
    add(name, isStatic ? exported : exported?.prototype, methods);
  }
  for (const component of cc?.director?.getScene?.()?.getComponentsInChildren?.(cc.Component) || []) {
    const prototype = Object.getPrototypeOf(component);
    const methods = ["specialZombieUpdate", "specialPlantUpdate"].filter((name) => Object.hasOwn(prototype, name));
    add(cc.js?.getClassName?.(component) || component.constructor.name, prototype, methods);
  }
  return targets;
}

// mods/aurum/src/DataLookup.js
function createRtidParser(limit = 256) {
  const cache = /* @__PURE__ */ new Map();
  return Object.freeze({
    parse(reference) {
      if (cache.has(reference)) return cache.get(reference);
      const parts = reference.includes("RTID") ? reference.replace("RTID(", "").replace(")", "").split("@") : [];
      const parsed = parts.length === 2 ? Object.freeze({ alias: parts[0], namespace: parts[1] === "." ? "CurrentLevel" : parts[1] }) : null;
      if (cache.size >= limit) cache.delete(cache.keys().next().value);
      cache.set(reference, parsed);
      return parsed;
    },
    clear() {
      cache.clear();
    },
    get size() {
      return cache.size;
    }
  });
}
async function installDataLookup(ObjectType, containers, hooks, log) {
  const original = ObjectType?.getObjectsByRTID;
  if (typeof original !== "function" || !containers) return () => {
  };
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(original.toString()));
  const hash2 = Array.from(new Uint8Array(bytes), (value) => value.toString(16).padStart(2, "0")).join("");
  if (hash2 !== EXPECTED_LOOKUP) {
    log.warn("RTID parsing cache skipped: bundled lookup changed or another mod owns it.");
    return () => {
    };
  }
  const parser = createRtidParser();
  const remove = hooks.wrapMethod({ target: ObjectType, methodName: "getObjectsByRTID", handler(call) {
    const [reference, classFilter = null, currentLevel = null] = call.args;
    if (typeof reference !== "string") return call.callNext();
    const parsed = parser.parse(reference);
    if (!parsed) return [];
    if (parsed.namespace === "CurrentLevel" && currentLevel?.length) {
      return call.thisArg.getObjects(parsed.alias, currentLevel, classFilter);
    }
    const candidates = containers[parsed.namespace];
    return candidates?.length > 0 ? call.thisArg.getObjects(parsed.alias, candidates, classFilter) : [];
  } });
  log.info("RTID parsing cache active: at most 256 strings; level data and modded objects remain uncached.");
  return () => {
    remove();
    parser.clear();
  };
}
var EXPECTED_LOOKUP = "127583875cd3e05257ce1ad3309db785da235a5bdb3945c3e895b73a31739776";

// mods/aurum/src/Collision.js
var EXPECTED_COLLISION = "b9c9ee56aa908eb1383d0e5e07bd55204c2adaa3b47ef117162ecc6572643bd0";
function separatedAxisAligned(a, b) {
  if (!a || !b) return false;
  const p = a.point1, q = a.point2, r = a.point3, s = a.point4;
  const u = b.point1, v = b.point2, w = b.point3, x = b.point4;
  if (!p || !q || !r || !s || !u || !v || !w || !x) return false;
  if (!(p.y === q.y && q.x === r.x && r.y === s.y && s.x === p.x && u.y === v.y && v.x === w.x && w.y === x.y && x.x === u.x)) return false;
  if (p.x === r.x || p.y === r.y || u.x === w.x || u.y === w.y) return false;
  return Math.max(p.x, r.x) < Math.min(u.x, w.x) || Math.max(u.x, w.x) < Math.min(p.x, r.x) || Math.max(p.y, r.y) < Math.min(u.y, w.y) || Math.max(u.y, w.y) < Math.min(p.y, r.y);
}
async function installCollisionBroadPhase(Rectangle, hooks, log) {
  const prototype = Rectangle?.prototype;
  if (typeof prototype?.judgeCrossRec !== "function") return () => {
  };
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(prototype.judgeCrossRec.toString()));
  const hash2 = Array.from(new Uint8Array(bytes), (value) => value.toString(16).padStart(2, "0")).join("");
  if (hash2 !== EXPECTED_COLLISION) {
    log.warn("Collision broad phase skipped: game function changed or another mod owns it.");
    return () => {
    };
  }
  const remove = hooks.wrapMethod({ target: prototype, methodName: "judgeCrossRec", handler(call) {
    if (separatedAxisAligned(call.thisArg, call.args[0])) return false;
    return call.callNext();
  } });
  log.info("Collision broad phase active; overlapping/rotated cases retain the original narrow phase.");
  return remove;
}

// mods/aurum/src/Rendering.js
function installArmatureBatching(cc, hooks, log) {
  const Display = cc?.dragonBones?.ArmatureDisplay;
  const prototype = Display?.prototype;
  const descriptor = prototype && Object.getOwnPropertyDescriptor(prototype, "enableBatch");
  if (!descriptor?.set || typeof prototype.__preload !== "function" || typeof prototype.onDestroy !== "function") {
    log.warn("Armature batching skipped: unsupported Cocos lifecycle.");
    return () => {
    };
  }
  const originals = /* @__PURE__ */ new Map();
  function apply(display) {
    if (!display || display.customMaterial || display.debugBones || display.enableBatch || originals.has(display)) return;
    originals.set(display, display.enableBatch);
    display.enableBatch = true;
  }
  const removeMaterial = typeof hooks.wrapProperty === "function" ? hooks.wrapProperty({
    target: prototype,
    key: "customMaterial",
    set(call) {
      const result = call.callNext(call.nextValue);
      if (originals.has(call.thisArg)) call.thisArg.enableBatch = !call.nextValue && !call.thisArg.debugBones;
      return result;
    }
  }) : () => {
  };
  const removePreload = hooks.wrapMethod({ target: prototype, methodName: "__preload", handler(call) {
    const result = call.callNext();
    apply(call.thisArg);
    return result;
  } });
  const removeDestroy = hooks.wrapMethod({ target: prototype, methodName: "onDestroy", handler(call) {
    originals.delete(call.thisArg);
    return call.callNext();
  } });
  for (const display of cc.director?.getScene?.()?.getComponentsInChildren?.(Display) || []) apply(display);
  log.info("DragonBones draw batching active; realtime bones, attachments and animation events retained.");
  return () => {
    removePreload();
    removeDestroy();
    removeMaterial();
    for (const [display, previous] of originals) if (display.isValid !== false && display.enableBatch === true) display.enableBatch = previous;
    originals.clear();
  };
}

// mods/aurum/src/PreloadQueue.js
function createPreloadQueue(load, { concurrency = 2 } = {}) {
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) throw new RangeError("Concurrency must be 1\u20134.");
  const queued = [], entries = /* @__PURE__ */ new Map();
  let active = 0, cancelled = false;
  function pump() {
    while (!cancelled && active < concurrency && queued.length) {
      const job = queued.shift();
      active++;
      Promise.resolve().then(() => load(job.path)).then(
        () => job.resolve({ path: job.path, status: "ready" }),
        (error) => job.resolve({ path: job.path, status: "failed", message: String(error?.message || error) })
      ).finally(() => {
        active--;
        pump();
      });
    }
  }
  return {
    add(path) {
      if (cancelled) return Promise.resolve({ path, status: "cancelled" });
      if (!entries.has(path)) {
        const result = new Promise((resolve) => queued.push({ path, resolve }));
        entries.set(path, result);
        pump();
      }
      return entries.get(path);
    },
    cancel() {
      cancelled = true;
      for (const job of queued.splice(0)) job.resolve({ path: job.path, status: "cancelled" });
    },
    get pending() {
      return queued.length;
    },
    get active() {
      return active;
    }
  };
}

// mods/aurum/src/FastSplash.js
function startWithShortFade(call, cc, hooks, duration = 0.12, onApply) {
  const prototype = cc?.Tween?.prototype;
  if (!call.thisArg || typeof prototype?.to !== "function") return call.callNext();
  const splash = call.thisArg;
  const remove = hooks.wrapMethod({
    target: prototype,
    methodName: "to",
    handler(tweenCall) {
      const [seconds, properties, ...rest] = tweenCall.args;
      const isCoverFade = splash.screenColor && tweenCall.thisArg?._target === splash.screenColor && seconds === 1.33 && properties?.a === 0 && Object.keys(properties).length === 1;
      if (!isCoverFade) return tweenCall.callNext();
      onApply?.();
      return tweenCall.callNext(duration, properties, ...rest);
    }
  });
  try {
    return call.callNext();
  } finally {
    remove();
  }
}

// mods/aurum/src/Startup.js
var resources = ["Materials", "Plants", "Zombies", "Dinosaurs", "Music", "Sounds", "LevelNodes", "Droppings", "Trophies", "Particles", "WorldMaps", "ZenGarden", "Scenes"];
function startup(ctx) {
  let dispose = () => {
  }, prepared;
  ctx.registrations.add("startup-performance", {
    prepare() {
      const cc = ctx.engine.getCc();
      if (!cc?.director || !cc.Director?.EVENT_BEFORE_SCENE_LAUNCH) throw Error("Aurum startup boundary is unavailable");
      const options = globalThis.__gardendlessAurumHost?.startupOptions || {};
      prepared = { cc, options };
    },
    publish() {
      const { cc, options } = prepared;
      const removers = [];
      let queue = null, installed = false;
      function swap(target, name, handler) {
        const descriptor = Object.getOwnPropertyDescriptor(target, name), original = target[name];
        function wrapped(...args) {
          return handler({ thisArg: this, args, callNext: (...next) => original.apply(this, next.length ? next : args) });
        }
        Object.defineProperty(target, name, { configurable: true, enumerable: descriptor?.enumerable ?? false, writable: true, value: wrapped });
        const remove = () => {
          if (target[name] === wrapped) {
            if (descriptor) Object.defineProperty(target, name, descriptor);
            else delete target[name];
          }
        };
        removers.push(remove);
        return remove;
      }
      const hooks = { wrapMethod: ({ target, methodName, handler }) => swap(target, methodName, handler) };
      function beforeScene() {
        if (installed) return;
        const prototype = cc.js.getClassByName("splashScene")?.prototype;
        if (typeof prototype?.start !== "function") return;
        installed = true;
        const removeStart = swap(prototype, "start", (call) => {
          removeStart();
          cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, beforeScene);
          if (options.startupPrefetch) {
            queue = createPreloadQueue((path) => new Promise((resolve, reject) => cc.resources.preload(path, cc.Prefab, (error) => error ? reject(error) : resolve())), { concurrency: options.prefetchConcurrency });
            for (const name of resources) void queue.add(`resouce_prefabs/${name}RP`);
          }
          globalThis.__gardendlessAurumHost?.reportStartup({ phase: "splash-start", shortFade: false, prefetch: options.startupPrefetch });
          return options.fastSplash ? startWithShortFade(call, cc, hooks, 0.12, () => globalThis.__gardendlessAurumHost?.reportStartup({ phase: "splash-start", shortFade: true, prefetch: options.startupPrefetch })) : call.callNext();
        });
      }
      cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, beforeScene);
      beforeScene();
      dispose = () => {
        cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LAUNCH, beforeScene);
        queue?.cancel();
        for (const remove of removers.reverse()) remove();
      };
    },
    dispose() {
      dispose();
    }
  });
  return () => dispose();
}

// mods/aurum/src/Entry.js
async function setup(ctx) {
  await ctx.settings.defineSchema({ title: "Aurum", schemaVersion: 1, description: "Rendering, startup and bounded diagnostics. Compare performance on your own levels.", fields: [
    { key: "occlusionCulling", type: "toggle", label: "Cull fully hidden draw calls (next launch)", default: true },
    { key: "neutralVisuals", type: "toggle", label: "Reuse unchanged zombie shader state (next launch)", default: true },
    { key: "dataLookup", type: "toggle", label: "Reuse parsed object references (next launch)", default: true },
    { key: "collisionBroadPhase", type: "toggle", label: "Reject distant collision pairs early (next launch)", default: true },
    { key: "armatureBatching", type: "toggle", label: "Batch skeletal draw calls (next launch)", default: true },
    { key: "hookCache", type: "toggle", label: "Cache GP-Next hook ordering", default: true },
    { key: "fastSplash", type: "toggle", label: "Short startup fade (next launch)", default: true },
    { key: "startupPrefetch", type: "toggle", label: "Experimental startup prefetch (next launch)", default: false },
    { key: "prefetchConcurrency", type: "number", label: "Maximum simultaneous prefetches", default: 2, min: 1, max: 4, step: 1 }
  ] });
  let settings = await ctx.settings.getAll(), closed = false, stopSample = null, stopHotspots = null;
  const hostSession = globalThis.__gardendlessAurumHost?.createSession();
  hostSession?.configure({ enabled: true, hookCache: settings.hookCache });
  ctx.settings.onChange(async () => {
    const next = await ctx.settings.getAll();
    if (!closed) {
      settings = next;
      hostSession?.configure({ enabled: true, hookCache: settings.hookCache });
    }
  });
  const engine = ctx.unsafe.engine, cc = engine.getCc();
  const Rectangle = engine.getModuleExport?.("chunks:///_virtual/CharacterManager.ts", "Rectangle");
  const ObjectType = engine.getModuleExport?.("chunks:///_virtual/JSONs.ts", "PvZ2Object");
  const containers = engine.getModuleExport?.("chunks:///_virtual/JSONs.ts", "PvZ2ObjectContainer");
  const disposeData = settings.dataLookup !== false ? await installDataLookup(ObjectType, containers, ctx.unsafe.hooks, ctx.log) : () => {
  };
  const disposeCollisions = settings.collisionBroadPhase ? await installCollisionBroadPhase(Rectangle, ctx.unsafe.hooks, ctx.log) : () => {
  };
  const Zombie = engine.getModuleExport?.("chunks:///_virtual/Zombie.ts", "Zombie");
  const disposeVisuals = settings.neutralVisuals !== false ? await installNeutralVisuals(Zombie, ctx.unsafe.hooks, ctx.log) : () => {
  };
  const disposeOcclusion = settings.occlusionCulling !== false ? await installOcclusion(cc, ctx.unsafe.hooks, ctx.log, () => engine.getModuleExport?.("chunks:///_virtual/Materials.ts", "materialRes")?.addColorEffect) : () => {
  };
  const disposeRendering = settings.armatureBatching ? installArmatureBatching(cc, ctx.unsafe.hooks, ctx.log) : () => {
  };
  ctx.log.info("Aurum active: " + JSON.stringify({ hookCache: settings.hookCache, fastSplash: settings.fastSplash, armatureBatching: settings.armatureBatching, neutralVisuals: !!disposeVisuals.stats }));
  function sample() {
    if (closed || stopSample) return;
    const director = cc?.director, before = cc?.Director?.EVENT_BEFORE_UPDATE, after = cc?.Director?.EVENT_AFTER_DRAW;
    if (!director || !before || !after) {
      ctx.ui.toast("Frame timing unavailable in this engine.", "warning");
      return;
    }
    const values = new Float64Array(2048);
    let count = 0, total = 0, max = 0, start = null;
    const begin = () => {
      start = performance.now();
    };
    const end = () => {
      if (start === null) return;
      const elapsed = performance.now() - start;
      start = null;
      values[count % values.length] = elapsed;
      count++;
      total += elapsed;
      max = Math.max(max, elapsed);
    };
    director.on(before, begin);
    director.on(after, end);
    stopSample = () => {
      director.off(before, begin);
      director.off(after, end);
      stopSample = null;
      if (closed) return;
      const sorted = Array.from(values.subarray(0, Math.min(count, values.length))).sort((a, b) => a - b);
      const report = { kind: "CPU update-to-after-draw duration; not GPU time or presentation FPS", frames: count, meanMs: count ? total / count : 0, maxMs: max, retainedSamples: sorted.length, p95Ms: sorted.length ? sorted[Math.floor((sorted.length - 1) * 0.95)] : 0 };
      ctx.log.info(JSON.stringify(report));
      ctx.ui.toast("Aurum sample saved to GP-Next logs.", "success");
    };
    ctx.runtime.setTimeout(stopSample, 3e4);
    ctx.ui.toast("Aurum: sampling CPU frame work for 30 seconds.", "info");
  }
  function sampleHotspots() {
    if (closed || stopHotspots) return;
    try {
      const finish = beginHotspotSample(collectHotspotTargets(engine, cc), ctx.unsafe.hooks);
      stopHotspots = () => {
        stopHotspots = null;
        const report = finish();
        if (!closed) {
          ctx.log.info(JSON.stringify(report));
          ctx.ui.toast("CPU hotspot sample saved to GP-Next logs.", "success");
        }
      };
      ctx.runtime.setTimeout(() => stopHotspots?.(), 1e4);
      ctx.ui.toast("Sampling CPU hotspots for 10 seconds. Profiling briefly adds CPU work.", "info");
    } catch (error) {
      ctx.log.warn("CPU hotspot sample unavailable: " + String(error?.message || error));
    }
  }
  async function memorySnapshot() {
    try {
      const audio = await globalThis.__gdAudio?.memorySnapshot?.();
      const assets = Object.values(cc?.assetManager?.assets?._map || {});
      const textures = typeof cc?.Texture2D === "function" ? assets.filter((asset) => asset instanceof cc.Texture2D) : [];
      const report = { drawCulling: disposeOcclusion.stats || { active: false }, zombieVisuals: disposeVisuals.stats || { active: false }, audio: audio || { backend: "browser fallback" }, cocosAssets: assets.length, textures: textures.length, estimatedUncompressedTextureRGBABytes: textures.reduce((total, texture) => total + texture.width * texture.height * 4, 0), note: "Texture bytes are a format-agnostic estimate; audio cache excludes live voice memory. This is not process RSS." };
      ctx.log.info(JSON.stringify(report));
      ctx.ui.toast("Memory snapshot saved to GP-Next logs.", "success");
    } catch (error) {
      ctx.log.warn("Memory snapshot unavailable: " + String(error?.message || error));
    }
  }
  ctx.controls.definePanel({ title: "Aurum", groups: [{ title: "Diagnostics", items: [{ key: "sample", type: "action", label: "Sample CPU frame work (30 seconds)", onClick: sample }, { key: "memory", type: "action", label: "Memory snapshot", onClick: memorySnapshot }, { key: "hotspots", type: "action", label: "Sample CPU hotspots (10 seconds)", onClick: sampleHotspots }] }] });
  return () => {
    closed = true;
    disposeOcclusion();
    disposeVisuals();
    disposeData();
    disposeCollisions();
    disposeRendering();
    hostSession?.dispose();
    stopSample?.();
    stopHotspots?.();
  };
}
var Entry_default = { setup, startup };
export {
  Entry_default as default,
  setup,
  startup
};
