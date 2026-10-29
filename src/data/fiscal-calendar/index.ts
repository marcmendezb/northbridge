import type { Country } from '../../lib/country';
import type { FiscalEvent } from './types';
import { events as CH } from './ch';
import { events as ES } from './es';
import { events as DE } from './de';

import type { Text } from './types';

export type { FiscalEvent, Text } from './types';

/**
 * Calendario fiscal por país (docs/09: datos estructurados para el futuro calendario interactivo).
 * Cada país vive en su archivo; los que aún no existen se añaden aquí.
 */
export const FISCAL_CALENDARS: Partial<Record<Country, FiscalEvent[]>> = { CH, ES, DE };

/** Países con calendario propio; el resto ve el suizo hasta tener el suyo. */
export type CalendarCountry = 'CH' | 'ES' | 'DE';

/** A quién aplica cada calendario y de dónde salen sus fechas. */
export const CALENDAR_NOTES: Record<CalendarCountry, Text> = {
  CH: {
    es: 'Pyme con ejercicio igual al año natural, en el cantón de Zúrich.',
    en: 'SME with a financial year equal to the calendar year, in the canton of Zurich.',
    de: 'KMU mit Geschäftsjahr gleich Kalenderjahr, im Kanton Zürich.',
    fr: 'PME dont l’exercice correspond à l’année civile, dans le canton de Zurich.',
    it: 'PMI con esercizio uguale all’anno civile, nel cantone di Zurigo.',
  },
  DE: {
    es: 'GmbH o autónomo con ejercicio igual al año natural, en Berlín. Si el último día es sábado, domingo o festivo, vence el siguiente día hábil (§ 108 AO).',
    en: 'GmbH or self-employed with a financial year equal to the calendar year, in Berlin. If the last day is a Saturday, Sunday or public holiday, the next working day applies (§ 108 AO).',
    de: 'GmbH oder Selbständige mit Geschäftsjahr gleich Kalenderjahr, in Berlin. Fällt das Fristende auf einen Samstag, Sonntag oder Feiertag, gilt der nächste Werktag (§ 108 AO).',
    fr: 'GmbH ou indépendant dont l’exercice correspond à l’année civile, à Berlin. Si le dernier jour tombe un samedi, un dimanche ou un jour férié, le jour ouvrable suivant s’applique (§ 108 AO).',
    it: 'GmbH o autonomo con esercizio uguale all’anno civile, a Berlino. Se l’ultimo giorno cade di sabato, domenica o in un festivo, vale il giorno lavorativo successivo (§ 108 AO).',
  },
  ES: {
    es: 'Sociedad o autónomo con ejercicio igual al año natural. Plazos de la Agencia Tributaria: si el último día es inhábil, vence el siguiente día hábil.',
    en: 'Company or self-employed with a financial year equal to the calendar year. Spanish Tax Agency deadlines: if the last day is not a working day, the next working day applies.',
    de: 'Gesellschaft oder Selbständige mit Geschäftsjahr gleich Kalenderjahr. Fristen der spanischen Steuerbehörde: Ist der letzte Tag kein Werktag, gilt der nächste Werktag.',
    fr: 'Société ou indépendant dont l’exercice correspond à l’année civile. Échéances de l’administration fiscale espagnole : si le dernier jour n’est pas ouvrable, le jour ouvrable suivant s’applique.',
    it: 'Società o autonomo con esercizio uguale all’anno civile. Scadenze dell’Agenzia tributaria spagnola: se l’ultimo giorno non è lavorativo, vale il giorno lavorativo successivo.',
  },
};
