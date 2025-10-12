import WorldBankIntegration from '../../src/integrations/WorldBankIntegration.js';
import { server } from '../mocks/server.js';

describe('WorldBankIntegration', () => {
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
      const result = await integration.getKeyEconomicData('COL', '2020', '2024');

      expect(result.country).toBe('COL');
      expect(result.indicators['NY.GDP.PCAP.CD']).toBeDefined();
    });

    it('should handle API errors gracefully', async () => {
      const result = await integration.getKeyEconomicData('COL', '2020', '2024');

      expect(result.indicators['NY.GDP.PCAP.CD']).toBeDefined();
    });

    it('should handle network errors', async () => {
      const result = await integration.getKeyEconomicData('COL', '2020', '2024');

      expect(result.indicators).toBeDefined();
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
      const result = await integration.getFoodSecurityData(['COL'], '2020', '2024');

      expect(result.data.COL.value).toBe(7.5);
    });

    it('should handle multiple countries', async () => {
      const result = await integration.getFoodSecurityData(['COL', 'PER'], '2020', '2024');

      expect(result.data).toHaveProperty('COL');
      expect(result.data).toHaveProperty('PER');
    });
  });

  describe('getEconomicIndicators', () => {
    it('should sort data by date descending', async () => {
      const result = await integration.getEconomicIndicators('COL', ['TEST.INDICATOR'], '2020', '2024');

      expect(result.indicators['TEST.INDICATOR'].value).toBe(7.5); // From MSW handler
      expect(result.indicators['TEST.INDICATOR'].year).toBe('2023');
    });

    it('should handle no data available', async () => {
      const result = await integration.getEconomicIndicators('COL', ['TEST.INDICATOR'], '2020', '2024');

      expect(result.indicators['TEST.INDICATOR']).toBeDefined();
    });
  });
});