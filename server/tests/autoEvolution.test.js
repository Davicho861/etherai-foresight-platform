import { jest } from '@jest/globals';
import AutoEvolutionEngine from '../src/agents.js';
import { analyzeSeismicActivity } from '../src/agents/GeophysicalRiskAgent.js';

describe('Sistema de Auto-Evolución Predictiva (SAP)', () => {
  let sapEngine;

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    sapEngine = new AutoEvolutionEngine();
    // Limpiar estado entre tests
    sapEngine.qTable = {};
    sapEngine.feedbackHistory = [];
    sapEngine.metaParams = { learningRate: 0.1, discountFactor: 0.9 };
  });

  describe('Reinforcement Learning - Q-Learning', () => {
    test('debe actualizar Q-table correctamente', () => {
      const state = { magnitude: 5.0 };
      const action = 'analyze';
      const reward = 1;
      const nextState = { magnitude: 5.1 };

      sapEngine.updateQTable(state, action, reward, nextState);

      const key = JSON.stringify(state);
      expect(sapEngine.qTable[key][action]).toBeDefined();
      expect(sapEngine.qTable[key][action]).toBeGreaterThan(0);
    });

    test('debe elegir acción con epsilon-greedy', () => {
      const state = { magnitude: 5.0 };
      sapEngine.qTable[JSON.stringify(state)] = { analyze: 1, predict: 0.5 };

      const action = sapEngine.chooseAction(state);
      expect(['analyze', 'predict']).toContain(action);
    });
  });

  describe('Meta-Learning', () => {
    test('debe adaptar parámetros meta basado en feedback', () => {
      sapEngine.feedbackHistory = [
        { reward: 1 }, { reward: 1 }, { reward: 1 }, { reward: 1 }, { reward: 1 },
        { reward: 1 }, { reward: 1 }, { reward: 1 }, { reward: 1 }, { reward: 1 }
      ];
      const originalLR = sapEngine.metaParams.learningRate;

      sapEngine.adaptMetaParams();

      expect(sapEngine.metaParams.learningRate).toBeGreaterThan(originalLR);
    });

    test('debe reducir learning rate con bajo rendimiento', () => {
      sapEngine.feedbackHistory = [
        { reward: -1 }, { reward: -1 }, { reward: -1 }, { reward: -1 }, { reward: -1 },
        { reward: -1 }, { reward: -1 }, { reward: -1 }, { reward: -1 }, { reward: -1 }
      ];
      const originalLR = sapEngine.metaParams.learningRate;

      sapEngine.adaptMetaParams();

      expect(sapEngine.metaParams.learningRate).toBeLessThan(originalLR);
    });
  });

  describe('Integración con Agentes', () => {
    test('debe ejecutar misión geofísica con evolución', async () => {
      const mockData = {
        features: [
          {
            id: 'test1',
            properties: { mag: 5.0, place: 'Test Place', tsunami: 0, time: Date.now(), url: 'test.url' },
            geometry: { coordinates: [0, 0, 10] }
          }
        ]
      };

      const result = await sapEngine.runMission('geophysical', mockData);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('adjustedRiskScore');
      }
    });

    test('GeophysicalRiskAgent debe integrar auto-evolución', async () => {
      const mockData = {
        features: [
          {
            id: 'test1',
            properties: { mag: 6.0, place: 'Test Place', tsunami: 1, time: Date.now(), url: 'test.url' },
            geometry: { coordinates: [0, 0, 10] }
          }
        ]
      };

      const result = await analyzeSeismicActivity(mockData);

      expect(result).toBeDefined();
      expect(result.length).toBe(1);
      expect(result[0]).toHaveProperty('adjustedRiskScore');
    });
  });

  describe('Retroalimentación en Tiempo Real', () => {
    test('debe procesar feedback de misiones', async () => {
      // Mock fs para simular archivo de fallos
      const mockFs = {
        readFile: jest.fn().mockResolvedValue('{"error":"test","metadata":{"missionId":1}}\n'),
        mkdir: jest.fn(),
        appendFile: jest.fn()
      };
      jest.doMock('fs/promises', () => mockFs);

      const feedback = await sapEngine.getMissionFeedback();

      expect(feedback).toBeDefined();
      expect(feedback.reward).toBe(-1); // Fallo
    });

    test('debe registrar feedback interno', () => {
      const state = { magnitude: 5.0 };
      const action = 'analyze';
      const result = [{ adjustedRiskScore: 60 }];

      sapEngine.recordFeedback(state, action, result);

      expect(sapEngine.feedbackHistory.length).toBe(1);
      expect(sapEngine.feedbackHistory[0].reward).toBe(1); // Positivo si adjustedRiskScore válido
    });
  });

  describe('Cobertura de Funcionalidades', () => {
    test('debe manejar datos históricos simulados', async () => {
      const historicalData = await sapEngine.loadHistoricalData();
      expect(Array.isArray(historicalData)).toBe(true);
    });

    test('debe crear agentes correctamente', () => {
      expect(sapEngine.agents.geophysical).toBeDefined();
      expect(typeof sapEngine.agents.geophysical.analyze).toBe('function');
    });
  });
});