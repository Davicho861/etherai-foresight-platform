#!/usr/bin/env node
import fetch from 'node-fetch';
import process from 'process';
import fs from 'fs/promises';
import path from 'path';

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: generate-component "ComponentName" "Description"');
  process.exit(2);
}
const [name, ...rest] = args;
const description = rest.join(' ');

const API = process.env.VITE_API_BASE_URL || 'http://localhost:4000';
(async ()=>{
  try {
    const resp = await fetch(API + '/api/llm/generate-component', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.PRAEVISIO_BEARER_TOKEN||'demo-token'}` },
      body: JSON.stringify({ name, description })
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.error('Error', data);
      process.exit(1);
    }
    const out = String(data.component || '').trim();
    const dir = path.join('src','components','generated');
    await fs.mkdir(dir, { recursive: true });
    const filePath = path.join(dir, `${name}.tsx`);
    await fs.writeFile(filePath, out, 'utf8');
    console.log('Wrote', filePath);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
