import express from 'express';
import { nanoid } from 'nanoid';
import * as kernelModule from '../orchestrator.js';
const kernel = kernelModule.kernel || (kernelModule.default && kernelModule.default.kernel) || kernelModule;
import { subscribe } from '../eventHub.js';
import cache from '../cache.js';

const router = express.Router();

// Mapa de conexiones SSE activas por missionId
const activeStreams = new Map();

// POST /api/agent/start-mission
router.post('/start-mission', async (req, res) => {
  try {
    const { missionContract } = req.body;
    if (!missionContract) return res.status(400).json({ error: 'missionContract is required' });

    const missionId = nanoid();

    // Iniciar la misión de forma asíncrona; la orquestación emitirá logs mediante el callback
    kernel.startMission(missionId, missionContract, (log) => {
      const conns = activeStreams.get(missionId) || [];
      conns.forEach((c) => {
        try {
          c.write(`data: ${JSON.stringify(log)}\n\n`);
        } catch {
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

// POST /api/agent/start-tyche-mission -> helper para la Misión Génesis: crear Tyche
router.post('/start-tyche-mission', async (req, res) => {
  try {
    const missionContract = {
      id: 'genesis-tyche',
      title: 'Misión Génesis: Crear Agente Tyche',
      description: "Crear e integrar al agente 'Tyche' que detecta flaky tests y propone correcciones. Automatizar PR local.",
      parameters: { target: 'tests', scope: 'repository' }
    };
    const missionId = nanoid();
    kernel.startMission(missionId, missionContract, (log) => {
      const conns = activeStreams.get(missionId) || [];
      conns.forEach((c) => {
        try { c.write(`data: ${JSON.stringify(log)}\n\n`); } catch { /* ignore */ }
      });
    });
    return res.json({ missionId });
  } catch (err) {
    console.error('Error starting tyche mission', err);
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
  const mission = kernel.getMissionLogs(id) || { logs: [], status: 'not_found' };
  (mission.logs || []).forEach((l) => {
    try { res.write(`data: ${JSON.stringify(l)}\n\n`); } catch { /* ignore */ }
  });

  // Suscribirse a eventos futuros para esta misión
  const unsub = subscribe(id, (ev) => {
    try { res.write(`data: ${JSON.stringify(ev)}\n\n`); } catch { /* ignore */ }
  });

  // Manejar cierre de conexión y limpieza
  req.on('close', () => {
    try { unsub(); } catch { /* ignore */ }
    const conns = activeStreams.get(id) || [];
    const i = conns.indexOf(res);
    if (i > -1) conns.splice(i, 1);
    if (conns.length === 0) activeStreams.delete(id);
  });
});

// GET /api/agent/vigilance/status -> Get eternal vigilance status with caching
router.get('/vigilance/status', (req, res) => {
  try {
    // Cache key for vigilance status (short TTL since this is dynamic data)
    const cacheKey = 'vigilance:status';

    // Check cache first (TTL: 30 seconds)
    const cachedStatus = cache.get(cacheKey);
    if (cachedStatus) {
      return res.json(cachedStatus);
    }

    const status = kernel.getVigilanceStatus();

    // Cache result for 30 seconds
    cache.set(cacheKey, status, 30000);

    return res.json(status);
  } catch (err) {
    console.error('Error getting vigilance status', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/agent/vigilance/report -> Generate eternal vigilance report
router.post('/vigilance/report', async (req, res) => {
  try {
    const status = kernel.getVigilanceStatus();
    const reportContent = `# ETERNAL_VIGILANCE_REPORT

## Resumen de la Vigilia Eterna
Sistema Praevisio AI operando en modo de Vigilia Eterna desde ${new Date().toISOString()}

## Estado de los Flujos Perpetuos
- **Auto-Preservación**: ${status.flows.autoPreservation.active ? 'Activo' : 'Inactivo'}
  - Última ejecución: ${status.flows.autoPreservation.lastRun || 'Nunca'}
- **Conocimiento**: ${status.flows.knowledge.active ? 'Activo' : 'Inactivo'}
  - Última ejecución: ${status.flows.knowledge.lastRun || 'Nunca'}
- **Profecía**: ${status.flows.prophecy.active ? 'Activo' : 'Inactivo'}
  - Última ejecución: ${status.flows.prophecy.lastRun || 'Nunca'}

## Índices de Riesgo Actuales
${Object.entries(status.riskIndices).map(([country, data]) =>
  `- **${country}**: ${data.riskScore.toFixed(1)}/10 (${data.level})`
).join('\n')}

## Registro de Actividad (${status.activityFeed.length} entradas)
${status.activityFeed.map(entry =>
  `- [${entry.timestamp}] ${entry.flow}: ${entry.message}`
).join('\n')}

## Conclusión
La Vigilia Eterna está operativa. El sistema Aion mantiene la conciencia perpetua y la auto-evolución.

Generado por Praevisio AI - ${new Date().toISOString()}
`;

    const fs = await import('fs');
    const path = await import('path');
    const reportPath = path.resolve(process.cwd(), 'ETERNAL_VIGILANCE_REPORT.md');
    fs.writeFileSync(reportPath, reportContent);

    return res.json({ reportPath, message: 'Reporte generado exitosamente' });
  } catch (err) {
    console.error('Error generating vigilance report', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;