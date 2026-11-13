let currentDialog;

export async function openGameKeybinds(binds, language = 'en', createDialog) {
    currentDialog?.close();
    const response = await fetch(new URL('./game-keybind-window.html', import.meta.url));
    if (!response.ok) throw new Error(`Keybind window HTTP ${response.status}`);
    let html = await response.text();
    html = html.replace("const lang = new URLSearchParams(location.search).get('lang') || 'zh';", `const lang = ${JSON.stringify(language === 'zh' ? 'zh' : 'en')};`);
    const bootstrap = `<script>window.keybindAPI={get:()=>new Promise(resolve=>{window.addEventListener('message',function receive(event){if(event.source===parent&&event.data?.type==='pvzge-keybind-payload'){window.removeEventListener('message',receive);resolve(event.data.binds)}});parent.postMessage({type:'pvzge-keybind-get'},'*')}),apply:binds=>parent.postMessage({type:'pvzge-keybind-apply',binds},'*'),cancel:()=>parent.postMessage({type:'pvzge-keybind-cancel'},'*')};<\/script>`;
    html = html.replace('<head>', '<head>' + bootstrap);
    return new Promise(resolve => {
        const dialog = currentDialog = createDialog(language === 'zh' ? '键位设置' : 'Key bindings');
        const frame = document.createElement('iframe'); frame.title = dialog.getAttribute('aria-label');
        frame.setAttribute('sandbox', 'allow-scripts'); frame.style.cssText = 'width:100%;height:65vh;border:0';
        let result = null;
        const listener = event => {
            if (event.source !== frame.contentWindow) return;
            if (event.data?.type === 'pvzge-keybind-get') frame.contentWindow.postMessage({ type: 'pvzge-keybind-payload', binds }, '*');
            if (event.data?.type === 'pvzge-keybind-apply') {
                const value = event.data.binds;
                if (!value || typeof value !== 'object' || Object.keys(value).length !== Object.keys(binds).length || Object.keys(binds).some(key => typeof value[key] !== 'string' || !/^[A-Z0-9_]+$/.test(value[key]))) return;
                result = Object.fromEntries(Object.keys(binds).map(key => [key, value[key]])); dialog.close();
            }
            if (event.data?.type === 'pvzge-keybind-cancel') dialog.close();
        };
        window.addEventListener('message', listener);
        dialog.addEventListener('close', () => { window.removeEventListener('message', listener); if (currentDialog === dialog) currentDialog = null; resolve(result); }, { once: true });
        frame.srcdoc = html; dialog.append(frame); dialog.showModal();
    });
}
