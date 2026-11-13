import { GAME_ASSET_REVISION } from "../../GameAssetRevision.js";
const marker = Symbol.for("gardendless.asset-download-revision");
function assetRevisionUrl(raw, origin, revision = GAME_ASSET_REVISION) {
  if (typeof raw !== "string") return raw;
  try {
    const url = new URL(raw, origin);
    if (url.origin !== new URL(origin).origin || !/^\/(assets|src)\//.test(url.pathname)) return raw;
    url.searchParams.set("gdAssets", revision.slice(0, 20));
    return url.href;
  } catch {
    return raw;
  }
}
function installAssetRevision(cc, origin = location.href) {
  const downloader = cc?.assetManager?.downloader;
  if (typeof downloader?.download !== "function") throw Error("Game asset downloader unavailable");
  const existing = downloader[marker];
  if (existing?.revision === GAME_ASSET_REVISION) return;
  const original = existing?.wrapped === downloader.download ? existing.original : downloader.download;
  function wrapped(id, url, type, ...args) {
    const next = type === "bundle" ? url : assetRevisionUrl(url, origin);
    return original.call(this, id, next, type, ...args);
  }
  downloader.download = wrapped;
  Object.defineProperty(downloader, marker, { configurable: true, value: { revision: GAME_ASSET_REVISION, original, wrapped } });
}
export {
  assetRevisionUrl,
  installAssetRevision
};
