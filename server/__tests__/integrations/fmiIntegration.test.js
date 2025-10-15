import FMIIntegration from '../../src/integrations/FMIIntegration.js';

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

describe('FMIIntegration', () => {
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

    integration = new FMIIntegration();
  });

  describe('getDebtData', () => {
    it('should fetch real debt data successfully', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'application/json']])
      };

      const mockData = [
        { year: '2022', value: '52.3' },
        { year: '2023', value: '55.1' }
      ];

      const processedResult = {
        country: 'COL',
        debtData: [
          { year: 2022, value: 52.3 },
          { year: 2023, value: 55.1 }
        ],
        period: { startYear: '2022', endYear: '2023' },
        isMock: false
      };
      mockExecute.mockResolvedValue(processedResult);
      mockFetchWithTimeout.mockResolvedValue(mockResponse);
      mockIsJsonResponse.mockReturnValue(true);
      mockResponse.json = jest.fn().mockResolvedValue(mockData);

      const result = await integration.getDebtData('COL', '2022', '2023');

      expect(mockExecute).toHaveBeenCalled();
      expect(result.country).toBe('COL');
      expect(result.debtData).toEqual([
        { year: 2022, value: 52.3 },
        { year: 2023, value: 55.1 }
      ]);
      expect(result.isMock).toBe(false);
    });

    it('should handle API errors and return mock data', async () => {
      mockExecute.mockImplementation(async (fn) => { throw new Error('API timeout'); });

      // Mock Math.random for consistent results
      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5); // variation = 0

      const result = await integration.getDebtData('COL', '2022', '2023');

      expect(result.country).toBe('COL');
      expect(result.isMock).toBe(true);
      expect(result.error).toBe('API timeout');
      expect(result.debtData).toEqual([
        { year: '2022', value: 53 }, // 55 + 0 - 2
        { year: '2023', value: 57 }  // 55 + 0 + 2
      ]);

      Math.random = originalRandom;
    });

    it('should handle non-JSON responses', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'text/html']])
      };

      const errorResult = {
        country: 'COL',
        period: { startYear: '2022', endYear: '2023' },
        debtData: [],
        isMock: true,
        error: 'FMI API returned non-JSON response: text/html'
      };
      mockExecute.mockRejectedValue(new Error('FMI API returned non-JSON response: text/html'));

      const result = await integration.getDebtData('COL', '2022', '2023');

      expect(result.isMock).toBe(true);
      expect(result.error).toMatch('non-JSON response');
    });

    it('should handle invalid JSON', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'application/json']])
      };

      mockExecute.mockRejectedValue(new Error('FMI API returned invalid JSON: Invalid JSON'));

      const result = await integration.getDebtData('COL', '2022', '2023');

      expect(result.isMock).toBe(true);
      expect(result.error).toMatch('invalid JSON');
    });

    it('should handle invalid data structure', async () => {
      const mockResponse = {
        ok: true,
        headers: new Map([['content-type', 'application/json']])
      };

      mockExecute.mockRejectedValue(new Error('FMI API returned invalid data structure'));

      const result = await integration.getDebtData('COL', '2022', '2023');

      expect(result.isMock).toBe(true);
      expect(result.error).toMatch('invalid data structure');
    });

    it('should use default debt level for unknown countries', async () => {
      mockExecute.mockImplementation(async (fn) => { throw new Error('API error'); });

      const originalRandom = Math.random;
      Math.random = jest.fn().mockReturnValue(0.5);

      const result = await integration.getDebtData('XYZ', '2022', '2023');

      expect(result.debtData[0].value).toBe(48); // 50 + 0 - 2
      expect(result.debtData[1].value).toBe(52); // 50 + 0 + 2

      Math.random = originalRandom;
    });
  });
});