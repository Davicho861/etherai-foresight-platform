// jest.setup.backend.js
// This file runs after the test environment is set up and provides per-test
// lifecycle hooks. We use it to manage MSW server lifecycle and isolate tests.
const { server } = require('./__tests__/mocks/server.js');

// Defensive: ensure server exists before calling lifecycle methods
if (server && typeof server.listen === 'function') {
	// Iniciar el servidor MSW antes de todas las pruebas
	beforeAll(() => {
		server.listen({ onUnhandledRequest: 'bypass' });

		// After MSW has started, MSW may install interceptors that replace global.fetch.
		// Wrap the resulting fetch with a jest.fn forwarder so tests can call
		// fetch.mockResolvedValue / mockImplementation while preserving the real behavior.
		try {
			const realFetch = global.fetch;
			if (typeof jest !== 'undefined' && typeof jest.fn === 'function') {
				// Keep a reference to the real fetch provided by MSW or Node
				global.__realFetch = realFetch;

				// If fetch is already a jest mock, keep it; otherwise replace with a forwarding mock
				if (!realFetch || typeof realFetch.mockResolvedValue === 'undefined') {
					const forwarder = jest.fn((...args) => global.__realFetch && global.__realFetch(...args));
					// Ensure common mock methods exist (jest.fn provides them)
					global.fetch = forwarder;
					global.mockFetch = forwarder;
				} else {
					// already jest mock - alias
					global.mockFetch = global.fetch;
				}
			}
		} catch (e) {
			// ignore if jest isn't available or replacement fails
		}
	});

	// Resetear handlers después de cada prueba para aislamiento
	afterEach(() => server.resetHandlers());

	// Cerrar el servidor MSW después de todas las pruebas
	afterAll(() => {
		try {
			server.close();
		} catch (e) {
			try { if (typeof __restoreConsole === 'function') __restoreConsole(); } catch (err) {}
		}
	});
}
