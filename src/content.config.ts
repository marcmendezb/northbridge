import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const serviceIconNames = [
  'contabilidad',
  'iva',
  'nominas',
  'constitucion',
  'startups',
] as const;

const servicios = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    icon: z.enum(serviceIconNames),
    /** 1–2 frases, lenguaje claro. */
    summary: z.string(),
    includes: z.array(z.string()),
    forWhom: z.array(z.string()),
    process: z.array(z.object({ title: z.string(), text: z.string() })).length(4),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(4),
    /** Referencias a src/lib/pricing/config.ts: los importes no se escriben aquí. */
    pricing: z
      .array(
        z.object({
          label: z.string(),
          ref: z.enum(['essential', 'growth', 'full', 'gmbh', 'ag']),
          /** from: «desde X CHF/mes» · included: «Incluido desde <paquete>» · fixed: «desde X CHF, precio cerrado». */
          mode: z.enum(['from', 'included', 'fixed']),
        }),
      )
      .min(1),
    seo: z.object({ title: z.string(), description: z.string() }),
  }),
});

/**
 * Versión de un servicio para otro país (España, Alemania, Francia, Italia): mismos campos de texto,
 * con su normativa, sus impuestos y su moneda. El servicio suizo (`servicios`) es la base y la versión
 * de los países que aún no tienen la suya. Ruta: idioma/país/servicio.md.
 */
const serviciosPais = defineCollection({
  loader: glob({ pattern: '*/*/*.{md,mdx}', base: './src/content/servicios-pais' }),
  schema: z.object({
    country: z.enum(['ES', 'DE', 'FR', 'IT']),
    title: z.string(),
    summary: z.string(),
    includes: z.array(z.string()),
    forWhom: z.array(z.string()),
    process: z.array(z.object({ title: z.string(), text: z.string() })).length(4),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(4),
    /** Fecha en que se comprobaron sus datos legales y fuentes (docs/DECISIONES.md). */
    checkedAt: z.coerce.date(),
  }),
});

const testimonios = defineCollection({
  loader: glob({ pattern: '*/*.json', base: './src/content/testimonios' }),
  schema: z.object({
    author: z.string(),
    role: z.string(),
    company: z.string(),
    quote: z.string(),
    service: z.string().optional(),
    order: z.number(),
    fictional: z.literal(true),
  }),
});

/** Equipo (docs/09): ficticio. La clave del archivo es la misma en todos los idiomas y nombra la foto. */
const equipo = defineCollection({
  loader: glob({ pattern: '*/*.json', base: './src/content/equipo' }),
  schema: z.object({
    name: z.string(),
    role: z.string(),
    specialty: z.string(),
    quote: z.string(),
    order: z.number(),
    email: z.string().optional(),
    fictional: z.literal(true),
  }),
});

export const blogCategories = ['constitucion', 'fiscal', 'startups', 'contabilidad'] as const;
/** Tema común a las versiones de una guía en cada país (enlaza las equivalentes). */
export const blogTopics = ['constitucion', 'calendario', 'errores'] as const;
export const blogCountries = ['CH', 'ES', 'DE', 'FR', 'IT'] as const;

/** Artículos de Recursos (docs/09). `author` es la clave del archivo de equipo (sin idioma). */
const blog = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(blogCategories),
    /** País al que se refiere la guía: cada guía existe en una versión por país. */
    country: z.enum(blogCountries),
    topic: z.enum(blogTopics),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Fecha en que se comprobaron los datos legales y fiscales (DECISIONES.md). */
    checkedAt: z.coerce.date(),
    author: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  }),
});

/** Páginas legales: plantillas ficticias, ver src/content/legal/README.md. */
const legal = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { servicios, serviciosPais, testimonios, equipo, blog, legal };
