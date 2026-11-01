import type { FiscalEvent } from './types';

/**
 * Francia: sociedad sujeta al IS (SAS, SARL) con ejercicio igual al año natural, en París. Plazos
 * comprobados el 01-11-2026: acomptes de IS el 15 de marzo, junio, septiembre y diciembre, y solde el
 * 15 del cuarto mes tras el cierre (BOI-IS-DECLA-20-10, art. 1668 CGI); liasse fiscale el 2.º día
 * hábil tras el 1 de mayo, 15 días más por vía telemática (impots.gouv.fr); CA3 entre el 15 y el 24
 * según la empresa (impots.gouv.fr, calendrier fiscal); CFE el 15 de diciembre; DSN el 5 o el 15. Si un
 * pago vence en sábado, domingo o festivo, pasa al siguiente día hábil (art. 199-0 anexo IV CGI). El
 * régimen simplificado de IVA desaparece el 1 de enero de 2027 (art. 38 Ley de Finanzas 2025).
 */
type T5 = { es: string; en: string; de: string; fr: string; it: string };
const T = (es: string, en: string, de: string, fr: string, it: string): T5 => ({
  es,
  en,
  de,
  fr,
  it,
});

const months: Record<number, T5> = {
  3: T('marzo', 'March', 'März', 'mars', 'marzo'),
  6: T('junio', 'June', 'Juni', 'juin', 'giugno'),
  9: T('septiembre', 'September', 'September', 'septembre', 'settembre'),
  12: T('diciembre', 'December', 'Dezember', 'décembre', 'dicembre'),
};

const advance = (id: string, m: number): FiscalEvent => ({
  id,
  cat: 'pay',
  month: m,
  rule: { type: 'fixed', m, d: 15, shift: true },
  short: T(
    'Pago a cuenta del IS',
    'CIT instalment',
    'KSt-Vorauszahlung',
    'Acompte d’IS',
    'Acconto IS',
  ),
  when: T(
    `15 de ${months[m].es}`,
    `15 ${months[m].en}`,
    `15. ${months[m].de}`,
    `15 ${months[m].fr}`,
    `15 ${months[m].it}`,
  ),
  what: T(
    'Pago a cuenta del impuesto sobre sociedades (acompte d’IS)',
    'Corporate income tax instalment (acompte d’IS)',
    'Vorauszahlung zur Körperschaftsteuer (acompte d’IS)',
    'Acompte d’impôt sur les sociétés',
    'Acconto dell’imposta sulle società (acompte d’IS)',
  ),
  need: T(
    'Nada: lo calculamos con el resultado del último ejercicio. Si el impuesto no llega a 3000 €, no hay pagos a cuenta.',
    'Nothing: we calculate it from last year’s profit. If the tax is below €3,000, no instalments are due.',
    'Nichts: Wir berechnen sie aus dem letzten Ergebnis. Liegt die Steuer unter 3000 €, entfallen die Vorauszahlungen.',
    'Rien : nous le calculons sur le dernier résultat. Si l’impôt ne dépasse pas 3000 €, aucun acompte n’est dû.',
    'Niente: lo calcoliamo sull’ultimo risultato. Se l’imposta non supera 3000 €, gli acconti non sono dovuti.',
  ),
});

export const events: FiscalEvent[] = [
  // IVA: CA3 mensual (o trimestral) entre el 15 y el 24; el día exacto depende de cada empresa.
  {
    id: 'fr-vat',
    cat: 'vat',
    recurring: true,
    month: 0,
    short: T('IVA (CA3)', 'VAT (CA3)', 'MwSt. (CA3)', 'TVA (CA3)', 'IVA (CA3)'),
    when: T(
      'Cada mes o trimestre, entre el 15 y el 24 del mes siguiente (el día exacto depende de tu empresa)',
      'Every month or quarter, between the 15th and 24th of the following month (the exact day depends on your company)',
      'Jeden Monat oder jedes Quartal, zwischen dem 15. und 24. des Folgemonats (der genaue Tag hängt von deinem Unternehmen ab)',
      'Chaque mois ou trimestre, entre le 15 et le 24 du mois suivant (le jour exact dépend de votre entreprise)',
      'Ogni mese o trimestre, tra il 15 e il 24 del mese successivo (il giorno esatto dipende dalla tua azienda)',
    ),
    what: T(
      'Declaración de IVA (CA3) y pago',
      'VAT return (CA3) and payment',
      'Umsatzsteuererklärung (CA3) und Zahlung',
      'Déclaration de TVA (CA3) et paiement',
      'Dichiarazione IVA (CA3) e pagamento',
    ),
    need: T(
      'Facturas y extractos del periodo antes del día 3.',
      'The period’s invoices and statements by the 3rd.',
      'Rechnungen und Auszüge des Zeitraums bis zum 3.',
      'Les factures et relevés de la période avant le 3.',
      'Fatture ed estratti del periodo entro il 3.',
    ),
  },

  // Impuestos: liasse fiscale (con su prórroga telemática) y aprobación de las cuentas.
  {
    id: 'fr-return',
    cat: 'tax',
    month: 5,
    rule: { type: 'nthWorkdayAfter', m: 5, d: 1, n: 2, shift: true },
    short: T('Liasse fiscale', 'Tax return', 'Steuererklärung', 'Liasse fiscale', 'Dichiarazione'),
    when: T(
      'Segundo día hábil tras el 1 de mayo',
      'Second working day after 1 May',
      'Zweiter Werktag nach dem 1. Mai',
      'Deuxième jour ouvré suivant le 1er mai',
      'Secondo giorno lavorativo dopo il 1° maggio',
    ),
    what: T(
      'Declaración anual del impuesto sobre sociedades (liasse fiscale 2065) y, en el régimen simplificado de IVA, la declaración anual (CA12)',
      'Annual corporate income tax return (liasse fiscale 2065) and, under the simplified VAT scheme, the annual VAT return (CA12)',
      'Jährliche Körperschaftsteuererklärung (liasse fiscale 2065) und, im vereinfachten Umsatzsteuerverfahren, die Jahreserklärung (CA12)',
      'Déclaration de résultats (liasse fiscale 2065) et, au régime simplifié de TVA, la déclaration annuelle CA12',
      'Dichiarazione annuale dell’imposta sulle società (liasse fiscale 2065) e, nel regime IVA semplificato, la dichiarazione annuale (CA12)',
    ),
    need: T(
      'El cierre del año: inventario, facturas pendientes y extractos de diciembre.',
      'The year-end closing: inventory, open invoices and December statements.',
      'Den Jahresabschluss: Inventar, offene Rechnungen und Dezemberauszüge.',
      'La clôture de l’exercice : inventaire, factures en attente et relevés de décembre.',
      'La chiusura dell’anno: inventario, fatture aperte ed estratti di dicembre.',
    ),
  },
  {
    id: 'fr-return-online',
    cat: 'tax',
    extends: 'fr-return',
    month: 5,
    rule: { type: 'nthWorkdayAfter', m: 5, d: 1, n: 2, plusDays: 15, shift: true },
    short: T(
      'Por vía telemática',
      'Filed online',
      'Elektronisch',
      'Par télétransmission',
      'Per via telematica',
    ),
    when: T(
      '15 días más por vía telemática',
      '15 more days when filed online',
      '15 Tage mehr bei elektronischer Übermittlung',
      '15 jours de plus par télétransmission',
      '15 giorni in più per via telematica',
    ),
    what: T(
      'Plazo de la liasse fiscale presentada por vía telemática (EDI)',
      'Deadline for the liasse fiscale filed online (EDI)',
      'Frist für die elektronisch übermittelte liasse fiscale (EDI)',
      'Délai de la liasse fiscale télétransmise (EDI)',
      'Termine della liasse fiscale trasmessa per via telematica (EDI)',
    ),
    need: T(
      'Nada más: la presentamos nosotros.',
      'Nothing more: we file it.',
      'Nichts weiter: Wir reichen sie ein.',
      'Rien de plus : nous la déposons.',
      'Nient’altro: la presentiamo noi.',
    ),
  },
  {
    id: 'fr-accounts',
    cat: 'tax',
    month: 6,
    rule: { type: 'fixed', m: 6, d: 30, shift: false },
    short: T(
      'Cuentas anuales',
      'Annual accounts',
      'Jahresabschluss',
      'Comptes annuels',
      'Bilancio',
    ),
    when: T(
      'Seis meses tras el cierre: 30 de junio',
      'Six months after year end: 30 June',
      'Sechs Monate nach Geschäftsjahresende: 30. Juni',
      'Six mois après la clôture : 30 juin',
      'Sei mesi dopo la chiusura: 30 giugno',
    ),
    what: T(
      'Aprobación de las cuentas anuales por los socios (en una SAS, en el plazo de sus estatutos, casi siempre el mismo) y depósito en el registro en el mes siguiente',
      'Shareholders approve the annual accounts (in an SAS, within the period set by its articles, almost always the same) and file them with the registry within a month',
      'Feststellung des Jahresabschlusses durch die Gesellschafter (bei einer SAS in der Frist der Satzung, fast immer dieselbe) und Hinterlegung beim Register im Folgemonat',
      'Approbation des comptes annuels par les associés (en SAS, dans le délai des statuts, presque toujours le même), puis dépôt au greffe dans le mois',
      'Approvazione del bilancio da parte dei soci (in una SAS, nel termine dello statuto, quasi sempre lo stesso) e deposito nel registro entro il mese successivo',
    ),
    need: T(
      'Tu visto bueno a las cuentas que preparamos.',
      'Your sign-off on the accounts we prepare.',
      'Dein Okay zum Abschluss, den wir erstellen.',
      'Votre accord sur les comptes que nous préparons.',
      'Il tuo via libera al bilancio che prepariamo.',
    ),
  },

  // Pagos: acomptes y solde del IS, y la CFE.
  advance('fr-is-mar', 3),
  {
    id: 'fr-is-balance',
    cat: 'pay',
    month: 5,
    rule: { type: 'fixed', m: 5, d: 15, shift: true },
    short: T('Liquidación del IS', 'CIT balance', 'KSt-Abschluss', 'Solde d’IS', 'Saldo IS'),
    when: T(
      '15 del cuarto mes tras el cierre: 15 de mayo',
      '15th of the fourth month after year end: 15 May',
      '15. des vierten Monats nach Geschäftsjahresende: 15. Mai',
      '15 du quatrième mois suivant la clôture : 15 mai',
      '15 del quarto mese dopo la chiusura: 15 maggio',
    ),
    what: T(
      'Pago de la liquidación del impuesto sobre sociedades del año anterior (solde d’IS)',
      'Payment of the previous year’s corporate income tax balance (solde d’IS)',
      'Zahlung der Körperschaftsteuer-Abschlusszahlung des Vorjahres (solde d’IS)',
      'Paiement du solde de l’impôt sur les sociétés de l’exercice précédent',
      'Pagamento del saldo dell’imposta sulle società dell’anno precedente (solde d’IS)',
    ),
    need: T(
      'Nada: sale del cierre que ya hemos hecho.',
      'Nothing: it comes from the closing we have done.',
      'Nichts: Sie ergibt sich aus dem Abschluss, den wir erstellt haben.',
      'Rien : il découle de la clôture que nous avons faite.',
      'Niente: deriva dalla chiusura che abbiamo già fatto.',
    ),
  },
  advance('fr-is-jun', 6),
  advance('fr-is-sep', 9),
  advance('fr-is-dec', 12),
  {
    id: 'fr-cfe',
    cat: 'pay',
    // Mismo día que el último acompte de IS: marca menor para que las etiquetas no se pisen.
    minor: true,
    month: 12,
    rule: { type: 'fixed', m: 12, d: 15, shift: true },
    short: T('CFE', 'CFE', 'CFE', 'CFE', 'CFE'),
    when: T('15 de diciembre', '15 December', '15. Dezember', '15 décembre', '15 dicembre'),
    what: T(
      'Impuesto local de empresas (cotisation foncière des entreprises, CFE)',
      'Local business tax (cotisation foncière des entreprises, CFE)',
      'Lokale Unternehmenssteuer (cotisation foncière des entreprises, CFE)',
      'Cotisation foncière des entreprises (CFE)',
      'Imposta locale sulle imprese (cotisation foncière des entreprises, CFE)',
    ),
    need: T(
      'Nada: el aviso llega a tu espacio profesional de impots.gouv.fr.',
      'Nothing: the notice arrives in your professional account on impots.gouv.fr.',
      'Nichts: Der Bescheid kommt in dein Geschäftskonto auf impots.gouv.fr.',
      'Rien : l’avis arrive dans votre espace professionnel sur impots.gouv.fr.',
      'Niente: l’avviso arriva nel tuo spazio professionale su impots.gouv.fr.',
    ),
  },

  // Nóminas: DSN mensual con el pago de las cotizaciones.
  {
    id: 'fr-dsn',
    cat: 'payroll',
    recurring: true,
    month: 0,
    short: T('DSN', 'DSN', 'DSN', 'DSN', 'DSN'),
    when: T(
      'Cada mes, el día 5 (50 empleados o más) o el 15 (menos de 50)',
      'Every month, on the 5th (50 or more employees) or the 15th (fewer than 50)',
      'Jeden Monat am 5. (ab 50 Mitarbeitenden) oder am 15. (unter 50)',
      'Chaque mois, le 5 (50 salariés ou plus) ou le 15 (moins de 50)',
      'Ogni mese, il 5 (50 dipendenti o più) o il 15 (meno di 50)',
    ),
    what: T(
      'Declaración social nominativa (DSN) y pago de las cotizaciones del mes anterior',
      'Monthly payroll declaration (DSN) and payment of the previous month’s contributions',
      'Monatliche Sozialmeldung (DSN) und Zahlung der Beiträge des Vormonats',
      'Déclaration sociale nominative (DSN) et paiement des cotisations du mois précédent',
      'Dichiarazione sociale nominativa (DSN) e pagamento dei contributi del mese precedente',
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
