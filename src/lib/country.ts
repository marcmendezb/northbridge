import { localeMeta, type Locale } from '../i18n/locales';
import type { Currency } from './pricing/config';

/**
 * País de la persona usuaria: decide la moneda y las formas jurídicas. Es independiente del idioma.
 * Se elige en el desplegable del header y se guarda en el navegador (`nb-country`); el HTML estático
 * trae una variante por país y el CSS (global.css) muestra solo la del país activo.
 */
export const COUNTRIES = ['CH', 'ES', 'DE', 'FR', 'IT'] as const;
export type Country = (typeof COUNTRIES)[number];

/** Sede en Zúrich: Suiza es el país por defecto (sin JS o sin elección guardada). */
export const DEFAULT_COUNTRY: Country = 'CH';
export const COUNTRY_STORAGE_KEY = 'nb-country';

/** Sociedad limitada (`gmbh`) y anónima (`ag`) de cada país. */
export type LegalFormId = 'gmbh' | 'ag';
export const LEGAL_FORMS: Record<Country, Record<LegalFormId, string>> = {
  CH: { gmbh: 'GmbH', ag: 'AG' },
  ES: { gmbh: 'SL', ag: 'SA' },
  DE: { gmbh: 'GmbH', ag: 'AG' },
  FR: { gmbh: 'SARL', ag: 'SA' },
  IT: { gmbh: 'S.r.l.', ag: 'S.p.A.' },
};

export const CURRENCY_BY_COUNTRY: Record<Country, Currency> = {
  CH: 'CHF',
  ES: 'EUR',
  DE: 'EUR',
  FR: 'EUR',
  IT: 'EUR',
};

export const currencyOf = (country: Country): Currency => CURRENCY_BY_COUNTRY[country];
export const legalForm = (country: Country, id: LegalFormId) => LEGAL_FORMS[country][id];

/** Nombre del país en el idioma de la página («Suiza», «Switzerland», «Schweiz»…). */
export function countryName(country: Country, locale: Locale): string {
  return (
    new Intl.DisplayNames([localeMeta[locale].intl], { type: 'region' }).of(country) ?? country
  );
}

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!,
  );

/**
 * Texto que depende del país, como HTML (`set:html`). Agrupa los países con el mismo resultado:
 * si todos coinciden devuelve texto plano; si no, un `<span data-cc="ES DE FR IT">` por variante.
 */
export function byCountry(render: (country: Country) => string): string {
  const groups = new Map<string, Country[]>();
  for (const c of COUNTRIES) {
    const text = render(c);
    groups.set(text, [...(groups.get(text) ?? []), c]);
  }
  if (groups.size === 1) return escapeHtml([...groups.keys()][0]);
  return [...groups]
    .map(([text, cs]) => `<span data-cc="${cs.join(' ')}">${escapeHtml(text)}</span>`)
    .join('');
}
