#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

let description;
if (args[0] === '--' && args[1]) {
  description = args[1];
} else {
  const featureDescriptionIndex = args.indexOf('--feature_description');
  if (featureDescriptionIndex === -1 || featureDescriptionIndex + 1 >= args.length) {
    console.error('Usage: node scripts/develop-auto.js -- "description" or --feature_description "description"');
    process.exit(1);
  }
  description = args[featureDescriptionIndex + 1];
}

const PORT = process.env.PORT || 45000;
const TOKEN = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

const url = `http://localhost:${PORT}/api/llm/plan-and-code`;

fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${TOKEN}`
  },
  body: JSON.stringify({ description })
})
.then(res => {
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  return res.json();
})
.then(data => {
  if (data.error) {
    console.error('Error:', data.error);
    process.exit(1);
  }
  const files = data.files || [];
  files.forEach(file => {
    const fullPath = path.resolve(__dirname, '..', file.path);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, file.content);
    console.log(`Created: ${file.path}`);
  });
  console.log('Development auto completed.');
})
.catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});