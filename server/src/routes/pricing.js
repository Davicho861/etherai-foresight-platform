import express from 'express';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Read the GLOBAL_OFFERING_PROTOCOL.json and expose structured plans
const PROTOCOL_PATH = path.resolve(process.cwd(), 'GLOBAL_OFFERING_PROTOCOL.json');

function readProtocol() {
  try {
    const raw = fs.readFileSync(PROTOCOL_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read GLOBAL_OFFERING_PROTOCOL.json:', err?.message || err);
    return null;
  }
}

router.get('/', (req, res) => {
  // Try several likely locations because tests may mock different paths
  const candidates = [
    path.join(process.cwd(), 'server', 'data', 'GLOBAL_OFFERING_PROTOCOL.json'),
    path.join(process.cwd(), 'server', 'GLOBAL_OFFERING_PROTOCOL.json'),
    path.join(process.cwd(), 'data', 'GLOBAL_OFFERING_PROTOCOL.json'),
    path.join(process.cwd(), '..', 'server', 'data', 'GLOBAL_OFFERING_PROTOCOL.json'),
    path.join(process.cwd(), '..', 'GLOBAL_OFFERING_PROTOCOL.json'),
    PROTOCOL_PATH
  ];
  let found = null;
  for (const c of candidates) {
    try { if (fs.existsSync(c)) { found = c; break; } } catch (er) { /* ignore */ }
  }
  if (!found) return res.status(404).json({ error: 'pricing protocol not found' });

  let protocol = null;
  try {
    const raw = fs.readFileSync(found, 'utf-8');
    protocol = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to read protocol at', found, e && e.message);
    return res.status(500).json({ error: 'protocol not available' });
  }

  // Transform into a consumable response for the frontend
  const segments = protocol.segments || {};
  const response = {
    currency: protocol.currency || 'USD',
    globalSettings: protocol.globalSettings || {},
    segments: Object.keys(segments).reduce((acc, key) => {
      acc[key] = {
        name: segments[key].name,
        plans: segments[key].plans || []
      };
      return acc;
    }, {}),
  };

  // Optionally include a pantheonOffering if present (backward compat)
  if (protocol.pantheonOffering) response.pantheonOffering = protocol.pantheonOffering;

  res.json(response);
});

export default router;
