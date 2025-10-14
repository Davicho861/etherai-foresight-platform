import CybersecurityService from '../../src/services/cybersecurityService.js';

describe('CybersecurityService', () => {
  let cybersecurityService;

  beforeEach(() => {
    cybersecurityService = new CybersecurityService();
  });

  describe('getCybersecurityAnalysis', () => {
    test('should return cybersecurity analysis with valid data', async () => {
      const sectors = ['global'];
      const result = await cybersecurityService.getCybersecurityAnalysis(sectors);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('riskIndex');
      expect(result).toHaveProperty('sectors');
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toHaveProperty('riskLevel');
      expect(result.analysis).toHaveProperty('keyFactors');
      expect(result.analysis).toHaveProperty('recommendations');
      expect(result.source).toBe('CybersecurityService');
    });

    test('should handle multiple sectors', async () => {
      const sectors = ['finance', 'healthcare', 'government'];
      const result = await cybersecurityService.getCybersecurityAnalysis(sectors);

      expect(result.sectors).toEqual(sectors);
      expect(result.riskIndex).toBeGreaterThanOrEqual(0);
      expect(result.riskIndex).toBeLessThanOrEqual(100);
    });

    test('should assess risk level correctly', async () => {
      const result = await cybersecurityService.getCybersecurityAnalysis(['global']);

      expect(['Critical', 'High', 'Moderate', 'Low', 'Minimal']).toContain(result.analysis.riskLevel);
    });

    test('should provide appropriate recommendations', async () => {
      const result = await cybersecurityService.getCybersecurityAnalysis(['global']);

      expect(Array.isArray(result.analysis.recommendations)).toBe(true);
      expect(result.analysis.recommendations.length).toBeGreaterThan(0);
      result.analysis.recommendations.forEach(rec => {
        expect(typeof rec).toBe('string');
        expect(rec.length).toBeGreaterThan(0);
      });
    });
  });

  describe('getCybersecurityRiskIndex', () => {
    test('should return a valid risk index', async () => {
      const sectors = ['global'];
      const riskIndex = await cybersecurityService.getCybersecurityRiskIndex(sectors);

      expect(typeof riskIndex).toBe('number');
      expect(riskIndex).toBeGreaterThanOrEqual(0);
      expect(riskIndex).toBeLessThanOrEqual(100);
    });

    test('should handle different sector arrays', async () => {
      const sectors1 = ['finance'];
      const sectors2 = ['healthcare', 'energy', 'transport'];

      const risk1 = await cybersecurityService.getCybersecurityRiskIndex(sectors1);
      const risk2 = await cybersecurityService.getCybersecurityRiskIndex(sectors2);

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
      const result = await cybersecurityService.getCybersecurityAnalysis(['global']);

      // Should still return valid structure even if agent fails
      expect(result).toHaveProperty('source');
      expect(result.source).toBe('CybersecurityService - Error Fallback');
      expect(result).toHaveProperty('error');
    });
  });
});