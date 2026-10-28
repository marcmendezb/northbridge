import type { Locale } from '../../i18n/locales';
import type { DeadlineRule } from '../../lib/fiscal/deadlines';

/** Texto en los cinco idiomas de la web. */
export type Text = Record<Locale, string>;

/** Un vencimiento del calendario fiscal de una pyme con el ejercicio igual al año natural. */
export interface FiscalEvent {
  id: string;
  /** Mes (1–12) en que vence, para ordenar y para mostrar «lo que viene». */
  month: number;
  /** Nombre corto para la regla del año («4.º trimestre», «Sociedades»). */
  short?: Text;
  when: Text;
  what: Text;
  need: Text;
  /** Regla legal para calcular la fecha exacta de cada año (src/lib/fiscal/deadlines.ts). */
  rule?: DeadlineRule;
  /** Prórroga de otro plazo (id): se dibuja como su continuación. */
  extends?: string;
  /** Plazo menor y recurrente (cuotas a cuenta): marca pequeña, sin etiqueta, en el gráfico. */
  minor?: boolean;
}
