import { spawn } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
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

async function eternal() {
  console.log('[eternal] Iniciando server de métricas...');
  startMetricsServer(process.env.METRICS_PORT ? Number(process.env.METRICS_PORT) : 3000);

  let cycle = 0;
  const oneCycle = process.argv.includes('--one-cycle') || process.env.ONE_CYCLE === 'true';
  const maxCycles = oneCycle ? 1 : Infinity;

  while (cycle < maxCycles) {
    cycle++;
    console.log(`[eternal] Ciclo ${cycle} - ejecutando ares3 loop y pruebas`);

    await run('node', ['ares3_loop.js']);
    await run('npm', ['test', '--', '--coverage']);
    await updateCoverageMetric();

    // Simulate docker buildx push if docker is present
    const dockerCheck = await run('docker', ['--version']);
    if (dockerCheck.code === 0) {
      console.log('[eternal] Docker detectado, simulando buildx multiarquitectura (no push en entorno local)');
      // we don't actually push in this environment
      await run('echo', ['"[sim] docker buildx build --platform linux/amd64,linux/arm64 -t multi:v1 . --push"']);
    }

    // Try a safe git commit/push if configured
    try {
      await run('git', ['add', '.']);
      await run('git', ['commit', '-m', 'Ares-IV Eternal commit'], []);
      await run('git', ['push', 'origin', 'main']);
      console.log('[eternal] git push ejecutado (si remote configurado)');
    } catch (e) {
      console.log('[eternal] git push omitido o falló (entorno sin remote o sin credenciales)');
    }

    // Wait a short interval before next cycle (3s default)
    if (oneCycle) break;
    await new Promise(r => setTimeout(r, 3000));
  }
}

eternal().catch(e => { console.error('[eternal] Error:', e); process.exit(1); });
