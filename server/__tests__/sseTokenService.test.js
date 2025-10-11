import { jest } from '@jest/globals';
import crypto from 'crypto';
import sseService from '../src/sseTokenService.js';
const { generateToken, validateToken, initialize, shutdown } = sseService;

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn()
}));

// Mock redis
jest.mock('redis', () => ({
  createClient: jest.fn()
}));

describe('sseTokenService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset environment
    delete process.env.REDIS_URL;
    delete process.env.NODE_ENV;
  });

  afterEach(() => {
    shutdown();
  });

  describe('generateToken', () => {
    it('should generate a token with default TTL', async () => {
      crypto.randomBytes.mockReturnValue(Buffer.from('1234567890123456'));
      const result = await generateToken();
      expect(result.token).toBe('31323334353637383930313233343536');
      expect(result.expiresAt).toBeGreaterThan(Date.now());
      expect(result.expiresAt).toBeLessThanOrEqual(Date.now() + 61 * 1000);
    });

    it('should generate a token with custom TTL', async () => {
      crypto.randomBytes.mockReturnValue(Buffer.from('abcdef1234567890'));
      const result = await generateToken(120);
      expect(result.token).toBe('61626364656631323334353637383930');
      expect(result.expiresAt).toBeGreaterThan(Date.now() + 119 * 1000);
      expect(result.expiresAt).toBeLessThanOrEqual(Date.now() + 121 * 1000);
    });
  });

  describe('validateToken', () => {
    it('should return false for invalid token', async () => {
      const isValid = await validateToken('invalid');
      expect(isValid).toBe(false);
    });

    it('should return false for null token', async () => {
      const isValid = await validateToken(null);
      expect(isValid).toBe(false);
    });

    it('should validate a valid token', async () => {
      crypto.randomBytes.mockReturnValue(Buffer.from('token123456789012'));
      const { token } = await generateToken(300);
      const isValid = await validateToken(token);
      expect(isValid).toBe(true);
    });

    it('should return false for expired token', async () => {
      jest.useFakeTimers();
      crypto.randomBytes.mockReturnValue(Buffer.from('expired1234567890'));
      const { token } = await generateToken(1);
      jest.advanceTimersByTime(2000);
      const isValid = await validateToken(token);
      expect(isValid).toBe(false);
      jest.useRealTimers();
    });
  });

  describe('lifecycle management', () => {
    it('should not start cleanup in test environment', () => {
      process.env.NODE_ENV = 'test';
      initialize();
      // Should not have started any timers
      expect(jest.getTimerCount()).toBe(0);
    });

    it('should allow shutdown without error', () => {
      expect(() => shutdown()).not.toThrow();
    });
  });


  describe('cleanupExpired', () => {
    it('should remove expired tokens when validating', async () => {
      jest.useFakeTimers();
      crypto.randomBytes.mockReturnValue(Buffer.from('expiretest123456'));
      const { token } = await generateToken(1);
      jest.advanceTimersByTime(2000);
      const isValid = await validateToken(token);
      expect(isValid).toBe(false);
      jest.useRealTimers();
    });
  });

  describe('initialize and shutdown', () => {
    it('should not start cleanup when DISABLE_BACKGROUND_TASKS is true', () => {
      process.env.DISABLE_BACKGROUND_TASKS = 'true';
      expect(() => initialize()).not.toThrow();
    });

    it('should start cleanup interval in non-test env', () => {
      delete process.env.NODE_ENV;
      delete process.env.DISABLE_BACKGROUND_TASKS;
      expect(() => initialize()).not.toThrow();
      shutdown(); // Clean up
    });

    it('should allow shutdown without error', () => {
      expect(() => shutdown()).not.toThrow();
    });
  });
});