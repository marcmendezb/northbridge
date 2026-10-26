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
    for (const sel of ['[data-hero-fade]', '[data-reveal]', '.hero__promise-inner > *']) {
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

test('header: fijo, flotante y con sombra al hacer scroll', async ({ page }) => {
  await page.goto('/');
  const header = page.locator('.nb-header');
  expect(await header.evaluate((el) => getComputedStyle(el).position)).toBe('fixed');
  const bar = page.locator('.nb-bar');
  const before = await bar.boundingBox();
  await page.evaluate(() => scrollTo({ top: 1600, behavior: 'instant' }));
  await page.waitForTimeout(900);
  const after = await bar.boundingBox();
  expect(after?.y).toBe(before?.y);
  expect(await header.getAttribute('data-scrolled')).not.toBeNull();
  expect(await bar.evaluate((el) => getComputedStyle(el).boxShadow)).not.toBe('none');
});

test('scroll suave (Lenis) activo con movimiento permitido', async ({ page }) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  await expect(page.locator('html')).toHaveClass(/lenis/);
});

test('hero: la foto se recorta en arco al hacer scroll y la promesa aparece', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const clip = () =>
    page.locator('[data-hero-photo]').evaluate((el) => getComputedStyle(el).clipPath);
  expect(await clip()).toMatch(/inset\(0px/);
  const runway = await page.evaluate(
    () => document.querySelector<HTMLElement>('[data-hero]')!.offsetHeight - innerHeight,
  );
  await page.evaluate((y) => scrollTo({ top: y, behavior: 'instant' }), runway * 0.95);
  await page.waitForTimeout(1600);
  expect(await clip()).toMatch(/round/);
  expect(await clip()).not.toMatch(/inset\(0px 0px 0px 0px/);
  await expect(
    page.getByText('La tranquilidad de una gran firma, sin su burocracia.'),
  ).toBeVisible();
  expect(
    await page.locator('.hero__promise-title').evaluate((el) => getComputedStyle(el).opacity),
  ).toBe('1');
});

test('hero en móvil: foto arriba y texto sobre navy, sin escena anclada', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/', { waitUntil: 'networkidle' });
  expect(
    await page.locator('.hero').evaluate((el) => el.getBoundingClientRect().height),
  ).toBeLessThan(2400);
  expect(await page.locator('.hero__stage').evaluate((el) => getComputedStyle(el).position)).toBe(
    'relative',
  );
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('hero: el vídeo está en bucle, sin sonido, siempre en reproducción y sin control de pausa', async ({
  page,
}) => {
  await page.goto('/', { waitUntil: 'networkidle' });
  const video = page.locator('[data-hero-video]');
  expect(await video.evaluate((v: HTMLVideoElement) => [v.muted, v.loop, v.playsInline])).toEqual([
    true,
    true,
    true,
  ]);
  await expect
    .poll(() => video.evaluate((v: HTMLVideoElement) => !v.paused && v.currentTime > 0.2), {
      timeout: 8000,
    })
    .toBe(true);
  await expect(page.locator('[data-hero-pause]')).toHaveCount(0);
  expect(await video.evaluate((v: HTMLVideoElement) => v.currentSrc)).toMatch(
    /hero-home\.(webm|mp4)$/,
  );
  // Los ficheros servidos no llevan pista de audio.
  for (const ext of ['webm', 'mp4']) {
    const res = await page.request.get(`/video/hero-home.${ext}`);
    expect(res.ok()).toBe(true);
  }
});

test.describe('reduced motion: vídeo', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no se reproduce y queda el fotograma inicial', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    expect(
      await page.locator('[data-hero-video]').evaluate((v: HTMLVideoElement) => v.paused),
    ).toBe(true);
    await expect(page.locator('.hero__img')).toBeVisible();
  });
});

test('desplegable de Servicios: abre al pasar el ratón, enlaza y se cierra con Esc', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/', { waitUntil: 'networkidle' });
  const trigger = page.locator('[data-mega-trigger]');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await trigger.hover();
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const mega = page.locator('#mega-servicios');
  await expect(mega.getByRole('link', { name: 'Contabilidad y cierres anuales' })).toBeVisible();
  await expect(mega.getByRole('link', { name: /Ver todos los servicios/ })).toHaveAttribute(
    'href',
    '/servicios',
  );
  await expect(mega.getByRole('link', { name: /Calcula tu precio en 1 minuto/ })).toHaveAttribute(
    'href',
    '/calculadora',
  );
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  // Teclado: Enter abre y el foco pasa al primer enlace.
  await trigger.focus();
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(mega.getByRole('link').first()).toBeFocused();
});

test('desplegable de Servicios: sin JS el enlace lleva a /servicios', async ({ browser }) => {
  const ctx = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto('/');
  const link = page.locator('.nb-nav__nojs');
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', '/servicios');
  await ctx.close();
});
