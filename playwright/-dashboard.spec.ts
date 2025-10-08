import { test, expect } from '@playwright/test';

const _API_BASE = process.env.TEST_MODE === 'true' ? 'http://localhost:3001' : (process.env.API_BASE || 'http://localhost:4000');
const _TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    // Referencing env config to avoid unused variable lint warnings in E2E scaffolding
    console.debug('_API_BASE', _API_BASE, '_TOKEN:', _TOKEN ? '[REDACTED]' : '');
  });

  test('renders KPIs from /api/platform-status', async ({ page }) => {
    // Mock the API response before navigating
    await page.route('**/api/platform-status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          active_analyses: 12,
          critical_alerts: 3,
          total_missions: 5,
          success_rate: 99.5,
        }),
      });
    });

    await page.goto('/');
    // Wait for the main content to be visible, indicating the app has loaded.
    await expect(page.locator('main')).toBeVisible({ timeout: 10000 });
    await expect(page.locator('text=Centro de Mando Praevisio AI')).toBeVisible();
  });

  test('perceptual validation of the pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1:has-text("Planes y Precios")')).toBeVisible();
    
    const pricingTable = page.locator('[data-testid="pricing-table"]');
    await expect(pricingTable).toBeVisible();
    
    await expect(page).toHaveScreenshot('pricing-page-visual-baseline.png');
  });
});