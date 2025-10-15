import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import sdlcRouter from '../src/routes/sdlc.js';

const app = express();
app.use(bodyParser.json());
app.use('/api', sdlcRouter);

describe('XAI explain endpoint', () => {
  test('returns structured explanation for CEO metric', async () => {
    const res = await request(app)
      .post('/api/xai/explain')
      .send({ metric: 'empireHealth', value: 88, context: 'CEODashboard' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.explanation).toBeDefined();
    expect(typeof res.body.confidence).toBe('number');
    expect(Array.isArray(res.body.sources)).toBe(true);
  });

  test('returns 400 on missing parameters', async () => {
    const res = await request(app)
      .post('/api/xai/explain')
      .send({ metric: 'empireHealth' })
      .expect(400);

    expect(res.body.error).toMatch(/Missing required parameters/);
  });
});
