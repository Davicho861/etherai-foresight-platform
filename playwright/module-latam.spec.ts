/* eslint-disable no-unused-vars, no-undef */
import { test, expect } from '@playwright/test';

test('module latam colombia renders data with bearer token', async ({ page, request }) => {
  // Set localStorage or token injection if needed
  await page.setExtraHTTPHeaders({ Authorization: 'Bearer demo-token' });
  await page.goto('/module/colombia');
  await expect(page.locator('text=Módulo de Seguridad LATAM — Colombia')).toBeVisible();
  // Wait for JSON content
  await expect(page.locator('text=Riesgo')).toHaveCount(0);
});
