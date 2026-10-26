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
export function describePricing({ ref, mode }: PricingRef): {
  headline: string;
  detail?: string;
  amount?: number;
  unit?: string;
} {
  if (isPackage(ref)) {
    const pkg = PACKAGES[ref];
    if (mode === 'included') {
      return {
        headline: `Incluido desde ${pkg.name}`,
        detail: `El paquete ${pkg.name} empieza en ${formatNumber(pkg.from)}\u202FCHF/mes.`,
      };
    }
    return { headline: 'desde', amount: pkg.from, unit: 'CHF/mes', detail: `Paquete ${pkg.name}.` };
  }
  const fixed = FIXED_PRICES[ref];
  return { headline: 'desde', amount: fixed.from, unit: 'CHF', detail: 'Precio cerrado.' };
}
