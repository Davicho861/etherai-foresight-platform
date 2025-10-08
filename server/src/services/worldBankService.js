import WorldBankIntegration from '../integrations/WorldBankIntegration.js';

/**
 * @fileoverview Service for fetching World Bank data, now integrated with real API.
 * Fetches food security data from World Bank API for LATAM countries.
 */

const worldBank = new WorldBankIntegration();

/**
 * Fetches the global food security index for LATAM countries.
 * @returns {Promise<object>} A promise that resolves to the food security data.
 */
export const getFoodSecurityIndex = async () => {
  try {
    const data = await worldBank.getFoodSecurityData(['COL', 'PER', 'ARG'], '2020', '2024');
    // Transform to expected format
    const transformedData = {
      countries: data.countries,
      year: 2024, // Most recent year
      source: "World Bank API - SN.ITK.DEFC.ZS",
      data: data.data,
      globalAverage: calculateGlobalAverage(data.data)
    };
    return transformedData;
  } catch (error) {
    console.error('Error in getFoodSecurityIndex:', error);
    // Fallback to mock data if API fails
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
