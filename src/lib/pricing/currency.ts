import type { Locale } from '../../i18n/locales';
import { formatNumber } from '../format';
import { EXCHANGE_RATES, ROUND_TO, type Currency } from './config';

/** Symbol shown after the amount (euro or Swiss franc). */
export const CURRENCY_SYMBOL: Record<Currency, string> = { EUR: '€', CHF: 'CHF' };

/**
 * Amount from config.ts (EUR) in the requested currency. Euros are returned as is; other currencies
 * are converted at the reference rate and rounded to the nearest ten, like the calculator prices.
 */
export function convert(eur: number, currency: Currency): number {
  if (currency === 'EUR') return eur;
  return Math.round((eur * EXCHANGE_RATES[currency]) / ROUND_TO) * ROUND_TO;
}

/** Converted amount with its currency, without a line break between them. */
export function formatMoney(eur: number, currency: Currency, locale: Locale = 'es'): string {
  return `${formatNumber(convert(eur, currency), locale)}\u202F${CURRENCY_SYMBOL[currency]}`;
}
