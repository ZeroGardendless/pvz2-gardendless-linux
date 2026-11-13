/** Shorten only the startup screen-cover tween; leave every other animation alone. */
export function startWithShortFade(call, cc, hooks, duration = 0.12, onApply) {
  const prototype = cc?.Tween?.prototype;
  if (!call.thisArg || typeof prototype?.to !== 'function') return call.callNext();
  const splash = call.thisArg;
  const remove = hooks.wrapMethod({
    target: prototype,
    methodName: 'to',
    handler(tweenCall) {
      const [seconds, properties, ...rest] = tweenCall.args;
      const isCoverFade = splash.screenColor && tweenCall.thisArg?._target === splash.screenColor
        && seconds === 1.33 && properties?.a === 0 && Object.keys(properties).length === 1;
      if (!isCoverFade) return tweenCall.callNext();
      onApply?.();
      return tweenCall.callNext(duration, properties, ...rest);
    }
  });
  try {
    return call.callNext();
  } finally {
    // Tween.to has already recorded its duration. No animation hook stays active.
    remove();
  }
}
