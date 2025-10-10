import { getSeismicData } from './SeismicIntegration.js';

/**
 * @fileoverview Service for fetching USGS seismic data, integrated with real API.
 * Fetches seismic activity data from USGS API for global monitoring.
 */

/**
 * Fetches the global seismic activity data.
 * Uses the SeismicIntegration for real-time data from USGS.
 * @returns {Promise<object>} A promise that resolves to the seismic activity data.
 */
export const getSeismicActivity = async () => {
  try {
    // In native dev mode, prefer a local mock to avoid external network dependencies
    if (process.env.NATIVE_DEV_MODE === 'true') {
      const MOCK_PORT = process.env.USGS_MOCK_PORT || 4011;
      const resp = await fetch(`http://localhost:${MOCK_PORT}/usgs/significant_day.geojson`);
      if (!resp.ok) throw new Error(`Mock returned ${resp.status}`);
      const body = await resp.json();
      // Transform mock into expected endpoint shape
      return transformSeismicData(body);
    }

    // Use the SeismicIntegration for real data
    const rawData = await getSeismicData();

    // Transform the raw GeoJSON data into our expected format
    return transformSeismicData(rawData);
  } catch (error) {
    console.error('Error in getSeismicActivity:', error);
    // Fallback to mock data if integration fails
    return {
      events: [],
      summary: {
        totalEvents: 0,
        maxMagnitude: 0,
        lastUpdated: new Date().toISOString(),
        source: "Fallback Mock Data"
      },
      error: error.message
    };
  }
};

/**
 * Transforms raw USGS GeoJSON data into our standardized format.
 * @param {object} rawData - Raw GeoJSON data from USGS
 * @returns {object} Transformed seismic data
 */
function transformSeismicData(rawData) {
  if (!rawData || !rawData.features) {
    return {
      events: [],
      summary: {
        totalEvents: 0,
        maxMagnitude: 0,
        lastUpdated: new Date().toISOString(),
        source: "USGS API"
      }
    };
  }

  const events = rawData.features.map(feature => ({
    id: feature.id,
    magnitude: feature.properties.mag,
    place: feature.properties.place,
    time: feature.properties.time,
    coordinates: feature.geometry.coordinates,
    tsunami: feature.properties.tsunami,
    significance: feature.properties.sig,
    url: feature.properties.url
  }));

  const maxMagnitude = events.length > 0 ? Math.max(...events.map(e => e.magnitude)) : 0;

  return {
    events,
    summary: {
      totalEvents: events.length,
      maxMagnitude,
      lastUpdated: rawData.metadata?.generated || new Date().toISOString(),
      source: "USGS Earthquake Hazards Program"
    }
  };
}