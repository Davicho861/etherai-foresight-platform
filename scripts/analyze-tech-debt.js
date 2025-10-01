#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { ESLint } from 'eslint';
// eslint-disable-next-line no-unused-vars
import * as _ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const report = {
  highComplexity: [],
  excessiveEslintDisable: [],
  anyUsage: [],
  lowCoverage: []
};

async function analyzeComplexity() {
  const eslint = new ESLint({
    overrideConfig: {
      rules: {
        complexity: ['error', 11] // >10
      }
    },
    cwd: rootDir
  });

  const results = await eslint.lintFiles(['src/**/*.{js,ts,tsx}', 'server/**/*.{js,ts}', 'scripts/**/*.{js,ts}']);
  const formatter = await eslint.loadFormatter('compact');
  const output = formatter.format(results);

  // Parse output to extract high complexity functions
  const lines = output.split('\n');
  for (const line of lines) {
    if (line.includes('complexity') && line.includes('error')) {
      report.highComplexity.push(line.trim());
    }
  }
}

function analyzeEslintDisable() {
  const files = getAllFiles(rootDir, ['src', 'server', 'scripts'], ['.js', '.ts', '.tsx']);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const disableMatches = content.match(/eslint-disable/g) || [];
    if (disableMatches.length > 5) {
      report.excessiveEslintDisable.push(`${file}: ${disableMatches.length} disables`);
    }
  }
}

function analyzeAnyUsage() {
  const files = getAllFiles(rootDir, ['src', 'server'], ['.ts', '.tsx']);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const anyMatches = content.match(/\bany\b/g) || [];
    if (anyMatches.length > 0) {
      report.anyUsage.push(`${file}: ${anyMatches.length} usages of 'any'`);
    }
  }
}

function analyzeCoverage() {
  try {
    execSync('npx jest --coverage --coverageReporters=json --silent', { cwd: rootDir, stdio: 'inherit' });

    const coveragePath = path.join(rootDir, 'coverage', 'coverage-final.json');
    if (fs.existsSync(coveragePath)) {
      const coverage = JSON.parse(fs.readFileSync(coveragePath, 'utf-8'));
      for (const [file, data] of Object.entries(coverage)) {
        const linesPct = data.lines?.pct || 0;
        if (linesPct < 80) {
          report.lowCoverage.push(`${file}: ${linesPct}% coverage`);
        }
      }
    }
  } catch (error) {
    console.warn('Coverage analysis failed:', error.message);
  }
}

function getAllFiles(dir, subdirs, extensions) {
  const files = [];
  for (const subdir of subdirs) {
    const fullDir = path.join(dir, subdir);
    if (fs.existsSync(fullDir)) {
      walkDir(fullDir, files, extensions);
    }
  }
  return files;
}

function walkDir(dir, files, extensions) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath, files, extensions);
    } else if (extensions.some(ext => fullPath.endsWith(ext))) {
      files.push(fullPath);
    }
  }
}

async function main() {
  console.log('Analyzing tech debt...\n');

  await analyzeComplexity();
  analyzeEslintDisable();
  analyzeAnyUsage();
  analyzeCoverage();

  console.log('=== TECH DEBT REPORT ===\n');

  console.log('High Complexity Functions (>10):');
  report.highComplexity.forEach(item => console.log(`- ${item}`));
  if (report.highComplexity.length === 0) console.log('None found.');

  console.log('\nExcessive ESLint Disables (>5 per file):');
  report.excessiveEslintDisable.forEach(item => console.log(`- ${item}`));
  if (report.excessiveEslintDisable.length === 0) console.log('None found.');

  console.log('\nTypeScript Any Usage:');
  report.anyUsage.forEach(item => console.log(`- ${item}`));
  if (report.anyUsage.length === 0) console.log('None found.');

  console.log('\nLow Test Coverage (<80%):');
  report.lowCoverage.forEach(item => console.log(`- ${item}`));
  if (report.lowCoverage.length === 0) console.log('None found.');

  console.log('\nAnalysis complete.');
}

main().catch(console.error);