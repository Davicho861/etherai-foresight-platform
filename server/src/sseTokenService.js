import crypto from 'crypto';
import { createClient } from 'redis';

const REDIS_URL = process.env.REDIS_URL || '';
let redisClient = null;

if (REDIS_URL) {
  redisClient = createClient({ url: REDIS_URL });
  redisClient.connect().catch(() => {
    // ignore connection errors; fallback to in-memory
    redisClient = null;
  });
}

// in-memory fallback
const store = {};

async function generateToken(ttlSeconds = 60) {
  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = Date.now() + ttlSeconds * 1000;
  if (redisClient) {
    await redisClient.set(`sse:${token}`, String(expiresAt), { PX: ttlSeconds * 1000 });
  } else {
    store[token] = { expiresAt };
  }
  return { token, expiresAt };
}

async function validateToken(token) {
  if (!token) return false;
  if (redisClient) {
    try {
      const v = await redisClient.get(`sse:${token}`);
      return !!v;
    } catch (e) {
      console.error('Redis validation error:', e);
      // fallback to memory
    }
  }
  const entry = store[token];
  if (!entry) return false;
  if (Date.now() > entry.expiresAt) {
    delete store[token];
    return false;
  }
  return true;
}

function cleanupExpired() {
  const now = Date.now();
  for (const t of Object.keys(store)) {
    if (store[t].expiresAt <= now) delete store[t];
  }
}

setInterval(cleanupExpired, 60 * 1000).unref && setInterval(cleanupExpired, 60 * 1000).unref();

export default { generateToken, validateToken };
