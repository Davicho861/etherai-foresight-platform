#!/usr/bin/env node
import fetch from 'node-fetch';
import process from 'process';

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: propose-plan "Your plan prompt"');
  process.exit(2);
}
const prompt = args.join(' ');

const API = process.env.VITE_API_BASE_URL || 'http://localhost:4000';
(async ()=>{
  try {
    const resp = await fetch(API + '/api/llm/propose-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.PRAEVISIO_BEARER_TOKEN||'demo-token'}` },
      body: JSON.stringify({ prompt })
    });
    const data = await resp.json();
    if (!resp.ok) {
      console.error('Error', data);
      process.exit(1);
    }
    console.log(String(data.result).trim());
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
