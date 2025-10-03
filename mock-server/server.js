const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Function to read JSON file
const readJsonFile = (filename) => {
  const filePath = path.join(__dirname, 'mocks', filename);
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filename}:`, error);
    return null;
  }
};

// Routes
app.get('/api/platform-status', (req, res) => {
  const data = readJsonFile('platform-status.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Mock data not found' });
  }
});

app.get('/api/pricing-plans', (req, res) => {
  const data = readJsonFile('pricing-plans.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Mock data not found' });
  }
});

app.post('/api/agent/start-mission', (req, res) => {
  const data = readJsonFile('agent-start-mission.json');
  if (data) {
    res.json(data);
  } else {
    res.status(500).json({ error: 'Mock data not found' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
});