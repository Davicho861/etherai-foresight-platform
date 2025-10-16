import express from 'express';

const router = express.Router();

// Helper to dynamically load a module
async function safeLoad(modulePath) {
  try {
    const im = await import(modulePath);
    return im && (im.default || im);
  } catch {
    try {
      const r = require(modulePath);
      return r && (r.default || r);
    } catch {
      throw new Error(`Failed to load module: ${modulePath}`);
    }
  }
}

// GET /api/eternal-vigilance/stream
router.get('/stream', async (req, res) => {
  try {
    const { token } = req.query;
    const sseCookie = req.cookies && req.cookies.praevisio_sse_token;

    // Get token service
    const tokenService = await safeLoad('../services/sseTokenService.js');
    const validateToken = tokenService && tokenService.validateToken;
    const generateInitialState = tokenService && tokenService.generateInitialState;

    if (!token && !sseCookie) {
      return res.status(401).json({
        success: false,
        error: 'missing_token',
        message: 'No SSE token provided'
      });
    }

    const validToken = await validateToken(token || sseCookie);
    if (!validToken) {
      return res.status(401).json({
        success: false,
        error: 'invalid_token',
        message: 'Invalid SSE token'
      });
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Send initial state
    const initialState = await generateInitialState();
    res.write('event: init\n');
    res.write(`data: ${JSON.stringify(initialState)}\n\n`);

    // Subscribe to updates
    const sseService = await safeLoad('../services/sseService.js');
    const subscribe = sseService && sseService.subscribe;

    await subscribe(res);
  } catch (error) {
    console.error('Error in SSE stream:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error: Could not initialize SSE stream.'
    });
  }
});

// POST /api/eternal-vigilance/token
router.post('/token', async (req, res) => {
  try {
    const { ttl = 3600 } = req.body;

    // Get token service
    const tokenService = await safeLoad('../services/sseTokenService.js');
    const generateToken = tokenService && tokenService.generateToken;

    const { token, expiresAt } = await generateToken(ttl);

    // Set cookie
    res.cookie('praevisio_sse_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: new Date(expiresAt)
    });

    res.status(200).json({
      success: true,
      token,
      expiresAt
    });
  } catch (error) {
    console.error('Error generating SSE token:', error);
    res.status(500).json({
      success: false,
      error: 'token_generation_failed',
      message: 'Could not generate SSE token'
    });
  }
});

export default router;