import { describe, expect, it } from 'vitest';
import { easterSunday, formatDay, isWorkingDay, officeStatus, replyDay, zurichNow } from './office';

/** Instante a partir de la hora de Zúrich (CET +01:00 / CEST +02:00). */
const at = (iso: string) => new Date(iso);

describe('easterSunday', () => {
  it('matches known dates', () => {
    expect(easterSunday(2025)).toEqual({ y: 2025, m: 4, d: 20 });
    expect(easterSunday(2026)).toEqual({ y: 2026, m: 4, d: 5 });
    expect(easterSunday(2027)).toEqual({ y: 2027, m: 3, d: 28 });
  });
});

describe('isWorkingDay', () => {
  it('skips weekends and Zurich public holidays', () => {
    expect(isWorkingDay({ y: 2026, m: 10, d: 27 })).toBe(true); // martes
    expect(isWorkingDay({ y: 2026, m: 10, d: 31 })).toBe(false); // sábado
    expect(isWorkingDay({ y: 2026, m: 1, d: 2 })).toBe(false); // Berchtoldstag
    expect(isWorkingDay({ y: 2026, m: 4, d: 3 })).toBe(false); // Viernes Santo
    expect(isWorkingDay({ y: 2026, m: 5, d: 14 })).toBe(false); // Ascensión
    expect(isWorkingDay({ y: 2026, m: 5, d: 25 })).toBe(false); // Lunes de Pentecostés
    expect(isWorkingDay({ y: 2026, m: 12, d: 28 })).toBe(true);
  });
});

describe('zurichNow', () => {
  it('reads the Zurich wall clock, not the visitor one', () => {
    const z = zurichNow(at('2026-10-27T23:30:00Z')); // 00:30 del 28 en Zúrich
    expect(z).toMatchObject({ y: 2026, m: 10, d: 28, weekday: 3, minutes: 30 });
  });
});

describe('replyDay', () => {
  it('is the next working day', () => {
    expect(replyDay(at('2026-10-27T10:00:00+01:00'))).toEqual({ y: 2026, m: 10, d: 28 });
  });
  it('jumps the weekend from Friday', () => {
    expect(replyDay(at('2026-10-30T16:00:00+01:00'))).toEqual({ y: 2026, m: 11, d: 2 });
  });
  it('jumps holidays', () => {
    // Jueves 24 de diciembre → viernes 25 y sábado 26 festivos → lunes 28.
    expect(replyDay(at('2026-12-24T09:00:00+01:00'))).toEqual({ y: 2026, m: 12, d: 28 });
  });
});

describe('officeStatus', () => {
  it('is open during office hours', () => {
    expect(officeStatus(at('2026-10-27T08:30:00+01:00'))).toEqual({ open: true });
  });
  it('opens later the same day before 08:30', () => {
    expect(officeStatus(at('2026-10-27T07:00:00+01:00'))).toEqual({
      open: false,
      opens: { y: 2026, m: 10, d: 27 },
    });
  });
  it('opens on Monday after Friday closing', () => {
    expect(officeStatus(at('2026-10-30T17:30:00+01:00'))).toEqual({
      open: false,
      opens: { y: 2026, m: 11, d: 2 },
    });
  });
});

describe('formatDay', () => {
  const day = { y: 2026, m: 10, d: 29 };
  it('formats a long date per locale', () => {
    expect(formatDay(day, 'es')).toBe('jueves 29 de octubre');
    expect(formatDay(day, 'en')).toBe('Thursday 29 October');
    expect(formatDay(day, 'de')).toBe('Donnerstag, 29. Oktober');
    expect(formatDay(day, 'fr')).toBe('jeudi 29 octobre');
    expect(formatDay(day, 'it')).toBe('giovedì 29 ottobre');
  });
  it('can give only the weekday', () => {
    expect(formatDay(day, 'es', false)).toBe('jueves');
  });
});
