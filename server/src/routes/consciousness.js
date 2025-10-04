import express from 'express';
import { getChromaClient } from '../database.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// GET /api/consciousness
router.get('/', async (req, res) => {
  try {
    const client = getChromaClient();
    const clientUsable = client && typeof client.getOrCreateCollection === 'function' && !client.mock;
    if (clientUsable) {
      const collection = await client.getOrCreateCollection({ name: 'failure_patterns' });
      const all = await collection.get();
      const docs = (all || {}).documents || [];
      const metadatas = (all || {}).metadatas || [];
      const ids = (all || {}).ids || [];
      const result = ids.map((id, i) => ({ id, error: docs[i], metadata: metadatas[i] }));
      return res.json({ source: 'chroma', items: result });
    }

    // Fallback: read local JSONL
    const p = path.join(process.cwd(), 'server', 'data', 'failure_patterns.jsonl');
    const exists = await fs.access(p).then(() => true).catch(() => false);
    if (!exists) return res.json({ source: 'local', items: [] });
    const txt = await fs.readFile(p, 'utf8');
    const lines = txt.split('\n').filter(Boolean);
    const items = lines.map(l => { try { return JSON.parse(l); } catch (e) { return { raw: l }; } });
    return res.json({ source: 'local', items });
  } catch (e) {
    console.error('consciousness route error', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
