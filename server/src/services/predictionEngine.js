/**
 * @fileoverview Prediction Engine for Global Risk Assessment.
 * This service consumes integrated data sources to generate and update predictive risk indices.
 * It represents the "Perpetual Prophecy Flow" of the Aion directive.
 */

import axios from 'axios';
import { calculateEthicalVector } from './ethicalVectorModule.js';
import cache from '../cache.js';

// Lazy load generative AI service to avoid circular dependencies
let generativeAIService = null;
const getGenerativeAIService = async () => {
  if (!generativeAIService) {
    const module = await import('./generativeAIService.js');
    generativeAIService = module.default || module;
  }
  return generativeAIService;
};

// This would be stored in a more secure and dynamic configuration in a real system.
// Resolve the internal API base URL to the actual running server port.
// Default to PORT env or 4000 (the server listens on 4000 by default for native/dev runs).
const RESOLVED_PORT = process.env.PORT ? Number(process.env.PORT) : (process.env.NATIVE_DEV_MODE === 'true' ? 4003 : 4000);
const PRAEVISIO_API_BASE_URL = `http://localhost:${RESOLVED_PORT}`;
const AUTH_TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

const predictionState = {
  lastUpdated: null,
  riskIndices: {
    famineRisk: {
      value: null,
      source: null,
      confidence: 0.0,
    },
    geophysicalRisk: {
      value: null,
      source: 'USGS',
      confidence: 0.0,
      significantEvents: [],
    },
    supplyChainRisk: {
      value: null,
      source: 'USGS-Seismic',
      confidence: 0.0,
      affectedRegions: [],
    },
    climateExtremesRisk: {
      value: null,
      source: 'NASA-POWER',
      confidence: 0.0,
      extremeEvents: [],
      affectedCountries: [],
    },
    communityResilienceRisk: {
      value: null,
      source: 'CommunityResilienceAgent',
      confidence: 0.0,
      lowResilienceCountries: [],
      averageResilience: 0,
    },
    cryptoVolatilityRisk: {
      value: null,
      source: 'CryptoService',
      confidence: 0.0,
      volatilityIndex: 0,
      riskAssessment: 'Low',
      marketData: [],
    },
    biodiversityRisk: {
      value: null,
      source: 'BiodiversityService',
      confidence: 0.0,
      riskIndex: 0,
      riskAssessment: 'Low',
      regions: [],
    },
    pandemicsRisk: {
      value: null,
      source: 'PandemicsService',
      confidence: 0.0,
      riskIndex: 0,
      riskLevel: 'Low',
      regions: [],
    },
    cybersecurityRisk: {
      value: null,
      source: 'CybersecurityService',
      confidence: 0.0,
      riskIndex: 0,
      riskLevel: 'Low',
      sectors: [],
    },
    economicInstabilityRisk: {
      value: null,
      source: 'EconomicInstabilityService',
      confidence: 0.0,
      riskIndex: 0,
      riskLevel: 'Low',
      regions: [],
    },
    geopoliticalInstabilityRisk: {
      value: null,
      source: 'GeopoliticalInstabilityService',
      confidence: 0.0,
      riskIndex: 0,
      riskLevel: 'Low',
      regions: [],
    },
  },
  multiDomainRiskIndex: {
    value: null,
    confidence: 0.0,
  },
  ethicalAssessment: {
    vector: [0, 0, 0],
    components: {
      humanImpact: 0,
      environmentalSustainability: 0,
      socialEquity: 0,
    },
    overallScore: 0,
    assessment: 'Low Ethical Concern',
    timestamp: null,
  },
  generativeAnalysis: {
    narrative: null,
    correlations: null,
    lastGenerated: null,
    confidence: 0.0,
  },
};

/**
 * Fetches data from a Praevisio internal API endpoint with caching.
 * @param {string} endpoint The API endpoint to fetch data from.
 * @returns {Promise<object>} The data from the endpoint.
 */
async function fetchInternalData(endpoint) {
  const cacheKey = `internal_${endpoint}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`[PredictionEngine] Using cached data for ${endpoint}`);
    return cached;
  }


  try {
    const response = await axios.get(`${PRAEVISIO_API_BASE_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
    });
    const data = response.data.data || response.data;
    // Cache for 5 minutes
    cache.set(cacheKey, data, 5 * 60 * 1000);
    return data;
  } catch (error) {
    console.error(`[PredictionEngine] Failed to fetch internal data from ${endpoint}:`, error && error.stack ? error.stack : (error && error.message) || String(error));
    throw new Error('Internal data source unavailable.');
  }
}

/**
 * Updates the Famine Risk Index based on the latest food security data.
 */
async function updateFamineRiskIndex() {
  console.log('[PredictionEngine] Updating Famine Risk Index...');
  try {
    const foodSecurityData = await fetchInternalData('/api/global-risk/food-security');

    if (!foodSecurityData || !foodSecurityData.data) {
      console.warn('[PredictionEngine] Invalid food security data received. Skipping update.');
      return;
    }

  // Calculate risk based on prevalence of undernourishment
  // Higher undernourishment = higher famine risk
  const values = Object.values(foodSecurityData.data).filter(item => item.value !== null && !item.error).map(item => item.value);
  if (values.length === 0) {
    console.error('[PredictionEngine] No valid undernourishment data available.');
    return;
  }

  const averageUndernourishment = values.reduce((sum, val) => sum + val, 0) / values.length;
  // Risk scales with undernourishment: 0-10% = low risk (0-20), 10-20% = medium (20-50), >20% = high (50-100)
  let riskValue;
  if (averageUndernourishment <= 10) {
    riskValue = (averageUndernourishment / 10) * 20;
  } else if (averageUndernourishment <= 20) {
    riskValue = 20 + ((averageUndernourishment - 10) / 10) * 30;
  } else {
    riskValue = 50 + ((averageUndernourishment - 20) / 10) * 50;
  }
  riskValue = Math.min(100, parseFloat(riskValue.toFixed(2)));

  predictionState.riskIndices.famineRisk = {
    value: riskValue,
    source: foodSecurityData.source,
    confidence: 0.85,
    averageUndernourishment: averageUndernourishment,
    countries: Object.keys(foodSecurityData.data)
  };
  console.log(`[PredictionEngine] Famine Risk Index updated to ${riskValue} based on average undernourishment of ${averageUndernourishment.toFixed(2)}%.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Famine Risk Index:', error.message);
  }
}

/**
 * Updates the Geophysical Risk Index based on the latest seismic activity.
 */
async function updateGeophysicalRiskIndex() {
  console.log('[PredictionEngine] Updating Geophysical Risk Index...');
  try {
    const seismicEvents = await fetchInternalData('/api/seismic/activity');

    if (!Array.isArray(seismicEvents)) {
      console.warn('[PredictionEngine] Invalid seismic data received. Skipping update.');
      return;
    }

  predictionState.riskIndices.geophysicalRisk.significantEvents = seismicEvents;

  if (seismicEvents.length === 0) {
    predictionState.riskIndices.geophysicalRisk.value = 0;
    predictionState.riskIndices.geophysicalRisk.confidence = 0.95; // High confidence in no risk
    console.log('[PredictionEngine] No significant seismic events detected. Geophysical Risk is 0.');
    return;
  }

  // Simplified risk: scale of 0-100 based on the max magnitude of the day.
  // A magnitude of 8.0 or higher is considered catastrophic (100).
  const maxMagnitude = Math.max(...seismicEvents.map(e => e.magnitude));
  const riskValue = Math.min(100, parseFloat(((maxMagnitude / 8.0) * 100).toFixed(2)));

  predictionState.riskIndices.geophysicalRisk.value = riskValue;
  predictionState.riskIndices.geophysicalRisk.confidence = 0.90; // Static confidence

  console.log(`[PredictionEngine] Geophysical Risk Index updated to ${riskValue} based on max magnitude of ${maxMagnitude}.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Geophysical Risk Index:', error.message);
  }
}

/**
 * Updates the Supply Chain Risk Index based on seismic activity that could disrupt logistics.
 */
async function updateSupplyChainRiskIndex() {
  console.log('[PredictionEngine] Updating Supply Chain Risk Index...');
  try {
    const seismicEvents = await fetchInternalData('/api/seismic/activity');

    if (!Array.isArray(seismicEvents)) {
      console.warn('[PredictionEngine] Invalid seismic data received for supply chain analysis. Skipping update.');
      return;
    }

  if (seismicEvents.length === 0) {
    predictionState.riskIndices.supplyChainRisk.value = 0;
    predictionState.riskIndices.supplyChainRisk.confidence = 0.95;
    predictionState.riskIndices.supplyChainRisk.affectedRegions = [];
    console.log('[PredictionEngine] No significant seismic events detected. Supply Chain Risk is 0.');
    return;
  }

  // Identify regions with significant seismic activity that could affect supply chains
  const affectedRegions = seismicEvents
    .filter(event => event.magnitude >= 6.0) // Events >= 6.0 magnitude can disrupt logistics
    .map(event => ({
      location: event.place,
      magnitude: event.magnitude,
      coordinates: event.coordinates,
      potentialImpact: event.magnitude >= 7.0 ? 'High' : 'Medium'
    }));

  // Calculate risk based on number and severity of events
  let riskValue = 0;
  if (affectedRegions.length > 0) {
    const avgMagnitude = affectedRegions.reduce((sum, region) => sum + region.magnitude, 0) / affectedRegions.length;
    const eventCountFactor = Math.min(affectedRegions.length * 10, 50); // Up to 50 points for multiple events
    const magnitudeFactor = Math.min((avgMagnitude - 6.0) * 25, 50); // Scale from 6.0+
    riskValue = Math.min(100, eventCountFactor + magnitudeFactor);
  }

  predictionState.riskIndices.supplyChainRisk.value = riskValue;
  predictionState.riskIndices.supplyChainRisk.confidence = 0.88;
  predictionState.riskIndices.supplyChainRisk.affectedRegions = affectedRegions;

  console.log(`[PredictionEngine] Supply Chain Risk Index updated to ${riskValue} based on ${affectedRegions.length} significant seismic events.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Supply Chain Risk Index:', error.message);
  }
}

/**
 * Updates the Climate Extremes Risk Index based on extreme weather events.
 */
async function updateClimateExtremesRiskIndex() {
  console.log('[PredictionEngine] Updating Climate Extremes Risk Index...');
  try {
    const climateData = await fetchInternalData('/api/global-risk/climate-extremes');

    if (!climateData || !climateData.data || !Array.isArray(climateData.data)) {
      console.warn('[PredictionEngine] Invalid climate extremes data received. Skipping update.');
      return;
    }

  const data = climateData.data;
  const extremeEvents = data.filter(item => item.extremeEvents > 0);
  const affectedCountries = data.filter(item => item.riskLevel === 'high' || item.riskLevel === 'medium');

  // Calculate summary
  const totalExtremeEvents = data.reduce((sum, item) => sum + (item.extremeEvents || 0), 0);
  const highRiskCountries = data.filter(item => item.riskLevel === 'high').length;
  const mediumRiskCountries = data.filter(item => item.riskLevel === 'medium').length;

  // Calculate risk based on extreme events and high-risk countries
  let riskValue = 0;
  if (totalExtremeEvents > 0) {
    riskValue += Math.min(totalExtremeEvents * 5, 50); // Up to 50 points for extreme events
  }
  if (highRiskCountries > 0) {
    riskValue += Math.min(highRiskCountries * 15, 50); // Up to 50 points for high-risk countries
  }
  if (mediumRiskCountries > 0) {
    riskValue += Math.min(mediumRiskCountries * 5, 25); // Up to 25 points for medium-risk countries
  }

  riskValue = Math.min(100, riskValue);

  predictionState.riskIndices.climateExtremesRisk.value = riskValue;
  predictionState.riskIndices.climateExtremesRisk.confidence = 0.85;
  predictionState.riskIndices.climateExtremesRisk.extremeEvents = extremeEvents;
  predictionState.riskIndices.climateExtremesRisk.affectedCountries = affectedCountries;

  console.log(`[PredictionEngine] Climate Extremes Risk Index updated to ${riskValue} based on ${totalExtremeEvents} extreme events, ${highRiskCountries} high-risk countries, and ${mediumRiskCountries} medium-risk countries.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Climate Extremes Risk Index:', error.message);
  }
}

/**
   * Updates the Community Resilience Risk Index based on community resilience data.
   */
async function updateCommunityResilienceRiskIndex() {
  console.log('[PredictionEngine] Updating Community Resilience Risk Index...');
  try {
    const resilienceData = await fetchInternalData('/api/global-risk/community-resilience');

    if (!resilienceData || !resilienceData.resilienceAnalysis) {
      console.warn('[PredictionEngine] Invalid community resilience data received. Skipping update.');
      return;
    }

  const { globalResilienceAssessment, resilienceAnalysis } = resilienceData;

  // Calculate risk: lower resilience = higher risk
  // Risk is 100 - average resilience score
  const averageResilience = globalResilienceAssessment.averageResilience || 0;
  const riskValue = Math.max(0, 100 - averageResilience);

  // Identify countries with low resilience (below 60)
  const lowResilienceCountries = Object.entries(resilienceAnalysis)
    .filter(([country, data]) => data.resilienceScore < 60)
    .map(([country]) => country);

  predictionState.riskIndices.communityResilienceRisk.value = riskValue;
  predictionState.riskIndices.communityResilienceRisk.confidence = 0.80;
  predictionState.riskIndices.communityResilienceRisk.lowResilienceCountries = lowResilienceCountries;
  predictionState.riskIndices.communityResilienceRisk.averageResilience = averageResilience;

  console.log(`[PredictionEngine] Community Resilience Risk Index updated to ${riskValue} based on average resilience of ${averageResilience.toFixed(1)}. Low resilience countries: ${lowResilienceCountries.join(', ')}`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Community Resilience Risk Index:', error.message);
  }
}

/**
   * Updates the Crypto Volatility Risk Index based on cryptocurrency market data.
   */
async function updateCryptoVolatilityRiskIndex() {
  console.log('[PredictionEngine] Updating Crypto Volatility Risk Index...');
  try {
    const cryptoData = await fetchInternalData('/api/global-risk/crypto-volatility');

    if (!cryptoData || cryptoData.volatilityIndex === undefined) {
      console.warn('[PredictionEngine] Invalid crypto volatility data received. Skipping update.');
      return;
    }

  const { volatilityIndex, analysis, marketData } = cryptoData;

  // The volatility index is already calculated by the service (0-100 scale)
  // We use it directly as the risk value
  const riskValue = Math.min(100, Math.max(0, volatilityIndex));

  predictionState.riskIndices.cryptoVolatilityRisk.value = riskValue;
  predictionState.riskIndices.cryptoVolatilityRisk.confidence = 0.85;
  predictionState.riskIndices.cryptoVolatilityRisk.volatilityIndex = volatilityIndex;
  predictionState.riskIndices.cryptoVolatilityRisk.riskAssessment = analysis?.riskAssessment || 'Unknown';
  predictionState.riskIndices.cryptoVolatilityRisk.marketData = marketData || [];

  console.log(`[PredictionEngine] Crypto Volatility Risk Index updated to ${riskValue} (${analysis?.riskAssessment || 'Unknown'} risk) based on ${analysis?.totalCryptos || 0} cryptocurrencies.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Crypto Volatility Risk Index:', error.message);
  }
}

/**
   * Updates the Biodiversity Risk Index based on global biodiversity data.
   */
async function updateBiodiversityRiskIndex() {
  console.log('[PredictionEngine] Updating Biodiversity Risk Index...');
  try {
    const biodiversityData = await fetchInternalData('/api/global-risk/biodiversity');

    if (!biodiversityData || biodiversityData.riskIndex === undefined) {
      console.warn('[PredictionEngine] Invalid biodiversity data received. Skipping update.');
      return;
    }

  const { riskIndex, analysis, biodiversityData: bioData } = biodiversityData;

  // The risk index is already calculated by the service (0-100 scale)
  // We use it directly as the risk value
  const riskValue = Math.min(100, Math.max(0, riskIndex));

  predictionState.riskIndices.biodiversityRisk.value = riskValue;
  predictionState.riskIndices.biodiversityRisk.confidence = 0.80;
  predictionState.riskIndices.biodiversityRisk.riskIndex = riskIndex;
  predictionState.riskIndices.biodiversityRisk.riskAssessment = analysis?.riskAssessment || 'Unknown';
  predictionState.riskIndices.biodiversityRisk.regions = bioData?.regions ? Object.keys(bioData.regions) : [];

  console.log(`[PredictionEngine] Biodiversity Risk Index updated to ${riskValue} (${analysis?.riskAssessment || 'Unknown'} risk) based on ${analysis?.totalRegions || 0} regions.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Biodiversity Risk Index:', error.message);
  }
}

/**
   * Updates the Pandemics Risk Index based on global health data.
   */
async function updatePandemicsRiskIndex() {
  console.log('[PredictionEngine] Updating Pandemics Risk Index...');
  try {
    const pandemicsData = await fetchInternalData('/api/global-risk/pandemics');

    if (!pandemicsData || pandemicsData.riskIndex === undefined) {
      console.warn('[PredictionEngine] Invalid pandemics data received. Skipping update.');
      return;
    }

  const { riskIndex, analysis, regions } = pandemicsData;

  // The risk index is already calculated by the service (0-100 scale)
  // We use it directly as the risk value
  const riskValue = Math.min(100, Math.max(0, riskIndex));

  predictionState.riskIndices.pandemicsRisk.value = riskValue;
  predictionState.riskIndices.pandemicsRisk.confidence = 0.75;
  predictionState.riskIndices.pandemicsRisk.riskIndex = riskIndex;
  predictionState.riskIndices.pandemicsRisk.riskLevel = analysis?.riskLevel || 'Unknown';
  predictionState.riskIndices.pandemicsRisk.regions = regions || [];

  console.log(`[PredictionEngine] Pandemics Risk Index updated to ${riskValue} (${analysis?.riskLevel || 'Unknown'} risk) based on ${regions?.length || 0} regions.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Pandemics Risk Index:', error.message);
  }
}

/**
   * Updates the Cybersecurity Risk Index based on global cyber threat data.
   */
async function updateCybersecurityRiskIndex() {
  console.log('[PredictionEngine] Updating Cybersecurity Risk Index...');
  try {
    const cybersecurityData = await fetchInternalData('/api/global-risk/cybersecurity');

    if (!cybersecurityData || cybersecurityData.riskIndex === undefined) {
      console.warn('[PredictionEngine] Invalid cybersecurity data received. Skipping update.');
      return;
    }

  const { riskIndex, analysis, sectors } = cybersecurityData;

  // The risk index is already calculated by the service (0-100 scale)
  // We use it directly as the risk value
  const riskValue = Math.min(100, Math.max(0, riskIndex));

  predictionState.riskIndices.cybersecurityRisk.value = riskValue;
  predictionState.riskIndices.cybersecurityRisk.confidence = 0.85;
  predictionState.riskIndices.cybersecurityRisk.riskIndex = riskIndex;
  predictionState.riskIndices.cybersecurityRisk.riskLevel = analysis?.riskLevel || 'Unknown';
  predictionState.riskIndices.cybersecurityRisk.sectors = sectors || [];

  console.log(`[PredictionEngine] Cybersecurity Risk Index updated to ${riskValue} (${analysis?.riskLevel || 'Unknown'} risk) based on ${sectors?.length || 0} sectors.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Cybersecurity Risk Index:', error.message);
  }
}

/**
   * Updates the Economic Instability Risk Index based on global economic data.
   */
async function updateEconomicInstabilityRiskIndex() {
  console.log('[PredictionEngine] Updating Economic Instability Risk Index...');
  try {
    const economicData = await fetchInternalData('/api/global-risk/economic-instability');

    if (!economicData || economicData.riskIndex === undefined) {
      console.warn('[PredictionEngine] Invalid economic instability data received. Skipping update.');
      return;
    }

  const { riskIndex, analysis, regions } = economicData;

  // The risk index is already calculated by the service (0-100 scale)
  // We use it directly as the risk value
  const riskValue = Math.min(100, Math.max(0, riskIndex));

  predictionState.riskIndices.economicInstabilityRisk.value = riskValue;
  predictionState.riskIndices.economicInstabilityRisk.confidence = 0.80;
  predictionState.riskIndices.economicInstabilityRisk.riskIndex = riskIndex;
  predictionState.riskIndices.economicInstabilityRisk.riskLevel = analysis?.riskLevel || 'Unknown';
  predictionState.riskIndices.economicInstabilityRisk.regions = regions || [];

  console.log(`[PredictionEngine] Economic Instability Risk Index updated to ${riskValue} (${analysis?.riskLevel || 'Unknown'} risk) based on ${regions?.length || 0} regions.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Economic Instability Risk Index:', error.message);
  }
}

/**
   * Updates the Geopolitical Instability Risk Index based on global conflict data.
   */
async function updateGeopoliticalInstabilityRiskIndex() {
  console.log('[PredictionEngine] Updating Geopolitical Instability Risk Index...');
  try {
    const geopoliticalData = await fetchInternalData('/api/global-risk/geopolitical-instability');

    if (!geopoliticalData || geopoliticalData.riskIndex === undefined) {
      console.warn('[PredictionEngine] Invalid geopolitical instability data received. Skipping update.');
      return;
    }

  const { riskIndex, analysis, regions } = geopoliticalData;

  // The risk index is already calculated by the service (0-100 scale)
  // We use it directly as the risk value
  const riskValue = Math.min(100, Math.max(0, riskIndex));

  predictionState.riskIndices.geopoliticalInstabilityRisk.value = riskValue;
  predictionState.riskIndices.geopoliticalInstabilityRisk.confidence = 0.75;
  predictionState.riskIndices.geopoliticalInstabilityRisk.riskIndex = riskIndex;
  predictionState.riskIndices.geopoliticalInstabilityRisk.riskLevel = analysis?.riskLevel || 'Unknown';
  predictionState.riskIndices.geopoliticalInstabilityRisk.regions = regions || [];

  console.log(`[PredictionEngine] Geopolitical Instability Risk Index updated to ${riskValue} (${analysis?.riskLevel || 'Unknown'} risk) based on ${regions?.length || 0} regions.`);
  } catch (error) {
    console.warn('[PredictionEngine] Error updating Geopolitical Instability Risk Index:', error.message);
  }
}

/**
  * Calculates the Multi-Domain Risk Index based on all individual risk indices.
  * This is a weighted average for demonstration.
  */
function updateMultiDomainRiskIndex() {
  console.log('[PredictionEngine] Calculating Multi-Domain Risk Index...');
  const { famineRisk, geophysicalRisk, supplyChainRisk, climateExtremesRisk, communityResilienceRisk, cryptoVolatilityRisk, biodiversityRisk, pandemicsRisk, cybersecurityRisk, economicInstabilityRisk, geopoliticalInstabilityRisk } = predictionState.riskIndices;

  const famineWeight = 0.08;
  const geoWeight = 0.08;
  const supplyChainWeight = 0.08;
  const climateWeight = 0.08;
  const resilienceWeight = 0.08;
  const cryptoWeight = 0.10; // Adjusted weight for crypto volatility
  const biodiversityWeight = 0.10; // Adjusted weight for biodiversity
  const pandemicsWeight = 0.10; // New weight for pandemics risk
  const cybersecurityWeight = 0.10; // New weight for cybersecurity risk
  const economicInstabilityWeight = 0.10; // New weight for economic instability
  const geopoliticalInstabilityWeight = 0.10; // New weight for geopolitical instability

  const famineValue = famineRisk.value || 0;
  const geoValue = geophysicalRisk.value || 0;
  const supplyChainValue = supplyChainRisk.value || 0;
  const climateValue = climateExtremesRisk.value || 0;
  const resilienceValue = communityResilienceRisk.value || 0;
  const cryptoValue = cryptoVolatilityRisk.value || 0;
  const biodiversityValue = biodiversityRisk.value || 0;
  const pandemicsValue = pandemicsRisk.value || 0;
  const cybersecurityValue = cybersecurityRisk.value || 0;
  const economicInstabilityValue = economicInstabilityRisk.value || 0;
  const geopoliticalInstabilityValue = geopoliticalInstabilityRisk.value || 0;

  const totalRisk = (famineValue * famineWeight) + (geoValue * geoWeight) + (supplyChainValue * supplyChainWeight) + (climateValue * climateWeight) + (resilienceValue * resilienceWeight) + (cryptoValue * cryptoWeight) + (biodiversityValue * biodiversityWeight) + (pandemicsValue * pandemicsWeight) + (cybersecurityValue * cybersecurityWeight) + (economicInstabilityValue * economicInstabilityWeight) + (geopoliticalInstabilityValue * geopoliticalInstabilityWeight);
  const weightedConfidence = (famineRisk.confidence * famineWeight) + (geophysicalRisk.confidence * geoWeight) + (supplyChainRisk.confidence * supplyChainWeight) + (climateExtremesRisk.confidence * climateWeight) + (communityResilienceRisk.confidence * resilienceWeight) + (cryptoVolatilityRisk.confidence * cryptoWeight) + (biodiversityRisk.confidence * biodiversityWeight) + (pandemicsRisk.confidence * pandemicsWeight) + (cybersecurityRisk.confidence * cybersecurityWeight) + (economicInstabilityRisk.confidence * economicInstabilityWeight) + (geopoliticalInstabilityRisk.confidence * geopoliticalInstabilityWeight);

  predictionState.multiDomainRiskIndex = {
    value: parseFloat(totalRisk.toFixed(2)),
    confidence: parseFloat(weightedConfidence.toFixed(2)),
  };

  console.log(`[PredictionEngine] Multi-Domain Risk Index updated to ${predictionState.multiDomainRiskIndex.value}.`);
}

/**
 * Generates generative AI analysis for the current risk state.
 */
async function updateGenerativeAnalysis() {
  console.log('[PredictionEngine] Generating Generative AI Analysis...');
  try {
    const service = await getGenerativeAIService();
    const currentRiskData = {
      riskIndices: predictionState.riskIndices,
      multiDomainRiskIndex: predictionState.multiDomainRiskIndex,
      ethicalAssessment: predictionState.ethicalAssessment,
    };

    // Generate predictive narrative
    const narrative = await service.generatePredictiveNarrative(currentRiskData, {
      focusAreas: ['climate', 'economic', 'social', 'geopolitical'],
      timeHorizon: '6months',
      detailLevel: 'comprehensive',
      language: 'es'
    });

    // Generate correlation analysis
    const correlations = await service.analyzeRiskCorrelations(predictionState.riskIndices);

    predictionState.generativeAnalysis = {
      narrative,
      correlations,
      lastGenerated: new Date().toISOString(),
      confidence: 0.85, // Base confidence for generative analysis
    };

    console.log('[PredictionEngine] Generative AI Analysis completed successfully.');
  } catch (error) {
    console.warn('[PredictionEngine] Error generating AI analysis:', error.message);
    predictionState.generativeAnalysis = {
      narrative: null,
      correlations: null,
      lastGenerated: new Date().toISOString(),
      confidence: 0.0,
      error: error.message,
    };
  }
}

/**
 * Updates the Ethical Assessment based on current risk indices.
 * Evaluates predictions against human impact, environmental sustainability, and social equity.
 */
function updateEthicalAssessment() {
  console.log('[PredictionEngine] Updating Ethical Assessment...');

  const ethicalVector = calculateEthicalVector(predictionState.riskIndices);
  predictionState.ethicalAssessment = ethicalVector;

  console.log(`[PredictionEngine] Ethical Assessment updated: ${ethicalVector.assessment} (Score: ${ethicalVector.overallScore.toFixed(2)}).`);
}

/**
 * Retrieves the current state of all risk indices.
 * @returns {object} The current prediction state.
 */
function getRiskIndices() {
  return predictionState;
}

/**
 * Initiates the perpetual prophecy cycle.
 */
async function runProphecyCycle() {
  try {
    await Promise.all([
      updateFamineRiskIndex(),
      updateGeophysicalRiskIndex(),
      updateSupplyChainRiskIndex(),
      updateClimateExtremesRiskIndex(),
      updateCommunityResilienceRiskIndex(),
      updateCryptoVolatilityRiskIndex(),
      updateBiodiversityRiskIndex(),
      updatePandemicsRiskIndex(),
      updateCybersecurityRiskIndex(),
      updateEconomicInstabilityRiskIndex(),
      updateGeopoliticalInstabilityRiskIndex(),
    ]);

    updateMultiDomainRiskIndex();
    updateEthicalAssessment();

    // Generate generative AI analysis (non-blocking to avoid delaying the cycle)
    updateGenerativeAnalysis().catch(error => {
      console.warn('[PredictionEngine] Generative analysis failed but cycle continues:', error.message);
    });

    predictionState.lastUpdated = new Date().toISOString();
    console.log('[PredictionEngine] Prophecy cycle complete. All risk indices, ethical assessment, and AI analysis updated.');

  } catch (error) {
    console.error('[PredictionEngine] Error during prophecy cycle:', error.message);
  }
}

export {
  runProphecyCycle,
  getRiskIndices,
};
