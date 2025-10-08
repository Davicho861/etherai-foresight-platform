import fetch from 'node-fetch';

class INEIIntegration {
  constructor() {
    this.baseUrl = process.env.TEST_MODE === 'true'
      ? 'http://mock-api-server:3001/inei'
      : 'https://iinei.inei.gob.pe/iinei/Servicio.svc';
  }

  async getDemographicData(department = 'Lima', year = new Date().getFullYear()) {
    try {
      const url = `${this.baseUrl}/ObtenerIndicadores?codigo=1&anio=${year}&ubigeo=${department}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`INEI API error: ${response.status}`);
      const data = await response.json();

      const demographicData = {
        department,
        year,
        population: data.poblacion || 0,
        growthRate: data.tasa_crecimiento || 0,
        urbanPopulation: data.poblacion_urbana || 0,
        ruralPopulation: data.poblacion_rural || 0
      };

      return { department, year, demographicData, isMock: false };
    } catch (error) {
      console.debug('INEIIntegration.getDemographicData error:', error?.message || error);
      // Provide reasonable mock data
      const mockDepartments = {
        'Lima': { population: 10750000, growthRate: 1.2, urbanPopulation: 9500000, ruralPopulation: 1250000 },
        'Arequipa': { population: 1600000, growthRate: 1.1, urbanPopulation: 1200000, ruralPopulation: 400000 },
        'Cusco': { population: 1400000, growthRate: 0.9, urbanPopulation: 500000, ruralPopulation: 900000 },
        'Trujillo': { population: 1100000, growthRate: 1.0, urbanPopulation: 850000, ruralPopulation: 250000 }
      };

      const deptData = mockDepartments[department] || { population: 1000000, growthRate: 1.0, urbanPopulation: 700000, ruralPopulation: 300000 };
      const demographicData = { department, year, ...deptData };
      return { department, year, demographicData, isMock: true };
    }
  }

  async getEconomicIndicators(department = 'Lima', year = new Date().getFullYear()) {
    try {
      const url = `${this.baseUrl}/ObtenerIndicadores?codigo=2&anio=${year}&ubigeo=${department}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`INEI API error: ${response.status}`);
      const data = await response.json();

      const economicData = {
        department,
        year,
        gdp: data.pib || 0,
        unemploymentRate: data.tasa_desempleo || 0,
        povertyRate: data.tasa_pobreza || 0,
        incomePerCapita: data.ingreso_per_capita || 0
      };

      return { department, year, economicData, isMock: false };
    } catch (error) {
      console.debug('INEIIntegration.getEconomicIndicators error:', error?.message || error);
      const mockEconomics = {
        'Lima': { gdp: 45000000, unemploymentRate: 6.5, povertyRate: 15.2, incomePerCapita: 18000 },
        'Arequipa': { gdp: 8500000, unemploymentRate: 7.2, povertyRate: 18.5, incomePerCapita: 12000 },
        'Cusco': { gdp: 6500000, unemploymentRate: 8.1, povertyRate: 22.3, incomePerCapita: 9500 },
        'Trujillo': { gdp: 7200000, unemploymentRate: 7.8, povertyRate: 20.1, incomePerCapita: 11000 }
      };

      const econData = mockEconomics[department] || { gdp: 10000000, unemploymentRate: 7.0, povertyRate: 18.0, incomePerCapita: 13000 };
      const economicData = { department, year, ...econData };
      return { department, year, economicData, isMock: true };
    }
  }
}

export default INEIIntegration;