import express from 'express';
import { fetchRecentTemperature, fetchClimatePrediction } from '../integrations/open-meteo.mock.js';

const router = express.Router();

// GET /api/climate/current?lat=4.7110&lon=-74.0721
router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

    const data = await fetchRecentTemperature(parseFloat(lat), parseFloat(lon));
    res.json(data);
  } catch (err) {
    console.error('Error in /api/climate/current:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/climate/predict?lat=4.7110&lon=-74.0721&days=7
router.get('/predict', async (req, res) => {
  try {
    const { lat, lon, days = 7 } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon required' });

    const data = await fetchClimatePrediction(parseFloat(lat), parseFloat(lon), parseInt(days));
    if (!data) return res.status(500).json({ error: 'Failed to fetch prediction' });

    res.json(data);
  } catch (err) {
    console.error('Error in /api/climate/predict:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;