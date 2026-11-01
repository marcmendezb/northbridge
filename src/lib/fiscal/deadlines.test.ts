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

describe('IVA suizo: fin del segundo mes tras el periodo (ESTV, «fällig am 31. Mai»)', () => {
  const end = (m: number): DeadlineRule => ({ type: 'monthEnd', m, shift: false });
  it('trimestres: 31 de mayo, 31 de agosto, 30 de noviembre', () => {
    expect(deadlineIn(end(5), 2026).due).toEqual({ y: 2026, m: 5, d: 31 });
    expect(deadlineIn(end(8), 2026).due).toEqual({ y: 2026, m: 8, d: 31 });
    expect(deadlineIn(end(11), 2026).due).toEqual({ y: 2026, m: 11, d: 30 });
  });
  it('4.º trimestre: 28 de febrero, o 29 en bisiesto; sin mover por fin de semana', () => {
    expect(deadlineIn(end(2), 2027).due).toEqual({ y: 2027, m: 2, d: 28 }); // domingo
    expect(deadlineIn(end(2), 2028).due).toEqual({ y: 2028, m: 2, d: 29 });
    expect(deadlineIn(end(2), 2027).shifted).toBe(false);
  });
});

describe('traslado al siguiente día hábil', () => {
  const vat = (endM: number, endD: number): DeadlineRule => ({
    type: 'afterPeriod',
    endM,
    endD,
    days: 60,
    shift: true,
  });
  it('si cae en fin de semana, pasa al lunes', () => {
    // 29-11-2026 es domingo → lunes 30.
    expect(deadlineIn(vat(9, 30), 2026)).toEqual({
      start: { y: 2026, m: 11, d: 30 },
      due: { y: 2026, m: 11, d: 30 },
      shifted: true,
    });
  });
});

describe('deadlineIn: fechas fijas y ventanas', () => {
  it('AVS: 30 de enero, movido si cae en fin de semana (art. 38.3 ATSG)', () => {
    const ahv: DeadlineRule = { type: 'fixed', m: 1, d: 30, shift: true };
    expect(deadlineIn(ahv, 2026).due).toEqual({ y: 2026, m: 1, d: 30 }); // viernes
    expect(deadlineIn(ahv, 2027).due).toEqual({ y: 2027, m: 2, d: 1 }); // sábado → lunes
  });
  it('Zúrich: la fecha oficial, sin mover', () => {
    const rule: DeadlineRule = { type: 'fixed', m: 3, d: 31, shift: false };
    expect(deadlineIn(rule, 2029)).toMatchObject({ due: { y: 2029, m: 3, d: 31 }, shifted: false });
  });
  it('certificados de salario: de enero a finales de febrero', () => {
    const rule: DeadlineRule = { type: 'range', from: { m: 1, d: 1 }, to: 'endFeb' };
    expect(deadlineIn(rule, 2028).due).toEqual({ y: 2028, m: 2, d: 29 });
    expect(deadlineIn(rule, 2027).start).toEqual({ y: 2027, m: 1, d: 1 });
  });
});

describe('utilidades', () => {
  it('días hábiles legales: el Berchtoldstag no cuenta como festivo', () => {
    expect(isLegalWorkday({ y: 2026, m: 1, d: 2 })).toBe(true);
    expect(isLegalWorkday({ y: 2026, m: 8, d: 1 })).toBe(false);
  });
  it('fracción del año y días entre fechas', () => {
    expect(yearFraction({ y: 2026, m: 1, d: 1 })).toBe(0);
    expect(yearFraction({ y: 2026, m: 7, d: 2 })).toBeCloseTo(182 / 365);
    expect(daysBetween({ y: 2026, m: 10, d: 28 }, { y: 2026, m: 11, d: 30 })).toBe(33);
  });
});

describe('timeline del calendario suizo', () => {
  const rules = CH.flatMap((e) => (e.rule ? [{ id: e.id, rule: e.rule }] : []));
  it('todos los plazos tienen regla', () => {
    expect(rules).toHaveLength(CH.length);
  });
  it('2026: el IVA del 3.er trimestre vence el 30 de noviembre', () => {
    const q3 = timeline(rules, 2026).find((t) => t.id === 'vat-q3');
    expect(q3).toMatchObject({ due: { y: 2026, m: 11, d: 30 }, shifted: false });
    expect(q3?.remind).toEqual({ y: 2026, m: 11, d: 20 });
  });
  it('desde el 28-10-2026, el próximo vence el 30 de noviembre, en 33 días', () => {
    const next = nextDeadline(rules, { y: 2026, m: 10, d: 28 });
    expect(next?.due).toEqual({ y: 2026, m: 11, d: 30 });
    expect(next?.daysLeft).toBe(33);
  });
  it('en diciembre salta al año siguiente: cuotas AVS el lunes 11-1-2027 (el 10 es domingo)', () => {
    const next = nextDeadline(rules, { y: 2026, m: 12, d: 15 });
    expect(next).toMatchObject({ year: 2027, id: 'ahv-advance-q4', due: { y: 2027, m: 1, d: 11 } });
  });
});

describe('España: calendario de la Agencia Tributaria 2026', () => {
  const ES_EVENTS = ES.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string) =>
    timeline(ES_EVENTS, 2026, spainNationalHolidays).find((t) => t.id === id)?.due;
  it('coincide con las fechas publicadas por la AEAT (sábados y domingos trasladados)', () => {
    expect(due('es-wh-q4')).toEqual({ y: 2026, m: 1, d: 20 });
    expect(due('es-vat-q4')).toEqual({ y: 2026, m: 1, d: 30 });
    expect(due('es-wh-annual')).toEqual({ y: 2026, m: 2, d: 2 }); // 31-1 sábado
    expect(due('es-347')).toEqual({ y: 2026, m: 3, d: 2 }); // 28-2 sábado
    expect(due('es-vat-q1')).toEqual({ y: 2026, m: 4, d: 20 });
    expect(due('es-income')).toEqual({ y: 2026, m: 6, d: 30 });
    expect(due('es-corporate')).toEqual({ y: 2026, m: 7, d: 27 }); // 25-7 sábado
    expect(due('es-vat-q3')).toEqual({ y: 2026, m: 10, d: 20 });
    expect(due('es-pay-dec')).toEqual({ y: 2026, m: 12, d: 21 }); // 20-12 domingo
  });
});

describe('Alemania: § 108 AO con festivos de Berlín, 2026', () => {
  const DE_EVENTS = DE.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string) =>
    timeline(DE_EVENTS, 2026, berlinHolidays).find((t) => t.id === id)?.due;
  it('Voranmeldung el día 10, trasladada si cae en fin de semana', () => {
    expect(due('de-vat-q4')).toEqual({ y: 2026, m: 1, d: 12 }); // 10-1 sábado
    expect(due('de-vat-q1')).toEqual({ y: 2026, m: 4, d: 10 });
    expect(due('de-vat-q3')).toEqual({ y: 2026, m: 10, d: 12 }); // 10-10 sábado
  });
  it('pagos a cuenta, impuesto industrial, declaraciones y certificados', () => {
    expect(due('de-prepay-mar')).toEqual({ y: 2026, m: 3, d: 10 });
    expect(due('de-trade-feb')).toEqual({ y: 2026, m: 2, d: 16 }); // 15-2 domingo
    expect(due('de-trade-aug')).toEqual({ y: 2026, m: 8, d: 17 }); // 15-8 sábado
    expect(due('de-returns')).toEqual({ y: 2026, m: 7, d: 31 });
    expect(due('de-wage-certificates')).toEqual({ y: 2026, m: 3, d: 2 }); // 28-2 sábado
  });
});

describe('Francia: art. 199-0 anexo IV CGI con festivos franceses', () => {
  const FR_EVENTS = FR.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string, y = 2026) =>
    timeline(FR_EVENTS, y, franceHolidays).find((t) => t.id === id)?.due;
  it('liasse fiscale: 2.º día hábil tras el 1 de mayo y 15 días más por vía telemática', () => {
    expect(due('fr-return')).toEqual({ y: 2026, m: 5, d: 5 });
    expect(due('fr-return-online')).toEqual({ y: 2026, m: 5, d: 20 });
    expect(due('fr-return', 2027)).toEqual({ y: 2027, m: 5, d: 4 }); // impots.gouv: CA12 2026, 4-5-2027
  });
  it('acomptes y solde del IS, y CFE', () => {
    expect(due('fr-is-mar')).toEqual({ y: 2026, m: 3, d: 16 }); // 15-3 domingo
    expect(due('fr-is-balance')).toEqual({ y: 2026, m: 5, d: 15 });
    expect(due('fr-is-jun')).toEqual({ y: 2026, m: 6, d: 15 });
    expect(due('fr-cfe')).toEqual({ y: 2026, m: 12, d: 15 });
  });
});

describe('Italia: scadenzario de la Agenzia delle Entrate 2026', () => {
  const IT_EVENTS = IT.flatMap((e) => (e.rule && !e.recurring ? [{ id: e.id, rule: e.rule }] : []));
  const due = (id: string) =>
    timeline(IT_EVENTS, 2026, italyHolidays).find((t) => t.id === id)?.due;
  it('IVA trimestral y LIPE, con sábados y domingos trasladados', () => {
    expect(due('it-vat-annual')).toEqual({ y: 2026, m: 3, d: 16 });
    expect(due('it-vat-q1')).toEqual({ y: 2026, m: 5, d: 18 }); // 16-5 sábado
    expect(due('it-vat-q2')).toEqual({ y: 2026, m: 8, d: 20 });
    expect(due('it-vat-q3')).toEqual({ y: 2026, m: 11, d: 16 });
    expect(due('it-lipe-q4')).toEqual({ y: 2026, m: 3, d: 2 }); // 28-2 sábado
    expect(due('it-lipe-q1')).toEqual({ y: 2026, m: 6, d: 1 }); // 31-5 domingo
    expect(due('it-lipe-q2')).toEqual({ y: 2026, m: 9, d: 30 });
  });
  it('declaraciones, saldo y acconti, CU y 770', () => {
    expect(due('it-returns')).toEqual({ y: 2026, m: 11, d: 2 }); // 31-10 sábado
    expect(due('it-770')).toEqual({ y: 2026, m: 11, d: 2 });
    expect(due('it-balance')).toEqual({ y: 2026, m: 6, d: 30 });
    expect(due('it-second-advance')).toEqual({ y: 2026, m: 11, d: 30 });
    expect(due('it-cu')).toEqual({ y: 2026, m: 3, d: 16 });
  });
  it('el 4 de octubre es festivo desde 2026 (Ley 151/2025)', () => {
    expect(italyHolidays(2025).has('2025-10-4')).toBe(false);
    expect(italyHolidays(2027).has('2027-10-4')).toBe(true);
  });
});
