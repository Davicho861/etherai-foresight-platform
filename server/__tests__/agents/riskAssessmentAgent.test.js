import MetatronAgent from '../../src/agents.js';

describe('RiskAssessmentAgent', () => {
  let agent;

  beforeEach(() => {
    agent = new MetatronAgent('RiskAssessmentAgent');
  });

  it('should calculate risk scores from correlations', async () => {
    const input = {
      correlations: {
        COL: {
          weatherToSocial: 0.8,
          economicToSocial: 0.9,
          debtToSocial: 0.7
        },
        PER: {
          weatherToSocial: 0.1,
          economicToSocial: 0.2,
          debtToSocial: 0.3
        },
        ARG: {
          weatherToSocial: 0.5,
          economicToSocial: 0.6,
          debtToSocial: 0.4
        }
      }
    };

    const result = await agent.run(input);

    expect(result).toHaveProperty('COL');
    expect(result).toHaveProperty('PER');
    expect(result).toHaveProperty('ARG');

    // Risk = (weatherToSocial + economicToSocial + debtToSocial) / 3 * 100
    expect(result.COL).toBeCloseTo(80); // (0.8 + 0.9 + 0.7) / 3 * 100 = 80
    expect(result.PER).toBeCloseTo(20); // (0.1 + 0.2 + 0.3) / 3 * 100 = 20
    expect(result.ARG).toBeCloseTo(50); // (0.5 + 0.6 + 0.4) / 3 * 100 = 50
  });

  it('should handle zero correlations', async () => {
    const input = {
      correlations: {
        COL: {
          weatherToSocial: 0,
          economicToSocial: 0,
          debtToSocial: 0
        }
      }
    };

    const result = await agent.run(input);

    expect(result.COL).toBe(0);
  });

  it('should handle maximum correlations', async () => {
    const input = {
      correlations: {
        COL: {
          weatherToSocial: 1,
          economicToSocial: 1,
          debtToSocial: 1
        }
      }
    };

    const result = await agent.run(input);

    expect(result.COL).toBe(100);
  });

  it('should handle partial correlations', async () => {
    const input = {
      correlations: {
        COL: {
          weatherToSocial: 0.5,
          economicToSocial: 0.3,
          debtToSocial: 0.8
        }
      }
    };

    const result = await agent.run(input);

    expect(result.COL).toBeCloseTo(53.33); // (0.5 + 0.3 + 0.8) / 3 * 100 ≈ 53.33
  });
});