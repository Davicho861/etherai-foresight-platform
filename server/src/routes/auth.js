import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const router = express.Router();

// JWT Secret - In production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'praevisio-hephaestus-sovereign-secret-key-2025';

// Middleware to verify JWT tokens
export const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (String(username) === 'admin' && String(password) === 'admin') {
      // Create JWT token with user info
      const token = jwt.sign(
        {
          sub: 'admin',
          role: 'admin',
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
        },
        JWT_SECRET
      );
      return res.json({ success: true, token });
    }
    return res.status(401).json({ error: 'Invalid credentials' });
  } catch (err) {
    console.error('Auth error', err);
    res.status(500).json({ error: 'Internal error' });
  }
});

export default router;
