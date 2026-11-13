import {build,transform} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
await build({entryPoints:['mods/aurum/src/Entry.js'],bundle:true,format:'esm',platform:'browser',target:'es2020',outfile:'mods/aurum/Aurum.js',minify:false,legalComments:'inline'});
const host=await build({entryPoints:['mods/aurum/src/HostEntry.js'],bundle:true,format:'esm',platform:'browser',target:'es2020',write:false,minify:false});
const printed=await transform(host.outputFiles[0].text,{loader:'js',format:'esm',target:'esnext',minify:false,legalComments:'inline'});
await writeFile('public/gpnext/runtime/AurumHost.js',printed.code);
console.log('Bundled Aurum alpha and opt-in host; not installed or enabled automatically.');

// A deterministic, self-contained package goes through the normal review/installer.
const {execFileSync}=await import('node:child_process');
execFileSync('python',['-c',`
from pathlib import Path
import zipfile
out=Path('public/builtin/Aurum.zip');out.parent.mkdir(parents=True,exist_ok=True)
with zipfile.ZipFile(out,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as archive:
    for name in ['Aurum.js','pack.json']:
        entry=zipfile.ZipInfo(name,(1980,1,1,0,0,0));entry.compress_type=zipfile.ZIP_DEFLATED
        entry.external_attr=0o100644 << 16
        archive.writestr(entry,(Path('mods/aurum')/name).read_bytes())
print('Packaged built-in Aurum for explicit installation; disabled until enabled by the user.')
`],{stdio:'inherit'});

const {createHash}=await import('node:crypto');
const pack=JSON.parse(await readFile('mods/aurum/pack.json','utf8'));
const digest=createHash('sha256').update('gp-next-pack-snapshot-v1\0');
for(const name of ['Aurum.js','pack.json']){
 const bytes=await readFile('mods/aurum/'+name),encoded=Buffer.from(name),header=Buffer.alloc(12);
 header.writeUInt32BE(encoded.length,0);header.writeBigUInt64BE(BigInt(bytes.length),4);
 digest.update(header).update(encoded).update(bytes);
}
await writeFile('public/launcher/AurumVersion.js',`// Generated from the bundled immutable Aurum package.\nexport const AURUM_VERSION=${JSON.stringify(pack.version)};\nexport const AURUM_CONTENT_DIGEST=${JSON.stringify(digest.digest('hex'))};\n`);
