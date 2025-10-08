// Hefesto's Forge: Global and Configurable Fetch Mock - REFORGED
// This mock intercepts all fetch calls, ensuring no real network requests are made during tests.
// It provides a clean, predictable, and fast testing environment.

// First, we mock the module. Jest will hoist this call.
jest.mock('node-fetch');

// Now, we can safely require the modules.
const fetch = require('node-fetch');
const { Response } = jest.requireActual('node-fetch');

// Create the mock implementation that will be used by the mocked fetch.
const mockFetchImplementation = jest.fn();

// Set the mocked fetch's implementation.
fetch.mockImplementation(mockFetchImplementation);

// Provide a way for tests to configure mock responses through the global scope.
global.mockFetch = mockFetchImplementation;
global.Response = Response;

// Clean up mocks after each test to prevent contamination.
afterEach(() => {
  mockFetchImplementation.mockClear();
});

console.log("Hefesto's global fetch mock has been re-forged with proper initialization and is active.");
