import request from 'supertest';
import express from 'express';
import demoRouter from '../src/routes/demo.js';

// No mocks needed - using __mocks__ for integrations

describe('GET /api/demo/live-state resilience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a full response with data from integrations', async () => {
    const app = express();
    app.use(express.json());
    app.use('/api/demo', demoRouter);

    const res = await request(app).get('/api/demo/live-state');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('kpis');
    expect(res.body).toHaveProperty('countries');
    expect(res.body).toHaveProperty('communityResilience');
    expect(res.body).toHaveProperty('foodSecurity');
    expect(res.body).toHaveProperty('ethicalAssessment');

    expect(res.body.foodSecurity).toBeDefined();
    expect(res.body.ethicalAssessment).toBeDefined();
    expect(res.body.communityResilience).toBeDefined();

    // lastUpdated should be present
    expect(res.body.lastUpdated).toBeDefined();
  }, 20000);
});
