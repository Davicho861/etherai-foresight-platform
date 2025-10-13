/**
 * @fileoverview Prediction Engine for Global Risk Assessment.
 * This service consumes integrated data sources to generate and update predictive risk indices.
 * It represents the "Perpetual Prophecy Flow" of the Aion directive.
 */

import axios from 'axios';
import { calculateEthicalVector } from './ethicalVectorModule.js';
import cache from '../cache.js';

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
  const foodSecurityData = await fetchInternalData('/api/global-risk/food-security');

  if (!foodSecurityData || !foodSecurityData.data) {
    console.error('[PredictionEngine] Invalid food security data received.');
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
}

/**
 * Updates the Geophysical Risk Index based on the latest seismic activity.
 */
async function updateGeophysicalRiskIndex() {
  console.log('[PredictionEngine] Updating Geophysical Risk Index...');
  const seismicEvents = await fetchInternalData('/api/seismic/activity');

  if (!Array.isArray(seismicEvents)) {
    console.error('[PredictionEngine] Invalid seismic data received.');
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
}

/**
 * Updates the Supply Chain Risk Index based on seismic activity that could disrupt logistics.
 */
async function updateSupplyChainRiskIndex() {
  console.log('[PredictionEngine] Updating Supply Chain Risk Index...');
  const seismicEvents = await fetchInternalData('/api/seismic/activity');

  if (!Array.isArray(seismicEvents)) {
    console.error('[PredictionEngine] Invalid seismic data received for supply chain analysis.');
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
}

/**
 * Updates the Climate Extremes Risk Index based on extreme weather events.
 */
async function updateClimateExtremesRiskIndex() {
  console.log('[PredictionEngine] Updating Climate Extremes Risk Index...');
  const climateData = await fetchInternalData('/api/global-risk/climate-extremes');

  if (!climateData || !climateData.data || !Array.isArray(climateData.data)) {
    console.error('[PredictionEngine] Invalid climate extremes data received.');
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
}

/**
  * Updates the Community Resilience Risk Index based on community resilience data.
  */
async function updateCommunityResilienceRiskIndex() {
  console.log('[PredictionEngine] Updating Community Resilience Risk Index...');
  const resilienceData = await fetchInternalData('/api/global-risk/community-resilience');

  if (!resilienceData || !resilienceData.resilienceAnalysis) {
    console.error('[PredictionEngine] Invalid community resilience data received.');
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
}

/**
  * Updates the Crypto Volatility Risk Index based on cryptocurrency market data.
  */
async function updateCryptoVolatilityRiskIndex() {
  console.log('[PredictionEngine] Updating Crypto Volatility Risk Index...');
  const cryptoData = await fetchInternalData('/api/global-risk/crypto-volatility');

  if (!cryptoData || cryptoData.volatilityIndex === undefined) {
    console.error('[PredictionEngine] Invalid crypto volatility data received.');
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
}

/**
  * Calculates the Multi-Domain Risk Index based on all individual risk indices.
  * This is a weighted average for demonstration.
  */
function updateMultiDomainRiskIndex() {
  console.log('[PredictionEngine] Calculating Multi-Domain Risk Index...');
  const { famineRisk, geophysicalRisk, supplyChainRisk, climateExtremesRisk, communityResilienceRisk, cryptoVolatilityRisk } = predictionState.riskIndices;

  const famineWeight = 0.15;
  const geoWeight = 0.15;
  const supplyChainWeight = 0.15;
  const climateWeight = 0.15;
  const resilienceWeight = 0.15;
  const cryptoWeight = 0.25; // Higher weight for crypto volatility as emerging risk

  const famineValue = famineRisk.value || 0;
  const geoValue = geophysicalRisk.value || 0;
  const supplyChainValue = supplyChainRisk.value || 0;
  const climateValue = climateExtremesRisk.value || 0;
  const resilienceValue = communityResilienceRisk.value || 0;
  const cryptoValue = cryptoVolatilityRisk.value || 0;

  const totalRisk = (famineValue * famineWeight) + (geoValue * geoWeight) + (supplyChainValue * supplyChainWeight) + (climateValue * climateWeight) + (resilienceValue * resilienceWeight) + (cryptoValue * cryptoWeight);
  const weightedConfidence = (famineRisk.confidence * famineWeight) + (geophysicalRisk.confidence * geoWeight) + (supplyChainRisk.confidence * supplyChainWeight) + (climateExtremesRisk.confidence * climateWeight) + (communityResilienceRisk.confidence * resilienceWeight) + (cryptoVolatilityRisk.confidence * cryptoWeight);

  predictionState.multiDomainRiskIndex = {
    value: parseFloat(totalRisk.toFixed(2)),
    confidence: parseFloat(weightedConfidence.toFixed(2)),
  };

  console.log(`[PredictionEngine] Multi-Domain Risk Index updated to ${predictionState.multiDomainRiskIndex.value}.`);
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
    ]);

    updateMultiDomainRiskIndex();
    updateEthicalAssessment();
    predictionState.lastUpdated = new Date().toISOString();
    console.log('[PredictionEngine] Prophecy cycle complete. All risk indices and ethical assessment updated.');

  } catch (error) {
    console.error('[PredictionEngine] Error during prophecy cycle:', error.message);
  }
}

export {
  runProphecyCycle,
  getRiskIndices,
};
