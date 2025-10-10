#!/usr/bin/env node
import express from 'express';
const app = express();
const port = process.env.GDELT_MOCK_PORT || 4020;

// Responder cualquier ruta bajo /gdelt para facilitar pruebas en modo nativo.
app.use('/gdelt', (req, res) => {
  // Extraer parámetros relevantes de consulta si existen
  const query = req.query || {};
  const country = query.country || query.iso3 || 'PER';
  const start = query.start || '2025-10-01';
  const end = query.end || '2025-10-08';

  // Retornar un conjunto reducido de eventos de ejemplo
  res.json({
    status: 'ok',
    requested: { path: req.path, query },
    events: [
      { id: 'E1', date: start, country: country, type: 'conflict', score: 0.75 },
      { id: 'E2', date: end, country: country, type: 'protest', score: 0.4 }
    ]
  });
});

// También aceptar la raíz para diagnósticos rápidos
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'gdelt-mock', port });
});

// Fallback: aceptar cualquier path y devolver la misma estructura para pruebas
app.use((req, res) => {
  const query = req.query || {};
  const country = query.country || query.iso3 || 'PER';
  const start = query.start || '2025-10-01';
  const end = query.end || '2025-10-08';
  res.json({
    status: 'ok',
    requested: { path: req.path, query },
    events: [
      { id: 'E1', date: start, country: country, type: 'conflict', score: 0.75 },
      { id: 'E2', date: end, country: country, type: 'protest', score: 0.4 }
    ]
  });
});

app.listen(port, () => {
  console.log(`GDELT mock listening on http://localhost:${port}`);
});
