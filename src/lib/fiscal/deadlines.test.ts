import { describe, expect, it } from 'vitest';
import {
  daysBetween,
  deadlineIn,
  isLegalWorkday,
  yearFraction,
  type DeadlineRule,
} from './deadlines';
import { nextDeadline, timeline } from './timeline';
import { events as CH } from '../../data/fiscal-calendar/ch';

const vat = (endM: number, endD: number): DeadlineRule => ({
  type: 'afterPeriod',
  endM,
  endD,
  days: 60,
  shift: true,
});

describe('deadlineIn: IVA, 60 días tras el periodo (art. 71 y 86 MWSTG)', () => {
  it('4.º trimestre: 1 de marzo, o 29 de febrero en bisiesto', () => {
    expect(deadlineIn(vat(12, 31), 2027).due).toEqual({ y: 2027, m: 3, d: 1 });
    expect(deadlineIn(vat(12, 31), 2028).due).toEqual({ y: 2028, m: 2, d: 29 });
  });
  it('1.er a 3.er trimestre: 30 de mayo, 29 de agosto y 29 de noviembre', () => {
    expect(deadlineIn(vat(3, 31), 2025).due).toEqual({ y: 2025, m: 5, d: 30 });
    expect(deadlineIn(vat(6, 30), 2025).due).toEqual({ y: 2025, m: 8, d: 29 });
    expect(deadlineIn(vat(9, 30), 2027).due).toEqual({ y: 2027, m: 11, d: 29 });
  });
  it('si cae en fin de semana, pasa al siguiente día hábil (art. 20.3 VwVG)', () => {
    // 29-11-2026 es domingo → lunes 30.
    expect(deadlineIn(vat(9, 30), 2026)).toEqual({
      start: { y: 2026, m: 11, d: 30 },
      due: { y: 2026, m: 11, d: 30 },
      shifted: true,
    });
    // 30-05-2026 es sábado → lunes 1 de junio.
    expect(deadlineIn(vat(3, 31), 2026).due).toEqual({ y: 2026, m: 6, d: 1 });
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
  it('2026: el IVA del 3.er trimestre vence el lunes 30 de noviembre', () => {
    const q3 = timeline(rules, 2026).find((t) => t.id === 'vat-q3');
    expect(q3).toMatchObject({ due: { y: 2026, m: 11, d: 30 }, shifted: true });
    expect(q3?.remind).toEqual({ y: 2026, m: 11, d: 20 });
  });
  it('desde el 28-10-2026, el próximo vence el 30 de noviembre, en 33 días', () => {
    const next = nextDeadline(rules, { y: 2026, m: 10, d: 28 });
    expect(next?.due).toEqual({ y: 2026, m: 11, d: 30 });
    expect(next?.daysLeft).toBe(33);
  });
  it('en diciembre salta al año siguiente: AVS el lunes 1-2-2027 (el 30 de enero es sábado)', () => {
    const next = nextDeadline(rules, { y: 2026, m: 12, d: 15 });
    expect(next).toMatchObject({ year: 2027, id: 'ahv-salaries', due: { y: 2027, m: 2, d: 1 } });
  });
});
