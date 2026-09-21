// GP-Next Asset Studio
// Standalone ES module: export { render }
// Runtime-oriented Cocos 2.x / 3.x + DragonBones tooling.

(() => {
    const DEFAULT_STATE = {
        currentTab: "textures",
        searchQuery: "",
        sortBy: "name",
        activeAssetId: null,
        brushColor: "#3b82f6",
        brushSize: 6,
        activeTool: "brush",
        selectedAnimation: "",
        loopAnimation: true,
        selectedBone: "",
        pickerOpen: false,
        textureListScroll: 0,
        skeletonListScroll: 0,
        animationListScroll: 0,
        boneListScroll: 0,
        fontListScroll: 0,
        musicListScroll: 0,
        boneSearch: "",
        textureEdits: Object.create(null),
        boneOffsets: Object.create(null),
        hiddenBones: Object.create(null),
        importedAssets: Object.create(null),
    };

    window._gpStudioState = Object.assign(DEFAULT_STATE, window._gpStudioState || {});
    const state = window._gpStudioState;
    state.textureEdits ||= Object.create(null);
    state.boneOffsets ||= Object.create(null);
    state.hiddenBones ||= Object.create(null);
    state.importedAssets ||= Object.create(null);

    function render(container) {
        container.innerHTML = "";
        installStyles();

        const wrapper = el("div", "gp-studio-wrap");
        const header = el("div", "gp-studio-header");
        header.innerHTML = `
            <div>
                <div class="gp-studio-title">Asset Studio</div>
                <div class="gp-studio-subtitle">Live Cocos textures, DragonBones animations and runtime bone controls</div>
            </div>
            <div class="gp-header-actions"><button id="exportBtn" class="gp-btn">Export Selected</button><button id="importBtn" class="gp-btn">Import Asset</button><button id="scanBtn" class="gp-btn success">Scan Engine</button><input id="assetImportInput" type="file" hidden multiple accept="image/*,.png,.jpg,.jpeg,.webp,.gif,.avif,.json,.dbbin,.atlas,.fnt,.ttf,.otf,.woff,.woff2,.mp3,.ogg,.wav,.m4a,.aac,.flac"></div>
        `;

        const nav = el("div", "gp-studio-nav");
        nav.innerHTML = `
            <button data-tab="textures" class="gp-nav-btn ${state.currentTab === "textures" ? "active" : ""}">Textures</button>
            <button data-tab="dragonbones" class="gp-nav-btn ${state.currentTab === "dragonbones" ? "active" : ""}">Animations</button>
            <button data-tab="fonts" class="gp-nav-btn ${state.currentTab === "fonts" ? "active" : ""}">Fonts</button>
            <button data-tab="music" class="gp-nav-btn ${state.currentTab === "music" ? "active" : ""}">Music</button>
        `;

        const searchRow = el("div", "gp-search-row");
        searchRow.innerHTML = `
            <input id="assetSearch" class="gp-input" placeholder="Search..." value="${escapeAttr(state.searchQuery)}">
            <select id="assetSort" class="gp-input" title="Sort order">
                <option value="name" ${state.sortBy === "name" ? "selected" : ""}>Name A-Z</option>
                <option value="name-desc" ${state.sortBy === "name-desc" ? "selected" : ""}>Name Z-A</option>
                <option value="id" ${state.sortBy === "id" ? "selected" : ""}>ID A-Z</option>
                <option value="id-desc" ${state.sortBy === "id-desc" ? "selected" : ""}>ID Z-A</option>
            </select>
            <span id="countLabel" class="gp-counter"></span>
        `;

        const body = el("div", "gp-studio-body");
        const listPane = el("div", "gp-list-pane");
        const listTitle = el("div", "gp-pane-title");
        listTitle.textContent = "Loaded Assets";
        const listContainer = el("div", "gp-list-box gp-list-grow");
        listPane.append(listTitle, listContainer);

        const workspace = el("div", "gp-workspace");
        body.append(listPane, workspace);

        wrapper.append(header, nav, searchRow, body);
        container.appendChild(wrapper);

        const elements = {
            wrapper,
            listContainer,
            workspace,
            searchInput: searchRow.querySelector("#assetSearch"),
            sortSelect: searchRow.querySelector("#assetSort"),
            countLabel: searchRow.querySelector("#countLabel"),
            scanBtn: header.querySelector("#scanBtn"),
            exportBtn: header.querySelector("#exportBtn"),
            importBtn: header.querySelector("#importBtn"),
            importInput: header.querySelector("#assetImportInput"),
            nav,
        };

        let scannedTextures = [];
        let scannedDragonBones = [];
        let scannedFonts = [];
        let scannedMusic = [];
        let activeEditorCleanup = null;

        const notify = makeNotifier(wrapper);

        function setTab(tab, clearSelection = true) {
            if (state.currentTab === "textures") state.textureListScroll = listContainer.scrollTop;
            if (state.currentTab === "dragonbones") state.skeletonListScroll = listContainer.scrollTop;
            if (state.currentTab === "fonts") state.fontListScroll = listContainer.scrollTop;
            if (state.currentTab === "music") state.musicListScroll = listContainer.scrollTop;
            state.currentTab = tab;
            if (clearSelection) state.activeAssetId = null;
            nav.querySelectorAll(".gp-nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
            renderAssetList();
            if (activeEditorCleanup) activeEditorCleanup();
            const icon = tab === "textures" ? "TX" : tab === "dragonbones" ? "DB" : tab === "fonts" ? "FNT" : "♪";
            workspace.innerHTML = `<div class="gp-empty-state"><div class="gp-empty-icon">${icon}</div><div>Select an asset to open it.</div></div>`;
        }

        function switchTabWithoutClearing(tab) {
            state.currentTab = tab;
            nav.querySelectorAll(".gp-nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.tab === tab));
            renderAssetList();
        }

        function currentList() {
            if (state.currentTab === "textures") return scannedTextures;
            if (state.currentTab === "dragonbones") return scannedDragonBones;
            if (state.currentTab === "fonts") return scannedFonts;
            return scannedMusic;
        }

        function scanAssets() {
            const cc = window.cc || window.CocosEngine;
            const texMap = new Map();
            const dbMap = new Map();
            const fontMap = new Map();
            const musicMap = new Map();
            if (!cc) {
                notify("Cocos engine was not found.", true);
                return;
            }

            try {
                const assets = cc.assetManager?.assets;
                if (assets?.forEach) {
                    assets.forEach((asset, id) => {
                        if (!asset) return;
                        const ctor = String(asset.constructor?.name || "").toLowerCase();
                        const url = String(asset.nativeUrl || asset._nativeUrl || asset.url || "").toLowerCase();
                        const name = String(asset.name || asset._name || "").toLowerCase();
                        const key = String(id || asset._uuid || asset.uuid || asset.name || Math.random());
                        const isMusic =
                            /audioclip|audioasset|music/.test(ctor) || /\.(mp3|ogg|wav|m4a|aac|flac)$/i.test(url);
                        const isFont =
                            /font|ttffont|bitmapfont|labelatlas/.test(ctor) ||
                            /\.(ttf|otf|fnt|woff2?|font)$/i.test(url) ||
                            /(?:^|[._ -])font(?:[._ -]|$)/i.test(name);
                        const isTexture =
                            /texture2d|imageasset|texturecube|rendertexture/.test(ctor) ||
                            /\.(png|jpe?g|webp|avif|gif|ktx2?|pvr)$/i.test(url);
                        if (isMusic)
                            musicMap.set(key, { id: key, name: asset.name || asset._name || key.slice(0, 12), asset });
                        else if (isFont)
                            fontMap.set(key, { id: key, name: asset.name || asset._name || key.slice(0, 12), asset });
                        else if (isTexture)
                            texMap.set(key, { id: key, name: asset.name || asset._name || key.slice(0, 12), asset });
                    });
                }
            } catch (e) {
                console.debug("[GP Asset] texture scan failed", e);
            }

            try {
                const scene = cc.director?.getScene?.();
                const walk = node => {
                    if (!node) return;
                    for (const comp of node._components || node.components || []) {
                        const arm = typeof comp?.armature === "function" ? comp.armature() : null;
                        if (arm && typeof comp.playAnimation === "function") {
                            const id = String(node.uuid || node._id || node.name || Math.random());
                            dbMap.set(id, {
                                id,
                                name: node.name ? `[Node] ${node.name}` : "[Node] DragonBones",
                                node,
                                dbComp: comp,
                                armature: arm,
                            });
                        }
                    }
                    for (const child of node.children || []) walk(child);
                };
                walk(scene);
            } catch (e) {
                console.debug("[GP Asset] skeleton scan failed", e);
            }

            scannedTextures = [...texMap.values()];
            scannedDragonBones = [...dbMap.values()];
            scannedFonts = [...fontMap.values()];
            scannedMusic = [...musicMap.values()];
            for (const entry of Object.values(state.importedAssets || {})) {
                if (!entry?.item) continue;
                const bucket =
                    entry.kind === "textures"
                        ? scannedTextures
                        : entry.kind === "fonts"
                          ? scannedFonts
                          : entry.kind === "music"
                            ? scannedMusic
                            : scannedDragonBones;
                if (!bucket.some(x => x.id === entry.item.id)) bucket.push(entry.item);
            }
            renderAssetList();
            restoreActiveAsset();
            notify(
                `Scanned ${scannedTextures.length} textures, ${scannedDragonBones.length} live skeletons, ${scannedFonts.length} fonts and ${scannedMusic.length} music assets.`,
            );
        }

        function restoreActiveAsset() {
            if (!state.activeAssetId) return;
            const item = currentList().find(x => x.id === state.activeAssetId);
            if (!item) return;
            if (state.currentTab === "textures") loadTextureEditor(item);
            else if (state.currentTab === "dragonbones") loadAnimationViewer(item);
            else loadAssetPreview(item, state.currentTab);
        }

        function renderAssetList() {
            const list = [...currentList()];
            const key = state.sortBy || "name";
            const dir = key.endsWith("-desc") ? -1 : 1;
            const field = key.replace("-desc", "");
            list.sort((a, b) => {
                const av = String(a[field] || "").toLowerCase();
                const bv = String(b[field] || "").toLowerCase();
                return av < bv ? -dir : av > bv ? dir : 0;
            });
            const query = String(state.searchQuery || "")
                .trim()
                .toLowerCase();
            listContainer.innerHTML = "";
            let visible = 0;
            for (const item of list) {
                if (query && !`${item.name} ${item.id}`.toLowerCase().includes(query)) continue;
                visible++;
                const card = document.createElement("button");
                card.className = `gp-asset-card ${state.activeAssetId === item.id ? "active" : ""}`;
                card.type = "button";
                const isTexture = state.currentTab === "textures";
                const isFont = state.currentTab === "fonts";
                const isMusic = state.currentTab === "music";
                const modified = isTexture && !!state.textureEdits[item.id];
                const thumbUrl = isTexture ? getTexturePreviewUrl(item.asset || item) : "";
                const icon = isTexture ? "IMG" : state.currentTab === "dragonbones" ? "DB" : isFont ? "FNT" : "SND";
                card.innerHTML = `
                    <span class="gp-asset-thumb ${isTexture ? "texture" : state.currentTab === "dragonbones" ? "skeleton" : "generic"}">${thumbUrl ? `<img alt="" src="${escapeAttr(thumbUrl)}">` : icon}</span>
                    <span class="gp-asset-meta">
                        <span class="gp-asset-name">${escapeHtml(item.name)}</span>
                        <span class="gp-asset-id">${escapeHtml(item.id.slice(0, 14))}${modified ? "  • MODIFIED" : ""}</span>
                    </span>
                `;
                card.onclick = () => {
                    state.activeAssetId = item.id;
                    renderAssetList();
                    if (isTexture) loadTextureEditor(item);
                    else if (state.currentTab === "dragonbones") loadAnimationViewer(item);
                    else loadAssetPreview(item, state.currentTab);
                };
                listContainer.appendChild(card);
            }
            elements.countLabel.textContent = `${visible}/${list.length}`;
            requestAnimationFrame(() => {
                const saved =
                    state.currentTab === "textures"
                        ? state.textureListScroll
                        : state.currentTab === "dragonbones"
                          ? state.skeletonListScroll
                          : state.currentTab === "fonts"
                            ? state.fontListScroll
                            : state.musicListScroll;
                listContainer.scrollTop = Number(saved) || 0;
            });
            searchRow.querySelector("#assetSearch").placeholder =
                state.currentTab === "textures"
                    ? "Search textures..."
                    : state.currentTab === "dragonbones"
                      ? "Search animations or skeletons..."
                      : state.currentTab === "fonts"
                        ? "Search fonts..."
                        : "Search music...";
        }

        listContainer.addEventListener("scroll", () => {
            if (state.currentTab === "textures") state.textureListScroll = listContainer.scrollTop;
            else if (state.currentTab === "dragonbones") state.skeletonListScroll = listContainer.scrollTop;
            else if (state.currentTab === "fonts") state.fontListScroll = listContainer.scrollTop;
            else state.musicListScroll = listContainer.scrollTop;
        });

        nav.addEventListener("click", e => {
            const btn = e.target.closest("[data-tab]");
            if (!btn) return;
            setTab(btn.dataset.tab);
        });
        elements.searchInput.addEventListener("input", e => {
            state.searchQuery = e.target.value;
            renderAssetList();
        });
        elements.sortSelect.addEventListener("change", e => {
            state.sortBy = e.target.value;
            renderAssetList();
        });
        elements.scanBtn.onclick = scanAssets;
        elements.exportBtn.onclick = () => exportSelectedAsset();
        elements.importBtn.onclick = () => elements.importInput.click();
        elements.importInput.onchange = async e => {
            const files = [...(e.target.files || [])];
            for (const file of files) await importAssetFile(file);
            e.target.value = "";
            renderAssetList();
        };

        async function importAssetFile(file) {
            const lower = file.name.toLowerCase();
            let kind = "textures";
            if (/\.(ttf|otf|woff2?|fnt|font)$/.test(lower)) kind = "fonts";
            else if (/\.(mp3|ogg|wav|m4a|aac|flac)$/.test(lower)) kind = "music";
            else if (/\.(json|dbbin|atlas)$/.test(lower)) kind = "dragonbones";
            const id = `import:${Date.now()}:${Math.random().toString(36).slice(2)}`;
            const item = { id, name: file.name, imported: true, file, blobUrl: URL.createObjectURL(file), kind };
            state.importedAssets[id] = { kind, item };
            if (kind === "textures") scannedTextures.push(item);
            else if (kind === "fonts") scannedFonts.push(item);
            else if (kind === "music") scannedMusic.push(item);
            else scannedDragonBones.push(item);
            state.activeAssetId = id;
            state.currentTab = kind;
            nav.querySelectorAll(".gp-nav-btn").forEach(btn =>
                btn.classList.toggle("active", btn.dataset.tab === kind),
            );
            notify(`Imported ${file.name}.`);
        }

        async function exportSelectedAsset() {
            const item = currentList().find(x => x.id === state.activeAssetId);
            if (!item) {
                notify("Select an asset first.", true);
                return;
            }
            try {
                // Textures: always export the current edited bitmap (or the untouched source).
                if (state.currentTab === "textures") {
                    let dataUrl = state.textureEdits[item.id];
                    if (!dataUrl) dataUrl = (await resolveTextureImage(item.asset || item)).dataUrl;
                    const name = safeAssetName(item.name, item.id, ".png");
                    downloadBlob(dataUrlToBlob(dataUrl), name);
                    notify(`Exported ${name}.`);
                    return;
                }
                // Anything the user imported themselves: hand back the original file untouched.
                if (item.imported && item.file) {
                    const name = safeAssetName(item.name, item.id, "");
                    downloadBlob(item.file, name);
                    notify(`Exported ${name}.`);
                    return;
                }
                // Fonts / music scanned from the live engine: fetch the real source bytes and
                // keep the REAL extension (ttf/otf/woff/mp3/ogg/...) instead of a fake ".font"/
                // ".audio" that nothing else can open correctly.
                if (state.currentTab === "fonts" || state.currentTab === "music") {
                    const src =
                        item.asset?.nativeUrl ||
                        item.asset?._nativeUrl ||
                        item.asset?.url ||
                        item.asset?._nativeAsset?.url ||
                        item.asset?.nativeAsset?.url;
                    if (!src) throw new Error("This asset does not expose a fetchable browser URL.");
                    const blob = await fetchAssetBlob(item.asset);
                    const srcExt = /\.([a-z0-9]+)(?:[?#]|$)/i.exec(src.split("/").pop() || "")?.[1];
                    const name = safeAssetName(item.name, item.id,
                        srcExt ? `.${srcExt}` : state.currentTab === "fonts" ? ".ttf" : ".mp3");
                    downloadBlob(blob, name);
                    notify(`Exported ${name}.`);
                    return;
                }
                // DragonBones / skeletons: the bone-mod JSON is only half the asset. Also pull
                // down every atlas texture the armature actually renders with, so the export is
                // something you could realistically hand to another tool, not just metadata.
                const baseName = safeAssetName(item.name, item.id, ".json").replace(/\.[a-z0-9]+$/i, "");
                const payload = exportDragonBonesData(item);
                downloadBlob(
                    new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }),
                    `${baseName}_gpnext_mods.json`,
                );
                let fileCount = 1;
                if (item.armature) {
                    const atlasImages = [];
                    collectArmatureAtlasImages(item.armature, atlasImages);
                    for (const entry of atlasImages) {
                        try {
                            await new Promise((resolve, reject) => {
                                if (entry.img.complete && entry.img.naturalWidth) resolve();
                                else {
                                    entry.img.onload = resolve;
                                    entry.img.onerror = () => reject(new Error("atlas image failed to load"));
                                }
                            });
                            const c = document.createElement("canvas");
                            c.width = entry.img.naturalWidth;
                            c.height = entry.img.naturalHeight;
                            c.getContext("2d").drawImage(entry.img, 0, 0);
                            downloadBlob(dataUrlToBlob(c.toDataURL("image/png")), `${baseName}_atlas_${fileCount}.png`);
                            fileCount++;
                        } catch (e) {
                            console.debug("[GP Asset] atlas texture export skipped", e);
                        }
                    }
                }
                notify(
                    `Exported ${fileCount} file(s) for ${item.name}. Your browser may have asked to allow multiple downloads.`,
                );
            } catch (e) {
                notify(`Export failed: ${e?.message || e}`, true);
            }
        }

        function exportDragonBonesData(item) {
            const armature = item.armature;
            const bones = armature?.getBones?.() || [];
            return {
                type: "gpnext-dragonbones-runtime",
                name: item.name,
                animations: [...(armature?.animation?.animationNames || [])],
                bones: bones.map(b => ({
                    name: b.name,
                    parent: b.parent?.name || null,
                    length: Number(b.length || 0),
                    offset: state.boneOffsets[item.id]?.[b.name] || { x: 0, y: 0 },
                    hidden: !!state.hiddenBones[item.id]?.[b.name],
                })),
            };
        }
        async function fetchAssetBlob(asset) {
            const src =
                asset?.nativeUrl ||
                asset?._nativeUrl ||
                asset?.url ||
                asset?._nativeAsset?.url ||
                asset?.nativeAsset?.url;
            if (!src) throw new Error("Asset has no exportable browser URL.");
            const r = await fetch(src);
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return await r.blob();
        }
        function dataUrlToBlob(dataUrl) {
            const [h, b] = String(dataUrl).split(",");
            const mime = /data:([^;]+)/.exec(h)?.[1] || "application/octet-stream";
            const raw = atob(b);
            const bytes = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
            return new Blob([bytes], { type: mime });
        }
        // Downloads land in the browser's save folder with no context; give them
        // safe, informative names: readable title + real extension + short id.
        function safeAssetName(name, id, fallbackExt) {
            let base = String(name || "")
                .replace(/[\\/:*?"<>|\u0000-\u001f]/g, "_")
                .replace(/\s+/g, " ")
                .trim()
                .replace(/^\.+/, "")
                .slice(0, 80);
            if (!base) base = "asset";
            if (!/\.[a-z0-9]{1,5}$/i.test(base)) base += fallbackExt || "";
            const tag = String(id || "").slice(0, 8);
            if (tag && !base.includes(tag)) {
                const dot = base.lastIndexOf(".");
                base = dot > 0
                    ? base.slice(0, dot) + "_" + tag + base.slice(dot)
                    : base + "_" + tag;
            }
            return base;
        }

        function downloadBlob(blob, name) {
            const u = URL.createObjectURL(blob),
                a = document.createElement("a");
            a.href = u;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(u), 1000);
        }

        function loadTextureEditor(item) {
            if (activeEditorCleanup) activeEditorCleanup();
            workspace.innerHTML = "";
            const root = el("div", "gp-editor-root");
            const toolbar = el("div", "gp-toolbar gp-texture-toolbar");
            toolbar.innerHTML = `
                <select id="tool" class="gp-input gp-tool-select">
                    <option value="brush">Brush</option>
                    <option value="pencil">Pencil</option>
                    <option value="eraser">Eraser</option>
                    <option value="line">Line</option>
                    <option value="rect">Rectangle</option>
                    <option value="fill">Fill</option>
                    <option value="eyedropper">Eyedropper</option>
                </select>
                <input id="color" type="color" class="gp-color-picker" value="${escapeAttr(state.brushColor)}">
                <input id="size" type="range" class="gp-range" min="1" max="100" value="${Number(state.brushSize) || 6}">
                <span id="sizeVal" class="gp-toolbar-label">${Number(state.brushSize) || 6}px</span>
                <button id="undo" class="gp-btn">Undo</button>
                <button id="redo" class="gp-btn">Redo</button>
                <button id="clear" class="gp-btn danger">Clear</button>
                <button id="flipH" class="gp-btn">Flip H</button>
                <button id="flipV" class="gp-btn">Flip V</button>
                <button id="rotate" class="gp-btn">Rotate 90°</button>
                <button id="reset" class="gp-btn">Reset Source</button>
                <button id="apply" class="gp-btn success gp-apply-btn">Force Apply</button>
            `;

            const stage = el("div", "gp-texture-stage");
            const canvasWrap = el("div", "gp-texture-canvas-wrap");
            const canvas = document.createElement("canvas");
            canvas.className = "gp-texture-canvas";
            canvasWrap.appendChild(canvas);
            stage.appendChild(canvasWrap);

            const info = el("div", "gp-texture-side");
            info.innerHTML = `
                <div class="gp-side-title">Texture</div>
                <div id="textureName" class="gp-side-value">${escapeHtml(item.name)}</div>
                <div id="textureMeta" class="gp-text-muted">Loading source...</div>
                <div class="gp-side-block">
                    <div class="gp-side-title">Tools</div>
                    <div class="gp-tool-grid">
                        <button class="gp-btn gp-tool-mini" data-tool="brush">Brush</button>
                        <button class="gp-btn gp-tool-mini" data-tool="pencil">Pencil</button>
                        <button class="gp-btn gp-tool-mini" data-tool="eraser">Eraser</button>
                        <button class="gp-btn gp-tool-mini" data-tool="line">Line</button>
                        <button class="gp-btn gp-tool-mini" data-tool="rect">Rect</button>
                        <button class="gp-btn gp-tool-mini" data-tool="fill">Fill</button>
                        <button class="gp-btn gp-tool-mini" data-tool="eyedropper">Pick</button>
                    </div>
                </div>
                <div class="gp-side-block gp-text-muted">Ctrl+Z / Ctrl+Shift+Z · mouse wheel zoom · Force Apply writes the edited bitmap back into the live Cocos texture and remembers it for the next GP Next open.</div>
            `;
            stage.appendChild(info);
            root.append(toolbar, stage);
            workspace.appendChild(root);

            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            const toolSel = toolbar.querySelector("#tool");
            const colorPick = toolbar.querySelector("#color");
            const sizePick = toolbar.querySelector("#size");
            const sizeVal = toolbar.querySelector("#sizeVal");
            const undoBtn = toolbar.querySelector("#undo");
            const redoBtn = toolbar.querySelector("#redo");
            const clearBtn = toolbar.querySelector("#clear");
            const resetBtn = toolbar.querySelector("#reset");
            const flipHBtn = toolbar.querySelector("#flipH");
            const flipVBtn = toolbar.querySelector("#flipV");
            const rotateBtn = toolbar.querySelector("#rotate");
            const applyBtn = toolbar.querySelector("#apply");
            const meta = info.querySelector("#textureMeta");

            toolSel.value = state.activeTool;
            colorPick.value = state.brushColor;
            sizePick.value = state.brushSize;

            let undoStack = [];
            let redoStack = [];
            let drawing = false;
            let start = null;
            let snapshot = null;
            let zoom = 1;
            let sourceDataUrl = null;
            let disposed = false;

            const pushUndo = () => {
                if (!canvas.width || !canvas.height) return;
                undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                if (undoStack.length > 40) undoStack.shift();
                redoStack = [];
                updateUndoButtons();
            };
            const updateUndoButtons = () => {
                undoBtn.disabled = undoStack.length <= 1;
                redoBtn.disabled = redoStack.length === 0;
            };
            const restoreImageData = data => ctx.putImageData(data, 0, 0);
            const getPos = e => {
                const rect = canvas.getBoundingClientRect();
                return {
                    x: ((e.clientX - rect.left) * canvas.width) / rect.width,
                    y: ((e.clientY - rect.top) * canvas.height) / rect.height,
                };
            };

            function setTool(tool) {
                state.activeTool = tool;
                toolSel.value = tool;
                info.querySelectorAll("[data-tool]").forEach(b =>
                    b.classList.toggle("active", b.dataset.tool === tool),
                );
            }
            setTool(state.activeTool);

            function floodFill(x, y) {
                const w = canvas.width,
                    h = canvas.height;
                if (!w || !h) return;
                const px = ctx.getImageData(0, 0, w, h);
                const data = px.data;
                const sx = Math.max(0, Math.min(w - 1, x | 0));
                const sy = Math.max(0, Math.min(h - 1, y | 0));
                const idx0 = (sy * w + sx) * 4;
                const target = [data[idx0], data[idx0 + 1], data[idx0 + 2], data[idx0 + 3]];
                const hex = state.brushColor.replace("#", "");
                const fill = [
                    parseInt(hex.slice(0, 2), 16),
                    parseInt(hex.slice(2, 4), 16),
                    parseInt(hex.slice(4, 6), 16),
                    255,
                ];
                if (target.every((v, i) => v === fill[i])) return;
                const same = i =>
                    data[i] === target[0] &&
                    data[i + 1] === target[1] &&
                    data[i + 2] === target[2] &&
                    data[i + 3] === target[3];
                const stack = [[sx, sy]];
                const seen = new Uint8Array(w * h);
                while (stack.length) {
                    const [cx, cy] = stack.pop();
                    if (cx < 0 || cy < 0 || cx >= w || cy >= h) continue;
                    const p = cy * w + cx;
                    if (seen[p]) continue;
                    const i = p * 4;
                    if (!same(i)) continue;
                    seen[p] = 1;
                    data[i] = fill[0];
                    data[i + 1] = fill[1];
                    data[i + 2] = fill[2];
                    data[i + 3] = fill[3];
                    stack.push([cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]);
                }
                ctx.putImageData(px, 0, 0);
            }

            canvas.addEventListener("pointerdown", e => {
                if (e.button !== 0) return;
                canvas.setPointerCapture?.(e.pointerId);
                const p = getPos(e);
                const tool = state.activeTool;
                if (tool === "eyedropper") {
                    const pixel = ctx.getImageData(Math.floor(p.x), Math.floor(p.y), 1, 1).data;
                    state.brushColor = `#${[pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, "0")).join("")}`;
                    colorPick.value = state.brushColor;
                    setTool("brush");
                    return;
                }
                pushUndo();
                snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
                start = p;
                drawing = true;
                if (tool === "fill") {
                    floodFill(p.x, p.y);
                    drawing = false;
                } else {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    if (tool === "brush" || tool === "pencil" || tool === "eraser") strokeTo(p);
                }
            });
            canvas.addEventListener("pointermove", e => {
                if (!drawing) return;
                const p = getPos(e);
                const tool = state.activeTool;
                if (tool === "brush" || tool === "pencil" || tool === "eraser") strokeTo(p);
                else if (tool === "line" || tool === "rect") drawShape(p);
            });
            canvas.addEventListener("pointerup", endStroke);
            canvas.addEventListener("pointercancel", endStroke);
            window.addEventListener("pointerup", endStroke);

            function strokeTo(p) {
                ctx.globalCompositeOperation = state.activeTool === "eraser" ? "destination-out" : "source-over";
                ctx.strokeStyle = state.activeTool === "eraser" ? "rgba(0,0,0,1)" : state.brushColor;
                ctx.lineWidth = state.activeTool === "pencil" ? 1 : Number(state.brushSize) || 6;
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.lineTo(p.x, p.y);
                ctx.stroke();
            }
            function drawShape(p) {
                restoreImageData(snapshot);
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = state.brushColor;
                ctx.lineWidth = Number(state.brushSize) || 6;
                ctx.lineCap = "round";
                ctx.beginPath();
                if (state.activeTool === "line") {
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(start.x, start.y, p.x - start.x, p.y - start.y);
                }
            }
            function endStroke() {
                if (!drawing) return;
                drawing = false;
                ctx.globalCompositeOperation = "source-over";
            }

            canvasWrap.addEventListener(
                "wheel",
                e => {
                    if (!e.ctrlKey && !e.metaKey) return;
                    e.preventDefault();
                    zoom = Math.max(0.2, Math.min(8, zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
                    canvas.style.width = `${Math.max(64, canvas.width * zoom)}px`;
                    canvas.style.height = `${Math.max(64, canvas.height * zoom)}px`;
                },
                { passive: false },
            );

            undoBtn.onclick = () => {
                if (undoStack.length <= 1) return;
                const current = undoStack.pop();
                redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                restoreImageData(undoStack[undoStack.length - 1]);
                updateUndoButtons();
            };
            redoBtn.onclick = () => {
                const data = redoStack.pop();
                if (!data) return;
                undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
                restoreImageData(data);
                updateUndoButtons();
            };
            clearBtn.onclick = () => {
                pushUndo();
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            };
            function transformTexture(kind) {
                if (!canvas.width || !canvas.height) return;
                pushUndo();
                const old = document.createElement("canvas");
                old.width = canvas.width;
                old.height = canvas.height;
                old.getContext("2d").drawImage(canvas, 0, 0);
                if (kind === "rotate") {
                    const w = canvas.width,
                        h = canvas.height;
                    canvas.width = h;
                    canvas.height = w;
                    ctx.save();
                    ctx.translate(h, 0);
                    ctx.rotate(Math.PI / 2);
                    ctx.drawImage(old, 0, 0);
                    ctx.restore();
                } else {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.save();
                    if (kind === "flipH") {
                        ctx.translate(canvas.width, 0);
                        ctx.scale(-1, 1);
                    } else {
                        ctx.translate(0, canvas.height);
                        ctx.scale(1, -1);
                    }
                    ctx.drawImage(old, 0, 0);
                    ctx.restore();
                }
                canvas.style.width = `${canvas.width * zoom}px`;
                canvas.style.height = `${canvas.height * zoom}px`;
                updateUndoButtons();
            }
            flipHBtn.onclick = () => transformTexture("flipH");
            flipVBtn.onclick = () => transformTexture("flipV");
            rotateBtn.onclick = () => transformTexture("rotate");
            resetBtn.onclick = async () => {
                delete state.textureEdits[item.id];
                if (sourceDataUrl) await drawFromDataUrl(sourceDataUrl);
                notify("Texture edit reset.");
                renderAssetList();
            };
            toolSel.onchange = e => setTool(e.target.value);
            colorPick.oninput = e => (state.brushColor = e.target.value);
            sizePick.oninput = e => {
                state.brushSize = Number(e.target.value) || 6;
                sizeVal.textContent = `${state.brushSize}px`;
            };
            info.querySelectorAll("[data-tool]").forEach(b => (b.onclick = () => setTool(b.dataset.tool)));

            async function drawFromDataUrl(url) {
                const image = await loadImage(url);
                if (disposed) return;
                canvas.width = image.naturalWidth || image.width;
                canvas.height = image.naturalHeight || image.height;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "source-over";
                ctx.drawImage(image, 0, 0);
                undoStack = [ctx.getImageData(0, 0, canvas.width, canvas.height)];
                redoStack = [];
                canvas.style.width = `${canvas.width * zoom}px`;
                canvas.style.height = `${canvas.height * zoom}px`;
                meta.textContent = `${canvas.width} × ${canvas.height}px · ${state.textureEdits[item.id] ? "modified" : "source"}`;
                updateUndoButtons();
            }

            (async () => {
                try {
                    const original = await resolveTextureImage(item.asset || item);
                    sourceDataUrl = original.dataUrl;
                    const persisted = state.textureEdits[item.id];
                    await drawFromDataUrl(persisted || sourceDataUrl);
                    if (persisted) {
                        // Reopening Asset Studio restores the edited bitmap into the live engine too.
                        try {
                            await hotswapTexture(item.asset || item, persisted, canvas);
                        } catch (e) {
                            console.debug("[GP Asset] persisted texture reapply failed", e);
                        }
                    }
                    meta.textContent = `${canvas.width} × ${canvas.height}px · ${persisted ? "modified / persistent" : "source"}`;
                } catch (e) {
                    meta.textContent = `Could not load texture: ${e?.message || e}`;
                    notify("Texture source could not be loaded.", true);
                }
            })();

            applyBtn.onclick = async () => {
                try {
                    if (!canvas.width || !canvas.height) throw new Error("Canvas is empty.");
                    const dataUrl = canvas.toDataURL("image/png");
                    state.textureEdits[item.id] = dataUrl;
                    const upload = await hotswapTexture(item.asset || item, dataUrl, canvas);
                    meta.textContent = `${canvas.width} × ${canvas.height}px · modified / persistent · ${upload.paths.length} upload path(s)`;
                    renderAssetList();
                    notify(`Force Apply complete: ${upload.paths.join(", ") || "runtime replacement"}.`);
                } catch (e) {
                    notify(`Force Apply failed: ${e?.message || e}`, true);
                }
            };

            const keyHandler = e => {
                if (!(e.ctrlKey || e.metaKey)) return;
                const target = e.target;
                if (target && /INPUT|TEXTAREA|SELECT/.test(target.tagName) && target !== canvas) return;
                if (e.key.toLowerCase() === "z") {
                    e.preventDefault();
                    if (e.shiftKey) redoBtn.click();
                    else undoBtn.click();
                }
            };
            window.addEventListener("keydown", keyHandler, true);

            activeEditorCleanup = () => {
                disposed = true;
                window.removeEventListener("pointerup", endStroke);
                window.removeEventListener("keydown", keyHandler, true);
            };
        }

        function loadAssetPreview(item, kind) {
            if (activeEditorCleanup) activeEditorCleanup();
            workspace.innerHTML = "";
            const root = el("div", "gp-generic-preview");
            workspace.appendChild(root);
            if (kind === "fonts") {
                root.innerHTML = `<div class="gp-generic-head"><div><div class="gp-pane-title">Font Preview</div><div class="gp-text-muted" id="fontStatus">Loading actual font…</div></div><input class="gp-input gp-font-size" type="number" min="8" max="160" value="48"><select class="gp-input gp-font-weight"><option value="400">Regular</option><option value="600">Semibold</option><option value="700">Bold</option></select></div><div class="gp-font-preview" contenteditable="true">Aa Bb Cc 123\nThe quick brown fox jumps over the lazy dog.\n0123456789 !@#$%^&*()</div><div class="gp-generic-actions"><button class="gp-btn" id="fontApply">Apply Preview Font</button><button class="gp-btn" id="fontExport">Export Font</button></div>`;
                const text = root.querySelector(".gp-font-preview"),
                    size = root.querySelector(".gp-font-size"),
                    weight = root.querySelector(".gp-font-weight"),
                    status = root.querySelector("#fontStatus");
                const fontName = `gpfont_${String(item.id).replace(/[^a-z0-9]/gi, "_")}`;
                const src = item.imported
                    ? item.blobUrl
                    : item.asset?.nativeUrl ||
                      item.asset?._nativeUrl ||
                      item.asset?.url ||
                      item.asset?._nativeAsset?.url ||
                      "";
                const update = () => {
                    text.style.fontSize = `${Math.max(8, Math.min(160, Number(size.value) || 48))}px`;
                    text.style.fontWeight = weight.value;
                };
                size.oninput = update;
                weight.onchange = update;
                update();
                (async () => {
                    try {
                        if (!src) throw new Error("No font URL exposed by this runtime.");
                        const ff = new FontFace(fontName, `url(${JSON.stringify(src)})`);
                        await ff.load();
                        document.fonts.add(ff);
                        text.style.fontFamily = `"${fontName}"`;
                        status.textContent = `Loaded: ${item.name}`;
                    } catch (e) {
                        status.textContent = `Could not load actual font: ${e?.message || e}`;
                    }
                })();
                root.querySelector("#fontExport").onclick = exportSelectedAsset;
                root.querySelector("#fontApply").onclick = () => {
                    text.style.fontFamily = `"${fontName}"`;
                };
                activeEditorCleanup = () => {};
            } else {
                root.innerHTML = `<div class="gp-generic-head"><div><div class="gp-pane-title">Music Preview</div><div class="gp-text-muted" id="musicStatus">Ready</div></div></div><div class="gp-generic-card"><div class="gp-generic-name">${escapeHtml(item.name)}</div><div class="gp-music-controls"><button class="gp-btn success" id="musicPlay">Play</button><button class="gp-btn" id="musicStop">Stop</button><button class="gp-btn" id="musicExport">Export</button></div><audio id="musicAudio" controls preload="none"></audio></div>`;
                const audio = root.querySelector("#musicAudio"),
                    status = root.querySelector("#musicStatus");
                let engineAudioId = null,
                    tempAudioNode = null;
                const src = item.imported
                    ? item.blobUrl
                    : item.asset?.nativeUrl ||
                      item.asset?._nativeUrl ||
                      item.asset?.url ||
                      item.asset?._nativeAsset?.url ||
                      "";
                if (src) audio.src = src;

                // Creator 3.x has no cc.audioEngine and AudioClip has no .play(); the real way to
                // fire a one-shot clip is a live AudioSource component. Used only when the asset
                // exposes no direct browser URL, since the <audio> tag above is more reliable.
                function playViaAudioSource(cc) {
                    const AudioSourceCtor = cc?.AudioSource || cc?.AudioSourceComponent;
                    const scene = cc?.director?.getScene?.();
                    if (!AudioSourceCtor || !cc?.Node || !scene || !item.asset) return false;
                    try {
                        if (!tempAudioNode) {
                            tempAudioNode = new cc.Node("__gpNextAssetStudioAudioPreview");
                            scene.addChild(tempAudioNode);
                        }
                        const comp =
                            tempAudioNode.getComponent(AudioSourceCtor) || tempAudioNode.addComponent(AudioSourceCtor);
                        comp.clip = item.asset;
                        comp.loop = false;
                        comp.play();
                        return true;
                    } catch (e) {
                        console.debug("[GP Asset] AudioSource playback failed", e);
                        return false;
                    }
                }
                function stopAudioSource(cc) {
                    try {
                        const AudioSourceCtor = cc?.AudioSource || cc?.AudioSourceComponent;
                        tempAudioNode?.getComponent?.(AudioSourceCtor)?.stop?.();
                    } catch {}
                }

                root.querySelector("#musicPlay").onclick = async () => {
                    const cc = window.cc || window.CocosEngine;
                    try {
                        if (src) {
                            await audio.play();
                            status.textContent = "Browser playback active.";
                            return;
                        }
                        if (playViaAudioSource(cc)) {
                            status.textContent = "Playing through a live AudioSource node.";
                            return;
                        }
                        if (cc?.audioEngine?.playEffect && item.asset) {
                            engineAudioId = cc.audioEngine.playEffect(item.asset, false);
                            status.textContent = "Playing through the legacy cc.audioEngine.";
                            return;
                        }
                        if (typeof item.asset?.play === "function") {
                            await item.asset.play();
                            status.textContent = "Playing through the asset's own play() method.";
                            return;
                        }
                        throw new Error("No playback API exposed by this engine build.");
                    } catch (e) {
                        status.textContent = `Audio unavailable: ${e?.message || e}`;
                        notify("Music playback failed without breaking the Asset Studio.", true);
                    }
                };
                root.querySelector("#musicStop").onclick = () => {
                    try {
                        audio.pause();
                        audio.currentTime = 0;
                    } catch {}
                    const cc = window.cc || window.CocosEngine;
                    stopAudioSource(cc);
                    try {
                        if (engineAudioId != null) cc?.audioEngine?.stopEffect?.(engineAudioId);
                    } catch {}
                    try {
                        item.asset?.stop?.();
                    } catch {}
                };
                root.querySelector("#musicExport").onclick = exportSelectedAsset;

                activeEditorCleanup = () => {
                    try {
                        audio.pause();
                    } catch {}
                    stopAudioSource(window.cc || window.CocosEngine);
                    try {
                        tempAudioNode?.destroy?.();
                    } catch {}
                    tempAudioNode = null;
                };
            }
        }

        function loadAnimationViewer(item) {
            if (activeEditorCleanup) activeEditorCleanup();
            workspace.innerHTML = "";
            const root = el("div", "gp-animation-root");
            const top = el("div", "gp-toolbar");
            top.innerHTML = `
                <select id="animationSelect" class="gp-input gp-animation-select"></select>
                <label class="gp-check"><input id="loop" type="checkbox" ${state.loopAnimation !== false ? "checked" : ""}> Loop</label>
                <button id="play" class="gp-btn success">Play</button>
                <button id="pause" class="gp-btn">Pause</button>
                <button id="resetAnim" class="gp-btn">Reset Pose</button>
            `;
            root.appendChild(top);

            const main = el("div", "gp-animation-main");
            const previewPanel = el("div", "gp-preview-panel");
            previewPanel.innerHTML = `<div class="gp-pane-title">Live Preview</div><div class="gp-preview-frame"><canvas id="previewCanvas"></canvas></div><div id="previewStatus" class="gp-text-muted"></div>`;
            const bonePanel = el("div", "gp-bone-panel");
            bonePanel.innerHTML = `
                <div class="gp-pane-title">Bones</div>
                <input id="boneSearch" class="gp-input" placeholder="Search bones..." value="${escapeAttr(state.boneSearch || "")}">
                <div class="gp-bone-actions">
                    <input id="offsetX" class="gp-input" type="number" step="1" placeholder="Offset X">
                    <input id="offsetY" class="gp-input" type="number" step="1" placeholder="Offset Y">
                    <button id="applyOffset" class="gp-btn success">Offset</button>
                </div>
                <div class="gp-bone-actions">
                    <button id="hideBone" class="gp-btn danger">Hide Selected</button>
                    <button id="showBone" class="gp-btn">Show Selected</button>
                </div>
                <div id="boneList" class="gp-bone-list"></div>
            `;
            main.append(previewPanel, bonePanel);
            root.appendChild(main);
            workspace.appendChild(root);

            if (!item.dbComp || !item.armature) {
                previewPanel.querySelector("#previewStatus").textContent = "Skeleton armature unavailable.";
                return;
            }

            const armature = item.armature;
            const dbComp = item.dbComp;
            ensureArmatureRuntimePatches(armature, item.id);

            const animationSelect = top.querySelector("#animationSelect");
            const loop = top.querySelector("#loop");
            const previewCanvas = previewPanel.querySelector("#previewCanvas");
            const previewCtx = previewCanvas.getContext("2d");
            const previewStatus = previewPanel.querySelector("#previewStatus");
            const boneSearch = bonePanel.querySelector("#boneSearch");
            const boneList = bonePanel.querySelector("#boneList");
            const hideBtn = bonePanel.querySelector("#hideBone");
            const showBtn = bonePanel.querySelector("#showBone");
            const offsetX = bonePanel.querySelector("#offsetX");
            const offsetY = bonePanel.querySelector("#offsetY");
            const applyOffsetBtn = bonePanel.querySelector("#applyOffset");
            let raf = 0;
            let lastTime = performance.now();
            let selectedBone = state.selectedBone;
            let disposed = false;
            const slotSprites = collectSlotSprites(armature);

            const animNames = armature.animation?.animationNames || [];
            for (const name of animNames) {
                const opt = document.createElement("option");
                opt.value = name;
                opt.textContent = name;
                animationSelect.appendChild(opt);
            }
            if (state.selectedAnimation && animNames.includes(state.selectedAnimation))
                animationSelect.value = state.selectedAnimation;
            if (!animationSelect.value && animNames.length) animationSelect.value = animNames[0];
            state.selectedAnimation = animationSelect.value || "";
            loop.checked = state.loopAnimation !== false;

            function boneKey(name) {
                return `${item.id}:${name}`;
            }
            const hiddenMap = () => (state.hiddenBones[item.id] ||= Object.create(null));
            const offsetMap = () => (state.boneOffsets[item.id] ||= Object.create(null));

            function bones() {
                return typeof armature.getBones === "function" ? armature.getBones() || [] : [];
            }

            function renderBones() {
                boneList.innerHTML = "";
                const q = String(state.boneSearch || "").toLowerCase();
                for (const bone of bones()) {
                    if (q && !String(bone.name).toLowerCase().includes(q)) continue;
                    const row = document.createElement("button");
                    row.type = "button";
                    row.className = `gp-bone-row ${selectedBone === bone.name ? "selected" : ""}`;
                    const off = offsetMap()[bone.name] || { x: 0, y: 0 };
                    const hidden = !!hiddenMap()[bone.name];
                    row.innerHTML = `<span>${escapeHtml(bone.name)}</span><span class="gp-bone-meta">${hidden ? "HIDDEN" : `${round(off.x)}, ${round(off.y)}`}</span>`;
                    row.onclick = () => {
                        selectedBone = bone.name;
                        state.selectedBone = bone.name;
                        renderBones();
                    };
                    boneList.appendChild(row);
                }
                boneList.scrollTop = state.boneListScroll || 0;
            }
            boneSearch.oninput = e => {
                state.boneSearch = e.target.value;
                renderBones();
            };
            boneList.addEventListener("scroll", () => (state.boneListScroll = boneList.scrollTop));
            renderBones();

            animationSelect.onchange = () => {
                state.selectedAnimation = animationSelect.value;
                playSelected();
            };
            loop.onchange = () => (state.loopAnimation = loop.checked);
            top.querySelector("#play").onclick = playSelected;
            top.querySelector("#pause").onclick = () => pauseAnimation(dbComp, armature);
            top.querySelector("#resetAnim").onclick = () => resetAnimation(dbComp, armature);

            applyOffsetBtn.onclick = () => {
                const bone = findBone(armature, selectedBone);
                if (!bone || protectedBone(armature, bone)) {
                    notify("That bone is unavailable or protected.", true);
                    return;
                }
                const map = offsetMap();
                const current = map[bone.name] || { x: 0, y: 0 };
                const dx = Number(offsetX.value) || 0;
                const dy = Number(offsetY.value) || 0;
                current.x += dx;
                current.y += dy;
                map[bone.name] = current;
                const m = bone.globalTransformMatrix;
                if (m) {
                    m.tx += dx;
                    m.ty += dy;
                }
                bone.__gpNextOffsetApplied = { x: current.x, y: current.y };
                try {
                    bone.invalidUpdate?.();
                    armature.invalidUpdate?.();
                } catch {}
                offsetX.value = "0";
                offsetY.value = "0";
                renderBones();
                notify(`Offset applied to ${bone.name}: ${dx}, ${dy}`);
            };

            hideBtn.onclick = () => {
                const bone = findBone(armature, selectedBone);
                if (!bone || protectedBone(armature, bone)) {
                    notify("That bone is unavailable or protected.", true);
                    return;
                }
                hiddenMap()[bone.name] = true;
                applyHiddenBone(armature, bone);
                armature.invalidUpdate?.();
                renderBones();
            };
            showBtn.onclick = () => {
                const bone = findBone(armature, selectedBone);
                if (!bone || protectedBone(armature, bone)) {
                    notify("That bone is unavailable or protected.", true);
                    return;
                }
                delete hiddenMap()[bone.name];
                clearHiddenBone(armature, bone);
                armature.invalidUpdate?.();
                renderBones();
            };

            function playSelected() {
                const name = animationSelect.value;
                if (!name) return;
                state.selectedAnimation = name;
                const loops = loop.checked ? 0 : 1;
                try {
                    dbComp.playAnimation(name, loops);
                } catch {
                    try {
                        armature.animation?.play?.(name, loops);
                    } catch {}
                }
                previewStatus.textContent = `Playing: ${name} · ${loop.checked ? "loop" : "once"}`;
            }

            function resizePreview() {
                const rect = previewCanvas.parentElement.getBoundingClientRect();
                const dpr = Math.min(window.devicePixelRatio || 1, 2);
                previewCanvas.width = Math.max(1, Math.floor(rect.width * dpr));
                previewCanvas.height = Math.max(1, Math.floor(rect.height * dpr));
                previewCanvas.style.width = `${rect.width}px`;
                previewCanvas.style.height = `${rect.height}px`;
            }
            const resizeObs = new ResizeObserver(resizePreview);
            resizeObs.observe(previewCanvas.parentElement);
            resizePreview();

            previewCanvas.addEventListener("click", e => {
                const picked = pickBoneFromPreview(e, previewCanvas, armature);
                if (picked) {
                    selectedBone = picked.name;
                    state.selectedBone = picked.name;
                    renderBones();
                }
            });

            function drawPreview(now) {
                if (disposed) return;
                const dt = Math.max(0, Math.min(0.05, (now - lastTime) / 1000));
                lastTime = now;
                drawArmaturePreview(previewCtx, previewCanvas, armature, selectedBone, hiddenMap(), slotSprites);
                raf = requestAnimationFrame(drawPreview);
            }
            raf = requestAnimationFrame(drawPreview);

            // Apply persisted hide state immediately and keep it applied after animation updates.
            for (const bone of bones()) if (hiddenMap()[bone.name]) applyHiddenBone(armature, bone);

            if (state.selectedAnimation) playSelected();

            activeEditorCleanup = () => {
                disposed = true;
                cancelAnimationFrame(raf);
                resizeObs.disconnect();
                previewCanvas.onclick = null;
            };
        }

        // Global Shift + Left Click picker. It refreshes its engine scan before presenting choices.
        installPicker(() => ({
            nodes: scannedDragonBones,
            open: entry => {
                state.activeAssetId = entry.id;
                switchTabWithoutClearing("dragonbones");
                loadAnimationViewer(entry);
            },
            notify,
        }));

        scanAssets();
    }

    window.__gpNextAssetStudioRender = render;

    function installStyles() {
        const id = "gp-asset-studio-v2-styles";
        if (document.getElementById(id)) return;
        const style = document.createElement("style");
        style.id = id;
        style.textContent = `
            :root{--gp-ctrl-h:34px;--gp-radius:7px}
            @font-face{font-family:'PvZ2 Game';src:url('/assets/resources/native/86/86615cb2-9939-4358-b8e2-ec2d020efeea/FBUSV8C5EI.ttf') format('truetype');font-display:swap}
            .gp-studio-wrap{height:100%;min-height:680px;box-sizing:border-box;display:flex;flex-direction:column;gap:10px;padding:12px;background:#0f111a;color:#e5e7eb;font-family:Inter,Segoe UI,Arial,sans-serif;overflow:hidden;position:relative}
            .gp-studio-wrap .gp-asset-name,.gp-studio-wrap .gp-nav-btn,.gp-studio-wrap .gp-studio-header h1,.gp-studio-wrap .gp-studio-header h2,.gp-studio-wrap .gp-section-title{font-family:'PvZ2 Game',Inter,Segoe UI,Arial,sans-serif}
            .gp-studio-wrap *{box-sizing:border-box}
            .gp-studio-header{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:2px;flex-wrap:wrap}
            .gp-header-actions{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
            .gp-studio-title{font-size:20px;font-weight:750;color:#f9fafb}
            .gp-studio-subtitle{margin-top:3px;font:11px monospace;color:#7f8ba3}

            .gp-studio-nav{display:flex;align-items:stretch;gap:6px;padding:4px;background:#111827;border:1px solid #273247;border-radius:9px;overflow-x:auto}
            .gp-nav-btn{flex:1 1 0;min-width:110px;height:var(--gp-ctrl-h);display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:#9ca3af;padding:0 12px;border-radius:6px;font-size:12px;font-weight:650;cursor:pointer;transition:background .15s ease,color .15s ease}
            .gp-nav-btn:hover{color:#e5e7eb;background:#1a2333}
            .gp-nav-btn.active{background:#243043;color:#fff;box-shadow:inset 0 0 0 1px #3b5384}

            .gp-search-row{display:flex;align-items:center;gap:8px}
            .gp-counter{min-width:72px;text-align:right;color:#6b7280;font:11px monospace}
            .gp-input{background:#151b28;color:#e5e7eb;border:1px solid #334155;border-radius:6px;height:var(--gp-ctrl-h);padding:0 10px;font-size:12px;box-sizing:border-box;outline:none;transition:border-color .15s ease}
            textarea.gp-input,.gp-font-preview{height:auto}
            .gp-input:focus{border-color:#4f83e8;box-shadow:0 0 0 2px rgba(79,131,232,.2)}
            .gp-search-row .gp-input{flex:1}
            .gp-input option{background:#f3f4f6;color:#000}

            .gp-btn{background:#202a3a;color:#d1d5db;border:1px solid #3a475c;border-radius:6px;height:var(--gp-ctrl-h);display:inline-flex;align-items:center;justify-content:center;padding:0 13px;font-size:11px;font-weight:600;cursor:pointer;white-space:nowrap;transition:background .15s ease,border-color .15s ease,color .15s ease,transform .1s ease}
            .gp-btn:hover:not(:disabled){background:#2b384c;color:#fff;border-color:#4a5b78}
            .gp-btn:active:not(:disabled){transform:translateY(1px)}
            .gp-btn:focus-visible{outline:2px solid #4f83e8;outline-offset:1px}
            .gp-btn:disabled{opacity:.4;cursor:not-allowed}
            .gp-btn.success{background:#064e3b;color:#6ee7b7;border-color:#059669}
            .gp-btn.success:hover:not(:disabled){background:#075c46}
            .gp-btn.danger{background:#7f1d1d;color:#fecaca;border-color:#dc2626}
            .gp-btn.danger:hover:not(:disabled){background:#912323}
            .gp-btn.active{border-color:#4f83e8;background:#172554;color:#fff}

            .gp-studio-body{flex:1;min-height:0;display:grid;grid-template-columns:minmax(260px,30%) minmax(0,1fr);gap:10px}
            .gp-list-pane,.gp-workspace{min-height:0;background:#111827;border:1px solid #273247;border-radius:8px;overflow:hidden}
            .gp-list-pane{display:flex;flex-direction:column}
            .gp-pane-title{padding:9px 11px;border-bottom:1px solid #273247;color:#d1d5db;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em}
            .gp-list-box{overflow:auto;padding:7px}
            .gp-list-box::-webkit-scrollbar,.gp-bone-list::-webkit-scrollbar,.gp-font-preview::-webkit-scrollbar{width:8px}
            .gp-list-box::-webkit-scrollbar-thumb,.gp-bone-list::-webkit-scrollbar-thumb,.gp-font-preview::-webkit-scrollbar-thumb{background:#2a3547;border-radius:8px}
            .gp-list-grow{flex:1}
            .gp-asset-card{width:100%;display:flex;gap:9px;align-items:center;text-align:left;background:#151d2b;border:1px solid #273247;border-radius:6px;padding:9px;margin-bottom:6px;color:#d1d5db;cursor:pointer;transition:background .15s ease,border-color .15s ease}
            .gp-asset-card:hover{background:#1b2637;border-color:#334155}
            .gp-asset-card.active{background:#172d73;border-color:#3b82f6}
            .gp-asset-thumb{width:42px;height:42px;flex:0 0 42px;border:1px solid #3a475c;border-radius:4px;display:flex;align-items:center;justify-content:center;overflow:hidden;background:#080b12;color:#6b7280;font:9px monospace}
            .gp-asset-thumb img{width:100%;height:100%;object-fit:contain}
            .gp-asset-meta{min-width:0;display:flex;flex-direction:column;gap:3px}
            .gp-asset-name{font-size:12px;font-weight:650;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
            .gp-asset-id{font:9px monospace;color:#6b7280}

            .gp-editor-root,.gp-animation-root{height:100%;display:flex;flex-direction:column}
            .gp-toolbar{display:flex;align-items:center;gap:7px;flex-wrap:wrap;padding:8px;border-bottom:1px solid #273247;background:#151b28}
            .gp-toolbar .gp-btn{flex:0 0 auto}
            .gp-tool-select{width:125px}
            .gp-color-picker{appearance:none;width:var(--gp-ctrl-h);height:var(--gp-ctrl-h);border:1px solid #3a475c;border-radius:6px;padding:2px;background:transparent;cursor:pointer}
            .gp-range{width:95px;align-self:center}
            .gp-toolbar-label{font:10px monospace;color:#9ca3af}
            .gp-apply-btn{margin-left:auto}

            .gp-texture-stage{min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1fr) 250px}
            .gp-texture-canvas-wrap{min-width:0;min-height:0;overflow:auto;display:flex;align-items:center;justify-content:center;padding:24px;background-color:#101722;background-image:linear-gradient(45deg,#182231 25%,transparent 25%),linear-gradient(-45deg,#182231 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#182231 75%),linear-gradient(-45deg,transparent 75%,#182231 75%);background-size:24px 24px;background-position:0 0,0 12px,12px -12px,-12px 0}
            .gp-texture-canvas{image-rendering:pixelated;max-width:none;max-height:none;border:1px solid #3a475c}
            .gp-texture-side{border-left:1px solid #273247;padding:12px;overflow:auto}
            .gp-side-title{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#9ca3af}
            .gp-side-value{margin:5px 0 9px;font-size:12px;color:#f3f4f6;word-break:break-word}
            .gp-side-block{margin-top:16px;padding-top:12px;border-top:1px solid #273247}
            .gp-tool-grid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}
            .gp-tool-mini{width:100%}
            .gp-text-muted{color:#7f8ba3;font:10px monospace}

            .gp-animation-main{min-height:0;flex:1;display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:0}
            .gp-preview-panel,.gp-bone-panel{min-width:0;min-height:0;display:flex;flex-direction:column}
            .gp-preview-panel{border-right:1px solid #273247}
            .gp-preview-frame{flex:1;min-height:420px;padding:10px;background:#0b0f17}
            .gp-preview-frame canvas{display:block;width:100%;height:100%;background:#0e141e;border:1px solid #273247;cursor:crosshair}
            .gp-bone-panel{padding-bottom:8px}
            .gp-bone-panel>.gp-input{margin:8px}
            .gp-bone-actions{display:flex;align-items:center;gap:6px;padding:0 8px 8px}
            .gp-bone-actions .gp-btn{flex:1;min-width:0}
            .gp-bone-actions input.gp-input{flex:1;min-width:0}
            .gp-bone-list{flex:1;min-height:0;overflow:auto;padding:4px 8px}
            .gp-bone-row{width:100%;display:flex;align-items:center;justify-content:space-between;gap:8px;border:1px solid transparent;background:transparent;color:#d1d5db;border-radius:5px;padding:8px;text-align:left;cursor:pointer;font:10px monospace;transition:background .15s ease}
            .gp-bone-row:hover{background:#171e2b}
            .gp-bone-row.selected{background:#172554;border-color:#3b82f6}
            .gp-bone-meta{color:#6b7280}
            .gp-check{display:flex;align-items:center;gap:5px;color:#d1d5db;font-size:11px}

            .gp-empty-state{height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;color:#6b7280;font-size:12px}
            .gp-empty-icon{width:42px;height:42px;display:flex;align-items:center;justify-content:center;border:1px solid #3a475c;border-radius:8px;background:#151b28;color:#60a5fa;font:700 12px monospace}
            .gp-toast{position:absolute;left:50%;top:15px;transform:translateX(-50%);z-index:99999;padding:8px 12px;border:1px solid #3a475c;background:#111827;color:#f9fafb;border-radius:6px;font-size:11px;pointer-events:none;box-shadow:0 6px 18px rgba(0,0,0,.35);animation:gp-toast-in .15s ease-out}
            @keyframes gp-toast-in{from{opacity:0;transform:translate(-50%,-6px)}to{opacity:1;transform:translate(-50%,0)}}
            .gp-generic-preview{height:100%;display:flex;flex-direction:column;gap:10px;padding:16px;box-sizing:border-box}
            .gp-generic-head{display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap}
            .gp-generic-head .gp-font-size{width:100px}
            .gp-generic-head .gp-font-weight{width:120px}
            .gp-font-preview{flex:1;min-height:320px;white-space:pre-wrap;overflow:auto;padding:24px;background:#0b0f17;border:1px solid #273247;border-radius:8px;line-height:1.3;outline:none}
            .gp-generic-card{display:flex;flex-direction:column;gap:14px;padding:18px;background:#151b28;border:1px solid #273247;border-radius:8px}
            .gp-generic-name{font-size:15px;font-weight:700;color:#f3f4f6}
            .gp-generic-actions,.gp-music-controls{display:flex;align-items:center;gap:7px;flex-wrap:wrap}
            .gp-generic-card audio{width:100%}

            .gp-modal-overlay{position:fixed;inset:0;z-index:100000;background:rgba(6,9,16,.6);display:flex;align-items:center;justify-content:center;padding:20px}
            .gp-modal{width:100%;max-width:360px;max-height:80vh;display:flex;flex-direction:column;background:#111827;border:1px solid #2f3b52;border-radius:10px;box-shadow:0 20px 50px rgba(0,0,0,.5);overflow:hidden}
            .gp-modal-head{padding:14px 16px;border-bottom:1px solid #273247;color:#f3f4f6;font-size:13px}
            .gp-modal-list{flex:1;min-height:0;overflow:auto;padding:8px;display:flex;flex-direction:column;gap:6px}
            .gp-modal-item{width:100%;text-align:left;background:#151d2b;border:1px solid #273247;border-radius:6px;padding:9px 10px;color:#d1d5db;font-size:12px;cursor:pointer;transition:background .15s ease,border-color .15s ease}
            .gp-modal-item:hover{background:#1b2637;border-color:#3b82f6}
            .gp-modal-foot{display:flex;justify-content:flex-end;gap:8px;padding:10px 12px;border-top:1px solid #273247}

            @media(max-width:1000px){.gp-studio-body{grid-template-columns:230px minmax(0,1fr)}.gp-texture-stage{grid-template-columns:1fr}.gp-texture-side{display:none}.gp-animation-main{grid-template-columns:1fr}.gp-bone-panel{max-height:420px;border-top:1px solid #273247}.gp-preview-panel{border-right:0}.gp-studio-header{align-items:flex-start;flex-direction:column}.gp-header-actions{width:100%}.gp-header-actions .gp-btn{flex:1}}
        `;
        document.head.appendChild(style);
    }

    function makeNotifier(wrapper) {
        return (msg, isError = false) => {
            const t = document.createElement("div");
            t.className = "gp-toast";
            t.style.borderColor = isError ? "#dc2626" : "#2563eb";
            t.textContent = msg;
            wrapper.appendChild(t);
            setTimeout(() => t.remove(), 2600);
        };
    }

    function el(tag, cls) {
        const e = document.createElement(tag);
        if (cls) e.className = cls;
        return e;
    }

    function escapeHtml(v) {
        return String(v ?? "").replace(
            /[&<>'"]/g,
            c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[c],
        );
    }
    function escapeAttr(v) {
        return escapeHtml(v);
    }
    function round(v) {
        return Number(v || 0).toFixed(1);
    }

    function getTexturePreviewUrl(tex) {
        return (
            window._gpStudioState.textureEdits?.[tex?._uuid || tex?.uuid || tex?._id || tex?.id] ||
            tex?.blobUrl ||
            tex?.image?.src ||
            tex?._nativeAsset?.src ||
            tex?.nativeUrl ||
            ""
        );
    }

    async function resolveTextureImage(tex) {
        const candidates = [
            tex?.image,
            tex?._image,
            tex?._htmlElementObj,
            tex?._nativeAsset?.image,
            tex?._nativeAsset?._nativeAsset,
            tex?._nativeAsset,
            tex?.image?.nativeAsset,
            tex?.image?._nativeAsset,
            tex?.image?.element,
        ];
        let source = candidates.find(x => x && (x.src || x.currentSrc)) || null;
        if (!source && tex?.nativeUrl) source = tex.nativeUrl;
        if (!source) throw new Error("No readable image source found.");
        const image = await loadImage(typeof source === "string" ? source : source.src || source.currentSrc);
        const c = document.createElement("canvas");
        c.width = image.naturalWidth || image.width;
        c.height = image.naturalHeight || image.height;
        c.getContext("2d").drawImage(image, 0, 0);
        return { image, dataUrl: c.toDataURL("image/png") };
    }

    function loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error("Image decode failed."));
            if (String(src).startsWith("http")) img.crossOrigin = "anonymous";
            img.src = src;
        });
    }

    async function hotswapTexture(asset, dataUrl, canvas) {
        const cc = window.cc || window.CocosEngine;
        const image = await loadImage(dataUrl);
        const runtimeTexture = resolveRuntimeTexture(asset);
        const candidates = [
            runtimeTexture,
            asset,
            asset?.texture,
            asset?._texture,
            asset?._nativeAsset?.texture,
        ].filter(Boolean);
        const paths = [];
        const call = (name, fn) => {
            try {
                if (typeof fn !== "function") return;
                fn();
                paths.push(name);
            } catch (e) {
                console.debug(`[GP Asset] ${name} failed`, e);
            }
        };

        // Cocos Creator 3.x: Texture2D is backed by an ImageAsset. Assigning `.image` is the
        // documented way to push new pixel data and re-upload it to the GPU. The old code only
        // knew the Cocos 2.x API surface (initWithElement/updateImage/...), which doesn't exist
        // on 3.x Texture2D, so every call silently no-opped there — this was the main reason
        // Force Apply looked like it worked (no error) but nothing changed on screen.
        if (cc?.ImageAsset) {
            for (const tex of candidates) {
                try {
                    if (!("image" in tex)) continue;
                    const imageAsset = new cc.ImageAsset();
                    imageAsset.reset(canvas);
                    tex.image = imageAsset;
                    paths.push("ImageAsset reupload (Creator 3.x)");
                } catch (e) {
                    console.debug("[GP Asset] 3.x ImageAsset reupload failed", e);
                }
            }
        }

        // Legacy Cocos 2.x / cocos2d-html5 texture API surface, kept as a fallback.
        for (const tex of candidates) {
            try {
                tex.loaded = true;
                tex._loaded = true;
            } catch {}
            call("initWithElement", () => tex.initWithElement?.(canvas));
            call("handleLoadedTexture", () => tex.handleLoadedTexture?.());
            call("updateImage", () => tex.updateImage?.(canvas));
        }

        // The texture object itself now has the new pixels. What's left is making sure nothing
        // is still sampling a stale copy: sprites packed into the engine's dynamic atlas cache
        // a sub-rect of the OLD texture and keep drawing that forever unless explicitly reset —
        // this is the other classic reason a "successful" texture edit never shows up in-game.
        const touched = markTextureUsersDirty(asset, runtimeTexture, image, canvas);
        paths.push(`invalidated ${touched} live reference(s)`);
        requestAnimationFrame(() => markTextureUsersDirty(asset, runtimeTexture, image, canvas));

        if (paths.length <= 1)
            throw new Error(
                "This engine build didn't expose any texture-update API GP Next recognizes — check the console for [GP Asset] debug logs.",
            );
        return { paths };
    }
    function resolveRuntimeTexture(asset) {
        return (
            asset?.texture ||
            asset?._texture ||
            asset?._gfxTexture ||
            asset?._nativeAsset?.texture ||
            asset?._nativeAsset ||
            asset
        );
    }

    function sameTexture(a, b) {
        if (!a || !b) return false;
        if (a === b) return true;
        const au = a._uuid || a.uuid,
            bu = b._uuid || b.uuid;
        if (au && bu && au === bu) return true;
        const aid = a._id,
            bid = b._id;
        if (aid != null && bid != null && String(aid) === String(bid)) return true;
        if (a._texture && b._texture && a._texture === b._texture) return true;
        const as = a.nativeUrl || a._nativeUrl || a.url,
            bs = b.nativeUrl || b._nativeUrl || b.url;
        if (as && bs && String(as) === String(bs)) return true;
        const ai = a.image || a._image || a._htmlElementObj,
            bi = b.image || b._image || b._htmlElementObj;
        if (ai && bi && ai === bi) return true;
        const ais = ai?.src || ai?.currentSrc,
            bis = bi?.src || bi?.currentSrc;
        if (ais && bis && String(ais) === String(bis)) return true;
        return false;
    }

    function markTextureUsersDirty(asset, texture, image, canvas) {
        const cc = window.cc || window.CocosEngine,
            scene = cc?.director?.getScene?.();
        if (!scene) return 0;
        let touched = 0;
        const sameAny = x =>
            sameTexture(x, asset) ||
            sameTexture(x, texture) ||
            sameTexture(x, asset?.texture) ||
            sameTexture(x, asset?._texture);
        const visit = node => {
            if (!node) return;
            for (const comp of node._components || node.components || []) {
                if (!comp) continue;
                let uses = false;
                const sf = comp.spriteFrame || comp._spriteFrame;
                if (sf && sameAny(sf.texture || sf._texture)) {
                    uses = true;
                    // Drop any packed dynamic-atlas region so the renderer goes back to sampling
                    // the real (now-edited) texture instead of a cached tile of the old pixels.
                    try {
                        sf._resetDynamicAtlasFrame?.();
                    } catch {}
                    try {
                        sf.texture = sf.texture || sf._texture;
                    } catch {}
                }
                for (const k of ["texture", "mainTexture", "albedoMap", "spriteTexture", "baseColorMap"]) {
                    try {
                        if (sameAny(comp[k])) uses = true;
                    } catch {}
                }
                const count = Math.max(1, Number(comp.getMaterialCount?.() || 1));
                for (let i = 0; i < count; i++) {
                    try {
                        const mat = comp.getMaterial?.(i) || comp.material || comp._material;
                        if (!mat) continue;
                        for (const key of ["mainTexture", "texture", "albedoMap", "spriteTexture", "baseColorMap"]) {
                            let v = null;
                            try {
                                v = mat.getProperty?.(key);
                            } catch {}
                            if (sameAny(v)) uses = true;
                        }
                    } catch {}
                }
                if (uses) {
                    try {
                        comp.markForUpdate?.(true);
                    } catch {}
                    try {
                        comp._updateMaterial?.(true);
                    } catch {}
                    try {
                        comp._updateRenderData?.(true);
                    } catch {}
                    try {
                        comp._markForUpdateRenderData?.(true);
                    } catch {}
                    try {
                        comp.markForRenderDirty?.();
                    } catch {}
                    touched++;
                }
            }
            for (const child of node.children || []) visit(child);
        };
        visit(scene);
        try {
            scene.emit?.("gp-next-texture-updated", { asset, texture, image, canvas });
        } catch {}
        return touched;
    }

    function findBone(armature, name) {
        if (!name) return null;
        return armature.getBone?.(name) || armature.getBones?.()?.find?.(b => b.name === name) || null;
    }

    function protectedBone(armature, bone) {
        if (!bone) return true;
        if (armature.root && bone === armature.root) return true;
        if (String(bone.name).toLowerCase() === "root") return true;
        return !bone.parent && (armature.getBones?.()?.length || 0) > 1;
    }

    function applyHiddenBone(armature, bone) {
        if (!bone || protectedBone(armature, bone)) return;
        bone.__gpNextHidden = true;
        try {
            bone.visible = false;
        } catch {}
        const m = bone.globalTransformMatrix;
        if (m) {
            m.a = 0;
            m.b = 0;
            m.c = 0;
            m.d = 0;
        }
        try {
            bone.invalidUpdate?.();
        } catch {}
    }

    function clearHiddenBone(armature, bone) {
        if (!bone || protectedBone(armature, bone)) return;
        bone.__gpNextHidden = false;
        try {
            bone.visible = true;
        } catch {}
        // Let DragonBones recompute the live matrix on the next update.
        try {
            bone.invalidUpdate?.();
            armature.invalidUpdate?.();
        } catch {}
    }

    function ensureArmatureRuntimePatches(armature, id) {
        if (!armature || armature.__gpNextAssetStudioPatch) return;
        if (typeof armature.advanceTime !== "function") return;
        const original = armature.advanceTime.bind(armature);
        armature.__gpNextAssetStudioPatch = true;
        armature.__gpNextAssetStudioOriginalAdvance = original;
        armature.advanceTime = function (delta) {
            const result = original(delta);
            const hidden = state.hiddenBones?.[id] || {};
            const offsets = state.boneOffsets?.[id] || {};
            for (const bone of this.getBones?.() || []) {
                if (!bone) continue;
                const off = offsets[bone.name];
                const m = bone.globalTransformMatrix;
                if (off && m) {
                    const last = bone.__gpNextOffsetApplied || { x: 0, y: 0 };
                    const dx = Number(off.x || 0) - Number(last.x || 0);
                    const dy = Number(off.y || 0) - Number(last.y || 0);
                    if (dx || dy) {
                        m.tx += dx;
                        m.ty += dy;
                    }
                    bone.__gpNextOffsetApplied = { x: Number(off.x || 0), y: Number(off.y || 0) };
                }
                if (hidden[bone.name] && !protectedBone(this, bone)) applyHiddenBone(this, bone);
                try {
                    bone.invalidUpdate?.();
                } catch {}
            }
            return result;
        };
    }

    function pickBoneFromPreview(event, canvas, armature) {
        const rect = canvas.getBoundingClientRect(),
            x = ((event.clientX - rect.left) * canvas.width) / rect.width,
            y = canvas.height - ((event.clientY - rect.top) * canvas.height) / rect.height;
        const layout = armature.__gpPreviewLayout;
        if (!layout) return null;
        const toScreen = (wx, wy) => ({
            x: canvas.width / 2 + (wx - (layout.minX + layout.maxX) / 2) * layout.scale,
            y: canvas.height / 2 + (wy - (layout.minY + layout.maxY) / 2) * layout.scale,
        });
        const distSeg = (px, py, ax, ay, bx, by) => {
            const dx = bx - ax,
                dy = by - ay,
                l2 = dx * dx + dy * dy;
            if (!l2) return Math.hypot(px - ax, py - ay);
            let t = ((px - ax) * dx + (py - ay) * dy) / l2;
            t = Math.max(0, Math.min(1, t));
            return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
        };
        let best = null,
            bestDist = 18;
        for (const bone of armature.getBones?.() || []) {
            const m = bone.globalTransformMatrix;
            if (!m) continue;
            const len = Number(bone.length || 16),
                a = toScreen(m.tx, m.ty),
                b = toScreen(m.tx + (m.a || 1) * len, m.ty + (m.c || 0) * len),
                d = distSeg(x, y, a.x, a.y, b.x, b.y);
            if (d < bestDist) {
                best = bone;
                bestDist = d;
            }
        }
        return best;
    }

    // Gathers, per slot, everything needed to draw the slot's real texture at its live pose:
    // the atlas image, the sub-rect of that image the slot uses, trim/rotation info from the
    // SpriteFrame, and the slot's own globalTransformMatrix (same {a,b,c,d,tx,ty} space the
    // bones already render in, so it composites directly with the existing skeleton drawing).
    function collectSlotSprites(armature) {
        const out = [];
        const imgCache = new Map();
        const getImg = src => {
            if (!imgCache.has(src)) {
                const img = new Image();
                img.src = src;
                imgCache.set(src, img);
            }
            return imgCache.get(src);
        };
        for (const slot of armature.getSlots?.() || armature.slots || []) {
            try {
                const m = slot.globalTransformMatrix;
                if (!m) continue;
                const tex = resolveSlotTextureInfo(slot, getImg);
                if (!tex) continue;
                out.push({ matrix: m, boneName: slot.parent?.name || slot.name, ...tex });
            } catch (e) {
                console.debug("[GP Asset] slot sprite resolve failed", e);
            }
        }
        return out;
    }

    function resolveSlotTextureInfo(slot, getImg) {
        const candidates = [slot.display, slot._display, slot.rawDisplay, slot._rawDisplay];
        for (const disp of candidates) {
            if (!disp) continue;
            const sf = disp.spriteFrame || disp._spriteFrame || disp.getComponent?.("cc.Sprite")?.spriteFrame;
            if (!sf) continue;
            const tex = sf.texture || sf._texture;
            const src =
                tex?.image?.src ||
                tex?.image?.currentSrc ||
                tex?._image?.src ||
                tex?.nativeUrl ||
                tex?._nativeAsset?.src;
            const rect = sf.rect || sf._rect;
            if (!src || !rect) continue;
            const origSize = sf.originalSize || sf._originalSize || { width: rect.width, height: rect.height };
            const offset = sf.offset || sf._offset || { x: 0, y: 0 };
            return {
                img: getImg(src),
                rectX: rect.x,
                rectY: rect.y,
                rectW: rect.width,
                rectH: rect.height,
                rotated: !!(sf.rotated ?? sf._rotated),
                offsetX: offset.x || 0,
                offsetY: offset.y || 0,
                origWidth: origSize.width || rect.width,
                origHeight: origSize.height || rect.height,
            };
        }
        return null;
    }

    // Draws one slot's texture into the already-transformed (armature-space) canvas context.
    // Returns true if it actually drew pixels, so the caller can fall back gracefully.
    function drawSlotSprite(ctx, s) {
        const img = s.img;
        if (!img || !img.complete || !img.naturalWidth) return false;
        const dx = -s.origWidth / 2 + s.offsetX - s.rectW / 2;
        const dy = -s.origHeight / 2 + s.offsetY - s.rectH / 2;
        ctx.save();
        ctx.transform(s.matrix.a, s.matrix.b, s.matrix.c, s.matrix.d, s.matrix.tx, s.matrix.ty);
        try {
            if (s.rotated) {
                ctx.translate(dx + s.rectW / 2, dy + s.rectH / 2);
                ctx.rotate(-Math.PI / 2);
                ctx.drawImage(img, s.rectX, s.rectY, s.rectH, s.rectW, -s.rectW / 2, -s.rectH / 2, s.rectW, s.rectH);
            } else {
                ctx.drawImage(img, s.rectX, s.rectY, s.rectW, s.rectH, dx, dy, s.rectW, s.rectH);
            }
        } finally {
            ctx.restore();
        }
        return true;
    }

    function collectArmatureAtlasImages(armature, out) {
        const seen = new Set();
        const add = src => {
            if (!src || seen.has(src)) return;
            seen.add(src);
            const img = new Image();
            img.onload = () => {};
            img.src = src;
            out.push({ img, src });
        };
        const inspect = obj => {
            if (!obj) return;
            const texs = [
                obj,
                obj.texture,
                obj._texture,
                obj.spriteFrame,
                obj._spriteFrame,
                obj.spriteFrame?.texture,
                obj._spriteFrame?._texture,
                obj.displayData?.textureData,
                obj._displayData?.textureData,
            ];
            for (const t of texs) {
                const src =
                    t?.image?.src ||
                    t?.image?.currentSrc ||
                    t?._image?.src ||
                    t?._image?.currentSrc ||
                    t?.nativeUrl ||
                    t?._nativeUrl ||
                    t?.url ||
                    t?._nativeAsset?.src ||
                    t?._nativeAsset?.url;
                add(src);
            }
            for (const comp of obj._components || obj.components || []) inspect(comp);
            for (const child of obj.children || []) inspect(child);
        };
        for (const slot of armature.getSlots?.() || armature.slots || []) {
            inspect(slot?.display);
            inspect(slot?._display);
            inspect(slot?.rawDisplay);
            inspect(slot?._rawDisplay);
            inspect(slot?.displayDataList?.[0]);
        }
    }
    function drawArmaturePreview(ctx, canvas, armature, selectedName, hiddenMap, slotSprites = []) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const bones = (armature.getBones?.() || []).filter(b => b?.globalTransformMatrix && !hiddenMap[b.name]);
        if (!bones.length) return;
        let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;
        for (const b of bones) {
            const m = b.globalTransformMatrix;
            minX = Math.min(minX, m.tx);
            maxX = Math.max(maxX, m.tx);
            minY = Math.min(minY, m.ty);
            maxY = Math.max(maxY, m.ty);
        }
        const span = Math.max(20, Math.max(maxX - minX, maxY - minY)),
            scale = Math.min((canvas.width - 40) / span, (canvas.height - 40) / span, 2.2);
        armature.__gpPreviewLayout = { scale, minX, maxX, minY, maxY, cw: canvas.width, ch: canvas.height };
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.scale(scale, -scale);
        ctx.translate(-(minX + maxX) / 2, -(minY + maxY) / 2);

        // Skinned pass: real slot textures drawn at their live bone-space transform.
        let drewAny = false;
        for (const s of slotSprites) {
            if (hiddenMap[s.boneName]) continue;
            if (drawSlotSprite(ctx, s)) drewAny = true;
        }

        // Skeleton overlay stays on top (dimmed once textures are visible) so bones remain
        // visible and clickable for offset/hide editing either way.
        const boneAlpha = drewAny ? 0.85 : 1;
        ctx.lineWidth = 1.6 / scale;
        ctx.globalAlpha = boneAlpha;
        for (const b of bones) {
            const m = b.globalTransformMatrix,
                p = b.parent?.globalTransformMatrix,
                len = Number(b.length || 16),
                x2 = m.tx + (m.a || 1) * len,
                y2 = m.ty + (m.c || 0) * len;
            ctx.strokeStyle = b.name === selectedName ? "#60a5fa" : "#9ca3af";
            ctx.fillStyle = b.name === selectedName ? "#60a5fa" : "#d1d5db";
            ctx.beginPath();
            ctx.moveTo(m.tx, m.ty);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(m.tx, m.ty, b.name === selectedName ? 4 : 3, 0, Math.PI * 2);
            ctx.fill();
            if (p) {
                ctx.globalAlpha = boneAlpha * 0.3;
                ctx.beginPath();
                ctx.moveTo(p.tx, p.ty);
                ctx.lineTo(m.tx, m.ty);
                ctx.stroke();
                ctx.globalAlpha = boneAlpha;
            }
        }
        ctx.globalAlpha = 1;
        ctx.restore();

        if (!drewAny) {
            ctx.save();
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.fillStyle = "#7f8ba3";
            ctx.font = "10px monospace";
            ctx.fillText(
                slotSprites.length
                    ? "Slot textures found but not yet loaded…"
                    : "No renderable slot textures found — showing skeleton only.",
                10,
                canvas.height - 10,
            );
            ctx.restore();
        }
    }

    function pauseAnimation(dbComp, armature) {
        try {
            dbComp.armature?.().animation?.stop?.();
        } catch {}
        try {
            armature.animation?.stop?.();
        } catch {}
    }
    function resetAnimation(dbComp, armature) {
        try {
            dbComp.armature?.().animation?.reset?.();
        } catch {}
        try {
            armature.animation?.reset?.();
        } catch {}
    }

    function installPicker(getContext) {
        const key = "__gpNextAssetStudioPickerV2";
        if (window[key]) return;
        const stateObj = (window[key] = { handler: null });
        stateObj.handler = async event => {
            if (!event.shiftKey || event.button !== 0) return;
            const canvas = document.getElementById("GameCanvas") || document.querySelector("canvas");
            if (!canvas || event.target !== canvas) return;
            event.preventDefault();
            event.stopPropagation();
            const { nodes, open, notify } = getContext();
            if (!nodes?.length) {
                notify("No live DragonBones nodes are available.", true);
                return;
            }
            const overlay = document.createElement("div");
            overlay.className = "gp-modal-overlay";
            const modal = document.createElement("div");
            modal.className = "gp-modal";
            const head = document.createElement("div");
            head.className = "gp-modal-head";
            head.innerHTML = `<strong>Pick Live Skeleton</strong><div class="gp-text-muted" style="margin-top:4px">Shift + Left Click detected on the game canvas.</div>`;
            const list = document.createElement("div");
            list.className = "gp-modal-list";
            for (const entry of nodes) {
                const btn = document.createElement("button");
                btn.className = "gp-modal-item";
                btn.textContent = `${entry.name}  (${entry.id})`;
                btn.onclick = () => {
                    overlay.remove();
                    open(entry);
                };
                list.appendChild(btn);
            }
            const foot = document.createElement("div");
            foot.className = "gp-modal-foot";
            const close = document.createElement("button");
            close.className = "gp-btn";
            close.textContent = "Cancel";
            close.onclick = () => overlay.remove();
            foot.appendChild(close);
            modal.append(head, list, foot);
            overlay.appendChild(modal);
            document.body.appendChild(overlay);
            overlay.onclick = e => {
                if (e.target === overlay) overlay.remove();
            };
        };
        window.addEventListener("mousedown", stateObj.handler, true);
    }
})();

function render(container) {
    // The full implementation lives in the IIFE above; this bridge uses a small temporary host.
    // Re-run the module renderer by invoking the internal render implementation stored during initialization.
    const host = document.createElement("div");
    host.style.display = "contents";
    container.appendChild(host);
    const run = window.__gpNextAssetStudioRender;
    if (typeof run !== "function") {
        container.innerHTML = `<div style="padding:12px;color:#fca5a5;background:#111827">Asset Studio renderer failed to initialize.</div>`;
        return;
    }
    container.removeChild(host);
    run(container);
}

export { render };

// Expose the implementation without polluting the public API more than necessary.
// This is assigned after module evaluation so render() can stay ES-module compatible.
(function exposeInternal() {
    if (window.__gpNextAssetStudioRender) return;
    // The IIFE above defines the real implementation through a one-time DOM bootstrap hook.
})();
