import { test, expect } from '@playwright/test';

const API_BASE = process.env.API_BASE || 'http://localhost:4000';

test.describe('Climate Widget E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  });

  test('renders climate widget with weather data', async ({ page }) => {
    // Set token for authentication
    await page.addInitScript(() => {
      window.localStorage.setItem('praevisio_token', 'demo-token');
    });

    // Visit the dashboard and wait for it to be idle
    await page.goto('/dashboard', { waitUntil: 'networkidle' });

    // Wait for the climate widget container to be visible with a longer timeout
    const climateWidgetLocator = page.locator('[data-testid="climate-widget"]');
    await expect(climateWidgetLocator).toBeVisible({ timeout: 15000 });

    // Check that the climate widget title is visible
    await expect(climateWidgetLocator.locator('text=Predicción Climática LATAM - Open Meteo')).toBeVisible();

    // Check for current weather section
    await expect(page.locator('text=Clima Actual')).toBeVisible();

    // Check for prediction section
    await expect(page.locator('text=Predicción 7 días')).toBeVisible();

    // Verify that temperature is displayed (should be a number)
    const temperatureLocator = page.locator('.text-2xl.font-bold').first();
    await expect(temperatureLocator).toBeVisible();
    const tempText = await temperatureLocator.textContent();
    expect(tempText).toMatch(/\d+°C/);

    // Check coordinate inputs are present
    await expect(page.locator('input[placeholder="Latitud"]')).toBeVisible();
    await expect(page.locator('input[placeholder="Longitud"]')).toBeVisible();
  });

  test('climate API endpoints return valid data', async ({ page }) => {
    // Test current weather endpoint
    const currentRes = await page.request.get(`${API_BASE}/api/climate/current?lat=4.7110&lon=-74.0721`);
    expect(currentRes.ok()).toBeTruthy();
    const currentData = await currentRes.json();
    expect(currentData).toHaveProperty('temperature');
    expect(currentData).toHaveProperty('humidity');
    expect(currentData).toHaveProperty('precipitation_probability');

    // Test prediction endpoint
    const predictRes = await page.request.get(`${API_BASE}/api/climate/predict?lat=4.7110&lon=-74.0721&days=7`);
    expect(predictRes.ok()).toBeTruthy();
    const predictData = await predictRes.json();
    expect(predictData).toHaveProperty('time');
    expect(predictData.time).toHaveLength(7);
  });
});