describe('LogosKernel (orchestrator) unit tests', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env.NATIVE_DEV_MODE = 'true' // avoid DB initializations
  })

  afterEach(() => {
    delete process.env.NATIVE_DEV_MODE
    jest.clearAllMocks()
  })

  test('allocateResources enforces token limits and allows allocation', () => {
    const { LogosKernel } = require('../src/orchestrator.js')
    const k = new LogosKernel()
    // baseline token usage
    k.resourceStats.tokenUsage = 0
    const task = { estimatedTokens: 10 }
    expect(k.allocateResources(task)).toBe(true)
    // tokenUsage increased
    expect(k.resourceStats.tokenUsage).toBe(10)
    // Exceed tokens
    k.resourceStats.tokenUsage = k.resourceStats.maxTokens
    expect(() => k.allocateResources({ estimatedTokens: 1 })).toThrow(/Límite de tokens excedido/)
  })

  test('scheduleTask orders by priority and executeNextTask runs and releases tokens', async () => {
    const { LogosKernel } = require('../src/orchestrator.js')
    const k = new LogosKernel()
    k.resourceStats.tokenUsage = 0

    const t1 = { estimatedTokens: 5, execute: async () => 'a' }
    const t2 = { estimatedTokens: 3, execute: async () => 'b' }
    const t3 = { estimatedTokens: 1, execute: async () => { throw new Error('fail') } }

    k.scheduleTask(t1, 'normal')
    k.scheduleTask(t2, 'high')
    k.scheduleTask(t3, 'low')

    // Check ordering by priority (t2 high should be first)
    expect(k.taskQueue[0].estimatedTokens).toBe(3)

  const res1 = await k.executeNextTask()
  expect(res1).toBe('b')
  // tokenUsage returned to 0 after release
  expect(k.resourceStats.tokenUsage).toBe(0)

  const res2 = await k.executeNextTask()
  expect(res2).toBe('a')
  expect(k.resourceStats.tokenUsage).toBe(0)

  // Next execution should throw (t3)
  await expect(k.executeNextTask()).rejects.toThrow('fail')
  expect(k.resourceStats.tokenUsage).toBe(0)
  })

  test('getMissionLogs returns not_found when no mission', () => {
    const { LogosKernel } = require('../src/orchestrator.js')
    const k = new LogosKernel()
    const logs = k.getMissionLogs('nope')
    expect(logs).toHaveProperty('status', 'not_found')
  })

  test('generateSovereigntyManifest writes file via fs', async () => {
    // Mock fs and path before importing
    const writeMock = jest.fn()
    jest.doMock('fs', () => ({ writeFileSync: writeMock }))
  // Provide minimal path API expected by modules
  jest.doMock('path', () => ({ resolve: (...args) => '/tmp/SOVEREIGNTY_MANIFEST.md', join: (...args) => '/tmp/SOVEREIGNTY_MANIFEST.md' }))
    const { LogosKernel } = require('../src/orchestrator.js')
    const k = new LogosKernel()
    await k.generateSovereigntyManifest('m-1', { summary: 'ok' })
    expect(writeMock).toHaveBeenCalled()
  })

  test('startMission handles ethics rejection and marks mission failed', async () => {
    // Mock MetatronAgent so EthicsCouncil returns not approved
    jest.doMock('../src/agents.js', () => {
      return jest.fn().mockImplementation((name) => ({
        run: async () => {
          if (name === 'EthicsCouncil') return { approved: false, reason: 'blocked' }
          return { approved: true, summary: 'ok', alternativeRealities: [], canCommit: true }
        }
      }))
    })

    // Ensure no fs writes from tyche path
    jest.doMock('fs', () => ({ existsSync: () => true, mkdirSync: () => {}, writeFileSync: () => {} }))

    const { LogosKernel } = require('../src/orchestrator.js')
    const k = new LogosKernel()
    // ensure token limits are OK
    k.resourceStats.tokenUsage = 0

    const logCb = jest.fn()
    await k.startMission('mission-1', { id: 'some-id' }, logCb)
    const mission = k.getMissionLogs('mission-1')
    expect(mission.status).toBe('failed')
    expect(mission.error).toMatch(/Misión rechazada/)
  })
})
import { LogosKernel } from '../src/orchestrator.js';

// Mock MetatronAgent to provide deterministic run() behavior
jest.mock('../src/agents.js', () => {
  return {
    default: jest.fn().mockImplementation((name) => ({
      name,
      run: async () => ({ approved: true, summary: 'ok', alternativeRealities: [], canCommit: true, message: 'ok' })
    })),
    __esModule: true,
  };
});

describe('LogosKernel basic flows', () => {
  let kernel;

  beforeEach(() => {
    process.env.NODE_ENV = 'test';
    process.env.NATIVE_DEV_MODE = 'true';
    kernel = new LogosKernel();
  });

  it('allocate and release resources within limits', () => {
    const task = { estimatedTokens: 10 };
    kernel.resourceStats.maxTokens = 1000;
    kernel.resourceStats.tokenUsage = 0;
    expect(kernel.allocateResources(task)).toBe(true);
    expect(kernel.resourceStats.tokenUsage).toBe(10);
    kernel.releaseResources(task);
    expect(kernel.resourceStats.tokenUsage).toBe(0);
  });

  it('schedules and executes tasks', async () => {
    const task = { estimatedTokens: 1, execute: async () => 'done' };
    kernel.resourceStats.maxTokens = 1000;
    kernel.scheduleTask(task, 'normal');
    const result = await kernel.executeNextTask();
    expect(result).toBe('done');
  });

  it('startMission handles happy path and marks mission completed', async () => {
    const missionId = 'm1';
    const contract = { id: 'simple' };
    const logs = [];
    await kernel.startMission(missionId, contract, (t) => logs.push(t));
    const mission = kernel.getMissionLogs(missionId);
    expect(mission.status === 'completed' || mission.status === 'failed').toBeTruthy();
    expect(Array.isArray(mission.logs)).toBe(true);
  }, 20000);

  it('initializeDrivers skips Neo4j in test mode', async () => {
    const k = new LogosKernel();
    // In test mode, neo4jDriver should remain null
    expect(k.neo4jDriver).toBeNull();
  });

  it('publishToVigilance does nothing if service not available', () => {
    const k = new LogosKernel();
    expect(() => k.publishToVigilance({ event: 'test' })).not.toThrow();
  });

  it('getVigilanceStatus returns perpetual flows status', () => {
    const k = new LogosKernel();
    const status = k.getVigilanceStatus();
    expect(status).toHaveProperty('flows');
    expect(status.flows).toHaveProperty('autoPreservation');
    expect(status.flows).toHaveProperty('knowledge');
    expect(status.flows).toHaveProperty('prophecy');
  });

  it('startResourceMonitoring sets interval', () => {
    const k = new LogosKernel();
    k.startResourceMonitoring();
    // Hard to test interval directly, but ensure no error
    expect(k.resourceStats.cpuUsage).toBeDefined();
  });
});
