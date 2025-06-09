// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests', // Asegúrate de que tus tests estén aquí
  timeout: 30 * 1000, // 30 segundos por test
  expect: {
    timeout: 5000,
  },
  use: {
    headless: true,             // Ejecuta en segundo plano (sin abrir navegador)
    video: 'on',                // 🎥 Grabación activada siempre
    screenshot: 'only-on-failure', // Captura de pantalla si falla
    trace: 'retain-on-failure',    // Guarda trace si falla
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
  reporter: [['html', { open: 'never' }]], // Genera un reporte HTML
});
