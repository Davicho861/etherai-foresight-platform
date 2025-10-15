const { LogosKernel } = require('../src/orchestrator.js');

describe('LogosKernel core flows', () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.NATIVE_DEV_MODE;
    delete process.env.MAX_TOKENS;
  });

  test('allocateResources throws when token limit exceeded', () => {
    const kernel = new LogosKernel();
    kernel.resourceStats.maxTokens = 100;
    kernel.resourceStats.tokenUsage = 90;
    const task = { estimatedTokens: 20 };
    expect(() => kernel.allocateResources(task)).toThrow(/Límite de tokens/);
  });

  test('scheduleTask orders by priority', () => {
    const kernel = new LogosKernel();
    kernel.scheduleTask({ id: 't1' }, 'low');
    kernel.scheduleTask({ id: 't2' }, 'high');
    kernel.scheduleTask({ id: 't3' }, 'normal');
    expect(kernel.taskQueue[0].id).toBe('t2');
    expect(kernel.taskQueue[1].id).toBe('t3');
    expect(kernel.taskQueue[2].id).toBe('t1');
  });

  test('executeNextTask runs task and releases resources', async () => {
    const kernel = new LogosKernel();
    kernel.resourceStats.maxTokens = 1000;
    kernel.resourceStats.tokenUsage = 0;
    const task = { estimatedTokens: 10, execute: jest.fn().mockResolvedValue('done') };
    kernel.taskQueue.push(task);
    const res = await kernel.executeNextTask();
    expect(res).toBe('done');
    expect(kernel.resourceStats.tokenUsage).toBe(0);
  });

  test('startMission records failed mission when ethics council rejects', async () => {
    const kernel = new LogosKernel();
    kernel.resourceStats.maxTokens = 10000;
    // Force early rejection
    kernel.ethicsCouncil.run = async () => ({ approved: false, reason: 'not aligned' });
    // Prevent writing files
    kernel.generateSovereigntyManifest = jest.fn();
    const logs = [];
    await kernel.startMission('m-reject', { id: 'm1' }, (l) => logs.push(l));
    const mission = kernel.getMissionLogs('m-reject');
    expect(mission.status).toBe('failed');
    expect(mission.logs.some(l => l.status === 'error' || (l.description && l.description.includes('Error')))).toBeTruthy();
  });

  test('startMission completes when crews and agents succeed (NATIVE_DEV_MODE)', async () => {
    process.env.NATIVE_DEV_MODE = 'true';
    const kernel = new LogosKernel();
    kernel.resourceStats.maxTokens = 100000;
    // Approve mission
    kernel.ethicsCouncil.run = async () => ({ approved: true });
    kernel.oracle.run = async () => ({ summary: 'ok', optimalProtocol: {} });
    // Replace crews with lightweight mocks
    kernel.crews.planning.run = async () => ({ alternativeRealities: [] });
    kernel.crews.development.run = async () => ({ build: true });
    kernel.crews.quality.run = async () => ({ ok: true });
    kernel.crews.deployment.run = async () => ({ deployed: true });
    // Consensus agent created inside will use MetatronAgent - assume it returns canCommit true
    // Monkeypatch MetatronAgent.prototype.run if present
    const agentsMod = require('../src/agents.js');
    if (agentsMod && agentsMod.default && agentsMod.default.prototype && agentsMod.default.prototype.run) {
      jest.spyOn(agentsMod.default.prototype, 'run').mockImplementation(async (input) => {
        if (input && input.changes) return { canCommit: true, message: 'ok' };
        return { result: 'ok', summary: 'ok' };
      });
    }

    kernel.generateSovereigntyManifest = jest.fn();
    const logs = [];
    await kernel.startMission('m-success', { id: 'm2' }, (l) => logs.push(l));
    const mission = kernel.getMissionLogs('m-success');
    if (mission.status !== 'completed') {
      // Debug output to understand failure cause
       
      console.error('MISSION LOGS:', logs);
       
      console.error('MISSION OBJ:', mission);
    }
    expect(mission.status).toBe('completed');
    expect(kernel.generateSovereigntyManifest).toHaveBeenCalled();
  });
});
