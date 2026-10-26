import type { Locale } from '../../i18n/locales';
import { formatNumber } from '../format';
import { EXCHANGE_RATES, ROUND_TO, type Currency } from './config';

/** Símbolo que se muestra tras el importe (euro o franco suizo). */
export const CURRENCY_SYMBOL: Record<Currency, string> = { EUR: '€', CHF: 'CHF' };

/**
 * Importe de config.ts (EUR) en la moneda pedida. El euro se devuelve tal cual; el resto se
 * convierte con el tipo de referencia y se redondea a la decena, como los precios de la calculadora.
 */
export function convert(eur: number, currency: Currency): number {
  if (currency === 'EUR') return eur;
  return Math.round((eur * EXCHANGE_RATES[currency]) / ROUND_TO) * ROUND_TO;
}

/** Importe convertido y con su moneda, sin salto de línea entre ambos. */
export function formatMoney(eur: number, currency: Currency, locale: Locale = 'es'): string {
  return `${formatNumber(convert(eur, currency), locale)}\u202F${CURRENCY_SYMBOL[currency]}`;
}
