import { analyzeSeismicActivity } from '../../src/agents/GeophysicalRiskAgent.js';

describe('GeophysicalRiskAgent', () => {
  it('should process raw seismic data into a simplified format', () => {
    const rawData = {
      features: [
        {
          id: 'ci39500031',
          properties: {
            mag: 5.2,
            place: '10km NE of Aguanga, CA',
            time: 1672531200000,
            tsunami: 0,
            url: 'http://earthquake.usgs.gov/test',
          },
          geometry: {
            coordinates: [-116.8, 33.5, 10.0],
          },
        },
      ],
    };

    const expected = [
      {
        id: 'ci39500031',
        place: '10km NE of Aguanga, CA',
        magnitude: 5.2,
        depth: 10.0,
        time: 1672531200000,
        url: 'http://earthquake.usgs.gov/test',
        tsunami: { warning: 0 },
      },
    ];

    const result = analyzeSeismicActivity(rawData);
    expect(result).toEqual(expected);
  });

  it('should handle empty or invalid data', () => {
    expect(analyzeSeismicActivity(null)).toEqual([]);
    expect(analyzeSeismicActivity({})).toEqual([]);
    expect(analyzeSeismicActivity({ features: [] })).toEqual([]);
  });
});
