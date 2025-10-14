#!/usr/bin/env node
import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || process.env.USGS_MOCK_PORT || 4011;

app.get('/usgs/significant_day.geojson', (req, res) => {
  // Minimal GeoJSON FeatureCollection with one mock event
  const geojson = {
    type: 'FeatureCollection',
    metadata: { generated: Date.now() },
    features: [
      {
        id: 'mock-1',
        properties: {
          mag: 4.5,
          place: 'Mock Region - Test',
          time: Date.now(),
          tsunami: 0,
          sig: 50,
          url: 'https://example.com/mock-quake'
        },
        geometry: { coordinates: [-74.2973, 4.5709, 10] }
      }
    ]
  };
  res.json(geojson);
});

app.get('/v1/forecast', (req, res) => {
  // Basic Open-Meteo-like response (current_weather + daily)
  const { latitude = '0', longitude = '0', forecast_days = '7' } = req.query;
  const days = parseInt(String(forecast_days), 10) || 7;
  const now = Date.now();

  const daily = {
    time: Array.from({ length: days }).map((_, i) => new Date(now + i * 24 * 3600 * 1000).toISOString().slice(0,10)),
    temperature_2m_max: Array.from({ length: days }).map((_, i) => 25 + (i % 3)),
    temperature_2m_min: Array.from({ length: days }).map((_, i) => 15 + (i % 2)),
    precipitation_sum: Array.from({ length: days }).map(() => 0),
    weathercode: Array.from({ length: days }).map(() => 1)
  };

  const response = {
  latitude: parseFloat(String(latitude)),
  longitude: parseFloat(String(longitude)),
    generationtime_ms: 1,
    utc_offset_seconds: 0,
    timezone: 'UTC',
    timezone_abbreviation: 'UTC',
    elevation: 0,
    current_weather: {
      temperature: 24.5,
      windspeed: 3.4,
      winddirection: 120,
      weathercode: 1,
      time: new Date().toISOString()
    },
    hourly: {
      temperature_2m: [24.5],
      relative_humidity_2m: [60],
      precipitation_probability: [5]
    },
    daily
  };

  res.json(response);
});

app.get('/', (req, res) => res.send(`Mock server running (USGS/Open-Meteo) on port ${PORT}`));

app.listen(PORT, () => {
   
  console.log(`Mock server listening on http://localhost:${PORT}`);
});

// Crear un servidor adicional para simular GDELT en el puerto 4020
const gdeltApp = express();
gdeltApp.use(cors());

gdeltApp.get('/gdelt/events', (req, res) => {
  // Simular respuesta de GDELT API con estructura correcta
  // La integración espera una respuesta con 'articles' array
  const articles = [
    {
      id: 'g1',
      title: 'Mock protest article',
      themes: 'PROTEST;DEMONSTRATION',
      url: 'https://example.com/g1',
      seendate: '20251013000000',
      socialimage: '',
      domain: 'example.com',
      language: 'English',
      sourcecountry: 'US'
    },
    {
      id: 'g2',
      title: 'Mock strike article',
      themes: 'STRIKE;LABOR',
      url: 'https://example.com/g2',
      seendate: '20251013000000',
      socialimage: '',
      domain: 'example.com',
      language: 'English',
      sourcecountry: 'US'
    }
  ];
  res.json({ articles });
});

gdeltApp.get('/gdelt/*', (req, res) => {
  res.json({ articles: [] });
});

const GDELT_PORT = process.env.GDELT_MOCK_PORT || 4020;
http.createServer(gdeltApp).listen(GDELT_PORT, () => console.log(`GDELT mock listening on port ${GDELT_PORT}`));
