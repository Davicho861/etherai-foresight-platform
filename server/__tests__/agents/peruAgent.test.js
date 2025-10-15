import MetatronAgent from '../../src/agents.js';
import fs from 'fs';

// Mock fs
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  writeFileSync: jest.fn()
}));

describe('PeruAgent', () => {
  let agent;

  beforeEach(() => {
    jest.clearAllMocks();
    agent = new MetatronAgent('PeruAgent');
  });

  it('should analyze Peru mission data and generate report', async () => {
    const mockMissionData = {
      title: 'Misión Perú - Cadena de Suministro Cobre',
      objectives: ['Analizar riesgos en cadena de suministro']
    };

    fs.readFileSync.mockReturnValue(JSON.stringify(mockMissionData));

    const result = await agent.run({});

    expect(result).toHaveProperty('reportPath');
    expect(result).toHaveProperty('totalRisk');
    expect(result).toHaveProperty('analysis');

    expect(result.reportPath).toBe('PERU_INTELLIGENCE_REPORT.md');
    expect(typeof result.totalRisk).toBe('number');
    expect(result.totalRisk).toBeGreaterThanOrEqual(0);
    expect(result.totalRisk).toBeLessThanOrEqual(100);

    expect(fs.readFileSync).toHaveBeenCalledWith(
      'public/missions/america/peru/mision_peru.json',
      'utf8'
    );
    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'PERU_INTELLIGENCE_REPORT.md',
      expect.stringContaining('# PERU INTELLIGENCE REPORT')
    );

    const reportContent = fs.writeFileSync.mock.calls[0][1];
    expect(reportContent).toContain('Cadena de Suministro de Cobre');
    expect(reportContent).toContain('Generado por PeruAgent');
  });

  it('should calculate risk based on mission analysis', async () => {
    const mockMissionData = {
      title: 'Test Mission',
      objectives: []
    };

    fs.readFileSync.mockReturnValue(JSON.stringify(mockMissionData));

    // Mock Math.random to return predictable values
    const originalRandom = Math.random;
    Math.random = jest.fn()
      .mockReturnValueOnce(0.5) // unionNegotiations risk
      .mockReturnValueOnce(0.3) // localNews events
      .mockReturnValueOnce(0.1); // historical strikes risk

    const result = await agent.run({});

    // totalRisk = (0.5 * 0.6) + (0.3 * 0.3) + (0.1 * 0.1) = 0.3 + 0.09 + 0.01 = 0.4
    expect(result.totalRisk).toBeCloseTo(40);

    expect(result.analysis.unionNegotiations.risk).toBe(0.5);
    expect(result.analysis.localNews.risk).toBe(0.3);
    expect(result.analysis.historicalStrikes.risk).toBe(0.1);

    // Restore Math.random
    Math.random = originalRandom;
  });

  it('should handle file read errors', async () => {
    fs.readFileSync.mockImplementation(() => {
      throw new Error('File not found');
    });

    await expect(agent.run({})).rejects.toThrow('File not found');
  });

  it('should include analysis details in result', async () => {
    const mockMissionData = { title: 'Test' };
    fs.readFileSync.mockReturnValue(JSON.stringify(mockMissionData));

    // Mock random for consistent results
    const originalRandom = Math.random;
    Math.random = jest.fn()
      .mockReturnValue(0.5);

    const result = await agent.run({});

    expect(result.analysis).toHaveProperty('unionNegotiations');
    expect(result.analysis).toHaveProperty('localNews');
    expect(result.analysis).toHaveProperty('historicalStrikes');

    expect(result.analysis.unionNegotiations).toHaveProperty('status');
    expect(result.analysis.unionNegotiations).toHaveProperty('risk');
    expect(result.analysis.unionNegotiations).toHaveProperty('details');

    expect(result.analysis.localNews).toHaveProperty('regions');
    expect(result.analysis.localNews).toHaveProperty('events');
    expect(result.analysis.localNews).toHaveProperty('risk');

    expect(result.analysis.historicalStrikes).toHaveProperty('averageDuration');
    expect(result.analysis.historicalStrikes).toHaveProperty('frequency');
    expect(result.analysis.historicalStrikes).toHaveProperty('risk');

    Math.random = originalRandom;
  });
});