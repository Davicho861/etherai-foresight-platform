import express from 'express';
let prisma;
try {
  prisma = (await import('../prisma.js')).default;
} catch {
  // prisma may not be available yet (before install); fallback to memory
}

const router = express.Router();

const storage = global.__PRAEVISIO_CONTACTS = global.__PRAEVISIO_CONTACTS || [];

function makeId(prefix = 'id') {
  return `${prefix}_${Math.random().toString(36).slice(2,8)}`;
}

router.post('/', async (req, res) => {
  const { name, email, organization, message, interestedModule } = req.body || {};
  if (!name || !email) return res.status(400).json({ error: 'name and email required' });

  if (prisma) {
    const lead = await prisma.lead.create({ data: { name, email, sector: interestedModule || null, message: message || null } });
    return res.status(201).json({ status: 'saved', id: lead.id, createdAt: lead.createdAt });
  }

  const record = { id: makeId('c'), name, email, organization: organization || null, message: message || null, interestedModule: interestedModule || null, createdAt: new Date().toISOString() };
  storage.push(record);
  return res.status(201).json({ status: 'saved', id: record.id, createdAt: record.createdAt });
});

router.get('/', async (req, res) => {
  if (prisma) {
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: 'desc' } });
    return res.json(leads);
  }
  res.json(storage.slice().reverse());
});

export default router;
