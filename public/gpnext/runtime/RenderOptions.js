const RENDER_SCALES = [100, 85, 75, 50];
function normalizeRenderScale(value) {
  return RENDER_SCALES.includes(Number(value)) ? Number(value) : 100;
}
export {
  RENDER_SCALES,
  normalizeRenderScale
};
