import BiodiversityIntegration from '../integrations/BiodiversityIntegration.js';

/**
 * Service for calculating biodiversity risk index
 * Analyzes global biodiversity data to determine environmental risk levels
 */
class BiodiversityService {
  constructor() {
    this.biodiversityIntegration = new BiodiversityIntegration();
  }

  /**
   * Calculates biodiversity risk index based on species threat data and regional biodiversity metrics
   * @param {Array<string>} regions - Array of regions to analyze (default: major continents)
   * @returns {Promise<number>} Risk index between 0-100 (0 = low risk, 100 = high risk)
   */
  async getBiodiversityRiskIndex(regions = ['americas', 'africa', 'asia', 'europe', 'oceania']) {
    try {
      const biodiversityData = await this.biodiversityIntegration.getBiodiversityData(regions);
      const threatData = await this.biodiversityIntegration.getSpeciesThreatData();

      if (!biodiversityData || !threatData) {
        console.warn('No biodiversity data available, returning default risk index');
        return 30; // Default moderate risk
      }

      // Calculate threat percentage across all regions
      const totalSpecies = biodiversityData.globalSummary.totalSpecies;
      const totalThreatened = biodiversityData.globalSummary.totalThreatened;
      const threatPercentage = totalSpecies > 0 ? (totalThreatened / totalSpecies) * 100 : 0;

      // Calculate threat distribution from threat categories
      const totalThreats = Object.values(threatData.threatCategories).reduce((sum, category) => sum + category.count, 0);
      const majorThreats = threatData.threatCategories.habitatLoss.count +
                          threatData.threatCategories.climateChange.count +
                          threatData.threatCategories.pollution.count;

      const majorThreatPercentage = totalThreats > 0 ? (majorThreats / totalThreats) * 100 : 0;

      // Combine metrics for risk assessment
      // Base risk from species threat level
      let riskIndex = threatPercentage * 0.6; // 60% weight on species threat

      // Additional risk from major threat categories
      riskIndex += (majorThreatPercentage / 100) * 40; // 40% weight on major threats

      // Normalize to 0-100 scale with some baseline
      riskIndex = Math.min(Math.max(riskIndex + 10, 0), 100); // Add 10 for baseline environmental concern

      return Math.round(riskIndex);

    } catch (error) {
      console.error('Error calculating biodiversity risk index:', error);
      return 30; // Return moderate risk as fallback
    }
  }

  /**
   * Gets detailed biodiversity analysis
   * @param {Array<string>} regions - Array of regions to analyze
   * @returns {Promise<object>} Detailed biodiversity analysis
   */
  async getBiodiversityAnalysis(regions = ['americas', 'africa', 'asia', 'europe', 'oceania']) {
    try {
      const biodiversityData = await this.biodiversityIntegration.getBiodiversityData(regions);
      const threatData = await this.biodiversityIntegration.getSpeciesThreatData();

      const riskIndex = await this.getBiodiversityRiskIndex(regions);

      return {
        timestamp: new Date().toISOString(),
        riskIndex: riskIndex,
        biodiversityData: biodiversityData,
        threatData: threatData,
        analysis: {
          totalRegions: regions.length,
          globalThreatPercentage: biodiversityData.globalSummary.totalSpecies > 0 ?
            (biodiversityData.globalSummary.totalThreatened / biodiversityData.globalSummary.totalSpecies) * 100 : 0,
          majorThreatCategories: Object.entries(threatData.threatCategories)
            .sort(([,a], [,b]) => b.count - a.count)
            .slice(0, 3)
            .map(([category, data]) => ({ category, count: data.count })),
          riskAssessment: this._assessRiskLevel(riskIndex)
        },
        source: 'BiodiversityService'
      };
    } catch (error) {
      console.error('Error in biodiversity analysis:', error);
      return {
        timestamp: new Date().toISOString(),
        riskIndex: 30,
        biodiversityData: null,
        threatData: null,
        analysis: {
          totalRegions: 0,
          globalThreatPercentage: 0,
          majorThreatCategories: [],
          riskAssessment: 'Moderate'
        },
        source: 'BiodiversityService - Error Fallback',
        error: error.message
      };
    }
  }

  /**
   * Assesses risk level based on biodiversity risk index
   * @param {number} riskIndex - The calculated biodiversity risk index
   * @returns {string} Risk level description
   */
  _assessRiskLevel(riskIndex) {
    if (riskIndex >= 70) return 'Critical';
    if (riskIndex >= 50) return 'High';
    if (riskIndex >= 30) return 'Moderate';
    return 'Low';
  }
}

export default BiodiversityService;