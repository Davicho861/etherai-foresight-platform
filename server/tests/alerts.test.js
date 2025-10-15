// Test for /api/alerts endpoints
const request = require('supertest');
const express = require('express');
const alertsRouter = require('../src/routes/alerts.js').default || require('../src/routes/alerts.js');

const app = express();
app.use(express.json());
app.use('/api/alerts', alertsRouter);

describe('Alerts API', () => {
  describe('GET /api/alerts', () => {
    test('returns list of alerts', async () => {
      const res = await request(app).get('/api/alerts');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('alerts');
      expect(res.body).toHaveProperty('total');
      expect(Array.isArray(res.body.alerts)).toBe(true);
    });

    test('filters by region', async () => {
      const res = await request(app).get('/api/alerts?region=Colombia');
      expect(res.statusCode).toBe(200);
      expect(res.body.alerts.every(alert => alert.region === 'Colombia')).toBe(true);
    });

    test('filters by severity', async () => {
      const res = await request(app).get('/api/alerts?severity=HIGH');
      expect(res.statusCode).toBe(200);
      expect(res.body.alerts.every(alert => alert.severity === 'HIGH')).toBe(true);
    });
  });

  describe('GET /api/alerts/:id', () => {
    test('returns specific alert', async () => {
      const res = await request(app).get('/api/alerts/1');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', 1);
      expect(res.body).toHaveProperty('title');
    });

    test('returns 404 for non-existent alert', async () => {
      const res = await request(app).get('/api/alerts/999');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Alert not found');
    });
  });

  describe('POST /api/alerts', () => {
    test('creates new alert with valid data', async () => {
      const newAlert = {
        title: 'Test Alert',
        description: 'Test description',
        severity: 'MEDIUM',
        region: 'Peru',
        type: 'ECONOMIC'
      };

      const res = await request(app).post('/api/alerts').send(newAlert);
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe(newAlert.title);
      expect(res.body.status).toBe('ACTIVE');
    });

    test('returns 400 for missing required fields', async () => {
      const res = await request(app).post('/api/alerts').send({ title: 'Incomplete' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Missing required fields');
    });
  });
});