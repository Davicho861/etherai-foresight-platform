import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ClimateData {
  temperature: number;
  humidity: number;
  precipitation_probability: number;
  weather_code: number;
  wind_speed: number;
}

interface PredictionData {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  precipitation_sum: number[];
  weathercode: number[];
}

interface City {
  name: string;
  lat: number;
  lon: number;
}

const latamCities: City[] = [
  { name: 'Bogotá', lat: 4.7110, lon: -74.0721 },
  { name: 'Buenos Aires', lat: -34.6037, lon: -58.3816 },
  { name: 'São Paulo', lat: -23.5505, lon: -46.6333 },
  { name: 'Lima', lat: -12.0464, lon: -77.0428 },
  { name: 'Ciudad de México', lat: 19.4326, lon: -99.1332 },
  { name: 'Santiago', lat: -33.4489, lon: -70.6693 },
];

const ClimateWidget: React.FC = () => {
  const [currentData, setCurrentData] = useState<ClimateData | null>(null);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<City>(latamCities[0]);

  const fetchCurrentWeather = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/climate/current?lat=${selectedCity.lat}&lon=${selectedCity.lon}`);
      if (!response.ok) throw new Error('Failed to fetch current weather');
      const data = await response.json();
      setCurrentData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [selectedCity]);

  const fetchPrediction = useCallback(async () => {
    try {
      const response = await fetch(`/api/climate/predict?lat=${selectedCity.lat}&lon=${selectedCity.lon}&days=7`);
      if (!response.ok) throw new Error('Failed to fetch prediction');
      const data = await response.json();
      setPredictionData(data);
    } catch (err) {
      console.error('Prediction fetch error:', err);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchCurrentWeather();
    fetchPrediction();
  }, [fetchCurrentWeather, fetchPrediction]);

  const getWeatherIcon = (code: number) => {
    // Simplified weather code mapping
    if (code === 0) return '☀️'; // Clear sky
    if (code <= 3) return '⛅'; // Partly cloudy
    if (code <= 48) return '☁️'; // Cloudy
    if (code <= 67) return '🌧️'; // Rain
    if (code <= 77) return '❄️'; // Snow
    return '🌤️'; // Default
  };

  const handleCityChange = (cityName: string) => {
    const city = latamCities.find(c => c.name === cityName);
    if (city) {
      setSelectedCity(city);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Predicción Climática LATAM - Open Meteo</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Ubicación:</label>
          <div className="flex gap-2 items-center">
            <select
              value={selectedCity.name}
              onChange={(e) => handleCityChange(e.target.value)}
              className="border rounded px-2 py-1 bg-etherblue-dark text-white"
            >
              {latamCities.map(city => (
                <option key={city.name} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
            <button
              onClick={() => {
                fetchCurrentWeather();
                fetchPrediction();
              }}
              className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? 'Cargando...' : 'Actualizar'}
            </button>
          </div>
        </div>

        {error && (
          <div className="text-red-500 mb-4">
            Error: {error}
          </div>
        )}

        {currentData && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Clima Actual en {selectedCity.name}</h3>
            <div className="flex items-center gap-4">
              <span className="text-4xl">{getWeatherIcon(currentData.weather_code)}</span>
              <div>
                <div className="text-2xl font-bold">{currentData.temperature}°C</div>
                <div className="text-sm text-gray-600">
                  Humedad: {currentData.humidity}% | Viento: {currentData.wind_speed} km/h
                </div>
                <div className="text-sm text-gray-600">
                  Prob. Precipitación: {currentData.precipitation_probability}%
                </div>
              </div>
            </div>
          </div>
        )}

        {predictionData && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Predicción 7 días</h3>
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
              {predictionData.time.slice(0, 7).map((date, index) => (
                <div key={date} className="border rounded p-2 text-center">
                  <div className="text-sm font-medium">
                    {new Date(date).toLocaleDateString('es-ES', { weekday: 'short' })}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(date).toLocaleDateString('es-ES', { day: 'numeric' })}
                  </div>
                  <div className="text-lg my-1">
                    {getWeatherIcon(predictionData.weathercode[index])}
                  </div>
                  <div className="text-sm">
                    {predictionData.temperature_2m_max[index]}° / {predictionData.temperature_2m_min[index]}°
                  </div>
                  <div className="text-xs text-gray-500">
                    {predictionData.precipitation_sum[index]}mm
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClimateWidget;