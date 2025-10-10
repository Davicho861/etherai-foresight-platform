 
import axios from 'axios';

// Wrapper for Open-Meteo calls that respects TEST_MODE and returns a normalized shape
export async function fetchRecentTemperature(lat, lon) {
  // If forced mocks are enabled, return a deterministic built-in mock quickly
  if (process.env.FORCE_MOCKS === 'true') {
    return {
      temperature: 25.0,
      humidity: 60,
      precipitation_probability: 5,
      weather_code: 1,
      wind_speed: 3.4,
      source: 'builtin-mock',
      isMock: true
    };
  }

  try {
    const native = process.env.NATIVE_DEV_MODE === 'true';
    const openMeteoMockPort = process.env.OPEN_METEO_MOCK_PORT || 4030;
    const base = native
      ? `http://localhost:${openMeteoMockPort}/v1/forecast`
      : (process.env.TEST_MODE === 'true' ? 'http://mock-api-server:3001/open-meteo' : 'https://api.open-meteo.com/v1/forecast');
    const url = `${base}?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability&timezone=auto`;
    const response = await axios.get(url, { timeout: 10000 });
    const data = response.data || {};

    // Defensive access: prefer current_weather and hourly arrays when present
    const current = data.current_weather || {};
    const hourly = data.hourly || {};
    const humidityArr = hourly.relative_humidity_2m || [];
    const precipitationArr = hourly.precipitation_probability || [];

    return {
      temperature: current.temperature ?? null,
      humidity: Array.isArray(humidityArr) && humidityArr.length ? humidityArr[0] : null,
      precipitation_probability: Array.isArray(precipitationArr) && precipitationArr.length ? precipitationArr[0] : null,
      weather_code: current.weathercode ?? null,
      wind_speed: current.windspeed ?? null
    };
  } catch (error) {
    console.error('Error fetching from Open Meteo:', error && error.message ? error.message : error);
    // Return an informative mock rather than raw error to keep flows resilient
    return { error: error.message || error, lat, lon, source: 'error-mock', isMock: true };
  }
}

export async function fetchClimatePrediction(lat, lon, days = 7) {
  // Respect FORCE_MOCKS and return a predictable daily forecast
  if (process.env.FORCE_MOCKS === 'true') {
    const daysArr = Array.from({ length: days }).map((_, i) => ({
      day: i + 1,
      temperature_2m_max: 28 + i % 3,
      temperature_2m_min: 18 - (i % 2),
      precipitation_sum: Math.max(0, (i % 5) - 2),
      weathercode: 1
    }));
    return {
      time: daysArr.map((d, i) => new Date(Date.now() + i * 24 * 3600 * 1000).toISOString().slice(0, 10)),
      temperature_2m_max: daysArr.map(d => d.temperature_2m_max),
      temperature_2m_min: daysArr.map(d => d.temperature_2m_min),
      precipitation_sum: daysArr.map(d => d.precipitation_sum),
      weathercode: daysArr.map(d => d.weathercode),
      source: 'builtin-mock',
      isMock: true
    };
  }

  try {
    const native = process.env.NATIVE_DEV_MODE === 'true';
    const openMeteoMockPort = process.env.OPEN_METEO_MOCK_PORT || 4030;
    const base = native
      ? `http://localhost:${openMeteoMockPort}/v1/forecast`
      : (process.env.TEST_MODE === 'true' ? 'http://mock-api-server:3001/open-meteo' : 'https://api.open-meteo.com/v1/forecast');
    const url = `${base}?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=${days}`;
    const response = await axios.get(url, { timeout: 15000 });
    return (response.data && response.data.daily) ? response.data.daily : null;
  } catch (error) {
    console.error('Error fetching climate prediction:', error && error.message ? error.message : error);
    // Return a small mock so callers get consistent shape
    return { error: error.message || error, lat, lon, days, source: 'error-mock', isMock: true };
  }
}
