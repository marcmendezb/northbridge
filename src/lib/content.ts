import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';

/** Clave estable de una entrada (nombre del archivo, igual en todos los idiomas). */
export const entryKey = (entry: { id: string }) => entry.id.split('/').slice(1).join('/');

const ofLocale = (entry: { id: string }, locale: Locale) => entry.id.startsWith(`${locale}/`);

export async function getServices(locale: Locale): Promise<CollectionEntry<'servicios'>[]> {
  return (await getCollection('servicios', (e) => ofLocale(e, locale))).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

export async function getTestimonials(locale: Locale): Promise<CollectionEntry<'testimonios'>[]> {
  return (await getCollection('testimonios', (e) => ofLocale(e, locale))).sort(
    (a, b) => a.data.order - b.data.order,
  );
}
