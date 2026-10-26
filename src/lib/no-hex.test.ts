import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = join(import.meta.dirname, '..');
const allowed = new Set(['styles/tokens.css']);

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

describe('brand rule: no loose hex colours', () => {
  it('only tokens.css contains hex colours', () => {
    const offenders = walk(root)
      .filter((f) => /\.(astro|tsx|ts|css|mdx)$/.test(f) && !f.endsWith('.test.ts'))
      .filter((f) => !allowed.has(relative(root, f)))
      .filter((f) =>
        /#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b/.test(readFileSync(f, 'utf8').replace(/&#\d+;/g, '')),
      )
      .map((f) => relative(root, f));
    expect(offenders).toEqual([]);
  });
});
