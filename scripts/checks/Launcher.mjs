import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import vm from 'node:vm';
import { escapeHtml, freshProfile } from '../../public/launcher/Store.js';
import { profileRevision, profileSettings, initializeLauncherContext } from '../../public/gpnext/platform/Launcher.js';
assert.equal(escapeHtml('<img onerror="bad">'), '&lt;img onerror=&quot;bad&quot;&gt;');
const a = freshProfile(), b = freshProfile();
a.name = 'Changed';
assert.equal(b.name, '');
assert.equal(profileRevision({ ...b, id: 'test', updatedAt: 12 }), 'test:12');
assert.deepEqual(profileSettings({ ...b, frameRate: 144, worldMapJson: true }), { frameRate: '144', widescreen: 'none', experimental: { jsModding: false, worldMapJson: true, plantLevelSystem: false } });
await initializeLauncherContext(); // Browser/older hosts need no native launcher.
for (const file of await readdir('public/launcher'))
    if (file.endsWith('.js'))
        new vm.SourceTextModule(await readFile(`public/launcher/${file}`, 'utf8'));
const html = await readFile('public/index.html', 'utf8');
assert.ok(html.includes('src="/gpnext/Bootstrap.js"'));
const bootstrap = await readFile('public/gpnext/Bootstrap.js', 'utf8');
assert.ok(bootstrap.indexOf('await initializeLauncherContext()') < bootstrap.indexOf("await import('./Main.js')"));
console.log('Passed: launcher modules, HTML escaping, profile preferences, revision identity and boot ordering.');
// Profile preferences must apply once, then respect changes made in GPNext.
function storage() { const values = new Map(); return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) }; }
globalThis.localStorage = storage();
globalThis.sessionStorage = storage();
globalThis.location = { href: 'http://localhost/index.html' };
let context = { profile: { ...freshProfile(), id: 'default', applySettings: false, updatedAt: 0 }, openTab: null };
globalThis.window = { localStorage: globalThis.localStorage, __TAURI_INTERNALS__: { invoke: async () => context } };
localStorage.setItem('PvZ2_PlayerProperties', 'existing-save');
localStorage.setItem('gp-next-settings', JSON.stringify({ version: 5, frameRate: '90', experimental: { jsModding: true } }));
await initializeLauncherContext();
assert.equal(JSON.parse(localStorage.getItem('gp-next-settings')).frameRate, '90');
context = { profile: { ...freshProfile(), id: 'separate', applySettings: true, frameRate: 144, audioProfile: 'rich', updatedAt: 1 }, openTab: null };
await initializeLauncherContext();
assert.equal(JSON.parse(localStorage.getItem('gp-next-settings')).frameRate, '144');
assert.equal(localStorage.getItem('gp-next-audio-profile'), 'rich');
const { setSettings } = await import('../../public/gpnext/core/SettingsStore.js');
setSettings({ frameRate: '60' });
await initializeLauncherContext();
assert.equal(JSON.parse(localStorage.getItem('gp-next-settings')).frameRate, '60');
context.profile.updatedAt = 2;
await initializeLauncherContext();
assert.equal(JSON.parse(localStorage.getItem('gp-next-settings')).frameRate, '144');
assert.equal(localStorage.getItem('PvZ2_PlayerProperties'), 'existing-save');
console.log('Passed: default profile preserves preferences/saves; overrides apply once per revision and keep later GPNext edits.');
