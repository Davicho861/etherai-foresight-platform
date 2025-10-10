import { jest } from '@jest/globals';
import cache from '../src/cache.js';
import { initialize, shutdown } from '../src/cache.js';

describe('SimpleCache', () => {
  beforeEach(() => {
    cache.clear();
    jest.clearAllTimers();
  });

  afterEach(() => {
    cache.clear();
  });

  describe('set and get', () => {
    it('should store and retrieve a value', () => {
      cache.set('key1', 'value1', 1000);
      expect(cache.get('key1')).toBe('value1');
    });

    it('should return null for non-existent key', () => {
      expect(cache.get('nonexistent')).toBeNull();
    });

    it('should overwrite existing value', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key1', 'value2', 1000);
      expect(cache.get('key1')).toBe('value2');
    });
  });

  describe('TTL expiration', () => {
    it('should return null for expired entry', () => {
      jest.useFakeTimers();
      cache.set('key1', 'value1', 1000);
      jest.advanceTimersByTime(1001);
      expect(cache.get('key1')).toBeNull();
      jest.useRealTimers();
    });

    it('should return value before expiration', () => {
      jest.useFakeTimers();
      cache.set('key1', 'value1', 1000);
      jest.advanceTimersByTime(500);
      expect(cache.get('key1')).toBe('value1');
      jest.useRealTimers();
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', () => {
      jest.useFakeTimers();
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 2000);
      jest.advanceTimersByTime(1500);
      cache.cleanup();
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBe('value2');
      jest.useRealTimers();
    });
  });

  describe('clear', () => {
    it('should remove all entries', () => {
      cache.set('key1', 'value1', 1000);
      cache.set('key2', 'value2', 1000);
      cache.clear();
      expect(cache.get('key1')).toBeNull();
      expect(cache.get('key2')).toBeNull();
    });
  });

  describe('lifecycle management', () => {
    it('should not start cleanup in test environment', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'test';
      initialize();
      // Should not have started any timers
      expect(jest.getTimerCount()).toBe(0);
      process.env.NODE_ENV = originalEnv;
    });

    it('should allow shutdown without error', () => {
      expect(() => shutdown()).not.toThrow();
    });
  });
});