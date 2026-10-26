import { de } from './de';
import { en } from './en';
import { es, type MessageKey, type Messages } from './es';
import { fr } from './fr';
import { it } from './it';
import { defaultLocale, isLocale, type Locale } from './locales';
import { localizedPath as localizePath } from './routes';

export type { Locale, MessageKey, Messages };
export { defaultLocale, locales, localeMeta, isLocale } from './locales';
export { alternates, parsePath } from './routes';

export const dictionaries: Record<Locale, Messages> = { es, en, de, fr, it };

const lookup = (dict: Messages, key: string): unknown =>
  key.split('.').reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], dict);

/** Devuelve un texto de interfaz por clave (`nav.services`). `{nombre}` se sustituye con `vars`. */
export function t(
  key: MessageKey,
  locale: Locale = defaultLocale,
  vars?: Record<string, string | number>,
): string {
  const value = lookup(dictionaries[locale], key) as string;
  return vars ? value.replace(/\{(\w+)\}/g, (_, k) => String(vars[k] ?? `{${k}}`)) : value;
}

/** Valor estructurado del diccionario (listas, como las preguntas frecuentes). */
export function tRaw<T>(key: string, locale: Locale = defaultLocale): T {
  return lookup(dictionaries[locale], key) as T;
}

export const localizedPath = localizePath;

/** Traductor y generador de rutas ligados a un idioma. Se usa con `Astro.currentLocale`. */
export function useI18n(current?: string) {
  const locale: Locale = isLocale(current) ? current : defaultLocale;
  return {
    locale,
    t: (key: MessageKey, vars?: Record<string, string | number>) => t(key, locale, vars),
    tRaw: <T>(key: string) => tRaw<T>(key, locale),
    lp: (path: string) => localizePath(path, locale),
  };
}
