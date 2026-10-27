import {escapeHtml as esc} from './Store.js';
import {icon} from './Icons.js';
export function packageArt(pack) {
    return `<span class="package-art">${pack.icon?.startsWith('data:image/') ? `<img src="${esc(pack.icon)}" alt="" loading="lazy" decoding="async">` : icon('puzzle')}</span>`;
}
export function packageCards(packs) {
    if (packs === null) return '<div class="empty-state" role="status">Loading datapacks…</div>';
    if (!packs.length) return `<div class="empty-state">${icon('puzzle')}<h3>Your datapacks will appear here</h3><p>Drop a ZIP or mod folder above, or browse Gardenest.</p></div>`;
    return packs.map((pack, index) => {
        const state = pack.warning ? 'Needs attention' : !pack.managed ? 'Imported' : pack.enabled ? 'Enabled' : 'Disabled';
        const tone = pack.warning ? 'red' : pack.enabled ? 'green' : '';
        const tags = `<span class="badge">${esc(pack.kind)}</span><span class="badge ${tone}">${state}</span>${pack.pending ? '<span class="badge">Applies on launch</span>' : ''}`;
        const search = esc([pack.name, pack.author, pack.description, pack.fileName].join(' ').toLowerCase());
        return `<button type="button" class="package-card" data-action="inspect-package" data-index="${index}" data-search="${search}">${packageArt(pack)}<span class="package-info"><strong>${esc(pack.name)}</strong><span class="muted">${esc(pack.author || 'Author not specified')}${pack.version ? ` · ${esc(pack.version)}` : ''}</span><span class="package-description">${esc(pack.description || 'No description provided.')}</span><span class="package-tags">${tags}</span></span>${icon('arrow')}</button>`;
    }).join('');
}
export function packageDetails(pack) {
    return `<div class="package-detail-head">${packageArt(pack)}<div><h2>${esc(pack.name)}</h2><p class="muted">${esc(pack.author || 'Author not specified')} ${pack.version ? `· ${esc(pack.version)}` : ''}</p></div></div><p class="package-full-description">${esc(pack.description || 'No description provided.')}</p><dl class="package-details"><div><dt>File</dt><dd>${esc(pack.fileName)}</dd></div><div><dt>Format</dt><dd>${esc(pack.kind)}</dd></div>${pack.gameVersion ? `<div><dt>Game version</dt><dd>${esc(pack.gameVersion)}</dd></div>` : ''}${pack.uuid ? `<div><dt>UUID</dt><dd>${esc(pack.uuid)}</dd></div>` : ''}</dl>${pack.warning ? `<p class="notice warning">${esc(pack.warning)}</p>` : ''}<p class="muted">${pack.managed ? "Changes apply when you next start the game. GP-Next checks compatibility and dependencies before loading." : "Review this package to install it into the current mod manager. Older profiles may need a one-time migration in GP-Next first."}</p>`;
}
export function filterPackages(root, query) {
    const needle = query.trim().toLowerCase(); let visible = 0;
    root.querySelectorAll('.package-card').forEach(card => { card.hidden = !card.dataset.search.includes(needle); if (!card.hidden) visible++; });
    const count = root.querySelector('#package-count'); if (count) count.textContent = `${visible} datapack${visible === 1 ? '' : 's'}`;
    const empty = root.querySelector('#package-no-results'); if (empty) empty.hidden = visible > 0 || !needle;
}
