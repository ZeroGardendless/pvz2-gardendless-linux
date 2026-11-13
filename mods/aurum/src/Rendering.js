/** Enable Cocos' existing draw batching; keep full bone simulation and events. */
export function installArmatureBatching(cc, hooks, log) {
  const Display = cc?.dragonBones?.ArmatureDisplay;
  const prototype = Display?.prototype;
  const descriptor = prototype && Object.getOwnPropertyDescriptor(prototype, 'enableBatch');
  if (!descriptor?.set || typeof prototype.__preload !== 'function' || typeof prototype.onDestroy !== 'function') {
    log.warn('Armature batching skipped: unsupported Cocos lifecycle.');
    return () => {};
  }
  const originals = new Map();
  function apply(display) {
    // Custom shaders may depend on local-space vertices. Leave them alone.
    if (!display || display.customMaterial || display.debugBones || display.enableBatch || originals.has(display)) return;
    originals.set(display, display.enableBatch);
    display.enableBatch = true;
  }
  // The game assigns per-entity colour materials after preload. Never merge
  // those uniforms with another entity's draw batch, including later flashes.
  const removeMaterial = typeof hooks.wrapProperty === 'function' ? hooks.wrapProperty({
    target:prototype,key:'customMaterial',set(call) {
      const result=call.callNext(call.nextValue);
      if(originals.has(call.thisArg))call.thisArg.enableBatch=!call.nextValue&&!call.thisArg.debugBones;
      return result;
    }
  }) : () => {};
  const removePreload = hooks.wrapMethod({target:prototype,methodName:'__preload',handler(call) {
    const result = call.callNext(); apply(call.thisArg); return result;
  }});
  const removeDestroy = hooks.wrapMethod({target:prototype,methodName:'onDestroy',handler(call) {
    originals.delete(call.thisArg); return call.callNext();
  }});
  for (const display of cc.director?.getScene?.()?.getComponentsInChildren?.(Display) || []) apply(display);
  log.info('DragonBones draw batching active; realtime bones, attachments and animation events retained.');
  return () => {
    removePreload(); removeDestroy(); removeMaterial();
    for (const [display, previous] of originals) if (display.isValid !== false && display.enableBatch === true) display.enableBatch = previous;
    originals.clear();
  };
}
