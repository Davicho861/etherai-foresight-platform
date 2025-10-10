const axios = require('axios');

jest.mock('axios');

describe('getSeismicData retries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('retries on failure up to USGS_RETRY_ATTEMPTS', async () => {
    // Arrange: axios.get rejects
    axios.get.mockRejectedValue(new Error('network down'));

    process.env.USGS_RETRY_ATTEMPTS = '3';
    process.env.USGS_RETRY_BASE_DELAY_MS = '1';

    // Import module dynamically to ensure env vars are applied
    const { getSeismicData } = await import('../src/services/SeismicIntegration.js');

    // Act & Assert
    await expect(getSeismicData()).rejects.toThrow('Failed to fetch seismic data.');
    expect(axios.get).toHaveBeenCalledTimes(3);
  });
});
