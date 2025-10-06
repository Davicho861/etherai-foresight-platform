import { kernel } from '../server/src/orchestrator.js';

const missionContract = {
  "id": "prophecy-001-latam-social-climate",
  "goal": "Generar un informe de inteligencia predictiva sobre el riesgo de inestabilidad social en tres países clave de LATAM (Colombia, Perú, Argentina) para los próximos 6 meses, correlacionando datos climáticos extremos (Open Meteo), indicadores socioeconómicos (World Bank API) y eventos de conflicto social (GDELT API)."
};

const logCallback = (log) => {
  console.log(`[${log.taskId}] ${log.description} - Status: ${log.status}`);
};

kernel.startMission(missionContract.id, missionContract, logCallback).then(() => {
  console.log('Misión completada.');
}).catch((error) => {
  console.error('Error en la misión:', error);
});