import { server } from '../mocks/server.js';

describe('worldBankService', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('returns transformed data from serverless endpoint', async () => {
    // Ensure integration throws so the serverless endpoint path is used
    jest.doMock('../../src/integrations/WorldBankIntegration.js', () => {
      return jest.fn().mockImplementation(() => ({
        getFoodSecurityData: jest.fn().mockRejectedValue(new Error('integration unavailable'))
      }));
    });

    // Mock fetch to return a serverless endpoint shape
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: [
          { countryCode: 'COL', value: 5.2, year: '2024', country: 'Colombia' },
          { countryCode: 'PER', value: 7.1, year: '2024', country: 'Peru' }
        ],
        summary: { averageValue: 6.15 }
      })
    });

    const { getFoodSecurityIndex } = require('../../src/services/worldBankService');

    const res = await getFoodSecurityIndex();

    expect(res).toBeDefined();
    expect(res.countries).toEqual(['COL', 'PER']);
    expect(res.data.COL.value).toBeCloseTo(5.2);
    expect(res.globalAverage).toBeCloseTo(6.15);
  });

  test('falls back to mock data on fetch error', async () => {
    // Mock integration to throw so function reaches fetch path
    jest.doMock('../../src/integrations/WorldBankIntegration.js', () => {
      return jest.fn().mockImplementation(() => ({
        getFoodSecurityData: jest.fn().mockRejectedValue(new Error('nope'))
      }));
    });

    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    const { getFoodSecurityIndex } = require('../../src/services/worldBankService');

    const res = await getFoodSecurityIndex();
    expect(res.source).toMatch(/Fallback Mock Data/);
    expect(res.data.COL).toBeDefined();
  });
});
