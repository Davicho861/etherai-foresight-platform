/**
 * Simple in-memory cache module for API responses.
 * Provides TTL-based caching to reduce external API calls.
 */

class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Sets a value in the cache with TTL.
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlMs - Time to live in milliseconds
   */
  set(key, value, ttlMs) {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  /**
   * Gets a value from the cache if not expired.
   * @param {string} key - Cache key
   * @returns {any|null} Cached value or null if expired/not found
   */
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  /**
   * Clears expired entries from the cache.
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clears all cache entries.
   */
  clear() {
    this.cache.clear();
  }
}

// Export a singleton instance
const cache = new SimpleCache();

// Cleanup expired entries every 5 minutes
setInterval(() => cache.cleanup(), 5 * 60 * 1000);

export default cache;