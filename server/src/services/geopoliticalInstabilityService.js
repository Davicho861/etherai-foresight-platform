import MetatronAgent from '../agents.js';

/**
 * Service for calculating global geopolitical instability risk index
 * Analyzes geopolitical tensions and conflicts to determine risk levels
 */
class GeopoliticalInstabilityService {
  constructor() {
    this.agent = new MetatronAgent('GeopoliticalInstabilityAgent');
  }

  /**
   * Calculates geopolitical instability risk index based on global conflict indicators
   * @param {Array<string>} regions - Array of regions to analyze
   * @returns {Promise<number>} Risk index between 0-100 (0 = low risk, 100 = high risk)
   */
  async getGeopoliticalInstabilityIndex(regions = ['global']) {
    try {
      const geopoliticalData = await this.agent.run({
        regions,
        analysisType: 'geopolitical-instability'
      });

      if (!geopoliticalData || !geopoliticalData.riskAssessment) {
        console.warn('No geopolitical instability data available, returning default risk index');
        return 45; // Default moderate-high risk
      }

      // Calculate risk based on various geopolitical indicators
      let totalRisk = 0;
      let factors = 0;

      if (geopoliticalData.riskAssessment.conflictIntensity) {
        totalRisk += geopoliticalData.riskAssessment.conflictIntensity * 0.35;
        factors++;
      }

      if (geopoliticalData.riskAssessment.tensionLevel) {
        totalRisk += geopoliticalData.riskAssessment.tensionLevel * 0.25;
        factors++;
      }

      if (geopoliticalData.riskAssessment.sanctionsImpact) {
        totalRisk += geopoliticalData.riskAssessment.sanctionsImpact * 0.2;
        factors++;
      }

      if (geopoliticalData.riskAssessment.allianceInstability) {
        totalRisk += geopoliticalData.riskAssessment.allianceInstability * 0.2;
        factors++;
      }

      const riskIndex = factors > 0 ? totalRisk / factors : 45;

      // Cap at 100
      return Math.min(Math.max(riskIndex, 0), 100);

    } catch (error) {
      console.error('Error calculating geopolitical instability index:', error);
      return 45; // Return moderate-high risk as fallback
    }
  }

  /**
   * Gets detailed geopolitical instability risk analysis
   * @param {Array<string>} regions - Array of regions to analyze
   * @returns {Promise<object>} Detailed geopolitical instability analysis
   */
  async getGeopoliticalInstabilityAnalysis(regions = ['global']) {
    try {
      const riskIndex = await this.getGeopoliticalInstabilityIndex(regions);

      return {
        timestamp: new Date().toISOString(),
        riskIndex: riskIndex,
        regions: regions,
        analysis: {
          riskLevel: this._assessRiskLevel(riskIndex),
          keyFactors: ['Conflict intensity', 'Tension level', 'Sanctions impact', 'Alliance instability'],
          recommendations: this._generateRecommendations(riskIndex)
        },
        source: 'GeopoliticalInstabilityService'
      };
    } catch (error) {
      console.error('Error in geopolitical instability analysis:', error);
      return {
        timestamp: new Date().toISOString(),
        riskIndex: 45,
        regions: regions,
        analysis: {
          riskLevel: 'Moderate',
          keyFactors: ['Conflict intensity', 'Tension level', 'Sanctions impact', 'Alliance instability'],
          recommendations: ['Monitor diplomatic developments', 'Diversify trade routes', 'Strengthen international alliances']
        },
        source: 'GeopoliticalInstabilityService - Error Fallback',
        error: error.message
      };
    }
  }

  /**
   * Assesses risk level based on geopolitical instability risk index
   * @param {number} riskIndex - The calculated risk index
   * @returns {string} Risk level description
   */
  _assessRiskLevel(riskIndex) {
    if (riskIndex >= 80) return 'Critical';
    if (riskIndex >= 60) return 'High';
    if (riskIndex >= 30) return 'Moderate';
    if (riskIndex >= 15) return 'Low';
    return 'Minimal';
  }

  /**
   * Generates recommendations based on risk level
   * @param {number} riskIndex - The calculated risk index
   * @returns {Array<string>} Array of recommendations
   */
  _generateRecommendations(riskIndex) {
    const recommendations = [];

    if (riskIndex >= 80) {
      recommendations.push('Activate emergency diplomatic protocols');
      recommendations.push('Implement crisis management procedures');
      recommendations.push('Prepare for potential sanctions');
      recommendations.push('Strengthen military readiness');
    } else if (riskIndex >= 60) {
      recommendations.push('Enhance diplomatic monitoring');
      recommendations.push('Diversify strategic partnerships');
      recommendations.push('Build economic resilience');
      recommendations.push('Strengthen intelligence capabilities');
    } else if (riskIndex >= 30) {
      recommendations.push('Monitor geopolitical developments closely');
      recommendations.push('Strengthen international cooperation');
      recommendations.push('Develop contingency plans');
      recommendations.push('Enhance risk communication');
    } else if (riskIndex >= 15) {
      recommendations.push('Maintain diplomatic engagement');
      recommendations.push('Monitor emerging tensions');
      recommendations.push('Build international trust');
    } else {
      recommendations.push('Continue routine diplomatic activities');
      recommendations.push('Support international institutions');
    }

    return recommendations;
  }
}

export default GeopoliticalInstabilityService;