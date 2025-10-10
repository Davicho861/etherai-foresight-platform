/**
 * @fileoverview Prediction Engine for Global Risk Assessment.
 * This service consumes integrated data sources to generate and update predictive risk indices.
 * It represents the "Perpetual Prophecy Flow" of the Aion directive.
 */

import axios from 'axios';
import { calculateEthicalVector } from './ethicalVectorModule.js';

// This would be stored in a more secure and dynamic configuration in a real system.
const PRAEVISIO_API_BASE_URL = `http://localhost:${process.env.PORT || 4001}`;
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
 * Fetches data from a Praevisio internal API endpoint.
 * @param {string} endpoint The API endpoint to fetch data from.
 * @returns {Promise<object>} The data from the endpoint.
 */
async function fetchInternalData(endpoint) {
  try {
    const response = await axios.get(`${PRAEVISIO_API_BASE_URL}${endpoint}`, {
      headers: { 'Authorization': `Bearer ${AUTH_TOKEN}` },
    });
    return response.data.data || response.data;
  } catch (error) {
    console.error(`[PredictionEngine] Failed to fetch internal data from ${endpoint}:`, error.message);
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
 * Calculates the Multi-Domain Risk Index based on all individual risk indices.
 * This is a weighted average for demonstration.
 */
function updateMultiDomainRiskIndex() {
  console.log('[PredictionEngine] Calculating Multi-Domain Risk Index...');
  const { famineRisk, geophysicalRisk, supplyChainRisk } = predictionState.riskIndices;

  const famineWeight = 0.4;
  const geoWeight = 0.3;
  const supplyChainWeight = 0.3;

  const famineValue = famineRisk.value || 0;
  const geoValue = geophysicalRisk.value || 0;
  const supplyChainValue = supplyChainRisk.value || 0;

  const totalRisk = (famineValue * famineWeight) + (geoValue * geoWeight) + (supplyChainValue * supplyChainWeight);
  const weightedConfidence = (famineRisk.confidence * famineWeight) + (geophysicalRisk.confidence * geoWeight) + (supplyChainRisk.confidence * supplyChainWeight);

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
