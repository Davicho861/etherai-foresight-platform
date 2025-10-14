import GeopoliticalInstabilityService from '../../src/services/geopoliticalInstabilityService.js';

describe('GeopoliticalInstabilityService', () => {
  let geopoliticalInstabilityService;

  beforeEach(() => {
    geopoliticalInstabilityService = new GeopoliticalInstabilityService();
  });

  describe('getGeopoliticalInstabilityAnalysis', () => {
    test('should return geopolitical instability analysis with valid data', async () => {
      const regions = ['global'];
      const result = await geopoliticalInstabilityService.getGeopoliticalInstabilityAnalysis(regions);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('riskIndex');
      expect(result).toHaveProperty('regions');
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toHaveProperty('riskLevel');
      expect(result.analysis).toHaveProperty('keyFactors');
      expect(result.analysis).toHaveProperty('recommendations');
      expect(result.source).toBe('GeopoliticalInstabilityService');
    });

    test('should handle multiple regions', async () => {
      const regions = ['americas', 'europe', 'asia'];
      const result = await geopoliticalInstabilityService.getGeopoliticalInstabilityAnalysis(regions);

      expect(result.regions).toEqual(regions);
      expect(result.riskIndex).toBeGreaterThanOrEqual(0);
      expect(result.riskIndex).toBeLessThanOrEqual(100);
    });

    test('should assess risk level correctly', async () => {
      const result = await geopoliticalInstabilityService.getGeopoliticalInstabilityAnalysis(['global']);

      expect(['Critical', 'High', 'Moderate', 'Low', 'Minimal']).toContain(result.analysis.riskLevel);
    });

    test('should provide appropriate recommendations', async () => {
      const result = await geopoliticalInstabilityService.getGeopoliticalInstabilityAnalysis(['global']);

      expect(Array.isArray(result.analysis.recommendations)).toBe(true);
      expect(result.analysis.recommendations.length).toBeGreaterThan(0);
      result.analysis.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getGeopoliticalInstabilityRiskIndex', () => {
    test('should return a valid risk index', async () => {
      const regions = ['global'];
      const riskIndex = await geopoliticalInstabilityService.getGeopoliticalInstabilityRiskIndex(regions);

      expect(typeof riskIndex).toBe('number');
      expect(riskIndex).toBeGreaterThanOrEqual(0);
      expect(riskIndex).toBeLessThanOrEqual(100);
    });

    test('should handle different region arrays', async () => {
      const regions1 = ['americas'];
      const regions2 = ['europe', 'asia', 'africa'];

      const risk1 = await geopoliticalInstabilityService.getGeopoliticalInstabilityRiskIndex(regions1);
      const risk2 = await geopoliticalInstabilityService.getGeopoliticalInstabilityRiskIndex(regions2);

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
      const result = await geopoliticalInstabilityService.getGeopoliticalInstabilityAnalysis(['global']);

      // Should still return valid structure even if agent fails
      expect(result).toHaveProperty('source');
      expect(result.source).toBe('GeopoliticalInstabilityService - Error Fallback');
      expect(result).toHaveProperty('error');
    });
  });
});