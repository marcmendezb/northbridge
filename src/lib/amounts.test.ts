import { describe, expect, it } from 'vitest';
import { keepAmounts } from './amounts';

const NBSP = ' ';

describe('keepAmounts', () => {
  it('joins thousands and the currency to the figure', () => {
    expect(keepAmounts('desde 200 000 CHF al año')).toBe(`desde 200${NBSP}000${NBSP}CHF al año`);
    expect(keepAmounts('1 000 000 €')).toBe(`1${NBSP}000${NBSP}000${NBSP}€`);
    expect(keepAmounts('bis CHF 200 000')).toBe(`bis CHF${NBSP}200${NBSP}000`);
  });

  it('leaves years, article numbers and other words alone', () => {
    expect(keepAmounts('entre 2025 2026')).toBe('entre 2025 2026');
    expect(keepAmounts('art. 38 ATSG')).toBe('art. 38 ATSG');
    expect(keepAmounts('3 CHFs')).toBe('3 CHFs');
  });
});
