const counters = new Map<string, number>();

/** Id estable y único por prefijo durante el render (determinista entre builds). */
export function uid(prefix: string): string {
  const n = (counters.get(prefix) ?? 0) + 1;
  counters.set(prefix, n);
  return `${prefix}-${n}`;
}
