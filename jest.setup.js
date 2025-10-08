require('@testing-library/jest-dom');
require('jest-fetch-mock').enableMocks();

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

import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();
