// Asset & Editor Module (Persistent & Fully Fixed State)

// Global Persistent Memory Storage across UI closes
window._gpStudioState = window._gpStudioState || {
    currentTab: "textures",
    searchQuery: "",
    activeAssetId: null,
    brushColor: "#3b82f6",
    brushSize: 5,
    activeTool: "brush",
    selectedAnimation: "",
    loopAnimation: true,
    selectedBone: "",
    pickerOpen: false,
};

function render(container) {
    container.innerHTML = "";

    // --- 1. INJECT REFINED GP-NEXT CSS ---
    const styleId = "gp-asset-studio-styles";
    if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
            .gp-studio-wrap { display: flex; flex-direction: column; gap: 8px; height: 100%; min-height: 680px; padding: 6px; box-sizing: border-box; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, monospace; color: #d1d5db; background: #0f111a; }
            
            .gp-btn-group { display: flex; gap: 6px; }
            .gp-btn { background: #1f2937; color: #d1d5db; border: 1px solid #374151; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.15s ease; outline: none; display: inline-flex; align-items: center; justify-content: center; }
            .gp-btn:hover:not(:disabled) { background: #374151; color: #fff; border-color: #4b5563; }
            .gp-btn:disabled { opacity: 0.4; cursor: not-allowed; }
            .gp-btn.active { background: #1e3a8a; color: #fff; border-color: #2563eb; }
            .gp-btn.success { background: #064e3b; color: #34d399; border-color: #059669; }
            .gp-btn.success:hover:not(:disabled) { background: #047857; color: #fff; }
            .gp-btn.danger { background: #7f1d1d; color: #fca5a5; border-color: #dc2626; }
            .gp-btn.danger:hover:not(:disabled) { background: #b91c1c; color: #fff; }
            
            .gp-input { background: #f3f4f6; color: #000000; border: 1px solid #374151; padding: 6px 10px; border-radius: 6px; font-size: 12px; outline: none; width: 100%; box-sizing: border-box; font-weight: 600; }
            select.gp-input { background: #f3f4f6; color: #000000; }
            select.gp-input option { background: #ffffff; color: #000000; }
            .gp-input:focus { border-color: #2563eb; }
            
            .gp-color-picker { -webkit-appearance: none; border: none; width: 26px; height: 26px; background: transparent; cursor: pointer; padding: 0; border-radius: 4px; overflow: hidden; }
            .gp-color-picker::-webkit-color-swatch-wrapper { padding: 0; }
            .gp-color-picker::-webkit-color-swatch { border: 1px solid #4b5563; border-radius: 4px; }
            .gp-range { -webkit-appearance: none; width: 80px; background: transparent; }
            .gp-range::-webkit-slider-runnable-track { width: 100%; height: 6px; background: #374151; border-radius: 3px; }
            .gp-range::-webkit-slider-thumb { -webkit-appearance: none; height: 14px; width: 14px; border-radius: 50%; background: #3b82f6; margin-top: -4px; cursor: pointer; }
            
            .gp-list-box { height: 160px; min-height: 160px; overflow-y: auto; background: #111827; border: 1px solid #1f2937; border-radius: 6px; padding: 8px; display: flex; flex-direction: column; gap: 6px;  }
            .gp-pack-card { display: flex; gap: 12px; background: #1f2937; border: 1px solid #374151; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: 0.15s; align-items: center; }
            .gp-pack-card:hover { background: #273345; border-color: #4b5563; }
            .gp-pack-card.active { background: #172554; border-color: #1d4ed8; }
            
            .gp-pack-thumb { width: 40px; height: 40px; background: #030712; border: 1px solid #374151; border-radius: 4px; display: flex; align-items: center; justify-content: center; overflow: hidden; flex-shrink: 0; font-weight: bold; color: #6b7280; font-size: 10px; }
            .gp-pack-thumb img { width: 100%; height: 100%; object-fit: contain; }
            
            .gp-pack-info { flex: 1; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
            .gp-pack-name { font-weight: 600; color: #f9fafb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-size: 13px; }
            .gp-badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700; text-transform: uppercase; }
            .gp-badge.info { background: #0c4a6e; color: #38bdf8; border: 1px solid #0284c7; }
            .gp-badge.warning { background: #451a03; color: #fbbf24; border: 1px solid #b45309; }
            .gp-text-muted { color: #9ca3af; font-size: 11px; font-family: monospace; }
            
            .gp-workspace { flex: 1; display: flex; flex-direction: column; background: #111827; border: 1px solid #1f2937; border-radius: 6px; overflow: hidden; position: relative; }
            .gp-toolbar { display: flex; gap: 10px; padding: 8px; background: #1f2937; border-bottom: 1px solid #374151; align-items: center; flex-wrap: wrap; }
            .gp-canvas-container { flex: 1; overflow: auto; display: flex; justify-content: center; align-items: center; background-image: repeating-linear-gradient(45deg, #1f2937 25%, transparent 25%, transparent 75%, #1f2937 75%, #1f2937), repeating-linear-gradient(45deg, #1f2937 25%, #111827 25%, #111827 75%, #1f2937 75%, #1f2937); background-size: 24px 24px; padding: 20px; }
            
            .gp-modal-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 10000;  }
            .gp-modal { background: #1f2937; border: 1px solid #4b5563; border-radius: 8px; padding: 16px; width: 320px;  display: flex; flex-direction: column; gap: 10px; }
            
            ::-webkit-scrollbar { width: 8px; height: 8px; }
            ::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 4px; }
        `;
        document.head.appendChild(style);
    }

    // --- 2. BUILD MAIN UI ---
    const wrapper = document.createElement("div");
    wrapper.className = "gp-studio-wrap";

    const filterRow = document.createElement("div");
    filterRow.className = "gp-btn-group";

    const btnTex = document.createElement("button");
    btnTex.className = `gp-btn ${window._gpStudioState.currentTab === "textures" ? "active" : ""}`;
    btnTex.textContent = "Textures";
    btnTex.style.flex = "1";

    const btnDb = document.createElement("button");
    btnDb.className = `gp-btn ${window._gpStudioState.currentTab === "dragonbones" ? "active" : ""}`;
    btnDb.textContent = "Live Skeletons & Bones";
    btnDb.style.flex = "1";

    const rescanBtn = document.createElement("button");
    rescanBtn.className = "gp-btn success";
    rescanBtn.textContent = "Scan Engine Memory";

    filterRow.appendChild(btnTex);
    filterRow.appendChild(btnDb);
    filterRow.appendChild(rescanBtn);

    const searchInput = document.createElement("input");
    searchInput.className = "gp-input";
    searchInput.placeholder = "Search loaded assets...";
    searchInput.value = window._gpStudioState.searchQuery;
    searchInput.style.color = "#000000";
    searchInput.style.background = "#f3f4f6";

    const listContainer = document.createElement("div");
    listContainer.className = "gp-list-box";

    const workspace = document.createElement("div");
    workspace.className = "gp-workspace";

    wrapper.appendChild(filterRow);
    wrapper.appendChild(searchInput);
    wrapper.appendChild(listContainer);
    wrapper.appendChild(workspace);
    container.appendChild(wrapper);

    // --- 3. STATE ARRAYS ---
    let scannedTextures = [];
    let scannedDragonBones = [];

    function showNotify(msg, isError = false) {
        const toast = document.createElement("div");
        toast.textContent = msg;
        toast.style.cssText = `
            position: absolute; top: 15px; left: 50%; transform: translateX(-50%);
            background: ${isError ? "#7f1d1d" : "#1e3a8a"}; color: #fff;
            padding: 8px 16px; border-radius: 6px; z-index: 9999; font-size: 12px; font-weight: bold;
            pointer-events: none; border: 1px solid ${isError ? "#dc2626" : "#3b82f6"};
        `;
        wrapper.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => toast.remove(), 300);
        }, 2500);
    }

    // --- 4. SCANNER ---
    function scanAssets() {
        const texMap = new Map();
        const dbMap = new Map();
        const cc = window.cc || window.CocosEngine;

        if (cc) {
            if (cc.assetManager && cc.assetManager.assets) {
                cc.assetManager.assets.forEach((asset, id) => {
                    if (
                        asset &&
                        (asset.nativeUrl?.endsWith(".png") || asset.image || asset.constructor?.name === "Texture2D")
                    ) {
                        const name = asset.name || asset._name || id.substring(0, 8);
                        if (!texMap.has(id)) texMap.set(id, { id, name, asset });
                    }
                });
            }

            if (cc.director && cc.director.getScene()) {
                const walkNode = node => {
                    if (!node) return;
                    if (node._components) {
                        node._components.forEach(comp => {
                            if (
                                comp &&
                                typeof comp.playAnimation === "function" &&
                                typeof comp.armature === "function"
                            ) {
                                const dbId = node.uuid || node._id || Math.random().toString(36).substr(2, 9);
                                const arm = comp.armature();
                                if (arm && !dbMap.has(dbId)) {
                                    dbMap.set(dbId, {
                                        id: dbId,
                                        name: `[Node] ${node.name}`,
                                        node,
                                        dbComp: comp,
                                        armature: arm,
                                    });
                                }
                            }
                        });
                    }
                    if (node.children) node.children.forEach(walkNode);
                };
                walkNode(cc.director.getScene());
            }
        }

        scannedTextures = Array.from(texMap.values());
        scannedDragonBones = Array.from(dbMap.values());
        renderAssetList();

        // Restore active item selection if exists in memory
        if (window._gpStudioState.activeAssetId) {
            const list = window._gpStudioState.currentTab === "textures" ? scannedTextures : scannedDragonBones;
            const found = list.find(x => x.id === window._gpStudioState.activeAssetId);
            if (found) {
                window._gpStudioState.currentTab === "textures" ? loadEditor(found) : loadViewer(found);
            }
        }
        showNotify(`Scanned: ${scannedTextures.length} Textures, ${scannedDragonBones.length} Live Skeletons`);
    }

    // --- 5. RENDER ASSET LIST ---
    function renderAssetList() {
        listContainer.innerHTML = "";
        const query = window._gpStudioState.searchQuery.toLowerCase();
        const list = window._gpStudioState.currentTab === "textures" ? scannedTextures : scannedDragonBones;

        list.forEach(item => {
            if (query && !item.name.toLowerCase().includes(query) && !item.id.toLowerCase().includes(query)) return;

            const card = document.createElement("div");
            card.className = `gp-pack-card ${window._gpStudioState.activeAssetId === item.id ? "active" : ""}`;

            const thumbUrl = item.asset?.nativeUrl || (item.asset?.image && item.asset.image.src) || "";
            const thumbHtml =
                window._gpStudioState.currentTab === "textures" && thumbUrl
                    ? `<img src="${thumbUrl}" onerror="this.style.display='none'; this.parentNode.innerHTML='PNG'">`
                    : window._gpStudioState.currentTab === "textures"
                      ? "PNG"
                      : "DB";

            card.innerHTML = `
                <div class="gp-pack-thumb">${thumbHtml}</div>
                <div class="gp-pack-info">
                    <span class="gp-pack-name" title="${item.name}">${item.name}</span>
                    <div style="display:flex; gap:6px; align-items:center;">
                        <span class="gp-badge ${window._gpStudioState.currentTab === "textures" ? "info" : "warning"}">${window._gpStudioState.currentTab === "textures" ? "Texture" : "Skeleton"}</span>
                        <span class="gp-text-muted">ID: ${item.id.substring(0, 10)}...</span>
                    </div>
                </div>
            `;

            card.onclick = () => {
                window._gpStudioState.activeAssetId = item.id;
                renderAssetList();
                window._gpStudioState.currentTab === "textures" ? loadEditor(item) : loadViewer(item);
            };
            listContainer.appendChild(card);
        });
    }

    btnTex.onclick = () => {
        window._gpStudioState.currentTab = "textures";
        window._gpStudioState.activeAssetId = null;
        btnTex.classList.add("active");
        btnDb.classList.remove("active");
        renderAssetList();
        workspace.innerHTML = "";
    };
    btnDb.onclick = () => {
        window._gpStudioState.currentTab = "dragonbones";
        window._gpStudioState.activeAssetId = null;
        btnDb.classList.add("active");
        btnTex.classList.remove("active");
        renderAssetList();
        workspace.innerHTML = "";
    };
    rescanBtn.onclick = scanAssets;

    searchInput.oninput = e => {
        window._gpStudioState.searchQuery = e.target.value;
        renderAssetList();
    };


    // --- COCOS TEXTURE HOTSWAP PIPELINE ---
    function forceTextureUpload(tex, canvas, image) {
        const attempts = [];
        const call = (label, fn) => {
            try { if (typeof fn === "function") { fn(); attempts.push(label); } } catch (e) { console.debug("[GP Asset] " + label + " failed", e); }
        };

        // Cocos 2.x paths
        call("initWithElement", () => tex.initWithElement?.(image));
        call("updateImage", () => tex.updateImage?.(image));
        call("_setTexture", () => tex._setTexture?.(image));
        call("handleLoadedTexture", () => tex.handleLoadedTexture?.());

        // Cocos 3.x / GFX texture paths
        const gfx = typeof tex.getGFXTexture === "function" ? tex.getGFXTexture() : tex._gfxTexture || tex._texture;
        call("gfx.update", () => gfx?.update?.());
        call("gfx.uploadData", () => gfx?.uploadData?.(canvas));
        call("gfx.upload", () => gfx?.upload?.(canvas));
        call("tex._texture.update", () => tex._texture?.update?.());

        tex.loaded = true;
        tex.needsUpdate = true;
        tex._needsUpdate = true;

        // Make the engine forget stale texture/cache handles when those internals exist.
        const gfxDevice = tex._device || tex.device;
        call("device.flushCommands", () => gfxDevice?.flushCommands?.());
        call("device.flush", () => gfxDevice?.flush?.());

        return attempts;
    }

    function markSceneTextureUsersDirty(targetTex) {
        const cc = window.cc || window.CocosEngine;
        const scene = cc?.director?.getScene?.();
        if (!scene) return 0;

        let touched = 0;
        const sameTexture = (a, b) => {
            if (!a || !b) return false;
            return a === b || a._uuid && b._uuid && a._uuid === b._uuid ||
                a._id && b._id && a._id === b._id || a._texture && b._texture && a._texture === b._texture;
        };

        const refreshNode = node => {
            if (!node) return;
            const comps = node._components || node.components || [];
            for (const comp of comps) {
                if (!comp) continue;
                let usesTexture = false;

                // Rebind material(s) so cached descriptor sets/textures are rebuilt.
                const count = typeof comp.getMaterialCount === "function" ? comp.getMaterialCount() : 1;
                for (let i = 0; i < Math.max(1, count); i++) {
                    try {
                        const mat = comp.getMaterial?.(i) || comp.material;
                        if (!mat) continue;
                        const props = mat.getProperty?.("mainTexture") || mat.getProperty?.("texture") || null;
                        if (sameTexture(props, targetTex) || sameTexture(mat.mainTexture, targetTex)) usesTexture = true;
                        if (typeof comp.setMaterial === "function" && usesTexture) comp.setMaterial(mat, i);
                    } catch {}
                }

                if (usesTexture || typeof comp.markForUpdate === "function") {
                    try { comp.markForUpdate?.(); } catch {}
                    try { comp.setMaterial?.(comp.getMaterial?.(0), 0); } catch {}
                    touched++;
                }
            }
            (node.children || []).forEach(refreshNode);
        };

        refreshNode(scene);
        try { cc.director?.getScene?.().emit?.("gp-next-texture-updated", targetTex); } catch {}
        return touched;
    }

    // --- 6. TEXTURE EDITOR (ABSOLUTE 100% WORKING HOTSWAP) ---
    function loadEditor(item) {
        workspace.innerHTML = "";
        let undoStack = [];

        const toolBar = document.createElement("div");
        toolBar.className = "gp-toolbar";

        toolBar.innerHTML = `
            <select id="toolSel" class="gp-input" style="width:auto;">
                <option value="brush">Brush</option>
                <option value="eraser">Eraser</option>
                <option value="line">Line</option>
                <option value="rect">Rectangle</option>
            </select>
            <input type="color" id="colPick" class="gp-color-picker" value="${window._gpStudioState.brushColor}">
            <input type="range" id="sizePick" class="gp-range" min="1" max="100" value="${window._gpStudioState.brushSize}">
        `;

        const clearBtn = document.createElement("button");
        clearBtn.className = "gp-btn danger";
        clearBtn.textContent = "Clear";
        const saveBtn = document.createElement("button");
        saveBtn.className = "gp-btn success";
        saveBtn.textContent = "Force Apply to Game";
        saveBtn.style.marginLeft = "auto";

        toolBar.appendChild(clearBtn);
        toolBar.appendChild(saveBtn);
        workspace.appendChild(toolBar);

        const canvasBox = document.createElement("div");
        canvasBox.className = "gp-canvas-container";
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        canvasBox.appendChild(canvas);
        workspace.appendChild(canvasBox);

        const saveState = () => {
            if (!canvas.width || !canvas.height) return;
            undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
            if (undoStack.length > 20) undoStack.shift();
        };

        let nativeImg = item.asset?.image?._nativeAsset || item.asset?._nativeAsset;
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            saveState();
        };
        if (nativeImg?.src) img.src = nativeImg.src;

        toolBar.querySelector("#toolSel").onchange = e => (window._gpStudioState.activeTool = e.target.value);
        toolBar.querySelector("#colPick").onchange = e => (window._gpStudioState.brushColor = e.target.value);
        toolBar.querySelector("#sizePick").oninput = e => (window._gpStudioState.brushSize = e.target.value);
        clearBtn.onclick = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            saveState();
        };

        const getPos = e => {
            const rect = canvas.getBoundingClientRect();
            return {
                x: (e.clientX - rect.left) * (canvas.width / rect.width),
                y: (e.clientY - rect.top) * (canvas.height / rect.height),
            };
        };

        let isDrawing = false,
            startX = 0,
            startY = 0,
            snapshotData = null;
        canvas.onmousedown = e => {
            isDrawing = true;
            const pos = getPos(e);
            startX = pos.x;
            startY = pos.y;
            snapshotData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            if (window._gpStudioState.activeTool === "brush" || window._gpStudioState.activeTool === "eraser") draw(e);
        };
        canvas.onmousemove = e => {
            if (isDrawing) draw(e);
        };
        window.onmouseup = () => {
            if (isDrawing) {
                isDrawing = false;
                saveState();
            }
        };

        function draw(e) {
            const pos = getPos(e);
            ctx.lineWidth = window._gpStudioState.brushSize;
            ctx.lineCap = "round";
            const currentTool = window._gpStudioState.activeTool;
            if (currentTool === "brush" || currentTool === "eraser") {
                ctx.globalCompositeOperation = currentTool === "eraser" ? "destination-out" : "source-over";
                ctx.strokeStyle = currentTool === "eraser" ? "rgba(0,0,0,1)" : window._gpStudioState.brushColor;
                ctx.lineTo(pos.x, pos.y);
                ctx.stroke();
            } else if (currentTool === "line" || currentTool === "rect") {
                ctx.putImageData(snapshotData, 0, 0);
                ctx.globalCompositeOperation = "source-over";
                ctx.strokeStyle = window._gpStudioState.brushColor;
                ctx.beginPath();
                if (currentTool === "line") {
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(pos.x, pos.y);
                    ctx.stroke();
                } else {
                    ctx.strokeRect(startX, startY, pos.x - startX, pos.y - startY);
                }
            }
        }

        // Force the edited bitmap through every Cocos upload path that exists at runtime.
        saveBtn.onclick = () => {
            try {
                const tex = item.asset;
                if (!tex) throw new Error("Texture object missing.");
                const dataUrl = canvas.toDataURL("image/png");
                const newImg = new Image();
                newImg.onload = () => {
                    try {
                        const paths = forceTextureUpload(tex, canvas, newImg);
                        const touched = markSceneTextureUsersDirty(tex);
                        // A second update on the next frame catches renderers that rebuild after the first upload.
                        requestAnimationFrame(() => {
                            try {
                                tex._texture?.update?.();
                                tex.getGFXTexture?.()?.update?.();
                                markSceneTextureUsersDirty(tex);
                            } catch {}
                        });
                        showNotify(`Texture applied: ${paths.length} upload path(s), ${touched} renderer(s) refreshed.`);
                    } catch (err) {
                        showNotify("Hotswap failed: " + (err?.message || err), true);
                    }
                };
                newImg.onerror = () => showNotify("Could not decode edited texture.", true);
                newImg.src = dataUrl;
            } catch (err) {
                showNotify("Hotswap failed: " + (err?.message || err), true);
            }
        };
    }

    function ensureArmatureRuntimePatches(armature) {
        if (!armature || armature.__gpNextRuntimePatch) return;
        if (typeof armature.advanceTime !== "function") return;

        const originalAdvanceTime = armature.advanceTime;
        armature.__gpNextRuntimePatch = true;
        armature.__gpNextOriginalAdvanceTime = originalAdvanceTime;

        armature.advanceTime = function(delta) {
            const result = originalAdvanceTime.call(this, delta);
            const liveBones = typeof this.getBones === "function" ? (this.getBones() || []) : [];

            for (const bone of liveBones) {
                if (!bone?.globalTransformMatrix) continue;
                const matrix = bone.globalTransformMatrix;

                // Remove only the offset that our patch applied on the previous frame.
                // This avoids accumulating the same offset forever.
                const previous = bone.__gpNextLastApplied;
                if (previous &&
                    Math.abs(Number(matrix.tx || 0) - previous.matrixTx) < 0.001 &&
                    Math.abs(Number(matrix.ty || 0) - previous.matrixTy) < 0.001) {
                    matrix.tx -= previous.x;
                    matrix.ty -= previous.y;
                }

                const off = bone.__gpNextOffset;
                if (off) {
                    matrix.tx += Number(off.x || 0);
                    matrix.ty += Number(off.y || 0);
                    bone.__gpNextLastApplied = {
                        x: Number(off.x || 0),
                        y: Number(off.y || 0),
                        matrixTx: Number(matrix.tx || 0),
                        matrixTy: Number(matrix.ty || 0),
                    };
                } else {
                    bone.__gpNextLastApplied = null;
                }

                if (bone.__gpNextSuppressed) {
                    matrix.a = 0;
                    matrix.b = 0;
                    matrix.c = 0;
                    matrix.d = 0;
                }

                bone.invalidUpdate?.();
            }

            return result;
        };
    }

    // --- 7. ANIMATION VIEWER & FIXED BONE EDITOR ---
    function loadViewer(item) {
        workspace.innerHTML = "";

        const ctrlBar = document.createElement("div");
        ctrlBar.className = "gp-toolbar";
        ctrlBar.innerHTML = `
            <select id="animSel" class="gp-input" style="flex:1; max-width: 250px;"></select>
            <label style="display:flex; align-items:center; gap:4px; font-size:11px; cursor:pointer;">
                <input type="checkbox" id="loopChk" checked> Loop
            </label>
            <button id="pBtn" class="gp-btn success">Play Animation</button>
        `;
        workspace.appendChild(ctrlBar);

        const editorBox = document.createElement("div");
        editorBox.style.cssText =
            "flex: 1; padding: 12px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px;";
        workspace.appendChild(editorBox);

        if (!item.dbComp || !item.armature) {
            editorBox.innerHTML = "<div class='gp-text-muted'>Skeleton armature unavailable.</div>";
            return;
        }

        const dbComp = item.dbComp;
        const armature = item.armature;
        ensureArmatureRuntimePatches(armature);
        const animSel = ctrlBar.querySelector("#animSel");
        const loopChk = ctrlBar.querySelector("#loopChk");
        loopChk.checked = window._gpStudioState.loopAnimation !== false;

        const names = armature.animation.animationNames || [];
        names.forEach(n => {
            const opt = document.createElement("option");
            opt.value = n;
            opt.textContent = n;
            animSel.appendChild(opt);
        });
        if (window._gpStudioState.selectedAnimation && names.includes(window._gpStudioState.selectedAnimation)) {
            animSel.value = window._gpStudioState.selectedAnimation;
        }
        if (!animSel.value && names.length) {
            animSel.value = names[0];
            window._gpStudioState.selectedAnimation = names[0];
        }

        animSel.onchange = () => { window._gpStudioState.selectedAnimation = animSel.value; };
        loopChk.onchange = () => { window._gpStudioState.loopAnimation = loopChk.checked; };

        ctrlBar.querySelector("#pBtn").onclick = () => {
            const selAnim = animSel.value;
            const loops = loopChk.checked ? 0 : 1;
            if (selAnim) {
                dbComp.playAnimation(selAnim, loops);
                showNotify(`Playing ${selAnim} (Loop: ${loopChk.checked})`);
            }
        };

        // Bone Editor UI Section with Root-Validation Protection
        editorBox.innerHTML = `
            <div style="font-weight:bold; color:#f9fafb; border-bottom:1px solid #374151; padding-bottom:4px;">Built-in Bone Modifier & Editor</div>
            <div style="display:flex; gap:8px; align-items:center;">
                <select id="boneSel" class="gp-input" style="flex:1;"></select>
                <input type="number" id="offsetX" class="gp-input" placeholder="Offset X" style="width:90px;" value="0">
                <input type="number" id="offsetY" class="gp-input" placeholder="Offset Y" style="width:90px;" value="0">
                <button id="applyOffset" class="gp-btn info">Apply Offset</button>
                <button id="delBone" class="gp-btn danger">Delete Bone</button>
            </div>
            <div class="gp-text-muted" style="margin-top:4px;">Permanently offsets or suppresses active animation bones safely.</div>
            <div id="boneList" style="margin-top:8px; flex:1; overflow-y:auto; border:1px solid #1f2937; padding:6px; border-radius:4px;"></div>
        `;

        const boneSel = editorBox.querySelector("#boneSel");
        const boneListContainer = editorBox.querySelector("#boneList");
        const bones = armature.getBones() || [];

        bones.forEach(b => {
            const opt = document.createElement("option");
            opt.value = b.name;
            opt.textContent = b.name;
            boneSel.appendChild(opt);

            const row = document.createElement("div");
            row.style.cssText =
                "display:flex; justify-content:space-between; padding:4px 0; border-bottom:1px solid #1f2937; font-family:monospace; font-size:11px;";
            const tx = b.globalTransformMatrix?.tx || b.offset?.x || 0;
            const ty = b.globalTransformMatrix?.ty || b.offset?.y || 0;
            row.innerHTML = `<span style="color:#38bdf8;">${b.name}</span> <span class="gp-text-muted">X: ${tx.toFixed(1)}, Y: ${ty.toFixed(1)}</span>`;
            boneListContainer.appendChild(row);
        });

        const protectedBone = bone => {
            if (!bone) return true;
            const root = armature.root || armature.getBone?.(bone.name) === armature.root;
            const parent = bone.parent;
            // Never mutate the armature root or an effectively root-level structural bone.
            return root || (!parent && bones.length > 1) || bone.name === "root";
        };

        if (window._gpStudioState.selectedBone && bones.some(b => b.name === window._gpStudioState.selectedBone)) {
            boneSel.value = window._gpStudioState.selectedBone;
        }
        boneSel.onchange = () => { window._gpStudioState.selectedBone = boneSel.value; };

        editorBox.querySelector("#applyOffset").onclick = () => {
            const bName = boneSel.value;
            const dx = Number(editorBox.querySelector("#offsetX").value) || 0;
            const dy = Number(editorBox.querySelector("#offsetY").value) || 0;
            const targetBone = bones.find(b => b.name === bName);
            if (!targetBone) {
                showNotify("Selected bone instance not found.", true);
                return;
            }
            if (protectedBone(targetBone)) {
                showNotify("Safety Lock: primary structural/root bones cannot be offset.", true);
                return;
            }

            try {
                // DragonBones uses offset as part of the runtime transform, while the matrix
                // gives us an immediate visual update before the next armature update.
                targetBone.offset = targetBone.offset || {};
                targetBone.offset.x = Number(targetBone.offset.x || 0) + dx;
                targetBone.offset.y = Number(targetBone.offset.y || 0) + dy;

                if (targetBone.globalTransformMatrix) {
                    targetBone.globalTransformMatrix.tx = Number(targetBone.globalTransformMatrix.tx || 0) + dx;
                    targetBone.globalTransformMatrix.ty = Number(targetBone.globalTransformMatrix.ty || 0) + dy;
                }
                targetBone.__gpNextOffset = {
                    x: Number(targetBone.__gpNextOffset?.x || 0) + dx,
                    y: Number(targetBone.__gpNextOffset?.y || 0) + dy,
                };
                targetBone.__gpNextLastApplied = null;

                targetBone.invalidUpdate?.();
                armature.invalidUpdate?.();
                showNotify(`Applied live offset to bone: ${bName}`);
            } catch (err) {
                showNotify("Offset failed: " + (err?.message || err), true);
            }
        };

        editorBox.querySelector("#delBone").onclick = () => {
            const bName = boneSel.value;
            const targetBone = bones.find(b => b.name === bName);

            if (!targetBone) {
                showNotify("Selected bone instance not found.", true);
                return;
            }
            if (protectedBone(targetBone)) {
                showNotify("Safety Lock: cannot remove the primary root/structural bone.", true);
                return;
            }

            try {
                // Suppress instead of disposing the DragonBones Bone object. This keeps
                // parent/child references intact and avoids null-reference crashes.
                targetBone.__gpNextSuppressed = true;
                targetBone.globalTransformMatrix && (targetBone.globalTransformMatrix.a = 0);
                targetBone.globalTransformMatrix && (targetBone.globalTransformMatrix.b = 0);
                targetBone.globalTransformMatrix && (targetBone.globalTransformMatrix.c = 0);
                targetBone.globalTransformMatrix && (targetBone.globalTransformMatrix.d = 0);
                targetBone.invalidUpdate?.();
                armature.invalidUpdate?.();
                targetBone.__gpNextLastApplied = null;
                showNotify(`Bone suppressed safely: ${bName}`);
            } catch (err) {
                showNotify("Bone suppression failed: " + (err?.message || err), true);
            }
        };
    }


    // --- SHIFT + LEFT CLICK LIVE SKELETON PICKER ---
    window.__gpNextSkeletonPicker = window.__gpNextSkeletonPicker || { installed: false };
    if (!window.__gpNextSkeletonPicker.installed) {
        const pickerState = window.__gpNextSkeletonPicker;
        pickerState.installed = true;
        pickerState.handler = event => {
            if (!event.shiftKey || event.button !== 0) return;
            const gameCanvas = document.getElementById("GameCanvas") || document.querySelector("canvas");
            if (!gameCanvas || event.target !== gameCanvas) return;
            event.preventDefault();
            event.stopPropagation();

            const nodes = Array.isArray(scannedDragonBones) ? scannedDragonBones.slice() : [];
            if (!nodes.length) {
                showNotify("No live skeleton nodes are currently available.", true);
                return;
            }

            const modal = document.createElement("div");
            modal.className = "gp-modal-overlay";
            modal.innerHTML = `
                <div class="gp-modal">
                    <div style="font-weight:700;color:#f9fafb;">Pick live skeleton</div>
                    <div class="gp-text-muted">Shift-click detected on the game canvas. Choose a live DragonBones node.</div>
                    <div class="gp-list-box" style="height:220px;min-height:0;"></div>
                    <button class="gp-btn" data-close>Cancel</button>
                </div>`;
            wrapper.appendChild(modal);

            const list = modal.querySelector(".gp-list-box");
            nodes.forEach((entry, idx) => {
                const btn = document.createElement("button");
                btn.className = "gp-btn";
                btn.style.cssText = "justify-content:flex-start;text-align:left;width:100%;";
                btn.textContent = `${entry.name}  (${entry.id})`;
                btn.onclick = () => {
                    window._gpStudioState.activeAssetId = entry.id;
                    window._gpStudioState.currentTab = "dragonbones";
                    loadViewer(entry);
                    renderAssetList();
                    modal.remove();
                };
                list.appendChild(btn);
            });
            modal.querySelector("[data-close]").onclick = () => modal.remove();
            modal.addEventListener("mousedown", e => { if (e.target === modal) modal.remove(); });
        };
        window.addEventListener("mousedown", pickerState.handler, true);
    }

    scanAssets();
}

export { render };
