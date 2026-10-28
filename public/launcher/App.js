import { readDroppedPackages } from "./DropImports.js";
import { installDiagnostics } from "./Diagnostics.js";
installDiagnostics();
import { catalog, gardenestMarkup, refreshCatalog, versionFor } from "./Gardenest.js";
import { prepareGardenestInstall, prepareLocalInstall, prepareDroppedInstall, ensureModConfiguration, setPackageEnabled } from "./Gpnext.js";
import {packageCards, packageDetails, filterPackages} from './Packages.js';
import {logsMarkup, filteredLog} from './Logs.js';
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
let restartRequired = false;
let busy = false, busyAction = null, releases = null, releaseLoading = false, download = null, installing = false, checks = null;
let disposeEditor = null;
let gpnextPackages = null, packageQuery = '';
let logFiles = null, selectedLog = '', logEntry = null, logLoading = false;
let logReadRevision = 0;
const gardenestDownloads = [];
let gardenestInstallation = null;
dialog.addEventListener('close', () => queueMicrotask(showGardenestDownload));
function showGardenestDownload() {
    if (dialog.open || busy || !gardenestDownloads.length) return;
    const {path, name} = gardenestDownloads.shift();
    const targetProfile = profile().id;
    openDialog('Import Gardenest datapack?', `<p><strong>${esc(name)}</strong></p><p>Import this ZIP into <strong>${esc(profile().name)}</strong>? Review its metadata in Datapacks afterward and enable it in GP-Next.</p><div class="dialog-actions">${button('close-dialog','Not now','','secondary')}${button('confirm-download','Import datapack','plus','primary')}</div>`);
    dialog.querySelector('[data-action=confirm-download]').addEventListener('click', () => {
        action(async () => { selectedProfile = targetProfile; await importPackages([path]); navigate('gpnext'); }).finally(() => dialog.close());
    });
}
const pages = { library: ['grid', 'Library'], releases: ['releases', 'Releases'], profiles: ['sliders', 'Profiles'], save: ['save', 'Save editor'], keybinds: ['keyboard', 'Keybinds'], gpnext: ['puzzle', 'Datapacks'], gardenest: ['leaf', 'Gardenest'], logs: ['logs', 'Logs'], settings: ['cpu', 'Settings'] };
const isEditorPage = () => page === 'save' || page === 'keybinds';
const isFlatpak = () => state?.distribution === 'flatpak';
const launchActions = ['play', 'open-mods', 'open-tools', 'open-performance', 'open-settings'];
const game = () => state.games.find(g => g.id === selectedGame) || state.games[0];
const profile = () => state.profiles.find(p => p.id === selectedProfile) || state.profiles[0];
const button = (action, text, glyph, classes = '', attributes = '') => `<button type="button" class="button ${classes}" data-action="${action}" ${attributes}>${glyph ? icon(glyph) : ''}${text}</button>`;
const hint = text => `<p class="muted">${text}</p>`;
function notify(message, error = false) {
    if (error) console.error("[Launcher]", message);
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
        queueMicrotask(showGardenestDownload);
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
        el.disabled = busy || (isFlatpak() && installing) || restartRequired || !isDesktop || Boolean(state?.running) || (el.dataset.action === 'play' && !game().available);
        if (state?.running)
            el.title = 'The game is already running. Open GP-Next in the game with your configured hotkey.';
    });
    app.querySelectorAll('[data-action=install-release]').forEach(el => { el.disabled = busy || installing || restartRequired || !isDesktop || (isFlatpak() && Boolean(state?.running)); });
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
    ${state.running ? `<div class="notice success">${icon('activity')}<p>The game is running in a separate window. Close it before launching another session. ${button('go-logs', 'View session logs', 'activity', 'text-button')}</p></div>` : ''}
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
    <section class="gpn-banner"><div class="gpn-mark">${icon('puzzle')}</div><div><h2>${esc(profile().name)}</h2><p>Manage installed datapacks here. GP-Next validates your selection when the game starts.</p></div><span class="badge green">Ready</span></section>
    <section class="datapack-drop" id="datapack-drop"><div class="drop-symbol">${icon('download')}</div><div><h2>Drop your datapacks here</h2><p>ZIP files or folders containing pack.json. Imports use <strong>${esc(profile().name)}</strong>.</p></div><div class="drop-actions">${button('import-packs', 'Choose ZIPs', 'plus', 'primary', 'data-mutates')}${button('import-pack-folder', 'Choose folder', 'folder', 'secondary', 'data-mutates')}${button('go-gardenest', 'Browse Gardenest', 'external', 'quiet')}</div></section>
    <section class="panel"><div class="section-heading"><div><h2>Installed datapacks</h2><span id="package-count" class="muted">${gpnextPackages?.length ?? 0} datapacks</span></div>${button('refresh-packages', 'Refresh', 'refresh', 'secondary')}</div><label class="package-search">${icon('search')}<input id="package-search" type="search" placeholder="Search names, authors and descriptions" value="${esc(packageQuery)}" aria-label="Search datapacks"></label><div class="package-cards">${packageCards(gpnextPackages)}</div><p class="empty-state" id="package-no-results" hidden>No matching datapacks.</p><div class="card-actions">${button('open-mod-folder', 'Open package folder', 'folder', 'secondary')}${button('edit-current', 'Edit launch preferences', 'sliders', 'secondary')}</div></section>
    <div class="tool-grid">${[
        ['go-save', 'save', 'Save progress', 'Edit plants, worlds, upgrades, and currencies before launch.', 'Open save editor'],
        ['go-keybinds', 'keyboard', 'Keybinds', 'Change controls for the selected profile.', 'Edit keybinds'],
        ['diagnostics', 'activity', 'Audio runtime', 'Check required sound plugins before starting the game.', 'Check runtime'],
        ['go-logs', 'activity', 'Session logs', 'Inspect the last launch and share diagnostics if something fails.', 'Open logs']
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
function logsPage() {
    return `${heading('', 'Logs', 'Read game sessions and narrow down launch, graphics, or audio problems.', `${button('copy-log', 'Copy log', 'copy', 'secondary', !logEntry ? 'disabled' : '')}${button('refresh-logs', logLoading ? 'Refreshing…' : 'Refresh', 'refresh', 'primary', logLoading ? 'disabled' : '')}`)}${logsMarkup(logFiles, selectedLog, logEntry)}`;
}
function gardenestPage() {
    return `${heading('', 'Gardenest', 'Discover creations and manage your community account.')}
    ${profileContext('Installs and updates belong to this profile.')}
    ${gardenestMarkup()}
    <section class="panel gardenest-account"><div><h2>Community account</h2><p class="muted">Use your official Gardenest session for check-ins, quests and publishing.</p></div><div class="card-actions">${button('gardenest', 'Account', 'shield', 'secondary', 'data-section="account"')}${button('gardenest', 'Open site', 'external', 'quiet', 'data-section="discover"')}</div></section>
    <div class="tool-grid gardenest-tools">${[
        ['tasks','activity','Tasks & daily check-in','Check in, follow quests, and view your account level and experience.','Open Task Center'],
        ['creator','edit','Creator Center','Create projects, upload versions, publish changelogs, and manage collaborators.','Manage projects'],
    ].map(([section,glyph,title,description,label]) => `<article class="panel tool-card"><div class="tool-icon">${icon(glyph)}</div><h2>${title}</h2><p>${description}</p>${button('gardenest',label,'arrow','text-button',`data-section="${section}"`)}</article>`).join('')}</div>
    <section class="panel"><h2>Connected to the official site</h2><p>Gardenest opens in a dedicated window. Your sign-in stays in its website session; the launcher does not ask for your password. Check-ins, quests, and publication use the official interface.</p><p class="muted">Downloaded datapack ZIPs can be reviewed and imported into your selected profile. Enable mods and approve scripts in GP-Next. External sign-in providers may require your browser.</p>${button('website-tool','Open in browser','external','secondary','data-url="https://nest.pvzge.com/discover"')}</section>`;
}
const localImportQueue = [];
function reviewInstallation(installation) {
    gardenestInstallation = installation;
    const preview = installation.preview;
    openDialog(preview.update ? "Review mod update" : "Review mod installation", `<div class="package-detail-head"><span class="nest-art">${icon('puzzle')}</span><div><h2>${esc(preview.name)}</h2><p>${esc(preview.previousVersion ? preview.previousVersion + ' → ' : '')}${esc(preview.version)}</p></div></div><p>This package will be installed disabled in <strong>${esc(profile().name)}</strong>. Enable it from Datapacks when ready.</p>${preview.warnings.map(warning => `<p class="notice warning">${esc(warning)}</p>`).join('')}${preview.requirements.filter(requirement => requirement.status !== 'ready').map(requirement => `<p class="notice warning">${esc(requirement.name || requirement.id)}: ${esc(requirement.status)}</p>`).join('')}${preview.containsScripts ? '<label class="toggle"><input id="nest-trust" type="checkbox"><span>I trust the author and this script version.</span></label>' : ''}<div class="dialog-actions">${button('close-dialog','Cancel','','secondary')}${button('nest-confirm',preview.update ? 'Install update' : 'Install disabled','download','primary')}</div>`);
}
async function nextLocalImport() {
    const next = localImportQueue.shift();
    if (next) reviewInstallation(next.dropped ? await prepareDroppedInstall(next.profile, next.dropped) : await prepareLocalInstall(next.profile, next.name));
}
async function importPackages(paths) {
    if (state.running) throw new Error('Close the game before importing datapacks.');
    const selected = {...profile()};
    await ensureModConfiguration(selected);
    const result = await invoke('launcher_import_packages', {profileId: selected.id, paths});
    if (result.errors.length) notify(result.errors.join('\n'), true);
    localImportQueue.push(...result.installed.map(name => ({profile: selected, name})));
    gpnextPackages = null;
    if (page === 'gpnext') await refreshPackages();
    await nextLocalImport();
}

// Capture the File handles while the drop event is live. Native host paths
// are intentionally avoided: they may be inaccessible inside Flatpak.
document.addEventListener("dragover", event => {
    if (event.dataTransfer?.types?.includes("Files")) event.preventDefault();
    if (page !== "gpnext" || dialog.open) return;
    event.preventDefault();
    document.querySelector("#datapack-drop")?.classList.add("drag-active");
});
document.addEventListener("dragleave", event => {
    if (!event.relatedTarget) document.querySelector("#datapack-drop")?.classList.remove("drag-active");
});
document.addEventListener("drop", event => {
    if (event.dataTransfer?.types?.includes("Files")) event.preventDefault();
    if (page !== "gpnext") return;
    event.preventDefault();
    document.querySelector("#datapack-drop")?.classList.remove("drag-active");
    if (dialog.open || busy) return;
    if (!isDesktop) { notify("Open the installed launcher to import datapacks.", true); return; }
    if (state.running) { notify("Close the game before importing datapacks.", true); return; }
    const selected = {...profile()};
    const reading = readDroppedPackages(event.dataTransfer);
    action(async () => {
        const dropped = await reading;
        localImportQueue.push(...dropped.map(dropped => ({profile: selected, dropped})));
        await nextLocalImport();
    });
});

async function refreshLogs() {
    if (logLoading) return;
    logLoading = true;
    try {
        logFiles = isDesktop ? await invoke('launcher_logs') : [];
        if (!logFiles.some(file => file.name === selectedLog)) selectedLog = logFiles[0]?.name || '';
        if (selectedLog) await readLog();
    } catch (error) { notify(error, true); }
    finally { logLoading = false; if (page === 'logs') render(); }
}
async function readLog() {
    const name = selectedLog, revision = ++logReadRevision;
    try {
        const entry = await invoke('launcher_log_read', {name});
        if (selectedLog === name && revision === logReadRevision) { logEntry = entry; if (page === 'logs') render(); }
    } catch (error) { if (revision === logReadRevision) notify(error, true); }
}
function updateLogText() {
    const output = document.querySelector('#log-output');
    if (!output) return;
    const text = filteredLog(logEntry?.text || '', document.querySelector('#log-search')?.value || '', document.querySelector('#log-level')?.value || 'all');
    output.textContent = text || 'No matching lines.';
}
async function installNativeEvents() {
    if (!isDesktop || !window.__TAURI__?.event?.listen) return;
    const listen = window.__TAURI__.event.listen;
    await listen('tauri://drag-enter', () => { if (page === 'gpnext') document.querySelector('#datapack-drop')?.classList.add('drag-active'); });
    await listen('tauri://drag-leave', () => document.querySelector('#datapack-drop')?.classList.remove('drag-active'));
    await listen('tauri://drag-drop', event => {
        document.querySelector('#datapack-drop')?.classList.remove('drag-active');
        if (page === 'gpnext' && !dialog.open) action(() => importPackages(event.payload.paths || []));
    });
    await listen('gardenest-download', event => {
        const {path, name, success} = event.payload;
        if (!success || !path) { notify('Gardenest download did not complete.', true); return; }
        if (!name.toLowerCase().endsWith('.zip')) { notify(`Downloaded ${name}. This file is not a datapack ZIP.`); return; }
        gardenestDownloads.push({path, name});
        showGardenestDownload();
    });
}
function releasesPage() {
    return `${heading('', 'Releases', isFlatpak() ? 'Update the launcher and included game from GitHub.' : 'Download a game version and keep your existing installations.', button('refresh-releases', releaseLoading ? 'Checking…' : 'Check releases', 'refresh', 'secondary', releaseLoading ? 'disabled' : ''))}
    ${isFlatpak() ? `<div class="notice">${icon('info')}<p>Download a verified Flatpak bundle from GitHub to update the launcher and included game. Close the game first; restart the launcher after installation.</p></div>` : ''}
    ${releases?.cached ? `<div class="notice">${icon('info')}<p>Showing cached release notes. Downloads need a connection to GitHub.</p></div>` : ''}
    ${restartRequired ? `<div class="notice success" role="status">${icon('check')}<p>Update installed. Close and reopen Gardendless to use the new launcher and game.</p></div>` : ''}
    <div id="download-status">${downloadMarkup()}</div>
    ${!releases ? `<section class="panel empty-state">${icon('download')}<h2>${releaseLoading ? 'Checking GitHub…' : 'Browse published versions'}</h2><p>Release notes and installable builds will appear here. Your installed games work offline.</p>${button('refresh-releases', 'Load releases', 'releases', 'primary', releaseLoading ? 'disabled' : '')}</section>` :
        `<div class="release-list">${releases.releases.map(r => `<article class="panel release-card"><div class="section-heading"><div><span class="eyebrow">${esc(r.publishedAt.slice(0, 10))}</span><h2>${esc(r.name)}</h2></div><span class="badge ${r.prerelease ? '' : 'green'}">${r.prerelease ? 'Pre-release' : 'Release'}</span></div><details><summary>Release notes</summary><pre class="release-notes">${esc(r.body || 'No release notes provided.')}</pre></details><div class="release-assets">${r.assets.filter(a => a.compatible).map(a => `<div><span><strong>${esc(a.name)}</strong><small>${formatSize(a.size)} · SHA-256 verified on install</small></span>${button('install-release', isFlatpak() ? 'Update Flatpak' : 'Install', 'download', 'primary', `data-mutates data-id="${a.id}" ${installing ? 'disabled' : ''}`)}</div>`).join('') || `<p class="muted">${isFlatpak() ? 'No verified Flatpak bundle is attached to this release.' : 'No automatic install for this platform/build. Download it manually from the release page and import the executable.'}</p>`}</div>${button('release-url', 'View on GitHub', 'external', 'text-button', `data-url="${esc(r.url)}"`)}</article>`).join('')}</div>`}`;
}
function downloadMarkup() {
    if (!download)
        return '';
    const percent = download.total ? Math.min(100, Math.round(download.received / download.total * 100)) : 0;
    const labels = {downloading: isFlatpak() ? 'Downloading Flatpak update' : 'Downloading game', verifying: 'Verifying download', 'applying-update': 'Installing Flatpak update', 'restart-required': 'Update installed — restart required', installed: 'Installed', failed: 'Download failed', cancelled: 'Download cancelled'};
    return `<section class="panel download-card" role="status"><div><strong>${esc(labels[download.status] || download.status)}</strong><span>${formatSize(download.received)} / ${formatSize(download.total)}</span></div><progress max="100" ${download.total ? `value="${percent}"` : ''} aria-label="Download progress">${percent}%</progress>${installing && download.status !== 'applying-update' ? button('cancel-download', 'Cancel download', 'close', 'text-button') : ''}</section>`;
}
function appearancePanel() {
    const current = getAppearance();
    return `<section class="panel"><h2>Appearance</h2><div class="appearance-controls"><fieldset><legend>Theme</legend><div class="segmented">${Object.entries(modes).map(([value, label]) => `<label><input type="radio" name="appearance-mode" data-appearance="mode" value="${value}" ${current.mode === value ? 'checked' : ''}><span>${label}</span></label>`).join('')}</div></fieldset><fieldset><legend>Color palette</legend><div class="palette-options">${Object.entries(palettes).map(([value, label]) => `<label class="palette-option" data-palette="${value}"><input type="radio" name="appearance-palette" data-appearance="palette" value="${value}" ${current.palette === value ? 'checked' : ''}><span>${icon('check')}</span>${label}</label>`).join('')}</div><p class="muted">Follow Caelestia reads its current Quickshell Material scheme on Linux and updates as it changes. If unavailable, the Garden palette is used.</p></fieldset></div></section>`;
}
function settingsPage() {
    return `${heading('', 'Settings', 'Appearance, graphics, and application support.')}
    ${appearancePanel()}
    <section class="panel"><div class="section-heading"><h2>Graphics selection</h2>${icon('cpu')}</div><p class="muted">${state.platform === 'windows' ? 'Windows manages GPU preference in Settings → System → Display → Graphics. Add the game executable there.' : 'Automatic selection favors a primary AMD GPU, then integrated Intel/AMD graphics. NVIDIA uses X11 when available with DMA-BUF disabled, while keeping WebGL acceleration. Choose graphics and the window backend per profile.'}</p>
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
    const groups = [ ['Play', ['library', 'releases']], ['Manage', ['profiles', 'save', 'keybinds', 'gpnext']], ['Community', ['gardenest']], ['System', ['logs', 'settings']] ];
    return groups.map(([label, ids]) => `<div class="nav-group"><div class="nav-label">${label}</div>${ids.map(id => {
        const [glyph, text] = pages[id];
        return `<button type="button" data-page="${id}" aria-label="${text}" title="${text}" class="nav-item ${page === id ? 'active' : ''}" ${page === id ? 'aria-current="page"' : ''}>${icon(glyph)}<span>${text}</span></button>`;
    }).join('')}</div>`).join('');
}
let renderedPage = null;
let pendingMenuRender = false;
document.addEventListener('launcher:menuclose', () => {
    if (!pendingMenuRender) return;
    queueMicrotask(() => { if (pendingMenuRender) render(); });
});
function render() {
    const samePage = renderedPage === page;
    // Background refreshes should not tear a listbox out from under the pointer.
    if (samePage && document.querySelector('.select-menu')) { pendingMenuRender = true; return; }
    pendingMenuRender = false;
    const scroll = samePage ? window.scrollY : 0;
    const active = document.activeElement;
    const focusId = active?.id;
    const openNotes = samePage ? [...app.querySelectorAll('.release-card details')].map(el => el.open) : [];
    renderedPage = page;
    if (disposeEditor) {
        disposeEditor();
        disposeEditor = null;
    }
    const currentPage = pages[page] || pages.library;
    const pageContent = { library: libraryPage, profiles: profilesPage, gpnext: gpnextPage, releases: releasesPage, settings: settingsPage, save: editorPage, keybinds: editorPage, logs: logsPage, gardenest: gardenestPage };
    if (!app.querySelector('.shell')) app.innerHTML = `<div class="shell"><aside class="sidebar"><a class="brand" href="#library" aria-label="Gardendless library"><img class="brand-mark" src="./Icon.png" alt=""><span>Gardendless<small>Launcher</small></span></a><nav aria-label="Main navigation">${navigation()}</nav><div class="sidebar-bottom"><div class="availability"><span class="status-dot"></span>${isDesktop ? 'Offline play available' : 'Browser preview'}</div><button type="button" data-action="docs" class="nav-item">${icon('external')}<span>Documentation</span></button><div class="sidebar-version">Launcher ${esc(state.launcherVersion)}</div></div></aside><div class="workspace"><div class="topbar"><details class="mobile-menu"><summary aria-label="Open navigation">${icon('menu')}</summary><nav aria-label="Launcher navigation">${navigation()}</nav></details><span class="breadcrumb"><span class="desktop-crumb">Gardendless</span><span class="breadcrumb-divider desktop-crumb">/</span><strong>${currentPage[1]}</strong></span><div><span id="session-status">${state.running ? '<span class="badge green">Game running</span>' : ''}</span><span class="profile-chip" title="${esc(profile().name)}">${icon('leaf')}<span>${esc(profile().name)}</span></span></div></div><main id="main" tabindex="-1"></main></div></div>`;
    // Keep the navigation shell alive: focus and Material state transitions survive refreshes.
    app.querySelectorAll('[data-page]').forEach(button => {
        const selected = button.dataset.page === page;
        button.classList.toggle('active', selected);
        if (selected) button.setAttribute('aria-current', 'page');
        else button.removeAttribute('aria-current');
    });
    app.querySelector('.breadcrumb strong').textContent = currentPage[1];
    const chip = app.querySelector('.profile-chip');
    chip.title = profile().name;
    chip.querySelector('span').textContent = profile().name;
    app.querySelector('.sidebar-version').textContent = `Launcher ${state.launcherVersion}`;
    app.querySelector('#session-status').innerHTML = state.running ? '<span class="badge green">Game running</span>' : '';
    const main = app.querySelector('#main');
    main.classList.remove('page-enter');
    main.innerHTML = `${!isDesktop ? '<div class="preview-notice">Browser preview · Profile data and desktop actions are available in the installed launcher.</div>' : ''}${pageContent[page]()}`;
    document.title = `${currentPage[1]} · Gardendless Launcher`;
    app.querySelectorAll('.release-card details').forEach((el, index) => { el.open = Boolean(openNotes[index]); });
    window.scrollTo({top: scroll, behavior: 'instant'});
    if (samePage && focusId) queueMicrotask(() => document.getElementById(focusId)?.focus({preventScroll: true}));
    updateButtons();
    if (page === 'gpnext') filterPackages(app, packageQuery);
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
    app.querySelector('.mobile-menu')?.removeAttribute('open');
    page = next;
    history.replaceState(null, '', `#${next}`);
    render();
    if (next === 'gpnext') refreshPackages();
    if (next === 'logs') refreshLogs();
    if (next === 'gardenest' && isDesktop) refreshCatalog(profile().id, app);
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
    const p = {...freshProfile(), ...structuredClone(value)};
    const checkbox = (name, title, description, checked) => `<label class="toggle-row"><span><strong>${title}</strong><small>${description}</small></span><input type="checkbox" name="${name}" ${checked ? 'checked' : ''}><span class="switch" aria-hidden="true"></span></label>`;
    openDialog(p.id ? 'Edit profile' : 'New profile', `<form id="profile-form"><input type="hidden" name="id" value="${esc(p.id)}"><label class="field">Profile name<input name="name" value="${esc(p.name)}" placeholder="e.g. Mod experiments" maxlength="64" required autofocus></label><label class="field">Graphics device<select name="gpu"><option value="auto" ${p.gpu === 'auto' ? 'selected' : ''}>Automatic (recommended)</option><option value="system" ${p.gpu === 'system' ? 'selected' : ''}>System default</option>${selectOptions(state.gpus, p.gpu, g => g.label)}</select></label>
    ${state.platform === 'linux' ? `<label class="field">Window backend<select name="windowBackend">${[['auto', 'Automatic (NVIDIA compatibility)'], ['wayland', 'Wayland'], ['x11', 'X11 / XWayland']].map(([id, label]) => `<option value="${id}" ${p.windowBackend === id ? 'selected' : ''}>${label}</option>`).join('')}</select><small>X11 can avoid NVIDIA presentation problems. Automatic keeps the normal backend on Intel/AMD systems.</small></label>` : ''}
    ${checkbox('applySettings', 'Apply launch preferences', 'Save these choices into GP-Next on the next launch. In-game changes persist until you save this profile again.', p.applySettings)}
    <label class="field">Render resolution<select name="renderScale">${[100,85,75,50].map(value => `<option value="${value}" ${value === (p.renderScale ?? 100) ? 'selected' : ''}>${value}%${value === 100 ? ' · Native' : ' · Lower GPU load'}</option>`).join('')}</select></label>
    <div class="form-pair"><label class="field">Frame limit<select name="frameRate">${[30, 60, 90, 120, 144, 165, 180, 240].map(f => `<option value="${f}" ${f === p.frameRate ? 'selected' : ''}>${f} FPS</option>`).join('')}</select></label><label class="field">Widescreen trim<select name="widescreen">${['none', 'fog', 'bushes'].map(f => `<option value="${f}" ${f === p.widescreen ? 'selected' : ''}>${f[0].toUpperCase() + f.slice(1)}</option>`).join('')}</select></label></div>
    <label class="field">Media fallback sound profile<select name="audioProfile">${[['balanced', 'Balanced fallback'], ['performance', 'Performance fallback — fewer effects'], ['rich', 'Rich fallback — more effects']].map(([value, label]) => `<option value="${value}" ${value === (p.audioProfile || 'balanced') ? 'selected' : ''}>${label}</option>`).join('')}</select></label>
    <details class="experimental"><summary>GP-Next experiments</summary>${checkbox('jsModding', 'JavaScript Modding', 'Allow installed JavaScript mods to run.', p.jsModding)}${checkbox('worldMapJson', 'Worldmap Modding', 'Allow world-map data extensions.', p.worldMapJson)}${checkbox('plantLevelSystem', 'Plant Level System', 'Enable plant-level mod features.', p.plantLevelSystem)}</details>
    ${checkbox('recovery', 'Start in recovery mode', 'Bypass mods with a temporary save. Progress in recovery is discarded.', p.recovery)}
    <p class="muted">${p.id === 'default' ? 'Your existing game data stays in its current location.' : 'This profile uses its own game saves and mod packages with the included game.'}</p><div class="dialog-actions">${button('close-dialog', 'Cancel', '', 'secondary')}<button type="submit" class="button primary">Save profile</button></div></form>`);
    dialog.querySelector('form').addEventListener('submit', event => {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const next = { ...p, id: values.get('id'), name: values.get('name'), gpu: values.get('gpu'), windowBackend: values.get('windowBackend') || p.windowBackend, frameRate: Number(values.get('frameRate')), renderScale: Number(values.get('renderScale')), widescreen: values.get('widescreen'), audioProfile: values.get('audioProfile') };
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
    if (page === 'releases') render();
    try {
        releases = await invoke('launcher_releases');
    }
    catch (error) {
        notify(error, true);
    }
    finally {
        releaseLoading = false;
        if (page === 'releases') render();
    }
}
async function external(url) {
    if (!/^https:\/\/(github\.com|pvzge\.com|nest\.pvzge\.com)\//.test(url))
        throw new Error('Unsupported link');
    if (isDesktop)
        await invoke('plugin:opener|open_url', { url });
    else
        window.open(url, '_blank', 'noopener,noreferrer');
}
async function handleAction(target) {
    const name = target.dataset.action;
    if (name === "nest-refresh" || name === "nest-page") {
        if (name === "nest-page") catalog.page = Math.max(1, Number(target.dataset.page) || 1);
        await refreshCatalog(profile().id, app); return;
    }
    if (name === "nest-install") {
        const project = catalog.result?.projects[Number(target.dataset.index)];
        if (!project || !versionFor(project)) return;
        await action(async () => {
            reviewInstallation(await prepareGardenestInstall({...profile()}, versionFor(project)));
        }, name); return;
    }
    if (name === "nest-confirm") {
        if (!gardenestInstallation) return;
        if (gardenestInstallation.preview.containsScripts && !dialog.querySelector('#nest-trust')?.checked) {notify('Review the script trust confirmation first.', true);return;}
        await action(async () => {
            await gardenestInstallation.commit(); gardenestInstallation = null; dialog.close();
            notify('Package installed disabled. Enable it from Datapacks when ready.');
            gpnextPackages = null;
            if (page === 'gardenest') await refreshCatalog(profile().id, app);
            if (page === 'gpnext') await refreshPackages();
            await nextLocalImport();
        }, name); return;
    }

    if (isFlatpak() && name === 'import') {
        notify('Update this installation through Flatpak. Native game imports require the standalone launcher.');
        return;
    }
    if (name === 'close-dialog') {
        localImportQueue.length = 0; gardenestInstallation = null;
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
    if (name === 'inspect-package') {
        const pack = gpnextPackages?.[Number(target.dataset.index)];
        if (pack) openDialog('Datapack details', `${packageDetails(pack)}<div class="dialog-actions">${button('close-dialog', 'Close', '', 'secondary')}${pack.managed ? button('toggle-package', pack.enabled ? 'Disable' : 'Enable on next launch', 'check', 'primary', `data-index="${target.dataset.index}"`) : button('review-package', 'Review installation', 'plus', 'primary', `data-index="${target.dataset.index}"`)}</div>`);
        return;
    }
    if (name === 'review-package') {
        const pack = gpnextPackages?.[Number(target.dataset.index)];
        if (pack && !pack.managed) await action(async () => {
            reviewInstallation(await prepareLocalInstall({...profile()}, pack.fileName));
        }, name);
        return;
    }
    if (name === 'toggle-package') {
        const pack = gpnextPackages?.[Number(target.dataset.index)];
        if (!pack?.managed) return;
        await action(async () => {
            await setPackageEnabled({...profile()}, pack.uuid, !pack.enabled);
            dialog.close(); await refreshPackages(); notify('Mod selection saved for the next launch.');
        }, name); return;
    }
    if (name === 'import-packs' || name === 'import-pack-folder') {
        await action(async () => {
            const paths = await invoke('launcher_pick_packages', {folder: name === 'import-pack-folder'});
            if (paths.length) await importPackages(paths);
        }, name); return;
    }
    if (name === 'refresh-logs') { await refreshLogs(); return; }
    if (name === 'select-log') { selectedLog = target.dataset.name; logEntry = null; render(); await readLog(); return; }
    if (name === 'open-logs') { navigate('logs'); return; }
    if (name === 'copy-log') {
        try { await navigator.clipboard.writeText(logEntry?.text || ''); notify('Session log copied.'); }
        catch { notify('Clipboard unavailable. Select and copy the log text.', true); }
        return;
    }
    if (name === 'gardenest') {
        if (isDesktop) await action(() => invoke('launcher_gardenest', {section: target.dataset.section}));
        else await external(`https://nest.pvzge.com${{discover:'/discover',account:'/login',tasks:'/tasks',creator:'/author'}[target.dataset.section] || '/discover'}`);
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
            if (isFlatpak()) restartRequired = true;
            notify(isFlatpak() ? 'Flatpak updated. Close and reopen the launcher to use the new version.' : 'Version installed and added to your library.');
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
        if (page === 'gardenest' && isDesktop) refreshCatalog(profile().id, app);
    }
});
window.addEventListener('hashchange', () => navigate(location.hash.slice(1)));
try {
    state = await loadState();
    startCaelestiaSync();
    page = pages[location.hash.slice(1)] ? location.hash.slice(1) : 'library';
    render();
    if (page === 'gpnext') refreshPackages();
    if (page === 'logs') refreshLogs();
    if (page === 'gardenest' && isDesktop) refreshCatalog(profile().id, app);
    await installNativeEvents();
}
catch (error) {
    app.innerHTML = `<main class="startup-error"><h1>Couldn’t open your library.</h1><p>${esc(error)}</p><p>Your files have not been changed.</p><button onclick="location.reload()">Try again</button></main>`;
}
let polling = false;
setInterval(async () => {
    if (!isDesktop || !state || polling || (document.hidden && !installing))
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
                notify('Game closed. Its session log is available in Logs.');
        }
        if (installing) {
            download = await invoke('launcher_download_status') || download;
            const region = document.querySelector('#download-status');
            if (region) {
                const markup = downloadMarkup();
                if (region.dataset.markup !== markup) { region.innerHTML = markup; region.dataset.markup = markup; }
            }
        }
    }
    catch { /* A closing native window does not need a repeating error toast. */ }
    finally {
        polling = false;
    }
}, 1000);

app.addEventListener('input', event => {
    if (event.target.id === 'package-search') { packageQuery = event.target.value; filterPackages(app, packageQuery); }
    if (event.target.id === 'log-search' || event.target.id === 'log-level') updateLogText();
});

app.addEventListener("submit", event => {
    if (event.target.id !== "nest-search-form") return;
    event.preventDefault();
    catalog.query = app.querySelector("#nest-search").value;
    catalog.kind = app.querySelector("#nest-type").value;
    catalog.page = 1;
    refreshCatalog(profile().id, app);
});
