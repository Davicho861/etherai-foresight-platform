import request from 'supertest';
import express from 'express';
import globalRiskRouter from '../../src/routes/globalRiskRoutes.js';
import { getFoodSecurityIndex } from '../../src/services/worldBankService.js';
import { getClimateExtremesIndex } from '../../src/services/climateService.js';

// Mock the service layer
jest.mock('../../src/services/worldBankService.js');
jest.mock('../../src/services/climateService.js');

const app = express();
app.use(express.json());
app.use('/api/global-risk', globalRiskRouter);

describe('GET /api/global-risk/food-security', () => {
  it('should return a 200 OK status and the food security data for LATAM countries', async () => {
    const mockData = {
      countries: ['COL', 'PER', 'ARG'],
      year: 2024,
      source: "World Bank API - SN.ITK.DEFC.ZS",
      data: {
        COL: { value: 5.2, year: '2024', country: 'Colombia' },
        PER: { value: 7.1, year: '2024', country: 'Peru' },
        ARG: { value: 4.8, year: '2024', country: 'Argentina' }
      },
      globalAverage: 5.7
    };

    getFoodSecurityIndex.mockResolvedValue(mockData);

    const response = await request(app).get('/api/global-risk/food-security');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.source).toBe('Praevisio-Aion-Simulated-WorldBank');
    expect(response.body.data).toEqual(mockData);
    expect(getFoodSecurityIndex).toHaveBeenCalledTimes(1);
  });

  it('should handle errors and return a 500 status', async () => {
    const errorMessage = 'Failed to fetch data';
    getFoodSecurityIndex.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/api/global-risk/food-security');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Could not retrieve food security data.');
  });
});

describe('GET /api/global-risk/climate-extremes', () => {
  it('should return a 200 OK status and the climate extremes data for LATAM countries', async () => {
    const mockData = [
      {
        country: 'Colombia',
        countryCode: 'COL',
        avgMaxTemp: 28.5,
        avgMinTemp: 18.2,
        totalPrecipitation: 150.3,
        avgHumidity: 75.2,
        extremeEvents: 3,
        riskLevel: 'medium',
        period: 'Last 30 days',
        timestamp: '2025-10-10T18:00:00.000Z'
      },
      {
        country: 'Peru',
        countryCode: 'PER',
        avgMaxTemp: 25.8,
        avgMinTemp: 15.6,
        totalPrecipitation: 85.7,
        avgHumidity: 68.9,
        extremeEvents: 2,
        riskLevel: 'low',
        period: 'Last 30 days',
        timestamp: '2025-10-10T18:00:00.000Z'
      }
    ];

    getClimateExtremesIndex.mockResolvedValue(mockData);

    const response = await request(app).get('/api/global-risk/climate-extremes');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.source).toBe('Praevisio-Aion-NASA-POWER-Integration');
    expect(response.body.data).toEqual(mockData);
    expect(getClimateExtremesIndex).toHaveBeenCalledTimes(1);
  });

  it('should handle errors and return a 500 status', async () => {
    const errorMessage = 'Failed to fetch climate data';
    getClimateExtremesIndex.mockRejectedValue(new Error(errorMessage));

    const response = await request(app).get('/api/global-risk/climate-extremes');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toContain('Could not retrieve climate extremes data.');
  });
});
