// Test template for /api/predict (requires jest & supertest)
const request = require('supertest');
const express = require('express');
const predictRouter = require('../src/routes/predict.js').default || require('../src/routes/predict.js');

const app = express();
app.use(express.json());
app.use('/api/predict', predictRouter);

describe('POST /api/predict', () => {
  test('returns 400 on missing body', async () => {
    const res = await request(app).post('/api/predict').send({});
    expect(res.statusCode).toBe(400);
  });

  test('returns prediction for valid body', async () => {
    const res = await request(app).post('/api/predict').send({ country: 'Colombia', parameters: { infectionRate: 50, protestIndex: 30, economicIndex: 20 } });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('predictionId');
    expect(res.body).toHaveProperty('risk');
    expect(res.body).toHaveProperty('confidence');
  });
});
