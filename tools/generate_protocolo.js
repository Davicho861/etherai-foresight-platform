#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_e) {
    return null;
  }
}

function parseNpmAudit(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (_e) {
    return { error: 'invalid_json' };
  }
}

function summarizeLint(text) {
  if (!text) return { issues: [] };
  const lines = text.split('\n').slice(-200);
  const issues = lines.filter(Boolean).slice(0, 200);
  return { issues };
}

function summarizeTests(text) {
  if (!text) return { result: 'no_output' };
  const failed = /fail/i.test(text) || /error/i.test(text);
  return { failed, summary: text.split('\n').slice(-50).join('\n') };
}

function produceProtocol(artifactsDir) {
  const auditPath = path.join(artifactsDir, 'npm_audit.json');
  const lintPath = path.join(artifactsDir, 'lint.txt');
  const testsPath = path.join(artifactsDir, 'tests.txt');

  const auditRaw = safeRead(auditPath);
  const lintRaw = safeRead(lintPath);
  const testsRaw = safeRead(testsPath);

  const audit = auditRaw ? parseNpmAudit(auditRaw) : { error: 'no_audit_output' };
  const lint = summarizeLint(lintRaw);
  const tests = summarizeTests(testsRaw);

  const actions = [];

  if (audit && audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
    actions.push({ crew: 'Hefesto', action: 'review_and_update_dependencies', reason: 'vulnerabilities_detected', details: { total: Object.keys(audit.vulnerabilities).length } });
  } else if (audit && audit.error !== 'invalid_json') {
    actions.push({ crew: 'Hefesto', action: 'ensure_lockfile', reason: 'no_vulns_or_no_audit', details: {} });
  }

  if (lint.issues && lint.issues.length > 0) {
    actions.push({ crew: 'Atenea', action: 'apply_lint_suggestions', reason: 'lint_issues', details: { sample: lint.issues.slice(0,10) } });
  }

  if (tests.failed) {
    actions.push({ crew: 'Ares', action: 'investigate_tests', reason: 'tests_failed', details: { summary: tests.summary } });
  }

  if (actions.length === 0) {
    actions.push({ crew: 'Hermes', action: 'verify_and_document', reason: 'clean_state', details: {} });
  }

  const protocol = {
    generated_at: new Date().toISOString(),
    artifacts: {
      audit: audit ? (audit.error ? { error: audit.error } : { metadata: { advisories: (audit.advisories ? Object.keys(audit.advisories).length : 0) } }) : null,
      lint: { count: lint.issues ? lint.issues.length : 0 },
      tests: tests,
    },
    actions,
    notes: 'This protocol is advisory only. Human review and PRs required before applying changes.'
  };

  const outDir = path.resolve(artifactsDir);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'protocolo_singularity.json');
  fs.writeFileSync(outPath, JSON.stringify(protocol, null, 2));
  console.log('Wrote', outPath);
}

const artifactsDir = process.argv[2] || './artifacts';
produceProtocol(artifactsDir);
