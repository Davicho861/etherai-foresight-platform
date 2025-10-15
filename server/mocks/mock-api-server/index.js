import express from 'express';
import path from 'path';
import fs from 'fs';

// In-memory storage for SSE events
let sseClients = [];
let eventQueue = [];

const app = express();
const PORT = process.env.MOCK_API_PORT || 3001;

const mocksDir = path.resolve(process.cwd(), 'mocks', 'api');

app.get('/health', (req, res) => res.json({ status: 'ok', source: 'mock-api-server' }));

// Mock platform status endpoint
app.get('/api/platform-status', (req, res) => {
  res.json({
    statusGeneral: 'OPERACIONAL',
    componentes: {
      apiPrincipal: { status: 'ONLINE', latencia_ms: 50 },
      baseDeDatos: { status: 'ONLINE', conexionesActivas: 15 },
      motorPredictivoIA: { status: 'ACTIVO', modelosCargados: 3 },
      pipelineDeDatos: { status: 'ONLINE', ultimoIngreso: 'Hace 1 hora' }
    },
    analisisActivos: 5,
    alertasCriticas: 1,
    cargaDelSistema: 30.0
  });
});

// Generic endpoint to return a mock file by name: /mock/open-meteo
app.get('/mock/:name', (req, res) => {
  const name = req.params.name;
  const filePath = path.join(mocksDir, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'mock not found', name });
  }
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(content);
    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: 'failed to read mock', message: err.message });
  }
});

// Healthier catch-all that serves static JSON files for common external endpoints
// Flexible routing: map known external API path segments to mock JSON files.
app.get(['/open-meteo', '/open-meteo/*', '/open-meteo/forecast'], (req, res) => {
  const filePath = path.join(mocksDir, 'open-meteo.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

app.get(['/gdelt', '/gdelt/*', '/gdelt/events', '/gdelt/events/*'], (req, res) => {
  const filePath = path.join(mocksDir, 'gdelt.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

app.get(['/world-bank', '/world-bank/*'], (req, res) => {
  const filePath = path.join(mocksDir, 'world-bank.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

app.get(['/fmi', '/fmi/*'], (req, res) => {
  const filePath = path.join(mocksDir, 'fmi.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

app.get(['/usgs', '/usgs/*', '/usgs/summary'], (req, res) => {
  const filePath = path.join(mocksDir, 'usgs.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

app.get(['/sim', '/sim/*'], (req, res) => {
  const filePath = path.join(mocksDir, 'sim.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

app.get(['/inei', '/inei/*'], (req, res) => {
  const filePath = path.join(mocksDir, 'inei.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

app.get(['/minagri', '/minagri/*'], (req, res) => {
  const filePath = path.join(mocksDir, 'minagri.json');
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'mock not found' });
  const content = fs.readFileSync(filePath, 'utf8');
  return res.json(JSON.parse(content));
});

// SSE endpoint for eternal vigilance
app.get('/api/eternal-vigilance/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Cache-Control',
  });

  // Send init event
  res.write('event: init\n');
  res.write('data: {"status": "connected", "message": "Vigilia Eterna activada"}\n\n');

  // Add client to list
  sseClients.push(res);

  // Send periodic activity events
  const interval = setInterval(() => {
    const activities = [
      { type: 'profecía', message: 'Actualizando índices de riesgo global en tiempo real' },
      { type: 'conocimiento', message: 'Kairós escaneando fuentes de datos para oportunidades' },
      { type: 'auto-preservación', message: 'Iniciando chequeo de salud completo del sistema' }
    ];
    const activity = activities[Math.floor(Math.random() * activities.length)];
    const eventData = {
      type: activity.type,
      message: activity.message,
      timestamp: new Date().toISOString()
    };
    res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  }, 5000); // Every 5 seconds

  // Handle client disconnect
  req.on('close', () => {
    clearInterval(interval);
    sseClients = sseClients.filter(client => client !== res);
  });
});

// Mock food resilience endpoints
app.get('/api/food-resilience/prices', (req, res) => {
  res.json({
    country: 'Peru',
    prices: [
      { product: 'rice', price: 2.5, unit: 'kg', date: '2024-10-01' },
      { product: 'wheat', price: 3.0, unit: 'kg', date: '2024-10-01' }
    ]
  });
});

app.get('/api/food-resilience/supply-chain', (req, res) => {
  res.json({
    country: 'Peru',
    supplyChain: [
      { product: 'rice', supply: 1000, demand: 950, status: 'stable' },
      { product: 'wheat', supply: 800, demand: 900, status: 'shortage' }
    ]
  });
});

app.post('/api/food-resilience/prediction', express.json(), (req, res) => {
  res.json({
    product: req.body.product || 'rice',
    prediction: 'Price will increase by 10% in next month',
    confidence: 0.85
  });
});

// Endpoint to emit custom events to SSE stream
app.post('/api/eternal-vigilance/emit', express.json(), (req, res) => {
  const { type, message } = req.body;
  const eventData = {
    type: type || 'custom',
    message: message || 'Evento personalizado',
    timestamp: new Date().toISOString()
  };

  // Send to all connected clients
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify(eventData)}\n\n`);
  });

  res.json({ success: true, event: eventData });
});

app.listen(PORT, () => console.log(`Mock API server listening on port ${PORT}`));
