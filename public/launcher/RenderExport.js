import {discoverExtras,resolveRenderSource,releaseRenderSource,releaseExtras} from './RenderExtras.js';
import {installAssetRevision} from '../gpnext/runtime/AssetCache.js';
import {describeStates,applyVisualState,animationCategory,poseSamples,armorSlotOverrides} from './RenderStates.js';
import { installCocosAudio } from '../gpnext/audio/CocosAudio.js';
import { RENDER_ENTRIES, RENDER_ARMORS } from './RenderCatalog.js';
const status = document.querySelector('#status'), progress = document.querySelector('#progress'), details = document.querySelector('#details');
const invoke = (command, args = {}) => window.__TAURI_INTERNALS__.invoke(command, args);
let cancelled = false;
document.querySelector('#cancel').onclick = () => { cancelled = true; window.__TAURI__.window.getCurrentWindow().close(); };
const segment = value => encodeURIComponent(String(value)).replaceAll('.', '%2E');
const frame = cc => new Promise(resolve => cc.director.once(cc.Director.EVENT_AFTER_DRAW, resolve));
async function boot() {
    const cc = await window.System.import('cc');
    installAssetRevision(cc);
    // Lite resource metadata encodes AVIF as format index 8.
    for (const values of [cc.macro.SUPPORT_TEXTURE_FORMATS, cc.ImageAsset.extnames])
        if (!values.includes('.avif'))
            values.push('.avif');
    if (cc.ImageAsset.extnames.indexOf('.avif') !== 8)
        throw Error('Unsupported Lite image format table');
    for (const [owner, table] of [[cc.assetManager.downloader, '_downloaders'], [cc.assetManager.factory, '_producers'], [cc.assetManager.parser, '_parsers']])
        owner.register('.avif', owner[table]['.webp']);
    class SilentPlayer {
        constructor() { this.duration = 0; this.sampleRate = 48000; this.type = 1; this.state = 0; this.currentTime = 0; }
        on() { }
        off() { }
        onInterruptionBegin() { }
        offInterruptionBegin() { }
        onInterruptionEnd() { }
        offInterruptionEnd() { }
        onEnded() { }
        offEnded() { }
        destroy() { }
        getPCMData() { }
        async play() { }
        async pause() { }
        async stop() { }
        async seek() { }
    }
    await installCocosAudio(cc, { __gdAudio: { bindGame() { }, async load() { return new SilentPlayer(); }, async loadNative() { return document.createElement('audio'); }, async loadOneShotAudio() { return { play() { }, stop() { } }; } } });
    await cc.game.init({ debugMode: cc.DebugMode.ERROR, settingsPath: 'src/settings.json', overrideSettings: { launch: { launchScene: '' }, screen: { designResolution: { width: 512, height: 512, policy: 4 } }, profiling: { showFPS: false } } });
    await cc.game.run();
    const scene = new cc.Scene('IdleRenderExport');
    const cameraNode = new cc.Node('ExportCamera');
    scene.addChild(cameraNode);
    cameraNode.setPosition(0, 0, 1000);
    const camera = cameraNode.addComponent(cc.Camera);
    camera.projection = cc.Camera.ProjectionType.ORTHO;
    camera.orthoHeight = 256;
    camera.near = 0.1;
    camera.far = 2000;
    camera.visibility = cc.Layers.Enum.UI_2D;
    camera.clearFlags = cc.Camera.ClearFlag.SOLID_COLOR;
    camera.clearColor = new cc.Color(0, 0, 0, 0);
    const target = new cc.RenderTexture();
    target.reset({ width: 512, height: 512 });
    camera.targetTexture = target;
    const canvasNode = new cc.Node('ExportCanvas');
    canvasNode.layer = cc.Layers.Enum.UI_2D;
    scene.addChild(canvasNode);
    canvasNode.addComponent(cc.UITransform).setContentSize(512, 512);
    const canvas = canvasNode.addComponent(cc.Canvas);
    canvas.alignCanvasWithScreen = false;
    canvas.cameraComponent = camera;
    cc.director.runSceneImmediate(scene);
    const bundle = cc.assetManager.getBundle('resources') || await new Promise((resolve, reject) => cc.assetManager.loadBundle('resources', (error, bundle) => error ? reject(error) : resolve(bundle)));
    return { cc, scene, canvasNode, camera, target, bundle };
}
// Copy only visual components: gameplay lifecycle methods must not run in the exporter.
function copyVisualTree(cc, source, map, displays, activeOverrides = new Map(), sprites = []) {
    const node = new cc.Node(source.name);
    map.set(source, node);
    node.layer = cc.Layers.Enum.UI_2D;
    node.active = activeOverrides.get(source) ?? source.active;
    node.setPosition(source.position);
    node.setRotation(source.rotation);
    node.setScale(source.scale);
    const transform = source.getComponent(cc.UITransform);
    if (transform) {
        const copy = node.addComponent(cc.UITransform);
        copy.setContentSize(transform.contentSize);
        copy.setAnchorPoint(transform.anchorPoint);
    }
    if (node.active) {
        const spriteSource=source.getComponent(cc.Sprite);
        if(spriteSource?.spriteFrame&&spriteSource.enabled!==false){
            const sprite=node.addComponent(cc.Sprite);sprite.spriteFrame=spriteSource.spriteFrame;
            sprite.type=spriteSource.type;sprite.sizeMode=cc.Sprite.SizeMode.CUSTOM;sprite.color=spriteSource.color;
            if(transform)node.getComponent(cc.UITransform).setContentSize(transform.contentSize);
            sprites.push(sprite);
        }
        const original = source.getComponent(cc.dragonBones.ArmatureDisplay);
        if (original?.dragonAsset) {
            const display = node.addComponent(cc.dragonBones.ArmatureDisplay);
            display.dragonAtlasAsset = original.dragonAtlasAsset;
            display.dragonAsset = original.dragonAsset;
            display.armatureName = original.armatureName;
            display.enableBatch = true;
            display.timeScale = 0;
            displays.push({ original, display, intactBody: source.getComponents(cc.Component).some(component => typeof component.showArm === 'function') });
        }
        for (const child of source.children)
            node.addChild(copyVisualTree(cc, child, map, displays, activeOverrides, sprites));
    }
    return node;
}
function bindSockets(map, displays) {
    for (const { original, display } of displays)
        display.sockets = (original.sockets || []).filter(socket => map.has(socket.target)).map(socket => ({ path: socket.path, target: map.get(socket.target) }));
}
async function loadPrefab(runtime, path) { return new Promise((resolve, reject) => runtime.bundle.load(path, runtime.cc.Prefab, (error, value) => error ? reject(error) : resolve(value))); }
async function assemble(runtime, prefab, entry, effects = {}) {
    const { cc } = runtime, map = new Map(), displays = [], assets = [], sprites = [];
    const components=prefab.data.getComponents(cc.Component);
    const component = components.find(value => typeof value.armorParent === 'function');
    const plant=components.find(value=>typeof value.specialPlantFood==='function');
    const activeOverrides = new Map([[prefab.data,true]]);
    const hasArmor = base => entry.armors.some(armor => armor.base === base);
    // Match the visual-only rules in the bundled zombie classes. No AI or save code runs.
    if (typeof component?.judgeShoulder==='function' && component?.shoulder?.node) {
        activeOverrides.set(component.shoulder.node, hasArmor('dark_armor3'));
    }
    if (component?.butterFace?.node) activeOverrides.set(component.butterFace.node, !!effects.butter);
    const controller = prefab.data.getComponents(cc.Component).find(value => typeof value.switchCostume === 'function');
    const node = copyVisualTree(cc, prefab.data, map, displays, activeOverrides, sprites);
    node.active = true;
    try {
        bindSockets(map, displays);
        const body = displays.find(item => item.original.node.name === 'Body') || displays[0];
        if(!body&&entry.kind!=='misc')throw Error('Prefab has no active body armature');
        if(!body&&!sprites.length)throw Error('Prefab has no active renderable visuals');
        for (const property of ['Vineback', 'PotFront', 'PlantUpper']) {
            const asset = controller?.[property];
            if (!asset) continue;
            const partMap = new Map(), partDisplays = [];
            const part = copyVisualTree(cc, asset.data, partMap, partDisplays,new Map([[asset.data,true]]),sprites);
            part.active = true;node.addChild(part);
            part.setPosition(body.display.node.position);part.setRotation(body.display.node.rotation);part.setScale(body.display.node.scale);
            if (property === 'Vineback') part.setSiblingIndex(0);
            bindSockets(partMap, partDisplays);displays.push(...partDisplays);
        }
        const butter = displays.find(item => item.original === component?.butterFace);
        if (butter) butter.animation = butter.display.getAnimationNames(butter.display.armatureName).find(name => /idle/i.test(name));
        for (const armor of entry.armors || []) {
            const asset = await loadPrefab(runtime, armor.prefab);
            assets.push(asset);
            const armorMap = new Map(), armorDisplays = [];
            const attachment = copyVisualTree(cc, asset.data, armorMap, armorDisplays,new Map([[asset.data,true]]),sprites);
            attachment.active = true;
            let socket;
            try {
                socket = map.get(component?.armorParent(armor.index));
            }
            catch { }
            socket ||= [...map.values()].find(value => value.name === 'ArmorSocket');
            if (!socket)
                throw Error('Missing armour attachment socket: ' + armor.id);
            socket.addChild(attachment);
            bindSockets(armorMap, armorDisplays);
            for (const item of armorDisplays) {
                item.animation = armor.animation;
                displays.push(item);
            }
        }
        const slots = [];
        if (entry.prefab.endsWith('/CowboyBasicZOMBIE')) slots.push(['hat_HEAD', entry.armors.length ? -1 : 0]);
        slots.push(...armorSlotOverrides(body?.display.armature()?.getSlots()||[],entry.armors));
        const shoulder = displays.find(item => item.original === component?.shoulder);
        if (shoulder) shoulder.animation = '0';
        if(body)body.slots = slots;
        runtime.canvasNode.addChild(node);
        return { node, displays, body, assets, sprites, kind: entry.kind, effects, visual:{wallArmor:typeof plant?.setArmor==='function'&&Array.isArray(plant.ArmorSlots),yeti:!!component&&'CosSlots_Egypt' in component},startHide: controller?.startHideSlotName || [] };
    }
    catch (error) {
        node.destroy();
        for (const asset of assets)
            cc.assetManager.releaseAsset(asset);
        throw error;
    }
}
async function renderOne(runtime, entity, animation, costume = -1, options = {}) {
    const state=options.state||{},progressValue=options.progress||0;
    const { cc, camera, target } = runtime;
    for (const item of entity.displays) {
        const display = item.display, armature = display.armature();
        if (!armature)
            throw Error('Skeleton/atlas could not build ' + display.armatureName);
        const names = display.getAnimationNames(display.armatureName);
        const pose = item.animation || (names.includes(animation) ? animation : names.find(name => /^idle$/i.test(name)) || names.find(name => /idle/i.test(name)) || names[0]);
        if (!pose || !names.includes(pose))
            throw Error('Missing required pose ' + pose + ' on ' + display.armatureName);
        armature.animation.gotoAndStopByProgress(pose, progressValue);
        armature.advanceTime(0);
        if (item.intactBody && !/death|die|burn|ash/i.test(animation)) {
            // BodyGrouper.showArm(true)/showHead(true): healthy hands cover the severed-arm stubs.
            for (const slot of armature.getSlots()) {
                if (slot.name.includes('_HEAD') || slot.name.includes('_HAND')) slot.displayIndex = 0;
                else if (slot.name.includes('_ARM')) slot.displayIndex = -1;
            }
        }
        if (entity.kind === 'plants') {
            for (const slot of armature.getSlots()) {
                if (slot.name.includes('COS')) slot.displayIndex = costume >= 0 && slot.name.includes('COS' + costume) ? 0 : -1;
                else if (item === entity.body && entity.startHide.includes(slot.name) && !armature.animation.animations?.[pose]?.slotTimelines?.[slot.name]) slot.displayIndex = -1;
            }
        } else {
            for (const slot of armature.getSlots()) if (slot.name.includes('POISONFACE')) slot.displayIndex = entity.effects.poison ? 0 : -1;
        }
        for (const [name, index] of item.slots || []) {
            const slot = armature.getSlot(name);
            if (!slot) throw Error('Missing required appearance slot ' + name);
            slot.displayIndex = index;
        }
        applyVisualState(entity,item,state,costume);
        display.updateAnimation(0);
    }
    await frame(cc);
    await frame(cc);
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const display of [...entity.displays.map(item=>item.display),...entity.sprites]) {
        const data = display.renderData, vertices = data?.chunk?.vb, stride = data?.floatStride, count = data?.vertexCount;
        if (!vertices || !stride || !count)
            continue;
        for (let i = 0; i < count; i++) {
            const x = vertices[i * stride], y = vertices[i * stride + 1];
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        }
    }
    if (!Number.isFinite(minX + minY + maxX + maxY) || maxX <= minX || maxY <= minY)
        throw Error('Invalid posed mesh bounds');
    const width = maxX - minX, height = maxY - minY;
    const scale = Math.min(options.scale||4, 4096 / (Math.max(width, height) + 16));
    const outputWidth = Math.max(1, Math.ceil((width + 16) * scale)), outputHeight = Math.max(1, Math.ceil((height + 16) * scale));
    camera.targetTexture = null;
    target.reset({ width: outputWidth, height: outputHeight });
    camera.targetTexture = target;
    cameraNodePosition(camera.node, (minX + maxX) / 2, (minY + maxY) / 2);
    camera.orthoHeight = outputHeight / (2 * scale);
    await frame(cc);
    await frame(cc);
    const pixels = target.readPixels();
    if (!pixels)
        throw Error('GPU readback failed');
    const canvas = document.createElement('canvas');
    canvas.width = outputWidth;
    canvas.height = outputHeight;
    const context = canvas.getContext('2d'), image = context.createImageData(outputWidth, outputHeight);
    let visible = 0;
    for (let y = 0; y < outputHeight; y++)
        for (let x = 0; x < outputWidth; x++) {
            const src = ((outputHeight - 1 - y) * outputWidth + x) * 4, dst = (y * outputWidth + x) * 4, a = pixels[src + 3];
            image.data[dst + 3] = a;
            if (a)
                visible++;
            for (let c = 0; c < 3; c++)
                image.data[dst + c] = a ? Math.min(255, Math.round(pixels[src + c] * 255 / a)) : 0;
        }
    if (!visible)
        throw Error('Rendered PNG is fully transparent');
    context.putImageData(image, 0, 0);
    document.querySelector('#preview').src = canvas.toDataURL('image/png');
    return { renderScale:scale,base64: canvas.toDataURL('image/png').split(',')[1], bounds: { minX, minY, maxX, maxY }, width: outputWidth, height: outputHeight, pixels: visible };
}
function cameraNodePosition(node, x, y) { node.setPosition(x, y, 1000); }
async function disposeEntity(runtime, entity, prefab) {
    if (entity) {
        entity.node.destroy();await frame(runtime.cc);
        for (const asset of entity.assets) runtime.cc.assetManager.releaseAsset(asset);
    }
    if (prefab) runtime.cc.assetManager.releaseAsset(prefab);
}
function option(value, label) { const node = document.createElement('option');node.value = value;node.textContent = label;return node; }
async function generator(runtime) {
    const panel=document.querySelector('#generator');panel.hidden=false;progress.hidden=true;
    const kind=document.querySelector('#render-kind'),character=document.querySelector('#zombie'),armor=document.querySelector('#armor'),animation=document.querySelector('#animation');
    const form=document.querySelector('#render-state'),costume=document.querySelector('#render-costume'),position=document.querySelector('#render-progress'),scale=document.querySelector('#render-scale');
    const preview=document.querySelector('#render-preview'),save=document.querySelector('#save-render'),butter=document.querySelector('#butter'),poison=document.querySelector('#poison');
    armor.append(option('starting','Starting armour'),option('none','No armour'));
    RENDER_ARMORS.forEach((item,index)=>armor.append(option(String(index),item.name)));
    let catalog=[...RENDER_ENTRIES],extraCatalog;
    const entryKey=entry=>JSON.stringify([entry.kind,entry.codename,entry.prefab,entry.embedded]);
    async function filter(){
        if(kind.value==='misc'){
            status.textContent='Loading collectible and effect previews…';
            extraCatalog ||= discoverExtras(runtime,loadPrefab).then(entries=>{catalog.push(...entries);});
            await extraCatalog;
        }
        const selected=character.value,query=document.querySelector('#zombie-search').value.toLowerCase().trim();
        character.replaceChildren(...catalog.filter(entry=>entry.kind===kind.value&&(entry.name+' '+entry.codename+' '+(entry.category||'')).toLowerCase().includes(query)).map(entry=>option(entryKey(entry),entry.name+' · '+entry.codename)));
        if([...character.options].some(item=>item.value===selected))character.value=selected;
        armor.closest('label').hidden=kind.value!=='zombies';butter.closest('label').hidden=poison.closest('label').hidden=kind.value!=='zombies';
        costume.closest('label').hidden=kind.value!=='plants';save.disabled=true;
    }
    await filter();document.querySelector('#zombie-search').oninput=filter;kind.onchange=filter;
    let entity,prefab,result,chosen,sourceHandle,busy=false;
    function fill(select,values,selected){select.replaceChildren(...values);if([...select.options].some(item=>item.value===selected))select.value=selected;}
    async function render(){
        if(busy)return;
        busy=true;preview.disabled=save.disabled=true;status.textContent='Rendering preview…';
        for(const input of panel.querySelectorAll('input,select'))input.disabled=true;
        try{
            const source=catalog.find(entry=>entryKey(entry)===character.value&&entry.kind===kind.value);
            if(!source)throw Error('Select a character or object first');
            const selectedAnimation=animation.value,selectedState=form.value,selectedCostume=costume.value;
            await disposeEntity(runtime,entity);releaseRenderSource(runtime,sourceHandle);sourceHandle=null;entity=prefab=null;
            chosen={...source,armors:source.kind!=='zombies'?[]:armor.value==='starting'?source.armors:armor.value==='none'?[]:[RENDER_ARMORS[Number(armor.value)]]};
            const effects={butter:source.kind==='zombies'&&butter.checked,poison:source.kind==='zombies'&&poison.checked};
            sourceHandle=await resolveRenderSource(runtime,source,loadPrefab);prefab=sourceHandle.prefab;entity=await assemble(runtime,prefab,chosen,effects);
            if(effects.butter&&!entity.displays.some(item=>/butter/i.test(item.display.armatureName+item.display.node.name)))throw Error('This zombie has no butter visual attachment');
            if(effects.poison&&!entity.body.display.armature().getSlots().some(slot=>slot.name.includes('POISONFACE')))throw Error('This zombie has no poison-face slots');
            const {states,animations}=describeStates(entity);
            fill(animation,animations.map(name=>option(name,name)),selectedAnimation);
            fill(form,states.map(state=>option(state.id,state.label)),selectedState);
            fill(costume,[option('-1','Default'),...Array.from({length:source.costumes||0},(_,index)=>option(String(index),'Costume '+index))],selectedCostume);
            const state=states.find(state=>state.id===form.value);
            if(!animation.value)throw Error('This object has no renderable pose');
            const sampleProgress=Number(position.value)/100;
            result=await renderOne(runtime,entity,animation.value,Number(costume.value),{state,progress:sampleProgress,scale:Number(scale.value)});
            result.selection={codename:source.codename,kind:source.kind,prefab:source.prefab,armors:chosen.armors,effects,state,costume:Number(costume.value),animation:animation.value,sampleProgress,renderScale:result.renderScale};
            status.textContent=source.name+' · '+state.label;details.textContent=result.width+' × '+result.height+' · transparent PNG · full-release textures';save.disabled=false;
        }catch(error){status.textContent='Preview could not be rendered';details.textContent=String(error.message||error);}
        finally{busy=false;preview.disabled=false;for(const input of panel.querySelectorAll('input,select'))input.disabled=false;}
    }
    for(const input of [character,armor,animation,form,costume,position,scale,butter,poison])input.onchange=()=>{save.disabled=true;};
    preview.onclick=render;
    save.onclick=async()=>{
        if(busy||!result)return;
        busy=true;save.disabled=preview.disabled=true;
        try{
            const root=chosen.kind==='misc'?`misc/${segment(chosen.category)}`:chosen.kind;
            const name=`${root}/${segment(chosen.codename)}/${segment(chosen.codename)}__custom.png`;
            await invoke('render_export_png',{name,base64:result.base64});
            const destination=await invoke('render_export_finish',{manifest:{format:'gardendless-custom-render',version:2,textureSource:'Full-release PNG',entries:[{...result.selection,path:name,width:result.width,height:result.height}],failures:[]}});
            status.textContent='Saved custom render';details.textContent=destination;
            for(const input of panel.querySelectorAll('input,select,button'))input.disabled=true;
            document.querySelector('#cancel').textContent='Close';
        }catch(error){details.textContent=String(error.message||error);}
        finally{busy=false;}
    };
    await render();
}
async function run() {
    const runtime=await boot();
    if(window.__GD_RENDER_GENERATOR__)return generator(runtime);
    const controls=document.querySelector('#batch-controls');
    const options=window.__GD_RENDER_TEST_OPTIONS__||await new Promise(resolve=>{
        controls.hidden=false;status.textContent='Choose the content and quality, then start exporting.';
        document.querySelector('#start-export').onclick=()=>{
            const kinds=[...controls.querySelectorAll('[data-kind]:checked')].map(input=>input.dataset.kind);
            if(!kinds.length){details.textContent='Choose at least one section.';return;}
            resolve({kinds,scale:Number(document.querySelector('#batch-scale').value),actions:document.querySelector('#batch-actions').checked});controls.hidden=true;
        };
    });
    const kinds=options.kinds||['plants','zombies','misc'];
    const extras=kinds.includes('misc')&&options.includeExtras!==false?await discoverExtras(runtime,loadPrefab):[];
    const entries=[...RENDER_ENTRIES,...extras].filter(entry=>kinds.includes(entry.kind));
    progress.max=entries.length;
    const manifest={format:'gardendless-state-renders',version:3,textureSource:'Full-release PNG assets',requestedScale:options.scale||4,transparent:true,entries:[],failures:[],skipped:[],notes:['Full visual hierarchy, starting armour, plant upper/front/back parts and explicit persistent state recipes.','Idle poses at frame zero; action clips sampled at start, middle and 95% progress. Costumes included for idle poses.','No game AI, save data or sound code runs in this renderer. Very large poses are limited to 4096 pixels per side.']};
    for(let index=0;index<entries.length&&!cancelled;index++){
        const entry=entries[index];status.textContent=`${index+1}/${entries.length} · ${entry.codename}`;
        let prefab,entity,source;
        try{
            source=await resolveRenderSource(runtime,entry,loadPrefab);prefab=source.prefab;entity=await assemble(runtime,prefab,entry);
            const {states,animations}=describeStates(entity);
            const selected=options.actions===false?animations.filter(name=>animationCategory(name)==='idle'||name==='Static'):animations;
            if(!selected.length)throw Error('No selected animations in this prefab');
            for(const state of states)for(const animation of selected){
                const category=animationCategory(animation);
                const costumes=category==='idle'?[-1,...Array.from({length:entry.costumes||0},(_,index)=>index)]:[-1];
                for(const costume of costumes)for(const sampleProgress of poseSamples(animation,entry.kind)){
                    if(cancelled)return;
                    try{
                        const result=await renderOne(runtime,entity,animation,costume,{state,progress:sampleProgress,scale:options.scale||4});
                        const root=entry.kind==='misc'?`misc/${segment(entry.category)}/${segment(entry.codename)}`:`${entry.kind}/${segment(entry.codename)}`;
                        const variant=costume<0?'base':`costumes/${String(costume).padStart(2,'0')}`;
                        const pose=String(Math.round(sampleProgress*100)).padStart(3,'0');
                        const name=`${root}/${variant}/${segment(state.id)}/${category}/${segment(entry.codename)}__${segment(animation)}__${pose}.png`;
                        await invoke('render_export_png',{name,base64:result.base64});
                        manifest.entries.push({codename:entry.codename,kind:entry.kind,prefab:entry.prefab,armors:entry.armors,state,costume,animation,sampleProgress,path:name,width:result.width,height:result.height,renderScale:result.renderScale});
                    }catch(error){
                        const record={codename:entry.codename,prefab:entry.prefab,state:state.id,costume,animation,sampleProgress,error:String(error.message||error)};
                        if(/transparent|no render geometry|Invalid posed mesh bounds/.test(record.error))manifest.skipped.push(record);else manifest.failures.push(record);
                    }
                }
            }
        }catch(error){manifest.failures.push({...entry,error:String(error.message||error)});}
        finally{await disposeEntity(runtime,entity);releaseRenderSource(runtime,source);}
        progress.value=index+1;details.textContent=`${manifest.entries.length} PNGs · ${manifest.skipped.length} empty poses · ${manifest.failures.length} unsupported or failed`;
    }
    if(cancelled)return;
    releaseExtras(runtime);
    const destination=await invoke('render_export_finish',{manifest});
    status.textContent=`Exported ${manifest.entries.length} PNGs`;details.textContent=destination+'\nSee manifest.json for states, sources, skipped poses and unsupported assets.';
    document.querySelector('#cancel').textContent='Close';runtime.cc.game.pause();
}
export {boot, assemble, disposeEntity, loadPrefab,renderOne};
if (!window.__GD_RENDER_LIBRARY__) run().catch(error => { status.textContent = 'Export failed'; details.textContent = String(error.stack || error); });
