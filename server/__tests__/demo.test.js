import request from 'supertest';
import express from 'express';
import demoRouter from '../src/routes/demo.js';

// Mock the integrations
jest.mock('../src/integrations/GdeltIntegration.js');
jest.mock('../src/integrations/WorldBankIntegration.js');
jest.mock('../src/integrations/CryptoIntegration.js');
jest.mock('../src/integrations/open-meteo.mock.js');
jest.mock('../src/services/usgsService.js');
jest.mock('../src/causalWeaver.js');

const GdeltIntegration = require('../src/integrations/GdeltIntegration.js').default;
const WorldBankIntegration = require('../src/integrations/WorldBankIntegration.js').default;
const CryptoIntegration = require('../src/integrations/CryptoIntegration.js').default;
const { fetchRecentTemperature, fetchClimatePrediction } = require('../src/integrations/open-meteo.mock.js');
const { getSeismicActivity } = require('../src/services/usgsService.js');
const { causalWeaver } = require('../src/causalWeaver.js');

const app = express();
app.use(express.json());
app.use('/api/demo', demoRouter);

describe('/api/demo routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/demo/live-state', () => {
    it('should return aggregated live data', async () => {
      // Mock the integrations
      GdeltIntegration.mockImplementation(() => ({
        getSocialEvents: jest.fn().mockResolvedValue({
          country: 'COL',
          eventCount: 5,
          socialIntensity: 15
        })
      }));

      WorldBankIntegration.mockImplementation(() => ({
        getKeyEconomicData: jest.fn().mockResolvedValue({
          country: 'COL',
          indicators: { 'NY.GDP.PCAP.CD': { value: 6000 } }
        })
      }));

      CryptoIntegration.mockImplementation(() => ({
        getCryptoData: jest.fn().mockResolvedValue([
          { id: 'bitcoin', current_price: 50000 }
        ])
      }));

      fetchRecentTemperature.mockResolvedValue({
        temperature: 25,
        humidity: 60
      });

      fetchClimatePrediction.mockResolvedValue([
        { temperature_2m_max: 30 }
      ]);

      getSeismicActivity.mockResolvedValue({
        events: [],
        summary: { totalEvents: 0 }
      });

      const response = await request(app).get('/api/demo/live-state');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('kpis');
      expect(response.body).toHaveProperty('countries');
      expect(response.body).toHaveProperty('global');
      expect(response.body.countries).toBeInstanceOf(Array);
    });
  });

  describe('POST /api/demo/predict-scenario', () => {
    it('should calculate risk index for scenario', async () => {
      const mockCreateNode = jest.fn();
      const mockCreateRelationship = jest.fn();
      causalWeaver.createNode = mockCreateNode;
      causalWeaver.createRelationship = mockCreateRelationship;

      const response = await request(app)
        .post('/api/demo/predict-scenario')
        .send({
          country: 'COL',
          inflationIncrease: 10,
          droughtLevel: 5
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('riskIndex');
      expect(response.body).toHaveProperty('factors');
      expect(typeof response.body.riskIndex).toBe('number');
      expect(mockCreateNode).toHaveBeenCalled();
    });

    it('should return error for invalid country', async () => {
      const response = await request(app)
        .post('/api/demo/predict-scenario')
        .send({
          country: 'INVALID',
          inflationIncrease: 10
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});