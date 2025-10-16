/**
 * Configuración avanzada de Jest para el backend
 * - Gestión de estado global
 * - Mocks automáticos
 * - Limpieza de estado
 * - Manejo de errores robusto
 */

const { server } = require('./__tests__/mocks/server.js');

// Estado global para tests
global.__TEST_STATE__ = {
  mocks: {},
  cache: new Map(),
  context: {},
  initialized: false
};

// Mocks predefinidos para servicios comunes
const DEFAULT_MOCKS = {
  'PandemicsService': {
    source: 'PandemicsService - Error Fallback',
    error: 'Service unavailable'
  },
  'GeopoliticalInstabilityService': {
    source: 'GeopoliticalInstabilityService - Error Fallback',
    error: 'Service unavailable'
  },
  'EconomicInstabilityService': {
    source: 'EconomicInstabilityService - Error Fallback',
    error: 'Service unavailable'
  },
  'CybersecurityService': {
    source: 'CybersecurityService - Error Fallback',
    error: 'Service unavailable'
  }
};

// Utilidades de testing
global.__TEST_UTILS__ = {
  // Resetear el estado global
  resetState: () => {
    global.__TEST_STATE__.mocks = { ...DEFAULT_MOCKS };
    global.__TEST_STATE__.cache.clear();
    global.__TEST_STATE__.context = {};
  },
  
  // Registrar mock personalizado
  registerMock: (service, mock) => {
    global.__TEST_STATE__.mocks[service] = mock;
  },
  
  // Obtener mock registrado
  getMock: (service) => {
    return global.__TEST_STATE__.mocks[service] || DEFAULT_MOCKS[service];
  },
  
  // Limpiar cache
  clearCache: () => {
    global.__TEST_STATE__.cache.clear();
  }
};

// Hooks globales
beforeAll(async () => {
  // Inicializar estado global
  if (!global.__TEST_STATE__.initialized) {
    global.__TEST_UTILS__.resetState();
    global.__TEST_STATE__.initialized = true;
  }

  // Configurar MSW
  if (server && typeof server.listen === 'function') {
    server.listen({ 
      onUnhandledRequest: 'warn',
      quiet: true
    });

    // Configurar fetch mock
    try {
      const realFetch = global.fetch;
      if (typeof jest !== 'undefined' && typeof jest.fn === 'function') {
        global.__realFetch = realFetch;
        
        if (!realFetch || typeof realFetch.mockResolvedValue === 'undefined') {
          const forwarder = jest.fn((...args) => {
            try {
              return global.__realFetch(...args);
            } catch (error) {
              console.error('Fetch error:', error);
              return Promise.reject(error);
            }
          });
          global.fetch = forwarder;
          global.mockFetch = forwarder;
        } else {
          global.mockFetch = global.fetch;
        }
      }
    } catch (error) {
      console.error('Error configuring fetch mock:', error);
    }
  }
});

// Limpieza entre tests
afterEach(async () => {
  // Resetear MSW
  if (server) {
    server.resetHandlers();
  }
  
  // Limpiar cache y mocks
  global.__TEST_UTILS__.clearCache();
  
  // Restaurar mocks por defecto
  global.__TEST_STATE__.mocks = { ...DEFAULT_MOCKS };
  
  // Limpiar contexto
  global.__TEST_STATE__.context = {};
  
  // Limpiar timeouts y timers
  jest.clearAllTimers();
  
  // Restaurar mocks de Jest
  jest.clearAllMocks();
});

// Limpieza final
afterAll(async () => {
  if (server) {
    try {
      await server.close();
    } catch (error) {
      console.error('Error closing MSW server:', error);
    }
  }
  
  // Limpiar estado global
  global.__TEST_STATE__ = {
    mocks: {},
    cache: new Map(),
    context: {},
    initialized: false
  };
  
  // Restaurar console
  try { 
    if (typeof __restoreConsole === 'function') {
      __restoreConsole();
    }
  } catch (error) {
    console.error('Error restoring console:', error);
  }
});
