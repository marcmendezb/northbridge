/**
 * Exact tax deadlines, computed for any year from their legal rule.
 * This way the calendar updates itself every year (leap years and weekends included).
 */
import { addDays, type CivilDate, weekdayOf, easterSunday } from '../contact/office';

/**
 * - `fixed`: a fixed day of the year (31 March).
 * - `monthEnd`: the last day of a month (Swiss VAT: the federal tax administration sets Q1 as "fällig am
 *   31. Mai"; the others are 31 August, 30 November and the end of February).
 * - `afterPeriod`: N days after the end of a period (e.g. 60 days after the quarter). If the period
 *   ends on 31 December, it is the previous year's.
 * - `range`: a customary window with no legal date (salary certificates in January or February).
 * - `nthWorkdayAfter`: the nth working day after a date, plus `plusDays` calendar days (France:
 *   the liasse fiscale is due on the 2nd working day after 1 May, plus 15 days if filed online).
 * `shift`: if the last day is a Saturday, Sunday or holiday, the deadline moves to the country's next working
 * day (Switzerland: art. 38(3) ATSG for AHV; Spain: art. 30 Law 39/2015 and the General Tax Law). Each
 * country's holidays are in `HOLIDAYS`.
 */
export type DeadlineRule =
  | { type: 'fixed'; m: number; d: number; shift: boolean }
  | { type: 'monthEnd'; m: number; shift: boolean }
  | { type: 'afterPeriod'; endM: number; endD: number; days: number; shift: boolean }
  | { type: 'range'; from: { m: number; d: number }; to: { m: number; d: number } | 'endFeb' }
  | {
      type: 'nthWorkdayAfter';
      m: number;
      d: number;
      n: number;
      plusDays?: number;
      shift: boolean;
    };

export interface Deadline {
  /** Start of the window (same as `due` except for `range`). */
  start: CivilDate;
  /** Last day of the deadline. */
  due: CivilDate;
  /** True if the legal date fell on a weekend or holiday and was moved. */
  shifted: boolean;
}

const key = ({ y, m, d }: CivilDate) => `${y}-${m}-${d}`;

/** Legal holidays in the canton of Zurich (§ 1 Ruhetags- und Ladenöffnungsgesetz), without Berchtoldstag. */
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

/** Spanish national holidays (BOE, nationwide public holidays that cannot be replaced). */
export function spainNationalHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 },
      { y, m: 1, d: 6 },
      addDays(easter, -2), // Good Friday
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

/** Legal holidays in Berlin (the nine federal ones plus 8 March); the German office is there. */
export function berlinHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 },
      { y, m: 3, d: 8 }, // International Women's Day (Berlin)
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

/** French legal holidays (art. L3133-1 Code du travail); the office is in Paris. */
export function franceHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 },
      addDays(easter, 1), // Easter Monday
      { y, m: 5, d: 1 },
      { y, m: 5, d: 8 },
      addDays(easter, 39), // Ascension
      addDays(easter, 50), // Whit Monday
      { y, m: 7, d: 14 },
      { y, m: 8, d: 15 },
      { y, m: 11, d: 1 },
      { y, m: 11, d: 11 },
      { y, m: 12, d: 25 },
    ].map(key),
  );
}

/**
 * Italian national holidays (Law 260/1949 and DPR 792/1985); 4 October, St Francis,
 * from 2026 (Law 151/2025). Tax deadlines use national holidays, not the local patron saint's day.
 */
export function italyHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 },
      { y, m: 1, d: 6 },
      addDays(easter, 1), // Easter Monday
      { y, m: 4, d: 25 },
      { y, m: 5, d: 1 },
      { y, m: 6, d: 2 },
      { y, m: 8, d: 15 },
      ...(y >= 2026 ? [{ y, m: 10, d: 4 }] : []),
      { y, m: 11, d: 1 },
      { y, m: 12, d: 8 },
      { y, m: 12, d: 25 },
      { y, m: 12, d: 26 },
    ].map(key),
  );
}

export type HolidayCalendar = (y: number) => Set<string>;
export const HOLIDAYS: Record<'CH' | 'ES' | 'DE' | 'FR' | 'IT', HolidayCalendar> = {
  CH: zurichLegalHolidays,
  ES: spainNationalHolidays,
  DE: berlinHolidays,
  FR: franceHolidays,
  IT: italyHolidays,
};

export function isLegalWorkday(date: CivilDate, holidays: HolidayCalendar = zurichLegalHolidays) {
  const wd = weekdayOf(date);
  return wd !== 0 && wd !== 6 && !holidays(date.y).has(key(date));
}

/** The same day if it is a working day; otherwise the next one. */
export function onOrNextWorkday(
  date: CivilDate,
  holidays: HolidayCalendar = zurichLegalHolidays,
): CivilDate {
  let d = date;
  while (!isLegalWorkday(d, holidays)) d = addDays(d, 1);
  return d;
}

const isLeap = (y: number) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;

/** The rule's deadline within `year` (the year it falls due). */
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
  if (rule.type === 'nthWorkdayAfter') {
    let day = { y: year, m: rule.m, d: rule.d };
    for (let i = 0; i < rule.n; i++) day = onOrNextWorkday(addDays(day, 1), holidays);
    const legal = addDays(day, rule.plusDays ?? 0);
    const due = rule.shift ? onOrNextWorkday(legal, holidays) : legal;
    return { start: due, due, shifted: key(due) !== key(legal) };
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

/** Day of the year (0 = 1 January) as a fraction of the year, to place a date on the chart. */
export function yearFraction({ y, m, d }: CivilDate): number {
  const start = Date.UTC(y, 0, 1);
  const days = isLeap(y) ? 366 : 365;
  return (Date.UTC(y, m - 1, d) - start) / 86_400_000 / days;
}

/** Calendar days from `from` to `to` (negative if `to` has passed). */
export function daysBetween(from: CivilDate, to: CivilDate): number {
  return Math.round(
    (Date.UTC(to.y, to.m - 1, to.d) - Date.UTC(from.y, from.m - 1, from.d)) / 86_400_000,
  );
}

export const compareDates = (a: CivilDate, b: CivilDate) => daysBetween(b, a);
