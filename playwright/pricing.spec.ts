import { test, expect } from '@playwright/test';

test('pricing page and request demo flow (smoke)', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.locator('text=Planes y Precios')).toBeVisible();
  // Wait for pricing data to load
  await page.waitForSelector('[data-testid="pricing-table"]', { timeout: 10000 });
  // Click 'Solicitar Demo' on last plan
  const buttons = page.locator('text=Solicitar Demo');
  await expect(buttons).toHaveCount(4); // Should have 4 buttons
  await buttons.nth(-1).click();
  // Scroll to contact section
  await page.locator('#contact').scrollIntoViewIfNeeded();
  // Basic check: contact section exists
  await expect(page.locator('#contact')).toBeVisible();
});
