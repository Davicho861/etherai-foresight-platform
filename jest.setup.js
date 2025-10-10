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
