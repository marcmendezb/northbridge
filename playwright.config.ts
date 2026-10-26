import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  // Navegador en español desde Suiza: idioma y país por defecto de la web (la detección del
  // navegador se prueba aparte en tests/i18n.spec.ts).
  use: { baseURL: 'http://localhost:4321', locale: 'es-CH', timezoneId: 'Europe/Zurich' },
  webServer: { command: 'npm run dev', url: 'http://localhost:4321', reuseExistingServer: true },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
