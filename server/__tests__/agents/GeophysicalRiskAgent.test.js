import { analyzeSeismicActivity, predictGeophysicalRisk } from '../../src/agents/GeophysicalRiskAgent.js';

describe('GeophysicalRiskAgent', () => {
  it('should process raw seismic data into a simplified format with risk scores', () => {
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

    const result = analyzeSeismicActivity(rawData);
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: 'ci39500031',
      place: '10km NE of Aguanga, CA',
      magnitude: 5.2,
      depth: 10.0,
      time: 1672531200000,
      url: 'http://earthquake.usgs.gov/test',
      tsunami: { warning: 0 },
    });
    expect(result[0].riskScore).toBeDefined();
    expect(typeof result[0].riskScore).toBe('number');
  });

  it('should calculate risk score for LATAM event', () => {
    const rawData = {
      features: [
        {
          id: 'test1',
          properties: {
            mag: 6.0,
            place: '100km S of Lima, Peru',
            time: 1672531200000,
            tsunami: 1,
            url: 'http://earthquake.usgs.gov/test',
          },
          geometry: {
            coordinates: [-76.5, -12.0, 5.0],
          },
        },
      ],
    };

    const result = analyzeSeismicActivity(rawData);
    expect(result[0].riskScore).toBeGreaterThan(50); // High risk due to mag, depth, LATAM, tsunami
  });

  it('should handle empty or invalid data', () => {
    expect(analyzeSeismicActivity(null)).toEqual([]);
    expect(analyzeSeismicActivity({})).toEqual([]);
    expect(analyzeSeismicActivity({ features: [] })).toEqual([]);
  });

  describe('predictGeophysicalRisk', () => {
    it('should predict risk for multiple events', () => {
      const events = [
        { magnitude: 5.5, depth: 10, place: 'Peru', riskScore: 60 },
        { magnitude: 4.2, depth: 20, place: 'Chile', riskScore: 40 },
      ];

      const prediction = predictGeophysicalRisk(events);
      expect(prediction.overallRisk).toBeGreaterThan(0);
      expect(prediction.eventCount).toBe(2);
      expect(prediction.maxMagnitude).toBe(5.5);
      expect(prediction.highRiskZones).toContain('Peru');
    });

    it('should handle no events', () => {
      const prediction = predictGeophysicalRisk([]);
      expect(prediction.overallRisk).toBe(0);
      expect(prediction.eventCount).toBe(0);
      expect(prediction.maxMagnitude).toBe(0);
      expect(prediction.highRiskZones).toEqual([]);
    });
  });
});
