 
describe('GdeltIntegration', () => {
  beforeEach(() => {
    jest.resetModules();
    delete process.env.FORCE_MOCKS;
    process.env.NODE_ENV = 'test';
  });

  test('parses events and intensity on success', async () => {
    jest.doMock('../../src/lib/safeFetch.js', () => jest.fn().mockResolvedValue({
      articles: [
        { title: 'Community protest', url: 'http://a', themes: 'PROTEST;RIOT' },
        { title: 'Workers strike', url: 'http://b', themes: 'STRIKE' }
      ]
    }));

    const GdeltIntegration = require('../../src/integrations/GdeltIntegration.js').default;
    const gi = new GdeltIntegration();
    const res = await gi.getSocialEvents('COL', '2023-01-01', '2023-01-02');

    expect(res).toBeDefined();
    expect(res.isMock).toBe(false);
    expect(res.eventCount).toBe(2);
    // PROTEST (2) + RIOT (3) + STRIKE (1.5) = 6.5
    expect(res.socialIntensity).toBeCloseTo(6.5);
    expect(Array.isArray(res.articles)).toBe(true);
    expect(res.articles.length).toBe(2);
  });

  test('handles non-JSON response gracefully', async () => {
    jest.doMock('../../src/lib/safeFetch.js', () => jest.fn().mockRejectedValue(new Error('Non-JSON response (content-type: text/html): <html>blocked</html>')));

    const GdeltIntegration = require('../../src/integrations/GdeltIntegration.js').default;
    const gi = new GdeltIntegration();
    const res = await gi.getSocialEvents('COL', '2023-01-01', '2023-01-02');

    expect(res).toBeDefined();
    expect(res.isMock).toBe(false);
    expect(res.eventCount).toBe(0);
    expect(res.error).toMatch(/non-JSON|non-json|content-type/i);
  });

  test('handles HTTP 429 rate limit errors', async () => {
    jest.doMock('../../src/lib/safeFetch.js', () => jest.fn().mockRejectedValue(new Error('HTTP 429: Too Many Requests')));

    const GdeltIntegration = require('../../src/integrations/GdeltIntegration.js').default;
    const gi = new GdeltIntegration();
    const res = await gi.getSocialEvents('COL', '2023-01-01', '2023-01-02');

    expect(res).toBeDefined();
    expect(res.isMock).toBe(false);
    expect(res.error).toMatch(/rate limit|429/);
  });

  test('returns immediate force-mock when FORCE_MOCKS env is set', async () => {
    process.env.FORCE_MOCKS = 'true';

    jest.doMock('../../src/utils/resilience.js', () => ({
      CircuitBreaker: class { constructor() {} execute(cb) { return cb(); } },
      retryWithBackoff: async (fn) => fn(),
      fetchWithTimeout: async () => { throw new Error('should not be called when force mocks enabled'); },
      isJsonResponse: () => true
    }));

    const GdeltIntegration = require('../../src/integrations/GdeltIntegration.js').default;
    const gi = new GdeltIntegration();
    const res = await gi.getSocialEvents('COL', '2023-01-01', '2023-01-02');

    expect(res).toBeDefined();
    expect(res.isMock).toBe(true);
    expect(res.source).toMatch(/GDELT/);
  });
});
