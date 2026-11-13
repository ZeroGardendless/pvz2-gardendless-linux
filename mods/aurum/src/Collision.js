const EXPECTED_COLLISION = 'b9c9ee56aa908eb1383d0e5e07bd55204c2adaa3b47ef117162ecc6572643bd0';

/** Reject only strictly separated, nondegenerate axis-aligned rectangles.
 * Touching edges, rotations, zero coordinates and unusual shapes keep the
 * game's exact narrow phase, including its existing edge-case behavior.
 */
export function separatedAxisAligned(a, b) {
  if (!a || !b) return false;
  const p=a.point1,q=a.point2,r=a.point3,s=a.point4;
  const u=b.point1,v=b.point2,w=b.point3,x=b.point4;
  if (!p||!q||!r||!s||!u||!v||!w||!x) return false;
  if (!(p.y===q.y&&q.x===r.x&&r.y===s.y&&s.x===p.x&&u.y===v.y&&v.x===w.x&&w.y===x.y&&x.x===u.x)) return false;
  if (p.x===r.x||p.y===r.y||u.x===w.x||u.y===w.y) return false;
  return Math.max(p.x,r.x)<Math.min(u.x,w.x)||Math.max(u.x,w.x)<Math.min(p.x,r.x)
    ||Math.max(p.y,r.y)<Math.min(u.y,w.y)||Math.max(u.y,w.y)<Math.min(p.y,r.y);
}
export async function installCollisionBroadPhase(Rectangle, hooks, log) {
  const prototype=Rectangle?.prototype;
  if(typeof prototype?.judgeCrossRec!=='function')return()=>{};
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(prototype.judgeCrossRec.toString()));
  const hash=Array.from(new Uint8Array(bytes),value=>value.toString(16).padStart(2,'0')).join('');
  if(hash!==EXPECTED_COLLISION){log.warn('Collision broad phase skipped: game function changed or another mod owns it.');return()=>{};}
  const remove=hooks.wrapMethod({target:prototype,methodName:'judgeCrossRec',handler(call){
    if(separatedAxisAligned(call.thisArg,call.args[0]))return false;
    return call.callNext();
  }});
  log.info('Collision broad phase active; overlapping/rotated cases retain the original narrow phase.');
  return remove;
}
