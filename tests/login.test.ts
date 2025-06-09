import { test, expect } from '@playwright/test';

test('Debería iniciar sesión exitosamente', async ({ page }) => {
  await page.goto('https://colaborative-platform.vercel.app/login');

  await page.fill('input#email', '72617519@continental.edu.pe');
  await page.fill('input#password', '123456');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);

  // Comprobar que se redirigió a /projects (o la ruta que esperas tras login)
  expect(page.url()).toContain('/projects');
});
