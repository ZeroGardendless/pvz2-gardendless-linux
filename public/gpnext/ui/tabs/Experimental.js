import { isJsModdingRuntimeEnabled, setSettings, getSettings, getExperimentalSettings } from "../../core/SettingsStore.js";
import { o as i, p } from "../Translations.js";
import { f as o, i as s, l as c, n as l, r, u } from "../Components.js";
import { n as f } from "../Toast.js";
import { t } from "../../runtime/FrameSettings.js";
function m({ getEnabled: e2, setEnabled: t2, onChange: n2 = () => {
} }) {
  let r2 = `idle`, i2 = false, a2 = false, o2 = () => ({ stage: r2, enabled: e2(), restartRequired: i2, failed: a2 }), s2 = () => n2(o2());
  async function c2(n3) {
    if (r2 !== `busy`) {
      r2 = `busy`, a2 = false, s2();
      try {
        let r3 = await t2(n3);
        if (e2() !== n3) throw Error(`JS Modding preference was not applied`);
        i2 = r3?.restartRequired === true;
      } catch {
        a2 = true;
      } finally {
        r2 = `idle`, s2();
      }
    }
  }
  return { state: o2, request(t3) {
    if (r2 !== `busy`) {
      if (a2 = false, t3 && !e2()) {
        r2 = `risk`, s2();
        return;
      }
      if (!t3 && e2()) return c2(false);
    }
  }, confirm() {
    if (r2 === `risk`) return c2(true);
  }, cancel() {
    r2 !== `busy` && (r2 = `idle`, a2 = false, s2());
  } };
}
var h = null, g = m({ getEnabled: isJsModdingRuntimeEnabled, setEnabled: async (e2) => {
  let t2 = window.gpNext?.mods?.[e2 ? `enableJsModding` : `disableJsModding`];
  if (!t2) throw Error(`JS Modding is not ready`);
  return t2();
}, onChange: () => h?.() });
function onDeactivate() {
  g.cancel(), h = null;
}
function v(e2) {
  let t2 = g.state(), n2 = o(i(`experimental.jsModding`), t2.enabled, (e3) => {
    n2._setValue(t2.enabled), g.request(e3);
  });
  n2.querySelector(`button`).disabled = t2.stage !== `idle`;
  let r2 = [n2];
  if (t2.stage === `risk`) {
    let e3 = s(i(`experimental.jsModdingRisk`));
    e3.classList.add(`gp-risk-notice`), e3.setAttribute(`role`, `alert`);
    let t3 = l(i(`common.cancel`), () => g.cancel()), n3 = l(i(`experimental.jsModdingEnable`), () => g.confirm(), { variant: `danger` });
    r2.push(e3, r(t3, n3));
  }
  t2.failed && r2.push(s(i(`experimental.jsModdingFailed`))), t2.restartRequired && r2.push(s(i(`experimental.jsModdingRestartRequired`)), l(i(`experimental.jsModdingRestart`), () => window.location.reload())), e2.replaceChildren(c(i(`experimental.jsModding`), r2));
}
function render(e2) {
  onDeactivate();
  let l2 = getSettings().experimental || getExperimentalSettings(), u2 = o(i(`experimental.frameScheduler`), l2.frameScheduler, (r2) => {
    try {
      let i2 = getSettings(), o2 = { ...i2, experimental: { ...i2.experimental, frameScheduler: r2 } };
      t(p()?.game, o2), setSettings({ experimental: { frameScheduler: r2 } }), e2.replaceChildren(), render(e2);
    } catch {
      t(p()?.game, getSettings()), u2._setValue(!r2), f(i(`common.failed`), `error`);
    }
  }), m2 = [30, 60, 90, 120, 144, 165, 240].map((e3) => ({ value: String(e3), label: `${e3} FPS` })), g2 = String(l2.frameRate), b = u(i(`settings.frameRate`), m2, g2, (e3) => {
    let r2 = getSettings(), o2 = { experimental: { ...r2.experimental, frameRate: Number(e3) } };
    try {
      t(p()?.game, { ...r2, ...o2 }), setSettings(o2);
    } catch {
      b.querySelector(`select`).value = String(r2.experimental.frameRate), f(i(`common.failed`), `error`);
    }
  });
  e2.appendChild(c(i(`settings.frameRate`), l2.frameScheduler ? [u2, b] : [u2])), e2.appendChild(s(i(`experimental.reloadHint`)));
  let x = document.createElement(`div`);
  e2.appendChild(x), h = () => v(x), h();
  let S = o(i(`experimental.worldMapJson`), l2.worldMapJson === true, (e3) => {
    setSettings({ experimental: { worldMapJson: e3 === true } });
  });
  e2.appendChild(c(i(`experimental.worldMapJson`), [S]));
  let C = o(i(`experimental.plantLevelSystem`), l2.plantLevelSystem === true, (e3) => {
    setSettings({ experimental: { plantLevelSystem: e3 === true } });
  });
  e2.appendChild(c(i(`experimental.plantLevelSystem`), [C]));
}
export {
  onDeactivate,
  render
};
