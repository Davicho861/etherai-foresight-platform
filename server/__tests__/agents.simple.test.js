import MetatronAgent from '../src/agents.js';

describe('Simple agents tests', () => {
  it('SignalAnalysisAgent processes signals', async () => {
    const agent = new MetatronAgent('SignalAnalysisAgent');
    const data = {
      PER: { climate: { temperature: 40, precipitation: 10 }, economic: { inflation: 5, unemployment: 3 }, debt: { debtData: [{year: '2024', value: 30}] }, social: { eventCount: 2 } }
    };
    const result = await agent.run({ data });
    expect(result.PER).toBeDefined();
    expect(result.PER).toHaveProperty('extremeWeather');
  });

  it('RiskAssessmentAgent computes risk percentages', async () => {
    const agent = new MetatronAgent('RiskAssessmentAgent');
    const correlations = { PER: { weatherToSocial: 0.5, economicToSocial: 0.3, debtToSocial: 0.2 } };
    const risks = await agent.run({ correlations });
    expect(risks.PER).toBeGreaterThanOrEqual(0);
    expect(risks.PER).toBeLessThanOrEqual(100);
  });
});
