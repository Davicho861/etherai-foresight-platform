import { test, expect } from '@playwright/test';

test('pricing page and request demo flow (smoke)', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.locator('text=Cargando planes...')).toBeVisible();
  // Click 'Solicitar Demo' on Elite plan (we assume it's last)
  const buttons = page.locator('text=Solicitar Demo');
  await buttons.nth(-1).click();
  // Fill contact form if present (scroll to contact)
  await page.goto('/#contact');
  // Basic check: contact section exists
  await expect(page.locator('#contact')).toBeVisible();
});
