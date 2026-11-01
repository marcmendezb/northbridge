import type { Country } from '../country';
import { HOLIDAYS } from '../fiscal/deadlines';
import { type ClosedDays, zurichHolidays } from './office';

/**
 * Días de cierre de la oficina de cada país: Zúrich (festivos legales y Berchtoldstag), Madrid
 * (festivos nacionales; sin los autonómicos ni locales, que cambian cada año), Berlín, París y Roma
 * (nacionales y San Pedro y San Pablo, patrón de la ciudad, el 29 de junio).
 */
export const OFFICE_CLOSED: Record<Country, ClosedDays> = {
  CH: zurichHolidays,
  ES: HOLIDAYS.ES,
  DE: HOLIDAYS.DE,
  FR: HOLIDAYS.FR,
  IT: (y) => new Set([...HOLIDAYS.IT(y), `${y}-6-29`]),
};
