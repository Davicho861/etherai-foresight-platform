import fetch from 'node-fetch';

class SatelliteIntegration {
  constructor() {
    // Using a mock API endpoint for satellite data (NDVI)
    // In production, this could be Copernicus, NASA Earthdata, etc.
    this.baseUrl = process.env.TEST_MODE === 'true'
      ? 'http://mock-api-server:3001/open-meteo'
      : 'https://api.open-meteo.com/v1/forecast'; // Using Open-Meteo as proxy for demo
  }

  async getNDVIData(latitude, longitude, startDate, endDate) {
    try {
      // Attempt to fetch real satellite-like data
      // For demo, using Open-Meteo temperature as proxy for vegetation health
      const url = `${this.baseUrl}?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&start_date=${startDate}&end_date=${endDate}&timezone=UTC`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Satellite API error: ${response.status}`);
      }

      const data = await response.json();

      // Convert temperature data to mock NDVI values (0-1 scale)
      // Higher temperatures in growing season indicate better vegetation health
      const ndviData = data.daily.time.map((date, index) => {
        const maxTemp = data.daily.temperature_2m_max[index];
        const minTemp = data.daily.temperature_2m_min[index];
        const avgTemp = (maxTemp + minTemp) / 2;

        // Mock NDVI calculation: optimal range 15-30°C gives high NDVI
        let ndvi = 0.3; // Base vegetation
        if (avgTemp >= 15 && avgTemp <= 30) {
          ndvi = 0.5 + (avgTemp - 15) * 0.02; // Peak at 30°C
        } else if (avgTemp > 30) {
          ndvi = Math.max(0.1, 0.7 - (avgTemp - 30) * 0.03); // Decline above 30°C
        }

        return {
          date,
          ndvi: Math.min(1, Math.max(0, ndvi + (Math.random() - 0.5) * 0.1)) // Add some noise
        };
      });

      return {
        location: { latitude, longitude },
        period: { start: startDate, end: endDate },
        ndviData,
        isMock: false,
        source: 'Open-Meteo (proxy for satellite data)'
      };
    } catch (error) {
      console.debug(`Using mock NDVI data for location (${latitude}, ${longitude}) from ${startDate} to ${endDate}. Error:`, error?.message || error);

      // Fallback to mock NDVI data
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24));
      const ndviData = [];

      for (let i = 0; i <= days; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        // Seasonal NDVI pattern for LATAM (higher in wet season)
        const month = date.getMonth() + 1;
        let baseNdvi = 0.4;
        if (month >= 3 && month <= 8) { // March to August - growing season
          baseNdvi = 0.6 + Math.sin((month - 3) * Math.PI / 6) * 0.2;
        }

        const ndvi = Math.min(1, Math.max(0, baseNdvi + (Math.random() - 0.5) * 0.15));

        ndviData.push({ date: dateStr, ndvi });
      }

      return {
        location: { latitude, longitude },
        period: { start: startDate, end: endDate },
        ndviData,
        isMock: true,
        source: 'Mock satellite data'
      };
    }
  }

  async getCropHealthPrediction(country, cropType = 'maize') {
    // Mock crop health prediction based on NDVI trends
    const mockPrediction = {
      country,
      cropType,
      currentHealth: Math.random() * 0.4 + 0.6, // 0.6-1.0
      predictedYield: Math.random() * 20 + 80, // 80-100% of normal
      riskLevel: Math.random() < 0.3 ? 'high' : Math.random() < 0.7 ? 'medium' : 'low',
      recommendations: [
        'Monitor soil moisture levels',
        'Consider irrigation if rainfall is below average',
        'Watch for pest outbreaks in high-risk areas'
      ]
    };

    return mockPrediction;
  }
}

export default SatelliteIntegration;