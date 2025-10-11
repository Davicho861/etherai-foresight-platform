import MetatronAgent from '../../src/agents.js';

// Mock the database module
jest.mock('../../src/database.js', () => ({
  getNeo4jDriver: jest.fn()
}));

describe('CausalCorrelationAgent', () => {
  let agent;
  let mockSession;
  let mockDriver;

  beforeEach(() => {
    // Mock Neo4j driver and session
    mockSession = {
      run: jest.fn().mockResolvedValue({}),
      close: jest.fn()
    };
    mockDriver = {
      session: jest.fn().mockReturnValue(mockSession)
    };

    // Mock the getNeo4jDriver function
    const db = require('../../src/database.js');
    db.getNeo4jDriver.mockReturnValue(mockDriver);

    agent = new MetatronAgent('CausalCorrelationAgent');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate correlations and persist to Neo4j', async () => {
    const input = {
      signals: {
        COL: {
          extremeWeather: true,
          economicStress: true,
          debtStress: false,
          socialUnrest: true
        },
        PER: {
          extremeWeather: false,
          economicStress: false,
          debtStress: true,
          socialUnrest: false
        }
      }
    };

    const result = await agent.run(input);

    expect(result).toHaveProperty('COL');
    expect(result).toHaveProperty('PER');

    // Check correlations for COL
    expect(result.COL.weatherToSocial).toBe(0.8); // extremeWeather && socialUnrest
    expect(result.COL.economicToSocial).toBe(0.9); // economicStress && socialUnrest
    expect(result.COL.debtToSocial).toBe(0.1); // !debtStress
    expect(result.COL.weatherToEconomic).toBe(0.6); // extremeWeather && economicStress
    expect(result.COL.debtToEconomic).toBe(0.1); // !debtStress

    // Check Neo4j calls
    expect(mockDriver.session).toHaveBeenCalled();
    expect(mockSession.run).toHaveBeenCalledTimes(2); // Once for each country
    expect(mockSession.close).toHaveBeenCalledTimes(1);

    // Verify the Cypher query structure
    const calls = mockSession.run.mock.calls;
    expect(calls[0][0]).toContain('MERGE (c:Country {code: $country})');
    expect(calls[0][0]).toContain('MERGE (w)-[:CAUSES {strength: $ws}]->(s)');
    expect(calls[0][1]).toEqual({
      country: 'COL',
      ws: 0.8,
      es: 0.9,
      ds: 0.1,
      we: 0.6,
      de: 0.1
    });
  });

  it('should handle Neo4j errors gracefully', async () => {
    mockSession.run.mockRejectedValue(new Error('Neo4j connection failed'));

    const input = {
      signals: {
        COL: {
          extremeWeather: false,
          economicStress: false,
          debtStress: false,
          socialUnrest: false
        }
      }
    };

    // Should not throw, just log error
    const result = await agent.run(input);

    expect(result).toHaveProperty('COL');
    expect(mockSession.close).toHaveBeenCalled();
  });

  it('should skip Neo4j operations in native dev mode', async () => {
    // Mock process.env
    const originalEnv = process.env.NATIVE_DEV_MODE;
    process.env.NATIVE_DEV_MODE = 'true';

    const input = {
      signals: {
        COL: {
          extremeWeather: true,
          economicStress: true,
          debtStress: true,
          socialUnrest: true
        }
      }
    };

    const result = await agent.run(input);

    expect(result).toHaveProperty('COL');
    expect(mockDriver.session).not.toHaveBeenCalled();

    // Restore
    process.env.NATIVE_DEV_MODE = originalEnv;
  });
});