#!/usr/bin/env node

const { execSync } = require('child_process');

// Set environment variables to point to mock-server
process.env.VITE_API_BASE_URL = 'http://mock-server:3000';
process.env.API_BASE = 'http://mock-server:3000';
process.env.FRONTEND_URL = 'http://frontend:3002';
process.env.PRAEVISIO_BEARER_TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

console.log('Running smart tests against mock-server...');

// For now, run all E2E tests. In the future, make it selective based on changed files.
try {
  execSync('npx playwright test --reporter=line', { stdio: 'inherit' });
  console.log('Tests passed!');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}