import type { Locale } from '../i18n/locales';
import type { Country } from './country';

/**
 * VAT name per country: base texts use the Swiss abbreviation ("IVA (MWST)"). Outside Switzerland
 * the brackets are dropped and, in German, the Swiss "MWST" becomes the German "MwSt.".
 */
export function vatFor(text: string, country: Country, locale: Locale): string {
  if (country === 'CH') return text;
  const out = text.replace(/\s?\(MWST\)/g, '');
  return locale === 'de' ? out.replace(/\bMWST\b/g, 'MwSt.') : out;
}
