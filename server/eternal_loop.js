import { spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { Worker } from 'worker_threads';
import { coverageGauge, startMetricsServer } from './monitoring/index.js';

const run = (cmd, args = []) => new Promise((resolve) => {
  const p = spawn(cmd, args, { stdio: 'pipe', cwd: process.cwd() });
  let out = '';
  p.stdout.on('data', d => out += d.toString());
  p.stderr.on('data', d => out += d.toString());
  p.on('close', code => resolve({ code, out }));
});

async function updateCoverageMetric() {
  try {
    const covPath = path.join(process.cwd(), 'coverage', 'coverage-summary.json');
    if (fs.existsSync(covPath)) {
      const cov = JSON.parse(fs.readFileSync(covPath, 'utf8'));
      const pct = cov.total && cov.total.lines && cov.total.lines.pct ? cov.total.lines.pct : 0;
      coverageGauge.set(pct);
    }
  } catch (e) {
    // ignore
  }
}

async function runParallelTasks(tasks) {
  const results = await Promise.allSettled(tasks.map(task => task()));
  return results.map((result, index) => ({
    task: index,
    status: result.status,
    value: result.value,
    reason: result.reason
  }));
}

async function eternal() {
  console.log('[eternal] Iniciando server de métricas...');
  startMetricsServer(process.env.METRICS_PORT ? Number(process.env.METRICS_PORT) : 3000);

  let cycle = 0;
  const oneCycle = process.argv.includes('--one-cycle') || process.env.ONE_CYCLE === 'true';
  const maxCycles = oneCycle ? 1 : Infinity;

  while (cycle < maxCycles) {
    cycle++;
    console.time(`[eternal] Ciclo ${cycle} - tiempo total`);
    console.log(`[eternal] Ciclo ${cycle} - ejecutando tareas paralelizadas`);

    const args = [];
    if (oneCycle) args.push('--one-cycle');

    // Parallel execution using Promise.allSettled for better performance
    const parallelTasks = [
      // Task 1: Run ares3 loop
      async () => {
        console.time('[eternal] ares3_loop');
        const result = await run('node', ['ares3_loop.js', ...args]);
        console.timeEnd('[eternal] ares3_loop');
        return result;
      },
      // Task 2: Run tests with coverage
      async () => {
        console.time('[eternal] npm test');
        const result = await run('npm', ['test', '--', '--coverage']);
        console.timeEnd('[eternal] npm test');
        return result;
      },
      // Task 3: Update coverage metric
      async () => {
        console.time('[eternal] updateCoverageMetric');
        await updateCoverageMetric();
        console.timeEnd('[eternal] updateCoverageMetric');
        return { code: 0, out: 'Coverage updated' };
      },
      // Task 4: Docker simulation (if available)
      async () => {
        const dockerCheck = await run('docker', ['--version']);
        if (dockerCheck.code === 0) {
          console.time('[eternal] docker sim');
          console.log('[eternal] Docker detectado, simulando buildx multiarquitectura');
          const result = await run('echo', ['"[sim] docker buildx build --platform linux/amd64,linux/arm64 -t multi:v1 . --push"']);
          console.timeEnd('[eternal] docker sim');
          return result;
        }
        return { code: 0, out: 'Docker not available' };
      }
    ];

    const results = await runParallelTasks(parallelTasks);
    console.log(`[eternal] Resultados paralelos: ${results.filter(r => r.status === 'fulfilled').length}/${results.length} exitosos`);

    // Git operations (sequential for safety)
    try {
      console.time('[eternal] git operations');
      await run('git', ['add', '.']);
      await run('git', ['commit', '-m', `Ares-V Apotheosis Cycle ${cycle}`], []);
      await run('git', ['push', 'origin', 'main']);
      console.log('[eternal] git push ejecutado');
      console.timeEnd('[eternal] git operations');
    } catch (e) {
      console.log('[eternal] git operations omitidas o fallaron');
    }

    console.timeEnd(`[eternal] Ciclo ${cycle} - tiempo total`);

    // Wait a short interval before next cycle (reduced to 2s for faster cycles)
    if (oneCycle) break;
    await new Promise(r => setTimeout(r, 2000));
  }
}

eternal().catch(e => { console.error('[eternal] Error:', e); process.exit(1); });
