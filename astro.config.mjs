// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { satteri } from '@astrojs/markdown-satteri';
import { amountsPlugin } from './src/lib/amounts.ts';

/** Internal /_brand route (living style guide): dev only; Astro ignores files prefixed with _ in pages/. */
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
  markdown: { processor: satteri({ hastPlugins: [amountsPlugin] }) },
  integrations: [
    react(),
    mdx(),
    brandGuide,
    sitemap({
      // The thank-you page is noindex: left out of the sitemap in every language.
      filter: (page) =>
        !page.includes('/_brand') && !/\/(gracias|thank-you|danke|merci|grazie)\/?$/.test(page),
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
