const counters = new Map<string, number>();

/** Stable id, unique per prefix during render (deterministic across builds). */
export function uid(prefix: string): string {
  const n = (counters.get(prefix) ?? 0) + 1;
  counters.set(prefix, n);
  return `${prefix}-${n}`;
}
