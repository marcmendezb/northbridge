import {
  BASE,
  FLOOR,
  INVOICE_TIERS,
  PAYROLL,
  RANGE_UPLIFT,
  ROUND_TO,
  type PackageId,
} from './config';

export type CompanyType = keyof typeof BASE;

export interface CalculatorInput {
  type: CompanyType;
  /** Invoices per month (issued + received). */
  invoices: number;
  employees: number;
}

export type CalculatorResult =
  | { custom: true }
  | { custom: false; package: PackageId; price: number; range: [number, number]; raw: number };

const roundTo = (value: number) => Math.round(value / ROUND_TO) * ROUND_TO;

/** Monthly surcharge by invoice volume (0 to 200). */
export function invoiceFee(invoices: number): number {
  const tier = INVOICE_TIERS.find((t) => invoices <= t.upTo);
  return tier ? tier.fee : INVOICE_TIERS[INVOICE_TIERS.length - 1].fee;
}

/** Payroll: the first 10 payslips at one rate and the rest at another. */
export function payrollFee(employees: number): number {
  const [first, rest] = PAYROLL;
  const n = Math.max(0, employees);
  return (
    Math.min(n, first.upTo) * first.perEmployee + Math.max(n - first.upTo, 0) * rest.perEmployee
  );
}

export function recommendedPackage({ type, invoices, employees }: CalculatorInput): PackageId {
  if (employees > 10 || type === 'ag' || invoices > 100) return 'full';
  if (employees >= 1 || type === 'startup') return 'growth';
  return 'essential';
}

/** Estimated monthly price (EUR, excl. VAT; convert() for other currencies): a pure function, all amounts come from config.ts. */
export function calculate(input: CalculatorInput): CalculatorResult {
  if (input.invoices > INVOICE_TIERS[INVOICE_TIERS.length - 1].upTo) return { custom: true };
  const raw = BASE[input.type] + invoiceFee(input.invoices) + payrollFee(input.employees);
  const pkg = recommendedPackage(input);
  const price = roundTo(Math.max(raw, FLOOR[pkg]));
  return {
    custom: false,
    package: pkg,
    price,
    range: [price, roundTo(price * (1 + RANGE_UPLIFT))],
    raw,
  };
}
