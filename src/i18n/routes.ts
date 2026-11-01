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
  // Guías de España
  'como-constituir-una-sl-en-espana': {
    en: 'how-to-set-up-an-sl-in-spain',
    de: 'sl-in-spanien-gruenden',
    fr: 'creer-une-sl-en-espagne',
    it: 'come-costituire-una-sl-in-spagna',
  },
  'calendario-fiscal-para-pymes-en-espana': {
    en: 'tax-calendar-for-smes-in-spain',
    de: 'steuerkalender-fuer-kmu-in-spanien',
    fr: 'calendrier-fiscal-pour-pme-en-espagne',
    it: 'calendario-fiscale-per-pmi-in-spagna',
  },
  '5-errores-contables-de-las-startups-en-espana': {
    en: '5-accounting-mistakes-startups-make-in-spain',
    de: '5-buchhaltungsfehler-von-startups-in-spanien',
    fr: '5-erreurs-comptables-des-startups-en-espagne',
    it: '5-errori-contabili-delle-startup-in-spagna',
  },
  // Guías de Alemania
  'como-constituir-una-gmbh-en-alemania': {
    en: 'how-to-set-up-a-gmbh-in-germany',
    de: 'gmbh-in-deutschland-gruenden',
    fr: 'creer-une-gmbh-en-allemagne',
    it: 'come-costituire-una-gmbh-in-germania',
  },
  'calendario-fiscal-para-pymes-en-alemania': {
    en: 'tax-calendar-for-smes-in-germany',
    de: 'steuerkalender-fuer-kmu-in-deutschland',
    fr: 'calendrier-fiscal-pour-pme-en-allemagne',
    it: 'calendario-fiscale-per-pmi-in-germania',
  },
  '5-errores-contables-de-las-startups-en-alemania': {
    en: '5-accounting-mistakes-startups-make-in-germany',
    de: '5-buchhaltungsfehler-von-startups-in-deutschland',
    fr: '5-erreurs-comptables-des-startups-en-allemagne',
    it: '5-errori-contabili-delle-startup-in-germania',
  },
  // Guías de Francia
  'como-constituir-una-sas-en-francia': {
    en: 'how-to-set-up-an-sas-in-france',
    de: 'sas-in-frankreich-gruenden',
    fr: 'creer-une-sas-en-france',
    it: 'come-costituire-una-sas-in-francia',
  },
  'calendario-fiscal-para-pymes-en-francia': {
    en: 'tax-calendar-for-smes-in-france',
    de: 'steuerkalender-fuer-kmu-in-frankreich',
    fr: 'calendrier-fiscal-pour-pme-en-france',
    it: 'calendario-fiscale-per-pmi-in-francia',
  },
  '5-errores-contables-de-las-startups-en-francia': {
    en: '5-accounting-mistakes-startups-make-in-france',
    de: '5-buchhaltungsfehler-von-startups-in-frankreich',
    fr: '5-erreurs-comptables-des-start-up-en-france',
    it: '5-errori-contabili-delle-startup-in-francia',
  },
  // Guías de Italia
  'como-constituir-una-srl-en-italia': {
    en: 'how-to-set-up-an-srl-in-italy',
    de: 'srl-in-italien-gruenden',
    fr: 'creer-une-srl-en-italie',
    it: 'come-costituire-una-srl-in-italia',
  },
  'calendario-fiscal-para-pymes-en-italia': {
    en: 'tax-calendar-for-smes-in-italy',
    de: 'steuerkalender-fuer-kmu-in-italien',
    fr: 'calendrier-fiscal-pour-pme-en-italie',
    it: 'calendario-fiscale-per-pmi-in-italia',
  },
  '5-errores-contables-de-las-startups-en-italia': {
    en: '5-accounting-mistakes-startups-make-in-italy',
    de: '5-buchhaltungsfehler-von-startups-in-italien',
    fr: '5-erreurs-comptables-des-start-up-en-italie',
    it: '5-errori-contabili-delle-startup-in-italia',
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
