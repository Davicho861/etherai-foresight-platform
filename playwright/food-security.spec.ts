import { test, expect } from '@playwright/test';

const API_BASE = process.env.TEST_MODE === 'true' ? 'http://localhost:3001' : (process.env.API_BASE || 'http://localhost:4000');
const TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

test.describe('Food Security API E2E', () => {
  test('food security endpoint returns valid data structure', async ({ page }) => {
    // Test the food security endpoint
    const res = await page.request.get(`${API_BASE}/api/global-risk/food-security`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();

    // Validate main structure
    expect(data).toHaveProperty('timestamp');
    expect(data).toHaveProperty('indicator');
    expect(data).toHaveProperty('indicatorCode');
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('summary');

    // Validate data array
    expect(Array.isArray(data.data)).toBeTruthy();
    expect(data.data.length).toBeGreaterThan(0);

    // Validate each country data
    const firstCountry = data.data[0];
    expect(firstCountry).toHaveProperty('country');
    expect(firstCountry).toHaveProperty('countryCode');
    expect(firstCountry).toHaveProperty('indicator');
    expect(firstCountry).toHaveProperty('value');
    expect(firstCountry).toHaveProperty('year');
    expect(firstCountry).toHaveProperty('riskLevel');

    // Validate risk level is valid
    expect(['low', 'medium', 'high', 'unknown']).toContain(firstCountry.riskLevel);

    // Validate summary
    expect(data.summary).toHaveProperty('totalCountries');
    expect(data.summary).toHaveProperty('highRiskCountries');
    expect(data.summary).toHaveProperty('averageValue');
    expect(data.summary).toHaveProperty('lastUpdate');

    expect(typeof data.summary.totalCountries).toBe('number');
    expect(typeof data.summary.highRiskCountries).toBe('number');
    expect(typeof data.summary.averageValue).toBe('number');
  });

  test('food security endpoint handles errors gracefully', async ({ page }) => {
    // Test with invalid method
    const postRes = await page.request.post(`${API_BASE}/api/global-risk/food-security`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(postRes.status()).toBe(405);

    const postData = await postRes.json();
    expect(postData).toHaveProperty('error', 'Method not allowed');
  });

  test('food security data includes LATAM countries', async ({ page }) => {
    const res = await page.request.get(`${API_BASE}/api/global-risk/food-security`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();

    // Should include major LATAM countries
    const countryCodes = data.data.map(item => item.countryCode);
    const expectedCountries = ['COL', 'PER', 'ARG', 'BRA', 'MEX'];

    // At least some of the expected countries should be present
    const presentCountries = expectedCountries.filter(code => countryCodes.includes(code));
    expect(presentCountries.length).toBeGreaterThan(0);
  });

  test('food security risk calculation is correct', async ({ page }) => {
    const res = await page.request.get(`${API_BASE}/api/global-risk/food-security`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();

    // Test risk level calculation logic
    data.data.forEach(country => {
      if (country.value === null || country.value === undefined) {
        expect(country.riskLevel).toBe('unknown');
      } else if (country.value >= 15) {
        expect(country.riskLevel).toBe('high');
      } else if (country.value >= 5) {
        expect(country.riskLevel).toBe('medium');
      } else {
        expect(country.riskLevel).toBe('low');
      }
    });
  });

  test('food security endpoint is resilient to API failures', async ({ page }) => {
    // Since the endpoint has fallback to mock data, it should always return valid data
    // even if World Bank API fails
    const res = await page.request.get(`${API_BASE}/api/global-risk/food-security`, {
      headers: { Authorization: `Bearer ${TOKEN}` }
    });
    expect(res.ok()).toBeTruthy();

    const data = await res.json();
    expect(data.data.length).toBeGreaterThan(0);
    expect(data.summary.totalCountries).toBeGreaterThan(0);
  });
});