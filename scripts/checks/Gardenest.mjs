import assert from 'node:assert/strict';
const files=new Map(),dirs=new Set();
const commands=[];
// Node provides Web Crypto for the real snapshot hashing.
const snapshotEntries=[['pack.json',new TextEncoder().encode(JSON.stringify({packFormatVersion:1,name:'Fixture',uuid:'fixture.mod',version:'1.0.0',description:'No scripts'}))]];
const payload=new TextEncoder().encode('fixture zip bytes');
const descriptor={protocolVersion:1,versionId:'12345678-abcd-1234-abcd-123456789abc',projectId:'prj_12345678-abcd-1234-abcd-123456789abc',type:'datapack',format:'zip',version:'1.0.0',name:'Fixture',byteLength:payload.length,sha256:Buffer.from(await crypto.subtle.digest('SHA-256',payload)).toString('hex')};
const meta=new TextEncoder().encode(JSON.stringify(descriptor));const envelope=new Uint8Array(meta.length+payload.length+4);new DataView(envelope.buffer).setUint32(0,meta.length,true);envelope.set(meta,4);envelope.set(payload,4+meta.length);
const invoke=async(cmd,args)=>{
 commands.push(cmd);
 if(cmd==='download_nest_import')return envelope.buffer;
 assert.equal(cmd,'launcher_gpnext_fs');const{op,path,target,data}=args;
 switch(op){
  case'exists':assert.ok(path === 'patches' || path === 'gp-next' || path.startsWith('gp-next/'));return files.has(path)||dirs.has(path);
  case'mkdir':{const segments=path.split('/');for(let i=1;i<=segments.length;i++)dirs.add(segments.slice(0,i).join('/'));return;}
  case'stat':if(!files.has(path)&&!dirs.has(path))throw Error('missing');return {isFile:files.has(path),isDirectory:dirs.has(path),isSymlink:false};
  case'writeText':files.set(path,data);return;
  case'readText':if(!files.has(path))throw Error('missing');return files.get(path);
  case'write':files.set(path,Buffer.from(data,'base64'));return;
  case'read':if(!files.has(path))throw Error('missing');return Buffer.from(files.get(path)).toString('base64');
  case'rename':if(files.has(path)){files.set(target,files.get(path));files.delete(path);}else{for(const[k,v]of [...files])if(k.startsWith(path+'/')){files.set(target+k.slice(path.length),v);files.delete(k);}for(const d of [...dirs])if(d===path||d.startsWith(path+'/')){dirs.add(target+d.slice(path.length));dirs.delete(d);}}return;
  case'readDir':{const list=new Map();for(const p of [...dirs,...files.keys()])if(p.startsWith(path+'/')){const tail=p.slice(path.length+1);if(!tail.includes('/'))list.set(tail,{name:tail,isDirectory:dirs.has(p),isFile:files.has(p)});}return [...list.values()];}
  case'remove':files.delete(path);dirs.delete(path);return;
 }
 throw Error(op);
};
globalThis.localStorage={getItem:()=>null,setItem(){}};globalThis.window={__TAURI_INTERNALS__:{invoke}};
globalThis.Worker=class {postMessage(){queueMicrotask(()=>this.onmessage({data:{entries:snapshotEntries}}));}terminate(){}};
const {prepareGardenestInstall,setPackageEnabled,installedOrigins,decodeImport,prepareLocalInstall}=await import('../../public/launcher/Gpnext.js');
const profile={id:'test',jsModding:false};
const install=await prepareGardenestInstall(profile,descriptor.versionId);
assert.equal(install.preview.name,'Fixture');await install.commit();
const state=JSON.parse(files.get('gp-next/configuration-state.json'));
assert.equal(state.desired.mods[0].enabled,false);assert.equal(state.desired.mods[0].id,'fixture.mod');
assert.equal((await installedOrigins('test'))['fixture.mod'].versionId,descriptor.versionId);
await setPackageEnabled(profile,'fixture.mod',true);
assert.equal(JSON.parse(files.get('gp-next/configuration-state.json')).desired.mods[0].enabled,true);
assert.equal(JSON.parse(files.get('gp-next/configuration-state.json')).active.configuration.mods.length,0,'launcher changes desired state; never pretends to run game mods');
files.set('gp-next/packs/local.zip',payload);
const local=await prepareLocalInstall(profile,'local.zip');
assert.equal(local.preview.name,'Fixture');await local.commit();
assert.equal(JSON.parse(files.get('gp-next/configuration-state.json')).desired.mods[0].enabled,false);
const tampered=envelope.slice();tampered[tampered.length-1]^=1;await assert.rejects(decodeImport(tampered.buffer,descriptor.versionId),/checksum/);
console.log('Passed canonical GP-Next launcher installation, immutable snapshot, disabled default, origin tracking, enable selection and checksum rejection.');
