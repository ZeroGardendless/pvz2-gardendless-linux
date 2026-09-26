import { n as getLogs, r } from "../../core/Logger.js";
import { a } from "../Translations.js";
import { n as toast } from "../Toast.js";
import { n as saveDialog } from "../../platform/Dialog.js";
import { u } from "../../platform/FileSystem.js";
import { n as makeButton } from "../Components.js";
let diagnosticsProvider = null;
let activeContainer = null;
let activeList = null;
let countLabel = null;
let pauseButton = null;
let query = "";
let levelFilter = "all";
let paused = false;
let unsubscribe = null;
let refreshTimer = null;
const entryRows = /* @__PURE__ */ new WeakMap();
const levelClasses = {
  info: "gp-badge-info",
  warn: "gp-badge-warning",
  error: "gp-badge-error",
  debug: "gp-badge-success"
};
function bindDiagnostics(provider) {
  diagnosticsProvider = provider;
}
function formatEntry(entry) {
  return `[${new Date(entry.time).toLocaleString()}] [${String(entry.level).toUpperCase()}] [${entry.module}] ${entry.msg}`;
}
function visibleEntries(entries = getLogs()) {
  const search = query.trim().toLocaleLowerCase();
  return entries.filter((entry) => {
    if (levelFilter !== "all" && entry.level !== levelFilter) return false;
    if (!search) return true;
    return `${entry.module} ${entry.msg}`.toLocaleLowerCase().includes(search);
  });
}
function createEntry(entry) {
  if (entryRows.has(entry)) return entryRows.get(entry);
  const row = document.createElement("article");
  row.className = "gp-list-item gp-log-entry";
  const top = document.createElement("div");
  top.className = "gp-log-entry-top";
  const badge = document.createElement("span");
  badge.className = `gp-badge ${levelClasses[entry.level] || "gp-badge-info"}`;
  badge.textContent = String(entry.level || "info").toUpperCase();
  const module = document.createElement("span");
  module.className = "gp-text-mono gp-text-muted gp-log-module";
  module.title = entry.module || "";
  module.textContent = entry.module || "";
  const time = document.createElement("time");
  time.className = "gp-text-muted gp-log-entry-time";
  time.dateTime = new Date(entry.time).toISOString();
  time.textContent = new Date(entry.time).toLocaleTimeString();
  top.append(badge, module, time);
  const message = document.createElement("div");
  message.className = "gp-log-entry-message";
  message.textContent = entry.msg ?? "";
  row.append(top, message);
  entryRows.set(entry, row);
  return row;
}
function refreshView() {
  if (!activeContainer || !activeList) return;
  const entries = getLogs();
  const matches = visibleEntries(entries);
  countLabel.textContent = a("log.showing", matches.length, entries.length);
  activeList.replaceChildren();
  if (!entries.length) {
    const empty = document.createElement("p");
    empty.className = "gp-log-empty gp-text-muted";
    empty.textContent = a("log.empty");
    activeList.appendChild(empty);
  } else if (!matches.length) {
    const empty = document.createElement("p");
    empty.className = "gp-log-empty gp-text-muted";
    empty.textContent = a("log.noMatches");
    activeList.appendChild(empty);
  } else {
    for (let index = matches.length - 1; index >= 0; index--) {
      activeList.appendChild(createEntry(matches[index]));
    }
  }
}
async function copyEntries(entries, successKey) {
  try {
    await navigator.clipboard.writeText(entries.map(formatEntry).join("\n"));
    toast(a(successKey), "success");
  } catch {
    toast(a("settings.modSettingsClipboard"), "error");
  }
}
function render(container) {
  container.replaceChildren();
  activeContainer = container;
  activeList = null;
  const toolbar = document.createElement("div");
  toolbar.className = "gp-log-toolbar";
  const titleGroup = document.createElement("div");
  titleGroup.className = "gp-log-title-group";
  const heading = document.createElement("h2");
  heading.className = "gp-log-title";
  heading.textContent = a("log.title");
  countLabel = document.createElement("span");
  countLabel.className = "gp-log-count gp-text-muted";
  const search = document.createElement("input");
  search.type = "search";
  search.className = "gp-input gp-log-search";
  search.placeholder = a("log.search");
  search.setAttribute("aria-label", a("log.search"));
  search.value = query;
  search.addEventListener("input", () => {
    query = search.value;
    refreshView();
  });
  const filter = document.createElement("select");
  filter.className = "gp-select gp-log-filter";
  filter.setAttribute("aria-label", a("log.filterAll"));
  for (const optionData of [
    ["all", a("log.filterAll")],
    ["info", "INFO"],
    ["warn", "WARN"],
    ["error", "ERROR"],
    ["debug", "DEBUG"]
  ]) {
    const option = document.createElement("option");
    option.value = optionData[0];
    option.textContent = optionData[1];
    option.selected = option.value === levelFilter;
    filter.appendChild(option);
  }
  filter.addEventListener("change", () => {
    levelFilter = filter.value;
    refreshView();
  });
  titleGroup.append(heading, countLabel, filter);
  const actions = document.createElement("div");
  actions.className = "gp-inline-actions gp-log-actions";
  pauseButton = makeButton(a(paused ? "log.resume" : "log.pause"), () => {
    paused = !paused;
    pauseButton.textContent = a(paused ? "log.resume" : "log.pause");
    pauseButton.setAttribute("aria-pressed", String(paused));
    refreshView();
  }, { small: true });
  pauseButton.setAttribute("aria-pressed", String(paused));
  const copyVisibleButton = makeButton(a("log.copyVisible"), () => {
    copyEntries(visibleEntries(), "common.success");
  }, { small: true });
  const copyAllButton = makeButton(a("log.copyAll"), () => {
    copyEntries(getLogs(), "common.success");
  }, { small: true });
  const clearButton = makeButton(a("log.clear"), () => {
    getLogs().splice(0, getLogs().length);
    refreshView();
  }, { small: true, variant: "danger" });
  actions.append(pauseButton, copyVisibleButton, copyAllButton, clearButton);
  if (diagnosticsProvider) {
    const exportButton = makeButton(a("log.exportDiagnostics"), async () => {
      exportButton.disabled = true;
      const fileName = "gp-next-diagnostics.json";
      try {
        const report = JSON.stringify(diagnosticsProvider(), null, 2);
        const filePath = await saveDialog({
          defaultPath: fileName,
          filters: [{ name: "JSON", extensions: ["json"] }]
        });
        if (filePath) {
          await u(filePath, report);
          toast(a("toast.saved", fileName), "success");
        }
      } catch {
        toast(a("toast.saveFailed", fileName), "error");
      } finally {
        exportButton.disabled = false;
      }
    }, { small: true });
    actions.appendChild(exportButton);
  }
  toolbar.append(titleGroup, search, actions);
  const list = document.createElement("div");
  list.className = "gp-list gp-log-list";
  list.setAttribute("aria-live", "polite");
  activeList = list;
  container.append(toolbar, list);
  refreshView();
}
function onActivate() {
  if (unsubscribe) unsubscribe();
  const listener = () => {
    if (paused || refreshTimer !== null) return;
    refreshTimer = setTimeout(() => {
      refreshTimer = null;
      if (!paused) refreshView();
    }, 100);
  };
  r(listener);
  unsubscribe = () => r(null);
}
function onDeactivate() {
  if (refreshTimer !== null) clearTimeout(refreshTimer);
  refreshTimer = null;
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  activeContainer = null;
  activeList = null;
  countLabel = null;
  pauseButton = null;
}
export {
  bindDiagnostics,
  onActivate,
  onDeactivate,
  render
};
