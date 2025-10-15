// Small, focused tests for LogosKernel

// Mock external modules before importing the orchestrator
jest.mock('../src/agents.js', () => {
  return jest.fn().mockImplementation(function(name) {
    this.name = name;
    this.run = jest.fn(async (payload) => {
      // Return different shapes depending on agent name
      if (name === 'EthicsCouncil') return { approved: true };
      if (name === 'Oracle') return { summary: 'pre-mortem summary', optimalProtocol: 'proto-x' };
      if (name === 'Socrates') return { summary: 'wisdom' };
      if (name === 'PlanningCrew') return { alternativeRealities: [] };
      if (name === 'DevelopmentCrew') return { implemented: true };
      if (name === 'QualityCrew') return { ok: true };
      if (name === 'DeploymentCrew') return { deployed: true };
      if (name === 'ConsensusAgent') return { canCommit: true, message: 'ok' };
      if (name === 'DataAcquisitionAgent') return {}; // used in prophecy flows if called
      // default
      return { ok: true };
    });
  });
});

jest.mock('../src/database.js', () => ({
  getChromaClient: jest.fn(() => ({ upsertLog: jest.fn().mockResolvedValue(true) })),
  getNeo4jDriver: jest.fn().mockResolvedValue({ session: () => ({ run: jest.fn().mockResolvedValue(true), close: () => {} }) }),
}));

jest.mock('../src/eventHub.js', () => ({ publish: jest.fn() }));

const { LogosKernel } = require('../src/orchestrator.js');

describe('LogosKernel (small)', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    process.env.NATIVE_DEV_MODE = 'true';
  });

  test('allocateResources and releaseResources manage token usage', async () => {
    const kernel = new LogosKernel();
    kernel.resourceStats.tokenUsage = 0;
    kernel.resourceStats.maxTokens = 1000;

    const task = { estimatedTokens: 100 };
    const ok = kernel.allocateResources(task);
    expect(ok).toBe(true);
    expect(kernel.resourceStats.tokenUsage).toBe(100);

    kernel.releaseResources(task);
    expect(kernel.resourceStats.tokenUsage).toBe(0);
  });

  test('scheduleTask orders by priority and executeNextTask runs the highest priority', async () => {
    const kernel = new LogosKernel();
    kernel.resourceStats.maxTokens = 1000;
    kernel.resourceStats.tokenUsage = 0;

    const taskA = { estimatedTokens: 10, execute: jest.fn().mockResolvedValue('A') };
    const taskB = { estimatedTokens: 10, execute: jest.fn().mockResolvedValue('B') };

    kernel.scheduleTask(taskB, 'low');
    kernel.scheduleTask(taskA, 'high');

    // first execute should run taskA
    const res = await kernel.executeNextTask();
    expect(res).toBe('A');

    // then taskB
    const res2 = await kernel.executeNextTask();
    expect(res2).toBe('B');
  });

  test('startMission happy path completes and stores mission result', async () => {
    // Ensure we use the mocked MetatronAgent defined at top
    const kernel = new LogosKernel();
    kernel.resourceStats.maxTokens = 100000;
    kernel.resourceStats.tokenUsage = 0;

    // avoid writing manifest to disk
    kernel.generateSovereigntyManifest = jest.fn().mockResolvedValue(undefined);

    const missionId = 'm-123';
    const missionContract = { id: 'simple-mission' };
    const logCb = jest.fn();

    await kernel.startMission(missionId, missionContract, logCb);

    const entry = kernel.getMissionLogs(missionId);
    expect(entry.status).toBe('completed');
    expect(Array.isArray(entry.logs)).toBe(true);
    // Expect some logs were pushed via the log callback
    expect(logCb.mock.calls.length).toBeGreaterThan(0);
  }, 20000);
});
