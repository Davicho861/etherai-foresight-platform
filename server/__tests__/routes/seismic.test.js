import request from 'supertest';
import express from 'express';
import seismicRouter from '../../src/routes/seismic.js';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios;

describe('Seismic Routes', () => {
  let app;

  beforeEach(() => {
    // Clear mock history before each test for purity
    mockedAxios.get.mockClear();

    // Create express app with the router
    app = express();
    app.use(express.json());
    app.use('/api/seismic', seismicRouter);
  });

  describe('GET /api/seismic/activity', () => {
    it('should return processed seismic activity with risk scores', async () => {
      // Simulate successful USGS API response
      mockedAxios.get.mockResolvedValue({
        data: {
          type: 'FeatureCollection',
          features: [
            {
              id: 'test1',
              properties: {
                mag: 5.5,
                place: '100km S of Lima, Peru',
                time: 1672531200000,
                tsunami: 0,
                url: 'http://earthquake.usgs.gov/test',
              },
              geometry: {
                coordinates: [-76.5, -12.0, 10.0],
              },
            },
          ],
        },
      });

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

    it('should handle API failures gracefully', async () => {
      // Simulate network error
      mockedAxios.get.mockRejectedValue(new Error('Network failure'));

      const response = await request(app).get('/api/seismic/activity');

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Failed to retrieve seismic activity.');
    });
  });

  describe('GET /api/seismic/risk', () => {
    it('should return geophysical risk prediction', async () => {
      // Simulate successful USGS API response
      mockedAxios.get.mockResolvedValue({
        data: {
          type: 'FeatureCollection',
          features: [
            {
              id: 'test1',
              properties: {
                mag: 6.0,
                place: 'Offshore Peru',
                time: 1672531200000,
                tsunami: 1,
                url: 'http://earthquake.usgs.gov/test',
              },
              geometry: {
                coordinates: [-76.5, -12.0, 5.0],
              },
            },
          ],
        },
      });

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
      // Simulate empty response
      mockedAxios.get.mockResolvedValue({
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      const response = await request(app).get('/api/seismic/risk');

      expect(response.status).toBe(200);
      expect(response.body.overallRisk).toBe(0);
      expect(response.body.eventCount).toBe(0);
    });
  });
});