export const AUDIO_PROFILES = Object.freeze({
  performance: {label: 'Performance', voices: 4, pending: 8, idle: 4, preparation: 2},
  balanced: {label: 'Balanced', voices: 8, pending: 16, idle: 8, preparation: 2},
  rich: {label: 'More effects', voices: 12, pending: 24, idle: 12, preparation: 3},
});
const KEY = 'gp-next-audio-profile';
export function readAudioProfile(storage = globalThis.localStorage) {
  try { const value = storage?.getItem(KEY); return Object.hasOwn(AUDIO_PROFILES, value) ? value : 'balanced'; }
  catch { return 'balanced'; }
}
export function writeAudioProfile(value, storage = globalThis.localStorage) {
  if (!Object.hasOwn(AUDIO_PROFILES, value)) throw new Error('Unknown audio profile');
  storage?.setItem(KEY, value);
  globalThis.window?.__gdAudio?.configure(value);
}
export function renderAudioTuning(section) {
  if (!document.querySelector('#gp-audio-tuning-style')) {
    const style = document.createElement('style'); style.id = 'gp-audio-tuning-style';
    style.textContent = '#gp-overlay .gp-setting-row{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px;border:1px solid var(--gp-ui-border);border-radius:12px;background:rgba(var(--gp-surface-rgb),.65)}#gp-overlay .gp-setting-row>span{display:grid;gap:4px;min-width:0}#gp-overlay .gp-setting-row strong{color:#e2e8f0;font-size:14px}#gp-overlay .gp-setting-row small{color:#94a3b8;font-size:12px;line-height:1.45}#gp-overlay .gp-setting-row select{min-width:150px;max-width:100%;padding:10px;border:1px solid var(--gp-ui-border-strong);border-radius:9px;background:rgb(var(--gp-control-rgb));color:#e2e8f0}@media(max-width:570px){#gp-overlay .gp-setting-row{align-items:stretch;flex-direction:column}}';
    document.head.append(style);
  }
  const current = readAudioProfile();
  const label = document.createElement('label');
  label.className = 'gp-setting-row';
  const copy = document.createElement('span');
  const title = document.createElement('strong'); title.textContent = 'Sound effects';
  const description = document.createElement('small');
  description.textContent = 'Balanced is recommended. More effects allows extra simultaneous sounds but uses more media pipelines; Performance uses fewer.';
  copy.append(title, description);
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Sound effect profile');
  for (const [value, entry] of Object.entries(AUDIO_PROFILES)) {
    const option = document.createElement('option'); option.value = value; option.textContent = entry.label;
    select.append(option);
  }
  select.value = current;
  select.addEventListener('change', () => writeAudioProfile(select.value));
  label.append(copy, select); section.append(label);
}
