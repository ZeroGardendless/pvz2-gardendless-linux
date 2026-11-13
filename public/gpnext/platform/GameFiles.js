import { t as chooseDirectory } from "./Dialog.js";
import { a as readFile, l as stat, o as readTextFile } from "./FileSystem.js";
import { validateMusicManifest } from "../../game-music-packs.js";
async function readMusicPackFiles(directory, fs = { stat, readFile, readTextFile }) {
  const join = (path) => directory.replace(/[\\/]$/, "") + "/" + path.replaceAll("\\", "/");
  const manifestPath = join("pack.json"), info = await fs.stat(manifestPath);
  if (info.size > 1024 * 1024) throw new Error("Music pack manifest exceeds 1 MiB");
  const text = await fs.readTextFile(manifestPath), manifest = JSON.parse(text);
  const paths = validateMusicManifest(manifest);
  if (paths.length > 2048) throw new Error("Music pack has too many audio files");
  const files = [{ path: "pack.json", blob: new Blob([text], { type: "application/json" }) }];
  let total = 0;
  for (const relative of paths) {
    const path = join(relative), info2 = await fs.stat(path);
    total += info2.size;
    if (!Number.isSafeInteger(info2.size) || info2.size < 0 || info2.size > 128 * 1024 * 1024 || total > 512 * 1024 * 1024) throw new Error("Music pack exceeds import size limits");
    const bytes = await fs.readFile(path);
    if (bytes.byteLength !== info2.size) throw new Error("Music file changed while reading: " + relative);
    files.push({ path: relative.replaceAll("\\", "/"), bytes, blob: new Blob([bytes]) });
  }
  return files;
}
function installGameFilePicker(api) {
  api.pickMusicPackFiles = async () => {
    const directory = await chooseDirectory({ directory: true, multiple: false, title: "Import music pack folder" });
    return typeof directory === "string" ? readMusicPackFiles(directory) : null;
  };
}
export {
  installGameFilePicker,
  readMusicPackFiles
};
