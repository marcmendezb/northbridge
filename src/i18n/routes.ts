import { defaultLocale, isLocale, locales, type Locale } from './locales';

/**
 * Rutas públicas traducidas. La ruta canónica es la española (`/servicios/iva-y-fiscalidad`);
 * cada idioma traduce cada segmento. Un segmento sin entrada se mantiene igual.
 */
const segments: Record<string, Partial<Record<Locale, string>>> = {
  servicios: { en: 'services', de: 'leistungen', fr: 'services', it: 'servizi' },
  precios: { en: 'pricing', de: 'preise', fr: 'tarifs', it: 'prezzi' },
  nosotros: { en: 'about', de: 'ueber-uns', fr: 'a-propos', it: 'chi-siamo' },
  recursos: { en: 'resources', de: 'ressourcen', fr: 'ressources', it: 'risorse' },
  contacto: { en: 'contact', de: 'kontakt', fr: 'contact', it: 'contatto' },
  'consulta-gratuita': {
    en: 'free-consultation',
    de: 'kostenlose-beratung',
    fr: 'consultation-gratuite',
    it: 'consulenza-gratuita',
  },
  calculadora: { en: 'calculator', de: 'rechner', fr: 'calculateur', it: 'calcolatore' },
  privacidad: { en: 'privacy', de: 'datenschutz', fr: 'confidentialite', it: 'privacy' },
  'aviso-legal': { en: 'legal-notice', de: 'impressum', fr: 'mentions-legales', it: 'note-legali' },
  cookies: { it: 'cookie' },
  gracias: { en: 'thank-you', de: 'danke', fr: 'merci', it: 'grazie' },
  // Servicios
  'contabilidad-y-cierres': {
    en: 'accounting-and-year-end',
    de: 'buchhaltung-und-abschluss',
    fr: 'comptabilite-et-clotures',
    it: 'contabilita-e-chiusure',
  },
  'iva-y-fiscalidad': {
    en: 'vat-and-tax',
    de: 'mwst-und-steuern',
    fr: 'tva-et-fiscalite',
    it: 'iva-e-fiscalita',
  },
  'nominas-y-seguros-sociales': {
    en: 'payroll-and-social-insurance',
    de: 'lohn-und-sozialversicherungen',
    fr: 'salaires-et-assurances-sociales',
    it: 'paghe-e-assicurazioni-sociali',
  },
  'constitucion-de-empresas': {
    en: 'company-formation',
    de: 'firmengruendung',
    fr: 'creation-d-entreprise',
    it: 'costituzione-di-societa',
  },
  'asesoria-para-startups': {
    en: 'startup-advisory',
    de: 'startup-beratung',
    fr: 'conseil-aux-startups',
    it: 'consulenza-per-startup',
  },
  // Recursos (blog)
  'como-constituir-una-gmbh-en-zurich': {
    en: 'how-to-set-up-a-gmbh-in-zurich',
    de: 'gmbh-in-zuerich-gruenden',
    fr: 'creer-une-gmbh-a-zurich',
    it: 'come-costituire-una-gmbh-a-zurigo',
  },
  'calendario-fiscal-para-pymes': {
    en: 'tax-calendar-for-smes',
    de: 'steuerkalender-fuer-kmu',
    fr: 'calendrier-fiscal-pour-pme',
    it: 'calendario-fiscale-per-pmi',
  },
  '5-errores-contables-de-las-startups': {
    en: '5-accounting-mistakes-startups-make',
    de: '5-buchhaltungsfehler-von-startups',
    fr: '5-erreurs-comptables-des-startups',
    it: '5-errori-contabili-delle-startup',
  },
};

const forward = (segment: string, locale: Locale) =>
  locale === defaultLocale ? segment : (segments[segment]?.[locale] ?? segment);

const reverseMaps = Object.fromEntries(
  locales.map((l) => [
    l,
    Object.fromEntries(
      Object.keys(segments).map((canonical) => [forward(canonical, l), canonical]),
    ),
  ]),
) as Record<Locale, Record<string, string>>;

/** Ruta pública de una ruta canónica (española) en un idioma: `/servicios` → `/en/services`. */
export function localizedPath(path: string, locale: Locale = defaultLocale): string {
  const [pathname, hash = ''] = path.split('#');
  const clean = (pathname.startsWith('/') ? pathname : `/${pathname}`).replace(/\/$/, '') || '/';
  const translated = clean
    .split('/')
    .filter(Boolean)
    .map((s) => forward(s, locale));
  const prefix = locale === defaultLocale ? [] : [locale];
  const out = `/${[...prefix, ...translated].join('/')}`;
  return hash ? `${out}#${hash}` : out;
}

/** Idioma y ruta canónica (española) de una URL pública. */
export function parsePath(pathname: string): { locale: Locale; canonical: string } {
  const parts = pathname.split('/').filter(Boolean);
  const locale: Locale =
    isLocale(parts[0]) && parts[0] !== defaultLocale ? parts[0] : defaultLocale;
  const rest = locale === defaultLocale ? parts : parts.slice(1);
  const canonical = rest.map((s) => reverseMaps[locale][s] ?? s);
  return { locale, canonical: `/${canonical.join('/')}` };
}

/** Misma página en todos los idiomas, a partir de la ruta canónica. */
export function alternates(canonical: string): { locale: Locale; path: string }[] {
  return locales.map((locale) => ({ locale, path: localizedPath(canonical, locale) }));
}
