import {boot, assemble, disposeEntity, loadPrefab} from '/launcher/RenderExport.js';
import {RENDER_ENTRIES} from '/launcher/RenderCatalog.js';
import {installArmatureBatching} from '/__aurum/Rendering.js';
import {createJsModLoader} from '/gpnext/mods/JsModLoader.js';

async function run() {
  const runtime = await boot();
  const {cc, camera, target} = runtime;
  camera.targetTexture = null;
  target.reset({width:1920,height:1080});camera.targetTexture=target;camera.orthoHeight=540;
  const source = RENDER_ENTRIES.find(entry => entry.codename === 'tutorial');
  const prefab = await loadPrefab(runtime, source.prefab);
  const entities = [];
  const count = Number(new URL(location.href).searchParams.get('count') || 120);
  for (let index = 0; index < count; index++) {
    const entity = await assemble(runtime, prefab, source);
    entity.node.setPosition((index % 20 - 10) * 85, (Math.floor(index / 20) - count / 40) * 100);
    for (const {display} of entity.displays) {
      display.enableBatch = false;display.timeScale = 1;display.playAnimation('Idle',0);
    }
    entities.push(entity);
  }
  const manager = createJsModLoader()._hookManager;
  const hooks = {
    wrapMethod: options => manager.wrapMethod({owner:'fixture.rendering',...options}),
    wrapProperty: options => manager.wrapProperty({owner:'fixture.rendering',...options}),
  };
  const log = {info(){},warn(message){throw Error(message);}};
  function sample(frames) {
    return new Promise(resolve => {
      const work = [], intervals = [];let start, previous;
      const before = () => {start=performance.now();if(previous!==undefined)intervals.push(start-previous);previous=start;};
      const after = () => {
        work.push(performance.now()-start);
        if (work.length < frames) return;
        cc.director.off(cc.Director.EVENT_BEFORE_UPDATE,before);cc.director.off(cc.Director.EVENT_AFTER_DRAW,after);
        const summarize = values => {const sorted=[...values].sort((a,b)=>a-b);return {mean:values.reduce((sum,n)=>sum+n,0)/values.length,median:sorted[Math.floor(sorted.length/2)],p95:sorted[Math.floor(sorted.length*.95)]};};
        resolve({cpuMs:summarize(work),intervalMs:summarize(intervals),drawCalls:cc.profiler?._stats?.draws?.counter?.value??null});
      };
      cc.director.on(cc.Director.EVENT_BEFORE_UPDATE,before);cc.director.on(cc.Director.EVENT_AFTER_DRAW,after);
    });
  }
  const results=[];
  for(let round=0;round<3;round++){
    await sample(15);const baseline=await sample(60);
    const dispose=installArmatureBatching(cc,hooks,log);await sample(15);const batching=await sample(60);dispose();
    results.push({round,baseline,batching});
  }
  await fetch('/__result',{method:'POST',body:JSON.stringify({kind:'Actual Cocos animated zombie rendering in headless WebKit; no AI/audio/collisions; CPU update-to-draw time, not physical-display gameplay FPS',count,results})});
  for(const entity of entities)await disposeEntity(runtime,entity);
  cc.assetManager.releaseAsset(prefab);
  document.title='RESULT: PASS rendering benchmark';cc.game.pause();
}
run().catch(error=>{document.title='RESULT: FAIL '+String(error.stack||error);});
