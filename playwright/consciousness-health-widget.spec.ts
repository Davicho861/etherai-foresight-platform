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

    // Validate the lessons learned count is displayed (now from real ChromaDB data)
    // Wait for loading to complete and check for a number
    await page.waitForSelector('[data-testid="lessons-count"]', { timeout: 10000 });
    const countText = await page.locator('[data-testid="lessons-count"]').textContent();
    expect(parseInt(countText || '0')).toBeGreaterThanOrEqual(0);

    // Validate the description text
    await expect(page.locator('text=Lecciones aprendidas por el Oráculo desde ChromaDB')).toBeVisible();

    // Validate the status badge
    await expect(page.locator('text=Conciencia Activa')).toBeVisible();
  });
});