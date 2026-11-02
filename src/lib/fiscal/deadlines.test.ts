import { describe, expect, it } from 'vitest';
import {
  daysBetween,
  spainNationalHolidays,
  berlinHolidays,
  franceHolidays,
  italyHolidays,
  deadlineIn,
  isLegalWorkday,
  yearFraction,
  type DeadlineRule,
} from './deadlines';
import { nextDeadline, timeline } from './timeline';
import { events as CH } from '../../data/fiscal-calendar/ch';
import { events as ES } from '../../data/fiscal-calendar/es';
import { events as DE } from '../../data/fiscal-calendar/de';
import { events as FR } from '../../data/fiscal-calendar/fr';
import { events as IT } from '../../data/fiscal-calendar/it';

describe('Swiss VAT: end of the second month after the period (ESTV, "fällig am 31. Mai")', () => {
  const end = (m: number): DeadlineRule => ({ type: 'monthEnd', m, shift: false });
  it('quarters: 31 May, 31 August, 30 November', () => {
    expect(deadlineIn(end(5), 2026).due).toEqual({ y: 2026, m: 5, d: 31 });
    expect(deadlineIn(end(8), 2026).due).toEqual({ y: 2026, m: 8, d: 31 });
    expect(deadlineIn(end(11), 2026).due).toEqual({ y: 2026, m: 11, d: 30 });
  });
  it('Q4: 28 February, or 29 in a leap year; not moved for weekends', () => {
    expect(deadlineIn(end(2), 2027).due).toEqual({ y: 2027, m: 2, d: 28 }); // Sunday
    expect(deadlineIn(end(2), 2028).due).toEqual({ y: 2028, m: 2, d: 29 });
    expect(deadlineIn(end(2), 2027).shifted).toBe(false);
  });
});

describe('moving to the next working day', () => {
  const vat = (endM: number, endD: number): DeadlineRule => ({
    type: 'afterPeriod',
    endM,
    endD,
    days: 60,
    shift: true,
  });
  it('a weekend date moves to Monday', () => {
    // 29-11-2026 is a Sunday → Monday 30.
    expect(deadlineIn(vat(9, 30), 2026)).toEqual({
      start: { y: 2026, m: 11, d: 30 },
      due: { y: 2026, m: 11, d: 30 },
      shifted: true,
    });
  });
});

describe('deadlineIn: fixed dates and windows', () => {
  it('AHV: 30 January, moved if it falls on a weekend (art. 38(3) ATSG)', () => {
    const ahv: DeadlineRule = { type: 'fixed', m: 1, d: 30, shift: true };
    expect(deadlineIn(ahv, 2026).due).toEqual({ y: 2026, m: 1, d: 30 }); // Friday
    expect(deadlineIn(ahv, 2027).due).toEqual({ y: 2027, m: 2, d: 1 }); // Saturday → Monday
  });
  it('Zurich: the official date, not moved', () => {
    const rule: DeadlineRule = { type: 'fixed', m: 3, d: 31, shift: false };
    expect(deadlineIn(rule, 2029)).toMatchObject({ due: { y: 2029, m: 3, d: 31 }, shifted: false });
  });
  it('salary certificates: from January to the end of February', () => {
    const rule: DeadlineRule = { type: 'range', from: { m: 1, d: 1 }, to: 'endFeb' };
    expect(deadlineIn(rule, 2028).due).toEqual({ y: 2028, m: 2, d: 29 });
    expect(deadlineIn(rule, 2027).start).toEqual({ y: 2027, m: 1, d: 1 });
  });
});

describe('helpers', () => {
  it('legal working days: Berchtoldstag is not a legal holiday', () => {
    expect(isLegalWorkday({ y: 2026, m: 1, d: 2 })).toBe(true);
    expect(isLegalWorkday({ y: 2026, m: 8, d: 1 })).toBe(false);
  });
  it('year fraction and days between dates', () => {
    expect(yearFraction({ y: 2026, m: 1, d: 1 })).toBe(0);
    expect(yearFraction({ y: 2026, m: 7, d: 2 })).toBeCloseTo(182 / 365);
    expect(daysBetween({ y: 2026, m: 10, d: 28 }, { y: 2026, m: 11, d: 30 })).toBe(33);
  });
});

describe('Swiss calendar timeline', () => {
  const rules = CH.flatMap((e) => (e.rule ? [{ id: e.id, rule: e.rule }] : []));
  it('every deadline has a rule', () => {
    expect(rules).toHaveLength(CH.length);
  });
  it('2026: Q3 VAT is due on 30 November', () => {
    const q3 = timeline(rules, 2026).find((t) => t.id === 'vat-q3');
    expect(q3).toMatchObject({ due: { y: 2026, m: 11, d: 30 }, shifted: false });
    expect(q3?.remind).toEqual({ y: 2026, m: 11, d: 20 });
  });
  it('from 28-10-2026, the next one is due on 30 November, in 33 days', () => {
    const next = nextDeadline(rules, { y: 2026, m: 10, d: 28 });
    expect(next?.due).toEqual({ y: 2026, m: 11, d: 30 });
    expect(next?.daysLeft).toBe(33);
  });
  it('in December it rolls into next year: AHV instalments on Monday 11-1-2027 (the 10th is a Sunday)', () => {
    const next = nextDeadline(rules, { y: 2026, m: 12, d: 15 });
    expect(next).toMatchObject({ year: 2027, id: 'ahv-advance-q4', due: { y: 2027, m: 1, d: 11 } });
  });
});

describe('Spain: 2026 Tax Agency calendar', () => {
  const ES_EVENTS = ES.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string) =>
    timeline(ES_EVENTS, 2026, spainNationalHolidays).find((t) => t.id === id)?.due;
  it('matches the dates published by the AEAT (Saturdays and Sundays moved)', () => {
    expect(due('es-wh-q4')).toEqual({ y: 2026, m: 1, d: 20 });
    expect(due('es-vat-q4')).toEqual({ y: 2026, m: 1, d: 30 });
    expect(due('es-wh-annual')).toEqual({ y: 2026, m: 2, d: 2 }); // 31 Jan is a Saturday
    expect(due('es-347')).toEqual({ y: 2026, m: 3, d: 2 }); // 28 Feb is a Saturday
    expect(due('es-vat-q1')).toEqual({ y: 2026, m: 4, d: 20 });
    expect(due('es-income')).toEqual({ y: 2026, m: 6, d: 30 });
    expect(due('es-corporate')).toEqual({ y: 2026, m: 7, d: 27 }); // 25 Jul is a Saturday
    expect(due('es-vat-q3')).toEqual({ y: 2026, m: 10, d: 20 });
    expect(due('es-pay-dec')).toEqual({ y: 2026, m: 12, d: 21 }); // 20 Dec is a Sunday
  });
});

describe('Germany: § 108 AO with Berlin holidays, 2026', () => {
  const DE_EVENTS = DE.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string) =>
    timeline(DE_EVENTS, 2026, berlinHolidays).find((t) => t.id === id)?.due;
  it('Voranmeldung on the 10th, moved if it falls on a weekend', () => {
    expect(due('de-vat-q4')).toEqual({ y: 2026, m: 1, d: 12 }); // 10 Jan is a Saturday
    expect(due('de-vat-q1')).toEqual({ y: 2026, m: 4, d: 10 });
    expect(due('de-vat-q3')).toEqual({ y: 2026, m: 10, d: 12 }); // 10 Oct is a Saturday
  });
  it('prepayments, trade tax, returns and certificates', () => {
    expect(due('de-prepay-mar')).toEqual({ y: 2026, m: 3, d: 10 });
    expect(due('de-trade-feb')).toEqual({ y: 2026, m: 2, d: 16 }); // 15 Feb is a Sunday
    expect(due('de-trade-aug')).toEqual({ y: 2026, m: 8, d: 17 }); // 15 Aug is a Saturday
    expect(due('de-returns')).toEqual({ y: 2026, m: 7, d: 31 });
    expect(due('de-wage-certificates')).toEqual({ y: 2026, m: 3, d: 2 }); // 28 Feb is a Saturday
  });
});

describe('France: art. 199-0 annex IV CGI with French holidays', () => {
  const FR_EVENTS = FR.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string, y = 2026) =>
    timeline(FR_EVENTS, y, franceHolidays).find((t) => t.id === id)?.due;
  it('liasse fiscale: 2nd working day after 1 May, plus 15 days when filed online', () => {
    expect(due('fr-return')).toEqual({ y: 2026, m: 5, d: 5 });
    expect(due('fr-return-online')).toEqual({ y: 2026, m: 5, d: 20 });
    expect(due('fr-return', 2027)).toEqual({ y: 2027, m: 5, d: 4 }); // impots.gouv.fr: CA12 for 2026 due 4 May 2027
  });
  it('corporate tax instalments and balance, and CFE', () => {
    expect(due('fr-is-mar')).toEqual({ y: 2026, m: 3, d: 16 }); // 15 Mar is a Sunday
    expect(due('fr-is-balance')).toEqual({ y: 2026, m: 5, d: 15 });
    expect(due('fr-is-jun')).toEqual({ y: 2026, m: 6, d: 15 });
    expect(due('fr-cfe')).toEqual({ y: 2026, m: 12, d: 15 });
  });
});

describe('Italy: 2026 Agenzia delle Entrate deadline calendar', () => {
  const IT_EVENTS = IT.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string) =>
    timeline(IT_EVENTS, 2026, italyHolidays).find((t) => t.id === id)?.due;
  it('quarterly VAT and LIPE, with Saturdays and Sundays moved', () => {
    expect(due('it-vat-annual')).toEqual({ y: 2026, m: 3, d: 16 });
    expect(due('it-vat-q1')).toEqual({ y: 2026, m: 5, d: 18 }); // 16 May is a Saturday
    expect(due('it-vat-q2')).toEqual({ y: 2026, m: 8, d: 20 });
    expect(due('it-vat-q3')).toEqual({ y: 2026, m: 11, d: 16 });
    expect(due('it-lipe-q4')).toEqual({ y: 2026, m: 3, d: 2 }); // 28 Feb is a Saturday
    expect(due('it-lipe-q1')).toEqual({ y: 2026, m: 6, d: 1 }); // 31 May is a Sunday
    expect(due('it-lipe-q2')).toEqual({ y: 2026, m: 9, d: 30 });
  });
  it('returns, balance and advances, CU and 770', () => {
    expect(due('it-returns')).toEqual({ y: 2026, m: 11, d: 2 }); // 31 Oct is a Saturday
    expect(due('it-770')).toEqual({ y: 2026, m: 11, d: 2 });
    expect(due('it-balance')).toEqual({ y: 2026, m: 6, d: 30 });
    expect(due('it-second-advance')).toEqual({ y: 2026, m: 11, d: 30 });
    expect(due('it-cu')).toEqual({ y: 2026, m: 3, d: 16 });
  });
  it('4 October is a holiday from 2026 (Law 151/2025)', () => {
    expect(italyHolidays(2025).has('2025-10-4')).toBe(false);
    expect(italyHolidays(2027).has('2027-10-4')).toBe(true);
  });
});
