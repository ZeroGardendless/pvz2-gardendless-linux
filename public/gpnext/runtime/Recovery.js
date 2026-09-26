const parameter = "gpnext-recovery";
function isRecoverySession() {
  return !!globalThis.location && new URL(location.href).searchParams.get(parameter) === "1";
}
function recoveryUrl(enabled, href = location.href) {
  const url = new URL(href);
  if (enabled) url.searchParams.set(parameter, "1");
  else url.searchParams.delete(parameter);
  return url.href;
}
function createTemporaryStorage(initial = {}) {
  const values = new Map(Object.entries(initial).map(([key, value]) => [key, String(value)]));
  const api = {
    get length() {
      return values.size;
    },
    key(index) {
      return [...values.keys()][Number(index)] ?? null;
    },
    getItem(key) {
      return values.get(String(key)) ?? null;
    },
    setItem(key, value) {
      values.set(String(key), String(value));
    },
    removeItem(key) {
      values.delete(String(key));
    },
    clear() {
      values.clear();
    }
  };
  return new Proxy(api, {
    get(target, key) {
      return key in target ? Reflect.get(target, key) : values.get(String(key));
    },
    set(_, key, value) {
      values.set(String(key), String(value));
      return true;
    },
    deleteProperty(_, key) {
      values.delete(String(key));
      return true;
    },
    ownKeys() {
      return [...values.keys()];
    },
    getOwnPropertyDescriptor(_, key) {
      return values.has(key) ? { value: values.get(key), enumerable: true, configurable: true, writable: true } : void 0;
    }
  });
}
function installRecoveryStorage(host) {
  const preferences = {};
  for (const key of ["gpnext-ui", "gp-next-settings", "gp-next-locale"]) {
    const value = host.localStorage.getItem(key);
    if (value !== null) preferences[key] = value;
  }
  const temporary = createTemporaryStorage(preferences);
  Object.defineProperty(host, "localStorage", { configurable: true, value: temporary });
  if (host.localStorage !== temporary) throw new Error("Unable to isolate recovery saves.");
  return temporary;
}
function renderRecoveryControl(container, { floating = false } = {}) {
  const box = document.createElement("section");
  box.className = "gp-section";
  if (floating) box.style.cssText = "position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:99998;max-width:85vw;padding:12px;background:#172235;color:#fff;border:1px solid #8196b0;border-radius:10px;font:14px system-ui;";
  const message = document.createElement("p");
  message.textContent = isRecoverySession() ? "Recovery session: no mods are loaded. Saves and preferences here are temporary and discarded when you leave." : "Restart without mods using a fresh temporary save. Your normal saves, installed packs and selected load order stay intact.";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "gp-btn";
  button.textContent = isRecoverySession() ? "Return to normal game" : "Restart in recovery mode";
  button.addEventListener("click", () => {
    location.href = recoveryUrl(!isRecoverySession());
  });
  box.append(message, button);
  container.append(box);
}
if (globalThis.window && isRecoverySession()) installRecoveryStorage(window);
export {
  createTemporaryStorage,
  installRecoveryStorage,
  isRecoverySession,
  recoveryUrl,
  renderRecoveryControl
};
