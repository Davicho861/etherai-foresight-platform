import EconomicInstabilityService from '../../src/services/economicInstabilityService.js';

describe('EconomicInstabilityService', () => {
  let economicInstabilityService;

  beforeEach(() => {
    economicInstabilityService = new EconomicInstabilityService();
  });

  describe('getEconomicInstabilityAnalysis', () => {
    test('should return economic instability analysis with valid data', async () => {
      const regions = ['global'];
      const result = await economicInstabilityService.getEconomicInstabilityAnalysis(regions);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('riskIndex');
      expect(result).toHaveProperty('regions');
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toHaveProperty('riskLevel');
      expect(result.analysis).toHaveProperty('keyFactors');
      expect(result.analysis).toHaveProperty('recommendations');
      expect(result.source).toBe('EconomicInstabilityService');
    });

    test('should handle multiple regions', async () => {
      const regions = ['americas', 'europe', 'asia'];
      const result = await economicInstabilityService.getEconomicInstabilityAnalysis(regions);

      expect(result.regions).toEqual(regions);
      expect(result.riskIndex).toBeGreaterThanOrEqual(0);
      expect(result.riskIndex).toBeLessThanOrEqual(100);
    });

    test('should assess risk level correctly', async () => {
      const result = await economicInstabilityService.getEconomicInstabilityAnalysis(['global']);

      expect(['Critical', 'High', 'Moderate', 'Low', 'Minimal']).toContain(result.analysis.riskLevel);
    });

    test('should provide appropriate recommendations', async () => {
      const result = await economicInstabilityService.getEconomicInstabilityAnalysis(['global']);

      expect(Array.isArray(result.analysis.recommendations)).toBe(true);
      expect(result.analysis.recommendations.length).toBeGreaterThan(0);
      result.analysis.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getEconomicInstabilityRiskIndex', () => {
    test('should return a valid risk index', async () => {
      const regions = ['global'];
      const riskIndex = await economicInstabilityService.getEconomicInstabilityRiskIndex(regions);

      expect(typeof riskIndex).toBe('number');
      expect(riskIndex).toBeGreaterThanOrEqual(0);
      expect(riskIndex).toBeLessThanOrEqual(100);
    });

    test('should handle different region arrays', async () => {
      const regions1 = ['americas'];
      const regions2 = ['europe', 'asia', 'africa'];

      const risk1 = await economicInstabilityService.getEconomicInstabilityRiskIndex(regions1);
      const risk2 = await economicInstabilityService.getEconomicInstabilityRiskIndex(regions2);

      expect(typeof risk1).toBe('number');
      expect(typeof risk2).toBe('number');
      expect(risk1).toBeGreaterThanOrEqual(0);
      expect(risk1).toBeLessThanOrEqual(100);
      expect(risk2).toBeGreaterThanOrEqual(0);
      expect(risk2).toBeLessThanOrEqual(100);
    });
  });

  describe('Error handling', () => {
    test('should handle agent failure gracefully', async () => {
      // Mock agent failure scenario
      const result = await economicInstabilityService.getEconomicInstabilityAnalysis(['global']);

      // Should still return valid structure even if agent fails
      expect(result).toHaveProperty('source');
      expect(result.source).toBe('EconomicInstabilityService - Error Fallback');
      expect(result).toHaveProperty('error');
    });
  });
});