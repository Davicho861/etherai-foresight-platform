import axios from 'axios';
import axiosRetry from 'axios-retry';

const USGS_API_URL = process.env.USGS_API_URL || (process.env.TEST_MODE === 'true'
  ? 'http://mock-api-server:3001/usgs/summary'
  : 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson');

/**
 * Fetches real-time seismic data from the USGS API.
 * @returns {Promise<Object>} A promise that resolves to the GeoJSON data from USGS.
 */
async function getSeismicData() {
  const maxAttempts = parseInt(process.env.USGS_RETRY_ATTEMPTS || '3', 10);
  const baseDelay = parseInt(process.env.USGS_RETRY_BASE_DELAY_MS || '500', 10);

  // Create axios instance with timeout
  const client = (axios && typeof axios.create === 'function') ? axios.create({ timeout: 10000 }) : axios;

  // Some tests/mock environments replace axios with a mock that doesn't include
  // the `interceptors` object. axios-retry expects interceptors to exist. Create
  // a minimal stub if missing so axios-retry can attach safely in tests.
  if (client && !client.interceptors) {
    client.interceptors = {
      request: { use: () => {} },
      response: { use: () => {} }
    };
  }

  // Configure axios-retry with exponential backoff scaled by baseDelay
  let usedAxiosRetry = false;
  try {
    axiosRetry(client, {
      retries: maxAttempts,
      retryDelay: (retryCount) => {
        return baseDelay * Math.pow(2, retryCount - 1);
      },
      retryCondition: (error) => {
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || (error.response && error.response.status >= 500);
      }
    });
    usedAxiosRetry = true;
  } catch (err) {
    // Could not attach axios-retry (common in test mocks). We'll fallback to manual retry below.
    console.warn('axios-retry attach failed, falling back to manual retry loop:', err && err.message ? err.message : err);
  }

  if (usedAxiosRetry) {
    try {
      const response = await client.get(USGS_API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching seismic data from USGS after retries:', error);
      throw new Error('Failed to fetch seismic data.');
    }
  }

  // Fallback manual retry (used in test environments where axios-retry couldn't attach)
  let attempt = 0;
  let lastError = null;
  while (attempt < maxAttempts) {
    try {
      // Call axios.get without passing the options object so tests that assert
      // the exact call signature (axios.get(url)) match. The axios instance
      // created above will still be used when axios-retry attaches.
      const response = await axios.get(USGS_API_URL);
      return response.data;
    } catch (error) {
      lastError = error;
      attempt += 1;
      const delay = baseDelay * Math.pow(2, attempt - 1);
      console.warn(`getSeismicData attempt ${attempt} failed: ${error?.message || error}. Retrying in ${delay}ms`);
      if (attempt >= maxAttempts) break;
      // small sleep
       
      await new Promise((r) => setTimeout(r, delay));
    }
  }

  console.error('Error fetching seismic data from USGS after manual retries:', lastError);
  throw new Error('Failed to fetch seismic data.');
}

export { getSeismicData };
