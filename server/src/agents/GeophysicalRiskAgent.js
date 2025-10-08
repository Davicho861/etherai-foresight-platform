/**
 * @fileoverview GeophysicalRiskAgent - Analyzes seismic data to assess and predict risk.
 */

/**
 * Analyzes seismic data to identify key features and assess risk.
 * For now, it extracts and simplifies the feature set from the raw GeoJSON data.
 *
 * @param {Object} seismicData - The raw GeoJSON data from the USGS feed.
 * @returns {Array<Object>} A list of processed seismic events with key information.
 *
 * @typedef {Object} SeismicEvent
 * @property {string} id - The unique ID of the earthquake event.
 * @property {string} place - The human-readable location of the event.
 * @property {number} magnitude - The magnitude of the earthquake.
 * @property {number} depth - The depth of the earthquake's hypocenter in kilometers.
 * @property {number} time - The timestamp of the event in milliseconds since the epoch.
 * @property {string} url - The USGS URL for more details on the event.
 * @property {Object} tsunami - Tsunami warning information.
 * @property {number} tsunami.warning - 1 if there is a tsunami warning, 0 otherwise.
 * @property {number} riskScore - Calculated risk score for the event (0-100).
 */
function analyzeSeismicActivity(seismicData) {
  if (!seismicData || !seismicData.features) {
    console.warn('GeophysicalRiskAgent: Invalid or empty seismic data received.');
    return [];
  }

  const processedEvents = seismicData.features.map(feature => {
    const { properties, geometry, id } = feature;
    const event = {
      id: id,
      place: properties.place,
      magnitude: properties.mag,
      depth: geometry.coordinates[2],
      time: properties.time,
      url: properties.url,
      tsunami: {
        warning: properties.tsunami,
      },
    };
    event.riskScore = calculateEventRisk(event);
    return event;
  });

  console.log(`[GeophysicalRiskAgent] Analyzed ${processedEvents.length} seismic events.`);
  return processedEvents;
}

/**
 * Calculates a risk score for a seismic event based on magnitude, depth, and location factors.
 * Simplified predictive model: higher magnitude, shallower depth, and proximity to populated areas increase risk.
 *
 * @param {SeismicEvent} event - The processed seismic event.
 * @returns {number} Risk score from 0-100.
 */
function calculateEventRisk(event) {
  let risk = 0;

  // Magnitude factor: linear scaling, mag 8+ = high risk
  risk += Math.min(50, (event.magnitude / 8) * 50);

  // Depth factor: shallower = higher risk (inverse)
  const depthRisk = Math.max(0, 20 - (event.depth / 10) * 10);
  risk += depthRisk;

  // Location factor: simplified - if in LATAM regions, higher risk
  const latamKeywords = ['Peru', 'Chile', 'Colombia', 'Ecuador', 'Argentina', 'Mexico', 'Guatemala'];
  const isLatam = latamKeywords.some(keyword => event.place.includes(keyword));
  if (isLatam) risk += 20;

  // Tsunami warning adds risk
  if (event.tsunami.warning === 1) risk += 10;

  return Math.min(100, Math.round(risk));
}

/**
 * Predicts overall geophysical risk based on recent seismic activity.
 * Aggregates events to provide a global risk assessment.
 *
 * @param {Array<SeismicEvent>} events - List of processed seismic events.
 * @returns {Object} Risk prediction object.
 * @property {number} overallRisk - Overall risk score (0-100).
 * @property {number} eventCount - Number of significant events.
 * @property {number} maxMagnitude - Highest magnitude in the period.
 * @property {Array<string>} highRiskZones - List of high-risk locations.
 */
function predictGeophysicalRisk(events) {
  if (!events || events.length === 0) {
    return {
      overallRisk: 0,
      eventCount: 0,
      maxMagnitude: 0,
      highRiskZones: [],
    };
  }

  const maxMagnitude = Math.max(...events.map(e => e.magnitude));
  const highRiskEvents = events.filter(e => e.riskScore > 50);
  const highRiskZones = [...new Set(highRiskEvents.map(e => e.place))];

  // Overall risk: weighted by max mag and number of high-risk events
  let overallRisk = (maxMagnitude / 8) * 50;
  overallRisk += Math.min(30, highRiskEvents.length * 5);
  overallRisk += Math.min(20, events.length);

  return {
    overallRisk: Math.min(100, Math.round(overallRisk)),
    eventCount: events.length,
    maxMagnitude,
    highRiskZones,
  };
}

export { analyzeSeismicActivity, predictGeophysicalRisk };
