import axios from 'axios';

const USGS_API_URL = process.env.TEST_MODE === 'true'
  ? 'http://mock-api-server:3001/usgs/summary'
  : 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson';

/**
 * Fetches real-time seismic data from the USGS API.
 * @returns {Promise<Object>} A promise that resolves to the GeoJSON data from USGS.
 */
async function getSeismicData() {
  try {
    const response = await axios.get(USGS_API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching seismic data from USGS:', error);
    throw new Error('Failed to fetch seismic data.');
  }
}

export { getSeismicData };
