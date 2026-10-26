import { es, type MessageKey } from './es';

export type Locale = 'es';
export const defaultLocale: Locale = 'es';

const dictionaries: Record<Locale, typeof es> = { es };

/** Devuelve un texto de interfaz por clave (`nav.services`). */
export function t(key: MessageKey, locale: Locale = defaultLocale): string {
  const value = key
    .split('.')
    .reduce<unknown>((node, part) => (node as Record<string, unknown>)[part], dictionaries[locale]);
  return value as string;
}

/** Ruta pública con prefijo de idioma (el idioma por defecto no lleva prefijo). */
export function localizedPath(path: string, locale: Locale = defaultLocale): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === defaultLocale ? clean : `/${locale}${clean}`;
}
