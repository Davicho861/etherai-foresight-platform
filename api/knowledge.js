import MetatronAgent from '../server/src/agents.js';
import { publish } from '../server/src/eventHub.js';

// Función serverless para Knowledge Flow
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('[Knowledge] Kairós escaneando fuentes de datos para oportunidades');

  const _timestamp = new Date().toISOString();
    // Publicar evento
    publish(`Conocimiento: Kairós escaneando oportunidades`);

    // Simular consulta a Kairós
    const oracle = new MetatronAgent('Oracle');
    const kairosResult = await oracle.consultKairos();

    // Si detecta oportunidad, proponer misión
    if (kairosResult.opportunities && kairosResult.opportunities.length > 0) {
      publish(`Conocimiento: Nueva oportunidad detectada - ${kairosResult.opportunities[0]}`);
      // Aquí podría iniciar una misión automáticamente, pero para serverless, solo publicar
    }

    console.log('[Knowledge] Escaneo completado');
    res.status(200).json({ status: 'Knowledge cycle completed', opportunities: kairosResult.opportunities || [] });
  } catch (error) {
    console.error('[Knowledge] Error:', error.message);
    res.status(500).json({ error: 'Knowledge flow failed', details: error.message });
  }
}