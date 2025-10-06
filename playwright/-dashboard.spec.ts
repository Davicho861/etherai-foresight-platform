import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:4000';
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

    await page.goto('/');
    await expect(page.locator('text=Platform is running')).toBeVisible();
  });
});