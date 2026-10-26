/** Textos de interfaz en español (tuteo, frases cortas, sin exclamaciones). Es la plantilla de forma de todos los idiomas. */
export const es = {
  brand: {
    name: 'Northbridge Advisory',
    claim: 'Tus números, bajo control.',
    promise: 'La tranquilidad de una gran firma, sin su burocracia.',
    descriptor: 'Fiduciaria y contabilidad para pymes, autónomos y startups en Zúrich.',
  },
  nav: {
    main: 'Principal',
    services: 'Servicios',
    prices: 'Precios',
    about: 'Nosotros',
    resources: 'Recursos',
    contact: 'Contacto',
    freeConsultation: 'Consulta gratuita',
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    breadcrumbs: 'Ruta de navegación',
    home: 'Inicio',
    skipToContent: 'Saltar al contenido',
    backToTop: 'Volver arriba',
    mega: {
      services: 'Servicios',
      start: 'Para empezar',
      seeAll: 'Ver todos los servicios',
      promoTitle: 'Calcula tu precio en 1 minuto',
      promoText: 'Estimación orientativa, sin compromiso.',
      toggle: 'Servicios, mostrar el menú',
    },
  },
  lang: {
    label: 'Idioma',
    switch: 'Cambiar idioma',
  },
  cta: {
    book: 'Reserva tu consulta gratuita',
    calculate: 'Calcula tu precio',
    write: 'Escríbenos',
    seeServices: 'Ver los 5 servicios',
  },
  footer: {
    services: 'Servicios',
    resources: 'Recursos',
    company: 'Empresa',
    legal: 'Legal',
    contact: 'Contacto',
    privacy: 'Privacidad',
    legalNotice: 'Aviso legal',
    cookies: 'Cookies',
    calculator: 'Calculadora de costes',
    rights: 'Todos los derechos reservados.',
    fictional: 'Empresa ficticia con fines de demostración.',
    hours: 'Lunes a viernes, 08:30–17:30',
  },
  servicesList: {
    contabilidad: 'Contabilidad y cierres anuales',
    iva: 'IVA y declaraciones fiscales',
    nominas: 'Nóminas y seguros sociales',
    constitucion: 'Constitución de empresas',
    startups: 'Asesoría para startups',
  },
  resourcesList: {
    gmbh: 'Cómo constituir una GmbH en Zúrich',
    calendar: 'Calendario fiscal para pymes',
    errors: '5 errores contables de las startups',
  },
  price: {
    from: 'desde',
    perMonth: 'CHF/mes',
    vatNote: 'Precios sin IVA',
    vatFirst: 'IVA (MWST)',
    vatNoteFirst: 'Precios sin IVA (MWST)',
    includedFrom: 'Incluido desde {name}',
    packageStarts: 'El paquete {name} empieza en {amount} CHF/mes.',
    package: 'Paquete {name}.',
    fixed: 'Precio cerrado.',
    unitOnce: 'CHF',
  },
  alert: {
    success: 'Correcto',
    warning: 'Aviso',
    error: 'Error',
    info: 'Información',
  },
  services: {
    index: {
      title: 'Servicios',
      lead: 'Cinco servicios para que tu empresa tenga sus números al día, sus impuestos presentados y sus decisiones claras.',
      forWhomLabel: 'Para quién',
      guideLabel: 'Qué necesito',
      guideTitle: 'Qué necesito si soy autónomo, startup o pyme',
      guideLead: 'Elige tu caso y te decimos por dónde empezar.',
      guideProfile: 'Tu caso',
      guideServices: 'Servicios que te encajan',
      seoTitle: 'Servicios',
      seoDescription:
        'Contabilidad, IVA, nóminas, constitución de empresas y asesoría para startups en Zúrich. Cinco servicios con precio cerrado y una persona de contacto fija.',
    },
    profiles: {
      autonomo: 'Soy autónomo',
      startup: 'Soy una startup',
      pyme: 'Tengo una pyme',
    },
    detail: {
      labelScope: 'Alcance',
      labelProcess: 'Proceso',
      labelPrice: 'Precio',
      labelFaq: 'Preguntas',
      labelRelated: 'Relacionados',
      includes: 'Qué incluye',
      forWhom: 'Para quién es',
      process: 'Cómo lo hacemos',
      price: 'Precio orientativo',
      priceCalc: 'Calcula tu precio',
      priceFixedNote: 'Precio cerrado tras la consulta gratuita.',
      faq: 'Preguntas frecuentes',
      related: 'Servicios relacionados',
      seeAll: 'Ver todos los servicios',
    },
  },
  pricing: {
    seoTitle: 'Precios',
    seoDescription:
      'Tres paquetes de contabilidad y fiscalidad para pymes y autónomos en Zúrich: Essential, Growth y Full Service. Precios sin IVA y precio cerrado tras 20 minutos.',
    title: 'Precios',
    lead: 'Tres paquetes mensuales, con permanencia de tres meses. Y precio cerrado para lo que se hace una sola vez.',
    forWhom: 'Pensado para',
    recommended: 'Recomendado',
    included: 'Incluido',
    notIncluded: 'No incluido',
    compareLabel: 'Comparativa',
    compareTitle: 'Qué incluye cada paquete',
    compareCaption: 'Comparativa de los paquetes Essential, Growth y Full Service',
    feature: 'Servicio',
    packages: {
      essential: { forWhom: 'Autónomos y empresas muy pequeñas sin personal' },
      growth: { forWhom: 'Pymes con equipo y startups en marcha' },
      full: { forWhom: 'Pymes de hasta 50 empleados y empresas con estructura (AG)' },
    },
    rows: {
      accounting: 'Contabilidad mensual y cierre anual',
      vat: 'IVA (MWST)',
      payroll: 'Nóminas y seguros sociales',
      report: 'Informe en lenguaje claro',
      meeting: 'Reunión con tu asesor',
      contact: 'Persona de contacto',
      taxPlanning: 'Planificación fiscal anual',
      capTable: 'Startups: cap table básico',
      valuation: 'Startups: valoración y preparación de ronda',
      taxRequests: 'Gestión de requerimientos de la autoridad fiscal',
    },
    cells: {
      upTo20Invoices: 'hasta 20 facturas/mes',
      byVolume: 'según volumen',
      quarterlyNote: 'trimestral',
      upTo10Employees: 'hasta 10 empleados',
      upTo50Employees: 'hasta 50 empleados',
      annual: 'Anual',
      quarterly: 'Trimestral',
      monthly: 'Mensual',
      contactEssential: 'Email, respuesta en 2 días laborables',
      contactGrowth: 'Interlocutor fijo y teléfono directo',
      contactFull: 'Interlocutor fijo, respuesta el mismo día laborable',
      consult: 'Consulta',
      priority: 'Prioritaria',
    },
    separate: {
      constitution: 'Constitución de empresa',
      backlog: 'Regularización de contabilidades atrasadas',
      valuation: 'Valoraciones puntuales fuera del paquete',
      extraordinary: 'Procesos extraordinarios (inspecciones, reestructuraciones)',
    },
    separateLabel: 'Aparte',
    separateTitle: 'Qué no está incluido',
    separateLead:
      'Se presupuesta aparte, con precio cerrado. Te lo damos por escrito antes de empezar.',
    separateConstitution:
      'GmbH desde {gmbh}; AG desde {ag}. Las tasas de notaría y del registro mercantil no están incluidas.',
    faqLabel: 'Preguntas',
    faqTitle: 'Preguntas sobre precios',
    ctaTitle: '¿No sabes qué paquete te encaja?',
    ctaText:
      'Calcula una estimación en un minuto o cuéntanoslo en 20 minutos de conversación, sin compromiso.',
    faq: [
      {
        q: '¿Hay permanencia?',
        a: 'Sí. Los paquetes mensuales tienen una permanencia de tres meses. Te lo explicamos en la consulta, antes de que decidas nada.',
      },
      {
        q: '¿Puedo cambiar de paquete?',
        a: 'Sí. Si tu empresa cambia, ajustamos el paquete y te decimos el nuevo precio antes de aplicarlo.',
      },
      {
        q: '¿Qué pasa si mi empresa crece?',
        a: 'Te avisamos cuando tus facturas o tu equipo pasen al siguiente tramo y te proponemos el paquete que mejor encaja. Con más de 200 facturas al mes te preparamos una propuesta a medida.',
      },
    ],
  },
  home: {
    seoDescription:
      'Fiduciaria y contabilidad en Zúrich para pymes, autónomos y startups: contabilidad, IVA y nóminas con precio cerrado. Reserva tu consulta gratuita de 20 minutos.',
    hero: {
      line1: 'Tus números,',
      line2: 'bajo control.',
      proof: '+10 años en Zúrich · 200+ clientes',
      scroll: 'Desliza',
    },
    proposal: {
      label: 'Nuestra promesa',
      cta: 'Conoce Northbridge',
      body1:
        'Las pymes tenían dos opciones: una gran firma, con su burocracia y sus tarifas, o un servicio básico que se limitaba a presentar papeles.',
      body2:
        'Northbridge nació en Zúrich en 2014 para ofrecer una tercera: rigor de gran firma, con una persona de contacto que conoce tu empresa.',
    },
    services: {
      label: 'Servicios',
      title: 'Cómo te ayudamos',
      lead: 'Tres servicios que te quitan trabajo desde el primer mes.',
      more: 'Ver los 5 servicios',
    },
    stats: {
      label: 'En cifras',
      title: 'Una firma pequeña, con experiencia',
      clients: 'Clientes activos',
      years: 'Años en Zúrich, desde 2014',
      contact: 'Persona de contacto fija',
    },
    process: {
      label: 'Cómo trabajamos',
      title: 'Tres pasos, sin burocracia',
      steps: [
        {
          title: 'Hablamos 20 minutos',
          text: 'Vemos tu actividad, tu banco y tu forma de facturar.',
        },
        { title: 'Te damos precio cerrado', text: 'Sabes lo que pagas cada mes, sin sorpresas.' },
        {
          title: 'Nos encargamos',
          text: 'Llevamos tu contabilidad y tus plazos. Tú ves tus cifras claras.',
        },
      ],
    },
    calculator: {
      label: 'Calculadora',
      title: 'Calcula tu precio en 1 minuto',
      text: 'Elige tu tipo de empresa, cuántas facturas tienes al mes y cuántos empleados. Te damos una estimación al momento.',
      note: 'Es una estimación orientativa. El precio cerrado te lo damos tras 20 minutos de conversación, sin compromiso.',
    },
    testimonials: {
      label: 'Clientes',
      title: 'Lo que dicen quienes trabajan con nosotros',
      region: 'Testimonios de clientes',
      pause: 'Pausar rotación',
      play: 'Reanudar rotación',
      goTo: 'Ver testimonio',
    },
    cta: {
      title: '20 minutos para ordenar tus números.',
      text: 'Sin compromiso. Precio cerrado después.',
    },
  },
} as const;

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${K}`
    : T[K] extends readonly unknown[]
      ? never
      : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<typeof es>;

/** Forma del diccionario: misma estructura que `es`, con textos libres. Todos los idiomas la cumplen. */
type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly Widen<U>[]
    : { -readonly [K in keyof T]: Widen<T[K]> };
export type Messages = Widen<typeof es>;
