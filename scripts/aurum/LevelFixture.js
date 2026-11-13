import {installNeutralVisuals} from '../../mods/aurum/src/NeutralVisuals.js';
import {beginHotspotSample,collectHotspotTargets} from '../../mods/aurum/src/Hotspots.js';
(async()=>{
  const report=value=>window.__TAURI_INTERNALS__.invoke('ui_log',{entries:[{level:'warn',message:'[Aurum level fixture] '+JSON.stringify(value)}]});
  const wait=async(predicate,label)=>{const deadline=performance.now()+90000;while(performance.now()<deadline){if(predicate())return;await new Promise(resolve=>setTimeout(resolve,100));}throw Error('Timed out: '+label);};
  try{
    await wait(()=>window.System&&window.cc?.director?.getScene()?.name==='mainScene','title');
    const cc=await window.System.import('cc');
    const get=async(name)=>window.System.import(`chunks:///_virtual/${name}.ts`);
    const {LevelPlay}=await get('levelController'),{KeyListener}=await get('KeyListener');
    const {zombies,ZombieEnum}=await get('Zombies'),{Square}=await get('Square');
    await LevelPlay.setLevelData(['modern16'],[]);
    await report({phase:'enter-level',name:'modern16'});
    await KeyListener.GoToGame([LevelPlay.levelData],true);
    await wait(()=>cc.director.getScene()?.name==='inGameScene'&&LevelPlay.component?.node?.isValid,'level scene');
    await new Promise(resolve=>setTimeout(resolve,5000));
    const npc=await get('NPC_Controller');
    await wait(()=>{
      if(npc.npc_controller?.HasFlow?.())npc.npc_controller.RunFlow();
      return !LevelPlay.component.isIntroNarrating && !npc.npc_controller?.HasFlow?.();
    },'intro dialogue completed');
    await new Promise(resolve=>setTimeout(resolve,1500));
    await wait(()=>{
      const objective=LevelPlay.component.levelObjectiveShower;
      if(objective?.node?.active){objective.continue();return false;}
      return true;
    },'level objectives dismissed');
    LevelPlay.component.gameStart();
    await window.electronAPI.setSize(1920,1080);
    await new Promise(resolve=>setTimeout(resolve,1000));
    await report({phase:'viewport',width:innerWidth,height:innerHeight,objectiveActive:!!LevelPlay.component.levelObjectiveShower?.node?.active});
    await new Promise(resolve=>setTimeout(resolve,3000));
    const {createJsModLoader}=await import(new URL('/gpnext/mods/JsModLoader.js',location.href).href);
    const manager=createJsModLoader()._hookManager;
    const hooks={wrapMethod:options=>manager.wrapMethod({owner:'fixture.level',...options})};
    const engine={getModuleExport:(module,name)=>window.System.get(module)?.[name]};
    const before=await globalThis.__gdAudio?.memorySnapshot?.();
    const spawned=[];
    for(let index=0;index<100;index++){
      const zombie=await zombies.spawnZombieFromLaneByID(index%5,ZombieEnum.tutorial);
      zombie.worldPositionX=Square.getSquareWorldPosition(index%5,7).x+(index%8)*8;
      spawned.push(zombie);
    }
    const {Zombie}=await get('Zombie');
    const hashes={};for(const name of ['shouldMaterial','shouldColor','additionalSatuation'])hashes[name]=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(Zombie.prototype[name].toString()))),v=>v.toString(16).padStart(2,'0')).join('');
    await report({phase:'uniform-hashes',hashes});
    const targets=collectHotspotTargets(engine,cc);
    for(const methodName of ['shouldMaterial','shouldColor','setBodyRec','setPlantDetectorRec','defaultDetectPlant','correctDepth','shouldScale'])targets.push({label:'Zombie.'+methodName,target:Zombie.prototype,methodName});
    async function sample(){
      const profilingHooks={wrapMethod:options=>manager.wrapMethod({owner:'fixture.profile',priority:100,...options})};
      const stop=beginHotspotSample(targets,profilingHooks),times=[];let started;
      const begin=()=>{started=performance.now();},end=()=>times.push(performance.now()-started);
      cc.director.on(cc.Director.EVENT_BEFORE_UPDATE,begin);cc.director.on(cc.Director.EVENT_AFTER_DRAW,end);
      await new Promise(resolve=>setTimeout(resolve,5000));
      cc.director.off(cc.Director.EVENT_BEFORE_UPDATE,begin);cc.director.off(cc.Director.EVENT_AFTER_DRAW,end);
      const profile=stop();times.sort((a,b)=>a-b);
      return {profile,frames:times.length,cpuMeanMs:times.reduce((sum,n)=>sum+n,0)/times.length,cpuP95Ms:times[Math.floor(times.length*.95)]};
    }
    if(hashes.shouldMaterial!=='e3ada15678cccd8c7cd155f495c6f66785a9ec3535282d14ad9d7ad4681e02e6'){
      const accepted=await sample();
      await report({phase:'level-acceptance',scene:cc.director.getScene().name,spawned:spawned.length,gaming:LevelPlay.gaming,accepted});return;
    }
    const materialOriginal=Zombie.prototype.shouldMaterial,colorOriginal=Zombie.prototype.shouldColor;
    const subject=spawned[0];
    async function oracle(){
      const restore={};
      const changes=[{}, {hurting:20},{chill:1},{freeze:1},{haveSun:2},{warningCD:1},{havePlantfood:true},{CarriedSporeShroom:true},{TotalRGB:.25},{_hypnotized:true},{displayedStuck:true}];
      for(const change of changes){
        for(const key of Object.keys(change)){restore[key]=subject[key];subject[key]=change[key];}
        try {
          materialOriginal.call(subject);colorOriginal.call(subject);
          const expected=Array.from(new Uint8Array(subject.material.passes[0]._rootBlock));
          const expectedColor=['r','g','b','a'].map(key=>subject.body.db.color[key]);
          subject.shouldMaterial();subject.shouldColor();
          const actual=Array.from(new Uint8Array(subject.material.passes[0]._rootBlock));
          if(JSON.stringify(actual)!==JSON.stringify(expected))throw Error('Material oracle mismatch '+JSON.stringify(change));
          if(JSON.stringify(['r','g','b','a'].map(key=>subject.body.db.color[key]))!==JSON.stringify(expectedColor))throw Error('Color oracle mismatch '+JSON.stringify(change));
        }finally{for(const key of Object.keys(change))subject[key]=restore[key];}
      }
      materialOriginal.call(subject);colorOriginal.call(subject);
      return changes.length;
    }
    await new Promise(resolve=>setTimeout(resolve,3000));
    const rounds=[];
    for(let round=0;round<3;round++){
      const baseline=await sample();
      const dispose=await installNeutralVisuals(Zombie,hooks,{info(){},warn:message=>{throw Error(message);}});
      const oracleCases=await oracle();
      const optimized=await sample();
      const stats=dispose.stats;dispose();
      rounds.push({round,baseline,optimized,stats,oracleCases});
    }
    await report({phase:'level-profile',scene:cc.director.getScene().name,spawned:spawned.length,gaming:LevelPlay.gaming,rounds,audioBefore:before,audioAfter:await globalThis.__gdAudio?.memorySnapshot?.()});
  }catch(error){await report({phase:'FAIL',error:String(error.stack||error)});}
})();
