import { describe, expect, it } from 'vitest';
import { COUNTRIES, byCountry, currencyOf, legalForm } from '../country';
import { EXCHANGE_RATES, PACKAGES } from './config';
import { convert, formatMoney } from './currency';

describe('currency', () => {
  it('keeps euro amounts exactly as written in config', () => {
    expect(convert(PACKAGES.growth.from, 'EUR')).toBe(490);
    expect(formatMoney(1490, 'EUR')).toBe('1\u202F490\u202F€');
  });
  it('converts to CHF with the reference rate and rounds to tens', () => {
    expect(convert(490, 'CHF')).toBe(Math.round((490 * EXCHANGE_RATES.CHF) / 10) * 10);
    expect(convert(490, 'CHF') % 10).toBe(0);
    expect(formatMoney(190, 'CHF', 'de')).toMatch(/^\d+\u202FCHF$/);
  });
  it('keeps the order of prices after converting', () => {
    const from = Object.values(PACKAGES).map((p) => convert(p.from, 'CHF'));
    expect([...from].sort((a, b) => a - b)).toEqual(from);
  });
});

describe('country', () => {
  it('only Switzerland uses a currency other than the euro', () => {
    expect(COUNTRIES.filter((c) => currencyOf(c) !== 'EUR')).toEqual(['CH']);
  });
  it('maps legal forms per country', () => {
    expect(legalForm('ES', 'gmbh')).toBe('SL');
    expect(legalForm('IT', 'ag')).toBe('S.p.A.');
    expect(legalForm('CH', 'gmbh')).toBe('GmbH');
  });
  it('renders one variant per distinct value, plain text when all match', () => {
    expect(byCountry(() => 'Startup')).toBe('Startup');
    expect(byCountry((c) => currencyOf(c))).toBe(
      '<span data-cc="CH">CHF</span><span data-cc="ES DE FR IT">EUR</span>',
    );
    expect(byCountry(() => '<b>')).toBe('&lt;b&gt;');
  });
});
