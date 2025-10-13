import CryptoService from '../../src/services/cryptoService.js';
import CryptoIntegration from '../../src/integrations/CryptoIntegration.js';

// Mock the CryptoIntegration
jest.mock('../../src/integrations/CryptoIntegration.js');

describe('CryptoService - Expansion Tests', () => {
  let cryptoService;
  let mockCryptoIntegration;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock instance
    mockCryptoIntegration = {
      getCryptoData: jest.fn(),
      getHistoricalData: jest.fn(),
    };

    // Make the constructor return our mock
    CryptoIntegration.mockImplementation(() => mockCryptoIntegration);

    // Create service instance
    cryptoService = new CryptoService();
  });

  describe('getCryptoVolatilityIndex - Expansion Scenarios', () => {
    test('should handle extreme volatility scenarios (>20% change)', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: -25.0 },
        { id: 'ethereum', price_change_percentage_24h: 18.5 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin', 'ethereum']);

      expect(result).toBeGreaterThan(80); // Extreme volatility should result in very high risk
      expect(result).toBeLessThanOrEqual(100);
    });

    test('should calculate volatility for diverse crypto portfolio', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: -2.5 },
        { id: 'ethereum', price_change_percentage_24h: 1.2 },
        { id: 'solana', price_change_percentage_24h: 5.8 },
        { id: 'cardano', price_change_percentage_24h: -1.1 },
        { id: 'polygon', price_change_percentage_24h: 3.2 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon']);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
      expect(mockCryptoIntegration.getCryptoData).toHaveBeenCalledWith(['bitcoin', 'ethereum', 'solana', 'cardano', 'polygon']);
    });

    test('should handle mixed positive and negative changes', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: 15.0 },
        { id: 'ethereum', price_change_percentage_24h: -12.0 },
        { id: 'solana', price_change_percentage_24h: 8.5 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin', 'ethereum', 'solana']);

      expect(result).toBeGreaterThan(50); // Mixed volatility should be moderate-high
      expect(result).toBeLessThanOrEqual(100);
    });

    test('should handle single cryptocurrency analysis', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: 7.5 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin']);

      expect(result).toBeGreaterThan(30); // Moderate volatility
      expect(result).toBeLessThan(50);
    });
  });

  describe('getCryptoMarketAnalysis - Expansion Features', () => {
    test('should include market cap and trading volume in analysis', async () => {
      const mockCryptoData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 45000,
          market_cap: 850000000000,
          total_volume: 25000000000,
          price_change_percentage_24h: -2.5
        },
        {
          id: 'ethereum',
          symbol: 'eth',
          name: 'Ethereum',
          current_price: 2800,
          market_cap: 335000000000,
          total_volume: 15000000000,
          price_change_percentage_24h: 1.2
        }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoMarketAnalysis(['bitcoin', 'ethereum']);

      expect(result).toHaveProperty('marketData');
      expect(result.marketData.length).toBe(2);
      expect(result.marketData[0]).toHaveProperty('market_cap');
      expect(result.marketData[0]).toHaveProperty('total_volume');
    });

    test('should handle large market cap cryptocurrencies', async () => {
      const mockCryptoData = [
        {
          id: 'bitcoin',
          symbol: 'btc',
          name: 'Bitcoin',
          current_price: 60000,
          market_cap: 1200000000000, // 1.2 trillion
          price_change_percentage_24h: 0.5
        }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoMarketAnalysis(['bitcoin']);

      expect(result.volatilityIndex).toBeLessThan(20); // Low volatility for stable large cap
      expect(result.analysis.riskAssessment).toBe('Low');
    });

    test('should analyze altcoin volatility patterns', async () => {
      const mockCryptoData = [
        { id: 'solana', price_change_percentage_24h: 12.5 },
        { id: 'avalanche-2', price_change_percentage_24h: -8.3 },
        { id: 'polygon', price_change_percentage_24h: 6.7 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoMarketAnalysis(['solana', 'avalanche-2', 'polygon']);

      expect(result.volatilityIndex).toBeGreaterThan(40); // Higher volatility for altcoins
      expect(result.analysis.totalCryptos).toBe(3);
    });
  });

  describe('Error Handling - Expansion', () => {
    test('should handle partial data failures gracefully', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: -2.5 },
        { id: 'ethereum' }, // Missing price_change_percentage_24h
        { id: 'solana', price_change_percentage_24h: 5.8 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin', 'ethereum', 'solana']);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
      // Should still calculate based on available data
    });

    test('should handle network timeouts during market analysis', async () => {
      mockCryptoIntegration.getCryptoData.mockRejectedValue(new Error('Network timeout'));

      const result = await cryptoService.getCryptoMarketAnalysis(['bitcoin']);

      expect(result).toHaveProperty('volatilityIndex', 25);
      expect(result).toHaveProperty('error');
      expect(result.source).toBe('CryptoService - Error Fallback');
    });

    test('should maintain service availability during API outages', async () => {
      mockCryptoIntegration.getCryptoData.mockRejectedValue(new Error('API unavailable'));

      const volatilityResult = await cryptoService.getCryptoVolatilityIndex(['bitcoin']);
      const analysisResult = await cryptoService.getCryptoMarketAnalysis(['bitcoin']);

      expect(volatilityResult).toBe(25); // Default fallback
      expect(analysisResult.volatilityIndex).toBe(25);
      expect(analysisResult.source).toBe('CryptoService - Error Fallback');
    });
  });
});