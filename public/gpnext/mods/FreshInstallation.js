import { f, t } from "../platform/FileSystem.js";
import { t as n } from "./ModConfigurationState.js";
import { n as r } from "./PackSnapshot.js";
async function initializeFreshPlatform({ storage: i2, installStore: a, fs: o = { exists: t } }) {
  let s = { baseDir: f.AppData };
  if ((await Promise.all([`gp-next`, `patches`].map((e2) => o.exists(e2, s)))).some(Boolean)) return null;
  let c = await r([]);
  await a.install(c);
  let l = n({ storage: i2, initial: { configuration: { revision: 0, mods: [], modSettings: { version: 1, mods: {} }, overrides: [`patches`, `edits`].map((e2) => ({ kind: e2, contentDigest: c.digest })) }, generation: 0, packages: [], entityLedger: [] } });
  return await l.load(), await i2.initialize(l.getState(), async () => {
    if ((await a.read(c.digest))?.digest !== c.digest) throw Error(`Initial platform snapshot is unavailable`);
  }), l.getState();
}
export {
  initializeFreshPlatform
};
