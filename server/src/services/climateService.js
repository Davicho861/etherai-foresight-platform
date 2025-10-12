import ClimateIntegration from '../integrations/ClimateIntegration.js';

const climateIntegration = new ClimateIntegration();

/**
 * Fetches the global climate extremes index for LATAM countries.
 * Uses the ClimateIntegration to get data from NASA POWER API.
 * @returns {Promise<object>} A promise that resolves to the climate extremes data.
 */
export async function getClimateExtremesIndex() {
  try {
    const data = await climateIntegration.getClimateExtremes(['COL', 'PER', 'ARG', 'BRA', 'MEX']);
    return data;
  } catch (error) {
    console.error('Error in getClimateExtremesIndex:', error && error.stack ? error.stack : (error && error.message) || String(error));
    // Surface the error to the caller so failures are visible and not silently replaced with mocks
    throw error;
  }
}