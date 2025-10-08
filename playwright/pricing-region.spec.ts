import { test, expect } from '@playwright/test';

test.describe('Pricing region and structure', () => {
  test('prices differ for MX vs CO via region query', async ({ page }) => {
    // Load MX
    await page.goto('/pricing?region=mx');
    await page.waitForSelector('[data-testid="pricing-table"]');
    // Wait for data to load
    await page.waitForFunction(() => {
      const table = document.querySelector('[data-testid="pricing-table"]');
      return table && table.textContent && !table.textContent.includes('Cargando') && !table.textContent.includes('Error');
    }, { timeout: 30000 });
    // Wait for prices to load (at least one price element)
    await page.waitForSelector('[data-testid="pricing-table"] .text-2xl', { timeout: 30000 });
    const mxPrices = await page.locator('[data-testid="pricing-table"] .text-2xl').allTextContents();

    // Load CO
    await page.goto('/pricing?region=co');
    await page.waitForSelector('[data-testid="pricing-table"]');
    // Wait for data to load
    await page.waitForFunction(() => {
      const table = document.querySelector('[data-testid="pricing-table"]');
      return table && table.textContent && !table.textContent.includes('Cargando') && !table.textContent.includes('Error');
    }, { timeout: 30000 });
    // Wait for prices to load
    await page.waitForSelector('[data-testid="pricing-table"] .text-2xl', { timeout: 30000 });
    const coPrices = await page.locator('[data-testid="pricing-table"] .text-2xl').allTextContents();

    // Ensure at least one price differs (demo expectation)
    const different = mxPrices.some((p, i) => p !== coPrices[i]);
    expect(different).toBeTruthy();
  });

  test('Pantheon section is present on the page', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForSelector('[data-testid="pricing-table"]', { timeout: 30000 });
    // Wait for data to load
    await page.waitForFunction(() => {
      const table = document.querySelector('[data-testid="pricing-table"]');
      return table && table.textContent && !table.textContent.includes('Cargando') && !table.textContent.includes('Error');
    }, { timeout: 30000 });
    await expect(page.locator('text=Nivel Panteón')).toBeVisible();
  });

  test('Entrepreneurs segment shows correct number of plans', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForSelector('[data-testid="pricing-table"]', { timeout: 30000 });
    // Wait for data to load
    await page.waitForFunction(() => {
      const table = document.querySelector('[data-testid="pricing-table"]');
      return table && table.textContent && !table.textContent.includes('Cargando') && !table.textContent.includes('Error');
    }, { timeout: 30000 });
    // Locate the Entrepreneurs (Emprendedores) heading and count following plan cards
    const segment = page.locator('h2:has-text("Emprendedores y Fundadores")').first();
    await expect(segment).toBeVisible();
    const parent = segment.locator('xpath=..');
    const cards = parent.locator('.grid [data-testid]');
    // Fallback: count number of plan cards under the segment by finding .grid > div
    const planCards = parent.locator('.grid > div');
    const count = await planCards.count();
    // In GLOBAL_OFFERING_PROTOCOL.json there are 2 entrepreneur plans
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
