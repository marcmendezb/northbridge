import type { Country } from '../../lib/country';
import type { FiscalEvent } from './types';
import { events as CH } from './ch';

export type { FiscalEvent, Text } from './types';

/**
 * Calendario fiscal por país (docs/09: datos estructurados para el futuro calendario interactivo).
 * Cada país vive en su archivo; los que aún no existen se añaden aquí.
 */
export const FISCAL_CALENDARS: Partial<Record<Country, FiscalEvent[]>> = { CH };
