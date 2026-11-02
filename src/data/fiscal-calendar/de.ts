import type { FiscalEvent } from './types';

/**
 * Germany: GmbH or self-employed with a calendar financial year, in Berlin. Deadlines checked on
 * 29-10-2026: § 18 UStG (advance VAT return on the 10th; quarterly between €2,000 and €9,000 of the
 * previous year's VAT, monthly above that), § 149 AO (annual returns: 31 July without a tax adviser),
 * § 37 EStG and § 31 KStG (prepayments on 10 March, June, September and December), § 19 GewStG
 * (15 February, May, August and November), § 41a and § 41b EStG (wage tax), § 23 SGB IV
 * (contributions) and § 325 HGB (publication of accounts). If the last day is a Saturday, Sunday or holiday,
 * it moves to the next working day (§ 108 Abs. 3 AO).
 */
type T5 = { es: string; en: string; de: string; fr: string; it: string };
const T = (es: string, en: string, de: string, fr: string, it: string): T5 => ({
  es,
  en,
  de,
  fr,
  it,
});

const Q4 = T('4.º trimestre', 'Q4', '4. Quartal', '4e trimestre', '4° trimestre');
const Q1 = T('1.er trimestre', 'Q1', '1. Quartal', '1er trimestre', '1° trimestre');
const Q2 = T('2.º trimestre', 'Q2', '2. Quartal', '2e trimestre', '2° trimestre');
const Q3 = T('3.er trimestre', 'Q3', '3. Quartal', '3e trimestre', '3° trimestre');

const day10 = T(
  'Día 10 tras el fin del trimestre',
  '10th day after the end of the quarter',
  '10. Tag nach Quartalsende',
  '10e jour après la fin du trimestre',
  '10° giorno dopo la fine del trimestre',
);
const books = (es: string, en: string, de: string, fr: string, it: string) =>
  T(
    `Facturas y extractos de ${es} antes del día 3.`,
    `Invoices and statements for ${en} by the 3rd.`,
    `Rechnungen und Auszüge ${de} bis zum 3.`,
    `Factures et relevés de ${fr} avant le 3.`,
    `Fatture ed estratti di ${it} entro il 3.`,
  );

const vat = (id: string, m: number, q: T5, need: T5): FiscalEvent => ({
  id,
  cat: 'vat',
  month: m,
  rule: { type: 'fixed', m, d: 10, shift: true },
  short: q,
  when: day10,
  what: T(
    `IVA del ${q.es}: declaración previa (Umsatzsteuer-Voranmeldung) y pago`,
    `VAT for ${q.en}: advance return (Umsatzsteuer-Voranmeldung) and payment`,
    `Umsatzsteuer-Voranmeldung ${q.de} und Zahlung`,
    `TVA du ${q.fr} : déclaration anticipée (Umsatzsteuer-Voranmeldung) et paiement`,
    `IVA del ${q.it}: dichiarazione anticipata (Umsatzsteuer-Voranmeldung) e pagamento`,
  ),
  need,
});

const prepay = (id: string, m: number): FiscalEvent => ({
  id,
  cat: 'pay',
  month: m,
  rule: { type: 'fixed', m, d: 10, shift: true },
  short: T('Pagos a cuenta', 'Prepayments', 'Vorauszahlungen', 'Acomptes', 'Acconti'),
  when: T(
    `10 de ${['marzo', 'junio', 'septiembre', 'diciembre'][[3, 6, 9, 12].indexOf(m)]}`,
    `10 ${['March', 'June', 'September', 'December'][[3, 6, 9, 12].indexOf(m)]}`,
    `10. ${['März', 'Juni', 'September', 'Dezember'][[3, 6, 9, 12].indexOf(m)]}`,
    `10 ${['mars', 'juin', 'septembre', 'décembre'][[3, 6, 9, 12].indexOf(m)]}`,
    `10 ${['marzo', 'giugno', 'settembre', 'dicembre'][[3, 6, 9, 12].indexOf(m)]}`,
  ),
  what: T(
    'Pagos a cuenta del impuesto sobre la renta o de sociedades (Einkommensteuer, Körperschaftsteuer)',
    'Income tax or corporate tax prepayments (Einkommensteuer, Körperschaftsteuer)',
    'Vorauszahlungen zur Einkommen- oder Körperschaftsteuer',
    'Acomptes d’impôt sur le revenu ou sur les sociétés (Einkommensteuer, Körperschaftsteuer)',
    'Acconti dell’imposta sul reddito o sulle società (Einkommensteuer, Körperschaftsteuer)',
  ),
  need: T(
    'Nada: el importe lo fija Hacienda en su liquidación.',
    'Nothing: the tax office sets the amount in its assessment.',
    'Nichts: Den Betrag legt das Finanzamt im Bescheid fest.',
    'Rien : le montant est fixé par l’administration dans son avis.',
    'Niente: l’importo lo fissa l’ufficio delle imposte nell’avviso.',
  ),
});

const trade = (id: string, m: number): FiscalEvent => ({
  id,
  cat: 'pay',
  minor: true,
  month: m,
  rule: { type: 'fixed', m, d: 15, shift: true },
  short: T(
    'Impuesto industrial',
    'Trade tax',
    'Gewerbesteuer',
    'Taxe professionnelle',
    'Imposta sul commercio',
  ),
  when: T(
    `15 de ${['febrero', 'mayo', 'agosto', 'noviembre'][[2, 5, 8, 11].indexOf(m)]}`,
    `15 ${['February', 'May', 'August', 'November'][[2, 5, 8, 11].indexOf(m)]}`,
    `15. ${['Februar', 'Mai', 'August', 'November'][[2, 5, 8, 11].indexOf(m)]}`,
    `15 ${['février', 'mai', 'août', 'novembre'][[2, 5, 8, 11].indexOf(m)]}`,
    `15 ${['febbraio', 'maggio', 'agosto', 'novembre'][[2, 5, 8, 11].indexOf(m)]}`,
  ),
  what: T(
    'Pago a cuenta del impuesto industrial al municipio (Gewerbesteuer)',
    'Trade tax prepayment to the municipality (Gewerbesteuer)',
    'Gewerbesteuer-Vorauszahlung an die Gemeinde',
    'Acompte de taxe professionnelle à la commune (Gewerbesteuer)',
    'Acconto dell’imposta sul commercio al comune (Gewerbesteuer)',
  ),
  need: T(
    'Nada: el importe lo fija el municipio.',
    'Nothing: the municipality sets the amount.',
    'Nichts: Den Betrag legt die Gemeinde fest.',
    'Rien : le montant est fixé par la commune.',
    'Niente: l’importo lo fissa il comune.',
  ),
});

export const events: FiscalEvent[] = [
  // VAT: quarterly Umsatzsteuer-Voranmeldung, on the 10th after the quarter (monthly if the previous
  // year's VAT exceeded €9,000).
  vat(
    'de-vat-q4',
    1,
    Q4,
    books(
      'octubre a diciembre',
      'October to December',
      'Oktober bis Dezember',
      'octobre à décembre',
      'ottobre-dicembre',
    ),
  ),
  vat(
    'de-vat-q1',
    4,
    Q1,
    books(
      'enero a marzo',
      'January to March',
      'Januar bis März',
      'janvier à mars',
      'gennaio-marzo',
    ),
  ),
  vat(
    'de-vat-q2',
    7,
    Q2,
    books('abril a junio', 'April to June', 'April bis Juni', 'avril à juin', 'aprile-giugno'),
  ),
  vat(
    'de-vat-q3',
    10,
    Q3,
    books(
      'julio a septiembre',
      'July to September',
      'Juli bis September',
      'juillet à septembre',
      'luglio-settembre',
    ),
  ),

  // Taxes: annual returns and publication of accounts.
  {
    id: 'de-returns',
    cat: 'tax',
    month: 7,
    rule: { type: 'fixed', m: 7, d: 31, shift: true },
    short: T(
      'Declaraciones anuales',
      'Annual returns',
      'Jahreserklärungen',
      'Déclarations annuelles',
      'Dichiarazioni annuali',
    ),
    when: T(
      'Hasta el 31 de julio (con asesor fiscal, finales de febrero del año siguiente)',
      'By 31 July (with a tax adviser, end of February of the following year)',
      'Bis 31. Juli (mit Steuerberatung Ende Februar des übernächsten Jahres)',
      'Jusqu’au 31 juillet (avec un conseiller fiscal, fin février de l’année suivante)',
      'Entro il 31 luglio (con un consulente fiscale, fine febbraio dell’anno successivo)',
    ),
    what: T(
      'Declaraciones anuales del año anterior: IVA, renta o sociedades e impuesto industrial',
      'Annual returns for the previous year: VAT, income or corporate tax and trade tax',
      'Jahreserklärungen für das Vorjahr: Umsatzsteuer, Einkommen- oder Körperschaftsteuer und Gewerbesteuer',
      'Déclarations annuelles de l’année précédente : TVA, impôt sur le revenu ou sur les sociétés et taxe professionnelle',
      'Dichiarazioni annuali dell’anno precedente: IVA, imposta sul reddito o sulle società e imposta sul commercio',
    ),
    need: T(
      'El cierre del año y tus datos personales, si eres autónomo.',
      'The year-end closing and your personal details, if you are self-employed.',
      'Den Jahresabschluss und, wenn du selbständig bist, deine persönlichen Angaben.',
      'La clôture de l’exercice et, si vous êtes indépendant, vos données personnelles.',
      'La chiusura dell’anno e, se sei autonomo, i tuoi dati personali.',
    ),
  },
  {
    id: 'de-disclosure',
    cat: 'tax',
    month: 12,
    rule: { type: 'fixed', m: 12, d: 31, shift: false },
    short: T(
      'Publicación de cuentas',
      'Accounts filing',
      'Offenlegung',
      'Publication des comptes',
      'Deposito del bilancio',
    ),
    when: T(
      '12 meses tras el cierre: 31 de diciembre',
      '12 months after year end: 31 December',
      '12 Monate nach Geschäftsjahresende: 31. Dezember',
      '12 mois après la clôture : 31 décembre',
      '12 mesi dopo la chiusura: 31 dicembre',
    ),
    what: T(
      'Publicación de las cuentas anuales de la GmbH en el Registro de Empresas (Unternehmensregister)',
      'Filing the GmbH’s annual accounts with the Company Register (Unternehmensregister)',
      'Offenlegung des Jahresabschlusses der GmbH im Unternehmensregister',
      'Publication des comptes annuels de la GmbH au registre des entreprises (Unternehmensregister)',
      'Pubblicazione del bilancio della GmbH nel registro delle imprese (Unternehmensregister)',
    ),
    need: T(
      'Las cuentas anuales aprobadas.',
      'The approved annual accounts.',
      'Den festgestellten Jahresabschluss.',
      'Les comptes annuels approuvés.',
      'Il bilancio approvato.',
    ),
  },

  // Payments: income or corporate tax prepayments (tax office) and trade tax (municipality).
  trade('de-trade-feb', 2),
  prepay('de-prepay-mar', 3),
  trade('de-trade-may', 5),
  prepay('de-prepay-jun', 6),
  trade('de-trade-aug', 8),
  prepay('de-prepay-sep', 9),
  trade('de-trade-nov', 11),
  prepay('de-prepay-dec', 12),

  // Payroll: annual certificates, monthly withholding and contributions.
  {
    id: 'de-wage-certificates',
    cat: 'payroll',
    month: 2,
    rule: { type: 'monthEnd', m: 2, shift: true },
    short: T(
      'Certificados de salario',
      'Wage tax certificates',
      'Lohnsteuerbescheinigungen',
      'Certificats de salaire',
      'Certificati salariali',
    ),
    when: T(
      'Hasta finales de febrero',
      'By the end of February',
      'Bis Ende Februar',
      'Jusqu’à fin février',
      'Entro fine febbraio',
    ),
    what: T(
      'Certificados anuales de retenciones (Lohnsteuerbescheinigung) de cada empleado a Hacienda',
      'Annual wage tax certificates (Lohnsteuerbescheinigung) for each employee to the tax office',
      'Elektronische Lohnsteuerbescheinigungen aller Mitarbeitenden an das Finanzamt',
      'Certificats annuels de retenue sur salaire (Lohnsteuerbescheinigung) de chaque salarié à l’administration',
      'Certificati annuali delle ritenute (Lohnsteuerbescheinigung) di ogni dipendente all’ufficio delle imposte',
    ),
    need: T(
      'Nada nuevo: salen de las nóminas que ya llevamos.',
      'Nothing new: they come from the payroll we already run.',
      'Nichts Neues: Sie entstehen aus den Löhnen, die wir schon führen.',
      'Rien de nouveau : ils découlent des salaires que nous gérons déjà.',
      'Niente di nuovo: derivano dalle paghe che già gestiamo.',
    ),
  },
  {
    id: 'de-wage-tax',
    cat: 'payroll',
    recurring: true,
    month: 0,
    short: T('Retenciones', 'Wage tax', 'Lohnsteuer', 'Retenue sur salaire', 'Ritenute'),
    when: T(
      'Cada mes, hasta el día 10 del mes siguiente',
      'Every month, by the 10th of the following month',
      'Jeden Monat bis zum 10. des Folgemonats',
      'Chaque mois, jusqu’au 10 du mois suivant',
      'Ogni mese, entro il 10 del mese successivo',
    ),
    what: T(
      'Declaración y pago de las retenciones de salario (Lohnsteuer-Anmeldung; trimestral si son pocas)',
      'Wage tax return and payment (Lohnsteuer-Anmeldung; quarterly if the amount is small)',
      'Lohnsteuer-Anmeldung und Zahlung (vierteljährlich bei geringer Lohnsteuer)',
      'Déclaration et paiement des retenues sur salaire (Lohnsteuer-Anmeldung ; trimestrielle si elles sont faibles)',
      'Dichiarazione e pagamento delle ritenute sui salari (Lohnsteuer-Anmeldung; trimestrale se sono poche)',
    ),
    need: T(
      'Las altas, bajas y cambios del mes.',
      'The month’s hires, leavers and changes.',
      'Die Ein- und Austritte und Änderungen des Monats.',
      'Les entrées, sorties et changements du mois.',
      'Assunzioni, cessazioni e variazioni del mese.',
    ),
  },
  {
    id: 'de-social-security',
    cat: 'payroll',
    recurring: true,
    month: 0,
    short: T(
      'Seguridad Social',
      'Social security',
      'Sozialversicherung',
      'Sécurité sociale',
      'Previdenza',
    ),
    when: T(
      'Cada mes, el antepenúltimo día bancario hábil',
      'Every month, on the third-to-last banking day',
      'Jeden Monat am drittletzten Bankarbeitstag',
      'Chaque mois, l’antépénultième jour ouvré bancaire',
      'Ogni mese, il terzultimo giorno lavorativo bancario',
    ),
    what: T(
      'Cotizaciones a la Seguridad Social del mes en curso',
      'Social security contributions for the current month',
      'Gesamtsozialversicherungsbeiträge des laufenden Monats',
      'Cotisations de sécurité sociale du mois en cours',
      'Contributi previdenziali del mese in corso',
    ),
    need: T(
      'Nada: las calculamos con las nóminas.',
      'Nothing: we calculate them with the payroll.',
      'Nichts: Wir berechnen sie mit den Löhnen.',
      'Rien : nous les calculons avec les salaires.',
      'Niente: li calcoliamo con le paghe.',
    ),
  },
];
