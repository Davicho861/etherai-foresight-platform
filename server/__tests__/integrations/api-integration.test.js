import SIMIntegration from '../../src/integrations/SIMIntegration.js';
import MINAGRIIntegration from '../../src/integrations/MINAGRIIntegration.js';
import INEIIntegration from '../../src/integrations/INEIIntegration.js';

// Atenea's Decree: Timeouts are a relic of an imperfect past.
// With Hefesto's global mock, all external calls are instantaneous.
// The 'jest-fetch-mock' library is no longer needed; our own Oracle provides for us.

describe('API Integration Tests', () => {
  let simIntegration;
  let minagriIntegration;
  let ineiIntegration;

  beforeEach(() => {
    // Reset the history of our global mock to ensure test purity.
    global.mockFetch.mockClear();
    simIntegration = new SIMIntegration();
    minagriIntegration = new MINAGRIIntegration();
    ineiIntegration = new INEIIntegration();
  });

  describe('SIM Integration - Mock Validation', () => {
    it('should use fallback mock data when the API call fails', async () => {
      // Simulate a network failure.
      global.mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await simIntegration.getFoodPrices('rice', 'Lima');

      // The integration should gracefully fall back to its internal mock data.
      expect(result.isMock).toBe(true);
      expect(result.priceData.currentPrice).toBeDefined();
      expect(result.product).toBe('rice');
    });

    it('should handle successful API response correctly', async () => {
      const mockApiResponse = {
        // This structure mimics the real external API
        precio_actual: 5.55,
        // ... other fields
      };
      // Simulate a successful network response.
      global.mockFetch.mockResolvedValue(new global.Response(JSON.stringify(mockApiResponse)));

      const result = await simIntegration.getFoodPrices('rice', 'Lima');

      // The integration should report that it's NOT using internal mock data.
      expect(result.isMock).toBe(false);
      expect(result.priceData.currentPrice).toBe(5.55);
    });
  });

  describe('MINAGRI Integration - Mock Validation', () => {
    it('should use fallback mock for agricultural production on failure', async () => {
      global.mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await minagriIntegration.getAgriculturalProduction('rice', 2024);

      expect(result.isMock).toBe(true);
      expect(result.product).toBe('rice');
      expect(result.productionData).toBeDefined();
    });

    it('should use fallback mock for supply chain on failure', async () => {
      global.mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await minagriIntegration.getSupplyChainCapacity('Lima');

      expect(result.isMock).toBe(true);
      expect(result.region).toBe('Lima');
      expect(result.capacityData[0].capacity).toBeGreaterThan(0);
    });
  });

  describe('INEI Integration - Mock Validation', () => {
    it('should use fallback mock for demographic data on failure', async () => {
      global.mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await ineiIntegration.getDemographicData('Lima', 2024);

      expect(result.isMock).toBe(true);
      expect(result.department).toBe('Lima');
      expect(result.demographicData.population).toBeGreaterThan(0);
    });

    it('should use fallback mock for economic indicators on failure', async () => {
      global.mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await ineiIntegration.getEconomicIndicators('Lima', 2024);

      expect(result.isMock).toBe(true);
      expect(result.department).toBe('Lima');
      expect(result.economicData.gdp).toBeGreaterThan(0);
    });
  });

  describe('Cross-API Integration Validation', () => {
    it('should validate data consistency using fallbacks when all APIs fail', async () => {
      // A single decree of failure for all subsequent fetches.
      global.mockFetch.mockRejectedValue(new Error('Universal network error'));

      const [priceResult, productionResult, demographicResult] = await Promise.all([
        simIntegration.getFoodPrices('rice', 'Lima'),
        minagriIntegration.getAgriculturalProduction('rice', 2024),
        ineiIntegration.getDemographicData('Lima', 2024)
      ]);

      // All integrations must report using their fallback mocks.
      expect(priceResult.isMock).toBe(true);
      expect(productionResult.isMock).toBe(true);
      expect(demographicResult.isMock).toBe(true);

      // And the data structures must still be intact.
      expect(priceResult.priceData).toHaveProperty('currentPrice');
      expect(productionResult.productionData[0]).toHaveProperty('production');
      expect(demographicResult.demographicData).toHaveProperty('population');
    });

    it('should handle mixed success and failure scenarios', async () => {
        const mockIneíResponse = {
            poblacion: 10500000,
            // ... other fields
        };
      // Setup a mixed failure/success scenario.
      global.mockFetch
        .mockRejectedValueOnce(new Error('SIM API unavailable')) // SIM fails
        .mockRejectedValueOnce(new Error('MINAGRI API unavailable')) // MINAGRI fails
        .mockResolvedValueOnce(new global.Response(JSON.stringify(mockIneíResponse))); // INEI succeeds

      const [priceResult, productionResult, demographicResult] = await Promise.all([
        simIntegration.getFoodPrices('rice', 'Lima'),
        minagriIntegration.getAgriculturalProduction('rice', 2024),
        ineiIntegration.getDemographicData('Lima', 2024)
      ]);

      // Validate the outcome for each integration.
      expect(priceResult.isMock).toBe(true); // Fell back to mock.
      expect(productionResult.isMock).toBe(true); // Fell back to mock.
      expect(demographicResult.isMock).toBe(false); // Used the successful response.
      expect(demographicResult.demographicData.population).toBe(10500000);
    });
  });
});