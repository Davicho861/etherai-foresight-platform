#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const llmRouter = require('../server/src/routes/llm.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use('/api/llm', (req, res, next) => {
  // simple bearer pass-through for local testing
  const auth = req.headers['authorization'] || '';
  if (!auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Unauthorized' });
  next();
}, llmRouter);

const PORT = process.env.PORT || 45100;
app.listen(PORT, () => console.log(`LLM test server running on http://localhost:${PORT}`));
