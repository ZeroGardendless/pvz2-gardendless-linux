function normalizeFilePath(value) {
  const path = String(value || "").replace(/\\/g, "/");
  return (path.startsWith("//") ? "//" : "") + path.replace(/^\/\//, "").replace(/\/+/g, "/");
}
export {
  normalizeFilePath
};
