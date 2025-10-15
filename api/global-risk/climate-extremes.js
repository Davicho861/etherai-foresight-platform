export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Using NASA POWER API for climate data or fallback to mock data
    // NASA POWER provides meteorological data including extreme weather indicators
    const countries = ['COL', 'PER', 'ARG', 'BRA', 'MEX']; // Focus on LATAM
    const baseUrl = 'https://power.larc.nasa.gov/api/temporal/daily/point';

    const fetchPromises = countries.map(async (country) => {
      try {
        // Using approximate coordinates for country centers
        const coords = getCountryCoordinates(country);
        const params = new URLSearchParams({
          start: '20231001', // Last 30 days
          end: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
          latitude: coords.lat,
          longitude: coords.lon,
          community: 'RE',
          parameters: 'T2M_MAX,T2M_MIN,PRECTOTCORR,RH2M', // Max temp, min temp, precipitation, humidity
          format: 'JSON'
        });

        const url = `${baseUrl}?${params}`;
        const response = await fetch(url, {
          headers: {
            'User-Agent': 'PraevisioAI/1.0'
          }
        });

        if (!response.ok) {
          throw new Error(`NASA POWER API error: ${response.status}`);
        }

        const data = await response.json();

        if (data && data.properties && data.properties.parameter) {
          const processedData = processClimateData(data.properties.parameter, country);
          return {
            country: getCountryName(country),
            countryCode: country,
            ...processedData,
            riskLevel: calculateClimateRiskLevel(processedData)
          };
        } else {
          return getMockClimateData(country);
        }
      } catch (error) {
        console.warn(`Failed to fetch climate data for ${country}:`, error.message);
        return getMockClimateData(country);
      }
    });

    const results = await Promise.all(fetchPromises);

    const processedData = {
      timestamp: new Date().toISOString(),
      indicator: 'Climate Extremes Index',
      data: results,
      summary: {
        totalCountries: results.length,
        highRiskCountries: results.filter(r => r.riskLevel === 'high').length,
        extremeEvents: results.reduce((sum, r) => sum + (r.extremeEvents || 0), 0),
        lastUpdate: new Date().toISOString()
      }
    };

    res.json(processedData);
  } catch (error) {
    console.error('Error in climate extremes route:', error);
    res.status(500).json({ error: 'Failed to retrieve climate extremes data.' });
  }
}

function processClimateData(parameters, country) {
  // Process NASA POWER data to identify extreme events
  const maxTemps = Object.values(parameters.T2M_MAX || {});
  const minTemps = Object.values(parameters.T2M_MIN || {});
  const precipitations = Object.values(parameters.PRECTOTCORR || {});
  const humidities = Object.values(parameters.RH2M || {});

  const avgMaxTemp = maxTemps.reduce((sum, t) => sum + t, 0) / maxTemps.length;
  const avgMinTemp = minTemps.reduce((sum, t) => sum + t, 0) / minTemps.length;
  const totalPrecip = precipitations.reduce((sum, p) => sum + p, 0);
  const avgHumidity = humidities.reduce((sum, h) => sum + h, 0) / humidities.length;

  // Count extreme events (simplified logic)
  let extremeEvents = 0;
  maxTemps.forEach(temp => { if (temp > 35) extremeEvents++; }); // Heat waves
  precipitations.forEach(precip => { if (precip > 50) extremeEvents++; }); // Heavy rain
  minTemps.forEach(temp => { if (temp < 5) extremeEvents++; }); // Cold snaps

  return {
    avgMaxTemp: parseFloat(avgMaxTemp.toFixed(1)),
    avgMinTemp: parseFloat(avgMinTemp.toFixed(1)),
    totalPrecipitation: parseFloat(totalPrecip.toFixed(1)),
    avgHumidity: parseFloat(avgHumidity.toFixed(1)),
    extremeEvents,
    period: 'Last 30 days'
  };
}

function calculateClimateRiskLevel(data) {
  let score = 0;
  if (data.avgMaxTemp > 35) score += 2;
  if (data.totalPrecipitation > 200) score += 2;
  if (data.extremeEvents > 5) score += 2;
  if (data.avgHumidity > 80) score += 1;

  if (score >= 5) return 'high';
  if (score >= 3) return 'medium';
  return 'low';
}

function getMockClimateData(country) {
  const mockData = {
    'COL': { avgMaxTemp: 28.5, avgMinTemp: 18.2, totalPrecipitation: 150.3, avgHumidity: 75.2, extremeEvents: 3 },
    'PER': { avgMaxTemp: 25.8, avgMinTemp: 15.6, totalPrecipitation: 85.7, avgHumidity: 68.9, extremeEvents: 2 },
    'ARG': { avgMaxTemp: 22.1, avgMinTemp: 12.4, totalPrecipitation: 120.5, avgHumidity: 72.3, extremeEvents: 4 },
    'BRA': { avgMaxTemp: 30.2, avgMinTemp: 20.8, totalPrecipitation: 180.9, avgHumidity: 78.6, extremeEvents: 5 },
    'MEX': { avgMaxTemp: 26.7, avgMinTemp: 16.9, totalPrecipitation: 95.2, avgHumidity: 65.4, extremeEvents: 2 }
  };

  const data = mockData[country] || { avgMaxTemp: 25.0, avgMinTemp: 15.0, totalPrecipitation: 100.0, avgHumidity: 70.0, extremeEvents: 2 };

  return {
    country: getCountryName(country),
    countryCode: country,
    ...data,
    riskLevel: calculateClimateRiskLevel(data),
    period: 'Mock data - Last 30 days'
  };
}

function getCountryCoordinates(country) {
  const coords = {
    'COL': { lat: 4.5709, lon: -74.2973 }, // Bogotá
    'PER': { lat: -12.0464, lon: -77.0428 }, // Lima
    'ARG': { lat: -34.6118, lon: -58.3966 }, // Buenos Aires
    'BRA': { lat: -15.7942, lon: -47.8822 }, // Brasília
    'MEX': { lat: 19.4326, lon: -99.1332 }  // Mexico City
  };
  return coords[country] || { lat: 0, lon: 0 };
}

function getCountryName(code) {
  const names = {
    'COL': 'Colombia',
    'PER': 'Peru',
    'ARG': 'Argentina',
    'BRA': 'Brazil',
    'MEX': 'Mexico'
  };
  return names[code] || code;
}