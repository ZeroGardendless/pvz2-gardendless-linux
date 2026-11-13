import {gameFetch} from './game-http.js';
const base = 'https://levels.pvzge.com/api/github-levels';

async function readBytes(url, limit) {
    const response = await gameFetch(url, limit, { cache: 'no-store', redirect: 'error', signal: AbortSignal.timeout(20000) });
    if (!response.ok) throw new Error(`Level HTTP ${response.status}`);
    if (Number(response.headers.get('content-length')) > limit) throw new Error('Level size limit');
    const reader = response.body.getReader(), chunks = []; let size = 0;
    try { for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > limit) throw new Error('Level size limit'); chunks.push(value); } }
    finally { await reader.cancel(); }
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; } return bytes;
}

export function initializeGithubWindow(api, createDialog) {
    const play = new Set(), content = new Set(), changed = new Set(); let dialog, previous = new Map();
    api.onGithubPlayLevel = listener => { play.add(listener); return () => play.delete(listener); };
    api.onGithubPlayLevelContent = listener => { content.add(listener); return () => content.delete(listener); };
    api.onGithubChangedPaths = listener => { changed.add(listener); return () => changed.delete(listener); };
    api.closeGithubWindow = () => { dialog?.close(); dialog = null; return true; };
    api.isGithubWindowOpen = () => !!dialog?.open;
    api.openGithubWindow = async (_records, language = 'en', names = {}) => {
        api.closeGithubWindow(); const zh = language === 'zh';
        const current = dialog = createDialog(zh ? '社区关卡' : 'Community levels');
        current.addEventListener('close', () => { if (dialog === current) dialog = null; }, { once: true });
        const search = document.createElement('input'); search.type = 'search'; search.placeholder = zh ? '搜索关卡' : 'Search levels'; search.style.cssText = 'width:100%;box-sizing:border-box;margin-bottom:12px';
        const status = document.createElement('p'); status.textContent = zh ? '加载中…' : 'Loading…';
        const list = document.createElement('div'); list.style.cssText = 'max-height:60vh;overflow:auto'; current.append(search, status, list); current.showModal();
        try {
            const tree = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(await readBytes(base + '/git/trees/main?recursive=1', 25 * 1024 * 1024)));
            if (tree.truncated !== false || !Array.isArray(tree.tree)) throw new Error('Invalid level catalog');
            const levels = tree.tree.filter(item => item.type === 'blob' && /\.json$/i.test(item.path) && /^[a-f0-9]{40}$/.test(item.sha) && Number.isSafeInteger(item.size) && item.size > 0 && item.size <= 10_000_000 && !/[\\\x00-\x1f]/.test(item.path) && item.path.split('/').every(part => part && part !== '.' && part !== '..'));
            const updates = levels.filter(item => previous.has(item.path) && previous.get(item.path) !== item.sha).map(item => item.path);
            previous = new Map(levels.map(item => [item.path, item.sha])); if (updates.length) for (const listener of changed) listener(updates);
            const render = () => {
                list.replaceChildren(); const matches = levels.filter(item => `${item.path} ${names[item.path] || ''}`.toLowerCase().includes(search.value.toLowerCase())); status.textContent = `${matches.length}`;
                for (const item of matches.slice(0, 100)) {
                    const row = document.createElement('div'); row.style.cssText = 'display:flex;gap:12px;align-items:center;padding:6px 0';
                    const label = document.createElement('span'); label.textContent = names[item.path] || item.path; label.title = item.path; label.style.cssText = 'flex:1;overflow-wrap:anywhere';
                    const button = document.createElement('button'); button.textContent = zh ? '游玩' : 'Play';
                    button.onclick = async () => {
                        button.disabled = true;
                        try {
                            const bytes = await readBytes(base + '/raw/main/' + item.path.split('/').map(encodeURIComponent).join('/'), item.size);
                            if (bytes.length !== item.size) throw new Error('Level length mismatch');
                            const header = new TextEncoder().encode(`blob ${bytes.length}\0`), framed = new Uint8Array(header.length + bytes.length); framed.set(header); framed.set(bytes, header.length);
                            const sha = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1', framed)), b => b.toString(16).padStart(2, '0')).join(''); if (sha !== item.sha) throw new Error('Level hash mismatch');
                            const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes), data = JSON.parse(text); if (!Array.isArray(data.objects || data.LevelData)) throw new Error('Invalid level data');
                            api.closeGithubWindow(); for (const listener of content) listener(text);
                        } catch (error) { status.textContent = error.message; button.disabled = false; }
                    };
                    row.append(label, button); list.append(row);
                }
            };
            if (dialog !== current) return; search.oninput = render; render();
        } catch (error) { if (dialog === current) status.textContent = error.message; }
    };
}
