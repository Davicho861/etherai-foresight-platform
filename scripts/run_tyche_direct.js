import { kernel } from '../server/src/orchestrator.js';

(async () => {
  const missionId = 'local-tyche-test-' + Date.now();
  console.log('Starting mission', missionId);
  await kernel.startMission(missionId, {
    id: 'andes-water-crisis',
    title: 'Crisis Hídrica en el Altiplano Andino',
    description: 'Generar un informe de inteligencia sobre la crisis hídrica inminente en la región del altiplano andino y descubrir políticas de mitigación óptimas.'
  }, (log) => {
    console.log('LOG:', log);
  });
  console.log('Mission finished');
})();
