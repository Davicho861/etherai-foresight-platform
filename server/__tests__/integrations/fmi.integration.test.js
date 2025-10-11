/* eslint-disable global-require */
describe('FMIIntegration', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    delete process.env.TEST_MODE;
  });

  test('parses debt data on success', async () => {
    jest.doMock('../../src/utils/resilience.js', () => ({
      CircuitBreaker: class { constructor() {} execute(cb) { return cb(); } },
      retryWithBackoff: async (fn) => fn(),
      fetchWithTimeout: async () => ({
        ok: true,
        status: 200,
        headers: { get: (k) => 'application/json' },
        json: async () => ([{ year: '2020', value: '45.2' }, { year: '2021', value: '46.0' }])
      }),
      isJsonResponse: () => true
    }));

    const FMIIntegration = require('../../src/integrations/FMIIntegration.js').default;
    const fi = new FMIIntegration();
    const res = await fi.getDebtData('COL', 2020, 2021);

    expect(res).toBeDefined();
    expect(res.isMock).toBe(false);
    expect(res.debtData).toHaveLength(2);
    expect(res.debtData[0].year).toBe(2020);
    expect(typeof res.debtData[0].value).toBe('number');
  });

  test('handles non-JSON response by falling back to mock', async () => {
    jest.doMock('../../src/utils/resilience.js', () => ({
      CircuitBreaker: class { constructor() {} execute(cb) { return cb(); } },
      retryWithBackoff: async (fn) => fn(),
      fetchWithTimeout: async () => ({
        ok: true,
        status: 200,
        headers: { get: (k) => 'text/html' },
        json: async () => { throw new Error('invalid json'); }
      }),
      isJsonResponse: () => false
    }));

    const FMIIntegration = require('../../src/integrations/FMIIntegration.js').default;
    const fi = new FMIIntegration();
    const res = await fi.getDebtData('COL', 2020, 2021);

    expect(res).toBeDefined();
    // When the fetch fails or non-json, FMIIntegration returns an object with isMock true
    expect(res.isMock).toBe(true);
    expect(Array.isArray(res.debtData)).toBe(true);
    expect(res.debtData.length).toBeGreaterThanOrEqual(1);
  });

  test('handles invalid JSON parse by returning mock data', async () => {
    jest.doMock('../../src/utils/resilience.js', () => ({
      CircuitBreaker: class { constructor() {} execute(cb) { return cb(); } },
      retryWithBackoff: async (fn) => fn(),
      fetchWithTimeout: async () => ({
        ok: true,
        status: 200,
        headers: { get: (k) => 'application/json' },
        json: async () => { throw new Error('parse error'); }
      }),
      isJsonResponse: () => true
    }));

    const FMIIntegration = require('../../src/integrations/FMIIntegration.js').default;
    const fi = new FMIIntegration();
    const res = await fi.getDebtData('COL', 2020, 2021);

    expect(res).toBeDefined();
    expect(res.isMock).toBe(true);
    expect(res.error).toMatch(/invalid json|parse error/i);
  });

});
