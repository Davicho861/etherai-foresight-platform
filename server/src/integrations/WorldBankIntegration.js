import safeFetch from '../lib/safeFetch.js';

class WorldBankIntegration {
  constructor() {
    this.forceMocks = process.env.FORCE_MOCKS === 'true' || process.env.FORCE_MOCKS === '1';
    this.baseUrl = process.env.TEST_MODE === 'true'
      ? 'http://mock-api-server:3001/world-bank'
      : 'https://api.worldbank.org/v2';
  }

  async getEconomicIndicators(country, indicators, startYear, endYear) {
    try {
      const results = {};

      for (const indicator of indicators) {
        const url = `${this.baseUrl}/country/${country.toLowerCase()}/indicator/${indicator}?format=json&date=${startYear}:${endYear}&per_page=1000`;

        let data;
        try {
          data = await safeFetch(url, { headers: { 'User-Agent': 'Praevisio/1.0 (+https://praevisio.local)', Accept: 'application/json' } }, { timeout: 10000, retries: 3 });
        } catch (err) {
          console.warn(`World Bank API error for ${indicator}: ${err.message}`);
          results[indicator] = { error: `API error: ${err.message}` };
          continue;
        }
        // If no data for the requested year range, retry once with a broader window (safe fallback)
        if (!(data && Array.isArray(data) && data[1] && data[1].length > 0)) {
          try {
            const broaderUrl = `${this.baseUrl}/country/${country.toLowerCase()}/indicator/${indicator}?format=json&date=2010:${endYear}&per_page=1000`;
            const fallback = await safeFetch(broaderUrl, { headers: { 'User-Agent': 'Praevisio/1.0 (+https://praevisio.local)', Accept: 'application/json' } }, { timeout: 10000, retries: 2 });
            if (fallback && Array.isArray(fallback) && fallback[1] && fallback[1].length > 0) {
              data = fallback;
            }
          } catch (err) {
            // swallow fallback error and continue with original empty result
            console.warn(`World Bank fallback error for ${indicator}: ${err.message}`);
          }
        }

        if (data && data[1] && data[1].length > 0) {
          // Get the most recent value
          const sortedData = data[1].sort((a, b) => parseInt(b.date) - parseInt(a.date));
          const latest = sortedData[0];
          results[indicator] = {
            value: latest.value,
            year: latest.date,
            country: latest.country.value
          };
        } else {
          // No data in requested range - attempt to report last available year/value if present in data[1]
          let lastAvailable = null;
          try {
            if (data && data[1] && data[1].length === 0) {
              // nothing
            } else if (data && data[1]) {
              const anyEntry = data[1].find(d => d && (d.value !== null && d.value !== undefined));
              if (anyEntry) lastAvailable = anyEntry;
            }
          } catch (e) {
            // ignore
          }

          if (lastAvailable) {
            results[indicator] = {
              value: lastAvailable.value,
              year: lastAvailable.date,
              country: lastAvailable.country ? lastAvailable.country.value : country,
              note: 'No data for requested range — returning last available value'
            };
            console.warn(`WorldBank: no data in ${startYear}:${endYear} for ${indicator} (${country}), returning last available year ${lastAvailable.date}`);
          } else {
            results[indicator] = { value: null, note: 'No data available' };
            console.warn(`WorldBank: no data in ${startYear}:${endYear} for ${indicator} (${country}) and no fallback available`);
          }
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
    // If FORCE_MOCKS is active return high-fidelity mocked values
    if (this.forceMocks) {
      return {
        country,
        period: { startYear, endYear },
        indicators: {
          'NY.GDP.PCAP.CD': { value: 6500.23, year: '2023', country: 'Mockland' },
          'FP.CPI.TOTL.ZG': { value: 6.4, year: '2024', country: 'Mockland' },
          'SL.UEM.TOTL.ZS': { value: 11.2, year: '2023', country: 'Mockland' },
          'PA.NUS.FCRF': { value: 3800.5, year: '2023', country: 'Mockland' },
          'DT.DOD.DECT.CD': { value: 123456789.0, year: '2022', country: 'Mockland' },
          'FI.RES.TOTL.CD': { value: 98765432.1, year: '2023', country: 'Mockland' }
        },
        isMock: true,
        source: 'FORCE_MOCKS:WorldBank'
      };
    }

    return await this.getEconomicIndicators(country, indicators, startYear, endYear);
  }

  // Method for food security data
  async getFoodSecurityData(countries = ['COL', 'PER', 'ARG'], startYear = '2020', endYear = '2024') {
    const indicator = 'SN.ITK.DEFC.ZS'; // Prevalence of undernourishment (% of population)
    if (this.forceMocks) {
      const results = {};
      for (const country of countries) {
        results[country] = {
          value: Math.round((Math.random() * 5 + 5) * 10) / 10, // 5-10% mock
          year: '2023',
          country: country,
          indicator: 'Prevalence of undernourishment (% of population)'
        };
      }
      return {
        countries,
        period: { startYear, endYear },
        indicator,
        data: results,
        isMock: true,
        source: 'FORCE_MOCKS:WorldBank'
      };
    }
    try {
      const results = {};

      for (const country of countries) {
        const url = `${this.baseUrl}/country/${country.toLowerCase()}/indicator/${indicator}?format=json&date=${startYear}:${endYear}&per_page=1000`;

        let data;
        try {
          data = await safeFetch(url, { headers: { 'User-Agent': 'Praevisio/1.0 (+https://praevisio.local)', Accept: 'application/json' } }, { timeout: 10000, retries: 3 });
        } catch (err) {
          console.warn(`World Bank API error for food security ${country}: ${err.message}`);
          results[country] = { error: `API error: ${err.message}` };
          continue;
        }
        // Retry with broader date range if no data found
        if (!(data && Array.isArray(data) && data[1] && data[1].length > 0)) {
          try {
            const fallbackUrl = `${this.baseUrl}/country/${country.toLowerCase()}/indicator/${indicator}?format=json&date=2010:${endYear}&per_page=1000`;
            const fallback = await safeFetch(fallbackUrl, { headers: { 'User-Agent': 'Praevisio/1.0 (+https://praevisio.local)', Accept: 'application/json' } }, { timeout: 10000, retries: 2 });
            if (fallback && Array.isArray(fallback) && fallback[1] && fallback[1].length > 0) {
              data = fallback;
            }
          } catch (err) {
            console.warn(`World Bank fallback error for food security ${country}: ${err.message}`);
          }
        }
        if (data && data[1] && data[1].length > 0) {
          // Get the most recent value
          const sortedData = data[1].sort((a, b) => parseInt(b.date) - parseInt(a.date));
          const latest = sortedData[0];
          results[country] = {
            value: latest.value,
            year: latest.date,
            country: latest.country.value,
            indicator: 'Prevalence of undernourishment (% of population)'
          };
        } else {
          results[country] = { value: null, note: 'No data available' };
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return {
        countries,
        period: { startYear, endYear },
        indicator: 'SN.ITK.DEFC.ZS',
        data: results
      };
    } catch (error) {
      console.error('Error fetching food security data:', error);
      return {
        countries,
        period: { startYear, endYear },
        indicator: 'SN.ITK.DEFC.ZS',
        data: {},
        error: error.message
      };
    }
  }
}

export default WorldBankIntegration;