// Hefesto's Forge: Global and Configurable Fetch Mock - REFORGED
// This mock intercepts all fetch calls, ensuring no real network requests are made during tests.
// It provides a clean, predictable, and fast testing environment.
// Disable source-map-support mapping to avoid runtime errors parsing malformed source maps
// Some dependencies may register source-map-support which can crash when encountering
// a corrupted or unexpected source map. Uninstall it early in the Jest setup.
try {
  // eslint-disable-next-line global-require
  const sms = require('source-map-support');
  if (sms && typeof sms.uninstall === 'function') sms.uninstall();
} catch (e) {
  // ignore if not present
}

// Defensive patch: if source-map-support is present, override its mapping functions
// to safe no-ops to avoid crashes when encountering malformed source maps.
try {
  // eslint-disable-next-line global-require
  const sms2 = require('source-map-support');
  if (sms2) {
    try {
      if (typeof sms2.mapSourcePosition === 'function') {
        sms2.mapSourcePosition = (pos) => ({ source: pos.source, line: pos.line, column: pos.column, name: pos.name });
      }
      if (typeof sms2.wrapCallSite === 'function') {
        sms2.wrapCallSite = (callSite) => callSite;
      }
    } catch (e) {
      // ignore
    }
  }
} catch (e) {
  // ignore if not installed
}

// Ensure Error.prepareStackTrace is safe during tests: provide a minimal formatter
// so V8 stack formatting won't call into source-map-support internals.
try {
  Error.prepareStackTrace = (err, structuredStackTrace) => {
    try {
      return `${err.name}: ${err.message}\n` + structuredStackTrace.map((callSite) => {
        const func = callSite.getFunctionName() || '<anonymous>';
        const file = callSite.getFileName() || '<unknown>';
        const line = callSite.getLineNumber() || 0;
        const col = callSite.getColumnNumber() || 0;
        return `    at ${func} (${file}:${line}:${col})`;
      }).join('\n');
    } catch (e) {
      return err.stack || `${err.name}: ${err.message}`;
    }
  };
} catch (e) {
  // ignore
}

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

// Replace console methods with no-op wrappers during tests to avoid interleaved logs
// that can trigger "Cannot log after tests are done" or cause lifecycle issues.
// We keep references to the originals so tests can restore them if needed.
const _origConsole = { ...console };
const noop = () => {};
console.log = noop;
console.info = noop;
console.warn = noop;
console.error = noop;

// Expose helpers to restore the console if a test needs to see output.
global.__restoreConsole = () => {
  console.log = _origConsole.log.bind(console);
  console.info = _origConsole.info.bind(console);
  console.warn = _origConsole.warn.bind(console);
  console.error = _origConsole.error.bind(console);
};

// Expose a helper to temporarily silence console (no-op if already silent)
global.__silenceConsole = () => {
  console.log = noop;
  console.info = noop;
  console.warn = noop;
  console.error = noop;
};

// For backward compatibility, log a single startup message via the original console
// (so maintainers know the mock was installed) but keep runtime output quiet.
_origConsole.log("Hefesto's global fetch mock has been re-forged with proper initialization and is active.");
