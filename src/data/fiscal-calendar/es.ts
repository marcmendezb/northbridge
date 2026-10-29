import type { FiscalEvent } from './types';

/**
 * España: sociedad o autónomo con ejercicio igual al año natural. Plazos comprobados el 29-10-2026 en
 * el Calendario del contribuyente 2026 de la Agencia Tributaria (sede.agenciatributaria.gob.es) y en
 * el Reglamento General de Recaudación de la Seguridad Social (art. 56). Si el último día es inhábil
 * (sábado, domingo o festivo nacional), el plazo pasa al siguiente día hábil (`shift`). Ver DECISIONES.md.
 */
const T = (es: string, en: string, de: string, fr: string, it: string) => ({ es, en, de, fr, it });

const vat = (
  id: string,
  m: number,
  d: number,
  quarter: ReturnType<typeof T>,
  when: ReturnType<typeof T>,
  need: ReturnType<typeof T>,
  annual = false,
): FiscalEvent => ({
  id,
  cat: 'vat',
  month: m,
  rule: { type: 'fixed', m, d, shift: true },
  short: quarter,
  when,
  what: annual
    ? T(
        `IVA del ${quarter.es} (modelo 303) y resumen anual (modelo 390)`,
        `VAT for ${quarter.en} (form 303) and annual summary (form 390)`,
        `MWST ${quarter.de} (Modell 303) und Jahreszusammenfassung (Modell 390)`,
        `TVA du ${quarter.fr} (modèle 303) et récapitulatif annuel (modèle 390)`,
        `IVA del ${quarter.it} (modello 303) e riepilogo annuale (modello 390)`,
      )
    : T(
        `IVA del ${quarter.es} (modelo 303)`,
        `VAT for ${quarter.en} (form 303)`,
        `MWST ${quarter.de} (Modell 303)`,
        `TVA du ${quarter.fr} (modèle 303)`,
        `IVA del ${quarter.it} (modello 303)`,
      ),
  need,
});

const Q4 = T('4.º trimestre', 'Q4', '4. Quartal', '4e trimestre', '4° trimestre');
const Q1 = T('1.er trimestre', 'Q1', '1. Quartal', '1er trimestre', '1° trimestre');
const Q2 = T('2.º trimestre', 'Q2', '2. Quartal', '2e trimestre', '2° trimestre');
const Q3 = T('3.er trimestre', 'Q3', '3. Quartal', '3e trimestre', '3° trimestre');

const until20 = (es: string, en: string, de: string, fr: string, it: string) =>
  T(
    `Del 1 al 20 de ${es}`,
    `1 to 20 ${en}`,
    `1. bis 20. ${de}`,
    `Du 1er au 20 ${fr}`,
    `Dal 1 al 20 ${it}`,
  );
const APR = until20('abril', 'April', 'April', 'avril', 'aprile');
const JUL = until20('julio', 'July', 'Juli', 'juillet', 'luglio');
const OCT = until20('octubre', 'October', 'Oktober', 'octobre', 'ottobre');
const DEC = until20('diciembre', 'December', 'Dezember', 'décembre', 'dicembre');
const JAN20 = until20('enero', 'January', 'Januar', 'janvier', 'gennaio');
const JAN30 = T(
  'Del 1 al 30 de enero',
  '1 to 30 January',
  '1. bis 30. Januar',
  'Du 1er au 30 janvier',
  'Dal 1 al 30 gennaio',
);

const invoices = (
  es: string,
  en: string,
  de: string,
  fr: string,
  it: string,
  by: ReturnType<typeof T>,
) =>
  T(
    `Facturas y extractos de ${es} antes del ${by.es}.`,
    `Invoices and statements for ${en} by ${by.en}.`,
    `Rechnungen und Auszüge ${de} bis ${by.de}.`,
    `Factures et relevés de ${fr} avant le ${by.fr}.`,
    `Fatture ed estratti da ${it} entro il ${by.it}.`,
  );
const by = (es: string, en: string, de: string, fr: string, it: string) => T(es, en, de, fr, it);

const fromBooks = T(
  'Nada: los calculamos con tu contabilidad.',
  'Nothing: we calculate them from your books.',
  'Nichts: Wir berechnen sie aus deiner Buchhaltung.',
  'Rien : nous les calculons à partir de votre comptabilité.',
  'Niente: li calcoliamo dalla tua contabilità.',
);
const fromPayroll = T(
  'Nada nuevo: salen de las nóminas y facturas que ya llevamos.',
  'Nothing new: they come from the payroll and invoices we already handle.',
  'Nichts Neues: Sie entstehen aus den Löhnen und Rechnungen, die wir schon führen.',
  'Rien de nouveau : elles découlent des salaires et factures que nous gérons déjà.',
  'Niente di nuovo: derivano dalle paghe e dalle fatture che già gestiamo.',
);
const withholding = (
  id: string,
  m: number,
  quarter: ReturnType<typeof T>,
  when: ReturnType<typeof T>,
): FiscalEvent => ({
  id,
  cat: 'payroll',
  month: m,
  rule: { type: 'fixed', m, d: 20, shift: true },
  short: T('Retenciones', 'Withholdings', 'Quellensteuer', 'Retenues', 'Ritenute'),
  when,
  what: T(
    `Retenciones del ${quarter.es}: trabajo y profesionales (modelo 111) y alquileres (modelo 115)`,
    `Withholdings for ${quarter.en}: employees and professionals (form 111) and rents (form 115)`,
    `Einbehaltene Steuern ${quarter.de}: Löhne und Freiberufler (Modell 111) und Mieten (Modell 115)`,
    `Retenues du ${quarter.fr} : salariés et professionnels (modèle 111) et loyers (modèle 115)`,
    `Ritenute del ${quarter.it}: lavoro e professionisti (modello 111) e affitti (modello 115)`,
  ),
  need: fromPayroll,
});
const instalment = (
  id: string,
  m: number,
  d: number,
  when: ReturnType<typeof T>,
  what: ReturnType<typeof T>,
): FiscalEvent => ({
  id,
  cat: 'pay',
  month: m,
  rule: { type: 'fixed', m, d, shift: true },
  short: T('Pago fraccionado', 'Instalment', 'Vorauszahlung', 'Acompte', 'Acconto'),
  when,
  what,
  need: fromBooks,
});
const BOTH = (q: ReturnType<typeof T>) =>
  T(
    `Pagos fraccionados del ${q.es}: sociedades (modelo 202) y autónomos (modelo 130)`,
    `Instalments for ${q.en}: companies (form 202) and self-employed (form 130)`,
    `Vorauszahlungen ${q.de}: Gesellschaften (Modell 202) und Selbständige (Modell 130)`,
    `Acomptes du ${q.fr} : sociétés (modèle 202) et indépendants (modèle 130)`,
    `Acconti del ${q.it}: società (modello 202) e autonomi (modello 130)`,
  );
const SELF = (q: ReturnType<typeof T>) =>
  T(
    `Pago fraccionado del ${q.es} de autónomos (modelo 130)`,
    `Self-employed instalment for ${q.en} (form 130)`,
    `Vorauszahlung der Selbständigen ${q.de} (Modell 130)`,
    `Acompte des indépendants du ${q.fr} (modèle 130)`,
    `Acconto degli autonomi del ${q.it} (modello 130)`,
  );

export const events: FiscalEvent[] = [
  // IVA (modelo 303): del 1 al 20 del mes siguiente al trimestre; el 4.º, hasta el 30 de enero.
  vat(
    'es-vat-q4',
    1,
    30,
    Q4,
    JAN30,
    invoices(
      'octubre a diciembre',
      'October to December',
      'Oktober bis Dezember',
      'octobre à décembre',
      'ottobre a dicembre',
      by('15 de enero', '15 January', '15. Januar', '15 janvier', '15 gennaio'),
    ),
    true,
  ),
  vat(
    'es-vat-q1',
    4,
    20,
    Q1,
    APR,
    invoices(
      'enero a marzo',
      'January to March',
      'Januar bis März',
      'janvier à mars',
      'gennaio a marzo',
      by('5 de abril', '5 April', '5. April', '5 avril', '5 aprile'),
    ),
  ),
  vat(
    'es-vat-q2',
    7,
    20,
    Q2,
    JUL,
    invoices(
      'abril a junio',
      'April to June',
      'April bis Juni',
      'avril à juin',
      'aprile a giugno',
      by('5 de julio', '5 July', '5. Juli', '5 juillet', '5 luglio'),
    ),
  ),
  vat(
    'es-vat-q3',
    10,
    20,
    Q3,
    OCT,
    invoices(
      'julio a septiembre',
      'July to September',
      'Juli bis September',
      'juillet à septembre',
      'luglio a settembre',
      by('5 de octubre', '5 October', '5. Oktober', '5 octobre', '5 ottobre'),
    ),
  ),

  // Impuestos: operaciones con terceros, renta y sociedades.
  {
    id: 'es-347',
    cat: 'tax',
    month: 2,
    rule: { type: 'monthEnd', m: 2, shift: true },
    short: T('Modelo 347', 'Form 347', 'Modell 347', 'Modèle 347', 'Modello 347'),
    when: T('Durante febrero', 'During February', 'Im Februar', 'En février', 'A febbraio'),
    what: T(
      'Declaración anual de operaciones con terceras personas (modelo 347)',
      'Annual return of transactions with third parties (form 347)',
      'Jährliche Meldung der Geschäfte mit Dritten (Modell 347)',
      'Déclaration annuelle des opérations avec des tiers (modèle 347)',
      'Dichiarazione annuale delle operazioni con terzi (modello 347)',
    ),
    need: T(
      'Nada nuevo: sale de la contabilidad del año.',
      'Nothing new: it comes from the year’s books.',
      'Nichts Neues: Sie entsteht aus der Buchhaltung des Jahres.',
      'Rien de nouveau : elle découle de la comptabilité de l’année.',
      'Niente di nuovo: deriva dalla contabilità dell’anno.',
    ),
  },
  {
    id: 'es-income',
    cat: 'tax',
    month: 6,
    rule: { type: 'fixed', m: 6, d: 30, shift: true },
    short: T('Renta', 'Income tax', 'Einkommensteuer', 'Impôt sur le revenu', 'Redditi'),
    when: T(
      'Hasta el 30 de junio',
      'By 30 June',
      'Bis 30. Juni',
      'Jusqu’au 30 juin',
      'Entro il 30 giugno',
    ),
    what: T(
      'Declaración de la renta del año anterior (modelo 100), también autónomos',
      'Personal income tax return for the previous year (form 100), self-employed included',
      'Einkommensteuererklärung für das Vorjahr (Modell 100), auch Selbständige',
      'Déclaration d’impôt sur le revenu de l’année précédente (modèle 100), indépendants compris',
      'Dichiarazione dei redditi dell’anno precedente (modello 100), anche autonomi',
    ),
    need: T(
      'Si eres autónomo, el cierre de tu año contable.',
      'If you are self-employed, the closing of your accounting year.',
      'Wenn du selbständig bist, den Abschluss deines Geschäftsjahres.',
      'Si vous êtes indépendant, la clôture de votre exercice.',
      'Se sei autonomo, la chiusura del tuo anno contabile.',
    ),
  },
  {
    id: 'es-corporate',
    cat: 'tax',
    month: 7,
    rule: { type: 'fixed', m: 7, d: 25, shift: true },
    short: T(
      'Sociedades',
      'Corporate tax',
      'Körperschaftsteuer',
      'Impôt sur les sociétés',
      'Imposta sulle società',
    ),
    when: T(
      '25 días tras los seis meses del cierre: hasta el 25 de julio',
      '25 days after six months from year end: by 25 July',
      '25 Tage nach sechs Monaten ab Abschluss: bis 25. Juli',
      '25 jours après six mois suivant la clôture : jusqu’au 25 juillet',
      '25 giorni dopo sei mesi dalla chiusura: entro il 25 luglio',
    ),
    what: T(
      'Impuesto sobre Sociedades del año anterior (modelo 200)',
      'Corporate income tax for the previous year (form 200)',
      'Körperschaftsteuer für das Vorjahr (Modell 200)',
      'Impôt sur les sociétés de l’année précédente (modèle 200)',
      'Imposta sulle società dell’anno precedente (modello 200)',
    ),
    need: T(
      'Las cuentas anuales aprobadas.',
      'The approved annual accounts.',
      'Die genehmigte Jahresrechnung.',
      'Les comptes annuels approuvés.',
      'Il bilancio approvato.',
    ),
  },

  // Pagos fraccionados: sociedades (202, abril, octubre y diciembre) y autónomos (130, cada trimestre).
  instalment('es-pay-jan', 1, 30, JAN30, SELF(Q4)),
  instalment('es-pay-apr', 4, 20, APR, BOTH(Q1)),
  instalment('es-pay-jul', 7, 20, JUL, SELF(Q2)),
  instalment('es-pay-oct', 10, 20, OCT, BOTH(Q3)),
  instalment(
    'es-pay-dec',
    12,
    20,
    DEC,
    T(
      'Pago fraccionado de sociedades (modelo 202)',
      'Corporate tax instalment (form 202)',
      'Vorauszahlung der Körperschaftsteuer (Modell 202)',
      'Acompte d’impôt sur les sociétés (modèle 202)',
      'Acconto dell’imposta sulle società (modello 202)',
    ),
  ),

  // Nóminas: retenciones trimestrales (111 y 115), resúmenes anuales y Seguridad Social.
  withholding('es-wh-q4', 1, Q4, JAN20),
  withholding('es-wh-q1', 4, Q1, APR),
  withholding('es-wh-q2', 7, Q2, JUL),
  withholding('es-wh-q3', 10, Q3, OCT),
  {
    id: 'es-wh-annual',
    cat: 'payroll',
    minor: true,
    month: 1,
    rule: { type: 'fixed', m: 1, d: 31, shift: true },
    short: T(
      'Resúmenes 190 y 180',
      'Forms 190 and 180',
      'Modelle 190 und 180',
      'Modèles 190 et 180',
      'Modelli 190 e 180',
    ),
    when: T(
      'Hasta el 31 de enero',
      'By 31 January',
      'Bis 31. Januar',
      'Jusqu’au 31 janvier',
      'Entro il 31 gennaio',
    ),
    what: T(
      'Resúmenes anuales de retenciones (modelos 190 y 180)',
      'Annual withholding summaries (forms 190 and 180)',
      'Jährliche Zusammenfassungen der Quellensteuer (Modelle 190 und 180)',
      'Récapitulatifs annuels des retenues (modèles 190 et 180)',
      'Riepiloghi annuali delle ritenute (modelli 190 e 180)',
    ),
    need: fromPayroll,
  },
  {
    id: 'es-social-security',
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
      'Cada mes, dentro del mes siguiente al devengo',
      'Every month, within the month after accrual',
      'Jeden Monat, im Folgemonat',
      'Chaque mois, dans le mois suivant',
      'Ogni mese, entro il mese successivo',
    ),
    what: T(
      'Cotizaciones a la Seguridad Social de la plantilla',
      'Social security contributions for your employees',
      'Sozialversicherungsbeiträge der Mitarbeitenden',
      'Cotisations de sécurité sociale des salariés',
      'Contributi previdenziali dei dipendenti',
    ),
    need: T(
      'Las altas, bajas y cambios del mes.',
      'The month’s hires, leavers and changes.',
      'Die Ein- und Austritte und Änderungen des Monats.',
      'Les entrées, sorties et changements du mois.',
      'Assunzioni, cessazioni e variazioni del mese.',
    ),
  },
];
