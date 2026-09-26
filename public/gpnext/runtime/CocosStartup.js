import { renderRecoveryControl } from "./Recovery.js";
var e = Object.freeze([`beforeEngineImport`, `beforeEngineInit`, `beforeProject`, `afterProject`, `beforeRun`]), t = class extends Error {
  constructor(e2, t2) {
    super(`Cocos startup failed at ${e2}: ${t2?.message || String(t2)}`, { cause: t2 }), this.name = `StartupFailure`, this.phase = e2, this.restartRequired = true;
  }
};
async function n({ importEngine: n2, configureEngine: r2, initOptions: i, phases: a = {}, timeoutMs: o = 3e4, onPhase: s = () => {
} }) {
  for (let [t2, n3] of Object.entries(a)) if (!e.includes(t2) || typeof n3 != `function`) throw TypeError(`Invalid startup task: ${t2}`);
  if (!Number.isFinite(o) || o <= 0) throw TypeError(`Invalid startup timeout`);
  let c = { ...a }, l = new AbortController(), u = `beforeEngineImport`, d, f = [], p = { signal: l.signal }, m = 0, h = async (n3) => {
    if (d) throw d;
    if (u = n3, n3 !== e[m]) throw Error(`Unexpected startup phase: ${n3}`);
    if (m += 1, s(n3), !c[n3]) return;
    let r3, i2;
    try {
      await Promise.race([Promise.resolve().then(() => c[n3](Object.freeze({ ...p, phase: n3 }))), new Promise((e2, t2) => {
        r3 = setTimeout(() => t2(Error(`Task timed out after ${o}ms`)), o), i2 = () => {
          clearTimeout(r3), t2(l.signal.reason);
        }, l.signal.addEventListener(`abort`, i2, { once: true });
      })]);
    } catch (e2) {
      throw d = e2 instanceof t ? e2 : new t(n3, e2), l.abort(d), d;
    } finally {
      clearTimeout(r3), l.signal.removeEventListener(`abort`, i2);
    }
  };
  try {
    await h(`beforeEngineImport`), u = `engineImport`;
    let e2 = await n2();
    p.cc = e2, u = `engineConfiguration`, await r2(e2);
    for (let t2 of [`onPreProjectInitDelegate`, `onPostProjectInitDelegate`]) if (typeof e2.game[t2]?.add != `function` || typeof e2.game[t2]?.remove != `function`) throw Error(`Missing Cocos delegate: ${t2}`);
    for (let [t2, n3] of [[e2.game.onPreProjectInitDelegate, `beforeProject`], [e2.game.onPostProjectInitDelegate, `afterProject`]]) {
      let e3 = () => h(n3);
      t2.add(e3), f.push([t2, e3]);
    }
    return await h(`beforeEngineInit`), u = `engineInit`, await e2.game.init(typeof i == `function` ? i(e2) : i), await h(`beforeRun`), u = `gameRun`, await e2.game.run(), e2;
  } catch (e2) {
    throw d = e2 instanceof t ? e2 : new t(u, e2), l.abort(d), d;
  } finally {
    for (let [e2, t2] of f) e2.remove(t2);
  }
}
function showStartupFailure(e2) {
  console.error(`[Cocos Bootstrap] failed to start game: ` + (e2?.message || String(e2)), e2);
  let t2 = (globalThis.navigator?.language || ``).startsWith(`zh`), n2 = document.createElement(`section`);
  n2.setAttribute(`role`, `alert`), n2.style.cssText = `position:fixed;inset:16px;z-index:2147483647;padding:20px;background:#17191f;color:#fff;overflow:auto;font:15px system-ui;`;
  let r2 = document.createElement(`p`);
  r2.textContent = t2 ? `\u542F\u52A8\u5DF2\u505C\u6B62\uFF08${e2.phase || `bootstrap`}\uFF09\u3002${e2.cause?.message || e2.message}` : `Startup stopped (${e2.phase || `bootstrap`}). ${e2.cause?.message || e2.message}`;
  let i = document.createElement(`button`);
  i.style.cssText = `font:inherit;padding:8px 12px;margin:0 8px 8px 0;`, i.textContent = e2.cause?.recoveryRequiresRestart || e2.recoveryRequiresRestart ? t2 ? `\u91CD\u542F\u4EE5\u6062\u590D\u914D\u7F6E` : `Restart to recover configuration` : t2 ? `\u91CD\u65B0\u542F\u52A8` : `Restart`, i.addEventListener(`click`, () => globalThis.location.reload()), n2.append(r2);
  let a = e2.cause?.recoveryAction || e2.recoveryAction;
  if (typeof a == `function`) {
    let o = document.createElement(`p`);
    o.textContent = t2 ? `\u6A21\u7EC4\u53EF\u80FD\u5DF2\u6539\u52A8\u5B58\u6863\u6216\u5176\u4ED6\u6587\u4EF6\u3002\u53EA\u6062\u590D\u914D\u7F6E\u4E0D\u4F1A\u64A4\u9500\u8FD9\u4E9B\u53D8\u5316\u3002` : `Mods may have changed saves or other files. Restoring configuration alone does not undo those changes.`, n2.append(o);
    let s = document.createElement(`input`);
    if (s.type = `checkbox`, s.checked = false, e2.cause?.hasSaveBackup || e2.hasSaveBackup) {
      let e3 = document.createElement(`label`);
      e3.style.cssText = `display:flex;align-items:center;gap:8px;margin:16px 0;`, e3.append(s, document.createTextNode(t2 ? `\u540C\u65F6\u6062\u590D\u5931\u8D25\u64CD\u4F5C\u524D\u7684\u6E38\u620F\u5B58\u6863` : `Also restore game saves from before the failed operation`));
      let r3 = document.createElement(`p`);
      r3.textContent = t2 ? `\u6240\u6709\u73A9\u5BB6\u7684\u8FDB\u5EA6\u5C06\u56DE\u9000\u5230\u5907\u4EFD\u3002\u5F53\u524D\u5B58\u6863\u4F1A\u53E6\u884C\u5907\u4EFD\uFF1B\u6A21\u7EC4\u81EA\u6709\u6570\u636E\u4E0D\u4F1A\u56DE\u9000\u3002` : `All player progress returns to the backup. Current saves are backed up first; mod-owned data is not reverted.`, r3.hidden = true, s.addEventListener(`change`, () => {
        r3.hidden = !s.checked;
      }), n2.append(e3, r3);
    }
    let c = document.createElement(`button`);
    c.style.cssText = i.style.cssText, c.textContent = t2 ? `\u68C0\u67E5\u5E76\u6062\u590D\u4E0A\u6B21\u914D\u7F6E` : `Check and restore previous configuration`, c.addEventListener(`click`, async () => {
      if (!c.disabled) {
        c.disabled = i.disabled = s.disabled = true, r2.textContent = t2 ? `\u6B63\u5728\u68C0\u67E5\u6A21\u7EC4\u4E0E\u5B58\u6863\u2026` : `Checking mods and saves\u2026`;
        try {
          await a({ restoreSave: s.checked }), globalThis.location.reload();
        } catch (e3) {
          r2.textContent = t2 ? `\u6062\u590D\u672A\u5B8C\u6210\u3002${e3.message || e3}` : `Recovery did not complete. ${e3.message || e3}`, c.disabled = i.disabled = s.disabled = false;
        }
      }
    }), n2.append(c);
  }
  n2.append(i), renderRecoveryControl(n2), document.body.append(n2);
}
export {
  n as i,
  t as n,
  showStartupFailure,
  e as t
};
