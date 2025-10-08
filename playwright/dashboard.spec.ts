import { test, expect } from '@playwright/test';

const API_BASE = process.env.TEST_MODE === 'true' ? 'http://localhost:3001' : (process.env.API_BASE || 'http://localhost:4000');
const TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

test.describe('Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  });

  test('renders KPIs from /api/platform-status', async ({ page }) => {
    // Fetch expected values directly from the backend
    const apiRes = await page.request.get(`${API_BASE}/api/platform-status`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    expect(apiRes.ok()).toBeTruthy();
    const payload = await apiRes.json();
    const expectedAnalyses = String(payload.analisisActivos ?? '');
    const expectedAlerts = String(payload.alertasCriticas ?? '');

    // Set token for authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('praevisio_token', 'demo-token');
    });

    // Visit the frontend and wait for network to be idle
    await page.goto('/', { waitUntil: 'networkidle' });
    console.log('Current URL after goto:', await page.url());

    // Wait for the main dashboard container to be visible
    const dashboardLocator = page.locator('[data-testid="dashboard-container"]');
    await expect(dashboardLocator).toBeVisible({ timeout: 15000 });

    // Validate KPIs are visible and match backend
    await expect(dashboardLocator.locator('text=Análisis Activos')).toBeVisible();
    await expect(dashboardLocator.locator('div.bg-etherblue-dark\\/50:has-text("Análisis Activos") .text-2xl')).toHaveText(expectedAnalyses);

    await expect(dashboardLocator.locator('text=Alertas Críticas')).toBeVisible();
    await expect(dashboardLocator.locator('div.bg-etherblue-dark\\/50:has-text("Alertas Críticas") .text-2xl')).toHaveText(expectedAlerts);
  });
});
