import { expect, test } from '@playwright/test';

test('home: hero animado termina en estado final y todo el contenido es visible', async ({
  page,
}) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/Tus números,\s*bajo control\./);
  await expect(
    page.getByRole('link', { name: 'Reserva tu consulta gratuita' }).first(),
  ).toBeVisible();
  await page.waitForTimeout(3200);
  const opacity = await page
    .locator('[data-hero-fade]')
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(opacity).toBe('1');
  await page.getByText('Lo que dicen quienes trabajan con nosotros').scrollIntoViewIfNeeded();
  await expect(page.locator('.nb-slide[data-active]')).toBeVisible();
});

test('home: las cifras llegan a su valor final y son accesibles', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-count="200"]').scrollIntoViewIfNeeded();
  await expect(page.locator('[data-count="200"]')).toHaveText('200', { timeout: 4000 });
  await expect(page.getByText('200+ Clientes activos')).toHaveCount(1);
});

test('home: botón de pausa del carrusel detiene la rotación', async ({ page }) => {
  await page.goto('/');
  const pause = page.getByRole('button', { name: 'Pausar rotación' });
  await pause.scrollIntoViewIfNeeded();
  await pause.click();
  await expect(page.getByRole('button', { name: 'Reanudar rotación' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  const first = await page.locator('.nb-slide[data-active]').innerText();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(8600);
  expect(await page.locator('.nb-slide[data-active]').innerText()).toBe(first);
});

test.describe('sin JS', () => {
  test.use({ javaScriptEnabled: false });
  test('hero, cifras y los tres testimonios son visibles', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(
      page
        .getByText('Fiduciaria y contabilidad para pymes, autónomos y startups en Zúrich.')
        .first(),
    ).toBeVisible();
    await expect(page.locator('[data-count="200"]')).toHaveText('200');
    await expect(page.locator('.nb-slide:visible')).toHaveCount(3);
    await expect(page.getByText('Hablamos 20 minutos')).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('todo visible de inmediato, sin carrusel automático', async ({ page }) => {
    await page.goto('/');
    for (const sel of ['[data-hero-fade]', '[data-reveal]', '[data-hero-pattern]']) {
      expect(
        await page
          .locator(sel)
          .first()
          .evaluate((el) => getComputedStyle(el).opacity),
      ).toBe('1');
    }
    expect(
      await page
        .locator('[data-hero-line]')
        .first()
        .evaluate((el) => getComputedStyle(el).transform),
    ).toBe('none');
    await expect(page.getByRole('button', { name: 'Pausar rotación' })).toBeHidden();
    const first = await page.locator('.nb-slide[data-active]').innerText();
    await page.waitForTimeout(8600);
    expect(await page.locator('.nb-slide[data-active]').innerText()).toBe(first);
  });
});

test('home: sin scroll horizontal en 360, 768, 1024 y 1440', async ({ page }) => {
  for (const width of [360, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      `ancho ${width}`,
    ).toBe(true);
  }
});
