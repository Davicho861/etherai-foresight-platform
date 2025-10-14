import MetatronAgent from '../agents.js';

/**
 * Service for calculating global economic instability risk index
 * Analyzes economic indicators to determine financial risk levels
 */
class EconomicInstabilityService {
  constructor() {
    this.agent = new MetatronAgent('EconomicInstabilityAgent');
  }

  /**
   * Calculates economic instability risk index based on global economic indicators
   * @param {Array<string>} regions - Array of regions to analyze
   * @returns {Promise<number>} Risk index between 0-100 (0 = low risk, 100 = high risk)
   */
  async getEconomicInstabilityIndex(regions = ['global']) {
    try {
      const economicData = await this.agent.run({
        regions,
        analysisType: 'economic-instability'
      });

      if (!economicData || !economicData.riskAssessment) {
        console.warn('No economic instability data available, returning default risk index');
        return 40; // Default moderate-high risk
      }

      // Calculate risk based on various economic indicators
      let totalRisk = 0;
      let factors = 0;

      if (economicData.riskAssessment.inflationRate) {
        // High inflation = higher risk
        totalRisk += Math.min(economicData.riskAssessment.inflationRate * 2, 100) * 0.25;
        factors++;
      }

      if (economicData.riskAssessment.unemploymentRate) {
        totalRisk += economicData.riskAssessment.unemploymentRate * 0.3;
        factors++;
      }

      if (economicData.riskAssessment.debtToGDPRatio) {
        // High debt = higher risk
        totalRisk += Math.min(economicData.riskAssessment.debtToGDPRatio / 2, 100) * 0.25;
        factors++;
      }

      if (economicData.riskAssessment.currencyVolatility) {
        totalRisk += economicData.riskAssessment.currencyVolatility * 0.2;
        factors++;
      }

      const riskIndex = factors > 0 ? totalRisk / factors : 40;

      // Cap at 100
      return Math.min(Math.max(riskIndex, 0), 100);

    } catch (error) {
      console.error('Error calculating economic instability index:', error);
      return 40; // Return moderate-high risk as fallback
    }
  }

  /**
   * Gets detailed economic instability risk analysis
   * @param {Array<string>} regions - Array of regions to analyze
   * @returns {Promise<object>} Detailed economic instability analysis
   */
  async getEconomicInstabilityAnalysis(regions = ['global']) {
    try {
      const riskIndex = await this.getEconomicInstabilityIndex(regions);

      return {
        timestamp: new Date().toISOString(),
        riskIndex: riskIndex,
        regions: regions,
        analysis: {
          riskLevel: this._assessRiskLevel(riskIndex),
          keyFactors: ['Inflation rate', 'Unemployment rate', 'Debt-to-GDP ratio', 'Currency volatility'],
          recommendations: this._generateRecommendations(riskIndex)
        },
        source: 'EconomicInstabilityService'
      };
    } catch (error) {
      console.error('Error in economic instability analysis:', error);
      return {
        timestamp: new Date().toISOString(),
        riskIndex: 40,
        regions: regions,
        analysis: {
          riskLevel: 'Moderate',
          keyFactors: ['Inflation rate', 'Unemployment rate', 'Debt-to-GDP ratio', 'Currency volatility'],
          recommendations: ['Diversify investments', 'Monitor inflation trends', 'Strengthen fiscal policies']
        },
        source: 'EconomicInstabilityService - Error Fallback',
        error: error.message
      };
    }
  }

  /**
   * Assesses risk level based on economic instability risk index
   * @param {number} riskIndex - The calculated risk index
   * @returns {string} Risk level description
   */
  _assessRiskLevel(riskIndex) {
    if (riskIndex >= 75) return 'Critical';
    if (riskIndex >= 50) return 'High';
    if (riskIndex >= 25) return 'Moderate';
    return 'Low';
  }

  /**
   * Generates recommendations based on risk level
   * @param {number} riskIndex - The calculated risk index
   * @returns {Array<string>} Array of recommendations
   */
  _generateRecommendations(riskIndex) {
    const recommendations = [];

    if (riskIndex >= 75) {
      recommendations.push('Implement emergency economic measures');
      recommendations.push('Activate international financial aid');
      recommendations.push('Restructure national debt');
      recommendations.push('Implement capital controls if necessary');
    } else if (riskIndex >= 50) {
      recommendations.push('Strengthen monetary policy');
      recommendations.push('Implement fiscal stimulus');
      recommendations.push('Monitor currency stability');
      recommendations.push('Diversify trade partners');
    } else if (riskIndex >= 25) {
      recommendations.push('Monitor economic indicators closely');
      recommendations.push('Build foreign exchange reserves');
      recommendations.push('Implement structural reforms');
      recommendations.push('Strengthen financial regulations');
    } else {
      recommendations.push('Maintain stable economic policies');
      recommendations.push('Monitor global economic trends');
      recommendations.push('Build economic resilience');
    }

    return recommendations;
  }
}

export default EconomicInstabilityService;