import fetch from 'node-fetch';

class FMIIntegration {
  constructor() {
    this.baseUrl = 'https://www.imf.org/external/datamapper/api/v1';
  }

  async getDebtData(country, startYear, endYear) {
    try {
      // Attempt to fetch real IMF data
      const url = `${this.baseUrl}/debt/GGXWDG_NGDP/${country}?startYear=${startYear}&endYear=${endYear}`;
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`IMF API error: ${response.status}`);
      }
      const data = await response.json();
      // Assuming the API returns an array of objects with year and value
      const debtData = data.map(item => ({ year: item.year, value: item.value }));
      return {
        country,
        period: { startYear, endYear },
        debtData,
        isMock: false
      };
    } catch (error) {
      // Fallback to mock data
      console.log(`Using mock debt data for ${country} (${startYear}-${endYear})`);

      // Realistic debt levels for LATAM countries
      const baseDebtLevels = {
        'COL': 55, // Colombia ~55% GDP
        'PER': 35, // Peru ~35% GDP
        'ARG': 85, // Argentina ~85% GDP
        'MEX': 50, // Mexico ~50% GDP
        'BRA': 80, // Brazil ~80% GDP
        'CHL': 40  // Chile ~40% GDP
      };

      const baseLevel = baseDebtLevels[country.toUpperCase()] || 50;
      const variation = (Math.random() - 0.5) * 10; // ±5% variation

      const debtData = [
        { year: startYear, value: Math.max(20, baseLevel + variation - 2) },
        { year: endYear, value: Math.max(20, baseLevel + variation + 2) }
      ];

      return {
        country,
        period: { startYear, endYear },
        debtData,
        isMock: true
      };
    }
  }
}

export default FMIIntegration;