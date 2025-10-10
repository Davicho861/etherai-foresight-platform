 
import axios from 'axios';

// Wrapper for Open-Meteo calls that respects TEST_MODE and returns a normalized shape
export async function fetchRecentTemperature(lat, lon) {
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
    // No fallback to mock values - return error indication
    return { error: error.message || error, lat, lon };
  }
}

export async function fetchClimatePrediction(lat, lon, days = 7) {
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
    // No fallback - return error indication
    return { error: error.message || error, lat, lon, days };
  }
}
