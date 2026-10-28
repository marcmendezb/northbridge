import { defineConfig, devices } from '@playwright/test';

// Puerto del servidor de desarrollo (NB_PORT si el 4321 lo ocupa otro proyecto).
const port = process.env.NB_PORT ?? '4321';
const url = `http://localhost:${port}`;

export default defineConfig({
  testDir: 'tests',
  // Navegador en español desde Suiza: idioma y país por defecto de la web (la detección del
  // navegador se prueba aparte en tests/i18n.spec.ts).
  use: { baseURL: url, locale: 'es-CH', timezoneId: 'Europe/Zurich' },
  webServer: { command: `npm run dev -- --port ${port}`, url, reuseExistingServer: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
