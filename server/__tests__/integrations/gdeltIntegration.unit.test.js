// Tests for GdeltIntegration
import { server } from '../mocks/server.js';

// Mock the utilities used by GdeltIntegration before importing
jest.mock('../../src/utils/resilience.js', () => ({
  CircuitBreaker: class {
    constructor() {}
    execute(fn) { return fn(); }
  },
  retryWithBackoff: async (fn, retries) => fn(),
  fetchWithTimeout: jest.fn(),
  isJsonResponse: jest.fn()
}));

let GdeltIntegration = require('../../src/integrations/GdeltIntegration.js');
if (GdeltIntegration && GdeltIntegration.default) GdeltIntegration = GdeltIntegration.default;

describe('GdeltIntegration', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
    delete process.env.FORCE_MOCKS;
    process.env.NODE_ENV = 'test';
  });

  test('returns mock when FORCE_MOCKS=true', async () => {
    process.env.FORCE_MOCKS = 'true';
    const g = new GdeltIntegration();
    const res = await g.getSocialEvents('PER', '2025-01-01', '2025-01-02');
    expect(res).toBeDefined();
    expect(res.isMock).toBe(true);
    expect(res.eventCount).toBe(12);
  });

  test('parses real response with articles and themes', async () => {
    process.env.FORCE_MOCKS = undefined;
    const { fetchWithTimeout, isJsonResponse } = require('../../src/utils/resilience.js');

    isJsonResponse.mockReturnValue(true);
    const mockResponse = {
      ok: true,
      json: async () => ({ articles: [{ title: 'Sample', url: 'https://example.com', date: '2024-10-07', tone: 2.5 }] }),
      headers: new Map([['content-type', 'application/json']]),
    };
    fetchWithTimeout.mockResolvedValue(mockResponse);

    const g = new GdeltIntegration();
    const res = await g.getSocialEvents('COL', '2025-01-01', '2025-01-02');
    expect(res).toBeDefined();
    expect(res.isMock).toBe(false);
    expect(Array.isArray(res.articles)).toBe(true);
    // intensity should be numeric even if no articles were returned
    expect(typeof res.socialIntensity).toBe('number');
  });

  test('returns fallback mock if API errors and FORCE_MOCKS set at runtime', async () => {
    // Construct integration without forcing mocks, so it will attempt network
    delete process.env.FORCE_MOCKS;
    const { fetchWithTimeout, isJsonResponse } = require('../../src/utils/resilience.js');
    fetchWithTimeout.mockRejectedValue(new Error('network down'));
    isJsonResponse.mockReturnValue(false);

    const g = new GdeltIntegration();
    // Now enable FORCE_MOCKS at runtime so the catch block will return the mock fallback
    process.env.FORCE_MOCKS = 'true';

    const res = await g.getSocialEvents('ARG', '2025-01-01', '2025-01-02');
    expect(res).toBeDefined();
    expect(res.isMock).toBe(true);
    expect(typeof res.note === 'string' || res.note === undefined).toBeTruthy();
  });
});
