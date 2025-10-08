/**
 * @fileoverview Prediction Engine for Global Risk Assessment.
 * This service consumes integrated data sources to generate and update predictive risk indices.
 * It represents the "Perpetual Prophecy Flow" of the Aion directive.
 */

import axios from 'axios';

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
  },
  multiDomainRiskIndex: {
    value: null,
    confidence: 0.0,
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
 * Updates the Geophysical Risk Index based on the latest seismic activity and risk prediction.
 */
async function updateGeophysicalRiskIndex() {
  console.log('[PredictionEngine] Updating Geophysical Risk Index...');
  const seismicEvents = await fetchInternalData('/api/seismic/activity');
  const riskPrediction = await fetchInternalData('/api/seismic/risk');

  if (!Array.isArray(seismicEvents) || !riskPrediction) {
    console.error('[PredictionEngine] Invalid seismic data or risk prediction received.');
    return;
  }

  predictionState.riskIndices.geophysicalRisk.significantEvents = seismicEvents;
  predictionState.riskIndices.geophysicalRisk.value = riskPrediction.overallRisk;
  predictionState.riskIndices.geophysicalRisk.confidence = 0.90; // Confidence from agent prediction
  predictionState.riskIndices.geophysicalRisk.maxMagnitude = riskPrediction.maxMagnitude;
  predictionState.riskIndices.geophysicalRisk.eventCount = riskPrediction.eventCount;
  predictionState.riskIndices.geophysicalRisk.highRiskZones = riskPrediction.highRiskZones;

  console.log(`[PredictionEngine] Geophysical Risk Index updated to ${riskPrediction.overallRisk} based on ${riskPrediction.eventCount} events, max mag ${riskPrediction.maxMagnitude}.`);
}

/**
 * Calculates the Multi-Domain Risk Index based on all individual risk indices.
 * This is a weighted average for demonstration.
 */
function updateMultiDomainRiskIndex() {
  console.log('[PredictionEngine] Calculating Multi-Domain Risk Index...');
  const { famineRisk, geophysicalRisk } = predictionState.riskIndices;

  const famineWeight = 0.6;
  const geoWeight = 0.4;

  const famineValue = famineRisk.value || 0;
  const geoValue = geophysicalRisk.value || 0;

  const totalRisk = (famineValue * famineWeight) + (geoValue * geoWeight);
  const weightedConfidence = (famineRisk.confidence * famineWeight) + (geophysicalRisk.confidence * geoWeight);

  predictionState.multiDomainRiskIndex = {
    value: parseFloat(totalRisk.toFixed(2)),
    confidence: parseFloat(weightedConfidence.toFixed(2)),
  };

  console.log(`[PredictionEngine] Multi-Domain Risk Index updated to ${predictionState.multiDomainRiskIndex.value}.`);
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
    ]);

    updateMultiDomainRiskIndex();
    predictionState.lastUpdated = new Date().toISOString();
    console.log('[PredictionEngine] Prophecy cycle complete. All risk indices updated.');

  } catch (error) {
    console.error('[PredictionEngine] Error during prophecy cycle:', error.message);
  }
}

export {
  runProphecyCycle,
  getRiskIndices,
};
