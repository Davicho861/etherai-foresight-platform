const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const resultsPath = path.join(__dirname, '..', 'test-results', 'results.json');

if (!fs.existsSync(resultsPath)) {
  console.log('No test results found, skipping flaky test detection.');
  process.exit(0);
}

const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));

const flakyTests = [];

function traverseSuites(suites) {
  for (const suite of suites) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        for (const test of spec.tests) {
          if (test.results) {
            for (const result of test.results) {
              if (result.retry > 0 && result.status === 'passed') {
                flakyTests.push({
                  title: test.title,
                  file: spec.file,
                  retry: result.retry,
                  output: result.output || 'No output',
                  attachments: result.attachments || []
                });
              }
            }
          }
        }
      }
    }
    if (suite.suites) {
      traverseSuites(suite.suites);
    }
  }
}

traverseSuites(results.suites);

if (flakyTests.length === 0) {
  console.log('No flaky tests detected.');
  process.exit(0);
}

for (const test of flakyTests) {
  const title = `Flaky test detected: ${test.title}`;
  const body = `
**Test File:** ${test.file}
**Retry Count:** ${test.retry}
**Output:**
\`\`\`
${test.output}
\`\`\`

**Attachments:**
${test.attachments.map(att => `- ${att.name}: ${att.path}`).join('\n')}

This test passed after retry, indicating it is flaky.
  `.trim();

  try {
    execSync(`gh issue create --title "${title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" --label flaky-test`, { stdio: 'inherit' });
    console.log(`Created issue for flaky test: ${test.title}`);
  } catch (error) {
    console.error(`Failed to create issue for ${test.title}:`, error.message);
  }
}