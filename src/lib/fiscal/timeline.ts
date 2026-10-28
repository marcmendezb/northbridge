/**
 * La regla del año: posición de cada plazo, su aviso y el próximo vencimiento.
 * La usan el servidor (año de compilación, sin JS) y el navegador (año en curso, en hora de Zúrich).
 */
import { addDays, type CivilDate } from '../contact/office';
import { daysBetween, deadlineIn, yearFraction, type DeadlineRule } from './deadlines';

/** Días de antelación del aviso (docs/08: «te avisamos 10 días antes»). */
export const REMINDER_DAYS = 10;

export interface RuledEvent {
  id: string;
  rule: DeadlineRule;
}

export interface TimelineItem {
  id: string;
  start: CivilDate;
  due: CivilDate;
  shifted: boolean;
  window: boolean;
  remind: CivilDate;
  /** Posiciones en la regla, de 0 a 1. */
  at: number;
  startAt: number;
  remindAt: number;
  /** Fila (0 = sobre la línea) para que dos plazos cercanos no se pisen. */
  row: number;
}

export function timeline(events: RuledEvent[], year: number): TimelineItem[] {
  const items = events
    .map((e) => {
      const { start, due, shifted } = deadlineIn(e.rule, year);
      const remind = addDays(due, -REMINDER_DAYS);
      return {
        id: e.id,
        start,
        due,
        shifted,
        window: e.rule.type === 'range',
        remind,
        at: yearFraction(due),
        startAt: yearFraction(start),
        remindAt: Math.max(0, yearFraction(remind.y === year ? remind : { y: year, m: 1, d: 1 })),
        row: 0,
      };
    })
    .sort((a, b) => a.at - b.at);
  // Plazos a menos de ~3 semanas entre sí: se apilan.
  const points = items.filter((t) => !t.window);
  points.forEach((item, i) => {
    const prev = points[i - 1];
    if (prev && item.at - prev.at < 0.06) item.row = prev.row + 1;
  });
  // Una ventana (barra) va en la fila libre por encima de los plazos que cruza.
  items
    .filter((t) => t.window)
    .forEach((w) => {
      const crossed = points.filter((p) => p.at >= w.startAt - 0.03 && p.at <= w.at + 0.03);
      w.row = crossed.length ? Math.max(...crossed.map((p) => p.row)) + 1 : 0;
    });
  return items;
}

/** Inicio de cada mes en la regla y su ancho (los meses no miden lo mismo). */
export function monthMarks(year: number): { m: number; at: number; w: number }[] {
  return Array.from({ length: 12 }, (_, i) => {
    const at = yearFraction({ y: year, m: i + 1, d: 1 });
    const end = i === 11 ? 1 : yearFraction({ y: year, m: i + 2, d: 1 });
    return { m: i + 1, at, w: end - at };
  });
}

/** El primer plazo que aún no ha vencido (puede ser del año siguiente) y los días que quedan. */
export function nextDeadline(events: RuledEvent[], today: CivilDate) {
  for (const year of [today.y, today.y + 1]) {
    const found = timeline(events, year).find((t) => daysBetween(today, t.due) >= 0);
    if (found) return { ...found, year, daysLeft: daysBetween(today, found.due) };
  }
  return undefined;
}
