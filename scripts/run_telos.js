import { MetatronAgent } from '../server/src/agents.js';

async function runTelos() {
  try {
    const telos = new MetatronAgent('Telos');
    const result = await telos.run();
    console.log('Telos Result:', JSON.stringify(result, null, 2));

    // Extraer la primera misión estratégica
    if (result.strategicMissions && result.strategicMissions.length > 0) {
      const firstMission = result.strategicMissions[0];
      console.log('First Strategic Mission:', JSON.stringify(firstMission, null, 2));

      // Crear missionContract para ejecutar esta misión
      const missionContract = {
        id: firstMission.id,
        title: firstMission.title,
        description: firstMission.description,
        parameters: { priority: firstMission.priority }
      };

      console.log('Mission Contract for Execution:', JSON.stringify(missionContract, null, 2));
    }
  } catch (error) {
    console.error('Error running Telos:', error);
  }
}

runTelos();