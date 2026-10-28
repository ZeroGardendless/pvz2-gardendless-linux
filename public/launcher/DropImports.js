// Read only the files supplied by the desktop drop. This works inside Flatpak
// without assuming a host /home path is visible in the application's sandbox.
const MAX_FILE_BYTES = 50_000_000;
const MAX_FOLDER_BYTES = 100_000_000;
const MAX_FILES = 2000;
export async function readDroppedPackages(transfer) {
  const items = [...(transfer?.items || [])].filter(item => item.kind === "file");
  const sources = items.length ? items.map(item => {
    const file = item.getAsFile();
    let entry;
    try { entry = item.webkitGetAsEntry?.(); } catch { /* Generated File objects have no backing path. */ }
    return {entry, file};
  })
    : [...(transfer?.files || [])].map(file => ({file}));
  if (!sources.length || sources.length > 20) throw new Error("Drop between 1 and 20 datapacks.");
  const packages = [];
  for (const {entry, file} of sources) {
    if (!entry?.isDirectory) {
      const value = file || (entry?.isFile ? await new Promise((resolve, reject) => entry.file(resolve, reject)) : null);
      if (!value || !/\.zip$/i.test(value.name)) throw new Error("Drop a datapack ZIP or a folder containing pack.json.");
      if (value.size > MAX_FILE_BYTES) throw new Error("Datapack ZIP exceeds 50 MB.");
      packages.push({name: value.name, bytes: new Uint8Array(await value.arrayBuffer())});
      continue;
    }
    const entries = [];
    let total = 0;
    async function visit(node, prefix = "", depth = 0) {
      if (depth > 32 || !node.name || /[/\\]/.test(node.name) || [".", ".."].includes(node.name)) throw new Error("Invalid datapack folder path.");
      const path = prefix + node.name;
      if (node.isFile) {
        const file = await new Promise((resolve, reject) => node.file(resolve, reject));
        total += file.size;
        if (file.size > MAX_FILE_BYTES || total > MAX_FOLDER_BYTES || entries.length >= MAX_FILES) throw new Error("Datapack folder exceeds inspection limits.");
        entries.push([path, new Uint8Array(await file.arrayBuffer())]);
      } else if (node.isDirectory) {
        const reader = node.createReader();
        for (;;) {
          const children = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
          if (!children.length) break;
          for (const child of children) await visit(child, path + "/", depth + 1);
        }
      }
    }
    // The enclosing dropped folder is not part of the package's logical paths.
    const reader = entry.createReader();
    for (;;) {
      const children = await new Promise((resolve, reject) => reader.readEntries(resolve, reject));
      if (!children.length) break;
      for (const child of children) await visit(child);
    }
    if (!entries.some(([path]) => path === "pack.json")) throw new Error("Datapack folder is missing pack.json.");
    packages.push({name: entry.name, entries});
  }
  return packages;
}
