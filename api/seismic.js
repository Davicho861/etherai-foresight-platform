export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Simulación de datos sísmicos procesados
    const processedData = {
      timestamp: new Date().toISOString(),
      activity: [
        {
          location: 'Pacific Ring of Fire',
          magnitude: 4.2,
          depth: 10.5,
          riskLevel: 'low'
        },
        {
          location: 'Andes Mountains',
          magnitude: 5.8,
          depth: 15.2,
          riskLevel: 'medium'
        }
      ],
      totalEvents: 2,
      lastUpdate: new Date().toISOString()
    };

    res.json(processedData);
  } catch (error) {
    console.error('Error in seismic activity route:', error);
    res.status(500).json({ error: 'Failed to retrieve seismic activity.' });
  }
}