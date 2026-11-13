// Platform bridge for the game's music-pack format and saved playback order.
export function validateMusicManifest(manifest) {
    if (typeof manifest.id !== 'string' || !/^[\w.-]+$/.test(manifest.id) || ['.', '..'].includes(manifest.id)) throw new Error('Invalid music pack id');
    for (const key of ['musicFeatures', 'worldMusic', 'audio']) {
        if (manifest[key] != null && (typeof manifest[key] !== 'object' || Array.isArray(manifest[key]))) throw new Error(`Invalid ${key}`);
    }
    return [...new Set(Object.values(manifest.audio || {}).map(path => {
        if (typeof path !== 'string' || path.split(/[\\/]/).some(part => !part || part === '.' || part === '..') || path.includes(':')) throw new Error('Invalid audio path');
        return path;
    }))];
}
export async function prepareMusicPack(files) {
    const manifestFile = files.find(file => file.path === 'pack.json');
    if (!manifestFile) throw new Error('pack.json is required at the folder root');
    const manifest = JSON.parse(await manifestFile.blob.text()), audioFiles = {};
    for (const relativePath of validateMusicManifest(manifest)) {
        const file = files.find(file => file.path === relativePath.replaceAll('\\', '/'));
        if (!file) throw new Error(`Missing audio: ${relativePath}`);
        audioFiles[relativePath] = file.bytes || file.blob;
    }
    return {manifest, audioFiles};
}

export function initializeMusicPacks(host = window) {
    let database;
    const listeners = new Set();
    const urls = new Map();
    const openDatabase = () => database ||= new Promise((resolve, reject) => {
        const request = host.indexedDB.open('pvzge-music-packs', 1);
        request.onupgradeneeded = () => request.result.createObjectStore('packs', { keyPath: 'manifest.id' });
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    async function request(mode, action) {
        const db = await openDatabase();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction('packs', mode);
            const operation = action(transaction.objectStore('packs'));
            transaction.oncomplete = () => resolve(operation.result);
            transaction.onabort = transaction.onerror = () => reject(transaction.error);
        });
    }
    function changed() {
        for (const url of urls.values()) URL.revokeObjectURL(url);
        urls.clear();
        for (const listener of listeners) listener();
    }
    const api = host.electronAPI ||= {};
    api.listMusicPacks = async () => (await request('readonly', store => store.getAll()))
        .sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER))
        .map(({ manifest }) => ({ ...manifest, dir: manifest.id }));
    api.saveMusicPackOrder = async ids => {
        if (!Array.isArray(ids) || ids.some(id => typeof id !== 'string')) throw new TypeError('Invalid music pack order');
        await request('readwrite', store => {
            const read = store.getAll();
            read.onsuccess = () => {
                const packs = read.result.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER));
                const byId = new Map(packs.map(pack => [pack.manifest.id, pack]));
                const order = [...new Set([...ids, ...packs.map(pack => pack.manifest.id)])].filter(id => byId.has(id));
                order.forEach((id, index) => store.put({ ...byId.get(id), order: index }));
            };
            return read;
        });
        changed();
        return { ok: true };
    };
    api.getMusicPackAudioUrl = async (id, path) => {
        const key = JSON.stringify([id, path]);
        if (!urls.has(key)) {
            const pack = await request('readonly', store => store.get(id));
            if (!pack?.audioFiles[path]) throw new Error(`Missing audio: ${path}`);
            const data = pack.audioFiles[path];
            urls.set(key, URL.createObjectURL(data instanceof Blob ? data : new Blob([data])));
        }
        return urls.get(key);
    };
    api.onMusicPackChanged = listener => { listeners.add(listener); return () => listeners.delete(listener); };
    let dialog;
    api.closeMusicPackWindow = () => { dialog?.close(); dialog?.remove(); dialog = null; };
    api.openMusicPackWindow = async (language = 'en') => {
        api.closeMusicPackWindow();
        const zh = language === 'zh';
        dialog = document.createElement('dialog');
        dialog.setAttribute('aria-label', zh ? '音乐包' : 'Music Packs');
        dialog.innerHTML = `<style>
.pvzge-music-packs {color:#eee;background:#202020;border:1px solid #555;border-radius:12px;padding:20px;width:min(640px,85vw);max-height:80vh;font:16px system-ui;}
.pvzge-music-packs::backdrop {background:#0009;}
.pvzge-music-packs header {display:flex;justify-content:space-between;align-items:center;gap:24px;margin-bottom:16px;}
.pvzge-music-packs h2 {margin:0;font-size:22px;}
.pvzge-music-packs button {font:inherit;color:inherit;background:#333;border:1px solid #777;border-radius:6px;padding:7px 12px;cursor:pointer;}
.pvzge-music-packs li {display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px 0;border-bottom:1px solid #555;}
.pvzge-music-packs li>span:first-child {min-width:0;overflow-wrap:anywhere;}
.pvzge-music-packs .pack-actions {display:flex;gap:8px;flex-shrink:0;}
.pvzge-music-packs ul {list-style:none;padding:0;}
.pvzge-music-packs output {display:block;margin-top:12px;white-space:pre-wrap;}
</style><header><h2>${zh ? '音乐包' : 'Music Packs'}</h2><button data-close>${zh ? '关闭' : 'Close'}</button></header><button data-import>${zh ? '导入音乐包文件夹' : 'Import music pack folder'}</button><ul></ul><output role="status"></output>`;
        const current = dialog;
        current.className = 'pvzge-music-packs';
        const status = current.querySelector('output');
        const report = error => { status.textContent = error.message || String(error); };
        const refresh = async () => {
            const list = current.querySelector('ul');
            list.replaceChildren();
            const packs = await api.listMusicPacks();
            for (const [index, pack] of packs.entries()) {
                const row = document.createElement('li');
                const title = document.createElement('span');
                title.textContent = `${pack.name || pack.id} · ${pack.version || pack.id}`;
                const actions = document.createElement('span');
                actions.className = 'pack-actions';
                for (const direction of [-1, 1]) {
                    const move = document.createElement('button');
                    move.textContent = direction < 0 ? '↑' : '↓';
                    move.setAttribute('aria-label', direction < 0 ? (zh ? '上移' : 'Move up') : (zh ? '下移' : 'Move down'));
                    move.disabled = index + direction < 0 || index + direction >= packs.length;
                    move.onclick = async () => {
                        try {
                            const ids = packs.map(item => item.id);
                            [ids[index], ids[index + direction]] = [ids[index + direction], ids[index]];
                            await api.saveMusicPackOrder(ids); await refresh();
                        } catch (error) { report(error); }
                    };
                    actions.append(move);
                }
                const remove = document.createElement('button');
                remove.textContent = zh ? '移除' : 'Remove';
                remove.onclick = async () => {
                    try { await request('readwrite', store => store.delete(pack.id)); changed(); await refresh(); }
                    catch (error) { report(error); }
                };
                actions.append(remove); row.append(title, actions); list.append(row);
            }
        };
        current.querySelector('[data-close]').onclick = api.closeMusicPackWindow;
        const importFiles = async files => {
            if (!files?.length) return;
            status.textContent = zh ? '正在读取音乐包…' : 'Reading music pack…';
            const pack = await prepareMusicPack(files);
            status.textContent = zh ? '正在导入音乐包…' : 'Importing music pack…';
            const ids = (await api.listMusicPacks()).map(item => item.id);
            // WebKit's IndexedDB Blob writes can stall; typed arrays also keep
            // the stored pack portable while retaining old Blob-based records.
            let total = 0;
            for (const [path, data] of Object.entries(pack.audioFiles)) {
                const bytes = data instanceof Blob ? new Uint8Array(await data.arrayBuffer()) : data;
                total += bytes.byteLength;
                if (bytes.byteLength > 128 * 1024 * 1024 || total > 512 * 1024 * 1024) throw new Error('Music pack exceeds import size limits');
                pack.audioFiles[path] = bytes;
            }
            await request('readwrite', store => store.put(pack));
            await api.saveMusicPackOrder([...ids, pack.manifest.id]); await refresh();
            status.textContent = `${zh ? '已导入' : 'Imported'}: ${pack.manifest.id}`;
        };
        current.querySelector('[data-import]').onclick = async () => {
            if (typeof api.pickMusicPackFiles === 'function') {
                try { await importFiles(await api.pickMusicPackFiles()); }
                catch (error) { report(error); }
                return;
            }
            const input = document.createElement('input');
            input.type = 'file'; input.webkitdirectory = true; input.multiple = true;
            input.onchange = async () => {
                try { await importFiles([...input.files].map(blob => ({path:blob.webkitRelativePath.split('/').slice(1).join('/'),blob}))); }
                catch (error) { report(error); }
            };
            input.click();
        };
        for (const event of ['keydown', 'keyup']) current.addEventListener(event, event => event.stopPropagation());
        document.body.append(current); current.showModal();
        try { await refresh(); } catch (error) { report(error); }
    };
    return api;
}
