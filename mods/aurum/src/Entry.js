import {installOcclusion} from './Occlusion.js';
import {installNeutralVisuals} from './NeutralVisuals.js';
import {beginHotspotSample,collectHotspotTargets} from './Hotspots.js';
import {installDataLookup} from './DataLookup.js';
import {installCollisionBroadPhase} from './Collision.js';
import {installArmatureBatching} from './Rendering.js';
import {startup} from './Startup.js';
export {startup};
export async function setup(ctx) {
  await ctx.settings.defineSchema({title:'Aurum',schemaVersion:1,description:'Rendering, startup and bounded diagnostics. Compare performance on your own levels.',fields:[
    {key:'occlusionCulling',type:'toggle',label:'Cull fully hidden draw calls (next launch)',default:true},
    {key:'neutralVisuals',type:'toggle',label:'Reuse unchanged zombie shader state (next launch)',default:true},
    {key:'dataLookup',type:'toggle',label:'Reuse parsed object references (next launch)',default:true},
    {key:'collisionBroadPhase',type:'toggle',label:'Reject distant collision pairs early (next launch)',default:true},
    {key:'armatureBatching',type:'toggle',label:'Batch skeletal draw calls (next launch)',default:true},
    {key:'hookCache',type:'toggle',label:'Cache GP-Next hook ordering',default:true},
    {key:'fastSplash',type:'toggle',label:'Short startup fade (next launch)',default:true},
    {key:'startupPrefetch',type:'toggle',label:'Experimental startup prefetch (next launch)',default:false},
    {key:'prefetchConcurrency',type:'number',label:'Maximum simultaneous prefetches',default:2,min:1,max:4,step:1}
  ]});
  let settings=await ctx.settings.getAll(), closed=false, stopSample=null, stopHotspots=null;
  const hostSession = globalThis.__gardendlessAurumHost?.createSession();
  hostSession?.configure({enabled:true,hookCache:settings.hookCache});
  ctx.settings.onChange(async()=>{const next=await ctx.settings.getAll();if(!closed){settings=next;hostSession?.configure({enabled:true,hookCache:settings.hookCache});}});
  const engine=ctx.unsafe.engine, cc=engine.getCc();
  const Rectangle=engine.getModuleExport?.('chunks:///_virtual/CharacterManager.ts','Rectangle');
  const ObjectType=engine.getModuleExport?.('chunks:///_virtual/JSONs.ts','PvZ2Object');
  const containers=engine.getModuleExport?.('chunks:///_virtual/JSONs.ts','PvZ2ObjectContainer');
  const disposeData=settings.dataLookup!==false ? await installDataLookup(ObjectType,containers,ctx.unsafe.hooks,ctx.log) : () => {};
  const disposeCollisions=settings.collisionBroadPhase ? await installCollisionBroadPhase(Rectangle,ctx.unsafe.hooks,ctx.log) : () => {};
  const Zombie=engine.getModuleExport?.('chunks:///_virtual/Zombie.ts','Zombie');
  const disposeVisuals=settings.neutralVisuals!==false ? await installNeutralVisuals(Zombie,ctx.unsafe.hooks,ctx.log) : () => {};
  const disposeOcclusion=settings.occlusionCulling!==false ? await installOcclusion(cc,ctx.unsafe.hooks,ctx.log,()=>engine.getModuleExport?.('chunks:///_virtual/Materials.ts','materialRes')?.addColorEffect) : () => {};
  const disposeRendering = settings.armatureBatching ? installArmatureBatching(cc,ctx.unsafe.hooks,ctx.log) : () => {};
  ctx.log.info('Aurum active: '+JSON.stringify({hookCache:settings.hookCache,fastSplash:settings.fastSplash,armatureBatching:settings.armatureBatching,neutralVisuals:!!disposeVisuals.stats}));
  function sample(){
    if(closed||stopSample)return;
    const director=cc?.director,before=cc?.Director?.EVENT_BEFORE_UPDATE,after=cc?.Director?.EVENT_AFTER_DRAW;
    if(!director||!before||!after){ctx.ui.toast('Frame timing unavailable in this engine.','warning');return;}
    const values=new Float64Array(2048);let count=0,total=0,max=0,start=null;
    const begin=()=>{start=performance.now();};
    const end=()=>{if(start===null)return;const elapsed=performance.now()-start;start=null;values[count%values.length]=elapsed;count++;total+=elapsed;max=Math.max(max,elapsed);};
    director.on(before,begin);director.on(after,end);
    stopSample=()=>{
      director.off(before,begin);director.off(after,end);stopSample=null;
      if(closed)return;
      const sorted=Array.from(values.subarray(0,Math.min(count,values.length))).sort((a,b)=>a-b);
      const report={kind:'CPU update-to-after-draw duration; not GPU time or presentation FPS',frames:count,meanMs:count?total/count:0,maxMs:max,retainedSamples:sorted.length,p95Ms:sorted.length?sorted[Math.floor((sorted.length-1)*0.95)]:0};
      ctx.log.info(JSON.stringify(report));ctx.ui.toast('Aurum sample saved to GP-Next logs.','success');
    };
    ctx.runtime.setTimeout(stopSample,30000);
    ctx.ui.toast('Aurum: sampling CPU frame work for 30 seconds.','info');
  }
  function sampleHotspots(){
    if(closed||stopHotspots)return;
    try {
      const finish=beginHotspotSample(collectHotspotTargets(engine,cc),ctx.unsafe.hooks);
      stopHotspots=()=>{stopHotspots=null;const report=finish();if(!closed){ctx.log.info(JSON.stringify(report));ctx.ui.toast('CPU hotspot sample saved to GP-Next logs.','success');}};
      ctx.runtime.setTimeout(()=>stopHotspots?.(),10000);
      ctx.ui.toast('Sampling CPU hotspots for 10 seconds. Profiling briefly adds CPU work.','info');
    }catch(error){ctx.log.warn('CPU hotspot sample unavailable: '+String(error?.message||error));}
  }
  async function memorySnapshot(){
    try {
      const audio=await globalThis.__gdAudio?.memorySnapshot?.();
      const assets=Object.values(cc?.assetManager?.assets?._map || {});
      const textures=typeof cc?.Texture2D==='function'?assets.filter(asset=>asset instanceof cc.Texture2D):[];
      const report={drawCulling:disposeOcclusion.stats||{active:false},zombieVisuals:disposeVisuals.stats||{active:false},audio:audio||{backend:'browser fallback'},cocosAssets:assets.length,textures:textures.length,estimatedUncompressedTextureRGBABytes:textures.reduce((total,texture)=>total+texture.width*texture.height*4,0),note:'Texture bytes are a format-agnostic estimate; audio cache excludes live voice memory. This is not process RSS.'};
      ctx.log.info(JSON.stringify(report));ctx.ui.toast('Memory snapshot saved to GP-Next logs.','success');
    }catch(error){ctx.log.warn('Memory snapshot unavailable: '+String(error?.message||error));}
  }
  ctx.controls.definePanel({title:'Aurum',groups:[{title:'Diagnostics',items:[{key:'sample',type:'action',label:'Sample CPU frame work (30 seconds)',onClick:sample},{key:'memory',type:'action',label:'Memory snapshot',onClick:memorySnapshot},{key:'hotspots',type:'action',label:'Sample CPU hotspots (10 seconds)',onClick:sampleHotspots}]}]});
  return ()=>{closed=true;disposeOcclusion();disposeVisuals();disposeData();disposeCollisions();disposeRendering();hostSession?.dispose();stopSample?.();stopHotspots?.();};
}
export default {setup,startup};
