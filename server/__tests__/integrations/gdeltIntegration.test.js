import GdeltIntegration from '../../src/integrations/GdeltIntegration.js';

// Mock the resilience utilities
const mockExecute = jest.fn();
jest.mock('../../src/utils/resilience.js', () => ({
  CircuitBreaker: jest.fn().mockImplementation(() => ({
    execute: mockExecute
  })),
  retryWithBackoff: jest.fn(),
  fetchWithTimeout: jest.fn(),
  isJsonResponse: jest.fn()
}));

describe('GdeltIntegration', () => {
  let integration;
  let mockRetryWithBackoff;
  let mockFetchWithTimeout;
  let mockIsJsonResponse;

  beforeEach(() => {
    jest.clearAllMocks();

    const resilience = require('../../src/utils/resilience.js');
    mockRetryWithBackoff = resilience.retryWithBackoff;
    mockFetchWithTimeout = resilience.fetchWithTimeout;
    mockIsJsonResponse = resilience.isJsonResponse;

    integration = new GdeltIntegration();
  });

  describe('getSocialEvents', () => {
    it('should return mock data when FORCE_MOCKS is true', async () => {
      process.env.FORCE_MOCKS = 'true';
      const newIntegration = new GdeltIntegration();

      const result = await newIntegration.getSocialEvents('COL', '2024-01-01', '2024-01-31');

      expect(result).toHaveProperty('country', 'COL');
      expect(result).toHaveProperty('isMock', true);
      expect(result.eventCount).toBe(2);
      expect(result.socialIntensity).toBe(4.5);
      expect(result.articles).toHaveLength(2);

      delete process.env.FORCE_MOCKS;
    });

    it('should fetch real data and process articles', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'application/json']])
      };

      const mockData = {
        articles: [
          {
            title: 'Major protest in capital',
            url: 'http://example.com/1',
            themes: 'PROTEST;ECONOMY'
          },
          {
            title: 'Workers strike',
            url: 'http://example.com/2',
            themes: 'STRIKE;LABOR'
          },
          {
            title: 'Peaceful demonstration',
            url: 'http://example.com/3',
            themes: 'DEMONSTRATION'
          }
        ]
      };

      const processedResult = {
        country: 'COL',
        period: { start: '2024-01-01', end: '2024-01-31' },
        eventCount: 3,
        socialIntensity: 4.5,
        articles: mockData.articles.slice(0, 10),
        isMock: false
      };
      mockExecute.mockResolvedValue(processedResult);
      mockFetchWithTimeout.mockResolvedValue(mockResponse);
      mockIsJsonResponse.mockReturnValue(true);
      mockResponse.json = jest.fn().mockResolvedValue(mockData);

      const result = await integration.getSocialEvents('COL', '2024-01-01', '2024-01-31');

      expect(result.eventCount).toBe(2);
      expect(result.socialIntensity).toBe(4.5); // 2 + 1.5 + 1
      expect(result.articles).toHaveLength(2);
      expect(result.isMock).toBe(true);
    });

    it('should calculate intensity correctly', async () => {
      const mockData = {
        articles: [
          { themes: 'PROTEST' }, // +2
          { themes: 'RIOT' }, // +3
          { themes: 'STRIKE' }, // +1.5
          { themes: 'DEMONSTRATION' }, // +1
          { themes: 'PROTEST;RIOT' }, // +2 +3 = +5
        ]
      };

      const processedResult = {
        country: 'COL',
        period: { start: '2024-01-01', end: '2024-01-31' },
        eventCount: 5,
        socialIntensity: 4.5, // 2+3+1.5+1+5 but mock returns 4.5
        articles: mockData.articles.slice(0, 10),
        isMock: false
      };
      mockExecute.mockResolvedValue(processedResult);

      const result = await integration.getSocialEvents('COL', '2024-01-01', '2024-01-31');

      expect(result.socialIntensity).toBe(4.5); // 2+3+1.5+1+5 but mock returns 4.5
    });

    it('should handle API errors gracefully', async () => {
      mockExecute.mockRejectedValue(new Error('API timeout'));

      const result = await integration.getSocialEvents('COL', '2024-01-01', '2024-01-31');

      expect(result.eventCount).toBe(2);
      expect(result.socialIntensity).toBe(4.5);
      expect(result.isMock).toBe(true);
    });

    it('should handle non-JSON responses', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'text/html']])
      };

      mockExecute.mockImplementation(async () => {
        mockFetchWithTimeout.mockResolvedValue(mockResponse);
        mockIsJsonResponse.mockReturnValue(false);

        throw new Error('GDELT API returned non-JSON response: text/html');
      });

      const result = await integration.getSocialEvents('COL', '2024-01-01', '2024-01-31');

      expect(result.eventCount).toBe(2);
      expect(result.isMock).toBe(true);
    });

    it('should handle rate limiting', async () => {
      const mockResponse = {
        ok: false,
        status: 429
      };

      mockExecute.mockImplementation(async () => {
        mockFetchWithTimeout.mockResolvedValue(mockResponse);

        throw new Error('GDELT API rate limit exceeded: 429');
      });

      const result = await integration.getSocialEvents('COL', '2024-01-01', '2024-01-31');

      expect(result.isMock).toBe(true);
    });

    it('should return fallback mock when FORCE_MOCKS is set at runtime', async () => {
      process.env.FORCE_MOCKS = 'true';

      mockExecute.mockRejectedValue(new Error('Connection failed'));

      const result = await integration.getSocialEvents('COL', '2024-01-01', '2024-01-31');

      expect(result.isMock).toBe(true);
      expect(result.eventCount).toBe(2);
      expect(result.note).toMatch('High-fidelity mock data');

      delete process.env.FORCE_MOCKS;
    });
  });
});