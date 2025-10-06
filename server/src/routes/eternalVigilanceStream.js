import express from 'express';
import vigilance from '../eternalVigilanceService.js';
import sseTokenService from '../sseTokenService.js';

const router = express.Router();

// Allow EventSource to authenticate via query param: /stream?token=xxx
router.get('/stream', async (req, res) => {
  // prefer token from cookie (praevisio_sse_token), fallback to query param for backward compatibility
  const cookieToken = req.cookies && req.cookies.praevisio_sse_token ? String(req.cookies.praevisio_sse_token) : '';
  const token = cookieToken || (req.query && (req.query.token || req.query.auth) ? String(req.query.token || req.query.auth) : '');
  const expected = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';
  const okStatic = token && token === expected;
  const okTemp = token && (await sseTokenService.validateToken(token));
  if (!okStatic && !okTemp) {
    // return 401 to the client
    res.status(401).json({ error: 'Unauthorized - invalid token' });
    return;
  }
  // headers SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders && res.flushHeaders();

  // send initial state
  res.write(`data: ${JSON.stringify({ event: 'init', state: vigilance.getState() })}\n\n`);

  vigilance.subscribe(res);

  req.on('close', () => {
    vigilance.unsubscribe(res);
  });
});

export default router;
