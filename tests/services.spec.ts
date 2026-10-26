import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const slugs = [
  'contabilidad-y-cierres',
  'iva-y-fiscalidad',
  'nominas-y-seguros-sociales',
  'constitucion-de-empresas',
  'asesoria-para-startups',
];
const pages = ['/servicios', '/precios', ...slugs.map((s) => `/servicios/${s}`)];

for (const path of pages) {
  test(`axe, h1 único y sin scroll horizontal: ${path}`, async ({ page }) => {
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `ancho ${width}`,
      ).toBe(true);
    }
    await expect(page.locator('main h1')).toHaveCount(1);
    // Deja que terminen los reveals antes de medir contraste.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        scrollTo({ top: y, behavior: 'instant' });
        await new Promise((r) => setTimeout(r, 60));
      }
      scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`),
    ).toEqual([]);
  });
}

test('las 5 subpáginas salen de una plantilla y llevan FAQPage JSON-LD con 4 preguntas', async ({
  page,
}) => {
  for (const slug of slugs) {
    await page.goto(`/servicios/${slug}`);
    const ld = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = ld.map((t) => JSON.parse(t)).find((j) => j['@type'] === 'FAQPage');
    expect(faq.mainEntity).toHaveLength(4);
    expect(ld.some((t) => JSON.parse(t)['@type'] === 'BreadcrumbList')).toBe(true);
    await expect(
      page.getByRole('link', { name: 'Reserva tu consulta gratuita' }).first(),
    ).toHaveAttribute('href', '/consulta-gratuita');
  }
});

test('precios: importes desde config, Growth único destacado, tabla accesible', async ({
  page,
}) => {
  // En un país con euro se ven los importes de config.ts tal cual (Suiza los convierte a CHF).
  await page.addInitScript(() => localStorage.setItem('nb-country', 'ES'));
  await page.goto('/precios');
  await expect(page.getByText('Precios sin IVA (MWST)')).toHaveCount(1);
  await expect(page.getByText('Recomendado')).toHaveCount(2); // tarjeta + cabecera de tabla
  const table = page.getByRole('table', { name: /Comparativa de los paquetes/ });
  await expect(table.getByRole('columnheader')).toHaveCount(4);
  await expect(page.getByText('SL desde 1 490 €', { exact: false }).first()).toBeVisible();
  for (const n of ['190', '490', '990'])
    await expect(page.locator('.t-price:visible', { hasText: n })).toHaveCount(1);
});

test('acordeón de FAQ: abre con teclado y actualiza aria-expanded', async ({ page }) => {
  await page.goto('/servicios/iva-y-fiscalidad');
  const q = page.getByRole('button', { name: '¿Cada cuánto se declara el IVA?' });
  await expect(q).toHaveAttribute('aria-expanded', 'false');
  await q.focus();
  await page.keyboard.press('Enter');
  await expect(q).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Trimestralmente con el método efectivo')).toBeVisible();
});

test.describe('sin JS', () => {
  test.use({ javaScriptEnabled: false });
  test('FAQ y tabla de precios completas', async ({ page }) => {
    await page.goto('/servicios/iva-y-fiscalidad');
    await expect(page.getByText('No la contestes todavía')).toBeVisible();
    await page.goto('/precios');
    await expect(page.getByText('Hay intereses', { exact: false })).toHaveCount(0);
    await expect(page.getByText('Te avisamos cuando tus facturas')).toBeVisible();
  });
});
