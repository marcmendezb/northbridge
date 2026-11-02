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
  test(`axe, a single h1 and no horizontal scroll: ${path}`, async ({ page }) => {
    for (const width of [360, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path, { waitUntil: 'networkidle' });
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        `ancho ${width}`,
      ).toBe(true);
    }
    await expect(page.locator('main h1')).toHaveCount(1);
    // Let the reveals finish before measuring contrast.
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

test('the 5 service pages share a template and include FAQPage JSON-LD with 4 questions', async ({
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

test('pricing: amounts from config, Growth is the only highlight, accessible table', async ({
  page,
}) => {
  // In a euro country the config.ts amounts show as they are (Switzerland converts them to CHF).
  await page.addInitScript(() => localStorage.setItem('nb-country', 'ES'));
  await page.goto('/precios');
  await expect(page.locator('.nb-pk').getByText('Recomendado')).toHaveCount(1);
  await expect(page.locator('.nb-pk__item--featured')).toHaveAttribute('data-pkg', 'growth');
  const table = page.getByRole('table', { name: /Comparativa de los paquetes/ });
  await expect(table.locator('thead th')).toHaveCount(4);
  await expect(page.getByText('SL desde 1 490 €', { exact: false }).first()).toBeVisible();
  // Package card and table header: the same amount from config.ts.
  for (const n of ['190', '490', '990'])
    await expect(page.locator('.t-price:visible', { hasText: n })).toHaveCount(2);
  // "What describes you best?": focus moves to the matching package.
  await page.getByRole('button', { name: 'Trabajo por mi cuenta' }).click();
  await expect(page.locator('[data-pkg="essential"]')).toHaveAttribute('data-fit', '');
});

test('FAQ accordion: opens with the keyboard and updates aria-expanded', async ({ page }) => {
  await page.goto('/servicios/iva-y-fiscalidad');
  const q = page.getByRole('button', { name: '¿Cada cuánto se declara el IVA?' });
  await expect(q).toHaveAttribute('aria-expanded', 'false');
  await q.focus();
  await page.keyboard.press('Enter');
  await expect(q).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByText('Trimestralmente con el método efectivo')).toBeVisible();
});

test.describe('without JS', () => {
  test.use({ javaScriptEnabled: false });
  test('full FAQ and pricing table', async ({ page }) => {
    await page.goto('/servicios/iva-y-fiscalidad');
    // One version per country: without JS the Swiss one shows (the default country).
    await expect(page.getByText('No la contestes todavía').filter({ visible: true })).toBeVisible();
    await page.goto('/precios');
    await expect(page.getByText('Hay intereses', { exact: false })).toHaveCount(0);
    await expect(page.getByText('Te avisamos cuando tus facturas')).toBeVisible();
  });
});
