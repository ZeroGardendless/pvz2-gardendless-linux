/** Reuse only already-written neutral shader state. Effects always use upstream code. */
export function createNeutralVisualState(defaultSaturation) {
  let snapshots = new WeakMap();
  const stats = {materialCalls:0, materialSkips:0, colorCalls:0, colorSkips:0};
  function neutral(zombie) {
    return zombie.additionalSatuation === defaultSaturation && !zombie.dead && !zombie.fallingInSky
      && !zombie.teleporting && !(zombie.perfume > 0) && !(zombie.darkmatter > 0)
      && !zombie.poisoned && !(zombie.warningCD > 0) && !(zombie.oldestCD > 0)
      && !zombie._potionInvisible && !zombie.potionInvisible && !zombie.havePlantfood && !(zombie.haveSun > 0)
      && !(zombie.potionSpeedLevel > 0) && !(zombie.potionToughnessLevel > 0)
      && zombie.hurting === 0 && !(zombie.glittering > 0) && !zombie.CarriedSporeShroom
      && !(zombie.chill > 0) && !(zombie.freeze > 0) && !zombie.iceblock
      && !zombie.iceblocked && !zombie.icebloom_block && zombie.TotalRGB === 0;
  }
  return Object.freeze({
    material(zombie, next, context) {
      stats.materialCalls++;
      const pass = zombie.material?.passes?.[0], block = pass?._rootBlock;
      // The exact engine layout is required; large/foreign buffers keep the original path.
      if (!neutral(zombie) || !(block instanceof ArrayBuffer) || !block.byteLength
          || block.byteLength > 4096 || block.byteLength % 4) {
        snapshots.delete(zombie);return next.call(context);
      }
      const previous = snapshots.get(zombie);
      if (previous?.pass === pass && previous.block === block && zombie.body?.db?.customMaterial === zombie.material) {
        let equal = true;
        for (let index=0;index<previous.words.length;index++) {
          if (previous.words[index] !== previous.saved[index]) {equal=false;break;}
        }
        // Check actual uniform bytes, not just remembered game flags: another mod
        // can write the pass directly, including through setUniformArray/resetUBOs.
        if (equal) {stats.materialSkips++;return undefined;}
      }
      const result = next.call(context);
      if (pass?._rootBlock === block) {
        const words = new Uint32Array(block);
        snapshots.set(zombie,{pass,block,words,saved:words.slice()});
      }
      return result;
    },
    color(zombie, next, context) {
      stats.colorCalls++;
      const color = zombie.body?.db?.color;
      const visible = !zombie.displayedStuck && (zombie.displayed || !zombie.hiddenWhenTooFar
        || zombie.worldPositionX <= 1200 && zombie.worldPositionX >= -200);
      if (visible && !zombie.dead && !zombie.iceblock && !zombie.icebloom_block
          && !(zombie.coloredWhenHypnotized && zombie.hypnotized)
          && color?.r===255 && color.g===255 && color.b===255 && color.a===255) {
        stats.colorSkips++;return undefined;
      }
      return next.call(context);
    },
    clear() {snapshots = new WeakMap();},
    get stats() {return {...stats};},
  });
}
const EXPECTED = {
  shouldMaterial:'e3ada15678cccd8c7cd155f495c6f66785a9ec3535282d14ad9d7ad4681e02e6',
  shouldColor:'f51a2dcb705ef85f53ff19c976a5f33fa47b6f52be69d0249e5e6635721bd193',
  additionalSatuation:'d4a340aa0f8375ff31ca3a453233b608786ef7e46633ec2ae36fe9dcac840921',
};
export async function installNeutralVisuals(Zombie, hooks, log) {
  const prototype=Zombie?.prototype;
  if (!prototype) return () => {};
  for (const [name, expected] of Object.entries(EXPECTED)) {
    if (typeof prototype[name] !== 'function') return () => {};
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(prototype[name].toString()));
    const hash=Array.from(new Uint8Array(bytes),value=>value.toString(16).padStart(2,'0')).join('');
    if(hash!==expected){log.warn('Neutral visual reuse skipped: game visual methods changed or another mod owns them.');return()=>{};}
  }
  const state=createNeutralVisualState(prototype.additionalSatuation), removers=[];
  try {
    for(const [methodName,key]of [['shouldMaterial','material'],['shouldColor','color']]) {
      removers.push(hooks.wrapMethod({target:prototype,methodName,handler:call=>state[key](call.thisArg,call.callNext,call)}));
    }
  } catch(error) {for(const remove of removers.reverse())remove();state.clear();throw error;}
  log.info('Neutral zombie visuals: unchanged shader buffers and white tints reused; effects retain upstream updates.');
  const dispose=()=>{for(const remove of removers.reverse())remove();state.clear();};
  Object.defineProperty(dispose,'stats',{get:()=>state.stats});
  return dispose;
}
