import { describe, expect, it } from 'vitest';
import { formatCHF, formatDate, formatNumber } from './format';

describe('format', () => {
  it('groups thousands with a narrow no-break space', () => {
    expect(formatNumber(190)).toBe('190');
    expect(formatNumber(4380)).toBe('4 380');
    expect(formatNumber(100000)).toBe('100 000');
  });
  it('joins amount and currency without allowing a line break', () => {
    expect(formatCHF(1490)).toBe('1 490 CHF');
  });
  it('formats dates in Spanish', () => {
    expect(formatDate('2026-11-30T12:00:00Z')).toBe('30 de noviembre de 2026');
  });
});
