import {gameFetch} from './game-http.js';
import marked from './vendor/marked.min.js';
import DOMPurify from './vendor/purify.min.js';
import { openGameKeybinds } from './game-keybinds.js';
import { initializeGithubWindow } from './game-github-window.js';

const gameDocuments = new Set(['docs/about.en.md', 'docs/about.zh.md', 'docs/update.en.md', 'docs/update.zh.md']);
let markdownDialog, updateDialog, markdownRequest = 0, updateRequest = 0;

export function createGameDialog(title) {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', title);
    dialog.style.cssText = 'width:min(900px,90vw);max-height:85vh;padding:16px;border:1px solid #777;border-radius:12px;background:#202020;color:#eee;font:16px system-ui';
    const header = document.createElement('header'); header.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:12px';
    const heading = document.createElement('h2'); heading.textContent = title; heading.style.margin = '0';
    const close = document.createElement('button'); close.textContent = '×'; close.setAttribute('aria-label', 'Close');
    close.style.cssText = 'font-size:24px;color:inherit;background:transparent;border:0;cursor:pointer'; close.onclick = () => dialog.close();
    header.append(heading, close); dialog.append(header);
    dialog.addEventListener('keydown', event => event.stopPropagation());
    dialog.addEventListener('close', () => dialog.remove(), { once: true });
    document.body.append(dialog); return dialog;
}

export function renderGameMarkdown(content) {
    return DOMPurify.sanitize(marked.parse(content, { breaks: true, gfm: true }));
}

function appendMarkdown(dialog, content, api) {
    const body = document.createElement('div'); body.className = 'game-markdown';
    body.innerHTML = '<style>.game-markdown{line-height:1.65;overflow-wrap:anywhere}.game-markdown a{color:#8cf}.game-markdown img{max-width:100%}.game-markdown pre{overflow:auto}.game-markdown code{background:#333;padding:2px 4px}.game-markdown table{border-collapse:collapse}.game-markdown td,.game-markdown th{border:1px solid #666;padding:6px}</style>' + renderGameMarkdown(content);
    body.addEventListener('click', event => {
        const anchor = event.target.closest('a[href]'); if (!anchor) return;
        event.preventDefault(); const url = new URL(anchor.getAttribute('href'), document.baseURI);
        if (['https:', 'http:'].includes(url.protocol)) void api.openUrl(url.href);
    });
    dialog.append(body);
}

export async function getGameVersionInfo() {
    const response = await fetch(new URL('app-info.json', document.baseURI));
    if (!response.ok) throw new Error(`Version information HTTP ${response.status}`);
    return response.json();
}

export async function openGameDocument(path, title = '') {
    if (!gameDocuments.has(path)) throw new Error('Unknown game document');
    const request = ++markdownRequest;
    const response = await fetch(new URL(path, document.baseURI));
    if (!response.ok) throw new Error(`Game document HTTP ${response.status}`);
    const content = await response.text(); if (request !== markdownRequest) return;
    markdownDialog?.close(); const dialog = markdownDialog = createGameDialog(title);
    appendMarkdown(dialog, content, window.electronAPI);
    dialog.addEventListener('close', () => { if (markdownDialog === dialog) markdownDialog = null; }, { once: true });
    dialog.showModal();
}

export function initializeGamePlatform(api) {
    api.getVersionInfo = getGameVersionInfo;
    api.openMarkdownWindow = openGameDocument;
    api.closeMarkdownWindow = () => { markdownRequest++; markdownDialog?.close(); markdownDialog = null; };
    api.isMarkdownWindowOpen = () => !!markdownDialog?.open;
    api.closeUpdateWindow = () => { updateRequest++; updateDialog?.close(); updateDialog = null; };
    api.checkRemoteUpdate = async (language = 'en') => {
        const request = ++updateRequest;
        try {
            const [local, response] = await Promise.all([getGameVersionInfo(), gameFetch('https://pvzge.com/jsons/gameinfo.json', 1024 * 1024, { signal: AbortSignal.timeout(6000) })]);
            if (!response.ok) throw new Error(`Update information HTTP ${response.status}`);
            const remote = await response.json(), version = remote.InsideVersion;
            if (!/^\d+\.\d+\.\d+$/.test(version)) throw new Error('Invalid update version');
            if (local.Version.localeCompare(version, undefined, { numeric: true }) >= 0) return { shouldUpdate: false, reason: 'up-to-date' };
            if (request !== updateRequest) return { shouldUpdate: false, reason: 'closed' };
            api.closeMarkdownWindow(); updateDialog?.close(); const zh = language === 'zh';
            const dialog = updateDialog = createGameDialog(`${zh ? '发现新版本' : 'New version'} ${version}`);
            appendMarkdown(dialog, (zh ? remote.NewFeatures : remote.EnNewFeatures)?.join('\n\n') || '', api);
            const download = document.createElement('button'); download.textContent = zh ? '前往下载' : 'Download';
            download.onclick = () => api.openUrl(`https://pvzge.com/${zh ? '' : 'en/'}download/`);
            dialog.append(download); dialog.addEventListener('close', () => { if (updateDialog === dialog) updateDialog = null; }, { once: true });
            dialog.showModal(); return { shouldUpdate: true };
        } catch (error) { console.warn('[game-update]', error.message); return { shouldUpdate: false, error: error.message }; }
    };
    api.openKeybindWindow = (binds, language) => openGameKeybinds(binds, language, createGameDialog);
    initializeGithubWindow(api, createGameDialog);
}
