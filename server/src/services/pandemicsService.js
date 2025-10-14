import MetatronAgent from '../agents.js';

/**
 * Service for calculating global pandemics and health risk index
 * Analyzes global health data to determine pandemic-related risk levels
 */
class PandemicsService {
  constructor() {
    this.agent = new MetatronAgent('GlobalHealthAgent');
  }

  /**
   * Calculates pandemics risk index based on global health indicators
   * @param {Array<string>} regions - Array of regions to analyze
   * @returns {Promise<number>} Risk index between 0-100 (0 = low risk, 100 = high risk)
   */
  async getPandemicsRiskIndex(regions = ['global']) {
    try {
      const healthData = await this.agent.run({
        regions,
        analysisType: 'pandemics'
      });

      if (!healthData || !healthData.riskAssessment) {
        console.warn('No pandemics data available, returning default risk index');
        return 15; // Default low-moderate risk
      }

      // Calculate risk based on various health indicators
      let totalRisk = 0;
      let factors = 0;

      if (healthData.riskAssessment.outbreakSeverity) {
        totalRisk += healthData.riskAssessment.outbreakSeverity * 0.4;
        factors++;
      }

      if (healthData.riskAssessment.vaccineCoverage) {
        // Lower vaccine coverage = higher risk
        totalRisk += (100 - healthData.riskAssessment.vaccineCoverage) * 0.3;
        factors++;
      }

      if (healthData.riskAssessment.healthcareCapacity) {
        // Lower healthcare capacity = higher risk
        totalRisk += (100 - healthData.riskAssessment.healthcareCapacity) * 0.3;
        factors++;
      }

      const riskIndex = factors > 0 ? totalRisk / factors : 15;

      // Cap at 100
      return Math.min(Math.max(riskIndex, 0), 100);

    } catch (error) {
      console.error('Error calculating pandemics risk index:', error);
      return 15; // Return low-moderate risk as fallback
    }
  }

  /**
   * Gets detailed pandemics risk analysis
   * @param {Array<string>} regions - Array of regions to analyze
   * @returns {Promise<object>} Detailed pandemics analysis
   */
  async getPandemicsAnalysis(regions = ['global']) {
    try {
      const riskIndex = await this.getPandemicsRiskIndex(regions);

      return {
        timestamp: new Date().toISOString(),
        riskIndex: riskIndex,
        regions: regions,
        analysis: {
          riskLevel: this._assessRiskLevel(riskIndex),
          keyFactors: ['Outbreak severity', 'Vaccine coverage', 'Healthcare capacity'],
          recommendations: this._generateRecommendations(riskIndex)
        },
        source: 'PandemicsService'
      };
    } catch (error) {
      console.error('Error in pandemics analysis:', error);
      return {
        timestamp: new Date().toISOString(),
        riskIndex: 15,
        regions: regions,
        analysis: {
          riskLevel: 'Low',
          keyFactors: ['Outbreak severity', 'Vaccine coverage', 'Healthcare capacity'],
          recommendations: ['Monitor global health indicators', 'Maintain vaccination programs']
        },
        source: 'PandemicsService - Error Fallback',
        error: error.message
      };
    }
  }

  /**
   * Assesses risk level based on pandemics risk index
   * @param {number} riskIndex - The calculated risk index
   * @returns {string} Risk level description
   */
  _assessRiskLevel(riskIndex) {
    if (riskIndex >= 70) return 'Critical';
    if (riskIndex >= 40) return 'High';
    if (riskIndex >= 20) return 'Moderate';
    return 'Low';
  }

  /**
   * Generates recommendations based on risk level
   * @param {number} riskIndex - The calculated risk index
   * @returns {Array<string>} Array of recommendations
   */
  _generateRecommendations(riskIndex) {
    const recommendations = [];

    if (riskIndex >= 70) {
      recommendations.push('Implement emergency health protocols');
      recommendations.push('Stockpile medical supplies');
      recommendations.push('Activate international health coordination');
    } else if (riskIndex >= 40) {
      recommendations.push('Enhance surveillance systems');
      recommendations.push('Strengthen healthcare infrastructure');
      recommendations.push('Accelerate vaccination campaigns');
    } else if (riskIndex >= 20) {
      recommendations.push('Monitor emerging health threats');
      recommendations.push('Maintain public health readiness');
    } else {
      recommendations.push('Continue routine health monitoring');
      recommendations.push('Support global health initiatives');
    }

    return recommendations;
  }
}

export default PandemicsService;