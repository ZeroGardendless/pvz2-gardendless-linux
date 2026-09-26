function summarizeModProblems(status = {}, diagnostics = {}) {
  const issues = [];
  const text = (value) => typeof value === "string" ? value : value?.message || JSON.stringify(value);
  for (const pack of status.packs || []) {
    for (const error of [...pack.preflightErrors || [], ...pack.errors || []]) {
      issues.push({ kind: "Pack validation", name: pack.meta?.name || pack.name || pack.id || pack.dir || "Unknown pack", detail: text(error), advice: "Disable this pack, check its manifest and required features, then try again." });
    }
  }
  for (const runtime of diagnostics.runtimes || []) {
    for (const error of runtime.errors || []) issues.push({ kind: "JavaScript mod", name: runtime.name || runtime.namespace, detail: text(error), advice: "Check the mod\u2019s supported game/API version. Disable it and restart to isolate the failure." });
  }
  for (const conflict of diagnostics.conflicts || []) {
    const owners = (conflict.owners || []).map((id) => diagnostics.runtimes?.find((runtime) => runtime.namespace === id)?.name || id);
    issues.push({ kind: "Shared hook", name: owners.join(" + ") || "Multiple mods", detail: `${conflict.key || conflict.kind || "Game hook"} is modified by more than one mod.`, advice: "This is a potential conflict, not proof of a failure. Test the listed mods individually; changing load order may change the result." });
  }
  for (const error of status.errors || []) issues.push({ kind: "Patch error", name: "Patcher", detail: text(error), advice: "Review the affected file or pack in the error details. Recovery mode can help confirm whether mods are involved." });
  return issues;
}
export {
  summarizeModProblems
};
