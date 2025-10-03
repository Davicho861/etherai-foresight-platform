import { test, expect } from '@playwright/test';

test('GeoMap is visible on dashboard', async ({ page }) => {
  // Set token for authentication
  await page.addInitScript(() => {
    window.localStorage.setItem('praevisio_token', 'demo-token');
  });
  await page.goto('/');
  const geo = page.locator('svg >> text', { hasText: 'GeoMap (mock)' });
  await expect(geo).toHaveCount(1);
});
