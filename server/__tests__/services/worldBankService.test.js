import { getFoodSecurityIndex } from '../../src/services/worldBankService.js';

// Mock the WorldBankIntegration
jest.mock('../../src/integrations/WorldBankIntegration.js', () => {
  return jest.fn().mockImplementation(() => ({
    getFoodSecurityData: jest.fn()
  }));
});

describe('World Bank Service - Food Security', () => {
  let mockWorldBank;

  beforeEach(() => {
    const WorldBankIntegration = require('../../src/integrations/WorldBankIntegration.js');
    mockWorldBank = WorldBankIntegration.mock.results[0].value;
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

      expect(mockWorldBank.getFoodSecurityData).toHaveBeenCalledWith(['COL', 'PER', 'ARG'], '2020', '2024');
      expect(result).toEqual({
        countries: ['COL', 'PER', 'ARG'],
        year: 2024,
        source: "World Bank API - SN.ITK.DEFC.ZS",
        data: mockApiData.data,
        globalAverage: 5.7 // (5.2 + 7.1 + 4.8) / 3
      });
    });

    it('should handle API errors and return fallback data', async () => {
      const error = new Error('API connection failed');
      mockWorldBank.getFoodSecurityData.mockRejectedValue(error);

      const result = await getFoodSecurityIndex();

      expect(result).toEqual({
        countries: ['COL', 'PER', 'ARG'],
        year: 2024,
        source: "Fallback Mock Data",
        data: {
          COL: { value: 5.2, year: '2024', country: 'Colombia' },
          PER: { value: 7.1, year: '2024', country: 'Peru' },
          ARG: { value: 4.8, year: '2024', country: 'Argentina' }
        },
        globalAverage: 5.7,
        error: error.message
      });
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

      expect(result.globalAverage).toBe(5.0); // (5.2 + 4.8) / 2
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

      expect(result.globalAverage).toBeNull();
    });
  });
});