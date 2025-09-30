import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:4000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3002';
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

    // Visit the frontend
    await page.goto('/', { waitUntil: 'networkidle' });
    console.log('Current URL after goto:', await page.url());

    // Ensure main branding exists
    await expect(page.locator('text=Test')).toBeVisible();

    // Validate KPIs are visible and match backend
    await expect(page.locator('text=An\u00e1lisis Activos')).toBeVisible();
    await expect(page.locator('div.bg-etherblue-dark\\/50:has-text("Análisis Activos") .text-2xl')).toHaveText(expectedAnalyses);

    await expect(page.locator('text=Alertas Cr\u00edticas')).toBeVisible();
    await expect(page.locator('div.bg-etherblue-dark\\/50:has-text("Alertas Críticas") .text-2xl')).toHaveText(expectedAlerts);
  });
});
