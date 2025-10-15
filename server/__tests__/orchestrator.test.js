import { LogosKernel } from '../src/orchestrator.js';
import fs from 'fs';

jest.mock('fs');

describe('LogosKernel basics', () => {
  let kernel;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = 'test';
    kernel = new LogosKernel();
    // Ensure resource stats deterministic
    kernel.resourceStats = { cpuUsage: 0, memoryUsage: 0, tokenUsage: 0, maxTokens: 10000 };
  });

  it('should allocate and release resources', () => {
    const task = { estimatedTokens: 100 };
    expect(kernel.allocateResources(task)).toBe(true);
    expect(kernel.resourceStats.tokenUsage).toBe(100);
    kernel.releaseResources(task);
    expect(kernel.resourceStats.tokenUsage).toBe(0);
  });

  it('should schedule and execute a task', async () => {
    const executed = { called: false };
    const task = {
      estimatedTokens: 10,
      execute: async () => { executed.called = true; return 'ok'; }
    };
    kernel.scheduleTask(task, 'high');
    const res = await kernel.executeNextTask();
    expect(res).toBe('ok');
    expect(executed.called).toBe(true);
  });

  it('getVigilanceStatus returns structure', () => {
    const status = kernel.getVigilanceStatus();
    expect(status).toHaveProperty('flows');
    expect(status).toHaveProperty('riskIndices');
    expect(status.hibernation).toHaveProperty('status');
  });

  it('generateSovereigntyManifest writes a file', async () => {
    fs.writeFileSync.mockImplementation(() => {});
    await kernel.generateSovereigntyManifest('m1', { summary: 'ok' });
    expect(fs.writeFileSync).toHaveBeenCalled();
  });
});
