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
  const protocol = readProtocol();
  if (!protocol) return res.status(500).json({ error: 'protocol not available' });

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

// Alias for /pricing-plans used by frontend
router.get('/pricing-plans', (req, res) => {
  const protocol = readProtocol();
  if (!protocol) return res.status(500).json({ error: 'protocol not available' });

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
