/** Rebuild a review candidate without replacing the user's overlay or build snapshot. */
import {cp,mkdir,readFile,readdir,rm,symlink,writeFile} from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import {execFileSync} from 'node:child_process';
import {build} from 'esbuild';
const root=process.cwd(), candidate=path.join(root,'src-tauri/target/aurum/candidate');
const stage='/home/zero/gardendless-reference/update-20261111/lite/gpnext-stage';
const baseline='/home/zero/gardendless-reference/update-20261111/before/public/gpnext';
await rm(candidate,{recursive:true,force:true});await mkdir(candidate,{recursive:true});
for(const name of ['public','scripts','mods','package.json','package-lock.json'])await cp(path.join(root,name),path.join(candidate,name),{recursive:true});
await cp(baseline,path.join(candidate,'public/gpnext'),{recursive:true});
await symlink(path.join(root,'node_modules'),path.join(candidate,'node_modules'));
await symlink(path.join(root,'src-tauri'),path.join(candidate,'src-tauri'));
async function files(dir,prefix='') {
 const result=[];for(const entry of await readdir(dir,{withFileTypes:true})) {
  const name=path.posix.join(prefix,entry.name);
  if(entry.isDirectory())result.push(...await files(path.join(dir,entry.name),name));else if(name.endsWith('.js'))result.push(name);
 }return result;
}
const copied=new Set();
for(const name of await files(stage)) {
 if(!name.startsWith('mods/')&&!name.startsWith('data/')&&!['core/BuildIdentity.js','core/ClientEdition.js','runtime/ColdStartHost.js','runtime/StartupAttemptHost.js','GameBootstrap.js','ui/Translations.js'].includes(name))continue;
 await cp(path.join(stage,name),path.join(candidate,'public/gpnext',name));copied.add(name);
}
const gpn=path.join(candidate,'public/gpnext');
// Aliases are version-specific. Preserve retained adapters' local variable names.
const aliases={a:'s',c:'u',i:'o',l:'a',n:'n',o:'c',r:'i',s:'l',t:'t',u:'d'};
for(const name of await files(gpn)) {
 if(copied.has(name))continue;
 const file=path.join(gpn,name);let text=await readFile(file,'utf8');
 const source=ts.createSourceFile(name,text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS),edits=[];
 for(const node of source.statements) {
  if(!ts.isImportDeclaration(node)||!node.moduleSpecifier.text.endsWith('GameBootstrap.js'))continue;
  const bindings=node.importClause?.namedBindings;if(!bindings||!ts.isNamedImports(bindings))continue;
  for(const item of bindings.elements) {
   const imported=(item.propertyName||item.name).text,next=aliases[imported];
   if(!next)throw Error(`Unknown legacy bootstrap alias ${imported}`);
   edits.push({start:item.getStart(source),end:item.end,text:next+' as '+item.name.text});
  }
 }
 for(const edit of edits.sort((a,b)=>b.start-a.start))text=text.slice(0,edit.start)+edit.text+text.slice(edit.end);
 if(name==='Main.js')text=text.replace(/(import\("\.\/GameBootstrap.js"\)\.then\(\(e4\) => e4\.)r\)/g,'$1i)');
 await writeFile(file,text);
}
async function edit(name,change){const file=path.join(gpn,name);await writeFile(file,change(await readFile(file,'utf8')));}
await edit('GameBootstrap.js',text=>{
 const source=ts.createSourceFile('Bootstrap.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 const audio=source.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='R');
 if(!audio?.getText(source).includes('window.audioEngine'))throw Error('Lite audio initializer changed; review before adapting.');
 text=text.slice(0,audio.getStart(source))+'async function R() { await initializeGameAudio(); }'+text.slice(audio.end);
 text=text.replace('configureEngine: (e3) => {','configureEngine: async (e3) => {\n await installCocosAudio(e3);');
 text=text.replace('beforeRun: async () => {','beforeRun: async (startupContext) => {').replace('await Z.beforeRun(),','await Z.beforeRun(startupContext),');
 text=text.replace('async beforeRun() {','async beforeRun({cc}) {\n applyFrameRate(cc.game, getSettings().frameRate);');
 const start=text.indexOf('_e(), v().then('),end=text.indexOf('\nexport {',start);
 if(start<0||end<0)throw Error('Lite bootstrap entry changed.');
 text=text.slice(0,start)+'if (typeof window !== "undefined" && typeof document !== "undefined" && document.getElementById("GameCanvas")) {\n'+text.slice(start,end)+'\n}\n'+text.slice(end);
 return 'import {installCocosAudio} from "./audio/CocosAudio.js";\nimport {initializeGameAudio} from "./audio/GameAudioBridge.js";\nimport {applyFrameRate} from "./runtime/FrameRate.js";\nimport {getSettings} from "./core/SettingsStore.js";\n'+text;
});
await edit('runtime/ColdStartHost.js',text=>text+'\nexport {t as preparePackageInstall} from "../mods/LocalPackSync.js";\n');
await edit('mods/FileLoader.js',text=>text+'\nexport {Ne as loadSettings, Pe as saveSettings};\n');
await edit('mods/ModSelection.js',text=>'import {readPackArtwork} from "./PackArtwork.js";\n'+text.replace('namespace: t(u3), pending:', 'thumbnailUrl: p2 ? "" : readPackArtwork(d3), capabilities: f2.capabilities, namespace: t(u3), pending:'));
const previousFresh=await readFile(path.join(baseline,'mods/FreshInstallation.js'),'utf8');
const source=ts.createSourceFile('Fresh.js',previousFresh,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
const fresh=source.statements.find(node=>ts.isFunctionDeclaration(node)&&node.name?.text==='initializeFreshPlatform');
if(!fresh)throw Error('Missing launcher-scoped fresh initialization adapter');
await edit('mods/FreshInstallation.js',text=>text.replace('readModSettings: s = r }) {','readModSettings: s = r, fs: scopedFs }) {\n if (scopedFs) return initializeScopedFresh({storage:i2,installStore:a,fs:scopedFs});')+'\nimport {f as scopedBaseDir,t as scopedExists} from "../platform/FileSystem.js";\nimport {t as createScopedState} from "./ModConfigurationState.js";\nimport {n as emptySnapshot} from "./PackSnapshot.js";\n'+fresh.getText(source).replace('initializeFreshPlatform','initializeScopedFresh').replace('exists: t','exists: scopedExists').replace('await r([])','await emptySnapshot([])').replace('f.AppData','scopedBaseDir.AppData').replace('n({ storage:', 'createScopedState({ storage:'));
execFileSync(process.execPath,['scripts/aurum/MergeTranslations.mjs',path.join(gpn,'ui/Translations.js')],{cwd:root,stdio:'inherit'});
await build({entryPoints:['mods/aurum/src/Host.js'],bundle:true,format:'esm',outfile:path.join(gpn,'runtime/AurumHost.js'),minify:false});
await edit('runtime/AurumHost.js',text=>text+'\nexport const aurumHost=createAurumHost();\nif(typeof window!=="undefined")Object.defineProperty(globalThis,"__gardendlessAurumHost",{value:aurumHost,configurable:true});\n');
await edit('mods/JsModLoader.js',text=>{
 const source=ts.createSourceFile('Loader.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);let body;
 function visit(node){if(ts.isMethodDeclaration(node)&&node.name.getText(source)==='_sortedHooks')body=node.body;ts.forEachChild(node,visit);}visit(source);
 if(!body)throw Error('Hook dispatcher changed');
 return 'import {aurumHost} from "../runtime/AurumHost.js";\n'+text.slice(0,body.getStart(source))+'{ return aurumHost.orderedHooks(e2,this._revision); }'+text.slice(body.end);
});
await writeFile(path.join(candidate,'scripts/checks/OverlaySmoke.html'),(await readFile(path.join(candidate,'scripts/checks/OverlaySmoke.html'),'utf8')).replaceAll('1.5.5','1.5.10'));
console.log('Candidate prepared:',candidate,'Latest core and original UI; no live overlay replaced.');
