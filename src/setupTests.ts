// jest.setup.ts
import '@testing-library/jest-dom';
import fetchMock from 'jest-fetch-mock';

// Mock ResizeObserver for tests
global.ResizeObserver = class ResizeObserver {
  observe() { /* no-op */ }
  unobserve() { /* no-op */ }
  disconnect() { /* no-op */ }
};

// Silence act() warnings by setting a default timeout
jest.setTimeout(10000);

// Enable fetch mocks
fetchMock.enableMocks();

// Stub scrollIntoView used by some UI libs (Radix / floating-ui) in JSDOM
if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  // @ts-ignore
  Element.prototype.scrollIntoView = function() { /* no-op for tests */ };
}

// Mock react-simple-maps to run in JSDOM tests without fetching or parsing topojson
jest.mock('react-simple-maps', () => {
  const React = require('react');
  return {
    ComposableMap: ({ children, ..._props }) => React.createElement('div', { 'data-testid': 'composable-map' }, children),
    Geographies: ({ children }) => React.createElement('div', { 'data-testid': 'geographies' }, children({ geographies: [] })),
    Geography: ({ geography, ..._props }) => React.createElement('div', { 'data-testid': `geography-${(geography && geography.properties && geography.properties.ISO_A3) || 'mock'}` }),
  };
});