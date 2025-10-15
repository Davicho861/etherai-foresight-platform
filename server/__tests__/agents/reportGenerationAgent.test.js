import MetatronAgent from '../../src/agents.js';
import fs from 'fs';

// Mock fs
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  readFileSync: jest.fn()
}));

describe('ReportGenerationAgent', () => {
  let agent;

  beforeEach(() => {
    jest.clearAllMocks();
    agent = new MetatronAgent('ReportGenerationAgent');
  });

  it('should generate intelligence report', async () => {
    const input = {
      risks: {
        COL: 75,
        PER: 45,
        ARG: 60
      },
      correlations: {
        COL: {
          weatherToSocial: 0.8,
          economicToSocial: 0.9,
          debtToSocial: 0.7,
          weatherToEconomic: 0.6,
          debtToEconomic: 0.5
        },
        PER: {
          weatherToSocial: 0.2,
          economicToSocial: 0.3,
          debtToSocial: 0.4,
          weatherToEconomic: 0.1,
          debtToEconomic: 0.2
        },
        ARG: {
          weatherToSocial: 0.5,
          economicToSocial: 0.6,
          debtToSocial: 0.4,
          weatherToEconomic: 0.3,
          debtToEconomic: 0.4
        }
      }
    };

    const result = await agent.run(input);

    expect(result).toEqual({
      reportPath: 'INTELLIGENCE_REPORT_001.md',
      summary: 'Informe generado exitosamente.'
    });

    expect(fs.writeFileSync).toHaveBeenCalledWith(
      'INTELLIGENCE_REPORT_001.md',
      expect.stringContaining('# INTELLIGENCE_REPORT_001.md')
    );

    const reportContent = fs.writeFileSync.mock.calls[0][1];
    expect(reportContent).toContain('COL: 75.0%');
    expect(reportContent).toContain('PER: 45.0%');
    expect(reportContent).toContain('ARG: 60.0%');
    expect(reportContent).toContain('Clima->Social: 0.8');
    expect(reportContent).toContain('Generado por Praevisio AI');
  });

  it('should handle empty risks and correlations', async () => {
    const input = {
      risks: {},
      correlations: {}
    };

    const result = await agent.run(input);

    expect(result.reportPath).toBe('INTELLIGENCE_REPORT_001.md');
    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  it('should include causal analysis in report', async () => {
    const input = {
      risks: { COL: 100 },
      correlations: {
        COL: {
          weatherToSocial: 1,
          economicToSocial: 1,
          debtToSocial: 1,
          weatherToEconomic: 1,
          debtToEconomic: 1
        }
      }
    };

    await agent.run(input);

    const reportContent = fs.writeFileSync.mock.calls[0][1];
    expect(reportContent).toContain('Clima->Social: 1');
    expect(reportContent).toContain('Economía->Social: 1');
    expect(reportContent).toContain('Deuda->Social: 1');
    expect(reportContent).toContain('Clima->Economía: 1');
    expect(reportContent).toContain('Deuda->Economía: 1');
  });
});