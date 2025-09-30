import { test, expect } from '@playwright/test';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

test.describe('Demo E2E', () => {
  test('completes demo flow with Colombia State Mission', async ({ page }) => {
    // 1. Cargar página
    await page.goto('/demo');
    await expect(page).toHaveURL('/demo');
    await expect(page.locator('text=Manus AI - Centro de Mando')).toBeVisible();

    // 2. Cambiar a "Estado"
    await page.click('[data-testid="access-level-select"]'); // Abrir el select
    await page.click('text=Acceso Estado'); // Seleccionar Estado

    // 3. Clic en "Colombia"
    await page.click('[data-country="COL"]');

    // 4. Verificar Panel de Briefing aparece
    await page.waitForSelector('text=Panel de Briefing Estado', { timeout: 10000 });
    await expect(page.locator('text=Panel de Briefing Estado')).toBeVisible();

    // 5. Seleccionar "Alerta de Inestabilidad Social"
    await page.click('text=Alerta de Inestabilidad Social');

    // 6. Verificar vista ejecución inicia y que el stream muestre patrones indicativos
    await page.waitForSelector('text=Plan de Tareas', { timeout: 20000 });
    await expect(page.locator('text=Plan de Tareas')).toBeVisible();

    // Esperar que en el stream aparezcan frases relacionadas con acciones reales (puede tardar)
    const streamSelector = '.task-stream';
    await page.waitForSelector(streamSelector, { timeout: 5 * 60 * 1000 }); // hasta 5 minutos

    // Comprobar que aparezca al menos una de las frases esperadas
    const text = await page.locator(streamSelector).innerText();
    const patterns = [
      /Accediendo a la URL:/i,
      /Ejecutando script de análisis de datos:/i,
      /Generando informe final/i,
      /Datos adquiridos de:/i,
      /Analisis de señales/i,
    ];
    const matches = patterns.some((rx) => rx.test(text));
    expect(matches).toBeTruthy();
  });
});