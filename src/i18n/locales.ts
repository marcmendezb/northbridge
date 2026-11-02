/** Site languages. `es` is the default and has no URL prefix. */
export const locales = ['es', 'en', 'de', 'fr', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'es';

export const localeMeta: Record<
  Locale,
  {
    /** Language name in its own language. */
    name: string;
    /** Short code for the selector. */
    short: string;
    /** Value for `lang` and `hreflang`. */
    htmlLang: string;
    /** Value for `og:locale`. */
    og: string;
    /** Locale used to format dates. */
    intl: string;
    /** Quotation marks: opening and closing. */
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
