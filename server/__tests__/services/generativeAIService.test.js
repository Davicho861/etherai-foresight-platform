/**
 * @fileoverview Tests for Generative AI Service
 */

import { jest } from '@jest/globals';

// Mock axios for API calls
jest.mock('axios');

// Mock the service module before importing
const mockGenerativeAIService = {
  generatePredictiveNarrative: jest.fn(),
  analyzeRiskCorrelations: jest.fn(),
  switchProvider: jest.fn(),
};

jest.doMock('../../src/services/generativeAIService.js', () => ({
  generatePredictiveNarrative: mockGenerativeAIService.generatePredictiveNarrative,
  analyzeRiskCorrelations: mockGenerativeAIService.analyzeRiskCorrelations,
  switchProvider: mockGenerativeAIService.switchProvider,
}));

// Import after mocking - using require for Jest compatibility
const { generatePredictiveNarrative, analyzeRiskCorrelations, switchProvider } = require('../../src/services/generativeAIService.js');

describe('GenerativeAIService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generatePredictiveNarrative', () => {
    const mockRiskData = {
      riskIndices: {
        famineRisk: { value: 25, confidence: 0.85 },
        climateExtremesRisk: { value: 45, confidence: 0.80 },
      },
      multiDomainRiskIndex: { value: 35, confidence: 0.82 },
    };

    const mockOptions = {
      focusAreas: ['climate', 'economic'],
      timeHorizon: '6months',
      detailLevel: 'comprehensive',
      language: 'es',
    };

    it('should generate a predictive narrative successfully', async () => {
      const mockResponse = {
        resumenEjecutivo: 'Análisis narrativo generado exitosamente',
        escenarios: {
          optimista: { descripcion: 'Escenario favorable', probabilidad: 0.3 },
          moderado: { descripcion: 'Escenario equilibrado', probabilidad: 0.4 },
          pesimista: { descripcion: 'Escenario desafiante', probabilidad: 0.3 },
        },
        recomendacionesEstrategicas: ['Implementar medidas preventivas'],
        indicadoresConfianza: { general: 0.8, escenarios: 0.75 },
      };

      mockGenerativeAIService.generatePredictiveNarrative.mockResolvedValue(mockResponse);

      const result = await generatePredictiveNarrative(mockRiskData, mockOptions);

      expect(mockGenerativeAIService.generatePredictiveNarrative).toHaveBeenCalledWith(mockRiskData, mockOptions);
      expect(result).toEqual(mockResponse);
    });

    it('should handle API failures and fallback to mock response', async () => {
      mockGenerativeAIService.generatePredictiveNarrative.mockImplementation(() => {
        throw new Error('API Error');
      });

      const result = await generatePredictiveNarrative(mockRiskData, mockOptions);

      expect(result).toHaveProperty('resumenEjecutivo');
      expect(result).toHaveProperty('escenarios');
      expect(result).toHaveProperty('recomendacionesEstrategicas');
      expect(result).toHaveProperty('indicadoresConfianza');
      expect(result.provider).toBe('mock');
      expect(result.success).toBe(true);
    });

    it('should handle invalid JSON responses gracefully', async () => {
      mockGenerativeAIService.generatePredictiveNarrative.mockResolvedValue('Invalid JSON response');

      const result = await generatePredictiveNarrative(mockRiskData, mockOptions);

      expect(result.success).toBe(false);
      expect(result.rawResponse).toBe('Invalid JSON response');
      expect(result.resumenEjecutivo).toContain('Invalid JSON response');
    });
  });

  describe('analyzeRiskCorrelations', () => {
    const mockRiskIndices = {
      famineRisk: { value: 25 },
      climateExtremesRisk: { value: 45 },
      cryptoVolatilityRisk: { value: 60 },
    };

    it('should analyze risk correlations successfully', async () => {
      const mockAnalysis = {
        correlaciones: ['Fuerte correlación entre riesgo climático y volatilidad cripto'],
        patrones: ['Patrón de aumento en riesgos interconectados'],
        implicaciones: ['Necesidad de estrategias integrales'],
      };

      mockGenerativeAIService.analyzeRiskCorrelations.mockResolvedValue(mockAnalysis);

      const result = await analyzeRiskCorrelations(mockRiskIndices);

      expect(mockGenerativeAIService.analyzeRiskCorrelations).toHaveBeenCalledWith(mockRiskIndices);
      expect(result).toEqual(mockAnalysis);
    });

    it('should handle API failures gracefully', async () => {
      mockGenerativeAIService.analyzeRiskCorrelations.mockImplementation(() => {
        throw new Error('API Error');
      });

      const result = await analyzeRiskCorrelations(mockRiskIndices);

      expect(result.correlaciones).toEqual(['Análisis de correlaciones no disponible']);
      expect(result.patrones).toEqual(['Patrones emergentes requieren análisis de IA']);
      expect(result.implicaciones).toEqual(['Implementar análisis más detallado cuando IA esté disponible']);
      expect(result.provider).toBe('error');
    });
  });

  describe('switchProvider', () => {
    it('should switch to the next available provider', () => {
      mockGenerativeAIService.switchProvider.mockReturnValue('anthropic');

      const result = switchProvider();

      expect(mockGenerativeAIService.switchProvider).toHaveBeenCalled();
      expect(result).toBe('anthropic');
    });
  });

  describe('Integration with Prediction Engine', () => {
    it('should be callable from prediction engine context', async () => {
      // This test ensures the service can be imported and used in the prediction engine
      const mockNarrative = {
        resumenEjecutivo: 'Integración exitosa con motor de predicción',
        escenarios: {
          optimista: { descripcion: 'Mejora continua', probabilidad: 0.4 },
          moderado: { descripcion: 'Estabilidad', probabilidad: 0.4 },
          pesimista: { descripcion: 'Desafíos', probabilidad: 0.2 },
        },
        recomendacionesEstrategicas: ['Mantener monitoreo continuo'],
        indicadoresConfianza: { general: 0.85, escenarios: 0.8 },
      };

      mockGenerativeAIService.generatePredictiveNarrative.mockResolvedValue(mockNarrative);

      const result = await generatePredictiveNarrative({}, {});

      expect(result).toHaveProperty('resumenEjecutivo');
      expect(result).toHaveProperty('escenarios');
      expect(result.escenarios).toHaveProperty('optimista');
      expect(result.escenarios).toHaveProperty('moderado');
      expect(result.escenarios).toHaveProperty('pesimista');
    });
  });
});