import { server } from '../mocks/server.js';
import { getSeismicActivity } from '../../src/services/usgsService.js';
import { getSeismicData } from '../../src/services/SeismicIntegration.js';

// Mock the SeismicIntegration
jest.mock('../../src/services/SeismicIntegration.js');

describe('USGS Service', () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getSeismicActivity', () => {
    it('should return transformed seismic data successfully', async () => {
      const mockRawData = {
        features: [
          {
            id: 'test1',
            properties: {
              mag: 6.5,
              place: 'Test Location',
              time: 1638360000000,
              tsunami: 0,
              sig: 100,
              url: 'https://example.com'
            },
            geometry: {
              coordinates: [-120.0, 35.0, 10.0]
            }
          }
        ]
      };

      getSeismicData.mockResolvedValue(mockRawData);

      const result = await getSeismicActivity();

      expect(result).toHaveProperty('events');
      expect(result).toHaveProperty('summary');
      expect(result.events).toHaveLength(1);
      expect(result.events[0]).toMatchObject({
        id: 'test1',
        magnitude: 6.5,
        place: 'Test Location',
        time: 1638360000000,
        tsunami: 0,
        significance: 100,
        url: 'https://example.com',
        coordinates: [-120.0, 35.0, 10.0]
      });
      expect(result.summary).toMatchObject({
        totalEvents: 1,
        maxMagnitude: 6.5,
        source: 'USGS Earthquake Hazards Program'
      });
    });

    it('should handle empty seismic data', async () => {
      const mockRawData = { features: [] };
      getSeismicData.mockResolvedValue(mockRawData);

      const result = await getSeismicActivity();

      expect(result.events).toEqual([]);
      expect(result.summary).toMatchObject({
        totalEvents: 0,
        maxMagnitude: 0,
        source: 'USGS Earthquake Hazards Program'
      });
    });

    it('should handle integration errors gracefully', async () => {
      getSeismicData.mockRejectedValue(new Error('Network error'));

      const result = await getSeismicActivity();

      expect(result).toHaveProperty('error');
      expect(result.error).toBe('Network error');
      expect(result.events).toEqual([]);
    });

    it('should handle invalid data structure', async () => {
      getSeismicData.mockResolvedValue(null);

      const result = await getSeismicActivity();

      expect(result.events).toEqual([]);
      expect(result.summary.totalEvents).toBe(0);
    });
  });
});