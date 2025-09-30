import express from 'express';
import { nanoid } from 'nanoid';
import { orchestrator } from '../orchestrator.js';
import { subscribe } from '../eventHub.js';

const router = express.Router();

// Mapa de conexiones SSE activas por missionId
const activeStreams = new Map();

// POST /api/agent/start-mission
router.post('/start-mission', async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Description is required' });

    const missionId = nanoid();

    // Iniciar la misión de forma asíncrona; la orquestación emitirá logs mediante el callback
    orchestrator.startMission(missionId, { description }, (log) => {
      const conns = activeStreams.get(missionId) || [];
      conns.forEach((c) => {
        try {
          c.write(`data: ${JSON.stringify(log)}\n\n`);
        } catch (e) {
          // ignore broken pipe
        }
      });
    });

    return res.json({ missionId });
  } catch (err) {
    console.error('Error starting mission', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/agent/mission/:id/stream  -> SSE stream
router.get('/mission/:id/stream', (req, res) => {
  const { id } = req.params;

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  if (!activeStreams.has(id)) activeStreams.set(id, []);
  activeStreams.get(id).push(res);

  // Enviar logs ya existentes (si los hay)
  const mission = orchestrator.getMissionLogs(id) || { logs: [], status: 'not_found' };
  (mission.logs || []).forEach((l) => {
    try { res.write(`data: ${JSON.stringify(l)}\n\n`); } catch (e) { /* ignore */ }
  });

  // Suscribirse a eventos futuros para esta misión
  const unsub = subscribe(id, (ev) => {
    try { res.write(`data: ${JSON.stringify(ev)}\n\n`); } catch (e) { /* ignore */ }
  });

  // Manejar cierre de conexión y limpieza
  req.on('close', () => {
    try { unsub(); } catch (e) { /* ignore */ }
    const conns = activeStreams.get(id) || [];
    const i = conns.indexOf(res);
    if (i > -1) conns.splice(i, 1);
    if (conns.length === 0) activeStreams.delete(id);
  });
});

export default router;