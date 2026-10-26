import { describe, expect, it } from 'vitest';
import { dictionaries, locales } from './index';
import { alternates, localizedPath, parsePath } from './routes';

type Node = unknown;
/** Lista de rutas de hojas («a.b.0.c») con su valor. */
function leaves(node: Node, prefix = ''): [string, string][] {
  if (typeof node === 'string') return [[prefix, node]];
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, `${prefix}${i}.`));
  return Object.entries(node as Record<string, Node>).flatMap(([k, v]) =>
    leaves(v, `${prefix}${k}.`),
  );
}
const placeholders = (s: string) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();

const base = new Map(leaves(dictionaries.es));

describe('i18n dictionaries', () => {
  for (const locale of locales.filter((l) => l !== 'es')) {
    const entries = new Map(leaves(dictionaries[locale]));

    it(`${locale}: same keys as es`, () => {
      expect([...entries.keys()].sort()).toEqual([...base.keys()].sort());
    });

    it(`${locale}: same placeholders, no empty texts, no exclamation marks`, () => {
      for (const [key, value] of entries) {
        expect(value.trim(), key).not.toBe('');
        expect(placeholders(value), key).toEqual(placeholders(base.get(key) ?? ''));
        expect(value, key).not.toMatch(/[!¡]/);
      }
    });
  }

  it('the claim always ends with a period', () => {
    for (const locale of locales) expect(dictionaries[locale].brand.claim).toMatch(/\.$/);
  });
});

describe('i18n routes', () => {
  it('es has no prefix, the rest translate every segment', () => {
    expect(localizedPath('/servicios/iva-y-fiscalidad', 'es')).toBe('/servicios/iva-y-fiscalidad');
    expect(localizedPath('/servicios/iva-y-fiscalidad', 'en')).toBe('/en/services/vat-and-tax');
    expect(localizedPath('/precios', 'de')).toBe('/de/preise');
    expect(localizedPath('/', 'fr')).toBe('/fr');
    expect(localizedPath('/', 'es')).toBe('/');
  });

  it('parsePath is the inverse of localizedPath', () => {
    for (const canonical of ['/', '/servicios', '/precios', '/servicios/asesoria-para-startups']) {
      for (const { locale, path } of alternates(canonical)) {
        expect(parsePath(path)).toEqual({ locale, canonical });
      }
    }
  });

  it('translated slugs are unique per locale', () => {
    const canon = ['/servicios', '/precios', '/nosotros', '/recursos', '/contacto', '/calculadora'];
    for (const locale of locales) {
      const paths = canon.map((c) => localizedPath(c, locale));
      expect(new Set(paths).size).toBe(paths.length);
    }
  });
});
