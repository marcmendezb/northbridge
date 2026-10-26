import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { contrastPairs, contrastRatio, forbiddenPairs, readTokens } from './contrast';

const tokens = readTokens(readFileSync(join(import.meta.dirname, '../styles/tokens.css'), 'utf8'));

describe('brand contrast pairs', () => {
  for (const p of contrastPairs) {
    it(`${p.fg} on ${p.bg} ≥ ${p.min}`, () => {
      expect(contrastRatio(tokens[p.fg], tokens[p.bg])).toBeGreaterThanOrEqual(p.min);
    });
  }
  it('semantic text colours meet AA on their backgrounds', () => {
    for (const s of ['success', 'warning', 'error', 'info']) {
      expect(contrastRatio(tokens[`${s}-text`], tokens[`${s}-bg`])).toBeGreaterThanOrEqual(4.5);
    }
  });
  it('white on Salvia 400 fails AA (and must never be used)', () => {
    const p = forbiddenPairs[0];
    expect(contrastRatio(tokens[p.fg], tokens[p.bg])).toBeLessThan(4.5);
  });
});
