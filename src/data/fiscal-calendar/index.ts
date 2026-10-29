import type { Country } from '../../lib/country';
import type { FiscalEvent } from './types';
import { events as CH } from './ch';
import { events as ES } from './es';

import type { Text } from './types';

export type { FiscalEvent, Text } from './types';

/**
 * Calendario fiscal por país (docs/09: datos estructurados para el futuro calendario interactivo).
 * Cada país vive en su archivo; los que aún no existen se añaden aquí.
 */
export const FISCAL_CALENDARS: Partial<Record<Country, FiscalEvent[]>> = { CH, ES };

/** Países con calendario propio; el resto ve el suizo hasta tener el suyo. */
export type CalendarCountry = 'CH' | 'ES';

/** A quién aplica cada calendario y de dónde salen sus fechas. */
export const CALENDAR_NOTES: Record<CalendarCountry, Text> = {
  CH: {
    es: 'Pyme con ejercicio igual al año natural, en el cantón de Zúrich.',
    en: 'SME with a financial year equal to the calendar year, in the canton of Zurich.',
    de: 'KMU mit Geschäftsjahr gleich Kalenderjahr, im Kanton Zürich.',
    fr: 'PME dont l’exercice correspond à l’année civile, dans le canton de Zurich.',
    it: 'PMI con esercizio uguale all’anno civile, nel cantone di Zurigo.',
  },
  ES: {
    es: 'Sociedad o autónomo con ejercicio igual al año natural. Plazos de la Agencia Tributaria: si el último día es inhábil, vence el siguiente día hábil.',
    en: 'Company or self-employed with a financial year equal to the calendar year. Spanish Tax Agency deadlines: if the last day is not a working day, the next working day applies.',
    de: 'Gesellschaft oder Selbständige mit Geschäftsjahr gleich Kalenderjahr. Fristen der spanischen Steuerbehörde: Ist der letzte Tag kein Werktag, gilt der nächste Werktag.',
    fr: 'Société ou indépendant dont l’exercice correspond à l’année civile. Échéances de l’administration fiscale espagnole : si le dernier jour n’est pas ouvrable, le jour ouvrable suivant s’applique.',
    it: 'Società o autonomo con esercizio uguale all’anno civile. Scadenze dell’Agenzia tributaria spagnola: se l’ultimo giorno non è lavorativo, vale il giorno lavorativo successivo.',
  },
};
