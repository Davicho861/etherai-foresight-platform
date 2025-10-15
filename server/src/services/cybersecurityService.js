import MetatronAgent from '../agents.js';

/**
 * Service for calculating global cybersecurity risk index
 * Analyzes cyber threats and vulnerabilities to determine risk levels
 */
class CybersecurityService {
  constructor() {
    this.agent = new MetatronAgent('CybersecurityAgent');
  }

  /**
   * Calculates cybersecurity risk index based on global cyber threat indicators
   * @param {Array<string>} sectors - Array of sectors to analyze
   * @returns {Promise<number>} Risk index between 0-100 (0 = low risk, 100 = high risk)
   */
  async getCybersecurityRiskIndex(sectors = ['global']) {
    try {
      const cyberData = await this.agent.run({
        sectors,
        analysisType: 'cybersecurity'
      });

      if (!cyberData || !cyberData.riskAssessment) {
        console.warn('No cybersecurity data available, returning default risk index');
        return 35; // Default moderate risk
      }

      // Calculate risk based on various cyber indicators
      let totalRisk = 0;
      let factors = 0;

      if (cyberData.riskAssessment.threatLevel) {
        totalRisk += cyberData.riskAssessment.threatLevel * 0.4;
        factors++;
      }

      if (cyberData.riskAssessment.vulnerabilityIndex) {
        totalRisk += cyberData.riskAssessment.vulnerabilityIndex * 0.3;
        factors++;
      }

      if (cyberData.riskAssessment.incidentFrequency) {
        totalRisk += cyberData.riskAssessment.incidentFrequency * 0.3;
        factors++;
      }

      const riskIndex = factors > 0 ? totalRisk / factors : 35;

      // Cap at 100
      return Math.min(Math.max(riskIndex, 0), 100);

    } catch (error) {
      console.error('Error calculating cybersecurity risk index:', error);
      return 35; // Return moderate risk as fallback
    }
  }

  /**
   * Gets detailed cybersecurity risk analysis
   * @param {Array<string>} sectors - Array of sectors to analyze
   * @returns {Promise<object>} Detailed cybersecurity analysis
   */
  async getCybersecurityAnalysis(sectors = ['global']) {
    try {
      const riskIndex = await this.getCybersecurityRiskIndex(sectors);

      return {
        timestamp: new Date().toISOString(),
        riskIndex: riskIndex,
        sectors: sectors,
        analysis: {
          riskLevel: this._assessRiskLevel(riskIndex),
          keyFactors: ['Threat level', 'Vulnerability index', 'Incident frequency'],
          recommendations: this._generateRecommendations(riskIndex)
        },
        source: 'CybersecurityService'
      };
    } catch (error) {
      console.error('Error in cybersecurity analysis:', error);
      return {
        timestamp: new Date().toISOString(),
        riskIndex: 35,
        sectors: sectors,
        analysis: {
          riskLevel: 'Moderate',
          keyFactors: ['Threat level', 'Vulnerability index', 'Incident frequency'],
          recommendations: ['Implement multi-factor authentication', 'Regular security audits', 'Employee training programs']
        },
        source: 'CybersecurityService - Error Fallback',
        error: error.message
      };
    }
  }

  /**
   * Assesses risk level based on cybersecurity risk index
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
      recommendations.push('Implement emergency cybersecurity protocols');
      recommendations.push('Isolate critical systems');
      recommendations.push('Activate incident response teams');
      recommendations.push('Notify authorities and stakeholders');
    } else if (riskIndex >= 60) {
      recommendations.push('Enhance monitoring and detection systems');
      recommendations.push('Conduct immediate security assessments');
      recommendations.push('Update security patches urgently');
      recommendations.push('Strengthen access controls');
    } else if (riskIndex >= 30) {
      recommendations.push('Regular security training for employees');
      recommendations.push('Implement advanced threat detection');
      recommendations.push('Regular vulnerability assessments');
      recommendations.push('Backup critical data');
    } else if (riskIndex >= 15) {
      recommendations.push('Basic security hygiene practices');
      recommendations.push('Regular software updates');
      recommendations.push('Use strong authentication');
    } else {
      recommendations.push('Maintain basic security measures');
      recommendations.push('Monitor emerging threats');
    }

    return recommendations;
  }
}

export default CybersecurityService;