import { describe, expect, it } from 'vitest';
import { vatFor } from './vat';

describe('vatFor', () => {
  it('keeps the Swiss abbreviation in Switzerland', () => {
    expect(vatFor('Precios sin IVA (MWST)', 'CH', 'es')).toBe('Precios sin IVA (MWST)');
  });
  it('drops it in other countries', () => {
    expect(vatFor('Precios sin IVA (MWST)', 'ES', 'es')).toBe('Precios sin IVA');
    expect(vatFor('Prix hors TVA (MWST)', 'FR', 'fr')).toBe('Prix hors TVA');
  });
  it('uses the German abbreviation in German outside Switzerland', () => {
    expect(vatFor('Preise exkl. MWST', 'DE', 'de')).toBe('Preise exkl. MwSt.');
    expect(vatFor('Preise exkl. Mehrwertsteuer (MWST)', 'DE', 'de')).toBe(
      'Preise exkl. Mehrwertsteuer',
    );
  });
});
