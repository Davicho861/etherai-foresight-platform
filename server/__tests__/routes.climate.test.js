import request from 'supertest';
import { createApp } from '../src/index.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

jest.mock('../src/integrations/open-meteo.mock.js', () => ({
  fetchRecentTemperature: async (lat, lon) => ({ lat, lon, temperature: 22 }),
  fetchClimatePrediction: async (lat, lon, days) => ({ lat, lon, days, forecast: 'stable' })
}));

describe('Climate routes', () => {
  let app;
  beforeAll(async () => {
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
  });

  it('GET /api/climate/current requires lat/lon', async () => {
    const res = await request(app).get('/api/climate/current');
    expect(res.status).toBe(400);
  });

  it('GET /api/climate/current returns data when params provided', async () => {
    const res = await request(app).get('/api/climate/current?lat=4.7&lon=-74.0');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('temperature');
  });

  it('GET /api/climate/predict requires lat/lon', async () => {
    const res = await request(app).get('/api/climate/predict');
    expect(res.status).toBe(400);
  });

  it('GET /api/climate/predict returns prediction', async () => {
    const res = await request(app).get('/api/climate/predict?lat=4.7&lon=-74&days=3');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('forecast');
  });
});
