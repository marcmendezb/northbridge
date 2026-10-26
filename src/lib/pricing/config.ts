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
    forWhom: 'Autónomos y empresas muy pequeñas sin personal',
  },
  growth: {
    name: 'Growth',
    from: 490,
    recommended: true,
    forWhom: 'Pymes con equipo y startups en marcha',
  },
  full: {
    name: 'Full Service',
    from: 990,
    recommended: false,
    forWhom: 'Pymes de hasta 50 empleados y empresas con estructura (AG)',
  },
} as const satisfies Record<
  PackageId,
  { name: string; from: number; recommended: boolean; forWhom: string }
>;

/** Servicios de precio cerrado, fuera de los paquetes mensuales. */
export const FIXED_PRICES = {
  gmbh: { name: 'GmbH', from: 1490 },
  ag: { name: 'AG', from: 2490 },
} as const satisfies Record<FixedId, { name: string; from: number }>;

/** Permanencia de los paquetes mensuales, en meses. */
export const COMMITMENT_MONTHS = 3;

/** Celda de la tabla comparativa: true = incluido; false = no incluido; texto; o incluido con nota. */
export type Cell = boolean | string | { note: string };

export interface ComparisonRow {
  label: string;
  essential: Cell;
  growth: Cell;
  full: Cell;
}

export const COMPARISON: readonly ComparisonRow[] = [
  {
    label: 'Contabilidad mensual y cierre anual',
    essential: { note: 'hasta 20 facturas/mes' },
    growth: { note: 'según volumen' },
    full: { note: 'según volumen' },
  },
  { label: 'IVA (MWST)', essential: { note: 'trimestral' }, growth: true, full: true },
  {
    label: 'Nóminas y seguros sociales',
    essential: false,
    growth: { note: 'hasta 10 empleados' },
    full: { note: 'hasta 50 empleados' },
  },
  { label: 'Informe en lenguaje claro', essential: 'Anual', growth: 'Trimestral', full: 'Mensual' },
  { label: 'Reunión con tu asesor', essential: false, growth: 'Trimestral', full: 'Mensual' },
  {
    label: 'Persona de contacto',
    essential: 'Email, respuesta en 2 días laborables',
    growth: 'Interlocutor fijo y teléfono directo',
    full: 'Interlocutor fijo, respuesta el mismo día laborable',
  },
  { label: 'Planificación fiscal anual', essential: false, growth: false, full: true },
  { label: 'Startups: cap table básico', essential: false, growth: true, full: true },
  {
    label: 'Startups: valoración y preparación de ronda',
    essential: false,
    growth: false,
    full: true,
  },
  {
    label: 'Gestión de requerimientos de la autoridad fiscal',
    essential: 'Consulta',
    growth: true,
    full: 'Prioritaria',
  },
];

/** Se presupuesta aparte, con precio cerrado. */
export const SEPARATE_QUOTE = [
  { key: 'constitution', label: 'Constitución de empresa' },
  { key: 'backlog', label: 'Regularización de contabilidades atrasadas' },
  { key: 'valuation', label: 'Valoraciones puntuales fuera del paquete' },
  { key: 'extraordinary', label: 'Procesos extraordinarios (inspecciones, reestructuraciones)' },
] as const;

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
