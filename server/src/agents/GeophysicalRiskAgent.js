/**
 * @fileoverview GeophysicalRiskAgent - Analyzes seismic data to assess risk.
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
 */
function analyzeSeismicActivity(seismicData) {
  if (!seismicData || !seismicData.features) {
    console.warn('GeophysicalRiskAgent: Invalid or empty seismic data received.');
    return [];
  }

  const processedEvents = seismicData.features.map(feature => {
    const { properties, geometry, id } = feature;
    const magnitude = properties.mag || 0;
    // Simple heuristic: riskScore scales with magnitude and tsunami flag
    const riskScore = Math.min(100, Math.round((magnitude / 10) * 100) + (properties.tsunami ? 20 : 0));
    return {
      id: id,
      place: properties.place,
      magnitude: magnitude,
      depth: geometry.coordinates[2],
      time: properties.time,
      url: properties.url,
      tsunami: {
        warning: properties.tsunami,
      },
      riskScore,
    };
  });

  console.log(`[GeophysicalRiskAgent] Analyzed ${processedEvents.length} seismic events.`);
  return processedEvents;
}

export { analyzeSeismicActivity };
