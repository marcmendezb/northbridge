import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n';
import { COUNTRIES, type Country } from './country';

/** Clave estable de una entrada (nombre del archivo, igual en todos los idiomas). */
export const entryKey = (entry: { id: string }) => entry.id.split('/').slice(1).join('/');

const ofLocale = (entry: { id: string }, locale: Locale) => entry.id.startsWith(`${locale}/`);

export async function getServices(locale: Locale): Promise<CollectionEntry<'servicios'>[]> {
  return (await getCollection('servicios', (e) => ofLocale(e, locale))).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** Textos de un servicio que cambian con el país. */
export type ServiceText = Pick<
  CollectionEntry<'servicios'>['data'],
  'title' | 'summary' | 'includes' | 'forWhom' | 'process' | 'faq'
>;

/**
 * Lo que ve cada país de un servicio: su versión (servicios-pais) o, si aún no la tiene, la suiza.
 * Devuelve los países agrupados por texto idéntico, para pintar una variante por grupo (`data-cc`).
 */
export async function getServiceVariants(
  service: CollectionEntry<'servicios'>,
  locale: Locale,
): Promise<{ countries: Country[]; text: ServiceText }[]> {
  const key = entryKey(service);
  const base: ServiceText = {
    title: service.data.title,
    summary: service.data.summary,
    includes: service.data.includes,
    forWhom: service.data.forWhom,
    process: service.data.process,
    faq: service.data.faq,
  };
  const own = await getCollection(
    'serviciosPais',
    (e) => e.id.startsWith(`${locale}/`) && e.id.endsWith(`/${key}`),
  );
  const textOf = (c: Country): ServiceText => {
    const v = own.find((e) => e.data.country === c)?.data;
    return v
      ? {
          title: v.title,
          summary: v.summary,
          includes: v.includes,
          forWhom: v.forWhom,
          process: v.process,
          faq: v.faq,
        }
      : base;
  };
  const groups = new Map<string, { countries: Country[]; text: ServiceText }>();
  for (const c of COUNTRIES) {
    const text = textOf(c);
    const k = JSON.stringify(text);
    groups.set(k, { countries: [...(groups.get(k)?.countries ?? []), c], text });
  }
  return [...groups.values()];
}

export async function getTestimonials(locale: Locale): Promise<CollectionEntry<'testimonios'>[]> {
  return (await getCollection('testimonios', (e) => ofLocale(e, locale))).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

export async function getTeam(locale: Locale): Promise<CollectionEntry<'equipo'>[]> {
  return (await getCollection('equipo', (e) => ofLocale(e, locale))).sort(
    (a, b) => a.data.order - b.data.order,
  );
}

/** Artículos publicados del idioma, el destacado primero y después por fecha (más reciente antes). */
export async function getArticles(locale: Locale): Promise<CollectionEntry<'blog'>[]> {
  return (await getCollection('blog', (e) => ofLocale(e, locale) && !e.data.draft)).sort(
    (a, b) =>
      Number(b.data.featured) - Number(a.data.featured) ||
      b.data.publishedAt.getTime() - a.data.publishedAt.getTime(),
  );
}

export async function getLegalPages(locale: Locale): Promise<CollectionEntry<'legal'>[]> {
  return getCollection('legal', (e) => ofLocale(e, locale));
}

/** Minutos de lectura (230 palabras por minuto, mínimo 1). */
export const readingMinutes = (body = '') =>
  Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 230));

/**
 * Guías por país: cada país ve las suyas y, si aún no tiene versión propia de un tema, la de Suiza.
 * Devuelve, para cada guía, los países en los que se muestra (para `data-cc`).
 */
export function guideCountries(articles: CollectionEntry<'blog'>[]): Map<string, Country[]> {
  const shown = new Map<string, Country[]>();
  for (const c of COUNTRIES) {
    const own = articles.filter((a) => a.data.country === c);
    const swiss = articles.filter((a) => a.data.country === 'CH');
    const list = [...own, ...swiss.filter((s) => !own.some((o) => o.data.topic === s.data.topic))];
    for (const a of list) shown.set(a.id, [...(shown.get(a.id) ?? []), c]);
  }
  return shown;
}

/** La versión de una guía (mismo tema) para otro país, si existe. */
export const guideFor = (articles: CollectionEntry<'blog'>[], topic: string, country: Country) =>
  articles.find((a) => a.data.topic === topic && a.data.country === country);
