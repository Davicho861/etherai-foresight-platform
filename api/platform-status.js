export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simulación de estado operativo realista
  res.json({
    statusGeneral: 'OPERACIONAL',
    componentes: {
      apiPrincipal: { status: 'ONLINE', latencia_ms: 75 },
      baseDeDatos: { status: 'ONLINE', conexionesActivas: 32 },
      motorPredictivoIA: { status: 'ACTIVO', modelosCargados: 5 },
      pipelineDeDatos: { status: 'DEGRADADO', ultimoIngreso: 'Hace 2 horas' }
    },
    analisisActivos: 8,
    alertasCriticas: 3,
    cargaDelSistema: 45.5
  });
}