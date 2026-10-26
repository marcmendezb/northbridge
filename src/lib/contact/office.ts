/**
 * Horario de la oficina y plazo de respuesta («antes de las 12:00 del siguiente día laborable»).
 * Todo se calcula en hora de Zúrich, sea cual sea la zona horaria del visitante.
 * Festivos: los nueve legales del cantón de Zúrich (§ 1 Ruhetags- und Ladenöffnungsgesetz) y el
 * Berchtoldstag, festivo local que la ciudad y el cantón dan libre (ver docs/DECISIONES.md).
 */
export const OFFICE_TZ = 'Europe/Zurich';
export const OPEN_MINUTES = 8 * 60 + 30;
export const CLOSE_MINUTES = 17 * 60 + 30;

/** Fecha civil sin hora (mes 1–12). */
export interface CivilDate {
  y: number;
  m: number;
  d: number;
}

/** Fecha, día de la semana (0 = domingo) y minuto del día en Zúrich. */
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

/** Domingo de Pascua (algoritmo gregoriano anónimo). */
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

/** Días en que la oficina cierra en un año: festivos legales de Zúrich y el Berchtoldstag. */
export function zurichHolidays(y: number): Set<string> {
  const easter = easterSunday(y);
  return new Set(
    [
      { y, m: 1, d: 1 }, // Año Nuevo
      { y, m: 1, d: 2 }, // Berchtoldstag (local, no legal)
      addDays(easter, -2), // Viernes Santo
      addDays(easter, 1), // Lunes de Pascua
      { y, m: 5, d: 1 }, // Día del Trabajo
      addDays(easter, 39), // Ascensión
      addDays(easter, 50), // Lunes de Pentecostés
      { y, m: 8, d: 1 }, // Fiesta nacional
      { y, m: 12, d: 25 }, // Navidad
      { y, m: 12, d: 26 }, // San Esteban
    ].map(key),
  );
}

export function isWorkingDay(date: CivilDate): boolean {
  const wd = weekdayOf(date);
  return wd !== 0 && wd !== 6 && !zurichHolidays(date.y).has(key(date));
}

/** Primer día laborable estrictamente posterior a `date`. */
export function nextWorkingDay(date: CivilDate): CivilDate {
  let next = addDays(date, 1);
  while (!isWorkingDay(next)) next = addDays(next, 1);
  return next;
}

/** Día (en Zúrich) antes de cuyas 12:00 respondemos a un mensaje enviado en `now`. */
export function replyDay(now: Date): CivilDate {
  return nextWorkingDay(zurichNow(now));
}

/** Estado de la oficina: abierta ahora, o el día en que vuelve a abrir. */
export function officeStatus(now: Date): { open: true } | { open: false; opens: CivilDate } {
  const z = zurichNow(now);
  if (isWorkingDay(z) && z.minutes >= OPEN_MINUTES && z.minutes < CLOSE_MINUTES)
    return { open: true };
  const opens = isWorkingDay(z) && z.minutes < OPEN_MINUTES ? z : nextWorkingDay(z);
  return { open: false, opens: { y: opens.y, m: opens.m, d: opens.d } };
}

/**
 * «jueves 29 de octubre» / «Donnerstag, 29. Oktober»: fecha larga sin año, en el idioma dado.
 * Solo el alemán conserva la coma tras el día de la semana.
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
