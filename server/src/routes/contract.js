import express from 'express';
import { metatronOrchestrator } from '../orchestrator.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Middleware de autenticación básica (Bearer Token)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.PRAEVISIO_BEARER_TOKEN || 'demo-token';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autorización requerido' });
  }

  const token = authHeader.substring(7);
  if (token !== expectedToken) {
    return res.status(403).json({ error: 'Token inválido' });
  }

  next();
};

// Crear nuevo contrato inteligente
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ error: 'Título y descripción son requeridos' });
    }

    const contract = await metatronOrchestrator.createContract({
      title,
      description,
      priority: priority || 'MEDIUM'
    });

    res.status(201).json({
      success: true,
      contract: {
        id: contract.id,
        title: contract.title,
        status: contract.status,
        priority: contract.priority,
        oracleReport: contract.oracleReport,
        ethicalReview: contract.ethicalReview,
        createdAt: contract.createdAt
      }
    });
  } catch (error) {
    console.error('Error creando contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Ejecutar contrato
router.post('/:id/execute', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    // Iniciar ejecución en background
    metatronOrchestrator.executeContract(id, (logData) => {
      // Aquí se podría implementar WebSocket para logs en tiempo real
      console.log('Log de contrato:', logData);
    }).then(result => {
      console.log('Contrato ejecutado:', result);
    }).catch(error => {
      console.error('Error ejecutando contrato:', error);
    });

    res.json({
      success: true,
      message: 'Ejecución de contrato iniciada',
      contractId: id
    });
  } catch (error) {
    console.error('Error ejecutando contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener estado de contrato
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await metatronOrchestrator.getContractStatus(id);

    if (contract.status === 'not_found') {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }

    res.json({ success: true, contract });
  } catch (error) {
    console.error('Error obteniendo contrato:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Listar contratos con filtros
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, priority, limit = 20, offset = 0 } = req.query;

    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const contracts = await prisma.missionContract.findMany({
      where,
      include: {
        crew: { select: { id: true, name: true, type: true } },
        oracleReport: { select: { riskLevel: true, recommendations: true } },
        ethicalReview: { select: { approved: true, score: true } },
        logs: {
          orderBy: { timestamp: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    const total = await prisma.missionContract.count({ where });

    res.json({
      success: true,
      contracts,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error listando contratos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener métricas de la economía interna (Panel de Metatrón)
router.get('/api/economy/metrics', authenticate, async (req, res) => {
  try {
    const metrics = await metatronOrchestrator.getEconomyMetrics();
    res.json({ success: true, metrics });
  } catch (error) {
    console.error('Error obteniendo métricas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener métricas éticas
router.get('/api/ethics/metrics', authenticate, async (req, res) => {
  try {
    const { EthicalCouncil } = await import('../ethicalCouncil.js');
    const council = new EthicalCouncil();
    const metrics = await council.getEthicalMetrics();
    res.json({ success: true, metrics });
  } catch (error) {
    console.error('Error obteniendo métricas éticas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener explorador de conciencia colectiva
router.get('/api/consciousness/explore', authenticate, async (req, res) => {
  try {
    const { type, limit = 10 } = req.query;

    const where = {};
    if (type) where.type = type;

    const entries = await prisma.collectiveConsciousness.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: parseInt(limit)
    });

    res.json({ success: true, entries });
  } catch (error) {
    console.error('Error explorando conciencia colectiva:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Iniciar Misión Génesis Omega
router.post('/api/genesis-omega/initiate', authenticate, async (req, res) => {
  try {
    const { metatronOrchestrator } = await import('../orchestrator.js');

    // Iniciar misión en background
    metatronOrchestrator.initiateGenesisOmega((logData) => {
      console.log('📊 Log de Génesis Omega:', logData);
    }).then(result => {
      console.log('🎉 Génesis Omega completada:', result);
    }).catch(error => {
      console.error('❌ Error en Génesis Omega:', error);
    });

    res.json({
      success: true,
      message: 'Misión Génesis Omega iniciada - El sistema se auto-mejorará',
      status: 'initiated'
    });
  } catch (error) {
    console.error('Error iniciando Génesis Omega:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Obtener estado de Misión Génesis
router.get('/api/genesis-omega/status', authenticate, async (req, res) => {
  try {
    // Buscar contratos de Génesis
    const genesisContracts = await prisma.missionContract.findMany({
      where: {
        title: { contains: 'Génesis Omega' }
      },
      include: {
        oracleReport: true,
        ethicalReview: true,
        logs: { orderBy: { timestamp: 'desc' }, take: 20 }
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    });

    if (genesisContracts.length === 0) {
      return res.json({
        success: true,
        status: 'not_started',
        message: 'Misión Génesis Omega no ha sido iniciada'
      });
    }

    const genesis = genesisContracts[0];
    const isCompleted = genesis.status === 'COMPLETED';

    res.json({
      success: true,
      genesis: {
        id: genesis.id,
        status: genesis.status,
        completed: isCompleted,
        oracleReport: genesis.oracleReport,
        ethicalReview: genesis.ethicalReview,
        logs: genesis.logs,
        createdAt: genesis.createdAt,
        completedAt: genesis.completedAt
      }
    });
  } catch (error) {
    console.error('Error obteniendo estado de Génesis:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

export default router;