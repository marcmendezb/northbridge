/**
 * Única fuente de importes y reglas de precio (CHF, sin IVA).
 * Todos los valores son ficticios y provisionales: docs/07-calculadora-y-precios.md.
 */

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

/** Servicios de precio cerrado, fuera de los paquetes mensuales. */
export const FIXED_PRICES = {
  gmbh: { name: 'GmbH', from: 1490 },
  ag: { name: 'AG', from: 2490 },
} as const satisfies Record<FixedId, { name: string; from: number }>;

/** Permanencia de los paquetes mensuales, en meses. */
export const COMMITMENT_MONTHS = 3;

/** Identificadores de los textos de celda (`pricing.cells.*` en el diccionario). */
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
 * Celda de la tabla comparativa: true = incluido; false = no incluido;
 * `{ text }` = solo texto; `{ note }` = incluido con nota. Los textos viven en el diccionario.
 */
export type Cell = boolean | { text: CellId } | { note: CellId };

/** `id` es la clave de `pricing.rows.*` en el diccionario. */
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

/** Se presupuesta aparte, con precio cerrado (`pricing.separate.*` en el diccionario). */
export const SEPARATE_QUOTE = ['constitution', 'backlog', 'valuation', 'extraordinary'] as const;

// ── Calculadora (fase 4) ──────────────────────────────────────────────────────
export const BASE = { autonomo: 190, startup: 290, gmbh: 340, ag: 520 };

/** Facturas/mes → recargo mensual. Por encima de 200: propuesta a medida. */
export const INVOICE_TIERS = [
  { upTo: 20, fee: 0 },
  { upTo: 50, fee: 90 },
  { upTo: 100, fee: 190 },
  { upTo: 200, fee: 360 },
];

/** Por empleado y mes. */
export const PAYROLL = [
  { upTo: 10, perEmployee: 30 },
  { upTo: 50, perEmployee: 26 },
];

export const FLOOR = {
  essential: PACKAGES.essential.from,
  growth: PACKAGES.growth.from,
  full: PACKAGES.full.from,
};
/** El extremo alto del rango = precio × 1,12. */
export const RANGE_UPLIFT = 0.12;
export const ROUND_TO = 10;
