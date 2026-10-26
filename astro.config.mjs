// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/** Ruta interna /_brand (guía viva): solo en desarrollo; Astro ignora los archivos con prefijo _ en pages/. */
/** @type {import('astro').AstroIntegration} */
const brandGuide = {
  name: 'brand-guide',
  hooks: {
    'astro:config:setup': ({ command, injectRoute }) => {
      if (command === 'dev')
        injectRoute({ pattern: '/_brand', entrypoint: './src/dev/brand.astro' });
    },
  },
};

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://northbridge.ch',
  output: 'static',
  integrations: [
    react(),
    mdx(),
    brandGuide,
    sitemap({
      filter: (page) => !page.includes('/_brand'),
      i18n: {
        defaultLocale: 'es',
        locales: { es: 'es', en: 'en', de: 'de-CH', fr: 'fr-CH', it: 'it-CH' },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de', 'fr', 'it'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
