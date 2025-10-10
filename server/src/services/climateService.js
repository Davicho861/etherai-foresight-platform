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
    console.error('Error in getClimateExtremesIndex:', error);
    // Return mock data if integration fails
    return [
      {
        country: 'Colombia',
        countryCode: 'COL',
        avgMaxTemp: 28.5,
        avgMinTemp: 18.2,
        totalPrecipitation: 150.3,
        avgHumidity: 75.2,
        extremeEvents: 3,
        riskLevel: 'medium',
        period: 'Mock data - Last 30 days',
        timestamp: new Date().toISOString()
      },
      {
        country: 'Peru',
        countryCode: 'PER',
        avgMaxTemp: 25.8,
        avgMinTemp: 15.6,
        totalPrecipitation: 85.7,
        avgHumidity: 68.9,
        extremeEvents: 2,
        riskLevel: 'low',
        period: 'Mock data - Last 30 days',
        timestamp: new Date().toISOString()
      },
      {
        country: 'Argentina',
        countryCode: 'ARG',
        avgMaxTemp: 22.1,
        avgMinTemp: 12.4,
        totalPrecipitation: 120.5,
        avgHumidity: 72.3,
        extremeEvents: 4,
        riskLevel: 'medium',
        period: 'Mock data - Last 30 days',
        timestamp: new Date().toISOString()
      },
      {
        country: 'Brazil',
        countryCode: 'BRA',
        avgMaxTemp: 30.2,
        avgMinTemp: 20.8,
        totalPrecipitation: 180.9,
        avgHumidity: 78.6,
        extremeEvents: 5,
        riskLevel: 'high',
        period: 'Mock data - Last 30 days',
        timestamp: new Date().toISOString()
      },
      {
        country: 'Mexico',
        countryCode: 'MEX',
        avgMaxTemp: 26.7,
        avgMinTemp: 16.9,
        totalPrecipitation: 95.2,
        avgHumidity: 65.4,
        extremeEvents: 2,
        riskLevel: 'low',
        period: 'Mock data - Last 30 days',
        timestamp: new Date().toISOString()
      }
    ];
  }
}