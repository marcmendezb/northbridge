import type { APIRoute } from 'astro';

/** Everything is indexable except `noindex` pages (thank-you); the sitemap comes from @astrojs/sitemap. */
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).toString()}\n`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
