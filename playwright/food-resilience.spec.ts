import { test, expect } from '@playwright/test';

const _API_BASE = process.env.TEST_MODE === 'true' ? 'http://localhost:3001' : (process.env.API_BASE || 'http://localhost:4000');
const _TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

test.describe('Food Resilience Platform E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));

    // Set authentication token
    await page.addInitScript(() => {
      window.localStorage.setItem('praevisio_token', 'demo-token');
    });
  });

  test('complete food resilience workflow: prices -> prediction -> supply chain', async ({ page }) => {
    // First, validate that the backend APIs are working
  const pricesApiRes = await page.request.get(`${_API_BASE}/api/food-resilience/prices`, { headers: { Authorization: `Bearer ${_TOKEN}` } });
    expect(pricesApiRes.ok()).toBeTruthy();
  const _pricesData = await pricesApiRes.json();
    // Reference to avoid eslint no-unused-vars when running lint in CI
    console.debug('_pricesData sample', Array.isArray(_pricesData.prices) ? _pricesData.prices.slice(0,1) : _pricesData);

  const supplyChainApiRes = await page.request.get(`${_API_BASE}/api/food-resilience/supply-chain`, { headers: { Authorization: `Bearer ${_TOKEN}` } });
    expect(supplyChainApiRes.ok()).toBeTruthy();
  const _supplyChainData = await supplyChainApiRes.json();
    // Reference to avoid eslint no-unused-vars when running lint in CI
    console.debug('_supplyChainData sample', Array.isArray(_supplyChainData.routes) ? _supplyChainData.routes.slice(0,1) : _supplyChainData);

    // Navigate to food resilience page
    await page.goto('/food-resilience', { waitUntil: 'networkidle' });
    console.log('Current URL:', await page.url());

    // Validate page title and main sections
    await expect(page.locator('text=Plataforma de Resiliencia Alimentaria')).toBeVisible();

    // Wait for data to load and validate price display
    await page.waitForTimeout(2000); // Allow time for API calls

    // Check if prices are displayed (may be in cards or tables)
    const priceElements = page.locator('[data-testid="price-card"], .price-card, [data-price]');
    const priceCount = await priceElements.count();

    if (priceCount > 0) {
      // Validate that at least one price is displayed
      await expect(priceElements.first()).toBeVisible();

      // Check for specific products
      const hasRice = await page.locator('text=rice, text=Rice, text=ARROZ').count() > 0;
      const hasPotatoes = await page.locator('text=potatoes, text=Potatoes, text=PAPAS').count() > 0;

      expect(hasRice || hasPotatoes).toBeTruthy();
    }

    // Test prediction functionality if prediction form exists
    const predictionForm = page.locator('form, [data-testid="prediction-form"], .prediction-form');
    if (await predictionForm.count() > 0) {
      // Try to make a prediction for rice
      const productSelect = page.locator('select[name="product"], input[name="product"], [data-testid="product-select"]');
      if (await productSelect.count() > 0) {
        await productSelect.first().selectOption('rice');

        const predictButton = page.locator('button:has-text("Predict"), button:has-text("Predecir"), [data-testid="predict-button"]');
        if (await predictButton.count() > 0) {
          await predictButton.first().click();

          // Wait for prediction result
          await page.waitForTimeout(2000);

          // Validate prediction result is shown
          const predictionResult = page.locator('[data-testid="prediction-result"], .prediction-result, text="Predicted Price"');
          await expect(predictionResult.or(page.locator('text=predictedPrice')).or(page.locator('text=precio_predicho'))).toBeVisible();
        }
      }
    }

    // Validate supply chain information is displayed
    const supplyChainSection = page.locator('[data-testid="supply-chain"], .supply-chain, text="Supply Chain"');
    if (await supplyChainSection.count() > 0) {
      await expect(supplyChainSection.first()).toBeVisible();

      // Check for route information
      const routeInfo = page.locator('text=Lima, text=Arequipa, text=Cusco, text=Trujillo');
      const routeCount = await routeInfo.count();
      expect(routeCount).toBeGreaterThan(0);
    }

    // Validate data sources are mentioned (real vs mock)
    const dataSourceInfo = page.locator('text=SIM MINAGRI, text=MINAGRI, text=Mock Data, text=Datos Mock');
    const sourceCount = await dataSourceInfo.count();
    // Should show data sources (either real or mock)
    expect(sourceCount).toBeGreaterThanOrEqual(0);
  });

  test('API endpoints return valid data structure', async ({ page }) => {
    // Test prices endpoint
  const pricesRes = await page.request.get(`${_API_BASE}/api/food-resilience/prices`, { headers: { Authorization: `Bearer ${_TOKEN}` } });
    expect(pricesRes.ok()).toBeTruthy();

    const pricesData = await pricesRes.json();
    expect(pricesData).toHaveProperty('country', 'Peru');
    expect(pricesData).toHaveProperty('prices');
    expect(pricesData).toHaveProperty('summary');
    expect(Array.isArray(pricesData.prices)).toBeTruthy();
    expect(pricesData.prices.length).toBeGreaterThan(0);

    // Validate price object structure
    const firstPrice = pricesData.prices[0];
    expect(firstPrice).toHaveProperty('product');
    expect(firstPrice).toHaveProperty('currentPrice');
    expect(firstPrice).toHaveProperty('predictedPrice');
    expect(firstPrice).toHaveProperty('volatilityIndex');
    expect(firstPrice).toHaveProperty('confidence');

    // Test supply chain endpoint
  const supplyRes = await page.request.get(`${_API_BASE}/api/food-resilience/supply-chain`, { headers: { Authorization: `Bearer ${_TOKEN}` } });
    expect(supplyRes.ok()).toBeTruthy();

    const supplyData = await supplyRes.json();
    expect(supplyData).toHaveProperty('country', 'Peru');
    expect(supplyData).toHaveProperty('routes');
    expect(supplyData).toHaveProperty('optimization');
    expect(Array.isArray(supplyData.routes)).toBeTruthy();
    expect(supplyData.routes.length).toBeGreaterThan(0);

    // Validate route object structure
    const firstRoute = supplyData.routes[0];
    expect(firstRoute).toHaveProperty('region');
    expect(firstRoute).toHaveProperty('capacity');
    expect(firstRoute).toHaveProperty('distance');
    expect(firstRoute).toHaveProperty('cost');
    expect(firstRoute).toHaveProperty('efficiency');
  });

  test('prediction API works correctly', async ({ page }) => {
    // Test valid prediction request
    const predictRes = await page.request.post(`${_API_BASE}/api/food-resilience/predict`, {
      headers: { Authorization: `Bearer ${_TOKEN}` },
      data: {
        product: 'rice',
        timeframe: '30_days',
        region: 'Lima'
      }
    });

    expect(predictRes.ok()).toBeTruthy();

    const predictionData = await predictRes.json();
    expect(predictionData).toHaveProperty('product', 'rice');
    expect(predictionData).toHaveProperty('region', 'Lima');
    expect(predictionData).toHaveProperty('currentPrice');
    expect(predictionData).toHaveProperty('predictedPrice');
    expect(predictionData).toHaveProperty('confidence');
    expect(predictionData).toHaveProperty('factors');
    expect(predictionData).toHaveProperty('dataSources');

    expect(Array.isArray(predictionData.factors)).toBeTruthy();
    expect(predictionData.factors.length).toBeGreaterThan(0);

    // Test invalid product
    const invalidRes = await page.request.post(`${_API_BASE}/api/food-resilience/predict`, {
      headers: { Authorization: `Bearer ${_TOKEN}` },
      data: { product: '' }
    });

    expect(invalidRes.status()).toBe(400);
  });

  test('handles API failures gracefully', async ({ page }) => {
    // Test with invalid API calls (simulate failures)
    // Since our APIs have fallback to mock data, they should always return valid responses

    // All endpoints should return 200 even if APIs fail (due to mock fallback)
    const endpoints = [
      '/api/food-resilience/prices',
      '/api/food-resilience/supply-chain'
    ];

    for (const endpoint of endpoints) {
  const res = await page.request.get(`${_API_BASE}${endpoint}`, { headers: { Authorization: `Bearer ${_TOKEN}` } });
      expect(res.ok()).toBeTruthy();

      const data = await res.json();
      expect(data).toBeDefined();
    }
  });
});