// Servicio de Vigilia Eterna integrado con Logos Kernel
// Conecta el estado real del kernel con el panel frontend
let subscribers = [];
let kernel = null;

// Importar kernel dinámicamente para evitar dependencias circulares
(async () => {
  try {
    const { kernel: importedKernel } = await import('./orchestrator.js');
    kernel = importedKernel;
    console.log('Kernel integrado con Eternal Vigilance Service');
  } catch (e) {
    console.error('Error importing kernel:', e);
  }
})();

function publish(ev) {
  // notify SSE subscribers
  const payload = JSON.stringify({ event: ev, state: getState() });
  subscribers.forEach((res) => {
    try {
      res.write(`data: ${payload}\n\n`);
    } catch (e) {
      console.error('Error publishing to subscriber:', e);
    }
  });
}

export function getState() {
  if (!kernel) {
    return {
      indices: { globalRisk: 0, stability: 100 },
      flows: {
        autoPreservation: { active: false, lastRun: null },
        knowledge: { active: false, lastRun: null },
        prophecy: { active: false, lastRun: null },
      },
      riskIndices: {},
      activityFeed: ['Sistema no inicializado'],
    };
  }

  const vigilanceStatus = kernel.getVigilanceStatus();
  return {
    indices: {
      globalRisk: Object.values(vigilanceStatus.riskIndices).reduce((sum, data) => sum + data.riskScore, 0) / Math.max(1, Object.keys(vigilanceStatus.riskIndices).length) || 0,
      stability: 100 - (Object.values(vigilanceStatus.riskIndices).reduce((sum, data) => sum + data.riskScore, 0) / Math.max(1, Object.keys(vigilanceStatus.riskIndices).length) || 0)
    },
    flows: vigilanceStatus.flows,
    riskIndices: vigilanceStatus.riskIndices,
    activityFeed: vigilanceStatus.activityFeed,
  };
}

export function subscribe(res) {
  subscribers.push(res);
}

export function unsubscribe(res) {
  subscribers = subscribers.filter(r => r !== res);
}

export function clearState() {
  // No necesitamos limpiar estado ya que viene del kernel
  console.log('Estado de vigilia eterna limpiado');
}

export function start() {
  if (!kernel) {
    console.error('Kernel no disponible para iniciar vigilia');
    return;
  }

  console.log('Iniciando Vigilia Eterna integrada con Logos Kernel');
  publish('Vigilia Eterna iniciada: Aion está despierto');

  // Los flujos perpetuos ya están corriendo en el kernel
  // Solo notificamos que la vigilia está activa
}

export function stop() {
  if (!kernel) {
    console.error('Kernel no disponible para detener vigilia');
    return;
  }

  console.log('Deteniendo Vigilia Eterna');
  kernel.stopPerpetualFlows();
  publish('Vigilia Eterna detenida: Aion en reposo');
}

export function generateReport() {
  const state = getState();
  const header = '# ETERNAL_VIGILANCE_REPORT - Aion\n\n';
  const summary = `## Resumen de la Vigilia Eterna\n\n`;
  const flows = `### Flujos Perpetuos\n${Object.entries(state.flows).map(([flow, data]) =>
    `- **${flow}**: ${data.active ? 'Activo' : 'Inactivo'} (última ejecución: ${data.lastRun || 'Nunca'})`
  ).join('\n')}\n\n`;

  const risks = `### Índices de Riesgo Global\n${Object.entries(state.riskIndices).map(([country, data]) =>
    `- **${country}**: ${data.riskScore.toFixed(1)} (${data.level})`
  ).join('\n')}\n\n`;

  const activity = `### Feed de Actividad\n${state.activityFeed.slice(0, 50).map((entry, i) =>
    `${i + 1}. ${entry.message || entry}`
  ).join('\n')}\n\n`;

  return header + summary + flows + risks + activity;
}

export function emitEvent(msg) {
  publish(msg);
}

export default {
  getState,
  start,
  stop,
  clearState,
  generateReport,
  emitEvent,
};
