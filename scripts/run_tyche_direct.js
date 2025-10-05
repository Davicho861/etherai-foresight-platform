import { orchestrator } from '../server/src/orchestrator.js';

(async () => {
  const missionId = 'local-tyche-test-' + Date.now();
  console.log('Starting mission', missionId);
  await orchestrator.startMission(missionId, { id: 'genesis-tyche', title: 'Test Tyche' }, (log) => {
    console.log('LOG:', log);
  });
  console.log('Mission finished');
})();
