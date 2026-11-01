import type { FiscalEvent } from './types';

/**
 * Italia: SRL o autónomo con ejercicio igual al año natural, en Roma. Plazos comprobados el
 * 01-11-2026 en la Agenzia delle Entrate (scadenzario y fichas): IVA trimestral por opción (volumen
 * de hasta 500 000 € en servicios y 800 000 € en otras actividades) el 16 de mayo, 20 de agosto y 16 de
 * noviembre con el 1 % de interés, y el 4.º trimestre con el saldo anual el 16 de marzo; LIPE el
 * último día del segundo mes tras el trimestre (Q2: 30 de septiembre); declaración de IVA del 1 de
 * febrero al 30 de abril; saldo y primer acconto de IRES/IRAP el último día del sexto mes (30 de
 * junio), segundo acconto el del undécimo (30 de noviembre); Redditi, IRAP y 770 el 31 de octubre; CU
 * el 16 de marzo. Si el plazo cae en sábado o festivo, pasa al siguiente día hábil (art. 7 DL 70/2011).
 */
type T5 = { es: string; en: string; de: string; fr: string; it: string };
const T = (es: string, en: string, de: string, fr: string, it: string): T5 => ({
  es,
  en,
  de,
  fr,
  it,
});

const Q1 = T('1.er trimestre', 'Q1', '1. Quartal', '1er trimestre', '1° trimestre');
const Q2 = T('2.º trimestre', 'Q2', '2. Quartal', '2e trimestre', '2° trimestre');
const Q3 = T('3.er trimestre', 'Q3', '3. Quartal', '3e trimestre', '3° trimestre');
const Q4 = T('4.º trimestre', 'Q4', '4. Quartal', '4e trimestre', '4° trimestre');

const books = (es: string, en: string, de: string, fr: string, it: string) =>
  T(
    `Facturas y extractos de ${es} antes del día 3 del mes siguiente.`,
    `Invoices and statements for ${en} by the 3rd of the following month.`,
    `Rechnungen und Auszüge ${de} bis zum 3. des Folgemonats.`,
    `Factures et relevés de ${fr} avant le 3 du mois suivant.`,
    `Fatture ed estratti di ${it} entro il 3 del mese successivo.`,
  );

const vat = (id: string, m: number, d: number, q: T5, when: T5, need: T5): FiscalEvent => ({
  id,
  cat: 'vat',
  month: m,
  rule: { type: 'fixed', m, d, shift: true },
  short: q,
  when,
  what: T(
    `IVA del ${q.es}: liquidación y pago (F24), con el 1 % de interés`,
    `VAT for ${q.en}: settlement and payment (F24), plus 1% interest`,
    `Umsatzsteuer ${q.de}: Abrechnung und Zahlung (F24), mit 1 % Zinsen`,
    `TVA du ${q.fr} : liquidation et paiement (F24), avec 1 % d’intérêts`,
    `IVA del ${q.it}: liquidazione e versamento (F24), con l’1 % di interessi`,
  ),
  need,
});

const second = T(
  '16 del segundo mes tras el trimestre',
  '16th of the second month after the quarter',
  '16. des zweiten Monats nach Quartalsende',
  '16 du deuxième mois après le trimestre',
  '16 del secondo mese successivo al trimestre',
);

const lipe = (id: string, m: number, q: T5, rule: FiscalEvent['rule'], when: T5): FiscalEvent => ({
  id,
  cat: 'vat',
  minor: true,
  month: m,
  rule,
  short: T('LIPE', 'LIPE', 'LIPE', 'LIPE', 'LIPE'),
  when,
  what: T(
    `Comunicación de las liquidaciones de IVA del ${q.es} (LIPE)`,
    `Report of the VAT settlements for ${q.en} (LIPE)`,
    `Meldung der Umsatzsteuerabrechnungen ${q.de} (LIPE)`,
    `Communication des liquidations de TVA du ${q.fr} (LIPE)`,
    `Comunicazione delle liquidazioni periodiche IVA del ${q.it} (LIPE)`,
  ),
  need: T(
    'Nada nuevo: sale de las liquidaciones que ya hacemos.',
    'Nothing new: it comes from the settlements we already prepare.',
    'Nichts Neues: Sie ergibt sich aus den Abrechnungen, die wir schon machen.',
    'Rien de nouveau : elle découle des liquidations que nous faisons déjà.',
    'Niente di nuovo: deriva dalle liquidazioni che già facciamo.',
  ),
});

export const events: FiscalEvent[] = [
  // IVA: trimestral por opción, saldo anual en marzo y declaración anual hasta el 30 de abril.
  {
    id: 'it-vat-annual',
    cat: 'vat',
    month: 3,
    rule: { type: 'fixed', m: 3, d: 16, shift: true },
    short: T('Saldo IVA', 'VAT balance', 'MwSt.-Saldo', 'Solde de TVA', 'Saldo IVA'),
    when: T('16 de marzo', '16 March', '16. März', '16 mars', '16 marzo'),
    what: T(
      'Saldo del IVA del año anterior, con el 4.º trimestre si liquidas por trimestres',
      'Previous year’s VAT balance, including Q4 if you settle quarterly',
      'Umsatzsteuer-Saldo des Vorjahres, mit dem 4. Quartal bei vierteljährlicher Abrechnung',
      'Solde de TVA de l’année précédente, avec le 4e trimestre si vous liquidez par trimestre',
      'Saldo IVA dell’anno precedente, con il 4° trimestre se liquidi trimestralmente',
    ),
    need: books(
      'octubre a diciembre',
      'October to December',
      'Oktober bis Dezember',
      'octobre à décembre',
      'ottobre-dicembre',
    ),
  },
  {
    id: 'it-vat-return',
    // Declaración anual: en el carril de impuestos, junto a las demás (y lejos del IVA de mayo).
    cat: 'tax',
    month: 4,
    rule: { type: 'fixed', m: 4, d: 30, shift: true },
    short: T(
      'Declaración de IVA',
      'VAT return',
      'MwSt.-Erklärung',
      'Déclaration de TVA',
      'Dichiarazione IVA',
    ),
    when: T(
      'Del 1 de febrero al 30 de abril',
      'From 1 February to 30 April',
      'Vom 1. Februar bis 30. April',
      'Du 1er février au 30 avril',
      'Dal 1° febbraio al 30 aprile',
    ),
    what: T(
      'Declaración anual de IVA del año anterior',
      'Annual VAT return for the previous year',
      'Umsatzsteuer-Jahreserklärung für das Vorjahr',
      'Déclaration annuelle de TVA de l’année précédente',
      'Dichiarazione IVA annuale dell’anno precedente',
    ),
    need: T(
      'Nada nuevo: sale de la contabilidad del año.',
      'Nothing new: it comes from the year’s books.',
      'Nichts Neues: Sie ergibt sich aus der Buchhaltung des Jahres.',
      'Rien de nouveau : elle découle de la comptabilité de l’année.',
      'Niente di nuovo: deriva dalla contabilità dell’anno.',
    ),
  },
  vat(
    'it-vat-q1',
    5,
    16,
    Q1,
    second,
    books(
      'enero a marzo',
      'January to March',
      'Januar bis März',
      'janvier à mars',
      'gennaio-marzo',
    ),
  ),
  vat(
    'it-vat-q2',
    8,
    20,
    Q2,
    T('20 de agosto', '20 August', '20. August', '20 août', '20 agosto'),
    books('abril a junio', 'April to June', 'April bis Juni', 'avril à juin', 'aprile-giugno'),
  ),
  vat(
    'it-vat-q3',
    11,
    16,
    Q3,
    second,
    books(
      'julio a septiembre',
      'July to September',
      'Juli bis September',
      'juillet à septembre',
      'luglio-settembre',
    ),
  ),
  lipe(
    'it-lipe-q4',
    2,
    Q4,
    { type: 'monthEnd', m: 2, shift: true },
    T('Finales de febrero', 'End of February', 'Ende Februar', 'Fin février', 'Fine febbraio'),
  ),
  lipe(
    'it-lipe-q1',
    5,
    Q1,
    { type: 'monthEnd', m: 5, shift: true },
    T('31 de mayo', '31 May', '31. Mai', '31 mai', '31 maggio'),
  ),
  lipe(
    'it-lipe-q2',
    9,
    Q2,
    { type: 'fixed', m: 9, d: 30, shift: true },
    T('30 de septiembre', '30 September', '30. September', '30 septembre', '30 settembre'),
  ),
  lipe(
    'it-lipe-q3',
    11,
    Q3,
    { type: 'monthEnd', m: 11, shift: true },
    T('30 de noviembre', '30 November', '30. November', '30 novembre', '30 novembre'),
  ),

  // Impuestos: declaraciones anuales.
  {
    id: 'it-returns',
    cat: 'tax',
    month: 10,
    rule: { type: 'fixed', m: 10, d: 31, shift: true },
    short: T(
      'Declaraciones anuales',
      'Annual returns',
      'Jahreserklärungen',
      'Déclarations annuelles',
      'Dichiarazioni',
    ),
    when: T(
      'Diez meses tras el cierre: 31 de octubre',
      'Ten months after year end: 31 October',
      'Zehn Monate nach Geschäftsjahresende: 31. Oktober',
      'Dix mois après la clôture : 31 octobre',
      'Dieci mesi dopo la chiusura: 31 ottobre',
    ),
    what: T(
      'Declaraciones anuales del año anterior: impuesto sobre sociedades o renta (Redditi SC o PF) e IRAP',
      'Annual returns for the previous year: corporate or income tax (Redditi SC or PF) and IRAP',
      'Jahreserklärungen für das Vorjahr: Körperschaft- oder Einkommensteuer (Redditi SC oder PF) und IRAP',
      'Déclarations annuelles de l’année précédente : impôt sur les sociétés ou sur le revenu (Redditi SC ou PF) et IRAP',
      'Dichiarazioni annuali dell’anno precedente: Redditi SC o PF e IRAP',
    ),
    need: T(
      'El cierre del año y tus datos personales, si eres autónomo.',
      'The year-end closing and your personal details, if you are self-employed.',
      'Den Jahresabschluss und, wenn du selbständig bist, deine persönlichen Angaben.',
      'La clôture de l’exercice et, si vous êtes indépendant, vos données personnelles.',
      'La chiusura dell’anno e, se sei autonomo, i tuoi dati personali.',
    ),
  },

  // Pagos: saldo y acconti de IRES (o IRPEF) e IRAP.
  {
    id: 'it-balance',
    cat: 'pay',
    month: 6,
    rule: { type: 'fixed', m: 6, d: 30, shift: true },
    short: T(
      'Saldo y 1.er acconto',
      'Balance and 1st advance',
      'Saldo und 1. Vorauszahlung',
      'Solde et 1er acompte',
      'Saldo e 1° acconto',
    ),
    when: T(
      'Último día del sexto mes tras el cierre: 30 de junio (o 30 días después, con el 0,40 %)',
      'Last day of the sixth month after year end: 30 June (or 30 days later, plus 0.40%)',
      'Letzter Tag des sechsten Monats nach Geschäftsjahresende: 30. Juni (oder 30 Tage später mit 0,40 %)',
      'Dernier jour du sixième mois après la clôture : 30 juin (ou 30 jours plus tard, avec 0,40 %)',
      'Ultimo giorno del sesto mese dopo la chiusura: 30 giugno (o 30 giorni dopo, con lo 0,40 %)',
    ),
    what: T(
      'Saldo del año anterior y primer pago a cuenta (acconto) de IRES o IRPEF e IRAP',
      'Previous year’s balance and first advance payment (acconto) of IRES or IRPEF and IRAP',
      'Saldo des Vorjahres und erste Vorauszahlung (acconto) von IRES oder IRPEF und IRAP',
      'Solde de l’année précédente et premier acompte (acconto) d’IRES ou d’IRPEF et d’IRAP',
      'Saldo dell’anno precedente e primo acconto IRES o IRPEF e IRAP',
    ),
    need: T(
      'Nada: sale del cierre que ya hemos hecho.',
      'Nothing: it comes from the closing we have done.',
      'Nichts: Er ergibt sich aus dem Abschluss, den wir erstellt haben.',
      'Rien : il découle de la clôture que nous avons faite.',
      'Niente: deriva dalla chiusura che abbiamo già fatto.',
    ),
  },
  {
    id: 'it-second-advance',
    cat: 'pay',
    month: 11,
    rule: { type: 'fixed', m: 11, d: 30, shift: true },
    short: T('2.º acconto', '2nd advance', '2. Vorauszahlung', '2e acompte', '2° acconto'),
    when: T(
      'Último día del undécimo mes tras el cierre: 30 de noviembre',
      'Last day of the eleventh month after year end: 30 November',
      'Letzter Tag des elften Monats nach Geschäftsjahresende: 30. November',
      'Dernier jour du onzième mois après la clôture : 30 novembre',
      'Ultimo giorno dell’undicesimo mese dopo la chiusura: 30 novembre',
    ),
    what: T(
      'Segundo pago a cuenta (acconto) de IRES o IRPEF e IRAP',
      'Second advance payment (acconto) of IRES or IRPEF and IRAP',
      'Zweite Vorauszahlung (acconto) von IRES oder IRPEF und IRAP',
      'Deuxième acompte (acconto) d’IRES ou d’IRPEF et d’IRAP',
      'Secondo acconto IRES o IRPEF e IRAP',
    ),
    need: T(
      'Nada: lo calculamos con la declaración del año.',
      'Nothing: we calculate it from the year’s return.',
      'Nichts: Wir berechnen sie aus der Jahreserklärung.',
      'Rien : nous le calculons à partir de la déclaration de l’année.',
      'Niente: lo calcoliamo dalla dichiarazione dell’anno.',
    ),
  },

  // Nóminas: CU, 770 y el F24 de cada mes.
  {
    id: 'it-cu',
    cat: 'payroll',
    month: 3,
    rule: { type: 'fixed', m: 3, d: 16, shift: true },
    short: T(
      'Certificazione Unica',
      'Certificazione Unica',
      'Certificazione Unica',
      'Certificazione Unica',
      'Certificazione Unica',
    ),
    when: T('16 de marzo', '16 March', '16. März', '16 mars', '16 marzo'),
    what: T(
      'Certificado anual de retenciones (Certificazione Unica) a la Agencia y a cada empleado',
      'Annual withholding certificate (Certificazione Unica) to the tax agency and each employee',
      'Jährliche Lohnsteuerbescheinigung (Certificazione Unica) an die Steuerbehörde und alle Mitarbeitenden',
      'Certificat annuel de retenues (Certificazione Unica) à l’administration et à chaque salarié',
      'Certificazione Unica all’Agenzia delle Entrate e a ogni dipendente',
    ),
    need: T(
      'Nada nuevo: sale de las nóminas que ya llevamos.',
      'Nothing new: it comes from the payroll we already run.',
      'Nichts Neues: Sie entsteht aus den Löhnen, die wir schon führen.',
      'Rien de nouveau : il découle des salaires que nous gérons déjà.',
      'Niente di nuovo: deriva dalle paghe che già gestiamo.',
    ),
  },
  {
    id: 'it-770',
    cat: 'payroll',
    month: 10,
    rule: { type: 'fixed', m: 10, d: 31, shift: true },
    short: T('Modelo 770', 'Form 770', 'Modell 770', 'Modèle 770', 'Modello 770'),
    when: T('31 de octubre', '31 October', '31. Oktober', '31 octobre', '31 ottobre'),
    what: T(
      'Declaración anual de las retenciones practicadas (modelo 770)',
      'Annual return of the tax withheld (form 770)',
      'Jahreserklärung der einbehaltenen Steuern (Modell 770)',
      'Déclaration annuelle des retenues effectuées (modèle 770)',
      'Dichiarazione dei sostituti d’imposta (modello 770)',
    ),
    need: T(
      'Nada nuevo: sale de las nóminas que ya llevamos.',
      'Nothing new: it comes from the payroll we already run.',
      'Nichts Neues: Sie entsteht aus den Löhnen, die wir schon führen.',
      'Rien de nouveau : elle découle des salaires que nous gérons déjà.',
      'Niente di nuovo: deriva dalle paghe che già gestiamo.',
    ),
  },
  {
    id: 'it-f24',
    cat: 'payroll',
    recurring: true,
    month: 0,
    short: T('F24 mensual', 'Monthly F24', 'Monatliches F24', 'F24 mensuel', 'F24 mensile'),
    when: T(
      'Cada mes, hasta el día 16',
      'Every month, by the 16th',
      'Jeden Monat bis zum 16.',
      'Chaque mois, jusqu’au 16',
      'Ogni mese, entro il 16',
    ),
    what: T(
      'Pago (F24) de las retenciones y de las cotizaciones al INPS del mes anterior',
      'Payment (F24) of the previous month’s tax withheld and INPS contributions',
      'Zahlung (F24) der einbehaltenen Steuern und der INPS-Beiträge des Vormonats',
      'Paiement (F24) des retenues et des cotisations INPS du mois précédent',
      'Versamento (F24) delle ritenute e dei contributi INPS del mese precedente',
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
