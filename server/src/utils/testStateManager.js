/**
 * Sistema de gestión de estado para pruebas
 * - Estado inicial consistente
 * - Limpieza automatizada
 * - Aislamiento entre pruebas
 * - Manejo de efectos secundarios
 */

const { v4: uuidv4 } = require('uuid');

class TestStateManager {
  constructor() {
    this.state = new Map();
    this.cleanupFns = new Set();
    this.testId = null;
  }

  // Inicialización de estado para una prueba
  initializeTest(testName) {
    this.testId = uuidv4();
    this.state.set(this.testId, {
      name: testName,
      startTime: Date.now(),
      mocks: new Map(),
      data: new Map(),
      errors: [],
      cleanupRequired: new Set()
    });
    return this.testId;
  }

  // Gestión de estado
  setState(key, value) {
    if (!this.testId) throw new Error('No test initialized');
    const testState = this.state.get(this.testId);
    testState.data.set(key, value);
  }

  getState(key) {
    if (!this.testId) throw new Error('No test initialized');
    const testState = this.state.get(this.testId);
    return testState.data.get(key);
  }

  // Gestión de mocks
  setMock(service, mock) {
    if (!this.testId) throw new Error('No test initialized');
    const testState = this.state.get(this.testId);
    testState.mocks.set(service, mock);
  }

  getMock(service) {
    if (!this.testId) throw new Error('No test initialized');
    const testState = this.state.get(this.testId);
    return testState.mocks.get(service);
  }

  // Registro de errores
  recordError(error) {
    if (!this.testId) throw new Error('No test initialized');
    const testState = this.state.get(this.testId);
    testState.errors.push({
      message: error.message,
      stack: error.stack,
      timestamp: Date.now()
    });
  }

  // Gestión de limpieza
  registerCleanup(fn) {
    if (!this.testId) throw new Error('No test initialized');
    const testState = this.state.get(this.testId);
    testState.cleanupRequired.add(fn);
    this.cleanupFns.add(fn);
  }

  async cleanup() {
    if (!this.testId) return;

    const testState = this.state.get(this.testId);
    if (!testState) return;

    // Ejecutar funciones de limpieza registradas
    for (const fn of testState.cleanupRequired) {
      try {
        await fn();
      } catch (error) {
        console.error('Error during cleanup:', error);
      }
    }

    // Limpiar estado
    testState.mocks.clear();
    testState.data.clear();
    testState.errors = [];
    testState.cleanupRequired.clear();

    // Eliminar estado de la prueba
    this.state.delete(this.testId);
    this.testId = null;
  }

  // Aislamiento de pruebas
  isolateTest(fn) {
    return async (...args) => {
      const testId = this.initializeTest(fn.name);
      try {
        const result = await fn(...args);
        return result;
      } finally {
        await this.cleanup();
      }
    };
  }

  // Gestión de efectos secundarios
  trackSideEffect(effect) {
    if (!this.testId) throw new Error('No test initialized');
    const testState = this.state.get(this.testId);
    
    const cleanup = effect();
    if (typeof cleanup === 'function') {
      this.registerCleanup(cleanup);
    }
  }

  // Utilidades
  getCurrentTestInfo() {
    if (!this.testId) return null;
    const testState = this.state.get(this.testId);
    return {
      id: this.testId,
      name: testState.name,
      startTime: testState.startTime,
      duration: Date.now() - testState.startTime,
      errorCount: testState.errors.length,
      mockCount: testState.mocks.size,
      dataKeys: Array.from(testState.data.keys())
    };
  }
}

// Instancia global
const stateManager = new TestStateManager();

// Decoradores para pruebas
const withTestState = (name) => {
  return (target, propertyKey, descriptor) => {
    const originalMethod = descriptor.value;
    descriptor.value = stateManager.isolateTest(originalMethod);
    return descriptor;
  };
};

module.exports = {
  stateManager,
  withTestState
};