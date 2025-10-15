import request from 'supertest';
import express from 'express';
import globalRiskRoutes from '../../src/routes/globalRiskRoutes.js';

// Mock the services
jest.mock('../../src/services/cryptoService.js');
jest.mock('../../src/services/worldBankService.js');
jest.mock('../../src/services/usgsService.js');
jest.mock('../../src/services/climateService.js');
jest.mock('../../src/services/communityResilienceService.js');

import CryptoService from '../../src/services/cryptoService.js';

describe('Global Risk Routes', () => {
  let app;
  let mockCryptoService;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create mock crypto service
    mockCryptoService = {
      getCryptoMarketAnalysis: jest.fn(),
    };
    CryptoService.mockImplementation(() => mockCryptoService);

    // Create express app with routes
    app = express();
    app.use(express.json());
    app.use('/api/global-risk', globalRiskRoutes);
  });

  describe('GET /api/global-risk/crypto-volatility', () => {
    test('should return crypto volatility data successfully', async () => {
      const mockCryptoData = {
        timestamp: '2025-10-12T17:00:00.000Z',
        volatilityIndex: 35,
        marketData: [
          { id: 'bitcoin', price_change_percentage_24h: -2.5 },
          { id: 'ethereum', price_change_percentage_24h: 1.2 }
        ],
        analysis: {
          totalCryptos: 2,
          averageVolatility: 1.85,
          riskAssessment: 'Moderate'
        },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      const response = await request(app)
        .get('/api/global-risk/crypto-volatility')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('source', 'Praevisio-Aion-CryptoService');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('data', mockCryptoData);
      expect(mockCryptoService.getCryptoMarketAnalysis).toHaveBeenCalledWith(['bitcoin', 'ethereum']);
    });

    test('should handle custom crypto IDs parameter', async () => {
      const mockCryptoData = {
        timestamp: '2025-10-12T17:00:00.000Z',
        volatilityIndex: 25,
        marketData: [{ id: 'solana', price_change_percentage_24h: 0.5 }],
        analysis: {
          totalCryptos: 1,
          averageVolatility: 0.5,
          riskAssessment: 'Low'
        },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      const response = await request(app)
        .get('/api/global-risk/crypto-volatility?cryptoIds=solana,cardano')
        .expect(200);

      expect(mockCryptoService.getCryptoMarketAnalysis).toHaveBeenCalledWith(['solana', 'cardano']);
    });

    test('should handle service errors gracefully', async () => {
      mockCryptoService.getCryptoMarketAnalysis.mockRejectedValue(new Error('Service unavailable'));

      const response = await request(app)
        .get('/api/global-risk/crypto-volatility')
        .expect(500);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Internal Server Error: Could not retrieve crypto volatility data.');
    });

    test('should use default crypto IDs when none provided', async () => {
      const mockCryptoData = {
        timestamp: '2025-10-12T17:00:00.000Z',
        volatilityIndex: 40,
        marketData: [],
        analysis: {
          totalCryptos: 0,
          averageVolatility: 0,
          riskAssessment: 'Low'
        },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      await request(app)
        .get('/api/global-risk/crypto-volatility')
        .expect(200);

      expect(mockCryptoService.getCryptoMarketAnalysis).toHaveBeenCalledWith(['bitcoin', 'ethereum']);
    });
  });
});