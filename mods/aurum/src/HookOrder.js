/** Reuse immutable ordering snapshots until hook registration changes.
 * An in-flight call keeps its old snapshot if another hook is removed mid-call.
 */
export function createHookOrderCache() {
  const records = new WeakMap();
  return function ordered(record, revision) {
    const cached = records.get(record);
    if (cached?.revision === revision) return cached.order;
    const order = [...record.hooks].sort((a, b) => b.priority - a.priority || a.order - b.order);
    records.set(record, {revision, order});
    return order;
  };
}
