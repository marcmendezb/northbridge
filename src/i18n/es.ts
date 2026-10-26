/** Textos de interfaz en español (tuteo, frases cortas, sin exclamaciones). */
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
  },
  alert: {
    success: 'Correcto',
    warning: 'Aviso',
    error: 'Error',
    info: 'Información',
  },
  home: {
    hero: {
      line1: 'Tus números,',
      line2: 'bajo control.',
      proof: '+10 años en Zúrich · 200+ clientes',
    },
    proposal: {
      label: 'Nuestra promesa',
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
