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
    // 1) If FORCE_MOCKS is set, return a built-in mock immediately (fast, offline-friendly)
    if (process.env.FORCE_MOCKS === 'true') {
      const builtinMock = {
        metadata: { generated: Date.now() },
        features: [
          {
            id: 'mock-1',
            properties: {
              mag: 2.3,
              place: 'Mock Region',
              time: Date.now(),
              tsunami: 0,
              sig: 22,
              url: 'https://example.com/mock-quake'
            },
            geometry: { coordinates: [-74.2973, 4.5709, 10] }
          }
        ],
        __meta: { isMock: true }
      };
      const transformed = transformSeismicData(builtinMock);
      return { ...transformed, isMock: true };
    }

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
      // If tests expect an error-shaped response, return an object with error and empty events.
      // For developer ergonomics, allow forcing a full built-in mock by setting FORCE_MOCKS=true.
      if (process.env.FORCE_MOCKS === 'true') {
        const fallbackMock = {
          metadata: { generated: Date.now() },
          features: [
            {
              id: 'fallback-1',
              properties: {
                mag: 1.0,
                place: 'Fallback Region',
                time: Date.now(),
                tsunami: 0,
                sig: 5,
                url: 'https://example.com/fallback-quake'
              },
              geometry: { coordinates: [-51.9253, -14.2350, 5] }
            }
          ],
          __meta: { isMock: true }
        };
        const transformedFallback = transformSeismicData(fallbackMock);
        return { ...transformedFallback, isMock: true };
      }

      return {
        events: [],
        summary: {
          totalEvents: 0,
          maxMagnitude: 0,
          lastUpdated: new Date().getTime(),
          source: 'USGS Earthquake Hazards Program'
        },
        error: message
      };
    }
  } catch (error) {
    console.error('Unexpected error in getSeismicActivity:', error);
    return {
      events: [],
      summary: {
        totalEvents: 0,
        maxMagnitude: 0,
        lastUpdated: new Date().toISOString(),
        source: "Error - No Data Available"
      },
      error: error && error.message ? error.message : String(error)
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