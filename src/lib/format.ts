import { localeMeta, type Locale } from '../i18n/locales';

const NNBSP = '\u202F';

/** Separators per language: thousands and decimals. */
const separators: Record<Locale, { group: string; decimal: string }> = {
  es: { group: NNBSP, decimal: ',' },
  en: { group: ',', decimal: '.' },
  de: { group: '\u2019', decimal: '.' },
  fr: { group: NNBSP, decimal: ',' },
  it: { group: '\u2019', decimal: '.' },
};

/** 4380 → "4 380" (es), "4,380" (en), "4’380" (de, it), with each language's separator. */
export function formatNumber(value: number, locale: Locale = 'es'): string {
  const { group, decimal } = separators[locale];
  const [int, dec] = Math.abs(value).toString().split('.');
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, group);
  return `${value < 0 ? '\u2212' : ''}${grouped}${dec ? `${decimal}${dec}` : ''}`;
}

/** Amount + currency, with a narrow no-break space between them. */
export function formatCHF(value: number, locale: Locale = 'es'): string {
  return `${formatNumber(value, locale)}${NNBSP}CHF`;
}

/** Long date in the page language: "30 November 2026". */
export function formatDate(date: Date | string, locale: Locale = 'es'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat(localeMeta[locale].intl, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Zurich',
  }).format(d);
}
