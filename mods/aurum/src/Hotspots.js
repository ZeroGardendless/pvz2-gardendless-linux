/** Explicit, short-lived instrumentation; no hooks or timers survive disposal. */
export function beginHotspotSample(targets, hooks, now = () => performance.now()) {
  const removers = [], records = [], seen = new Map();
  let stopped = false;
  try {
    for (const {label, target, methodName} of targets) {
      if (records.length >= 64 || typeof target?.[methodName] !== 'function') continue;
      let keys = seen.get(target);
      if (!keys) seen.set(target, keys = new Set());
      if (keys.has(methodName)) continue;
      keys.add(methodName);
      const record = {label, calls:0, inclusiveMs:0, maxMs:0};
      const remove = hooks.wrapMethod({target, methodName, handler(call) {
        const start = now();
        try {return call.callNext();}
        finally {
          const elapsed = Math.max(0, now()-start);
          record.calls++;record.inclusiveMs += elapsed;record.maxMs = Math.max(record.maxMs, elapsed);
        }
      }});
      records.push(record);removers.push(remove);
    }
  } catch (error) {
    for (const remove of removers.reverse()) remove();
    throw error;
  }
  return () => {
    if (!stopped) {stopped = true;for (const remove of removers.reverse()) remove();}
    return {kind:'Instrumented synchronous CPU time, including nested calls and profiler overhead. Do not sum inclusive rows or treat them as GPU time.',methods:records.map(record=>({...record})).sort((a,b)=>b.inclusiveMs-a.inclusiveMs)};
  };
}

export function collectHotspotTargets(engine, cc) {
  const targets = [];
  function add(label, target, names) {
    for (const methodName of names) if (typeof target?.[methodName] === 'function') targets.push({label:label+'.'+methodName,target,methodName});
  }
  add('DragonBones',cc?.dragonBones?.ArmatureDisplay?.prototype,['updateAnimation','syncAttachedNode']);
  for (const [module, name, methods, isStatic] of [
    ['CharacterManager','Rectangle',['judgeCrossRec','judgeInRec']],
    ['JSONs','PvZ2Object',['getObjectsByRTID'],true],
    ['Character','Character',['update','lateUpdate']],
    ['Zombie','Zombie',['characterUpdate','characterUpdateOnDisplayed','shouldMaterial','shouldColor','setBodyRec','setPlantDetectorRec','defaultDetectPlant','correctDepth']],
    ['Plant','Plant',['characterUpdate','lateUpdate']],
    ['levelController','LevelPlay',['update','lateUpdate']],
  ]) {
    const exported = engine.getModuleExport?.(`chunks:///_virtual/${module}.ts`,name);
    add(name,isStatic?exported:exported?.prototype,methods);
  }
  // Capture subclass-specific AI present in this scene, without instrumenting unrelated UI.
  for (const component of cc?.director?.getScene?.()?.getComponentsInChildren?.(cc.Component)||[]) {
    const prototype = Object.getPrototypeOf(component);
    const methods = ['specialZombieUpdate','specialPlantUpdate'].filter(name=>Object.hasOwn(prototype,name));
    add(cc.js?.getClassName?.(component)||component.constructor.name,prototype,methods);
  }
  return targets;
}
