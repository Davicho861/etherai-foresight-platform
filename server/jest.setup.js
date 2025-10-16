// Hefesto's Forge: Oráculo de Mocks - REFORGED con MSW
// El Oráculo intercepta todas las llamadas de red, asegurando que ninguna solicitud real llegue a internet.
// Proporciona un entorno de pruebas limpio, predecible y rápido.
// Disable source-map-support mapping to avoid runtime errors parsing malformed source maps
// Some dependencies may register source-map-support which can crash when encountering
// a corrupted or unexpected source map. Uninstall it early in the Jest setup.
try {
   
  const sms = require('source-map-support');
  if (sms && typeof sms.uninstall === 'function') sms.uninstall();
} catch {
  // ignore if not present
}

// Defensive patch: if source-map-support is present, override its mapping functions
// to safe no-ops to avoid crashes when encountering malformed source maps.
try {
   
  const sms2 = require('source-map-support');
  if (sms2) {
    try {
      if (typeof sms2.mapSourcePosition === 'function') {
        sms2.mapSourcePosition = (pos) => ({ source: pos.source, line: pos.line, column: pos.column, name: pos.name });
      }
      if (typeof sms2.wrapCallSite === 'function') {
        sms2.wrapCallSite = (callSite) => callSite;
      }
    } catch {
      // ignore
    }
  }
} catch {
  // ignore if not installed
}

// Do NOT force FORCE_MOCKS globally here. Individual tests may set
// process.env.FORCE_MOCKS as needed. Forcing it here caused many
// tests that expect real responses to always receive mocks.

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
    } catch {
      // ignore
    }

// Importar el Oráculo de Mocks (MSW Server)
const { server } = require('./__tests__/mocks/server.js');

// Proporcionar acceso global al servidor para casos especiales
global.mswServer = server;

// Note: per-test cleanup (afterEach) is registered in `jest.setup.backend.js`
// because `afterEach` is not available when this file runs as a setupFile.

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

// Ensure a global fetch mock exists for tests that call fetch.mockResolvedValue
// If Node provides a native fetch (node 18+), wrap it; otherwise create a Jest mock.
if (typeof global.fetch === 'undefined' || typeof global.fetch.mockResolvedValue === 'undefined') {
  try {
    // jest may not be defined outside tests; guard access
     
    if (typeof jest !== 'undefined' && typeof jest.fn === 'function') {
      // Ensure fetch is a Jest mock function
      global.fetch = jest.fn();
      // Provide a convenient alias used across older tests
      global.mockFetch = global.fetch;
    } else {
      // Fallback: create a minimal mock function with mockResolvedValue API
      const fn = (...args) => {
        // default behavior: return a rejected promise to surface unexpected calls
        return Promise.reject(new Error('global.fetch called in test without explicit mock'));
      };
      fn.mockResolvedValue = (val) => { fn._mockResolvedValue = val; return fn; };
      fn.mockRejectedValue = (err) => { fn._mockRejectedValue = err; return fn; };
      global.fetch = fn;
    }
  } catch {
    // ignore if we can't define jest mocks in this environment
  }
}
// Defensive: if mockFetch is not set elsewhere, alias it to fetch to support older tests
if (typeof global.mockFetch === 'undefined') global.mockFetch = global.fetch;

// Ensure global.Response and global.Request exist for tests that construct them
try {
  if (typeof global.Response === 'undefined' || typeof global.Request === 'undefined') {
    // Use node-fetch exports
    try {
      const nodeFetch = require('node-fetch');
      if (nodeFetch) {
        global.Response = nodeFetch.Response || global.Response;
        global.Request = nodeFetch.Request || global.Request;
        global.Headers = nodeFetch.Headers || global.Headers;
      }
    } catch (e) {
      // ignore if node-fetch not available
    }
  }
} catch (e) {}
