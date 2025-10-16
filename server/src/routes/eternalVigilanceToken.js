import express from 'express';
import rateLimit from 'express-rate-limit';
// require sseTokenService at request time so tests can mock it

const router = express.Router();

const tokenLimiter = rateLimit({ windowMs: 60 * 1000, max: 5, message: { error: 'Too many token requests, try later' } });

// POST /token -> returns { token, expiresAt }
router.post('/token', tokenLimiter, async (req, res) => {
  try {
    const sseTokenService = require('../sseTokenService.js').default || require('../sseTokenService.js');
    const ttl = Number(req.body && req.body.ttl) || 60; // seconds
    const { token, expiresAt } = await sseTokenService.generateToken(ttl);
  // Ensure cookie contains the exact token string returned by the service
  const cookieOptions = { httpOnly: false, secure: process.env.NODE_ENV === 'production', maxAge: Math.max(1000, expiresAt - Date.now()), sameSite: 'lax', path: '/' };
  res.cookie('praevisio_sse_token', String(token), cookieOptions);
    res.json({ token, expiresAt });
  } catch (e) {
    console.error('Error generating token:', e);
    res.status(500).json({ error: 'Could not generate token' });
  }
});

export default router;
