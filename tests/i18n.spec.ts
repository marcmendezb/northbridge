import { expect, test } from '@playwright/test';

const pages = [
  { path: '/', lang: 'es' },
  { path: '/en', lang: 'en' },
  { path: '/de/leistungen', lang: 'de-CH' },
  { path: '/fr/tarifs', lang: 'fr-CH' },
  { path: '/it/servizi/iva-e-fiscalita', lang: 'it-CH' },
];

for (const p of pages) {
  test(`i18n: ${p.path} declares lang=${p.lang} and links its 5 alternates`, async ({ page }) => {
    const res = await page.goto(p.path);
    expect(res?.status()).toBe(200);
    await expect(page.locator('html')).toHaveAttribute('lang', p.lang);
    await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(6);
    await expect(page.locator('main h1')).toHaveCount(1);
  });
}

test('i18n: the language dropdown opens like the services one and switches to the same page', async ({
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

test('i18n: with the keyboard, Enter opens languages, focus moves in and Esc closes it', async ({
  page,
}) => {
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

test('i18n: on mobile the full-screen menu has the languages and countries', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en');
  await page.locator('.nb-menu-btn').click();
  const menu = page.locator('#mobile-menu');
  await expect(menu).toBeVisible();
  const box = await menu.boundingBox();
  expect(box?.height).toBe(844);
  const langs = page.getByRole('list', { name: 'Language' }).getByRole('link');
  await expect(langs).toHaveCount(5);
  await expect(langs.and(page.locator('[aria-current]'))).toHaveText('EN');
  await expect(page.getByRole('list', { name: 'Country' }).getByRole('button')).toHaveCount(5);

  const toggle = menu.locator('[data-mobile-toggle]');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(menu.locator('.nb-mobile__sublink').first()).toBeVisible();
});

test.describe('without JS', () => {
  test.use({ javaScriptEnabled: false });
  test('i18n: language codes are visible links on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/fr');
    await expect(page.locator('.nb-lang__nojs a')).toHaveCount(5);
    await expect(page.locator('.nb-lang__nojs a[lang="it-CH"]')).toHaveAttribute('href', '/it');
  });
});

test('country: changes currency and legal forms, independent of language, and is remembered', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/precios', { waitUntil: 'networkidle' });
  const growth = page.locator('.nb-pk .t-price').nth(1);
  const constitution = page
    .locator('.nb-ledger__row')
    .filter({ hasText: 'Constitución de empresa' });
  // Switzerland by default: francs converted from euros, GmbH and AG.
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

  // The country is kept when switching language.
  await page.goto('/en/pricing');
  await expect(page.locator('html')).toHaveAttribute('data-country', 'ES');
  await expect(page.locator('.nb-pk .t-price').nth(1)).toHaveText('490', { useInnerText: true });
});

test.describe('country and language from location', () => {
  test.use({ locale: 'de-CH', timezoneId: 'Europe/Zurich' });
  test('arriving from Zurich gives Switzerland and German; a manual choice is respected', async ({
    page,
  }) => {
    // Playwright sets navigator.webdriver; here a normal visit is simulated.
    await page.addInitScript(() =>
      Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }),
    );
    await page.goto('/precios');
    await expect(page).toHaveURL(/\/de\/preise$/);
    await expect(page.locator('html')).toHaveAttribute('data-country', 'CH');
    // A language picked manually is respected.
    await page.evaluate(() => localStorage.setItem('nb-lang', 'es'));
    await page.goto('/precios');
    await expect(page).toHaveURL(/\/precios$/);
  });
});

test.describe('country from time zone', () => {
  test.use({ locale: 'es-ES', timezoneId: 'Europe/Madrid' });
  test('Madrid → Spain: euros and SL', async ({ page }) => {
    await page.goto('/precios');
    await expect(page.locator('html')).toHaveAttribute('data-country', 'ES');
    await expect(page.locator('.nb-pk .t-price').nth(1)).toHaveText('490', { useInnerText: true });
  });
});

/** Normal visit (no webdriver) from a given time zone and browser language. */
const visit = (locale: string, timezoneId: string, expected: RegExp, country: string) =>
  test.describe(`${timezoneId} with a ${locale} browser`, () => {
    test.use({ locale, timezoneId });
    test(`opens ${expected} with country ${country || 'default'}`, async ({ page }) => {
      await page.addInitScript(() =>
        Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false }),
      );
      await page.goto('/precios');
      await expect(page).toHaveURL(expected);
      // Without a detected country there's no attribute: the site falls back to Switzerland.
      if (country) await expect(page.locator('html')).toHaveAttribute('data-country', country);
      else await expect(page.locator('html')).not.toHaveAttribute('data-country', /.+/);
    });
  });

// The language follows the location, even if the browser uses another language.
visit('es-ES', 'Europe/Zurich', /\/de\/preise$/, 'CH');
visit('en-US', 'Europe/Paris', /\/fr\/tarifs$/, 'FR');
visit('en-GB', 'Europe/Rome', /\/it\/prezzi$/, 'IT');
visit('de-DE', 'Europe/Madrid', /\/precios$/, 'ES');
// In Switzerland, if the browser prefers French or Italian, that language is used.
visit('fr-CH', 'Europe/Zurich', /\/fr\/tarifs$/, 'CH');
// Outside the five countries, the browser language.
visit('en-US', 'America/New_York', /\/en\/pricing$/, '');
