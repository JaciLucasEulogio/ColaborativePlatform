import { test, expect } from '@playwright/test';

test('Debería iniciar sesión y crear un nuevo proyecto', async ({ page }) => {
  // 1. Login
  await page.goto('https://colaborative-platform.vercel.app/login');

  await page.fill('input#email', '72617519@continental.edu.pe');
  await page.fill('input#password', '123456');

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);
  expect(page.url()).toContain('/projects');

  // 2. Ir a la página de creación
  await page.goto('https://colaborative-platform.vercel.app/new-project');

  // 3. Rellenar formulario
  await page.fill('input[placeholder="Name of project"]', 'Mi Proyecto de Prueba');
  await page.fill('textarea[placeholder="A short description about this project"]', 'Descripción breve para test.');

  // 4. Llenar el TextEditor (README)
  const editor = page.locator('div[contenteditable="true"]');
  await editor.fill('Contenido README de prueba para el proyecto.');

  // 5. Click en "Continue" para abrir el modal
  await page.click('button:has-text("Continue")');

  // 6. Esperar que se abra el modal y que el botón "Create" esté visible
  const createButton = page.locator('button:has-text("Create")');
  await createButton.waitFor({ state: 'visible' });

  // 7. Click en "Create" y esperar la respuesta del backend
  await page.locator('button:has-text("Create")').click();

  // 8. Verificar que redirecciona a la vista del proyecto
  await expect(page).toHaveURL(/\/projects\/[a-zA-Z0-9-]+/);

  // 9. Verificar que la página cargó y contiene el título del proyecto
  await expect(page.getByText('Mi Proyecto de Prueba')).toBeVisible();

});
