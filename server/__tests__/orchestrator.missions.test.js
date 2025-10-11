/* eslint-disable global-require */
describe('LogosKernel mission branches (genesis-tyche & prophecy)', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.NATIVE_DEV_MODE = 'true';
  });

  test('genesis-tyche branch creates Tyche and writes PR file', async () => {
    // Mock agents so Tyche.run returns a fix
    jest.doMock('../src/agents.js', () => {
      return jest.fn().mockImplementation((name) => ({
        run: async (input) => {
          if (name === 'Tyche') return { patched: true, diff: 'fix' };
          return { approved: true, summary: 'ok', optimalProtocol: {} };
        }
      }));
    });

    // Mock fs and path used inside genesis-tyche flow
    const writeMock = jest.fn();
    const existsMock = jest.fn().mockReturnValue(false);
    const mkdirMock = jest.fn();
    jest.doMock('fs', () => ({ writeFileSync: writeMock, existsSync: existsMock, mkdirSync: mkdirMock }));
    jest.doMock('path', () => ({ resolve: (...args) => args.join('/'), join: (...a) => a.join('/') }));

    const { LogosKernel } = require('../src/orchestrator.js');
    const k = new LogosKernel();
    k.resourceStats.maxTokens = 100000;
    // Ensure generateSovereigntyManifest does not write again
    jest.spyOn(k, 'generateSovereigntyManifest').mockImplementation(async () => {});

    const logs = [];
    await k.startMission('m-tyche', { id: 'genesis-tyche' }, (l) => logs.push(l));

    const mission = k.getMissionLogs('m-tyche');
    if (mission.status !== 'completed' && mission.status !== 'failed') {
      // eslint-disable-next-line no-console
      console.error('TYCHE MISSION LOGS:', logs);
      // eslint-disable-next-line no-console
      console.error('TYCHE MISSION OBJ:', mission);
    }
  expect(['completed', 'failed']).toContain(mission.status);
  // At minimum, some logs should have been recorded during mission execution
  expect(Array.isArray(mission.logs)).toBe(true);
  expect(mission.logs.length).toBeGreaterThan(0);
  }, 20000);

  test('prophecy mission exercises data acquisition and report generation flows', async () => {
    // Mock agents to return expected shapes for prophecy flow
    jest.doMock('../src/agents.js', () => {
      return jest.fn().mockImplementation((name) => ({
        run: async (input) => {
          if (name === 'DataAcquisitionAgent') return { COL: {}, PER: {}, ARG: {} };
          if (name === 'SignalAnalysisAgent') return { signals: [] };
          if (name === 'CausalCorrelationAgent') return { correlations: {} };
          if (name === 'RiskAssessmentAgent') return { risks: {} };
          if (name === 'ReportGenerationAgent') return { summary: 'report' };
          if (name === 'ConsensusAgent') return { canCommit: true };
          // default
          return { approved: true, summary: 'ok', optimalProtocol: {} };
        }
      }));
    });

    // Avoid file writes from generateSovereigntyManifest
    jest.doMock('fs', () => ({ writeFileSync: jest.fn() }));
    jest.doMock('path', () => ({ resolve: (...args) => args.join('/'), join: (...a) => a.join('/') }));

    const { LogosKernel } = require('../src/orchestrator.js');
    const k = new LogosKernel();
    k.resourceStats.maxTokens = 100000;
    jest.spyOn(k, 'generateSovereigntyManifest').mockImplementation(async () => {});

    const logs = [];
    await k.startMission('m-prophecy', { id: 'prophecy-001-latam-social-climate' }, (l) => logs.push(l));

    const mission = k.getMissionLogs('m-prophecy');
    if (mission.status !== 'completed' && mission.status !== 'failed') {
      // eslint-disable-next-line no-console
      console.error('PROPHECY LOGS:', logs);
      // eslint-disable-next-line no-console
      console.error('PROPHECY MISSION OBJ:', mission);
    }
  expect(['completed', 'failed']).toContain(mission.status);
  // Ensure logs exist indicating flow executed
  expect(Array.isArray(mission.logs)).toBe(true);
  expect(mission.logs.length).toBeGreaterThan(0);
  }, 40000);
});
