/* eslint-disable no-unused-vars */
import axios from 'axios';

export async function fetchRecentTemperature(lat, lon) {
  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,precipitation_probability&timezone=auto`);
    const data = response.data;
    return {
      temperature: data.current_weather.temperature,
      humidity: data.hourly.relative_humidity_2m[0],
      precipitation_probability: data.hourly.precipitation_probability[0],
      weather_code: data.current_weather.weathercode,
      wind_speed: data.current_weather.windspeed
    };
  } catch (error) {
    console.error('Error fetching from Open Meteo:', error);
    // Fallback to mock
    return { temperature: 28 + Math.round(Math.random() * 4) };
  }
}

export async function fetchClimatePrediction(lat, lon, days = 7) {
  try {
    const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto&forecast_days=${days}`);
    return response.data.daily;
  } catch (error) {
    console.error('Error fetching climate prediction:', error);
    return null;
  }
}
