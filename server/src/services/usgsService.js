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

    // 2) If running in native dev mode, try to use a local mock server but fail gracefully
    if (process.env.NATIVE_DEV_MODE === 'true') {
      const MOCK_PORT = process.env.USGS_MOCK_PORT || 4011;
      try {
        const resp = await fetch(`http://localhost:${MOCK_PORT}/usgs/significant_day.geojson`);
        if (resp.ok) {
          const body = await resp.json();
          return transformSeismicData(body);
        }
        console.warn(`USGS mock returned non-ok status ${resp.status} - falling back`);
      } catch (err) {
        // Common in developer machines if the local mock isn't running (ECONNREFUSED)
        console.warn(`Local USGS mock fetch failed (port ${MOCK_PORT}):`, err && err.message ? err.message : err);
        // continue to attempt live fetch below
      }
    }

    // 3) Try the live USGS integration (may fail in networks with no egress)
    try {
      const rawData = await getSeismicData();
      return transformSeismicData(rawData);
    } catch (liveErr) {
      const message = liveErr && liveErr.message ? liveErr.message : String(liveErr);
      console.error('Live USGS fetch failed:', message);

      // Fallback to high-fidelity mock data
      return getMockSeismicData();
    }
  } catch (error) {
    console.error('Unexpected error in getSeismicActivity:', error);
    // Fallback to high-fidelity mock data
    return getMockSeismicData();
  }
};

/**
 * Transforms raw USGS GeoJSON data into our standardized format.
 * @param {object} rawData - Raw GeoJSON data from USGS
 * @returns {object} Transformed seismic data
 */
/**
 * Returns high-fidelity mock seismic data when API is unavailable
 * @returns {object} Mock seismic data in the same format as real data
 */
function getMockSeismicData() {
  const mockEvents = [
    {
      id: 'mock-1',
      magnitude: 4.5,
      place: 'Mock Seismic Region - Test Location',
      time: Date.now(),
      coordinates: [-74.2973, 4.5709, 10],
      tsunami: 0,
      significance: 50,
      url: 'https://example.com/mock-earthquake-1'
    },
    {
      id: 'mock-2',
      magnitude: 3.2,
      place: 'Another Mock Location',
      time: Date.now() - 3600000, // 1 hour ago
      coordinates: [-75.0, -10.0, 15],
      tsunami: 0,
      significance: 25,
      url: 'https://example.com/mock-earthquake-2'
    }
  ];

  return {
    events: mockEvents,
    summary: {
      totalEvents: mockEvents.length,
      maxMagnitude: Math.max(...mockEvents.map(e => e.magnitude)),
      lastUpdated: new Date().toISOString(),
      source: 'High-Fidelity Mock Data - USGS API Unavailable'
    },
    isMock: true,
    note: 'Real-time seismic data simulation - API unavailable'
  };
}

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