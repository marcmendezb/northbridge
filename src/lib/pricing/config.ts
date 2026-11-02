/**
 * Single source of amounts and pricing rules (in EUR, excl. VAT). For countries with another currency
 * (Switzerland: CHF) the amount is converted from euros with `convert()` (currency.ts).
 * All values are fictional.
 */

export type Currency = 'EUR' | 'CHF';
/** Currency all amounts in this file are written in. */
export const BASE_CURRENCY = 'EUR' satisfies Currency;
/**
 * Units of each currency per 1 EUR. CHF: ECB reference rate on 23-10-2026
 * (ecb.europa.eu, euro foreign exchange reference rates). Review before using real prices.
 */
export const EXCHANGE_RATES: Record<Currency, number> = { EUR: 1, CHF: 0.9227 };
export const EXCHANGE_RATE_DATE = '2026-10-23';

export type PackageId = 'essential' | 'growth' | 'full';
export type FixedId = 'gmbh' | 'ag';

export const PACKAGES = {
  essential: {
    name: 'Essential',
    from: 190,
    recommended: false,
  },
  growth: {
    name: 'Growth',
    from: 490,
    recommended: true,
  },
  full: {
    name: 'Full Service',
    from: 990,
    recommended: false,
  },
} as const satisfies Record<PackageId, { name: string; from: number; recommended: boolean }>;

/** Fixed-price services, outside the monthly packages. */
export const FIXED_PRICES = {
  gmbh: { name: 'GmbH', from: 1490 },
  ag: { name: 'AG', from: 2490 },
} as const satisfies Record<FixedId, { name: string; from: number }>;

/** Minimum term of the monthly packages, in months. */
export const COMMITMENT_MONTHS = 3;

/** Cell text ids (`pricing.cells.*` in the dictionary). */
export type CellId =
  | 'upTo20Invoices'
  | 'byVolume'
  | 'quarterlyNote'
  | 'upTo10Employees'
  | 'upTo50Employees'
  | 'annual'
  | 'quarterly'
  | 'monthly'
  | 'contactEssential'
  | 'contactGrowth'
  | 'contactFull'
  | 'consult'
  | 'priority';

/**
 * Comparison table cell: true = included; false = not included;
 * `{ text }` = text only; `{ note }` = included with a note. The texts live in the dictionary.
 */
export type Cell = boolean | { text: CellId } | { note: CellId };

/** `id` is the key of `pricing.rows.*` in the dictionary. */
export interface ComparisonRow {
  id:
    | 'accounting'
    | 'vat'
    | 'payroll'
    | 'report'
    | 'meeting'
    | 'contact'
    | 'taxPlanning'
    | 'capTable'
    | 'valuation'
    | 'taxRequests';
  essential: Cell;
  growth: Cell;
  full: Cell;
}

export const COMPARISON: readonly ComparisonRow[] = [
  {
    id: 'accounting',
    essential: { note: 'upTo20Invoices' },
    growth: { note: 'byVolume' },
    full: { note: 'byVolume' },
  },
  { id: 'vat', essential: { note: 'quarterlyNote' }, growth: true, full: true },
  {
    id: 'payroll',
    essential: false,
    growth: { note: 'upTo10Employees' },
    full: { note: 'upTo50Employees' },
  },
  {
    id: 'report',
    essential: { text: 'annual' },
    growth: { text: 'quarterly' },
    full: { text: 'monthly' },
  },
  {
    id: 'meeting',
    essential: false,
    growth: { text: 'quarterly' },
    full: { text: 'monthly' },
  },
  {
    id: 'contact',
    essential: { text: 'contactEssential' },
    growth: { text: 'contactGrowth' },
    full: { text: 'contactFull' },
  },
  { id: 'taxPlanning', essential: false, growth: false, full: true },
  { id: 'capTable', essential: false, growth: true, full: true },
  { id: 'valuation', essential: false, growth: false, full: true },
  {
    id: 'taxRequests',
    essential: { text: 'consult' },
    growth: true,
    full: { text: 'priority' },
  },
];

/** Quoted separately, at a fixed price (`pricing.separate.*` in the dictionary). */
export const SEPARATE_QUOTE = ['constitution', 'backlog', 'valuation', 'extraordinary'] as const;

// ── Calculator ──────────────────────────────────────────────────────
export const BASE = { autonomo: 190, startup: 290, gmbh: 340, ag: 520 };

/** Invoices per month → monthly surcharge. Above 200: custom proposal. */
export const INVOICE_TIERS = [
  { upTo: 20, fee: 0 },
  { upTo: 50, fee: 90 },
  { upTo: 100, fee: 190 },
  { upTo: 200, fee: 360 },
];

/** Per employee per month. */
export const PAYROLL = [
  { upTo: 10, perEmployee: 30 },
  { upTo: 50, perEmployee: 26 },
];

export const FLOOR = {
  essential: PACKAGES.essential.from,
  growth: PACKAGES.growth.from,
  full: PACKAGES.full.from,
};
/** Upper end of the range = price × 1.12. */
export const RANGE_UPLIFT = 0.12;
export const ROUND_TO = 10;
