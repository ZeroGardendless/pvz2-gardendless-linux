function createListSnapshot(entries, resolveOriginal, resolveCurrent) {
  const indexed = entries.map((entry) => ({ entry, search: `${entry.id}
${entry.label}`.toLowerCase() }));
  const comparisons = /* @__PURE__ */ new Map();
  return {
    search(query) {
      const needle = query.trim().toLowerCase();
      return needle ? indexed.filter((row) => row.search.includes(needle)).map((row) => row.entry) : entries;
    },
    isModified(entry) {
      if (!comparisons.has(entry.id)) {
        const original = resolveOriginal(entry.id), current = resolveCurrent(entry.id);
        comparisons.set(entry.id, !!original && !!current && JSON.stringify(original) !== JSON.stringify(current));
      }
      return comparisons.get(entry.id);
    }
  };
}
export {
  createListSnapshot
};
