// Polyfills for Jest environment
// Provide TextEncoder/TextDecoder for some node modules that expect Web APIs
const { TextEncoder, TextDecoder } = require('util');
if (typeof global.TextEncoder === 'undefined') global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === 'undefined') global.TextDecoder = TextDecoder;

// Minimal ResizeObserver polyfill for jsdom tests (some Radix components rely on it)
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
    global.fetch = require('node-fetch');
  } catch (e) {
    // leave it undefined if not installed
  }
}

// Silence act() warnings by setting a default timeout smaller if desired
jest.setTimeout(10000);

// Extend expect with jest-dom matchers (toBeInTheDocument, etc.)
try {
  require('@testing-library/jest-dom');
} catch (e) {
  // devDependency might not be installed in some environments
}
