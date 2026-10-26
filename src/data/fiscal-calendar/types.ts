import type { Locale } from '../../i18n/locales';

/** Texto en los cinco idiomas de la web. */
export type Text = Record<Locale, string>;

/** Un vencimiento del calendario fiscal de una pyme con el ejercicio igual al año natural. */
export interface FiscalEvent {
  id: string;
  /** Mes (1–12) en que vence, para ordenar y para mostrar «lo que viene». */
  month: number;
  when: Text;
  what: Text;
  need: Text;
}
