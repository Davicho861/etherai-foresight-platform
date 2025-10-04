import { test, expect } from '@playwright/test';

test.describe('Consciousness Health Widget E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  });

  test('renders the Consciousness Health Widget with lessons learned count', async ({ page }) => {
    // Set token for authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('praevisio_token', 'demo-token');
    });

    // Visit the Metatron Panel
    await page.goto('/metatron-panel', { waitUntil: 'networkidle' });
    console.log('Current URL after goto:', await page.url());

    // Validate the widget is visible
    await expect(page.locator('text=Salud de la Conciencia')).toBeVisible();

    // Validate the lessons learned count is displayed (simulated as 42)
    await expect(page.locator('text=42')).toBeVisible();

    // Validate the description text
    await expect(page.locator('text=Lecciones aprendidas por el Oráculo')).toBeVisible();

    // Validate the status badge
    await expect(page.locator('text=Conciencia Activa')).toBeVisible();
  });
});