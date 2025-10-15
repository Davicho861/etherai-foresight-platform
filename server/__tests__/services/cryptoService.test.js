import CryptoService from '../../src/services/cryptoService.js';
import CryptoIntegration from '../../src/integrations/CryptoIntegration.js';

// Mock the CryptoIntegration
jest.mock('../../src/integrations/CryptoIntegration.js');

describe('CryptoService', () => {
  let cryptoService;
  let mockCryptoIntegration;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock instance
    mockCryptoIntegration = {
      getCryptoData: jest.fn(),
    };

    // Make the constructor return our mock
    CryptoIntegration.mockImplementation(() => mockCryptoIntegration);

    // Create service instance
    cryptoService = new CryptoService();
  });

  describe('getCryptoVolatilityIndex', () => {
    test('should return moderate risk index for normal market conditions', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: -2.5 },
        { id: 'ethereum', price_change_percentage_24h: 1.2 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin', 'ethereum']);

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
      expect(mockCryptoIntegration.getCryptoData).toHaveBeenCalledWith(['bitcoin', 'ethereum']);
    });

    test('should return high risk index for volatile market conditions', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: -15.0 },
        { id: 'ethereum', price_change_percentage_24h: 12.5 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin', 'ethereum']);

      expect(result).toBeGreaterThan(50); // High volatility should result in high risk
      expect(result).toBeLessThanOrEqual(100);
    });

    test('should return low risk index for stable market conditions', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', price_change_percentage_24h: 0.5 },
        { id: 'ethereum', price_change_percentage_24h: -0.3 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin', 'ethereum']);

      expect(result).toBeLessThan(20); // Low volatility should result in low risk
      expect(result).toBeGreaterThanOrEqual(0);
    });

    test('should return default risk when no data available', async () => {
      mockCryptoIntegration.getCryptoData.mockResolvedValue([]);

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin']);

      expect(result).toBe(25); // Default moderate risk
    });

    test('should handle integration errors gracefully', async () => {
      mockCryptoIntegration.getCryptoData.mockRejectedValue(new Error('API Error'));

      const result = await cryptoService.getCryptoVolatilityIndex(['bitcoin']);

      expect(result).toBe(25); // Should return default risk on error
    });
  });

  describe('getCryptoMarketAnalysis', () => {
    test('should return complete market analysis with volatility index', async () => {
      const mockCryptoData = [
        { id: 'bitcoin', symbol: 'btc', name: 'Bitcoin', current_price: 45000, price_change_percentage_24h: -2.5 },
        { id: 'ethereum', symbol: 'eth', name: 'Ethereum', current_price: 2800, price_change_percentage_24h: 1.2 }
      ];

      mockCryptoIntegration.getCryptoData.mockResolvedValue(mockCryptoData);

      const result = await cryptoService.getCryptoMarketAnalysis(['bitcoin', 'ethereum']);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('volatilityIndex');
      expect(result).toHaveProperty('marketData');
      expect(result).toHaveProperty('analysis');
      expect(result.analysis).toHaveProperty('totalCryptos', 2);
      expect(result.analysis).toHaveProperty('averageVolatility');
      expect(result.analysis).toHaveProperty('riskAssessment');
      expect(result).toHaveProperty('source', 'CryptoService');
    });

    test('should handle errors and return fallback data', async () => {
      mockCryptoIntegration.getCryptoData.mockRejectedValue(new Error('API Error'));

      const result = await cryptoService.getCryptoMarketAnalysis(['bitcoin']);

      expect(result).toHaveProperty('timestamp');
      expect(result).toHaveProperty('volatilityIndex', 25);
      expect(result).toHaveProperty('marketData', []);
      expect(result).toHaveProperty('analysis');
      expect(result).toHaveProperty('source', 'CryptoService - Error Fallback');
      expect(result).toHaveProperty('error');
    });
  });

  describe('_assessRiskLevel', () => {
    test('should assess high risk correctly', () => {
      const result = cryptoService._assessRiskLevel(75);
      expect(result).toBe('High');
    });

    test('should assess moderate risk correctly', () => {
      const result = cryptoService._assessRiskLevel(45);
      expect(result).toBe('Moderate');
    });

    test('should assess low risk correctly', () => {
      const result = cryptoService._assessRiskLevel(25);
      expect(result).toBe('Low');
    });
  });
});