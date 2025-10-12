import safeFetch from '../lib/safeFetch.js';

class ClimateIntegration {
  constructor() {
    this.baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point';
  }

  async getClimateExtremes(countries = ['COL', 'PER', 'ARG']) {
    try {
      const results = await Promise.all(
        countries.map(country => this.getCountryClimateData(country))
      );
      return results;
    } catch (error) {
      console.error('Error fetching climate extremes data:', error);
      // Fallback to mock data
      return countries.map(country => this.getMockClimateData(country));
    }
  }

  async getCountryClimateData(country) {
    try {
      const coords = this.getCountryCoordinates(country);
      const endDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10).replace(/-/g, '');

      const params = new URLSearchParams({
        start: startDate,
        end: endDate,
        latitude: coords.lat,
        longitude: coords.lon,
        community: 'RE',
        parameters: 'T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M',
        format: 'JSON'
      });

      const url = `${this.baseUrl}?${params}`;
      const data = await safeFetch(url, { headers: { 'User-Agent': 'Praevisio/1.0 (+https://praevisio.local)' } }, { timeout: 15000, retries: 2 });

      if (data && data.properties && data.properties.parameter) {
        return this.processClimateData(data.properties.parameter, country);
      } else {
        return this.getMockClimateData(country);
      }
    } catch (error) {
      if (process.env.FORCE_MOCKS === 'true' || process.env.FORCE_MOCKS === '1') {
        console.warn(`ClimateIntegration: returning FORCE_MOCKS mock for ${country} due to error: ${error && error.message}`);
        const mock = this.getMockClimateData(country);
        return { ...mock, isMock: true, source: 'FORCE_MOCKS:Climate' };
      }
      throw new Error(`ClimateIntegration failed for ${country}: ${error && error.message ? error.message : String(error)}`);
    }
  }

  processClimateData(parameters, country) {
    const maxTemps = Object.values(parameters.T2M_MAX || {});
    const minTemps = Object.values(parameters.T2M_MIN || {});
    const precipitations = Object.values(parameters.PRECTOTCORR || {});
    const humidities = Object.values(parameters.RH2M || {});

    const avgMaxTemp = maxTemps.reduce((sum, t) => sum + t, 0) / maxTemps.length;
    const avgMinTemp = minTemps.reduce((sum, t) => sum + t, 0) / minTemps.length;
    const totalPrecip = precipitations.reduce((sum, p) => sum + p, 0);
    const avgHumidity = humidities.reduce((sum, h) => sum + h, 0) / humidities.length;

    // Count extreme events
    let extremeEvents = 0;
    maxTemps.forEach(temp => { if (temp > 35) extremeEvents++; }); // Heat waves
    precipitations.forEach(precip => { if (precip > 50) extremeEvents++; }); // Heavy rain
    minTemps.forEach(temp => { if (temp < 5) extremeEvents++; }); // Cold snaps

    return {
      country: this.getCountryName(country),
      countryCode: country,
      avgMaxTemp: parseFloat(avgMaxTemp.toFixed(1)),
      avgMinTemp: parseFloat(avgMinTemp.toFixed(1)),
      totalPrecipitation: parseFloat(totalPrecip.toFixed(1)),
      avgHumidity: parseFloat(avgHumidity.toFixed(1)),
      extremeEvents,
      riskLevel: this.calculateClimateRiskLevel({ avgMaxTemp, totalPrecip, extremeEvents, avgHumidity }),
      period: 'Last 30 days',
      timestamp: new Date().toISOString()
    };
  }

  calculateClimateRiskLevel(data) {
    let score = 0;
    if (data.avgMaxTemp > 35) score += 2;
    if (data.totalPrecipitation > 200) score += 2;
    if (data.extremeEvents > 5) score += 2;
    if (data.avgHumidity > 80) score += 1;

    if (score >= 5) return 'high';
    if (score >= 3) return 'medium';
    return 'low';
  }

  getMockClimateData(country) {
    const mockData = {
      'COL': { avgMaxTemp: 28.5, avgMinTemp: 18.2, totalPrecipitation: 150.3, avgHumidity: 75.2, extremeEvents: 3 },
      'PER': { avgMaxTemp: 25.8, avgMinTemp: 15.6, totalPrecipitation: 85.7, avgHumidity: 68.9, extremeEvents: 2 },
      'ARG': { avgMaxTemp: 22.1, avgMinTemp: 12.4, totalPrecipitation: 120.5, avgHumidity: 72.3, extremeEvents: 4 },
      'BRA': { avgMaxTemp: 30.2, avgMinTemp: 20.8, totalPrecipitation: 180.9, avgHumidity: 78.6, extremeEvents: 5 },
      'MEX': { avgMaxTemp: 26.7, avgMinTemp: 16.9, totalPrecipitation: 95.2, avgHumidity: 65.4, extremeEvents: 2 }
    };

    const data = mockData[country] || { avgMaxTemp: 25.0, avgMinTemp: 15.0, totalPrecipitation: 100.0, avgHumidity: 70.0, extremeEvents: 2 };

    return {
      country: this.getCountryName(country),
      countryCode: country,
      ...data,
      riskLevel: this.calculateClimateRiskLevel(data),
      period: 'Mock data - Last 30 days',
      timestamp: new Date().toISOString()
    };
  }

  getCountryCoordinates(country) {
    const coords = {
      'COL': { lat: 4.5709, lon: -74.2973 }, // Bogotá
      'PER': { lat: -12.0464, lon: -77.0428 }, // Lima
      'ARG': { lat: -34.6118, lon: -58.3966 }, // Buenos Aires
      'BRA': { lat: -15.7942, lon: -47.8822 }, // Brasília
      'MEX': { lat: 19.4326, lon: -99.1332 }  // Mexico City
    };
    return coords[country] || { lat: 0, lon: 0 };
  }

  getCountryName(code) {
    const names = {
      'COL': 'Colombia',
      'PER': 'Peru',
      'ARG': 'Argentina',
      'BRA': 'Brazil',
      'MEX': 'Mexico'
    };
    return names[code] || code;
  }
}

export default ClimateIntegration;