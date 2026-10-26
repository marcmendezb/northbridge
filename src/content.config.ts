import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const serviceIcons = ['contabilidad', 'iva', 'nominas', 'constitucion', 'startups'] as const;

const servicios = defineCollection({
  loader: glob({ pattern: '*.{md,mdx}', base: './src/content/servicios' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    icon: z.enum(serviceIcons),
    /** 1–2 frases, lenguaje claro. */
    summary: z.string(),
    includes: z.array(z.string()),
    forWhom: z.array(z.string()),
    process: z.array(z.object({ title: z.string(), text: z.string() })).length(4),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).length(4),
    /** Texto sin cifras; los importes viven solo en src/lib/pricing/config.ts. */
    priceNote: z.string().optional(),
    seo: z.object({ title: z.string(), description: z.string() }),
  }),
});

const testimonios = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonios' }),
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

export const collections = { servicios, testimonios };
