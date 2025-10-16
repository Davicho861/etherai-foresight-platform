import express from 'express';
// Do not import vigilance or sseTokenService at module load time so tests can mock them with jest.doMock

const router = express.Router();

// Allow EventSource to authenticate via query param: /stream?token=xxx
router.get('/stream', async (req, res) => {
  // prefer token from cookie (praevisio_sse_token), fallback to query param for backward compatibility
  const cookieToken = req.cookies && req.cookies.praevisio_sse_token ? String(req.cookies.praevisio_sse_token) : '';
  const token = cookieToken || (req.query && (req.query.token || req.query.auth) ? String(req.query.token || req.query.auth) : '');
  const expected = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

  // require services at request time so tests can override them
  const sseTokenService = require('../sseTokenService.js').default || require('../sseTokenService.js');
  const vigilance = require('../eternalVigilanceService.js').default || require('../eternalVigilanceService.js');

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
  // send initial state (stringified event)
  try {
    const state = (typeof vigilance.getState === 'function') ? vigilance.getState() : {};
    res.write(`data: ${JSON.stringify({ event: 'init', state })}\n\n`);
  } catch (e) {
    // ignore write errors
  }

  if (typeof vigilance.subscribe === 'function') vigilance.subscribe(res);

  req.on('close', () => {
    if (typeof vigilance.unsubscribe === 'function') vigilance.unsubscribe(res);
  });
});

export default router;
