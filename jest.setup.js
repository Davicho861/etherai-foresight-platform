// Jest setup: testing-library matchers, fetch mocks, ResizeObserver polyfill and sane defaults
try {
  // Extend expect with jest-dom matchers
  require('@testing-library/jest-dom');
} catch (e) {
  // If dependency missing in some envs, continue silently
}

// Enable fetch mocks
try {
  const fetchMock = require('jest-fetch-mock');
  if (fetchMock && typeof fetchMock.enableMocks === 'function') fetchMock.enableMocks();
} catch (e) {
  // jest-fetch-mock not installed; tests that rely on it should provide their own mocks
}

// Minimal ResizeObserver polyfill for jsdom environment
/* istanbul ignore next */
class ResizeObserver {
  constructor(cb) { this.cb = cb; }
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
}
if (typeof global.ResizeObserver === 'undefined') global.ResizeObserver = ResizeObserver;

// Optional: global fetch for server-side tests (node 18+ has fetch, but ensure availability)
if (typeof global.fetch === 'undefined') {
  try {
    // prefer undici or node-fetch if available
    // prefer commonjs require to stay compatible with Jest environment
    global.fetch = require('node-fetch');
  } catch (e) {
    // leave it undefined if not installed
  }
}

// Set a reasonable default timeout for Jest tests
jest.setTimeout(10000);
