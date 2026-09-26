const DEFAULT_FRAME_RATE = 120;
const MAX_FRAME_RATE = 240;
const FRAME_RATE_OPTIONS = [30, 60, 90, 120, 144, 165, 240];
const controllers = /* @__PURE__ */ new WeakMap();
function normalizeFrameRate(setting) {
  const rate = Number(setting);
  return Number.isFinite(rate) && rate > 0 ? Math.max(30, Math.min(MAX_FRAME_RATE, Math.round(rate))) : DEFAULT_FRAME_RATE;
}
function installScheduler(game) {
  const pacer = game?._pacer;
  if (!pacer || typeof pacer._stTime !== "function" || typeof pacer._ctTime !== "function") {
    throw new Error("Unsupported Cocos frame scheduler");
  }
  const nativeSchedule = pacer._stTime;
  const nativeCancel = pacer._ctTime;
  const controller = { rate: DEFAULT_FRAME_RATE, nextDeadline: null };
  const pending = /* @__PURE__ */ new Map();
  let nextFrameId = 0;
  const channel = typeof MessageChannel === "function" ? new MessageChannel() : null;
  function deliver(frame) {
    if (frame.cancelled) return;
    if (globalThis.document?.hidden) {
      controller.nextDeadline = null;
      frame.nativeHandle = nativeSchedule.call(pacer, frame.callback);
    } else {
      frame.callback();
    }
  }
  if (channel) {
    channel.port1.onmessage = ({ data }) => {
      const frame = pending.get(data);
      if (!frame) return;
      pending.delete(data);
      deliver(frame);
    };
    channel.port1.unref?.();
    channel.port2.unref?.();
  }
  pacer._stTime = function(callback) {
    if (globalThis.document?.hidden) {
      controller.nextDeadline = null;
      return nativeSchedule.call(this, callback);
    }
    const now = performance.now();
    const interval = 1e3 / controller.rate;
    controller.nextDeadline = controller.nextDeadline === null || now - controller.nextDeadline >= interval ? now + interval : controller.nextDeadline + interval;
    const frame = { id: ++nextFrameId, callback, timer: null, nativeHandle: null, cancelled: false };
    /*! Every frame sleeps until its deadline. The message handoff resets nested
     * browser timer clamping without running a self-posting, unbounded loop. */
    frame.timer = setTimeout(() => {
      frame.timer = null;
      if (channel) {
        pending.set(frame.id, frame);
        channel.port2.postMessage(frame.id);
      } else {
        deliver(frame);
      }
    }, Math.max(1, Math.ceil(controller.nextDeadline - now)));
    return frame;
  };
  pacer._ctTime = function(handle) {
    controller.nextDeadline = null;
    if (handle && typeof handle === "object") {
      handle.cancelled = true;
      pending.delete(handle.id);
      if (handle.timer !== null) clearTimeout(handle.timer);
      if (handle.nativeHandle !== null) nativeCancel.call(this, handle.nativeHandle);
    } else {
      nativeCancel.call(this, handle);
    }
  };
  let prototype = game;
  let descriptor;
  while (prototype && !descriptor) {
    descriptor = Object.getOwnPropertyDescriptor(prototype, "frameRate");
    prototype = Object.getPrototypeOf(prototype);
  }
  if (descriptor?.get && descriptor?.set && descriptor.configurable !== false) {
    Object.defineProperty(game, "frameRate", {
      configurable: true,
      get() {
        return descriptor.get.call(this);
      },
      set() {
        descriptor.set.call(this, controller.rate);
      }
    });
  }
  controllers.set(game, controller);
  return controller;
}
function applyFrameRate(game, setting) {
  const controller = controllers.get(game) || installScheduler(game);
  controller.rate = normalizeFrameRate(setting);
  controller.nextDeadline = null;
  game.setFrameRate(controller.rate);
  return controller.rate;
}
export {
  DEFAULT_FRAME_RATE,
  FRAME_RATE_OPTIONS,
  MAX_FRAME_RATE,
  applyFrameRate,
  normalizeFrameRate
};
