/** Find visual prefabs and sprite frames referenced by the game's resource
 * containers, including collectibles/effects that have no resources-path entry. */
export function discoverExtras(runtime,loadPrefab){
 if(runtime.extraPromise)return runtime.extraPromise;
 runtime.extraPromise=loadExtras(runtime,loadPrefab);
 return runtime.extraPromise;
}
async function loadExtras(runtime,loadPrefab){
 const {cc}=runtime,entries=[];runtime.extraAssets=new Map();
 for(const [name,category]of [['Droppings','collectibles'],['Particles','effects'],['Trophies','trophies'],['ZenGarden','garden']]){
  let container;
  try{
   container=await loadPrefab(runtime,`resouce_prefabs/${name}RP`);
   const seen=new WeakSet();
   function visit(value,parts,depth){
    if(!value||typeof value!=='object'||depth>5||seen.has(value))return;
    seen.add(value);
    if(value instanceof cc.Prefab||value instanceof cc.SpriteFrame){
     const key=name+'/'+parts.join('/');value.addRef();runtime.extraAssets.set(key,value);
     entries.push({kind:'misc',category,codename:parts.join('_'),name:parts.join(' · '),prefab:`resouce_prefabs/${name}RP`,embedded:key,armors:[],costumes:0});return;
    }
    if(value instanceof cc.Asset||value instanceof cc.Node)return;
    for(const [key,child]of Object.entries(value)){
     if(key.startsWith('_')||key==='node')continue;
     visit(child,[...parts,key],depth+1);
    }
   }
   container.data.getComponents(cc.Component).forEach((component,index)=>visit(component,[String(index)],0));
  }finally{if(container)cc.assetManager.releaseAsset(container);}
 }
 runtime.extraEntries=entries;return entries;
}
export async function resolveRenderSource(runtime,entry,loadPrefab){
 if(!entry.embedded)return {prefab:await loadPrefab(runtime,entry.prefab),synthetic:false};
 const asset=runtime.extraAssets.get(entry.embedded);
 if(asset instanceof runtime.cc.Prefab){asset.addRef();return {prefab:asset,embedded:true};}
 if(!(asset instanceof runtime.cc.SpriteFrame))throw Error('Embedded visual reference is unavailable');
 const node=new runtime.cc.Node(entry.codename);node.addComponent(runtime.cc.UITransform);
 node.addComponent(runtime.cc.Sprite).spriteFrame=asset;
 const prefab=new runtime.cc.Prefab();prefab.data=node;
 return {prefab,synthetic:true};
}
export function releaseRenderSource(runtime,source){
 if(!source)return;
 if(source.synthetic){source.prefab.data.destroy();source.prefab.destroy();}
 else if(source.embedded)source.prefab.decRef();
 else runtime.cc.assetManager.releaseAsset(source.prefab);
}
export function releaseExtras(runtime){
 for(const asset of runtime.extraAssets?.values()||[])asset.decRef();
 runtime.extraAssets?.clear();runtime.extraEntries=null;runtime.extraPromise=null;
}
