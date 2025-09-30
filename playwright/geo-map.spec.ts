import { test, expect } from '@playwright/test';

test('GeoMap is visible on dashboard', async ({ page }) => {
  await page.goto('/dashboard');
  const geo = page.locator('svg >> text', { hasText: 'GeoMap (mock)' });
  await expect(geo).toHaveCount(1);
});
