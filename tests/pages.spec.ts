import { expect, test, type Page } from '@playwright/test';

/** Waits for the React islands to hydrate before interacting. */
const hydrated = (page: Page) =>
  expect(page.locator('astro-island[ssr]')).toHaveCount(0, { timeout: 10000 });

test('calculator: reads the URL, recalculates and updates it on change', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('nb-country', 'ES'));
  await page.goto('/calculadora?tipo=autonomo&facturas=10&empleados=0');
  await hydrated(page);
  const result = page.locator('#resultado');
  // Freelancer, 10 invoices, 0 employees: Essential, 190–210.
  await expect(result.locator('.nb-calcx__amount')).toContainText('190', { useInnerText: true });
  await expect(result.locator('[aria-current="true"]')).toContainText('Essential');
  await page.locator('.nb-calcx__type', { hasText: 'Pyme (SL)' }).click();
  await page.getByRole('spinbutton', { name: 'Facturas al mes' }).fill('60');
  await page.getByRole('spinbutton', { name: 'Empleados' }).fill('5');
  await expect(result.locator('[aria-current="true"]')).toContainText('Growth');
  await expect(page).toHaveURL(/tipo=gmbh&facturas=60&empleados=5/);
  await page.locator('.nb-calcx__check').click();
  await expect(result).toContainText('propuesta a medida');
});

test('contact: validates with clear messages and, once complete, explains the site is fictional', async ({
  page,
}) => {
  await page.goto('/contacto');
  await page.locator('.nb-form').scrollIntoViewIfNeeded();
  await hydrated(page);
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await expect(page.getByRole('alert')).toHaveText('Revisa los campos marcados.');
  await expect(page.locator('.nb-form__error', { hasText: 'Escribe tu nombre.' })).toBeVisible();
  await page.getByLabel('Nombre').fill('Sara Keller');
  await page.getByLabel('Email').fill('sara@atelier-keller.ch');
  await page.getByLabel('Tipo de empresa').selectOption('pyme');
  await page.getByLabel('Mensaje').fill('Necesito ayuda con el IVA del trimestre.');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  // Nothing is sent: a modal notice with focus on the close button; Esc closes it and focus returns to the submit button.
  const notice = page.getByRole('dialog', { name: 'Esta web es una demostración.' });
  await expect(notice).toBeVisible();
  await expect(notice).toContainText('El formulario no envía ningún mensaje');
  await expect(notice.getByRole('button', { name: 'Entendido' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(notice).toBeHidden();
  await expect(page.getByRole('button', { name: 'Enviar mensaje' })).toBeFocused();
  await expect(page).toHaveURL(/\/contacto$/);
  // From the notice you can see how the journey would continue.
  await page.getByRole('button', { name: 'Enviar mensaje' }).click();
  await notice.getByRole('link', { name: 'Ver la página de confirmación' }).click();
  await expect(page).toHaveURL(/\/gracias$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Recibido. Nos encargamos.');
});

test('contact: actual reply time based on Zurich time', async ({ page }) => {
  // Friday 30 October 2026, 16:00 in Zurich: office open, reply on Monday 2.
  await page.clock.setFixedTime(new Date('2026-10-30T16:00:00+01:00'));
  await page.goto('/contacto');
  await expect(page.locator('[data-promise-text]')).toHaveText(
    'antes de las 12:00 del lunes 2 de noviembre.',
  );
  await expect(page.locator('[data-status]')).toHaveText('Oficina abierta ahora, hasta las 17:30.');
  await expect(page.locator('[data-week] [aria-current="date"]')).toContainText('vie');
});

test('contact: without JS, the generic reply time and the fallback message', async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto('/contacto');
  await expect(page.locator('[data-promise-text]')).toHaveText(
    'antes de las 12:00 del siguiente día laborable.',
  );
  await expect(page.locator('[data-status]')).toBeHidden();
  await expect(page.locator('.nb-contact__noscript')).toBeVisible();
  await context.close();
});

test('free consultation: the demo calendar shows the notice and links to the thank-you page with the slot', async ({
  page,
}) => {
  await page.goto('/consulta-gratuita');
  const days = page.locator('.nb-book__day');
  await expect(days).toHaveCount(5);
  await days.first().click();
  await page.locator('.nb-book__time').first().click();
  await page.getByRole('button', { name: 'Confirmar la consulta' }).click();
  const notice = page.getByRole('dialog', { name: 'Esta web es una demostración.' });
  await expect(notice).toContainText('No se reserva ninguna cita');
  await notice.getByRole('link', { name: 'Ver la página de confirmación' }).click();
  await expect(page).toHaveURL(/\/gracias\?fecha=\d{4}-\d{2}-\d{2}&hora=\d{2}:\d{2}/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Reservado. Te esperamos.');
  await expect(page.locator('[data-reply]')).toHaveText(/, a las \d{2}:\d{2}$/);
});

test('resources: the topic filter shows only those guides', async ({ page }) => {
  await page.goto('/recursos');
  await expect(page.locator('[data-category]:visible')).toHaveCount(3);
  await page.getByRole('button', { name: 'Fiscalidad' }).click();
  await expect(page.locator('[data-category]:visible')).toHaveCount(1);
  await expect(page.getByRole('button', { name: 'Fiscalidad' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
});

test('404: in the language of the URL', async ({ page }) => {
  await page.goto('/de/gibt-es-nicht');
  await expect(page.locator('[data-404="de"]')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('lang', 'de-CH');
});

test('article: table of contents, "Keep in mind" box and official sources', async ({ page }) => {
  await page.goto('/recursos/como-constituir-una-gmbh-en-zurich');
  await expect(page.getByRole('navigation', { name: 'En esta guía' })).toBeVisible();
  await expect(page.getByRole('note').first()).toContainText('Ten en cuenta');
  await expect(page.getByRole('link', { name: /Fedlex/ }).first()).toHaveAttribute(
    'href',
    /fedlex\.admin\.ch/,
  );
});
