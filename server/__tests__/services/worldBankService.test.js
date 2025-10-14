const { getFoodSecurityIndex } = require('../../src/services/worldBankService');

// Mock the WorldBankIntegration
jest.mock('../../src/integrations/WorldBankIntegration.js', () => {
  return jest.fn().mockImplementation(() => ({
    getFoodSecurityData: jest.fn(),
  }));
});

// Mock fetch globally
global.fetch = jest.fn();

describe('worldBankService', () => {
  let mockWorldBankIntegration;

  beforeEach(() => {
    jest.clearAllMocks();

    // Get the mock constructor and instance
    const MockWorldBankIntegration = require('../../src/integrations/WorldBankIntegration.js');
    mockWorldBankIntegration = new MockWorldBankIntegration();
  });

  afterEach(() => {
    // Clear the cached instance
    jest.resetModules();
  });

  describe('getFoodSecurityIndex', () => {
    it('should return data from WorldBankIntegration when available', async () => {
      const mockApiData = {
        data: [
          { countryCode: 'COL', value: 15.5, year: '2024', country: 'Colombia' },
          { countryCode: 'PER', value: 12.3, year: '2024', country: 'Peru' },
        ],
        countries: ['COL', 'PER'],
        period: { endYear: 2024 },
        source: 'World Bank API',
        summary: { averageValue: 13.9 },
      };

      mockWorldBankIntegration.getFoodSecurityData.mockResolvedValue(mockApiData);

      const result = await getFoodSecurityIndex();

      expect(mockWorldBankIntegration.getFoodSecurityData).toHaveBeenCalledWith(
        ['COL', 'PER'],
        '2020',
        '2024'
      );

      expect(result).toEqual({
        countries: ['COL', 'PER'],
        year: 2024,
        source: 'World Bank Integration',
        data: {
          COL: { value: 15.5, year: '2024', country: 'Colombia' },
          PER: { value: 12.3, year: '2024', country: 'Peru' },
        },
        globalAverage: 13.9,
      });
    });

    it('should handle WorldBankIntegration errors and fallback to serverless endpoint', async () => {
      mockWorldBankIntegration.getFoodSecurityData.mockRejectedValue(
        new Error('Integration failed')
      );

      const mockServerlessData = {
        data: [
          { countryCode: 'COL', value: 16.0, year: '2024', country: 'Colombia' },
        ],
        countries: ['COL'],
        period: { endYear: 2024 },
        source: 'Serverless API',
        summary: { averageValue: 16.0 },
      };

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockServerlessData),
      });

      const result = await getFoodSecurityIndex();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:4010/api/global-risk/food-security'
      );

      expect(result).toEqual({
        countries: ['COL'],
        year: 2024,
        source: 'World Bank Serverless',
        data: {
          COL: { value: 16.0, year: '2024', country: 'Colombia' },
        },
        globalAverage: 16.0,
      });
    });

    it('should handle serverless endpoint failure and return fallback data', async () => {
      mockWorldBankIntegration.getFoodSecurityData.mockRejectedValue(
        new Error('Integration failed')
      );

      global.fetch.mockRejectedValue(new Error('Network error'));

      const result = await getFoodSecurityIndex();

      expect(result).toEqual({
        countries: ['COL', 'PER'],
        year: 2024,
        source: 'Fallback Mock Data - WorldBank',
        data: {
          COL: { value: 0, year: '2024', country: 'Colombia' },
          PER: { value: 0, year: '2024', country: 'Peru' },
        },
        globalAverage: null,
      });
    });

    it('should handle malformed API data gracefully', async () => {
      const malformedData = {
        data: null, // Invalid data structure
        countries: undefined,
      };

      mockWorldBankIntegration.getFoodSecurityData.mockResolvedValue(malformedData);

      const result = await getFoodSecurityIndex();

      expect(result).toEqual({
        countries: [],
        year: 2024,
        source: 'World Bank Integration',
        data: {},
        globalAverage: null,
      });
    });

    it('should handle null values in data correctly', async () => {
      const dataWithNulls = {
        data: [
          { countryCode: 'COL', value: null, year: '2024', country: 'Colombia' },
          { countryCode: 'PER', value: 10.5, year: '2024', country: 'Peru' },
        ],
        countries: ['COL', 'PER'],
        period: { endYear: 2024 },
      };

      mockWorldBankIntegration.getFoodSecurityData.mockResolvedValue(dataWithNulls);

      const result = await getFoodSecurityIndex();

      expect(result.data).toEqual({
        COL: { value: null, year: '2024', country: 'Colombia' },
        PER: { value: 10.5, year: '2024', country: 'Peru' },
      });
      expect(result.globalAverage).toBe(10.5); // Should exclude null values
    });

    it('should handle different country code formats', async () => {
      const mixedFormatData = {
        data: [
          { countryCode: 'col', value: 15.0, year: '2024', country: 'Colombia' }, // lowercase
          { countryCode: 'Per', value: 12.0, year: '2024', country: 'Peru' }, // mixed case
        ],
        countries: ['col', 'Per'],
        period: { endYear: 2024 },
      };

      mockWorldBankIntegration.getFoodSecurityData.mockResolvedValue(mixedFormatData);

      const result = await getFoodSecurityIndex();

      expect(result.data).toEqual({
        COL: { value: 15.0, year: '2024', country: 'Colombia' },
        PER: { value: 12.0, year: '2024', country: 'Peru' },
      });
    });

    it('should calculate global average correctly', async () => {
      const testData = {
        data: [
          { countryCode: 'COL', value: 10, year: '2024', country: 'Colombia' },
          { countryCode: 'PER', value: 20, year: '2024', country: 'Peru' },
          { countryCode: 'ARG', value: 30, year: '2024', country: 'Argentina' },
        ],
        countries: ['COL', 'PER', 'ARG'],
        period: { endYear: 2024 },
      };

      mockWorldBankIntegration.getFoodSecurityData.mockResolvedValue(testData);

      const result = await getFoodSecurityIndex();

      expect(result.globalAverage).toBe(20); // (10 + 20 + 30) / 3
    });

    it('should throw error when all integrations fail and no fallback available', async () => {
      mockWorldBankIntegration.getFoodSecurityData.mockRejectedValue(
        new Error('Integration failed')
      );

      global.fetch.mockRejectedValue(new Error('Network error'));

      // Mock process.env to remove WORLDBANK_SERVERLESS_URL
      const originalEnv = process.env;
      delete process.env.WORLDBANK_SERVERLESS_URL;

      try {
        await getFoodSecurityIndex();
        fail('Should have thrown an error');
      } catch (error) {
        expect(error.message).toContain('Integration failed');
      } finally {
        process.env = originalEnv;
      }
    });

    it('should use custom serverless URL from environment', async () => {
      mockWorldBankIntegration.getFoodSecurityData.mockRejectedValue(
        new Error('Integration failed')
      );

      const customUrl = 'https://custom-api.example.com/food-security';
      process.env.WORLDBANK_SERVERLESS_URL = customUrl;

      global.fetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({
          data: [{ countryCode: 'COL', value: 15.0, year: '2024', country: 'Colombia' }],
          countries: ['COL'],
          period: { endYear: 2024 },
        }),
      });

      await getFoodSecurityIndex();

      expect(global.fetch).toHaveBeenCalledWith(customUrl);

      delete process.env.WORLDBANK_SERVERLESS_URL;
    });
  });
});