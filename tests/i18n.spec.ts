import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', lang: 'es' },
  { path: '/en', lang: 'en' },
  { path: '/de/leistungen', lang: 'de-CH' },
  { path: '/fr/tarifs', lang: 'fr-CH' },
  { path: '/it/servizi/iva-e-fiscalita', lang: 'it-CH' },
];

for (const p of pages) {
  test(`i18n: ${p.path} declara lang=${p.lang} y enlaza sus 5 alternativas`, async ({ page }) => {
    const res = await page.goto(p.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(6);
    await expect(page.locator('main h1')).toHaveCount(1);
  });
}

test('i18n: el desplegable de idiomas abre como el de servicios y cambia a la misma página', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/servicios/iva-y-fiscalidad');
  const trigger = page.locator('.nb-lang__trigger');
  await trigger.hover();
  await expect(page.locator('#mega-idiomas')).toHaveAttribute('data-open', 'true');
  await expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mega-idiomas a[aria-current]')).toHaveAttribute('lang', 'es');
  await page.locator('#mega-idiomas a[lang="de-CH"]').click();
  await expect(page).toHaveURL(/\/de\/leistungen\/mwst-und-steuern$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de-CH');
});

test('i18n: con teclado, Enter abre idiomas, el foco entra y Esc lo cierra', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/precios');
  await page.locator('.nb-lang__trigger').focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#mega-idiomas')).toHaveAttribute('data-open', 'true');
  await expect(page.locator('#mega-idiomas [data-country-option]').first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('#mega-idiomas')).toHaveAttribute('data-open', 'false');
  await expect(page.locator('.nb-lang__trigger')).toBeFocused();
});

test('i18n: en móvil los idiomas están en el menú', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  await page.locator('.nb-menu-btn').click();
  const langs = page.locator('.nb-mobile__langs a');
  await expect(langs).toHaveCount(5);
  await expect(page.locator('.nb-mobile__langs a[aria-current]')).toHaveText('EN');
});

test.describe('sin JS', () => {
  test.use({ javaScriptEnabled: false });
  test('i18n: los códigos de idioma son enlaces visibles en escritorio', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fr');
    await expect(page.locator('.nb-lang__nojs a')).toHaveCount(5);
    await expect(page.locator('.nb-lang__nojs a[lang="it-CH"]')).toHaveAttribute('href', '/it');
  });
});

test('país: cambia moneda y formas jurídicas, independiente del idioma, y se recuerda', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/precios', { waitUntil: 'networkidle' });
  const growth = page.locator('.nb-pk .t-price').nth(1);
  const constitution = page
    .locator('.nb-ledger__row')
    .filter({ hasText: 'Constitución de empresa' });
  // Por defecto, Suiza: francos convertidos desde el euro, GmbH y AG.
  await expect(
    page.locator('.nb-pk .font-sans').filter({ hasText: 'CHF/mes' }).first(),
  ).toBeVisible();
  await expect(constitution).toContainText('GmbH', { useInnerText: true });
  const chf = Number((await growth.innerText()).replace(/\D/g, ''));
  expect(chf).toBeLessThan(490);

  await page.locator('.nb-lang__trigger').click();
  const spain = page.locator('#mega-idiomas [data-country-option="ES"]');
  await spain.click();
  await expect(spain).toHaveAttribute('aria-pressed', 'true');
  await expect(growth).toHaveText('490', { useInnerText: true });
  await expect(constitution).toContainText('SL', { useInnerText: true });
  await expect(constitution).not.toContainText('GmbH', { useInnerText: true });
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');

  // Al cambiar de idioma se mantiene el país.
  await page.goto('/en/pricing');
  await expect(page.locator('html')).toHaveAttribute('data-country', 'ES');
  await expect(page.locator('.nb-pk .t-price').nth(1)).toHaveText('490', { useInnerText: true });
});

test.describe('país e idioma del lugar', () => {
  test.use({ locale: 'de-CH', timezoneId: 'Europe/Zurich' });
  test('al entrar desde Zúrich, Suiza y alemán; una elección a mano se respeta', async ({
    page,
  }) => {
    // Playwright marca navigator.webdriver; aquí se simula una visita normal.
    await page.addInitScript(() =>
      Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }),
    );
    await page.goto('/precios');
    await expect(page).toHaveURL(/\/de\/preise$/);
    await expect(page.locator('html')).toHaveAttribute('data-country', 'CH');
    // Elegido a mano otro idioma, se respeta.
    await page.evaluate(() => localStorage.setItem('nb-lang', 'es'));
    await page.goto('/precios');
    await expect(page).toHaveURL(/\/precios$/);
  });
});

test.describe('país por zona horaria', () => {
  test.use({ locale: 'es-ES', timezoneId: 'Europe/Madrid' });
  test('Madrid → España: euros y SL', async ({ page }) => {
    await page.goto('/precios');
    await expect(page.locator('html')).toHaveAttribute('data-country', 'ES');
    await expect(page.locator('.nb-pk .t-price').nth(1)).toHaveText('490', { useInnerText: true });
  });
});

/** Visita normal (sin webdriver) desde una zona horaria y con un idioma de navegador concretos. */
const visit = (locale: string, timezoneId: string, expected: RegExp, country: string) =>
  test.describe(`${timezoneId} con navegador ${locale}`, () => {
    test.use({ locale, timezoneId });
    test(`abre en ${expected} con país ${country || 'por defecto'}`, async ({ page }) => {
      await page.addInitScript(() =>
        Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }),
      );
      await page.goto('/precios');
      await expect(page).toHaveURL(expected);
      // Sin país detectado no hay atributo: la web usa Suiza por defecto.
      if (country) await expect(page.locator('html')).toHaveAttribute('data-country', country);
      else await expect(page.locator('html')).not.toHaveAttribute('data-country', /.+/);
    });
  });

// El idioma sigue al lugar, aunque el navegador esté en otro idioma.
visit('es-ES', 'Europe/Zurich', /\/de\/preise$/, 'CH');
visit('en-US', 'Europe/Paris', /\/fr\/tarifs$/, 'FR');
visit('en-GB', 'Europe/Rome', /\/it\/prezzi$/, 'IT');
visit('de-DE', 'Europe/Madrid', /\/precios$/, 'ES');
// En Suiza, si el navegador prefiere francés o italiano, ese idioma.
visit('fr-CH', 'Europe/Zurich', /\/fr\/tarifs$/, 'CH');
// Fuera de los cinco países, el idioma del navegador.
visit('en-US', 'America/New_York', /\/en\/pricing$/, '');
