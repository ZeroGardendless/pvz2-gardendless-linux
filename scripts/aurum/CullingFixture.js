import {boot,assemble,loadPrefab,disposeEntity} from '/launcher/RenderExport.js';
import {RENDER_ENTRIES} from '/launcher/RenderCatalog.js';
import {installOcclusion} from '/__aurum/Occlusion.js';

(async()=>{
  const runtime=await boot(),{cc,camera,target}=runtime;
  const frame=()=>new Promise(resolve=>cc.director.once(cc.Director.EVENT_AFTER_DRAW,resolve));
  const settle=async()=>{for(let i=0;i<5;i++)await frame();};
  const checksum=async()=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',target.readPixels())),byte=>byte.toString(16).padStart(2,'0')).join('');
  const hooks={wrapMethod({target,methodName,handler}){
    const original=target[methodName];target[methodName]=function(...args){return handler({thisArg:this,args,callNext:()=>original.apply(this,args)});};
    return()=>{target[methodName]=original;};
  }};
  const log={info(){},warn(message){throw Error(message);}};
  const entities=[];let cleanup;
  try{
    camera.targetTexture=null;target.reset({width:512,height:512});camera.targetTexture=target;
    camera.node.setPosition(0,0,1000);camera.orthoHeight=256;
    const entry=RENDER_ENTRIES.find(entry=>entry.codename==='tutorial'),prefab=await loadPrefab(runtime,entry.prefab);
    for(let index=0;index<24;index++){
      const entity=await assemble(runtime,prefab,entry);
      entity.node.setPosition(index===0?0:1000+index*50,0);
      for(const {display}of entity.displays){display.timeScale=0;display.armature().animation.gotoAndStopByProgress('Idle',0);display.armature().advanceTime(0);display.updateAnimation(0);}
      entities.push(entity);
    }
    entities[0].node.setSiblingIndex(99999);
    entities[7].node.setPosition(65,0);
    const materials=await loadPrefab(runtime,'resouce_prefabs/MaterialsRP');
    const effect=materials.data.getComponents(cc.Component).find(component=>component.addColorEffect).addColorEffect;
    const custom=new cc.Material();custom.initialize({effectAsset:effect,defines:{USE_TEXTURE:true}});
    const startCulling=()=>installOcclusion(cc,hooks,log,()=>effect,{allowRenderTexture:true});
    const cases=[];
    for(const mode of ['builtin','game-color-effect']) {
      for(const entity of entities)for(const {display}of entity.displays)display.customMaterial=mode==='builtin'?null:custom;
    for(const [name,x,scale]of [['center',0,1],['left-edge',-235,1],['right-edge',235,1],['mirrored',235,-1],['outside-left',-1000,1],['outside-right',1000,1]]){
      entities[0].node.setPosition(x,0);entities[0].node.setScale(scale,1,1);
      await settle();const baseline=await checksum();
      cleanup=await startCulling();await settle();
      const actual=await checksum();if(actual!==baseline)throw Error('Pixel oracle mismatch: '+name);
      const stats=cleanup.stats;if(!stats.offscreen)throw Error('Culling did not activate: '+JSON.stringify(stats));
      cleanup();cleanup=null;cases.push({mode,name,pixelIdentical:true,stats});
    }
    }
    entities[0].node.setPosition(0,0);entities[0].node.setScale(1,1,1);await settle();const visible=await checksum();
    cleanup=await startCulling();await settle();
    const bounds=cc.game.canvas.getBoundingClientRect(),dialog=document.createElement('dialog');
    Object.assign(dialog.style,{position:'fixed',left:(bounds.left-20)+'px',top:(bounds.top-20)+'px',width:(bounds.width+40)+'px',height:(bounds.height+40)+'px',maxWidth:'none',maxHeight:'none',margin:'0',padding:'0',border:'0',borderRadius:'0',background:'rgb(20,20,20)'});
    document.body.append(dialog);dialog.showModal();await settle();
    const covered=cleanup.stats;if(!covered.occluded)throw Error('Opaque-window culling did not activate: '+JSON.stringify(covered));
    dialog.style.background='rgba(20,20,20,.8)';await settle();if(await checksum()!==visible)throw Error('Translucent window must preserve all underlying pixels');
    dialog.close();dialog.remove();await settle();if(await checksum()!==visible)throw Error('Actors did not reappear after closing the opaque window');
    const result={kind:'Actual Cocos/WebKit render-texture pixel oracle; no gameplay FPS claim',cases,opaqueWindow:{culled:true,restoredPixelIdentically:true,stats:covered}};
    await fetch('/__result',{method:'POST',body:JSON.stringify(result)});
    document.title='RESULT: PASS draw culling pixel oracle, partial/mirrored meshes and opaque-window restoration';
  }catch(error){document.title='RESULT: FAIL '+error.stack;}
  finally{cleanup?.();for(const entity of entities)await disposeEntity(runtime,entity);cc.game.pause();}
})();
