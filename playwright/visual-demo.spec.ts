import { test, expect } from '@playwright/test';

test.describe('Visual Demo Snapshots', () => {
  test('Snapshot Visual: Sidebar de la Demo', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.getByTestId('sidebar-nav')).toBeVisible();
    await page.screenshot({ path: 'sidebar-nav-perfect.png' });
  });

  test('Snapshot Visual: Dashboard de Colombia', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.getByTestId('country-card-COL')).toBeVisible();
    await page.screenshot({ path: 'dashboard-colombia-perfect.png' });
  });

  test('Snapshot Visual: Dashboard de Argentina', async ({ page }) => {
    await page.goto('/demo');
    await page.getByTestId('country-ARG').click();
    await expect(page.getByTestId('country-card-ARG')).toBeVisible();
    await page.screenshot({ path: 'dashboard-argentina-perfect.png' });
  });

  test('Snapshot Visual: Dashboard de Perú', async ({ page }) => {
    await page.goto('/demo');
    await page.getByTestId('country-PER').click();
    await expect(page.getByTestId('country-card-PER')).toBeVisible();
    await page.screenshot({ path: 'dashboard-peru-perfect.png' });
  });

  test('Snapshot Visual: Dashboard de Brasil', async ({ page }) => {
    await page.goto('/demo');
    await page.getByTestId('country-BRA').click();
    await expect(page.getByTestId('country-card-BRA')).toBeVisible();
    await page.screenshot({ path: 'dashboard-brasil-perfect.png' });
  });

  test('Snapshot Visual: Mapa Global', async ({ page }) => {
    await page.goto('/demo');
    await expect(page.getByTestId('global-map')).toBeVisible();
    await page.screenshot({ path: 'global-map-perfect.png' });
  });

  test('Snapshot Visual: Panel de Briefing', async ({ page }) => {
    await page.goto('/demo');
    await page.getByTestId('country-COL').click();
    await expect(page.getByTestId('briefing-panel')).toBeVisible();
    await page.screenshot({ path: 'briefing-panel-perfect.png' });
  });
});