#!/usr/bin/env node
import express from 'express';
const app = express();
const port = process.env.OPEN_METEO_MOCK_PORT || 4030;

app.get('/v1/forecast', (req, res) => {
  // Simular respuesta simplificada de Open-Meteo
  const lat = req.query.latitude || '0';
  const lon = req.query.longitude || '0';
  res.json({
    latitude: Number(lat),
    longitude: Number(lon),
    hourly: {
      temperature_2m: [20, 21, 22, 21, 19],
      precipitation: [0, 0, 0.1, 0, 0]
    }
  });
});

app.listen(port, () => {
  console.log(`Open-Meteo mock listening on http://localhost:${port}`);
});
