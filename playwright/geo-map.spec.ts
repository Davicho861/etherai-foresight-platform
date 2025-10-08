import { test, expect } from '@playwright/test';

test('GeoMap is visible on dashboard', async ({ page }) => {
  // Set token for authentication
  await page.addInitScript(() => {
    window.localStorage.setItem('praevisio_token', 'demo-token');
  });
  await page.goto('/demo');
  // Wait for map to load
  await page.waitForSelector('[data-testid="global-map"]', { timeout: 15000 });
  await expect(page.getByTestId('global-map')).toBeVisible();
});
