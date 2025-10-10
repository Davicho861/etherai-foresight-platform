import express from 'express';
import path from 'path';

const router = express.Router();

router.get('/', async (req, res) => {
  const native = process.env.NATIVE_DEV_MODE === 'true';
  const sqlitePath = path.resolve(process.cwd(), 'server', 'prisma', 'dev.db');
  res.json({
    status: 'ok',
    nativeMode: native,
    sqliteFile: sqlitePath,
    note: native ? 'External vector/graph DBs disabled' : 'External DBs may be enabled'
  });
});

export default router;
