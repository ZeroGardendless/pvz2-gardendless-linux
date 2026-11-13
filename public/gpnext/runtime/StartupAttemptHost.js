import { a as e } from "../core/SettingsStore.js";
import { i as t } from "../mods/PackPreparation.js";
import { n, t as r } from "../mods/ModSelection.js";
import { t as i } from "../mods/ModSettingsRegistry.js";
import { createJsModLoader } from "../mods/JsModLoader.js";
async function prepareStartupAttemptHost({ review: o2, configurationState: s, installStore: c, saveBoundary: l, patcher: u, cc: d, signal: f }) {
  let p = o2.candidate.packs.some((e2) => e2.enabled !== false && e2.meta.js), m = () => {
    if (p && !e()) throw Error(`JavaScript modding is disabled`);
  }, h = () => {
    throw Error(`Restart normally before changing the mod configuration`);
  }, g = i({ initialData: o2.configuration.modSettings, storage: { async write() {
  } } }), _ = createJsModLoader({ modSettingsRegistry: g, startupAttempt: true });
  m();
  let v = await n({ candidate: o2.candidate, patcher: u, loader: _, cc: d, signal: f, attempt: true, previousLedger: [], saveBoundary: { capture: () => l.captureRaw(), checkAvailable() {
  }, beginNativeReads: () => l.beginNativeReads() }, beforeScripts: async () => m(), afterScripts: async () => {
  } }), y = `prepared`;
  return Object.freeze({ patcher: u, loader: _, result: v.result, settingsRegistry: g, desiredSettings: g, prepareInstall: h, applyRuntimeSettings: h, modSelection: r(s, { installStore: c, canEdit: () => false, getEditState: () => y === `active` ? `restart-required` : `busy`, prepare: (e2) => t({ configuration: e2, installStore: c }), getRuntimeStatus: () => _.getStatus() }), getPhase: () => y, getResourceConsumers: () => v.getResourceConsumers(), async publish() {
    try {
      m(), v.publish(), y = `published`;
    } catch (e2) {
      throw y = `failed-restart-required`, e2;
    }
  }, async activate() {
    try {
      return m(), await v.activate(), y = `active`, v.result;
    } catch (e2) {
      throw y = `failed-restart-required`, e2;
    }
  }, async fail(e2) {
    throw y = `failed-restart-required`, e2;
  } });
}
export {
  prepareStartupAttemptHost
};
