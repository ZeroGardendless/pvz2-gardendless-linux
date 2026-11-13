/** Pure visual recipes, based on the bundled game classes; never run AI/saves/audio. */
export function describeStates(entity) {
  const names = entity.body?entity.body.display.getAnimationNames(entity.body.display.armatureName):['Static'];
  const slots = entity.body?entity.body.display.armature().getSlots().map(slot => slot.name):[];
  const states = [{id:'normal', label:'Normal'}];
  if (entity.kind === 'plants' && slots.some(name => name.includes('_DARK'))) states.push({id:'shadow',label:'Shadow-powered',shadow:true});
  if (entity.visual?.wallArmor) {
    for (let armor=0;armor<3;armor++) states.push({id:'plantfood-armor-'+armor,label:'Plant food armour · damage '+armor,armor});
  }
  if (slots.some(name => /SHELL[0-5]/.test(name))) {
    states.length=0;
    for (let shell=0;shell<6;shell++) for (const fooded of [false,true]) states.push({id:(fooded?'plantfood-':'')+'shell-'+shell,label:(fooded?'Plant food · ':'')+'Shell '+shell,shell,fooded});
  }
  if (entity.visual?.yeti) {
    for (const world of ['egypt','pirate','cowboy','future']) states.push({id:'costume-'+world,label:'Costume · '+world,yetiCostume:world});
    for(let damage=1;damage<4;damage++)states.push({id:'damage-'+damage,label:'Damage '+damage,yetiDamage:damage});
  }
  // All named animations are exported, including Food/FoodLoop, eating,
  // shooting, degradation, dying, transformations and creature-specific actions.
  return {states, animations:names};
}
export function applyVisualState(entity,item,state,costume) {
  const slots=item.display.armature().getSlots();
  for (const slot of slots) {
    const name=slot.name;
    if(entity.kind==='plants') {
      if(name.includes('_DARK'))slot.displayIndex=state.shadow?1:0;
      if(name.includes('COS'))slot.displayIndex=costume>=0&&name.includes('COS'+costume)?0:-1;
      if(entity.visual?.wallArmor&&name.includes('ARMOR'))slot.displayIndex=state.armor??-1;
      const shell=name.match(/SHELL([0-5])/);
      if(shell)slot.displayIndex=Number(shell[1])===(state.shell??0)?(state.fooded?1:0):-1;
    }
    if(entity.visual?.yeti) {
      const world=name.match(/COS_(egypt|pirate|cowboy|future)/);
      if(world)slot.displayIndex=world[1]===state.yetiCostume?0:-1;
      const damage=name.match(/_BP([1-3])/);
      if(damage)slot.displayIndex=(state.yetiDamage??0)>=Number(damage[1])?0:-1;
    }
  }
}
export function animationCategory(name) {
  if(name==='Static')return 'static';
  if(/idle|stand|wait/i.test(name))return 'idle';
  if(/food|pf|plantfood/i.test(name))return 'plantfood';
  if(/shoot|attack|eat|lob|bite|chomp|fire|throw/i.test(name))return 'attack';
  if(/death|die|dead|broken|degrad|damage|hurt/i.test(name))return 'damage';
  return 'actions';
}
export function poseSamples(animation,kind) {
  // Idle exports retain their original frame-zero contract. Action clips also
  // get mid/end poses, since their first frame often looks like idle or is blank.
  return ['idle','static'].includes(animationCategory(animation))?[0]:[0,.5,.95];
}
export function armorSlotOverrides(slots,armors){
 const rules=[];
 for(const [name,base]of [['HELMET_THERE_HEAD','kongfu_armor3'],['PUMPKIN_HEAD','halloween_armor3']]){
  if(slots.some(slot=>slot.name===name))rules.push([name,armors.some(armor=>armor.base===base)?0:-1]);
 }
 return rules;
}
