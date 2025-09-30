#!/usr/bin/env node
// Simple mock Ollama HTTP API for local validation/testing using built-in http
import http from 'http';

const port = Number(process.env.MOCK_OLLAMA_PORT || 11434);

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('mock-ollama');
    return;
  }
  if (req.method === 'POST' && req.url === '/api/generate') {
    let body = '';
    req.on('data', (chunk) => { body += chunk.toString(); });
    req.on('end', () => {
      let prompt = '';
      try {
        const j = JSON.parse(body || '{}');
        prompt = j.prompt || j.input || j.messages || '';
      } catch (e) {
        prompt = body;
      }
      const out = { results: [{ content: `MOCK_RESPONSE: ${String(prompt).slice(0,200)}` }] };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(out));
      return;
    });
    return;
  }
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('not found');
});

server.listen(port, () => console.log(`Mock Ollama listening on http://localhost:${port}`));
