import { describe, expect, it } from 'vitest';
import { vatFor } from './vat';

describe('vatFor', () => {
  it('mantiene la sigla suiza en Suiza', () => {
    expect(vatFor('Precios sin IVA (MWST)', 'CH', 'es')).toBe('Precios sin IVA (MWST)');
  });
  it('la quita en otros países', () => {
    expect(vatFor('Precios sin IVA (MWST)', 'ES', 'es')).toBe('Precios sin IVA');
    expect(vatFor('Prix hors TVA (MWST)', 'FR', 'fr')).toBe('Prix hors TVA');
  });
  it('en alemán usa la sigla alemana fuera de Suiza', () => {
    expect(vatFor('Preise exkl. MWST', 'DE', 'de')).toBe('Preise exkl. MwSt.');
    expect(vatFor('Preise exkl. Mehrwertsteuer (MWST)', 'DE', 'de')).toBe(
      'Preise exkl. Mehrwertsteuer',
    );
  });
});
