import { getSettings, setSettings } from "../core/SettingsStore.js";
import { a } from "../ui/Translations.js";
import { u, i } from "../ui/Components.js";
let layer, canvas, left, right, observer, pendingFrame = 0, generation = 0;
let artwork = null;
let statusKey = "settings.widescreenOff";
const artworkCache = /* @__PURE__ */ new Map();
function widescreenGeometry(width, height) {
  const playfield = 1920;
  return { gutter: Math.max(0, (width - playfield) / 2), height };
}
function setLayerVisible(visible) {
  layer.hidden = !visible;
  layer.style.display = visible ? "block" : "none";
}
function clearArtwork() {
  artwork = null;
  setLayerVisible(false);
  for (const side of [left, right]) {
    side.firstChild.style.backgroundImage = "none";
    side.lastChild.style.backgroundImage = "none";
  }
}
function layout() {
  pendingFrame = 0;
  if (!layer || !canvas || !artwork) return;
  const rect = canvas.getBoundingClientRect();
  const viewportWidth = document.documentElement?.clientWidth || window.innerWidth || rect.width;
  const visibleLeft = Math.max(0, rect.left);
  const visibleWidth = Math.max(0, Math.min(viewportWidth, rect.left + rect.width) - visibleLeft);
  const { gutter, height } = widescreenGeometry(visibleWidth, rect.height);
  setLayerVisible(gutter > 0 && height > 0);
  Object.assign(layer.style, {
    left: `${visibleLeft}px`,
    top: `${rect.top}px`,
    width: `${visibleWidth}px`,
    height: `${height}px`
  });
  for (const [side, edge] of [[left, artwork[0]], [right, artwork[1]]]) {
    const capWidth = edge.naturalWidth * height / edge.naturalHeight;
    const overlap = 1 / (window.devicePixelRatio || 1);
    side.style.width = `${gutter + capWidth}px`;
    side.firstChild.style.width = `${capWidth}px`;
    side.lastChild.style.width = `${gutter + overlap}px`;
  }
}
function scheduleLayout() {
  if (!pendingFrame && artwork) pendingFrame = requestAnimationFrame(layout);
}
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Missing widescreen image: ${url}`));
    image.src = url;
  });
}
async function applyStyle(style) {
  const request = ++generation;
  clearArtwork();
  statusKey = style === "none" ? "settings.widescreenOff" : "settings.widescreenLoading";
  if (style === "none") return;
  try {
    let images = artworkCache.get(style);
    if (!images) {
      images = await Promise.all(["left", "right", "middle"].map(async (side) => {
        const filename = `${style}_${side}.png`;
        const paths = [`/assets/widescreen/${filename}`, `/assets/widescreen/${style}/${filename}`];
        if (style === "bushes") paths.push(`/assets/widescreen/bush/${filename}`);
        for (const path of paths) {
          try {
            return await loadImage(new URL(path, import.meta.url).href);
          } catch {
          }
        }
        throw new Error(`Missing widescreen image: ${filename}`);
      }));
      artworkCache.set(style, images);
    }
    if (request !== generation) return;
    artwork = images;
    for (const [side, edge, position] of [[left, images[0], "right"], [right, images[1], "left"]]) {
      side.firstChild.style.backgroundImage = `url("${edge.src}")`;
      side.firstChild.style.backgroundPosition = position;
      side.lastChild.style.backgroundImage = `url("${images[2].src}")`;
      side.lastChild.style.backgroundPosition = position;
    }
    statusKey = "settings.widescreenReady";
    layout();
  } catch {
    if (request === generation) statusKey = "settings.widescreenMissing";
  }
}
function initWidescreen() {
  if (layer) return;
  canvas = document.getElementById("GameCanvas");
  if (!canvas) return;
  layer = document.createElement("div");
  layer.id = "gd-widescreen";
  layer.hidden = true;
  layer.setAttribute("aria-hidden", "true");
  layer.style.cssText = "display:none;position:fixed;pointer-events:none;z-index:90000;overflow:hidden;contain:layout paint;";
  for (const position of ["left", "right"]) {
    const side = document.createElement("div");
    side.style.cssText = `position:absolute;top:0;bottom:0;${position}:0;overflow:hidden;`;
    const cap = document.createElement("div");
    const tile = document.createElement("div");
    const inner = position === "left" ? "right" : "left";
    cap.style.cssText = `position:absolute;top:0;bottom:0;${inner}:0;background-size:auto 100%;background-repeat:no-repeat;`;
    tile.style.cssText = `position:absolute;top:0;bottom:0;${position}:0;background-size:auto 100%;background-repeat:repeat-x;`;
    side.append(cap, tile);
    layer.append(side);
    if (position === "left") left = side;
    else right = side;
  }
  document.body.append(layer);
  observer = new ResizeObserver(scheduleLayout);
  observer.observe(canvas);
  window.addEventListener("resize", scheduleLayout, { passive: true });
  window.addEventListener("scroll", scheduleLayout, { passive: true });
  document.addEventListener("fullscreenchange", scheduleLayout);
  void applyStyle(getSettings().widescreen);
}
function renderWidescreenSettings(container) {
  initWidescreen();
  const status = i(a(statusKey));
  status.setAttribute("role", "status");
  const choices = ["none", "fog", "bushes"].map((value) => ({
    value,
    label: a(`settings.widescreen${value[0].toUpperCase()}${value.slice(1)}`)
  }));
  const picker = u(a("settings.widescreenStyle"), choices, getSettings().widescreen, async (style) => {
    setSettings({ widescreen: style });
    const result = applyStyle(style);
    status.textContent = a(statusKey);
    await result;
    status.textContent = a(statusKey);
  });
  container.append(picker, i(a("settings.widescreenDesc")), status);
}
export {
  initWidescreen,
  renderWidescreenSettings,
  widescreenGeometry
};
