/** Draw submission culling only. Animation, simulation, events and audio still run. */
const RENDER_HASH = '1832dc0be12dcd643d315b8e7177ea93847b9c446c4376afc231793dd739dbcc';
const VERTEX_HASHES = [{
  glsl3:'20a2e83c7b01595f9e606295f8cd91fc462927ceb56142d946ba82dedfb751df',
  glsl1:'8ce3b7a1af670f7f0e266cc198a7814fc5832b550cc8824f724c24a7eb523c7b',
},{glsl3:'635e58d9968ddf5cc0933108f067adeff8b511ccf17701ced29a9f53171160a0',glsl1:'1f63be8e90d81ea17e561d42578cd1e434b01ab490348158051da193be9a26d3'}];
const matrixKeys = Array.from({length:16}, (_, index) => 'm'+String(index).padStart(2,'0'));
async function hash(value) {
  const bytes = await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));
  return Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,'0')).join('');
}
export function inside(rect, point, margin = 0) {
  return point.x > rect.left+margin && point.x < rect.right-margin
    && point.y > rect.top+margin && point.y < rect.bottom-margin;
}
export function hiddenBounds(bounds, viewport, occluders) {
  if (![bounds.left,bounds.right,bounds.top,bounds.bottom].every(Number.isFinite)) return null;
  if (bounds.right < viewport.left-2 || bounds.left > viewport.right+2
      || bounds.bottom < viewport.top-2 || bounds.top > viewport.bottom+2) return 'offscreen';
  // Never combine overlapping rectangles: gaps and rounded corners stay visible.
  if (occluders.some(rect => inside(rect,{x:bounds.left,y:bounds.top},2)
      && inside(rect,{x:bounds.right,y:bounds.bottom},2))) return 'occluded';
  return null;
}
function opaqueWindows() {
  const rectangles = [];
  for (const element of document.querySelectorAll('dialog[open],#gp-overlay.gp-open')) {
    const style = getComputedStyle(element), color = style.backgroundColor;
    if (style.visibility !== 'visible' || style.display === 'none' || Number(style.opacity) !== 1
        || style.filter !== 'none' || style.mixBlendMode !== 'normal'
        || !/^rgb\([^,/]+,[^,/]+,[^,/]+\)$/.test(color) && !/^rgba\([^,/]+,[^,/]+,[^,/]+,\s*1\s*\)$/.test(color)) continue;
    let opaque = true;
    for (let parent = element.parentElement; parent; parent=parent.parentElement) {
      if (Number(getComputedStyle(parent).opacity)!==1) {opaque=false;break;}
    }
    if (!opaque) continue;
    const radius = Math.max(...['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'].map(key=>parseFloat(style[key])));
    if (!Number.isFinite(radius) || ['borderTopLeftRadius','borderTopRightRadius','borderBottomLeftRadius','borderBottomRightRadius'].some(key=>style[key].includes('%'))) continue;
    if (style.transform !== 'none') {
      const matrix = new DOMMatrixReadOnly(style.transform);
      if (!matrix.is2D || matrix.b !== 0 || matrix.c !== 0) continue;
    }
    const rect = element.getBoundingClientRect(), inset=Math.max(radius,4);
    if (rect.width > inset*2 && rect.height > inset*2) rectangles.push({left:rect.left+inset,right:rect.right-inset,top:rect.top+inset,bottom:rect.bottom-inset});
  }
  return rectangles;
}
function project(matrix, x, y, z, viewport, output) {
  const w=matrix.m03*x+matrix.m07*y+matrix.m11*z+matrix.m15;
  if (!Number.isFinite(w) || Math.abs(w-1)>1e-5) return null;
  const nx=matrix.m00*x+matrix.m04*y+matrix.m08*z+matrix.m12;
  const ny=matrix.m01*x+matrix.m05*y+matrix.m09*z+matrix.m13;
  output.x=viewport.left+(nx+1)*.5*(viewport.right-viewport.left);
  output.y=viewport.top+(1-ny)*.5*(viewport.bottom-viewport.top);
  return output;
}
export async function installOcclusion(cc, hooks, log, effect, {allowRenderTexture=false} = {}) {
  const prototype=cc?.dragonBones?.ArmatureDisplay?.prototype;
  if (typeof prototype?._render!=='function' || await hash(prototype._render.toString())!==RENDER_HASH) {
    log.warn('Draw culling skipped: unsupported or modified renderer.');return ()=>{};
  }
  const trustedEffects=new WeakMap(),examined=new WeakSet();
  async function trust(asset) {
    if (!asset || examined.has(asset)) return;
    examined.add(asset);
    if (asset.shaders?.length!==1) return;
    const shader=asset.shaders[0],glsl3=shader.glsl3?.vert,glsl1=shader.glsl1?.vert;
    const hashes={glsl3:await hash(glsl3||''),glsl1:await hash(glsl1||'')};
    if (VERTEX_HASHES.some(expected=>expected.glsl3===hashes.glsl3 && expected.glsl1===hashes.glsl1)) {
      trustedEffects.set(asset,{shader,glsl3,glsl1});
    }
  }
  const getEffect=typeof effect==='function'?effect:()=>effect;
  await trust(getEffect());
  await trust(cc.builtinResMgr?.get('default-spine-material')?.effectAsset);
  const stats={calls:0,offscreen:0,occluded:0,fallbacks:0};
  let cameras=[],occluders=[];
  const previous=new WeakMap();
  function prepare() {
    // Resources can finish loading after mod setup; verify each effect once.
    void trust(getEffect());
    void trust(cc.builtinResMgr?.get('default-spine-material')?.effectAsset);
    const canvas=cc.game?.canvas;
    if (!canvas) {cameras=[];return;}
    const rect=canvas.getBoundingClientRect();
    occluders=opaqueWindows();cameras=[];
    for (const scene of cc.director.root?.scenes||[]) for (const camera of scene.cameras||[]) {
      if (!camera.enabled || !allowRenderTexture && camera.window!==cc.director.root.mainWindow) continue;
      const matrix=camera.matViewProj,nodeMatrix=camera.node?.getWorldMatrix?.();
      const viewport=camera.viewport;
      if (!matrix || !nodeMatrix || !viewport) {cameras.push({camera,stable:false});continue;}
      const signature=[...matrixKeys.map(key=>matrix[key]),...matrixKeys.map(key=>nodeMatrix[key]),rect.left,rect.top,rect.width,rect.height,viewport.x,viewport.y,viewport.width,viewport.height];
      const last=previous.get(camera),stable=camera.projectionType===0 && !camera._isProjDirty
        && last?.length===signature.length && signature.every((value,index)=>Number.isFinite(value)&&value===last[index]);
      previous.set(camera,signature);
      cameras.push({camera,stable,matrix,viewport:{left:rect.left+viewport.x*rect.width,right:rect.left+(viewport.x+viewport.width)*rect.width,top:rect.top+(1-viewport.y-viewport.height)*rect.height,bottom:rect.top+(1-viewport.y)*rect.height}});
    }
  }
  function compatible(display) {
    const material=display.customMaterial||display.getSharedMaterial?.(0);
    const asset=material?.effectAsset,record=asset&&trustedEffects.get(asset);
    return !!record && asset.shaders?.length===1 && asset.shaders[0]===record.shader
      && record.shader.glsl3?.vert===record.glsl3 && record.shader.glsl1?.vert===record.glsl1
      && material.passes?.length>0 && material.passes.every(pass=>pass.defines
        && !pass.defines.USE_LOCAL && !pass.defines.USE_PIXEL_ALIGNMENT);
  }
  const pointBuffer={x:0,y:0};
  const remove=hooks.wrapMethod({target:prototype,methodName:'_render',handler(call) {
    stats.calls++;
    const display=call.thisArg,data=display.renderData,vertices=data?.chunk?.vb,count=data?.vertexCount,stride=data?.floatStride;
    if (!cameras.length || !compatible(display)
        || !vertices || stride!==9 || !count || count>8192 || count*stride>vertices.length || display.debugBones || Number.isFinite(display.stencilStage) && display.stencilStage!==0) {
      stats.fallbacks++;return call.callNext();
    }
    let reason='offscreen',relevant=false;
    for (const {camera,stable,matrix,viewport} of cameras) {
      if ((camera.visibility&display.node.layer)===0) continue;
      relevant=true;
      if (!stable) return call.callNext();
      const position=display.node.worldPosition,anchor=project(matrix,position.x,position.y,position.z,viewport,pointBuffer);
      // Ordinary visible actors take the cheap path: no per-vertex scan.
      if (!anchor || inside(viewport,anchor) && !occluders.some(rect=>inside(rect,anchor))) return call.callNext();
      const bounds={left:Infinity,right:-Infinity,top:Infinity,bottom:-Infinity};
      for (let index=0;index<count;index++) {
        const offset=index*stride,point=project(matrix,vertices[offset],vertices[offset+1],vertices[offset+2],viewport,pointBuffer);
        if (!point) return call.callNext();
        bounds.left=Math.min(bounds.left,point.x);bounds.right=Math.max(bounds.right,point.x);
        bounds.top=Math.min(bounds.top,point.y);bounds.bottom=Math.max(bounds.bottom,point.y);
      }
      const hidden=hiddenBounds(bounds,viewport,occluders);
      if (!hidden) return call.callNext();
      if (hidden==='occluded') reason=hidden;
    }
    if (!relevant) return call.callNext();
    stats[reason]++;return undefined;
  }});
  const event=cc.Director.EVENT_BEFORE_DRAW;
  cc.director.on(event,prepare);
  log.info('Draw culling active: current posed meshes outside cameras or fully covered by opaque windows; all simulation and animation retained.');
  const dispose=()=>{remove();cc.director.off(event,prepare);cameras=[];occluders=[];};
  Object.defineProperty(dispose,'stats',{get:()=>({...stats})});return dispose;
}
