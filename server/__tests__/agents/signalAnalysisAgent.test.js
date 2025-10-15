import MetatronAgent from '../../src/agents.js';

describe('SignalAnalysisAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new MetatronAgent('SignalAnalysisAgent');
  });

  it('should analyze signals from data', async () => {
    const input = {
      data: {
        COL: {
          climate: { temperature: 35, precipitation: 150 },
          economic: { inflation: 15, unemployment: 15 },
          debt: { debtData: [{ value: 90 }] },
          social: { eventCount: 8 }
        },
        PER: {
          climate: { temperature: 20, precipitation: 30 },
          economic: { inflation: 5, unemployment: 5 },
          debt: { debtData: [{ value: 45 }] },
          social: { eventCount: 2 }
        }
      }
    };

    const result = await agent.run(input);

    expect(result).toHaveProperty('COL');
    expect(result).toHaveProperty('PER');

    // Check extreme weather signal
    expect(result.COL.extremeWeather).toBe(true); // temp >30 and precip >100
    expect(result.PER.extremeWeather).toBe(false);

    // Check economic stress
    expect(result.COL.economicStress).toBe(true); // inflation >10 or unemployment >10
    expect(result.PER.economicStress).toBe(false);

    // Check debt stress
    expect(result.COL.debtStress).toBe(true); // debt >50
    expect(result.PER.debtStress).toBe(false);

    // Check social unrest
    expect(result.COL.socialUnrest).toBe(true); // eventCount >5
    expect(result.PER.socialUnrest).toBe(false);
  });

  it('should handle missing or empty debt data', async () => {
    const input = {
      data: {
        COL: {
          climate: { temperature: 25, precipitation: 50 },
          economic: { inflation: 5, unemployment: 5 },
          debt: { debtData: [] }, // Empty debt data
          social: { eventCount: 3 }
        }
      }
    };

    const result = await agent.run(input);

    expect(result.COL.debtStress).toBe(false); // No debt data, so false
  });

  it('should handle edge cases in signal thresholds', async () => {
    const input = {
      data: {
        COL: {
          climate: { temperature: 30, precipitation: 100 }, // Exactly at threshold
          economic: { inflation: 10, unemployment: 10 }, // Exactly at threshold
          debt: { debtData: [{ value: 50 }] }, // Exactly at threshold
          social: { eventCount: 5 } // Exactly at threshold
        }
      }
    };

    const result = await agent.run(input);

    // Thresholds are > for true, so these should be false
    expect(result.COL.extremeWeather).toBe(false); // temp=30 not >30, precip=100 not >100
    expect(result.COL.economicStress).toBe(false); // inflation=10 not >10, unemployment=10 not >10
    expect(result.COL.debtStress).toBe(false); // debt=50 not >50
    expect(result.COL.socialUnrest).toBe(false); // eventCount=5 not >5
  });
});