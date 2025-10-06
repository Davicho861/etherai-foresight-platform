import fetch from 'node-fetch';

class FMIIntegration {
  constructor() {
    this.baseUrl = 'https://www.imf.org/external/datamapper/api/v1';
  }

  async getDebtData(country, startYear, endYear) {
    try {
      // IMF API for external debt
      const url = `${this.baseUrl}/debt/${country.toLowerCase()}?startYear=${startYear}&endYear=${endYear}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`IMF API error: ${response.status}`);
      }
      const data = await response.json();
      return {
        country,
        period: { startYear, endYear },
        debtData: data.values || []
      };
    } catch (error) {
      console.error('Error fetching IMF data:', error);
      return {
        country,
        period: { startYear, endYear },
        debtData: [],
        error: error.message
      };
    }
  }
}

export default FMIIntegration;