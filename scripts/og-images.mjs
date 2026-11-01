/* global document, console */
/**
 * Imágenes para compartir (Open Graph, 1200 × 630), una por idioma, en public/og/{idioma}.png.
 * Se generan con Playwright a partir de la foto del hero, las fuentes autoalojadas y el claim de
 * src/i18n. Uso: `npm run og` (solo hace falta repetirlo si cambian el claim o la marca).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const root = resolve(import.meta.dirname, '..');
const file = (p) => pathToFileURL(join(root, p)).href;
const locales = ['es', 'en', 'de', 'fr', 'it'];

// Colores de src/styles/tokens.css (la imagen es un PNG: no hay variables CSS que heredar).
const tokens = Object.fromEntries(
  [
    ...readFileSync(join(root, 'src/styles/tokens.css'), 'utf8').matchAll(
      /--([a-z]+-\d+):\s*(#[0-9a-f]{6})/g,
    ),
  ].map((m) => [m[1], m[2]]),
);

// El descriptor sin la ciudad: la oficina depende del país elegido.
const withoutCity = (text) => text.replace(/\s+(en|in|à|a)\s+Z\S+?\.$/, '.');

const html = (m) => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face { font-family: Newsreader; src: url(${file('node_modules/@fontsource-variable/newsreader/files/newsreader-latin-opsz-normal.woff2')}); font-weight: 200 800; }
  @font-face { font-family: Instrument; src: url(${file('node_modules/@fontsource-variable/instrument-sans/files/instrument-sans-latin-wght-normal.woff2')}); font-weight: 400 700; }
  * { box-sizing: border-box; margin: 0; }
  body { width: 1200px; height: 630px; display: grid; grid-template-columns: 600px 600px; background: ${tokens['navy-800']}; }
  .text { display: flex; flex-direction: column; justify-content: space-between; padding: 64px; color: ${tokens['piedra-50']}; }
  .logo { display: flex; align-items: center; gap: 12px; }
  .logo svg { width: 55px; height: 36px; }
  .name { font: 500 40px/0.9 Newsreader; letter-spacing: -0.015em; font-optical-sizing: auto; }
  .sub { font: 600 11px/1 Instrument; letter-spacing: 0.36em; margin-top: 6px; }
  .rule { width: 48px; height: 1.5px; background: ${tokens['salvia-300']}; margin-bottom: 28px; }
  h1 { font: 300 64px/1.04 Newsreader; letter-spacing: -0.02em; font-optical-sizing: auto; }
  p { margin-top: 24px; font: 400 22px/1.45 Instrument; color: ${tokens['navy-100']}; max-width: 30ch; }
  .photo { background: url(${file('src/assets/img/home/hero-poster.jpg')}) no-repeat; background-size: 1120px 630px; background-position: -480px 0; background-color: ${tokens['piedra-100']}; height: 630px; }
</style></head><body>
  <div class="text">
    <div class="logo">
      <svg viewBox="4 11 40 26" fill="none" stroke="currentColor" stroke-width="4"><path d="M4 13H44"/><path d="M10 37V29A14 14 0 0 1 38 29V37"/></svg>
      <div><div class="name">Northbridge</div><div class="sub">ADVISORY</div></div>
    </div>
    <div><div class="rule"></div><h1>${m.brand.claim}</h1><p>${withoutCity(m.brand.descriptor)}</p></div>
  </div>
  <div class="photo"></div>
</body></html>`;

mkdirSync(join(root, 'public/og'), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const locale of locales) {
  const m = (await import(pathToFileURL(join(root, `src/i18n/${locale}.ts`)).href))[locale];
  const tmp = join(tmpdir(), `nb-og-${locale}.html`);
  writeFileSync(tmp, html(m));
  await page.goto(pathToFileURL(tmp).href);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(root, `public/og/${locale}.png`) });
  console.log(`public/og/${locale}.png`);
}
await browser.close();
