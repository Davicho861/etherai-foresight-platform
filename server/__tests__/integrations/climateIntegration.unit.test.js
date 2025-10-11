let ClimateIntegration = require('../../src/integrations/ClimateIntegration');

// support both CommonJS require and ES module default export
if (ClimateIntegration && ClimateIntegration.default) ClimateIntegration = ClimateIntegration.default;

describe('ClimateIntegration', () => {
  test('getCountryClimateData parses expected API response shape', async () => {
    // Mock fetch globally to return the shape used by ClimateIntegration
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        properties: {
          parameter: {
            T2M_MAX: { '20250101': 20.5 },
            T2M_MIN: { '20250101': 10.2 },
            PRECTOTCORR: { '20250101': 5.0 },
            RH2M: { '20250101': 60 }
          }
        }
      }),
    });

    const inst = new ClimateIntegration();

    const result = await inst.getCountryClimateData('PER');

    expect(result).toBeDefined();
    expect(result.countryCode).toBe('PER');
    expect(typeof result.avgMaxTemp).toBe('number');
    expect(typeof result.avgMinTemp).toBe('number');
    expect(typeof result.totalPrecipitation).toBe('number');
    expect(typeof result.avgHumidity).toBe('number');
    expect(['low','medium','high']).toContain(result.riskLevel);
  });
});
