import { server } from '../mocks/server.js';
import request from 'supertest';
import express from 'express';
import seismicRouter from '../../src/routes/seismic.js';

describe('Seismic Routes', () => {
  let app;

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    // Create express app with the router
    app = express();
    app.use(express.json());
    app.use('/api/seismic', seismicRouter);
  });

  describe('GET /api/seismic/activity', () => {
    it('should return processed seismic activity with risk scores', async () => {
      const response = await request(app).get('/api/seismic/activity');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      expect(response.body[0]).toMatchObject({
        id: 'test1',
        place: '100km S of Lima, Peru',
        magnitude: 5.5,
        riskScore: expect.any(Number),
      });
    });
  });

  describe('GET /api/seismic/risk', () => {
    it('should return geophysical risk prediction', async () => {
      const response = await request(app).get('/api/seismic/risk');

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        overallRisk: expect.any(Number),
        eventCount: 1,
        maxMagnitude: 6.0,
        highRiskZones: expect.any(Array),
      });
    });

    it('should handle no seismic events', async () => {
      const response = await request(app).get('/api/seismic/risk');

      expect(response.status).toBe(200);
      expect(response.body.overallRisk).toBe(0);
      expect(response.body.eventCount).toBe(0);
    });
  });
});