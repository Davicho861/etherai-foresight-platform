import { CircuitBreaker, retryWithBackoff, fetchWithTimeout, isJsonResponse } from '../utils/resilience.js';

class FMIIntegration {
  constructor() {
    this.baseUrl = process.env.TEST_MODE === 'true'
      ? 'http://mock-api-server:3001/fmi'
      : 'https://www.imf.org/external/datamapper/api/v1';
    this.circuitBreaker = new CircuitBreaker(3, 60000); // 3 failures, 1 min recovery
  }

  async getDebtData(country, startYear, endYear) {
    try {
      const result = await this.circuitBreaker.execute(async () => {
        return await retryWithBackoff(async () => {
          // Attempt to fetch real IMF data with timeout
          const url = `${this.baseUrl}/debt/GGXWDG_NGDP/${country}?startYear=${startYear}&endYear=${endYear}`;
          const response = await fetchWithTimeout(url, {}, 15000);

          if (!response.ok) {
            throw new Error(`IMF API error: ${response.status} ${response.statusText}`);
          }

          // Check if response is actually JSON
          if (!isJsonResponse(response)) {
            throw new Error(`IMF API returned non-JSON response: ${response.headers.get('content-type')}`);
          }

          let data;
          try {
            data = await response.json();
          } catch (parseError) {
            throw new Error(`IMF API returned invalid JSON: ${parseError.message}`);
          }

          // Validate data structure
          if (!Array.isArray(data)) {
            throw new Error('IMF API returned invalid data structure');
          }

          // Assuming the API returns an array of objects with year and value
          const debtData = data.map(item => ({
            year: parseInt(item.year) || item.year,
            value: parseFloat(item.value) || item.value
          }));

          return {
            country,
            period: { startYear, endYear },
            debtData,
            isMock: false
          };
        }, 2, 2000, 10000); // 2 retries, base delay 2s, max 10s
      });

      return result;

    } catch (error) {
      console.log(`IMF API failed for ${country} (${startYear}-${endYear}): ${error.message}. Using mock data.`);

      // Fallback to mock data
      const baseDebtLevels = {
        'COL': 55, // Colombia ~55% GDP
        'PER': 35, // Peru ~35% GDP
        'ARG': 85, // Argentina ~85% GDP
        'MEX': 50, // Mexico ~50% GDP
        'BRA': 80, // Brazil ~80% GDP
        'CHL': 40  // Chile ~40% GDP
      };

      const baseLevel = baseDebtLevels[country.toUpperCase()] || 50;
      const variation = (Math.random() - 0.5) * 10; // ±5% variation

      const debtData = [
        { year: startYear, value: Math.max(20, baseLevel + variation - 2) },
        { year: endYear, value: Math.max(20, baseLevel + variation + 2) }
      ];

      return {
        country,
        period: { startYear, endYear },
        debtData,
        isMock: true,
        error: error.message
      };
    }
  }
}

export default FMIIntegration;