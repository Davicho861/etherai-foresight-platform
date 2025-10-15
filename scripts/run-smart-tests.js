#!/usr/bin/env node
// Athena Smart Test Runner - Precision Strike Validation
// - Uses IA and Neo4j causal analysis to predict and execute only relevant tests
// - Fallback to heuristic if backend unavailable
import { execSync } from 'child_process';

const changed = process.argv.slice(2);
console.log('[Athena] Running smart tests for changed files:', changed);

async function predictTests(changedFiles) {
  try {
    // Assume backend is running on localhost:4000 (from validate_local.sh)
    const response = await fetch('http://localhost:4000/api/llm/predict-tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ changedFiles })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data.suggested || [];
  } catch (err) {
    console.warn('[Athena] Backend prediction failed, using fallback heuristic:', err.message);
    // Fallback heuristic
    return changedFiles.map(f => {
      if (f.includes('pricing') || f.includes('Pricing')) return 'playwright/pricing.spec.ts';
      if (f.includes('demo') || f.includes('Demo')) return 'playwright/demo.spec.ts';
      if (f.includes('dashboard')) return 'playwright/dashboard.spec.ts';
      // Default fallback
      return 'playwright';
    });
  }
}

async function runSmartTests() {
  try {
    let testsToRun = [];
    if (changed.length === 0) {
      console.log('[Athena] No changed files provided, running minimal smoke test suite');
      testsToRun = ['playwright/eternal-vigilance.smoke.spec.ts'];
    } else {
      console.log('[Athena] Predicting relevant tests using IA and causal graph...');
      const predictedTests = await predictTests(changed);
      testsToRun = [...new Set(predictedTests)]; // Deduplicate
      console.log('[Athena] Predicted tests:', testsToRun);
    }

    if (testsToRun.length === 0) {
      console.log('[Athena] No tests to run, all clear!');
      return;
    }

    // Execute tests
    for (const testPath of testsToRun) {
      console.log(`[Athena] Executing: npx playwright test ${testPath}`);
      execSync(`npx playwright test ${testPath}`, { stdio: 'inherit' });
    }

    console.log('[Athena] Smart validation completed successfully!');
  } catch (err) {
    console.error('[Athena] Smart tests failed:', err?.message || err);
    process.exit(2);
  }
}

runSmartTests();
