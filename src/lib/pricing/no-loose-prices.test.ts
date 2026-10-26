import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '../..');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe('brand rule: prices live only in lib/pricing/config.ts', () => {
  it('no amount in CHF or EUR outside config.ts, content or tests', () => {
    const amount = /\d[\d\s\u202F.,]*\s?(CHF|EUR|€)/;
    const offenders = walk(root)
      .filter((f) => /\.(astro|ts|tsx)$/.test(f) && !f.endsWith('.test.ts'))
      .filter((f) => relative(root, f) !== 'lib/pricing/config.ts' && !f.includes('/dev/'))
      .filter((f) => amount.test(readFileSync(f, 'utf8')))
      .map((f) => relative(root, f));
    expect(offenders).toEqual([]);
  });
});
