import express from 'express';
import path from 'path';
import { createRequire } from 'module';

const requireC = createRequire(import.meta.url);
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Require fs at request time so tests that spy on require('fs') take effect
    const fs = requireC('fs');
    // Try several likely locations because process.cwd() may be 'server' or repo root
    const candidates = [
      path.join(process.cwd(), 'server', 'data', 'GLOBAL_OFFERING_PROTOCOL.json'),
      path.join(process.cwd(), 'server', 'GLOBAL_OFFERING_PROTOCOL.json'),
      path.join(process.cwd(), 'data', 'GLOBAL_OFFERING_PROTOCOL.json'),
      path.join(process.cwd(), '..', 'server', 'data', 'GLOBAL_OFFERING_PROTOCOL.json'),
      path.join(process.cwd(), '..', 'GLOBAL_OFFERING_PROTOCOL.json'),
      path.join(process.cwd(), 'GLOBAL_OFFERING_PROTOCOL.json')
    ];
    let dataPath = null;
    for (const c of candidates) {
      try {
        const ex = fs.existsSync(c);
        console.log('pricing-plans existsSync', c, ex);
        if (ex) { dataPath = c; break; }
      } catch (e) { console.log('pricing-plans existsSync error', c, e && e.message); }
    }
    if (!dataPath) return res.status(404).json({ error: 'pricing mock not found' });
    const raw = fs.readFileSync(dataPath, 'utf8');
    const json = JSON.parse(raw);

    // normalize response shape: accept either { plans: [...] } or { segments: {...} }
    if (json.segments) {
      return res.json({ currency: json.currency || 'USD', segments: json.segments });
    }
    if (Array.isArray(json.plans)) {
      const mapped = json.plans.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price_monthly || p.price || 0,
        features: p.features || [],
        description: p.description || ''
      }));
      return res.json({ currency: json.currency || 'USD', segments: { default: { name: 'Planes', plans: mapped } } });
    }
    return res.status(500).json({ error: 'unrecognized pricing format' });
  } catch (err) {
    console.error('pricing-plans error', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
