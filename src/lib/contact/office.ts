/**
 * Office hours and reply time ("before 12:00 on the next working day").
 * Everything is computed in Zurich time, whatever the visitor's time zone.
 * Holidays: the nine legal ones in the canton of Zurich (§ 1 Ruhetags- und Ladenöffnungsgesetz) plus
 * Berchtoldstag, a local holiday the city and canton give off.
 */
export const OFFICE_TZ = 'Europe/Zurich';
export const OPEN_MINUTES = 8 * 60 + 30;
export const CLOSE_MINUTES = 17 * 60 + 30;

/** Civil date without time (month 1–12). */
export interface CivilDate {
  y: number;
  m: number;
  d: number;
}

/** Date, weekday (0 = Sunday) and minute of the day in Zurich. */
export function zurichNow(now: Date): CivilDate & { weekday: number; minutes: number } {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: OFFICE_TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const date = { y: Number(parts.year), m: Number(parts.month), d: Number(parts.day) };
  return {
    ...date,
    weekday: weekdayOf(date),
    minutes: Number(parts.hour) * 60 + Number(parts.minute),
  };
}

export function weekdayOf({ y, m, d }: CivilDate): number {
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export function addDays({ y, m, d }: CivilDate, days: number): CivilDate {
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return { y: t.getUTCFullYear(), m: t.getUTCMonth() + 1, d: t.getUTCDate() };
}

/** Easter Sunday (anonymous Gregorian algorithm). */
export function easterSunday(y: number): CivilDate {
  const a = y % 19;
  const b = Math.floor(y / 100);
  const c = y % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const mm = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * mm + 114) / 31);
  const day = ((h + l - 7 * mm + 114) % 31) + 1;
  return { y, m: month, d: day };
}

const key = ({ y, m, d }: CivilDate) => `${y}-${m}-${d}`;

/** Days the office is closed in a year: Zurich legal holidays and Berchtoldstag. */
export function zurichHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 }, // New Year's Day
      { y, m: 1, d: 2 }, // Berchtoldstag (local, not a legal holiday)
      addDays(easter, -2), // Good Friday
      addDays(easter, 1), // Easter Monday
      { y, m: 5, d: 1 }, // Labour Day
      addDays(easter, 39), // Ascension Day
      addDays(easter, 50), // Whit Monday
      { y, m: 8, d: 1 }, // Swiss National Day
      { y, m: 12, d: 25 }, // Christmas Day
      { y, m: 12, d: 26 }, // St Stephen's Day
    ].map(key),
  );
}

/** Days an office is closed in a year (defaults to Zurich). */
export type ClosedDays = (y: number) => Set<string>;

export function isWorkingDay(date: CivilDate, closed: ClosedDays = zurichHolidays): boolean {
  const wd = weekdayOf(date);
  return wd !== 0 && wd !== 6 && !closed(date.y).has(key(date));
}

/** First working day strictly after `date`. */
export function nextWorkingDay(date: CivilDate, closed: ClosedDays = zurichHolidays): CivilDate {
  let next = addDays(date, 1);
  while (!isWorkingDay(next, closed)) next = addDays(next, 1);
  return next;
}

/**
 * Day before whose 12:00 we reply to a message sent at `now`. All five offices share
 * Central European Time, so Zurich time is enough; the closing days are each office's own.
 */
export function replyDay(now: Date, closed: ClosedDays = zurichHolidays): CivilDate {
  return nextWorkingDay(zurichNow(now), closed);
}

/** Office status: open now, or the day it opens again. */
export function officeStatus(
  now: Date,
  closed: ClosedDays = zurichHolidays,
): { open: true } | { open: false; opens: CivilDate } {
  const z = zurichNow(now);
  if (isWorkingDay(z, closed) && z.minutes >= OPEN_MINUTES && z.minutes < CLOSE_MINUTES)
    return { open: true };
  const opens = isWorkingDay(z, closed) && z.minutes < OPEN_MINUTES ? z : nextWorkingDay(z, closed);
  return { open: false, opens: { y: opens.y, m: opens.m, d: opens.d } };
}

/**
 * "jueves 29 de octubre" / "Donnerstag, 29. Oktober": long date without year, in the given language.
 * Only German keeps the comma after the weekday.
 */
export function formatDay(date: CivilDate, locale: string, withDate = true): string {
  const tag = locale === 'en' ? 'en-GB' : locale;
  const text = new Intl.DateTimeFormat(tag, {
    timeZone: 'UTC',
    weekday: 'long',
    ...(withDate ? { day: 'numeric', month: 'long' } : {}),
  }).format(new Date(Date.UTC(date.y, date.m - 1, date.d, 12)));
  return locale === 'de' ? text : text.replace(', ', ' ');
}
