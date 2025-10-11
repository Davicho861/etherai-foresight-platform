import WorldBankIntegration from '../../src/integrations/WorldBankIntegration.js';

// Mock node-fetch
jest.mock('node-fetch', () => jest.fn());
const fetch = require('node-fetch');

describe('WorldBankIntegration', () => {
  let integration;

  beforeEach(() => {
    jest.clearAllMocks();
    delete process.env.FORCE_MOCKS;
    integration = new WorldBankIntegration();
  });

  describe('getKeyEconomicData', () => {
    it('should return mock data when FORCE_MOCKS is true', async () => {
      process.env.FORCE_MOCKS = 'true';
      const newIntegration = new WorldBankIntegration();

      const result = await newIntegration.getKeyEconomicData('COL', '2020', '2024');

      expect(result).toHaveProperty('country', 'COL');
      expect(result).toHaveProperty('isMock', true);
      expect(result.indicators['NY.GDP.PCAP.CD']).toBeDefined();
      expect(result.indicators['NY.GDP.PCAP.CD']).toEqual({
        value: 6500.23,
        year: '2023',
        country: 'Mockland'
      });

      delete process.env.FORCE_MOCKS;
    });

    it('should fetch real data when not mocked', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([
          {}, // metadata
          [
            { date: '2023', value: 100, country: { value: 'Colombia' } },
            { date: '2022', value: 95, country: { value: 'Colombia' } }
          ]
        ])
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await integration.getKeyEconomicData('COL', '2020', '2024');

      expect(fetch).toHaveBeenCalledTimes(6); // 6 indicators
      expect(result.country).toBe('COL');
      expect(result.indicators['NY.GDP.PCAP.CD']).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      fetch.mockResolvedValue({
        ok: false,
        status: 500
      });

      const result = await integration.getKeyEconomicData('COL', '2020', '2024');

      expect(result.indicators['NY.GDP.PCAP.CD']).toEqual({
        error: 'API error: 500'
      });
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const result = await integration.getKeyEconomicData('COL', '2020', '2024');

      expect(result.error).toBe('Network error');
      expect(result.indicators).toEqual({});
    });
  });

  describe('getFoodSecurityData', () => {
    it('should return mock data when FORCE_MOCKS is true', async () => {
      process.env.FORCE_MOCKS = 'true';
      const newIntegration = new WorldBankIntegration();

      const result = await newIntegration.getFoodSecurityData(['COL'], '2020', '2024');

      expect(result).toHaveProperty('isMock', true);
      expect(result.data).toHaveProperty('COL');
      expect(result.data.COL).toHaveProperty('value');
      expect(result.data.COL).toHaveProperty('indicator');

      delete process.env.FORCE_MOCKS;
    });

    it('should fetch real food security data', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([
          {},
          [{ date: '2023', value: 7.5, country: { value: 'Colombia' } }]
        ])
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await integration.getFoodSecurityData(['COL'], '2020', '2024');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('SN.ITK.DEFC.ZS')
      );
      expect(result.data.COL.value).toBe(7.5);
    });

    it('should handle multiple countries', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([
          {},
          [{ date: '2023', value: 5.0, country: { value: 'Colombia' } }]
        ])
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await integration.getFoodSecurityData(['COL', 'PER'], '2020', '2024');

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result.data).toHaveProperty('COL');
      expect(result.data).toHaveProperty('PER');
    });
  });

  describe('getEconomicIndicators', () => {
    it('should sort data by date descending', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([
          {},
          [
            { date: '2021', value: 90, country: { value: 'Colombia' } },
            { date: '2023', value: 100, country: { value: 'Colombia' } },
            { date: '2022', value: 95, country: { value: 'Colombia' } }
          ]
        ])
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await integration.getEconomicIndicators('COL', ['TEST.INDICATOR'], '2020', '2024');

      expect(result.indicators['TEST.INDICATOR'].value).toBe(100); // Most recent (2023)
      expect(result.indicators['TEST.INDICATOR'].year).toBe('2023');
    });

    it('should handle no data available', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue([{}, []]) // Empty data array
      };

      fetch.mockResolvedValue(mockResponse);

      const result = await integration.getEconomicIndicators('COL', ['TEST.INDICATOR'], '2020', '2024');

      expect(result.indicators['TEST.INDICATOR']).toEqual({
        value: null,
        note: 'No data available'
      });
    });
  });
});