import { o } from "./Translations.js";
function renderAppearance(container) {
  const mk = (title) => {
    const section = document.createElement(`div`);
    section.className = `gp-section`;
    const button = document.createElement(`button`);
    button.type = `button`, button.className = `gp-section-title`, button.setAttribute(`aria-expanded`, `true`);
    const arrow = document.createElement(`span`);
    arrow.className = `gp-section-arrow`, arrow.textContent = `\u25BC`;
    const label = document.createElement(`span`);
    label.textContent = title, button.append(arrow, label);
    button.addEventListener(`click`, () => {
      section.classList.toggle(`gp-collapsed`), button.setAttribute(`aria-expanded`, String(!section.classList.contains(`gp-collapsed`)));
    });
    const body = document.createElement(`div`);
    body.className = `gp-section-body`, section.append(button, body), container.appendChild(section);
    return body;
  };
  const appearance = mk(o(`settings.appearance`));
  appearance.innerHTML = `<div class="gp-appearance-controls"><label class="gp-appearance-toggle"><input type="checkbox" id="gpnBlur"><span><strong>${o(`settings.blurBackground`)}</strong><small>${o(`settings.blurBackgroundDesc`)}</small></span></label><label class="gp-appearance-toggle"><input type="checkbox" id="gpnCompact"><span><strong>${o(`settings.compactLayout`)}</strong><small>${o(`settings.compactLayoutDesc`)}</small></span></label><label class="gp-appearance-toggle"><input type="checkbox" id="gpnReduceMotion"><span><strong>${o(`settings.reduceMotion`)}</strong><small>${o(`settings.reduceMotionDesc`)}</small></span></label><label class="gp-appearance-color-row" for="gpnAccent"><span class="gp-appearance-color-copy"><strong>${o(`settings.accentColor`)}</strong><small>${o(`settings.accentColorDesc`)}</small><code id="gpnAccentValue"></code></span><input type="color" id="gpnAccent" value="#4a9eff" aria-label="${o(`settings.accentColor`)}"></label><div id="gpnAppearanceRanges"></div></div>`;
  const storageKey = `gpnext-ui`;
  const ui = { blur: true, accent: [74, 158, 255], tint: 24, opacity: 92, radius: 11, compact: false, reduceMotion: false };
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || `{}`);
    if (saved && typeof saved === `object`) {
      for (const key of [`blur`, `compact`, `reduceMotion`]) if (key in saved) ui[key] = saved[key] === true;
      if (Array.isArray(saved.accent) && saved.accent.length === 3 && saved.accent.every((value) => Number.isFinite(Number(value)))) ui.accent = saved.accent.map((value) => Math.max(0, Math.min(255, Number(value))));
      if (Number.isFinite(Number(saved.tint))) ui.tint = Math.max(0, Math.min(45, Number(saved.tint)));
      if (Number.isFinite(Number(saved.opacity))) ui.opacity = Math.max(70, Math.min(100, Number(saved.opacity)));
      if (Number.isFinite(Number(saved.radius))) ui.radius = Math.max(6, Math.min(18, Number(saved.radius)));
    }
  } catch {
  }
  const apply = () => {
    let style = document.getElementById(`gpnext-ui-overrides`);
    if (!style) {
      style = document.createElement(`style`), style.id = `gpnext-ui-overrides`, document.head.appendChild(style);
    }
    const blend = (base) => base.map((channel, index) => Math.round(channel * (1 - ui.tint / 100) + ui.accent[index] * (ui.tint / 100))).join(`,`);
    const [red, green, blue] = ui.accent;
    style.textContent = `:root{--gp-accent-rgb:${red},${green},${blue};--gp-panel-rgb:${blend([5, 9, 21])};--gp-surface-rgb:${blend([13, 20, 36])};--gp-raised-rgb:${blend([21, 30, 48])};--gp-control-rgb:${blend([4, 8, 19])}}#gp-overlay{--gp-accent-rgb:${red},${green},${blue};--gp-panel-rgb:${blend([5, 9, 21])};--gp-surface-rgb:${blend([13, 20, 36])};--gp-raised-rgb:${blend([21, 30, 48])};--gp-control-rgb:${blend([4, 8, 19])};--gp-overlay-opacity:${ui.opacity / 100};--gp-surface-opacity:${(ui.opacity / 100 * 0.82).toFixed(2)};--gp-raised-opacity:${(ui.opacity / 100 * 0.92).toFixed(2)};--gp-card-opacity:${(ui.opacity / 100 * 0.44).toFixed(2)};--gp-ui-radius:${ui.radius}px;background:linear-gradient(135deg,rgba(${red},${green},${blue},.16),transparent 72%),rgba(var(--gp-panel-rgb),var(--gp-overlay-opacity))}` + (ui.blur ? `` : `#gp-overlay{backdrop-filter:none !important;-webkit-backdrop-filter:none !important}`) + (ui.compact ? `#gp-overlay.gp-compact-ui .gp-content{padding:10px}#gp-overlay.gp-compact-ui .gp-section{padding:9px}#gp-overlay.gp-compact-ui .gp-section-body{gap:5px}#gp-overlay.gp-compact-ui .gp-list-item{padding:8px}#gp-overlay.gp-compact-ui .gp-appearance-toggle,#gp-overlay.gp-compact-ui .gp-appearance-color-row{padding:9px}` : ``) + (ui.reduceMotion ? `#gp-overlay.gp-reduce-motion *,#gp-overlay.gp-reduce-motion *::before,#gp-overlay.gp-reduce-motion *::after{scroll-behavior:auto !important;animation-duration:.01ms !important;animation-iteration-count:1 !important;transition-duration:.01ms !important}` : ``);
    document.getElementById(`gp-overlay`)?.classList.toggle(`gp-compact-ui`, ui.compact);
    document.getElementById(`gp-overlay`)?.classList.toggle(`gp-reduce-motion`, ui.reduceMotion);
    document.body.classList.toggle(`gpn-noblur`, !ui.blur);
    try {
      localStorage.setItem(storageKey, JSON.stringify(ui));
    } catch {
    }
  };
  const blurToggle = appearance.querySelector(`#gpnBlur`);
  const compactToggle = appearance.querySelector(`#gpnCompact`);
  const motionToggle = appearance.querySelector(`#gpnReduceMotion`);
  const colorPicker = appearance.querySelector(`#gpnAccent`);
  const colorValue = appearance.querySelector(`#gpnAccentValue`);
  blurToggle.checked = ui.blur, compactToggle.checked = ui.compact, motionToggle.checked = ui.reduceMotion;
  const updateColor = () => {
    const hex = colorPicker.value;
    ui.accent = [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    colorValue.textContent = hex.toUpperCase(), apply();
  };
  colorPicker.value = `#${ui.accent.map((channel) => channel.toString(16).padStart(2, `0`)).join(``)}`, colorValue.textContent = colorPicker.value.toUpperCase();
  blurToggle.addEventListener(`change`, () => {
    ui.blur = blurToggle.checked, apply();
  });
  compactToggle.addEventListener(`change`, () => {
    ui.compact = compactToggle.checked, apply();
  });
  motionToggle.addEventListener(`change`, () => {
    ui.reduceMotion = motionToggle.checked, apply();
  });
  colorPicker.addEventListener(`input`, updateColor);
  const ranges = appearance.querySelector(`#gpnAppearanceRanges`);
  const addRange = (key, titleKey, descriptionKey, min, max, suffix) => {
    const row = document.createElement(`label`), copy = document.createElement(`span`), title = document.createElement(`strong`), description = document.createElement(`small`), value = document.createElement(`output`), input = document.createElement(`input`);
    row.className = `gp-appearance-range`, copy.className = `gp-appearance-color-copy`, title.textContent = o(titleKey), description.textContent = o(descriptionKey), value.textContent = `${ui[key]}${suffix}`;
    input.type = `range`, input.min = String(min), input.max = String(max), input.step = `1`, input.value = String(ui[key]), input.setAttribute(`aria-label`, o(titleKey));
    input.addEventListener(`input`, () => {
      ui[key] = Number(input.value), value.textContent = `${ui[key]}${suffix}`, apply();
    });
    copy.append(title, description, value), row.append(copy, input), ranges.appendChild(row);
  };
  addRange(`tint`, `settings.accentTint`, `settings.accentTintDesc`, 0, 45, `%`);
  addRange(`opacity`, `settings.panelOpacity`, `settings.panelOpacityDesc`, 70, 100, `%`);
  addRange(`radius`, `settings.cornerRadius`, `settings.cornerRadiusDesc`, 6, 18, `px`);
  apply();
}
export {
  renderAppearance
};
