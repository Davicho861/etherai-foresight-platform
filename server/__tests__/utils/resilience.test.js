import { server } from '../mocks/server.js';
import { CircuitBreaker, retryWithBackoff, fetchWithTimeout, isJsonResponse } from '../../src/utils/resilience.js';

// Mock fetch globally
global.fetch = jest.fn();

describe('Resilience Utilities', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CircuitBreaker', () => {
    it('should execute function successfully in CLOSED state', async () => {
      const breaker = new CircuitBreaker();
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await breaker.execute(mockFn);

      expect(result).toBe('success');
      expect(breaker.state).toBe('CLOSED');
      expect(breaker.failureCount).toBe(0);
    });

    it('should transition to OPEN state after failure threshold', async () => {
      const breaker = new CircuitBreaker(2, 1000);
      const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');
      expect(breaker.state).toBe('CLOSED');
      expect(breaker.failureCount).toBe(1);

      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');
      expect(breaker.state).toBe('OPEN');
      expect(breaker.failureCount).toBe(2);
    });

    it('should throw error when OPEN and not recovered', async () => {
      const breaker = new CircuitBreaker(1, 1000);
      const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');
      expect(breaker.state).toBe('OPEN');

      await expect(breaker.execute(mockFn)).rejects.toThrow('Circuit breaker is OPEN');
    });

    it('should transition to HALF_OPEN after recovery timeout', async () => {
      jest.useFakeTimers();
      const breaker = new CircuitBreaker(1, 1000);
      const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');
      expect(breaker.state).toBe('OPEN');

      // Advance time past recovery timeout
      jest.advanceTimersByTime(1001);

      const successFn = jest.fn().mockResolvedValue('success');
      const result = await breaker.execute(successFn);

      expect(result).toBe('success');
      expect(breaker.state).toBe('CLOSED');
      jest.useRealTimers();
    });

    it('should reset failure count on success', async () => {
      const breaker = new CircuitBreaker(3, 1000);
      const failFn = jest.fn().mockRejectedValue(new Error('fail'));
      const successFn = jest.fn().mockResolvedValue('success');

      await expect(breaker.execute(failFn)).rejects.toThrow('fail');
      expect(breaker.failureCount).toBe(1);

      const result = await breaker.execute(successFn);
      expect(result).toBe('success');
      expect(breaker.failureCount).toBe(0);
      expect(breaker.state).toBe('CLOSED');
    });
  });

  describe('retryWithBackoff', () => {
    it('should return result on first attempt', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');

      const result = await retryWithBackoff(mockFn, 3, 100, 1000);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure and succeed', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('fail1'))
        .mockRejectedValueOnce(new Error('fail2'))
        .mockResolvedValueOnce('success');

      const result = await retryWithBackoff(mockFn, 3, 1, 10);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should throw error after max retries', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('persistent fail'));

      await expect(retryWithBackoff(mockFn, 2, 1, 10)).rejects.toThrow('persistent fail');
      expect(mockFn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it('should implement exponential backoff with jitter', async () => {
      const mockFn = jest.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValueOnce('success');

      const result = await retryWithBackoff(mockFn, 1, 1, 10);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('should respect max delay', async () => {
      const mockFn = jest.fn().mockRejectedValue(new Error('fail'));

      await expect(retryWithBackoff(mockFn, 5, 1, 10)).rejects.toThrow('fail'); // maxDelay = 10ms

      // After 5 attempts, delays should be capped at 10ms
      // 1, 2, 4, 8, 10
      expect(mockFn).toHaveBeenCalledTimes(6); // initial + 5 retries
    });
  });

  describe('fetchWithTimeout', () => {
    it('should resolve successful fetch', async () => {
      const mockResponse = { ok: true, data: 'test' };
      fetch.mockResolvedValue(mockResponse);

      const result = await fetchWithTimeout('http://example.com', {}, 5000);

      expect(result).toBe(mockResponse);
      expect(fetch).toHaveBeenCalledWith('http://example.com', {
        signal: expect.any(AbortSignal)
      });
    });

    it('should timeout after specified time', async () => {
      fetch.mockImplementation(() => new Promise(() => {})); // Never resolves

      await expect(fetchWithTimeout('http://example.com', {}, 50)).rejects.toThrow('Request timeout after 50ms');
    }, 200);

    it('should clear timeout on successful response', async () => {
      const mockResponse = { ok: true };
      fetch.mockResolvedValue(mockResponse);

      await fetchWithTimeout('http://example.com', {}, 5000);

      // Timeout should be cleared, no need to advance timers
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should propagate other errors', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      await expect(fetchWithTimeout('http://example.com', {}, 5000)).rejects.toThrow('Network error');
    });
  });

  describe('isJsonResponse', () => {
    it('should return true for JSON content type', () => {
      const response = {
        headers: new Map([['content-type', 'application/json']])
      };

      expect(isJsonResponse(response)).toBe(true);
    });

    it('should return true for JSON with charset', () => {
      const response = {
        headers: new Map([['content-type', 'application/json; charset=utf-8']])
      };

      expect(isJsonResponse(response)).toBe(true);
    });

    it('should return false for non-JSON content type', () => {
      const response = {
        headers: new Map([['content-type', 'text/html']])
      };

      expect(isJsonResponse(response)).toBe(false);
    });

    it('should return false when no content-type header', () => {
      const response = {
        headers: new Map()
      };

      expect(isJsonResponse(response)).toBe(false);
    });
  });
});