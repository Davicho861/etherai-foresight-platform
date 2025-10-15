#!/usr/bin/env node
// Athena cycle: orchestrates local validation, attempts auto-heals and reruns failing tests.
import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function runValidate() {
  console.log('[Athena] Running validate_local.sh (this will use docker-compose & a Playwright container)');
  const r = spawnSync('./validate_local.sh', { stdio: 'inherit', shell: true });
  return r.status === 0;
}

function listFailedSpecs() {
  const resultsDir = path.resolve('test-results');
  if (!fs.existsSync(resultsDir)) return [];
  const entries = fs.readdirSync(resultsDir, { withFileTypes: true });
  const failed = [];
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const sub = path.join(resultsDir, e.name);
    // if contains error-context.md it's a failing run
    const errorCtx = fs.readdirSync(sub).find(f => f.includes('error-context.md'));
    if (errorCtx) {
      // Try to map to a playwright spec by finding a spec file that starts with the leading token
      const token = e.name.split('-')[0];
      const specs = fs.readdirSync(path.resolve('playwright')).filter(s => s.startsWith(token));
      if (specs.length > 0) {
        failed.push(specs[0]);
      } else {
        // fallback: push raw name
        failed.push(e.name);
      }
    }
  }
  // unique
  return Array.from(new Set(failed));
}

function runSpecInContainer(spec) {
  console.log(`[Athena] Running spec in Playwright container: ${spec}`);
  // Use same image/version as validate_local.sh
  const image = 'mcr.microsoft.com/playwright:v1.56.0-jammy';
  const cmd = `docker run --rm -v "$PWD":/app:cached -w /app --network host ${image} sh -c "npx playwright test ${spec} --config=playwright.config.ts --reporter=list"`;
  const r = spawnSync(cmd, { stdio: 'inherit', shell: true });
  return r.status === 0;
}

function attemptHeal(spec) {
  console.log(`[Athena] Attempting healing for spec: ${spec}`);
  const specPath = path.resolve('playwright', spec);
  const r = spawnSync(`node ./scripts/asclepio-healer.js ${specPath}`, { stdio: 'inherit', shell: true });
  return r.status === 0;
}

function createIssue(spec) {
  const issuesDir = path.resolve('scripts', 'athena-issues');
  if (!fs.existsSync(issuesDir)) fs.mkdirSync(issuesDir, { recursive: true });
  const fname = path.join(issuesDir, `issue-${spec.replace(/[^a-zA-Z0-9_.-]/g, '_')}.md`);
  const content = `# Athena Issue: ${spec}\n\nFailed to auto-heal test ${spec}. Please investigate.\n`;
  fs.writeFileSync(fname, content, 'utf-8');
  console.log('[Athena] Created issue file:', fname);
}

async function main() {
  const success = runValidate();
  if (success) {
    console.log('[Athena] Validation passed with zero errors. Manifestación completa (demo).');
    process.exit(0);
  }

  console.log('[Athena] Validation failed. Scanning test-results to identify failing specs...');
  const failed = listFailedSpecs();
  console.log('[Athena] Found failing specs:', failed);

  for (const spec of failed) {
    let healed = false;
    for (let attempt = 1; attempt <= 2; attempt++) {
      console.log(`[Athena] Healing attempt ${attempt} for ${spec}`);
      const patchApplied = attemptHeal(spec);
      if (patchApplied) {
        console.log('[Athena] Patch applied, re-running spec in container...');
        const passed = runSpecInContainer(spec);
        if (passed) {
          console.log(`[Athena] Spec ${spec} healed successfully.`);
          healed = true;
          break;
        } else {
          console.log(`[Athena] Spec ${spec} still failing after attempt ${attempt}.`);
        }
      } else {
        console.log('[Athena] No patch applied by Asclepio.');
      }
    }
    if (!healed) {
      console.log(`[Athena] Could not heal ${spec} after 2 attempts. Creating issue.`);
      createIssue(spec);
    }
  }

  console.log('[Athena] Cycle complete. Re-run validate to confirm overall status.');
  process.exit(1);
}

main().catch(err => {
  console.error('[Athena] Fatal error:', err);
  process.exit(2);
});
