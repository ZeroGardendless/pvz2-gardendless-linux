import { isJsModdingRuntimeEnabled } from "../core/SettingsStore.js";
import { r as t, t as n } from "../mods/ModSelection.js";
import { t as r } from "../mods/ModSettingsRegistry.js";
import { createJsModLoader } from "../mods/JsModLoader.js";
async function prepareStartupAttemptHost({ review: a2, record: o, installStore: s, saveBoundary: c, patcher: l, cc: u, signal: d }) {
  let f = a2.candidate.packs.some((e2) => e2.enabled !== false && e2.meta.js), p = () => {
    if (f && !isJsModdingRuntimeEnabled()) throw Error(`JavaScript modding is disabled`);
  }, m = () => {
    throw Error(`Restart normally before changing the mod configuration`);
  }, h = r({ initialData: a2.configuration.modSettings, storage: { async write() {
  } } }), g = createJsModLoader({ modSettingsRegistry: h, startupAttempt: true });
  p();
  let _ = await t({ candidate: a2.candidate, patcher: l, loader: g, cc: u, signal: d, attempt: true, previousLedger: [], saveBoundary: { capture: () => c.captureRaw(), checkAvailable() {
  }, beginNativeReads: () => c.beginNativeReads() }, beforeScripts: async () => p(), afterScripts: async () => {
  } }), v = `prepared`, y = Object.freeze({ ...o, desired: a2.configuration });
  return Object.freeze({ patcher: l, loader: g, result: _.result, settingsRegistry: h, desiredSettings: h, prepareInstall: m, applyRuntimeSettings: m, modSelection: n({ getState: () => y }, { installStore: s, canEdit: () => false, prepare: m, prepareApplication: m, getRuntimeStatus: () => g.getStatus() }), getPhase: () => v, getResourceConsumers: () => _.getResourceConsumers(), async publish() {
    try {
      p(), _.publish(), v = `published`;
    } catch (e2) {
      throw v = `failed-restart-required`, e2;
    }
  }, async activate() {
    try {
      return p(), await _.activate(), v = `active`, _.result;
    } catch (e2) {
      throw v = `failed-restart-required`, e2;
    }
  }, async fail(e2) {
    throw v = `failed-restart-required`, e2;
  } });
}
export {
  prepareStartupAttemptHost
};
