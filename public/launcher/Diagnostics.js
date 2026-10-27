/** Record UI failures locally so denied IPC commands aren't lost on close. */
export function installDiagnostics(host = window) {
  if (!host.__TAURI_INTERNALS__ || host.__gdDiagnostics) return;
  host.__gdDiagnostics = true;
  const queue = [];
  let timer = null;
  const stringify = value => value instanceof Error ? value.stack || value.message : typeof value === "string" ? value : String(value);
  const record = (level, values) => {
    if (queue.length < 20) queue.push({level, message: values.map(stringify).join(" ").slice(0, 4096)});
    if (timer !== null) return;
    timer = setTimeout(() => {
      timer = null;
      const entries = queue.splice(0);
      host.__TAURI_INTERNALS__.invoke("ui_log", {entries}).catch(() => {});
    }, 250);
  };
  for (const level of ["warn", "error"]) {
    const original = host.console[level].bind(host.console);
    host.console[level] = (...values) => { original(...values); record(level, values); };
  }
  host.addEventListener("error", event => record("error", [event.error || event.message]));
  host.addEventListener("unhandledrejection", event => record("error", [event.reason]));
}
