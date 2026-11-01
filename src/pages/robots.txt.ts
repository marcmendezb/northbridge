import type { APIRoute } from 'astro';

/** Todo indexable salvo las páginas `noindex` (gracias); el sitemap lo genera @astrojs/sitemap. */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).toString()}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
