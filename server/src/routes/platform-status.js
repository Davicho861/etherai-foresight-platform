import express from 'express';
import os from 'os';
const router = express.Router();

// GET /api/platform-status
router.get('/', (req, res) => {
  const native = process.env.NATIVE_DEV_MODE === 'true';
  const fallback = (global.__praevisio_chroma_fallback && global.__praevisio_chroma_fallback['missions_logs']) ? global.__praevisio_chroma_fallback['missions_logs'].length : 0;
  const port = process.env.PORT ? Number(process.env.PORT) : 4001;
  res.json({
    statusGeneral: 'OPERACIONAL',
    nativeMode: native,
    ports: { backend: port, frontend: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 3002 },
    fallbackCounts: { chromaMissionsLogs: fallback },
    componentes: {
      apiPrincipal: { status: 'ONLINE', pid: process.pid },
      baseDeDatos: { status: native ? 'SQLITE' : 'EXTERNA', conexionesActivas: native ? 1 : 32 },
      motorPredictivoIA: { status: 'ACTIVO', modelosCargados: 5 },
      pipelineDeDatos: { status: 'DEGRADADO', ultimoIngreso: 'Hace 2 horas' }
    },
    analisisActivos: 8,
    alertasCriticas: 0,
    cargaDelSistema: os.loadavg()[0]
  });
});

export default router;
