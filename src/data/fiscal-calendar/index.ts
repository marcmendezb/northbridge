import type { Country } from '../../lib/country';
import type { FiscalEvent } from './types';
import { events as CH } from './ch';
import { events as ES } from './es';
import { events as DE } from './de';
import { events as FR } from './fr';
import { events as IT } from './it';

import type { Text } from './types';

export type { FiscalEvent, Text } from './types';

/**
 * Tax calendar per country.
 * Each country lives in its own file; new ones are added here.
 */
export const FISCAL_CALENDARS: Partial<Record<Country, FiscalEvent[]>> = { CH, ES, DE, FR, IT };

/** Countries with their own calendar; the rest see the Swiss one until they have theirs. */
export type CalendarCountry = 'CH' | 'ES' | 'DE' | 'FR' | 'IT';

/** Who each calendar applies to and where its dates come from. */
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
  FR: {
    es: 'Sociedad sujeta al impuesto sobre sociedades (SAS, SARL) con ejercicio igual al año natural, en París. Si un pago vence en sábado, domingo o festivo, pasa al siguiente día hábil (art. 199-0 anexo IV CGI). Desde 2027 desaparece el régimen simplificado de IVA: hasta 1 M€ de volumen, el IVA se declara cada trimestre.',
    en: 'Company subject to corporate income tax (SAS, SARL) with a financial year equal to the calendar year, in Paris. If a payment falls on a Saturday, Sunday or public holiday, the next working day applies (art. 199-0 annex IV CGI). From 2027 the simplified VAT scheme ends: up to €1M turnover, VAT is filed quarterly.',
    de: 'Körperschaftsteuerpflichtige Gesellschaft (SAS, SARL) mit Geschäftsjahr gleich Kalenderjahr, in Paris. Fällt eine Zahlung auf einen Samstag, Sonntag oder Feiertag, gilt der nächste Werktag (Art. 199-0 Anhang IV CGI). Ab 2027 entfällt das vereinfachte Umsatzsteuerverfahren: Bis 1 Mio. € Umsatz wird vierteljährlich erklärt.',
    fr: 'Société soumise à l’IS (SAS, SARL) dont l’exercice correspond à l’année civile, à Paris. Si un paiement tombe un samedi, un dimanche ou un jour férié, il est reporté au premier jour ouvrable suivant (art. 199-0 annexe IV CGI). À partir de 2027, le régime simplifié de TVA disparaît : jusqu’à 1 M€ de chiffre d’affaires, la TVA se déclare chaque trimestre.',
    it: 'Società soggetta all’imposta sulle società (SAS, SARL) con esercizio uguale all’anno civile, a Parigi. Se un pagamento cade di sabato, domenica o in un festivo, slitta al giorno lavorativo successivo (art. 199-0 allegato IV CGI). Dal 2027 il regime IVA semplificato scompare: fino a 1 M€ di fatturato, l’IVA si dichiara ogni trimestre.',
  },
  IT: {
    es: 'SRL o autónomo con ejercicio igual al año natural e IVA trimestral, en Roma. Si el plazo cae en sábado o festivo, pasa al siguiente día hábil (art. 7 DL 70/2011).',
    en: 'SRL or self-employed with a financial year equal to the calendar year and quarterly VAT, in Rome. If a deadline falls on a Saturday or public holiday, the next working day applies (art. 7 DL 70/2011).',
    de: 'SRL oder Selbständige mit Geschäftsjahr gleich Kalenderjahr und vierteljährlicher Umsatzsteuer, in Rom. Fällt eine Frist auf einen Samstag oder Feiertag, gilt der nächste Werktag (Art. 7 DL 70/2011).',
    fr: 'SRL ou indépendant dont l’exercice correspond à l’année civile, avec TVA trimestrielle, à Rome. Si une échéance tombe un samedi ou un jour férié, elle est reportée au jour ouvrable suivant (art. 7 DL 70/2011).',
    it: 'SRL o autonomo con esercizio uguale all’anno civile e IVA trimestrale, a Roma. Se la scadenza cade di sabato o in un festivo, slitta al primo giorno lavorativo successivo (art. 7 DL 70/2011).',
  },
};
