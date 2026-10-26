import { describe, expect, it } from 'vitest';
import { FIXED_PRICES, PACKAGES, FLOOR } from './config';
import { describePricing } from './display';

describe('pricing display', () => {
  it('derives "desde" amounts from config', () => {
    expect(describePricing({ label: 'x', ref: 'essential', mode: 'from' }).amount).toBe(
      PACKAGES.essential.from,
    );
    expect(describePricing({ label: 'x', ref: 'gmbh', mode: 'fixed' }).amount).toBe(
      FIXED_PRICES.gmbh.from,
    );
  });
  it('states which package includes a service', () => {
    expect(describePricing({ label: 'x', ref: 'growth', mode: 'included' }).headline).toBe(
      'Incluido desde Growth',
    );
  });
  it('keeps calculator floors equal to package prices', () => {
    expect(FLOOR).toEqual({ essential: 190, growth: 490, full: 990 });
  });
});
