import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
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
      if (fs.existsSync(c)) { dataPath = c; break; }
    }
    if (!dataPath) return res.status(404).json({ error: 'pricing mock not found' });
    const raw = fs.readFileSync(dataPath, 'utf8');
  const json = JSON.parse(raw);
  console.log('pricing-plans: read dataPath=', dataPath);
  console.log('pricing-plans: json keys=', Object.keys(json));
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
