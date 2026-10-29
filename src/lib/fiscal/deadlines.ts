/**
 * Fechas exactas de los plazos fiscales, calculadas para cualquier año a partir de su regla legal.
 * Así el calendario se actualiza solo cada año (bisiestos y fines de semana incluidos).
 * Fuentes y decisiones: docs/DECISIONES.md («Calendario fiscal con fechas exactas»).
 */
import { addDays, type CivilDate, weekdayOf, easterSunday } from '../contact/office';

/**
 * - `fixed`: un día fijo del año (31 de marzo).
 * - `monthEnd`: el último día de un mes (IVA suizo: la ESTV fija el 1.er trimestre «fällig am
 *   31. Mai»; los demás, 31 de agosto, 30 de noviembre y finales de febrero).
 * - `afterPeriod`: N días tras el fin de un periodo (IVA: 60 días tras el trimestre). Si el periodo
 *   termina el 31 de diciembre, es el del año anterior.
 * - `range`: una ventana de práctica, sin fecha legal (certificados de salario en enero o febrero).
 * `shift`: si el último día es sábado, domingo o festivo, el plazo pasa al siguiente día hábil del
 * país (Suiza: art. 38.3 ATSG para la AVS; España: art. 30 Ley 39/2015 y LGT). Los festivos de cada
 * país están en `HOLIDAYS`.
 */
export type DeadlineRule =
  | { type: 'fixed'; m: number; d: number; shift: boolean }
  | { type: 'monthEnd'; m: number; shift: boolean }
  | { type: 'afterPeriod'; endM: number; endD: number; days: number; shift: boolean }
  | { type: 'range'; from: { m: number; d: number }; to: { m: number; d: number } | 'endFeb' };

export interface Deadline {
  /** Inicio de la ventana (igual a `due` salvo en `range`). */
  start: CivilDate;
  /** Último día del plazo. */
  due: CivilDate;
  /** True si la fecha legal cayó en fin de semana o festivo y se ha movido. */
  shifted: boolean;
}

const key = ({ y, m, d }: CivilDate) => `${y}-${m}-${d}`;

/** Festivos legales del cantón de Zúrich (§ 1 Ruhetags- und Ladenöffnungsgesetz): sin Berchtoldstag. */
export function zurichLegalHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 },
      addDays(easter, -2),
      addDays(easter, 1),
      { y, m: 5, d: 1 },
      addDays(easter, 39),
      addDays(easter, 50),
      { y, m: 8, d: 1 },
      { y, m: 12, d: 25 },
      { y, m: 12, d: 26 },
    ].map(key),
  );
}

/** Festivos nacionales de España (BOE, fiestas laborales de ámbito nacional no sustituibles). */
export function spainNationalHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 },
      { y, m: 1, d: 6 },
      addDays(easter, -2), // Viernes Santo
      { y, m: 5, d: 1 },
      { y, m: 8, d: 15 },
      { y, m: 10, d: 12 },
      { y, m: 11, d: 1 },
      { y, m: 12, d: 6 },
      { y, m: 12, d: 8 },
      { y, m: 12, d: 25 },
    ].map(key),
  );
}

/** Festivos legales en Berlín (los nueve federales y el 8 de marzo); la oficina alemana está allí. */
export function berlinHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 },
      { y, m: 3, d: 8 }, // Internationaler Frauentag (Berlín)
      addDays(easter, -2),
      addDays(easter, 1),
      { y, m: 5, d: 1 },
      addDays(easter, 39),
      addDays(easter, 50),
      { y, m: 10, d: 3 },
      { y, m: 12, d: 25 },
      { y, m: 12, d: 26 },
    ].map(key),
  );
}

export type HolidayCalendar = (y: number) => Set<string>;
export const HOLIDAYS: Record<'CH' | 'ES' | 'DE', HolidayCalendar> = {
  CH: zurichLegalHolidays,
  ES: spainNationalHolidays,
  DE: berlinHolidays,
};

export function isLegalWorkday(date: CivilDate, holidays: HolidayCalendar = zurichLegalHolidays) {
  const wd = weekdayOf(date);
  return wd !== 0 && wd !== 6 && !holidays(date.y).has(key(date));
}

/** El mismo día si es hábil; si no, el siguiente hábil. */
export function onOrNextWorkday(
  date: CivilDate,
  holidays: HolidayCalendar = zurichLegalHolidays,
): CivilDate {
  let d = date;
  while (!isLegalWorkday(d, holidays)) d = addDays(d, 1);
  return d;
}

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** Plazo de la regla dentro del año `year` (el año en que vence). */
export function deadlineIn(
  rule: DeadlineRule,
  year: number,
  holidays: HolidayCalendar = zurichLegalHolidays,
): Deadline {
  if (rule.type === 'range') {
    const to = rule.to === 'endFeb' ? { m: 2, d: isLeap(year) ? 29 : 28 } : rule.to;
    const start = { y: year, ...rule.from };
    return { start, due: { y: year, ...to }, shifted: false };
  }
  const legal =
    rule.type === 'fixed'
      ? { y: year, m: rule.m, d: rule.d }
      : rule.type === 'monthEnd'
        ? { y: year, m: rule.m, d: new Date(Date.UTC(year, rule.m, 0)).getUTCDate() }
        : addDays(
            {
              y: rule.endM === 12 && rule.endD === 31 ? year - 1 : year,
              m: rule.endM,
              d: rule.endD,
            },
            rule.days,
          );
  const due = rule.shift ? onOrNextWorkday(legal, holidays) : legal;
  return { start: due, due, shifted: key(due) !== key(legal) };
}

/** Día del año (0 = 1 de enero) y su fracción del año, para colocar una fecha en la regla. */
export function yearFraction({ y, m, d }: CivilDate): number {
  const start = Date.UTC(y, 0, 1);
  const days = isLeap(y) ? 366 : 365;
  return (Date.UTC(y, m - 1, d) - start) / 86_400_000 / days;
}

/** Días naturales de `from` a `to` (negativo si `to` ya pasó). */
export function daysBetween(from: CivilDate, to: CivilDate): number {
  return Math.round(
    (Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / 86_400_000,
  );
}

export const compareDates = (a: CivilDate, b: CivilDate) => daysBetween(b, a);
