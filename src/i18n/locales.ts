/** Idiomas del sitio. `es` es el idioma por defecto y no lleva prefijo en la URL. */
export const locales = ['es', 'en', 'de', 'fr', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const localeMeta: Record<
  Locale,
  {
    /** Nombre del idioma en su propio idioma. */
    name: string;
    /** Código corto para el selector. */
    short: string;
    /** Valor de `lang` y `hreflang`. */
    htmlLang: string;
    /** Valor de `og:locale`. */
    og: string;
    /** Configuración regional para formatear fechas. */
    intl: string;
    /** Comillas de cita: apertura y cierre. */
    quotes: [string, string];
  }
> = {
  es: {
    name: 'Español',
    short: 'ES',
    htmlLang: 'es',
    og: 'es_ES',
    intl: 'es-ES',
    quotes: ['«', '»'],
  },
  en: {
    name: 'English',
    short: 'EN',
    htmlLang: 'en',
    og: 'en_GB',
    intl: 'en-GB',
    quotes: ['“', '”'],
  },
  de: {
    name: 'Deutsch',
    short: 'DE',
    htmlLang: 'de-CH',
    og: 'de_CH',
    intl: 'de-CH',
    quotes: ['«', '»'],
  },
  fr: {
    name: 'Français',
    short: 'FR',
    htmlLang: 'fr-CH',
    og: 'fr_CH',
    intl: 'fr-CH',
    quotes: ['«\u202F', '\u202F»'],
  },
  it: {
    name: 'Italiano',
    short: 'IT',
    htmlLang: 'it-CH',
    og: 'it_CH',
    intl: 'it-CH',
    quotes: ['«', '»'],
  },
};

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && (locales as readonly string[]).includes(value);
