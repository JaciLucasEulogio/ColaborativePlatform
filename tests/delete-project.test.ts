import { test, expect } from '@playwright/test';

test('Debería cerrar y eliminar un proyecto existente', async ({ page }) => {
  const userEmail = '72617519@continental.edu.pe';
  const userPassword = '123456';
  const projectName = 'Mi Proyecto de Prueba'; // Cambia por el nombre real que usarás para test

  // 1. Login
  await page.goto('https://colaborative-platform.vercel.app/login');
  await page.fill('input#email', userEmail);
  await page.fill('input#password', userPassword);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);
  expect(page.url()).toContain('/projects');

  // 2. Ir a la página de proyectos (en caso no estés redirigido)
  await page.goto('https://colaborative-platform.vercel.app/projects');

  // 3. Buscar el proyecto activo por nombre
  await page.fill('input[placeholder="Search active projects"]', projectName);

  // Esperar a que el proyecto aparezca en la lista de proyectos activos
  const projectRow = page.locator(`text=${projectName}`).first();
  await expect(projectRow).toBeVisible();

  // 4. Presionar botón de tres puntos (acciones) del proyecto activo
  const projectContainer = page.locator('div.p-6.border-b.flex.justify-between.items-center', { hasText: projectName }).first();
    const actionsButton = projectContainer.locator('button.font-bold'); // Cambié selector para coincidir con el botón que ves en el HTML
    await expect(actionsButton).toBeVisible({ timeout: 10000 });
    await actionsButton.click();

  // 5. Elegir la opción "Close" del menú
  const closeOption = page.locator('div[role="menuitem"]:has-text("Close")');
    await closeOption.waitFor({ state: 'visible' });
    await closeOption.click();

  // 6. Confirmar cierre en modal
  const confirmCloseButton = page.locator('button:has-text("Close Project")');
  await confirmCloseButton.waitFor({ state: 'visible' });
  await confirmCloseButton.click();

  // 7. Ir a pestaña "Closed Projects"
  const closedProjectsTab = page.locator('button:has-text("Closed Projects")');
  await closedProjectsTab.waitFor({ state: 'visible' });
  await closedProjectsTab.click();

  // 8. Buscar el proyecto cerrado
  // Si el placeholder es el mismo, se usa el mismo input, sino adaptarlo
  await page.fill('input[placeholder="Search closed projects"]', projectName);
  const closedProjectRow = page.locator(`text=${projectName}`).first();
  await expect(closedProjectRow).toBeVisible();

  // 9. Presionar botón de tres puntos del proyecto cerrado
  const projectContainerclosed = page.locator('div.p-6.border-b.flex.justify-between.items-center', { hasText: projectName }).first();
  const closedActionsButton = projectContainerclosed.locator('button.font-bold');
   await expect(closedActionsButton).toBeVisible({ timeout: 10000 });
    await closedActionsButton.click();

  // 10. Elegir "Delete Permanently"
  const deleteOption = page.locator('div[role="menuitem"]:has-text("Delete Permanently")');
  await deleteOption.waitFor({ state: 'visible' });
  await deleteOption.click();

  // 11. Esperar modal de eliminación y escribir el nombre del proyecto para confirmar
  const inputConfirmName = page.locator('input#projectName');
  await inputConfirmName.waitFor({ state: 'visible' });
  await inputConfirmName.fill(projectName);

  // 12. Presionar botón "Delete Project" en modal
  const deleteProjectButton = page.locator('button:has-text("Delete Project")');
  await deleteProjectButton.waitFor({ state: 'visible' });
  await deleteProjectButton.click();

  // 13. Validar que el proyecto ya no aparece en la lista de proyectos cerrados
  await expect(page.locator(`text=${projectName}`)).toHaveCount(0);
});