// Tests for SIMIntegration

describe('SIMIntegration', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  test('returns mock when fetch fails for getFoodPrices', async () => {
    await jest.isolateModules(async () => {
      jest.doMock('node-fetch', () => jest.fn().mockRejectedValue(new Error('network error')));
      let SIMIntegration = require('../../src/integrations/SIMIntegration.js');
      if (SIMIntegration && SIMIntegration.default) SIMIntegration = SIMIntegration.default;

      const sim = new SIMIntegration();
      const res = await sim.getFoodPrices('rice', 'Lima');
      expect(res).toBeDefined();
      expect(res.isMock).toBe(true);
      expect(res.priceData.currentPrice).toBeGreaterThan(0);
    });
  });

  test('parses real response for getFoodPrices', async () => {
    await jest.isolateModules(async () => {
      const mockData = { precio_actual: 4.7, precio_minimo: 4.2, precio_maximo: 5.0, precio_promedio: 4.6, unidad: 'PEN/kg', fecha: '2025-10-10' };
      jest.doMock('node-fetch', () => jest.fn().mockResolvedValue({ ok: true, json: async () => mockData }));

      let SIMIntegration = require('../../src/integrations/SIMIntegration.js');
      if (SIMIntegration && SIMIntegration.default) SIMIntegration = SIMIntegration.default;

      const sim = new SIMIntegration();
      const res = await sim.getFoodPrices('rice', 'Lima');
      expect(res).toBeDefined();
      expect(res.isMock).toBe(false);
      expect(res.priceData.currentPrice).toBeCloseTo(4.7);
    });
  });

  test('getPriceHistory returns mock when API fails', async () => {
    await jest.isolateModules(async () => {
      jest.doMock('node-fetch', () => jest.fn().mockRejectedValue(new Error('network')));
      let SIMIntegration = require('../../src/integrations/SIMIntegration.js');
      if (SIMIntegration && SIMIntegration.default) SIMIntegration = SIMIntegration.default;

      const sim = new SIMIntegration();
      const res = await sim.getPriceHistory('potatoes', 'Cusco', 5);
      expect(res).toBeDefined();
      expect(res.isMock).toBe(true);
      expect(Array.isArray(res.historyData)).toBe(true);
    });
  });

  test('getVolatilityIndex parses real response', async () => {
    await jest.isolateModules(async () => {
      jest.doMock('node-fetch', () => jest.fn().mockResolvedValue({ ok: true, json: async () => ({ indice_volatilidad: 0.14, nivel_riesgo: 'medium' }) }));
      let SIMIntegration = require('../../src/integrations/SIMIntegration.js');
      if (SIMIntegration && SIMIntegration.default) SIMIntegration = SIMIntegration.default;

      const sim = new SIMIntegration();
      const res = await sim.getVolatilityIndex('rice', 'Lima');
      expect(res).toBeDefined();
      expect(res.isMock).toBe(false);
      expect(typeof res.volatilityIndex).toBe('number');
    });
  });
});
