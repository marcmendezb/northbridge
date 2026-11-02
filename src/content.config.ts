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
    /** 1–2 sentences, plain language. */
    summary: z.string(),
    includes: z.array(z.string()),
    forWhom: z.array(z.string()),
    process: z.array(z.object({ title: z.string(), text: z.string() })).length(4),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(4),
    /** References to src/lib/pricing/config.ts: amounts are never written here. */
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
 * A service's version for another country (Spain, Germany, France, Italy): same text fields,
 * with its own rules, taxes and currency. The Swiss service (`servicios`) is the base and the version
 * used by countries that don't have their own yet. Path: language/country/service.md.
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
    /** Date its legal facts and sources were last checked. */
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
    /** Country whose carousel shows it (clients of each office); defaults to Switzerland. */
    country: z.enum(['CH', 'ES', 'DE', 'FR', 'IT']).default('CH'),
  }),
});

/** Team (fictional). The file key is the same in every language and names the photo. */
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
/** Topic shared by a guide's versions in each country (links the equivalent ones). */
export const blogTopics = ['constitucion', 'calendario', 'errores'] as const;
export const blogCountries = ['CH', 'ES', 'DE', 'FR', 'IT'] as const;

/** Resources articles. `author` is the team file key (without language). */
const blog = defineCollection({
  loader: glob({ pattern: '*/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(blogCategories),
    /** Country the guide refers to: each guide exists in one version per country. */
    country: z.enum(blogCountries),
    topic: z.enum(blogTopics),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    /** Date the legal and tax facts were last checked. */
    checkedAt: z.coerce.date(),
    author: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    sources: z.array(z.object({ label: z.string(), url: z.url() })).default([]),
  }),
});

/** Legal pages: placeholder templates, see src/content/legal/README.md. */
const legal = defineCollection({
  loader: glob({ pattern: '*/*.md', base: './src/content/legal' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updatedAt: z.coerce.date(),
  }),
});

export const collections = { servicios, serviciosPais, testimonios, equipo, blog, legal };
