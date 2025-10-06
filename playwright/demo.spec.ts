import { test, expect } from '@playwright/test';

test.describe('Demo E2E', () => {
  test('completes demo flow with Colombia State Mission using data-testid', async ({ page }) => {
    // 1. Navegar a '/demo'
    await page.goto(`/demo`);
    await expect(page).toHaveURL('/demo');

    // Verificar que la página se cargue correctamente
    await expect(page.locator('text=Manus AI - Centro de Mando')).toBeVisible();

    // 2. Cambiar a "Acceso Estado" usando data-testid
    await page.locator('[data-testid="access-level-select"]').click();
    await page.locator('text=Acceso Estado').click();

    // 3. Esperar que el mapa global se cargue
    await expect(page.locator('[data-testid="global-map"]')).toBeVisible();
    await page.waitForSelector('[data-testid="global-map"] svg', { timeout: 30000 });

    // 4. Hacer clic en Colombia usando data-testid
    await page.locator('[data-testid="country-COL"]').click();

    // 5. Verificar que el panel de briefing se abra
    await expect(page.locator('[data-testid="briefing-panel"]')).toBeVisible();

    // Verificar la card del país Colombia
    await expect(page.locator('[data-testid="country-card-COL"]')).toBeVisible();
    await expect(page.locator('[data-testid="country-card-COL"]').locator('text=Colombia')).toBeVisible();

    // Verificar la card de misiones
    await expect(page.locator('[data-testid="missions-card"]')).toBeVisible();

    // 6. Seleccionar la misión "Alerta de Inestabilidad Social" usando data-testid
    await page.locator('[data-testid="mission-btn-social-instability-alert"]').click();

    // 7. Verificar que aparezca el plan de tareas
    await expect(page.locator('[data-testid="tasks-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="tasks-card"]').locator('text=Plan de Tareas')).toBeVisible();

    // Verificar controles de usuario
    await expect(page.locator('[data-testid="user-controls"]')).toBeVisible();

    // 8. Saltar a los resultados para completar el flujo rápidamente
    await page.locator('[data-testid="skip-to-results-btn"]').click();

    // 9. Verificar que aparezca el reporte final
    await expect(page.locator('[data-testid="final-report"]')).toBeVisible();

    // Verificar las cards del reporte
    await expect(page.locator('[data-testid="executive-summary-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="ai-explanation-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="weights-card"]')).toBeVisible();
    await expect(page.locator('[data-testid="data-sources-card"]')).toBeVisible();

    // Verificar contenido del resumen ejecutivo
    await expect(page.locator('[data-testid="executive-summary-card"]').locator('text=Saltando a resultados...')).toBeVisible();
  });
});