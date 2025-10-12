import SatelliteIntegration from '../../src/integrations/SatelliteIntegration.js';
import { server } from '../mocks/server.js';

describe('SatelliteIntegration', () => {
  let integration;

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.FORCE_MOCKS;
    integration = new SatelliteIntegration();
  });

  describe('getNDVIData', () => {
    it('should fetch real NDVI data and convert from temperature', async () => {
      const result = await integration.getNDVIData(4.7110, -74.0721, '2024-01-01', '2024-01-02');

      expect(result.location).toEqual({ latitude: 4.7110, longitude: -74.0721 });
      expect(result.ndviData).toHaveLength(2);
      expect(result.ndviData[0]).toHaveProperty('date', '2024-01-01');
      expect(result.ndviData[0]).toHaveProperty('ndvi');
      expect(result.ndviData[0].ndvi).toBeGreaterThanOrEqual(0);
      expect(result.ndviData[0].ndvi).toBeLessThanOrEqual(1);
      expect(result.isMock).toBe(false);
    });

    it('should handle API errors and return mock data', async () => {
      const result = await integration.getNDVIData(4.7110, -74.0721, '2024-01-01', '2024-01-03');

      expect(result.isMock).toBe(true);
      expect(result.ndviData).toHaveLength(3); // 3 days
      expect(result.ndviData.every(d => d.ndvi >= 0 && d.ndvi <= 1)).toBe(true);
    });

    it('should generate seasonal NDVI patterns in mock data', async () => {
      // Test March (growing season)
      const resultMarch = await integration.getNDVIData(4.7110, -74.0721, '2024-03-01', '2024-03-01');
      expect(resultMarch.ndviData[0].ndvi).toBeGreaterThan(0.2); // Higher in growing season

      // Test December (dry season)
      const resultDec = await integration.getNDVIData(4.7110, -74.0721, '2024-12-01', '2024-12-01');
      expect(resultDec.ndviData[0].ndvi).toBeLessThan(0.6); // Lower in dry season
    });

    it('should calculate NDVI correctly from temperature data', async () => {
      const result = await integration.getNDVIData(4.7110, -74.0721, '2024-01-01', '2024-01-01');

      // Avg temp = (22+18)/2 = 20°C
      // NDVI should be around 0.5 + (20-15)*0.02 = 0.6
      expect(result.ndviData[0].ndvi).toBeGreaterThan(0.3);
      expect(result.ndviData[0].ndvi).toBeLessThan(0.8);
    });

    it('should handle extreme temperatures', async () => {
      const result = await integration.getNDVIData(4.7110, -74.0721, '2024-01-01', '2024-01-01');

      // Avg temp = 32.5°C > 30°C, should decline
      expect(result.ndviData[0].ndvi).toBeLessThan(0.8);
    });
  });

  describe('getCropHealthPrediction', () => {
    it('should return crop health prediction', async () => {
      const result = await integration.getCropHealthPrediction('COL', 'maize');

      expect(result.country).toBe('COL');
      expect(result.cropType).toBe('maize');
      expect(result).toHaveProperty('currentHealth');
      expect(result).toHaveProperty('predictedYield');
      expect(result).toHaveProperty('riskLevel');
      expect(result).toHaveProperty('recommendations');

      expect(result.currentHealth).toBeGreaterThanOrEqual(0.6);
      expect(result.currentHealth).toBeLessThanOrEqual(1.0);
      expect(result.predictedYield).toBeGreaterThanOrEqual(80);
      expect(result.predictedYield).toBeLessThanOrEqual(100);
      expect(['high', 'medium', 'low']).toContain(result.riskLevel);
      expect(Array.isArray(result.recommendations)).toBe(true);
    });

    it('should handle different crop types', async () => {
      const result = await integration.getCropHealthPrediction('PER', 'rice');

      expect(result.country).toBe('PER');
      expect(result.cropType).toBe('rice');
    });
  });
});