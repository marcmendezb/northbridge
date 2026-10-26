import { t, type Locale } from '../../i18n';
import { formatNumber } from '../format';
import { FIXED_PRICES, PACKAGES, type FixedId, type PackageId } from './config';

export type PricingMode = 'from' | 'included' | 'fixed';
export interface PricingRef {
  label: string;
  ref: PackageId | FixedId;
  mode: PricingMode;
}

const isPackage = (ref: string): ref is PackageId => ref in PACKAGES;

/** Texto de precio orientativo de un servicio, siempre derivado de config.ts. */
export function describePricing(
  { ref, mode }: PricingRef,
  locale: Locale = 'es',
): {
  headline: string;
  detail?: string;
  amount?: number;
  unit?: string;
} {
  if (isPackage(ref)) {
    const { name, from } = PACKAGES[ref];
    if (mode === 'included') {
      return {
        headline: t('price.includedFrom', locale, { name }),
        detail: t('price.packageStarts', locale, { name, amount: formatNumber(from, locale) }),
      };
    }
    return {
      headline: t('price.from', locale),
      amount: from,
      unit: t('price.perMonth', locale),
      detail: t('price.package', locale, { name }),
    };
  }
  return {
    headline: t('price.from', locale),
    amount: FIXED_PRICES[ref].from,
    unit: t('price.unitOnce', locale),
    detail: t('price.fixed', locale),
  };
}
