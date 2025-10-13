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

describe('Global Risk Routes - Expansion Tests', () => {
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

  describe('GET /api/global-risk/crypto-volatility - Advanced Scenarios', () => {
    test('should handle large cryptocurrency portfolios', async () => {
      const cryptoIds = ['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon', 'avalanche-2', 'chainlink', 'uniswap'];
      const mockCryptoData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        volatilityIndex: 65,
        marketData: cryptoIds.map(id => ({ id, price_change_percentage_24h: Math.random() * 20 - 10 })),
        analysis: {
          totalCryptos: cryptoIds.length,
          averageVolatility: 8.5,
          riskAssessment: 'Moderate'
        },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      const response = await request(app)
        .get(`/api/global-risk/crypto-volatility?cryptoIds=${cryptoIds.join(',')}`)
        .expect(200);

      expect(response.body.data.value).toBe(65);
      expect(response.body.data.unit).toBe('%');
      expect(mockCryptoService.getCryptoMarketAnalysis).toHaveBeenCalledWith(cryptoIds);
    });

    test('should handle extreme volatility scenarios', async () => {
      const mockCryptoData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        volatilityIndex: 95,
        marketData: [
          { id: 'bitcoin', price_change_percentage_24h: -35.0 },
          { id: 'ethereum', price_change_percentage_24h: 28.5 }
        ],
        analysis: {
          totalCryptos: 2,
          averageVolatility: 31.75,
          riskAssessment: 'High'
        },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      const response = await request(app)
        .get('/api/global-risk/crypto-volatility')
        .expect(200);

      expect(response.body.data.value).toBe(95);
      expect(response.body.data.topic).toBe('crypto-volatility');
    });

    test('should provide stable low-volatility responses', async () => {
      const mockCryptoData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        volatilityIndex: 15,
        marketData: [
          { id: 'bitcoin', price_change_percentage_24h: 0.8 },
          { id: 'ethereum', price_change_percentage_24h: -0.3 }
        ],
        analysis: {
          totalCryptos: 2,
          averageVolatility: 0.55,
          riskAssessment: 'Low'
        },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      const response = await request(app)
        .get('/api/global-risk/crypto-volatility')
        .expect(200);

      expect(response.body.data.value).toBe(15);
      expect(response.body.data.unit).toBe('%');
    });

    test('should handle single cryptocurrency analysis', async () => {
      const mockCryptoData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        volatilityIndex: 42,
        marketData: [{ id: 'solana', price_change_percentage_24h: 8.5 }],
        analysis: {
          totalCryptos: 1,
          averageVolatility: 8.5,
          riskAssessment: 'Moderate'
        },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      const response = await request(app)
        .get('/api/global-risk/crypto-volatility?cryptoIds=solana')
        .expect(200);

      expect(response.body.data.value).toBe(42);
      expect(mockCryptoService.getCryptoMarketAnalysis).toHaveBeenCalledWith(['solana']);
    });
  });

  describe('GET /api/global-risk/community-resilience - Advanced Scenarios', () => {
    test('should handle multi-country LATAM analysis', async () => {
      // Mock the service function
      const mockGetCommunityResilienceIndex = jest.fn();
      require('../../src/services/communityResilienceService.js').getCommunityResilienceIndex = mockGetCommunityResilienceIndex;

      const mockResilienceData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {
          COL: { resilienceScore: 72, socialEvents: 8 },
          PER: { resilienceScore: 65, socialEvents: 12 },
          ARG: { resilienceScore: 78, socialEvents: 5 },
          BRA: { resilienceScore: 58, socialEvents: 15 }
        },
        globalResilienceAssessment: {
          averageResilience: 68.25,
          lowResilienceCountries: ['BRA'],
          assessment: 'Mixed resilience across LATAM countries',
          globalRecommendations: ['Focus on Brazil', 'Monitor Peru']
        },
        source: 'CommunityResilienceAgent'
      };

      mockGetCommunityResilienceIndex.mockResolvedValue(mockResilienceData);

      const response = await request(app)
        .get('/api/global-risk/community-resilience?countries=COL,PER,ARG,BRA')
        .expect(200);

      expect(response.body.data.value).toBe(32); // 100 - 68.25 = 31.75, rounded to 32
      expect(response.body.data.topic).toBe('community-resilience');
      expect(mockGetCommunityResilienceIndex).toHaveBeenCalledWith(['COL', 'PER', 'ARG', 'BRA'], 30);
    });

    test('should handle extended analysis periods', async () => {
      const mockGetCommunityResilienceIndex = jest.fn();
      require('../../src/services/communityResilienceService.js').getCommunityResilienceIndex = mockGetCommunityResilienceIndex;

      const mockResilienceData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {
          MEX: { resilienceScore: 63, socialEvents: 25 }
        },
        globalResilienceAssessment: {
          averageResilience: 63,
          lowResilienceCountries: ['MEX'],
          assessment: 'Extended period analysis shows concerning trends',
          globalRecommendations: ['Long-term intervention strategies']
        },
        source: 'CommunityResilienceAgent'
      };

      mockGetCommunityResilienceIndex.mockResolvedValue(mockResilienceData);

      const response = await request(app)
        .get('/api/global-risk/community-resilience?countries=MEX&days=90')
        .expect(200);

      expect(response.body.data.value).toBe(37); // 100 - 63 = 37
      expect(mockGetCommunityResilienceIndex).toHaveBeenCalledWith(['MEX'], 90);
    });

    test('should handle high resilience scenarios', async () => {
      const mockGetCommunityResilienceIndex = jest.fn();
      require('../../src/services/communityResilienceService.js').getCommunityResilienceIndex = mockGetCommunityResilienceIndex;

      const mockResilienceData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {
          CHL: { resilienceScore: 85, socialEvents: 3 }
        },
        globalResilienceAssessment: {
          averageResilience: 85,
          lowResilienceCountries: [],
          assessment: 'High community resilience maintained',
          globalRecommendations: ['Continue monitoring', 'Share best practices']
        },
        source: 'CommunityResilienceAgent'
      };

      mockGetCommunityResilienceIndex.mockResolvedValue(mockResilienceData);

      const response = await request(app)
        .get('/api/global-risk/community-resilience?countries=CHL')
        .expect(200);

      expect(response.body.data.value).toBe(15); // 100 - 85 = 15 (low risk)
    });
  });

  describe('Error Handling and Resilience - Expansion', () => {
    test('should provide fallback data during crypto service outages', async () => {
      mockCryptoService.getCryptoMarketAnalysis.mockRejectedValue(new Error('API rate limit exceeded'));

      const response = await request(app)
        .get('/api/global-risk/crypto-volatility')
        .expect(200);

      expect(response.body.data.value).toBeGreaterThanOrEqual(40);
      expect(response.body.data.value).toBeLessThanOrEqual(100);
      expect(response.body.data.topic).toBe('crypto-volatility');
      expect(response.body.data.unit).toBe('%');
    });

    test('should maintain service availability during community resilience failures', async () => {
      const mockGetCommunityResilienceIndex = jest.fn();
      require('../../src/services/communityResilienceService.js').getCommunityResilienceIndex = mockGetCommunityResilienceIndex;

      mockGetCommunityResilienceIndex.mockRejectedValue(new Error('Agent system down'));

      const response = await request(app)
        .get('/api/global-risk/community-resilience?countries=COL')
        .expect(200);

      expect(response.body.data.value).toBeGreaterThanOrEqual(20);
      expect(response.body.data.value).toBeLessThanOrEqual(40);
      expect(response.body.data.topic).toBe('community-resilience');
    });

    test('should handle malformed query parameters gracefully', async () => {
      const response = await request(app)
        .get('/api/global-risk/crypto-volatility?cryptoIds=')
        .expect(200);

      expect(response.body.data.value).toBeDefined();
      expect(response.body.data.unit).toBe('%');
    });

    test('should handle invalid country codes in community resilience', async () => {
      const mockGetCommunityResilienceIndex = jest.fn();
      require('../../src/services/communityResilienceService.js').getCommunityResilienceIndex = mockGetCommunityResilienceIndex;

      mockGetCommunityResilienceIndex.mockResolvedValue({
        timestamp: '2025-10-13T00:28:00.000Z',
        resilienceAnalysis: {},
        globalResilienceAssessment: {
          averageResilience: 50,
          lowResilienceCountries: [],
          assessment: 'No valid countries provided',
          globalRecommendations: []
        },
        source: 'CommunityResilienceAgent'
      });

      const response = await request(app)
        .get('/api/global-risk/community-resilience?countries=INVALID')
        .expect(200);

      expect(response.body.data.value).toBe(50); // 100 - 50 = 50
    });
  });

  describe('Performance and Scalability - Expansion', () => {
    test('should handle rapid consecutive requests', async () => {
      const mockCryptoData = {
        timestamp: '2025-10-13T00:28:00.000Z',
        volatilityIndex: 35,
        marketData: [],
        analysis: { totalCryptos: 2, averageVolatility: 2.5, riskAssessment: 'Low' },
        source: 'CryptoService'
      };

      mockCryptoService.getCryptoMarketAnalysis.mockResolvedValue(mockCryptoData);

      // Make multiple concurrent requests
      const requests = Array(5).fill().map(() =>
        request(app).get('/api/global-risk/crypto-volatility')
      );

      const responses = await Promise.all(requests);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.data.value).toBe(35);
      });
    });

    test('should maintain response format consistency across different scenarios', async () => {
      // Test various scenarios maintain consistent response structure
      const scenarios = [
        { cryptoIds: 'bitcoin', expectedValue: 25 },
        { cryptoIds: 'bitcoin,ethereum', expectedValue: 45 },
        { cryptoIds: 'solana,cardano,polygon', expectedValue: 55 }
      ];

      for (const scenario of scenarios) {
        mockCryptoService.getCryptoMarketAnalysis.mockResolvedValueOnce({
          timestamp: '2025-10-13T00:28:00.000Z',
          volatilityIndex: scenario.expectedValue,
          marketData: [],
          analysis: { totalCryptos: 1, averageVolatility: 5, riskAssessment: 'Moderate' },
          source: 'CryptoService'
        });

        const response = await request(app)
          .get(`/api/global-risk/crypto-volatility?cryptoIds=${scenario.cryptoIds}`)
          .expect(200);

        expect(response.body).toHaveProperty('status', 'OK');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('topic', 'crypto-volatility');
        expect(response.body.data).toHaveProperty('timestamp');
        expect(response.body.data).toHaveProperty('value');
        expect(response.body.data).toHaveProperty('unit', '%');
      }
    });
  });
});