#!/usr/bin/env node
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Use global fetch available in Node 18+; avoid node-fetch dependency

async function main() {
  try {
    // 1. Obtener archivos modificados respecto a main (fallback si origin/main no existe)
    let changed = [];
    try {
      changed = execSync('git fetch origin main --quiet && git diff --name-only origin/main...HEAD').toString().split('\n').filter(Boolean);
    } catch (e) {
      // Fallback a diff con el último commit si no hay origin/main
      try {
        changed = execSync('git diff --name-only HEAD~1..HEAD').toString().split('\n').filter(Boolean);
      } catch (e2) {
        changed = [];
      }
    }

    // 2. Listar tests E2E (playwright folder)
    const testsDir = path.join(process.cwd(), 'playwright');
    let availableTests = [];
    if (fs.existsSync(testsDir)) {
      availableTests = fs.readdirSync(testsDir).filter(f => f.endsWith('.ts') || f.endsWith('.js'));
    }

    // 3. Enviar al backend predict-tests
    const backendUrl = process.env.PRAEVISIO_BACKEND || 'http://localhost:4000';
    const token = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';
    const res = await fetch(`${backendUrl}/api/llm/predict-tests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ changedFiles: changed, availableTests })
    });
    const json = await res.json();
    const recommended = json.recommended || [];

    if (!recommended.length) {
      console.log('No recommended tests returned. Falling back to running full test suite.');
      spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit' });
      process.exit(0);
    }

    // 4. Ejecutar sólo los tests recomendados
    for (const t of recommended) {
      const testPath = path.join('playwright', t);
      if (!fs.existsSync(testPath)) {
        console.warn(`Recommended test ${t} not found, skipping.`);
        continue;
      }
      console.log(`Running recommended test: ${t}`);
      const r = spawnSync('npx', ['playwright', 'test', testPath], { stdio: 'inherit' });
      if (r.status !== 0) process.exit(r.status);
    }

    console.log('Smart tests completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Error running smart tests', err);
    // Fallback: run full suite
    try {
      spawnSync('npx', ['playwright', 'test'], { stdio: 'inherit' });
    } catch (e) {
      console.error('Also failed to run full test suite', e);
    }
    process.exit(1);
  }
}

main();
