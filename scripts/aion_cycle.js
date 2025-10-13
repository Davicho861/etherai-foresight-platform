#!/usr/bin/env node
import fs from 'fs';
import { spawnSync } from 'child_process';
import path from 'path';

const workspaceRoot = path.resolve(new URL(import.meta.url).pathname, '..', '..');
const projectKanban = path.join(workspaceRoot, 'PROJECT_KANBAN.md');
const reportScript = path.join(workspaceRoot, 'scripts', 'generate_report.js');

function readKanban() {
  try {
    const content = fs.readFileSync(projectKanban, 'utf8');
    // Simple: pick the first line that looks like a task (starting with '- ')
    const lines = content.split(/\r?\n/);
    const task = lines.find(l => l.trim().startsWith('- '));
    return task ? task.trim().substring(2) : null;
  } catch (err) {
    return null;
  }
}

function runTests() {
  console.log('[Aion] Ejecutando test suite: npm test');
  const res = spawnSync('npm', ['test'], { stdio: 'inherit' });
  return res.status === 0;
}

function generateReport(success, details) {
  const res = spawnSync('node', [reportScript, success ? 'success' : 'failure', JSON.stringify(details || {})], { encoding: 'utf8' });
  if (res.error) console.error('[Aion] Error generando reporte:', res.error);
  else console.log(res.stdout);
}

async function main() {
  console.log('[Aion] Iniciando ciclo de introspección...');
  const mission = readKanban();
  if (!mission) {
    console.log('[Aion] No se encontró misión en PROJECT_KANBAN.md. Generando misión trivial.');
  } else {
    console.log('[Aion] Próxima misión detectada:', mission);
  }

  console.log('[Aion] Ejecutando misión (simulada)...');
  // Aquí normalmente se ejecutaría la misión real. Para seguridad, lo simulamos.
  await new Promise(r => setTimeout(r, 800));

  console.log('[Aion] Validando cambios con la suite de pruebas...');
  const ok = runTests();

  const details = {
    mission: mission || 'auto-generated: tidy-docs',
    timestamp: new Date().toISOString(),
    branch: process.env.GIT_BRANCH || null,
  };

  generateReport(ok, details);

  if (!ok) {
    console.log('[Aion] Tests fallaron. Deteniendo ciclo y reportando. No se hará commit en main.');
    process.exit(1);
  }

  console.log('[Aion] Ciclo completado con éxito. Reporte generado.');
}

main().catch(err => {
  console.error('[Aion] Error en ciclo:', err);
  process.exit(1);
});
