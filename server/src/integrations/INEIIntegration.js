import safeFetch from '../lib/safeFetch.js';

class INEIIntegration {
  constructor() {
    // INEI API base URL
    this.baseUrl = process.env.TEST_MODE === 'true'
      ? 'http://mock-api-server:3001/inei' // internal mock server
      : 'https://iinei.inei.gob.pe/iinei/Servicio.svc';
  }

  async getDemographicData(department, year) {
    try {
      // Attempt to fetch real INEI demographic data
      // Using INEI service for population data
      const url = `${this.baseUrl}/ObtenerIndicadores?codigo=1&anio=${year}&ubigeo=${department}`;

      const data = await safeFetch(url, {}, { timeout: 10000, retries: 2 });

      // Process demographic data
      const demographicData = {
        department: department || 'Lima',
        year: year || 2024,
        population: data.poblacion || 0,
        growthRate: data.tasa_crecimiento || 0,
        urbanPopulation: data.poblacion_urbana || 0,
        ruralPopulation: data.poblacion_rural || 0
      };

      return {
        department,
        year,
        demographicData,
        isMock: false
      };
    } catch (error) {
      if (process.env.FORCE_MOCKS === 'true' || process.env.FORCE_MOCKS === '1') {
        console.log(`INEIIntegration: returning FORCE_MOCKS mock for ${department} (${year})`);
        const mockDepartments = {
          'Lima': { population: 10750000, growthRate: 1.2, urbanPopulation: 9500000, ruralPopulation: 1250000 },
          'Arequipa': { population: 1600000, growthRate: 1.1, urbanPopulation: 1200000, ruralPopulation: 400000 },
          'Cusco': { population: 1400000, growthRate: 0.9, urbanPopulation: 500000, ruralPopulation: 900000 },
          'Trujillo': { population: 1100000, growthRate: 1.0, urbanPopulation: 850000, ruralPopulation: 250000 }
        };

        const deptData = mockDepartments[department] || {
          population: 1000000,
          growthRate: 1.0,
          urbanPopulation: 700000,
          ruralPopulation: 300000
        };

        return {
          department,
          year,
          demographicData: {
            department,
            year,
            population: deptData.population,
            growthRate: deptData.growthRate,
            urbanPopulation: deptData.urbanPopulation,
            ruralPopulation: deptData.ruralPopulation
          },
          isMock: true,
          source: 'FORCE_MOCKS:INEI'
        };
      }

      throw new Error(`INEIIntegration failed: ${error && error.message ? error.message : String(error)}`);
    }
  }

  async getEconomicIndicators(department, year) {
    try {
      // Attempt to fetch real INEI economic indicators
      const url = `${this.baseUrl}/ObtenerIndicadores?codigo=2&anio=${year}&ubigeo=${department}`;

      const data = await safeFetch(url, {}, { timeout: 10000, retries: 2 });

      const economicData = {
        department: department || 'Lima',
        year: year || 2024,
        gdp: data.pib || 0,
        unemploymentRate: data.tasa_desempleo || 0,
        povertyRate: data.tasa_pobreza || 0,
        incomePerCapita: data.ingreso_per_capita || 0
      };

      return {
        department,
        year,
        economicData,
        isMock: false
      };
    } catch (error) {
      if (process.env.FORCE_MOCKS === 'true' || process.env.FORCE_MOCKS === '1') {
        console.log(`INEIIntegration: returning FORCE_MOCKS mock economic for ${department} (${year})`);
        const mockEconomics = {
          'Lima': { gdp: 45000000, unemploymentRate: 6.5, povertyRate: 15.2, incomePerCapita: 18000 },
          'Arequipa': { gdp: 8500000, unemploymentRate: 7.2, povertyRate: 18.5, incomePerCapita: 12000 },
          'Cusco': { gdp: 6500000, unemploymentRate: 8.1, povertyRate: 22.3, incomePerCapita: 9500 },
          'Trujillo': { gdp: 7200000, unemploymentRate: 7.8, povertyRate: 20.1, incomePerCapita: 11000 }
        };

        const econData = mockEconomics[department] || {
          gdp: 10000000,
          unemploymentRate: 7.0,
          povertyRate: 18.0,
          incomePerCapita: 13000
        };

        return {
          department,
          year,
          economicData: {
            department,
            year,
            gdp: econData.gdp,
            unemploymentRate: econData.unemploymentRate,
            povertyRate: econData.povertyRate,
            incomePerCapita: econData.incomePerCapita
          },
          isMock: true,
          source: 'FORCE_MOCKS:INEI'
        };
      }

      throw new Error(`INEIIntegration failed: ${error && error.message ? error.message : String(error)}`);
    }
  }
}

export default INEIIntegration;