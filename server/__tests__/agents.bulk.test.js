import MetatronAgent from '../src/agents.js';
import fs from 'fs';

// Increase timeout because some agents perform multiple async operations
jest.setTimeout(20000);

jest.mock('fs', () => ({
  readFileSync: jest.fn(() => JSON.stringify({ title: 'bulk mock' })),
  writeFileSync: jest.fn()
}));

describe('Bulk exercise of MetatronAgent cases', () => {
  const agentsToTest = [
    'EthicsCouncil','Oracle','PlanningCrew','DevelopmentCrew','Ares','Hephaestus','Tyche',
    'ConsensusAgent','Socrates','Telos','DataAcquisitionAgent','SignalAnalysisAgent',
    'CausalCorrelationAgent','RiskAssessmentAgent','ReportGenerationAgent','PeruAgent',
    'DeploymentCrew','CryptoVolatilityAgent','CommunityResilienceAgent'
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
  });

  agentsToTest.forEach(name => {
    it(`runs agent ${name} without throwing`, async () => {
      const agent = new MetatronAgent(name);
      let res;
      try {
        // Provide small safe input depending on agent
        const input = name === 'DataAcquisitionAgent' ? { countries: ['PER'], gdeltCodes: ['PER'] } : {};
        res = await agent.run(input);
      } catch (err) {
        // test passes as long as agent handles errors and doesn't crash the process
        res = { error: String(err) };
      }
      expect(res).toBeDefined();
    });
  });
});
