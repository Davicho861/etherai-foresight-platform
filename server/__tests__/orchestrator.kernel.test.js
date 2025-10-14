 
describe('LogosKernel (orchestrator)', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.NATIVE_DEV_MODE = 'true';

    // Mock database clients to avoid side-effects at import time
    jest.doMock('../src/database.js', () => ({
      getChromaClient: () => null,
      getNeo4jDriver: async () => null,
    }));

    // Mock eventHub.publish
    jest.doMock('../src/eventHub.js', () => ({ publish: jest.fn() }));

    // Provide a lightweight eternalVigilanceService used by publishToVigilance
    jest.doMock('../src/eternalVigilanceService.js', () => ({ default: { emitEvent: jest.fn() } }));

    // Mock MetatronAgent to return controllable run() results depending on name
    jest.doMock('../src/agents.js', () => {
      return jest.fn().mockImplementation((name) => ({
        run: async (input) => {
          // Default behaviors for agents used in startMission
          if (name === 'EthicsCouncil') return { approved: true };
          if (name === 'Oracle') return { summary: 'oracle-summary', optimalProtocol: {} };
          if (name === 'Socrates') return { summary: 'wisdom' };
          if (name === 'PlanningCrew') return { alternativeRealities: [] };
          if (name === 'DevelopmentCrew') return { result: 'dev' };
          if (name === 'QualityCrew') return { result: 'qa' };
          if (name === 'DeploymentCrew') return { result: 'deployed' };
          if (name === 'ConsensusAgent') return { canCommit: true };
          return { ok: true };
        }
      }));
    });
  });

  test('allocateResources and releaseResources adjust token usage and enforce limits', () => {
    const { LogosKernel } = require('../src/orchestrator.js');
    const k = new LogosKernel();
    k.resourceStats.maxTokens = 1000;
    k.resourceStats.tokenUsage = 0;

    const task = { estimatedTokens: 100 };
    expect(k.allocateResources(task)).toBe(true);
    expect(k.resourceStats.tokenUsage).toBe(100);

    // Releasing should decrement
    k.releaseResources(task);
    expect(k.resourceStats.tokenUsage).toBe(0);

    // Exceeding tokens should throw
    k.resourceStats.tokenUsage = 950;
    const bigTask = { estimatedTokens: 100 };
    expect(() => k.allocateResources(bigTask)).toThrow(/Límite de tokens/i);
  });

  test('scheduleTask orders by priority and executeNextTask runs task', async () => {
    const { LogosKernel } = require('../src/orchestrator.js');
    const k = new LogosKernel();
    k.resourceStats.maxTokens = 10000;

    const taskA = { estimatedTokens: 10, execute: async () => 'A' };
    const taskB = { estimatedTokens: 10, execute: async () => 'B' };

    k.scheduleTask(taskB, 'low');
    k.scheduleTask(taskA, 'high');

    const result = await k.executeNextTask();
    expect(result).toBe('A');
    // After execution token usage should be back to zero
    expect(k.resourceStats.tokenUsage).toBe(0);
  });

  test('startMission completes successfully and generates manifest', async () => {
    const { LogosKernel } = require('../src/orchestrator.js');
    // spy on publish and manifest generation
    const eventHub = require('../src/eventHub.js');
    const spyPublish = eventHub.publish;

    // Spy on generateSovereigntyManifest to avoid writing file
    const proto = require('../src/orchestrator.js').LogosKernel.prototype;
    jest.spyOn(proto, 'generateSovereigntyManifest').mockImplementation(async () => {});

    const k = new LogosKernel();
    const logs = [];
    const logCb = (l) => logs.push(l);

    await k.startMission('mission-1', { id: 'normal-mission' }, logCb);

    const mission = k.getMissionLogs('mission-1');
    expect(mission.status).toBe('completed');
    expect(mission.logs.length).toBeGreaterThan(0);
    expect(spyPublish).toHaveBeenCalled();
    expect(proto.generateSovereigntyManifest).toHaveBeenCalled();
  }, 20000);

  test('startMission records failure when ethics council rejects', async () => {
    // Re-mock agents to make EthicsCouncil reject
    jest.resetModules();
    process.env.NODE_ENV = 'test';
    process.env.NATIVE_DEV_MODE = 'true';
    jest.doMock('../src/database.js', () => ({ getChromaClient: () => null, getNeo4jDriver: async () => null }));
    jest.doMock('../src/eventHub.js', () => ({ publish: jest.fn() }));
    jest.doMock('../src/eternalVigilanceService.js', () => ({ default: { emitEvent: jest.fn() } }));
    jest.doMock('../src/agents.js', () => {
      return jest.fn().mockImplementation((name) => ({
        run: async () => {
          if (name === 'EthicsCouncil') return { approved: false, reason: 'not ethical' };
          if (name === 'ConsensusAgent') return { canCommit: true };
          return { ok: true };
        }
      }));
    });

    const { LogosKernel } = require('../src/orchestrator.js');
    const proto = require('../src/orchestrator.js').LogosKernel.prototype;
    jest.spyOn(proto, 'generateSovereigntyManifest').mockImplementation(async () => {});

    const k = new LogosKernel();
    await k.startMission('mission-2', { id: 'will-fail' }, () => {});
    const mission = k.getMissionLogs('mission-2');
    expect(mission.status).toBe('failed');
    expect(mission.error).toMatch(/rechazada|not ethical/i);
  });
});
import fs from 'fs';
import path from 'path';
import { LogosKernel } from '../src/orchestrator.js';

process.env.NODE_ENV = 'test';
process.env.NATIVE_DEV_MODE = 'true';

describe('LogosKernel core methods', () => {
  let kernel;

  beforeEach(() => {
    kernel = new LogosKernel();
    // reset simple resource stats
    kernel.resourceStats = { cpuUsage: 0, memoryUsage: 0, tokenUsage: 0, maxTokens: 1000 };
  });

  it('allocates and releases resources correctly', () => {
    const task = { estimatedTokens: 100 };
    expect(kernel.allocateResources(task)).toBe(true);
    expect(kernel.resourceStats.tokenUsage).toBe(100);
    kernel.releaseResources(task);
    expect(kernel.resourceStats.tokenUsage).toBe(0);
  });

  it('throws when token limit exceeded', () => {
    kernel.resourceStats.tokenUsage = 950;
    const task = { estimatedTokens: 100 };
    expect(() => kernel.allocateResources(task)).toThrow('Límite de tokens excedido');
  });

  it('throws when CPU or memory overloaded', () => {
    kernel.resourceStats.cpuUsage = 0.96;
    const task = { estimatedTokens: 10 };
    expect(() => kernel.allocateResources(task)).toThrow('Recursos computacionales sobrecargados');
    kernel.resourceStats.cpuUsage = 0;
    kernel.resourceStats.memoryUsage = 0.96;
    expect(() => kernel.allocateResources(task)).toThrow('Recursos computacionales sobrecargados');
  });

  it('schedules tasks by priority and executes next task (success)', async () => {
    const executed = [];
    const taskA = { estimatedTokens: 10, execute: async () => { executed.push('A'); return 'A'; } };
    const taskB = { estimatedTokens: 5, execute: async () => { executed.push('B'); return 'B'; } };
    kernel.scheduleTask(taskA, 'low');
    kernel.scheduleTask(taskB, 'high');
    // high priority should be executed first
    const res = await kernel.executeNextTask();
    expect(res).toBe('B');
    // next
    const res2 = await kernel.executeNextTask();
    expect(res2).toBe('A');
    expect(executed).toEqual(['B', 'A']);
  });

  it('releases resources if task execution throws', async () => {
    const task = { estimatedTokens: 20, execute: async () => { throw new Error('boom'); } };
    kernel.scheduleTask(task, 'normal');
    try {
      await kernel.executeNextTask();
    } catch (e) {
      // expected
    }
    // tokens should have been released back to 0
    expect(kernel.resourceStats.tokenUsage).toBe(0);
  });

  it('generates sovereignty manifest file', async () => {
    const missionId = 'm-test';
    const finalReport = { summary: 'ok' };
    const filePath = path.resolve(process.cwd(), 'SOVEREIGNTY_MANIFEST.md');
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    await kernel.generateSovereigntyManifest(missionId, finalReport);
    expect(fs.existsSync(filePath)).toBe(true);
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('Praevisio AI');
    // clean up
    fs.unlinkSync(filePath);
  });
});
