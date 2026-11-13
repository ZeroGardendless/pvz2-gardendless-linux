import {createPreloadQueue} from './PreloadQueue.js';
import {startWithShortFade} from './FastSplash.js';
const resources=['Materials','Plants','Zombies','Dinosaurs','Music','Sounds','LevelNodes','Droppings','Trophies','Particles','WorldMaps','ZenGarden','Scenes'];

/** The public startup-registration phase runs before the first game scene.
 * Normal setup(ctx) runs too late to accelerate the splash scene.
 */
export function startup(ctx) {
  let dispose=()=>{},prepared;
  ctx.registrations.add('startup-performance',{
    prepare(){
      const cc=ctx.engine.getCc();
      if(!cc?.director||!cc.Director?.EVENT_BEFORE_SCENE_LAUNCH)throw Error('Aurum startup boundary is unavailable');
      const options=globalThis.__gardendlessAurumHost?.startupOptions || {};
      prepared={cc,options};
    },
    publish(){
      // Keep the engine reference captured during prepare; startup engine access
      // is intentionally closed after registration publication.
      const {cc,options}=prepared;
      const removers=[];let queue=null,installed=false;
      function swap(target,name,handler){
        const descriptor=Object.getOwnPropertyDescriptor(target,name),original=target[name];
        function wrapped(...args){return handler({thisArg:this,args,callNext:(...next)=>original.apply(this,next.length?next:args)});}
        Object.defineProperty(target,name,{configurable:true,enumerable:descriptor?.enumerable??false,writable:true,value:wrapped});
        const remove=()=>{if(target[name]===wrapped){if(descriptor)Object.defineProperty(target,name,descriptor);else delete target[name];}};
        removers.push(remove);return remove;
      }
      const hooks={wrapMethod:({target,methodName,handler})=>swap(target,methodName,handler)};
      function beforeScene(){
        if(installed)return;
        const prototype=cc.js.getClassByName('splashScene')?.prototype;
        if(typeof prototype?.start!=='function')return;
        installed=true;
        const removeStart=swap(prototype,'start',call=>{
          removeStart();cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LAUNCH,beforeScene);
          if(options.startupPrefetch){
            queue=createPreloadQueue(path=>new Promise((resolve,reject)=>cc.resources.preload(path,cc.Prefab,error=>error?reject(error):resolve())),{concurrency:options.prefetchConcurrency});
            for(const name of resources)void queue.add(`resouce_prefabs/${name}RP`);
          }
          globalThis.__gardendlessAurumHost?.reportStartup({phase:'splash-start',shortFade:false,prefetch:options.startupPrefetch});
          return options.fastSplash?startWithShortFade(call,cc,hooks,0.12,()=>globalThis.__gardendlessAurumHost?.reportStartup({phase:'splash-start',shortFade:true,prefetch:options.startupPrefetch})):call.callNext();
        });
      }
      cc.director.on(cc.Director.EVENT_BEFORE_SCENE_LAUNCH,beforeScene);
      beforeScene();
      dispose=()=>{cc.director.off(cc.Director.EVENT_BEFORE_SCENE_LAUNCH,beforeScene);queue?.cancel();for(const remove of removers.reverse())remove();};
    },
    dispose(){dispose();}
  });
  return ()=>dispose();
}
