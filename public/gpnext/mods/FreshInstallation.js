import { r as e } from "./GameConfiguration.js";
import { t } from "./ModConfigurationState.js";
import { i as n } from "./FileLoader.js";
import { i as r } from "./ModSettingsRegistry.js";
async function initializeFreshPlatform({ storage: i2, installStore: a, reader: o = n(), readModSettings: s = r, fs: scopedFs }) {
  if (scopedFs) return initializeScopedFresh({ storage: i2, installStore: a, fs: scopedFs });
  let c = [];
  for (let [t2, n2] of [[`patches`, e.SINGLE_PATCHES], [`edits`, e.GPN_EDITS]]) {
    let e2 = await o.captureOptional(n2);
    await a.install(e2), c.push({ kind: t2, contentDigest: e2.digest });
  }
  let l = t({ storage: i2, initial: { configuration: { revision: 0, mods: [], modSettings: (await s()).data, overrides: c }, generation: 0, packages: [], entityLedger: [] } });
  return await l.load(), await i2.initialize(l.getState(), async () => {
    for (let e2 of c) if ((await a.read(e2.contentDigest))?.digest !== e2.contentDigest) throw Error(`Initial platform snapshot is unavailable`);
  }), l.getState();
}
import { f as scopedBaseDir, t as scopedExists } from "../platform/FileSystem.js";
import { t as createScopedState } from "./ModConfigurationState.js";
import { n as emptySnapshot } from "./PackSnapshot.js";
async function initializeScopedFresh({ storage: i2, installStore: a, fs: o = { exists: scopedExists } }) {
  let s = { baseDir: scopedBaseDir.AppData };
  if ((await Promise.all([`gp-next`, `patches`].map((e2) => o.exists(e2, s)))).some(Boolean)) return null;
  let c = await emptySnapshot([]);
  await a.install(c);
  let l = createScopedState({ storage: i2, initial: { configuration: { revision: 0, mods: [], modSettings: { version: 1, mods: {} }, overrides: [`patches`, `edits`].map((e2) => ({ kind: e2, contentDigest: c.digest })) }, generation: 0, packages: [], entityLedger: [] } });
  return await l.load(), await i2.initialize(l.getState(), async () => {
    if ((await a.read(c.digest))?.digest !== c.digest) throw Error(`Initial platform snapshot is unavailable`);
  }), l.getState();
}
export {
  initializeFreshPlatform
};
