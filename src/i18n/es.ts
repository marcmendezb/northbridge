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
} as const;

type Leaves<T, P extends string = ''> = {
  [K in keyof T & string]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>;
}[keyof T & string];

export type MessageKey = Leaves<typeof es>;
