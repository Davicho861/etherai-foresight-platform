/* eslint-disable no-unused-vars */
import { test, expect } from '@playwright/test';

/* eslint-disable @typescript-eslint/no-unused-vars */
test('module latam colombia renders data with bearer token', async ({ page, request }) => {
  // Set localStorage or token injection if needed
  await page.setExtraHTTPHeaders({ Authorization: 'Bearer demo-token' });
  await page.goto('/module/colombia');
  await expect(page.locator('text=Módulo de Seguridad LATAM — Colombia')).toBeVisible();
  // Wait for JSON content
  await expect(page.locator('text=drought_risk')).toBeVisible();
});
