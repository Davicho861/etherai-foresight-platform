// setupTests: mocks y helpers para el entorno de testing
// Cargar matchers de jest-dom (compatible con versiones recientes)
try {
   
  require('@testing-library/jest-dom');
} catch {
  // no-op si no está presente
}

// Asegurar que global.fetch exista para que tests puedan espiar/mockear con jest.spyOn
// Algunas pruebas usan `jest.spyOn(global, 'fetch')` y eso falla si fetch es undefined.
if (typeof (global as any).fetch === 'undefined') {
  // Proveer un mock por defecto que devuelve un body vacío; los tests individuales
  // pueden sobrescribirlo con jest.spyOn(global, 'fetch').mockResolvedValueOnce(...)
   
  const jestRequire = require('jest-mock');
  (global as any).fetch = jestRequire.fn(() => Promise.resolve({ ok: true, json: async () => ({}) }));
}

// Mock minimal de ResizeObserver para librerías que lo requieren en el DOM (p.ej. radix use-size)
if (typeof (global as any).ResizeObserver === 'undefined') {
  class ResizeObserverMock {
    private cb: any;
    constructor(cb: any) {
      this.cb = cb;
    }
    observe() {
      // no-op
    }
    unobserve() {
      // no-op
    }
    disconnect() {
      // no-op
    }
  }
  (global as any).ResizeObserver = ResizeObserverMock;
}

// Mock IntersectionObserver for tests that use it (prefetchOnVisible)
// Provide a test-friendly IntersectionObserver mock with spies so tests
// can assert constructor/observe calls. If a global is already present,
// don't override it.
if (typeof (global as any).IntersectionObserver === 'undefined') {
  const mockObserve = jest.fn();
  const mockUnobserve = jest.fn();
  const mockDisconnect = jest.fn();
  class IntersectionObserverMock {
    callback: any;
    constructor(cb: any) {
      this.callback = cb;
      (IntersectionObserverMock as any).mockConstructor();
    }
    observe(...args: any[]) {
      mockObserve(...args);
    }
    unobserve(...args: any[]) {
      mockUnobserve(...args);
    }
    disconnect(...args: any[]) {
      mockDisconnect(...args);
    }
    static mockConstructor = jest.fn();
    static getMocks() {
      return { mockObserve, mockUnobserve, mockDisconnect, mockConstructor: IntersectionObserverMock.mockConstructor };
    }
  }
  (global as any).IntersectionObserver = IntersectionObserverMock as any;
}

// Silenciar warnings repetitivos de Recharts en JSDOM (ResponsiveContainer width/height = 0)
// Reemplazamos ResponsiveContainer por un wrapper que rendeiza children directamente.
jest.mock('recharts', () => {
  const original = jest.requireActual('recharts');
  // require React inside the factory to avoid referencing out-of-scope variables
  // (jest restricts access to outer scope in module factories)
   
  const React = require('react');
  return {
    __esModule: true,
    ...original,
    ResponsiveContainer: ({ children }: any) => {
      return React.createElement('div', { style: { width: '100%', height: '300px' } }, children);
    },
  } as any;
});

// Mock robusto para react-simple-maps
// - Geographies llamará a children como función con { geographies: [...] }
// - ComposableMap y Geography son implementaciones mínimas para JSDOM
jest.mock('react-simple-maps', () => {

  const React = require('react');

  // Mock geographies que cubren los códigos ISO_A3 usados en los datos de demo
  const mockGeographies = [
    { rsmKey: 'COL', properties: { ISO_A3: 'COL', NAME: 'Colombia', d: 'M0,0 L10,0 L10,10 Z' } },
    { rsmKey: 'PER', properties: { ISO_A3: 'PER', NAME: 'Perú', d: 'M0,0 L10,0 L10,10 Z' } },
    { rsmKey: 'BRA', properties: { ISO_A3: 'BRA', NAME: 'Brasil', d: 'M0,0 L10,0 L10,10 Z' } },
    { rsmKey: 'MEX', properties: { ISO_A3: 'MEX', NAME: 'México', d: 'M0,0 L10,0 L10,10 Z' } },
    { rsmKey: 'ARG', properties: { ISO_A3: 'ARG', NAME: 'Argentina', d: 'M0,0 L10,0 L10,10 Z' } },
    { rsmKey: 'CHL', properties: { ISO_A3: 'CHL', NAME: 'Chile', d: 'M0,0 L10,0 L10,10 Z' } },
  ];

  return {
    __esModule: true,
    ComposableMap: ({ children, ...props }: any) => React.createElement('svg', { width: 800, height: 600, ...props }, children),
    Geographies: ({ children, ...props }: any) => {
      // Si children es una función (API habitual), invocarla con el shape esperado
      if (typeof children === 'function') {
        return children({ geographies: mockGeographies });
      }
      // Si no, renderizar directamente como contenedor
      return React.createElement('g', props, children);
    },
    Geography: ({ geography, ...props }: any) => React.createElement('path', { d: geography?.properties?.d || '', ...props }),
    // También exportamos un useGeographies sencillo por compatibilidad
    useGeographies: () => ({ geographies: mockGeographies }),
  } as any;
});

// Mock para scrollIntoView en HTMLElement.prototype
Object.defineProperty(window.HTMLElement.prototype, 'scrollIntoView', {
  writable: true,
  value: jest.fn(),
});

// Allow tests to redefine navigator.serviceWorker safely. Some test setups
// define this property; ensure it is configurable so Object.defineProperty
// in tests won't throw. If it's already defined and non-configurable, replace it.
try {
  const existing = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
  if (!existing || existing.configurable) {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      writable: true,
      value: (navigator as any).serviceWorker || undefined,
    });
  } else {
    // Replace by creating a new descriptor (best-effort)
    delete (navigator as any).serviceWorker;
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      writable: true,
      value: undefined,
    });
  }
} catch (e) {
  // ignore; some environments won't allow modification
}

// Provide a safe, test-friendly mock for navigator.serviceWorker when absent.
// This mock exposes:
// - addEventListener/removeEventListener
// - ready (Promise resolving to a mock registration)
// - controller (with postMessage)
// - a helper __trigger(event, payload) to simulate SW events in tests
// - __mocks containing the underlying mock objects so tests can inspect them
(function setupServiceWorkerMock() {
  try {
    const existing = (navigator as any).serviceWorker;
    if (existing) {
      // Expose existing mock for tests to use
      (global as any).__TEST_SERVICE_WORKER_MOCK = existing;
      return;
    }

    const handlers: Record<string, Function[]> = {};
    const mockRegistration = {
      waiting: { postMessage: jest.fn() },
      installing: null,
      active: null,
      scope: '/',
    } as any;

    const mockController = { postMessage: jest.fn() } as any;

    const swMock: any = {
      addEventListener: jest.fn((event: string, cb: Function) => {
        handlers[event] = handlers[event] || [];
        handlers[event].push(cb);
      }),
      removeEventListener: jest.fn((event: string, cb: Function) => {
        handlers[event] = (handlers[event] || []).filter((fn: Function) => fn !== cb);
      }),
      ready: Promise.resolve(mockRegistration),
      controller: mockController,
      // Helper for tests to programmatically trigger service worker events
      __trigger(event: string, payload?: any) {
        (handlers[event] || []).forEach((cb) => {
          try {
            cb(payload);
          } catch (err) {
            // swallow test callback errors here; tests should catch them
          }
        });
      },
      __mocks: { mockRegistration, mockController, handlers },
    };

    try {
      Object.defineProperty(navigator, 'serviceWorker', {
        configurable: true,
        writable: true,
        value: swMock,
      });
    } catch (err) {
      // Fallback assignment if defineProperty is not allowed
      try {
        (navigator as any).serviceWorker = swMock;
      } catch (e) {
        // ignore silently
      }
    }

    // Expose globally for tests to import/access
    (global as any).__TEST_SERVICE_WORKER_MOCK = swMock;
  } catch (e) {
    // ignore any errors during setup in constrained environments
  }
})();

// Mock para Element.prototype.scrollIntoView (para compatibilidad adicional)
Object.defineProperty(window.Element.prototype, 'scrollIntoView', {
  writable: true,
  value: jest.fn(),
});

// Opcional: silenciar warnings de console durante tests (pero conservar errores)
const originalWarn = console.warn.bind(console);
console.warn = (...args: any[]) => {
  const msg = String(args[0] || '');
  if (msg.includes('React Router Future Flag') || msg.includes('The width') || msg.includes('act(')) {
    return;
  }
  originalWarn(...args);
};
