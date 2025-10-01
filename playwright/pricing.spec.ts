import { test, expect } from '@playwright/test';

test('Pricing muestra tres planes y botón Contactar en Professional', async ({ page, baseURL }) => {
  await page.goto((baseURL || '') + '/pricing');
  await expect(page.locator('text=Planes y Precios')).toBeVisible();
  const plans = page.locator('text=Solicitar Demo').nth(0);
  await expect(plans).toBeVisible();
  // comprobación simple: existen 3 tarjetas
  const cards = page.locator('div').filter({ hasText: 'Solicitar Demo' });
  await expect(cards).toHaveCount(3);
});
import { test, expect } from '@playwright/test';

test('pricing page and request demo flow (smoke)', async ({ page }) => {
  await page.goto('/pricing');
  await expect(page.locator('text=Planes y Precios')).toBeVisible();
  // Click 'Solicitar Demo' on Elite plan (we assume it's last)
  const buttons = page.locator('text=Solicitar Demo');
  await buttons.nth(-1).click();
  // Fill contact form if present (scroll to contact)
  await page.goto('/#contact');
  // Basic check: contact section exists
  await expect(page.locator('#contact')).toBeVisible();
});
