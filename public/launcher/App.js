import { installControls } from './Controls.js';
import { palettes, modes, getAppearance, setAppearance, startCaelestiaSync } from './Theme.js';
import { icon } from './Icons.js';
import { mountEditors } from './Editors.js';
import { invoke, isDesktop, escapeHtml as esc, formatSize, freshProfile, loadState } from './Store.js';
const app = document.querySelector('#app');
const dialog = document.querySelector('#dialog');
const remembered = key => { try {
    return localStorage.getItem(key);
}
catch {
    return null;
} };
const remember = (key, value) => { try {
    localStorage.setItem(key, value);
}
catch { } };
installControls();

let state, page = 'library', selectedGame = remembered('launcher-game') || 'builtin';
let selectedProfile = remembered('launcher-profile') || 'default';
let busy = false, busyAction = null, releases = null, releaseLoading = false, download = null, installing = false, checks = null;
let disposeEditor = null;
let gpnextPackages = null;
const pages = { library: ['grid', 'Library'], releases: ['download', 'Releases'], profiles: ['sliders', 'Profiles'], save: ['save', 'Save editor'], keybinds: ['keyboard', 'Keybinds'], gpnext: ['puzzle', 'GP-Next'], settings: ['cpu', 'Settings'] };
const isEditorPage = () => page === 'save' || page === 'keybinds';
const isFlatpak = () => state?.distribution === 'flatpak';
const launchActions = ['play', 'open-mods', 'open-tools', 'open-performance', 'open-settings'];
const game = () => state.games.find(g => g.id === selectedGame) || state.games[0];
const profile = () => state.profiles.find(p => p.id === selectedProfile) || state.profiles[0];
const button = (action, text, glyph, classes = '', attributes = '') => `<button type="button" class="button ${classes}" data-action="${action}" ${attributes}>${glyph ? icon(glyph) : ''}${text}</button>`;
const hint = text => `<p class="muted">${text}</p>`;
function notify(message, error = false) {
    const toast = document.createElement('div');
    toast.className = `notification ${error ? 'error' : ''}`;
    toast.setAttribute('role', error ? 'alert' : 'status');
    toast.textContent = String(message?.message || message);
    document.querySelector('#notifications').append(toast);
    setTimeout(() => toast.remove(), error ? 10000 : 5000);
}
async function action(operation, name = null) {
    if (busy)
        return;
    busy = true;
    busyAction = name;
    updateButtons();
    try {
        await operation();
    }
    catch (error) {
        notify(error, true);
    }
    finally {
        busy = false;
        busyAction = null;
        if (state && !isEditorPage())
            render();
        else
            updateButtons();
    }
}
function updateButtons() {
    app.querySelectorAll('[data-mutates]').forEach(el => { el.disabled = busy || !isDesktop; });
    app.querySelectorAll('[data-action]').forEach(el => {
        if (!launchActions.includes(el.dataset.action))
            return;
        el.disabled = busy || !isDesktop || Boolean(state?.running) || (el.dataset.action === 'play' && !game().available);
        if (state?.running)
            el.title = 'The game is already running. Open GP-Next in the game with your configured hotkey.';
    });
    app.querySelectorAll('[data-action=install-release]').forEach(el => { el.disabled = busy || installing || !isDesktop || isFlatpak(); });
    app.querySelectorAll('[data-action=import]').forEach(el => { el.disabled = busy || !isDesktop || isFlatpak(); });
    if (busyAction) {
        const labels = { play: 'Starting game…', import: 'Selecting file…', diagnostics: 'Checking runtime…', 'open-mods': 'Starting game…', 'open-tools': 'Starting game…', 'open-performance': 'Starting game…', 'open-settings': 'Starting game…' };
        if (labels[busyAction])
            app.querySelectorAll(`[data-action="${busyAction}"]`).forEach(el => { el.innerHTML = `${icon('refresh', 'spinning')}${labels[busyAction]}`; el.setAttribute('aria-busy', 'true'); });
    }
    if (dialog.open)
        dialog.querySelectorAll('button[type=submit]').forEach(el => { el.disabled = busy || !isDesktop; });
}
function selectOptions(items, chosen, getLabel = value => value.name) {
    return items.map(value => `<option value="${esc(value.id)}" ${value.id === chosen ? 'selected' : ''}>${esc(getLabel(value))}</option>`).join('');
}
function heading(kicker, title, description, actions = '') {
    return `<header class="page-heading"><div>${kicker ? `<div class="eyebrow">${kicker}</div>` : ''}<h1>${title}</h1>${description ? hint(description) : ''}</div>${actions ? `<div class="heading-actions">${actions}</div>` : ''}</header>`;
}
function versionRows() {
    return state.games.map(g => `<article class="version-row ${game().id === g.id ? 'selected' : ''}">
    <button class="version-select" data-action="select-game" data-id="${esc(g.id)}" aria-pressed="${game().id === g.id}"><span class="version-icon">${icon(g.builtin ? 'leaf' : 'folder')}</span><span><strong>${esc(g.name)}</strong><small>${esc(g.version)}${!g.available ? ' · File missing' : ''}</small></span></button>
    <span class="badge ${g.builtin ? 'green' : ''}">${g.builtin ? 'Included' : 'Installed'}</span>
    ${!g.builtin ? button('remove-game', '<span class="sr-only">Remove from library</span>', 'trash', 'icon-button quiet', `data-id="${esc(g.id)}"`) : ''}
  </article>`).join('');
}
function libraryPage() {
    const current = game();
    return `${heading('', 'Library', 'Game versions, profiles, and launch controls.', button('import', 'Import game', 'plus', 'secondary', 'data-mutates'))}
    <section class="hero" aria-label="Selected game"><div class="hero-copy"><span class="badge ${current.available ? 'green' : 'red'}">${current.available ? (state.running ? 'Game running' : 'Ready to play') : 'Executable missing'}</span><h2>${esc(current.name)}</h2><div class="hero-version">${icon('leaf')}<span>${esc(current.version)}</span><span>${current.builtin ? 'Included game' : 'Imported installation'}</span></div><p>${current.builtin ? 'GP-Next included · Separate save profiles · Offline play' : 'This version uses its original game saves and GP-Next.'}</p></div><div class="hero-symbol" aria-hidden="true">${icon('leaf')}</div></section>
    <section class="launch-bar" aria-label="Launch controls"><label><span>Game version</span><select id="game-choice">${selectOptions(state.games, current.id, g => `${g.name} · ${g.builtin ? 'included' : g.version}`)}</select></label><label><span>Profile</span><select id="profile-choice">${selectOptions(state.profiles, profile().id)}</select></label>${button('edit-current', '<span class="sr-only">Edit selected profile</span>', 'sliders', 'icon-button secondary', 'title="Edit profile"')}${button('play', state.running ? 'Game running' : 'Play', 'play', 'primary play-button', 'data-mutates')}</section>
    ${isFlatpak() ? `<div class="notice">${icon('info')}<p>This installation updates through Flatpak. Native executable imports are available in the standalone launcher.</p></div>` : ''}
    ${!current.available ? `<div class="notice warning">${icon('info')}<p>The executable has moved or was removed. Import its new location to launch this version.</p></div>` : ''}
    ${!current.builtin ? `<div class="notice">${icon('info')}<p>Imported builds keep their original saves and mods. Profile save isolation and GP-Next launch preferences require the included game. Graphics selection still applies.</p></div>` : ''}
    ${state.running ? `<div class="notice success">${icon('activity')}<p>The game is running in a separate window. Close it before launching another session. ${button('open-logs', 'View session logs', 'folder', 'text-button')}</p></div>` : ''}
    <div class="two-columns"><section class="panel"><div class="section-heading"><h2>Installed games</h2><span class="count">${state.games.length}</span></div>${versionRows()}${button('go-releases', 'Browse releases', 'arrow', 'text-button')}</section>
    <section class="panel session-card"><div class="section-heading"><h2>Launch setup</h2>${button('edit-current', 'Edit profile', 'edit', 'text-button')}</div><dl><div><dt>Profile</dt><dd>${esc(profile().name)}</dd></div><div><dt>Graphics</dt><dd>${esc(gpuLabel(profile().gpu))}</dd></div><div><dt>Frame limit</dt><dd>${current.builtin && profile().applySettings ? `${profile().frameRate} FPS preference` : 'In-game setting'}</dd></div><div><dt>Save data</dt><dd>${!current.builtin ? 'Managed by imported game' : profile().id === 'default' ? 'Existing game data' : 'Separate profile'}</dd></div></dl><div class="session-note">${icon('shield')}<span>${!current.builtin ? 'Profile save isolation is unavailable for this build.' : profile().recovery ? 'Recovery mode: temporary save, mods bypassed.' : 'Save and keybind editors use the selected profile.'}</span></div></section></div>
    <section class="quick-links" aria-label="Tools">${button('go-save', 'Edit save', 'save')}${button('go-keybinds', 'Edit keybinds', 'keyboard')}${button('go-gpnext', 'GP-Next workspace', 'puzzle')}</section>`;
}
function gpuLabel(id) { return id === 'auto' ? 'Automatic' : id === 'system' ? 'System default' : state.gpus.find(g => g.id === id)?.label || 'Unavailable GPU'; }
function profilesPage() {
    return `${heading('', 'Profiles', 'Separate saves, mods, and launch preferences.', button('new-profile', 'New profile', 'plus', 'primary', 'data-mutates'))}
    <div class="notice">${icon('shield')}<p>The existing-save profile keeps your current progress. New profiles start fresh with separate saves, settings, and GP-Next packages. Removing a profile from this list keeps its files on disk.</p></div>
    <div class="profile-grid">${state.profiles.map(p => `<article class="panel profile-card"><div class="profile-symbol">${icon(p.id === 'default' ? 'leaf' : 'puzzle')}</div><span class="badge ${profile().id === p.id ? 'green' : ''}">${profile().id === p.id ? 'Selected' : p.id === 'default' ? 'Existing data' : 'Separate save'}</span><h2>${esc(p.name)}</h2><p class="muted">${p.applySettings ? `${p.frameRate} FPS · ${esc(p.widescreen === 'none' ? 'No widescreen trim' : p.widescreen)} · ${p.recovery ? 'Recovery' : 'Normal play'}` : 'Uses your current in-game preferences'}</p><p class="profile-gpu">${icon('cpu')}${esc(gpuLabel(p.gpu))}</p><div class="card-actions">${button('select-profile', profile().id === p.id ? 'Selected' : 'Use profile', 'check', profile().id === p.id ? 'secondary selected-profile' : 'secondary', `data-id="${esc(p.id)}" ${profile().id === p.id ? 'disabled' : ''}`)}${button('edit-profile', 'Edit', 'edit', 'quiet', `data-id="${esc(p.id)}"`)}${p.id !== 'default' ? button('delete-profile', '<span class="sr-only">Remove profile</span>', 'trash', 'quiet icon-button', `data-id="${esc(p.id)}"`) : ''}</div></article>`).join('')}</div>`;
}
function gpnextPage() {
    return `${heading('', 'GP-Next workspace', 'Prepare mods and game preferences before you play.')}
    ${profileContext('Packages and preferences below belong to this profile.')}
    <section class="gpn-banner"><div class="gpn-mark">${icon('puzzle')}</div><div><h2>${esc(profile().name)}</h2><p>GP-Next is included with the game. Its in-game overlay still handles load order, mod settings, and live performance reports.</p></div><span class="badge green">Ready</span></section>
    <section class="panel"><div class="section-heading"><h2>Packages on disk</h2>${button('refresh-packages', 'Refresh', 'refresh', 'secondary')}</div><p class="muted">These folders and ZIPs are available to GP-Next. Enable state and load order are managed inside the game.</p><div class="package-grid">${gpnextPackages === null ? '<p class="muted">Loading packages…</p>' : gpnextPackages.length ? gpnextPackages.map(name => `<div class="package-chip">${icon('puzzle')}<span>${esc(name)}</span></div>`).join('') : '<p class="muted">No packages found for this profile.</p>'}</div><div class="card-actions">${button('open-mod-folder', 'Open package folder', 'folder', 'secondary')}${button('edit-current', 'Edit launch preferences', 'sliders', 'secondary')}</div></section>
    <div class="tool-grid">${[
        ['go-save', 'save', 'Save progress', 'Edit plants, worlds, upgrades, and currencies before launch.', 'Open save editor'],
        ['go-keybinds', 'keyboard', 'Keybinds', 'Change controls for the selected profile.', 'Edit keybinds'],
        ['diagnostics', 'activity', 'Audio runtime', 'Check required sound plugins before starting the game.', 'Check runtime'],
        ['open-logs', 'folder', 'Session logs', 'Inspect the last launch and share diagnostics if something fails.', 'Open logs']
    ].map(([action, glyph, title, description, label]) => `<article class="panel tool-card"><div class="tool-icon">${icon(glyph)}</div><h2>${title}</h2><p>${description}</p>${button(action, label, 'arrow', 'text-button')}</article>`).join('')}</div>
    <div class="notice">${icon('info')}<p>Start the game from Library. Open GP-Next with your configured hotkey after it loads.</p></div>
    <section class="panel online-tools"><div class="section-heading"><h2>Official online tools</h2><span class="badge">Opens in browser</span></div><div class="online-tool-list">${[
        ['leaf', 'Almanac', 'Look up Gardendless plants and zombies.', 'https://pvzge.com/en/almanac/'],
        ['grid', 'Level editor', 'Create boards, choose seed slots, and edit waves.', 'https://pvzge.com/en/useful-tool/level-editor'],
        ['tool', 'Plant Decoding Assistant', 'Solve and practice the plant-decoding minigame.', 'https://pvzge.com/en/useful-tool/plant-decoding'],
        ['leaf', 'Plant Matcher', 'Try the official plant personality quiz.', 'https://pvzge.com/en/useful-tool/which-pvzge-plant/'],
        ['puzzle', 'Modding documentation', 'Learn package formats, scripting, and GP-Next features.', 'https://pvzge.com/en/guide/mod/']
    ].map(([glyph, title, description, url]) => `<button type="button" class="online-tool" data-action="website-tool" data-url="${url}">${icon(glyph)}<span><strong>${title}</strong><small>${description}</small></span>${icon('external')}</button>`).join('')}</div></section>`;
}
function releasesPage() {
    return `${heading('', 'Releases', 'Download a game version and keep your existing installations.', button('refresh-releases', releaseLoading ? 'Checking…' : 'Check releases', 'refresh', 'secondary', releaseLoading ? 'disabled' : ''))}
    ${isFlatpak() ? `<div class="notice">${icon('info')}<p>Update this installation through your software manager or Flatpak. Native game downloads cannot run inside this package; release notes remain available here.</p></div>` : ''}
    ${releases?.cached ? `<div class="notice">${icon('info')}<p>Showing cached release notes. Downloads need a connection to GitHub.</p></div>` : ''}
    <div id="download-status">${downloadMarkup()}</div>
    ${!releases ? `<section class="panel empty-state">${icon('download')}<h2>${releaseLoading ? 'Checking GitHub…' : 'Browse published versions'}</h2><p>Release notes and installable builds will appear here. Your installed games work offline.</p>${button('refresh-releases', 'Load releases', 'refresh', 'primary', releaseLoading ? 'disabled' : '')}</section>` :
        `<div class="release-list">${releases.releases.map(r => `<article class="panel release-card"><div class="section-heading"><div><span class="eyebrow">${esc(r.publishedAt.slice(0, 10))}</span><h2>${esc(r.name)}</h2></div><span class="badge ${r.prerelease ? '' : 'green'}">${r.prerelease ? 'Pre-release' : 'Release'}</span></div><details><summary>Release notes</summary><pre class="release-notes">${esc(r.body || 'No release notes provided.')}</pre></details><div class="release-assets">${r.assets.filter(a => a.compatible && !isFlatpak()).map(a => `<div><span><strong>${esc(a.name)}</strong><small>${formatSize(a.size)} · SHA-256 verified on install</small></span>${button('install-release', 'Install', 'download', 'primary', `data-mutates data-id="${a.id}" ${installing ? 'disabled' : ''}`)}</div>`).join('') || `<p class="muted">${isFlatpak() ? 'Use Flatpak to update this installation.' : 'No automatic install for this platform/build. Download it manually from the release page and import the executable.'}</p>`}</div>${button('release-url', 'View on GitHub', 'external', 'text-button', `data-url="${esc(r.url)}"`)}</article>`).join('')}</div>`}`;
}
function downloadMarkup() {
    if (!download)
        return '';
    const percent = download.total ? Math.min(100, Math.round(download.received / download.total * 100)) : 0;
    return `<section class="panel download-card" role="status"><div><strong>${esc(download.status === 'downloading' ? 'Downloading game' : download.status)}</strong><span>${formatSize(download.received)} / ${formatSize(download.total)}</span></div><progress max="100" value="${percent}" aria-label="Download progress">${percent}%</progress>${installing ? button('cancel-download', 'Cancel download', 'close', 'text-button') : ''}</section>`;
}
function appearancePanel() {
    const current = getAppearance();
    return `<section class="panel"><h2>Appearance</h2><div class="appearance-controls"><fieldset><legend>Theme</legend><div class="segmented">${Object.entries(modes).map(([value, label]) => `<label><input type="radio" name="appearance-mode" data-appearance="mode" value="${value}" ${current.mode === value ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div></fieldset><fieldset><legend>Color palette</legend><div class="palette-options">${Object.entries(palettes).map(([value, label]) => `<label class="palette-option" data-palette="${value}"><input type="radio" name="appearance-palette" data-appearance="palette" value="${value}" ${current.palette === value ? 'checked' : ''}><span>${icon('check')}</span>${label}</label>`).join('')}</div><p class="muted">Follow Caelestia reads its current Quickshell Material scheme on Linux and updates as it changes. If unavailable, the Garden palette is used.</p></fieldset></div></section>`;
}
function settingsPage() {
    return `${heading('', 'Settings', 'Appearance, graphics, and application support.')}
    ${appearancePanel()}
    <section class="panel"><div class="section-heading"><h2>Graphics selection</h2>${icon('cpu')}</div><p class="muted">${state.platform === 'windows' ? 'Windows manages GPU preference in Settings → System → Display → Graphics. Add the game executable there.' : 'Automatic selection favors a primary AMD GPU, then integrated Intel/AMD graphics. NVIDIA uses the DMA-BUF fallback. Choose a GPU per profile.'}</p>
    <div class="device-list">${state.gpus.map(g => `<div>${icon('cpu')}<span><strong>${esc(g.label)}</strong><small>${g.primary ? 'Primary GPU' : 'Secondary GPU'}${g.nvidia ? ' · DMA-BUF fallback' : ''}</small></span>${g.recommended ? '<span class="badge green">Auto choice</span>' : ''}</div>`).join('') || '<p class="muted">No selectable Linux render devices reported.</p>'}</div>${button('edit-current', 'Edit profile graphics', 'sliders', 'secondary')}</section>
    <section class="panel"><div class="section-heading"><h2>Audio support</h2>${button('diagnostics', 'Check runtime', 'activity', 'secondary', 'data-mutates')}</div><p class="muted">Check that the system can find the audio plugins Gardendless needs.</p>${checks ? `<ul class="runtime-checks">${checks.map(c => `<li><span class="badge ${c.status === 'available' ? 'green' : c.status === 'missing' ? 'red' : ''}">${esc(c.status)}</span><div><strong>${esc(c.name)}</strong><p>${esc(c.detail)}</p></div></li>`).join('')}</ul>` : ''}</section>
    <section class="panel"><h2>Files & support</h2><div class="folder-actions">${button('open-profile', 'Profile data', 'folder', 'secondary')}${button('open-versions', 'Installed versions', 'folder', 'secondary')}${button('open-logs', 'Session logs', 'folder', 'secondary')}</div><p class="muted file-path">${esc(state.dataDir)}</p><p class="muted">While a game is running, closing the launcher minimizes it so session tracking stays active. Exit the game first to close the launcher.</p></section>
    <p class="footer-note">Gardendless Launcher ${esc(state.launcherVersion)} · ${isFlatpak() ? 'Flatpak installation' : state.platform === 'windows' ? 'Windows' : state.platform === 'linux' ? 'Linux' : 'Browser preview'}</p>`;
}
function profileContext(description) {
    return `<section class="profile-context" aria-label="Active profile"><label for="profile-choice"><span>Profile</span><select id="profile-choice">${selectOptions(state.profiles, profile().id)}</select></label><p>${description}</p>${button('edit-current', 'Profile settings', 'sliders', 'secondary')}</section>`;
}
function editorPage() {
    const save = page === 'save';
    return `${heading('', save ? 'Save editor' : 'Keybinds', save ? 'Read and edit Gardendless progress from your selected profile.' : 'Customize the controls saved in your selected profile.')}
    ${profileContext('The included game and these editors share the same profile data.')}
    <div id="editor-root"><div class="panel editor-loading" role="status">Loading profile data…</div></div>`;
}
function navigation() {
    const groups = [ ['Play', ['library', 'releases']], ['Manage', ['profiles', 'save', 'keybinds', 'gpnext']], ['System', ['settings']] ];
    return groups.map(([label, ids]) => `<div class="nav-group"><div class="nav-label">${label}</div>${ids.map(id => {
        const [glyph, text] = pages[id];
        return `<button type="button" data-page="${id}" aria-label="${text}" title="${text}" class="nav-item ${page === id ? 'active' : ''}" ${page === id ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${text}</span></button>`;
    }).join('')}</div>`).join('');
}
function render() {
    if (disposeEditor) {
        disposeEditor();
        disposeEditor = null;
    }
    const currentPage = pages[page] || pages.library;
    const pageContent = { library: libraryPage, profiles: profilesPage, gpnext: gpnextPage, releases: releasesPage, settings: settingsPage, save: editorPage, keybinds: editorPage };
    app.innerHTML = `<div class="shell"><aside class="sidebar"><a class="brand" href="#library" aria-label="Gardendless library"><img class="brand-mark" src="./Icon.png" alt=""><span>Gardendless<small>Launcher</small></span></a><nav aria-label="Main navigation">${navigation()}</nav><div class="sidebar-bottom"><div class="availability"><span class="status-dot"></span>${isDesktop ? 'Offline play available' : 'Browser preview'}</div><button type="button" data-action="docs" class="nav-item">${icon('external')}<span>Documentation</span></button><div class="sidebar-version">Launcher ${esc(state.launcherVersion)}</div></div></aside><div class="workspace"><div class="topbar"><details class="mobile-menu"><summary aria-label="Open navigation">${icon('menu')}</summary><nav aria-label="Launcher navigation">${navigation()}</nav></details><span class="breadcrumb"><span class="desktop-crumb">Gardendless</span><span class="breadcrumb-divider desktop-crumb">/</span><strong>${currentPage[1]}</strong></span><div><span id="session-status">${state.running ? '<span class="badge green">Game running</span>' : ''}</span><span class="profile-chip" title="${esc(profile().name)}">${icon('leaf')}<span>${esc(profile().name)}</span></span></div></div><main id="main" tabindex="-1">${!isDesktop ? '<div class="preview-notice">Browser preview · Profile data and desktop actions are available in the installed launcher.</div>' : ''}${pageContent[page]()}</main></div></div>`;
    document.title = `${currentPage[1]} · Gardendless Launcher`;
    updateButtons();
    if (isEditorPage()) {
        const container = app.querySelector('#editor-root');
        try {
            disposeEditor = mountEditors(container, { profileId: profile().id, profileName: profile().name, notify, mode: page });
        }
        catch (error) {
            container.innerHTML = `<div class="notice warning">${icon('info')}<p>Could not open the editor: ${esc(error?.message || error)}</p></div>`;
        }
    }
}
function navigate(next) {
    if (!pages[next] || next === page)
        return;
    page = next;
    history.replaceState(null, '', `#${next}`);
    render();
    if (next === 'gpnext') refreshPackages();
    document.querySelector('#main')?.classList.add('page-enter');
    document.querySelector('#main')?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: 'instant' });
}
async function refreshPackages() {
    if (!isDesktop) { gpnextPackages = []; if (page === 'gpnext') render(); return; }
    const id = profile().id;
    try {
        const packages = await invoke('launcher_gpnext_packages', { profileId: id });
        if (page === 'gpnext' && profile().id === id) { gpnextPackages = packages; render(); }
    } catch (error) { notify(error, true); }
}
function openDialog(title, content) {
    dialog.innerHTML = `<div class="dialog-heading"><div><span class="eyebrow">GARDENDLESS LAUNCHER</span><h2 id="dialog-title">${title}</h2></div>${button('close-dialog', '<span class="sr-only">Close dialog</span>', 'close', 'quiet icon-button')}</div>${content}`;
    dialog.showModal();
    updateButtons();
}
function editProfile(value = freshProfile()) {
    const p = structuredClone(value);
    const checkbox = (name, title, description, checked) => `<label class="toggle-row"><span><strong>${title}</strong><small>${description}</small></span><input type="checkbox" name="${name}" ${checked ? 'checked' : ''}><span class="switch" aria-hidden="true"></span></label>`;
    openDialog(p.id ? 'Edit profile' : 'New profile', `<form id="profile-form"><input type="hidden" name="id" value="${esc(p.id)}"><label class="field">Profile name<input name="name" value="${esc(p.name)}" placeholder="e.g. Mod experiments" maxlength="64" required autofocus></label><label class="field">Graphics device<select name="gpu"><option value="auto" ${p.gpu === 'auto' ? 'selected' : ''}>Automatic (recommended)</option><option value="system" ${p.gpu === 'system' ? 'selected' : ''}>System default</option>${selectOptions(state.gpus, p.gpu, g => g.label)}</select></label>
    ${checkbox('applySettings', 'Apply launch preferences', 'Save these choices into GP-Next on the next launch. In-game changes persist until you save this profile again.', p.applySettings)}
    <div class="form-pair"><label class="field">Frame limit<select name="frameRate">${[30, 60, 90, 120, 144, 165, 180, 240].map(f => `<option value="${f}" ${f === p.frameRate ? 'selected' : ''}>${f} FPS</option>`).join('')}</select></label><label class="field">Widescreen trim<select name="widescreen">${['none', 'fog', 'bushes'].map(f => `<option value="${f}" ${f === p.widescreen ? 'selected' : ''}>${f[0].toUpperCase() + f.slice(1)}</option>`).join('')}</select></label></div>
    <label class="field">Sound effects on Linux<select name="audioProfile">${[['balanced', 'Balanced — recommended'], ['performance', 'Performance — fewer simultaneous effects'], ['rich', 'More effects — more simultaneous sounds']].map(([value, label]) => `<option value="${value}" ${value === (p.audioProfile || 'balanced') ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
    <details class="experimental"><summary>GP-Next experiments</summary>${checkbox('jsModding', 'JavaScript Modding', 'Allow installed JavaScript mods to run.', p.jsModding)}${checkbox('worldMapJson', 'Worldmap Modding', 'Allow world-map data extensions.', p.worldMapJson)}${checkbox('plantLevelSystem', 'Plant Level System', 'Enable plant-level mod features.', p.plantLevelSystem)}</details>
    ${checkbox('recovery', 'Start in recovery mode', 'Bypass mods with a temporary save. Progress in recovery is discarded.', p.recovery)}
    <p class="muted">${p.id === 'default' ? 'Your existing game data stays in its current location.' : 'This profile uses its own game saves and mod packages with the included game.'}</p><div class="dialog-actions">${button('close-dialog', 'Cancel', '', 'secondary')}<button type="submit" class="button primary">Save profile</button></div></form>`);
    dialog.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const next = { ...p, id: values.get('id'), name: values.get('name'), gpu: values.get('gpu'), frameRate: Number(values.get('frameRate')), widescreen: values.get('widescreen'), audioProfile: values.get('audioProfile') };
        for (const key of ['recovery', 'applySettings', 'jsModding', 'worldMapJson', 'plantLevelSystem'])
            next[key] = values.has(key);
        action(async () => { state = await invoke('launcher_save_profile', { profile: next }); selectedProfile = state.profiles.find(item => item.id === next.id)?.id || state.profiles.at(-1).id; remember('launcher-profile', selectedProfile); dialog.close(); notify('Profile saved. Your choices apply on the next launch.'); if (isEditorPage()) render(); });
    });
}
function confirmDialog(title, message, operation) {
    openDialog(title, `<p>${esc(message)}</p><div class="dialog-actions">${button('close-dialog', 'Cancel', '', 'secondary')}${button('confirm', 'Remove from list', 'trash', 'danger')}</div>`);
    dialog.querySelector('[data-action=confirm]').addEventListener('click', () => action(async () => { await operation(); dialog.close(); }));
}
async function launch(openTab = null) {
    if (state.running) {
        notify('The game is already open. Switch to it and use your GP-Next hotkey.');
        return;
    }
    const gameId = openTab ? 'builtin' : game().id;
    if (state.platform === 'linux') {
        checks = await invoke('launcher_diagnostics');
        if (checks.some(check => check.name === 'Audio output' && check.status === 'missing')) {
            page = 'settings';
            history.replaceState(null, '', '#settings');
            throw new Error(isFlatpak() ? 'The Flatpak audio runtime is incomplete. Update or repair the Flatpak installation, then check the runtime again.' : 'The GStreamer audio-output plugin is missing. Install the package listed in the audio check below, then check the runtime again.');
        }
    }
    state.running = await invoke('launcher_launch', { gameId, profileId: profile().id, openTab });
    notify('Gardendless is opening.');
}
async function refreshReleases() {
    if (releaseLoading)
        return;
    releaseLoading = true;
    render();
    try {
        releases = await invoke('launcher_releases');
    }
    catch (error) {
        notify(error, true);
    }
    finally {
        releaseLoading = false;
        render();
    }
}
async function external(url) {
    if (!/^https:\/\/(github\.com|pvzge\.com)\//.test(url))
        throw new Error('Unsupported link');
    if (isDesktop)
        await invoke('plugin:opener|open_url', { url });
    else
        window.open(url, '_blank', 'noopener,noreferrer');
}
async function handleAction(target) {
    const name = target.dataset.action;
    if (isFlatpak() && ['import', 'install-release'].includes(name)) {
        notify('Update this installation through Flatpak. Native game imports require the standalone launcher.');
        return;
    }
    if (name === 'close-dialog') {
        dialog.close();
        return;
    }
    if (name === 'select-game') {
        selectedGame = target.dataset.id;
        remember('launcher-game', selectedGame);
        render();
        return;
    }
    if (name === 'select-profile') {
        selectedProfile = target.dataset.id;
        remember('launcher-profile', selectedProfile);
        render();
        notify('Profile selected.');
        return;
    }
    if (name.startsWith('go-') && pages[name.slice(3)]) {
        navigate(name.slice(3));
        return;
    }
    if (name === 'new-profile') {
        editProfile();
        return;
    }
    if (name === 'edit-current') {
        editProfile(profile());
        return;
    }
    if (name === 'refresh-packages') { gpnextPackages = null; render(); await refreshPackages(); return; }
    if (name === 'open-mod-folder') { await invoke('launcher_open_folder', { kind: 'mods', profileId: profile().id }); return; }
    if (name === 'edit-profile') {
        editProfile(state.profiles.find(p => p.id === target.dataset.id));
        return;
    }
    if (name === 'delete-profile') {
        const id = target.dataset.id;
        confirmDialog('Remove profile?', 'Its saves and mod files will stay on disk. This removes only the launcher entry.', async () => { state = await invoke('launcher_delete_profile', { id }); if (selectedProfile === id)
            selectedProfile = 'default'; });
        return;
    }
    if (name === 'remove-game') {
        const id = target.dataset.id;
        confirmDialog('Remove installation?', 'The executable and its saves will stay on disk. You can import it again later.', async () => { state = await invoke('launcher_remove_game', { id }); if (selectedGame === id)
            selectedGame = 'builtin'; });
        return;
    }
    if (name === 'refresh-releases') {
        await refreshReleases();
        return;
    }
    if (name === 'install-release') {
        if (installing)
            return;
        installing = true;
        download = { assetId: Number(target.dataset.id), received: 0, total: 0, status: 'Connecting to GitHub' };
        render();
        try {
            state = await invoke('launcher_install_release', { assetId: download.assetId });
            notify('Version installed and added to your library.');
        }
        catch (error) {
            notify(error, true);
        }
        finally {
            installing = false;
            download = null;
            render();
        }
        return;
    }
    await action(async () => {
        if (name === 'play')
            await launch();
        else if (['open-mods', 'open-tools', 'open-performance', 'open-settings'].includes(name))
            await launch(name.slice(5));
        else if (name === 'diagnostics')
            checks = await invoke('launcher_diagnostics');
        else if (name === 'cancel-download')
            await invoke('launcher_cancel_download');
        else if (name === 'docs')
            await external('https://pvzge.com/en/guide/mod/');
        else if (name === 'release-url' || name === 'website-tool')
            await external(target.dataset.url);
        else if (name.startsWith('open-'))
            await invoke('launcher_open_folder', { kind: name.slice(5), profileId: profile().id });
        else if (name === 'import') {
            const path = await invoke('launcher_pick_game');
            if (!path)
                return;
            openDialog('Import a game', `<form id="import-form"><p class="muted">The executable stays where it is. Keep any companion files beside it.</p><label class="field">Library name<input name="name" value="Gardendless" required maxlength="80" autofocus></label><p class="file-path">${esc(path)}</p><div class="dialog-actions">${button('close-dialog', 'Cancel', '', 'secondary')}<button class="button primary" type="submit">Add to library</button></div></form>`);
            dialog.querySelector('form').addEventListener('submit', event => { event.preventDefault(); const name = new FormData(event.currentTarget).get('name'); action(async () => { state = await invoke('launcher_import_game', { path, name }); dialog.close(); notify('Game added to your library.'); }); });
        }
    }, name);
}
document.addEventListener('click', event => {
    const nav = event.target.closest('[data-page]');
    if (nav) {
        navigate(nav.dataset.page);
        return;
    }
    if (event.target.closest('#editor-root'))
        return;
    const target = event.target.closest('[data-action]');
    if (target && !target.disabled)
        handleAction(target).catch(error => notify(error, true));
});
document.addEventListener('change', event => {
    if (event.target.dataset.appearance) {
        setAppearance(event.target.dataset.appearance, event.target.value);
        return;
    }
    if (event.target.id === 'game-choice') {
        selectedGame = event.target.value;
        remember('launcher-game', selectedGame);
        render();
    }
    if (event.target.id === 'profile-choice') {
        selectedProfile = event.target.value;
        remember('launcher-profile', selectedProfile);
        if (page === 'gpnext') gpnextPackages = null;
        render();
        if (page === 'gpnext') refreshPackages();
    }
});
window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
try {
    state = await loadState();
    startCaelestiaSync();
    page = pages[location.hash.slice(1)] ? location.hash.slice(1) : 'library';
    render();
    if (page === 'gpnext') refreshPackages();
}
catch (error) {
    app.innerHTML = `<main class="startup-error"><h1>Couldn’t open your library.</h1><p>${esc(error)}</p><p>Your files have not been changed.</p><button onclick="location.reload()">Try again</button></main>`;
}
let polling = false;
setInterval(async () => {
    if (!isDesktop || !state || polling)
        return;
    polling = true;
    try {
        const running = await invoke('launcher_running');
        if (JSON.stringify(running) !== JSON.stringify(state.running)) {
            const ended = state.running && !running;
            state.running = running;
            if (!dialog.open && !isEditorPage())
                render();
            else {
                const status = document.querySelector('#session-status');
                if (status)
                    status.innerHTML = state.running ? '<span class="badge green">Game running</span>' : '';
                updateButtons();
            }
            if (ended)
                notify('Game closed. Session log saved in Settings → Session logs.');
        }
        if (installing) {
            download = await invoke('launcher_download_status') || download;
            const region = document.querySelector('#download-status');
            if (region)
                region.innerHTML = downloadMarkup();
        }
    }
    catch { /* A closing native window does not need a repeating error toast. */ }
    finally {
        polling = false;
    }
}, 1000);
