import { t, type Locale } from '../../i18n';
import { FIXED_PRICES, PACKAGES, type Currency, type FixedId, type PackageId } from './config';
import { CURRENCY_SYMBOL, formatMoney } from './currency';

export type PricingMode = 'from' | 'included' | 'fixed';
export interface PricingRef {
  label: string;
  ref: PackageId | FixedId;
  mode: PricingMode;
}

const isPackage = (ref: string): ref is PackageId => ref in PACKAGES;

/**
 * Texto de precio orientativo de un servicio, siempre derivado de config.ts. `amount` queda en EUR
 * (lo convierte PriceTag); los textos ya salen en la moneda pedida.
 */
export function describePricing(
  { ref, mode }: PricingRef,
  locale: Locale = 'es',
  currency: Currency = 'EUR',
): {
  headline: string;
  detail?: string;
  amount?: number;
  once?: boolean;
} {
  if (isPackage(ref)) {
    const { name, from } = PACKAGES[ref];
    if (mode === 'included') {
      return {
        headline: t('price.includedFrom', locale, { name }),
        detail: t('price.packageStarts', locale, {
          name,
          amount: formatMoney(from, currency, locale),
        }),
      };
    }
    return {
      headline: t('price.from', locale),
      amount: from,
      detail: t('price.package', locale, { name }),
    };
  }
  return {
    headline: t('price.from', locale),
    amount: FIXED_PRICES[ref].from,
    once: true,
    detail: t('price.fixed', locale),
  };
}

/** Unidad tras el importe: «€/mes», «CHF/mes» o solo la moneda en los precios cerrados. */
export function priceUnit(currency: Currency, locale: Locale = 'es', once = false): string {
  return t(once ? 'price.unitOnce' : 'price.perMonth', locale, {
    currency: CURRENCY_SYMBOL[currency],
  });
}
