import MetatronAgent from '../agents.js';

/**
 * Fetches community resilience analysis for LATAM countries.
 * Uses the MetatronAgent CommunityResilienceAgent to analyze social resilience.
 * @param {Array<string>} countries - Array of country codes (e.g., ['COL', 'PER', 'ARG'])
 * @param {number} days - Number of days for analysis (default: 30)
 * @returns {Promise<object>} A promise that resolves to the community resilience data.
 */
export async function getCommunityResilienceIndex(countries = ['COL', 'PER', 'ARG'], days = 30) {
  try {
    const agent = new MetatronAgent('CommunityResilienceAgent');
    const result = await agent.run({
      countries,
      days
    });

    return {
      timestamp: result.timestamp,
      resilienceAnalysis: result.resilienceAnalysis,
      globalResilienceAssessment: result.globalResilienceAssessment,
      source: 'CommunityResilienceAgent'
    };
  } catch (error) {
    console.error('Error in getCommunityResilienceIndex:', error);
    // Return mock data if agent fails
    const mockData = {
      timestamp: new Date().toISOString(),
      resilienceAnalysis: {},
      globalResilienceAssessment: {
        averageResilience: 65.0,
        lowResilienceCountries: ['COL', 'PER'],
        assessment: 'Moderate community resilience with areas of concern',
        globalRecommendations: ['Strengthen community networks', 'Improve social services']
      },
      source: 'Mock data - Agent unavailable'
    };

    // Generate mock data for each country
    countries.forEach(country => {
      mockData.resilienceAnalysis[country] = {
        socialEvents: Math.floor(Math.random() * 10) + 1,
        resilienceScore: Math.floor(Math.random() * 40) + 60, // 60-100
        recommendations: ['Community engagement', 'Social programs', 'Education initiatives'],
        period: {
          startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          endDate: new Date().toISOString().split('T')[0]
        },
        isMock: true
      };
    });

    return mockData;
  }
}