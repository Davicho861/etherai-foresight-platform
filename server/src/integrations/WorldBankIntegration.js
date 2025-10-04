import fetch from 'node-fetch';

class WorldBankIntegration {
  constructor() {
    this.baseUrl = 'https://api.worldbank.org/v2';
  }

  async getEconomicIndicators(country, indicators, startYear, endYear) {
    try {
      const results = {};

      for (const indicator of indicators) {
        const url = `${this.baseUrl}/country/${country.toLowerCase()}/indicator/${indicator}?format=json&date=${startYear}:${endYear}&per_page=1000`;

        const response = await fetch(url);
        if (!response.ok) {
          console.warn(`World Bank API error for ${indicator}: ${response.status}`);
          results[indicator] = { error: `API error: ${response.status}` };
          continue;
        }

        const data = await response.json();
        if (data[1] && data[1].length > 0) {
          // Get the most recent value
          const sortedData = data[1].sort((a, b) => parseInt(b.date) - parseInt(a.date));
          const latest = sortedData[0];
          results[indicator] = {
            value: latest.value,
            year: latest.date,
            country: latest.country.value
          };
        } else {
          results[indicator] = { value: null, note: 'No data available' };
        }

        // Rate limiting: small delay between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return {
        country,
        period: { startYear, endYear },
        indicators: results
      };
    } catch (error) {
      console.error('Error fetching World Bank data:', error);
      return {
        country,
        period: { startYear, endYear },
        indicators: {},
        error: error.message
      };
    }
  }

  // Helper method for common economic indicators relevant to social instability
  async getKeyEconomicData(country, startYear = '2020', endYear = '2024') {
    const indicators = [
      'NY.GDP.PCAP.CD', // GDP per capita (current US$)
      'FP.CPI.TOTL.ZG', // Inflation, consumer prices (annual %)
      'SL.UEM.TOTL.ZS', // Unemployment, total (% of total labor force)
      'PA.NUS.FCRF',    // Official exchange rate (LCU per US$, period average)
      'DT.DOD.DECT.CD', // External debt stocks, total (DOD, current US$)
      'FI.RES.TOTL.CD'  // Total reserves (includes gold, current US$)
    ];

    return await this.getEconomicIndicators(country, indicators, startYear, endYear);
  }
}

export default WorldBankIntegration;