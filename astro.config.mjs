// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PUBLIC_SITE_URL ?? 'https://northbridge.ch',
  output: 'static',
  integrations: [react(), mdx(), sitemap({ filter: (page) => !page.includes('/_brand') })],
  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
