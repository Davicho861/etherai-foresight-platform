import request from 'supertest';
import express from 'express';
import globalRiskRouter from '../../src/routes/globalRiskRoutes.js';
import { getFoodSecurityIndex } from '../../src/services/worldBankService.js';

// Mock the service layer
jest.mock('../../src/services/worldBankService.js');

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
