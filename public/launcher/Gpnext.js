import { invoke } from "./Store.js";

const encode = bytes => {
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += 32768) binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  return btoa(binary);
};
const decode = text => Uint8Array.from(atob(text), char => char.charCodeAt(0));
export function profileFileSystem(profileId) {
  const call = (op, path, extra = {}) => invoke("launcher_gpnext_fs", {profileId, op, path, ...extra});
  return {
    exists: path => call("exists", path), mkdir: path => call("mkdir", path),
    readDir: path => call("readDir", path), lstat: path => call("stat", path),
    readFile: async path => decode(await call("read", path)),
    writeFile: (path, bytes) => call("write", path, {data: encode(bytes)}),
    readTextFile: path => call("readText", path), writeTextFile: (path, text) => call("writeText", path, {data: text}),
    rename: (path, target) => call("rename", path, {target}), remove: path => call("remove", path),
  };
}
export async function installedOrigins(profileId) {
  const fs = profileFileSystem(profileId);
  const path = "gp-next/gardenest-sources.json";
  return await fs.exists(path) ? JSON.parse(await fs.readTextFile(path)) : {};
}
export async function decodeImport(raw, expectedId) {
  const bytes = new Uint8Array(raw);
  if (bytes.byteLength < 4) throw new Error("Incomplete Gardenest response");
  const length = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength).getUint32(0, true);
  if (!length || length > 65536 || length + 4 >= bytes.length) throw new Error("Invalid Gardenest descriptor size");
  const descriptor = JSON.parse(new TextDecoder("utf-8", {fatal: true}).decode(bytes.subarray(4, length + 4)));
  const payload = bytes.slice(length + 4);
  if (descriptor.protocolVersion !== 1 || descriptor.versionId !== expectedId || descriptor.byteLength !== payload.length) throw new Error("Gardenest descriptor mismatch");
  const digest = [...new Uint8Array(await crypto.subtle.digest("SHA-256", payload))].map(value => value.toString(16).padStart(2, "0")).join("");
  if (digest !== descriptor.sha256) throw new Error("Gardenest download checksum mismatch");
  return {descriptor, payload};
}
function unpack(bytes) {
  return new Promise((resolve, reject) => {
    const worker = new Worker("/gpnext/core/NestPackWorker.js", {type: "module"});
    const finish = (error, result) => { clearTimeout(timer); worker.terminate(); error ? reject(error) : resolve(result); };
    const timer = setTimeout(() => finish(new Error("Package inspection timed out")), 30000);
    worker.onerror = () => finish(new Error("Package inspection worker failed"));
    worker.onmessage = ({data}) => data.error ? finish(new Error(data.error)) : finish(null, data.entries);
    worker.postMessage(bytes, [bytes.buffer]);
  });
}
export async function prepareGardenestInstall(profile, versionId) {
  const {descriptor, payload} = await decodeImport(await invoke("download_nest_import", {versionId}), versionId);
  if (!["datapack", "mod"].includes(descriptor.type) || descriptor.format !== "zip") throw new Error("This creation is not a datapack or mod ZIP");
  return prepareInstall(profile, await unpack(payload), descriptor);
}
export async function ensureModConfiguration(profile) {
  const [{createConfigurationStorage}, {createPackInstallStore}, {initializeFreshPlatform}] = await Promise.all([
    import("../gpnext/mods/ModConfigurationStorage.js"), import("../gpnext/mods/PackInstallStore.js"), import("../gpnext/mods/FreshInstallation.js"),
  ]);
  const fs = profileFileSystem(profile.id), storage = createConfigurationStorage(fs);
  if (await storage.read() === null && !await initializeFreshPlatform({storage, installStore: createPackInstallStore(fs), fs})) throw new Error("Open GP-Next → Mods once to migrate this profile’s existing mods, then return here.");
}
export async function prepareDroppedInstall(profile, dropped) {
  const entries = dropped.entries || await unpack(dropped.bytes);
  return prepareInstall(profile, entries);
}
export async function prepareLocalInstall(profile, fileName) {
  if (!fileName || /[/\\]/.test(fileName) || fileName.startsWith('.')) throw new Error("Invalid package filename");
  const fs = profileFileSystem(profile.id), path = `gp-next/packs/${fileName}`;
  const stat = await fs.lstat(path);
  let entries;
  if (stat.isFile) {
    entries = await unpack(await fs.readFile(path));
  } else {
    entries = []; let total = 0;
    const walk = async (directory, prefix = "", depth = 0) => {
      if (depth > 32) throw new Error("Package is nested too deeply");
      for (const entry of await fs.readDir(directory)) {
        if (entry.isSymlink || /[/\\]/.test(entry.name)) throw new Error("Unsafe package entry");
        const name = prefix + entry.name;
        if (entry.isDirectory) await walk(`${directory}/${entry.name}`, name + "/", depth + 1);
        else if (entry.isFile) {
          const bytes = await fs.readFile(`${directory}/${entry.name}`); total += bytes.length;
          if (total > 50_000_000 || entries.length >= 20000) throw new Error("Package exceeds launcher inspection limits");
          entries.push([name, bytes]);
        }
      }
    };
    await walk(path);
  }
  return prepareInstall(profile, entries);
}
async function prepareInstall(profile, entries, descriptor = null) {
  const [{createConfigurationStorage}, {createPackInstallStore}, {t: createState}, {initializeFreshPlatform}, {n: createSnapshot}, {preparePackageInstall}] = await Promise.all([
    import("../gpnext/mods/ModConfigurationStorage.js"), import("../gpnext/mods/PackInstallStore.js"),
    import("../gpnext/mods/ModConfigurationState.js"), import("../gpnext/mods/FreshInstallation.js"),
    import("../gpnext/mods/PackSnapshot.js"), import("../gpnext/runtime/ColdStartHost.js"),
  ]);
  const fs = profileFileSystem(profile.id), storage = createConfigurationStorage(fs), installStore = createPackInstallStore(fs);
  if (await storage.read() === null && !await initializeFreshPlatform({storage, installStore, fs})) throw new Error("Open GP-Next → Mods once to migrate this profile’s existing mods, then return here.");
  const configurationState = createState({storage});
  await configurationState.load();
  const snapshot = await createSnapshot(entries);
  // Inspection reads script text but never evaluates it. Runtime opt-in is
  // enforced separately when enabling a package, not when storing it disabled.
  const features = feature => ({"experimental.jsModding": true, "runtime.jsModding": true,
    "experimental.worldMapJson": true, "runtime.worldMapJson": true, "experimental.plantLevelSystem": true, "runtime.plantLevelSystem": true,
    "runtime.dynamicPlantRegistry": true, "runtime.shopExtensions": true, "runtime.scrollSensitivity": true})[feature] ?? null;
  const installation = await preparePackageInstall({snapshot, configurationState, installStore, canEdit: () => true,
    hasFeature: features, assertCandidateAllowed() {}});
  const preview = {...installation.preview, warnings: [...installation.preview.warnings]};
  if (preview.containsScripts && !preview.enabled) preview.warnings.push("This package includes JavaScript. Enable JS modding in GP-Next before enabling the mod. Installing it does not execute its scripts.");
  return {descriptor, preview, async commit() {
    // Re-read durable state immediately before commit; the installer then checks
    // identity/revision again and writes immutable bytes before desired selection.
    const before = await storage.read();
    if (JSON.stringify(before) !== JSON.stringify(configurationState.getState())) throw new Error("Mod configuration changed. Review the installation again.");
    await installation.commit({trustedContentDigest: installation.preview.contentDigest});
    if (!descriptor) return;
    const origins = await installedOrigins(profile.id);
    origins[installation.preview.id] = {projectId: descriptor.projectId, versionId: descriptor.versionId, packUuid: installation.preview.id,
      sha256: descriptor.sha256, name: installation.preview.name, version: installation.preview.version};
    await fs.writeTextFile("gp-next/gardenest-sources.json.pending", JSON.stringify(origins));
    await fs.rename("gp-next/gardenest-sources.json.pending", "gp-next/gardenest-sources.json");
  }};
}

export async function setPackageEnabled(profile, packId, enabled) {
  const [{createConfigurationStorage}, {t: createState}] = await Promise.all([
    import("../gpnext/mods/ModConfigurationStorage.js"), import("../gpnext/mods/ModConfigurationState.js"),
  ]);
  const storage = createConfigurationStorage(profileFileSystem(profile.id));
  const state = createState({storage}); await state.load();
  const record = state.getState();
  if (record.journal || record.recovery?.required) throw new Error("Resolve the pending GP-Next recovery before changing mods.");
  const pack = record.desired.mods.find(mod => mod.id === packId);
  if (!pack) throw new Error("Package no longer exists. Refresh the list.");
  // Inherited preferences belong to the game's WebKit storage, not settings.json.
  // This only edits desired selection; cold startup still enforces runtime opt-in.
  const scriptsEnabled = profile.applySettings === false || profile.jsModding;
  if (enabled && !scriptsEnabled) {
    const fs = profileFileSystem(profile.id);
    const {h: loadJson5} = await import("../gpnext/mods/FileLoader.js");
    const manifest = loadJson5().parse(await fs.readTextFile(`gp-next/installed/${pack.contentDigest}/pack.json`));
    if (manifest.js) throw new Error("Enable JavaScript modding in this profile before enabling a script mod.");
  }
  // GP-Next validates dependencies/features again at cold startup; configuration
  // changes never execute mod code inside the launcher.
  const desired = {...record.desired, revision: record.desired.revision + 1,
    mods: record.desired.mods.map(mod => mod.id === packId ? {...mod, enabled: Boolean(enabled)} : mod)};
  await state.saveDesired(desired, record.desired.revision);
}
