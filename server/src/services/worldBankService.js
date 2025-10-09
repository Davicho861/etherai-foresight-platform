import WorldBankIntegration from '../integrations/WorldBankIntegration.js';

/**
 * @fileoverview Service for fetching World Bank data, now integrated with real API.
 * Fetches food security data from World Bank API for LATAM countries.
 */

const worldBank = new WorldBankIntegration();

/**
 * Fetches the global food security index for LATAM countries.
 * Now uses the new serverless endpoint /api/global-risk/food-security
 * @returns {Promise<object>} A promise that resolves to the food security data.
 */
export const getFoodSecurityIndex = async () => {
  try {
    // Use the new serverless endpoint instead of direct API calls
    const API_BASE = process.env.API_BASE || 'http://localhost:4000';
    const response = await fetch(`${API_BASE}/api/global-risk/food-security`, {
      headers: {
        'Authorization': `Bearer ${process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token'}`
      }
    });

    if (!response.ok) {
      throw new Error(`Food security endpoint returned ${response.status}`);
    }

    const endpointData = await response.json();

    // Transform to expected format for backward compatibility
    const transformedData = {
      countries: endpointData.data.map(item => item.countryCode),
      year: parseInt(endpointData.data[0]?.year || '2024'),
      source: "World Bank API via Serverless Endpoint - SN.ITK.DEFC.ZS",
      data: endpointData.data.reduce((acc, item) => {
        acc[item.countryCode] = {
          value: item.value,
          year: item.year,
          country: item.country
        };
        return acc;
      }, {}),
      globalAverage: endpointData.summary.averageValue
    };

    return transformedData;
  } catch (error) {
    console.error('Error in getFoodSecurityIndex:', error);
    // Fallback to mock data if endpoint fails
    return {
      countries: ['COL', 'PER', 'ARG'],
      year: 2024,
      source: "Fallback Mock Data",
      data: {
        COL: { value: 5.2, year: '2024', country: 'Colombia' },
        PER: { value: 7.1, year: '2024', country: 'Peru' },
        ARG: { value: 4.8, year: '2024', country: 'Argentina' }
      },
      globalAverage: 5.7,
      error: error.message
    };
  }
};

/**
 * Calculates global average from country data.
 * @param {object} data - Country data object
 * @returns {number} Global average
 */
function calculateGlobalAverage(data) {
  const values = Object.values(data).filter(item => item.value !== null && !item.error).map(item => item.value);
  if (values.length === 0) return null;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}
