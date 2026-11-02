import type { Country } from '../country';
import { HOLIDAYS } from '../fiscal/deadlines';
import { type ClosedDays, zurichHolidays } from './office';

/**
 * Days each country's office is closed: Zurich (legal holidays and Berchtoldstag), Madrid
 * (national holidays only; regional and local ones change every year), Berlin, Paris and Rome
 * (national holidays plus Saints Peter and Paul, the city's patron saints, on 29 June).
 */
export const OFFICE_CLOSED: Record<Country, ClosedDays> = {
  CH: zurichHolidays,
  ES: HOLIDAYS.ES,
  DE: HOLIDAYS.DE,
  FR: HOLIDAYS.FR,
  IT: (y) => new Set([...HOLIDAYS.IT(y), `${y}-6-29`]),
};
