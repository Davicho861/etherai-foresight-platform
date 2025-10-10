/**
 * @fileoverview Ethical Vector Module for Praevisio AI.
 * This module implements the Quantum Ethics framework for evaluating predictions
 * against human impact, environmental sustainability, and social equity.
 */

/**
 * Calculates the human impact component of the ethical vector.
 * Higher values indicate greater potential harm to human populations.
 * @param {object} riskIndices - The current risk indices from prediction engine.
 * @returns {number} Human impact score (0-1).
 */
function calculateHumanImpact(riskIndices) {
  const { famineRisk, supplyChainRisk } = riskIndices;

  // Human impact primarily from famine and supply chain disruptions
  const famineImpact = (famineRisk.value || 0) / 100; // Normalize to 0-1
  const supplyChainImpact = (supplyChainRisk.value || 0) / 100;

  // Weighted combination: famine has higher human impact weight
  const humanImpact = (famineImpact * 0.7) + (supplyChainImpact * 0.3);

  return Math.min(1, humanImpact);
}

/**
 * Calculates the environmental sustainability component of the ethical vector.
 * Higher values indicate greater environmental risk.
 * @param {object} riskIndices - The current risk indices from prediction engine.
 * @returns {number} Environmental sustainability score (0-1).
 */
function calculateEnvironmentalSustainability(riskIndices) {
  const { geophysicalRisk } = riskIndices;

  // Environmental impact primarily from geophysical events
  const geoImpact = (geophysicalRisk.value || 0) / 100;

  // Additional factors could include climate data when available
  // For now, focus on seismic activity as proxy for environmental disruption

  return Math.min(1, geoImpact);
}

/**
 * Calculates the social equity component of the ethical vector.
 * Higher values indicate greater inequity in risk distribution.
 * @param {object} riskIndices - The current risk indices from prediction engine.
 * @returns {number} Social equity score (0-1).
 */
function calculateSocialEquity(riskIndices) {
  const { famineRisk, supplyChainRisk } = riskIndices;

  // Social equity considers how risks are distributed across populations
  // Higher famine risk in multiple countries indicates inequity
  const famineCountries = famineRisk.countries ? famineRisk.countries.length : 0;
  const famineEquity = Math.min(1, famineCountries / 50); // Normalize by global regions

  // Supply chain disruptions affecting multiple regions
  const affectedRegions = supplyChainRisk.affectedRegions ? supplyChainRisk.affectedRegions.length : 0;
  const supplyEquity = Math.min(1, affectedRegions / 20);

  // Combined equity score
  const socialEquity = (famineEquity * 0.6) + (supplyEquity * 0.4);

  return Math.min(1, socialEquity);
}

/**
 * Calculates the complete ethical vector for the current risk assessment.
 * The vector represents [humanImpact, environmentalSustainability, socialEquity]
 * where each component is normalized 0-1.
 * @param {object} riskIndices - The current risk indices from prediction engine.
 * @returns {object} Ethical vector with components and overall assessment.
 */
function calculateEthicalVector(riskIndices) {
  const humanImpact = calculateHumanImpact(riskIndices);
  const environmentalSustainability = calculateEnvironmentalSustainability(riskIndices);
  const socialEquity = calculateSocialEquity(riskIndices);

  // Overall ethical score: weighted average
  // Human impact has highest weight in ethical considerations
  const overallScore = (humanImpact * 0.5) + (environmentalSustainability * 0.3) + (socialEquity * 0.2);

  return {
    vector: [humanImpact, environmentalSustainability, socialEquity],
    components: {
      humanImpact,
      environmentalSustainability,
      socialEquity,
    },
    overallScore,
    assessment: overallScore > 0.7 ? 'High Ethical Concern' :
                overallScore > 0.4 ? 'Medium Ethical Concern' : 'Low Ethical Concern',
    timestamp: new Date().toISOString(),
  };
}

export {
  calculateHumanImpact,
  calculateEnvironmentalSustainability,
  calculateSocialEquity,
  calculateEthicalVector,
};