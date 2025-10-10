import request from 'supertest';
import express from 'express';
import demoRouter from '../../src/routes/demo.js';

// Mock all integrations to throw or fail
jest.mock('../../src/integrations/GdeltIntegration.js');
jest.mock('../../src/integrations/WorldBankIntegration.js');
jest.mock('../../src/integrations/CryptoIntegration.js');
jest.mock('../../src/integrations/open-meteo.mock.js');
jest.mock('../../src/services/usgsService.js');

const GdeltIntegration = require('../../src/integrations/GdeltIntegration.js').default;
const WorldBankIntegration = require('../../src/integrations/WorldBankIntegration.js').default;
const CryptoIntegration = require('../../src/integrations/CryptoIntegration.js').default;
const { fetchRecentTemperature, fetchClimatePrediction } = require('../../src/integrations/open-meteo.mock.js');
const { getSeismicActivity } = require('../../src/services/usgsService.js');

describe('GET /api/demo/live-state resilience', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a full response with mocks when integrations fail', async () => {
    // Make integrations throw
    GdeltIntegration.mockImplementation(() => ({ getSocialEvents: jest.fn().mockRejectedValue(new Error('gdelt down')) }));
    WorldBankIntegration.mockImplementation(() => ({ getKeyEconomicData: jest.fn().mockRejectedValue(new Error('wb down')) }));
    CryptoIntegration.mockImplementation(() => ({ getCryptoData: jest.fn().mockRejectedValue(new Error('crypto down')) }));
    fetchRecentTemperature.mockRejectedValue(new Error('open-meteo down'));
    fetchClimatePrediction.mockRejectedValue(new Error('open-meteo down'));
    getSeismicActivity.mockRejectedValue(new Error('usgs down'));

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

    // When integrations fail, the route should include isMock flags or fallback structures
    expect(res.body.foodSecurity).toBeDefined();
    expect(res.body.foodSecurity.isMock || res.body.foodSecurity.data).toBeDefined();
    expect(res.body.ethicalAssessment).toBeDefined();
    expect(res.body.ethicalAssessment.isMock || res.body.ethicalAssessment.data).toBeDefined();
    expect(res.body.communityResilience).toBeDefined();

    // lastUpdated should be present
    expect(res.body.lastUpdated).toBeDefined();
  }, 20000);
});
