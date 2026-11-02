import { defineConfig, devices } from '@playwright/test';

// Dev server port (NB_PORT if 4321 is taken by another project).
const port = process.env.NB_PORT ?? '4321';
const url = `http://localhost:${port}`;

export default defineConfig({
  testDir: 'tests',
  // Spanish browser in Switzerland: the site's default language and country (browser detection is
  // tested separately in tests/i18n.spec.ts).
  use: { baseURL: url, locale: 'es-CH', timezoneId: 'Europe/Zurich' },
  webServer: { command: `npm run dev -- --port ${port}`, url, reuseExistingServer: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
