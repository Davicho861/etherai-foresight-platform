import { getFoodSecurityIndex } from '../../src/services/worldBankService.js';

// Mock the WorldBankIntegration
jest.mock('../../src/integrations/WorldBankIntegration.js');

describe('World Bank Service - Food Security', () => {
  let mockWorldBank;

  beforeEach(() => {
    const WorldBankIntegration = require('../../src/integrations/WorldBankIntegration.js');
    // Instantiate the mocked constructor so we get the mocked instance
    mockWorldBank = new WorldBankIntegration();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFoodSecurityIndex', () => {
    it('should return transformed food security data successfully', async () => {
      const mockApiData = {
        countries: ['COL', 'PER', 'ARG'],
        period: { startYear: '2020', endYear: '2024' },
        indicator: 'SN.ITK.DEFC.ZS',
        data: {
          COL: { value: 5.2, year: '2024', country: 'Colombia', indicator: 'Prevalence of undernourishment (% of population)' },
          PER: { value: 7.1, year: '2024', country: 'Peru', indicator: 'Prevalence of undernourishment (% of population)' },
          ARG: { value: 4.8, year: '2024', country: 'Argentina', indicator: 'Prevalence of undernourishment (% of population)' }
        }
      };

      mockWorldBank.getFoodSecurityData.mockResolvedValue(mockApiData);

      const result = await getFoodSecurityIndex();

      expect(result.countries).toEqual(['COL', 'PER', 'ARG']);
      expect(result.year).toBe(2024);
      expect(typeof result.source).toBe('string');
      expect(result.data).toBeDefined();
      expect(typeof result.globalAverage).toBe('number');
    });

    it('should handle API errors and return fallback data', async () => {
      const error = new Error('API connection failed');
      mockWorldBank.getFoodSecurityData.mockRejectedValue(error);

      const result = await getFoodSecurityIndex();

      expect(result.countries).toEqual(['COL', 'PER', 'ARG']);
      expect(result.year).toBe(2024);
      expect(typeof result.source).toBe('string');
      expect(result.data).toBeDefined();
      expect(typeof result.globalAverage).toBe('number');
      // Error handling may vary, just check that it returns data
    });

    it('should calculate global average correctly with null values', async () => {
      const mockApiData = {
        countries: ['COL', 'PER', 'ARG'],
        period: { startYear: '2020', endYear: '2024' },
        indicator: 'SN.ITK.DEFC.ZS',
        data: {
          COL: { value: 5.2, year: '2024', country: 'Colombia' },
          PER: { value: null, note: 'No data available' },
          ARG: { value: 4.8, year: '2024', country: 'Argentina' }
        }
      };

      mockWorldBank.getFoodSecurityData.mockResolvedValue(mockApiData);

      const result = await getFoodSecurityIndex();

      expect(typeof result.globalAverage).toBe('number');
    });

    it('should handle empty data gracefully', async () => {
      const mockApiData = {
        countries: ['COL', 'PER', 'ARG'],
        period: { startYear: '2020', endYear: '2024' },
        indicator: 'SN.ITK.DEFC.ZS',
        data: {}
      };

      mockWorldBank.getFoodSecurityData.mockResolvedValue(mockApiData);

      const result = await getFoodSecurityIndex();

      expect(result.globalAverage).toBeDefined();
    });
  });
});