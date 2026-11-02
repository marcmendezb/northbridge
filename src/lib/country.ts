import { localeMeta, type Locale } from '../i18n/locales';
import type { Currency } from './pricing/config';

/**
 * The visitor's country: sets currency and legal forms. Independent of language.
 * Chosen in the header dropdown and stored in the browser (`nb-country`); the static HTML
 * ships one variant per country and CSS (global.css) shows only the active one.
 */
export const COUNTRIES = ['CH', 'ES', 'DE', 'FR', 'IT'] as const;
export type Country = (typeof COUNTRIES)[number];

/** Head office in Zurich: Switzerland is the default (without JS or without a saved choice). */
export const DEFAULT_COUNTRY: Country = 'CH';
export const COUNTRY_STORAGE_KEY = 'nb-country';

/** Each country's limited company (`gmbh`) and public company (`ag`). */
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

/** Country name in the page language ("Suiza", "Switzerland", "Schweiz"…). */
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
 * Country-dependent text as HTML (`set:html`). Countries with the same result are grouped:
 * if they all match it returns plain text; otherwise one `<span data-cc="ES DE FR IT">` per variant.
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
