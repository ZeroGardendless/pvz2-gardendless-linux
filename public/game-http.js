/** Use Tauri's bounded transport for public game services; previews use fetch. */
export async function gameFetch(url, limit, options = {}) {
    const invoke = globalThis.window?.__TAURI_INTERNALS__?.invoke;
    if (typeof invoke !== 'function') return fetch(url, options);
    const bytes = await invoke('game_http_get', {url, limit});
    return new Response(bytes instanceof ArrayBuffer ? bytes : new Uint8Array(bytes), {
        status: 200, headers: {'content-type': 'application/json; charset=utf-8'},
    });
}
