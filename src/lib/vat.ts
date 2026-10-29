import type { Locale } from '../i18n/locales';
import type { Country } from './country';

/**
 * Nombre del IVA según el país: los textos base llevan la sigla suiza («IVA (MWST)»). Fuera de Suiza
 * se quita el paréntesis y, en alemán, la sigla suiza «MWST» pasa a la alemana «MwSt.».
 */
export function vatFor(text: string, country: Country, locale: Locale): string {
  if (country === 'CH') return text;
  const out = text.replace(/\s?\(MWST\)/g, '');
  return locale === 'de' ? out.replace(/\bMWST\b/g, 'MwSt.') : out;
}
