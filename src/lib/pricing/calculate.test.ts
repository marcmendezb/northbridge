import { describe, expect, it } from 'vitest';
import { calculate, type CalculatorInput, type CompanyType } from './calculate';

const priced = (input: CalculatorInput) => {
  const r = calculate(input);
  if (r.custom) throw new Error('custom');
  return r;
};

describe('calculate: casos obligatorios de docs/07', () => {
  it.each([
    ['autonomo', 10, 0, 'essential', 190, [190, 210]],
    ['autonomo', 40, 0, 'essential', 280, [280, 310]],
    ['gmbh', 60, 5, 'growth', 680, [680, 760]],
    ['startup', 15, 2, 'growth', 490, [490, 550]],
    ['gmbh', 30, 12, 'full', 990, [990, 1110]],
    ['ag', 120, 15, 'full', 1310, [1310, 1470]],
  ] as const)(
    '%s, %i facturas, %i empleados → %s %i',
    (type, invoices, employees, pkg, price, range) => {
      const r = priced({ type, invoices, employees });
      expect(r.package).toBe(pkg);
      expect(r.price).toBe(price);
      expect(r.range).toEqual(range);
    },
  );

  it('suelo del paquete: startup 15/2 tiene raw 350; gmbh 30/12 tiene raw 782', () => {
    expect(priced({ type: 'startup', invoices: 15, employees: 2 }).raw).toBe(350);
    expect(priced({ type: 'gmbh', invoices: 30, employees: 12 }).raw).toBe(782);
  });

  it('más de 200 facturas: propuesta a medida', () => {
    for (const type of ['autonomo', 'startup', 'gmbh', 'ag'] as const)
      expect(calculate({ type, invoices: 201, employees: 3 })).toEqual({ custom: true });
  });
});

describe('calculate: bordes', () => {
  const base = { type: 'gmbh' as CompanyType, employees: 0 };
  it.each([
    [20, 21],
    [50, 51],
    [100, 101],
  ])('facturas %i → %i sube el precio o lo mantiene', (a, b) => {
    expect(priced({ ...base, invoices: b }).raw).toBeGreaterThan(
      priced({ ...base, invoices: a }).raw,
    );
  });
  it('200 facturas tiene precio; 201 es a medida', () => {
    expect(calculate({ ...base, invoices: 200 }).custom).toBe(false);
    expect(calculate({ ...base, invoices: 201 }).custom).toBe(true);
  });
  it('101 facturas recomienda Full Service', () => {
    expect(priced({ ...base, invoices: 101 }).package).toBe('full');
  });
  it('10 → 11 empleados: cambia la tarifa por empleado y pasa a Full Service', () => {
    const ten = priced({ ...base, invoices: 10, employees: 10 });
    const eleven = priced({ ...base, invoices: 10, employees: 11 });
    expect(eleven.raw - ten.raw).toBe(26);
    expect(ten.package).toBe('growth');
    expect(eleven.package).toBe('full');
  });
});

describe('calculate: monotonía (subir una entrada nunca baja el precio)', () => {
  const types: CompanyType[] = ['autonomo', 'startup', 'gmbh', 'ag'];
  it('facturas y empleados', () => {
    for (const type of types) {
      for (let invoices = 0; invoices < 200; invoices += 7) {
        for (let employees = 0; employees < 50; employees += 3) {
          const p = priced({ type, invoices, employees }).price;
          expect(priced({ type, invoices: invoices + 1, employees }).price).toBeGreaterThanOrEqual(
            p,
          );
          expect(priced({ type, invoices, employees: employees + 1 }).price).toBeGreaterThanOrEqual(
            p,
          );
        }
      }
    }
  });
});
