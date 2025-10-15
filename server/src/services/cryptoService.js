import CryptoIntegration from '../integrations/CryptoIntegration.js';

/**
 * Service for calculating crypto volatility risk index
 * Analyzes cryptocurrency market data to determine volatility-based risk levels
 */
class CryptoService {
  constructor() {
    this.cryptoIntegration = new CryptoIntegration();
  }

  /**
   * Calculates crypto volatility risk index based on price changes and market data
   * @param {Array<string>} cryptoIds - Array of cryptocurrency IDs to analyze
   * @returns {Promise<number>} Risk index between 0-100 (0 = low risk, 100 = high risk)
   */
  async getCryptoVolatilityIndex(cryptoIds = ['bitcoin', 'ethereum']) {
    try {
      const cryptoData = await this.cryptoIntegration.getCryptoData(cryptoIds);

      if (!cryptoData || cryptoData.length === 0) {
        console.warn('No crypto data available, returning default risk index');
        return 25; // Default moderate risk
      }

      // Calculate volatility based on price changes
      let totalVolatility = 0;
      let validCryptos = 0;

      for (const crypto of cryptoData) {
        if (crypto && crypto.price_change_percentage_24h !== undefined) {
          // Use absolute percentage change as volatility measure
          const volatility = Math.abs(crypto.price_change_percentage_24h);
          totalVolatility += volatility;
          validCryptos++;
        }
      }

      if (validCryptos === 0) {
        return 25; // Default moderate risk
      }

      const averageVolatility = totalVolatility / validCryptos;

      // Normalize to 0-100 scale
      // Volatility > 10% = high risk (80-100)
      // Volatility 5-10% = medium risk (40-80)
      // Volatility < 5% = low risk (0-40)
      let riskIndex;
      if (averageVolatility > 10) {
        riskIndex = 80 + (averageVolatility - 10) * 2; // Scale up for extreme volatility
      } else if (averageVolatility > 5) {
        riskIndex = 40 + (averageVolatility - 5) * 8;
      } else {
        riskIndex = averageVolatility * 8;
      }

      // Cap at 100
      return Math.min(Math.max(riskIndex, 0), 100);

    } catch (error) {
      console.error('Error calculating crypto volatility index:', error);
      return 25; // Return moderate risk as fallback
    }
  }

  /**
   * Gets detailed crypto market analysis
   * @param {Array<string>} cryptoIds - Array of cryptocurrency IDs
   * @returns {Promise<object>} Detailed market analysis
   */
  async getCryptoMarketAnalysis(cryptoIds = ['bitcoin', 'ethereum']) {
    try {
      const cryptoData = await this.cryptoIntegration.getCryptoData(cryptoIds);

      return {
        timestamp: new Date().toISOString(),
        volatilityIndex: await this.getCryptoVolatilityIndex(cryptoIds),
        marketData: cryptoData,
        analysis: {
          totalCryptos: cryptoData ? cryptoData.length : 0,
          averageVolatility: cryptoData ?
            cryptoData.reduce((sum, crypto) =>
              sum + Math.abs(crypto.price_change_percentage_24h || 0), 0) / cryptoData.length : 0,
          riskAssessment: this._assessRiskLevel(await this.getCryptoVolatilityIndex(cryptoIds))
        },
        source: 'CryptoService'
      };
    } catch (error) {
      console.error('Error in crypto market analysis:', error);
      return {
        timestamp: new Date().toISOString(),
        volatilityIndex: 25,
        marketData: [],
        analysis: {
          totalCryptos: 0,
          averageVolatility: 0,
          riskAssessment: 'Moderate'
        },
        source: 'CryptoService - Error Fallback',
        error: error.message
      };
    }
  }

  /**
   * Assesses risk level based on volatility index
   * @param {number} volatilityIndex - The calculated volatility index
   * @returns {string} Risk level description
   */
  _assessRiskLevel(volatilityIndex) {
    if (volatilityIndex >= 70) return 'High';
    if (volatilityIndex >= 40) return 'Moderate';
    return 'Low';
  }
}

export default CryptoService;