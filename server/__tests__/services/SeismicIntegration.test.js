import axios from 'axios';
import { getSeismicData } from '../../src/services/SeismicIntegration.js';

// Mock axios
jest.mock('axios');

describe('SeismicIntegration Service', () => {
  it('should fetch seismic data successfully', async () => {
    const mockData = { features: [{ id: 'test1' }] };
    axios.get.mockResolvedValue({ data: mockData });

    const data = await getSeismicData();

    expect(axios.get).toHaveBeenCalledWith('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_day.geojson');
    expect(data).toEqual(mockData);
  });

  it('should throw an error if the API call fails', async () => {
    axios.get.mockRejectedValue(new Error('Network Error'));

    await expect(getSeismicData()).rejects.toThrow('Failed to fetch seismic data.');
  });
});
