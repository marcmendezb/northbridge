import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/_brand']) {
  test(`axe: sin errores en ${path}`, async ({ page }) => {
    await page.goto(path, { waitUntil: 'networkidle' });
    // Axe mide el estado final: la entrada del hero (fundidos de opacidad) dura unos 2 s.
    await page.waitForTimeout(2600);
    // Las muestras de contraste de /_brand incluyen a propósito parejas límite o prohibidas.
    const results = await new AxeBuilder({ page })
      .exclude('[data-contrast-demo]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
      .analyze();
    expect(
      results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`),
    ).toEqual([]);
  });
}

test('menú móvil: abre, atrapa foco, cierra con Esc y devuelve el foco', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('/');
  const btn = page.getByRole('button', { name: 'Abrir menú' });
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
  await btn.click();
  await expect(page.getByRole('button', { name: 'Cerrar menú' })).toHaveAttribute(
    'aria-expanded',
    'true',
  );
  await expect(page.locator('#mobile-menu a').first()).toBeFocused();
  for (let i = 0; i < 12; i++) await page.keyboard.press('Tab');
  expect(await page.evaluate(() => !!document.activeElement?.closest('.nb-header'))).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Abrir menú' })).toBeFocused();
  await expect(page.locator('#mobile-menu')).toBeHidden();
});

test('saltar al contenido es el primer elemento enfocable', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Saltar al contenido' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeVisible();
});

test('sin horizontal scroll en 360 px', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/_brand');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test.describe('sin JS', () => {
  test.use({ javaScriptEnabled: false });
  test('todo el contenido del acordeón y la navegación son visibles', async ({ page }) => {
    await page.goto('/_brand');
    await expect(page.getByText('Si cierras el 31 de diciembre')).toBeVisible();
    await expect(page.locator('#mobile-menu a').first()).toBeAttached();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('el puente se muestra completo (sin estado oculto)', async ({ page }) => {
    await page.goto('/_brand');
    const offset = await page
      .locator('.nb-bridge[data-animate] path')
      .first()
      .evaluate((el) => getComputedStyle(el).strokeDashoffset);
    expect(['0px', 'none', '0']).toContain(offset);
  });
});

test('axe con el desplegable de Servicios abierto', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/servicios', { waitUntil: 'networkidle' });
  await page.locator('.nb-nav__trigger').hover();
  await page.waitForTimeout(900);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(
    results.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`),
  ).toEqual([]);
});
