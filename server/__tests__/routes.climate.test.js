import request from 'supertest';
import { createApp } from '../src/index.js';
import { server } from '../mocks/server.js';

process.env.PRAEVISIO_BEARER_TOKEN = 'demo-token';

describe('Climate routes', () => {
  let app;

  beforeAll(async () => {
    server.listen();
    app = await createApp({ disableBackgroundTasks: true, initializeServices: false });
  });

  afterAll(() => {
    server.close();
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
