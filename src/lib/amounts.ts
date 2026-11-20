/**
 * Amounts never break across lines: the thousands space inside a number and the space between a
 * figure and its currency become non-breaking spaces. Applied to all Markdown and MDX.
 */
const NBSP = ' ';

export const keepAmounts = (text: string) =>
  text
    .replace(/(\d) (?=\d{3}(?!\d))/g, `$1${NBSP}`)
    .replace(/(\d) (?=(?:CHF|EUR|€|Fr\.)(?!\p{L}))/gu, `$1${NBSP}`)
    .replace(/\b(CHF|EUR|Fr\.) (?=\d)/g, `$1${NBSP}`);

/** The same, for every string inside a data structure (the tax calendars). */
export const keepAmountsDeep = <T>(value: T): T => {
  if (typeof value === 'string') return keepAmounts(value) as T;
  if (Array.isArray(value)) return value.map(keepAmountsDeep) as T;
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, keepAmountsDeep(v)])) as T;
  return value;
};

/** Sätteri HAST plugin (markdown.processor in astro.config.mjs). */
export const amountsPlugin = {
  name: 'keep-amounts',
  text(node: { type: 'text'; value: string }) {
    const value = keepAmounts(node.value);
    if (value !== node.value) return { type: 'text' as const, value };
  },
};
