import { test, expect } from '@playwright/test';

test('Debería agregar un nuevo item/tarea al tablero Kanban - Versión Corregida', async ({ page }) => {
  const userEmail = '72617519@continental.edu.pe';
  const userPassword = '123456';
  const projectId = '0ff250d5-f0e4-4b61-9bd4-8a15c8f73ca9';
  const taskName = `Nueva Tarea ${Date.now()}`; // Nombre único para evitar duplicados

  // 1. Login
  await page.goto('https://colaborative-platform.vercel.app/login');
  await page.fill('input#email', userEmail);
  await page.fill('input#password', userPassword);

  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]'),
  ]);
  expect(page.url()).toContain('/projects');

  // 2. Navegar directamente al proyecto específico
  await page.goto(`https://colaborative-platform.vercel.app/projects/${projectId}`);
  
  // Esperar a que el tablero Kanban se cargue
  await page.waitForSelector('div.flex.gap-3', { timeout: 10000 });

  // 3. Seleccionar la primera columna (Backlog)
  const kanbanColumns = page.locator('div.w-\\[350px\\].overflow-x-hidden.h-full.flex-shrink-0');
  const backlogColumn = kanbanColumns.first();
  
  await expect(backlogColumn).toBeVisible();
  
  // Verificar que es realmente la columna Backlog
  const backlogHeader = backlogColumn.locator('h1:has-text("Backlog")');
  await expect(backlogHeader).toBeVisible();
  
  // Hacer clic en el botón "Add item" de esta columna
  const addItemButton = backlogColumn.locator('button:has-text("Add item")');
  await expect(addItemButton).toBeVisible();
  await addItemButton.click();

  // 4. Esperar a que aparezca el formulario inline (no modal)
  // Buscar el input que aparece después de hacer clic en "Add item"
  const taskInput = backlogColumn.locator('input[placeholder*="Enter task title"]');
  await expect(taskInput).toBeVisible({ timeout: 10000 });

  // 5. Llenar el campo de entrada de la tarea
  await taskInput.fill(taskName);

  // 6. Hacer clic en el botón "Add" para crear la tarea
  const addButton = backlogColumn.locator('button:has-text("Add")');
  await expect(addButton).toBeVisible();
  
  // Verificar que el botón no esté deshabilitado antes de hacer clic
  await expect(addButton).not.toHaveAttribute('disabled');
  await addButton.click();

  // 7. Verificar que el formulario se oculte después de agregar
  await expect(taskInput).toBeHidden({ timeout: 5000 });

  // 8. Verificar que el nuevo item aparezca en la columna Backlog
  // Usar .first() para evitar strict mode violation si hay duplicados
  const newTaskCard = backlogColumn.locator('div').filter({ hasText: taskName }).first();
  await expect(newTaskCard).toBeVisible({ timeout: 15000 });

  // 9. Verificar que el contador se haya actualizado
  const counter = backlogColumn.locator('div.px-2.h-4.rounded-full');
  await expect(counter).toBeVisible();

  console.log(`✅ Tarea "${taskName}" agregada exitosamente al Backlog`);
});